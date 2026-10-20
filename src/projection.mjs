import {taskContext, validId} from './project.mjs';

export const projectionKey = 'dsh-fish-office.activity';
const short = value => typeof value === 'string' ? value.slice(0, 160) : '';
const argsOf = value => { try { return typeof value === 'string' ? JSON.parse(value) : value || {}; } catch { return {}; } };
const relevant = new Set(['session/title','subagent/descriptor','subagent/catalog','turn/start','turn/end','step/end','approval/asked','approval/decided','tool/call','tool/result','tool/ptc-dispatch-start','tool/ptc-dispatch','user/message']);

/** Initialize JSON-only activity state without retaining prompts or tool output. */
export function initActivity(header, inherited = 0) {
  return {header:{id:header.id,title:short(header.title),origin:header.origin || null,parentSession:header.parentSession || header.lineage?.parentSessionId || null},inherited,
    calls:{},skills:[],children:[],dispatches:[],human:{count:0,latest:null},turn:0,turnStartedAt:null,lastToolError:null,activity:'整理思路中',approval:false,active:false,lastEnd:null,label:'',title:short(header.title),count:0};
}

/** Fold a committed event. Unrelated events preserve identity and cost no downstream work. */
export function foldActivity(previous, event) {
  if (event.seq < previous.inherited || !relevant.has(event.type)) return previous;
  const d=event.data || {}, source=d.message?.source || d.source, type=event.type;
  if(type==='user/message' && !['user','human','skill-invocation'].includes(source?.kind))return previous;
  const s={...previous,count:event.seq+1}, calls={...s.calls};
  if(type==='session/title')s.title=short(d.title || d.text)||s.title;
  if(type==='subagent/descriptor')s.label=short(d.label);
  if(type==='turn/start'){s.turn=event.seq;s.turnStartedAt=event.time;s.lastToolError=null;s.activity='整理思路中';s.approval=false;s.active=true;s.calls={};}
  if(type==='turn/end'){s.active=false;s.approval=false;s.calls={};s.lastEnd=d.reason?.kind||'unknown';}
  if(type==='step/end')s.calls={};
  if(type==='approval/asked')s.approval=true;
  if(type==='approval/decided')s.approval=false;
  if(type==='subagent/catalog' && validId(d.childId))s.children=[...s.children.filter(c=>c.id!==d.childId),{id:d.childId,label:short(d.label),mode:d.mode||null,createdAt:d.childCreatedAt||null}].slice(-256);
  if(type==='tool/call'||type==='tool/ptc-dispatch-start'){
    const nested=type==='tool/ptc-dispatch-start', name=short(d.name||d.toolName||d.tool),id=nested?d.subCallId:d.callId,input=argsOf(d.arguments??d.input);
    const context=String(input.command||input.cmd||input.description||input.name||'').slice(0,3000);
    s.activity=/skill/.test(name)?'查阅技能说明中':/test|pytest|验收|检查|check/i.test(name+' '+context)?'检查与验证中':/search|fetch|web|检索|搜索/i.test(name)?'查找资料中':/write|edit|patch/.test(name)?'编写与修改中':/read|glob|grep|list/.test(name)?'阅读与梳理中':/架构|architecture/i.test(context)?'整理架构中':/pwsh|shell|exec|terminal/.test(name)?'执行工具中':'整理思路中';
    if(id && /^[\w-]{1,180}$/.test(id)){calls[id]=name;s.calls=calls;}
    if(name==='skill')s.skills=[...s.skills,{seq:event.seq,turn:s.turn,name:short(input.name)||'skill',callId:id||null,ok:null}].slice(-24);
    if(/^(subagent|spawn_agent|start_subagent|delegate|send_message)$/.test(name))s.dispatches=[...s.dispatches,{seq:event.seq,turn:s.turn,tool:name,time:event.time,targets:[input.id,input.target,input.to,input.recipient_id,input.agent_id,input.targetId].filter(validId),context:taskContext(input.description||'')}].slice(-16);
  }
  if(type==='user/message' && ['user','human'].includes(source?.kind)){
    const m=d.message||d,text=typeof m.content==='string'?m.content:Array.isArray(m.content)?m.content.filter(b=>b.type==='text').map(b=>b.text||'').join('\n'):'';
    s.human={count:s.human.count+1,latest:{seq:event.seq,time:event.time,ordinal:s.human.count+1,...taskContext(text)}};
  }
  if(type==='user/message' && source?.kind==='skill-invocation')s.skills=[...s.skills,{seq:event.seq,turn:s.turn,name:short(source.name)||'skill',ok:true}].slice(-24);
  if(type==='tool/result'||type==='tool/ptc-dispatch'){
    const id=type==='tool/result'?d.message?.source?.callId:d.subCallId;delete calls[id];s.calls=calls;
    if(!Object.keys(calls).length)s.activity='整理思路中';
    const failed=!!(d.message?.isError||d.isError||d.error||d.status==='error');
    if(failed)s.lastToolError={seq:event.seq,time:event.time};
    s.skills=s.skills.map(skill=>skill.callId&&skill.callId===id?{...skill,ok:!failed}:skill);
  }
  return s;
}

/** Return only display metadata; live running status is supplied by lifecycle events. */
export function activityView(s, running=s.active){
  const title=s.label||s.title,tools=running?[...new Set(Object.values(s.calls))]:[];
  return {id:s.header.id,parentId:s.header.parentSession,origin:s.header.origin,title,
    state:running?s.approval||tools.some(n=>/ask.*user|approval/.test(n))?'waiting':'working':'idle',turn:s.turn,tools,
    skills:s.skills,dispatches:s.dispatches,children:s.children,human:s.human,turnStartedAt:s.turnStartedAt,lastToolError:s.lastToolError,
    activity:running?s.activity:'空闲',task:taskContext(title).topic==='本次任务'?(s.human.latest||taskContext(title)):taskContext(title),lastEnd:s.lastEnd,unclosed:s.active&&!running,eventCount:s.count};
}

// The registry requires a synchronous parser. State contains only the constrained
// JSON fields above; checkpoints are rejected rather than reused after shape drift.
const stateSchema={parse(s){if(!s||typeof s!=='object'||typeof s.header?.id!=='string'||!Number.isSafeInteger(s.human?.count)||!Array.isArray(s.skills)||!s.calls||typeof s.active!=='boolean')throw Error('Invalid fish-office projection checkpoint');return s;}};
const viewSchema={parse(v){if(!v||typeof v.id!=='string'||!Array.isArray(v.tools)||!Array.isArray(v.skills))throw Error('Invalid fish-office activity view');return v;}};
const views=new WeakMap();
export const activityProjection={key:projectionKey,stateVersion:1,stateSchema,init:initActivity,apply:foldActivity,wire:{viewSchema,view(s){let v=views.get(s);if(!v){v=activityView(s);views.set(s,v);}return v;}}};

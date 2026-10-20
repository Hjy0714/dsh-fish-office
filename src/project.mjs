import {activityView,projectionKey} from './projection.mjs';
// Read only the selected session tree. No prompts, tool output or credentials leave the Host.
// Root sessions use session-*; the installed DSH subagent runtime generates bare UUIDs.
export const validId = id => typeof id === 'string' && /^(?:session-[A-Za-z0-9-]{1,160}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(id);
const short = v => typeof v === 'string' ? v.slice(0, 160) : '';
const argsOf = v => { try { return typeof v === 'string' ? JSON.parse(v) : v || {}; } catch { return {}; } };
// Only a small controlled vocabulary reaches dialogue; original human prompts stay on the Host.
export function taskContext(text='') {
  const value=String(text).slice(0,12000),topics=[
    ['页面与界面',/页面|界面|网页|前端|UI|HTML|CSS|landing|frontend/i],
    ['代码实现',/代码|编程|接口|插件|程序|开发|bug|code|api/i],
    ['测试验收',/测试|验收|检查|核验|验证|review|test|qa/i],
    ['文案内容',/文案|写作|文章|内容|脚本|笔记|copywriting/i],
    ['方案策划',/策划|方案|规划|设计简报|brief|plan/i],
    ['资料研究',/检索|资料|搜索|研究|论文|search|research/i],
    ['数据分析',/数据|统计|图表|分析|data|chart/i]
  ];
  const tags=topics.filter(([,re])=>re.test(value)).map(([tag])=>tag).slice(0,2);
  const intent=/修复|报错|错误|故障|不对|bug|fix/i.test(value)?'修复':/优化|改进|调整|完善|polish|improv/i.test(value)?'优化':/继续|接着|补充|增加|新增|需求|再|follow/i.test(value)?'追加':'完成';
  return {topic:tags[0]||'本次任务',tags,intent,mentions:['小澜','泡泡','汐汐','蓝莓','咕噜','眠眠','策划','页面','验收','设计','文案','测试'].filter(n=>value.includes(n))};
}
const messageText = d => {const m=d.message||d;return typeof m.content==='string'?m.content:Array.isArray(m.content)?m.content.filter(b=>b.type==='text').map(b=>b.text||'').join('\n'):'';};
export function project(events, header, running = false, inherited = 0) {
  const calls = new Map(), skills = [], children = [], dispatches = [];
  const humanMessages=[];let humanCount=0,turnStartedAt=null,lastToolError=null,activity='整理思路中',approvalPending=false;
  let turn = 0, lastEnd = null, label = '', title=short(header.title), activeTurn = false;
  for (const e of events) {
    if (e.seq < inherited) continue;
    const d = e.data || {};
    if (e.type === 'session/title') title=short(d.title || d.text) || title;
    if (e.type === 'subagent/descriptor') label = short(d.label);
    if (e.type === 'turn/start') { turn = e.seq; turnStartedAt=e.time;lastToolError=null;activity='整理思路中';approvalPending=false;activeTurn = true; calls.clear(); }
    if (e.type === 'turn/end') { activeTurn = false;approvalPending=false;calls.clear(); lastEnd = d.reason?.kind || 'unknown'; }
    if(e.type==='approval/asked')approvalPending=true;
    if(e.type==='approval/decided')approvalPending=false;
    if (e.type === 'step/end') calls.clear();
    if (e.type === 'subagent/catalog' && validId(d.childId)) children.push({id:d.childId, label:short(d.label), mode:d.mode, createdAt:d.childCreatedAt});
    if (e.type === 'tool/call' || e.type === 'tool/ptc-dispatch-start') {
      const nested = e.type === 'tool/ptc-dispatch-start', name = short(d.name || d.toolName || d.tool);
      const callId = nested ? d.subCallId : d.callId, input = argsOf(d.arguments ?? d.input);
      const context=String(input.command||input.cmd||input.description||input.name||'').slice(0,3000);
      activity=/skill/.test(name)?'查阅技能说明中':/test|pytest|验收|检查|check/i.test(name+' '+context)?'检查与验证中':/search|fetch|web|检索|搜索/i.test(name)?'查找资料中':/write|edit|patch/.test(name)?'编写与修改中':/read|glob|grep|list/.test(name)?'阅读与梳理中':/架构|architecture/i.test(context)?'整理架构中':/pwsh|shell|exec|terminal/.test(name)?'执行工具中':'整理思路中';
      if (callId) calls.set(callId, name);
      if (name === 'skill') skills.push({seq:e.seq, turn, name:short(input.name) || 'skill', callId, ok:null});
      if (/^(subagent|spawn_agent|start_subagent|delegate|send_message)$/.test(name)) dispatches.push({seq:e.seq,turn,tool:name,time:e.time,targets:[input.id,input.target,input.to,input.recipient_id,input.agent_id,input.targetId].filter(validId),context:taskContext(input.description||'')});
    }
    const source=d.message?.source || d.source;
    if(e.type==='user/message'&&['user','human'].includes(source?.kind)){
      humanCount++;humanMessages.push({seq:e.seq,time:e.time,ordinal:humanCount,...taskContext(messageText(d))});
    }
    if (e.type === 'user/message' && source?.kind === 'skill-invocation') skills.push({seq:e.seq, turn, name:short(source.name) || 'skill', ok:true});
    if (e.type === 'tool/result' || e.type === 'tool/ptc-dispatch') {
      const id = e.type === 'tool/result' ? d.message?.source?.callId : d.subCallId;
      calls.delete(id);
      if(!calls.size)activity='整理思路中';
      if(d.message?.isError||d.isError||d.error||d.status==='error')lastToolError={seq:e.seq,time:e.time};
      const skill = skills.findLast(s => s.callId && s.callId === id);
      if (skill) skill.ok = !(d.message?.isError || d.isError || d.error || d.status === 'error');
    }
  }
  // A cold log with an open turn is interrupted/unknown, never proof of live work.
  const state = running ? approvalPending||[...calls.values()].some(n => /ask.*user|approval/.test(n)) ? 'waiting' : 'working' : 'idle';
  return {id:header.id, parentId:header.parentSession || header.lineage?.parentSessionId || null,
    origin:header.origin || null, title:label || title, state, turn,
    tools:running ? [...new Set(calls.values())].filter(Boolean) : [],
    skills:skills.slice(-24), dispatches:dispatches.slice(-16), children,
    human:{count:humanCount,latest:humanMessages.at(-1)||null},turnStartedAt,lastToolError,activity:running?activity:'空闲',task:taskContext(label||title).topic==='本次任务'?(humanMessages.at(-1)||taskContext(label||title)):taskContext(label||title),
    lastEnd, unclosed:activeTurn && !running, eventCount:events.length};
}

export function createReader(ctx, options={}) {
  const cold = new Map(), liveCache = new WeakMap();
  async function read(id) {
    const live = ctx.sessions.get(id), running = options.isRunning?options.isRunning(id):ctx.agents.get(id)?.status === 'running';
    if (live) {
      if(ctx.sessionProjections){
        const state=ctx.sessionProjections.stateOf(live,projectionKey);
        if(!state)throw Error('Fish Office activity projection is not registered');
        return activityView(state,running);
      }
      const events = live.snapshotEvents(), key = `${events.length}:${running}`;
      const old = liveCache.get(live); if (old?.key === key) return old.row;
      const row = project(events, {...live.header,id}, running, live.inheritedEventCount || 0);
      liveCache.set(live,{key,row}); return row;
    }
    const old = cold.get(id); if (old && Date.now()-old.at < 2000) return old.row;
    const handle = await ctx.sessionPersistence.open(id,'read');
    try {
      const data = await handle.read(), row = project(data.events,{...handle.header,id},false,handle.inheritedEventCount || 0);
      if (cold.size >= 80) cold.delete(cold.keys().next().value);
      cold.set(id,{at:Date.now(),row}); return row;
    } finally { await handle.close(); }
  }
  const scoped=async selectedId => {
    if (!validId(selectedId)) throw Error('无效会话 ID');
    let root = await read(selectedId), parents = new Set([selectedId]);
    while (root.origin === 'subagent' && validId(root.parentId) && !parents.has(root.parentId) && parents.size < 16) {
      parents.add(root.parentId); root = await read(root.parentId);
    }
    const rows = [], warnings = [], queue = [{row:root, depth:0}], seen = new Set();
    while (queue.length && rows.length < 64) {
      const {row,depth} = queue.shift(); if (seen.has(row.id)) continue;
      seen.add(row.id); rows.push({...row,depth});
      const known = new Map(row.children.map(c=>[c.id,c]));
      for (const s of ctx.sessions.list()) if (s.header?.origin === 'subagent' && s.header.parentSession === row.id) known.set(s.id || s.header.id,{id:s.id || s.header.id});
      if (depth >= 8) { if (known.size) warnings.push('子智能体层级超过 8，已截断'); continue; }
      for (const child of known.values()) {
        if (seen.has(child.id) || !validId(child.id)) continue;
        if (child.mode === 'external') { warnings.push(`外部智能体 ${child.label || child.id} 无本地动作日志`); continue; }
        try { const next = await read(child.id); if (next.parentId !== row.id) { warnings.push('忽略父子关系不一致的会话'); continue; } queue.push({row:{...next,title:next.title || child.label},depth:depth+1}); }
        catch { warnings.push(`暂时无法读取子智能体 ${child.label || child.id}`); }
      }
    }
    if (queue.length) warnings.push('超过 64 个会话，仅显示前 64 个');
    return {ok:true,version:'0.4.0',source:'DSH live session logs',at:Date.now(),selectedId,rootId:root.id,agents:rows,warnings};
  };
  scoped.row=read;return scoped;
}

// Aggregate every live DSH session, irrespective of selection, workspace or skills.
// A per-host retained tree keeps completed children visible long enough to settle animations.
export function createGlobalReader(ctx,options={}){
 const scoped=createReader(ctx,options),retained=new Map();let inFlight;
 async function collect(selectedId){
  const roots=new Set(),warnings=[],live=ctx.sessions.list();
  for(const s of live){const h=s.header||{},id=s.id||h.id;if(!validId(id))continue;if(h.origin!=='subagent')roots.add(id);}
  if(validId(selectedId)){try{roots.add((await scoped(selectedId)).rootId);}catch{warnings.push('当前选中会话暂时不可读');}}
  const rows=new Map(),now=Date.now();
  for(const id of roots){try{const tree=await scoped(id);for(const r of tree.agents)rows.set(r.id,{...r,rootId:tree.rootId});warnings.push(...tree.warnings);}catch{warnings.push('一个会话暂时不可读，保留上次状态');}}
  // Live children are authoritative even beyond a retained tree's history/depth cap.
  for(const s of live){const id=s.id||s.header?.id;if(validId(id)&&!rows.has(id))try{rows.set(id,await scoped.row(id));}catch{warnings.push('一个运行会话暂时不可读');}}
  for(const [id,r]of rows)if(!r.rootId){let top=r;const visited=new Set();while(top.parentId&&rows.has(top.parentId)&&!visited.has(top.id)){visited.add(top.id);top=rows.get(top.parentId);}rows.set(id,{...r,rootId:top.id});}
  for(const r of rows.values())retained.set(r.id,{row:r,at:now});
  for(const [id,item] of retained)if(!rows.has(id)){
   try{const r={...await scoped.row(id),rootId:item.row.rootId};item.row=r;if(!r.unclosed){rows.set(id,r);if(now-item.at>30000)retained.delete(id);continue;}}catch{}
   if(['working','waiting','unknown'].includes(item.row.state)||item.row.unclosed)rows.set(id,{...item.row,state:'unknown',tools:[]});
   else if(now-item.at<30000)rows.set(id,item.row);else retained.delete(id);
  }
  return {ok:true,version:'0.4.0',scope:'all',rootId:'office-global',selectedId:validId(selectedId)?selectedId:null,at:now,agents:[...rows.values()],roots:[...roots],warnings:[...new Set(warnings)],source:'DSH all live sessions'};
 }
 return selectedId=>{if(inFlight)return inFlight;inFlight=collect(selectedId).finally(()=>{inFlight=null;});return inFlight;};
}

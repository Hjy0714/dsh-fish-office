import {test} from 'node:test';import assert from 'node:assert/strict';
import {project,createReader,createGlobalReader,validId,taskContext} from '../src/project.mjs';
const event=(seq,type,data={})=>({seq,type,data,time:1000+seq});

test('pending approval keeps a task waiting, and a resolved approval resumes work',()=>{
 const e=[event(1,'turn/start'),event(2,'tool/call',{name:'pwsh',callId:'p'}),event(3,'approval/asked',{id:'p'})];assert.equal(project(e,{id:'session-approval'},true).state,'waiting');e.push(event(4,'approval/decided',{id:'p'}));assert.equal(project(e,{id:'session-approval'},true).state,'working');e.push(event(5,'turn/end',{reason:{kind:'completed'}}));assert.equal(project(e,{id:'session-approval'},false).state,'idle');
});

test('global feed includes simultaneous unrelated ordinary tasks and subagents without skills',async()=>{
 const rows=[
  {id:'session-a',header:{id:'session-a'},events:[event(1,'user/message',{source:{kind:'user'},content:'普通问答'}),event(2,'turn/start')]},
  {id:'session-b',header:{id:'session-b'},events:[event(1,'turn/start'),event(2,'tool/call',{name:'pwsh',callId:'b',arguments:{command:'python -m pytest'}})]},
  {id:'session-c',header:{id:'session-c',origin:'subagent',parentSession:'session-b'},events:[event(1,'turn/start')]}
 ];
 const live=rows.map(r=>({...r,snapshotEvents:()=>r.events})),ctx={sessions:{get:id=>live.find(r=>r.id===id),list:()=>live},agents:{get:()=>({status:'running'})},sessionPersistence:{open:()=>{throw Error('not needed')}}};
 const read=createGlobalReader(ctx),a=await read('session-a'),b=await read('session-b');assert.equal(a.scope,'all');assert.deepEqual(new Set(a.agents.map(r=>r.id)),new Set(rows.map(r=>r.id)));assert.equal(a.agents.find(r=>r.id==='session-b').activity,'检查与验证中');assert.equal(a.agents.every(r=>r.skills.length===0),true);assert.deepEqual(a.agents.map(r=>r.id),b.agents.map(r=>r.id));
});

test('global feed never drops live children beyond the historical 64-session tree limit',async()=>{
 const live=Array.from({length:72},(_,i)=>({id:i?'session-child-'+i:'session-root',header:i?{id:'session-child-'+i,origin:'subagent',parentSession:'session-root'}:{id:'session-root'},snapshotEvents:()=>[event(1,'turn/start')]}));
 const ctx={sessions:{get:id=>live.find(s=>s.id===id),list:()=>live},agents:{get:()=>({status:'running'})},sessionPersistence:{open:()=>{throw Error('not used')}}};
 const r=await createGlobalReader(ctx)('session-root');assert.equal(r.agents.length,72);assert(r.agents.every(s=>s.rootId==='session-root'));
});
test('only human input counts as new demand; context exposes controlled labels, not prompt text',()=>{
 const events=[event(0,'turn/start'),event(1,'user/message',{source:{kind:'user'},content:[{type:'text',text:'请小澜与泡泡修复网页 SECRET-CONTENT-123'}]}),event(2,'user/message',{source:{kind:'runtime-context'},content:'not human'}),event(3,'user/message',{source:{kind:'agent-message'},content:'employee report'}),event(4,'user/message',{source:{kind:'subagent-settled'},content:'finished'}),event(5,'turn/start'),event(6,'user/message',{message:{source:{kind:'human'},content:'继续优化测试验收'}})];
 const r=project(events,{id:'session-demands'},true);assert.equal(r.human.count,2);assert.equal(r.human.latest.ordinal,2);assert.equal(r.human.latest.seq,6);assert.equal(r.human.latest.topic,'测试验收');assert.equal(r.human.latest.intent,'优化');assert.ok(!JSON.stringify(r).includes('SECRET-CONTENT'));assert.deepEqual(taskContext('请小澜与泡泡修复网页').mentions,['小澜','泡泡']);
});
test('accept actual DSH UUID children and prefixed root IDs; reject paths and malformed IDs',()=>{
 for(const id of ['session-f2272135-5ec5-47cc-9305-6f382833dc47','63a694e1-c2d6-43df-8161-283720f1c0ed'])assert.equal(validId(id),true);
 for(const id of ['../../secrets','not-a-uuid','session-../x','63a694e1-c2d6-43df-8161-283720f1c0ed/evil'])assert.equal(validId(id),false);
});
test('completed and interrupted logs are idle, pending tools cleared',()=>{
 const e=[event(0,'turn/start'),event(1,'tool/call',{callId:'a',name:'pwsh',arguments:{command:'secret data'}})];
 const r=project(e,{id:'session-root'},false);assert.equal(r.state,'idle');assert.deepEqual(r.tools,[]);assert.equal(r.unclosed,true);assert.ok(!JSON.stringify(r).includes('secret data'));
});
test('native skill + nested PTC skill + slash invocation; failed skills marked',()=>{
 const e=[event(0,'turn/start'),event(1,'tool/call',{callId:'a',name:'skill',arguments:'{"name":"design-brief"}'}),event(2,'tool/result',{message:{source:{callId:'a'},isError:true}}),event(3,'tool/ptc-dispatch-start',{subCallId:'b',name:'skill',arguments:{name:'frontend-design'}}),event(4,'tool/ptc-dispatch',{subCallId:'b',name:'skill',isError:false}),event(5,'user/message',{message:{source:{kind:'skill-invocation',name:'design-review'}}})];
 const r=project(e,{id:'session-child'},true);assert.deepEqual(r.skills.map(s=>[s.name,s.ok]),[['design-brief',false],['frontend-design',true],['design-review',true]]);assert.deepEqual(r.tools,[]);
});
test('exclude inherited parent skill and catalog events',()=>{
 const r=project([event(0,'subagent/catalog',{childId:'session-other'}),event(1,'tool/call',{name:'skill',arguments:{name:'wrong'}}),event(2,'subagent/descriptor',{label:'own'}),event(3,'tool/call',{name:'skill',arguments:{name:'right'}})],{id:'session-child'},true,2);
 assert.equal(r.children.length,0);assert.deepEqual(r.skills.map(s=>s.name),['right']);assert.equal(r.title,'own');
});
test('durable closed children, scope isolation, follow parent, close read handles',async()=>{
 const sessions=new Map([
 ['session-root',{id:'session-root',header:{id:'session-root'},snapshotEvents:()=>[event(0,'subagent/catalog',{childId:'session-child',label:'design'}),event(1,'subagent/catalog',{childId:'session-forged'})]}],
 ['session-unrelated',{id:'session-unrelated',header:{id:'session-unrelated'},snapshotEvents:()=>[]}]]);
 let closed=0;
 const ctx={sessions:{get:id=>sessions.get(id),list:()=>[...sessions.values()]},agents:{get:()=>null},sessionPersistence:{open:async id=>({header:{id,origin:'subagent',parentSession:id==='session-child'?'session-root':'session-wrong'},read:async()=>({events:[]}),close:async()=>closed++})}};
 const read=createReader(ctx),r=await read('session-child');assert.equal(r.rootId,'session-root');assert.deepEqual(r.agents.map(r=>r.id),['session-root','session-child']);assert.equal(r.warnings.length,1);assert.equal(closed,2);
});

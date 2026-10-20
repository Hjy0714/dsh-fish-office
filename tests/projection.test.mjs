import {test} from 'node:test';
import assert from 'node:assert/strict';
import {project,createReader} from '../src/project.mjs';
import {initActivity,foldActivity,activityView,activityProjection} from '../src/projection.mjs';
const event=(seq,type,data={})=>({seq,type,data,time:1000+seq});

test('incremental activity agrees with the previous reader through task/skill/approval transitions',()=>{
 const header={id:'session-incremental',title:'插件测试'},events=[
  event(0,'user/message',{source:{kind:'user'},content:'请修复插件 SECRET-PROMPT'}),event(1,'turn/start'),
  event(2,'tool/call',{name:'skill',callId:'s1',arguments:{name:'test-design'}}),event(3,'tool/result',{message:{source:{callId:'s1'}}}),
  event(4,'tool/ptc-dispatch-start',{name:'pwsh',subCallId:'c1',arguments:{command:'npm test SECRET-COMMAND'}}),
  event(5,'approval/asked'),event(6,'approval/decided'),event(7,'tool/ptc-dispatch',{subCallId:'c1',isError:true}),
  event(8,'turn/end',{reason:{kind:'completed'}})
 ];let state=initActivity(header);
 for(let i=0;i<events.length;i++){state=foldActivity(state,events[i]);for(const running of [false,true]){const actual=activityView(state,running),expected=project(events.slice(0,i+1),header,running);assert.deepEqual(actual,expected);}}
 assert(!JSON.stringify(state).includes('SECRET-'));assert.doesNotThrow(()=>JSON.stringify(state));
});
test('ignored events and wire views retain identity; inherited events are excluded',()=>{
 const initial=initActivity({id:'session-fork'},3);
 assert.equal(foldActivity(initial,event(1,'tool/call',{name:'secret'})),initial);
 assert.equal(foldActivity(initial,event(4,'assistant/stream',{text:'secret'})),initial);
 assert.equal(activityProjection.wire.view(initial),activityProjection.wire.view(initial));
 assert.throws(()=>activityProjection.stateSchema.parse({}),/checkpoint/);
});
test('live readers use registered projection state and lifecycle status without replaying logs',async()=>{
 let state=foldActivity(initActivity({id:'session-native'}),event(0,'turn/start')),running=true;
 const session={id:'session-native',header:{id:'session-native'},snapshotEvents(){throw Error('must not replay');}};
 const ctx={sessions:{get:()=>session},agents:{get(){throw Error('must not poll agent status');}},sessionProjections:{stateOf:()=>state}};
 const read=createReader(ctx,{isRunning:()=>running});assert.equal((await read.row('session-native')).state,'working');
 running=false;assert.equal((await read.row('session-native')).state,'idle');
 state=foldActivity(state,event(1,'turn/end',{reason:{kind:'completed'}}));assert.equal((await read.row('session-native')).unclosed,false);
});

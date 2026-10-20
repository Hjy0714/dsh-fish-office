import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {apply} from '../src/host.mjs';
import {initActivity,foldActivity} from '../src/projection.mjs';

test('Host registers the projection and reads running state from lifecycle notifications',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'fish-office-host-'));
 const disposers=[],events=new Map(),session={id:'session-host',header:{id:'session-host'},snapshotEvents(){throw Error('unexpected replay');}};
 let definition,route,seeding=true;
 const state=foldActivity(initActivity(session.header),{seq:0,type:'turn/start',time:1000,data:{}});
 const ctx={effect(fn){const d=fn();if(typeof d==='function')disposers.push(d);},on(n,f){events.set(n,f);},
  sessions:{get:()=>session,list:()=>[session]},agents:{get(){assert(seeding,'status must not be polled after activation');return {status:'idle'};}},
  sessionProjections:{register(d){definition=d;return()=>{definition=null;};},stateOf(_s,key){assert.equal(key,definition.key);return state;}},
  connection:{fetch:{register(r){route=r;return()=>{route=null;};}}},sessionPersistence:{open(){throw Error('unexpected cold read');}}};
 try{
  apply(ctx,{directory});seeding=false;assert(definition);assert(events.has('agent/status'));
  async function snapshot(){const response=await route.fetch(new Request('http://localhost/api/fish-office',{method:'POST',body:JSON.stringify({rpcId:'host-test',payload:{op:'global-snapshot',sessionId:session.id}})}));return (await response.json()).result.value;}
  assert.equal((await snapshot()).agents[0].state,'idle');
  events.get('agent/status')({agent:{id:session.id},status:'running'});assert.equal((await snapshot()).agents[0].state,'working');
  events.get('agent/disposed')({agent:{id:session.id}});assert.equal((await snapshot()).agents[0].state,'idle');
  events.get('agent/created')({agent:{id:session.id,status:'running'}});assert.equal((await snapshot()).agents[0].state,'working');
  const response=await route.fetch(new Request('http://localhost/api/fish-office',{method:'POST',body:JSON.stringify({rpcId:'scene-test',payload:{op:'scene'}})}));
  const scene=(await response.json()).result.value;assert(scene.ok&&scene.scene&&scene.assets&&scene.defaults.OfficeDialogueDefaults&&scene.defaults.OfficeProfileDefaults);
 }finally{
  disposers.reverse().forEach(fn=>fn());assert.equal(definition,null);assert.equal(route,null);
  const resolved=path.resolve(directory);assert(resolved.startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(resolved,{recursive:true,force:true});
 }
});

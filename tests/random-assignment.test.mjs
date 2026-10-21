import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function office(random){
 const agents=Array.from({length:7},(_,index)=>({id:index?'crew-'+(index-1):'chief',index}));
 const api={agents,elapsed:0,settings:{},occupancy:new Map()};
 const context=vm.createContext({performance:{now:()=>0},createOfficeDialogue:()=>({ingest(){}})});
 vm.runInContext(fs.readFileSync(new URL('../src/global-controller.js',import.meta.url),'utf8')+';this.make=createOfficeController;',context);
 return {api,agents,controller:context.make(api,{},random)};
}
const row=id=>({id,state:'working',skills:[]});
const snapshot=agents=>({ok:true,at:0,agents});

test('a single new task can randomly select any of the six workers',()=>{
 const selected=[];
 for(let i=0;i<6;i++){
  const {agents,controller}=office(()=>(i+.5)/6);
  controller.ingest(snapshot([row('task')]));
  selected.push(agents.find(a=>a.liveSession==='task').id);
  controller.ingest(snapshot([row('task')]));
  assert.equal(agents.find(a=>a.liveSession==='task').id,selected.at(-1));
 }
 assert.deepEqual(selected,Array.from({length:6},(_,i)=>'crew-'+i));
});

test('random allocation never steals an active worker or assigns two tasks to one worker',()=>{
 const {agents,api,controller}=office(()=>.99),tasks=Array.from({length:6},(_,i)=>row('task-'+i));
 controller.ingest(snapshot(tasks));
 const original=new Map(agents.slice(1).map(a=>[a.id,a.liveSession]));
 assert.equal(new Set(original.values()).size,6);
 const extra=row('extra');controller.ingest(snapshot([...tasks,extra]));
 assert.equal(controller.overflow,1);
 for(const a of agents.slice(1))assert.equal(a.liveSession,original.get(a.id));
 const released=agents[3],finished=tasks.find(t=>t.id===released.liveSession);finished.state='idle';api.elapsed=10;
 controller.ingest(snapshot([...tasks,extra]));
 assert.equal(released.liveSession,'extra');assert.equal(controller.overflow,0);
 for(const a of agents.slice(1).filter(a=>a!==released))assert.equal(a.liveSession,original.get(a.id));
});

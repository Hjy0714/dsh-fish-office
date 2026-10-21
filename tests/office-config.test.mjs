import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import vm from 'node:vm';
import {createOfficeConfig,validateProfiles} from '../src/office-config.mjs';
async function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'fish-config-')),dir=path.join(root,'config');
 fs.mkdirSync(path.join(root,'src'));fs.mkdirSync(dir);
 fs.copyFileSync(new URL('../src/office-config.mjs',import.meta.url),path.join(root,'src','office-config.mjs'));
 for(const name of ['员工档案.json','对白库.json'])fs.copyFileSync(new URL('../config/'+name,import.meta.url),path.join(dir,name));
 const {createOfficeConfig}=await import((await import('node:url')).pathToFileURL(path.join(root,'src','office-config.mjs')));
 return {root,dir,service:createOfficeConfig('/ignored/external/path')};
}
test('only package config is read, JSON edits reload, and invalid edits retain last valid values',async()=>{
 const {root,dir,service}=await fixture();
 try{
 const initial=service.read(),file=path.join(dir,'对白库.json');assert.equal(path.resolve(service.directory),dir);assert.equal(service.saveProfile,undefined);
 const changed=structuredClone(initial.dialogue);changed.日常.空闲问候=['你好，喝咖啡吗？'];fs.writeFileSync(file,JSON.stringify(changed));assert.deepEqual(service.read().dialogue.日常.空闲问候,changed.日常.空闲问候);
 fs.writeFileSync(file,'{bad json');const invalid=service.read();assert.match(invalid.warning,/对白库/);assert.deepEqual(invalid.dialogue,changed);
 fs.writeFileSync(file,JSON.stringify(changed));assert.equal(service.read().warning,'');
 const profiles=structuredClone(initial.profiles);profiles.员工[1].姓名='小蓝鲸';profiles.员工[1].岗位='研发与测试';fs.writeFileSync(path.join(dir,'员工档案.json'),JSON.stringify(profiles));assert.deepEqual(service.read().profiles,profiles);
 }finally{fs.rmSync(root,{recursive:true});}
});
test('structural validation rejects duplicate IDs and empty dialogue lists without overwriting JSON',async()=>{
 const {root,dir,service}=await fixture();
 try{
 const first=service.read(),bad=structuredClone(first.profiles);bad.员工[1].id='chief';assert.throws(()=>validateProfiles(bad),/重复/);
 const d=structuredClone(first.dialogue);d.日常.空闲问候=[];fs.writeFileSync(path.join(dir,'对白库.json'),JSON.stringify(d));assert.match(service.read().warning,/空闲问候/);assert.deepEqual(service.read().dialogue,first.dialogue);
 }finally{fs.rmSync(root,{recursive:true});}
});
test('dialogue templates use renamed actors and live topics, and manager branches remain functional',()=>{
 const defaults=JSON.parse(fs.readFileSync(new URL('../config/对白库.json',import.meta.url),'utf8')),actors=[{id:'chief',name:'大鲸主管',chief:true,index:0},...Array.from({length:6},(_,i)=>({id:'crew-'+i,index:i+1,name:i?'同事'+i:'蓝鲸同学',liveSession:i?null:'session-a',liveState:i?'idle':'working',action:i?'idle':'work',phase:'loop'}))];
 let elapsed=0;const api={agents:actors,get elapsed(){return elapsed},visualPoint:a=>({x:a.index*200,y:100}),actorMetrics:()=>({height:100})};
 const context=vm.createContext({window:{OfficeDialogueDefaults:defaults}});vm.runInContext(fs.readFileSync(new URL('../src/global-dialogue.js',import.meta.url),'utf8')+';this.make=createOfficeDialogue',context);const dialogue=context.make(api);
 const custom=structuredClone(defaults);custom.事件.首次开工='任务：{任务}；请{员工}开始。';custom.主管.常规=['{员工}，推进{任务}。'];custom.工作.代码界面=['{员工}正在处理{任务}。'];dialogue.configure(custom);
 const row={id:'session-a',state:'working',turn:1,task:{topic:'代码实现'},human:{latest:{seq:1,time:1000,topic:'代码实现'}}};const data={at:1000,agents:[row]};dialogue.ingest(data);dialogue.tick();assert.match(dialogue.history[0].text,/蓝鲸同学/);assert.match(dialogue.history[0].text,/代码实现/);
 for(elapsed=1;elapsed<90;elapsed++)dialogue.tick();assert(dialogue.history.some(h=>h.kind==='supervisor'&&h.text==='蓝鲸同学，推进代码实现。'));assert(dialogue.history.some(h=>h.kind==='work-talk'&&h.text==='蓝鲸同学正在处理代码实现。'));
 row.state='waiting';data.at=2000;dialogue.ingest(data);for(;elapsed<150;elapsed++)dialogue.tick();assert(dialogue.history.some(h=>h.text.includes('蓝鲸同学在等主人确认')));
 row.state='working';row.lastToolError={time:2000};dialogue.ingest(data);for(;elapsed<210;elapsed++)dialogue.tick();assert(dialogue.history.some(h=>h.text.includes('刚才的报错')));assert(!dialogue.history.some(h=>/\{(员工|任务|活动|同事)\}/.test(h.text)));
});

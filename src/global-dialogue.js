function createOfficeDialogue(api,hooks={}){

 let config=window.OfficeDialogueDefaults;
 function text(key,vars={},index=0){const get=o=>key.split('.').reduce((v,k)=>v?.[k],o);let value=get(config)??get(window.OfficeDialogueDefaults);if(Array.isArray(value))value=value[index%value.length];return String(value??'').replace(/\{(员工|任务|活动|同事)\}/g,(m,k)=>vars[k]??({员工:'同事',任务:'本次任务',活动:'整理思路中',同事:'同事'})[k]);}

 function format(value,vars={}){return String(value??'').replace(/\{(员工|任务|活动|同事)\}/g,(m,k)=>vars[k]??({员工:'同事',任务:'本次任务',活动:'整理思路中',同事:'同事'})[k]);}
 const personal=a=>(config.角色专属??window.OfficeDialogueDefaults.角色专属??{})[a.id];
 function exchangeChoice(a,b,scene,vars={}){
  const bank=config.问答组??window.OfficeDialogueDefaults.问答组??{},own=personal(a)?.问答组||{};let groups=[...Object.entries(bank).map(([id,p])=>({id:'公共.'+id,p})),...Object.entries(own).map(([id,p])=>({id:a.id+'.'+id,p}))].filter(g=>g.p.场景?.includes(scene));
  if(scene==='主管督促'&&JSON.stringify(config.主管?.常规)!==JSON.stringify(window.OfficeDialogueDefaults.主管?.常规)){const compatible=groups.filter(g=>g.p.发起引用==='主管.常规');if(compatible.length)groups=compatible;}
  if(!groups.length)return null;const g=groups[sequence++%groups.length],pick=rows=>rows[(sequence++ +a.index)%rows.length],state=['working','waiting','unknown'].includes(b.liveState)?'忙碌':'空闲',lines=g.p.回应[state]||g.p.回应.空闲;
  return {pairId:g.id,line:format(pick(g.p.发起引用?g.p.发起引用.split('.').reduce((v,k)=>v?.[k],config)||g.p.发起:g.p.发起),{员工:b.name,同事:b.name,...vars}),reply:format(pick(lines),{员工:b.name,同事:a.name,...vars}),replyBank:g.p.回应,replyVars:{员工:b.name,同事:a.name,...vars}};
 }
 function exchange(a,b,scene,vars={},kind='greeting'){
  const choice=exchangeChoice(a,b,scene,vars);if(!choice)return false;
  const exchangeId='exchange-'+(++utterances),line=kind==='greeting'?text('日常.称呼问候',{同事:b.name,活动:choice.line}):choice.line;
  if(!say(a,line,kind,kind==='supervisor'?5:4,2,{exchangeId,pairId:choice.pairId,recipient:b.id}))return false;
  const replyTo=history.at(-1).id;queue(b,choice.reply,kind+'-reply',2.1,2,4,{exchangeId,pairId:choice.pairId,replyTo,recipient:a.id,replyBank:choice.replyBank,replyVars:choice.replyVars});return true;
 }
 const actors=api.agents,cursors=new Map(),bubbles=new Map(),history=[],pending=[],states=new Map(),demands=new Map(),pairCooldown=new Map(),talkAt=new Map(),idleTalkAt=new Map(),socialAt=new Map();
 let utterances=0;let data=null,welcomed=false,nextManager=18,nextSocial=1,nextIdle=0,sequence=0;const now=()=>api.elapsed;
 const names=as=>as.length<3?as.map(a=>a.name).join('与'):as.slice(0,-1).map(a=>a.name).join('、')+'与'+as.at(-1).name;
 const rowFor=id=>data?.agents.find(r=>r.id===id),working=()=>actors.slice(1).filter(a=>['working','waiting'].includes(a.liveState));
 const rootOf=r=>{const seen=new Set();while(r?.parentId&&!seen.has(r.id)){seen.add(r.id);const p=rowFor(r.parentId);if(!p)break;r=p;}return r?.rootId||r?.id;};
 function say(a,text,kind='notice',duration=4.2,priority=1,meta={}){
  const old=bubbles.get(a.id);if(old&&old.until>now()&&old.priority>=priority)return false;
  if(!a.chief&&bubbles.size>=4&&!old){const expendable=[...bubbles.values()].filter(b=>b.priority<priority).sort((x,y)=>x.at-y.at)[0];if(!expendable)return false;bubbles.delete(expendable.actor);}
  const entry={id:'speech-'+(++utterances),...meta,actor:a.id,session:a.liveSession||null,text,kind,at:now(),until:now()+duration,priority};bubbles.set(a.id,entry);history.push({...entry});if(history.length>600)history.shift();talkAt.set(a.id,now()+16+(a.index*7+sequence++)%13);idleTalkAt.set(a.id,now()+65+(a.index*11+sequence*7)%46);api.announce?.(a.chief?'管理 · '+a.name:a.name,text);hooks.speech?.(entry);return true;
 }
 function queue(a,text,kind,delay=0,priority=2,duration=4.6,meta={}){pending.push({actor:a.id,text,kind,at:now()+delay,expires:now()+delay+(meta.exchangeId?10:35),priority,duration,meta});if(pending.length>60)pending.splice(0,pending.length-60);}
 function ingest(snapshot){
  data=snapshot;
  for(const r of snapshot.agents){
   const h=r.human?.latest,root=rootOf(r);
   if(h&&root===r.id){
    const seen=cursors.get(r.id),fresh=snapshot.at-h.time<90000&&snapshot.at>=h.time-1000;
    if(h.seq>(seen??-1)&&(seen!==undefined||fresh&&['working','waiting'].includes(r.state))){
     cursors.set(r.id,h.seq);hooks.cursor?.({rootId:r.id,seq:h.seq});
     const initial=!welcomed;welcomed=true;
     const assigned=actors.slice(1).filter(a=>{const row=rowFor(a.liveSession);return rootOf(row)===r.id&&['working','waiting'].includes(row?.state);});
     const label=assigned.length?names(assigned):'待分配的同事',topic=h.topic||'本次任务',vars={员工:label,任务:topic};
     queue(actors[0],initial?text('事件.首次开工',vars):text('事件.追加任务',vars),initial?'opening':'new-task',0,8,5);
     for(const [i,a]of assigned.entries())queue(a,text(initial?'事件.首次回应':'事件.追加回应',{员工:a.name,任务:topic},i),'ack',initial?1.8:2.2,5,3);
     demands.set(r.id,{seq:h.seq,time:h.time,context:h,announced:new Set(assigned.map(a=>a.id)),at:now()});
    }else if(seen===undefined)cursors.set(r.id,h.seq);
   }else if(!h&&!cursors.has(r.id))cursors.set(r.id,-1);
   const old=states.get(r.id);
   if(old&&['working','waiting'].includes(old.state)&&r.state==='idle'&&r.lastEnd==='completed'){
    const a=actors.find(a=>a.liveSession===r.id);if(a){queue(a,text('事件.完成任务'),'complete',.5,3,4);queue(actors[0],text('事件.完成回应',{员工:a.name}),'complete-response',4.8,2);}
   }
   states.set(r.id,{state:r.state,turn:r.turn});
  }
  for(const [root,d]of demands){
   const fresh=actors.slice(1).filter(a=>{const r=rowFor(a.liveSession);return rootOf(r)===root&&['working','waiting'].includes(r?.state)&&!d.announced.has(a.id);});
   if(fresh.length&&now()-d.at>1.4){for(const a of fresh)d.announced.add(a.id);queue(actors[0],text('事件.追加分工',{员工:names(fresh),任务:d.context.topic||'本次任务'}),'assignment',0,4);for(const a of fresh)queue(a,text('事件.分工回应'),'ack',2,3,3);}
  }
 }
 function taskLine(a,r){
  const topic=r?.task?.topic||r?.human?.latest?.topic||'本次任务',activity=r?.activity||'整理思路中';
  const key=r?.state==='waiting'?'等待确认':a.action==='book'?'查阅技能':activity==='检查与验证中'?'检查验证':activity==='查找资料中'?'查找资料':['代码实现','页面与界面'].includes(topic)?'代码界面':['方案策划','文案内容','数据分析','资料研究'].includes(topic)?topic:'通用';
  const own=personal(a)?.工作独白;if(own?.length&&sequence%3===0)return format(own[(sequence++)%own.length],{员工:a.name,任务:topic,活动:activity});
  return text('工作.'+key,{员工:a.name,任务:topic,活动:activity},sequence++ +a.index);
 }
 function tick(){
  for(const [id,b]of bubbles)if(b.until<=now())bubbles.delete(id);
  for(let i=pending.length-1;i>=0;i--)if(pending[i].expires<now())pending.splice(i,1);
  const candidates=pending.filter(p=>p.at<=now()).sort((a,b)=>b.priority-a.priority||a.at-b.at);
  for(const p of candidates){const a=actors.find(a=>a.id===p.actor);if(!a)continue;const {replyBank,replyVars,...meta}=p.meta||{};let line=p.text;if(replyBank){const state=['working','waiting','unknown'].includes(a.liveState)?'忙碌':'空闲',rows=replyBank[state]||replyBank.空闲;line=format(rows[(utterances+a.index)%rows.length],{...replyVars,员工:a.name,同事:actors.find(b=>b.id===meta.recipient)?.name||replyVars?.同事});meta.responseState=state;}if(say(a,line,p.kind,p.duration,p.priority,meta))pending.splice(pending.indexOf(p),1);}
  const workers=working();
  if(workers.length&&now()>=nextManager&&!bubbles.has(actors[0].id)){
   const a=workers[sequence%workers.length],r=rowFor(a.liveSession),topic=r?.task?.topic||'当前任务';
   const managerText=r?.state==='waiting'?text('主管.等待确认',{员工:a.name,任务:topic}):r?.lastToolError&&data.at-r.lastToolError.time<45000?text('主管.工具报错',{员工:a.name,任务:topic}):text('主管.常规',{员工:a.name,任务:topic},sequence++);
   if(r?.state==='waiting'||r?.lastToolError&&data.at-r.lastToolError.time<45000||!exchange(actors[0],a,'主管督促',{任务:topic},'supervisor'))say(actors[0],managerText,'supervisor',5,2);nextManager=now()+25+(sequence%4)*6;
  }
  for(const a of workers){
   const r=rowFor(a.liveSession);
   if(now()<(talkAt.get(a.id)||10+a.index*4)||bubbles.has(a.id))continue;
   if(a.phase==='loop'&&['work','book'].includes(a.action))say(a,taskLine(a,r),'work-talk',4.3,1);
  }
  if(now()>=nextSocial){nextSocial=now()+.25;
   let found=false;for(let i=1;i<actors.length&&!found;i++)for(let j=i+1;j<actors.length&&!found;j++){
    let a=actors[i],b=actors[j];if((sequence+Math.floor(now()/3))%2)[a,b]=[b,a];const p=api.visualPoint(a),q=api.visualPoint(b),key=actors[i].id+':'+actors[j].id,d=Math.hypot(p.x-q.x,p.y-q.y);
    const reserved=id=>pending.some(p=>p.meta?.exchangeId&&(p.actor===id||p.meta.recipient===id));
    if(d>125||d<28||now()<(pairCooldown.get(key)||0)||now()<(socialAt.get(a.id)||0)||now()<(socialAt.get(b.id)||0)||reserved(a.id)||reserved(b.id)||[a,b].some(v=>bubbles.get(v.id)?.priority>=2||v.phase==='loop'&&v.action==='work'))continue;
    // Use physical feet for visibility: nearby sprites across a wall/desk must not chat through it.
    if(api.segmentSafe&&!api.segmentSafe({x:a.x,y:a.y},{x:b.x,y:b.y}))continue;
    const busy=[a,b].some(v=>['working','waiting','unknown'].includes(v.liveState));
    if(exchange(a,b,busy?'忙碌相遇':'空闲相遇',{},'greeting')){pairCooldown.set(key,now()+55);socialAt.set(a.id,now()+20);socialAt.set(b.id,now()+20);nextSocial=now()+4.5;found=true;}

   }
  }
  for(const a of actors.slice(1)){
   if(now()<nextIdle||['working','waiting','unknown'].includes(a.liveState)||now()<(idleTalkAt.get(a.id)??(50+a.index*11))||bubbles.has(a.id)||pending.some(p=>p.meta?.exchangeId&&(p.actor===a.id||p.meta.recipient===a.id)))continue;
   const own=personal(a)?.空闲独白,line=own?.length?format(own[(sequence++)%own.length],{员工:a.name}):text('日常.休闲自语',{员工:a.name},sequence++);
   if(line&&say(a,line,'leisure-talk',4.2,1))nextIdle=now()+18;
  }
  return false;
 }
 function render(ctx){
  const used=[];ctx.save();ctx.globalAlpha=1;ctx.font='20px "Microsoft YaHei",sans-serif';ctx.textBaseline='top';ctx.textAlign='left';
  for(const b of [...bubbles.values()].sort((a,b)=>b.priority-a.priority)){const a=actors.find(a=>a.id===b.actor);if(!a)continue;const p=api.visualPoint(a),head=p.y-api.actorMetrics(a).height-10,maxWidth=a.chief?360:250,lines=[];let line='';
   for(const c of b.text){if(line&&ctx.measureText(line+c).width>maxWidth-28){lines.push(line);line='';}line+=c;}if(line)lines.push(line);
   const w=Math.min(maxWidth,Math.max(92,...lines.map(t=>ctx.measureText(t).width+28))),h=lines.length*27+20,clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));let x=clamp(p.x-w/2,12,941-w-12),y=clamp(head-h-10,12,1672-h-28);
   const overlap=(xx,yy)=>used.some(r=>xx<r.x+r.w+7&&xx+w+7>r.x&&yy<r.y+r.h+7&&yy+h+7>r.y);
   for(const [dx,dy]of [[0,0],[-110,0],[110,0],[0,-h-12],[-180,-30],[180,-30]]){const xx=clamp(x+dx,12,941-w-12),yy=clamp(y+dy,12,1672-h-28);if(!overlap(xx,yy)){x=xx;y=yy;break;}}
   used.push({x,y,w,h});ctx.fillStyle='#08162188';ctx.fillRect(Math.round(x+4),Math.round(y+5),Math.ceil(w),h);ctx.fillStyle=a.chief?'#fff1ce':'#e7f6fc';ctx.strokeStyle='#263d58';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(Math.round(x),Math.round(y),Math.ceil(w),h,4);ctx.fill();ctx.stroke();
   const tx=clamp(p.x,x+14,x+w-14);ctx.beginPath();ctx.moveTo(tx-7,y+h-1);ctx.lineTo(tx+7,y+h-1);ctx.lineTo(clamp(p.x,tx-18,tx+18),y+h+10);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#20384d';lines.forEach((t,i)=>ctx.fillText(t,Math.round(x+14),Math.round(y+10+i*27)));
  }ctx.restore();
 }
 return {configure(value){if(value)config=value;},ingest,tick,render,say,exchange,exchangeChoice,history,bubbles,disconnected(){bubbles.clear();pending.length=0;},restore(items){for(const [id,seq]of Object.entries(items||{}))if(Number.isSafeInteger(seq)){cursors.set(id,seq);if(seq>=0)welcomed=true;}},get holding(){return false;},get huddle(){return null;},get demand(){return [...demands.values()].at(-1);}};
}

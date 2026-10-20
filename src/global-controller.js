function createOfficeController(api,hooks={},random=()=>Math.random()){
 const actors=api.agents,records=new Map(),audit=[];
 const leisureProfiles=new Map(),facilityLastStart=new Map();
 const leisureRules={idle:{weight:6,hold:[.18,.18],cooldown:0},coffee:{weight:.8,hold:[8,12],cooldown:180},pond:{weight:1.5,hold:[7,11],cooldown:100},rest:{weight:1.2,hold:[10,16],cooldown:90},bench:{weight:1.5,hold:[12,19],cooldown:75},chair:{weight:1.5,hold:[12,19],cooldown:75}};
 const leisureProfile=a=>{if(!leisureProfiles.has(a.id))leisureProfiles.set(a.id,{cooldown:{},recent:[],mustStroll:false,strollOrigin:null});return leisureProfiles.get(a.id);};
 let data=null,connected=false,lastAt=0,nextTick=0,serial=0,overflow=0;
 const active=r=>['working','waiting','unknown'].includes(r?.state);
 const note=(a,event,detail)=>{audit.push({at:api.elapsed,actor:a.id,session:a.liveSession||null,event,detail});if(audit.length>2500)audit.shift();hooks.audit?.(audit.at(-1));};
 const busy=a=>a.phase!=='loop'||a.queue||a.trip||a.goal||a.pending;
 const dialogue=createOfficeDialogue(api,{speech:hooks.speech,cursor:hooks.cursor});
 api.settings.auto=false;
 // Starting the office must never depend on how fast DSH returns its first snapshot.
 const startupUntil=api.elapsed+.5;let startupWall=performance.now(),startupReleased=false;
 function cancelQueue(a){
  if(a.phase!=='loop'||a.trip||a.goal)return false;const t=a.queue?.target;if(t&&t.id!==a.spot?.id&&api.occupancy.get(t.id)===a.index)api.occupancy.delete(t.id);a.queue=null;a.pending=null;a.leisureQueuedAt=null;a.routeFailed=false;a.dispatchAt=0;return true;
 }
 function idlePoint(a,officeOnly=false){
  for(let i=0;i<10;i++){
   const angle=random()*Math.PI*2,d=75+random()*185;
   const x=i<7?a.x+Math.cos(angle)*d:195+random()*540,y=i<7?a.y+Math.sin(angle)*d:(officeOnly?330+random()*600:440+random()*880);
   if(officeOnly&&(y<330||y>965))continue;
   const p=api.world.nearest(x,y,24);
   if(!p||!api.walkable(p.x,p.y)||Math.hypot(p.x-a.x,p.y-a.y)<58||api.world.spots.some(s=>Math.hypot(s.anchor.x-p.x,s.anchor.y-p.y)<48)||actors.some(b=>b!==a&&Math.hypot((b.goal?.target.anchor.x??b.x)-p.x,(b.goal?.target.anchor.y??b.y)-p.y)<48))continue;
   return p;
  }return null;
 }
 function nearbyStroll(a){
  const base=random()*Math.PI*2;
  for(let i=0;i<12;i++){
   const angle=base+i*Math.PI/6,d=i<6?64:40,p=api.world.nearest(a.x+Math.cos(angle)*d,a.y+Math.sin(angle)*d,14);
   if(!p||Math.hypot(p.x-a.x,p.y-a.y)<25||!api.segmentSafe(a,p)||api.world.spots.some(s=>Math.hypot(s.anchor.x-p.x,s.anchor.y-p.y)<28))continue;
   const dx=p.x-a.x,dy=p.y-a.y;
   if(actors.some(b=>{if(b===a||b.sit>.1)return false;const q=api.visualPoint(b),t=Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(a.x+dx*t-q.x,a.y+dy*t-q.y)<(api.traffic?.clearance(a,b)??(a.chief||b.chief?15:14));} ))continue;
   if(takeLeisure(a,'idle',p)){a.preferLocalStroll=false;return true;}
  }return false;
 }
 function cancelFreePlanning(a){
  if(a.phase!=='loop'||!a.queue||a.trafficResumeTarget===a.queue.target.id)return;
  if(a.routeFailed||api.elapsed-(a.leisureQueuedAt??api.elapsed)>.45){cancelQueue(a);a.preferLocalStroll=true;}
 }
 function takeLeisure(a,action,point=null,explicit=null){
  if(!api.request(a,action,point,true,explicit))return false;
  if(a.pending||(a.phase==='loop'&&a.queue&&a.routeFailed)){cancelQueue(a);return false;}
  const p=leisureProfile(a),rule=leisureRules[action];a.freeUntil=0;a.leisureHold=rule.hold[0]+random()*(rule.hold[1]-rule.hold[0]);a.leisureQueuedAt=api.elapsed;
  if(action==='idle'){p.strollOrigin={x:a.x,y:a.y};}
  else{p.cooldown[action]=api.elapsed+rule.cooldown+random()*45;p.recent.push(action);p.recent=p.recent.slice(-2);p.mustStroll=true;p.strollOrigin=null;facilityLastStart.set(action,api.elapsed);}
  note(a,'leisure',action);return true;
 }
 function leisure(a,force=false){
  if(busy(a)||(!force&&api.elapsed+1e-8<(a.freeUntil||0)))return false;
  if(!a.startupDeparture&&a.action!=='work'&&a.action!=='read'&&a.loopTime<(a.action==='idle'?.18:(a.leisureHold??.18)))return false;
  if(a.preferLocalStroll&&nearbyStroll(a))return true;
  if(a.startupDeparture||a.action==='work'){
   const s=api.world.spots.find(s=>s.id===a.home),dx=a.chief?45:(a.index%2?-95:110),p=api.world.nearest(s.anchor.x+dx,s.anchor.y,40);
   if(p&&takeLeisure(a,'idle',p)){a.startupDeparture=false;note(a,'departure','leave-desk');return true;}
  }
  const p=leisureProfile(a);
  if(p.strollOrigin&&Math.hypot(a.x-p.strollOrigin.x,a.y-p.strollOrigin.y)>=40){p.mustStroll=false;p.strollOrigin=null;}
  // Weighted sampling without replacement. A real stroll separates facility visits;
  // personal cooldowns/recent history prevent coffee-seat-coffee loops.
  const pool=Object.entries(leisureRules).filter(([action])=>action==='idle'||!p.mustStroll&&!p.recent.includes(action)&&api.elapsed>=(p.cooldown[action]||0)&&(action!=='coffee'||api.elapsed-(facilityLastStart.get(action)??-Infinity)>=22));
  const choices=[];while(pool.length){let n=random()*pool.reduce((sum,[,rule])=>sum+rule.weight,0),i=0;for(;i<pool.length-1;i++){n-=pool[i][1].weight;if(n<=0)break;}choices.push(pool.splice(i,1)[0][0]);}
  for(const action of choices){
   if(action==='idle'){for(let i=0;i<3;i++){const p=idlePoint(a);if(p&&takeLeisure(a,'idle',p))return true;}}
   else{const spots=api.world.spots.filter(s=>s.action===action&&!api.occupancy.has(s.id));if(!spots.length)continue;const spot=spots[Math.floor(random()*spots.length)];if(takeLeisure(a,action,null,spot.id))return true;}
  }
  return nearbyStroll(a);
 }
 const manager={mode:null,until:0,forceBoard:false,previous:null};
 function bind(a,r){
  a.liveSession=r.id;a.liveState=r.row.state;a.job=r.row.title||'DSH 任务';a.tool=r.row.tools?.join(' · ')||(r.row.state==='working'?'整理思路中':'等待输入');r.actor=a.id;hooks.bind?.(a,r.row);
 }
 function ingest(next){
  if(!next?.ok||!Array.isArray(next.agents))return false;
  data=next;connected=true;lastAt=api.elapsed;
  for(const row of next.agents){
   let r=records.get(row.id);const initial=!r;if(!r){r={id:row.id,row,actor:null,high:-1,skills:[],stage:null,seen:new Set(),order:serial++,lastActive:api.elapsed};records.set(row.id,r);}
   const before=r.row;if(active(row))r.lastActive=api.elapsed;
   const human=row.human?.latest;if(human&&human.seq>(r.humanSeq??-1)){if((!initial&&before.human?.latest?.seq!==human.seq)||(initial&&next.at-human.time<60000&&row.state==='working'))manager.forceBoard=true;r.humanSeq=human.seq;}
   // Only actual observed skills create a library visit. Ordinary tasks go straight to work.
   for(const s of row.skills||[])if(s.ok!==false&&!r.seen.has(s.seq)&&s.seq>r.high&&(!initial||row.state==='working'&&s.turn===row.turn)){r.skills.push(s);r.seen.add(s.seq);note(actors.find(a=>a.id===r.actor)||actors[0],'skill-event',s.name);}
   r.high=Math.max(r.high,...(row.skills||[]).map(s=>s.seq),-1);r.row=row;r.missing=false;r.missingSince=null;
  }
  const ids=new Set(next.agents.map(r=>r.id));
  for(const r of records.values())if(!ids.has(r.id)&&active(r.row)){r.missing=true;r.missingSince??=api.elapsed;r.row={...r.row,state:'unknown',tools:[]};}
  // Stable identities: a change of selected conversation never clears assignments.
  for(const a of actors.slice(1)){const r=records.get(a.liveSession);if(r)bind(a,r);}
  const waiting=[...records.values()].filter(r=>!r.actor&&(active(r.row)||r.skills.length)).sort((a,b)=>a.order-b.order);
  for(const r of waiting){
   const a=actors.slice(1).find(a=>!a.liveSession)||actors.slice(1).find(a=>{const old=records.get(a.liveSession);return old&&!active(old.row)&&api.elapsed-old.lastActive>4;});
   if(!a)break;const old=records.get(a.liveSession);if(old){old.actor=null;old.stage=null;old.skills=[];}if(a.queue){const t=a.queue.target;if(t.id!==a.spot?.id&&t.id!==a.goal?.target.id&&t.id!==a.trip?.target.id&&api.occupancy.get(t.id)===a.index)api.occupancy.delete(t.id);a.queue=null;}a.pending=null;bind(a,r);note(a,'assignment',r.row.task?.topic||'本次任务');
  }
  overflow=[...records.values()].filter(r=>!r.actor&&active(r.row)).length;
  actors[0].liveState=[...records.values()].some(r=>active(r.row))?'working':'idle';actors[0].liveSession=null;actors[0].job='管理 / 全局任务统筹';
  dialogue.ingest({...next,agents:[...records.values()].map(r=>r.row)});
  hooks.status?.({connected:true,rootId:'office-global',data:next,overflow});return true;
 }
 function manage(a,hasWork){
  if(a.startupDeparture){leisure(a,true);return;}
  if(!hasWork){manager.mode=null;a.liveStage=null;leisure(a,a.action==='work'||a.action==='read');return;}
  a.liveStage='全局统筹 · '+({read:'白板安排',work:'主管工位',patrol:'办公室巡场'}[manager.mode]||'安排任务');
  if(busy(a))return;
  if(manager.mode&&a.action===({read:'read',work:'work',patrol:'idle'}[manager.mode])&&a.loopTime<3)return;
  if(!manager.forceBoard&&manager.mode&&api.elapsed<manager.until)return;
  let mode=manager.forceBoard||!manager.mode?'read':['work','patrol','read'].filter(m=>m!==manager.mode)[Math.floor(random()*2)];manager.forceBoard=false;
  let ok=false;if(mode==='patrol'){const p=idlePoint(a,true);ok=p&&api.request(a,'idle',p,true);}else ok=api.request(a,mode,null,true,mode==='work'?a.home:undefined);
  if(ok){manager.previous=manager.mode;manager.mode=mode;manager.until=api.elapsed+({read:12,work:24,patrol:17}[mode])+random()*8;note(a,'supervise',mode);}
 }
 function disconnected(reason='DSH 连接中断'){connected=false;dialogue.disconnected();hooks.status?.({connected:false,rootId:'office-global',data,error:reason,overflow});}
 function tick(){
  if(!startupReleased){
   if(window.OFFICE_TEST_SYNC_NAV?api.elapsed+1e-8<startupUntil:performance.now()-startupWall<500)return;
   startupReleased=true;for(const a of actors)a.freeUntil=Math.min(a.freeUntil||0,api.elapsed);
  }
  if(api.elapsed<nextTick)return;nextTick=api.elapsed+.1;api.settings.auto=false;
  if(connected&&api.elapsed-lastAt>18)disconnected('DSH 数据暂未更新，保留现场并重连');
  // Dialogue never blocks simulation or cancels another task's route.
  if(connected)dialogue.tick();
  const hasWork=[...records.values()].some(r=>active(r.row));actors[0].liveState=hasWork?(connected?'working':'offline'):connected?'idle':'offline';
  if(!hasWork)cancelFreePlanning(actors[0]);
  manage(actors[0],hasWork);
  for(const a of actors.slice(1)){
   const r=records.get(a.liveSession),row=r?.row,working=!!r&&active(row);
   a.liveState=!connected?'offline':row?.state||'idle';
   // Power belongs to the task lifetime, including skill visits, walking and awaiting input.
   api.setScreenPower?.(a.index-1,!!r&&(working||!connected&&r.powerOn));if(connected&&r)r.powerOn=working;
   if(a.phase==='loop'&&(a.queue||a.pending)&&(!a.trafficResumeTarget||a.trafficResumeTarget!==a.queue?.target.id)&&!r?.stage&&(working||r?.skills.length||api.elapsed-(a.leisureQueuedAt??api.elapsed)>8))cancelQueue(a);
   if(!working&&!r?.stage)cancelFreePlanning(a);
   if(busy(a))continue;
   if(!connected&&r&&active(row)){a.liveStage='连接中断 · 保留任务';continue;}
   if(!r){a.liveStage=null;leisure(a,a.action==='work');continue;}
   if(r.stage){const s=r.stage;if(a.action===s.action&&(a.loopTime||0)>=s.hold){note(a,'stage-complete',s.action);r.stage=null;a.liveStage=null;if(s.action==='book')r.workTail=working;else r.workTail=false;}else continue;}
   if(r.skills.length){const skill=r.skills.shift();r.stage={action:'book',hold:3};a.liveStage='查阅 skills · '+skill.name;api.skillBooks[a.index].title=skill.name;api.request(a,'book',null,true);note(a,'skill-visit',skill.name);continue;}
   if(working){
    if(row.state==='waiting'){a.liveStage='等待主人确认 · 保留工位';if(a.action!=='work')api.request(a,'work',null,true);continue;}
    if(a.action!=='work'){r.stage={action:'work',hold:2};a.liveStage='前往工位 / 办公';api.request(a,'work',null,true);note(a,'office','work');}
    else a.liveStage=row.activity||'整理思路中';
   }else{a.liveStage=null;r.workTail=false;leisure(a,a.action==='work'||a.action==='book');}
  }
  // Completed inactive metadata can be dropped; running tasks are never evicted for a selected chat.
  for(const [id,r]of records)if(!r.actor&&!active(r.row)&&api.elapsed-r.lastActive>180)records.delete(id);
  hooks.tick?.();
 }
 for(const a of actors){
  a.liveState='idle';a.freeUntil=startupUntil;a.startupDeparture=true;
  // Spawn standing at each chair's safe approach point, not inside its seated rail.
  if(a.spot&&api.occupancy.get(a.spot.id)===a.index)api.occupancy.delete(a.spot.id);
  a.spot=null;a.sit=0;a.dock=0;a.action='idle';a.state='idle';a.dir='front';a.previousDir='front';a.turnBlend=1;a.loopTime=0;
 }
 note(actors[0],'startup','standing 0.5 seconds, then local departures');
 return {ingest,tick,disconnected,audit,records,dialogue,manager,leisureProfiles,leisureRules,armStartupClock(){if(!startupReleased)startupWall=performance.now();},get startupWall(){return startupWall;},get startupUntil(){return startupUntil;},get connected(){return connected;},get rootId(){return 'office-global';},get data(){return data;},get overflow(){return overflow;}};
}
if(typeof module!=='undefined')module.exports={createOfficeController};

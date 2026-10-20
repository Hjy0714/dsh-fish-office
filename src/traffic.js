// Small foot discs, dynamic global routes and reciprocal local steering.
// Furniture/wall clearance remains the independently measured static walk mask.
const trafficTuning={footRadius:7,chiefFootRadius:8,planningMargin:2,lookAhead:25};
const trafficStats={steeredSteps:0,localReplans:0,stepAsides:0,resumedGoals:0,routeRepairs:0,shortcuts:0,deadlocks:0,orderedRetreats:0};
const footRadius=a=>a.chief?trafficTuning.chiefFootRadius:trafficTuning.footRadius;
const bodyClearance=(a,b)=>footRadius(a)+footRadius(b);
function trafficNote(a,event,detail={}){trafficEvents.push({at:elapsed,id:a.id,event,...detail});if(trafficEvents.length>400)trafficEvents.shift();}
function dispatch(a){
 if(a.trafficRetreat||!a.queue||a.phase!=='loop'||trafficClaims.has(a.index)||elapsed<Math.max(a.dispatchAt||0,a.trafficYieldUntil||0))return false;
 const route=travelRoute(a,a.queue.target.anchor);if(!route){a.routeFailed=!world.pathPending?.(a.id);if(!a.routeFailed)a.dispatchAt=elapsed+.05;return false;}a.routeFailed=false;a.dispatchAt=elapsed+.1;
 if(a.trafficResumeTarget){if(a.trafficResumeTarget===a.queue.target.id)trafficStats.resumedGoals++;a.trafficResumeTarget=null;}
 trafficClaims.set(a.index,route);a.waitTime=0;a.trip={...a.queue,route};a.queue=null;
 if(a.sit>.01)phase(a,'rise',.7);
 else if(['coffee','pond','read','book'].includes(a.action)){a.exitArm=armPose(a);phase(a,'finish-action',a.action==='book'?.9:.55);}
 else if(a.dock>0&&a.spot?.rail)phase(a,'undock',railDuration(a.spot));
 else{release(a,a.spot);a.spot=null;startTravel(a);}
 return true;
}
function predictedBody(b){const p=bodyPoint(b),next=b.phase==='walking'&&b.path?.[0];if(!next)return p;const dx=next.x-p.x,dy=next.y-p.y,d=Math.hypot(dx,dy),step=Math.min(d,(b.speed||0)*.18);return d?{x:p.x+dx/d*step,y:p.y+dy/d*step}:p;}
function blockers(a){
 const out=[];
 for(const b of agents){
  if(b===a||b.sit>.1)continue;
  const p=predictedBody(b),radius=bodyClearance(a,b)+trafficTuning.planningMargin;
  out.push({...p,id:b.id,yieldable:b.phase==='walking'||idleCanYield(b),radius:Math.min(radius,Math.max(.01,dist(a,p)-.05))});
 }
 return out;
}
function travelRoute(a,target){
 const start={x:a.x,y:a.y},avoid=blockers(a);
 const straight=world.segmentSafe(start,target),direct=straight?[start,{x:target.x,y:target.y}]:null;
 if(direct&&avoid.every(q=>pointSegment(q,start,target)>=q.radius))return direct;
 const sync=a.startupDeparture||window.OFFICE_TEST_SYNC_NAV;
 const route=sync?world.path(start,target,avoid):world.planPath(a.id,start,target,avoid);
 if(route){const length=route.slice(1).reduce((n,p,i)=>n+dist(route[i],p),0);if(direct&&length>dist(start,target)*1.6+32&&avoid.filter(q=>pointSegment(q,start,target)<q.radius).every(q=>q.yieldable))return direct;return route;}
 if(world.pathPending?.(a.id))return null;
 // A blocked temporary endpoint must not strand the actor at its starting point.
 // Approach safely on the static route; local avoidance asks an idle blocker to move.
 return direct||(sync?world.path(start,target,[]):world.planPath(a.id+'.static',start,target,[]));
}
function startTravel(a){
 if(!a.trip&&!a.queue){trafficClaims.delete(a.index);phase(a,'loop');return;}
 const command=a.trip||a.queue;if(!a.trip)a.queue=null;a.trip=null;
 if(!reserve(a,command.target)){trafficClaims.delete(a.index);a.state='idle';a.action='idle';phase(a,'loop');return;}
 const route=command.route||travelRoute(a,command.target.anchor);
 if(!route){a.goal=command;a.state='waiting';a.path=[];a.speed=0;a.repathAt=elapsed+.25;phase(a,'yield');return;}
 a.goal=command;a.path=route.slice(1);a.spot=null;a.sit=0;a.dock=0;a.speed=0;
 if(!a.trafficResumeTarget)a.trafficJourneyAt=elapsed;
 if(a.path.length){faceVector(a,a.path[0].x-a.x,a.path[0].y-a.y);phase(a,'walking');}else arrive(a);
}
function bodyPoint(a){return a.spot?.rail?railPoint(a.spot,a.dock):{x:a.x,y:a.y};}
function trafficDetour(a,p,route,leader=null){
 // A second recovery must retain the real task, not replace it with the first
 // temporary sidestep. Its facility reservation remains owned by this actor.
 const old=a.trafficResumeTarget&&a.queue?a.queue:a.goal;if(!old)return false;
 if(a.goal?.target.temporary&&a.goal.target!==old.target)release(a,a.goal.target);
 if(a.spot?.temporary&&a.spot!==old.target)release(a,a.spot);
 trafficClaims.delete(a.index);a.goal=null;a.trip=null;a.queue=null;a.pending=null;a.path=[];a.spot=null;a.sit=0;a.dock=0;a.action='idle';a.state='idle';a.speed=0;a.dispatchAt=0;phase(a,'loop');
 const target={id:'traffic-step-'+a.id+'-'+elapsed.toFixed(3),action:'idle',anchor:p,face:a.dir,temporary:true,name:'侧让位置'};
 reserve(a,target);a.goal={action:'idle',target,quiet:true};a.path=route.slice(1);trafficClaims.set(a.index,route);phase(a,'walking');
 delete old.route;a.queue=old;a.trafficResumeTarget=old.target.id;a.trafficYieldUntil=elapsed+(leader?2.2:(a.index%2?1.5:.4));a.leisureHold=.18;a.freeUntil=0;
 if(leader){a.trafficWaitFor=leader.id;a.trafficLeaseUntil=elapsed+6;trafficStats.orderedRetreats++;}
 a.trafficProbe=null;trafficStats.localReplans++;trafficNote(a,leader?'ordered-retreat':'local-yield-escape',{keepsTask:true,target:old.target.id,leader:leader?.id,parking:{x:p.x,y:p.y}});return true;
}
function retreatForTraffic(a,leader){
 if(a.trafficRetreat)return true;
 const origin=bodyPoint(a),lp=bodyPoint(leader),base=Math.atan2(origin.y-lp.y,origin.x-lp.x),target=leader.goal?.target.anchor;
 const corridor=target&&world.segmentSafe(lp,target)?[lp,target]:[lp,...(leader.path||[])];
 const routeGap=p=>{let gap=Infinity;for(let i=1;i<corridor.length;i++)gap=Math.min(gap,pointSegment(p,corridor[i-1],corridor[i]));return Number.isFinite(gap)?gap:dist(p,lp);};
 const avoid=agents.filter(b=>b!==a&&b.sit<.1).map(b=>({...bodyPoint(b),radius:Math.min(bodyClearance(a,b),Math.max(.01,dist(origin,bodyPoint(b))-.05))}));let best=null;const candidates=[];
 for(const distance of [24,40,64,88,112])for(const turn of [0,.5,-.5,1,-1,1.6,-1.6,2.2,-2.2,Math.PI]){
  const p=world.nearest(origin.x+Math.cos(base+turn)*distance,origin.y+Math.sin(base+turn)*distance,10);
  if(!p||dist(origin,p)<16||dist(p,lp)<30||avoid.some(q=>dist(p,q)<q.radius+1))continue;
  const gap=routeGap(p);if(gap<bodyClearance(a,leader)+5)continue;
  const score=Math.min(gap,45)*1.2-dist(origin,p)*.4+dist(p,lp)*.05;
  if(!candidates.some(c=>dist(c.p,p)<8))candidates.push({p,score});
  if(!world.segmentSafe(origin,p)||avoid.some(q=>pointSegment(q,origin,p)<q.radius))continue;
  if(!best||score>best.score)best={p,score};
 }
 if(best)return trafficDetour(a,best.p,[{x:origin.x,y:origin.y},best.p],leader);
 if(!candidates.length)return false;
 a.trafficRetreat={leader:leader.id,start:{x:origin.x,y:origin.y},avoid,candidates:candidates.sort((b,c)=>c.score-b.score).slice(0,8),at:elapsed};
 a.repathAt=elapsed+.5;phase(a,'yield');return true;
}
const trafficReversals=new Map();
function reverseTrafficPriority(a,leader){
 const key=[a.id,leader.id].sort().join('|');if(elapsed-(trafficReversals.get(key)??-Infinity)<4)return false;
 trafficReversals.set(key,elapsed);
 if(!retreatForTraffic(leader,a))return false;
 a.trafficPriorityUntil=elapsed+3;leader.trafficPriorityUntil=0;a.repathAt=elapsed+.05;
 trafficNote(a,'priority-reversed',{retreating:leader.id});return true;
}
function updateTrafficProgress(){
 for(const a of agents){
  if(a.trafficRetreat){const proposal=a.trafficRetreat,leader=agents.find(b=>b.id===proposal.leader),candidate=proposal.candidates[0];
   if(!candidate||!leader||elapsed-proposal.at>8){a.trafficRetreat=null;a.repathAt=elapsed+.05;if(leader)reverseTrafficPriority(a,leader);continue;}
   const owner=a.id+'.parking',route=window.OFFICE_TEST_SYNC_NAV?world.path(proposal.start,candidate.p,proposal.avoid):world.planPath(owner,proposal.start,candidate.p,proposal.avoid);
   if(route){a.trafficRetreat=null;trafficDetour(a,candidate.p,route,leader);continue;}
   if(!world.pathPending?.(owner))proposal.candidates.shift();a.repathAt=elapsed+.5;continue;
  }
  if(a.trafficWaitFor){const leader=agents.find(b=>b.id===a.trafficWaitFor);
   if(leader?.goal&&elapsed<a.trafficLeaseUntil&&dist(bodyPoint(a),bodyPoint(leader))<65)a.trafficYieldUntil=Math.max(a.trafficYieldUntil||0,elapsed+.2);
   else{a.trafficWaitFor=null;a.trafficLeaseUntil=0;}
  }
  if(!a.goal||!['walking','yield'].includes(a.phase)||a.sit>.1){a.trafficProbe=null;continue;}
  const key=a.goal.target.id,probe=a.trafficProbe;
  if(!probe||probe.key!==key){a.trafficProbe={key,at:elapsed,x:a.x,y:a.y,gait:a.gait||0};continue;}
  if(elapsed-probe.at<1.05)continue;
  const travelled=Math.abs((a.gait||0)-probe.gait),net=Math.hypot(a.x-probe.x,a.y-probe.y);a.trafficProbe={key,at:elapsed,x:a.x,y:a.y,gait:a.gait||0};
  if(net>=6||travelled<12&&a.phase!=='yield'||elapsed<(a.trafficRecoveryAt||0))continue;
  if(a.trafficResumeTarget){if(a.phase==='walking'){phase(a,'yield');a.repathAt=elapsed+.05;}continue;}
  const group=[a];for(let i=0;i<group.length;i++)for(const b of agents)if(!group.includes(b)&&(b.goal||b.trafficResumeTarget&&b.queue)&&['loop','walking','yield'].includes(b.phase)&&b.sit<.1&&dist(bodyPoint(group[i]),bodyPoint(b))<50)group.push(b);
  if(group.length<2){if(a.phase==='walking'&&agents.some(b=>b!==a&&b.sit<.1&&dist(bodyPoint(a),bodyPoint(b))<60)){phase(a,'yield');a.repathAt=elapsed+.05;}continue;}
  // One stable right of way for this encounter, rather than two simultaneous
  // replans. Older journeys win; the actor index breaks exact timing ties.
  group.sort((b,c)=>Number(!!b.trafficResumeTarget)-Number(!!c.trafficResumeTarget)||(b.trafficJourneyAt||0)-(c.trafficJourneyAt||0)||b.index-c.index);let leader=group[0],moved=false;
  for(const b of group.slice(1))if(retreatForTraffic(b,leader))moved=true;
  if(!moved&&group.length>1){moved=reverseTrafficPriority(group[1],leader);if(moved)leader=group[1];}
  if(moved){trafficStats.deadlocks++;leader.trafficPriorityUntil=elapsed+3;for(const b of group){b.trafficRecoveryAt=elapsed+2.5;b.trafficProbe=null;}trafficNote(leader,'right-of-way',{others:group.filter(b=>b!==leader).map(b=>b.id)});}
 }
}
function movementBlocked(a,next){return agents.some(b=>{if(b===a||b.sit>=.1)return false;const p=bodyPoint(b),limit=bodyClearance(a,b),current=dist(bodyPoint(a),p),future=dist(next,p);return future<limit-.001&&!(current<limit&&future>current+.00001);});}
function idleCanYield(b){return b.phase==='loop'&&b.action==='idle'&&!b.queue&&!b.goal&&!b.trip&&!b.pending&&!['working','waiting','unknown'].includes(b.liveState);}
function askIdleToMakeWay(a,hint=null){
 if(elapsed<(a.askYieldAt||0))return false;a.askYieldAt=elapsed+.35;
 const origin=bodyPoint(a),goal=hint||a.path?.[0]||a.goal?.target?.anchor;if(!goal)return false;
 const dx=goal.x-origin.x,dy=goal.y-origin.y,n=Math.hypot(dx,dy)||1,angle=Math.atan2(dy,dx);
 const redirectable=b=>b.makingWayFor===a.id&&elapsed<(b.makeWayUntil||0)&&['walking','yield'].includes(b.phase)&&b.goal?.action==='idle'&&b.goal.target.temporary&&!['working','waiting','unknown'].includes(b.liveState);
 const nearby=agents.filter(b=>b!==a&&(idleCanYield(b)||redirectable(b))&&elapsed>=(b.yieldRequestUntil||0)&&dist(origin,bodyPoint(b))<70&&pointSegment(bodyPoint(b),origin,{x:origin.x+dx/n*80,y:origin.y+dy/n*80})<bodyClearance(a,b)+6).sort((b,c)=>dist(origin,bodyPoint(b))-dist(origin,bodyPoint(c)));
 for(const b of nearby)for(const distance of [24,32,16,12,8])for(const turn of [Math.PI/2,-Math.PI/2,.65,-.65,0,2.35,-2.35,Math.PI]){
  const p=world.nearest(b.x+Math.cos(angle+turn)*distance,b.y+Math.sin(angle+turn)*distance,5);
  if(!p||dist(b,p)<6||!world.segmentSafe(b,p)||movementBlocked(b,p))continue;
  if(agents.some(c=>c!==b&&c.sit<.1&&pointSegment(bodyPoint(c),b,p)<Math.min(bodyClearance(b,c),Math.max(.01,dist(b,bodyPoint(c))-.05))))continue;
  if(redirectable(b)){release(b,b.goal.target);release(b,b.queue?.target);trafficClaims.delete(b.index);b.goal=null;b.trip=null;b.queue=null;b.pending=null;b.path=[];b.spot=null;b.action='idle';b.state='idle';b.speed=0;b.dispatchAt=0;b.trafficResumeTarget=null;phase(b,'loop');}
  b.yieldRequestUntil=elapsed+2;b.makingWayFor=a.id;b.makeWayUntil=elapsed+8;b.leisureHold=.18;b.freeUntil=0;b.leisureQueuedAt=elapsed;
  if(request(b,'idle',p,true)){trafficStats.stepAsides++;trafficNote(b,'idle-step-aside',{forActor:a.id});return true;}
 }return false;
}
function trafficStep(a,intended,move){
 if(!world.segmentSafe(a,intended)){trafficStats.routeRepairs++;return null;}
 const dx=intended.x-a.x,dy=intended.y-a.y,d=Math.hypot(dx,dy);if(d<1e-8)return intended;
 const near=agents.filter(b=>b!==a&&b.sit<.1&&dist(bodyPoint(a),bodyPoint(b))<75);
 if(!near.length)return intended;
 const nx=dx/d,ny=dy/d,look=Math.min(trafficTuning.lookAhead,Math.max(12,dist(a,a.path?.[0]||intended))),ahead={x:a.x+nx*look,y:a.y+ny*look};
 const threatened=near.some(b=>pointSegment(predictedBody(b),a,ahead)<bodyClearance(a,b)+3);
 if(!movementBlocked(a,intended)&&!threatened)return intended;
 askIdleToMakeWay(a);
 let best=null;const preferred=elapsed<(a.trafficSideUntil||0)?a.trafficSide||1:1;
 for(const angle of [0,.45,-.45,.85,-.85,1.2,-1.2,1.55,-1.55,1.95,-1.95]){
  const cos=Math.cos(angle),sin=Math.sin(angle),ux=nx*cos-ny*sin,uy=nx*sin+ny*cos,next={x:a.x+ux*move,y:a.y+uy*move};
  if(!world.segmentSafe(a,next)||movementBlocked(a,next))continue;
  const forecast={x:a.x+ux*look,y:a.y+uy*look};let danger=0;
  for(const b of near){const distance=pointSegment(predictedBody(b),a,forecast),gap=Math.max(0,bodyClearance(a,b)+2-distance);danger+=gap*gap;}
  const score=cos*1.1-danger*.045-(world.segmentSafe(a,forecast)?0:1.2)-Math.abs(angle)*.025+(angle?(Math.sign(angle)===preferred?.1:-.1):0);
  if(!best||score>best.score)best={next,score,angle};
 }
 if(!best)return null;
 if(Math.abs(best.angle)>.1){trafficStats.steeredSteps++;a.trafficSide=Math.sign(best.angle);a.trafficSideUntil=elapsed+1;}
 return best.next;
}
function trafficShortcut(a){
 if(a.path.length<2||elapsed<(a.shortcutAt||0))return;a.shortcutAt=elapsed+.25;
 for(let i=a.path.length-1;i>0;i--){const end=a.path[i];if(world.segmentSafe(a,end)&&agents.every(b=>b===a||b.sit>.1||pointSegment(predictedBody(b),a,end)>=bodyClearance(a,b)+1)){a.path.splice(0,i);trafficStats.shortcuts++;return;}}
}
const trafficEvents=[];
function releaseCongestion(a){
 if(a.phase!=='yield'||a.phaseTime<.35||elapsed<(a.escapeAt||0)||!a.goal)return false;
 if(a.trafficRetreat)return false;
 if(elapsed<(a.trafficPriorityUntil||0))return false;
 askIdleToMakeWay(a);a.escapeAt=elapsed+.8;const old=a.goal,avoid=agents.filter(b=>b!==a&&b.sit<.1).map(b=>({...bodyPoint(b),radius:Math.min(bodyClearance(a,b),Math.max(.01,dist(a,bodyPoint(b))-.05))}));
 const close=avoid.slice().sort((b,c)=>dist(a,b)-dist(a,c))[0],base=close?Math.atan2(a.y-close.y,a.x-close.x):a.index*.9;
 for(const distance of [28,44,60])for(const angle of [0,.6,-.6,1.2,-1.2,2,-2,Math.PI]){
  const p=world.nearest(a.x+Math.cos(base+angle)*distance,a.y+Math.sin(base+angle)*distance,10);if(!p||!world.segmentSafe(a,p)||avoid.some(q=>pointSegment(q,a,p)<q.radius))continue;
  return trafficDetour(a,p,[{x:a.x,y:a.y},p]);
 }return false;
}

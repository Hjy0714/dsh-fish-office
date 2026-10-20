const asyncPathStats={enabled:!window.OFFICE_TEST_SYNC_NAV,ready:false,submitted:0,completed:0,workerMaxMs:0,error:null};
const pathJobs=new Map();let pathWorker=null,pathSerial=0;
if(asyncPathStats.enabled){try{
 const blob=new Blob([window.OFFICE_NAV_WORKER_SOURCE],{type:'text/javascript'}),url=URL.createObjectURL(blob);pathWorker=new Worker(url);URL.revokeObjectURL(url);
 pathWorker.onmessage=e=>{const m=e.data;if(m.ready){asyncPathStats.ready=true;for(const job of pathJobs.values())if(job.state==='pending')pathWorker.postMessage(job.request);return;}
  const job=pathJobs.get(m.owner);if(!job||job.request.id!==m.id)return;job.state='done';job.result=m.route;job.at=performance.now();asyncPathStats.completed++;asyncPathStats.workerMaxMs=Math.max(asyncPathStats.workerMaxMs,m.ms||0);
 };
 pathWorker.onerror=()=>{asyncPathStats.error='Navigation worker unavailable; using local fallback';asyncPathStats.enabled=false;pathWorker.terminate();pathWorker=null;pathJobs.clear();};
}catch(e){asyncPathStats.enabled=false;asyncPathStats.error='Navigation worker unavailable; using local fallback';}}
function pathPending(owner){return pathJobs.get(owner)?.state==='pending'||pathJobs.get(owner+'.static')?.state==='pending';}
function planPath(owner,start,end,avoid=[]){
 if(!asyncPathStats.enabled)return path(start,end,avoid);
 const avoidKey=avoid.map(q=>[q.id||'',Math.round(q.x/4),Math.round(q.y/4),Math.round(q.radius*2)].join(',')).join(';');
 const old=pathJobs.get(owner),same=old&&Math.hypot(old.request.start.x-start.x,old.request.start.y-start.y)<.01&&Math.hypot(old.request.end.x-end.x,old.request.end.y-end.y)<.01;
 if(same&&old.state==='pending')return null;
 // Deliver a completed worker result once, even if a moving neighbour changed cells.
 // Afterwards, only reuse it while the dynamic obstacle signature remains current.
 if(same&&(!old.consumed||old.avoidKey===avoidKey&&performance.now()-old.at<300)){old.consumed=true;return old.result?.map(p=>({...p}))||null;}
 const request={id:++pathSerial,owner,start:{x:start.x,y:start.y},end:{x:end.x,y:end.y},avoid},job={state:'pending',request,result:null,avoidKey,consumed:false,at:performance.now()};pathJobs.set(owner,job);asyncPathStats.submitted++;
 if(asyncPathStats.ready)pathWorker.postMessage(request);return null;
}

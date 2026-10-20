function standForBriefing(a){
 if(a.phase==='walking'||a.phase==='turn'||a.phase==='yield'){
  // Shorten the already validated route; brake onto safe ground rather than teleporting.
  const path=[];let at={x:a.x,y:a.y},left=9;
  for(const end of a.path){const d=dist(at,end);if(d<=left){path.push({...end});left-=d;at=end;if(left<.01)break;}else{path.push({x:at.x+(end.x-at.x)*left/d,y:at.y+(end.y-at.y)*left/d});break;}}
  const end=path.at(-1)||{x:a.x,y:a.y};if(!world.walkable(end.x,end.y))return false;
  release(a,a.goal?.target);release(a,a.queue?.target);a.pending=null;a.queue=null;a.trip=null;
  const target={id:'brief-'+a.id,action:'idle',name:'开工站立位',anchor:end,face:'front',temporary:true};reserve(a,target);
  a.goal={action:'idle',target,quiet:true};a.path=path;a.speed=Math.min(a.speed,32);trafficClaims.set(a.index,[{x:a.x,y:a.y},...path]);
  if(path.length)phase(a,'walking');else arrive(a);return false;
 }
 if(a.phase!=='loop')return false;
 if(a.queue){release(a,a.queue.target);a.queue=null;}a.pending=null;
 if(a.sit<.01&&a.dock<.01&&a.action==='idle'){direction(a,'front');return true;}
 request(a,'idle',{x:a.x,y:a.y},true);return false;
}

const navigationStats={calls:0,direct:0,expanded:0,maxMs:0,wideSearches:0};
function path(start,end,avoid=[],wide=false){
 const begun=performance.now();navigationStats.calls++;
 const clear=p=>avoid.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=(q.radius||32));
 const dynamicEdge=(a,b)=>{for(const q of avoid){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.y-a.y)*dy)/(dx*dx+dy*dy||1)));if(Math.hypot(a.x+dx*t-q.x,a.y+dy*t-q.y)<(q.radius||32))return false;}return true;};
 const key=[start.x,start.y,end.x,end.y].join(',')+'|'+avoid.map(p=>[p.x,p.y,p.radius].join(',')).join(';');
 const finish=result=>{navigationStats.maxMs=Math.max(navigationStats.maxMs,performance.now()-begun);if(result){if(routeCache.size>600)routeCache.clear();routeCache.set(key,result);return result.map(p=>({...p}));}return null;};
 if(routeCache.has(key))return routeCache.get(key).map(p=>({...p}));
 if(!walkable(start.x,start.y)||!walkable(end.x,end.y)||!clear(end))return finish(null);
 if(segmentSafe(start,end)&&dynamicEdge(start,end)){navigationStats.direct++;return finish([{x:start.x,y:start.y},{x:end.x,y:end.y}]);}
 const safeNearest=p=>{let best=null;const cx=Math.floor(p.x/GRID),cy=Math.floor(p.y/GRID);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=cx+dx,y=cy+dy,i=y*cols+x;if(x<0||x>=cols||y<0||y>=rows||!grid[i])continue;const q=point(i),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<=20&&(!best||d<best.distance)&&clear(q)&&segmentSafe(p,q)&&dynamicEdge(p,q))best={index:i,...q,distance:d};}return best;};
 // The 8px grid can leave an otherwise legal narrow apron without a connecting
 // row of nodes. Retry with several visible endpoint connectors instead of
 // choosing one isolated nearest node. Every connector retains exact clearance.
 const connectors=p=>{const result=[],cx=Math.floor(p.x/GRID),cy=Math.floor(p.y/GRID);for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){const x=cx+dx,y=cy+dy,i=y*cols+x;if(x<0||x>=cols||y<0||y>=rows||!grid[i])continue;const q=point(i),distance=Math.hypot(q.x-p.x,q.y-p.y);if(distance<=64&&clear(q)&&segmentSafe(p,q)&&dynamicEdge(p,q))result.push({index:i,...q,distance});}return result;};
 const fallback=()=>wide?finish(null):finish(path(start,end,avoid,true));
 const starts=wide?connectors(start):[safeNearest(start)].filter(Boolean),ends=wide?connectors(end):[safeNearest(end)].filter(Boolean);if(wide)navigationStats.wideSearches++;
 if(!starts.length||!ends.length)return fallback();
 const goals=new Set(ends.map(p=>p.index)),score=new Float64Array(grid.length);score.fill(Infinity);const parent=new Int32Array(grid.length);parent.fill(-1);const closed=new Uint8Array(grid.length),heap=[];
 const h=i=>Math.hypot(point(i).x-end.x,point(i).y-end.y)/GRID;
 const push=(i,g)=>{const v={i,g,f:g+h(i)};heap.push(v);let n=heap.length-1;while(n){const p=(n-1)>>1;if(heap[p].f<=v.f)break;heap[n]=heap[p];n=p;}heap[n]=v;};
 const pop=()=>{const v=heap[0],last=heap.pop();if(heap.length){let n=0;while(n*2+1<heap.length){let c=n*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[n]=heap[c];n=c;}heap[n]=last;}return v;};
 for(const a of starts){score[a.index]=a.distance/GRID;push(a.index,score[a.index]);}const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
 while(heap.length){const v=pop(),i=v.i;if(closed[i]||v.g!==score[i])continue;navigationStats.expanded++;
  if(goals.has(i)){const result=[{x:end.x,y:end.y}];for(let j=i;j!==-1;j=parent[j])result.push(point(j));result.push({x:start.x,y:start.y});result.reverse();const out=[result[0]];for(let j=0;j<result.length-1;){let k=j+1;while(k+1<result.length&&segmentSafe(result[j],result[k+1])&&dynamicEdge(result[j],result[k+1]))k++;if(Math.hypot(result[k].x-out.at(-1).x,result[k].y-out.at(-1).y)>.01)out.push(result[k]);j=k;}return finish(out);}
  closed[i]=1;const pi=point(i);
  for(const [dx,dy]of dirs){const x=i%cols+dx,y=Math.floor(i/cols)+dy;if(x<0||x>=cols||y<0||y>=rows)continue;const n=y*cols+x;if(!grid[n]||closed[n])continue;const pn=point(n);if(!clear(pn)||!dynamicEdge(pi,pn)||!gridEdge(i,n))continue;const g=score[i]+(dx&&dy?Math.SQRT2:1);if(g<score[n]){score[n]=g;parent[n]=i;push(n,g);}}
 }return fallback();
}

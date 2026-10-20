window.__ModuleLoader__.load({id:'dsh-fish-office',factory(require){
 const React=require('react'),h=React.createElement,TAB='dsh-fish-office/room',KIND='fish-office';
 function runScene(scope,resource){
 const {window,document,parent,addEventListener,requestAnimationFrame,cancelAnimationFrame,setTimeout,clearTimeout,setInterval,clearInterval,Worker,MutationObserver,ResizeObserver}=scope;
 Object.assign(window,resource.defaults,{OFFICE_MANAGED:true,PIXEL_ASSETS:resource.art});
 // Hand measured against the approved 941 x 1672 scene. Navigation concerns the feet disc.
(()=>{
const W=941,H=1672,GRID=8,RADIUS=7;
const floors=[
 {id:'library-side-access',points:[[200,505],[287,505],[287,545],[200,545]]},
 {id:'library-apron',points:[[150,540],[245,540],[245,525],[280,525],[280,614],[205,614],[205,590],[150,590]]},
 {id:'west-board-apron',points:[[171,650],[255,650],[255,795],[171,795]]},
 {id:'west-office-extension',points:[[57,752],[255,752],[255,934],[57,934]]},
 {id:'east-office-extension',points:[[688,510],[830,510],[830,635],[688,635]]},
 {id:'office',points:[[338,258],[696,258],[696,453],[864,453],[864,536],[713,536],[713,921],[886,921],[886,981],[547,981],[547,1049],[420,1049],[420,986],[62,986],[62,908],[242,908],[242,348],[338,348]]},
 // The raised manager office is reached only through its reserved seating rail.
 // Its walls, desk and stairs must never be random walking/avoidance destinations.
 {id:'entrance-stairs',points:[[424,1026],[532,1026],[532,1208],[424,1208]]},
 {id:'garden',points:[[421,1190],[535,1190],[553,1256],[609,1273],[611,1303],[568,1337],[575,1420],[550,1490],[531,1564],[531,1621],[415,1621],[415,1540],[389,1502],[383,1455],[383,1334],[344,1301],[344,1271],[420,1246]]},
 {id:'left-bench-apron',points:[[281,1250],[414,1250],[422,1311],[281,1311]]},
 {id:'right-bench-apron',points:[[558,1256],[679,1256],[679,1318],[552,1318]]},
 {id:'round-table-paving',ellipse:{x:270,y:1381,rx:133,ry:117}}
];
const obstacles=[
 // These three gaps are too narrow for two legs and a skirt, even if the feet centre fits.
 {id:'desk-gap-0',type:'clearance',x:474,y:373,w:20,h:131},
 {id:'desk-gap-1',type:'clearance',x:464,y:558,w:29,h:128},
 {id:'desk-gap-2',type:'clearance',x:462,y:740,w:32,h:129},
 {id:'chief-desk',x:71,y:180,w:195,h:105},
 {id:'desk-0',x:306,y:373,w:168,h:131},{id:'chair-0',x:361,y:467,w:65,h:64},
 {id:'desk-1',x:494,y:373,w:169,h:131},{id:'chair-1',x:542,y:467,w:65,h:64},
 {id:'desk-2',x:296,y:558,w:168,h:126},{id:'chair-2',x:350,y:645,w:65,h:65},
 {id:'desk-3',x:493,y:558,w:173,h:128},{id:'chair-3',x:548,y:645,w:65,h:65},
 {id:'desk-4',x:283,y:740,w:179,h:126},{id:'chair-4',x:341,y:826,w:65,h:65},
 {id:'desk-5',x:494,y:740,w:179,h:129},{id:'chair-5',x:552,y:826,w:65,h:65},
 {id:'sofa',x:706,y:278,w:164,h:118},{id:'sofa-table',x:742,y:392,w:101,h:57},
 {id:'aquarium',x:870,y:334,w:60,h:163},{id:'pantry',x:731,y:629,w:178,h:282},
 {id:'shelves',x:75,y:366,w:122,h:181},{id:'shelf-side-cabinet',x:195,y:397,w:91,h:102},{id:'shelf-plant',ellipse:{x:115,y:557,rx:28,ry:22}},
 {id:'whiteboard',points:[[48,719],[187,643],[202,673],[56,747]]},
 {id:'whiteboard-cart',x:73,y:731,w:100,h:49},
 {id:'whiteboard-planter',ellipse:{x:198,y:582,rx:22,ry:14}},
 {id:'whiteboard-stool',ellipse:{x:219,y:638,rx:19,ry:20}},
 {id:'west-plant',ellipse:{x:70,y:928,rx:24,ry:17}},
 {id:'entrance-plant',ellipse:{x:245,y:1014,rx:29,ry:24}},
 {id:'east-partition-vertical',x:824,y:570,w:28,h:68},
 {id:'east-partition-horizontal',x:730,y:617,w:122,h:31},
 {id:'garden-table',ellipse:{x:263,y:1371,rx:47,ry:44}},
 {id:'garden-chair-left',x:171,y:1328,w:43,h:52},{id:'garden-chair-right',x:318,y:1339,w:46,h:58},
 {id:'pond-left-lamp',points:[[490,1384],[536,1384],[539,1427],[520,1447],[489,1433]]},
 {id:'pond',ellipse:{x:759,y:1414,rx:149,ry:106}}
];
function polygon(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c}return c}
function inside(x,y,r){return r.ellipse?((x-r.ellipse.x)/r.ellipse.rx)**2+((y-r.ellipse.y)/r.ellipse.ry)**2<=1:r.points?polygon(x,y,r.points):x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
function raw(x,y){return floors.some(p=>inside(x,y,p))&&!obstacles.some(r=>inside(x,y,r))}
function pointEdge(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t)}
function edgeDistance(a,b,c,d){const cross=(u,v,w)=>(v.x-u.x)*(w.y-u.y)-(v.y-u.y)*(w.x-u.x);if(cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0&&Math.max(a.x,b.x)>=Math.min(c.x,d.x)&&Math.max(c.x,d.x)>=Math.min(a.x,b.x)&&Math.max(a.y,b.y)>=Math.min(c.y,d.y)&&Math.max(c.y,d.y)>=Math.min(a.y,b.y))return 0;return Math.min(pointEdge(a,c,d),pointEdge(b,c,d),pointEdge(c,a,b),pointEdge(d,a,b))}
function polygonEdges(r){return r.points.map((p,i)=>[{x:p[0],y:p[1]},{x:r.points[(i+1)%r.points.length][0],y:r.points[(i+1)%r.points.length][1]}])}
function inflatedContains(x,y,r){if(r.ellipse)return ((x-r.ellipse.x)/(r.ellipse.rx+RADIUS))**2+((y-r.ellipse.y)/(r.ellipse.ry+RADIUS))**2<=1;if(r.points)return inside(x,y,r)||polygonEdges(r).some(([a,b])=>pointEdge({x,y},a,b)<=RADIUS);return x>=r.x-RADIUS&&x<=r.x+r.w+RADIUS&&y>=r.y-RADIUS&&y<=r.y+r.h+RADIUS}
// Conservative one-pixel cells make path validation and runtime stepping agree
// at concave floor joins. Four corner samples include a small clearance margin.
// Rasterize the measured floor union once, then build a conservative Euclidean
// clearance field. Walking no longer recomputes 64 polygon tests per new pixel.
const walkMask=(()=>{
 const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(W,H):document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});g.fillStyle='#000';g.fillRect(0,0,W,H);
 const draw=r=>{g.beginPath();if(r.ellipse){const e=r.ellipse;g.ellipse(e.x,e.y,e.rx,e.ry,0,0,Math.PI*2);}else if(r.points){g.moveTo(...r.points[0]);for(const p of r.points.slice(1))g.lineTo(...p);g.closePath();}else g.rect(r.x,r.y,r.w,r.h);g.fill();};
 g.fillStyle='#fff';floors.forEach(draw);g.fillStyle='#000';obstacles.forEach(draw);
 const pixels=g.getImageData(0,0,W,H).data,field=new Float64Array(W*H),f=new Float64Array(Math.max(W,H)),out=new Float64Array(f.length),v=new Int32Array(f.length),z=new Float64Array(f.length+1);
 function edt(n){let k=0;v[0]=0;z[0]=-Infinity;z[1]=Infinity;for(let q=1;q<n;q++){let s;do{s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);if(s>z[k])break;k--;}while(k>=0);k++;v[k]=q;z[k]=s;z[k+1]=Infinity;}k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;out[q]=(q-v[k])**2+f[v[k]];}}
 for(let y=0;y<H;y++){for(let x=0;x<W;x++)f[x]=x&&y&&x<W-1&&y<H-1&&pixels[(y*W+x)*4]===255?1e12:0;edt(W);for(let x=0;x<W;x++)field[y*W+x]=out[x];}
 const result=new Uint8Array(W*H),clearance=(RADIUS+1.5)**2;
 for(let x=0;x<W;x++){for(let y=0;y<H;y++)f[y]=field[y*W+x];edt(H);for(let y=0;y<H;y++)result[y*W+x]=out[y]>clearance?1:0;}
 return result;
})();
function groundCell(x,y){return x>=0&&y>=0&&x<W-1&&y<H-1&&!!(walkMask[y*W+x]&&walkMask[y*W+x+1]&&walkMask[(y+1)*W+x]&&walkMask[(y+1)*W+x+1]);}

function walkable(x,y){if(x<0||y<0||x>=W-1||y>=H-1)return false;return groundCell(Math.floor(x+1e-8),Math.floor(y+1e-8))}

function intersects(a,b,r){if(r.points)return inflatedContains(a.x,a.y,r)||inflatedContains(b.x,b.y,r)||polygonEdges(r).some(([c,d])=>edgeDistance(a,b,c,d)<=RADIUS);if(r.ellipse){const ax=(a.x-r.ellipse.x)/(r.ellipse.rx+RADIUS),ay=(a.y-r.ellipse.y)/(r.ellipse.ry+RADIUS),dx=(b.x-a.x)/(r.ellipse.rx+RADIUS),dy=(b.y-a.y)/(r.ellipse.ry+RADIUS),t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));return (ax+dx*t)**2+(ay+dy*t)**2<=1}let lo=0,hi=1;for(const [start,delta,min,max]of [[a.x,b.x-a.x,r.x-RADIUS,r.x+r.w+RADIUS],[a.y,b.y-a.y,r.y-RADIUS,r.y+r.h+RADIUS]]){if(Math.abs(delta)<1e-9){if(start<min||start>max)return false}else{const t1=(min-start)/delta,t2=(max-start)/delta;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>hi)return false}}return lo<=hi}
function segmentSafe(a,b){if(obstacles.some(r=>intersects(a,b,r))||!walkable(a.x,a.y)||!walkable(b.x,b.y))return false;const dx=b.x-a.x,dy=b.y-a.y,ts=[0,1];for(const [v,d]of [[a.x,dx],[a.y,dy]])if(Math.abs(d)>1e-10)for(let n=Math.floor(Math.min(v,v+d))+1;n<Math.max(v,v+d);n++){const t=(n-v)/d;if(t>0&&t<1)ts.push(t)}ts.sort((a,b)=>a-b);for(const t of ts)if(t>1e-8&&t<1-1e-8){const px=a.x+dx*t,py=a.y+dy*t;for(const ex of [-1e-5,1e-5])for(const ey of [-1e-5,1e-5])if(!walkable(px+ex,py+ey))return false;}for(let i=1;i<ts.length;i++){const t=(ts[i-1]+ts[i])/2;if(!walkable(a.x+dx*t,a.y+dy*t))return false}return true}
const cols=Math.ceil(W/GRID),rows=Math.ceil(H/GRID),grid=new Uint8Array(cols*rows),point=i=>({x:i%cols*GRID+GRID/2,y:Math.floor(i/cols)*GRID+GRID/2});
for(let i=0;i<grid.length;i++){const p=point(i);grid[i]=Number(walkable(p.x,p.y))}
function nearest(x,y,max=Infinity){let index=-1,best=max*max;const x0=Number.isFinite(max)?Math.max(0,Math.floor((x-max)/GRID)):0,x1=Number.isFinite(max)?Math.min(cols-1,Math.ceil((x+max)/GRID)):cols-1,y0=Number.isFinite(max)?Math.max(0,Math.floor((y-max)/GRID)):0,y1=Number.isFinite(max)?Math.min(rows-1,Math.ceil((y+max)/GRID)):rows-1;for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){const i=yy*cols+xx;if(!grid[i])continue;const p=point(i),d=(p.x-x)**2+(p.y-y)**2;if(d<=best){index=i;best=d;}}return index<0?null:{index,...point(index),distance:Math.sqrt(best)}}
const edgeCache=new Map(),routeCache=new Map();
function gridEdge(a,b){const key=Math.min(a,b)*grid.length+Math.max(a,b);if(!edgeCache.has(key))edgeCache.set(key,segmentSafe(point(a),point(b)));return edgeCache.get(key)}
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

const spots=[
 {id:'chief-work',action:'work',seated:true,chief:true,name:'主管办公椅',anchor:{x:344,y:356},seat:{x:169,y:232},rail:[{x:344,y:356},{x:330,y:344},{x:300,y:312},{x:280,y:305},{x:280,y:232},{x:169,y:232}],face:'front',depth:183},
 ...[{x:389,cx:393,y:540,sy:508},{x:578,cx:574,y:540,sy:508},{x:380,cx:382,y:718,sy:690},{x:578,cx:580,y:718,sy:690},{x:373,cx:373,y:909,sy:876},{x:578,cx:584,y:909,sy:876}].map((s,i)=>({id:'desk-'+i,action:'work',seated:true,desk:i,name:'工位 '+(i+1),anchor:{x:s.x,y:s.y},seat:{x:s.cx||s.x,y:s.sy},face:'up',depth:s.sy})),
 ... [{x:699,y:898},{x:750,y:956},{x:860,y:956}].map((s,i)=>({id:'coffee-'+i,action:'coffee',name:['咖啡柜前左侧','咖啡柜前左位','咖啡柜前右位'][i],anchor:{x:s.x,y:s.y},face:'front'})),
 {id:'pond-upper',action:'pond',name:'池塘喂鱼位',anchor:{x:575,y:1352},face:'right',feed:{x:689,y:1400}},
 {id:'pond-lower',action:'pond',name:'池塘看鱼位',anchor:{x:532,y:1510},face:'right',feed:{x:690,y:1438}},
 {id:'sofa-left',action:'rest',name:'沙发中座',seated:true,anchor:{x:725,y:480},seat:{x:786,y:363},rail:[{x:725,y:480},{x:714,y:447},{x:714,y:393},{x:727,y:368},{x:786,y:363}],face:'front',depth:391},
 {id:'sofa-right',action:'rest',name:'沙发右座',seated:true,anchor:{x:844,y:484},seat:{x:817,y:366},rail:[{x:844,y:484},{x:835,y:432},{x:830,y:400},{x:830,y:385},{x:817,y:366}],face:'front',depth:391},
 {id:'library',action:'book',name:'技能书架',anchor:{x:220,y:524},face:'left'},
 {id:'whiteboard',action:'read',name:'白板近前',anchor:{x:220,y:680},face:'left'},
 {id:'bench-left',action:'bench',name:'花园左长椅',seated:true,anchor:{x:350,y:1283},seat:{x:309,y:1254},face:'front',depth:1265},
 {id:'bench-right',action:'bench',name:'花园右长椅',seated:true,anchor:{x:600,y:1284},seat:{x:641,y:1255},face:'front',depth:1265},
 {id:'chair-left',action:'chair',name:'圆桌左椅',seated:true,anchor:{x:191,y:1408},seat:{x:194,y:1382},face:'right',depth:1402},
 {id:'chair-right',action:'chair',name:'圆桌右椅',seated:true,anchor:{x:358,y:1417},seat:{x:319,y:1383},face:'left',depth:1406},
 {id:'idle-office',action:'idle',name:'室内待机',anchor:{x:482,y:951},face:'front'},
 {id:'idle-garden',action:'idle',name:'花园待机',anchor:{x:474,y:1297},face:'front'}
];
for(const s of spots){const n=nearest(s.anchor.x,s.anchor.y,24);s.requestedAnchor={...s.anchor};s.anchor=n?{x:n.x,y:n.y}:s.anchor;if(s.rail)s.rail[0]={...s.anchor};else if(s.seat)s.rail=[s.anchor,s.seat]}
window.OfficeWorld={width:W,height:H,GRID,RADIUS,navigationStats,floors,obstacles,grid,cols,rows,point,inside,raw,walkable,segmentSafe,nearest,path,spots};
})();

 // Keep worker and rendering-thread geometry identical; only path search runs off-thread.
window.OFFICE_NAV_WORKER_SOURCE=resource.navigationWorker;
(function(){
 const {path}=window.OfficeWorld;
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

 Object.assign(window.OfficeWorld,{asyncPathStats,planPath,pathPending});
})();

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

 (async()=>{
'use strict';
const A=window.PIXEL_ASSETS,world=window.OfficeWorld,$=s=>document.querySelector(s),canvas=$('#scene'),ctx=canvas.getContext('2d',{alpha:false}),W=A.width,H=A.height;ctx.imageSmoothingEnabled=false;
async function load(src){const img=new Image();img.src=src;await img.decode();return img}
const base=await load(A.background||A.environments.day),sprites=Object.fromEntries(await Promise.all(Object.entries(A.sprites).map(async([id,s])=>[id,await load(s.src)]))),layers=await Promise.all(A.layers.map(async l=>({...l,image:await load(l.src)})));
// Repair only extraction opacity: retain RGB, transparent holes and fine outer edges.
// Assets on disk stay frozen so the approved walking geometry is unchanged.
for(const [id,image]of Object.entries(sprites))if(A.sprites[id].anchor){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d');g.drawImage(image,0,0);const d=g.getImageData(0,0,c.width,c.height);
 for(let i=3;i<d.data.length;i+=4)if(d.data[i]>=235&&d.data[i]<255)d.data[i]=255;
 g.putImageData(d,0,0);c.__registration=A.sprites[id];sprites[id]=c;
}
const lightCanvas=document.createElement('canvas');lightCanvas.width=W;lightCanvas.height=H;const lightCtx=lightCanvas.getContext('2d');
// Four generated lighting plates share the measured map and foreground alpha masks.
const environments=Object.fromEntries(await Promise.all(Object.entries(A.environments).map(async([key,src])=>[key,await load(src)])));
const environmentsOff=Object.fromEntries(await Promise.all(Object.entries(A.environmentsOff).map(async([key,src])=>[key,await load(src)])));
const officeClockWalls=Object.fromEntries(await Promise.all(Object.entries(window.OfficeClockAssets).map(async([key,src])=>[key,await load(src)])));
for(const [key,patch]of Object.entries(officeClockWalls))for(const plates of [environments,environmentsOff]){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(plates[key],0,0);g.drawImage(patch,75,25);plates[key]=c;}
const aquariumClean=await load(A.aquarium.clean),aquariumWhale=await load(A.aquarium.whale);
const phaseProfiles={
 dawn:{ambient:'#b7c8ef',tint:.10,sun:{x:-1,y:.65},shadow:.18,length:27,warm:.13,sky:'#d5acbc'},
 day:{ambient:'#fff0cc',tint:.035,sun:{x:1,y:.65},shadow:.24,length:18,warm:.03,sky:'#78bce7'},
 dusk:{ambient:'#e9a384',tint:.12,sun:{x:-1,y:.45},shadow:.28,length:37,warm:.20,sky:'#9b779b'},
 night:{ambient:'#6988cc',tint:.26,sun:{x:1,y:.45},shadow:.30,length:26,warm:.23,sky:'#112747'}
};
const activePlate=document.createElement('canvas'),offPlate=document.createElement('canvas'),lampPatch=document.createElement('canvas');for(const c of [activePlate,offPlate,lampPatch]){c.width=W;c.height=H}const plateCtx=activePlate.getContext('2d',{alpha:false}),offCtx=offPlate.getContext('2d',{alpha:false}),patchCtx=lampPatch.getContext('2d');
const activeLayers=layers.map(l=>{const image=document.createElement('canvas');image.width=l.image.width;image.height=l.image.height;return {...l,image}});
let plateSignature='',environmentMix={fromWeights:[['dusk',1]],to:'dusk',start:0,startWall:performance.now(),duration:2.4},lampMix={from:1,to:1,start:0,startWall:performance.now()};
function transitionTime(m){return Math.max(elapsed-m.start,(performance.now()-m.startWall)/1000)}
function environmentWeights(){if(settings.realTimeLock)return lockedRealityWeights();const t=smooth(transitionTime(environmentMix)/environmentMix.duration),out=new Map(environmentMix.fromWeights.map(([k,w])=>[k,w*(1-t)]));out.set(environmentMix.to,(out.get(environmentMix.to)||0)+t);return [...out].filter(([,w])=>w>.00001)}
function lampAmount(){return lerp(lampMix.from,lampMix.to,smooth(transitionTime(lampMix)/.8))}
function toggleLamps(){const from=lampAmount();settings.lamps=!settings.lamps;lampMix={from,to:settings.lamps?1:0,start:elapsed,startWall:performance.now()};sync()}
function environmentBase(){if(lampMix.to!==Number(settings.lamps))lampMix={from:lampAmount(),to:Number(settings.lamps),start:elapsed,startWall:performance.now()};const weights=environmentWeights(),amount=lampAmount()*Math.min(1,settings.glow/68),signature=weights.map(([k,w])=>k+':'+w.toFixed(4)).join(',')+'|'+amount.toFixed(4)+'|'+lamps.map(l=>l.enabled===false?0:1).join('');
 if(signature!==plateSignature){plateSignature=signature;plateCtx.clearRect(0,0,W,H);offCtx.clearRect(0,0,W,H);plateCtx.globalCompositeOperation=offCtx.globalCompositeOperation='lighter';
 for(const [key,w]of weights){offCtx.globalAlpha=w;offCtx.drawImage(environmentsOff[key],0,0,W,H);plateCtx.globalAlpha=w*amount;plateCtx.drawImage(environments[key],0,0,W,H);plateCtx.globalAlpha=w*(1-amount);plateCtx.drawImage(environmentsOff[key],0,0,W,H)}
 plateCtx.globalAlpha=offCtx.globalAlpha=1;plateCtx.globalCompositeOperation=offCtx.globalCompositeOperation='source-over';
 for(const l of lamps)if(l.enabled===false&&amount>.001){const radius=l.y>1000?112:105;patchCtx.clearRect(0,0,W,H);patchCtx.drawImage(offPlate,0,0);patchCtx.globalCompositeOperation='destination-in';const g=patchCtx.createRadialGradient(l.x,l.y,23,l.x,l.y,radius);g.addColorStop(0,'#fff');g.addColorStop(.45,'#ffffffe8');g.addColorStop(1,'#ffffff00');patchCtx.fillStyle=g;patchCtx.fillRect(0,0,W,H);patchCtx.globalCompositeOperation='source-over';plateCtx.drawImage(lampPatch,0,0)}
 for(let i=0;i<layers.length;i++){const l=layers[i],c=activeLayers[i].image,g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(activePlate,l.x,l.y,c.width,c.height,0,0,c.width,c.height);g.globalCompositeOperation='destination-in';g.drawImage(l.image,0,0);g.globalCompositeOperation='source-over';}
 }ctx.drawImage(activePlate,0,0,W,H)
}
const furnitureWindMasks=new Map();
function environmentLayer(index){const l=activeLayers[index];ctx.drawImage(l.image,l.x,l.y);if(/^desk-[0-5]$/.test(l.id))screenArt(Number(l.id.slice(-1)));if(l.id.startsWith('garden-tree'))windOverlay(l.image,l.x,l.y,index,plantMask(layers[index].image));else if(l.foliageRect){let mask=furnitureWindMasks.get(index);if(!mask){mask=document.createElement('canvas');mask.width=l.image.width;mask.height=l.image.height;const g=mask.getContext('2d'),r=l.foliageRect;g.drawImage(plantMask(layers[index].image),0,0);g.globalCompositeOperation='destination-in';g.fillStyle='#fff';g.fillRect(r[0]-l.x,r[1]-l.y,r[2],Math.min(r[3],({ 'west-office-plant':911,'entrance-office-plant':997,'whiteboard-cart':698}[l.id]||r[1]+r[3])-r[1]));furnitureWindMasks.set(index,mask)}windOverlay(l.image,l.x,l.y,index,mask)}}
function blendProfile(){const result={tint:0,shadow:0,length:0,warm:0,sun:{x:0,y:0}},color=[0,0,0];for(const [key,w]of environmentWeights()){const p=phaseProfiles[key];for(const n of ['tint','shadow','length','warm'])result[n]+=p[n]*w;result.sun.x+=p.sun.x*w;result.sun.y+=p.sun.y*w;for(let i=0;i<3;i++)color[i]+=parseInt(p.ambient.slice(1+i*2,3+i*2),16)*w}result.ambient='rgb('+color.map(Math.round).join(',')+')';return result}
const actorCanvas=document.createElement('canvas');actorCanvas.width=256;actorCanvas.height=256;const actorCtx=actorCanvas.getContext('2d');
function litSprite(image,x,y,h,flip=false,alpha=1){
 if(!image||alpha<.005)return;const reg=image.__registration;if(!reg){drawSprite(image,x,y,h,flip,alpha);return}
 const profile=blendProfile(),scale=h/reg.bodyHeight;actorCtx.globalAlpha=1;actorCtx.globalCompositeOperation='source-over';actorCtx.clearRect(0,0,256,256);actorCtx.drawImage(image,0,0);actorCtx.globalCompositeOperation='source-atop';
 // Gentle material shading retains the sprite's dark outlines and saturated hair.
 // Flat blue/cream paint over the entire figure used to wash out its contrast.
 actorCtx.globalAlpha=profile.tint*.25;actorCtx.fillStyle='#10213b';actorCtx.fillRect(0,0,256,256);
 // Restrict warm light to the edge facing the nearest lamp.
 let nearest=Infinity;for(const l of lamps)if(settings.lamps&&l.enabled!==false)nearest=Math.min(nearest,Math.hypot(x-l.x,(y-h*.45)-l.y));
 if(nearest<145){const light=lamps.filter(l=>settings.lamps&&l.enabled!==false).sort((a,b)=>Math.hypot(x-a.x,y-h*.45-a.y)-Math.hypot(x-b.x,y-h*.45-b.y))[0],left=light.x<x;const rim=actorCtx.createLinearGradient(left?0:256,0,left?256:0,0);rim.addColorStop(0,'#ffd39a');rim.addColorStop(.5,'#ffd39a60');rim.addColorStop(1,'#ffd39a00');actorCtx.globalAlpha=profile.warm*.38*(1-nearest/145)*settings.glow/68;actorCtx.fillStyle=rim;actorCtx.fillRect(0,0,256,256)}
 actorCtx.globalCompositeOperation='source-over';actorCtx.globalAlpha=1;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;actorCanvas.__registration=reg;ctx.drawImage(actorCanvas,x-reg.anchor.x*scale,y-reg.anchor.y*scale,256*scale,256*scale);ctx.restore();
}
function oldActorShadow(a,p){const profile=blendProfile(),seated=a.sit>.1;ctx.save();ctx.translate(p.x,p.y-2);ctx.fillStyle=`rgba(9,21,42,${profile.shadow})`;ctx.beginPath();ctx.ellipse(profile.sun.x*profile.length*.35,profile.sun.y*profile.length*.14,a.chief?23:20,seated?4:5+profile.length*.12,-profile.sun.x*.24,0,Math.PI*2);ctx.fill();ctx.restore()}
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;const shadowCtx=shadowCanvas.getContext('2d');
function actorShadow(a,p){const profile=blendProfile(),image=actionImage(a)||sprites[appearance(a).key],reg=image?.__registration;if(!reg)return;const height=actorMetrics(a).height,scale=height/reg.bodyHeight;shadowCtx.clearRect(0,0,256,256);shadowCtx.drawImage(image,0,0);shadowCtx.globalCompositeOperation='source-in';shadowCtx.fillStyle='#102039';shadowCtx.fillRect(0,0,256,256);shadowCtx.globalCompositeOperation='source-over';ctx.save();ctx.beginPath();for(const floor of world.floors){if(floor.ellipse){const e=floor.ellipse;ctx.moveTo(e.x+e.rx,e.y);ctx.ellipse(e.x,e.y,e.rx,e.ry,0,0,Math.PI*2)}else{ctx.moveTo(...floor.points[0]);for(const q of floor.points.slice(1))ctx.lineTo(...q);ctx.closePath()}}ctx.clip();ctx.globalAlpha=profile.shadow;ctx.translate(p.x,p.y);ctx.transform(1,0,-profile.sun.x*profile.length/height,-profile.sun.y*profile.length/height,0,0);ctx.drawImage(shadowCanvas,-reg.anchor.x*scale,-reg.anchor.y*scale,256*scale,256*scale);ctx.restore();ctx.save();ctx.fillStyle='#07152135';ctx.beginPath();ctx.ellipse(p.x,p.y-1,(a.chief?16:12)*actorMetrics(a).gain,3*actorMetrics(a).gain,0,0,Math.PI*2);ctx.fill();ctx.restore()}
// Independent alpha sprites add actual stem/branch bending, beyond texture movement.
const foliageSources=Object.fromEntries(await Promise.all(Object.entries(A.flora).map(async([k,src])=>{const image=await load(src),c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d');g.drawImage(image,0,0);const p=g.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(p[(y*c.width+x)*4+3]>80){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}const crop=document.createElement('canvas');crop.width=x1-x0+1;crop.height=y1-y0+1;crop.getContext('2d').drawImage(c,x0,y0,crop.width,crop.height,0,0,crop.width,crop.height);return [k,crop]})));
const livingPlants=[
 {kind:'flowers',x:112,y:1331,w:32,h:43},{kind:'flowers',x:366,y:1494,w:29,h:39},
 {kind:'flowers',x:586,y:1548,w:32,h:43},{kind:'flowers',x:842,y:1281,w:35,h:47},
 {kind:'flowers',x:222,y:1600,w:32,h:43},{kind:'flowers',x:690,y:1608,w:30,h:40},
 {kind:'branch',x:65,y:1110,w:74,h:70},{kind:'branch',x:870,y:1126,w:72,h:68},
 {kind:'branch',x:118,y:1525,w:74,h:70},{kind:'branch',x:854,y:1560,w:70,h:66}
];
const plantCanvas=document.createElement('canvas');plantCanvas.width=128;plantCanvas.height=128;const plantCtx=plantCanvas.getContext('2d');
function livingPlantArt(){const profile=blendProfile();livingPlants.forEach((p,i)=>{const image=foliageSources[p.kind];plantCtx.clearRect(0,0,128,128);plantCtx.imageSmoothingEnabled=false;for(let row=0;row<p.h;row++){const v=1-row/p.h,bend=Math.sin(elapsed*Math.PI/3+i*.83)*v*v*(p.kind==='branch'?5:3.6);plantCtx.drawImage(image,0,row/p.h*image.height,image.width,image.height/p.h,12+bend,row,p.w,1)}plantCtx.globalCompositeOperation='source-atop';plantCtx.globalAlpha=profile.tint;plantCtx.fillStyle=profile.ambient;plantCtx.fillRect(0,0,128,128);const darkness=environmentWeights().reduce((n,[k,w])=>n+w*(k==='night'?.25:k==='dusk'?.08:k==='dawn'?.05:0),0);plantCtx.globalAlpha=darkness;plantCtx.fillStyle='#0d2036';plantCtx.fillRect(0,0,128,128);plantCtx.globalAlpha=1;plantCtx.globalCompositeOperation='source-over';ctx.drawImage(plantCanvas,0,0,p.w+24,p.h,p.x-p.w/2-12,p.y-p.h,p.w+24,p.h)})}
// Wind is a periodic displacement mesh, sampled from each actual lighting plate.
// Edge displacement is zero, so fixed architecture never moves and seams never open.
const floraRegions=[
 {x:0,y:1010,w:215,h:155},{x:0,y:1168,w:133,h:160},{x:177,y:1082,w:208,h:94},
 {x:756,y:1025,w:185,h:125},{x:808,y:1166,w:133,h:153},{x:665,y:1088,w:128,h:68},
 {x:55,y:1435,w:200,h:94},{x:8,y:1532,w:328,h:140},{x:733,y:1529,w:208,h:143},
 {x:568,y:1546,w:135,h:126},{x:6,y:1340,w:91,h:100},{x:854,y:1350,w:87,h:150},
 {x:211,y:914,w:64,h:79},{x:724,y:196,w:91,h:50},{x:846,y:107,w:36,h:83}
];
const windMasks=new WeakMap(),windBuffers=new WeakMap();
function plantMask(image){if(windMasks.has(image))return windMasks.get(image);const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d');g.drawImage(image,0,0);const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){const red=p[i],green=p[i+1],blue=p[i+2],plant=(green>red*.90&&green>blue*.80)||(blue>130&&green>105&&red<green*.85)||(red>200&&green>195&&blue>140);p[i+3]=plant?p[i+3]:0}g.putImageData(d,0,0);windMasks.set(image,c);return c}
function windOverlay(image,x,y,index,mask=null){const w=image.width,h=image.height;let buffer=windBuffers.get(image);if(!buffer){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;buffer={canvas,ctx:canvas.getContext('2d')};windBuffers.set(image,buffer)}const windCtx=buffer.ctx;windCtx.clearRect(0,0,w,h);windCtx.imageSmoothingEnabled=false;for(let yy=0;yy<h;yy+=2){const v=yy/h,offset=Math.sin(elapsed*Math.PI*2/6+index*.83+v*2)*3.0*Math.sin(Math.PI*v);windCtx.drawImage(image,offset,yy,w,Math.min(2,h-yy),0,yy,w,Math.min(2,h-yy))}windCtx.globalCompositeOperation='destination-in';windCtx.drawImage(mask||plantMask(image),0,0);windCtx.globalCompositeOperation='source-over';ctx.drawImage(buffer.canvas,x,y)}
const floraPatches=floraRegions.map(r=>{const c=document.createElement('canvas');c.width=r.w;c.height=r.h;c.getContext('2d').drawImage(base,r.x,r.y,r.w,r.h,0,0,r.w,r.h);return {r,image:c,signature:null,mask:plantMask(c)}});
function floraArt(){floraPatches.forEach((p,i)=>{if(p.signature!==plateSignature){const g=p.image.getContext('2d');g.clearRect(0,0,p.r.w,p.r.h);g.drawImage(activePlate,p.r.x,p.r.y,p.r.w,p.r.h,0,0,p.r.w,p.r.h);p.signature=plateSignature}windOverlay(p.image,p.r.x,p.r.y,i,p.mask)})}
// Aquarium fish use continuous closed paths. The tail beats and heading follow the tangent.
function aquariumArt(){ctx.save();for(const [panel,rect]of [[0,[316,54,92,143]],[1,[443,55,184,143]],[2,[663,56,81,140]]]){
 ctx.save();ctx.beginPath();ctx.rect(...rect);ctx.clip();
 ctx.drawImage(aquariumClean,...rect,...rect);
 if(panel===1){const x=535+Math.sin(elapsed*Math.PI/12)*7,y=117+Math.sin(elapsed*Math.PI/6)*5,w=151,h=65,sw=aquariumWhale.width,sh=aquariumWhale.height;ctx.save();ctx.translate(Math.round(x-w/2),Math.round(y-h/2));for(let i=0;i<24;i++){const v=i/24,sy=Math.sin(elapsed*Math.PI*2/3-v*3)*2.2*v*v;ctx.drawImage(aquariumWhale,i*sw/24,0,sw/24+1,sh,i*w/24,sy,w/24+1,h)}ctx.restore()}
 for(let i=0;i<4;i++){const t=elapsed*Math.PI*2/24+i*1.57+panel*.6,cx=rect[0]+rect[2]/2,cy=rect[1]+rect[3]/2,x=cx+Math.cos(t)*rect[2]*.39,y=cy+Math.sin(t*2)*rect[3]*.29,dx=-Math.sin(t),s=2.3+(i%2)*.7;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(dx<0?-1:1,1);ctx.fillStyle=['#70cce2','#9bd9e8','#3b90bb','#bedce5'][i];ctx.beginPath();ctx.moveTo(-s*2,0);ctx.lineTo(-s*4,-s*(.4+.6*Math.abs(Math.sin(elapsed*Math.PI*2/1.2+i))));ctx.lineTo(-s*4,s*(.4+.6*Math.abs(Math.sin(elapsed*Math.PI*2/1.2+i))));ctx.closePath();ctx.fill();ctx.fillRect(-s*2,-s,s*4,s*2);ctx.fillRect(-s,-s*1.5,s*2,s*3);ctx.fillStyle='#143f65';ctx.fillRect(s,-s*.4,1,1);ctx.restore();
 }
 for(let i=0;i<4;i++){const t=(elapsed/6+i*.27+panel*.13)%1;ctx.strokeStyle=`rgba(173,239,255,${Math.sin(Math.PI*t)*.35})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(rect[0]+rect[2]*(.15+i*.23)+Math.sin(elapsed*Math.PI/3+i)*2,rect[1]+rect[3]*(1-t),1.5,0,Math.PI*2);ctx.stroke()}
 ctx.restore()}ctx.restore()}


const actorStyles=Object.freeze({chief:{height:148,bodyHeight:220,gain:148/137,seatOffset:35*(148-137)/220},crew:{height:101,bodyHeight:200,gain:1,seatOffset:0}});
function actorMetrics(a){return actorStyles[a.chief?'chief':'crew']}
// One authored arm replaces one removed native arm. Never append a third limb.
const actionParts=Object.fromEntries(await Promise.all(Object.entries({...A.actionRigs,...window.OfficeCoffeeFrontRigs}).map(async([role,r])=>{
 function solid(im){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,256,256);for(let i=3;i<d.data.length;i+=4)if(d.data[i]>=235)d.data[i]=255;g.putImageData(d,0,0);return c}const body=solid(await load(r.body)),hand=solid(await load(r.hand));return [role,{...r,body,hand}];
})));
const actionFrames=new Map(),ACTION_FRAMES=72;
function actionAmount(a){
 const t=a.loopTime;
 if(a.action==='coffee')return smooth(Math.max(0,Math.sin((t-.5)*Math.PI/3)));
 if(a.action==='pond'){const u=t%3.6;return smooth(u/.65)*(1-smooth((u-1.05)/.8));}
 if(a.action==='read')return smooth(t/.65)*(.65+.12*Math.sin(t*1.1));
 if(a.action==='book'){const u=t%10;return u<1.5?smooth(u/1.5):u>8.5?1-smooth((u-8.5)/1.5):1;}
 return 0;
}
function armPose(a){
 const front=a.action==='coffee'&&a.dir==='front',role=(a.chief?'chief':'crew')+(front?'-front':''),r=actionParts[role],amount=actionAmount(a),v=Math.round(amount*(ACTION_FRAMES-1))/(ACTION_FRAMES-1),rest=front?r.rest:!a.chief?[132,174]:r.rest;
 // Front view grips the right handle, with the cup body left of the hand and its rim at the mouth.
 const target=front?[r.target[0]+13,r.target[1]]:a.action==='coffee'?(a.chief?[145,91]:[143,143]):a.action==='pond'?(a.chief?[167,117]:[154,158]):a.action==='read'?(a.chief?[170,106]:[153,151]):(a.chief?[158,118]:[150,166]);
 let hand={x:lerp(rest[0],target[0],v),y:lerp(rest[1],target[1],v)},bookState=null;if(a.action==='book'){const t=a.loopTime%10,reach=a.chief?[171,105]:[154,148],hold=target;let from=rest,to=reach,u=smooth(t/.7);bookState='reach';if(t>=.7&&t<1.5){from=reach;to=hold;u=smooth((t-.7)/.8);bookState='take'}else if(t>=1.5&&t<8.5){from=hold;to=hold;u=1;bookState='read'}else if(t>=8.5&&t<9.3){from=hold;to=reach;u=smooth((t-8.5)/.8);bookState='return'}else if(t>=9.3){from=reach;to=rest;u=smooth((t-9.3)/.7);bookState='release'}hand={x:lerp(from[0],to[0],u),y:lerp(from[1],to[1],u)}}if(a.phase==='finish-action'&&a.exitArm){const u=smooth(a.phaseTime/a.phaseDuration),start=a.exitArm.hand;hand={x:lerp(start.x,rest[0],u),y:lerp(start.y,rest[1],u)};if(a.action==='book'){const reach=a.chief?[171,105]:[154,148],v=u<.6?smooth(u/.6):smooth((u-.6)/.4);hand=u<.6?{x:lerp(start.x,reach[0],v),y:lerp(start.y,reach[1],v)}:{x:lerp(reach[0],rest[0],v),y:lerp(reach[1],rest[1],v)};bookState=u<.6?'return':'release'}}const shoulder={x:r.shoulder[0],y:r.shoulder[1]},dx=hand.x-shoulder.x,dy=hand.y-shoulder.y,d=Math.min(r.upper+r.lower-.1,Math.hypot(dx,dy)),along=(r.upper*r.upper-r.lower*r.lower+d*d)/(2*d),bend=Math.sqrt(Math.max(0,r.upper*r.upper-along*along)),norm=Math.hypot(dx,dy)||1;
 // Crew feeding returns to the front of the apron. Keep the same IK branch
 // through extension and retraction; choosing by dx used to flip the elbow.
 const elbow={x:shoulder.x+dx/norm*along-dy/norm*bend*(r.bend||1),y:shoulder.y+dy/norm*along+dx/norm*bend*(r.bend||1)};
 return {role,r,v,shoulder,elbow,hand,bookState,mirror:a.dir==='left',nativeArmsReplaced:1,nativeArmsRetained:1,hasFoodBag:false,hasDocument:false};
}

function pixelDisc(g,p,r,color){g.fillStyle=color;for(let y=Math.floor(p.y-r);y<=Math.ceil(p.y+r);y++)for(let x=Math.floor(p.x-r);x<=Math.ceil(p.x+r);x++)if((x+.5-p.x)**2+(y+.5-p.y)**2<=r*r)g.fillRect(x,y,1,1);}
function pixelBone(g,a,b,w,color){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*1.5);for(let i=0;i<=n;i++)pixelDisc(g,{x:lerp(a.x,b.x,i/(n||1)),y:lerp(a.y,b.y,i/(n||1))},w/2,color);}
function coffeeCupPose(p){
 const side=p.role.endsWith('-front')?-1:1,angle=-side*p.v*.24;
 const project=(x,y)=>({x:p.hand.x+Math.cos(angle)*side*x-Math.sin(angle)*y,y:p.hand.y+Math.sin(angle)*side*x+Math.cos(angle)*y});
 return{side,angle,grip:{...p.hand},handleGrip:project(0,0),bodyCenter:project(15,-2.5)};
}
function drawCoffeeCup(g,p){
 const cup=coffeeCupPose(p);g.save();
 // Rotate around the gripping fingers, never around the far side of the mug.
 g.translate(Math.round(p.hand.x),Math.round(p.hand.y));g.rotate(cup.angle);g.scale(cup.side,1);
 g.strokeStyle='#28334a';g.lineWidth=4;g.strokeRect(0,-6,10,10);
 g.strokeStyle='#efdec2';g.lineWidth=2;g.strokeRect(0,-6,10,10);
 g.fillStyle='#28334a';g.fillRect(7,-11,16,17);
 g.fillStyle='#f0e3c9';g.fillRect(8,-10,14,15);
 g.fillStyle='#fff4df';g.fillRect(9,-7,2,9);
 g.fillStyle='#c5a87d';g.fillRect(9,3,12,2);
 g.fillStyle='#70503d';g.fillRect(9,-10,12,3);g.restore();
}
const coffeeGripHands=new Map();
function coffeeHandImage(p){
 if(p.role!=='chief-front')return p.r.hand;
 if(coffeeGripHands.has(p.role))return coffeeGripHands.get(p.role);
 // The original chief sprite is an open presentation palm with fingers pointing
 // away from the mug. Use a compact curled grip: thumb on the cup/left side,
 // knuckles beside the handle, and a closed lower palm at the wrist.
 const rows=[
  '......ooo.....',
  '....oobbbmo...',
  '...ohhhbbmmo..',
  '..ohhbbbcmmmo.',
  '.ohbbbbbcmmo..',
  '.obbmbbbcmmo..',
  '.obbccbbcmmo..',
  '..obbbbbcmmo..',
  '..obbccbbmmo..',
  '...obbbmmmo...',
  '....obmmo.....',
  '.....ooo......'
 ],colors={o:'#604653',s:'#be8585',m:'#e7ab9d',b:'#ffdcc6',h:'#fff0da',c:'#d1958c'};
 const image=document.createElement('canvas');image.width=image.height=256;const g=image.getContext('2d');
 const x=Math.round(p.r.rest[0])-7,y=Math.round(p.r.rest[1])-6;
 for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const color=colors[rows[j][i]];if(color){g.fillStyle=color;g.fillRect(x+i,y+j,1,1);}}
 image.__coffeeGrip={closed:true,thumb:'left',originalOpenPalmRemoved:true};coffeeGripHands.set(p.role,image);return image;
}

function actionImage(a){
 if(!['loop','finish-action'].includes(a.phase)||a.sit>.001||!['coffee','pond','read','book'].includes(a.action))return null;
 const p=armPose(a),propsVisible=a.phase!=='finish-action'||a.phaseTime/a.phaseDuration<.85,key=[a.id==='crew-5'?'apricot':'blue',p.role,a.action,p.v,p.hand.x.toFixed(2),p.hand.y.toFixed(2),p.bookState,propsVisible,p.mirror].join('|');if(actionFrames.has(key))return actionFrames.get(key);
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 g.drawImage(characterImage(a,p.r.body,p.role.endsWith('-front')?'front':'right'),0,0);
 const cuff={x:p.hand.x-(p.hand.x-p.elbow.x)*.19,y:p.hand.y-(p.hand.y-p.elbow.y)*.19},w=a.chief?12:15;
 for(const [width,color]of [[w+3,'#20283e'],[w,'#343653'],[w-5,'#494b6e']]){pixelBone(g,p.shoulder,p.elbow,width,color);pixelBone(g,p.elbow,cuff,width-1,color);}
 pixelBone(g,{x:cuff.x-1,y:cuff.y-1},{x:p.hand.x,y:p.hand.y},w-1,'#ded9e7');
 pixelBone(g,{x:cuff.x+1,y:cuff.y},{x:p.hand.x,y:p.hand.y},w-5,'#fff5ee');
 const dx=Math.round(p.hand.x-p.r.rest[0]),dy=Math.round(p.hand.y-p.r.rest[1]);if(a.action!=='coffee')g.drawImage(p.r.hand,dx,dy);
 if(a.action==='coffee'){
  if(propsVisible)drawCoffeeCup(g,p);g.drawImage(coffeeHandImage(p),dx,dy);
 }else if(a.action==='read'){
  // Pointer only: the hand belongs to the replacement arm. No paper/file prop.
  pixelBone(g,{x:p.hand.x+4,y:p.hand.y-2},{x:p.hand.x+52,y:p.hand.y-14},2,'#dcc897');
 }else if(a.action==='book'&&['take','read','return'].includes(p.bookState)){
  const x=Math.round(p.hand.x+1),y=Math.round(p.hand.y-8),open=p.bookState==='read';
  g.fillStyle='#26364c';g.fillRect(x-2,y-2,open?28:15,23);g.fillStyle='#5895a5';g.fillRect(x,y,open?24:11,19);g.fillStyle='#f0e3c6';g.fillRect(x+2,y+2,open?20:7,14);g.fillStyle='#bd9b67';g.fillRect(x+(open?12:2),y+1,2,17);g.fillStyle='#8b9ca5';for(let i=0;i<3;i++)g.fillRect(x+4,y+5+i*3,open?6:3,1);if(open)for(let i=0;i<3;i++)g.fillRect(x+16,y+5+i*3,5,1);
 }
 const opaque=g.getImageData(0,0,256,256);for(let i=3;i<opaque.data.length;i+=4)if(opaque.data[i]>=235)opaque.data[i]=255;g.putImageData(opaque,0,0);let result=c;if(p.mirror){result=document.createElement('canvas');result.width=result.height=256;const fg=result.getContext('2d');fg.imageSmoothingEnabled=false;fg.translate(256,0);fg.scale(-1,1);fg.drawImage(c,0,0)}result.__alreadyPersonalColor=a.id==='crew-5';result.__registration={id:'action-'+p.role+'-'+a.action,anchor:{x:128,y:236},bodyHeight:p.r.bodyHeight};if(actionFrames.size>=900)actionFrames.delete(actionFrames.keys().next().value);actionFrames.set(key,result);return result;
}
function actionHand(a){const p=armPose(a),v=visualPoint(a),scale=actorMetrics(a).height/p.r.bodyHeight;return {x:v.x+((p.mirror?256-p.hand.x:p.hand.x)-128)*scale,y:v.y+(p.hand.y-236)*scale};}
const skillBooks=Object.freeze([
 {id:'planning',title:'任务规划',description:'检查可用技能，拆分任务并安排同伴。'},
 {id:'research',title:'资料检索',description:'阅读检索技能的步骤与来源要求。'},
 {id:'coding',title:'代码实现',description:'查看代码编辑与运行检查的操作说明。'},
 {id:'design',title:'视觉设计',description:'查阅像素素材、构图与动画的工作方法。'},
 {id:'writing',title:'内容写作',description:'查阅写作技能的结构与表达要求。'},
 {id:'quality',title:'质量检查',description:'复核动作、遮挡与通行的检查项目。'},
 {id:'organize',title:'资料整理',description:'查看文件归档与索引的方法。'}
]);
function inspectSkills(agent=selectedId){const a=typeof agent==='string'?agents.find(v=>v.id===agent):agent;return a?request(a,'book'):false;}

const settings={phase:'dusk',ambient:78,glow:68,lamps:true,screens:true,cycle:false,auto:false,paused:false,debug:false,labels:true,zoom:1};
const screens=[{x:355,y:386,w:67,h:34},{x:541,y:388,w:68,h:32},{x:347,y:563,w:71,h:34},{x:541,y:569,w:72,h:33},{x:335,y:750,w:73,h:34},{x:543,y:751,w:73,h:34}];
const lamps=[{x:204,y:180},...screens.map(s=>({x:s.x-12,y:s.y-10})),{x:404,y:990},{x:557,y:993},{x:150,y:1160},{x:773,y:1164},{x:252,y:1362},{x:498,y:1419},{x:548,y:1496}];
const labels={work:'办公',working:'专心办公',walking:'行走',turn:'转身',align:'调整朝向','seat-align':'转向座位',dock:'走近设施',lower:'坐下',rise:'起身',undock:'离开座位',waiting:'等候空位',yield:'礼让通行',coffee:'冲泡 / 品咖啡',pond:'喂鱼',rest:'沙发休息',read:'看白板',idle:'自由待机',bench:'长椅休息',chair:'庭院圆桌入座','finish-action':'结束动作',book:'取书 / 查阅 skills'};
const names=['鲸理理','小澜','泡泡','汐汐','蓝莓','咕噜','眠眠'],jobs=['主管','资料检索','代码实现','视觉设计','内容写作','质量检查','资料整理'],tools=['统筹巡场','web.search','pwsh','skill','str_replace_editor','fs.search','present'];
const occupancy=new Map(),agents=names.map((name,i)=>{const spot=world.spots.find(s=>s.id===(i?'desk-'+(i-1):'chief-work'));occupancy.set(spot.id,i);return {id:i?'crew-'+(i-1):'chief',index:i,name,chief:!i,job:jobs[i],tool:tools[i],home:spot.id,x:spot.anchor.x,y:spot.anchor.y,spot,goal:null,action:'work',state:'working',pending:null,waitTime:0,blocked:0,repathAt:0,phase:'loop',phaseTime:0,phaseDuration:0,path:[],speed:0,gait:i*9,dir:spot.face,previousDir:spot.face,turnBlend:1,sit:1,dock:1,loopTime:i*.3,until:24+i*11,sequence:0,queue:null,feedTimer:0}});
let nextEnvironmentPhase=90;
let elapsed=0,last=0,accumulator=0,lastDraw=0,lastUI=0,selectedId='crew-0',toastTimer,marker=null,error=null,food=[],foodCount=0,completed=[],phaseHistory=[];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=t=>{t=clamp(t);return t*t*(3-2*t)},lerp=(a,b,t)=>a+(b-a)*t,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),selected=()=>agents.find(a=>a.id===selectedId);
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2100)}
function phase(a,p,duration=0){a.phase=p;a.phaseTime=0;a.phaseDuration=duration;phaseHistory.push({agent:a.id,phase:p,at:elapsed});if(phaseHistory.length>3500)phaseHistory.splice(0,500)}
function direction(a,d){if(d&&d!==a.dir){a.previousDir=a.dir;a.dir=d;a.turnBlend=0}}
// Keep a stable heading around the diagonal; frame deltas are not exact at 45 degrees.
function faceVector(a,dx,dy){const ax=Math.abs(dx),ay=Math.abs(dy);if(ax+ay<.01)return;const h=dx<0?'left':'right',v=dy<0?'up':'front';direction(a,ax>ay*1.12?h:ay>ax*1.12?v:(a.dir===h||a.dir===v)?a.dir:h)}
function railDuration(spot){if(!spot?.rail)return .5;return Math.max(.5,spot.rail.slice(1).reduce((n,p,i)=>n+dist(p,spot.rail[i]),0)/48)}
function railPoint(spot,t){if(!spot?.rail)return spot?.anchor;const ps=spot.rail,lengths=ps.slice(1).map((p,i)=>dist(p,ps[i])),total=lengths.reduce((a,b)=>a+b,0);let d=clamp(t)*total;for(let i=0;i<lengths.length;i++){if(d<=lengths[i])return {x:lerp(ps[i].x,ps[i+1].x,d/lengths[i]),y:lerp(ps[i].y,ps[i+1].y,d/lengths[i])};d-=lengths[i]}return ps.at(-1)}
function visualPoint(a){const p=a.spot?.rail?railPoint(a.spot,a.dock):{x:a.x,y:a.y};return {x:p.x,y:p.y+actorMetrics(a).seatOffset*clamp(a.sit)}}
function release(a,s){if(s&&occupancy.get(s.id)===a.index)occupancy.delete(s.id)}
function available(a,s){if(s.chief&&!a.chief)return false;if(occupancy.has(s.id)&&occupancy.get(s.id)!==a.index)return false;if(s.action==='rest')for(const [id,owner]of occupancy){const other=world.spots.find(t=>t.id===id);if(other?.action==='rest'&&owner!==a.index)return false}return true}
function reserve(a,s){if(!available(a,s))return false;occupancy.set(s.id,a.index);return true}
function chooseSpot(a,action,explicit=null){if(explicit){const s=world.spots.find(s=>s.id===explicit);return s&&available(a,s)?s:null}if(action==='work')return world.spots.find(s=>s.id===a.home);return world.spots.filter(s=>s.action===action&&available(a,s)).sort((s,t)=>dist(s.anchor,a)-dist(t.anchor,a))[0]}
function request(a,action,point=null,quiet=false,explicit=null){if(typeof a==='string')a=agents.find(v=>v.id===a);if(!a)return false;if(explicit&&world.spots.find(s=>s.id===explicit)?.chief&&(!a.chief||action!=='work'||point))return false;if(settings.paused&&!quiet){toast('请先继续场景');return false}let target;
 if(point){if(!world.walkable(point.x,point.y)){if(!quiet)toast('这里是家具、墙或水面，请选择地面与台阶');return false}const n=world.nearest(point.x,point.y,10);if(!n||!world.segmentSafe(point,n)){if(!quiet)toast('这个位置无法安全停留');return false}target={id:'point-'+a.id+'-'+n.x+'-'+n.y,action:'idle',name:'指定地面',anchor:{x:n.x,y:n.y},face:a.dir,temporary:true}}
 else target=chooseSpot(a,action,explicit);if(!target){if(a.queue&&a.queue.target.id!==a.spot?.id)release(a,a.queue.target);a.queue=null;a.pending={action,explicit,at:elapsed};if(!quiet){toast('已排队，空位释放后自动前往')}return true}a.pending=null;if((a.phase==='loop'&&a.spot?.id===target.id&&a.action===action)||(a.goal?.target.id===target.id&&a.goal.action===action)||(a.trip?.target.id===target.id&&a.trip.action===action)){if(a.queue&&a.queue.target.id!==target.id&&a.queue.target.id!==a.spot?.id)release(a,a.queue.target);a.queue=null;return true;}if(!reserve(a,target))return false;
 const command={action,target,quiet};if(a.queue&&a.queue.target.id!==target.id&&a.queue.target.id!==a.spot?.id)release(a,a.queue.target);a.queue=command;
 dispatch(a);
 if(!quiet){updateUI()}return true;
}
const trafficClaims=new Map();
function pointSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1));return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t)}
function segmentDistance(a,b,c,d){const cross=(u,v,w)=>(v.x-u.x)*(w.y-u.y)-(v.y-u.y)*(w.x-u.x);if(cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0&&Math.max(a.x,b.x)>=Math.min(c.x,d.x)&&Math.max(c.x,d.x)>=Math.min(a.x,b.x)&&Math.max(a.y,b.y)>=Math.min(c.y,d.y)&&Math.max(c.y,d.y)>=Math.min(a.y,b.y))return 0;return Math.min(pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b))}
function routesConflict(p,q){for(let i=1;i<p.length;i++)for(let j=1;j<q.length;j++)if(segmentDistance(p[i-1],p[i],q[j-1],q[j])<36)return true;return false}
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

function arrive(a){a.spot=a.goal.target;a.action=a.goal.action;a.goal=null;a.path=[];a.speed=0;a.x=a.spot.anchor.x;a.y=a.spot.anchor.y;a.dock=0;const entry=a.spot.rail?.[1];if(entry)faceVector(a,entry.x-a.x,entry.y-a.y);else direction(a,a.action==='coffee'?(a.coffeeFacing=['right','front','left'][Math.floor(Math.random()*3)]):a.spot.face||'front');phase(a,'align',.2)}
function settle(a){trafficClaims.delete(a.index);a.sit=a.spot?.seated?1:0;a.dock=a.spot?.rail?1:0;a.loopTime=0;a.feedTimer=.7;a.state=a.action==='work'?'working':a.action;a.until=elapsed+24+a.index*3;a.settledAt=elapsed;phase(a,'loop');completed.push({agent:a.id,action:a.action,spot:a.spot?.id,at:elapsed});if(completed.length>1000)completed.shift();if(a.queue)dispatch(a)}
function finishExit(a){a.sit=0;a.dock=0;release(a,a.spot);a.spot=null;startTravel(a)}
function stepAgent(a,dt){a.phaseTime+=dt;a.turnBlend=clamp(a.turnBlend+dt/.16);
 if(a.phase==='finish-action'){if(a.phaseTime>=a.phaseDuration){a.exitArm=null;finishExit(a)}}
 else if(a.phase==='rise'){a.sit=1-smooth(a.phaseTime/a.phaseDuration);if(a.phaseTime>=a.phaseDuration){a.sit=0;phase(a,'undock',railDuration(a.spot))}}
 else if(a.phase==='undock'){const before=visualPoint(a);const nd=1-smooth(a.phaseTime/a.phaseDuration);if(movementBlocked(a,railPoint(a.spot,nd))){askIdleToMakeWay(a,railPoint(a.spot,nd));a.phaseTime-=dt;return;}a.dock=nd;const after=visualPoint(a);a.gait+=dist(before,after);faceVector(a,after.x-before.x,after.y-before.y);if(a.phaseTime>=a.phaseDuration)finishExit(a)}
 else if(a.phase==='turn'){if(a.phaseTime>=a.phaseDuration)phase(a,'walking')}
 else if(a.phase==='yield'){if(elapsed>=a.repathAt){a.repathAt=elapsed+.22+a.index*.012;const route=travelRoute(a,a.goal.target.anchor);if(route){const full=[...route,...(a.goal.target.rail||[])];if(true){trafficClaims.set(a.index,full);a.path=route.slice(1);a.blocked=0;phase(a,'walking')}}}}

 else if(a.phase==='walking'){trafficShortcut(a);if(a.goal)trafficClaims.set(a.index,[{x:a.x,y:a.y},...a.path,...(a.goal.target.rail||[])]);const remaining=a.path.reduce((n,p,i)=>n+dist(p,i?a.path[i-1]:a),0),desired=Math.min(64,Math.sqrt(2*210*Math.max(0,remaining)));a.speed=lerp(a.speed,desired,Math.min(1,dt*8));let budget=Math.max(4,a.speed)*dt;while(a.path.length&&budget>0){const p=a.path[0],d=dist(a,p),move=Math.min(d,budget);if(d<.01){a.path.shift();continue}const intended=d<=move?{x:p.x,y:p.y}:{x:a.x+(p.x-a.x)/d*move,y:a.y+(p.y-a.y)/d*move},next=trafficStep(a,intended,move);if(!next){a.blocked+=dt;a.speed=0;if(a.blocked>.12||!world.segmentSafe(a,intended)){phase(a,"yield");a.repathAt=elapsed+.05;}break}if(!world.segmentSafe(a,next)){(window.OfficeNavigationCorrections||=[]).push({actor:a.id,x:a.x,y:a.y,next,target:a.goal?.target.id,at:elapsed});a.speed=0;a.blocked=0;phase(a,'yield');a.repathAt=elapsed+.2;break}const blocked=movementBlocked(a,next);if(blocked){a.blocked+=dt;a.speed=0;if(a.blocked>.18){phase(a,'yield');a.repathAt=elapsed+.15+a.index*.035}break}a.blocked=0;faceVector(a,next.x-a.x,next.y-a.y);a.x=next.x;a.y=next.y;a.gait+=move;budget-=move;if(dist(a,p)<.01)a.path.shift()}if(!a.path.length)arrive(a)}
 else if(a.phase==='align'){if(a.phaseTime>=a.phaseDuration){if(a.spot?.rail)phase(a,'dock',railDuration(a.spot));else if(a.spot?.seated)phase(a,'seat-align',.22);else settle(a)}}
 else if(a.phase==='dock'){const before=visualPoint(a);const nd=smooth(a.phaseTime/a.phaseDuration);if(movementBlocked(a,railPoint(a.spot,nd))){askIdleToMakeWay(a,railPoint(a.spot,nd));a.phaseTime-=dt;return;}a.dock=nd;const after=visualPoint(a);a.gait+=dist(before,after);if(a.dock<.9)faceVector(a,after.x-before.x,after.y-before.y);if(a.phaseTime>=a.phaseDuration){a.dock=1;direction(a,a.spot.face);if(a.spot.seated)phase(a,'seat-align',.22);else settle(a)}}
 else if(a.phase==='seat-align'){if(a.phaseTime>=a.phaseDuration)phase(a,'lower',.85)}
 else if(a.phase==='lower'){a.sit=smooth(a.phaseTime/a.phaseDuration);if(a.phaseTime>=a.phaseDuration)settle(a)}
 else if(a.phase==='loop'){a.loopTime+=dt;if(!window.OFFICE_MANAGED&&a.pending&&a.action!=='work'&&!a.queue){const home=world.spots.find(s=>s.id===a.home);reserve(a,home);a.queue={action:'work',target:home,quiet:true};dispatch(a)}if(a.pending&&elapsed-(a.lastPendingTry||0)>.75){a.lastPendingTry=elapsed;const wanted=a.pending;if(!a.queue&&(wanted.point||chooseSpot(a,wanted.action,wanted.explicit)))request(a,wanted.action,wanted.point||null,true,wanted.explicit)}if(!window.OFFICE_MANAGED&&!a.pending&&!a.queue&&a.action!=='work'&&a.loopTime>12&&agents.some(b=>b!==a&&(b.pending?.action===a.action||b.queue?.action===a.action||b.trip?.action===a.action||b.goal?.action===a.action))){request(a,'work',null,true)}if(a.action==='pond'){a.feedTimer-=dt;if(a.feedTimer<=0){spawnFood(a);a.feedTimer=3.6}}if(a.queue){dispatch(a)}else if(settings.auto&&!a.pending&&elapsed>a.until){const seq=['work','coffee','work','pond','bench','read','book','chair','work','rest','idle'];const action=seq[(a.sequence++ +a.index)%seq.length];request(a,action,null,true);a.until=elapsed+18}}
}
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

function tick(dt){elapsed+=dt;syncReality();window.WhaleOfficeLive?.tick(dt);if(settings.cycle&&elapsed>=nextEnvironmentPhase){const phases=['dawn','day','dusk','night'];setPhase(phases[(phases.indexOf(settings.phase)+1)%4]);}updateTrafficProgress();for(const a of agents){releaseCongestion(a);stepAgent(a,dt);}for(let i=food.length-1;i>=0;i--){food[i].age+=dt;if(food[i].age>3)food.splice(i,1)}}
function feedingHand(a){return actionHand(a)}
function spawnFood(a){const hand=feedingHand(a),target=a.spot?.feed||{x:689,y:1410};for(let i=0;i<5;i++)food.push({x:hand.x,y:hand.y,tx:target.x+(i-2)*6,ty:target.y+Math.sin(i)*8,age:-i*.06});foodCount+=5;if(food.length>100)food.splice(0,food.length-100)}
function motion(a,dir=a.dir){const moving=['walking','dock','undock'].includes(a.phase),face=dir==='up'?'back':dir==='front'?'front':dir==='left'?'left':'right',role=a.chief?'chief':'crew',stride=face==='left'||face==='right'?(A.walk.sideStrideByRole?.[role]||A.walk.sideStride):(A.walk.depthStride||32),frame=Math.floor(((a.gait%stride)+stride)%stride/stride*16);return {key:moving?'walk-'+role+'-'+face+'-'+frame:'stand-'+role+'-'+face,flip:false,frame,moving}}
function appearance(a){const role=a.chief?'chief':'crew',height=actorMetrics(a).height,progress=clamp(a.sit),seated=progress>.001,dir=seated?(a.spot?.face||a.dir):a.dir,face=dir==='up'?'back':dir==='front'?'front':dir==='left'?'left':'right',frame=Math.round(progress*16),m=motion(a),seatRole=(a.spot?.action==='chair'?'chair-':'')+role,key=seated?(a.phase==='loop'?'seatloop-'+seatRole+'-'+face+'-'+Math.floor((a.loopTime%2.4)/2.4*16):'seat-'+seatRole+'-'+face+'-'+frame):m.key;return {key,role,height,scale:height/actorMetrics(a).bodyHeight,seated,progress,face,frame,bob:a.phase==='loop'?Math.sin(a.loopTime*2+a.index)*.7:0}}
function drawSprite(image,x,y,h,flip=false,alpha=1,target=ctx){if(!image||alpha<.005)return;target.save();target.globalAlpha=alpha;const registration=image.__registration;if(registration){const scale=h/registration.bodyHeight;target.translate(x,y);target.imageSmoothingEnabled=false;target.drawImage(image,-registration.anchor.x*scale,-registration.anchor.y*scale,image.width*scale,image.height*scale)}else{const w=h*image.width/image.height;target.translate(Math.round(x),Math.round(y));if(flip)target.scale(-1,1);target.drawImage(image,-Math.round(w/2),-Math.round(h),Math.round(w),Math.round(h))}target.restore()}
function actorDepth(a){const p=visualPoint(a);if(a.spot?.desk!==undefined&&a.dock>0){const table=layers.find(l=>l.id==='desk-'+a.spot.desk);return Math.max(p.y,table.depth+1)}if(a.spot?.action==='rest'&&a.phase!=='loop')return Math.max(410,p.y);return a.spot?.chief&&a.dock>0?a.spot.depth:a.spot?.depth&&a.dock>.75?a.spot.depth:p.y}
const personalImages=new WeakMap();
function cAccessoryRegion(x,y,face){
 const xx=face==='left'?255-x:x,side=face==='left'||face==='right';
 // Bows and the complete fins sit outside the facial/iris area. Include their
 // pale blue undersides and navy shadows, rather than leaving rectangular holes.
 if(y>=86&&y<=140&&(side?xx<125:x<96||x>165))return true;
 if(side&&xx<94&&y>140&&y<191)return true; // Hair behind the fin and above the tail.
 const polygon=side?[[9,127],[40,136],[57,159],[54,176],[98,176],[120,197],[112,216],[76,218],[48,211],[26,189],[9,170]]:
  face==='back'?[[165,211],[170,203],[170,190],[186,190],[199,182],[199,166],[207,151],[225,138],[235,146],[239,171],[227,190],[218,204],[207,216],[188,224],[168,222]]:
  [[170,207],[193,194],[202,181],[207,166],[207,153],[216,138],[234,130],[242,146],[243,167],[232,185],[223,193],[219,208],[206,218],[188,223],[172,220]];
 let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [ax,ay]=polygon[i],[bx,by]=polygon[j];
  if((ay>y)!==(by>y)&&xx<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }return inside;
}
function cColorRegion(x,y,face){
 const xx=face==='left'?255-x:x,side=face==='left'||face==='right';
 if(y<24||y>224)return false;
 if(!side&&face==='front'&&(((x-110)/9)**2+((y-117)/13)**2<=1||((x-144)/10)**2+((y-113)/13)**2<=1))return false;
 if(side&&((xx-151)/9)**2+((y-114)/13)**2<=1)return false;
 if(cAccessoryRegion(x,y,face))return 3;
 if(y>219)return false;
 if(!side){
  // Protect the whole iris, including its upper rim under the eyelashes.
  if(face==='front'&&(((x-110)/9)**2+((y-117)/13)**2<=1||((x-144)/10)**2+((y-113)/13)**2<=1))return false;
  if(y>=133&&y<=169&&((x>=89&&x<=106)||(x>=153&&x<=171)))return 2;
  if(y<140)return true;
  if(face==='back'&&y<190)return true;
  if(y<203&&(x<94||x>165))return true;
  return (x>179&&y>=132&&y<219)||(x>172&&y>208&&y<219);
 }
 if(((xx-151)/9)**2+((y-114)/13)**2<=1)return false; // Full side iris and highlights.
 if(y>=130&&y<149&&xx<125)return 2;
 if(y>=139&&y<157&&((xx>=126&&xx<=140)||(xx>=158&&xx<=169)))return 2; // Fin ear.
 if(y<143)return true;
 if(xx<110&&y<203)return true;
 return xx<119&&y>=176&&y<218;
}
function characterImage(a,image,face='front'){
 if(a.id!=='crew-5'||!image||image.__alreadyPersonalColor)return image;
 const registered=image.__registration,id=registered?.id||'',match=id.match(/(?:^|-)(front|back|left|right)(?:-|$)/);if(match)face=match[1];
 let variants=personalImages.get(image);if(variants?.has(face))return variants.get(face);
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);const data=g.getImageData(0,0,c.width,c.height),p=data.data;
 let top=c.height;for(let y=0;y<c.height&&top===c.height;y++)for(let x=0;x<c.width;x++)if(p[(y*c.width+x)*4+3]>100){top=y;break;}
 const dy=top-36;
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
  const i=(y*c.width+x)*4;const region=cColorRegion(x,y-dy,face);if(!p[i+3]||!region)continue;
  const r=p[i]/255,b=p[i+2]/255,green=p[i+1]/255,max=Math.max(r,green,b),min=Math.min(r,green,b),d=max-min,l=(max+min)/2,accessory=region===3;if(d<(accessory?.015:.03)||l<(accessory?.09:.14)||l>(accessory?.97:.9))continue;
  const sat=d/(1-Math.abs(2*l-1));let hue=max===r?((green-b)/d)%6:max===green?(b-r)/d+2:(r-green)/d+4;hue=(hue*60+360)%360;if(hue<(accessory?175:185)||hue>(accessory?275:255)||sat<(accessory?.06:.16)||region===2&&(hue>232||l<.24))continue;
  const yy=y-dy,xx=face==='left'?255-x:x;
  // The navy uniform can share hues with the hair. Protect its authored collar,
  // back waistband and sleeve areas independently of the hair/tail palette.
  if(!accessory&&hue>=232&&((face==='front'&&x>=110&&x<=151&&yy>=132&&yy<=156)||(face==='back'&&x>=96&&x<=169&&yy>=179)||(face==='left'||face==='right')&&xx>=98&&xx<=140&&yy>=143&&yy<=184))continue;

  // Bright tangerine hair/tail: retain pixel shading order and alpha, while lifting
  // midtones and saturation so the result reads as orange rather than brown.
  const h=(26+(hue-218)*.08)/60,s=Math.min(.98,Math.max(.83,sat*1.15)),light=Math.min(.90,l*.84+.17),ch=(1-Math.abs(2*light-1))*s,secondary=ch*(1-Math.abs(h%2-1)),m=light-ch/2;
  let v=h<1?[ch,secondary,0]:[secondary,ch,0];p[i]=Math.round((v[0]+m)*255);p[i+1]=Math.round((v[1]+m)*255);p[i+2]=Math.round((v[2]+m)*255);
 }
 g.putImageData(data,0,0);c.__registration=registered;c.__personalColor={id:'crew-5',face,dy};if(!variants){variants=new Map();personalImages.set(image,variants);}variants.set(face,c);return c;
}

function drawActor(a){const p=visualPoint(a),ap=appearance(a),m=motion(a);const paint=(image,x,y,h,flip=false,alpha=1)=>{const art=characterImage(a,image,ap.face);litSprite(art,x,y,h,flip,alpha);if(settings.labels)drawSprite(art,x,y,h,flip,alpha,nameplateCtx);};if(!ap.seated)actorShadow(a,p);if(a.id===selectedId&&!ap.seated){ctx.strokeStyle='#dfc991';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x,p.y-2,(a.chief?25:23)*actorMetrics(a).gain,7*actorMetrics(a).gain,0,0,Math.PI*2);ctx.stroke()}
 if(ap.seated){paint(sprites[ap.key],p.x,p.y+ap.bob,ap.height);if(a.phase==='loop')paint(sprites['seatbody-'+ap.role+'-'+ap.face],p.x,p.y+ap.bob,ap.height)}
 else if(actionImage(a)){paint(actionImage(a),p.x,p.y,ap.height)}
 else if(a.turnBlend<1&&a.previousDir!==a.dir){const pose=a.turnBlend<.5?motion(a,a.previousDir):m;paint(sprites[pose.key],p.x,p.y+ap.bob,ap.height,pose.flip)}
 else paint(sprites[ap.key],p.x,p.y+ap.bob,ap.height,m.flip);
 if(a.phase==='loop')actionDetails(a,p)
}
function actionDetails(a,position){if(a.action==='coffee'){const h=actionHand(a),sc=actorMetrics(a).height/(a.chief?220:200),sign=a.dir==='left'?-1:1;ctx.save();for(let i=0;i<2;i++){const life=(a.loopTime*.55+i*.5)%1;ctx.fillStyle='rgba(242,238,218,'+(1-life)*.55+')';ctx.fillRect(Math.round(h.x+sign*(7+Math.sin(life*6+i)*2)*sc),Math.round(h.y-(12+life*22)*sc),Math.max(1,Math.round(2*sc)),2)}ctx.restore()}ctx.save();const gain=actorMetrics(a).gain;ctx.translate(position.x,position.y-(a.chief?31:0)*gain);const roleScale=(a.chief?1.15:1)*gain;ctx.scale(roleScale,roleScale);const p={x:0,y:0};
 if(a.action==='rest'){ctx.fillStyle='#d4e7dcaa';ctx.font='13px monospace';ctx.textAlign='center';for(let i=0;i<2;i++){const t=(a.loopTime*.35+i*.5)%1;ctx.globalAlpha=1-t;ctx.fillText('z',p.x+21+t*9,p.y-83-t*24)}}
 else if(a.action==='work'){ctx.fillStyle='#b8e5dd88';if(Math.sin(a.loopTime*12)>0)ctx.fillRect(p.x-9,p.y-38,4,2);else ctx.fillRect(p.x+6,p.y-38,4,2)}
 else if(a.action==='idle'&&a.loopTime%8>6){ctx.fillStyle='#e6d8a7';ctx.font='12px sans-serif';ctx.fillText('♪',p.x+26,p.y-70+Math.sin(a.loopTime*2)*2)}ctx.restore()}
// Authored pond layers use the existing three koi, not substitute dot-shaped fish.
// Native scene coordinates. The generated clean plate is used only under their old silhouettes.
const pondOrigin={x:600,y:1280,w:310,h:260};
const koiShapes=[
 {center:[88,108],angle:.48,period:41,rx:10,ry:6,points:[[71,95],[81,98],[89,102],[96,105],[101,108],[106,112],[106,116],[101,118],[102,122],[96,121],[94,118],[87,117],[83,114],[79,114],[77,110],[74,106],[71,101]]},
 {center:[84,131],angle:-.84,period:47,rx:8,ry:5,points:[[93,119],[94,124],[90,129],[87,132],[85,134],[89,137],[93,144],[86,142],[82,138],[78,138],[75,142],[72,140],[73,135],[74,132],[79,128],[82,124],[87,122]]},
 {center:[72,159],angle:-.55,period:53,rx:10,ry:4,points:[[86,147],[88,151],[86,156],[82,161],[78,164],[79,168],[77,172],[73,168],[71,167],[66,168],[62,167],[59,171],[56,174],[55,169],[57,165],[55,163],[55,159],[60,160],[66,155],[72,152],[80,150]]}
];
const pondBoundary=[[35,66],[50,54],[70,48],[102,42],[133,42],[151,47],[175,50],[195,57],[218,64],[237,77],[250,97],[254,116],[247,147],[235,166],[209,193],[184,216],[155,230],[129,235],[109,224],[88,219],[68,212],[53,200],[43,184],[33,174],[29,159],[19,149],[17,135],[10,119],[13,99],[23,86]];
const fountainIsland=[[144,85],[157,78],[166,75],[178,72],[191,77],[213,91],[223,92],[232,86],[247,94],[253,103],[252,120],[245,135],[242,150],[230,166],[208,167],[188,163],[168,158],[152,152],[137,144],[130,131],[125,117],[128,102],[134,92]];
const lilyPads=[[104,73,22,14],[27,122,20,13],[49,136,24,13],[93,180,23,14],[111,195,24,15],[148,206,22,14]];
function gardenCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function polygonPath(path,points,offset=pondOrigin){path.moveTo(points[0][0]+offset.x,points[0][1]+offset.y);for(const p of points.slice(1))path.lineTo(p[0]+offset.x,p[1]+offset.y);path.closePath();}
const pondOuterPath=new Path2D();polygonPath(pondOuterPath,pondBoundary);
const pondWaterPath=new Path2D();polygonPath(pondWaterPath,pondBoundary);polygonPath(pondWaterPath,fountainIsland);
for(const [x,y,rx,ry]of lilyPads){pondWaterPath.moveTo(x+pondOrigin.x+rx,y+pondOrigin.y);pondWaterPath.ellipse(x+pondOrigin.x,y+pondOrigin.y,rx,ry,0,0,Math.PI*2);pondWaterPath.closePath();}
const pondMask= gardenCanvas(310,260),pondMaskCtx=pondMask.getContext('2d');pondMaskCtx.translate(-600,-1280);pondMaskCtx.clip(pondOuterPath);pondMaskCtx.fillStyle='#fff';pondMaskCtx.fill(pondWaterPath,'evenodd');pondMaskCtx.resetTransform();
const pondWaterPixels=pondMaskCtx.getImageData(0,0,310,260).data;
function pondContains(x,y){x=Math.floor(x-600);y=Math.floor(y-1280);return x>=0&&x<310&&y>=0&&y<260&&pondWaterPixels[(y*310+x)*4+3]===255;}
function clipPond(){ctx.clip(pondOuterPath);ctx.clip(pondWaterPath,'evenodd');}
const pondCleanImages=Object.fromEntries(await Promise.all(Object.entries(window.OfficeGardenAssets.pondClean).map(async([key,src])=>[key,await load(src)])));
const pondCleanCanvas=gardenCanvas(310,260),pondCleanCtx=pondCleanCanvas.getContext('2d'),pondReference=gardenCanvas(310,260),pondReferenceCtx=pondReference.getContext('2d');
const pondRepairMask=gardenCanvas(310,260),pondRepairCtx=pondRepairMask.getContext('2d');
for(const fish of koiShapes){const p=new Path2D();polygonPath(p,fish.points,{x:0,y:0});pondRepairCtx.fillStyle=pondRepairCtx.strokeStyle='#fff';pondRepairCtx.lineWidth=5;pondRepairCtx.lineJoin='round';pondRepairCtx.fill(p);pondRepairCtx.stroke(p);}
const softRepair=gardenCanvas(310,260),softRepairCtx=softRepair.getContext('2d');softRepairCtx.filter='blur(1px)';softRepairCtx.drawImage(pondRepairMask,0,0);pondRepairCtx.clearRect(0,0,310,260);pondRepairCtx.drawImage(softRepair,0,0);
const pondRepair=gardenCanvas(310,260),pondRepairG=pondRepair.getContext('2d'),koiTextures=[];let pondTextureSignature='';
const dayPond=gardenCanvas(310,260),dayPondG=dayPond.getContext('2d');dayPondG.drawImage(environments.day,-600,-1280);const dayPondPixels=dayPondG.getImageData(0,0,310,260).data;
const koiMasks=koiShapes.map(fish=>{
 const c=gardenCanvas(310,260),g=c.getContext('2d'),p=new Path2D();polygonPath(p,fish.points,{x:0,y:0});g.fillStyle='#fff';g.fill(p);const d=g.getImageData(0,0,310,260);
 for(let i=0;i<d.data.length;i+=4){const r=dayPondPixels[i],green=dayPondPixels[i+1],b=dayPondPixels[i+2];if(!(r>green*.72&&r>b*.68&&r>95))d.data[i+3]=0;}
 // Remove isolated water glints: only the connected, original fish silhouette survives.
 const seen=new Uint8Array(310*260),components=[];for(let k=0;k<seen.length;k++)if(!seen[k]&&d.data[k*4+3]){const component=[],queue=[k];seen[k]=1;for(let q=0;q<queue.length;q++){const p=queue[q];component.push(p);const x=p%310,y=Math.floor(p/310);for(let yy=Math.max(0,y-1);yy<=Math.min(259,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(309,x+1);xx++){const n=yy*310+xx;if(!seen[n]&&d.data[n*4+3]){seen[n]=1;queue.push(n);}}}components.push(component);}
 components.sort((a,b)=>b.length-a.length);const keep=new Set(components[0]||[]);for(let k=0;k<seen.length;k++)if(!keep.has(k))d.data[k*4+3]=0;
 g.putImageData(d,0,0);return c;
});
function refreshPondTextures(){
 if(pondTextureSignature===plateSignature)return;pondTextureSignature=plateSignature;
 const current=gardenCanvas(310,260),g=current.getContext('2d');g.drawImage(activePlate,-600,-1280);const d=g.getImageData(0,0,310,260).data,anchors=[[113,105],[110,139],[112,158],[66,110],[66,145]],gain=[0,0,0];
 pondCleanCtx.clearRect(0,0,310,260);pondReferenceCtx.clearRect(0,0,310,260);pondCleanCtx.globalCompositeOperation=pondReferenceCtx.globalCompositeOperation='lighter';
 for(const [key,w]of environmentWeights()){pondCleanCtx.globalAlpha=pondReferenceCtx.globalAlpha=w;pondCleanCtx.drawImage(pondCleanImages[key],0,0,310,260);pondReferenceCtx.drawImage(environments[key],-600,-1280);}
 pondCleanCtx.globalAlpha=pondReferenceCtx.globalAlpha=1;pondCleanCtx.globalCompositeOperation=pondReferenceCtx.globalCompositeOperation='source-over';
 const reference=pondReferenceCtx.getImageData(0,0,310,260).data;
 for(let c=0;c<3;c++){let old=0,next=0;for(const [x,y]of anchors){const k=(y*310+x)*4+c;old+=reference[k];next+=d[k];}gain[c]=Math.max(.45,Math.min(1.3,next/Math.max(1,old)));}
 const repair=pondCleanCtx.getImageData(0,0,310,260);for(let i=0;i<repair.data.length;i+=4)for(let c=0;c<3;c++)repair.data[i+c]=Math.round(repair.data[i+c]*gain[c]);pondRepairG.putImageData(repair,0,0);pondRepairG.globalCompositeOperation='destination-in';pondRepairG.drawImage(pondRepairMask,0,0);pondRepairG.globalCompositeOperation='source-over';
 koiTextures.length=0;
 for(const [i,fish]of koiShapes.entries()){
  const cut=gardenCanvas(310,260),cg=cut.getContext('2d');cg.drawImage(current,0,0);cg.globalCompositeOperation='destination-in';cg.drawImage(koiMasks[i],0,0);
  const normalized=gardenCanvas(56,40),ng=normalized.getContext('2d');ng.imageSmoothingEnabled=false;ng.translate(28,20);ng.rotate(-fish.angle);ng.drawImage(cut,-fish.center[0],-fish.center[1]);koiTextures.push(normalized);
 }
}
function koiPose(index,time=elapsed){
 const f=koiShapes[index],theta=time*Math.PI*2/52-Math.PI/2+index*Math.PI*2/3,baseX=698+Math.cos(theta)*18,baseY=1410+Math.sin(theta)*31;
 let x=baseX,y=baseY,heading=Math.atan2(Math.cos(theta)*31,-Math.sin(theta)*18),interest=0;
 const bites=food.filter(p=>p.age>.82+index*.13&&p.age<2.8);
 if(bites.length){const target=bites[0],age=target.age-.82-index*.13;interest=smooth(age/.55)*(1-smooth((target.age-2)/.8));const dx=target.tx-baseX,dy=target.ty-baseY,d=Math.hypot(dx,dy)||1,reach=Math.min(6,d*.18)*interest,candidate={x:baseX+dx/d*reach,y:baseY+dy/d*reach};if(pondContains(candidate.x,candidate.y)){x=candidate.x;y=candidate.y;}const aim=Math.atan2(dy,dx),delta=Math.atan2(Math.sin(aim-heading),Math.cos(aim-heading));heading+=delta*interest*.65;}
 return {x,y,heading,interest};
}
function gardenTint(kind,alpha=1){const palettes={jet:{dawn:[255,235,211],day:[122,232,250],dusk:[255,188,91],night:[108,213,251]},white:{dawn:[255,250,235],day:[229,255,255],dusk:[255,239,192],night:[216,245,255]},water:{dawn:[244,225,235],day:[145,236,239],dusk:[255,218,153],night:[116,215,244]}},rgb=[0,0,0];for(const [key,w]of environmentWeights())for(let c=0;c<3;c++)rgb[c]+=palettes[kind][key][c]*w;return `rgba(${rgb.map(Math.round).join(',')},${alpha})`;}
function pondArt(){
 refreshPondTextures();ctx.save();clipPond();ctx.drawImage(pondRepair,600,1280);
 // Surface light travels continuously; it cannot spill onto lily pads or the island.
 for(let i=0;i<7;i++){const t=(elapsed/7+i/7)%1,x=675+(i*29)%145,y=1356+(i*31)%122;ctx.strokeStyle=gardenTint('water',Math.sin(t*Math.PI)*.13);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,4+t*17,1+t*6,-.15,0,Math.PI*1.65);ctx.stroke();}
 for(const [i,f]of koiShapes.entries()){
  const p=koiPose(i);ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.rotate(p.heading);
  const image=koiTextures[i];for(let column=0;column<56;column+=2){const tail=(1-column/56)**2,shift=Math.sin(elapsed*(4.8+p.interest*2)-column*.16+i)*2.2*tail;ctx.drawImage(image,column,0,2,40,column-28,-20+Math.round(shift),2,40);}ctx.restore();
  ctx.strokeStyle=gardenTint('white',.15+p.interest*.22);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x-Math.cos(p.heading)*14,p.y-Math.sin(p.heading)*8,3+Math.sin(elapsed*2+i)**2*4,1.5,p.heading,0,Math.PI*1.5);ctx.stroke();
 }ctx.restore();
}
const fountainRail=[[787,1361],[783,1340],[774,1324],[764,1321],[756,1327],[747,1347],[745,1373],[745,1393]];
function fountainPoint(t){const f=Math.min(.999999,Math.max(0,t))*(fountainRail.length-1),i=Math.floor(f),u=f-i,p0=fountainRail[Math.max(0,i-1)],p1=fountainRail[i],p2=fountainRail[i+1],p3=fountainRail[Math.min(fountainRail.length-1,i+2)],v=c=>.5*((2*p1[c])+(-p0[c]+p2[c])*u+(2*p0[c]-5*p1[c]+4*p2[c]-p3[c])*u*u+(-p0[c]+3*p1[c]-3*p2[c]+p3[c])*u*u*u);return {x:v(0),y:v(1)};}
function fountainArt(){
 ctx.save();const jet=new Path2D();for(let i=0;i<=90;i++){const p=fountainPoint(i/90);if(i)jet.lineTo(p.x,p.y);else jet.moveTo(p.x,p.y);}ctx.strokeStyle=gardenTint('jet',.2);ctx.lineWidth=2;ctx.stroke(jet);
 for(let i=0;i<28;i++){const t=(elapsed*.57+i/28)%1,p=fountainPoint(t),q=fountainPoint(Math.min(1,t+.018));ctx.strokeStyle=gardenTint(i%3?'white':'jet',.85);ctx.lineWidth=i%3?1.4:2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
 for(let i=0;i<5;i++){const u=(elapsed*1.15+i*.2)%1;ctx.strokeStyle=gardenTint('white',(1-u)*.58);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(746,1394,2+u*10,1+u*3,0,0,Math.PI*2);ctx.stroke();const x=746+Math.sin(i*2.7)*u*10,y=1393-Math.sin(u*Math.PI)*7+u*5;ctx.fillStyle=gardenTint('white',(1-u)*.7);ctx.fillRect(Math.round(x),Math.round(y),1,2);}
 ctx.restore();
 // The lower outflow and its spreading rings sit on the pond water plane.
 ctx.save();clipPond();for(let i=0;i<4;i++){const u=(elapsed*.42+i*.25)%1;ctx.strokeStyle=gardenTint('water',(1-u)*.32);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(737,1411,12+u*35,6+u*15,-.25,.55,Math.PI*1.25);ctx.stroke();}ctx.restore();
}
const gardenFlowers=[{x:113,y:1183},{x:347,y:1457},{x:818,y:1200},{x:840,y:1546},{x:184,y:1566}];
function butterflyPose(i,time=elapsed){
 const flower=gardenFlowers[i],t=time/(23+i*3)+i*.21,angle=t*Math.PI*2,nearby=agents.reduce((n,a)=>Math.max(n,1-Math.hypot(visualPoint(a).x-flower.x,(visualPoint(a).y-40)-flower.y)/75),0),land=smooth(((t%1)-.70)/.11)*(1-smooth(((t%1)-.91)/.08))*(1-clamp(nearby));
 return {x:lerp(flower.x+Math.sin(angle)*45,flower.x,land),y:lerp(flower.y-17+Math.sin(angle*2+.3)*23,flower.y,land),land,heading:Math.cos(angle)<0?-1:1};
}
function butterflyArt(){
 const weights=environmentWeights(),night=weights.reduce((n,[k,w])=>n+(k==='night'?w:0),0),dusk=weights.reduce((n,[k,w])=>n+(k==='dusk'?w:0),0);if(night>.995)return;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=(1-night)*(1-dusk*.35);
 for(let i=0;i<gardenFlowers.length;i++){
  const p=butterflyPose(i),wing=Math.round(1+Math.abs(Math.sin(elapsed*(p.land>.8?4:16)+i))*4),color=['#a0d9f1','#f4ce88','#bca5ef','#f5b2cf','#e8dfad'][i];ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(p.heading,1);ctx.fillStyle='#263c4a';ctx.fillRect(-wing-1,-3,wing,6);ctx.fillRect(2,-3,wing,6);ctx.fillStyle=color;ctx.fillRect(-wing,-3,Math.max(1,wing-1),3);ctx.fillRect(2,-3,Math.max(1,wing-1),3);ctx.fillRect(-Math.max(2,wing-1),1,Math.max(1,wing-2),2);ctx.fillRect(2,1,Math.max(1,wing-2),2);ctx.fillStyle='#25364a';ctx.fillRect(0,-3,2,7);ctx.fillRect(-1,-5,1,2);ctx.fillRect(2,-5,1,2);ctx.restore();
 }ctx.restore();
}
function gardenFireflies(night){
 ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const f=gardenFlowers[i%gardenFlowers.length],t=elapsed*(.28+(i%3)*.06)+i*2.13,x=f.x+Math.sin(t)*35,y=f.y+Math.cos(t*.8)*19,alpha=(.12+.65*Math.sin(t*1.8+i)**2)*night,r=4+Math.sin(t)**2*3,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(229,247,156,${alpha*.4})`);g.addColorStop(1,'rgba(229,247,156,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.fillStyle=`rgba(239,249,170,${alpha})`;ctx.fillRect(Math.round(x),Math.round(y),2,2);}ctx.restore();
}
function drawFood(){ctx.save();for(const p of food){if(p.age<0)continue;const t=clamp(p.age/.9);if(t<1){const x=lerp(p.x,p.tx,t),y=lerp(p.y,p.ty,t)-Math.sin(t*Math.PI)*41;ctx.fillStyle='#eac17e';ctx.fillRect(Math.round(x),Math.round(y),3,3)}else{ctx.save();clipPond();const life=clamp((p.age-.9)/1.8);ctx.strokeStyle=`rgba(169,234,244,${(1-life)*.55})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.tx,p.ty,3+life*15,1+life*6,0,0,Math.PI*2);ctx.stroke();ctx.restore();}}ctx.restore();}
window.WhaleGarden={containsWater:pondContains,koiPose,koiShapes,lilyPads,pondBoundary,fountainIsland,butterflyPose,fountainPoint,drawPond:pondArt,drawFountain:fountainArt,drawButterflies:butterflyArt,drawFireflies:gardenFireflies,drawFood,repairMask:pondRepairMask,waterMask:pondMask,get fishTextures(){refreshPondTextures();return koiTextures;}};

// Native 941x1672 coordinates, measured from the six glass apertures.
// The notches preserve the globe at desk 3 and the paper in front of desk 4.
const monitorWindows=[
 {points:[[364,378],[433,378],[433,423],[364,423]]},
 {points:[[544,378],[613,378],[613,423],[544,423]]},
 {points:[[351,547],[430,547],[430,573],[424,574],[418,577],[413,582],[410,588],[409,594],[351,594]]},
 {points:[[546,552],[621,552],[621,599],[546,599]]},
 {points:[[338,734],[414,734],[414,782],[338,782]]},
 {points:[[549,738],[625,738],[625,784],[549,784]]}
].map((r,i)=>{const xs=r.points.map(p=>p[0]),ys=r.points.map(p=>p[1]);return {...r,index:i,x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};});
const screenPower=monitorWindows.map(()=>({from:0,target:0,start:0}));
function screenAmount(i){const p=screenPower[i];if(!p)return 0;const t=smooth((elapsed-p.start)/.72);return lerp(p.from,p.target,t);}
function setScreenPower(i,on){const p=screenPower[i];if(!p)return false;const target=on?1:0;if(p.target!==target){p.from=screenAmount(i);p.target=target;p.start=elapsed;}return true;}
function screenArt(index=null){
 for(const s of index===null?monitorWindows:[monitorWindows[index]]){
  if(!s)continue;const power=settings.screens?screenAmount(s.index):0;
  ctx.save();ctx.globalAlpha=1;ctx.beginPath();ctx.moveTo(...s.points[0]);for(const p of s.points.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip();
  // Fully opaque glass removes the picture baked into both the plate and furniture layer.
  const phase=environmentWeights().reduce((o,[k,w])=>(o[k]=w,o),{}),night=phase.night||0;
  const glass=ctx.createLinearGradient(s.x,s.y,s.x+s.w,s.y+s.h);glass.addColorStop(0,night>.5?'#080f19':'#101a26');glass.addColorStop(1,night>.5?'#101b2a':'#182634');ctx.fillStyle=glass;ctx.fillRect(s.x-1,s.y-1,s.w+2,s.h+2);
  ctx.strokeStyle='#26364a';ctx.lineWidth=2;ctx.stroke();
  // A faint static reflection reads as dark glass, never as a glowing display.
  ctx.fillStyle=night>.5?'#b2cee506':'#d8e4eb0c';ctx.beginPath();ctx.moveTo(s.x+3,s.y+2);ctx.lineTo(s.x+s.w*.48,s.y+2);ctx.lineTo(s.x+s.w*.22,s.y+s.h-2);ctx.lineTo(s.x+2,s.y+s.h-2);ctx.closePath();ctx.fill();
  if(power>.002){
   const band=Math.max(1,s.h*power),top=s.y+(s.h-band)/2;
   ctx.save();ctx.beginPath();ctx.rect(s.x,top,s.w,band);ctx.clip();ctx.globalAlpha=Math.min(1,power*2);ctx.drawImage(activePlate,s.x,s.y,s.w,s.h,s.x,s.y,s.w,s.h);
   if(power>.8){ctx.globalAlpha=.38*power;for(let row=0;row<4;row++){ctx.fillStyle=['#b0deec','#d7e5cd','#d2c399'][row%3];ctx.fillRect(s.x+5,s.y+5+row*6,Math.min(s.w-12,15+(row*9+s.index*7+Math.floor(elapsed*.5)*2)%(s.w-14)),1);}}
   else {ctx.globalAlpha=power*.5;ctx.fillStyle='#b9e8f1';ctx.fillRect(s.x+3,Math.round(s.y+s.h/2),s.w-6,1);}
   ctx.restore();
  }
  ctx.restore();
 }
}

function lighting(){
 // Generated plates supply cast shadows and reflections; this pass adds moving emitters.
 const night=environmentWeights().reduce((n,[k,w])=>n+(k==='night'?w:k==='dusk'?w*.45:k==='dawn'?w*.22:0),0);
 ctx.save();ctx.globalCompositeOperation='screen';
 for(const l of lamps){if(!settings.lamps||l.enabled===false)continue;const strength=settings.glow/100*(.12+night*.32),flicker=1+Math.sin(elapsed*2.3+l.x)*.025,r=45+night*30,g=ctx.createRadialGradient(l.x,l.y,0,l.x,l.y,r);g.addColorStop(0,`rgba(255,188,86,${strength*.6*flicker})`);g.addColorStop(.3,`rgba(245,171,74,${strength*.22})`);g.addColorStop(1,'rgba(245,171,74,0)');ctx.fillStyle=g;ctx.fillRect(l.x-r,l.y-r,r*2,r*2)}
 if(settings.screens&&night>.1)for(const [i,s]of monitorWindows.entries()){const g=ctx.createRadialGradient(s.x+s.w/2,s.y+s.h,2,s.x+s.w/2,s.y+s.h+12,56);g.addColorStop(0,`rgba(92,183,231,${night*.10*screenAmount(i)*settings.glow/100})`);g.addColorStop(1,'rgba(92,183,231,0)');ctx.fillStyle=g;ctx.fillRect(s.x-25,s.y-20,s.w+50,90)}
 ctx.restore();
 const nominal={dawn:86,day:96,dusk:78,night:26}[settings.phase]||78,delta=(nominal-settings.ambient)/100;
 if(Math.abs(delta)>.005){ctx.save();ctx.fillStyle=delta>0?`rgba(8,20,40,${Math.min(.5,delta*.6)})`:`rgba(251,233,202,${Math.min(.20,-delta*.25)})`;ctx.fillRect(0,0,W,H);ctx.restore()}
 if(night>.1)gardenFireflies(night);
}

const nameplateCanvas=document.createElement('canvas');nameplateCanvas.width=W;nameplateCanvas.height=H;
const nameplateCtx=nameplateCanvas.getContext('2d');
const nameplateText=a=>(a.chief?'管理':'打工')+' · '+a.name;
function label(a){
 const g=nameplateCtx,p=visualPoint(a),text=nameplateText(a);g.font='11px "Microsoft YaHei",sans-serif';
 const width=Math.min(170,g.measureText(text).width+15);g.fillStyle='#112235df';g.strokeStyle=a.id===selectedId?'#dcc58f':'#67808e';g.lineWidth=1;
 g.beginPath();g.roundRect(p.x-width/2,p.y+9,width,20,3);g.fill();g.stroke();g.fillStyle=a.id===selectedId?'#f0dda8':'#d7e3e4';g.textAlign='center';g.fillText(text,p.x,p.y+23,width-8);
}
function prepareNameplates(excludeAgent){
 nameplateCtx.globalCompositeOperation='source-over';nameplateCtx.clearRect(0,0,W,H);
 if(settings.labels)for(const a of agents)if(a.id!==excludeAgent)label(a);
 // Every painted sprite subtracts its exact alpha silhouette from this lower layer.
 // Furniture retains its usual depth order, while no nameplate can cover a character.
 nameplateCtx.globalCompositeOperation='destination-out';
}

// Reuse the active light plate for the lamp's foreground and stone pedestal.
function drawPondLampForeground(){
 const outline=[[507,1337],[514,1338],[519,1346],[517,1354],[524,1358],[526,1365],[523,1369],[523,1380],[532,1388],[537,1397],[533,1407],[530,1412],[527,1434],[505,1441],[490,1437],[489,1404],[489,1397],[497,1387],[498,1368],[494,1364],[500,1357],[504,1354],[500,1349],[501,1343]];
 ctx.save();ctx.beginPath();ctx.moveTo(...outline[0]);for(const p of outline.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip();ctx.drawImage(activePlate,0,0,W,H);ctx.restore();
}

function render(excludeAgent=null){prepareNameplates(excludeAgent);ctx.clearRect(0,0,W,H);environmentBase();drawWallClock();floraArt();aquariumArt();screenArt();pondArt();fountainArt();const items=[{pondLamp:true,depth:1444},...layers.map((layer,index)=>({layer,index,depth:layer.depth})),...agents.filter(agent=>agent.id!==excludeAgent).map(agent=>({agent,depth:actorDepth(agent)}))].sort((a,b)=>a.depth-b.depth);for(const i of items){if(i.agent)drawActor(i.agent);else if(i.pondLamp)drawPondLampForeground();else environmentLayer(i.index)}livingPlantArt();butterflyArt();drawFood();lighting();if(settings.labels)ctx.drawImage(nameplateCanvas,0,0);if(!excludeAgent)window.WhaleOfficeLive?.dialogue.render(ctx);if(marker&&elapsed<marker.until){ctx.strokeStyle='#e9d39a';ctx.beginPath();ctx.ellipse(marker.x,marker.y,12,5,0,0,Math.PI*2);ctx.stroke()}if(settings.debug){ctx.fillStyle='#63d6bc35';for(let i=0;i<world.grid.length;i++)if(world.grid[i])ctx.fillRect(i%world.cols*world.GRID,Math.floor(i/world.cols)*world.GRID,world.GRID-1,world.GRID-1);ctx.strokeStyle='#ef9b91';for(const r of world.obstacles){ctx.beginPath();if(r.ellipse){const e=r.ellipse;ctx.ellipse(e.x,e.y,e.rx,e.ry,0,0,Math.PI*2)}else if(r.points){ctx.moveTo(...r.points[0]);r.points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath()}else ctx.rect(r.x,r.y,r.w,r.h);ctx.stroke()}for(const a of agents){ctx.strokeStyle='#efcf8f';ctx.beginPath();ctx.moveTo(a.x,a.y);a.path.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();const v=visualPoint(a);ctx.beginPath();ctx.arc(v.x,v.y,world.RADIUS,0,Math.PI*2);ctx.stroke()}ctx.fillStyle='#f1dd9e';ctx.font='12px sans-serif';for(const s of world.spots)ctx.fillText(s.name,s.anchor.x,s.anchor.y)}}
function updateUI(){for(const el of $('#roster').children){const item=agents.find(a=>a.id===el.dataset.id);el.classList.toggle('selected',item.id===selectedId);el.querySelector('span').textContent=item.pending?'等候'+labels[item.pending.action]:item.queue&&item.phase==='loop'?'等候通行':item.phase==='loop'?labels[item.state]:labels[item.phase]}}
function roster(){for(const a of agents){const b=document.createElement('button');b.className='roster-item';b.dataset.id=a.id;const img=document.createElement('img');img.src=a.id==='crew-5'?characterImage(a,sprites['stand-crew-front'],'front').toDataURL():A.sprites[a.chief?'chief-idle':'worker-idle'].src;img.alt='';const name=document.createElement('b');name.textContent=a.name;const span=document.createElement('span');b.append(img,name,span);b.onclick=()=>{selectedId=a.id;updateUI();toast('已选择 '+a.name)};$('#roster').append(b)}}
function sync(){
 $('#lamps').textContent='台灯 · '+(settings.lamps?'开':'关');$('#lamps').classList.toggle('active',settings.lamps);
 $('#cycle').textContent='锁定现实时间 · '+(settings.realTimeLock?'开':'关');$('#cycle').classList.toggle('active',!!settings.realTimeLock);
 for(const key of ['ambient','glow']){$('#'+key).value=settings[key];$('#'+key+'-value').textContent=settings[key]+'%'}
 document.querySelectorAll('[data-phase]').forEach(b=>b.classList.toggle('active',b.dataset.phase===settings.phase));
}
const realTimeState={from:null,blendAt:-Infinity,lastMinute:-1};settings.realTimeLock=true;settings.cycle=false;
function clockText(date=new Date()){return date.getHours()+':'+String(date.getMinutes()).padStart(2,'0');}
function realityWeightsAt(date=new Date()){
 const m=date.getHours()*60+date.getMinutes()+date.getSeconds()/60,bounds=[{at:300,to:'dawn',from:'night'},{at:480,to:'day',from:'dawn'},{at:1020,to:'dusk',from:'day'},{at:1200,to:'night',from:'dusk'}];
 for(const b of bounds)if(m>=b.at-30&&m<=b.at+30){const t=Math.round(smooth((m-b.at+30)/60)*1000)/1000;return [[b.from,1-t],[b.to,t]].filter(([,v])=>v>.00001);}
 return [[m<300||m>=1200?'night':m<480?'dawn':m<1020?'day':'dusk',1]];
}
function lockedRealityWeights(){const target=realityWeightsAt(),t=smooth((performance.now()-realTimeState.blendAt)/2400);if(!realTimeState.from||t>=1)return target;const weights=new Map(realTimeState.from.map(([k,w])=>[k,w*(1-t)]));for(const[k,w]of target)weights.set(k,(weights.get(k)||0)+w*t);return [...weights].filter(([,w])=>w>.00001);}
function syncReality(force=false){
 if(!settings.realTimeLock)return;const date=new Date(),minute=date.getHours()*60+date.getMinutes();if(!force&&minute===realTimeState.lastMinute)return;realTimeState.lastMinute=minute;
 const weights=realityWeightsAt(date),dominant=weights.reduce((best,p)=>p[1]>=best[1]?p:best)[0];settings.phase=dominant;settings.ambient={dawn:86,day:96,dusk:78,night:26}[dominant];settings.cycle=false;
 if(document.getElementById('cycle'))sync();
}
function toggleReality(){
 const previous=environmentWeights();settings.realTimeLock=!settings.realTimeLock;settings.cycle=false;
 if(settings.realTimeLock){realTimeState.from=previous;realTimeState.blendAt=performance.now();syncReality(true);}
 else environmentMix={fromWeights:previous,to:settings.phase,start:elapsed,startWall:performance.now(),duration:2.4};sync();
}

// The wood/brass clock is painted into each generated lighting plate.
const clockBounds={x:115,y:56,w:136,h:53},clockDisplay={x:125,y:67,w:114,h:32};
const clockPalettes={dawn:{led:'#ffe5ae'},day:{led:'#fff3ce'},dusk:{led:'#ffe0a0'},night:{led:'#c0edfa'}};
const clockSegments={0:[0,1,2,4,5,6],1:[2,5],2:[0,2,3,4,6],3:[0,2,3,5,6],4:[1,2,3,5],5:[0,1,3,5,6],6:[0,1,3,4,5,6],7:[0,2,5],8:[0,1,2,3,4,5,6],9:[0,1,2,3,5,6]};
function drawWallClock(date=new Date()){
 const weights=environmentWeights(),rgb=[0,0,0];for(const [phase,w]of weights){const hex=clockPalettes[phase].led;for(let i=0;i<3;i++)rgb[i]+=parseInt(hex.slice(i*2+1,i*2+3),16)*w;}
 const led='rgb('+rgb.map(Math.round).join(',')+')',value=clockText(date),width=[...value].reduce((n,c)=>n+(c===':'?8:20),0)-4,b=clockDisplay;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.beginPath();ctx.rect(b.x,b.y,b.w,b.h);ctx.clip();ctx.fillStyle=led;ctx.shadowColor=led;ctx.shadowBlur=2;
 let x=Math.round(b.x+(b.w-width)/2),y=b.y+2;
 const segments=[[3,0,10,3],[0,3,3,9],[13,3,3,9],[3,12,10,3],[0,15,3,9],[13,15,3,9],[3,24,10,3]];
 for(const char of value){if(char===':'){if(date.getMilliseconds()<500){ctx.fillRect(x+1,y+7,3,3);ctx.fillRect(x+1,y+18,3,3);}x+=8;continue;}
  for(const i of clockSegments[char]){const r=segments[i];ctx.fillRect(x+r[0],y+r[1],r[2],r[3]);}x+=20;
 }ctx.restore();
}

function setPhase(value){if(!environments[value])return;const before=environmentWeights();settings.realTimeLock=false;environmentMix={fromWeights:before,to:value,start:elapsed,startWall:performance.now(),duration:2.4};settings.phase=value;nextEnvironmentPhase=elapsed+90;settings.ambient={dawn:86,day:96,dusk:78,night:26}[value];sync()}
function zoom(value){settings.zoom=clamp(value,1,2.5);const fit=innerWidth<=620?$('#viewport').clientWidth:Math.min($('#viewport').clientWidth,Math.max(280,(innerHeight-205)*W/H));$('#canvas-wrap').style.width=Math.round(fit*settings.zoom)+'px';$('#zoom-value').textContent=Math.round(settings.zoom*100)+'%'}
document.querySelectorAll('[data-phase]').forEach(b=>b.onclick=()=>setPhase(b.dataset.phase));
for(const key of ['ambient','glow'])$('#'+key).oninput=e=>{settings[key]=Number(e.target.value);sync()};
$('#lamps').onclick=toggleLamps;$('#cycle').onclick=toggleReality;
$('#zoom-in').onclick=()=>zoom(settings.zoom+.25);$('#zoom-out').onclick=()=>zoom(settings.zoom-.25);
addEventListener('resize',()=>zoom(settings.zoom));document.addEventListener('visibilitychange',()=>{last=0;accumulator=0});
function frame(now){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;try{if(!document.hidden&&!settings.paused){accumulator+=dt;while(accumulator>=1/60){tick(1/60);accumulator-=1/60}}if(!document.hidden&&now-lastDraw>=(window.OFFICE_VISIBLE===false?200:1000/30)-1){render();lastDraw=now}if(now-lastUI>250){updateUI();lastUI=now}}catch(e){if(!error){error=e;console.error(e);toast('场景检查发现异常，请查看记录')}}requestAnimationFrame(frame)}
world.path(world.spots[1].anchor,world.spots[9].anchor);syncReality(true);roster();sync();zoom(1);updateUI();requestAnimationFrame(frame);
window.WhaleOffice={agents,settings,world,nameplateText,coffeeCupPose,coffeeHandImage,personalColor:{image:characterImage,region:cColorRegion,sprite:key=>sprites[key],keys:Object.keys(sprites)},wallClock:{bounds:clockBounds,text:clockText,weightsAt:realityWeightsAt,draw:drawWallClock,toggle:toggleReality},standForBriefing,setScreenPower,screenPower,screenAmount,monitorWindows,request,assign:request,findPath:(x,y,tx,ty)=>world.path({x,y},{x:tx,y:ty}),walkable:world.walkable,segmentSafe:world.segmentSafe,visualPoint,motion,appearance,actorMetrics,feedingHand,armPose,actionHand,actionImage,actorDepth,skillBooks,inspectSkills,toolEvent(name,agent){return ['check_skills','skills.list','skills.inspect','read_skill'].includes(name)?inspectSkills(agent):false},occupancy,trafficClaims,trafficEvents,traffic:{tuning:trafficTuning,stats:trafficStats,clearance:bodyClearance,blockers,bodyPoint,step:trafficStep},completed,phaseHistory,render,phase:setPhase,environmentWeights,blendProfile,floraRegions,livingPlants,captureEnvironment(kind,offset){const saved=elapsed;elapsed+=offset;ctx.clearRect(0,0,W,H);environmentBase();if(kind==='plants'){floraArt();livingPlantArt()}if(kind==='aquarium')aquariumArt();if(kind==='pond')pondArt();if(kind==='fountain')fountainArt();if(kind==='butterflies')butterflyArt();const data=canvas.toDataURL();elapsed=saved;render();return data},get elapsed(){return elapsed},get error(){return error},get foodCount(){return foodCount},get food(){return food},select(id){if(agents.some(a=>a.id===id)){selectedId=id;updateUI()}},advance(seconds,draw=true){for(let t=0;t<seconds;t+=1/60)if(!settings.paused)tick(1/60);if(draw){render();updateUI()}},snapshot(){return agents.map(a=>({id:a.id,x:a.x,y:a.y,visual:visualPoint(a),phase:a.phase,state:a.state,action:a.action,sit:a.sit,dock:a.dock,spot:a.spot?.id,goal:a.goal?.target.id,gait:a.gait,facing:a.dir}))}};
window.dispatchEvent(new Event('office-scene-ready'));})().catch(e=>{console.error(e);document.querySelector('#toast').textContent='场景载入失败：'+e.message;document.querySelector('#toast').classList.add('show')});

 (function(){
  const start=()=>{
    if(window.WhaleOfficeLive)return;
    const api=window.WhaleOffice;if(!api){setTimeout(start,100);return;}
    window.WhaleOfficeLive=createOfficeController(api,{
      bind(a){const b=document.querySelector(`[data-id="${a.id}"] b`);if(b)b.textContent=a.chief?'管理 · '+a.name:a.name;},
      cursor(value){parent.postMessage({channel:window.OFFICE_CHANNEL,kind:'dialogue-seen',...value},'*');}
    });
    api.render();
    document.getElementById('scene').getContext('2d').getImageData(0,0,1,1);
    window.WhaleOfficeLive.armStartupClock();
    document.getElementById('scene').onclick=e=>{
      const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*941/r.width,y=(e.clientY-r.top)*1672/r.height;
      const hit=api.agents.find(a=>{const p=api.visualPoint(a);return Math.abs(p.x-x)<40*api.actorMetrics(a).gain&&y<p.y+8&&y>p.y-api.actorMetrics(a).height;});
      if(hit)api.select(hit.id);
    };
    api.settings.auto=false;
    const channel=window.OFFICE_CHANNEL;
    window.addEventListener('message',e=>{
      if(e.source!==parent||!channel||e.data?.channel!==channel)return;
      if(e.data.kind==='snapshot'){window.OfficeProfiles?.apply(e.data.data.officeConfig);window.WhaleOfficeLive.ingest(e.data.data);}
      if(e.data.kind==='disconnected')window.WhaleOfficeLive.disconnected(e.data.reason);
      if(e.data.kind==='visibility')window.OFFICE_VISIBLE=!!e.data.value;
      if(e.data.kind==='dialogue-cursor')window.WhaleOfficeLive.dialogue.restore(e.data.cursors);
    });
    parent.postMessage({channel,kind:'ready'},'*');
  };
  window.addEventListener('office-scene-ready',start);start();
})();

 (function(){
 function start(){
  const api=window.WhaleOffice;if(!api||!window.WhaleOfficeLive){setTimeout(start,100);return;}
  const roster=document.getElementById('roster'),panel=document.createElement('div');panel.className='employee-profile';panel.id='employee-profile';
  panel.innerHTML='<div class="profile-heading"><h3 id="employee-name"></h3><span id="employee-role" class="employee-role"></span></div><p class="employee-intro" id="employee-intro"></p><p class="profile-config-warning" id="profile-config-warning" role="alert"></p>';roster.insertAdjacentElement('afterend',panel);
  const el=id=>document.getElementById(id);let config={profiles:window.OfficeProfileDefaults,dialogue:window.OfficeDialogueDefaults},revision=null;
  const selected=()=>roster.querySelector('.selected')?.dataset.id||'crew-0';
  function render(){const id=selected(),p=config.profiles.员工.find(p=>p.id===id);if(!p)return;el('employee-name').textContent=p.姓名;el('employee-role').textContent=(id==='chief'?'管理 · ':'打工 · ')+p.岗位;el('employee-intro').textContent=p.介绍;}
  function apply(next){if(!next?.profiles?.员工)return;el('profile-config-warning').textContent=next.warning||'';if(next.revision&&next.revision===revision)return;revision=next.revision;config=next;
   for(const a of api.agents){const p=config.profiles.员工.find(p=>p.id===a.id);if(!p)continue;a.name=p.姓名;a.profileRole=p.岗位;a.introduction=p.介绍;const b=roster.querySelector('[data-id="'+a.id+'"] b');if(b)b.textContent=a.chief?'管理 · '+a.name:a.name;}
   window.WhaleOfficeLive.dialogue.configure(next.dialogue);render();
  }
  window.OfficeProfiles={apply,get config(){return config;}};apply(config);render();new MutationObserver(render).observe(roster,{subtree:true,attributes:true,attributeFilter:['class']});
 }
 start();
})();

}

 function expandSceneAssets(bundle){
 const {images,data}=bundle;
 function expand(value){
  if(value&&typeof value==='object'&&Object.keys(value).length===1&&Object.hasOwn(value,'$image')){
   if(!Number.isInteger(value.$image)||value.$image<0||value.$image>=images.length)throw Error('Invalid scene image reference');
   return images[value.$image];
  }
  if(Array.isArray(value))return value.map(expand);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,expand(item)]));
  return value;
 }
 return expand(data);
}
async function decodeSceneResources(data){
 const unpack=async value=>{const raw=Uint8Array.from(atob(value),c=>c.charCodeAt(0)),stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(stream).text());};
 const [scene,bundle]=await Promise.all([unpack(data.scene),unpack(data.assets)]),assets=expandSceneAssets(bundle);
 return {...scene,...assets,defaults:{...assets.defaults,...data.defaults},pollIntervalMs:data.pollIntervalMs};
}


 /** Canvas DOM is confined to the React component's own shadow root. */
 function mountScene(element,resource,onMessage){
  let disposed=false,visible=true;
  const hostDocument=element.ownerDocument,hostWindow=hostDocument.defaultView,shadow=element.attachShadow({mode:'open'});
  const timers=new Set(),intervals=new Set(),frames=new Set(),workers=new Set(),observers=new Set(),listeners=[];
  const bus=new EventTarget(),localWindow=Object.create(null),parent={postMessage:data=>{if(!disposed)onMessage(data);}};
  const trackedTimeout=(fn,ms,...args)=>{const id=hostWindow.setTimeout(()=>{timers.delete(id);if(!disposed)fn(...args);},ms);timers.add(id);return id;};
  const trackedFrame=fn=>{if(disposed)return 0;const id=hostWindow.requestAnimationFrame(time=>{frames.delete(id);if(!disposed)fn(time);});frames.add(id);return id;};
  const listen=(target,name,fn,options)=>{target.addEventListener(name,fn,options);listeners.push(()=>target.removeEventListener(name,fn,options));};
  function scopedListener(name,fn,options){listen(['keydown','pointerdown','click'].includes(name)?element:hostWindow,name,fn,options);}
  function makeObserver(Base){return class extends Base{constructor(fn){super((...args)=>{if(!disposed)fn(...args);});observers.add(this);}};}
  const ScopedWorker=class extends hostWindow.Worker{constructor(...args){super(...args);workers.add(this);}};
  const scopedDocument={querySelector:s=>shadow.querySelector(s),querySelectorAll:s=>shadow.querySelectorAll(s),getElementById:id=>shadow.getElementById(id),createElement:(...args)=>hostDocument.createElement(...args),addEventListener:(n,f,o)=>listen(hostDocument,n,f,o),get hidden(){return hostDocument.hidden||!visible;}};
  Object.assign(localWindow,{OFFICE_CHANNEL:'fish-office-local',OFFICE_INSTANCE:crypto.randomUUID(),OFFICE_VISIBLE:true,
   addEventListener:(...args)=>listen(bus,...args),dispatchEvent:e=>bus.dispatchEvent(e)});
  const scope={window:localWindow,document:scopedDocument,parent,addEventListener:scopedListener,
   requestAnimationFrame:trackedFrame,cancelAnimationFrame:id=>{hostWindow.cancelAnimationFrame(id);frames.delete(id);},
   setTimeout:trackedTimeout,clearTimeout:id=>{hostWindow.clearTimeout(id);timers.delete(id);},
   setInterval:(fn,ms)=>{const id=hostWindow.setInterval(()=>{if(!disposed)fn();},ms);intervals.add(id);return id;},clearInterval:id=>{hostWindow.clearInterval(id);intervals.delete(id);},
   Worker:ScopedWorker,MutationObserver:makeObserver(hostWindow.MutationObserver),ResizeObserver:makeObserver(hostWindow.ResizeObserver)};
  const style=hostDocument.createElement('style');style.textContent=resource.css;
  const content=hostDocument.createElement('div');content.className='fish-document';content.innerHTML=resource.markup;shadow.append(style,content);
  runScene(scope,resource);
  return {element,window:localWindow,shadow,
   send(kind,data={}){if(disposed)return;const event=new Event('message');Object.defineProperties(event,{data:{value:{channel:localWindow.OFFICE_CHANNEL,kind,...data}},source:{value:parent}});bus.dispatchEvent(event);},
   setVisible(value){visible=!!value;localWindow.OFFICE_VISIBLE=visible;},
   dispose(){disposed=true;for(const id of timers)hostWindow.clearTimeout(id);for(const id of intervals)hostWindow.clearInterval(id);for(const id of frames)hostWindow.cancelAnimationFrame(id);for(const worker of workers)worker.terminate();for(const observer of observers)observer.disconnect();listeners.forEach(fn=>fn());element.remove();},
   get diagnostics(){return {disposed,timers:timers.size,frames:frames.size,workers:workers.size};}
  };
 }

 function apply(ctx){
  let disposed=false,runtime=null,resources=null,loadPromise=null,pollTimer=null,abort=null,ready=false,sticky=false,followTimer=null;
  const seats=new Set();let seen={};
  const words={zh:{title:'大肥鱼办公室',open:'打开大肥鱼办公室',loading:'正在载入办公室…',retry:'重试',failed:'办公室载入失败',roster:'鲸鱼工作牌',console:'办公室控制台',dawn:'清晨',day:'白天',dusk:'黄昏',night:'黑夜',ambient:'环境光',glow:'灯光亮度',lamps:'台灯',lock:'锁定现实时间',on:'开',off:'关'},en:{title:'Fish Office',open:'Open Fish Office',loading:'Loading the office…',retry:'Retry',failed:'Office failed to load',roster:'Employee cards',console:'Office console',dawn:'Dawn',day:'Day',dusk:'Dusk',night:'Night',ambient:'Ambient light',glow:'Lamp glow',lamps:'Desk lamps',lock:'Use real time',on:'On',off:'Off'}};
  ctx.effect(()=>ctx.locale.register('dsh-fish-office',words),'fish office translations');
  const t=ctx.locale.bind('dsh-fish-office');
  try{const s=JSON.parse(sessionStorage.getItem('dsh.fish-office.dialogue.v1')||'{}');if(s&&typeof s==='object'&&!Array.isArray(s))seen=s;}catch{}
  const selected=()=>ctx.sidebarRight.mounted.getSnapshot();
  const call=async(payload,signal)=>{const reply=await ctx.connection.rpc.call('/api','fish-office',payload,signal);if(!reply?.ok||!reply.value?.ok)throw Error(reply?.value?.error||t('failed'));return reply.value;};
  function localized(){
   if(!runtime)return;const root=runtime.shadow,set=(selector,value)=>{const e=root.querySelector(selector);if(e&&e.textContent!==value)e.textContent=value;};
   const headings=root.querySelectorAll('aside h2');['roster','console'].forEach((key,i)=>{if(headings[i]&&headings[i].textContent!==t(key))headings[i].textContent=t(key);});
   for(const phase of ['dawn','day','dusk','night'])set('[data-phase="'+phase+'"]',t(phase));
   for(const [id,key]of [['ambient','ambient'],['glow','glow']]){const label=root.getElementById(id)?.closest('label');if(label?.firstChild?.nodeType===3&&label.firstChild.textContent!==t(key)+' ')label.firstChild.textContent=t(key)+' ';}
   const settings=runtime.window.WhaleOffice?.settings;if(settings){set('#lamps',t('lamps')+' · '+t(settings.lamps?'on':'off'));set('#cycle',t('lock')+' · '+t(settings.realTimeLock?'on':'off'));}
  }
  function place(){
   if(!runtime||disposed)return;
   const current=[...seats].filter(s=>s.node.isConnected&&s.info.tab.visible).at(-1);
   if(current){if(runtime.element.parentNode!==current.node)current.node.append(runtime.element);sticky=true;runtime.setVisible(!document.hidden);}
   else{runtime.element.remove();runtime.setVisible(false);}
  }
  async function poll(){
   if(disposed||!ready)return;clearTimeout(pollTimer);abort=new AbortController();const local=abort,guard=setTimeout(()=>local.abort(),12000);
   try{const data=await call({op:'global-snapshot',sessionId:selected()||null},local.signal);if(!disposed){runtime.send('snapshot',{data});localized();}}
   catch(e){if(!disposed)runtime?.send('disconnected',{reason:e.message});}
   finally{clearTimeout(guard);if(abort===local)abort=null;}
   if(!disposed)pollTimer=setTimeout(poll,resources?.pollIntervalMs||1500);
  }
  const listeners=new Set();const notify=()=>listeners.forEach(fn=>fn());let loadError='';
  async function ensureLoaded(){
   if(resources)return resources;if(loadPromise)return loadPromise;
   loadPromise=(async()=>{try{resources=await decodeSceneResources(await call({op:'scene'}));loadError='';return resources;}catch(e){loadError=e.message;notify();throw e;}finally{loadPromise=null;}})();return loadPromise;
  }
  function receive(data){
   if(disposed)return;
   if(data.kind==='dialogue-seen'&&typeof data.rootId==='string'&&data.rootId.length<200&&Number.isSafeInteger(data.seq)){seen[data.rootId]=data.seq;seen=Object.fromEntries(Object.entries(seen).slice(-160));try{sessionStorage.setItem('dsh.fish-office.dialogue.v1',JSON.stringify(seen));}catch{}}
   if(data.kind==='ready'){ready=true;queueMicrotask(()=>{if(disposed)return;runtime.send('dialogue-cursor',{cursors:seen});place();localized();poll();notify();});}
  }
  function Office({useTabInfo}){
   const info=useTabInfo(),host=React.useRef(null),seat=React.useRef(null),[,refresh]=React.useReducer(x=>x+1,0);
   React.useEffect(()=>{listeners.add(refresh);return()=>listeners.delete(refresh);},[]);
   const attach=React.useCallback(()=>ensureLoaded().then(data=>{if(disposed||!seat.current)return;
    if(!runtime){const element=seat.current.node.ownerDocument.createElement('div');element.className='fish-office-scene';element.dataset.officeInstance=crypto.randomUUID();element.style.cssText='height:100%;width:100%';seat.current.node.append(element);runtime=mountScene(element,data,receive);}
    place();refresh();
   }).catch(()=>{}),[]);
   React.useLayoutEffect(()=>{const entry={node:host.current,info};seat.current=entry;seats.add(entry);attach();
    return()=>{seat.current=null;seats.delete(entry);if(runtime?.element.parentNode===entry.node){runtime.element.remove();runtime.setVisible(false);}place();};
   },[]);
   React.useLayoutEffect(()=>{if(seat.current)seat.current.info=info;place();},[info.tab.visible]);
   return h('div',{style:{position:'relative',height:'100%',minWidth:0,color:'var(--dsw-alias-label-primary)',background:'var(--dsw-alias-bg-base)'}},
    h('div',{ref:host,style:{height:'100%',width:'100%'},'data-fish-office-anchor':true}),
    !runtime&&h('div',{role:loadError?'alert':'status',style:{position:'absolute',inset:0,padding:16,background:'var(--dsw-alias-bg-base)'}},loadError?t('failed')+': '+loadError:t('loading'),loadError&&h('button',{onClick:()=>{loadError='';refresh();attach();}},t('retry'))));
  }
  function Launcher(){React.useSyncExternalStore(ctx.locale.subscribe.bind(ctx.locale),ctx.locale.getSnapshot.bind(ctx.locale));return h('button',{title:t('open'),onClick:()=>{sticky=true;ctx.sidebarRight.openTab(KIND,{revealIfOpened:true});},style:{border:'1px solid var(--dsw-alias-border-l1)',borderRadius:7,padding:'6px 10px',background:'var(--dsw-alias-bg-layer-1)',color:'var(--dsw-alias-label-primary)',cursor:'pointer',fontSize:12}},'🐋 '+t('title'));}
  ctx.effect(()=>ctx.sidebarRightTabs.register({id:TAB,kind:KIND,priority:'extension',keepMounted:true,title:()=>t('title')}),'fish office tab type');
  ctx.slots.inject('sidebar.right.pane.tab',()=>ctx.slots.register({name:'sidebar.right.pane.tab',key:TAB},Office));
  ctx.slots.inject('sidebar.right.pane.tab.title',()=>ctx.slots.register({name:'sidebar.right.pane.tab.title',key:TAB},()=>h('span',null,'🐋 '+t('title'))));
  for(const [slot,id]of [['sidebar.footer.action','fish-office-footer'],['conversation.session.header.actions','fish-office-header']])ctx.slots.inject(slot,()=>ctx.slots.register({name:slot,id,order:67,inject:()=>({})},Launcher));
  ctx.effect(()=>ctx.sidebarRight.mounted.subscribe(()=>{clearTimeout(followTimer);if(sticky&&selected())followTimer=setTimeout(()=>{if(!disposed&&sticky)ctx.sidebarRight.openTab(KIND,{revealIfOpened:true});},70);}),'fish office session navigation');
  ctx.effect(()=>ctx.locale.subscribe(localized),'fish office live translations');
  ctx.effect(()=>{document.addEventListener('visibilitychange',place);return()=>document.removeEventListener('visibilitychange',place);},'fish office visibility');
  ctx.on('dispose',()=>{disposed=true;clearTimeout(pollTimer);clearTimeout(followTimer);abort?.abort();runtime?.dispose();listeners.clear();});
 }
 return {name:'fish-office',inject:['slots','sidebarRightTabs','sidebarRight','connection','locale'],apply};
}});

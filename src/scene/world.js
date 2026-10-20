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
/* @include src/walkmask.js */
function walkable(x,y){if(x<0||y<0||x>=W-1||y>=H-1)return false;return groundCell(Math.floor(x+1e-8),Math.floor(y+1e-8))}

function intersects(a,b,r){if(r.points)return inflatedContains(a.x,a.y,r)||inflatedContains(b.x,b.y,r)||polygonEdges(r).some(([c,d])=>edgeDistance(a,b,c,d)<=RADIUS);if(r.ellipse){const ax=(a.x-r.ellipse.x)/(r.ellipse.rx+RADIUS),ay=(a.y-r.ellipse.y)/(r.ellipse.ry+RADIUS),dx=(b.x-a.x)/(r.ellipse.rx+RADIUS),dy=(b.y-a.y)/(r.ellipse.ry+RADIUS),t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));return (ax+dx*t)**2+(ay+dy*t)**2<=1}let lo=0,hi=1;for(const [start,delta,min,max]of [[a.x,b.x-a.x,r.x-RADIUS,r.x+r.w+RADIUS],[a.y,b.y-a.y,r.y-RADIUS,r.y+r.h+RADIUS]]){if(Math.abs(delta)<1e-9){if(start<min||start>max)return false}else{const t1=(min-start)/delta,t2=(max-start)/delta;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>hi)return false}}return lo<=hi}
function segmentSafe(a,b){if(obstacles.some(r=>intersects(a,b,r))||!walkable(a.x,a.y)||!walkable(b.x,b.y))return false;const dx=b.x-a.x,dy=b.y-a.y,ts=[0,1];for(const [v,d]of [[a.x,dx],[a.y,dy]])if(Math.abs(d)>1e-10)for(let n=Math.floor(Math.min(v,v+d))+1;n<Math.max(v,v+d);n++){const t=(n-v)/d;if(t>0&&t<1)ts.push(t)}ts.sort((a,b)=>a-b);for(const t of ts)if(t>1e-8&&t<1-1e-8){const px=a.x+dx*t,py=a.y+dy*t;for(const ex of [-1e-5,1e-5])for(const ey of [-1e-5,1e-5])if(!walkable(px+ex,py+ey))return false;}for(let i=1;i<ts.length;i++){const t=(ts[i-1]+ts[i])/2;if(!walkable(a.x+dx*t,a.y+dy*t))return false}return true}
const cols=Math.ceil(W/GRID),rows=Math.ceil(H/GRID),grid=new Uint8Array(cols*rows),point=i=>({x:i%cols*GRID+GRID/2,y:Math.floor(i/cols)*GRID+GRID/2});
for(let i=0;i<grid.length;i++){const p=point(i);grid[i]=Number(walkable(p.x,p.y))}
function nearest(x,y,max=Infinity){let index=-1,best=max*max;const x0=Number.isFinite(max)?Math.max(0,Math.floor((x-max)/GRID)):0,x1=Number.isFinite(max)?Math.min(cols-1,Math.ceil((x+max)/GRID)):cols-1,y0=Number.isFinite(max)?Math.max(0,Math.floor((y-max)/GRID)):0,y1=Number.isFinite(max)?Math.min(rows-1,Math.ceil((y+max)/GRID)):rows-1;for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){const i=yy*cols+xx;if(!grid[i])continue;const p=point(i),d=(p.x-x)**2+(p.y-y)**2;if(d<=best){index=i;best=d;}}return index<0?null:{index,...point(index),distance:Math.sqrt(best)}}
const edgeCache=new Map(),routeCache=new Map();
function gridEdge(a,b){const key=Math.min(a,b)*grid.length+Math.max(a,b);if(!edgeCache.has(key))edgeCache.set(key,segmentSafe(point(a),point(b)));return edgeCache.get(key)}
/* @include src/pathfinding.js */
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

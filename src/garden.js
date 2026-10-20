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

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
/* @include src/action-ik.js */
function pixelDisc(g,p,r,color){g.fillStyle=color;for(let y=Math.floor(p.y-r);y<=Math.ceil(p.y+r);y++)for(let x=Math.floor(p.x-r);x<=Math.ceil(p.x+r);x++)if((x+.5-p.x)**2+(y+.5-p.y)**2<=r*r)g.fillRect(x,y,1,1);}
function pixelBone(g,a,b,w,color){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*1.5);for(let i=0;i<=n;i++)pixelDisc(g,{x:lerp(a.x,b.x,i/(n||1)),y:lerp(a.y,b.y,i/(n||1))},w/2,color);}
/* @include src/coffee-cup.js */
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
/* @include src/traffic.js */
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
/* @include src/briefing.js */
function tick(dt){elapsed+=dt;syncReality();window.WhaleOfficeLive?.tick(dt);if(settings.cycle&&elapsed>=nextEnvironmentPhase){const phases=['dawn','day','dusk','night'];setPhase(phases[(phases.indexOf(settings.phase)+1)%4]);}updateTrafficProgress();for(const a of agents){releaseCongestion(a);stepAgent(a,dt);}for(let i=food.length-1;i>=0;i--){food[i].age+=dt;if(food[i].age>3)food.splice(i,1)}}
function feedingHand(a){return actionHand(a)}
function spawnFood(a){const hand=feedingHand(a),target=a.spot?.feed||{x:689,y:1410};for(let i=0;i<5;i++)food.push({x:hand.x,y:hand.y,tx:target.x+(i-2)*6,ty:target.y+Math.sin(i)*8,age:-i*.06});foodCount+=5;if(food.length>100)food.splice(0,food.length-100)}
function motion(a,dir=a.dir){const moving=['walking','dock','undock'].includes(a.phase),face=dir==='up'?'back':dir==='front'?'front':dir==='left'?'left':'right',role=a.chief?'chief':'crew',stride=face==='left'||face==='right'?(A.walk.sideStrideByRole?.[role]||A.walk.sideStride):(A.walk.depthStride||32),frame=Math.floor(((a.gait%stride)+stride)%stride/stride*16);return {key:moving?'walk-'+role+'-'+face+'-'+frame:'stand-'+role+'-'+face,flip:false,frame,moving}}
function appearance(a){const role=a.chief?'chief':'crew',height=actorMetrics(a).height,progress=clamp(a.sit),seated=progress>.001,dir=seated?(a.spot?.face||a.dir):a.dir,face=dir==='up'?'back':dir==='front'?'front':dir==='left'?'left':'right',frame=Math.round(progress*16),m=motion(a),seatRole=(a.spot?.action==='chair'?'chair-':'')+role,key=seated?(a.phase==='loop'?'seatloop-'+seatRole+'-'+face+'-'+Math.floor((a.loopTime%2.4)/2.4*16):'seat-'+seatRole+'-'+face+'-'+frame):m.key;return {key,role,height,scale:height/actorMetrics(a).bodyHeight,seated,progress,face,frame,bob:a.phase==='loop'?Math.sin(a.loopTime*2+a.index)*.7:0}}
function drawSprite(image,x,y,h,flip=false,alpha=1,target=ctx){if(!image||alpha<.005)return;target.save();target.globalAlpha=alpha;const registration=image.__registration;if(registration){const scale=h/registration.bodyHeight;target.translate(x,y);target.imageSmoothingEnabled=false;target.drawImage(image,-registration.anchor.x*scale,-registration.anchor.y*scale,image.width*scale,image.height*scale)}else{const w=h*image.width/image.height;target.translate(Math.round(x),Math.round(y));if(flip)target.scale(-1,1);target.drawImage(image,-Math.round(w/2),-Math.round(h),Math.round(w),Math.round(h))}target.restore()}
function actorDepth(a){const p=visualPoint(a);if(a.spot?.desk!==undefined&&a.dock>0){const table=layers.find(l=>l.id==='desk-'+a.spot.desk);return Math.max(p.y,table.depth+1)}if(a.spot?.action==='rest'&&a.phase!=='loop')return Math.max(410,p.y);return a.spot?.chief&&a.dock>0?a.spot.depth:a.spot?.depth&&a.dock>.75?a.spot.depth:p.y}
/* @include src/personal-color.js */
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
/* @include src/garden.js */
/* @include src/screens.js */
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

/* @include src/nameplates.js */
/* @include src/pond-lamp.js */
function render(excludeAgent=null){prepareNameplates(excludeAgent);ctx.clearRect(0,0,W,H);environmentBase();drawWallClock();floraArt();aquariumArt();screenArt();pondArt();fountainArt();const items=[{pondLamp:true,depth:1444},...layers.map((layer,index)=>({layer,index,depth:layer.depth})),...agents.filter(agent=>agent.id!==excludeAgent).map(agent=>({agent,depth:actorDepth(agent)}))].sort((a,b)=>a.depth-b.depth);for(const i of items){if(i.agent)drawActor(i.agent);else if(i.pondLamp)drawPondLampForeground();else environmentLayer(i.index)}livingPlantArt();butterflyArt();drawFood();lighting();if(settings.labels)ctx.drawImage(nameplateCanvas,0,0);if(!excludeAgent)window.WhaleOfficeLive?.dialogue.render(ctx);if(marker&&elapsed<marker.until){ctx.strokeStyle='#e9d39a';ctx.beginPath();ctx.ellipse(marker.x,marker.y,12,5,0,0,Math.PI*2);ctx.stroke()}if(settings.debug){ctx.fillStyle='#63d6bc35';for(let i=0;i<world.grid.length;i++)if(world.grid[i])ctx.fillRect(i%world.cols*world.GRID,Math.floor(i/world.cols)*world.GRID,world.GRID-1,world.GRID-1);ctx.strokeStyle='#ef9b91';for(const r of world.obstacles){ctx.beginPath();if(r.ellipse){const e=r.ellipse;ctx.ellipse(e.x,e.y,e.rx,e.ry,0,0,Math.PI*2)}else if(r.points){ctx.moveTo(...r.points[0]);r.points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath()}else ctx.rect(r.x,r.y,r.w,r.h);ctx.stroke()}for(const a of agents){ctx.strokeStyle='#efcf8f';ctx.beginPath();ctx.moveTo(a.x,a.y);a.path.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();const v=visualPoint(a);ctx.beginPath();ctx.arc(v.x,v.y,world.RADIUS,0,Math.PI*2);ctx.stroke()}ctx.fillStyle='#f1dd9e';ctx.font='12px sans-serif';for(const s of world.spots)ctx.fillText(s.name,s.anchor.x,s.anchor.y)}}
function updateUI(){for(const el of $('#roster').children){const item=agents.find(a=>a.id===el.dataset.id);el.classList.toggle('selected',item.id===selectedId);el.querySelector('span').textContent=item.pending?'等候'+labels[item.pending.action]:item.queue&&item.phase==='loop'?'等候通行':item.phase==='loop'?labels[item.state]:labels[item.phase]}}
function roster(){for(const a of agents){const b=document.createElement('button');b.className='roster-item';b.dataset.id=a.id;const img=document.createElement('img');img.src=a.id==='crew-5'?characterImage(a,sprites['stand-crew-front'],'front').toDataURL():A.sprites[a.chief?'chief-idle':'worker-idle'].src;img.alt='';const name=document.createElement('b');name.textContent=a.name;const span=document.createElement('span');b.append(img,name,span);b.onclick=()=>{selectedId=a.id;updateUI();toast('已选择 '+a.name)};$('#roster').append(b)}}
function sync(){
 $('#lamps').textContent='台灯 · '+(settings.lamps?'开':'关');$('#lamps').classList.toggle('active',settings.lamps);
 $('#cycle').textContent='锁定现实时间 · '+(settings.realTimeLock?'开':'关');$('#cycle').classList.toggle('active',!!settings.realTimeLock);
 for(const key of ['ambient','glow']){$('#'+key).value=settings[key];$('#'+key+'-value').textContent=settings[key]+'%'}
 document.querySelectorAll('[data-phase]').forEach(b=>b.classList.toggle('active',b.dataset.phase===settings.phase));
}
/* @include src/wall-clock.js */
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

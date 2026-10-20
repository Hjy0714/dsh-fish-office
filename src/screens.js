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

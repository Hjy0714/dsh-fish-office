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

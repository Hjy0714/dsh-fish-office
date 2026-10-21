// The generated clock patch contains a lit lamp and warm frame reflections.
// Give the night/off plate its own unlit material pixels; do not reuse the lit patch.
function clockWallPlate(patch,phase,lit){
 if(lit||phase!=='night')return patch;
 const c=document.createElement('canvas');c.width=patch.width;c.height=patch.height;
 const g=c.getContext('2d');g.drawImage(patch,0,0);
 const pixels=g.getImageData(0,0,c.width,c.height),d=pixels.data;
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
  const i=(y*c.width+x)*4,r=d[i],green=d[i+1],b=d[i+2];
  const warm=Math.max(0,Math.min(1,(r-b-5)/22))*Math.max(0,Math.min(1,(r-green+4)/12));
  const bulb=Math.max(0,1-Math.hypot(x-32,y-66)/18)*Math.max(0,Math.min(1,(Math.max(r,green,b)-75)/60));
  const t=Math.max(warm,bulb);
  d[i]=r+(Math.min(26,r*.20)-r)*t;
  d[i+1]=green+(Math.min(34,green*.34)-green)*t;
  d[i+2]=b+(Math.min(53,Math.max(b,green*.60))-b)*t;
 }
 g.putImageData(pixels,0,0);return c;
}

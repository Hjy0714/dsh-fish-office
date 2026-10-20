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

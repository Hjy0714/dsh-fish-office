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

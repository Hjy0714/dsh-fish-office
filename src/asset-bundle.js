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

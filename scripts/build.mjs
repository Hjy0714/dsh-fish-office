import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
// Explicit includes preserve the canvas engine's shared scope without a runtime loader.
function assemble(file,stack=[]){
  if(stack.includes(file))throw Error('Circular source include: '+file);
  return read(file).replace(/\/\* @include ([\w/.-]+) \*\//g,(_,include)=>{
    if(!include.startsWith('src/')||include.split('/').includes('..'))throw Error('Invalid source include: '+include);
    return assemble(include,[...stack,file]);
  });
}
const template=read('src/scene/base.html');
const markup=template.match(/<body>\s*([\s\S]*?)\s*<\/body>/)?.[1];
if(!markup||/<script\b/i.test(markup))throw Error('Scene template must have a script-free body');
const resource={
  markup,
  css:read('src/scene/scene.css'),
  navigationWorker:'self.window=self;\n'+assemble('src/scene/world.js')+'\n'+read('src/scene/navigation-worker.js'),
};
fs.mkdirSync(path.join(root,'lib'),{recursive:true});
fs.writeFileSync(path.join(root,'lib/scene-data.json.gz'),gzipSync(JSON.stringify(resource),{level:9}));
const client=assemble('src/global-client.js'),marker='/*__SCENE_ENGINE__*/';
if(client.split(marker).length!==2)throw Error('Expected one scene entry point');
fs.writeFileSync(path.join(root,'lib/client.js'),client.replace(marker,assemble('src/scene/runtime.js')));
console.log('Built dsh-fish-office '+JSON.parse(read('package.json')).version);

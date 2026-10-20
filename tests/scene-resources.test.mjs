import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneResources} from '../src/scene-resource.mjs';

function loader(){const context=vm.createContext({atob,Blob,Response,DecompressionStream});vm.runInContext(fs.readFileSync(new URL('../src/asset-bundle.js',import.meta.url),'utf8')+';this.api={expandSceneAssets,decodeSceneResources}',context);return context.api;}

test('separate assets and template load into the same complete runtime resource',async()=>{
 const resource=await loader().decodeSceneResources(sceneResources());
 assert.equal(resource.art.width,941);assert.equal(resource.art.height,1672);
 assert(resource.art.sprites['stand-chief-front'].src.startsWith('data:image/'));
 assert(resource.art.sprites['walk-crew-right-0'].src.startsWith('data:image/'));
 assert(resource.defaults.OfficeClockAssets.night.startsWith('data:image/png;'));
 assert(resource.defaults.OfficeGardenAssets.pondClean.day.startsWith('data:image/webp;'));
 assert(resource.navigationWorker.includes('self.onmessage='));
 for(const [key,file]of [['OfficeDialogueDefaults','对白库.json'],['OfficeProfileDefaults','员工档案.json']])assert.equal(JSON.stringify(resource.defaults[key]),JSON.stringify(JSON.parse(fs.readFileSync(new URL('../config/'+file,import.meta.url),'utf8'))));
});

test('deduplicated image references retain their strings and reject invalid indices',()=>{
 const api=loader(),image='data:image/webp;base64,test';
 const data=api.expandSceneAssets({images:[image],data:{front:{$image:0},left:{$image:0},anchor:{x:128,y:236}}});
 assert.equal(data.front,image);assert.equal(data.left,image);assert.equal(data.anchor.y,236);
 for(const index of [-1,.5,1])assert.throws(()=>api.expandSceneAssets({images:[image],data:{$image:index}}),/Invalid scene image/);
});

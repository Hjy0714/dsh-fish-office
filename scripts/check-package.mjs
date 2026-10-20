import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const p=JSON.parse(read('package.json'));
for(const script of ['prepare','prepack','install','postinstall'])assert(!p.scripts[script],'Install-time build hook: '+script);
assert.equal(p.name,'dsh-fish-office');assert.equal(p.license,'MIT');assert(p.engines.dsh);assert(Array.isArray(p.dsh.client.inject));
for(const n of ['README.md','LICENSE','NOTICE','cordis.patch.yml','icon.svg','lib/client.js','src/host.mjs','src/project.mjs','src/projection.mjs','src/office-config.mjs','src/scene-resource.mjs','assets/scene-assets.json.gz'])assert(fs.existsSync(path.join(root,n)),n);
assert.equal(p.main,'./src/host.mjs');assert.equal(p.exports['.'],p.main);assert(!fs.existsSync(path.join(root,'lib/config')));assert(!fs.existsSync(path.join(root,'lib/index.js')));
for(const language of ['zh','en']){const locale=JSON.parse(read('locale/'+language+'.json'));assert(locale.meta.title&&locale.meta.description);}
assert(fs.statSync(path.join(root,'icon.svg')).size<256*1024);assert(read('icon.svg').includes('http://www.w3.org/2000/svg'));
assert(!read('cordis.patch.yml').includes('directory:'));assert(read('cordis.patch.yml').includes('name: dsh-fish-office'));
const client=read('lib/client.js');assert(client.includes("id:'dsh-fish-office'"));assert(!client.includes('document.body'));assert(!client.includes("createElement('iframe')"));assert(!client.includes('/*__SCENE_ENGINE__*/'));
for(const file of fs.readdirSync(path.join(root,'lib')).filter(n=>/\.(mjs|js)$/.test(n))){const result=spawnSync(process.execPath,['--check',path.join(root,'lib',file)],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
for(const name of ['src/host.mjs','src/project.mjs','src/global-client.js','scripts/build.mjs','cordis.patch.yml'])assert(!/[A-Z]:[\\/](?:Users|自媒体)/i.test(read(name)),'machine path in '+name);
const resource=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'lib/scene-data.json.gz'))));assert(resource.markup&&resource.css&&!resource.art&&!resource.defaults);assert(!resource.markup.includes('<script'));assert(!resource.markup.includes('<iframe'));
const assets=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'assets/scene-assets.json.gz'))));assert(assets.images.length&&assets.data.art);assert(!assets.data.defaults.OfficeDialogueDefaults&&!assets.data.defaults.OfficeProfileDefaults);
const headings=[...resource.markup.matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1]);assert.deepEqual(headings,['鲸鱼工作牌','办公室控制台']);
console.log('Package contract, metadata, icon, source paths, syntax and two-panel scene: OK');

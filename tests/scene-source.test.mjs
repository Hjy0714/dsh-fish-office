import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';

const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const template=read('src/scene/base.html');
const retired=/办公室电台|可以试试|鲸落工作室|v0\.5\.1|本地演示|office-compatibility|id="(?:feed|live-status|live-team|live-selected|selected|reset|pause|debug|screens)"/;

test('scene source contains the current two-card interface without retired controls',()=>{
  assert.deepEqual([...template.matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1]),['鲸鱼工作牌','办公室控制台']);
  assert(!retired.test(template));
  assert(!/<script\b|\bhidden\b|data-action=/.test(template));
  assert(template.includes('锁定现实时间'));
  assert(!read('scripts/build.mjs').includes('compatibility'));
});

test('distributed resources use the current template and independent navigation worker',()=>{
  const data=JSON.parse(gunzipSync(fs.readFileSync(new URL('../lib/scene-data.json.gz',import.meta.url))));
  assert.equal(data.markup,template.match(/<body>\s*([\s\S]*?)\s*<\/body>/)[1]);
  assert(!retired.test(data.markup));
  assert.equal(data.css,read('src/scene/scene.css'));
  assert(!data.art&&!data.defaults);
  assert(data.navigationWorker.includes('self.onmessage='));
  assert(!data.navigationWorker.includes('@include'));
  const client=read('lib/client.js');
  assert(!client.includes('@include'));
  assert(!client.includes('office-compatibility'));
  assert(!client.includes("getElementById('screens')"));
});

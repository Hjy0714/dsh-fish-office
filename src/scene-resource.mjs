import fs from 'node:fs';

// Runtime and source share the same asset bundle and editable default JSON files.
export function sceneResources(){
 const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url));
 return {
  encoding:'gzip-base64',
  scene:read('lib/scene-data.json.gz').toString('base64'),
  assets:read('assets/scene-assets.json.gz').toString('base64'),
  defaults:{OfficeDialogueDefaults:JSON.parse(read('config/对白库.json')),OfficeProfileDefaults:JSON.parse(read('config/员工档案.json'))},
 };
}

import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');

test('raised manager office is outside public ground, while its stair entry remains reachable',()=>{
 const source=read('src/scene/world.js'),prefix=source.slice(0,source.indexOf('// Conservative one-pixel'));
 const context=vm.createContext({});vm.runInContext(prefix+'this.map={raw};})();',context);
 for(const p of [[90,130],[170,160],[280,240],[60,300],[280,305],[300,320]])assert.equal(context.map.raw(...p),false,'Private or wall position '+p);
 assert.equal(context.map.raw(344,356),true,'Public approach to the manager seating rail');
});

test('manager seating reservation rejects workers even when the chair is empty',()=>{
 const engine=read('src/scene/engine.js'),source=engine.slice(engine.indexOf('function available('),engine.indexOf('function chooseSpot('));
 const context=vm.createContext({occupancy:new Map(),world:{spots:[]}});vm.runInContext(source+';this.reserveSeat=reserve;',context);
 const chair={id:'chief-work',chief:true,action:'work'};
 assert.equal(context.reserveSeat({index:1,chief:false},chair),false);
 assert.equal(context.occupancy.size,0);
 assert.equal(context.reserveSeat({index:0,chief:true},chair),true);
 assert.equal(context.occupancy.get('chief-work'),0);
});

test('nameplates show only role and name and prepare a sprite alpha occlusion layer',()=>{
 const texts=[],g={measureText:s=>({width:s.length*8}),beginPath(){},roundRect(){},fill(){},stroke(){},fillText:s=>texts.push(s),clearRect(){}};
 const context=vm.createContext({document:{createElement:()=>({getContext:()=>g})},W:941,H:1672,settings:{labels:true},agents:[{id:'chief',chief:true,name:'主管',action:'work',tool:'写代码'},{id:'crew-0',name:'员工',action:'coffee'}],selectedId:'chief',visualPoint:()=>({x:400,y:500})});
 vm.runInContext(read('src/nameplates.js')+';prepareNameplates(null);',context);
 assert.deepEqual(texts,['管理 · 主管','打工 · 员工']);
 assert.equal(g.globalCompositeOperation,'destination-out');
});

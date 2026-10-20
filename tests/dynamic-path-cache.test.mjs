import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
function fixture(){const workers=[],requests=[];let time=0;class Worker{constructor(){workers.push(this);}postMessage(request){requests.push(request);}terminate(){}}
 const ctx=vm.createContext({window:{OFFICE_TEST_SYNC_NAV:false,OFFICE_NAV_WORKER_SOURCE:''},Blob:class{},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},Worker,performance:{now:()=>time},path:()=>null});
 vm.runInContext(fs.readFileSync(new URL('../src/async-paths.js',import.meta.url),'utf8')+';this.api={planPath,pathPending,asyncPathStats}',ctx);workers[0].onmessage({data:{ready:true}});
 return{api:ctx.api,requests,reply(route){const request=requests.at(-1);workers[0].onmessage({data:{owner:request.owner,id:request.id,route,ms:1}});},time:t=>time=t};
}
test('a moved actor invalidates a delivered cached route even when endpoints stay fixed',()=>{const f=fixture(),start={x:0,y:0},end={x:100,y:0},first=[{id:'crew-1',x:50,y:60,radius:16}],moved=[{id:'crew-1',x:50,y:0,radius:16}];
 assert.equal(f.api.planPath('crew-0',start,end,first),null);f.reply([start,end]);assert.equal(f.api.planPath('crew-0',start,end,first).length,2);
 assert.equal(f.api.planPath('crew-0',start,end,moved),null);assert.equal(f.requests.length,2);assert.equal(f.requests[1].avoid[0].y,0);
 f.reply([start,{x:50,y:20},end]);assert.equal(f.api.planPath('crew-0',start,end,moved).length,3);
});
test('moving neighbours do not continually cancel pending searches; static fallback is reported pending',()=>{const f=fixture(),start={x:0,y:0},end={x:100,y:0};
 for(let i=0;i<20;i++)f.api.planPath('crew-0',start,end,[{id:'crew-1',x:50,y:i,radius:16}]);assert.equal(f.requests.length,1);
 f.reply(null);assert.equal(f.api.pathPending('crew-0'),false);
 f.api.planPath('crew-0.static',start,end,[]);assert.equal(f.api.pathPending('crew-0'),true);f.reply([start,end]);assert.equal(f.api.pathPending('crew-0'),false);
});

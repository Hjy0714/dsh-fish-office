import Schema from '@deepseek-ai/schemastery';
import {activityProjection} from './projection.mjs';
import {sceneResources} from './scene-resource.mjs';
import {createReader,createGlobalReader,validId} from './project.mjs';
export const name='fish-office';
export const Config=Schema.object({pollIntervalMs:Schema.number().min(1000).max(10000).default(1500).description('UI refresh interval in milliseconds.')});
export const inject=['connection','sessions','agents','sessionPersistence','sessionProjections'];
import {createOfficeConfig} from './office-config.mjs';
export function apply(ctx,config={}) {
  const officeConfig=createOfficeConfig();
  ctx.effect(()=>ctx.sessionProjections.register(activityProjection),'fish office activity projection');
  const running=new Map();
  for(const session of ctx.sessions.list()){
    const id=session.id||session.header?.id;
    running.set(id,ctx.agents.get(id)?.status==='running');
  }
  ctx.on('agent/status',({agent,status})=>{running.set(agent.id,status==='running');});
  ctx.on('agent/created',({agent})=>{running.set(agent.id,agent.status==='running');});
  ctx.on('agent/disposed',({agent})=>{running.delete(agent.id);});
  const options={isRunning:id=>running.get(id)===true};
  const snapshot = createReader(ctx,options);
  const globalSnapshot=createGlobalReader(ctx,options);
  let packed;
  ctx.effect(()=>ctx.connection.fetch.register({
    path:'/api/fish-office',methods:['POST'],requestBody:'buffered',
    fetch:async request=>{
      let body;try{body=await request.json();}catch{return Response.json({error:'无效 JSON'},{status:400});}
      const {rpcId,payload}=body || {};
      if(typeof rpcId!=='string'||!/^[A-Za-z0-9_-]{1,128}$/.test(rpcId))return Response.json({error:'无效请求'},{status:400});
      const reply=value=>Response.json({type:'server-response',rpcId,result:{ok:true,value}},{headers:{'Cache-Control':'no-store'}});
      try {
        if(payload?.op==='scene') {
          packed ??= sceneResources();
          return reply({ok:true,...packed,pollIntervalMs:config.pollIntervalMs||1500});
        }
        if(payload?.op==='office-config')return reply({ok:true,officeConfig:officeConfig.read()});
        if(payload?.op==='save-profile')return reply({ok:false,error:'请直接修改插件 config/员工档案.json。'});
        if(payload?.op==='global-snapshot')return reply({...await globalSnapshot(payload.sessionId),officeConfig:officeConfig.read()});
        if(payload?.op!=='snapshot'||!validId(payload.sessionId))return reply({ok:false,error:'请选择一个 DSH 会话'});
        return reply(await snapshot(payload.sessionId));
      } catch { return reply({ok:false,error:'无法读取当前会话，稍后将自动重试'}); }
    }
  }),'像素办公室：只读会话与场景通道');
}

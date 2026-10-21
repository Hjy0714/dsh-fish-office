import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const defaults=Object.fromEntries(['对白库.json','员工档案.json'].map(n=>[n,JSON.parse(fs.readFileSync(new URL('../config/'+n,import.meta.url),'utf8'))]));
const ids=new Set(['chief',...Array.from({length:6},(_,i)=>'crew-'+i)]);
const clean=(value,label,max)=>{if(typeof value!=='string'||!value.trim()||[...value.trim()].length>max||/[\u0000-\u001f\u007f]/.test(value))throw Error(label+'须为 1～'+max+' 个字符，不能包含换行或控制字符');return value.trim();};
export function validateProfile(p){if(!p||!ids.has(p.id))throw Error('无效员工编号');return {id:p.id,姓名:clean(p.姓名,'姓名',16),岗位:clean(p.岗位,'岗位',40),介绍:clean(p.介绍,'介绍',600)};}
export function validateProfiles(value){if(!Array.isArray(value?.员工)||value.员工.length!==7)throw Error('员工档案必须保留 7 名员工');const seen=new Set();for(const p of value.员工){validateProfile(p);if(seen.has(p.id))throw Error('员工编号重复');seen.add(p.id);}return {...value,员工:value.员工.map(validateProfile)};}
export function validateDialogue(value,reference=defaults['对白库.json'],prefix=''){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('对白分类格式错误：'+prefix);
 for(const [key,expected]of Object.entries(reference)){
  if(key==='说明'||!prefix&&['问答组','角色专属'].includes(key))continue;
  const item=value[key],label=prefix+key;
  if(Array.isArray(expected)){if(!Array.isArray(item)||!item.length||item.length>200||item.some(s=>typeof s!=='string'||!s.trim()||[...s].length>300||/[\u0000-\u001f]/.test(s)))throw Error(label+' 需要 1～200 条非空短句，每句最多 300 字');}
  else if(typeof expected==='string'){if(typeof item!=='string'||!item.trim()||[...item].length>300)throw Error(label+' 需要一条非空短句，最多 300 字');}
  else validateDialogue(item,expected,label+'.');
 }
 if(!prefix){
  const lines=(v,label)=>{if(!Array.isArray(v)||!v.length||v.length>200)throw Error(label+' 需要 1～200 条短句');v.forEach(x=>clean(x,label,300));};
  const pairs=(groups,label)=>{if(!groups||typeof groups!=='object'||Array.isArray(groups))throw Error(label+' 须为按名称分组的对象');for(const [name,p]of Object.entries(groups)){clean(name,label+'组名',60);if(!p||typeof p!=='object')throw Error(label+name+' 格式错误');if(p.发起引用!==undefined&&p.发起引用!=='主管.常规')throw Error(label+name+' 的发起引用目前只支持主管.常规');lines(p.场景,label+name+'.场景');lines(p.发起,label+name+'.发起');lines(p.回应?.空闲,label+name+'.回应.空闲');lines(p.回应?.忙碌,label+name+'.回应.忙碌');}};
  if(value.问答组!==undefined)pairs(value.问答组,'问答组.');
  if(value.角色专属!==undefined){if(!value.角色专属||typeof value.角色专属!=='object'||Array.isArray(value.角色专属))throw Error('角色专属须按固定员工 id 分组');for(const [id,p]of Object.entries(value.角色专属)){if(!ids.has(id))throw Error('未知角色专属编号：'+id);if(p.工作独白!==undefined)lines(p.工作独白,id+'.工作独白');if(p.空闲独白!==undefined)lines(p.空闲独白,id+'.空闲独白');if(p.问答组!==undefined)pairs(p.问答组,id+'.问答组.');}}
  function exclusive(v,path=[]){if(typeof v==='string'&&/我(?:想要?|在思考)跳槽/.test(v)&&!(path[0]==='角色专属'&&path[1]==='crew-5'))throw Error('跳槽第一人称台词只能放入角色专属.crew-5');if(Array.isArray(v))v.forEach((x,i)=>exclusive(x,[...path,String(i)]));else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v))if(k!=='说明')exclusive(x,[...path,k]);}exclusive(value);
 }
 return value;
}
export function createOfficeConfig(){
 const folder=fileURLToPath(new URL('../config/',import.meta.url));
 const cache=new Map(Object.entries(defaults).map(([file,value])=>[file,{value,signature:null,error:null}]));
 function readFile(file,validate){
  const entry=cache.get(file);
  try{const body=fs.readFileSync(path.join(folder,file),'utf8'),signature=createHash('sha256').update(body).digest('hex');if(signature!==entry.signature){const value=validate(JSON.parse(body.replace(/^\uFEFF/,'')));entry.value=value;entry.signature=signature;}entry.error=null;}
  catch(e){entry.error=file+' 未生效，暂用上次有效配置：'+e.message;}
  return entry.value;
 }
 function read(){const dialogue=readFile('对白库.json',validateDialogue),profiles=readFile('员工档案.json',validateProfiles);return {dialogue,profiles,revision:createHash('sha256').update(JSON.stringify([dialogue,profiles])).digest('hex').slice(0,20),warning:[...cache.values()].map(v=>v.error).filter(Boolean).join('；')};}
 return {read,directory:folder};
}

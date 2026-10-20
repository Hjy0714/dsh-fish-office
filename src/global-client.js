window.__ModuleLoader__.load({id:'dsh-fish-office',factory(require){
 const React=require('react'),h=React.createElement,TAB='dsh-fish-office/room',KIND='fish-office';
 /*__SCENE_ENGINE__*/
 /* @include src/asset-bundle.js */

 /** Canvas DOM is confined to the React component's own shadow root. */
 function mountScene(element,resource,onMessage){
  let disposed=false,visible=true;
  const hostDocument=element.ownerDocument,hostWindow=hostDocument.defaultView,shadow=element.attachShadow({mode:'open'});
  const timers=new Set(),intervals=new Set(),frames=new Set(),workers=new Set(),observers=new Set(),listeners=[];
  const bus=new EventTarget(),localWindow=Object.create(null),parent={postMessage:data=>{if(!disposed)onMessage(data);}};
  const trackedTimeout=(fn,ms,...args)=>{const id=hostWindow.setTimeout(()=>{timers.delete(id);if(!disposed)fn(...args);},ms);timers.add(id);return id;};
  const trackedFrame=fn=>{if(disposed)return 0;const id=hostWindow.requestAnimationFrame(time=>{frames.delete(id);if(!disposed)fn(time);});frames.add(id);return id;};
  const listen=(target,name,fn,options)=>{target.addEventListener(name,fn,options);listeners.push(()=>target.removeEventListener(name,fn,options));};
  function scopedListener(name,fn,options){listen(['keydown','pointerdown','click'].includes(name)?element:hostWindow,name,fn,options);}
  function makeObserver(Base){return class extends Base{constructor(fn){super((...args)=>{if(!disposed)fn(...args);});observers.add(this);}};}
  const ScopedWorker=class extends hostWindow.Worker{constructor(...args){super(...args);workers.add(this);}};
  const scopedDocument={querySelector:s=>shadow.querySelector(s),querySelectorAll:s=>shadow.querySelectorAll(s),getElementById:id=>shadow.getElementById(id),createElement:(...args)=>hostDocument.createElement(...args),addEventListener:(n,f,o)=>listen(hostDocument,n,f,o),get hidden(){return hostDocument.hidden||!visible;}};
  Object.assign(localWindow,{OFFICE_CHANNEL:'fish-office-local',OFFICE_INSTANCE:crypto.randomUUID(),OFFICE_VISIBLE:true,
   addEventListener:(...args)=>listen(bus,...args),dispatchEvent:e=>bus.dispatchEvent(e)});
  const scope={window:localWindow,document:scopedDocument,parent,addEventListener:scopedListener,
   requestAnimationFrame:trackedFrame,cancelAnimationFrame:id=>{hostWindow.cancelAnimationFrame(id);frames.delete(id);},
   setTimeout:trackedTimeout,clearTimeout:id=>{hostWindow.clearTimeout(id);timers.delete(id);},
   setInterval:(fn,ms)=>{const id=hostWindow.setInterval(()=>{if(!disposed)fn();},ms);intervals.add(id);return id;},clearInterval:id=>{hostWindow.clearInterval(id);intervals.delete(id);},
   Worker:ScopedWorker,MutationObserver:makeObserver(hostWindow.MutationObserver),ResizeObserver:makeObserver(hostWindow.ResizeObserver)};
  const style=hostDocument.createElement('style');style.textContent=resource.css;
  const content=hostDocument.createElement('div');content.className='fish-document';content.innerHTML=resource.markup;shadow.append(style,content);
  runScene(scope,resource);
  return {element,window:localWindow,shadow,
   send(kind,data={}){if(disposed)return;const event=new Event('message');Object.defineProperties(event,{data:{value:{channel:localWindow.OFFICE_CHANNEL,kind,...data}},source:{value:parent}});bus.dispatchEvent(event);},
   setVisible(value){visible=!!value;localWindow.OFFICE_VISIBLE=visible;},
   dispose(){disposed=true;for(const id of timers)hostWindow.clearTimeout(id);for(const id of intervals)hostWindow.clearInterval(id);for(const id of frames)hostWindow.cancelAnimationFrame(id);for(const worker of workers)worker.terminate();for(const observer of observers)observer.disconnect();listeners.forEach(fn=>fn());element.remove();},
   get diagnostics(){return {disposed,timers:timers.size,frames:frames.size,workers:workers.size};}
  };
 }

 function apply(ctx){
  let disposed=false,runtime=null,resources=null,loadPromise=null,pollTimer=null,abort=null,ready=false,sticky=false,followTimer=null;
  const seats=new Set();let seen={};
  const words={zh:{title:'大肥鱼办公室',open:'打开大肥鱼办公室',loading:'正在载入办公室…',retry:'重试',failed:'办公室载入失败',roster:'鲸鱼工作牌',console:'办公室控制台',dawn:'清晨',day:'白天',dusk:'黄昏',night:'黑夜',ambient:'环境光',glow:'灯光亮度',lamps:'台灯',lock:'锁定现实时间',on:'开',off:'关'},en:{title:'Fish Office',open:'Open Fish Office',loading:'Loading the office…',retry:'Retry',failed:'Office failed to load',roster:'Employee cards',console:'Office console',dawn:'Dawn',day:'Day',dusk:'Dusk',night:'Night',ambient:'Ambient light',glow:'Lamp glow',lamps:'Desk lamps',lock:'Use real time',on:'On',off:'Off'}};
  ctx.effect(()=>ctx.locale.register('dsh-fish-office',words),'fish office translations');
  const t=ctx.locale.bind('dsh-fish-office');
  try{const s=JSON.parse(sessionStorage.getItem('dsh.fish-office.dialogue.v1')||'{}');if(s&&typeof s==='object'&&!Array.isArray(s))seen=s;}catch{}
  const selected=()=>ctx.sidebarRight.mounted.getSnapshot();
  const call=async(payload,signal)=>{const reply=await ctx.connection.rpc.call('/api','fish-office',payload,signal);if(!reply?.ok||!reply.value?.ok)throw Error(reply?.value?.error||t('failed'));return reply.value;};
  function localized(){
   if(!runtime)return;const root=runtime.shadow,set=(selector,value)=>{const e=root.querySelector(selector);if(e&&e.textContent!==value)e.textContent=value;};
   const headings=root.querySelectorAll('aside h2');['roster','console'].forEach((key,i)=>{if(headings[i]&&headings[i].textContent!==t(key))headings[i].textContent=t(key);});
   for(const phase of ['dawn','day','dusk','night'])set('[data-phase="'+phase+'"]',t(phase));
   for(const [id,key]of [['ambient','ambient'],['glow','glow']]){const label=root.getElementById(id)?.closest('label');if(label?.firstChild?.nodeType===3&&label.firstChild.textContent!==t(key)+' ')label.firstChild.textContent=t(key)+' ';}
   const settings=runtime.window.WhaleOffice?.settings;if(settings){set('#lamps',t('lamps')+' · '+t(settings.lamps?'on':'off'));set('#cycle',t('lock')+' · '+t(settings.realTimeLock?'on':'off'));}
  }
  function place(){
   if(!runtime||disposed)return;
   const current=[...seats].filter(s=>s.node.isConnected&&s.info.tab.visible).at(-1);
   if(current){if(runtime.element.parentNode!==current.node)current.node.append(runtime.element);sticky=true;runtime.setVisible(!document.hidden);}
   else{runtime.element.remove();runtime.setVisible(false);}
  }
  async function poll(){
   if(disposed||!ready)return;clearTimeout(pollTimer);abort=new AbortController();const local=abort,guard=setTimeout(()=>local.abort(),12000);
   try{const data=await call({op:'global-snapshot',sessionId:selected()||null},local.signal);if(!disposed){runtime.send('snapshot',{data});localized();}}
   catch(e){if(!disposed)runtime?.send('disconnected',{reason:e.message});}
   finally{clearTimeout(guard);if(abort===local)abort=null;}
   if(!disposed)pollTimer=setTimeout(poll,resources?.pollIntervalMs||1500);
  }
  const listeners=new Set();const notify=()=>listeners.forEach(fn=>fn());let loadError='';
  async function ensureLoaded(){
   if(resources)return resources;if(loadPromise)return loadPromise;
   loadPromise=(async()=>{try{resources=await decodeSceneResources(await call({op:'scene'}));loadError='';return resources;}catch(e){loadError=e.message;notify();throw e;}finally{loadPromise=null;}})();return loadPromise;
  }
  function receive(data){
   if(disposed)return;
   if(data.kind==='dialogue-seen'&&typeof data.rootId==='string'&&data.rootId.length<200&&Number.isSafeInteger(data.seq)){seen[data.rootId]=data.seq;seen=Object.fromEntries(Object.entries(seen).slice(-160));try{sessionStorage.setItem('dsh.fish-office.dialogue.v1',JSON.stringify(seen));}catch{}}
   if(data.kind==='ready'){ready=true;queueMicrotask(()=>{if(disposed)return;runtime.send('dialogue-cursor',{cursors:seen});place();localized();poll();notify();});}
  }
  function Office({useTabInfo}){
   const info=useTabInfo(),host=React.useRef(null),seat=React.useRef(null),[,refresh]=React.useReducer(x=>x+1,0);
   React.useEffect(()=>{listeners.add(refresh);return()=>listeners.delete(refresh);},[]);
   const attach=React.useCallback(()=>ensureLoaded().then(data=>{if(disposed||!seat.current)return;
    if(!runtime){const element=seat.current.node.ownerDocument.createElement('div');element.className='fish-office-scene';element.dataset.officeInstance=crypto.randomUUID();element.style.cssText='height:100%;width:100%';seat.current.node.append(element);runtime=mountScene(element,data,receive);}
    place();refresh();
   }).catch(()=>{}),[]);
   React.useLayoutEffect(()=>{const entry={node:host.current,info};seat.current=entry;seats.add(entry);attach();
    return()=>{seat.current=null;seats.delete(entry);if(runtime?.element.parentNode===entry.node){runtime.element.remove();runtime.setVisible(false);}place();};
   },[]);
   React.useLayoutEffect(()=>{if(seat.current)seat.current.info=info;place();},[info.tab.visible]);
   return h('div',{style:{position:'relative',height:'100%',minWidth:0,color:'var(--dsw-alias-label-primary)',background:'var(--dsw-alias-bg-base)'}},
    h('div',{ref:host,style:{height:'100%',width:'100%'},'data-fish-office-anchor':true}),
    !runtime&&h('div',{role:loadError?'alert':'status',style:{position:'absolute',inset:0,padding:16,background:'var(--dsw-alias-bg-base)'}},loadError?t('failed')+': '+loadError:t('loading'),loadError&&h('button',{onClick:()=>{loadError='';refresh();attach();}},t('retry'))));
  }
  function Launcher(){React.useSyncExternalStore(ctx.locale.subscribe.bind(ctx.locale),ctx.locale.getSnapshot.bind(ctx.locale));return h('button',{title:t('open'),onClick:()=>{sticky=true;ctx.sidebarRight.openTab(KIND,{revealIfOpened:true});},style:{border:'1px solid var(--dsw-alias-border-l1)',borderRadius:7,padding:'6px 10px',background:'var(--dsw-alias-bg-layer-1)',color:'var(--dsw-alias-label-primary)',cursor:'pointer',fontSize:12}},'🐋 '+t('title'));}
  ctx.effect(()=>ctx.sidebarRightTabs.register({id:TAB,kind:KIND,priority:'extension',keepMounted:true,title:()=>t('title')}),'fish office tab type');
  ctx.slots.inject('sidebar.right.pane.tab',()=>ctx.slots.register({name:'sidebar.right.pane.tab',key:TAB},Office));
  ctx.slots.inject('sidebar.right.pane.tab.title',()=>ctx.slots.register({name:'sidebar.right.pane.tab.title',key:TAB},()=>h('span',null,'🐋 '+t('title'))));
  for(const [slot,id]of [['sidebar.footer.action','fish-office-footer'],['conversation.session.header.actions','fish-office-header']])ctx.slots.inject(slot,()=>ctx.slots.register({name:slot,id,order:67,inject:()=>({})},Launcher));
  ctx.effect(()=>ctx.sidebarRight.mounted.subscribe(()=>{clearTimeout(followTimer);if(sticky&&selected())followTimer=setTimeout(()=>{if(!disposed&&sticky)ctx.sidebarRight.openTab(KIND,{revealIfOpened:true});},70);}),'fish office session navigation');
  ctx.effect(()=>ctx.locale.subscribe(localized),'fish office live translations');
  ctx.effect(()=>{document.addEventListener('visibilitychange',place);return()=>document.removeEventListener('visibilitychange',place);},'fish office visibility');
  ctx.on('dispose',()=>{disposed=true;clearTimeout(pollTimer);clearTimeout(followTimer);abort?.abort();runtime?.dispose();listeners.clear();});
 }
 return {name:'fish-office',inject:['slots','sidebarRightTabs','sidebarRight','connection','locale'],apply};
}});

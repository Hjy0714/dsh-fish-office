(function(){
  const start=()=>{
    if(window.WhaleOfficeLive)return;
    const api=window.WhaleOffice;if(!api){setTimeout(start,100);return;}
    window.WhaleOfficeLive=createOfficeController(api,{
      bind(a){const b=document.querySelector(`[data-id="${a.id}"] b`);if(b)b.textContent=a.chief?'管理 · '+a.name:a.name;},
      cursor(value){parent.postMessage({channel:window.OFFICE_CHANNEL,kind:'dialogue-seen',...value},'*');}
    });
    api.render();
    document.getElementById('scene').getContext('2d').getImageData(0,0,1,1);
    window.WhaleOfficeLive.armStartupClock();
    document.getElementById('scene').onclick=e=>{
      const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*941/r.width,y=(e.clientY-r.top)*1672/r.height;
      const hit=api.agents.find(a=>{const p=api.visualPoint(a);return Math.abs(p.x-x)<40*api.actorMetrics(a).gain&&y<p.y+8&&y>p.y-api.actorMetrics(a).height;});
      if(hit)api.select(hit.id);
    };
    api.settings.auto=false;
    const channel=window.OFFICE_CHANNEL;
    window.addEventListener('message',e=>{
      if(e.source!==parent||!channel||e.data?.channel!==channel)return;
      if(e.data.kind==='snapshot'){window.OfficeProfiles?.apply(e.data.data.officeConfig);window.WhaleOfficeLive.ingest(e.data.data);}
      if(e.data.kind==='disconnected')window.WhaleOfficeLive.disconnected(e.data.reason);
      if(e.data.kind==='visibility')window.OFFICE_VISIBLE=!!e.data.value;
      if(e.data.kind==='dialogue-cursor')window.WhaleOfficeLive.dialogue.restore(e.data.cursors);
    });
    parent.postMessage({channel,kind:'ready'},'*');
  };
  window.addEventListener('office-scene-ready',start);start();
})();

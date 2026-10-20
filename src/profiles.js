(function(){
 function start(){
  const api=window.WhaleOffice;if(!api||!window.WhaleOfficeLive){setTimeout(start,100);return;}
  const roster=document.getElementById('roster'),panel=document.createElement('div');panel.className='employee-profile';panel.id='employee-profile';
  panel.innerHTML='<div class="profile-heading"><h3 id="employee-name"></h3><span id="employee-role" class="employee-role"></span></div><p class="employee-intro" id="employee-intro"></p><p class="profile-config-warning" id="profile-config-warning" role="alert"></p>';roster.insertAdjacentElement('afterend',panel);
  const el=id=>document.getElementById(id);let config={profiles:window.OfficeProfileDefaults,dialogue:window.OfficeDialogueDefaults},revision=null;
  const selected=()=>roster.querySelector('.selected')?.dataset.id||'crew-0';
  function render(){const id=selected(),p=config.profiles.员工.find(p=>p.id===id);if(!p)return;el('employee-name').textContent=p.姓名;el('employee-role').textContent=(id==='chief'?'管理 · ':'打工 · ')+p.岗位;el('employee-intro').textContent=p.介绍;}
  function apply(next){if(!next?.profiles?.员工)return;el('profile-config-warning').textContent=next.warning||'';if(next.revision&&next.revision===revision)return;revision=next.revision;config=next;
   for(const a of api.agents){const p=config.profiles.员工.find(p=>p.id===a.id);if(!p)continue;a.name=p.姓名;a.profileRole=p.岗位;a.introduction=p.介绍;const b=roster.querySelector('[data-id="'+a.id+'"] b');if(b)b.textContent=a.chief?'管理 · '+a.name:a.name;}
   window.WhaleOfficeLive.dialogue.configure(next.dialogue);render();
  }
  window.OfficeProfiles={apply,get config(){return config;}};apply(config);render();new MutationObserver(render).observe(roster,{subtree:true,attributes:true,attributeFilter:['class']});
 }
 start();
})();

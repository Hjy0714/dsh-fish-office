const zoomState={target:1,frame:0,last:0,anchor:null};
function applyZoom(value,anchor=null){
 settings.zoom=clamp(value,1,2.5);
 const viewport=$('#viewport'),wrap=$('#canvas-wrap'),page=$('.fish-document');
 const before=canvas.getBoundingClientRect();
 const point=anchor?{x:clamp((anchor.x-before.left)/before.width),y:clamp((anchor.y-before.top)/before.height)}:null;
 wrap.style.width=(viewport.clientWidth*settings.zoom)+'px';
 canvas.classList.toggle('zoomed',settings.zoom>1.001);
 if(point){const after=canvas.getBoundingClientRect();viewport.scrollLeft+=after.left+point.x*after.width-anchor.x;if(page)page.scrollTop+=after.top+point.y*after.height-anchor.y;}
}
function zoom(value){zoomState.target=clamp(value,1,2.5);applyZoom(zoomState.target);}
function animateZoom(now){
 const dt=zoomState.last?Math.min(64,now-zoomState.last):16;zoomState.last=now;
 const next=settings.zoom+(zoomState.target-settings.zoom)*(1-Math.exp(-dt/55));
 applyZoom(Math.abs(next-zoomState.target)<.0003?zoomState.target:next,zoomState.anchor);
 if(settings.zoom!==zoomState.target)zoomState.frame=requestAnimationFrame(animateZoom);
 else {zoomState.frame=0;zoomState.last=0;}
}
canvas.addEventListener('wheel',event=>{
 if(!Number.isFinite(event.deltaY)||!event.deltaY)return;
 event.preventDefault();event.stopPropagation();
 const unit=event.deltaMode===1?16:event.deltaMode===2?$('#viewport').clientHeight:1;
 zoomState.target=clamp(zoomState.target*Math.exp(-clamp(event.deltaY*unit,-240,240)*.00075),1,2.5);
 zoomState.anchor={x:event.clientX,y:event.clientY};
 if(!zoomState.frame)zoomState.frame=requestAnimationFrame(animateZoom);
},{passive:false});

const panState={pointer:null,moved:false,suppressClick:false};
canvas.addEventListener('pointerdown',event=>{
 panState.suppressClick=false;
 if(event.pointerType!=='mouse'||event.button!==0||settings.zoom<=1.001)return;
 if(zoomState.frame)cancelAnimationFrame(zoomState.frame);
 zoomState.frame=0;zoomState.last=0;zoomState.target=settings.zoom;
 const viewport=$('#viewport'),page=$('.fish-document');
 Object.assign(panState,{pointer:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:page?.scrollTop||0,moved:false});
 canvas.setPointerCapture(event.pointerId);canvas.classList.add('panning');event.preventDefault();
});
canvas.addEventListener('pointermove',event=>{
 if(panState.pointer!==event.pointerId)return;
 const dx=event.clientX-panState.x,dy=event.clientY-panState.y;
 if(!panState.moved&&Math.hypot(dx,dy)<4)return;
 panState.moved=true;panState.suppressClick=true;
 $('#viewport').scrollLeft=panState.left-dx;
 const page=$('.fish-document');if(page)page.scrollTop=panState.top-dy;
 event.preventDefault();
});
function finishPan(event){
 if(panState.pointer!==event.pointerId)return;
 panState.pointer=null;canvas.classList.remove('panning');
 if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
}
for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,finishPan);
// A camera drag must not turn into a character-selection click on release.
canvas.addEventListener('click',event=>{
 if(!panState.suppressClick)return;
 panState.suppressClick=false;event.preventDefault();event.stopImmediatePropagation();
},true);

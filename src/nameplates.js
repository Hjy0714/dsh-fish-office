const nameplateCanvas=document.createElement('canvas');nameplateCanvas.width=W;nameplateCanvas.height=H;
const nameplateCtx=nameplateCanvas.getContext('2d');
const nameplateText=a=>(a.chief?'管理':'打工')+' · '+a.name;
function label(a){
 const g=nameplateCtx,p=visualPoint(a),text=nameplateText(a);g.font='11px "Microsoft YaHei",sans-serif';
 const width=Math.min(170,g.measureText(text).width+15);g.fillStyle='#112235df';g.strokeStyle=a.id===selectedId?'#dcc58f':'#67808e';g.lineWidth=1;
 g.beginPath();g.roundRect(p.x-width/2,p.y+9,width,20,3);g.fill();g.stroke();g.fillStyle=a.id===selectedId?'#f0dda8':'#d7e3e4';g.textAlign='center';g.fillText(text,p.x,p.y+23,width-8);
}
function prepareNameplates(excludeAgent){
 nameplateCtx.globalCompositeOperation='source-over';nameplateCtx.clearRect(0,0,W,H);
 if(settings.labels)for(const a of agents)if(a.id!==excludeAgent)label(a);
 // Every painted sprite subtracts its exact alpha silhouette from this lower layer.
 // Furniture retains its usual depth order, while no nameplate can cover a character.
 nameplateCtx.globalCompositeOperation='destination-out';
}

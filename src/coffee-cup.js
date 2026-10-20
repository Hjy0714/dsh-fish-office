function coffeeCupPose(p){
 const side=p.role.endsWith('-front')?-1:1,angle=-side*p.v*.24;
 const project=(x,y)=>({x:p.hand.x+Math.cos(angle)*side*x-Math.sin(angle)*y,y:p.hand.y+Math.sin(angle)*side*x+Math.cos(angle)*y});
 return{side,angle,grip:{...p.hand},handleGrip:project(0,0),bodyCenter:project(15,-2.5)};
}
function drawCoffeeCup(g,p){
 const cup=coffeeCupPose(p);g.save();
 // Rotate around the gripping fingers, never around the far side of the mug.
 g.translate(Math.round(p.hand.x),Math.round(p.hand.y));g.rotate(cup.angle);g.scale(cup.side,1);
 g.strokeStyle='#28334a';g.lineWidth=4;g.strokeRect(0,-6,10,10);
 g.strokeStyle='#efdec2';g.lineWidth=2;g.strokeRect(0,-6,10,10);
 g.fillStyle='#28334a';g.fillRect(7,-11,16,17);
 g.fillStyle='#f0e3c9';g.fillRect(8,-10,14,15);
 g.fillStyle='#fff4df';g.fillRect(9,-7,2,9);
 g.fillStyle='#c5a87d';g.fillRect(9,3,12,2);
 g.fillStyle='#70503d';g.fillRect(9,-10,12,3);g.restore();
}
const coffeeGripHands=new Map();
function coffeeHandImage(p){
 if(p.role!=='chief-front')return p.r.hand;
 if(coffeeGripHands.has(p.role))return coffeeGripHands.get(p.role);
 // The original chief sprite is an open presentation palm with fingers pointing
 // away from the mug. Use a compact curled grip: thumb on the cup/left side,
 // knuckles beside the handle, and a closed lower palm at the wrist.
 const rows=[
  '......ooo.....',
  '....oobbbmo...',
  '...ohhhbbmmo..',
  '..ohhbbbcmmmo.',
  '.ohbbbbbcmmo..',
  '.obbmbbbcmmo..',
  '.obbccbbcmmo..',
  '..obbbbbcmmo..',
  '..obbccbbmmo..',
  '...obbbmmmo...',
  '....obmmo.....',
  '.....ooo......'
 ],colors={o:'#604653',s:'#be8585',m:'#e7ab9d',b:'#ffdcc6',h:'#fff0da',c:'#d1958c'};
 const image=document.createElement('canvas');image.width=image.height=256;const g=image.getContext('2d');
 const x=Math.round(p.r.rest[0])-7,y=Math.round(p.r.rest[1])-6;
 for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const color=colors[rows[j][i]];if(color){g.fillStyle=color;g.fillRect(x+i,y+j,1,1);}}
 image.__coffeeGrip={closed:true,thumb:'left',originalOpenPalmRemoved:true};coffeeGripHands.set(p.role,image);return image;
}

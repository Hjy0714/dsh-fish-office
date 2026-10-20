// Reuse the active light plate for the lamp's foreground and stone pedestal.
function drawPondLampForeground(){
 const outline=[[507,1337],[514,1338],[519,1346],[517,1354],[524,1358],[526,1365],[523,1369],[523,1380],[532,1388],[537,1397],[533,1407],[530,1412],[527,1434],[505,1441],[490,1437],[489,1404],[489,1397],[497,1387],[498,1368],[494,1364],[500,1357],[504,1354],[500,1349],[501,1343]];
 ctx.save();ctx.beginPath();ctx.moveTo(...outline[0]);for(const p of outline.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip();ctx.drawImage(activePlate,0,0,W,H);ctx.restore();
}

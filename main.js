const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 448;


let player = { x: 320, y: 224, w:28, h:28, speed:90, hp:100, hunger:100, thirst:100 };
let keys = {};


window.addEventListener('keydown', e => keys[e.key.toLowerCase()]=true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()]=false);


function update(dt){
let dx=0,dy=0;
if(keys['w'])dy=-1; if(keys['s'])dy=1;
if(keys['a'])dx=-1; if(keys['d'])dx=1;
let len=Math.hypot(dx,dy)||1;
player.x+=(dx/len)*player.speed*dt;
player.y+=(dy/len)*player.speed*dt;
player.hunger = Math.max(0, player.hunger-dt);
player.thirst = Math.max(0, player.thirst-dt*1.5);
if(player.hunger===0||player.thirst===0) player.hp = Math.max(0, player.hp-dt*5);
}


function render(){
ctx.fillStyle='#6fb27b'; ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle='#112233'; ctx.fillRect(player.x,player.y,player.w,player.h);
}


let lastTime = performance.now();
function loop(now){
let dt=(now-lastTime)/1000;
lastTime=now;
update(dt);
render();
requestAnimationFrame(loop);
}
closeBtn.onclick = ()=> panel.classList.add('hidden');

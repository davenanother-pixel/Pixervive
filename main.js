const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 448;

const loadingScreen = document.getElementById('loading-screen');
const gameRoot = document.getElementById('game-root');

let player = { x: 320, y: 224, w:28, h:28, speed:90, hp:100, hunger:100, thirst:100 };
let keys = {};

// Keyboard input
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Panel buttons
const panel = document.getElementById('panel');
const openBtn = document.getElementById('open-panel');
const closeBtn = document.getElementById('close-panel');
openBtn.onclick = () => panel.classList.toggle('hidden');
closeBtn.onclick = () => panel.classList.add('hidden');

// Game update
function update(dt){
    let dx=0,dy=0;
    if(keys['w']) dy=-1; if(keys['s']) dy=1;
    if(keys['a']) dx=-1; if(keys['d']) dx=1;
    let len=Math.hypot(dx,dy)||1;
    player.x += (dx/len)*player.speed*dt;
    player.y += (dy/len)*player.speed*dt;

    player.hunger = Math.max(0, player.hunger - dt);
    player.thirst = Math.max(0, player.thirst - dt*1.5);
    if(player.hunger===0 || player.thirst===0) player.hp = Math.max(0, player.hp - dt*5);

    // Update HUD
    document.getElementById('health-bar').textContent = `❤ ${Math.floor(player.hp)}`;
    document.getElementById('hunger-bar').textContent = `🍗 ${Math.floor(player.hunger)}`;
    document.getElementById('thirst-bar').textContent = `💧 ${Math.floor(player.thirst)}`;
}

// Render function
function render(){
    ctx.fillStyle='#6fb27b'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#112233'; ctx.fillRect(player.x, player.y, player.w, player.h);
}

// Game loop
let lastTime = performance.now();
function loop(now){
    let dt = (now - lastTime)/1000;
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
}

// Fake loading sequence
let loadStart = performance.now();
function fakeLoad(){
    let now = performance.now();
    if(now - loadStart > 1000){ // 1 second loading
        loadingScreen.style.display = 'none';
        gameRoot.classList.remove('hidden');
        requestAnimationFrame(loop);
    } else {
        requestAnimationFrame(fakeLoad);
    }
}

fakeLoad();


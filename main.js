const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 448;

const loadingScreen = document.getElementById('loading-screen');
const gameRoot = document.getElementById('game-root');

let player = { x: 320, y: 224, w:28, h:28, speed:90, hp:100, hunger:100, thirst:100 };
let keys = {};

// Panel buttons
const panel = document.getElementById('panel');
const openBtn = document.getElementById('open-panel');
const closeBtn = document.getElementById('close-panel');
openBtn.onclick = () => panel.classList.toggle('hidden');
closeBtn.onclick = () => panel.classList.add('hidden');

// Player update
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

    // HUD
    document.getElementById('health-bar').textContent = `❤ ${Math.floor(player.hp)}`;
    document.getElementById('hunger-bar').textContent = `🍗 ${Math.floor(player.hunger)}`;
    document.getElementById('thirst-bar').textContent = `💧 ${Math.floor(player.thirst)}`;
}

// Render game
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

// Pixel loading animation
const loadingCanvas = document.createElement('canvas');
loadingCanvas.width = 64;
loadingCanvas.height = 64;
const lctx = loadingCanvas.getContext('2d');
loadingScreen.appendChild(loadingCanvas);

let startTime = performance.now();
function drawLoading(now){
    const t = (now - startTime)/500; // animation speed
    lctx.clearRect(0,0,64,64);

    // Background blocks
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            lctx.fillStyle = '#223344';
            lctx.fillRect(i*16,j*16,14,14);
        }
    }

    // Bouncing pixel block
    lctx.fillStyle = '#9affc8';
    const bx = 24 + Math.sin(t)*16;
    const by = 24 + Math.cos(t)*16;
    lctx.fillRect(bx, by, 16, 16);
}

// Fake load then start game
function fakeLoad(now){
    drawLoading(now);
    if(now - startTime > 1500){ // 1.5 seconds loading
        loadingScreen.style.display = 'none';
        gameRoot.classList.remove('hidden');
        requestAnimationFrame(loop);
    } else {
        requestAnimationFrame(fakeLoad);
    }
}

requestAnimationFrame(fakeLoad);

// Keyboard input
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);



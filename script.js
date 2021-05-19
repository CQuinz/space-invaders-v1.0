const keyCodeLeft = 37;
const keyCodeRight = 39;
const keyCodeSpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;
const playerMaxSpeed = 600.0;
const laserMaxSpeed = 300;
const laserCoolDown = 0.5;

const gameState = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  lasers: []
};

const setPosition = (element, xPos, yPos)=>{
  element.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

const createPlayer = (container)=>{
  gameState.playerX = gameWidth/2;
  gameState.playerY = gameHeight - 50;

  const player = document.createElement('img');
  player.src= 'images/playerShip1_orange.png';
  player.className = 'player';
  container.appendChild(player);

  setPosition(player, gameState.playerX, gameState.playerY);
}

function clamp(v, min, max){
  if(v < min){
    return min;
  }else if(v > max){
    return max;
  }else{
    return v;
  }
}



const updatePlayer = (deltaTime)=>{
  if(gameState.leftPressed === true) gameState.playerX -= deltaTime * playerMaxSpeed;
  if(gameState.rightPressed === true) gameState.playerX += deltaTime * playerMaxSpeed;

  gameState.playerX = clamp(
    gameState.playerX,
    playerWidth,
    gameWidth - playerWidth
  );

  const player = document.querySelector('.player');
  setPosition(player, gameState.playerX, gameState.playerY);
}

const createLaser = (container, xPos, yPos)=>{
  const element = document.createElement('img');
  element.src = 'images/laserBlue1.png';
  element.className = 'laser';
  container.appendChild(element);

  const laser = {xPos, yPos, element};
  gameState.lasers.push(laser);
  
}

const init = ()=>{
  const container = document.querySelector('.game');
  createPlayer(container);
}

const update = (e)=>{
  const currentTime = Date.now();
  const deltaTime = (currentTime - gameState.lastTime) /1000.0;

  updatePlayer(deltaTime);

  gameState.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

const onKeyDown = (e)=> { 
  if(e.keyCode === keyCodeLeft){
    gameState.leftPressed = true; 
  }else if(e.keyCode === keyCodeRight){
    gameState.rightPressed = true;
  }else if(e.keyCode === keyCodeSpace){
    gameState.spacePressed = true;
  }
}

const onKeyUp = (e)=> { 
  if(e.keyCode === keyCodeLeft){
    gameState.leftPressed = false; 
  }else if(e.keyCode === keyCodeRight){
    gameState.rightPressed = false;
  }else if(e.keyCode === keyCodeSpace){
    gameState.spacePressed = false;
  }
}

init();
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);
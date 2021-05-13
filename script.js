const keyCodeLeft = 37;
const keyCodeRight = 39;
const keyCodeSpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;

const gameState = {
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0
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

const updatePlayer = ()=>{
  if(leftPressed === true) gameState.playerX -=5;
  if(rightPressed === true) gameState.playerX +=5;
}

const init = ()=>{
  const container = document.querySelector('.game');
  createPlayer(container);
}

const update = (e)=>{
  updatePlayer();
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
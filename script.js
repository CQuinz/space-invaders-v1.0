const keyCodeLeft = 37;
const keyCodeRight = 39;
const keyCodeSpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const gameState = {
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

const init = ()=>{
  const container = document.querySelector('.game');
  createPlayer(container);
}

const update = ()=>{
  updatePlayer();
  window.requestAnimationFrame(update);
}

const onKeyDown = (e)=> {
  
  function movePlayerPosition(posX, posY){
    const player = document.querySelector('.player');
    setPosition(player, posX, posY)
  }

  if(e.keyCode === keyCodeLeft){
    gameState.playerX -=5;
    movePlayerPosition(gameState.playerX, gameState.playerY);
    
  }else if(e.keyCode === keyCodeRight){
    gameState.playerX += 5;
    movePlayerPosition(gameState.playerX, gameState.playerY);
  }
}

init();
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);
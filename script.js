const keyCodeLeft = 37;
const keyCodeRight = 39;
const keyCodeSpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;
const playerMaxSpeed = 500.0;
const laserMaxSpeed = 300;
const laserCoolDown = 0.3;

const enemiesPerRow = 8;
const enemyHorizontalPadding = 200;
const enemeyVerticalPadding = 70;
const enemyVerticalSpacing = 60;

let isMoveInvadersLeft = false;

const gameState = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  playerCoolDown: 0,
  invaderMovementDelay: 0,
  lasers: [],
  enemies: []
};

const setPosition = (element, xPos, yPos)=>{
  element.style.transform = `translate(${xPos}px, ${yPos}px)`;
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

const createPlayer = (container)=>{
  gameState.playerX = gameWidth/2;
  gameState.playerY = gameHeight - 50;

  const player = document.createElement('img');
  player.src= 'images/playerShip1_orange.png';
  player.className = 'player';
  container.appendChild(player);

  setPosition(player, gameState.playerX, gameState.playerY);
}



const updatePlayer = (deltaTime, container)=>{
  if(gameState.leftPressed) gameState.playerX -= deltaTime * playerMaxSpeed;
  if(gameState.rightPressed) gameState.playerX += deltaTime * playerMaxSpeed;

  gameState.playerX = clamp(
    gameState.playerX,
    playerWidth,
    gameWidth - playerWidth
  );

  if(gameState.spacePressed && gameState.playerCoolDown <= 0){
    createLaser(container, gameState.playerX, gameState.playerY);
    gameState.playerCoolDown = laserCoolDown;
  }
  if(gameState.playerCoolDown > 0){
    gameState.playerCoolDown -= deltaTime;
  }

  const player = document.querySelector('.player');
  setPosition(player, gameState.playerX, gameState.playerY);
}

const createLaser = (container, xPos, yPos)=>{
  const element = document.createElement('img');
  element.src = 'images/laserBlue01.png';
  element.className = 'laser';
  container.appendChild(element);

  const laser = {xPos, yPos, element};
  gameState.lasers.push(laser);
  const audio = new Audio('sounds/sfx-laser1.ogg');
  audio.play();
  setPosition(element, xPos, yPos);
}

const updateLasers = (deltaTime, container)=>{
  const lasers = gameState.lasers;
  for(let i = 0; i < gameState.lasers.length; i++){
    const laser = lasers[i];
    laser.yPos -= deltaTime * laserMaxSpeed;

    if(laser.yPos < 0){
      distroyLaser(container, laser);
    }
    setPosition(laser.element, laser.xPos, laser.yPos);
  }
  gameState.lasers = gameState.lasers.filter(e => !e.isDead);
}

function distroyLaser(container, laser){
  container.removeChild(laser.element);
  laser.isDead = true;
}

function createEnemy(invaderContainer, xPos, yPos){
  
  const element = document.createElement('img');
  element.src= 'images/enemyRed1.png';
  element.className = 'enemy';
  invaderContainer.appendChild(element);
  const enemy ={
    xPos,
    yPos,
    element
  };
  gameState.enemies.push(enemy);
  setPosition(element, xPos, yPos);
}

function updateEnemyPosition(deltaTime, invaderContainer){
  // const dx = Math.sin(gameState.lastTime / 1000) * 100;
  
  let invaderContainerPosition = invaderContainer.getBoundingClientRect();

  if(invaderContainerPosition.right >= 1000) isMoveInvadersLeft = true;
  if(invaderContainerPosition.right <= 500) isMoveInvadersLeft = false;
  
  if(gameState.invaderMovementDelay <=0 && isMoveInvadersLeft === false){
    let xPos = invaderContainerPosition.right;
    gameState.invaderMovementDelay = 1;
    setPosition(invaderContainer, xPos, 0);

  } else if(gameState.invaderMovementDelay <=0 && isMoveInvadersLeft === true){
    let xPos = invaderContainerPosition.right;
    gameState.invaderMovementDelay = 1;
    setPosition(invaderContainer, xPos, 0);
  }
  if(gameState.invaderMovementDelay > 0) gameState.invaderMovementDelay -= deltaTime;
  
  // console.log(isMoveInvadersLeft);
}

const init = ()=>{
  // Create a container for the invaders
  const invaderContainer = document.createElement('div');
  invaderContainer.className= 'invader-container';

  const container = document.querySelector('.game');
  container.appendChild(invaderContainer);
  createPlayer(container);

  const enemySpacing = (gameWidth - enemyHorizontalPadding *2)/(enemiesPerRow - 1);
  for(let j= 0; j < 3; j++){
    const yPos = enemeyVerticalPadding + j * enemyVerticalSpacing;
    for(let i =0; i < enemiesPerRow; i++){
      const xPos = i * enemySpacing + enemyHorizontalPadding;
      createEnemy(invaderContainer, xPos, yPos);
    }
  }
}

const update = (e)=>{
  const currentTime = Date.now();
  const deltaTime = (currentTime - gameState.lastTime) /1000.0;

  const container = document.querySelector('.game');
  const invaderContainer = document.querySelector('.invader-container');

  updatePlayer(deltaTime, container);
  updateLasers(deltaTime, container);
  // updateEnemyPosition(deltaTime, invaderContainer);

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

// Function for changing the horzontal position to be tweaked and added.

// function moveInvaders(direction){
//   const getCurrentPosition = invaderContainer.getBoundingClientRect();
//   let movementDirection;
//   const positionLeft = getCurrentPosition.left;

//   if(direction === left) left -=10;
//   if(direction === right) right += 10;
//   movementDirection = direction;
  
//   setPosition(invaderContainer, movementDirection, 0);

// console.log('positionLeft: ', positionLeft);
// console.log('movementDirection: ', movementDirection);
// }
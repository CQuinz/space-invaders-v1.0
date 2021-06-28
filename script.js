const keyCodeLeft = 37;
const keyCodeRight = 39;
const keyCodeSpace = 32;

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;
const playerMaxSpeed = 500.0;
const playerLaserMaxSpeed = 300;
const playerLaserCooldownAmount = 0.3;

const enemiesPerRow = 8;
const enemyHorizontalPadding = 200;
const enemeyVerticalPadding = 70;
const enemyVerticalSpacing = 60;
const enemyLaserCooldownAmount = Math.floor(Math.random()*4);
const enemyLaserMaxSpeed = 150;
const invaderContainermovementAmount = 30;



const gameState = {
  isGameOver: false,
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  playerCoolDown: 0,
  isMoveInvadersLeft: false,
  isMoveInvadersDown: false,
  invaderMovementDelay: 0,
  invaderContainerTranslateXAmount: 0,
  invaderContainerTranslateYAmount: 0,
  lasers: [],
  enemies: [],
  enemyLasers: []
};

const checkRectanglesIntersect = (rectangle1, rectangle2)=>{
  return !(
    rectangle2.left > rectangle1.right ||
    rectangle2.right < rectangle1.left ||
    rectangle2.top > rectangle1.bottom ||
    rectangle2.bottom < rectangle1.top
  );
}

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

const checkPlayerCanShoot = (deltaTime, container)=>{
  if(gameState.spacePressed && gameState.playerCoolDown <= 0){
    createLaser(container, gameState.playerX, gameState.playerY);
    gameState.playerCoolDown = playerLaserCooldownAmount;
  }
  if(gameState.playerCoolDown > 0){
    gameState.playerCoolDown -= deltaTime;
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

  checkPlayerCanShoot(deltaTime, container);
  const player = document.querySelector('.player');
  setPosition(player, gameState.playerX, gameState.playerY);
}

const checkLaserEnemyIntersect = (container, laser)=>{
  const rectangle1 = laser.element.getBoundingClientRect();
    const enemies = gameState.enemies;
    for(let j = 0; j < enemies.length; j++){
      const enemy = enemies[j];
      if(enemy.isDead) continue;
      const rectangle2 = enemy.element.getBoundingClientRect();
      if(checkRectanglesIntersect(rectangle1, rectangle2)){
        // Enemy was hit
        distroyEnemy(enemy);
        distroyLaser(container, laser);
        break;
      }
    }
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
    laser.yPos -= deltaTime * playerLaserMaxSpeed;
    if(laser.yPos < 0){
      distroyLaser(container, laser);
    }
    setPosition(laser.element, laser.xPos, laser.yPos);
    checkLaserEnemyIntersect(container, laser);
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
    element,
    laserCooldown: enemyLaserCooldownAmount
  };
  gameState.enemies.push(enemy);
  setPosition(element, xPos, yPos);
}

const checkInvadersCurrentPosition = (invaderContainerPosition)=>{
  if(invaderContainerPosition.right >= 970) gameState.isMoveInvadersLeft = true;
  if(gameState.isMoveInvadersLeft === true && invaderContainerPosition.right >= (gameWidth + 200)) gameState.isMoveInvadersDown = true;
  if(invaderContainerPosition.right <= 700) gameState.isMoveInvadersLeft = false;
  if(invaderContainerPosition.bottom >= (gameHeight/2) + 40) return gameState.isGameOver = true;
}

const checkMoveInvadersDown = (yPos)=>{
  if(gameState.invaderMovementDelay <=0 && gameState.isMoveInvadersDown === true){
    gameState.invaderContainerTranslateYAmount += 20;
    yPos = gameState.invaderContainerTranslateYAmount;
    gameState.isMoveInvadersDown = false;
  }
}

const checkInvaderMoveDirection = (invaderContainer, xPos, yPos)=>{
  if(gameState.invaderMovementDelay <=0){
    moveInvaderContainerPosition(invaderContainer, xPos, yPos);
    if(!gameState.isMoveInvadersLeft) gameState.invaderContainerTranslateXAmount += invaderContainermovementAmount;
    if(gameState.isMoveInvadersLeft) gameState.invaderContainerTranslateXAmount -= invaderContainermovementAmount; 
  } 
}

const moveInvaderContainerPosition = (invaderContainer, xPos, yPos)=>{
  gameState.invaderMovementDelay = 0.5;
  setPosition(invaderContainer, xPos, yPos);
}

const createEnemyLaser = (enemy, xPos, yPos)=>{
  const container = document.querySelector('.game');
  const element = document.createElement('img');
  element.src = 'images/laserRed01.png';
  element.className = 'laser';
  laser ={
    element,
    xPos,
    yPos
  }
  
  container.appendChild(element);
  setPosition(element, xPos, yPos);
  enemy.laserCooldown = enemyLaserCooldownAmount;
  gameState.enemyLasers.push(laser);
}

const updateEnemylaser = (deltaTime, container)=>{
  const enemyLasers = gameState.enemyLasers;
  enemyLasers.forEach((enemyLaser) => {
    let yPos = enemyLaser.yPos += deltaTime * enemyLaserMaxSpeed;
    setPosition(enemyLaser.element, enemyLaser.xPos, yPos);

    if(yPos > gameHeight) distroyEnemyLaser(enemyLaser, container);
  }); 
  gameState.enemyLasers = gameState.enemyLasers.filter(e => !e.isDead);
}

const distroyEnemyLaser = (enemyLaser, container)=>{
  container.removeChild(enemyLaser.element);
  enemyLaser.isDead = true;
}

const checkCreateEnemyLaser = (deltaTime, enemy)=>{
  // const enemies = gameState.enemies;
  // enemies.forEach((enemy) => {
    enemy.laserCooldown -= deltaTime/5;
    if(enemy.laserCooldown <= 0){
      const xPos = enemy.xPos;
      const yPos = enemy.yPos;
      createEnemyLaser(enemy, xPos, yPos);
      enemy.laserCooldown = enemyLaserCooldownAmount;
    }
  // });
}

const distroyEnemy = (enemy)=>{
  const invaderContainer = document.querySelector('.invader-container');
  invaderContainer.removeChild(enemy.element);
  enemy.isDead = true;
}

const updateEnemyNumber = () => gameState.enemies = gameState.enemies.filter(e => !e.isDead);



function updateEnemiesPosition(deltaTime, invaderContainer){
  let invaderContainerPosition = invaderContainer.getBoundingClientRect();
  let xPos = gameState.invaderContainerTranslateXAmount;
  let yPos = gameState.invaderContainerTranslateYAmount;

  checkInvadersCurrentPosition(invaderContainerPosition);
  checkMoveInvadersDown(yPos);
  checkInvaderMoveDirection(invaderContainer, xPos, yPos);
  // updateEnemyNumber();
  // checkCreateEnemyLaser(deltaTime);
  if(gameState.invaderMovementDelay > 0) gameState.invaderMovementDelay -= deltaTime;
}

const updateCurrentEnemyPositionInfo = (enemy, index)=>{
  const currentPosition = enemy.element.getBoundingClientRect();
  gameState.enemies[index].xPos = (currentPosition.right -20);
  gameState.enemies[index].yPos = (currentPosition.top + 20);
  
}

const updateEachEnemy = (deltaTime)=>{
  const enemies = gameState.enemies;
  enemies.forEach((enemy, index) => {
    updateCurrentEnemyPositionInfo(enemy, index);
    updateEnemyNumber(enemy);
    checkCreateEnemyLaser(deltaTime, enemy);
  });
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
  if(!gameState.isGameOver){
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) /1000.0;

    const container = document.querySelector('.game');
    const invaderContainer = document.querySelector('.invader-container');

    updatePlayer(deltaTime, container);
    updateLasers(deltaTime, container);
    updateEnemiesPosition(deltaTime, invaderContainer);
    updateEachEnemy(deltaTime);
    updateEnemylaser(deltaTime, container);

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }
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


// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const message = document.getElementById("message");


//Define sound effects 
const eat = new Audio("/aud/item-get.mp3");
const song = new Audio("/aud/dearly-beloved.mp3");
const gameStartSound = new Audio("/aud/game-start.mp3");
// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testing draw function
// draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}


// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameStartSound.play();
  song.play();
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
  updateMessage('startGame');
}

// Keypress event listener
function handleKeyPress(event) {
  if (!gameStarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        direction = 'up';
        break;
      case 'ArrowRight':
      case 'd':
        direction = 'right';
        break;
      case 'ArrowDown':
      case 's':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
        direction = 'left';
        break;
    }
  }
}


document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 130) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 113) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 90) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore(); 
  updateMessage('resetGame');
}

function updateScore() {
  const currentScore = snake.length - 1;
  const scoreElement = document.getElementById("score");

  // Check if the score has incremented
  if (parseInt(scoreElement.textContent) < currentScore) {
    // Set the playback position to the beginning and play the "eat" sound
    eat.currentTime = 0;
    eat.play();
  }

  // Update the score on the page
  scoreElement.textContent = currentScore.toString().padStart(3, "0");
  updateMessage('updateScore');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

function updateMessage(condition){
   switch(condition){ 
    case 'startGame':
      message.textContent = 'eat apples. not borders';
      break; 
    case 'resetGame':
      message.textContent = "Joel's Super FUN Snake Game";
      break;
    case 'updateScore':
        if(currentScore === 3){
          message.textContent = 'you are off to a good start :)';
        }
      break;
   }
   
}
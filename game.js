const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

let difficulty = "normal";
let gameRunning = false;
let countdown = 0;
let countdownActive = false;

// Paddle settings
const paddleWidth = 15, playerPaddleHeight = 80;
let aiPaddleHeight = 60; // shorter AI paddle
let leftPaddleY, rightPaddleY;

// Ball
let ballSize = 40;
const ballImage = new Image();
ballImage.src = "./assets/senti.png";
let ballX, ballY, ballSpeedX, ballSpeedY;

// Score
let leftScore, rightScore;
let highScore = 0;

// Key controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;

  let baseSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  ballSpeedX = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
  ballSpeedY = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
}

// Reset paddles
function resetPaddles() {
  leftPaddleY = canvas.height / 2 - playerPaddleHeight / 2;
  rightPaddleY = canvas.height / 2 - aiPaddleHeight / 2;
}

// Draw paddle
function drawPaddle(x, y, height) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, height);
}

// Draw ball
function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
}

// Draw countdown
function drawCountdown() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "60px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(countdown > 0 ? countdown : "Go!", canvas.width / 2, canvas.height / 2);
}

// Game loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Paddles + ball
  drawPaddle(0, leftPaddleY, playerPaddleHeight);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY, aiPaddleHeight);
  drawBall();

  // Scores
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(`Player: ${leftScore}`, 20, 30);
  ctx.textAlign = "right";
  ctx.fillText(`AI: ${rightScore}`, canvas.width - 20, 30);
  ctx.textAlign = "center";
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 30);

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Paddle collisions
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + playerPaddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + aiPaddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) {
    rightScore++;
    resetBall();
  }
  if (ballX + ballSize > canvas.width) {
    leftScore++;
    if (leftScore > highScore) highScore = leftScore;
    resetBall();
  }

  // Player paddle movement (W/S or Arrows)
  const moveStep = 6;
  if ((keys["w"] || keys["arrowup"]) && leftPaddleY > 0) {
    leftPaddleY -= moveStep;
  }
  if ((keys["s"] || keys["arrowdown"]) && leftPaddleY + playerPaddleHeight < canvas.height) {
    leftPaddleY += moveStep;
  }

  // AI paddle movement (smoother but can miss)
  let aiSpeed = difficulty === "easy" ? 5 : difficulty === "normal" ? 7 : 10;
  let errorMargin = difficulty === "easy" ? 50 : difficulty === "normal" ? 25 : 5;
  let targetY = ballY + ballSize / 2 - aiPaddleHeight / 2;
  targetY += (Math.random() * errorMargin - errorMargin / 2);

  if (rightPaddleY + aiPaddleHeight / 2 < targetY) rightPaddleY += aiSpeed;
  else if (rightPaddleY + aiPaddleHeight / 2 > targetY) rightPaddleY -= aiSpeed;

  // Clamp AI paddle
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY + aiPaddleHeight > canvas.height) {
    rightPaddleY = canvas.height - aiPaddleHeight;
  }

  // Win condition (sudden death - first to 1)
  if (leftScore >= 1 || rightScore >= 1) {
    gameRunning = false;
    canvas.style.display = "none";
    gameOverScreen.classList.remove("hidden");
    winnerText.innerText = leftScore >= 1 ? "🎉 You Win!" : "🤖 AI Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

// Countdown before starting game
function startCountdown() {
  countdown = 3;
  countdownActive = true;
  let interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCountdown();
    countdown--;
    if (countdown < 0) {
      clearInterval(interval);
      countdownActive = false;
      gameRunning = true;
      resetBall();
      requestAnimationFrame(draw);
    }
  }, 1000);
}

// Start button
startBtn.addEventListener("click", () => {
  difficulty = document.getElementById("difficulty").value;
  leftScore = rightScore = 0;

  // adjust AI paddle size by difficulty
  aiPaddleHeight = difficulty === "easy" ? 50 : difficulty === "normal" ? 60 : 70;

  resetPaddles();
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.style.display = "block";
  startCountdown();
});

// Restart button → back to menu
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
});

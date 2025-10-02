const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

let difficulty = "easy"; // ✅ Always start in easy
let gameRunning = false;
let countdown = 0;

// Paddle settings
const paddleWidth = 15;
const playerPaddleHeight = 80;
let aiPaddleHeight = 40; // AI paddle shorter
let leftPaddleY, rightPaddleY;

// Ball
let ballSize = 40;
const ballImage = new Image();
ballImage.src = "./assets/senti.png";
let ballX, ballY, ballSpeedX, ballSpeedY;

// Score
let leftScore, rightScore;
let highScore = 0;

// Controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// Touch control (mobile)
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  leftPaddleY = touchY - playerPaddleHeight / 2;
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY + playerPaddleHeight > canvas.height) {
    leftPaddleY = canvas.height - playerPaddleHeight;
  }
});

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
  resetPaddles();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  let baseSpeed = 2; // ✅ Easy default speed
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

// Draw
function draw() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw
  drawPaddle(0, leftPaddleY, playerPaddleHeight);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY, aiPaddleHeight);
  drawBall();

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(`Player: ${leftScore}`, 20, 30);
  ctx.textAlign = "right";
  ctx.fillText(`AI: ${rightScore}`, canvas.width - 20, 30);
  ctx.textAlign = "center";
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 30);

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Paddle collision
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

  // Player move
  const moveStep = 6;
  if ((keys["w"] || keys["arrowup"]) && leftPaddleY > 0) leftPaddleY -= moveStep;
  if ((keys["s"] || keys["arrowdown"]) && leftPaddleY + playerPaddleHeight < canvas.height) {
    leftPaddleY += moveStep;
  }

  // 🤖 AI paddle (dumber in easy mode)
  let aiSpeed = 3; // slow paddle
  let errorMargin = 100; // big miss chance
  let targetY = ballY + ballSize / 2 - aiPaddleHeight / 2;
  targetY += (Math.random() * errorMargin - errorMargin / 2);

  if (rightPaddleY + aiPaddleHeight / 2 < targetY) rightPaddleY += aiSpeed;
  else if (rightPaddleY + aiPaddleHeight / 2 > targetY) rightPaddleY -= aiSpeed;

  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY + aiPaddleHeight > canvas.height) {
    rightPaddleY = canvas.height - aiPaddleHeight;
  }

  // Sudden death win (1 point)
  if (leftScore >= 1 || rightScore >= 1) {
    gameRunning = false;
    canvas.style.display = "none";
    gameOverScreen.classList.remove("hidden");
    winnerText.innerText = leftScore >= 1 ? "🎉 You Win!" : "🤖 AI Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

// Countdown
function startCountdown() {
  countdown = 3;
  let interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(countdown > 0 ? countdown : "Go!", canvas.width / 2, canvas.height / 2);
    countdown--;
    if (countdown < 0) {
      clearInterval(interval);
      gameRunning = true;
      resetBall();
      requestAnimationFrame(draw);
    }
  }, 1000);
}

// Start
startBtn.addEventListener("click", () => {
  leftScore = rightScore = 0;
  difficulty = "easy"; // ✅ force easy always
  resetPaddles();
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.style.display = "block";
  startCountdown();
});

// Restart → menu
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
});

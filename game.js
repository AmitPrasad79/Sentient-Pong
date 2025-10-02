const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

let mode = "ai";
let difficulty = "normal";
let gameRunning = false;

// Paddle settings
const paddleWidth = 15, paddleHeight = 80;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Ball
let ballSize = 25;
const ballImage = new Image();
ballImage.src = "./assets/dog.png";
let ballX, ballY, ballSpeedX, ballSpeedY;

// Score
let leftScore = 0, rightScore = 0;

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;

  let baseSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  ballSpeedX = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
  ballSpeedY = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
}

// Draw paddles & ball
function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}
function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
}

// Smooth paddle AI move
function smoothMove(current, target, speed) {
  const diff = target - current;
  return current + diff * speed;
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();

  ctx.font = "20px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 30);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 30);

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off top/bottom
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Paddle collisions
  if (ballX <= paddleWidth &&
      ballY + ballSize >= leftPaddleY &&
      ballY <= leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX + ballSize >= canvas.width - paddleWidth &&
      ballY + ballSize >= rightPaddleY &&
      ballY <= rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) { rightScore++; resetBall(); }
  if (ballX + ballSize > canvas.width) { leftScore++; resetBall(); }

  // AI movement
  if (mode === "ai") {
    let targetY = ballY - paddleHeight / 2 + ballSize / 2;
    let aiSpeed = difficulty === "easy" ? 0.08 : difficulty === "normal" ? 0.15 : 0.25;
    rightPaddleY = smoothMove(rightPaddleY, targetY, aiSpeed);
  }

  // Win condition
  if (leftScore >= 3 || rightScore >= 3) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    winnerText.innerText = leftScore >= 3 ? "🎉 Player Wins!" : "🤖 AI Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

// Player controls
document.addEventListener("keydown", e => {
  const step = 30;
  if (e.key === "w") leftPaddleY -= step;
  if (e.key === "s") leftPaddleY += step;
  if (mode === "multiplayer") {
    if (e.key === "ArrowUp") rightPaddleY -= step;
    if (e.key === "ArrowDown") rightPaddleY += step;
  }
});

// Start button
startBtn.addEventListener("click", () => {
  mode = document.getElementById("mode").value;
  difficulty = document.getElementById("difficulty").value;
  leftScore = rightScore = 0;
  resetBall();
  gameRunning = true;
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  requestAnimationFrame(draw);
});

// Restart button
restartBtn.addEventListener("click", () => {
  leftScore = rightScore = 0;
  resetBall();
  gameRunning = true;
  gameOverScreen.classList.add("hidden");
  requestAnimationFrame(draw);
});

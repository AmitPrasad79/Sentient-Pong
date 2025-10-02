const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleWidth = 10, paddleHeight = 80;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX, ballY, ballSpeedX, ballSpeedY, ballSize = 15;

let playerScore = 0, highScore = 0;
let gameRunning = false;
let mode = "easy"; // default mode

// Smooth movement helper
function smoothMove(current, target, speed) {
  const diff = target - current;
  return current + diff * speed;
}

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = Math.random() > 0.5 ? 3 : -3;
  ballSpeedY = (Math.random() - 0.5) * 4;
}

// Draw paddles
function drawPaddle(x, y) {
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Countdown before start
function startCountdown(callback) {
  let count = 3;
  let countdownInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(count > 0 ? count : "Go!", canvas.width / 2, canvas.height / 2);

    if (count < 0) {
      clearInterval(countdownInterval);
      callback();
    }
    count--;
  }, 1000);
}

// Draw game loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  // Paddles & Ball
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();

  // Scores
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + playerScore, canvas.width / 2, 20);
  ctx.fillText("High Score: " + highScore, canvas.width / 2, 50);

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Player paddle collision
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playerScore++;
    if (playerScore > highScore) highScore = playerScore;
  }

  // AI paddle collision
  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Out of bounds
  if (ballX < 0) {
    // Player missed
    endGame("Game Over! Bot Wins!");
  }
  if (ballX + ballSize > canvas.width) {
    // AI missed
    endGame("You Win!");
  }

  // AI movement (with imperfection)
  if (mode === "easy") {
    rightPaddleY = smoothMove(rightPaddleY, ballY - paddleHeight / 2, 0.05);
  } else if (mode === "normal") {
    rightPaddleY = smoothMove(rightPaddleY, ballY - paddleHeight / 2 + (Math.random() * 30 - 15), 0.08);
  } else if (mode === "hard") {
    rightPaddleY = smoothMove(rightPaddleY, ballY - paddleHeight / 2 + (Math.random() * 20 - 10), 0.1);
  }

  requestAnimationFrame(draw);
}

// Game over
function endGame(message) {
  gameRunning = false;
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  setTimeout(() => {
    document.getElementById("modeSelection").style.display = "block";
  }, 1500);
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "w") leftPaddleY -= 30;
  if (e.key === "s") leftPaddleY += 30;
  if (e.key === "ArrowUp") leftPaddleY -= 30;
  if (e.key === "ArrowDown") leftPaddleY += 30;

  // Limit paddle inside canvas
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;
});

// Start game
function startGame(selectedMode) {
  mode = selectedMode;
  playerScore = 0;
  resetBall();
  document.getElementById("modeSelection").style.display = "none";
  startCountdown(() => {
    gameRunning = true;
    draw();
  });
}

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
ballImage.src = "./assets/dog.png";  // put your PNG inside ./assets/
let ballX, ballY, ballSpeedX, ballSpeedY;

// Score
let leftScore = 0, rightScore = 0;

// Key states
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// Reset ball position & speed
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

// Smooth AI paddle movement
function smoothMove(current, target, speed) {
  return current + (target - current) * speed;
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles & ball
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();

  // Draw score
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

  // ==== Player paddle controls ====
  const moveStep = 6;

  // Left paddle (Player 1) → W/S or ArrowUp/ArrowDown
  if ((keys["w"] || keys["arrowup"]) && leftPaddleY > 0) {
    leftPaddleY -= moveStep;
  }
  if ((keys["s"] || keys["arrowdown"]) && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += moveStep;
  }

  // Right paddle (Player 2) → only if multiplayer
  if (mode === "multiplayer") {
    if (keys["arrowup"] && rightPaddleY > 0) {
      rightPaddleY -= moveStep;
    }
    if (keys["arrowdown"] && rightPaddleY + paddleHeight < canvas.height) {
      rightPaddleY += moveStep;
    }
  }

  // ==== AI movement ====
  if (mode === "ai") {
    let targetY = ballY - paddleHeight / 2 + ballSize / 2;
    let aiSpeed = difficulty === "easy" ? 0.05 : difficulty === "normal" ? 0.1 : 0.18;
    rightPaddleY = smoothMove(rightPaddleY, targetY, aiSpeed);
  }

  // ==== Win condition ====
  if (leftScore >= 3 || rightScore >= 3) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    winnerText.innerText = leftScore >= 3 ? "🎉 Player Wins!" : "🤖 AI Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

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

// ================== GAME VARIABLES ==================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const winnerText = document.getElementById("winnerText");

const paddleHeight = 80;
const paddleWidth = 10;

let leftPaddleY, rightPaddleY;
let ballX, ballY, ballSpeedX, ballSpeedY;
let leftScore, rightScore;
let gameRunning = false;
let difficulty = "easy"; // ✅ default is EASY

// Stats
let totalGames = 0;
let playerWins = 0;
let aiWins = 0;

// Difficulty settings
const aiSpeeds = {
  easy: 2,
  normal: 4,
  hard: 7
};

// ================== EVENT LISTENERS ==================
startBtn.addEventListener("click", () => {
  difficulty = document.getElementById("difficulty").value;
  startGame();
});

restartBtn.addEventListener("click", () => {
  startScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
});

// Paddle controls (keyboard + touch/mouse)
document.addEventListener("mousemove", (e) => {
  if (gameRunning) {
    let rect = canvas.getBoundingClientRect();
    leftPaddleY = e.clientY - rect.top - paddleHeight / 2;
  }
});

document.addEventListener("touchmove", (e) => {
  if (gameRunning) {
    let rect = canvas.getBoundingClientRect();
    leftPaddleY = e.touches[0].clientY - rect.top - paddleHeight / 2;
  }
});

// ================== GAME LOGIC ==================
function startGame() {
  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  resetBall();

  leftScore = 0;
  rightScore = 0;

  startScreen.classList.add("hidden");
  canvas.style.display = "block";
  gameOverScreen.classList.add("hidden");

  gameRunning = true;
  draw();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = Math.random() > 0.5 ? 4 : -4;
  ballSpeedY = (Math.random() - 0.5) * 6;
}

function drawNet() {
  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
  }
}

function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// ================== SCOREBOARD ==================
function drawScoreboard() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";

  ctx.textAlign = "left";
  ctx.fillText(`Player: ${leftScore}`, 20, 30);

  ctx.textAlign = "right";
  ctx.fillText(`AI: ${rightScore}`, canvas.width - 20, 30);

  ctx.textAlign = "center";
  ctx.fillText(`Games: ${totalGames} | Wins: ${playerWins} | AI Wins: ${aiWins}`, canvas.width / 2, 30);
}

// ================== GAME LOOP ==================
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();

  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();
  drawScoreboard();

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Paddle collision
  if (ballX < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) {
    rightScore++;
    resetBall();
  }
  if (ballX > canvas.width) {
    leftScore++;
    resetBall();
  }

  // AI Movement
  let aiCenter = rightPaddleY + paddleHeight / 2;
  if (difficulty === "easy") {
    // Add "dumb" movement for easy mode
    if (aiCenter < ballY - 30) rightPaddleY += aiSpeeds.easy;
    else if (aiCenter > ballY + 30) rightPaddleY -= aiSpeeds.easy;
  } else {
    // Normal / Hard more accurate
    if (aiCenter < ballY - 10) rightPaddleY += aiSpeeds[difficulty];
    else if (aiCenter > ballY + 10) rightPaddleY -= aiSpeeds[difficulty];
  }

  // ================== WIN CONDITION (Sudden Death) ==================
  if (leftScore >= 1 || rightScore >= 1) {
    gameRunning = false;
    totalGames++;

    if (leftScore >= 1) {
      playerWins++;
      winnerText.innerText = "🎉 You Win!";
    } else {
      aiWins++;
      winnerText.innerText = "🤖 AI Wins!";
    }

    canvas.style.display = "none";
    gameOverScreen.classList.remove("hidden");
  } else {
    requestAnimationFrame(draw);
  }
}

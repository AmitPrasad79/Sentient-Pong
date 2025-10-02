const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");
const scoreBoard = document.getElementById("scoreBoard");
const highScoreBoard = document.getElementById("highScore");

let difficulty = "normal";
let gameRunning = false;

const ballSize = 60;
const ballImage = new Image();
ballImage.src = "./assets/dog.png"; // your PNG

let ballX, ballY, ballSpeedX, ballSpeedY;
let playerScore = 0, botScore = 0;
let highScore = 0;

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;

  let baseSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  ballSpeedX = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
  ballSpeedY = Math.random() > 0.5 ? baseSpeed : -baseSpeed;
}

// Draw ball
function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
}

// Handle click on ball
canvas.addEventListener("click", (e) => {
  if (!gameRunning) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= ballX &&
    mouseX <= ballX + ballSize &&
    mouseY >= ballY &&
    mouseY <= ballY + ballSize
  ) {
    playerScore++;
    if (playerScore > highScore) highScore = playerScore;
    resetBall();
  }
});

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  drawBall();

  // Draw scores
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Your Score: ${playerScore}`, 20, 30);
  ctx.fillText(`Bot Score: ${botScore}`, canvas.width - 150, 30);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2 - 60, 30);

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Missed ball → bot scores
  if (ballX < 0 || ballX + ballSize > canvas.width) {
    botScore++;
    resetBall();
  }

  // Win condition
  if (playerScore >= 3 || botScore >= 3) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    winnerText.innerText = playerScore >= 3 ? "🎉 You Win!" : "🤖 Bot Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

// Start button
startBtn.addEventListener("click", () => {
  difficulty = document.getElementById("difficulty").value;
  playerScore = botScore = 0;
  resetBall();
  gameRunning = true;
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  requestAnimationFrame(draw);
});

// Restart button
restartBtn.addEventListener("click", () => {
  playerScore = botScore = 0;
  resetBall();
  gameRunning = true;
  gameOverScreen.classList.add("hidden");
  requestAnimationFrame(draw);
});

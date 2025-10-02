const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let gameRunning = false;

// Loader simulation
let loadProgress = 0;
const loader = document.getElementById("loader");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const loadingText = document.getElementById("loading-text");

let loadProgress = 0;
let loaderInterval = setInterval(() => {
  loadProgress += 20; // jumps faster
  loadingText.innerText = `Loading... ${loadProgress}%`;
  if (loadProgress >= 100) {
    clearInterval(loaderInterval);
    loader.classList.add("hidden");
    menu.classList.remove("hidden");
  }
}, 200); // total 1 second

// Start button event
startBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  canvas.classList.remove("hidden");
  startGame();
});

// Game objects
const paddleWidth = 10, paddleHeight = 80;
let player = { x: 20, y: canvas.height / 2 - 40, score: 0 };
let ai = { x: canvas.width - 30, y: canvas.height / 2 - 40, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: 12, speedX: 3, speedY: 2 };

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(text, x, y);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 3; // Slower ball
  ball.speedY = (Math.random() > 0.5 ? 1 : -1) * 2;
}

function update() {
  // Ball movement
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Bounce top/bottom
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.speedY *= -1;
  }

  // Paddle collisions
  if (
    ball.x - ball.size < player.x + paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  if (
    ball.x + ball.size > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  // Scoring
  if (ball.x - ball.size < 0) {
    ai.score++;
    resetBall();
  }
  if (ball.x + ball.size > canvas.width) {
    player.score++;
    resetBall();
  }

  // AI movement
  ai.y += (ball.y - (ai.y + paddleHeight / 2)) * 0.08;
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, "#222");
  drawRect(player.x, player.y, paddleWidth, paddleHeight, "white");
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "white");
  drawCircle(ball.x, ball.y, ball.size, "orange");
  drawText(player.score, canvas.width / 4, 50);
  drawText(ai.score, (canvas.width / 4) * 3, 50);
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  resetBall();
  gameRunning = true;
  gameLoop();

  // Paddle movement (arrow keys)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && player.y > 0) player.y -= 30;
    if (e.key === "ArrowDown" && player.y < canvas.height - paddleHeight) player.y += 30;
  });
}

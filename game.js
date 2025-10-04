const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const winnerText = document.getElementById("winner");
const difficultySelect = document.getElementById("difficulty");

let gameRunning = false;
let player, ai, ball;
let playerScore = 0, aiScore = 0, gamesPlayed = 0;
let gameLoop;

// ======== OBJECTS ==========
class Paddle {
  constructor(x, width, height, speed, isAI = false) {
    this.x = x;
    this.y = canvas.height / 2 - height / 2;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.isAI = isAI;
  }

  move(up, down) {
    if (this.isAI) return;
    if (up && this.y > 0) this.y -= this.speed;
    if (down && this.y + this.height < canvas.height) this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor(size, speed) {
    this.size = size;
    this.reset(speed);
  }

  reset(speed) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.dx = Math.random() < 0.5 ? -speed : speed;
    this.dy = (Math.random() - 0.5) * speed * 0.8;
    this.speed = speed;
  }

  draw() {
    const img = new Image();
    img.src = "sentient.png";
    ctx.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  update(player, ai) {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y <= 0 || this.y >= canvas.height) this.dy *= -1;

    // Player collision
    if (
      this.x - this.size / 2 < player.x + player.width &&
      this.y > player.y &&
      this.y < player.y + player.height
    ) {
      this.dx = Math.abs(this.speed);
    }

    // AI collision
    if (
      this.x + this.size / 2 > ai.x &&
      this.y > ai.y &&
      this.y < ai.y + ai.height
    ) {
      this.dx = -Math.abs(this.speed);
    }

    // Out of bounds
    if (this.x < 0) return "AI";
    if (this.x > canvas.width) return "Player";
    return null;
  }
}

// ======== GAME CONTROL ==========
function setDifficulty(level) {
  switch (level) {
    case "easy":
      return {
        playerHeight: 100,
        aiHeight: 60,
        ballSpeed: 4,
        aiSpeed: 3,
      };
    case "normal":
      return {
        playerHeight: 80,
        aiHeight: 80,
        ballSpeed: 5,
        aiSpeed: 4.5,
      };
    case "hard":
      return {
        playerHeight: 60,
        aiHeight: 100,
        ballSpeed: 6,
        aiSpeed: 6,
      };
  }
}

function startGame() {
  const difficulty = difficultySelect.value;
  const config = setDifficulty(difficulty);

  player = new Paddle(20, 10, config.playerHeight, 8);
  ai = new Paddle(canvas.width - 30, 10, config.aiHeight, config.aiSpeed, true);
  ball = new Ball(20, config.ballSpeed);

  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.style.display = "block";

  gameRunning = true;
  gamesPlayed++;

  gameLoop = setInterval(updateGame, 1000 / 60);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player control
  const up = keys["ArrowUp"] || keys["w"];
  const down = keys["ArrowDown"] || keys["s"];
  player.move(up, down);

  // AI movement
  if (ball.y < ai.y + ai.height / 2) ai.y -= ai.speed;
  if (ball.y > ai.y + ai.height / 2) ai.y += ai.speed;

  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));

  // Ball update
  const result = ball.update(player, ai);
  if (result) endGame(result);

  // Draw everything
  ball.draw();
  player.draw();
  ai.draw();

  // Score text
  ctx.fillStyle = "#fff";
  ctx.font = "18px Poppins";
  ctx.fillText(`Games: ${gamesPlayed} | Wins: ${playerScore} | AI: ${aiScore}`, 350, 30);
}

function endGame(winner) {
  clearInterval(gameLoop);
  gameRunning = false;

  if (winner === "Player") playerScore++;
  else aiScore++;

  canvas.style.display = "none";
  winnerText.textContent = winner === "Player" ? "You Win! 🎉" : "AI Wins 💀";
  gameOverScreen.classList.remove("hidden");
}

// ======== EVENT HANDLERS ==========
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  menu.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
});

const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

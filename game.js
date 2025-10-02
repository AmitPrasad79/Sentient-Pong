const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let gameRunning = false;
let countdownActive = false;
let countdown = 3;

let playerScore = 0;
let aiScore = 0;
let highScore = 0;

const paddleWidth = 100, paddleHeight = 20;
const ballSize = 15;

let player = { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - 30, width: paddleWidth, height: paddleHeight, dy: 0 };
let ai = { x: canvas.width / 2 - paddleWidth / 2, y: 10, width: paddleWidth, height: paddleHeight };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, size: ballSize };

document.getElementById("startBtn").addEventListener("click", startCountdown);

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.dy = -6;
    if (e.key === "ArrowRight" || e.key === "d") player.dy = 6;
});

document.addEventListener("keyup", () => { player.dy = 0; });

function startCountdown() {
    if (gameRunning || countdownActive) return;
    countdown = 3;
    countdownActive = true;
    let interval = setInterval(() => {
        drawCountdown();
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            countdownActive = false;
            startGame();
        }
    }, 1000);
}

function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(countdown > 0 ? countdown : "GO!", canvas.width / 2, canvas.height / 2);
}

function startGame() {
    resetBall();
    gameRunning = true;
    requestAnimationFrame(update);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = Math.random() > 0.5 ? 4 : -4;
    ball.dy = 4;
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += player.dy;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Move AI (simple tracking)
    ai.x += (ball.x - (ai.x + ai.width / 2)) * 0.07;

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall bounce
    if (ball.x < 0 || ball.x + ball.size > canvas.width) ball.dx *= -1;

    // Paddle collisions
    if (
        ball.y + ball.size > player.y &&
        ball.x > player.x &&
        ball.x < player.x + player.width
    ) {
        ball.dy *= -1;
        playerScore++;
        if (playerScore > highScore) highScore = playerScore;
    }

    if (
        ball.y < ai.y + ai.height &&
        ball.x > ai.x &&
        ball.x < ai.x + ai.width
    ) {
        ball.dy *= -1;
        aiScore++;
    }

    // Scoring
    if (ball.y + ball.size > canvas.height) {
        aiScore++;
        resetBall();
    }
    if (ball.y < 0) {
        playerScore++;
        if (playerScore > highScore) highScore = playerScore;
        resetBall();
    }

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "20px Arial";
    ctx.fillText("Player: " + playerScore, 100, canvas.height - 20);
    ctx.fillText("AI: " + aiScore, 100, 40);
    ctx.fillText("High Score: " + highScore, canvas.width - 200, 40);

    requestAnimationFrame(update);
}

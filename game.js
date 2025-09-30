const canvas = document.getElementById("gameCanvas");
}


function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);


// Draw paddles
ctx.fillStyle = "white";
drawPaddle(0, leftPaddleY);
drawPaddle(canvas.width - paddleWidth, rightPaddleY);


// Draw ball
drawBall();


// Draw scores
ctx.font = "20px Arial";
ctx.fillText(leftScore, canvas.width / 4, 20);
ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);


// Move ball
ballX += ballSpeedX;
ballY += ballSpeedY;


// Collisions with top/bottom
if (ballY <= 0 || ballY + ballSize >= canvas.height) {
ballSpeedY = -ballSpeedY;
}


// Collisions with paddles
if (
ballX <= paddleWidth &&
ballY + ballSize >= leftPaddleY &&
ballY <= leftPaddleY + paddleHeight
) {
ballSpeedX = -ballSpeedX;
}
if (
ballX + ballSize >= canvas.width - paddleWidth &&
ballY + ballSize >= rightPaddleY &&
ballY <= rightPaddleY + paddleHeight
) {
ballSpeedX = -ballSpeedX;
}


// Scoring
if (ballX < 0) {
rightScore++;
resetBallPosition();
}
if (ballX + ballSize > canvas.width) {
leftScore++;
resetBallPosition();
}


// Move right paddle
if (mode === "ai") {
if (rightPaddleY + paddleHeight / 2 < ballY) {
rightPaddleY += paddleSpeed * 0.7;
} else {
rightPaddleY -= paddleSpeed * 0.7;
}
}


requestAnimationFrame(draw);
}


// Controls
window.addEventListener("keydown", (e) => {
// Left paddle (Player 1)
if (e.key === "ArrowUp" && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
if (e.key === "ArrowDown" && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += paddleSpeed;


if (mode === "multiplayer") {
// Right paddle (Player 2)
if (e.key === "w" && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
if (e.key === "s" && rightPaddleY + paddleHeight < canvas.height) rightPaddleY += paddleSpeed;
}
});


// Start game
function startGame() {
document.getElementById("overlay").style.display = "none";


mode = document.getElementById("mode").value;
let selectedSpeed = document.getElementById("speed").value;


ballSpeedX = speeds[selectedSpeed].ballX * (Math.random() > 0.5 ? 1 : -1);
ballSpeedY = speeds[selectedSpeed].ballY * (Math.random() > 0.5 ? 1 : -1);


if (!gameRunning) {
gameRunning = true;
requestAnimationFrame(draw);
}
}

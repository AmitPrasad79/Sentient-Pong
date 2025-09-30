const canvas = document.getElementById("gameCanvas");
ctx.clearRect(0, 0, canvas.width, canvas.height);


ctx.fillStyle = "white";
drawPaddle(0, leftPaddleY);
drawPaddle(canvas.width - paddleWidth, rightPaddleY);


drawBall();


ctx.font = "20px Arial";
ctx.fillText(leftScore, canvas.width / 4, 20);
ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);


ballX += ballSpeedX;
ballY += ballSpeedY;


if (ballY <= 0 || ballY + ballSize >= canvas.height) {
ballSpeedY = -ballSpeedY;
}


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


if (ballX < 0) {
rightScore++;
resetBallPosition();
}
if (ballX + ballSize > canvas.width) {
leftScore++;
resetBallPosition();
}


if (mode === "ai") {
let targetY = ballY - paddleHeight / 2 + ballSize / 2;
let diff = targetY - rightPaddleY;
rightPaddleY += diff * 0.15; // Smooth and fast AI movement
}


requestAnimationFrame(draw);
}


window.addEventListener("keydown", (e) => {
if (e.key === "ArrowUp" && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
if (e.key === "ArrowDown" && leftPaddleY + paddleHeight < canvas.height)
leftPaddleY += paddleSpeed;


if (mode === "multiplayer") {
if (e.key === "w" && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
if (e.key === "s" && rightPaddleY + paddleHeight < canvas.height)
rightPaddleY += paddleSpeed;
}
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";

        mode = document.getElementById("mode").value;
        let selectedSpeed = document.getElementById("speed").value;

        ballSpeedX = speeds[selectedSpeed].ballX * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = speeds[selectedSpeed].ballY * (Math.random() > 0.5 ? 1 : -1);

        if (!gameRunning) {
            gameRunning = true;
            requestAnimationFrame(draw);
        }
    });
});

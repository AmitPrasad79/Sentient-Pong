const bgCanvas = document.getElementById("bgCanvas");
const ctx2 = bgCanvas.getContext("2d");

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBg);
resizeBg();

let balls = [];

function createBall() {
  balls.push({
    x: Math.random() * bgCanvas.width,
    y: -20,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 1 + 0.5,
    alpha: Math.random() * 0.8 + 0.2
  });
}

// create 5–6 new balls every ~500ms instead of all at once
setInterval(() => {
  for (let i = 0; i < 5; i++) createBall();
}, 500);

function update() {
  ctx2.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  ctx2.fillStyle = "rgba(255, 105, 180, 0.8)";
  balls.forEach(b => {
    ctx2.globalAlpha = b.alpha;
    ctx2.beginPath();
    ctx2.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx2.fill();
    b.y += b.speed;
  });

  // remove off-screen balls
  balls = balls.filter(b => b.y < bgCanvas.height + 20);
  requestAnimationFrame(update);
}
update();

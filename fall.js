// fall.js - Rotating "snowfall" using senti.png (drop-in)
// - Each particle has independent rotation, size, speed, opacity
// - Gentle sway and respawn; light particle count for performance
// - Make sure bgCanvas exists in HTML and senti.png path is correct

const BG_CANVAS_ID = "bgCanvas";
const IMG_PATH = "./assets/sentient.png"; // change if your path differs
const MAX_PARTICLES = 16;                 // fewer = calmer; raise if wanted
const SPAWN_SPREAD = 1.0;                 // spawn spread across width (1.0 full)
const MIN_SIZE = 22;
const MAX_SIZE = 44;

const canvas = document.getElementById(BG_CANVAS_ID);
if (!canvas) {
  console.warn("fall.js: <canvas id='bgCanvas'> not found in DOM.");
} else {
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = true;

  // Resize canvas to cover viewport (CSS controls visual size)
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Load image
  const img = new Image();
  img.src = IMG_PATH;

  // Particle class
  class Particle {
    constructor(initY = null) {
      this.reset(initY);
    }
    reset(initY = null) {
      this.size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      // start x anywhere within spawn spread (can be slightly off-screen)
      this.x = Math.random() * canvas.width * SPAWN_SPREAD;
      this.y = initY != null ? initY : - (20 + Math.random() * canvas.height * 0.3);
      // vertical speed: slow for snow-like
      this.vy = 0.3 + Math.random() * 1.1;
      // horizontal drift (sway)
      this.vx = (Math.random() - 0.5) * 0.6;
      // rotation
      this.rotation = Math.random() * Math.PI * 2;
      // rotation speed small and can be negative (direction)
      this.vr = (Math.random() - 0.5) * 0.02;
      // slight sinusoidal sway amplitude / phase for gentle oscillation
      this.swayAmp = 5 + Math.random() * 12;
      this.swayPhase = Math.random() * Math.PI * 2;
      // opacity
      this.alpha = 0.6 + Math.random() * 0.35;
      // life offset to vary starting sway
      this.t = Math.random() * 1000;
    }
    update(dt) {
      // dt is in ms (but we will use a small multiplier so behavior stays stable)
      this.t += dt * 0.001;
      // Sway modifies x with a smooth sin wave (gentle)
      this.x += this.vx + Math.sin(this.t + this.swayPhase) * (this.swayAmp * 0.001);
      this.y += this.vy;
      this.rotation += this.vr;

      // If out of bottom, reset slightly above top for seamless loop
      if (this.y > canvas.height + this.size) {
        this.reset(-this.size - Math.random() * 60);
      }
    }
    draw(ctx) {
      if (!img.complete) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      // translate to center of particle and rotate
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate(this.rotation);
      // draw image centered
      ctx.drawImage(img, -this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  // particle pool
  const particles = [];
  // prefill with staggered y positions for an immediate natural look
  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      // stagger start heights so they're not all at top at once
      const startY = -Math.random() * canvas.height * 0.8 - i * (canvas.height / MAX_PARTICLES) * 0.02;
      particles.push(new Particle(startY));
    }
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(40, now - last); // cap dt to avoid big jumps
    last = now;

    // clear only the canvas (transparent background)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update + draw particles
    for (let p of particles) {
      p.update(dt);
      p.draw(ctx);
    }

    requestAnimationFrame(loop);
  }

  // start animation when image loads (so transparent PNG draws correctly)
  img.onload = () => {
    initParticles();
    last = performance.now();
    requestAnimationFrame(loop);
  };

  // in case the image is cached and already loaded
  if (img.complete && img.naturalWidth) {
    img.onload?.();
  }
}

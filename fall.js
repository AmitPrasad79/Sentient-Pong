// fall.js - safe, self-contained rotating snowfall using senti.png
(function () {
  "use strict";

  function startBackground() {
    const bgCanvas = document.getElementById("bgCanvas");
    if (!bgCanvas) {
      console.warn("fall.js: #bgCanvas not found");
      return;
    }
    const bgCtx = bgCanvas.getContext("2d", { alpha: true });
    bgCtx.imageSmoothingEnabled = true;

    // sizing
    function resize() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // image — ensure path is correct (./assets/sentient.png by your project)
    const img = new Image();
    img.src = "./assets/sentient.png";

    // config
    const MAX_PARTICLES = 12; // keep it calm
    const MIN_SIZE = 24;
    const MAX_SIZE = 44;

    // particle class
    class Particle {
      constructor(startY = null) { this.reset(startY); }
      reset(startY = null) {
        this.size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
        this.x = Math.random() * bgCanvas.width;
        this.y = startY != null ? startY : - (10 + Math.random() * bgCanvas.height * 0.4);
        this.vy = 0.4 + Math.random() * 1.0;      // vertical speed
        this.vx = (Math.random() - 0.5) * 0.4;    // horizontal drift
        this.rotation = Math.random() * Math.PI * 2;
        this.vr = (Math.random() - 0.5) * 0.02;   // rotation speed
        this.swayAmp = 4 + Math.random() * 10;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.alpha = 0.6 + Math.random() * 0.35;
        this.t = Math.random() * 1000;
      }
      update(dt) {
        this.t += dt * 0.001;
        this.x += this.vx + Math.sin(this.t + this.swayPhase) * (this.swayAmp * 0.001);
        this.y += this.vy;
        this.rotation += this.vr;
        if (this.y > bgCanvas.height + this.size) {
          this.reset(-this.size - Math.random() * 60);
        }
      }
      draw(ctx) {
        if (!img.complete) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x + this.size/2, this.y + this.size/2);
        ctx.rotate(this.rotation);
        ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
      }
    }

    // create pool (staggered start y for natural spread)
    const particles = [];
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const startY = -Math.random() * bgCanvas.height * 0.6 - i * (bgCanvas.height / MAX_PARTICLES) * 0.02;
        particles.push(new Particle(startY));
      }
    }

    // animation loop
    let last = performance.now();
    function loop(now) {
      const dt = Math.min(40, now - last);
      last = now;

      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      for (let p of particles) {
        p.update(dt);
        p.draw(bgCtx);
      }
      requestAnimationFrame(loop);
    }

    // start when image loads (so transparency works instantly)
    img.onload = () => {
      initParticles();
      last = performance.now();
      requestAnimationFrame(loop);
    };

    // if image was cached and is already loaded
    if (img.complete && img.naturalWidth) {
      img.onload();
    }
  }

  // Wait until DOM ready (safe both when script is at bottom or head)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBackground);
  } else {
    startBackground();
  }
})();

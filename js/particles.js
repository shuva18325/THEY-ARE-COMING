/* ===== THEY ARE COMING — particles, lights, decals, screen shake ===== */
(function (T) {
  'use strict';

  class ParticleSystem {
    constructor() {
      this.parts = [];
      this.lights = [];     // {x,y,r,color,life,max}
      this.decals = [];     // persistent blood/scorch on ground (budgeted)
      this.floaters = [];   // damage/cash text
      this.shake = 0;
      this.maxDecals = 220;
    }

    clear() { this.parts.length = 0; this.lights.length = 0; this.decals.length = 0; this.floaters.length = 0; this.shake = 0; }

    // ---- spawners ----
    spark(x, y, dir, n, col) {
      for (let i = 0; i < n; i++) {
        const a = dir + T.rand(-0.9, 0.9), s = T.rand(40, 180);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.15, 0.4), max: 0.4, r: T.rand(0.6, 1.6), col: col || '#ffd24a', g: 0, fade: true });
      }
    }
    blood(x, y, dir, n) {
      for (let i = 0; i < (n || 7); i++) {
        const a = dir + T.rand(-1.2, 1.2), s = T.rand(30, 150);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.25, 0.6), max: 0.6, r: T.rand(0.8, 2.2), col: T.pick(['#b51d1d', '#7a1414', '#9a1818']), g: 140, fade: false, decay: true });
      }
      if (T.chance(0.7)) this.addDecal(x, y, T.rand(2, 5), 'rgba(90,15,15,0.5)');
    }
    gib(x, y, n) {
      for (let i = 0; i < (n || 5); i++) {
        const a = T.rand(0, T.TAU), s = T.rand(40, 160);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.4, 0.9), max: 0.9, r: T.rand(1.4, 3), col: T.pick(['#7a1414', '#5a6e3a', '#9a1818']), g: 220, fade: false, decay: true });
      }
      this.addDecal(x, y, T.rand(5, 9), 'rgba(80,15,15,0.55)');
    }
    debris(x, y, dir, col) {
      for (let i = 0; i < 5; i++) {
        const a = dir + T.rand(-1, 1), s = T.rand(30, 120);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.2, 0.5), max: 0.5, r: T.rand(0.8, 1.8), col: col || '#7a7560', g: 180, fade: false });
      }
    }
    smoke(x, y, n, col) {
      for (let i = 0; i < (n || 3); i++) {
        this.parts.push({ x: x + T.rand(-3, 3), y: y + T.rand(-3, 3), vx: T.rand(-8, 8), vy: T.rand(-26, -10), life: T.rand(0.6, 1.4), max: 1.4, r: T.rand(2, 5), col: col || 'rgba(60,60,60,0.5)', g: 0, grow: 8, fade: true, smoke: true });
      }
    }
    fire(x, y, n) {
      for (let i = 0; i < (n || 2); i++) {
        this.parts.push({ x: x + T.rand(-4, 4), y: y + T.rand(-4, 4), vx: T.rand(-10, 10), vy: T.rand(-40, -16), life: T.rand(0.3, 0.7), max: 0.7, r: T.rand(2, 4.5), col: T.pick(['#f2c14e', '#e07a2a', '#c83a1a']), g: 0, fade: true, light: true });
      }
      this.light(x, y, 26, 'rgba(230,120,40,0.5)', 0.12);
    }
    muzzle(x, y, dir, scale) {
      scale = scale || 1;
      // bright yellow flash sprite-particle (1-2 frames)
      this.parts.push({ x, y, vx: Math.cos(dir) * 30, vy: Math.sin(dir) * 30, life: 0.05, max: 0.05, r: 3.2 * scale, col: '#fff3b0', g: 0, fade: true, flash: true });
      this.parts.push({ x, y, vx: 0, vy: 0, life: 0.06, max: 0.06, r: 2.0 * scale, col: '#ffd24a', g: 0, fade: true, flash: true });
      for (let i = 0; i < 3; i++) { const a = dir + T.rand(-0.4, 0.4); this.parts.push({ x, y, vx: Math.cos(a) * T.rand(60, 140), vy: Math.sin(a) * T.rand(60, 140), life: 0.12, max: 0.12, r: 1, col: '#ffe07a', g: 0, fade: true }); }
      this.light(x, y, 34 * scale, 'rgba(255,220,120,0.8)', 0.06);
      this.smoke(x, y, 1, 'rgba(120,110,90,0.3)');
    }
    explosion(x, y, r, fire) {
      for (let i = 0; i < 26; i++) {
        const a = T.rand(0, T.TAU), s = T.rand(60, 260);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.2, 0.6), max: 0.6, r: T.rand(1.5, 4), col: fire ? T.pick(['#f2c14e', '#e07a2a', '#c83a1a']) : T.pick(['#ffd24a', '#aaa', '#777']), g: 60, fade: true });
      }
      this.smoke(x, y, 8, 'rgba(50,50,50,0.6)');
      this.light(x, y, r * 1.8, fire ? 'rgba(240,140,40,0.9)' : 'rgba(255,220,120,0.9)', 0.25);
      this.addDecal(x, y, r * 0.7, 'rgba(20,15,12,0.5)');
      this.shakeBy(fire ? 5 : 7);
    }
    acid(x, y, n) {
      for (let i = 0; i < (n || 6); i++) { const a = T.rand(0, T.TAU), s = T.rand(20, 90); this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: T.rand(0.2, 0.5), max: 0.5, r: T.rand(1, 2.4), col: '#9ad83a', g: 60, fade: true }); }
      this.addDecal(x, y, T.rand(4, 8), 'rgba(90,140,30,0.4)');
    }

    light(x, y, r, col, life) { this.lights.push({ x, y, r, col, life: life || 0.1, max: life || 0.1 }); }
    addDecal(x, y, r, col) {
      this.decals.push({ x, y, r, col });
      if (this.decals.length > this.maxDecals) this.decals.splice(0, this.decals.length - this.maxDecals);
    }
    floatText(x, y, text, col, big) { this.floaters.push({ x, y, text, col: col || '#fff', life: 0.8, max: 0.8, vy: -28, big: !!big }); }
    shakeBy(n) { this.shake = Math.min(14, this.shake + n); }

    // ---- update ----
    update(dt) {
      for (let i = this.parts.length - 1; i >= 0; i--) {
        const p = this.parts[i];
        p.life -= dt;
        if (p.life <= 0) { this.parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.g) p.vy += p.g * dt;
        if (p.decay) { p.vx *= 0.86; p.vy *= 0.86; }
        if (p.grow) p.r += p.grow * dt;
      }
      for (let i = this.lights.length - 1; i >= 0; i--) { this.lights[i].life -= dt; if (this.lights[i].life <= 0) this.lights.splice(i, 1); }
      for (let i = this.floaters.length - 1; i >= 0; i--) { const f = this.floaters[i]; f.life -= dt; f.y += f.vy * dt; f.vy *= 0.92; if (f.life <= 0) this.floaters.splice(i, 1); }
      if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 28);
    }

    // ---- draw (world space, camera already applied) ----
    drawDecals(ctx) {
      for (const d of this.decals) { ctx.fillStyle = d.col; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, T.TAU); ctx.fill(); }
    }
    drawParts(ctx) {
      for (const p of this.parts) {
        const a = p.fade ? T.clamp(p.life / p.max, 0, 1) : 1;
        ctx.globalAlpha = p.smoke ? a * 0.6 : a;
        if (p.flash) {
          ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, T.TAU); ctx.fill();
        } else {
          ctx.fillStyle = p.col;
          ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
        }
      }
      ctx.globalAlpha = 1;
    }
    drawFloaters(ctx) {
      ctx.textAlign = 'center';
      for (const f of this.floaters) {
        const a = T.clamp(f.life / f.max, 0, 1);
        ctx.globalAlpha = a;
        ctx.font = (f.big ? 'bold 9px' : '7px') + ' "Courier New",monospace';
        ctx.fillStyle = '#000'; ctx.fillText(f.text, f.x + 0.6, f.y + 0.6);
        ctx.fillStyle = f.col; ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1; ctx.textAlign = 'left';
    }
    // additive lights pass
    drawLights(ctx) {
      ctx.globalCompositeOperation = 'lighter';
      for (const l of this.lights) {
        const a = T.clamp(l.life / l.max, 0, 1);
        const grd = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        grd.addColorStop(0, l.col); grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = a; ctx.fillStyle = grd;
        ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
  }

  T.ParticleSystem = ParticleSystem;
})(window.TAC);

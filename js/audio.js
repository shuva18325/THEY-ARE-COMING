/* ===== THEY ARE COMING — procedural audio (WebAudio) ===== */
(function (T) {
  'use strict';
  const A = { enabled: true, ctx: null, master: null };
  T.Audio = A;

  function ensure() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      A.ctx = new (window.AudioContext || window.webkitAudioContext)();
      A.master = A.ctx.createGain();
      A.master.gain.value = 0.5;
      A.master.connect(A.ctx.destination);
    } catch (e) { A.enabled = false; }
  }
  A.unlock = ensure;

  function noiseBuf(dur) {
    const n = A.ctx.sampleRate * dur, b = A.ctx.createBuffer(1, n, A.ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function env(node, t0, peak, dur, atk) {
    node.gain.setValueAtTime(0, t0);
    node.gain.linearRampToValueAtTime(peak, t0 + (atk || 0.005));
    node.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  }

  // generic gunshot: punchy noise burst + low thump, tuned per family
  A.shot = function (fam) {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const cfg = {
      Pistol:  { v: .35, d: .10, lp: 2600, body: 120 },
      SMG:     { v: .26, d: .07, lp: 3000, body: 150 },
      Rifle:   { v: .38, d: .12, lp: 2400, body: 100 },
      Shotgun: { v: .5,  d: .18, lp: 1800, body: 70 },
      Sniper:  { v: .55, d: .22, lp: 1600, body: 60 },
      LMG:     { v: .34, d: .10, lp: 2200, body: 90 },
      Special: { v: .4,  d: .15, lp: 2000, body: 90 },
    }[fam] || { v: .3, d: .1, lp: 2400, body: 110 };
    // noise crack
    const src = A.ctx.createBufferSource(); src.buffer = noiseBuf(cfg.d);
    const bp = A.ctx.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = cfg.lp;
    const g = A.ctx.createGain(); env(g, t, cfg.v, cfg.d, 0.002);
    src.connect(bp).connect(g).connect(A.master); src.start(t); src.stop(t + cfg.d);
    // low body thump
    const o = A.ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(cfg.body, t);
    o.frequency.exponentialRampToValueAtTime(cfg.body * 0.4, t + cfg.d);
    const g2 = A.ctx.createGain(); env(g2, t, cfg.v * 0.8, cfg.d * 1.2, 0.002);
    o.connect(g2).connect(A.master); o.start(t); o.stop(t + cfg.d * 1.2);
  };

  A.flame = function () {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const src = A.ctx.createBufferSource(); src.buffer = noiseBuf(0.12);
    const bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.6;
    const g = A.ctx.createGain(); env(g, t, 0.12, 0.12, 0.02);
    src.connect(bp).connect(g).connect(A.master); src.start(t); src.stop(t + 0.12);
  };

  A.explosion = function () {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const src = A.ctx.createBufferSource(); src.buffer = noiseBuf(0.5);
    const lp = A.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(1400, t);
    lp.frequency.exponentialRampToValueAtTime(200, t + 0.5);
    const g = A.ctx.createGain(); env(g, t, 0.7, 0.5, 0.003);
    src.connect(lp).connect(g).connect(A.master); src.start(t); src.stop(t + 0.5);
    const o = A.ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    const g2 = A.ctx.createGain(); env(g2, t, 0.6, 0.45, 0.003);
    o.connect(g2).connect(A.master); o.start(t); o.stop(t + 0.45);
  };

  A.hit = function () { // bullet meat impact
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const src = A.ctx.createBufferSource(); src.buffer = noiseBuf(0.05);
    const bp = A.ctx.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 900;
    const g = A.ctx.createGain(); env(g, t, 0.14, 0.05, 0.001);
    src.connect(bp).connect(g).connect(A.master); src.start(t); src.stop(t + 0.05);
  };

  A.spark = function () { // metal ricochet
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const o = A.ctx.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(2400, t);
    o.frequency.exponentialRampToValueAtTime(600, t + 0.06);
    const g = A.ctx.createGain(); env(g, t, 0.08, 0.07, 0.001);
    o.connect(g).connect(A.master); o.start(t); o.stop(t + 0.07);
  };

  A.reload = function () {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    [0, 0.12].forEach((dt, i) => {
      const o = A.ctx.createOscillator(); o.type = 'square';
      o.frequency.value = i ? 320 : 220;
      const g = A.ctx.createGain(); env(g, t + dt, 0.09, 0.05, 0.001);
      o.connect(g).connect(A.master); o.start(t + dt); o.stop(t + dt + 0.05);
    });
  };

  A.melee = function () {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const src = A.ctx.createBufferSource(); src.buffer = noiseBuf(0.12);
    const bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500;
    const g = A.ctx.createGain(); env(g, t, 0.18, 0.12, 0.002);
    src.connect(bp).connect(g).connect(A.master); src.start(t); src.stop(t + 0.12);
  };

  A.dry = function () { // empty click
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const o = A.ctx.createOscillator(); o.type = 'square'; o.frequency.value = 180;
    const g = A.ctx.createGain(); env(g, t, 0.05, 0.04, 0.001);
    o.connect(g).connect(A.master); o.start(t); o.stop(t + 0.04);
  };

  A.tone = function (freq, dur, type, vol) { // ui / pickup / scream
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const o = A.ctx.createOscillator(); o.type = type || 'square'; o.frequency.value = freq;
    const g = A.ctx.createGain(); env(g, t, vol || 0.12, dur, 0.005);
    o.connect(g).connect(A.master); o.start(t); o.stop(t + dur);
  };

  A.scream = function () {
    if (!A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    const o = A.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(220, t);
    o.frequency.linearRampToValueAtTime(660, t + 0.3); o.frequency.linearRampToValueAtTime(140, t + 0.7);
    const g = A.ctx.createGain(); env(g, t, 0.18, 0.7, 0.05);
    o.connect(g).connect(A.master); o.start(t); o.stop(t + 0.7);
  };

  A.coin = function () { A.tone(880, 0.07, 'square', 0.08); setTimeout(() => A.tone(1320, 0.07, 'square', 0.07), 50); };
  A.buy = function () { A.tone(660, 0.06, 'square', 0.1); setTimeout(() => A.tone(990, 0.08, 'square', 0.1), 60); };
  A.hurt = function () { A.tone(120, 0.12, 'sawtooth', 0.16); };

})(window.TAC);

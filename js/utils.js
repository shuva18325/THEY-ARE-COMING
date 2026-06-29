/* ===== THEY ARE COMING — utils & math ===== */
window.TAC = window.TAC || {};
(function (T) {
  'use strict';

  T.TAU = Math.PI * 2;
  T.clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  T.lerp = (a, b, t) => a + (b - a) * t;
  T.rand = (a, b) => a + Math.random() * (b - a);
  T.randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  T.pick = arr => arr[(Math.random() * arr.length) | 0];
  T.chance = p => Math.random() < p;
  T.dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  T.dist2 = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; };
  T.angle = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);
  T.angleDiff = (a, b) => {
    let d = (b - a) % T.TAU;
    if (d > Math.PI) d -= T.TAU;
    if (d < -Math.PI) d += T.TAU;
    return d;
  };
  T.approachAngle = (cur, target, max) => {
    const d = T.angleDiff(cur, target);
    if (Math.abs(d) <= max) return target;
    return cur + Math.sign(d) * max;
  };
  T.fmt = n => {
    n = Math.round(n);
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '' + n;
  };

  // circle-vs-circle overlap
  T.overlap = (a, b) => T.dist2(a.x, a.y, b.x, b.y) < (a.r + b.r) * (a.r + b.r);

  // rarity helpers
  T.RARITY = {
    common:    { name: 'COMMON',    color: '#9aa18c', mult: 1.0 },
    uncommon:  { name: 'UNCOMMON',  color: '#5fbf52', mult: 1.15 },
    rare:      { name: 'RARE',      color: '#3f8fe0', mult: 1.35 },
    epic:      { name: 'EPIC',      color: '#a35fe0', mult: 1.6 },
    legendary: { name: 'LEGENDARY', color: '#ef9a2e', mult: 1.9 },
    mythical:  { name: 'MYTHICAL',  color: '#ffd24a', mult: 3.0 },
    heavenly:  { name: 'HEAVENLY',  color: '#fff7d8', mult: 4.0 },
  };

  // simple seedable rng for deterministic-ish shop refresh (optional use)
  T.makeRng = seed => {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  T.$ = sel => document.querySelector(sel);
  T.$$ = sel => Array.from(document.querySelectorAll(sel));
  T.el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
})(window.TAC);

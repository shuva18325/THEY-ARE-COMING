/* ===== THEY ARE COMING — procedural pixel-art sprites ===== */
(function (T) {
  'use strict';
  const S = {};
  T.Sprites = S;

  // tiny canvas factory
  function cv(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    return { c, x };
  }
  S.cv = cv;

  // ---------------- GUNS ----------------
  // built pointing RIGHT, muzzle at right edge, axis (grip line) centered.
  // returns {canvas,len,h,axis,muzzle:{x,y}}
  const GUN_CACHE = {};
  const GUNMETAL = '#2b2d31', GUN_DK = '#16171a', GUN_HI = '#43464c', WOOD = '#5a4126', WOOD_HI='#7a5a33';

  function buildGun(id) {
    if (GUN_CACHE[id]) return GUN_CACHE[id];
    const w = T.WEAPONS[id];
    const fam = w.fam;
    const lenMap = { Pistol:9, SMG:13, Rifle:18, Shotgun:15, Sniper:24, LMG:19, Special:16, Melee:14 };
    let L = lenMap[fam] || 14;
    const H = 9, axis = 4;
    const { c, x } = cv(L + 2, H + 2);
    const ox = 1, oy = 1;
    const P = (px, py, w2, h2, col) => { x.fillStyle = col; x.fillRect(ox + px, oy + py, w2, h2); };

    // grip (down) common
    function grip(gx, col) { P(gx, axis, 2, 4, col || GUN_DK); P(gx, axis + 1, 2, 3, GUN_DK); }

    if (fam === 'Pistol') {
      P(2, axis - 1, L - 3, 2, GUNMETAL);          // slide
      P(2, axis - 1, L - 3, 1, GUN_HI);
      P(L - 4, axis, 4, 1, GUNMETAL);              // barrel
      grip(2);
    } else if (fam === 'SMG') {
      P(2, axis - 1, L - 3, 3, GUNMETAL);
      P(2, axis - 1, L - 3, 1, GUN_HI);
      P(L - 5, axis, 5, 1, GUN_DK);                // barrel
      P(4, axis + 2, 2, 4, GUN_DK);                // mag
      grip(2);
      P(0, axis, 2, 1, GUN_DK);                    // stock nub
    } else if (fam === 'Rifle') {
      P(2, axis - 1, L - 4, 3, GUNMETAL);
      P(2, axis - 1, L - 4, 1, GUN_HI);
      P(L - 6, axis, 6, 1, GUN_DK);                // barrel
      P(6, axis + 2, 2, 5, GUN_DK);                // mag
      P(7, axis - 2, 3, 1, GUN_DK);                // rail/sight
      grip(4);
      P(0, axis - 1, 2, 2, GUN_DK);                // stock
    } else if (fam === 'Shotgun') {
      P(2, axis - 1, L - 3, 3, GUNMETAL);
      P(2, axis - 1, L - 3, 1, GUN_HI);
      P(L - 6, axis, 6, 2, GUN_DK);                // thick barrel
      P(5, axis + 2, 4, 2, WOOD);                  // pump
      P(0, axis - 1, 3, 3, WOOD); P(0, axis - 1, 3, 1, WOOD_HI); // wood stock
      grip(3, WOOD);
    } else if (fam === 'Sniper') {
      P(2, axis - 1, L - 5, 2, GUNMETAL);
      P(2, axis - 1, L - 5, 1, GUN_HI);
      P(L - 9, axis, 9, 1, GUN_DK);                // long barrel
      P(8, axis - 3, 5, 2, GUN_DK);                // scope
      P(9, axis - 3, 3, 1, '#6cf');                // scope glass
      P(5, axis + 2, 2, 4, GUN_DK);                // mag
      P(0, axis - 1, 3, 3, GUN_DK);                // stock
      grip(4);
    } else if (fam === 'LMG') {
      P(2, axis - 1, L - 4, 4, GUNMETAL);
      P(2, axis - 1, L - 4, 1, GUN_HI);
      P(L - 7, axis, 7, 2, GUN_DK);                // heavy barrel
      P(4, axis + 3, 4, 4, GUN_DK);                // ammo box
      P(8, axis - 2, 4, 1, GUN_DK);
      grip(3); P(0, axis - 1, 2, 3, GUN_DK);
    } else if (fam === 'Special') {
      if (w.bullet === 'flame') {
        P(2, axis - 1, L - 5, 3, GUNMETAL);
        P(L - 6, axis, 6, 1, '#e07a2a');           // nozzle glow
        P(L - 2, axis - 1, 2, 3, '#f2c14e');
        P(3, axis + 2, 3, 5, '#a03020');           // fuel tank red
        grip(3);
      } else if (w.bullet === 'rail') {
        P(2, axis - 1, L - 3, 3, '#2a3540');
        P(2, axis - 1, L - 3, 1, '#5fc6e8');       // tech glow
        P(L - 7, axis, 7, 1, '#5fc6e8');
        P(6, axis - 2, 5, 1, '#9fe8ff');
        grip(4);
      } else if (w.bullet === 'grenade') {
        P(2, axis - 1, L - 6, 3, GUNMETAL);
        P(L - 7, axis - 1, 7, 4, GUN_DK);          // fat tube
        P(L - 6, axis, 6, 2, '#3a3d40');
        grip(4); P(5, axis + 2, 2, 3, GUN_DK);
      } else { // crossbow
        P(L - 4, axis - 4, 1, 9, '#3a2a1a');       // limbs
        P(L - 5, axis - 4, 2, 2, '#222'); P(L - 5, axis + 2, 2, 2, '#222');
        P(2, axis, L - 4, 1, '#5a4126');           // stock/rail
        P(4, axis - 1, 6, 1, WOOD_HI);
        grip(3, WOOD);
        P(L - 1, axis, 1, 1, '#ccc');              // bolt tip
      }
    } else if (fam === 'Melee') {
      if (id === 'melee_bat') {
        P(2, axis, 6, 1, WOOD); P(8, axis - 1, L - 8, 3, '#b0b0a0'); P(8, axis - 1, L - 8, 1, '#d8d8c8');
      } else if (id === 'melee_axe') {
        P(2, axis, L - 4, 1, WOOD); P(L - 5, axis - 3, 4, 7, '#c8ccd0'); P(L - 5, axis - 3, 4, 1, '#e8ecf0'); P(L - 6, axis - 1, 1, 3, '#888');
      } else {
        P(2, axis, 4, 1, '#3a2a1a'); P(6, axis - 1, L - 6, 2, '#c8ccd0'); P(6, axis - 1, L - 6, 1, '#e8ecf0');
      }
    }

    const out = { canvas: c, len: L, h: H, axis: axis + oy, muzzle: { x: L + 1, y: axis + oy } };
    GUN_CACHE[id] = out;
    return out;
  }
  S.gun = buildGun;

  // draw a gun in-world attached to hands; angle handled by caller transform.
  // flip = mirror vertically when aiming left so grip stays down.
  S.drawGunAt = function (ctx, id, gx, gy, scale, flip) {
    const g = buildGun(id);
    ctx.save();
    ctx.translate(gx, gy);
    if (flip) ctx.scale(1, -1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(g.canvas, 0, -g.axis * scale, g.canvas.width * scale, g.canvas.height * scale);
    ctx.restore();
  };

  // ---------------- PLAYER (top-down, facing +x) ----------------
  // p carries gear colors via p.gear = {chest,legs,helmet,boots,gloves,pack,skin}
  S.drawPlayer = function (ctx, p, opt) {
    opt = opt || {};
    const g = p.gear;
    const swing = Math.sin((p.walkPhase || 0)) * 1.2 * (p.moving ? 1 : 0);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    // backpack (behind, -x)
    ctx.fillStyle = g.pack; ctx.fillRect(-9, -5, 4, 10);
    ctx.fillStyle = shade(g.pack, -0.2); ctx.fillRect(-9, -5, 4, 2);
    // legs/boots peeking at sides-back
    ctx.fillStyle = g.boots;
    ctx.fillRect(-3, -7 + swing, 3, 2);
    ctx.fillRect(-3, 5 - swing, 3, 2);
    // torso (chest)
    roundDot(ctx, 0, 0, 7, g.chest);
    ctx.fillStyle = shade(g.chest, 0.18); ctx.fillRect(-2, -6, 5, 2); // shoulder hi
    ctx.fillStyle = shade(g.chest, -0.25); ctx.fillRect(-6, -1, 12, 1);
    // legs hint (front)
    ctx.fillStyle = g.legs; ctx.fillRect(3, -5, 3, 10);
    // arms reaching forward holding gun
    const gunId = p.heldGun;
    ctx.strokeStyle = g.gloves; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(1, -4); ctx.lineTo(8, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, 4); ctx.lineTo(8, 2); ctx.stroke();
    // gun
    if (gunId) {
      const wpn = T.WEAPONS[gunId];
      if (wpn.fam === 'Melee') {
        // swing arc handled by player.meleeAnim
        const a = p.meleeAnim || 0;
        ctx.save(); ctx.translate(7, 0); ctx.rotate(-0.7 + a * 1.6);
        S.drawGunAt(ctx, gunId, 0, 0, 1, false); ctx.restore();
      } else {
        S.drawGunAt(ctx, gunId, 6 - (p.recoilKick || 0), 1, 1, false);
      }
    }
    // head
    roundDot(ctx, 2, 0, 4, g.skin);
    ctx.fillStyle = shade(g.skin, -0.2); ctx.fillRect(0, -1, 4, 1);
    // helmet (cap over top/front of head)
    ctx.fillStyle = g.helmet;
    ctx.fillRect(-1, -4, 7, 3);
    ctx.fillStyle = shade(g.helmet, 0.2); ctx.fillRect(-1, -4, 7, 1);
    ctx.fillRect(4, -2, 2, 4); // brim/visor front
    ctx.restore();
  };

  // ---------------- ZOMBIES (top-down, facing +x) ----------------
  S.drawZombie = function (ctx, z) {
    const d = z.def, r = d.r;
    const phase = z.animPhase || 0;
    const sway = Math.sin(phase) * 1.3;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (d.alpha) ctx.globalAlpha = d.alpha;
    const base = z.hurtFlash > 0 ? '#d05a5a' : d.color;

    if (d.dog) { drawDog(ctx, z, base, sway); ctx.restore(); return; }

    // arms reaching forward
    ctx.strokeStyle = shade(base, -0.15); ctx.lineWidth = Math.max(2, r * 0.28); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(r * 0.2, -r * 0.5); ctx.lineTo(r + 3, -r * 0.3 + sway); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.2, r * 0.5); ctx.lineTo(r + 3, r * 0.3 - sway); ctx.stroke();
    // body
    roundDot(ctx, 0, 0, r, base);
    ctx.fillStyle = shade(base, -0.28);
    ctx.fillRect(-r, sway * 0.4, r * 2, 1);          // spine/torn line
    // torn clothing patches
    ctx.fillStyle = shade(base, -0.4);
    ctx.fillRect(-r * 0.6, -r * 0.4, 2, 2);
    ctx.fillRect(-r * 0.1, r * 0.3, 2, 2);
    // blood
    ctx.fillStyle = '#7a1414';
    ctx.fillRect(r * 0.2, -r * 0.2, 2, 1); ctx.fillRect(-r * 0.3, r * 0.4, 1, 2);
    // head
    const hx = r * 0.55;
    roundDot(ctx, hx, 0, r * 0.55, shade(base, 0.08));
    // eyes (glowing for night/special)
    ctx.fillStyle = d.night ? '#9fe8ff' : (d.armored ? '#ff5a3a' : '#d8d8a0');
    ctx.fillRect(hx + r * 0.3, -r * 0.25, 1, 1);
    ctx.fillRect(hx + r * 0.3, r * 0.15, 1, 1);

    // type extras
    if (d.armored) {
      ctx.fillStyle = '#7a8088'; ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.2, r * 0.5); // plate
      ctx.fillStyle = '#9aa0a8'; ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.2, 1);
      ctx.fillRect(-r * 0.5, -2, r, 1);
    }
    if (d.burst) { // bloater pustules
      ctx.fillStyle = '#a8d84a';
      ctx.fillRect(-r * 0.5, -r * 0.5, 2, 2); ctx.fillRect(r * 0.2, r * 0.3, 3, 3);
      ctx.fillRect(-r * 0.2, r * 0.5, 2, 2);
    }
    if (d.ranged) { // spitter maw
      ctx.fillStyle = '#3a5a1a'; ctx.fillRect(hx + r * 0.3, -1, 3, 2);
    }
    if (d.summon) { // screamer open mouth
      ctx.fillStyle = '#2a0a0a'; roundDot(ctx, hx + r * 0.2, 0, r * 0.3, '#2a0a0a');
    }
    if (d.big) { // brute/boss bulk shoulders
      ctx.fillStyle = shade(base, -0.18);
      roundDot(ctx, -r * 0.3, -r * 0.7, r * 0.5, shade(base, -0.18));
      roundDot(ctx, -r * 0.3, r * 0.7, r * 0.5, shade(base, -0.18));
    }
    if (d.boss) {
      ctx.fillStyle = '#ff3020';
      ctx.fillRect(hx + r * 0.2, -r * 0.3, 2, 2); ctx.fillRect(hx + r * 0.2, r * 0.1, 2, 2);
    }
    ctx.restore();
  };

  function drawDog(ctx, z, base, sway) {
    const r = z.def.r;
    // elongated body
    ctx.fillStyle = base;
    roundRect(ctx, -r * 1.3, -r * 0.7, r * 2.4, r * 1.4, r * 0.5);
    // legs
    ctx.fillStyle = shade(base, -0.3);
    ctx.fillRect(-r * 0.9, -r * 0.8 + sway, 2, 3);
    ctx.fillRect(r * 0.5, -r * 0.8 - sway, 2, 3);
    ctx.fillRect(-r * 0.9, r * 0.6 - sway, 2, 3);
    ctx.fillRect(r * 0.5, r * 0.6 + sway, 2, 3);
    // head
    roundDot(ctx, r * 1.1, 0, r * 0.55, shade(base, 0.05));
    ctx.fillStyle = '#ff5a3a'; ctx.fillRect(r * 1.3, -2, 1, 1); ctx.fillRect(r * 1.3, 1, 1, 1);
    ctx.fillStyle = '#222'; ctx.fillRect(r * 1.5, -1, 2, 2); // snout
  }

  // ---------------- helpers ----------------
  function roundDot(ctx, cx, cy, r, col) {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, T.TAU); ctx.fill();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
  }
  S.roundRect = roundRect;

  function shade(hex, amt) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    let r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
    else { r *= (1 + amt); g *= (1 + amt); b *= (1 + amt); }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }
  S.shade = shade;

  // ---------------- ICONS for UI cards ----------------
  // returns a canvas of given size with the item drawn, dark bg
  const ICON_CACHE = {};
  S.icon = function (id, size) {
    size = size || 40;
    const key = id + '@' + size;
    if (ICON_CACHE[key]) return ICON_CACHE[key];
    const { c, x } = cv(size, size);
    x.fillStyle = '#0d100b'; x.fillRect(0, 0, size, size);
    const kind = T.kindOf(id);
    x.save();
    x.translate(size / 2, size / 2);
    if (kind === 'weapon') {
      const g = buildGun(id);
      const sc = Math.min((size - 6) / g.canvas.width, (size - 6) / 8);
      x.imageSmoothingEnabled = false;
      x.drawImage(g.canvas, -g.canvas.width * sc / 2, -g.canvas.height * sc / 2, g.canvas.width * sc, g.canvas.height * sc);
    } else if (kind === 'armor') {
      drawArmorIcon(x, id, size);
    } else if (kind === 'trap') {
      drawTrapIcon(x, id, size);
    } else if (kind === 'item') {
      drawItemIcon(x, id, size);
    } else if (kind === 'attach') {
      x.fillStyle = '#3a3d40'; x.fillRect(-8, -3, 16, 6); x.fillStyle = '#5fc6e8'; x.fillRect(-8, -3, 16, 1);
    }
    x.restore();
    ICON_CACHE[key] = c;
    return c;
  };

  function drawArmorIcon(x, id, size) {
    const a = T.ARMOR[id], col = a.color;
    const sc = size / 40;
    x.fillStyle = col;
    if (a.slot === 'helmet') { x.beginPath(); x.arc(0, 2, 9 * sc, Math.PI, 0); x.fill(); x.fillRect(-9 * sc, 1, 18 * sc, 3); }
    else if (a.slot === 'chest') { roundRect(x, -9 * sc, -10 * sc, 18 * sc, 20 * sc, 3); x.fillStyle = shade(col, 0.2); x.fillRect(-9 * sc, -10 * sc, 18 * sc, 3); }
    else if (a.slot === 'legs') { x.fillRect(-8 * sc, -9 * sc, 7 * sc, 18 * sc); x.fillRect(1 * sc, -9 * sc, 7 * sc, 18 * sc); }
    else if (a.slot === 'boots') { x.fillRect(-9 * sc, -2 * sc, 8 * sc, 6 * sc); x.fillRect(-9 * sc, 4 * sc, 12 * sc, 4 * sc); x.fillRect(1 * sc, -2 * sc, 8 * sc, 6 * sc); x.fillRect(1 * sc, 4 * sc, 12 * sc, 4 * sc); }
    else if (a.slot === 'gloves') { roundRect(x, -8 * sc, -6 * sc, 16 * sc, 12 * sc, 3); x.fillStyle = shade(col, -0.3); for (let i = 0; i < 4; i++) x.fillRect((-7 + i * 4) * sc, -8 * sc, 2 * sc, 3 * sc); }
    else { roundRect(x, -8 * sc, -9 * sc, 16 * sc, 18 * sc, 2); x.fillStyle = shade(col, 0.2); x.fillRect(-5 * sc, -9 * sc, 10 * sc, 4 * sc); x.fillStyle = shade(col, -0.3); x.fillRect(-8 * sc, -3 * sc, 16 * sc, 2); }
  }

  function drawTrapIcon(x, id, size) {
    const t = T.TRAPS[id], col = t.color, sc = size / 40;
    if (t.effect === 'turret') {
      x.fillStyle = '#33352f'; roundRect(x, -7 * sc, -4 * sc, 14 * sc, 12 * sc, 2);
      x.fillStyle = col; x.fillRect(-2 * sc, -11 * sc, 12 * sc, 4 * sc); // barrel
      x.fillStyle = '#1a1a1a'; x.fillRect(-7 * sc, 6 * sc, 14 * sc, 3 * sc);
    } else if (t.effect === 'root') { // bear trap jaws
      x.strokeStyle = col; x.lineWidth = 2 * sc;
      x.beginPath(); x.arc(0, 0, 9 * sc, -0.5, Math.PI + 0.5); x.stroke();
      x.fillStyle = '#444'; for (let i = 0; i < 6; i++) { const a = -0.4 + i * 0.7; x.fillRect(Math.cos(a) * 7 * sc, Math.sin(a) * 7 * sc, 2, 3); }
    } else if (t.effect === 'fire') { drawFlameIcon(x, sc); }
    else if (t.effect === 'shock') { x.strokeStyle = '#5fc6e8'; x.lineWidth = 1.5 * sc; for (let i = -1; i <= 1; i++) { x.beginPath(); x.moveTo(i * 6 * sc, -10 * sc); x.lineTo(i * 6 * sc + 3, 0); x.lineTo(i * 6 * sc - 2, 10 * sc); x.stroke(); } }
    else if (t.effect === 'boom') { x.fillStyle = '#4f6a3a'; roundRect(x, -8 * sc, -3 * sc, 16 * sc, 8 * sc, 1); x.fillStyle = '#222'; x.fillRect(-8 * sc, 5 * sc, 3 * sc, 4 * sc); x.fillRect(5 * sc, 5 * sc, 3 * sc, 4 * sc); }
    else { // spikes / barbed
      x.fillStyle = col; x.fillRect(-10 * sc, 2 * sc, 20 * sc, 4 * sc);
      x.fillStyle = '#bbb'; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 3 * sc, 2 * sc); x.lineTo(i * 3 * sc - 2, -6 * sc); x.lineTo(i * 3 * sc + 2, 2 * sc); x.fill(); }
    }
  }
  function drawFlameIcon(x, sc) {
    x.fillStyle = '#e07a2a'; x.beginPath(); x.moveTo(0, -11 * sc); x.quadraticCurveTo(7 * sc, 0, 0, 9 * sc); x.quadraticCurveTo(-7 * sc, 0, 0, -11 * sc); x.fill();
    x.fillStyle = '#f2c14e'; x.beginPath(); x.moveTo(0, -5 * sc); x.quadraticCurveTo(4 * sc, 1, 0, 8 * sc); x.quadraticCurveTo(-4 * sc, 1, 0, -5 * sc); x.fill();
  }
  function drawItemIcon(x, id, size) {
    const it = T.ITEMS[id], sc = size / 40;
    if (it.kind === 'heal') { x.fillStyle = '#e8e8e8'; roundRect(x, -8 * sc, -7 * sc, 16 * sc, 14 * sc, 2); x.fillStyle = '#c33'; x.fillRect(-2 * sc, -4 * sc, 4 * sc, 8 * sc); x.fillRect(-5 * sc, -1 * sc, 10 * sc, 2 * sc); }
    else if (it.kind === 'ammo') { x.fillStyle = '#6a5a2a'; roundRect(x, -8 * sc, -6 * sc, 16 * sc, 12 * sc, 1); x.fillStyle = '#c8a030'; for (let i = 0; i < 4; i++) x.fillRect((-6 + i * 3) * sc, -9 * sc, 2 * sc, 4 * sc); }
    else if (it.kind === 'buff') { x.fillStyle = '#d8d8d8'; x.fillRect(-1 * sc, -10 * sc, 2 * sc, 16 * sc); x.fillStyle = '#5fbf52'; x.fillRect(-3 * sc, 4 * sc, 6 * sc, 5 * sc); x.fillStyle = '#ccc'; x.fillRect(0, -12 * sc, 1, 3 * sc); }
    else if (it.kind === 'throw') { if (it.fire) { x.fillStyle = '#3a6a2a'; roundRect(x, -4 * sc, -4 * sc, 8 * sc, 12 * sc, 2); x.fillStyle = '#a8a8a8'; x.fillRect(-1 * sc, -8 * sc, 2 * sc, 4 * sc); x.fillStyle = '#e07a2a'; x.fillRect(-2 * sc, -11 * sc, 4 * sc, 3 * sc); } else { x.fillStyle = '#3a4a2a'; x.beginPath(); x.arc(0, 1, 7 * sc, 0, T.TAU); x.fill(); x.fillStyle = '#222'; x.fillRect(-2 * sc, -9 * sc, 4 * sc, 4 * sc); x.fillStyle = '#555'; x.fillRect(-5 * sc, -4 * sc, 10 * sc, 1); x.fillRect(-5 * sc, 0, 10 * sc, 1); } }
    else { x.fillStyle = '#6a5a3a'; x.fillRect(-9 * sc, -2 * sc, 18 * sc, 9 * sc); x.fillStyle = shade('#6a5a3a', -0.3); for (let i = 0; i < 3; i++) x.fillRect(-9 * sc, (-2 + i * 3) * sc, 18 * sc, 1); }
  }

})(window.TAC);

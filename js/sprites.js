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
  // styled after the survivor: camo knit helmet, glowing orange goggles, gas
  // mask, blue pack, ragged camo jacket. p.gear = {chest,legs,helmet,boots,gloves,pack,skin}
  S.drawPlayer = function (ctx, p, opt) {
    opt = opt || {};
    const g = p.gear;
    const OL = '#0c0e0a';
    const swing = Math.sin((p.walkPhase || 0)) * 1.4 * (p.moving ? 1 : 0);
    const gunId = p.heldGun;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // blue backpack (behind) with straps + buckles
    const pack = g.pack || '#3a4a6a';
    ctx.fillStyle = OL; ctx.fillRect(-11, -6, 6, 12);
    ctx.fillStyle = pack; ctx.fillRect(-10, -5, 4, 10);
    ctx.fillStyle = shade(pack, 0.25); ctx.fillRect(-10, -5, 4, 2);
    ctx.fillStyle = shade(pack, -0.3); ctx.fillRect(-10, 2, 4, 1);
    ctx.fillStyle = '#caa84a'; ctx.fillRect(-6, -3, 1, 1); ctx.fillRect(-6, 2, 1, 1);

    // boots peeking back (walk anim)
    ctx.fillStyle = g.boots;
    ctx.fillRect(-4, -7 + swing, 3, 3); ctx.fillRect(-4, 4 - swing, 3, 3);

    // torso outline + camo jacket with shading + blotches
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(0, 0, 8, 0, T.TAU); ctx.fill();
    roundDot(ctx, 0, 0, 7, g.chest);
    ctx.fillStyle = shade(g.chest, -0.28); ctx.beginPath(); ctx.arc(0, 1.5, 6.6, 0.15, Math.PI - 0.15); ctx.fill();
    ctx.fillStyle = shade(g.chest, 0.18); ctx.fillRect(-3, -5, 5, 2);
    ctx.fillStyle = shade(g.chest, -0.4);
    ctx.fillRect(-4, -3, 3, 2); ctx.fillRect(2, 1, 2, 2); ctx.fillRect(-2, 3, 2, 2);

    // legs hint (front)
    ctx.fillStyle = g.legs; ctx.fillRect(3, -5, 3, 10);
    ctx.fillStyle = shade(g.legs, -0.25); ctx.fillRect(3, 1, 3, 1);

    // arms reaching forward (sleeves + gloves)
    ctx.strokeStyle = shade(g.chest, -0.1); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(1, -4); ctx.lineTo(7, -3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, 4); ctx.lineTo(7, 3); ctx.stroke();
    ctx.strokeStyle = g.gloves; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(6, -3); ctx.lineTo(9, -2.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, 3); ctx.lineTo(9, 2.4); ctx.stroke();

    // gun
    if (gunId) {
      const wpn = T.WEAPONS[gunId];
      if (wpn.fam === 'Melee') {
        const a = p.meleeAnim || 0;
        ctx.save(); ctx.translate(7, 0); ctx.rotate(-0.7 + a * 1.6);
        S.drawGunAt(ctx, gunId, 0, 0, 1, false); ctx.restore();
      } else {
        S.drawGunAt(ctx, gunId, 6 - (p.recoilKick || 0), 1, 1, false);
      }
    }

    // head: outline, skin, gas mask, knit camo helmet, glowing goggles up front
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(2, 0, 4.7, 0, T.TAU); ctx.fill();
    roundDot(ctx, 2, 0, 4, g.skin);
    ctx.fillStyle = '#9a9a90'; ctx.fillRect(3, -2, 3, 4);          // gas mask
    ctx.fillStyle = '#6f6f66'; ctx.fillRect(4, -1, 2, 2);          // filter
    ctx.fillStyle = g.helmet; ctx.beginPath(); ctx.arc(1, 0, 4.4, Math.PI * 0.42, Math.PI * 1.58); ctx.fill();
    ctx.fillStyle = shade(g.helmet, -0.3); ctx.fillRect(-2, -3, 2, 1); ctx.fillRect(-2, 2, 2, 1);
    ctx.fillStyle = shade(g.helmet, 0.2); ctx.fillRect(-1, -4, 3, 1);
    ctx.fillStyle = '#241a10'; ctx.fillRect(3.5, -3, 2, 6);        // goggle band
    ctx.fillStyle = '#ff9a2a'; ctx.fillRect(4.5, -2.6, 1.6, 2); ctx.fillRect(4.5, 0.6, 1.6, 2);
    ctx.fillStyle = '#ffe28a'; ctx.fillRect(4.7, -2.2, 1, 1); ctx.fillRect(4.7, 1, 1, 1);
    // subtle goggle glow
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,150,40,0.12)'; ctx.beginPath(); ctx.arc(6, 0, 6, 0, T.TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  };

  // ---------------- ZOMBIES (top-down, facing +x) — gritty & detailed ----------------
  S.drawZombie = function (ctx, z) {
    const d = z.def, r = d.r;
    const phase = z.animPhase || 0;
    const sway = Math.sin(phase) * 1.4;
    const OL = '#0a0c08';
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (d.alpha) ctx.globalAlpha = d.alpha;
    const base = z.hurtFlash > 0 ? '#e06a5a' : d.color;
    const dk = shade(base, -0.34), lt = shade(base, 0.16), flesh = '#9a4a4a';

    if (d.dog) { drawDog(ctx, z, base, sway, OL); ctx.restore(); return; }

    // ---- arms reaching forward (outlined, rotting), grasping hands ----
    ctx.lineCap = 'round';
    ctx.strokeStyle = OL; ctx.lineWidth = Math.max(3, r * 0.42);
    ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.5); ctx.lineTo(r + 4, -r * 0.35 + sway); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.1, r * 0.5); ctx.lineTo(r + 4, r * 0.35 - sway); ctx.stroke();
    ctx.strokeStyle = dk; ctx.lineWidth = Math.max(2, r * 0.28);
    ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.5); ctx.lineTo(r + 3.5, -r * 0.35 + sway); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.1, r * 0.5); ctx.lineTo(r + 3.5, r * 0.35 - sway); ctx.stroke();
    roundDot(ctx, r + 4, -r * 0.35 + sway, r * 0.22, shade(base, -0.05));
    roundDot(ctx, r + 4, r * 0.35 - sway, r * 0.22, shade(base, -0.05));

    // ---- body: outline, base, top hilite, lower shade ----
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, T.TAU); ctx.fill();
    roundDot(ctx, 0, 0, r, base);
    ctx.fillStyle = lt; ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.3, r * 0.66, 0, T.TAU); ctx.fill();
    ctx.fillStyle = dk; ctx.beginPath(); ctx.arc(0, r * 0.35, r * 0.85, 0.1, Math.PI - 0.1); ctx.fill();
    // tattered shirt strips
    ctx.fillStyle = shade(base, -0.5);
    ctx.fillRect(-r * 0.7, -r * 0.2, r * 0.5, 2); ctx.fillRect(-r * 0.1, r * 0.1, r * 0.6, 2);
    ctx.fillRect(-r * 0.5, r * 0.5, 2, r * 0.4);
    // exposed wound / ribs + blood
    ctx.fillStyle = flesh; ctx.fillRect(-r * 0.15, -r * 0.45, r * 0.4, r * 0.35);
    ctx.fillStyle = '#c97a7a'; ctx.fillRect(-r * 0.1, -r * 0.4, 1, r * 0.25); ctx.fillRect(r * 0.08, -r * 0.4, 1, r * 0.25);
    ctx.fillStyle = '#7a1414'; ctx.fillRect(r * 0.2, -r * 0.1, 2, 1); ctx.fillRect(-r * 0.35, r * 0.35, 1, 2);

    // ---- head: sunken glowing eyes + gaping mouth ----
    const hx = r * 0.62;
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(hx, 0, r * 0.6 + 1, 0, T.TAU); ctx.fill();
    roundDot(ctx, hx, 0, r * 0.58, shade(base, 0.06));
    ctx.fillStyle = shade(base, -0.25); ctx.beginPath(); ctx.arc(hx, r * 0.2, r * 0.5, 0.1, Math.PI - 0.1); ctx.fill();
    const eye = d.night ? '#9fe8ff' : (d.armored ? '#ff6a3a' : (d.boss ? '#ff3020' : '#f2e28a'));
    ctx.fillStyle = '#1a1208'; ctx.fillRect(hx + r * 0.18, -r * 0.3, r * 0.32, r * 0.24); ctx.fillRect(hx + r * 0.18, r * 0.06, r * 0.32, r * 0.24);
    ctx.fillStyle = eye; ctx.fillRect(hx + r * 0.26, -r * 0.24, 1.4, 1.4); ctx.fillRect(hx + r * 0.26, r * 0.1, 1.4, 1.4);
    ctx.fillStyle = '#2a0a0a'; ctx.fillRect(hx + r * 0.35, -r * 0.12, r * 0.28, r * 0.24);
    ctx.fillStyle = '#7a1414'; ctx.fillRect(hx + r * 0.4, -r * 0.04, r * 0.18, 1);

    // ---- type extras ----
    if (d.armored) {
      ctx.fillStyle = '#6a7078'; ctx.fillRect(-r * 0.75, -r * 0.7, r * 1.4, r * 0.55);
      ctx.fillStyle = '#9aa0a8'; ctx.fillRect(-r * 0.75, -r * 0.7, r * 1.4, 1.5);
      ctx.fillStyle = '#4a4f55'; ctx.fillRect(-r * 0.4, -2, r * 0.8, 1.5);
      ctx.fillStyle = '#5a6068'; ctx.beginPath(); ctx.arc(hx, 0, r * 0.62, Math.PI * 0.5, Math.PI * 1.5); ctx.fill();
    }
    if (d.burst) {
      roundDot(ctx, -r * 0.4, -r * 0.4, r * 0.28, '#a8d84a');
      roundDot(ctx, r * 0.25, r * 0.35, r * 0.32, '#b8e85a');
      roundDot(ctx, -r * 0.15, r * 0.5, r * 0.22, '#98c83a');
      ctx.fillStyle = '#cdf06a'; ctx.fillRect(-r * 0.42, -r * 0.45, 2, 2);
    }
    if (d.ranged) { ctx.fillStyle = '#3a5a1a'; ctx.fillRect(hx + r * 0.3, -r * 0.18, r * 0.4, r * 0.36); ctx.fillStyle = '#9ad83a'; ctx.fillRect(hx + r * 0.45, 0, 2, 1); }
    if (d.summon) { roundDot(ctx, hx + r * 0.32, 0, r * 0.34, '#1a0608'); ctx.fillStyle = '#7a1414'; ctx.fillRect(hx + r * 0.2, -r * 0.4, 1, r * 0.8); }
    if (d.big) {
      roundDot(ctx, -r * 0.35, -r * 0.72, r * 0.55, shade(base, -0.16));
      roundDot(ctx, -r * 0.35, r * 0.72, r * 0.55, shade(base, -0.16));
      ctx.fillStyle = lt; ctx.fillRect(-r * 0.5, -r * 0.85, r * 0.5, 2); ctx.fillRect(-r * 0.5, r * 0.7, r * 0.5, 2);
    }
    if (d.boss) {
      ctx.fillStyle = '#d8d0c0'; ctx.fillRect(-r * 0.1, -r, 2, r * 0.4); ctx.fillRect(r * 0.3, -r * 0.9, 2, r * 0.3);
      ctx.fillStyle = '#7a1414'; ctx.fillRect(-r * 0.5, -r * 0.1, r, 1.5);
    }
    ctx.restore();
  };

  function drawDog(ctx, z, base, sway, OL) {
    const r = z.def.r, dk = shade(base, -0.3);
    ctx.fillStyle = OL; roundRect(ctx, -r * 1.4, -r * 0.8, r * 2.7, r * 1.6, r * 0.5);
    ctx.fillStyle = base; roundRect(ctx, -r * 1.3, -r * 0.7, r * 2.5, r * 1.4, r * 0.45);
    ctx.fillStyle = shade(base, 0.12); roundRect(ctx, -r * 1.1, -r * 0.6, r * 2.0, r * 0.4, r * 0.3);
    ctx.fillStyle = dk; roundRect(ctx, -r * 1.2, r * 0.1, r * 2.2, r * 0.5, r * 0.3);
    // exposed spine + wound
    ctx.fillStyle = '#caa'; for (let i = 0; i < 4; i++) ctx.fillRect(-r * 0.6 + i * r * 0.4, -r * 0.55, 1, r * 0.3);
    ctx.fillStyle = '#9a4a4a'; ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.4, r * 0.3);
    // legs
    ctx.fillStyle = dk;
    ctx.fillRect(-r * 0.95, -r * 0.85 + sway, 2, 4); ctx.fillRect(r * 0.55, -r * 0.85 - sway, 2, 4);
    ctx.fillRect(-r * 0.95, r * 0.6 - sway, 2, 4); ctx.fillRect(r * 0.55, r * 0.6 + sway, 2, 4);
    // head + snout + glowing eyes + ears + teeth
    roundDot(ctx, r * 1.15, 0, r * 0.6, OL);
    roundDot(ctx, r * 1.1, 0, r * 0.55, shade(base, 0.05));
    ctx.fillStyle = '#2a1a14'; ctx.fillRect(r * 1.5, -r * 0.25, r * 0.5, r * 0.5);
    ctx.fillStyle = '#ff5a3a'; ctx.fillRect(r * 1.3, -r * 0.3, 1.4, 1.4); ctx.fillRect(r * 1.3, r * 0.16, 1.4, 1.4);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(r * 1.0, -r * 0.6, 2, 3); ctx.fillRect(r * 1.0, r * 0.4, 2, 3);
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(r * 1.7, -r * 0.1, r * 0.3, 1);
  }

  // ---------------- FRONT-FACING PORTRAITS ----------------
  // detailed standing survivor for the loadout preview (matches the reference art)
  S.drawPlayerPortrait = function (ctx, gear, gunId) {
    gear = gear || {};
    const skin = gear.skin || '#c79c74', jacket = gear.chest || '#5a6a4a',
      pants = gear.legs || '#36405a', boots = gear.boots || '#2a2018',
      helm = gear.helmet || '#5a5236', pack = gear.pack || '#3a4a6a', gloves = gear.gloves || '#2a2a2a';
    const OL = '#0c0e0a';
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    ctx.imageSmoothingEnabled = false;
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 25, 13, 3, 0, 0, T.TAU); ctx.fill();
    // backpack peeking on sides
    P(-12, -4, 4, 17, OL); P(-11, -3, 3, 15, pack); P(-11, -3, 3, 3, shade(pack, 0.25));
    P(9, -4, 4, 17, OL); P(9, -3, 3, 15, shade(pack, -0.12));
    // legs
    P(-7, 8, 14, 14, OL); P(-6, 9, 5, 12, pants); P(1, 9, 5, 12, pants);
    P(-6, 9, 5, 2, shade(pants, 0.18)); P(1, 9, 5, 2, shade(pants, 0.18));
    P(-6, 14, 2, 4, shade(pants, -0.25)); P(3, 14, 2, 4, shade(pants, -0.25)); // cargo pockets
    // boots
    P(-7, 21, 6, 4, OL); P(0, 21, 6, 4, OL);
    P(-6, 21, 5, 3, boots); P(1, 21, 5, 3, boots);
    P(-6, 23, 6, 1, shade(boots, -0.3)); P(1, 23, 6, 1, shade(boots, -0.3));
    // torso jacket
    P(-9, -8, 18, 18, OL); P(-8, -7, 16, 16, jacket);
    P(-8, 4, 16, 5, shade(jacket, -0.25));
    P(-6, -4, 4, 3, shade(jacket, -0.38)); P(2, -1, 4, 4, shade(jacket, -0.38));
    P(-3, 3, 3, 3, shade(jacket, -0.38)); P(4, -6, 3, 3, shade(jacket, -0.38));
    P(-7, -6, 5, 2, shade(jacket, 0.2)); P(0, -7, 4, 2, shade(jacket, 0.2));
    P(-8, 8, 2, 2, OL); P(-3, 8, 2, 3, OL); P(2, 8, 2, 2, OL); P(6, 8, 2, 3, OL); // torn hem
    // backpack straps + buckles
    P(-7, -7, 2, 13, shade(pack, -0.1)); P(5, -7, 2, 13, shade(pack, -0.1));
    P(-7, -7, 2, 2, shade(pack, 0.2)); P(5, -7, 2, 2, shade(pack, 0.2));
    P(-7, 0, 2, 1, '#caa84a'); P(5, 0, 2, 1, '#caa84a');
    // arms
    P(-12, -6, 4, 12, OL); P(-11, -5, 3, 11, jacket); P(-11, 3, 3, 3, gloves);
    P(8, -6, 4, 8, OL); P(8, -5, 3, 7, jacket);
    P(0, 2, 9, 4, OL); P(1, 3, 8, 2, gloves);
    // weapon across the body (red accent like the reference)
    if (gunId && S.gun(gunId)) {
      const gg = S.gun(gunId);
      ctx.save(); ctx.translate(-3, 4); const sc = 0.95;
      ctx.drawImage(gg.canvas, 0, -gg.axis * sc, gg.canvas.width * sc, gg.canvas.height * sc);
      ctx.restore();
    }
    P(7, 3, 2, 4, '#b51d1d'); // red grip/wrap detail
    // neck
    P(-3, -13, 6, 4, shade(skin, -0.1));
    // head
    P(-7, -26, 14, 16, OL); P(-6, -25, 12, 14, skin);
    P(-6, -14, 12, 2, shade(skin, -0.25));
    // gas mask
    P(-6, -17, 12, 6, '#8f9088'); P(-6, -17, 12, 1, '#a8a8a0');
    P(-3, -15, 6, 4, '#6a6b64'); P(-2, -14, 4, 2, '#4a4b44'); P(-6, -12, 12, 1, shade('#8f9088', -0.3));
    P(-7, -19, 1, 4, '#3a3a32'); P(6, -19, 1, 4, '#3a3a32'); // mask straps
    // goggles with glow
    P(-7, -23, 14, 5, '#241a10');
    P(-6, -22, 5, 3, '#160f06'); P(1, -22, 5, 3, '#160f06');
    P(-5, -22, 3, 2, '#ff9a2a'); P(2, -22, 3, 2, '#ff9a2a');
    P(-5, -22, 2, 1, '#ffe28a'); P(2, -22, 2, 1, '#ffe28a');
    // knit camo helmet
    P(-7, -29, 14, 6, OL); P(-6, -28, 12, 5, helm); P(-6, -28, 12, 2, shade(helm, 0.2));
    P(-4, -27, 3, 2, shade(helm, -0.32)); P(1, -26, 3, 2, shade(helm, -0.32)); P(-1, -28, 2, 2, shade(helm, -0.32));
    P(-7, -24, 2, 4, shade(helm, -0.15)); P(5, -24, 2, 4, shade(helm, -0.15)); // ear flaps
    // additive goggle glow
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,150,40,0.18)'; ctx.fillRect(-8, -24, 16, 6);
    ctx.restore();
  };

  // CRAZY DAVE — eccentric merchant with a saucepan on his head
  S.drawDavePortrait = function (ctx, look, eyeDir, blink) {
    eyeDir = eyeDir || 0;
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    ctx.imageSmoothingEnabled = false;
    const OL = '#0c0e0a';
    // coat / shoulders
    P(-15, 11, 30, 12, OL); P(-14, 12, 28, 11, '#5a4a32'); P(-14, 12, 28, 2, '#6a5a3a');
    // bandolier with shells
    P(-13, 13, 26, 3, '#3a2a1a');
    for (let i = -6; i < 7; i++) P(i * 2, 13, 1, 3, i % 2 ? '#c8a84a' : '#a07a30');
    // neck
    P(-4, 7, 8, 6, shade('#c79c74', -0.08));
    // head
    P(-12, -9, 24, 18, OL); P(-11, -8, 22, 16, '#c79c74');
    P(-11, 3, 22, 4, '#b08a64');                 // cheek shade
    // stubble
    ctx.fillStyle = '#5a4632';
    for (let i = 0; i < 46; i++) { const sx = -10 + ((i * 7) % 20), sy = 1 + ((i * 5) % 6); ctx.fillRect(sx, sy, 1, 1); }
    // big crazy grin + teeth
    P(-7, 4, 14, 4, '#241410'); P(-6, 4, 12, 1, '#e8e0d0');
    P(-4, 5, 1, 2, '#241410'); P(0, 5, 1, 2, '#241410'); P(4, 5, 1, 2, '#241410');
    // nose
    P(-1, -2, 3, 5, '#b08a64'); P(-1, 2, 3, 1, '#9a7050');
    // wide darting eyes
    P(-8, -5, 6, 5, '#fff'); P(2, -5, 6, 5, '#fff');
    const pu = blink ? null : '#1a1a1a';
    if (pu) { P(-6 + eyeDir, -4, 2, 3, pu); P(4 + eyeDir, -4, 2, 3, pu); }
    else { P(-8, -3, 6, 1, '#caa078'); P(2, -3, 6, 1, '#caa078'); }
    P(-8, -6, 6, 1, '#3a2a1a'); P(2, -6, 6, 1, '#3a2a1a'); // raised brows
    P(-8, 0, 6, 1, '#9a7050'); P(2, 0, 6, 1, '#9a7050');   // eyebags
    // ears
    P(-13, -2, 2, 4, '#c79c74'); P(11, -2, 2, 4, '#c79c74');
    // hair tufts under pan
    P(-11, -8, 3, 2, '#5a4632'); P(8, -8, 3, 2, '#5a4632');
    // ---- SAUCEPAN HAT ----
    P(-13, -14, 26, 7, OL); P(-12, -13, 24, 6, '#8a8a92'); P(-12, -13, 24, 2, '#b0b0b8');
    P(-12, -9, 24, 1, '#5a5a62');
    P(12, -12, 8, 2, '#2a2a2a'); P(18, -13, 2, 4, '#2a2a2a'); // handle
    P(-3, -16, 2, 2, '#caa84a'); // little knob
  };

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

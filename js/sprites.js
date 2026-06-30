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
    if (fam === 'Melee') L = { melee_knife:10, melee_spear:24, melee_sledge:17, melee_katana:19, melee_chainsaw:20, melee_king_staff:23, melee_mjolnir:18, melee_blaze:20, heaven_excalibur:21 }[id] || 14;
    if (fam === 'Mythical') L = { myth_tengeshima:24, myth_aztec_staff:20, myth_king_orb:18 }[id] || 20;
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
      if (id === 'spec_evap') {                    // particle laser emitter
        P(1, axis - 1, L - 4, 3, '#2a3540'); P(1, axis - 1, L - 4, 1, '#5fc6e8');
        P(L - 5, axis - 1, 5, 2, '#9fe8ff'); P(L - 1, axis - 2, 1, 4, '#fff');
        P(3, axis + 2, 3, 4, '#5fc6e8'); grip(4);
      } else if (id === 'heaven_gjallar') {        // golden horn launcher
        P(1, axis - 2, L - 5, 5, '#caa030'); P(1, axis - 2, L - 5, 1, '#ffe9a8');
        P(L - 5, axis - 3, 5, 7, '#f2c14e'); P(L - 5, axis - 3, 5, 1, '#fff7d8');
        P(2, axis + 2, 2, 4, '#fff'); grip(5);
      } else if (w.bullet === 'flame') {
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
      } else if (w.bullet === 'rocket') {
        P(1, axis - 2, L - 4, 5, '#3a4a2a');       // launch tube
        P(1, axis - 2, L - 4, 1, '#5a6a3a');
        P(1, axis + 2, L - 4, 1, '#1a2410');
        P(L - 5, axis - 1, 4, 2, '#b51d1d');       // warhead
        P(L - 2, axis - 1, 2, 2, '#e8632a');
        P(0, axis - 2, 2, 5, '#222');              // back/exhaust
        P(4, axis - 4, 2, 2, '#2a2a2a');           // sight
        grip(5);
      } else { // crossbow
        P(L - 4, axis - 4, 1, 9, '#3a2a1a');       // limbs
        P(L - 5, axis - 4, 2, 2, '#222'); P(L - 5, axis + 2, 2, 2, '#222');
        P(2, axis, L - 4, 1, '#5a4126');           // stock/rail
        P(4, axis - 1, 6, 1, WOOD_HI);
        grip(3, WOOD);
        P(L - 1, axis, 1, 1, '#ccc');              // bolt tip
      }
    } else if (fam === 'Mythical') {
      if (id === 'myth_tengeshima') {              // electrified tanegashima matchlock
        P(0, axis - 1, 6, 3, '#6a4a2a'); P(0, axis, 2, 3, '#5a3a1f');   // wooden stock + butt
        P(0, axis - 1, 6, 1, '#86603a');
        P(5, axis - 1, 4, 3, '#caa030'); P(5, axis - 2, 1, 2, '#8a6a20'); // brass lock + serpentine
        P(8, axis - 1, L - 8, 2, '#2b2d31'); P(8, axis - 1, L - 8, 1, '#4a4d52'); // long barrel
        P(L - 4, axis - 1, 4, 2, '#9fe8ff'); P(L - 1, axis - 2, 1, 4, '#fff'); // muzzle lightning
        for (let i = 9; i < L - 2; i += 3) P(i, axis - 2, 1, 1, '#9fe8ff');     // arcing sparks
      } else if (id === 'myth_aztec_staff') {      // sun-king fire staff
        P(1, axis, L - 6, 1, '#7a5a2a'); P(1, axis - 1, 5, 1, '#a07a3a');
        P(L - 6, axis - 3, 5, 7, '#caa84a'); P(L - 6, axis - 3, 5, 1, '#ffe08a');
        P(L - 5, axis - 1, 3, 3, '#c83a1a'); P(L - 4, axis, 1, 1, '#f2c14e'); grip(3, WOOD);
      } else {                                     // king orb scepter
        P(2, axis, L - 7, 1, '#caa84a'); P(2, axis - 1, 5, 1, '#ffe08a');
        P(L - 7, axis - 3, 6, 6, '#f2c14e'); P(L - 6, axis - 3, 4, 2, '#ffe9a8');
        P(L - 4, axis - 6, 1, 4, '#ffe08a'); P(L - 5, axis - 5, 3, 1, '#ffe08a'); grip(3);
      }
    } else if (fam === 'Melee') {
      if (id === 'melee_knife') {
        P(2, axis, 3, 1, '#2a2018'); P(5, axis - 1, L - 5, 2, '#c8ccd0'); P(5, axis - 1, L - 5, 1, '#eef'); P(L - 1, axis - 1, 1, 1, '#fff');
      } else if (id === 'melee_bat') {
        P(2, axis, 6, 1, WOOD); P(8, axis - 1, L - 8, 3, '#b0b0a0'); P(8, axis - 1, L - 8, 1, '#d8d8c8');
      } else if (id === 'melee_axe') {
        P(2, axis, L - 4, 1, WOOD); P(L - 5, axis - 3, 4, 7, '#c8ccd0'); P(L - 5, axis - 3, 4, 1, '#e8ecf0'); P(L - 6, axis - 1, 1, 3, '#888');
      } else if (id === 'melee_spear') {
        P(2, axis, L - 5, 1, '#5a4126'); P(2, axis, 6, 1, '#7a5a33'); P(L - 5, axis - 1, 3, 2, '#c8ccd0'); P(L - 2, axis - 1, 2, 1, '#eef'); P(L - 1, axis, 1, 1, '#fff');
      } else if (id === 'melee_sledge') {
        P(2, axis, L - 5, 1, '#3a2a1a'); P(L - 6, axis - 3, 5, 7, '#6a6f78'); P(L - 6, axis - 3, 5, 1, '#9aa0a8'); P(L - 6, axis + 3, 5, 1, '#3a3f48');
      } else if (id === 'melee_katana') {
        P(2, axis, 4, 1, '#1a1a1a'); P(2, axis, 1, 1, '#7a1f1f'); P(4, axis, 1, 1, '#7a1f1f');
        P(6, axis - 1, 1, 3, '#caa84a'); P(7, axis - 1, L - 7, 2, '#dfe6ee'); P(7, axis - 1, L - 7, 1, '#fff'); P(L - 1, axis - 2, 1, 2, '#fff');
      } else if (id === 'melee_chainsaw') {
        P(2, axis - 2, 6, 5, '#c84a1a'); P(2, axis - 2, 6, 1, '#e87a3a'); P(3, axis + 2, 2, 2, '#1a1a1a');
        P(8, axis - 1, L - 8, 2, '#9aa0a8'); for (let i = 8; i < L; i += 2) P(i, axis - 2, 1, 1, '#555'); P(L - 1, axis - 1, 1, 2, '#777');
      } else if (id === 'melee_blaze') {       // blazing katana
        P(2, axis, 4, 1, '#1a1a1a'); P(2, axis, 1, 1, '#7a1f1f');     // wrapped handle
        P(6, axis - 1, 1, 3, '#caa84a');                              // tsuba
        P(7, axis - 1, L - 7, 2, '#ffd24a'); P(7, axis - 1, L - 7, 1, '#ffe9a8'); // glowing blade
        for (let i = 8; i < L; i += 2) { P(i, axis - 2, 1, 1, '#ff8a2a'); P(i + 1, axis + 1, 1, 1, '#c83a1a'); } // flames
        P(L - 1, axis - 2, 1, 2, '#fff');
      } else if (id === 'melee_mjolnir') {     // thunder hammer
        P(2, axis, L - 6, 1, '#5a4a32'); P(2, axis - 1, 5, 1, '#7a5a33');
        P(L - 7, axis - 4, 6, 9, '#9aa0a8'); P(L - 7, axis - 4, 6, 1, '#cfd6e0'); P(L - 7, axis + 4, 6, 1, '#5a5f66');
        P(L - 6, axis - 2, 4, 1, '#5fc6e8'); P(L - 5, axis, 2, 2, '#9fe8ff');
      } else if (id === 'melee_king_staff') {  // royal golden scepter
        P(2, axis, L - 6, 1, '#caa84a'); P(2, axis - 1, L - 8, 1, '#ffe08a'); P(2, axis + 1, L - 8, 1, '#a8862a');
        P(L - 6, axis - 4, 1, 9, '#ffe08a'); P(L - 8, axis - 1, 5, 1, '#ffe08a');
        P(L - 6, axis - 5, 1, 1, '#fff'); P(L - 6, axis + 4, 1, 1, '#c83a1a');
      } else if (id === 'heaven_excalibur') {  // radiant holy sword
        P(2, axis, 4, 1, '#caa030'); P(3, axis - 1, 1, 3, '#ffe9a8');        // gold hilt + guard
        P(6, axis - 1, L - 6, 2, '#fff7d8'); P(6, axis - 1, L - 6, 1, '#ffffff'); // radiant blade
        for (let i = 7; i < L; i += 3) P(i, axis, 1, 1, '#ffe9a8');
        P(L - 1, axis - 2, 1, 4, '#fff');
      } else { // machete
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

    // head: outline, skin, then hair (or helmet) — the boy
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(2, 0, 4.7, 0, T.TAU); ctx.fill();
    roundDot(ctx, 2, 0, 4, g.skin);
    if (g.helmetEquipped) {
      ctx.fillStyle = g.helmet; ctx.beginPath(); ctx.arc(1, 0, 4.4, Math.PI * 0.42, Math.PI * 1.58); ctx.fill();
      ctx.fillStyle = shade(g.helmet, -0.3); ctx.fillRect(-2, -3, 2, 1); ctx.fillRect(-2, 2, 2, 1);
      ctx.fillStyle = shade(g.helmet, 0.2); ctx.fillRect(-1, -4, 3, 1);
    } else {
      const hair = g.hair || '#7a4a28';
      ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0.8, 0, 4.5, Math.PI * 0.34, Math.PI * 1.66); ctx.fill();
      ctx.fillStyle = shade(hair, 0.22); ctx.fillRect(-2, -4, 4, 1);
      ctx.fillStyle = shade(hair, -0.28); ctx.fillRect(-3, 2, 3, 2);
    }
    ctx.fillStyle = '#2a2420'; ctx.fillRect(5, -1.6, 1, 1); ctx.fillRect(5, 0.8, 1, 1); // eyes
    // themed flourishes (samurai crest / aztec feathers / king crown / heavenly halo)
    if (g.theme === 'samurai') { ctx.fillStyle = '#f2c14e'; ctx.fillRect(2, -6, 1, 3); ctx.fillRect(4, -6, 1, 3); }
    else if (g.theme === 'aztec') { ctx.fillStyle = '#1f8a5a'; for (let i = -2; i <= 2; i++) ctx.fillRect(-3, i, 2, 1); ctx.fillStyle = '#f2c14e'; ctx.fillRect(-4, 0, 1, 1); }
    else if (g.theme === 'king') { ctx.fillStyle = '#f2c14e'; ctx.fillRect(-1, -6, 6, 1); ctx.fillRect(0, -7, 1, 1); ctx.fillRect(2, -7, 1, 1); ctx.fillRect(4, -7, 1, 1); }
    else if (g.theme === 'heaven') { ctx.fillStyle = '#fff7d8'; ctx.fillRect(-1, -8, 6, 1); }
    if (g.theme === 'king' || g.theme === 'heaven') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,210,90,0.18)'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, T.TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
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
    if (d.shadow) {
      ctx.fillStyle = '#2a2a3a'; ctx.fillRect(hx - r * 0.2, -r * 0.95, 2, r * 0.45); ctx.fillRect(hx + r * 0.35, -r * 0.9, 2, r * 0.4); // wispy horns
      ctx.fillStyle = '#fff'; ctx.fillRect(hx + r * 0.25, -r * 0.22, 2, 2); ctx.fillRect(hx + r * 0.25, r * 0.08, 2, 2);          // glowing eyes
      ctx.fillStyle = 'rgba(160,180,255,0.35)'; ctx.fillRect(hx + r * 0.15, -r * 0.3, r * 0.4, r * 0.6);
    }
    if (d.overlord || d.light || d.dark || d.purple) {
      const plate = d.light ? '#d8d2c2' : (d.dark ? '#241634' : (d.purple ? '#6a4a7a' : '#4a2f5e'));
      const crys = d.light ? '#fff' : '#b06ad8';
      ctx.fillStyle = plate; ctx.fillRect(-r * 0.7, -r * 0.72, r * 1.4, r * 0.6);
      ctx.fillStyle = crys; ctx.fillRect(-r * 0.42, -r * 0.46, r * 0.8, 2);
      roundDot(ctx, -r * 0.45, -r * 0.82, r * 0.46, shade(plate, -0.2));
      roundDot(ctx, -r * 0.45, r * 0.82, r * 0.46, shade(plate, -0.2));
      ctx.fillStyle = shade(plate, -0.35); ctx.fillRect(hx - r * 0.1, -r * 0.98, 2, r * 0.42); ctx.fillRect(hx + r * 0.32, -r * 0.92, 2, r * 0.36); // horned crown
      if (d.overlord || d.slash || d.shockwave) { // great sword
        ctx.fillStyle = d.light ? '#fff7d8' : '#cfd6e0'; ctx.fillRect(r * 0.55, -r * 1.45, 2, r * 1.8);
        ctx.fillStyle = crys; ctx.fillRect(r * 0.5, -r * 1.45, 3, 2);
      }
    }
    if (d.golden) { // blocky golden plating + glowing square face (+ great sword for the giant)
      ctx.fillStyle = '#f2c44a'; ctx.fillRect(-r * 0.72, -r * 0.72, r * 1.44, r * 1.44);
      ctx.fillStyle = '#ffe9a8'; ctx.fillRect(-r * 0.62, -r * 0.62, r * 1.24, 2);
      ctx.fillStyle = '#caa030'; ctx.fillRect(-r * 0.72, r * 0.25, r * 1.44, r * 0.45);
      ctx.fillStyle = '#9a7a20'; ctx.fillRect(-r * 0.1, -r * 0.72, 2, r * 1.44);
      ctx.fillStyle = '#ff5a2a'; ctx.fillRect(hx - r * 0.1, -r * 0.28, r * 0.55, r * 0.55);
      ctx.fillStyle = '#ffb060'; ctx.fillRect(hx + r * 0.05, -r * 0.12, r * 0.28, r * 0.28);
      if (d.slash) { ctx.fillStyle = '#ffe08a'; ctx.fillRect(r * 0.55, -r * 1.5, 2, r * 1.9); ctx.fillStyle = '#caa030'; ctx.fillRect(r * 0.5, -r * 1.5, 3, 3); ctx.fillStyle = '#fff7d8'; ctx.fillRect(r * 0.55, -r * 1.5, 1, r * 1.9); }
    }
    if (d.shielded) { // big riot shield held in front (facing +x = toward player)
      ctx.fillStyle = '#23272c'; ctx.fillRect(r * 0.75, -r * 1.15, 3.5, r * 2.3);
      ctx.fillStyle = 'rgba(150,170,190,0.5)'; ctx.fillRect(r * 0.78, -r * 1.05, 2.4, r * 2.1);
      ctx.fillStyle = '#cfd6e0'; ctx.fillRect(r * 0.75, -r * 1.15, 2, 1);
      ctx.fillStyle = '#101316'; ctx.fillRect(r * 0.75, -2, 3.5, 4);       // viewport slit
      ctx.fillStyle = '#f2c14e'; ctx.fillRect(r * 0.82, -r * 0.4, 1, r * 0.8); // hazard stripe
    }
    if (z.parrying > 0) { // parry shimmer
      ctx.strokeStyle = 'rgba(255,230,150,0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r + 3, 0, T.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,230,150,0.15)'; ctx.beginPath(); ctx.arc(0, 0, r + 3, 0, T.TAU); ctx.fill();
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

  // ---------------- PETS / COMPANIONS (top-down, facing +x) ----------------
  S.drawPet = function (ctx, pet) {
    const d = pet.def, OL = '#0c0e0a';
    ctx.save(); ctx.imageSmoothingEnabled = false;
    if (d.kind === 'ranged') { drawDrone(ctx, pet, OL); ctx.restore(); return; }
    const sway = Math.sin(pet.animPhase || 0) * 1.5;
    const base = d.color, dk = shade(base, -0.3), lt = shade(base, 0.14);
    const r = d.big ? 12 : (d.leap ? 9 : 8);
    // body
    ctx.fillStyle = OL; roundRect(ctx, -r * 1.5, -r * 0.85, r * 3.0, r * 1.7, r * 0.55);
    ctx.fillStyle = base; roundRect(ctx, -r * 1.4, -r * 0.75, r * 2.8, r * 1.5, r * 0.5);
    ctx.fillStyle = lt; roundRect(ctx, -r * 1.2, -r * 0.65, r * 2.2, r * 0.45, r * 0.3);
    ctx.fillStyle = dk; roundRect(ctx, -r * 1.3, r * 0.1, r * 2.5, r * 0.55, r * 0.3);
    // curled tail at the back (shiba-like)
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(-r * 1.5, -r * 0.55, r * 0.58, 0, T.TAU); ctx.fill();
    ctx.fillStyle = lt; ctx.beginPath(); ctx.arc(-r * 1.5, -r * 0.55, r * 0.5, 0, T.TAU); ctx.fill();
    ctx.fillStyle = base; ctx.beginPath(); ctx.arc(-r * 1.42, -r * 0.48, r * 0.32, 0, T.TAU); ctx.fill();
    if (d.leap) { ctx.fillStyle = '#2a1a10'; for (let i = -1; i < 3; i++) ctx.fillRect(-r * 0.6 + i * r * 0.55, -r * 0.7, 1.5, r * 1.4); }
    if (d.big) { ctx.fillStyle = '#3a3f48'; ctx.fillRect(r * 0.2, -r * 0.8, r * 0.5, r * 1.6); ctx.fillStyle = '#caa84a'; ctx.fillRect(r * 0.35, -r * 0.2, 2, 2); }
    else { ctx.fillStyle = '#b51d1d'; ctx.fillRect(r * 0.5, -r * 0.7, 2, r * 1.4); } // collar
    // legs
    ctx.fillStyle = dk;
    ctx.fillRect(-r * 1.0, -r * 0.9 + sway, 2.4, 4); ctx.fillRect(r * 0.6, -r * 0.9 - sway, 2.4, 4);
    ctx.fillRect(-r * 1.0, r * 0.6 - sway, 2.4, 4); ctx.fillRect(r * 0.6, r * 0.6 + sway, 2.4, 4);
    // head
    const hx = r * 1.3;
    roundDot(ctx, hx, 0, r * 0.66, OL); roundDot(ctx, hx, 0, r * 0.6, shade(base, 0.05));
    if (d.big) { roundDot(ctx, hx - r * 0.2, -r * 0.6, 2.4, base); roundDot(ctx, hx - r * 0.2, r * 0.6, 2.4, base); }
    else { ctx.fillStyle = dk; ctx.fillRect(hx - r * 0.3, -r * 0.75, 2.5, 3); ctx.fillRect(hx - r * 0.3, r * 0.5, 2.5, 3); }
    ctx.fillStyle = '#2a1a14'; ctx.fillRect(hx + r * 0.45, -r * 0.25, r * 0.45, r * 0.5);  // snout
    ctx.fillStyle = '#141414'; ctx.fillRect(hx + r * 0.82, -1, 2, 2);                       // nose
    ctx.fillStyle = '#caa84a'; ctx.fillRect(hx + r * 0.12, -r * 0.3, 1.8, 1.8); ctx.fillRect(hx + r * 0.12, r * 0.14, 1.8, 1.8); // amber eyes
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(hx + r * 0.7, 0, r * 0.3, 1);  // teeth
    ctx.restore();
  };
  function drawDrone(ctx, pet, OL) {
    ctx.fillStyle = 'rgba(150,200,255,0.12)'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, T.TAU); ctx.fill(); // hover glow
    ctx.strokeStyle = 'rgba(180,200,220,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(8, 6); ctx.moveTo(-8, 6); ctx.lineTo(8, -6); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.fillRect(-9, -7, 3, 2); ctx.fillRect(6, -7, 3, 2); ctx.fillRect(-9, 5, 3, 2); ctx.fillRect(6, 5, 3, 2);
    ctx.fillStyle = OL; roundRect(ctx, -6, -4, 12, 8, 2);
    ctx.fillStyle = pet.def.color; roundRect(ctx, -5, -3, 10, 6, 2);
    ctx.fillStyle = shade(pet.def.color, 0.2); ctx.fillRect(-5, -3, 10, 1);
    ctx.fillStyle = '#ff3020'; ctx.fillRect(3, -1, 2, 2);            // sensor eye
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(5, -1, 6, 2);           // gun barrel
  }
  function drawPetIcon(x, id, size) {
    const p = T.PETS[id], sc = size / 40, col = p.color;
    if (p.kind === 'ranged') {
      x.strokeStyle = 'rgba(180,200,220,0.6)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(-12 * sc, -9 * sc); x.lineTo(12 * sc, 9 * sc); x.moveTo(-12 * sc, 9 * sc); x.lineTo(12 * sc, -9 * sc); x.stroke();
      x.fillStyle = col; roundRect(x, -8 * sc, -5 * sc, 16 * sc, 10 * sc, 2);
      x.fillStyle = '#ff3020'; x.fillRect(3 * sc, -1 * sc, 3 * sc, 3 * sc);
      x.fillStyle = '#1a1a1a'; x.fillRect(7 * sc, -1 * sc, 5 * sc, 2 * sc);
    } else {
      x.fillStyle = col; roundDot(x, 0, 2 * sc, 10 * sc, col);
      x.fillStyle = shade(col, -0.3); x.fillRect(-9 * sc, -8 * sc, 4 * sc, 5 * sc); x.fillRect(5 * sc, -8 * sc, 4 * sc, 5 * sc);
      if (p.leap) { x.fillStyle = '#2a1a10'; x.fillRect(-4 * sc, -6 * sc, 1.5, 12 * sc); x.fillRect(2 * sc, -6 * sc, 1.5, 12 * sc); }
      x.fillStyle = '#caa84a'; x.fillRect(-5 * sc, 0, 2.5, 2.5); x.fillRect(3 * sc, 0, 2.5, 2.5);
      x.fillStyle = '#2a1a14'; x.fillRect(-2 * sc, 6 * sc, 4 * sc, 4 * sc);
    }
  }

  // ---------------- HUMAN COMPANIONS (top-down standing) ----------------
  S.drawCompanion = function (ctx, c) {
    const d = c.def, OL = '#0c0e0a', col = d.color;
    const bob = Math.sin(c.walk || 0) * (c.moving ? 1 : 0);
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(c.x, c.y + bob);
    ctx.fillStyle = shade(col, -0.4); ctx.fillRect(-3, 3, 2, 4); ctx.fillRect(1, 3, 2, 4); // legs
    ctx.fillStyle = OL; ctx.fillRect(-5, -4, 10, 9);
    ctx.fillStyle = col; ctx.fillRect(-4, -3, 8, 7);
    ctx.fillStyle = shade(col, 0.18); ctx.fillRect(-4, -3, 8, 2);
    ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(0, -6, 3.4, 0, T.TAU); ctx.fill();
    ctx.fillStyle = '#c79c74'; ctx.beginPath(); ctx.arc(0, -6, 2.8, 0, T.TAU); ctx.fill();
    if (d.kind === 'medic') {
      ctx.fillStyle = '#6a3a26'; ctx.fillRect(-4, -8, 8, 3);            // brown hair
      ctx.fillStyle = '#fff'; ctx.fillRect(-2, -10, 4, 2);             // cap
      ctx.fillStyle = '#2faa4a'; ctx.fillRect(-0.5, -10, 1, 2); ctx.fillRect(-1.5, -9.5, 3, 1); // green cross (cap)
      ctx.fillStyle = '#2faa4a'; ctx.fillRect(-1, -1, 2, 1); ctx.fillRect(-0.5, -2, 1, 3);        // green cross (chest)
    } else if (d.kind === 'engineer') {
      ctx.fillStyle = '#cfd6e0'; ctx.fillRect(-4, 0, 8, 1);           // hi-vis reflective stripe
      ctx.fillStyle = '#f2c14e'; ctx.fillRect(-3, -10, 6, 2); ctx.fillRect(-4, -8, 8, 1); // hard hat + brim
      ctx.fillStyle = '#fff'; ctx.fillRect(-1, -9, 1, 1);            // headlamp
      ctx.save(); ctx.rotate(c.angle); ctx.fillStyle = '#888'; ctx.fillRect(3, -0.5, 5, 1); ctx.fillStyle = '#aaa'; ctx.fillRect(7, -1, 2, 2); ctx.restore(); // wrench
    } else {
      ctx.fillStyle = '#3a4a2a'; ctx.fillRect(-3, -10, 6, 2); ctx.fillRect(-3, -8, 6, 1); // helmet + strap
      ctx.fillStyle = '#caa030'; ctx.fillRect(-4, 0, 8, 1);          // bandolier
      ctx.save(); ctx.rotate(c.angle);
      ctx.fillStyle = '#6a4a2a'; ctx.fillRect(0, -1, 6, 2);     // tanegashima wood stock
      ctx.fillStyle = '#caa030'; ctx.fillRect(3, -1, 2, 2);     // brass lock
      ctx.fillStyle = '#2b2d31'; ctx.fillRect(5, -0.5, 11, 1);  // long matchlock barrel
      ctx.restore();
    }
    ctx.restore();
  };
  function drawCompanionIcon(x, id, size) {
    const c = T.COMPANIONS[id], sc = size / 40, col = c.color;
    x.fillStyle = col; roundRect(x, -10 * sc, 4 * sc, 20 * sc, 12 * sc, 3);
    x.fillStyle = shade(col, 0.18); x.fillRect(-10 * sc, 4 * sc, 20 * sc, 2);
    x.fillStyle = '#c79c74'; x.beginPath(); x.arc(0, -4 * sc, 8 * sc, 0, T.TAU); x.fill();
    if (c.kind === 'medic') { x.fillStyle = '#d8b24a'; x.fillRect(-8 * sc, -10 * sc, 16 * sc, 4 * sc); x.fillStyle = '#fff'; x.fillRect(-6 * sc, -12 * sc, 12 * sc, 3 * sc); x.fillStyle = '#c33'; x.fillRect(-1 * sc, -12 * sc, 2 * sc, 3 * sc); x.fillRect(-3 * sc, -11 * sc, 6 * sc, 1 * sc); x.fillStyle = '#c33'; x.fillRect(-1 * sc, 7 * sc, 2 * sc, 5 * sc); x.fillRect(-3 * sc, 9 * sc, 6 * sc, 2 * sc); }
    else if (c.kind === 'engineer') { x.fillStyle = '#f2c14e'; x.fillRect(-9 * sc, -11 * sc, 18 * sc, 4 * sc); x.fillRect(-7 * sc, -13 * sc, 14 * sc, 2 * sc); }
    else { x.fillStyle = '#3a4a2a'; x.fillRect(-9 * sc, -12 * sc, 18 * sc, 5 * sc); }
    x.fillStyle = '#1a1a1a'; x.fillRect(-4 * sc, -4 * sc, 2 * sc, 2 * sc); x.fillRect(2 * sc, -4 * sc, 2 * sc, 2 * sc);
  }

  // detailed front-facing NURSE portrait (matches the reference art) — drawn around origin
  S.drawMedicPortrait = function (ctx) {
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const HAIR = '#6a3a26', HAIRD = '#4a2818', HAIRH = '#86502f',
      SKIN = '#f3cea3', SKND = '#dba87c', BLUSH = '#ec9a9a',
      UNI = '#eef3f8', UNID = '#cdd9e6', CAP = '#ffffff', CAPD = '#dde6ef', GREEN = '#2faa4a',
      IRIS = '#3f7fc8', LIP = '#d8696e', OL = '#2a1c14';
    ctx.imageSmoothingEnabled = false;
    // uniform / shoulders
    P(-16, 10, 32, 15, UNI); P(-16, 10, 32, 2, '#fff'); P(-16, 19, 32, 6, UNID);
    P(-5, 9, 10, 5, UNID); P(-3, 9, 6, 4, UNI); P(-1, 9, 2, 7, UNID); // collar V
    P(-1, 13, 2, 2, '#9fb0c2'); P(-1, 17, 2, 2, '#9fb0c2');           // buttons
    P(-4, 4, 8, 7, SKIN); P(-4, 9, 8, 2, SKND);                       // neck
    // hair back mass + side curls
    P(-13, -16, 26, 28, HAIRD); P(-13, -14, 26, 9, HAIR);
    P(-14, -2, 4, 13, HAIR); P(10, -2, 4, 13, HAIR);
    P(-15, 3, 3, 6, HAIRD); P(12, 3, 3, 6, HAIRD);
    // face
    P(-9, -12, 18, 20, SKIN); P(-9, 6, 18, 2, SKND); P(-9, -12, 18, 2, SKND);
    // hair front (bangs/waves)
    P(-10, -15, 20, 6, HAIR); P(-10, -15, 20, 2, HAIRH);
    P(-10, -9, 3, 8, HAIR); P(7, -9, 3, 8, HAIR);
    P(-9, -10, 4, 3, HAIRD); P(5, -10, 4, 3, HAIRD); P(-3, -13, 6, 3, HAIR);
    // brows + eyes
    P(-7, -5, 5, 1, HAIRD); P(2, -5, 5, 1, HAIRD);
    P(-7, -3, 5, 4, '#fff'); P(2, -3, 5, 4, '#fff');
    P(-5, -3, 3, 4, IRIS); P(3, -3, 3, 4, IRIS);
    P(-4, -2, 2, 3, '#16202c'); P(4, -2, 2, 3, '#16202c');
    P(-4, -3, 1, 1, '#fff'); P(4, -3, 1, 1, '#fff');
    P(-7, -3, 1, 1, OL); P(6, -3, 1, 1, OL);
    // nose + blush + smile
    P(-1, 1, 2, 2, SKND);
    P(-8, 2, 3, 2, BLUSH); P(5, 2, 3, 2, BLUSH);
    P(-3, 5, 6, 1, LIP); P(-2, 6, 4, 1, '#b84a50');
    // nurse cap with green cross
    P(-9, -19, 18, 6, CAP); P(-9, -19, 18, 2, '#fff'); P(-9, -14, 18, 1, CAPD);
    P(-9, -19, 2, 6, CAPD); P(7, -19, 2, 6, CAPD);
    P(-1, -18, 2, 4, GREEN); P(-2, -17, 4, 2, GREEN);
  };

  // detailed SOLDIER (mercenary) portrait
  S.drawSoldierPortrait = function (ctx) {
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const SKIN = '#d8a878', SKND = '#b8885c';
    ctx.imageSmoothingEnabled = false;
    P(-16, 9, 32, 16, '#3a4a2e'); P(-16, 9, 32, 2, '#4a5a38'); P(-16, 18, 32, 7, '#2e3a24'); // vest
    P(-13, 12, 5, 6, '#2a3320'); P(8, 12, 5, 6, '#2a3320'); // pouches
    P(-12, 11, 24, 2, '#4a3a1a'); for (let i = -5; i < 6; i++) P(i * 2, 11, 1, 2, i % 2 ? '#caa84a' : '#a07a30'); // bandolier
    P(-4, 4, 8, 7, SKIN); P(-4, 9, 8, 2, SKND);          // neck
    P(-8, -11, 16, 18, SKIN); P(-8, 5, 16, 2, SKND);     // face
    ctx.fillStyle = '#3a2e22'; for (let i = 0; i < 28; i++) ctx.fillRect(-7 + ((i * 5) % 14), 2 + ((i * 3) % 5), 1, 1); // stubble
    P(-7, -4, 5, 1, '#2a1e14'); P(2, -4, 5, 1, '#2a1e14');
    P(-6, -2, 4, 3, '#fff'); P(2, -2, 4, 3, '#fff');
    P(-5, -2, 2, 3, '#3a4a32'); P(3, -2, 2, 3, '#3a4a32');
    P(-4, -1, 1, 2, '#16201a'); P(4, -1, 1, 2, '#16201a');
    P(-1, 1, 2, 2, SKND); P(-3, 4, 6, 1, '#7a4a40'); P(4, -3, 1, 4, '#c89a6a'); // nose, mouth, scar
    P(-9, -15, 18, 5, '#3a4a2a'); P(-9, -15, 18, 2, '#4a5a38'); P(-9, -11, 18, 1, '#2a3320'); // helmet
    P(-10, -12, 2, 3, '#2a3320'); P(8, -12, 2, 3, '#2a3320'); P(-2, -16, 4, 2, '#222'); P(-1, -17, 2, 1, '#5fc6e8'); // ear pads + NVG
  };
  // detailed ENGINEER portrait
  S.drawEngineerPortrait = function (ctx) {
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const SKIN = '#e2b487', SKND = '#c0925f';
    ctx.imageSmoothingEnabled = false;
    P(-16, 9, 32, 16, '#caa030'); P(-16, 9, 32, 2, '#e0c050');           // hi-vis vest
    P(-16, 14, 32, 2, '#cfd6e0'); P(-16, 20, 32, 2, '#cfd6e0'); P(-2, 9, 4, 16, '#3a3a30'); // stripes + zip
    P(-4, 4, 8, 7, SKIN); P(-4, 9, 8, 2, SKND);
    P(-8, -11, 16, 18, SKIN); P(-8, 5, 16, 2, SKND);
    ctx.fillStyle = '#5a4632'; for (let i = 0; i < 16; i++) ctx.fillRect(-6 + ((i * 5) % 12), 3 + ((i * 3) % 4), 1, 1);
    P(-9, -6, 18, 3, '#2a2a2a'); P(-7, -5, 5, 2, '#7fc8e0'); P(2, -5, 5, 2, '#7fc8e0'); // goggles
    P(-6, -1, 4, 3, '#fff'); P(2, -1, 4, 3, '#fff'); P(-5, -1, 2, 2, '#3a2e1a'); P(3, -1, 2, 2, '#3a2e1a');
    P(-1, 2, 2, 2, SKND); P(-3, 5, 6, 1, '#a85a50');
    P(-10, -13, 20, 5, '#f2c14e'); P(-10, -13, 20, 2, '#ffe08a'); P(-11, -9, 22, 2, '#d8a830'); // hard hat
    P(-1, -16, 2, 3, '#d8a830'); P(-1, -12, 2, 2, '#fff');               // ridge + headlamp
  };

  // ---------------- FRONT-FACING PORTRAITS ----------------
  // detailed standing survivor for the loadout preview (matches the reference art)
  S.drawPlayerPortrait = function (ctx, gear, gunId) {
    gear = gear || {};
    const skin = gear.skin || '#f0c8a0', jacket = gear.chest || '#b03a2e',
      pants = gear.legs || '#3a5a8a', boots = gear.boots || '#dfe3ea',
      helm = gear.helmet || '#5a5236', pack = gear.pack || '#3a4a6a', gloves = gear.gloves || '#caa078',
      hair = gear.hair || '#7a4a28';
    const OL = '#241a14';
    const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    ctx.imageSmoothingEnabled = false;
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 26, 13, 3, 0, 0, T.TAU); ctx.fill();
    // backpack peeking
    P(-12, -3, 4, 16, OL); P(-11, -2, 3, 14, pack); P(-11, -2, 3, 3, shade(pack, 0.25));
    P(9, -3, 4, 16, OL); P(9, -2, 3, 14, shade(pack, -0.12));
    // legs (jeans)
    P(-7, 9, 14, 13, OL); P(-6, 10, 5, 11, pants); P(1, 10, 5, 11, pants);
    P(-6, 10, 5, 2, shade(pants, 0.18)); P(1, 10, 5, 2, shade(pants, 0.18));
    P(-1, 11, 1, 10, shade(pants, -0.3));
    // sneakers
    P(-7, 21, 6, 4, OL); P(0, 21, 6, 4, OL);
    P(-6, 21, 5, 3, boots); P(1, 21, 5, 3, boots);
    P(-6, 23, 6, 1, shade(boots, -0.25)); P(1, 23, 6, 1, shade(boots, -0.25));
    P(-5, 22, 3, 1, shade(boots, -0.15)); P(2, 22, 3, 1, shade(boots, -0.15));
    // torso: open jacket over white shirt
    P(-9, -8, 18, 18, OL);
    P(-4, -7, 8, 17, '#eef3f8');
    P(-9, -7, 6, 17, jacket); P(3, -7, 6, 17, jacket);
    P(-9, -7, 6, 2, shade(jacket, 0.2)); P(3, -7, 6, 2, shade(jacket, 0.2));
    P(-9, 5, 6, 4, shade(jacket, -0.25)); P(3, 5, 6, 4, shade(jacket, -0.25));
    P(-5, -8, 4, 2, shade(jacket, 0.1)); P(1, -8, 4, 2, shade(jacket, 0.1)); // collar
    P(-1, -2, 1, 1, '#9fb0c2'); P(-1, 2, 1, 1, '#9fb0c2'); // shirt buttons
    // arms (sleeves + hands)
    P(-12, -6, 4, 13, OL); P(-11, -5, 3, 12, jacket); P(-11, 6, 3, 3, skin);
    P(8, -6, 4, 13, OL); P(9, -5, 3, 12, jacket); P(9, 6, 3, 3, skin);
    // weapon across the body
    if (gunId && S.gun(gunId)) {
      const gg = S.gun(gunId);
      ctx.save(); ctx.translate(-3, 6); const sc = 0.9;
      ctx.drawImage(gg.canvas, 0, -gg.axis * sc, gg.canvas.width * sc, gg.canvas.height * sc);
      ctx.restore();
    }
    // neck
    P(-3, -13, 6, 4, shade(skin, -0.1));
    // head (young, confident — ~19, no beard)
    P(-8, -27, 16, 18, OL); P(-7, -26, 14, 16, skin);
    P(-7, -26, 14, 2, shade(skin, 0.12));                       // bright young forehead
    P(-5, -20, 4, 5, '#fff'); P(1, -20, 4, 5, '#fff');          // big eyes
    P(-4, -19, 3, 4, '#3f7fc8'); P(2, -19, 3, 4, '#3f7fc8');    // blue irises
    P(-4, -18, 2, 2, '#16263a'); P(2, -18, 2, 2, '#16263a');    // pupils
    P(-4, -20, 1, 1, '#fff'); P(2, -20, 1, 1, '#fff');          // sparkle
    P(-6, -22, 4, 1, shade(hair, -0.2)); P(2, -22, 4, 1, shade(hair, -0.2)); // brows
    P(-1, -14, 2, 1, shade(skin, -0.12));                       // small nose
    P(-2, -11, 4, 1, '#c2705e'); P(2, -11, 1, 1, '#a85a50');    // confident smirk
    P(-7, -13, 2, 2, '#f2a0a0'); P(5, -13, 2, 2, '#f2a0a0');    // subtle blush
    // hair or helmet
    if (gear.helmetEquipped) {
      P(-8, -29, 16, 6, OL); P(-7, -28, 14, 5, helm); P(-7, -28, 14, 2, shade(helm, 0.2));
      P(-8, -24, 2, 4, shade(helm, -0.15)); P(6, -24, 2, 4, shade(helm, -0.15));
    } else {
      // spiky ginger hair (like the reference)
      P(-8, -29, 16, 7, hair); P(-8, -29, 16, 2, shade(hair, 0.25));
      P(-9, -25, 3, 6, hair); P(6, -25, 3, 6, hair);
      P(-6, -23, 12, 2, shade(hair, -0.08));                    // fringe
      P(-7, -32, 3, 4, hair); P(-2, -33, 3, 5, hair); P(3, -33, 3, 4, hair); P(6, -31, 2, 3, hair); // upward spikes
      P(-1, -32, 2, 3, shade(hair, 0.18));
      P(-8, -23, 2, 3, shade(hair, -0.2)); P(6, -23, 2, 3, shade(hair, -0.2));
    }
    // ---- themed regalia ----
    const th = gear.theme;
    if (th === 'samurai') {
      P(-2, -33, 4, 2, '#f2c14e'); P(-5, -32, 3, 2, '#ffe08a'); P(2, -32, 3, 2, '#ffe08a'); P(-1, -36, 2, 4, '#caa84a');
      P(-13, -7, 4, 6, '#7a1f1f'); P(9, -7, 4, 6, '#7a1f1f'); P(-13, -7, 4, 1, '#caa84a'); P(9, -7, 4, 1, '#caa84a');
    } else if (th === 'aztec') {
      for (let i = -4; i <= 4; i++) { const fx = i * 3; P(fx - 1, -37, 2, 7, i % 2 ? '#1f8a5a' : '#2fae6a'); P(fx - 1, -38, 2, 2, '#f2c14e'); }
      P(-7, -30, 14, 2, '#caa84a');
    } else if (th === 'king') {
      P(-8, -34, 16, 4, '#f2c14e'); P(-8, -34, 16, 1, '#ffe9a8');
      P(-8, -38, 2, 5, '#f2c14e'); P(-1, -39, 2, 6, '#f2c14e'); P(6, -38, 2, 5, '#f2c14e');
      P(-7, -32, 2, 2, '#c33'); P(0, -32, 2, 2, '#3f8fe0'); P(5, -32, 2, 2, '#c33');
      P(-1, -42, 2, 3, '#ffe08a'); P(-2, -41, 4, 1, '#ffe08a');
      P(-9, -2, 18, 3, '#7a1414'); P(-9, -2, 18, 1, '#b51d1d');
    } else if (th === 'heaven') {
      P(-7, -38, 14, 2, '#fff7d8'); P(-8, -37, 2, 2, '#fff7d8'); P(7, -37, 2, 2, '#fff7d8'); P(-5, -39, 10, 1, '#ffffff');
      P(-14, -7, 4, 9, '#f0f0e0'); P(10, -7, 4, 9, '#f0f0e0');
    }
    if (th === 'king' || th === 'heaven') {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,210,90,0.2)'; ctx.fillRect(-12, -42, 24, 34);
      ctx.restore();
    }
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
    } else if (kind === 'pet') {
      drawPetIcon(x, id, size);
    } else if (kind === 'companion') {
      const s = size / 46;
      if (id === 'comp_medic') { x.scale(s, s); x.translate(0, -1); S.drawMedicPortrait(x); }
      else if (id === 'comp_soldier') { x.scale(s, s); x.translate(0, -1); S.drawSoldierPortrait(x); }
      else if (id === 'comp_engineer') { x.scale(s, s); x.translate(0, -1); S.drawEngineerPortrait(x); }
      else drawCompanionIcon(x, id, size);
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

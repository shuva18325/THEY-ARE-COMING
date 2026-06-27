/* ===== THEY ARE COMING — main game controller ===== */
(function (T) {
  'use strict';

  const VW = 480, VH = 300, SCALE = 2;

  class Game {
    constructor() {
      this.canvas = document.getElementById('game');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      // offscreen low-res render buffer
      const b = T.Sprites.cv(VW, VH); this.buf = b.c; this.bx = b.x;
      this.arena = { w: 1600, h: 1100 };
      this.cam = { x: 0, y: 0 };
      this.mouseWorld = { x: 0, y: 0 };
      this.particles = new T.ParticleSystem();
      this.state = null; this.mode = 'menu';
      this.wave = 1; this.score = 0; this.kills = 0;
      this.zombies = []; this.bullets = []; this.traps = []; this.turrets = [];
      this.throwables = []; this.hazards = []; this.props = [];
      this.damageFlash = 0; this.meleeSlash = null;
      this.ui = new T.UI(this);
      T.Input.init(this.canvas);
      this.last = performance.now();
      requestAnimationFrame(() => this.loop());
    }

    // ---------- state ----------
    freshState() { return JSON.parse(JSON.stringify(T.START)); }

    toHub() {
      if (!this.state) { this.state = this.freshState(); this.wave = 1; this.score = 0; this.kills = 0; }
      this.state.owned.attachUnlocked = this.state.owned.attachUnlocked || [];
      this.mode = 'hub';
      this.ui.showScreen('hub');
      this.ui.renderHub();
      this.ui.daveGreet();
    }
    restart() { this.state = this.freshState(); this.wave = 1; this.score = 0; this.kills = 0; this.ui.daveSeen = false; this.toHub(); }

    // ---------- derived stats ----------
    computeStats() {
      const eq = this.state.equipped;
      const s = { maxHp: 100, armor: 0, speed: 175, stamina: 100, reloadMul: 1, crit: 0.03, trapSlots: 1, beltSlots: 2, ammoMul: 1 };
      ['helmet', 'chest', 'legs', 'boots', 'gloves', 'backpack'].forEach(slot => {
        const id = eq[slot]; if (!id) return; const a = T.ARMOR[id]; if (!a) return;
        if (a.armor) s.armor += a.armor;
        if (a.hp) s.maxHp += a.hp;
        if (a.spd) s.speed *= (1 + a.spd);
        if (a.reload) s.reloadMul *= (1 - a.reload);
        if (a.crit) s.crit += a.crit;
        if (a.stamina) s.stamina += a.stamina;
        if (a.ammo) s.ammoMul += a.ammo;
        if (slot === 'backpack') { s.trapSlots = a.trapSlots || 1; s.beltSlots = a.beltSlots || 2; }
        if (a.beltSlots && slot !== 'backpack') s.beltSlots += a.beltSlots; // cargo pants bonus
      });
      s.speed = Math.round(s.speed);
      return s;
    }

    gearColors() {
      const eq = this.state.equipped;
      const col = (slot, def) => { const id = eq[slot]; return id && T.ARMOR[id] ? T.ARMOR[id].color : def; };
      return {
        skin: '#c79c74',
        helmet: col('helmet', '#3a2a20'),
        chest: col('chest', '#3a4a3a'),
        legs: col('legs', '#2a3a55'),
        boots: col('boots', '#222'),
        gloves: col('gloves', '#2a2a2a'),
        pack: col('backpack', '#3a4a6a'),
      };
    }

    applyAttachments(weaponId, ammoMul) {
      const w = T.WEAPONS[weaponId]; if (!w) return;
      const list = (this.state.owned.attach[weaponId] || []);
      w._dmgMul = 1; w._rangeMul = 1; w._spdMul = 1; w._reloadMul = 1; w._pierce = 0;
      w._spread = w.spread; w._mag = w.mag; w._critAdd = 0; w._ap = false; w._fire = !!w.fire; w._silent = !!w.silent;
      list.forEach(aid => {
        const a = T.ATTACHMENTS[aid]; if (!a) return;
        const m = a.mods || {};
        if (m.mag) w._mag = Math.round(w._mag * (1 + m.mag));
        if (m.spread) w._spread = Math.max(0, w._spread * (1 + m.spread));
        if (m.reload) w._reloadMul *= (1 - m.reload);
        if (m.range) w._rangeMul *= (1 + m.range);
        if (m.spd) w._spdMul *= (1 + m.spd);
        if (m.dmg) w._dmgMul *= (1 + m.dmg);
        if (m.crit) w._critAdd += m.crit;
        if (m.pierce) w._pierce += m.pierce;
        if (a.ap) w._ap = true;
        if (a.fire) w._fire = true;
        if (a.silent) w._silent = true;
      });
      w._reserve = Math.round(w.reserve * ammoMul);
    }

    // ---------- deploy / waves ----------
    deploy() {
      const stats = this.computeStats();
      const eq = this.state.equipped;
      const gear = this.gearColors();
      const ammo = {};
      ['primary', 'secondary'].forEach(slot => {
        const id = eq[slot]; if (!id || !T.WEAPONS[id]) return;
        this.applyAttachments(id, stats.ammoMul);
        const w = T.WEAPONS[id];
        ammo[id] = { mag: w._mag, reserve: w._reserve };
      });
      this.player = new T.Player(this.arena.w / 2, this.arena.h / 2);
      this.player.initFromLoadout(stats, gear, ammo, eq);
      this.zombies.length = 0; this.bullets.length = 0; this.traps.length = 0;
      this.turrets.length = 0; this.throwables.length = 0; this.hazards.length = 0;
      this.particles.clear();
      this.buildEnvironment();
      this.startWave();
      this.mode = 'play';
      this.ui.showScreen('hud');
      this.ui.updateBelt();
    }

    buildEnvironment() {
      const ids = Object.keys(T.ENVIRONMENTS);
      this.env = T.ENVIRONMENTS[ids[(this.wave - 1) % ids.length]];
      this.lighting = T.LIGHTING[this.env.light] || T.LIGHTING.day;
      this.bakeGround();
      this.props.length = 0;
      const n = 5 + ((this.wave) % 3);
      for (let i = 0; i < n; i++) {
        const kind = T.pick(this.env.props);
        let x = T.rand(120, this.arena.w - 120), y = T.rand(120, this.arena.h - 120);
        if (T.dist(x, y, this.arena.w / 2, this.arena.h / 2) < 140) { x += 180; }
        this.addProp(kind, x, y);
      }
    }

    addProp(kind, x, y) {
      const dims = {
        car: [34, 18, true, '#3a3d40'], barrier: [30, 11, true, '#9a9a8a'], sandbag: [26, 13, true, '#7a6a4a'],
        fence: [34, 5, false, '#5a4a32'], rubble: [22, 16, false, '#6a6458'], fire: [16, 16, false, '#e07a2a'],
        tent: [30, 22, false, '#3a5a3a'], barricade: [24, 10, true, '#6a5a3a'],
      }[kind] || [20, 14, true, '#555'];
      this.props.push({ kind, x, y, w: dims[0], h: dims[1], solid: dims[2], dcol: dims[3], rot: T.chance(.5) ? 0 : T.rand(-0.3, 0.3) });
    }

    bakeGround() {
      const g = T.Sprites.cv(this.arena.w, this.arena.h); const x = g.x; const e = this.env;
      x.fillStyle = e.ground; x.fillRect(0, 0, this.arena.w, this.arena.h);
      // patches
      for (let i = 0; i < 700; i++) { x.fillStyle = T.chance(.5) ? e.ground2 : e.accent; const s = T.rand(4, 16); x.globalAlpha = T.rand(0.15, 0.5); x.fillRect(T.rand(0, this.arena.w), T.rand(0, this.arena.h), s, s); }
      x.globalAlpha = 1;
      // cracks / specks
      for (let i = 0; i < 1400; i++) { x.fillStyle = T.chance(.5) ? '#000' : e.accent; x.globalAlpha = T.rand(0.1, 0.4); x.fillRect(T.rand(0, this.arena.w), T.rand(0, this.arena.h), 1, 1); }
      x.globalAlpha = 1;
      // road lane dashes for street/highway
      if (e.name.includes('Street') || e.name.includes('Highway')) {
        x.fillStyle = 'rgba(200,180,80,0.4)';
        for (let yy = 60; yy < this.arena.h; yy += 90) for (let xx = 0; xx < this.arena.w; xx += 60) x.fillRect(xx, yy, 26, 5);
      }
      this.groundCanvas = g.c;
    }

    startWave() {
      const N = this.wave;
      this.isBoss = (N % 5 === 0);
      this.killedThisWave = 0;
      this.hpScale = 1 + (N - 1) * 0.08;
      this.spdScale = Math.min(1.55, 1 + (N - 1) * 0.015);
      this.spawnTimer = 1.2;
      let count = 8 + N * 4;
      if (this.isBoss) {
        count = Math.round(count * 0.6);
        const bossId = (N % 10 === 0) ? 'z_boss_mother' : 'z_boss_behemoth';
        const a = T.rand(0, T.TAU);
        this.spawnAt(this.player.x + Math.cos(a) * 320, this.player.y + Math.sin(a) * 320, bossId, 1 + (N / 10));
      }
      this.toSpawn = count;
      this.totalThisWave = count + (this.isBoss ? 1 : 0);
      this.aliveCap = 38 + N;
      const sub = this.isBoss ? '⚠ BOSS WAVE ⚠' : this.totalThisWave + ' INFECTED INBOUND';
      this.ui.waveBanner('WAVE ' + N, sub + '  —  ' + this.env.name);
      T.Audio.scream();
    }

    waveType() {
      const N = this.wave;
      const pool = [];
      const add = (id, w) => { if (T.ZOMBIES[id].tier <= N) for (let i = 0; i < w; i++) pool.push(id); };
      add('z_walker', 6); add('z_crawler', 3); add('z_runner', 4); add('z_dog', 2);
      add('z_spitter', 2); add('z_screamer', 1); add('z_bloater', 2); add('z_armored', 2);
      add('z_brute', 1); add('z_stalker', this.env && this.env.light === 'night' ? 3 : 1);
      return pool.length ? T.pick(pool) : 'z_walker';
    }

    spawnTick(dt) {
      if (this.toSpawn <= 0) return;
      this.spawnTimer -= dt;
      if (this.spawnTimer > 0) return;
      if (this.zombiesAlive() >= this.aliveCap) { this.spawnTimer = 0.3; return; }
      const burst = Math.min(this.toSpawn, T.randInt(1, 3 + Math.floor(this.wave / 4)));
      for (let i = 0; i < burst; i++) {
        const a = T.rand(0, T.TAU), d = T.rand(300, 360);
        this.spawnAt(this.player.x + Math.cos(a) * d, this.player.y + Math.sin(a) * d, this.waveType());
        this.toSpawn--;
        if (this.toSpawn <= 0) break;
      }
      this.spawnTimer = T.rand(0.5, 1.4) * Math.max(0.4, 1 - this.wave * 0.02);
    }

    spawnAt(x, y, defId, hpMul) {
      x = T.clamp(x, 16, this.arena.w - 16); y = T.clamp(y, 16, this.arena.h - 16);
      this.zombies.push(new T.Zombie(x, y, defId, this.hpScale * (hpMul || 1), this.spdScale));
    }

    // ---------- callbacks from entities ----------
    onZombieKilled(z) {
      this.kills++; this.killedThisWave++;
      const cash = z.def.cash; this.state.cash += cash; this.score += z.def.score;
      if (z.def.boss) { this.state.salvage += 3 + Math.floor(this.wave / 5); }
      else if ((z.def.big || z.def.armored || z.def.summon || z.def.ranged || z.def.night) && T.chance(0.14)) { this.state.salvage += 1; this.particles.floatText(z.x, z.y - 18, '+1 ◆', '#54c6e8'); }
    }
    addCash(n) { this.state.cash += n; }
    addHazard(x, y, r, dur, type) { this.hazards.push(new T.Hazard(x, y, r, dur, type)); }
    screamBuff(src) { for (const z of this.zombies) if (!z.dead && T.dist(src.x, src.y, z.x, z.y) < 160) z.spd = z.def.spd * this.spdScale * 1.3; }
    zombiesAlive() { let n = 0; for (const z of this.zombies) if (!z.dead) n++; return n; }
    zombiesLeft() { return this.toSpawn + this.zombiesAlive(); }

    blocked(x, y, r) {
      for (const p of this.props) {
        if (!p.solid) continue;
        if (x > p.x - p.w / 2 - r && x < p.x + p.w / 2 + r && y > p.y - p.h / 2 - r && y < p.y + p.h / 2 + r) return true;
      }
      return false;
    }

    // ---------- loop ----------
    loop() {
      const now = performance.now();
      let dt = (now - this.last) / 1000; this.last = now;
      if (dt > 0.05) dt = 0.05;
      if (this.mode === 'play') this.update(dt);
      this.render();
      T.Input.endFrame();
      requestAnimationFrame(() => this.loop());
    }

    update(dt) {
      const p = this.player;
      // camera + mouse world
      this.cam.x = T.clamp(p.x - VW / 2, 0, this.arena.w - VW);
      this.cam.y = T.clamp(p.y - VH / 2, 0, this.arena.h - VH);
      this.mouseWorld.x = T.Input.mouse.sx / SCALE + this.cam.x;
      this.mouseWorld.y = T.Input.mouse.sy / SCALE + this.cam.y;

      // hotkeys
      if (T.Input.justPressed('q')) p.swap(this);
      if (T.Input.justPressed('r')) p.reload(this);
      if (T.Input.justPressed('e')) p.placeTrap(this);
      if (T.Input.justPressed('f')) p.doMelee(this);
      if (T.Input.justPressed(' ')) p.useConsumable(this);
      for (let i = 1; i <= 4; i++) if (T.Input.justPressed('' + i)) { if (p.belt[i - 1] != null) { p.beltIndex = i - 1; this.ui.updateBelt(); } }

      p.update(dt, this);
      this.spawnTick(dt);

      for (const z of this.zombies) if (!z.dead) z.update(dt, this);
      for (const b of this.bullets) b.update(dt, this);
      for (const t of this.traps) t.update(dt, this);
      for (const t of this.turrets) t.update(dt, this);
      for (const t of this.throwables) t.update(dt, this);
      for (const h of this.hazards) h.update(dt, this);
      // fire props emit
      for (const pr of this.props) if (pr.kind === 'fire' && T.chance(0.6)) this.particles.fire(pr.x, pr.y - 2, 1);
      this.particles.update(dt);

      if (this.meleeSlash) { this.meleeSlash.life -= dt; if (this.meleeSlash.life <= 0) this.meleeSlash = null; }
      if (this.damageFlash > 0) this.damageFlash -= dt;

      // cull
      this.zombies = this.zombies.filter(z => !z.dead);
      this.bullets = this.bullets.filter(b => !b.dead);
      this.traps = this.traps.filter(t => t.active);
      this.turrets = this.turrets.filter(t => t.active);
      this.throwables = this.throwables.filter(t => !t.dead);
      this.hazards = this.hazards.filter(h => !h.dead);

      this.ui.updateHUD();

      // wave complete?
      if (this.toSpawn <= 0 && this.zombies.length === 0 && this.mode === 'play') this.completeWave();
    }

    completeWave() {
      this.mode = 'wavecomplete';
      const bonus = 100 + this.wave * 50;
      this.state.cash += bonus; this.score += bonus;
      const sal = this.isBoss ? 0 : (T.chance(0.5) ? 1 : 0);
      this.state.salvage += sal;
      this.ui.waveComplete([
        ['Wave Survived', this.wave],
        ['Kills This Run', this.kills],
        ['Clear Bonus', '$' + bonus],
        ['Salvage Found', '◆ ' + (sal + (this.isBoss ? 3 : 0))],
        ['Cash on Hand', '$' + T.fmt(this.state.cash)],
        ['Score', T.fmt(this.score)],
      ]);
      this.wave++;
    }

    gameOver() {
      if (this.mode === 'gameover') return;
      this.mode = 'gameover';
      T.Audio.explosion();
      this.ui.gameOver([
        ['You Reached', 'Wave ' + this.wave],
        ['Total Kills', this.kills],
        ['Final Score', T.fmt(this.score)],
        ['Cash Banked', '$' + T.fmt(this.state.cash)],
      ]);
    }

    // ---------- render ----------
    render() {
      const x = this.bx; const cam = this.cam;
      x.imageSmoothingEnabled = false;
      if (this.mode === 'menu' || !this.player) { this.renderMenuBg(x); this.blit(); return; }

      // shake offset
      const sh = this.particles.shake;
      const shx = sh ? T.rand(-sh, sh) : 0, shy = sh ? T.rand(-sh, sh) : 0;

      x.save();
      x.translate(-cam.x + shx, -cam.y + shy);

      // ground
      x.drawImage(this.groundCanvas, cam.x - shx, cam.y - shy, VW + 8, VH + 8, cam.x - shx, cam.y - shy, VW + 8, VH + 8);
      // decals
      this.particles.drawDecals(x);
      // hazards (ground)
      for (const h of this.hazards) h.draw(x);
      // traps
      for (const t of this.traps) t.draw(x);
      // props (sorted by y with entities)
      const drawList = [];
      for (const pr of this.props) drawList.push({ y: pr.y, t: 'prop', o: pr });
      for (const z of this.zombies) drawList.push({ y: z.y, t: 'z', o: z });
      for (const tu of this.turrets) drawList.push({ y: tu.y, t: 'tu', o: tu });
      drawList.push({ y: this.player.y, t: 'p', o: this.player });
      drawList.sort((a, b) => a.y - b.y);
      for (const d of drawList) {
        if (d.t === 'prop') this.drawProp(x, d.o);
        else if (d.t === 'z') d.o.draw(x);
        else if (d.t === 'tu') d.o.draw(x);
        else this.player.draw(x, this);
      }
      // melee slash
      if (this.meleeSlash) this.drawSlash(x, this.meleeSlash);
      // throwables + bullets
      for (const t of this.throwables) t.draw(x);
      for (const b of this.bullets) b.draw(x);
      // particles & floaters
      this.particles.drawParts(x);
      this.particles.drawFloaters(x);

      // ---- lighting ----
      const L = this.lighting;
      if (L.dark > 0) {
        x.fillStyle = 'rgba(4,6,12,' + L.dark + ')';
        x.fillRect(cam.x - shx, cam.y - shy, VW + 4, VH + 4);
      }
      // additive lights: player aura + particle lights + fires
      x.globalCompositeOperation = 'lighter';
      this.lightBlob(x, this.player.x, this.player.y, 155, 'rgba(130,130,95,' + (L.dark > 0 ? 0.55 : 0.2) + ')');
      // muzzle/flash light when firing handled by particle lights
      for (const pr of this.props) if (pr.kind === 'fire') this.lightBlob(x, pr.x, pr.y, 50, 'rgba(230,120,40,0.6)');
      this.particles.drawLights(x);
      x.globalCompositeOperation = 'source-over';

      // tint
      if (L.tint) { x.fillStyle = L.tint; x.fillRect(cam.x - shx, cam.y - shy, VW + 4, VH + 4); }

      // vignette
      this.vignette(x, cam, shx, shy, L.dark);

      // reticle (world space)
      this.drawReticle(x);

      x.restore();

      // damage flash (screen)
      if (this.damageFlash > 0) { x.fillStyle = 'rgba(180,20,20,' + (this.damageFlash * 0.6) + ')'; x.fillRect(0, 0, VW, VH); }
      // low-hp pulse
      if (this.player.hp / this.player.maxHp < 0.3) { x.fillStyle = 'rgba(150,10,10,' + (0.12 + 0.08 * Math.sin(performance.now() / 200)) + ')'; x.fillRect(0, 0, VW, VH); }

      this.blit();
    }

    lightBlob(x, wx, wy, r, col) {
      const grd = x.createRadialGradient(wx, wy, 0, wx, wy, r);
      grd.addColorStop(0, col); grd.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = grd; x.fillRect(wx - r, wy - r, r * 2, r * 2);
    }
    vignette(x, cam, shx, shy, dark) {
      const cx = this.player.x, cy = this.player.y;
      const grd = x.createRadialGradient(cx, cy, 110, cx, cy, 250);
      grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,' + (0.24 + dark * 0.45) + ')');
      x.fillStyle = grd; x.fillRect(cam.x - shx - 4, cam.y - shy - 4, VW + 8, VH + 8);
    }
    drawReticle(x) {
      const m = this.mouseWorld;
      x.strokeStyle = 'rgba(255,80,80,0.9)'; x.lineWidth = 1;
      x.beginPath(); x.arc(m.x, m.y, 5, 0, T.TAU); x.stroke();
      x.beginPath();
      x.moveTo(m.x - 8, m.y); x.lineTo(m.x - 3, m.y);
      x.moveTo(m.x + 3, m.y); x.lineTo(m.x + 8, m.y);
      x.moveTo(m.x, m.y - 8); x.lineTo(m.x, m.y - 3);
      x.moveTo(m.x, m.y + 3); x.lineTo(m.x, m.y + 8);
      x.stroke();
      x.fillStyle = '#ff5050'; x.fillRect(m.x, m.y, 1, 1);
    }
    drawSlash(x, s) {
      const a = T.clamp(s.life / s.max, 0, 1);
      x.save(); x.translate(s.x, s.y); x.rotate(s.a);
      x.strokeStyle = 'rgba(255,255,255,' + a + ')'; x.lineWidth = 2;
      x.beginPath(); x.arc(0, 0, s.range, -s.arc, s.arc); x.stroke();
      x.restore();
    }

    drawProp(x, pr) {
      x.save(); x.translate(pr.x, pr.y); x.rotate(pr.rot || 0);
      const w = pr.w, h = pr.h;
      // shadow
      x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(-w / 2, -h / 2 + 2, w, h);
      if (pr.kind === 'car') {
        x.fillStyle = T.pick ? pr._c || (pr._c = T.pick(['#5a2a2a', '#2a3a4a', '#3a3a30', '#444'])) : '#444';
        T.Sprites.roundRect(x, -w / 2, -h / 2, w, h, 3);
        x.fillStyle = 'rgba(0,0,0,0.4)'; x.fillRect(-w / 2 + 4, -h / 2 + 3, w - 8, 4); // windshield
        x.fillStyle = 'rgba(120,160,180,0.5)'; x.fillRect(-w / 2 + 5, -h / 2 + 3, w - 10, 2);
        x.fillStyle = '#1a1a1a'; x.fillRect(-w / 2 - 1, -h / 2 + 2, 2, 4); x.fillRect(-w / 2 - 1, h / 2 - 6, 2, 4);
        x.fillStyle = T.Sprites.shade(pr._c, -0.4); x.fillRect(-w / 2, h / 2 - 3, w, 3);
      } else if (pr.kind === 'barrier') {
        x.fillStyle = '#9a9a8a'; x.beginPath(); x.moveTo(-w / 2, h / 2); x.lineTo(-w / 2 + 4, -h / 2); x.lineTo(w / 2 - 4, -h / 2); x.lineTo(w / 2, h / 2); x.closePath(); x.fill();
        x.fillStyle = '#b5b5a5'; x.fillRect(-w / 2 + 4, -h / 2, w - 8, 2);
        x.fillStyle = '#c83a1a'; x.fillRect(-w / 2 + 2, h / 2 - 3, w - 4, 2);
      } else if (pr.kind === 'sandbag') {
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { x.fillStyle = (r + c) % 2 ? '#7a6a4a' : '#8a7a5a'; T.Sprites.roundRect(x, -w / 2 + c * (w / 3), -h / 2 + r * (h / 2), w / 3 - 1, h / 2 - 1, 2); }
      } else if (pr.kind === 'fence') {
        x.fillStyle = '#5a4a32'; x.fillRect(-w / 2, -1, w, 2);
        x.fillStyle = '#6a5a3a'; for (let i = -w / 2; i < w / 2; i += 5) x.fillRect(i, -h / 2, 2, h);
      } else if (pr.kind === 'rubble') {
        for (let i = 0; i < 6; i++) { x.fillStyle = T.pick(['#6a6458', '#555', '#4a4a40']); x.fillRect(T.rand(-w / 2, w / 2 - 4), T.rand(-h / 2, h / 2 - 4), T.rand(3, 7), T.rand(3, 6)); }
      } else if (pr.kind === 'fire') {
        x.fillStyle = 'rgba(60,40,20,0.6)'; x.beginPath(); x.arc(0, 0, w / 2, 0, T.TAU); x.fill();
      } else if (pr.kind === 'tent') {
        x.fillStyle = '#3a5a3a'; x.beginPath(); x.moveTo(-w / 2, h / 2); x.lineTo(0, -h / 2); x.lineTo(w / 2, h / 2); x.closePath(); x.fill();
        x.fillStyle = '#2a4a2a'; x.fillRect(-1, -h / 2, 2, h);
        x.fillStyle = '#fff'; x.font = '8px monospace'; x.fillText('+', -3, 2);
      } else if (pr.kind === 'barricade') {
        x.fillStyle = '#6a5a3a'; T.Sprites.roundRect(x, -w / 2, -h / 2, w, h, 2);
        x.fillStyle = '#5a4a2a'; for (let i = -w / 2; i < w / 2; i += 6) x.fillRect(i, -h / 2, 1, h);
      }
      x.restore();
    }

    renderMenuBg(x) {
      x.fillStyle = '#0a0c0a'; x.fillRect(0, 0, VW, VH);
      // faint shamblers silhouette
      for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(40,60,30,0.25)'; const xx = (i * 53) % VW, yy = 120 + (i * 31) % 160; x.beginPath(); x.arc(xx, yy, 4 + (i % 3), 0, T.TAU); x.fill(); }
    }

    blit() {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.buf, 0, 0, VW, VH, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  window.addEventListener('DOMContentLoaded', () => { T.game = new Game(); });
})(window.TAC);

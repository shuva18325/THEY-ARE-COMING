/* ===== THEY ARE COMING — entities ===== */
(function (T) {
  'use strict';

  // ---------------- BULLET ----------------
  class Bullet {
    constructor(x, y, ang, w, opt) {
      opt = opt || {};
      this.x = x; this.y = y;
      const spread = (opt.spread != null ? opt.spread : 0);
      const a = ang + spread;
      const spd = opt.spd || w.spd;
      this.vx = Math.cos(a) * spd; this.vy = Math.sin(a) * spd;
      this.dmg = opt.dmg != null ? opt.dmg : w.dmg;
      this.type = w.bullet || 'round';
      this.owner = opt.owner || 'player';
      this.pierce = opt.pierce || 0;
      this.range = opt.range || w.range || 600;
      this.traveled = 0;
      this.ap = opt.ap || false;
      this.fire = opt.fire || w.fire || false;
      this.crit = opt.crit || false;
      this.aoe = opt.aoe || w.aoe || 0;
      this.kb = (w.kb || 50);
      this.chain = opt.chain || 0;
      this.gold = opt.gold || false;
      this.width = opt.width || 0;
      this.dead = false;
      this.hitSet = new Set();
      this.trail = [];
      this.color = ({ round: '#ffd24a', slug: '#ffcf6a', bolt: '#d8e0e8', flame: '#f2a23a', rail: '#9fe8ff', grenade: '#3a3d40', rocket: '#e8632a', lightning: '#bfeaff', fireball: '#ff8a2a', goldlight: '#ffe08a', excal: '#ffe9a8' })[this.type];
      this.r = this.width || ((this.type === 'grenade' || this.type === 'rocket' || this.type === 'fireball') ? 2.8 : ((this.type === 'rail' || this.type === 'lightning' || this.type === 'goldlight') ? 1.6 : 1.2));
    }
    update(dt, G) {
      const px = this.x, py = this.y;
      this.x += this.vx * dt; this.y += this.vy * dt;
      const step = Math.hypot(this.vx, this.vy) * dt;
      this.traveled += step;
      this.trail.push(this.x, this.y); if (this.trail.length > 8) this.trail.splice(0, 2);

      // flamethrower: short, spawns fire & fades
      if (this.type === 'flame') {
        G.particles.fire(this.x, this.y, 1);
        if (this.traveled > this.range) { this.dead = true; }
      }
      if (this.type === 'rocket' || this.type === 'fireball') { G.particles.fire(this.x, this.y, this.type === 'fireball' ? 2 : 1); if (this.type === 'rocket') G.particles.smoke(this.x, this.y, 1, 'rgba(80,75,68,0.5)'); }
      if ((this.type === 'lightning' || this.type === 'goldlight') && T.chance(0.5)) G.particles.spark(this.x, this.y, T.rand(0, T.TAU), 1, this.color);
      if (this.type === 'excal') { if (T.chance(0.8)) G.particles.spark(this.x + T.rand(-this.r, this.r), this.y + T.rand(-this.r, this.r), T.rand(0, T.TAU), 2, '#ffe9a8'); G.particles.light(this.x, this.y, this.r * 2, 'rgba(255,220,120,0.5)', 0.06); }
      if (this.traveled > this.range) { this.dead = true; if (this.aoe) this.explode(G); return; }
      // arena bounds / props
      if (this.x < 0 || this.y < 0 || this.x > G.arena.w || this.y > G.arena.h) { this.dead = true; if (this.aoe) this.explode(G); return; }
      for (const pr of G.props) {
        if (pr.solid && this.x > pr.x - pr.w / 2 && this.x < pr.x + pr.w / 2 && this.y > pr.y - pr.h / 2 && this.y < pr.y + pr.h / 2) {
          G.particles.debris(this.x, this.y, Math.atan2(-this.vy, -this.vx), pr.dcol);
          T.Audio.spark();
          this.dead = true; if (this.aoe) this.explode(G); return;
        }
      }

      if (this.owner === 'player') {
        for (const z of G.zombies) {
          if (z.dead || this.hitSet.has(z.id)) continue;
          if (T.dist2(this.x, this.y, z.x, z.y) < (z.def.r + this.r) * (z.def.r + this.r)) {
            this.hitZombie(z, G);
            if (this.dead) return;
          }
        }
      } else {
        const p = G.player;
        if (T.dist2(this.x, this.y, p.x, p.y) < (p.r + this.r) * (p.r + this.r)) {
          p.takeDamage(this.dmg, G);
          G.particles.blood(this.x, this.y, Math.atan2(this.vy, this.vx), 4);
          this.dead = true;
        }
      }
    }
    hitZombie(z, G) {
      const ang = Math.atan2(this.vy, this.vx);
      const res = z.takeDamage(this.dmg, ang, G, { ap: this.ap, fire: this.fire, crit: this.crit, kb: this.kb, gold: this.gold });
      this.hitSet.add(z.id);
      if (this.chain > 0) {
        let near = null, nd = 120 * 120;
        for (const o of G.zombies) { if (o.dead || this.hitSet.has(o.id)) continue; const d = T.dist2(this.x, this.y, o.x, o.y); if (d < nd) { nd = d; near = o; } }
        if (near) { this.chain--; this.hitSet.add(near.id); G.addArc(this.x, this.y, near.x, near.y, this.color); near.takeDamage(this.dmg * 0.75, T.angle(this.x, this.y, near.x, near.y), G, { ap: true }); G.particles.spark(near.x, near.y, 0, 5, this.color); }
      }
      if (this.aoe) { this.dead = true; this.explode(G); return; }
      if (res.deflected) { this.dead = true; return; }
      if (this.pierce > 0) { this.pierce--; this.dmg *= 0.85; }
      else this.dead = true;
    }
    explode(G) {
      const fire = this.type === 'grenade' ? false : this.fire;
      G.particles.explosion(this.x, this.y, this.aoe, fire);
      T.Audio.explosion();
      for (const z of G.zombies) {
        if (z.dead) continue;
        const d = T.dist(this.x, this.y, z.x, z.y);
        if (d < this.aoe) {
          const ang = T.angle(this.x, this.y, z.x, z.y);
          z.takeDamage(this.dmg * (1 - d / this.aoe * 0.5), ang, G, { ap: true, kb: 200 });
        }
      }
      if ((this.type === 'grenade' || this.type === 'rocket' || this.type === 'fireball') && this.fire) G.addHazard(this.x, this.y, this.aoe * 0.85, 5, 'fire');
    }
    draw(ctx) {
      // trail
      if (this.trail.length >= 4 && this.type !== 'flame') {
        const bright = this.type === 'rail' || this.type === 'lightning' || this.type === 'goldlight';
        ctx.strokeStyle = this.type === 'goldlight' ? 'rgba(255,224,138,0.6)' : (bright ? 'rgba(159,232,255,0.6)' : 'rgba(255,210,100,0.35)');
        ctx.lineWidth = bright ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(this.trail[0], this.trail[1]);
        for (let i = 2; i < this.trail.length; i += 2) ctx.lineTo(this.trail[i], this.trail[i + 1]);
        ctx.stroke();
      }
      if (this.type === 'flame') return; // drawn as particles
      const ang = Math.atan2(this.vy, this.vx);
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(ang);
      if (this.type === 'grenade') { ctx.fillStyle = '#3a3d40'; ctx.fillRect(-2, -1.5, 4, 3); ctx.fillStyle = '#777'; ctx.fillRect(-2, -1.5, 4, 1); }
      else if (this.type === 'rocket') { ctx.fillStyle = '#3a4a2a'; ctx.fillRect(-4, -1.5, 7, 3); ctx.fillStyle = '#b51d1d'; ctx.fillRect(2, -1.5, 2, 3); ctx.fillStyle = '#2a3a1a'; ctx.fillRect(-4, -2.5, 2, 1); ctx.fillRect(-4, 1.5, 2, 1); ctx.fillStyle = '#ffd24a'; ctx.fillRect(-6, -1, 2, 2); }
      else if (this.type === 'bolt') { ctx.fillStyle = '#caa'; ctx.fillRect(-3, -0.5, 6, 1); ctx.fillStyle = '#fff'; ctx.fillRect(2, -0.5, 2, 1); }
      else if (this.type === 'rail') { ctx.fillStyle = '#9fe8ff'; ctx.fillRect(-4, -0.8, 9, 1.6); ctx.fillStyle = '#fff'; ctx.fillRect(0, -0.6, 6, 1.2); }
      else if (this.type === 'lightning') { ctx.fillStyle = '#fff'; ctx.fillRect(-5, -0.8, 12, 1.6); ctx.fillStyle = '#9fe8ff'; ctx.fillRect(-5, -1.7, 12, 0.9); ctx.fillRect(-5, 0.8, 12, 0.9); ctx.fillStyle = '#fff'; ctx.fillRect(3, -1.6, 5, 3.2); }
      else if (this.type === 'goldlight') { ctx.fillStyle = '#fff'; ctx.fillRect(-5, -0.8, 12, 1.6); ctx.fillStyle = '#ffe08a'; ctx.fillRect(-5, -1.7, 12, 0.9); ctx.fillRect(-5, 0.8, 12, 0.9); }
      else if (this.type === 'fireball') { ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(0, 0, 3.4, 0, T.TAU); ctx.fill(); ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.arc(0, 0, 2.1, 0, T.TAU); ctx.fill(); ctx.fillStyle = '#c83a1a'; ctx.fillRect(-1, -1, 2, 2); }
      else if (this.type === 'excal') { ctx.fillStyle = 'rgba(255,233,168,0.4)'; ctx.beginPath(); ctx.arc(0, 0, this.r, 0, T.TAU); ctx.fill(); ctx.fillStyle = '#ffe9a8'; ctx.fillRect(-2.5, -this.r, 5, this.r * 2); ctx.fillStyle = '#fff'; ctx.fillRect(-1, -this.r * 0.7, this.r * 0.5, this.r * 1.4); }
      else { ctx.fillStyle = '#fff7c0'; ctx.fillRect(-2, -0.6, 4, 1.2); ctx.fillStyle = this.color; ctx.fillRect(-2, -0.6, 2, 1.2); }
      ctx.restore();
    }
  }
  T.Bullet = Bullet;

  // ---------------- ZOMBIE ----------------
  let ZID = 1;
  class Zombie {
    constructor(x, y, defId, hpScale, spdScale) {
      this.id = ZID++;
      this.def = T.ZOMBIES[defId];
      this.defId = defId;
      this.x = x; this.y = y;
      this.maxHp = Math.round(this.def.hp * (hpScale || 1));
      this.hp = this.maxHp;
      this.spd = this.def.spd * (spdScale || 1);
      this.angle = 0;
      this.animPhase = T.rand(0, 6);
      this.hurtFlash = 0;
      this.slowT = 0; this.rootT = 0; this.burnT = 0; this.burnTick = 0;
      this.atkCd = 0; this.rangeCd = T.rand(1, 3); this.summonCd = T.rand(3, 6);
      this.dead = false;
      this.kbx = 0; this.kby = 0;
    }
    takeDamage(amount, fromAng, G, opt) {
      opt = opt || {};
      if (this.parrying > 0) { G.particles.spark(this.x + Math.cos(fromAng + Math.PI) * this.def.r, this.y + Math.sin(fromAng + Math.PI) * this.def.r, fromAng + Math.PI, 5, '#ffe9a8'); if (T.chance(0.12)) G.particles.floatText(this.x, this.y - this.def.r, 'PARRY', '#ffe08a'); T.Audio.spark(); return { deflected: true, dmg: 0 }; }
      if (this.def.goldImmune && opt.gold) { G.particles.spark(this.x, this.y, fromAng + Math.PI, 5, '#fff7d8'); if (T.chance(0.2)) G.particles.floatText(this.x, this.y - this.def.r - 2, 'IMMUNE', '#ffe08a'); return { deflected: true, dmg: 0 }; }
      if (opt.gold) this._goldDeath = true;
      if (G.settings && G.settings.oneShot) amount = 999999;
      let dmg = amount, deflected = false;
      if (this.def.armored && !opt.ap && !opt.crit) {
        if (T.chance(0.55)) { // plate deflection
          deflected = true;
          G.particles.spark(this.x + Math.cos(fromAng) * this.def.r, this.y + Math.sin(fromAng) * this.def.r, fromAng + Math.PI, 5, '#cfd6e0');
          T.Audio.spark();
          dmg *= 0.25;
        } else dmg *= 0.6;
      }
      if (this.def.shielded && !opt.ap && !opt.crit) { // riot shield blocks frontal fire
        const incoming = fromAng + Math.PI; // points back toward the shooter
        if (Math.abs(T.angleDiff(this.angle, incoming)) < 1.1) {
          deflected = true; dmg *= 0.1;
          G.particles.spark(this.x + Math.cos(this.angle) * this.def.r, this.y + Math.sin(this.angle) * this.def.r, this.angle + Math.PI, 6, '#cfd6e0');
          T.Audio.spark();
        } else dmg *= 0.7;
      }
      dmg = Math.round(dmg);
      this.hp -= dmg;
      this.hurtFlash = 0.08;
      if (opt.kb && !this.def.boss && !this.def.big) {
        const k = opt.kb * (this.def.big ? 0.2 : 1);
        this.kbx += Math.cos(fromAng) * k; this.kby += Math.sin(fromAng) * k;
      }
      if (!deflected) {
        G.particles.blood(this.x + Math.cos(fromAng) * this.def.r * 0.6, this.y + Math.sin(fromAng) * this.def.r * 0.6, fromAng, opt.crit ? 12 : 6);
        T.Audio.hit();
      }
      if (opt.fire) this.burnT = Math.max(this.burnT, 3);
      G.particles.floatText(this.x, this.y - this.def.r - 2, '' + dmg, opt.crit ? '#ffd24a' : '#fff', opt.crit);
      if (this.hp <= 0 && !this.dead) this.die(G, fromAng);
      return { deflected, dmg };
    }
    die(G, fromAng) {
      // OVERLORD phase 2 — splits into a Light and a Dark form you must both defeat
      if (this.def.overlord && !G._split) {
        G._split = true; this.dead = true; G.onZombieKilled(this);
        G.particles.explosion(this.x, this.y, 90, false); G.particles.shakeBy(10);
        G.particles.light(this.x, this.y, 90, 'rgba(180,120,255,0.8)', 0.5);
        G.zombies.push(new Zombie(this.x - 52, this.y, 'z_boss_dark', G.hpScale, G.spdScale));
        G.zombies.push(new Zombie(this.x + 52, this.y, 'z_boss_light', G.hpScale, G.spdScale));
        G.ui.waveBanner('PHASE 2', 'LIGHT & DARK — destroy BOTH');
        return;
      }
      this.dead = true;
      G.onZombieKilled(this);
      if (this._goldDeath) {
        for (let i = 0; i < 12; i++) G.particles.spark(this.x, this.y, T.rand(0, T.TAU), 1, T.pick(['#ffe08a', '#f2c14e', '#caa84a']));
        G.particles.addDecal(this.x, this.y, T.rand(6, 10), 'rgba(200,160,40,0.6)');
        G.particles.light(this.x, this.y, 32, 'rgba(255,210,90,0.8)', 0.3);
        G.particles.floatText(this.x, this.y - this.def.r - 4, 'GOLD!', '#ffd24a', true);
      } else {
        G.particles.gib(this.x, this.y, this.def.big ? 12 : 6);
      }
      G.particles.floatText(this.x, this.y - this.def.r, '+$' + this.def.cash, '#f2c14e');
      if (this.def.burst) { // bloater toxic cloud
        G.addHazard(this.x, this.y, 46, 4, 'toxic');
        G.particles.explosion(this.x, this.y, 46, false);
        G.particles.smoke(this.x, this.y, 10, 'rgba(120,160,60,0.5)');
      }
    }
    update(dt, G) {
      this.animPhase += dt * (4 + this.spd * 0.03);
      if (this.hurtFlash > 0) this.hurtFlash -= dt;
      if (this.parrying > 0) this.parrying -= dt;
      // status
      let spdMul = 1;
      if (this.slowT > 0) { this.slowT -= dt; spdMul *= 0.45; }
      if (this.burnT > 0) {
        this.burnT -= dt; this.burnTick -= dt;
        if (this.burnTick <= 0) { this.burnTick = 0.4; this.takeDamage(7, T.rand(0, T.TAU), G, { ap: true }); G.particles.fire(this.x, this.y, 1); }
        if (this.dead) return;
      }
      // knockback decay
      this.x += this.kbx * dt; this.y += this.kby * dt;
      this.kbx *= 0.82; this.kby *= 0.82;

      const p = G.player;
      const ang = T.angle(this.x, this.y, p.x, p.y);
      this.angle = ang;
      const dToP = T.dist(this.x, this.y, p.x, p.y);

      if (this.rootT > 0) { this.rootT -= dt; }
      else {
        let mvA = ang, move = this.spd * spdMul;
        // behaviors
        if (this.def.behavior === 'kite') {
          if (dToP < 160) mvA = ang + Math.PI;     // back away
          else if (dToP < 260) move = 0;            // hold & spit
          this.rangeCd -= dt;
          if (this.rangeCd <= 0 && dToP < 320) {
            this.rangeCd = 2.4;
            G.bullets.push(new Bullet(this.x, this.y, ang, { spd: this.def.projSpd, dmg: this.def.ranged, bullet: 'flame', range: 360 }, { owner: 'zombie', dmg: this.def.ranged }));
            G.particles.acid(this.x + Math.cos(ang) * this.def.r, this.y + Math.sin(ang) * this.def.r, 3);
          }
        } else if (this.def.behavior === 'support') {
          if (dToP < 220) mvA = ang + Math.PI * 0.8;
          this.summonCd -= dt;
          if (this.summonCd <= 0) {
            this.summonCd = 7;
            G.screamBuff(this);
            for (let i = 0; i < 2; i++) { const a = T.rand(0, T.TAU); G.spawnAt(this.x + Math.cos(a) * 40, this.y + Math.sin(a) * 40, 'z_walker'); }
            G.particles.light(this.x, this.y, 60, 'rgba(180,60,120,0.5)', 0.4);
            T.Audio.scream();
          }
        } else if (this.def.behavior === 'lunge') {
          if (dToP < 130 && this.atkCd <= 0) move = this.spd * 1.8; // lunge speed
        }
        // separation from other zombies (light)
        let sepx = 0, sepy = 0;
        const zs = G.zombies;
        for (let i = 0; i < zs.length; i++) {
          const o = zs[i]; if (o === this || o.dead) continue;
          const dd = T.dist2(this.x, this.y, o.x, o.y), rr = (this.def.r + o.def.r);
          if (dd < rr * rr && dd > 0.01) { const d = Math.sqrt(dd); sepx += (this.x - o.x) / d; sepy += (this.y - o.y) / d; }
        }
        this.x += (Math.cos(mvA) * move + sepx * 18) * dt;
        this.y += (Math.sin(mvA) * move + sepy * 18) * dt;
      }
      // clamp arena
      this.x = T.clamp(this.x, 8, G.arena.w - 8); this.y = T.clamp(this.y, 8, G.arena.h - 8);

      // attack player on contact
      if (this.atkCd > 0) this.atkCd -= dt;
      if (this.def.behavior !== 'kite' && dToP < this.def.r + p.r + 2 && this.atkCd <= 0) {
        this.atkCd = this.def.behavior === 'lunge' ? 1.0 : 0.8;
        p.takeDamage(this.def.dmg, G);
        p.kbx += Math.cos(ang) * 60; p.kby += Math.sin(ang) * 60;
        if (this.def.slam) { G.particles.explosion(p.x, p.y, 40, false); G.particles.shakeBy(6); }
      }
      // boss births
      if (this.def.births) {
        this.summonCd = (this.summonCd || 0) - dt;
        if (this.summonCd <= 0) { this.summonCd = 3.5; for (let i = 0; i < 2; i++) { const a = T.rand(0, T.TAU); G.spawnAt(this.x + Math.cos(a) * 30, this.y + Math.sin(a) * 30, 'z_crawler'); } }
      }
      if (this.def.boss) this.bossTick(dt, G, dToP, ang);
    }
    bossTick(dt, G, dToP, ang) {
      const d = this.def, p = G.player;
      if (d.blink) { // teleport (Shadow / Dark)
        this.blinkCd = (this.blinkCd == null ? T.rand(2, 4) : this.blinkCd) - dt;
        if (this.blinkCd <= 0 && dToP > 130) {
          this.blinkCd = T.rand(3, 5);
          G.particles.smoke(this.x, this.y, 8, 'rgba(40,40,60,0.6)');
          const step = Math.min(dToP - 70, 240);
          this.x = T.clamp(this.x + Math.cos(ang) * step, 16, G.arena.w - 16);
          this.y = T.clamp(this.y + Math.sin(ang) * step, 16, G.arena.h - 16);
          G.particles.light(this.x, this.y, 40, 'rgba(120,140,255,0.5)', 0.3);
        }
      }
      if (d.parry) { // Golden Giant raises its sword and parries all attacks briefly
        this.parryCd = (this.parryCd == null ? T.rand(3, 5) : this.parryCd) - dt;
        if (this.parryCd <= 0 && (this.parrying || 0) <= 0) { this.parryCd = T.rand(5, 8); this.parrying = 1.3; G.particles.light(this.x, this.y, 44, 'rgba(255,220,120,0.6)', 0.4); }
      }
      this.abilityCd = (this.abilityCd == null ? T.rand(3, 5) : this.abilityCd) - dt;
      if (this.abilityCd > 0) return;
      this.abilityCd = T.rand(3.5, 5.5);
      if (d.laser && dToP < 520) { const la = T.angle(this.x, this.y, p.x, p.y); G.bossLaser(this.x + Math.cos(la) * this.def.r, this.y + Math.sin(la) * this.def.r, la, 540, d.dmg * 0.7); }
      if (d.shockwave && dToP < 320) {
        G.addShockwave(this.x, this.y, 175); G.particles.explosion(this.x, this.y, 70, false); G.particles.shakeBy(7);
        if (dToP < 180) { p.takeDamage(d.dmg * 0.6, G); const a2 = T.angle(this.x, this.y, p.x, p.y); p.kbx += Math.cos(a2) * 220; p.kby += Math.sin(a2) * 220; }
      }
      if (d.slash && dToP < 175) {
        G.meleeSlash = { x: this.x, y: this.y, a: ang, arc: 1.2, range: 130, life: 0.18, max: 0.18, gold: d.light, fire: !d.light };
        if (dToP < 145 && Math.abs(T.angleDiff(ang, T.angle(this.x, this.y, p.x, p.y))) < 1.2) p.takeDamage(d.dmg * 0.8, G);
        G.particles.shakeBy(5);
      }
      if (d.summon) {
        const addId = (d.overlord || d.light) ? 'z_purple_elite' : (d.shadow ? 'z_crawler' : 'z_runner');
        for (let i = 0; i < 2; i++) { const a = T.rand(0, T.TAU); G.spawnAt(this.x + Math.cos(a) * 42, this.y + Math.sin(a) * 42, addId); }
        G.particles.light(this.x, this.y, 50, d.light ? 'rgba(255,240,200,0.5)' : 'rgba(160,60,200,0.5)', 0.3);
      }
    }
    draw(ctx) {
      ctx.save();
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath();
      ctx.ellipse(this.x, this.y + this.def.r * 0.5, this.def.r * 0.9, this.def.r * 0.45, 0, 0, T.TAU); ctx.fill();
      ctx.translate(this.x, this.y); ctx.rotate(this.angle);
      T.Sprites.drawZombie(ctx, this);
      ctx.restore();
      // hp bar for tough ones
      if ((this.def.big || this.def.boss || this.def.armored) && this.hp < this.maxHp) {
        const w = this.def.r * 2, hpp = this.hp / this.maxHp;
        ctx.fillStyle = '#000'; ctx.fillRect(this.x - w / 2 - 1, this.y - this.def.r - 6, w + 2, 3);
        ctx.fillStyle = this.def.boss ? '#b51d1d' : '#5fbf52'; ctx.fillRect(this.x - w / 2, this.y - this.def.r - 5, w * hpp, 1);
      }
    }
  }
  T.Zombie = Zombie;

  // ---------------- PLACED TRAP ----------------
  class Trap {
    constructor(x, y, defId) {
      this.x = x; this.y = y; this.def = T.TRAPS[defId]; this.defId = defId;
      this.triggers = this.def.triggers; this.active = true;
      this.tick = 0; this.life = this.def.dur && this.def.dur < 90 ? this.def.dur : Infinity;
      this.fired = false;
    }
    update(dt, G) {
      const t = this.def;
      if (t.effect === 'fire') { // burning pool
        this.life -= dt; if (this.life <= 0) { this.active = false; return; }
        this.tick -= dt; G.particles.fire(this.x + T.rand(-t.r * 0.5, t.r * 0.5), this.y + T.rand(-t.r * 0.4, t.r * 0.4), 1);
        if (this.tick <= 0) { this.tick = 0.3; for (const z of G.zombies) if (!z.dead && T.dist(this.x, this.y, z.x, z.y) < t.r) z.takeDamage(t.dmg, T.angle(this.x, this.y, z.x, z.y), G, { ap: true, fire: true }); }
        return;
      }
      if (t.effect === 'boom') { // claymore proximity
        for (const z of G.zombies) if (!z.dead && T.dist(this.x, this.y, z.x, z.y) < t.r + z.def.r) { this.detonate(G); return; }
        return;
      }
      // area-style (barbed/shock) or step (bear/spike)
      this.tick -= dt;
      const period = (t.effect === 'slow' || t.effect === 'shock') ? 0.4 : 0;
      for (const z of G.zombies) {
        if (z.dead) continue;
        if (T.dist(this.x, this.y, z.x, z.y) < t.r + z.def.r) {
          if (t.effect === 'slow') { z.slowT = 0.6; if (this.tick <= 0) z.takeDamage(t.dmg, 0, G, {}); }
          else if (t.effect === 'shock') { z.slowT = 0.5; if (this.tick <= 0) { z.takeDamage(t.dmg, 0, G, { ap: true }); G.particles.spark(z.x, z.y, T.rand(0, T.TAU), 3, '#9fe8ff'); } }
          else if (t.effect === 'spike') { if (this.tick <= 0) { z.takeDamage(t.dmg, T.angle(this.x, this.y, z.x, z.y), G, {}); this.triggers--; } }
          else if (t.effect === 'root') { z.rootT = Math.max(z.rootT, t.dur); z.takeDamage(t.dmg, T.angle(this.x, this.y, z.x, z.y), G, {}); this.triggers--; if (this.triggers <= 0) { this.active = false; } G.particles.spark(this.x, this.y, 0, 4, '#aaa'); }
        }
      }
      if (this.tick <= 0) this.tick = period || 0.5;
      if (this.triggers <= 0 && t.effect !== 'slow' && t.effect !== 'shock') this.active = false;
    }
    detonate(G) {
      this.active = false;
      G.particles.explosion(this.x, this.y, this.def.aoe || 60, false); T.Audio.explosion();
      for (const z of G.zombies) if (!z.dead && T.dist(this.x, this.y, z.x, z.y) < (this.def.aoe || 60)) z.takeDamage(this.def.dmg, T.angle(this.x, this.y, z.x, z.y), G, { ap: true, kb: 200 });
    }
    draw(ctx) {
      const t = this.def;
      if (t.effect === 'slow' || t.effect === 'shock' || t.effect === 'fire') {
        ctx.fillStyle = t.effect === 'fire' ? 'rgba(220,120,40,0.18)' : (t.effect === 'shock' ? 'rgba(95,198,232,0.16)' : 'rgba(110,111,90,0.18)');
        ctx.beginPath(); ctx.arc(this.x, this.y, t.r, 0, T.TAU); ctx.fill();
      }
      ctx.save(); ctx.translate(this.x, this.y);
      const ic = T.Sprites.icon(this.defId, 16);
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 0.0; ctx.globalAlpha = 1;
      // draw small marker
      ctx.fillStyle = t.color; ctx.fillRect(-3, -3, 6, 6);
      ctx.fillStyle = T.Sprites.shade(t.color, 0.3); ctx.fillRect(-3, -3, 6, 1);
      ctx.fillStyle = '#000'; ctx.fillRect(-3, -3, 6, 6); ctx.globalAlpha = 1;
      ctx.drawImage(ic, -8, -8, 16, 16);
      ctx.restore();
    }
  }
  T.Trap = Trap;

  // ---------------- TURRET ----------------
  class Turret {
    constructor(x, y, defId) { this.x = x; this.y = y; this.def = T.TRAPS[defId]; this.defId = defId; this.life = this.def.dur; this.fireCd = 0; this.angle = 0; this.active = true; }
    update(dt, G) {
      this.life -= dt; if (this.life <= 0) { this.active = false; return; }
      const t = this.def;
      // acquire nearest
      let best = null, bd = t.r * t.r;
      for (const z of G.zombies) { if (z.dead) continue; const d = T.dist2(this.x, this.y, z.x, z.y); if (d < bd) { bd = d; best = z; } }
      if (t.mode === 'slow') {
        for (const z of G.zombies) if (!z.dead && T.dist2(this.x, this.y, z.x, z.y) < t.r * t.r) z.slowT = 0.5;
        return;
      }
      if (best) {
        this.angle = T.angle(this.x, this.y, best.x, best.y);
        this.fireCd -= dt;
        if (this.fireCd <= 0) {
          this.fireCd = 60 / t.rpm;
          if (t.mode === 'flame') {
            for (let i = 0; i < 3; i++) G.bullets.push(new Bullet(this.x, this.y, this.angle + T.rand(-0.2, 0.2), { spd: 320, dmg: t.dmg, bullet: 'flame', range: 150, fire: true }, { owner: 'player', fire: true }));
            T.Audio.flame();
          } else {
            G.bullets.push(new Bullet(this.x, this.y, this.angle + T.rand(-0.05, 0.05), { spd: 760, dmg: t.dmg, bullet: 'round', range: t.r }, { owner: 'player' }));
            G.particles.muzzle(this.x + Math.cos(this.angle) * 6, this.y + Math.sin(this.angle) * 6, this.angle, 0.7);
            T.Audio.shot('SMG');
          }
        }
      }
    }
    draw(ctx) {
      ctx.save(); ctx.translate(this.x, this.y);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 3, 7, 3, 0, 0, T.TAU); ctx.fill();
      ctx.fillStyle = '#33352f'; ctx.fillRect(-5, -3, 10, 9);
      ctx.fillStyle = '#22241e'; ctx.fillRect(-5, 4, 10, 3);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.def.color; ctx.fillRect(2, -1.5, 8, 3);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(9, -1, 2, 2);
      ctx.restore();
      // life ring
      const lp = this.life / this.def.dur;
      ctx.strokeStyle = 'rgba(95,198,232,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(this.x, this.y - 9, 3, -Math.PI / 2, -Math.PI / 2 + T.TAU * lp); ctx.stroke();
    }
  }
  T.Turret = Turret;

  // ---------------- THROWABLE ----------------
  class Throwable {
    constructor(x, y, ang, def) { this.x = x; this.y = y; const spd = 280; this.vx = Math.cos(ang) * spd; this.vy = Math.sin(ang) * spd; this.def = def; this.fuse = def.fuse; this.dead = false; this.spin = 0; }
    update(dt, G) {
      this.x += this.vx * dt; this.y += this.vy * dt; this.vx *= 0.96; this.vy *= 0.96; this.spin += dt * 12;
      this.fuse -= dt;
      if (this.fuse <= 0) {
        this.dead = true;
        if (this.def.fire) { G.addHazard(this.x, this.y, this.def.aoe, 5, 'fire'); G.particles.explosion(this.x, this.y, this.def.aoe, true); }
        else {
          G.particles.explosion(this.x, this.y, this.def.aoe, false); T.Audio.explosion();
          for (const z of G.zombies) if (!z.dead && T.dist(this.x, this.y, z.x, z.y) < this.def.aoe) z.takeDamage(this.def.dmg * (1 - T.dist(this.x, this.y, z.x, z.y) / this.def.aoe * 0.5), T.angle(this.x, this.y, z.x, z.y), G, { ap: true, kb: 220 });
        }
      }
    }
    draw(ctx) { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.spin); ctx.fillStyle = this.def.fire ? '#3a6a2a' : '#3a4a2a'; ctx.fillRect(-2, -3, 4, 6); ctx.fillStyle = '#222'; ctx.fillRect(-1, -4, 2, 2); ctx.restore(); }
  }
  T.Throwable = Throwable;

  // ---------------- HAZARD (lingering fire / toxic) ----------------
  class Hazard {
    constructor(x, y, r, dur, type) { this.x = x; this.y = y; this.r = r; this.life = dur; this.max = dur; this.type = type; this.tick = 0; this.dead = false; }
    update(dt, G) {
      this.life -= dt; if (this.life <= 0) { this.dead = true; return; }
      this.tick -= dt;
      if (this.type === 'fire') G.particles.fire(this.x + T.rand(-this.r * 0.5, this.r * 0.5), this.y + T.rand(-this.r * 0.4, this.r * 0.4), 1);
      else if (T.chance(0.4)) G.particles.smoke(this.x + T.rand(-this.r * 0.4, this.r * 0.4), this.y, 1, 'rgba(120,160,60,0.4)');
      if (this.tick <= 0) {
        this.tick = 0.4;
        for (const z of G.zombies) if (!z.dead && T.dist(this.x, this.y, z.x, z.y) < this.r + z.def.r) z.takeDamage(this.type === 'fire' ? 9 : 6, T.angle(this.x, this.y, z.x, z.y), G, { ap: true, fire: this.type === 'fire' });
        if (this.type === 'toxic' && T.dist(this.x, this.y, G.player.x, G.player.y) < this.r) G.player.takeDamage(5, G);
      }
    }
    draw(ctx) {
      const a = T.clamp(this.life / this.max, 0, 1);
      ctx.globalAlpha = a * 0.5;
      ctx.fillStyle = this.type === 'fire' ? 'rgba(220,110,40,0.4)' : 'rgba(120,170,50,0.4)';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, T.TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  T.Hazard = Hazard;

  // ---------------- PLAYER ----------------
  class Player {
    constructor(x, y) {
      this.x = x; this.y = y; this.r = 7; this.angle = 0;
      this.kbx = 0; this.kby = 0;
      this.walkPhase = 0; this.moving = false; this.recoilKick = 0; this.meleeAnim = 0; this.meleeCd = 0;
      this.fireCd = 0; this.spinup = 0;
      this.reloading = false; this.reloadT = 0;
      this.current = 'primary';
      this.adren = 0;
      this.invuln = 0;
      this.beltIndex = 0;
      this.trapIndex = 0;
      this.charge = null; this.overheat = false; // beam weapons
    }
    // called by game after stats computed; sets stats/gear/ammo
    initFromLoadout(stats, gear, ammo, eq) {
      this.maxHp = stats.maxHp; this.hp = stats.maxHp;
      this.armor = stats.armor; this.baseSpeed = stats.speed;
      this.maxStamina = stats.stamina; this.stamina = stats.stamina;
      this.reloadMul = stats.reloadMul; this.crit = stats.crit; this.meleeMult = stats.meleeMult || 1;
      this.maxShield = stats.shield || 0; this.shield = this.maxShield;
      this.stats = stats; this.gear = gear; this.ammo = ammo; this.eq = eq;
      this.current = eq.primary ? 'primary' : 'secondary';
      this.heldGun = this.curWeaponId();
      this.belt = eq.belt.slice(); this.trapLoadout = eq.trapSlot.slice();
    }
    curWeaponId() { return this.eq[this.current] || this.eq.secondary || this.eq.primary; }
    curWeapon() { const id = this.curWeaponId(); return id ? T.WEAPONS[id] : null; }

    swap(G) {
      const other = this.current === 'primary' ? 'secondary' : 'primary';
      if (this.eq[other]) { this.current = other; this.heldGun = this.curWeaponId(); this.reloading = false; T.Audio.tone(300, 0.05, 'square', 0.08); }
    }
    reload(G) {
      if (this.reloading) return;
      const id = this.curWeaponId(); const w = T.WEAPONS[id]; const am = this.ammo[id];
      if (!w || !am || am.mag >= w._mag || am.reserve <= 0) return;
      this.reloading = true; this.reloadT = w.reload * this.reloadMul; T.Audio.reload();
    }
    finishReload() {
      const id = this.curWeaponId(); const w = T.WEAPONS[id]; const am = this.ammo[id];
      const need = w._mag - am.mag; const take = Math.min(need, am.reserve);
      am.mag += take; am.reserve -= take; this.reloading = false;
    }
    tryFire(G) {
      if (this.reloading || this.fireCd > 0) return;
      const id = this.curWeaponId(); const w = T.WEAPONS[id]; if (!w) return;
      const am = this.ammo[id];
      const inf = G.settings && G.settings.infAmmo;
      if (!inf && am.mag <= 0) { if (!this._dry) { T.Audio.dry(); this._dry = true; } this.reload(G); return; }
      this._dry = false;
      // spin-up
      if (w.spinup) { this.spinup = Math.min(1, this.spinup + 0.1); if (this.spinup < 0.5) { this.fireCd = 0.05; return; } }
      const rof = 60 / w.rpm / (this.adren > 0 ? 1.5 : 1);
      this.fireCd = rof;
      if (!inf) am.mag--;
      // MYTHICAL King Orb — golden lightning storm (no projectile)
      if (w.goldLightning) { this.fireGoldLightning(G, w); this.recoilKick = 2; return; }
      const mx = this.x + Math.cos(this.angle) * (10 + (T.Sprites.gun(id).len)) - Math.sin(this.angle) * 0;
      const my = this.y + Math.sin(this.angle) * (10 + (T.Sprites.gun(id).len));
      const spreadRad = (w._spread * Math.PI / 180);
      const pellets = w.pellets || 1;
      const ap = w._ap, fire = w._fire;
      for (let i = 0; i < pellets; i++) {
        const sp = T.rand(-spreadRad, spreadRad) / 2 + T.rand(-spreadRad, spreadRad) / 2;
        const crit = T.chance(this.crit + (w.crit ? 0.0 : 0)) || (w.crit && T.chance(0.5));
        const dmg = w.dmg * (crit ? (w.crit || 2) : 1) * w._dmgMul;
        G.bullets.push(new Bullet(mx, my, this.angle, w, { spread: sp, dmg, pierce: (w.pierce || 0) + (w._pierce || 0), range: w.range * w._rangeMul, spd: w.spd * w._spdMul, ap, fire, crit, chain: w.chain || 0, owner: 'player' }));
      }
      G.particles.muzzle(mx, my, this.angle, w.fam === 'Shotgun' || w.fam === 'LMG' ? 1.4 : 1);
      if (w.bullet === 'lightning') { G.particles.smoke(mx, my, 3, 'rgba(190,200,210,0.45)'); G.particles.light(mx, my, 26, 'rgba(159,232,255,0.6)', 0.08); }
      this.recoilKick = Math.min(4, w.recoil * 0.6);
      this.kbx -= Math.cos(this.angle) * w.recoil * 0.7; this.kby -= Math.sin(this.angle) * w.recoil * 0.7;
      G.particles.shakeBy(w.recoil * 0.25);
      if (!w._silent) T.Audio.shot(w.fam); else T.Audio.tone(400, 0.04, 'square', 0.05);
      // shell casing
      if (w.fam !== 'Special' || w.bullet === 'round') G.particles.spark(mx - Math.cos(this.angle) * 4, my - Math.sin(this.angle) * 4, this.angle + Math.PI / 2 * (T.chance(.5) ? 1 : -1), 1, '#c8a030');
    }
    fireGoldLightning(G, w) {
      const mx = this.x + Math.cos(this.angle) * 12, my = this.y + Math.sin(this.angle) * 12;
      G.particles.muzzle(mx, my, this.angle, 1.3);
      G.particles.light(this.x, this.y, 50, 'rgba(255,220,120,0.7)', 0.18);
      const range = w.range, n = w.goldLightning || 6;
      const cands = G.zombies.filter(z => !z.dead && T.dist2(this.x, this.y, z.x, z.y) < range * range)
        .sort((a, b) => T.dist2(this.x, this.y, a.x, a.y) - T.dist2(this.x, this.y, b.x, b.y)).slice(0, n);
      if (!cands.length) { G.addArc(mx, my, mx + Math.cos(this.angle) * range, my + Math.sin(this.angle) * range, '#ffe08a'); }
      for (const z of cands) {
        G.addArc(this.x, this.y - 4, z.x, z.y, '#ffe08a');
        z.takeDamage(w.dmg * w._dmgMul, T.angle(this.x, this.y, z.x, z.y), G, { ap: true, crit: T.chance(0.35) });
        G.particles.spark(z.x, z.y, 0, 8, '#ffe08a'); G.particles.light(z.x, z.y, 28, 'rgba(255,220,120,0.7)', 0.16);
      }
      G.particles.shakeBy(5);
      if (!w._silent) T.Audio.explosion();
    }
    updateBeam(G, w, dt) {
      if (this.charge == null) this.charge = w.charge;
      if (T.Input.firing && this.charge > 0 && !this.overheat) {
        this.charge = Math.max(0, this.charge - w.drain * dt);
        if (this.charge <= 0) this.overheat = true;
        G.fireBeam(this, w, dt);
      } else {
        this.charge = Math.min(w.charge, this.charge + w.recharge * dt);
        if (this.charge > w.charge * 0.35) this.overheat = false;
        G.beam = null;
      }
    }
    releaseExcalibur(G, w) {
      const pow = this.exCharge || 0;
      const dmg = (w.chargeDmg || 950) * (0.45 + pow * 0.55) * (this.meleeMult || 1);
      this.kbx += Math.cos(this.angle) * 300 * (0.5 + pow); this.kby += Math.sin(this.angle) * 300 * (0.5 + pow); // the "ram" dash
      const mx = this.x + Math.cos(this.angle) * 14, my = this.y + Math.sin(this.angle) * 14;
      G.bullets.push(new Bullet(mx, my, this.angle, { spd: 720, dmg, bullet: 'excal', range: 640, kb: 240 }, { owner: 'player', pierce: 9999, dmg, gold: true, ap: true, width: 16 + pow * 16 }));
      G.particles.muzzle(mx, my, this.angle, 1.6); G.particles.shakeBy(5 + pow * 4);
      G.meleeSlash = { x: this.x, y: this.y, a: this.angle, arc: w.arc, range: w.range, life: 0.16, max: 0.16, gold: true };
      T.Audio.shot('Sniper'); T.Audio.melee();
    }
    doMelee(G) {
      if (this.meleeCd > 0) return;
      const id = this.eq.melee; if (!id) return; const w = T.WEAPONS[id];
      if (w.chargeMelee) return; // handled by charge/release in update()
      this.meleeCd = w.swing; this.meleeAnim = 1; T.Audio.melee();
      if (w.lunge && Math.hypot(this.kbx, this.kby) < 140) { this.kbx += Math.cos(this.angle) * 320; this.kby += Math.sin(this.angle) * 320; G.particles.shakeBy(3); G.particles.light(this.x, this.y, 36, 'rgba(255,210,90,0.5)', 0.18); }
      let hit = false;
      const rng = w.range * (w.lunge ? 1.1 : 1);
      for (const z of G.zombies) {
        if (z.dead) continue;
        const d = T.dist(this.x, this.y, z.x, z.y);
        if (d < rng + z.def.r) {
          const a = T.angle(this.x, this.y, z.x, z.y);
          if (Math.abs(T.angleDiff(this.angle, a)) < w.arc) {
            z.takeDamage(w.dmg * (this.meleeMult || 1), a, G, { kb: w.kb, crit: T.chance(0.2), gold: w.goldKill, fire: w.fire });
            hit = true;
          }
        }
      }
      if (w.fire) for (let i = 0; i < 6; i++) { const fa = this.angle + T.rand(-w.arc, w.arc); G.particles.fire(this.x + Math.cos(fa) * rng * 0.7, this.y + Math.sin(fa) * rng * 0.7, 1); }
      G.meleeSlash = { x: this.x, y: this.y, a: this.angle, arc: w.arc, range: rng, life: 0.12, max: 0.12, gold: w.goldKill, fire: w.fire };
      if (hit) G.particles.shakeBy(w.lunge ? 4 : 2);
    }
    useConsumable(G) {
      const id = this.belt[this.beltIndex]; if (!id) return;
      const it = T.ITEMS[id]; const inv = G.state.owned.items;
      if (!inv[id] || inv[id] <= 0) { T.Audio.dry(); return; }
      let used = true;
      if (it.kind === 'heal') { if (this.hp >= this.maxHp) { used = false; } else { this.hp = Math.min(this.maxHp, this.hp + it.heal); G.particles.floatText(this.x, this.y - 12, '+' + it.heal, '#5fbf52'); G.particles.light(this.x, this.y, 30, 'rgba(95,191,82,0.5)', 0.3); } }
      else if (it.kind === 'ammo') { for (const wid in this.ammo) { const w = T.WEAPONS[wid]; this.ammo[wid].reserve = w._reserve; } G.particles.floatText(this.x, this.y - 12, 'AMMO', '#f2c14e'); }
      else if (it.kind === 'buff') { this.adren = it.dur; this.hp = Math.min(this.maxHp, this.hp + it.heal); G.particles.floatText(this.x, this.y - 12, 'ADRENALINE', '#e8a33d'); }
      else if (it.kind === 'throw') { G.throwables.push(new Throwable(this.x, this.y, this.angle, it)); }
      else if (it.kind === 'deploy') { G.props.push({ x: this.x + Math.cos(this.angle) * 24, y: this.y + Math.sin(this.angle) * 24, w: 22, h: 10, solid: true, dcol: '#6a5a3a', kind: 'barricade', hp: it.hp }); }
      if (used) { inv[id]--; T.Audio.tone(660, 0.06, 'sine', 0.1); G.ui.updateBelt(); }
    }
    placeTrap(G) {
      const id = this.trapLoadout[this.trapIndex]; if (!id) { T.Audio.dry(); return; }
      const inv = G.state.owned.traps;
      if (!inv[id] || inv[id] <= 0) { T.Audio.dry(); return; }
      const tx = this.x + Math.cos(this.angle) * 22, ty = this.y + Math.sin(this.angle) * 22;
      const def = T.TRAPS[id];
      if (def.effect === 'turret') G.turrets.push(new Turret(tx, ty, id));
      else G.traps.push(new Trap(tx, ty, id));
      inv[id]--; T.Audio.tone(440, 0.06, 'square', 0.1); G.particles.floatText(tx, ty - 8, T.TRAPS[id].name, '#9aa18c'); G.ui.updateBelt();
    }
    takeDamage(amount, G) {
      if (this.invuln > 0) return;
      if (G.settings && G.settings.god) { this.invuln = 0.15; return; }
      const dr = T.clamp(this.armor / (this.armor + 60), 0, 0.8); // armor -> % reduction
      let dmg = Math.max(1, Math.round(amount * (1 - dr)));
      this.invuln = 0.25;
      // golden shield (King Crown / Aztec) — the second bar, absorbs first
      if (this.maxShield > 0 && this.shield > 0) {
        const ab = Math.min(this.shield, dmg); this.shield -= ab; dmg -= ab;
        G.particles.light(this.x, this.y, 26, 'rgba(255,210,90,0.6)', 0.2);
        if (dmg <= 0) { G.particles.floatText(this.x, this.y - 12, 'BLOCKED', '#ffd24a'); G.particles.shakeBy(2); return; }
      }
      this.hp -= dmg;
      G.particles.floatText(this.x, this.y - 12, '-' + dmg, '#ff5a5a');
      G.particles.shakeBy(4); T.Audio.hurt(); G.damageFlash = 0.25;
      if (this.hp <= 0) { this.hp = 0; G.gameOver(); }
    }
    update(dt, G) {
      if (this.invuln > 0) this.invuln -= dt;
      if (this.adren > 0) this.adren -= dt;
      if (this.recoilKick > 0) this.recoilKick = Math.max(0, this.recoilKick - dt * 30);
      if (this.meleeCd > 0) this.meleeCd -= dt;
      if (this.meleeAnim > 0) this.meleeAnim = Math.max(0, this.meleeAnim - dt * 6);
      if (this.fireCd > 0) this.fireCd -= dt;
      if (!T.Input.firing && this.spinup > 0) this.spinup = Math.max(0, this.spinup - dt * 0.6);

      // aim
      this.angle = T.angle(this.x, this.y, G.mouseWorld.x, G.mouseWorld.y);

      // movement
      const mv = T.Input.moveVec();
      const sprint = T.Input.keys['shift'] && this.stamina > 1 && (mv.x || mv.y);
      let spd = this.baseSpeed * (this.adren > 0 ? 1.5 : 1) * (sprint ? 1.5 : 1);
      this.moving = !!(mv.x || mv.y);
      if (sprint) { this.stamina = Math.max(0, this.stamina - dt * 30); } else { this.stamina = Math.min(this.maxStamina, this.stamina + dt * 16); }
      // cap knockback so movement can always overcome it, then decay & settle fast
      const kbMag = Math.hypot(this.kbx, this.kby);
      if (kbMag > 300) { const s = 300 / kbMag; this.kbx *= s; this.kby *= s; }
      let nx = this.x + (mv.x * spd + this.kbx) * dt;
      let ny = this.y + (mv.y * spd + this.kby) * dt;
      this.kbx *= 0.78; this.kby *= 0.78;
      if (Math.abs(this.kbx) < 1) this.kbx = 0;
      if (Math.abs(this.kby) < 1) this.kby = 0;
      if (!isFinite(nx)) nx = this.x;
      if (!isFinite(ny)) ny = this.y;
      // prop collision
      nx = T.clamp(nx, this.r, G.arena.w - this.r); ny = T.clamp(ny, this.r, G.arena.h - this.r);
      if (!G.blocked(nx, this.y, this.r)) this.x = nx;
      if (!G.blocked(this.x, ny, this.r)) this.y = ny;
      if (this.moving) this.walkPhase += dt * (sprint ? 16 : 11);

      // firing (left-click held) — beam weapons use a charge cell instead of ammo
      const cwf = this.curWeapon();
      if (cwf && cwf.beam) this.updateBeam(G, cwf, dt);
      else if (T.Input.firing) this.tryFire(G);
      // Excalibur charge melee: hold right-click to charge, release to ram
      const mw = T.WEAPONS[this.eq.melee];
      if (mw && mw.chargeMelee) {
        if (T.Input.stabbing) {
          this.exCharge = Math.min(1, (this.exCharge || 0) + dt); this.charging = true;
          G.particles.light(this.x, this.y, 16 + this.exCharge * 32, 'rgba(255,220,120,' + (0.25 + this.exCharge * 0.45) + ')', 0.08);
          if (T.chance(0.5)) G.particles.spark(this.x + T.rand(-7, 7), this.y + T.rand(-7, 7), -Math.PI / 2, 1, '#ffe9a8');
        } else {
          if (this.charging && (this.exCharge || 0) > 0.12) this.releaseExcalibur(G, mw);
          this.charging = false; this.exCharge = 0;
        }
      } else this.charging = false;
      // reload finish
      if (this.reloading) { this.reloadT -= dt; if (this.reloadT <= 0) this.finishReload(); }
      // auto-reload when empty mag and not firing
      const id = this.curWeaponId(); const am = this.ammo[id];
      if (am && am.mag <= 0 && !this.reloading && am.reserve > 0) this.reload(G);

      this.heldGun = this.curWeaponId();
    }
    draw(ctx, G) {
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(this.x, this.y + 5, 8, 4, 0, 0, T.TAU); ctx.fill();
      const flip = Math.cos(this.angle) < 0;
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
      // when aiming left, flip vertically so character isn't upside down
      if (flip) ctx.scale(1, -1);
      T.Sprites.drawPlayer(ctx, this);
      ctx.restore();
      if (this.invuln > 0 && Math.floor(this.invuln * 20) % 2 === 0) { ctx.globalAlpha = 0.3; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(this.x, this.y, this.r + 1, 0, T.TAU); ctx.fill(); ctx.globalAlpha = 1; }
      if (this.charging) {
        ctx.strokeStyle = 'rgba(255,220,120,0.95)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(this.x, this.y, 12, -Math.PI / 2, -Math.PI / 2 + T.TAU * (this.exCharge || 0)); ctx.stroke();
        if ((this.exCharge || 0) >= 1) { ctx.fillStyle = 'rgba(255,240,180,0.28)'; ctx.beginPath(); ctx.arc(this.x, this.y, 13, 0, T.TAU); ctx.fill(); }
      }
    }
  }
  T.Player = Player;

  // ---------------- PET / COMPANION ----------------
  class Pet {
    constructor(x, y, id) {
      this.def = T.PETS[id]; this.petId = id;
      this.x = x; this.y = y; this.angle = 0;
      this.animPhase = T.rand(0, 6); this.atk = 0; this.bob = 0; this.fireCd = 0;
    }
    update(dt, G) {
      const d = this.def, p = G.player;
      this.animPhase += dt * (5 + d.spd * 0.02);
      this.bob = Math.sin(performance.now() / 140) * 2;
      if (this.atk > 0) this.atk -= dt;
      // acquire nearest zombie in range
      let best = null, bd = d.range * d.range;
      for (const z of G.zombies) { if (z.dead) continue; const dd = T.dist2(this.x, this.y, z.x, z.y); if (dd < bd) { bd = dd; best = z; } }

      if (d.kind === 'ranged') { // drone: hover by player, auto-fire on target
        const hx = p.x - Math.cos(p.angle) * 22 + Math.sin(p.angle) * 16;
        const hy = p.y - Math.sin(p.angle) * 22 - Math.cos(p.angle) * 16;
        const ha = T.angle(this.x, this.y, hx, hy), hd = T.dist(this.x, this.y, hx, hy);
        if (hd > 6) { this.x += Math.cos(ha) * Math.min(d.spd, hd * 4) * dt; this.y += Math.sin(ha) * Math.min(d.spd, hd * 4) * dt; }
        this.angle = best ? T.angle(this.x, this.y, best.x, best.y) : p.angle;
        if (best) {
          this.fireCd -= dt;
          if (this.fireCd <= 0) {
            this.fireCd = d.atkCd;
            G.bullets.push(new Bullet(this.x, this.y, this.angle + T.rand(-0.04, 0.04), { spd: 820, dmg: d.dmg, bullet: 'round', range: d.range + 60 }, { owner: 'player', dmg: d.dmg }));
            G.particles.muzzle(this.x + Math.cos(this.angle) * 8, this.y + Math.sin(this.angle) * 8, this.angle, 0.6);
            T.Audio.shot('SMG');
          }
        }
        return;
      }

      // melee companion: charge target, else heel near player
      const tx = best ? best.x : p.x, ty = best ? best.y : p.y;
      this.angle = T.angle(this.x, this.y, tx, ty);
      const dToT = T.dist(this.x, this.y, tx, ty);
      let spd = d.spd;
      if (d.leap && best && dToT < 170 && dToT > 30) spd *= 1.7;   // pounce
      if (!best && dToT < 46) spd = 0;                              // idle at heel
      if (spd > 0) { this.x += Math.cos(this.angle) * spd * dt; this.y += Math.sin(this.angle) * spd * dt; }
      this.x = T.clamp(this.x, 8, G.arena.w - 8); this.y = T.clamp(this.y, 8, G.arena.h - 8);
      if (best && dToT < best.def.r + 13 && this.atk <= 0) {
        this.atk = d.atkCd;
        best.takeDamage(d.dmg, this.angle, G, { kb: d.kb || 60, crit: T.chance(0.15) });
        G.particles.blood(best.x, best.y, this.angle, 5);
        if (d.big) G.particles.shakeBy(2);
        T.Audio.melee();
      }
    }
    draw(ctx) {
      const ranged = this.def.kind === 'ranged';
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(this.x, this.y + (ranged ? 9 : this.def.big ? 8 : 6), this.def.big ? 13 : 9, 4, 0, 0, T.TAU); ctx.fill();
      ctx.save();
      ctx.translate(this.x, ranged ? this.y - 8 + this.bob : this.y); ctx.rotate(this.angle);
      T.Sprites.drawPet(ctx, this);
      ctx.restore();
    }
  }
  T.Pet = Pet;

  // ---------------- HUMAN COMPANION / PARTNER ----------------
  class Companion {
    constructor(x, y, id) {
      this.def = T.COMPANIONS[id]; this.compId = id;
      this.x = x; this.y = y; this.angle = 0;
      this.animPhase = T.rand(0, 6); this.cd = T.rand(1.2, 2.4); this.fireCd = 0; this.walk = 0; this.moving = false;
    }
    update(dt, G) {
      const d = this.def, p = G.player;
      this.animPhase += dt * 6;
      const followD = 34 + (d.kind === 'soldier' ? 12 : 0);
      const dToP = T.dist(this.x, this.y, p.x, p.y);
      let best = null, bd = d.range * d.range;
      for (const z of G.zombies) { if (z.dead) continue; const dd = T.dist2(this.x, this.y, z.x, z.y); if (dd < bd) { bd = dd; best = z; } }
      this.moving = false;
      if (dToP > followD) { const a = T.angle(this.x, this.y, p.x, p.y); const sp = Math.min(d.spd, (dToP - followD) * 5); this.x += Math.cos(a) * sp * dt; this.y += Math.sin(a) * sp * dt; this.walk += dt * 11; this.moving = true; }
      this.x = T.clamp(this.x, 8, G.arena.w - 8); this.y = T.clamp(this.y, 8, G.arena.h - 8);
      this.angle = best ? T.angle(this.x, this.y, best.x, best.y) : p.angle;

      if (d.kind === 'medic') {
        this.cd -= dt;
        const needHp = p.hp < p.maxHp, needSh = p.maxShield > 0 && p.shield < p.maxShield;
        if (this.cd <= 0 && (needHp || needSh)) {
          this.cd = d.healCd;
          if (needHp) p.hp = Math.min(p.maxHp, p.hp + d.heal); else p.shield = Math.min(p.maxShield, p.shield + d.heal);
          G.addArc(this.x, this.y - 4, p.x, p.y - 4, '#7fe0a0');
          G.particles.floatText(p.x, p.y - 16, '+' + d.heal, '#5fbf52'); G.particles.light(p.x, p.y, 24, 'rgba(95,200,120,0.5)', 0.2);
        }
      } else if (d.kind === 'engineer') {
        this.cd -= dt;
        if (this.cd <= 0 && G.turrets.length < 4) {
          this.cd = d.buildCd;
          const tid = (p.trapLoadout && p.trapLoadout.find(t => T.TRAPS[t] && T.TRAPS[t].effect === 'turret')) || d.turret;
          const tx = p.x + T.rand(-34, 34), ty = p.y + T.rand(-34, 34);
          G.turrets.push(new Turret(tx, ty, tid)); G.particles.floatText(tx, ty - 8, 'TURRET UP', '#caa84a');
        }
      } else if (d.kind === 'soldier' && best) {
        this.fireCd -= dt;
        if (this.fireCd <= 0) {
          this.fireCd = d.atkCd;
          G.bullets.push(new Bullet(this.x, this.y - 4, this.angle + T.rand(-0.05, 0.05), { spd: 900, dmg: d.dmg, bullet: 'round', range: d.range + 60 }, { owner: 'player', dmg: d.dmg }));
          G.particles.muzzle(this.x + Math.cos(this.angle) * 8, this.y - 4 + Math.sin(this.angle) * 8, this.angle, 0.7);
          T.Audio.shot('Rifle');
        }
      }
    }
    draw(ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(this.x, this.y + 6, 6, 3, 0, 0, T.TAU); ctx.fill();
      T.Sprites.drawCompanion(ctx, this);
    }
  }
  T.Companion = Companion;

})(window.TAC);

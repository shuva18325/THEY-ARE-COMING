/* ===== THEY ARE COMING — UI (menu, shop, loadout, HUD) ===== */
(function (T) {
  'use strict';
  const $ = T.$, el = T.el;

  class UI {
    constructor(G) {
      this.G = G;
      this.activeSlot = 'primary';
      this.invFilter = 'all';
      this.shopCat = 'Rifle';
      this.shopSel = null;
      this.daveSeen = false;
      this.daveTimer = null;
      this.daveEye = 0;
      this.TALK = {
        medic: ["Hold still — you've got bites everywhere.", "I trained for ERs, not the end of the world. But I'm not going anywhere.", "Stay close and I'll keep you breathing.", "We make a good team out there, you know."],
        engineer: ["Give me a toolbox and I'll fortify anything.", "Those turrets won't build themselves. Oh wait — they will.", "Cover me while I work, yeah?"],
        soldier: ["Point me at the horde.", "Ammo's holding. For now.", "I've seen worse. Not much worse. But worse."],
      };
      this.FLIRT = {
        medic: ["...You're sweet, under all that blood. Maybe when this is over.", "Careful — a girl could get ideas.", "If we make it out of this... I'd like that. I'd like that a lot. ♥", "Stop making me blush in the middle of an apocalypse!"],
      };
      this.bind();
    }

    show(screen) {
      ['menu', 'hub', 'hud', 'wavecomplete', 'gameover'].forEach(s => {
        const e = document.getElementById(s);
        if (!e) return;
        e.classList.toggle('active', s === screen || (screen === 'hud' && s === 'hud'));
      });
      // overlays handled separately
    }
    showScreen(name) {
      ['#menu', '#hub', '#hud', '#wavecomplete', '#gameover', '#ending', '#squad'].forEach(s => $(s).classList.remove('active'));
      const map = { menu: '#menu', hub: '#hub', hud: '#hud', wavecomplete: '#wavecomplete', gameover: '#gameover', ending: '#ending' };
      $(map[name]).classList.add('active');
    }

    // ---------------- SQUAD / TALK / ROMANCE ----------------
    openSquad() { this.renderSquadList(); $('#squad').classList.add('active'); }
    squadGreet(cid) {
      if (cid !== 'comp_medic') return '“Ready when you are.”';
      const L = this.G.state.love;
      if (L.married) return '“My partner. My everything. Let\'s make it home together. ♥”';
      if (L.intimate) return '“…last night was real, wasn\'t it? Stay close to me out there.”';
      if (L.kissed) return '“I keep thinking about that kiss, you know. Don\'t you dare die.”';
      if (L.pts >= 40) return '“Good to see you back on the bus in one piece, handsome.”';
      return '“Oh — hey. Didn\'t expect company back here.”';
    }
    renderSquadList() {
      const wrap = $('#squadList'); wrap.innerHTML = '';
      const active = (this.G.state.equipped.companions || []);
      if (!active.length) { wrap.innerHTML = '<p class="dim" style="max-width:480px;margin:0 auto 12px">No partners aboard. Buy a Medic, Engineer, or Soldier in the shop (<b>Companions</b> tab) and equip them — then come back to talk between waves.</p>'; return; }
      active.forEach(cid => {
        const c = T.COMPANIONS[cid];
        const row = el('div', 'squad-row');
        const pic = T.Sprites.icon(cid, 60); pic.className = 'squad-portrait'; row.appendChild(pic);
        const info = el('div', 'squad-info');
        let extra = '';
        if (cid === 'comp_medic') {
          const L = this.G.state.love, f = Math.round(L.pts / 20);
          const status = L.married ? 'Married 💍' : (L.intimate ? 'Together 🌙' : (L.kissed ? 'Dating ♥' : (L.pts >= 40 ? 'Close' : 'New aboard')));
          extra = `<div class="hearts">${'♥'.repeat(f)}${'♡'.repeat(5 - f)} <span class="love-status">${status}</span></div><div class="love-bar"><div class="love-fill" style="width:${L.pts}%"></div></div>`;
        }
        info.innerHTML = `<div class="squad-name">${c.name}</div><div class="ctype">${c.role}</div>${extra}<div class="squad-line" id="line_${cid}">${this.squadGreet(cid)}</div>`;
        const btns = el('div', 'squad-btns');
        const mk = (label, fn) => { const b = el('button', 'btn', label); b.onclick = fn; btns.appendChild(b); };
        mk('Talk', () => this.squadTalk(cid, 'talk'));
        if (c.romance) {
          const L = this.G.state.love;
          mk('♥ Flirt', () => this.squadTalk(cid, 'flirt'));
          if (L.pts >= 50 && !L.kissed) mk('💋 Kiss', () => this.squadMilestone('kiss'));
          if (L.kissed && !L.intimate) mk('🍑 Fun Time', () => this.squadMilestone('intimate')); // unlocks once dating
          if (L.pts >= 100 && !L.married) mk('💍 Propose', () => this.squadMilestone('marry'));
        }
        info.appendChild(btns); row.appendChild(info); wrap.appendChild(row);
      });
    }
    squadTalk(cid, kind) {
      const c = T.COMPANIONS[cid];
      let line;
      if (kind === 'flirt' && c.romance) {
        const L = this.G.state.love; L.flirts = (L.flirts || 0) + 1; L.pts = Math.min(100, L.pts + 3);
        line = T.pick(this.FLIRT[c.kind] || ['…']);
      } else line = T.pick(this.TALK[c.kind] || ['…']);
      this.renderSquadList();
      const ln = $('#line_' + cid); if (ln) ln.textContent = '“' + line + '”';
      T.Audio.tone(kind === 'flirt' ? 560 : 420, 0.06, 'sine', 0.08);
    }
    squadMilestone(kind) {
      const L = this.G.state.love; let line;
      if (kind === 'kiss') { L.kissed = true; L.pts = Math.min(100, L.pts + 8); line = 'You lean across the bus seat and kiss her. She smiles against your lips. “…About time, soldier.” ♥'; }
      else if (kind === 'intimate') { L.intimate = true; L.pts = 100; line = 'You two slip behind the curtain at the back of the bus. Dave cranks the radio up and stares VERY hard at the road. 🍑🌙  …(some things are best left off-screen).'; }
      else if (kind === 'marry') { L.married = true; L.pts = 100; line = 'You propose right there in the aisle. Dave slams the horn in celebration. “YES — a thousand times yes!” 💍'; }
      this.renderSquadList();
      const ln = $('#line_comp_medic'); if (ln) ln.textContent = '“' + line + '”';
      T.Audio.coin();
    }
    showEnding() {
      const G = this.G, eq = G.state.equipped;
      const medic = (eq.companions || []).includes('comp_medic');
      const L = G.state.love, w = G.wave - 1; let title, text, romant = false;
      if (medic && L.married && L.intimate) { romant = true; title = '♥ HAPPILY EVER AFTER'; text = `You and the medic step off Dave's bus for the last time into a quieter dawn. You marry, build a little house behind the safe-zone wall, and — years later, in a world finally free of the dead — raise the children you started a family for on that bus. They'll know the horde only as a bedtime story. Wave ${w} cleared. You won at life.`; }
      else if (medic && L.married) { romant = true; title = '💍 TWO SURVIVORS, ONE VOW'; text = `You and the medic marry in the first safe town the bus reaches. The road was hell, but you walk it together now — and maybe, someday soon, a family of your own. Wave ${w} cleared.`; }
      else if (medic && (L.kissed || L.pts >= 50)) { romant = true; title = 'A QUIET PEACE'; text = `You and the medic find a fortified town and stay. It isn't quite "ever after" yet — but it's warm, it's safe, and after Wave ${w}, that's everything. Maybe, in time. ♥`; }
      else if (medic || L.pts > 0) { title = 'THE LONG ROAD'; text = `You hang up your weapons and drift between settlements. The medic waves from the bus window as Dave drives on without you. Some bonds don't survive the apocalypse. Wave ${w} — and you live to wonder what might have been.`; }
      else { title = 'THE LONE WANDERER'; text = `No partners, no ties — just you and the long grey road. You step off the bus alone, a legend nobody will believe. Wave ${w} cleared. The end… for now.`; }
      $('#endTitle').textContent = title; $('#endText').textContent = text;
      const c = $('#endArt'), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
      x.save(); x.translate(romant ? 42 : 65, 92); x.scale(2.2, 2.2); T.Sprites.drawPlayerPortrait(x, G.gearColors(), eq.primary || eq.secondary); x.restore();
      if (romant) {
        x.save(); x.translate(92, 60); x.scale(1.5, 1.5); T.Sprites.drawMedicPortrait(x); x.restore();
        x.fillStyle = '#ff5a8a'; x.font = 'bold 18px monospace'; x.fillText('♥', 62, 40);
      }
      this.showScreen('ending');
    }

    bind() {
      const G = this.G;
      $('#btnStart').onclick = () => { T.Audio.unlock(); T.Audio.buy(); G.toHub(); };
      $('#btnHowto').onclick = () => { $('#howto').classList.toggle('hidden'); $('#settings').classList.add('hidden'); };
      $('#btnSettings').onclick = () => { $('#settings').classList.toggle('hidden'); $('#howto').classList.add('hidden'); this.renderSettings(); };
      $('#btnDeploy').onclick = () => { T.Audio.buy(); this.daveComment('deploy'); this.daveAnimStop(); setTimeout(() => G.deploy(), 650); };
      $('#btnContinue').onclick = () => { T.Audio.buy(); G.toHub(); };
      $('#btnRestart').onclick = () => { T.Audio.buy(); G.restart(); };
      $('#btnSquad').onclick = () => { T.Audio.tone(440, 0.05, 'sine', 0.08); this.openSquad(); };
      $('#btnSquadClose').onclick = () => { $('#squad').classList.remove('active'); };
      $('#btnSettle').onclick = () => { T.Audio.buy(); this.showEnding(); };
      $('#btnEndRestart').onclick = () => { T.Audio.buy(); G.restart(); };

      T.$$('.tab').forEach(t => t.onclick = () => {
        T.$$('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        T.$$('.tab-panel').forEach(p => p.classList.remove('active'));
        $('#tab-' + t.dataset.tab).classList.add('active');
        T.Audio.tone(300, 0.04, 'square', 0.06);
        if (t.dataset.tab === 'shop') this.renderShop();
        else this.renderLoadout();
      });
    }

    // ---------------- HUB ----------------
    renderHub() {
      const G = this.G;
      $('#hubWave').textContent = G.wave;
      $('#hubCash').textContent = T.fmt(G.state.cash);
      $('#hubSalvage').textContent = G.state.salvage;
      this.renderLoadout();
      this.renderShop();
      this.renderCheats();
    }

    // ---------------- SETTINGS & CHEATS ----------------
    renderSettings() {
      const s = this.G.settings, wrap = $('#settingsList'); if (!wrap) return; wrap.innerHTML = '';
      // starting cash cycle
      const opts = [900, 10000, 100000, 999999];
      const cashRow = el('div', 'set-row');
      cashRow.innerHTML = `<div class="lbl">Starting Cash<small>applied when you start a New Game</small></div>`;
      const cb = el('button', 'set-btn on', '$' + T.fmt(s.startCash));
      cb.onclick = () => { s.startCash = opts[(opts.indexOf(s.startCash) + 1) % opts.length]; cb.textContent = '$' + T.fmt(s.startCash); T.Audio.tone(500, 0.05, 'square', 0.08); };
      cashRow.appendChild(cb); wrap.appendChild(cashRow);
      const toggle = (key, label, sub) => {
        const row = el('div', 'set-row cheaty');
        row.innerHTML = `<div class="lbl">${label}<small>${sub || ''}</small></div>`;
        const b = el('button', 'set-btn ' + (s[key] ? 'on' : 'off'), s[key] ? 'ON' : 'OFF');
        b.onclick = () => { s[key] = !s[key]; T.Audio.tone(s[key] ? 660 : 300, 0.05, 'square', 0.08); this.renderSettings(); };
        row.appendChild(b); wrap.appendChild(row);
      };
      toggle('cheats', '😈 Enable Cheats', 'shows a cheat bar in the hub');
      toggle('god', 'God Mode', 'you take no damage');
      toggle('infAmmo', 'Infinite Ammo', 'never run dry, never reload');
      toggle('oneShot', 'One-Shot Kills', 'every hit kills instantly');
    }

    renderCheats() {
      const bar = $('#cheatBar'); if (!bar) return;
      if (!this.G.settings.cheats) { bar.classList.add('hidden'); bar.innerHTML = ''; return; }
      bar.classList.remove('hidden'); bar.innerHTML = '';
      bar.appendChild(el('span', 'ctitle', '😈 CHEATS'));
      const btn = (label, fn) => { const b = el('button', 'cheat-btn', label); b.onclick = fn; bar.appendChild(b); };
      btn('+ $10,000', () => this.G.cheat('money'));
      btn('+ 50 ◆ Salvage', () => this.G.cheat('salvage'));
      btn('Unlock EVERYTHING', () => this.G.cheat('unlock'));
      btn('Skip +1 Wave', () => this.G.cheat('wave'));
      const tg = (key, label) => { const b = el('button', 'cheat-btn toggle ' + (this.G.settings[key] ? 'on' : ''), label + (this.G.settings[key] ? ' ✓' : '')); b.onclick = () => { this.G.settings[key] = !this.G.settings[key]; this.renderCheats(); }; bar.appendChild(b); };
      tg('god', 'God'); tg('infAmmo', 'Inf Ammo'); tg('oneShot', '1-Shot');
    }

    // ---------------- CRAZY DAVE (shop merchant) ----------------
    renderDavePortrait(blink) {
      const c = $('#davePortrait'); if (!c) return; const x = c.getContext('2d');
      x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
      x.save(); x.translate(c.width / 2, c.height / 2 + 8); x.scale(2.0, 2.0);
      T.Sprites.drawDavePortrait(x, 0, this.daveEye, blink);
      x.restore();
    }
    daveAnimStart() {
      this.daveAnimStop();
      this.daveTimer = setInterval(() => {
        this.daveEye = T.pick([-1, 0, 0, 1, 0]);
        const blink = T.chance(0.2);
        this.renderDavePortrait(blink);
        if (blink) setTimeout(() => this.renderDavePortrait(false), 130);
      }, 650);
    }
    daveAnimStop() { if (this.daveTimer) { clearInterval(this.daveTimer); this.daveTimer = null; } }
    daveReplyPool() {
      const pool = T.DAVE.replies.slice();
      for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[pool[i], pool[j]] = [pool[j], pool[i]]; }
      return pool.slice(0, 3);
    }
    daveSay(line, replies) {
      const ln = $('#daveLine'); if (!ln) return;
      ln.textContent = '“' + line + '”';
      const rw = $('#daveReplies'); rw.innerHTML = '';
      (replies || this.daveReplyPool()).forEach(rp => {
        const b = el('button', 'dave-reply', rp.t);
        b.onclick = () => { T.Audio.tone(300, 0.04, 'square', 0.06); this.daveSay(rp.r, this.daveReplyPool()); };
        rw.appendChild(b);
      });
      this.renderDavePortrait(false);
      T.Audio.tone(210 + Math.random() * 90, 0.05, 'square', 0.05);
    }
    daveGreet() {
      const ctx = this.daveSeen ? 'return' : 'enter';
      this.daveSeen = true;
      const n = Math.max(1, this.G.wave - 1);
      const line = T.pick(T.DAVE[ctx]).replace('{n}', n);
      this.daveSay(line, this.daveReplyPool());
      this.daveAnimStart();
    }
    daveComment(kind) { if (T.DAVE[kind]) this.daveSay(T.pick(T.DAVE[kind]), this.daveReplyPool()); }

    // ---------------- LOADOUT ----------------
    renderLoadout() {
      this.renderCharPreview();
      this.renderEquipSlots();
      this.renderAttachments();
      this.renderInventory();
      this.renderCharStats();
    }

    renderCharPreview() {
      const c = $('#charPreview'); const x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      x.clearRect(0, 0, c.width, c.height);
      // floor pad
      x.fillStyle = '#171c14'; x.beginPath(); x.ellipse(c.width / 2, 250, 62, 13, 0, 0, T.TAU); x.fill();
      const gear = this.G.gearColors();
      const eq = this.G.state.equipped;
      x.save();
      x.translate(c.width / 2, 150);
      x.scale(4.4, 4.4);
      T.Sprites.drawPlayerPortrait(x, gear, eq.primary || eq.secondary);
      x.restore();
      // equipped companion stands beside the operative
      if (eq.pet && T.PETS[eq.pet]) {
        x.save();
        x.translate(c.width / 2 + 56, 226);
        x.scale(2.5, 2.5); x.rotate(Math.PI);
        T.Sprites.drawPet(x, { def: T.PETS[eq.pet], animPhase: 1, bob: 0 });
        x.restore();
      }
      (eq.companions || []).slice(0, 2).forEach((cid, i) => {
        x.save(); x.translate(30 + i * 30, 236); x.scale(2.1, 2.1);
        T.Sprites.drawCompanion(x, { def: T.COMPANIONS[cid], x: 0, y: 0, walk: 0, moving: false, angle: 0 });
        x.restore();
      });
    }

    renderEquipSlots() {
      const wrap = $('#equipSlots'); wrap.innerHTML = '';
      const eq = this.G.state.equipped;
      const slots = [
        ['primary', 'Primary'], ['secondary', 'Secondary'], ['melee', 'Melee'],
        ['helmet', 'Helmet'], ['chest', 'Chest/Jacket'], ['legs', 'Leggings'],
        ['boots', 'Boots'], ['gloves', 'Gloves'], ['backpack', 'Backpack'],
        ['pet', 'Pet / K-9'],
      ];
      slots.forEach(([key, label]) => {
        const id = eq[key];
        const def = id ? T.lookup(id) : null;
        const card = el('div', 'slot' + (id ? '' : ' empty') + (this.activeSlot === key ? ' active' : ''));
        card.innerHTML = `<div class="slot-label">${label}</div><div class="slot-item">${def ? def.name : '— empty —'}</div>`;
        if (id) { const ic = T.Sprites.icon(id, 22); card.appendChild(ic); }
        card.onclick = () => { this.activeSlot = key; this.invFilter = this.filterForSlot(key); this.renderLoadout(); T.Audio.tone(360, 0.03, 'square', 0.05); };
        wrap.appendChild(card);
      });
      // human partner slots (up to 2)
      eq.companions = eq.companions || [];
      for (let i = 0; i < 2; i++) {
        const cid = eq.companions[i];
        const cdef = cid ? T.COMPANIONS[cid] : null;
        const card = el('div', 'slot' + (cid ? '' : ' empty'));
        card.innerHTML = `<div class="slot-label">Partner ${i + 1}</div><div class="slot-item">${cdef ? cdef.name : '— empty —'}</div>`;
        if (cid) card.appendChild(T.Sprites.icon(cid, 22));
        card.onclick = () => { if (cid) eq.companions.splice(i, 1); else this.invFilter = 'companion'; this.renderLoadout(); T.Audio.tone(360, 0.03, 'square', 0.05); };
        wrap.appendChild(card);
      }
      // trap + consumable load slots
      const stats = this.G.computeStats();
      const trapRow = el('div', 'slot-label', `TRAP SLOTS (${eq.trapSlot.length}/${stats.trapSlots}) — click traps in inventory`);
      trapRow.style.marginTop = '8px'; trapRow.style.gridColumn = '1/-1'; wrap.appendChild(trapRow);
      const beltRow = el('div', 'slot-label', `CONSUMABLE BELT (${eq.belt.length}/${stats.beltSlots})`);
      beltRow.style.gridColumn = '1/-1'; wrap.appendChild(beltRow);
    }

    filterForSlot(key) {
      if (['primary', 'secondary', 'melee'].includes(key)) return 'weapon';
      if (key === 'pet') return 'pet';
      return 'armor';
    }

    renderAttachments() {
      const wrap = $('#attachSlots'); wrap.innerHTML = '';
      const eq = this.G.state.equipped;
      const wid = ['primary', 'secondary'].includes(this.activeSlot) ? eq[this.activeSlot] : (eq.primary || eq.secondary);
      if (!wid || !T.WEAPONS[wid]) { wrap.innerHTML = '<div class="dim" style="font-size:11px">Select a Primary/Secondary weapon slot.</div>'; return; }
      const w = T.WEAPONS[wid];
      const unlocked = this.G.state.owned.attachUnlocked || [];
      const equippedAtt = (this.G.state.owned.attach[wid] = this.G.state.owned.attach[wid] || []);
      const cap = 2;
      const head = el('div', 'dim'); head.style.gridColumn = '1/-1'; head.style.fontSize = '10px';
      head.textContent = `${w.name} — ${equippedAtt.length}/${cap} attached`;
      wrap.appendChild(head);
      if (!unlocked.length) { const d = el('div', 'dim', 'Buy attachments in the Shop (◆ salvage).'); d.style.gridColumn = '1/-1'; d.style.fontSize = '10px'; wrap.appendChild(d); return; }
      unlocked.forEach(aid => {
        const a = T.ATTACHMENTS[aid];
        const on = equippedAtt.includes(aid);
        const card = el('div', 'slot' + (on ? ' active' : ''));
        card.innerHTML = `<div class="slot-label">${on ? '● ON' : '○ off'}</div><div class="slot-item">${a.name}</div>`;
        card.onclick = () => {
          if (on) equippedAtt.splice(equippedAtt.indexOf(aid), 1);
          else { if (equippedAtt.length >= cap) { T.Audio.dry(); return; } equippedAtt.push(aid); }
          T.Audio.tone(420, 0.04, 'square', 0.06); this.renderLoadout();
        };
        wrap.appendChild(card);
      });
    }

    renderInventory() {
      const wrap = $('#inventory'); wrap.innerHTML = '';
      const fwrap = $('#invFilters'); fwrap.innerHTML = '';
      const filters = [['all', 'All'], ['weapon', 'Weapons'], ['armor', 'Armor'], ['pet', 'Pets'], ['companion', 'Partners'], ['trap', 'Traps'], ['item', 'Consumables'], ['attach', 'Attach']];
      filters.forEach(([k, lbl]) => {
        const b = el('button', 'fbtn' + (this.invFilter === k ? ' active' : ''), lbl);
        b.onclick = () => { this.invFilter = k; this.renderInventory(); };
        fwrap.appendChild(b);
      });
      const owned = this.G.state.owned;
      const list = [];
      if (this.invFilter === 'all' || this.invFilter === 'weapon') owned.weapons.forEach(id => list.push({ id, kind: 'weapon' }));
      if (this.invFilter === 'all' || this.invFilter === 'armor') owned.armor.forEach(id => list.push({ id, kind: 'armor' }));
      if (this.invFilter === 'all' || this.invFilter === 'trap') for (const id in owned.traps) if (owned.traps[id] > 0) list.push({ id, kind: 'trap', qty: owned.traps[id] });
      if (this.invFilter === 'all' || this.invFilter === 'item') for (const id in owned.items) if (owned.items[id] > 0) list.push({ id, kind: 'item', qty: owned.items[id] });
      if (this.invFilter === 'all' || this.invFilter === 'pet') (owned.pets || []).forEach(id => list.push({ id, kind: 'pet' }));
      if (this.invFilter === 'all' || this.invFilter === 'companion') (owned.companions || []).forEach(id => list.push({ id, kind: 'companion' }));
      if (this.invFilter === 'attach') (owned.attachUnlocked || []).forEach(id => list.push({ id, kind: 'attach' }));

      list.forEach(({ id, kind, qty }) => {
        const def = T.lookup(id);
        const r = def.rarity || 'common';
        const card = el('div', 'card r-' + r + (this.isEquipped(id, kind) ? ' equipped' : ''));
        const ic = T.Sprites.icon(id, 34);
        card.appendChild(ic);
        const info = el('div', 'ci');
        info.innerHTML = `<div class="cname">${def.name}${qty ? ' ×' + qty : ''}</div><div class="ctype">${this.typeLabel(id, kind)}</div>`;
        card.appendChild(info);
        card.onclick = () => this.equipFromInv(id, kind);
        wrap.appendChild(card);
      });
      if (!list.length) wrap.innerHTML = '<div class="dim" style="font-size:11px;grid-column:1/-1">Nothing here. Visit the Shop.</div>';
    }

    typeLabel(id, kind) {
      if (kind === 'weapon') { const w = T.WEAPONS[id]; return w.fam + ' • ' + w.slot; }
      if (kind === 'armor') return T.ARMOR[id].slot;
      if (kind === 'trap') return 'trap';
      if (kind === 'item') return T.ITEMS[id].kind;
      if (kind === 'pet') return 'companion';
      return 'attachment';
    }

    isEquipped(id, kind) {
      const eq = this.G.state.equipped;
      if (kind === 'weapon') return [eq.primary, eq.secondary, eq.melee].includes(id);
      if (kind === 'armor') { const s = T.ARMOR[id].slot; return eq[s] === id; }
      if (kind === 'trap') return eq.trapSlot.includes(id);
      if (kind === 'item') return eq.belt.includes(id);
      if (kind === 'pet') return eq.pet === id;
      return false;
    }

    equipFromInv(id, kind) {
      const eq = this.G.state.equipped; const stats = this.G.computeStats();
      if (kind === 'weapon') {
        const w = T.WEAPONS[id];
        if (w.slot === 'melee') eq.melee = id;
        else if (w.slot === 'secondary') eq.secondary = id;
        else eq.primary = id;
        this.activeSlot = w.slot === 'melee' ? 'melee' : (w.slot === 'secondary' ? 'secondary' : 'primary');
      } else if (kind === 'armor') {
        eq[T.ARMOR[id].slot] = id;
      } else if (kind === 'trap') {
        const i = eq.trapSlot.indexOf(id);
        if (i >= 0) eq.trapSlot.splice(i, 1);
        else { if (eq.trapSlot.length >= stats.trapSlots) { T.Audio.dry(); return; } eq.trapSlot.push(id); }
      } else if (kind === 'item') {
        const i = eq.belt.indexOf(id);
        if (i >= 0) eq.belt.splice(i, 1);
        else { if (eq.belt.length >= stats.beltSlots) { T.Audio.dry(); return; } eq.belt.push(id); }
      } else if (kind === 'pet') {
        eq.pet = (eq.pet === id) ? null : id; // toggle animal
      } else if (kind === 'companion') {
        eq.companions = eq.companions || [];
        const i = eq.companions.indexOf(id);
        if (i >= 0) eq.companions.splice(i, 1);
        else { if (eq.companions.length >= 2) { T.Audio.dry(); return; } eq.companions.push(id); }
      } else return;
      T.Audio.tone(500, 0.04, 'square', 0.07);
      this.renderLoadout();
    }

    renderCharStats() {
      const s = this.G.computeStats();
      const wrap = $('#charStats'); wrap.innerHTML = '';
      const eq = this.G.state.equipped;
      const pw = eq.primary || eq.secondary;
      let dps = '—';
      if (pw) { const w = T.WEAPONS[pw]; dps = Math.round(w.dmg * (w.pellets || 1) * (w.rpm / 60)); }
      const rows = [
        ['HEALTH', s.maxHp], ['ARMOR', s.armor + ' (' + Math.round(s.armor / (s.armor + 60) * 100) + '% DR)'],
        ['SPEED', Math.round(s.speed)], ['STAMINA', s.stamina],
        ['RELOAD', Math.round((1 / s.reloadMul) * 100) + '%'], ['CRIT', Math.round(s.crit * 100) + '%'],
        ['TRAP SLOTS', s.trapSlots], ['BELT SLOTS', s.beltSlots],
        ['EST. DPS', dps],
      ];
      rows.forEach(([k, v]) => { const r = el('div', 'row'); r.innerHTML = `<span>${k}</span><b>${v}</b>`; wrap.appendChild(r); });
    }

    // ---------------- SHOP ----------------
    renderShop() {
      $('#hubCash').textContent = T.fmt(this.G.state.cash);
      $('#hubSalvage').textContent = this.G.state.salvage;
      const cats = ['Pistol', 'SMG', 'Rifle', 'Shotgun', 'Sniper', 'LMG', 'Melee', 'Special', '★ Mythical', 'Pets', 'Companions', 'Traps', 'Utility', 'Armor', 'Attachments'];
      const cw = $('#shopCats'); cw.innerHTML = '';
      cats.forEach(c => {
        const b = el('button', this.shopCat === c ? 'active' : '', c);
        b.onclick = () => { this.shopCat = c; this.shopSel = null; this.renderShop(); T.Audio.tone(300, 0.03, 'square', 0.05); };
        cw.appendChild(b);
      });
      const items = this.shopItemsFor(this.shopCat);
      const iw = $('#shopItems'); iw.innerHTML = '';
      items.forEach(id => {
        const def = T.lookup(id);
        const r = def.rarity || 'common';
        const owned = this.isOwnedUnique(id);
        const locked = this.isLocked(id);
        const card = el('div', 'card r-' + r + (locked ? ' locked' : ''));
        card.appendChild(T.Sprites.icon(id, 34));
        const cost = def.cost ? def.cost + ' ◆' : '$' + def.price;
        const info = el('div', 'ci');
        info.innerHTML = `<div class="cname">${def.name}</div><div class="ctype">${this.shopTypeLabel(id)}</div>`;
        card.appendChild(info);
        card.appendChild(el('div', 'cprice', owned ? '✓' : (locked ? '🔒 W' + this.lockWave(id) : cost)));
        card.onclick = () => { this.shopSel = id; this.renderShopDetail(); T.Audio.tone(360, 0.03, 'square', 0.05); };
        iw.appendChild(card);
      });
      if (this.shopSel && !items.includes(this.shopSel)) this.shopSel = null;
      this.renderShopDetail();
    }

    shopTypeLabel(id) {
      const k = T.kindOf(id);
      if (k === 'weapon') return T.WEAPONS[id].fam;
      if (k === 'armor') return T.ARMOR[id].slot;
      if (k === 'trap') return 'trap';
      if (k === 'item') return T.ITEMS[id].kind;
      if (k === 'attach') return 'attachment';
      if (k === 'pet') return T.PETS[id].kind === 'ranged' ? 'drone' : 'pet';
      if (k === 'companion') return T.COMPANIONS[id].role;
      return '';
    }

    lockWave(id) {
      if (T.kindOf(id) === 'attach') return 1;
      const d = T.lookup(id);
      return { common: 1, uncommon: 1, rare: 3, epic: 6, legendary: 10, mythical: 1, heavenly: 1 }[d.rarity || 'common'] || 1;
    }
    isLocked(id) { return this.G.wave < this.lockWave(id); }

    shopItemsFor(cat) {
      let ids = [];
      if (['Pistol', 'SMG', 'Rifle', 'Shotgun', 'Sniper', 'LMG', 'Melee', 'Special'].includes(cat)) {
        ids = Object.keys(T.WEAPONS).filter(id => T.WEAPONS[id].fam === cat);
      } else if (cat === '★ Mythical') ids = [...Object.keys(T.WEAPONS), ...Object.keys(T.ARMOR)].filter(id => (T.lookup(id).rarity === 'mythical'));
      else if (cat === 'Pets') ids = Object.keys(T.PETS);
      else if (cat === 'Companions') ids = T.COMPANIONS ? Object.keys(T.COMPANIONS) : [];
      else if (cat === 'Traps') ids = Object.keys(T.TRAPS);
      else if (cat === 'Utility') ids = Object.keys(T.ITEMS);
      else if (cat === 'Armor') ids = Object.keys(T.ARMOR);
      else if (cat === 'Attachments') ids = Object.keys(T.ATTACHMENTS);
      // available first, then by price
      return ids.sort((a, b) => (this.lockWave(a) - this.lockWave(b)) || ((T.lookup(a).price || 0) - (T.lookup(b).price || 0)));
    }

    isOwnedUnique(id) {
      const k = T.kindOf(id), o = this.G.state.owned;
      if (k === 'weapon') return o.weapons.includes(id);
      if (k === 'armor') return o.armor.includes(id);
      if (k === 'attach') return (o.attachUnlocked || []).includes(id);
      if (k === 'pet') return (o.pets || []).includes(id);
      if (k === 'companion') return (o.companions || []).includes(id);
      return false; // traps/items are stackable
    }

    renderShopDetail() {
      const d = $('#shopDetail');
      if (!this.shopSel) { d.innerHTML = '<p class="dim">Select an item to inspect & buy.</p>'; return; }
      const id = this.shopSel, def = T.lookup(id), kind = T.kindOf(id);
      const r = def.rarity || 'common'; const rar = T.RARITY[r] || T.RARITY.common;
      d.innerHTML = '';
      d.appendChild(el('h3', 'r-' + r, def.name + '<br>'));
      const tag = el('span', 'rarity-tag', rar.name); tag.style.background = rar.color; d.appendChild(tag);
      const big = T.Sprites.icon(id, 96); big.className = 'big-preview'; d.appendChild(big);
      d.appendChild(el('div', 'desc', def.desc || ''));
      // stats
      this.statLines(id, kind).forEach(([k, v]) => { const s = el('div', 'stat'); s.innerHTML = `<span>${k}</span><b>${v}</b>`; d.appendChild(s); });
      (def.perks || []).forEach(p => d.appendChild(el('div', 'perk', '◆ ' + p)));
      // buy row
      const owned = this.isOwnedUnique(id);
      const row = el('div', 'buyrow');
      if (owned) row.appendChild(el('span', 'owned-tag', '✓ OWNED'));
      else if (this.isLocked(id)) {
        const b = el('button', 'btn', '🔒 UNLOCKS AT WAVE ' + this.lockWave(id));
        b.disabled = true; b.style.opacity = .5; row.appendChild(b);
      } else {
        const useSalvage = !!def.cost;
        const price = useSalvage ? def.cost : def.price;
        const can = useSalvage ? this.G.state.salvage >= price : this.G.state.cash >= price;
        const btn = el('button', 'btn', `BUY  ${useSalvage ? price + ' ◆' : '$' + T.fmt(price)}`);
        btn.disabled = !can; if (!can) btn.style.opacity = .5;
        btn.onclick = () => this.buy(id);
        row.appendChild(btn);
        if (price === 0) btn.textContent = 'EQUIP (FREE)';
      }
      d.appendChild(row);
    }

    statLines(id, kind) {
      const def = T.lookup(id);
      if (kind === 'weapon') {
        const w = def; const out = [];
        if (w.fam === 'Melee') { out.push(['Damage', w.dmg], ['Range', w.range], ['Swing', w.swing + 's'], ['Knockback', w.kb]); }
        else {
          out.push(['Damage', w.dmg + (w.pellets ? ' ×' + w.pellets : '')], ['Fire Rate', w.rpm + ' rpm'], ['Mag', w.mag], ['Reserve', w.reserve], ['Reload', w.reload + 's'], ['Velocity', w.spd], ['Spread', w.spread + '°'], ['Range', w.range]);
          if (w.pierce) out.push(['Pierce', w.pierce]);
          if (w.crit) out.push(['Crit Mult', '×' + w.crit]);
        }
        return out;
      }
      if (kind === 'armor') {
        const a = def, out = [];
        if (a.armor) out.push(['Armor', '+' + a.armor]);
        if (a.shield) out.push(['Shield', '+' + a.shield + ' (2nd bar)']);
        if (a.hp) out.push(['Health', '+' + a.hp]);
        if (a.melee) out.push(['Melee Dmg', '+' + Math.round(a.melee * 100) + '%']);
        if (a.spd) out.push(['Speed', (a.spd > 0 ? '+' : '') + Math.round(a.spd * 100) + '%']);
        if (a.reload) out.push(['Reload', '+' + Math.round(a.reload * 100) + '%']);
        if (a.crit) out.push(['Crit', '+' + Math.round(a.crit * 100) + '%']);
        if (a.stamina) out.push(['Stamina', '+' + a.stamina]);
        if (a.trapSlots) out.push(['Trap Slots', a.trapSlots]);
        if (a.beltSlots) out.push(['Belt Slots', a.beltSlots]);
        if (a.ammo) out.push(['Ammo', '+' + Math.round(a.ammo * 100) + '%']);
        return out;
      }
      if (kind === 'trap') {
        const t = def, out = [['Damage', t.dmg], ['Radius', t.r]];
        if (t.dur && t.dur < 90) out.push(['Duration', t.dur + 's']);
        if (t.mode) out.push(['Mode', t.mode]);
        return out;
      }
      if (kind === 'item') {
        const it = def, out = [];
        if (it.heal) out.push(['Heal', '+' + it.heal]);
        if (it.dmg) out.push(['Damage', it.dmg]);
        if (it.aoe) out.push(['AoE', it.aoe]);
        if (it.dur) out.push(['Duration', it.dur + 's']);
        if (it.hp) out.push(['Wall HP', it.hp]);
        return out;
      }
      if (kind === 'attach') {
        const a = def, out = [];
        for (const k in (a.mods || {})) out.push([k, (a.mods[k] > 0 ? '+' : '') + Math.round(a.mods[k] * 100) + '%']);
        return out;
      }
      if (kind === 'pet') {
        const p = def;
        return [['Type', p.kind === 'ranged' ? 'Ranged drone' : 'Melee companion'], ['Damage', p.dmg], ['Attack Rate', p.atkCd + 's'], ['Speed', p.spd], ['Aggro Range', p.range]];
      }
      if (kind === 'companion') {
        const c = def, out = [['Role', c.role]];
        if (c.dmg) out.push(['Damage', c.dmg]);
        if (c.heal) out.push(['Heals', '+' + c.heal + ' / ' + c.healCd + 's']);
        if (c.turret) out.push(['Builds', 'Auto-Turrets']);
        out.push(['Speed', c.spd]);
        return out;
      }
      return [];
    }

    buy(id) {
      const G = this.G, def = T.lookup(id), kind = T.kindOf(id), o = G.state.owned;
      const useSalvage = !!def.cost;
      const price = useSalvage ? def.cost : def.price;
      if (useSalvage) { if (G.state.salvage < price) return; G.state.salvage -= price; }
      else { if (G.state.cash < price) return; G.state.cash -= price; }
      if (kind === 'weapon') { if (!o.weapons.includes(id)) o.weapons.push(id); }
      else if (kind === 'armor') { if (!o.armor.includes(id)) o.armor.push(id); }
      else if (kind === 'trap') { o.traps[id] = (o.traps[id] || 0) + 1; }
      else if (kind === 'item') { o.items[id] = (o.items[id] || 0) + 1; }
      else if (kind === 'attach') { o.attachUnlocked = o.attachUnlocked || []; if (!o.attachUnlocked.includes(id)) o.attachUnlocked.push(id); }
      else if (kind === 'pet') { o.pets = o.pets || []; if (!o.pets.includes(id)) o.pets.push(id); }
      else if (kind === 'companion') { o.companions = o.companions || []; if (!o.companions.includes(id)) o.companions.push(id); }
      T.Audio.buy();
      this.daveComment('buy');
      this.renderShop();
      $('#hubCash').textContent = T.fmt(G.state.cash);
      $('#hubSalvage').textContent = G.state.salvage;
    }

    // ---------------- HUD ----------------
    updateHUD() {
      const G = this.G, p = G.player; if (!p) return;
      $('#hud .hud-wave b').textContent = G.wave;
      $('#hudWaveName').textContent = G.env ? '— ' + G.env.name : '';
      $('#hudZleft').textContent = G.zombiesLeft();
      $('#hud .hud-cash b').textContent = T.fmt(G.state.cash);
      $('#hudScore').textContent = T.fmt(G.score);
      // vitals
      $('#hpFill').style.width = T.clamp(p.hp / p.maxHp * 100, 0, 100) + '%';
      $('#hpText').textContent = Math.ceil(p.hp) + '/' + p.maxHp;
      $('#armorFill').style.width = T.clamp(p.armor / 80 * 100, 0, 100) + '%';
      $('#armorText').textContent = 'ARMOR ' + p.armor;
      const sb = $('#shieldBar');
      if (p.maxShield > 0) { sb.style.display = ''; $('#shieldFill').style.width = T.clamp(p.shield / p.maxShield * 100, 0, 100) + '%'; $('#shieldText').textContent = '🛡 ' + Math.ceil(p.shield) + '/' + p.maxShield; }
      else sb.style.display = 'none';
      $('#staFill').style.width = T.clamp(p.stamina / p.maxStamina * 100, 0, 100) + '%';
      // weapon
      const wid = p.curWeaponId(); const w = T.WEAPONS[wid];
      $('#wpnName').textContent = w ? w.name : '—';
      const am = p.ammo[wid];
      const ammoEl = $('#ammo');
      if (p.reloading) { ammoEl.textContent = 'RELOADING'; ammoEl.classList.add('low'); }
      else if (am) { ammoEl.textContent = am.mag + ' / ' + am.reserve; ammoEl.classList.toggle('low', am.mag <= w._mag * 0.25); }
      // gun icon
      const gc = $('#hudGun'); const gx = gc.getContext('2d'); gx.imageSmoothingEnabled = false; gx.clearRect(0, 0, gc.width, gc.height);
      if (wid) { const g = T.Sprites.gun(wid); const sc = Math.min((gc.width - 8) / g.canvas.width, 3); gx.drawImage(g.canvas, (gc.width - g.canvas.width * sc) / 2, (gc.height - g.canvas.height * sc) / 2, g.canvas.width * sc, g.canvas.height * sc); }
    }

    updateBelt() {
      const G = this.G, p = G.player; if (!p) return;
      const wrap = $('#belt'); wrap.innerHTML = '';
      // trap slot indicator
      if (p.trapLoadout && p.trapLoadout.length) {
        const tid = p.trapLoadout[p.trapIndex];
        const cnt = G.state.owned.traps[tid] || 0;
        const b = el('div', 'belt-item' + ' active');
        b.innerHTML = '<span class="key">E</span>';
        b.appendChild(T.Sprites.icon(tid, 28));
        b.appendChild(el('span', 'qty', cnt));
        wrap.appendChild(b);
      }
      p.belt.forEach((id, i) => {
        const cnt = G.state.owned.items[id] || 0;
        const b = el('div', 'belt-item' + (i === p.beltIndex ? ' active' : ''));
        b.innerHTML = `<span class="key">${i + 1}</span>`;
        b.appendChild(T.Sprites.icon(id, 28));
        b.appendChild(el('span', 'qty', cnt));
        b.onclick = () => { p.beltIndex = i; this.updateBelt(); };
        wrap.appendChild(b);
      });
    }

    waveBanner(text, sub) {
      const b = $('#waveBanner');
      b.innerHTML = text + (sub ? `<span class="sub">${sub}</span>` : '');
      b.classList.remove('hidden');
      clearTimeout(this._wb);
      this._wb = setTimeout(() => b.classList.add('hidden'), 2200);
    }

    waveComplete(data) {
      const w = $('#wcStats'); w.innerHTML = '';
      data.forEach(([k, v]) => { const r = el('div', 'row'); r.innerHTML = `<span>${k}</span><b>${v}</b>`; w.appendChild(r); });
      $('#btnSettle').style.display = (this.G.wave > 5) ? '' : 'none';
      this.showScreen('wavecomplete');
    }
    gameOver(data) {
      const w = $('#goStats'); w.innerHTML = '';
      data.forEach(([k, v]) => { const r = el('div', 'row'); r.innerHTML = `<span>${k}</span><b>${v}</b>`; w.appendChild(r); });
      this.showScreen('gameover');
    }
  }

  T.UI = UI;
})(window.TAC);

/* ===== THEY ARE COMING — game data (catalogs) ===== */
(function (T) {
  'use strict';

  // ---------- WEAPONS (24) ----------
  // rpm=rounds/min, spd=projectile px/s, spread=deg, reload=sec
  // bullet: round | slug | bolt | flame | rail | grenade
  T.WEAPONS = {
    // PISTOLS
    pistol_glock:  { name:'Sidearm',        fam:'Pistol',  slot:'secondary', rarity:'common',    price:0,    dmg:22,  rpm:380, spd:760,  spread:3,  mag:17, reserve:120, reload:1.4, bullet:'round', kb:60,  recoil:2, range:520, auto:false, perks:[], desc:'Reliable 9mm. Always in your boot.' },
    pistol_deagle: { name:'Hand Cannon',    fam:'Pistol',  slot:'secondary', rarity:'rare',      price:1400, dmg:72,  rpm:150, spd:840,  spread:2,  mag:7,  reserve:56,  reload:1.8, bullet:'round', kb:180, recoil:6, range:560, auto:false, perks:['Heavy knockback','+50% crit dmg'], desc:'.50 AE hand cannon. Stops a Runner cold.' },
    // SMGs
    smg_uzi:  { name:'Sprayer',  fam:'SMG', slot:'primary', rarity:'common',   price:650,  dmg:15, rpm:950, spd:680, spread:8, mag:32, reserve:256, reload:1.7, bullet:'round', kb:40, recoil:2, range:440, auto:true, perks:[], desc:'Cheap, fast, sprays lead everywhere.' },
    smg_mp5:  { name:'Hornet',   fam:'SMG', slot:'primary', rarity:'uncommon', price:900,  dmg:18, rpm:800, spd:720, spread:5, mag:30, reserve:240, reload:1.6, bullet:'round', kb:45, recoil:2, range:470, auto:true, perks:['Tight spread'], desc:'Controllable burst SMG for the swarm.' },
    smg_p90:  { name:'Cyclone',  fam:'SMG', slot:'primary', rarity:'rare',     price:1700, dmg:20, rpm:900, spd:740, spread:4, mag:50, reserve:300, reload:1.9, bullet:'round', kb:45, recoil:2, range:490, auto:true, perks:['50-round mag'], desc:'High-capacity bullpup. Hose the horde.' },
    // RIFLES
    rifle_m4:   { name:'Ranger',   fam:'Rifle', slot:'primary', rarity:'uncommon', price:1500, dmg:30, rpm:700, spd:880, spread:3, mag:30, reserve:240, reload:1.8, bullet:'round', kb:55, recoil:3, range:640, auto:true, pierce:1, perks:['Pierces 1 zombie'], desc:'Versatile carbine. Punches through bodies.' },
    rifle_ak:   { name:'Reaper',   fam:'Rifle', slot:'primary', rarity:'rare',     price:1900, dmg:38, rpm:600, spd:860, spread:4, mag:30, reserve:240, reload:2.0, bullet:'round', kb:80, recoil:4, range:640, auto:true, pierce:1, perks:['Heavy rounds','Knockback'], desc:'Hard-hitting and brutal. The Reaper collects.' },
    rifle_scar: { name:'Vanguard', fam:'Rifle', slot:'primary', rarity:'epic',     price:3200, dmg:46, rpm:650, spd:920, spread:2, mag:25, reserve:200, reload:2.0, bullet:'round', kb:70, recoil:3, range:700, auto:true, pierce:2, perks:['Pierces 2','High accuracy'], desc:'Battle rifle precision with full-auto bite.' },
    // SHOTGUNS
    sg_pump:   { name:'Boomstick',     fam:'Shotgun', slot:'primary', rarity:'uncommon', price:1200, dmg:14, pellets:8,  rpm:80,  spd:640, spread:16, mag:6,  reserve:48, reload:3.0, bullet:'slug', kb:140, recoil:7, range:340, auto:false, perks:['8 pellets','Knockback'], desc:'Pump-action wall of lead. Up close it deletes.' },
    sg_sawed:  { name:'Twin Fang',     fam:'Shotgun', slot:'secondary', rarity:'rare',  price:1500, dmg:18, pellets:10, rpm:120, spd:600, spread:22, mag:2,  reserve:40, reload:1.6, bullet:'slug', kb:220, recoil:9, range:280, auto:false, perks:['Massive knockback','Wide spread'], desc:'Two barrels of bad decisions. Point-blank only.' },
    sg_auto:   { name:'Streetsweeper', fam:'Shotgun', slot:'primary', rarity:'epic',    price:3000, dmg:12, pellets:7,  rpm:200, spd:660, spread:14, mag:10, reserve:60, reload:2.6, bullet:'slug', kb:120, recoil:5, range:360, auto:true, perks:['Full-auto','Drum mag'], desc:'Auto shotgun. Hold the trigger, clear the room.' },
    // SNIPERS
    sniper_semi: { name:'Marksman',  fam:'Sniper', slot:'primary', rarity:'rare', price:2400, dmg:95,  rpm:160, spd:1300, spread:1,   mag:10, reserve:50, reload:2.2, bullet:'round', kb:120, recoil:6, range:900,  auto:false, pierce:2, crit:2.0, perks:['Pierces 2','x2 crit'], desc:'Semi-auto DMR. Pop heads at range.' },
    sniper_bolt: { name:'Widowmaker', fam:'Sniper', slot:'primary', rarity:'epic', price:3400, dmg:185, rpm:50,  spd:1500, spread:0.5, mag:5,  reserve:30, reload:2.6, bullet:'round', kb:200, recoil:9, range:1100, auto:false, pierce:5, crit:2.5, perks:['Pierces 5','x2.5 crit'], desc:'Anti-materiel bolt rifle. A line of corpses.' },
    // LMGs
    lmg_saw:  { name:'Saw',         fam:'LMG', slot:'primary', rarity:'epic',      price:3600, dmg:26, rpm:750,  spd:840, spread:6, mag:100, reserve:300, reload:4.0, bullet:'round', kb:60, recoil:3, range:640, auto:true, pierce:1, perks:['100-round belt'], desc:'Belt-fed suppression. Never stop firing.' },
    lmg_mini: { name:'Annihilator', fam:'LMG', slot:'primary', rarity:'legendary', price:6500, dmg:22, rpm:1400, spd:800, spread:7, mag:200, reserve:400, reload:5.0, bullet:'round', kb:50, recoil:2, range:600, auto:true, spinup:0.5, perks:['Spin-up minigun','200 rounds'], desc:'Six barrels of apocalypse. Bring earplugs.' },
    // MELEE
    melee_knife:    { name:'Trench Knife',  fam:'Melee', slot:'melee', rarity:'common',   price:200,  dmg:45,  range:44, swing:0.26, arc:1.1, kb:40,  bleed:true, perks:['Very fast','Bleed'], desc:'Brutal little blade. Stab, stab, stab.' },
    melee_bat:      { name:'Slugger',       fam:'Melee', slot:'melee', rarity:'common',   price:300,  dmg:60,  range:58, swing:0.42, arc:1.5, kb:160, perks:['Knockback'], desc:'Aluminum bat. Crack skulls, save ammo.' },
    melee_axe:      { name:'Cleaver',       fam:'Melee', slot:'melee', rarity:'uncommon', price:700,  dmg:120, range:54, swing:0.6,  arc:1.1, kb:120, perks:['Huge damage'], desc:'Fire axe. Slow, but it ends things.' },
    melee_spear:    { name:'Impaler',       fam:'Melee', slot:'melee', rarity:'uncommon', price:850,  dmg:95,  range:84, swing:0.5,  arc:0.6, kb:130, perks:['Long reach','Stabs a line'], desc:'Improvised pike. Skewer them before they touch you.' },
    melee_machete:  { name:"Reaper's Edge", fam:'Melee', slot:'melee', rarity:'rare',     price:1100, dmg:85,  range:62, swing:0.38, arc:1.3, kb:90,  bleed:true, perks:['Causes bleed','Fast swing'], desc:'Keen blade. Carves bleeding wounds.' },
    melee_sledge:   { name:'Demolisher',    fam:'Melee', slot:'melee', rarity:'rare',     price:1300, dmg:185, range:56, swing:0.8,  arc:1.2, kb:280, perks:['Massive knockback'], desc:'Sledgehammer. Sends the dead flying in pieces.' },
    melee_katana:   { name:'Tamashii',      fam:'Melee', slot:'melee', rarity:'epic',     price:2400, dmg:135, range:68, swing:0.3,  arc:1.7, kb:120, bleed:true, perks:['Wide arc','Fast','Bleed'], desc:'A masterwork katana. One stroke, many corpses.' },
    melee_chainsaw: { name:'The Ripper',    fam:'Melee', slot:'melee', rarity:'epic',     price:2800, dmg:42,  range:54, swing:0.12, arc:1.0, kb:30,  bleed:true, perks:['Shreds continuously'], desc:'Roaring chainsaw. Hold it to them and watch the gibs.' },
    melee_blaze:    { name:'Blazing Katana', fam:'Melee', slot:'melee', rarity:'mythical', price:9000, dmg:230, range:72, swing:0.3, arc:1.9, kb:140, fire:true, bleed:true, perks:['Wreathed in flame','Ignites everything it cuts','Wide blazing arc'], desc:'A katana sheathed in living fire. Every cut sets the dead ablaze in a sweeping arc of flame.' },
    // SPECIAL
    spec_crossbow: { name:'Silent Death', fam:'Special', slot:'primary', rarity:'rare',      price:1800, dmg:135, rpm:70,   spd:720, spread:1,  mag:1,   reserve:40,  reload:1.4, bullet:'bolt',    kb:90,  recoil:2, range:760, auto:false, pierce:3, silent:true, perks:['Silent','Pierces 3'], desc:'No noise, no mercy. Pins zombies to walls.' },
    spec_flame:    { name:'Inferno',      fam:'Special', slot:'primary', rarity:'epic',      price:3300, dmg:9,   rpm:1200, spd:360, spread:10, mag:100, reserve:200, reload:3.0, bullet:'flame',   kb:10,  recoil:1, range:230, auto:true, fire:true, perks:['Ignites enemies','Cone of fire'], desc:'Liquid fire. Watch the horde cook.' },
    spec_gl:       { name:'Thumper',      fam:'Special', slot:'primary', rarity:'epic',      price:3500, dmg:130, rpm:60,   spd:520, spread:1,  mag:4,   reserve:24,  reload:2.8, bullet:'grenade', kb:160, recoil:8, range:600, auto:false, aoe:95, perks:['Explosive AoE'], desc:'40mm grenades. Clear packs in one thunk.' },
    spec_rail:     { name:'Tesla Lance',  fam:'Special', slot:'primary', rarity:'legendary', price:6000, dmg:265, rpm:40,   spd:2000, spread:0, mag:4,   reserve:24,  reload:3.0, bullet:'rail',    kb:140, recoil:8, range:1300, auto:false, pierce:99, perks:['Pierces everything','Chain arc'], desc:'Magnetic rail spike. A laser of death down the lane.' },
    spec_rpg:      { name:'Devastator',   fam:'Special', slot:'primary', rarity:'legendary', price:5500, dmg:240, rpm:48,   spd:480,  spread:1, mag:1,   reserve:14,  reload:2.7, bullet:'rocket',  kb:240, recoil:10, range:760, auto:false, aoe:120, fire:true, perks:['Huge explosion','Leaves fire','Knockback'], desc:'Shoulder-fired RPG. Delete entire packs in one screaming rocket.' },

    // ===== more LEGENDARY =====
    rifle_plasma: { name:'Plasma Rifle',  fam:'Rifle',   slot:'primary', rarity:'legendary', price:5000, dmg:72, rpm:600, spd:1150, spread:1, mag:40, reserve:240, reload:2.0, bullet:'rail', kb:70, recoil:3, range:820, auto:true, pierce:3, perks:['Superheated bolts','Pierces 3'], desc:'Experimental energy carbine. Bolts of plasma that punch through ranks.' },
    sg_dragon:    { name:'Dragonsbreath', fam:'Shotgun', slot:'primary', rarity:'legendary', price:4800, dmg:16, pellets:9, rpm:150, spd:680, spread:14, mag:12, reserve:72, reload:2.6, bullet:'slug', fire:true, kb:120, recoil:5, range:380, auto:true, perks:['Incendiary pellets','Sets the horde ablaze'], desc:'Auto shotgun loaded with dragonsbreath shells. Every blast is a wall of fire.' },
    melee_mjolnir:{ name:'Mjölnir',       fam:'Melee',   slot:'melee',   rarity:'legendary', price:5200, dmg:270, range:72, swing:0.5, arc:1.6, kb:340, perks:['Thunder hammer','Earth-shaking knockback'], desc:'The thunder hammer. Each swing scatters the dead like leaves.' },

    // ===== MYTHICAL (god-tier) =====
    myth_tengeshima: { name:'Tengeshima',        fam:'Mythical', slot:'primary', rarity:'mythical', price:25000, dmg:420, rpm:260, spd:1700, spread:0, mag:12, reserve:300, reload:1.5, bullet:'lightning', kb:160, recoil:4, range:1300, auto:true, pierce:99, chain:4, perks:["Lugh's spear of lightning","Pierces everything","Chains to 4 more"], desc:'The radiant spear of Lugh. A bolt of white lightning that impales whole lines and leaps between the dead.' },
    myth_aztec_staff:{ name:'Aztec Chief Staff', fam:'Mythical', slot:'primary', rarity:'mythical', price:22000, dmg:320, rpm:84,  spd:470,  spread:1, mag:6,  reserve:72,  reload:2.0, bullet:'fireball', kb:200, recoil:9, range:760, auto:false, aoe:160, fire:true, perks:['Hurls a MASSIVE fireball','Enormous burning AoE'], desc:'Carved obsidian-and-gold staff of the sun-king. Launches a colossal fireball that immolates the horde.' },
    myth_king_orb:   { name:'King Orb',          fam:'Mythical', slot:'primary', rarity:'mythical', price:40000, dmg:240, rpm:140, spd:0,    spread:0, mag:24, reserve:300, reload:2.0, bullet:'goldlight', goldLightning:6, kb:120, recoil:5, range:1000, auto:true, perks:['Golden lightning storm','Strikes 6 zombies at once','Annihilates hordes'], desc:'The orb of the crown. Call down golden lightning that forks across the battlefield and erases hordes.' },
    myth_king_staff: { name:'King Staff',        fam:'Melee',   slot:'melee',   rarity:'mythical', price:30000, dmg:520, range:96, swing:0.5, arc:1.9, kb:340, lunge:true, goldKill:true, perks:['Lunging royal strike','Turns the slain to GOLD'], desc:'The royal scepter. Lunge forward in a golden arc — every soul it fells is frozen in solid gold.' },

    // ===== HEAVENLY (final, ultimate tier) =====
    heaven_judgment: { name:'Wrath of Heaven', fam:'Mythical', slot:'primary', rarity:'heavenly', price:80000, dmg:620, rpm:120, spd:0, spread:0, mag:36, reserve:600, reload:1.8, bullet:'goldlight', goldLightning:12, kb:160, recoil:6, range:1400, auto:true, perks:['HEAVENLY — divine lightning','Smites 12 at once','Erases entire hordes'], desc:'The judgment of the heavens. Call down a storm of holy lightning that scours the battlefield clean.' },
    heaven_excalibur:{ name:'Excalibur',     fam:'Melee',   slot:'melee',   rarity:'heavenly', price:90000, dmg:680, range:86, swing:0.34, arc:2.0, kb:220, goldKill:true, perks:['HEAVENLY — the radiant blade','One sweeping stroke fells almost anything','Gilds the slain in gold'], desc:'The sword in the stone, reforged in light. A radiant arc that turns the dead to statues of gold.' },
    heaven_gjallar:  { name:'Gjallarhorn',   fam:'Special', slot:'primary', rarity:'heavenly', price:95000, dmg:460, rpm:50, spd:560, spread:1, mag:3, reserve:24, reload:2.4, bullet:'rocket', aoe:175, fire:true, kb:240, recoil:9, range:840, auto:false, perks:['HEAVENLY — holy detonation','Colossal blast radius','Leaves sanctified fire'], desc:'A horn that fires shards of heaven — each shot a cataclysmic, sanctified explosion.' },
    // charge-based evaporating laser
    spec_evap:       { name:'Evaporator',     fam:'Special', slot:'primary', rarity:'legendary', price:7000, dmg:260, beam:true, charge:100, drain:34, recharge:22, range:560, kb:0, recoil:0, auto:true, perks:['Continuous evaporating beam','Drains a charge cell','Overheats if overused — then recharges'], desc:'A handheld particle laser. Hold to project a beam that vaporizes anything it touches — watch the charge or it overheats and must cool down.' },
  };

  // ---------- TRAPS & TURRETS (9) ----------
  T.TRAPS = {
    trap_bear:     { name:'Bear Trap',     rarity:'common',   price:250,  dmg:80,  effect:'root', dur:2.0,  r:14, triggers:1,  color:'#8a8f7a', desc:'Snaps shut, rooting a zombie for 2s and biting deep.' },
    trap_spike:    { name:'Spike Board',   rarity:'common',   price:180,  dmg:40,  effect:'spike',dur:0,    r:20, triggers:6,  color:'#7a5a3a', desc:'Nail-studded plank. Damages anything that steps on it.' },
    trap_barbed:   { name:'Barbed Wire',   rarity:'uncommon', price:220,  dmg:6,   effect:'slow', dur:99,   r:34, triggers:99, color:'#6a6f5a', desc:'Slows and shreds zombies passing through. Area denial.' },
    trap_fire:     { name:'Fire Trap',     rarity:'uncommon', price:350,  dmg:14,  effect:'fire', dur:6.0,  r:40, triggers:1,  color:'#e07a2a', desc:'Erupts into a pool of flame that burns for 6 seconds.' },
    trap_claymore: { name:'Claymore',      rarity:'rare',     price:420,  dmg:170, effect:'boom', dur:0,    r:24, triggers:1,  aoe:90, color:'#4f6a3a', desc:'Proximity mine. Detonates in a lethal cone of shrapnel.' },
    trap_electric: { name:'Electric Grid', rarity:'rare',     price:520,  dmg:30,  effect:'shock',dur:99,   r:42, triggers:99, color:'#5fc6e8', desc:'Electrified floor. Chains shock damage and slows the horde.' },
    turret_slow:   { name:'Cryo Turret',   rarity:'rare',     price:800,  dmg:4,   effect:'turret', mode:'slow',  dur:30, r:200, color:'#7fd0f0', desc:'Auto turret that chills and slows nearby zombies.' },
    turret_auto:   { name:'Auto Turret',   rarity:'epic',     price:950,  dmg:14,  effect:'turret', mode:'gun',   dur:30, r:300, rpm:360, color:'#9aa18c', desc:'Deployable sentry gun. Auto-targets and fires for 30s.' },
    turret_flame:  { name:'Flame Turret',  rarity:'epic',     price:1150, dmg:10,  effect:'turret', mode:'flame', dur:25, r:200, rpm:600, color:'#e07a2a', desc:'Sentry that sprays a cone of fire at approaching swarms.' },
  };

  // ---------- UTILITY / CONSUMABLES (7) ----------
  T.ITEMS = {
    item_bandage:    { name:'Bandage',        rarity:'common',   price:80,  kind:'heal',   heal:25, desc:'Quick patch. Restores 25 HP.' },
    item_medkit:     { name:'Medkit',         rarity:'uncommon', price:200, kind:'heal',   heal:65, desc:'Field medkit. Restores 65 HP.' },
    item_ammo:       { name:'Ammo Pack',      rarity:'uncommon', price:180, kind:'ammo',   desc:'Refills reserve ammo for all carried weapons.' },
    item_adrenaline: { name:'Adrenaline Shot',rarity:'rare',     price:250, kind:'buff',   dur:6, heal:15, desc:'+50% move & fire rate for 6s. Heals 15 HP.' },
    item_frag:       { name:'Frag Grenade',   rarity:'common',   price:150, kind:'throw',  dmg:150, aoe:95,  fuse:1.1, desc:'Lethal frag. Throw toward cursor, explodes on fuse.' },
    item_molotov:    { name:'Molotov',        rarity:'uncommon', price:170, kind:'throw',  dmg:16,  aoe:75,  fire:true, fuse:0.9, desc:'Throws a pool of fire that burns the ground area.' },
    item_barricade:  { name:'Barricade',      rarity:'common',   price:220, kind:'deploy', hp:300, desc:'Drops a sandbag wall to block the horde.' },
  };

  // ---------- ARMOR / CLOTHING (slots redraw the player sprite) ----------
  // stat fields: armor (flat DR points), hp, spd (mult delta), reload (mult delta),
  //              crit, stamina, ammo (reserve mult delta), trapSlots, beltSlots
  T.ARMOR = {
    // HELMETS
    helm_beanie: { name:'Beanie',          slot:'helmet', rarity:'common',    price:0,    armor:2,  color:'#5a4a3a', desc:'Keeps the rain off. Barely.' },
    helm_riot:   { name:'Riot Helmet',     slot:'helmet', rarity:'uncommon',  price:500,  armor:8,  color:'#2a3a4a', desc:'Polycarbonate visor. Decent head protection.' },
    helm_mil:    { name:'Military Helmet', slot:'helmet', rarity:'rare',      price:1100, armor:14, hp:10, color:'#3a4a2a', desc:'Kevlar combat helmet with night strap.' },
    helm_jug:    { name:'Juggernaut Helm', slot:'helmet', rarity:'legendary', price:3000, armor:28, hp:25, spd:-0.05, color:'#4a4a4a', desc:'Heavy welded faceplate. You are a tank.' },
    helm_samurai:{ name:'Samurai Kabuto',  slot:'helmet', rarity:'epic',      price:2800, armor:24, hp:15, melee:0.15, color:'#7a1f1f', desc:'Lacquered war helm with a golden crest. +15% melee.' },
    helm_aztec:  { name:'Aztec Headdress',  slot:'helmet', rarity:'epic',      price:4200, armor:26, hp:20, melee:0.10, color:'#1f8a5a', desc:'Feathered war-crown of the sun. +10% melee.' },
    helm_king:   { name:'King Crown',        slot:'helmet', rarity:'mythical',  price:35000, armor:60, hp:80, shield:250, color:'#f2c14e', desc:'The Holy Crown. Grants a massive +250 SHIELD — a golden second bar before your health.' },
    helm_aegis:  { name:'Aegis Halo',        slot:'helmet', rarity:'heavenly',  price:70000, armor:90, hp:150, shield:500, color:'#fff7d8', desc:'HEAVENLY. A radiant halo granting +500 shield and near-divine protection.' },
    // CHEST
    chest_hoodie:  { name:'Red Jacket',      slot:'chest', rarity:'common',    price:0,    armor:3,  color:'#b03a2e', desc:'A worn red jacket over a white tee. Home.' },
    chest_leather: { name:'Leather Jacket',  slot:'chest', rarity:'uncommon',  price:600,  armor:10, color:'#3a2a20', desc:'Thick biker leather. Resists bites.' },
    chest_kevlar:  { name:'Kevlar Vest',     slot:'chest', rarity:'rare',      price:1400, armor:22, hp:15, color:'#2a2a2a', desc:'Soft body armor. Stops claws and small bites.' },
    chest_plate:   { name:'Plate Carrier',   slot:'chest', rarity:'epic',      price:2600, armor:34, hp:25, spd:-0.03, color:'#3a3a30', desc:'Ceramic plates front and back. Serious protection.' },
    chest_jug:     { name:'Juggernaut Plate',slot:'chest', rarity:'legendary', price:4500, armor:50, hp:60, spd:-0.12, color:'#4a4a4a', desc:'Full siege armor. Slow, unstoppable, terrifying.' },
    chest_samurai: { name:'Samurai Dō',      slot:'chest', rarity:'epic',      price:3600, armor:40, hp:30, melee:0.20, spd:-0.04, color:'#8a2424', desc:'Lamellar samurai cuirass. Proud and tough. +20% melee.' },
    chest_aztec:   { name:'Aztec Chief Armor',slot:'chest', rarity:'mythical', price:24000, armor:58, hp:70, melee:0.30, shield:80, color:'#1f8a5a', desc:'Jade-and-gold warrior regalia of the sun-king. +30% melee, +80 shield.' },
    chest_seraph:  { name:'Seraphic Plate',   slot:'chest', rarity:'heavenly', price:85000, armor:95, hp:180, shield:300, melee:0.30, spd:0.10, color:'#fff7d8', desc:'HEAVENLY. Angelic plate: +300 shield, big health, +30% melee, and a touch of angelic swiftness.' },
    // LEGS (leggings)
    legs_jeans:    { name:'Jeans',            slot:'legs', rarity:'common',   price:0,    armor:2,  color:'#3a5a8a', desc:'Sturdy blue denim.' },
    legs_cargo:    { name:'Cargo Pants',      slot:'legs', rarity:'uncommon', price:400,  armor:6,  beltSlots:1, color:'#4a4a30', desc:'Lots of pockets. +1 consumable slot.' },
    legs_tactical: { name:'Tactical Leggings',slot:'legs', rarity:'rare',     price:1000, armor:12, spd:0.04, color:'#2a3a2a', desc:'Lightweight armored weave. A touch faster.' },
    legs_greaves:  { name:'Armored Greaves',  slot:'legs', rarity:'epic',     price:2200, armor:24, spd:-0.04, color:'#444', desc:'Steel leg plates. Heavy but tough.' },
    legs_samurai:  { name:'Samurai Suneate',  slot:'legs', rarity:'rare',     price:1800, armor:18, melee:0.10, color:'#6a1818', desc:'Armored samurai greaves. +10% melee.' },
    // BOOTS
    boots_sneak:  { name:'Sneakers',     slot:'boots', rarity:'common',   price:0,    spd:0.06, color:'#cccccc', desc:'Worn running shoes. Light and quick.' },
    boots_combat: { name:'Combat Boots', slot:'boots', rarity:'uncommon', price:450,  armor:5, spd:0.02, color:'#2a2a22', desc:'Steel-shank combat boots.' },
    boots_steel:  { name:'Steel-Toe',    slot:'boots', rarity:'rare',     price:1000, armor:10, color:'#33342a', desc:'Reinforced. Kick a Crawler to death.' },
    boots_sprint: { name:'Sprint Boots', slot:'boots', rarity:'epic',     price:2000, spd:0.16, stamina:30, color:'#c8a030', desc:'Featherweight. Run circles around the dead.' },
    // GLOVES
    gloves_finger: { name:'Fingerless Gloves',slot:'gloves', rarity:'common',   price:0,    reload:0.03, color:'#2a2a2a', desc:'Just grip. A little faster reload.' },
    gloves_tac:    { name:'Tactical Gloves',  slot:'gloves', rarity:'uncommon', price:400,  reload:0.12, color:'#222', desc:'Padded tac gloves. +12% reload speed.' },
    gloves_reload: { name:'Reload Gloves',    slot:'gloves', rarity:'rare',     price:1100, reload:0.25, crit:0.05, color:'#3a2a2a', desc:'Speed-loaders sewn in. +25% reload, +5% crit.' },
    // BACKPACK
    pack_small: { name:'Small Pack',     slot:'backpack', rarity:'common',   price:0,    trapSlots:1, beltSlots:2, color:'#3a4a6a', desc:'A worn blue backpack. 1 trap, 2 consumables.' },
    pack_tac:   { name:'Tactical Pack',  slot:'backpack', rarity:'uncommon', price:700,  trapSlots:2, beltSlots:3, ammo:0.20, color:'#2f3f55', desc:'MOLLE webbing. 2 traps, 3 consumables, +20% ammo.' },
    pack_heavy: { name:'Heavy Rucksack', slot:'backpack', rarity:'rare',     price:1600, trapSlots:3, beltSlots:4, ammo:0.50, spd:-0.04, color:'#3a2a20', desc:'Hauls everything. 3 traps, 4 consumables, +50% ammo.' },
  };

  // ---------- WEAPON ATTACHMENTS (bought with salvage ◆) ----------
  T.ATTACHMENTS = {
    att_extmag:     { name:'Extended Mag',  cost:2, mods:{ mag:0.40 },             desc:'+40% magazine size.' },
    att_reddot:     { name:'Red Dot Sight', cost:2, mods:{ spread:-0.45 },         desc:'-45% bullet spread.' },
    att_grip:       { name:'Quickdraw Grip',cost:2, mods:{ reload:0.25 },          desc:'+25% reload speed.' },
    att_longbarrel: { name:'Long Barrel',   cost:3, mods:{ range:0.30, spd:0.20 }, desc:'+30% range, +20% velocity.' },
    att_suppressor: { name:'Suppressor',    cost:3, mods:{ crit:0.06, dmg:-0.05 }, silent:true, desc:'Silenced. +6% crit, -5% dmg.' },
    att_hollow:     { name:'Hollow-Point',  cost:3, mods:{ dmg:0.18 },             desc:'+18% damage to unarmored.' },
    att_ap:         { name:'AP Rounds',     cost:4, mods:{ pierce:2 }, ap:true,    desc:'+2 pierce, ignores armor deflection.' },
    att_incendiary: { name:'Incendiary',    cost:4, fire:true,                     desc:'Rounds set zombies on fire.' },
  };

  // ---------- ZOMBIES (11 + 2 bosses) ----------
  T.ZOMBIES = {
    z_walker:  { name:'Walker',      hp:50,  spd:40,  dmg:8,  r:11, cash:5,  score:10, color:'#5a6e3a', tier:1, behavior:'seek' },
    z_crawler: { name:'Crawler',     hp:30,  spd:62,  dmg:7,  r:8,  cash:6,  score:12, color:'#4a5a32', tier:1, behavior:'seek', small:true },
    z_runner:  { name:'Runner',      hp:42,  spd:104, dmg:12, r:10, cash:8,  score:15, color:'#7a8a5a', tier:2, behavior:'seek' },
    z_dog:     { name:'Mutated Dog', hp:30,  spd:158, dmg:14, r:8,  cash:10, score:18, color:'#6a4a32', tier:3, behavior:'lunge', dog:true },
    z_spitter: { name:'Spitter',     hp:62,  spd:42,  dmg:6,  r:11, cash:20, score:30, color:'#7aa83a', tier:3, behavior:'kite', ranged:14, projSpd:300 },
    z_screamer:{ name:'Screamer',    hp:74,  spd:56,  dmg:6,  r:11, cash:30, score:40, color:'#9a7a8a', tier:4, behavior:'support', summon:true },
    z_bloater: { name:'Bloater',     hp:130, spd:30,  dmg:14, r:16, cash:25, score:35, color:'#6a8a4a', tier:4, behavior:'seek', burst:true },
    z_armored: { name:'Armored',     hp:170, spd:52,  dmg:20, r:12, cash:30, score:45, color:'#52585a', tier:5, behavior:'seek', armored:true },
    z_brute:   { name:'Brute',       hp:440, spd:32,  dmg:30, r:20, cash:45, score:60, color:'#4a5a3a', tier:5, behavior:'seek', big:true, kb:0.3 },
    z_stalker: { name:'Night Stalker',hp:96, spd:114, dmg:22, r:10, cash:35, score:50, color:'#3a3a4a', tier:6, behavior:'seek', night:true, alpha:0.55 },
    z_rioter:  { name:'Riot Brute',   hp:340, spd:46, dmg:28, r:13, cash:45, score:60, color:'#46505a', tier:6, behavior:'seek', shielded:true },
    // ELITES / BOSSES
    z_boss_vanguard: { name:'VANGUARD ELITE',  hp:2600, spd:38, dmg:44, r:32, cash:500,  score:900,  color:'#6a6a5a', boss:true, big:true, slam:true, armored:true },
    z_boss_mother:   { name:'THE MOTHER',      hp:3200, spd:24, dmg:34, r:32, cash:600,  score:1000, color:'#7a5a6a', boss:true, big:true, births:true },
    z_boss_shadow:   { name:'THE SHADOW ELITE',hp:3800, spd:64, dmg:42, r:30, cash:800,  score:1500, color:'#16161e', boss:true, big:true, shadow:true, alpha:0.82, blink:true, summon:true },
    z_boss_overlord: { name:'THE OVERLORD',    hp:6500, spd:30, dmg:55, r:36, cash:1500, score:3000, color:'#3a1f4a', boss:true, big:true, overlord:true, shockwave:true, slash:true, summon:true },
    z_boss_dark:     { name:'OVERLORD · DARK', hp:3000, spd:46, dmg:50, r:30, cash:400,  score:1200, color:'#1a1024', boss:true, big:true, shockwave:true, blink:true },
    z_boss_light:    { name:'OVERLORD · LIGHT',hp:3000, spd:40, dmg:48, r:30, cash:400,  score:1200, color:'#e8e2d0', boss:true, big:true, summon:true, slash:true, light:true },
    z_purple_elite:  { name:'Purple Elite',    hp:260,  spd:62, dmg:28, r:13, cash:40,   score:60,   color:'#5a3a6a', tier:99, behavior:'seek', armored:true, purple:true },
  };

  // ---------- ENVIRONMENTS + LIGHTING ----------
  T.ENVIRONMENTS = {
    env_streets:    { name:'Ruined Streets',     ground:'#2a2c28', ground2:'#33352f', accent:'#454838', light:'day',    props:['car','barrier','rubble'] },
    env_suburbs:    { name:'Destroyed Suburbs',  ground:'#3a342a', ground2:'#433c30', accent:'#5a4a32', light:'sunset', props:['fence','rubble','car'] },
    env_highway:    { name:'Broken Highway',     ground:'#26282a', ground2:'#2e3033', accent:'#3a3d40', light:'fog',    props:['car','barrier','barrier'] },
    env_fields:     { name:'Foggy Fields',       ground:'#2e3424', ground2:'#363d2a', accent:'#454d32', light:'fog',    props:['rubble','fence'] },
    env_burning:    { name:'Burning District',   ground:'#2a2420', ground2:'#332a24', accent:'#5a3a24', light:'sunset', props:['fire','car','rubble','fire'] },
    env_checkpoint: { name:'Military Checkpoint',ground:'#2c2e26', ground2:'#34362c', accent:'#454838', light:'day',    props:['barrier','sandbag','car','sandbag'] },
    env_quarantine: { name:'Quarantine Zone',    ground:'#242c26', ground2:'#2c352e', accent:'#3a5a3a', light:'night',  props:['fence','barrier','tent'] },
  };

  // ambient lighting presets: darkness alpha + color tint
  T.LIGHTING = {
    day:    { dark:0.0,  tint:'rgba(255,240,210,0.04)' },
    sunset: { dark:0.22, tint:'rgba(220,120,60,0.16)' },
    fog:    { dark:0.30, tint:'rgba(150,160,150,0.22)', fog:true },
    night:  { dark:0.55, tint:'rgba(30,40,80,0.20)' },
  };

  // ---------- STARTING STATE ----------
  T.START = {
    cash: 900,
    salvage: 2,
    owned: {
      weapons:  ['pistol_glock', 'melee_knife', 'melee_bat'],
      armor:    ['helm_beanie', 'chest_hoodie', 'legs_jeans', 'boots_sneak', 'gloves_finger', 'pack_small'],
      traps:    {},          // id -> count
      items:    { item_bandage: 2 }, // id -> count
      attach:   {},          // weaponId -> [attachIds]
      pets:     [],          // owned pet ids
      companions: [],        // owned human partner ids
    },
    equipped: {
      primary: null,
      secondary: 'pistol_glock',
      melee: 'melee_bat',
      helmet: null, chest: 'chest_hoodie', legs: 'legs_jeans',
      boots: 'boots_sneak', gloves: 'gloves_finger', backpack: 'pack_small',
      pet: null,             // equipped animal companion
      companions: [],        // equipped human partners (max 2)
      trapSlot: [],          // trap ids loaded
      belt: ['item_bandage'],// consumable ids loaded
    },
    romance: {},             // legacy companionId -> affection points
    love: { pts: 0, flirts: 0, kissed: false, intimate: false, married: false }, // medic romance
  };

  // ---------- PETS / COMPANIONS (fight alongside you) ----------
  // kind: 'melee' (charges & mauls) or 'ranged' (drone, auto-fires)
  T.PETS = {
    pet_k9:    { name:'K-9 Unit',        rarity:'uncommon', price:1200, kind:'melee',  hp:120, spd:205, dmg:28, atkCd:0.55, range:280, kb:80,  color:'#5a4632', desc:'Loyal attack dog. Fast and relentless — lunges at the nearest threat.' },
    pet_bear:  { name:'War Bear',        rarity:'rare',     price:2400, kind:'melee',  hp:460, spd:135, dmg:80, atkCd:1.0,  range:240, kb:240, big:true, color:'#6a5038', desc:'A massive armored bear. Slow, but mauls and flings the horde.' },
    pet_tiger: { name:'Siberian Tiger',  rarity:'epic',     price:3200, kind:'melee',  hp:230, spd:235, dmg:62, atkCd:0.6,  range:320, kb:120, leap:true, color:'#c8801a', desc:'Apex predator. Leaps onto zombies and shreds them apart.' },
    pet_drone: { name:'Combat Drone',    rarity:'epic',     price:3000, kind:'ranged', hp:100, spd:240, dmg:16, atkCd:0.16, range:340, color:'#3a4048', desc:'Hovering gun drone. Auto-fires on the nearest zombie and never reloads.' },
  };

  // ---------- HUMAN COMPANIONS / PARTNERS (max 2 equipped) ----------
  T.COMPANIONS = {
    comp_medic:    { name:'Field Medic',      role:'Medic',    kind:'medic',    rarity:'rare',      price:3000, spd:200, heal:18, healCd:2.2, range:340, color:'#e9eef4', romance:true, desc:'A combat nurse who follows you and patches you up mid-fight. Talk to her between rounds — flirt, kiss, and maybe build a life together. ♥' },
    comp_engineer: { name:'Combat Engineer',  role:'Engineer', kind:'engineer', rarity:'epic',      price:5000, spd:175, buildCd:9, turret:'turret_auto', range:300, color:'#caa030', desc:'Deploys an auto-turret every few seconds and keeps your perimeter bristling with guns.' },
    comp_soldier:  { name:'Mercenary Soldier',role:'Soldier',  kind:'soldier',  rarity:'legendary', price:8000, spd:190, dmg:42, atkCd:0.15, range:440, color:'#3a4a32', desc:'Elite hired gun — the most expensive partner. Lays down heavy, accurate fire on the horde.' },
  };

  // ---------- CRAZY DAVE — travelling arms dealer (dialogue) ----------
  T.DAVE = {
    enter: [
      "Welcome aboard the BUS, survivor! I'm Dave — I drive, I deal, I do NOT do refunds.",
      "Keep the dead off my bus and I'll keep us rolling. Need gear for the next stop?",
      "This bus is the last safe place on Earth. Probably. Don't quote me. Buy somethin'!",
      "I can make you SURVIVE... for a price. Heh heh heh heh.",
      "Every stop, more of 'em come. Every stop, I sell you the cure: BULLETS.",
    ],
    return: [
      "You're ALIVE?! Heh! I had twenty bucks on the horde. Spend your blood money!",
      "Still breathing? DISGUSTING. I love it. The shop is OPEN, killer.",
      "Wave {n} cleared! The dead are just gettin' warmed up. Gear up!",
      "Welcome back to the land of the NOT-eaten! What're we buyin'?",
      "Ohh you survived AGAIN. Stop makin' me lose bets and BUY somethin'!",
    ],
    buy: [
      "AH HA HA! A FINE choice! Or a TERRIBLE one! Who's to say!",
      "SOLD! No refunds, no returns, no survivors— I mean, no PROBLEM!",
      "That'll kill somethin'. Probably a zombie. PROBABLY.",
      "Cha-CHING! That's the sound my brain makes now. Heh.",
      "Ooo, good weight on that one. Feels like REGRET. And freedom!",
    ],
    deploy: [
      "Go give 'em the ol' LEAD SANDWICH! Heh heh heh!",
      "Try not to die. It's REAL bad for repeat business.",
      "They're coming. They're ALWAYS coming. NOW GO!",
      "Make 'em DANCE, survivor! The bullet dance! GO GO GO!",
    ],
    poor: [
      "No cash, no boomstick! Go make some corpses — they pay GREAT!",
      "Your wallet's emptier than a zombie's skull. Come back RICHER!",
    ],
    // player replies -> Dave's retort
    replies: [
      { t: "Who ARE you?",        r: "Name's Dave. CRAZY Dave! The suburbs called me that. Then the suburbs got EATEN." },
      { t: "Is this stuff safe?", r: "SAFE?! HAAA! Nothing's safe! But it's CHEAP-ish! Mostly! Probably!" },
      { t: "Got any tips?",       r: "Aim for the head. Or the legs. Or just... shoot a LOT. That's the Dave Method™." },
      { t: "You're insane.",      r: "CLINICALLY! But my PRICES are sane. Mostly. Heh heh." },
      { t: "Just let me shop.",   r: "Rude. I RESPECT it. Browse away, you beautiful disaster." },
      { t: "Where'd you get all this?", r: "Don't ask where the guns came from. Or the previous owners. Just... DON'T." },
      { t: "What's with the pan?", r: "The pan PROTECTS me! From zombies! From the SKY! From the GOVERNMENT! ...Mostly the sky." },
      { t: "I'll take everything.", r: "A man of TASTE and POOR impulse control! My FAVORITE kind of customer!" },
    ],
  };

  // unified lookup helper
  T.lookup = id => T.WEAPONS[id] || T.TRAPS[id] || T.ITEMS[id] || T.ARMOR[id] || T.ATTACHMENTS[id] || T.PETS[id] || T.COMPANIONS[id] || null;
  T.kindOf = id => T.WEAPONS[id] ? 'weapon' : T.TRAPS[id] ? 'trap' : T.ITEMS[id] ? 'item' : T.ARMOR[id] ? 'armor' : T.ATTACHMENTS[id] ? 'attach' : T.PETS[id] ? 'pet' : T.COMPANIONS[id] ? 'companion' : null;

})(window.TAC);

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
    // SPECIAL
    spec_crossbow: { name:'Silent Death', fam:'Special', slot:'primary', rarity:'rare',      price:1800, dmg:135, rpm:70,   spd:720, spread:1,  mag:1,   reserve:40,  reload:1.4, bullet:'bolt',    kb:90,  recoil:2, range:760, auto:false, pierce:3, silent:true, perks:['Silent','Pierces 3'], desc:'No noise, no mercy. Pins zombies to walls.' },
    spec_flame:    { name:'Inferno',      fam:'Special', slot:'primary', rarity:'epic',      price:3300, dmg:9,   rpm:1200, spd:360, spread:10, mag:100, reserve:200, reload:3.0, bullet:'flame',   kb:10,  recoil:1, range:230, auto:true, fire:true, perks:['Ignites enemies','Cone of fire'], desc:'Liquid fire. Watch the horde cook.' },
    spec_gl:       { name:'Thumper',      fam:'Special', slot:'primary', rarity:'epic',      price:3500, dmg:130, rpm:60,   spd:520, spread:1,  mag:4,   reserve:24,  reload:2.8, bullet:'grenade', kb:160, recoil:8, range:600, auto:false, aoe:95, perks:['Explosive AoE'], desc:'40mm grenades. Clear packs in one thunk.' },
    spec_rail:     { name:'Tesla Lance',  fam:'Special', slot:'primary', rarity:'legendary', price:6000, dmg:265, rpm:40,   spd:2000, spread:0, mag:4,   reserve:24,  reload:3.0, bullet:'rail',    kb:140, recoil:8, range:1300, auto:false, pierce:99, perks:['Pierces everything','Chain arc'], desc:'Magnetic rail spike. A laser of death down the lane.' },
    spec_rpg:      { name:'Devastator',   fam:'Special', slot:'primary', rarity:'legendary', price:5500, dmg:240, rpm:48,   spd:480,  spread:1, mag:1,   reserve:14,  reload:2.7, bullet:'rocket',  kb:240, recoil:10, range:760, auto:false, aoe:120, fire:true, perks:['Huge explosion','Leaves fire','Knockback'], desc:'Shoulder-fired RPG. Delete entire packs in one screaming rocket.' },
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
    // CHEST
    chest_hoodie:  { name:'Hoodie',          slot:'chest', rarity:'common',    price:0,    armor:3,  color:'#3a4a3a', desc:'A comfy grey hoodie. Sentimental value only.' },
    chest_leather: { name:'Leather Jacket',  slot:'chest', rarity:'uncommon',  price:600,  armor:10, color:'#3a2a20', desc:'Thick biker leather. Resists bites.' },
    chest_kevlar:  { name:'Kevlar Vest',     slot:'chest', rarity:'rare',      price:1400, armor:22, hp:15, color:'#2a2a2a', desc:'Soft body armor. Stops claws and small bites.' },
    chest_plate:   { name:'Plate Carrier',   slot:'chest', rarity:'epic',      price:2600, armor:34, hp:25, spd:-0.03, color:'#3a3a30', desc:'Ceramic plates front and back. Serious protection.' },
    chest_jug:     { name:'Juggernaut Plate',slot:'chest', rarity:'legendary', price:4500, armor:50, hp:60, spd:-0.12, color:'#4a4a4a', desc:'Full siege armor. Slow, unstoppable, terrifying.' },
    chest_samurai: { name:'Samurai Dō',      slot:'chest', rarity:'epic',      price:3600, armor:40, hp:30, melee:0.20, spd:-0.04, color:'#8a2424', desc:'Lamellar samurai cuirass. Proud and tough. +20% melee.' },
    // LEGS (leggings)
    legs_jeans:    { name:'Jeans',            slot:'legs', rarity:'common',   price:0,    armor:2,  color:'#2a3a55', desc:'Sturdy denim. Better than bare legs.' },
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
    // BOSSES
    z_boss_behemoth: { name:'THE BEHEMOTH', hp:4200, spd:34, dmg:50, r:36, cash:600, score:1000, color:'#5a4a3a', boss:true, big:true, slam:true },
    z_boss_mother:   { name:'THE MOTHER',   hp:3200, spd:24, dmg:34, r:32, cash:550, score:900,  color:'#7a5a6a', boss:true, big:true, births:true },
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
    },
    equipped: {
      primary: null,
      secondary: 'pistol_glock',
      melee: 'melee_bat',
      helmet: 'helm_beanie', chest: 'chest_hoodie', legs: 'legs_jeans',
      boots: 'boots_sneak', gloves: 'gloves_finger', backpack: 'pack_small',
      pet: null,             // equipped companion
      trapSlot: [],          // trap ids loaded
      belt: ['item_bandage'],// consumable ids loaded
    },
  };

  // ---------- PETS / COMPANIONS (fight alongside you) ----------
  // kind: 'melee' (charges & mauls) or 'ranged' (drone, auto-fires)
  T.PETS = {
    pet_k9:    { name:'K-9 Unit',        rarity:'uncommon', price:1200, kind:'melee',  hp:120, spd:205, dmg:28, atkCd:0.55, range:280, kb:80,  color:'#5a4632', desc:'Loyal attack dog. Fast and relentless — lunges at the nearest threat.' },
    pet_bear:  { name:'War Bear',        rarity:'rare',     price:2400, kind:'melee',  hp:460, spd:135, dmg:80, atkCd:1.0,  range:240, kb:240, big:true, color:'#6a5038', desc:'A massive armored bear. Slow, but mauls and flings the horde.' },
    pet_tiger: { name:'Siberian Tiger',  rarity:'epic',     price:3200, kind:'melee',  hp:230, spd:235, dmg:62, atkCd:0.6,  range:320, kb:120, leap:true, color:'#c8801a', desc:'Apex predator. Leaps onto zombies and shreds them apart.' },
    pet_drone: { name:'Combat Drone',    rarity:'epic',     price:3000, kind:'ranged', hp:100, spd:240, dmg:16, atkCd:0.16, range:340, color:'#3a4048', desc:'Hovering gun drone. Auto-fires on the nearest zombie and never reloads.' },
  };

  // ---------- CRAZY DAVE — travelling arms dealer (dialogue) ----------
  T.DAVE = {
    enter: [
      "WABBY-WABBO! Heh— I mean, WELCOME, survivor! Step into Dave's Emporium of Doom!",
      "I can make you SURVIVE... for a price. Heh heh heh heh.",
      "You smell that? That's COMMERCE. And zombies. Mostly zombies.",
      "Guns! Traps! Questionable medicine! Dave's got it ALL, friend!",
      "I traded my house for these guns. I don't remember owning a house. WORTH IT.",
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
  T.lookup = id => T.WEAPONS[id] || T.TRAPS[id] || T.ITEMS[id] || T.ARMOR[id] || T.ATTACHMENTS[id] || T.PETS[id] || null;
  T.kindOf = id => T.WEAPONS[id] ? 'weapon' : T.TRAPS[id] ? 'trap' : T.ITEMS[id] ? 'item' : T.ARMOR[id] ? 'armor' : T.ATTACHMENTS[id] ? 'attach' : T.PETS[id] ? 'pet' : null;

})(window.TAC);

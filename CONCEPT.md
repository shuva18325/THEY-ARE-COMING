# THEY ARE COMING — Game Concept & Design Document

> A gritty 2D top‑down zombie survival shooter with retro pixel‑art, deep
> equipment systems, a full shop, traps, and a suit‑up loadout stage.
> Survival‑horror tension meets twin‑stick arcade shooting.
>
> *"You bought the gear. You picked the loadout. Now hold the line — because they are coming."*

This document is the design bible. A **fully playable implementation** of the
core systems lives alongside it in this repo (open `index.html`). See
[`README.md`](README.md) for how to run it.

---

## 0. PILLARS

1. **Tension first.** Ammo, money and health are always a little too scarce. Every wave is a gamble.
2. **Deep customization.** Weapons, attachments, armor, traps and consumables combine into thousands of viable loadouts.
3. **Readable chaos.** Even with 80 zombies on screen, muzzle flashes, tracers and blood tell you exactly what is happening.
4. **Arcade punch.** Heavy hit‑feedback: screen shake, recoil, gibs, chunky sound.
5. **Earned power.** Progression is bought with blood money. Survive, loot, upgrade, survive harder.

---

## 1. CORE GAMEPLAY

### Movement & Aiming
- **WASD** moves the player in all 8 directions (full analog vectors, normalized so diagonals aren't faster).
- The **mouse cursor is the aiming reticle**. The player sprite continuously **rotates to face the cursor**.
- **Right‑click ONLY** fires the equipped weapon. **Left‑click does nothing** (reserved/disabled by design).
- Hold right‑click for automatic weapons; tap for semi‑auto.
- **Shift** = sprint (drains stamina). **R** = reload. **Space** = use consumable. **Q** = swap weapon. **E** = place trap. **F** = melee.

### Loop
1. **Suit Up** (loadout) → **Deploy** into a wave.
2. **Survive the wave** — kill the swarm before it overruns you.
3. **Bank the bounty** (cash + salvage) → return to the **Shop / Loadout** hub.
4. **Upgrade** → next wave is harder, denser, and introduces new zombie types.
5. Repeat until death. Score = waves survived × kills × cash banked.

Combat is **wave‑based with escalating difficulty**: each wave increases zombie
count, density, speed scaling, and unlocks tougher archetypes. Every 5th wave is
a **Boss Wave**.

### Firing Visuals & Projectile Behavior
- On fire, a **bright yellow muzzle flash** pops at the gun barrel for **1–2 frames**.
- A **visible pixel‑art projectile** launches from the muzzle toward the cursor.
- Projectiles feature:
  - **Straight‑line travel** at weapon‑specific speed.
  - A distinct **bullet sprite** per family (round, slug, bolt, fireball, rail‑bolt).
  - An optional **tracer trail** that fades.
- **Impact effects:**
  - **Blood burst** + gibs on zombie flesh.
  - **Sparks + ricochet** on armored enemies and metal.
  - **Debris puffs** on walls/props.
- **Juice:** screen shake scaled to weapon caliber, a short **recoil kick** that nudges the player sprite back, shell‑casing ejection, and dynamic muzzle light.

---

## 2. SHOP SYSTEM

Currency is **Cash ($)** earned from kills, wave‑clear bonuses, and salvage.
A rarer currency, **Salvage (◆)**, is dropped by elites/bosses and is used to
craft attachments and Legendary gear.

Every item has **stats + a rarity tier**:

| Rarity | Color | Stat budget | Drop/stock |
|---|---|---|---|
| Common | Gray | baseline | always |
| Uncommon | Green | +15% | frequent |
| Rare | Blue | +35% + 1 perk | wave 3+ |
| Epic | Purple | +60% + 2 perks | wave 6+ |
| Legendary | Orange | +90% + unique perk | wave 10+ / boss salvage |

The shop refreshes its stock each visit and **scales available tiers to your wave**.

### Weapons
- **Pistols** — Sidearm (Glock), Hand Cannon (Desert Eagle)
- **SMGs** — Hornet (MP5), Sprayer (Uzi), Cyclone (P90)
- **Rifles** — Ranger (M4), Reaper (AK‑47), Vanguard (SCAR)
- **Shotguns** — Boomstick (pump), Streetsweeper (auto), Twin Fang (sawed‑off)
- **Snipers** — Widowmaker (bolt), Marksman (semi‑auto)
- **LMGs** — Saw (M249), Annihilator (minigun)
- **Melee** — Slugger (bat), Cleaver (axe), Reaper's Edge (machete)
- **Special** — Inferno (flamethrower), Silent Death (crossbow), Tesla Lance (railgun), Thumper (grenade launcher)

### Traps (deployable)
Bear Trap · Barbed Wire · Spike Board · Claymore · Fire Trap · Electric Grid ·
Auto Turret · Flame Turret · Slow (Cryo) Turret

### Utility / Consumables
Frag Grenade · Molotov · Medkit · Bandage · Adrenaline Shot · Ammo Pack ·
Deployable Barricade

### Armor & Clothing (visually change the player sprite)
- **Helmets** — Beanie, Riot Helmet, Military Helmet, Juggernaut Helm
- **Chest** — Hoodie, Leather Jacket, Kevlar Vest, Plate Carrier, Juggernaut Plate
- **Legs (leggings)** — Jeans, Cargo Pants, Tactical Leggings, Armored Greaves
- **Boots** — Sneakers, Combat Boots, Steel‑Toe, Sprint Boots
- **Gloves** — Fingerless, Tactical Gloves, Reload Gloves
- **Backpacks** — Small Pack, Tactical Pack, Heavy Rucksack (increase carry/ammo/consumable slots)

### Weapon Attachments (bought with Salvage)
Extended Mag · Suppressor · Red Dot · Long Barrel · Quickdraw Grip ·
Hollow‑Point Rounds · AP Rounds · Incendiary Rounds. Each occupies one of a
weapon's **attachment slots** and modifies stats (see §7 Stat Model).

---

## 3. SUIT‑UP / LOADOUT STAGE

The **Suit Up** screen is a dedicated pre‑deployment hub.

**The player equips:**
- **Primary** + **Secondary** weapon
- **Melee** weapon
- 6 **Armor** pieces (helmet, chest, legs, boots, gloves, gloves) + **backpack**
- 1–3 **Trap** loadout slots (backpack increases this)
- **Consumable** belt (medkits, grenades, ammo, adrenaline…)

**The Loadout screen shows:**
- A **full animated character preview** that updates live as gear is equipped (gear is drawn onto the sprite).
- **Aggregate gear stats** panel (Armor, Speed, HP, Reload, Carry, DPS estimate).
- Per‑slot **item cards** with rarity color, stats and perks.
- **Weapon attachment** sub‑panel with attachment slots.
- **Trap slots** with quantities.
- A **DEPLOY / Confirm** button that locks the loadout and launches the wave.

---

## 4. ZOMBIE BESTIARY

Each archetype has unique **HP, Speed, Damage, Size, and an Ability**.

| Zombie | HP | Speed | Dmg | Trait / Ability |
|---|---|---|---|---|
| **Walker** | Low | Slow | Low | The baseline shambler; comes in hordes. |
| **Runner** | Low | Fast | Med | Sprints straight at you; punishes reloads. |
| **Crawler** | V.Low | Med | Low | Low to the ground, small hitbox, hard to hit. |
| **Brute** | V.High | Slow | High | Tank; shrugs off small arms, knocks back. |
| **Bloater** | Med | Slow | Med | **Bursts** into a lingering toxic gas cloud on death. |
| **Mutated Dog** | V.Low | V.Fast | Med | Lunges; comes in packs; hard to track. |
| **Screamer** | Low | Med | Low | **Screams** to summon extra walkers & enrage nearby zombies. |
| **Spitter** | Low | Slow | Med | **Ranged acid** projectile; keeps distance. |
| **Armored** | High | Med | High | Plated; deflects bullets (sparks) except headshots/AP. |
| **Night Stalker** | Med | Fast | High | Night‑only; partially translucent, ambushes from the dark. |
| **Boss — The Behemoth** | Massive | Slow→Enrage | V.High | Multi‑phase; ground‑slam shockwave, spawns adds, enrages at low HP. |
| **Boss — The Mother** | Massive | Slow | High | Continuously **births crawlers**; weak points on sacs. |

**AI behaviors:** seek (toward player), flank (spread to surround), swarm
(density pressure), ranged kite (spitter), pack‑lunge (dog), and
support (screamer aura). Pathing uses simple flow toward the player with
separation so the horde spreads instead of stacking.

---

## 5. ENVIRONMENTS

Selectable / wave‑rotating arenas, each with its own palette, hazards and props:

- **Ruined Streets** — cracked asphalt, crashed cars, overturned buses, flickering signs.
- **Destroyed Suburbs** — collapsed houses, white picket fences, burning lawns.
- **Broken Highway** — guardrails, pileups, a fog bank rolling over the median.
- **Foggy Fields** — low visibility, tall grass, scattered scarecrows and silos.
- **Burning District** — active fires, smoke columns, dynamic embers, heat haze.
- **Military Checkpoint** — sandbags, concrete barriers, watchtowers, abandoned APCs (cover + turret mounts).
- **Quarantine Zone** — chain‑link fences, hazard tape, biohazard tents, sickly green lighting.

**Environmental details:** rolling **fog**, **smoke**, **fire**, scattered
**debris**, **barricades**, **crashed cars** (destructible cover), and **dynamic
lighting** presets — **Day, Sunset, Night, Fog** — each shifting palette, ambient
darkness and the player's flashlight/muzzle‑light contribution.

---

## 6. ART DIRECTION

- **Retro pixel‑art**, low‑res sprites scaled with nearest‑neighbor (crisp pixels).
- **Gritty survival‑horror tone:** desaturated bases, sickly greens, blood reds, cold blues, with high‑contrast warm light sources (fire, muzzle flash).
- **Blood & debris** persist on the ground (decals) within a budget.
- **Lighting:** ambient darkness + additive light blobs (muzzle flash, fire, explosions, flashlight cone).
- **Gear is visible:** equipping armor/weapons **redraws the player sprite** (helmet, chest, pants, boots, backpack, held gun all change).
- **Palette discipline:** ~16‑color master ramp per environment for cohesion (matches the gunmetal weapon sheet aesthetic).
- UI: chunky wooden/metal panels, pixel font, rarity‑colored item frames (inspired by the equipment‑screen reference).

---

## 7. STAT MODEL & GAME FEEL

### Weapon stats
`damage, fireRate (rounds/min), projectileSpeed, spread (deg), magSize,
reserveAmmo, reloadTime, pellets (shotguns), range/falloff, penetration,
critMultiplier, knockback, recoil, price, rarity, attachmentSlots`.

### Player stats (derived from gear)
`maxHP, armor (damage reduction %), moveSpeed, sprintSpeed, stamina,
reloadSpeed mult, carry capacity (ammo + consumable + trap slots),
pickup radius, crit chance`.

### Damage pipeline
`final = base × critMult × penetrationFactor × (1 − targetArmor) − flatResist`,
with **headshot** zones, **armor deflection** (armored zombies spark and take
reduced non‑AP damage), and **falloff** past weapon range.

### Game feel checklist
Heavy impact sounds · swarm pressure · tight movement · readable tracers ·
satisfying gibs · rewarding cash drops · meaningful upgrades · "one more wave" pull.

---

## 8. OPTIONAL / EXPANSION SYSTEMS

- **Weather:** rain, lightning (briefly lights the field), dust, snow — affects visibility & traction.
- **Day/Night cycle:** waves rotate Day→Sunset→Night; Night spawns Night Stalkers and lowers ambient light.
- **Base Defense mode:** defend a central objective (generator/survivor van) with pre‑placed traps and barricades.
- **NPC Survivors:** rescue AI allies that fight alongside you or man turrets; can be lost permanently.
- **Skill Tree:** spend earned XP on branches — *Gunslinger* (weapon handling), *Engineer* (traps/turrets), *Survivor* (health/regen/loot), *Berserker* (melee/adrenaline).
- **Daily Challenge / Endless** modes with leaderboards.
- **Co‑op** (2–4 players) as a stretch goal.

---

## 9. CONTENT MANIFEST (implemented in this repo)

The playable build ships data‑driven catalogs you can extend in `js/data.js`:

- **24 weapons** across 8 families, each with a procedurally drawn pixel sprite, fire profile, and SFX.
- **9 trap/turret types** with placement, trigger and damage logic.
- **7 consumables/utility** items.
- **20+ armor/clothing pieces** across 6 slots, each redrawing the player sprite.
- **5 rarity tiers** with color‑coded frames and stat scaling.
- **11 zombie archetypes + 1 boss** with distinct stats, sprites and abilities.
- **Multiple environments + 4 lighting presets** (Day/Sunset/Night/Fog).
- **Shop**, **Suit‑Up/Loadout**, **HUD**, **wave director**, particle/light engine, and a procedural audio synth.

See `README.md` for controls and how to run, and `js/` for the implementation.

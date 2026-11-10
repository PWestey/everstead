# Everstead design

Everstead is a habit tracker that lives inside a cozy village. It keeps the look and screen style of
Everkai (itself modelled on *Isekai: Slow Life*), but none of its parity goals. **Every game system is
fed by real habits.** If a system can grow without habits, it does not belong here.

## The loop

1. **Complete a habit** in the Habit Journal. Each completion pays, by difficulty (easy 1 / normal 2 / hard 3 points):
   - **Gold:** 10 per point (daily cap 1,000)
   - **XP:** 10 per point. This levels **you**.
   - **Sigils:** 1 per point, in that habit's life area. These earn your Fellows' stars.
   - **Bond:** 10 per point for the Family member of that area, once she has joined.
   - **A roam:** one per *daily* habit (up to 10 banked, never expire).
   - **Blight damage:** its points, doubled if the area opposes this week's Blight.
   - **Building boost:** +5% per point to that area's building today (max +50%).
2. **Spend** Fellow EXP (from the Map and the War Table) on Fellow levels, gold on buildings, gifts and visits, sigils on stars, roams on the Expedition Map (the only thing Roams buy).
   The Village Gate walk and each building adventure are free once a day.
3. **Grow your Power** to open and crush more of the map, and push back the weekly Blight.
4. **Momentum** multiplies all building income: `1 + 0.5 × areas touched this week / 8 + min(0.5, 0.07 × dailies today)`.

## Eight life areas

| Area | Stat | Building |
|---|---|---|
| Faith | Spirit | Chapel |
| Marriage | Heart | Rose Café |
| Fatherhood | Legacy | Hearth Inn |
| Fitness | Might | Training Yard |
| Work | Craft | Market |
| Home | Hearth | Workshop |
| Discipline | Will | Library |
| Hobbies | Joy | Guildhall |

The cast lives in `lib/cast.mjs`: Fellows are the men, Family the women, and each belongs to one area.
An area can hold several of each. They join in list order (see the join queue below).

## You: eight skills (RuneScape style)

- Each life area is a **skill on RuneScape's own XP table** (level 2 = 83 XP, 92 = 6.5M, 99 = 13,034,431). **No cap:** 99 earns the cape, and the level keeps counting on the same curve (about 10% more XP per level, shown in green past 99). Map XP grows 30% a step, so a skill gains about 2.7 levels per map step forever.
  Each one wears an OSRS skill's icon and cape: Faith/Prayer, Marriage/Hitpoints, Fatherhood/Farming, Fitness/Strength,
  Work/Smithing, Home/Construction, Discipline/Defence, Hobbies/Fishing.
- **Skill XP = lifetime habit points in the area × 500**, plus bonus XP from quests and adventures. Derived, never stored,
  so undo and old saves just work. ~4 points a day in an area ≈ level 37 in two weeks, 55 at three months, 69 at a year.
- **Total level** = sum of the eight (8 at the start, 792 with every cape, uncapped). It unlocks the **seven armour tiers**: Bronze (8), Iron (150),
  Mithril (280), Rune (360), Dragon (440), Barrows (490), Saradomin (540). A skillcape at 99; the max cape at 792.
- Level-up message on every new level, RuneScape style.

## Power: half you, half your roster

- **Hero Power** = `25 × total level × (1 + 0.15 per armour tier above Bronze) × 1.01^(total level − 792)` past the max cape. Level is the log of XP, so this is about ×1.23 per map step against needs of ×1.3: it catches up with the roster slowly and never outruns the Map.
- **Roster Power** = the sum of your Fellows' Power (Family blessings included).
- **Total Power** = `(Hero + Roster) × (1 + 0.2 × balance)`, balance = smaller half ÷ larger half. Used by every Power check.

## Quests, dialogue and adventures

- **Dialogue** (`lib/dialogue.mjs`): full-screen backdrop, speaker portrait, RS chatbox, 2–3 choices. Choices can set
  flags, give XP, gold, sigils or bond, and drive quests. Story rewards pay once per save.
- **Quests** (`lib/quests.mjs`): chains that alternate *real habits* ("3 Fitness habits", "3 different days") with
  conversations. Habit steps advance automatically; talks happen with the quest giver. Journal colours: red not
  started, yellow in progress, green done. First quest: **The Iron Body** (Darrow, Fitness).
- **One quest per Fellow** (41), written in `lib/quests/*.mjs`. Every quest is talk → H habits → talk → D days → talk.
  Within an area they unlock in order, lowest tier first, and each tier needs a total level:

  | Tier | Habits | Days | Quest pts | XP | Gold | Sigils | Total level |
  |---|---|---|---|---|---|---|---|
  | 1 | 3 | 3 | 1 | 5,000 | 1,500 | 40 | — |
  | 2 | 5 | 4 | 2 | 10,000 | 3,000 | 60 | 100 |
  | 3 | 8 | 5 | 3 | 20,000 | 5,000 | 80 | 200 |
  | 4 | 12 | 7 | 4 | 35,000 | 8,000 | 100 | 300 |
  | 5 | 15 | 10 | 5 | 50,000 | 12,000 | 120 | 400 |
  | 6 | 20 | 14 | 6 | 75,000 | 18,000 | 150 | 500 |
- **Moments** (`lib/moments.mjs`, content in `lib/moments/*.mjs`): short pop-up conversations, flavour only.
  Fellows speak at every 5th level and every star (comradery, motivation). Family speak on each
  "Spend time together" and each gift (romantic; all Family characters are adult alternate-universe portrayals aged 24+).
  Visits advance by successful daily visits, independently of bond, through five scenes once and then repeat scenes 4–5.
  Gifts show all three reaction lines together. Existing gift tree IDs remain valid. Older saves start visit narration
  at the beginning without changing their bond, recruitment, rewards or visit cooldown.
  `docs/WRITING-BRIEF.md` is the style guide; `node scripts/check-content.mjs <file>` checks a content file.
- **Adventures**: art cards at a location; each costs a roam (earned by daily habits) and plays a short scene with a
  choice that decides the reward. First location: the **Training Yard**.

## Cheers (after a habit)

A character from the habit's life area steps in nearly full screen and says a line or two; you answer RPG-style
("I am committed!"). Content: `lib/cheers/*.mjs` (4 cheers, a Codex lead-in, an ack and an all-done moment per
character); engine: `lib/cheers.mjs`.

- **When:** the first habit you complete in each area each day, and the moment you finish every daily.
- **Who:** a recruited Fellow or Family member from that area (anyone from the area until you've recruited one).
- **What:** the cheer whose spoken words best match the habit's title (word families: "Make My Bed" → a line about the
  bed); if none match, one of your Codex notes from that area, introduced in their voice.
- Can be switched off per device in Settings ("Character cheers after habits").

## The main story

Morrow, the Thief of Days, against the Hearth of Everstead (full outline: `docs/STORY.md`). Engine `lib/story.mjs`,
chapters in `lib/story/*.mjs` as dialogue trees `story-1`…`story-9`. Chapters unlock in order:

| Ch | Title | Needs |
|---|---|---|
| 1 | Embers | first habit |
| 2 | The House on the Hill | Count Draynor + total 60 |
| 3 | Something Under Falador | Giant Mole + total 150 |
| 4 | Six Brothers | Barrows + total 220 |
| 5 | Sixty-Two Waves | TzTok-Jad + total 280 |
| 6 | The Hive of Tomorrows | Kalphite Queen + total 360 |
| 7 | The Offer | Dagannoth Kings + total 440 |
| 8 | The Thief of Days | King Black Dragon + total 490 |
| 9 | Epilogue: A Visitor | total 540 |

Each pays 1,000 × chapter gold once. Choices set flags; Chapter 8 reads real stats ({habits}, {streak}, {areas50})
and the player's Chapter 1 answer ({motive}); its final choice becomes the Hearth's line. Every character's
"how they got here" origin is in `lib/origins/`, shown in their Info panel.

## The War Table (game modes)

Eight modes, all settled by team power against a need (no battle engine); engine `lib/modes.mjs`, screen
`app/modes-panel.tsx`. Family fight at `150 × bond level`; Fellows at their Fellow Power. Gold rewards are multiples of
10 minutes of village income; Fellow EXP rewards are multiples of one frontier Map run (`expUnit = rosterPower ÷ 8`), so the squad decides how far you get and the
whole village decides what a floor is worth: Rift 1/180 run per floor, Arena 1/20 per win, Gauntlet 1/100 per floor, Spire 1/20 per new floor, Trials 1/20 per new tier,
Fronts 1/200 per wave. On a day-90 village (16 Map runs a day) that is Rift half a run, Arena ×5 a quarter, Gauntlet a third, and the weekly Fronts about four runs plus
800 sigils (a star). It looks small next to the Map, but the economy compounds: with the War Table played every day the 90-day pace goes from step 88 (Map only) to 99;
the modes' sigils alone take it to 92, and doubling these EXP constants takes it to 104. Resist raising them.
Franchise tags for the Arena are in `lib/franchises.mjs`.

| Mode | Roster | Cadence | Rule |
|---|---|---|---|
| Errands | Family | daily, 5 offers, 3 out | timed jobs (1/4/8h) paying gold, sigils or bond; pay × √(crew Power ÷ need) up to ×8 (half under the need); +7% per daily done |
| The Rift | Fellows (3) | 1 run/day | climbs floors `250×1.17^f`; today's area ×2 |
| Blight Strikes | Family (3) | 3/day, bank 9 | each strike adds damage to this week's Blight |
| The Arena | Both (5) | 5 tries/day | franchise teams `600×1.12^r`; own franchise ×0.75 |
| Draft Gauntlet | Both | 1 run/day | everyone = 100 power, ×2 in the sector's area (shown one sector ahead), ×1.15 per Rally (stacking), +5% per daily habit done today (cap +40%); floors `240×1.06^f`; wounds carry, the lightest wound is `4 + floor/3`; pick a draft or boon every 3 floors; a lost floor costs 40 health and offers Rally or Focus to regroup. Every area brings a trait, none of them stack: Faith heals 3 per floor, Discipline −3 per wound, Home +15 max health, Work +25% gold/EXP, Hobbies always ×2, Fitness ×1.1 squad power, Fatherhood +1 recruit per draft, Marriage +15 on sector heals. Sim (30 days): random drafting floor ~26, deliberate drafting ~47 (~56 with 8 habits) |
| Eight Fronts | Both (3) | weekly | each character once a week; waves `300×1.15^w`, easier with that area's weekly habits |
| The Trials | Family-led (3) | weekly | 8 rooms with rule twists; tier cap from the area's skill level |
| The Spire | Fellows (5) | any time | endless `400×1.12^f` (bosses ×2/×4); Resolve +1%/habit after a failure (max 20%) |

## The Archives (the Codex)

The owner's knowledge base, merged in from Jedi Codex: 337 cards from books, podcasts and talks
(`lib/codex-cards.json`, engine in `lib/codex.mjs`). The old Habit Journal building is now the Archives.

- Leitner spaced repetition: boxes 1–7 come back after 1, 2, 4, 7, 14, 30, 60 days. Got it → up a box; forgot → box 1, tomorrow.
- New cards arrive **15 a day**, drawn at random from the unseen pool (the draw is fixed for the day). Topics map to areas (Parenting → Fatherhood, Marriage, Faith,
  Leadership/Money → Work, Habits & Systems → Discipline, Lifting/Nutrition → Fitness, Growth → Hobbies).
- **Each review pays 10 minutes of village income** (at least 50 gold) **+ 150 XP** in its area, the same for got it and
  forgot, for the first **40 reviews a day**.
- **Mastered** = reached box 7. Every 25 mastered adds **+2% building income**.
- Any card can become a weekly habit with one tap.
- Adding knowledge: append `{id, topic, front, back, source}` to the JSON; id = `'k' + sha1(topic + '|' + front)` first 8 hex.

## Fellows (Power)

- **Recruit** by lifetime habit points in their area, or by time: the k-th of n Fellows in an area is ready on day ⌈30k/n⌉, so everyone has arrived by day 30. The join queue per area is 3, 30, 90, 180, 300, 450… points for the 1st, 2nd, 3rd… Fellow.
- `Fellow Power = 100 × Level^1.15 × milestones × (1 + 0.25 × Stars)`. **Milestones** at levels 10, 25, 50 and 75 each multiply Power by 1.25 for good; level 99 by 1.5 (×2.9 at 75, ×4.4 at 99). Levels are worth a little more the higher you go; the milestones are where it jumps (idle-game style).
- Level cost: `50 × Level^1.65 × 1.25^(Level/25)` **Fellow EXP**: it climbs with the milestones, so Power per EXP falls slowly forever and nothing runs away. Past 99 a milestone comes every 25 levels (×1.25), without end. EXP comes only from stages: Map runs pay `50 × 1.3^k` (bosses ×2); War Table modes pay a share of their need (Rift 1⁄16 per floor, Spire 1⁄20, Arena 1⁄12, Gauntlet 1⁄12, Front 1⁄16 per wave, Trials 1⁄12). New saves start with 1,500. No level cap.
- Stars cost `15 × n²` sigils of the Fellow's own area and never stop (five show as glyphs; past that the count is written). Each adds +25% Power. Levels have no cap: the climbing EXP cost is the pace.
- **Staffing:** a building has `min(4, 1 + ⌊(Level−1)/3⌋)` staff slots (more at levels 4, 7, 10), filled by recruited Fellows of its area. Each worker adds `25% + 25% per doubling of his Power past 10,000` income (log, so income stays proportional to Power). Untouched, the strongest fill the slots; pick by hand on the building screen.
- **Power is wealth:** every open building earns an extra `Village Power / 40,000` gold per second on top of its base rate, before multipliers.

## Family (Blessings)

- **Welcome** by area points and your total level, or by time (same day-30 rule as Fellows). Queue: 15, 60, 150, 280, 450… points, and total level 20, 60, 100, 140… for the 1st, 2nd, 3rd… Family member.
- Bond level from bond XP; level L → L+1 costs `100 × L^1.5`, no cap. Gifts cost `5% more per bond level` of the recipient (a posy is 500 gold at level 1, about 1,600 at level 25, 9,000 at level 60), so bond grows with the log of your gold.
- **Blessings:** your closest bond in each area blesses its Fellows (+3%/level) and its building (+2%/level); **everyone** blesses every Fellow:
  bond levels ranked highest first, the k-th weighted `0.85^(k-1)`, at +0.12% per weighted level (`blessAll`). The weights sum to at most 6.7, so
  97 members can never pass 6.7 × one bond, welcoming someone never costs Power, and a newcomer counts from her first level (seven bonds at 150 ≈ +81%;
  ninety more at bond 10 add about +2.5%, and more as they climb). Rate tuned on the 90-day simulator: step 103 on day 90 against 104 under the old average rule. A plain sum would run away and the old average fell every time someone joined.
- Per Bond level: **+3%** Power to every Fellow in her area, **+0.12% × 0.85^rank** to every Fellow, **+2%** to her building's income.
- Bond sources: area habits, one visit per day (+30), gifts (gold or crystals; give ×1, ×5, ×10 or as many as you can afford), roaming scenes.

## Specialties, roles, sets, paths and relics

What makes two characters at the same level different (data in `lib/traits.mjs`, formulas in `lib/game.mjs`). None of it adds a rule inside a fight: every
piece is a multiplier on a Power check or on what a squad brings home. The habit inputs are the same as before: Roams buy the Map runs that drop relics, the
levels and bond that open paths come from Fellow EXP and area habits, and the War Table squads are the ones habits already feed.

- **Specialty** (one per character, by lore): the one War Table mode they count **×1.25** in. Riftwalker, Climber (Spire), Duelist (Arena), Shieldwall (Fronts),
  Peacemaker (Trials), Errand-runner, Blightbane (strikes), Pathfinder (Gauntlet: counts 125 instead of 100). Fellows never specialise in Family-only modes or the reverse.
  The Trials' Silence room strips specialties, sets and relics along with the Family bonus. The picker marks a specialist with ★; Optimize and the batches weigh by mode Power.
- **Role**: Fighter (nothing extra, 59 of 138), **Provider** (+5% gold from War Table rewards and Errands for squads they are in), **Mentor** (+5% Fellow EXP for squads they are in),
  **Guardian** (a Front with a Guardian holds one more wave; Gauntlet wounds are 2 lighter per Guardian). Role bonuses stack per member.
- **Sets**: three of one franchise in a squad fight **×1.2** under the set's name (`SET_NAMES`: Jedi Council, Avengers Assemble, For Azeroth…). The Witcher has two characters, so its set is a wish.
- **Paths**: at level 50 and 100 (Fellows) or bond 50 and 100 (Family) a character chooses once, for good: **Focus** (+0.25 to the specialty's ×, so ×1.5 then ×1.75) or
  **Steady** (+5% Power everywhere, the Map included; ×1.1025 after both). The roster card's ! badge marks an open path. Action `pathChoose`, save field `paths:{id:[…]}`.
- **Relics** (`RELICS`, 47): gear with a tier and one affix. One slot per character; a copy is worn by one character at a time (`relics:{owned:{id:count},worn:{charId:id}}`,
  action `relicWear`). Affixes: a mode (the wearer counts ×1.1 / ×1.2 / ×1.35 there by tier), **gold** or **exp** (+10/20/35% for squads with the wearer), **power**
  (Old Whetstone +5%, Hearthstone Charm +10%). **Legendaries**, one per franchise, give +25% Power, **doubled on one of their own** (Thor with the Vibranium Shield: +50%), and
  drop only from the region boss they belong with (Silver Sword at Count Draynor, the Elder Wand at Nex…).
- **Drops**: each Map run rolls 5% (bosses 15%): common 60 / rare 30 / epic 10. A boss drops its legendary 4% of the time and surely on every 25th run of it. Gauntlet floors 10 and 25
  drop a rare, floor 50 an epic; every 25th Spire floor an epic. Rolls are fixed by the save and the run count, so a batch equals the same runs one by one. The drop stops the result
  scroll with the relic in its tier colour and an Equip control (the suggested wearer is a specialist of its mode with an empty slot, else the strongest). The Collection Log lists all 47.
- **Two slots**: mode and Power relics are **weapons**, gold and EXP relics are **charms**; a character wears one of each (`worn:{charId:{weapon:uid,charm:uid}}`) and their
  affixes add. Wearing a relic fills its slot, swapping out what was there. The charms never touch Power, so the second slot leaves the Map's pace where it was.
- **Rolls**: every drop rolls once; its affix is the catalogue value × (0.8 + 0.4 × roll), so the best piece of a kind is ×1.2 its listed number and the worst ×0.8, and 95%+ is shown as
  *perfect*. Owned relics are pieces (`relics:{items:{uid:{id,roll}},worn:{charId:uid},shards,next}`); the roll is part of the drop's seed, so a batch still equals the same runs one by one.
  Wearing by catalogue id picks the best free roll. Saves from before rolls arrive with every copy at a middle roll.
- **The Forge** (in the Workshop, once it is built): salvage an unworn relic into shards by tier (common 1, rare 3, epic 10, legendary 30), salvage every *spare* (unworn and not
  the best roll of its kind) in one tap, reroll a relic for twice its salvage value, or ascend a common (5) or rare (15) one tier within its kind with a fresh roll. Epics and legendaries
  cannot be ascended, so a legendary only ever comes from its boss. The Forge's roll is fixed by the save and its count. Shards come only from relics, so only from Roams.
- **Pace**: with Steady and the roles at 5%, the simulator's day-120 step moves from 124 to about 131 (8 habits) and 100 to about 104 (4 habits); at 10% it was 137, more than
  doubling the War Table's EXP constants, which is why they are 5%. Specialties and sets change who you send, not how fast the Map goes.

## Training Grounds

A landmark next to the Workshop. Set a mark for Fellows (a level) and for Family (a bond level); "Train now" brings everyone below the mark up to it,
lowest first, spending Fellow EXP on levels and gold on honey sweets (the best bond per gold). Fellows and Family above the mark are left alone.
With Auto on, `settle` runs the same drill every tick, so EXP and gold are spent as they arrive. Levels bought here skip the level-up chat and
milestone fanfare but are otherwise identical. Save field `trainer:{fellows,family,auto}`; action `train` with `{fellows,family,auto,now}`.

## Companions

32 creatures (16 Pokémon, 16 Aniimo), four per life area, in `lib/companions.mjs`. Art: `public/assets/companions/<stage>.webp`.

- **Starters:** one per area from the first day; the other three of each area turn up by themselves on days 10, 20 and 30. Sooner, they are **found**: every Map boss first-win, every 8th Map run (preferring the place's areas), and Gauntlet floors 10, 25 and 50.
- **EXP:** every completed habit gives all four companions of its area **+100 EXP**; a **treat** gives one companion **+250**. Treats drop 1 per Map run (2 from bosses), from the Rift (1/day), the Arena (1 per win), and every 5th Spire and Gauntlet floor. New saves start with 3.
- Level from lifetime EXP: level L→L+1 costs `25 × L^1.5`; no cap. No buying levels. Milestones ×1.15 at 10 and 25, ×1.25 at 40, then ×1.15 every 25 levels.
- **Evolve** (a tap) at level 10 and level 25 along the line.
- **Boost:** each companion gives every Fellow of its area `0.4% × Level^1.15 × milestones + 5% × (Stage − 1)` Power. Companions are their own multiplier: `Fellow Power × (1 + area blessing) × (1 + companions) × (1 + family blessing)`, so a +10% companion is always a real +10% however high bond climbs. Four level-40 companions: ×2.8.

### Owning a miss

A due daily task you didn't do can be **owned** (task sheet → "I failed today"): you must write how you'll make it right
tomorrow (12–300 characters). The task leaves today's list, pays nothing, and its streak resets. Tomorrow the task shows
what you said until you complete it. Owned days don't count for Momentum, area points or the Hearth.

## Pace

From `node scripts/simulate.mjs` (a player who completes 8 hard daily habits, spends every Roam, runs the War Table and spends everything): the first journey (Nex, step 50) falls in about a month, the whole 30-region lap (Yama, step 150) in about 6 months with the War Table played daily (7 on the Map alone), and each lap after that takes longer than the last. A 4-habit player reaches Nex in about 2 months and Yama in about 11. (At the old growth of 1.3 per step neither player met the last 15 regions within a year, which is why it is 1.2.) Nothing caps, so the game never goes flat: Power, needs and rewards keep climbing together.

## The Hearth and the Collection Log

- **The Hearth** (top of Today): your streak, the days in a row with at least one completed habit, counting back from today or yesterday. One log per day (14 shown), the fire lit while the streak lives. Purely a mirror of the journal; it pays nothing itself.
- **Collection Log** (Hero screen → Log): every Fellow, Family member, companion, Map boss, skill at 99, quest, story chapter and mastered Archive card, with OSRS green/red counts. Also a mirror; no rewards attached.
- Level 99 in a skill fires the level-up card with fireworks.

## Expedition Map (replaced the Watchtower stages)

The daily 15 minutes: habits earn Roams, Roams buy runs, runs pay what Fellows need, Fellows raise Power,
Power opens and crushes more of the map. Old School RuneScape places and art (`public/assets/osrs/`).

- **Regions** (`lib/expedition-data.mjs`): Lumbridge → Asgarnia → Morytania → Karamja → Kharidian Desert →
  Fremennik Province → the Wilderness → Kandarin → Great Kourend → the God Wars Dungeon, then the second journey: Misthalin → Crandor → Tirannwn →
  Darkmeyer → the Dragonkin's Trail → the Southern Seas → the Kebos Lowlands → the Deep Roads → Troll Country → Zul-Andra → the Deep Wilderness →
  the Slayer Masters' Haunts → the Feldip Hills → Varlamore → the Fortis Colosseum → the Ancient Vaults → the Tombs of Amascut → the Theatre of Blood →
  the Inferno → the Last Gates (Yama). Each has 4 adventures and a boss (150 places). Beating a region's boss
  opens the next region and grants a permanent perk (Roam storage, building income, Power or expedition loot).
- **Step k** = 5 × region + slot (boss is slot 4). **Need** = `400 × MAP_GROWTH^k` Power, MAP_GROWTH 1.2 (Count Draynor 830 … King Black Dragon 200K … Nex 3M … Yama 2.5e14).
- **Loot per run** = gold `150 × g^k`, and in each of the place's two areas sigils `3 + ⌊k/5⌋` and XP
  `250 × g^k`. Bosses pay double. The two areas are spread evenly: every life area is on 37-38 of the 150 places, 12-13 of the first
  journey's 50 and 7-8 bosses (a test holds this), so no area is starved of sigils or XP. Saves from before the retag got 900 sigils in
  each of the five areas that had been short (flag `sigils-fair-1`), then 900 more in discipline, faith, hobbies and work (`sigils-fair-2`); the list is `SIGIL_GRANTS`.
- **Laps:** beating Yama starts lap 2: every need and every gold/EXP reward on the map is × a whole lap's worth of steps (1.2^150, about 7.5e11) per lap, so lap 2's Lumbridge picks up past Yama; regions re-open boss by boss, perks and companions are earned once. There is no last lap. Saves from the 10-region map that were on lap 2+ fold back to lap 1 at Misthalin (flag `map-30-1`).
- **Outcome** from Power ÷ need: under 1 locked · Success 1× · Great (1.5+) 1.5× · Overwhelming (3+) 2×.
- **One Roam per run.** The first visit plays a short scene with a Fellow or Family member along
  (`lib/expeditions/scenes.mjs`); repeats are one tap and a result scroll.
- **Blights** (the vices): one rises each week, rotating through Sloth, Distraction, Doubt, Neglect,
  Pride and Excess. HP `60 × (1 + 0.25 × tier)`. Damage comes only from that week's habits.
  Defeat it for crystals and sigils; it returns one tier stronger next time round.

## Buildings

- Open for 150 gold. Income `(0.02 × level + Village Power ÷ 40,000)` gold/second **× (1 + 0.15 × level) × 1.25 per ten levels**, then × Fellow staff, × Family blessing,
  × today's area boost, × Momentum. Upgrade cost `200 × 1.5^(level−1)`: the level multiplier is linear and the cost geometric, so each level is worth less per gold than the last and building income can never outrun Power. The ×1.25 milestone at every tenth level (shown on the card as "N levels away") keeps a ten-level climb worth saving for once single levels are worth only a couple of percent.
- Away earnings are capped at 12 hours.

## Doing several at once
- **Map:** a "Runs per tap" switch (1, 5, All) above the regions sets how many Roams one tap of Go spends, on places and bosses alike. The engine repeats the
  single run (`expedition` with a count, up to `MULTI_RUN_MAX`), so five at once is exactly five in a row, and it stops where single taps would: out of Roams,
  or the last boss starting a new lap. A first visit still plays its scene first. One result card shows the totals.
- **War Table:** each mode that took repeated taps has a gold one-tap button under its own. The engine picks the squad Optimize would, every round (`bestPick`):
  Arena "Fight all tries" (stops at the first loss, since the same best team would lose again), Trials "Climb until beaten", Fronts "Defend every open front"
  (areas in order, best unused three each), Blight "Use all strikes", Gauntlet "Fight on to the next choice". The Rift and Spire already resolve in one tap.
  Rewards are the same as tap by tap; a test holds the Trials and Map batches to the one-by-one result.
- **Back beside the X:** inside a War Table mode the header carries a Back button next to the close button, so leaving a mode never needs a scroll to the top.

## Speed
Power, blessings and bond levels are worked out once per real change, not per use: `remember` keeps the last answer while the parts of the save it came from
(`family`, `fellows`, `companions`) are the same objects, and `bondLevel` reads a table. Those parts are replaced, never changed in place; keep it that way, or the
remembered values go stale (a test checks every kind of change shows at once). Before this, each of the eight buildings recomputed the whole roster's Power, and each
Fellow every Family bond level, on every one-second income tick: 88 ms a tick on a desktop with a full roster, now 2.5 ms; a 30-day simulation fell from 119 s to 4 s
with a byte-identical save.

## Testing on a phone

Open the game with `?roam=14` (any number 0-50) to set Roam charges on that device; the query is stripped after it applies, so a reload does not repeat it. `?reset=wartable` forgets today's and this week's War Table usage (the Spire floor, Arena rank and Gauntlet best stay). `?unlock=all` recruits every
Fellow (level 1) and welcomes every Family member (bond 0), leaving anyone already here untouched. Switches combine (`?roam=14&unlock=all`); those three are the only ones. The same three sit as buttons under "Testing switches" in the save
dialog (gear icon), through the `testing` action, so a phone needs no link.

## What we deliberately left out

Gacha and summons, the 50-term power formula, Stella, aptitude, awakening, familiars and turn-based
combat, the Drakenberg town facilities, crossover characters, idle video clips and Spine rigs.
Everything here should be explainable in one line. If a new system needs a paragraph, simplify it.

## Where things live

- `lib/cast.mjs`: areas, characters, buildings, player looks, blights
- `lib/game.mjs`: every formula and every action
- `lib/habits.mjs`: the habit journal (inherited from Everkai, adapted to eight areas)
- `lib/stories.mjs`: introductions, roaming scenes and village vignettes
- `app/`: screens. `page.tsx` wires them together.

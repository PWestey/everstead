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

- Each life area is a **skill, levelled 1–99 on RuneScape's own XP table** (level 2 = 83 XP, 92 = 6.5M, 99 = 13,034,431).
  Each one wears an OSRS skill's icon and cape: Faith/Prayer, Marriage/Hitpoints, Fatherhood/Farming, Fitness/Strength,
  Work/Smithing, Home/Construction, Discipline/Defence, Hobbies/Fishing.
- **Skill XP = lifetime habit points in the area × 500**, plus bonus XP from quests and adventures. Derived, never stored,
  so undo and old saves just work. ~4 points a day in an area ≈ level 37 in two weeks, 55 at three months, 69 at a year.
- **Total level** = sum of the eight (8 to 792). It unlocks the **seven armour tiers**: Bronze (8), Iron (150),
  Mithril (280), Rune (360), Dragon (440), Barrows (490), Saradomin (540). A skillcape at 99; the max cape at 792.
- Level-up message on every new level, RuneScape style.

## Power: half you, half your roster

- **Hero Power** = `25 × total level × (1 + 0.15 per armour tier above Bronze)`.
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
`app/modes-panel.tsx`. Family fight at `150 × bond level`; Fellows at their Fellow Power. Rewards are multiples of
10 minutes of village income. Franchise tags for the Arena are in `lib/franchises.mjs`.

| Mode | Roster | Cadence | Rule |
|---|---|---|---|
| Errands | Family | daily, 5 offers, 3 out | timed jobs (1/4/8h) paying gold, sigils or bond; +7% per daily done |
| The Rift | Fellows (3) | 1 run/day | climbs floors `250×1.17^f`; today's area ×2 |
| Blight Strikes | Family (3) | 3/day, bank 9 | each strike adds damage to this week's Blight |
| The Arena | Both (5) | 5 tries/day | franchise teams `600×1.12^r`; own franchise ×0.75 |
| Draft Gauntlet | Both | 1 run/day | everyone = 100 power; floors `240×1.06^f`; wounds carry; pick a draft or boon every 3 floors |
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
- Bond level from bond XP; level L → L+1 costs `100 × L^1.5`, no cap. Gifts cost `10% more per bond level` of the recipient (a posy is 500 gold at level 1, about 5,000 at level 25), so bond grows with the log of your gold.
- **Blessings:** your closest bond in each area blesses its Fellows (+3%/level) and its building (+2%/level); the family's **average** bond blesses every Fellow (+0.5%/level). Sums over 97 members would run away; the best and the average don't.
- Per Bond level: **+3%** Power to every Fellow in her area, **+0.5%** to every Fellow, **+2%** to her building's income.
- Bond sources: area habits, one visit per day (+30), gifts (gold or crystals; give ×1, ×5, ×10 or as many as you can afford), roaming scenes.

## Companions

32 creatures (16 Pokémon, 16 Aniimo), four per life area, in `lib/companions.mjs`. Art: `public/assets/companions/<stage>.webp`.

- **Starters:** one per area from the first day; the other three of each area turn up by themselves on days 10, 20 and 30. Sooner, they are **found**: every Map boss first-win, every 8th Map run (preferring the place's areas), and Gauntlet floors 10, 25 and 50.
- **EXP:** every completed habit gives all four companions of its area **+100 EXP**; a **treat** gives one companion **+250**. Treats drop 1 per Map run (2 from bosses), from the Rift (1/day), the Arena (1 per win), and every 5th Spire and Gauntlet floor. New saves start with 3.
- Level from lifetime EXP: level L→L+1 costs `25 × L^1.5`; no cap. No buying levels. Milestones ×1.15 at 10 and 25, ×1.25 at 40, then ×1.15 every 25 levels.
- **Evolve** (a tap) at level 10 and level 25 along the line.
- **Boost:** each companion gives every Fellow of its area `0.4% × Level^1.15 × milestones + 5% × (Stage − 1)` Power (adds with the Family area blessing). One maxed companion: +56%; four: +224%.

### Owning a miss

A due daily task you didn't do can be **owned** (task sheet → "I failed today"): you must write how you'll make it right
tomorrow (12–300 characters). The task leaves today's list, pays nothing, and its streak resets. Tomorrow the task shows
what you said until you complete it. Owned days don't count for Momentum, area points or the Hearth.

## Pace

From `node scripts/simulate.mjs` (a player who completes 8 hard daily habits, spends every Roam, runs the War Table and spends everything): the seven original regions fall in about 5 weeks, lap 1 (Nex) in about 3 months, and each lap after that takes longer than the last. A 4-habit player runs at roughly half that pace. Nothing caps, so the game never goes flat: Power, needs and rewards keep climbing together.

## The Hearth and the Collection Log

- **The Hearth** (top of Today): your streak, the days in a row with at least one completed habit, counting back from today or yesterday. One log per day (14 shown), the fire lit while the streak lives. Purely a mirror of the journal; it pays nothing itself.
- **Collection Log** (Hero screen → Log): every Fellow, Family member, companion, Map boss, skill at 99, quest, story chapter and mastered Archive card, with OSRS green/red counts. Also a mirror; no rewards attached.
- Level 99 in a skill fires the level-up card with fireworks.

## Expedition Map (replaced the Watchtower stages)

The daily 15 minutes: habits earn Roams, Roams buy runs, runs pay what Fellows need, Fellows raise Power,
Power opens and crushes more of the map. Old School RuneScape places and art (`public/assets/osrs/`).

- **Regions** (`lib/expedition-data.mjs`): Lumbridge → Asgarnia → Morytania → Karamja → Kharidian Desert →
  Fremennik Province → the Wilderness → Kandarin → Great Kourend → the God Wars Dungeon. Each has 4 adventures and a boss (50 places). Beating a region's boss
  opens the next region and grants a permanent perk (Roam storage, building income, Power or expedition loot).
- **Step k** = 5 × region + slot (boss is slot 4). **Need** = `400 × 1.3^k` Power (Count Draynor 1,100 … King Black Dragon 3M … Nex about 150M).
- **Loot per run** = gold `150 × 1.3^k`, and in each of the place's two areas sigils `3 + ⌊k/5⌋` and XP
  `250 × 1.3^k`. Bosses pay double.
- **Laps:** beating Nex starts lap 2: every need and every gold/EXP reward on the map is ×705 (25 steps' worth) per lap, regions re-open boss by boss, perks and companions are earned once. There is no last lap.
- **Outcome** from Power ÷ need: under 1 locked · Success 1× · Great (1.5+) 1.5× · Overwhelming (3+) 2×.
- **One Roam per run.** The first visit plays a short scene with a Fellow or Family member along
  (`lib/expeditions/scenes.mjs`); repeats are one tap and a result scroll.
- **Blights** (the vices): one rises each week, rotating through Sloth, Distraction, Doubt, Neglect,
  Pride and Excess. HP `60 × (1 + 0.25 × tier)`. Damage comes only from that week's habits.
  Defeat it for crystals and sigils; it returns one tier stronger next time round.

## Buildings

- Open for 150 gold. Income `0.02 × level` gold/second, then × Fellow staff, × Family blessing,
  × today's area boost, × Momentum. Upgrade cost `200 × 1.5^(level−1)`.
- Away earnings are capped at 12 hours.

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

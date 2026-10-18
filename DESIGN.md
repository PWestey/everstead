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
2. **Spend** gold on Fellow levels and buildings, sigils on stars, roams at the Village Gate.
3. **Grow Roster Power**, clear stages at the Watchtower, and push back the weekly Blight.
4. **Momentum** multiplies all building income: `1 + 0.5 × areas touched this week / 6 + min(0.5, 0.07 × dailies today)`.

## Six life areas

| Area | Stat | Fellow | Family | Building |
|---|---|---|---|---|
| Faith | Spirit | Aldric, Chapel Warden | Ariane Lumenhart, Wizard of Light | Chapel |
| Family | Heart | Bram, Hearthguard | Tyrande Whisperwind, High Priestess of the Moon | Hearth Inn |
| Fitness | Might | Darrow of Lykos, The Reaper | Kira Carsen, Blade Dancer | Training Yard |
| Work | Craft | Corin, Quartermaster | Shallan Davar, Scholar & Artist | Market |
| Home | Hearth | Tobin, Master Builder | Kate Bishop, Archer | Workshop |
| Discipline | Will | Kaladin Stormblessed, Windrunner | Violet Sorrengail, Dragon Rider | Library |

Names are placeholders. Rename anyone in `lib/cast.mjs`.

## You

- Level from XP. Level L → L+1 costs `60 × L` XP. No cap.
- **Five looks**: Wanderer (1), Squire (8), Knight (18), Champion (32), Legend of Everstead (50).
  At a steady routine (~300 XP/day) that is Squire in about a week, Champion around six months.
- Your stats are lifetime habit points per area, drawn as a hexagon on the Hero screen.
- Your Power: `150 × Level`.

## Fellows (Power)

- **Recruit** when their area reaches 3 habit points.
- `Fellow Power = 100 × Level × (1 + 0.25 × Stars)`
- Level cost: `50 × Level^1.5` gold. Level cap: `20 + 20 × Stars`.
- Stars 1–5 cost `15 × n²` sigils of the Fellow's own area (825 total).
- A recruited Fellow works at their area's building: +25% income.

## Family (Blessings)

- **Welcome** when their area reaches 15 points and you are level 3.
- Bond level from bond XP; level L → L+1 costs `100 × L`.
- Per Bond level: **+3%** Power to her linked Fellow, **+0.5%** to every Fellow, **+2%** to her building's income.
- Bond sources: area habits, one visit per day (+30), gifts (gold or crystals), roaming scenes.

## Roster Power

`(Your Power + Σ Fellow Power × (1 + linked blessing)) × (1 + Σ everyone blessing)`

## Watchtower

- **Stages**: stage n needs `300 × 1.12^(n−1)` Roster Power. Reward `100 × n` gold, +10 crystals every 5th.
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
- `lib/habits.mjs`: the habit journal (inherited from Everkai, adapted to six areas)
- `lib/stories.mjs`: introductions, roaming scenes and village vignettes
- `app/`: screens. `page.tsx` wires them together.

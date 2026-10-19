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

## You

- Level from XP. Level L → L+1 costs `60 × L` XP. No cap.
- **Seven armour tiers** (RuneScape style): Bronze (1), Iron (6), Mithril (12), Rune (20), Dragon (30), Barrows (42), Saradomin (56).
  At a steady routine (~300 XP/day): Iron in ~3 days, Rune ~5 weeks, Dragon ~3 months, Saradomin ~10 months.
- Your stats are lifetime habit points per area, drawn as a hexagon on the Hero screen.
- Your Power: `150 × Level`.

## Fellows (Power)

- **Recruit** by lifetime habit points in their area. The join queue per area is 3, 30, 90, 180, 300, 450… points for the 1st, 2nd, 3rd… Fellow.
- `Fellow Power = 100 × Level × (1 + 0.25 × Stars)`
- Level cost: `50 × Level^1.5` gold. Level cap: `20 + 20 × Stars`.
- Stars 1–5 cost `15 × n²` sigils of the Fellow's own area (825 total).
- Every recruited Fellow works at their area's building: +25% income each.

## Family (Blessings)

- **Welcome** by area points and your level. Queue: 15, 60, 150, 280, 450… points, and level 3, 7, 11, 15… for the 1st, 2nd, 3rd… Family member.
- Bond level from bond XP; level L → L+1 costs `100 × L`.
- Per Bond level: **+3%** Power to every Fellow in her area, **+0.5%** to every Fellow, **+2%** to her building's income.
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
- `lib/habits.mjs`: the habit journal (inherited from Everkai, adapted to eight areas)
- `lib/stories.mjs`: introductions, roaming scenes and village vignettes
- `app/`: screens. `page.tsx` wires them together.

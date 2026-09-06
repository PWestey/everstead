# Public Village activities — first release

Date: 2026-09-06. Base: c303494. No private facility policy gates enabled.

## Player-facing scope

Every mapped building now opens a playable, themed activity: Command Center
petitions, Archives discoveries, Training drills, Hearth gatherings, Restaurant
service, Apothecary cases, Schoolhouse lessons, Market orders, Gatehouse arrivals,
Gardens cultivation, and Forge commissions. Fishing and Waystone reflections
bring the total to 13 locations. Each has three two- or three-step choice scenarios,
an introduction, progress, and a manual reward claim. The original four buildings
retain a Building tab for their existing passive upgrades.

These are initial multi-step choice activities, not full restaurant inventory,
persistent pupil graduation, crafting supply chains, or a fishing collection.
Those deeper systems and Family's independent support economy remain future work.

## Economy and persistence

- Three initial opportunities per location; one replenishes every 30 minutes,
  up to 12 banked/engaged opportunities. Offline accrual is capped at 24 hours.
- Pending rewards do not expire. One claim pays 40–100 Gold depending on location
  plus three Village Training points. Passive Gold continues automatically.
- Training points are manually spent on an owned, available Fellow. Cost is
  10 + 2 × that Fellow's current mastery level. Each purchase adds 50 flat combat
  Power after existing bonuses, once. It does not multiply boosted totals,
  increase passive earnings, spend EXP, or alter the Fellow's level or rank.
- Optional versioned `villageActivities` root retains schema 15 and namespace.
  Activation identity/timestamp, exact fields, accounting totals, actors and
  timestamps are validated. Both ordinary and null-prototype parsed saves work.
- Activity state and claim Gold use the existing staged atomic transaction path.
  Replay and stale state are refused. No direct production storage writes or QA grants.

## Verification

- Engine: 1,187 assertions, including all scenario variants, bank limits,
  malformed state, null-prototype loading, claim replay and training conservation.
- Integration safety: 39 assertions covering pre-extension saves, ownership,
  interrupted staging/active writes, exactly-once recovery and reloads.
- Real public controls: all 13 activities at 390×844 and 320×568, pending-claim
  reload, manual training, Campaign, manual EXP investment, and final reload.
- Existing regression: 30 public Campaign/EXP wallet checks; consecutive stage
  credits; automatic Gold, horizontal camera, 24-hour offline cap and replay.
- Primary reviewed mobile screenshots. Fishing clears recenter controls;
  training purchase and close buttons remain visible on the small layout.

## Remaining limits

Activities share the same choice engine and currently unlock together, with
individual tutorials. Story-paced unlocks and richer facility-specific resource
loops can build on this release. Browser storage still lacks cross-process CAS;
existing stale-write detection is retained. Numerical safety ceilings are not
changes to uncapped Collection bonus policy.

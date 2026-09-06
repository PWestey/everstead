# Restaurant kitchen — 2026-09-06

Replaces the Restaurant's multiple-choice activity with persistent recipe and
ingredient management. Other Village activities are unchanged.

## Play loop

1. Read the kitchen introduction and unlock Hearthbread free.
2. Unpack deliveries in Pantry. A crate contains four Grain, three Vegetables,
   two Herbs, and two Fish. Three crates start available; one arrives every
   30 minutes, banking up to six.
3. Choose an unlocked dish, spend its ingredients and serve a waiting customer.
   Four customers start available; one arrives every 15 minutes, banking up to 12.
4. Collect the table's payment: dish-dependent Gold and two Chef Notes. Unclaimed
   payment and ingredients never expire. Cooking is immediate; there is no
   timed cooking minigame or correct-answer quiz.
5. Invest Chef Notes in recipes. Soup unlocks for four Notes, River Fish for eight,
   and Covenant Feast for twelve. Upgrades cost three times the current level.
   Each recipe has ten levels in this release.

Each unlocked/upgraded level adds 120 Village Gold/hour and ten flat Power to
each owned Fellow. These are additive after existing bonuses, not percentage
multipliers. Earnings are evenly attributed across the four existing building
production lines; the Restaurant displays the total contribution. At four
mastered recipes the contribution is 4,800 Gold/hour and 400 Power per owned
Fellow. This does not cap or alter Collection pools, EXP, or Village Mastery.

## Preservation and validation

Optional `restaurantKitchen` version 1 is initialized once with activation time.
No old fields, XP investments, or backups are reset. Its zero-recipe initial state
has no bonus. Pre-change production is settled before recipe unlocks/upgrades,
so new rates do not retroactively apply to the elapsed period. Existing Restaurant
quiz sessions and pending rewards remain accessible through a finish/claim button;
starting another quiz is disabled. Prior Training points remain intact.

Pantry quantities reconcile against delivered crates and cooked dish counts.
Chef Notes reconcile against served tables and cumulative recipe costs. Gold
reconciles against the dish level at cooking time, not its later upgrade level.
Pending payments use monotonic IDs and the host's existing staged transaction.
Ordinary and null-prototype loaded objects are validated. Offline elapsed time
remains capped at 24 hours.

## Checked

- 3,322 engine accounting assertions, all dishes through level ten, replay
  refusal, malformed balances, bank limits, and null-prototype loading.
- Public controls at 390×844 and 320×568 on fresh and supplied diagnostic saves:
  tutorial, deliveries, ingredient spending, pending-payment reload, claims,
  unlocks, upgrades, exact bonuses, and reload persistence.
- With the supplied save: one-hour automatic Gold includes recipe earnings
  exactly once; subsequent Adventure clear and reload do not trigger protection.
- Interrupted staging and active writes recover without duplicate payments.
- Existing automatic Gold and 24-hour cap regression retained.

This is the Restaurant redesign only. Persistent School pupils, fishing
collections, and replacement of other quiz activities remain separate work.

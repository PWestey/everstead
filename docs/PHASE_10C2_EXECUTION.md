# EVERSTEAD — PHASE 10C-2 EXECUTION CONTRACT

## Scope

Phase 10C-2 activates only the selected economy engine already authorized by
Phase 10C-1. The candidate must remain one additive production block on exact
base `2901ee49054a75c92af6c810599a54ae6b98b499`. No save-schema, reward, RNG,
combat-Power, UI, or embedded-asset rewrite is authorized.

## Selected executable profile

- Profile: `everstead-economy-v1`
- Identity: `6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f`
- Fresh Gold: 50,000 (owned by schema 11, unchanged here)
- Building cost: `round(15000 × 1.24^(level − 1))`; level cap 52
- Fellow roster: floor rational curve, 1,500 bps numerator/cap, 100,000 knee
- Companion roster: floor rational curve, 1,000 bps numerator/cap, 25,000 knee

Fellow economy Power is disjoint from combat-only Bond, Companion transfer, and
Family-to-Fellow Bond. It uses base, Level, rarity, Relic, and global Might, then
rounds each owned Fellow locally. Companion economy Power is the existing
effective Companion Power (including Mastery once), rounded locally. Family
Building assignment and the daily Oath multiplier remain direct Building factors
exactly once. Prosperity and overall-day remain neutral.

The required Building factor order is base, Level, Family assignment, Fellow
roster, Companion roster, overall-day, then Oath.

## Floating-point oracle

The byte-frozen Phase 10B-2 private Gold core and its production operation order
are the executable exact oracle. JavaScript Float64 results are asserted with
`Object.is`. Earlier hand-worked advisory decimal spellings are not used to
rewrite arithmetic; the gate separately proves each such representation differs
by no more than one IEEE-754 ULP.

## Transition and conservation rules

Offline Gold is segmented at local midnight and at `economyProfile.activatedAt`.
Pre-activation time uses the released rate; post-activation time uses the selected
profile. The earliest 24 hours are claimable, while `nextLastGoldAt` advances to
the observed current time. Rollback/future timestamps accrue zero without moving
the trusted clock backward. Preview is pure. Pending fractional Gold plus claimed
whole Gold is conserved.

Gold segmentation must not duplicate Family idle-drop settlement and must not
move Companion Tower or Fellow Expedition cursors. A failed active write followed
by reload may settle each Gold interval and each Family roll ordinal only once.

## Protected boundaries

- Schema remains 11 with thirteen protected slots and the exact profile identity.
- Schema-10 migration retains Gold and backlog policy plus the exact pre-v11 raw.
- The Phase 10B-2 private Gold core remains byte-identical.
- The five embedded assets remain byte-identical.
- No native storage, browser bridge, live-browser runner, or player-facing UI is
  part of this gate.
- EXP/reward tuning, Bond redesign, bad-luck changes, balancing changes outside
  the selected profile, and UI copy belong to later authorization.

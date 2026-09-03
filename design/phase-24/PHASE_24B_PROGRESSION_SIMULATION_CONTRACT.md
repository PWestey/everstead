# Phase 24B deterministic progression-simulation contract

**Status:** output-only candidate analysis; no production or balance authority  
**Contract ID:** `phase-24b-progression-simulation-v1`  
**Candidate ID:** `phase24b.provisional-progression.v1`  
**Baseline:** frozen Phase 24A report `phase-24a-balance-baseline-v1`

## Purpose and boundary

Phase 24B answers whether a finite Level-750 Fellow lane and Level-500
Companion lane can satisfy the accepted pacing shape without unsafe numbers,
retroactive loss, or making roster breadth irrelevant. It does not install the
candidate tables, change a save, add a reward source, create a currency, or
authorize a balance decision.

The only candidate input is
`design/phase-24/phase24b-progression-candidates.json`. Every EXP band,
Breakthrough requirement, post-500 Fellow multiplier, throughput budget, and
rounding policy in it is explicitly provisional until root review accepts an
exact release table. The generated machine report expands the finite bands to
all 749 Fellow and 499 Companion level transitions and hashes those tables.
There is no infinite extrapolation.

Production runtime files are out of scope. The simulator may read only the
candidate manifest and the frozen Phase 24A machine report. It must fail closed
if the baseline report hash, authority identity, three canonical anchors,
released requirement tables, or zero-Collection baseline differs.

## Live throughput and proposed budget are different evidence

`current-live-throughput` is deliberately a set of static bounds calculated
from released mechanics: the fresh starting Gold, fresh Gold/hour, accessible
fixed stage requirements, current Campaign cost-efficiency rule,
first-clear/replay EXP, and released Companion Tower clear/idle EXP. It is not
an exact horizon forecast. Earned EXP raising old-curve Levels and Power,
Rank-crossing Fellow joins changing roster Power, newly accessible stages, and
the complete Rank-3 route are not modeled. The Campaign result is a
conservative achievable lower bound because the player can keep replaying the
already-open stage. Conditional Tower rows are upper envelopes. A later exact
live projection must simulate the full feedback loop with one conserved Gold
ledger.

Replays are Gold-limited, never invented as a daily allowance. Companion
Campaign spends the exact first-two-Fellow-clear Gold prerequisite that reaches
Rank 2. Tower requires Rank 3; because the frozen fresh profile does not prove
that complete unlock path, all Tower values remain power-only upper envelopes
and are excluded from the static Campaign lower bound.
Tower clear EXP is one target-specific account reward per floor; idle EXP is
the only Tower EXP multiplied across every Companion. The floor-50 result is
separately labeled as an unavailable-at-fresh upper envelope.

`proposed-launch-exp-budget` is a provisional prerequisite. It is not present
in the live game. It may be used to test the handoff targets only when the
report visibly states the new authored EXP and Breakthrough-material throughput
that would be required. A candidate fails product readiness if its target fit
depends on this budget but no permanent reward-source plan exists.

The candidate's 5M Level-550→600 and 17.5M Level-600→650 bands are exactly
one-fortieth of the cited 200M / 700M external absolute values. This preserves
the evidence-backed 3.5× widening while deliberately testing an Everstead-sized
absolute scale. The divisor is a provisional hypothesis chosen to fit the
accepted first-week and early-established targets; it is not evidence by itself
and may be replaced after authored reward-source simulation.

The normalized Breakthrough unit is not a new currency. It is an abstract
throughput measure. A later accepted gate table must map every requirement to
existing materials or fixed authored claim bundles and re-run the simulation.

## Progression rules under simulation

- Fellow Levels are finite from 1 through 750. The existing linear multiplier
  is preserved through Level 500; authored anchors from 550 through 750 are
  linearly expanded into a finite lookup table.
- Companion Levels are finite from 1 through 500 and use the currently proposed
  linear Power shape only as a simulation fixture.
- EXP costs are authored by 50-level band. A versioned integer allocator expands
  each exact band total into monotonic per-transition costs whose sum is exact.
- Breakthroughs occur every 50 levels below the cap. EXP at a closed gate remains
  banked. The simulation assumes an immediate manual claim only when the
  provisional requirement is available.
- Focused investment directs 75% of Fellow EXP to one of the six fresh joined
  Fellows and 60% of Companion EXP to one Companion. Broad investment divides
  account throughput deterministically across all 18 Fellows and 20 Companions.
  The 18-Fellow broad matrix is a synthetic full-roster prerequisite, not a
  fresh-save assertion. Day 1 and Day 7 additionally expose equal investment
  across the six Fellows that are actually joined on a fresh save.
- Collection stress is evaluated at exactly 0%, 25%, 50%, 100%, 250%, 500%, and
  1,000%. Collection EXP affects only newly earned eligible EXP. Collection
  Power adds beside Might in the Fellow final bonus pool. Collection Earnings
  adds beside Oath. Facility-local bonus affects only the normalized active
  facility reward. No pool multiplies an already-boosted total.
- The Collection pools are uncapped and additive. The stress ceiling is a test
  boundary, not a lifetime cap. Synthetic claims apply once, replay as no-ops,
  and accept a later additional grant without clipping. Mandatory reachability
  is assessed at zero Collection, which is stricter than the required
  permanent-only profile and cannot accidentally assume a limited-event bonus.
- Mandatory reachability never assumes a limited Collection. Requirements are
  the frozen released tables, not player-relative or server-relative curves.
- Nonzero adjacent-bonus probes must distinguish the required additive order
  from forbidden compounding: Collection Power beside Might, Earnings beside
  Oath, EXP beside an authored EXP bonus, and facility bonus beside an authored
  active-facility bonus.
- A never-rerun limited mechanical entitlement requires an equivalent permanent
  source. Owning both sources applies the mechanical entitlement only once;
  limited art and title metadata remains independently exclusive.

## Existing-save migration simulation

Raw Phase 23 EXP is tied to the old exponential table and must never be read
directly under the new table. Six recipes are mandatory: Fellow mid-level,
Level 120 exact cap, Level 120 with attributed surplus; Companion mid-level,
Level 100 exact cap, and Level 100 with attributed surplus.

For a below-cap save, migration preserves the saved Level and its exact rational
within-level progress. The integer amount mapped into the new level cost and
its division remainder are both recorded, so rounding cannot silently destroy
progress. Gates strictly below the saved Level are grandfathered.

For a former-cap save, the new active EXP is placed at the exact new threshold
for the same Level. Post-cap EXP that is distinguishable from migration
baseline by an existing ledger or receipt is retained byte-for-byte as a
separate auditable bank; it is not discarded and is not automatically allowed
to create a multi-band jump. Unknown lineage fails closed for manual review.
Companion Level 100 additionally queues a free, manual, exactly-once legacy
Breakthrough claim. Fellow Level 120 has gates 50 and 100 grandfathered and
next encounters the ordinary Level-150 gate.

Every migration result contains a stable receipt identity. Reapplying the same
receipt is a no-op and must reproduce the identical result.

Manual Breakthrough behavior requires a separate lifecycle fixture rather than
the progression loop's convenience auto-consumption. EXP earned at a closed
gate banks without changing Level. An insufficient-material claim is a no-op;
adding the exact requirement permits one manual claim and one receipt; banked
EXP then advances as far as allowed. Serialize/reload must refuse replay without
a second spend. Rarity, Relic, valid Fellow↔Companion assignment, Might,
Mastery, and unrelated state remain unchanged except for the intended Level and
derived-Power advancement. The migrated Companion Level-100 legacy gate is
queued, never auto-claimed, costs zero units once, survives migration
reapplication without a duplicate entitlement, and next encounters Level 150.

## Reachability and known authority discrepancy

The simulator reports released Fellow Campaign, Companion Campaign, Companion
Tower, and Fellow Expedition reachability. The current Expedition consumes one
distinct Fellow per consecutive stage, so the report must expose the structural
ceiling of six stages for the focused fresh roster and eighteen for the complete
roster even though the released table contains 50 requirements.

Appendix C contains a stale prose Broken Roads table beginning
`22K / 26K / 30.5K`. Phase 24A and the accepted runtime freeze the released
schema-13 table as `22K / 28.5K / 36K / 45K / 56K / 69K / 84K / 101K /
121K / 144K`. Phase 24B must use the frozen runtime table and flag the prose
discrepancy. It must not silently reprice existing content.

## Required machine and human evidence

The generated report must contain:

- the candidate, baseline, expanded-table, and requirement hashes;
- all per-level EXP costs, cumulative EXP, Level multipliers, and Breakthroughs;
- released-mechanics frozen-fresh Campaign lower bounds, conditional Tower
  upper envelopes, their gap to the proposed launch budget, and an explicit
  unmodeled dynamic-feedback gap at 1, 7, 30, 90, and 365 days;
- focused and broad results for every horizon and all seven Collection stresses;
- min, median, maximum, banked EXP, completed gates, and next closed gate;
- Campaign, Tower, and Expedition reachability using released requirements;
- Companion Level-500 aggregate-unrounded theory and the actual
  round-each-member-before-sum totals; only the latter may drive reachability;
- zero-Collection proof that all Phase 24A anchors remain unchanged;
- the six before/after migration recipes, exact progress evidence, grandfathered
  gates, legacy claim state, surplus bank, and twice-applied no-op proof;
- manual Fellow and free legacy Companion Breakthrough lifecycles covering
  closed-gate EXP banking, insufficient-material refusal, exact spend, stable
  receipt, persisted replay refusal, intended Level/Power advancement, and
  preservation of unrelated progression and assignment state;
- synthetic Collection claim/replay/future-addition evidence showing no cap,
  no duplicate grant, and no limited-content dependency;
- provenance-composed permanent-only and mixed permanent-plus-limited ownership
  fixtures at all seven stress totals; mandatory requirement authoring reads
  only the versioned permanent-only fixture while runtime account totals may
  include limited grants;
- an old-cap-shaped Collection-ledger migration that reconstructs exact named
  pools from unique claim provenance, ignores obsolete display caps, replays as
  a no-op, loses nothing, and still accepts a future grant;
- a delayed-claim fixture whose captured reward remains byte-stable after
  later Level, Oath, Collection, economy, authored-EXP, and facility growth,
  then applies both its Fellow-EXP and active-facility values exactly once.
  Oath is irrelevant to the active-facility lane. Ready and claimed records
  survive migration; reload rehydrates the claimed receipt; replay after reload
  pays zero; a second migration is byte-identical;
- zero-Collection, permanent-only, and all-content ownership fixtures with the
  same frozen requirement hashes; limited-event basis points must never enter
  the requirement-authoring assumption;
- maximum safe-integer observations and headroom at the Level caps, 365-day
  throughput, and +1,000% Collection stress, including true-high Building Gold
  accumulated through 365 separate 24-hour claims with Collection Earnings
  added beside Oath;
- findings that distinguish a mathematical pass from prerequisites that remain
  unimplemented.

## Acceptance boundary

Phase 24B passes as a simulation lane only when two generations are
byte-identical, `--check` succeeds, independent QA recomputes representative
rows, all tables are monotonic and safe, zero bonuses preserve Phase 24A, every
migration fixture is lossless and repeat-safe, and no production file changes.

A Phase 24B pass does **not** approve the candidate curve. Runtime adoption
requires a later explicit balance decision, authored permanent EXP/material
sources, an exact save migration, real-browser progression tests, and separate
approval to change production.

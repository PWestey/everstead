# Phase 24B progression-simulation independent QA contract

**Status:** predeclared independent gate; candidate numbers remain provisional  
**Contract ID:** `phase-24b-progression-simulation-independent-v1`  
**Authority:** the September 1, 2026 Everstead Product Handoff and the accepted Phase 24A output-preserving baseline

## Purpose

Phase 24B may model longer progression, but it does not yet authorize a live
balance change. This gate verifies the simulation method, table completeness,
formula boundaries, pacing evidence, and migration safety independently of the
model lane. It reads the model-owned contract, machine candidate, generator,
and generated reports, then recomputes representative results without trusting
the candidate's own pass/fail fields.

The model lane owns:

- `design/phase-24/PHASE_24B_PROGRESSION_SIMULATION_CONTRACT.md`;
- `design/phase-24/phase24b-progression-candidates.json`;
- `scripts/phase24b-simulate-progression.mjs`;
- `qa/phase-24b-progression/reports/**`.

This independent lane owns only this contract, its result document, and
`qa/phase-24b-independent/**`.

## Non-negotiable baseline

Every simulation starts at zero Collection bonus and preserves the accepted
Phase 24A identities. It must distinguish all of these profiles:

| Profile | Fellow Economy | Fellow Combat | Companion actual | Companion floor/effective | Village Gold/hour |
|---|---:|---:|---:|---:|---:|
| Genuine fresh schema 13 | 35,150 | 35,565 | 2,200 | 0 / 2,200 | 27,320.8092192 |
| Migrated established schema 13 | 35,150 | 36,645 | 2,272 | 2,892 / 2,892 | 27,328.94041242 |
| True high investment | 3,196,916 | 3,588,268 | 50,355 | 0 / 50,355 | 60,337,645.45902187 |

The separate freshly migrated schema-12 historical fixture remains 36,366
Fellow Combat Power. It must not be mislabeled as either genuine fresh or the
invested migrated-established fixture.

Current Broken Roads reachability uses the accepted runtime table
`22,000 / 28,500 / 36,000 / 45,000 / 56,000 / 69,000 / 84,000 / 101,000 /
121,000 / 144,000`. Appendix C's conflicting prose label
`22,000 / 26,000 / ... / 95,000` is not runtime authority and must never
silently reprice current content.

## Required authored data

The candidate must contain an explicit, versioned row for every Fellow Level
1–750 and every Companion Level 1–500. A runtime formula that extrapolates the
old 12% exponential indefinitely is not an authored table.

For each level lane, independent QA requires:

- consecutive, unique integer levels with no gaps;
- finite, non-negative, JavaScript-safe integer EXP costs and cumulative EXP;
- exact cumulative recurrence from the per-level cost;
- a monotonic Level multiplier/Power index;
- a terminal cap row with no invented Level 751 or 501 cost;
- manual Breakthrough gates every 50 levels before the cap;
- a fixed material requirement and visible preview identity for every gate;
- banked EXP that is neither discarded nor silently spent while a gate is
  closed;
- no reset of Level, Power, rarity, Relic, assignment, Might, Mastery, or other
  earned state when the gate is claimed.

The report must exercise the manual lifecycle rather than infer it from a loop
that automatically consumes materials: close a gate with surplus EXP banked;
prove an insufficient-material claim is a no-op; claim once with the exact
material spend and a stable receipt; advance from the retained bank; then
serialize/reload and refuse the same receipt without another spend. It must run
the same idempotency check for the free former-cap Companion Level-100 legacy
gate and prove rarity, Relic, assignment, Might, and Mastery state is unchanged.

The Fellow lane must preserve the existing linear anchors through the current
range and model the documented high-level shape without adding Aptitude. The
Companion lane must retain five rarity stars and Mastery 0–50. Its Level-500
complete-roster reference fixtures must distinguish theoretical aggregation
from gameplay's member-round-then-sum rule. Aggregate-unrounded totals are
111,980 at ★1/Mastery 0, 156,772 at ★5/Mastery 0, and 235,158 at ★5/Mastery
50; actual gameplay totals are 111,985, 156,775, and 235,155 respectively.
Reachability uses the actual rounded-member sum, mirroring Phase 24A's 50,355
actual versus 50,358 aggregate-unrounded distinction. These are simulation
fixtures, not automatic release approval.

## Horizon methodology

Both focused and broad investment strategies must be simulated at exactly 1,
7, 30, 90, and 365 days from disclosed deterministic inputs. The report must
show available, spent, and banked EXP; levels reached; closed gates; material
constraints; roster distribution; and conservation of every input.

All eight handoff pacing cells must be assessed explicitly: focused and broad
for the first substantial session, end of the first week, early-established,
and long-term fixtures. The current fresh save has six joined Fellows, not the
full 18-member catalog. A day-one or first-week broad result therefore uses the
six actually joined Fellows. A separate 18-Fellow scenario is useful only when
it is labeled a synthetic full-roster prerequisite; it cannot produce a
fresh-save PASS.

Current-live throughput and a proposed launch-budget envelope are different
fixtures. The current low-hundreds Campaign rewards do not support a focused
Fellow reaching Level 450–550 in one week by themselves. A candidate may use a
new authored source or launch grant to explore the accepted pacing target only
when that prerequisite is named, quantified, and reported separately. It must
not tune an EXP table around invented income and then label that result
reachable from current live rewards.

The current-live fixture is recomputed from released Gold/hour, stage
access/cost/efficiency, first-clear and replay EXP, and Companion Campaign/Tower
EXP. Fellow Campaign replays are Gold-limited, not subject to an invented daily
attempt cap. An honestly reported pacing-target miss is evidence and does not by
itself fail this gate; unexplained daily EXP, omitted Gold conservation, or a
false current-live reachability label does.

Current progression is a feedback loop: earned EXP raises old-curve Levels and
Power, Rank crossings join additional Fellows, and the changed roster can open
later stages or floors. Companion Campaign unlocks at Rank 2 and Tower at Rank
3, so neither may be counted from a fresh Rank-1 save without paying and proving
the shared unlock path. Companion Campaign rewards rotate one target per clear;
Tower clear EXP rotates one target per floor; Tower idle EXP is awarded per
Companion. A simulator that does not model this loop may publish a frozen-fresh
lower or power-only upper envelope, but it must label the omission and may not
call that envelope an exact reachable live forecast.

The documented pacing reference bands are:

- day 1: focused Fellow 100–250; broader useful roster 50–150;
- day 7: focused Fellow 450–550; broader useful roster 250–400;
- early-established fixture: focused 600–650; broader 400–500;
- long-horizon fixture: focused 700–750; broader 500–650;
- days 30, 90, and 365 must all be present and monotonic; a report may label
  when its disclosed fixture first enters the early-established and long-term
  reference bands, but QA does not invent a calendar deadline for those two
  product labels.

These targets are balance evidence, not login deadlines. A miss remains visible
evidence rather than a mechanical gate failure; it must not be hidden by
changing throughput or a target inside the verifier.

## Collection and requirement isolation

The candidate must exercise Collection Power, Earnings, EXP, and every modeled
facility-local pool at cumulative totals of 0%, 25%, 50%, 100%, 250%, 500%, and
1,000%. All grants use integer basis points and accumulate additively without a
lifetime cap.

Independent recomputation must prove:

- Collection Power adds beside Might against the named Level-adjusted base;
- Collection Earnings adds beside Oath against structural Building earnings;
- Collection EXP applies once to newly settled eligible Fellow or Companion
  EXP, never to an already-boosted or previously captured value;
- a facility collection bonus adds beside its existing authored active bonus;
- no pool multiplies another pool or an already-boosted final total;
- values remain monotonic, finite, and within safe-integer precision through
  +1,000% cumulative bonuses.

Every mandatory Campaign, Book, Rank, Tower, Expedition, and progression
requirement must be evaluated with limited-event collection ownership set to
zero. The report must include zero-collection, permanent-only, and all-content
profiles and prove that limited ownership never changes the frozen mandatory
requirement itself. Future content may use simulations to author a fixed table;
the runtime may not scale from server age, another player, a leader, spending,
or the evaluating profile.

## Claim and migration safety

Delayed manual claims use values captured when the reward became ready. A later
Level, economy, Oath, Collection, or facility change must not reprice the old
claim. The simulation must cover ready, delayed, claimed, replayed, and migrated
cases, including an exactly-once receipt. Idempotency must survive persistence:
after a ready record is migrated and claimed, a serialized/reloaded claimed
record must rehydrate the receipt ledger and refuse a replay without paying
again. Applying either the ready or claimed migration a second time must be a
no-op; an in-memory Set that disappears on reload is not sufficient evidence.

Any eventual threshold or reward change needs its own versioned migration and
before/after impact report. Phase 24B simulation may propose tables, but it must
not bump the save schema, mutate production state, grant catch-up value, or
activate Collection bonuses.

Existing Phase 23 `exp` is cumulative under the old curve. It may include a
synthetic migration threshold value plus genuinely earned post-cap surplus, so
it is not table-independent and must never be reinterpreted unchanged under a
radically cheaper table. The migration simulation must cover Fellow mid-level,
Level 120, and excess-at-cap recipes plus Companion mid-level, Level 100, and
excess-at-cap recipes. Each recipe preserves the displayed Level and its
within-level progress deterministically, retains auditable post-cap surplus as
banked EXP, distinguishes a converted baseline from genuinely earned
increments when lineage permits, runs exactly once, and causes neither loss nor
a giant accidental level jump.

Breakthrough boundaries already below a saved Level are grandfathered without
retroactive materials. A Fellow saved at Level 120 has the Level-50 and
Level-100 gates satisfied and next encounters Level 150. A Companion saved at
the former Level-100 cap retains its Level and EXP and receives one free,
manual, exactly-once legacy Breakthrough claim for the new Level-100 boundary.
Replaying migration must not duplicate that claim. Silent retroactive costs,
automatic claiming, lost banked EXP, or forced downgrade are failures.

## Forbidden shortcuts

The gate fails if it finds or requires:

- an Aptitude or Blessing-Power progression stat;
- a new currency;
- dynamic/server-relative requirements;
- stamina, ranking, gacha, or paid-acquisition assumptions;
- a hidden collection cap, overflow conversion, or discarded future grant;
- old exponential EXP extrapolation to Level 750/500;
- a wrapper that overrides live numbers instead of a versioned candidate table;
- silent repricing of Broken Roads or delayed rewards;
- unsafe integers, non-finite values, negative costs, non-monotonic cumulative
  totals, or duplicate/missing level rows.

## Acceptance boundary

A PASS means only that the candidate simulation and its generated reports are
complete, reproducible, internally safe, and faithful to the accepted design
constraints. Exact EXP costs, material quantities, pacing results, and future
Power multipliers remain provisional until the root review explicitly freezes
them. This gate does not authorize implementation, schema migration, commit,
merge, push, deployment, public release, or artwork distribution.

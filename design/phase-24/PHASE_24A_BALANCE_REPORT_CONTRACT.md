# Phase 24A deterministic balance-report contract

**Status:** additive audit infrastructure; no balance, save, or production changes  
**Contract ID:** `phase-24a-balance-baseline-v1`  
**Frozen clock:** `1800000000000`  
**Authority:** the versioned read-only Phase 24 runtime authority

## Purpose

Phase 24A freezes the accepted post-Phase-23 game math before any scaling change.
The report is an observation layer, not a second balance engine. It must consume
the versioned runtime authority and fail closed if that authority, any formula
order, or any fixed table differs from its declared manifest.

The runtime authority has three named profiles:

1. `phase24a.fresh.schema13.v1` — the canonical true no-save schema-13 profile.
2. `phase24a.migrated-established.schema13.v1` — the genuine schema-12 invested fixture
   after its authenticated schema-13 migration.
3. `phase24a.true-high-investment.schema13.v1` — a pure, non-persisted evaluation of every
   currently released investment cap.

The existing all-unlocked QA fixture is retained as separate near-cap regression
evidence. It is not a fourth authority profile and is not the high-investment
profile.

The exact recipe data lives in
`qa/phase-24-baseline/fixtures/recipes.json`. Generated results must not be
hand-edited.

## Authority boundary

The generator may contain fixture inputs, labels, invariant assertions, output
normalization, and stable serialization. It must not restate production
formulas for:

- Fellow or Companion EXP, Level, rarity, Power, Relics, Family links,
  Companion transfer, Might, or Mastery;
- Building production, Oath boosts, roster bonuses, upgrade costs, or offline
  Gold;
- Campaign efficiency, Rank access, Tower requirements, Expedition
  requirements, or idle settlement;
- facility generation, banking, rewards, achievements, or claim readiness.

All those values must come from the runtime authority. Missing evaluators,
unknown config identities, changed formula-order arrays, non-safe integers, or
non-finite output are fatal report errors.

Legacy-only inputs may appear in the authority manifest for migration auditing,
but must be explicitly labeled `legacy` and must never be selected as the active
schema-13 value. In particular, Building upgrade growth `1.70` and Companion
bases `1000/1200` are predecessor facts, not active Phase 24 values.

## Required report shape

Every profile result must contain:

- profile ID, recipe hash, authority config ID, authority manifest hash, and
  fixed-table hashes;
- persisted/non-persisted status, schema/source description, joined roster,
  Rank, and validation status where applicable;
- Fellow Economy Power and Combat Power with unrounded component detail;
- Companion actual Power, migration-floor Power, effective threshold Power,
  Economy Power, and an explicit `migrationFloorApplied` boolean;
- per-Building base rate, level, every multiplier, Oath boost, exact Gold/hour,
  next cost or cap status, plus exact Village total;
- Campaign base cost, requirement, discount and effective cost; all fixed
  Campaign, Tower and Expedition requirement tables and their hashes;
- current resource balances, claim-ready state, pending/manual reward values,
  offline credited/discarded time, and 24-hour cap behavior;
- active achievement and facility authorities, with disabled or synthetic
  systems identified rather than silently counted;
- safe-integer maxima and remaining headroom, reported both for gameplay values
  and for the full tree including timestamps. Locating unsafe target levels on
  proposed extended curves belongs to the later simulation lane, not this
  no-balance baseline capture.

Values used for arithmetic remain JSON numbers. Human-readable formatting is a
separate display field and is never an authority.

## Canonical profiles

### True fresh schema 13

This is the exact no-save schema-13 default at the frozen clock. It is a pure
authority recipe, not the Phase 23 `p23.qa.fresh.v1` migration fixture. Its
anchor values are:

- Fellow Economy Power `35150`, `390` bps;
- Companion actual/Economy Power `2200`, `80` bps;
- migration floor `0`, effective Companion threshold `2200`;
- Fellow Combat Power `35565`, with no migration transfer floor;
- Command `6807.528`, Archives `6050.27953152`, Training
  `7806.07715328`, Hearth `6656.9245344`, total `27320.8092192`
  Gold/hour;
- Fellow Campaign stage one requirement `22000`, base cost `10000`, discount
  `0.15414772727272727`, effective cost `8459`.

These anchors detect authority-selection failures; the complete generated
profile remains the report of record.

The earlier `36366` Fellow Combat Power anchor belongs to a fresh schema-12
predecessor migrated to schema 13. That fixture preserves the legacy Companion
transfer values of `480` to Cael and `400` to Orin even though its new Companion
actual transfers are `40` and `46`. It remains explicit migration-comparison
metadata and is neither canonical true fresh nor a fourth profile.
Its historical stage-one effective cost is `8368`.

### Migrated established

This uses the exact `p23.qa.schema12-invested.v1` migration fixture. It preserves
Arcanine Level 3 / rarity 3 / EXP 182 / 37 shards assigned to Orin and Dewgong
Level 2 / rarity 2 / EXP 80 / 11 shards assigned to Cael.

Its anchor values are Companion actual/Economy Power `2272`, migration threshold
`2892`, Fellow Economy Power `35150`, Fellow Combat Power `36645`, Village total
`27328.94041242`, and Fellow Campaign stage-one cost `8336`.

The authenticated migration receipt and profile share exact predecessor,
legacy-history, and initialization identities. Those identities are pinned in
the canonical recipe and are required to match before a report can be emitted.

This is intentionally migration-focused. It is not a claim that the player has
maximized every midgame system.

### True high investment

This is a pure authority evaluation, not an importable save. It sets every
currently released investment lane to an authored cap: all Fellows Level 120,
rarity 5 and Bond 99; all six released Relics Level 10; Might 50; every
Companion Level 100 and rarity 5; Mastery 50; every Family member Intimacy 1000
and rarity 5; all four Buildings Level 52 with 30% Oath boosts; Rank 5; current
Campaign/Tower/Expedition endpoints; and full banks for the three approved
active facilities.

The recipe fixes Relic and Companion assignments, so output cannot vary with
iteration order. Its Companion unrounded aggregate is `50358`; production rounds
each member before the roster sum, so actual and effective threshold Power are
`50355`. No migration floor applies. Every other exact result is emitted by the
runtime authority and frozen into the generated report.

The frozen high-profile results are Fellow Economy Power `3196916`, Fellow
Combat Power `3588268`, Fellow economy `1454` bps, Companion economy `668` bps,
Village Gold/hour `60337645.45902187`, and Fellow Campaign stage-one cost
`6500`. All four Level-52 Buildings must emit a null next-upgrade cost and an
explicit level-cap status.

The high profile also places the Companion Tower and Fellow Expedition at their
released endpoints with exactly 24 hours pending, fills the three approved
facility banks, and leaves their manual rewards ready and unclaimed. The report
must obtain pending, credited, discarded, cap, interval, reward, and ready-state
values by calling existing pure preview/derivation functions on the detached
synthetic state. It must include the source policy IDs. It must not settle an
interval, claim a reward, mutate the live state, write storage, or restate the
pricing formulas. A missing pure preview is a fail-closed authority gap.

### Near-cap QA reference

`p23.qa.all-unlocked.v1` remains a compatibility stress fixture. It has all
Fellows at the current cap but only two Companions at Level 100, rarity-1
rosters, and incomplete Relic/Family/Might/Mastery/Building/Oath investment.
It must always be labeled `near-cap-qa-reference`, never `high-investment`.

## Collection status and planning conflict

Collections are not a live production authority in Phase 24A. Every report must
emit them as `reserved-inactive`, with zero current basis points, multiplier
`1`, and no assumed cap.

The older Appendix C language describing capped `+30% Power`, `+30% Earnings`,
`+20% EXP`, and `+25% facility` lanes conflicts with newer accepted Decision 40,
which specifies uncapped additive named pools. Phase 24A implements neither.
Decision 40 is the forward planning authority unless a later explicit decision
replaces it.

## Keep, change, and defer boundary

**Keep exact in 24A:** every corrected schema-13 output, formula order, fixed
requirement, manual claim, 24-hour cap, and approved private facility table.

**Change later, only after simulation:** authored Fellow/Companion EXP bands,
Breakthroughs, Rank capacity, the 600-to-500 Intimacy migration, expanded
achievement ladders, future requirement tables, and any Collection design.

**Defer:** Book II requirements, Prosperity thresholds, future story rewards,
rotating-event release, Phase 20/21 synthetic facility values, advanced Relic
systems, new stats/currencies, and public artwork decisions.

## Acceptance

Phase 24A passes only when two consecutive generations are byte-identical, all
three canonical profiles evaluate successfully, the already-frozen all-unlocked
fixture remains separately labeled near-cap QA evidence, every anchor matches,
all integers are safe, no private artwork path or binary enters the report, and
a real-browser verification agrees with the generated artifact.

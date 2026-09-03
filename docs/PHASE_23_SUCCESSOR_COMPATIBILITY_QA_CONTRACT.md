# Phase 23 successor-schema compatibility QA contract

## Purpose

Phase 23 changes the persisted schema from 12 to 13. A successful Companion migration is not sufficient if inherited functions interpret only schema 12 and silently fall back to older economy, Power, roster, navigation, or offline behavior. This additive gate therefore proves schema-13 semantic continuity through production actions and visible projections.

It does not replace or modify the original Phase 23 independent gate. Both gates must pass on the same exact candidate.

## Frozen authority

- Production schema: 13.
- Existing Phase 23 bridge: `phase-23-independent-qa-v1`.
- Rank-1 joined Fellows, in order: `cael`, `lyra`, `orin`, `selene`, `rook`, `mira`.
- Rank-1 Fellow Campaign stage-one target pool: `cael`, `lyra`, `orin`.
- Production Building upgrade curve: `round(15000 × 1.24^(level − 1))`, Levels 1 through 51, Level 52 cap.
- Fresh Village Fellow Economy Power: 35,150; bonus 390 bps; multiplier 1.0390.
- Fresh Combat Fellow Roster Power: 36,366 after the separate Family-link combat step.
- Fresh complete Companion Economy Power: 2,200; bonus 80 bps; multiplier 1.0080.
- Fresh effective Building rates, with no Oath boost:
  - Command Center: 6,807.528 Gold/hr.
  - Archives: 6,050.27953152 Gold/hr.
  - Training Grounds: 7,806.07715328 Gold/hr.
  - Hearth: 6,656.9245344 Gold/hr.
  - Total: 27,320.8092192 Gold/hr.
- First-Road Lantern at Tier 1, Level 1: +100 bps, applied after base/Level/rarity/Bond and before Companion transfer, Family multiplier, Might, and the final single rounding.
- Rank-1 locked routes: Companion Campaign at Rank 2, Companion Tower at Rank 3, Fellow Expedition at Rank 5.
- Fellow Expedition: one-hour intervals, one shared 24-hour bank cap across stage changes.

## Required real-browser assertions

### Economy and Building progression

The fresh schema-13 candidate must derive the exact Fellow/Companion economy inputs and bps above. The four passive Building rows and total must equal the frozen values, and the real Building production sheet must project the same 1.0390 and 1.0080 multipliers.

Starting from a genuine high-resource fixture, the gate upgrades one Building through all 51 transitions. Every Gold delta must equal the frozen cost table. Level 52 must refuse another upgrade with no save write, and reload must retain exact bytes, revision, and validation.

### Joined roster, targeting, and screen projection

At Rank 1 the Fellowship screen must show exactly 6/18 joined Fellows, with the first six available and the remaining twelve visibly locked. Fellow Campaign must use only joined combat Power (36,366), while Village production uses the distinct 35,150 economy Power that deliberately excludes combat-only Family and Companion bonuses. Its stage-one training target must be `cael`, the first member of the frozen deterministic pool. Village speaker selection must never select an unjoined Fellow.

The gate checks the visible roster count, card state, Campaign target art hook, displayed Power, derived exact Power, and state together so a correct internal value cannot mask a stale screen.

### Relics

The gate equips the genuinely acquired First-Road Lantern through the production action. It independently reconstructs the expected post-Relic Fellow Power from the frozen formula order and pre-action components. The Fellow and joined-roster totals must change by exactly the reconstructed amount and survive reload.

### Player Rank routes

Real clicks and the inherited programmatic action must both refuse all three Rank-1 locked routes. The route field, visible heading, raw save, revision, and isolated-storage write count must remain aligned and unchanged.

### Fellow Expedition boundary

The gate requires a narrow production-authoritative exercise exposed through the existing Phase 23 QA bridge. That exercise must use legitimate progression and save coordinators; it may not install or rewrite a manufactured persisted state.

It must establish a first genuine best stage, accrue two full hours, establish a later genuine higher stage, and advance another 30 hours. The result must retain two intervals at the first stage and 22 at the second, credit exactly 24 hours total, discard exactly eight hours, claim exact deterministic rewards once, reload without byte/revision drift, refuse replay with zero writes, and prove the first-stage intervals were not repriced at the second-stage rate.

## Fail-closed rules

- Missing production bridges or the genuine Expedition exercise fail the candidate gate.
- Approximate economy values, self-reported values without independent reconstruction, direct state injection, or a fabricated test engine are not acceptable.
- Package-only verification may pass before production freezes. That result validates the QA artifact only and is not a candidate verdict.
- The original Phase 23 gate and its historical package remain frozen.

## Release gate

A replacement Phase 23 verdict requires, on one exact frozen candidate:

1. the full original Phase 23 static and browser gate;
2. this full successor-compatibility static and browser gate;
3. zero warning/error console entries and zero native Web Storage access in isolated realms;
4. exact file hashes recorded in the final result document.

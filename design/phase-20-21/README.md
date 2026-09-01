# Phases 20–21 Village facility retrofit and release contract

## Status

Design, immutable data contracts, deterministic QA fixtures, and validation only. No production HTML, CSS, JavaScript, save data, artwork, feature flag, deployment, merge, or push is changed.

## Phase 20

Retrofit the four original Buildings with additive active activities while preserving their released passive behavior:

- Command Center — bounded petitions and Village decisions;
- Archives — map, lore, and Relic-lead reconstruction;
- Training Grounds — drills, sparring, and formations that do not replace Campaign/Expedition;
- Hearth — gatherings and relationship scenes without romance checklists.

Passive Gold production, Building levels/upgrades, Oath multipliers, offline collection, and Family assignments remain authoritative and independent.

## Phase 21

Add four expansion facilities at their visible Village anchors:

- Gatehouse — caravans, route conditions, visitors, and road events;
- Market/Workshop — requirements, fulfillment, crafting, and trade orders;
- Gardens — plot choice, cultivation, non-spoiling readiness, and manual harvest;
- Forge — equipment/Relic commissions without advanced affixes, reforging, or other deferred systems.

Phase 21 also defines optional cross-facility seams, combined balance constraints, migration/recovery rules, and the full release gate.

## Files

- `PHASE_20_21_CONTRACT.md` — product behavior, physical map, activities, tutorials, cast, migration, non-regression, and release decisions.
- `DATA_SPEC.md` — shared envelope, facility state variants, settlement/resolution/finalizer rules, migration, offline, concurrency, and validation.
- `phase20-definitions.json` — immutable Command, Archives, Training, and Hearth definitions.
- `phase21-definitions.json` — immutable Gatehouse, Market/Workshop, Gardens, and Forge definitions.
- `cross-facility-integration.json` — optional positive-only integration hooks with all formulas/caps disabled.
- `tutorial-bindings.json` — 19 existing-ledger tutorial bindings with gradual contextual delivery.
- `cast-bindings.json` — exact Phase 15 hook subset for these facilities, preserving earlier primary assignments.
- `release-gate.json` — explicit fail-closed combined production release checklist.
- `fixtures.json` — deterministic design, migration, non-expiry, offline, reload, corruption, concurrency, cross-facility, mobile, accessibility, and release fixtures.
- `validate.py` — cross-phase identity, reference, null-policy, cast, tutorial, fixture, and release-gate validator.

## Dependencies

- exact parent `44c8cc0c06079ae7e141fb1ec2de71d352d282a6`;
- Phase 14 shared facility envelope and exact facility/activity/opportunity IDs;
- Phase 15 successor lineage, tutorial registry, V2 claim archive, and trusted finalizers;
- Phase 17 story unlock/map-anchor contract;
- Phase 18–19 successor validation and domain-ready claim seam;
- released passive Building/Family-assignment behavior for the original four.

## Production blockers

Every cadence, bank/participant/plot capacity, selection weight, reward, local progression curve, relationship/Gift value, stock quantity, input requirement, growth time, quality multiplier, cross-facility formula/cap, active-profit target, and art/CSS treatment remains null. The full facility set is production-disabled.

Runtime is additionally blocked on finalizers, exact migration lineage, mobile physical-map implementation, approved localized copy, five-year archive/headroom proof, full regression evidence, and public character/art authorization.

Synthetic fixture values are isolated QA-only inputs and cannot serve as production or migration defaults.

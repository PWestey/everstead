# Phases 20–21 data specification

## 1. Immutable boundary

Phase 20 and Phase 21 extend the Phase 14 facility envelope and Phase 15 successor claim/tutorial services. Pure modules contain no DOM, storage, clock read, global randomness, or direct save write.

Captured definition sets:

- `definition-set.phase-20-original-four-active.v1`;
- `definition-set.phase-21-expansion-facilities.v1`;
- `definition-set.phase-21-cross-facility-integration.v1`;
- the exact predecessor facility, story, cast, tutorial, claim, and migration registries.

Banked details and outcomes retain the exact definition/policy versions used to create them. Removed definitions remain loadable while referenced. UI/QA callers cannot supply registries, rewards, local deltas, clocks, seeds, source metrics, participants, stock quantities, or claim-kind dispatch.

All production cadence, capacity, selection, reward, progress, relationship, Gift, growth, stock, requirement, quality, integration, and profit values are null. Null blocks activation; it never becomes zero or a copied value from another facility.

## 2. Original four passive boundary

Phase 20 adds active state without replacing existing Building state.

The following remain wholly authoritative in their released fields and transactions:

- Building visibility, ID, level, upgrade cost, and upgrade history;
- passive Gold rate and collection;
- Oath multipliers;
- offline Gold and its 24-hour cap;
- Family assignment and its production contribution.

Active Command/Archives/Training/Hearth discovery may hide or dim an activity icon only. It cannot hide a Building, pause production, reject a Family assignment, reinterpret a Building level as facility mastery, or write passive Gold. A failed active migration/claim leaves passive behavior available.

## 3. Shared active-facility state

Each facility stores its successor state under `facilityProgress.localProgressById[facilityId]` without mutating the passive Building record:

```text
contractVersion / configId / definitionSetId
facilityId / definitionVersion
discoveredAt / unlockedAt
localLevel
progressByTrackId: exact definition-keyed safe integers
settlement:
  cursorAt / carryMs / nextOrdinal
  captured definition, policy, cadence, capacity, and local-level context
detailByOpportunityId: exact facility detail records
engaged: null or one validated resumable engagement
claimReadyByOpportunityId: immutable outcome records
claimedOrdinalRanges: canonical compact replay authority
domainHistory: bounded definition-keyed aggregates/IDs
claimCount / lastClaimReceiptId
identity: save-bound facility-state identity
```

Base opportunities use `opportunity.facility.activity`, exact Phase 14 activity source IDs, global Phase 12 sequence, and facility-local positive ordinals. They never expire and always claim manually.

Settlement is pure and follows the Phase 14 plan: one captured clock; maximum 24-hour elapsed allowance; available slots subtract banked, engaged, and claim-ready items; saturation discards hidden whole-interval debt; additions and companion details commit atomically; no reward, local progress, tutorial, or claim is created by ordinary opportunity settlement. Gardens uses the separate maturity plan described below.

## 4. Phase 20 facility-specific records

### Command Center petitions

Generated detail captures petition template/version, visible interests, canonical choice IDs, story gate, deterministic seed, reward-policy version, and identity. Engagement records only stable draft choice and semantic step.

Resolution previews the immediate approved effect and creates one `command.outcome.recorded`. Choices may create different localized Chronicle flavor records but no hidden permanent branch. Mechanical divergence, Prosperity change, rewards, and Influence progress remain null. Finalizer revalidates petition/choice/outcome, applies only approved deltas, records the flavor choice once, updates metrics/ranges/receipt, and persists atomically.

### Archives research

Research detail captures lead, branch (maps/lore/Relics), evidence set, story gate, seed, and versions. Engagement preserves selected evidence. Invalid evidence selection returns to research without consuming the lead or creating an offer.

Documented/Breakthrough outcomes may eventually create a bounded Chronicle discovery and local Discovery progress. They cannot directly mutate Relic inventory/equipment. Claim applies approved reward/progress and exact discovery history once.

### Training Grounds drills

Drill detail captures drill type and formation options. Engagement references validated owned participants and a formation. Participant count/eligibility are definition-owned and null-gated.

Participants remain presentation/activity selections only. A drill cannot alter Campaign/Tower eligibility, selected squad rules, total-roster Power, roster ownership, actor availability, or injury state. Completed/Refined outcomes claim bounded approved rewards and Readiness progress only.

### Hearth gatherings

Gathering detail captures gathering type, attendee themes, deterministic seed, and policy versions. Engagement validates owned attendees without forced pairing, relationship spending, or romance checklist.

Warm/Deepened outcomes may eventually carry allowlisted relationship deltas, interlude eligibility evidence, and a deterministic claim-time Gift roll. All values/chances/thresholds are null. Viewing/resolving never changes relationships or grants Gifts; the trusted claim finalizer applies approved deltas/roll exactly once and records permanent replay evidence.

## 5. Phase 21 facility-specific records

### Gatehouse

Caravan detail captures template, route condition, visitor need, story gate, seed, and policy versions. Reception choices are stable IDs. An incompatible reception returns to assessment without consuming the caravan. Welcomed/Prepared outcomes are bounded, manually claimed, and may add one Chronicle road-event record after claim.

### Market/Workshop

Order detail captures order, exact stock requirements, fulfillment choices, seed, and versions. Stock capacities/quantities are null. Once approved, engagement reserves exact validated stock inside the transaction:

- cancel before commit restores the same reservation;
- close after commit preserves engagement/reservation for resume;
- resolving/claiming cannot use caller-supplied quantities;
- stale reservation identity rejects;
- claim consumes reservation and applies reward/stock/Craftsmanship deltas once.

### Gardens

A banked open-plot opportunity becomes a validated cultivation record after plot/crop choice:

```text
state: growing | harvest-ready
plotId / cropId / versions
startedAt / readyAt
expected source/detail identities
deterministic special-result seed
identity
```

Growth duration and plot capacity are null. Once approved, a separate pure foreground/offline maturity plan may transition `growing` to `harvest-ready` and create one immutable offer/outcome, but never claim it. Ordinary opportunity settlement cannot perform this transition. Ready harvests do not expire/spoil; no auto-replant. Clock rollback rejects rather than shortening growth. Manual harvest claim applies reward/Cultivation/history exactly once and frees the plot.

### Forge

Commission detail captures commission/output class, exact stock requirements, work choices, story gate, seed, and versions. Reservation/resume follows Workshop rules.

Forge can integrate only with the existing Relic/Relic Stone systems through trusted allowlisted deltas. `forge.stock.relic-stones` is a requirement-adapter alias over the authoritative existing balance, never a duplicated persisted facility balance; the exact adapter ID is null and production-blocking. Workshop components remain facility-local but their baseline source policy is also null, so cross-facility input cannot become mandatory by accident. Forge does not add affixes, reforging, advanced sets, direct caller-selected item mutation, or hidden equipment replacement. Completed/Fine Work outcomes remain manually claimed and null-valued until approved.

## 6. Trusted finalizers and claims

The captured Phase 15 registry adds exactly eight dispatches:

```text
activity.petitions -> commandPetitionFinalizerV1
activity.research -> archivesResearchFinalizerV1
activity.drills -> trainingDrillFinalizerV1
activity.gatherings -> hearthGatheringFinalizerV1
activity.caravans-and-road-events -> gatehouseCaravanFinalizerV1
activity.orders-and-crafting -> workshopOrderFinalizerV1
activity.cultivation -> gardensHarvestFinalizerV1
activity.relic-commissions -> forgeCommissionFinalizerV1
```

Dispatch is by immutable source plus validated domain outcome, never visible card text or caller data. Every finalizer:

1. validates full successor lineage and registry identities;
2. revalidates opportunity/detail/engagement/outcome/offer preimages and domain replay authority;
3. builds a pure allowlisted global/local mutation plan;
4. applies canonical rewards and domain progression/history/metrics;
5. removes owned pending/detail/outcome/reservation state;
6. adds claimed ordinal and any named/discovery/interlude replay evidence;
7. writes one V2 receipt/checkpoint update;
8. validates and persists once.

Any failure rolls back all steps. Presentation begins only after persistence commits. Repeated/stale claims are no-ops or conflicts and cannot credit twice.

## 7. Cross-facility integration

Cross-facility hooks derive optional variant eligibility from committed source-claim metrics. They store no caller-mutable token inventory and never run another facility's settlement/claim in the source transaction.

Rules:

- every target has a valid baseline with all hooks disabled;
- hooks are positive-only and cannot be mandatory inputs;
- cycles may exist for content variety but cannot be required, consumptive, or same-transaction cascades;
- target settlement captures exact hook/variant versions in the generated detail;
- replay of a source claim cannot duplicate source metrics;
- thresholds, formulas, and caps are null, so all hooks are production-disabled.

## 8. Tutorials, story, and cast

Phase 20/21 extends tutorial replay keys for exactly 19 existing ledger IDs. Shared board/banking/claim tutorials do not repeat after predecessor resolution. Mastery/effect tutorials cannot present disabled values as active.

Story controls discovery/opening via the exact Phase 17 mappings. Replay never generates an opportunity, participant, stock, crop, commission, outcome, metric, reward, or claim.

`cast-bindings.json` uses the exact later Phase 15 hook subset: 45 hook IDs across 28 current actors. Phase 14's broader candidate list is not automatically promoted. Primary Phase 13 assignments remain unchanged. Speaker presentation follows transparent-cutout → approved-frame → text-only fallback and never uses an unframed full-background portrait.

## 9. Migration and validation

Successor lineage adds `migration.phase-20.original-four-active.v1` then `migration.phase-21.expansion-facilities.v1` after the implemented Phase 19 lineage. Design commit IDs are not save migration IDs.

Migration is additive and idempotent:

1. validate predecessor, registries, story state, claim archive, tutorial state, passive Buildings, and Family assignments;
2. create only the phase's facility profiles/replay keys/definition receipts;
3. derive story discovery/opening without replaying grants;
4. create no opportunities or effects while policies are null;
5. preserve all predecessor and passive bytes;
6. validate and commit once;
7. repeat as a byte-stable no-op.

An active-original-four migration must succeed or fail independently of passive operation. Unknown/future IDs, duplicate ordinals, invalid ranges, mismatched detail/outcome/offer/reservations, expired records, forged participants/stock, unsupported Relic mutations, impossible garden clocks, or enabled null policies reject before adoption. Export/recovery remains available.

## 10. Offline, reload, and concurrency

Offline may bank ordinary opportunities to cap and advance approved Garden growth to ready within the shared 24-hour allowance. It cannot open, choose, reserve, resolve, reward, claim, teach a tutorial, apply a relationship/Gift roll, or cascade an integration hook. Every state is resumable and non-expiring.

All mutations carry revision, raw-state identity, registry identity, and exact domain preimages. A stale tab rejects instead of duplicating or regressing opportunities, participants, reservations, crops, progress, relationships, stock, metrics, offers, or receipts. Storage events force refresh.

Web Storage has no compare-and-swap. The known final-reread-to-write race remains; identities, staging provenance, exact receipts, and replay authority narrow/detect but cannot eliminate it.

## 11. Runtime and release seams

Runtime remains blocked until:

- Phase 20/21 lineage-aware validators and migrations exist;
- all eight planners/detail/outcome validators/finalizers are captured and immutable;
- stock reservation, Garden timed-ready, relationship/Gift, Chronicle-discovery, and Relic allowlists are implemented;
- tutorial registry and physical-map UI support all eight facilities accessibly;
- every null policy is replaced by an approved versioned definition;
- five-year combined cadence/archive/save-size simulations pass;
- `release-gate.json` is fully satisfied with recorded runtime/browser/device evidence.

No runtime path may guess around a missing seam or null value.

# Phase 14 facility data specification

## 1. Pure definition boundary

The future `src/phase14-facilities.js` module should consume the immutable Phase 12 foundation and publish a second immutable contract. It contains no DOM, localStorage, clock reads, random global state, or direct save writes.

Required exports:

- `configId`
- `definitionSetId`
- `definitions`
- `validateDefinitions`
- `createInitialFacilityState`
- `validateFacilityState`
- `planSettlement`
- `createOpportunityDetail` / `validateOpportunityDetail`
- `createOutcomeDetail` / `validateOutcomeDetail`
- `claimedRangesAdd` / `claimedRangesHas` / `validateClaimedRanges`
- `facilityClaimFinalizer` contract, installed through a trusted immutable registry

All returned structures are canonical plain data and deeply frozen or cloned at the integration boundary.

## 2. Facility definition

```json
{
  "id": "facility.restaurant",
  "definitionVersion": 1,
  "activityId": "activity.restaurant-service",
  "mapAnchor": "western-plaza",
  "targetPhase": 16,
  "passivePolicy": "active-bonus-only",
  "localProgressTrackIds": ["facility-progress.restaurant.reputation"],
  "participantKinds": ["workers", "customers", "named-visitors"],
  "operational": {
    "intervalMs": null,
    "bankCapacity": null,
    "unattendedTargetMs": null,
    "economyStatus": "requires-approval"
  },
  "tutorialIds": [
    "tutorial.facility.board.discover-hotspots",
    "tutorial.restaurant.first-customer",
    "tutorial.restaurant.first-claim",
    "tutorial.restaurant.recipes-and-stations"
  ],
  "opportunityDefinitionIds": [
    "opportunity.facility.restaurant.customer"
  ],
  "dialogueHooks": [
    { "actorId": "family.tifa", "roles": ["tutorial-guide", "activity-presenter", "claim-acknowledgement"] }
  ]
}
```

An interval-driven definition cannot be enabled until all three operational numbers are positive safe integers, `bankCapacity` is bounded by the implementation maximum, and `intervalMs * bankCapacity >= unattendedTargetMs`.

## 3. Opportunity definition

```json
{
  "id": "opportunity.facility.restaurant.customer",
  "definitionVersion": 1,
  "facilityId": "facility.restaurant",
  "activityId": "activity.restaurant-service",
  "generation": "interval",
  "interactionKind": "preference-and-recipe",
  "rewardPolicyId": "reward-policy.facility.restaurant.customer",
  "rewardPolicyVersion": 1,
  "expires": false,
  "claimMode": "manual"
}
```

Production reward policy data is a separate economy-owned definition set. A missing policy blocks enablement; it never resolves to zero or an invented default.

## 4. Persisted facility state

Phase 12 already provides `facilityProgress.localProgressById`. Each enabled facility stores this exact successor shape there:

```json
{
  "contractVersion": 1,
  "configId": "phase-14-facility-framework-v1",
  "facilityId": "facility.restaurant",
  "definitionVersion": 1,
  "discoveredAt": 1000000,
  "unlockedAt": 1100000,
  "localLevel": 1,
  "localProgressByTrackId": {
    "facility-progress.restaurant.reputation": 0
  },
  "settlement": {
    "cursorAt": 1100000,
    "carryMs": 0,
    "nextOrdinal": 0,
    "context": {
      "definitionVersion": 1,
      "intervalMs": 3600000,
      "bankCapacity": 8,
      "localLevel": 1
    }
  },
  "opportunityDetailsById": {},
  "engaged": null,
  "claimReadyById": {},
  "claimedOrdinalRanges": [],
  "claimCount": 0,
  "lastClaimReceiptId": null
}
```

Rules:

- `discoveredAt` and `unlockedAt` are non-negative captured timestamps or null as allowed by state.
- No settlement exists before unlock.
- `localProgressByTrackId` has the exact stable track IDs allowed by the captured facility definition; values are non-negative safe integers.
- `carryMs` is in `[0, intervalMs)`.
- `nextOrdinal` is monotonic and never reused.
- Banked opportunities live in Phase 12 `opportunityLedger.pendingById`; the detail map contains an exact companion record for each facility-owned pending opportunity.
- `engaged` references one pending ID and its expected identity; it does not copy rewards.
- `claimReadyById` is a map of immutable outcome details; each has one pending Phase 12 offer.
- Claimed ranges compact recurring instance lineage and never overlap pending IDs.
- Reward-bearing `localLevel` or `localProgressByTrackId` changes only in a claim finalizer. Non-reward UI state is not stored here.

## 5. Instance identity

Canonical IDs use the facility's stable suffix and a decimal ordinal:

- Opportunity: `opportunity.instance.facility.restaurant.1`
- Offer: `reward.offer.facility.restaurant.1`
- Outcome: `outcome.facility.restaurant.1`

The Phase 12 opportunity contains:

```json
{
  "id": "opportunity.instance.facility.restaurant.1",
  "kindId": "opportunity.facility.activity",
  "facilityId": "facility.restaurant",
  "sourceId": "activity.restaurant-service",
  "createdAt": 4700000,
  "sequence": 41,
  "rewardOfferId": "reward.offer.facility.restaurant.1",
  "identity": "<Phase 12 identity>"
}
```

The global Phase 12 `sequence` remains globally monotonic. The terminal ID ordinal is facility-local and comes from `settlement.nextOrdinal`.

`sourceId` deliberately uses the registered Phase 12 activity ID. The Phase 14 definition ID is carried by the companion detail below; using it as the Phase 12 source would fail the current `rewardSourceValid` contract. The bound Phase 12 reward offer uses the same `sourceType` and activity `sourceId`.

## 6. Opportunity detail

```json
{
  "id": "opportunity.detail.facility.restaurant.1",
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<Phase 12 identity>",
  "definitionId": "opportunity.facility.restaurant.customer",
  "definitionVersion": 1,
  "rewardPolicyId": "reward-policy.facility.restaurant.customer",
  "rewardPolicyVersion": 1,
  "generatedAt": 4700000,
  "ordinal": 1,
  "variantSeed": "<save-bound deterministic seed>",
  "payload": { "schema": "restaurant-customer-v1", "variantId": "customer.fixture.1" },
  "expiresAt": null,
  "identity": "<save-bound detail identity>"
}
```

The detail identity binds every field, the save ID, facility ID, and framework config. `payload` is validated by an allowlisted adapter selected from `definitionId`; it is never arbitrary executable data.

## 7. Engaged state

```json
{
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<Phase 12 identity>",
  "detailIdentity": "<detail identity>",
  "startedAt": 5000000,
  "commitBoundaryReached": false,
  "resume": { "schema": "restaurant-service-v1", "stepId": "choose-recipe", "selectionIds": [] },
  "identity": "<save-bound engagement identity>"
}
```

Before the facility-specific commit boundary, cancel may restore banked state. After it, closing the UI preserves the engagement for resume; it never consumes or pays implicitly.

## 8. Outcome detail and claim-ready state

```json
{
  "id": "outcome.facility.restaurant.1",
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<Phase 12 identity>",
  "detailIdentity": "<detail identity>",
  "definitionId": "opportunity.facility.restaurant.customer",
  "definitionVersion": 1,
  "rewardPolicyId": "reward-policy.facility.restaurant.customer",
  "rewardPolicyVersion": 1,
  "resolvedAt": 5200000,
  "choice": { "schema": "restaurant-choice-v1", "recipeId": "recipe.fixture.1" },
  "result": { "schema": "restaurant-result-v1", "quality": "matched" },
  "offerId": "reward.offer.facility.restaurant.1",
  "offerIdentity": "<Phase 12 offer identity>",
  "localDeltas": [
    { "kind": "facilityProgress", "trackId": "facility-progress.restaurant.reputation", "amount": 1 }
  ],
  "identity": "<save-bound outcome identity>"
}
```

`localDeltas` are canonical positive-safe-integer entries from a facility allowlist. A `facilityProgress` delta must target one of that definition's stable `localProgressTrackIds`; adapters may add versioned facility-specific delta kinds only when the definition declares and validates them. These are not Phase 12 global reward kinds and are applied only by the trusted facility claim finalizer.

## 9. Settlement plan

`planSettlement(state, capturedAt, elapsedAllowanceMs)` is pure and returns a plan, not mutated state.

Algorithm:

1. Reject invalid state, future definition version, negative/non-safe clock, or invalid allowance.
2. If locked or `capturedAt <= cursorAt`, return zero additions.
3. `elapsed = min(capturedAt - cursorAt, elapsedAllowanceMs, 86_400_000)`.
4. `availableSlots = bankCapacity - bankedCount - claimReadyCount`.
5. `whole = floor((carryMs + elapsed) / intervalMs)`.
6. `createCount = min(whole, max(0, availableSlots))`.
7. Derive exact ordinals, Phase 12 opportunities, details, seeds, and identities.
8. If capacity was not reached, `carryAfter = (carryMs + elapsed) % intervalMs`; if saturated, `carryAfter = min(intervalMs - 1, (carryMs + elapsed) % intervalMs)` and no hidden whole-interval debt is retained.
9. Advance `cursorAt` to captured time for the settled allowance; record discarded-over-cap elapsed in the returned diagnostic only, not as future debt.
10. Return expected preimage identities so the mutation adapter can refuse a changed live state.

Settlement writes opportunity records and details atomically through `mutatePersisted`. It writes no offers, outcomes, rewards, local deltas, or receipts.

## 10. Claim finalizer contract

The trusted finalizer receives cloned/validated values inside the Phase 12 claim transaction:

```json
{
  "sourceType": "opportunity.facility.activity",
  "facilityId": "facility.restaurant",
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "expectedOpportunityIdentity": "<identity>",
  "expectedOutcomeIdentity": "<identity>",
  "offerId": "reward.offer.facility.restaurant.1",
  "expectedOfferIdentity": "<identity>"
}
```

It must validate before Phase 12 applies any reward. Its state changes are part of the same transaction and include:

- apply canonical local deltas;
- remove opportunity/detail/outcome/engagement;
- add the facility-local ordinal to claimed ranges;
- increment claim count and set the final receipt ID;
- update metrics through an allowlisted metric adapter.

Any failure throws and rolls back the entire transaction.

## 11. Claimed-range format

Recurring completed IDs use canonical inclusive ranges:

```json
[[1, 4], [6, 6], [9, 12]]
```

- Each endpoint is a positive safe integer.
- Start is less than or equal to end.
- Ranges are sorted with at least one missing ordinal between adjacent ranges.
- Adding an already-covered ordinal is rejected as replay.
- Adjacent ranges merge.
- The range maximum never exceeds `settlement.nextOrdinal`.
- Full opportunity IDs remain derivable from facility ID plus ordinal for audit display.

Phase 12 `opportunityLedger.completedIds` remains available for one-time story/Legacy opportunities. Recurring facility instances use compact local ranges to avoid unbounded duplicate strings.

## 12. Definition and reward evolution

- A banked item keeps its original definition and reward-policy versions.
- A new definition version affects only newly generated items.
- A local-level change first settles old elapsed context and then stores the new context.
- A removed definition stays loadable in a read-only legacy adapter until all saved items using it are resolved.
- A broken definition update fails closed at registry validation and cannot partially enable the feature.
- Reward previews come from the captured policy version and exact outcome, never the newest table.

## 13. Receipt retention requirement

The Phase 12 array and 10,000-receipt cap are acceptable for the first bounded vertical slice only if capacity monitoring is visible and claims remain safely banked at the cap.

Before enabling multiple high-frequency facilities, implement one of:

1. a versioned, hash-bound receipt archive with a retained recent window and exact aggregate/range lineage; or
2. an approved batching policy proven by simulation to remain below 80% of the cap for at least five years at maximum supported player behavior.

Increasing the numeric cap without bounding serialized save growth is not sufficient.

## 14. Presentation derivation

For each map marker:

- `hidden` if not discovered;
- `discovered` if discovered but not unlocked;
- `ready` if claim-ready count > 0 or banked count > 0;
- `available` otherwise.

The detail sheet shows, in priority order:

1. manual claim ready;
2. engaged activity to resume;
3. banked opportunity to begin;
4. time/status until the next opportunity;
5. passive role and current active-play explanation.

Rendering never mutates settlement or marks a claim paid.

# Phase 15–16 data specification

## 1. Pure module boundaries

The future modules contain no DOM, storage, clock read, global randomness, or direct save write.

`phase15-waystone-legacy` exports:

- immutable definitions and registries;
- definition/state validators;
- metric projection and eligibility evaluation;
- ready-snapshot and Founding Cache builders;
- Legacy finalizer plans;
- tutorial-extension validation;
- reward receipt/archive validation and fold planning.

`phase16-restaurant` exports:

- immutable Restaurant definitions;
- definition/state validators;
- deterministic customer settlement;
- engagement, recipe/station/stock, and result validators;
- claimed-range operations;
- Restaurant finalizer plans.

All mutation runs through the existing transaction coordinator with one captured clock and full successor validation.

## 2. Phase 15 successor state

```json
{
  "phase15Profile": {
    "contractVersion": 1,
    "configId": "phase-15-waystone-legacy-v1",
    "definitionSetId": "definition-set.phase-15-waystone-legacy.v1",
    "tutorialRegistryId": "tutorial-registry.phase-15.v1",
    "claimArchiveConfigId": "claim-archive.phase-15.v1",
    "activatedAt": 1000000,
    "activationRevision": 50,
    "preActivationIdentity": "<raw identity>",
    "identity": "<save-bound profile identity>"
  },
  "legacyExpansion": {
    "metricStateById": {},
    "readyByDefinitionId": {},
    "claimedTierIds": [],
    "completedFeatIds": [],
    "foundingCache": null,
    "evaluationSequence": 0,
    "lastEvaluationIdentity": null
  },
  "tutorialExtension": {
    "registryId": "tutorial-registry.phase-15.v1",
    "seenStepIds": [],
    "completedStepIds": [],
    "dismissedStepIds": [],
    "completionReceiptsByStepId": {},
    "replayCountsByTutorialId": {},
    "pendingTutorialIds": [],
    "identity": "<save-bound tutorial identity>"
  },
  "rewardClaimsV2": {
    "configId": "claim-archive.phase-15.v1",
    "nextSequence": 0,
    "pendingOffers": {},
    "recentReceipts": [],
    "predecessorClaimedOfferIds": [],
    "checkpoint": {
      "throughSequence": 0,
      "receiptCount": 0,
      "aggregateRewards": [],
      "sourceCountsByType": {},
      "terminalIdentity": null,
      "identity": "<save-bound checkpoint identity>"
    }
  }
}
```

Phase 15 activation atomically migrates the exact Phase 12 `rewardClaims` state into `rewardClaimsV2`. Existing pending offers and receipt identities are preserved; older predecessor receipts may be folded only after every predecessor offer ID is captured in the fixed `predecessorClaimedOfferIds` replay set. The Phase 12 field is removed only after the V2 structure validates. A pending offer belongs to exactly one claim store and cannot appear in both.

## 3. Metric state

```json
{
  "metricId": "metric.legacy.oathkeeper.completions.v1",
  "definitionVersion": 1,
  "baselineClass": "accumulated-from-boundary",
  "trackingBeganAt": 1000000,
  "baselineValue": 0,
  "delta": 0,
  "currentValue": 0,
  "sourceIdentity": "<baseline/event authority identity>",
  "identity": "<save-bound metric identity>"
}
```

- Accumulated values use `baselineValue + delta` with safe integers.
- Derivable values recompute from authoritative state and store only evaluation evidence where possible.
- Lower-bound baselines state their limitation in metadata/presentation.
- A metric event has a stable event ID and exact source receipt/transaction identity.
- An Oath undo may inverse only the still-current matching metric event; it cannot erase later unrelated progress.

## 4. Legacy track/tier definitions

Track shape:

```json
{
  "id": "legacy.achievement.oaths-kept",
  "definitionVersion": 1,
  "kind": "continuing",
  "metricId": "metric.legacy.oathkeeper.completions.v1",
  "baselineClass": "accumulated-from-boundary",
  "tierIds": ["legacy.oathkeeper.tier-1"],
  "repeatablePolicyId": null,
  "enablementStatus": "blocked-economy"
}
```

Tier shape:

```json
{
  "id": "legacy.oathkeeper.tier-1",
  "trackId": "legacy.achievement.oaths-kept",
  "definitionVersion": 1,
  "ordinal": 1,
  "threshold": null,
  "significance": "standard",
  "rewardPolicyId": "reward-policy.legacy.oathkeeper.tier-1",
  "rewardPolicyVersion": 1,
  "rewards": null,
  "historyOwner": "phase12",
  "enablementStatus": "blocked-economy"
}
```

A tier cannot enable unless threshold is a positive safe integer, rewards form a valid non-empty canonical Phase 12 bundle, every referenced definition exists, and all earlier tiers are valid.

## 5. Legacy eligibility snapshot

```json
{
  "id": "legacy.ready.oathkeeper.tier-1",
  "definitionId": "legacy.oathkeeper.tier-1",
  "definitionVersion": 1,
  "rewardPolicyId": "reward-policy.legacy.oathkeeper.tier-1",
  "rewardPolicyVersion": 1,
  "metricId": "metric.legacy.oathkeeper.completions.v1",
  "observedProgress": 1,
  "threshold": 1,
  "becameReadyAt": 2000000,
  "evaluationSequence": 1,
  "offerId": "reward.offer.legacy.oathkeeper.tier-1",
  "offerIdentity": "<offer identity>",
  "significance": "standard",
  "identity": "<save-bound ready identity>"
}
```

The snapshot captures eligibility and reward versions. Later progress or definition updates do not reinterpret it. Evaluation creates this snapshot and its pending native Legacy offer in one transaction with zero reward application.

## 6. Legacy claim plan

The caller supplies only ready ID and expected ready/offer identities. The immutable Legacy finalizer:

1. validates the successor lineage, source registry, ready snapshot, current definition/reward version, offer, and history owner;
2. verifies the tier/feat is absent from both Phase 12 and successor claimed history as applicable;
3. applies the Phase 12 global reward bundle;
4. adds the exact tier/feat ID to its owner history in canonical definition order;
5. removes the ready snapshot and pending offer;
6. creates recent receipt/archive evidence;
7. evaluates only the next tier after the claim state exists;
8. returns presentation data after persistence commits.

No claim logic trusts visible ready counts, card order, DOM attributes, or caller-supplied rewards.

## 7. Founding Legacy Cache

```json
{
  "id": "legacy.cache.founding.1",
  "definitionId": "legacy.cache.founding",
  "definitionVersion": 1,
  "componentReadyIds": [],
  "componentReadyIdentities": [],
  "combinedRewards": [],
  "groupingPolicyVersion": 1,
  "createdAt": 0,
  "offerId": "reward.offer.legacy.cache.founding.1",
  "offerIdentity": "<offer identity>",
  "identity": "<save-bound cache identity>"
}
```

Components are canonical and individually eligible. Cache creation does not claim them. Cache claim atomically claims every component and writes one compound receipt whose domain detail preserves component IDs. A missing, changed, or already-claimed component aborts the entire transaction.

## 8. Tutorial successor state

- All tutorial and step IDs are known by the captured registry.
- Arrays are unique and in registry order.
- Completed/dismissed steps must be seen.
- A step cannot be both completed and dismissed.
- Each completed step has one save-bound completion receipt.
- Replay counts are non-negative safe integers with the exact tutorial key set.
- Pending tutorial IDs are unique, eligible, and exclude completed/dismissed tutorials.
- Registry migration adds new keys only and does not alter earlier history.
- Presentation/replay never writes claim, facility, metric, stock, or story state.

## 9. Claim archive

Recent receipt shape retains the Phase 12 canonical rewards and adds domain binding through successor detail:

```json
{
  "id": "reward.receipt.facility.restaurant.1.25",
  "offerId": "reward.offer.facility.restaurant.1",
  "claimedAt": 9000000,
  "sequence": 25,
  "pendingIdentity": "<offer identity>",
  "rewards": [{ "kind": "gold", "targetId": null, "amount": 100 }],
  "domainType": "restaurant",
  "domainIdentity": "<claimed outcome identity>",
  "identity": "<save-bound receipt identity>"
}
```

Archive rules:

- `checkpoint.throughSequence + recentReceipts.length === nextSequence`.
- Recent sequences are contiguous and identities unique.
- `predecessorClaimedOfferIds` is the canonical unique set of every offer claimed before V2 activation; it is fixed after migration and blocks reusing a compacted predecessor offer ID.
- When length exceeds 512, fold the oldest 128 only after validating domain replay authority.
- Checkpoint identity chains the previous checkpoint plus each folded receipt identity in order.
- Aggregate rewards merge canonical kind/target pairs with safe integers.
- Source counts use exact registered source types.
- Domain claimed IDs/ranges remain the replay authority after detail compaction.
- An archive fold never changes balances, metrics, domain progression, ready state, or pending offers.

## 10. Phase 16 Restaurant state

The value at `facilityProgress.localProgressById["facility.restaurant"]` follows:

```json
{
  "contractVersion": 1,
  "configId": "phase-16-restaurant-v1",
  "facilityId": "facility.restaurant",
  "definitionVersion": 1,
  "discoveredAt": 1000000,
  "unlockedAt": 2000000,
  "reputationLevel": 1,
  "progressByTrackId": {
    "facility-progress.restaurant.reputation": 0
  },
  "recipeMasteryByRecipeId": {
    "restaurant.recipe.hearth-stew": 0
  },
  "stationStateById": {
    "restaurant.station.hearth": { "unlocked": true, "level": 1 }
  },
  "stockByRecipeId": {
    "restaurant.recipe.hearth-stew": 0
  },
  "settlement": {
    "cursorAt": 2000000,
    "carryMs": 0,
    "nextOrdinal": 0,
    "context": {
      "definitionVersion": 1,
      "customerPolicyVersion": 1,
      "intervalMs": 3600000,
      "bankCapacity": 4,
      "reputationLevel": 1
    }
  },
  "customerDetailsByOpportunityId": {},
  "engaged": null,
  "claimReadyByOpportunityId": {},
  "claimedOrdinalRanges": [],
  "claimedNamedVisitorIds": [],
  "claimCount": 0,
  "lastClaimReceiptId": null
}
```

The numeric operational values above illustrate a populated runtime state only. Production definitions remain null until an approved policy captures them.

## 11. Customer instance and detail

Base Phase 12 opportunity:

```json
{
  "id": "opportunity.instance.facility.restaurant.1",
  "kindId": "opportunity.facility.activity",
  "facilityId": "facility.restaurant",
  "sourceId": "activity.restaurant-service",
  "createdAt": 5600000,
  "sequence": 41,
  "rewardOfferId": "reward.offer.facility.restaurant.1",
  "identity": "<Phase 12 identity>"
}
```

Restaurant detail:

```json
{
  "id": "restaurant.customer-detail.1",
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<Phase 12 identity>",
  "opportunityDefinitionId": "opportunity.facility.restaurant.customer",
  "definitionVersion": 1,
  "customerDefinitionId": "restaurant.customer.road-worker",
  "customerDefinitionVersion": 1,
  "preferenceIds": ["restaurant.preference.warming"],
  "namedVisitorId": null,
  "generatedAt": 5600000,
  "ordinal": 1,
  "variantSeed": "<save-bound deterministic seed>",
  "expiresAt": null,
  "identity": "<save-bound detail identity>"
}
```

Timed settlement uses Phase 14's algorithm. Named visitors use authored-event delivery with a stable visitor source ID and the same non-expiring bank.

## 12. Restaurant engagement

```json
{
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<identity>",
  "detailIdentity": "<identity>",
  "startedAt": 6000000,
  "commitBoundaryReached": false,
  "recipeId": null,
  "stationId": null,
  "reservedStock": null,
  "stepId": "restaurant.service.choose-recipe",
  "identity": "<save-bound engagement identity>"
}
```

Recipe/station availability comes from captured definitions and live local state. Stock reservation/consumption is adapter-owned and identity-bound. Cancel before commit restores the exact banked customer; after commit the engagement persists until resolution.

## 13. Restaurant outcome

```json
{
  "id": "outcome.facility.restaurant.1",
  "opportunityId": "opportunity.instance.facility.restaurant.1",
  "opportunityIdentity": "<identity>",
  "detailIdentity": "<identity>",
  "definitionVersion": 1,
  "economyPolicyId": "economy-policy.restaurant.v1",
  "economyPolicyVersion": 1,
  "recipeId": "restaurant.recipe.hearth-stew",
  "recipeDefinitionVersion": 1,
  "stationId": "restaurant.station.hearth",
  "stationDefinitionVersion": 1,
  "matchResult": "matched",
  "globalRewards": [{ "kind": "gold", "targetId": null, "amount": 100 }],
  "localDeltas": [
    { "kind": "facilityProgress", "trackId": "facility-progress.restaurant.reputation", "amount": 1 },
    { "kind": "recipeMastery", "recipeId": "restaurant.recipe.hearth-stew", "amount": 1 }
  ],
  "metricDeltas": [
    { "metricId": "metric.restaurant.customers-served.v1", "amount": 1 },
    { "metricId": "metric.restaurant.matched-meals.v1", "amount": 1 },
    { "metricId": "metric.restaurant.facility-profit.v1", "amount": 100 }
  ],
  "offerId": "reward.offer.facility.restaurant.1",
  "offerIdentity": "<Phase 12 offer identity>",
  "resolvedAt": 6200000,
  "identity": "<save-bound outcome identity>"
}
```

All amounts derive from the captured approved policy and are immutable. The example numbers are fixture-like illustration, not approval. Resolution queues the offer and result but applies none of the listed effects.

## 14. Deterministic service result

- Each preference definition declares required/liked recipe tags.
- Each recipe declares stable tags and its compatible station IDs.
- `matched`: recipe satisfies every required preference.
- `partial`: recipe satisfies at least one liked/required preference but not all required preferences.
- `basic`: recipe is valid and serviceable but has no positive match.
- No result is negative, creates debt, removes global progress, or blocks the customer permanently.
- Match-to-reward multipliers remain null in production definitions until approved.
- Variant seed chooses only among eligible customer/visitor definitions at creation; it never determines payout after the player's choice.

## 15. Named visitor and story hook

```json
{
  "id": "restaurant.visitor.route-envoy.01",
  "definitionVersion": 1,
  "actorId": "family.jaina",
  "sourceEventId": "story.book1.restaurant.route-envoy-ready",
  "customerDefinitionId": "restaurant.customer.route-envoy",
  "chronicleHookId": "chronicle.restaurant.route-envoy.01",
  "repeatable": false,
  "expires": false
}
```

The visitor opportunity may be authored before claim. The Chronicle hook becomes eligible only after the matching Restaurant claim receipt commits. Replaying or skipping the Chronicle scene cannot change Restaurant state or repeat rewards.

## 16. Identity and version rules

- Instance identities bind save ID, config/definition IDs and versions, ordinal, timestamps, and all payload references.
- Definition versions change for eligibility/payload/result semantics.
- Economy/reward policy versions change for amounts or payout logic.
- Localization, visible names, art, speakers, layout, or sound do not change mechanical versions.
- Existing banked/engaged/ready objects use legacy adapters for their captured versions.
- Unknown/future versions fail closed and preserve raw recovery data.
- IDs never use visible names, localized text, array position, or random acquisition order.

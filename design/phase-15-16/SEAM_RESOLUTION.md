# Phase 12/14 seam resolution for Phases 15–16

This file is an implementation contract, not a production patch. It resolves the integration gaps found while comparing Phase 14 with the exact Phase 12 runtime.

## 1. Successor validation and migration lineage

### Current constraint

Phase 12 validation requires its activation receipt to be the final item in `saveMeta.appliedMigrations`. Appending a legitimate Phase 15 or Phase 16 receipt therefore makes Phase 12 reject the save.

### Required successor seam

Install one explicit lineage-aware validator layer, not another general wrapper chain.

- Recognize the exact ordered receipt lineage: Phase 12 → Phase 15 → Phase 16.
- Reject duplicates, missing predecessors, out-of-order receipts, unknown successor config/definition identities, and future versions.
- Validate Phase 15/16 state and receipt identities first.
- Project only the known successor receipt/state fields from a clone.
- Restore the Phase 12 receipt as the final projected receipt and invoke the unchanged Phase 12 validator.
- Never mutate live state during projection.
- Export/import/recovery use the full successor validator.

Recommended bounded API:

```text
validatePhase15Successor(state)
validatePhase16Successor(state)
projectPhase15ToPhase12(state)
projectPhase16ToPhase15(state)
```

Phase 15 and 16 activation remain schema-12 additive migrations with exact receipts unless the primary integrator explicitly approves a numeric schema transition.

## 2. Tutorial registry extension

### Current constraint

Phase 12 accepts only five reserved tutorials and requires an exact `replayCountsByTutorial` key set. Phase 13 planning IDs cannot be passed to `phaseTwelveTutorialAction`.

### Required successor seam

Keep Phase 12 tutorial state intact and add one versioned successor store:

```json
{
  "registryId": "tutorial-registry.phase-15.v1",
  "seenStepIds": [],
  "completedStepIds": [],
  "dismissedStepIds": [],
  "completionReceiptsByStepId": {},
  "replayCountsByTutorialId": {},
  "pendingTutorialIds": [],
  "identity": "<save-bound identity>"
}
```

- Phase 15 owns the Waystone/Legacy/board definitions.
- Phase 16 extends with shared-facility and Restaurant definitions.
- A unified presentation adapter routes a tutorial ID to Phase 12 or successor state by registry ownership.
- Unknown IDs fail closed.
- Phase 16 migration adds only new replay keys with zero values and preserves every Phase 15 array/receipt.
- Tutorial completion receipts are non-reward evidence; they never enter the global reward receipt sequence.
- Skip, replay, and presentation can change only tutorial state and neutral UI state.
- Runtime definitions use canonical dot actor/facility IDs even when the Phase 13 planning file used colon/shorthand forms.

## 3. Trusted claim source/finalizer registry

### Current constraint

`phaseTwelveClaimReward` applies global rewards and writes a receipt, but it has no immutable source finalizer for Legacy tier progression or facility-local state.

### Required successor seam

Production installs an immutable registry keyed by exact source type plus source/definition class:

```text
opportunity.legacy.reward → legacyFinalizer
opportunity.story.reward → storyFinalizer
opportunity.facility.activity + activity.restaurant-service → restaurantFinalizer
```

The registry is captured by production closure. It is not exposed through QA bridges and cannot be supplied by the caller.

The claim transaction order is:

1. Clone and validate live save plus successor lineage.
2. Revalidate offer, expected offer identity, domain ready identity, definition/reward versions, and unclaimed replay authority.
3. Ask the registered finalizer to produce a pure validated mutation plan.
4. Apply Phase 12 canonical global rewards to the transaction clone.
5. Apply the allowlisted domain-local plan.
6. Create receipt/archive evidence and update domain replay authority.
7. Remove the pending offer/result.
8. Validate the full successor state and persist once.

Any failure aborts every step. A source with no registered finalizer cannot claim.

## 4. Native reward source classification

Use these exact source rules:

| Reward owner | `sourceType` | `sourceId` |
|---|---|---|
| Legacy tier/feat/cache | `opportunity.legacy.reward` | registered tier, feat, or cache definition ID |
| Story milestone | `opportunity.story.reward` | registered story node/reward ID |
| Restaurant result | `opportunity.facility.activity` | `activity.restaurant-service` |

The Waystone aggregates ready claims for presentation only. It never rewrites source type/ID and never creates a duplicate facility offer for a Legacy reward.

Phase 14's `opportunity.facility.waystone.legacy-milestone` remains reserved and disabled. It may later represent an actual Waystone-specific activity, but not a Legacy claim.

### Successor reward-source registry

The current Phase 12 `createOffer`, `validateOffer`, and `createReceipt` functions close over the original definition registry. They reject new Phase 15 tier/feat/cache source IDs even when those IDs are valid in the successor definition set.

Before Phase 15 activation, add versioned successor factories that accept only the immutable union of the Phase 12 and Phase 15 registries:

```text
createOfferV2 / validateOfferV2
createReceiptV2 / validateReceiptV2
```

- Existing Phase 12 offers and receipts remain byte-valid.
- New Legacy source IDs must exist in the captured Phase 15 definition set.
- Restaurant continues to use the already-registered Phase 12 activity ID.
- The registry cannot be supplied by UI or QA callers.
- Offer/receipt identity versioning must make the accepted registry version explicit without reidentifying historical Phase 12 objects.
- Successor state validation routes each offer/receipt to the correct factory by identity version and refuses ambiguous objects.

## 5. Version-bound facility detail

Keep the Phase 12 base opportunity exact and store Restaurant payload/outcome detail in the Phase 14 successor state.

- Base opportunity `sourceId` is `activity.restaurant-service`.
- Companion detail stores `opportunity.facility.restaurant.customer`, customer/visitor ID, payload version, reward-policy version, deterministic seed, and identity.
- Outcome stores recipe/station/stock identities, result, exact global bundle, exact local deltas, and pending offer identity.
- Old banked/results keep captured definitions across updates.
- Removed definitions remain loadable until no saved item references them.

## 6. Receipt retention and five-year headroom

### Current constraint

Phase 12 requires `receipts.length === nextSequence` and caps both at 10,000. Recurring Restaurant claims can eventually stop the game.

### Required archive shape

Before Phase 16 production activation, replace the unbounded-detail assumption with:

```json
{
  "configId": "claim-archive.phase-15.v1",
  "nextSequence": 0,
  "pendingOffers": {},
  "recentReceipts": [],
  "predecessorClaimedOfferIds": [],
  "archiveCheckpoint": {
    "throughSequence": 0,
    "receiptCount": 0,
    "aggregateRewards": [],
    "sourceCountsByType": {},
    "terminalIdentity": null,
    "identity": "<save-bound checkpoint identity>"
  }
}
```

Rules:

- Phase 15 activation atomically migrates every existing Phase 12 pending offer and receipt into the V2 claim store before removing the old shape.
- Preserve every predecessor offer ID in a canonical fixed replay set, even when its detailed receipt is folded during activation.
- Retain the most recent 512 full receipts.
- When the window exceeds 512, fold the oldest 128 receipts into one save-bound checkpoint in the same transaction.
- Checkpoint identity chains the prior checkpoint identity plus the exact ordered receipt identities being folded.
- Aggregate reward totals and source counts use safe integers and canonical ordering.
- `throughSequence + recentReceipts.length === nextSequence`.
- Recent receipt sequences are contiguous from `throughSequence + 1`.
- Claim replay authority for successor claims remains in the owning domain: Legacy claimed tier/feat IDs, Restaurant claimed ordinal ranges, story completion/reward IDs.
- New offer creation also rejects any ID present in the fixed predecessor claimed-offer set.
- Archiveable claims require a trusted domain finalizer that validates and updates replay authority atomically.
- Old receipt details may be compacted only after their domain replay records are committed and cross-checked.
- Safe export/import includes the checkpoint and domain lineage.

This removes the 10,000-claim stop while keeping save growth bounded. Five-year proof remains a release gate: simulate the maximum approved opportunity cadence and manual-claim behavior, require safe integers throughout, keep the recent window at 512, and keep the serialized archive plus domain ranges within the approved save-size budget. Null production cadence means Phase 16 cannot yet claim that proof.

### Phase 12 compatibility

The successor validator owns the archived reward-claim shape. Add a narrowly scoped Phase 12 validation option that validates every other Phase 12 field while accepting an already prevalidated successor reward-claim subsystem. Phase 15 uses that option only after full V2 claim validation. Silently rewriting sequence/history merely to satisfy the old validator is forbidden.

## 7. Statistics and event integration

### Current constraint

Phase 12 defines Oath and Campaign metrics but the exact runtime only increments Gold-from-reward-claims and facility-claim count inside `phaseTwelveClaimReward`. It does not currently hook Oath completion or Campaign runs. Its `legacy.achievement.gold-claimed` does not mean Village production Gold collected.

### Required event seam

Install small allowlisted event adapters inside existing authoritative transactions:

- successful non-undone Oath completion → Oathkeeper completion and observed-streak metrics;
- scoped Oath undo → inverse the same completion delta only when the exact event is still undoable;
- Village Gold collection commit → Steward collected-Gold metric;
- Building upgrade commit → no accumulated event needed; Builder derives current levels;
- Fellow Campaign committed first clear → Roadwarden derives cleared prefix and feat eligibility;
- every committed Fellow Campaign run → Veteran run metric or authoritative run-count derivation;
- exact-Power first/replay clear → exact-Power feat eligibility;
- Restaurant claim finalizer → customers, matches, named visitors, profit, recipe mastery, and reputation metrics.

Adapters never read display text and never run after-the-fact from DOM events. The same transaction that commits the authoritative action updates the metric or domain eligibility.

## 8. Incremental implementation seam

Recommended files when runtime work begins:

- `src/phase15-waystone-legacy.js` — pure definitions, metric evaluation, ready snapshots, tutorial extension definitions, claim archive validation, and Legacy finalizer plan.
- `src/phase16-restaurant.js` — pure Restaurant definitions, settlement, payload/outcome validation, deterministic matching, claimed ranges, and finalizer plan.
- one bounded inline integration region — activation, successor validation projection, immutable finalizer registration, calls from existing transactions, and DOM binding.

Implementation order:

1. Add lineage-aware successor validation and QA-only fixture activation.
2. Add tutorial successor store and migration with no player presentation.
3. Add trusted finalizer registry and claim archive behind production-off flags.
4. Implement Phase 15 definitions/evaluation and Waystone presentation.
5. Verify Phase 15 fresh/migrated/reload/two-tab/recovery gates.
6. Implement Restaurant settlement and result/claim path with synthetic QA policy only.
7. Obtain economy approval and replace all required nulls with a versioned policy.
8. Enable Phase 16 presentation and complete live mobile/reduced-motion/accessibility validation.

No step needs a framework conversion, storage-key rename, or broad edit to Campaign, roster, or passive economy code.

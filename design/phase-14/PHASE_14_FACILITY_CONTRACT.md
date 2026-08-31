# Phase 14 — Shared facility-opportunity and manual-claim contract

## 1. Player promise

Every Village location may offer a different activity, but all facilities obey the same fairness contract:

1. Opportunities accumulate only after that facility is unlocked.
2. Instantiated opportunities remain banked until the player uses them.
3. Nothing resets or expires at a local-day boundary.
4. Opening the app, settling offline time, opening a facility, or rendering a result never credits a reward.
5. The player performs the facility's distinctive interaction.
6. The resolved result becomes visibly claim-ready.
7. Only an explicit Claim action credits global resources and reward-bearing local progression.
8. The exact result can be credited only once across reloads and tabs.

Passive Gold production remains unchanged underneath this loop. Active play is an acceleration layer, not a tax on inactivity.

## 2. Scope

This contract covers:

- the original Command Center, Archives, Training Grounds, and Hearth;
- the Waystone as objective/Legacy claim hub;
- Restaurant, Apothecary, Schoolhouse, Market/Workshop, Gatehouse, Gardens, and Forge;
- discovery, lock, available, and ready map states;
- banked opportunity generation;
- facility-specific interaction payloads and outcomes;
- manual global/local claims;
- local facility progression;
- tutorials, ambient comments, named visitors, story hooks, and claim acknowledgements;
- offline settlement, migration, concurrency, receipt retention, and QA.

It does not approve exact cadence, capacity, rewards, profit share, recipe lists, patient cases, pupil generation, petition consequences, or story unlock thresholds.

## 3. Shared lifecycle

### 3.1 Facility visibility

| State | Map presentation | Behavior |
|---|---|---|
| `hidden` | No marker | Story has not introduced the location |
| `discovered` | Dim marker | Location is known but activity is locked |
| `available` | Normal marker | Activity can be opened; no result currently needs attention |
| `ready` | Glowing marker | At least one opportunity or manual claim is ready |

`ready` is derived presentation, not a separately persisted unlock state. Claim-ready takes priority over opportunity-ready so the player is not encouraged to perform more work before collecting an existing result.

### 3.2 Opportunity state machine

```text
elapsed time or authored event
          ↓
       banked ── player begins ──→ engaged
          ↑                         │
          └──── safe cancel ────────┘
                                    │ player resolves activity
                                    ↓
                               claim-ready
                                    │ explicit Claim
                                    ↓
                                  claimed
```

- `banked` opportunities are immutable and non-expiring.
- `engaged` is resumable. Closing a panel, reloading, or going offline does not consume it.
- A safe cancel returns it to `banked` unless the facility definition declares a committed choice boundary.
- `claim-ready` binds an immutable outcome, global reward bundle, local progression deltas, and future receipt identity.
- `claimed` is represented by compact completion lineage and the Phase 12 claim receipt/archive, not by leaving the full opportunity object forever.

An activity may skip `engaged` only if the player completes its one-step action explicitly. It may never skip `claim-ready` by auto-paying.

## 4. Banked and non-expiring opportunities

### 4.1 Instantiated opportunities never expire

Every created opportunity has `expiresAt: null` by contract. It is not removed by:

- midnight or a new calendar day;
- missing an Oath cycle;
- offline settlement;
- a version update;
- reaching bank capacity;
- closing the facility;
- leaving a result unclaimed.

### 4.2 Capacity is saturation, not expiry

Each production-enabled facility eventually receives an approved positive `intervalMs` and `bankCapacity`.

When the bank is full:

- existing opportunities remain intact;
- no hidden backlog or unbounded elapsed debt accumulates;
- elapsed time beyond the settled capacity does not instantiate additional opportunities;
- the cursor advances to the captured settlement time;
- the UI states that the facility is full and waiting for attention.

No instantiated opportunity was lost, so this is not expiry. Capacity must be large enough to cover the approved unattended-play target and is an economy decision, not a framework default.

### 4.3 Event opportunities

Story, visitors, and named events may enqueue a non-timed facility opportunity. They use the same identity, bank, interaction, result, and claim rules. Duplicate story/event delivery must be prevented by a stable authored source ID, not by display text.

## 5. Offline and clock rules

- Facility settlement uses the transaction coordinator's one captured `now`, never an uncaptured second clock read.
- It consumes the same capped elapsed window used by the approved offline session: at most 24 hours per opening/settlement.
- It is not segmented by local midnight and does not depend on timezone or daylight-saving transitions.
- `now <= cursorAt` creates nothing, changes no carry, and never moves the cursor backward.
- A forward settlement advances the cursor even when the bank is full, avoiding hidden time debt.
- Partial intervals remain as `carryMs` and are always less than the saved interval.
- Before interval, capacity, definition version, or local-level context changes, settle elapsed time using the old saved context; then replace the context in the same transaction.
- Offline settlement creates canonical opportunity and detail records only. It creates no reward offer, receipt, local mastery, reputation, inventory, Gold, or other resource.

## 6. Distinct activities, shared envelope

The framework standardizes persistence and claims, not the gameplay verb.

| Facility | Distinct interaction |
|---|---|
| Command Center | Review a petition and choose a bounded Village response |
| Archives | Select a research lead and reconstruct a map, record, or discovery |
| Training Grounds | Choose participants and conduct a drill, spar, or formation exercise |
| Hearth | Select attendees/activity and host a gathering or relationship scene |
| Waystone | Inspect the communal objective and manually open Story/Legacy claims |
| Restaurant | Read a customer's preference, choose a recipe/station, and serve |
| Apothecary | Compare clues, diagnose a case, and select an appropriate remedy |
| Schoolhouse | Choose a pupil/lesson and advance long-form education |
| Market/Workshop | Review requirements and fulfill an order or commission |
| Gatehouse | Assess route conditions and receive a caravan, visitor, or road event |
| Gardens | Choose a plot/crop or herb and later perform a non-expiring harvest |
| Forge | Review requirements and complete an equipment or Relic commission |

No facility may ship by copying Restaurant's choice model and changing nouns. Each definition declares its own payload/outcome validator and authored tutorial sequence.

## 7. Manual claim contract

### 7.1 No auto-credit

The following actions credit zero global or reward-bearing local value:

- offline settlement;
- opportunity creation;
- opening a map marker or facility;
- beginning/resuming/canceling an interaction;
- rendering a result;
- tutorial completion, skip, or replay;
- story dialogue attached to a facility.

Resolution may record non-reward history needed to resume or explain the result. Global rewards and local deltas such as reputation, mastery, Education Earnings, recipe mastery, or graduation completion apply only during Claim.

### 7.2 Result and offer binding

At resolution, one transaction:

1. revalidates the live engaged opportunity and expected identity;
2. validates the submitted choice/action through the facility adapter;
3. creates an immutable outcome detail with definition and reward-policy versions;
4. derives the canonical Phase 12 reward offer ID already reserved by the opportunity;
5. queues that offer with `sourceType: opportunity.facility.activity` and the exact Phase 12 `activityId` as `sourceId`;
6. marks the opportunity `claim-ready` and binds the outcome-detail identity to the offer identity;
7. applies no rewards or local progression.

### 7.3 Exactly-once facility claim

The Claim action uses the Phase 12 shared claim path with an immutable source adapter registered for `opportunity.facility.activity`.

Inside the same `mutatePersisted` transaction, the adapter must:

- revalidate the opportunity, result detail, offer, expected identities, facility definition version, and unclaimed status;
- allow Phase 12 to apply the canonical global reward bundle and create its receipt;
- apply the bound local progression deltas;
- remove the pending opportunity/detail from active state;
- update compact claimed-ordinal lineage;
- increment facility claim and relevant Legacy statistics;
- leave one committed receipt that binds all applied global and local effects.

A caller-supplied callback is not trusted. Finalizers come only from an immutable source-adapter registry installed by production code.

If a source adapter is absent or throws, the entire claim fails without writes or partial reward application.

## 8. Phase 12 integration seam

Phase 14 should consume, not duplicate, these Phase 12 functions and structures:

- `EVERSTEAD_PHASE12_FOUNDATION.validId`
- `createOpportunity` / `validateOpportunity`
- `createOffer` / `validateOffer`
- `createReceipt` / `validateReceipt`
- `facilityProgress.localProgressById`
- `opportunityLedger.pendingById`
- `rewardClaims.pendingOffers` and `receipts`
- `phaseTwelveQueueRewardOffer`
- `phaseTwelveClaimReward`
- `phaseTwelveTutorialAction`

Before a live facility can ship, the Phase 12 integration must add five narrow successor seams:

1. **Version-bound opportunity detail:** A Phase 14 external module owns immutable detail/outcome identities keyed by the Phase 12 opportunity ID. Phase 12's base opportunity remains unchanged.
2. **Immutable claim source adapters:** `phaseTwelveClaimReward` invokes a registered facility finalizer inside its existing transaction so global and local effects commit together.
3. **Successor receipt compatibility:** Phase 12 validation currently requires its activation receipt to be the final migration receipt. It must accept explicitly known, lineage-bound successor receipts or the facility framework must use a separately authenticated local profile without appending a migration receipt.
4. **Receipt retention:** The current 10,000-receipt cap cannot be the long-term recurring-facility archive. Before multi-facility scale, add a versioned compact archive/checkpoint or prove a batching policy with at least five years of headroom under the maximum supported claim cadence.
5. **Phase 13 tutorial registry:** Phase 12 currently accepts only its five reserved tutorial definitions and requires an exact `replayCountsByTutorial` key set. Before any Phase 13/14 tutorial is recorded, install a versioned successor registry/state validator that recognizes the Phase 13 tutorial IDs while preserving all existing tutorial history and receipts. Unknown IDs must continue to fail closed.

The Phase 12 base opportunity and offer both use the registered Phase 12 `activityId` as `sourceId`. The more specific Phase 14 opportunity-definition ID lives only in the version-bound external detail. Passing `opportunity.facility.restaurant.customer` (or another Phase 14 definition ID) into the current Phase 12 `createOpportunity`/`createOffer` source field is invalid and must be rejected.

Recommended code boundary when implementation begins:

- `src/phase14-facilities.js`: pure definitions, identities, detail/outcome validators, settlement planning, claimed-range operations, and source-adapter contract.
- one small inline adapter: authoritative state mutation through the existing coordinator, captured clock, Phase 12 offer/claim functions, and UI binding.
- no additional wrapper chain around unrelated Campaign, roster, or economy functions.

## 9. Stable identity and versioning

- Framework config: `phase-14-facility-framework-v1`
- Definition set: `definition-set.phase-14-facilities.v1`
- Facility IDs remain the Phase 12 IDs permanently.
- Activity and opportunity-definition IDs are stable and never use visible names or array indexes.
- Instance IDs derive from facility ID plus monotonically increasing ordinal.
- `definitionVersion` changes only when eligibility, payload, or outcome semantics change.
- `rewardPolicyVersion` changes when global or local rewards change.
- Copy, localization, art, layout, or tutorial wording changes do not change mechanical versions.
- Banked/engaged/claim-ready items keep their captured versions and are never reinterpreted by a newer definition.
- Removed definitions remain reserved until all saved instances using them are resolved or migrated explicitly.

## 10. Migration and activation

- A Phase 12 profile receives no retroactive facility opportunities.
- Discovery alone creates no accrual history.
- When an already-qualified save receives a newly released facility, one explicit unlock transaction sets `unlockedAt` and `cursorAt` to the captured current time. It does not backdate to Campaign completion, Rank, Phase 12 activation, or install time.
- Newly unlocked facility state begins with empty banks, no results, no offers, no local progression, and no claim history unless a separately approved migration says otherwise.
- Existing Phase 12 baseline policy remains `unknown-historical`.
- A feature update preserves all pending instances under their captured definition/reward versions.
- Malformed or future-version facility state blocks facility mutation and enters the existing recovery path; it must not be silently dropped or regenerated.
- Safe reset and import/export include the facility state through existing save/recovery mechanisms.

## 11. Concurrency and failure recovery

- Generation, begin/resume/cancel, resolution, and claim are separate mutation classes with expected active raw/revision checks.
- Two tabs settling the same interval derive the same ordinals; only one commit wins and the loser writes nothing.
- Two tabs beginning or resolving the same opportunity cannot produce two outcomes or offers.
- Two tabs claiming the same result produce one Phase 12 receipt and one set of local deltas.
- A stale tab is refused before presentation claims success.
- Web Storage still has no compare-and-swap primitive; retain the documented narrow final reread-to-write residual risk.
- If presentation fails after a committed resolution or claim, reload derives the correct claim-ready or claimed UI from persisted state.
- Claim-ready opportunities remain banked if receipt capacity is unavailable. The UI must explain the capacity condition; it may not discard or auto-pay them.

## 12. Tutorial contract

Every facility ships tutorial definitions before its feature flag is enabled:

1. **Discover:** physical map location, icon state, purpose, and passive/active relationship.
2. **First action:** the facility's unique interaction and safe cancel/resume behavior.
3. **Result/claim:** no auto-credit, exact ready rewards, manual Claim, and non-expiry.
4. **Mastery:** local progression only after the player has completed at least one claim.

Tutorials use the Phase 13 IDs in `facility-definitions.json`, the Phase 12 tutorial state/receipt path, and the same non-blocking, replayable, skippable, one-per-safe-visit behavior. A tutorial never creates, consumes, resolves, or claims an opportunity.

## 13. Dialogue and cast hooks

Facility definitions contain actor IDs from the Phase 12 registry and one or more roles:

- `tutorial-guide`
- `ambient`
- `activity-presenter`
- `named-visitor`
- `result-comment`
- `claim-acknowledgement`
- `story-hook`

Every one of the 18 Fellow and 20 Family actor IDs appears in at least one facility hook. Selection must respect Fellow Rank availability. Missing cutout art uses the approved framed or text-only treatment; full-background profile art is never placed as an unframed Village overlay.

The actor supplies warmth and context, never a hidden mechanic. All critical instructions remain understandable without character flavor, and dialogue must remain original Everstead writing rather than imitation of external franchise voices.

## 14. Acceptance criteria

### Definitions and state

- All twelve Phase 12 facility IDs are present exactly once with valid activity, map anchor, target phase, stable local-progress track, participant kind, tutorial, opportunity, and actor references.
- Every timed facility blocks activation until positive approved cadence and capacity are supplied.
- Every persisted instance validates against its captured definition/reward versions and identity.
- Pending, engaged, and claim-ready instances are disjoint and bounded by declared capacity plus one engaged item.
- Claimed ordinal ranges are sorted, non-overlapping, canonical, and cannot contain a pending ordinal.

### Offline and banking

- Zero, negative, repeated, midnight-crossing, DST-crossing, and greater-than-24-hour elapsed fixtures behave deterministically.
- A six-hour eligible fixture creates only the exact whole intervals and retains partial carry.
- A full bank advances its cursor, preserves existing opportunities, creates no hidden debt, and auto-credits nothing.
- Reload produces byte-equivalent pending opportunity identities.

### Interaction and claims

- Begin/resume/cancel cannot pay or consume an opportunity incorrectly.
- Resolution produces one outcome and one pending Phase 12 offer with zero reward applications.
- Claim applies the exact global bundle and local deltas once, finalizes the opportunity once, and records one bound receipt.
- Repeated, stale, malformed, future-version, wrong-facility, wrong-save, and identity-mismatched claims perform no write.
- A result can remain unclaimed indefinitely without blocking passive Gold, story, or unrelated facilities.

### Migration and concurrency

- Fresh and established Phase 12 saves initialize with no retroactive facilities or opportunities.
- A save already beyond an unlock condition starts accrual at release/unlock time, not historical qualification time.
- Two-contender settlement, resolution, and claim each produce one winner and a write-free loser.
- Export/import/recovery preserve all opportunity, outcome, offer, local-progress, and claim identities.

### Tutorials and cast

- Every player-visible facility feature references at least one valid tutorial ID before enablement.
- Tutorial skip/replay changes no opportunity or reward state.
- All 38 Phase 12 Fellow/Family actors appear in the union of facility dialogue hooks.
- Locked Fellows are excluded from live speaker selection.
- Missing speaker art never causes a broken image or substitutes an unframed full-background portrait.

## 15. Do not break

- Do not change the storage namespace or silently increment schema 12.
- Do not infer retroactive facility history.
- Do not credit rewards during offline settlement, activity resolution, rendering, tutorials, or story dialogue.
- Do not add facility stamina, expiring tickets, daily resets, or a global facility currency.
- Do not mutate existing Building passive-economy fields to hold active-facility state.
- Do not let facility definitions execute arbitrary code or trust caller-supplied finalizers.
- Do not enable a facility with placeholder cadence, capacity, reward, or unlock values.
- Do not allow active income to overtake the approved passive baseline without Phase 14 economy simulation.

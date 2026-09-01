# Phase 17 data specification

## Scope and authority

This is a versioned successor contract for Book I story, Chronicle, story-driven Village discovery, and durable Village presentation. It does not change the released save, campaign, Rank, Fellow joins, Buildings, facility-opportunity runtime, or rewards.

Stable definition sets:

- `definition-set.phase-17-book1.v1`
- `definition-set.phase-17-village-unlocks.v1`
- `definition-set.phase-17-village-visuals.v1`

The implementation must capture and validate an immutable definition registry at boot. Existing records retain the exact definition version and source identity used when they were created.

## Successor state

Phase 17 adds one optional `storyV1` object to the versioned save only after the runtime migration is available:

```text
storyV1
  schemaVersion: 1
  activeBookId: story.book1.first-covenant | null
  completedSceneIds: ordered unique stable scene IDs
  skippedSceneIds: ordered unique subset of completedSceneIds
  completedBookIds: ordered unique stable book IDs
  queuedSceneItems: ordered queue items
  chronicleRecords: ordered immutable records
  recapEligibleSceneIds: ordered unique stable scene IDs
  acknowledgedVillageChangeIds: ordered unique stable change IDs
  activeDefinitionSetIds: exact supported definition-set IDs
```

A queue item is:

```text
queueId: story-queue.<uuid-or-monotonic-id>
sceneId: stable scene ID
definitionVersion: positive integer
reason: fresh | stage-resolution | rank-arrival | optional-interlude | migrated-recap
eligibleRevision: save revision at eligibility
queuedAt: wall-clock metadata only
predecessorSceneId: stable scene ID or null
```

A Chronicle record is:

```text
recordId: chronicle-record.<stable unique ID>
sceneId: stable scene ID
definitionVersion: positive integer
resolution: watched | skipped | migrated-recap
resolvedRevision: save revision
resolvedAt: wall-clock metadata only
choiceId: stable flavor choice ID or null
rewardOfferId: immutable story offer ID or null
```

Timestamps never determine eligibility, ordering, reward contents, or winners. Arrays are bounded by the complete Book I definition count; duplicate stable IDs are invalid.

## Authoritative inputs and derived projections

Only these inputs may advance Phase 17 truth:

- a committed Campaign first-clear for one of the ten exact `broken-roads-*` stages;
- committed Player Rank state, with the released deterministic Fellow roster already reconciled;
- explicit Next/Skip completion of an eligible story scene;
- explicit manual claim through the Phase 15 `rewardClaimsV2` finalizer;
- validated import/recovery migration.

Facility map state and Village visual changes are projections, not independent grants:

```text
facility map state = completed story + enabled facility capability + opening content + banked claim state
visual change state = completed source scene
Book I complete = story.book1.finale.first-covenant resolved
```

The original four passive Buildings remain governed by their current Building state. Phase 17 may neither hide them nor suspend production, upgrades, Oath boosts, or Family assignment.

## Eligibility and ordering

Eligibility reconciliation is deterministic and runs inside the existing clone → mutate → validate → commit → adopt coordinator.

For a Campaign first-clear that also increases Rank:

1. Commit the existing Campaign clear, costs, rewards, Rank EXP, Rank, and Fellow joins exactly as released.
2. Queue the matching stage-resolution scene.
3. After that scene resolves, queue any newly eligible Rank-arrival scene.
4. After the arrival resolves, make its tutorial eligible.
5. Only then expose the next chapter tutorial or optional interlude.

An intro scene is eligible before the first clear attempt. It may be skipped and cannot alter the attempt math. Replay clears do not enqueue an intro, resolution, arrival, visual change, tutorial, or reward.

For a Rank jump, missing arrival scenes are queued Rank 2, 3, 4, then 5. At most one arrival or migrated recap is presented per safe Village visit. Arrival scenes observe the authoritative roster; they never add, remove, or repair Fellows.

## Scene resolution and replay

`resolveStoryScene(sceneId, mode, choiceId)` must:

1. Validate exact scene/version and current queue eligibility.
2. Validate `mode` as `watched` or `skipped`; validate any flavor choice against the localized scene definition.
3. Add one Chronicle record and the completed/skipped IDs.
4. Remove only the owned queue item.
5. Derive Book, facility-discovery, and Village-change consequences.
6. If the scene has a production-enabled story reward, create one immutable ready offer; otherwise create none.
7. Validate the whole successor state and commit once.

Replay reads a Chronicle record and the captured definition version. It is presentation-only: it cannot mutate completion, queue ordering, Book state, facility state, tutorials, Rank, rosters, visual changes, opportunities, or claims. Replay uses a contextual replay line or condensed recap, not the original first-clear introduction contract.

Skip completes the content dependency but never silently claims a reward. Skip and replay remain reachable by keyboard and assistive technology.

## Chronicle and log

Chronicle lives under **More** and does not create a sixth bottom-navigation destination. It groups by Book → chapter → scene and exposes:

- watched/skipped state;
- spoiler-safe locked entries;
- replay for resolved entries;
- a dialogue log for the current/replayed scene;
- a separate link to the existing Tutorials shelf.

New content inserted into a chapter already cleared by a migrated player becomes `recapEligible`, not auto-watched. One optional recap may be queued per safe visit. The player may ignore it without blocking story, facilities, claims, or passive progress.

## Native story rewards and claims

Story rewards use native source type `opportunity.story.reward`; they are not generic facility opportunities and not legacy milestones. Immutable source IDs must be registered through the Phase 15 V2 registry before production enablement.

Offer identity is stable and exact:

```text
offerId = story-offer.<rewardDefinitionId>.<definitionVersion>.<eligibleStoryRevision>
sourceId = rewardDefinitionId
sourceType = opportunity.story.reward
rewards = immutable approved reward snapshot
state = ready | claimed
```

The trusted Phase 15 finalizer validates and claims a ready offer exactly once, writes the existing bounded `rewardClaimsV2` receipt/checkpoint state, and credits approved resources in the same transaction. Replay, skip, offline passage, scene opening, animation, tutorial completion, or Book completion never auto-credit.

All five Phase 17 reward arrays are `null` and `blocked-economy`. A null, unknown, future-version, or disabled reward definition must fail closed and create no offer. Synthetic rewards are fixture-only.

## Offline behavior

Offline passage retains the released 24-hour passive cap and existing claim-time rolls. It never consumes story, resolves a scene, advances a tutorial, changes a facility map state directly, or creates/claims a story reward in the background. On the next safe foreground visit, deterministic reconciliation may enqueue eligible story items based on already committed stage/Rank truth.

## Concurrency

All story mutations use current save revision, raw-state identity, captured definition registry, and the existing same-tab guard. The last active-state reread precedes the active write. A stale tab must reject rather than:

- duplicate a Chronicle record;
- consume a foreign queue item;
- create a second reward offer;
- claim twice;
- regress Book/facility/visual projections.

Web Storage has no compare-and-swap. The known narrow reread-to-write race remains; revision/raw identity, staging provenance, exact receipts, and storage events narrow and detect it. No design text claims atomic multi-tab writes.

## Migration

Migration is additive and idempotent:

1. Validate the predecessor save and captured Phase 17 definition registry.
2. Create `storyV1` once.
3. Infer historical stage scenes from committed first-clear state, never from current Rank alone.
4. Add inferred entries as Chronicle `migrated-recap` records or recap-eligible definitions; do not force full historical scenes.
5. Queue missing Rank-arrival recaps in ascending order based on authoritative Rank and roster state.
6. Grandfather any already-operational successor facility and synthesize its discovery/opening Chronicle availability without re-locking or replaying grants.
7. Derive Village visual states from inferred/committed scene completion.
8. Preserve all predecessor tutorial and claim history exactly.
9. Validate, commit once, and leave the exact write-once backup untouched.

If evidence is ambiguous, prefer less story completion and an optional recap. Never infer a reward claim or create retroactive currency.

## Import and validation

Reject mutation and route to safe recovery when any of the following is true:

- unknown/future `schemaVersion` or active definition set;
- duplicate scene, queue, Chronicle, Book, or visual ID;
- skipped scene not present in completed scenes;
- completed Book without its required finale scene;
- queue item for an unknown scene/version or a resolved scene;
- Chronicle record with an unknown scene/version or invalid resolution;
- facility/visual projection not reproducible from story and enabled capability state;
- unsupported actor, facility, stage, tutorial, reward, or hook ID;
- reward offer/receipt mismatch;
- any Prosperity/HQ threshold in a Phase 17 definition.

Unknown future fields are preserved by export when the enclosing schema is supported, but current mutation paths cannot interpret or rewrite them.

## Implementation seams

Phase 17 runtime cannot start until these seams exist:

1. Phase 15 V2 immutable source/receipt registry accepts native `opportunity.story.reward` IDs and retains enough headroom for five Book I offers.
2. The Phase 15 tutorial successor registry accepts the 12 existing ledger IDs and canonical dot actor IDs without rewriting predecessor history.
3. The released Campaign first-clear coordinator emits an internal post-commit result containing exact stage ID, previous/new Rank, and authoritative roster state.
4. Facility capability registry exposes stable, fail-closed availability IDs used by `facility-unlocks.json`.
5. The trusted claim finalizer accepts story offers and writes one transaction with resource credits and receipt/checkpoint state.
6. Chronicle renderer can resolve captured definition versions and safe speaker fallbacks.
7. Final localized story copy, flavor choices, reward values, and Village art/CSS treatments receive approval.

No runtime code should guess around a missing seam.

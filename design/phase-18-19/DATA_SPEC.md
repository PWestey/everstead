# Phases 18–19 data specification

## 1. Scope and immutable registries

Phase 18 and Phase 19 extend the Phase 14 facility envelope and Phase 15 successor services. Pure definition modules contain no DOM, storage, clock reads, global random state, or direct save writes.

Required immutable registries:

- `definition-set.phase-18-apothecary.v1`;
- `definition-set.phase-19-schoolhouse.v1`;
- the exact Phase 14 facility/activity/opportunity IDs;
- Phase 15 V2 offer/receipt sources and trusted finalizers;
- Phase 18/19 tutorial successor definitions;
- captured story, cast, case, lesson, pupil, and policy versions.

Every definition used by a banked case, lesson, result, pupil, or graduation remains loadable until no saved state references it. UI and QA callers cannot supply or replace registries.

All production policy values are null. Definition validation must reject enablement unless every required cadence, capacity, reward, progress, modifier, threshold, selection-weight, and profit value is present, bounded, canonical, and versioned.

## 2. Shared facility envelope

Regular Apothecary cases and Schoolhouse lessons use:

- Phase 12 base opportunity kind `opportunity.facility.activity`;
- their exact registered Phase 12 `activityId` as offer `sourceId`;
- Phase 14 local ordinals, detail identities, engagement/resume, claimed ordinal ranges, and non-expiry;
- Phase 15 `rewardClaimsV2`, receipt folding, replay protection, and immutable finalizer registry;
- one captured clock and clone → mutate → validate → commit → adopt transaction flow.

Graduation is not interval-generated and does not create a second regular lesson opportunity. It uses a Phase 15 V2 pending offer bound directly to a validated facility-local graduation-ready snapshot, with the same `opportunity.facility.activity` source classification and trusted-finalizer path. These activities do not reuse Restaurant customer, recipe, station, stock, match, reputation, or profit structures.

| Domain | Base source ID | Domain detail | Durable local progression |
|---|---|---|---|
| Apothecary | `activity.apothecary-cases` | patient, region, case template, clues, diagnosis/remedy options | mastery, case/outcome/region counts, known knowledge, named-patient history |
| Schoolhouse lesson | `activity.school-lessons` | lesson, domain, seated pupil, teaching approach, optional mentor evidence | per-pupil development, education, lesson/approach history |
| Schoolhouse graduation | `activity.school-lessons` | graduation-ready snapshot bound to pupil and triggering lesson receipt | graduated-pupil history, approved Education modifier |

## 3. Phase 18 Apothecary state

The value at `facilityProgress.localProgressById["facility.apothecary"]` has this successor shape:

```text
contractVersion: 1
configId: phase-18-apothecary-v1
facilityId: facility.apothecary
definitionVersion: 1
discoveredAt / unlockedAt: captured timestamps
masteryLevel: positive safe integer
progressByTrackId:
  facility-progress.apothecary.mastery: non-negative safe integer
settlement: Phase 14 cursor/carry/ordinal plus captured policy context
caseDetailsByOpportunityId: exact companion map
engaged: null or one validated Apothecary engagement
claimReadyByOpportunityId: immutable terminal outcomes
claimedOrdinalRanges: canonical compact ranges
claimedNamedPatientIds: unique definition-order IDs
caseHistory:
  claimedCaseCountsByTemplateId
  claimedOutcomeCountsByBandId
  claimedRegionCountsById
  knownDiagnosisIds
  knownRemedyIds
claimCount: non-negative safe integer
lastClaimReceiptId: stable receipt ID or null
```

Aggregate history keys are the exact captured definition key sets. Counts are safe integers. Regular-instance narrative logs are not persisted; the bounded recent receipt archive and claimed ordinal ranges provide evidence. Named-patient history is bounded by the immutable named-patient registry.

### Case detail

```text
id: apothecary.case-detail.<ordinal>
opportunityId / opportunityIdentity
opportunityDefinitionId: opportunity.facility.apothecary.case
definitionVersion
caseTemplateId / caseTemplateVersion
regionId / regionVersion
namedPatientId: stable ID or null
patientActorId: current actor ID or null
clueIds: exact canonical clue set
diagnosisOptionIds: canonical option order
remedyOptionIds: validated known/safe remedy set
generatedAt / ordinal / variantSeed
rewardPolicyId / rewardPolicyVersion
identity: save-bound detail identity
```

Generation uses a save-bound deterministic seed and only definitions whose story gates were committed before the captured settlement time. A named patient is excluded when already pending, engaged, claim-ready, or claimed. Null selection weights block generation.

### Engagement and guarded resolution

Apothecary resume steps are `review-clues`, `choose-diagnosis`, `choose-remedy`, `recheck`, and `review-outcome`.

Clue viewing and draft selections are neutral UI state. Resolution receives only stable selected IDs and expected opportunity/detail identities. It recomputes the outcome from captured definitions:

- an incompatible pair enters `apothecary.outcome.recheck`, reveals a localization-safe contradiction, preserves the case, creates no outcome/offer, and permits revision;
- a safe support remedy creates `apothecary.outcome.supportive`;
- the precise diagnosis plus precise compatible remedy creates `apothecary.outcome.precise`.

There is no terminal failure band. Closing before a terminal result preserves the engaged resume state. Once a terminal outcome exists, closing preserves claim-ready state. No choice auto-credits a reward.

### Outcome and finalizer

The terminal outcome binds case, choice, outcome band, exact global reward snapshot, exact mastery/history deltas, offer identity, and definition/policy versions. Its production reward and local progress values cannot be built while policy values are null.

The trusted Apothecary finalizer atomically:

1. revalidates live save, offer, case detail, outcome, versions, and unclaimed ordinal/named-patient authority;
2. applies the canonical global reward bundle;
3. applies approved mastery and exact aggregate history deltas;
4. records newly known diagnosis/remedy IDs allowed by the outcome definition;
5. updates allowlisted metrics;
6. removes opportunity/detail/outcome/engagement;
7. adds ordinal and named-patient replay authority;
8. writes one V2 receipt and updates the bounded archive;
9. validates and persists once.

Any failure rolls back everything.

## 4. Phase 19 Schoolhouse state

The value at `facilityProgress.localProgressById["facility.schoolhouse"]` has this successor shape:

```text
contractVersion: 1
configId: phase-19-schoolhouse-v1
facilityId: facility.schoolhouse
definitionVersion: 1
discoveredAt / unlockedAt
progressByTrackId:
  facility-progress.schoolhouse.education: non-negative safe integer
settlement: Phase 14 cursor/carry/ordinal plus captured policy context
lessonDetailsByOpportunityId: exact companion map
seatStateById: exact unlocked seat-key set
candidatePupilIds: unique story-eligible, unseated, ungraduated IDs
pupilStateById: durable enrollment/development records
engaged: null or one validated lesson engagement
claimReadyByOpportunityId: immutable lesson outcomes
graduationReadyByPupilId: immutable major-ready snapshots
claimedLessonOrdinalRanges: canonical compact ranges
graduatedPupilIds: unique definition-order IDs
graduationReceiptIdByPupilId: exact graduated-pupil key set
lessonHistory:
  claimedLessonCountsByPupilId
  claimedApproachCountsById
claimCount / graduationClaimCount
lastClaimReceiptId / lastGraduationReceiptId
```

### Seats and pupils

A seat ID is `schoolhouse.seat.<positive-ordinal>`. Seat creation is permitted only by an approved seat policy. Story-eligible pupils wait in `candidatePupilIds` without expiring. Seating a pupil is a neutral, exact, transactional state change: it spends nothing, grants nothing, and cannot duplicate a pupil.

Pupil state captures:

```text
pupilId / pupilDefinitionVersion
seatId
enrolledAt / enrollmentRevision
developmentByDomainId: exact domain key set
claimedLessonCount
graduationDefinitionId / version
graduationStatus: developing | ready | graduated
lastLessonReceiptId: stable ID or null
identity: save-bound pupil identity
```

Pupil identity and development survive reload, definition updates, seat changes allowed by a future policy, and Chronicle replay. A pupil can be enrolled and graduated at most once per save in V1.

### Banked lessons and teaching

Lessons bank by approved interval independently of customer service or patient cases. A lesson detail captures lesson/domain definition, story gate, variant seed, and policy versions. It is not assigned to a pupil until engagement.

Engagement validates one banked lesson, one occupied seat, its pupil, and one stable teaching approach. Any registered approach completes a positive `guided` outcome; alignment with both lesson affinity and pupil preference produces `resonant`. There is no destructive wrong answer. The result snapshot binds:

- lesson/opportunity/detail identities;
- seat, pupil, development preimage, and graduation definition;
- chosen approach;
- optional Family mentor evidence;
- global reward, pupil-development, and education deltas;
- offer and policy versions.

Closing before resolution preserves engagement. Closing after resolution preserves claim-ready state. Lesson progress is applied only by manual claim.

### Controlled Family relationship modifier

The optional mentor modifier reads one validated owned Family member's existing `family.intimacy` state at lesson resolution. It must:

- use an immutable allowlisted eligibility rule;
- capture actor ID, source identity, source value band, policy version, and computed bonus in the outcome;
- be positive-only and limited to one mentor;
- preserve the no-mentor baseline;
- never consume, increase, or otherwise mutate Family relationship state;
- never change a pupil's personality, availability, graduation identity, or story;
- remain within separately approved progress and reward caps.

The eligibility rule, formula, and both caps are null. The modifier and Schoolhouse production enablement therefore fail closed.

### Lesson finalizer and graduation eligibility

The trusted lesson finalizer atomically:

1. revalidates the lesson, pupil/seat preimage, mentor evidence, outcome, offer, and unclaimed ordinal;
2. applies the canonical global reward and approved local deltas;
3. updates pupil development, Education progress, history, and metrics;
4. removes the lesson/detail/outcome and records the claimed ordinal;
5. writes one V2 lesson receipt;
6. evaluates graduation only from the newly committed-in-clone pupil progress;
7. if every approved domain requirement is met and the pupil is neither ready nor graduated, creates one immutable graduation-ready snapshot and one pending major offer;
8. validates and persists once.

Graduation evaluation never auto-claims and never frees a seat.

### Major graduation claim

Graduation offer identity is stable:

```text
offerId: reward.offer.facility.schoolhouse.graduation.<pupilId>.v<definitionVersion>
sourceType: opportunity.facility.activity
sourceId: activity.school-lessons
domainClaimKind: schoolhouse-graduation
domainIdentity: graduation-ready identity
```

The immutable finalizer dispatches by captured source plus validated domain record, never caller text. It rechecks the pupil, exact requirements, ready identity, offer, graduated history, and triggering lesson receipt. One transaction applies approved major rewards and Education modifier, marks the pupil graduated, records the exact receipt, removes ready/offer state, frees the seat, updates metrics, validates, and persists.

`graduatedPupilIds` plus `graduationReceiptIdByPupilId` is permanent replay authority even after detailed receipts fold. A second claim is an idempotent no-op or stale conflict and cannot credit again.

This requires an explicit V2 factory seam: a facility-local one-time ready snapshot may own a pending offer without a recurring Phase 12 opportunity-ledger entry. If the implemented V2 factory still requires every offer to reference a base opportunity, runtime is blocked. It must be extended immutably or the integrator must approve a separate one-shot opportunity definition; runtime must not fabricate an interval lesson or reuse its ordinal.

## 5. Claims and archive headroom

Apothecary cases, Schoolhouse lessons, and Schoolhouse graduations all use `opportunity.facility.activity` with their registered activity source. The immutable finalizer registry adds exactly:

```text
activity.apothecary-cases + apothecary-case -> apothecaryFinalizerV1
activity.school-lessons + schoolhouse-lesson -> schoolhouseLessonFinalizerV1
activity.school-lessons + schoolhouse-graduation -> schoolhouseGraduationFinalizerV1
```

Before activation, the five-year archive simulation must be rerun with the approved combined maximum cadence. Null cadence cannot satisfy that gate. Recent receipt retention remains 512 and folds remain 128; domain ordinal ranges and graduated/named IDs remain replay authority.

## 6. Story, cast, and achievement seams

Story only discovers a facility and introduces its activity:

- Apothecary: `story.book1.chapter2.records-in-rain` → `facility.apothecary.possibility-case`.
- Schoolhouse: `story.book1.chapter3.river-accord.resolution` → `facility.schoolhouse.first-mentor-lesson`.

Story replay cannot regenerate a patient, pupil, lesson, outcome, reward, or claim.

`cast-bindings.json` is a bounded subset of the existing 38-person schedule. It neither reassigns primary content nor requires all actors in these phases. Speaker presentation uses approved transparent cutout, framed, or text-only treatment and never an unframed full-background profile portrait.

Achievement hooks emit allowlisted metric events only inside committed finalizers. Achievement definition IDs and thresholds are null; no achievement or reward exists until separately approved.

## 7. Tutorials

No tutorial ID is invented. Phase 18 uses first-case, diagnosis, and mastery IDs. Phase 19 distributes the existing `first-lesson` step IDs across three contextual moments:

1. `seats` and `pupil` on first Schoolhouse view;
2. `banked-lessons` when the first lesson is ready;
3. `teach` when the first lesson engagement opens.

Pupil development and graduation use their own existing IDs. Shared banking and claim tutorials run only when not already completed. Tutorials are skippable/replayable, mutate tutorial/neutral UI state only, and never block a case, pupil, lesson, claim, passive progress, or story.

## 8. Settlement, offline, and non-expiry

Each facility calls the pure Phase 14 settlement planner with one captured clock and its own approved policy. Available slots subtract banked, engaged, and claim-ready regular opportunities. The planner:

- caps elapsed allowance at the released 24-hour offline limit;
- creates deterministic ordinals/details only for available slots;
- advances the cursor without accumulating hidden whole-interval debt at saturation;
- never expires, solves, assigns, resolves, rewards, claims, graduates, or advances a tutorial;
- writes settlement additions atomically through the existing coordinator.

Candidate pupils, banked cases/lessons, engaged activity, claim-ready results, and graduation-ready snapshots do not expire.

## 9. Successor validation and migration

Required lineage is ordered and exact: the implemented Phase 12 foundation and Phase 15/16/17 successors, then `migration.phase-18.apothecary.v1`, then `migration.phase-19.schoolhouse.v1`. The integrator must adapt the exact lineage to the released runtime rather than treating design commits as save migrations.

Each migration:

1. validates the full predecessor and immutable registries;
2. creates only its own state/profile and tutorial replay keys;
3. derives story discovery/opening from committed Phase 17 story state;
4. creates no opportunities while policies are null;
5. preserves Restaurant, Waystone, Legacy, story, tutorial, claim, passive Building, Family, Campaign, and roster bytes;
6. validates and commits once with an exact receipt;
7. remains idempotent on reload/import/recovery.

An already-operational facility is grandfathered without repeating opening dialogue or grants. Ambiguous historical activity never infers a case, lesson, pupil progress, graduation, reward, or claim.

Validation rejects:

- unknown/future config, definition, policy, identity, tutorial, actor, story, facility, activity, or opportunity IDs;
- missing/out-of-order migration lineage;
- duplicate ordinals, named patients, pupils, seats, claims, or graduations;
- detail/opportunity, engagement/detail, outcome/offer, pupil/seat, or graduation/receipt mismatches;
- noncanonical range/history keys or unsafe counts;
- an expired record;
- a terminal Apothecary failure outcome;
- a Schoolhouse modifier without valid source evidence and approved caps;
- enabled definitions containing any required null;
- claimed local progress without a matching receipt/domain replay record.

Import/recovery adopts nothing until the complete successor validates. Unknown future fields are preserved by export only when their enclosing schema is supported; current mutation code cannot rewrite them.

## 10. Concurrency and residual risk

Every mutation carries current save revision, raw-state identity, registry identity, and exact domain preimages. The coordinator performs stage/write/readback/parse, active conflict reread, active write/readback/validate, and ownership-checked staging cleanup.

A stale tab must reject instead of duplicating or regressing a case, lesson, pupil seat, mastery, development, graduation, offer, receipt, or tutorial. Storage events mark a realm stale and require refresh.

Web Storage has no compare-and-swap. The narrow last-reread-to-write race remains a documented blind spot; identities, replay authority, staging provenance, and exact receipts narrow/detect but cannot mathematically eliminate it.

## 11. Runtime implementation seams

Runtime work is blocked until all of these exist:

1. lineage-aware Phase 18/19 validator projections;
2. captured definition registries and fail-closed QA-only synthetic-policy injection;
3. tutorial registry extensions using exact ledger IDs and step histories;
4. three trusted finalizer registrations listed above, plus the validated domain-ready offer seam for graduation;
5. facility-specific detail/outcome validators and deterministic planners;
6. authoritative story-state and Family-intimacy read adapters;
7. approved complete policies and archive headroom proof;
8. final localized copy, speaker fallbacks, and mobile/reduced-motion presentation.

No runtime code may guess around a null value or missing seam.

# Everstead Phases 18–19 — Independent Apothecary and Schoolhouse QA Contract

## Scope and release boundary

This independent lane evaluates two distinct private-release activities against the accepted `design/phase-18-19/*` contracts, immutable approved policy successor, and released predecessor seams. It owns QA code, deterministic fixtures, QA documentation, and focused mechanical verification. The runtime implementation remains modular and private; it does not modify accepted design, touch art assets, change deployment, merge, push, or reinterpret the Restaurant as a template.

The implementation was developed in parallel, then retargeted sequentially onto exact accepted Phase 17 integration tip `a6b168f`. The successor uses the released Phase 15 pending-offer/V2 receipt/archive authority and Phase 13 Legacy registry; it does not retain a second Phase 18–19 claim store. Final acceptance still requires inherited Restaurant verification and root static/live/diff review. Private activation does not authorize deployment: public release false is a required invariant.

Inherited behavior is mandatory:

- Phase 12's central clone → mutate → validate → commit → adopt coordinator and canonical reward kinds;
- Phase 14's stable facility/activity/opportunity envelope, deterministic ordinals, non-expiry, engagement, settlement, and claimed-range lineage;
- Phase 15's V2 offer/receipt/archive identities, immutable registered-finalizer dispatch, 512 recent receipts, and 128-receipt folding;
- Phase 17's committed story discovery/opening authority and tutorial/cast registry;
- the original four Buildings' passive Gold production and Family assignments;
- the released 24 elapsed-hour offline cap, save/import/recovery behavior, Gold/Oaths, Campaign, Rank, and roster state.

## Frozen QA bridge

The locally and query-gated bridge is `window.__EVERSTEAD_PHASE_18_19_QA__`, version `phase-18-19-independent-qa-v1`. It must capture the selected injected storage adapter and reject destructive access unless `runtime.qa.allowDestructive === true`, `runtime.qa.isolatedStorage === true`, and the selected adapter is not the captured native `localStorage` object. It may not expose production internals, install a fake engine, accept caller-supplied registries/finalizers, or derive production values from the QA fixture.

Read-only methods:

- `definitions()` returns exact predecessor lineage, both facility/config/definition registries, story authority, immutable finalizer and archive registry, graduation one-shot identity, tutorials, cast policy, and production enablement.
- `snapshot()`, `validate()`, `derive()`, `tutorialLog()`, `raw()`, and `exportSave()` expose normalized observations without mutation.
- `passiveBaseline(capturedAt)` derives the original four Buildings' immutable production/Family-assignment semantics at that exact captured timestamp. It returns the Gold currency identity, Oath multiplier policy/formula, effective Oath boost and rate at `capturedAt`, Family assignment identity/multiplier, and the 24-hour cap. It deliberately excludes volatile balances/timestamps and raw `boostDay`; legitimate wall-clock or midnight drift is therefore neither mistaken for a regression nor allowed to alter the same-time semantic comparison.
- `policyReport()` returns null-policy enablement and, only in an isolated QA realm, the explicitly injected QA-only registry identity. Production must never fall back to that registry.

Destructive methods, isolated storage only:

- `resetFixture(id)`, `reload()`, `importFixture(payload)`, `advanceOffline(scenario)`, and `mutateInvalid(kind)` cover fresh, migrated, offline, recovery, import, future, corrupt, and malformed states.
- `settle(facilityId,capturedAt)` invokes the pure shared settlement seam with one captured clock and the facility's own policy.
- `openFacility(facilityId)` changes neutral presentation only.
- `beginApothecary(caseId,identity)`, `chooseDiagnosis(caseId,identity,diagnosisId)`, `chooseRemedy(caseId,identity,remedyId)`, and `resolveApothecary(caseId,identity)` exercise the immutable case detail.
- `seatPupil(pupilId,seatId)`, `beginLesson(lessonId,identity,pupilId,seatId)`, `chooseApproach(lessonId,identity,approachId,mentorActorId)`, and `resolveLesson(lessonId,identity)` exercise persistent pupil development.
- `claim(offerId,offerIdentity)` dispatches a regular case/lesson claim only through the immutable registered finalizer.
- `claimGraduation(offerId,offerIdentity)` dispatches the distinct graduation V2 finalizer bound to a facility-local ready snapshot.
- `tutorial(id,action)` supports contextual open, skip, log, and replay without mechanical rewards or feature blocking.
- `simulateConcurrent(kind)` returns one-winner/one-loser evidence for the eight declared settlement, seat, resolution, lesson-claim, and graduation-claim races.
- `probeFinalizerFailure(kind,mode)` exercises missing/throwing dispatch, consumed-plan tamper, and fixed faults after local/reward application, claimed-range update, canonical offer deletion, and receipt/archive append through the real isolated coordinator. Every refusal must preserve raw state, revision, resources, local facility records, offers/plans, ranges, and archive with zero committed writes.

The inherited Phase 17 QA bridge additionally exposes fixed, QA-authorized
facility-introduction fault modes `after-unlock`, `after-projection`, and
`after-outcome`. They are not caller-supplied production callbacks. Each
attempt executes the real opening transaction and must leave Phase 17 truth,
Phase 18–19 projection, Tutorial Log outcome, raw state, revision, and write
count unchanged.

Normalized output is a test observation contract, not an alternate source of game state.

## Approved private policy and domain isolation

The accepted design files deliberately retain null cadence, capacity, selection, reward, progress, mastery, Education, relationship, graduation, and achievement values. Runtime authority comes only from the separately versioned immutable `phase-18-19-product-policy-approved-v1` successor. If its exact approval lineage, fixed table, completeness, or private-release flags fail validation, activation, settlement, resolution, and claims fail closed. `0`, an empty array, a generic default, a Restaurant value, or the independent QA fixture may not substitute for a missing approved value.

The historical product-policy candidate resolved all 86 null slots and was approved without value changes at exact reviewed commit `513b2f0e4d9aa8498770e48ea3faf04c515f2aa9`. The immutable approval record freezes the candidate file hashes and copies its 52-band fixed reward table, tutorial timing, cast schedule, and values into a new private authority. The candidate itself remains non-authoritative review history and is never read as a runtime fallback.

Approved private values are 60 minutes / bank 8 / 8 unattended hours for Apothecary and 90 minutes / bank 8 / 12 unattended hours for Schoolhouse. Apothecary Mastery is +2/+3 at levels 0/12/36/90. Schoolhouse begins with one seat, caps at two, requires 8 progress in each of three domains, and uses a positive-only +1 mentor development cap with at most 250 fixed Gold. Graduation remains the separate V2 one-shot: captured fixed Gold, one Gift, three Relic Stones, and +6 flat local Education. These values are authoritative only for the private release and do not authorize public deployment.

The approved recurring ceiling for Phases 18–19 is 1,050 basis points of passive Gold and the 30-day total active ceiling is 1,200 basis points. Just-below/at/just-above every fixed-band boundary must pass. Five-year receipt/archive estimates must remain below 1 MiB and retain at least a 100× JavaScript safe-integer headroom factor. Passive production and Family assignment mutations must remain exactly zero.

The independent fixture uses unmistakably QA-only values different from Restaurant QA values. The bridge may accept it only with isolated-storage attestation. Production definitions and saves may never persist its registry ID.

Apothecary and Schoolhouse may share only the facility envelope, claim coordinator, and archive. They may not import Restaurant customer, preference, recipe, station, preparation, stock, reputation, match, visitor-profit, or pricing structures. Restaurant values may not substitute for null design fields. Each activity owns a separate policy identity, settlement cursor, bank, detail map, engagement, local progression, history, and finalizer.

## Phase 18 — Apothecary gate

Cases bank deterministically up to an approved cap and never expire. Offline settlement may generate eligible cases but may not open, diagnose, choose a remedy, resolve, progress mastery, reward, claim, or advance a tutorial. Saturation retains no hidden whole-interval debt; partial carry remains canonical; clock rollback is write-free.

Opening a case shows the immutable patient, region, clues, diagnosis options, and safe remedy options. Draft choices may persist as neutral engagement state. The resolver receives stable IDs and recomputes compatibility from the captured registry:

- an incompatible diagnosis/remedy pair enters nonterminal `apothecary.outcome.recheck`, highlights a localization-safe contradiction, preserves the same case, and creates no outcome, offer, reward, mastery, ordinal, metric, or receipt;
- a safe support remedy creates terminal positive `apothecary.outcome.supportive`;
- the exact diagnosis and precise compatible remedy create terminal positive `apothecary.outcome.precise`;
- no terminal failure band may exist.

Closing or reloading resumes the same semantic step, stable choices, and identity. A terminal result remains claim-ready and pays nothing until Claim. The immutable Apothecary finalizer atomically applies the exact global reward and approved local mastery/history/knowledge/metric deltas, consumes the opportunity/detail/result, records ordinal and named-patient replay authority, and writes one V2 receipt/archive update. Duplicate, stale, malformed, missing-adapter, throwing-adapter, receipt, archive, and two-client failures produce zero partial effects.

Named Rook and Daredevil cases are one-time, story/Rank gated, and each must exist in exactly one authority domain: pending named-patient IDs, one live banked/engaged/ready case, or claimed history. Reloading a live named case cannot requeue or duplicate it. Regional selection respects committed Book I story gates. Story replay never generates or rewards a case.

## Phase 19 — Schoolhouse gate

Unique story-eligible pupil candidates wait without expiring. Seating is a neutral exact transaction: one pupil, one valid unlocked seat, no duplicate enrollment, no reward, and no relationship mutation. A seated pupil persists across multiple claimed lessons, reload, export/import, and recovery. Lessons bank independently, never expire, and do not require a pupil to exist when generated.

One banked lesson is assigned only when engagement begins. Every registered approach produces positive Guided development; alignment with lesson affinity and pupil preference produces Resonant development. There is no destructive wrong answer. Closing or reloading preserves lesson/detail/pupil/seat/approach/mentor identities. Resolution creates one immutable result and offer with zero payment; manual Claim atomically applies reward, pupil development, Education, history, ordinal, metrics, and one V2 lesson receipt.

The optional Family mentor contract is strictly positive-only:

- zero or one owned eligible Family member;
- no-mentor always preserves the full baseline;
- source is validated existing `family.intimacy` state;
- bonus is captured at resolution and revalidated at claim;
- progress and reward bonuses have separately approved positive caps;
- Family Intimacy, shards, rarity, assignment, Bond, story, and ownership bytes are never consumed or mutated;
- a missing rule/formula/cap keeps the modifier and Schoolhouse production disabled.

## Graduation V2 one-shot identity

The last lesson Claim first commits its ordinary lesson receipt and development. If every captured requirement is now met, that same transaction creates exactly one immutable graduation-ready snapshot and one major offer. It does not graduate, pay, free the seat, fabricate another lesson, or consume a recurring opportunity ordinal.

The offer identity is `reward.offer.facility.schoolhouse.graduation.<pupilId>.v<definitionVersion>`, with `sourceType: opportunity.facility.activity`, `sourceId: activity.school-lessons`, `domainClaimKind: schoolhouse-graduation`, and the exact graduation-ready `domainIdentity`. The V2 factory must support this facility-local one-shot owner or fail closed; it may not reuse a lesson opportunity or accept caller text as dispatch authority.

The distinct `schoolhouseGraduationFinalizerV1` revalidates the pupil, requirements, triggering lesson receipt, ready identity, offer, seat, and permanent replay history. One transaction applies approved major rewards/Education modifier, records one graduation receipt, marks the pupil graduated, frees the seat, removes ready/offer state, and updates metrics/archive. `graduatedPupilIds` plus `graduationReceiptIdByPupilId` remains replay authority after receipt folding. Repeated/reloaded/two-client claims can produce only one credit and one seat release.

The immutable finalizer registry must contain exactly these domain dispatch entries:

1. `activity.apothecary-cases + apothecary-case → apothecaryFinalizerV1`;
2. `activity.school-lessons + schoolhouse-lesson → schoolhouseLessonFinalizerV1`;
3. `activity.school-lessons + schoolhouse-graduation → schoolhouseGraduationFinalizerV1`.

## Migration, archive, import, and recovery

Lineage is exact and ordered through the implemented Phase 12 and Phase 15/16/17 successors, then `migration.phase-18.apothecary.v1`, then `migration.phase-19.schoolhouse.v1`. Each migration validates the full predecessor, captures one clock/revision/raw identity, adds only its own profile/tutorial replay keys, derives story discovery/opening honestly, creates no value under null policy, preserves every predecessor authority, validates, and commits once. An established Phase 17 save whose facility was already operational records `migrated-recap`; normal UI can record only watched or skipped. Repetition and a same-clock second boot preserve the active save bytes, revision, resources, and mechanical state when no positive settlement is due. Safe staging cleanup may still be observable as storage-adapter operations and is not an active-save write.

Import and recovery adopt nothing until the complete successor, domain relationships, finalizer registry, receipt/checkpoint chain, and replay authorities validate. Future or corrupt input remains exportable without replacing the active save. Malformed details, unknown IDs/versions, expired records, terminal Recheck, negative development, mentor stacks, Family mutation, missing graduation trigger receipts, wrong domain kinds, broken archive checkpoints, and broken save bindings all fail before a write.

V2 archive folding retains 512 recent receipts and folds 128 at a time. Folding cannot change balances, mastery, Education, pupil development, named-patient or graduated-pupil history, claimed ordinal ranges, or replay protection. Approved combined cadence and a five-year headroom proof remain production blockers.

## Tutorials and ten-actor scope

The exact nine accepted tutorial IDs come from the 79-ID ledger. Shared board/banking/claim tutorials do not repeat if completed at Restaurant. Apothecary first-case, diagnosis, and mastery tutorials remain separate. Schoolhouse First Lesson retains one tutorial ID but segments existing steps across three contexts: seats/pupil on first visit, banked-lessons when a lesson is ready, and teach when the engagement opens. Pupil Progress follows the first lesson Claim; Graduation waits for a real major ready offer.

Tutorials are contextual, gradual, skippable, logged, replayable, reward-neutral, and mechanically non-blocking. At most one auto-presents during a safe visit. Step history resumes at the next contextually eligible unseen step.

For Apothecary and Schoolhouse, committed Book I discovery grants the exact
Phase 17 capability but does not silently open the facility. The first explicit
tap or keyboard activation on the discovered hotspot presents the feature
introduction. Watch or Skip commits the Phase 17 content resolution/unlock,
successor projection, and explicit tutorial outcome in one transaction or not
at all. The actual Tutorial Log aggregates predecessor rows plus Phase 18–19,
labels migrated recaps honestly, and replays presentation with zero rewards,
writes, or revision change. Pointer activation with ambient focus and keyboard
activation both return focus to the exact hotspot on Escape, Watch, or Skip.

The exact ten-actor subset is Rook, Daredevil, Scarlet Witch, Yennefer, Shadowheart, Aerith, Obi-Wan, Spider-Man, Ahsoka, and Hermione. Aerith intentionally belongs to both facilities. A locked Fellow never speaks. Mechanical copy does not depend on a speaker. Village dialogue uses an approved transparent cutout, approved framed treatment, or attributed text only—never an unframed full-background character-sheet portrait.

The supplied protagonist is the separate Player Character `player.wayfarer`. He is not a Fellow, Family member, or Companion; never receives those roster assignments, shards, rarity, or facility-speaker scheduling; and is not counted among the ten Phase 18–19 facility actors. Import, migration, recovery, tutorial, dialogue, and facility validation must preserve that separation.

Apothecary, Schoolhouse, and related Family sheets must expose stable semantic controls and state hooks so a forthcoming original Everstead visual-polish contract can restyle them without changing mechanics. This gate does not ingest reference art, authorize copying another game's assets or trade dress, or freeze unapproved CSS. Visual review must judge Everstead's own presentation while preserving the full-background character-sheet art only on the character sheet and never as an unframed Village dialogue overlay.

## Five-realm actual-DOM gate

Five isolated realms cover 320×568, 390×844, 1024×768, 130-percent copy, and reduced motion. Every realm loads the real candidate `index.html`, injects only memory storage/clock/random/ID adapters before production scripts, instruments native storage, and calls only the production QA bridge.

The runner queries actual nodes and computed styles for the physical Village board and both eastern-plaza hotspots; 44×44 targets; viewport containment; keyboard Enter/Space activation; focus entry and return; Escape without unintended state writes; clues, diagnoses, remedies, Recheck, seats, pupils, lessons, approaches, ordinary Claim, major graduation Claim, and Close controls; horizontal overflow; and copy expansion. It also verifies five bottom-navigation items and non-color-only outcome/status text.

Reduced-motion coverage is intentionally non-tautological. The reduced realm still supplies the runtime preference adapter, but that result alone cannot pass. The real candidate stylesheet text must contain a `prefers-reduced-motion: reduce` media rule that disables both animation and transition globally, and production must publish the actual runtime response as `data-everstead-reduced-motion="reduce"` (or `"no-preference"` in ordinary realms) on the document root plus the same normalized bridge marker. The gate cross-checks the marker, static CSS contract, and semantic facility nodes. A monkey-patched `matchMedia().matches` value by itself is insufficient. Root may additionally use browser-level media emulation during manual review.

Normalized QA output alone cannot prove actual layout or accessibility. The live gate must inspect actual DOM nodes/styles; root must still visually inspect composition and real-device behavior.

## Required candidate result

Package-only validation must continue to prove the exact frozen preimplementation baseline. On the private candidate, all 13 formerly absent runtime boundaries must pass: bridge, inherited V2 lineage, Apothecary runtime/flow, Schoolhouse runtime/flow, graduation one-shot, mentor handling, approved-policy fail-closed surface, migrations, finalizers/archive, cast/tutorial runtime, and DOM contract.

The live candidate produces ten package rows plus eighty-three rows from each of five realms, for 425 total. Every realm must use real candidate DOM and a distinct isolated memory store, remain at zero native-storage accesses and zero warning/error console entries, and pass focus, keyboard, Escape, atomic introduction rollback, persisted Tutorial Log replay, same-clock reload, named-patient uniqueness, overflow, reduced-motion, lifecycle, archive, concurrency, cast, and passive-preservation assertions. This result is not claimed until root executes the connected browser gate.

## Blind spots and root review

Web Storage still has no compare-and-swap; the final reread-to-write race can be narrowed and detected, not eliminated. This sequential candidate cannot prove final visible copy, art rights, Safari/real-device visual quality, or integration safety by itself. Root review must inspect all production diffs, rerun predecessor and Restaurant gates, verify exact source ownership, run all five live realms, and manually review both activities before integration.

# Phases 18–19 — Apothecary and Schoolhouse contract

## Objective

Add two implementation-ready Village activities that share Everstead's banked-opportunity/manual-claim infrastructure but feel fundamentally different from the Restaurant and from one another.

- **Apothecary:** read a patient case, compare clues, choose a diagnosis and remedy, then claim a forgiving treatment outcome.
- **Schoolhouse:** seat a unique pupil, spend banked lessons through deliberate teaching choices, build durable development over time, then claim a major graduation exactly once.

This package is design/data only. Production remains disabled.

## Shared product rules

- Passive play remains the foundation; these activities accelerate it.
- Cases and lessons bank and never expire.
- No activity resolves, progresses, rewards, or claims itself offline.
- Every reward requires an explicit manual claim and is credited exactly once.
- An incorrect choice never destroys a banked opportunity or produces a punitive reward loss.
- Local progression changes only in the same trusted transaction as a successful claim.
- Story discovers the visible Village location; implementation capability plus opening content makes it active.
- Tutorials are contextual, gradual, skippable, replayable, and mechanically non-blocking.
- Final copy uses original Everstead roles, not recognizable external-franchise voice imitation.

## Phase 18 — Apothecary

### Activity loop

1. A patient case banks in the Apothecary.
2. Opening it shows the patient/region and a small visible clue set.
3. The player compares clues and selects a diagnosis.
4. The player selects a remedy from known safe options.
5. The resolver recomputes compatibility from immutable definitions.
6. An incompatible pair enters **Recheck**: it highlights a contradiction and lets the player revise, without consuming the case or creating a reward.
7. A safe support remedy yields **Supportive**; the precise diagnosis/remedy yields **Precise**.
8. The terminal result banks as claim-ready until the player claims it.

There is no terminal failure tier. The distinction is better observation, not punishment. Reward/progress differences remain null pending balance approval.

### Patient variety

The definition set reserves three original Everstead case families across the Broken Roads, River Crossing, and Skybridge/Harbor regions. Each later region requires its committed Book I story gate.

Named patient cases are one-time, definition-bound opportunities. The initial bounded set uses Rook and Daredevil only where the existing cast-hook schedule already assigns them Apothecary visitor roles. Named appearances do not change ownership, roster progression, or the actor's primary authored assignment.

### Mastery and history

Apothecary Mastery is local to the facility. Claims may eventually increase mastery, recognize diagnoses/remedies, and widen case variety. Exact progress values, thresholds, and unlock rules remain null.

Durable history stores bounded definition-keyed counts, known knowledge, named patients, claimed ordinal ranges, and receipt evidence. It does not store an unbounded prose log.

### Story and achievement hooks

- Discovery: **Records in Rain**.
- Opening: **Possibility Case**.
- Mastery story: **Precise Remedy**.
- Later regional reflection: **Quiet Roads**.

Claim finalizers may emit exact cases/precision/region/named-patient/mastery metrics. Achievement IDs and thresholds remain null, so hooks cannot create achievements or rewards yet.

### Tutorials

- First Case: patient, clues, possible remedies, no harsh failure.
- Diagnosis: compare clues, select diagnosis, select remedy, resolve.
- Mastery: local mastery, remedy knowledge, patient variety, local-only progression.
- Shared banking/claim tutorials run only if unseen; they do not repeat for a player who learned them at the Restaurant.

## Phase 19 — Schoolhouse

### Activity loop

1. Story-eligible pupils wait without expiring.
2. The player seats a pupil in an unlocked Schoolhouse seat.
3. Lessons bank independently and never expire.
4. The player assigns one banked lesson to one seated, developing pupil.
5. The player chooses Demonstrate, Practice, or Discuss.
6. Every registered approach yields positive **Guided** development; alignment with lesson and pupil preference yields **Resonant**.
7. The result banks as claim-ready. Manual claim applies pupil development and Education progression.
8. Once every approved development requirement is met, one graduation-ready snapshot and major offer are created.
9. Graduation remains ready until manually claimed; the exact-once claim records permanent history and frees the seat.

This is not a Restaurant customer loop: a pupil persists across many lessons, carries multidomain development, occupies a seat, and culminates in a separate major claim.

### Seats, pupils, and development

Seats use stable ordinals. Seat counts and unlock rules are null. Pupil candidates are unique, story-gated, and one-enrollment-per-save in V1. The initial definitions reserve three original pupil IDs without final visible copy.

Development spans Foundations, Craft, and Community. Graduation requirements are null. Definitions capture the exact version used by an enrolled pupil so future content additions do not reinterpret existing progress.

### Controlled Family relationship modifier

One eligible owned Family mentor may contribute a positive-only bounded modifier derived from validated Intimacy at lesson resolution. No mentor always receives the baseline. The modifier:

- never stacks beyond one Family member;
- never consumes or changes Intimacy;
- never blocks a pupil or lesson;
- never changes story, personality, roster, or graduation identity;
- is captured in the outcome and revalidated at claim;
- cannot activate until eligibility, formula, and progress/reward caps are approved.

### Graduation

Graduation is not the automatic result of the last lesson. The lesson claim first commits development and, if requirements are now met, creates a separate immutable ready snapshot and pending major offer.

The graduation claim revalidates pupil requirements, the triggering lesson receipt, offer identity, and permanent replay history. It applies approved major rewards/Education modifier, records one graduation receipt, marks the pupil graduated, and frees the seat in one transaction. A second claim cannot credit again.

### Story and achievement hooks

- Discovery: **River Accord** resolution.
- Opening: **First Mentor Lesson**.
- Development story: **Growing Things**.
- Teaching-variety story: **Lesson Plan**.
- Pupil-arrival context: **Young Futures**.

Claim finalizers may emit exact lesson/pupil/approach/graduation/Education metrics. Achievement definitions and thresholds remain null.

### Gradual tutorials

The existing First Lesson tutorial is delivered in three contextual segments rather than one wall of text:

1. Seats and pupil selection on the first Schoolhouse visit.
2. Banked lessons when the first lesson is ready.
3. Teaching choice when the first lesson engagement opens.

Pupil Progress appears after the first committed lesson claim. Graduation appears only when the first major graduation claim is ready. All tutorial steps retain their existing 79-ledger IDs and semantic step IDs.

## Cast scope

This package uses ten unique actors already scheduled for these facilities:

- Apothecary: Rook, Daredevil, Scarlet Witch, Yennefer, Shadowheart, Aerith.
- Schoolhouse: Obi-Wan, Spider-Man, Ahsoka, Aerith, Hermione.

Aerith intentionally bridges the two. The remaining current actors keep their existing Book I/facility schedule; this package creates no requirement to force all 38 into two facilities.

Every binding references exact Phase 13 content and Phase 15–16 hook IDs. Dialogue presentation uses transparent cutout, approved framed treatment, or text only. Full-background character-sheet art is never placed unframed over Village dialogue.

## Economy and enablement

The following are deliberately null and production-blocking:

- interval cadence, unattended target, and opportunity bank capacities;
- Schoolhouse seat capacities and unlocks;
- patient, region, lesson, and pupil selection weights;
- all regular and major rewards;
- mastery, Education, and pupil-development amounts/curves;
- graduation requirements;
- Family relationship formula and caps;
- all achievement thresholds/rewards and active-profit targets.

No `0`, empty array, generic fallback, Restaurant value, or synthetic QA value may substitute for a null production value.

## Migration and non-regression

Migrations are ordered, additive, idempotent, and exact. They add facility state and tutorial replay keys only after the full predecessor validates. Story can grandfather discovery/opening state, but migration creates no cases, lessons, pupil progress, graduations, rewards, or claims while policy is null.

Do not change:

- Restaurant customers/stock/reputation or Waystone/Legacy claims;
- current passive Building production, Gold, Oaths, Family assignment, and 24-hour offline cap;
- Campaign/Rank/Fellow joins or Book I scene ordering;
- storage key, save backup, recovery/export/import, or claim archive semantics;
- current cast IDs, primary authored assignments, profiles, or artwork.

## Acceptance gate

Automated validation must prove:

- exact Phase 14 facility/activity/opportunity identities for both phases;
- non-expiry and manual claim mode for cases and lessons;
- every case clue/diagnosis/remedy/region/patient reference resolves;
- Recheck is nonterminal/rewardless and no terminal failure band exists;
- every lesson/domain/approach/pupil/graduation reference resolves;
- Family modifier is one-mentor, positive-only, non-mutating, and null-capped;
- exact-once regular and graduation claim replay authorities are distinct and durable;
- all referenced story IDs exist in Phase 17 or the Phase 13 cast content schedule;
- the ten-actor subset and every hook resolve without changing 38-cast coverage;
- every tutorial ID is in the exact 79-ID ledger and Phase 19 step segmentation uses existing steps;
- every required policy value remains null and all production flags are false;
- deterministic fixtures cover fresh/migrated, banking/non-expiry, choices, reload/resume, offline, claims, graduation, corruption, two-tab, archive folding, mobile, localization expansion, keyboard/focus, and reduced motion;
- the commit contains only `design/phase-18-19/*`.

## Known blind spots and runtime blockers

- Web Storage still lacks compare-and-swap; the final reread-to-write race can be narrowed/detected but not eliminated.
- Null cadence prevents a five-year combined claim/archive headroom proof.
- No production behavioral/browser test is possible because this package intentionally changes no runtime.
- Final visible copy, pupil names, patient variants, and any new art need approval.
- Public character/art authorization remains unresolved.
- Successor migrations, registries, finalizers, story/Family adapters, and accessible UI remain implementation work.
- Graduation requires a validated V2 offer bound to a facility-local ready snapshot; the current envelope must support that path or gain an approved one-shot definition before runtime.

Until all blockers are resolved, both phases fail closed.

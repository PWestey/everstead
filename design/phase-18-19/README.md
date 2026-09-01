# Phases 18–19 Apothecary and Schoolhouse design package

## Status

Design, immutable data specifications, fixtures, and validation only. No production HTML, CSS, JavaScript, save data, artwork, feature flag, deployment, merge, or remote branch is changed.

## Outcomes

### Phase 18 — Apothecary

- non-expiring banked patient cases;
- visible clues, diagnosis choice, and remedy choice;
- guarded recheck instead of irreversible wrong-answer failure;
- precise and supportive positive outcomes;
- named-patient, regional, Book I, dialogue, metric, and future-achievement seams;
- local Apothecary mastery and bounded durable case history;
- manual exact-once case claims through the shared facility finalizer;
- separate first-case, diagnosis, and mastery tutorial moments.

### Phase 19 — Schoolhouse

- stable seats and unique pupil enrollments;
- non-expiring banked lessons that are assigned to a seated pupil;
- distinct teaching approaches and gradual development;
- one optional, capped, positive-only Family relationship modifier;
- durable pupil and graduation history;
- ordinary lesson claims plus a separate major exact-once graduation claim;
- tutorial moments spread across seats, banked lessons, teaching, development, and graduation.

## Files

- `PHASE_18_19_CONTRACT.md` — product, activity, tutorial, cast, story, claim, migration, accessibility, and acceptance contract.
- `DATA_SPEC.md` — successor state, immutable identities, settlement, resolution, finalizer, migration, concurrency, and validation seams.
- `apothecary-definitions.json` — facility, case, clue, diagnosis, remedy, patient, region, outcome, history, metric, and hook definitions.
- `schoolhouse-definitions.json` — facility, seat, pupil, lesson, development, teaching, graduation, history, metric, and hook definitions.
- `tutorial-bindings.json` — contextual delivery using only IDs from the exact Phase 13 79-ID ledger.
- `cast-bindings.json` — bounded Phase 18–19 subset of the 38-actor schedule with exact predecessor hooks.
- `fixtures.json` — deterministic design, migration, claim, offline, concurrency, corruption, mobile, and reduced-motion cases.
- `validate.py` — JSON, reference, null-policy, cast, tutorial, story, facility, and fixture validation.

## Dependencies

- exact parent `7cda7b30ecc44ac12a2a1ffac92a60745e4e68dc`;
- Phase 14 facility envelope and exact Apothecary/Schoolhouse activity IDs;
- Phase 15 successor lineage, tutorial registry, bounded claim archive, and trusted finalizer registry;
- Phase 17 story discovery/opening mappings and Book I content IDs;
- released Family relationship state as read-only modifier input after a policy is approved.

## Runtime blockers

- opportunity cadence, bank capacity, unattended target, seat capacity, and seat unlock policy;
- every global reward, local progress amount, mastery curve, pupil development requirement, graduation requirement, and major reward;
- relationship-to-education formula and maximum benefit cap;
- case/pupil selection weights and any active-profit target;
- final visible copy and any new patient/pupil artwork;
- immutable finalizer registrations for both activities and Schoolhouse graduation;
- a Phase 15 V2 domain-ready offer seam for graduation, or an explicitly approved one-shot opportunity definition;
- successor validation/migration implementation through Phase 19.

Every unresolved value is null and the corresponding production path is disabled. Synthetic fixture values are explicitly QA-only and cannot be promoted by fallback.

## Do not break

- existing passive Building production, Oaths, Family assignment, Gold/offline behavior, and 24-hour cap;
- shared facility opportunities, non-expiry, stable ordinals, manual claims, and receipt archive;
- Restaurant state and classification;
- Campaign, Rank, deterministic roster joins, Book I ordering, and Village discovery;
- all 38 existing cast assignments and full-background character-sheet artwork;
- approved transparent-cutout, framed, or text-only Village dialogue policy.

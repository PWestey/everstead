# Phase 17 Book I and story-driven Village unlock contract

## Status

Design and data contract only. No production HTML, CSS, JavaScript, save data, feature flag, economy, artwork, merge, push, or deployed behavior is changed.

## Outcome

Phase 17 completes the remaining structure of **Book I — The First Covenant** and makes story progression the discovery/unlock authority for the Village game board without disabling the four existing passive Buildings.

The package defines:

- Chapters I–IV and the Rank-5 finale across all ten existing Broken Roads stages;
- Rank-2 through Rank-5 arrival ordering and limited optional interludes;
- all twelve visible Village location discovery/activity-unlock mappings;
- durable, derived-from-story Village visual-change states;
- First Covenant completion, Chronicle, log, replay, recap, and story-claim behavior;
- contextual bindings to the existing 79-ID tutorial ledger;
- intentional Book I coverage for all 18 Fellows and 20 Family actors;
- deterministic fresh/migrated/rank-jump/replay/offline/two-tab/mobile/reduced-motion fixtures.

## Files

- `PHASE_17_CONTRACT.md` — story experience, ordering, migration, Village unlocks, Chronicle, tutorials, cast, claims, accessibility, and acceptance gates.
- `DATA_SPEC.md` — versioned successor state, content identities, queue/replay rules, validation, and implementation seams.
- `book1-story.json` — Book/chapter/stage/scene/arrival/interlude/story-reward definitions.
- `facility-unlocks.json` — discovery and active-interaction unlock mappings for all twelve Village locations.
- `village-visual-changes.json` — durable visual state definitions and art-safe fallbacks.
- `book1-cast-distribution.json` — every current actor's intentional Book I story, tutorial, interlude, or facility role.
- `tutorial-bindings.json` — Phase 17 contextual bindings drawn only from the 79-ID Phase 13 ledger.
- `fixtures.json` — vertical-slice and migration acceptance inputs.
- `validate.py` — deterministic JSON, reference, coverage, null-economy, and fixture validator.

## Dependencies

- Phase 15–16 design commit `24399ab4f8d8f0b9c947a4d5ddf9175ed2d2e716`.
- Exact ten-stage Fellow Campaign and authoritative Rank/Fellow join rules in the released source.
- Phase 13 First Covenant predecessor scene IDs and 79-ID tutorial ledger.
- Phase 15 successor validation, tutorial registry, native story/Legacy claims, and bounded claim archive.
- Phase 16 Restaurant definitions and story-opening seam.
- Phase 14 facility IDs and actor hooks.

## Runtime blockers

- Final story milestone rewards remain null and production-disabled.
- Final visible dialogue copy and Wayfarer flavor responses require narrative approval/localization.
- Village change art/CSS treatments remain null or explicitly provisional.
- Facility opening scenes cannot unlock an activity before that facility phase is implemented and enabled.
- Prosperity/HQ thresholds are not used and remain undefined.
- Public character/art authorization remains unresolved.

## Do not break

- Existing passive Building visibility, production, upgrades, Oath boosts, and Family assignments.
- Total-roster Campaign Power, stage order, Gold costs, rewards, Rank thresholds, and deterministic Fellow joins.
- Waystone native Story/Legacy claim classification and Restaurant's facility claim classification.
- Bottom navigation, 24-hour offline cap, recovery/export/import, and non-expiring rewards/opportunities.
- Full-background character-sheet art and approved cutout/framed/text-only dialogue presentation.

# Phase 13 cast, story, and tutorial design package

## Status

Implementation-ready content and data contract only. This package changes no production HTML, CSS, JavaScript, save data, QA fixtures, or artwork.

## Objective

Define the First Covenant vertical slice and a gradual tutorial system that can grow from the current game through roadmap Phase 21. Every Fellow and Family member shipped at commit `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c` receives an intentional content assignment without crowding the opening scene.

## Files

- `PHASE_13_CONTENT_CONTRACT.md` — the early story slice, cast-use rules, delivery boundaries, dependencies, and acceptance gates.
- `DATA_SPEC.md` — stable identities, data shapes, state boundaries, localization rules, and validation requirements.
- `PHASE_MATRIX.md` — phase-by-phase tutorial delivery and cast participation from Phase 12 through Phase 21.
- `cast-plan.json` — exact shipped Fellow and Family inventory, art paths, Rank access, and planned quote/ambient/dialogue/tutorial use.
- `tutorial-matrix.json` — gradual first-use tutorials for current systems and every player-visible feature planned in Phases 12–21.

## Authority and dependencies

1. Locked Core Design v1.2 remains authoritative for mechanics.
2. The implementation roadmap remains authoritative for migration order.
3. Phase 12 must supply stable content registration, event/statistic seams, tutorial state, and exactly-once claim infrastructure before Phase 13 content is integrated.
4. The Phase 11G roster rules remain authoritative: six Rank-1 Fellows, then three at each Rank 2–5.
5. Phase 11H full portrait and transparent Village-cutout separation remains intact.

## Acceptance criteria

- All 18 shipped Fellows and all 20 shipped Family members appear exactly once in `cast-plan.json` under their current stable code IDs.
- Every cast entry points to an existing full portrait and thumbnail.
- Every cast entry has a localization-safe profile quote ID, ambient assignment, and authored dialogue assignment.
- The Phase 13 opening slice uses only the cast needed for that scene; later cast coverage is explicitly scheduled.
- Content definitions may land before all dialogue art, but no authored Village scene may render a rectangular full-background profile as a speaker overlay. It must use a neutral transparent cutout, an intentionally approved framed treatment, or remain text-only/deferred.
- Every current player-facing system and every roadmap Phase 12–21 player-facing addition has a tutorial entry or an explicit `notPlayerVisible` disposition.
- Tutorials are replayable, skippable, non-blocking, gradual, and safe for migrated saves.
- No tutorial, story, or dialogue ID depends on visible copy, an array position, or a third-party franchise name.

## Do not break

- Save namespace, schema-12 lineage, checkpoints, offline Gold, and transaction behavior.
- Total-owned-roster Power for Campaign and Tower progression.
- Rank-based Fellow access and deterministic Campaign target rotation.
- Original full-background character sheets and lazy-loaded art.
- Existing bottom navigation; Chronicle stays under More.
- Passive Village earnings; tutorials and story may explain systems but may not silently change their mechanics.
- Reduced-motion, keyboard, focus, and mobile-width behavior.

## Explicit non-goals

- Production code or save migration implementation.
- Final resource amounts, Legacy thresholds, or active-facility profit ratios.
- Branching story rewards or economy-affecting dialogue choices.
- Dialogue written in the recognizable voice of any external franchise character.
- Public distribution clearance for names or art.

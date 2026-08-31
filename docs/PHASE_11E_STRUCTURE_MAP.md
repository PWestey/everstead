# Phase 11E implementation structure map

The deployable artifact remains a self-contained `index.html`. Most of its 19 MB size is the five embedded image assets, not JavaScript. The maintainability risk is the historical sequence of compatibility and phase-specific function replacements.

## Active source regions

| Region | Current ownership | Phase 11E rule |
| --- | --- | --- |
| Static shell and embedded assets | document head/CSS | Byte-freeze all embedded assets |
| Definitions and tunable configuration | early script constants | No new mechanics or balancing |
| Calculations and reward engines | Phase 1–10 function bodies | Preserve exact equations and receipts |
| Persistence and migrations | schema 1–11 compatibility layers | Do not flatten without a dedicated equivalence phase |
| Rendering and interaction | base renderers plus Phase 9–11 presentation layers | Edit the active owner directly; add no new replacement chain |
| QA bridge | captured fail-closed runtime facade | Local isolated adapters only; public host remains disabled |

## Highest-risk remaining chains

- `bootstrapPersistence` and `validation` carry historical recovery/migration semantics. Consolidating them is not a formatting task; it needs frozen save-slot matrices and interruption equivalence.
- `bindCommon`, `campaignView`, and `moreScreen` carry active presentation layers. Future work should first snapshot their exact output/behavior, then fold one owner at a time.
- Phase 11E folds the two Phase 11C navigation wrappers into the active navigation functions and forbids adding another wrapper alias.

## Next structural gate

A dedicated consolidation phase should extract canonical source sections and generate the same single-file artifact. Its acceptance gate must prove byte-identical embedded assets, semantic-equivalent renders, identical storage traces for every migration/recovery vector, and no reward or calculator drift. Feature expansion should not share that phase.

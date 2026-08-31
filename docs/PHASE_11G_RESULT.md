# Phase 11G result

## Implemented

- Replaced the 18/18 immediate Fellow start with a visible deterministic Rank path: 6 at Rank 1, then 3 each at Ranks 2–5.
- Preserved previously used additions through an explicit grandfather list.
- Added one-time EXP catch-up to the weakest established starter Level, with no other resource grants.
- Replaced the six-ID Campaign reward bottleneck for future runs with fixed three-Fellow pools and deterministic per-stage rotation.
- Rebased Campaign eligibility, efficiency discounts, receipts, and visible cost/Power summaries onto joined Fellows only. Future-rank portraits no longer front-load Campaign or Village Power.
- Added a pre-spend training-target preview, Rank-join results, locked roster/Codex states, Player profile unlock rows, migration explanation, and Family onboarding guidance.
- Added a visible “Swipe for details” cue to Fellow and Family full-art profiles.
- Moved new Fellow Expedition access to Rank 5 while preserving existing Expedition use.
- Updated release identity to `1.0.0-rc.2` and documentation to schema 12 / Phase 11G.

## Save treatment

Phase 11G is a schema-12 product-profile activation, not a schema bump. The activation is committed through the ordinary staged save coordinator and records its exact pre-activation identity, Campaign baseline, catch-up inputs/outputs, and grandfather decisions.

Future Campaign reward redirection is validated by projecting the current state back to the released Phase 11F target distribution. Post-activation Fellow ascensions are refunded in that projection before Phase 11F algebra runs, so actual targeted shards can be spent without weakening validation.

## Known boundaries

- Prosperity remains inert pending approved HQ thresholds.
- Fellow Expedition's underlying schema-8 ownership ledger remains compatibility-authoritative; new access waits until Rank 5 so the available roster and historical 18-Fellow ledger agree.
- Phase 11G adds a bounded successor layer; it does not perform the broader wrapper/module consolidation.
- Artwork licensing or public-distribution authorization cannot be established by automated QA and must be confirmed by the repository owner.

## Verification

- Phase 11G focused engine probe: 28/28, including joined-only featured rotation.
- Phase 11G successor gate: 23/23 after sealing the manifest; the pre-seal 21-row gate also passed twice.
- Fresh Campaign preview and receipt use the six joined Fellows; the first live stage showed 36.4K combat Power, a 16% efficiency discount, and an 8.4K cost instead of the former 109K / 35% / 6.5K values.
- A fresh 50K-Gold save can clear exactly four Campaign stages consecutively; stage 5 then stops on Gold, so the ten-stage chapter cannot be completed immediately.
- A live two-stage run reached Rank 2 and joined Zamorak, Darrow, and Deadpool in the result and roster path.
- In-app Chromium passed at 320×568 and 390×844 with zero horizontal overflow and zero warning/error console entries.
- The frozen Phase 11F verifier now reports only its expected successor mismatches: release identity, 18/18 roster language, the new final same-schema receipt, and recovery continuing through Phase 11G activation. Its underlying schema-12 migration and recovery behaviors remain accepted by the Phase 11G gate.

# EVERSTEAD — PHASE 8 EXECUTION

## Scope executed

Phase 8 evolves the sealed Phase 7 single-file product from schema 8 to schema 9 without rebuilding the shell. It adds six core Relics, one Relic Stone material, free one-slot Fellow equipment, ten Relic levels, deterministic Fellow Campaign acquisition/salvage, a paired Phase 8 side receipt, active Fellow Power propagation, and eleven-slot persistence with an exact write-once pre-v9 checkpoint.

## Production checkpoints

- `24edde0abac465df3dadafbf04f9d1091b7cfc6c` — schema 9, pre-v9 persistence, Phase 8 Campaign epoch and side receipt, Relic inventory/equipment/upgrades, Power integration, UI, diagnostics, and isolated bridge actions.
- `0f74e923b67c455341cf47985c4c51afa65cb72e` — QA bridge correction, immutable delayed Campaign presentation snapshots, strict schema-8 lineage/source/staging authentication, deterministic missing-active recovery, monotonic migration time, fail-closed pre-v9 rereads, and native-only storage-event handling. This cherry-pick is byte-equivalent to independently reviewed production commit `83d662725f2ce4db2ccbcec67e431af517254fc6`.

## Verification order

1. Run `qa/phase-8/verify.mjs` twice.
2. Run `qa/phase-8/regress-phase-7.mjs` twice.
3. Verify `qa/phase-8/checksums.sha256` twice.
4. Serve the repository locally and run `qa/phase-8/` twice in the connected Chromium browser.
5. Require both 320×568 and 390×844, normal and reduced motion, a blank fatal field, zero failed rows, zero warning/error console entries, and no unauthorized native-storage action.

## Independent review evidence

Before package seal, an independent exact gameplay/receipt review passed `19/19`, and an independent persistence/recovery review passed `46/46`. These are recorded as external reviewer evidence and are not counted as executable package rows.

## Compatibility boundary

Released schema 0–8 saves are supported. Final schema-9 compatibility begins with this package. Provisional schema-9 files created only inside isolated, unmerged Phase 8 worktrees were never merged, pushed, published, or promoted as user data and are intentionally not a released compatibility surface. The exact released schema-8 predecessor remains protected in pre-v9, while old Campaign counts become an immutable epoch baseline; migration grants no retroactive Relics, Stones, equipment, or levels.

## Live evidence

Initial live package `3fcfa3c914b721295a22a86b4291cda3bc10c44d` completed two full Chromium passes: `520/520` at outer 320×568 and `520/520` at outer 390×844. After the QA-only persistence-evidence expansion and EOF hygiene repair, final tested package `13bcf9e1e386ae0bd9f8ce6a9394ffa2c9dfd882` repeated both passes with the same `520/520` result at each outer viewport. Every pass internally exercised both required phone realms and normal/reduced motion, with a blank fatal field and zero captured warning/error console entries. The subsequent final seal changes only this evidence metadata and its derived hashes.

## Do not perform here

Do not merge, push, publish, add another adventure mode, add Relic RNG/affixes/sets/reforging, rebalance Phase 10 tunables, activate retired Story/Tower/Trading/Patrol/Operations, or add deferred automation, audio, events, advanced animation, or Post-V1 systems from this worktree.

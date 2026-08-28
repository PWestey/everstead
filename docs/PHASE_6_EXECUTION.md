# EVERSTEAD — PHASE 6 EXECUTION

## Scope executed

Phase 6 evolves the sealed Phase 5 single-file product from schema 6 to schema 7 without rebuilding the shell. It adds Companion Campaign, Companion Tower, global Companion Mastery, the Tower idle EXP/Mastery/random-shard lane, explicit Adventure routing, and nine-slot persistence with an exact write-once pre-v7 checkpoint.

## Production checkpoints

- `8396aa2` — schema-7 state, validation, pre-v7 checkpoint, migration, export, and diagnostics foundation.
- `ef7c245` — Mastery, Companion Campaign, Companion Tower clear/idle engines, deterministic receipts, and progression ledgers.
- `4e91ab3` — feature integration, UI routes, migration/recovery wiring, and isolated QA actions.
- `d38d5aa` — exact checkpoint/source authentication, shared encounter coordination, single-tick Tower claims, and canonical claim/clear histories.
- `035f536` — missing-active staged migration anchoring.
- `dbdb476` — authenticated historical schema-6 transactions and complete Tower rate/reward/history feedback.
- `1dc8297361ee81b836078c0c5f2bef13bb669d09` — preflight-first historical schema-6 fresh/current/safe-reset recovery, exact Phase 5 property order, and reserved-collision refusal.
- `348630f76995f7d54916202f4d7db91e52b7b2ed` — exact effective-state authentication for occupied pre-v7 bytes before historical completion or cleanup.
- `e3af2733cc60ced7e4799fc4a122f74b4dc780c7` — effective staged schema-6 lineage authentication plus preflight-only handling of pending schema-5 migration staging.
- `689d43a4f0b0d22507e66b158f4a1f23a8672fee` — explicit “Floor N cleared” history and aggregate-plus-recipient Tower idle EXP feedback.

## Verification order

1. Run `qa/phase-6/verify.mjs` twice.
2. Run `qa/phase-6/regress-phase-5.mjs` twice.
3. Verify `qa/phase-6/checksums.sha256` twice.
4. Serve the repository locally and run `qa/phase-6/` twice in live Chromium at both configured mobile sizes.
5. Require a blank fatal field, zero failed rows, zero warning/error console entries, and zero native-storage calls.

## Recovery interpretation

An exact deterministic schema-6 checkpoint is recoverable when its predecessor can be reconstructed. An evolved pre-v7 checkpoint is recoverable only while its exact active predecessor or authenticated staged schema-7 successor remains available. A lone evolved pre-v7 checkpoint with both absent is deliberately retained and rejected with zero writes because it cannot authenticate itself.

Historical Phase 5 fresh, migration, ordinary-current, and safe-reset staging is completed or cleaned before Phase 6 migration. Protected-slot lineage, reserved-name collisions, and a second exact slot read are checked before any historical active write or staging cleanup.

## Do not perform here

Do not merge, push, publish, rebalance Phase 10 tunables, activate retired Story/Tower/Trading/Patrol/Operations, or add Golemore, Relics, automation, audio, or Post-V1 systems from this implementation worktree.

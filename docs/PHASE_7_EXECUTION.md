# EVERSTEAD — PHASE 7 EXECUTION

## Scope executed

Phase 7 evolves the sealed Phase 6 single-file product from schema 7 to schema 8 without rebuilding the shell. It adds Fellow Expedition, the persistent non-spendable Might multiplier, claim-time random Fellow shards with pity, Fellow Campaign v2 source accounting, four active Adventure routes, and ten-slot persistence with an exact write-once pre-v8 checkpoint.

## Production checkpoints

- `4450ab6f8b5a7c85b721fdcc7d2a0ce570b64acf` — schema 8, pre-v8 persistence foundation, Fellow Campaign v2 ledger, Fellow Expedition/Might engines, and initial UI integration.
- `c8638a52b30261aab6de36c255a6d92996f2b58c` — pre-v8 cross-tab storage-event coverage.
- `9b4ac312fa94c2e910a18d32b859ace90abf3b80` — bounded best chronology, complete idle provenance, replay ceilings, nominal-versus-actual Might copy, historical schema 2–7 transaction recovery, preflight-first safe reset, and authenticated historical safe-reset archival roots.
- `99b24720fc4c5dbc19e23443996ffc849d89810f` — released schema-7 safe-reset and direct-migration recovery, fail-closed protected-slot read faults, normal-current safe reset, and exact replay-capacity UI controls.
- `8ca8353534bd4ae312e9470155988d209b0b6fed` — exact released Phase 6 fresh-to-boot schema-7 recovery and unabridged Campaign/Expedition replay-capacity copy.

## Verification order

1. Run `qa/phase-7/verify.mjs` twice.
2. Run `qa/phase-7/regress-phase-6.mjs` twice.
3. Verify `qa/phase-7/checksums.sha256` twice.
4. Serve the repository locally and run `qa/phase-7/` twice in live Chromium at both configured mobile sizes.
5. Require a blank fatal field, zero failed rows, zero warning/error console entries, and zero native-storage calls.

## Compatibility boundary

The released compatibility surface is schema 0–7 through sealed Phase 6. Final schema-8 compatibility begins with this package. Earlier schema-8 artifacts existed only in this isolated worktree, were never merged, pushed, or published, and are intentionally unsupported rather than silently normalized without a schema bump. The gate records the exact released Phase 6 base and uses only isolated memory storage. Its pre-seal evidence also records that local `main`, `origin/main`, and the public Pages artifact were all the exact Phase 6 release: the public artifact was schema 7, 18,627,378 bytes, SHA-256 `63182db2f73d9d5e7d723c4e6ce1fea520d7803c6314ff1307180ad9b1d3635f`, with no Phase 7 marker.

Historical schema 2–7 pending and committed fresh, migration, ordinary-current, and safe-reset transactions finish or clean only after full ten-slot preflight. For an older safe reset, marker-attested checkpoint bytes remain immutable archival material while forward migration fills only later empty checkpoints and binds the resulting bounded root chain into schema-7/schema-8 receipts.

## Do not perform here

Do not merge, push, publish, rebalance Phase 10 tunables, activate retired Story/Tower/Trading/Patrol/Operations, add Relics, or add deferred automation, audio, events, advanced animation, or Post-V1 systems from this implementation worktree.

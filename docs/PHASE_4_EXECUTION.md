# Everstead Phase 4 Execution

## Scope

Phase 4 migrates the two preserved legacy Companion bindings into canonical schema-5 Companion progression and one-to-one Fellow assignment. It preserves all Phase 0–3 mechanics and persistence guarantees, adds the exact write-once schema-4 checkpoint, and activates only the reserved Companion step in the existing Fellow Power pipeline.

## Production implementation

- Current schema is 5; the seven protected slots are active, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, and staging.
- The schema-4-to-5 migration initializes exact Companion state in definition order, migrates valid bindings, deterministically clears later duplicate assignments, and records collision details on one migration receipt.
- Interrupted schema-5 migration and backup recovery use exact schema/source/receipt/target lineage. Pending and already-committed Phase 3 `companion-binding` stages remain narrowly recoverable.
- Companion EXP, derived Level, rarity, targeted shards, round-once Power, total roster Power, ascension, and assignment are live.
- The Fellow selector transfers 40% of the assigned Companion's unrounded Power at the existing Companion position, then continues through Family/global multipliers and rounds once at the endpoint.
- Assignment is free, nullable, one-to-one, previewed before commit, and has no Building production effect.
- Companion Campaign, Tower, Mastery progression, idle EXP, and idle shards remain deferred.

## Verification commands

Run from the repository root with the bundled Node runtime available as `node`:

```text
node qa/phase-4/verify.mjs
node qa/phase-4/regress-phase-3.mjs
sha256sum -c qa/phase-4/checksums.sha256
```

Serve the repository root over HTTP, open `qa/phase-4/`, and confirm the live runner has a blank fatal field and zero failed rows. The runner covers 320×568 and 390×844 fresh, schema-4, legacy, collision, and all-disabled realms, plus unattested-destructive and encoded-query negatives.

## Failure-safety coverage

The CLI verifier covers exact schema0–4 committed-stage retries; missing-active recovery from every protected predecessor; all schema-4 checkpoint/stage/active/verification/cleanup fault steps; seven-slot fixture rollback; foreign checkpoints/stages; current-backup retries; cross-tab and occupied-stage refusal; and Phase 3 pending/committed assignment staging. Retry comparisons include exact slots, revision, receipts, rewards, and assignments.

## Preserved residual risks

- Web Storage has no atomic compare-and-swap. Final rereads, raw identity, revisions, source binding, and staging ownership narrow and expose the race but cannot eliminate it.
- The previously documented interrupted safe-reset active-verification stage remains fail-closed and retained.
- Real-device and Safari behavior require post-merge device verification; the automated live gate uses Chromium.

# Everstead Phase 5 Execution

## Scope

Phase 5 replaces the active legacy Story loop with the first canonical Fellow Campaign. It adds the central Wayfarer Player and Rank foundation, ten Broken Roads stages, walking-stage presentation, targeted Fellow rewards, and schema-6 persistence while preserving every accepted Phase 0–4 system.

## Production implementation

- Current schema is 6; the eight protected slots are active, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, and staging.
- The pre-v6 slot is a write-once exact schema-5 checkpoint. For schema0–4 sources it is the deterministic canonical schema-5 intermediate; for schema5 it is the exact active raw. Interrupted migrations authenticate and reuse the same checkpoint bytes instead of regenerating time-sensitive receipts.
- The central Player starts with the static/CSS `wayfarer` avatar hook, Rank EXP, and derived Rank. Rank is capped at 5 for the foundation while cumulative safe-integer Rank EXP is retained in full. Rank 2 safely unlocks stage replay; first-clear progression is never Rank-gated.
- Fellow Campaign contains ten seeded Broken Roads stages. Eligibility and the efficiency discount use total owned Fellow roster Power. Each successful run atomically spends the effective Gold cost, grants target-Fellow EXP, first-clear or deterministic replay shards, a deterministic Gift chance, and first-clear Rank EXP.
- Receipts bind save, stage, pre-run ordinal, first-clear status, configured costs, roster snapshot, reward values, deterministic rolls, version, and salt. Validation reconstructs the expected result exactly and refuses altered or inconsistent ledgers.
- Schema5 Story position migrates conservatively: only stages strictly before the mapped ordinal are cleared and first-clear-consumed; the mapped stage remains eligible, including ambiguous legacy stage 10. Migration grants no retroactive Rank EXP, Fellow EXP, shards, Gifts, or Gold.
- The active Story, Tower, Trading, Patrol, and Operations surfaces and reward leaves are retired and fail closed even if a runtime override explicitly requests them. Compatibility data and recovery scaffolding remain intact.
- The live campaign screen includes the Wayfarer hook, changing/scrolling stage backgrounds, walking/bobbing motion, encounter interruption, stage nodes, reward preview, first-clear/replay labels, and deterministic refusal messaging.

## Verification commands

Run from the repository root with the bundled Node runtime available as `node`:

```text
node qa/phase-5/verify.mjs
node qa/phase-5/regress-phase-4.mjs
sha256sum -c qa/phase-5/checksums.sha256
```

Serve the repository root over HTTP, open `qa/phase-5/`, and confirm the live runner has a blank fatal field and zero failed rows. The runner covers 320×568 and 390×844 fresh, schema-5, legacy, all-retired-overridden, unattested-destructive, and encoded-query-negative realms.

## Failure-safety coverage

The CLI verifier covers exact schema0–5 migration and retry paths, pre-v6 checkpoint reuse, all eight fixture pre-read and write/remove rollback boundaries, occupied or foreign persistence material, malformed current saves, receipt tampering, insufficient Gold, underpowered and locked runs, safe-integer overflow, reload idempotence, and legacy feature override attempts. Every refused or faulted path asserts exact storage, runtime, revision, identity, UI, clock/random/log, toast, modal, and blocked/stale/write-flag preservation where applicable.

## Observed final gate

- Phase 5 CLI: `535/535`, twice.
- Phase 4 semantic successor: `410/410`, twice, with exactly seven expected supersessions.
- Checksums: `14/14`, twice; all 118 historical artifacts remained byte-frozen.
- Live Chromium: `298/298`, twice, across 320×568 and 390×844 with blank fatal output, no failed rows, zero native-storage calls, and zero warning/error console entries.

## Preserved residual risks

- Web Storage has no atomic compare-and-swap. Final rereads, raw identity, revisions, lineage, and staging ownership narrow and expose the race but cannot eliminate it.
- The previously documented interrupted safe-reset active-verification stage remains fail-closed and retained.
- Campaign economy values, reward chances, and Rank thresholds are provisional Phase 10 balancing tunables.
- The Wayfarer is a static/CSS art hook; advanced animation, audio, story presentation, and deferred modes remain outside Phase 5.
- Real-device and Safari behavior require post-merge device verification; the automated live gate uses Chromium.

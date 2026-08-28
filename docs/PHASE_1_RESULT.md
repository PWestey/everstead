# Everstead Phase 1 result

## Status

Phase 1 — Brand + Economy Normalization is implemented on `migration/phase-1-brand-economy`, based on exact published main `e2dfc24f513499e176ab5c2be3894c8e324c31ac`.

The production artifact remains the self-contained single-file `index.html`; the active compatibility storage key and embedded asset lines are unchanged.

## Migration and economy result

- Active schema is 2. Legacy schema 0 migrates through 0→1→2; current schema 1 migrates through 1→2; schema 2 reload is idempotent.
- The original `oathforge_new_world_proto_v01__raw_backup_v0_1` remains write-once. Before operator fields are removed, the exact valid schema-1 bytes are written and read-back verified at `oathforge_new_world_proto_v01__raw_backup_v1`. A mismatch or write/readback fault blocks replacement of the active payload.
- Interrupted legacy migration is retry-safe across clock changes. Reuse requires canonical 0→1 receipt metadata plus an exact full-payload correspondence check against normalization of the protected active legacy bytes at the recorded creation time. For both schema-0 and schema-1 active data, a retained staging envelope is promoted only when its exact active-raw provenance and complete deterministic 1→2 projection match the protected intermediate. Malformed, foreign-provenance, or structurally valid but unrelated staging remains untouched and blocks writes.
- Schema 2 retains unknown state, Unicode, metadata, receipts, roster/progress fields, and pending action-scoped Oath Undo while removing only active `buildings.*.operators`.
- Building production is now base × 1.15-per-level upgrade multiplier × explicit neutral Family/Fellow-roster/Companion-roster/overall-day hooks × final daily Oath multiplier. The bases remain 7200/6500/5600/6100 Gold/hour; upgrades remain `round(15000 × 1.7^(level-1))`.
- Easy/Medium/Hard Oaths remain +3/+5/+8 percent with a +30 percent targeted cap, preserve the existing +3 Focus Fellow Bond reward, and grant +2/+4/+7 non-spendable, finite, nonnegative Prosperity.
- Offline Gold is segmented at local midnight, capped at 24 hours, uses a captured clock inside the transaction coordinator, preserves timestamp zero, initializes missing/invalid migrated timestamps safely, retains fractional pending Gold, and cannot be double-claimed. Clock rollback grants no Gold and cannot move `lastGoldAt`, `lastSeen`, metadata time, or the saved calendar day backward; it also cannot replenish Patrol, clear active Oath boosts, or reset habits. The next genuine forward local-day transition applies those rollover effects exactly once.

## Product and QA result

- Visible app-controlled product branding is Everstead. Compatibility keys and historical migration identifiers retain their original internal names.
- The ordinary More screen and production dispatcher no longer contain Simulate 2H, +1 Patrol, or prototype reset controls/routes. Safe reset remains available only in genuine recovery UI. Authorized isolated loopback QA bridge actions remain available.
- Building UI exposes a rate breakdown and states that Family assignment unlocks in Phase 3 with no active bonus today.
- Additive Phase 1 proof lives under `qa/phase-1/`; every pre-existing file under `docs/` and `qa/` is frozen from base `e2dfc24`.

## Verification evidence

- Phase 1 deterministic verifier: **256/256 passed**, twice with the same total.
- Phase 1 checksum sweep: **78/78 files passed**, twice.
- Frozen Gate 0C successor regression: **246/258 passed**, with zero unexpected failures. The twelve expected superseded assertions are `artifact-sha256`, `artifact-byte-length`, `branding-preserved`, `oath-formulas-preserved`, `offline-formulas-preserved`, `upgrade-formula-preserved`, `grandfathered-visible-qa-controls-preserved`, `diagnostics-schema-source`, `diagnostics-rate-components`, `offline-preview-zero-timestamp`, `offline-preview-cross-midnight-legacy-unsegmented`, and `bridge-safe-recovery-current`.
- Live in-app Chromium: **243/243 passed twice**. Each run exercised genuine fresh, schema-1, legacy, all-disabled, and encoded-query-negative isolated realms at 320×568 and 390×844, with zero fatal output and zero warning/error console entries.
- Final `index.html`: 18,355,746 bytes, SHA-256 `234273148d1dd40d38dc3ced87992ae719d923d4ce02e4e953cb7c64905ecee9`.
- Frozen embedded-asset aggregate: SHA-256 `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78`.

## Residual risk

Web Storage still has no atomic compare-and-swap. Exact rereads, save identity/revision checks, transaction-owned staging, same-tab exclusion, and storage-event stale marking narrow the race but cannot eliminate the final reread-to-write window.

Local-midnight segmentation follows the host browser’s local calendar and therefore intentionally reflects daylight-saving day lengths where the host timezone observes them.

If a corrupt active payload exactly matches its write-once raw backup while a separate valid schema-1 backup also exists, Everstead preserves all payloads and offers Reload, Export, and Safe Reset rather than automatically trusting the schema-1 backup. The corrupt bytes cannot prove that backup’s lineage, so automatic recovery would risk adopting an unrelated save.

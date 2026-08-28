# Everstead Gate 0B QA contract

This directory is the additive Phase 0B contract. The historical Phase 0A files in `qa/` and `docs/PHASE_0A_RESULT.md` remain immutable and their expected hashes are recorded in `current-manifest.json`.

## Run

From the repository root, use the bundled or system Node.js runtime:

```sh
node qa/gate-0b/build-contract.mjs
node qa/gate-0b/verify.mjs
shasum -a 256 -c qa/gate-0b/checksums.sha256
```

For live Chromium, serve the repository over HTTP and open `qa/gate-0b/`. The disposable iframe receives the production script through a callback replacement, uses memory-only storage, and publishes the completed result at `window.__EVERSTEAD_GATE_0B_RESULT__`. Offline scenarios poll for the production modal condition with a one-second bound so the intentional 250 ms delay is observed without a blind long wait or timer leakage into later cases.

## Frozen persistence contract

- Active key: `oathforge_new_world_proto_v01`
- Write-once raw backup: `oathforge_new_world_proto_v01__raw_backup_v0_1`
- Verified staging: `oathforge_new_world_proto_v01__staging`
- Current schema: integer `1`, separate from visible state version `0.1.0`
- Migration receipt: `legacy-v0.1-to-1`
- Metadata: `saveId`, `createdAt`, `updatedAt`, positive `revision`, `source`, and ordered `appliedMigrations`
- Outcomes: `NORMAL`, `RECOVERY`, and `REJECT_PRESERVE`

The synchronous transaction sequence is backup/write-once verification, migration or current-state validation, staged write and readback, active pre-commit reread, active write and readback, then transaction-owned staging cleanup. Staging provenance includes transaction ID, base save ID and revision, source raw identity, and source.

The test seam is local to persistence. It records ordered operations and can throw before or after reads, writes, and removals, inject a mismatched readback, or place a foreign staging envelope immediately before cleanup. It does not add a general Phase 0C adapter or feature-flag layer.

Current-schema validation rejects dangling persisted references rather than silently normalizing them. The raw fixture matrix covers featured/focus Fellows, Building operators, Companion bindings, the required five-member Trading team, Operation participants, and all Oath undo targets and values that the inverse can write. The Oath undo record also carries expected post-completion values: unrelated Gold can advance, but a later mutation to any touched field causes a write-free refusal. Deleting the target Oath clears its pending undo. Legacy normalization remains unchanged.

Legacy/corrupt/invalid active bytes may be replaced only when the fixed write-once backup contains those exact bytes. A mismatched pre-existing backup is preserved and the operation resolves to `REJECT_PRESERVE`. Both normal and recovery staging cleanup reread the exact envelope before removal; a foreign envelope is retained, logged, and stops later writes from this stale tab.

## Concurrency boundary

The same-tab write guard, exact active raw reread, save ID/revision/raw-identity comparison, and storage-event stale marker prevent known stale writers from silently winning. Browser `localStorage` has no atomic compare-and-swap primitive, so another tab can still write in the narrow interval between the final reread and `setItem`. Staging and revision metadata make that race recoverable or detectable on a later load; this gate does not claim perfect cross-tab CAS.

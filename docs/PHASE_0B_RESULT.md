# Everstead Phase 0B Result

## Gate status

Phase 0B — Transactional Save Foundation is complete on `migration/0b-transactional-save`, based on integrated Gate 0A commit `a538585`.

The production artifact remains the single-file `index.html`. The active storage key, visible version, embedded asset lines, branding, routes, layout, formulas, rewards, and 24-hour offline cap remain unchanged.

## Delivered persistence contract

- `CURRENT_SCHEMA_VERSION = 1`, independent from state version `0.1.0`.
- Metadata contains `saveId`, `createdAt`, `updatedAt`, positive `revision`, `source`, and ordered `appliedMigrations`.
- Legacy migration receipt is `legacy-v0.1-to-1` and is applied once.
- The exact first recoverable raw payload is preserved write-once at `oathforge_new_world_proto_v01__raw_backup_v0_1`. Legacy/corrupt/invalid active bytes are never replaced when a pre-existing backup contains different bytes.
- Transactions use verified provenance-bearing staging at `oathforge_new_world_proto_v01__staging`, then an exact active reread, active write/readback validation, and transaction-owned staging cleanup. Cleanup rechecks the exact envelope and retains a later foreign transaction while marking the tab stale.
- Fresh, legacy, current, future, corrupt, and invalid inputs resolve deterministically to `NORMAL`, `RECOVERY`, or `REJECT_PRESERVE`.
- Future, corrupt, and invalid active payloads are preserved and normal gameplay rendering stops until explicit recovery, reload, or safe reset.
- Every gameplay mutation uses the synchronous clone → mutate → validate → transactionally write → adopt/render coordinator. Failed writes do not adopt the draft or show success UI.
- Current-save conflicts compare save ID, revision, and loaded raw identity. A same-tab guard and storage-event stale marker supplement the pre-commit reread.
- The persisted whole-state Oath snapshot is migrated to a versioned, action-scoped inverse with expected post-completion values. Undo restores only touched Oath reward fields, permits unrelated Gold changes, and refuses without a write if any touched field diverged.
- Deleting the Oath targeted by a pending undo expires that undo in the same committed mutation.
- Current-schema roster, Building, Trading, Operation, and scoped-undo references must resolve before a payload can enter normal rendering. Invalid current payloads are preserved for recovery rather than silently normalized.
- Accepted undo inverses are validated against the state they can produce, including Oath `doneKey` and retained Resolve values.
- Unknown gameplay fields survive normalization and later current-schema writes.

## Executable QA result

The additive contract is under `qa/gate-0b/`; all historical Gate 0A fixtures, scenarios, runner, verifier, manifest, checksums, README, and result document remain byte-identical to commit `a538585` and are checked by frozen SHA-256 values.

Two consecutive final command-line runs completed with:

- `600/600 Gate 0B checks passed` on each run.
- Every entry in `qa/gate-0b/checksums.sha256` passed on each run.
- Production artifact SHA-256: `1613f9c91daa5ad91b312c5dfa376b6cabb315d7ba9dc03bba807455b6555b92`.
- Production artifact byte length: `18323270`.

The matrix covers fresh/current/legacy/twice-migrated/future/corrupt/invalid roots; exact raw backup and matching/mismatched backup precedence, including rejected legacy migration and corrupt/invalid reset when exact bytes are not protected; valid successor, stale, conflicting, invalid, interrupted, and foreign staging; complete legacy roundtrip and Unicode; unknown fields; safe reset and explicit recovery; offline 2h/24h/30h boundaries; the actual dispatcher-based scoped Undo path; unrelated-versus-same-field undo divergence; deletion of an undo-target Oath through the real action; malformed undo target values; every persisted roster/building/trade/operation/undo reference class; gameplay navigation/roster/upgrade behavior; pre-commit raw conflict; mutation failure UI suppression; and throw-before, throw-after, readback-mismatch, and foreign-envelope injection across transactional steps.

## Browser result and residual risk

The live browser runner uses callback-based production-script injection, memory-only storage, a mobile-width iframe, and publishes separately as `window.__EVERSTEAD_GATE_0B_RESULT__`.

An independent live Chromium run of the original contract reported `296/297`; the only failure was `offline-2h-summary`, caused by the harness checking after 30 ms while production intentionally opens the modal after 250 ms. The harness now condition-polls for the rendered offline list with a one-second bound and waits for all offline timers to settle.

Live Chromium execution of the corrected and expanded browser contract was attempted through this task's in-app browser, but localhost was refused because its admin-enforced security policy could not be verified. No browser-security bypass or standalone replacement was used. A live rerun, including the actual rendered modal Undo, Patrol-divergence, and Oath-deletion paths, remains an explicit handoff check; it is not claimed here.

Browser `localStorage` does not expose atomic compare-and-swap. The exact pre-commit reread, identity checks, staging provenance, revisions, same-tab guard, and storage-event marker narrow and expose conflicts, but another tab can still write in the small interval between reread and active `setItem`. Phase 0B does not claim perfect cross-tab CAS.

Cross-midnight accrual behavior and the existing 24-hour cap are intentionally unchanged for their later roadmap gates.

# Everstead Phase 0B Result

## Gate status

Phase 0B — Transactional Save Foundation is complete on `migration/0b-transactional-save`, based on integrated Gate 0A commit `a538585`.

The production artifact remains the single-file `index.html`. The active storage key, visible version, embedded asset lines, branding, routes, layout, formulas, rewards, and 24-hour offline cap remain unchanged.

## Delivered persistence contract

- `CURRENT_SCHEMA_VERSION = 1`, independent from state version `0.1.0`.
- Metadata contains `saveId`, `createdAt`, `updatedAt`, positive `revision`, `source`, and ordered `appliedMigrations`.
- Legacy migration receipt is `legacy-v0.1-to-1` and is applied once.
- The exact first recoverable raw payload is preserved write-once at `oathforge_new_world_proto_v01__raw_backup_v0_1`.
- Transactions use verified provenance-bearing staging at `oathforge_new_world_proto_v01__staging`, then an exact active reread, active write/readback validation, and transaction-owned staging cleanup.
- Fresh, legacy, current, future, corrupt, and invalid inputs resolve deterministically to `NORMAL`, `RECOVERY`, or `REJECT_PRESERVE`.
- Future, corrupt, and invalid active payloads are preserved and normal gameplay rendering stops until explicit recovery, reload, or safe reset.
- Every gameplay mutation uses the synchronous clone → mutate → validate → transactionally write → adopt/render coordinator. Failed writes do not adopt the draft or show success UI.
- Current-save conflicts compare save ID, revision, and loaded raw identity. A same-tab guard and storage-event stale marker supplement the pre-commit reread.
- The persisted whole-state Oath snapshot is migrated to a versioned, action-scoped inverse. Undo restores only Oath rewards and does not revert unrelated Gold, timestamps, or revisions.
- Unknown gameplay fields survive normalization and later current-schema writes.

## Executable QA result

The additive contract is under `qa/gate-0b/`; all historical Gate 0A fixtures, scenarios, runner, verifier, manifest, checksums, README, and result document remain byte-identical to commit `a538585` and are checked by frozen SHA-256 values.

Two consecutive final command-line runs completed with:

- `402/402 Gate 0B checks passed` on each run.
- Every entry in `qa/gate-0b/checksums.sha256` passed on each run.
- Production artifact SHA-256: `be525eb6e8aa44c3a29bcb1b7f3f6dfcb6237e25a154c5dc169d3afcdb6f2570`.
- Production artifact byte length: `18318745`.

The matrix covers fresh/current/legacy/twice-migrated/future/corrupt/invalid roots; exact raw backup and matching/mismatched backup precedence; valid successor, stale, conflicting, invalid, and interrupted staging; complete legacy roundtrip and Unicode; unknown fields; safe reset and explicit recovery; offline 2h/24h/30h boundaries; scoped undo; gameplay navigation/roster/upgrade behavior; pre-commit raw conflict; mutation failure UI suppression; and throw-before, throw-after, and readback-mismatch injection across every transactional step.

## Browser result and residual risk

The live browser runner uses callback-based production-script injection, memory-only storage, a mobile-width iframe, and publishes separately as `window.__EVERSTEAD_GATE_0B_RESULT__`.

Live Chromium execution was attempted through the in-app browser but could not open the localhost QA page because its admin-enforced security policy could not be verified. No browser-security bypass or standalone replacement was used. Live mobile-width layout and interaction therefore remain an explicit handoff check even though the same production script and scenarios pass the deterministic VM suite.

Browser `localStorage` does not expose atomic compare-and-swap. The exact pre-commit reread, identity checks, staging provenance, revisions, same-tab guard, and storage-event marker narrow and expose conflicts, but another tab can still write in the small interval between reread and active `setItem`. Phase 0B does not claim perfect cross-tab CAS.

Cross-midnight accrual behavior and the existing 24-hour cap are intentionally unchanged for their later roadmap gates.

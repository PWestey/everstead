# Everstead Phase 0C Result

## Gate status

Phase 0C — Feature Flags, Adapters, and QA Surface is complete on `migration/0c-flags-qa`, based on published main `81ec44c`. Initial production changes are isolated in commit `9545593`; focused destructive-bridge hardening is isolated in `0cb7555`.

The production artifact remains the single-file `index.html`. Its embedded assets, visible version, branding, layout, economy formulas, reward values, roster sizes, legacy gameplay defaults, storage keys, schema, and 24-hour offline cap remain unchanged.

## Delivered runtime contract

- Story, Tower, Trading, Patrol, and Operations have immutable feature flags whose production defaults preserve existing availability.
- When an override object is present, only an own literal `true` enables a mode. Missing, inherited, false, non-boolean, or caller-mutated values cannot enable it.
- Disabled-mode guards sit at the mutating leaves and refuse direct, dispatcher, bridge, already-open modal, persisted-ready-claim, optimizer, and route-setter paths without rewards or writes.
- Story-disabled Oath completion retains ordinary Oath rewards but cannot add Story wall Resolve. Patrol-disabled rollover cannot replenish `patrolBank`; disabled Operations are not shifted by simulated time.
- Clock, random, storage, confirmation, and ID sources are captured adapters. Installed incomplete, invalid, throwing, non-finite, non-boolean, faulting, or exhausted adapters do not fall back to native facilities.
- The synchronous Gate 0B persistence adapter and fault seam remain compatible. Transaction ordering, write-once raw backup, recovery precedence, conflict checks, revisions, and action-scoped Oath Undo are unchanged.
- Safe exact-raw export is available from normal, future, corrupt, invalid, and recovery boots without replacing protected payloads. Explicit recovery continues to require Gate 0B provenance and backup protections.
- The existing visible **Simulate 2H**, **+1 Patrol**, and **Reset Prototype** controls remain unchanged as grandfathered Phase 0 compatibility behavior. Production quarantine or removal of those controls is deferred to Phase 1; the corrective follow-up gates only the new programmatic bridge routes.

## Local QA bridge and diagnostics

The QA bridge is installed only for an exact HTTP(S) loopback hostname plus one literal and one decoded `qa=1` entry. It rechecks the current URL on every access, so removing the query after boot revokes both the property and cached bridge methods; adding the query after a non-QA boot does not install it.

The bridge exposes cloned snapshots, named allowlisted actions, feature state, frozen/advanced clock control, one-shot deterministic random sequences, diagnostics, exact export, explicit recovery/reload, and opt-in destructive fixtures/grants. Raw input is validated before cloning and rejects functions, undefined fields, symbols, accessors, custom serialization, inherited/custom prototypes, prototype-pollution keys, malformed arrays, unknown keys/actions, and mixed-case names. Underlying persistence and adapter failures are reported as failed bridge actions and never mislabeled successful.

Destructive fixture/grant controls and programmatic `simulate`/`add-patrol` actions now require all of: `qa.allowDestructive === true`, `qa.isolatedStorage === true`, and a selected supplied storage source that is not the exact captured native `localStorage` object. Missing or false attestation, lack of authorization, and exact native-object reuse fail before the action handler with no raw, revision, storage-write, or success-UI change. A distinct memory adapter with both attestations succeeds. Explicit isolation attestation plus direct native-object rejection is the boundary; a malicious wrapper that forwards to native storage is outside the trusted test-runtime contract.

Diagnostics report the current schema and active source key, backup presence/identity/match/read errors, validation errors, migration receipts, every Building rate component, feature state, and a non-mutating offline-claim preview. The frozen offline table covers 0 ms, 1 ms, 60,000 ms, 60,001 ms, two hours, 24 hours minus 1 ms, 24 hours, 24 hours plus 1 ms, clock rollback, missing and zero timestamps, and the known unsegmented cross-midnight legacy behavior.

## Executable QA result

The additive contract under `qa/gate-0c/` freezes 54 historical Phase 0A/0B files at `81ec44c`, owns a separate current-artifact manifest, and verifies the embedded-asset aggregate before executing behavior.

Two consecutive final command-line runs completed with:

- `258/258 Gate 0C checks passed` on each run.
- Every entry in `qa/gate-0c/checksums.sha256` passed on each run.
- Production artifact SHA-256: `6a78e9177586c854a60717f5ee4f7dc5ce428132465d5976916690cf6936de3b`.
- Production artifact byte length: `18346742`.
- Embedded asset aggregate SHA-256: `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78`, identical to base.

The frozen Gate 0B verifier retains all `599/599` behavioral checks; its only two expected failures are the superseded current-artifact SHA-256 and byte-length assertions. The historical Gate 0A contract remains byte-frozen; its old current-source identity and five intentionally observed pre-0B legacy implementation-shape assertions are not reused as Gate 0C merge gates.

## Browser result and residual risk

The dependency-free runner checks all frozen inputs before launching memory-only HTTP loopback realms. It exercises default and all-disabled builds, rendered unavailable states, offline summary/claim, navigation, all three rosters, a Building modal/upgrade, diagnostics, clone isolation, exact export, QA query gating, and horizontal overflow at both 320×568 and 390×844.

The frozen browser contract rendered `116/116` twice in live in-app Chromium with a blank fatal field, no failed result rows, and zero warning/error console entries. Browser-control evaluation runs in an isolated world and therefore cannot read the page-world expando directly; the stable visible totals and complete result rows are the directly observed evidence, while the runner source contract verifies publication at `window.__EVERSTEAD_GATE_0C_RESULT__`.

Browser `localStorage` still cannot provide atomic compare-and-swap. Exact rereads, revision/raw identity, staging provenance, same-tab exclusion, and storage-event stale marking narrow and expose conflicts, but another tab can still win the final reread-to-write race. Cross-midnight production remains intentionally unsegmented until the later economy migration.

# Phase 0 execution contract

## Objective

Turn the untouched v0.1 prototype into a safely testable and migratable baseline without changing its visible product behavior, branding, or game mechanics.

Phase 0 is divided into three serial gates. Each gate starts from the prior gate on `main`, uses one implementation branch/worktree, and receives an independent review before merge.

## Authority decisions

- The linked **Locked Core Design v1.2** is the current mechanics authority.
- Campaign and Tower progression will use total owned-roster Power. Selected-squad language in the older roadmap does not control progression math.
- Keep `oathforge_new_world_proto_v01` as the active storage key through Phase 1. Add schema versioning inside the payload before considering a namespace migration.
- Preserve the current 24-hour offline cap during Phase 0. Characterize cross-midnight behavior as a known legacy defect; correct and segment it during the Phase 1 economy migration.
- Preserve the single-file production app and embedded assets. Phase 0 may add separate QA files but must not introduce a framework or production build step.

## Gate 0A — Baseline contract

### Objective

Capture the exact baseline, representative legacy saves, and deterministic characterization checks before changing production behavior.

### Deliverables

- A machine-readable baseline manifest containing the source commit, `index.html` checksum, byte length, visible version, and active storage key.
- Exact raw fixtures for a representative v0.1 save, sparse data, corrupt data, wrong-type data, clock rollback, cross-midnight elapsed time, and the 24-hour cap.
- A small dependency-free QA runner and documentation that can execute from a static server.
- Characterization coverage for boot, save/reload, Oath completion/undo, Oath multipliers, Building upgrades, offline Gold, rollover, roster counts, navigation, representative modals, and phone-width structure.
- Every characterization must label an assertion as either required behavior or a recorded legacy defect.

### Acceptance criteria

- `index.html` remains byte-identical to baseline SHA-256 `5223b96d35960465176a8ba6332b8b49185b95e006fd65f0d44aa6256fac9f80`.
- Fixtures are immutable, checksummed, and isolated from player storage.
- The QA runner reports pass/fail without external dependencies or a production code change.
- Any browser/device checks that cannot run in automation are listed explicitly for manual verification.

### Do not break

Do not edit, reformat, extract, or regenerate `index.html` or its embedded CSS/art lines. Do not change save data, branding, economy, navigation, or mechanics.

## Gate 0B — Transactional save foundation

### Objective

Introduce explicit schema versioning, validation, exact raw backup, ordered idempotent migrations, recovery, and safe persistence while keeping the current state shape and gameplay behavior.

### Required storage contract

- Active key: `oathforge_new_world_proto_v01`
- Write-once raw backup: `oathforge_new_world_proto_v01__raw_backup_v0_1`
- Staging key: `oathforge_new_world_proto_v01__staging`
- Integer `schemaVersion` independent from visible/build version.
- Save metadata includes a save ID, created/updated timestamps, revision, source, and applied migration receipts.

### Required write order

1. Read the exact raw active payload.
2. Write and verify the raw backup before parsing or transforming legacy data.
3. Classify fresh, legacy, current, future, corrupt, or invalid input.
4. Run pure ordered migrations on a clone and validate nested state.
5. Write, read back, parse, and validate the staging payload.
6. Replace the active payload only after backup and staging verification.
7. Verify the active payload, then remove staging.

### Acceptance criteria

- Fresh, representative v0.1, sparse, corrupt, invalid, current, twice-migrated, and future-schema fixtures have deterministic outcomes.
- Migration is idempotent and never duplicates receipts or replaces the original raw backup.
- Corruption, quota failure, or injected write failure never silently overwrites the only recoverable payload.
- Existing resources, Oaths, Buildings, rosters, assignments, progress, UI state, and offline timestamps round-trip without reinterpretation.
- Calculated values remain derived rather than persisted as authoritative truth.

### Do not break

Do not change branding, formulas, rewards, roster models, feature availability, the storage-key namespace, or visible layout.

## Gate 0C — Feature flags and QA controls

### Objective

Add safe migration controls and quarantining mechanisms so later phases can replace incompatible mechanics behind the existing shell.

### Deliverables

- Feature flags that prevent disabled legacy modes from mutating state, not merely hiding their navigation.
- Injectable clock, randomness, storage, and confirmation adapters with production defaults unchanged.
- A localhost-and-`?qa=1` gated QA bridge that exposes cloned state and deterministic actions without exposing mutable internal state.
- Diagnostics for schema, source key, backup status, validation errors, migration receipts, rate components, and offline-claim previews.
- Safe export/recovery controls; destructive fixture/grant controls remain local QA only.

### Acceptance criteria

- Production behavior is unchanged with default adapters and flags.
- Tests can freeze/advance time, provide deterministic random sequences, isolate storage, and simulate write failures.
- Disabled Story, Tower, Trading, Patrol, or Operations routes cannot issue rewards or mutations.
- Fresh and migrated saves pass boot, persistence, navigation, modal, roster, and offline regressions.

### Do not break

Do not begin Everstead branding, economy normalization, Fellow/Family/Companion migration, or adventure replacement. Those start only after Phase 0 passes.

## Phase 0 exit gate

Phase 1 remains blocked until:

- Gates 0A, 0B, and 0C are merged in order and independently reviewed.
- Automated Phase 0 checks pass twice under the same frozen clock and random sequence.
- Fresh and real legacy saves boot without uncaught errors.
- Raw backup, migration idempotence, failure recovery, current-save precedence, and unsupported future-schema handling are proven.
- Existing offline Gold, Oath multiplier/cap, upgrade, rollover, save/reload, navigation, roster, and modal behavior is characterized and protected.
- Untested browser and real-device risks are recorded rather than assumed passing.

Phase 1 will then split into visible Everstead branding followed by Village/Oath economy normalization and legacy-mode quarantine.

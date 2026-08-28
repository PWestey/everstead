# Phase 5 QA

This additive gate verifies the schema-6 Fellow Campaign and keeps all Phase 0–4 evidence frozen.

- `verify.mjs` covers the ten stages, Player Rank, exact reward formulas, deterministic receipts, Story migration, exact checkpoint/reset attestations, all eight post-write boot/read faults, fault/retry handling, retired-mode quarantine, malformed-save fail-closure, and exact fixture rollback.
- `regress-phase-4.mjs` verifies retained Phase 4 behavior and itemizes the seven intended Phase 5 replacements.
- `index.html`, `runner.js`, `realm.html`, and `realm.js` form the isolated live mobile Chromium gate.
- `scenarios.json` pins the base, production commit, clock, storage keys, and viewports.
- `current-manifest.json` pins the artifact, embedded assets, scenarios, and frozen historical files.
- `checksums.sha256` binds the complete Phase 5 package.

The live runner covers both mobile sizes with fresh, migration, stage-10, deterministic replay hit/miss, reduced-motion, disabled, all-disabled, encoded-query, unattested, and exact-native-storage refusal realms. It must finish with a blank fatal field, zero failed rows, zero captured warning/error entries, and no native-storage access by any isolated action.

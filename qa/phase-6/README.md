# Phase 6 QA

This additive gate verifies schema-7 Companion Campaign, Companion Tower, the Mastery idle lane, and the nine-slot persistence expansion while keeping Phase 0–5 evidence frozen.

- `verify.mjs` covers definitions, reward formulas, Total Companion Roster Power, the shared encounter coordinator, Mastery derivation, Campaign and Tower ledgers, deterministic shard/pity replay, elapsed-time caps, migration origins, reserved collisions, exact pre-v7 ancestry, missing-active refusal/recovery, historical schema-6 fresh/migration/current/safe-reset staging, checkpoint faults, feature quarantine, and native-storage refusal.
- `regress-phase-5.mjs` verifies retained Phase 5 behavior and itemizes the intended Phase 6 replacements.
- `index.html`, `runner.js`, `realm.html`, and `realm.js` form the isolated live mobile Chromium gate.
- `scenarios.json` pins the base, production commit, clock, storage keys, and viewports.
- `current-manifest.json` pins the artifact, embedded assets, scenarios, and frozen historical files.
- `checksums.sha256` binds the complete Phase 6 package.

The live runner covers both mobile sizes with fresh, schema-6 and legacy migrations, Companion Campaign first clear/replay, Tower clears, idle claims, forced pity, reload, Mastery propagation, normal/reduced motion, disabled/all-disabled, encoded-query, unattested, and exact-native-storage refusal realms. It must finish with a blank fatal field, zero failed rows, zero captured warning/error entries, and no native-storage access by any isolated action.

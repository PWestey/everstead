# Phase 7 QA

This additive gate verifies schema-8 Fellow Expedition, Might, Fellow Campaign v2 source accounting, and the ten-slot persistence expansion while keeping Phase 0–6 evidence frozen.

- `verify.mjs` covers the 50-stage weakest-first/exhaustion resolver, exact Power order, best-run chronology, hourly idle settlement, deterministic shard/pity replay, Might derivation and cap behavior, Campaign v2 ledgers, the 100,000-entry replay ceiling, schema 0–7 migration, historical pending/committed transactions, safe-reset archival roots, exact pre-v8 ancestry, feature quarantine, diagnostics, and native-storage refusal.
- `regress-phase-6.mjs` preserves Phase 6 semantics and itemizes the intended Phase 7 replacements.
- `index.html`, `runner.js`, `realm.html`, and `realm.js` form the isolated live mobile Chromium gate.
- `scenarios.json` pins the released Phase 6 base, production commit, clock, ten storage keys, and required viewports.
- `current-manifest.json` pins the production artifact, embedded assets, scenarios, and every frozen historical file.
- `checksums.sha256` binds the complete Phase 7 package.

The live runner covers both mobile sizes with fresh, schema-7, and legacy migrations; best-run stage 3; new-high chronology; idle hit/miss/pity/cap behavior; Campaign v2; disabled/all-disabled/encoded-query/unattested/native-storage refusal; and reload-safe UI. It must finish with a blank fatal field, zero failed rows, zero captured warning/error entries, and no native-storage access by any isolated action.

Released schema 0–7 saves are supported. Provisional schema-8 files created only inside the unmerged and unpushed Phase 7 worktree before the final seal are intentionally not a compatibility target; all QA fixtures use isolated memory storage.

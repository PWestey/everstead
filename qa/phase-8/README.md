# Phase 8 QA

This additive gate verifies schema-9 Relics, Relic Stones, the Phase 8 Campaign epoch and paired side receipt, active Fellow Power propagation, and eleven-slot persistence while keeping Phase 0–7 evidence frozen.

- `verify.mjs` covers the immutable six-Relic catalogue, acquisition/salvage equations, upgrade costs and caps, equipment moves/no-ops, exact Power order, Campaign v2 preservation, Phase 8 source ledgers and side receipts, schema 0–8 migration, transaction retry boundaries, safe reset, diagnostics, and isolated QA authorization.
- `regress-phase-7.mjs` preserves Phase 7 semantics and itemizes only the intended Phase 8 replacements.
- `index.html`, `runner.js`, `realm.html`, and `realm.js` form the isolated live mobile Chromium gate.
- `scenarios.json` pins the sealed Phase 7 base, repaired Phase 8 production commit, clock, eleven protected keys, and required viewports.
- `current-manifest.json` pins the production artifact, embedded assets, scenarios, independent review evidence, and every frozen historical file.
- `checksums.sha256` binds the complete Phase 8 package.

The live runner covers both required mobile sizes in normal and reduced motion, plus fresh/schema-8/legacy migration, deterministic acquisition and duplicate salvage, stage-7 Stone-only rewards, equipment/movement/upgrade/refusal/reload, delayed-modal receipt isolation, UI overflow, disabled/unattested/native-storage refusal, and diagnostics. Every realm uses an isolated memory adapter unless it is explicitly proving native-storage refusal.

Independent pre-package reviews passed all 19 exact gameplay/receipt cases and all 46 persistence/recovery cases. Those counts are recorded as reviewer evidence, not inflated into this package's executable totals.

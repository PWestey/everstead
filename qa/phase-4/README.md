# Phase 4 QA

This additive gate verifies schema-5 Companion expansion without rewriting historical Phase 0–3 evidence.

- `verify.mjs` evaluates production mechanics, UI strings, migration, seven-slot persistence, adversarial lineage, and injected failure/retry behavior.
- `regress-phase-3.mjs` checks retained Phase 3 semantic contracts and itemizes six intended replacements.
- `index.html`, `runner.js`, `realm.html`, and `realm.js` form the live mobile Chromium gate.
- `scenarios.json` pins the base, production commit, clock, storage keys, and viewports.
- `current-manifest.json` pins the artifact, embedded assets, scenarios, and all frozen historical files.
- `checksums.sha256` binds the complete Phase 4 package.

The live runner uses isolated in-memory storage. It must finish with a blank fatal field, zero failed rows, zero captured warning/error entries, and zero native-storage calls.

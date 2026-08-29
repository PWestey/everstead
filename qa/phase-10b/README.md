# Everstead Phase 10B-1 deterministic economy oracle

Phase 10B-1 is an additive QA/docs package. It measures the released schema-10 economy and named advisory configurations without changing `index.html`, production behavior, saves, schema, or protected storage slots.

## Frozen scope

- Production artifact: SHA-256 `717160cdddc5fa540532cdebd29f30d127ded2f761edd677684a2609fde9a4ed`, 18,916,682 bytes.
- Schema: 10; protected slots: 12.
- Focused CLI registry: exact 624 rows.
- Phase 10A successor: exact 203 rows.
- Live dashboard: exact 164 rows (four runner identities plus 40 rows in each of four mobile/motion realms).
- Candidate configurations are advisory only. No simulator output selects or approves a production balance.

## Package map

- `scenarios.json` freezes released inputs, parity vectors, advisory configurations, archetypes, horizons, and live dimensions.
- `golden-current.json` freezes 96 literal hand-worked microvector outputs and 240 literal inspectable released-parity outputs. Ordinary scripts never rewrite it.
- `reference-model.mjs` is the literal independent reference implementation.
- `production-probe.mjs` verifies the accepted bytes, replaces the exact unique boot tail in memory, exposes only allowlisted selectors, and runs them in poisoned fresh VM contexts with no storage, timer, UI, network, or inherited-QA-hook access. Removing the probe facade restores the exact accepted bytes.
- `simulate.mjs` builds the 144-bundle advisory report from immutable canonical inputs. Its Gold ledger preserves released Float64 generation and whole-pending collection semantics, records every pending/Gold operation with exact before/delta/after values, and proves conservation by replaying the identical operation order without a tolerance or alternate fixed-point oracle.
- `current-report.json` is the full frozen canonical advisory report, including identities, inputs, per-Building/per-segment Gold, Building components and pacing, Power ownership, progression, Campaign, idle/pity/RNG/carry, and safety outputs. Ordinary verifier/browser/build runs only read it.
- `row-registry.json` freezes all 624 CLI row IDs and category order.
- `verify.mjs` runs the exact focused gate and snapshots all Phase 10B files plus the complete 203-file Phase 0–10A successor set to prove the verifier made no write.
- `phase10a-successor-hashes.json` freezes the exact 188 historical plus 15 Phase 10A-owned byte hashes; `regress-phase-10a.mjs` runs one file row per frozen hash without trusting mutable predecessor manifests or checksums.
- `index.html`, `realm.html`, `realm.js`, and `runner.js` implement the read-only 164-row live dashboard.
- `generate-candidates.mjs` is the only report/golden candidate generator. It requires explicit non-accepted `.candidate.json` output paths and refuses overwrite.
- `build-contract.mjs` may update only `current-manifest.json` and `checksums.sha256`; it cannot generate scenarios, registry, golden, or report data.

## Run the gates

From the repository root, with a compatible Node runtime:

```sh
TZ=America/Phoenix node qa/phase-10b/verify.mjs
node qa/phase-10b/regress-phase-10a.mjs
sha256sum -c qa/phase-10b/checksums.sha256
```

For the browser candidate, serve the repository root over a local HTTP server and open `/qa/phase-10b/`. The enabled **Run 164 checks** control and the automatic first pass execute the same four isolated realms: 320×568 and 390×844 in normal and reduced-motion modes.

## Evidence rules

- Do not run the build script as part of ordinary verification; it intentionally writes manifest/checksum evidence.
- Do not edit or regenerate `golden-current.json` or `current-report.json` through a verifier, browser, or build run.
- The live dashboard installs measured storage, browser-API, and network traps in the runner and every isolated realm, fails on any trap-installation error, and allows only its exact same-origin GET registry with omitted credentials and a measured no-script-visible-`Set-Cookie` boundary. It exercises every selector/control and has no production route or production bridge.
- A candidate is not sealed until exact repeat runs, live evidence, inherited gates, checksums, and both independent reviews are recorded against one exact tip.

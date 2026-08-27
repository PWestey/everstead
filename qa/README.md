# Gate 0A baseline QA

## Scope

This directory implements **Phase 0A — Baseline Contract** only. It records and characterizes the untouched OATHFORGE v0.1 artifact before save migrations or production test hooks exist.

- Phase: 0A
- Dependencies: none
- Acceptance: the locked artifact and every fixture verify; the static runner reports all required behavior as passing and every declared legacy defect as observed.
- Do not break: `index.html`, branding, storage, economy, navigation, and game mechanics remain byte-identical.

Gate 0A does not fix legacy behavior. Gate 0B owns transactional save validation and recovery. Gate 0C owns production clock, randomness, storage, confirmation, feature-flag, and QA adapters.

## Run from a static server

Serve the repository root, not the `qa` directory:

```sh
python3 -m http.server 8000
```

Open <http://127.0.0.1:8000/qa/>. The runner starts automatically and can be rerun with **Run characterization**.

The runner has no external dependencies. It:

1. fetches `index.html` as opaque bytes;
2. verifies its SHA-256 and byte length before decoding or executing it;
3. creates a new sandboxed iframe without `allow-same-origin` for every scenario;
4. installs a memory-only `localStorage` in that disposable opaque realm before production code starts;
5. freezes the clock to America/Phoenix semantics and supplies a fixed random sequence;
6. executes the verified production artifact and reports results through `postMessage`;
7. removes the iframe after the scenario.

The QA page never reads, writes, clears, backs up, or restores the browser origin's real player storage. A failed memory-storage installation cannot fall through to player storage because the test iframe has an opaque sandbox origin where native storage is unavailable.

Automation can read the final browser result from:

```js
window.__EVERSTEAD_GATE_0A_RESULT__
```

## Command-line verification

With Node on `PATH`:

```sh
node qa/verify.mjs
shasum -a 256 -c qa/checksums.sha256
```

If Node is not on `PATH` in the Codex workspace, use the bundled runtime:

```sh
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/verify.mjs
```

The command-line verifier checks the manifest, Git blob identity, artifact, fixture bytes and metadata, scenario storage slots, JavaScript syntax, fixed source contracts, and source evidence for the recorded defects. It does not claim browser layout or interaction coverage; those results come only from `qa/index.html`.

## Contract labels

- `required`: working v0.1 behavior that must remain stable until an authoritative later phase replaces it.
- `legacy-defect`: a v0.1 failure that Gate 0A must reproduce and name. `OBSERVED` means the characterization passed; it does not mean the behavior is desirable.

Mandatory recorded defects include:

- rollover before accrual prices a cross-midnight interval entirely at the new day's unboosted rate;
- a clock rollback moves a future `lastGoldAt` backward to the current clock;
- `lastGoldAt: 0` is treated as missing because of a falsy fallback;
- collection floors pending Gold and discards the fractional remainder;
- Oath undo restores a whole-state snapshot and can undo unrelated mutations performed after completion;
- corrupt JSON is silently replaced by defaults;
- sparse or wrong-type nested state can fail during boot.

## Files

- `baseline-manifest.json` — repository and artifact identity plus per-fixture byte contracts.
- `scenarios.json` — deterministic scenario inputs, fixed expected values, and active/backup/staging raw slots reserved for Gate 0B extension.
- `fixtures/*.txt` — exact raw strings. They intentionally have no trailing newline.
- `checksums.sha256` — command-line SHA-256 verification for the artifact, manifest, scenarios, and fixtures.
- `qa/index.html` and `qa/runner.js` — dependency-free static-server test UI and black-box runner.
- `verify.mjs` — dependency-free command-line contract verifier.

Fixture files are test inputs, not save templates for players. Do not pretty-print, normalize, or add trailing newlines to them.

In the manifest, `repositoryCommit` is the reviewed repository snapshot from which Gate 0A was prepared. `indexBaselineCommit` is the original upload commit that introduced the byte-locked artifact. `artifact.gitBlobId` identifies that exact Git object independently from its SHA-256 contract.

## Manual verification risks

The disposable black-box runner covers DOM structure at a 320 by 568 CSS viewport, but Gate 0A still requires manual verification for:

- real iOS safe-area and standalone/PWA viewport behavior;
- Android soft-keyboard behavior in the Oath form;
- touch scrolling, backdrop tapping, and embedded-atlas cropping/visual quality;
- Safari private-storage and quota behavior;
- clipboard and native confirmation-dialog behavior;
- real-device console health outside the deterministic disposable realm.

Do not weaken storage isolation to automate these checks. Record them as manual until a later gate provides production-safe adapters or a suitable real-device environment.

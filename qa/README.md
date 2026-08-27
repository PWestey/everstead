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
3. fetches every raw fixture and aborts `loadContract()` before any scenario if any checksum, byte length, code-unit length, or trailing-newline contract fails;
4. creates a new sandboxed iframe without `allow-same-origin` for every scenario;
5. installs a memory-only `localStorage` in that disposable opaque realm before production code starts;
6. freezes the clock to America/Phoenix semantics and supplies a fixed random sequence;
7. executes the verified production artifact and reports results through `postMessage`;
8. removes the iframe after the scenario.

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

## Review-strengthened characterization

The representative fixture is an exact raw v0.1 save with a valid persisted Oath undo snapshot and synthetic non-ASCII text. Its UTF-8 byte length is deliberately different from its JavaScript code-unit length. The browser runner performs a recursive, complete-state comparison against that raw fixture after initial boot and again after a deterministic re-boot. The only permitted differences are explicitly named in `scenarios.json`: the boot timestamp, then the boot timestamp plus `ui.view` after the navigation mutation. This comparison includes every Building and operator slot, Fellow training and Bond, Family progress, Companion bindings, every Oath field, focus/featured selection, Patrol, Story, Tower, Trading, Resolve, auto mode, all UI fields, trade team, Operation, and persisted undo data.

Offline Gold coverage includes a table of fixed expected outcomes for 0 and 1 milliseconds, the 60,000/60,001 millisecond modal boundary, exactly two hours, an immediate second claim, 24 hours minus 1 millisecond, exactly 24 hours, 24 hours plus 1 millisecond, a missing timestamp, and same-day/next-day rollover. A separate scenario clicks the offline summary's special claim action and verifies whole-Gold transfer, pending reset, exact memory-storage persistence, modal closure, deterministic re-boot behavior, and a zero-value immediate second claim. Expected numbers are stored as constants in scenario data; the harness does not reuse production economy formulas.

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

The backup and staging raw-key fields are inert scenario-data slots for Gate 0B to extend. Gate 0A deliberately contains no current-schema behavior, active/backup/staging precedence, idempotence contract, transactional write-failure test, backup or staging recovery, or future-schema behavior. The current production artifact has no schema/transaction layer that could support those claims without changing production code.

## Manual verification risks

The disposable black-box runner covers DOM structure at a 320 by 568 CSS viewport, but Gate 0A still requires manual verification for:

- real iOS safe-area and standalone/PWA viewport behavior;
- Android soft-keyboard behavior in the Oath form;
- touch scrolling, backdrop tapping, and embedded-atlas cropping/visual quality;
- Safari private-storage and quota behavior;
- clipboard and native confirmation-dialog behavior;
- real-device console health outside the deterministic disposable realm.

Do not weaken storage isolation to automate these checks. Record them as manual until a later gate provides production-safe adapters or a suitable real-device environment.

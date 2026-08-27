# Phase 0A result

## Status

**Passed and integrated on August 27, 2026.**

Gate 0A added an external, dependency-free regression contract around the exact v0.1 prototype. It did not change production behavior or modify `index.html`.

## Integrated commits

- `5dac493a05f1a556530d03b9b653a2dd2cc57355` — baseline manifest, fixtures, scenarios, runner, verifier, and documentation.
- `d60469bfa270da098320b2bb54a0af4033771834` — complete persisted-state assertions, offline boundaries and claims, Unicode, and persisted-undo coverage.
- `fa0820857016224e64667a801bd50a2fe20ecf9e` — safe callback-based script insertion and live-browser fixes.

## Verification evidence

- Command-line contract: **199/199** checks passed or intentionally observed, repeated twice.
- Live Chromium characterization: **55/55** assertions passed or intentionally observed, repeated twice with identical results.
- Fixture-tamper test: a checksum mismatch produced only the runner fatal result; no scenario executed.
- Raw artifact, manifest, scenario, and fixture checksums passed.
- `index.html` byte length remains **18,284,940**.
- `index.html` SHA-256 remains `5223b96d35960465176a8ba6332b8b49185b95e006fd65f0d44aa6256fac9f80`.
- Baseline Git blob remains `9a03c80f27532c6947533e7a003413621cf48300`.

## Covered behavior

- Fresh boot and save creation.
- Complete representative v0.1 persisted-state preservation across deterministic boots.
- Oath completion, immediate undo, Easy/Medium/Hard boosts, and the 30% cap.
- Building upgrades and Gold deduction.
- Five top-level navigation destinations, all three roster counts, representative modals, and 320×568 structural layout.
- Offline timing at zero, one millisecond, the 60-second modal boundary, two hours, 24-hour cap edges, missing timestamps, same/next-day rollover, claim persistence, and immediate no-double-claim behavior.
- Exact raw Unicode and persisted-undo fixture handling.

## Recorded legacy defects

Gate 0A intentionally preserves these as named defects for later migration rather than fixing them early:

- Corrupt JSON is silently replaced by defaults.
- Sparse or wrong-type state can fail during boot.
- Cross-midnight offline Gold uses the post-rollover rate for the whole interval.
- Clock rollback moves a future claim timestamp backward.
- `lastGoldAt: 0` is treated as missing.
- Fractional pending Gold is discarded during collection.
- Oath undo restores a whole-state snapshot and can revert unrelated progress.
- A persisted prior Oath undo is discarded during boot.

## Remaining manual risks

- Real iOS safe-area and standalone/PWA behavior.
- Android soft-keyboard behavior in the Oath form.
- Touch scrolling, backdrop tapping, and embedded-atlas visual quality.
- Safari private-storage and quota behavior.
- Clipboard and native confirmation-dialog behavior.

Gate 0B now owns schema versioning, exact raw backup, staging, validation, current-save precedence, idempotent migrations, future-schema handling, transactional failure injection, and recovery.

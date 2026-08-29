# Everstead Phase 9 QA

This additive gate verifies the Phase 9 Player Rank unlock spine at production commit `ee516296ddf823ba90b4a85ddc474456fada09f7`. It does not mutate native browser storage; destructive actions run only against the isolated in-memory adapter.

## Permanent commands

From the repository root with the bundled Node runtime available as `node`:

```text
node qa/phase-9/verify.mjs
node qa/phase-9/regress-phase-8.mjs
shasum -a 256 -c qa/phase-9/checksums.sha256
```

Serve the repository root locally and open `qa/phase-9/` for the live gate. The harness runs exact 320×568 and 390×844 realms, real pointer and keyboard controls, normal and reduced-motion Rank-up presentation, migrated grandfather access, Phase 8 reward preservation, disabled/unattested/native-storage refusals, responsive overflow checks, and captured console errors.

## Evidence boundary

- `verify.mjs` is the permanent 355-row CLI oracle for schema 10, access, progression, checked safe-integer addition, canonical stage-10 grandfather migration, twelve-slot export failures, deterministic staging, faults, fixture rollback, storage events, one-shot Rank summaries, and fail-closed QA Adventure authorization.
- `regress-phase-8.mjs` freezes the complete Phase 8 package and itemizes only nine intended successor changes, including the additive QA Adventure hardening.
- `current-manifest.json` freezes all Phase 0–8 QA/docs bytes, exact artifact/scenario identities, and independently reviewed production evidence.
- `checksums.sha256` binds the production artifact, Phase 9 contract/docs, and all Phase 9 package files except itself.

No test grants Rank EXP directly. Canonical first-clear gameplay is the only tested Rank EXP source.

The expanded live harness adds twenty one-shot Rank-summary rows per pass across normal/reduced motion and both phone dimensions. Exact review-sealed package `4f810268d5be82954dbbe8cb825f758a079405e8` passed two independent full in-app Chromium runs at `628/628`, Failed `0`, blank fatal, zero failed rows, and zero warning/error console entries. Every required `320×568` and `390×844` realm row passed, including all four Rank-summary non-replay assertions in both motion modes and sizes.

## Public release

Phase 9 is published from exact canonical and origin head `843ce328f898781ff2729c1eaf67253d471fc1be`. GitHub Pages deployment [run 33229894273](https://github.com/PWestey/everstead/actions/runs/33229894273) completed successfully at `2026-08-29T02:50:13Z`. The public [Everstead application](https://pwestey.github.io/everstead/) was verified at `2026-08-29T02:52:31Z`: SHA-256 `1e9d22150a5a0d2b2b4fbec403a5a50bf81c3b22153e688b659bda9b6bc67529`, `18,916,650` bytes, schema 10, with `schema-9-to-10` and `The Wayfarer` present. Independent in-app Chromium verification also loaded Everstead v0.1, opened The Wayfarer profile, rendered Rank 1/5 and the complete Rank 2–5 roadmap, and recorded zero warning/error console entries.

# Phase 23 successor-schema compatibility QA

This additive gate verifies that schema 13 activates inherited Everstead behavior instead of silently falling back to older mechanics. It complements rather than replaces `qa/phase-23-independent/`.

The real candidate is loaded into isolated memory storage. The browser suite uses the production Phase 23 and inherited QA bridges, performs genuine Building and Relic actions, clicks real Rank-gated controls, checks screen/state agreement, and requires a production-authoritative Expedition exercise. It does not install or mutate a fabricated save payload.

Coverage includes:

- exact Rank-1 joined Fellow set and Campaign training target;
- exact 35,150 Fellow and 2,200 Companion economy inputs, bps, multipliers, and four Building rates;
- the complete 1.24 Building cost ladder through Level 52, cap refusal, and reload;
- Relic placement in the inherited Power formula and joined total;
- Rank-gated route refusal with no hidden UI drift;
- Village speaker eligibility;
- segmented Fellow Expedition accrual across a real best-stage boundary, the shared 24-hour cap, exact claim/reload/replay, and no repricing;
- isolated-storage and console guards.

Run the package-only static audit:

```sh
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-23-successor-compatibility/verify.mjs --package-only
```

Run the full static candidate audit by omitting `--package-only`. Serve the repository root and open `qa/phase-23-successor-compatibility/` for the real-browser gate. A release verdict requires this gate and the complete original Phase 23 independent gate to pass on the same frozen candidate.

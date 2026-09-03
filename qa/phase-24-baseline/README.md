# Phase 24A deterministic balance report

This package captures the real production `EVERSTEAD_PHASE24_SCALING` authority
through the genuine read-only Phase 23 QA bridge. It evaluates exactly three
canonical profiles: true fresh schema 13, migrated-established schema 13, and
true high investment. The all-unlocked fixture remains separate near-cap QA
evidence and is never evaluated as a fourth canonical profile.

The capture uses an isolated in-memory storage adapter and a frozen clock. It
fails if production touches native Web Storage, a profile ID changes, an exact
anchor changes, Collections contribute a nonzero value, any integer becomes
unsafe, a required cost/requirement/claim/offline section is missing, or a
private artwork path appears in the artifact.

Run the recipe contract first:

```sh
node scripts/phase24-verify-baseline-contract.mjs
```

Generate the machine-readable and human-readable reports through headless
Chrome:

```sh
node scripts/phase24-generate-balance-report.mjs
```

Run the same real-browser capture again and require byte-identical checked-in
artifacts:

```sh
node scripts/phase24-generate-balance-report.mjs --check
```

The browser-facing runner is also available at `qa/phase-24-baseline/` when the
repository is served over HTTP. It publishes the stable captured object as
`window.__EVERSTEAD_PHASE24A_BALANCE_REPORT__` and renders the complete JSON in
`#phase24-report`.

The frozen verdict, exact profile outputs, migration-lineage identities,
claim/offline block hashes, source hashes, and safe-precision evidence are in
`PHASE_24A_BALANCE_REPORT_RESULT.md`. Verify every package file against
`checksums.sha256` after generation.

This package does not calculate production formulas, import a save, settle idle
time, claim rewards, change balance, or authorize a release.

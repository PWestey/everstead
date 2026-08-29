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

- `verify.mjs` is the permanent 316-row CLI oracle for schema 10, access, progression, migration, deterministic staging, faults, fixture rollback, storage events, and fail-closed QA Adventure authorization.
- `regress-phase-8.mjs` freezes the complete Phase 8 package and itemizes only nine intended successor changes, including the additive QA Adventure hardening.
- `current-manifest.json` freezes all Phase 0–8 QA/docs bytes, exact artifact/scenario identities, and independently reviewed production evidence.
- `checksums.sha256` binds the production artifact, Phase 9 contract/docs, and all Phase 9 package files except itself.

No test grants Rank EXP directly. Canonical first-clear gameplay is the only tested Rank EXP source.

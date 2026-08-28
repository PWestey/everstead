# Everstead Phase 1 QA contract

This additive contract owns the Phase 1 production artifact while freezing every historical `docs/` and `qa/` file byte-for-byte at base `e2dfc24f513499e176ab5c2be3894c8e324c31ac`. It has no runtime dependency beyond Node.js for command-line verification and a static HTTP server for browser verification.

## Command-line proof

From the repository root:

```sh
node qa/phase-1/build-contract.mjs
node qa/phase-1/verify.mjs
node qa/phase-1/regress-gate-0c.mjs
shasum -a 256 -c qa/phase-1/checksums.sha256
```

Run the verifier and checksum sweep twice. `build-contract.mjs` refuses to build if any frozen Phase 0 file differs from the exact base.

## Browser proof

Serve the repository from an exact loopback HTTP host and open `qa/phase-1/`. The dependency-free runner creates isolated memory-storage realms for 320×568 and 390×844 viewports, exercises fresh/schema-1/legacy/all-disabled behavior, and publishes its result at `window.__EVERSTEAD_PHASE_1_RESULT__`.

## Contract boundaries

- Schema 1 bytes are backed up exactly at `oathforge_new_world_proto_v01__raw_backup_v1` before operator removal.
- Production Building math is driven only by configured bases, level curve, explicit neutral hooks, and the final Oath multiplier.
- The local QA bridge and destructive controls retain the exact Gate 0C origin/query/authorization boundary.
- Ordinary product UI contains no time simulation, patrol grant, or prototype reset route. Safe reset remains recovery-only.
- Embedded asset lines and all historical QA/docs remain frozen.

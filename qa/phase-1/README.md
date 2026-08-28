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

Serve the repository from an exact loopback HTTP host and open `qa/phase-1/`. The dependency-free runner creates isolated memory-storage realms for 320×568 and 390×844 viewports and publishes its result at `window.__EVERSTEAD_PHASE_1_RESULT__`.

The matrix includes a genuinely empty-storage fresh boot plus schema-1, legacy, all-disabled, and encoded-query-negative realms. The fresh realm proves schema-2 creation, Everstead rendering, neutral Village rate, production-debug absence, navigation, zero native Web Storage method calls, no overflow, and no captured page errors.

## Contract boundaries

- Schema 1 bytes are backed up exactly at `oathforge_new_world_proto_v01__raw_backup_v1` before operator removal.
- Interrupted legacy retry reuses those bytes only after exact active-legacy lineage validation. For schema-0 and schema-1 active saves, an owned staged successor must match the complete deterministic schema-2 projection of the exact protected intermediate; every non-null unverified staging blob is preserved and blocks migration.
- Rollback cannot move persistence time or calendar day backward or trigger daily Patrol/boost/habit rollover; the next forward local day rolls over exactly once.
- Production Building math is driven only by configured bases, level curve, explicit neutral hooks, and the final Oath multiplier.
- The local QA bridge and destructive controls retain the exact Gate 0C origin/query/authorization boundary.
- Ordinary product UI contains no time simulation, patrol grant, or prototype reset route. Safe reset remains recovery-only.
- Embedded asset lines and all historical QA/docs remain frozen.

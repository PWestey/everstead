# Everstead Phase 10A QA

This additive gate verifies the Phase 10A idle-settlement eligibility repair at production commit `9d82db565ff482a3898e68bd8a6dce8505a9bfe9`. It introduces no production bridge or storage behavior. CLI and browser actions use the inherited fail-closed QA bridge against an isolated in-memory storage adapter.

## Permanent commands

From the repository root:

```text
node qa/phase-10a/verify.mjs
node qa/phase-10a/regress-phase-9.mjs
node qa/phase-9/verify.mjs
node qa/phase-9/regress-phase-8.mjs
shasum -a 256 -c qa/phase-10a/checksums.sha256
```

The frozen Phase 9 checksum file intentionally reports `13/14`: only `index.html` is superseded by the two-guard production repair. Phase 10A's own checksum file must pass every entry.

Serve the repository root and open `qa/phase-10a/` for the live gate. Its `162` rows exercise exact 320×568 and 390×844 realms in normal and reduced motion, production Tower and Expedition controls and populated-screen layout, one shared captured clock, exact reward/resource deltas, Gold neutrality, exact-once claims, same-tick refusal, reload, a schema-valid production Tower overflow rollback, isolated storage, and console capture.

## Evidence boundary

- `verify.mjs` is the `371`-row permanent focused oracle for exact source integrity, complete released-reference parity vectors, true split/reload equivalence, partial carry, lifecycle and cross-lane paths, exact rewards, real overflow rollback, fresh/migrated/safe-reset authority, and all 27 transaction-fault cases with same/later recovery.
- `regress-phase-9.mjs` proves the Phase 9 production/package successor boundary and the exact `13/14` frozen-checksum result.
- `current-manifest.json` freezes Phase 0–9 QA/docs bytes and the Phase 10A artifact/scenario identities.
- The exact reviewed package `0aa03643575be9e0ad845e67e150c9cf3b48ec6f` passed two official Chromium runs at `162/162`, with blank fatal, zero failed rows, and zero warning/error logs. Both independent read-only reviews passed that same exact tip.

No wider Phase 10 economy, Power, balance, claim registry, pity, schema, or UI work is included.

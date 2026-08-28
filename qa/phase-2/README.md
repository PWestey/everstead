# Everstead Phase 2 QA

This additive, dependency-free contract verifies the schema-3 Fellow progression migration without changing any frozen Phase 0 or Phase 1 QA artifact.

Run from the repository root:

```sh
node qa/phase-2/verify.mjs
node qa/phase-2/regress-phase-1.mjs
shasum -a 256 -c qa/phase-2/checksums.sha256
```

For the live suite, serve the repository on a loopback address and open `qa/phase-2/?qa=1`. The runner verifies its manifest and every frozen historical hash before starting memory-only realms at 320×568 and 390×844. It exercises a genuine fresh save, schema-2 migration, representative legacy migration, all-disabled features, and an encoded-query negative realm. Native Web Storage is instrumented and must remain untouched.

Frozen candidate totals are 311/311 CLI assertions, 244 inherited Phase 1 assertions plus 12 documented Phase 2 replacements, 13 checksum entries, and 312/312 live browser assertions. Each gate is required to pass twice.

The Phase 2 balancing values in `FELLOW_CONFIG`—EXP curve, level and rarity multipliers, shard thresholds, counter modifiers, role balance, and Campaign preview math—are centralized tunable defaults. Locked Core v1.2 makes Bond a separate dimension, so its Phase 2 Power multiplier is deliberately neutral (`×1.00`); the milestone remains inspectable for future design work.

The five-slot fixture boundary covers active, v0, v1, v2, and staging payloads. Older Gate 0C callers may omit the newer checkpoint fields; Phase 2 fixtures supply all five. Any installation fault restores the entire five-slot preimage and reports rollback failures. Destructive controls and EXP/shard grants still require explicit authorization, an isolated storage attestation, and a storage object distinct from captured native storage.

Web Storage cannot provide a true atomic compare-and-swap across tabs. Revision/raw-identity conflict checks remain the documented residual risk boundary.

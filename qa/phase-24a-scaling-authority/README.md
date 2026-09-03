# Phase 24A scaling-authority independent QA

This additive gate verifies the output-preserving Phase 24A numeric registry and its three canonical reports. It does not authorize a balance change.

The package has two modes:

- `verify.mjs --package-only` validates this independent contract, runner, syntax, and frozen checksums without treating an absent implementation as success.
- `verify.mjs` additionally requires the real candidate registry, read-only bridge, visible diagnostics, and exact Phase 23 predecessor packages.

Serve the repository root and open `qa/phase-24a-scaling-authority/`. The runner loads the real `index.html` in isolated in-memory storage at four mobile/accessibility configurations. It invokes only read methods, validates the genuine fresh and migrated-established detached states, exercises the real pure Apothecary/Schoolhouse settlement preview, opens the real diagnostic UI, and proves that gameplay state, supplied detached state, persisted bytes, revision, write count, and native Web Storage remain unchanged.

The true-high profile is deliberately synthetic, detached, and `persisted:false`; it is not an importable save. The gate instead freezes its exact report structure, all six pending/offline lanes, manual claim counts and policy identities, capped reward behavior, and full-bank facility previews. Invalid facility IDs and invalid times must fail closed.

Phase 24A is baseline-only. Collection effects remain absent/reserved and contribute zero. This gate does not approve EXP bands, Breakthrough materials, Collection rewards, schema 14, or any repricing.

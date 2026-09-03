# Phase 24B independent progression-simulation gate

This package verifies the Phase 24B model lane without owning or rewriting its
candidate numbers. Its contract was authored before the model artifacts were
frozen.

Run from the repository root with the bundled Node runtime:

```text
node qa/phase-24b-independent/verify.mjs
```

The verifier reads `fixtures/contract.json`, reproduces the model-owned report,
checks artifact identity, and independently recalculates table, pacing,
collection, requirement, claim, and safe-integer invariants. A PASS approves
only the simulation evidence, not live balance or a save migration.

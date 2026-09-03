# Phase 24C independent gate

Run with the repository's bundled or system Node runtime:

```sh
node qa/phase-24c-independent/verify.mjs
shasum -a 256 -c qa/phase-24c-independent/checksums.sha256
```

This lane does not import, execute, or trust `qa/phase-24c-foundation/verify.mjs`. It independently tests the inactive direct-fresh, synthetic safe-reset, real-migration, exactly-once, continuing-release, uncapped-additive, and fractional-base authority in a new VM realm and writes no production state. It is not a real Web Storage, Previous Save, protected-slot, schema-12 import, or coordinator-write test.

# Phase 24C inactive-foundation QA

Run from the repository root:

```sh
/Applications/Codex.app/Contents/Resources/cua_node/bin/node qa/phase-24c-foundation/verify.mjs
shasum -a 256 -c qa/phase-24c-foundation/checksums.sha256
```

The verifier is deterministic and does not open, mutate, reset, or migrate production storage. Its direct-fresh, synthetic safe-reset, real-migration schema-14 states and future active release manifests exist only in memory. It does not claim authentic Phase 23 protected-slot/Previous Save settlement. It also verifies uncapped additive pools through +1,000% and exact fractional-base evaluation without multiplying already-boosted totals. Run the syntax checks and then run the verifier twice; the two JSON reports must be byte-identical. A passing result validates unloaded authority primitives; it does not authorize production activation.

# Everstead Phase 10B-3 UI correction gate

This additive package freezes the Phase 10B-3 UI/accessibility preimage and becomes the permanent acceptance gate for the later production correction.

It never uses native browser storage. The live gate injects an explicitly authorized in-memory adapter before the production script starts. The preimage artifact is expected to reproduce the scoped gaps; a changed artifact is candidate mode and must satisfy every target.

Run the CLI verifier with `node qa/phase-10b3/verify.mjs`. Run `node qa/phase-10b3/build-contract.mjs` to validate package topology and identities. Open `qa/phase-10b3/` through a static server for the live 320×568, 390×667, and 390×844 gate.

The gate does not authorize production changes. See `docs/PHASE_10B3_UI_CORRECTION_CONTRACT.md` for the exact implementation boundary and deferred work.

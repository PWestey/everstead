# Everstead Phase 10B-3 UI correction gate

This additive package is the permanent acceptance gate for the locally accepted Phase 10B-3 UI/accessibility correction at exact candidate tip `2923a26500a35cac9a186bf7638a96ad5c59dc39`.

It never uses native browser storage. The live gate injects an explicitly authorized in-memory adapter before the production script starts. The preimage artifact is expected to reproduce the scoped gaps; a changed artifact is candidate mode and must satisfy every target. Diff topology is mode-scoped: baseline permits only the owned Phase 10B-3 docs/QA paths, while candidate mode additionally permits exactly the authorized production path `index.html`. Every other production path fails closed in both modes.

Run the CLI verifier with `node qa/phase-10b3/verify.mjs`. Run `node qa/phase-10b3/build-contract.mjs` to validate package topology and identities. Open `qa/phase-10b3/` through a static server for the live 320×568, 390×667, and 390×844 gate.

The live terminology traversal is state-aware: it reuses the Relic fixture's already-cleared first Campaign stage and clears only the remaining uncleared prefix. This retains all four unlocked Adventure screens without attempting a Rank-locked replay. The dialog gate also verifies immediate reverse traversal, Companion-modal redecoration and focus restoration, and retained focus after every supported roster-tab key.

The accepted artifact is SHA-256 `40a1b21c62745d7b3c96fc4c2bea7ee56763a109a40b3535178277e26aca19fd`, 18,933,604 bytes. Focused CLI passed 32/32 twice and live Chromium passed 73/73 twice at all three required mobile sizes with zero warning/error console entries. See `docs/PHASE_10B3_UI_CORRECTION_CONTRACT.md` for the exact boundary and `docs/PHASE_10B3_EXECUTION.md` for the evidence.

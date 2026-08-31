# Phase 11B-1 QA

This additive semantic-successor gate verifies the read-only Save & Recovery surface on top of the sealed Phase 11A build.

- `verify.mjs` proves that production is the exact Phase 11A artifact plus one bounded Phase 11B-1 insertion, reuses all 168 Phase 11A semantic probe rows, and explicitly classifies the frozen predecessor gate's expected identity/package supersessions.
- `probe.mjs` checks canonical recovery-bundle shape and SHA-256 behavior, exact slot order, fail-closed health rules, escaped health/history rendering, production-scope boundaries, and embedded-asset identity.
- `index.html` runs `realm.js` at 320×568, 390×667, and 390×844 with isolated memory storage. The live gate verifies the More-screen health/history UI, canonical downloaded bytes, exact protected-slot values, blocked diagnostic download, privacy containment, zero incremental writes for health/download work, and zero native-storage access.

Run the command-line gate with the bundled Node runtime:

```sh
node qa/phase-11b1/verify.mjs
```

Serve the repository root and open `/qa/phase-11b1/` for the live gate. The runner starts automatically and can be repeated with **Run**.

Final local seal: focused 189/189; sealed CLI 203/203 twice; live browser 115/115 twice across all three phone sizes, with zero console warnings/errors and zero native-storage access.

# Phase 11A QA

This additive gate verifies the daily-use clarity pass on top of the accepted Phase 10C build.

- `verify.mjs` reuses the 47-row schema probe and 100-row economy engine probe, then checks the Phase 11A source and isolated-function contract.
- `index.html` runs `realm.js` at 320×568, 390×667, and 390×844 using the captured memory-storage runtime.
- The three live realms exercise the 299,999/300,000 millisecond offline boundary, contextual Relic guidance, distinct Village/combat Power labels, top-bar currency names, legacy Quest conversion safeguards, modal focus return, overflow, and zero native-storage access.

Run the command-line gate with the bundled Node runtime:

```sh
node qa/phase-11a/verify.mjs
```

Serve the repository root and open `/qa/phase-11a/` for the live gate. The runner starts automatically and can be repeated with **Run**.

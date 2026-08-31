# Phase 11B-2 final QA

This is the final semantic-successor gate for Everstead's transactional Save & Recovery release.

- `final-probe.mjs` completes the crash, quota, verification-read, and repeated-reload matrix on top of the Phase 11B-2a parser and Phase 11B-2b transaction-engine probes.
- `verify.mjs` seals the exact production artifact, all Phase 11B-2 executable QA sources, the frozen Phase 11A and Phase 11B-1 packages, their explicitly enumerated successor conditions, the final manifest, and all checksums.
- `index.html` runs the isolated live matrix at 320×568, 390×667, and 390×844. It verifies the exact production artifact, import/restore/reset/Forget flows, source/target/forensic interruption outcomes, privacy containment, focus behavior, responsive layout, and zero native-storage access.

Run the command-line gate with the bundled Node runtime:

```sh
node qa/phase-11b2c/verify.mjs
```

Serve the repository root and open `/qa/phase-11b2c/` for the live gate. The runner starts automatically and can be repeated with **Run**.

Final local evidence: focused recovery probes 286/286; live browser 198/198 twice across all three phone sizes, with zero warning/error console entries and zero native-storage access. The sealed command-line total is recorded in `current-manifest.json`.

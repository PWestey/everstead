# Phase 11D roster and Codex QA

This is the semantic-successor gate for Everstead's roster usability, comparison-first assignment/equipment flows, and read-only Codex.

- `probe.mjs` verifies pure roster projections, exact Codex inventory and authority, Prosperity disclosure, Oath awards, Family assignment effects, Relic equipment effects, no-op handling, transactional safety, and schema neutrality.
- `index.html` runs six isolated browser realms at 320×568, 390×667, and 390×844 with normal and reduced motion. It operates real Oath rewards, empty/reset roster filters, Family move/replace/unassign, Companion Apply, both Relic entry points, equip/move/replace/unequip, and all Codex tabs without touching the player's save.
- The live gate instruments exact native Web Storage access and captures warning/error console output.
- `verify.mjs` seals the exact production artifact, freezes the Phase 11C package, reruns Phase 11D plus inherited Phase 11C/11B behavioral probes, checks package identities, and confirms production stopped changing at the recorded implementation commit.

Run the sealed command-line gate with the bundled Node runtime:

```sh
node qa/phase-11d/verify.mjs
```

Serve the repository root and open `/qa/phase-11d/` for the live gate. It starts automatically and can be repeated with **Run**.

Final local evidence: Phase 11D focused probe 103/103; Phase 11C focused probe 83/83; inherited Phase 11B probes 286/286; live browser 385/385 twice across six isolated mobile realms, with zero warning/error console entries and zero native-storage access.

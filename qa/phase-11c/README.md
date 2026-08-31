# Phase 11C automation QA

This is the semantic-successor gate for Everstead's bounded Campaign repeat and player-invoked Claim Ready release.

- `probe.mjs` compares 1-, 3-, and 5-run Fellow and Companion repeats with the exact existing manual actions; verifies one save per completed run, fixed-stage behavior, the 30,000 Gold reserve, stop/reload safety, fixed claim order, independent claim commits, 24-hour caps, partial success, and zero native-storage access.
- `index.html` runs six isolated browser realms at 320×568, 390×667, and 390×844 with normal and reduced motion. It exercises the real buttons, summaries, Escape stop, focus restoration, badges, mobile layout, and three-lane collection without touching the player's save.
- `verify.mjs` seals the exact production artifact, runs the Phase 11C probe and all 286 Phase 11B save/recovery regression checks, validates package topology and checksums, and confirms that production code stopped changing at the recorded implementation commit.

Run the command-line gate with the bundled Node runtime:

```sh
node qa/phase-11c/verify.mjs
```

Serve the repository root and open `/qa/phase-11c/` for the live gate. It starts automatically and can be repeated with **Run**.

Final local evidence: Phase 11C focused probe 83/83; inherited Phase 11B probes 286/286; live browser 217/217 twice across six isolated mobile realms, with zero warning/error console entries and zero native-storage access.

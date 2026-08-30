# EVERSTEAD — PHASE 10B-3 EXECUTION

## Current status

**LOCAL PASS — READY TO MERGE AND PUBLISH.**

Phase 10B-3 was implemented from exact clean `main` commit `14efe7f0c85c91c78d3bb3e79049694fd0975d07` in the dedicated branch `migration/phase-10b3-ui-corrections`. The bounded production correction is commit `4317b97289a743241beae013fa07f3d590e003d9`; the exact reviewed executable/QA tip is `2923a26500a35cac9a186bf7638a96ad5c59dc39`.

## Bounded outcome

This package freezes the known preimage gaps and defines candidate-mode acceptance for only:

1. one Relic summary owned by each Fellow card;
2. unobstructed Village Building hotspots at 320×568, 390×667, and 390×844;
3. readable Village Collect contrast;
4. removal or QA-gating of internal terminology on player surfaces;
5. `FELLOWSHIP` as the third bottom-navigation label;
6. exact Oath action names and the Habit `+1` action/count split;
7. semantic, focus-managed, Escape-dismissable dialogs;
8. semantic and keyboard-operable Fellowship tabs; and
9. no regression to schema, protected slots, embedded assets, isolated storage, or horizontal layout.

Economy, save/schema behavior, navigation persistence, Oath reset semantics, and Campaign confirmation behavior are explicitly deferred by the contract.

## Harness modes

- `BASELINE_GAPS_CONFIRMED`: selected target assertions are expected to be false in the exact accepted preimage. A row passes when the observed preimage matches its frozen expectation.
- `CANDIDATE`: every target assertion is expected to be true. Invariant rows remain true in both modes.

The dashboard and CLI always report contract conformance, while preserving the observed target boolean in row evidence. This prevents a known defect from being mislabeled as corrected during the preimage run.

## Commands

From the repository root:

```text
node qa/phase-10b3/verify.mjs
node qa/phase-10b3/build-contract.mjs
shasum -a 256 -c qa/phase-10b3/checksums.sha256
```

Serve the repository with any static server and open `qa/phase-10b3/`. The live dashboard starts automatically and executes isolated realms at all three exact viewport sizes.

## Candidate authority

- Candidate commit: `2923a26500a35cac9a186bf7638a96ad5c59dc39`
- Production commit: `4317b97289a743241beae013fa07f3d590e003d9`
- Artifact SHA-256: `40a1b21c62745d7b3c96fc4c2bea7ee56763a109a40b3535178277e26aca19fd`
- Artifact byte length: `18,933,604`
- Embedded-asset aggregate SHA-256: `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`
- Schema: 10
- Protected slots: 12
- Accepted base commit: `14efe7f0c85c91c78d3bb3e79049694fd0975d07`
- Accepted base artifact: `faa5c5fb11785a620f51de5864ec4cda4433bfbc27faaa2359247d9b39c07e75`, `18,928,361` bytes

## Local candidate verification

- Focused CLI: 32/32 twice.
- Live in-app Chromium: 73/73 twice across exact 320×568, 390×667, and 390×844 realms.
- Live console: zero warnings or errors; blank fatal field; zero native-storage calls.
- Phase 9 behavior: 355/355 twice.
- Phase 8 semantic successor: 703/703 twice.
- Phase 10A: 369/371 twice; only the expected whole-artifact SHA and byte-length identities are superseded.
- Phase 10B-2 private Gold core and six wrappers remain byte-identical. The older exact-artifact gate intentionally refuses the Phase 10B-3 successor identity.
- Embedded assets: five exact assets with unchanged aggregate.
- Diff hygiene and JavaScript syntax: pass.
- Independent UX/accessibility review: PASS.
- Independent architecture/persistence review: PASS.
- Independent economy/save-boundary review: PASS.

Public deployment verification remains pending until this locally accepted package is merged and GitHub Pages completes.

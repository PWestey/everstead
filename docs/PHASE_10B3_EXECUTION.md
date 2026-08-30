# EVERSTEAD — PHASE 10B-3 EXECUTION

## Current status

**PREIMAGE QA READY — PRODUCTION IMPLEMENTATION NOT STARTED.**

The Phase 10B-3 contract and additive QA package were prepared from exact clean `main` commit `14efe7f0c85c91c78d3bb3e79049694fd0975d07` in the dedicated branch `migration/phase-10b3-ui-corrections`. Production `index.html` remains byte-identical to the accepted Phase 10B-2 artifact.

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
sha256sum -c qa/phase-10b3/checksums.sha256
```

Serve the repository with any static server and open `qa/phase-10b3/`. The live dashboard starts automatically and executes isolated realms at all three exact viewport sizes.

## Preimage authority

- Commit: `14efe7f0c85c91c78d3bb3e79049694fd0975d07`
- Artifact SHA-256: `faa5c5fb11785a620f51de5864ec4cda4433bfbc27faaa2359247d9b39c07e75`
- Artifact byte length: `18,928,361`
- Embedded-asset aggregate SHA-256: `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`
- Schema: 10
- Protected slots: 12

Candidate and final evidence remain pending until a separately reviewed production commit implements the authorized contract.

## Local preimage verification

- Focused CLI: 29/29 twice.
- Exact checksum manifest: 12/12 twice.
- Package/topology builder: `PREIMAGE_QA_READY`, zero writes in check mode.
- JavaScript syntax: runner and realm accepted by the bundled Node runtime.
- Diff hygiene: clean.
- Live browser: pending. The browser-control runtime reported that no browser surface was available in this subtask, so no live result is claimed here. The permanent dashboard is ready for the primary integrator or an available in-app browser to run.

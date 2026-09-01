# Phase 15 independent Village-board and facility-foundation gate

This additive package validates the Phase 15 physical Village board and shared facility foundation. It does not edit or instrument production files, approve economy values, or require Phase 16 Restaurant gameplay.

## Run

```sh
node qa/phase-15-independent/verify.mjs --package-only
node qa/phase-15-independent/verify.mjs
python3 -m http.server 8785
```

Open `http://127.0.0.1:8785/qa/phase-15-independent/`. The browser gate starts automatically; Run verification provides a clean rerun.

## Live coverage

- the actual Village DOM at 320×568, 390×844, 1024×768, reduced motion, and 175 percent copy;
- twelve unique physical anchors and hidden/discovered/available/ready presentation;
- story discovery versus capability/opening, including authored-event-only Waystone behavior;
- synthetic QA-only interval settlement, bank saturation, stable ordinals, engagement, resolution, and manual exact-once claim;
- immutable finalizer refusal, two-client races, V2 archive folding/checkpoint lineage, import/export, migration, recovery, offline, and corruption;
- unchanged passive Buildings/Gold/Family assignments, five bottom tabs, gradual tutorials, and all 38 cast hooks without locked-Fellow speech.

Exact base provenance is read from frozen Git objects at `7e74226`, not from future working-tree production. The accepted current candidate must fail closed because it contains no Phase 15 runtime bridge.

See `docs/PHASE_15_INDEPENDENT_QA_CONTRACT.md` and `docs/PHASE_15_INDEPENDENT_QA_RESULT.md`.

# Phase 11F QA

Phase 11F is the roster-art and schema-12 migration gate.

Run:

```sh
node qa/phase-11f/verify.mjs
```

The gate verifies the 18-Fellow and 20-Family manifest, every full and thumbnail portrait, externalized page assets, full-screen profiles, compact mobile contracts, fresh schema-12 saves, exact schema-11 migration, missing-active recovery, forged-predecessor refusal, safe reset, and save-neutral navigation.

Earlier Phase 11 suites intentionally freeze their released artifact and schema identities. They remain historical evidence; Phase 11F is their schema-12 successor rather than a rewrite of those frozen files.

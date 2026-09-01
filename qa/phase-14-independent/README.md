# Phase 14 independent validation gate

This additive package validates the Phase 13 First Covenant vertical slice before it may become a release candidate. It does not edit or instrument production files.

Phase 14 is a validation and economy-measurement phase. The Village facility definitions under `design/phase-14/` are audited only as an early Phase 15 data contract. This gate neither requires nor permits a Phase 14/15 facility runtime bridge.

## Run

```sh
node qa/phase-14-independent/verify.mjs --package-only
node qa/phase-14-independent/verify.mjs
python3 -m http.server 8784
```

Open `http://127.0.0.1:8784/qa/phase-14-independent/`. The page runs automatically; the button supports a clean rerun.

## What is exercised live

- five First Covenant story identities, ordering, Chronicle/log/skip/replay behavior, and all 38 cast records;
- exact-once manual Legacy claims, persistence, two-client refusal, and carryover;
- fresh, midgame, migrated, established, corrupt, offline, and claim/tutorial-ready saves;
- Phase 12 activation and trusted claim/event/tutorial seams without schema-lineage bypass;
- tutorial caps, suppression, skip, completion, replay, persistence, and reward-free state changes;
- fresh/midgame/established Campaign pacing and Simulate-2H reward-impact measurements without production tuning;
- 320×568, 390×844, 1024×768, keyboard/focus behavior, and reduced-motion equivalence;
- dormant legacy modes and isolated non-native storage.

The exact base `c8c63b378ad9523b7d12be965335ff4ee6b81b4f` is expected to fail candidate/live verification because it contains the Phase 13 QA package but not the Phase 13 production runtime bridge. That is the intended fail-closed preimplementation result.

Base provenance and inherited asset hashes are resolved from that exact Git object, not the live candidate. This makes the package portable across later accepted implementation and design commits while candidate mode continues to inspect the current production build.

See `docs/PHASE_14_INDEPENDENT_QA_CONTRACT.md` for the frozen contract and `docs/PHASE_14_INDEPENDENT_QA_RESULT.md` for evidence and blind spots.

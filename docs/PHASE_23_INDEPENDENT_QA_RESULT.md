# Phase 23 independent QA result

> **REVALIDATED WITH SUCCESSOR-COMPATIBILITY ADDENDUM — 2026-09-01.** The first
> PASS was suspended after independent testing exposed schema-13 activation defects
> in inherited systems. The corrected candidate now passes both the complete original
> Phase 23 gate and the additive successor-compatibility gate on one exact frozen
> candidate. The earlier candidate and evidence remain below as historical context.

## Verdict

**PASS.** The corrected schema-13 candidate satisfies the original Phase 23 contract
and the additive successor-schema compatibility contract. No Phase 23-scope blocker
remains in the exercised contracts. This document does not itself authorize merge,
push, deployment, release, or public distribution of rights-limited Companion artwork.

## Exact corrected candidate and revalidation

- `index.html`: `914912e7e5fd9767e9e9c758c5a48fd6ad785a73736e33c0511a4bcc248f54d8`
- `src/phase23-companion-catalog.js`: `48da84995d57d78ab01899b4f1840763b2539b4c5605da68ccc309889d0c718f`
- `src/phase23-companion-runtime.js`: `a79fac8ce19793bbc3a6d2f9df71f9f3826f5a250f5a63c664bd639fd972c78f`
- Original full Phase 23 static gate: **43 passed, 0 failed**.
- Original full Phase 23 browser gate: **207 passed, 0 failed**, twice.
- Successor package-only static gate: **16 passed, 0 failed**.
- Successor full static gate: **24 passed, 0 failed**.
- Successor browser gate: **27 passed, 0 failed**, twice.
- Candidate-realm console/page errors and native Web Storage accesses: **0**.
- Detailed addendum: `docs/PHASE_23_SUCCESSOR_COMPATIBILITY_QA_RESULT.md`.

## Historical pre-suspension frozen candidate

- Predecessor commit: `7cc8487e7f319ff6a763f8513f054df1a369a266`
- `index.html`: `aa272b3395e03175957b0d8a7ec20cee89d5cbdf75ed8b20b1e48ab62a2d73c1`
- `src/phase23-companion-catalog.js`: `48da84995d57d78ab01899b4f1840763b2539b4c5605da68ccc309889d0c718f`
- `src/phase23-companion-runtime.js`: `aa982463f5ecfdd0e79875de3c7d78ac21f5f55997d4289ed5d6554c1f4d21f5`
- `qa/phase-23-independent/checksums.sha256`: `0774dfe96ae4d2ae1b6a3a5fffb8c22d1c709934a81616da5d0135d2d06ed11f`
- `qa/phase-23-independent/realm.js`: `7ae2666157da9b636dc9b063425be1fab72e2761d5e1c31c0e8642c3b9e81d74`
- `qa/phase-23-independent/verify.mjs`: `4d801d9ca5b9107f304225809f00eb16334ea970f066ffb0bb85a19050068cf4`

## Historical pre-suspension evidence

- Full static candidate gate: **43 passed, 0 failed**.
- Frozen QA package checksums: **7 passed, 0 failed**.
- Browser gate, pass 1: **207 passed, 0 failed**.
- Browser gate, pass 2: **207 passed, 0 failed**.
- Additional evidence run: **207 passed, 0 failed**.
- Browser distribution: runner/fixture 5/5; 320×568 active 34/34; 390×844 active 57/57; 1024×768 active 34/34; 390×844 at 130% copy 34/34; 390×844 reduced motion 34/34; 390×844 production-inactive 9/9.
- Console and page errors: **0** on every recorded pass.
- Native Web Storage accesses in isolated realms: **0**.
- Historical Phase 6/11D/11F/11G/12/17/20–22 QA directories remain byte-frozen against the accepted predecessor.

## Independent review conclusions

- The exact 20-Companion order, all-owned/no-gacha policy, 2,200 aggregate base table, positional schema-12→13 migration, deterministic two-member Campaign pools, and versioned Tower order are enforced.
- Schema-12 history, the pending-offline boundary, the exact pre-v13 checkpoint, migration receipt, recovery journal, Previous-save restore, safe reset, and current schema-13 authority are authenticated and fail closed on malformed or future state.
- Migration, claims, offline settlement, recovery, and stale-client simulations remain exactly once. The invalid-mutation matrix rejects all 18 injected faults with zero writes and byte-stable active state, including a negative or replay-divergent pending-offline `capturedAt`.
- A frozen Tower-clear receipt and a frozen Tower-idle receipt both remain authenticated after a later genuine Phase 12→15 Companion reward claim. The claim applies Snorlax EXP +21, Dragonite shards +2, and Mastery +3 exactly once, survives reload, and rejects replay with zero writes.
- All 20 profiles, lazy thumbnails/full artwork, fail-closed crest fallback, focus return, touch sizing, overflow, 130% copy, reduced motion, tutorial skip/log/replay/reward neutrality, zero-write traversal, and inherited Phase 6/11D/11F/11G/12/17/20–22 behavior pass in the real browser gate.
- No fabricated Phase 23 runtime, fake helper surface, or production-inactive QA bridge was observed. The inactive realm requests and references no private Companion binary.

## Residual risks and release boundary

- Web Storage does not provide atomic compare-and-swap. The implementation uses rereads, revisions, raw identities, slot ownership, staging provenance, and storage events to narrow and detect stale-client races, but cannot eliminate the final platform-level reread-to-write interval.
- Browser evidence is Chromium-based. Real-device and Safari-specific behavior remains outside this gate.
- Persisted identities provide deterministic integrity and lineage checks; they are not a cryptographic trust boundary against a malicious local actor.
- Companion portraits remain private-build-only. Public/tracked builds must continue to fail closed with the crest fallback unless separate public distribution rights are established.

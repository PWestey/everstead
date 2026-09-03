# Phase 23 independent Companion-migration gate

This additive QA package verifies the real Phase 23 private candidate. It does not install a fake Companion engine and fails closed when `window.__EVERSTEAD_PHASE_23_QA__` is absent or does not match `phase-23-independent-qa-v1`.

Run the package/contract checks while production integration is in progress:

```sh
node qa/phase-23-independent/verify.mjs --package-only
```

Run the full static candidate gate after the Phase 23 runtime is present:

```sh
node qa/phase-23-independent/verify.mjs
```

Serve the repository root and open `qa/phase-23-independent/`. The browser runner creates active realms at 320×568, 390×844, 1024×768, 130% copy, and reduced motion, plus an inactive realm. It uses isolated memory storage and deterministic time/IDs/random input; native Web Storage is instrumented and must remain untouched.

Coverage includes the exact 20-ID roster/order/source hashes/base table, all-owned/no-gacha policy, private-rights fail-closed guard, schema-13 positional migration, exact retry/recovery/checkpoint/lineage, frozen pre-migration history, pending-offline boundary, deterministic two-member Campaign pools and Tower order covering all 20, frozen Tower-clear and Tower-idle receipts surviving a later real Companion EXP/shard/Mastery claim and reload, derived roster/Codex counts, all 20 real profiles, lazy thumbnails/full art/fallback, exact focus return, 44px targets, overflow, 130% copy, reduced motion, zero-write traversal, tutorial skip/log/replay/reward neutrality, and inherited Phase 6/11D/11F/11G/12/17/20–22 behavior.

Historical QA packages remain byte-frozen. Passing this package authorizes only a local private candidate; it does not authorize merge, push, deployment, public release, or artwork distribution.

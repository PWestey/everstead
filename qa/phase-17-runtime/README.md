# Phase 17 runtime-focused verification

This focused verifier checks the new modular Book I definition/runtime seam without replacing the independent Phase 17 gate.

Run:

```sh
node qa/phase-17-runtime/verify.mjs
```

It validates the exact story/cast/facility/tutorial registries, strict successor-state rejection, the two narrow `index.html` script seams, private-candidate versus public-release separation, coordinator-only mutations, Chronicle/replay neutrality, manual Phase 15 finalization, and the separate `player.wayfarer` Campaign fallback.

Real DOM, browser storage, focus, mobile overflow, and reduced-motion computed-style behavior remain the authority of `qa/phase-17-independent/`.

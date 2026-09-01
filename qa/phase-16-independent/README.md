# Phase 16 independent Restaurant gate

This package is an implementation-independent release gate for Phase 16. It treats the accepted Phase 15 physical Village board, trusted Phase 12 finalizer coordinator, Phase 13 story/tutorial/cast bridge, and Phase 15 V2 claim archive as inherited seams. It does not implement or tune Restaurant production code.

Run the package contract without production requirements:

```sh
node qa/phase-16-independent/verify.mjs --package-only
```

Run it against the current candidate:

```sh
node qa/phase-16-independent/verify.mjs
```

For live isolated testing, serve the repository root over HTTP and open `qa/phase-16-independent/`. The runner automatically executes five realms: 320×568, 390×844, 1024×768, reduced motion, and 175-percent copy. Every realm uses a distinct memory-backed storage adapter with explicit destructive-QA attestation; native `localStorage` is instrumented and must remain untouched.

The production candidate must expose `window.__EVERSTEAD_PHASE_16_QA__` only to a locally/query-gated trusted QA realm. The bridge contract is frozen in the companion contract document. The exact base intentionally has no Phase 16 bridge, so it fails closed at the bridge boundary rather than attempting destructive operations.

The live gate directly queries actual DOM nodes for the Restaurant hotspot and sheet, target size, viewport containment, focus movement/return, keyboard activation, Escape, required controls, overflow, copy expansion, and reduced-motion styles. Normalized bridge output covers save-state and deterministic lifecycle semantics; it is not a substitute for the actual-DOM checks.

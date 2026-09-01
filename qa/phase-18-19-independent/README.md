# Phases 18–19 independent Apothecary and Schoolhouse gate

This QA-only package gates two distinct Village activities against the accepted Phase 18–19 design and predecessor claim/facility/story seams. It does not implement, emulate, tune, or enable either production activity.

Run the package/design contract without requiring production runtime:

```sh
node qa/phase-18-19-independent/verify.mjs --package-only
```

Run it against the current production candidate:

```sh
node qa/phase-18-19-independent/verify.mjs
```

For live testing, serve the repository root over HTTP and open `qa/phase-18-19-independent/`. The runner executes five isolated realms: 320×568, 390×844, 1024×768, 130-percent copy, and reduced motion. Every realm uses a distinct memory-backed storage adapter with explicit destructive-QA attestation. Native `localStorage` is instrumented and must remain untouched.

The production candidate must expose locally/query-gated `window.__EVERSTEAD_PHASE_18_19_QA__`. The exact preimplementation base has no bridge, so candidate and live verification fail precisely at that boundary without attempting destructive calls or substituting a fake facility engine.

Actual-DOM checks query the real candidate's Village board, Apothecary/Schoolhouse hotspots and sheets, action controls, dimensions, overflow, focus, keyboard activation, Escape, copy expansion, and reduced-motion styles. Normalized bridge output covers state and deterministic lifecycle semantics but cannot substitute for these node/style checks.

The gate also freezes `player.wayfarer` as a separate Player Character outside Fellow, Family, and Companion roster/assignment/shard systems. Facility sheets must remain semantically restylable for original Everstead visual polish without ingesting reference assets, copying trade dress, or using full-background profile art as an unframed Village dialogue speaker.

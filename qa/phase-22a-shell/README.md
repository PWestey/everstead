# Phase 22A shared-shell source gate

This QA-only package freezes the Phase 20/21 bridge at commit `810b9ea223cce5444c08f28b596173d2f78a334b` and validates the uncommitted Phase 22A presentation candidate without changing production code.

It checks the cache-versioned stylesheet identity, exact parent `index.html` after removing that include, the exact five navigation destinations, 44px target and focus rules, distinct Phase 20/21 `READY` / `ACTIVE` / `CLAIM` truth, responsive and reduced-motion coverage, and the inactive production boundary.

Run from the repository root:

```sh
node qa/phase-22a-shell/verify.mjs
```

Actual DOM geometry, focus/Escape behavior, visual traversal neutrality, copy scaling, reduced motion, and inactive-production behavior are covered by `qa/phase-22a-independent`.

# Phase 24E current-schema shell gate

This additive successor gate protects the Phase 24E shell ownership cleanup without weakening the Phase 24D Limited Public Preview boundary.

The static verifier removes the three explicit Phase 24E marker blocks—styles, controller, and ownership—and requires the remaining `index.html` bytes to equal exact predecessor `8544a70586a21504a377cea6cb578c461f2463cd`. It also verifies the frozen Phase 24D evidence package, the one controller identity, direct final shell assignments, and the absence of another Phase 24E alias chain.

The Chromium matrix reuses Phase 24D's production-action save builder. Fresh, public-established, foundation-thin, and public high-investment saves run on ordinary non-QA URLs at 320×568 and 390×844. Every journey proves:

- one controller owns the top bar, primary navigation, and all four Fellowship tabs;
- each click increments exactly one controller counter and produces a new render identity;
- roster switches preserve unique, correctly ordered identities without stale cards, including all six Relics on schema 14;
- navigation, roster switching, rendering, and scrolling leave the exact persisted bytes, revision, resources, receipts, and journals unchanged;
- the visible Everstead brand, resources, collect action, 44px targets, overflow, real scrolling, 130% text stress, reduced motion, and console remain healthy.

Run:

```sh
npm ci
npx playwright install chromium
npm run qa:phase24e-shell
node qa/phase-24e-shell/verify.mjs
```

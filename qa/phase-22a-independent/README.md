# Phase 22A independent actual-DOM gate

This QA-only browser gate loads the real candidate through isolated in-memory storage. Its active realms use the accepted Phase 20/21 QA bridge only to prepare deterministic presentation states before the baseline; the measured traversal itself performs no save or reward operation.

Coverage includes:

- exact five-route navigation and 44px live targets;
- distinct Phase 20/21 `READY`, `ACTIVE`, and `CLAIM` board truth;
- visible focus, modal entry, Escape, and exact focus return;
- no horizontal overflow and no visible primary CTA covered by fixed navigation;
- cache-versioned source/load identity, including the loaded stylesheet byte hash;
- reward- and save-neutral roster-modal focus/Escape coverage, followed by a fresh baseline proving zero storage writes, raw-save changes, revision changes, or reward changes across the exact five-screen visual traversal;
- 320×568, 390×844, 430×932, 768×1024, 1024×768, 130% copy, and reduced motion;
- a separate inactive-production realm with no QA bridge or Phase 20/21 activation.

Run a static server at the repository root and open `qa/phase-22a-independent/`. The page runs automatically. The companion static gate is:

```sh
node qa/phase-22a-independent/verify.mjs
```

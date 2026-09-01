# Phase 22B independent actual-DOM gate

This QA-only browser gate loads the real Phase 22B candidate through isolated in-memory storage. Its active realms use the accepted Phase 20/21 QA bridge only for deterministic setup before the measured baseline.

The source fixture is frozen to production commit `ddc129935eac809f106c2782bb63b0b138fe0ad0` and verifies the loaded index, Phase 17 runtime, and both cache-versioned Phase 22 stylesheets byte-for-byte.

Coverage includes:

- exact five-route navigation and all visible controls at least 44×44px;
- Fellowship tabs/rosters plus Fellow and Family full-art sheets;
- exactly one Campaign Wayfarer presentation and its distinct non-roster full-art profile;
- Campaign, Chronicle, and More / Save & Recovery surfaces;
- non-vacuous Legacy branches: incomplete and recorded feats, continuing progress, then an isolated mixed state with the queued resolution story deliberately completed before baseline and exact simultaneous Story-ready, Feat-ready, and Oath-claimed cards;
- visible focus, modal entry, Escape, and exact focus return;
- no horizontal overflow and no visible primary CTA covered by fixed navigation;
- cache-versioned Phase 22A and Phase 22B source/load identity;
- a fresh post-setup baseline proving zero storage writes, raw-save changes, revision changes, or reward changes throughout visual traversal;
- 320×568, 390×844, 430×932, 768×1024, 1024×768, 130% copy, and reduced motion;
- a separate inactive-production realm with no QA bridge or Phase 20/21 activation.

Run a static server at the repository root and open `qa/phase-22b-independent/`. The page runs automatically. The companion static gate is:

```sh
node qa/phase-22b-independent/verify.mjs
```

# Phase 24L-B3B · Compact Legacy and truthful Inventory QA

This additive gate verifies the compact four-tab Legacy dialog and a read-only Inventory projection without introducing a second inventory, claim, reward, or persistence authority.

The gate checks:

- exact additive installation after the released Phase 24L-B3A index;
- schema 15, the current storage namespace, and the existing release identity remain unchanged;
- Materials contains only banked Fellow EXP and Relic Stones, Gifts contains the one existing Gift pool, Shards contains every current Fellow/Family/Companion entry, Relics contains owned one-copy Relics only, and Keepsakes is truthfully empty;
- 3×3 paging at 320×568 and 4×3 paging at 390×844;
- inventory categories, paging, selection, detail dismissal, opening, and closing are byte/revision/write neutral;
- Legacy has exactly Tracks, Feats, Ready, and History with one live panel and inherited exact-once Phase 13 claim controls;
- Phase 18/19 achievement records are not presented as claimable;
- labelled dialogs, roving keyboard focus, Escape behavior, focus return, 44 px targets, viewport fit, and zero browser warnings/errors;
- one real manual Legacy claim in isolated memory storage commits once and a detached-control retry is write-neutral;
- the isolated realm never touches native Web Storage.

## Commands

```sh
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-24l-b3b-legacy-inventory/verify.mjs
```

```sh
EVERSTEAD_PLAYWRIGHT_MODULE=/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs /Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-24l-b3b-legacy-inventory/browser.mjs
```

The browser suite serves the repository locally, boots each phone viewport in an iframe, and supplies a distinct in-memory storage adapter explicitly attested for destructive QA. Native Web Storage is trapped. Boot and fixture setup establish baselines; presentation-only checks then compare exact active raw bytes, revisions, and write counts.

## Stable hooks

- runtime: `EVERSTEAD_PHASE24L_LEGACY_INVENTORY`
- install result: `__EVERSTEAD_PHASE24L_B3B_RESULT__`
- More launches: `data-phase24l-b3b-launches`, `data-phase24l-b3b-inventory-open`
- Inventory: `data-phase24l-b3b-inventory`, `data-phase24l-b3b-category`, `data-phase24l-b3b-grid`, `data-phase24l-b3b-item`, `data-phase24l-b3b-detail`
- Legacy: `data-phase24l-b3b-legacy`, `data-phase24l-b3b-legacy-tab`, `data-phase24l-b3b-legacy-panel`

Production may project state and move already-bound Legacy cards. It must not synthesize ownership, clone live action nodes, or add a new claim path.

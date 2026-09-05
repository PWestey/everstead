# Phase 24L-B2 · Fellowship and Adventure game-screen QA

This additive gate verifies the first destination-level Everstead game-screen shell. It treats the supplied Isekai: Slow Life screenshots only as spatial references and tests Everstead's original presentation, current controllers, and current art.

The gate verifies:

- a presentation-only runtime and stylesheet installed after Phase 24L-B1 without changing the schema, storage namespace, economy, rewards, progression, or roster;
- a fixed top resource rail, fixed five-destination dock, and document-scroll lock at 320×568 and 390×844;
- a direct Fellowship portrait gallery whose portrait grid is the only scrolling area;
- the released 18 Fellows, 20 Family members, 20 Companions, and 6 Relics, with the four existing roster controllers still keyboard-operable;
- profile open/close behavior that preserves the gallery's internal scroll position;
- one exclusive local panel, repeat-to-collapse behavior, Escape dismissal, 44 px controls, and save-neutral Tavi/Vex’ahlia guides;
- explicit inherited-control regressions proving NOTICE → MIGHT → PATH replaces the prior panel and a second PATH tap collapses every Fellowship panel/tab state;
- all four Adventure roads, their existing controls, exact disabled state, shared Claim Ready surface, route tabs, stage nodes, records, and repeat history;
- Wayfarer art/profile continuity and continued exclusion from collectible rosters;
- the Phase 24L-B1 rule that Campaign credits shared Fellow EXP without auto-leveling, followed by a separate explicit Level investment;
- zero warning/error console entries and zero native-storage access in the isolated QA realm.

## Commands

Static and source-authority gate:

```sh
node qa/phase-24l-game-screen-shell/verify.mjs
```

Live Chromium gate:

```sh
node qa/phase-24l-game-screen-shell/browser.mjs
```

The browser suite serves the repository locally and embeds Everstead in isolated iframes backed by memory storage. An explicitly authorized fixture realm uses the existing query-scoped Phase 24L-B1 bridge only for the measured Campaign and EXP-wallet regression and current-route mapping. A second public presentation realm boots its own fresh save without destructive QA authorization and verifies all four Fellowship rosters, the public Companion crest fallback, local-panel behavior, Wayfarer continuity, and zero console/request failures. This separation matters because destructive QA authorization also enables rights-limited private Companion artwork in the inherited production contract; those private files are intentionally absent from this public worktree. The authorized route pass permits only those exact private Companion portrait 404s and fails on every other runtime/request error; the public presentation pass permits none. Native Web Storage is trapped in both realms, and any access fails the suite.

The `campaign-ready` fixture begins at Player Rank 3. Its authoritative Campaign adapter is used to prove that an eligible run credits the shared Fellow EXP wallet without changing Fellow EXP or Level; a separate `partial-affordable` fixture then proves explicit investment. The visible Action control is independently checked to remain the real bound production button after reparenting. At Rank 3, Fellow Campaign, Companion Campaign, and Companion Tower must map through the current route controller, while Fellow Expedition remains visible and correctly locked until Rank 5. The intentional gameplay writes are isolated and measured separately from presentation-only navigation.

## Stable presentation hooks

- runtime: `EVERSTEAD_PHASE24L_GAME_SCREEN_SHELL`
- read-only install result: `__EVERSTEAD_PHASE24L_B2_RESULT__`
- screen roots: `data-phase24l-game-screen="fellowship|adventure"`
- local docks, controls, and panels: `data-phase24l-local-dock`, `data-phase24l-local-tab`, `data-phase24l-local-panel`
- internal gallery scroller: `data-phase24l-roster-scroll`
- route guides: `data-phase24l-guide`, `data-phase24l-guide-open`, `data-phase24l-guide-close`

The new runtime may move existing DOM nodes after the inherited bind step. It must not clone or reimplement progression actions.

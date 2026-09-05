# Phase 24L-B3A · Compact Oaths and More QA

This additive gate verifies that Oaths and More behave like bounded mobile game hubs while retaining their existing bound controls and persistence authority.

The gate checks:

- exact additive installation after Phase 24L-B2, with schema 15 and the storage namespace unchanged;
- presentation-only source with no storage, economy, reward, progression, claim, random, timer, or network authority;
- the fixed top resource rail, fixed global navigation, fixed five-button local dock, and exact document-scroll lock at 320×568 and 390×844;
- the five Oath mappings (`Prepare`, `Work`, `Family`, `Rest`, `Manage`) and five More mappings (`Journey`, `Codex`, `Guide`, `Settings`, `Save`);
- one bounded local sheet, repeat-to-collapse behavior, Escape dismissal, and 44 px controls;
- Tavi and Shallan session-only guides, including replay and byte/revision/write neutrality;
- real-node reparenting for every Oath and More card, including a Phase 17 sibling reference when present;
- live New Oath, Edit Oath, completion, Wayfarer, Codex, preference, export, recovery, and global-navigation bindings;
- one measured real Oath completion that still commits through its existing authority after reparenting;
- zero warning/error console messages, failed requests, or native Web Storage access in the isolated realms.

## Commands

Static and persistence-authority gate:

```sh
node qa/phase-24l-b3a-compact-hubs/verify.mjs
```

Live Chromium gate:

```sh
EVERSTEAD_PLAYWRIGHT_MODULE=/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs node qa/phase-24l-b3a-compact-hubs/browser.mjs
```

The browser suite serves the repository locally and boots Everstead in an iframe backed by a fresh memory-storage adapter. Boot writes establish the baseline. Local dock navigation, panel dismissal, guides, New/Edit Oath modals, Wayfarer, and Codex are then required to leave the exact active raw bytes, revision, and write count unchanged. A real Oath completion is tested separately and must change the targeted Oath through the inherited persistence path; any established follow-on tutorial write remains owned by its predecessor. Native Web Storage is trapped and any access fails the suite.

## Stable hooks

- runtime: `EVERSTEAD_PHASE24L_COMPACT_HUBS`
- read-only install result: `__EVERSTEAD_PHASE24L_B3A_RESULT__`
- screen roots: `data-phase24l-compact-screen="oaths|more"`
- local dock, controls, and panels: `data-phase24l-compact-dock`, `data-phase24l-compact-tab`, `data-phase24l-compact-panel`
- session guides: `data-phase24l-b3a-guide`, `data-phase24l-b3a-guide-open`, `data-phase24l-b3a-guide-close`

The production runtime may move existing DOM nodes only after the inherited binder runs. It must never clone or reimplement a live action.

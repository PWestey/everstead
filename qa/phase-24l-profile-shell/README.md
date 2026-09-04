# Phase 24L-A — Viewport profile-shell verification

This gate verifies the schema-14, presentation-only profile-shell release that converts the Fellow, Family, Companion, and Wayfarer character sheets from long dashboards into art-first game screens with one local task sheet at a time.

It proves:

- the `index.html` integration is additive to the exact released Phase 24K predecessor;
- save schema, storage namespace, release identity, economy, rewards, progression, and roster state are unchanged;
- all four profile types expose exactly five context-local tabs while reusing the existing controls and calculations;
- tapping an active tab collapses it and switching tabs never leaves more than one sheet open;
- Escape collapses the local sheet before closing the profile, then returns focus to the invoking control;
- the top resource rail remains visible and opening a profile leaves the document at scroll position zero with both document axes locked;
- every one of the 20 profile panels fits without panel or content scrolling at 320×568, 390×844, and 430×932; emergency sheet scrolling is reserved for viewports below 500 px high;
- the sheet consumes at most 46% of the viewport or 360 px and preserves at least 34% of the viewport for character art, including a simulated 20 px bottom safe area on the smallest phone;
- every declared primary control is visible without scrolling, and Relic, Family Building, and Companion assignment controls are non-overlapping, center-point hit-testable, and at least 44 px;
- compact Overview, Bonds, Assignment, Mastery, Unlocks, and actual Family Building adapters are present and mapped to their local tabs;
- local tab focus follows Arrow/Home/End navigation, Tab remains trapped in the profile, and reduced-motion modes remove profile animation;
- opening, navigating, collapsing, and closing profiles are byte-, revision-, and storage-write-neutral.
- in a disposable browser context, applying the already-selected Family Building is a true write-neutral no-op, changing the assignment persists, and the original logical assignment is restored before disposal.

Run the focused checks with the bundled Node runtime:

```sh
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-24l-profile-shell/verify.mjs
/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-24l-profile-shell/browser.mjs
```

For a fast browser iteration, select one viewport and motion mode:

```sh
PHASE24L_VIEWPORT=phone-390x844 PHASE24L_MOTION=normal /Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/phase-24l-profile-shell/browser.mjs
```

Phase 24L-A intentionally does not introduce banked EXP. That stateful migration belongs to the separate schema-15 Phase 24L-B gate.

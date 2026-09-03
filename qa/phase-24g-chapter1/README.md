# Phase 24G-A · Chapter I Merchant Dispute QA gate

This additive gate covers only the public Chapter I Merchant Dispute slice: its intro, committed Stage 2 boundary, resolution, Chronicle entries, Village objective/tutorial handoff, western-plaza visual, and release-profile successor.

It deliberately rejects Legacy v2 activation, facility unlocks, reward additions, and activation of the full private Phase 17 Book I runtime. The five original Phase 13 scenes and the existing 1,500 / 750 / 500 Gold manual claims remain frozen.

## Run

```sh
node qa/phase-24g-chapter1/verify.mjs
node qa/phase-24g-chapter1/browser.mjs
shasum -a 256 -c qa/phase-24g-chapter1/checksums.sha256
```

The browser gate runs ordinary, non-QA journeys at 320×568 and 390×844 for fresh, established, Stage-2-already-cleared, foundation-thin, and high-investment saves. It checks watch, skip, replay, dialogue-log behavior, per-beat approved speaker art, the complete Chapter-change tutorial lifecycle across reload, exact Rank-2 narrative ordering, and a migrated Rank-1/Stage-1-clear path without exposing a QA bridge to the page under test. The historical-clear fixture is made underfunded and has all removable Companion and Relic support removed through normal roster and Village controls before its no-spend story path is exercised.

Compatibility coverage also boots authentic sparse v0.1 payloads whose schema marker is missing or explicitly null. Both must migrate through all protected checkpoints while preserving the exact original raw backup. Malformed JSON and explicit future-schema saves must instead remain byte-exact, write-free, recovery-routed, and free of the Phase 24G release card.

## Frozen boundary

Removing the three explicit Phase 24G marker blocks from `index.html` must reproduce exact predecessor commit `da16b52bcbf0bde8ba1c7e8261e66cbde73890c6`. Browser seed generation serves that exact predecessor `index.html`; its referenced pre-24G `src/` and `assets/` bytes come from the current tree, where the static gate freezes every authoritative predecessor source and proves that the projected page loads none of the four new Phase 24G files. The new sources, this gate, and the authoritative predecessor inputs are hash-frozen in `contract.json` and `checksums.sha256` after final verification.

## Future reconciliation boundary

Phase 24G-A writes only the existing Phase 13 story/Chronicle state and preserves dormant `storyV1` byte-for-byte. A future full Book I activation must reconcile these two Merchant Dispute scene resolutions and Chronicle status into any existing `storyV1` exactly once, without granting a second reward, erasing later Phase 17 progress, or reopening terminal tutorial state.

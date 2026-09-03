# Phase 24C-2D integration QA result

## Status

**PASS — FINAL IDENTITIES FROZEN.**

## Verified evidence

- Real Chromium: 78/78 rendered rows across three realms at both mobile sizes. The migrated-save realm used the ordinary non-QA URL, exposed no QA globals, and the live schema-14 validator returned no errors.
- Console: zero warning entries, zero error entries, and zero uncaught page errors.
- Static/package verifier: 71/71. Functional, structural, identity, production-storage-key, projection, syntax, and package assertions all passed.
- Historical projection: byte-identical to deployed predecessor `2770bb95a970eaef93db65fe4ade39172943fc5e` after removing the additive Phase 24C-2D blocks and reversing the bounded Phase 17 adapter and QA-fixture clock insertion.
- Storage isolation: the browser realms used only the injected memory adapter; native Web Storage access remained zero.

## Functional coverage

- Reward-neutral schema-14 activation and repeat-activation no-op.
- Exact `0/3` through `3/3` founding-recipe readiness.
- Real Village Restaurant hotspot, Phase 17 introduction, Watch path, and Phase 16 Restaurant operation.
- Visible manual claim, exact one receipt, 200 Restaurant basis points, result equation, and Return to Codex.
- Base-sale-only floor calculation, unchanged authored tip, pre-ready value preservation, and post-claim capture.
- Duplicate claim refusal with zero writes.
- Isolde ready lesson and Lyra claim lesson, discovery-gated tutorial log, claimed-lesson priority, CLOSE-only terminal replay, and duplicate-step/duplicate-receipt tamper refusal.
- 320×568 and 390×844 visible/touch/overflow/reduced-motion checks.
- Reload, Safe Reset, Previous-save rollback, save imports v1/v2/v3, and schema-12/schema-13 migration followed by the real production reload path.
- Foundation-thin zero-authority schema-14 compatibility: an ordinary non-QA boot stays playable, renders all 20 Family and all 20 Companions before and after a real Oath save, leaves navigation bytes/revision unchanged, retains empty Collection releases/claims/pools, and defers C2D instead of fabricating out-of-order Phase 12–21 receipts.
- Fresh and already-used foundation-thin saves can move from Fellowship to Family to all 20 Companions without an exception. Missing tutorial state is represented only by a defensive empty read view; no tutorial receipt or foundation is fabricated.
- Immediate migration replay validation permits only transient `ui` and Village `featured` differences from the authenticated active bytes. Persisted state, migration authority, and all other fields remain strict.
- Both pre-use and post-use roster navigation are save-neutral. The first real Oath completion advances the revision once, then subsequent Family/Companion navigation leaves those new active bytes unchanged.
- Shared monotonic save/transaction IDs across page realms and fixture-local clock normalization with zero storage writes.

The exact authority source and integrated `index.html` hashes are pinned in
`contract.json`; `checksums.sha256` closes the package. Commit, push, and live
GitHub Pages verification are recorded separately by the release owner.

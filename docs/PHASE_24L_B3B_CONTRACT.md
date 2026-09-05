# Everstead Phase 24L-B3B · Compact Legacy and truthful Inventory contract

## Objective

Give More two compact, game-like destinations: a four-tab Legacy archive and a paged Inventory. Both are presentation layers over released schema-15 state and released action authority.

## Locked Inventory truth

- `Materials`: shared Fellow EXP wallet and Relic Stones only.
- `Gifts`: the existing shared Gift pool only.
- `Shards`: one projection for every current Fellow, Family member, and Companion, including zero balances and locked Fellows whose balances are preserved.
- `Relics`: owned one-copy Relics only, with current level and current Fellow owner when equipped.
- `Keepsakes`: an honest empty state until a persisted keepsake system exists.
- Gold remains in the global resource rail. Pending offers remain with the system that owns them.
- Inventory adds no capacity, chest, combine, conversion, randomization, claim, purchase, or spending authority.
- Pages contain nine items at widths below 370 px and twelve items at 370 px or wider. The grid itself does not become a dashboard scroll lane.

## Locked Legacy truth

- Exactly four tabs: `Tracks`, `Feats`, `Ready`, `History`.
- There is one `tabpanel`; released Phase 13/22B cards are moved into it rather than cloned or reimplemented.
- `Tracks` contains continuing achievement progress.
- `Feats` contains the recorded/incomplete one-time feat surface.
- `Ready` contains only released Phase 13 ready offers with their real bound `data-phase13-claim` buttons.
- `History` contains released claimed receipts.
- Phase 18/19 achievement readiness records are not claim offers and must not receive buttons in this gate.
- Claim buttons remain individual, manual, non-expiring, exact-once actions through inherited authority.

## Integration and accessibility

- Install additively after Phase 24L-B3A and before the Phase 24L-B1 QA bootstrap.
- Wrap the current `bindCommon` and `bindModal` slots; invoke the inherited binder first.
- Defer Legacy decoration one task so Phase 22B has finished assigning canonical categories and labels.
- Dialogs retain the released role, modal semantics, focus trap, close path, Escape handling, and focus return.
- Category tabs use roving focus and Arrow Left/Right, Home, and End.
- Every direct control is at least 44×44 CSS pixels.
- At 320×568 and 390×844, each dialog fits the viewport without document scrolling. Only the explicit Legacy panel may scroll locally when its released content requires it.

## Persistence boundary

Phase 24L-B3B does not change schema, storage keys, save bytes, economy, progression, rewards, roster ownership, or claim authority. Module-local tab, page, and detail selection are disposable session presentation state. Opening, paging, selecting, dismissing, routing, and closing must not write a save.

## Release gate

- Static contract passes twice at the exact candidate.
- Chromium passes twice at 320×568 and 390×844 with zero warning/error console entries and no failed assets.
- Browser evidence proves the exact two/one/58/owned-only/zero category projection.
- Browser evidence proves one live Legacy panel, correct categorization, no Phase 18/19 claim exposure, and a real exact-once manual claim in isolated storage.
- Phase 24L-B1, B2, and B3A behavioral regressions pass; only their deliberately superseded current-artifact identity assertions may fail.
- Independent review finds no B3B-scope blocker.

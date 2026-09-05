# Everstead Phase 24L-B3B result

Status: passed implementation, additive QA release gate, and root verification; final merge remains with the coordinating thread.

Phase 24L-B3B adds a compact Legacy archive and a truthful read-only Inventory projection. It introduces no new save, economy, reward, progression, item, or claim authority.

## Candidate scope

- `src/phase24l-legacy-inventory.js`
- `src/phase24l-legacy-inventory.css`
- additive `index.html` load and install ownership block
- `qa/phase-24l-b3b-legacy-inventory/`

## Delivered

- More now exposes `Legacy` and `Inventory` as compact 44-pixel launch controls inside the existing permitted page-head layer.
- Legacy has exactly four roving tabs: Tracks, Feats, Ready, and History. It keeps one live tabpanel and moves the released Phase 13/22B cards and claim buttons rather than cloning them.
- Inventory has exactly five roving tabs: Materials, Gifts, Shards, Relics, and Keepsakes. Its pages contain nine items below 370 px and twelve items at 370 px or wider.
- Inventory truth is derived only from the current save and definitions: two material pools, one shared Gift pool, all 58 roster shard balances, owned one-copy Relics, and an honest empty Keepsakes state.
- Presentation state is module-local. Opening, changing tabs, paging, opening item detail, dismissing detail, routing, and closing do not alter raw save bytes, revision, or storage-write count.

## Automated verification

- Phase 24L-B3B static/source-authority gate: `32 passed, 0 failed`, twice on the final candidate.
- Phase 24L-B3B live Chromium gate: `48 passed, 0 failed`, twice on the final candidate.
  - 320×568: `24 passed, 0 failed` per run.
  - 390×844: `24 passed, 0 failed` per run.
- JavaScript syntax check: passed.
- Phase 24L-B1 shared Fellow EXP static regression: `95 passed, 0 failed`.
- Phase 24L-B2 static regression: `31 passed, 1 failed`; the sole failure is its deliberately superseded additive-index identity assertion.
- Phase 24L-B2 live regression: the 320×568 half passed `33/33`; a targeted final 390×844 rerun passed `33/33`, and root independently repeated that public-and-authorized journey at `33/33`.
- Phase 24L-B3A static regression: `32 passed, 1 failed`; the sole failure is its deliberately superseded additive-index identity assertion.
- Phase 24L-B3A live Chromium regression: `48 passed, 0 failed` across both required phone sizes.

The older B1 browser presentation journey is not a current B3B release gate: it predates B2 and tries to click the original `[data-fellow]` button after the released B2/24K roster owner has intentionally hidden that node. B1's pure mechanics, authority, integration, and current-source regression remain covered by its `95/95` static suite, while the current Fellowship screen is exercised by the B2 and B3A browser gates.

## Browser evidence

The final isolated-memory journeys prove:

- exact Materials projection: Fellow EXP and Relic Stones only;
- exact Gifts projection: one existing shared Gift resource;
- all 58 Fellow, Family, and Companion shard entries appear exactly once across pages (`12 + 12 + 12 + 12 + 10` at 390×844 and the corresponding nine-item compact pages at 320×568);
- Relics exactly match the save's `owned === true` one-copy set and never project unowned definitions;
- Keepsakes render zero item cards and explicitly state that no owned-keepsake authority exists;
- Legacy begins with one continuing Track, one incomplete Feat, one authentic ready Oath reward, and an empty History in the controlled fixture;
- a real Oath reward claim advances the save exactly once, moves Ready from one to zero, moves History from zero to one, and leaves a detached-control retry byte/revision/write neutral with receipt count still one;
- no Phase 18 or Phase 19 record receives a claim button;
- dialogs retain labels, modal semantics, one live panel, roving Arrow-key focus, Escape priority, close focus return, 44-pixel targets, viewport fit, and zero document scrolling;
- both mobile journeys complete with zero warning/error console entries, failed requests, or native Web Storage access.

## Corrections found during verification

The first 320×568 pass exposed that the launch cluster was inside a lower stacking context and could be covered by the B3A sheet. A first screen-level correction restored pointer access but appeared as an unowned top-level child to B3A. The final implementation places the compact horizontal cluster inside the existing permitted `.page-head`, before Guide, where it remains above the local sheet without overlapping it. Final B3A and B3B browser suites both pass at both sizes.

One initial B2 390×844 run transiently loaded the Wayfarer village cutout at zero size. An immediate isolated targeted rerun passed all `33/33`, and root independently repeated the same journey at `33/33`; no production correction was required.

## Candidate identity

- `index.html`: SHA-256 `e562f0cd63bdde61d1e40af98c4f29fc6346bbcebe8b17bc04ea853b37c8952f`, 2,088,727 bytes.
- `src/phase24l-legacy-inventory.js`: SHA-256 `bec5d620731443ceb344d3a50cb742230e4d527640d5805e7b60224886264492`, 18,325 bytes.
- `src/phase24l-legacy-inventory.css`: SHA-256 `b7a0683c7600dbb9805ac94beb9c846b5a120079f7a066b006b4ff182015c94d`, 8,728 bytes.
- `qa/phase-24l-b3b-legacy-inventory/contract.json`: SHA-256 `5230dfcebb24ba29745a90238c1b4ad7a27558c7a02513d46c8d58ba66f9ac4e`.
- `docs/PHASE_24L_B3B_CONTRACT.md`: SHA-256 `4e1c469cef26f1da95e29f9acbbd1ec5d81ec85573beafcd621b4e5e526cb058`.

## Known boundaries

- Inventory is a projection, not a persisted bag. Keepsakes remain empty until a real system exists.
- Gold and unclaimed rewards remain on their established surfaces.
- Only established Phase 13 Legacy offers are claimable. Phase 18/19 achievement records remain non-claimable.
- Compact Legacy reuses existing cards and handlers, including their exact-once receipts and focus lifecycle.
- Relic projection truth is defined by current ownership. The controlled fresh-save browser fixture has no owned Relics, so the gate proves an exact empty match plus static `owned === true` filtering; it does not mint a Relic merely to populate the view.

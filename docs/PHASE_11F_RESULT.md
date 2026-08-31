# Phase 11F result — starting roster and portrait presentation

Status: implementation complete; local release gate and live mobile review passed.

## Outcome

Everstead now starts with 18 Fellows, 20 Family members, and the existing two Companions. The former visible Fellow and Family presentation has been replaced by the supplied art roster. Existing player progress is preserved through stable internal IDs for the first six Fellows and first three Family members; those legacy IDs are an intentional save-compatibility detail and are not shown as the old characters in the interface.

Roster cards, Village comments, celebration surfaces, and Codex entries use cropped thumbnail portraits. Selecting a Fellow or Family member opens the optimized full portrait edge to edge for one complete viewport before the progression details below it.

## Asset delivery

- Added 38 optimized full-size WebP portraits and 38 matching WebP thumbnails.
- Added `assets/portraits/manifest.json` as the exact 18-Fellow/20-Family presentation manifest.
- Moved the Village, Adventure, and Companion raster atlases out of `index.html` into external assets.
- Removed all embedded raster data URLs from the application document.
- Reduced `index.html` from roughly 18.8 MB to 983,701 bytes. The complete external asset tree is 80 files and 8,715,341 bytes.
- Roster and Codex thumbnails lazy-load. Full profile art loads at profile-open time with a visible fallback if an image cannot load.

## Save migration

Save schema 12 introduces `rosterProfile`, the expanded Fellow and Family maps, expanded drop and progression maps, and a write-once byte-exact pre-v12 checkpoint.

The schema-11-to-12 migration:

1. authenticates the released schema-11 predecessor;
2. retains its exact bytes in the pre-v12 slot;
3. preserves every existing Fellow and Family progression object without reinterpretation;
4. appends the new roster entries at their fresh starting values;
5. expands affected idle, shard, ledger, receipt, and baseline maps; and
6. records an authenticated migration receipt and roster activation snapshot.

Missing-active recovery from an authenticated pre-v12 checkpoint, interrupted staging recovery, recovery export, fixture installation, diagnostics, and safe reset now include the fourteenth protected slot. Invalid schema-11 input is retained without writes.

## Feedback incorporated

- Fellow and Family titles now appear in the Codex.
- Main-screen navigation returns to the top only when the destination changes and remains save-neutral.
- At 320px, Codex tabs use a two-column, three-row grid.
- Claim Ready remains compact for the safe zero- or one-lane state and expands for blocked, multi-lane, terminal, or persistence-warning states.
- Prosperity/HQ thresholds and roster catch-up rates remain deliberately unimplemented pending their design decisions.
- Broader wrapper/module consolidation remains a separate structural phase; Phase 11F changes only the seams required for roster art, schema 12, and the requested daily-use refinements.

## Verification

- Phase 11F focused engine/UI probe: 34/34.
- Phase 11F successor repository gate: see `qa/phase-11f/verify.mjs` and `qa/phase-11f/current-manifest.json`.
- All 76 portrait files exist and match unique manifest paths.
- Fresh schema-12 boot, mutation, schema-11 migration, exact checkpoint retention, reload, missing-active recovery, invalid-source refusal, safe reset, and safe-reset reload pass.
- Live Chromium at 320×568 and 390×844: full-screen Fellow and Family art loaded at native resolution; no horizontal overflow; no missing portrait fallbacks.
- 320×568 Codex: two columns of 128px tabs; 18 Fellow titles rendered; thumbnail art loaded.
- 320×568 normal Claim Ready height: 103.5px.
- Main navigation reset a live scroll position from 832.5px to 0.

## Deferred and unchanged

This phase does not invent Prosperity/HQ thresholds, catch-up rates, new Companion art, advanced animation, or post-V1 systems. It also does not rename the historical local-storage namespace, because doing so would add migration risk without changing the visible Everstead brand.

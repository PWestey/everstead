# Phase 11H Result — Transparent Village Speakers

## Result

Phase 11H separates Village dialogue presentation from Fellow character-sheet presentation.

- The six Rank-1 Fellows now have verified alpha-channel Village cutouts.
- Zamorak, Darrow, and Star-Lord have approved later-rank cutouts ready for their Rank bands.
- Village speaker rotation uses only joined Fellows with an approved cutout.
- Fellow profiles continue to load the original full-background WebP files.
- The quote bubble no longer clips at 320-pixel width.
- No save schema, migration, transaction, economy, Campaign, or progression rule changed.

## Validation

- Phase 11G focused behavioral probe: 28/28.
- Phase 11H successor gate verifies application syntax, source separation, rotation filtering, asset existence, RGBA format, transparent pixels, dimensions, artifact size, and unchanged original portrait hashes.
- Live Chromium at 320×568 and 390×844: zero horizontal overflow and zero console warnings/errors.
- Twelve live Village rotations selected only the six joined cutout-ready starter Fellows.
- Live profile inspection confirmed the selected Fellow profile still used `assets/portraits/fellows/<art-id>.webp`.

## Product-handoff alignment

This is the neutral-cutout foundation described in the Everstead Product Handoff. It deliberately avoids preloading or manufacturing expression variants for the entire cast before the dialogue system proves its value.

## Residual risks and deferrals

- Nine current Fellows do not yet have approved Village cutouts and therefore do not rotate into the Village speaker slot.
- Transparent PNGs are larger than preferred transparent WebP; only one is fetched at a time.
- The broader story, Chronicle, Legacy, manual-claim, statistics, and exactly-once reward architecture remains the next structural product layer.
- Public distribution rights for the current cast and artwork remain unresolved.

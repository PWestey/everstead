# Phase 11H — Village Dialogue Cutout Contract

## Objective

Present Village speakers as transparent characters inside the Village scene while preserving the full-background portrait artwork on every Fellow character sheet.

## Scope

- Provide one neutral transparent cutout for the six Rank-1 Fellows.
- Preserve three already-approved later-rank cutouts for Zamorak, Darrow, and Star-Lord.
- Load only the current Village speaker cutout; do not preload the cutout library.
- Restrict Village rotation to joined Fellows with an approved cutout.
- Keep roster cards, Campaign art, celebrations, and full-screen Fellow profiles on their existing portrait paths.
- Keep schema 12, save migrations, economy, Campaign rewards, Rank access, and portrait originals unchanged.

## Asset paths

- Village speaker: `assets/portraits/fellows/village/<art-id>.png`
- Full character sheet: `assets/portraits/fellows/<art-id>.webp`
- Roster thumbnail: `assets/portraits/fellows/thumb/<art-id>.webp`

The paths are intentionally separate. A Village cutout must never replace or overwrite its corresponding full portrait.

## Rotation rule

The candidate set is the intersection of:

1. Fellows joined under the Phase 11G Rank contract; and
2. Fellows listed in the Phase 11H cutout allowlist.

If a saved featured Fellow has no cutout, the Village resolves to an available cutout-ready joined Fellow without changing the persisted save. Later cutouts can be introduced by adding the asset and approving its art ID in the allowlist.

## Do not break

- Full-screen profiles retain their original backgrounds and maximum available source resolution.
- Village navigation remains save-neutral apart from the existing neutral UI-view persistence.
- Missing art never causes a script failure.
- External image loading remains free of embedded raster data.
- The app remains usable at 320×568, 390×844, and wider layouts.
- Reduced-motion behavior remains unchanged.

## Deferred

- Expression variants and alternate clothing.
- Dialogue panels, scene logs, Chronicle playback, and story sequencing.
- Cutouts for Fellows who are not yet approved as Village speakers.
- Family dialogue cutouts until a Family member becomes an authored scene speaker.
- Public character and artwork authorization.

# Phase 24J · navigation art

Phase 24J adds decorative local bitmap art to Everstead's existing five-route bottom navigation. Five transparent icon images are composed over one full-width housing image through CSS pseudo-elements. The original route buttons, labels, glyphs, selected-state semantics, Adventure ready badge, and save-neutral navigation remain the fallback and interaction authority.

The housing image is decorative only. It cannot capture input or define route geometry. If decorative art is unavailable or disabled, the existing dark shell, visible text labels, glyphs, non-color selected marker, and all five route controls remain usable.

## Acceptance gate

- The exact accepted Phase 24I predecessor is pinned, and the only `index.html` delta is the cache-versioned Phase 24J stylesheet include.
- All five 256×256-or-larger transparent route icons and the 1024×242 housing image are local, correctly mapped, and within the release asset budget.
- Both 320×568 and 390×844 ordinary public realms load all six assets without request or console failures.
- The five labels and fallback glyphs remain real legible text. Art uses no added DOM image, route, state, or persistence authority.
- Every route remains at least 44×44, tappable, correctly selected, within the viewport, and free of icon/label/button overlap.
- Selected state retains a non-color shape marker; the Adventure claim badge remains compatible and above the decorative layer.
- Disabling all decorative images leaves the five routes, labels, glyphs, housing fallback, and active state usable.
- Normal navigation and decorative fallback are byte-, revision-, and write-neutral.
- System and in-app reduced-motion modes remove art transitions.
- No horizontal overflow or warning/error console output occurs.

Run from the repository root:

```sh
node qa/phase-24j-navigation-art/verify.mjs
node qa/phase-24j-navigation-art/browser.mjs
```

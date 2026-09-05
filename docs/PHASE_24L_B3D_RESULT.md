# Everstead Phase 24L-B3D result

Status: PASS — independently reviewed and release-ready.

Base: `03afa4d36391c08870316e174645e15c3ce5fb0c`

Phase 24L-B3D converts the existing private Apothecary and Schoolhouse dialogs into compact, bounded mobile game sheets. It introduces no new save, economy, reward, progression, tutorial, facility, or claim authority.

## Delivered

- Apothecary presents Case, Diagnose, Remedy, and Result as four local tabs beneath its existing Village-art scene.
- Schoolhouse presents Pupils, Lesson, Teach, and Result as four local tabs beneath its existing Village-art scene.
- Existing bound activity, evidence, choice, pupil, lesson, mentor, reward, and action nodes are moved after their inherited binder runs; none are cloned or reimplemented.
- Lifecycle-aware routing follows the next meaningful player step and survives ordinary full-modal rebuilds in session-only state.
- Inactive panels are hidden, inert, and removed from keyboard navigation.
- Arrow keys, Home, and End operate each roving tab set without touching the save.
- Backdrop dismissal delegates to each facility's canonical close button so ephemeral visit/tutorial cleanup and exact hotspot focus return remain intact.
- Both facilities retain their pre-existing story and private-release gates.

## Verification

- B3D static contract: 31/31 passed.
- B3D Chromium interaction and layout gate: 84/84 passed twice across 320×568 and 390×844, with zero warning/error console entries.
- Public-production gate: 1/1 passed. The Phase 18/19 QA bridge was absent, no private sheet was decorated, and both Apothecary and Schoolhouse hotspots remained disabled behind their existing release gates.
- Combined independent review: 116/116 passed with no implementation, accessibility, mechanics-boundary, or release-gate blockers.
- Phase 24L-B3C regression: 56/56 passed.
- Phase 24L-B3B regression: 48/48 passed.
- Phase 24L-B3A regression: 48/48 passed.
- Phase 24L-B2 regression: 66/66 passed on the authoritative standalone rerun.
- Phase 24L-B1 static regression: 95/95 passed.

The independent review specifically confirmed pointer and keyboard focus continuity, inactive-panel isolation, corrected-diagnosis routing, 44-pixel touch targets, bounded mobile layouts, exact one-write transitions, no early rewards, exactly-once claims, canonical backdrop/Escape dismissal, exact Village-hotspot focus return, and the presentation-only boundary.

## Release-candidate hashes

- `index.html`: `c3eb746be66c930d9a0909b305f37dc4c3c18ad601bf2d2e0ee6d8c89d2fb718`
- `src/phase24l-private-facility-modals.js`: `b04532b72c65531fcae322a2eeba5e70fec8dcd9468259535b0a2c0b3fd59f2f`
- `src/phase24l-private-facility-modals.css`: `ab0c61a43ced214d4ea7f37fb942f4e6da3a400ada78db5928825e5cc15775ac`
- Static verifier: `66a3cc9f1fed164fe46dd0e823ab1913db34712371ee8ee55e379a2889b6990a`
- Browser verifier: `f7789bb6de1a109cf7cac10bdb64b76fe91e549e0f60d044f0d49e7ef7e306eb`
- Production verifier: `7e33263ca4263b66d20298bfa54d2b60b03e04b6501ebc189799fdeb4446184f`
- Frozen Phase 18/19 runtime: `26686c97cc7c2a617224b8a287ab92933222e137c53bc309dedad6102d68df2e`
- Frozen Phase 20/21 presentation runtime: `1bfefa4e148e6c4a7d5a27641dcfeaa8880b6c7f56c87fc023c01f69f8fcb3fd`

## Known boundaries

- B3D changes presentation only; it does not make the Apothecary or Schoolhouse publicly discoverable.
- The shared action dock intentionally remains visible below all four panels because its controls reflect one authoritative facility lifecycle.
- Selected tabs are session-only presentation state and reset on reload.
- Browser automation targets Chromium; Safari and physical-device verification remain later release checks.

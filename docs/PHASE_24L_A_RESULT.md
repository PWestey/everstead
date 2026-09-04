# Phase 24L-A — Profile Shell Result

**Verdict:** PASS  
**Base:** `fb1eff823681b4180c78eb25e222010860176bd2`  
**Save schema:** 14, unchanged  
**Scope:** Presentation only

Phase 24L-A converts Fellow, Family, Companion, and Wayfarer profiles into viewport-bounded, art-first game screens. Each profile has five context-local controls, one optional lower task sheet, repeat-to-collapse behavior, and no normal-size document or sheet scrolling. Existing progression, economy, actions, artwork, and persistence remain authoritative.

## Final evidence

- Static contract: **38/38 passed**.
- Full live Chromium matrix: **553/553 passed** across 320×568, 390×844, and 430×932 in normal and reduced-motion modes.
- The 320×568 run includes a simulated 20px bottom safe area.
- Phase 24K behavioral regression: **93/93 passed**.
- Phase 24K's prior static gate remains 17/18; its only failure is the intentionally superseded additive current-artifact identity.
- Independent review: **PASS**, including a fresh **38/38** static run and **91/91** targeted 320×568 live run.
- `git diff --check`: clean.

## Verified boundaries

- All 20 local profile panels fit without normal-size scrolling.
- Declared primary actions are initially visible.
- Relic, Family Building, and Companion Assignment controls are non-overlapping, center-point hit-testable, and at least 44 CSS pixels.
- Applying the already-selected Family Building is a write-neutral no-op; changing it uses the existing transactional path.
- Arrow, Home, and End navigation maintain exactly one roving tab stop.
- Escape collapses a local sheet before closing the profile and restores focus.
- Opening, switching, collapsing, and closing profiles is byte-, revision-, and storage-write-neutral.
- The Wayfarer remains outside all collectible rosters and Power calculations.

## Next gate

Phase 24L-B0 is a separate schema-15 migration. It will introduce zero-balance Fellow and Companion EXP wallets and expanded durable-save topology without changing any current character investment or reward. No banked-EXP mechanics are included in this presentation release.

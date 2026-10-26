# Working rules for Everstead

Everstead is a habit tracker inside a cozy village game. DESIGN.md is the source of truth for every
rule and number. Read it before changing gameplay.

## The rules that keep this project from repeating Oathforge and Everkai

1. **Every game system is fed by real habits.** Before adding anything, say which habit input drives
   it. If none does, don't build it.
2. **No parity goals.** Everstead borrows Everkai's look, not the original game's numbers. Never import
   formulas, tables or data from the original.
3. **Formulas stay one line.** All of them live in `lib/game.mjs` under "Formulas". If a change needs a
   paragraph to explain, simplify it instead. Update DESIGN.md in the same change.
4. **The roster grows slowly.** Several Fellows and Family per life area (see `lib/cast.mjs`). New characters only
   when the owner asks and has art for them. Dialogue follows docs/WRITING-BRIEF.md.
5. **The owner picks the cast.** Characters arrive as the owner's own art, one per life-area slot.
   Don't add characters, art or franchises on your own.
6. **Art is still images.** No idle motion. No video, no Spine, until
   the owner decides otherwise.

## Code

- Knowledge cards (the Codex) live in `lib/codex-cards.json`; the owner adds new knowledge through Claude. Keep the id rule
  in `lib/codex.mjs` so review progress stays attached.
- After adding or changing cast art, run `node scripts/art-bounds.mjs` (records each figure's bounds so the character
  screen can zoom wide poses to fill the stage). A test fails if a portrait has no bounds.
- Companions live in `lib/companions.mjs` (lines, art ids, formulas); art is made by `scripts/companion-art.mjs` (needs sharp: copy it into the imgtools folder next to this repo and run it there).
- `lib/cast.mjs` world data, `lib/game.mjs` formulas and actions, `lib/habits.mjs` the journal,
  `lib/stories.mjs` scenes. Screens in `app/`; `page.tsx` wires them.
- The UI reuses Everkai's class names and `app/globals.css`. Put new styles in `app/everstead.css`. The RuneScape look (stone, parchment, gold rivets) is `app/theme-rs.css`, loaded last; its tokens are in `app/rs.css`.
- Saves are localStorage key `everstead-save-v1`. A change that adds a required field must keep old
  saves loading (`decode()` merges defaults from `fresh()`), or bump `SAVE_VERSION` with a migration.

## Checks

`pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build`. All three run in CI before every deploy.
Tests for game rules go in `tests/game.test.mjs`. UI changes: check in the browser at phone width.

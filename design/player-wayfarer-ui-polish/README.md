# Player Wayfarer and UI polish design package

## Status

Design, asset provenance, rollout, and independent QA contract only. No production HTML, CSS, JavaScript, save schema, mechanics, economy, navigation, merge, push, or deployment is changed.

The exact integration base is `70201ab52e6e3510747bee1a977794a8c900bdd1`.

## Outcome

This package establishes `player.wayfarer` as Everstead's canonical title character and defines a coherent screen-by-screen polish pass without importing another game's trade dress or mechanics.

The Wayfarer is:

- the player's profile/title identity;
- linked to the existing `player.rank` and `player.rankExp` progression;
- present in authored story, dialogue, and Campaign presentation;
- visually distinct from Fellows, Family, and Companions;
- never a roster entry, shard target, rarity unit, Building assignee, or Companion assignment target.

The supplied 1024×1536 RGB full-background art is preserved byte-for-byte at `assets/player/wayfarer-profile-full.png`. A transparent dialogue cutout and Campaign walking sprite are deliberately unresolved. The two failed checkerboard-baked derivatives are not in this package.

## Files

- `REFERENCE_ANALYSIS.md` — source-by-source extraction of general presentation lessons and explicit rejection of literal mechanics/trade dress.
- `PLAYER_WAYFARER_CONTRACT.md` — identity, asset, state, story, Campaign, dialogue, accessibility, and fallback contract.
- `UI_VISUAL_SYSTEM.md` — original Everstead visual language and screen-by-screen requirements.
- `ROLLOUT_PLAN.md` — implementation order, tutorial impacts, dependencies, and rollback gates.
- `INDEPENDENT_QA_CONTRACT.md` — fixture, static, actual-DOM, accessibility, state-neutrality, and regression gates.
- `asset-provenance.json` — exact source hashes, approved uses, unresolved variants, and reference-only metadata.
- `screen-contracts.json` — machine-readable screen, navigation, viewport, and forbidden-pattern contract.
- `qa-fixtures.json` — deterministic candidate-independent QA scenarios.
- `validate.py` — package integrity, asset identity, cross-reference, and forbidden-mechanic validator.

## Non-goals and explicit rejections

- no Fellow Building staffing; Family remains the Building assignment roster;
- no Blessing track;
- no employee-count economy;
- no copied currency, inventory, combine, or daily-task systems;
- no sixth navigation tab;
- no daily checklist;
- no screenshot asset ingestion or literal copy of names, icons, frame shapes, colors, wording, or layout;
- no gameplay, reward, save, claim, Rank, roster, or facility semantic changes in a visual pass.

## Required dependencies

- the existing five-tab shell and accepted Phase 12 save/finalizer architecture;
- the accepted Phase 13 gradual, contextual, skippable, logged, replay-neutral tutorial system;
- Phase 14–17 facility anchors, story discovery/opening, cast restrictions, and physical Village model;
- the existing Player Rank and Campaign save semantics at the exact base;
- separately approved genuine-alpha assets before transparent Wayfarer dialogue or walking presentation is enabled.

## Validation

Run `python3 design/player-wayfarer-ui-polish/validate.py` from the repository root. The validator is package-scoped and does not inspect or bless future production implementation.

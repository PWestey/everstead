# Phase 24L-B3A — Compact Oaths and More Hubs Contract

Status: implementation contract

Schema: 15 (unchanged)
Runtime: `everstead.phase24l.compact-hubs.v1`

## Objective

Convert the remaining public Oaths and More dashboards into mobile game screens without changing their mechanics, persistence, reward authority, or existing bound controls.

The approved interaction grammar is:

1. persistent top resource rail;
2. one dominant Everstead scene;
3. one five-button local dock above global navigation;
4. at most one bounded local panel;
5. selecting the active local button again collapses its panel;
6. Escape collapses the local panel before navigating away.

The phase may borrow this spatial grammar from genre references. It may not copy third-party art, frames, icons, wording, typography, trade dress, formulas, or monetization surfaces.

## Oaths ownership

The Oaths screen presents the existing Oaths over the existing Everstead Village/Waystone artwork.

- `Prepare` owns the existing `Pre-Gaming` section.
- `Work` owns the existing `Work & Chores` section.
- `Family` owns the existing `Family Time` section.
- `Rest` owns the existing `Shutdown` section.
- `Manage` owns the existing Hide Completed control and related management guidance.
- The existing New Oath control is reparented to the scene as the primary action.

The implementation must retain the real, already-bound `[data-oath]`, `[data-edit-oath]`, `[data-act="add-oath"]`, and `[data-act="hide-done"]` elements. It must not clone or reimplement Oath actions. Completion, editing, deletion, reward effects, persistence, and scoped undo remain owned by their predecessor systems.

Tavi supplies a session-only, replayable Oath Board guide. Opening or closing that guide must not write the save.

## More ownership

The More screen presents existing content over the existing Everstead Fellowship Hall artwork.

- `Journey` owns the real Wayfarer/player journey cards, release information, story-foundation notices, and migration notices.
- `Codex` owns the real existing Codex and story/Chronicle references.
- `Guide` owns advanced guidance and Campaign efficiency tools.
- `Settings` owns the real existing preference controls.
- `Save` owns Save & Recovery, save health, and migration history.

More is a compact archive hub, not a new data model. It must not invent Inventory, Chronicle, Legacy, Collection, claim, or currency authority. Those destinations belong to later separately verified batches.

Shallan supplies a session-only, replayable archive guide. Opening or closing that guide must not write the save.

## Presentation boundaries

- Install after Phase 24L-B2 and before the Phase 24L-B1 QA bootstrap.
- Wrap the current `oathScreen`, `moreScreen`, and `bindCommon` slots.
- Invoke the inherited binder before moving any node.
- Move existing nodes; never clone live controls.
- Store selected panel and guide state only in module memory.
- Do not read or write Web Storage.
- Do not add transaction, economy, reward, EXP, Power, shard, random, timer, or network authority.
- Keep global navigation and the top resource rail visible.
- Keep document scroll locked while an owned screen is active.
- Local panel controls and close controls must be at least 44 CSS pixels.
- At most one local panel or guide may be visible.
- The 320×568 and 390×844 layouts must remain usable with no horizontal or document scroll.
- Reduced-motion and forced-colors modes must remain supported.

## Do not break

- Oath completion, edit, create, delete, hide-completed, and undo behavior.
- Current Oath boost, Prosperity, Bond, and Village production rules.
- Existing Codex tabs, Wayfarer profile trigger, release notices, preferences, recovery-file controls, save-health state, and migration history.
- Phase 24L-B1 claimed shared Fellow EXP and deliberate Level spending.
- Phase 24L-B2 Fellowship and Adventure shells.
- Public/private asset boundaries and all current save migrations.

## Acceptance gate

- Runtime and stylesheet load exactly once and the install result is exact and fail-closed.
- Static checks prove the module is presentation-only.
- Browser checks pass at 320×568 and 390×844.
- Oaths exposes exactly five correctly mapped local tabs and preserves every live Oath control.
- More exposes exactly five correctly mapped local tabs and accounts for every existing top-level More card, including the Phase 17 sibling reference when present.
- Guides appear once on first visit, remain replayable for the session, and are save-neutral.
- Every local tab replaces the previous panel; second activation and Escape collapse it.
- `document.scrollHeight === innerHeight` and `scrollY === 0` on both screens.
- Existing New Oath, Oath edit/completion, preferences, Codex, Wayfarer, export/recovery, and global navigation bindings remain operational.
- Navigation and presentation interactions leave persisted raw data, revision, and storage write count unchanged.
- No unexpected console warning or error occurs.
- Phase 24L-B1 and Phase 24L-B2 behavioral regressions pass, allowing only explicitly superseded current-artifact identity assertions.

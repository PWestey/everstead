# Phase 24L — Game-Screen UX and Banked EXP Contract

**Status:** Implementation contract  
**Base:** Phase 24K release `fb1eff823681b4180c78eb25e222010860176bd2`  
**Design authority:** EVERSTEAD — LOCKED CORE DESIGN v1.2 and the accepted Everstead Product Handoff  
**Research record:** `docs/PHASE_24L_RESEARCH_SOURCE.md`

## Objective

Move Everstead from vertically stacked dashboard pages to an art-first, portrait game-screen architecture while preserving the working shell, save history, existing artwork, and accepted mechanics. Convert Fellow and Companion EXP from automatic character grants into banked resources that the player deliberately spends.

Phase 24L borrows interaction lessons from the user's Isekai: Slow Life references while retaining original Everstead visuals, wording, systems, and formulas.

## Locked spatial rules

1. The compact top resource rail remains visible on destinations and full-screen profiles. A profile's local dock replaces the five-destination global dock until Back/Close returns to the underlying roster or destination; the two docks never compete for the same space.
2. Every ordinary destination has one illustrated home state that fits inside the mobile viewport.
3. Subject-local actions live in a bottom dock.
4. Activating a local action opens one bounded sheet over the lower part of the illustrated stage.
5. Activating the selected action again collapses its sheet.
6. Opening a different action replaces the current sheet; local sheets never stack.
7. Character or location art remains visible above the sheet.
8. The primary action remains thumb-reachable.
9. At normal text size, no ordinary detail screen requires document scrolling at 320×568 or 390×844.
10. Roster galleries are the explicit exception and may scroll.
11. Inventory, achievement, Chronicle, and log collections use categories with bounded pages or carousels; a bounded internal scroll region is an accessibility fallback, not the normal route to the primary action.
12. Every sheet has a visible close control, Escape support, predictable focus, and reduced-motion behavior.
13. The local dock reserves 64 CSS pixels plus the bottom safe area. An open task sheet is at most 46dvh or 360 CSS pixels, whichever is smaller. At least 34dvh of the illustrated stage remains visible above it.
14. A task sheet may scroll internally at 130% text or when platform text enlargement demands it. Its title/close control and primary action remain sticky, and the document itself does not scroll.
15. Secondary edge utilities are limited to three: Close/Back, Info, and one context action such as Hide, Tutorial, or Story. Progression jobs belong in the bottom dock.

## Shared screen anatomy

```text
┌──────────────────────────────────────┐
│ persistent Power / Earnings / Gold  │
├──────────────────────────────────────┤
│ screen title + small context actions │
│                                      │
│      illustrated character/place    │
│      identity + one useful summary  │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ one optional task-local sheet    │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ local profile dock OR global nav     │
└──────────────────────────────────────┘
```

## Screen map

### Fellow profile

- **Overview:** quote, Level, Rank, Role/Type, Power, active Companion, and next meaningful action.
- **Level:** Fellow EXP wallet, current/next Level, cost, Power preview, x1/x10/Max spend controls, and Breakthrough status.
- **Rank:** character-specific shards, current rarity, next benefit, and explicit Ascend action.
- **Relics:** equipped Relics, slot effects, inventory choice, and upgrade entry.
- **Bonds:** Family links, Companion assignment, and attributable bonuses.

Required existing actions: Close/Back is an edge utility; Make Focus Fellow is in Overview; Ascend is in Rank; Relic selection/apply and Relic detail/upgrade entry are in Relics; EXP and Power breakdown are in Level/Overview. None may be dropped by the presentation migration.

### Family profile

- **Overview:** quote, Intimacy, rarity, assigned Building, and linked Fellows.
- **Gifts:** available Gifts, previewed Intimacy gain, and explicit give action.
- **Rank:** Family shards and rarity upgrade.
- **Building:** assignment, production contribution, and swap action.
- **Bonds:** Family-to-Fellow relationships and their visible effects.

No Blessing track is introduced.

Required existing actions: Close/Back is an edge utility; Give Gift is in Gifts; Ascend is in Rank; Building assignment is in Building; linked-Fellow effects are in Bonds.

### Companion profile

- **Overview:** Level, Rank, Power, assigned Fellow, Mastery, and sanctuary identity/title. Companion dialogue remains an authored-content decision; do not invent quotes to fill a UI slot.
- **Level:** Companion EXP wallet and explicit spend controls.
- **Rank:** Companion-specific shards and rarity upgrade.
- **Assignment:** eligible Fellow, current support contribution, and swap action.
- **Mastery:** idle progress, next threshold, and claim/status detail.

Required existing actions: Close/Back is an edge utility; Ascend is in Rank; Fellow selection, preview, and Apply Assignment are in Assignment; EXP and Power breakdown are in Level/Overview.

### Wayfarer profile

- **Overview:** full approved Wayfarer art, title, Player Rank, and current story objective.
- **Rank:** Rank EXP, next requirements, reward preview, and explicit Rank Up action.
- **Unlocks:** buildings, modes, seats, tutorials, and story requirements.
- **Chronicle:** current Book/Chapter plus bounded recent records and a full-history entry.
- **Settings:** accessibility, save export/recovery, and presentation controls.

The Wayfarer never enters a collectible roster or Power calculation.

Required existing content/actions: Close/Back is an edge utility; the current Rank roadmap remains available in Rank/Unlocks; the full approved art, current Rank, Rank EXP, threshold, and next requirement remain visible. Save tools stay in More until the later Settings move has its own persistence-neutral gate.

### Buildings and facilities

- **Overview:** place identity, passive production, local level, ready state.
- **People:** assigned Family plus visitors, workers, or residents.
- **Upgrade:** cost, before/after output, and explicit upgrade action.
- **Activity:** the building's distinct active interaction and banked opportunities.
- **Story:** local scenes, achievements, and discoveries.

The Village picture remains the physical board. These panels open from hotspots over the same location context.

### Campaign and Adventure

- Preserve the Wayfarer/route scene and stage path.
- Keep only recent stage records in the default sheet.
- Use local actions for **Advance**, **Formation**, **Rewards**, **Records**, and mode-specific information.
- Gold costs and reward contents are previewed before confirmation.
- Rewards are settled into wallets/inventory; they never silently level characters.

### Fellowship destination

- Keep the art-led landing screen and its Fellow/Family/Companion tabs.
- Roster tabs open scrollable portrait grids.
- Selecting a portrait opens the non-scrolling character profile described above.
- Do not expose all progression subsystems as stacked cards on the landing screen.
- At 320 CSS pixels, roster galleries use two columns; at 361 CSS pixels and wider, they use three. Cards remain at least 104 CSS pixels wide with a 44-pixel activation target. Count/sort sit above the gallery; filters sit in one compact ribbon immediately above the global dock.

## Banked EXP authority

### Wallets

- `Fellow EXP` is a shared spendable resource for Fellows.
- `Companion EXP` is a separate shared spendable resource for Companions.
- Player Rank EXP remains separate and follows the accepted Rank path.
- Collection EXP bonuses apply when eligible EXP is earned, never again when it is spent.

### Earning

- Campaign, Companion Campaign/Tower, facilities, achievements, offline claims, and authored story claims add to the correct wallet.
- Receipts display `+Fellow EXP` or `+Companion EXP` explicitly.
- An earning transaction does not change any character Level.

### Spending

- The player opens a character's Level panel and deliberately spends from the appropriate wallet.
- x1 buys one Level if affordable.
- x10 buys up to ten Levels, stopping before an unaffordable cost, cap, or closed Breakthrough.
- Max buys the greatest legal number of Levels under the same rules.
- The preview states the exact EXP cost and before/after Power.
- Spending is transactional and exactly once.

### Save migration

- Add a new schema version rather than reinterpreting schema 14.
- Preserve every existing Fellow and Companion `exp` value as historical invested EXP.
- Preserve every derived Level and Power result exactly at migration.
- Initialize new wallets at zero unless an authenticated pending entitlement already exists at the migration boundary.
- Do not claw back or redistribute past character investment.
- Freeze historical receipts under their original policy; new receipts record wallet credits under a new versioned policy.
- Capture pending/offline entitlement at the boundary so time is neither lost nor repriced.
- Migration is deterministic, idempotent, recoverable, and covered by exact fixtures.
- Validate live schema-15 state by replaying wallet credits and character spends from immutable migration baselines. Separately synthesize the legacy auto-settlement projection and pass that projection through the unchanged schema-14 validator, so the new player-directed allocation does not weaken predecessor proof.

## Tutorials

Every newly exposed local tab receives a short tutorial the first time its prerequisite is met, not all at account creation.

- First Fellow EXP reward: explain that EXP entered the shared wallet and open the Level tab.
- First affordable Level: explain preview and explicit spending.
- First shard threshold: introduce Rank separately from Level.
- First Relic: introduce the Relics tab.
- First Family Gift: introduce Gifts and Intimacy.
- First Building assignment: introduce the Building tab.
- First Companion: introduce Level and Assignment before Campaign/Tower.
- Every tutorial is replayable from the owning screen and has an exactly-once completion ledger.

All current Fellows and Family remain eligible speakers for context-appropriate tutorials, quotes, Chronicle records, facility dialogue, and story scenes.

## Implementation gates

### 24L-A — Shared non-scrolling profile shell

**Objective:** Introduce the reusable art-stage, local dock, and single-sheet controller on Fellow, Family, Companion, and Wayfarer profiles.

**Reuse:** Current full-resolution art, full-profile modal, profile hooks, accessibility foundation, roster identities, quotes, and action handlers.

**Migrate/replace:** Replace `.profile-stage + scrolling .profile-body` composition with one viewport-bounded screen. Move existing information/actions into local panels without changing calculations or saves.

**Acceptance:**

- All four profile types fit at 320×568 and 390×844 without document scrolling at normal text size.
- Every current profile action remains reachable.
- One panel opens at a time and toggles closed on repeat.
- Escape and the visible close control collapse a panel before closing the profile.
- Art remains visible; no asset is recompressed or faked as transparent.
- Opening, switching, and closing profile panels causes zero storage writes. Untouched state remains byte-identical; every current Level, Power, economy, assignment, and rarity output remains identical.

**Do not break:** roster hooks, focus restoration, keyboard support, reduced motion, Wayfarer separation, dialogue cutouts, or current art paths.

### 24L-B0 — Schema-15 wallet foundation

**Objective:** Introduce a real schema-15 successor with zero-balance Fellow and Companion EXP wallets, a write-once pre-v15 checkpoint, expanded save/recovery topology, and no reward or balance change.

**Acceptance:** Established schema-14 saves preserve every character's invested EXP, Level, Power, rarity, shards, and assignment exactly; both new wallets initialize at zero; direct-new and safe-reset schema-15 paths authenticate independently; interruption, staging, journal, import, rollback, Previous Save, recovery, and multi-tab fixtures pass. Historical schema-14 validation remains a frozen projection check rather than being bypassed.

The foundation includes lifetime credited/spent totals, immutable source identities, an ordered identity-chained credit/spend ledger, a write-once pre-v15 schema-14 checkpoint, and import/export format 4 while retaining formats 1–3. Existing pending offers and Tower carry remain pending and are not converted during migration.

**Do not break:** Founding Table authority, current storage namespace, old checkpoints, old receipts, pending entitlements, save export/recovery, or any Phase 0–24K behavior.

### 24L-B1 — Fellow EXP wallet and spend flow

**Objective:** Make Fellow EXP a banked drop and explicit character investment.

**Reuse:** Accepted Fellow EXP cost authority, invested EXP/Level derivation, Power formula, campaign rewards, collection EXP pool, transaction coordinator, receipts, and tutorial infrastructure.

**Migrate/replace:** Reward paths credit the wallet. Level-panel actions spend it. Existing per-Fellow EXP remains invested EXP.

**Acceptance:**

- Campaign and authored rewards increase wallet balance without changing a Fellow.
- x1/x10/Max produce deterministic cost, Level, Power, receipt, and persistence results.
- The current released Fellow curve remains authoritative. The Phase 24B 750/500 caps and Breakthrough system are simulation-only, so production spending must not invent their materials or activate a new gate. The spend adapter remains fail-closed and gate-aware for a later locked Breakthrough design.
- Schema-14 migrations preserve existing investments and initialize the wallet safely.
- Reload, retry, recovery, undo/refusal, offline settlement, and multi-tab conflict paths cannot duplicate or lose EXP.

**Do not break:** historical reward receipts, exact migration fixtures, total-roster Power, Gold costs, stage progression, catch-up lineage, or Collection EXP application order.

Before any nonzero Collection EXP bonus ships, its integer rounding rule must be locked and tested. Phase 24L-B0 does not guess that rule.

### 24L-C1 — Companion EXP wallet and spend flow

Same contract as 24L-B, with a separate wallet, Companion cost authority, Companion Power, Campaign/Tower rewards, Breakthroughs, assignment, and Mastery preserved.

### 24L-D — Buildings and Campaign shell conversion

**Objective:** Apply the same bounded-sheet architecture to Building/facility and Adventure screens.

**Acceptance:** The illustrated board remains visible; all existing actions remain available; ordinary screens do not document-scroll; receipts, costs, readiness, tutorial context, and claim state remain understandable.

### 24L-E — Collections, achievements, inventory, and polish

**Objective:** Replace long dashboard stacks with category views and bounded collections while preserving the approved exceptions for roster browsing.

**Acceptance:** no gacha-style promotional clutter; one central ready indicator; correct accessible labels; stable touch targets; no clipped primary action at mobile widths; human screenshot review passes.

For this gate, stable touch targets means at least 44×44 CSS pixels. Achievement and Chronicle default views show at most five recent records before opening a separate history page. The central ready indicator belongs to the owning destination and aggregates its eligible claims; local panels may show a ready state only while that destination is open.

## Originality gate

The implementation must pass a trade-dress review as well as a usability review:

- retain Everstead's obsidian, night-forest, teal, restrained-gold, and rune-notched visual language;
- do not copy Isekai's brown diamond wallpaper, cream parchment proportions, gold diamond buttons, resource-pill shapes/order, icon compositions, serif treatment, or ornamental borders;
- use Everstead's existing navigation art and original labels;
- use different sheet proportions, silhouettes, spacing rhythm, and motion;
- use no third-party screenshot pixels or reference-game assets.

## Global verification

- Static server load with zero console warnings/errors.
- New save start, persistence, reload, export, and recovery.
- Authentic older-save migration and exact backup preservation.
- 320×568, 390×844, 430×932, desktop, 130% text, reduced motion, keyboard, and screen-reader checks.
- At normal text size, the document has no vertical overflow on ordinary profile/detail screens. At 130%, only the bounded task sheet may scroll, with its title/close and primary action still reachable.
- Offline Gold remains capped at 24 hours and is not repriced by UI-only gates.
- Frozen Phase 0–24K contracts remain green or fail only at explicitly superseded artifact-identity checks.
- Independent review occurs before merge or deployment.

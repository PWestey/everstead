# Phase 24L Research Source

**Research date:** 2026-09-04  
**Purpose:** Canonical evidence record for the Phase 24L screen-architecture and banked-EXP decisions.  
**Authority rule:** Everstead's Locked Core Design and accepted Product Handoff remain authoritative. Isekai: Slow Life is interaction reference material, not a product or mechanical authority.

## Consequential findings

### 1. Portrait screen architecture

**Finding:** The supplied Isekai captures consistently use a compact top resource rail, one dominant illustrated activity canvas, and persistent bottom navigation. Character details are art-first. Their subsystems are opened through local bottom controls, with one bounded lower panel visible at a time.

**Evidence:**

- User-supplied captures `IMG_7094.png` through `IMG_7113.png`, especially the Fellow, Family, Familiar, Player, Building, and Stage screens.
- [Official Isekai: Slow Life listing on Google Play](https://play.google.com/store/apps/details?id=com.iskslowtest.mislen), Mars-Games, accessed 2026-09-04.
- [Official Isekai: Slow Life listing on the App Store](https://apps.apple.com/us/app/isekai-slow-life/id6449289088), Mars Era Limited, accessed 2026-09-04.
- [Fellows overview](https://isekai.wiki/Fellows), unofficial Isekai: Slow Life Wiki, last edited 2026-04-01, accessed 2026-09-04.
- [Fellow Improvements](https://isekai.wiki/Fellow_Improvements), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.

**Confidence:** High for the visible hierarchy and task-local panels. Exact animation and sticky-position behavior were not established by first-party documentation.

**Everstead resolution:** Use an original three-zone portrait shell: persistent resources, illustrated screen stage, and a local bottom dock. Ordinary screens must not require document scrolling. Exactly one task sheet may be open. Roster galleries remain intentional scroll surfaces.

### 2. Roster and list behavior

**Finding:** Fellow, Family, and Familiar rosters are dense portrait-card grids that defer detailed controls until a card opens. The supplied achievement and inventory captures use long lists, but that is not a pattern Everstead should inherit unchanged.

**Evidence:**

- User captures `IMG_7112.png`, `IMG_7111.png`, and `IMG_7103.png` for roster grids.
- User captures `IMG_7097.png`, `IMG_7098.png`, and `IMG_7100.png` for achievements and inventory.
- [Isekai Fellow Diary update](https://www.bluestacks.com/blog/updates/isekai-slow-life/issl-fellow-diary-event-en.html), BlueStacks Content Team, 2023-11-06.

**Confidence:** High.

**Everstead resolution:** Roster galleries may scroll. Achievements, inventory, Chronicle history, and logs should use category filters plus bounded pages, carousels, or internal scroll regions rather than turn the destination into one continuous dashboard.

### 3. Building and Campaign composition

**Finding:** Building management retains the illustrated place as the board and docks operations into a bounded lower surface. Stage progression uses a scenic upper board, a narrow progress path, and a compact lower record/action surface.

**Evidence:**

- User captures `IMG_7094.png` and `IMG_7099.png`.
- [Building Operations](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Building_Operations), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Stage](https://isekai.wiki/index.php?mobileaction=toggle_view_mobile&title=Stage), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Isekai: Slow Life Earnings Guide](https://www.bluestacks.com/blog/game-guides/isekai-slow-life/issl-earning-guide-en.html), BlueStacks Content Team, 2025-02-05.

**Confidence:** High for composition; medium for exact live-client interaction details.

**Everstead resolution:** Keep the Village artwork as the physical board. Building-local tabs open over the place rather than navigating to a separate management document. Campaign keeps the Wayfarer and route visible while records, formation, and rewards occupy a bounded sheet. Everstead retains Family staffing and total-owned-roster Power; it does not copy Isekai's Fellow staffing or opaque formulas.

### 4. EXP is earned first and spent deliberately

**Finding:** Fellow EXP is presented as an earned resource, normal leveling is a deliberate action, and milestone advancement is a separate lane. The user screenshot `IMG_7099.png` visibly shows an EXP balance on the Stage screen, while Level-Up documentation describes EXP sources and character leveling.

**Evidence:**

- User captures `IMG_7099.png`, `IMG_7105.png`, and `IMG_7106.png`.
- [Level-Up](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Level-Up), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [EXP Stone](https://isekai.wiki/Exp_Stone), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Stage](https://isekai.wiki/index.php?mobileaction=toggle_view_mobile&title=Stage), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [School](https://isekai.wiki/School), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Isekai: Slow Life Fellow Power-Up Guide](https://www.bluestacks.com/blog/game-guides/isekai-slow-life/issl-fellow-power-up-guide-en.html), BlueStacks Content Team, updated 2025-01-28.

**Confidence:** High that EXP is an accumulated leveling input and that leveling is player-directed. Public sources disagree about some source details and exact cost tables; those disputed values are not needed for the Everstead decision.

**Everstead resolution:** Create separate shared `Fellow EXP` and `Companion EXP` wallets. Rewards add to a wallet and never silently level a character. The character's Level panel previews cost and Power change, then spends the relevant wallet through explicit x1, x10, or Max actions. Existing character EXP remains preserved as historical invested EXP during migration.

### 5. Rank, shards, and level are separate jobs

**Finding:** Isekai exposes several overlapping fragment, star, Stella, awakening, and limit-break lanes. Character-specific fragments are not ordinary EXP.

**Evidence:**

- User captures `IMG_7105.png` through `IMG_7110.png`.
- [Loya's Fragment](https://isekai.wiki/Loya%27s_Fragment), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Allucia](https://isekai.wiki/Allucia), unofficial Isekai: Slow Life Wiki, last edited 2025-07-15, accessed 2026-09-04.
- [Acquaint Stone](https://isekai.wiki/Acquaint_Stone), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.

**Confidence:** High for separation of resources; medium for current exact thresholds.

**Everstead resolution:** Collapse overlapping reference-game complexity into one understandable Rank tab that spends character-specific shards. EXP belongs only to Level. Breakthroughs remain authored milestone gates and must not be disguised as Rank.

### 6. Power and economy formulas

**Finding:** Public Isekai sources agree on a level/aptitude base relationship but disagree on full stacking order. Building documentation describes a base-plus-summed-bonuses structure. Exact live power stacking is not sufficiently authoritative to import.

**Evidence:**

- [Level-Up](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Level-Up), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Building Operations](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Building_Operations), unofficial Isekai: Slow Life Wiki, accessed 2026-09-04.
- [Community power-formula investigation](https://www.reddit.com/r/Isekai_Slow_Life/comments/18263l4/), 2023-12, used only as contradiction evidence.

**Confidence:** High for the base relationship; medium for total stacking.

**Everstead resolution:** Retain Everstead's accepted named additive pools, current formula authority, fixed requirements, and total-owned-roster progression. Do not use Isekai's undocumented or disputed stacking.

### 7. Patterns intentionally excluded

Everstead will not copy:

- gacha pulls, duplicate conversion, paid currencies, VIP gates, stamina pressure, ranking ladders, or purchase surfaces;
- Isekai names, artwork, ornamental frames, currency marks, iconography, text, or exact compositions;
- Fellow staffing of Buildings;
- a separate Family Blessing track;
- overlapping Stella/Awakening/Aptitude systems;
- opaque multiplicative Power stacking;
- walls of event and notification buttons.

## Research stop rule

The consequential questions are resolved by agreement among the user's current screenshots, first-party product descriptions, multiple independent screen captures, mechanical references, Everstead's accepted handoff, and the current code audit. Further searching would mostly pursue volatile exact Isekai cost tables and current-client animations that Everstead should not copy. Those gaps are non-blocking for Phase 24L.

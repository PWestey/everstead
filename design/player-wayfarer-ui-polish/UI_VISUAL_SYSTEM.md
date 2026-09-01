# Everstead UI polish visual system

## 1. Original visual direction

The polish pass deepens the visual language already present in Everstead instead of replacing it.

### Foundation

- **Night-forest canvas:** near-black blue/green (`#081019` family), with Village and journey art remaining the emotional background.
- **Obsidian panels:** layered blue-green panels (`#101b25` / `#162530` families) with restrained translucent lines rather than ornate frames.
- **Parchment ink:** warm off-white (`#fff7e7` family) for primary copy and misted blue-gray for supporting copy.
- **Covenant gold:** reward, title, and claim-ready emphasis only; not every border or button.
- **Waystone teal:** interaction, focus, selection, navigation, and active-path emphasis.
- **Ember/red and herb/green:** warning and success states with accompanying icon/text labels.
- **Typography:** Georgia or the current display serif for titles; system UI face for controls, values, and long copy.

This is deliberately unlike the reference screenshots' cream/brown ornamental trade dress. No reference icon, texture, crest, edge silhouette, palette sample, or decorative composition is reused.

### Elevation and shape

Use three levels only:

1. canvas/art;
2. card or anchored facility panel;
3. modal/full-screen sheet.

Radii, border opacity, spacing, and shadow are tokenized. A surface cannot add a unique frame language merely to imitate a reference category.

### State vocabulary

- default: ink plus restrained border;
- selected/active: teal border, marker, and text;
- ready to claim: gold highlight plus “Ready” text/icon;
- incomplete/continue: teal action and exact next requirement;
- discovered but locked: dimmed art plus lock reason;
- disabled: reduced contrast plus readable reason, never opacity alone;
- error: ember icon, heading, recovery action, and preserved state.

## 2. Global top resource bar

The top bar remains compact and persistent, not a ledger of every inventory domain.

Required hierarchy:

1. Everstead/title or current place identity;
2. global Gold balance;
3. one contextual readiness affordance that opens a claim/reward summary;
4. safe-area and sheet controls when applicable.

Additional currencies remain inside the relevant surface. A new item type cannot claim permanent top-bar space without a separate information-architecture decision. Large values use consistent compact formatting with full values in accessible labels/details.

At 320px wide, the bar may collapse labels but not meaning. It cannot obscure the Wayfarer's face, navigation title, or close control.

## 3. Title/profile and character sheets

### Wayfarer profile

Use the exact full-background protagonist image with a bottom-to-top contrast gradient. The first viewport shows title, Rank, Rank EXP, current journey context, and a scroll cue. It does not use roster chrome, rarity frames, or collectible vocabulary.

### Fellow sheet

Preserve the approved full-background Fellow art. Arrange information in this order:

1. name, epithet/role, availability, quote;
2. Level and Power summary;
3. EXP progress and primary progression action;
4. Bond;
5. rarity/shards;
6. Relic slots and equipment;
7. Family/Companion contributions and exact calculation detail.

Locked Fellows may be inspected but remain explicitly locked and cannot become live speakers, Power contributors, assignment targets, or progression targets before their accepted join rule.

### Family sheet

Preserve approved full-background Family art. Arrange information in this order:

1. name, role, quote;
2. Intimacy and next relationship milestone;
3. Gifts;
4. rarity/shards;
5. current Building assignment and production contribution;
6. Family→Fellow Bond connections.

There is no Blessing row, employee count, or Fellow assignment to a Building.

All sheets share close/back, scroll cue, section navigation if necessary, focus behavior, and art-safe contrast. They do not need to share identical information density.

## 4. Achievements and Legacy

Achievements and Legacy live in `More` or an already-authorized contextual surface. They do not become a sixth tab.

Use category chips or a segmented control inside the surface. A goal card contains:

- durable title and one-sentence condition;
- exact progress, including denominator when bounded;
- reward preview from an existing domain;
- one status: `In progress`, `Ready`, or `Claimed`;
- `Claim` for a ready exact-once reward, or `Continue` for a non-mutating route to the relevant existing screen.

Continuing achievements may advance repeatedly under their accepted ordinal/lineage rules. One-time feats remain durable. Nothing is presented as a daily checklist, streak obligation, or expiring task. Readiness indicators must not imply loss if the player waits.

## 5. Campaign

Campaign uses a scenic stage frame that supports the existing walking/slideshow direction:

- current route/stage and a compact chapter context;
- Wayfarer presence through an approved asset or declared fallback;
- stage progress and adjacent-stage awareness without copying the reference rail;
- roster Power/readiness, exact Gold cost, and reward preview;
- one primary run/replay action;
- stage/result log beneath the action;
- post-settlement dialogue/Chronicle presentation.

Motion is short, interruptible, and decorative. Settlement is never delayed by animation. Reduced motion replaces travel with a static state and immediate result. No unapproved full-background portrait is overlaid as a transparent walker.

## 6. Physical Village and facility sheets

The Village art remains the game board. Compact anchored icons show hidden/discovered/available/ready states; the selected anchor reveals its name and status before opening the facility sheet.

A facility sheet retains place identity and contains:

- activity/status and banked opportunities;
- local progression;
- visitors, workers, or residents under that facility's approved rules;
- exact manual claim state;
- story/achievement link;
- passive role summary where applicable.

The original passive Buildings, Gold production, Oaths, and Family assignment stay intact. Facilities do not migrate into a detached management menu, add a sixth tab, or substitute Fellows as Building staff.

## 7. Inventory and reward presentation

Inventory is a presentation over approved existing domains—not permission to create another economy.

- categories use current domain names such as Gifts, shards, Relics, or Relic Stones only when available in the accepted build;
- responsive tiles show icon/art, name, quantity, and rarity using color plus text/shape;
- the detail sheet names source, purpose, ownership/quantity, and applicable existing action;
- zero-quantity/undiscovered policy follows the owning design;
- rewards show source, exact contents, claim identity/status, and destination balance;
- multi-item results use a readable list at small widths rather than shrinking tiles.

No copied currency, combine loop, synthesis button, daily inventory reward, or reference-game item enters through this polish work.

## 8. Tabs, buttons, panels, and feedback

### Navigation

Exactly five persistent tabs remain: Village, Roster, Adventure, Oaths, More. Readiness dots are supplemental; each tab has a text label and selected state. A tab never becomes a general inbox that hides exact claim provenance.

### Buttons

- minimum 44×44 CSS pixels;
- text first; an icon cannot carry the only meaning;
- one primary action per local decision area;
- destructive or spending actions use confirmation proportional to risk;
- disabled buttons expose the exact reason;
- loading/committing disables duplicate activation without erasing focus;
- Claim communicates exact-once state; Continue never claims.

### Panels and sheets

Cards group one concept. Sheets own complex tasks and restore focus/scroll on close. Modals are reserved for confirmations, compact results, and blocking recovery. A long character or facility experience uses a sheet, not a stack of nested modals.

Toasts summarize success but are never the only durable result. Exact rewards remain inspectable in the relevant log/receipt.

## 9. Responsive and accessible behavior

### 320×568

- no horizontal page scroll;
- one-column content;
- sticky primary action only if it does not cover content/focus;
- resource bar and bottom tabs remain usable;
- full-art sheets prioritize close, identity, and Rank/progression;
- facility hotspot labels appear on selection, not all at once.

### 390×844

- standard mobile layout;
- two-column metric groups only when each value remains readable;
- result/reward grids may use two columns.

### 1024×768

- centered bounded app or deliberate wider board mode;
- sheets may split art and detail while preserving reading order;
- physical Village anchors remain aligned to art coordinates;
- keyboard/focus behavior remains identical.

### 175% copy scale

Copy grows without clipping, overlap, hidden actions, or horizontal page scroll. Fixed-height text containers are prohibited. Numerical values can wrap or move to their own row.

### Reduced motion

`prefers-reduced-motion: reduce` removes parallax, sway, walking, automatic pan, long slide transitions, and animated readiness pulsing. Essential state change is immediate and still announced. A candidate must expose a testable reduced-motion state in the actual DOM/computed style; monkey-patching JavaScript alone is not evidence of CSS behavior.

## 10. Do not break

- save schema, migration, validation, recovery, import/export, offline cap, and multitab handling;
- Gold, passive Building, Oath, Family assignment, Campaign, Rank, roster, reward, and claim semantics;
- full-background Fellow and Family character sheets;
- physical Village anchors and five-tab navigation;
- tutorial history, story history, cast allocations, and locked-Fellow exclusion;
- manual exact-once claims and non-expiring banked opportunities.

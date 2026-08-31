# Everstead Phase 11D — Roster Tools and Codex Contract

Status: implementation authority for the schema-neutral Phase 11 functional-V1 roster and collection slice.

## Authority and baseline

- Product authority: **EVERSTEAD — LOCKED CORE DESIGN v1.2**, revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`.
- Migration authority: **EVERSTEAD — IMPLEMENTATION ROADMAP v1.0**, revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`.
- Code baseline: clean public Phase 11C release `eb6736ccae99b5228a0de52c49a6b079ef40789c`.
- Phase 11D is presentation and quality-of-life work. Save schema remains 11.

## Scope

### Roster sorting and filtering

- Fellows, Family, and Companions receive compact Sort and Filter controls above the existing roster panel.
- Controls are runtime-only. They do not enter `S`, localStorage, migrations, transaction sources, exports, or recovery files.
- The default choice preserves canonical definition order.
- Fellows may sort by effective combat Power, Level, rarity, or name and filter by the already-visible Type or Role labels.
- Family may sort by Intimacy, rarity, or name and filter by assigned/unassigned Building status.
- Companions may sort by effective Power, Level, rarity, or name and filter by assigned/unassigned Fellow status.
- Every non-name tie resolves by canonical definition index. Canonical definition arrays are never sorted or mutated.
- Filtering hides complete cards from both layout and the accessibility tree, reports `Showing N of M`, and provides a Reset action for an empty result.
- Sort/filter changes update the existing DOM directly. They do not rerender, save, move focus, settle time, consume RNG, or change scroll position.
- Type and Role remain labels and filter dimensions only. They do not change Power, Campaign/Tower eligibility, cost, rewards, counters, or team composition.

### Assignment and equipment previews

- Companion assignment retains its existing exact affected-Fellow preview and existing atomic transaction.
- Family assignment becomes preview-first. Selecting a Family member in a Building modal performs no write. A separate **Apply Free Assignment** action uses the existing `family-assignment` transaction.
- Family preview uses one captured timestamp and the exact current production selector. It shows every affected Building, current and projected Gold/hour, signed delta, movement, and displacement.
- Relic selectors in both Fellow and Relic profiles show every affected Fellow's current and projected effective Power before Apply.
- Relic Apply continues through the existing stale-checked `relicEquipPreview` / `equipRelic` authority and confirmation. Locked, invalid, and no-op selections cannot apply.
- Cancel, close, selection, preview, sort, filter, and Codex navigation are all write-free.

### Light Archives / Codex

- More receives a Rank-1 read-only **The Archives · Codex** card and Open Codex action.
- The Codex is derived only from immutable definitions and validated current state. It adds no discovery flags, completion rewards, collection bonuses, lore, currencies, routes, or saved fields.
- The viewer covers Overview, Fellows, Family, Companions, Relics, and Journey.
- Unlock presentation uses existing Player Rank access selectors, including grandfathered access; it does not infer access from raw rank alone.
- Codex sections switch inside the existing modal without calling `render`, `setRoster`, or `mutatePersisted`.
- The Codex never surfaces player-authored Oath notes, private memos, or links.

### Prosperity clarity

- The Codex Overview shows the exact current Prosperity value.
- Copy states that Prosperity is non-spendable lifetime Village/HQ progress, that active Oaths award Easy/Medium/Hard `+2 / +4 / +7`, and that it currently changes neither Building Gold nor combat Power.
- The existing Oath celebration explicitly includes its already-awarded Prosperity amount.
- Phase 11D adds no Prosperity threshold, level, title, unlock, multiplier, conversion, spending, decay, or cap.

## Accessibility and mobile behavior

- New selects and primary actions are at least 44 CSS pixels high. Roster controls stack at narrow phone widths and do not overflow at 320 pixels.
- Labels are explicit, controls identify `fellowship-panel`, and result changes use a polite status region without an initial-load announcement.
- The active roster panel keeps its existing `tablist` / `tab` / `tabpanel` relationships and Arrow/Home/End behavior.
- New controls remain outside character-card buttons and outside the tablist.
- Codex uses real buttons, an active-state announcement, the existing modal focus trap, Escape/backdrop close behavior, and return focus to its opener.
- Focus restoration must not return to an element hidden by a current roster filter; it falls back to the active roster control or selected tab.
- Phase 11D adds no animation and inherits the existing reduced-motion behavior.

## Do not break

- Schema 11, all protected storage keys, recovery files, migration receipts, validation, transaction coordination, and cross-tab safety.
- Phase 11C repeat/Claim Ready limits, stop rules, modal behavior, reward paths, and exact receipts.
- Total owned-roster Power authority and the separation between Village Fellow Economy Power and Fellow combat Power.
- Building Gold authority, 24-hour caps, Oath multipliers, Family/Companion assignments, Relic ownership/equipment, Campaigns, Tower, Expedition, Might, Mastery, shards, bad-luck protection, and Player Rank/grandfather access.
- Canonical definition order, deterministic reward recipient order, embedded assets, legacy quarantine, and current mobile shell.

## Acceptance gate

- Every sort/filter combination is deterministic, resettable, and write-free; artificial ties retain canonical order.
- Current Power/progression changes are reflected when the roster rerenders; no cached gameplay value becomes authoritative.
- Family empty/move/replace/unassign/no-op previews exactly match the post-commit affected Buildings and Gold/hour values.
- Relic equip/move/replace/unequip/no-op/locked previews exactly match the post-commit affected Fellow Power values from both profile entry points.
- Preview/cancel creates zero writes. Apply creates exactly one accepted existing transaction. Stale, blocked, and injected write-fault paths preserve the preimage.
- Codex contains exactly the current 6 Fellows, 3 Family members, 2 Companions, 6 Relics, 4 Buildings, and current journey records, without granting or saving anything.
- Prosperity is correct at zero, fresh 120, after each Oath difficulty, and after Undo; changing only Prosperity changes no Building, offline, Power, or encounter calculation.
- Phase 11C focused checks and all inherited Phase 11B save/recovery checks remain behaviorally green.
- The live gate passes twice across 320×568, 390×667, and 390×844 in normal and reduced motion, with no native-storage access, unexpected console warning/error, failed row, overflow, focus failure, or undersized primary control.
- Three independent reviews—architecture/safety, UX/accessibility, and QA adequacy—report no blocker before `main` advances.

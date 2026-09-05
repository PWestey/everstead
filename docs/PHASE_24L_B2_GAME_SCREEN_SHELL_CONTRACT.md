# Phase 24L-B2 — Fellowship and Adventure Game-Screen Contract

Status: implementation contract

Base: `c90cfd26e34c54b05537b030761c4760540d51c7` / save schema 15 / EXP policy version 2

## Objective

Replace the remaining Fellowship and Adventure dashboard flow with an original Everstead game-screen composition: a fixed resource rail, one dominant illustrated surface, compact local controls, and one bounded panel at a time. This is a presentation-only gate. It changes no save, progression, economy, reward, receipt, roster, story, tutorial-completion, or Power authority.

The supplied Isekai: Slow Life screenshots are spatial references only. No third-party pixels, frames, icons, labels, trade dress, formulas, or promotional patterns may be copied.

## Shared rules

- `html`, `body`, `.app`, and every ordinary Phase 24L-B2 route remain document-scroll locked at 320×568 and 390×844.
- The top resource rail and global five-destination dock remain visible.
- Every added frequent action is at least 44×44 CSS pixels.
- Activating a local control opens exactly one bounded panel; activating it again collapses that panel.
- Opening another panel replaces the current panel. Panels never stack.
- Escape closes the open local panel before changing routes.
- At enlarged text or unusually short heights, only the local panel may scroll internally. Its title, close action, and primary action remain reachable.
- UI-only state is session-local. No local panel, route guide, roster sort, or viewport action writes storage.
- Existing handlers and DOM nodes are moved or revealed, not reimplemented. Costs, eligibility, receipts, previews, rewards, and disabled states remain authoritative.

## Fellowship

The Fellowship landing screen becomes a direct roster surface.

- Remove the large featured-Fellow hero from the normal roster flow while retaining every Fellow card and the full-art profile opened from those cards.
- Keep the hall artwork as a quiet route background.
- Move Fellows, Family, Companions, and Relics into a compact local dock directly above the global dock.
- Keep the roster gallery as the explicit scrolling exception. Only the portrait grid scrolls; its header, utility ribbon, roster dock, top rail, and global dock stay fixed.
- Use two columns at 320 CSS pixels and three columns at 361 CSS pixels and wider.
- Cards show portrait, name, Level or relationship status, Type/rarity, focus state, and genuine unlock/ready status. Long explanations remain outside cards.
- Existing Might, Path, and roster sort/filter tools become compact controls that open one bounded utility sheet.
- Family Gift availability and Companion migration notices remain reachable without taking permanent vertical space.
- Opening and closing a full-art profile preserves the underlying roster and its internal scroll position.

## Adventure

Adventure becomes one painted route scene with a local action dock and one bounded tray.

- Preserve the selected Adventure route, route access rules, Wayfarer cutout/profile entry, encounter art, stage path, selected stage, claim readiness, costs, roster Power comparison, rewards, records, repeat controls, and existing presentation timing.
- Move existing route tabs into a **Routes** panel.
- Move stage nodes into a **Stages** panel.
- Move ready/manual claim surfaces into a **Rewards** panel.
- Move recent stage results and repeat history into a **Records** panel.
- Move the current route's primary run/clear/claim controls and exact previews into an **Action** panel.
- The local dock exposes Action, Stages, Rewards, Records, and Routes. Action opens by default on the first Adventure visit in a session; any selected control toggles closed on repeat.
- The scene remains visible above an open panel. At 320×568, decorative copy and scene height compress before touch targets or the primary action.
- Campaign result copy continues to say `Fellow EXP`; completion credits the shared wallet and never silently levels a Fellow.

## Wayfarer and Village speaker continuity

- The approved Wayfarer portrait remains the top-right Player profile entry and the Wayfarer remains visible in Fellow Campaign.
- The Wayfarer never becomes a collectible roster entry or contributes to Fellow Power.
- The Village speaker's existing session-only Hide/Show behavior remains intact. Its close control must be visibly understandable without changing save schema or preferences in this gate.

## Route guides

The new navigation grammar receives a short, session-local, replayable guide using current Everstead speakers.

- Tavi introduces the Fellowship portrait gallery and explains that Level spends shared Fellow EXP while Rank spends shards.
- Vex’ahlia introduces the Adventure action dock and explains Action, Stages, Rewards, Records, and Routes.
- A guide may open once on the route's first session visit, can be dismissed without writing a save, and can be reopened from a visible Guide action.
- The guides grant no reward and cannot complete or alter any durable tutorial ledger.

## Acceptance gate

Static and live-browser verification must prove:

- installation is additive and presentation-only;
- no storage, persistence, reward, EXP, Level, Rank, Power, or transaction authority exists in the new runtime;
- Fellowship roster counts and all visible character identities match the released build;
- all four roster tabs remain keyboard-operable and switch through the current controller;
- roster scrolling is internal and profile return preserves position;
- Adventure local panels contain the original live controls and retain their existing disabled/eligible states;
- Adventure route/stage selection, first clear, replay, claims, records, and Player profile entry still work;
- no ordinary Phase 24L-B2 route document-scrolls at 320×568 or 390×844;
- local controls toggle, replace, close, and respond to Escape predictably;
- Wayfarer art loads in both profile and Campaign and never appears in a collectible roster;
- Fellow EXP rewards still credit the shared wallet and explicit Level investment remains the only B1 spend path;
- no warning/error console entries occur;
- Phase 24L-B1, Phase 24L-A, Phase 24K, and current shell behavior remain green except for explicitly superseded additive-artifact assertions.

## Deferred

Oaths, More, Achievements, Inventory, Family/Companion EXP wallets, Building/facility game screens, and pagination are separate follow-on gates. Phase 24L-B2 establishes the reusable destination-level shell without expanding those systems.

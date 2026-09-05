# Phase 24L-B3C — Bounded Building and Restaurant Game Sheets

## Objective

Replace the tall passive Building and Restaurant dashboards with compact, viewport-bounded game sheets. Each sheet presents one local panel at a time through bottom tabs while preserving the exact existing live controls and mechanical authority.

## Locked boundaries

- Save schema remains 15.
- Building production, Family assignment, Building upgrades, Restaurant settlement, preparation, stock, service, rewards, claims, tutorials, and unlocks remain authoritative and unchanged.
- The adapter moves already-bound DOM nodes. It does not clone, reconstruct, or proxy any mechanical control.
- Opening, closing, and switching local tabs performs no save write.
- Inactive panels are hidden and inert; the shared close and action controls remain reachable.
- Successful actions may rebuild the modal. Ephemeral selected-tab state survives those rebuilds without entering the save.
- Restaurant remains story/release gated. This phase adds no detached launcher and changes no public-release flag.

## Building sheet

- Assign: the existing Family selector, consequence preview, and Apply action.
- Production: the existing full production calculation.
- Upgrade: the existing before/after preview and authoritative Upgrade action.

## Restaurant sheet

- Guest: current visitor, preference, reputation, served count, and bank status.
- Kitchen: the existing live recipe and station selectors.
- Pantry: the existing live recipe stock counts.
- Result: the existing captured reward and Collection contribution.
- The existing action dock remains shared below the active panel.

## Acceptance gate

- 320×568 and 390×844 pass with no document overflow and no modal-level scrolling.
- Exactly one shell, tab set, active panel, action dock, and copy of every real action survives each modal rebuild.
- Family selection remains preview-only; Apply commits once.
- Building Upgrade commits once.
- Restaurant Welcome, Prepare, and Claim each commit once through the existing handlers and advance to the appropriate panel.
- Closing, tab changes, keyboard navigation, reduced motion, and forced colors remain safe.

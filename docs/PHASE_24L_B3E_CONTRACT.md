# Phase 24L-B3E — Bounded Successor Facility Game Sheets

## Objective

Convert the eight existing Phase 20/21 Village facility dialogs into compact, viewport-bounded game sheets. Each location keeps its own identity and presents one purposeful panel at a time while preserving the exact bound activity controls and Phase 20/21 authority.

## Locked boundaries

- Save schema remains 15.
- Facility discovery and release gates, story openings, tutorials, banked opportunities, choices, participants, reservations, cultivation timing, rewards, manual claims, receipts, offline settlement, passive buildings, and focus return remain authoritative and unchanged.
- The adapter runs after the inherited modal binder and reparents already-bound live nodes. It does not clone, reconstruct, proxy, or replace mechanical controls.
- Opening, closing, switching tabs, and moving through the horizontal queue rail do not write the save.
- Inactive panels are hidden, inert, and marked `aria-hidden`.
- The actual action dock remains fixed beneath every panel. The actual banked-opportunity buttons move into one horizontal rail; no vertical dashboard scroll is introduced.
- Session-only tab state follows the underlying lifecycle and never enters persistence.
- Production activation remains unchanged. Phase 20/21 stays private behind its existing release gate.

## Facility identities

| Facility | Compact panels |
| --- | --- |
| Command Center | Petition · Decision · Queue · Record |
| Archives | Lead · Evidence · Queue · Record |
| Training Grounds | Drill · Formation · Team · Result |
| Hearth | Gathering · Theme · Guests · Result |
| Gatehouse | Arrival · Reception · Queue · Result |
| Market & Workshop | Order · Fulfillment · Materials · Result |
| Gardens | Plot · Cultivate · Growth · Harvest |
| Forge | Commission · Method · Materials · Result |

## Lifecycle routing

- Empty, banked, contextual-tutorial, cancelled, and newly selected queue records show the facility brief.
- Begin shows the facility's choice/work panel.
- Training and Hearth participant drafts stay on Team or Guests once the player enters that panel.
- Committed activities retain their brief and visible Resume/Resolve action.
- Gardens cultivation stays on Growth while growing or ready to check.
- Claim-ready work and new exact-once receipts show Result, Record, or Harvest as appropriate.
- Native deferred focus targets must always remain visible and outside hidden or inert panels.

## Acceptance gate

- All eight facilities pass complete Begin → choice → optional participants/reservations → Commit → Resume → Resolve/Growth → manual Claim lifecycles at 320×568 and 390×844.
- Every lifecycle has one modal, one direct sheet, one direct panel stack, one direct four-tab set, one visible panel, and one live action dock when a record exists.
- Every authoritative action, choice, participant, reservation, queue, reward, and claim node exists exactly once.
- No active panel, sheet, modal, page, or document has vertical overflow. Horizontal queue and participant rails remain usable.
- All visible interactive targets meet the 44-pixel minimum, allowing 0.1 pixels of browser subpixel tolerance.
- Pointer, Enter, Space, Arrow, Home, and End retain visible tab focus without save writes.
- Market/Workshop and Forge cancellation restore their exact reserved resources.
- Gardens maturity never auto-claims or auto-replants.
- Rewards and local progress remain unchanged until Claim; Claim applies once and creates one receipt; stale detached Claim controls cannot apply twice.
- Escape and backdrop dismissal use the canonical close path and restore focus to the exact originating Village hotspot.
- The production build exposes no Phase 20/21 QA bridge, decorates no successor sheet, and leaves all eight existing hotspots hidden and disabled.
- Phase 24L-B3D and earlier shipped presentation gates remain green.

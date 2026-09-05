# Everstead Phase 24L-B3C result

Status: passed implementation, root verification, automated release gates, and independent release review.

Base: `5181a5f30d8a2821f887633e9022a4ce6b050318`

Phase 24L-B3C converts the existing Building and Restaurant dialogs into compact, bounded mobile game sheets. It introduces no new save, economy, reward, progression, assignment, upgrade, recipe, stock, service, or claim authority.

## Delivered

- Building dialogs now keep the Village artwork visible above three local tabs: Assign, Production, and Upgrade.
- The Assign panel retains the existing Family selector, consequence preview, and Apply action.
- The Production panel retains the released full production calculation.
- The Upgrade panel retains the released before/after preview and real Upgrade action.
- Restaurant now presents Guest, Kitchen, Pantry, and Result as four local tabs below its existing scene.
- Restaurant's existing progress, customer, recipe, station, stock, result, Collection contribution, and action controls are moved into the compact sheet after their inherited binder runs. They are not cloned or reimplemented.
- Lifecycle-aware defaults open Kitchen while a dish is in progress and Result when a reward is ready to claim.
- Local tab state survives normal modal rebuilds without entering the save.
- Inactive panels are hidden and inert. Arrow keys, Home, and End move across the roving tab set.
- Both sheets fit the full 320×568 and 390×844 viewports, keep every tested control at least 44 pixels high, and confine any necessary content movement to the active inner panel.

## Authority and preservation

The production adapter owns presentation only. It wraps the released modal binder, invokes that binder first, and reparents its already-bound live nodes. Schema 15, the current storage namespace, release profile, and all prior transaction coordinators remain unchanged.

The Restaurant remains story-gated and has no detached production launcher. A query-scoped QA bridge exists solely to prepare the current schema-15 story discovery in an explicitly isolated destructive-test realm. It uses the released Phase 17 story preparation and save coordinator. A production-mode browser check confirms that this bridge is absent without the exact QA authorization.

## Automated verification

- Phase 24L-B3C static/source-authority gate: `31 passed, 0 failed`, twice on the final candidate.
- Phase 24L-B3C live Chromium lifecycle gate: `56 passed, 0 failed`, twice on the final candidate.
  - 320×568: `28 passed, 0 failed` per run.
  - 390×844: `28 passed, 0 failed` per run.
- Production-mode load check at 390×844: HTTP 200, B3C installed, schema 15, QA bridge `undefined`, and zero warning/error console entries.
- Phase 24L-B3B live regression: `48 passed, 0 failed`.
- Phase 24L-B3A live regression: `48 passed, 0 failed`.
- Phase 24L-B2 live regression: `66 passed, 0 failed`.
- Phase 24L-B1 static mechanics and integration regression: `95 passed, 0 failed`.
- B3B, B3A, and B2 static regressions retain all `94` behavior and authority checks. Each reports only its one deliberately superseded additive-index identity assertion.
- Independent release review: `PASS` after its focus-containment blocker was corrected, with no remaining code blocker.

The old B1 browser presentation journey reports `57 passed, 2 failed` because its two viewport branches still click the original `[data-fellow]` button. The released B2 gallery intentionally hides that predecessor button and presents the current roster cards instead. This limitation predates B3C: B2's current Fellowship and banked-EXP browser journey passes `66/66`, while B1's mechanics and current-source suite passes `95/95`.

## Browser evidence

The isolated-memory B3C journeys prove:

- opening, closing, and local tab changes leave exact raw save bytes, revision, and storage-write count unchanged;
- Building Family selection remains preview-only, while Apply advances exactly one revision and rebuilds on Assign;
- Building Upgrade advances exactly one revision and rebuilds on Upgrade;
- Restaurant discovery and introduction use the real story route;
- offline settlement banks two real customers without expiry;
- Welcome, Prepare, Transfer, Serve, and Claim remain the original bound actions through every modal rebuild;
- each measured action advances exactly one revision;
- Serve does not grant Gold early, Claim increases Gold exactly once, and the post-claim sheet returns cleanly to Guest;
- claim-ready state selects Result automatically;
- each sheet has one shell, one tab set, one active panel, one action dock where applicable, zero page overflow, zero modal-level overflow, and no duplicated controls;
- Arrow-key navigation moves both selection and keyboard focus without writing the save;
- Escape closes each sheet without a write and returns focus to the exact Building or Restaurant hotspot;
- both mobile journeys complete with zero warning/error console entries.

## Root visual verification

Root also opened the real local production build rather than relying only on the automated harness. The Training Grounds dialog remained centered and fully bounded, showed the Village scene, kept its real Production calculation visible, exposed all three local tabs without page scrolling, and retained the global app underneath the dismissible overlay.

## Corrections found during verification

The first short-phone styling reduced local controls below the 44-pixel touch floor. That override was removed, and the final browser suite now measures every Building tab, Restaurant tab, and Restaurant action at or above 44 pixels in both target viewports.

Independent review then exposed that the inherited generic modal focus trap still counted roving tabs with `tabindex="-1"` and controls inside hidden or inert panels. The shared focusable predicate now rejects explicit negative tab stops, hidden/inert/ARIA-hidden ancestry, and nodes without rendered rectangles. The final B3C browser gate directly proves Shift+Tab and Tab wrap between the selected local tab and Close without leaving either dialog; the B3B, B3A, and B2 live suites remain green after that correction.

The first Restaurant fixture attempted to reuse an obsolete pre-schema-15 reset route. The final gate instead prepares only the current story discovery through the released Phase 17 authority, then opens the Restaurant through the real Village hotspot and story introduction. No legacy reset bypass remains in the B3C journey.

## Candidate identity

- `index.html`: SHA-256 `c22c8fab07355f7db5d75a529ea0f42239307f63af390ef07dc20c6a852d1c53`, 2,091,371 bytes.
- `src/phase24l-facility-modals.js`: SHA-256 `9c95cf24c5ac4d6839e44aab5898f1df744d15f1c617706f6683244447db4172`, 10,702 bytes.
- `src/phase24l-facility-modals.css`: SHA-256 `449d4716d430f3d62a4e90118e7f92fe995aae25c444e9cba091cb95c74e85c4`, 7,270 bytes.
- `qa/phase-24l-b3c-facility-modals/contract.json`: SHA-256 `f012d0bb8c3a301a72521c8aaa900f4de6308b34f2432c25602db07489a7c70b`.
- `docs/PHASE_24L_B3C_CONTRACT.md`: SHA-256 `c38d6162461b3156ecec1f5fdfbbd0b34211efd8aba7d3e0ed0443ddf9e61b74`.

## Known boundaries

- B3C compacts the four released Building dialogs and the first complete Restaurant facility. It does not invent active activities for Buildings whose distinct gameplay has not yet been implemented.
- The Restaurant's shared action dock intentionally remains visible beneath all four tabs because its buttons reflect one authoritative customer lifecycle rather than four separate action systems.
- Selected local tabs are session-only presentation state and reset on reload.
- Browser coverage is Chromium-based. Reduced-motion and forced-colors behavior are covered statically; Safari and physical-device verification remain later release checks.

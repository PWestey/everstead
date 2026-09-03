# Phase 24A scaling-authority independent QA contract

## Scope

Phase 24A consolidates the accepted schema-13 numeric baseline into one immutable, versioned, observable authority. It must not rebalance gameplay, migrate a save, introduce a Collection effect, or alter a claim.

This gate requires three canonical deterministic reports: fresh, migrated-established, and true high-investment. Each report carries complete canonical inputs, exact unrounded and rounded results, formula order, active-versus-legacy source proof, and a safe-integer audit.

## Required production interface

- Immutable `globalThis.EVERSTEAD_PHASE24_SCALING` with version 1, config ID `everstead-scaling-live-baseline.phase-24a.v1`, status `live-baseline-only`, schema version 13, and immutable `active`, `legacyOnly`, `formulaOrder`, and `profiles` definitions.
- Guarded read methods `scalingDefinitions()`, `scalingReport(profileId)`, `scalingProfileState(profileId)`, and `scalingPreviewSettlement(state, facilityId, at)` on the existing genuine Phase 23 bridge. Returned objects are detached clones; callers cannot mutate production authority.
- `scalingPreviewSettlement` is a narrow read-only export of the genuine Phase 18/19 settlement path. It accepts only Apothecary or Schoolhouse, clones the supplied state internally, requires nonnegative safe-integer time, and fails closed for every other facility or malformed time.
- No Phase 24 destructive bridge method and no storage access from the registry or report generator.
- A More-screen diagnostic control and modal using the frozen `data-phase24-*` hooks in the QA runner. The modal is secondary, concise, keyboard operable, mobile-safe, and read-only.

## Numeric invariants

- Genuine no-save schema-13 fresh remains exactly 35,150 Fellow economy Power; 35,565 Fellow combat Power; 2,200 actual/effective Companion roster Power; 390/80 Fellow/Companion economy basis points; and 27,320.8092192 Gold/hour. The authority separately preserves the accepted freshly migrated schema-12 comparison: 36,366 Fellow combat Power, an 801-point migration-protection difference on Cael and Orin, without reclassifying that protected history as true fresh.
- Formula order remains exact and distinct. Assigned Companion transfer and Family links never enter Fellow economy Power. Migration floors never become actual Companion Power or economy Power.
- The migrated-established report has a positive authenticated migration floor and proves actual, floor, and effective values separately.
- The true high-investment report exceeds its historical floor through actual earned Power, so the floor is inactive.
- The true-fresh and migrated-established detached schema-13 states must validate through the genuine validator. Migrated-established must come from the authenticated schema-12 fixture and genuine schema-12→13 migration, not a hand-written schema-13 approximation. The true-high state is explicitly synthetic, detached, `persisted:false`, nonimportable report input and is therefore checked structurally rather than submitted to persistence validation.
- The true high-investment report includes exact pending, offline, cap, credited, discarded, interval, and claim-ready outputs from the real pure production preview/derivation paths, with exact policy identities. These previews run only against detached canonical state and never settle or claim anything.
- The exact high-investment claim boundary distinguishes fractional pending Village Gold (923,019,963.6103376) from integer claimable Gold (923,019,963). At already capped Mastery and Might, the report preserves nominal Tower/Expedition rewards (120/600) while proving actual awards are zero.
- All Power/currency/cost/EXP/material/count/basis-point authorities are nonnegative JavaScript safe integers. Unrounded rates remain finite and below safe precision.
- Legacy 1.70 Building upgrade growth and legacy 1,000/1,200 Companion placeholders are visible only as inactive historical constants. No report may apply them.
- Collection inputs and effects remain absent or reserved/inactive with exactly zero contribution in Phase 24A.

## Neutrality and presentation

Calling definitions/reports and opening, switching, or closing the diagnostic modal must preserve gameplay state excluding ephemeral UI, persisted bytes, revision, storage-write count, and native Web Storage access. Unknown profile IDs fail closed. The diagnostic works at 320×568, 390×844, 130% copy, and reduced motion; controls are at least 44px, content does not create viewport horizontal overflow, the dialog is labelled, Escape/close returns focus, and the browser has no warning/error entries.

The accepted Phase 23 and Phase 23 successor packages remain byte-frozen and behaviorally green. The Phase 18/19 independent package remains byte-frozen. Its historical runtime checksum list is allowed exactly two successor identity deltas—`index.html` and `src/phase18-19-runtime.js`—because Phase 24A adds the read-only preview seam; both Phase 18/19 behavioral verifiers must still pass completely.

## Release boundary

Package-only PASS proves only that this independent gate is internally coherent. Full PASS requires the real frozen candidate and both accepted Phase 23 packages on the same tree. This contract does not approve schema 14, a new EXP table, Breakthrough costs, Collection rewards, balance changes, merge, push, deployment, or release.

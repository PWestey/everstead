# Phase 15–16 Waystone, Legacy, and Restaurant contracts

## Status

Design and data contract only. This package changes no production HTML, CSS, JavaScript, save state, feature flag, economy value, artwork, or deployed behavior.

## Outcome

- **Phase 15:** Make the central Waystone the mobile Village objective and Legacy claim destination. Legacy rewards become ready without paying automatically, remain banked indefinitely, and claim exactly once through their native Legacy source.
- **Phase 16:** Open the western-plaza Restaurant as the first complete active facility. Customers bank while away; the player reads a preference, prepares or selects a recipe, serves, sees the result, and manually claims sales, tips, and local progression.

The Waystone is a presentation and claim hub, not a fake timed facility. Restaurant is the first runtime consumer of the Phase 14 interval-banked facility framework.

## Files

- `PHASE_15_16_CONTRACT.md` — player experience, lifecycle, economy boundaries, migration, mobile presentation, tutorials, cast, and phase gates.
- `DATA_SPEC.md` — persisted successor state, stable identities, evaluation, settlement, resolution, claims, archive, and validation.
- `SEAM_RESOLUTION.md` — implementation-ready corrections for the Phase 12/14 integration seams.
- `legacy-definitions.json` — six launch tracks, five feats, first-tier identities, source/baseline policy, and null economy inputs.
- `restaurant-definitions.json` — customer, preference, recipe, station, stock, named-visitor, achievement, and reward-policy identities.
- `tutorial-extension.json` — normalized Phase 15/16 tutorial definitions using canonical dot-form facility and actor IDs.
- `cast-hooks.json` — intentional Phase 15–21 dialogue/facility schedule for all 18 Fellows and 20 Family actors.
- `fixtures.json` — vertical-slice migration, claim, banking, concurrency, mobile, tutorial, and receipt-archive fixtures.

## Dependencies

- Released source base `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c`.
- Phase 12 foundation config `phase-12-foundation-v1` and definition set `definition-set.phase-12-foundation.v1`.
- Phase 13 cast/tutorial design commit `73b807a36cb0ddb12fe726b3d271f7c4779e5ba9`.
- Phase 14 shared facility contract commit `666d1d87627b8c25bdcc1651d4b7f72be37ac952`.
- Economy approval before any null threshold, reward, customer cadence, capacity, sales value, tip value, station timing, or active-profit target is enabled.

## Release blockers by design

Production activation is fail-closed while any required economy field is null. QA fixtures use visibly synthetic values only to prove mechanics.

Phase 15 additionally requires the successor validation/tutorial/claim/archive seams in `SEAM_RESOLUTION.md`. Phase 16 requires those seams plus the trusted Restaurant finalizer and a receipt archive with proven five-year headroom.

## Do not break

- Existing passive Building Gold, Oath boosts, Family assignments, offline Gold, and 24-hour cap.
- Phase 12 save/recovery authority and native reward validation.
- Native Legacy/story/facility reward source classification.
- Banked, non-expiring claims and opportunities.
- Current Campaign, Rank, Power, roster, Relic, Might, and Mastery behavior.
- Full-background character-sheet art and the approved transparent/framed/text-only dialogue policy.
- Bottom navigation: Waystone and Restaurant open from the Village artwork rather than adding destinations.

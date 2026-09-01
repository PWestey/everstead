# Everstead Phase 16 — Restaurant implementation contract

## Status and authority

Phase 16 is a private-integration vertical slice built on accepted integration commit `fa004195a36dcbcd5be4ad9d73357a63cf50f3f7`.

The authoritative inputs are:

1. the locked core design and implementation roadmap referenced by `AGENTS.md`;
2. `design/phase-15-16/` and the accepted Phase 15 successor foundation;
3. `design/phase-15-16-policy-approved/approval.json` and its byte-bound approved candidate files;
4. the frozen Phase 16 independent QA contract.

This phase enables the approved Restaurant only for private integration. It does not authorize public release, a sixth navigation destination, a new currency, stamina, daily resets, expiring customers or stock, negative rewards, permanent percentage multipliers, or a detached facility-management screen.

## Dependencies

- Schema 12 and the existing save/recovery/checkpoint lineage remain authoritative.
- Phase 12 remains the definition, validation, reward, and central transaction foundation.
- Phase 13 remains the story, Chronicle, tutorial, and cast identity authority.
- Phase 15 remains the physical Village board, facility-anchor, V2 claim/archive, replay, and immutable-finalizer authority.
- Restaurant activation composes as an idempotent schema-12 successor. It cannot replace or weaken any predecessor validator.

## Approved mechanical policy

- Facility: `facility.restaurant`, activity `activity.restaurant-service`, physical anchor `western-plaza-restaurant`.
- Story discovery: `story.book1.chapter1.village-toll.resolution`.
- Capability: `capability.restaurant-service.v1`.
- Opening content: `facility.restaurant.opening-service`.
- Opportunity cadence: 30 minutes; bank capacity: 12; unattended target: six hours; elapsed processing remains capped at 24 hours.
- Existing saves receive no retroactive customers. Unlock captures one `now` for both `unlockedAt` and `cursorAt`.
- Recipes are Hearth Stew, Garden Flatbread, and Roadside Tea at 120/90/60 seconds, batch sizes 2/3/4, and stock caps 6/9/12.
- Reputation and mastery are local, non-spendable progress. Levels 1/2/3 require 0/12/36 progress.
- Preparation has no global input cost. Start, ready-batch transfer, service, and reward claim are explicit player actions.
- Customer, preference, economy-band, and reward selection are deterministic from save identity and opportunity ordinal. Production reads captured fixed reward rows; it never recomputes from design provenance percentages.
- Regular customers are Road Worker and Archive Courier. Route Envoy is an authored one-time named visitor only.
- Active recurring profit must remain inside the approved 7.94–9.13% simulated share range and all five approved profile/horizon reports must remain safe-integer and passive-baseline preserving.
- Public release remains `false`.

## Lifecycle and transaction boundaries

1. Story discovery changes only the physical-board discovery state.
2. Capability grant plus completed opening content unlocks the Restaurant at captured time with no backfill.
3. Settlement banks deterministic, non-expiring customer opportunities. It creates no offer, reward, stock, progression, receipt, Chronicle entry, or tutorial completion.
4. Begin moves the exact banked customer into a resumable engagement. Cancel is allowed only before preparation commit and restores the same customer identity.
5. Prepare captures the exact recipe, station, stock identity, versions, start time, and deterministic outcome inputs. Reload and close preserve it.
6. Preparation completion creates a version-bound batch. Manual transfer moves that batch into local stock without auto-serving.
7. Serve consumes exactly one prepared stock unit and creates one immutable claim-ready result plus one V2 offer. It applies zero Gold, reputation, mastery, metrics, receipt, story, or Chronicle effects.
8. Claim dispatches only through the captured Restaurant finalizer inside the central coordinator. It atomically applies global and local effects, removes the owned customer/outcome/offer, extends permanent claimed-ordinal replay evidence, and adds one source-typed V2 receipt/archive update.
9. Any missing/throwing adapter, stale identity, bad version, stock failure, archive failure, validation failure, or losing concurrent client writes nothing.

## Route Envoy story rule

`family.jaina` and `restaurant.visitor.route-envoy.01` become eligible only when all of the following are true:

- the Restaurant is operational;
- Reputation level is at least 3;
- `story.book1.interlude.open-table` resolves in the foreground as `watched` or `skipped` for the first time.

That exact foreground resolution may emit `story.book1.restaurant.route-envoy-ready` once per save. Offline settlement, scene replay, duplicate delivery, background migration, or an ineligible resolution cannot emit it. The named visitor never expires. Its Chronicle hook is queued only after its Restaurant claim commits, and Chronicle playback/replay is reward-neutral.

## Tutorials and cast

The successor registry remains the same 79-ID ledger under `tutorial-registry.phase-16.v1`. The seven Phase 16 lessons are contextual, gradual, rewardless, nonblocking, immediately skippable, logged, and replayable. A safe Restaurant visit auto-presents at most one relevant lesson; story, recovery, result, claim, and other tutorial presentation has priority. Skip cannot prevent service.

The Restaurant subset uses exactly seven actors and eleven Restaurant hooks: `fellow.deadpool`, `fellow.star-lord`, `fellow.spider-man`, `family.tamsin`, `family.jaina`, `family.tifa`, and `family.misty`. All 38 predecessor cast identities and hooks remain registered. Locked Fellows never speak. Directions remain understandable without a speaker. Dialogue uses approved transparent cutout, approved framed treatment, or attributed text only—never an unframed full-background profile overlay.

## Player-facing presentation

- The Restaurant opens from its existing physical Village hotspot and composes with the Phase 15 sheet/overlay priority.
- The sheet exposes customer preference, recipe and station selection, explicit Prepare, preparation status, explicit Transfer, Serve, exact claim preview, Claim, tutorial help/log, and Close as applicable.
- No interaction occurs merely by opening or rendering.
- Keyboard entry moves focus into the sheet; Escape returns focus to the physical hotspot. Escape before preparation commit is write-neutral; after commit it closes without cancelling the engagement.
- Targets remain at least 44×44 CSS pixels at 320×568 and 390×844. The view must not overflow at 175% copy and ready treatment must have a non-animated reduced-motion equivalent.
- The visual language extends Everstead's existing dark glass, parchment-gold, teal, and Village-map treatment without copying another game's trade dress.

## Acceptance criteria

- Phase 16 independent static gate closes exactly the eight absent-runtime rows and reaches 57/57 without changing schema version.
- The live five-realm gate passes its expanded lifecycle, offline, recovery, import, adversarial, exact-once, tutorial, cast, actual-DOM, focus, reduced-motion, and passive-baseline checks.
- Fresh, migrated, unlocked, banked, pre-commit, prepared, matched, imperfect, named-visitor, archive-window, offline, recovery, corrupt, future, and locked-roster fixtures are deterministic.
- Zero/negative/repeated settlement, partial carry, saturation, rollback, midnight/DST labels, and over-24-hour elapsed handling are bounded and safe-integer.
- One engagement survives begin → prepare → completion → transfer → serve → claim across reload.
- Claim applies global reward, local progression, stock, metrics, claimed ordinal, receipt, and archive exactly once across stale/repeated/two-client attempts.
- Economy reporting uses the approved fixed policy and reports every required profile/horizon simulation within its captured share target and five-year integer headroom.
- Phase 12–15 focused/static behavior, the original four passive Buildings, Oaths, Gold/offline settlement, Family assignments, all five tabs, Village composition, and cast/tutorial coverage remain unchanged.

## Do not break

- Do not backdate customers or generate Route Envoy from interval settlement.
- Do not choose, prepare, transfer, serve, claim, progress, emit story, or run tutorials offline.
- Do not maintain a parallel claim authority or caller-supplied finalizer.
- Do not credit anything at settlement, opening, rendering, preparation completion, service result, tutorial, or Chronicle playback.
- Do not turn Restaurant Reputation, mastery, or stock into global resources or passive Building modifiers.
- Do not recompute captured reward rows from percentages, current boosts, Family assignments, or later Building changes.
- Do not drop banked, engaged, prepared, ready, or claimed lineage during migration, import, recovery, archive folding, or definition updates.
- Do not rename or remove predecessor tutorial/cast/content IDs, alter `player.wayfarer`, replace the Village screen, or enable public release.

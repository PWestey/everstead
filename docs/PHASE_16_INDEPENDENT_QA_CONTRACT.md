# Everstead Phase 16 — Independent Restaurant QA Contract

## Scope and release boundary

This gate approves the Restaurant as the first complete consumer of the Phase 15 physical Village facility framework. It is QA-only: it does not implement production runtime, approve economy numbers, alter art, or authorize merge, push, or deployment.

The Restaurant must live at the physical `western-plaza-restaurant` hotspot on Village artwork. Story discovery, capability grant, and authored opening activate it without a detached building grid and without a sixth navigation item. A newly opened Restaurant records `unlockedAt` and `cursorAt` from the same captured current time. Historical qualification must never create retroactive customers or value.

Inherited seams are mandatory: Phase 12's central clone/mutate/validate/commit coordinator and immutable registered finalizers, Phase 13's accepted First Covenant/tutorial/cast bridge, and Phase 15's physical board, stable facility identities, manual claims, and V2 bounded archive/checkpoint lineage. The gate does not separately fail the frozen preimplementation base for absent Phase 15 production because absence of the Phase 16 bridge is the candidate boundary.

## Frozen QA bridge

The locally/query-gated bridge is `window.__EVERSTEAD_PHASE_16_QA__`, version `phase-16-independent-qa-v1`. It must capture the selected injected storage adapter and reject destructive access unless both `runtime.qa.allowDestructive === true` and `runtime.qa.isolatedStorage === true`, and the adapter is not the captured native `localStorage` object. It must not expose production globals or accept caller-supplied finalizer callbacks.

Read-only methods:

- `definitions()` returns schema/config/definition lineage, inherited Phase 15 seam attestations, Restaurant facility/content/opportunity definitions, presentation contract, immutable finalizer/archive contract, tutorials, cast selection policy, and production enablement.
- `snapshot()`, `validate()`, `derive()`, `raw()`, and `exportSave()` expose normalized test observations without mutating state.
- `passiveBaseline()` returns the original four Buildings' production, global Gold/Oath state, and Family assignments for byte-stable comparison.
- `economyReport()` returns production enablement, the complete candidate policy if one exists, approval state, and deterministic short/long simulations for fresh, midgame, established, highly-active, and mostly-idle profiles.

Destructive methods are available only in an isolated QA realm:

- `resetFixture(id)`, `reload()`, `importFixture(payload)`, `advanceOffline(scenario)`, and `mutateInvalid(kind)` cover fresh, migrated, offline, recovery, import, future, corrupt, and malformed states.
- `event(type,payload)` delivers story/capability/Chronicle events with exact identity and duplicate protection.
- `openRestaurant()` changes presentation only.
- `settle(facilityId,capturedAt)` deterministically banks non-expiring customers with stable ordinals.
- `begin(customerId,identity)` begins selection; `cancel(customerId,identity)` is safe only before the preparation commit boundary.
- `prepare(customerId,identity,{recipeId,stationId,stockIdentity})` commits the exact resumable recipe/station/stock reservation.
- `serve(customerId,identity)` creates one immutable outcome and one claim-ready offer with zero payment.
- `claim(offerId,offerIdentity)` invokes only the registered Restaurant finalizer through the central coordinator.
- `tutorial(id,action)` supports open, skip, log, and replay without gameplay effects.
- `simulateConcurrent(kind)` races two clients at settle, prepare, serve, or claim and returns winner/loser and duplication counts.
- `probeFinalizerFailure(mode)` covers missing, throwing, local-stock, and archive failure with atomic refusal.

## Lifecycle and value safety

Customer generation is deterministic, non-expiring, bounded by a complete candidate policy, capped at 24 elapsed hours, and based on epoch time rather than local midnight. Reload, saturation, rollback, DST, and timezone labels may not change identities, move a cursor backward, expire a customer, preserve hidden interval debt at capacity, or apply rewards.

The required service path is preference → recipe and station choice → resumable preparation → serve result → explicit Claim. Before the preparation commit, Cancel restores the exact banked customer and creates no effect. After commit, closing or reload preserves the exact customer, recipe, station, stock reservation, and lineage. Serve creates a deterministic immutable outcome and offer but changes no Gold, reputation, mastery, stock, metric, receipt, or Chronicle state.

An imperfect valid match must yield a smaller nonnegative result. It may not create debt, remove a global resource, expire the result, trap the customer, or block later progress.

Claim applies global Gold plus Restaurant reputation, recipe mastery, stock, metrics, claimed ordinal/range lineage, receipt, and V2 archive/checkpoint updates atomically through the immutable Restaurant finalizer. Missing or throwing adapters, stock failure, archive failure, stale identity, duplicate claim, reload, and two-client races must leave exactly one winner or make no write. No partial effect or duplicate receipt is acceptable.

A named visitor queues exactly one original Chronicle hook only after the visitor's successful claim. Playback, skip, replay, duplicate event delivery, and duplicate claim are reward-neutral.

## Economy gate without number ownership

This QA package does not hard-code eventual production cadence, capacity, sale, tip, reputation, mastery, or threshold values. The synthetic fixture policy is marked QA-only and exists solely to exercise deterministic mechanics.

When `productionEnabled` is false, Restaurant accrual and service must fail closed. When it is true, `economyReport()` must return a complete non-null versioned candidate policy covering cadence, capacity, unattended target, customer weights, sales, match multipliers, local progress, thresholds, preparation, stock, stations, active-profit target share, integer headroom, and simulation approval.

Every short/long simulation for all five profiles must use nonnegative safe integers, preserve passive production, report total Gold as passive plus active Gold, keep active profit within the candidate policy's own declared share target, and prove at least five years of save/counter headroom. Production enablement is refused if any policy value or simulation is missing. The policy may not add debt or a currency, reduce passive income, or introduce a permanent multiplier.

## Tutorials, cast, and presentation

All seven accepted Phase 16 tutorials are gradual, contextual, skippable, logged, replayable, reward-neutral, and nonblocking. At most one tutorial auto-presents during a safe Restaurant visit; story, recovery, claim, and result presentation suppress auto-presentation. Skip never prevents service. Log and replay never create customers, stock, outcomes, claims, rewards, progression, metrics, or story effects.

Exactly seven Phase 16 cast hooks resolve for `fellow.deadpool`, `fellow.star-lord`, `fellow.spider-man`, `family.tamsin`, `family.jaina`, `family.tifa`, and `family.misty`. A locked Fellow never speaks. Mechanical copy remains speaker-independent. Visuals use only approved transparent cutout, approved framed treatment, or attributed text; an unframed full-background portrait overlay is forbidden.

## Actual-DOM browser gate

Five isolated realms cover 320×568, 390×844, 1024×768, 175 percent copy, and reduced motion. The runner queries actual nodes and styles for the physical hotspot, the Restaurant sheet, customer preference, recipe/station selection, Prepare, Serve, Claim, and Close. It checks five navigation items, 44×44 targets, viewport containment, horizontal overflow, keyboard activation, focus entry/return, Escape behavior, readable controls, and reduced-motion equivalence.

Escape before the preparation commit is write-neutral. Escape after commit may close the sheet but may not cancel or rewrite the persisted engagement. The root reviewer must also manually inspect visual composition and real-device behavior.

## Blind spots and required root review

Normalized QA output alone cannot prove good visual hierarchy, readable artwork composition, natural copy, physical-device browser behavior, or that an unexpected production path bypasses every instrumented seam. Actual-DOM checks reduce that blind spot but do not replace root review at every target viewport, inspection of changed production code, comparison of passive baselines, and regression runs for Phases 12–15.

Web Storage still has no atomic compare-and-swap. The coordinator's revision, raw-identity, staging provenance, same-tab guard, and storage-event behavior must narrow and detect the last reread-to-write race; this gate cannot eliminate the browser primitive's limitation.

# Phase 14 independent QA contract

## Status and authority

Phase 14 validates and tunes the Phase 13 First Covenant vertical slice. It does not implement the Village board or facility runtime; that work begins in Phase 15.

This additive gate is rooted at exact integration commit `c8c63b378ad9523b7d12be965335ff4ee6b81b4f`, the accepted Phase 13 content package, the living handoff's Phase 14 validation sequence, and the early Phase 15 facility data contract at design commit `102232b1784c08805d5078c7c9915a15fefe3b53`. It changes no production file, save, economy value, or artwork.

The gate freezes durable identity and behavior, not story prose, final reward amounts, balance targets, or facility runtime behavior.

## Runtime under test

The live matrix consumes the Phase 13 bridge already defined by the independent Phase 13 contract:

- `window.__EVERSTEAD_PHASE_13_QA__`
- version `phase-13-independent-qa-v1`
- read methods: `definitions`, `snapshot`, `validate`, `derive`, `renderModel`, and `raw`
- isolated methods: `resetFixture`, `event`, `story`, `tutorial`, `claim`, `advanceOffline`, `reload`, `simulateConcurrentClaim`, and `probeLegacy`

The bridge must remain absent in production and install only through the existing localhost `?qa=1` boundary with own literal destructive authorization, own literal isolated-storage attestation, and storage distinct from captured native `localStorage`.

Phase 14 may add deterministic fixture IDs and normalized pacing observations to this QA bridge, but it must not require or publish a Phase 14 facility-runtime bridge.

The additive normalized validation surface is `definitions().validation.phase14` and `derive().phase14Validation`. The definition advertises the exact policy string `measurement-only-no-unapproved-production-tuning`, profile IDs `fresh`, `midgame`, and `established`, and the deterministic Phase 14 fixture IDs. For the active profile, `phase14Validation` reports `profileId`, safe-integer starting Gold/joined Power/Stage-1 cost/Stage-1 required Power, `affordableConsecutiveFirstClears`, `totalStageCount`, `stage1Reachable`, `stopReason`, introduced story/tutorial IDs, pending manual claim IDs, `deadlockFree`, `simulationWrites`, and versioned canonical reward-impact rows. Each reward-impact row exposes the tested profile IDs, post-claim deltas, and an empty `forbiddenSystems` array. This is read-only measurement output, not production tuning.

The midgame, migrated, corrupt, and offline IDs in `qa/phase-14-independent/fixtures/contract-fixtures.json` are additive inputs accepted by `resetFixture`. A corrupt reset returns `ok:false`, `writes:0`, and the sorted `failedChecks` ledger while leaving the active raw save unchanged. Migrated derivation exposes honest `unknown` story/tutorial historical baselines plus zero invented completion and claim counts.

## Save-state matrix

The matrix covers:

- **Fresh:** no Phase 13 history; Waystone Call queues once on the first safe Village visit.
- **Midgame:** Council and Stage 1 introduction resolved; Stage 1 clear/resolution and Rank-2 arrival remain coherent.
- **Migrated:** established pre-Phase-13 progress receives honest unknown-history baselines, no invented completions/rewards, Tutorial Log availability, and at most one recap.
- **Established:** all currently shipped mechanics remain usable; Phase 13 activation/reload is idempotent and cannot create a reward cascade.
- **Corrupt:** unknown story/tutorial/cast/reward references, duplicate IDs, mismatched offer identities, and future versions fail validation and cannot be silently dropped or regenerated.
- **Offline:** elapsed processing stays capped at 24 hours and cannot duplicate story, tutorial, Legacy eligibility, offer, or receipt.
- **Multi-tab:** story/rank triggers remain idempotent and a simultaneous claim has one winner and one write-free loser.

Fresh, midgame, migrated, and established fixtures must validate before use. The corrupt fixture is expected to be refused without replacing the active valid state.

## First Covenant vertical-slice behavior

The five Phase 13 story identities remain exact:

1. `story.book1.prologue.waystone-call`
2. `story.book1.prologue.council`
3. `story.book1.chapter1.village-toll.intro`
4. `story.book1.chapter1.village-toll.resolution`
5. `story.book1.rank2.roadbound-arrivals`

The gate proves:

- Waystone Call appears once and never pays for watch, skip, or replay.
- Council becomes eligible after Waystone resolution but waits for the next safe user action.
- the Village Toll introduction precedes Stage 1 spend confirmation;
- its resolution follows the committed first clear exactly once;
- a Rank jump records the Rank-2 arrival once without story code granting roster membership;
- watched and skipped scenes enter Chronicle, remain loggable/replayable, and replay changes no persistent state or resources;
- the Village objective and Chronicle remain under existing navigation rather than creating a sixth bottom-navigation item;
- a speaker uses an approved transparent, framed, or attributed text-only treatment and never an unframed full-background portrait.

## Manual Legacy claims and exactly-once behavior

The bounded Phase 13 slice contains exactly one continuing Legacy track, one one-time feat, and one exactly-once manual claim. The offer remains banked with no expiry and no automatic credit. Claiming uses the shared Phase 12 transaction and creates one receipt. Progress carried beyond the approved threshold remains durable after claim and reload; Phase 13 does not invent or require an unapproved second tier.

Repeat click, replay, reload, offline time, stale state, malformed identity, and a second-tab race cannot reapply the global reward, local history, statistics, track advancement, or presentation. One concurrent claimant wins and the loser writes nothing. Carried progress remains present after reload. Major and standard claims remain individual and bypass an additional confirmation dialog.

The accepted product direction still calls for six continuing tracks and five one-time feats. Those additional definitions and their next-tier economies are reserved to the production-disabled Phase 15 definition package and remain null until explicit economy approval. This gate preserves that discrepancy explicitly: it does not mistake the bounded Phase 13 slice for the full launch set, and it does not require or enable the unapproved set early.

Claim presentation is observable at 320 and 390 widths and under reduced motion. Animation may accelerate, but the exact reward summary and result remain equivalent.

## Tutorial validation

- Every introduced Phase 13 feature points to a valid tutorial definition.
- Tutorials trigger only on relevant safe visits.
- Skip/close never blocks the feature.
- Log and replay remain available after skip or completion.
- Replay is presentation-only and cannot repeat rewards or completion effects.
- One auto tutorial is allowed per user-initiated surface visit; a fresh session allows at most two standalone tutorials.
- Dialogue, claims, recovery, confirmations, and encounter results suppress auto-presentation until a later safe action.
- Migrated/established saves receive no popup cascade.
- Tutorial state persists across reload and rejects unknown/duplicate/conflicting IDs.

## Cast coverage

The registry and content-coverage manifest retain exactly 18 Fellow and 20 Family stable IDs. Every cast entry has a profile quote, Village/ambient use, and a scheduled authored story, Chronicle, tutorial, facility, or interlude role. Locked Fellows never appear as joined speakers. Missing dialogue art uses an attributed approved fallback with no broken image.

This gate validates the complete current-cast ledger without requiring every person to appear in the opening Council.

## Campaign pacing and reward-impact measurement

Phase 14 measures rather than silently retunes production. The report includes the existing **Simulate-2H** debug reward profile as an observation; running the measurement may not commit it to the production save.

The normalized QA report includes fresh, midgame, and established profiles. For each it records starting Gold, joined Power, stage cost/Power requirements, affordable consecutive first clears, stop reason, story beats/tutorials introduced, pending manual rewards, and post-claim resource deltas.

Hard safety assertions are limited to:

- all measured amounts are finite safe non-negative integers;
- Stage 1 is reachable on the fresh profile;
- the fresh profile cannot immediately clear all ten stages;
- a required story/tutorial/claim never creates a progression deadlock;
- simulation itself performs no production write;
- each configured reward bundle is versioned, canonical, and simulated against fresh, midgame, and established profiles;
- no new currency, stamina, expiring claim, daily checklist, or unapproved permanent percentage multiplier appears;
- reward-impact output is marked `measurement-only-no-unapproved-production-tuning`.

The exact number of immediate clears and reward amounts are reported for review, not frozen here. Any approved tuning requires a separate focused production change and refreshed baselines.

## Corruption and recovery

Detached tamper probes validate that the successor definition/state graph rejects:

- unknown or duplicate story, tutorial, speaker, Legacy, offer, and receipt IDs;
- a dangling scene speaker or tutorial feature;
- mismatched offer/source/reward identities;
- a future definition or reward version;
- invalid Chronicle/history state;
- a claimed reward that remains pending.

Validation failure must not mutate the active save. Import/recovery remains under the Phase 12 checkpoint authority, and storage namespace/schema stay unchanged.

## Device, keyboard, focus, and motion matrix

The live runner covers 320×568, 390×844, 1024×768, and 390×844 reduced motion. It requires:

- no horizontal overflow or clipped active controls;
- visible, enabled, focusable Next, Back, Skip, Log, Close, Replay, and Claim controls when applicable;
- logical keyboard order and focus return after dialogue/tutorial/claim sheets close;
- Escape/close behavior that does not resolve or claim implicitly;
- 175% long-copy tolerance for the story/tutorial control row;
- no broken images or unframed full-background speaker overlays;
- result-equivalent reduced-motion presentation;
- zero warning/error console entries.

## Inherited regression boundary

- Schema remains 12 and the `phase-12-foundation-activation` receipt remains unique.
- Phase 12 definitions, unknown-history baselines, shared claim transaction, offline Gold, recovery authority, and dormant legacy modes remain valid.
- The Phase 12 focused probe remains 57/57 and the independent static gate remains 25/25 at the base.
- Phase 13 design/QA identities and the 47 Phase 11H portrait/cutout assets remain frozen.
- Campaign continues to use total joined-roster Power and deterministic targets.
- Legacy `story`, `tower`, `trading`, `patrol`, and `operations` modes remain dormant/write-free.

## Static early audit of the Phase 15 facility design

The accepted `design/phase-14` package is an early data contract feeding Phase 15. Phase 14 statically verifies, but does not execute, that contract:

- exactly twelve stable facility/activity/opportunity/local-progress identity tuples and physical Village anchors;
- hidden, discovered, available, and ready presentation states;
- banked opportunities are non-expiring and manually claimed;
- `productionEnabled` is false;
- interval cadence, bank capacity, unattended target, and production reward policy remain null/unapproved;
- Waystone generation is authored-event-only;
- all 33 tutorial references and all 38 cast hooks resolve;
- the design requires the trusted Phase 12 claim finalizer seam, schema/reference validation, and exact-once behavior before Phase 15 enablement.

No `src/phase14-facilities.js`, Phase 14 facility bridge, live hotspot, opportunity bank, local facility progression, or player-visible facility function is required for this gate to pass.

## Fail-closed rule

Exact integration commit `c8c63b3` must fail candidate/live Phase 14 validation because the Phase 13 story/Legacy/tutorial runtime bridge is absent. Facility design files cannot satisfy Phase 13 production assertions. A candidate with the complete Phase 13 runtime passes without any Phase 15 facility runtime.

## Blind spots

- The automated gate cannot judge whether the player emotionally understands Everstead, prose quality, celebration satisfaction, artwork aesthetics, public-use rights, or final localization.
- Pacing/reward simulations identify consequences but do not approve tuning values.
- The in-app Chromium matrix does not replace Safari/WebKit or physical-device testing.
- Web Storage has no atomic compare-and-swap; supported two-client probes cannot eliminate the platform's final reread-to-write race.
- Facility framework runtime, facility economy, and Village-board interaction remain Phase 15 work.

# Everstead Phases 20–21 — Independent Village Facilities QA Contract

## Scope and exact boundary

This QA-only package gates eight distinct production activities against the accepted `design/phase-20-21/*` package and released Phase 12–19 seams. It begins at exact integration commit `fa004195a36dcbcd5be4ad9d73357a63cf50f3f7`. It does not implement or emulate a production facility engine, approve null policy values, edit accepted design, ingest art, copy reference-game assets or trade dress, touch deployment, merge, or push.

The exact base intentionally has no Phase 20/21 runtime or QA bridge. Candidate validation must therefore fail at a precise declared set of absent-runtime boundaries. Package/design checks must pass independently of those expected failures.

Inherited contracts remain authoritative:

- the Phase 12 clone → mutate → validate → commit → adopt coordinator and canonical reward kinds;
- the Phase 14 non-expiring opportunity envelope, stable ordinals, captured details, and manual claim lifecycle;
- the Phase 15 V2 offer/receipt/archive factory, immutable trusted-finalizer registry, 512-receipt window, and 128-receipt folding;
- the Phase 17 story/capability/opening authority and physical Village anchors;
- the Phase 18–19 successor migration, validation, claim, and tutorial registry seams;
- all released save/import/recovery/offline behavior, especially the 24-hour elapsed cap.

## Frozen QA bridge

The candidate exposes local/query-gated `window.__EVERSTEAD_PHASE_20_21_QA__`, version `phase-20-21-independent-qa-v1`. It captures the selected injected storage adapter and rejects destructive calls unless `runtime.qa.allowDestructive === true`, `runtime.qa.isolatedStorage === true`, and the adapter is not the captured native `localStorage` object. Caller-supplied registries, policies, finalizers, clocks, quantities, rewards, actors, and identities are rejected.

Read methods expose only normalized evidence: `definitions()`, `snapshot()`, `validate()`, `derive()`, `raw()`, `exportSave()`, `passiveBaseline(capturedAt)`, `policyReport()`, `boardModel()`, and `forbiddenSystemReport()`.

Destructive methods operate only on isolated fixtures: `resetFixture()`, `reload()`, `importFixture()`, `migrate()`, `advanceOffline()`, `settle()`, `begin()`, `choose()`, `commitEngagement()`, `cancelEngagement()`, `advanceGrowth()`, `resolve()`, `claim()`, `tutorial()`, `simulateConcurrent()`, `mutateInvalid()`, and `probeFinalizerFailure()`. DOM presentation must be opened through the real hotspot only, never through a bridge helper.

The browser realm loads the real candidate `index.html`, injects only memory storage/clock/random/ID adapters before production scripts, and calls only that production bridge. It never installs a fake facility runtime.

## Shared lifecycle and release policy

Every one of the eight opportunities uses its exact registered Phase 12 activity as claim source, banks deterministically, never expires, preserves partial carry, and stops cleanly at capacity without hidden whole-interval debt. Offline may settle eligible opportunities but never selects participants/attendees/evidence/choices/stock/crops/work, resolves, claims, runs a tutorial, or consumes an integration hook. Gardens alone may advance an already committed crop to `harvest-ready`; it may not harvest, claim, replant, or spoil it.

Opening, reading, closing, replaying story, or replaying tutorials is mechanically neutral. Engagement commits an immutable, version-bound domain detail. A result creates one manual offer and pays nothing until Claim. Each trusted finalizer revalidates the full preimage, builds one allowlisted global/local plan, updates domain history and metrics, consumes owned state, adds claimed-ordinal/replay authority, writes one V2 receipt/archive update, validates, and commits once. Missing, throwing, local, global, receipt, archive, stale, malformed, reload, and two-client failures have zero partial effects.

All cadence, capacity, selection, reward, local progress, relationship, Gift, stock, growth, mastery, integration, parity, and acceleration values remain null and production-disabled until separately approved. `0`, a generic default, a Restaurant/Apothecary/Schoolhouse value, or the synthetic QA fixture cannot substitute for null. The 27 accepted release gates remain blocked until real evidence exists.

## Phase 20 — original four active interactions

### Passive boundary

Command Center, Archives, Training Grounds, and Hearth retain the released Building level, upgrade path, passive Gold production, Oath multiplier, 24-hour offline collection, Family assignment, and Family production contribution. Active state is additive and uses separate local progress. Training participants and Hearth attendees never replace assigned Family; Fellows never staff Buildings.

`passiveBaseline(capturedAt)` derives immutable production and Family-assignment semantics for exactly the original four at one captured timestamp. It excludes volatile balances/timestamps and raw `boostDay`, preventing legitimate wall-clock rollover from being mistaken for a regression while still detecting changes to effective same-time rates, formulas, levels, assignments, or Oath effects. Every representative active flow compares its before/after baseline inside the same reset fixture; no cross-fixture comparison is evidence.

### Command Center

A banked petition presents stable interests and approved immediate-effect preview, then records one bounded choice. It has no hidden permanent branch, combat check, or Restaurant match. Resolution pays nothing; manual Claim may apply only approved Prosperity/Gold/Influence/Chronicle deltas through `commandPetitionFinalizerV1`. Null choice effects keep the activity disabled.

### Archives

A banked lead contains a map, lore, or Relic research branch and stable evidence. Invalid reconstruction returns to the same lead without consuming it, creating an offer, or changing discovery/mastery. A valid Documented/Breakthrough result waits for manual Claim through `archivesResearchFinalizerV1`. Archives cannot directly mutate equipped Relics.

### Training Grounds

A drill selects unique eligible presentation participants and a formation. It cannot injure, lock, spend, level, assign, or mutate actors; cannot alter Campaign/Tower total-roster Power; and cannot create selected-squad combat rules. Completed/Refined results remain manual through `trainingDrillFinalizerV1`.

### Hearth

A gathering selects unique eligible attendees and hosts a relationship scene. It has no forced pairing, romance checklist, relationship spending, or expiry. Relationship/interlude/Gift effects remain zero until `hearthGatheringFinalizerV1` commits an approved positive-only plan. The deterministic claim-time Gift roll is captured once and cannot reroll on replay.

## Phase 21 — opportunity-only expansion

Gatehouse, Market/Workshop, Gardens, and Forge occupy physical Village anchors and provide active acceleration only. They are not passive Buildings, do not receive Building levels/Oath production multipliers/Family Building assignments, and do not add a detached management surface.

### Gatehouse

The player assesses immutable route conditions and visitor needs before choosing a reception. An incompatible reception returns to assessment without consuming the caravan or paying. Welcomed/Prepared results use manual `gatehouseCaravanFinalizerV1` claims and may add only allowlisted route-trust/history/Chronicle effects.

### Market/Workshop

Orders capture immutable requirements and fulfillment choices. Approved facility-local stock is reserved only at the commitment boundary. Cancel before commitment restores/no-ops cleanly; closing after commitment resumes the same reservation. Caller quantities are never trusted. Fulfilled/Exacting results claim through `workshopOrderFinalizerV1`.

### Gardens

One valid plot and crop choice commits a Growing identity. Approved foreground/offline time may make that exact identity Harvest Ready; clock rollback cannot shorten growth. Harvest never expires or spoils. There is no automatic claim/replant. Manual `gardensHarvestFinalizerV1` claim applies the approved reward/Cultivation/history once and frees the plot.

### Forge

Commissions capture exact stock requirements and a work choice. `forge.stock.relic-stones` is an adapter alias over the existing authoritative Relic Stone balance, never a second persisted currency. Workshop components remain optional facility-local input. `forgeCommissionFinalizerV1` cannot accept caller-selected item mutation and V1 forbids affixes, reforging, and advanced Relic sets.

## Cross-facility integrations

The exact ten hooks derive optional, positive-only variant eligibility from committed source-claim metrics. Every facility succeeds through its baseline flow with all integrations disabled. Hooks create no persisted token/currency inventory, mandatory input, circular prerequisite, same-transaction cascade, offline consumption, or automatic claim. Target settlement captures exact hook/variant versions. Null threshold/formula/cap keeps all integrations disabled.

## Story, tutorials, cast, and dialogue

Story discovery, capability, and opening use the exact Phase 17 IDs for each physical anchor. Replay creates no opportunities or grants. Grandfathered operational successors do not relock or repeat grants.

Exactly 19 existing IDs from the 79-ID tutorial ledger are registered: three shared and two contextual per facility. Tutorials are gradual, contextual, nonblocking, skippable, logged, replayable, and reward-neutral. Shared tutorials do not repeat after predecessor completion. A mastery/effect tutorial never presents a null policy as active; at most one tutorial auto-presents during a safe visit. Open/replay may persist only `tutorialExtension`/predecessor tutorial-ledger deltas plus ordinary save revision provenance. The bridge reports zero reward applications and zero feature blocks; resources, passive behavior, facilities, opportunities, claims, receipts, story, roster, and every other mechanical field remain equivalent.

The Phase 20–21 facility subset is exactly 45 accepted hooks across 28 current actors. Separately, every shipped Fellow and Family member—all 18 Fellows and 20 Family—retains a profile quote and ambient Village-comment role plus the previously scheduled authored/story/facility role. This phase does not force all 38 into these eight activities. Locked Fellows never speak. Mechanical copy never depends on the speaker.

Dialogue uses original Everstead writing and localization-safe IDs. Presentation fallback is transparent cutout → approved frame → attributed text only. Full-background character-sheet art never appears as an unframed Village dialogue overlay. Facility sheets may adopt original Everstead visual polish but may not ingest or imitate reference-game assets, layout, iconography, or trade dress.

## Migration, import, recovery, concurrency, and archive

`migration.phase-20.original-four-active.v1` then `migration.phase-21.expansion-facilities.v1` run after the exact Phase 19 successor. Each validates predecessor state and registries, adds only its owned empty profiles/replay keys/definition receipts, derives story state honestly, creates no value under null policy, preserves passive and predecessor bytes, validates, and commits once. Repetition is byte-stable.

Import/recovery adopt nothing until complete successor, details, reservations, actor references, story capabilities, finalizer registry, archive chain, and replay authority validate. Future/corrupt input remains exportable without replacing active state. The declared malformed/forbidden matrix rejects before write.

Concurrency covers settlement and resolution for all eight, Workshop/Forge reservation, Garden growth, every finalizer, and archive folding. Exactly one client wins; losers write nothing; no duplicate opportunity, detail, reservation, maturity, outcome, reward, local progress, relationship, Gift, stock, metric, receipt, or archive range appears. Web Storage's final reread-to-write no-CAS interval remains a documented residual risk.

## Physical board, mobile, and accessibility

All facilities remain on the Village picture. Hidden, discovered/dim, available, and claim-ready icon states have non-color-only text and accessible names. Tapping one physical hotspot opens one focused sheet. The bottom navigation remains exactly five items; no sixth facilities tab and no detached Building-management grid exist.

The live runner covers 320×568, 390×844, 1024×768, 130-percent text, and reduced motion. It resets a presentation-safe all-unlocked fixture, queries real hotspots/sheets, and opens each sheet through exactly one actual hotspot activation—never a programmatic bridge open followed by duplicate DOM events. It verifies 44×44 targets, viewport containment, horizontal overflow, status text, semantic controls, focus inside the opened sheet, Escape focus return to the opener, and write neutrality. Reduced motion requires a production runtime marker plus a real static CSS media-rule contract; injected `matchMedia` alone is insufficient.

## Explicit forbidden-system gate

Candidate definitions/state/UI must demonstrate the absence of facility stamina, new global facility currency, expiring/daily-reset opportunity loss, detached grid, sixth navigation item, Family Blessing track, Fellow Building staffing, duplicate Relic Stone balance, Claim All, Garden spoilage/auto-replant, advanced Forge affixes/reforging/sets, and copied reference-game assets or trade dress.

## Required preimplementation result and blind spots

At the exact base, package validation passes while candidate validation fails only the 15 declared runtime boundaries: bridge; predecessor finalizer/V2 seams; eight registries; each of eight distinct activity runtimes; migration/offline/concurrency/archive; story/tutorial/cast; physical board/DOM; and forbidden-system reporting.

The browser baseline must stop safely when the bridge is absent: ten package rows pass, and every isolated realm returns only `bridge-present` plus `phase20-21-contract-unavailable` as expected failures. A later implementation continues into behavior and actual-DOM checks.

This gate cannot approve null product values, final copy, art rights, visual quality, economic parity, five-year archive/save-size headroom, Safari/real-device behavior, or the irreducible Web Storage no-CAS interval. Root must independently inspect diffs and rerun all Phase 0–19 gates before release.

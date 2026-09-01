# Phase 15 independent QA contract

## Status and authority

Phase 15 turns the existing Village picture into the physical game board and installs the shared facility opportunity, result, manual-claim, tutorial, and persistence foundation. Restaurant gameplay remains Phase 16. This additive independent gate changes no production file, save, economy value, feature flag, artwork, design package, deployment, or remote branch.

The gate is rooted at exact private integration commit `7e74226d64f819bf7be40f969078ed16c3fce356` and these accepted contracts:

- `design/phase-14/*` for the twelve facilities and shared opportunity/finalizer lifecycle;
- `design/phase-15-16/*` for tutorial successors, cast hooks, V2 claims, and the Phase 15/16 seam;
- `design/phase-17/*` for twelve unique physical anchors and story-driven discovery/opening;
- Phase 12 for schema-12 save authority, capped offline settlement, canonical reward bundles, trusted claim transactions, and recovery;
- Phase 13 for First Covenant story, Chronicle, gradual tutorials, and the exact 18-Fellow/20-Family cast registry.

The package freezes safety, identity, and observable player behavior. It does not approve facility cadence, bank capacity, reward amount, active-profit percentage, recipe/case/pupil content, final map art/CSS, or any Phase 16 Restaurant runtime.

The gate explicitly covers non-expiring opportunity banks and the locked-Fellow dialogue rule.

## Runtime seam under test

The implementation exposes a QA-only bridge only on the already trusted localhost `?qa=1` boundary:

- `window.__EVERSTEAD_PHASE_15_QA__`
- version `phase-15-independent-qa-v1`
- read methods: `definitions`, `snapshot`, `validate`, `derive`, `raw`, `exportSave`, and `passiveBaseline`
- isolated methods: `resetFixture`, `event`, `openFacility`, `settle`, `begin`, `cancel`, `resolve`, `claim`, `tutorial`, `advanceOffline`, `reload`, `importFixture`, `simulateConcurrent`, `probeFinalizerFailure`, and `mutateInvalid`

The bridge must be absent in production. Destructive methods require own literal `allowDestructive:true`, own literal `isolatedStorage:true`, and a selected storage object distinct from captured native `localStorage`. The bridge may normalize observations but must delegate to the real production definitions, validators, coordinator, opportunity planners, immutable finalizer registry, V2 archive, tutorials, and DOM renderer. A QA-only parallel implementation cannot satisfy code review.

## Physical Village board

The Village artwork remains the physical board. Exactly twelve stable facility IDs map to the twelve unique Phase 17 anchors in `contract-fixtures.json`. The runtime normalizes the design vocabulary as follows:

| Phase 17 design | Runtime | Player meaning |
|---|---|---|
| `hidden` | `hidden` | no icon and no spoiler label |
| `discovered-locked` | `discovered` | dim icon; location is known but its active capability/opening is absent |
| `available` | `available` | normal compact icon and activity/status sheet |
| `claim-ready` | `ready` | non-color-only ready badge; claim-ready outranks opportunity-ready |

All twelve nodes live inside the Village artwork container. They do not form a detached management grid and do not create a sixth bottom-navigation item. Each non-hidden node identifies its facility, physical anchor, current state, name, current activity, and accessible status. Shared plaza regions use disambiguated Phase 17 anchors so Restaurant/Workshop and Apothecary/Schoolhouse never collide.

At 320×568, 390×844, 1024×768, reduced motion, and 175 percent copy, the board has no page-level horizontal overflow, clipped active control, overlapping focus target, or color-only status. Compact icons remain at least 44×44 CSS pixels. Reduced motion disables looping glow, camera movement, automatic pan, and parallax without changing availability or results.

## Story discovery and capability opening

Story is discovery authority; capability plus opening content is active-interaction authority. Each of the twelve Phase 17 mappings is exact and stable.

- Resolving discovery content changes `hidden` to `discovered` once.
- A location becomes `available` only when its required capability exists and opening content resolves.
- A ready bank or manual claim changes presentation to `ready` without rewriting discovery history.
- A future facility may be discovered in Phase 15 but cannot open or generate work without its later capability.
- Already operational successor facilities are grandfathered and receive missing Chronicle/tutorial context without relocking, grants, reward replay, or retroactive accrual.
- A newly active interval facility sets `unlockedAt` and `cursorAt` to the one captured activation time. It never backdates to story completion, Campaign clear, Rank, installation, or migration.

The Waystone is `authored-event` only. It presents objectives and native Story/Legacy claims. It has no interval, carry, capacity, timed opportunity, or rewritten facility claim source. Phase 15 must not create a duplicate Waystone facility offer for a native Legacy or Story claim.

## Shared facility lifecycle

The live synthetic policy exists only in isolated QA storage because production economy remains unapproved. It proves the real shared engine without enabling Restaurant or choosing production values.

1. Settlement uses one captured `now`, the existing 24-hour cap, saved interval context, deterministic monotonically increasing facility ordinals, and capacity saturation.
2. Instantiated opportunities are immutable and have `expiresAt:null`. Midnight, reload, offline passage, full banks, version updates, and missed visits do not remove them.
3. Begin moves one banked item to resumable `engaged`; reload preserves it. Safe cancel returns it to banked.
4. Resolve revalidates the live expected identity, records a version-bound immutable outcome, queues one canonical Phase 12/V2 offer, and credits no global resource or reward-bearing local progress.
5. Manual Claim invokes the immutable production finalizer registered for `opportunity.facility.activity`. One coordinator transaction applies the canonical global bundle, allowlisted local deltas, completion lineage, statistics, and receipt/archive evidence, then removes the pending result.
6. Missing/throwing finalizer, stale raw/revision, wrong facility/ordinal/version/detail/outcome/offer/save binding, archive capacity, or validation failure aborts without writes or partial effects.

Two-client settlement derives the same ordinals and has one winner; two-client begin/resolve cannot create two outcomes/offers; two-client claim has one winner, one write-free loser, one receipt, one global application, and one local application. The known Web Storage final reread-to-write race remains a platform limitation, not permission to weaken these checks.

## Stable ordinals and V2 bounded claim archive

Phase 15 migrates the Phase 12 claim lane atomically into `claim-archive.phase-15.v1` while retaining schema 12 and the unique Phase 12 activation receipt.

- Existing pending offers and detailed receipts remain semantically and identity valid.
- Every migrated V1 predecessor claimed offer ID enters a fixed replay set before old details may fold. Folded V2 facility receipts never enter that set; their permanent replay authority is the facility's canonical claimed-ordinal ranges.
- `nextSequence` is a safe integer and `throughSequence + recentReceipts.length === nextSequence`.
- The recent window retains 512 full receipts. The 513th folds the oldest 128 into the save-bound checkpoint, leaving 385 recent receipts and `throughSequence:128`.
- Checkpoint identity chains the prior checkpoint plus the exact ordered folded receipt identities; aggregate rewards and source counts are canonical safe integers.
- Domain replay authority uses canonical claimed ordinal ranges. Ranges are sorted, disjoint, non-adjacent, bounded, and cross-checked against receipts/checkpoint lineage.
- Export/import/reload preserve checkpoint identity, predecessor replay set, pending offers, ordinals, ranges, and all still-active captured versions.

The package proves bounded mechanics and safe arithmetic. It cannot prove a five-year save-size budget until a maximum production cadence is approved; Phase 15 must report that unresolved gate honestly rather than inventing cadence.

## Save, migration, import, recovery, offline, and corruption

Deterministic fixtures cover fresh, story-discovered, mixed board states, synthetic empty/banked/engaged/claim-ready, 512-receipt archive, migrated, established, offline, recovery-stage, corrupt, future-version, and locked-roster profiles.

- Activation is additive/idempotent and creates no retroactive opportunity, reward, completion, claim, or known-history fiction.
- Existing original-Building production, rates, upgrades, Oath modifiers, pending/offline Gold, and Family assignments are byte-equivalent before/after activation and facility-only actions.
- Offline time can settle eligible synthetic opportunities but never opens story, completes a tutorial, resolves work, creates a reward outcome, or claims anything.
- Import validates the complete successor graph before adoption. Invalid/future state is preserved for export/recovery and blocks current mutation; it is never silently dropped, regenerated, or downgraded.
- Recovery staging retains Phase 12 provenance and chooses one valid authority without duplicating a facility instance, outcome, claim, archive sequence, or activation receipt.
- Corrupt and invalid-mutation probes return a sorted check ledger, make zero writes, and leave active raw/revision/resources/local progress unchanged.

## Tutorials and all-cast dialogue

Phase 15 installs the five Phase 15 tutorial successors from `design/phase-15-16/tutorial-extension.json`. The facility-board tutorial is contextual to first Waystone discovery; Legacy tutorials remain contextual to their actual features. Each is non-blocking, immediately skippable, logged, replayable, localization-safe, and rewardless.

Only one tutorial auto-presents per safe user-initiated surface visit. Story, recovery, claim celebration, confirmation, and activity-result presentation suppress tutorial auto-open until a later safe action. Skip/completion persists; replay and log are presentation-only; no tutorial creates, consumes, resolves, or claims an opportunity.

All 38 existing cast records and all accepted Phase 15–21 facility hooks resolve to registered actors. Mechanical instructions do not depend on a speaker. A Fellow may be selected only when their authoritative joined Rank permits it; otherwise deterministic Family/joined-Fellow/text fallback applies. Dialogue uses approved cutout, framed, or attributed text-only treatment and never an unframed full-background character-sheet portrait.

## Actual-DOM browser gate

The live runner loads the real candidate `index.html` into five isolated browser realms. It reads actual production DOM nodes and computed geometry—not only a bridge render model—to verify:

- one five-item bottom navigation;
- one board container and twelve stable hotspot nodes, with hidden nodes non-interactive/non-spoiling;
- state, anchor, label, minimum target size, viewport bounds, and collision-free focus targets;
- opening a hotspot produces the real sheet, moves focus inside, exposes name/activity/status, and Escape/Close returns focus without resolving or claiming;
- 175 percent copy, mobile/wide, and reduced-motion behavior;
- zero native-storage access and zero warning/error console output.

The bridge remains useful for persisted invariants, deterministic concurrency, and exact transaction evidence. A claimed DOM assertion must be backed by queried nodes, attributes, focus, `getBoundingClientRect`, or computed style.

## Inherited regression boundary

Frozen provenance and inherited hashes are read from exact Git objects at `7e74226`, never from a future working-tree candidate. Candidate mode inspects current production separately. Package ownership rejects any commit touching Phase 15 QA/docs that also changes production, design, artwork, or unrelated QA.

The gate retains:

- schema 12 and one `phase-12-foundation-activation` receipt;
- the Phase 12 validated clone → mutate → validate → commit → adopt coordinator, storage recovery, offline cap, and native claims;
- Phase 13 First Covenant, Chronicle, five bottom tabs, story/manual-claim/tutorial behavior, and exact 38-person registry;
- total-roster Power, Campaign, Rank, Relics, Might, Mastery, and dormant old Story/Tower/Trading/Patrol/Operations modes;
- the original four passive Buildings, Gold economy, upgrades, Oath multipliers, and Family assignments.

## Fail-closed rule

Exact current candidate `7e74226` contains accepted Phase 13 plus the Phase 14 validation package, but no Phase 15 player-visible board/framework runtime. Package-only verification must pass, while candidate/static and each live realm must fail explicitly on the missing Phase 15 bridge/runtime. Design JSON, a fake QA engine, or a Phase 16 Restaurant prototype cannot satisfy the gate.

After implementation, the gate must not require a production cadence, capacity, reward amount, enabled Restaurant, Restaurant customer/recipe/station UI, or any later facility activity. Null/unapproved economy must remain null in production definitions.

## Blind spots and required root review

- Automated DOM inspection cannot judge visual hierarchy, the artistic fit of icons on the Village picture, prose warmth, celebration satisfaction, accessibility comprehension, or public-use rights.
- Chromium isolation does not replace Safari/WebKit, assistive-technology, or physical-device testing.
- Programmatic focus and bounding boxes cannot prove every OS/browser keyboard path; root must manually exercise Tab, Shift+Tab, Enter/Space, Escape, focus return, and zoom on the actual candidate.
- Synthetic QA cadence proves engine rules, not production balance or five-year maximum-cadence storage size.
- Two-client tests narrow but cannot eliminate Web Storage's lack of atomic compare-and-swap.
- Root must inspect bridge delegation and production call sites; normalized QA output alone cannot prove the app uses the production engine.

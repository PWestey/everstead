# Phase 13 independent QA contract

## Status and authority

This is an additive, implementation-independent release gate for the First Covenant vertical slice. It is rooted at the exact released Phase 11H commit `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c` and derives its Phase 13 identities from design commit `73b807a36cb0ddb12fe726b3d271f7c4779e5ba9`.

The package does not change `index.html`, production modules, save data, art, or earlier QA. It freezes durable identity and observable behavior, not dialogue prose, reward amounts, animation timing, or economy tuning.

## Candidate bridge

The live gate consumes `window.__EVERSTEAD_PHASE_13_QA__` with version `phase-13-independent-qa-v1`. The bridge must be absent in production and installed only through the existing localhost `?qa=1` test configuration. State-changing methods require the existing explicit `allowDestructive === true`, `isolatedStorage === true`, and non-native storage boundary.

Required read-only methods:

- `definitions()` — detached definitions for story, tutorial planning, cast coverage, opening-speaker presentation, legacy dormancy, and the Phase 12 seam.
- `snapshot()` — a detached canonical state snapshot.
- `validate()` — `{ok, errors}` for the current state.
- `derive()` — detached normalized `resources`, `story`, `tutorials`, `claims`, and `roster` observations used by the gate.
- `renderModel()` — current dialogue/tutorial/Chronicle/claim presentation without exposing the DOM as authority.
- `raw()` — the exact active isolated-storage payload.

Required isolated methods:

- `resetFixture(id)`
- `event(id, payload)`
- `story(id, action)` where `action` is `watch`, `skip`, `replay`, `next`, `back`, or `log`
- `tutorial(id, action)` where `action` is `open`, `complete`, `skip`, `replay`, or `log`
- `claim(id)`
- `advanceOffline(milliseconds)`
- `reload()`
- `simulateConcurrentClaim(id)`
- `probeLegacy(mode)`

Every result must be serializable and detached. Unknown IDs/actions fail closed. Rejected operations leave raw state, revision, queued presentations, and receipts unchanged.

`derive()` exposes story `activeId`, `pendingIds`, `history`, and Chronicle IDs; tutorial `activeId`, state rows, log IDs, auto-present counters, and feature availability; claim rows with ready/claimed status, immutable reward snapshot, expiry, and receipt count; and authoritative joined-Fellow/Family IDs. `renderModel()` exposes the active control states, presentation mode/speaker, image requests, bottom-navigation count, horizontal-overflow result, and reduced-motion state. These are normalized QA observations, not a second source of gameplay truth.

## Frozen identity gates

### First Covenant scenes

Exactly these Phase 13 story identities are required:

1. `story.book1.prologue.waystone-call`
2. `story.book1.prologue.council`
3. `story.book1.chapter1.village-toll.intro`
4. `story.book1.chapter1.village-toll.resolution`
5. `story.book1.rank2.roadbound-arrivals`

Each scene has 4–8 stable beat IDs, valid speaker references, and `next`, `back`, `skip`, and `log` controls. Choices, if present, are presentation-only in Phase 13. Copy and beat wording are deliberately not frozen.

### Cast retention and coverage

The manifest retains exactly 18 Fellow IDs and 20 Family IDs from Phase 11H. Every entry must expose non-empty, reference-valid:

- `profileQuoteId`
- `ambientIds`
- `authoredContentIds`

Only joined Fellows may be selected for live dialogue, ambient remarks, or tutorials. Selection is deterministic and read-only. Family remains available under the schema-12 rule. Coverage assignments may target later phases; the gate does not force all 38 people into the opening scenes.

### Opening art decisions

Phase 13 must explicitly resolve `family:elara`, `family:tamsin`, `family:isolde`, and `fellow:deadpool` to exactly one approved dialogue presentation:

- `transparent-cutout`
- `approved-framed`
- `attributed-text-only`

A transparent cutout must use an alpha-capable dialogue asset distinct from the original full portrait. A framed presentation must be declared reviewed and rendered inside the dialogue UI. A text-only presentation must retain speaker attribution and emit no broken-image request. A rectangular full-background profile may never appear as an unframed Village overlay. Phase 11H character-sheet art remains byte-preserved.

### Tutorial identities

The runtime registry contains the 41 Phase 13 tutorial definitions listed in the fixture. The planning coverage manifest retains all 79 Phase 12–21 tutorial identities and the explicit Phase 12/14 `notPlayerVisible` dispositions. Every Phase 13 tutorial is non-blocking, skippable, replayable, and loggable, has no reward, and is not a gameplay prerequisite.

## Observable story behavior

- A fresh Village boot queues Waystone Call once.
- Watching, skipping, or replaying Waystone Call changes no resource balance and creates no claim.
- Resolving or skipping Waystone Call makes Council eligible, but Council waits for the next safe user-initiated Village visit and never overlays an active modal.
- The Village Toll introduction resolves before the Stage 1 spend confirmation. It does not pay or clear the stage.
- The Village Toll resolution queues only after `broken-roads-1` first-clear commit. Any reward becomes a banked manual claim, never an automatic scene reward.
- A Rank jump from below 2 to 3+ records Rank-2 arrivals exactly once, ahead of later-rank arrivals, without granting or altering roster membership.
- Replay changes neither story history, resources, claims, roster, Rank, nor tutorial state.
- Chronicle lists watched and skipped required scenes, offers replay and dialogue log access, and keeps Tutorials on a separate shelf under More. No sixth bottom-navigation destination is added.

## Observable tutorial behavior

- Tutorial state distinguishes `seen`, `dismissed`, and `completed`; replay is presentation-only.
- Skip/close immediately returns control to an already-usable feature.
- One auto tutorial is allowed per user-initiated surface visit; a fresh session allows at most two standalone auto tutorials. Embedded first-scene controls do not consume that cap.
- Dialogue, confirmations, claim celebrations, recovery, and encounter results suppress auto presentation until a later safe user action.
- Established/migrated saves receive the Tutorial Log and at most one relevant recap, never a popup cascade.
- Locked Fellows never become tutorial speakers. Missing art uses attributed text-only presentation.
- Unknown tutorial IDs, duplicate state IDs, a pending completed/dismissed tutorial, or tutorial rewards make validation fail.

## Exact-once manual claims

Story and Legacy eligibility creates immutable banked offers. A claim commits reward and receipt in one validated transaction. Repeated click, reload, more offline time, second-tab race, and replay all return an already-claimed/refused outcome with no second payout. Exactly one concurrent claimant wins. Offers do not expire.

The gate freezes receipt/offer identity and behavior, not reward amounts. It compares before/after resource deltas to the offer snapshot returned by the candidate.

## Compatibility gates and Dormant legacy modes

- Schema remains 12.
- The unique `phase-12-foundation-activation` receipt and Phase 12 definition/state shape remain valid.
- Phase 13 uses the Phase 12 shared claim/event/tutorial seams rather than a parallel store.
- Existing schema-12 checkpoint/recovery authority is not bypassed.
- Offline elapsed time remains capped at 24 hours.
- Phase 11H full portraits, thumbnails, and existing cutouts remain external and byte-preserved.
- Current Campaign total-owned-roster Power and deterministic Rank membership remain authoritative.
- Legacy `story`, `tower`, `trading`, `patrol`, and `operations` modes remain dormant: no player navigation, no reward, no progression mutation.

## Mobile, accessibility, and motion

The live runner uses 320×568, 390×844, and 390×844 reduced-motion realms. It requires visible and enabled Next, Back, Skip, and Log controls; no horizontal overflow; no clipped active control; focusable controls; no broken image; and zero warning/error console entries. Reduced motion must suppress non-essential dialogue/cutout transitions without changing results. Candidate CSS must tolerate 175% test-string expansion without hiding controls.

## Fail-closed rule

The exact Phase 11H preimplementation build must fail candidate mode because the Phase 13 bridge and definitions are absent. A missing bridge, wrong version, native-storage test realm, malformed definition, missing identity, invalid reference, or unavailable behavior produces explicit failing rows. The runner never marks absence as a skip or pass.

## Blind spots

- The gate cannot judge prose quality, lore tone, voice imitation, public-use rights, final art aesthetics, or localization accuracy.
- Browser checks cover the in-app Chromium surface, not Safari/WebKit or physical devices.
- Web Storage still lacks atomic compare-and-swap; the gate proves one-winner behavior through the candidate's supported two-client simulation but cannot eliminate the platform's final reread-to-write interval.
- Exact reward values and balance are intentionally outside this identity/behavior contract.
- Transparent alpha quality and edge cleanup need visual/art review even when file and presentation contracts pass.

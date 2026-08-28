# EVERSTEAD — PHASE 6 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 5 package commit `4c2f27b02d177afbf08898eee68a4b552b4c3d8c` (accepted production commit `bb6a94d6050e77f9810621edb05585adeff465cf`, artifact SHA-256 `88f09da59da19e9210ef25efed5e1a410d95c0382122fe2f4f6a785872de4338`).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2` is authoritative. Companion Campaign is the targeted Companion-shard lane. Companion Tower is the broad passive lane for Companion EXP, non-spendable global Companion Mastery, and random Companion shards. Both modes use Total Companion Roster Power.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0` defines Phase 6 as Companion Campaign, Companion Tower, and the Mastery idle lane. It requires a separate Tower claim clock/cap, deterministic close/reopen claims, and no Tower Gold faucet.
- Preserve the single-file mobile shell, embedded art bytes, central Power pipelines, transactional persistence, and every accepted Phase 0–5 invariant.

## Objective

Give Companions repeatable targeted progression and a distinct passive growth lane. Add a ten-stage Companion Campaign, rebuild the disabled legacy Tower as a Companion-only fifty-floor challenge, activate global Companion Mastery, and add deterministic claim-time Tower EXP/Mastery/random-shard rewards without duplicating or repricing elapsed entitlement.

## Scope boundary

### Keep as-is

- Compatibility namespace `oathforge_new_world_proto_v01`, five-item bottom navigation, mobile cards/modals/toasts, reduced-motion support, and embedded portrait/background bytes.
- Village/Building Gold production, 24-hour Village claim, Prosperity, Oaths, Gifts, Family drops/assignments/Bonds, Fellow progression, Player Rank, Fellow Campaign, and Companion EXP/Level/rarity/assignment.
- The authoritative `effectiveCompanionPowerComponents`, `totalCompanionRosterPower`, `effectiveFellowPowerComponents`, and 40% assigned-Companion transfer pipeline, except for replacing the neutral Mastery hook with the Phase 6 derived multiplier.
- All accepted migration receipts, checkpoints, staging ownership, safe-reset lineage, export, diagnostics, cross-tab refusal, and isolated-QA authorization guarantees.

### Reuse with migration

- Reuse the Fellow Campaign definition/preview/confirmation/re-preview/atomic-run/receipt/presentation pattern through a strictly allowlisted shared encounter coordinator.
- Reuse the walking/slideshow scene for Companion Campaign with Companion-specific definitions, Power, rewards, salts, actions, and state.
- Reuse only the disabled legacy Tower's card/node/background presentation ideas. Do not reuse its Fellow squad, counter, Gold, Prosperity, or reward mechanics.
- Reuse stable save-seeded rolls, safe-integer helpers, elapsed-time carry patterns, roster cards/profiles, diagnostics, and the central clone → accrue old entitlement → mutate → validate → commit → adopt coordinator.

### Replace

- Replace the neutral `COMPANION_CONFIG.masteryMultiplier = 1` hook with derived global Mastery Level and multiplier selectors.
- Replace canonical legacy `towerFloor` with schema-7 Companion Tower state. Do not map its progress or rewards.
- Replace the one-subview Adventure route with explicit `fellowCampaign`, `companionCampaign`, and `companionTower` subviews.
- Replace any active neutral “Mastery stays neutral in Phase 4” copy with actual Mastery progress and Power impact.

### Remove or defer

- Keep legacy Story, Tower, Trading, Patrol, and Operations mechanics quarantined. The old `resolveTower` path must never become the new Tower engine.
- Do not add a selected Companion team, elemental counters, Role bonuses, stamina, tickets, a new spendable currency, Companion equipment, evolution perks, or advanced combat/animation.
- Do not implement Golemore/Might, Relics/Relic Stones, advanced Rank gates, automation, user-facing import, audio, or Post-V1 features.
- Tower grants and spends no Gold. It grants no Prosperity, Gifts, Rank EXP, Fellow EXP/shards, Family rewards, or Oath progress.

## Provisional Phase 10 tunable configuration

The values below are frozen for Phase 6 behavior and QA but remain explicit Phase 10 balance variables. Their ownership, formula order, reward lanes, and rounding rules are contractual.

### Global Companion Mastery

- State stores lifetime, non-spendable `points`, integer `0…50,000`.
- Mastery Level is the greatest integer `L` from `0…50` satisfying `20 × L² ≤ points`.
- Compare integer thresholds directly; do not derive Level by floating-point square root.
- Mastery multiplier is `1 + 0.01 × L`, from `1.00…1.50`.
- Awards truncate at the 50,000-point cap. Receipts record the actual awarded amount after truncation.
- Do not persist Mastery Level, threshold progress, multiplier, or Power.

### Companion Campaign

- Region ID/name: `companion-trail` / `Companion Trail`.
- Ten linear stages use exact IDs `companion-trail-1` through `companion-trail-10` and exact display names, in order: `Mosslit Gate`, `Whispering Ford`, `Briar Hollow`, `Moonroot Crossing`, `Emberglass Ridge`, `Stormwake Pass`, `Starfall Basin`, `Ashen Canopy`, `Dawnspire Reach`, and `Heart of the Wild`.
- Target Companion cycles through `COMPANION_DEFS` order by stage ordinal.
- Recommended Power for ordinal `N`: `round(2000 × 1.18^(N - 1))`, frozen as `[2000, 2360, 2785, 3286, 3878, 4576, 5399, 6371, 7518, 8871]`.
- Base Gold cost: `8000 + 1500 × (N - 1)`.
- Reuse the accepted efficiency formula with Total Companion Roster Power: `surplusRatio = max(0, totalPower / recommendedPower - 1)`; `discountRate = min(0.35, surplusRatio × 0.25)`; `effectiveCost = max(1, ceil(baseCost × (1 - discountRate)))`.
- First clear grants the target Companion `100 + 25 × (N - 1)` EXP and exactly `4` character-specific shards.
- Replay grants the target Companion `floor(firstClearExp / 2)` EXP and exactly `1` character-specific shard.
- Cleared stages are immediately replayable with no Rank gate. Every run pays its current effective Gold cost.
- Campaign grants no Gold reward, Mastery, Gifts, Rank EXP, Fellow resources, Family resources, Prosperity, or Oath progress.

### Companion Tower challenge

- Floor cap: `50`.
- Requirement for floor `F`: `round(2000 × 1.06^(F - 1))`.
- Only `highestFloor + 1` can be challenged. Floors cannot be skipped or replay-farmed.
- A successful first clear grants each owned Companion `40 + 10 × (F - 1)` EXP.
- A successful first clear grants `2 + floor((F - 1) / 10)` Mastery points, capped by the global Mastery cap.
- Every fifth-floor first clear grants exactly `1` shard to one deterministically selected random owned Companion. Other floors grant zero shards.
- Tower challenge has no Gold cost and no Gold reward.

### Companion Tower idle lane

- Independent elapsed cap: `24 hours`. It does not share or alter the Village Gold clock/cap.
- Reward interval: `1 hour` of eligible elapsed time at a cleared Tower floor.
- Each complete interval earned at floor `F` grants every owned Companion `20 + 2F` EXP.
- Each complete interval grants `1 + floor((F - 1) / 10)` Mastery points, truncated at the global cap when claimed.
- Shard success chance per interval is `min(0.30, 0.08 + 0.005 × (F - 1))`.
- A successful interval grants exactly `1` shard to a uniformly selected owned Companion in canonical `COMPANION_DEFS` order.
- Seven consecutive misses force the eighth eligible interval to succeed. A success resets pity to zero.
- Floor zero accrues no Tower entitlement. Assignment never changes reward quantity, chance, or recipient weighting.

## Canonical schema 7 state

Add exact production-owned state:

```text
companionMastery: {
  points: safe integer 0…50,000
}

companionCampaign: {
  selectedStageId: configured stage ID,
  clearedStageIds: unique configured IDs forming an exact linear prefix,
  firstClearClaimedStageIds: exact same prefix,
  runCountsByStage: exact configured stage keys → non-negative safe integers,
  runOrdinal: non-negative safe integer equal to the run-count sum,
  lastReceipt: null | exact Companion Campaign receipt
}

companionTower: {
  highestFloor: integer 0…50,
  firstClearClaimedFloor: integer exactly equal to highestFloor,
  clearSequence: non-negative safe integer exactly equal to highestFloor,
  lastClearReceipt: null | exact Tower first-clear receipt,
  idle: {
    cursorAt: finite non-negative monotonic timestamp,
    lastClaimAt: null | finite non-negative timestamp,
    segments: ordered bounded [{ floor, elapsedMs }],
    claimedIntervalsByFloor: exact floor keys "1"…"50" → non-negative safe integers,
    intervalOrdinal: non-negative safe integer,
    pityMisses: integer 0…7,
    claimOrdinal: non-negative safe integer,
    claimedTotals: {
      companionExp: exact Companion keys → non-negative safe integers,
      companionShards: exact Companion keys → non-negative safe integers,
      masteryNominal: non-negative safe integer
    },
    lastReceipt: null | exact Tower idle receipt
  }
}

companionProgressLedger: {
  schema6Baseline: exact Companion keys → {
    exp: non-negative safe integer,
    rarity: integer 1…5,
    shards: non-negative safe integer
  },
  qaCredits: {
    companionExp: exact Companion keys → non-negative safe integers,
    companionShards: exact Companion keys → non-negative safe integers
  }
}
```

- `runCountsByStage` is the authoritative Campaign source ledger. Cleared/claimed prefixes, ordinal, last receipt, cumulative targeted EXP, and cumulative targeted shards must agree exactly with it.
- Tower first-clear cumulative EXP, nominal Mastery entitlement, and shards derive exactly from `highestFloor`, frozen configuration, save ID, and fifth-floor roll identities.
- `claimedIntervalsByFloor` is the authoritative idle history. Its exact key set is floors `1…50`; its safe-integer sum equals `intervalOrdinal`. Deterministic replay visits floors in ascending order and replays each floor's count before the next floor. Because Tower progress never decreases, this is the exact chronological interval order.
- Replaying that canonical interval history from ordinal zero derives pity, idle EXP, nominal idle Mastery, random shards, and `claimedTotals` exactly. `claimedTotals.masteryNominal` stores entitlement before the global cap, not the cap-truncated inventory increase.
- The last idle receipt is only the newest claim, not the source of all history. Its interval-ordinal range and per-floor counts must be an exact suffix of the cumulative history and must replay to its reward maps and pity result.
- `companionProgressLedger.schema6Baseline` is immutable after migration/fresh creation. Existing QA EXP/shard helpers add exact credits to `qaCredits`.
- Current Companion EXP equals baseline + derived Campaign EXP + derived Tower first-clear EXP + claimed idle EXP + QA EXP credits.
- Current Companion shards plus the exact configured ascension spend from baseline rarity through current rarity equals baseline + derived Campaign shards + derived Tower first-clear shards + claimed idle shards + QA shard credits.
- Current Mastery points equal `min(50,000, nominal Tower first-clear Mastery + claimedTotals.masteryNominal)`. Phase 6 exposes no production or QA grant that bypasses those sources.
- Do not persist calculated costs, stage/floor definitions, Mastery Level/multiplier, Power, next floor, claim preview, random units, assignment inverse shadows, or runtime presentation state.

## Receipt and deterministic identity rules

- Companion Campaign, Tower first clear, Tower idle hit, and Tower idle recipient use disjoint versioned channel salts.
- Campaign identity binds save ID + stage ID + pre-run global ordinal + pre-run stage count. A receipt records mode, identity version/string, stage, completion time, sequence, stage-run sequence, first-clear/replay, target, base/recommended/total Power/effective cost, and exact Companion EXP/shard reward maps.
- Tower-clear identity binds save ID + floor + pre-clear sequence. A receipt records floor, time, sequence, requirement/total Power, identity, exact Companion EXP/shard maps, nominal Mastery entitlement, pre/post Mastery points, and the actual cap-truncated Mastery award. `post = min(50,000, pre + nominal)` and `actual = post - pre`.
- Fifth-floor shard recipients derive from the Tower-clear identity and canonical owned Companion order.
- Tower idle rolls bind save ID + interval ordinal + earned floor + channel salt. Hit and recipient use separate salts.
- Tower idle receipts record claim sequence/time, consumed elapsed, interval ordinal range, interval counts by floor, actual EXP/shard maps, nominal Mastery entitlement, pre/post Mastery points, actual cap-truncated Mastery award, pity after claim, identity version, and a pending-snapshot identity. `post = min(50,000, pre + nominal)` and `actual = post - pre`. A stale preview cannot commit after another transaction.
- Rendering, diagnostics, preview, cancellation, reload, and rejected actions consume no runtime RNG and cannot alter deterministic outcomes.

## Shared encounter coordinator and mode isolation

Use one code-owned coordinator for feature authorization, definition lookup, authoritative roster-Power selection, requirement/cost calculation, confirmation, in-transaction re-preview, atomic rewards, receipts, and presentation.

The adapters remain strictly separate:

- Fellow Campaign → Total Fellow Roster Power, existing Fellow state/reward table/salts/receipt.
- Companion Campaign → Total Companion Roster Power, Companion target/rewards, Companion Campaign state/salts/receipt, Gold spend.
- Companion Tower challenge → Total Companion Roster Power, sequential Tower definitions, Tower first-clear state/salts/receipt, no Gold mutation.
- Companion Tower idle → elapsed segment/claim engine only.

Mode, roster selector, reward table, state ledger, receipt shape, RNG salt, transaction source, and feature flag are allowlisted. No Companion mode can fall through to Fellow rewards; no Tower action can call Campaign rewards.

## Mastery and Power propagation

`effectiveCompanionPowerComponents(id, state)` uses this exact order:

1. base Power
2. Level multiplier
3. rarity multiplier
4. global Mastery multiplier
5. one final round to effective Companion Power

- `totalCompanionRosterPower` remains the safe sum of every owned Companion's rounded effective Power.
- The existing Fellow pipeline remains structurally unchanged: assigned Companion unrounded Power × `0.40` enters at the existing Companion step; Family/global Fellow factors follow; Fellow Power rounds at its existing endpoint.
- Mastery therefore strengthens an assigned Fellow indirectly and exactly once. It never creates a Fellow Mastery field, direct Fellow bonus, or Building bonus.

## Tower elapsed-time provenance

- Use one captured transaction timestamp. Extend central accrual so every persisted mutation settles eligible Tower elapsed under the old `highestFloor` before changing state.
- `segments` preserves chronological eligible elapsed by floor. Every entry has the exact key set `{floor, elapsedMs}`; `floor` is an integer `1…highestFloor`; `elapsedMs` is a positive safe integer; entries are strictly increasing by floor after adjacent equal floors merge; length is at most 50; and the safe-integer elapsed sum is at most `86,400,000`.
- Claim preview virtually appends elapsed from `cursorAt` to the captured time under current `highestFloor`, capped without mutating state.
- Consume chronological one-hour intervals. An interval spanning a floor boundary uses the floor at its first millisecond. Preserve the exact unconsumed sub-hour suffix.
- A floor clear first settles old-floor elapsed, then changes the floor. Split versus combined settlement at one floor and explicit settle-then-clear versus crossing a floor boundary must produce identical segments, ordinals, pity, and rewards.
- On elapsed beyond the cap, credit only the first eligible 24 hours and discard excess when settlement commits. Clock rollback adds no elapsed and never lowers `cursorAt`, `lastClaimAt`, `saveMeta.updatedAt`, or `lastSeen`.
- A claim with no complete interval and no already-creditable reward is a true zero-write no-op: no receipt, clock, ordinal, revision, toast/modal state, or storage mutation.
- `lastClaimAt`, `claimOrdinal`, and `lastReceipt` are all empty together. Otherwise `lastReceipt.sequence === claimOrdinal`, `lastReceipt.claimedAt === lastClaimAt`, and `lastClaimAt ≤ cursorAt`. The last receipt's interval count equals the length of its half-open ordinal range and is an exact suffix of `claimedIntervalsByFloor`.

## Schema 6 → 7 migration

- Set `CURRENT_SCHEMA_VERSION = 7`.
- Add write-once `PRE_V7_BACKUP_KEY = oathforge_new_world_proto_v01__raw_backup_v6`, the exact schema-6 predecessor/intermediate bytes captured after complete nine-slot zero-write preflight and before staging/active writes.
- Protected slots become active, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, pre-v7, and staging.
- Preserve exact ordered migration from schema 0 through 6 and append exactly one final `schema-6-to-7` receipt. Bind it to exact raw identities, including whitespace and nulls, of raw v0.1 plus pre-v2 through pre-v7 and to the canonical migration/recovery source.
- Preserve all Companion EXP/derived Level/rarity/shards/assignments, Fellow Campaign/Player state and reward identity, Village/Family ledgers, Oaths/Undo, Unicode, and every schema-6 field except explicitly replaced `towerFloor` and the Adventure route value.
- Schema 0–6 sources/intermediates must have no own root property named `companionMastery`, `companionCampaign`, `companionTower`, or `companionProgressLedger`. Any reserved-name collision, regardless of value or apparent shape, fails closed during complete zero-write preflight before any checkpoint/staging/active write. Preserve all existing raw bytes for export; never silently overwrite or relocate a collision.
- Copy each Companion's exact schema-6 EXP/rarity/shards into the immutable progression baseline. Initialize QA credits to zero.
- Initialize Mastery zero, Companion Campaign empty, Tower floor zero, no clears/claims/rewards, and Tower `cursorAt` at the exact maximum of captured migration time and these four schema-6 fields only: `saveMeta.updatedAt`, `lastSeen`, `lastGoldAt`, and `familyDrops.eligibleAt`. Each is already required finite/non-negative by schema-6 validation; no receipt or other catch-all timestamp participates.
- Record the validated legacy `towerFloor` value as ignored migration evidence, then remove it. Negative, fractional, zero, one, and large finite values all map to zero Companion Tower progress; invalid/non-finite predecessor state still fails validation.
- Map `ui.adventure: "campaign"` to `"fellowCampaign"`. Reject foreign routes.
- Migration grants no Gold, EXP, shards, Mastery, clears, claims, Rank, Gifts, or other rewards.
- A schema-6 safe-reset lineage marker is preserved inside the exact pre-v7 checkpoint but superseded in the schema-7 state by the authenticated migration receipt; do not retain both as active competing lineage authorities.

## Persistence, recovery, export, and reset

- Expand every preflight, migration, staging, committed-current cleanup, missing-active recovery, export, diagnostics, fixture installation, rollback, safe reset, and storage-event path from eight to nine protected slots.
- Retry always reuses an authentic pre-v7 checkpoint byte-for-byte. When an authenticated schema-7 staging/candidate payload exists, retry also reuses its exact migration timestamp, cursor, receipt, and candidate bytes. If failure occurred after pre-v7 verification but before any schema-7 stage/candidate was durably written, a later retry may capture exactly one new monotonic migration time and build a new candidate from the unchanged checkpoint; it must not replace the checkpoint or duplicate a receipt/revision/reward.
- Historical schema-2 through schema-6 pending/committed transactions finish their authenticated owner/active/cleanup boundary before schema-7 migration proceeds.
- A generic valid schema-7 stage cannot recover missing/corrupt active state. Only exact fresh default, authenticated migration/recovery successor, or reconstructable committed current mutation may be adopted.
- Invalid highest occupied protected material blocks unsafe fallback. Foreign source/save/revision/raw identity, changed whitespace, checkpoint swaps, forged receipt/reward identity, and unrelated staging fail closed with zero writes.
- Campaign run, Tower clear, and Tower claim are single atomic mutations. Any precommit fault leaves Gold, EXP, Level, rarity, shards, Mastery, ledgers, clears, segments, timestamps, ordinals, receipts, runtime, and UI unchanged. Post-active-write recovery adopts exactly one durable result and cleans only owned staging.
- Safe export becomes export version 7 and reports all nine keys/raw values/read errors. Production user import remains Phase 11-deferred.
- Isolated fixture installation pre-reads all nine slots; every set/remove or post-write boot/read failure restores all nine raw slots plus runtime state exactly and reports original and rollback failures.
- Safe-reset lineage includes pre-v7 identity and preserves every checkpoint byte. Pending/committed reset recovery remains exact.
- Preserve the documented Web Storage no-compare-and-swap residual race. Raw FNV identities detect accidental/foreign divergence but are not cryptographic authentication against a malicious same-origin editor.

## Feature flags and action boundary

- Production flags: `fellowCampaign`, `companionCampaign`, and `companionTower` enabled in the accepted Phase 6 build.
- Historical `story`, `tower`, `trading`, `patrol`, and `operations` remain false even when explicitly overridden.
- Missing, malformed, disabled, all-disabled, encoded-query, unattested, or native-storage QA realms fail before a runnable control or handler and perform zero mutation.
- Add distinct production helpers and transaction sources for Companion Campaign selection/run, Companion Tower challenge, and Companion Tower claim.
- New selection/run/challenge/claim QA actions are declaratively destructive and require the existing isolated non-native storage attestations.
- Do not repurpose the retired `tower` flag, `resolveTower`, or `tower-win` transaction source.

## UI and presentation

- Adventure contains a horizontally scrollable three-button strip: `Fellows`, `Companions`, `Tower`, backed by `fellowCampaign`, `companionCampaign`, and `companionTower` route values.
- Fellow Campaign remains functionally and visually unchanged.
- Companion Campaign reuses the walking/slideshow shell with Companion-specific art hook, labels, nodes, target, Power, costs, and rewards.
- Companion Campaign preview shows first-clear/replay, target Companion, Total Companion Roster Power, requirement, base cost, efficiency discount, actual Gold cost, EXP, and guaranteed targeted shards.
- Tower shows highest/next floor, total Companion Power, requirement, exact first-clear rewards, current hourly rates, elapsed/cap, deterministic claim preview, Mastery Level/progress/multiplier, pity status, and a separate claim button.
- Tower result copy clearly distinguishes first-clear rewards from random idle shards.
- Companion cards/profiles show Mastery Level/multiplier and updated effective Power. Assigned Fellow profiles and both Companion encounter previews update immediately after Mastery changes.
- Normal motion may reuse the lightweight walk/result delay. Reduced motion stays fully functional with static immediate results.
- No active UI mentions old Vowkeeper Tower, Fellow counters, Tower Gold/Prosperity, legacy `towerFloor`, neutral Phase 4 Mastery, stamina/tickets, or production debug controls.

## Diagnostics and isolated QA

- Expose Mastery configuration/components, complete Campaign/Tower definitions, both roster-Power previews, Campaign counts/receipts, Tower clears, elapsed segments, cap, deterministic interval preview, pity, claimed totals, progression source ledger, and pre-v7 evidence.
- Add isolated actions for exact Companion Campaign selection/run, Tower clear, Tower claim, clock setup, Companion Power/EXP/shard boundary setup, and Mastery/floor fixtures where needed.
- Route all gameplay tests through authoritative production helpers. Preview/diagnostics/render actions remain read-only.
- Rejected actions leave all nine raw slots, state, revision, writes, clock/RNG/log state, toast, modal, and rendered UI unchanged.

## Acceptance gate

### Design, math, and atomic behavior

- Mastery thresholds `19/20`, `79/80`, `49,999/50,000`, cap truncation, overflow refusal, exact Level/multiplier, round-once Companion Power, total roster sum, and 40% unrounded Fellow propagation.
- Total Companion roster eligibility at requirement `-1 / exact / +1`. Assignment, Fellow Power, selected squad, Types, Roles, counters, Bond, Family state, and Oaths cannot affect Companion eligibility.
- Campaign definitions, prefix/count/ordinal algebra, first clear, replay, exact cost efficiency boundaries/cap/rounding, target-only EXP/shards, insufficient Power/Gold, cancellation, overflow, stale preview, and fault/retry once.
- Tower next-floor-only progression, floor cap, exact cumulative first-clear rewards, deterministic fifth-floor shard, no replay/duplicate clear, and no Gold/Prosperity mutation.
- Idle at `0/1 ms`, interval `-1 / exact / +1`, multiple intervals, cap `-1 / exact / +1`, `>24h`, epoch zero, clock rollback, local midnight, DST boundaries, multiple floor changes, cross-floor partial interval, reload, split/combined equivalence, pity misses 1–7/forced eighth/reset, chance cap, recipient boundaries, stale preview, immediate double claim, and safe-integer overflow.
- At frozen time, Tower never changes Gold/pending Gold. When time advances during an ordinary central transaction, existing Village accrual may change pending Gold independently, but no Tower receipt or UI reward may attribute it to Tower.
- Source ledger rejects internally consistent forged receipts/totals, altered claimed interval counts, derived pity/roll/reward mismatches, extra/missing reward keys, sequence rollback, foreign save/stage/floor identities, claimed-without-clear, skipped progression, replay-before-clear, and unexplained Companion EXP/shards/rarity/Mastery.

### Migration, persistence, and recovery

- Fresh schema 7 and exact schema 0/1/2/3/4/5/6 → 7 migrations; reserved-name collision refusal at every origin; later-clock retry both before and after durable schema-7 staging; exact hop revisions/receipts; no retroactive rewards; no legacy Tower mapping; no current timestamp regression.
- Exact pre-v7 write-once checkpoint; all nine-slot read/readback/write/verify/replacement/removal faults; occupied malformed/foreign/byte-changed checkpoints; full staged lineage and target-identity negatives.
- Historical pending/committed transaction completion, current mutation faults, missing-active recovery, cleanup ownership races, cross-tab staleness, and safe-reset interruption produce no duplication or unsafe fallback.
- Nine-slot export/fixture/rollback/reset matrices restore exact raw/runtime/UI state, including explicit combined rollback failures.
- Phase 5 semantic successor passes with every intentional schema/checkpoint/Tower/Adventure/Mastery supersession itemized and backed by a Phase 6 replacement.

### Live browser

Run twice at `320×568` and `390×844` with fresh schema 7, schema-6 migration, representative legacy migration, first-clear/replay Campaign, Tower floor 1/floor 5/cap, idle hit/miss/pity, reload, Mastery propagation, reduced motion, disabled/all-disabled/encoded-query/unattested/native-storage refusal, and persistence fault realms. Require zero failed rows, blank fatal output, zero warning/error console entries, and zero native-storage calls.

### Frozen evidence

- Preserve Phase 0–5 fixtures/manifests/docs and embedded asset bytes except explicitly itemized successor identities.
- Run Phase 6 CLI twice, Phase 5 semantic successor twice, checksums twice, and the live browser gate twice on one clean exact tip before review.

## Do not break

- Fellow Campaign state, Rank, deterministic reward identities, Gold spending, walking/reduced-motion presentation, and schema-6 migration baseline.
- Eight-slot Phase 5 lineage expands additively to nine slots; all historical checkpoints, receipts, staging ownership, recovery precedence, safe-reset authentication, Oath Undo, and cross-tab refusal remain intact.
- Oath `3% / 5% / 8%` final multipliers, +30% cap, Building upgrades/cap, 24-hour Village Gold claim, Family carry/drop provenance, Gifts, Family assignments/Bonds, and Companion assignments.
- Companion cumulative EXP/derived Level, rarity/ascension, character shards, Mastery-before-rounding Power order, one-to-one Fellow transfer, and Total Companion Roster Power.
- Compatibility namespace, mobile/static-portrait architecture, feature quarantine, and embedded art bytes.

## Exit gate

Phase 6 may merge only after a clean exact implementation/package tip passes the full gate twice, an independent design/math/UI review, an independent persistence/migration/failure review, exact fast-forward integration, remote verification, and byte-identical GitHub Pages verification. Do not merge or push from the implementation worktree.

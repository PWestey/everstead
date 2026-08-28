# EVERSTEAD — PHASE 7 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 6 package commit `1ffa12eb73cccb4de40769ae7251937c67f69766` (accepted Phase 6 production commit `689d43a4f0b0d22507e66b158f4a1f23a8672fee`, artifact SHA-256 `63182db2f73d9d5e7d723c4e6ce1fea520d7803c6314ff1307180ad9b1d3635f`, 18,627,378 bytes).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, is the product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, defines Phase 7 as the Golemore-equivalent broad Fellow-roster mode, its independent non-Gold idle lane, and the global Fellow-power multiplier.
- The locked rules are: use the full owned Fellow roster; retain a weakest-first/exhaustion-style resolution so breadth matters; let highest progress control claim-time idle output; make the primary persistent output a non-spendable global Fellow-power stat/multiplier; allow broad/random idle Fellow shards with mild bad-luck protection; keep Fellow Campaign as the targeted shard lane; apply the global multiplier exactly once inside effective Fellow Power; and prefer claim-time/offline calculation over continuous timers.
- Preserve the single-file mobile shell, embedded art bytes, Phase 6 shared encounter and Power pipelines, transactional persistence, and every accepted Phase 0–6 invariant.

## Objective

Add a distinct `Fellow Expedition` best-run mode that proves roster breadth through deterministic weakest-qualifying-first exhaustion, then turn the all-time highest stage into an independent 24-hour idle lane. The lane grants `Might`, a lifetime non-spendable global Fellow-power stat, and broad/random character-specific Fellow shards. It grants no Gold, EXP, targeted shards, or direct clear payout.

`Fellow Expedition` is the V1 display and internal mode name. `Might` is the V1 display name and `fellowMight` is the stable schema field. Both labels remain Phase 10 content/balance tunables; renaming visible copy later must not silently reinterpret stored points or create a second multiplier.

## Scope boundary

### Keep as-is

- Compatibility namespace `oathforge_new_world_proto_v01`, five-item bottom navigation, mobile cards/modals/toasts, reduced-motion behavior, and all embedded portrait/background bytes.
- Village/Building ownership of Gold, 24-hour Village claim, Prosperity, Oaths, Gifts, Family drops/assignments/Bonds, Fellow EXP/Level/rarity/Bond, Companion progression/assignment, Player Rank, Fellow Campaign, Companion Campaign, Companion Tower, and Companion Mastery.
- The accepted Phase 6 encounter coordinator, stable seeded-roll utility, safe-integer helpers, captured clocks, elapsed segments, receipt identities, source ledgers, and clone → settle old entitlement → mutate → validate → commit → adopt transaction order.
- `effectiveFellowPowerComponents`, `totalFellowRosterPower`, and Fellow Campaign cost efficiency as the authoritative Phase 7 integration points. Building rate components and the neutral Fellow-roster economy hook remain unchanged until Phase 10.
- Historical disabled Story, Tower, Trading, Patrol, and Operations state as compatibility/recovery data only.

### Reuse with migration

- Reuse the Companion Tower's normalized clock, 24-hour segment cap, one-hour interval consumption, per-progression-key history, deterministic hit/recipient channels, pity replay, claim receipt, stale-preview guard, immediate double-claim refusal, and claim UI patterns with Fellow-specific names, state, salts, rates, and rewards.
- Reuse the shared encounter coordinator for authorization, one captured time, authoritative preview, confirmation, in-transaction re-preview, atomic persistence, receipt creation, and result presentation through a new strictly allowlisted `fellowExpedition` adapter.
- Reuse Fellow Power selectors and canonical `FELLOW_DEFS` order. The Expedition adds a special per-Fellow weakest-qualifying exhaustion resolver; it does not replace Total Fellow Roster Power elsewhere.
- Reuse roster cards/profiles, Adventure tab strip, progress bars, reward summaries, diagnostics, and isolated QA bridge.
- Reuse Operations timing code only as historical implementation reference. Do not call its action, reward, or state paths.

### Replace or activate

- Replace `FELLOW_CONFIG.neutralHooks.global = 1` at the live selector boundary with the derived Might multiplier.
- Extend schema-7 Fellow Campaign accounting with deterministic post-schema-8 run counts so future Campaign EXP and shards remain independently attributable beside Expedition idle shards and QA credits.
- Add `fellowExpedition` as a fourth active Adventure subview beside Fellow Campaign, Companion Campaign, and Companion Tower.
- Hide/retire any remaining Operations entry point from the V1 UI. Its persisted compatibility fields and fail-closed action remain untouched.

### Remove or defer

- Do not implement daily attempts, stamina, tickets, a manual reset currency, cooldowns, selected Fellow squads, formations, elemental counters, Role bonuses, random combat outcomes, or persistent injury.
- Do not revive the legacy Operation or old Tower as the Expedition engine. Do not reuse their Gold, Prosperity, Bond, timers, or reward copy.
- Do not add Gold, Prosperity, Gifts, Rank EXP, Fellow EXP, Family resources, Companion resources, Oath progress, Relics, or Relic Stones to Expedition clear or idle rewards.
- Do not use the Fellow Campaign targeted shard table or target Fellow as the Expedition recipient pool. Campaign remains targeted; Expedition idle remains broad/random.
- Do not activate the reserved Fellow/Companion Village economy hooks. Controlled roster-to-Village integration and its balancing remain Phase 10 work; Phase 7 must not change Building rates or create an indirect Gold increase.
- Do not implement Relics, advanced Rank gates, automation, user-facing import, audio, advanced animation, weekly modes, events, or other Post-V1 work.

## Provisional Phase 10 tunable configuration

The numeric values below are frozen for Phase 7 behavior and QA but remain explicit Phase 10 balance variables. Mode ownership, reward separation, deterministic order, and exactly-once Power propagation are contractual.

### Fellow Expedition best run

- Stage cap: `50`.
- Exact IDs: `fellow-expedition-1` through `fellow-expedition-50`; display label may be `Stage 1` through `Stage 50` in V1.
- Materialize one immutable exact 50-entry stage-definition array at startup. Validation requires its configured ID/key set exactly; neither gameplay nor save validation may synthesize an unbounded stage sequence.
- Required individual effective Fellow Power for stage `S`: `round(5,500 × 1.08^(S - 1))`.
- Reference requirements: stage 1 `5,500`; stage 2 `5,940`; stage 3 `6,415`; stage 4 `6,928`; stage 5 `7,483`; stage 6 `8,081`; stage 10 `10,995`; stage 25 `34,876`; stage 50 `238,851`.
- The data definition exposes `minimumRosterSize = S`: one unique owned Fellow must be exhausted per cleared stage, so reaching stage `S` inherently requires at least `S` qualifying owned Fellows.
- Every push recomputes a complete best run from stage 1 with the current canonical effective Power of every owned Fellow.
- A push costs no Gold or other resource. It has no direct Might, shard, EXP, or other clear reward. Its only durable gameplay benefit is a strictly higher all-time stage, which improves future idle rates.
- Persist only a strictly higher all-time result. An equal, lower, invalid, canceled, disabled, stale, or refused push is a pure zero-write/no-UI-mutation no-op.
- The exact fresh schema-7 Fellow effective Powers, weakest to strongest, are `5,230 / 5,381 / 6,247 / 6,348 / 6,508 / 6,652`. Under the frozen requirements, the fresh best run is exactly three stages: the `6,247`, `6,348`, and `6,508` Fellows clear stages 1–3; no remaining Fellow meets stage 4.

The requirement base is deliberately above the two weakest fresh Fellows and the 8% growth is modest. This produces an immediately readable three-stage fresh result, allows early Might to help, and ensures that raising several low/mid Fellows can outperform concentrating the same total Power in one favorite.

### Might

- State stores lifetime, non-spendable `points`, integer `0…50,000`.
- Might Level is the greatest integer `L` from `0…50` satisfying `20 × L² ≤ points`.
- Compare integer thresholds directly; do not derive Level through floating-point square root.
- Might multiplier is `1 + 0.01 × L`, from `1.00…1.50`.
- Awards truncate at the 50,000-point cap. Receipts record nominal entitlement, pre/post points, and the actual awarded amount after truncation.
- Do not persist Might Level, threshold progress, multiplier, or Power.

This mirrors the accepted Companion Mastery scale, keeps the new multiplier conservative, and makes Power-order comparison straightforward without coupling the two stats.

### Fellow Expedition idle lane

- Independent elapsed cap: `24 hours`. It does not share or alter Village or Companion Tower clocks/caps.
- Reward interval: `1 hour` of eligible elapsed at an attained Expedition stage.
- Each complete interval earned at stage `S` grants `1 + floor((S - 1) / 2)` nominal Might points.
- Shard success chance per interval is `min(0.30, 0.08 + 0.02 × (S - 1))`.
- A successful interval grants exactly `1` character-specific shard to one uniformly selected owned Fellow in canonical `FELLOW_DEFS` order.
- Seven consecutive misses force the eighth eligible interval to succeed. A success resets pity to zero.
- Stage zero accrues no Expedition entitlement. Fellow focus, Campaign target, Type, Role, Companion assignment, Family links, and current shard count do not weight the idle recipient pool.
- The Phase 7 owned-Fellow set is immutable and captured in the schema-7 progression baseline, making historical deterministic recipient replay stable. Later roster-acquisition work must migrate this provenance explicitly rather than reinterpret prior rolls.

At the frozen fresh best stage 3, the lane grants `2` nominal Might per full hour and has a `12%` shard chance before pity. The 30% chance cap and forced eighth miss remain intentionally mild and tunable.

## Canonical schema 8 state

Set `CURRENT_SCHEMA_VERSION = 8` and add exact production-owned state:

```text
fellowMight: {
  points: safe integer 0…50,000
}

fellowCampaign: {
  ...accepted schema-7 fields,
  runCountsByStage: exact Fellow Campaign stage keys → non-negative safe integers
}

fellowExpedition: {
  highestStage: integer 0…50,
  bestRunSequence: non-negative safe integer,
  lastBestReceipt: null | exact Fellow Expedition best-run receipt,
  idle: {
    cursorAt: non-negative safe-integer Expedition tick,
    lastClaimAt: null | non-negative safe-integer Expedition tick,
    segments: ordered bounded [{ stage, elapsedMs }],
    claimedIntervalsByStage: exact stage keys "1"…"50" → non-negative safe integers,
    intervalOrdinal: non-negative safe integer,
    pityMisses: integer 0…7,
    claimOrdinal: non-negative safe integer,
    claimedTotals: {
      mightNominal: non-negative safe integer,
      fellowShards: exact Fellow keys → non-negative safe integers
    },
    lastReceipt: null | exact Fellow Expedition idle receipt
  }
}

fellowProgressLedger: {
  configIdentity: "phase-7-fellow-progression-v1",
  schema7Baseline: exact Fellow keys → {
    owned: boolean,
    exp: non-negative safe integer,
    rarity: integer 1…5,
    shards: non-negative safe integer
  },
  campaignBaseline: {
    runOrdinal: non-negative safe integer,
    clearedStageIds: exact schema-7 cleared prefix,
    firstClearClaimedStageIds: exact same prefix,
    playerRankExp: non-negative safe integer,
    lastReceipt: null | exact preserved schema-7 Fellow Campaign receipt
  },
  qaCredits: {
    fellowExp: exact Fellow keys → non-negative safe integers,
    fellowShards: exact Fellow keys → non-negative safe integers
  }
}
```

- `highestStage` is the all-time best, not a spendable resource and not a current daily run. `bestRunSequence` counts only persisted all-time-high replacements.
- `highestStage === 0`, `bestRunSequence === 0`, and `lastBestReceipt === null` are all true together. Otherwise `lastBestReceipt.sequence === bestRunSequence` and `lastBestReceipt.highestStage === highestStage`.
- `runCountsByStage` counts only Fellow Campaign runs performed after schema-8 creation/migration. Its safe-integer sum equals `fellowCampaign.runOrdinal - fellowProgressLedger.campaignBaseline.runOrdinal`.
- Current Campaign cleared/claimed prefixes extend the exact baseline prefix. Every stage newly cleared after the baseline has at least one post-baseline run; its first post-baseline run is the sole first clear. Baseline-cleared stages have only replay runs.
- If every post-baseline run count is zero, current `fellowCampaign.lastReceipt` exactly equals the preserved `campaignBaseline.lastReceipt`. After any post-baseline run it is an exact version-2 receipt whose global sequence equals current `runOrdinal` and whose stage-local sequence equals that stage's current run count.
- Post-schema-8 Campaign replay shard and Gift rolls use the configured stage ID plus that stage's pre-run `runCountsByStage` value and disjoint version-2 salts. They do not depend on ambiguous cross-stage global ordering. The global `runOrdinal` remains for total-run chronology and receipt sequencing.
- Canonical replay of `runCountsByStage` derives all post-baseline Fellow Campaign EXP and Fellow shards exactly. First-clear/replay quantities, target Fellow cycling, Gold cost, Rank EXP, Gifts, and all existing gameplay semantics remain unchanged except for the explicitly versioned post-schema-8 random-roll identity.
- `schema7Baseline` and `campaignBaseline` are immutable and must match the exact schema-7 predecessor attested by the schema-7-to-8 migration receipt.
- `configIdentity` is the exact literal `phase-7-fellow-progression-v1`. It binds the Fellow definition order, rarity-spend table, Fellow Campaign definition/reward table, stage-local Campaign roll version, Expedition definition/rates, and Might curve used by this ledger. A later balance change that would reinterpret historical entitlement requires an explicit schema/config-version migration; it must not silently reuse this identity.
- Phase 7 preserves each Fellow's baseline `owned` value and exposes no ownership mutation. Current owned flags must equal the baseline.
- Existing Fellow EXP/shard QA grants add exact credits to `qaCredits`; Bond grants remain outside this EXP/shard ledger.
- Current Fellow EXP equals baseline EXP + deterministically derived post-baseline Campaign EXP + QA EXP credits. Current Level remains derived from current EXP.
- Current Fellow shards plus exact configured ascension spend from baseline rarity through current rarity equals baseline shards + derived post-baseline Campaign shards + claimed Expedition idle shards + QA shard credits.
- Current Player Rank EXP equals baseline Player Rank EXP plus the configured first-clear Rank EXP for exactly the Campaign stages cleared after the baseline; current Rank remains derived from that total. Replays and Expedition never grant Rank EXP.
- Current rarity is monotonic from the baseline and cannot exceed the configured cap. Ascension costs use the existing exact `FELLOW_CONFIG.rarityShardCosts` steps.
- Current Might points equal `min(50,000, claimedTotals.mightNominal)`. Phase 7 exposes no production or QA grant that bypasses Expedition claims.
- `claimedIntervalsByStage` is the authoritative idle history. Its exact key set is stages `1…50`; its safe-integer sum equals `intervalOrdinal`. Deterministic replay visits stages in ascending order and replays each stage count before the next because all-time progress never decreases.
- Replaying that canonical history from ordinal zero derives pity, nominal Might, random Fellow shards, and `claimedTotals` exactly.
- The last idle receipt is the newest claim, not the source of all history. Its ordinal range and per-stage counts are an exact suffix of cumulative history and replay exactly to its Might/shard rewards and pity result.
- Do not persist stage requirements, Might Level/multiplier, Fellow Power, Total Fellow Roster Power, push preview, claim preview, recipient random units, or runtime presentation state.
- Phase 7 intentionally does not claim complete global Gift-inventory reconstruction. Gifts already have independent Building, Oath, Family-claim, Campaign, and Family-spend paths whose pre-Phase-7 history is not a complete source ledger. Every post-schema-8 Campaign Gift roll and latest receipt is still deterministic and validated from stage-local sequence, but current `gifts` is not equated solely to Campaign-derived Gifts. A future global Gift ledger requires its own migration rather than an overclaim here.

## Weakest-first best-run resolution

Resolution is deterministic and contains no RNG:

1. Capture every owned Fellow's canonical `effectivePower` from `effectiveFellowPowerComponents` once at push preview/transaction time.
2. Sort the snapshot by ascending effective Power; ties use canonical `FELLOW_DEFS` order.
3. Start at Expedition stage 1 with no Fellow exhausted.
4. For the current stage, select the weakest unexhausted Fellow whose captured effective Power is at least that stage's requirement.
5. Record that Fellow as the stage clearer and exhaust the Fellow for the remainder of this push.
6. Advance one stage and repeat. A Fellow can clear at most one stage per push.
7. Stop at the first stage for which no unexhausted owned Fellow qualifies, or after stage 50.

- Sub-threshold Fellows are not silently converted into partial damage and stronger overkill does not carry forward. Each stage requires one complete qualifying Fellow.
- The resolver therefore depends on the distribution of individual Power, not merely its sum. Two rosters with equal Total Fellow Roster Power can achieve different best stages; the more balanced roster may advance farther.
- `Total Fellow Roster Power` is still displayed and remains authoritative for Fellow Campaign. Expedition is the one explicitly locked exception with its own breadth/exhaustion resolution.
- Exhaustion is encounter-local evidence, not a daily status, stamina system, or permanent penalty. A new push always recomputes from stage 1. The persisted best-run receipt retains its exact exhausted Fellow order across reload.
- Preview and confirmation use the exact same resolver. The transaction re-runs it from current persisted state and refuses stale results.
- If the recomputed result is not strictly greater than `highestStage`, return false before central accrual, storage, revision, toast, modal, timer, or render mutation.
- A new high first settles old-stage Expedition elapsed at the captured transaction tick, then writes the higher stage and one new best-run receipt atomically.

## Receipt and deterministic identity rules

- Fellow Campaign version-2 run, Expedition best run, Expedition idle hit, and Expedition idle recipient use disjoint versioned channel salts. They are also disjoint from Family, Phase 5 Campaign version 1, Companion Campaign, and Companion Tower salts.
- Rendering, diagnostics, preview, cancellation, failed/equal best-run pushes, reload, and rejected actions consume no runtime RNG and cannot change deterministic outcomes.

### Best-run receipt

- Identity binds save ID + pre-best sequence + captured Expedition tick + exact canonical roster snapshot + all derived stage results + prior highest stage + new highest stage + exact pre-push claimed-interval snapshot + every receipt field.
- The receipt records mode/version/identity, achieved time, sequence, prior/new highest stage, owned roster count, Total Fellow Roster Power, `rosterSnapshot` in ascending Power/tie order, `stageResults` in stage order, exact `exhaustedFellowIds`, exact next unmet stage/requirement or cap result, and `prePushClaimedIntervalsByStage` with all stage keys `1…50`.
- Every roster entry has exact keys for Fellow ID, definition order, and non-negative safe-integer effective Power. Each owned Fellow appears exactly once; unowned Fellows do not appear.
- Every stage result has exact keys for stage, requirement, Fellow ID, and captured effective Power. Stages form `1…highestStage`; each selected Fellow is unique; each Power equals that Fellow's snapshot Power; each Power meets the configured requirement; and each selection is exactly the resolver's weakest qualifying Fellow.
- `exhaustedFellowIds` exactly equals the stage-result Fellow order. No direct reward map appears because a push grants no direct reward.
- The pre-push claimed-interval map expands to an exact prefix of current cumulative idle history. Counts for the newly achieved stage and every higher stage are zero.

### Expedition idle receipt

- Hit identity binds save ID + interval ordinal + earned stage + `fellow-expedition-idle-shard-hit-v1`.
- Recipient identity binds save ID + interval ordinal + earned stage + `fellow-expedition-idle-shard-recipient-v1` and selects uniformly from the immutable owned-Fellow baseline order.
- The receipt records mode/version/identity, claim sequence/time, `preClaimBestRunSequence`, consumed elapsed, half-open interval-ordinal range, exact interval counts by stage, nominal Might, pre/post Might points, actual Might awarded, exact Fellow shard map, pity before/after, and a pending-snapshot identity.
- The pending-snapshot identity binds the pre-claim best-run sequence, cursor, segments, cumulative interval map, interval ordinal, pity, and every derived receipt field. A stale preview cannot commit after another claim, push, or mutation.
- The receipt's interval counts are an exact suffix of `claimedIntervalsByStage`. Canonical replay from prior history derives every hit, recipient, shard, Might value, and pity transition exactly.

### Fellow Campaign version-2 receipt

- Identity binds save ID + stage ID + pre-run global ordinal + pre-run stage-run count + every receipt field.
- Record both global `sequence` and stage-local `stageRunSequence`; first-clear/replay is derived from the immutable baseline prefix plus stage-local count.
- Post-schema-8 replay hit/Gift outcomes derive from the stage-local sequence and separate salts. Altered count, sequence, first-clear flag, target, EXP, shards, Gift, Rank reward, cost, requirement, Total Fellow Roster Power, or identity fails validation.
- If no post-schema-8 Campaign run exists, preserve and validate the exact schema-7 last receipt from `campaignBaseline`. The first new run replaces it with version 2; never rewrite historical version-1 identity.

## Might and Power propagation

`effectiveFellowPowerComponents(id, state)` uses this exact order:

1. base Power
2. Level multiplier
3. rarity multiplier
4. existing Bond-milestone multiplier
5. existing Relic hook/multiplier
6. assigned Companion unrounded Power transfer at the existing 40% step
7. linked Family Bond multiplier
8. global Might multiplier
9. one final round to effective Fellow Power

- Replace only the neutral global step with `fellowMightComponents(state).multiplier`.
- Companion Mastery may already increase assigned Companion unrounded Power before the 40% transfer. Might multiplies the Fellow pipeline after that transfer and Family Bond, once.
- Do not apply Might to base Power, Companion Power, transferred Power, Family bonuses, a roster sum, Campaign result, or Building rate as an additional direct factor.
- `totalFellowRosterPower` remains the sum of every owned Fellow's individually rounded effective Power, but Phase 7 must replace the unchecked reduction with explicit non-negative safe-integer addition. Overflow throws/refuses before any gameplay or persistence mutation.
- Fellow Campaign requirement/eligibility and Gold efficiency consume that updated total exactly once.
- `ECONOMY_CONFIG.neutralHooks.fellowRoster` remains neutral and `buildingRateComponents` does not consume Total Fellow Roster Power in Phase 7. Building rates therefore remain unchanged after a Might claim.
- Fellow cards/profiles, Expedition, Fellow Campaign, and diagnostics update from the same selectors immediately after a claim.

## Expedition elapsed-time provenance

- Define `expeditionTick(timestamp) = min(Number.MAX_SAFE_INTEGER, max(0, floor(timestamp)))` for every finite timestamp entering migration, preview, settlement, push, claim, receipt, retry, or validation. Normalize before maximums/subtraction; never subtract raw fractional or unsafe-magnitude clocks.
- Use one captured raw transaction time. Tower receives `towerTick(rawTime)` and Expedition receives `expeditionTick(rawTime)`; Fellow/Companion Campaign preserve their accepted raw-time semantics.
- Extend central accrual so every successful persisted mutation settles eligible Expedition elapsed under the old `highestStage` before changing state. A zero-write failed/equal push does not settle or advance the lane.
- `segments` preserves chronological eligible elapsed by stage. Every entry has exact keys `{stage, elapsedMs}`; stage is integer `1…highestStage`; elapsed is positive safe integer at most `86,400,000`; adjacent equal stages merge; stage values are strictly increasing; length is at most 50; and the safe elapsed sum is at most `86,400,000`.
- Claim preview virtually appends elapsed from `cursorAt` to the captured tick under current `highestStage`, capped without mutating state.
- Consume chronological one-hour intervals. An interval spanning a best-stage change uses the stage at its first millisecond. Preserve the exact unconsumed sub-hour suffix.
- A new best first settles old-stage elapsed, then changes `highestStage`. Split/combined settlement at one stage and settle-then-push versus a boundary crossing must produce byte-equivalent segments, ordinals, pity, and eventual rewards.
- On elapsed beyond the cap, credit only the first eligible 24 hours and discard excess when settlement commits. Clock rollback adds no elapsed and never lowers cursor, claim, save, Village, Family, or Tower timestamps.
- Stage zero accrues nothing. A claim with no complete interval is a true zero-write/no-UI-mutation no-op.
- At the Might cap, complete intervals are still consumed because they can change shard/pity history. Receipt nominal Might may be positive while actual awarded Might is zero.
- `lastClaimAt`, `claimOrdinal`, and `lastReceipt` are all empty together. Otherwise receipt sequence/time equals claim state and `lastClaimAt ≤ cursorAt`.

## Schema 7 → 8 migration

- Add write-once `PRE_V8_BACKUP_KEY = oathforge_new_world_proto_v01__raw_backup_v7`.
- Protected slots become active, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, pre-v7, pre-v8, and staging: ten exact raw slots.
- For a schema-7 origin, pre-v8 is the exact active schema-7 raw bytes. For schema 0–6, pre-v8 is the exact canonical schema-7 intermediate produced after all earlier protected intermediates. Preserve and authenticate original whitespace whenever raw exists.
- Append exactly one `schema-7-to-8` migration receipt. Bind it to the exact raw identities, including nulls and whitespace, of raw v0.1 plus pre-v2 through pre-v8, canonical migration/recovery source, captured migration tick, exact `phase-7-fellow-progression-v1` config identity, immutable Fellow/campaign baselines, and every initialized Phase 7 field.
- Schema 0–7 inputs must have no own root property named `fellowMight`, `fellowExpedition`, or `fellowProgressLedger`. Any reserved-name collision fails during complete zero-write preflight before any protected write. Schema 0–7 Fellow Campaign must not own `runCountsByStage`; treat it as a Phase 7 reserved nested collision.
- Copy each Fellow's exact schema-7 owned/EXP/rarity/shards into the immutable progression baseline. Copy exact Fellow Campaign ordinal, prefixes, Rank EXP, and last receipt into `campaignBaseline`. Initialize Campaign run counts and QA credits to zero.
- Initialize Might to zero, Expedition highest stage/sequence/receipts/claims to zero/null, and all claimed maps/totals/pity to zero.
- Initialize Expedition `cursorAt` at the exact maximum of `expeditionTick(captured migration time)` and normalized schema-7 `saveMeta.updatedAt`, `lastSeen`, `lastGoldAt`, `familyDrops.eligibleAt`, and `companionTower.idle.cursorAt`. No reward receipt or catch-all timestamp participates.
- Preserve the current accepted Adventure route when it is one of `fellowCampaign`, `companionCampaign`, or `companionTower`. Reject foreign routes. Fresh schema 8 starts on `fellowCampaign`.
- Preserve Gold, pending Gold, Prosperity, Oaths/Undo, Buildings, Family carry/drop provenance, Gifts, all Fellow fields, Campaign/Player state, Companion assignments/progression, Companion Campaign/Tower/Mastery histories, Unicode, and every valid schema-7 field.
- Migration grants no claimed Gold, Might, shards, EXP, clears, best run, Rank, Gifts, or other reward. Starting Might ×1.00 leaves Fellow Power unchanged, and all Village/Building Gold formulas remain byte-for-byte behaviorally unchanged.
- A schema-7 safe-reset lineage marker remains exact in pre-v8 but is superseded in active schema 8 by authenticated schema-7-to-8 lineage. Do not retain competing authorities.

## Persistence, recovery, export, and reset

- Expand complete preflight, migrations, staging, current cleanup, missing-active recovery, export, diagnostics, fixture install/rollback, safe reset, storage events, and every fault boundary from nine to ten protected slots.
- Read/validate all ten slots and reject reserved collisions before the first write, cleanup, active adoption, or runtime/UI mutation.
- Retry reuses an authentic pre-v8 checkpoint byte-for-byte. An authenticated schema-8 staged/candidate payload also fixes the exact migration time, settled predecessor entitlement, baselines, cursor, receipt, and target bytes.
- If failure occurs after pre-v8 verify but before any schema-8 candidate/stage is durable, a later retry may capture one new monotonic migration time and settle the unchanged pre-v8 predecessor to that time. It must not replace pre-v8 or duplicate any claim, Campaign run, best run, or revision.
- Historical schema-2 through schema-7 fresh/migration/ordinary-current/safe-reset pending and committed transactions complete or clean their authenticated owner/active boundary before schema-8 migration. Pre-v8/reserved/lineage preflight occurs before any historical active write or staging cleanup.
- A lone evolved schema-7 pre-v8 checkpoint with active and schema-8 staging both missing remains fail-closed unless it is an exact deterministic immediate successor reconstructable from protected origin. Recovery requires the exact active predecessor, an authenticated staged schema-8 successor, or deterministic reconstruction.
- Generic valid schema-8 staging never recovers missing/corrupt active. Only exact fresh default, authenticated migration/recovery successor, authenticated safe reset, or reconstructable current mutation may be adopted.
- Invalid highest occupied protected material blocks fallback. Foreign source/save/revision/raw identity, changed whitespace, checkpoint swap, forged baseline/receipt, reward-map mismatch, and unrelated staging retain every byte and perform zero writes.
- Campaign run/ascension/QA grant updates the Fellow source ledger in the same atomic mutation as resources. Expedition new-high and claim actions are each one atomic mutation. Any precommit fault leaves all resources, Power inputs, histories, timestamps, receipts, runtime, and UI unchanged. Post-active-write recovery adopts exactly one durable result and cleans only owned staging.
- Safe export becomes export version 8 and returns all ten raw values plus per-slot read errors. User-facing import remains deferred.
- Isolated fixture installation pre-reads all ten slots. Every set/remove/post-write boot/read fault restores all ten slots plus in-memory state, revision/identity, blocked/stale/write flags, QA clock/random/log, toast/modal, timers, and rendered UI exactly. Report the original error and every rollback failure.
- Safe-reset lineage includes pre-v8 identity and exact independent identities for every retained permanent slot. Retained bytes are archival and need not parse after an authenticated reset, but any later add/remove/change blocks. Pending/committed reset recovery remains exact.
- Preserve the documented Web Storage no-compare-and-swap residual race. FNV raw identities detect/bind accidental or foreign divergence but are not cryptographic proof against a malicious same-origin editor.

## Feature flags and action boundary

- Production flags: `fellowCampaign`, `fellowExpedition`, `companionCampaign`, and `companionTower` enabled.
- Historical `story`, `tower`, `trading`, `patrol`, and `operations` remain false even when explicitly overridden.
- Add production helpers `previewFellowExpedition`, `pushFellowExpedition`, `fellowExpeditionIdlePreview`, and `claimFellowExpedition`, with transaction sources `fellow-expedition-best-run` and `fellow-expedition-claim` in the explicit current-transaction allowlist.
- Extend the shared encounter coordinator with a strictly isolated `fellowExpedition` adapter. It selects Fellow effective Power and the Expedition resolver/receipt, has no cost/reward table, and cannot fall through to any Campaign/Tower action.
- A new-high push and idle claim are declaratively destructive QA actions and require existing isolated non-native storage attestations. Read-only preview/diagnostics require no destructive authority.
- Fellow Campaign, ascension, Fellow EXP/shard QA grants, and schema-8 source-ledger updates must route through authoritative production helpers. No bridge action directly edits ledger totals.
- Missing, malformed, disabled, all-disabled, encoded-query, unattested, native-storage, or throwing adapters fail before handlers and leave raw slots, state, revision, clock/RNG/log, toast, modal, timer, and rendered UI unchanged.

## UI and presentation

- Adventure uses a horizontally scrollable four-button strip in this order: `Fellows`, `Expedition`, `Companions`, `Tower`, backed by `fellowCampaign`, `fellowExpedition`, `companionCampaign`, and `companionTower`.
- Fellow Expedition shows Might points, Level, threshold progress, multiplier, all-time highest stage, current hourly Might/shard rates, elapsed/cap, pity, and deterministic claim preview.
- The best-run preview lists owned Fellows weakest-first with exact Power and status: `clears stage N`, `exhausted`, `below next requirement`, or `unused after cap`. It shows the exact predicted stage, next unmet requirement, Total Fellow Roster Power, and whether pushing would set a new record.
- The push result summarizes the new all-time stage and exact exhausted Fellow order. Equal/worse results do not show a success toast/modal or alter presentation.
- Idle result copy distinguishes nominal/actual Might at cap and names every shard recipient. Persist and render durable last-best and last-claim summaries after reload.
- Fellow roster header/profile shows Might Level/multiplier and the updated effective Power formula. Remove neutral-global copy.
- Fellow Campaign preview updates immediately after a Might claim. Village/Building rate details remain unchanged and must not imply Expedition generates or modifies Gold.
- Preserve Companion Campaign/Tower, Fellow Campaign walking presentation, and mobile layout. Expedition may use static Fellow rows and lightweight sequential emphasis; no new art or battle animation is required.
- Reduced motion remains fully functional with immediate static result presentation. Normal motion may use short existing transitions but persistence never waits on animation.
- No active UI exposes Operations, old Story/Tower/Trading/Patrol rewards, daily attempts, stamina/tickets, direct-clear rewards, targeted Expedition shards, production debug controls, or `Golemore` as unexplained player-facing jargon.

## Diagnostics and isolated QA

- Expose full Expedition definitions/requirements, immutable roster baseline, Might configuration/components, effective Fellow Power components, total roster Power, confirmation that the Village Fellow hook remains neutral, best-run preview/receipt, idle segments/history/replay/cap/pity/receipt, Fellow Campaign baseline/run counts/version-2 reward replay, source-ledger reconciliation, and pre-v8 lineage evidence.
- Add isolated actions for exact Expedition push/claim, clock setup, Fellow Power/EXP/shard/rarity boundaries, Campaign first-clear/replay runs, assignment changes, and fault fixtures where necessary.
- Gameplay coverage must call authoritative production helpers/coordinator. No test-only resolver or reward implementation may become the oracle.
- Rejected and zero-write actions must assert all ten raw slots plus runtime/UI identity, not only active state.

## Acceptance gate

### Best-run resolution and Might

- Exact requirement formula and reference values; stage cap; stage definition IDs; safe-integer/overflow guards.
- Exact fresh Power order and fresh best stage 3. Requirement `-1 / exact / +1`; Power ties by `FELLOW_DEFS`; owned/unowned handling; one Fellow per stage; no duplicate exhaustion; no partial damage/overkill carry.
- Construct equal-Total-Power concentrated and balanced rosters whose Expedition results differ in the expected direction. Increasing a low/mid Fellow across a requirement boundary must increase predicted/actual progress when raising the strongest by the same irrelevant amount does not.
- Push preview is read-only. New high commits once; equal/lower/canceled/stale/disabled pushes are byte-exact zero-write/no-UI-mutation. Reload preserves exact highest stage, sequence, receipt, and exhausted order.
- New-high push grants zero Gold, pending Gold, Prosperity, EXP, shards, Gifts, Rank EXP, Bond, Intimacy, Companion/Family resources, and direct Might.
- Might thresholds `19/20`, `79/80`, `49,999/50,000`, cap truncation, overflow refusal, exact Level/multiplier, and no persisted derived shadows.
- Effective Fellow Power order and one final round; Total Fellow Roster Power safe sum; Companion Mastery transfer then Might exactly once; Campaign eligibility/efficiency update once.
- `ECONOMY_CONFIG.neutralHooks.fellowRoster` stays neutral. At identical state/time, migration and Might claims leave every Building rate component and total Village Gold rate unchanged; Expedition never becomes a direct or indirect Gold source.

### Fellow source ledger and Campaign successor

- Exact immutable schema-7 Fellow/campaign baseline and exact config identity; exact post-baseline run-count key set/sum; baseline-prefix extension; first-clear uniqueness; stage-local version-2 roll sequence and disjoint salts.
- First clear/replay Campaign EXP, targeted shards, Gift hit/miss, Rank EXP, Gold cost/efficiency, stale preview, and immediate replay remain behaviorally equivalent except for the documented future roll identity.
- Current EXP/Level, rarity, shards plus ascension spend reconcile exactly across baseline + Campaign + Expedition idle + QA channels.
- Reject altered baseline, ownership, run counts, global/stage sequences, current EXP/Level/rarity/shards, ascension spend, QA credits, idle totals, recipient map, extra/missing keys, foreign stage/save identity, and internally adjusted forged receipts.
- Existing schema-7 version-1 last receipt remains valid before the first post-schema-8 run and is never rewritten. Version-2 receipt validation covers first-clear and replay shard hit/miss.
- Post-schema-8 Campaign Gift hit/miss is exact in run replay/latest receipt, while the gate explicitly does not assert a complete global Gift inventory equation until every existing Gift source and spend has a migrated ledger.

### Idle chronology and atomic behavior

- Raw time `0/0.5/1 ms`, `Number.MAX_SAFE_INTEGER - 1 / exact / +1`, `Number.MAX_VALUE`, fractional clocks, epoch zero, clock rollback, local midnight, and DST boundaries.
- Interval `-1 / exact / +1`, multiple intervals, cap `-1 / exact / +1`, `>24h`, stage zero, multiple best-stage changes, cross-stage partial interval, split/combined settlement, reload, and immediate double claim.
- Exact Might rate changes by stage; shard chance boundaries/cap; uniform owned-recipient boundaries; misses 1–7; forced eighth; success reset; deterministic close/reopen result; no runtime RNG consumption.
- At Might cap, intervals still consume and pity/shards advance while actual Might award is zero. Empty/sub-hour claim remains pure zero-write.
- Source history rejects changed segments/counts/ordinals/pity/totals, claim-versus-push reorder, non-prefix best-run snapshot, altered nominal/actual Might, extra/foreign shard keys, stale pending identity, sequence rollback, and duplicate claim.
- At frozen time, Expedition push/claim never changes Gold/pending Gold. With advancing time, ordinary Village accrual may change pending Gold independently, but no Expedition receipt/UI may attribute it to Expedition.

### Migration, persistence, and recovery

- Fresh schema 8 and exact schema 0/1/2/3/4/5/6/7 → 8 migrations; exact pre-v8 predecessor/intermediate semantics; one receipt; no retroactive stage/Might/shards; no timestamp regression.
- Reserved root/nested-name collision at every origin refuses before writes. Exact Unicode, assignments, Oath Undo, Family carry, Campaign receipts, Tower histories, and all schema-7 resources survive.
- Ten-slot read/readback/write/verify/owner/active/cleanup faults; occupied malformed/foreign/byte-changed checkpoints; exact whitespace; receipt/checkpoint identity; later-clock retry before/after staged candidate.
- Historical pending/committed fresh/migration/ordinary/safe-reset transactions complete only after full effective-state/pre-v8 preflight. Missing-active recovery, cleanup races, cross-tab staleness, and safe-reset interruptions never duplicate or adopt unattested state.
- Ten-slot export/fixture/post-write boot/rollback/reset matrices restore exact raw/runtime/UI state and report combined rollback failures.
- Phase 6 semantic successor passes with every intentional schema/checkpoint/feature/Adventure/Fellow-Power/Campaign-receipt supersession itemized and backed by a Phase 7 replacement. Phase 6 Village formulas are not superseded.

### Live browser

Run twice at `320×568` and `390×844` with fresh schema 8, schema-7 migration, representative legacy migration, fresh best-run stage 3, new-high after low/mid Fellow growth, equal/worse zero-write push, idle hit/miss/pity/cap, reload, Might propagation to Fellow Campaign with unchanged Village rates, Campaign version-2 first-clear/replay, reduced motion, disabled/all-disabled/encoded-query/unattested/native-storage refusal, and persistence fault realms. Require zero failed rows, blank fatal output, zero warning/error console entries, and zero native-storage calls.

### Frozen evidence

- Preserve Phase 0–6 fixtures/manifests/docs and embedded asset bytes except explicitly itemized successor identities.
- Run Phase 7 CLI twice, Phase 6 semantic successor twice, checksums twice, and the live browser gate twice on one clean exact tip before review.

## Do not break

- Fellow Campaign Gold spending, targeted Fellow shards, EXP/Level, rarity/ascension, Bond separation, Player Rank, deterministic rewards, walking/reduced-motion presentation, and migrated Campaign position.
- Effective Fellow Power's accepted base/Level/rarity/Bond/Relic/Companion/Family order; assigned Companion 40% transfer; Companion Mastery propagation; one final round; Total Fellow Roster Power.
- Companion Campaign, Companion Tower challenge/idle history, Companion Mastery, assignment uniqueness, and Total Companion Roster Power.
- Building ownership of Gold, Building upgrades/cap, Family assignment, controlled modifier order, Oath `3% / 5% / 8%` final multiplier and +30% cap, Prosperity, Family carry/drop provenance, Gifts, and all three independent claim clocks.
- Nine-slot Phase 6 lineage expands additively to ten slots; all historical checkpoints, receipts, staging ownership, recovery precedence, safe-reset authentication, Oath Undo, storage-event refusal, and zero-write fail-closed behavior remain intact.
- Compatibility namespace, mobile/static-portrait architecture, production feature quarantine, and embedded art bytes.

## Residual risks and explicit non-goals

- Phase 7's six seeded owned Fellows naturally cap the initial reachable run far below stage 50. The data/algorithm support future roster growth; Phase 7 does not add acquisition content merely to fill the cap.
- Exact requirements, Might curve/name, idle rates/chance, and pity threshold remain Phase 10 tunables. Implement them as configuration, not duplicated literals.
- FNV identities are deterministic integrity/provenance bindings, not cryptographic authentication against a malicious same-origin editor.
- Web Storage has no atomic compare-and-swap; exact ownership rereads, revisions, raw identities, and storage events narrow/detect but cannot eliminate the final same-origin race.
- Safari/real-device behavior remains outside the Chromium gate unless separately tested.

## Exit gate

Phase 7 may merge only after one clean implementation/package tip passes the full gate twice, independent design/math/UI review, independent persistence/migration/failure review, exact fast-forward integration, remote verification, and byte-identical GitHub Pages verification. Do not merge or push from the implementation worktree during contract authoring or implementation review.

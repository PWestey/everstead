# EVERSTEAD — PHASE 8 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 7 package commit `6bbb2eccc1f79dd985bfde827bf9eb0753fb0845` (accepted Phase 7 production commit `8ca8353534bd4ae312e9470155988d209b0b6fed`, artifact SHA-256 `e15f41f378af381818ad9ff60bdc154a5c6d6b34395e3a8872a33c0a786e95d5`, 18,761,746 bytes).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `ANLCKQnmaSoEcNxj6N0MnMH3oSuYSAVAl1rb2i8G0gTVhNk9CQfjlapU4icwxaJ2od2tVeEyFOo_T-UanYvm5xSzLws0Z1H9lb5ueQT1emk`, is the product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, exact verified revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, defines Phase 8 as Relics, one Relic Stone material, Fellow equipment, immediate Power propagation, Campaign acquisition, and durable inventory/equipment/level state.
- Locked product rules are: Fellows equip Relics; Relics are farmable and levelable; one dedicated Relic Stone material is sufficient; Relic Power applies at the existing Relic step before Companion transfer; upgrade costs rise with level and/or tier; sets, affixes, reforging, multiple gear materials, and deeper gear systems are deferred.
- Preserve the single-file mobile shell, embedded art bytes, Phase 7 Power and Campaign behavior, all Phase 0–7 save/recovery guarantees, and every accepted reward/source ledger.

## Locked facts versus Phase 8 choices

The following are authoritative and must not be reinterpreted during implementation:

- Relics are a Fellow progression axis, not a new roster or Adventure mode.
- A Fellow can equip Relics, Relics alter Fellow Power, and Relics can be leveled.
- Relic Stones are the sole Relic upgrade material in V1.
- The active Relic multiplier is applied after the Bond milestone and before assigned Companion Power transfer.
- Relic upgrades do not directly alter Gold, Building production, Companion Power, Family bonuses, Might, or any non-Fellow system.
- No sets, random affixes, reforging, rerolls, merging, dismantling, or additional gear currencies are in scope.

The following are deliberately selected V1 implementation and balance choices. They are frozen for Phase 8 behavior and QA, but Phase 10 may rebalance their values through an explicit versioned migration:

- one Relic slot per Fellow;
- six unique, definition-backed, one-copy Relics;
- three tiers, level cap 10, deterministic Campaign sources, deterministic duplicate salvage, and the exact formulas below;
- all owned Fellows may equip any Relic, with no Type, Role, character, or element restriction;
- stages 1–6 each source one Relic; stages 7–10 are Stone-only;
- Relics have stat multipliers only, with no procs or special effects.

## Objective

Turn the existing neutral Relic hook and empty Fellow `relicSlots` scaffold into one complete, understandable V1 equipment loop: replay Fellow Campaign to acquire a finite Relic and Relic Stones, equip or move the Relic through existing Fellowship UI, level it with the same material, and see effective Fellow Power update immediately everywhere that consumes the authoritative selector.

The implementation must extend the current product in place. It must not rebuild the shell, create a new mode, replace Fellow Campaign, or reinterpret historical Campaign rewards.

## Scope boundary

### Keep as-is

- Compatibility namespace `oathforge_new_world_proto_v01`, five-item bottom navigation, mobile cards/modals/toasts, reduced-motion behavior, and all embedded portrait/background bytes.
- Village Gold and offline claim, Prosperity, Oaths, Gifts, Buildings, Family assignment/Intimacy/Bonds, Fellow EXP/Level/rarity/Bond, Companion progression/assignment, Player Rank, Fellow Campaign walking presentation, Companion Campaign, Companion Tower/Mastery, and Fellow Expedition/Might.
- Existing Campaign Gold costs, Power requirements, EXP, targeted Fellow shards, Gift rolls, first-clear Player Rank EXP, deterministic salts, and result timing.
- Phase 7 shared selectors, safe-integer helpers, captured clock rules, source-ledger validation, transactional mutation path, persistence recovery, diagnostics, export/reset, and isolated QA bridge.
- Historical disabled Story, Tower, Trading, Patrol, and Operations state as compatibility/recovery data only.

### Reuse with migration

- Activate the existing `FELLOW_CONFIG.neutralHooks.relic` position with the derived equipped-Relic multiplier; do not create a parallel Power formula.
- Migrate every Fellow's existing empty `relicSlots` array to an exact one-slot array containing `null` initially. Reuse the field rather than introduce another equipment owner map.
- Reuse Fellow cards and profiles for equipped-Relic summary, equip/move/unequip, Power preview, and upgrade controls.
- Reuse the Fellowship inventory tab strip for a fourth `Relics · 6` subview. Do not add a bottom-navigation item or Adventure subview.
- Reuse Fellow Campaign's existing atomic action and result presentation. Keep its accepted version-2 reward receipt exact and add one separate Relic side receipt in the same transaction; never run a second persistence mutation after a Campaign completion.
- Reuse deterministic definition ordering, canonical JSON/identity helpers, confirmation/stale-preview patterns, and isolated memory-storage QA authorization.

### Replace or activate

- Replace the neutral profile copy and neutral Relic Power component with actual equipped Relic state, derived level/tier bonus, and exact before/after Fellow Power display.
- Activate the reserved Phase 5 Campaign Relic/Relic Stone reward surface with the exact Phase 8 table below; the old neutral metadata is superseded rather than retained as a second reward definition.
- Checkpoint Phase 7 Campaign run history at schema 8→9, so a valid schema-8 save at the prior 100,000-run replay ceiling can continue in a new bounded epoch without retroactive rewards or sequence resets.
- Keep the current Fellow Campaign receipt at its accepted version-2 shape and identity. Add a separate authenticated Phase 8 Relic receipt that refers to the exact Campaign receipt without rewriting it.

### Remove or defer

- Do not add a Relic Adventure mode, Relic Tower, shop, Gold purchase, Gold upgrade, offline/Expedition/Tower Relic drops, automatic farming, or a separate Relic claim lane.
- Do not add a second slot, loadouts, auto-equip, character restrictions, Type/Role bonuses, elemental effects, active skills, proc effects, or combat RNG.
- Do not add random stats, affixes, sets, set bonuses, rarity rerolls, reforging, merging/tier-up, dismantling, selling, refunds, or additional materials/currencies.
- Do not add Relic art in Phase 8. Use the established code-native icon/card language so embedded asset bytes remain frozen.
- Do not rebalance Campaign costs, existing rewards, Fellow Power sources, Companion transfer, Family Bond, Might, or other Phase 10 tunables.
- Do not implement automation, audio/voice, Live2D/body physics, advanced animation, weekly boss, draft mode, clash, deeper patrol/gatherings, special CGs, museum, events, or advanced story.

## Canonical Relic catalogue and Campaign sources

Materialize one immutable six-entry Relic-definition array and one immutable exact ten-stage source table at startup. Save validation requires their exact IDs/order/config identity; it must not accept arbitrary user-defined Relics.

| Relic ID | Display name | Tier | Source stage | Base Stones per run | Duplicate salvage |
| --- | --- | ---: | --- | ---: | ---: |
| `first-road-lantern` | First-Road Lantern | 1 | `broken-roads-1` | 1 | 2 |
| `mossbound-compass` | Mossbound Compass | 1 | `broken-roads-2` | 1 | 2 |
| `emberglass-sigil` | Emberglass Sigil | 2 | `broken-roads-3` | 2 | 4 |
| `tideglass-charm` | Tideglass Charm | 2 | `broken-roads-4` | 2 | 4 |
| `stormforged-emblem` | Stormforged Emblem | 3 | `broken-roads-5` | 3 | 6 |
| `oathkeeper-crest` | Oathkeeper Crest | 3 | `broken-roads-6` | 3 | 6 |

- `broken-roads-7` through `broken-roads-10` have `targetRelicId = null`, grant exactly 3 base Relic Stones per successful run, and never acquire or salvage a Relic.
- The exact ten-stage Stone-tier vector is `[1,1,2,2,3,3,3,3,3,3]`.
- On the first successful post-schema-9 run of stages 1–6, acquire that stage's unique Relic at level 1 and also grant its base Stones.
- On every later successful run of that source stage, retain the single owned copy and grant base Stones plus duplicate salvage, totaling `3 × tier` Stones.
- There is no Relic drop RNG and this layer consumes no existing or new random channel. Previewing, canceling, reloading, diagnostics, equipping, or upgrading cannot affect Campaign Gift or shard outcomes.
- Historical runs and clears grant no retroactive Relic or Stones. A migrated player acquires a source Relic on the next legal successful run of that stage.
- The Phase 8 Stone distribution makes stage 5 the cheapest tier-3 duplicate farm after acquisition. This is an acknowledged Phase 10 balance item, not permission to silently change Phase 8 rewards.

## Level, cost, and Power math

- An unowned Relic has exact level `0`. An owned Relic has integer level `1…10`.
- Upgrading from current level `L` to `L + 1`, for `L = 1…9`, costs `5 × tier × L` Relic Stones. Level 10 has no next cost and cannot be upgraded.
- Cumulative spend from level 1 to level `L` is `5 × tier × (L - 1) × L / 2`.
- Exact lifetime cost to level 10 is 225 Stones for tier 1, 450 for tier 2, and 675 for tier 3; all six total 2,700 Stones.
- Store/derive the stat bonus as integer basis points: `bonusBps = tier × (100 + 25 × (level - 1))`.
- The multiplier is `1 + bonusBps / 10,000`. Do not round the component.
- Tier 1 ranges from 1.00% at level 1 to 3.25% at level 10; tier 2 from 2.00% to 6.50%; tier 3 from 3.00% to 9.75%.
- Relic Stones are a non-negative safe integer. Every award, spend, cumulative calculation, roster sum, intermediate Power component, and persistence projection must refuse unsafe arithmetic before mutation.

`effectiveFellowPowerComponents(id, state)` uses this exact order:

1. base Power
2. Level multiplier
3. rarity multiplier
4. Bond-milestone multiplier
5. equipped Relic multiplier
6. assigned Companion unrounded Power transfer at 40%
7. linked Family Bond multiplier
8. global Might multiplier
9. one final `Math.round` to effective Fellow Power

The critical calculation is `afterRelic = afterBondMilestone × relicMultiplier`, then `afterCompanion = afterRelic + assignedCompanionUnroundedPower × 0.40`. Never multiply the already-added Companion transfer by the Relic multiplier. Family and Might follow, each exactly once. Cards, profiles, Total Fellow Roster Power, Fellow Campaign, Fellow Expedition, and diagnostics consume this same selector immediately after equip, move, unequip, or upgrade.

## Canonical schema 9 state

Set `CURRENT_SCHEMA_VERSION = 9` and add exact production-owned state:

```text
relicStones: non-negative safe integer

relics: exact Relic IDs -> {
  owned: boolean,
  level: integer 0…10
}

fellows: exact Fellow IDs -> {
  ...accepted schema-8 fields,
  relicSlots: exact [null | Relic ID]
}

relicProgressLedger: {
  configIdentity: "phase-8-relic-progression-v1",
  schema8CampaignBaseline: {
    runOrdinal: non-negative safe integer,
    runCountsByStage: exact Campaign stage IDs -> non-negative safe integers,
    clearedStageIds: exact accepted prefix,
    firstClearClaimedStageIds: exact same prefix,
    playerRankExp: non-negative safe integer,
    lastReceipt: null | exact preserved schema-8 Campaign receipt
  },
  lastCampaignReceipt: null | exact Phase 8 Relic Campaign side receipt,
  qaCredits: {
    relicStones: non-negative safe integer
  }
}
```

- Do not persist Relic tier, source stage, bonus basis points, multiplier, next cost, cumulative spend, equipped owner, derived Power, or display state.
- `relicProgressLedger.configIdentity` binds exact Relic definitions/order, Campaign source table, Stone awards, salvage values, level cap, upgrade-cost curve, basis-point curve, side-receipt version/salt, and schema-9 Campaign epoch rules.
- For a migrated save, the ledger baseline is immutable and must equal the exact Campaign projection parsed from the pre-v9 schema-8 checkpoint and attested by the schema-8-to-9 migration receipt. A canonical fresh schema-9 save instead uses the exact schema-scoped default baseline with no migration receipt/checkpoint. A canonical schema-9 safe reset uses that same default baseline plus the authenticated version-4 retained-checkpoint marker; the marker, not a fictional predecessor receipt, is its authority.
- `relics` has exactly the six configured keys. Unowned means level 0; owned means level 1…10.
- Every Fellow has exactly one slot. Every unowned Fellow must have exact `[null]`; only an owned Fellow may hold an owned configured Relic ID. Each Relic ID appears in at most one Fellow slot globally. An empty slot and an owned-but-unequipped Relic are valid.
- Current Relic Stones plus exact cumulative spend across all Relics equals deterministic post-baseline Campaign Stone earnings plus `qaCredits.relicStones`.
- For a mapped stage with post-baseline count `d`, deterministic earnings are `tier × d + 2 × tier × max(0, d - 1)`. The Relic is owned if and only if `d > 0`.
- For stages 7–10 with post-baseline count `d`, deterministic earnings are exactly `3 × d` and no ownership changes.
- Production has no Stone grant, ownership grant, level edit, or equipment bypass outside the defined Campaign/equip/upgrade actions.
- Authorized isolated QA may grant Stones only, recording the exact amount in `qaCredits.relicStones`. It may not grant ownership or edit levels/slots directly.

## Schema-9 Campaign epoch checkpoint

- Schema 8→9 captures the exact accepted Campaign `{runOrdinal, runCountsByStage, clearedStageIds, firstClearClaimedStageIds, playerRankExp, lastReceipt}` into `schema8CampaignBaseline`.
- Reset live `fellowCampaign.runCountsByStage` to exact zeroes for a new Phase 8 epoch while preserving the global `fellowCampaign.runOrdinal`, clear/claim prefixes, target, and all other current Campaign state.
- The sum of live counts equals `fellowCampaign.runOrdinal - schema8CampaignBaseline.runOrdinal`.
- Let `b` be the frozen schema-8 count for one stage and `d` its current live Phase 8 count. For live run index `i = 0…d-1`, call the unchanged Phase 7 reward function with exact zero-based RNG ordinal `b + i`. After a successful run, the unchanged v2 receipt's one-based `stageRunSequence` is exactly `b + d`, and its reward ordinal is therefore `stageRunSequence - 1`. Never pass the one-based value directly to the reward function.
- The unchanged Campaign receipt retains `rewardIdentityVersion = 2`, `rewardSalt = "fellow-campaign-v2"`, and the accepted v2 receipt identity namespace. The separate Relic side receipt uses `identityVersion = 1` and `phase-8-relic-campaign-receipt-v1`; it must not relabel the Campaign reward identity as version 3.
- The first Phase 8 run of a source stage is determined only by that stage's live count changing `0 → 1`; baseline clears/runs never acquire Relics or Stones.
- Freeze a new independent ceiling of 100,000 live post-schema-9 Campaign runs. A valid schema-8 save already at the Phase 7 100,000-run ceiling migrates to live usage zero and may run immediately.
- A live count total of 99,999 may complete one final run; at 100,000, preview/action refuse before mutation and show exact used/remaining capacity. Diagnostics expose baseline counts/ordinal and live usage/remaining.
- Do not discard or reinterpret the Phase 7 baseline/ledger. Validation first replays the entire frozen old Phase 7 epoch from `fellowProgressLedger.schema7Baseline` and the frozen schema-8 Campaign counts, then replays the live Phase 8 epoch at absolute per-stage ordinals `b…b+d-1`.
- Current Fellow EXP equals schema-7 baseline EXP + frozen-old Campaign EXP + live Campaign EXP + exact QA EXP credits.
- Current Fellow shards plus exact ascension spend from schema-7 baseline rarity through current rarity equals schema-7 baseline shards + frozen-old Campaign shards + live Campaign shards + claimed Expedition shards + exact QA shard credits.
- Current Player Rank EXP equals `schema8CampaignBaseline.playerRankExp` plus first-clear Rank EXP for exactly the stages newly cleared in the live epoch. Current Rank remains derived from that total.
- Current clear and first-clear-claimed prefixes equal the exact schema-8 prefix followed by the exact contiguous live first clears; every newly cleared stage has a live count of at least one. Baseline-cleared stages have only replay runs.
- Global `fellowCampaign.runOrdinal` equals `schema8CampaignBaseline.runOrdinal + sum(live runCountsByStage)` using checked addition.
- Gifts retain Phase 7's explicit non-global-ledger exception: each live Gift roll and latest receipt is deterministic and validated, but current Gift inventory is not equated solely to Campaign rewards.
- The exact `schema8CampaignBaseline` must equal the Campaign projection parsed from the authenticated pre-v9 raw checkpoint/migration anchor for migrated saves. It cannot be synthesized from mutable current state.
- A future build approaching this new ceiling must introduce another explicit checkpoint. Raising the ceiling or collapsing history silently is forbidden.

## Fellow Campaign version-2 receipt and Phase 8 side receipt

- Keep `fellowCampaign.lastReceipt` in the exact accepted version-1/version-2 shape. A new post-schema-9 run writes an exact version-2 receipt using the accepted Phase 7 identity, fields, Gold/EXP/shard/Gift/Rank outcomes, and random salts.
- Let `b = schema8CampaignBaseline.runCountsByStage[stageId]` and `d = fellowCampaign.runCountsByStage[stageId]` after the latest run. The accepted v2 receipt stores one-based `stageRunSequence = b + d`; its existing reward calculation uses the zero-based ordinal `b + d - 1`. The Phase 8 checkpoint must not reset, duplicate, or shift its reward stream.
- If the sum of every live post-schema-9 stage count is zero, `relicProgressLedger.lastCampaignReceipt === null` and current `fellowCampaign.lastReceipt` exactly equals the cloned `schema8CampaignBaseline.lastReceipt`.
- If the live total is positive, `relicProgressLedger.lastCampaignReceipt` is non-null and authenticates the unique latest post-baseline Campaign run represented by the unchanged current v2 Campaign receipt.
- The side receipt has exactly these keys and no others: `mode`, `identityVersion`, `configIdentity`, `identity`, `completedAt`, `campaignSequence`, `stageId`, `stageRunSequence`, `phase8StageRunSequence`, `campaignRewardIdentityVersion`, `campaignRewardSalt`, `campaignRewardIdentity`, `campaignReceiptPreimageIdentity`, `sourceCountBefore`, `targetRelicId`, `relicAcquired`, `baseRelicStones`, `duplicateSalvageStones`, and `totalRelicStones`.
- `mode === "fellowCampaignRelic"`, `identityVersion === 1`, and `configIdentity === "phase-8-relic-progression-v1"`. `completedAt`, `stageId`, absolute `campaignSequence`, absolute `stageRunSequence`, Campaign reward version/salt/identity, and Campaign receipt preimage must exactly equal or authenticate the paired current v2 receipt and current Campaign state; self-consistent alternate labels, versions, times, or sequences are invalid.
- `campaignRewardIdentityVersion === 2`, `campaignRewardSalt === "fellow-campaign-v2"`, and `campaignRewardIdentity` exactly equal the current v2 receipt fields. Reconstruct the paired receipt in the accepted exact v2 key insertion order, then compute `campaignReceiptPreimageIdentity = rawIdentity(JSON.stringify(exactPairedV2Receipt))`; this proves the side receipt is paired with that precise Campaign result without changing the v2 envelope.
- `sourceCountBefore` is the zero-based live Phase 8 count for the completed stage before this run. `phase8StageRunSequence === sourceCountBefore + 1`; absolute `stageRunSequence === schema8CampaignBaseline.runCountsByStage[stageId] + phase8StageRunSequence`; and `campaignSequence === fellowCampaign.runOrdinal`.
- `relicAcquired` is true exactly for a mapped stage whose `sourceCountBefore === 0`; salvage is zero on that run. It is false thereafter and salvage is exact. It is always false on stages 7–10.
- Compute the side-receipt identity with this exact ordered preimage: `rawIdentity(JSON.stringify(["phase-8-relic-campaign-receipt-v1", saveId, mode, identityVersion, configIdentity, completedAt, campaignSequence, stageId, stageRunSequence, phase8StageRunSequence, campaignRewardIdentityVersion, campaignRewardSalt, campaignRewardIdentity, campaignReceiptPreimageIdentity, sourceCountBefore, targetRelicId, relicAcquired, baseRelicStones, duplicateSalvageStones, totalRelicStones]))`. The Campaign confirmation's stale-preview identity separately binds the current source count, exact target Relic owned/level state, current Stone balance, Campaign cost/reward preimage, and expected acquisition/Stone result. Relic adjudication is deterministic and consumes no RNG.
- Equip, move, unequip, upgrade, QA Stone credit, and non-Campaign mutations retain the exact latest side receipt. It deliberately does not bind a mutable current Stone balance, current Relic level, or current equipment owner; the durable earning/spend/ownership algebra validates current state.
- Validation reconstructs the latest live run by decrementing the receipt stage's live count once, verifies all remaining counts as the preceding history, then derives the exact source mapping, acquisition/salvage, Stone delta, v2 pairing, and identities. Post-receipt upgrades, equipment changes, and authorized QA Stone credits must continue to validate after reload because mutable current balances/owners are governed by the durable algebra rather than claimed as historical receipt fields. Tampering with any count, baseline, mapping, acquisition flag, Stone component, v2 receipt/reward, preimage, zero/one-based sequence, or identity fails validation.

## Equipment and upgrade actions

All Relic actions use the central clone → settle old entitlement where applicable → mutate → validate → commit → adopt coordinator. They do not settle or advance elapsed lanes merely to inspect or refuse an action.

### Equip, move, displace, and unequip

- Any owned Fellow may equip any owned Relic. There are no eligibility restrictions beyond ownership and exact configured IDs.
- Selecting an owned Relic for a Fellow atomically detaches it from any prior Fellow. If the target Fellow already has a different Relic, that Relic becomes owned inventory with no slot.
- Reassignment is free. It grants/refunds no resource and changes no Relic level.
- Selecting `None` unequips the target Fellow's current Relic into inventory.
- Selecting the exact already-equipped Relic is a byte-exact no-op: no revision, storage write, toast, modal, timer, render, or focus mutation.
- Unknown/unowned IDs, unknown/unowned Fellows, stale previews, disabled controls, cancellation, invalid duplicate/extra-slot state, and pre-commit validation failure refuse before any persistence write.
- Confirmation copy shows the exact displaced/moved Relic and immediate before/after effective Fellow Power for every Fellow whose slot changes.

### Upgrade

- Only an owned Relic at level 1…9 may upgrade. Require explicit confirmation with current level, next level, exact current balance, cost, and before/after bonus. If equipped, show the exact owner's effective Fellow Power before/after; if unequipped, show `Unequipped — no Fellow Power changes until equipped` instead of inventing an affected Fellow.
- Spend exactly the configured cost and increment exactly one level in the same transaction.
- At level 10 or with insufficient Stones, the control is disabled and the action itself still fails closed if invoked programmatically.
- Cost-minus-one refuses; exact cost succeeds and may leave zero; extra Stones preserve the exact remainder.
- Reject/cancel/stale/disabled/overflow and other pre-commit refusal paths are byte-exact no-ops across all protected storage slots and runtime/UI observable state.

## User interface and presentation

- Add `Relics · 6` as the fourth Fellowship inventory tab, following the existing Fellows/Family/Companions card and tab language.
- Schema 9 accepts persisted `ui.roster = "relics"`. Schema-8 semantic validation projects that route back to `"fellows"`; the new UI route must not be mistaken for a schema-8 product mutation.
- A locked card shows name, tier, source Campaign stage, and `Locked`. An owned card shows tier, level, exact bonus, equipped Fellow or `Unequipped`, Stone balance, next exact cost or `Max Level`, and actions appropriate to state.
- Fellow cards show the equipped Relic name/level/bonus or `No Relic`. Fellow profiles replace neutral Relic text with the live Relic component and equip/unequip/upgrade entry points.
- Equip and equipped-Relic upgrade confirmations show exact effective Fellow Power before/after using the authoritative selector. Moving a Relic shows both affected Fellows when applicable. An unequipped-Relic upgrade shows exact bonus before/after and the explicit no-current-Power-change copy.
- Campaign preview shows the deterministic Relic result before confirmation: `New Relic +N Stones`, `Duplicate salvaged +X + base Y = total Z`, or `+3 Stones` for stages 7–10.
- Campaign result presents the same exact outcome after the existing walking/slideshow delay. Reduced motion presents immediately using the accepted Phase 5 behavior.
- No top-bar Stone counter is required. Relic inventory/profile and Campaign preview/result must expose the material clearly enough to understand acquisition and spending.
- Preserve keyboard operation, semantic buttons/labels, modal focus behavior, 320×568 and 390×844 layouts, safe areas, overflow, and readable disabled reasons.

## Persistence, migration, recovery, and diagnostics

- Schema version is exact integer 9. Use exact write-once pre-v9 raw checkpoint key `oathforge_new_world_proto_v01__raw_backup_v8`.
- Protect these exact eleven raw slots: active, staging, root v0.1 raw backup, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, pre-v7, pre-v8, and pre-v9. There is no pre-v1 slot.
- Append exactly one `schema-8-to-9` migration receipt for a migrated save. It has exact fields `id`, `from`, `to`, `appliedAt`, `migrationSource`, `checkpointLineage`, `configIdentity`, `schema8PredecessorIdentity`, `schema8CampaignBaselineIdentity`, and `initializationIdentity`.
- `checkpointLineage` contains exact raw identities, including null and whitespace-sensitive occupied bytes, for root v0.1 plus pre-v2 through pre-v9. `schema8PredecessorIdentity` equals the raw identity of the exact pre-v9 checkpoint. `schema8CampaignBaselineIdentity` binds its exact Campaign projection. `initializationIdentity` binds zero live counts, exact initial Relic/Stone/slot/ledger state, UI projection, and the baseline identity. `configIdentity` is exactly `phase-8-relic-progression-v1`.
- Before the first write, read all eleven slots and classify active/staging/checkpoints. Collision, lineage, historical transaction, missing-active, and recovery preflight use that one snapshot. Re-read and compare all eleven slots immediately before ensuring pre-v9 or staging; any change blocks before the next write.
- Reserved Phase 8 root fields in a schema 0…8 source, malformed/foreign/unrelated staging, unrelated or incompatible occupied pre-v9, higher conflicting checkpoint material, future schema, invalid highest checkpoint, or any read/classification/preflight failure is fail-closed and zero-write. Retain every byte for recovery; do not clean unknown material.
- Preflight rejects incompatible root `relics`, `relicStones`, or `relicProgressLedger` collisions before writing any checkpoint or active state. The same rule applies to active and the effective state of any historical staged transaction.
- Complete or clean every authenticated released schema 0…8 pending/committed fresh, migration, ordinary, or safe-reset transaction before constructing schema 9. Validate its exact historical transaction class, active/raw base identity, staging ownership, protected checkpoint lineage, and effective state first. Never strand or bypass a released transaction because Phase 8 recognizes a newer target.
- Bootstrap precedence is: exact authenticated historical completion; authenticated schema-9 staging/current recovery; valid current schema-9; exact schema 0…8 migration; narrowly authenticated missing-active recovery; canonical fresh only when every permanent checkpoint is empty. The highest occupied protected checkpoint governs; a lower apparently valid source cannot bypass invalid higher material.
- Missing-active recovery may adopt an authenticated schema-9 stage that proves its exact source and all eleven-slot lineage. A lone pre-v9 checkpoint may be reconstructed only when it is the exact deterministic immediate schema-8 successor of authenticated lower protected origin; an evolved/unrelated lone checkpoint remains blocked. Occupied lower permanent material without an authenticated highest successor never falls through to fresh.
- Migration from schema 8 writes pre-v9 once as the exact predecessor raw, verifies it, prepares one reward-neutral schema-9 candidate, stages/verifies, rechecks active identity, commits/verifies, validates, and removes staging only after proving cleanup ownership. Every fault boundary retains the exact pending/committed bytes required by the accepted transaction protocol.
- An authenticated staged schema-9 target fixes exact target bytes, including migration time, baseline, counts, receipts, initialization, and reward-neutral state; retry reuses those bytes. If a fault occurs after exact pre-v9 verification but before any schema-9 candidate/stage is durable, retry reuses the exact pre-v9 bytes and exact baseline/counts/rewards/checkpoint/init content. It may capture only a new monotonic `appliedAt`/`updatedAt` migration time under the accepted later-clock rule; it may not grant or settle entitlement, change initialization content, or replace pre-v9.
- Schema-9 safe reset uses retained-checkpoint-lineage marker version 4. It binds pre-reset active identity/save/revision and exact independent raw identities for root v0.1 plus pre-v2 through pre-v9. It has no schema-8-to-9 receipt, uses the canonical schema-scoped Phase 8 default, and retains every archival byte. Interrupted pending/committed reset recovery authenticates the marker and staging class before adoption/cleanup.
- Eleven-slot export reports every raw value and read error. Schema-9 fixture installation requires exact eleven-slot preimage, validates the expected post-boot state, and restores all eleven slots plus runtime/UI on failure. Storage events on any of the eleven keys mark the tab stale or block exactly as the accepted ownership rules require.
- Preserve exact schema 0…8 lineage. Fresh schema 9 has no migration receipt and no permanent checkpoint bytes. A migrated schema-9 current must authenticate its exact pre-v9 anchor/receipt; a safe-reset schema-9 current must authenticate marker v4; these authorities are mutually exclusive.
- Fresh state and safe reset have zero Stones, all six Relics unowned at level 0, every Fellow slot `[null]`, an exact schema-8 Campaign baseline at the fresh ordinal/counts, and byte-equivalent Phase 7 Fellow Power.
- Schema 0…8 migration preserves all existing data and receives no retroactive Relic/Stone reward. Cleared Campaign stages remain cleared and replayable.
- Schema validation, migration receipt, storage fault recovery, active/staging selection, cross-tab staleness, export, reset, and QA fixtures must know the exact new state and eleven-slot topology.
- Diagnostics show schema/config identity, Relic inventory, level, slot owner, derived bonus/cost/spend, Stone earned/spent/QA/balance algebra, Campaign baseline/live counts, live cap usage, receipt identity/version, Power component order, and protected-slot status without exposing a production mutation path.
- Production feature behavior must not depend on QA flags. Isolated QA grants require the accepted destructive attestation and exact native-storage rejection.
- Released input support is exactly schema 0…8. Before the Phase 8 production seal, provisional schema-9 shapes may be replaced only inside the isolated, unmerged, unpublished Phase 8 worktree/QA storage. Once schema 9 is sealed or persisted by a released build, any incompatible stored-state, receipt, ledger, checkpoint, or marker change requires schema 10; do not mutate sealed schema 9 in place.

## Atomicity and do-not-break rules

- A successful Campaign run charges Gold and applies existing Campaign rewards, Relic acquisition/salvage, Stones, counts, the unchanged v2 Campaign receipt, the Phase 8 side receipt, validation, and one persistence commit atomically.
- Non-Campaign Relic actions—equip, move, unequip, upgrade, and authorized QA Stone credit—do not directly mutate Gold, Prosperity, Oaths, Gifts, Family state, Companion state, Player Rank, Campaign clears/rewards, Expedition/Might state, Tower/Mastery state, or elapsed clocks. Ordinary central settlement performed by the accepted coordinator during a successful persisted mutation remains unchanged.
- Equip/upgrade must not consume RNG, Campaign sequence, idle intervals, or receipt ordinals.
- A pre-commit failed/refused/canceled/no-op Relic equip/unequip/upgrade action writes none of the eleven protected slots and does not change revision, runtime state, toast, modal, timers, focus, or rendered result state. Campaign capacity/eligibility refusals also write no persistence or gameplay state but preserve the accepted Phase 7 intentional disabled copy/toast behavior; Phase 8 must not silently suppress or duplicate it.
- Persistence faults preserve the accepted transaction protocol rather than pretending every injected boundary is a zero-write event: depending on the boundary, an authenticated staged successor, committed active value with retained staging, or cleanup-only residue may remain. In-memory adoption rolls back or blocks exactly as the existing coordinator requires; retry/reload deterministically completes or cleans the one transaction without charging Gold or duplicating Campaign rewards, Relics, Stones, levels, or equipment changes.
- Only isolated QA fixture installation retains the accepted promise of full eleven-slot plus runtime/UI rollback on fault. Production action fault tests must assert the exact protocol state appropriate to the injected boundary.
- Do not break Phase 7 exact Fellow Power when no Relic is equipped; assigned Companion transfer amount; Family multiplier; Might multiplier; one final round; safe Total Fellow Roster Power sum; Fellow Campaign eligibility/cost; or Expedition weakest-first order.
- Do not break Village/Building/Family Gold, any 24-hour idle cap, Oath boosts, Family assignment, Fellow/Family/Companion shards, Gifts, Bonds, Companion Campaign/Tower, Mastery, Player Rank, save/load, offline/reload, cross-tab conflict handling, or recovery.
- Do not change visible Everstead branding or revive legacy OATHFORGE/New World display copy; the compatibility storage namespace may remain.

## Acceptance gates

Phase 8 is accepted only when all of the following pass from a clean exact tip:

1. Exact six-ID catalogue, tiers, names, one-slot rule, ten-stage source mapping, Stone vector, deterministic acquisition/salvage, and no Relic RNG.
2. Fresh state plus schema 0…8 migrations, later-clock/retry cases, collision preflight, exact pre-v9 checkpoint, and the exact named eleven-slot matrix—active, staging, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, pre-v7, pre-v8, pre-v9—pass across read/re-read, ownership, pending/committed historical transactions, missing-active precedence, safe-reset marker v4, export/fixture rollback, storage events, and every injected commit boundary.
3. Frozen baseline stage count `b = 0`, positive, 99,999, and 100,000 with live count `d = 0/1` pass exact zero/one-based equations and preserve v2 hit/miss/Gift equality across the schema-9 boundary. A valid schema-8 Campaign history at old total usage 99,999 and 100,000 migrates to live Phase 8 usage zero and its first post-migration run succeeds. Live total 99,999→100,000 succeeds; the next run performs no persistence/gameplay mutation while preserving the accepted capacity warning UI.
4. First, second, interleaved, and reload-separated runs of stages 1–10 derive exact ownership/Stones, preserve existing Gold/EXP/shard/Gift/Rank outcomes and v2 receipts, and produce authentic paired Phase 8 side receipts. Frozen-old plus live Fellow EXP, Fellow shard/ascension, Player Rank, clear-prefix, ordinal, and Gift-exception equations reconcile exactly.
5. Stage 1–6 acquisition, duplicate salvage, stage 7–10 Stone-only behavior, side-receipt exact-key/literal/time/pairing and zero/one-based mutation attacks, count/baseline mutation attacks, post-receipt upgrade/QA-credit reload, and no-retroactive-reward cases all pass.
6. Tier 1/2/3 levels 1, 2, 9, and 10; cost-minus-one/exact/plus-one; zero remainder; maximum-safe-integer award/spend/overflow; lifetime-spend algebra; equipped owner Power preview; and unequipped bonus-only/no-current-Power-change upgrade pass.
7. Equip, move, displacement, unequip, reload, same-assignment no-op, unknown/unowned ID, unknown/unowned Fellow, forged Relic on an unowned Fellow, duplicate equip, extra slot, cancellation, stale preview, disabled invocation, and persistence fault cases pass.
8. Tier 1/2/3 level 1/10 basis points and exact Power order pass. Companion transfer remains numerically unchanged; Relic never multiplies it. Family and Might follow exactly once, with one final round and safe total sum.
9. Fellow cards/profiles, Total Fellow Roster Power, Campaign, Expedition, and diagnostics update immediately from the same selector. Village rates and Companion Power/modes remain unchanged.
10. Isolated QA Stone credit passes exact attestation; absent/false isolation and captured native storage reject without writes. No ownership/level/equip bypass exists.
11. CLI verifier passes twice; current checksums pass twice; frozen historical production assets/docs/fixtures pass exact checks; Phase 7 semantic successor passes with only enumerated schema-9, Campaign-epoch/side-receipt, active Relic-hook, and UI supersessions.
12. Live in-app Chromium passes twice at both 320×568 and 390×844, including normal/reduced motion, Campaign result presentation, Relic inventory/profile actions, reload durability, modal/focus/keyboard behavior, and zero warning/error console entries.
13. Independent exact-behavior and save/recovery reviewers both issue final PASS on the same clean production commit. QA/docs are added in later focused commits without changing the accepted production artifact.
14. Final manifest, artifact SHA-256/byte length, embedded-asset aggregate, result document, and public Pages byte identity are sealed only after every prior gate passes.

## Required Phase 8 QA package

- Add an independent `qa/phase-8/` CLI and live-browser package. Do not weaken or rewrite historical accepted tests merely to make Phase 8 pass.
- Freeze exact historical artifacts/checksums where production bytes are expected to remain unchanged, especially embedded art and historical docs/fixtures.
- Add a Phase 7 semantic-successor verifier that recognizes only these intentional supersessions: schema 9 and eleven-slot topology; new Campaign epoch checkpoint and paired Relic side receipt; activated Relic hook; one-slot migration; Relic inventory/profile/Campaign result UI; and new diagnostics/export/reset coverage. The accepted Campaign v2 envelope/reward behavior remains exact.
- Preserve every other Phase 7 behavior semantically, including Campaign reward streams, Expedition/Might, Companion transfer, Family/Village isolation, idle claims, no-op discipline, and QA bridge safety.
- The result document must report exact commit/artifact identities, CLI/live counts, mobile sizes, console result, migration/recovery coverage, reviewer verdicts, public deployment evidence, and any residual risk.

## Deferred after Phase 8

- Phase 9 Player Rank/unlock refinement beyond the already accepted Rank foundation.
- Phase 10 economy/Power integration, tuning, claim systems, and broader bad-luck protection; this includes revisiting the stage-5 generic Stone farm and final Relic curves.
- Phase 11 V1 polish/QoL/content expansion.
- Post-V1 portrait sway/body physics, Live2D, advanced animation, weekly boss, draft mode, clash, deeper patrol/gatherings, advanced Relic sets/affixes/reforging, special CGs, museum, events, advanced story, audio, and voice.

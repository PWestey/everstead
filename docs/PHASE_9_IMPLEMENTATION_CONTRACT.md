# EVERSTEAD — PHASE 9 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 8 package commit `d3ce87a00ff37945e0b61f921092f04a8c808851` (accepted production commit `83d662725f2ce4db2ccbcec67e431af517254fc6`, artifact SHA-256 `d2fa8ab00d40a071dd58486e58e4c61c79ab10164d1b96a55ec7303377401309`, 18,838,682 bytes).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, exact verified revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, is the product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, exact verified revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, defines Phase 9 as the Player Rank unlock spine.
- Preserve the single-file mobile shell, embedded art bytes, Player/Rank foundation, all Phase 0–8 gameplay and save/recovery guarantees, and every accepted reward/source ledger.

## Locked facts versus Phase 9 choices

The following are authoritative:

- Everstead has one central protagonist representing the player/user.
- Player Rank represents advancement and gates content, systems, stages, and milestones.
- The current walking/slideshow Fellow Campaign remains the main Player presentation; advanced walking animation is not required.
- Rank requirements and the unlock schedule are balance variables until tested.
- Rank must not gate or replace the Oath → Building → Gold core loop, introduce stamina, or strand a save behind an inaccessible resource.

The following exact V1 choices are frozen for Phase 9 and QA. Changing them after schema 10 is released requires a later schema migration:

- Keep the existing Rank cap, thresholds, first-clear Rank EXP values, sole Player avatar, and Rank-2 replay rule exactly unchanged.
- Rank milestones award access only. Phase 9 adds no Gold, Gifts, shards, Relic Stones, EXP, Power, or other material reward and no claim button/pending reward state.
- New Rank gates apply to fresh schema-10 games and safe resets. A migrated pre-schema-10 game receives exact grandfathered access to every newly gated surface that the released schema-9 product made universally available.
- Rank gates pace Fellow Campaign stage bands and the three later Adventure routes. Oaths, Village, Gold collection, Buildings/upgrades, Fellowship roster/profile management, Family assignment/Gifts, Companion assignment, rarity ascension, Relic inventory/equip/upgrade, More, export, diagnostics, and recovery remain available.
- Keep one V1 protagonist: `wayfarer` / `The Wayfarer`. No rename, customization, combat Power, roster slot, equipment, Companion assignment, Family link, or Oath modifier is added.

## Objective

Complete Player Rank as an understandable, data-driven unlock spine after all core destinations exist. A fresh player advances the Broken Roads in readable bands, sees the next benefit before reaching it, and opens Companion Campaign, Companion Tower, and Fellow Expedition in a deadlock-free order. A migrated player keeps every previously available route and stage without receiving retroactive Rank EXP or resources.

## Scope boundary

### Keep as-is

- Compatibility storage namespace, five-item bottom navigation, mobile cards/modals/toasts, reduced-motion behavior, and embedded portrait/background bytes.
- Exact `player:{avatarId,rankExp,rank}` persisted shape and `playerRankForExp` behavior used by schemas 6–9.
- Rank cap 5; cumulative thresholds `[0,50,125,225,350]`; unclamped non-negative safe-integer lifetime Rank EXP; Rank-2 Campaign replay.
- Fellow Campaign first clears as the sole Rank EXP source. Replays and every other mode grant zero Rank EXP.
- Existing Campaign costs, Power requirements, EXP/shards/Gift rolls, Rank EXP, version-2 receipt, Phase 8 Relic side receipt, run sequence, RNG identity, result timing, and 100,000-live-run ceiling.
- Village/offline Gold, Prosperity, Oaths, Buildings, Family, Fellows, Companions, Relics, Companion Campaign/Tower/Mastery, Fellow Expedition/Might, and all existing source ledgers.
- Disabled Story, legacy Tower, Trading, Patrol, and Operations remain compatibility data only and never become Rank unlocks.

### Reuse with migration

- Reuse the top-bar Rank pill, Campaign Player card, `.player-avatar`, `.campaign-player`, `.player-rank`, progress meters, More screen, modal system, and existing Wayfarer CSS/static art hook.
- Reuse `featureEnabled` only for build availability. Add a separate Player-unlock selector for saved progression; never make QA/runtime feature flags determine migrated access.
- Reuse Adventure tabs and Campaign nodes, showing locked states and exact Rank requirements rather than hiding destinations.
- Reuse the central preview → authoritative leaf check → mutation coordinator pattern. Rank refusal occurs before confirmation, settlement, RNG, timers, or persistence.

### Replace or activate

- Replace hard-coded Rank presentation with immutable Rank definitions and one canonical unlock registry.
- Extend first-clear Campaign eligibility with the exact stage-band gate while preserving the existing contiguous-prefix, Power, Gold, and capacity rules.
- Add a Player profile/unlock-roadmap modal reachable from the top bar, Campaign Player card, and More screen.
- Add schema-10 grandfather metadata and exact pre-v10 persistence/recovery support.

### Remove or defer

- No material Rank rewards, reward chest, manual claim, pending entitlement, daily Rank task, Rank shop, prestige, energy, stamina, or monetization-style friction.
- No avatar chooser, player name, cosmetic inventory, player combat stats, gear, skills, romance relation, or new art.
- No Rank gate on Oaths, Village, collection, Building production/upgrades, Fellowship tabs/profiles/actions, Relics, More, save export, reset, diagnostics, or recovery.
- No Rank EXP from Oaths, Buildings, Companion Campaign/Tower, Fellow Expedition, idle claims, roster actions, or QA runtime configuration.
- No Phase 10 balancing, Phase 11 automation, or Post-V1 animation/content work.

## Canonical Rank curve and EXP source

| Rank | Minimum cumulative EXP | Fresh-game access milestone |
| --- | ---: | --- |
| 1 | 0 | Village, Oaths, Fellowship/Relics, Fellow Campaign stages 1–2 |
| 2 | 50 | Campaign replay, stages 3–4, Companion Campaign |
| 3 | 125 | Stages 5–6, Companion Tower |
| 4 | 225 | Stages 7–9, Fellow Expedition |
| 5 | 350 | Stage 10; all Phase 9 roads open |

- Preserve the exact ten-stage first-clear Rank EXP vector `[25,30,35,40,45,50,55,60,65,70]`, or `25 + 5 × (stageOrdinal - 1)`.
- Replays award exact zero Rank EXP.
- The resulting fresh path is deadlock-free: `0 → 25 → 55/R2 → 90 → 130/R3 → 175 → 225/R4 → 280 → 340 → 405/R5 → 475`.
- Do not infer Rank EXP from Story position, Campaign clear count, Fellow/Companion progression, Buildings, Prosperity, or mode progress.
- Preserve non-negative safe-integer Rank EXP above the Rank-5 threshold. Any addition that would exceed `Number.MAX_SAFE_INTEGER` refuses before mutation.
- Do not redefine the released schema-6–9 Rank selector or reinterpret old validation. The Phase 9 registry references the accepted selector/threshold values and owns a distinct config identity.

## Canonical Rank definitions and unlock registry

- Materialize one immutable `PLAYER_RANK_DEFS` array with exactly five entries in Rank order. Each entry has exactly `id`, `rank`, `label`, and `unlockIds`. IDs are `rank-1` through `rank-5`; `rank` is the matching integer; `label` is display copy; and `unlockIds` references the ordered registry below. Rank thresholds remain sourced only from the frozen `PLAYER_CONFIG.rankThresholds` and are not duplicated in these definitions.
- Materialize one immutable, ordered 12-entry `PLAYER_UNLOCK_DEFS` table. Every entry has exactly `id`, `rank`, `targetKind`, `targetKey`, `roadmapLabel`, and `phaseNineGate`. Requirements must not be duplicated as independent literals in UI or handlers.

Exact registry, in canonical order:

| Unlock ID | Rank | `targetKind` | `targetKey` | `roadmapLabel` | Phase 9 gate |
| --- | ---: | --- | --- | --- | --- |
| `fellow-campaign-replay` | 2 | `campaign-action` | `replay` | `Campaign replay` | `false` |
| `fellow-campaign-stage-3` | 2 | `campaign-stage` | `broken-roads-3` | `Broken Roads stage 3` | `true` |
| `fellow-campaign-stage-4` | 2 | `campaign-stage` | `broken-roads-4` | `Broken Roads stage 4` | `true` |
| `companion-campaign` | 2 | `adventure-route` | `companionCampaign` | `Companion Campaign` | `true` |
| `fellow-campaign-stage-5` | 3 | `campaign-stage` | `broken-roads-5` | `Broken Roads stage 5` | `true` |
| `fellow-campaign-stage-6` | 3 | `campaign-stage` | `broken-roads-6` | `Broken Roads stage 6` | `true` |
| `companion-tower` | 3 | `adventure-route` | `companionTower` | `Companion Tower` | `true` |
| `fellow-campaign-stage-7` | 4 | `campaign-stage` | `broken-roads-7` | `Broken Roads stage 7` | `true` |
| `fellow-campaign-stage-8` | 4 | `campaign-stage` | `broken-roads-8` | `Broken Roads stage 8` | `true` |
| `fellow-campaign-stage-9` | 4 | `campaign-stage` | `broken-roads-9` | `Broken Roads stage 9` | `true` |
| `fellow-expedition` | 4 | `adventure-route` | `fellowExpedition` | `Fellow Expedition` | `true` |
| `fellow-campaign-stage-10` | 5 | `campaign-stage` | `broken-roads-10` | `Broken Roads stage 10` | `true` |

- Derive `PHASE_NINE_GATE_IDS` by filtering `phaseNineGate === true` without reordering. It is the exact eleven-ID list beginning `fellow-campaign-stage-3` and ending `fellow-campaign-stage-10` shown above.
- `PLAYER_RANK_DEFS.unlockIds` is exact: Rank 1 `[]`; Rank 2 `[fellow-campaign-replay, fellow-campaign-stage-3, fellow-campaign-stage-4, companion-campaign]`; Rank 3 `[fellow-campaign-stage-5, fellow-campaign-stage-6, companion-tower]`; Rank 4 `[fellow-campaign-stage-7, fellow-campaign-stage-8, fellow-campaign-stage-9, fellow-expedition]`; Rank 5 `[fellow-campaign-stage-10]`.
- `fellow-campaign-replay` remains the existing Rank-2 rule and is never in `PHASE_NINE_GATE_IDS`. A migrated Rank-1 player cannot replay merely because another route or stage is grandfathered.
- Fellow Campaign stages 1–2, Fellow Campaign route access, Companion/Family/Fellow/Relic roster management, and all core economy surfaces have no Phase 9 gate.
- Effective access to a newly gated definition is true when `player.rank >= requiredRank` or `playerUnlocks.grandfatheredUnlockIds` contains its ID.
- First-clear stage access also requires the exact accepted contiguous prior-stage prefix. Grandfathering never permits stage skipping.
- Replays still require that the stage is cleared and Player Rank is at least 2; grandfathering never overrides replay Rank.
- Invalid, negative, non-integer, or unsafe Rank EXP is a validation/refusal condition, not a silent Rank-1 fallback.
- Production helpers expose one canonical gate lookup/map used by UI, direct actions, diagnostics, and QA. Unknown/foreign unlock IDs fail closed.

## Canonical schema-10 state

Set `CURRENT_SCHEMA_VERSION = 10` and add exactly one production-owned root:

```text
playerUnlocks: {
  configIdentity: "phase-9-player-rank-unlocks-v1",
  grandfatheredUnlockIds: exact [] or exact full PHASE_NINE_GATE_IDS
}
```

- Keep `player` at the exact accepted three keys: `avatarId`, `rankExp`, and derived `rank`.
- Do not persist Rank thresholds, Rank definitions, stage requirements, unlock booleans/maps, next Rank, progress percentage, EXP remaining, roadmap copy, legacy labels, lock reasons, or modal state.
- Fresh schema 10 and schema-10 safe reset use the exact config identity and `[]`.
- Every schema 0…9 migration uses the exact full `PHASE_NINE_GATE_IDS` because every newly gated target was universally available in the released schema-9 product. It grants no replay bypass and no material/Rank reward.
- These are the only two valid values. A non-empty proper subset is invalid. The full list requires an authentic `schema-9-to-10` receipt and exact pre-v10 authority; `[]` requires canonical fresh or marker-v5 safe-reset authority. No ordinary production mutation can alter the list.
- Current Rank always equals the accepted derivation from exact current Rank EXP. Unlock state is derived and cannot change Rank, Rank EXP, or resources.
- `configIdentity` binds exact Rank thresholds/cap, EXP source vector, unlock IDs/order/requirements/targets, grandfather policy, Player identity boundary, and access-only milestone rule.

## Player profile and unlock-roadmap UX

- Turn the top-bar `R#` pill into a semantic Player-profile button without changing the five bottom destinations.
- The existing Campaign Wayfarer/Rank card and a new More-screen Player card open the same profile modal.
- Show The Wayfarer, current Rank, exact lifetime Rank EXP, current threshold, next threshold, EXP remaining, and a progress meter. Rank 5 displays cap/completion without inventing Rank 6.
- Show all five V1 Rank headings in order and render status per unlock definition, not as one potentially mixed row status. Each unlock displays `Available`, `Unlocks at Rank N`, or `Legacy access` as derived from the canonical selector. Rank 1 separately lists the always-available core surfaces.
- Locked Adventure tabs and Campaign nodes remain focusable semantic buttons with `aria-disabled="true"`, not native `disabled`, so keyboard/pointer activation can explain the lock. Activation shows exact transient copy `Requires Player Rank N.` and must not persist the route/stage.
- Locked Campaign nodes show the exact Rank requirement. Preview/refusal distinguishes sequence lock, Rank lock, Power shortage, Gold shortage, and Campaign history ceiling.
- A successful first clear that crosses a threshold must show one transient Rank-up/unlock summary inside the existing Campaign result modal. Capture exact `{beforeRank,afterRank,newlyRankUnlockedIds}` in the immutable presentation snapshot before the delayed render; never reread mutable Player state after the 1100 ms delay. Only Rank-derived entries appear—grandfather-only access is never presented as newly unlocked. Do not alter either sealed Campaign receipt, persist a banner flag, or replay the presentation after reload.
- Preserve keyboard operation, focus, semantic labels, reduced motion, 320×568 and 390×844 layouts, safe areas, and no horizontal overflow.

## Gate enforcement and atomicity

- Add Rank checks to both presentation routing and authoritative leaf helpers for Campaign stage select/run, Companion Campaign select/run, Companion Tower clear/claim, Fellow Expedition push/claim, and `setAdventure`.
- Feature authorization and Rank authorization are separate and both must pass. Runtime QA flags cannot unlock Player content or influence migration grandfathering.
- Every locked direct/helper path refuses before confirmation, mutation, elapsed settlement, RNG, timers, modal/result presentation, or persistence. With presentation disabled it is an exact no-op across runtime/UI/revision and all protected slots.
- A user click shows only the exact transient `Requires Player Rank N.` toast. It cannot change the persisted route, selected stage, clocks, pending idle segments, receipts, or gameplay state.
- When several Campaign conditions fail, the exact refusal/preview priority is sequence lock, then stage-Rank or replay-Rank lock, then Power, then Gold, then history ceiling.
- Recheck the same gate selector inside any mutation that can cross an authorization boundary. DOM enablement alone is never authority.
- Campaign first-clear Rank EXP, Rank derivation, existing rewards, Relic adjudication, all receipts, and one save commit remain atomic and otherwise byte/semantic equivalent to Phase 8.
- Rank-up presentation must use captured committed before/after values; delayed normal-motion presentation cannot read mutable later state.

## Schema-10 migration and persistence

- Add exact write-once pre-v10 key `oathforge_new_world_proto_v01__raw_backup_v9` and protect exactly twelve raw slots: active, staging, root v0.1 backup, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, pre-v7, pre-v8, pre-v9, and pre-v10.
- Append exactly one `schema-9-to-10` receipt with exact fields `id`, `from`, `to`, `appliedAt`, `migrationSource`, `checkpointLineage`, `configIdentity`, `schema9PredecessorIdentity`, `schema9PlayerBaselineIdentity`, and `initializationIdentity`.
- `checkpointLineage` has exact insertion order and exact keys `{version,backupRawIdentity,preV2RawIdentity,preV3RawIdentity,preV4RawIdentity,preV5RawIdentity,preV6RawIdentity,preV7RawIdentity,preV8RawIdentity,preV9RawIdentity,preV10RawIdentity}`. `version === 1`; each identity is `rawIdentity` of the exact slot bytes, including canonical null and whitespace-sensitive occupied bytes. No active or staging identity is inserted in this lineage object.
- The exact pre-v10 bytes are the only schema-9 predecessor authority. Parse those bytes as `predecessor`, require exact valid schema 9 plus its accepted Phase 8 authority, and compute the receipt identities using these exact ordered JSON-array preimages:

```text
schema9PredecessorIdentity = rawIdentity(preV10Raw)

schema9PlayerBaselineIdentity = rawIdentity(JSON.stringify([
  "phase-9-player-baseline-v1",
  predecessor.player,
  predecessor.ui.adventure,
  predecessor.fellowCampaign.selectedStageId,
  predecessor.companionCampaign.selectedStageId,
  PHASE_NINE_GATE_IDS
]))

initializationIdentity = rawIdentity(JSON.stringify([
  "phase-9-player-initialization-v1",
  rawIdentity(preV10Raw),
  candidate.player,
  candidate.playerUnlocks,
  candidate.ui.adventure,
  candidate.fellowCampaign.selectedStageId,
  candidate.companionCampaign.selectedStageId
]))
```

- Preserve the array/object insertion order above. The schema-9 projection proves every other candidate field is reward-neutral and preserved, so `initializationIdentity` cannot be used as a substitute for full predecessor projection/validation.
- Direct active schema-9 migration uses receipt `migrationSource:'schema-9'`, envelope `source:'schema-9-migration'`, and `transactionClass:'migration'`. Authenticated missing-active reconstruction uses receipt `migrationSource:'recovered-schema-9-backup'`, envelope `source:'schema-9-backup-recovery'`, and `transactionClass:'recovery'`.
- Migration time is exactly `Math.max(predecessor.saveMeta.updatedAt, capturedNow)`. It is used for receipt `appliedAt` and the accepted migration metadata update. Rollback clocks cannot reduce it.
- Schema-10 validation projects to schema 9 by deleting only `playerUnlocks`, setting schema version 9, removing the 9→10 receipt/retained marker as applicable, and using the frozen released Rank logic. The full schema-9 product must validate before Phase 9 rules are applied.
- Migration preserves exact `player`, resources, routes, Campaign state/receipts, idle state, equipment, assignments, and UI state; adds the exact full grandfather list; and grants no Rank EXP, Gold, Prosperity, Gifts, shards, Stones, Power, levels, rarity, Might, Mastery, or idle entitlement.
- Reject a reserved `playerUnlocks` collision in any schema 0…9 active or effective staged source before any write.
- Read/classify all twelve slots before mutation and re-read/compare all twelve before checkpoint or staging. Foreign/malformed/whitespace-different occupied pre-v10, unsupported ancestry, higher conflicting material, or unrelated staging blocks with zero writes.
- Complete or clean every authenticated released schema 0…9 pending/committed fresh, migration, ordinary, recovery, and safe-reset transaction before constructing schema 10. Never synthesize an in-memory schema 0…8→10 predecessor or bypass an exact pending schema-9 target.
- Migration writes/verifies exact pre-v10 bytes, stages/verifies one reward-neutral schema-10 candidate, rechecks active identity, commits/verifies, validates, and removes staging only after ownership proof. Retry cannot duplicate a checkpoint, grandfather grant, receipt, revision, or gameplay effect.
- An already durable authenticated schema-10 stage fixes exact target bytes, including time, receipt, identity, and grandfather list. A pre-stage retry may capture only a new monotonic migration time while reusing exact pre-v10 bytes and deterministic initialization.
- Bootstrap precedence is authenticated historical completion; authenticated schema-10 staging/current recovery; valid current schema 10; exact schema 0…9 migration; narrowly authenticated missing-active recovery; canonical fresh only when every permanent checkpoint is empty.
- Missing-active recovery may adopt an authenticated schema-10 stage. A lone pre-v10 may be reconstructed only when it is the exact deterministic immediate schema-9 successor of authenticated lower protected origin; unrelated/evolved material remains blocked and preserved.
- A schema-10 stage is authenticated only when the accepted staging envelope binding is exact: `stagingVersion:1`; non-empty transaction ID; exact `baseSaveId`/`baseRevision`; exact `sourceRawIdentity`; exact source and transaction class; exact target raw identity; and exact envelope identity. The staged schema-10 state, its current authority, and every twelve-slot lineage check must also pass. Validation of the staged state alone is never sufficient.
- Pending ordinary current mutation requires `transactionClass:'current-mutation'`, an accepted current source equal to target `saveMeta.source`, the exact active save/revision as base, same save ID, exactly `revision + 1`, exact source/target raw identities, and preservation of the authenticated current `playerUnlocks` authority/list. Committed ordinary staging requires exact target bytes equal active, base revision exactly active revision minus one, same source equality, and cleanup ownership proof.
- Pending migration/recovery staging requires the exact source/class literals above, exact pre-v10/receipt/config/baseline/initialization/full-lineage authentication, and exact base identity/revision. Direct migration is based on the active schema-9 bytes; missing-active recovery uses null active base only when the pre-v10 predecessor is exactly reconstructable from lower protected authority. Committed migration/recovery staging additionally requires target bytes equal active and the same receipt/predecessor/lineage proof before cleanup.
- Fresh staging requires exact `source:'fresh'`, `transactionClass:'fresh'`, null base save/revision, `sourceRawIdentity===rawIdentity(null)`, every permanent slot null, exact canonical fresh schema 10, empty grandfather IDs, and no migration receipt/marker. It never outranks an authenticated predecessor, checkpoint, historical transaction, or any occupied permanent byte.
- Safe-reset staging requires exact `source:'safe-reset'`, `transactionClass:'safe-reset'`, exact pre-reset base save/revision/source identity, exact marker-v5 preimage and twelve-slot identities, revision 1 canonical reset state, empty grandfather IDs, and no migration receipt. Pending and committed reset stages use the same proof; validation alone never authorizes adoption or cleanup.
- Missing-active precedence is exact schema-10 staged target with the class-specific proof above, then authenticated historical completion, then an exact reconstructable schema-9 pre-v10 predecessor. A released canonical schema-9 fresh/boot predecessor is recoverable only when lower protected bytes or an exact staged target prove its origin. A lone evolved/no-stage pre-v10 value without deterministic lower authority is retained and blocks; it never falls through to fresh.
- Safe reset uses retained-checkpoint marker version 5 with exact insertion-order keys `{version,kind,saveId,resetAt,preResetActiveRawIdentity,preResetSaveId,preResetRevision,backupRawIdentity,preV2RawIdentity,preV3RawIdentity,preV4RawIdentity,preV5RawIdentity,preV6RawIdentity,preV7RawIdentity,preV8RawIdentity,preV9RawIdentity,preV10RawIdentity}`. It retains and binds every exact archival byte, including malformed, whitespace-different, or semantically unrelated material.
- Before `ensureRawBackup` or any safe-reset write, complete the exact twelve-slot preimage read, report every read error, verify active remains identical, and recheck ownership. Failure is zero-write and preserves every byte.
- Export version 10 and protected read errors cover all twelve exact slots. Fixture/import QA injects every one of the twelve preimage-read failures, every set/remove boundary, all twelve post-write boot/read failures, and rollback set/remove/runtime failures. Successful rollback restores exact slots, active raw/revision, in-memory state, runtime clocks/random/timers, modal/toast/focus, and rendered UI; rollback failure is reported explicitly and never claimed as full restoration.
- A storage event can mark stale only when `storageArea` is the captured exact native storage object and `key` is one of the twelve exact protected keys. Null or foreign `storageArea`, unrelated keys, and synthetic lookalikes are ignored.
- Production validation/config cannot depend on QA flags, DOM state, locale, or current time. Isolated QA remains local/query-gated and rejects exact native storage under the accepted attestation rules.

## Diagnostics

Expose read-only:

- schema/config identity, Player/avatar, exact Rank EXP/current Rank/cap, current/next thresholds, EXP remaining, and source vector;
- canonical unlock definitions/order, current rank-derived access, grandfather-derived access, effective access, and lock reason for every gate;
- current selected Adventure route/stage and whether it is authorized;
- exact pre-v10 presence/identity/kind/read error, 12-slot names/status, migration receipt/baseline/init identities, and safe-reset authority;
- no production Rank EXP grant, unlock mutation, grandfather mutation, milestone claim, or route bypass.

## Do-not-break rules

- Oaths and Village/Building Gold are always usable regardless of Rank. A player can always earn/collect Gold, complete/edit/Undo Oaths, inspect/upgrade Buildings, and change Family assignment.
- Rank gates never hide or disable Fellow/Family/Companion/Relic inventory, profiles, assignment, gifting, ascension, equipment, or upgrades.
- A migrated save keeps all prior stage/route access, selected route, progress, equipment, pending claims, and idle history. Rank-1 replay remains locked exactly as before.
- No mode grants Rank EXP except Fellow Campaign first clear; no migration grants retroactive Rank EXP or material rewards.
- Do not change Phase 8 Campaign/Relic reward streams, receipts, Gold charge, RNG, Fellow progression, Stone algebra, Power order, Companion transfer, Family/Might multipliers, or final rounding.
- Do not change Companion Campaign/Tower/Mastery, Fellow Expedition/Might, Village/offline/rollover, Oath, Gift, Family, roster shard, assignment, or recovery semantics.
- Do not change visible Everstead branding or compatibility namespaces and do not revive deferred legacy modes.

## Acceptance gates

Phase 9 is accepted only when all of the following pass from one clean exact production commit:

1. Exact Rank cap/thresholds, ten-stage EXP vector, Rank-2 replay rule, sole EXP source, and deadlock-free fresh progression match this contract.
2. Pure Rank-selector tests pass at `0`, every threshold minus one/exact/plus one, `350+`, and `Number.MAX_SAFE_INTEGER`; pure checked-add tests prove overflow rejection; canonical gameplay proves the sole finite first-clear source can award exactly 475 lifetime Rank EXP and no more. Do not forge an invalid save or add a QA Rank source merely to manufacture a gameplay overflow case.
3. Fresh sequential first clears prove Rank 2 after stage 2, Rank 3 after stage 4, Rank 4 after stage 6, Rank 5 after stage 9, and stage 10 access only at Rank 5.
4. Every fresh locked stage/route refuses through UI and direct helpers before confirmation/settlement/RNG/timers/persistence. Grandfathering never permits stage skipping or Rank-1 replay.
5. Companion Campaign opens at Rank 2, Companion Tower at Rank 3, and Fellow Expedition at Rank 4. All four Adventure tabs remain visible and explain locks.
6. Oaths, Village, collection, Buildings/upgrades, Family assignment/Gifts, Fellowship tabs/profiles/actions, Relics, More, export, reset, diagnostics, and recovery remain available at Rank 1.
7. The Player profile/roadmap reports exact Rank, lifetime EXP, progress/remaining/cap, five milestones, and `Available`/`Unlocks at Rank N`/`Legacy access` states from the canonical selector at both phone widths.
8. Schema-9 saves at Rank 1 with every canonically possible migrated Campaign prefix 0–9 and each selected Adventure route migrate without changing Rank EXP/resources/progress and retain exact prior access. A prefix-9 migration can first-clear grandfathered stage 10 and then reaches its exact ledger-derived Rank; a separate canonical completed prefix-10 state migrates at its valid Rank/EXP; forged prefix-10/Rank-1 input fails before migration. Rank-2 replay access remains exactly derived, not grandfathered.
9. Fresh and safe-reset schema 10 have empty grandfather lists. Migrated saves have the exact full ordered eleven-ID list. Missing/extra/duplicate/reordered/foreign/config-mismatched lists fail validation.
10. Schema 0…9 migration, current/fresh/reset, later-clock/rollback, exact checkpoint reuse, reserved collisions, every released pending/committed transaction, missing-active precedence, and malformed/foreign/whitespace checkpoint cases pass across the exact twelve-slot topology.
11. All twelve initial reads/re-reads, checkpoint/staging/active/cleanup boundaries, export, fixture post-boot reads and rollback, reset, recovery, and storage events have permanent fault coverage with exact protocol-state assertions.
12. Campaign v2 cost/reward/RNG/receipt, Phase 8 Relic outcome/side receipt/Stone algebra, Rank EXP replay, Companion modes, Expedition/Might, Village/Oaths, save/reload, offline claim, cross-tab staleness, and embedded assets remain exact semantic successors.
13. A threshold-crossing result shows at most one transient captured Rank-up summary; reload, replay, navigation, and unrelated mutations cannot replay it or award anything.
14. CLI verifier and Phase 8 semantic-successor verifier pass twice; checksums and every frozen historical artifact pass twice; only explicit schema-10/topology/unlock/UI supersessions are enumerated.
15. Live in-app Chromium passes twice at 320×568 and 390×844, covering fresh locked/unlocked states, grandfathered migration, normal/reduced motion, Player profile access, keyboard/focus/overflow, blank fatal output, and zero warning/error console entries.
16. Independent exact-behavior and save/recovery reviewers issue final PASS on the same clean production commit before QA/docs packaging changes production bytes.
17. Final manifest, artifact SHA-256/byte length, embedded-asset aggregate, result document, and public Pages byte identity are sealed only after every prior gate passes.

## Required Phase 9 QA package

- Add an independent `qa/phase-9/` CLI and live-browser package. Do not weaken or rewrite historical accepted tests merely to make Phase 9 pass.
- Freeze exact historical artifacts/checksums, especially embedded art and every Phase 0–8 source/doc/fixture that should remain byte-identical.
- Add a Phase 8 semantic-successor verifier that permits only schema 10/pre-v10/twelve-slot persistence, `playerUnlocks`, canonical gate checks, locked UI, Player profile/roadmap, diagnostics, and associated QA bridge additions.
- Preserve every other Phase 8 behavior, including Campaign v2 and Relic side receipts, Stone/equipment algebra, all idle lanes, Power composition, no-op discipline, and QA bridge safety.
- Result/evidence documents must report exact commits/artifact identities, CLI/live counts, mobile sizes, console outcome, migration/recovery coverage, reviewer verdicts, public deployment evidence, and residual risks.

## Deferred after Phase 9

- Phase 10 economy/Power integration, tuning, offline/claim consolidation, and broader bad-luck protection.
- Phase 11 V1 polish, quality-of-life automation, content expansion, and final functional-V1 completion.
- Post-V1 portrait sway/body physics, Live2D, advanced animation, weekly boss, draft mode, clash, deeper patrol/gatherings, advanced Relic sets/affixes/reforging, special CGs, museum, events, advanced story, audio, and voice.

# EVERSTEAD — PHASE 5 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 4 package commit `48fcc560336b3e716c728c818fe22274f2f2b410` (accepted Phase 4 production artifact `cea60986dee6185c7319224752b877e4c7917546`).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2` is authoritative. Fellow Campaign consumes Gold, awards Fellow EXP and targeted Fellow shards, uses Total Fellow Roster Power, advances Player Rank, and owns the main walking-stage presentation.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0` defines Phase 5 as Player Character + Player Rank foundation + Fellow Campaign and replaces Story Negotiations as the active progression road.
- Preserve the working single-file shell, embedded assets, transactional persistence, Village/Oath/Fellow/Family/Companion systems, and every accepted Phase 0–4 invariant.

## Objective

Create Everstead's main progression road. Add a central player avatar and Rank, replace active Story Negotiations with a ten-stage Broken Roads Fellow Campaign, spend Gold atomically on qualified runs, award Fellow EXP/targeted shards/Gifts, support first clears and Rank-gated replay, and present progress through a lightweight walking/slideshow scene.

## Scope boundary

### Keep as-is

- Compatibility namespace `oathforge_new_world_proto_v01`, mobile shell, five top-level views, cards, modals, toasts, responsive behavior, reduced-motion rule, and embedded art bytes.
- Four-Building Gold production, 24-hour offline cap, upgrades, Prosperity, Oath final multipliers, Family assignments/drops/Gifts, and Companion progression/assignment.
- Phase 2 Fellow EXP/Level/rarity/Bond/Power pipeline and the authoritative `totalFellowRosterPower` and campaign-efficiency selectors.
- Existing Fellow, Family, Companion, Building, Oath, and Story IDs/content where compatible.

### Reuse with migration

- Reuse the Adventure hero, node strip, background atlas, power comparison, result feedback, and ten Story names/recommended-Power/enemy-Type values as Broken Roads seed content.
- Reuse the accepted efficiency formula with each stage's base cost and recommended Power.
- Reuse stable save-seeded random rolls for deterministic replay shard/Gift results.
- Reuse the central clone → accrue prior Village entitlement → mutate → validate → commit → adopt transaction coordinator for every Campaign mutation.

### Replace

- Replace active Story state/UI/rewards with canonical Player and Fellow Campaign state.
- Replace selected-squad, counter, Role-balance, and Oath Resolve progression checks with Total Fellow Roster Power only. Enemy Type remains presentation metadata.
- Replace Story Gold/Prosperity/Bond faucets with Campaign Gold spend and the Phase 5 reward model.
- Replace the Story tab/action with Fellow Campaign. Preserve grandfathered Story transaction-source recovery compatibility, but make all legacy Story leaf actions fail closed.

### Remove or defer

- Remove `storyStage`, `currentWall`, and `resolve` from canonical schema 6. Their exact predecessor bytes remain in the pre-v6 checkpoint.
- Quarantine legacy Story, Tower, and Trading production navigation/reward actions. Tower becomes Companion Tower in Phase 6; Trading is not a locked V1 mode.
- Keep Patrol and Operations quarantined/deferred and do not expand them.
- Do not implement Campaign automation, selected squads, combat animation, advanced walking animation, Relics/Relic Stones, Golemore, Companion content, audio, or Post-V1 features. Stage definitions may expose inert future Relic/Stone hooks only.

## Provisional Phase 10 tunable configuration

All values below live in frozen configuration objects and are explicitly tunable in Phase 10. Their ownership and formula order are contractual for Phase 5.

### Player Rank

- One avatar definition: `wayfarer`, rendered through a CSS/static art hook. State and selectors support additional avatar definitions later without changing schema shape.
- Rank cap: `5`.
- Cumulative Rank EXP thresholds for Ranks 1–5: `[0, 50, 125, 225, 350]`.
- Rank is derived from cumulative Rank EXP and stored only with exact derived consistency.
- Rank 2 unlocks Campaign replay. First-clear progression itself is not Rank-gated.

### Broken Roads stages

- Ten linear stages reuse the current Story order, name, recommended Power, and enemy Type.
- Base Gold cost for stage ordinal `N`: `10000 + 2000 × (N - 1)`.
- First-clear Fellow EXP: `120 + 30 × (N - 1)`.
- Replay Fellow EXP: exactly `floor(firstClearExp / 2)`.
- The target Fellow cycles through `FELLOW_DEFS` order by stage ordinal. EXP and shards go only to that configured target Fellow.
- First clear grants exactly `2` targeted shards.
- Replay grants exactly `1` targeted shard when the deterministic roll is `< 0.25`, otherwise zero.
- Every successful first-clear or replay run grants exactly `1` Gift when the deterministic roll is `< 0.10`, otherwise zero.
- First-clear Rank EXP: `25 + 5 × (N - 1)`. Replay grants zero Rank EXP.
- Future Relic and Relic Stone hooks remain explicit neutral metadata and cannot create inventory or rewards in Phase 5.

### Eligibility and efficiency

- A first-clear stage is accessible only when every prior configured stage is cleared. A replay is accessible only for a cleared stage and Player Rank at least 2.
- Total Fellow Roster Power must be at least the stage's recommended Power. Underpowered attempts are refused before confirmation and spend nothing.
- The player must have at least the effective Gold cost. Insufficient-Gold attempts are refused and spend nothing.
- Existing efficiency formula remains exact: `surplusRatio = max(0, totalPower / recommendedPower - 1)`; `discountRate = min(0.35, surplusRatio × 0.25)`; `effectiveCost = max(1, ceil(baseCost × (1 - discountRate)))`.
- A confirmed eligible run succeeds deterministically. Gold spend and all rewards commit once in one transaction. A refused/cancelled run performs zero writes and no runtime/UI/revision mutation.

## Canonical schema 6 state

Add exact production-owned state:

```text
player: {
  avatarId: "wayfarer",
  rankExp: non-negative safe integer,
  rank: exact derived integer 1…5
}

fellowCampaign: {
  selectedStageId: configured stage ID,
  clearedStageIds: unique configured IDs forming an exact linear prefix,
  firstClearClaimedStageIds: unique configured IDs containing every cleared ID,
  runOrdinal: non-negative safe integer,
  lastReceipt: null | exact Campaign receipt
}
```

- `selectedStageId` must be cleared/replayable or the first uncleared stage; it cannot skip locked progression.
- Normal schema-6 play makes cleared and first-clear-claimed prefixes advance together. Migration may conservatively mark a legacy ambiguous final stage first-clear-claimed without marking it cleared.
- `runOrdinal` increments once per successful run only.
- `lastReceipt.sequence` equals the post-run ordinal and records stage ID, completion time, first-clear/replay, Gold/base/recommended/total-Power snapshot, effective cost, exact-key reward maps for every Fellow plus Rank EXP and Gifts, and an exact reward identity version/salt derived from save ID + stage ID + pre-run ordinal.
- Do not persist derived efficiency, unlock selectors, stage definitions, player Rank thresholds, walking progress, calculated Fellow Power, or RNG state.

## Deterministic Campaign rewards

- Campaign reward rolls use a versioned stable identity derived from `saveId`, stage ID, and pre-run `runOrdinal`, plus a distinct reward-channel salt. The receipt persists the identity version and exact non-secret identity string, and validation reconstructs both exactly.
- Recomputing a candidate after any interrupted persistence attempt produces the same shard/Gift outcome.
- All Gold, EXP, shard, Gift, Rank EXP, Rank, clear-ledger, ordinal, and receipt changes use checked safe-integer operations and validate before the first write.
- Reward maps require the exact configured Fellow key set. Foreign keys cannot grant rewards or survive canonical validation.
- Fellow Level is re-derived from cumulative EXP. Campaign never changes Bond, rarity directly, Companion state, Family state other than Gift inventory, Prosperity, pending Gold, or Building production.

## Schema 5 → 6 migration

- Set `CURRENT_SCHEMA_VERSION = 6`.
- Add write-once `PRE_V6_BACKUP_KEY = oathforge_new_world_proto_v01__raw_backup_v5`, containing the exact schema-5 active raw payload after complete eight-slot zero-write preflight and before staging/active writes.
- Protected slots become: active, raw v0.1, pre-v2, pre-v3, pre-v4, pre-v5, pre-v6, and staging.
- Preserve exact ordered migration from legacy schema 0 and schemas 1–5, all earlier checkpoints/receipts, and append exactly one `schema-5-to-6` receipt.
- Fresh schema 6 starts Wayfarer, Rank EXP 0/Rank 1, stage 1 selected, no clears, ordinal 0, and no receipt.
- For schema-5 migration, let `mappedOrdinal = clamp(floor(storyStage), 1, 10)`. Mark and first-clear-consume only stages strictly before `mappedOrdinal`, then select `mappedOrdinal`. Never infer legacy stage 10 complete or consumed, including when legacy `storyStage >= 10`.
- Every migrated player starts Rank EXP `0` / Rank `1`. Story position migration grants no retroactive Rank EXP, Fellow EXP, shards, Gifts, Gold, or other rewards. First-clear progression is never Rank-gated, so a migrated high-position player can clear the selected stage normally; replay remains locked until Rank 2.
- Add Wayfarer, ordinal 0, and null receipt. Remove active `storyStage`, `currentWall`, and `resolve`.
- Transform a valid pending Oath Undo by removing only its legacy Resolve inverse/expected fields while retaining all Oath, Building, Prosperity, Bond, and Gift semantics; a valid pending Undo must remain usable.
- Map `ui.adventure: "story"` to `"campaign"`; reject impossible/foreign routes. Preserve all unrelated state exactly.
- The migration receipt records the deterministic mapped cleared/claimed stage IDs and must reconstruct exactly from the pre-v6 schema-5 checkpoint.

## Persistence and recovery

- Extend classification, migration, staging, committed-current cleanup, missing-active recovery, export, diagnostics, safe reset, fixture installation, and storage-event handling to all eight protected slots.
- A current schema-6 state carrying the schema-5-to-6 receipt requires its exact pre-v6 checkpoint. Receipt mapping and canonical Player/Campaign initialization must reconstruct exactly from that checkpoint.
- An authenticated pending schema-6 migration stage may reconstruct the write-once pre-v6 checkpoint only from the still-active exact schema-5 predecessor. Missing/foreign/unrelated material fails closed.
- Extend staged schema-6 lineage across schema0–5 with exact source, save ID/revision, receipt chain, checkpoint bytes, transaction class/binding, target identity, and canonical migration result.
- Preserve prior-build unbound committed ordinary mutation compatibility narrowly and keep every reserved migration/recovery/fresh source disjoint from it.
- All preflight read faults, occupied foreign staging, injected writes/readbacks/conflicts/cleanup faults, malformed state/receipt/checkpoint, and retry paths preserve exact bytes and cannot duplicate costs or rewards.
- Safe export and diagnostics report the pre-v6 slot and all eight read errors. QA fixture installation refuses before any write if any preimage read fails.

## Feature-flag and action boundary

- Add `fellowCampaign` as an explicit production feature flag, enabled only in the Phase 5 accepted build.
- Default legacy `story`, `tower`, `trading`, `patrol`, and `operations` flags false. Remove the legacy Adventure tabs and disable/remove Patrol and Operations controls/copy from the production path. Keep their code/source names only where required for historical recovery and isolated QA/regression until safe deletion after successor acceptance.
- A disabled/missing/malformed Campaign flag fails before rendering a runnable control or entering a handler.
- Add authoritative `runFellowCampaign(stageId)` and `selectFellowCampaignStage(stageId)` helpers with allowlisted current transaction sources.
- Campaign run and all Campaign QA actions are declaratively destructive. Isolated QA requires the existing explicit non-native storage attestations; exact native storage, missing flags, false flags, encoded-query tricks, or all-disabled realms perform zero writes/UI mutations.

## UI and presentation

- Adventure becomes Fellow Campaign with a Player profile/Rank header, walking hero, region/stage name, stage-varying background position, Wayfarer CSS/static figure, progress track, encounter marker, and ten node controls.
- Normal motion uses a small bob/translation and scrolling/slideshow background. Reduced-motion mode remains fully functional with static art and immediate result presentation.
- A successful commit drives a presentation-only walk to an encounter interruption, then displays the persisted receipt. Reload can render the last receipt without replaying rewards.
- Stage preview shows first-clear/replay status, target Fellow, total roster Power, recommended Power, base cost, efficiency discount, actual cost, EXP, targeted shard outcome rules, Gift chance, Rank EXP, and Rank/replay gate.
- Confirmation names the actual Gold cost. Cancellation, insufficient Power/Gold, locked stage, or locked replay leaves state and storage untouched.
- Fellow cards/profiles and top-bar Gift/Gold/Rank values update immediately after a run.
- No active UI copy may mention Story Negotiations, Resolve, Story Gold/Prosperity/Bond rewards, selected-squad Campaign Power, Tower, or Trading as playable Phase 5 content.

## Diagnostics and isolated QA

- Add Player configuration/state/derived unlocks, complete stage configuration, selected/cleared/claimed progress, total-roster eligibility, efficiency preview, deterministic reward preview, last receipt, and pre-v6 checkpoint evidence to diagnostics.
- Add named isolated actions for fixture installation, stage selection, exact Campaign run, Gold setup, Fellow-Power/EXP setup where needed, and Rank boundary setup. Route gameplay through authoritative production helpers.
- Rejected actions leave all eight raw slots, revision, writes, toast, modal, and rendered state unchanged.

## Acceptance gate

### CLI/static/evaluated behavior

- Exact stage definitions/default formulas, Rank thresholds/cap, target cycle, total-roster-only gate, efficiency boundaries/cap/rounding, and safe-integer/overflow rejection.
- Fresh Player/Campaign state; first-clear and replay eligibility; Rank-2 replay gate; atomic Gold spend; target-only EXP/shards; deterministic replay chance; Gift chance; receipt/ordinal; immediate Level/Power update.
- Underpowered, insufficient-Gold, locked, cancelled, invalid, overflow, disabled-feature, and persistence-failure attempts perform zero mutation/write.
- Selected squad, Types, counters, Roles, Resolve, and Oaths cannot change Campaign eligibility/cost/rewards.
- Schema0–5 migration, conservative Story boundaries (negative/fractional/1/2/9/10/>10/large finite), no inferred stage-10 clear/claim, zero retroactive rewards/Rank EXP, valid Oath Undo continuity, and `story` route mapping.
- Exact pre-v6 write-once checkpoint; all eight-slot preflight/fault/retry/recovery paths; exact schema-6 staging lineage; forged receipt/mapping/checkpoint negatives; no duplicate cost/reward/revision/receipt.
- Phase 4 semantic successor passes with every intentional schema/checkpoint/Story/feature/UI supersession itemized and backed by a Phase 5 replacement.

### Live browser

Run twice at `320×568` and `390×844` using fresh schema 6, schema-5 migration, representative legacy migration, stage-10 ambiguity, first clear, Rank-2 unlock, deterministic replay hit/miss, disabled/all-disabled/encoded-query/native-storage refusal, persistence/reload, and reduced-motion realms. Require zero failed rows, blank fatal output, zero warning/error console entries, and zero native-storage calls.

### Frozen evidence

- Preserve Phase 0–4 fixtures/manifests/docs and embedded asset bytes except explicitly itemized successor current-artifact identities.
- Run Phase 5 CLI twice, Phase 4 semantic successor twice, Phase 5 checksums twice, and the live browser gate twice on one clean exact tip before review.

## Do not break

- Seven-slot Phase 4 lineage expands additively to eight slots; all historical checkpoints, migration receipts (including Companion collision ledger), recovery precedence, staging ownership, cross-tab refusal, and Oath Undo safety remain intact.
- Oath `3% / 5% / 8%` final multipliers, +30% cap, 24-hour Gold cap, Building cap/upgrades, offline accrual, Family carry provenance/drops/Gifts/assignments, and Companion assignments/transfers.
- Fellow cumulative EXP/derived Level, rarity/shards, Bond, Family/Companion components, round-once Power, and exact total-roster selector.
- Compatibility namespace, single-file/mobile/static-portrait architecture, reduced-motion support, and embedded assets.

## Exit gate

Phase 5 may merge only after a clean exact implementation/package tip passes the full gate twice, an independent design/math/UI review, an independent persistence/migration/failure review, exact fast-forward integration, remote verification, and byte-identical deployed-artifact verification. Do not merge or push from the implementation worktree.

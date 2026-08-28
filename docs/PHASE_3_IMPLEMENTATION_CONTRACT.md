# Everstead Phase 3 — Implementation Contract

Status: producer-approved implementation contract for the isolated `migration/phase-3-family-economy` branch.

Base: exact published Phase 2 tip `9b4fbc11ad465f83802b7d787756d2d390de0e55`.

Authority:

- Locked Core Design v1.2: `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`.
- Implementation Roadmap v1.0: `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`.

Do not merge or push from the implementation worktree. Produce focused production and QA/docs commits and leave the branch clean for independent review.

## Outcome

Make Family the relationship and Village-economy roster: one Intimacy track, one universal Gift item, character-specific shards and rarity, one freely changeable Family assignment per Building, assigned production bonuses, configured Family-to-Fellow bonuses, and replay-safe Building claim drops.

Preserve the mobile shell, art, IDs, quotes, links, Gold economy, Oath final multiplier, offline cap, and the Phase 2 Fellow Power pipeline. Do not implement later modes.

## 1. Schema 4 and six-slot persistence

- Set `CURRENT_SCHEMA_VERSION=4`.
- Add the exact write-once schema-3 checkpoint `PRE_V4_BACKUP_KEY=NS+'__raw_backup_v3'`, whose full storage key is `oathforge_new_world_proto_v01__raw_backup_v3`.
- The protected slots are active, v0, v1, v2, v3, and staging.
- Before any write, including initial raw-backup creation, authenticate every occupied checkpoint and recognized Phase 1 schema-2, Phase 2 schema-3, or Phase 3 schema-4 staging payload through exact deterministic lineage.
- Malformed, foreign-source, or valid-but-unrelated v3/checkpoint/staging material must cause zero writes and preserve all six bytes, runtime state, and UI exactly.
- Support deterministic schema 0/1/2/3 to 4 migration, ordered singular receipts, stable `saveId`, monotonic timestamps, exact hop revisions, and later-clock retry using the original staged/checkpoint bytes.
- Missing-active recovery precedence is valid schema-4 staging, v3, v2, v1, v0, then fresh. Corrupt or future active data never trusts unattested material.
- Add a dedicated schema-3 staging validator/reconstructor because generic current-state validation now accepts schema 4 only.

Canonical Family state:

```text
family[id] = {
  ...preservedUnknownFields,
  intimacy,
  rarity,
  shards,
  assignedBuildingId,
  claimedIntimacyMilestoneIds
}
```

Migration rules:

- `intimacy = max(0, legacy progress)`, preserving a valid fractional legacy value exactly.
- Never add or derive value from the removed Gold-funded `level` or Blessing.
- Set rarity to 1, shards to 0, and migrated assignment to null.
- Mark already-crossed configured milestones claimed without retroactive shards.
- Preserve unrelated unknown and Unicode fields plus `FAMILY_DEFS` links exactly.
- Remove only documented reserved legacy or conflicting shadows.
- Add a top-level nonnegative safe-integer Gift inventory with exactly one starter Gift for fresh and migrated saves. Migration and retry must never duplicate it.

Fresh assignments are explicit configuration only:

- Elara → Hearth.
- Tamsin → Training Grounds.
- Isolde → Archives.
- Command Center → unassigned.

Persist assignment ownership only as nullable `family[id].assignedBuildingId`. Every non-null Building ID is unique. Never infer Family assignment from old Fellow operators.

Migrate a pending schema-3 Oath Undo from Family `progress` to `intimacy`. Schema-4 scoped Undo also captures, compares, and reverses Gift inventory and the daily Oath-Gift tracker. Spending/changing the Gift or diverging the tracker causes zero-write refusal.

Upgrade safe export and diagnostics to export version 4 with the v3 checkpoint key/raw/read error. The QA fixture accepts optional `preV4BackupRaw`, stays compatible when omitted, and restores all six slots plus state, revision, persistence status, clock/random state, app/modal/toast UI, and logs without invoking boot/save at every forward and rollback set/remove failure. Rollback failures remain explicit.

## 2. Exact `FAMILY_CONFIG` defaults

- Starter Gift inventory: 1.
- One Gift costs one item and gives exactly +10 Intimacy.
- Family rarity: 1–5.
- Character shard costs: `[20, 40, 80, 160]`.
- Specialties match the explicit fresh assignments.

Assigned Building bonus:

```text
min(
  .20,
  .01
  + min(.10, intimacy * .0002)
  + .02 * (rarity - 1)
  + (specialtyMatch ? .01 : 0)
)
```

Unassigned bonus is zero. Expose inspectable components. Replace only the Family economy hook; Fellow, Companion, and overall-day hooks remain neutral and the Oath multiplier remains last.

Per linked-Family Fellow bonus:

```text
min(
  .09,
  min(.05, intimacy * .0001)
  + .01 * (rarity - 1)
)
```

Sum every matching `FAMILY_DEFS` link, cap the aggregate bonus at `.12`, and use `1 + bonus` in the existing Family position of the single effective Fellow Power pipeline. Round only once at the end. Lyra intentionally receives Elara and Isolde links. Bond, Relic, Companion, and global hooks remain neutral.

Intimacy milestones:

- 150 Intimacy → 5 targeted shards.
- 300 → 10.
- 600 → 20.
- 1000 → 40.

Award each exactly once when a Gift crosses it. A Gift changes only Intimacy plus the exact milestone shard awards. Ascension consumes only that Family member's exact shard cost, changes only rarity and shards, and never auto-ascends.

## 3. Replay-safe accrual and claims

- Retain `lastGoldAt` and `pendingGold` as the single Gold accrual cursor and pending-Gold authority.
- Add pending Gifts/shards plus per-Building roll carry, persisted ordinal, and shard-drought state, along with claim sequence and last receipt.
- Eligibility begins at schema-4 creation or migration time, preventing retroactive pre-Phase-3 drops.
- At one captured `now`, settle elapsed Gold and drop entitlements before assignment, Building upgrade, Gift, ascension, or Oath mutation so elapsed rewards use the old assignment and level.
- Preserve the 24-hour cap, local-midnight Gold segmentation, clock-rollback no-op, epoch-zero handling, fractional pending Gold, and no unlimited backlog.
- Preview and rendering consume no pseudo-random values or state.

Each Building earns one roll per four hours of eligible capped elapsed time, in fixed `BUILDING_DEFS` order.

- Shard success chance: `min(.18, .10 + .01 * (buildingLevel - 1))`.
- Quantity: 1.
- Assigned recipient weighting: .75 to the assigned Family member; the remaining .25 is uniform among the other Family members.
- Unassigned Building: uniform among all Family.
- Per-Building bad-luck protection: seven misses, with the eighth eligible roll forced; success resets the drought.
- Hearth alone has a 2% Gift chance per eligible four-hour roll.
- The Campaign Gift hook exists but is neutral until Phase 5.

Use a centralized stable pseudo-random unit keyed by stable `saveId`, Building ID, persisted roll ordinal, and channel salt. Advance ordinals only in the committed draft. The same persisted preimage must always yield the same retry outcome. Diagnostics expose components, ordinals, drought, and pending values without consuming rolls.

Collection atomically transfers floored pending Gold, all pending Gifts, and all pending Family shards. Retain fractional Gold, clear transferred resources, and create exactly one receipt/sequence only when at least one resource was collected. An immediate second claim produces nothing and no receipt. Offline and toast copy reports actual results without previewing future rolls.

## 4. Oath Gifts, Undo, and legacy rewards

- Remove marriage/fatherhood direct Family Intimacy gains.
- At most one Oath Gift may be awarded per local day.
- Use a stable 5% deterministic chance on the first completion of each unique Oath that day; if none succeeded, the fifth unique completion guarantees the Gift.
- Persist a strict tracker containing day, unique Oath IDs, and awarded state.
- Scoped Undo reverses the tracker and Gift change. Diverged inventory or tracker refuses unchanged.
- Convert existing Family Patrol `affection` effects to exactly one configured Gift, retaining the existing Gold or Prosperity secondary reward where present and using honest copy. Do not expand Patrol.

No Blessing, relationship level, Gold-funded Deepen action, Family combat Level/EXP/Power/Type/Role, Family Campaign/Tower, Gift shop, or extra Gift types/currencies may remain.

## 5. UI and actions

Reuse current Family cards, profiles, portraits, quotes, links, and the Building modal/select pattern.

- Family cards/profile show Intimacy, rarity, shards, current assignment, available Gifts, Give 1 Gift, ascension, specialty, linked-Fellow bonuses, and next milestone.
- Remove Phase 3 preview, Relationship level, Saved progress, Future links, neutral placeholder, Affection, Blessing, and Deepen copy/actions.
- Building modal shows None/Family assignment, free atomic move/replace/unassign behavior, specialty, exact bonus components, and immediate production preview.
- Fellow profiles and diagnostics show the active Family multiplier while later hooks remain neutral.
- Claims show per-character shards and Gifts.
- Add QA-only isolated authorized grants for Gifts and per-character Family shards plus programmatic assign/gift/ascend/collect actions. Reject unsafe integers and overflow; retain all Gate 0C authorization/native-storage protections.

## 6. Additive Phase 3 gate

Add only `qa/phase-3/**`, `docs/PHASE_3_EXECUTION.md`, and `docs/PHASE_3_RESULT.md`. Freeze every Phase 0/1/2 QA and doc artifact byte-for-byte.

The CLI gate must cover:

- Fresh schema 4 and exact schema 0/1/2/3 migration.
- Six checkpoints, all three historical staging shapes, idempotence, recovery, future/corrupt refusal, conflicts, Unicode/unknown fields, reserved shadows, and pending Undo.
- Safe-integer Gifts/shards and overflow refusal.
- Exact Family formulas, order, caps, Lyra's two links, and round-once behavior.
- Assignment uniqueness, free movement, replacement, unassignment, persistence, and no operator inference.
- Gift-only Intimacy, exact once-only milestones, and shard-only rarity.
- Deterministic roll tables; interval-minus-one, exact interval, multiple intervals, 24 hours, midnight, rollback-forward, epoch zero, invalid timestamps, fractional Gold, split-versus-combined elapsed, double claim, old-assignment/old-level entitlement, assigned/unassigned weighting, pity, reload, Hearth-only Gift, and no render roll.
- Oath chance miss/hit, fifth-unique guarantee, max one/day, Undo/recompletion, and spent-Gift refusal.
- Faults at the v3 checkpoint, staging, active write/verify, and cleanup with no duplicated rewards or receipts.
- Every six-slot fixture forward/rollback failure and explicit rollback-failure reporting.
- Phase 2 semantic successor with only itemized replacements.
- Absence of legacy active strings, actions, fields, and formulas.

The live runner must pass twice at 320×568 and 390×844 with genuine fresh schema 4, schema-3 migration, representative legacy migration, Family navigation/profile, Gift, assignment/reassignment/unassignment, Building rate change, linked Fellow Power change, ascension refusal/success, deterministic claim/report, all-disabled and encoded-query negative realms, zero native-storage calls, and zero console/page errors.

Run Phase 3 CLI twice, the Phase 2 successor twice, all Phase 3 checksums twice, `git diff --check`, and live Chromium twice. Record source revision IDs, base/tip hashes, embedded assets, counts, expected supersessions, and residual risks. Leave the branch clean and return the exact tip. Do not merge or push.

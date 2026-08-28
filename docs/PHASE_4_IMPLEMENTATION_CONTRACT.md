# EVERSTEAD — PHASE 4 IMPLEMENTATION CONTRACT

## Authority and immutable base

- Implement from exact sealed Phase 3 package commit `165d18aaab66370ac959670ef1c7284c6ec95a3c` (production artifact tip `7a97cea1e7422aaf23e796bbd33385d535ce06df`).
- `EVERSTEAD — LOCKED CORE DESIGN v1.2` is authoritative. Its Companion principles are locked: Level/EXP, Power, character-specific shards and rarity, free Fellow assignment, one Companion per Fellow initially, and a boost derived from the Companion's own Power.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0` defines Phase 4 as Companion expansion and assignment. Companion Campaign, Companion Tower, idle EXP/Mastery/random shards, and their actual progression state remain Phase 6.
- Preserve the working single-file shell, portraits, roster navigation, modal system, transactional persistence, and every accepted Phase 0–3 behavior.

## Objective

Turn Bramble and Cinderwing from preserved static bindings into a real support/combat roster. Add independent EXP, Level, Power, rarity, targeted shards, safe ascension, freely changeable one-to-one Fellow assignments, and an immediately visible Companion-Power transfer into the single Fellow Power pipeline.

## Scope boundary

### Keep as-is

- Companion IDs, names, titles, portrait atlas positions, cards, profiles, and roster tab.
- The current Fellow type/role system, Family links, Building assignments, Village claim pipeline, Oaths, Gifts, Gold, and all Phase 0–3 persistence guarantees.
- The compatibility namespace `oathforge_new_world_proto_v01`; do not rename storage keys.
- Companion Campaign and Tower visual/code scaffolding remains quarantined until Phase 6.

### Reuse with migration

- Convert each valid legacy `companions[id].bound` value to `assignedFellowId`.
- Replace the existing binding selector with a free, atomic assignment control that supports `None` and enforces at most one Companion per Fellow.
- Activate the already reserved Companion position in `effectiveFellowPowerComponents`; do not create a second Fellow Power calculation.
- Reuse Phase 2 EXP/Level/rarity helper patterns, safe-integer discipline, cards, profile metrics, ascension controls, and inspectable diagnostics.

### Replace

- Replace `{bound}` with the canonical Companion state defined below.
- Replace the Phase 4 preview and neutral transfer text with real Power components, progression, assignment previews, and ascension state.
- Remove active or derived legacy `kind`, `perk`, `bound`, static Building bonus, static `+6%`, and other Companion-Power shadow calculations.

### Remove or defer

- Bramble must never directly staff or boost a Building. Cinderwing must never apply a static percentage perk.
- Do not add Companion Campaign stages, Companion Tower floors, Mastery, idle Companion EXP, or Companion shard drops in Phase 4.
- Do not add advanced evolution art/perks, animation, Gold rewards, a second currency, or permanent/paid assignment choices.
- Do not activate the neutral Companion roster Building hook. Phase 4 changes Fellow Power only; controlled Village integration remains a later economy phase.

## Tunable Companion configuration

All provisional values live in one frozen `COMPANION_CONFIG`; production selectors consume that object rather than duplicating literals.

- Level cap: `100`.
- EXP to advance from Level `L`: `round(80 × 1.12^(L-1))`.
- EXP is cumulative, a non-negative safe integer, and Level is derived from cumulative EXP.
- Rarity: `1…5`.
- Character-specific shard costs to advance from rarities 1–4: `[20, 40, 80, 160]`.
- Bramble base Power: `1000`.
- Cinderwing base Power: `1200`.
- Level multiplier: `1 + 0.10 × (Level - 1)`.
- Rarity multiplier: `1 + 0.10 × (Rarity - 1)`.
- Companion transfer rate: `0.40` of the assigned Companion's unrounded Power.
- Future global Mastery multiplier hook: exactly neutral (`1.00`) until Phase 6.

Exact balance is tunable, but formulas, ownership, rounding, and migration behavior are contractual.

## Canonical schema 5 state

Each `companions[id]` is exactly production-owned state with:

- `owned: true`
- `exp: 0` or another non-negative safe integer
- `level: companionLevelForExp(exp)`, integer `1…100`
- `rarity: 1…5`
- `shards`: non-negative safe integer
- `assignedFellowId`: a valid Fellow ID or `null`

Across the roster, every non-null `assignedFellowId` is unique. Do not persist calculated Power, multipliers, transferred Power, or inverse `assignedCompanionId` shadows.

Fresh defaults preserve the original authored pairings:

- Bramble → Orin
- Cinderwing → Cael

Both start owned, Level 1, zero EXP, rarity 1, and zero shards.

## Schema 4 → 5 migration

- Set `CURRENT_SCHEMA_VERSION = 5`.
- Add the next write-once schema-4 checkpoint key `oathforge_new_world_proto_v01__raw_backup_v4`; it is an exact copy of the schema-4 active raw payload made only after complete zero-write preflight succeeds and before any active/staging mutation.
- Include the schema-4 checkpoint in read-only export, recovery, diagnostics, manifest tests, and safe-reset retention. The relevant slot set is now active, raw-v0.1, pre-v2, pre-v3, pre-v4, pre-v5, and staging.
- Retain exact ordered migration from legacy schema 0 and schemas 1, 2, 3, and 4. Preserve all earlier migration receipts and append exactly one `schema-4-to-5` receipt.
- For each Companion in `COMPANION_DEFS` order, initialize Level 1 / zero EXP / rarity 1 / zero shards and migrate a valid `bound` to `assignedFellowId`.
- If two valid legacy bindings target the same Fellow, the earlier `COMPANION_DEFS` entry keeps the assignment and every later collision becomes `null`. Record the affected Companion and Fellow IDs on the schema-4-to-5 receipt and show a non-destructive Companion-roster notice. Never silently reassign to a different Fellow.
- Invalid legacy binding references must continue to fail validation before migration; do not repair foreign references into a different character.
- Remove `bound`, `kind`, `perk`, `calculatedPower`, `effectivePower`, `totalPower`, `transferBonus`, `companionBonus`, `buildingId`, and assignment inverse shadows.
- Existing schema-4 Oath Undo remains semantically identical. Companion migration must neither enter the Oath inverse nor make a valid pending Undo invalid.
- Clock rollback cannot reduce `saveMeta.updatedAt`; retrying an interrupted migration must reproduce the same schema-5 state and one receipt without duplicate rewards or progression.

## Staging recovery and failure safety

- Extend recovery with an exact schema-5 staging lineage check while retaining the historical schema-2, schema-3, and schema-4 recovery paths.
- A staged schema-5 migration is eligible only when its source identity, base save ID/revision, complete ordered receipts, exact migrated Companion state, and active schema lineage all match.
- Malformed active data, malformed or foreign staging, unrelated schema-4 checkpoints, checkpoint write failure, staging write/readback failure, active conflict, active write/readback failure, and cleanup races must not overwrite a valid active payload.
- Preflight failures perform zero writes to all seven relevant slots. A checkpoint write that fails may affect only that checkpoint slot; active and staging remain byte-identical.
- Retrying every injected failure yields the exact intended candidate once, with no duplicate revision, receipt, EXP, shards, or assignment changes.
- Preserve the documented Web Storage no-CAS residual risk; do not claim atomic compare-and-swap.

## Companion Power selector

Add one authoritative `effectiveCompanionPowerComponents(id, state)` selector:

1. `basePower`
2. `levelMultiplier`
3. `rarityMultiplier`
4. neutral `masteryMultiplier = 1`
5. round exactly once to `effectivePower`

It must expose every intermediate component plus `unroundedPower`, `effectivePower`, and formula order. Stored state never contains derived Power.

`totalCompanionRosterPower(state)` sums effective Companion Power with safe finite guards. It is diagnostic/future content input only and does not directly modify Buildings in Phase 4.

## Assigned Fellow transfer

`companionFor(fellowId, state)` derives the one assigned Companion from `assignedFellowId`; no Fellow-side assignment field is stored.

In `effectiveFellowPowerComponents`:

- Obtain the assigned Companion's unrounded effective Power.
- `transferredPower = companion.unroundedPower × COMPANION_CONFIG.transferRate`.
- At the reserved Companion position, compute `companionMultiplier = 1 + transferredPower / afterRelic` (or `1` when unassigned). Guard the divisor and all intermediates.
- Continue through the existing Family and global multipliers and round the Fellow's final Power exactly once at the existing endpoint.
- Expose `assignedCompanionId`, full Companion components, transfer rate, transferred Power, multiplier, before/after values, and formula order.

This preserves the single multiplicative Fellow pipeline while making the actual transferred quantity a tunable percentage of Companion Power. Do not round the transferred quantity before the Fellow's final rounding step.

## Progression mutations

- `grantCompanionExp(id, amount)` accepts only non-negative safe-integer amounts, uses checked addition, derives Level from cumulative EXP, and commits atomically.
- `grantCompanionShards(id, amount)` is QA-only in Phase 4, accepts only non-negative safe integers, and commits atomically.
- `ascendCompanion(id)` spends only that character's shards, increases only rarity by one, refuses max rarity/insufficient shards/invalid state without persistence, and cannot alter Level or EXP.
- Every progression or assignment mutation uses the central clone → accrue old elapsed Village entitlement → mutate → validate → commit → adopt pipeline. A failed save leaves state/UI/revision unchanged.
- QA grants are available only through the existing isolated destructive QA bridge. Add no new production debug buttons and permit no native-storage destructive authorization.

## Free one-to-one assignment

- Assignment is nullable and costs nothing.
- Assigning Companion A to Fellow X atomically unassigns any other Companion currently on X, then assigns A to X.
- Reassigning A from X to Y releases X. Selecting `None` unassigns A.
- Assignment never changes EXP, Level, rarity, shards, Companion Power, Family state, Gold, or Building production.
- Before commit, the profile shows the affected Fellow's current Power and projected Power. If an existing Companion will be displaced, show that Companion and its Fellow Power loss as well.
- After commit, both Companion cards/profiles and affected Fellow profiles immediately reflect the new assignment and Power.
- Save/reload preserves the exact one-to-one assignment.

## UI requirements

- Companion cards show name, Level, rarity, effective Power, shards, and assigned Fellow or Unassigned.
- Companion profiles show cumulative EXP/progress to next Level, base/Level/rarity/Mastery Power components, targeted shards, ascension cost/status, transfer rate and amount, assigned Fellow, and free assignment control.
- Assignment previews clearly distinguish current and projected Fellow Power and identify any displacement.
- Fellow profiles replace the neutral Phase 4 text with the assigned Companion, Companion Power, transfer rate/amount, and resulting Companion multiplier.
- Do not expose stale `bound`, `perk`, `kind`, static `+6%`, direct Building boost, or “Phase 4 preview” text in production UI.
- A collision notice from migration is informational and dismissible/ignorable; it cannot mutate the save merely by rendering.

## Diagnostics and QA bridge

- Add `companionConfig`, all Companion Power components, total Companion roster Power, assignments, collision receipt data, and transfer details to diagnostics.
- Add named isolated QA actions for Companion assignment, ascension, EXP grant, and shard grant. All are declaratively destructive and must fail closed before handlers without explicit isolated non-native storage authorization.
- Rejected QA actions leave active raw bytes, revision, writes, toast, modal, and rendered state unchanged.
- Preserve the captured-runtime/no-page-expando bridge boundary and encoded-query/all-disabled negative realms.

## Acceptance gate

### CLI/static and evaluated behavior

- Fresh schema 5 defaults, exact EXP thresholds and boundary Levels, cap behavior, safe-integer rejection, base/Level/rarity/Mastery Power components, and round-once semantics.
- Character-specific shard spending, insufficient/max refusal, and strict Level/EXP isolation on ascension.
- Assignment uniqueness, free assign/reassign/displace/unassign, exact previews, persistence, no inverse shadow, and no direct Building-rate change.
- Bramble and Cinderwing both affect only their assigned Fellow through their own Power-derived transfer; unassigned transfer is exactly neutral.
- Existing valid schema-0/1/2/3/4 bindings migrate exactly; duplicate collision resolution is ordered, visible, and deterministic.
- Schema-4 checkpoint is exact/write-once; all seven-slot zero-write and injected-failure/retry cases pass.
- Historical staging recovery remains exact; new schema-5 staging accepts only provable lineage.
- No legacy Companion perk logic or production UI survives.
- Phase 3 successor regression passes with every intentional source/schema/Companion supersession itemized and backed by a Phase 4 replacement.

### Live browser behavior

Run twice at `320×568` and `390×844` using fresh schema 5, schema-4 migration, representative legacy migration, collision migration, and isolated-memory realms. Exercise roster navigation, both profiles, EXP/Level change, shard ascension refusal/success, assign/reassign/displace/unassign, Fellow Power before/after, reload persistence, all-disabled QA, encoded query rejection, and native-storage refusal. Require zero failed rows, blank fatal output, zero console warnings/errors, and zero native-storage calls.

### Frozen historical evidence

- Preserve Phase 0–3 fixtures, manifests, and embedded art byte-for-byte unless a successor manifest explicitly records an unavoidable current-artifact identity replacement.
- Verify the three embedded asset data lines retain their Phase 3 aggregate SHA-256.
- Run the Phase 4 CLI verifier twice, successor Phase 3 regression twice, checksums twice, and live browser gate twice before independent review.

## Do not break

- Exact save lineage, write-once backups, recovery precedence, cross-tab refusal, and Undo safety.
- Oath `3% / 5% / 8%` final Building multipliers, 24-hour Gold cap, Family claim rolls, Gifts, Family assignments, and old-entitlement settlement.
- Fellow EXP/Level/rarity/Bond/Family composition, type counters, role bonus, roster total, and Campaign efficiency selectors.
- Family ownership of Buildings and the rule that neither Companion directly staffs or boosts a Building.
- Static-portrait/mobile-first functional-V1 standard and quarantined deferred features.

## Exit gate

Phase 4 may merge only after:

1. The implementation branch is clean and pinned to an exact commit.
2. The full Phase 4 and successor regression evidence passes twice.
3. One independent reviewer passes exact Companion design/math/UI behavior.
4. A second independent reviewer passes migration, staging, atomicity, and failure recovery.
5. The exact reviewed commit is fast-forwarded to `main`, pushed, and verified byte-identical on GitHub Pages.

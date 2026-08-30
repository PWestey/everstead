# EVERSTEAD — PHASE 10C-1 ECONOMY ACTIVATION CONTRACT

## Verdict and authority

**SELECTED FOR A SEPARATELY GATED PRODUCTION CANDIDATE.** Phase 10C-1 may activate the reviewed `candidate-growth-124` economy as the immutable production profile `everstead-economy-v1`. This selection supersedes only the Phase 10B-1 statement that all candidates were advisory; it does not reopen any other locked mechanic.

The exact production base is clean `main` commit `56b99f86a95f95fd1822da0331204f5d8ea33656`, artifact SHA-256 `40a1b21c62745d7b3c96fc4c2bea7ee56763a109a40b3535178277e26aca19fd`, 18,933,604 bytes, five embedded assets, schema 10, and twelve protected storage slots. The embedded-asset aggregate remains `26d0c15d43ab9f7f98467f22f51aab8336f78ae84a016abc981733f7d5df5e7a`.

The Locked Core Design remains product authority. The Phase 10B simulator is measurement authority for the selected constants and exact arithmetic ownership. Phase 10B-2's private Gold arithmetic core remains implementation authority and must be reused rather than duplicated.

## Objective

Repair the impossible Building-cost wall and activate the locked Fellow/Companion-to-Village loop without resetting existing players, repricing already-collected Gold, double-counting character Power, or disturbing non-Gold reward lanes.

## Selected immutable profile

The canonical JSON profile is:

```json
{"id":"everstead-economy-v1","freshGold":50000,"upgradeGrowth":1.24,"fellowRoster":{"numeratorBps":1500,"kneePower":100000,"capBps":1500},"companionRoster":{"numeratorBps":1000,"kneePower":25000,"capBps":1000}}
```

Its exact SHA-256 identity is `6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f`.

- New and safe-reset schema-11 games start with 50,000 Gold.
- Future Building upgrades cost `round(15000 × 1.24^(level - 1))` through the existing level-52 cap.
- Migrated players keep their exact Gold, pending Gold, Buildings, inventories, progression, and prior spending. There is no refund, debit, or top-up.
- Fellow roster bonus basis points are `floor(1500 × fellowEconomyPower / (fellowEconomyPower + 100000))`.
- Companion roster bonus basis points are `floor(1000 × companionEconomyPower / (companionEconomyPower + 25000))`.
- A basis-point bonus becomes a multiplier through `1 + bps / 10000`.
- Fellow economy Power is the sum of each owned Fellow's locally rounded base × level × rarity × Relic × Might Power. It excludes assigned-Companion transfer and every Family-to-Fellow Bond multiplier.
- Companion economy Power is the sum of each owned Companion's existing effective Power, including Mastery. It is not inserted into Fellow economy Power.
- Family remains the direct per-Building assignment multiplier. Prosperity and Bond remain production-neutral in this gate.

The selected curve is the conservative simulator candidate. Its frozen instant-state time-to-afford evidence is approximately 0.55 hours at level 1, 0.52–0.65 hours in the early archetype, 0.68–1.04 hours around levels 8–10, 1.69–3.22 hours around levels 22–25, and 10.50–16.15 hours around levels 46–48. It eliminates the released curve's multi-day-to-multi-year wall while preserving meaningful late-game waits.

## Schema-11 cutover

Add exact current-state field:

```text
economyProfile: {
  configIdentity: "6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f",
  activatedAt: <finite nonnegative integer timestamp>
}
```

Migration from schema 10 to 11 must:

1. create a write-once `PRE_V11_BACKUP_KEY` containing the exact schema-10 active bytes;
2. set `activatedAt` and the receipt `appliedAt` to `max(context.now, saveMeta.updatedAt, lastSeen, lastGoldAt)`;
3. add an authenticated `schema-10-to-11` receipt containing the predecessor identity, production-profile identity, activation timestamp, selected-baseline identity, initialization identity, migration source, and thirteen-slot checkpoint lineage;
4. preserve Gold, pending Gold, `lastGoldAt`, Building levels, inventories, histories, ordinals, droughts, carry, and all unrelated state exactly; and
5. reject `economyProfile` on every schema-10-or-older predecessor as a reserved-field collision.

Fresh and safe-reset schema-11 states receive `everstead-economy-v1` immediately with their creation timestamp as `activatedAt`.

## Offline transition

The first schema-11 opening keeps the existing earliest-24-hours rule and one continuous elapsed cap. It segments the credited interval at both local-midnight and `economyProfile.activatedAt` boundaries:

- timestamps before activation use the released schema-10 rates and neutral roster hooks;
- timestamps at or after activation use `everstead-economy-v1` and active roster hooks.

There may be no gap, overlap, duplicated duration, or repricing of already accrued pending Gold. Per-Building lines aggregate both profiles. `lastGoldAt` advances exactly as before. Family drops settle exactly once using the total credited elapsed. Companion Tower and Fellow Expedition keep their independent clocks and settlement paths.

## Player-facing treatment

- Village hotspots and the aggregate HUD keep their Phase 10B-3 geometry and gain exact accessible names containing Building name and effective Gold/hour.
- The Building modal becomes the authoritative production explanation: Building level, Family, Fellow roster, Companion roster, Oath, and final Gold/hour.
- Upgrade preview shows current rate, next rate, gain, cost, and a visible shortage or maximum-level reason.
- Fellowship shows one roster-wide Fellow production summary and one roster-wide Companion production summary, not repeated per-character badges.
- Offline copy remains player-facing and shows a total row. QA-only profile identities and formula language stay outside production UI.

## Explicit exclusions

- No Fellow or Companion EXP curve change; that requires Phase 10C-2.
- No Campaign reward/cost, Rank, Type, Role, Bond, Prosperity, Oath, Family, Relic, Might, Mastery, shard, pity, RNG, or idle-lane tuning.
- No content, protagonist art, streak/Quest semantics, broader usability work, namespace rename, module split, framework, or external asset.
- No retroactive Building refund and no migration-time Gold settlement.
- No mutation of the meaning of `everstead-economy-v1`; later tuning requires a new profile identity and forward migration.

## Acceptance criteria

### Arithmetic and ownership

- Exact profile constants and identity are frozen and independently recomputed.
- Hand-worked vectors cover zero, starter, mid, high, and saturation Power for both curves.
- Fellow economy Power excludes Companion transfer and Family Bond; Companion Power is counted once; Family remains direct once.
- Existing private Gold core remains byte-identical.
- Building order remains base, level, Family, Fellow roster, Companion roster, overall day, Oath last.

### Persistence and transition

- Schema 10 migrates once to schema 11 with exact pre-V11 backup and receipt authentication.
- Fresh, safe-reset, staged-recovery, committed-recovery, and backup-recovery authorities are deterministic.
- Every current mutation preserves `economyProfile` exactly.
- Any failure before verified active commit keeps schema 10 authoritative; old builds future-schema-block schema 11.
- Thirteen protected slots are included in verified reads, export, fixture installation, diagnostics, reset retention, storage events, and lineage.
- Existing balances and non-profile gameplay state are preserved byte-equivalently.

### Offline and gameplay

- Frozen-clock tests cover zero and ±1 ms around activation; under, at, and over 24 hours; activation at midnight; multiple midnights; rollback; future `lastGoldAt`; and crash/reload before first settlement.
- Old/new rate durations conserve exact elapsed and pending Gold under existing Float64 order.
- Family drops settle once; Companion/Fellow idle cursors remain independent.
- Fresh Gold is exactly 50,000. Migrated Gold is unchanged. Future costs use 1.24; prior levels remain unchanged.

### UI and regression

- Building previews equal committed results and accessible labels equal visible effective rates.
- All three Phase 10B-3 phone sizes preserve hotspot, dialog, tab, copy, contrast, focus, and zero-native-storage guarantees.
- Phase 10B-3, Phase 9, Phase 8 semantic successor, and applicable Phase 10A/10B successor gates run twice with only explicitly superseded whole-artifact/schema identities allowed to differ.
- Focused CLI, live browser, checksums, and two independent read-only reviews pass on one exact clean candidate tip before merge or publication.

## Do not break

Do not change the storage namespace, 24-hour offline cap, Oath 3%/5%/8% values and 30% per-Building cap, Family assignment rules, Power combat formulas, deterministic reward identities, histories, pity, claims, undo, save conflict protection, Phase 10B-3 accessibility behavior, single-file deployable shell, or five embedded assets.

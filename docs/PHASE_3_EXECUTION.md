# Everstead Phase 3 — Execution Record

## Scope

Phase 3 migrates Family from the pre-lock relationship placeholder into the relationship and Village-economy roster. The implementation preserves the single-file mobile shell, art, character identity, Phase 2 Fellow pipeline, Gold cursor, 24-hour cap, Oath final multiplier, and all frozen earlier gate artifacts.

## Production changes

- Save schema 4 with exact write-once schema-3 checkpoint `oathforge_new_world_proto_v01__raw_backup_v3`.
- Six protected persistence slots, schema 0/1/2/3 migration, three historical staging shapes, lineage preflight, and schema-3 staging reconstruction.
- Same-schema checkpoint ancestry for real players who continued progressing after their earlier raw backup, with exact identity/receipt and monotonic revision/time checks.
- Canonical Family state: Intimacy, rarity, targeted shards, nullable unique Building assignment, and claimed milestone IDs.
- One universal Gift inventory, +10 Intimacy per Gift, exact milestone rewards, and shard-only manual ascension.
- Family assignments and inspectable Building bonus components with the Oath multiplier retained last.
- Configured Family-to-Fellow bonuses in the existing single Fellow Power pipeline, including Lyra's Elara and Isolde links and one final round.
- Replay-safe four-hour Building rolls, per-Building ordinals/carry/drought, and canonical carry provenance containing the Family assignment and Building level that earned a partial interval.
- Safe-magnitude fractional Intimacy with exact +10 Gift arithmetic, exact configured Family/drop/receipt map keys, canonical-only collection, and zero-write immediate double claims.
- Fail-closed schema-4 staging recovery: current mutations remain recoverable, while migratable and missing-active recovery require exact deterministic lineage/source/metadata/state before any of the six slots can be written.
- Daily deterministic Oath Gifts with a fifth-unique guarantee and scoped Undo protection for inventory/tracker divergence.
- Family Patrol rewards converted to one universal Gift plus their existing secondary reward.
- Live Family and Building UI, claim reporting, diagnostics, safe export, and isolated authorized QA controls.

## Required validation

1. Run `qa/phase-3/verify.mjs` twice.
2. Run `qa/phase-3/regress-phase-2.mjs` twice.
3. Verify `qa/phase-3/checksums.sha256` twice.
4. Run `git diff --check`.
5. Serve the repository and run `qa/phase-3/` twice in live Chromium. Both 320×568 and 390×844 realms must report no failed rows, blank fatal output, zero warning/error console entries, no horizontal overflow, and no native-storage access.

## Expected Phase 2 supersessions

- Schema 3 current → schema 3 migratable checkpoint; schema 4 current.
- Neutral Family Power position → configured linked-Family multiplier.
- Neutral Family economy position → configured Building assignment multiplier.
- Family preview UI → live Phase 3 UI.
- Five protected slots → six.
- Gold-only Village collection → atomic Gold, Gift, and Family-shard collection.

All other Phase 2 semantics remain required.

## Frozen production identity

- Base: `9b4fbc11ad465f83802b7d787756d2d390de0e55`.
- Production tip: `4815efaf0d28e24282aaa835e2d22468f1d932e1`.
- Artifact: `a4b3e4c870f4f228738e7f8f4bb9a772c64bb863f1a6f7998541f1bbf794a93a` (`18,423,511` bytes).
- Embedded asset-line aggregate: `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78`, unchanged from Phase 2.

## Do not break

- Embedded art bytes and the OATHFORGE compatibility storage namespace.
- Unknown and Unicode save fields outside documented reserved shadows.
- Exact older checkpoints and retry determinism.
- Gold fractional carry, midnight segmentation, rollback no-op, epoch zero, and the 24-hour cap.
- Fellow EXP, Level, rarity, shard ascension, Types, Roles, total-roster Power, and campaign efficiency.
- Production feature flags and native-storage QA isolation.

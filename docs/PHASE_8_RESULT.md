# EVERSTEAD — PHASE 8 RESULT

## Candidate

- Base: sealed Phase 7 package `6bbb2eccc1f79dd985bfde827bf9eb0753fb0845`.
- Production tip: `0f74e923b67c455341cf47985c4c51afa65cb72e`, byte-equivalent to reviewed `83d662725f2ce4db2ccbcec67e431af517254fc6`.
- Production artifact SHA-256: `d2fa8ab00d40a071dd58486e58e4c61c79ab10164d1b96a55ec7303377401309`.
- Production artifact bytes: `18,838,682`.

## Delivered behavior

- Schema 9 and an exact eleventh protected slot (`pre-v9`) with deterministic schema 0–8 migration, receipt-bound ancestry, eleven-slot export/reset, and fail-closed recovery.
- Six immutable one-copy Relics mapped to Broken Roads stages 1–6; stages 7–10 grant Stones only.
- Deterministic first-acquisition and duplicate-salvage Stone equations with no Relic RNG and no retroactive migration rewards.
- One free Relic slot per owned Fellow, unique equipment, atomic move/displacement/unequip, ten levels, exact Stone costs, and refusal/no-op behavior.
- Relic multiplier applied exactly once after Bond and before Companion transfer, propagating to Fellow effective Power, Total Fellow Roster Power, Fellow Campaign, and Fellow Expedition while leaving Village and Companion Power formulas unchanged.
- Phase 8 Campaign epoch that preserves the accepted v2 reward stream and pairs each live run with an exact authenticated Relic side receipt.
- Immutable normal-motion result snapshots, so delayed Campaign modals cannot be mispaired by a later run.
- Strict schema-8 lineage, migration-source, staging-class, missing-active recovery, retry, safe-reset, and native storage-event protections.
- Executable regression coverage for every final production repair, eleven genuine persistence hooks with positive fault-trigger evidence, and all eleven fixture post-write boot-read rollback positions. Unsupported synthetic “validation fault” labels are not claimed.
- Relics as the fourth Fellowship tab with inventory, source, equipment, upgrade, Power, and durable receipt feedback; no new adventure mode.

## Gate evidence

- Phase 8 focused CLI: `186/186` twice on the repaired production artifact, including explicit trigger proof for every claimed persistence hook and eleven-slot fixture rollback.
- Phase 7 semantic successor: `585/585` twice, with seven itemized Phase 8 replacements.
- Independent reviews: exact gameplay/receipts `19/19`; persistence/recovery `46/46`.
- Package checksums: all `14/14` entries pass twice.
- Exact live package `3fcfa3c914b721295a22a86b4291cda3bc10c44d` passed Chromium twice: `520/520` at outer 320×568 and `520/520` at outer 390×844. Each pass internally exercised both configured phone realms and normal/reduced motion, with blank fatal, zero failed rows, and zero warning/error console entries.

## Compatibility boundary

Released schema 0–8 saves are supported. Final schema-9 compatibility begins with this package. The schema-8 predecessor is retained byte-exact in pre-v9, and its Campaign counts form the immutable old epoch. Migration resets only live Phase 8 counts and grants no Relics, Stones, equipment, levels, or other retroactive rewards.

## Residual risks and deferred validation

- Web Storage has no atomic compare-and-swap; exact ownership rereads, revisions, raw identities, staging provenance, and storage events narrow and detect but cannot eliminate the final same-origin race.
- FNV raw identities bind accidental/foreign divergence but are not cryptographic authentication against a malicious same-origin editor.
- The 100,000-entry live Campaign replay ceiling requires an explicit future aggregation/schema migration before normal play approaches it; it must not be silently raised.
- Safari and real-device behavior remain outside the Chromium gate.
- Advanced Relic sets, affixes, reforging, additional materials, Relic-specific modes, Phase 10 balancing, automation, audio, events, advanced animation, and Post-V1 systems remain deferred.

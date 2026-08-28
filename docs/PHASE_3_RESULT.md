# Everstead Phase 3 — Result

Status: **REPAIR CANDIDATE — CLI PASS; LIVE GATE PENDING** at production tip `7a97cea1e7422aaf23e796bbd33385d535ce06df`. This supersedes the independently rejected candidate `cea999a4c3c8d48f70ee4858cff55cfdb568e1c3` and all intermediate repair tips.

## Accepted implementation

- Schema 4 with the write-once schema-3 checkpoint and deterministic schema 0/1/2/3 migration.
- Exact recovery of authenticated Phase 1 schema-2, Phase 2 schema-3, and Phase 3 schema-4 interrupted staging payloads. A generic-valid schema-4 envelope is not recovery authority: migratable and missing-active paths require exact reconstructed lineage, source, metadata, and state, while corrupt, invalid, and future active payloads fail closed without offering generic staging recovery.
- New transaction staging requires an empty slot or exact authenticated ownership of the payload being replaced. A foreign staging payload inserted after boot is retained; the attempted mutation leaves persistence, runtime state, revision, modal, toast, and rendered UI unchanged.
- A schema-4 active write that became durable before verification or staging cleanup can resume without replaying migration rewards. Schema 0/1/2/3 migrations authenticate the exact active target, predecessor checkpoint/raw identity, base revision, source, and deterministic receipt/hop replay; fresh and missing-active recoveries use their exact source-specific replay. New staging envelopes bind transaction class, source/base metadata, predecessor identity, and exact target identity. Prior-production unbound ordinary current transactions retain a narrow one-hop compatibility path only for explicit gameplay sources; reserved migration/recovery/fresh sources, source-swapped migration stages, target identities, and bound-field tampering fail closed with zero writes.
- Family Intimacy, one Gift inventory, targeted shards, rarity, once-only milestones, free unique Building assignments, Building production bonuses, and linked Fellow Power bonuses.
- Replay-safe four-hour Village rolls with per-Building ordinal/carry/drought state, including persisted carry assignment/Building-level provenance so a split roll cannot be rerouted or repriced after mutation or reload.
- A provisional Building level cap of 52 keeps upgrade costs and forward Gold accrual in the safe finite economy range. Schema-3 fractional levels through 52 migrate exactly; larger finite levels, including `Number.MAX_SAFE_INTEGER + 1` and `Number.MAX_VALUE`, canonicalize deterministically to 52 before initial carry or accrual. Schema-4 current/carry levels must remain within the cap and carry cannot exceed current level; settlement clamps defensively. Exact 51 upgrades to 52, while 51.5, 51.999999999, 52, and any other +1 step beyond the cap are cleanly refused without cost or writes.
- Safe-magnitude fractional Intimacy, exact +10 Gift arithmetic, exact configured Family map keys, canonical-only collection, and immediate double-claim zero-write behavior.
- Deterministic daily Oath Gift miss/hit behavior, fifth-unique guarantee, maximum one Gift per day, and Gift/tracker-aware scoped Undo.
- Live Family, Building, Fellow, collection, diagnostics, safe-export, and isolated QA surfaces.

## Immutable evidence

- Base: `9b4fbc11ad465f83802b7d787756d2d390de0e55`.
- Production commits: `0bb4b235e367e0f2bb7fbda2b315ff29b2fdb47e`, `b802644d4b78974cabea208bb009e0f693fd462b`, `eb9c3bd827cd1fe89130c4bfc8abfcafa62a89d6`, reward/staging repair `4815efaf0d28e24282aaa835e2d22468f1d932e1`, staging-ownership repair `b0beeb862fa20b6246da43120ba9a654013a449a`, carry-level repair `2d348d640f8c0a8b2d09c3849c7a44f44b5689be`, retry/cap hardening `991c42fd47adecf5623c264af078f39e6340f7c5`, and bound-staging/fractional-cap repair `7a97cea1e7422aaf23e796bbd33385d535ce06df`.
- Production artifact SHA-256: `656f0c6be39116d64da31a86eaf995b4e486c9cb447cf2720766163e5b5ac9ca`; byte length: `18,430,375`.
- Base artifact SHA-256: `c41b6729725e2e50aee84e93d65cc8cdbc9f78d432dfb8cd703ff2060a11a2b3`; byte length: `18,380,433`.
- Embedded asset-line aggregate SHA-256: `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78`, identical to the base.
- Phase 3 CLI: `334/334`, twice.
- Phase 2 semantic successor: `294/294`, twice, with exactly six itemized supersessions.
- Phase 3 checksum manifest: `13/13`, twice; `90` Phase 0/1/2 QA and result artifacts byte-frozen.
- Live Chromium: pending two final-tip passes from the root browser binding across 320×568 and 390×844 realms. Required evidence remains blank fatal output, no failed rows, no horizontal overflow, zero native-storage calls, and zero warning/error console entries.
- `git diff --check`: clean.

## Source authority

- Locked Core Design v1.2 revision: `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`.
- Implementation Roadmap v1.0 revision: `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`.

## Migration semantics

- Migrated Family `progress` becomes exact fractional `intimacy`; legacy relationship level, Blessing, assignment, and derived shadows are removed without conferring rarity or shards.
- Migrated members begin at rarity 1, zero shards, and no Building assignment. Already-crossed Intimacy milestones are marked claimed without retroactive shard grants.
- Migrated and fresh schema-4 saves receive exactly one starter Gift. Existing pending schema-3 Oath Undo is converted to the Gift-aware schema-4 inverse/expected shape.
- Fresh and migrated Building drop state receives a canonical carry context. A partial interval keeps the assigned Family ID and Building level that earned it for its first completed roll; later complete rolls and any remainder use the current context.
- Schema-3 Building level `1.5` remains exact through migration and 24-hour accrual. Values above the provisional cap canonicalize to 52 before initial carry and Gold calculation; `Number.MAX_SAFE_INTEGER + 1` and `Number.MAX_VALUE` pass exact-checkpoint migration at both one millisecond and 24 hours forward without non-finite state. Natural old-level carry remains valid only while `carryContext.buildingLevel <= buildings[id].level`; impossible upward provenance is invalid and cannot raise the settlement chance even if settlement is probed directly with fabricated state.
- Write-once checkpoints preserve exact bytes. Receipt order, save ID, creation time, hop revisions, and staged/checkpoint payloads are validated before any migration write. Same-schema saves that legitimately progressed after an earlier raw backup additionally require stable save identity, an unchanged exact migration-receipt set, and monotonic revision/time ancestry.
- Missing-active schema-4 staging is accepted only when it is the exact fresh state or the exact deterministic successor of the highest-precedence authenticated backup with the required recovery source. Resource-modified or foreign-source envelopes preserve all six slots with zero writes.
- Once such a candidate is already the durable active state, its retained staging envelope is authenticated against the original named recovery source even when deterministic migration created later checkpoints before the interruption. This permits cleanup without changing rewards, receipts, or revision.
- A corrupt or invalid active payload cannot authenticate generic staging, even when the envelope names the exact corrupt raw identity. A post-boot occupied staging slot likewise cannot be overwritten by a normal mutation; only explicit, exact replacement ownership is accepted.
- Offline Gold and Family drops settle before assignments, upgrades, Gifts, ascension, claims, and other mutations, so elapsed time uses the old assignment and old Building level.

## Residual risks

- Web Storage has no atomic compare-and-swap; revision, raw identity, staging provenance, same-tab guard, and storage events narrow and detect but cannot eliminate the final reread-to-write race.
- Same-schema gameplay is not event-sourced. An earlier write-once raw backup can be authenticated to a later active save through stable identity, exact receipts, and monotonic metadata, but every intervening gameplay mutation cannot be independently replayed.
- The preexisting corrupt-save safe-reset interruption edge remains fail-closed: if the reset active write becomes durable but verification or cleanup is interrupted, the exact active and staged bytes are retained and retry performs zero writes, but manual recovery remains required because the null-base safe-reset transaction is not ordinary one-hop staging.
- Local-midnight segmentation follows the device clock and timezone; cross-timezone travel semantics remain the existing behavior.
- Real-device Safari behavior remains outside the required Chromium gate.
- The campaign Gift hook is deliberately neutral until Phase 5.

## Final gate still required

- Live Chromium twice at both required mobile sizes. Replace this pending section with the observed counts before final acceptance. All CLI, successor, checksum, frozen-file, and diff checks are complete.

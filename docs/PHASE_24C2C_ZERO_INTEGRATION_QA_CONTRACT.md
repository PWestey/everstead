# Phase 24C-2C Zero-Only Integration — Independent QA Contract

**Status:** Accepted and frozen  
**Scope:** First production load of the accepted Phase 24C durable foundation, schema 14, and Save & Recovery format 3 with every Collection output exactly zero

## Frozen acceptance

- Integrated `index.html` SHA-256: `7073db350bddfdea932bf89d900a449346c2e3e6b2b636bf55a1e8f8f3aa3356`
- Zero-activation source SHA-256: `88ba60568041b764794b74dec6b926e34890354d6c13175491f5f87c4c92a03f`
- Zero-activation semantic SHA-256: `556641d1997d7cee1734e79da510141154f00be97a21138f08bc088de2e68aaf`
- Accepted browser evidence: focused 185/185, non-allowlisted-host denial 10/10, and full 391/391 twice, each with blank fatal output and zero warning/error console entries.
- Final checksum closure: 28 exact files, including the current reopened foundation-v2 and independent pre-gate artifacts and the accepted activation-authority manifest. Historical Phase 24C foundation and independent checksum manifests remain unchanged as predecessor/supersession evidence.

## Acceptance boundary

This gate authorizes only the zero-output integration. It does not authorize an active Collection release, nonzero Collection totals, claims, previews, formula application, rank release above 5, family alignment, legacy/event/facility ladder activation, new tutorials, new UI, repricing, or any public release.

The gate is independent:

- It loads the real `index.html` candidate.
- It does not import a writer verifier.
- It records storage operations through a separate adapter.
- It compares Phase 24A outputs to hardcoded accepted anchors.
- It rejects candidate acceptance if the source, markers, or checksum set is not frozen.

## Static authority

The candidate must load exactly these files, in this least-authority order, before inline boot:

1. `src/phase24c-zero-activation-authority.js`
2. `src/phase24c-durable-definitions.js`
3. `src/phase24c-durable-foundation.js`

The exact loader block is bounded by:

- `<!-- Phase 24C-2C zero-only authority load BEGIN -->`
- `<!-- Phase 24C-2C zero-only authority load END -->`

Every Phase 24C-2C JavaScript change must live inside one balanced named Phase 24C-2C block. Removing the loader and all exact Phase 24C-2C blocks must reproduce accepted Phase 24C-2B index SHA-256 `73737ab74efd4e33b2a5fdae1d1c76a6e88b4e51b1bb43453e034f47d5d5c7fb` byte for byte.

The loaded authority must retain the accepted source status/config/definitions/formulas unchanged. The durable foundation is version 2, whose only reopened semantic authority is the authenticated forensic safe-reset null/null origin described below. The activation manifest may supersede only the previously false `definitions.activation.productionLoaded` path for this exact zero-only integration.

## Schema and lineage

The live schema is exactly 14. The only accepted lineages are:

- Direct fresh: `direct-schema-14`, revision 1, zero migration receipts, no pre-v14 checkpoint.
- Safe reset: `safe-reset-schema-14`, revision 1, zero migration receipts, byte-identical retention of every occupied protected checkpoint including pre-v14, marker attestation of the retained pre-v14 byte, and an authenticated complete Previous Save.
- Real migration: `schema-13-to-14-migration`, one `migration.schema-13-to-14.phase-24c-foundation.v2` receipt, exact revision increment, and an exact write-once pre-v14 checkpoint.

Validation must use exact validator IDs:

- `validator.schema-13.phase-24c-production.v1`
- `validator.direct-schema-14-origin.phase-24c-production.v1`

Every validation must use the physical checkpoint/direct-origin resolver and cloned validator inputs. False, throw, mutation, missing resolution, or mismatched identity fails closed.

When schema-14 validation projects a predecessor back to released Phase 23 authority, both the semantic value and the physical `activeRaw` supplied to that authority must be the same canonical `JSON.stringify` of the Phase 23 projection. The original schema-14 bytes must never be paired with a projected schema-13 value. Real commit, staging, post-write, and adoption validation remains authoritative; temporary validation recursion traces, migration proof/cache/evidence shortcuts, forced diagnostic throws, and console diagnostics are forbidden from the candidate.

## Save & Recovery topology

Format 3 authenticates exactly 15 permanent installation slots:

`active`, `rawBackup`, `preV2` through `preV14`.

Each operational snapshot additionally contains exactly three controls:

`ordinaryStaging`, `journal`, `rollback`.

Therefore every exact operational snapshot has 18 named values. The pre-v14 key is `oathforge_new_world_proto_v01__raw_backup_v13`. It is write-once and byte-exact for real migration only.

A validated Previous Save contains one complete exact 15-slot installation. The three operational controls are outside that installation and are authenticated separately by the transaction journal/rollback topology. A forensic Previous record instead preserves the exact 16 source values—the 15 installation slots plus ordinary staging—with an exact digest vector; it is retained for recovery/download but is not treated as a restorable canonical schema-14 installation.

The browser gate covers:

- direct fresh first boot and zero-write reload;
- safe reset from a migrated schema-14 installation whose `rawBackup` and `preV14` are both occupied;
- a dedicated retained-backup safe-reset fixture that begins from the exact canonical schema-12 active, creates an authenticated legacy reset installation only for this scenario, proves `rawBackup` equals those original bytes, and proves the version-7 `preResetActiveRawIdentity` and `backupRawIdentity` bind those bytes; its authentic foundation activators run under a temporary QA-only in-memory coordinator that validates every successor while making zero storage/staging/journal writes and restores the coordinator in `finally`; after one final exact 13-slot retained installation is authenticated and written, the fixture validates and directly adopts its exact active bytes with zero further writes—without replaying the legacy adoption helper—and proves all current coordinators are restored before the first Phase 23 foundation reconciliation remains a raw-stable zero-write no-op after 12 → 13;
- exact version-9 retained-checkpoint marker and full Previous Save binding;
- exact reset-time semantics: a Previous Save created at `resetAt` binds the original source installation, an older Previous Save is rejected with zero attempt writes, and a legitimate later import/restore Previous Save created after `resetAt` remains valid;
- context-free version-9 marker attestation after later authenticated transactions;
- real schema 13 migration;
- real schema 12 → 13 → 14 chain;
- pending offline settlement neutrality;
- interrupted migration before staging, after staging, and after active write;
- committed ordinary staging recovery after active write but before cleanup;
- ordinary authentic schema-12 migration fixtures constructed as direct captured 13-slot installations through the Phase 23 legacy Save & Recovery/runtime boundary, with exact legacy slot topology, canonical schema-12 authority, complete current foundations, and no legacy reset-target detour proved before Phase 23 boot; authentic raw pending and committed schema-13 ordinary staging recovered under captured Phase 23 before migration, plus a concrete raw schema-11 historical pending-staging lineage; the bridge must not normalize these fixtures through a migration helper, and the Phase 24C-2C commit wrapper must remain compatible with the captured Phase 23 recovery writes before the terminal schema-14 migration;
- exact branch-only historical staging recursion: schema 14 and the current bootstrap must own entry, the recognized staged schema must be an integer from 0 through 13, recursion is temporarily bound to the captured Phase 12 bootstrap only around captured Phase 23 recovery, and both bootstrap and schema are restored in `finally` and rechecked before the current reread; malformed-envelope, foreign-provenance, and future staging fixtures must all refuse with fixed `staging-provenance`, zero attempt writes, exact active/staging/protected-byte preservation, no cleanup or adoption, and a valid restored terminal state;
- occupied foreign pre-v14 rejection with zero attempt writes;
- deterministic-replay rejection of a valid-looking immediate migration target mutated at the unchanged migration revision;
- rejection of a fresh envelope around a safe-reset target and a safe-reset envelope around a migrated/evolved target, using canonical fully rebound envelopes through the actual production staging/recovery authority with byte-preserved refusal;
- pending and committed schema-14 ordinary `source: 'safe-reset'` staging with a plausible marker but no format-3 journal/Previous, both rejected byte-for-byte with zero cleanup because schema-14 safe reset is journal-only;
- recomputed format-3 validated Previous records around canonical-looking schema-14 states that are lineage-invalid or carry forbidden nonzero Collection authority, rejected as non-restorable before journal reconstruction;
- forensic Previous records with valid outer hashes/digests around those same invalid states, never classified `restorable: true` unless the complete installation passes semantic schema-14 authority validation;
- same-class format-3 rollback/journal forgeries with valid outer digests and identities but invalid schema-14 authority, rejected before reconstruction with no target adoption;
- safe-reset, import, and rollback interruptions at each durable boundary;
- every named migration, ordinary-commit, safe-reset, import, and rollback interruption is a real injected fault rather than a completed transaction with a label: the harness hashes the exact partial 18-value snapshot, proves source and target identities differ, matches the partial active/control topology to the named boundary, then reboots through production recovery and proves the exact source-or-target terminal direction and independent operation/recovery write traces;
- forensic safe reset from bounded blocked future-schema, invalid-schema-13, malformed-active, and missing-active sources, with complete source-installation hash and raw-byte journal binding, byte-retained protected data, authenticated marker/Previous evidence, terminal reboot, zero save-ID/history merging, and a deliberately non-restorable forensic Previous record;
- malformed-active and missing-active forensic resets where no semantic save identity exists, with version-9 marker `preResetSaveId` and `preResetRevision` both exactly null while the complete raw installation remains authenticated;
- malformed-active and missing-active forensic null/null origins accepted only through the exact named direct-origin validator, plus a canonical forged/incomplete null-binding probe that supplies a semantic source identity beside the null pair and must be rejected before any write, cleanup, or adoption while preserving every source byte;
- the actual blocked-state recovery-diagnostics UI/action for both future-schema and malformed-active sources, exporting one canonical format-3 `everstead-recovery-diagnostics` artifact with all exact 18 snapshot values, per-value SHA-256/null digests, a canonical whole-snapshot identity, occupied pre-v14/journal/rollback fixtures, zero export writes, no omissions, and no save-ID/history merging;
- an interleaved-slot-change diagnostic probe that changes one slot between the aggregate read passes and requires the actual export action to fail closed with no download, payload, hybrid snapshot, or canonical identity;
- ordinary in-game `persistenceDiagnostics()` after direct fresh and migrated schema-14 boot, proving its inherited legacy export fields (`activeRaw`, `backupRaw`, and `readErrors`) remain compatible and do not throw or misreport after the separate blocked-state diagnostic artifact is installed;
- authentic format-v1, format-v2, and format-v3 imports, adapted through 12 → 13 → 14, 13 → 14, or direct 14 as applicable;
- complete-installation rollback, exact `schema-14-safe-reset-previous` rejection for a valid Previous record whose timestamp alone predates the reset, and no save-ID/history merge;
- an authentic nested safe-reset path: first safe reset, production forget of its Previous record, then a later second safe reset from the still-valid safe-reset active installation; the second version-9 marker and format-3 Previous must bind the complete first-reset 15-slot installation at the exact second reset time, without merging the forgotten Previous control or any save-ID/history, and must finish as a valid zero-output 18-value snapshot;
- foreign slot preservation;
- two real clients sharing synchronous storage, storage-event staleness, one winner, and zero-write stale refusal;
- insertion of a foreign save-tool journal between the exact 18-slot boot read and semantic adoption, which must retry or fail closed without unparsed cleanup;
- insertion by the second real client after the terminal snapshot but before current-save adoption and before committed-stage cleanup, preserving both journal and staged bytes while refusing/retrying semantic adoption;
- insertion by the second real client after post-staging validation but before an inherited active write, preserving journal ownership and refusing/retrying the active write;
- committed ordinary staging beside a safe-reset active installation after production Forget Previous; production boot must accept the deliberately missing Previous context, adopt the committed current mutation, clean staging, and retain a missing rollback;
- committed ordinary staging beside a safe-reset active installation with a canonical format-3 Previous whose timestamp predates the reset; production boot must reach bound-Previous validation, refuse before adoption or cleanup, make zero writes, and preserve the exact active, staging, and rollback bytes;
- insertion by a second real client of an invalid rollback/Previous beside a valid safe-reset active save immediately before ordinary-commit final preflight, with no storage event delivered yet; the commit must semantically validate the safe-reset Previous context, preserve the foreign rollback bytes, and make zero active/staging writes;
- insertion by a second real client after ordinary-commit candidate validation but immediately before the first staging write; the aggregate 18-value ownership reread must refuse with zero staging writes and preserve the peer journal;
- insertion by a second real client after ordinary staging and active writes but immediately before staging cleanup; the committed active and exact staging bytes must remain, cleanup must make zero writes, the peer journal must remain exact, and the client must be marked stale for reboot recovery;
- ordinary gameplay commit while a foreign save-tool journal exists, which must refuse with zero active/staging mutation and preserve journal ownership.

Every write-sensitive scenario must include an independent adapter trace and, when the bridge returns its own trace, the two trace lengths must agree.

Web Storage still has no atomic compare-and-swap, so the post-reread write interval remains a residual platform race. That limitation does not relax exact journal preflight, ownership, or fail-closed adoption requirements.

## Exact zero-output proof

Every direct, migrated, reset, imported, recovered, and race result must preserve:

- `activeReleaseIds: []`
- `collectionTotals: { powerBps: 0, earningsBps: 0, expBps: 0, facilityBpsByFacilityId: {} }`
- `recentGrantReceipts: []`
- `claimedDefinitionIds: []`
- rank capacity 30 and released rank 5
- no claim readiness
- no reward applications
- no Collection formula reads

The state root is `durableProgression`. Totals are physically stored at `durableProgression.collections.checkpoint.totals`.

The exact accepted Phase 24A anchors are:

| Profile | Fellow combat | Fellow economy | Companion actual | Companion floor | Companion effective | Fellow bps | Companion bps | Gold/hour |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Fresh | 35,565 | 35,150 | 2,200 | 0 | 2,200 | 390 | 80 | 27,320.8092192 |
| Migrated established | 36,645 | 35,150 | 2,272 | 2,892 | 2,892 | 390 | 83 | 27,328.94041242 |

Fresh schema-12 migration additionally retains Fellow combat 36,366, protection delta 801, true-fresh comparison 35,565, Companion actual 2,200, and protected Fellows `cael` and `orin`.

The power-invested pending-offline fixture has its own exact anchor: Fellow combat 1,054,194; Fellow economy 1,039,700; Companion actual 4,329; Companion migration floor and effective Power 23,980; Gold/hour 30,091.179009135998. Opening settlement must preserve every durable zero-output field and every anchor value exactly. `sourceSaveId` remains stable, while `sourceRevision` must track the real state revision from 20 to 21; source metadata is attested separately and is not part of the durable-zero equality comparison.

## Browser realms

Authorized realms include 320×568 direct fresh, 390×844 at 130% copy with reduced motion for safe reset, 1024×768 real schema-13 migration, 390×844 schema-12 chaining, pending offline, and recovery.

The diagnostic `focus=<authorized realm id or scenario>` query may run any one authorized realm in `FOCUSED` mode. Focused results localize failures but are explicitly non-acceptance; only the complete aggregate run may be a candidate result.

Denial realms independently omit or violate one boundary: query, destructive authorization, isolated-storage attestation, supplied adapter, unique `qa=1`, or the product hostname allowlist. The final denial is served from contract-pinned `127.0.0.1.nip.io`, which resolves to the same loopback listener but is not one of `localhost`, `127.0.0.1`, `[::1]`, or `::1`. Before evaluating the fetched in-memory candidate copy only, the realm must find exactly one literal `const QA_BRIDGE_ALLOWED=qaBridgeAllowed();` anchor and replace it once with the unchanged assignment plus a QA-only frozen, nonenumerable, nonwritable, nonconfigurable observation. The observation records the literal decision, a recomputed `qaBridgeAllowed()` result, the observed hostname, and successful instrumentation. The denial row requires both decisions to be false, the probe hostname to equal the contract-pinned observed hostname, the exact descriptor and frozen value, allowlist exclusion, no normal bridge descriptor or value, and zero storage writes across the boundary check. Zero or multiple anchors, a pre-existing probe name, missing/throwing/non-Boolean evidence, or descriptor mismatch must fail closed; the QA probe name must remain absent from the production `index.html` bytes. The exact captured native-storage realm must reject the bridge and restore any local QA-origin values it touched. `?focus=deny-nonloopback` runs only this denial in non-acceptance `FOCUSED` mode.

The two-client test uses separate real app documents, one shared synchronous memory store, and dispatched storage events. A winning mutation must commit once; the other client must become stale and refuse without a write.

## Bridge boundary

The candidate bridge is `__EVERSTEAD_PHASE_24C2C_QA__`, version `phase-24c2c-zero-integration-qa-v1`. Its exact read and destructive method lists live in `contract.json`.

The `diagnostics` read must report current schema 14, loaded state schema 14, an empty validation-error array, an unblocked persistence state, and loaded Phase 24C authority. `probeInvalid` accepts only the exact finite invalid-case IDs in `contract.json` and must report the attempt-local trace, raw/revision/slot invariants, case-specific authority evidence, and restored valid zero state.

The bridge must be frozen, non-enumerable, guarded by a getter, and available only after the existing exact QA and destructive authorization checks. It may return state, evidence, identities, save snapshots, export payloads, and bounded fixed-scenario results inside its isolated realm. It must not expose raw storage methods, arbitrary import input, callbacks, mutation functions, capability/refusal tokens, or any inactive Collection grant/formula API.

## Bounded evidence transport

Every assertion outcome crosses the realm boundary, but full save snapshots, raw save bytes, and state graphs do not. Each row carries the exact Boolean assertion outcome, bounded inspectable facts for its predicate operands, and a deterministic `fnv1a32-tree-v1` correlation digest over those published bounded facts with logical length and structure counts. The correlation digest is integrity/correlation metadata, not a cryptographic tamper-proof claim, and the harness must never hash the discarded full detail graph merely to publish a row. Command responses project only predicate-consumed fields; raw byte strings are replaced by deterministic digest-and-length identity tokens before `postMessage`.

The exact serialized ceilings are 192 KiB per command response, 512 KiB per realm result envelope chunk, and 2 MiB for the final published result. A realm may publish at most eight chunks. Every chunk uses the same source, channel, nonce, versioned transport ID, fixed chunk count, and ordered aggregate manifest. The realm transport ID is derived exactly from the secure parent-generated nonce, so a non-secure denial realm never depends on `crypto.randomUUID()`. Chunk indices must be unique and strictly monotonic from zero; row ranges must be contiguous; row IDs cannot repeat; only the final chunk may carry errors; and the receiver recomputes each exact serialized byte length before accepting it. The final manifest binds the complete row count and an ordered correlation digest over every row ID and evidence digest. No partial sequence is published, and timeout, mismatch, omission, duplication, or an extra message after the final chunk fails closed under the original 180-second realm deadline. A normal-sender exception is published once through a minimal bounded failure chunk and never calls the normal sender recursively. The browser gate must include passing machine assertions for each ceiling and assembly invariant. To keep the complete candidate artifact within 2 MiB, only a passing row's redundant human-readable `detail` summary is deterministically omitted during final publication. Every row and all `id`, outcome, exact bounded `facts`, and `evidence` fields remain unchanged; failed rows and their detail remain unchanged. The final transport row records original and final candidate bytes, the cap, row and failed-row counts, and matching pre/post bindings over every assertion outcome, facts object, and evidence digest. The resulting artifact therefore preserves complete assertion outcomes with bounded inspectable facts and deterministic correlation metadata without retaining or structured-cloning the full snapshot/raw/state graph. The runner page and isolated realm page must both load the synchronized harness cache version recorded in `contract.json`; this candidate uses version 20.

## Final acceptance

Before final acceptance:

1. Stabilize the production integration and the exact bridge/marker names.
2. Replace every pending hash in `contract.json` with the final exact hash.
3. Freeze a checksum manifest covering the independent package and its contract/result documents.
4. Run the static verifier twice with byte-identical results.
5. Run all browser realms twice with every row passing, blank fatal output, and zero warning/error console entries.
6. Have root independently inspect the production diff and evidence.

Passing this gate still does not authorize the first nonzero Collection release.

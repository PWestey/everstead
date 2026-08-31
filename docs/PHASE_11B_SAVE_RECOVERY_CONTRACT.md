# Phase 11B · Save & Recovery contract

## Purpose

Close the largest remaining functional-V1 safety gap: give ordinary players a verified recovery bundle, understandable save health and migration history, safe import, recoverable reset, and one previous-save recovery point.

This phase protects long-term play. It must not change gameplay progression, rewards, economy, Power, the save-state schema, or any migration result.

## Authority and baseline

- Baseline: Phase 11A sealed `main` at `f36a84eca29820dfc1a29efbe93309bef6e9f762`.
- Production save-state schema remains 11.
- Phase 10C schema authority, thirteen-slot lineage rules, staging behavior, economy engine, and five embedded assets remain authoritative.
- Phase 11A player-facing clarity and mobile behavior remain authoritative.

## Delivery sequence

Phase 11B is one product phase with two independently gated implementation steps.

### Phase 11B-1 · Read-only safety surface

- Download a verified recovery bundle.
- Inspect active-save and automatic-checkpoint health.
- Show escaped, read-only migration history.
- Rename the More-screen area to **Save & Recovery** and explain local-only storage and bundle privacy.
- Do not add any new storage writes or alter reset behavior in this step.

### Phase 11B-2 · Transactional recovery

- Import a verified current-schema recovery bundle.
- Preserve one exact previous installation for rollback.
- Make safe reset create the same exact previous-installation recovery point.
- Restore the previous installation through the same journaled transaction as import.
- Allow the player to forget the previous recovery point only through a separately confirmed destructive action.
- Recover deterministically after interruption at every storage boundary.

11B-1 may ship only if its read-only gate proves zero storage writes. 11B-2 is implemented behind captured adapters, then exposed only after its complete fault-injection and live-browser gate passes.

## Recovery bundle v1

The normal downloaded file has exact top-level keys in this order:

1. `product` — `Everstead`
2. `format` — `everstead-recovery-bundle`
3. `formatVersion` — `1`
4. `exportedAt` — finite non-negative timestamp
5. `appVersion` — current application version string
6. `slots`
7. `integrity`

`slots` has exact semantic keys:

- `active`
- `rawBackup`
- `preV2`
- `preV3`
- `preV4`
- `preV5`
- `preV6`
- `preV7`
- `preV8`
- `preV9`
- `preV10`
- `preV11`

Every slot is either an exact raw string or `null`. Physical storage keys are never accepted from a file and never derived from imported content. Ordinary staging and save-tool operational slots are excluded.

`integrity` has exact keys `algorithm` and `digest`. `algorithm` is `SHA-256`. The digest covers the UTF-8 bytes of the canonical JSON serialization of the first six fields, using the exact key order above and the exact slot order above. The checksum detects corruption; it is not a signature and does not prove authorship.

`appVersion` is bounded informational metadata. It does not control compatibility and need not equal the importing build; only format version, save schema, exact lineage, and integrity do.

The download name is `everstead-recovery-YYYY-MM-DD.json`. The app must warn that the file contains Oaths, private memos, links, and complete local progress. A normal recovery bundle may be downloaded only when its UTF-8 serialization is at most `33,554,432` bytes. The same parser limit applies to import, so a file exported by this build is size-valid for inspection. Structural validity never promises installability on another device: available Web Storage capacity is device-, browser-, and origin-specific and is tested only after confirmation by the journaled transaction. A larger installation remains available through the protected forensic export and receives an explicit size explanation; it is never silently truncated.

## Import boundary

Initial import accepts only recovery bundle v1 whose active save is current schema 11. Legacy, future-schema, partial forensic files, occupied staging, and old export-version-11 snapshots are inspection-only and must not write storage.

Before parsing, enforce the `33,554,432`-byte UTF-8 limit. Decode UTF-8 fatally and reject a byte-order mark. The bounded parser scans the outer bundle JSON and the current `active` raw JSON before ordinary parsing. Container depth is counted with the root container as depth 1; depth 64 is accepted and depth 65 is rejected. Duplicate decoded keys, including escaped-equivalent keys, are rejected at every object level in those two scopes. Historical checkpoint strings remain opaque exact bytes because `rawBackup` may intentionally preserve noncanonical legacy input; they are trusted only when the existing Phase 10C lineage authentication binds them to the validated active save. The active raw must already equal `JSON.stringify(parsedActive)` so the active-last commit marker has one canonical byte representation. `exportedAt` is a finite non-negative safe integer, `appVersion` is 1–128 UTF-16 code units, and every SHA-256 digest is lowercase 64-hex. Reject:

- invalid JSON, duplicate object keys, excessive nesting, or unsupported primitives;
- missing, extra, or out-of-order structural keys;
- wrong product, format, version, algorithm, or digest;
- any non-string/non-null slot;
- an absent active slot;
- a non-current active save;
- a state that fails schema-11 validation;
- a bundle whose active save does not authenticate against its exact supplied checkpoint lineage;
- imported HTML/script text only when it violates the existing state schema; all valid user text remains data and must always be escaped when rendered;
- a bundle that would require migration or ordinary staging recovery.

Import inspection is pure: rejected, cancelled, or merely previewed input produces zero storage writes, zero runtime mutation, no toast, and no modal replacement beyond the inspection UI. An import identical to the current installation is a zero-write refusal. A preview captures the exact current fifteen-slot preimage; confirmation refuses with zero writes if any byte changes before installation begins.

The preview says: **Checksum verified. This file is intact, but the checksum does not prove who created it. Import only recovery files you trust.** It also says: **This file was checked on this device and was not uploaded.**

## Fifteen-slot runtime boundary

Phase 11B adds two operational keys to the existing thirteen protected slots:

- save-tool journal — `oathforge_new_world_proto_v01__save_tool_journal_v1`;
- previous-installation rollback — `oathforge_new_world_proto_v01__previous_installation_v1`.

The journal and rollback keys are constants owned by Everstead. They are never included as imported write targets. Cross-tab changes to either key mark the current runtime stale or blocked using the same fail-closed policy as the existing protected slots.

### Canonical installation and identities

A canonical installation has one top-level key, `slots`, whose value uses the exact twelve semantic keys and order defined by Recovery bundle v1. Its canonical raw is `JSON.stringify(installation)`. Its identity is the lowercase 64-hex SHA-256 of the UTF-8 canonical raw.

A source-slot digest vector has the exact twelve semantic keys/order followed by `ordinaryStaging`. A null slot maps to `null`; a string slot maps to the lowercase 64-hex SHA-256 of its exact UTF-8 bytes. Normal sources require null ordinary staging. A forensic source may preserve occupied ordinary staging in its thirteenth value, while every target implicitly requires it to become null. `sourceIdentity` always means the canonical identity of the source's twelve semantic installation slots, including for a forensic source. The forensic rollback's separate `identity` binds its full record fields through `slotDigests`. Phase 11B-2 uses a private synchronous SHA-256 implementation so pre-bootstrap journal recovery stays synchronous. Standard empty/ASCII/Unicode/large vectors must match Web Crypto and a command-line implementation.

The validated rollback record has exact ordered keys `kind`, `version`, `createdAt`, `installation`, and `installationIdentity`. `kind` is `validated-previous-installation`, `version` is `1`, `createdAt` is a finite non-negative safe integer, and the identity matches the canonical installation. It is not a user-editable save and is never treated as a migration checkpoint.

When the preimage is blocked or corrupt, the rollback record instead has exact ordered keys `kind`, `version`, `capturedAt`, `slots`, `slotDigests`, and `identity`; `kind` is `forensic-previous-installation` and `version` is `1`. It preserves all thirteen exact source-slot values, including ordinary staging, and `identity` binds the canonical record fields before itself. It is download-only and is never offered as Restore unless its twelve installation slots independently pass the complete normal-bundle validation and staging is null. The UI calls this **Protected old data**, not **Previous save**.

The journal has exact ordered keys `kind`, `version`, `operation`, `transactionId`, `createdAt`, `sourceKind`, `sourceIdentity`, `sourceSlotDigests`, `target`, `targetIdentity`, `priorRollbackRef`, and `nextRollbackRef`. `kind` is `save-tool-transaction`, `version` is `1`, `operation` is `import`, `restore`, or `reset`, and `sourceKind` is `validated` or `forensic`. `transactionId` is produced through the captured ID adapter and must match `[A-Za-z0-9._:-]{1,128}`. `target` is the one full canonical target installation. The source is represented only by its identity/digest vector, then copied into rollback before any installation mutation. `priorRollbackRef` is either null or the exact object `{kind:'validated',ref:'target',createdAt:<original rollback createdAt>}`. `nextRollbackRef` is exactly `{kind:'validated'|'forensic',ref:'source',createdAt:<journal createdAt>}` with `kind` matching `sourceKind`; `createdAt` is used as `createdAt` for a validated source rollback or `capturedAt` for a forensic source rollback. This preserves enough metadata to reconstruct either exact rollback raw after a crash without embedding installation data twice. This is the only valid v1 topology: installation data is never redundantly embedded in source/prior/next fields. The parser applies the same 64-level depth and exact-key rules to both operational records and their current-schema installation payloads; opaque historical checkpoint strings remain lineage-bound bytes.

A malformed, unknown-version, identity-mismatched, or foreign rollback never blocks a valid current save from ordinary play. It makes Previous save unavailable and blocks import/reset/restore without overwriting the record. The player may download the exact raw record as diagnostics or use the separately confirmed owner-checked Forget flow. Validated rollback records are capped at `33,562,624` UTF-8 bytes; forensic rollback records are capped at `67,117,056` bytes; journals are capped at `33,562,624` bytes. These parser ceilings are defensive bounds, not storage-capacity promises.

## Journaled installation transaction

Import, restore, and recoverable reset use one transaction implementation.

1. Refuse concurrent activation while Save & Recovery is busy and read all fifteen slots twice; every second read must equal the first. Require null ordinary staging in the normal lane. The forensic blocked lane may preserve an exact twice-read occupied staging value as old data.
2. For the normal lane, require a current, unblocked, non-stale schema-11 runtime and validate the complete source and target installations in memory. For the forensic lane, import or reset may proceed from blocked/corrupt active data only after the exact twice-read source is constructed and validated in memory as a forensic rollback record and offered for diagnostic download; it is persisted only after the journal at step 8. Restore and Forget do not use this lane.
3. Refuse import/reset while a previous-installation or forensic rollback already exists. Offer separate Restore (only when validated), Download, and Cancel actions. Download never enables or performs deletion.
4. Refuse byte-identical source and target installations. Also refuse a target whose active bytes equal the source active bytes while any checkpoint differs, because active-last could not unambiguously commit it.
5. Build the source digest vector, one exact target installation, their canonical SHA-256 identities, and the exact version-1 journal. The journal carries the target once; the source remains in its unchanged physical slots until the exact source rollback record has been written and verified.
6. Immediately before the journal write, owner-check that the journal is still null and every captured source/rollback/installation byte is unchanged. Write and read-verify the journal. A quota failure here leaves zero changes.
7. Immediately before every later set or remove, verify the unchanged journal bytes/transaction ID and require that the destination equals its exact captured source value or is already the idempotent intended value. A third value blocks without overwrite.
8. Construct the intended source rollback from a fresh owner-checked source snapshot; write and read-verify it. If this fails before installation changes, restore the exact prior rollback (`target` for Restore, null otherwise), owner-check and clear the journal, and report insufficient storage without changing the installation.
9. For a forensic source, owner-check and remove ordinary staging first. Then write target checkpoint slots in deterministic oldest-to-newest order, applying the pre-write rule and verifying every write or removal. Write active last only after ordinary staging is null, all target checkpoints and intended rollback are verified, and active still equals the exact source.
10. Verify active immediately, then read all target installation slots twice, re-run schema validation and exact Phase 10C lineage authentication, and confirm the target identity.
11. Owner-check the unchanged journal bytes, remove it, verify null, and only then adopt the already-validated target state directly into the runtime. Do not call `load()` and do not run offline, Tower, Expedition, or other settlement during adoption.
12. Before confirmation, show an informational worst-case temporary footprint computed from the current slots, target installation, serialized journal, and rollback record. It is not a capacity promise. A quota failure after the journal exists invokes the same deterministic recovery algorithm. It either restores the exact source/prior rollback or completes the exact target/next rollback; it never clears its journal while mixed data remains.

No installation transaction reuses the ordinary mutation staging slot.

## Interrupted-operation recovery

Journal recovery runs before ordinary schema-11 bootstrap.

- If the complete installation already equals the journal source, restore/verify the prior rollback, then owner-check and clear the journal.
- If the complete installation already equals the journal target, complete/verify the intended next rollback, then owner-check and clear the journal.
- Otherwise active is the commit marker: exact source-active restores source/prior rollback; exact target-active completes target/next rollback. Source and target active bytes are required to differ. Recovery from a mixed installation requires the exact authenticated intended source rollback because the journal intentionally stores source digests rather than duplicate source bytes. If that rollback is absent or still equals the prior rollback, recovery blocks and preserves every byte. Any third active value blocks.
- Every installation or rollback slot must equal either its exact source value or exact target value. Any third value blocks, preserves all bytes, and presents export/recovery diagnostics.
- A malformed, foreign, future-version, or identity-mismatched journal blocks without cleanup.
- Every recovery write uses the same immediate journal-ownership and expected-destination checks as the originating transaction. Recovery restores the rollback side before source slots when reverting, so a failed larger target cannot strand the original installation behind quota pressure.
- Recovery writes remain fault-injectable. Repeated reloads must converge to exact source or exact target; a mixed installation is never adopted as normal. If storage remains insufficient, the blocked screen preserves the journal and all bytes and explains the storage requirement rather than entering a reload loop.

## Recoverable reset

Safe reset becomes a target bundle whose active state is the existing canonical schema-11 fresh state with the existing retained-checkpoint marker. Before constructing that marker, preserve the current `ensureRawBackup` rule: when `rawBackup` is null, the target `rawBackup` becomes the exact pre-reset active bytes; an occupied `rawBackup` remains byte-exact. `preV2` through `preV11` remain unchanged. The marker authenticates this exact resulting checkpoint set.

Before reset changes any installation slot, the exact pre-reset installation becomes the verified rollback value. “Restore previous save” must reproduce every byte of the pre-reset active and checkpoint slots, including Oaths/private fields, pending Gold, idle cursors, ledgers, receipts, economy profile, and timestamps.

## Restore and forget

- Restore uses the same transaction and swaps the current installation into rollback, providing one safe toggle back.
- `DOWNLOAD PREVIOUS SAVE` creates a normal recovery file whose twelve slot strings are byte-exact to the stored Previous save. `DOWNLOAD PROTECTED OLD DATA` creates a clearly labelled forensic diagnostic file instead. Neither action mutates storage or enables deletion.
- Forget removes only the rollback operational key.
- Forget requires a valid current installation, null journal, two exact rollback reads, an irreversible warning, and a second explicit confirmation. Immediately before removal it owner-checks the exact captured rollback bytes, then verifies null afterward. A mismatch refuses with zero writes.
- Individual automatic migration checkpoints never receive Restore, Replace, or Delete controls.

## Save health and migration history

The default Save & Recovery UI may show only safe summaries:

- present/missing;
- current, automatic migration checkpoint, previous installation, or unavailable;
- schema classification;
- byte size;
- saved timestamp;
- truncated save ID;
- revision and source;
- verified/recoverable/corrupt/unrelated status.

Raw payloads never render in the normal or Advanced DOM. Advanced may show only technical metadata, truncated identities, and storage-key names. Raw data is available only through an explicitly warned diagnostic download. File contents never go to the console, telemetry, network requests, clipboard, toast text, or browser history.

Player-facing **Update history** renders `saveMeta.appliedMigrations` in order with escaped friendly labels, from/to schema, applied time, migration source, and a small non-sensitive summary. Safe reset is shown separately as a recovery event because it is represented by retained checkpoint lineage, not a migration receipt.

## UX and accessibility

- Main controls use `DOWNLOAD RECOVERY FILE`, `CHOOSE RECOVERY FILE`, and `START A FRESH SAVE`. The intro says Everstead saves only in this browser, and a separate warning explains that recovery files contain private Oaths, memos, links, and full progress.
- Import begins with an explicitly labelled `.json` file input, then **Review recovery file** / **No changes yet**, then a separate **Replace your current save?** confirmation. The final action is `IMPORT AND REPLACE CURRENT SAVE`.
- The rollback-present surface is **Previous save already protected** and offers separate `RESTORE PREVIOUS SAVE`, `DOWNLOAD PREVIOUS SAVE`, and `CANCEL` actions. There is no combined download-and-delete action.
- Restore explains that the current save becomes Previous save, enabling a safe toggle back. Reset explains that the current save becomes Previous save and automatic checkpoints remain. Forget uses two explicit confirmation screens before `PERMANENTLY FORGET PREVIOUS SAVE`.
- Destructive controls use clear outcome wording, not generic OK/Cancel language.
- File contents and imported text never enter `innerHTML` unescaped.
- Validation failures use `role="alert"`; downloads and successes use a polite live announcement. Privacy and trust warnings are connected with `aria-describedby`.
- One original return-focus target is captured when the flow begins. Cancelling file selection, validation failure, preview replacement, both Forget confirmations, stale/refused transactions, successful runtime adoption, and blocked-boot recovery retain that target; rerendering a modal never replaces it. Every step focuses the named modal container, traps Tab/Shift+Tab, and Escape returns to the original trigger.
- `CHOOSE RECOVERY FILE` is the visible button/label for one visually hidden, explicitly labelled input with `accept="application/json,.json"`; cancelling the native chooser performs no action. The preview shows only filename, schema, revision, exported/saved time, formatted file and active sizes, checkpoint count, truncated save ID, and truncated digest. Its secondary action is `KEEP CURRENT SAVE`.
- `FORGET PREVIOUS SAVE` is a separate More-screen action, never combined with download. After successful Forget removes its own trigger, focus falls back to a programmatically focusable **Save & Recovery** heading. Forensic diagnostic download is offered but optional before a separately confirmed forensic import or reset. Outcome copy after an interrupted transaction must state whether the source was restored, the target completed, or recovery remains blocked.
- The final reset confirmation is `START FRESH SAVE AND PROTECT CURRENT SAVE`. A Previous-save download is named `everstead-previous-save-YYYY-MM-DD.json`; the current recovery download keeps the existing `everstead-recovery-YYYY-MM-DD.json` name.
- A stale preview says: **Your save changed after this preview. Nothing was replaced. Reopen Save & Recovery and try again.** A byte-identical file says: **This recovery file is already your current save. Nothing was changed.** A cross-tab refusal says: **Everstead changed in another tab. Reload before using Save & Recovery.**
- Repeated activation of import, restore, reset, or forget and any second action while busy are zero-write refusals.
- All new surfaces fit 320×568, 390×667, and 390×844 without horizontal overflow. At 320px, action buttons stack full-width, flex/grid children use `min-width:0`, filenames/statuses/identities wrap, and no horizontal table or raw `<pre>` payload is used.
- Success, refusal, stale, rollback-present, and recovery states remain understandable without color or symbols alone.

## Frozen behavior

Phase 11B must not change:

- `CURRENT_SCHEMA_VERSION=11` or any schema-11 state field;
- Phase 10C migration outputs, lineage identities, economy profile, rate formula, upgrade cost, offline settlement formulas, or 24-hour caps. One prerequisite guard correction is explicitly allowed: schema 11 must participate in the already-defined Companion Tower and Fellow Expedition elapsed settlement paths, which currently stop at schema 10 by mistake;
- reward identities, random salts, pity logic, Power formulas, Oath rewards, Prosperity, Player Rank, or unlock gates;
- Phase 11A Relic guidance, Power labels, five-minute summary threshold, top-bar wording, or legacy Quest handling;
- embedded assets;
- production fail-closed QA-bridge policy.

## Required command-line evidence

- A Phase 11A semantic-successor gate remains fully green while the sealed Phase 11A package stays byte-frozen. It explicitly supersedes only current-artifact identity, owned-path/topology, predecessor checksum, and old README/current-phase assertions that necessarily change for Phase 11B.
- Recovery bundle canonicalization and SHA-256 vectors.
- Strict parser duplicate-key, size, depth, key-order, type, digest, and schema rejection vectors.
- Zero-write proof for every invalid/inspection-only import.
- Current installation and target lineage validation vectors.
- Import, reset, restore, toggle-back, and forget success vectors.
- Fault injection before and after every journal, rollback, checkpoint, active, verification, and cleanup boundary.
- Reload convergence to exact source or exact target for every injected failure.
- Cross-tab changes and foreign-value interference in every between-read-and-write window block without overwrite, including journal creation, each installation/rollback mutation, recovery, and Forget.
- Quota failures before journal, after journal, after rollback, and during each installation direction preserve or reconverge exactly and produce a clear insufficient-storage refusal.
- A Restore fault after replacing an older rollback must revert with the prior rollback raw byte-identical, including its original `createdAt`.
- Exact round-trip of non-ASCII Oaths, notes, private memos, and links.
- No duplicate offline, Tower, or Expedition settlement after import/restore.
- The Phase 10C2 row that expected schema-11 Tower/Expedition cursors to remain unchanged during accrual is explicitly superseded. New evidence must prove both cursors advance exactly once with their existing 24-hour caps, and a same-time second accrual adds no entitlement.
- Five embedded assets remain byte-exact.

## Required live evidence

At 320×568, 390×667, and 390×844:

- Save & Recovery health and migration history render correctly.
- Download uses the expected name and verified bundle content in an isolated test adapter.
- Invalid file and cancelled preview make zero writes and return focus.
- Valid import preview shows safe escaped summaries and requires confirmation.
- Import, reset, restore, rollback-present refusal, and forget flows match the transaction contract in isolated memory storage.
- Interrupted-journal recovery is represented in at least source-active and target-active cases.
- The 320×568 run includes a maximum-length Unicode filename, large formatted values, all rollback-present actions, expanded Update history, and Advanced technical details.
- No horizontal overflow, inaccessible modal, warning/error console output, or native-storage access occurs in the test realms.

## Ship gate

Phase 11B passes only when both implementation steps are independently green, two reviewers report no blocker, the final worktree is clean, `main` fast-forwards, GitHub Pages deploys successfully, and the public `index.html` is byte-identical to the sealed production artifact.

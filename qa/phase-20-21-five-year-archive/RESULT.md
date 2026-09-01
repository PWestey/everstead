# Phase 20/21 five-year archive result

## Verdict

**FAIL — the accepted runtime is mechanically correct at five years, but its successor receipt-ownership authority is not bounded.**

This is a QA-only longevity finding against exact accepted commit `4a3a7472e4534485dfb86cd3c44a244d13c6fff5`. No production runtime, active worktree, merge, push, or deployment was changed.

The simulation ran from 2026-01-01 through 2031-01-01: 1,826 days, eight Phase 20/21 facilities, and eight claims per facility per day in a strict round robin. That produced 116,864 manual claims. Every claim performed an explicit pre-claim neutrality check, so no Gold, local progress, claim count, or archive sequence changed before the modeled manual Claim boundary. The accepted synthetic outcome contract separately fixes relationship progress and Gift applications at zero.

## Exact evidence

| Anniversary | Claims | Folded | Recent | Receipt ranges | Save projection bytes | Full-validation range visits |
|---:|---:|---:|---:|---:|---:|---:|
| Start | 0 | 0 | 0 | 0 | 3,818 | 0 |
| Year 1 | 23,360 | 22,912 | 448 | 23,360 | 542,446 | 23,368 |
| Year 2 | 46,720 | 46,208 | 512 | 46,720 | 902,260 | 46,728 |
| Year 3 | 70,144 | 69,632 | 512 | 70,144 | 1,230,208 | 70,152 |
| Year 4 | 93,504 | 93,056 | 448 | 93,504 | 1,525,885 | 93,512 |
| Year 5 | 116,864 | 116,352 | 512 | 116,864 | 1,920,663 | 116,872 |

Correctness passed after JSON serialize/reload at every anniversary and at the final state:

- exact eight-facility claim counts: 14,608 each;
- exact local progress: Command 29,216; Archives 43,824; Training 73,040; Hearth 102,256; Gatehouse 160,688; Workshop 189,904; Gardens 248,336; Forge 277,552;
- exact final Gold: 13,556,224;
- exact Phase 15 archive: 909 folds, `throughSequence = receiptCount = 116352`, and 512 recent receipts;
- exact folded Gold: 13,496,832;
- exact last-receipt sequence/domain identity for every facility;
- exact disjoint global ownership of sequences 1–116,864;
- exact one-range domain ownership per facility;
- 116,864 of 116,864 resource-neutral pre-claim checks;
- no unsafe-integer, reload, count, local-progress, last-receipt, reward, or ownership error.

The final serialized archive-bearing save projection SHA-256 was `23e305fd680535a2d4c0ca929d1f9c6287ab2c8f78b3aeeade0c1914044cc86d`.

Both required runs produced the same deterministic evidence SHA-256: `5534852ef786b86177ec100f4e8f08c3b9686d90a3a19197b203322591e08615`.

The final two post-fixture runs produced these informational timings; they are not the correctness authority:

- run 1: 1,125.910 ms simulation; final validation 83.075 ms;
- run 2: 1,121.481 ms simulation; final validation 88.470 ms.

## Failed budgets

| Gate | Budget | Actual | Result |
|---|---:|---:|---|
| Persisted receipt-ownership units | ≤ 544 | 116,864 | FAIL |
| Archive-bearing save projection | ≤ 1,048,576 bytes | 1,920,663 bytes | FAIL |
| Year-five growth after archive saturation | ≤ 65,536 bytes | 394,778 bytes | FAIL |
| Full-validation range visits | ≤ 544 | 116,872 | FAIL |

The archive itself behaves correctly and remains capped. The fragmentation lives in `successorClaimAuthorityByFacilityId[*].claimedReceiptSequenceRanges`: strict interleaving prevents adjacent sequences for the same facility from merging, so every claim becomes one persistent singleton range. Each facility ends with 14,608 receipt fragments, a 100% fragment-to-claim ratio.

The accepted claim path also validates the complete successor authority and re-identifies the growing row before persistence. One required full-authority scan per claim therefore has a deterministic lower bound of 6,828,538,816 accumulated prior-range visits across this workload, before counting range cloning/sorting, repeated validation, identity serialization, or JSON persistence. The generator uses constant-time equivalent appends so the QA probe itself remains bounded; it does not hide this production cost.

## Recommended bounded checkpoint schema

Do not ship the current receipt-range authority at production cadence. A focused Phase 15 archive migration should be designed before this runtime is enabled:

1. Version the Phase 15 claim archive checkpoint (candidate: `claim-archive.phase-15.v2`) and the Phase 20/21 successor authority (candidate: `phase-20-21-canonical-claim-authority-v3`).
2. Add a bounded checkpoint map keyed by canonical `(sourceType, sourceId, facilityId)`. Each entry needs only `receiptCount`, `latestSequence`, and an identity. Keep the existing global aggregate rewards and source-type totals authoritative.
3. Remove folded receipt sequences from successor rows. Exact ownership above the checkpoint is already present in the bounded `recentReceipts` window and can be derived by filtering its maximum 512 entries.
4. Preserve `claimedDomainOrdinalRanges`, `claimCount`, `localProgress`, and `lastReceipt`. Domain ordinals remain the replay-prevention authority and compact to one range in the exercised lifecycle; `lastReceipt` preserves the most recent full proof even after folding.
5. On every 128-receipt Phase 15 fold, update the bounded per-source checkpoint entries while processing that same fixed batch. Future validation becomes `checkpoint count + matching recent receipts = claimCount`, with latest sequence checked against `lastReceipt`.
6. Validate that the per-source checkpoint counts sum to the global checkpoint receipt count for covered source classes, and that the existing aggregate reward/source-type totals remain exact. Do not reconstruct caller-controlled rewards.

## Migration and validation strategy

The migration must be additive, transactional, and fail closed:

1. Accept the old authority only at the migration boundary and run the complete existing V2 validation first, including disjoint global sequence ranges, checkpoint/recent partition, exact last receipts, identities, counts, and domain containment.
2. For each facility, count old receipt ranges through `archiveCheckpoint.throughSequence` using range widths, without expanding ordinals. Capture the greatest folded sequence and reconcile `folded count + matching recent count = claimCount`.
3. Build the fixed-key checkpoint map from those validated counts/latest sequences. Derive current-window ownership only from canonical recent receipts.
4. Preserve all balances, local progress, domain ranges, last receipts, archive sequences, recent receipts, and global aggregates byte-for-byte except for the explicitly versioned authority/checkpoint fields.
5. Record one migration receipt containing the pre-migration checkpoint identity, all pre-migration authority identities/counts, the new checkpoint identity, and the new authority identities.
6. Validate the complete V3 state before committing. Reject mixed V2/V3 keys, unknown facilities/sources, count disagreement, latest-sequence disagreement, duplicate recent ownership, reward mismatch, or an identity mismatch.
7. Make the migration ID write-once and idempotent. A second run must be byte-stable. Any failure must leave the original V2 save available for recovery/export and perform zero active writes.

This recommendation is a schema proposal only. No runtime redesign was implemented in this branch.

## V3 acceptance criteria

A proposed V3 is not accepted until all of the following are demonstrated twice from clean fixtures:

- The same 116,864-claim, five-calendar-year round robin preserves every exact count, local-progress total, last receipt, domain replay barrier, global reward total, recent receipt, and pre-claim neutrality invariant.
- Persisted receipt-ownership units are at most 544, the archive-bearing save projection is at most 1 MiB, year-five growth is at most 64 KiB, and one full validation visits at most 544 bounded ownership units.
- The Phase 15 global checkpoint and successor fold checkpoint always cover the same `throughSequence`; the recent archive begins at exactly `throughSequence + 1` and ends at `nextSequence` without a gap or duplicate.
- Per-facility `claimCount` equals the trusted migrated/activation baseline plus folded count plus exact matching recent count. Local progress equals the approved per-claim amount times the applicable post-baseline count.
- Every recent successor receipt belongs to exactly one known facility/source row. Unknown, duplicate, cross-facility, pre-baseline, or mismatched receipts reject before adoption.
- `claimedDomainOrdinalRanges` remain exact, contained in the Phase 15 facility row, and sufficient to reject replay after every receipt has folded.
- Zero-claim rows require null latest/last proofs. Nonzero rows require the exact latest recent receipt when one exists and a valid folded high-water/proof otherwise.
- Fold batches containing mixed Story, Legacy, Phase 15–19 facility, and Phase 20/21 receipts update only the correct bounded rows and keep all existing Phase 15 aggregate totals byte-correct.
- V2 migration succeeds for recent-only, partially folded, fully folded, and interleaved histories without expanding ordinal widths; it rejects corrupt/overlapping ranges, source mismatches, stale identities, impossible high-water marks, and mixed V2/V3 shapes with zero active writes.
- Migration is write-once, idempotent, save-bound, and recovery-safe. A second migration produces zero writes and identical bytes; export/reload/import preserve one authority.
- Fold/update/finalize fault probes at every boundary are atomic. Two-client claim/fold races produce one winner, one zero-write loser, one domain claim, one receipt, and one checkpoint increment.
- Validation cost and serialized size plateau after the recent window saturates; adding another simulated year does not restore linear growth.

## Review traps for a Phase 15-owned successor checkpoint

The proposed direction—an activation baseline, one archive-aligned through-sequence, exact per-facility folded counts, recent receipts as exact current-window authority, and save-bound identity—is sound if the following traps are resolved:

- The successor checkpoint coverage must equal the Phase 15 archive checkpoint `throughSequence`. Advancing either side independently creates an unverifiable gap or double count.
- Update successor folded counts, the global checkpoint, its identity, and the recent-receipt splice in one draft transaction. A fold failure must not leave any partially advanced authority.
- Key exact rows by `(sourceType, sourceId, facilityId)`. `opportunity.facility.activity` is shared by earlier facilities, so the eight successor counts must not be required to equal the global source-type total.
- The activation baseline must exclude any earlier claims sharing a source/facility identity. Migration after activation needs explicit provenance for both the original activation sequence and the migration checkpoint.
- A V2 save whose old receipts are already folded cannot reconstruct a full “latest folded receipt”: Phase 15 discarded those bodies. V2 ranges can prove the greatest folded sequence, but not all receipt fields. Store `latestFoldedSequence`, or define an explicit migration-era unavailable proof. Never synthesize a historical receipt. Full folded receipt retention can begin prospectively after migration if it is genuinely needed.
- If a matching recent receipt exists, `lastReceipt` must equal the greatest one exactly. Otherwise its sequence must agree with the folded high-water/proof. `lastReceipt` must not become a second competing ownership ledger.
- A fold batch can contain Story, Legacy, Restaurant, Apothecary, Schoolhouse, and successor receipts. Only exact successor identities after the activation baseline may affect the new per-facility checkpoint.
- Counts/latest-sequence fields cannot independently re-prove historical disjointness. The trust boundary is: fully validate V2 once, migrate without ordinal expansion, identity-bind the result to the save, and thereafter fold the one canonical global stream exactly once.
- Domain ordinal ranges remain the exact replay barrier. The new checkpoint must not weaken facility/source/domain checks merely because old global receipt sequences are summarized.
- Enforce exact known keys, safe integers, fixed facility/source identity, null iff zero rules, and byte-stable idempotence. Reject mixed V2/V3 rows and unknown future rows until a later versioned migration handles them.

## Accepted-source hashes

- `index.html`: `b44ddeb1711700df12a90932b711661c5041143a5f2a7b936faabce31f89c103`
- `src/phase15-facilities.js`: `29888a098a1cfea01282bf59739673b4c910e2133ceb01d29d78e20422811fd7`
- `src/phase20-21-facilities.js`: `51f9f7b0b4fd1a5bfe4aa5b9f09ec30e251eefedbb0eae25a6911d5c3cc7de8b`
- `src/phase20-21-runtime.js`: `755ce7edf645c512d39c52783ff66b26dbaaf2826bd4f2dff93b32e96508fbbd`
- `design/phase-20-21/fixtures.json`: `a5342f7f8493151f5116cb386814e6920452a3dbd098a9d75ed40b8813bd18f1`

# Phase 20/21 bounded V3 longevity result

## Verdict

**PASS.** The exact source-pinned bounded model passes all 16 frozen invariants twice. The focused production verifier passes 36/36, the supplementary writer longevity gate passes 12/12, and the real browser gate passes 1,060/1,060 twice across six active realms plus the production-off realm.

This package is QA and documentation only. It does not modify the production runtime, the active writer worktree, a merge, a push, or a deployment.

## Frozen workload

- Five calendar years: 2026-01-01 through 2031-01-01, 1,826 days.
- Eight successor facilities, eight claims per facility per day, strict global round robin: 116,864 successor claims.
- 512 pre-activation predecessor receipts and 28 later predecessor receipts interleaved every 4,096 successor claims.
- Actual Phase 15 archive constants: 512 recent receipts and exact 128-receipt predecessor-triggered fold batches.
- Adversarial out-of-order domain claims within each facility's bounded bank capacity.
- Every successor claim checks that Gold, local progress, claim count, and global receipt sequence remain unchanged before the manual Claim boundary.

## Independent model evidence

| Anniversary | Successor claims | Folded receipts | Recent receipts | Save projection bytes | Validation visits |
|---:|---:|---:|---:|---:|---:|
| Activation | 0 | 0 | 512 | 233,645 | 544 |
| Year 1 | 23,360 | 23,424 | 453 | 244,722 | 501 |
| Year 2 | 46,720 | 46,848 | 395 | 214,943 | 439 |
| Year 3 | 70,144 | 70,272 | 401 | 218,129 | 450 |
| Year 4 | 93,504 | 93,568 | 470 | 254,925 | 516 |
| Year 5 | 116,864 | 116,992 | 412 | 225,756 | 452 |

Final model facts:

- 914 exact archive folds: four predecessor-only, 28 mixed, and 882 successor-only;
- 116,452 folded successor claims plus 412 exact recent successor receipts equals 116,864;
- exact successor Gold 13,556,224 and global Gold 13,556,764 including predecessor rewards;
- 116,864 resource-neutral pre-claim checks;
- maximum domain fragments by facility: 2, 3, 3, 4, 4, 5, 5, and 6, each no greater than that facility's bank capacity plus one;
- final serialized projection 225,756 bytes, SHA-256 `27e8423dc4b3322e0b7406cf1a4fda7c8fcdf34ad78bb942332d3a118c4f040f`;
- peak incremental size 44,833 bytes, below the exclusive 1 MiB budget;
- year-five size change -29,169 bytes, below the 64 KiB growth budget;
- final validation 452 visits, below the fixed 604-visit budget.

The independent model-only deterministic evidence SHA-256 is `2e4c6ea63999156ac125debba4a90c05d7bbcbc5b1dcf1c40577808bfb476ee3` in both model-only runs. The final source-pinned deterministic evidence SHA-256 is `cf7fd41c30bc474a05ca6d64d3e2478efb2a14e1c3ef099709fa321fd86b0062` in both candidate runs. The focused verifier output SHA-256 is `e71eb469ee2c2d6093e919026b98bd259a5955793fec7b44cbb71da56f206197` in both candidate runs. Timing is reported separately and is not part of either deterministic evidence hash.

## Sixteen frozen invariants

1. At least 116,864 strict interleaved successor claims.
2. Exact predecessor-only, mixed, and successor-only 128-receipt folds.
3. Exact fixed eight-key authority, folded-count, and latest-proof maps.
4. An immutable activation floor excludes every predecessor receipt.
5. Exact recent-plus-folded per-facility and global conservation.
6. JSON reload validates at activation, every anniversary, and year five.
7. Export/import validates and a corrupt payload identity rejects.
8. Re-running activation is byte-stable and write-free.
9. Safe-integer overflow rejects without a throw or mutation.
10. Missing or extra checkpoint-map keys reject.
11. Activation-floor or migration-anchor drift rejects.
12. Malformed, cross-row, stale, or re-identified folded proofs reject.
13. Adversarial domain fragments remain bounded by outstanding bank capacity plus one.
14. Peak incremental archive-bearing save size remains below 1 MiB.
15. Year-five serialized growth remains at or below 64 KiB.
16. One validation visits only fixed maps, bounded domain fragments, and at most 512 recent receipts.

## Production-source evidence

The frozen focused verifier and production realm cover the following actual production requirements:

- the production Phase 15 constants remain exactly 512/128 and the wrapper repeatedly crosses the real 513th-receipt boundary;
- one predecessor-triggered fold removes zero successor receipts and a mixed fold removes both predecessor and successor receipts while advancing the observed through-sequence exactly;
- a fold/checkpoint fault or stale checkpoint performs zero reward/resource changes, zero storage-adapter set/remove operations, restores the complete pre-call persisted bytes, and retains the expected fail-closed diagnostic entries;
- activation floor and folded-through are anchored to the write-once migration receipts, and drift rejects;
- recent and latest-folded receipts require row-local facility/domain containment;
- substituting a stale latest proof without refreshing every bound identity rejects;
- public-release and production-enabled flags remain false, and an unauthorized runtime cannot create or retain synthetic claims;
- the production validator performs one bounded recent-window classification pass rather than re-scanning the 512-entry window once per facility.

The candidate is anchored to exact production commit `cbb3ac8d14f3dc610c6ffbefba7fd09f0fbf72cb`, whose parent is accepted base `4a3a7472e4534485dfb86cd3c44a244d13c6fff5`. Exact production and QA source hashes, required focused-check IDs, focused-output identity, browser totals, and deterministic model expectations are frozen in `fixture-v3.json`. The key source identities are:

- `index.html`: `998ea7205cc67e0c8acf0267897d142a5ff1c1a7fdf0c4ee35862534d962dbe4`;
- `src/phase20-21-runtime.js`: `b6894ef6b7b031c4acf6457b658e99b996a816ca9900d7b12e7d711d5e41dc62`;
- `src/phase20-21-presentation.js`: `f47665145a49ff90254a863d73aa02c18cb340179c1159ebbe5c9a240a021ce9`;
- `qa/phase-20-21-ui/realm.js`: `e780f90eeb15fbe6c01baa64a29457ccb12f290ec8b9cefdcaf9799b770046dc`.

The live browser evidence covers 320×568, 390×844, 430×932, 768×1024, 1024×768, and 390×844 at 130% text with reduced motion, plus an inactive production-off realm. Both runs passed 1,060/1,060 with no failed assertion, warning/error console entry, or native-storage access.

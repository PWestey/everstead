# Everstead Phase 5 Result

Status: **CLI PASS — LIVE REVALIDATION PENDING** at production tip `bb6a94d6050e77f9810621edb05585adeff465cf`.

## Accepted scope

- Base: `48fcc560336b3e716c728c818fe22274f2f2b410`
- Contract commits: `7d270c8b7d168744e0bca21db19a38276edfe7a1`, `8cda682088143624da850e0780dc621f50ea7357`, `96aac14891314d4d15e7fd63718d28a337ce3bcc`, `bdc4efe78ec76c54dfc3ac4168a2c09a7eca1878`, `8e0026ebc371e887695415306400d06a7b65a581`
- Initial production commit: `1968fd4f85003449abfcff93c0f9a8c0a44e7f81`
- Initial persistence/Campaign hardening: `92d400ea9e88162f845519b8d5e31ef771bac282`
- Final slot-attestation, reset-archive, and reduced-motion hardening: `bb6a94d6050e77f9810621edb05585adeff465cf`

## Gate result

- Phase 5 CLI: `1136/1136`, twice.
- Phase 4 semantic successor: `410/410`, twice, with seven intentional supersessions.
- Checksums: `14/14`, twice; all 118 historical artifacts remained byte-frozen.
- Superseded-tip live Chromium: `482/482`, twice at `c9a250fd10542848a9ceafb193e6441657767c4e`, with blank fatal output and zero warning/error console entries.
- Refreshed live Chromium: pending on this candidate. The expanded runner expects `536` rows and now executes real production run buttons in both normal-motion and reduced-motion realms.

## Migration semantics

Schema 6 adds one exact pre-v6 checkpoint to the seven-slot Phase 4 persistence set. A schema5 source is retained byte-for-byte. Schema0–4 sources retain the deterministic canonical schema5 intermediate, including its existing migration receipt IDs and timestamps, so an interrupted later-clock retry can authenticate and reuse the exact bytes. The schema-5-to-6 receipt is assembled from exact post-write reads and binds every permanent slot plus its canonical migration source; schema0–5 immediate reload, later mutation, and every interruption retry retain exact receipt-to-slot identity. Altered, missing, lone, evolved, or foreign-source predecessor material fails closed without writes.

Safe reset now records a durable exact identity for every retained checkpoint, including null slots, plus the independent pre-reset active raw identity/save ID/revision. It can replace a valid current state blocked by raw-backup or pre-v6 whitespace, semantic, foreign, or malformed archival bytes without parsing or trusting them. The marker survives ordinary mutations and authenticates pending current-base or already-committed reset staging across the complete fault/retry matrix; the exact archives remain immutable. Fixture installation also rolls back all eight slots and the complete runtime/UI snapshot when any post-write boot read fails or leaves persistence blocked.

The committed verifier exercises all 12 initial protected-slot reads, all 12 backup/checkpoint writes and verifies, all six receipt-assembly reads, every staging/active/cleanup boundary including owner and cleanup verification, and the corresponding safe-reset boundaries. Each retry proves zero-or-once schema-6 receipt creation, exact preservation of every already-written slot, exact receipt-to-live-slot identity, and clean staging.

Legacy Story progress seeds position only. `mappedOrdinal` is the clamped integer Story stage from 1 through 10; only stages strictly before it are cleared and first-clear-consumed. The mapped stage remains uncleared and reward-eligible, including legacy values at or beyond stage 10. Every migrated Player begins Rank 1 with zero Rank EXP, and migration invents no Fellow EXP, shards, Gifts, Gold, or Rank rewards.

## Gameplay result

The Wayfarer Player and Rank foundation now anchor a ten-stage Fellow Campaign. Total Fellow roster Power controls eligibility and the existing campaign efficiency discount. First clears and replays have distinct previews and atomic, persisted outcomes: Gold cost, targeted Fellow EXP, targeted shards, Gift roll, and first-clear Rank EXP. Rank 2 unlocks replay without blocking first-clear progression.

Each run receipt is derived from its save, stage, pre-run ordinal, salt/version, first-clear state, costs, roster snapshot, and deterministic rewards. The migration baseline, clear prefix, run ordinal, exact Rank EXP, Rank-2 replay gate, and last-receipt lineage are validated together. Reloads cannot duplicate cost or rewards, and forged clear/replay ledgers or receipt fields fail validation. Normal motion shows the persisted result after the walking encounter; reduced motion detects the preference through a captured guarded selector and presents the same persisted result synchronously with no running animation or presentation timer.

## Intentional supersessions

- Schema 5 current → schema 5 exact pre-v6 checkpoint; schema 6 current.
- Seven protected persistence slots → eight.
- Active legacy Story resolver and Resolve/reward channels → canonical Fellow Campaign.
- Story card/tab presentation → ten Broken Roads nodes with walking-stage presentation.
- No central Player progression → Wayfarer Rank foundation and Rank 2 replay gate.
- Legacy total/story reward semantics → total-roster efficiency plus targeted Fellow rewards.
- Phase 4 diagnostics/export → additive Player, Campaign, receipt, and pre-v6 evidence.

## Residual risks

Web Storage still lacks compare-and-swap, Phase 10 must tune provisional campaign values, and real-device/Safari validation remains outside the Chromium gate. Advanced animation, audio, story, Relics, and retired/deferred modes remain deliberately absent.

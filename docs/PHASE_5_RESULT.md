# Everstead Phase 5 Result

Status: **PASS — FINAL CANDIDATE** at production tip `1968fd4f85003449abfcff93c0f9a8c0a44e7f81`.

## Accepted scope

- Base: `48fcc560336b3e716c728c818fe22274f2f2b410`
- Contract commits: `7d270c8b7d168744e0bca21db19a38276edfe7a1`, `8cda682088143624da850e0780dc621f50ea7357`, `96aac14891314d4d15e7fd63718d28a337ce3bcc`, `bdc4efe78ec76c54dfc3ac4168a2c09a7eca1878`, `8e0026ebc371e887695415306400d06a7b65a581`
- Production commit: `1968fd4f85003449abfcff93c0f9a8c0a44e7f81`

## Gate result

- Phase 5 CLI: `535/535`, twice.
- Phase 4 semantic successor: `410/410`, twice, with seven intentional supersessions.
- Checksums: `14/14`, twice; all 118 historical artifacts remained byte-frozen.
- Live Chromium: `298/298`, twice, both configured mobile sizes, blank fatal field, zero failed rows, zero native-storage calls, and zero warning/error console entries.

## Migration semantics

Schema 6 adds one exact pre-v6 checkpoint to the seven-slot Phase 4 persistence set. A schema5 source is retained byte-for-byte. Schema0–4 sources retain the deterministic canonical schema5 intermediate, including its existing migration receipt IDs and timestamps, so an interrupted later-clock retry can authenticate and reuse the exact bytes.

Legacy Story progress seeds position only. `mappedOrdinal` is the clamped integer Story stage from 1 through 10; only stages strictly before it are cleared and first-clear-consumed. The mapped stage remains uncleared and reward-eligible, including legacy values at or beyond stage 10. Every migrated Player begins Rank 1 with zero Rank EXP, and migration invents no Fellow EXP, shards, Gifts, Gold, or Rank rewards.

## Gameplay result

The Wayfarer Player and Rank foundation now anchor a ten-stage Fellow Campaign. Total Fellow roster Power controls eligibility and the existing campaign efficiency discount. First clears and replays have distinct previews and atomic, persisted outcomes: Gold cost, targeted Fellow EXP, targeted shards, Gift roll, and first-clear Rank EXP. Rank 2 unlocks replay without blocking first-clear progression.

Each run receipt is derived from its save, stage, pre-run ordinal, salt/version, first-clear state, costs, roster snapshot, and deterministic rewards. Reloads cannot duplicate cost or rewards, and forged receipt fields fail validation.

## Intentional supersessions

- Schema 5 current → schema 5 exact pre-v6 checkpoint; schema 6 current.
- Seven protected persistence slots → eight.
- Active legacy Story resolver and Resolve/reward channels → canonical Fellow Campaign.
- Story card/tab presentation → ten Broken Roads nodes with walking-stage presentation.
- No central Player progression → Wayfarer Rank foundation and Rank 2 replay gate.
- Legacy total/story reward semantics → total-roster efficiency plus targeted Fellow rewards.
- Phase 4 diagnostics/export → additive Player, Campaign, receipt, and pre-v6 evidence.

## Residual risks

Web Storage still lacks compare-and-swap, the documented interrupted safe-reset edge remains fail-closed, Phase 10 must tune provisional campaign values, and real-device/Safari validation remains outside the Chromium gate. Advanced animation, audio, story, Relics, and retired/deferred modes remain deliberately absent.

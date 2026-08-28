# Everstead Phase 2 Result

Status: PASS — clean Phase 2 candidate evidence recorded on the focused implementation branch.

Implemented scope:

- schema 3 with exact write-once schema-2 checkpoint and deterministic legacy/schema-1/schema-2 lineage;
- canonical EXP, Level, rarity, per-character shards, Bond, and empty Relic slots for all six owned Fellows;
- one inspectable Power pipeline, neutral deferred hooks, exact owned-roster total, and capped Phase 5 Campaign efficiency preview;
- Type and Role separation, Fellow progression cards/profiles, shard ascension, and Phase 4-neutral Companion bindings;
- authorized isolated EXP/shard grants and five-slot safe fixture/export/diagnostic coverage;
- additive CLI, Phase 1 successor, checksum, and two-size live browser contracts.

The visible Fellow Train/Prestige and static Companion/Family Power claims are superseded. The Training Grounds remains an unchanged Building name. Family and Companion save data remain intact for their scheduled later migrations.

Expected Phase 1 successor supersessions are limited to current artifact identity, schema/current-checkpoint identity, Fellow Training/Prestige/static Companion UI, and Phase 2 browser-current realm identity. Every semantic supersession has a passing Phase 2 replacement in `qa/phase-2/verify.mjs` or the live runner.

## Frozen evidence

- Base: `de41734692be4ff1760ae62f6a65467e0f25527a`.
- Production commit: `2e2cf496ebccec1e3e922942990d5030b6fd041d` (`feat(phase-2): migrate Fellow progression`).
- Current `index.html`: SHA-256 `ac9ad9dde2da75e14b84bec07708c0bc4eec6259417756fd42afe1c500e7065a`; 18,375,175 bytes.
- Embedded asset-line aggregate: SHA-256 `9d6c4dd1867b9973f27ea8199fb3ce24ba6f99804269fa9218499797e9eefe78`; 3 lines; 18,229,348 bytes, identical to the Phase 1 base.
- Historical freeze: 78 pre-existing docs/QA files verified byte-for-byte.
- Phase 2 CLI: 311/311 twice.
- Phase 1 successor: 244 inherited assertions pass plus 12 documented replacements, with zero unexpected failures and zero missing replacements, twice.
- Phase 2 checksum sweep: all 13 entries pass twice.
- Live in-app Chromium: 312/312 twice across 320×568 and 390×844; fatal output blank; zero failed result rows; zero warning/error console entries. The browser-control evaluation realm could read the rendered counters and result rows but not the page-global result object, so the recorded evidence is the directly observed DOM and console state.

Migration retries were exercised at schema-2 checkpoint read/write/verify, staging write/verify, active conflict/write/verify, and cleanup boundaries. Later-clock retries preserve exact v0/v1/v2 checkpoints, remove only owned staging, and keep each migration receipt singular. Foreign, invalid, and valid-but-unrelated checkpoint/staging payloads remain byte-exact and cause zero writes.

Residual risk: Web Storage offers no atomic cross-tab compare-and-swap. Existing revision, raw-identity, storage-event, and staging checks reduce but cannot eliminate that platform limitation.

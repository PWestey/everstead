# Everstead Phase 4 Result

Status: **PASS — FINAL ACCEPTANCE** at production tip `cea60986dee6185c7319224752b877e4c7917546`.

## Accepted release

- Base: `165d18aaab66370ac959670ef1c7284c6ec95a3c`
- Production commits: `e9b38ee3e870da8832cd92d2bcbb9ef852e92ddb`, `abe3fc5a72dd4585b57d11f1f72548c9411e256e`, `cea60986dee6185c7319224752b877e4c7917546`
- Independently reviewed package: `999163d8c7ed588652ce3ee17d98d312828b9a5b`.

## Gate result

Phase 4 production passed every required release gate:

- Phase 4 CLI: 460/460.
- Phase 3 semantic successor: 361/361 with six itemized supersessions.
- Live Chromium: 290/290 twice, both configured mobile sizes, blank fatal field, zero failed rows, and zero warning/error console entries.
- Checksums: all 14 Phase 4 package entries pass twice.
- Independent Companion design/math/UI review: PASS, including 467/467 expanded probes.
- Independent persistence/migration review: PASS, including 530/530 original and 555/555 expanded adversarial probes.

## Migration semantics

Every valid schema-4 Companion binding migrates to Level 1, zero EXP, rarity 1, zero shards, and the corresponding `assignedFellowId`. Definition order owns collision resolution: Bramble precedes Cinderwing, so a shared legacy target remains with Bramble and Cinderwing becomes unassigned. The exact collision pair is retained on the one schema-4-to-5 receipt and rendered as an informational Companion-roster notice.

The new pre-v5 slot is a write-once exact schema-4 raw checkpoint. A current schema-5 state carrying the schema-4-to-5 receipt is accepted only with that exact checkpoint. An authenticated pending schema-5 migration stage may first reconstruct the checkpoint from the still-active exact schema-4 predecessor; if that predecessor is missing or already replaced, a missing checkpoint is refused. Its ordered collision ledger must equal the deterministic reconstruction from the checkpoint. Shape-valid false, reordered, extra, or omitted ledgers are refused safely. Empty and real collision ledgers reload normally, including every interrupted migration retry.

Schema0–4 migration and missing-active recovery retain every earlier checkpoint. Valid predecessor-only Companion IDs and Unicode remain exact in those protected bytes while schema 5 is rebuilt to the exact configured Bramble/Cinderwing key set. The seven-slot preflight rejects foreign or inconsistent material without active/staging writes. Historical Phase 3 pending and committed `companion-binding` staging remains compatible, including an interrupted durable active write.

The destructive QA fixture installer now refuses before its first write whenever any active, backup, checkpoint, or staging preimage read fails. All seven read-fault positions are covered for both replacement and removal payloads with exact storage, runtime, revision, and UI preservation and a slot-specific error.

## Gameplay result

Bramble and Cinderwing now have independent cumulative EXP, derived Level, rarity, character-specific shards, Power, and free one-to-one Fellow assignments. Companion Power is base × Level × rarity × neutral Mastery, rounded once. An assigned Fellow receives 40% of the Companion's unrounded Power at the existing Companion pipeline step. Cards, profiles, assignment previews, Fellow profiles, diagnostics, export, and isolated QA actions all expose the live model. Companion assignment never changes Building production.

## Intentional supersessions

- Schema 4 current → schema 4 exact pre-v5 checkpoint; schema 5 current.
- Six persistence slots → seven slots.
- Neutral Companion hook → Power-derived transfer.
- Legacy `{bound}` → canonical nullable one-to-one `assignedFellowId`.
- Static Companion preview/perk copy → live progression, Power, assignment, and ascension UI.
- Phase 3 diagnostics/export → additive Companion and pre-v5 evidence.

## Residual risks

Web Storage still lacks compare-and-swap, the documented interrupted safe-reset edge remains fail-closed, and real-device/Safari validation remains outside the Chromium gate. Phase 6 systems are deliberately absent.

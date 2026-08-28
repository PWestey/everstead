# Everstead Phase 4 Result

## Candidate

- Base: `165d18aaab66370ac959670ef1c7284c6ec95a3c`
- Production commits: `e9b38ee3e870da8832cd92d2bcbb9ef852e92ddb`, `abe3fc5a72dd4585b57d11f1f72548c9411e256e`
- Package tip: this result is frozen in the final Phase 4 QA/docs commit; the exact SHA is reported at handoff.

## Gate result

Phase 4 production is implemented and the local evaluated gates are green:

- Phase 4 CLI: 412/412.
- Phase 3 semantic successor: 361/361 with six itemized supersessions.
- Live Chromium: 290/290 twice, both configured mobile sizes, blank fatal field, zero failed rows, and zero warning/error console entries.
- Checksums: all 14 Phase 4 package entries pass twice.

## Migration semantics

Every valid schema-4 Companion binding migrates to Level 1, zero EXP, rarity 1, zero shards, and the corresponding `assignedFellowId`. Definition order owns collision resolution: Bramble precedes Cinderwing, so a shared legacy target remains with Bramble and Cinderwing becomes unassigned. The exact collision pair is retained on the one schema-4-to-5 receipt and rendered as an informational Companion-roster notice.

The new pre-v5 slot is a write-once exact schema-4 raw checkpoint. Schema0–4 migration and missing-active recovery retain every earlier checkpoint. The seven-slot preflight rejects foreign or inconsistent material without active/staging writes. Historical Phase 3 pending and committed `companion-binding` staging remains compatible, including an interrupted durable active write.

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

# Companion artwork and profile presentation

Date: 2026-09-05. Parent: 052684c97b1f9319a6d4aa8e6c2a49f2e85d1e8e.

## Scope and authority

The user explicitly requested public installation/upload of the Companion art, superseding the handoff's private-build restriction for these portraits only. This permission does not establish ownership or third-party intellectual-property rights. Historical private-build documents are retained as historical records; unrelated private feature gates remain unchanged.

All 20 source masters were checked against the catalog SHA-256 values before conversion. Full portraits retain 1024×1536 dimensions and backgrounds. Separate 320×480 thumbnails reduce roster loading costs. The forty WebP derivatives live under assets/portraits/companions; source PNGs, ZIPs, and contact sheets are not added. Zacian uses Hero of Many Battles; Mabosstiff retains its correct spelling.

## Screenshot-inspired changes

- Illustrated five-tab Companion profile dock, green/gold parchment panels, full sanctuary portraits, and assigned Fellow portrait.
- Tower scene with completed/current/next floor presentation and decorative Companion portraits. The portraits do not select a combat team: total owned-roster Power remains authoritative.
- Existing EXP wallet spending, rank/shard costs, assignment handlers, Mastery, manual claims, schema, storage key, and offline rules are unchanged.
- Metamorphosis/reroll mechanics and a new dispatch system are not introduced.

## Verification

- Public gameplay browser suite: 30/30, including banked EXP, explicit spending, cancel refusal, exact reward accounting, reload, and no page errors.
- Companion art suite: 390×844 and 320×568; 20 roster cards, five opening/closing panels, controls within panel bounds, all 40 images decode at intended dimensions, no page errors.
- Fellow and Family visual regressions passed both sizes. Family gift accounting, free assignment, and reload passed.
- Tower presentation fixture checks both sizes using the production renderer and screen decorator in an isolated browser response. It does not claim an unlocked-save gameplay walkthrough.
- The historical C1 tower-ready-v2 fixture returned phase24l-c1-qa-fixture-invalid under current validation. It was not weakened or counted as passing; repairing that legacy fixture is separate follow-up work.

Real-device Safari and long-session play are outside this visual pass.

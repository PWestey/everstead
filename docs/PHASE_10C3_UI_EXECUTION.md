# Phase 10C-3 · Player-facing economy UI execution

Status: **Expanded live acceptance pending.**

## Boundary

This gate owns only the explanatory economy presentation added over the exact Phase 10C-2 engine. It does not authorize schema, arithmetic, persistence, navigation, Oath, Campaign, Family-assignment, or modal-lifecycle redesign.

## Required surfaces

- Building hotspot and aggregate HUD accessible names.
- Exact fresh executable copy: all four visible/accessible Building rates and the `27.3K` aggregate HUD. The contract follows the production formatter, so Archives is `6.0K`.
- One-timestamp Building upgrade preview, including fresh, affordable, unaffordable, level 51, and level 52 cap states.
- Building modal factors, current-to-next rate, gain, cost, shortage, and cap reason.
- Exactly one Fellow and one Companion Village multiplier summary.
- Player-facing offline copy and an explicit total row.
- Polite collection/upgrade announcements, with Undo intentionally excluded.
- Phase 10B-3 dialog focus, Escape, return-focus, navigation, and action behavior preserved.
- Phase 10B-3 semantic/focus/inert lifecycle, repeated open-to-Escape cycles, listener stability, overlay-close return focus, and four-tab Arrow/Home/End semantics preserved.
- Exact level-51-to-52 debit/revision/profile continuity and byte/state-exact level-52 refusal.
- No production native-storage access from the isolated live runner and no warning/error console output.

## Verification

1. Run `node qa/phase-10c3/verify.mjs` twice from the repository root.
2. Serve the repository root on the approved same-origin local server.
3. Open `qa/phase-10c3/`; allow its automatic run to complete.
4. Require **86/86** across all three phone sizes and inspect the console for zero warnings/errors.

The live runner never seeds or writes browser-native storage. Each iframe receives an attested isolated-memory adapter before production code is evaluated.

## Evidence state

- Focused verifier: **143/143 twice**, including the live-oracle-to-engine binding.
- Predecessor live in-app Chromium: **79/79 twice** across 320×568, 390×667, and 390×844, with **0** console/page errors and **0** browser-native storage accesses.
- Expanded live in-app Chromium: **86/86 twice** across 320×568, 390×667, and 390×844, with **0** console/page errors and **0** browser-native storage accesses or writes.
- Expanded live evidence was observed at `2026-08-30T19:23:19Z` against production authority `729ac10114fa75f0fa66a93438aeed281f0e78f7`.

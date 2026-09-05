# Phase 24L-B1 — Banked Fellow EXP Result

**Verdict:** PASS — release gate and independent review complete

**Predecessor:** `abbadebe848d5d2a4a1e4b4969e1987fc4786139` / save schema 15 / EXP policy version 1

**Successor:** save schema 15 / EXP policy version 2

**Scope:** Fellow EXP credit settlement, shared wallet spending, bounded Level sheet, and first-credit/first-investment tutorials

Phase 24L-B1 changes Fellow EXP from an automatic character grant into an earned inventory resource. Authenticated Campaign and manual-reward actions now bank settled Fellow EXP once. The player deliberately invests that shared balance from a Fellow's **Level** sheet with **x1**, **x10**, or **Max**; Fellow Rank remains a separate shard action.

## Release-gate evidence

- Static/pure contract: **95/95 passed** on the final release tree.
- Live Chromium gate: **77/77 passed** on the final release tree.
- Independent review: **PASS**, no release-blocking findings.
- Both required mobile viewports, **320×568** and **390×844**, keep the art-first Fellow profile and Level sheet usable without document scrolling.
- Fresh and retained saves activate the version-2 policy exactly once while preserving all previously invested EXP.
- Campaign first-clear/replay and authored manual-claim routes credit the shared wallet atomically without changing their historical raw reward receipts.
- Collection EXP bonuses are additive peers, use integer floor settlement, and are authenticated against both predecessor and successor Collection state.
- x1, x10, and Max spending preserve unspent remainder, refuse stale or unaffordable previews, and do not touch Rank shards, Relics, Bonds, other Fellows, or Companions.
- Recovery formats 1–4, Previous, safe reset, interrupted staging, reload, import/export, and two-client conflict refusal remain functional.
- First-credit and first-affordable-investment tutorials use current Everstead characters and complete only after successful committed actions.
- Current product artifact: SHA-256 `8d81cb14870f92955c55de5a0e81e03940dba3698ce07600f3da3fc5831ea682`, **2,083,362 bytes**.
- Phase 24L-A profile and Phase 24K screen-art static suites retain **37** and **17** behavioral assertions respectively; each reports only its one explicitly superseded additive-index identity assertion.

The independent reviewer confirmed the final schema projection, retained-save renderer path, formats 1–4, Previous/reset routing, current Campaign receipt validation, Collection-BPS authentication, malformed-preview refusal, and the complete **77/77** browser matrix.

## Coverage boundary and residual risk

The +1,000% Collection settlement browser case uses the explicitly authorized isolated QA credit route through the real wallet settlement and persistence code. Genuine Campaign and manual source ownership are separately exercised in-browser, while exact production Collection-BPS derivation and forged-BPS refusal are verified statically. No single automated browser journey both earns a genuine +1,000% Collection state and spends it through a production reward source.

The inherited Web Storage limitation remains: browsers provide no atomic compare-and-swap across the final reread-to-write interval. Revision, raw-identity, staging, and storage-event guards narrow and detect conflicts but cannot eliminate that interval. Real-device Safari remains outside this Chromium release gate.

## Next gate

Phase 24L-B2 can now redesign the Fellowship roster and Fellow profile navigation around compact, art-forward local panels without changing the authenticated EXP economy established here.

# Phase 24L-C1 — Banked Companion EXP Result

**Verdict:** PASS — release-candidate implementation and root verification complete

**Predecessor:** `7cf2ccaca447e15cfa5e9aa8f77b6306f775abc1` / save schema 15 / EXP policy version 2

**Successor:** save schema 15 / EXP policy version 3

**Scope:** shared Companion EXP wallet, authenticated reward credits, deliberate Companion Level investment, migration/recovery compatibility, and current-profile UI

Phase 24L-C1 changes Companion EXP from an automatic target grant into an earned inventory resource. Companion Campaign, Companion Tower clear and idle claim, and authenticated manual rewards now bank Companion EXP exactly once. The player deliberately invests the shared balance from a Companion's **Level** sheet with **x1**, **x10**, or **Max**. Companion Rank remains shard-based; Assignment and Mastery retain their released authorities.

## Release-gate evidence

- C1 static/contract verifier: **62/62 passed**.
- Independent pure-engine verifier: **6/6 passed**.
- C1 live Chromium gate: **129/129 passed** on the consolidated release candidate.
- Production smoke: **1/1 passed** against the exact worktree server with the C1 QA bridge absent and the hidden engine/UI exports immutable.
- Both required mobile viewports, **320×568** and **390×844**, passed current UI checks with zero document or panel overflow.
- Activation upgrades policy version 2 to version 3 exactly once, captures all existing Companion EXP and Levels, and starts a neutral Companion wallet without changing any actor.
- Campaign first-clear/replay, Tower clear, Tower idle settlement/claim/replay, manual claim, and mixed Fellow/Companion claim routes settle atomically against their existing authenticated receipts.
- Credits use one integer floor after authored and uncapped Collection EXP basis-point bonuses are added as peers; the +1,000% Collection case passes.
- x1, x10, and Max spending preserve remainder, do not reapply bonuses, and change only the chosen Companion's invested EXP/Level plus the Companion wallet and ledger.
- Assignment support deltas are previewed and announced without changing Assignment ownership. Rank shards, Mastery, Fellow progression, and unrelated actors remain untouched.
- Duplicate, stale, insufficient, at-cap, unavailable, malformed, overflowing, corrupt-ledger, future-gate, and losing-client paths are fail-closed and write-neutral.
- Ledger folding, policy-v2 projection, formats 1–4, reload, export/import, Previous Save, safe reset/recovery, and both versioned tutorials pass.
- Current artifact: SHA-256 `ff496dd9a5deb81348a02e5e52420a840cc3f79a572c5ed2abe6e82d84f58913`, **2,155,446 bytes**.

## Inherited regression evidence

- Released Fellow-wallet static authority: **95/95 passed**.
- Compact hubs live Chromium: **48/48 passed**.
- Successor facilities live Chromium: **350/350 passed** across both mobile sizes and all eight facilities.
- Game-screen static contract: **31 behavioral assertions passed**; only its frozen current-index identity assertion is superseded.
- Compact-hub static contract: **32 behavioral assertions passed**; only its frozen current-index identity assertion is superseded.
- Profile-shell static contract: **37 behavioral assertions passed**; only its frozen current-index identity assertion is superseded.

The historical B1 and pre-redesign profile browser scripts are not successor gates: they require an active policy-version-2 save and directly visible legacy roster controls respectively. The C1 release gate re-exercises their required current behavior under policy version 3 and the art-forward profile shell, including Fellow/Companion mixed settlement, concurrency, recovery, focus, inert panels, bounded layout, and two-step Escape. Their refusals are therefore recorded as obsolete harness assumptions rather than hidden or counted as product passes.

## Accessibility and presentation corrections

- Inactive profile panels are now both hidden and inert.
- The Companion Level sheet fits the standard mobile viewport without horizontal overflow.
- Escape collapses the local sheet before closing the profile and returning focus to the roster card.
- The game-screen Escape owner yields while a profile dialog is open.
- Private Companion portrait 404s remain the documented public-build fallback boundary; unexpected HTTP or console errors still fail the gate.

## Residual risk and coverage boundary

Web Storage still has no atomic compare-and-swap across the final reread-to-write interval. Revision, raw-identity, staging, and storage-event guards narrow and detect conflicts but cannot eliminate that browser limitation. Real-device Safari remains outside this Chromium gate.

Private Companion portraits are intentionally excluded from the public repository pending distribution rights. The public build uses the tracked Companion crest fallback and the QA gate permits only those exact documented fallback requests.

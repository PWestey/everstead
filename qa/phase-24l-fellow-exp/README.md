# Phase 24L-B1 · Banked Fellow EXP QA

This is the independent release gate for the first playable banked-EXP slice. It treats Fellow EXP as shared inventory that is earned once and deliberately invested from a Fellow's bounded **Level** sheet.

The gate is intentionally separate from production code. It verifies:

- authenticated, idempotent root-version 1 → 2 activation that captures live invested EXP after B0, including EXP earned between releases;
- zero starting wallets, exact Companion neutrality, and no actor change during activation or credit;
- atomic Fellow Campaign and authored/manual claim credits with `floor(raw × (10,000 + authored BPS + Collection BPS) / 10,000)` settlement;
- raw historical target provenance, stable source ownership, duplicate refusal, +1,000% Collection bonus support, and overflow refusal;
- exact x1 partial-progress pricing, greatest-affordable x10 and Max behavior, current production cap, stale/duplicate/no-op refusal, and unspent remainder preservation;
- separation of Level/EXP from Rank/shards, Relics, Bonds, other Fellows, Player Rank, and every Companion field;
- ordered identity-chained ledger entries, deterministic folding only after 256 live entries, exact wallet algebra, and schema-14 historical projection using raw rather than Collection-boosted EXP;
- format 1–4 import, reload, Previous, safe/forensic reset, interrupted activation/credit/spend recovery, and real multi-client conflict refusal;
- versioned first-credit and first-investment tutorials that are skippable, replayable, use current roster speakers, and cannot complete on a refused or losing transaction;
- 320×568 and 390×844 art-first Fellow profiles with no document scrolling, bounded Level sheets, 44 px controls, accessible mode state, pure previews, and preserved Escape behavior.

## Commands

Pure engine and static integration gate:

```sh
node qa/phase-24l-fellow-exp/verify.mjs
```

Live Chromium, storage, concurrency, tutorial, and viewport gate:

```sh
node qa/phase-24l-fellow-exp/browser.mjs
```

The browser suite installs an explicitly authorized shared in-memory storage adapter before Everstead loads. It traps native Web Storage calls and fails if production or QA code touches native storage.

## Bridge adapter

All production bridge names and argument conventions are centralized at the top of `browser.mjs` and mirrored in `contract.json`. The expected query-gated global is `__EVERSTEAD_PHASE_24L_B1_QA__`.

Read surface:

- `read.snapshot()`
- `read.validate()`
- `read.wallet()`
- `read.fellow(id)`
- `read.preview(id, mode)`
- `read.tutorials()`

Destructive surface (available only with `qa.allowDestructive === true`, `qa.isolatedStorage === true`, and a non-native selected storage adapter):

- `destructive.reset(fixture)`
- `destructive.activate()`
- `destructive.credit(input)`
- `destructive.campaign(input)`
- `destructive.claim(input)`
- `destructive.spend(input)`
- `destructive.reload()`
- `destructive.roundTripImport(version)`
- `destructive.recoverInterrupted(kind)`
- `destructive.multiClient(kind)`
- `destructive.tutorial(action, id)`
- `destructive.probeRefusal(kind)`

The bridge is a test observer/controller around production authorities. It must not edit wallet totals, actor EXP, receipts, tutorials, or storage slots directly.

## Fixture names

- `post-b0-play`: valid root v1 with additional invested Fellow EXP accrued after B0.
- `campaign-ready`: valid v2 save eligible for first-clear, replay, and exact-source retry probes.
- `manual-claim-ready`: one authored Fellow EXP claim available.
- `partial-affordable`: an owned Fellow with partial legacy level progress and enough wallet EXP for x1/x10/Max boundary checks.
- `tutorial-ready`: valid v2 save with both B1 tutorial histories unseen and enough progression to demonstrate both triggers.

Fixtures must be installed through the normal save coordinator into isolated memory. No test may write native storage or bypass production mutation, validation, staging, recovery, reward, or tutorial authorities.

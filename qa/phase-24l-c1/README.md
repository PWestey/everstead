# Phase 24L-C1 · Banked Companion EXP QA

This is the isolated release gate for the schema-15 `experienceProgression` policy-version-2 to policy-version-3 Companion EXP change. It follows the released B0/B1 boundaries: reward sources remain authoritative, credits and spends are transactional, and the QA bridge is available only with an explicitly isolated, non-native storage adapter.

The gate proves:

- C1 activation captures the live EXP and Level of all 20 Companions without changing an actor, paying a reward, converting a pending Tower entitlement, or rewriting any Fellow-wallet authority;
- activation installs one deterministic receipt and is idempotent across retry, reload, import, Previous Save, and safe-reset recovery;
- Companion Campaign first-clears and replays, Tower clears, explicit Tower idle claims, authenticated Companion rewards, and mixed Fellow/Companion claims credit the shared Companion wallet exactly once;
- raw reward maps and Phase 23 receipts remain unchanged, while live Companion EXP and Level remain unchanged until the player spends;
- authored and Collection EXP bonuses are additive peers, including +1,000% Collection EXP, and are floored once when credit is earned;
- x1, x10, and Max price the released cumulative Companion curve, honor partial progress and Level 100, preserve wallet remainder, and change only the selected actor plus the Companion wallet/ledger;
- Rank, shards, assignment identity, Mastery, non-selected actors, and the released Fellow wallet/ledger remain neutral unless their existing source action independently owns a change;
- stale, duplicate, unavailable, capped, insufficient, malformed, overflowing, corrupted, and future-gated actions refuse with zero writes;
- Companion journal folding, checkpoint algebra, raw historical projection, reload/import/export/Previous Save/recovery, and same-source or same-spend multi-client races remain exact;
- the Companion Level sheet is bounded and keyboard-operable at 320×568 and 390×844 with one live control set, 44-pixel targets, polite announcements, visible refusal reasons, predictable focus, and inactive panels kept hidden and inert.

## Expected candidate integration

The expected production files and global are declared in `contract.json`:

- `src/phase24l-companion-exp-wallet.js`
- `src/phase24l-companion-exp-ui.js`
- `styles/phase24l-companion-exp-ui.css`
- `EVERSTEAD_PHASE24L_COMPANION_EXP_WALLET`

The browser gate expects a hidden getter named `__EVERSTEAD_PHASE_24L_C1_QA__` only when both `qa=1` and `phase24l-companion-exp-qa=1` are present. Production must additionally require own literal `runtime.qa.allowDestructive === true`, own literal `runtime.qa.isolatedStorage === true`, a selected storage adapter, and exact rejection of the captured native `localStorage` object.

All bridge method lookup is centralized in `contract.json` and at the top of `browser.mjs`. A method may return its state directly or under `state`, `after`, or `snapshot.state`; destructive methods should also return `ok`, `reason`, `writes`/`writeCount`, and source-specific evidence where noted below.

### Read bridge

- `read.snapshot()` → current state, active raw bytes, revision.
- `read.validate()` → `{ok, errors}` under the complete C1 validator.
- `read.wallet()` → Companion wallet and replayed Companion-ledger totals.
- `read.companion(id)` → actor and derived effective Power/assignment transfer.
- `read.preview(id, mode)` → pure x1/x10/Max preview with bound identity.
- `read.tutorials()` → C1 credit/spend tutorial state.
- `read.projection()` → authenticated v3→v2 projection plus predecessor validation.

### Destructive bridge

- `destructive.reset(fixture)` installs one of the fixture names in `contract.json` in isolated memory.
- `destructive.activate()` performs or idempotently observes C1 activation.
- `destructive.credit(input)` creates an authenticated QA-only Companion credit. Input includes `sourceId`, `historicalTargetId`, `rawAmount`, `authoredBps`, and optional `collectionBps` fixture override.
- `destructive.campaign({mode})` performs `first-clear` or `replay` through the real Companion Campaign transaction and returns `receipt`, `credits`, `rawAmount`, and `settledAmount`.
- `destructive.towerClear()` performs one real Tower clear and returns the unchanged Phase 23 receipt plus C1 credit evidence.
- `destructive.towerSettle({elapsedMs})` advances the isolated clock and settles elapsed Tower time without claiming it.
- `destructive.towerClaim()` performs the real explicit claim and returns the Phase 23 receipt plus canonical per-positive-target `credits`.
- `destructive.manualClaim({mode})` supports `claim` and `replay` for one Companion-EXP offer.
- `destructive.mixedClaim({mode})` supports `claim` and `replay` for one atomic Fellow/Companion EXP offer.
- `destructive.spend({companionId, mode, expectedIdentity})` commits a bound preview.
- `destructive.reload()`, `roundTripImport(version)`, `roundTripPrevious()`, and `safeResetRecovery()` exercise the production persistence coordinators.
- `destructive.multiClient(kind)` supports `same-credit` and `same-spend`, returning winner/loser counts, final validation, and no-overdraw evidence.
- `destructive.tutorial(action, id)` supports `skip`, `replay`, and `complete` without rewards.
- `destructive.probeRefusal(kind)` handles every refusal id in `contract.json` and returns `{ok:true, refused:true, writes:0, rawUnchanged:true, stateUnchanged:true}` when the system correctly fails closed.
- `destructive.foldLedger()` crosses the 256-entry live-tail boundary and returns checkpoint, replay, projection, and validation evidence.

Every source action must settle its gameplay changes and Companion wallet credits in one production persistence transaction. Bridge helpers may prepare isolated fixtures, but they must call the production coordinator for the action being asserted.

## Run

Static/pure gate:

```sh
node qa/phase-24l-c1/verify.mjs
```

Integrated isolated Chromium gate:

```sh
node qa/phase-24l-c1/browser.mjs
```

Plain production smoke gate, after serving the repository root:

```sh
node qa/phase-24l-c1/production.mjs http://127.0.0.1:8840
```

The browser runner never uses native browser storage. The production runner never adds QA query parameters and requires the C1 bridge to remain absent.

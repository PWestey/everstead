# Phase 24L-C1 — Banked Companion EXP Contract

Status: implementation contract

Base: schema 15 / `experienceProgression` policy version 2

Successor: schema 15 / `experienceProgression` policy version 3

## Player promise

Companion EXP is an earned inventory resource. Companion Campaign, Companion Tower, and authenticated authored rewards credit one shared Companion EXP wallet exactly once. The player opens a Companion's **Level** sheet and deliberately spends that wallet with **x1**, **x10**, or **Max**.

Existing Companion EXP and Levels remain invested exactly where the player has them. Activation never withdraws, refunds, reprices, or duplicates historical EXP. Companion Rank remains a separate targeted-shard purchase; Mastery remains a separate Tower-earned global multiplier.

## Authenticated activation boundary

1. Policy version 2 remains the valid B1 predecessor and keeps the released Fellow wallet, ledger, tutorials, and activation authority unchanged.
2. Before the first C1 credit or spend, one idempotent `phase24l-c1-activation` transaction upgrades only `experienceProgression` from version 2 to version 3.
3. Activation records the exact live cumulative EXP and derived Level for every Companion. Play performed before C1 is therefore preserved at the release boundary.
4. Activation starts the Companion wallet and Companion ledger at zero, grants no reward, changes no actor, and does not reinterpret a pending Tower claim.
5. Activation leaves the Fellow wallet, Fellow ledger, Fellow activation baseline, and Fellow tutorials byte-semantically unchanged.
6. A deterministic activation receipt is recorded once. Reload, import, Previous Save, reset, and retry cannot add another receipt or alter the captured baseline.

## Credit settlement

Each eligible production action settles atomically with its existing authenticated receipt:

`settled Companion EXP = floor(raw Companion EXP × (10,000 + authored EXP BPS + Collection EXP BPS) / 10,000)`

- Authored and Collection bonuses are additive peers.
- The floor is applied once to each ledger credit at earning time.
- Spending never applies or recalculates an EXP multiplier.
- Safe-integer overflow, malformed bonus data, missing receipt authority, or duplicate source identity refuses the entire source transaction.
- Historical receipts and raw target-keyed reward maps remain unchanged. The original target is provenance for predecessor projection only; it does not receive live EXP after C1.
- Retrying or replaying an already-consumed source produces no credit and no write.

C1 activates these production routes:

| Route | Companion-ledger identity | Credit shape |
| --- | --- | --- |
| Companion Campaign | `companion-campaign` + Phase 23 receipt identity | One credit for the sole positive raw target |
| Companion Tower clear | `companion-tower-clear` + Phase 23 receipt identity | One credit for the sole positive raw target |
| Companion Tower idle claim | `companion-tower-idle` + pending identity and Companion id | One credit for each positive raw reward-map entry, in canonical Companion order |
| Authenticated manual reward claim | `manual-reward-claim` + pending identity and Companion id | One credit for each positive Companion EXP reward, in canonical reward order |

Tower settlement only banks elapsed entitlement. Wallet credit occurs on the explicit Tower claim. Shards, Mastery, floors, histories, Gold, Player Rank EXP, and all non-EXP rewards remain in their current transactions.

The isolated QA grant may create an authenticated QA-only Companion credit against a non-native storage adapter. It is never a production earning route.

## Spending

Only an available, owned Companion may receive invested EXP. The production Level cap remains 100, with the released cumulative Companion EXP curve as the sole cost authority.

- **x1:** exact cumulative EXP difference from current invested EXP to the next Level threshold.
- **x10:** greatest affordable target no more than ten Levels above the current Level.
- **Max:** greatest affordable target up to Level 100.
- Partial progress toward the next Level lowers its exact cost.
- Unusable or unspent wallet remainder is preserved.
- At cap, below x1 cost, unavailable, stale, malformed, duplicated, or overflowing requests perform zero writes.
- C1 introduces no Companion Breakthrough material or gate. The spend engine remains fail-closed if a later locked gate is supplied.

A valid spend atomically changes only the Companion wallet, the selected Companion's cumulative invested EXP and derived Level, one ordered Companion spend record, and the C1 spend tutorial marker when eligible. Companion Power and an assigned Fellow's support contribution may change only through the existing formulas.

Every preview binds the save id and revision, policy identity, Companion-ledger head, wallet balance, actor identity and state, selected mode, exact cost, resulting EXP/Level/Power, and assignment-transfer result. Commit recomputes and compares that identity inside the transaction.

## Version-3 companion ledger

The Companion ledger is separate from the released Fellow ledger. It is an ordered, identity-chained journal with a bounded tail and authenticated checkpoint folding. It must support the complete 20-Companion Tower reward map in one transaction.

Each credit records source kind and identity, raw amount, authored and Collection EXP BPS, floor-once settled amount, and historical target provenance. Each spend records recipient, mode, cost, before/after EXP and Level, and the bound preview identity.

The checkpoint retains:

- through-sequence, folded-entry count, and terminal folded identity;
- total raw credits by historical Companion target;
- settled Companion credits;
- spends by recipient Companion;
- credited and spent totals;
- one canonical checkpoint identity.

Required algebra:

- `companion creditedTotal = folded settled credits + live settled credits`
- `companion spentTotal = folded spends + live spends`
- `Companion wallet = creditedTotal - spentTotal >= 0`
- `live Companion EXP = C1 activation EXP + folded spends for that Companion + live spends for that Companion`
- `live Companion Level = companionLevelForExp(live Companion EXP)`
- the Fellow ledger, Fellow wallet, Fellow actors, and Fellow folded totals replay unchanged under their B1 authority.

## Historical projection

Policy version 2 and schema-14 predecessor validation remain authoritative. The C1 projection:

1. validates and replays the Companion ledger and removes C1 activation/tutorial metadata;
2. subtracts C1 player-selected spends from their chosen Companion recipients;
3. adds each C1 credit's **raw** amount to its historical reward target;
4. derives projected Companion Levels with the frozen production curve;
5. restores policy version 2 with a neutral Companion wallet and no Companion ledger;
6. validates that projection through the unchanged B1 policy-version-2 authority, which in turn projects through the frozen schema-14 validator.

Collection bonus EXP is C1-only and is never injected into predecessor history. Multi-target Tower credits project by canonical raw reward map rather than player-selected spend destination.

## Compatibility with the Fellow wallet

The C1 coordinator may stage an inherited B1 Fellow credit or spend only by projecting the version-3 root to version 2, invoking the unchanged B1 authority, and merging back the authenticated Fellow-only result while retaining the C1 Companion fields. Mixed manual offers containing Fellow and Companion EXP settle both ledgers inside the same source transaction or refuse atomically.

No C1 adapter may relax B1 validation, rewrite its ledger, reinterpret its source identities, or duplicate its tutorials.

## UI and tutorial

The existing art-first Companion profile and local dock remain intact. C1 replaces only the content of the Companion **Level** sheet with:

- shared Companion EXP balance;
- current Level and invested EXP;
- exact next-Level progress;
- x1, x10, and Max controls;
- exact cost, remaining wallet, and before/after Companion Power;
- when assigned, the before/after 40% support contribution and resulting affected Fellow Power delta.

Rank, Assignment, and Mastery panels retain their real controls and current formulas. Campaign and Tower result copy states `Shared Companion EXP` and never implies that a Companion levelled automatically.

Two versioned, skippable, replayable tutorials use current Everstead Fellow/Family speakers:

1. first committed Companion EXP credit;
2. first affordable Companion EXP investment.

A refused, stale, rolled-back, replayed, or losing transaction cannot complete either tutorial.

## Mobile and accessibility requirements

- At 320×568 and 390×844, both the profile and Level sheet have zero document overflow at normal text size.
- x1, x10, Max, Invest, Help, Close, and dock tabs retain 44×44 CSS-pixel targets.
- Spend modes use a labelled group with exactly one `aria-pressed="true"`.
- Preview and result status use a polite live region; disabled actions show a visible reason.
- Re-render restores focus to the chosen mode or committed action predictably.
- A successful announcement includes spent amount, new Level, wallet remainder, and assignment-transfer delta when relevant.
- Escape, sheet collapse, tab roving, inactive-panel inertness, forced-colors, and reduced-motion behavior remain unchanged.

## Do not break

- B0/B1 checkpoints, recovery format 4, export/import, Previous Save, safe reset, and forensic recovery.
- Phase 23 Campaign, Tower-clear, Tower-idle, and claim receipt bytes, identities, histories, and exact-once ownership.
- Fellow EXP wallet, Fellow actor investment, and B1 tutorials.
- Companion rarity/shards, assignments, Mastery, Power formula, Tower carry, and pending claims.
- Collection Power/Earnings/EXP/facility ordering and uncapped additive pools.
- Current art, dialogue, profile shell, close/collapse behavior, focus trap, reduced motion, and roster scrolling exception.

## Release gate

Release requires exact static and live-browser passes for fresh and established activation, pre-C1 actor preservation, non-retroactive wallet initialization, Campaign first-clear/replay, Tower clear, Tower idle settlement/claim/replay, manual and mixed claims, additive Collection settlement through +1,000%, x1/x10/Max partial-progress and cap cases, assignment delta, stale/multi-client refusal, source duplication, overflow/corruption failure, ledger folding, projection, reload, import/export, Previous Save, reset/recovery, tutorials, and 320×568 plus 390×844 bounded UI. Rank, shards, assignment, Mastery, B1, B3E, Phase 23, and production-smoke regressions must pass except for explicitly superseded Companion auto-Level or current-artifact identity assertions.

# Phase 24L-B1 — Banked Fellow EXP Contract

Status: implementation contract

Base: schema 15 / `experienceProgression` policy version 1

Successor: schema 15 / `experienceProgression` policy version 2

## Player promise

Fellow EXP is an earned inventory resource. A reward credits the shared Fellow EXP wallet once. The player then opens a Fellow's **Level** sheet and spends that wallet with **x1**, **x10**, or **Max**. Merely opening a profile or previewing a purchase never writes a save.

Existing invested EXP is never withdrawn, refunded, repriced, or granted again. Fellow Rank remains a separate shard purchase.

## Authenticated activation boundary

1. Policy version 1 remains a valid, read-only transitional state.
2. Before the first B1 credit or spend, the app performs one idempotent `phase24l-b1-activation` transaction that upgrades only `experienceProgression` from version 1 to version 2.
3. Activation records the exact live cumulative EXP and derived Level for every Fellow. This is intentionally later than the B0 schema-15 baseline so play performed between the B0 and B1 releases is preserved.
4. Activation grants no wallet currency, changes no actor, applies no reward, and leaves the Companion wallet neutral.
5. A deterministic activation receipt is added once. Reopening, reloading, importing, restoring Previous, or retrying activation cannot add another receipt or alter the captured baseline.

## Credit settlement

Every production Fellow EXP producer settles atomically with its existing authenticated source action:

`settled EXP = floor(raw earned EXP × (10,000 + authored EXP BPS + Collection EXP BPS) / 10,000)`

- Authored and Collection bonuses are additive peers.
- Safe-integer overflow or malformed bonus data refuses the entire source transaction.
- Bonuses are captured at credit time and never recalculated later.
- Spending never applies an EXP multiplier.
- The historical source receipt and raw target-keyed reward map remain unchanged.
- A wallet credit records the raw amount, both BPS inputs, rounding rule, settled amount, original target as provenance, and exact source identity.
- Retrying an already-consumed source identity produces no credit and no write.

B1 activates two production routes: Fellow Campaign and the shared authored/manual reward claim path. Historical catch-up EXP and fixture-only QA grants remain invested actor EXP and are never converted.

## Spending

Only an available, owned Fellow may receive invested EXP.

- **x1:** exact cumulative EXP difference from the current invested amount to the next Level threshold.
- **x10:** the greatest affordable target no more than ten Levels above the current Level.
- **Max:** the greatest affordable target up to the current production Level cap.
- A partial legacy progress bar reduces the exact price of the next Level.
- Unspent remainder is preserved.
- At cap, below the x1 price, unavailable, stale, malformed, duplicated, or overflowing requests perform zero writes.

A valid spend atomically changes only the shared Fellow wallet, the selected Fellow's cumulative invested EXP and derived Level, and one ordered spend record. Power and other downstream values may change only through the existing production formulas.

Every preview binds the save ID and revision, wallet balance and ledger head, Fellow identity and actor state, selected mode, exact cost, resulting Level/EXP, and resulting production Power. Commit recomputes and compares that identity inside the transaction.

## Version-2 ledger

The ledger is an ordered, identity-chained journal with a bounded live tail. Each entry has a contiguous sequence and binds its predecessor identity.

When the tail exceeds 256 entries, the oldest deterministic batch is folded into an authenticated checkpoint. The checkpoint retains:

- the through-sequence and folded-entry count;
- total raw credits by historical Fellow target;
- settled credits by roster;
- spends by recipient Fellow;
- credited and spent totals by roster;
- the terminal folded entry identity and a canonical checkpoint identity.

The remaining tail replays from that checkpoint. Production source authorities retain exactly-once ownership after folding: Campaign run sequence/receipt identity for Campaign and the durable claim receipt/archive identity for claims. A source that cannot prove this ownership cannot credit the wallet.

Required algebra:

- `creditedTotal = folded settled credits + live settled credits`
- `spentTotal = folded spends + live spends`
- `balance = creditedTotal - spentTotal >= 0`
- `live Fellow EXP = activation EXP + folded spends for that Fellow + live spends for that Fellow`
- `live Fellow Level = fellowLevelForExp(live Fellow EXP)`
- Companion wallet, Companion actors, and Companion folded totals remain exactly neutral in B1.

## Historical projection

Schema-14 predecessor validation remains authoritative. The B1 projection:

1. removes the B1 activation receipt, B1 tutorial completions, and `experienceProgression` root;
2. subtracts all B1 player-selected spends from their chosen recipients;
3. adds each B1 credit's **raw** amount to its historical reward target;
4. derives projected Levels with the frozen Level curve;
5. validates the resulting state through the unchanged schema-14 authority.

Collection bonus EXP is schema-15-only and is never injected into the schema-14 projection.

## UI and tutorial

The Fellow art-first profile remains bounded and non-scrolling at the document level. Its local **Level** tab shows:

- shared Fellow EXP balance;
- selected Fellow's current Level and **Invested EXP**;
- exact next-Level progress;
- x1, x10, and Max controls;
- exact cost and before/after Level and Power preview.

The Rank tab continues to spend only character shards. Campaign result copy says `Fellow EXP` and does not imply that the historical target automatically received it.

Two new, versioned, skippable, replayable tutorials use current Everstead Fellow/Family speakers:

1. first committed Fellow EXP credit;
2. first affordable Fellow EXP investment.

A refused, stale, rolled-back, or losing transaction cannot complete either tutorial.

## Do not break

- B0 checkpoint, recovery format 4, export/import, Previous, safe reset, and forensic recovery.
- Phase 11G catch-up and historical Campaign receipt bytes/identities.
- Campaign Gold, shards, Gifts, Player Rank EXP, Relics, access, run counts, and presentation timing.
- Rank/shard behavior, assignments, Relics, Bonds, Family bonuses, Might, production, and existing Power order.
- Village offline and Fellow Expedition rewards; neither becomes a Fellow EXP producer in B1.
- Current profile art, close/collapse behavior, keyboard focus trap, reduced motion, and 44 px minimum actions.

## Release gate

Release requires exact static and live-browser passes covering fresh and established activation, post-B0 play preservation, Campaign first-clear/replay, manual claims, additive Collection settlement through +1,000%, x1/x10/Max boundary cases, cap/no-op/overflow refusal, Rank isolation, historical projection, multi-client races, interrupted staging, reload, import/export, Previous, safe/forensic reset, tutorials, and 320×568 plus 390×844 no-scroll UI. B0, Phase 24L-A, and Phase 24K regressions must pass except for explicitly superseded identity or passive-Level-card assertions.

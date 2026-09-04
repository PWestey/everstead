# Phase 24L-B0 — Banked EXP Foundation Contract

**Status:** Implementation contract  
**Predecessor:** `cb4e7d9` / save schema 14  
**Successor:** save schema 15 / recovery format 4  
**Design authority:** `docs/PHASE_24L_GAME_SCREEN_UX_CONTRACT.md`

## Objective

Introduce the persistence foundation required for player-directed Fellow and Companion EXP without changing released progression behavior. Phase 24L-B0 creates separate zero-balance wallets, immutable migration baselines, and an ordered ledger shell. Reward rerouting and wallet spending belong to later gates.

## Released behavior boundary

- Existing Fellow and Companion EXP continues to behave exactly as it did in schema 14.
- Migration preserves every character's invested EXP, Level, Power, rarity, shards, Bonds, Relics, Mastery, and assignment state.
- Fellow and Companion wallet balances, credited totals, spent totals, and ledger entries start at exact zero.
- Pending rewards remain pending. Migration does not claim, convert, reprice, or settle them.
- Player Rank EXP, Gold, production, Campaign, Tower, facility, achievement, Chronicle, Gifts, shards, and offline behavior remain unchanged.

## Schema-15 authority

The root `experienceProgression` record owns:

- immutable per-character migration baselines;
- separate Fellow and Companion wallet totals;
- an ordered identity-chained ledger shell;
- authenticated migration or direct-origin lineage;
- identities binding the baselines, wallets, ledger, and exact predecessor.

Schema-15 validation projects the live state back through the frozen schema-14 validator and separately authenticates the new root. It does not weaken or replace predecessor validation.

## Save and recovery topology

- Semantic installation slots increase from 15 to 16 with a write-once pre-v15 checkpoint.
- Physical snapshots contain 19 slots: the 16 semantic slots plus ordinary staging, journal, and rollback controls.
- Save exports use format 4 and accept formats 1–4.
- The pre-v15 checkpoint preserves exact schema-14 bytes and authenticated metadata.
- Direct-new and safe-reset states use independent schema-15 origin attestations.
- Safe reset retains a complete validated Previous Save for healthy installations.
- A blocked future, invalid, malformed, or missing active save may be replaced only through a forensic safe reset that preserves its exact source bytes in a non-restorable Previous record.
- Interrupted ordinary and forensic transactions must resolve to one complete source or target installation; mixed terminal state is invalid.

## Fail-closed rules

Reject without persistence writes when the checkpoint is missing, occupied by unrelated bytes, malformed, raw-only, or inconsistent with the active lineage. Reject nonzero wallets, forged ledger entries, baselines ahead of live actor investment, duplicate migration application, reward application during migration, hostile validation, overflow, or stale transaction ownership.

## Acceptance gate

The release requires:

- all four canonical schema-14 histories migrating with exact actor and pending-entitlement preservation;
- fresh, reload, import v1–v4, safe reset, Previous Save, rollback, staging, journal, and forensic recovery coverage;
- all four blocked-source kinds at journal, rollback, and active-write interruption boundaries;
- real legacy Fellow Campaign, Fellow reward, Companion Campaign, and Companion Tower paths remaining actor-directed with zero new wallet activity;
- format-4 topology and exact checkpoint proof;
- zero use of native browser storage by destructive QA;
- no warning/error console entries;
- Phase 24L-A and relevant predecessor regression gates remaining green;
- independent review of the exact final tree.

## Do not break

Do not alter the current storage namespace, old checkpoints, Founding Table authority, old receipts, existing save identities, character calculations, pending offers, Tower carry, UI ownership, artwork, accessibility, or any released Phase 0–24L-A behavior.

# Phase 24L-B0 · Banked EXP schema foundation QA

This is the independent release gate for the schema-14 → schema-15 banked-EXP foundation. It treats Phase 24L-B0 as a persistence migration, not as the Fellow or Companion spending feature.

The gate proves:

- fresh, established, high-progression, and pending-entitlement schema-14 histories migrate without changing any gameplay field;
- every Fellow and Companion keeps exact invested EXP, Level, Power, rarity, shards, bond/relic, and assignment state;
- pending campaign, Tower, facility, Chronicle, achievement, gift, and shard rewards remain pending rather than being converted;
- Fellow and Companion wallets, lifetime totals, and the ordered ledger begin at exact zero;
- the pre-v15 checkpoint binds exact raw bytes to attested `writeOnceVerified: true` metadata;
- migration receipts are exactly-once and declare zero reward/wallet applications;
- the pure direct-new constructor and production safe-reset schema-15 lineage authenticate independently;
- first physical production boot safely finishes the already-running schema-14 activation chain, then migrates through an exact write-once pre-v15 checkpoint rather than claiming a synthetic direct origin;
- current schema tampering, unresolved checkpoints, raw-only checkpoint resolution, hostile validators, and revision overflow fail closed;
- the schema-14 predecessor is restored exactly after removing only explicit Phase 24L-B0 integration blocks;
- browser storage tests cover format 4, all 16 semantic/19 physical slots, import v1–v4, reset, Previous Save, recovery, interruption, and multi-tab behavior.
- a schema-14 installation that already carries a Phase 24C2C v3 forensic Previous Save still migrates, and that Previous Save remains independently downloadable or forgettable;
- interrupted ordinary schema-15 commits recover from both source-active and target-active staging without mixed state;
- real Fellow Campaign, general Fellow reward, Companion Campaign, and Companion Tower legacy EXP paths retain their schema-14 actor EXP/Level behavior while every new wallet and ledger counter remains zero;
- fresh boot, reload, and Fellowship navigation remain playable on the schema-15 shell.

Run the pure/static gate:

```sh
node qa/phase-24l-exp-foundation/verify.mjs
```

Run the browser/storage gate after the Phase 24L-B0 coordinator bridge is installed:

```sh
node qa/phase-24l-exp-foundation/browser.mjs
```

Both scripts are read-only with respect to production files. Browser scenarios use an explicitly authorized in-memory storage adapter and never touch the browser's native local storage.

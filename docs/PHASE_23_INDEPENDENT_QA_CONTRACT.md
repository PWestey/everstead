# Phase 23 independent QA contract

## Authority and boundary

This package independently verifies the accepted Phase 23 Companion migration. It is QA-only. It does not implement, emulate, repair, or weaken the production Companion runtime. A missing or incomplete production contract is a failed candidate, not a reason for the gate to synthesize a passing engine.

Passing this gate authorizes only a local private candidate. It does not authorize a merge, push, deployment, public release, or distribution of rights-limited Companion artwork.

## Frozen product contract

- Schema 13 is a real migration boundary. The exact positional map is `bramble → arcanine` and `cinderwing → dewgong`.
- The accepted stable order is Arcanine, Dewgong, Snorlax, Dragonite, Charizard, Venusaur, Blastoise, Jolteon, Machamp, Meganium, Feraligatr, Miltank, Donphan, Lucario, Boltund, Stoutland, Mabosstiff, Zacian, Lugia, and Suicune.
- All 20 are visible and owned. Phase 23 adds no summoning, pulls, acquisition currency, duplicate conversion, or gacha gate.
- Only the two mapped legacy rows inherit progression and assignments. The other 18 begin at the canonical owned Level 1, EXP 0, rarity 1, shards 0, unassigned default.
- The aggregate Level-1, rarity-1, Mastery-0 base table is exactly 2,200.
- The ten existing Companion Campaign stages use immutable two-member pools in roster order. The versioned post-migration run counter rotates deterministically within each pair.
- Tower uses a separate versioned deterministic targeting policy that can reach all 20.
- Pre-migration Campaign/Tower receipts are historical evidence. They remain byte-preserved under the two-placeholder policy and are never reinterpreted.
- Pending Tower, Village, and offline Companion entitlement is captured at the migration boundary. Pre-migration elapsed time is never repriced against the new roster.
- The exact pre-schema-13 checkpoint and authenticated migration receipt are required. Retry, recovery, import, and competing clients must converge on one migration, one checkpoint, and no duplicate reward.

## Private artwork contract

The 20 accepted 1024×1536 PNG masters remain outside the public repository. Runtime derivatives live only under `private-assets/companions/<id>/portrait.webp` and `private-assets/companions/<id>/thumb.webp`; the root is ignored and no rights-limited PNG or WebP may become tracked.

The tracked catalog records each accepted source SHA-256, `privateBuildOnly: true`, `publicReleaseAllowed: false`, and the fail-closed release policy. Roster views request 320×480 lazy thumbnails. A profile requests its 1024×1536 full portrait only when opened. Missing or unauthorized art resolves to the original Everstead Companion crest. A sanctuary portrait is always a full-background image; Phase 23 must never present it as a transparent dialogue or walking cutout.

## Production QA seam

The real candidate exposes `window.__EVERSTEAD_PHASE_23_QA__` only when the existing URL gate, explicit destructive authorization, isolated-storage attestation, and non-native storage adapter all pass. Its version is `phase-23-independent-qa-v1`. It is absent in the inactive realm and must never be a production fallback.

The bridge exposes these immutable groups:

- `read`: `definitions`, `snapshot`, `derive`, `validate`, `raw`, and `exportSave`.
- `destructive`: `resetFixture`, `reload`, `importFixture`, `advanceOffline`, `clearCampaign`, `clearTower`, `claimProgressReward`, `tutorial`, `probeInvalid`, and `simulateConcurrent`.

The browser gate supplies deterministic clock, IDs, random input, and memory storage. It instruments native Web Storage and requires zero native accesses. The bridge is used for setup and mutation; assertions independently inspect persisted state, receipts, derived models, and actual DOM.

## Required migration coverage

The gate covers fresh schema 13, invested schema 12, frozen two-ID history, pending offline entitlement, interrupted migration, recovery, export/import, malformed state, future state, reset, and concurrent-client paths. It checks:

- exact positional progression and assignment preservation;
- exactly 20 schema-13 rows in canonical order and no legacy IDs;
- canonical defaults for the other 18;
- one authenticated receipt and exact checkpoint lineage;
- byte-stable retry with no extra revision or reward;
- recovery and concurrency with one winner, a write-free loser, and no duplicate reward;
- no retroactive Campaign, Tower, Mastery, EXP, shard, or idle reward;
- all invalid Phase 23 mutations fail before persistence.

## Required targeting coverage

The gate clears each Campaign stage twice and requires the exact 20-ID roster order from the ten two-member pools. It then clears 20 Tower targets and requires the same complete deterministic coverage under the Tower policy. Every committed action creates exactly one receipt and one reward application. Reload must preserve the post-migration run counter and next target.

The gate also authenticates temporal composition across reward systems. It first freezes a real Tower-clear receipt, then claims Snorlax EXP, Dragonite shards, and global Mastery through the production Phase 12/15 claim coordinator. Those two Phase-23-only targets ensure the test cannot pass solely through the legacy two-position mapping. In a separate fixture it freezes a real Tower-idle receipt before making the same later claim. In both sequences the later reward must apply exactly once, an immediate replay must be refused without a write, schema-13 validation must remain green, the frozen Tower receipt must remain byte-identical, and reload must preserve one authenticated claim receipt with unchanged active bytes and revision.

## Required real-browser coverage

The actual app is exercised at 320×568, 390×844, 1024×768, 130% copy, and reduced motion, plus an inactive 390×844 realm. The DOM contract is:

- roster: `[data-phase23-companion-roster]`;
- derived count: `[data-phase23-companion-count]`;
- card: `[data-phase23-companion-card="<id>"]`;
- thumbnail: `[data-phase23-companion-thumb]`;
- profile: `[data-phase23-companion-profile="<id>"]`;
- full art: `[data-phase23-companion-full-art]`;
- close control: `[data-phase23-profile-close]`;
- Campaign/Tower target: `[data-phase23-companion-target]` with the versioned policy in `data-phase23-target-policy`.

All 20 production profiles must open, use full-background 2:3 art or the approved fallback, accept Escape, and return focus to their exact invoking card. Interactive Phase 23 controls are at least 44×44 CSS pixels. The gate also requires no horizontal overflow, safe 130% copy, authoritative reduced motion, exact five-item navigation, zero save writes and reward changes during browsing, and zero warning/error console entries.

## Tutorial and inherited behavior

The eight accepted Companion tutorial topics are optional, skippable, logged, replayable, accessible, gradual, and reward-neutral. Completed tutorial history survives migration without a popup cascade; at most one automatic tutorial may present on a safe visit.

Phase 23 must preserve Phase 6 Companion progression; Phase 11D roster/profile behavior; Phase 11F/11G player, unlock, and assignment behavior; Phase 12 claim and validation behavior; Phase 17 story/Wayfarer separation; Phase 20–21 facilities; and Phase 22 shell/feature behavior. Historical QA packages stay byte-frozen. The Phase 23 browser gate verifies the inherited state roots, bridge validations, 18 Fellows, 20 Family, separate Wayfarer, twelve facility anchors, four Fellowship tabs, and exact five-destination navigation after migration.

## Commands

Package integrity and contract only:

```sh
node qa/phase-23-independent/verify.mjs --package-only
```

Full static candidate gate:

```sh
node qa/phase-23-independent/verify.mjs
```

Serve the repository root and open `qa/phase-23-independent/` for the real-browser matrix. A pass requires zero failed rows and an empty fatal field.

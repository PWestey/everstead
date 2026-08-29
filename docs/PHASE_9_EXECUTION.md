# EVERSTEAD — PHASE 9 EXECUTION

## Production scope

Phase 9 implements the reviewed Player Rank unlock spine in the existing single-file application. It adds the exact twelve-entry unlock registry, five Rank roadmap definitions, fresh-versus-grandfather access authority, locked Adventure/Campaign presentation, the shared Wayfarer profile modal, and captured Rank-up result copy without changing Campaign or Relic receipts.

Persistence advances to schema 10 with the single `playerUnlocks` root, exact pre-v10 schema-9 checkpoint, twelve protected raw slots, schema-9-to-10 receipt identities, marker-v5 safe-reset authority, export/fixture coverage, verified reads, and native-storage cross-tab handling. Released schema 0–9 transactions remain delegated to their sealed recovery implementations before the schema-10 migration is constructed.

## Local production checks

- JavaScript parse check for the extracted application script.
- Focused isolated smoke matrix: fresh schema-10 boot, empty grandfather authority, twelve-slot export, locked Rank-1 direct-route and stage refusal, first-clear Rank-2 progression, unlocked route mutation, direct schema-9 migration/checkpoint/reload, schema-0 and schema-1 multi-hop migration/reload, grandfather route persistence, marker-v5 safe reset/reload, and locked/mobile UI selectors.
- `git diff --check`.
- Embedded asset aggregate comparison for source lines 12, 18, and 24 against the accepted Phase 8 base.

The additive Phase 9 CLI/browser gate, full fault matrix, Phase 8 semantic-successor verifier, manifests, and final result seal are intentionally deferred to the separate QA package after independent production review.

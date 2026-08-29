# EVERSTEAD — PHASE 9 EXECUTION

## Production scope

Phase 9 implements the reviewed Player Rank unlock spine in the existing single-file application. It adds the exact twelve-entry unlock registry, five Rank roadmap definitions, fresh-versus-grandfather access authority, locked Adventure/Campaign presentation, the shared Wayfarer profile modal, and captured Rank-up result copy without changing Campaign or Relic receipts.

Persistence advances to schema 10 with the single `playerUnlocks` root, exact pre-v10 schema-9 checkpoint, twelve protected raw slots, schema-9-to-10 receipt identities, marker-v5 safe-reset authority, export/fixture coverage, verified reads, and native-storage cross-tab handling. Released schema 0–9 transactions remain delegated to their sealed recovery implementations before the schema-10 migration is constructed.

## Local production checks

- JavaScript parse check for the extracted application script.
- Focused isolated smoke matrix: fresh schema-10 boot, empty grandfather authority, twelve-slot export, locked Rank-1 direct-route and stage refusal, first-clear Rank-2 progression, unlocked route mutation, direct schema-9 migration/checkpoint/reload, schema-0 and schema-1 multi-hop migration/reload, grandfather route persistence, marker-v5 safe reset/reload, and locked/mobile UI selectors.
- `git diff --check`.
- Embedded asset aggregate comparison for source lines 12, 18, and 24 against the accepted Phase 8 base.

## Additive QA package

After both independent production reviews passed exact tip `49e681a4a6d2edacfa1ee401c36590cd301797f6`, the additive package froze all Phase 0–8 evidence and added:

- a 316-row permanent CLI verifier for Rank definitions, access, canonical progression, twelve-slot persistence, deterministic staging, faults, fixture rollback, storage events, and QA Adventure authorization;
- a 703-row Phase 8 semantic-successor verifier with nine explicit replacements, including additive fail-closed QA Adventure hardening;
- an isolated live browser harness for both required phone dimensions, actual pointer/keyboard controls, normal/reduced-motion Rank-up presentation, grandfather access, Phase 8 reward preservation, and fail-closed authorization realms;
- a generated manifest, fourteen-file checksum set, and this exact result record.

No QA helper grants Rank EXP directly. The ten canonical first clears are the only executable source used to reach Rank 5 and 475 lifetime Rank EXP.

The first live run then exposed one inherited QA Adventure bridge boundary: it could read native storage before authorization and show a lock toast despite direct presentation suppression. Exact production commit `ee516296ddf823ba90b4a85ddc474456fada09f7` fixes this additively in the Phase 9 layer; the action now authorizes before handler/read and calls the same Rank-gated selector with `present:false`.

Independent review then passed the exact hardened production tip: the product/logic reviewer completed `53/53` targeted probes with matching artifact identity and confirmed the production delta is only the one-line additive wrapper; the persistence/recovery reviewer completed `120/120`. The focused Phase 9 verifier remained `316/316`, the Phase 8 semantic successor remained `703/703`, and embedded assets remained byte-identical.

A corrected browser debug run on package commit `35b3a1d69b3c08a084a84af029d55a104d75f043` completed `608/608` with blank fatal and zero warning/error console entries. It is explicitly pre-seal diagnostic evidence, not final live acceptance. The generated manifest therefore keeps `liveEvidence` null until both official runs complete on the exact review-sealed package.

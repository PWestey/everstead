# Phase 11E — Stewardship and living-world polish contract

## Authority

- `EVERSTEAD — LOCKED CORE DESIGN v1.2`, Drive file `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, remains product authority.
- `EVERSTEAD — IMPLEMENTATION ROADMAP v1.0`, Drive file `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, remains migration authority.
- Phase 11D commit `2203b4cc94eaa3a00421aaaca4d0e1dcf9c0ecc4` is the implementation baseline.

## Objective

Reduce avoidable save churn and structural risk while improving the daily-use hierarchy and the emotional usefulness of the existing Codex. This is a schema-neutral stewardship phase, not a new mechanic wave.

## In scope

### Save-neutral navigation

- Main navigation, Fellowship roster tabs, and Adventure route tabs update the current rendered session without writing Web Storage, incrementing `saveMeta.revision`, settling rewards, or recording a navigation transaction source.
- Rank and feature gates remain authoritative. Refused navigation changes neither the rendered route nor persistence.
- Leaving or changing an Adventure route still stops an active bounded-repeat job at its existing safe boundary.
- Campaign stage selection, Oath filtering, Focus Fellow, gameplay actions, assignments, equipment, upgrades, claims, and rewards retain their existing persistence behavior.
- Schema 11 continues to contain `ui`. A later authorized gameplay transaction may carry the session's current UI selection as incidental state; navigation itself performs no write.
- Village featured-character rotation becomes session-only so returning to the Village can feel alive without changing the save.

### Daily-use hierarchy and copy

- Claim Ready appears after the Adventure route tabs rather than above the route itself.
- When nothing is claimable, or only ordinary Village Gold is ready, Claim Ready uses a compact summary. Multi-lane, bonus-drop, blocked, or recovery-relevant states retain the detailed card.
- Player-facing repeat and Claim Ready copy describes player choices and outcomes, not receipts, transaction boundaries, or internal automation terminology.
- The 30,000 Gold reserve, per-run commits, fixed-stage behavior, bounded 1/3/5 counts, claim order, and all stop conditions remain mechanically unchanged.

### Save & Recovery presentation and release identity

- The normal Save Health surface leads with verification, last-saved time, Previous-save availability, and recovery-file readiness.
- Schema, revision, source, checkpoint counts, identities, byte counts, and storage-key details remain available under Advanced.
- The browser title and recovery-bundle `appVersion` use release identity `1.0.0-rc.1`.
- Persisted `state.version`, storage keys, recovery format version, save schema, and migration lineage remain unchanged for compatibility.
- Recovery bundles from earlier application releases remain importable when their active save is current schema 11 because `appVersion` stays informational.

### Codex presentation

- Existing Fellow, Family, and Companion art appears in their Codex entries.
- Existing titles, Fellow/Family quotes, relationship links, Relic icons, collection completion, and current dated gameplay records receive clearer presentation.
- All Codex state remains derived, read-only, and save-neutral.
- No Trophy Hall, Museum, milestone scene, CG, reward set, lore currency, or new collection reward is introduced; those remain Post-V1 where the Locked Core Design places them.

### Structural stewardship

- Phase 11E adds no new function-replacement alias chain in `index.html`.
- The Phase 11C navigation wrappers are folded into the active navigation functions.
- A checked-in structure map records active ownership and the remaining high-risk compatibility layers.
- Persistence and validation wrapper chains are not mechanically flattened in this phase. Their behavior and historical recovery paths require a dedicated equivalence contract before consolidation.
- Automated CI runs the Phase 11E successor gate on pushes and pull requests.

## Explicit design decisions and blockers

- Player Rank owns Adventure routes, stages, and system access.
- Prosperity owns lifetime Village/HQ progression only. It is non-spendable and does not currently modify Gold or Power.
- Exact Prosperity thresholds and HQ milestone effects remain unimplemented until an authoritative table is approved. See `PROSPERITY_HQ_DECISION.md`.
- Roster catch-up remains unimplemented until its grant timing, floor, cap, eligible dimensions, and migration behavior are approved. See `ROSTER_CATCH_UP_DECISION.md`.
- Schema-12 recovery requirements are locked as a release gate before any schema increment. See `RECOVERY_SCHEMA_POLICY.md`.

## Dependencies

- Phase 11D and its inherited Phase 11C/11B guarantees.
- Current schema-11 persistence, recovery, rank-access, and runtime-QA boundaries.

## Acceptance criteria

1. Main, roster, and Adventure navigation each succeed with exact active-save bytes, revision, updated time, source, staging, and storage-write count unchanged.
2. Locked and stale route refusals remain fail-closed and save-neutral.
3. Navigation during repeat still stops before the next run and preserves every completed run.
4. Returning to Village may change the displayed Fellow without changing `S.featured` or persistence.
5. Claim Ready is below route tabs, compact for empty/Village-Gold-only state, expanded for meaningful multi-lane/bonus/blocked state, and retains all Phase 11C mechanics.
6. Normal Save Health contains no visible Schema, Revision, checkpoint, or source terminology outside the closed Advanced disclosure.
7. Recovery exports report `appVersion: "1.0.0-rc.1"`; old schema-11 recovery files with older `appVersion` remain valid.
8. Codex roster entries show existing art and richer source-grounded identity/relationship information without any write or schema field.
9. Phase 11D, Phase 11C, and Phase 11B behavioral probes remain green except for deliberately superseded navigation-write presentation assertions.
10. Six isolated mobile realms pass at 320×568, 390×667, and 390×844 in normal and reduced-motion modes, with no horizontal overflow, native-storage access, or warning/error console output.
11. The deployable `index.html` remains self-contained and the five embedded assets remain byte-identical to Phase 11D.
12. CI executes the sealed Phase 11E verifier.

## Do not break

- Schema 11, storage namespace, backup keys, rollback/journal semantics, recovery format v1, and exact historical migration lineage.
- Oath rewards, Prosperity totals, Building Gold, Power equations, Player Rank gates, campaign costs/rewards, idle clocks, pity, claims, assignments, Relics, repeat bounds, or the 24-hour cap.
- Mobile shell, touch targets, modal semantics, keyboard tabs, focus return, reduced motion, QA bridge production restrictions, or native-storage isolation.

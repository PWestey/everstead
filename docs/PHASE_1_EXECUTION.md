# Phase 1 execution contract

## Scope and authority

Phase 1 implements visible Everstead branding and Village/Oath economy normalization on published Phase 0 tip `e2dfc24f513499e176ab5c2be3894c8e324c31ac`. It does not migrate the Fellow, Family, Companion, Campaign, Tower, Trading, Patrol, or Operations designs.

The product authority used for this implementation is:

- **EVERSTEAD — LOCKED CORE DESIGN v1.2**, document `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, Drive revision 7 / Docs revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`, modified 2026-08-27T22:20:15.835Z.
- **EVERSTEAD — IMPLEMENTATION ROADMAP v1.0**, document `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, Drive revision 3 / Docs revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`, modified 2026-08-27T21:56:44.268Z.

## Dependencies

- Gates 0A, 0B, and 0C are frozen at the published base.
- Gate 0B transactional staging, validation, recovery, conflict detection, and action-scoped Oath Undo remain the persistence foundation.
- Gate 0C feature flags, adapters, local QA bridge, clone isolation, and destructive-storage authorization remain active.

## Acceptance criteria

- Schema 0 and schema 1 saves migrate deterministically to schema 2; schema 2 is idempotent.
- The v0.1 raw backup remains write-once. A separate exact schema-1 backup is written and verified before any `buildings.*.operators` field is removed.
- Unknown fields, Unicode, pending scoped Undo, active storage identity, staging provenance, and recovery behavior survive migration.
- Building Gold uses base × level × neutral character/economy hooks × final Oath multiplier. Base rates, ×1.15 levels, upgrade costs, 3/5/8 percent boosts, 30 percent cap, and 2/4/7 Prosperity are exact.
- Offline accrual uses one captured clock, a 24-hour cap, local-midnight segmentation, rollback protection, valid timestamp zero, safe missing/invalid initialization, fractional retention, and atomic claims.
- Active UI branding says Everstead and ordinary production UI exposes no simulate, patrol-grant, or prototype-reset controls/routes.
- The existing mobile shell, embedded assets, rosters, Oath CRUD/undo, upgrades, feature flags, and unrelated legacy modes remain usable.

## Do not break

- Do not rename the active compatibility storage key or either historical Phase 0 artifact.
- Do not infer Family assignments or activate Family/Fellow/Companion/overall-day production bonuses.
- Do not change embedded images, layout foundations, Building bases, upgrade curve, Oath values, Prosperity meaning, or unrelated gameplay rewards.
- Do not expose the QA bridge outside the exact Gate 0C loopback and literal-`qa=1` contract.
- Do not merge or push from the implementation worktree.

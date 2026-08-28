# Everstead Phase 2 Execution Contract

Phase 2 migrates only the Fellow progression slice. It keeps the single-file mobile application, compatibility storage key, embedded assets, Phase 1 Building/Oath economy, and unrelated legacy modes.

Authority used:

- Locked Core Design v1.2 — `1t3NSgajWhndtjrLXuS8dY4jiujITKFmMtZFUjbeSZkg`, modified `2026-08-27T22:20:15.835Z`, revision `AIroW34MYqUcG6Q-iOW_AtHMqmrwGj9Nb9AFMEEqxselBNLMox14pJzqh11nWmvHfp6LI-QdrsXi6ruy1TNJJQXiXzh4BgLMN-zh7XtA8-I`.
- Implementation Roadmap v1.0 — `1REzV4KUPHqs_XBW92zFbTyU_UuunG3WcRqR9Tc7w900`, modified `2026-08-27T21:56:44.268Z`, revision `AIroW37XK-kLSvIWAi8bvi_c0B1TCCOIJCp93RQrxiAF8JmMMvgT0A9vnlZGdeAKQ_hSs674e9BNw9beXDa6RApDYcpXuZexshqiy4pvM_U`.

## Persistence invariants

- Schema migrations are ordered `0→1→2→3`; `schema-2-to-3` is recorded once.
- The exact schema-2 predecessor is written once to `oathforge_new_world_proto_v01__raw_backup_v2` and read back before active `fellows.*.training` is removed.
- The v0 and v1 write-once keys remain unchanged. Existing mismatched bytes at any checkpoint are preserved and block replacement.
- A Phase 1 schema-2 staging envelope is accepted only when deterministic projection proves its exact lineage from the active schema-0 or schema-1 payload. It then becomes the exact v2 checkpoint before schema 3 is staged.
- Multi-hop schema-3 staging is validated against the complete deterministic projection and its schema hop count, not an assumed `active revision + 1`.
- Missing-active recovery order is attested schema-3 staging, valid v2, valid v1, then exact v0. Corrupt active data never gains authority from an unattested later checkpoint.
- Fixture installation and rollback cover active/v0/v1/v2/staging. Rollback failures are explicit.

## Fellow invariants

- Persisted canonical inputs are `owned`, `exp`, `level`, `rarity`, per-character `shards`, numeric `bond`, and empty `relicSlots`. Known derived shadows are rejected in schema 3 and removed during migration.
- Valid legacy Training is floored and clamped to `1..120`; Level is identical and EXP is the exact cumulative threshold. Bond is copied numerically and cannot influence Level or EXP.
- `effectiveFellowPowerComponents(id,state)` is the only Power pipeline. It applies base and Level, rarity, then neutral Bond milestone, Relic, derived Companion binding, Family, and global hooks; rounding occurs once at the end.
- Locked Core v1.2 supersedes the roadmap’s older implied Bond-Power seed. Bond milestones are separate and Power-neutral during Phase 2.
- Total Fellow Roster Power is the exact sum of effective Power for every owned Fellow. Focus, featured Fellow, selected squad, counters, and Role balance do not affect it.
- Campaign efficiency is a non-playable Phase 5 preview. It uses only Total Fellow Roster Power and a positive recommended Power; invalid recommendations fail closed with no discount.
- Rarity ascension consumes only that Fellow’s exact shard threshold and cannot change EXP or Bond.

All EXP, rarity, counter, Role-balance, and efficiency numbers are centralized tunable balancing defaults, not permanent locked balance.

# Recovery policy for future save schemas

Recovery format version and active save schema are separate authorities. `appVersion` remains informational.

Before increasing `CURRENT_SCHEMA_VERSION` beyond 11, the release must:

1. Preserve byte-exact schema-11 recovery fixtures exported by the released application.
2. Inspect and authenticate the bundle before any write.
3. Run the same deterministic schema migrations used by normal bootstrap in an isolated candidate installation.
4. Validate the migrated target and its complete protected-checkpoint lineage before confirmation.
5. Show the source schema, target schema, migrations, and replacement consequences to the player.
6. Install through the existing journaled source-or-target transaction, protecting the former installation as Previous save.
7. Reject future, malformed, partial, or unauthenticated bundles without changing any slot.
8. Cover schema-11 import into the new schema across success, cancellation, quota failure, interruption, rollback, reload, and cross-tab interference.

No schema increment is release-ready while a valid released recovery bundle would become stranded.

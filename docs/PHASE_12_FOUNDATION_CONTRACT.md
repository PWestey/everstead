# Phase 12 — Story, Legacy, tutorial, and facility foundation contract

## Objective

Add the shared, dormant data and transaction foundation required by later narrative and Village-facility phases without authoring Phase 13 story content or Phase 16 Restaurant gameplay.

Phase 12 establishes:

- stable, namespaced identifiers and definition contracts for story, Chronicle, Legacy achievements and feats, tutorials, facilities, opportunities, rewards, claim offers, and claim receipts;
- a complete dialogue-actor registry covering every shipped Fellow and Family member;
- an idempotent same-schema activation for current schema-12 saves;
- explicit activation baselines that record prior counters without converting them into new progress;
- replay-safe, optional tutorial progress that can be scheduled across Player Ranks and stages;
- one shared exactly-once manual reward-claim transaction for later features;
- dormant legacy naming that cannot reactivate the retired Story, Tower, Trading, Patrol, or Operations modes.

## Dependencies

- Exact released base: `4ee1ee4` (Phase 11H).
- Current save schema: 12.
- Phase 11F schema-12 persistence authority and recovery.
- Phase 11G deterministic Fellow activation receipt.
- Existing `mutatePersisted` coordinator and feature-flag denylist.

## Definition and identifier contract

All new content identifiers are permanent, lowercase, dot-namespaced IDs. They match:

`^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$`

The first segment owns the namespace. IDs are never display text, never array positions, and never renamed for copy changes. A removed definition leaves a reserved ID instead of reusing it.

Required namespaces:

- `story.*`
- `chronicle.*`
- `legacy.achievement.*`
- `legacy.feat.*`
- `tutorial.*`
- `facility.*`
- `opportunity.*`
- `reward.offer.*`
- `reward.receipt.*`
- `fellow.*` and `family.*` for dialogue actors

The external `src/phase12-foundation.js` file owns the pure ID, reward-bundle, claim-offer, and receipt contracts. The inline app owns save mutation, roster-derived dialogue definitions, and integration with existing persistence.

## Activation and migration contract

Phase 12 is an additive, same-schema activation because schema 12 and its protected checkpoint lineage are already released. It must not rewrite or bypass that authority.

Activation is one `mutatePersisted` transaction with receipt ID `phase-12-foundation-activation`.

The receipt records:

- exact pre-activation raw identity;
- activation revision and time;
- permanent definition-set ID `definition-set.phase-12-foundation.v1` and config identity;
- transaction class `activation` and historical-statistic policy `unknown-historical`;
- explicit counters observed at activation;
- exact Fellow and Family dialogue actor IDs;
- an initialization identity over the receipt and newly initialized state.

The activation initializes all new progress empty:

- no story node is seen or completed;
- no Chronicle entry is unlocked or unread;
- no achievement or feat is progressed or claimed;
- no tutorial step is seen, completed, dismissed, or receipted;
- no facility is discovered or unlocked;
- no opportunity or reward offer is pending;
- no Phase 12 claim receipt exists.

Existing counters are retained only as a frozen baseline. They must not be credited as historical Phase 12 activity. Later counters measure progress after activation unless a future product decision explicitly defines a bounded, separately receipted catch-up.

Repeated boot is a no-op once the activation receipt exists.

## Tutorial contract

Every player-facing feature added from Phase 13 onward must register at least one tutorial definition before the feature can ship.

The required feature/tutorial pairs are registered before their later feature phases ship:

- Rank 1: First Covenant objective;
- Rank 2: dialogue scenes;
- Rank 3: Chronicle;
- Rank 4: Legacy;
- Rank 5: manual claims.

Each tutorial:

- has a stable tutorial ID and stable step IDs;
- declares gradual eligibility using Player Rank and/or stage ordinal;
- is informational and cannot gate the underlying feature action;
- appears at most once automatically per step;
- can be replayed deliberately without clearing completion;
- records replay counts separately from automatic presentation;
- tolerates skipped, dismissed, reordered, or unavailable presentation without blocking play;
- records an exact completion receipt once;
- permits skip and replay without a reward or duplicated completion receipt;
- is advanced only by an explicit acknowledgement transaction, never merely by rendering.

The initial definitions contain instructional structure only, not full Phase 13 narrative.

## Dialogue actor contract

Every shipped Fellow and Family definition must produce exactly one dialogue actor:

- Fellow actor ID: `fellow.<rosterId>`
- Family actor ID: `family.<rosterId>`

Each actor retains its roster ID, display name, title, art key, signature quote, and eligibility for Village quotes, authored story, and general dialogue. Actor IDs are stable even if display copy changes.

No shipped Fellow or Family member may be omitted from the registry. Companions and future characters require separate authored support and are not silently treated as Fellows or Family.

The QA-normalized speaker registry uses the underlying roster IDs so it can prove exact coverage against the released 18-Fellow and 20-Family rosters. The canonical saved actor identities remain the namespaced `fellow.*` and `family.*` IDs.

## Reward and claim contract

Later systems create a canonical pending reward offer with:

- one stable `reward.offer.*` ID;
- a stable source type and source ID;
- an offered-at timestamp;
- a canonical, positive-integer reward bundle;
- an identity bound to the save ID and the complete offer.

The shared claim path:

1. rejects blocked, stale, or invalid persistence before mutation;
2. re-reads the live pending offer inside `mutatePersisted`;
3. verifies the offer identity and caller-supplied expected identity;
4. rejects an already-receipted offer;
5. validates every reward and target before applying any reward;
6. applies the full bundle in one save transaction;
7. removes the pending offer and appends one canonical receipt;
8. binds the receipt to the pending identity, save ID, sequence, timestamp, and exact rewards;
9. returns the committed receipt; replaying the same claim cannot award again.

Phase 12 supplies the path but does not enqueue live story or facility rewards.

## Independent QA boundary

The Phase 12 QA bridge is absent unless the page has the exact localhost `?qa=1` URL, the runtime explicitly grants destructive QA access, isolated storage is explicitly attested, and the selected adapter is distinct from captured native `localStorage`. The whole bridge—not only its mutators—fails closed outside that boundary.

Its deterministic fixtures exercise fresh activation, an established schema-12 activation, a banked claim, tutorials, 24-hour offline capping, dormant legacy actions, and two-contender activation/claim races. Both race simulators use the production persistence coordinator; one contender wins and the stale contender performs no write.

## Acceptance criteria

- The pure foundation module loads before the app and publishes an immutable contract.
- All stable IDs are unique and contract-valid.
- Every shipped Fellow and Family member appears exactly once in the dialogue registry and is eligible for Village quotes, story, and dialogue.
- A fresh or existing valid schema-12 save activates once with empty Phase 12 progress and a frozen baseline.
- Reload does not add another activation receipt or change baseline values.
- Activation writes no protected checkpoint and a two-contender activation produces one receipt.
- Migration never invents prior story, Chronicle, Legacy, tutorial, facility, opportunity, or claim history.
- Canonical reward offers and receipts reject malformed IDs, unknown targets, zero/negative/fractional rewards, duplicates, and identity mismatches.
- The shared claim path is atomic and exactly once.
- Banked claims do not expire or auto-pay during offline settlement.
- Tutorial eligibility is deterministic, gradual, replay-safe, and never used as an action gate.
- Legacy Story data is clearly named as legacy source data while Fellow Campaign behavior remains unchanged.
- Story, Tower, Trading, Patrol, and Operations remain disabled even when runtime feature overrides request them.
- Existing save/recovery, Oaths, Village Gold, rosters, Campaign, offline settlement, the 24-hour cap, mobile navigation, feature flags, and Phase 11H cutouts continue to work.

## Do not break

- Do not change the storage namespace or schema version.
- Do not alter protected backup keys, staging semantics, save authority, or recovery order.
- Do not infer retroactive achievements or story completion from Campaign, Gold, Rank, Oaths, or roster state.
- Do not enqueue rewards during activation.
- Do not make tutorials modal prerequisites for player actions.
- Do not enable or route to the retired Story, Tower, Trading, Patrol, or Operations modes.
- Do not author the First Covenant narrative, Restaurant activities, or facility economy in this phase.
- Do not alter Gold rates, offline time, Oath rewards, combat Power, Campaign rewards, roster progression, portrait assets, or Village speaker cutouts.

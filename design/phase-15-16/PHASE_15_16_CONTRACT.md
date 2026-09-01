# Phases 15–16 — Waystone, Legacy, and Restaurant contract

## 1. Player outcomes

### Phase 15

The Village artwork becomes the primary game board. The central Waystone always answers:

- What is Everstead trying to accomplish now?
- Which Legacy rewards are ready?
- What meaningful next action can the player take?

Completing a Legacy tier or feat records eligibility only. The reward waits visibly at the Waystone until the player presses **Claim**. It never expires, pays automatically, or blocks story.

### Phase 16

The western-plaza Restaurant demonstrates the complete Village Life loop:

1. Customers bank while the player is away.
2. The player opens the Restaurant from its physical Village marker.
3. A customer shows readable preferences.
4. The player chooses and prepares an available recipe at an appropriate station.
5. Serving creates a visible result with exact sales, tip, and local-progress preview.
6. Nothing is credited until the player presses **Claim**.
7. The claim applies global and Restaurant-local effects exactly once.
8. Reputation, recipe mastery, stations, named visitors, Chronicle hooks, and achievements expand gradually.

Passive Village production continues unchanged underneath both phases.

## 2. Phase boundaries

### Phase 15 includes

- compact Village-map icon states bound to existing artwork;
- central Waystone objective and ready-count presentation;
- six continuing Legacy track identities and five one-time feat identities;
- individual standard and major claims;
- a reserved Founding Legacy Cache path for approved migrated-save grouping;
- honest statistic baselines and versioned reward eligibility;
- gradual Waystone/Legacy tutorials;
- accessible standard and major claim presentations;
- the successor validation, tutorial, claim-source, and receipt-archive contracts required before runtime integration.

### Phase 16 includes

- one Restaurant hotspot at the western plaza;
- non-expiring interval-banked customers;
- preference, recipe, station, preparation, service, sales, tip, local stock, recipe mastery, reputation, and named-visitor definitions;
- safe imperfect outcomes with no harsh loss state;
- First Covenant rumor/Chronicle hooks after committed named-visitor claims;
- Restaurant achievement metrics and claim eligibility;
- gradual discovery, service, claim, mastery, reputation, and named-visitor tutorials;
- a complete fresh/migrated/offline/reload/concurrency/mobile/reduced-motion fixture suite.

### Not approved here

- final Legacy thresholds or rewards;
- final customer cadence or bank capacity;
- final Restaurant prices, tips, costs, preparation time, stock limits, reputation curve, or active-profit share;
- final visible recipe/customer names or dialogue copy;
- sound, haptic, public-art, or public-character authorization;
- automation, daily resets, stamina, perishable stock, or expiring customers.

## 3. Stable identities

### Contract identities

- Phase 15 config: `phase-15-waystone-legacy-v1`
- Phase 15 definition set: `definition-set.phase-15-waystone-legacy.v1`
- Phase 15 tutorial registry: `tutorial-registry.phase-15.v1`
- Claim archive config: `claim-archive.phase-15.v1`
- Phase 16 config: `phase-16-restaurant-v1`
- Phase 16 definition set: `definition-set.phase-16-restaurant.v1`
- Phase 16 tutorial registry: `tutorial-registry.phase-16.v1`

Visible copy, localization, speakers, art, or layout may change without changing mechanical IDs. Eligibility, payload, result, or reward changes require their appropriate version field to advance. A pending item always keeps its captured versions.

## 4. Phase 15 Village game board

### 4.1 Map states

Every map location derives one of four states:

| State | Presentation | Meaning |
|---|---|---|
| `hidden` | No icon | Story has not introduced the location |
| `discovered` | Dim compact icon | The location is known but unavailable |
| `available` | Normal compact icon | The location can be opened |
| `ready` | Glowing icon plus accessible ready text/count | An opportunity or manual claim awaits attention |

State is derived from authoritative story/unlock and claim/opportunity data. It is not a second persisted unlock authority.

### 4.2 Mobile behavior

- Use the existing portrait Village art as the board.
- Bind Waystone to the central illuminated crystal and Restaurant to one western-plaza structure.
- Interactive targets are at least 44 by 44 CSS pixels and do not overlap bottom navigation or one another.
- At 320×568, show compact icons; reveal name, state, and next action in one selected-location sheet rather than permanent large labels.
- At 390×844 and wider layouts, more context may be visible without changing interaction order.
- Ready glow has a non-animated reduced-motion equivalent and never relies on color alone.
- Screen-reader labels include location, lock/ready state, ready count, and the primary action.
- Opening a marker does not settle rewards, start an activity, consume an item, or mark a tutorial complete.

### 4.3 Waystone priority

The Waystone sheet displays, in order:

1. current First Covenant objective and next meaningful action;
2. major story/Legacy claim ready;
3. standard Legacy claims ready;
4. current continuing-track progress;
5. Chronicle/Legacy history link.

The More screen may mirror the ready count, but the Village Waystone remains the primary destination. No new bottom-navigation item is added.

## 5. Legacy model

### 5.1 Native claim source

The Waystone is a presentation hub, not the economic source of a Legacy reward.

- Legacy claims use Phase 12 `sourceType: opportunity.legacy.reward`.
- `sourceId` is the exact registered tier, feat, or cache definition ID.
- Story milestone claims use `opportunity.story.reward`.
- Restaurant and later facilities use `opportunity.facility.activity` with the exact Phase 12 activity ID.

Phase 14's reserved `opportunity.facility.waystone.legacy-milestone` must not be instantiated for Legacy rewards. Misclassifying a Legacy claim as a facility claim would corrupt statistics and duplicate claim authority.

### 5.2 Continuing tracks

Six launch tracks are defined in `legacy-definitions.json`:

- Oathkeeper — accumulated Oath completions from an honest tracking boundary;
- Unbroken — highest observed Oath streak with a lower-bound migration baseline;
- Steward — Village production Gold manually collected after its tracking boundary;
- Builder — current combined levels of the four authoritative Buildings;
- Roadwarden — current Fellow Campaign first clears;
- Veteran — authoritative Campaign run counts available since their recorded baseline.

The existing Phase 12 `legacy.achievement.gold-claimed` is retained as a hidden reserved definition because its current metric counts Gold from reward claims, not Village Gold collected. It must not silently become Steward.

### 5.3 One-time feats

The first five feat identities commemorate:

- first Fellow Campaign clear;
- completion of the First Covenant;
- Player Rank 5;
- all Book I Fellows joined;
- a Campaign clear at exactly the required total-roster Power.

Only the first is already represented by a Phase 12 ID. The other definitions remain disabled until their authoritative eligibility event/state and any reward are approved.

### 5.4 Tier state

Every reward-bearing tier is exactly one of:

- `in-progress`
- `claim-ready`
- `claimed`

Evaluation may move `in-progress` to `claim-ready`, creating an immutable eligibility snapshot and native Phase 12 offer. Evaluation applies zero rewards. Claim commits the reward and claimed history, then evaluates only the next tier. Carried-over progress may make that next tier ready immediately, but it remains a separate manual claim.

### 5.5 Standard, major, and Founding claims

- Standard tiers use a focused card reveal and exact reward summary.
- Major tiers, story milestones, and exceptional feats use the larger claim presentation.
- Major rewards remain individually claimable.
- A Founding Legacy Cache may group multiple minor ready tiers only for an explicitly migrated established save and only when a non-null grouping policy is approved.
- The cache binds every component tier/feat identity, version, and reward. One transaction claims every component or none.
- Unknown historical activity is never converted into a cache reward.

### 5.6 Claim behavior

- The primary Claim button has no second confirmation dialog.
- Reward preview is exact before claim.
- Claim animations may accelerate; reduced motion still presents the complete summary.
- Presentation begins only after persistence commits.
- Closing presentation after commit never reverses the reward.
- A presentation failure reloads to claimed history, not claim-ready duplication.
- Unclaimed rewards never expire or block story, Campaign, Oaths, passive Gold, or facility activity.

## 6. Phase 15 migration and statistics

### 6.1 Honest baseline classes

- `derivable-authoritative`: evaluate current saved state exactly, such as Building levels and cleared Campaign prefix.
- `accumulated-from-boundary`: start from an explicit activation timestamp/revision because earlier lifetime history is unavailable.
- `lower-bound-current-state`: preserve a current observable value, such as the highest currently visible Oath streak, without calling it an all-time record.
- `authoritative-since-existing-baseline`: use a versioned existing ledger and its recorded baseline, such as Campaign run counts.
- `reserved-incompatible`: preserve an old ID without presenting it as a different achievement.

Every track declares one class. The UI states tracking scope where it is not true lifetime history.

### 6.2 Activation

One Phase 15 activation transaction:

- validates the Phase 12 foundation and exact successor lineage;
- captures one `now`, active raw identity, and revision;
- records statistic baselines and definition/tutorial/archive identities;
- atomically migrates Phase 12 pending offers and receipts into the V2 claim/archive store while preserving predecessor offer replay protection;
- creates empty claim-ready and claimed successor collections;
- adds no rewards and no retroactive accumulated activity;
- may evaluate derivable tracks only after activation commits;
- queues at most one recap tutorial on a later user-initiated safe visit.

Repeated activation is a write-free no-op. Malformed/future state enters existing recovery handling rather than being regenerated.

## 7. Phase 16 Restaurant lifecycle

```text
eligible elapsed
      ↓
banked customer ── begin ──→ service engagement
      ↑                         │ safe cancel before preparation commit
      └─────────────────────────┘
                                │ prepare/select + serve
                                ↓
                         claim-ready result
                                │ explicit Claim
                                ↓
                     sales + tip + local progress
```

### 7.1 Banking and offline

- Customers start accruing only after the Restaurant unlock transaction sets `unlockedAt` and `cursorAt` to captured current time.
- Existing saves receive no backdated customers.
- Instantiated customers never expire, reset at midnight, or disappear at capacity.
- Settlement uses the shared 24-hour elapsed allowance, no local-date segmentation, and no second clock read.
- Full capacity advances the cursor and retains no hidden whole-interval debt.
- Partial carry remains below the captured interval.
- Settlement creates only base Phase 12 opportunities and version-bound Restaurant details. It creates no offers, sales, tips, reputation, mastery, achievements, or receipts.
- Customer, cadence, capacity, and variant selection are deterministic from save-bound identity and ordinal.

### 7.2 Service interaction

Every customer detail contains readable preferences and a stable customer/visitor definition. The player chooses an available recipe and station.

- Before the preparation commit boundary, cancel returns the same customer to the bank.
- After the boundary, reload resumes the exact service engagement.
- Local prepared stock, if used, is reserved/consumed only through the trusted Restaurant adapter and never through presentation code.
- Serving validates the captured customer, preference, recipe, station, stock, definition, and economy-policy versions.
- A correct match may produce a stronger tip/reputation result; an imperfect match may produce a smaller result but never debt, lost global resources, or punitive story failure.
- The result is deterministic and contains exact global rewards and local deltas.
- Rendering the result pays nothing.

### 7.3 Restaurant claim

Resolution queues a Phase 12 offer with:

- `sourceType: opportunity.facility.activity`
- `sourceId: activity.restaurant-service`
- the reserved offer ID from the customer opportunity

The trusted Restaurant finalizer runs inside the same claim mutation as the Phase 12 global reward application. It validates all expected identities and then atomically:

- applies exact Gold sale/tip rewards;
- applies Restaurant reputation and recipe-mastery deltas;
- updates local stock effects that were explicitly bound to the outcome;
- marks customer and named-visitor lineage claimed;
- increments customers-served, matched-meals, named-visitors, and facility-profit metrics as applicable;
- creates one durable receipt/archive record;
- removes the pending opportunity/detail/outcome/offer.

If any validation or local effect fails, no global or local effect commits.

### 7.4 Restaurant progression

- Reputation and recipe mastery are non-spendable local tracks, not top-bar currencies.
- Stations and recipes unlock through stable definition references and approved reputation/story requirements.
- The first available recipe/station set is explicit migration/unlock data, not a random grant.
- Prepared stock remains inside the Restaurant and does not expire.
- Named visitors are authored non-expiring customer opportunities keyed by stable source IDs.
- Named-visitor Chronicle/story hooks queue only after the associated claim commits; replaying the scene cannot repeat the facility reward.

All level thresholds, recipe requirements, capacities, timings, sale values, tips, and progression amounts remain null until approved.

## 8. Economy guardrails

- Existing passive Building production is unchanged.
- Phase 15 claims use only approved existing reward kinds.
- Phase 16 active Restaurant profit is additive acceleration, not replacement income.
- `activeProfitTargetShare`, customer cadence/capacity, all sale/tip values, preparation values, and progression curves are null and production-blocking.
- No new global currency, stamina, daily ticket, perishable timer, negative Gold result, or permanent percentage multiplier is introduced.
- QA may use synthetic values clearly scoped to fixtures.
- Before Phase 16 enablement, simulate fresh, midgame, established, highly active, and mostly idle profiles; active Restaurant earnings must remain inside the approved share of total earnings over short and long horizons.

## 9. Tutorial delivery

### Phase 15 sequence

1. `tutorial.facility.board.discover-hotspots` — first safe Village visit after the Waystone/objective board is active.
2. `tutorial.legacy.tracks.first-progress` — first observed progress, not activation.
3. `tutorial.legacy.claim.first-ready` — first standard ready reward.
4. `tutorial.legacy.claim.major` — first major ready reward.
5. `tutorial.legacy.feats.first-feat` — first feat ready, potentially much later.

### Phase 16 sequence

1. `tutorial.restaurant.first-customer` — first user-initiated Restaurant visit.
2. `tutorial.facility.opportunities.banking` — first customer bank contains an item.
3. `tutorial.restaurant.first-claim` and `tutorial.facility.claim.first-ready` — first resolved service, with only one auto-presented item; the other enters the log/queue.
4. `tutorial.restaurant.recipes-and-stations` — approved Restaurant level 2 transition.
5. `tutorial.restaurant.reputation` — approved Restaurant level 3 transition.
6. `tutorial.restaurant.named-visitors` — first named visitor becomes ready.

All are non-blocking, skippable, logged, replayable, and limited to one auto-presentation per safe surface visit. Replay and skip cause zero opportunities, results, claims, rewards, stock, progression, or story effects.

`tutorial-extension.json` normalizes Phase 13 planning shorthand from `restaurant` to `facility.restaurant` and actor shorthand from `family:tifa` to `family.tifa`. Stable tutorial IDs do not change.

## 10. Cast and dialogue

- Phase 15 uses `fellow.lyra`, `family.isolde`, `family.syl`, `family.virginia`, and later `fellow.captain-america` for objective, record, claim, civic, and feat contexts.
- Phase 16 uses `family.tifa` as service guide, `family.tamsin` for banking/ambient context, `family.jaina` as the first named-route visitor, and `fellow.deadpool`, `fellow.star-lord`, `fellow.spider-man`, and `family.misty` for bounded customer/visitor/ambient hooks.
- All system-critical directions remain understandable without a speaker.
- Locked Fellows are excluded from selection.
- Dialogue is original Everstead functional writing, not imitation of external franchise voices or catchphrases.
- If no approved transparent cutout exists, use an attributed text-only panel or specifically approved framed treatment. Never use full-background profile art as an unframed Village overlay.
- `cast-hooks.json` schedules every current Fellow and Family actor across Phases 15–21 without crowding the Phase 15 opening or Phase 16 first service.

## 11. Concurrency and recovery

- Eligibility evaluation, offer creation, facility settlement, begin/cancel, resolution, and claim are separate mutation classes.
- Every mutation revalidates expected active raw, revision, save identity, config/definition versions, and live domain identities.
- Two-tab Legacy evaluation creates one ready offer.
- Two-tab Legacy or Restaurant claims apply one reward and leave one replay authority record.
- Two-tab Restaurant settlement derives identical ordinals; one commit wins and the loser writes nothing.
- A stale tab never presents success.
- Web Storage's narrow no-CAS final reread-to-write risk remains documented.
- Export/import/recovery preserve successor definitions, baselines, ready items, outcomes, offers, claimed lineage, tutorials, and claim archive.
- Import with missing/future definitions fails closed; it never drops ready claims or banked customers.

## 12. Acceptance gates

### Phase 15 gate

- Exact Waystone marker and sheet work at 320×568, 390×844, wider layouts, keyboard-only input, and reduced motion.
- No new bottom-navigation destination exists.
- All six tracks and five feats validate with unique stable IDs and explicit baseline classes.
- Null threshold/reward definitions cannot enable.
- Derivable and accumulated metrics never overclaim historical knowledge.
- Eligibility creates a claim-ready offer but applies zero reward.
- Claim applies the exact reward and next-tier transition once across reload and two tabs.
- Carried-over progress never auto-claims another tier.
- Standard/major presentation starts after commit and can accelerate safely.
- Legacy claim source remains native Legacy, never facility activity.
- Phase 15 tutorial state survives skip/replay/reload and creates no side effects.

### Phase 16 gate

- Restaurant opens from the western-plaza marker without breaking Village hotspots or bottom navigation.
- Unlock starts accrual at captured unlock time with no retroactive customers.
- Zero/negative/repeated, partial, midnight/DST, over-24-hour, saturated-bank, and rollback fixtures are deterministic.
- Customers and named visitors never expire.
- Begin/cancel/resume/serve cannot duplicate or silently consume a customer.
- Resolution creates one exact result and offer with zero credited rewards.
- Claim atomically applies global rewards, local progression, statistics, lineage, and one durable receipt/archive record.
- Imperfect service cannot create debt or a progression soft-lock.
- Named-visitor story/Chronicle hook queues only after claim and never duplicates reward.
- Active profit remains inside an approved simulated share before enablement.
- All seven Phase 16 cast hooks have deterministic availability and art fallback.
- Tutorials remain usable at required mobile sizes, localization expansion, keyboard-only input, and reduced motion.

## 13. Do not break

- Do not backdate Legacy accumulation or Restaurant customers.
- Do not let Waystone presentation become a second reward authority.
- Do not auto-credit on eligibility, offline settlement, opening, serving, rendering, tutorial, dialogue, or Chronicle replay.
- Do not reuse Phase 12 `legacy.achievement.gold-claimed` as Village Gold collected.
- Do not write Phase 13 shorthand facility/actor IDs into runtime state.
- Do not enable null economy values.
- Do not leave recurring Restaurant claims dependent on the 10,000-entry Phase 12 receipt array.
- Do not add a daily reset, expiration, stamina, facility currency, or arbitrary caller-supplied claim callback.

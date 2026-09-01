# Everstead Phase 17 — Independent Book I QA Contract

## Scope

This QA-only gate covers the full runtime expansion of **Book I — The First Covenant** across the ten released Fellow Campaign stages, Chronicle under More, story-driven discovery on the physical Village board, eight durable story projections, twelve gradual tutorials, and all 38 current cast actors. It changes no production runtime, design authority, artwork, deployment, merge, or remote branch.

Accepted Phase 12–16 seams remain mandatory: the central validated coordinator, canonical tutorial/cast state, five-tab shell, physical facility board, immutable registered finalizers, bounded V2 claim archive, and Restaurant successor. Phase 17 may extend these seams but may not replace or weaken them.

## Frozen bridge

The trusted local/query-gated bridge is `window.__EVERSTEAD_PHASE_17_QA__`, version `phase-17-independent-qa-v1`. Destructive access requires literal `runtime.qa.allowDestructive === true`, literal `runtime.qa.isolatedStorage === true`, and a selected injected storage adapter that is not the captured native `localStorage` object. Caller-supplied finalizer callbacks are forbidden.

Read-only surface:

- `definitions()` returns exact definition-set lineage, six Book sections, ten stage mappings, 31 scenes, arrival ordering, five disabled reward definitions, twelve facility unlock records, scoped aliases, eight Village changes, twelve tutorials, 38 cast actors, inherited seam attestations, and presentation rules.
- `snapshot()`, `validate()`, `derive()`, `raw()`, and `exportSave()` expose normalized observations without mutation.
- `passiveBaseline({capturedAt,excludeWallClockDerived:true})` returns immutable original four Building production/upgrades, global Gold/Oath semantics, and Family assignments at one captured time. It declares `day`, `boostDay`, `lastGoldAt`, and `lastSeen` excluded so legitimate day-rollover or clock drift is never mistaken for a story regression.
- `chronicle()` returns Book → chapter → scene grouping, spoiler-safe locked entries, replay/log availability, and captured definition versions.

Isolated destructive surface:

- `resetFixture(id)`, `reload()`, `importFixture(payload)`, `advanceOffline(ms)`, and `mutateInvalid(kind)` cover fresh, migrated, rank-jump, offline, recovery, corrupt, future, and malformed saves.
- `event(type,payload)` delivers exact story, capability, opening, and QA alias-probe events.
- `openStory(sceneId)` and `openChronicle()` are presentation-only.
- `resolveScene(sceneId,mode,choiceId)` accepts only the current queue item and watched/skipped mode, then writes one Chronicle record and derived consequences in one validated commit.
- `replayScene(sceneId,options)` renders the captured definition version without a write.
- `clearStage(stageId,{firstClear})` invokes the released Campaign transaction and emits Phase 17 eligibility only after its commit.
- `safeVisit(context)` reconciles one safe foreground presentation without granting mechanical truth.
- `tutorial(id,action)` supports open, skip, log, and replay without game effects.
- `claim(offerId,identity)` invokes only the immutable registered native story finalizer.
- `simulateConcurrent(kind)` races scene resolution, arrival queue mutation, or story claim.
- `probeFinalizerFailure(mode)` proves missing, throwing, and archive finalizers abort atomically.

## Story ordering and neutrality

The runtime uses exactly six sections, ten stable stage mappings, 31 stable scene IDs, four ascending Rank-arrival scenes, four optional interludes, and five native story reward definitions. Stage intros occur before spend confirmation and cannot alter battle math. Campaign first-clear commits its released cost, reward, Rank, and roster transaction before the matching resolution becomes eligible.

When a clear crosses Rank, ordering is Campaign commit → stage resolution → Rank arrival → arrival tutorial. Rank jumps queue Rank 2, 3, 4, then 5, with at most one arrival or recap per safe Village visit. Arrivals observe the authoritative joined roster; they never grant or repair characters. Repeat clears may show a contextual line but must not change story, facilities, visuals, tutorials, rewards, Rank, or rosters.

Watching and Skip both complete a queued scene; Skip never claims. Replay and dialogue log are byte-neutral. Offline time never watches, skips, resolves, completes, tutorials, offers, rewards, claims, facilities, or Village projections. Eligibility reconciliation occurs only on a safe foreground visit from already committed stage/Rank truth.

Campaign walking/slideshow presentation identifies the stable **`player.wayfarer`** as a separate `player-character` linked only to existing `player.rank` and `player.rankExp`. The Wayfarer never enters Fellow, Family, or Companion roster counts; never has shards, rarity, assignments, facility-speaker eligibility, or combat Power; and never displaces any of the 38 accepted cast hooks. The exact 1024×1536 RGB full-background source (`asset.player.wayfarer.profile-full.v1`, SHA-256 `a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf`) is reserved for title/profile only. Campaign uses an explicitly approved transparent cutout or, until one exists, an original Everstead silhouette or attributed static marker. It must never overlay the RGB title art as a fake cutout.

Migration infers history only from committed first clears, never Rank guesses. Historical content becomes bounded `migrated-recap` Chronicle records or optional recap eligibility, with no forced scene dump and no retroactive reward. Newly inserted scenes in cleared chapters are recaps. Unknown evidence yields less completion. Import, recovery, and migration are additive, idempotent, version-bound, and preserve predecessor tutorial/claim history and the exact backup.

## Village unlocks, aliases, and projections

All twelve facilities have one unique canonical physical anchor. Story completion supplies discovery only. Active availability additionally needs the exact capability and authored opening content. A discovered future facility remains dim/locked; an already operational successor is grandfathered, gains context, and is never re-locked or re-granted.

Anchor aliases are facility-scoped. Specifically, legacy `western-plaza` resolves to `western-plaza-restaurant` only in `facility.restaurant` scope. Unscoped `western-plaza` remains a regional visual-projection anchor and must never ambiguously select Restaurant or Market/Workshop. Canonical persisted facility anchors are never rewritten to a regional alias.

The Command Center, Archives, Training Grounds, and Hearth retain passive production, upgrades, Oath multipliers, Gold, and Family assignments independently of story or active-activity state. QA compares these immutable semantics before and after story work inside the same fixture at one captured time; it does not compare wall-clock-derived fields across fixture resets. Prosperity and Headquarters thresholds remain null and forbidden.

Eight Village changes are derived solely from committed scene resolution. They survive reload/import/migration, cannot be independently granted, and use approved static accessible text fallbacks while art/CSS treatment IDs are null. Reduced motion disables looping glow, parallax, camera movement, automatic pan, walking, and long transitions.

The live reduced-motion realm sets the production-observable root attribute `data-everstead-reduced-motion="reduce"`; production must also retain a static `@media (prefers-reduced-motion: reduce)` CSS guard. The gate reads actual computed animation and transition styles plus a `data-motion-state="static"` attestation on story, Village-change, and Campaign-player nodes. The runner must not monkey-patch `matchMedia` and then treat its own patch as proof of CSS behavior.

## Chronicle, rewards, tutorials, and cast

Chronicle remains inside **More**, preserving five bottom tabs. It groups Book → chapter → scene, displays spoiler-safe locked entries, and exposes replay plus current/replayed dialogue logs. There is no auto-advance.

All five accepted reward arrays are null/disabled, so production creates no offer or credit. Any future approved story reward is a manual, banked, non-expiring `opportunity.story.reward` offer, captured by definition version and claimed exact-once through the immutable Phase 15 V2 finalizer. Scene opening, watching, Skip, replay, tutorial, offline time, Book completion, and animation never auto-credit. Synthetic rewards exist only inside isolated QA fixtures.

The twelve accepted Phase 17 tutorial IDs remain inside the exact 79-ID successor ledger. They are contextual, immediately skippable, logged, replayable, nonblocking, localization-safe, rewardless, and mechanically neutral. Story resolution and arrival ordering win on crowded visits; at most one tutorial auto-presents on a safe surface.

All 18 Fellows and 20 Family actors preserve their Phase 13 primary assignments and Phase 15–16 hooks. Locked Fellows never speak. Mechanical instructions are speaker-independent. Dialogue uses only approved transparent cutout, approved framed treatment, or attributed text-only fallback; unframed background portraits are forbidden in Village dialogue. Copy must be original Everstead writing and must not imitate recognizable franchise voice, cadence, catchphrase, or scenes.

## Save, concurrency, and validation

The optional `storyV1` successor is schema version 1 and stores ordered unique scene, skipped, Book, queue, Chronicle, recap, acknowledgement, and active-definition identities. Eligibility never depends on timestamps. Unknown/future schema or definition sets, duplicate identities, invalid skipped/completed relationships, Book without finale, resolved queued scenes, invalid Chronicle resolution/version, unreproducible facility/visual projection, unsupported actor/facility/stage/tutorial/reward/hook, receipt mismatch, or economic threshold fails closed into recovery while leaving the original exportable.

Scene resolution, arrival queue mutation, and native story claim use revision/raw identity, staging provenance, current active reread, same-tab guard, storage events, and the central validated commit coordinator. Each two-client race has exactly one winner; the loser writes nothing and cannot duplicate Chronicle, queue, offer, or receipt identity. Web Storage's known lack of compare-and-swap remains a documented residual race.

## Actual-DOM gate and blind spots

Five isolated browser realms cover 320×568, 390×844, 1024×768, reduced motion, keyboard-only use, and 30 percent localized-copy expansion. The runner queries actual nodes and styles for five navigation items, Chronicle under More, spoiler-safe entries, replay, scene title/dialogue, Next, Skip, Log, Back, Close, 44×44 targets, focus entry/return, Escape, status announcements, non-color labels, overflow, static reduced-motion presentation, and the separate `player.wayfarer` Campaign marker with an approved/fallback asset mode.

Normalized output alone cannot prove visual hierarchy, story writing quality, art authorization, real-device behavior, or every focus path. Root review must inspect changed production code, actual DOM at all target realms, original-four passive baselines, Phase 12–16 regressions, localized copy, and visible fallback composition before integration.

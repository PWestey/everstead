# Phase 24C — Durable ladders implementation plan

**Status:** Phase 24C-2A accepted locally as an unloaded authority revision; no production, save, balance, or release change  
**Plan ID:** `phase-24c-durable-ladders-plan.v1`  
**Predecessors:** accepted Phase 23 schema-13 candidate, accepted Phase 24A scaling baseline, and an accepted Phase 24B simulation package  
**Authority:** the newest `EVERSTEAD_PRODUCT_HANDOFF.md`, with the conflict resolutions recorded below  
**Authorization boundary:** this plan does not authorize a commit, merge, push, deployment, public release, rights-limited artwork distribution, or activation of any proposed reward

## 1. Outcome

Phase 24C should install one data-driven, versioned foundation for long-lived
progression without repricing released play. It must support:

- uncapped additive Collection Power, Earnings, EXP, and facility-local pools;
- exactly-once manual Collection, Family, Legacy, story, and facility claims;
- Player Rank definitions through Rank 30 while releasing only content-backed
  Rank groups;
- aligned Family shard claims at Intimacy 150, 300, 500, and 1,000;
- narrative-only long-horizon Family claims at 750, 1,000, 1,500, and 2,000;
- continuing Legacy tracks with fixed, widening authored tiers;
- fixed future-content requirement tables generated for authoring and frozen
  before release; and
- gradual, replay-safe tutorials and purposeful current-cast participation.

Phase 24C is not a license to choose EXP bands, Breakthrough materials,
Collection percentages, Book II requirements, reward quantities, Rank unlocks,
or live release ceilings. Those values must arrive from an accepted Phase 24B
simulation or a later explicitly approved content manifest.

## 2. Binding principles

1. **Definitions are immutable after release.** Every table, tier, claim, and
   reward has a stable ID, definition version, reward version, and content
   release ID. Corrections use a successor definition and an explicit migration.
2. **Eligibility is not payment.** Meeting a requirement creates or reveals a
   durable manual claim. The reward is applied only when Claim commits.
3. **Every claim is one coordinator transaction.** It revalidates eligibility,
   applies the captured reward, records the claim receipt, advances any domain
   state, and removes the pending offer atomically.
4. **Delayed claims are never repriced.** A ready claim captures its definition,
   reward version, exact reward bundle, structural Gold/hour snapshot when
   relevant, and every basis-point grant. Later Power or production changes do
   not alter it.
5. **No Collection cap exists.** Each authored milestone is finite, but future
   milestones continue adding fixed integer basis points to named pools. Release
   budgets control authoring cadence; they are not lifetime ceilings.
6. **Percentages add against a named base.** They never multiply an
   already-boosted final result, one another, or a second pool.
7. **Released requirements stay fixed.** Runtime play reads frozen tables, never
   a generator and never another player, cohort, or server total.
8. **Mandatory progression assumes permanent content only.** Limited content
   may reward collectors, but cannot become a hidden requirement.
9. **Current value is preserved.** Migration may recognize an earned result; it
   may not revoke, silently reprice, auto-spend, or duplicate it.
10. **New features arrive with context.** Tutorials are optional, skippable,
    logged, replayable, accessible, and incapable of repeating a mutation or
    reward. Every current Fellow and Family member remains part of the active
    cast over time.

## 3. Authority conflicts and resolutions

### 3.1 Released Broken Roads requirements

The accepted Phase 24A/runtime table is:

`22,000 / 28,500 / 36,000 / 45,000 / 56,000 / 69,000 / 84,000 / 101,000 / 121,000 / 144,000`.

Appendix C also contains a stale prose table ending at 95,000. Phase 24C must
preserve the frozen released 144,000-endpoint table byte-semantically. The stale
table is not a migration input and cannot reprice existing stages. Future
chapters use new IDs and new frozen tables.

### 3.2 Collection caps

Any older `+30%`, `+20%`, or `+25%` Collection maximum is obsolete. Validation
must reject a manifest that declares a shared lifetime cap, overflow conversion,
or discarded basis points. Stress fixtures through at least +1,000% cumulative
bonuses are QA points, not caps.

### 3.3 Intimacy 1,000 serves two lanes

Intimacy 1,000 is both the existing 40-shard Family supplement threshold and a
reserved long-horizon narrative threshold. These are separate claims with
separate stable source IDs and receipts. The narrative claim may award only
authored scenes, quotes, Chronicle pages, Promise variants, keepsakes, titles,
or cosmetics; it adds no Building, Fellow, or Collection percentage. Claiming
one never implicitly claims the other.

### 3.4 Rank capacity is not released content

The data shape must validate Rank 1–30. Only a release manifest backed by story,
arrivals, facilities or seats, districts, and sufficient fixed Rank EXP sources
may advance the playable Rank ceiling. Reserved Rank rows are not visible empty
bars and cannot be reached merely because the schema can represent them.

### 3.5 Phase 24B is an input gate

No simulated Fellow or Companion table is live merely because Phase 24C can
store it. Phase 24C consumes only an **accepted** Phase 24B package whose machine
report, human report, config/table hashes, and profile fixtures are frozen. A
missing, changed, provisional, or rejected Phase 24B identity fails closed and
leaves current Phase 23 progression active.

### 3.6 Direct-current-schema fresh and reset authority

The earlier planning note was superseded by the accepted Phase 23 implementation:
the current empty-origin app boot already constructs a direct schema-13 profile
through `phase23FreshState`. It carries no schema-12-to-13 receipt, Companion
transfer floor, or historical migration entitlement. Phase 24C-2 therefore
continues that policy for schema 14.

- A genuinely new profile is created directly in schema 14 at revision 1 with a
  new `saveId`, zero Collection totals, no historical migration receipt, and no
  fabricated predecessor checkpoint or reward.
- A full safe reset creates the same direct-fresh schema-14 baseline under a new
  `saveId`. It retains the complete prior installation as Previous Save and
  binds every protected slot, but carries no gameplay, Collection, claim,
  limited-event, migration-floor, or pending-reward value into the new profile.
- Only a real schema-13 predecessor receives an exact write-once pre-v14
  checkpoint and one reward-neutral schema-13-to-14 migration receipt.
- Schema-12 recovery/import performs the authentic schema-12-to-13 migration
  first and the authentic schema-13-to-14 migration second.
- Recovery, restore, and import replace one authenticated installation with
  another. They never merge reward histories or Collection totals across
  `saveId`s.

The direct fresh fixture must preserve the accepted Phase 24A anchors at zero
Collection bonus: 35,565 Fellow Combat Power, 35,150 Fellow Economy Power,
2,200 Companion Power, and 27,320.8092192 Gold/hour. Existing migrated profiles
retain their legitimate receipt, floor, history, pending state, and player value.
No account-level entitlement survives a full local reset because Everstead has
no such authority today.

### 3.7 Legacy percentages use the newer numeric authority

An older Legacy reward palette mentions small capped permanent bonuses. The
newer Appendix C authority says no Legacy reward grants a new permanent generic
percentage and requires permanent percentages to enter only through named
Collection pools. Phase 24C follows the newer rule: an achievement may recognize
a Collection completion, but any mechanical percentage must be an independently
versioned Collection grant with Collection provenance, basis points, release
budget accounting, and exactly-once receipt. A Legacy tier by itself grants no
generic multiplier.

## 4. Proposed data topology

Use focused external definition files and one coordinated successor authority.
`schemaVersion: 14` is reserved by the accepted unloaded Phase 24C package
because schema 13 is the accepted production predecessor. Runtime integration
must still re-confirm that allocation immediately before the production loader
or save coordinator changes.

### 4.1 Immutable definition authority

The Phase 24C definition package should expose one deeply frozen manifest:

```text
phase24cDefinitionManifest
  configId
  manifestId / manifestHash
  predecessorScalingId / predecessorScalingHash
  acceptedSimulationId / acceptedSimulationHash
  releaseManifestsById
  rankTable
  familyMilestoneDefinitions
  legacyTrackDefinitions
  collectionDefinitions
  requirementTablesById
  tutorialDefinitions
  castCoverageRequirements
```

Every child definition carries a stable ID and version. Definition validators
must reject duplicate IDs, missing references, unsafe integers, non-integer
basis points, unknown reward kinds, unknown actors, unknown facilities,
non-monotonic tier/Rank/requirement tables, a released row without a content
dependency, or any mutation of an already-frozen definition.

### 4.2 Durable save state

The successor save adds one bounded `durableProgression` root rather than
parallel per-feature ledgers:

```text
durableProgression
  configId / manifestId
  activatedAt
  activeReleaseIds[]
  collections
    checkpoint
      throughSequence
      totals
        powerBps
        earningsBps
        expBps
        facilityBpsByFacilityId
      contributionCount
      priorIdentity
      identity
    recentGrantReceipts[]
    claimedDefinitionIds[]
  migrations
    lineageKind
    activationReceiptId
    familyAlignmentReceiptId
    predecessorSemanticIdentity
    predecessorRawIdentity
    predecessorCheckpointIdentity
    bootstrapPolicy
    resetLineagePolicy
    directOriginAttestation
```

The exact implementation may reuse existing canonical maps and arrays where
that avoids duplication. There must be only one authority for each fact:

- Family Intimacy remains in the Family roster state.
- Player Rank EXP remains in `player.rankExp`.
- current and lifetime metrics stay either derivable from authoritative state or
  accumulated in the existing `legacyProgress` authority from committed source
  transactions, never copied into competing counters;
- Family, narrative, and Legacy readiness remains in the existing Phase 15
  pending-offer store, and their claimed source IDs remain in its durable claim
  archive rather than being restated in `durableProgression`;
- pending offers and detailed claim receipts continue through the existing
  Phase 15 claim archive/finalizer seam;
- Collection totals derive from authenticated grant receipts plus a bounded
  checkpoint, not from an independently editable bonus number.

The checkpoint folds old Collection grant receipts without losing replay
authority, per-pool totals, per-facility totals, contribution count, release
provenance, or the identity chain. `claimedDefinitionIds` remains permanent
replay authority even when a detailed receipt has folded.

### 4.3 Release manifest

Each release manifest declares:

- release ID, version, status (`reserved`, `private-candidate`, or `active`), and
  immutable content dependency IDs;
- accepted Phase 24B simulation identity and predecessor authority identity;
- currently obtainable permanent and limited Collection totals by pool;
- every included Collection grant definition and whether it is permanent,
  rerunnable-limited, or limited-with-permanent-alternative;
- the permanent-only, median permanent-only, high permanent-only, and high
  all-content fixtures used to freeze requirements;
- fixed requirement table IDs and hashes;
- authored Rank rows actually released by this content;
- achievement tier pages and Family narrative definitions made active;
- tutorial IDs, unlock triggers, speakers, fallbacks, and cast-coverage deltas;
- safe-integer, +1,000% pool, long-horizon, offline, and claim-race report hashes.

Release budgets from the handoff are validation/reporting targets, never a
clamp. The manifest discloses the maximum currently obtainable basis-point
total, but runtime addition has no global ceiling.

## 5. Domain contracts

### 5.1 Collection pools

Only four pool shapes are legal:

```text
Collection Power Bonus   = claimed powerBps / 10,000
Collection Earnings Bonus = claimed earningsBps / 10,000
Collection EXP Bonus     = claimed expBps / 10,000
Facility Collection Bonus = claimed facilityBps[facilityId] / 10,000
```

The binding application order is:

- Collection Power adds beside Might in the Fellow final additive pool.
- Collection Earnings adds beside the Oath bonus in Building production.
- eligible Fellow or Companion EXP settlement is
  `raw earned EXP × (1 + Collection EXP Bonus)`.
- an active facility claim is
  `base active reward × (1 + existing authored active bonus + local pool)`.

Collection EXP does not affect Rank EXP, Intimacy, achievement/event progress,
full-level grants, or a previously captured claim. Facility-local pools do not
affect passive Building production and do not leak between facilities.

Every grant definition contains exactly one target pool, integer basis points,
content-release provenance, limited/permanent classification, claim source ID,
definition/reward versions, and any permanent alternative ID. It cannot create
a fifth global pool or its own multiplier term.

Collection claim UI must show old pool total, gained basis points, and new
total. Runtime validates the derived old total immediately before commit. A
stale offer or changed manifest refuses with zero state, raw, revision, toast,
modal, or storage mutation.

### 5.2 Player Rank 1–30

Freeze an exact Rank 1–30 lookup table generated from the locked formula:

```text
total Rank EXP for Rank r = 25 × ([r × (r + 1) / 2] − 1)
```

The table, not a runtime generator, is authority. It preserves Rank 1–10 and
the locked anchors of 2,975 at Rank 15, 5,225 at Rank 20, 8,100 at Rank 25, and
11,600 at Rank 30. Every row has release state and content dependency IDs.

`capacityThrough: 30` and `releasedThrough` are distinct. Rank calculation stops
at the highest active row. Reserved rows neither appear nor accept Rank EXP as
completed content. Because `player.rankExp` is cumulative, valid Rank EXP always
continues banking safely beyond `releasedThrough` while the displayed Rank stays
capped at the highest active row. Banking is not optional, and no earned Rank
EXP is discarded, clamped, converted, or silently spent.

When a content-backed manifest activates later Rank rows, already-banked Rank
EXP may qualify immediately. The activation transaction records the exact old
and new released boundaries, then queues every newly eligible Rank transition,
arrival, tutorial, story beat, or unlock acknowledgment exactly once in authored
order. It never auto-pays a Rank reward or repeats an arrival because several
Ranks became eligible together.

No Rank row may require current Gold, a new Fame currency, a limited Collection,
or dynamic server state. Any second gate uses an authored non-spendable Story,
Covenant, or approved Prosperity milestone.

### 5.3 Family Intimacy

Keep the existing +10 Intimacy per Gift, the two economic formula lanes, and
their Intimacy contribution endpoint at 500. Higher Intimacy remains valuable
through narrative, quotes, Chronicle, Legacy, and cosmetics, not stronger
Building or Fellow percentages.

The aligned shard definitions preserve the existing lifetime supplement:

| Source threshold | Target threshold | Targeted shards | Migration rule |
|---:|---:|---:|---|
| 150 | 150 | 5 | Preserve claimed; otherwise create readiness from current Intimacy. |
| 300 | 300 | 10 | Preserve claimed; otherwise create readiness from current Intimacy. |
| 600 | 500 | 20 | Claimed 600 maps to claimed 500 with no grant; unclaimed Intimacy 500+ becomes ready. |
| 1,000 | 1,000 | 40 | Preserve claimed; otherwise create readiness from current Intimacy. |

The target definitions use new stable source IDs and manual claims. An existing
claimed marker is migration evidence, not a reason to add shards again.

Narrative-only long-horizon definitions are reserved at 750, 1,000, 1,500, and
2,000. They require authored content and reward bundles before activation. The
save can represent their claim state immediately, but an empty placeholder must
not become a visible claim.

All Family definitions remain per stable Family ID. A claim for one member
cannot satisfy or consume another member's milestone.

### 5.4 Continuing Legacy tracks

Continuing tracks use authored tier pages. The default count sequence is:

`1 → 5 → 15 → 35 → 75 → 150 → 300 → 600 → 1,200 → 2,400 → 4,800 …`

Fast or slow metrics may use a different early page only after simulation, but
all active thresholds are explicit and monotonic. Runtime never extrapolates an
infinite reward table.

Each tier has `in-progress`, `ready`, or `claimed` presentation. Progress carries
past the active target. Claiming one tier activates the next authored tier; if
carried progress already qualifies, the next tier becomes separately ready and
is not auto-paid.

Gold rewards capture structural Gold/hour when readiness first commits. Early
Gold-equivalent budgets may use the locked 0.25, 0.5, 1, 1.5, and 2 structural
hours; later direct Gold remains at or below two structural hours and moves
additional value into approved fixed resources or authored content. Exact
amounts require the accepted simulation. No Legacy tier creates a permanent
generic percentage or an uncapped repeatable economy exploit.

Derivable metrics are evaluated from current authoritative state. Accumulated
lifetime metrics begin from their documented post-activation or migration
baseline. Migration never invents historical actions that the predecessor did
not record.

### 5.5 Fixed future-content requirements

Authoring helpers may propose a table, but publication freezes explicit integer
rows with a table ID, version, content scope, simulation hash, rounding policy,
and release hash. Runtime reads only the frozen rows.

- The released Broken Roads table remains unchanged.
- Existing Companion Campaign, Companion Tower, and Fellow Expedition tables
  remain unchanged unless a separate approved migration names them.
- A future chapter uses a new table ID. Its draft 1.18 growth and approximate
  1.20 chapter break are authoring inputs only.
- Every new mandatory table is tested against zero-Collection and
  permanent-only profiles available for that release. Limited ownership is
  reported but never required.
- Future Collections never raise an older requirement. A player outgrowing old
  content is an intended reward.

### 5.6 Tutorials and cast participation

Phase 24C adds tutorials only when their features become meaningful:

1. first Collection set becomes ready;
2. first Collection claim and additive-pool breakdown;
3. first continuing Legacy tier progress;
4. first separately ready carried-over tier;
5. first Family milestone claim after alignment;
6. first Breakthrough or higher Rank group only when that content releases; and
7. the secondary “where this number came from” detail surface.

Tutorial definitions use stable feature/tutorial/step IDs, actual unlock or
first-use triggers, no reward, and one auto-presentation maximum per safe
surface visit. Skip, completion, reload, and replay preserve the ledger and
never repeat a side effect.

The cast-coverage manifest is derived against the exact current 18 Fellow and
20 Family stable IDs already represented by the Phase 17 Book I cast. Every
current member must resolve to at least one quote, Village comment, tutorial,
story scene, Chronicle/interlude, or facility role. Phase 24C records additions
and remaining scheduled roles; it does not force all 38 characters into the
first Collection explanation. Locked roster members cannot speak early unless
the established story policy explicitly permits their attributed appearance.

## 6. Dependency-ordered implementation sequence

### 24C-0 — Accept and pin simulation inputs

**Input:** Phase 24A exact hashes and a completed Phase 24B package.  
**Work:** Pin machine/human report hashes, table hashes, frozen clock, profile
recipes, duration projections, and safe-integer results. Classify every proposed
table as `accepted`, `rejected`, or `reserved`; provisional rows cannot enter a
release manifest.  
**Gate:** Two byte-identical generations; fresh, migrated-established, true-high,
focused-week, broad-roster, 30/90/365-day, and +1,000% Collection fixtures pass.
Direct-schema fresh, direct safe-reset, and real predecessor-through-migration
remain separate fixtures with separate labels and exact receipt expectations.

### 24C-1 — Definition package, inactive

**Work:** Add immutable Rank-capacity, Family, Legacy, Collection, requirement,
tutorial, cast-coverage, and release-manifest definitions. Keep every new
mechanical definition inactive and every Collection pool at zero.  
**Gate:** Static graph validation; exact hashes; no production formula output,
save bytes, UI, or claim readiness changes.

### 24C-2 — Successor authority and integration shell

**24C-2A accepted:** The unloaded authority now implements receipt-free direct
fresh and safe-reset constructors, exact origin/retained-installation
attestations, checkpoint-bound real schema-13 migration, and exact fractional
additive evaluation. It initializes zero Collection totals and invents no
history. The production loader remains unchanged.

**Remaining integration order:**

1. **24C-2B:** add the nonfatal, zero-write transactional-refusal coordinator
   primitive while production remains schema 13.
2. **24C-2C:** activate zero-only schema 14 with direct fresh/reset and real
   schema-13 migration, but no nonzero Collection grants or formula changes.
3. **24C-2D:** extend Save & Recovery, import/export, rollback, and protected
   installation formats to the new lineage union.
4. **24C-2E:** prove exact zero-Collection output equality across all frozen
   gameplay and pending-reward fixtures.

**Gate:** Fresh, safe-reset, schema 0–13, current, corrupt, future, staged,
recovery, import, rollback, repeated-activation, and multi-tab fixtures preserve
their exact lineage and produce zero reward applications. Only a real schema-13
predecessor receives the write-once pre-v14 checkpoint and activation receipt.

### 24C-3 — Shared captured-claim extensions

**Work:** Extend the immutable reward/finalizer registry only for approved new
source and reward kinds. Store captured basis points and captured structural
Gold snapshots in the pending offer identity. Extend the bounded archive and
checkpoint aggregates without weakening existing replay authority.  
**Gate:** Ready/claim/reload/replay/delayed-claim/two-tab/fault-injection matrices
prove one winner, one reward, one receipt, one pool addition, and a write-free
loser.

### 24C-4 — Family alignment migration

**Work:** Translate predecessor milestone evidence to the aligned source IDs,
queue newly eligible manual claims, keep per-Family isolation, and preserve the
existing 5/10/20/40 shard supplement. Add reserved narrative milestones without
empty visible offers.  
**Gate:** Test each Family at 149/150, 299/300, 499/500, 599/600, 999/1,000 and
the narrative 749/750, 999/1,000, 1,499/1,500, 1,999/2,000 boundaries, with every
old claimed/unclaimed combination. No fixture gains the moved 20-shard reward
twice or loses eligibility.

### 24C-5 — Continuing Legacy pages

**Work:** Convert the current narrow Legacy slice to versioned tier pages while
preserving existing source IDs, claims, and post-activation metric truth. Capture
Gold at readiness, expose carried progress, and group migration presentation in
one Founding Legacy summary without auto-paying rewards.  
**Gate:** Derivable, accumulated, unknown-history, already-ready, already-claimed,
multiple-tiers-ready, delayed-claim, and new-tier-after-update fixtures pass.

### 24C-6 — Rank capacity and requirement-table authority

**Work:** Install the frozen Rank 1–30 capacity table and fixed-table reader.
Keep `releasedThrough` at the accepted live boundary unless a content-backed
release manifest authorizes more. Pin the released Broken Roads table and every
other inherited requirement table.  
**Gate:** Reserved Ranks stay hidden/unreachable; released Rank thresholds remain
exact; Rank EXP banks beyond the displayed cap without loss; later activation
uses banked EXP while queueing each transition/arrival exactly once and paying
nothing automatically; old Campaign/Tower/Expedition reachability and costs do
not move; changing an authoring helper cannot change a released table.

### 24C-7 — Activate the first approved Collection release

**Work:** Only after all prior gates and explicit numeric approval, activate a
release manifest whose grants came from the accepted simulation. Apply the four
binding formula orders at their existing authority seams; do not wrap final
totals.  
**Gate:** 0%, low, median, high, 100%, 250%, 500%, and 1,000% fixtures agree with
the balance report; all additions are exact; no limited bonus is necessary for
mandatory content; repeated claims cannot alter totals.

### 24C-8 — Player surfaces, tutorials, and final regression

**Work:** Add concise pool breakdowns, source lists, old/gain/new claim previews,
released-versus-reserved Rank language, Family dual-claim clarity at 1,000, and
continuing Legacy states. Integrate gradual tutorials and cast coverage.  
**Gate:** Phone, tablet, desktop, 130% copy, keyboard, focus, screen-reader
labels, reduced motion, offline, reload, and multi-tab checks pass with zero
browser errors and no read-only-navigation writes.

## 7. Migration specification

The real schema-13 successor migration must be deterministic from the exact
predecessor bytes and one captured migration time. Direct fresh and safe-reset
creation are separate current-schema constructors and do not execute these
migration steps.

1. Write and verify an exact pre-successor checkpoint before staging the target.
2. Validate the schema-13 predecessor under the accepted Phase 23/24A authority.
3. Create the inactive durable-progression root with zero Collection totals.
4. Copy only authoritative accumulated metrics and declared baselines; represent
   unknown history as unknown, never zero-as-fact.
5. Map Family milestone evidence:
   - `intimacy-150` → aligned 150 claimed evidence;
   - `intimacy-300` → aligned 300 claimed evidence;
   - `intimacy-600` → aligned 500 claimed evidence;
   - `intimacy-1000` → aligned 1,000 shard claimed evidence.
6. For each unclaimed aligned Family threshold already met, create deterministic
   readiness once. Do not credit shards during migration.
7. Preserve all existing pending offers, claim receipts, checkpoint aggregates,
   tutorial completion/replay records, story records, facility state, Companion
   history, offline entitlement, and save lineage.
8. Add new tutorial IDs as unseen without reopening predecessor tutorials or
   presenting a popup cascade.
9. Record one activation receipt for the real schema-13 migration. Execute
   Family alignment through its separately coordinated exactly-once transaction;
   direct fresh/reset creates neither receipt merely by constructing schema 14.
10. Stage, reread, validate, conflict-reread, commit, reread, validate, and clean
    up only if staging ownership still matches the transaction.

The accepted bootstrap policy is binding: genuine fresh and full safe reset use
direct-current-schema creation with no schema-12-to-13 receipt, transfer floor,
or pre-v14 checkpoint. Safe reset binds the retained Previous Save installation.
Only a real existing schema-13 save uses predecessor-through-migration and keeps
its legitimate receipt/floor history. All three paths must converge on valid
successor state without sharing misleading profile labels or reward entitlement.

Repeated migration, interrupted retry, current-schema reload, export/import,
rollback, and missing-active recovery must reproduce the same identities and
must never add a second claim, receipt, basis-point grant, or shard.

## 8. Required test matrix

### 8.1 Definition and table tests

- exact manifest/hash pinning and duplicate/reference rejection;
- distinct direct-schema-new, direct-safe-reset, and real-schema-13-migrated
  identities, receipt histories, retained-installation evidence, Combat Power
  anchors, and report labels;
- Rank 1–30 formula/table equality, monotonicity, and released-row gating;
- cumulative Rank EXP banking above the released display cap, followed by
  exactly-once ordered transition/arrival queues when rows activate;
- exact inherited requirement table hashes, especially Broken Roads;
- Collection integer-basis-point-only definitions and target-pool allowlist;
- release budget reporting without runtime cap behavior;
- permanent/limited classification and required permanent alternative;
- no generic percentage reward in Legacy or narrative Intimacy claims;
- all 18 Fellow and 20 Family stable IDs resolve in cast coverage.

### 8.2 Formula tests

- Collection Power is additive beside Might;
- Collection Earnings is additive beside the Oath bonus;
- Collection EXP affects only eligible newly settled Fellow/Companion EXP;
- one facility pool affects only that facility's active claimed output;
- 0% reproduces accepted Phase 24A output exactly;
- totals through +1,000% are finite, deterministic, and safe;
- no already-boosted total or second pool is multiplied.

### 8.3 Claim tests

- earned, ready, claimed, immediate replay, reload replay, delayed claim,
  concurrent claim, stale identity, missing finalizer, finalizer throw, archive
  fold, and storage-fault paths;
- exact old/gain/new Collection totals;
- structural Gold/hour captured at readiness, not claim time;
- carried achievement progress creates sequential separate claims;
- limited rerun cannot recreate a claimed definition;
- renamed or superseded Collection definitions preserve equivalent earned basis
  points through an explicit migration.

### 8.4 Family tests

- all threshold boundaries and old marker combinations named in 24C-4;
- old 600 claimed maps to new 500 claimed without reward replay;
- Intimacy 500–599 becomes eligible for the moved 20-shard claim;
- 1,000 shard and narrative claims remain independent;
- economic bonuses stop increasing from Intimacy after 500;
- high narrative Intimacy changes no Power, production, or Collection total.

### 8.5 Requirement fairness tests

- zero Collection;
- median and high permanent-only ownership available in the release;
- high all-content ownership including limited Collections;
- fresh, migrated-established, focused-Fellow, broad-roster, and true-high
  profiles;
- no mandatory stage, Book, Rank, Expedition, or facility unlock requires a
  limited percentage;
- future releases do not mutate old table values.

### 8.6 Tutorial and presentation tests

- eligibility only at actual unlock/first meaningful use;
- completion, skip, log, replay, reload, migration, and repeated migration;
- replay has zero reward/mutation applications;
- no more than one automatic lesson per safe-surface visit;
- no story, recovery, result, or claim overlay collision;
- cast speaker availability and fallback correctness;
- 320×568, 390×844, tablet, desktop, 130% copy, keyboard, screen reader,
  reduced motion, and focus restoration.

### 8.7 Inherited regression

Rerun the accepted Phase 23 original and successor gates, Phase 24A report and
browser gate, accepted Phase 24B simulations, Phase 18–21 facility gates, save
and recovery gates, public-art guard, inline/external script parse checks, and
zero-warning/error browser checks. Expected identity changes must be newly
pinned; behavioral failures cannot be dismissed as stale hashes.

## 9. Acceptance report

Phase 24C is acceptable only when its machine and human reports include:

- exact production and definition hashes;
- predecessor and successor schema identities;
- accepted Phase 24B identity and every consumed table hash;
- separately labeled before/after direct-schema fresh, direct safe-reset,
  migrated-established, and true-high values;
- every inherited threshold crossed or proven unchanged;
- exact Family mapping and catch-up counts without player-identifying data;
- Collection totals at 0%, 25%, 50%, 100%, 250%, 500%, and 1,000%;
- permanent-only versus all-content requirement reachability;
- 1-, 7-, 30-, 90-, and 365-day projections;
- claim race/fault results and bounded archive headroom;
- Rank capacity/release separation;
- tutorial and 38-member current-cast coverage;
- two consecutive byte-identical generations and two clean real-browser passes.

Acceptance authorizes only a local private candidate. Activation of actual grant
values, a commit, merge, push, deployment, artwork distribution, and public
release each remain separate decisions.

## 10. Explicitly deferred

- exact Phase 24B EXP bands and Breakthrough material quantities until accepted;
- a live Fellow Level-750 or Companion Level-500 ceiling until release-backed;
- Book II requirements and reward tables;
- Prosperity/HQ thresholds;
- any Collection grant not present in an approved release manifest;
- automated claims, expiring claims, daily checklists, stamina, new currency,
  Aptitude, dynamic scaling, leaderboards, gacha, or per-item multiplier chains;
- public distribution or new use of rights-limited character artwork.

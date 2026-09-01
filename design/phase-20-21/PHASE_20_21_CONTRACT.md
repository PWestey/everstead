# Phases 20–21 — Village facility retrofit, expansion, and release contract

## Objective

Complete the V1 Village-board facility plan with eight distinct active activities. The four original Buildings gain additive interactions without losing any passive behavior; four expansion facilities occupy visible Village locations; optional integrations make the Village feel connected without creating dependency deadlocks.

This package defines implementation boundaries only. Production remains disabled.

## Physical Village board

| Facility | Visible anchor | Story discovery | Active opening |
|---|---|---|---|
| Command Center | Upper-left hall | Council of Ash resolution | Resolve Petition |
| Archives | Upper-right tower | Records in Rain | First Research |
| Training Grounds | Lower-left arena | Quarry Claim resolution | First Drill |
| Hearth | Lower-right manor | River Accord resolution | Quiet Trust |
| Gatehouse | Lower bridge/entrance | Skybridge Terms resolution | First Road Watch |
| Market/Workshop | Western plaza workshop | Quarry Claim resolution | Salvage Order |
| Gardens | Lower-right gardens | Harbor Compact resolution | First Cultivation |
| Forge | Eastern-edge forge | Rank-5 covenant arrivals | First Commission |

Compact map icons remain the mobile interaction model: hidden, discovered/dim, available, and claim-ready. Tapping opens one focused facility sheet. No detached building-management grid or sixth bottom-navigation item is added.

All art/CSS treatments remain null. Existing Village art and accessible status labels are the safe fallback.

## Phase 20 — retrofit the original four

### Non-negotiable passive preservation

Command Center, Archives, Training Grounds, and Hearth keep their released:

- visibility and Building levels;
- upgrade path;
- passive Gold production;
- Oath multipliers;
- offline collection and 24-hour cap;
- Family assignments and production contribution.

Active discovery may affect only the activity hotspot/sheet. Active local progress is not a Building level. Participants in Training/Hearth do not replace assigned Family. No active claim recalculates passive Gold.

### Command Center — petitions and decisions

The player reads a bounded petition, sees the affected interests, previews immediate approved effects, and chooses one recorded resolution. Choices create flavor and Chronicle context, not hidden permanent branches. Prosperity/reward/Influence effects remain null.

This is a civic judgment activity, not a combat check or Restaurant match.

### Archives — maps, lore, and Relic research

The player selects a banked research lead, reviews evidence, and reconstructs a map/lore/Relic discovery. Invalid evidence combinations return to research without consuming the lead. Claims may add bounded Chronicle discoveries and local Discovery progress, but cannot directly mutate equipped Relics.

This is an evidence/reconstruction activity, not a timed quiz.

### Training Grounds — drills, sparring, and formations

The player selects a drill, eligible participants, and formation. Completed/Refined results may provide approved bounded development/local Readiness rewards.

Training is presentation/activity selection only: it never creates selected-squad Campaign rules, changes total-roster Power math, injures/locks actors, or replaces Campaign, Tower, or Expedition.

### Hearth — gatherings and relationship scenes

The player selects a gathering and attendees, then hosts a relationship-focused scene. Outcomes may eventually add approved relationship progress, interlude eligibility, and a deterministic claim-time Gift roll.

There is no romance checklist, forced pairing, relationship spending, or expiring scene. All relationship/Gift values and thresholds remain null.

## Phase 21 — expansion facilities

### Gatehouse — caravans and road events

The player reads route conditions and visitor needs, then chooses how to receive the caravan. Incompatible choices return to assessment rather than consuming the event. Outcomes are bounded and may add a Chronicle road-event note after claim.

### Market/Workshop — orders, crafting, and trade

Orders bank with captured requirements and fulfillment choices. Approved local stock is reserved transactionally at the commit boundary; cancel-before-commit restores it, while close-after-commit preserves the engagement. Caller-supplied quantities are never trusted.

### Gardens — cultivation and harvest

An open plot banks; the player chooses a crop/herb; approved growth time advances to a non-spoiling harvest-ready state; the player manually harvests. Offline may advance growth but never claims or replants. Plot/growth/capacity/yield values remain null.

### Forge — equipment and Relic commissions

Commissions capture exact requirements and a work approach. Forge may use only existing Relic/Relic Stone allowlists after approval. V1 explicitly excludes advanced affixes, reforging, advanced sets, and direct caller-selected item mutation.

## Shared opportunity and claim behavior

- Every opportunity banks and does not expire.
- Closing preserves banked, engaged, growing, and claim-ready state.
- Individual results are claimed manually; no Claim All is introduced here.
- Global rewards, local progress, stock, relationships, Gifts, Chronicle output, and metrics apply only through trusted exact-once finalizers.
- Every finalizer uses immutable source/domain identity and the bounded V2 receipt archive.
- A stale or corrupt mutation fails as a whole.

## Cross-facility integration

Ten stable integration hooks reserve future connections such as Gatehouse route visitors, Gardens ingredients, Archives Relic leads, Workshop components, Hearth community stories, and Training readiness.

Every hook is:

- optional and positive-only;
- derived from a committed source claim;
- captured in a target opportunity at settlement;
- unable to auto-settle or auto-claim another facility;
- unable to become a mandatory input or circular prerequisite;
- disabled because thresholds, formulas, and caps are null.

Every facility must pass its baseline flow with all integrations disabled.

## Tutorials and cast

The package binds exactly 19 existing IDs from the 79-ID ledger: three shared facility tutorials plus two contextual tutorials for each of the eight facilities. Mastery, Gifts, Prosperity, stock, and other null policies are never presented as active.

The exact later Phase 15 hook registry supplies 45 hooks across 28 current actors. This respects earlier assignments and avoids promoting Phase 14's wider candidate lists without approval. Actors handled in Restaurant, Apothecary, Schoolhouse, or Book I retain those roles; no one is reassigned merely to inflate Phase 20/21 scenes.

Final dialogue is original Everstead writing. Village speaker treatment is transparent cutout, approved framed, or text only—never an unframed full-background profile portrait.

## Economy and balance contract

No production values are approved in this package. Required nulls include:

- opportunity/growth cadence and unattended targets;
- bank, participant, attendee, plot, and stock capacity;
- selection weights and input quantities;
- rewards, local progress, relationship/Gift values, and quality multipliers;
- mastery/unlock/interlude curves;
- cross-facility thresholds/formulas/caps;
- active-profit and passive/active acceleration targets.

Approval must prove that passive play remains the dependable baseline, active facility play is noticeable acceleration, no facility dominates the economy, and no cross-facility loop compounds without a cap.

## Migration and recovery

Phase 20 then Phase 21 migrations are ordered, additive, exact, and idempotent. They derive story discovery, add facility/tutorial/registry state, and create no opportunity/reward while policy is null. They preserve every predecessor state and all passive Building/Family bytes.

Malformed/future lineage, unknown IDs, invalid ranges/identities, stock/participant forgery, clock rollback, and claim replay reject before adoption. Safe export/recovery remains available. Already-operational future state is grandfathered without repeated grants.

## Accessibility and mobile

- One primary facility sheet/activity at a time.
- 320×568 and 390×844 remain fully usable with 30 percent text expansion.
- No horizontal overflow; map icons have non-color-only states and accessible names.
- Keyboard focus enters the activity heading, follows semantic controls, and returns to the map hotspot.
- No auto-submit or auto-advance; reduced motion replaces camera/glow/progress animation with static state.
- Dialogue, clues, evidence, choices, requirements, outcomes, and claims remain screen-reader legible.

## Explicit production release gate

Production release is forbidden until every item in `release-gate.json` passes with evidence:

1. **Definitions:** exact references, approved complete policies, immutable registries, historical loaders.
2. **Migrations:** fresh/predecessor/import/recovery/idempotence and passive-original-four byte preservation.
3. **Claims:** eight finalizers, exact-once/replay, archive folding, stock/relationship/Gift/Relic allowlists.
4. **Economy:** combined simulator, passive baseline, facility parity, integration caps, safe integers.
5. **Longevity:** five-year maximum-cadence archive/save-size proof.
6. **Concurrency:** resolution/reservation/growth/claim conflicts in multiple tabs, with the no-CAS residual risk documented.
7. **Offline:** 24-hour cap, non-expiry, no auto-actions, Garden maturity only.
8. **UX/accessibility:** both mobile sizes, wide resize, keyboard, screen reader, reduced motion, localization expansion.
9. **Content/art:** original localized copy, physical anchors, speaker treatments, public authorization.
10. **Regression:** all released Phase 0–19 CLI/live gates and new Phase 20–21 behavioral/browser gates.

`productionReleaseAllowed` remains false while any required item is blocked, untested, null, provisional, or waived without explicit product/security approval.

## Known blind spots

- This design-only package has no production/browser behavioral evidence.
- Null cadence prevents combined five-year headroom proof.
- Final art/CSS/mobile hotspot crowding must be verified in runtime.
- Web Storage lacks compare-and-swap; the last-reread-to-write race can be narrowed/detected but not eliminated.
- Public character/art authorization remains unresolved.

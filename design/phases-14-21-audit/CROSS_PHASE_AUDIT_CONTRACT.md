# Phases 14–21 cross-phase consistency audit

## Purpose

This package is the final design-only consistency gate for Everstead's Village facility program. It reads the accepted Phase 13 cast/tutorial ledgers and the Phase 14 through Phase 21 design packages as one dependency chain.

It does not implement, enable, balance, style, or release any feature. A passing audit means the contracts can be implemented without inventing missing identity or silently contradicting an earlier phase. It does not turn missing runtime evidence into approval.

## Frozen source

The audit is based on exact commit `e6d850f4632098c22aa9217d2072941fe138d748`. The validator freezes the Git tree identity of each source package:

- `design/phase-13`;
- `design/phase-14`;
- `design/phase-15-16`;
- `design/phase-17`;
- `design/phase-18-19`;
- `design/phase-20-21`.

Changing one of those packages requires a new audit version and result. Editing this audit cannot make a changed source package appear consistent.

## Cross-phase ownership

| Concern | Owner | Successor rule |
|---|---|---|
| Shipped cast identity, profile quote, ambient assignment | Phase 13 | IDs and primary authored assignments never change |
| Tutorial identity, triggers, semantic steps, speaker plan | Phase 13 | Later packages bind existing IDs; they do not invent replacements |
| Twelve facility/activity/opportunity identities | Phase 14 | Later activity definitions preserve the exact tuple |
| V2 claim/archive and immutable finalizer seam | Phase 15 | Every later rewarding domain uses the same exact-once infrastructure |
| Waystone/Legacy and Restaurant definitions | Phases 15–16 | Production remains disabled until complete policies and successor runtime exist |
| Story ordering, canonical map anchors, discovery/opening | Phase 17 | Story discovers; capability plus opening activates; existing operation is never relocked |
| Apothecary and Schoolhouse domains | Phases 18–19 | Extend the shared envelope without becoming Restaurant variants |
| Original-four activities, expansion facilities, release gate | Phases 20–21 | Preserve passive Buildings and fail the full release closed until all evidence exists |

## Exact facility registry and physical anchors

Phase 17 is the canonical physical-anchor authority because it separates visible structures that Phase 14 grouped under broader plaza/edge labels.

| Facility | Canonical physical anchor | Target | Story discovery | Active opening |
|---|---|---:|---|---|
| Waystone | `central-crystal` | 15 | Waystone Call | Waystone Call |
| Restaurant | `western-plaza-restaurant` | 16 | Village Toll resolution | Opening Service |
| Apothecary | `eastern-plaza-apothecary` | 18 | Records in Rain | Possibility Case |
| Schoolhouse | `eastern-plaza-schoolhouse` | 19 | River Accord resolution | First Mentor Lesson |
| Command Center | `upper-left-hall` | 20 | Council of Ash resolution | Resolve Petition |
| Archives | `upper-right-tower` | 20 | Records in Rain | First Research |
| Training Grounds | `lower-left-arena` | 20 | Quarry Claim resolution | First Drill |
| Hearth | `lower-right-manor` | 20 | River Accord resolution | Quiet Trust |
| Market/Workshop | `western-plaza-workshop` | 21 | Quarry Claim resolution | Salvage Order |
| Gatehouse | `lower-bridge-entrance` | 21 | Skybridge Terms resolution | First Road Watch |
| Gardens | `lower-right-gardens` | 21 | Harbor Compact resolution | First Cultivation |
| Forge | `eastern-edge-forge` | 21 | Rank-5 covenant arrivals | First Commission |

### Predecessor anchor variance

Phase 14 and some Phase 15–19 definitions use broad aliases for Restaurant, Apothecary, Schoolhouse, Market/Workshop, Gatehouse, and Forge. Those values are not new competing anchors. Before physical-map runtime binding, the integrator must install an explicit facility-scoped canonicalization/migration map:

| Facility | Predecessor alias | Canonical anchor |
|---|---|---|
| Restaurant | `western-plaza` | `western-plaza-restaurant` |
| Apothecary | `eastern-plaza` | `eastern-plaza-apothecary` |
| Schoolhouse | `eastern-plaza` | `eastern-plaza-schoolhouse` |
| Market/Workshop | `western-plaza` | `western-plaza-workshop` |
| Gatehouse | `lower-bridge` | `lower-bridge-entrance` |
| Forge | `village-forge` | `eastern-edge-forge` |

The broad value must never be interpreted without its facility ID. Existing persisted state must be migrated idempotently; a runtime may not guess between two structures in the same plaza.

## Story and passive-operation boundary

All twelve discovery IDs resolve to required Book I scenes. None depends on an optional interlude. Story completion changes a hotspot from hidden to discovered, while an installed capability and resolved opening content make the active interaction available.

The Command Center, Archives, Training Grounds, and Hearth retain their current:

- visibility, levels, and upgrades;
- passive Gold production;
- Oath multipliers and 24-hour offline Gold behavior;
- Family assignments.

Their active opportunity state is additive. A missing story marker or unavailable active capability cannot turn off the passive Building, replace its Building level, replace its assigned Family member, or recalculate passive Gold during a claim.

## Stable identity and reference gate

The audit requires:

- exactly twelve facility/activity/opportunity tuples;
- unique IDs within every machine-readable definition registry;
- exact resolution of story, facility, tutorial, cast, activity, opportunity, metric, content, and hook references;
- exact Phase 15 master cast-hook preservation in Phase 17 and exact subsets in Phases 18–21;
- immutable positive definition/reward versions on banked and claim-ready identities;
- historical definition loaders before a referenced version can be removed.

The Phase 17, Phase 18–19, and Phase 20–21 package validators are required sub-gates and must pass inside this audit.

## Tutorial gate

The single authoritative ledger contains exactly 79 unique IDs. Every entry has a valid trigger, primary speaker, deterministic fallback, localization-safe semantic steps, and a delivery phase no earlier than its introduction.

Later packages may segment or contextually bind those steps, but cannot rename, remove, merge, or add semantic steps under the same ID. The successor registry lineage is:

1. `tutorial-registry.phase-15.v1`;
2. `tutorial-registry.phase-16.v1`;
3. `tutorial-registry.phase-17-successor.v1`;
4. `tutorial-registry.phase-19-successor.v1`;
5. `tutorial-registry.phase-21-successor.v1`.

All tutorials remain:

- non-blocking and immediately skippable;
- replayable and loggable;
- mechanically rewardless;
- limited to one relevant context at a safe moment;
- understandable without a character image;
- preserved for migrated players without a recap cascade.

`audit-fixtures.json` maps 32 player-facing facility concepts to existing tutorial IDs and exact semantic steps. The coverage includes the physical board, banking/manual claims, Legacy, Restaurant, Apothecary, Schoolhouse, and the eight Phase 20–21 activities.

## Cast gate

The audit proves exact coverage of 18 Fellows and 20 Family members. Every actor retains:

- one unique profile quote ID;
- one unique ambient Village assignment;
- the Phase 13 primary authored-content ID and delivery phase;
- at least one Book I appearance and scheduled facility hook;
- the original character-sheet art path and approved dialogue-presentation policy.

Book I scene speakers are checked against chapter Rank gates. Rank-2 through Rank-5 arrival groups exactly equal the authoritative Fellow join groups. Tutorial resolution excludes locked Fellows; any locked primary either has a trigger that occurs at/after the Fellow's arrival or a deterministic already-eligible fallback.

Dialogue remains original Everstead writing. A Village speaker may use an approved transparent cutout, approved framed treatment, or attributed text-only presentation. An unframed full-background character-sheet portrait remains forbidden.

## Claims, versions, and archive

The combined contract reserves fourteen immutable source/domain dispatch identities:

- Legacy and story claims;
- Restaurant result;
- Apothecary case;
- Schoolhouse lesson and Schoolhouse graduation;
- petitions, research, drills, gatherings;
- caravans, orders, cultivation harvests, and Forge commissions.

Every rewarding domain must use the trusted V2 flow:

1. clone and validate exact successor lineage;
2. revalidate source, offer, domain-ready identity, versions, and permanent replay authority;
3. build a pure allowlisted mutation plan through the captured finalizer;
4. apply canonical global and local effects;
5. remove owned pending/detail/outcome state;
6. add permanent replay evidence;
7. write one receipt/checkpoint update;
8. validate and persist once.

The claim archive ID is `claim-archive.phase-15.v1`. It retains the most recent 512 full receipts and folds the oldest 128 when the window is exceeded. Folding cannot change balances, metrics, progression, offers, or domain replay authority.

### Schoolhouse graduation blocker

Graduation is a separate one-time major ready snapshot, not another interval lesson. Runtime must either support that facility-local snapshot owning a V2 pending offer or receive explicit approval for a separate one-shot opportunity definition.

Until then, Phase 19 graduation is blocked. Runtime may not fabricate a lesson opportunity, reuse a lesson ordinal, auto-credit graduation, or weaken replay history.

## Non-expiry and offline boundary

All twelve regular facility opportunity definitions are non-expiring and manually claimed. Closing or reloading preserves banked, engaged, progressing, and claim-ready state.

Offline processing may:

- bank approved interval opportunities up to an approved cap;
- advance an approved Garden cultivation record from growing to harvest-ready within the shared 24-hour allowance.

Offline processing may not open, select, diagnose, teach, reserve, resolve, reward, harvest, replant, apply a relationship/Gift roll, run a tutorial, cascade a cross-facility hook, or claim.

## Economy and presentation guardrails

Every unapproved cadence, capacity, reward, progress curve, mastery curve, relationship/Gift value, stock quantity, input requirement, growth duration, active-profit target, integration threshold/formula/cap, and quality/tip multiplier remains null. QA-only synthetic values cannot become a migration or production fallback.

No phase introduces a new global facility currency, facility stamina, daily checklist/reset, perishable missed-opportunity timer, or active permanent percentage multiplier. Existing Oath multipliers are preserved; they are not a new facility progression system.

All new Village art and CSS treatment IDs remain null. Existing Village art is a fallback only; it is not approval of new public art or speaker treatment.

## Implementation sequence and blockers

`blocker-matrix.json` is the machine-readable dependency order. The concise sequence is:

1. canonicalize the six predecessor anchor aliases;
2. implement exact successor validation/migrations;
3. implement the tutorial successor registry;
4. implement V2 offer/receipt archive and immutable finalizers;
5. resolve the Schoolhouse graduation one-shot seam;
6. approve complete versioned economy/progression policies;
7. bind the Forge and Workshop authoritative input adapters;
8. approve original copy/localization and public characterization;
9. approve art rights and physical-map/dialogue treatments;
10. prove five-year archive and save-size headroom;
11. implement and validate physical-board accessibility;
12. satisfy every integrated release gate.

Unknown or incomplete decisions fail closed. Design completion is not permission to enable a feature.

## Release semantics

All 27 Phase 20–21 release gates remain required, blocked, and evidence-null. They cover definitions, migrations, claims, economy, longevity, concurrency, offline behavior, mobile/accessibility, content/art, and regressions.

The final production decision remains **BLOCKED** until every required gate has real evidence from the integrated candidate. Web Storage's lack of compare-and-swap remains a disclosed residual risk even after identity, reread, staging, receipt, and replay protections are implemented.

## Acceptance

Run:

```text
python3 design/phases-14-21-audit/validate.py
```

Acceptance requires:

- all 46 audit checks pass;
- all six source trees match the frozen identities;
- all three source validators pass;
- committed results and blocker counts match computed evidence;
- only `design/phases-14-21-audit/*` differs from the source commit;
- no production, runtime, art, or CSS file changes.

## Blind spots

- This is static design validation, not browser, storage, performance, device, accessibility, or security evidence.
- Final economy values, copy, localization, public-character rights, art authorization, and physical treatments remain unapproved.
- No combined five-year simulation can run until cadence/capacity/reward policies exist.
- No runtime migration/finalizer/tutorial implementation exists in this package.
- The final Web Storage reread-to-write race cannot be eliminated without a transactional storage primitive.

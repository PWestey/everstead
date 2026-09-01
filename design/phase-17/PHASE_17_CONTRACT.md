# Phase 17 — Book I expansion and story-driven Village unlock contract

## Objective

Complete the implementation-ready structure of **Book I — The First Covenant** across the ten existing Fellow Campaign stages, and use that story to reveal the Village as the physical game board. Phase 17 is a content/data contract only. It does not change production runtime, economy, saves, artwork, or deployed behavior.

The emotional arc is simple and original to Everstead: the Wayfarer arrives at a settlement whose roads are becoming isolated; each chapter proves a different kind of shared obligation; the finale records the First Covenant and leaves a modest, lasting Village change.

## Book I structure

| Section | Rank | Existing Campaign stages | Story function |
|---|---:|---|---|
| Prologue — Roads Go Dark | 1 | — | The Waystone calls the Wayfarer; the council frames safe passage as Everstead's first shared problem. |
| Chapter I — A Road Worth Keeping | 1 | Village Toll; Merchant Dispute | Open a road and establish that strength must be backed by fair, recorded terms. |
| Chapter II — Promises with Teeth | 2 | Broken Contract; Old Road Ambush | Show that promises have costs, evidence, and enforcement. |
| Chapter III — The Divided Claims | 3 | Council of Ash; River Accord | Reconcile competing claims and make public decisions durable. |
| Chapter IV — Roads Between Worlds | 4 | Quarry Claim; Skybridge Terms; Harbor Compact | Connect supply, bridge, and harbor routes into a network the Village can sustain. |
| Finale — The First Covenant | 5 | The First Covenant | Commit the shared terms and make the completed Book visible in Everstead. |

Every stage has a short first-clear introduction and a resolution after the authoritative clear commits. Scenes target four to eight authored beats; `book1-story.json` records beat intents, not final dialogue. Choices are flavor-only and converge before any mechanical consequence.

## Arrival groups and interludes

Rank arrivals observe the roster already granted by the released Rank system. They never grant characters.

- Rank 2: Zamorak, Darrow, Deadpool.
- Rank 3: Star-Lord, Iron Man, Daredevil.
- Rank 4: Thor, Captain America, Spider-Man.
- Rank 5: Wolverine, Obi-Wan, Anakin.

If several ranks are crossed by migration, arrivals remain ordered 2 → 3 → 4 → 5 and at most one is shown per safe Village visit. Stage resolution wins over arrival; arrival wins over the next tutorial.

Only four optional interludes are reserved in Book I:

- **Small Promises** after the River Accord, pointing toward the Hearth.
- **Open Table** after Skybridge Terms, reflecting the Restaurant's role in an open road.
- **Young Futures** after the Harbor Compact, pointing toward the Schoolhouse.
- **Quiet Roads** before the finale, connecting rest, remedies, and preserved records.

Interludes are non-blocking, replayable, rewardless, and safe to defer.

## Story-driven Village board

Story establishes discovery; a facility becomes active only when its implementation capability exists and its opening content resolves. Discovery never substitutes for implementation.

| Visible location | Story discovery | Active opening | Phase |
|---|---|---|---:|
| Waystone | Waystone Call | Waystone Call | 15 |
| Restaurant | Village Toll resolution | Restaurant Opening Service | 16 |
| Apothecary | Records in Rain | Possibility Case | 18 |
| Schoolhouse | River Accord resolution | First Mentor Lesson | 19 |
| Command Center active petitions | Council of Ash resolution | Resolve Petition | 20 |
| Archives active research | Records in Rain | First Research | 20 |
| Training Grounds active drills | Quarry Claim resolution | First Drill | 20 |
| Hearth active gatherings | River Accord resolution; Small Promises adds context | Quiet Trust | 20 |
| Market/Workshop | Quarry Claim resolution | Salvage Order | 21 |
| Gatehouse | Skybridge Terms resolution | First Road Watch | 21 |
| Gardens | Harbor Compact resolution | First Cultivation | 21 |
| Forge | Rank-5 covenant arrivals | First Commission | 21 |

The current Command Center, Archives, Training Grounds, and Hearth remain passively operational from a fresh or migrated save. Their production, upgrades, Oath multipliers, and Family assignments are independent of their later active activities. A story lock may dim an active-activity icon; it may not stop the Building.

An already-operational Restaurant or later facility is grandfathered. Migration creates the missing discovery/Chronicle context, but never re-locks the facility or repeats an opening grant.

No unlock references Prosperity or Headquarters level. Those thresholds are null and production-disabled.

## Durable Village changes

Eight stable story projections give Book I visible continuity:

- awakened Waystone;
- opened first road;
- active western plaza;
- lit Archives;
- council banners;
- supervised bridge traffic;
- harbor caravans;
- First Covenant crest/state.

These are derived from committed scene completion. They survive reload/import/migration even when final art is unavailable. Each has a text-only fallback; all art/CSS treatment IDs remain null pending approval. Reduced-motion mode uses static presentation and no looping glow, camera move, parallax, or automatic pan.

## First Covenant completion and claims

The first clear of `broken-roads-10` commits through the existing Campaign path, then queues `story.book1.finale.first-covenant`. Watching or skipping that scene:

- records Book I complete;
- enables the durable First Covenant Village projection;
- updates Waystone and Chronicle presentation;
- may make an approved story reward and Legacy feat eligible in the future.

Story does not wait for a claim. Chapter and Book rewards are manual, banked, non-expiring, exact-once offers of native type `opportunity.story.reward`. All five reward arrays are currently null, so no production offer may be created and no resource may be credited.

## Chronicle, log, replay, and recap

Chronicle lives under **More**, preserving the five-tab navigation. It groups entries by Book and chapter, shows spoiler-safe locked entries, and provides replay and dialogue log access for resolved scenes.

Replay is presentation-only. It cannot change story, Rank, Fellows, facilities, visuals, tutorials, opportunities, or claims. A repeat Campaign clear receives only a contextual line, not the full first-clear sequence.

Migration does not dump historical scenes on the player. Cleared-stage content becomes Chronicle history or optional recap eligibility; only one recap may surface on a safe visit. Newly added scenes inside a cleared chapter are recaps, not automatically watched scenes.

## Gradual contextual tutorials

Phase 17 binds only 12 IDs already present in the exact 79-ID Phase 13 ledger:

- first-scene controls and First Covenant objective;
- Rank path;
- Rank 2, 3, 4, and 5 arrivals;
- Chronicle replay/log;
- chapter objective change;
- Book I completion/Village change;
- facility map hotspots;
- major Legacy claim, only if a production-approved claim becomes ready.

Tutorials are embedded or attached to the relevant surface, immediately skippable, replayable, localization-safe, and non-blocking. They neither unlock features nor grant rewards. On a crowded visit, story and arrival ordering take priority.

## Cast distribution and writing guardrail

`book1-cast-distribution.json` covers exactly 18 Fellows and 20 Family actors. It preserves every Phase 13 primary assignment and every Phase 15–16 facility hook. The opening scenes stay focused; characters appear intentionally across required scenes, Rank arrivals, optional interludes, tutorials, and story-discovered facilities through Phase 21.

Final writing must be original Everstead dialogue built from functional beat intents. It must not imitate recognizable external-franchise voices, catchphrases, cadence, or scenes.

Village speakers use:

1. approved transparent cutout;
2. approved framed treatment; or
3. text-only treatment.

An unframed rectangular full-background portrait is forbidden in dialogue. Full-background art remains unchanged for character sheets.

## Mobile and accessibility contract

- One primary speaker at a time on mobile.
- Large readable dialogue panel with Next, Skip, and Log; Back remains available where the source tutorial promises it.
- Focus enters the scene title/first line, follows control order, and returns to the invoking control on close.
- No auto-advance; screen-reader status announces scene/chapter changes and claim readiness.
- Map icons have name and state labels independent of color/glow.
- Must remain usable at 320×568 and 390×844, wide layout, keyboard-only input, reduced motion, and 30 percent localized-text expansion.

## Migration and concurrency

Phase 17 is additive, idempotent, and fail-closed. It uses committed stage clears, not Rank guesses, to infer history. Missing arrivals are recapped in ascending order. Existing facility operation wins over a missing story marker.

All scene resolution, queue mutation, completion, and claim operations use the existing validated clone → mutate → validate → commit → adopt coordinator. A stale tab must reject instead of duplicating a record, offer, or receipt. Web Storage still has no atomic compare-and-swap; the documented reread-to-write residual race remains.

Offline passage never watches, skips, completes, rewards, or claims story. Eligibility is reconciled on the next safe foreground visit.

## Acceptance gate

Phase 17 design is implementation-ready only when automated validation proves:

- exact 10-stage ID/name mapping and six-section Book structure;
- unique stable scene/chapter/reward/change IDs and valid references;
- exact 38/38 cast coverage, preserved Phase 13 primary assignments, and valid Phase 15–16 hooks;
- all 12 facility IDs mapped once, with four original passive Buildings explicitly preserved;
- all tutorial references belong to the exact 79-ID ledger;
- all story reward arrays and Village art/CSS treatments remain null while disabled;
- no Prosperity/HQ threshold or auto-credit path exists;
- replay is mutation-free and claims are manual/exact-once;
- deterministic fixtures pass for fresh, migrated, Rank-jump, replay, offline, multi-tab, mobile, reduced-motion, malformed import, and successor-facility cases;
- no production file, save, artwork, feature flag, deployment, merge, or remote branch is changed by this package.

## Runtime-blocking decisions

The following must be resolved before Phase 17 runtime is enabled:

1. Approve final localized dialogue and any flavor-choice copy.
2. Approve chapter/Book reward values, or explicitly ship those milestones without rewards.
3. Approve Village art/CSS treatments, or explicitly accept the specified static/text fallbacks.
4. Implement the Phase 15 V2 native story-source and receipt registry with five-offer headroom.
5. Implement the canonical tutorial successor registry and Campaign post-commit event seam.
6. Expose fail-closed facility capability IDs for Phases 15–21.
7. Confirm public character/art authorization before public release.

Until then, `productionEnabled` remains false and runtime must not infer substitute values.

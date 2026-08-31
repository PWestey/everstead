# Phase 13 — First Covenant cast and tutorial content contract

## 1. Player outcome

A fresh player should understand, in this order:

1. Everstead is being isolated by the Broken Roads.
2. The Wayfarer is helping the Village forge the First Covenant.
3. Real-life Oaths strengthen the Village and finance progress.
4. The Fellow Campaign reopens roads and advances the shared story.
5. Rank brings new people into the Fellowship.
6. Legacy records meaningful accomplishments and banks rewards until the player chooses to claim them.

The content should feel like an inhabited frontier community, not a sequence of system explanations. Exact mechanical help remains available, but characters introduce one idea at a time.

## 2. First Covenant Phase 13 slice

### 2.1 Required content identities

| ID | Trigger | Purpose | Primary cast | Completion effect |
|---|---|---|---|---|
| `story.book1.prologue.waystone-call` | Fresh or migrated player opens the Village and has no Phase 13 story history | Introduce Everstead, the dark roads, the Waystone, and the Wayfarer | Tavi (`lyra`) | Marks the scene watched or skipped; unlocks the objective card |
| `story.book1.prologue.council` | Waystone Call completed/skipped; next user-initiated Village visit | Establish defense, trade, household, and record-keeping stakes | Tavi (`lyra`), Kaladin (`cael`), Vex'ahlia (`elara`), Rumi (`tamsin`), Hera Syndulla (`isolde`) | Makes Chapter I and the Village Toll introduction available |
| `story.book1.chapter1.village-toll.intro` | Player selects Stage 1 before its first clear | Explain why Everstead must intervene and make the Campaign spend legible in-world | Tavi (`lyra`), Kaladin (`cael`), Vex'ahlia (`elara`) | Records pre-clear scene history; does not clear or pay the stage |
| `story.book1.chapter1.village-toll.resolution` | First clear of `broken-roads-1` commits | Show an immediate human consequence and point to Merchant Dispute | Tavi (`lyra`), Rumi (`tamsin`), Kaladin (`cael`) | Advances Chapter I exactly once and creates the configured story/Legacy eligibility |
| `story.book1.rank2.roadbound-arrivals` | Rank crosses from below 2 to 2+ and the Phase 11G Rank-2 join set is available | Give Zamorak, Darrow, and Deadpool a reason to enter Everstead together | Darrow (`darrow`) leads; Zamorak (`zamorak`) and Deadpool (`deadpool`) respond | Records the Rank-2 arrival exactly once; no roster mutation because Rank remains authoritative |

The five scenes above are the Phase 13 required story surface. Merchant Dispute resolution, later Rank arrivals, remaining Book I Chapters, and facility-opening scenes belong to Phase 17 or their facility phase.

### 2.2 Beat boundaries

Each required scene contains four to eight short beats. A beat has one speaker, one localization key, and optionally a presentation intent such as `establish`, `warn`, `reassure`, or `invite`. Presentation intent is not a character-emotion simulator and must not be encoded in save data.

The content briefs are:

- **Waystone Call:** Tavi identifies the failed roads, names the First Covenant objective, and invites the Wayfarer to inspect the Village. The scene teaches story controls, not the economy.
- **Council:** Tavi frames the shared problem. Kaladin describes safe passage. Vex'ahlia describes missing supplies. Rumi describes people stranded between routes. Hera commits to preserving agreements and the Village record. The Wayfarer may choose one flavor response; all choices converge with no mechanical effect.
- **Village Toll introduction:** The toll is presented as a test of whether Everstead can negotiate without becoming another occupying power. The final beat points to the Campaign preview and its exact Power and Gold requirements.
- **Village Toll resolution:** The road opens provisionally, a named resident consequence is acknowledged, and Merchant Dispute becomes the next communal objective. The reward is banked separately from scene playback.
- **Rank-2 arrivals:** Darrow presents the group's practical offer, Zamorak challenges Everstead to use its growing influence deliberately, and Deadpool relieves tension without controlling the scene. Their joined state is observed from the Phase 11G Rank transition, never granted by story code.

### 2.3 Dialogue safety

- Write concise, original Everstead dialogue from each person's assigned Village function and immediate scene objective.
- Do not reproduce catchphrases, famous lines, speech quirks, comic cadence, or recognizable voice patterns from an external franchise.
- Do not depend on external canon knowledge, relationships, settings, or plot events.
- A name or portrait may identify the private-build cast, but the dialogue must remain replaceable by changing content data rather than progression logic.
- Character choices change only the following line or acknowledgment in Phase 13. They do not branch rewards, statistics, eligibility, or future scenes.

## 3. No-orphan cast rule

Every shipped Fellow and Family member must have all three content classes:

1. **Profile quote** — an addressable, localization-safe quote ID. The current hard-coded quote is the source copy for migration.
2. **Ambient Village use** — at least one location/topic assignment for rotating comments. Ambient lines never interrupt and never gate progress.
3. **Authored dialogue use** — at least one story, tutorial, arrival, interlude, or facility scene assignment by Phase 21.

`cast-plan.json` is the coverage ledger. Its assignment does not mean all 38 characters appear in Phase 13. Phase 13 uses the five starter-council members and the three Rank-2 arrivals; later Rank arrivals, interludes, and facility phases introduce everyone else where they have a reason to be present.

Ambient selection rules:

- Only choose a Fellow who has joined under the Phase 11G rule.
- Family ambient comments may use any shipped Family member because all are present in schema 12; later availability rules may narrow this only through an explicit migration.
- Prefer a speaker whose assigned location matches the open Village hotspot or current objective.
- Never repeat the same speaker twice while at least two other eligible speakers remain in the local pool.
- Never mutate `featured`, roster ownership, story history, or tutorial history merely to resolve an ambient speaker.
- If the needed transparent cutout is unavailable, use a deliberate text-only resident card, an intentionally approved framed treatment, or defer the authored appearance. Never place the rectangular full-background character-sheet portrait directly over the Village scene.

## 4. Art dependencies

Phase 11H already supplies transparent Village cutouts for `cael`, `lyra`, `orin`, `selene`, `rook`, `mira`, `zamorak`, `darrow`, and `star-lord`.

The full Phase 13 scene plan additionally needs transparent dialogue cutouts for:

- `elara` / `vexahlia`
- `tamsin` / `rumi`
- `isolde` / `hera-syndulla`
- `deadpool` / `deadpool`

These are content-art dependencies, not permission to replace full portraits. Their intended dialogue paths are `assets/portraits/family/village/<art-id>.webp` for Family and `assets/portraits/fellows/village/<art-id>.png` for Fellows, subject to the integrator choosing one documented alpha-capable format. Until the asset contract is approved, the data must distinguish `fullPortrait`, `thumbnail`, and nullable `dialogueCutout` paths.

Content registration and localization may ship before these four cutouts. Live authored Village dialogue may not. Its release gate is a neutral transparent cutout, a specifically reviewed framed presentation that is visibly part of the dialogue UI, or a text-only presentation approved for that scene. Reusing the full-background character-sheet art as an unframed Village overlay is prohibited.

## 5. Gradual tutorial contract

### 5.1 Core behavior

- Tutorials are **non-blocking**. A player can close or skip one immediately and continue using the feature.
- Tutorials are **replayable** from `More → Chronicle → Tutorials` without changing progress, rewards, or first-use state.
- Tutorials have **Skip**, **Next**, **Back**, and **Log**. Skip marks that tutorial dismissed, not mastered.
- A tutorial may be marked `seen`, `dismissed`, or `completed`. Replay is presentation-only.
- A tutorial cannot be a prerequisite for story, Campaign, Rank, facility production, claim eligibility, or passive earnings.
- A feature may become mechanically available before its tutorial is completed. The tutorial is queued on the first safe user-initiated visit.
- Never interrupt an active dialogue scene, confirmation, claim celebration, save-recovery flow, or encounter result.
- At most one auto-presented tutorial opens per user-initiated surface visit. Additional eligible tutorials wait in the help queue.
- At most two new tutorials auto-present in one session for a fresh player. Essential scene controls do not count against that cap because they are embedded in the first scene.
- A tooltip or one-line callout should teach one action. Multi-system explanation belongs in the replayable tutorial log.

### 5.2 Three-step teaching pattern

Longer systems may teach gradually:

1. **Discover:** What this place or system is and why it matters.
2. **First action:** How to perform the next available action safely.
3. **Mastery:** How local levels, efficiency, claims, or advanced choices work after the player has firsthand context.

The full trigger matrix is in `tutorial-matrix.json`. Current features primarily spread across Player Ranks 1–5. Future facilities use story unlocks, first visits, first ready opportunities, first claims, and facility levels rather than inventing more Player Ranks.

### 5.3 Speaker rules

- Every tutorial has one stable primary speaker ID and optional fallback IDs.
- Select from eligible roster members only. A locked Fellow cannot appear as if already resident.
- The fallback order is data-defined and deterministic; it never uses random acquisition or save mutation.
- System-critical copy remains understandable without the speaker. The character supplies context and warmth, not hidden rules.
- A missing cutout falls back to the text-only tutorial panel and preserves the speaker attribution.
- Mechanical wording is neutral and original. Speaker flavor may not reduce precision or imitate external source dialogue.

### 5.4 Fresh, migrated, and established saves

- Fresh saves receive the Rank-1 sequence in the order defined by priority and safe triggers.
- Migrated saves do not receive a popup cascade. Existing-feature tutorials become available in the Tutorial Log and only the single highest-priority relevant tutorial may auto-present on a future user-initiated visit.
- New features added after migration use their normal discovery trigger even for established saves.
- If several facilities are already eligible when an update lands, their discovery tutorials queue in story/unlock order and appear no faster than one per surface visit.
- Skipping a story scene and skipping a tutorial are separate records.

## 6. Phase dependencies

### Phase 12 must provide

- Stable content registries and definition validation.
- Tutorial presentation history distinct from story completion.
- An event/eligibility seam for Rank transitions, first clears, claims, first visits, and facility unlocks.
- Exactly-once story/Legacy/facility claim transactions.
- Honest migration baselines and retroactive recap queues.
- External content loading or another clean seam that does not append a new wrapper chain to `index.html`.

### Phase 13 provides

- The five required scene definitions and localized copy implementation.
- First Covenant objective presentation.
- Minimal Chronicle and Tutorial Log entries.
- Initial Legacy tracks/feats and claim presentation, using Phase 12 mechanics.
- The Rank-1 through Rank-2 tutorial sequence relevant to the vertical slice.

### Phases 15–21 provide

- Their own tutorial definitions before a player-visible feature flag can be enabled.
- Facility-specific character scenes and ambient pools listed in `cast-plan.json`.
- Discover/first-action/mastery tutorial stages when the system warrants them.

## 7. Tutorial coverage audit

The registry intentionally covers both the already-shipped game and planned additions. Infrastructure and QA work are explicitly marked non-player-visible rather than receiving artificial tutorials.

| Product area | Tutorial coverage |
|---|---|
| Navigation and Village | Bottom navigation, pending/manual Gold claim, offline claim and 24-hour cap, Building upgrade |
| Oaths | First completion, difficulty/Building boost, Undo, creation/scheduling, recurring schedules |
| Fellows and Power | Roster/profile/full art, EXP/Level/shards, rarity, Bond/Family/Companion sources, total-roster Power, Roles/Types context |
| Fellow Campaign | Stage order, Power/Gold requirements, walking result, targeted rewards, deterministic replay rotation |
| Player Rank | Rank path plus exact Rank-2 through Rank-5 arrivals |
| Family | Roster/profile, Building assignment, Gifts/Intimacy, shards/rarity, linked-Fellow bonuses, offline drops |
| Companions | Roster/Power, assignment, EXP/Level/shards/rarity, Campaign, Tower, idle claim, Mastery |
| Fellow Expedition | First best-run push, exhaustion rule, idle claim, shard pity, Might |
| Relics | First Relic Stone, acquisition/improvement boundary, equipment and Power preview |
| Reference and safety | Codex, Chronicle, Tutorial Log, Save & Recovery |
| Story and Legacy | Scene controls, First Covenant objective, Chapter change, Book completion, continuing tracks, feats, standard/major claims |
| Shared Village Life | Physical hotspot states, active-versus-passive principle, banked opportunities, exactly-once facility claims |
| Restaurant | Customer, recipe/station, first claim, reputation, named visitor lessons |
| Apothecary | First case, diagnosis/remedy decision, mastery |
| Schoolhouse | First lesson, pupil progress, Family influence, graduation/Education Earnings |
| Original Buildings | Command petitions/consequences, Archives research/mastery, Training drills/mastery, Hearth gatherings/results |
| Expansion districts | Gatehouse caravans/road events, Workshop orders/mastery, Gardens plots/harvest, Forge commissions/mastery |

The exact IDs, delivery phases, triggers, speakers, and step names are in `tutorial-matrix.json`.

## 8. Acceptance tests

### Story and cast

- Fresh boot queues Waystone Call once and never awards resources for watching, skipping, or replaying it.
- Completing or skipping Waystone Call makes Council eligible without forcing it over the current modal.
- Stage 1 first-clear introduction appears before spend confirmation; its resolution is queued only after the clear commits.
- Reloading, opening a second tab, or replaying the scene cannot repeat a reward or Rank transition.
- A jump from Rank 1 to Rank 3 still records the Rank-2 arrival once and queues it before the Rank-3 arrival.
- `cast-plan.json` contains 18 Fellow and 20 Family IDs with no duplicates, omissions, or unexpected IDs.
- Every cast entry has profile, ambient, and authored-dialogue coverage.
- Locked Fellows never appear in live ambient/tutorial selection.

### Tutorial behavior

- Every player-visible feature flag or facility definition points to a valid tutorial ID before activation.
- Closing or skipping any tutorial leaves the target action usable.
- Replay changes no save fields except neutral UI state, if that state is already permitted.
- A claim or story scene in progress suppresses tutorial auto-presentation until the next safe user action.
- Fresh Rank-1 play never auto-presents more than two standalone tutorials in one session.
- An established migrated save with all current systems unlocked does not receive a cascade.
- Missing speaker art produces an attributed text-only panel without a broken image or console error.
- An authored Village scene with a visual speaker uses an approved transparent cutout or approved framed treatment; the original full-background profile remains unchanged and is never used as an unframed overlay.
- All tutorial text remains usable at 320×568, 390×844, wider layouts, keyboard-only input, and reduced motion.
- Localization expansion to 175% of the English string length does not hide Skip, Next, Back, or Log.

## 9. Open conflicts for the primary integrator

1. Four required Phase 13 speakers lack approved transparent dialogue cutouts: `elara`, `tamsin`, `isolde`, and `deadpool`.
2. Public use rights for current crossover names and artwork remain unresolved. The data design keeps stable code IDs separate from visible names so content can be reskinned later, but it does not solve authorization.
3. Exact Legacy thresholds, claim rewards, and active-facility earning ratios remain economy decisions and are intentionally absent here.
4. The final narrative tone and degree of Wayfarer response choice remain open. This contract permits flavor-only responses and requires convergence.
5. Phase 12's exact external-module loading mechanism is not yet known. Phase 13 must consume the chosen seam rather than create another wrapper layer.

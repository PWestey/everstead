# Phase 13 — First Covenant vertical-slice implementation contract

## Objective

Ship the first playable First Covenant story slice on top of the accepted Phase 12 foundation. The release adds five replayable scenes, the Waystone objective, Chronicle and Tutorial Log surfaces, one continuing Legacy track, one one-time feat, and a shared manual claim without replacing existing progression systems.

## Dependencies

- Exact integration base `fdd0a5eabd002f6d4e38594910b3544a842a5d16`.
- The schema-12 Phase 11G roster path and Phase 12 activation/claim foundation are active and valid.
- `design/phase-13/` is the content and tutorial contract for this slice.
- Campaign and Tower progression continue to use total joined-roster Power.

## Stable content contract

The First Covenant story retains the Phase 12 story identity `story.first-covenant` and declares exactly these Phase 13 nodes:

1. `story.book1.prologue.waystone-call`
2. `story.book1.prologue.council`
3. `story.book1.chapter1.village-toll.intro`
4. `story.book1.chapter1.village-toll.resolution`
5. `story.book1.rank2.roadbound-arrivals`

Each resolved scene unlocks a distinct declared Chronicle entry. Scene history, Chronicle history, tutorial history, and reward claims remain separate. Watching, skipping, or replaying a scene never pays a reward.

Phase 13 definitions extend the Phase 12-derived story, Chronicle, tutorial, and actor-content registries. Current-state validation must reject undeclared scene, entry, tutorial, actor-content, opportunity, and reward references. A future phase can extend those registries through definitions rather than weakening validation or hard-coding empty-array exceptions.

## Trigger and progression rules

- Waystone Call is available once on the first safe Village visit after Phase 13 activation.
- Council becomes available after Waystone Call is watched or skipped, on a later user-initiated Village visit.
- Village Toll introduction is offered before the first `broken-roads-1` Campaign spend and never pays or clears the stage.
- Village Toll resolution is queued only after that first clear commits.
- Roadbound Arrivals is queued once when Rank crosses from below 2 to Rank 2 or above. It observes the authoritative roster transition and never grants roster ownership.
- Crossed triggers are recorded in stable order. Replay is presentation-only.
- Existing profiles receive honest post-activation history only: no invented scene watches, Campaign clears, Oath completions, or Legacy progress.

## Cast and art rules

- Preserve all 18 Fellow and 20 Family stable dialogue identities and their quote/dialogue eligibility.
- Use only the eight people needed by the opening slice: `lyra`, `cael`, `elara`, `tamsin`, `isolde`, `darrow`, `zamorak`, and `deadpool`.
- Existing transparent Village cutouts may be used for `lyra`, `cael`, `darrow`, and `zamorak`.
- `elara`, `tamsin`, `isolde`, and `deadpool` must use a visibly framed portrait or an attributed text-only treatment. Their full-background profile art must never appear as an unframed Village overlay.
- Full-background character-sheet art and lazy-loading behavior remain unchanged.

## Tutorial behavior

- Tutorials are gradual, non-blocking, skippable, loggable, and replayable.
- The visible sheet offers Back, Next, Skip, and Log. Replay changes no durable tutorial progress.
- At most one tutorial auto-opens per safe surface visit and no more than two standalone tutorials auto-open in one session.
- A scene, confirmation, claim celebration, recovery surface, or other modal suppresses auto-presentation.
- Missing art falls back to an attributed text panel; no broken image is rendered.
- Tutorial state never gates Village, Oaths, Campaign, Rank, claims, or offline settlement.

## Legacy and manual claims

- `legacy.achievement.oaths-kept` is the continuing track in this slice. Only Oaths completed after the Phase 12 baseline count.
- `legacy.feat.first-campaign-clear` is the one-time feat. Only a qualifying clear committed after Phase 13 activation can complete it.
- Eligibility creates one deterministic pending reward offer. The reward remains banked until the player chooses Claim.
- All payment uses the Phase 12 exact-once claim transaction and immutable receipt path. Scene playback, tutorial actions, reload, and a losing concurrent tab cannot duplicate payment.

## Acceptance criteria

- All five scenes can be triggered, watched or skipped once, logged, and replayed without replay-side mutation or reward.
- The five Chronicle entries unlock exactly once, unread state clears on read, and replay controls remain available under More.
- The Waystone objective always names the next actionable First Covenant step.
- The continuing Oath track and one-time first-clear feat show progress and readiness without inventing historical activity.
- A ready Legacy reward is manually claimable once and leaves one valid receipt.
- Tutorial Skip, Log, Replay, Back, and Next remain usable at 320×568 and 390×844, with reduced-motion support and no horizontal scrolling.
- Fresh and established schema-12 profiles activate idempotently; reload and multi-tab contention do not duplicate activation, scenes, tutorials, or claims.
- Focused Phase 13 tests, inherited Phase 12 tests, and Phase 11G/11H behavior checks pass.

## Do not break

- Oaths, Village Gold production, Prosperity, Campaign rewards/costs, joined-roster progression, Rank, offline settlement, and the 24-hour cap.
- Save namespace, schema-12 lineage, recovery checkpoints, staging ownership, and existing Phase 12 activation receipt.
- Bottom navigation, mobile shell, keyboard/focus behavior, reduced motion, full character sheets, and Phase 11H cutouts.
- Old Story, Tower, Trading, Patrol, and Operations remain disabled; Phase 13 does not revive or repurpose them.
- No full facility activity, Restaurant content, later Book I chapters, later arrival scenes, or post-V1 systems are included.

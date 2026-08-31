# Everstead Phase 11C — Safe Automation Contract

Status: implementation authority for the Phase 11 quality-of-life automation slice.

## Authority and objective

The Locked Core Design v1.2 requires idle-friendly progression. The implementation roadmap requires real auto-resolve, repeat, and claim flows with unlocks, stop conditions, and reward summaries. Phase 11C completes that requirement without changing the schema-11 save format or weakening any existing action ledger.

## Compatibility boundary

- Keep schema 11, all 15 protected storage slots, migration receipts, checkpoint lineage, rollback, and recovery behavior byte-compatible.
- Do not add a storage key or persisted automation object.
- Retain the historical `autoMode` field only as compatibility data. Do not restore its removed, ambiguous preference selector or give its old values new meaning.
- Reuse the current single-run Campaign, Village-claim, Expedition-claim, and Tower-claim actions. Every completed repeated run or consolidated claim must produce the same state and receipt as the equivalent manual action.
- Do not automate first-clear Campaign advancement. First clears remain explicit player decisions.
- Fellow Expedition already resolves the complete eligible weakest-first run in one push and receives no duplicate auto-resolve control.
- Village, Tower, and Expedition collection remains player-invoked. Phase 11C does not introduce a background timer, automatic Gold source, or automatic claim cadence.

## Unlocks

- Fellow Campaign repeat requires the selected stage to have been cleared and the existing Rank 2 Campaign replay unlock to be effective.
- Companion Campaign repeat requires the selected stage to have been cleared and the existing Companion Campaign route unlock to be effective.
- The Claim Ready card includes Village collection from Rank 1, Companion Tower when its route unlock is effective, and Fellow Expedition when its route unlock is effective.
- Migrated grandfather access continues to count wherever the existing route/replay selector says it is effective.

## Campaign repeat

- Place `REPEAT THIS STAGE` beside the selected stage's manual run action. The control remains visibly locked until the stage is cleared and replay access is effective.
- The setup dialog offers exactly 1, 3, or 5 runs. Five is the hard per-job limit.
- Copy must state that Everstead rechecks access, Power, Gold, history capacity, rewards, and save safety before every run, and saves every completed run separately.
- One explicit confirmation starts the job. Individual automated runs skip the browser confirmation and suppress per-run walk animation, toast, and modal presentation.
- Yield to the event loop after each committed run so `STOP AFTER THIS RUN` remains operable. Reduced-motion mode removes decorative delay but still yields.
- Keep at least 30,000 Gold after every repeated run. Stop before a run whose authoritative current cost would take Gold below that reserve, even if the player could afford the run manually.
- Stop before a run when the requested count is complete, the user requested stop, replay/route access is unavailable, Power is insufficient, Gold is insufficient, the 30,000 Gold reserve would be breached, history capacity is full, the fixed stage ceases to be replayable, another automation is active, the tab becomes stale, or persistence refuses/fails.
- Never estimate total spend as current cost multiplied by count. Power and efficiency may change after a reward.
- Finish with one aggregate dialog showing requested and completed runs, exact Gold spent, aggregate EXP/shards/Gifts/Relic Stones/new Relics/Rank change as applicable, and the exact stop reason.

## Deliberately excluded automation

- Do not auto-clear Companion Tower floors. Floor clears change future idle output and remain explicit player decisions.
- Do not auto-push Fellow Expedition stages. The existing weakest-first action already resolves the complete currently eligible run from one player confirmation.
- Do not add boot, background, interval, or hidden-tab claims. All claims remain explicit and bounded.
- Do not automate upgrades, assignments, ascension, equipment, Oaths, team selection, or first-clear Campaign advancement.

## Claim Ready

- Add one player-invoked `CLAIM READY` action to Adventure. It checks Village Gold, Companion Tower idle rewards, and Fellow Expedition idle rewards without writing during preview.
- Use this fixed order: Village, then Companion Tower, then Fellow Expedition.
- Re-preview each lane immediately before its own existing claim action. Claim each eligible lane at most once per invocation and preserve its independent transaction, revision, receipt, cursor, pity, and reward ledger.
- Include Village from Rank 1. Include Tower only when its route access is effective and at least one complete interval is claimable. Include Expedition only when its route access is effective, a best stage is seeded, history capacity is available, and at least one complete interval is claimable.
- Skip locked, unseeded, history-full, and not-ready lanes without calling their claim actions.
- Village readiness must be computed on a clone through the same full settlement path as collection, so fractional or zero-unit elapsed time never creates a preview write or a null-receipt revision.
- If a claim returns an uncertain result, persistence becomes blocked or stale, a revision/receipt does not advance exactly as expected, or an exception occurs, stop before all later lanes. Earlier confirmed claims remain committed and are reported as partial success; never retry them.
- Finish with one aggregate dialog listing claimed lanes, skipped lanes and reasons, exact rewards, and any partial-success stop reason. There is no per-lane modal or toast spam.

## Claim-ready presentation

- Add a compact count badge to the existing Adventure bottom-navigation item. It reports ready idle lanes (zero, one, or two), never resource totals.
- Add exact interval counts to the Expedition and Tower route labels and claim buttons.
- At zero intervals, keep the claim button disabled and show the time remaining until the next complete interval.
- Render readiness from current state and the captured display clock only. Do not create a production polling timer merely to refresh it.
- Badges must not widen or overflow the five-item phone navigation.

## Interaction and accessibility

- Use the established modal semantics, inert background, focus trap, Escape handling, and focus restoration.
- During a running job, Escape requests a stop after the current unit; it must not hide the running job.
- Use native disabled controls plus visible reasons. Locked or unavailable states cannot rely on color alone.
- Foreground automation controls are at least 44 by 44 CSS pixels and stack at 360 px and below.
- Aggregate summaries become one column on narrow phones and cannot overflow horizontally.
- Normal motion may use one short progress treatment. Reduced motion has no walk, bob, transition, or per-unit delay.

## Transaction and recovery invariants

- One manual-equivalent repeated run or claim equals one existing transactional save and one existing receipt.
- A foreground job is ephemeral. Reloading stops it; already committed units remain valid and the unstarted unit does not occur.
- No job state is reconstructed from DOM, timers, or partially written storage.
- Cross-tab staleness stops before the next unit. Web Storage's documented lack of compare-and-swap remains the residual race; Phase 11C must not widen that boundary.
- Exact campaign/tower reward identities, run ordinals, first-clear ledgers, idle cursors, pity, caps, and history ceilings remain authoritative.

## Acceptance gate

- Pure/focused checks prove access, ready-state, stop-reason, aggregation, and bounded-job behavior.
- Fault checks prove manual-equivalent receipts and state for every completed unit, no extra unit after stop/failure/reload, and no duplicate claim.
- Live checks run at 320×568, 390×667, and 390×844 in normal and reduced motion.
- Live coverage includes locked and unlocked controls; 1-, 3-, and 5-run repeat; the exact 30,000 Gold reserve boundary; insufficient Gold/Power; history cap; user stop; stale/conflict and persistence failure; zero, one, and 24 ready intervals; a failure after an earlier successful claim; focus trap/return; Escape; badge counts; no overflow; and zero unexpected console errors.
- Regression proves there is no sixth automated run, no first-clear automation, no automatic stage advance, no Tower auto-clear, no automatic Expedition push, and no boot/background/interval claim timer.
- Phase 11B Save & Recovery, the exact schema-11 storage topology, all three independent claim ledgers, manual single-run actions, and production QA isolation remain regression-clean.

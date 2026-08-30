# Phase 11A · Daily-use clarity execution

## Authority

- Base release: `ac7592348c1a11668822b0355ae86ab6db1b2688`
- Production candidate: `7c9e370f37830eaf9f756972dbbc1744d68e0270`
- Contract: `docs/PHASE_11A_CLARITY_CONTRACT.md`
- Save schema remains 11.

## Delivered changes

- Locked Relics now distinguish a fresh first clear from a retained pre-Relic clear without telling the player to replay for the initial copy.
- Village Fellow Economy Power and Combat Fellow Roster Power are named separately and their different inputs are explained.
- Automatic offline summaries begin at exactly five minutes; shorter accrual remains pending and claimable.
- Offline time uses readable minute/hour copy, and offline reward rows name Gold explicitly.
- The top bar visibly names Gold, Gifts, and bonus rewards and uses a compact 320-pixel layout with overflow protection.
- Relic Stone result copy uses correct singular/plural wording.
- New Oaths offer Daily, Habit, Weekly, and Monthly schedules only. A retained legacy Quest must be explicitly converted before a save can occur.
- Modal cancellation restores focus without writing storage.

## Preserved boundaries

- The Phase 10C schema-11 authority and economy engine are byte-frozen.
- All five embedded production assets are byte-frozen.
- No save field, migration, reward amount, Power formula, Oath boost, Prosperity award, or 24-hour offline cap changed.
- Historical QA packages remain byte-identical to the accepted base.

## Gate procedure

1. Run `qa/phase-11a/verify.mjs` twice.
2. Serve the repository root and open `/qa/phase-11a/`.
3. Run the live gate twice. It creates isolated 320×568, 390×667, and 390×844 realms using memory storage.
4. Require 70/70 live rows, zero browser warnings/errors, zero native-storage access, and no horizontal overflow.
5. Confirm the production artifact and embedded-asset identities against the sealed manifest.


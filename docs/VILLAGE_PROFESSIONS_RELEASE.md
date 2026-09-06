# Village professions — complete building coverage

Scope: replace the eight remaining public quiz starts with persistent active building loops, then deploy alongside the three already-committed Family/School, River/Gardens and Restaurant hospitality releases. Dependencies: schema-15 atomic persistence, the existing Village board, owned-roster Power and automatic Gold. Preserve existing saves, EXP, Relics, previous Training points and unfinished legacy rewards.

## Activities shipped

| Building | Active loop | Permanent reward |
| --- | --- | --- |
| Command Center | Unpack civic materials; choose investments in Well, Roads and Hall | Well +2 Power/+20 Gold/hr; Roads +5/+10; Hall +10/+5 per level |
| Archives | Restore nine map pieces; collect each completed map | +20 Power/+30 Gold/hr per map |
| Training Grounds | Choose an owned Fellow; practice Strength, Guard and Focus; promote | +25 Power for that Fellow per balanced set |
| Apothecary | Brew three kinds of fantasy remedy into inventory; deliver requested bottles | +3 Power/+12 Gold/hr per patient |
| Market | Craft tools, cloth and lanterns into stock; fulfill rotating orders | +3 Power/+15 Gold/hr per order |
| Gatehouse | Dispatch one caravan along a 1-, 3- or 5-minute route; receive returned cargo | River +8/+25; Ridge +16/+50; Forest +24/+75 |
| Forge | Forge and refine a communal Blade, Shield and Charm | Blade +20/+4; Shield +12/+8; Charm +6/+20 per level |
| Waystone | Restore Foundation, Runes and Beacon; complete balanced tiers | Each level +6/+12; each balanced tier another +30/+50 |

Except targeted training, Power rewards apply flat to each owned Fellow after existing bonuses. Earnings are global flat Gold/hour, shared across the four existing production lines for accounting compatibility. They are not multipliers on boosted totals. Civic investments cost 3 materials; Forge/Waystone levels cost `3 × next level`. Maps consume one fragment per tile; bottles/goods/dispatches consume three materials.

Each building has its own supply bank, initially six, replenishing one opportunity per 30 minutes to a bank limit of 24. Supply deliveries yield three local materials. Training spends opportunities directly. Banks settle at most 24 hours of elapsed time. Completed goods, map pieces and returned caravans persist without expiry. First-use guides and replayable Guide tabs explain each loop.

Together with Restaurant, Hearth, Schoolhouse, Fishing and Gardens, all thirteen public Village locations now have non-quiz activities. New legacy quiz starts are refused. Old pending sessions/rewards remain reachable under Progress, and old Training points open the correct legacy training tab.

## Save safety and validation

The optional `villageProfessions` version-1 extension initializes without changing any prior balances. Immutable engine actions run inside the existing atomic transaction. Exact-shape validation checks conserved supplies, drill counts, crafting inventories, unique claim identifiers, chronological timestamps and finite bounded records. Timed caravans snapshot their destination and return time at dispatch. Training validates ownership both in its selector and at mutation time.

Verified locally:

- All eight pure engine loops, duplicate claims, invalid records, bank ceilings, clock boundaries and exact project/route/gear reward variants.
- All eight through actual UI controls on fresh and supplied recovery saves at 390×844 and 320×568; no new quiz starts; reload preservation; exact one-hour passive Gold.
- Interrupted staging and active writes during map collection: one reward after recovery, never two.
- Old pending rewards at each of the eight buildings remain claimable; saved Training points remain spendable.
- Existing Family/School, Restaurant kitchen and River/Gardens browser regressions on fresh and supplied recovery saves at both widths; hospitality browser regressions on fresh saves at both widths.
- Visual inspection of Archives, Apothecary and Waystone at phone sizes. Standard mobile activity panels fit without scrolling; overflow remains accessible on unusually small viewports or expanded text.

## Deliberate first-release limits

These are persistent management activities, not action minigames. Apothecary and Market currently have three authored inventory items and rotating requests, not procedural cases or an open trading economy. Archives repeats nine-piece restorations rather than unlocking authored regions. Civic projects and communal Forge gear are additive workshop progress, not physical map reconstruction or a second equippable Relic system. Caravan cargo is represented by permanent route rewards, not new inventory currencies. Existing scene art and code-native symbols are reused. Long-horizon balance and richer content remain follow-up work; this release completes activity coverage, not every future progression idea.

## Running the new checks

Use `node qa/village-professions.mjs`. Browser checks require Playwright installed and the repository served at port 8857: `node qa/village-professions-browser.mjs` and `node qa/village-professions-safety.mjs`. An optional diagnostic JSON path tests an existing save in an isolated browser context; no player data belongs in the repository. Set `EVERSTEAD_PLAYWRIGHT` to an alternate module path only when using a bundled local runtime.

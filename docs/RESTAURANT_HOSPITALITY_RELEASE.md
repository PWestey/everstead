# Restaurant hospitality v1

Bounded scope: stations, returning character guests and popularity milestones on top of the existing recipe kitchen. Dependencies: kitchen v1/v2, schema-15 atomic persistence and current cast definitions. Preserve all recipe levels, pantry stock, outdoor supplies, old pending payments, EXP, School/Family, roster Power and automatic Gold.

## Play loop

- Available Fellows and Family appear as restaurant visitors, interleaved. Four are introduced initially; every ten Popularity introduces two more, up to the available cast. Their portraits and names appear in Service and the Guestbook, which tracks paid visits and favorite dishes. Preferences are stable by definition order, rather than changing when a Fellow is recruited.
- Every new table earns one Service Seal and three Popularity when payment is collected. Serving the guest’s favorite dish adds one Seal and two Popularity. Any unlocked dish remains usable, without a penalty or missed reward deadline.
- Four stations match the four recipes: Hearth Oven, Soup Kettle, River Grill and Banquet Table. Popularity gates are 0/10/25/45. Building or improving a station costs `5 × (current level + 1)` Seals. Five levels per station in this release.
- Each matching station level adds twenty-five Gold and one Popularity to future tables using that recipe. Separately, each station level permanently adds sixty Village Gold/hour and five flat Power per owned Fellow, after previous bonuses. Recipe bonuses remain unchanged; no multiplication of already-boosted totals.
- Seals are a separate service-improvement resource, not Chef Notes. Existing recipe costs and the two-Notes-per-table contract remain unchanged.
- Room tab holds stations and the Guestbook. A first-use introduction and replay through Guide explain the system.

## Save preservation

Optional `restaurantHospitality` v1 initializes once. Previously served tables establish a baseline and do not retroactively grant rewards. A table already pending on installation is marked as a legacy payment and retains its original value, without newly invented hospitality rewards.

New table records capture the guest, recipe, favorite match and station level at cooking time. Later station upgrades, cast changes or reloads cannot increase that pending payment. Service histograms reconcile earned Seals, Popularity, extra Gold and visit totals. Kitchen served totals reconcile to the hospitality baseline plus paid visits. Claims and extra station Gold share the kitchen’s atomic transaction.

## Verified

- Pure engine: 160 services, returning guests, station investment, accounting, invalid records and legacy table preservation.
- Fresh and supplied recovery saves at 390×844 and 320×568: station upgrade, exact +5 Power/+60 Gold per hour, old pending table unchanged by upgrade, new station payment +25 Gold, reload and exact one-hour passive income.
- Interrupted staging/active writes: station payment recovered exactly once. Duplicate claim refused.
- Pre-hospitality pending table preserved at original payment.
- Original kitchen browser regression; River/Garden and Hearth/School browser regression.
- Visual inspection of station and Guestbook screens at 320px.

## Remaining limits

Four recipes remain; stations currently differ by the recipe they improve, not by distinct cooking minigames. No bespoke Restaurant interior illustration or unique station art was generated; the UI reuses existing cast art and hall scenery. Guest dialogue, recipe branches, prestige content and long-horizon economy balancing remain future work. This release is committed locally, not deployed to GitHub.

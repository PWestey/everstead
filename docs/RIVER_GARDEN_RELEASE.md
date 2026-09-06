# Fishing, Gardens and kitchen supply connection v1

Bounded phase: replace the public Fishing and Gardens quizzes with persistent progression, connecting both to the Restaurant. Depends on the existing schema-15 atomic save path and kitchen accounting. Preserve Family–School, existing EXP investments, roster Power, passive Gold, Collection policies, old activity rewards and the 24-hour offline ceiling.

## Playable

- Fishing: six starting bait, one/30 minutes banked to twenty-four. Cast, then land a persistent catch; no reflex deadline or expiring fish. Three species per ground across Village River, Willow Lake and Waystone Falls. Three/six discoveries unlock the later waters.
- First three landed catches in each ground reveal its three species. Subsequent catches use a documented deterministic six-catch distribution; no hidden paid randomness or rerolling. The pending species is committed and validated when casting.
- Species journal retains the first specimen. Research consumes duplicate counts, costing `2 × (level + 1)` for the next level. Each discovery adds thirty flat Power per owned Fellow and sixty Gold/hour; research adds fifteen Power and thirty Gold/hour per level, after prior bonuses. Existing Collection percentage pools are unchanged.
- Every landed catch also delivers one culinary Fish. The journal specimen does not disappear when that ingredient is cooked.
- Gardens: three independent plots. Free wheat (15 minutes, four Grain), greens (20 minutes, four Vegetables), or sage (30 minutes, three Herbs). Harvest manually when ready. Crops never spoil; they neither replant nor yield repeatedly while unattended.
- Catches and harvests deliver directly to the kitchen pantry in the same transaction. Normal kitchen crates are unchanged. Pantry has shortcuts to both activities; Gardens links back to the Restaurant.
- Separate first-use/replayable guides, compact tabs, original SVG fish/crops and a reduced-motion-aware bobber scene. No external art dependencies.

## Data and safety

`riverGarden` v1 is an optional zero-bonus extension initialized once. Kitchen v1 remains valid unchanged until the first outdoor delivery; then the kitchen advances to v2 with `fieldSupplies` cumulative counters. Pantry reconciles crates plus outdoor supply totals minus cooked ingredients. Host validation cross-checks outdoor counters against kitchen totals, including on reload and recovery. No old data or namespace is reset.

Pending catches and harvests use unique IDs; repeat landing/harvest is refused. Old Fishing/Gardens quiz sessions and pending rewards remain accessible, but new quizzes cannot start there. Eight other quiz locations remain unchanged.

## Validation

- Engine: 249 catches, all three grounds, research, duplicate actions, blocked grounds, pending catch persistence, all crops, kitchen migration/cooking, bank limits, malformed data and backwards clock.
- Browser at 390×844 and 320×568: fresh and supplied recovery saves; casting, reload, landing, research, exact bonuses, crop timing, harvesting, pantry delivery, cooking and one-hour passive earnings.
- Interrupted staging/active ingredient writes and old quiz reward preservation tested separately.
- Family–School browser and Restaurant engine regression tests.

## Limits

This is a first collection/cultivation release. Fishing is cast-and-land, not a tension minigame; no timing penalty. There is no aquarium layout editor, crop mastery, species-specific traits, weather or rod upgrades yet. Fish drawings currently share a silhouette with species colors. Garden benefits flow through cooking rather than granting a second harvest Power reward. Permanent flat bonuses still need longer-horizon balancing against later-stage totals. No live GitHub deployment is included in this release.

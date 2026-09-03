# Phase 24B progression-simulation independent QA result

**Verdict:** PASS — simulation lane only; runtime adoption is not approved  
**Contract:** `phase-24b-progression-simulation-independent-v1`  
**Independent verifier:** 73 passed, 0 failed

## What passed

The independently frozen verifier reproduced and checked the model-owned Phase
24B artifacts twice. It did not trust the report's own PASS flags: it expanded
all authored bands, recomputed every Level row, all 70 core scenarios, five
released-mechanics horizons, six EXP migrations, two manual Breakthrough
lifecycles, and every Collection ownership/order/claim fixture.

The final model identities were:

- candidate JSON SHA-256
  `00f37707f72e08ed71d9d649cda2155858740059c85f7799ed6705ee8544fb5a`;
- generator SHA-256
  `e2f06fe9979fc32eb9649cd28efa7a901ecf4e36cdb329671b1d0a4c38996436`;
- generated machine report SHA-256
  `45603077138a24be83f0a17968807305772f00cc94b92f6b1a5ad87459175324`;
- generated human report SHA-256
  `4883d1cb741958f03d7bf289d81e1575320c82457f3b17cddaa9458eae3d9dfb`;
- model report checksum manifest SHA-256
  `fdf683f84b4339f4ba74c9c8c2c51a6c86cde96411056db277bc46f26882563d`.

Both generator check runs were byte-stable. The report manifest verified both
generated artifacts. The independent QA verifier also passed its syntax check.

## Independent findings

### Frozen baseline and complete tables

Zero Collection preserves the exact accepted Phase 24A profiles: genuine fresh
remains 35,150 Fellow Economy, 35,565 Fellow Combat, 2,200 Companion, and
27,320.8092192 Gold/hour; migrated-established remains 35,150 / 36,645,
2,272 actual with the 2,892 protection floor, and 27,328.94041242 Gold/hour;
true-high remains 3,196,916 / 3,588,268, 50,355, and
60,337,645.45902187 Gold/hour.

The released Broken Roads requirements remain exactly
`22K / 28.5K / 36K / 45K / 56K / 69K / 84K / 101K / 121K / 144K`.
The conflicting lower Appendix C prose row was rejected and no released stage
was repriced.

Independent expansion reproduced 749 Fellow transitions through Level 750 and
499 Companion transitions through Level 500. Every cost is positive,
monotonic, finite, cumulative-exact, and a safe integer. Candidate cap EXP is
169,410,000 per Fellow and 62,619,000 per Companion. The Level-500 Companion
fixtures correctly distinguish member-rounded gameplay totals of 111,985,
156,775, and 235,155 from theoretical aggregate-unrounded values of 111,980,
156,772, and 235,158.

### Throughput and target fit

Released-mechanics evidence is honestly labeled as frozen-fresh static bounds,
not an exact live forecast. Independent recomputation produced these account
EXP bounds:

| Days | Fellow Campaign lower bound | Rank-2 Companion Campaign lower bound |
|---:|---:|---:|
| 1 | 5,130 | 4,400 |
| 7 | 33,030 | 29,650 |
| 30 | 140,010 | 126,300 |
| 90 | 419,010 | 378,500 |
| 365 | 1,698,030 | 1,534,400 |

The calculation charges the two Fellow clears and 19,716 Gold needed to reach
Rank 2 before Companion Campaign. Tower is excluded from the lower bound
because it requires Rank 3 and that route is not proven. Tower clear EXP is
correctly assigned to one rotating target per floor (90 account EXP at frozen
fresh floors 1–2 and 14,250 through floor 50); only Tower idle EXP is awarded
per Companion. Fellow and Companion lane envelopes use different Gold spending
and are not added together.

All eight handoff pacing cells are present and independently evaluated. Day-1
and day-7 broad evidence uses the six Fellows actually joined on a fresh save;
the 18-Fellow matrix is explicitly synthetic and requires recruitment first.
The proposed budget fits the reference bands, but it is a declared launch
envelope that is not present in the released game.

### Collection, claims, and migrations

The verifier recomputed all 70 focused/broad × horizon × Collection-stress
scenarios through +1,000%. Power, Earnings, EXP, and facility probes use
nonzero adjacent bonuses and select the required additive result over the
forbidden compounded result. Twenty-one provenance-composed zero,
permanent-only, and all-content profiles retain identical mandatory requirement
hashes; limited grants never enter requirement authoring.

Collection claims and future grants are uncapped and exactly once. The legacy
ledger reconstructs Power 3,400, Earnings 2,300, EXP 1,700, and facility 2,600
basis points without clipping to obsolete caps. Equivalent limited and
permanent sources cannot double-pay mechanical growth, while limited cosmetic
metadata remains preserved.

Delayed ready and claimed rewards retain their captured values across changing
Level, economy, Oath, Collection, EXP, and facility inputs. Ready and claimed
migrations are repeat-safe; a serialized/reloaded claimed receipt rehydrates
and refuses replay for zero additional payout.

All six old-curve EXP migration recipes preserve displayed Level and
within-level progress, grandfather prior gates, separate auditable post-cap
surplus, and replay as no-ops. The Companion Level-100 former cap queues one
free manual legacy claim and next encounters Level 150; Fellow Level 120 next
encounters Level 150. Separate manual lifecycle fixtures prove closed-gate EXP
banking, insufficient-material refusal, exact one-time spend, retained-bank
advancement, persisted replay refusal, and preservation of rarity, Relic,
assignment, Might, Mastery, and unrelated state. Fellow rarity is independently
recomputed at +8% per star; Companion rarity uses +10% per star.

### Numeric and production safety

Every generated number is finite and safe. The largest audited integer is
4,594,386,856,610 Gold: true-high economy after 365 separately claimed 24-hour
periods at +1,000% Collection Earnings added beside the 30% Oath bonus. It
retains 9,002,604,867,884,381 integers of headroom below JavaScript's maximum
safe integer.

The frozen Phase 24A production identities remain unchanged:

- `index.html` —
  `6109805093ee78f075257526b4822cf86c9ca22dbd2a2a05ab3ef7b0bcb8c5f3`;
- `src/phase18-19-runtime.js` —
  `26686c97cc7c2a617224b8a287ab92933222e137c53bc309dedad6102d68df2e`;
- `src/phase23-companion-runtime.js` —
  `fd1455fef5cb5632fc53b055c935848e6b6f13f40175518520f0f4aa548dde40`;
- `src/phase24-scaling-authority.js` —
  `819fd4e308a98c699ac01a0c3df780eab11e777d933038b118850679d0f39d5c`.

## Runtime blockers retained

This PASS approves only the determinism and safety of the simulation lane. It
does not accept the numeric curve or authorize production changes.

- Released EXP is orders of magnitude below the proposed first-week envelope.
  Permanent authored EXP sources and manual claim behavior must be designed and
  simulated before adoption.
- Breakthrough units are abstract. Every gate still needs an exact existing
  material or fixed-bundle identity, acquisition rate, preview, and claim UI.
- A true live forecast must model the old-curve EXP → Level → Power → Rank-join
  → stage/floor-access feedback loop with one conserved Gold ledger.
- The day-one focused proposal makes all ten released Broken Roads stages
  Power-reachable. Any future reward plan must sequence that EXP behind story
  or stage gates without repricing current content.
- Fellow Expedition consumes a distinct Fellow per stage, so six fresh Fellows
  structurally stop at stage 6 and the full 18-member roster stops at stage 18
  despite the existing 50-row table.
- Runtime migration still requires authenticated lineage, actual save/schema
  work, exactly-once persistence, and a later browser acceptance gate.

No app, runtime, save, reward, schema, balance, deployment, or artwork file was
changed or approved by this independent result.

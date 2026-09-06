# Isekai / Everstead progression audit

Date: 2026-09-05. Baseline: a8a0753. Status: system comparison complete for
the progression and Village loops below; not an exhaustive inventory of every
limited-time Isekai event or a completed Everstead feature rollout.

The user authorizes useful gap-closing changes, with manual investment, passive
Gold, banked opportunities, full-roster progression and no gacha preserved.
This document distinguishes shipped gameplay from dormant code. Private QA
passes do not count as delivery to players.

## Evidence and confidence

Reference: supplied screenshots plus public community documentation linked
below. The wikis are unofficial, partially incomplete and may lag updates.
Exact complete current Isekai Power stacking, rounding, late-game cost curves
and operation-ability conversion are NOT independently verified. We should use
our own tested formulas rather than transplant uncertain numerical tables.

Local evidence: src/phase24d-public-preview-profile.js,
src/phase24g-public-release-profile.js, src/phase24l-profile-shell.js,
src/phase24-scaling-authority.js, src/phase16-restaurant.js,
src/phase18-19-runtime.js, src/phase20-21-facilities.js,
src/phase20-21-runtime.js and their integration in index.html.
A fresh normal browser URL confirms no active phase1819/phase2021 state and no
discovered/unlocked facility entries. This is not a claim about every existing
private-development save.

## Power and progression comparison

| Lane | Isekai reference | Everstead / gap |
| --- | --- | --- |
| EXP and level | Earned EXP spent on Fellows; level affects power per aptitude | Shared Fellow and Companion EXP wallets are public. Investment is manual. Need more permanent active earning routes. |
| Aptitude | Separate input into base Power, grown with skills/materials | Do not add a second near-identical level meter. A later training/mastery lane needs a distinct decision and source. |
| Rank/awakening | Shards/materials produce milestone bonuses | Existing shard rank must remain useful. Add targeted permanent sources before extra promotion ladders. |
| Family | Intimacy, permanent Blessing Power and spendable Blessing Points are distinct; points improve linked Fellows | Gifts, Intimacy, rarity, assignments and linked-Power effects exist. Independent earned-and-spent support loop is missing. |
| Relics | Upgradeable artifacts, effects and recoverable investment | Public equip/upgrade lane exists. Deterministic refinement and clear recovery rules are preferable to randomized rerolls. |
| Companions | Screenshots distinguish flat Power, aptitude, ordinary % and Final Power bonus | Existing level/rank/assignment/Tower remain. Do not silently introduce a final multiplier or change Tower's total-roster rule. |
| Collections | Discoveries and duplicate research create continuing account benefits | Use existing uncapped additive Collection pools; do not reintroduce obsolete lifetime caps. Fishing collection not implemented. |
| Earnings | Operation ability and employee earnings form a base; bonuses sum in an earnings layer | Passive Gold exists. Combat bonuses should not automatically multiply already-boosted earnings. |
| Player rank | Separate unlock/capacity progression | Wayfarer/Rank should gradually introduce each new feature with tutorials. |

Sources: [Level-Up](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Level-Up),
[Skill Pearl](https://isekai.wiki/Skill_Pearl),
[Family](https://isekai.wiki/Family),
[Artifacts](https://isekai.wiki/Artifacts),
[Awakening](https://isekai.wiki/Acquaint_Stone),
[Stella example](https://isekai.wiki/Allucia),
[Building Operations](https://isekai.wiki/index.php?mobileaction=toggle_view_desktop&title=Building_Operations).

The useful design is several understandable growth choices when a stage stops,
not an ever-longer multiplication chain. Level and aptitude interact in the
documented base calculation; that does not establish the full current formula.

## Family: actual depth and missing loop

Everstead already exposes Overview, Gifts, Rank, Building and Bonds. Intimacy
and rarity affect linked Fellow Power; assignments and specialties affect Gold.
That is more than Intimacy alone, but it lacks an active relationship economy.
The present scaling authority has finite Family link contributions; these are
not the separate, uncapped Collection pools.

Isekai distinguishes permanent Blessing Power (point-generation strength) from
spendable Blessing Points. Basic blessing gives fixed Power; advanced blessing
gives percentage Power to linked Fellows. Family skills also connect to Village
economics. See [Family](https://isekai.wiki/Family) and
[Family Skills](https://isekai.wiki/Family_Skills).

Accepted adaptation for implementation: banked character visits/gatherings earn
a single support resource; the player chooses a linked-Fellow blessing upgrade.
Keep Intimacy for relationships and profession milestones. Use authored scenes
for every current Family member, not compulsory romance or paid energy. Show
current→next actual Power and the affected Fellows. No auto-spend.

This requires a versioned save extension, source-authenticated claims and an
explicit Power formula update. It is NOT shipped by adding a Blessing tab.

## Village activity delivery audit

| Building | Current state | Production target / Fellow-growth output |
| --- | --- | --- |
| Restaurant | Substantial private implementation: preferences, recipes, stations, timed stock, reputation, mastery, visitors, claims. Not public. | First release: service decisions → Gold + banked training reward; guests unlock recipes. |
| Apothecary | Private case/diagnosis/remedy runtime; Gold + local mastery | Useful training tonics; choice quality must matter. |
| Schoolhouse | Private lessons/pupils/mentoring/graduation; lessons mainly Gold/local progress, graduation also Gifts/Relic Stones | Lessons → shared Fellow EXP; graduates → permanent profession benefits. |
| Command Center | QA-only petition scaffold | Petition choices → Village policy/profession development. |
| Archives | QA-only research scaffold | Maps, discoveries and Relic knowledge. |
| Training Grounds | QA-only drill scaffold | Deliberately chosen drills → Fellow EXP/mastery. |
| Hearth | QA-only gathering scaffold; relationship/gift application explicitly zero | Family scenes → support resource and relationship milestones. |
| Gatehouse | QA-only caravan scaffold | Supplies, visitors and authored road events. |
| Market/Workshop | QA-only order/reservation scaffold | Actual crafting inputs/outputs and trade choices. |
| Gardens | QA-only crop/timer scaffold | Ingredients shared with Restaurant/Apothecary. |
| Forge | QA-only commissions; can reserve Relic Stones but does not deliver full equipment loop | Deterministic Relic commission/refinement output. |
| Fishing | Absent | River hotspot → banked casts, fish/antiques, useful duplicates and collections. |

The eight successor facilities explicitly set productionEnabled:false and use
synthetic QA policies. Their outcomes can alternate by ordinal rather than
meaningful choice. Never remove these guards and call them finished games.
Restaurant is closest to release but still needs public policy, story/unlock
integration and new-save/existing-save verification.

Isekai references:

- [Restaurant](https://isekai.wiki/Inn_Restaurant): stations, serving and local
  popularity/guest progression give the facility its identity.
- [School](https://isekai.wiki/School): education uses replenishing opportunities
  and awards Fellow EXP; graduation contributes economic benefits/items.
- [Fishing](https://isekai.wiki/Fishing): banked bait, discoveries, locations and
  duplicate research make an enduring collection activity.
- [Apothecary in Village](https://isekai.wiki/index.php?mobileaction=toggle_view_mobile&title=Village)
  is a business. The documented
  [Elixir Workshop](https://isekai-slow-life-mgame.fandom.com/wiki/Mini-Game%3A_Maxim%27s_Elixir_Workshop)
  is an event puzzle. Everstead's diagnosis/remedy activity is our own design,
  not a verified reproduction of a permanent Isekai minigame.

## Delivery order and gates

1. **Stage usability and save safety — shipped a8a0753.** Direct Go, Auto stop
   conditions, quiet speakers, protected-save bugs corrected.
2. **Growth routes — this branch.** Compact Grow menu on stage scene, real
   resource balances, Gold/Power shortfall, links to existing upgrade lanes.
   Save-neutral; no promise that every visible route is currently affordable.
3. **Restaurant public vertical slice.** New immutable public reward policy;
   story unlock from existing progress, banked customers, service/claim,
   spendable Fellow growth, no duplicate grant on reload/import.
4. **Family support + Hearth.** Versioned support ledger and manual blessing
   upgrades; character scenes; link previews; permanent-only balance.
5. **School + Training.** Dependable EXP route available before mandatory walls.
   Differing lesson/drill choices, Family mentorship and local progression.
6. **Gardens/Fishing + Apothecary.** Ingredients and tonics, collections and
   duplicate value. Bank opportunities; never delete them at daily reset.
7. **Forge/Workshop, Archives, Command and Gatehouse.** Finish meaningful outputs
   and choices instead of enabling QA-only Gold generators.
8. **Further mastery if needed.** Add only when it creates a distinct choice,
   not a duplicate of EXP/rank. Test distributed roster investment.

Each public economy release requires: versioned migration; unchanged existing
balances; source identity and exactly-once claims; precise additive application
order; no multiplying already-boosted totals; mobile no-page-scroll UI;
progressive tutorial; all relevant cast represented; offline24h cap; bounded
bank with no expired earned opportunities; permanent-only progression test;
long-horizon +1,000% Collection-bonus simulation; visible actual upgrade gains.

Do not ship paid automation, VIP gates, limited-event mandatory power, ranking
dependencies, compulsory social unions, random refinement or redundant
currencies merely for resemblance. Public content, not dormant source files,
is the acceptance criterion.

# Independent QA contract

## 1. Purpose and boundary

This is a candidate-independent test plan for a future Player Wayfarer/UI implementation. The validator shipped with this package proves only the design package, provenance, asset identity, cross-references, and forbidden-mechanic boundary. It does **not** claim that production currently implements this visual system.

The future candidate gate must be written or reviewed independently from the implementation and must fail closed when any screen contract is absent. Visual approval cannot waive save, reward, claim, roster, assignment, tutorial, story, or accessibility regressions.

## 2. Frozen baselines

Before implementation, record from exact accepted integration `70201ab52e6e3510747bee1a977794a8c900bdd1`:

- production artifact and embedded-asset hashes;
- save schema and validation behavior;
- the exact five navigation tabs and their route effects;
- Gold/offline, original passive Building, Oath, Family assignment, Campaign, Rank, roster, and claim outcomes;
- current full-background Fellow/Family art manifests and profile behavior;
- Phase 13 tutorial registry/history behavior and all 38 cast eligibility rules;
- Phase 15–17 physical anchors, discovery/opening separation, and facility claim classification.

Fixture comparisons capture time once per before/after semantic check. They do not compare wall-clock-derived fields across different clocks.

## 3. Static candidate contract

A future candidate verifier proves:

- exactly five persistent tabs with the accepted route identities;
- no `player.wayfarer` key in Fellow, Family, Companion, shard, rarity, Relic, Power, Building assignment, or recruitment definitions;
- Wayfarer profile reads accepted Rank/Rank EXP and has no independent progression write;
- canonical full-background asset path/hash/dimensions and non-destructive crops;
- no screenshot or failed checkerboard derivative in shipped assets;
- transparent dialogue/walking variants remain disabled unless their manifest status is approved and alpha QA metadata is complete;
- no Blessing track, Fellow Building staffing, employee-count economy, daily checklist, copied currency, copied inventory/combine loop, or sixth tab;
- each screen has semantic headings, labeled actions/states, disabled reasons, focus treatment, and reduced-motion rules;
- presentation flags fail closed and their disabled state uses the accepted prior surfaces;
- tutorial bindings use accepted semantic anchors and history rules;
- no production economy/reward/policy value is introduced by a visual token or fixture.

## 4. Deterministic fixtures

`qa-fixtures.json` is the minimum fixture registry. Each future realm begins from a cloned, validated accepted save and an isolated storage adapter. It records raw state before and after presentation-only actions.

Required realms:

1. fresh Rank 1;
2. established migrated Rank 5;
3. missing/corrupt visual asset;
4. locked plus joined Fellow;
5. ready facility/achievement/reward;
6. 24-hour offline boundary;
7. two-tab viewing and claim race;
8. future/corrupt save rejection and recovery/import;
9. reduced motion;
10. keyboard-only and 175% copy.

The verifier must distinguish fixture-only synthetic data from production policy. A fixture value can never enable a null/unapproved reward or economy path.

## 5. Actual-DOM live runner

Run the same candidate in isolated browser realms at:

- 320×568;
- 390×844;
- 1024×768;
- one 320×568 realm with 175% copy/zoom equivalent;
- one realm with genuine browser-level `prefers-reduced-motion: reduce` emulation, or a production-observable reduced-motion class/attribute set by the same authoritative preference path plus a static CSS media guard.

Do not use only a JavaScript `matchMedia` monkey patch while claiming computed CSS evidence.

The runner uses real user-level click, keyboard, focus, scroll, Escape, and tab activation against actual rendered nodes. It asserts:

- no horizontal page scroll and no covered/unreachable primary action;
- 44×44 minimum interactive targets, allowing documented platform-native exceptions;
- visible and programmatic selected/ready/disabled/claimed states;
- logical headings/landmarks and accessible names;
- sheet focus enters, background becomes inert, Escape closes, and focus/scroll return;
- five tabs remain present and usable;
- top resources do not overlap identity or sheet controls;
- full-art crop keeps required focal content clear at all viewports;
- Wayfarer fallback renders when a transparent asset is absent;
- reduced motion has no walking, sway, parallax, auto-pan, pulsing, or long transition;
- zero uncaught errors, failed network asset loads, or warning/error console entries attributable to the candidate.

### Actual-DOM inspection blind spot

Automated geometry, computed style, accessibility-tree, and pixel screenshots cannot by themselves prove aesthetic quality, narrative tone, face crop quality, edge quality, or non-infringing originality. An independent human must inspect actual rendered DOM/screenshots side-by-side with the seven references and the canonical art. The automated gate must report this blind spot rather than converting “nodes exist” into a visual PASS.

## 6. State and mechanics neutrality

Opening/closing/scrolling these surfaces, selecting visual subsections, changing category filters, replaying a tutorial, using Continue, and switching tabs must not write the save.

For state-changing accepted actions, compare exact outcomes with baseline:

- Campaign cost, reward, roster Power, Rank EXP, stage history, and exact-once settlement;
- passive/offline Gold, Oath multipliers, original Building levels/production, and Family assignments;
- manual achievement/Legacy/facility reward claims and immutable finalizer/archive lineage;
- tutorial seen/dismissed/completed behavior, with replay neutral;
- story/Chronicle ordering and cast hook selection;
- inventory quantities and reward destination balances.

Two clients must not double-claim or overwrite a newer save. A visual transition may not delay persistence or create a second commit.

## 7. Asset and originality inspection

### Canonical source

- SHA-256 equals `a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf`;
- PNG IHDR is 1024×1536 RGB with no alpha;
- no unintended recompression or metadata-dependent derivative replaces it;
- network log shows local delivery only.

### Transparent variants

If enabled, inspect pixel alpha distribution, transparent corners/background, edge halos on dark/bright test mattes, and silhouette at 100%/200%. Reject a baked checkerboard, uniform alpha, accidental background islands, or either known failed derivative.

### Originality

Human review rejects copied overall composition, trade dress, iconography, frame geometry, palette, wording, currencies, daily task structure, staffing, inventory mechanics, or six-tab layout. The review cites the relevant screen and the Everstead-native difference.

## 8. Tutorial and cast regression

- Visual polish does not automatically enqueue a tutorial.
- Any updated semantic anchor resolves or falls back to the unanchored sheet.
- At most one safe lesson auto-presents per eligible user-initiated visit and fresh-session caps remain intact.
- Skip does not block the feature; replay and Log do not pay rewards or change gameplay eligibility.
- all 38 existing cast hooks still resolve under accepted rules;
- locked Fellows never speak in live story/tutorial/facility/ambient selection;
- `player.wayfarer` may speak only in explicitly authored player lines and cannot displace an assigned cast hook implicitly;
- missing cutout art falls back while preserving speaker/content identity.

## 9. Required result format

The future gate reports separate totals for:

- package/static contract;
- candidate semantic/state regression;
- live actual-DOM/accessibility;
- asset/provenance;
- human visual/originality review.

A total cannot hide a skipped category. Human review remains `PENDING`, not `PASS`, until completed. Release requires all applicable categories PASS, zero unexpected console errors, exact commit/artifact hashes, and a clean diff limited to the authorized implementation scope.

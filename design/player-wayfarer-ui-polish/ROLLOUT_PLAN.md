# Player/UI polish rollout plan

Every step is independently releasable and must remain behind its own presentation flag or equivalent fail-closed gate until its acceptance checks pass. A visual rollout never performs a save migration unless a separately approved data contract requires it.

## Step 0 — freeze and provenance

**Objective:** establish exact source identity, originality boundary, screenshots, and baseline behavior.

**Work:** register `player.wayfarer`, freeze the accepted full-background asset hash, capture current five-tab/resource/character/Campaign/facility behavior, and document reference-only hashes.

**Tutorial:** none.

**Gate:** candidate has no production behavior change; screenshot references are absent; source art is byte-identical; gameplay baseline passes.

## Step 1 — tokens and shared primitives

**Objective:** normalize existing Everstead colors, typography, spacing, focus, buttons, cards, sheets, progress, readiness, and receipt rows.

**Work:** refactor presentation only. Keep DOM semantics and action handlers stable where possible. Add reduced-motion CSS and accessible state labels.

**Tutorial:** none; familiar controls should not retrain the player.

**Gate:** five tabs, keyboard/focus, 320/390/1024, 175% copy, reduced motion, and save-neutral traversal.

## Step 2 — top bar and Wayfarer profile

**Objective:** make the Wayfarer the title/profile identity and simplify global resource hierarchy.

**Work:** use the exact full-background art, existing Rank/Rank EXP, and current story/Campaign status. Link from the existing player card/Rank affordance. Keep unapproved transparent variants disabled.

**Tutorial:** add a profile step to an existing Rank/Campaign lesson or log entry; no new automatic popup for established saves.

**Gate:** no roster record or new stored progression; art crop/contrast works at all viewports; profile traversal does not write the save.

## Step 3 — Fellow and Family sheets

**Objective:** unify art-first identity with the accepted, different progression models.

**Work:** Fellow sheet uses EXP→Level→Power, Bond, rarity/shards, Relics, and Family/Companion bonuses. Family uses Intimacy, Gifts, rarity/shards, Building assignment/production, and Family→Fellow Bonds. Preserve current full-background art.

**Tutorial:** existing feature tutorials point to the polished semantic anchors. Replays remain neutral; no tutorial cascade.

**Gate:** no Blessing, Fellow staffing, employee count, locked-Fellow leak, or changed calculations/assignments.

## Step 4 — Campaign presentation

**Objective:** deliver the walking/slideshow journey feel without changing stage mechanics.

**Work:** scenic stage composition, progress, Wayfarer marker/fallback, readiness, one action, log, and post-result story. A true walking asset remains separately gated.

**Tutorial:** the first Campaign lesson gains stage/readiness/Rank context; later tips appear at relevant first actions.

**Gate:** exact cost/reward/settlement regression; skip/reduced motion produces the same result; no portrait-as-fake-cutout.

## Step 5 — Achievements, Legacy, inventory, and rewards

**Objective:** make durable progress and owned/rewarded items scannable.

**Work:** use existing surfaces under More/context, existing item domains, manual exact-once claims, Continue routing, and receipt detail.

**Tutorial:** one contextual lesson at first ready claim; inventory detail is introduced only when the player first receives a relevant domain.

**Gate:** no sixth tab, daily checklist, copied currency/combine loop, expiring pressure, or claim duplication.

## Step 6 — Village/facility sheets

**Objective:** apply the shared visual language to the physical board and facility framework.

**Work:** compact anchor states, selection label, anchored sheet, banked opportunity/manual claim/local progress/story link. Roll out per accepted facility order.

**Tutorial:** use Phase 13/15–17 discovery, first-visit, first-ready, first-claim, and mastery moments. At most one safe auto-presentation per visit.

**Gate:** original passive Buildings/Oaths/Gold/Family assignment unchanged; no detached manager; anchor and focus behavior pass.

## Step 7 — approved dialogue and walking variants

**Objective:** enable cutout Village dialogue and literal Campaign walking only after art approval.

**Work:** ingest separately approved genuine-alpha assets with provenance, focal/edge QA, fallbacks, and reduced-motion alternatives.

**Tutorial:** none for the visual substitution itself.

**Gate:** alpha contains real transparent pixels; no baked checkerboard; edges pass at 100% and 200%; failed derivatives remain absent; semantic state and cast selection are unchanged.

## Final integration order and review ownership

1. independent design/QA review;
2. implementation branch per rollout step;
3. package verifier and production candidate verifier;
4. actual-DOM review at three viewports plus 175% copy;
5. keyboard/screen-reader/reduced-motion pass;
6. before/after save and mechanics regression;
7. originality side-by-side review;
8. root/integration review before merge.

If a step cannot preserve mechanics or accessibility, disable that presentation flag and keep the prior surface. Do not migrate or rewrite player data to rescue a visual rollout.

# Everstead Phases 18–19 Product Policy Candidate v1

## Status and authority

This is a conservative, reversible proposal for product review. It resolves
all 38 Apothecary and 48 Schoolhouse null policy slots without changing the
accepted design. `productionEnabled`, `authoritative`, and mechanical
enablement remain false. A runtime must reject this candidate status.

Generated opportunities, ready offers, and receipts capture an immutable
policy/table version. Disabling future generation never deletes banked state;
approval or revision never rewrites pending or claimed objects.

## Shared economy basis

Rewards use a new Phase 18–19 fixed table with 52 continuous structural Village
Gold/hour bands. Structural rate includes the released base rates, committed
Building levels, and released 1.15 level curve. It excludes Oaths, Family and
roster bonuses, pending/active-facility Gold, and all volatile effects. The band
is captured when a case/lesson is generated or graduation becomes ready.
Runtime evaluates fixed integers only; it does not calculate a percentage.

The lowest calibration rate is 25,400 Gold/hour. Every later band starts at the
released equal-level structural rate. Just-below, at, and just-above all 51
boundaries are simulated (153 cases); the maximum combined Phase 18–19 optimal
recurring share is 957 basis points in those cases, under the 1,050-basis-point
ceiling.

Neither activity adds a currency, stamina, daily reset/checklist, expiring
queue, permanent percentage multiplier, or passive-Building mutation.
Neither consumes a global resource: diagnosis/remedy and seat/pupil/lesson/
approach/optional-mentor IDs are decision inputs, not inventory costs. Mastery
and Education are the only local reputation/progress authorities and never act
as spendable currencies or reward/passive multipliers.

## Phase 18 — Apothecary

- One case banks every 60 minutes, to 8. The target is eight unattended hours.
- Offline settlement is capped to 24 elapsed hours, banks only, and never
  chooses, resolves, or claims. A full bank discards whole-interval debt while
  retaining only valid partial carry. Migrated saves receive zero backfill.
- Each case presents 3 clues, 3 diagnoses, and 4 possible remedies. The safe
  support option is always available. An incompatible pair enters rewardless,
  non-consuming Recheck. There is no terminal failure band.
- Supportive results pay the fixed equivalent of 3% of one generation hour;
  precise results pay 5%. The fixed table, not those percentages, is runtime
  authority.
- Supportive/precise claims grant +2/+3 local Mastery. Levels begin at
  0/12/36/90. Knowledge unlocks remedy and patient variety only; it cannot
  increase passive output or reward values.
- Regions weight 50/30/20 after story eligibility. The three regular cases each
  weight 100. Missing regions are excluded, then weights renormalize.
- Rook and Daredevil are authored one-time insertions, never random cases.
  Rook requires joined Rank 1; Daredevil requires joined Rank 3 and Mastery 3.
- Achievements propose 10 cases, 5 precise outcomes, 3 regions, and 2 named
  patients, using seven entirely new versioned IDs across both facilities.

## Phase 19 — Schoolhouse

- One lesson banks every 90 minutes, to 8. The target is twelve unattended
  hours. Lessons, pupil candidates, and graduation-ready offers never expire.
- One seat is available initially. Seat 2 requires local Education 36, one
  claimed graduation, and the Young Futures story resolution.
- Foundations, Craft, and Community each require 8 development. Any valid
  approach yields a positive guided result (+2); a pupil-and-lesson-aligned
  approach is resonant (+3). Local Education receives the same base progress.
- Lessons weight 40/35/25 and pupils 50/30/20 after story eligibility.
  Enrollment order is deterministic and each initial pupil enrolls once.
- One owned Family mentor is optional. Intimacy 25 enables a fixed +1
  development; Intimacy 50 also adds a fixed 250 Gold. No relationship state,
  assignment, shard, rarity, Bond, ownership, or passive output is consumed or
  mutated. Absence preserves the complete baseline.
- Guided and resonant outcomes use fixed-table values calibrated to 2.5% and 4%
  of passive generation per hour. The maximum mentor bonus remains fixed.
- Graduation is a separate V2 manual, exactly-once claim. It captures fixed
  Gold equal to 25% of one structural hour, 1 Gift, 3 Relic Stones, and +6 flat
  local Education. The seat remains occupied until that claim commits.
- The initial vertical slice has three pupils. It deliberately stops new pupil
  progression after all three graduate rather than inventing repeat pupils.

## Tutorials and cast

The exact nine accepted tutorial IDs are spread over contextual events. At most
one new segment appears per facility visit. Migration or a Rank jump queues only
the earliest contextually relevant unseen segment. Skip and replay change only
tutorial/neutral UI state and never award resources or block play.

The accepted ten-person subset is preserved: Rook, Daredevil, Scarlet Witch,
Yennefer, Shadowheart, Aerith, Obi-Wan, Spider-Man, Ahsoka, and Hermione. Locked
Fellows never speak. The Player Character remains separate. Visible writing
must be original Everstead dialogue, and Village dialogue uses a transparent
cutout, approved frame, or text-only treatment—never an unframed full profile.

## Simulation outcome

Five profiles—fresh, midgame, established, high-activity, and mostly-idle—run
for 1, 7, 30, 365, and 1,825 days. The strongest recurring result is 901 basis
points of passive Gold. The strongest 30-day total including candidate one-time
graduation and achievement Gold is 526 basis points. Passive production and
Family assignments record zero mutations.

The five-year conservative archive/headroom model covers 162,425 claims,
including Restaurant traffic and a deliberately high future graduation bound.
With the inherited 512-recent/128-fold archive, estimated facility state is
524,288 bytes. Even if every claim paid the largest candidate reward, projected
Gold retains a 7,007× safe-integer factor.

## Approval choices still open

Root review must accept or revise the values; approve the structural-rate table
authority; approve the seven new achievement IDs/rewards; accept the finite
three-pupil slice; approve the graduation V2 runtime/finalizer/archive seam;
and approve final localized copy and speaker presentation. None is silently
treated as decided by this package.

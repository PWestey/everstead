# Phase 12 — Independent QA Contract

## Objective

Prove that the Phase 12 story, Legacy, claim, facility-foundation, tutorial, and dialogue-content architecture is safe to place on top of the released Phase 11H application.

This package is an independent successor gate. It does not implement Phase 12 and it does not modify `index.html`. A pre-Phase-12 build must fail the candidate gate because the required QA-only contract is absent.

## Dependencies

- Released Phase 11H at commit `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c`.
- Save schema 12 and its released checkpoint/recovery authority.
- The Phase 0B/0C validated persistence coordinator and isolated QA authorization boundary.
- The Phase 11H split between transparent Village cutouts and full-background character sheets.
- The current 18-Fellow and 20-Family roster identities.

## Candidate bridge boundary

The candidate must install `window.__EVERSTEAD_PHASE_12_QA__` only when all existing QA authorization requirements are satisfied:

1. the page is served from `localhost`, `127.0.0.1`, or loopback IPv6 with the exact query `?qa=1`;
2. `runtime.qa.allowDestructive` is the own literal value `true`;
3. `runtime.qa.isolatedStorage` is the own literal value `true`; and
4. the selected storage adapter is distinct from captured native `localStorage`.

The bridge must be absent in production and in any partially attested realm. Definition reads are non-mutating. Fixture replacement, migration, offline advancement, claiming, tutorial actions, and concurrent-claim simulation are destructive test operations and must remain behind the complete authorization boundary.

The v1 bridge surface is:

```text
version: "phase-12-independent-qa-v1"

read.definitions()
read.snapshot()
read.validate(optionalState)
read.derive(optionalState)
read.raw()

destructive.reset(fixtureId)
destructive.reload()
destructive.advanceOffline(elapsedMs)
destructive.claim(claimId)
destructive.tutorial(action, tutorialId)
destructive.legacyMode(modeId)
destructive.simulateConcurrentActivation()
destructive.simulateConcurrentClaim(claimId)
```

Every method returns a structured-clone-safe value. Mutation results contain `ok`, `reason`, `before`, `after`, and `writes` where applicable. Claim results additionally expose the durable receipt or refusal. Test-only state replacement may exist behind the bridge, but the gate never accepts a result that bypasses the same validation and persistence coordinator used by the app.

The gate consumes these normalized read views:

- `snapshot()` → `{state, raw}` where `state.saveMeta.revision` is authoritative;
- `validate()` → `{ok, errors}`;
- `derive()` → `{resources, statistics, claims, tutorials}`;
- statistics → `{id, value, baseline:{status, at}}`;
- claims → `{id, definitionId, rewardId, rewardVersion, status, paid, expiresAt}`;
- tutorials → `{id, status, featureAvailable, completionReceiptCount, replayCount}`.

`advanceOffline()` returns `{ok, requestedMs, appliedMs}`. `simulateConcurrentActivation()` returns `{ok, winnerCount, loserCount, receiptCount, losingWrites, checkpointWrites, protectedAuthorityPreserved, finalValid}`. `simulateConcurrentClaim()` returns `{ok, winnerCount, loserCount, receiptCount, rewardApplications, losingWrites, finalValid}`. These are observation views over production behavior, not an alternate test implementation of the behavior.

## Deterministic definitions

`read.definitions()` must provide the following immutable snapshot:

- `schemaVersion` and `predecessorSchemaVersion`;
- `migrationId` and a permanent definition-set identity;
- one flat `catalog` of story, Chronicle, Legacy, feat, reward, facility, tutorial, and dialogue-content definitions;
- `rewards` with stable IDs and positive integer reward versions;
- `features` with `tutorialRequired` and introduction rank;
- `tutorials` with stable IDs, feature references, rank-based triggers, completion rules, skip/replay support, and reward version;
- a `speakers` registry containing every current Fellow and Family ID;
- `dialogueCoverage`, keyed by every speaker ID, pointing to at least one real dialogue-content ID;
- `accumulatedStatisticIds` and the baseline policy for each;
- `legacyModes`, proving Story, Tower, Trading, Patrol, and Operations remain dormant;
- deterministic QA fixture and example identities.

Catalog items expose `{id, kind, references}` and optionally `reward:{id, version}`. Reward definitions expose `{id, version}`. Feature definitions expose `{id, tutorialRequired, introductionRank}`. Tutorial definitions expose `{id, featureId, trigger:{rank}, skipAllowed, replayAllowed, rewardVersion}`. Speaker definitions expose `{id, rosterKind}`.

All catalog IDs must be stable, globally unique, and independent of array position and visible copy. Every reference must resolve to a declared catalog, roster, Building, Companion, or Player identity. Renaming displayed content must not alter its ID.

## Required fixtures

The gate owns these fixture identities in `qa/phase-12-independent/fixtures/contract-fixtures.json`:

- `fresh`: a brand-new profile at the frozen clock;
- `schema12-established`: a valid established Phase 11H predecessor with known resources and non-zero progress;
- `claim-ready`: one explicitly identified Legacy reward is eligible but unpaid;
- `tutorial-ready`: the first required tutorial can trigger without relying on wall-clock randomness.

Fixture materialization is allowed only through the QA bridge. Each reset must install canonical bytes through the persistence coordinator and return the fixture identity used. Randomness, clock, save IDs, and transaction IDs are deterministic in the live realm.

## Stable content identity and validation gate

The candidate passes only when:

- definition IDs are unique and match the stable-ID grammar;
- every catalog reference resolves;
- every reward-bearing definition records an exact reward ID and reward version;
- the save validator rejects a dangling pending claim, dialogue speaker, tutorial, or content reference;
- current saves contain no duplicate migration, claim, tutorial, or content-history IDs;
- changing display text cannot change definition or receipt identity.

## Migration and historical-statistics gate

Phase 12 deliberately remains on schema 12. The new foundation is introduced by one transactional same-schema activation receipt with the exact ID `phase-12-foundation-activation`; a schema-13 protected-lineage extension is outside this phase.

Fresh creation, activation of an established schema-12 save, reload, and repeated reload must be deterministic and idempotent. The activation must:

- record `from:12` and `to:12` exactly once;
- commit through the existing validated persistence coordinator;
- preserve the released schema-12 checkpoint and recovery authority;
- create no replacement checkpoint or shortcut recovery path;
- refuse one contender in a deterministic two-tab race without writes; and
- leave one valid activation receipt in the winning installation.

Previously untracked accumulated statistics must use an honest baseline:

- the stored baseline status is exactly `unknown-historical`;
- the baseline begins at the Phase 12 migration time;
- the initial post-migration counter is zero unless the statistic is explicitly declared derivable from authoritative predecessor state;
- no historical activity is guessed from current balances;
- the migration receipt records the policy and definition-set identity; and
- reloading cannot repeat the receipt, change the baseline, or grant a reward.

## Banked and exactly-once reward gate

Eligibility records a ready reward but does not credit it. Ready rewards do not expire, block progression, or disappear during reload or offline processing.

One claim must:

- revalidate eligibility;
- use the exact claim, definition, reward, and reward-version identities;
- apply the complete reward and receipt in one persistence transaction;
- preserve carried-over progress;
- advance the save revision exactly once; and
- expose the committed receipt.

The same claim must then be refused without changing canonical raw bytes, revision, resources, celebration history, or the storage write log. This refusal is tested after an immediate retry, reload, offline advancement, and a deterministic two-tab race. The race passes only when exactly one contender commits and the final installation contains one reward and one receipt.

## Tutorial gate

Every user-facing feature added from Phase 12 onward must register a tutorial requirement before it can ship. Tutorial definitions are introduced gradually through explicit Player Rank triggers rather than all firing at initial boot.

The gate requires:

- every `tutorialRequired` feature has exactly one introductory tutorial;
- tutorial triggers use explicit Rank gates within the current Rank range;
- the definition set spans at least two Rank gates once more than one tutorial is present;
- trigger, complete, skip, and replay states persist;
- skipping never blocks the feature or ordinary progression;
- skipped and completed tutorials remain replayable;
- replay never grants a reward or repeats a completion receipt; and
- completing, skipping, reloading, and replaying cannot duplicate any tutorial reward.

## Roster dialogue gate

The speaker registry and content-coverage manifest must contain exactly all current roster IDs:

- 18 Fellows; and
- 20 Family members.

Each ID must reference at least one authored quote, story beat, tutorial line, interlude, or dialogue entry in the catalog. Coverage metadata without a resolvable content definition fails. This guarantees that the whole starting cast is available to speak over time without requiring every character to appear in the first vertical slice.

Transparent cutout approval remains separate from content eligibility. The nine Phase 11H Village cutouts are preserved. A speaker without an approved cutout may use an intentional framed treatment until dedicated art is approved; the full-background character-sheet art must never be replaced by a cutout.

## Dormant legacy modes

The old Story, Tower, Trading, Patrol, and Operations modes remain disabled. Their old actions must return a write-free refusal under the live gate. The Campaign stage table must no longer use `STORY` as its identity. Phase 12 may reuse authored ideas from those modes only through new stable content definitions.

## Phase 11H and persistence regression gate

The candidate must preserve:

- all Phase 11H cutout and full-portrait assets byte-for-byte;
- lazy external portrait loading;
- Village/profile artwork-path separation;
- the mobile shell and current roster identities;
- validated fresh save creation and reload;
- the 24-hour offline elapsed cap;
- existing passive Gold behavior;
- no native-storage access in the isolated gate; and
- zero warning or error console entries.

## Acceptance criteria

1. Package-only verification passes from the Phase 11H base.
2. The unimplemented candidate check fails closed on the missing Phase 12 bridge.
3. A Phase 12 candidate preserves schema 12 and passes every live realm twice at 320×568 and 390×844, including reduced motion.
4. All deterministic fixtures validate before and after their intended mutation.
5. Fresh, migrated, reloaded, offline, and raced claims demonstrate exactly-once behavior.
6. Tutorial coverage is complete and gradual, with safe skip and replay.
7. All 38 current Fellow and Family IDs have resolvable dialogue coverage.
8. Dormant legacy actions are write-free refusals.
9. Phase 11H assets, save validation, and offline rules remain intact.

## Do not break

- Do not alter `index.html` or production modules from this QA branch.
- Do not use native player storage for any live gate scenario.
- Do not weaken the existing QA authorization boundary.
- Do not infer unknown historical totals.
- Do not introduce schema 13 or bypass the protected schema-12 checkpoint/recovery chain in Phase 12.
- Do not auto-pay eligibility, tutorial, story, Legacy, or facility rewards.
- Do not re-enable dormant legacy modes.
- Do not require every speaker to have a transparent cutout before content can be authored.
- Do not freeze the eventual story copy or economy values in this harness; freeze identities and behavioral invariants.

## Blind spots

- Browser Web Storage has no atomic compare-and-swap; the deterministic stale-tab test proves refusal under the existing revision/raw-identity coordinator but cannot eliminate the platform race interval.
- The gate does not approve final reward amounts, story prose, tutorial writing quality, or visual celebration quality.
- Safari, real-device haptics, audio, and assistive-technology behavior need separate release testing.
- The first Phase 12 architecture phase does not prove Restaurant, Apothecary, Schoolhouse, or later facility game design.
- Public distribution rights for the current cast and artwork remain outside software QA.

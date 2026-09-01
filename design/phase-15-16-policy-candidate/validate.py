#!/usr/bin/env python3
"""Validate the bounded Phase 15-16 candidate policy/content package."""

from __future__ import annotations

import json
import subprocess
import sys
from collections import Counter
from pathlib import Path


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SOURCE_COMMIT = "7beccb88676b75910e99c43bb78bc895553dfe5f"
SOURCE_TREE_ALLOWLISTS = {
    "design/phase-13": {"cb5ce45d24835666323ea466860f001ec6e161cd"},
    "design/phase-15-16": {"c817f3e023835528113df40d7cbebc37f4831e9c"},
    "design/phases-14-21-audit": {
        "2fde246e9a631abf0af9f527932773a3dd407046",
        "9864cee002436b0d652c4514d1272c3761facf45",
    },
}
REQUIRED_FILES = {
    "README.md",
    "PRODUCT_POLICY_CANDIDATE.md",
    "policy-candidate.json",
    "tutorial-timing.json",
    "copy.en.json",
    "cast-schedule.json",
    "decision-ledger.json",
    "fixtures.json",
    "generate_reward_table.py",
    "restaurant-reward-table.json",
    "simulate.py",
    "simulation-results.json",
    "validate.py",
}
CANONICAL_REWARD_KINDS = {
    "gold", "prosperity", "gifts", "relicStones", "fellowExp", "fellowShards",
    "familyIntimacy", "familyShards", "companionExp", "companionShards", "might", "mastery",
}

passed = 0
failed = 0


def check(condition: bool, label: str) -> None:
    global passed, failed
    if condition:
        passed += 1
        print(f"PASS {label}")
    else:
        failed += 1
        print(f"FAIL {label}")


def load(name: str):
    return json.loads((HERE / name).read_text())


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, check=True, text=True, capture_output=True).stdout.strip()


def all_ids(node):
    found = []
    if isinstance(node, dict):
        if isinstance(node.get("id"), str):
            found.append(node["id"])
        for value in node.values():
            found.extend(all_ids(value))
    elif isinstance(node, list):
        for value in node:
            found.extend(all_ids(value))
    return found


def main() -> int:
    policy = load("policy-candidate.json")
    tutorials = load("tutorial-timing.json")
    copy = load("copy.en.json")
    schedule = load("cast-schedule.json")
    ledger = load("decision-ledger.json")
    fixtures = load("fixtures.json")
    simulation = load("simulation-results.json")
    reward_table = load("restaurant-reward-table.json")
    phase13_cast = json.loads((ROOT / "design/phase-13/cast-plan.json").read_text())
    source_cast = json.loads((ROOT / "design/phase-15-16/cast-hooks.json").read_text())
    source_legacy = json.loads((ROOT / "design/phase-15-16/legacy-definitions.json").read_text())
    source_restaurant = json.loads((ROOT / "design/phase-15-16/restaurant-definitions.json").read_text())
    source_tutorials = json.loads((ROOT / "design/phase-15-16/tutorial-extension.json").read_text())

    present = {path.name for path in HERE.iterdir() if path.is_file()}
    check(present == REQUIRED_FILES, "package has exactly the bounded documented files")
    check(policy["sourceCommit"] == SOURCE_COMMIT, "policy names the accepted integration tip")
    check(tutorials["sourceCommit"] == SOURCE_COMMIT and copy["sourceCommit"] == SOURCE_COMMIT, "content names the accepted integration tip")
    for path, allowed_trees in SOURCE_TREE_ALLOWLISTS.items():
        current_tree = git("rev-parse", f"HEAD:{path}")
        check(current_tree in allowed_trees, f"source tree is an exact reviewed identity: {path}")
        clean_unstaged = not git("diff", "--name-only", "HEAD", "--", path)
        clean_staged = not git("diff", "--cached", "--name-only", "HEAD", "--", path)
        check(clean_unstaged and clean_staged, f"no working-tree edits in reviewed source: {path}")

    check(policy["status"] == "candidate-root-review-required", "policy status is candidate")
    check(policy["authoritative"] is False and policy["productionEnabled"] is False, "candidate policy is non-authoritative and disabled")
    check(policy["mechanicalEnablementAllowed"] is False, "candidate cannot mechanically enable runtime")
    check(tutorials["productionEnabled"] is False and copy["productionEnabled"] is False and schedule["productionEnabled"] is False, "all content registries are production-disabled")
    check(ledger["approvalTransition"]["runtimeMustRejectCandidateStatus"] is True, "ledger requires runtime rejection of candidate status")
    check(ledger["approvalTransition"]["candidateFilesAreNeverEditedIntoAuthority"] is True, "approval requires a new authoritative package")
    guards = policy["globalGuardrails"]
    for key in ("manualClaimsOnly", "newGlobalCurrency", "stamina", "dailyReset", "dailyChecklist", "permanentPercentageMultiplier", "lockedFellowMaySpeak", "franchiseVoiceImitation"):
        expected = key == "manualClaimsOnly"
        check(guards[key] is expected, f"global guardrail {key}={str(expected).lower()}")
    check(guards["opportunitiesExpire"] is False, "opportunities never expire")
    check(not guards["offlineMayChoose"] and not guards["offlineMayResolve"] and not guards["offlineMayClaim"], "offline never chooses, resolves, or claims")
    check(all(policy["reversalPolicy"].values()), "candidate reversal rules are explicit")

    legacy = policy["phase15LegacyPolicy"]
    source_tier_ids = {item["id"] for item in source_legacy["tiers"]}
    source_feat_ids = {item["id"] for item in source_legacy["feats"]}
    candidate_tier_ids = {item["definitionId"] for item in legacy["tierPolicies"]}
    candidate_feat_ids = {item["definitionId"] for item in legacy["featPolicies"]}
    check(candidate_tier_ids == source_tier_ids, "all and only frozen Legacy tier IDs receive candidate policy")
    check(candidate_feat_ids == source_feat_ids, "all and only frozen feat IDs receive candidate policy")
    expected_thresholds = {
        "legacy.oathkeeper.tier-1": 1, "legacy.unbroken.tier-1": 3,
        "legacy.steward.tier-1": 100000, "legacy.builder.tier-1": 8,
        "legacy.roadwarden.tier-1": 3, "legacy.veteran.tier-1": 10,
    }
    check({item["definitionId"]: item["threshold"] for item in legacy["tierPolicies"]} == expected_thresholds, "Legacy threshold table is complete and frozen")
    released_oath = next(item for item in legacy["tierPolicies"] if item["definitionId"] == "legacy.oathkeeper.tier-1")
    released_clear = next(item for item in legacy["featPolicies"] if item["definitionId"] == "legacy.feat.first-campaign-clear")
    check(released_oath["rewardVersion"] == 1 and released_oath["rewards"] == [{"kind":"gold","targetId":None,"amount":750}], "released Oathkeeper v1 payload is byte-semantic preserved")
    check(released_clear["rewardVersion"] == 1 and released_clear["rewards"] == [{"kind":"gold","targetId":None,"amount":500}], "released first-clear v1 payload is byte-semantic preserved")
    successors = legacy["successorTierPolicies"]
    check(len(successors) == 1 and successors[0]["definitionId"] == "legacy.oathkeeper.tier-2" and successors[0]["predecessorDefinitionId"] == "legacy.oathkeeper.tier-1", "new Oathkeeper value starts at distinct tier-2 identity")
    check(successors[0]["threshold"] == 3 and successors[0]["rewards"] == [{"kind":"gold","targetId":None,"amount":3000},{"kind":"prosperity","targetId":None,"amount":2}], "Oathkeeper tier-2 candidate threshold and payload are exact")
    collision = legacy["phase13CollisionAudit"]
    check({item["definitionId"] for item in collision["existingOfferSourceIds"]} == {"legacy.oathkeeper.tier-1", "legacy.feat.first-campaign-clear"}, "collision audit identifies both and only released Phase 13 Legacy sources")
    released_index = git("show", f"{SOURCE_COMMIT}:index.html")
    check("rewards:[{kind:'gold',targetId:null,amount:750}]" in released_index and "sourceId:'legacy.oathkeeper.tier-1'" in released_index, "collision audit matches released Oathkeeper 750-Gold source")
    check("rewards:[{kind:'gold',targetId:null,amount:500}]" in released_index and "sourceId:'legacy.feat.first-campaign-clear'" in released_index, "collision audit matches released first-clear 500-Gold source")
    all_candidate_source_ids = candidate_tier_ids | candidate_feat_ids | {item["definitionId"] for item in successors} | {legacy["foundingCache"]["definitionId"]} | {item["definitionId"] for item in policy["phase16RestaurantPolicy"]["restaurantLegacyHooks"]}
    released_collision_ids = {item["definitionId"] for item in collision["existingOfferSourceIds"]}
    absent_audit_ids = set(collision["candidateSourceIdsAbsentFromPhase13OffersAndReceipts"])
    check(released_collision_ids | absent_audit_ids == all_candidate_source_ids, "collision audit enumerates every candidate Legacy source ID exactly once")
    check(all(source_id not in released_index for source_id in absent_audit_ids), "every other candidate Legacy/Restaurant source is absent from Phase 13 runtime offers and receipts")
    check(collision["selectionRules"]["pendingOrClaimedReleasedOfferKeepsCapturedPayload"] and collision["selectionRules"]["activationNeverRequeuesReleasedSource"], "pending and claimed v1 offers are never rewritten or requeued")
    check(collision["selectionRules"]["postActivationOathkeeperTierTwoUsesNewDefinitionId"] == "legacy.oathkeeper.tier-2", "post-activation new Oathkeeper value selects successor identity")
    all_rewards = [reward for item in legacy["tierPolicies"] + legacy["successorTierPolicies"] + legacy["featPolicies"] for reward in item["rewards"]]
    restaurant = policy["phase16RestaurantPolicy"]
    all_rewards += [reward for item in restaurant["restaurantLegacyHooks"] for reward in item["rewards"]]
    check(all(item.get("definitionVersion") == 1 and item.get("rewardVersion") == 1 for item in legacy["tierPolicies"] + legacy["successorTierPolicies"] + legacy["featPolicies"] + restaurant["restaurantLegacyHooks"]), "every reward-bearing definition has explicit definition/reward version lineage")
    check(all(reward["kind"] in CANONICAL_REWARD_KINDS for reward in all_rewards), "all candidate rewards use canonical Phase 12 kinds")
    check(all(isinstance(reward["amount"], int) and reward["amount"] > 0 for reward in all_rewards), "all reward amounts are positive integers")
    check(all(reward["targetId"] is None for reward in all_rewards), "untargeted candidate rewards do not invent roster targets")
    cache = legacy["foundingCache"]
    check(cache["groupingThreshold"] == 3 and cache["combinedRewardsAreExactCanonicalSum"], "Founding Cache groups three with exact sums")
    check(cache["migratedEstablishedSaveOnly"] and cache["freshAndPostActivationGrouping"] is False, "Founding Cache is restricted to explicitly migrated established saves")
    check(cache["majorRewardsRemainIndividual"] and cache["claimsRemainManual"], "major and cache claims preserve manual review")

    source_restaurant_ids = set(all_ids(source_restaurant))
    check(restaurant["facilityId"] == "facility.restaurant" and restaurant["activityId"] == "activity.restaurant-service", "Restaurant uses frozen facility/activity identity")
    check(restaurant["opportunityDefinitionId"] == "opportunity.facility.restaurant.customer", "Restaurant uses frozen opportunity identity")
    check(restaurant["mapAnchorCanonical"] == "western-plaza-restaurant" and restaurant["mapAnchorPredecessorAlias"] == "western-plaza", "Restaurant preserves canonical and predecessor map anchors")
    op = restaurant["operational"]
    check(op["intervalMs"] == 1_800_000 and op["bankCapacity"] == 12, "Restaurant cadence and bank capacity are frozen candidates")
    check(op["unattendedTargetMs"] == op["intervalMs"] * op["bankCapacity"], "bank capacity covers exactly six hours")
    check(op["settlementAllowanceCapMs"] == 86_400_000 and op["existingSaveBackfillCount"] == 0, "shared offline boundary and no migration backfill are explicit")
    check(op["customersExpire"] is False and op["claimMode"] == "manual", "customers are non-expiring and manually claimed")
    authority = restaurant["structuralProductionBandAuthority"]
    check(authority["callerMaySupply"] is False and authority["capturedBandPersistsWithOpportunity"], "reward band is trusted and captured")
    check(set(authority["included"]) == {"building-base-rate", "building-level", "released-level-growth"}, "only structural Building inputs select the band")
    check(set(authority["excluded"]) == {"oath-boost", "family-assignment-bonus", "fellow-roster-bonus", "companion-roster-bonus", "pending-gold", "restaurant-gold", "other-active-facility-gold"}, "boosts and active rewards cannot feed reward bands")

    table_ref = restaurant["fixedRewardTable"]
    check(table_ref["tableId"] == reward_table["tableId"] and table_ref["version"] == reward_table["version"] == 2, "policy resolves exact fixed reward table v2")
    check(table_ref["bandCount"] == 52 and table_ref["runtimeFormulaAllowed"] is False and table_ref["runtimeReadsCapturedFixedIntegerRowOnly"], "runtime is restricted to 52 captured fixed rows")
    check(reward_table["status"] == "candidate-root-review-required" and reward_table["productionEnabled"] is False, "fixed reward table is candidate and production-disabled")
    check(reward_table["runtimeFormulaAllowed"] is False, "build-time provenance cannot become a runtime percentage formula")
    generated = subprocess.run([sys.executable, str(HERE / "generate_reward_table.py")], cwd=ROOT, text=True, capture_output=True, check=True)
    check(json.loads(generated.stdout) == reward_table, "fixed reward table matches deterministic build-time generator")
    bands = reward_table["rows"]
    check(len(bands) == 52 and bands[0]["minimumStructuralGoldPerHour"] == 0 and bands[-1]["maximumStructuralGoldPerHour"] is None, "52 fixed bands cover open endpoints")
    check(all(bands[index]["maximumStructuralGoldPerHour"] + 1 == bands[index + 1]["minimumStructuralGoldPerHour"] for index in range(len(bands) - 1)), "fixed bands are contiguous without overlap")
    band_ids = [band["id"] for band in bands]
    customer_ids = {"restaurant.customer.road-worker", "restaurant.customer.archive-courier", "restaurant.customer.route-envoy"}
    regular_customer_ids = customer_ids - {"restaurant.customer.route-envoy"}
    check(len(band_ids) == len(set(band_ids)), "fixed reward band IDs are unique")
    check(all(set(row["baseSaleGoldByCustomerId"]) == customer_ids for row in bands), "every fixed row covers every customer")
    check(all(set(row["tipGoldByMatch"]) == {"basic", "partial", "matched"} and row["tipGoldByMatch"]["basic"] <= row["tipGoldByMatch"]["partial"] <= row["tipGoldByMatch"]["matched"] for row in bands), "every fixed row has complete monotonic tips")
    check(all(all(isinstance(value, int) and value >= 0 for value in row["baseSaleGoldByCustomerId"].values()) and all(isinstance(value, int) and value >= 0 for value in row["tipGoldByMatch"].values()) for row in bands), "all runtime reward-table values are fixed non-negative integers")
    weights = restaurant["customerSelection"]["regularWeightByCustomerId"]
    check(sum(weights.values()) == 100 and weights["restaurant.customer.route-envoy"] == 0, "regular customer weights sum to 100 and exclude named envoy")

    recipes = restaurant["recipes"]
    stations = restaurant["stations"]
    check({item["id"] for item in recipes} == {"restaurant.recipe.hearth-stew", "restaurant.recipe.garden-flatbread", "restaurant.recipe.roadside-tea"}, "candidate policy covers all three frozen recipes")
    check({item["id"] for item in stations} == {"restaurant.station.hearth", "restaurant.station.prep-table"}, "candidate policy covers both frozen stations")
    check(all(item["id"] in source_restaurant_ids for item in recipes + stations), "all recipe and station IDs resolve to frozen definitions")
    check([item["unlockReputationLevel"] for item in recipes] == [1, 2, 3], "recipes unlock gradually across three local levels")
    check([item["preparationDurationMs"] for item in recipes] == [120000, 90000, 60000], "candidate preparation durations are complete")
    check([item["batchSize"] for item in recipes] == [2, 3, 4] and [item["stockCapacity"] for item in recipes] == [6, 9, 12], "candidate batch and stock capacities are complete")
    prep = restaurant["preparationPolicy"]
    cost_policy = prep["globalResourceCostPolicy"]
    check(cost_policy == {"mode":"none","costEntries":[],"candidateDecisionId":"candidate.restaurant.no-global-input-cost-v1","failClosedIfMissingOrDifferent":True} and prep["manualStartRequired"], "preparation uses explicit fail-closed no-global-cost policy and starts manually")
    check(prep["offlineMayAdvanceCommittedPreparationToReady"] and not prep["offlineMayTransferReadyBatchToStock"], "offline advances timers but not stock transfer")
    check(prep["manualStockTransferRequired"] and prep["preparedStockExpires"] is False, "prepared stock is manually transferred and non-expiring")
    check(prep["serveConsumesPreparedStock"] == 1 and prep["insufficientStockConsumesCustomer"] is False, "serving consumes one stock without punishing insufficient stock")
    progression = restaurant["progression"]
    check(progression["reputationByMatch"] == {"basic": 1, "partial": 2, "matched": 3}, "local reputation result values are complete")
    check(progression["recipeMasteryByMatch"] == {"basic": 1, "partial": 2, "matched": 3}, "recipe mastery result values are complete")
    check(progression["reputationLevelThresholds"] == {"1": 0, "2": 12, "3": 36}, "Restaurant reputation thresholds are complete")
    check(progression["progressionIsSpendable"] is False and progression["progressionAffectsPassiveBuildings"] is False, "local progression is neither currency nor passive multiplier")
    visitor = restaurant["namedVisitor"]
    check(visitor["id"] in source_restaurant_ids and visitor["actorId"] == "family.jaina", "named route visitor resolves and uses accepted actor")
    check(visitor["minimumReputationLevel"] == 3 and visitor["oneTimePerSave"] and visitor["expires"] is False, "named visitor is a level-three one-time non-expiring event")

    guard = restaurant["recurringAccelerationGuardrails"]
    check((guard["typicalGoldPerGenerationHourMinimumBasisPoints"], guard["typicalGoldPerGenerationHourMaximumBasisPoints"], guard["optimalGoldPerGenerationHourMaximumBasisPoints"]) == (500, 1500, 2000), "active acceleration guardrail is 5-15% typical and 20% optimal")
    check(guard["runtimeUsesFixedTablesNotPercentageCalculation"], "runtime reward values are fixed rather than live percentage multipliers")
    band_minimums = {band["id"]: max(band["minimumStructuralGoldPerHour"], 25400) for band in bands}
    hard_ceiling_ok = True
    for row in bands:
        band_id = row["id"]
        lower = band_minimums[band_id]
        best = max(row["baseSaleGoldByCustomerId"][customer] for customer in regular_customer_ids)
        best += row["tipGoldByMatch"]["matched"]
        hard_ceiling_ok &= best * 2 * 10_000 <= lower * 2000
    check(hard_ceiling_ok, "every band remains under the 20% optimal recurring ceiling at its released lower bound")
    weighted_payouts = []
    for row in bands:
        base = row["baseSaleGoldByCustomerId"]
        tips = row["tipGoldByMatch"]
        weighted_payouts.append(base["restaurant.customer.road-worker"] * .6 + base["restaurant.customer.archive-courier"] * .4 + tips["basic"] * .05 + tips["partial"] * .25 + tips["matched"] * .70)
    adjacent_increases = [round((weighted_payouts[index] / weighted_payouts[index - 1] - 1) * 10_000) for index in range(1, len(weighted_payouts))]
    check(max(adjacent_increases) <= table_ref["maximumAdjacentRegularPayoutIncreaseBasisPoints"], "adjacent fixed-row payout cliffs are capped at 15.05%")

    source_tutorial_ids = {item["id"] for item in source_tutorials["tutorials"]}
    candidate_tutorial_ids = {item["id"] for item in tutorials["tutorials"]}
    check(candidate_tutorial_ids == source_tutorial_ids and len(candidate_tutorial_ids) == 12, "all and only the 12 frozen Phase 15-16 tutorials are timed")
    check(len(tutorials["tutorials"]) == len(candidate_tutorial_ids), "tutorial IDs are unique")
    tutorial_rules = tutorials["globalRules"]
    check(tutorial_rules["maximumAutomaticPresentationsPerSafeSurfaceVisit"] == 1, "only one tutorial auto-presents per safe visit")
    check(tutorial_rules["blocking"] is False and tutorial_rules["mechanicalStateIndependentOfPresentation"], "tutorials never block feature use")
    check(tutorial_rules["rewards"] is None and tutorial_rules["replayable"], "tutorial replay never grants rewards")
    tutorial_copy_keys = [key for item in tutorials["tutorials"] for key in item["stepCopyKeys"]]
    check(all(key in copy["strings"] for key in tutorial_copy_keys), "every tutorial step resolves to visible copy")
    check(len(tutorial_copy_keys) == len(set(tutorial_copy_keys)), "tutorial semantic copy keys are unique")
    rep_tutorial = next(item for item in tutorials["tutorials"] if item["id"] == "tutorial.restaurant.reputation")
    recipe_tutorial = next(item for item in tutorials["tutorials"] if item["id"] == "tutorial.restaurant.recipes-and-stations")
    check(recipe_tutorial["trigger"]["threshold"] == 12 and rep_tutorial["trigger"]["threshold"] == 36, "progression tutorials align to candidate local thresholds")

    phase13_actors = {f"{item['roster']}.{item['id']}": item for item in phase13_cast["fellows"] + phase13_cast["family"]}
    source_hooks = {item["actorId"]: item for item in source_cast["actors"]}
    schedule_actors = schedule["actors"]
    schedule_ids = [item["actorId"] for item in schedule_actors]
    check(len(schedule_ids) == 38 and len(set(schedule_ids)) == 38, "cast schedule contains exactly 38 unique actors")
    check(set(schedule_ids) == set(phase13_actors) == set(source_hooks), "candidate schedule resolves every current Fellow and Family actor")
    check(Counter(item["candidateAppearancePhase"] for item in schedule_actors)[15] == 5, "exactly five accepted actors appear in Phase 15")
    check(Counter(item["candidateAppearancePhase"] for item in schedule_actors)[16] == 7, "exactly seven accepted actors appear in Phase 16")
    check(sum(item["candidateAppearancePhase"] > 16 for item in schedule_actors) == 26, "remaining 26 actors stay scheduled later")
    check(all(item["displayName"] == phase13_actors[item["actorId"]]["name"] for item in schedule_actors), "cast display names match exact current inventory")
    check(all(item["joinRank"] == phase13_actors[item["actorId"]]["joinRank"] for item in schedule_actors), "Fellow join ranks and Family null ranks are exact")
    check(all(set(item["candidateHookIds"]).issubset(set(source_hooks[item["actorId"]]["hookIds"])) for item in schedule_actors), "every candidate cast hook is accepted by the frozen schedule")
    phase15_16_hooks = [hook for item in schedule_actors if item["candidateAppearancePhase"] <= 16 for hook in item["candidateHookIds"]]
    check(all(f"{hook}.line.01" in copy["strings"] for hook in phase15_16_hooks), "all 19 Phase 15-16 authored cast hooks have visible copy")
    check(schedule["selectionRules"]["lockedFellowsExcluded"] and schedule["selectionRules"]["speakerRankMustBeMetAtPresentation"], "locked Fellows are excluded at presentation")
    captain = next(item for item in schedule_actors if item["actorId"] == "fellow.captain-america")
    check(captain["joinRank"] == 4 and captain["fallbackActorId"] == "family.virginia", "Rank-4 feat speaker has a non-Fellow fallback")
    check(copy["writingPolicy"]["originalEversteadWriting"] and not copy["writingPolicy"]["externalFranchiseVoiceImitation"], "copy contract requires original Everstead writing")
    check(all(isinstance(value, str) and value.strip() for value in copy["strings"].values()), "every localization key has non-empty English copy")

    ledger_ids = [item["id"] for group in ("approvedByExistingContracts", "candidateRecommendations", "rootReviewDecisions") for item in ledger[group]]
    check(len(ledger_ids) == len(set(ledger_ids)), "decision-ledger IDs are unique")
    check(all((ROOT / item["source"]).is_file() for item in ledger["approvedByExistingContracts"]), "every approved-fact ledger source path exists")
    check(len(ledger["approvedByExistingContracts"]) >= 10, "ledger separates at least ten existing contract facts")
    check(len(ledger["candidateRecommendations"]) >= 12, "ledger identifies all material candidate recommendations")
    check(sum(bool(item.get("blocksProductionEnablement")) for item in ledger["rootReviewDecisions"]) >= 4, "root-review production blockers remain explicit")

    fixture_cases = fixtures["cases"]
    fixture_ids = [item["id"] for item in fixture_cases]
    check(fixtures["qaOnly"] and not fixtures["productionImportAllowed"], "fixtures are unmistakably QA-only")
    check(len(fixture_ids) == len(set(fixture_ids)) and len(fixture_ids) >= 50, "at least 50 unique deterministic fixtures are present")
    required_areas = {"enablement", "versioning", "reversal", "legacy", "claims", "cadence", "banking", "migration", "offline", "preparation", "stock", "service", "concurrency", "bands", "progression", "visitor", "tutorial", "speaker", "localization", "storage"}
    check(required_areas.issubset({item["area"] for item in fixture_cases}), "fixtures cover every required policy boundary")
    check(all(item["id"] and "given" in item and "expect" in item for item in fixture_cases), "every fixture has stable ID, input, and expected result")

    check(simulation["simulationId"] == "phase-15-16-policy-candidate-simulation-v1" and simulation["deterministic"], "simulation result identity and determinism are explicit")
    check([item["profileId"] for item in simulation["profiles"]] == ["fresh", "mid", "established", "late", "cap"], "simulation covers fresh, mid, established, late, and cap profiles")
    check(all(500 <= item["recurringActiveShareBasisPoints"] <= 1500 for item in simulation["profiles"]), "all modeled engaged profiles stay in the 5-15% recurring band")
    check(all(item["optimalSingleCustomerStructuralMinutes"] <= 90 for item in simulation["profiles"]), "all modeled single-customer rewards stay below 90 structural minutes")
    headroom = simulation["fiveYearHeadroom"]
    check(headroom["maximumRecurringCustomerClaims"] == 87600 and headroom["totalClaimReceipts"] == 87616, "five-year claim count is exact for candidate cadence")
    check(headroom["archiveFoldCount"] == 681 and headroom["retainedRecentReceipts"] == 448, "five-year archive folding remains bounded")
    check(headroom["projectedIncrementalBytes"] <= headroom["candidateIncrementalBudgetBytes"], "five-year candidate storage projection stays under one MiB")
    check(headroom["javascriptSafeIntegerHeadroom"] is True, "five-year counters remain safely representable")
    boundary = simulation["boundarySummary"]
    check(boundary["boundaryCount"] == 51 and boundary["sampleCount"] == 153 and len(simulation["boundaryChecks"]) == 51, "every fixed-row boundary has explicit below/at/above simulation")
    check(all(len(item["samples"]) == 3 and [sample["position"] for sample in item["samples"]] == ["justBelow", "at", "justAbove"] for item in simulation["boundaryChecks"]), "all boundary simulations contain ordered just-below/at/just-above samples")
    check(boundary["maximumWeightedPayoutIncreaseBasisPoints"] <= 1505, "maximum boundary payout jump stays at or below 15.05%")
    check(500 <= boundary["minimumSampleActiveShareBasisPoints"] <= boundary["maximumSampleActiveShareBasisPoints"] <= 1500, "all 153 boundary-adjacent samples stay in the typical 5-15% active band")
    sim_check = subprocess.run([sys.executable, str(HERE / "simulate.py"), "--check"], cwd=ROOT, text=True, capture_output=True)
    check(sim_check.returncode == 0, "committed simulation result matches deterministic model")

    print(f"RESULT {passed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate the fail-closed Phase 18–19 product-policy candidate."""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
ACCEPTED = ROOT / "design" / "phase-18-19"
rows: list[tuple[str, bool, str]] = []


def load(path: Path) -> dict:
    return json.loads(path.read_text())


def record(name: str, passed: bool, detail: object = "") -> None:
    rows.append((name, bool(passed), str(detail) if detail else ""))


def null_pointers(value: object, path: str = "") -> list[str]:
    if value is None:
        return [path]
    result: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            result += null_pointers(child, f"{path}/{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            result += null_pointers(child, f"{path}/{index}")
    return result


def pointer(value: object, path: str) -> object:
    current = value
    for token in path.strip("/").split("/"):
        current = current[int(token)] if isinstance(current, list) else current[token]
    return current


def all_unique(values: list[object]) -> bool:
    return len(values) == len({json.dumps(value, sort_keys=True) for value in values})


policy = load(HERE / "policy-candidate.json")
table = load(HERE / "fixed-reward-table.json")
simulation = load(HERE / "simulation-results.json")
tutorials = load(HERE / "tutorial-timing.json")
cast = load(HERE / "cast-schedule.json")
fixtures = load(HERE / "fixtures.json")
ledger = load(HERE / "decision-ledger.json")
apothecary = load(ACCEPTED / "apothecary-definitions.json")
schoolhouse = load(ACCEPTED / "schoolhouse-definitions.json")
accepted_tutorials = load(ACCEPTED / "tutorial-bindings.json")
accepted_cast = load(ACCEPTED / "cast-bindings.json")

record("candidate-status-fail-closed", policy["status"] == "candidate-root-review-required" and policy["authoritative"] is False and policy["productionEnabled"] is False and policy["mechanicalEnablementAllowed"] is False)
record("approval-transition-fail-closed", policy["approvalTransition"]["runtimeMustRejectCandidateStatus"] is True and policy["approvalTransition"]["publicReleaseAllowed"] is False)
record("accepted-design-still-disabled", apothecary["productionEnabled"] is False and schoolhouse["productionEnabled"] is False)
record("global-manual-nonexpiry", policy["globalGuardrails"]["manualClaimsOnly"] and policy["globalGuardrails"]["opportunitiesExpire"] is False)
record("global-offline-no-agency", all(policy["globalGuardrails"][key] is False for key in ("offlineMayChoose", "offlineMayResolve", "offlineMayClaim", "offlineMayTeach", "offlineMayGraduate")))
record("global-offline-cap", policy["globalGuardrails"]["offlineElapsedCapMs"] == 86400000)
record("no-new-global-loops", all(policy["globalGuardrails"][key] is False for key in ("newGlobalCurrency", "stamina", "dailyReset", "dailyChecklist", "permanentPercentageMultiplier")))
record("passive-family-preserved", policy["globalGuardrails"]["passiveBuildingProductionMutated"] is False and policy["globalGuardrails"]["familyAssignmentMutated"] is False)
record("distinct-not-restaurant-schema", policy["globalGuardrails"]["restaurantSchemaReused"] is False)

apoth_nulls = null_pointers(apothecary)
school_nulls = null_pointers(schoolhouse)
record("accepted-apothecary-null-count", len(apoth_nulls) == 38, len(apoth_nulls))
record("accepted-schoolhouse-null-count", len(school_nulls) == 48, len(school_nulls))
record("accepted-null-count-exact", len(apoth_nulls) + len(school_nulls) == 86)
resolved_apoth = policy["phase18ApothecaryPolicy"]["resolvedDesign"]
resolved_school = policy["phase19SchoolhousePolicy"]["resolvedDesign"]
unresolved = [f"apothecary{item}" for item in apoth_nulls if pointer(resolved_apoth, item) is None] + [f"schoolhouse{item}" for item in school_nulls if pointer(resolved_school, item) is None]
record("all-86-null-slots-resolved", not unresolved, unresolved)
record("resolved-overlay-has-no-null", not null_pointers(resolved_apoth) and not null_pointers(resolved_school))

p18 = policy["phase18ApothecaryPolicy"]
record("apothecary-cadence", resolved_apoth["facility"]["operational"] == {"intervalMs": 3600000, "bankCapacity": 8, "unattendedTargetMs": 28800000, "activeProfitTargetShare": 0.05})
record("apothecary-no-backfill-expiry", p18["operationalRules"]["existingSaveBackfillCount"] == 0 and p18["operationalRules"]["casesExpire"] is False and p18["operationalRules"]["claimMode"] == "manual")
record("apothecary-decision-depth", p18["decisionDepth"]["visibleCluesPerCase"] == 3 and p18["decisionDepth"]["diagnosisOptionsPerCase"] == 3 and p18["decisionDepth"]["remedyOptionsPerCase"] == 4 and p18["inputPolicy"]["globalResourceCostMode"] == "none" and p18["inputPolicy"]["globalResourceCosts"] == [] and p18["inputPolicy"]["consumableInventoryRequired"] is False)
record("apothecary-recheck-rewardless", resolved_apoth["outcomeBands"][0] == {"rewards": {"mode": "none", "entries": []}, "masteryProgress": 0} and p18["decisionDepth"]["recheckConsumesCase"] is False)
record("apothecary-positive-terminal", p18["decisionDepth"]["terminalFailureBand"] is False and p18["decisionDepth"]["safeSupportOptionAlwaysAvailable"] is True)
record("apothecary-region-weights", [item["selectionWeight"] for item in resolved_apoth["regions"]] == [50, 30, 20])
record("apothecary-case-weights", [item["selectionWeight"] for item in resolved_apoth["caseTemplates"]] == [100, 100, 100])
record("apothecary-named-authored-not-random", [item["selectionWeight"] for item in resolved_apoth["namedPatients"]] == [0, 0] and p18["selectionPolicy"]["namedPatientsGeneratedByRegularWeight"] is False)
record("apothecary-locked-fellow-gates", [(item["patientId"], item["requiredJoinedRank"]) for item in p18["selectionPolicy"]["namedPatientInsertionRules"]] == [("apothecary.patient.named.rook", 1), ("apothecary.patient.named.daredevil", 3)])
record("apothecary-mastery-values", p18["masteryProgression"]["progressByOutcomeBandId"] == {"apothecary.outcome.supportive": 2, "apothecary.outcome.precise": 3} and p18["masteryProgression"]["levelThresholds"] == {"1": 0, "2": 12, "3": 36, "4": 90})
record("apothecary-mastery-local", p18["masteryProgression"]["spendable"] is False and p18["masteryProgression"]["affectsPassiveBuildings"] is False and p18["masteryProgression"]["knowledgeUnlocksChangeRewardAmounts"] is False and p18["localReputationPolicy"]["trackId"] == "facility-progress.apothecary.mastery" and p18["localReputationPolicy"]["separateReputationCurrency"] is False)

p19 = policy["phase19SchoolhousePolicy"]
record("schoolhouse-cadence", resolved_school["facility"]["operational"] == {"intervalMs": 5400000, "bankCapacity": 8, "unattendedTargetMs": 43200000, "initialSeatCapacity": 1, "maximumSeatCapacity": 2, "activeProfitTargetShare": 0.05})
record("schoolhouse-no-backfill-expiry", p19["operationalRules"]["existingSaveBackfillCount"] == 0 and all(p19["operationalRules"][key] is False for key in ("lessonsExpire", "candidatePupilsExpire", "graduationReadyExpires")))
record("schoolhouse-seat-policy", p19["decisionDepth"]["initialSeatCount"] == 1 and p19["decisionDepth"]["maximumSeatCount"] == 2 and resolved_school["seatPolicy"]["seatUnlockRules"][1]["educationRequired"] == 36 and resolved_school["seatPolicy"]["seatUnlockRules"][1]["graduationsRequired"] == 1)
record("schoolhouse-three-by-eight", p19["developmentProgression"]["graduationRequirementByDomainId"] == {"schoolhouse.domain.foundations": 8, "schoolhouse.domain.craft": 8, "schoolhouse.domain.community": 8})
record("schoolhouse-positive-outcomes", p19["decisionDepth"]["allValidApproachesPositive"] is True and p19["developmentProgression"]["developmentByOutcomeBandId"] == {"schoolhouse.outcome.guided": 2, "schoolhouse.outcome.resonant": 3} and p19["inputPolicy"]["globalResourceCostMode"] == "none" and p19["inputPolicy"]["globalResourceCosts"] == [] and p19["inputPolicy"]["consumableInventoryRequired"] is False)
record("schoolhouse-mentor-bands", [(item["minimumInclusive"], item["developmentBonus"], item["rewardGoldBonus"]) for item in p19["mentorPolicy"]["intimacyBands"]] == [(0, 0, 0), (25, 1, 0), (50, 1, 250)])
record("schoolhouse-mentor-positive-local", p19["mentorPolicy"]["maximumMentors"] == 1 and p19["mentorPolicy"]["absenceUsesFullBaseline"] and p19["mentorPolicy"]["consumesOrMutatesRelationship"] is False and p19["mentorPolicy"]["bonusChangesPassiveBuildings"] is False)
record("schoolhouse-graduation-v2", p19["graduationPolicy"]["offerVersion"] == 2 and p19["graduationPolicy"]["receiptVersion"] == 2 and p19["graduationPolicy"]["domainClaimKind"] == "schoolhouse-graduation" and p19["graduationPolicy"]["finalizerId"] == "schoolhouseGraduationFinalizerV1")
record("schoolhouse-graduation-manual-exact", p19["graduationPolicy"]["oneTimePerPupil"] and p19["graduationPolicy"]["expires"] is False and p19["graduationPolicy"]["manualClaim"] and p19["graduationPolicy"]["freesSeatOnlyOnClaim"])
record("schoolhouse-graduation-rewards", p19["graduationPolicy"]["giftReward"] == 1 and p19["graduationPolicy"]["relicStoneReward"] == 3 and p19["graduationPolicy"]["educationDelta"] == 6)
record("schoolhouse-education-local", p19["developmentProgression"]["educationIsSpendable"] is False and p19["developmentProgression"]["educationAffectsPassiveBuildings"] is False and p19["developmentProgression"]["graduationEducationIsFlatLocalProgressNotPercentageMultiplier"] and p19["localReputationPolicy"]["trackId"] == "facility-progress.schoolhouse.education" and p19["localReputationPolicy"]["separateReputationCurrency"] is False)

record("table-identity", table["tableId"] == policy["structuralProductionBandAuthority"]["fixedTableId"] and table["version"] == 1 and table["productionEnabled"] is False and table["runtimeFormulaAllowed"] is False)
record("table-52-bands", len(table["bands"]) == 52 and all_unique([item["id"] for item in table["bands"]]))
continuous = table["bands"][0]["minimumGoldPerHourInclusive"] == 0 and table["bands"][-1]["maximumGoldPerHourInclusive"] is None and all(left["maximumGoldPerHourInclusive"] + 1 == right["minimumGoldPerHourInclusive"] for left, right in zip(table["bands"], table["bands"][1:]))
record("table-continuous-no-overlap", continuous)
record("table-fixed-positive-integers", all(isinstance(value, int) and value > 0 for band in table["bands"] for value in [*band["apothecaryGoldByOutcomeBandId"].values(), *band["schoolhouseGoldByOutcomeBandId"].values(), band["schoolhouseGraduationGold"]]))
record("table-first-band-values", table["bands"][0]["apothecaryGoldByOutcomeBandId"] == {"apothecary.outcome.supportive": 762, "apothecary.outcome.precise": 1270} and table["bands"][0]["schoolhouseGoldByOutcomeBandId"] == {"schoolhouse.outcome.guided": 953, "schoolhouse.outcome.resonant": 1524} and table["bands"][0]["schoolhouseGraduationGold"] == 6350)

record("simulation-five-profiles", [item["profileId"] for item in simulation["profiles"]] == ["profile.fresh", "profile.midgame", "profile.established", "profile.high-activity", "profile.mostly-idle"])
record("simulation-five-horizons", all([item["days"] for item in profile["horizons"]] == [1, 7, 30, 365, 1825] for profile in simulation["profiles"]))
guard = simulation["guardrailEvaluation"]
record("simulation-recurring-share", guard["maximumProfileRecurringShareBasisPoints"] <= 1050, guard["maximumProfileRecurringShareBasisPoints"])
record("simulation-30-day-total-share", guard["maximumThirtyDayTotalActiveShareBasisPoints"] <= 1200, guard["maximumThirtyDayTotalActiveShareBasisPoints"])
record("simulation-boundary-share", len(simulation["boundaryAdjacentCases"]) == 153 and guard["maximumBoundaryOptimalRecurringBasisPoints"] <= 1050, guard["maximumBoundaryOptimalRecurringBasisPoints"])
record("simulation-passive-preserved", guard["passiveProductionMutations"] == 0 and guard["familyAssignmentMutations"] == 0)
record("simulation-save-headroom", simulation["headroom"]["estimatedTotalFacilitySaveBytes"] < 1048576)
record("simulation-integer-headroom", simulation["headroom"]["safeIntegerHeadroomFactor"] >= 100, simulation["headroom"]["safeIntegerHeadroomFactor"])

accepted_tutorial_ids = [item["tutorialId"] for item in accepted_tutorials["bindings"]]
record("tutorial-exact-nine", [item["tutorialId"] for item in tutorials["entries"]] == accepted_tutorial_ids and len(tutorials["entries"]) == 9)
record("tutorial-one-segment-per-visit", tutorials["deliveryRules"]["maximumNewTutorialSegmentsPerFacilityVisit"] == 1)
record("tutorial-nonblocking-neutral", all(tutorials["deliveryRules"][key] is False for key in ("skipAffectsMechanicalState", "replayAffectsMechanicalState", "tutorialRewards", "featureBlocking", "claimBlocking", "offlineBlocking", "passiveProductionBlocking")))
first_lesson = next(item for item in tutorials["entries"] if item["tutorialId"] == "tutorial.facility.schoolhouse.first-lesson")
record("tutorial-first-lesson-segmented", [item["event"] for item in first_lesson["triggers"]] == ["schoolhouse-first-visit", "schoolhouse-first-lesson-ready", "schoolhouse-first-teaching-opened"])

accepted_actor_ids = [item["actorId"] for item in accepted_cast["actors"]]
record("cast-exact-ten", [item["actorId"] for item in cast["entries"]] == accepted_actor_ids and len(cast["entries"]) == 10)
record("cast-rank-locks", {item["actorId"]: item["minimumJoinedRank"] for item in cast["entries"] if item["actorId"].startswith("fellow.")} == {"fellow.rook": 1, "fellow.daredevil": 3, "fellow.obi-wan": 5, "fellow.spider-man": 4})
record("cast-presentation-policy", "Never use an unframed full-background profile image" in cast["presentationPolicy"] and cast["runtimeRules"]["lockedFellowsExcluded"] and cast["runtimeRules"]["playerWayfarerIsSeparateAndNeverFacilityScheduled"])

source_ids = [item["definitionId"] for phase in (p18, p19) for item in phase["achievementPolicies"]]
record("achievement-source-ids-unique", len(source_ids) == 7 and all_unique(source_ids))
collision_files = []
for path in ROOT.rglob("*"):
    if not path.is_file() or HERE in path.parents or ".git" in path.parts or path.suffix not in {".json", ".md", ".html", ".js", ".mjs", ".py"}:
        continue
    try:
        content = path.read_text(errors="ignore")
    except OSError:
        continue
    if any(source_id in content for source_id in source_ids):
        collision_files.append(str(path.relative_to(ROOT)))
record("achievement-source-ids-no-released-collision", not collision_files, collision_files)

record("fixtures-unique", len(fixtures["cases"]) == 52 and all_unique([item["id"] for item in fixtures["cases"]]))
ledger_sources = [item["source"] for item in ledger["acceptedContractFacts"]]
record("ledger-sources-exist", all((ROOT / item).is_file() for item in ledger_sources), ledger_sources)
record("ledger-separates-facts-candidates-approvals", len(ledger["acceptedContractFacts"]) == 7 and len(ledger["candidateRecommendations"]) == 10 and len(ledger["rootApprovalRequired"]) == 6)

generator = subprocess.run([sys.executable, str(HERE / "generate_reward_table.py"), "--check"], cwd=ROOT, text=True, capture_output=True)
record("generated-table-current", generator.returncode == 0, generator.stdout.strip())
simulator = subprocess.run([sys.executable, str(HERE / "simulate.py"), "--check"], cwd=ROOT, text=True, capture_output=True)
record("generated-simulation-current", simulator.returncode == 0, simulator.stdout.strip())

required_files = ["README.md", "PRODUCT_POLICY_CANDIDATE.md", "policy-candidate.json", "fixed-reward-table.json", "generate_reward_table.py", "simulation-results.json", "simulate.py", "tutorial-timing.json", "cast-schedule.json", "fixtures.json", "decision-ledger.json", "validate.py"]
record("package-topology", sorted(path.name for path in HERE.iterdir() if path.is_file()) == sorted(required_files))
record("candidate-file-count", len(required_files) == 12)
hashes = {name: hashlib.sha256((HERE / name).read_bytes()).hexdigest() for name in required_files if (HERE / name).is_file()}
record("all-files-readable-and-hashable", len(hashes) == 12)

passed = sum(item[1] for item in rows)
for name, ok, detail in rows:
    suffix = f" — {detail}" if detail else ""
    print(f"{'PASS' if ok else 'FAIL'} {name}{suffix}")
print(f"SUMMARY {passed}/{len(rows)} checks; 86/86 null slots; 52 bands; 5 profiles x 5 horizons; 153 boundary cases; 9 tutorials; 10 actors; 52 fixtures")
raise SystemExit(0 if passed == len(rows) else 1)

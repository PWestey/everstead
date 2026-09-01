#!/usr/bin/env python3
"""Validate the combined Phase 18–19 design package."""

from __future__ import annotations

import json
from pathlib import Path
import sys


HERE = Path(__file__).resolve().parent
DESIGN = HERE.parent
EXPECTED_PARENT = "7cda7b30ecc44ac12a2a1ffac92a60745e4e68dc"


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def all_null(values) -> bool:
    if isinstance(values, dict):
        return all(all_null(value) for value in values.values())
    if isinstance(values, list):
        return all(all_null(value) for value in values)
    return values is None


def main() -> int:
    apothecary = load(HERE / "apothecary-definitions.json")
    schoolhouse = load(HERE / "schoolhouse-definitions.json")
    tutorials = load(HERE / "tutorial-bindings.json")
    cast_bindings = load(HERE / "cast-bindings.json")
    fixtures = load(HERE / "fixtures.json")

    phase13_cast = load(DESIGN / "phase-13" / "cast-plan.json")
    tutorial_ledger = load(DESIGN / "phase-13" / "tutorial-matrix.json")
    phase14 = load(DESIGN / "phase-14" / "facility-definitions.json")
    cast_hooks = load(DESIGN / "phase-15-16" / "cast-hooks.json")
    phase17_story = load(DESIGN / "phase-17" / "book1-story.json")
    phase17_unlocks = load(DESIGN / "phase-17" / "facility-unlocks.json")

    results: list[tuple[str, bool, str]] = []

    def check(label: str, condition: bool, detail: str = "") -> None:
        results.append((label, bool(condition), detail))

    actors = {
        **{
            "fellow." + item["id"]: item for item in phase13_cast["fellows"]
        },
        **{
            "family." + item["id"]: item for item in phase13_cast["family"]
        },
    }
    primary_content_ids = {
        item["authoredDialogue"]["contentId"] for item in actors.values()
    }
    story_scene_ids = {item["id"] for item in phase17_story["scenes"]}
    known_content_ids = story_scene_ids | primary_content_ids
    facility_by_id = {item["id"]: item for item in phase14["facilities"]}
    opportunity_by_id = {
        item["id"]: item for item in phase14["opportunityDefinitions"]
    }
    unlock_by_facility = {
        item["facilityId"]: item for item in phase17_unlocks["facilityUnlocks"]
    }
    hook_by_actor = {
        item["actorId"]: set(item["hookIds"]) for item in cast_hooks["actors"]
    }
    tutorial_by_id = {
        item["id"]: item for item in tutorial_ledger["tutorials"]
    }

    check(
        "exact source parent",
        apothecary["sourceCommit"] == EXPECTED_PARENT
        and schoolhouse["sourceCommit"] == EXPECTED_PARENT,
    )
    check(
        "all package production flags false",
        all(
            document.get("productionEnabled") is False
            for document in (
                apothecary,
                schoolhouse,
                tutorials,
                cast_bindings,
                fixtures,
            )
        ),
    )

    expected_domains = [
        (
            apothecary,
            "facility.apothecary",
            "activity.apothecary-cases",
            "opportunity.facility.apothecary.case",
        ),
        (
            schoolhouse,
            "facility.schoolhouse",
            "activity.school-lessons",
            "opportunity.facility.schoolhouse.lesson",
        ),
    ]
    check(
        "exact Phase 14 facility/activity/opportunity identities",
        all(
            document["facility"]["id"] == facility_id
            and document["facility"]["activityId"] == activity_id
            and document["facility"]["opportunityDefinitionId"]
            == opportunity_id
            and facility_by_id[facility_id]["activityId"] == activity_id
            and opportunity_by_id[opportunity_id]["facilityId"] == facility_id
            and opportunity_by_id[opportunity_id]["activityId"] == activity_id
            for document, facility_id, activity_id, opportunity_id in expected_domains
        ),
    )
    check(
        "non-expiring manual regular claims",
        all(
            document["opportunityDefinition"]["expires"] is False
            and document["opportunityDefinition"]["claimMode"] == "manual"
            for document, _, _, _ in expected_domains
        ),
    )
    check(
        "Phase 17 discovery/opening mappings preserved",
        all(
            document["facility"]["storyDiscoveryContentId"]
            == unlock_by_facility[facility_id]["discovery"]["contentId"]
            and document["facility"]["openingContentId"]
            == unlock_by_facility[facility_id]["activeInteraction"]["openingContentId"]
            for document, facility_id, _, _ in expected_domains
        ),
    )
    check(
        "facility story/opening content resolves",
        all(
            document["facility"]["storyDiscoveryContentId"] in known_content_ids
            and document["facility"]["openingContentId"] in known_content_ids
            for document, _, _, _ in expected_domains
        ),
    )
    check(
        "all operational cadence capacity and profit values null",
        all(
            all_null(document["facility"]["operational"] | {"economyStatus": None})
            for document, _, _, _ in expected_domains
        ),
    )

    remedy_ids = {item["id"] for item in apothecary["remedies"]}
    diagnosis_ids = {item["id"] for item in apothecary["diagnoses"]}
    clue_ids = {item["id"] for item in apothecary["clues"]}
    region_ids = {item["id"] for item in apothecary["regions"]}
    case_ids = {item["id"] for item in apothecary["caseTemplates"]}
    named_patient_ids = {item["id"] for item in apothecary["namedPatients"]}
    apothecary_sets = [
        apothecary["remedies"],
        apothecary["diagnoses"],
        apothecary["clues"],
        apothecary["regions"],
        apothecary["caseTemplates"],
        apothecary["namedPatients"],
        apothecary["outcomeBands"],
        apothecary["metrics"],
        apothecary["achievementHooks"],
        apothecary["storyHooks"],
    ]
    check(
        "Apothecary stable IDs unique by registry",
        all(len(items) == len({item["id"] for item in items}) for items in apothecary_sets),
    )
    check(
        "Apothecary diagnosis remedy references",
        all(
            set(item["compatibleRemedyIds"]) <= remedy_ids
            for item in apothecary["diagnoses"]
        ),
    )
    check(
        "Apothecary case references",
        all(
            item["regionId"] in region_ids
            and item["storyGateContentId"] in known_content_ids
            and set(item["clueIds"]) <= clue_ids
            and set(item["diagnosisOptionIds"]) <= diagnosis_ids
            and item["preciseDiagnosisId"] in item["diagnosisOptionIds"]
            and set(item["preciseRemedyIds"] + item["safeSupportRemedyIds"])
            <= remedy_ids
            for item in apothecary["caseTemplates"]
        ),
    )
    check(
        "Apothecary regional story references",
        all(
            item["storyGateContentId"] in known_content_ids
            for item in apothecary["regions"]
        ),
    )
    check(
        "Apothecary named-patient references",
        all(
            item["actorId"] in actors
            and item["caseTemplateId"] in case_ids
            and item["storyGateContentId"] in known_content_ids
            for item in apothecary["namedPatients"]
        ),
    )
    outcome_by_id = {item["id"]: item for item in apothecary["outcomeBands"]}
    check(
        "Apothecary forgiving outcome set",
        set(outcome_by_id)
        == {
            "apothecary.outcome.recheck",
            "apothecary.outcome.supportive",
            "apothecary.outcome.precise",
        }
        and outcome_by_id["apothecary.outcome.recheck"]["terminal"] is False
        and outcome_by_id["apothecary.outcome.supportive"]["terminal"] is True
        and outcome_by_id["apothecary.outcome.precise"]["terminal"] is True
        and outcome_by_id["apothecary.outcome.recheck"]["rewards"] is None
        and outcome_by_id["apothecary.outcome.recheck"]["masteryProgress"]
        is None,
    )
    check(
        "Apothecary policy selection values null",
        all(item["selectionWeight"] is None for item in apothecary["regions"])
        and all(
            item["selectionWeight"] is None for item in apothecary["caseTemplates"]
        )
        and all(
            item["selectionWeight"] is None for item in apothecary["namedPatients"]
        )
        and all(
            item["knowledgeUnlockRuleId"] is None
            for item in apothecary["remedies"]
        ),
    )
    check(
        "Apothecary progression and economy null",
        apothecary["masteryPolicy"]["levelThresholds"] is None
        and apothecary["masteryPolicy"]["remedyUnlockRuleIds"] is None
        and apothecary["masteryPolicy"]["patientVarietyUnlockRules"] is None
        and all_null(apothecary["economyPolicy"]["rewardByOutcomeBandId"])
        and all_null(apothecary["economyPolicy"]["masteryProgressByOutcomeBandId"])
        and apothecary["economyPolicy"]["activeProfitTargetShare"] is None,
    )
    apothecary_metric_ids = {item["id"] for item in apothecary["metrics"]}
    check(
        "Apothecary achievement hooks unresolved and metric-valid",
        all(
            item["metricId"] in apothecary_metric_ids
            and item["achievementDefinitionId"] is None
            and item["threshold"] is None
            for item in apothecary["achievementHooks"]
        ),
    )
    check(
        "Apothecary story hooks resolve",
        all(item["contentId"] in known_content_ids for item in apothecary["storyHooks"]),
    )

    domain_ids = {item["id"] for item in schoolhouse["developmentDomains"]}
    approach_ids = {item["id"] for item in schoolhouse["teachingApproaches"]}
    lesson_ids = {item["id"] for item in schoolhouse["lessons"]}
    pupil_ids = {item["id"] for item in schoolhouse["pupils"]}
    graduation_ids = {item["id"] for item in schoolhouse["graduationDefinitions"]}
    schoolhouse_sets = [
        schoolhouse["developmentDomains"],
        schoolhouse["teachingApproaches"],
        schoolhouse["lessons"],
        schoolhouse["pupils"],
        schoolhouse["lessonOutcomeBands"],
        schoolhouse["graduationDefinitions"],
        schoolhouse["metrics"],
        schoolhouse["achievementHooks"],
        schoolhouse["storyHooks"],
    ]
    check(
        "Schoolhouse stable IDs unique by registry",
        all(len(items) == len({item["id"] for item in items}) for items in schoolhouse_sets),
    )
    check(
        "Schoolhouse lesson references",
        all(
            item["domainId"] in domain_ids
            and item["storyGateContentId"] in known_content_ids
            and set(item["affinityApproachIds"]) <= approach_ids
            for item in schoolhouse["lessons"]
        ),
    )
    check(
        "Schoolhouse pupil references",
        all(
            item["arrivalStoryContentId"] in known_content_ids
            and set(item["preferenceApproachIds"]) <= approach_ids
            and item["graduationDefinitionId"] in graduation_ids
            for item in schoolhouse["pupils"]
        ),
    )
    school_outcomes = {item["id"]: item for item in schoolhouse["lessonOutcomeBands"]}
    check(
        "Schoolhouse positive outcome set",
        set(school_outcomes)
        == {"schoolhouse.outcome.guided", "schoolhouse.outcome.resonant"}
        and all(
            item["rewards"] is None
            and item["developmentProgress"] is None
            and item["educationProgress"] is None
            for item in schoolhouse["lessonOutcomeBands"]
        ),
    )
    modifier = schoolhouse["familyRelationshipModifierPolicy"]
    check(
        "Schoolhouse Family modifier controlled and null-capped",
        modifier["eligibleMentorRuleId"] is None
        and modifier["conversionFormula"] is None
        and modifier["maximumProgressBonus"] is None
        and modifier["maximumRewardBonus"] is None
        and modifier["stackLimit"] == 1
        and modifier["positiveOnly"] is True
        and modifier["absenceUsesBaseline"] is True
        and modifier["consumesOrMutatesRelationship"] is False,
    )
    check(
        "Schoolhouse capacity selection and requirements null",
        schoolhouse["seatPolicy"]["initialSeatCount"] is None
        and schoolhouse["seatPolicy"]["maximumSeatCount"] is None
        and schoolhouse["seatPolicy"]["seatUnlockRules"] is None
        and all(
            item["graduationRequirement"] is None
            for item in schoolhouse["developmentDomains"]
        )
        and all(item["selectionWeight"] is None for item in schoolhouse["lessons"])
        and all(item["selectionWeight"] is None for item in schoolhouse["pupils"]),
    )
    check(
        "Schoolhouse graduation exact-once manual and null",
        all(
            set(item["requiredProgressByDomainId"]) == domain_ids
            and all_null(item["requiredProgressByDomainId"])
            and item["majorRewards"] is None
            and item["educationModifierDelta"] is None
            and item["claimMode"] == "manual"
            and item["exactlyOncePerPupil"] is True
            for item in schoolhouse["graduationDefinitions"]
        ),
    )
    check(
        "Schoolhouse economy null",
        all_null(schoolhouse["economyPolicy"]["rewardByOutcomeBandId"])
        and all_null(
            schoolhouse["economyPolicy"]["developmentProgressByOutcomeBandId"]
        )
        and all_null(
            schoolhouse["economyPolicy"]["educationProgressByOutcomeBandId"]
        )
        and schoolhouse["economyPolicy"]["graduationMajorRewards"] is None
        and schoolhouse["economyPolicy"]["graduationEducationModifier"] is None
        and schoolhouse["economyPolicy"]["activeProfitTargetShare"] is None,
    )
    school_metric_ids = {item["id"] for item in schoolhouse["metrics"]}
    check(
        "Schoolhouse achievement hooks unresolved and metric-valid",
        all(
            item["metricId"] in school_metric_ids
            and item["achievementDefinitionId"] is None
            and item["threshold"] is None
            for item in schoolhouse["achievementHooks"]
        ),
    )
    check(
        "Schoolhouse story hooks resolve",
        all(item["contentId"] in known_content_ids for item in schoolhouse["storyHooks"]),
    )

    tutorial_ids = [item["tutorialId"] for item in tutorials["bindings"]]
    check(
        "exact nine tutorial bindings from 79-ID ledger",
        len(tutorial_ids) == 9
        and len(set(tutorial_ids)) == 9
        and len(tutorial_by_id) == 79
        and set(tutorial_ids) <= set(tutorial_by_id),
    )
    check(
        "tutorial speakers reference cast",
        all(item["canonicalSpeakerActorId"] in actors for item in tutorials["bindings"]),
    )
    check(
        "tutorial semantic steps match ledger",
        all(
            [
                step_id
                for segment in item["stepSegments"]
                for step_id in segment["stepIds"]
            ]
            == tutorial_by_id[item["tutorialId"]]["steps"]
            for item in tutorials["bindings"]
        ),
    )
    school_first = next(
        item
        for item in tutorials["bindings"]
        if item["tutorialId"] == "tutorial.facility.schoolhouse.first-lesson"
    )
    check(
        "Schoolhouse first lesson segmented across three contexts",
        len(school_first["stepSegments"]) == 3
        and [len(item["stepIds"]) for item in school_first["stepSegments"]]
        == [2, 1, 1],
    )

    bound_actor_ids = [item["actorId"] for item in cast_bindings["actors"]]
    expected_bound_actor_ids = set(apothecary["facility"]["actorIds"]) | set(
        schoolhouse["facility"]["actorIds"]
    )
    check(
        "bounded ten-actor phase subset",
        len(bound_actor_ids) == 10
        and len(set(bound_actor_ids)) == 10
        and set(bound_actor_ids) == expected_bound_actor_ids
        and len(bound_actor_ids) < len(actors),
    )
    check(
        "Phase 13 primary cast schedule preserved",
        all(
            item["phase13PrimaryContentId"]
            == actors[item["actorId"]]["authoredDialogue"]["contentId"]
            and item["phase13PrimaryDeliveryPhase"]
            == actors[item["actorId"]]["authoredDialogue"]["deliveryPhase"]
            for item in cast_bindings["actors"]
        ),
    )
    check(
        "cast hook references exact",
        all(
            binding["hookId"] in hook_by_actor[item["actorId"]]
            for item in cast_bindings["actors"]
            for binding in item["phaseBindings"]
        ),
    )
    valid_phase_content = known_content_ids | named_patient_ids
    check(
        "cast content and facility references",
        all(
            binding["contentId"] in valid_phase_content
            and binding["facilityId"]
            in {"facility.apothecary", "facility.schoolhouse"}
            for item in cast_bindings["actors"]
            for binding in item["phaseBindings"]
        ),
    )

    fixture_ids = [item["id"] for item in fixtures["fixtures"]]
    required_categories = {
        "fresh",
        "migration",
        "offline",
        "non-expiry",
        "reload",
        "choice",
        "claim",
        "story",
        "progression",
        "achievement",
        "corruption",
        "multi-tab",
        "seat",
        "relationship",
        "graduation",
        "tutorial",
        "archive",
        "mobile",
        "reduced-motion",
        "localization",
        "reference",
    }
    check("at least forty fixtures", len(fixture_ids) >= 40, str(len(fixture_ids)))
    check("fixture IDs unique", len(fixture_ids) == len(set(fixture_ids)))
    check(
        "required fixture categories covered",
        required_categories <= {item["category"] for item in fixtures["fixtures"]},
    )
    qa_policy = fixtures["syntheticPolicy"]
    check(
        "synthetic fixture policy unmistakably QA-only",
        qa_policy["scope"] == "QA_ONLY_NEVER_PRODUCTION_OR_MIGRATION_FALLBACK"
        and qa_policy["requiresIsolatedStorage"] is True
        and all(
            isinstance(value, int) and not isinstance(value, bool) and value > 0
            for domain in (qa_policy["apothecary"], qa_policy["schoolhouse"])
            for value in domain.values()
        ),
    )

    serialized_domains = json.dumps(
        {"apothecary": apothecary, "schoolhouse": schoolhouse}, sort_keys=True
    )
    check(
        "not Restaurant reskins",
        all(
            forbidden not in serialized_domains
            for forbidden in (
                "restaurant.recipe",
                "restaurant.station",
                "restaurant.stock",
                "restaurant.reputation",
            )
        ),
    )

    for label, passed, detail in results:
        print(("PASS " if passed else "FAIL ") + label + (f" — {detail}" if detail else ""))
    passed_count = sum(passed for _, passed, _ in results)
    print(
        f"SUMMARY {passed_count}/{len(results)} checks; "
        f"{len(apothecary['caseTemplates'])} cases; "
        f"{len(apothecary['namedPatients'])} named patients; "
        f"{len(schoolhouse['pupils'])} pupils; "
        f"{len(schoolhouse['lessons'])} lessons; "
        f"{len(tutorial_ids)} tutorials; {len(bound_actor_ids)} actors; "
        f"{len(fixture_ids)} fixtures"
    )
    return 0 if passed_count == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())

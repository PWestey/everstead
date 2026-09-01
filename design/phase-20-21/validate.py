#!/usr/bin/env python3
"""Validate the combined Phase 20–21 design and release package."""

from __future__ import annotations

import json
from pathlib import Path
import sys


HERE = Path(__file__).resolve().parent
DESIGN = HERE.parent
EXPECTED_PARENT = "44c8cc0c06079ae7e141fb1ec2de71d352d282a6"


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def ids(items: list[dict]) -> list[str]:
    return [item["id"] for item in items]


def unique(items: list[dict]) -> bool:
    values = ids(items)
    return len(values) == len(set(values))


def null_values(mapping: dict, excluded: set[str] | None = None) -> bool:
    excluded = excluded or set()
    return all(value is None for key, value in mapping.items() if key not in excluded)


def main() -> int:
    phase20 = load(HERE / "phase20-definitions.json")
    phase21 = load(HERE / "phase21-definitions.json")
    integration = load(HERE / "cross-facility-integration.json")
    tutorials = load(HERE / "tutorial-bindings.json")
    cast_bindings = load(HERE / "cast-bindings.json")
    release_gate = load(HERE / "release-gate.json")
    fixtures = load(HERE / "fixtures.json")

    phase13_cast = load(DESIGN / "phase-13" / "cast-plan.json")
    tutorial_ledger = load(DESIGN / "phase-13" / "tutorial-matrix.json")
    phase14 = load(DESIGN / "phase-14" / "facility-definitions.json")
    phase15_hooks = load(DESIGN / "phase-15-16" / "cast-hooks.json")
    phase17_story = load(DESIGN / "phase-17" / "book1-story.json")
    phase17_unlocks = load(DESIGN / "phase-17" / "facility-unlocks.json")

    results: list[tuple[str, bool, str]] = []

    def check(label: str, condition: bool, detail: str = "") -> None:
        results.append((label, bool(condition), detail))

    actors = {
        **{"fellow." + item["id"]: item for item in phase13_cast["fellows"]},
        **{"family." + item["id"]: item for item in phase13_cast["family"]},
    }
    primary_content_ids = {
        item["authoredDialogue"]["contentId"] for item in actors.values()
    }
    story_ids = {item["id"] for item in phase17_story["scenes"]}
    known_content_ids = primary_content_ids | story_ids
    facility14 = {item["id"]: item for item in phase14["facilities"]}
    opportunity14 = {
        item["id"]: item for item in phase14["opportunityDefinitions"]
    }
    unlock17 = {
        item["facilityId"]: item for item in phase17_unlocks["facilityUnlocks"]
    }
    tutorial13 = {item["id"]: item for item in tutorial_ledger["tutorials"]}
    hook_owner = {
        hook_id: actor["actorId"]
        for actor in phase15_hooks["actors"]
        for hook_id in actor["hookIds"]
    }

    target20 = {
        "facility.command-center",
        "facility.archives",
        "facility.training-grounds",
        "facility.hearth",
    }
    target21 = {
        "facility.gatehouse",
        "facility.market-workshop",
        "facility.gardens",
        "facility.forge",
    }
    targets = target20 | target21
    p20_facilities = {item["id"]: item for item in phase20["facilities"]}
    p21_facilities = {item["id"]: item for item in phase21["facilities"]}
    all_defined_facilities = p20_facilities | p21_facilities
    p20_opportunities = {
        item["id"]: item for item in phase20["opportunityDefinitions"]
    }
    p21_opportunities = {
        item["id"]: item for item in phase21["opportunityDefinitions"]
    }

    check(
        "exact parent commit",
        all(
            document["sourceCommit"] == EXPECTED_PARENT
            for document in (phase20, phase21, integration, release_gate)
        ),
    )
    check(
        "all production flags false",
        all(
            document.get("productionEnabled") is False
            for document in (
                phase20,
                phase21,
                integration,
                tutorials,
                cast_bindings,
                fixtures,
            )
        )
        and release_gate["productionReleaseAllowed"] is False,
    )
    check(
        "exact four Phase 20 and four Phase 21 facilities",
        set(p20_facilities) == target20
        and set(p21_facilities) == target21
        and len(all_defined_facilities) == 8,
    )
    check(
        "exact Phase 14 facility/activity/opportunity identities",
        all(
            facility["activityId"] == facility14[facility_id]["activityId"]
            and facility["opportunityDefinitionId"]
            in facility14[facility_id]["opportunityDefinitionIds"]
            and opportunity14[facility["opportunityDefinitionId"]]["facilityId"]
            == facility_id
            and opportunity14[facility["opportunityDefinitionId"]]["activityId"]
            == facility["activityId"]
            for facility_id, facility in all_defined_facilities.items()
        ),
    )
    check(
        "exact Phase 17 physical anchors/unlocks",
        all(
            facility["mapAnchor"] == unlock17[facility_id]["mapAnchor"]
            and facility["capabilityId"]
            == unlock17[facility_id]["activeInteraction"]["requiredCapabilityId"]
            and facility["storyDiscoveryContentId"]
            == unlock17[facility_id]["discovery"]["contentId"]
            and facility["openingContentId"]
            == unlock17[facility_id]["activeInteraction"]["openingContentId"]
            for facility_id, facility in all_defined_facilities.items()
        ),
    )
    check(
        "facility story/opening references",
        all(
            facility["storyDiscoveryContentId"] in known_content_ids
            and facility["openingContentId"] in known_content_ids
            for facility in all_defined_facilities.values()
        ),
    )
    check(
        "all operational values null",
        all(
            all(value is None for value in facility["operational"].values())
            for facility in all_defined_facilities.values()
        ),
    )
    check(
        "art and CSS treatments null",
        all(
            document["presentationPolicy"]["artTreatmentByFacilityId"] is None
            and document["presentationPolicy"]["cssTreatmentByFacilityId"] is None
            for document in (phase20, phase21)
        ),
    )
    check(
        "all eight opportunities manual and non-expiring",
        all(
            opportunity["expires"] is False
            and opportunity["claimMode"] == "manual"
            and opportunity["facilityId"] in targets
            for opportunity in (p20_opportunities | p21_opportunities).values()
        )
        and len(p20_opportunities | p21_opportunities) == 8,
    )
    check(
        "original four passive policy exact",
        all(
            facility["passivePolicy"]
            == "preserve-existing-building-production-and-family-assignment"
            for facility in p20_facilities.values()
        )
        and "passive-gold-production" in phase20["passiveBoundary"]["preserve"]
        and "family-assignment" in phase20["passiveBoundary"]["preserve"],
    )

    command = phase20["commandCenter"]
    command_petitions = {item["id"]: item for item in command["petitionTemplates"]}
    command_choices = set(command["choicePolicy"]["choiceIds"])
    check("Command petition IDs unique", unique(command["petitionTemplates"]))
    check(
        "Command choices valid and policy null",
        all(set(item["choiceIds"]) <= command_choices for item in command_petitions.values())
        and all(item["selectionWeight"] is None for item in command_petitions.values())
        and command["choicePolicy"]["hiddenPermanentBranches"] is False
        and command["choicePolicy"]["mechanicalDivergence"] is None
        and command["choicePolicy"]["prosperityDeltaByChoiceId"] is None
        and command["choicePolicy"]["rewardByChoiceId"] is None
        and command["choicePolicy"]["influenceProgressByChoiceId"] is None,
    )
    check(
        "Command outcomes null",
        all(
            item["rewards"] is None and item["influenceProgress"] is None
            for item in command["outcomeBands"]
        ),
    )

    archives = phase20["archives"]
    archive_branch_ids = set(ids(archives["branches"]))
    check(
        "Archives lead references",
        unique(archives["branches"])
        and unique(archives["researchLeads"])
        and all(
            item["branchId"] in archive_branch_ids
            and item["storyGateContentId"] in known_content_ids
            and item["selectionWeight"] is None
            for item in archives["researchLeads"]
        ),
    )
    check(
        "Archives reconstruction/mastery/economy null",
        archives["reconstructionPolicy"]["minimumEvidenceSelections"] is None
        and archives["reconstructionPolicy"]["maximumEvidenceSelections"] is None
        and archives["reconstructionPolicy"]["invalidSelectionReturnsToResearch"]
        is True
        and archives["reconstructionPolicy"]["relicMutationAllowed"] is False
        and null_values(
            archives["masteryPolicy"], {"enablementStatus"}
        )
        and all(
            item["rewards"] is None and item["discoveryProgress"] is None
            for item in archives["outcomeBands"]
        ),
    )

    training = phase20["trainingGrounds"]
    check(
        "Training drill policy null and roster-safe",
        unique(training["drills"])
        and all(item["selectionWeight"] is None for item in training["drills"])
        and training["participantPolicy"]["eligibleActorRuleId"] is None
        and training["participantPolicy"]["minimumParticipants"] is None
        and training["participantPolicy"]["maximumParticipants"] is None
        and training["participantPolicy"]["duplicateActorAllowed"] is False
        and training["participantPolicy"]["consumesActorAvailability"] is False
        and training["participantPolicy"]["injurySystem"] is False
        and training["participantPolicy"]["campaignOrTowerPowerMutation"] is False
        and training["participantPolicy"]["presentationSquadOnly"] is True,
    )
    check(
        "Training outcome/mastery values null",
        all(
            item["rewards"] is None and item["readinessProgress"] is None
            for item in training["outcomeBands"]
        )
        and null_values(training["masteryPolicy"], {"enablementStatus"}),
    )

    hearth = phase20["hearth"]
    check(
        "Hearth gathering/attendee policy safe",
        unique(hearth["gatherings"])
        and all(item["selectionWeight"] is None for item in hearth["gatherings"])
        and hearth["attendeePolicy"]["eligibleActorRuleId"] is None
        and hearth["attendeePolicy"]["minimumAttendees"] is None
        and hearth["attendeePolicy"]["maximumAttendees"] is None
        and hearth["attendeePolicy"]["romanceChecklist"] is False
        and hearth["attendeePolicy"]["forcedPairing"] is False
        and hearth["attendeePolicy"]["consumesRelationship"] is False,
    )
    check(
        "Hearth relationship/Gift values null",
        all(
            item["rewards"] is None
            and item["relationshipProgress"] is None
            and item["giftChance"] is None
            for item in hearth["outcomeBands"]
        )
        and hearth["relationshipPolicy"]["targetRelationshipRuleId"] is None
        and hearth["relationshipPolicy"]["progressByOutcomeBandId"] is None
        and hearth["relationshipPolicy"]["interludeThresholds"] is None
        and hearth["relationshipPolicy"]["giftChanceByOutcomeBandId"] is None
        and hearth["relationshipPolicy"]["giftRewardPolicyId"] is None,
    )

    gatehouse = phase21["gatehouse"]
    route_ids = set(ids(gatehouse["routeConditions"]))
    need_ids = set(ids(gatehouse["visitorNeeds"]))
    check(
        "Gatehouse caravan references and policy null",
        unique(gatehouse["routeConditions"])
        and unique(gatehouse["visitorNeeds"])
        and unique(gatehouse["caravanTemplates"])
        and all(
            set(item["routeConditionPoolIds"]) <= route_ids
            and set(item["visitorNeedPoolIds"]) <= need_ids
            and item["storyGateContentId"] in known_content_ids
            and item["selectionWeight"] is None
            for item in gatehouse["caravanTemplates"]
        )
        and gatehouse["resolutionPolicy"]["invalidCombinationReturnsToAssessment"]
        is True
        and gatehouse["resolutionPolicy"]["hiddenPermanentBranch"] is False
        and gatehouse["resolutionPolicy"]["routeTrustByOutcomeId"] is None
        and gatehouse["resolutionPolicy"]["rewardByOutcomeId"] is None
        and gatehouse["resolutionPolicy"]["chronicleRecordRules"] is None,
    )
    check(
        "Gatehouse outcomes null",
        all(
            item["rewards"] is None and item["routeTrustProgress"] is None
            for item in gatehouse["outcomeBands"]
        ),
    )

    workshop = phase21["marketWorkshop"]
    workshop_stock_ids = set(ids(workshop["stockDefinitions"]))
    check(
        "Workshop stock/order references null",
        unique(workshop["stockDefinitions"])
        and unique(workshop["orders"])
        and all(
            item["capacity"] is None and item["sourcePolicyId"] is None
            for item in workshop["stockDefinitions"]
        )
        and all(
            set(item["requirementByStockId"]) <= workshop_stock_ids
            and all(value is None for value in item["requirementByStockId"].values())
            and set(item["fulfillmentChoiceIds"])
            <= set(workshop["fulfillmentChoices"])
            and item["storyGateContentId"] in known_content_ids
            and item["selectionWeight"] is None
            for item in workshop["orders"]
        ),
    )
    check(
        "Workshop reservation/outcome/mastery safe",
        workshop["reservationPolicy"]["reserveAtEngagement"] is True
        and workshop["reservationPolicy"]["cancelBeforeCommitRestoresStock"] is True
        and workshop["reservationPolicy"]["closeAfterCommitPreservesEngagement"]
        is True
        and workshop["reservationPolicy"]["callerSuppliedQuantityAllowed"] is False
        and all(
            item["rewards"] is None
            and item["craftsmanshipProgress"] is None
            and item["stockDeltas"] is None
            for item in workshop["outcomeBands"]
        )
        and null_values(workshop["masteryPolicy"], {"enablementStatus"}),
    )

    gardens = phase21["gardens"]
    check(
        "Gardens capacity/crop values null",
        gardens["plotPolicy"]["initialActivePlotCapacity"] is None
        and gardens["plotPolicy"]["maximumActivePlotCapacity"] is None
        and gardens["plotPolicy"]["plotUnlockRules"] is None
        and unique(gardens["crops"])
        and all(
            item["storyGateContentId"] in known_content_ids
            and item["growthDurationMs"] is None
            and item["inputRequirement"] is None
            and item["harvestRewards"] is None
            and item["cultivationProgress"] is None
            and item["selectionWeight"] is None
            for item in gardens["crops"]
        ),
    )
    check(
        "Gardens nonexpiry/manual/offline policy",
        gardens["growthPolicy"]["offlineMayAdvanceToReady"] is True
        and gardens["growthPolicy"]["offlineMayClaim"] is False
        and gardens["growthPolicy"]["harvestExpires"] is False
        and gardens["growthPolicy"]["spoilage"] is False
        and gardens["growthPolicy"]["autoReplant"] is False
        and gardens["growthPolicy"]["clockRollbackRejects"] is True
        and all(
            item["rewards"] is None
            and item["cultivationProgress"] is None
            and item.get("specialResultChance") is None
            for item in gardens["outcomeBands"]
        ),
    )

    forge = phase21["forge"]
    forge_stock_ids = set(ids(forge["stockDefinitions"]))
    check(
        "Forge stock/commission references null",
        unique(forge["stockDefinitions"])
        and unique(forge["commissions"])
        and all(item["capacity"] is None for item in forge["stockDefinitions"])
        and next(
            item
            for item in forge["stockDefinitions"]
            if item["id"] == "forge.stock.relic-stones"
        )["sourceAdapterId"]
        is None
        and next(
            item
            for item in forge["stockDefinitions"]
            if item["id"] == "forge.stock.relic-stones"
        )["persistedLocalBalance"]
        is False
        and next(
            item
            for item in forge["stockDefinitions"]
            if item["id"] == "forge.stock.workshop-components"
        )["sourcePolicyId"]
        is None
        and all(
            set(item["requirementByStockId"]) <= forge_stock_ids
            and all(value is None for value in item["requirementByStockId"].values())
            and set(item["workChoiceIds"]) <= set(forge["workChoices"])
            and item["storyGateContentId"] in known_content_ids
            and item["selectionWeight"] is None
            for item in forge["commissions"]
        ),
    )
    check(
        "Forge outcomes/mastery null and deferred features false",
        all(
            item["rewards"] is None
            and item["commissionMasteryProgress"] is None
            for item in forge["outcomeBands"]
        )
        and forge["masteryPolicy"]["levelThresholds"] is None
        and forge["masteryPolicy"]["commissionTierRules"] is None
        and forge["masteryPolicy"]["qualityMultipliers"] is None
        and forge["masteryPolicy"]["advancedAffixes"] is False
        and forge["masteryPolicy"]["reforging"] is False
        and forge["masteryPolicy"]["advancedRelicSets"] is False,
    )

    check(
        "Phase 20/21 global economy policies null",
        null_values(
            phase20["economyPolicy"], {"id", "version", "enablementStatus"}
        )
        and null_values(
            phase21["economyPolicy"], {"id", "version", "enablementStatus"}
        ),
    )

    metric_ids = set(ids(phase20["metrics"])) | set(ids(phase21["metrics"]))
    facility_all_ids = set(facility14)
    check(
        "ten integration hooks unique and reference-valid",
        len(integration["hooks"]) == 10
        and unique(integration["hooks"])
        and all(
            item["sourceFacilityId"] in facility_all_ids
            and item["targetFacilityId"] in facility_all_ids
            and item["sourceMetricId"] in metric_ids
            for item in integration["hooks"]
        ),
    )
    check(
        "integration policy positive optional and null",
        integration["globalRules"]["positiveOnly"] is True
        and integration["globalRules"]["mandatoryInputs"] is False
        and integration["globalRules"]["sameTransactionCascade"] is False
        and integration["globalRules"]["offlineAutoConsumption"] is False
        and integration["globalRules"]["autoClaim"] is False
        and integration["globalRules"]["callerSuppliedSignal"] is False
        and integration["globalRules"]["crossFacilityFormula"] is None
        and integration["globalRules"]["crossFacilityCap"] is None
        and integration["globalRules"]["activeProfitTargetShare"] is None
        and all(
            item["eligibilityThreshold"] is None
            and item["modifierFormula"] is None
            and item["modifierCap"] is None
            for item in integration["hooks"]
        ),
    )

    tutorial_ids = [item["tutorialId"] for item in tutorials["bindings"]]
    check(
        "exact nineteen tutorials from 79-ID ledger",
        len(tutorial_ids) == 19
        and len(set(tutorial_ids)) == 19
        and len(tutorial13) == 79
        and set(tutorial_ids) <= set(tutorial13),
    )
    check(
        "tutorial speakers and semantic steps valid",
        all(item["canonicalSpeakerActorId"] in actors for item in tutorials["bindings"])
        and all(
            [
                step_id
                for segment in item["stepSegments"]
                for step_id in segment["stepIds"]
            ]
            == tutorial13[item["tutorialId"]]["steps"]
            for item in tutorials["bindings"]
        ),
    )

    facility_cast = {
        item["facilityId"]: item for item in cast_bindings["facilityBindings"]
    }
    all_bound_hooks = [
        hook_id
        for item in cast_bindings["facilityBindings"]
        for hook_id in item["hookIds"]
    ]
    expected_hooks = {
        hook_id
        for hook_id in hook_owner
        if any(
            f".{facility_id.removeprefix('facility.')}." in hook_id
            for facility_id in targets
        )
    }
    check(
        "cast bindings cover exact eight facilities/openings",
        set(facility_cast) == targets
        and all(
            item["openingContentId"]
            == unlock17[item["facilityId"]]["activeInteraction"]["openingContentId"]
            for item in cast_bindings["facilityBindings"]
        ),
    )
    check(
        "exact Phase 15 hook subset",
        len(all_bound_hooks) == 45
        and len(set(all_bound_hooks)) == 45
        and set(all_bound_hooks) == expected_hooks
        and set(all_bound_hooks) <= set(hook_owner),
    )
    bound_actor_ids = {hook_owner[hook_id] for hook_id in all_bound_hooks}
    check(
        "exact 28 cast actors and primary content",
        len(bound_actor_ids) == 28
        and all(
            content_id in primary_content_ids
            for item in cast_bindings["facilityBindings"]
            for content_id in item["primaryContentIds"]
        ),
    )

    gates = release_gate["gates"]
    required_release_categories = {
        "definitions",
        "migration",
        "claims",
        "economy",
        "longevity",
        "concurrency",
        "offline",
        "ux-accessibility",
        "content-art",
        "regression",
    }
    check(
        "release gates unique, required, blocked, and evidence-null",
        unique(gates)
        and all(
            item["required"] is True
            and item["status"] == "blocked"
            and item["evidence"] is None
            for item in gates
        ),
    )
    check(
        "release categories complete and decision blocked",
        required_release_categories <= {item["category"] for item in gates}
        and release_gate["gatePolicy"]["allRequiredMustPass"] is True
        and release_gate["gatePolicy"]["nullOrProvisionalIsFailure"] is True
        and release_gate["gatePolicy"]["waiverEvidence"] is None
        and release_gate["releaseDecision"]["status"] == "BLOCKED",
    )

    fixture_ids = ids(fixtures["fixtures"])
    required_fixture_categories = {
        "fresh",
        "migration",
        "story",
        "corruption",
        "command",
        "archives",
        "training",
        "hearth",
        "gatehouse",
        "workshop",
        "gardens",
        "forge",
        "claim",
        "multi-tab",
        "non-expiry",
        "offline",
        "progression",
        "integration",
        "tutorial",
        "archive",
        "longevity",
        "mobile",
        "reduced-motion",
        "localization",
        "release",
        "reference",
    }
    check("at least sixty fixtures", len(fixture_ids) >= 60, str(len(fixture_ids)))
    check("fixture IDs unique", len(fixture_ids) == len(set(fixture_ids)))
    check(
        "fixture category coverage",
        required_fixture_categories
        <= {item["category"] for item in fixtures["fixtures"]},
    )
    qa_policy = fixtures["syntheticPolicy"]
    check(
        "synthetic policy unmistakably QA-only",
        qa_policy["scope"] == "QA_ONLY_NEVER_PRODUCTION_OR_MIGRATION_FALLBACK"
        and qa_policy["requiresIsolatedStorage"] is True
        and all(
            isinstance(value, int) and not isinstance(value, bool) and value > 0
            for key, value in qa_policy.items()
            if key not in {"scope", "registryId", "requiresIsolatedStorage"}
        ),
    )

    for label, passed, detail in results:
        print(("PASS " if passed else "FAIL ") + label + (f" — {detail}" if detail else ""))
    passed_count = sum(passed for _, passed, _ in results)
    print(
        f"SUMMARY {passed_count}/{len(results)} checks; "
        f"{len(all_defined_facilities)} facilities; "
        f"{len(p20_opportunities | p21_opportunities)} opportunity definitions; "
        f"{len(integration['hooks'])} integrations; "
        f"{len(tutorial_ids)} tutorials; {len(all_bound_hooks)} hooks/"
        f"{len(bound_actor_ids)} actors; {len(gates)} release gates; "
        f"{len(fixture_ids)} fixtures"
    )
    return 0 if passed_count == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())

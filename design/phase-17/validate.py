#!/usr/bin/env python3
"""Validate the Phase 17 design package against predecessor contracts."""

from __future__ import annotations

import json
from pathlib import Path
import sys


HERE = Path(__file__).resolve().parent
DESIGN = HERE.parent


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    story = load(HERE / "book1-story.json")
    unlocks = load(HERE / "facility-unlocks.json")
    visuals = load(HERE / "village-visual-changes.json")
    distribution = load(HERE / "book1-cast-distribution.json")
    bindings = load(HERE / "tutorial-bindings.json")
    fixtures = load(HERE / "fixtures.json")
    cast = load(DESIGN / "phase-13" / "cast-plan.json")
    tutorial_ledger = load(DESIGN / "phase-13" / "tutorial-matrix.json")
    facilities = load(DESIGN / "phase-14" / "facility-definitions.json")
    cast_hooks = load(DESIGN / "phase-15-16" / "cast-hooks.json")

    results: list[tuple[str, bool, str]] = []

    def check(label: str, condition: bool, detail: str = "") -> None:
        results.append((label, bool(condition), detail))

    expected_stages = [
        ("broken-roads-1", "Village Toll"),
        ("broken-roads-2", "Merchant Dispute"),
        ("broken-roads-3", "Broken Contract"),
        ("broken-roads-4", "Old Road Ambush"),
        ("broken-roads-5", "Council of Ash"),
        ("broken-roads-6", "River Accord"),
        ("broken-roads-7", "Quarry Claim"),
        ("broken-roads-8", "Skybridge Terms"),
        ("broken-roads-9", "Harbor Compact"),
        ("broken-roads-10", "The First Covenant"),
    ]
    expected_stage_ids = {stage_id for stage_id, _ in expected_stages}

    chapter_ids = {item["id"] for item in story["chapters"]}
    scene_ids = [item["id"] for item in story["scenes"]]
    scene_id_set = set(scene_ids)
    scene_by_id = {item["id"]: item for item in story["scenes"]}
    reward_ids = {item["id"] for item in story["storyRewardDefinitions"]}
    actor_ids = {
        *("fellow." + item["id"] for item in cast["fellows"]),
        *("family." + item["id"] for item in cast["family"]),
    }
    facility_ids = {item["id"] for item in facilities["facilities"]}
    tutorial_ids = {item["id"] for item in tutorial_ledger["tutorials"]}
    hook_by_actor = {
        item["actorId"]: set(item["hookIds"]) for item in cast_hooks["actors"]
    }
    all_hook_ids = {hook for hooks in hook_by_actor.values() for hook in hooks}
    primary_content = {
        **{
            "fellow." + item["id"]: item["authoredDialogue"]["contentId"]
            for item in cast["fellows"]
        },
        **{
            "family." + item["id"]: item["authoredDialogue"]["contentId"]
            for item in cast["family"]
        },
    }
    external_content_ids = set(primary_content.values())

    check("six Book sections", len(story["chapters"]) == 6)
    check(
        "exact ten Campaign stages",
        [(item["stageId"], item["stageName"]) for item in story["stageMappings"]]
        == expected_stages,
    )
    check("unique scene IDs", len(scene_ids) == len(scene_id_set))
    check(
        "stage scene and chapter references",
        all(
            item["introSceneId"] in scene_id_set
            and item["resolutionSceneId"] in scene_id_set
            and item["chapterId"] in chapter_ids
            for item in story["stageMappings"]
        ),
    )
    check(
        "scene chapter references",
        all(item["chapterId"] in chapter_ids for item in story["scenes"]),
    )
    check(
        "scene-to-scene trigger references",
        all(
            item["trigger"]["sceneId"] in scene_id_set
            for item in story["scenes"]
            if "sceneId" in item["trigger"]
        ),
    )
    check(
        "scene-to-stage trigger references",
        all(
            item["trigger"]["stageId"] in expected_stage_ids
            for item in story["scenes"]
            if "stageId" in item["trigger"]
        ),
    )
    check(
        "scene speaker references",
        all(
            actor_id in actor_ids
            for item in story["scenes"]
            for actor_id in item["speakerActorIds"]
        ),
    )
    check(
        "scene reward references",
        all(
            item["rewardDefinitionId"] is None
            or item["rewardDefinitionId"] in reward_ids
            for item in story["scenes"]
        ),
    )
    check(
        "story rewards null and blocked",
        all(
            item["rewards"] is None
            and item["enablementStatus"] == "blocked-economy"
            for item in story["storyRewardDefinitions"]
        ),
    )
    check(
        "all executable definition sets disabled",
        all(
            document.get("productionEnabled") is False
            for document in (story, unlocks, visuals, distribution, bindings, fixtures)
        ),
    )

    arrival_actor_ids = [
        actor_id
        for arrival in story["arrivalOrder"]
        for actor_id in arrival["actorIds"]
    ]
    expected_arrival_ids = {
        "fellow." + item["id"]
        for item in cast["fellows"]
        if item["joinRank"] >= 2
    }
    check(
        "exact twelve Rank-arrival actors",
        len(arrival_actor_ids) == 12
        and len(set(arrival_actor_ids)) == 12
        and set(arrival_actor_ids) == expected_arrival_ids,
    )

    mapped_facility_ids = [
        item["facilityId"] for item in unlocks["facilityUnlocks"]
    ]
    check(
        "exact twelve facility mappings",
        len(mapped_facility_ids) == 12
        and len(set(mapped_facility_ids)) == 12
        and set(mapped_facility_ids) == facility_ids,
    )
    original_four = {
        "facility.command-center",
        "facility.archives",
        "facility.training-grounds",
        "facility.hearth",
    }
    check(
        "original passive Buildings preserved",
        all(
            item["passivePolicy"]
            == "preserve-existing-building-production-and-family-assignment"
            for item in unlocks["facilityUnlocks"]
            if item["facilityId"] in original_four
        ),
    )
    check(
        "facility discovery story references",
        all(
            item["discovery"]["contentId"] in scene_id_set
            for item in unlocks["facilityUnlocks"]
        ),
    )
    check(
        "facility discovery does not depend on optional interludes",
        all(
            scene_by_id[item["discovery"]["contentId"]]["kind"]
            != "optional-interlude"
            for item in unlocks["facilityUnlocks"]
        ),
    )
    check(
        "facility opening content references",
        all(
            item["activeInteraction"]["openingContentId"]
            in scene_id_set | external_content_ids
            for item in unlocks["facilityUnlocks"]
        ),
    )
    check(
        "economic unlock thresholds null",
        unlocks["globalRules"]["prosperityThreshold"] is None
        and unlocks["globalRules"]["headquartersThreshold"] is None,
    )

    visual_ids = [item["id"] for item in visuals["changes"]]
    check(
        "eight unique visual changes",
        len(visual_ids) == 8 and len(set(visual_ids)) == 8,
    )
    check(
        "visual sources reference story",
        all(
            item["source"]["contentId"] in scene_id_set
            for item in visuals["changes"]
        ),
    )
    check(
        "visual art and CSS remain null",
        all(
            item["artTreatmentId"] is None and item["cssTreatmentId"] is None
            for item in visuals["changes"]
        ),
    )

    distributed_actor_ids = [item["actorId"] for item in distribution["actors"]]
    check(
        "exact 38-person cast coverage",
        len(distributed_actor_ids) == 38
        and len(set(distributed_actor_ids)) == 38
        and set(distributed_actor_ids) == actor_ids,
    )
    check(
        "Phase 13 primary assignments preserved",
        all(
            item["primaryContentId"] == primary_content[item["actorId"]]
            for item in distribution["actors"]
        ),
    )
    check(
        "Phase 15–16 cast hooks valid",
        all(
            set(item["facilityHookIds"]) <= hook_by_actor[item["actorId"]]
            for item in distribution["actors"]
        ),
    )
    check(
        "Book I appearance references valid",
        all(
            content_id in scene_id_set | external_content_ids | all_hook_ids
            for item in distribution["actors"]
            for content_id in item["book1AppearanceIds"]
        ),
    )

    binding_ids = [item["tutorialId"] for item in bindings["bindings"]]
    check(
        "exact twelve unique tutorial bindings",
        len(binding_ids) == 12 and len(set(binding_ids)) == 12,
    )
    check(
        "tutorial bindings use exact 79-ID ledger",
        len(tutorial_ids) == 79 and set(binding_ids) <= tutorial_ids,
    )
    check(
        "tutorial speaker references",
        all(
            item["canonicalSpeakerActorId"] in actor_ids
            for item in bindings["bindings"]
        ),
    )

    fixture_ids = [item["id"] for item in fixtures["fixtures"]]
    required_categories = {
        "fresh",
        "migration",
        "rank-jump",
        "replay",
        "offline",
        "multi-tab",
        "mobile",
        "reduced-motion",
    }
    check("at least thirty fixtures", len(fixture_ids) >= 30, str(len(fixture_ids)))
    check("unique fixture IDs", len(fixture_ids) == len(set(fixture_ids)))
    check(
        "required fixture categories",
        required_categories <= {item["category"] for item in fixtures["fixtures"]},
    )

    for label, passed, detail in results:
        print(("PASS " if passed else "FAIL ") + label + (f" — {detail}" if detail else ""))
    passed_count = sum(passed for _, passed, _ in results)
    print(
        f"SUMMARY {passed_count}/{len(results)} checks; "
        f"{len(story['scenes'])} scenes; {len(story['chapters'])} sections; "
        f"{len(mapped_facility_ids)} facilities; {len(distributed_actor_ids)} actors; "
        f"{len(binding_ids)} tutorial bindings; {len(fixture_ids)} fixtures"
    )
    return 0 if passed_count == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())

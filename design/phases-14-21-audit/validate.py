#!/usr/bin/env python3
"""Deterministic cross-phase design audit for Everstead Phases 13–21."""

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / "design" / "phases-14-21-audit"


def load(relative):
    with (ROOT / relative).open(encoding="utf-8") as handle:
        return json.load(handle)


def read(relative):
    return (ROOT / relative).read_text(encoding="utf-8")


def run_git(*args):
    return subprocess.run(
        ["git", *args], cwd=ROOT, text=True, capture_output=True, check=False
    )


checks = []


def check(label, condition, detail=None):
    ok = bool(condition)
    checks.append((label, ok, detail))
    if ok:
        print("PASS", label)
    else:
        print("FAIL", label)
        if detail:
            print("  ", detail)


def actor_id(roster, short_id):
    return f"{roster}.{short_id}"


def normalize_speaker(value):
    return value.replace(":", ".", 1)


def ids(items):
    return [item["id"] for item in items]


def unique(values):
    values = list(values)
    return len(values) == len(set(values))


def leaves(value):
    if isinstance(value, dict):
        for child in value.values():
            yield from leaves(child)
    elif isinstance(value, list):
        for child in value:
            yield from leaves(child)
    else:
        yield value


fixtures = load("design/phases-14-21-audit/audit-fixtures.json")
blockers = load("design/phases-14-21-audit/blocker-matrix.json")
results = load("design/phases-14-21-audit/audit-results.json")

cast13 = load("design/phase-13/cast-plan.json")
tutorial13 = load("design/phase-13/tutorial-matrix.json")
facility14 = load("design/phase-14/facility-definitions.json")
legacy15 = load("design/phase-15-16/legacy-definitions.json")
restaurant16 = load("design/phase-15-16/restaurant-definitions.json")
tutorial1516 = load("design/phase-15-16/tutorial-extension.json")
hooks15 = load("design/phase-15-16/cast-hooks.json")
story17 = load("design/phase-17/book1-story.json")
unlocks17 = load("design/phase-17/facility-unlocks.json")
visual17 = load("design/phase-17/village-visual-changes.json")
cast17 = load("design/phase-17/book1-cast-distribution.json")
tutorial17 = load("design/phase-17/tutorial-bindings.json")
apothecary18 = load("design/phase-18-19/apothecary-definitions.json")
schoolhouse19 = load("design/phase-18-19/schoolhouse-definitions.json")
cast1819 = load("design/phase-18-19/cast-bindings.json")
tutorial1819 = load("design/phase-18-19/tutorial-bindings.json")
phase20 = load("design/phase-20-21/phase20-definitions.json")
phase21 = load("design/phase-20-21/phase21-definitions.json")
integration21 = load("design/phase-20-21/cross-facility-integration.json")
cast2021 = load("design/phase-20-21/cast-bindings.json")
tutorial2021 = load("design/phase-20-21/tutorial-bindings.json")
release21 = load("design/phase-20-21/release-gate.json")


# 1. Source identity and package-local gates.
source_commit = fixtures["sourceCommit"]
source_is_ancestor = run_git("merge-base", "--is-ancestor", source_commit, "HEAD")
check("exact source commit is an ancestor", source_is_ancestor.returncode == 0)

tree_failures = []
for relative, expected_tree in fixtures["sourceTrees"].items():
    actual = run_git("rev-parse", f"HEAD:{relative}")
    if actual.returncode != 0 or actual.stdout.strip() != expected_tree:
        tree_failures.append((relative, actual.stdout.strip(), expected_tree))
check("all six audited source trees are frozen", not tree_failures, tree_failures)

worktree_source_diff = run_git(
    "diff",
    "--quiet",
    source_commit,
    "--",
    "design/phase-13",
    "design/phase-14",
    "design/phase-15-16",
    "design/phase-17",
    "design/phase-18-19",
    "design/phase-20-21",
)
check("no audited source package has a worktree diff", worktree_source_diff.returncode == 0)

source_gate_outputs = {}
source_gate_ok = True
for relative in (
    "design/phase-17/validate.py",
    "design/phase-18-19/validate.py",
    "design/phase-20-21/validate.py",
):
    completed = subprocess.run(
        [sys.executable, str(ROOT / relative)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    source_gate_outputs[relative] = completed.stdout.strip().splitlines()[-1:]
    source_gate_ok = source_gate_ok and completed.returncode == 0
check("Phase 17, 18–19, and 20–21 source validators pass", source_gate_ok, source_gate_outputs)


# 2. Facility registry, anchors, story unlocks, and passive boundary.
expected_facilities = {item["facilityId"]: item for item in fixtures["facilityRegistry"]}
facilities14 = {item["id"]: item for item in facility14["facilities"]}
opportunities14 = {item["facilityId"]: item for item in facility14["opportunityDefinitions"]}
unlocks = {item["facilityId"]: item for item in unlocks17["facilityUnlocks"]}

check(
    "exact twelve-facility registry",
    len(expected_facilities) == len(facilities14) == len(opportunities14) == len(unlocks) == 12
    and set(expected_facilities) == set(facilities14) == set(opportunities14) == set(unlocks),
)

identity_errors = []
for facility_id, expected in expected_facilities.items():
    base = facilities14[facility_id]
    opportunity = opportunities14[facility_id]
    actual = (
        base["activityId"],
        base["opportunityDefinitionIds"],
        opportunity["id"],
        opportunity["activityId"],
    )
    wanted = (
        expected["activityId"],
        [expected["opportunityDefinitionId"]],
        expected["opportunityDefinitionId"],
        expected["activityId"],
    )
    if actual != wanted:
        identity_errors.append((facility_id, actual, wanted))
check("facility/activity/opportunity tuples are stable", not identity_errors, identity_errors)

canonical_anchors = {item["canonicalMapAnchor"] for item in fixtures["facilityRegistry"]}
check("Phase 17 defines twelve unique canonical physical anchors", len(canonical_anchors) == 12)

unlock_errors = []
anchor_aliases = []
scene_ids = set(ids(story17["scenes"]))
for facility_id, expected in expected_facilities.items():
    unlock = unlocks[facility_id]
    actual = (
        unlock["mapAnchor"],
        unlock["targetPhase"],
        unlock["passivePolicy"],
        unlock["discovery"]["contentId"],
        unlock["activeInteraction"]["openingContentId"],
    )
    wanted = (
        expected["canonicalMapAnchor"],
        expected["targetPhase"],
        expected["passivePolicy"],
        expected["discoveryContentId"],
        expected["openingContentId"],
    )
    if actual != wanted:
        unlock_errors.append((facility_id, actual, wanted))
    predecessor = facilities14[facility_id]["mapAnchor"]
    if predecessor != expected["canonicalMapAnchor"]:
        anchor_aliases.append(
            {
                "facilityId": facility_id,
                "predecessor": predecessor,
                "canonical": expected["canonicalMapAnchor"],
            }
        )
check("Phase 17 canonical unlock mappings are exact", not unlock_errors, unlock_errors)

expected_alias_ids = {
    "facility.restaurant",
    "facility.apothecary",
    "facility.schoolhouse",
    "facility.market-workshop",
    "facility.gatehouse",
    "facility.forge",
}
check(
    "six broad predecessor anchor aliases are exhaustively recorded",
    {item["facilityId"] for item in anchor_aliases} == expected_alias_ids
    and all(
        item["predecessor"] == expected_facilities[item["facilityId"]]["predecessorMapAnchor"]
        for item in anchor_aliases
    ),
    anchor_aliases,
)

phase_specific_facilities = [
    legacy15["waystone"],
    restaurant16["facility"],
    apothecary18["facility"],
    schoolhouse19["facility"],
    *phase20["facilities"],
    *phase21["facilities"],
]
specific_errors = []
for item in phase_specific_facilities:
    facility_id = item.get("id", item.get("facilityId"))
    expected = expected_facilities[facility_id]
    if item["activityId"] != expected["activityId"]:
        specific_errors.append((facility_id, "activityId", item["activityId"]))
    if "opportunityDefinitionId" in item and item["opportunityDefinitionId"] != expected["opportunityDefinitionId"]:
        specific_errors.append((facility_id, "opportunityDefinitionId", item["opportunityDefinitionId"]))
    if item["mapAnchor"] not in {expected["canonicalMapAnchor"], expected["predecessorMapAnchor"]}:
        specific_errors.append((facility_id, "mapAnchor", item["mapAnchor"]))
check("phase-specific facility identities resolve through canonical or declared predecessor anchors", not specific_errors, specific_errors)

check(
    "story is discovery authority and capability/opening is separate",
    unlocks17["globalRules"]["storyIsDiscoveryAuthority"] is True
    and unlocks17["globalRules"]["activeInteractionNeedsCapabilityAndOpening"] is True
    and unlocks17["globalRules"]["prosperityThreshold"] is None
    and unlocks17["globalRules"]["headquartersThreshold"] is None,
)
check(
    "all discovery content resolves to required ordered story",
    all(
        item["discovery"]["contentId"] in scene_ids
        and not item["discovery"]["contentId"].startswith("story.book1.interlude.")
        for item in unlocks17["facilityUnlocks"]
    ),
)

original_four = set(fixtures["originalFourFacilityIds"])
phase20_by_id = {item["id"]: item for item in phase20["facilities"]}
preserved_passive = {
    "building-visibility",
    "building-levels",
    "building-upgrades",
    "passive-gold-production",
    "oath-multipliers",
    "offline-gold",
    "family-assignment",
}
check(
    "original four passive behavior remains authoritative",
    set(phase20_by_id) == original_four
    and all(
        facilities14[item]["passivePolicy"] == "preserve-existing-building-production"
        and unlocks[item]["passivePolicy"]
        == phase20_by_id[item]["passivePolicy"]
        == "preserve-existing-building-production-and-family-assignment"
        for item in original_four
    )
    and "additive" in phase20["passiveBoundary"]["policy"]
    and set(phase20["passiveBoundary"]["preserve"]) == preserved_passive,
)


# 3. Stable local IDs and cross-package hook/reference sets.
json_sources = [
    facility14,
    legacy15,
    restaurant16,
    story17,
    unlocks17,
    visual17,
    apothecary18,
    schoolhouse19,
    phase20,
    phase21,
    integration21,
    release21,
]


def local_registry_errors(value, path="$", errors=None):
    if errors is None:
        errors = []
    if isinstance(value, list):
        id_items = [item for item in value if isinstance(item, dict) and "id" in item]
        if id_items and len(id_items) == len(value):
            values = [item["id"] for item in id_items]
            if not unique(values):
                errors.append((path, values))
        for index, item in enumerate(value):
            local_registry_errors(item, f"{path}[{index}]", errors)
    elif isinstance(value, dict):
        for key, item in value.items():
            local_registry_errors(item, f"{path}.{key}", errors)
    return errors


registry_errors = []
for source in json_sources:
    registry_errors.extend(local_registry_errors(source))
check("all machine-readable local registries have unique IDs", not registry_errors, registry_errors)

master_hook_actor_ids = [item["actorId"] for item in hooks15["actors"]]
master_hook_ids = [hook for item in hooks15["actors"] for hook in item["hookIds"]]
book_hook_ids = [hook for item in cast17["actors"] for hook in item["facilityHookIds"]]
phase1819_hook_ids = [
    binding["hookId"]
    for item in cast1819["actors"]
    for binding in item["phaseBindings"]
]
phase2021_hook_ids = [hook for item in cast2021["facilityBindings"] for hook in item["hookIds"]]
check(
    "master 38-actor/76-hook registry is exact and unique",
    len(master_hook_actor_ids) == 38
    and unique(master_hook_actor_ids)
    and len(master_hook_ids) == fixtures["guardrails"]["masterCastHookCount"]
    and unique(master_hook_ids),
)
check(
    "Phase 17 preserves the exact master hook registry",
    set(book_hook_ids) == set(master_hook_ids) and len(book_hook_ids) == len(master_hook_ids),
)
check(
    "Phase 18–21 cast hooks are exact master subsets",
    set(phase1819_hook_ids).issubset(master_hook_ids)
    and set(phase2021_hook_ids).issubset(master_hook_ids),
)


# 4. Tutorial ledger, binding lineage, semantic steps, and facility concepts.
tutorials = tutorial13["tutorials"]
tutorial_by_id = {item["id"]: item for item in tutorials}
cast_ids = {
    actor_id(item["roster"], item["id"])
    for item in [*cast13["fellows"], *cast13["family"]]
}
check(
    "exact unique 79-ID tutorial ledger",
    tutorial13["contractId"] == fixtures["guardrails"]["tutorialLedgerId"]
    and len(tutorials) == fixtures["guardrails"]["tutorialLedgerCount"]
    and unique(tutorial_by_id),
)

tutorial_shape_errors = []
for item in tutorials:
    speaker_ids = [item["speaker"]["primary"], *item["speaker"].get("fallbacks", [])]
    if not item["steps"] or not unique(item["steps"]):
        tutorial_shape_errors.append((item["id"], "steps"))
    if not all(normalize_speaker(value) in cast_ids for value in speaker_ids):
        tutorial_shape_errors.append((item["id"], "speaker"))
    if item["deliveryPhase"] < item["introducedPhase"]:
        tutorial_shape_errors.append((item["id"], "phase-order"))
    if not item.get("trigger", {}).get("kind"):
        tutorial_shape_errors.append((item["id"], "trigger"))
check("all 79 tutorials resolve speakers, triggers, phases, and unique steps", not tutorial_shape_errors, tutorial_shape_errors)

referenced_tutorial_ids = set()
for item in facility14["facilities"]:
    referenced_tutorial_ids.update(item["tutorialIds"])
referenced_tutorial_ids.update(legacy15["waystone"]["tutorialIds"])
referenced_tutorial_ids.update(restaurant16["facility"]["tutorialIds"])
referenced_tutorial_ids.update(apothecary18["facility"]["tutorialIds"])
referenced_tutorial_ids.update(schoolhouse19["facility"]["tutorialIds"])
for item in [*phase20["facilities"], *phase21["facilities"]]:
    referenced_tutorial_ids.update(item["tutorialIds"])
referenced_tutorial_ids.update(item["id"] for item in tutorial1516["tutorials"])
referenced_tutorial_ids.update(item["tutorialId"] for item in tutorial17["bindings"])
referenced_tutorial_ids.update(item["tutorialId"] for item in tutorial1819["bindings"])
referenced_tutorial_ids.update(item["tutorialId"] for item in tutorial2021["bindings"])
check(
    "every cross-package tutorial reference resolves to the 79-ID ledger",
    referenced_tutorial_ids.issubset(tutorial_by_id),
    sorted(referenced_tutorial_ids - set(tutorial_by_id)),
)

step_binding_errors = []
for item in tutorial1516["tutorials"]:
    expected_steps = set(tutorial_by_id[item["id"]]["steps"])
    actual_steps = {
        step_id[len(item["id"]) + 1 :]
        for step_id in item["stepIds"]
        if step_id.startswith(item["id"] + ".")
    }
    if actual_steps != expected_steps or len(actual_steps) != len(item["stepIds"]):
        step_binding_errors.append(item["id"])
for binding_set in (tutorial1819["bindings"], tutorial2021["bindings"]):
    for item in binding_set:
        actual_steps = [
            step
            for segment in item["stepSegments"]
            for step in segment["stepIds"]
        ]
        if actual_steps != tutorial_by_id[item["tutorialId"]]["steps"]:
            step_binding_errors.append(item["tutorialId"])
check("successor tutorial bindings preserve exact semantic steps", not step_binding_errors, step_binding_errors)

registry_lineage = [
    tutorial1516["phase15RegistryId"],
    tutorial1516["phase16RegistryId"],
    tutorial17["stateRegistry"]["registryId"],
    tutorial1819["registryId"],
    tutorial2021["registryId"],
]
check(
    "tutorial successor registry lineage is exact",
    registry_lineage == fixtures["seams"]["tutorialRegistryLineage"]
    and tutorial1819["predecessorRegistryId"] == registry_lineage[2]
    and tutorial2021["predecessorRegistryId"] == registry_lineage[3],
)

concept_errors = []
concept_facilities = set()
for item in fixtures["facilityConceptCoverage"]:
    concept_facilities.add(item["facilityId"])
    tutorial = tutorial_by_id.get(item["tutorialId"])
    if tutorial is None or not set(item["requiredSteps"]).issubset(tutorial["steps"]):
        concept_errors.append(item)
check(
    "all twelve facilities have explicit player-facing concept coverage",
    concept_facilities == set(expected_facilities) and not concept_errors,
    concept_errors,
)
check(
    "facility tutorials are gradual, contextual, non-blocking, skippable, and replayable",
    tutorial13["defaults"]["blocking"] is False
    and tutorial13["defaults"]["skippable"] is True
    and tutorial13["defaults"]["replayable"] is True
    and tutorial13["defaults"]["loggable"] is True
    and all(
        len(
            {
                tutorial_by_id[item["tutorialId"]]["trigger"]["kind"]
                for item in fixtures["facilityConceptCoverage"]
                if item["facilityId"] == facility_id
            }
        )
        >= 2
        for facility_id in expected_facilities
    ),
)


# 5. Cast coverage and locked-Fellow safety.
fellows = cast13["fellows"]
family = cast13["family"]
all_cast = [*fellows, *family]
profile_quote_ids = [item["profileQuoteId"] for item in all_cast]
ambient_ids = [item["ambient"]["id"] for item in all_cast]
authored_content_ids = [item["authoredDialogue"]["contentId"] for item in all_cast]
check(
    "exact 18 Fellows and 20 Family actors",
    len(fellows) == fixtures["guardrails"]["fellowCount"]
    and len(family) == fixtures["guardrails"]["familyCount"]
    and len(cast_ids) == fixtures["guardrails"]["castCount"],
)
check(
    "all 38 retain unique profile quotes and ambient assignments",
    len(profile_quote_ids) == len(ambient_ids) == 38
    and unique(profile_quote_ids)
    and unique(ambient_ids)
    and all(item["ambient"]["location"] and item["ambient"]["deliveryPhase"] for item in all_cast),
)

cast17_by_id = {item["actorId"]: item for item in cast17["actors"]}
authored_schedule_errors = []
for item in all_cast:
    canonical = actor_id(item["roster"], item["id"])
    later = cast17_by_id.get(canonical)
    if (
        later is None
        or later["primaryContentId"] != item["authoredDialogue"]["contentId"]
        or later["deliveryPhase"] != item["authoredDialogue"]["deliveryPhase"]
        or not later["book1AppearanceIds"]
        or not later["facilityHookIds"]
    ):
        authored_schedule_errors.append(canonical)
check("all 38 retain authored story/facility schedules and Phase 13 primaries", not authored_schedule_errors, authored_schedule_errors)

join_rank = {actor_id(item["roster"], item["id"]): item["joinRank"] for item in fellows}
chapter_rank = {item["id"]: item["rankGate"] for item in story17["chapters"]}
premature_story_speakers = []
for scene in story17["scenes"]:
    scene_rank = chapter_rank[scene["chapterId"]]
    for speaker in scene["speakerActorIds"]:
        if speaker.startswith("fellow.") and join_rank[speaker] > scene_rank:
            premature_story_speakers.append((scene["id"], speaker, scene_rank, join_rank[speaker]))
check("Book I scenes never schedule a locked Fellow before Rank", not premature_story_speakers, premature_story_speakers)

arrival_expected = {
    rank: sorted(actor for actor, required in join_rank.items() if required == rank)
    for rank in (2, 3, 4, 5)
}
arrival_actual = {item["rank"]: sorted(item["actorIds"]) for item in story17["arrivalOrder"]}
check("Rank 2–5 arrival groups exactly match Fellow join ranks", arrival_actual == arrival_expected)

locked_fallback_errors = []
arrival_rank_by_scene = {item["sceneId"]: item["rank"] for item in story17["arrivalOrder"]}
facility_rank_by_short_id = {
    facility_id.split(".")[-1]: chapter_rank[
        next(scene for scene in story17["scenes"] if scene["id"] == unlock["discovery"]["contentId"])["chapterId"]
    ]
    for facility_id, unlock in unlocks.items()
}
facility_rank_by_short_id["command"] = facility_rank_by_short_id["command-center"]
facility_rank_by_short_id["training"] = facility_rank_by_short_id["training-grounds"]
facility_rank_by_short_id["workshop"] = facility_rank_by_short_id["market-workshop"]
for tutorial in tutorials:
    primary = normalize_speaker(tutorial["speaker"]["primary"])
    if primary.startswith("fellow.") and join_rank[primary] > 1:
        trigger = tutorial["trigger"]
        safe_by_trigger = False
        if trigger.get("contentId") in arrival_rank_by_scene:
            safe_by_trigger = arrival_rank_by_scene[trigger["contentId"]] >= join_rank[primary]
        if trigger.get("kind") == "rankCrossed":
            safe_by_trigger = safe_by_trigger or trigger.get("rank", 0) >= join_rank[primary]
        required_ranks = [
            int(value.split(":", 1)[1])
            for value in trigger.get("requires", [])
            if value.startswith("player.rank:")
        ]
        if required_ranks:
            safe_by_trigger = safe_by_trigger or max(required_ranks) >= join_rank[primary]
        if trigger.get("facilityId") in facility_rank_by_short_id:
            safe_by_trigger = safe_by_trigger or facility_rank_by_short_id[trigger["facilityId"]] >= join_rank[primary]
        fallbacks = [normalize_speaker(value) for value in tutorial["speaker"].get("fallbacks", [])]
        safe_fallback = any(
            fallback.startswith("family.")
            or (fallback.startswith("fellow.") and join_rank[fallback] == 1)
            for fallback in fallbacks
        )
        if not safe_by_trigger and not safe_fallback:
            locked_fallback_errors.append(tutorial["id"])
check(
    "every locked primary tutorial speaker has an eligible deterministic fallback",
    hooks15["selectionPolicy"]["lockedFellowsExcluded"] is True
    and hooks15["selectionPolicy"]["deterministicFallbackOrder"] is True
    and not locked_fallback_errors,
    locked_fallback_errors,
)


# 6. Claim/finalizer/version/archive seams and offline boundaries.
all_opportunities = [
    *facility14["opportunityDefinitions"],
    restaurant16["opportunityDefinition"],
    apothecary18["opportunityDefinition"],
    schoolhouse19["opportunityDefinition"],
    *phase20["opportunityDefinitions"],
    *phase21["opportunityDefinitions"],
]
check(
    "all facility opportunity definitions are manual and non-expiring",
    all(item["claimMode"] == "manual" and item["expires"] is False for item in all_opportunities),
)
check(
    "Waystone Phase 14 timed opportunity remains reserved and disabled",
    legacy15["waystone"]["timedOpportunityGeneration"] is False
    and legacy15["waystone"]["disabledPhase14OpportunityDefinitionId"]
    == expected_facilities["facility.waystone"]["opportunityDefinitionId"],
)

claim_docs = "\n".join(
    [
        read("design/phase-15-16/SEAM_RESOLUTION.md"),
        read("design/phase-18-19/DATA_SPEC.md"),
        read("design/phase-20-21/DATA_SPEC.md"),
    ]
)
missing_dispatches = []
for item in fixtures["finalizerDispatches"]:
    if item["finalizer"] not in claim_docs:
        missing_dispatches.append((item["finalizer"], "finalizer"))
    if not item["sourceId"].startswith("registered-") and item["sourceId"] not in claim_docs:
        missing_dispatches.append((item["sourceId"], "source"))
    if item["domainKind"] in {
        "apothecary-case",
        "schoolhouse-lesson",
        "schoolhouse-graduation",
    } and item["domainKind"] not in claim_docs:
        missing_dispatches.append((item["domainKind"], "domain"))
check(
    "fourteen exact source/domain/finalizer seams are reserved",
    len(fixtures["finalizerDispatches"]) == 14 and not missing_dispatches,
    missing_dispatches,
)

check(
    "claim archive identity, retention, and fold batch are exact",
    fixtures["seams"]["claimArchiveConfigId"] in claim_docs
    and re.search(r"most recent\s+512\s+full receipts", claim_docs)
    and re.search(r"oldest\s+128\s+receipts", claim_docs)
    and re.search(r"Recent receipt retention remains 512 and folds remain 128", claim_docs),
)

migration_docs = read("design/phase-18-19/DATA_SPEC.md") + "\n" + read("design/phase-20-21/DATA_SPEC.md")
check(
    "exact Phase 18–21 migration seam IDs remain ordered and explicit",
    all(value in migration_docs for value in fixtures["seams"]["migrationLineage"]),
)

graduation_docs = read("design/phase-18-19/DATA_SPEC.md") + "\n" + read("design/phase-18-19/README.md")
check(
    "Schoolhouse graduation V2 blocker remains explicit",
    "This requires an explicit V2 factory seam" in graduation_docs
    and "runtime is blocked" in graduation_docs
    and "schoolhouse-graduation" in graduation_docs,
)

offline_docs = (
    read("design/phase-14/PHASE_14_FACILITY_CONTRACT.md")
    + "\n"
    + read("design/phase-18-19/PHASE_18_19_CONTRACT.md")
    + "\n"
    + read("design/phase-20-21/PHASE_20_21_CONTRACT.md")
    + "\n"
    + read("design/phase-20-21/DATA_SPEC.md")
)
check(
    "offline boundary preserves banking but forbids choices and claims",
    "24-hour" in offline_docs
    and "never claims" in offline_docs
    and "never claim" in offline_docs
    and "Offline may bank" in offline_docs
    and "Garden" in offline_docs
    and "harvest" in offline_docs,
)


# 7. Production disablement, null policy, presentation, and pressure-system guardrails.
production_sources = [
    facility14,
    legacy15,
    restaurant16,
    story17,
    unlocks17,
    visual17,
    apothecary18,
    schoolhouse19,
    cast1819,
    tutorial1819,
    phase20,
    phase21,
    integration21,
    cast2021,
    tutorial2021,
]
check(
    "all executable design packages remain production-disabled",
    all(source.get("productionEnabled") is False for source in production_sources),
)

null_policy_errors = []
for item in facility14["facilities"]:
    if any(
        item["operational"].get(field) is not None
        for field in ("intervalMs", "bankCapacity", "unattendedTargetMs", "activeProfitTargetShare")
        if field in item["operational"]
    ):
        null_policy_errors.append((item["id"], "phase14-operational"))
for item in legacy15["tiers"]:
    if item["threshold"] is not None or item["rewards"] is not None:
        null_policy_errors.append((item["id"], "legacy-tier"))
for item in legacy15["feats"]:
    if item["rewards"] is not None:
        null_policy_errors.append((item["id"], "legacy-feat"))
if legacy15["foundingCache"]["groupingThreshold"] is not None:
    null_policy_errors.append((legacy15["foundingCache"]["id"], "grouping"))
if any(value is not None for value in restaurant16["facility"]["operational"].values() if value != "requires-approval"):
    null_policy_errors.append(("facility.restaurant", "operational"))
restaurant_economy = restaurant16["economyPolicy"]
for field in (
    "baseSaleByCustomerId",
    "tipMultiplierByMatch",
    "reputationByMatch",
    "recipeMasteryByMatch",
    "reputationThresholds",
):
    if any(value is not None for value in restaurant_economy[field].values()):
        null_policy_errors.append(("facility.restaurant", field))
if restaurant_economy["activeProfitTargetShare"] is not None:
    null_policy_errors.append(("facility.restaurant", "activeProfitTargetShare"))
if any(item["rewards"] is not None for item in story17["storyRewardDefinitions"]):
    null_policy_errors.append(("story.book1", "rewards"))
if unlocks17["globalRules"]["prosperityThreshold"] is not None or unlocks17["globalRules"]["headquartersThreshold"] is not None:
    null_policy_errors.append(("facility-unlocks", "thresholds"))
check("Phase 14–17 unapproved economy/unlock values remain null", not null_policy_errors, null_policy_errors)

check(
    "Phase 17 and Phase 20–21 unapproved art/CSS treatments remain null",
    all(item["artTreatmentId"] is None and item["cssTreatmentId"] is None for item in visual17["changes"])
    and phase20["presentationPolicy"]["artTreatmentByFacilityId"] is None
    and phase20["presentationPolicy"]["cssTreatmentByFacilityId"] is None
    and phase21["presentationPolicy"]["artTreatmentByFacilityId"] is None
    and phase21["presentationPolicy"]["cssTreatmentByFacilityId"] is None,
)

definition_jsons = [
    facility14,
    legacy15,
    restaurant16,
    story17,
    unlocks17,
    visual17,
    apothecary18,
    schoolhouse19,
    phase20,
    phase21,
    integration21,
]
serialized_definitions = json.dumps(definition_jsons, sort_keys=True).lower()
forbidden_identity_patterns = [".currency", ".stamina", ".daily-checklist", ".daily-reset"]
active_multiplier_values = []


def find_active_multipliers(value, path="$"):
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if "multiplier" in key.lower():
                numeric = [leaf for leaf in leaves(child) if isinstance(leaf, (int, float)) and not isinstance(leaf, bool)]
                if numeric:
                    active_multiplier_values.append((child_path, numeric))
            find_active_multipliers(child, child_path)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            find_active_multipliers(child, f"{path}[{index}]")


for source in definition_jsons:
    find_active_multipliers(source)
guardrail_contracts = read("design/phase-14/PHASE_14_FACILITY_CONTRACT.md") + read("design/phase-15-16/PHASE_15_16_CONTRACT.md")
check(
    "no new currency, stamina, daily checklist/reset, or active percentage multiplier",
    not any(pattern in serialized_definitions for pattern in forbidden_identity_patterns)
    and not active_multiplier_values
    and "Do not add facility stamina" in guardrail_contracts
    and "No new global currency" in guardrail_contracts,
    active_multiplier_values,
)

synthetic_sources = [
    load("design/phase-14/fixtures.json"),
    load("design/phase-15-16/fixtures.json"),
    load("design/phase-17/fixtures.json"),
    load("design/phase-18-19/fixtures.json"),
    load("design/phase-20-21/fixtures.json"),
]
check(
    "all numeric synthetic policies remain unmistakably QA-only",
    "QA inputs only" in synthetic_sources[0]["purpose"]
    and "QA inputs only" in synthetic_sources[1]["purpose"]
    and synthetic_sources[2]["syntheticValuesAreNonProduction"] is True
    and synthetic_sources[3]["syntheticPolicy"]["scope"] == "QA_ONLY_NEVER_PRODUCTION_OR_MIGRATION_FALLBACK"
    and synthetic_sources[4]["syntheticPolicy"]["scope"] == "QA_ONLY_NEVER_PRODUCTION_OR_MIGRATION_FALLBACK",
)


# 8. Release gate, blockers, and committed result snapshot.
release_gates = release21["gates"]
check(
    "all 27 Phase 20–21 release gates remain explicit and blocked",
    len(release_gates) == fixtures["guardrails"]["releaseGateCount"]
    and unique(item["id"] for item in release_gates)
    and all(
        item["required"] is True
        and item["status"] == "blocked"
        and item["evidence"] is None
        and item["blocker"]
        for item in release_gates
    )
    and release21["productionReleaseAllowed"] is False
    and release21["releaseDecision"]["status"] == "BLOCKED",
)

blocker_items = blockers["items"]
blocker_ids = {item["id"] for item in blocker_items}
blocker_sequence = {item["id"]: item["sequence"] for item in blocker_items}
blocker_errors = []
for item in blocker_items:
    if not item["status"].startswith("open-blocking"):
        blocker_errors.append((item["id"], "status"))
    if not item["owner"] or not item["decision"] or not item["evidence"] or not item["failClosedEffect"]:
        blocker_errors.append((item["id"], "shape"))
    for dependency in item["dependsOn"]:
        if dependency not in blocker_ids or blocker_sequence[dependency] >= item["sequence"]:
            blocker_errors.append((item["id"], dependency))
check(
    "implementation blocker matrix is ordered, complete, and fail-closed",
    len(blocker_items) == 12
    and unique(item["id"] for item in blocker_items)
    and unique(item["sequence"] for item in blocker_items)
    and not blocker_errors,
    blocker_errors,
)

expected_counts = {
    "facilities": 12,
    "canonicalPhysicalAnchors": 12,
    "predecessorAnchorAliases": 6,
    "tutorialLedgerIds": 79,
    "facilityConceptMappings": len(fixtures["facilityConceptCoverage"]),
    "fellows": 18,
    "family": 20,
    "castActors": 38,
    "masterCastHooks": 76,
    "finalizerDispatches": 14,
    "phase20To21ReleaseGates": 27,
    "implementationBlockers": 12,
    "auditFixtures": len(fixtures["fixtureCases"]),
}
check("committed audit result counts match computed evidence", results["counts"] == expected_counts, (results["counts"], expected_counts))
check(
    "committed result records the anchor and graduation blockers",
    results["auditStatus"] == "PASS_WITH_EXPLICIT_RUNTIME_BLOCKERS"
    and results["productionReleaseDecision"] == "BLOCKED"
    and results["knownCrossPhaseVariances"][0]["id"] == "variance.facility.predecessor-anchor-aliases"
    and results["knownCrossPhaseVariances"][0]["count"] == 6
    and "blocker.schoolhouse.graduation-v2-offer" in results["blockingDecisionIds"]
    and set(results["blockingDecisionIds"]) == blocker_ids,
)


passed = sum(1 for _, ok, _ in checks if ok)
failed = len(checks) - passed
print(
    f"SUMMARY {passed}/{len(checks)} checks; "
    f"12 facilities/12 canonical anchors; 79 tutorials; 38 actors; "
    f"14 finalizer seams; 27 release gates; 12 implementation blockers"
)
if failed:
    sys.exit(1)

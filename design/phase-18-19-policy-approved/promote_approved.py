#!/usr/bin/env python3
"""Deterministically materialize the immutable Phase 18–19 approved policy."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
CANDIDATE = HERE.parent / "phase-18-19-policy-candidate"
SOURCE_COMMIT = "513b2f0e4d9aa8498770e48ea3faf04c515f2aa9"
SOURCE_HASHES = {
    "policy-candidate.json": "209c644bc933445511b061f1f00be757fa06f068619c6469a806dc67a8fd9675",
    "fixed-reward-table.json": "4a1bc420b164343e26c0168ba93dd81a737f434743fe970a06a191a22455ff09",
    "tutorial-timing.json": "056b60784a6f7c3ade88682622504b966bb1b28babd4c5de4efe217c6c2164fc",
    "cast-schedule.json": "5527f94163c2e09a984a65ab0a4f205c1b8e73ae1312d7915b2a9b572c3666ca",
}


def load(name: str) -> dict:
    path = CANDIDATE / name
    if hashlib.sha256(path.read_bytes()).hexdigest() != SOURCE_HASHES[name]:
        raise ValueError(f"reviewed candidate changed: {name}")
    return json.loads(path.read_text())


def dump(value: dict) -> str:
    return json.dumps(value, indent=2, ensure_ascii=False) + "\n"


def outputs() -> dict[str, str]:
    policy = copy.deepcopy(load("policy-candidate.json"))
    policy.update({
        "contractId": "phase-18-19-product-policy-approved-v1",
        "sourceCandidateCommit": SOURCE_COMMIT,
        "status": "approved-private-release",
        "authoritative": True,
        "productionEnabled": True,
        "mechanicalEnablementAllowed": True,
        "privateReleaseOnly": True,
        "publicReleaseAllowed": False,
    })
    policy["structuralProductionBandAuthority"].update({
        "authorityId": "authority.phase-18-19.structural-village-rate.approved-v1",
        "fixedTableId": "reward-table.phase-18-19.structural-rate.approved-v1",
        "fixedTablePath": "fixed-reward-table.json",
    })
    policy["phase18ApothecaryPolicy"].update({"policyId": "economy-policy.apothecary.approved-v1", "reviewStatus": "approved-private-release"})
    policy["phase19SchoolhousePolicy"].update({"policyId": "economy-policy.schoolhouse.approved-v1", "reviewStatus": "approved-private-release"})
    policy.pop("approvalTransition", None)
    policy["approvalRecord"] = {
        "approvalId": "approval.phase-18-19-policy.v1",
        "approvedCandidateCommit": SOURCE_COMMIT,
        "approvedScope": ["all-cadence-cap-content-economy-values", "structural-rate-table-authority", "seven-versioned-legacy-definitions", "finite-three-pupil-v1-slice", "graduation-v2-finalizer-archive-seam", "functional-copy-presentation-policy"],
        "finalLocalizedAndVisualWordingRequiresReleaseReview": True,
        "runtimeActivationRequiresPrivateFeatureFlags": True,
        "publicReleaseAllowed": False,
    }

    table = copy.deepcopy(load("fixed-reward-table.json"))
    table.update({"tableId": "reward-table.phase-18-19.structural-rate.approved-v1", "status": "approved-private-release", "productionEnabled": True, "privateReleaseOnly": True, "publicReleaseAllowed": False, "sourceCandidateCommit": SOURCE_COMMIT})
    table["generationAuthority"]["generatorPath"] = "design/phase-18-19-policy-approved/promote_approved.py"

    tutorials = copy.deepcopy(load("tutorial-timing.json"))
    tutorials.update({"scheduleId": "tutorial-schedule.phase-18-19-policy-approved-v1", "status": "approved-private-release", "productionEnabled": True, "privateReleaseOnly": True, "publicReleaseAllowed": False, "sourceCandidateCommit": SOURCE_COMMIT})

    cast = copy.deepcopy(load("cast-schedule.json"))
    cast.update({"scheduleId": "cast-schedule.phase-18-19-policy-approved-v1", "status": "approved-private-release", "productionEnabled": True, "privateReleaseOnly": True, "publicReleaseAllowed": False, "sourceCandidateCommit": SOURCE_COMMIT})

    approval = {
        "approvalId": "approval.phase-18-19-policy.v1",
        "sourceCandidateCommit": SOURCE_COMMIT,
        "sourceCandidateHashes": SOURCE_HASHES,
        "decision": "approved-private-release",
        "approvedValuesChanged": False,
        "approvedPolicyId": policy["contractId"],
        "approvedTableId": table["tableId"],
        "approvedTutorialScheduleId": tutorials["scheduleId"],
        "approvedCastScheduleId": cast["scheduleId"],
        "publicReleaseAllowed": False,
        "releaseReviewStillRequired": ["final-localized-wording", "final-visual-wording-and-presentation", "live-five-realm-runtime-gate", "root-integration-review"],
    }
    return {
        "policy-approved.json": dump(policy),
        "fixed-reward-table.json": dump(table),
        "tutorial-timing.json": dump(tutorials),
        "cast-schedule.json": dump(cast),
        "approval-record.json": dump(approval),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    failures = []
    for name, expected in outputs().items():
        path = HERE / name
        if args.check:
            if not path.exists() or path.read_text() != expected:
                failures.append(name)
        else:
            path.write_text(expected)
    if failures:
        print("FAIL stale approved artifacts: " + ", ".join(failures))
        return 1
    print("PASS approved Phase 18–19 policy artifacts are deterministic" if args.check else "WROTE approved Phase 18–19 policy artifacts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

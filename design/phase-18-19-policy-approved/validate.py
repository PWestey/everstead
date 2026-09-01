#!/usr/bin/env python3
"""Validate immutable approved Phase 18–19 policy authority."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
rows = []


def load(name):
    return json.loads((HERE / name).read_text())


def check(name, value):
    rows.append((name, bool(value)))


policy = load("policy-approved.json")
table = load("fixed-reward-table.json")
tutorials = load("tutorial-timing.json")
cast = load("cast-schedule.json")
approval = load("approval-record.json")

check("approved-authority", policy["status"] == "approved-private-release" and policy["authoritative"] and policy["productionEnabled"] and policy["mechanicalEnablementAllowed"])
check("private-not-public", policy["privateReleaseOnly"] and policy["publicReleaseAllowed"] is False and approval["publicReleaseAllowed"] is False)
check("approval-source-exact", approval["sourceCandidateCommit"] == "513b2f0e4d9aa8498770e48ea3faf04c515f2aa9" and approval["approvedValuesChanged"] is False)
check("approved-table-authority", policy["structuralProductionBandAuthority"]["fixedTableId"] == table["tableId"] == "reward-table.phase-18-19.structural-rate.approved-v1")
check("approved-table-52", len(table["bands"]) == 52 and table["productionEnabled"] and table["runtimeFormulaAllowed"] is False)
check("approved-apothecary", policy["phase18ApothecaryPolicy"]["policyId"] == "economy-policy.apothecary.approved-v1" and policy["phase18ApothecaryPolicy"]["reviewStatus"] == "approved-private-release")
check("approved-schoolhouse", policy["phase19SchoolhousePolicy"]["policyId"] == "economy-policy.schoolhouse.approved-v1" and policy["phase19SchoolhousePolicy"]["reviewStatus"] == "approved-private-release")
check("approved-manual-nonexpiry", policy["globalGuardrails"]["manualClaimsOnly"] and policy["globalGuardrails"]["opportunitiesExpire"] is False)
check("approved-no-offline-agency", all(policy["globalGuardrails"][key] is False for key in ("offlineMayChoose", "offlineMayResolve", "offlineMayClaim", "offlineMayTeach", "offlineMayGraduate")))
check("approved-no-global-loop", all(policy["globalGuardrails"][key] is False for key in ("newGlobalCurrency", "stamina", "dailyReset", "dailyChecklist", "permanentPercentageMultiplier")))
check("approved-passive-preserved", policy["globalGuardrails"]["passiveBuildingProductionMutated"] is False and policy["globalGuardrails"]["familyAssignmentMutated"] is False)
check("approved-tutorials", tutorials["status"] == "approved-private-release" and tutorials["productionEnabled"] and len(tutorials["entries"]) == 9)
check("approved-cast", cast["status"] == "approved-private-release" and cast["productionEnabled"] and len(cast["entries"]) == 10 and cast["runtimeRules"]["lockedFellowsExcluded"])
check("approved-presentation-review", approval["releaseReviewStillRequired"] == ["final-localized-wording", "final-visual-wording-and-presentation", "live-five-realm-runtime-gate", "root-integration-review"])
generated = subprocess.run([sys.executable, str(HERE / "promote_approved.py"), "--check"], text=True, capture_output=True)
check("approved-artifacts-deterministic", generated.returncode == 0)
expected = {"README.md", "approval-record.json", "cast-schedule.json", "fixed-reward-table.json", "policy-approved.json", "promote_approved.py", "tutorial-timing.json", "validate.py"}
check("approved-package-topology", {path.name for path in HERE.iterdir() if path.is_file()} == expected)

passed = sum(value for _, value in rows)
for name, value in rows:
    print(f"{'PASS' if value else 'FAIL'} {name}")
print(f"SUMMARY {passed}/{len(rows)} approved-policy checks; 52 bands; 9 tutorials; 10 actors; public release false")
raise SystemExit(0 if passed == len(rows) else 1)

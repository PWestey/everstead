#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
CANDIDATE = ROOT / "design" / "phase-15-16-policy-candidate"
EXPECTED_FILES = {"README.md", "approval.json", "validate.py"}

checks: list[tuple[str, bool, object]] = []


def check(label: str, condition: bool, detail: object = "") -> None:
    checks.append((label, bool(condition), detail))


def load(path: Path) -> object:
    return json.loads(path.read_text())


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git(*args: str) -> str:
    return subprocess.check_output(["/usr/bin/git", *args], cwd=ROOT, text=True).strip()


def git_clean(path: str) -> bool:
    unstaged = subprocess.run(["/usr/bin/git", "diff", "--quiet", "--", path], cwd=ROOT, check=False)
    staged = subprocess.run(["/usr/bin/git", "diff", "--cached", "--quiet", "--", path], cwd=ROOT, check=False)
    return unstaged.returncode == 0 and staged.returncode == 0


approval = load(HERE / "approval.json")
policy = load(CANDIDATE / "policy-candidate.json")
copy = load(CANDIDATE / "copy.en.json")
simulation = load(CANDIDATE / "simulation-results.json")

check("package contains exactly the bounded approval files", {path.name for path in HERE.iterdir() if path.is_file()} == EXPECTED_FILES)
check("approval is authoritative only for private integration", approval["status"] == "approved-for-private-integration" and approval["authoritative"] is True and approval["productionRuntimeEligible"] is True and approval["publicReleaseAllowed"] is False)
check("candidate tree is the exact reviewed identity", git("rev-parse", "HEAD:design/phase-15-16-policy-candidate") == approval["approvedCandidateTree"])
check("candidate source has no staged or unstaged edits", git_clean("design/phase-15-16-policy-candidate"))

digest_failures = [name for name, expected in approval["approvedFiles"].items() if sha256(CANDIDATE / name) != expected]
check("all approved candidate file digests match", not digest_failures, digest_failures)
check("candidate remains immutable and non-authoritative on its own", policy["status"] == "candidate-root-review-required" and policy["authoritative"] is False and policy["productionEnabled"] is False and policy["mechanicalEnablementAllowed"] is False)
check("approval binds the exact Legacy policy", approval["approvedPolicyIds"]["legacy"] == policy["phase15LegacyPolicy"]["policyId"])
check("approval binds the exact Restaurant policy", approval["approvedPolicyIds"]["restaurant"] == policy["phase16RestaurantPolicy"]["policyId"])
check("approval binds the exact fixed reward table", approval["approvedPolicyIds"]["restaurantRewardTable"] == policy["phase16RestaurantPolicy"]["fixedRewardTable"]["tableId"])
check("all material product decisions are explicit", set(approval["decisions"].values()) == {"approved-as-captured", "approved-for-private-integration", "implementation-must-pass-phase-15-and-phase-16-independent-gates"})

route = approval["routeEnvoyStoryEvent"]
visitor = policy["phase16RestaurantPolicy"]["namedVisitor"]
check("route-envoy event identity matches the approved visitor", route["eventId"] == visitor["requiredStoryEventId"] and route["additionalEligibility"]["minimumReputationLevel"] == visitor["minimumReputationLevel"] and route["oneTimePerSave"] == visitor["oneTimePerSave"])
check("route-envoy emission point is exact and reward-neutral on replay/offline", route["emittedAfterFirstCommittedResolutionOf"] == "story.book1.interlude.open-table" and route["acceptedResolutions"] == ["watched", "skipped"] and route["foregroundOnly"] is True and route["offlineMayEmit"] is False and route["replayMayEmit"] is False)

profiles = simulation["profiles"]
boundaries = simulation["boundaryChecks"]
check("all captured profile active shares remain 5–15 percent", all(500 <= row["recurringActiveShareBasisPoints"] <= 1500 for row in profiles))
check("all boundary samples remain 5–15 percent", all(500 <= sample["recurringActiveShareBasisPoints"] <= 1500 for row in boundaries for sample in row["samples"]))
check("five-year claim/archive projection remains bounded", simulation["fiveYearHeadroom"]["projectedIncrementalBytes"] < 1024 * 1024 and simulation["fiveYearHeadroom"]["retainedRecentReceipts"] <= 512)
check("English copy keeps the original-writing guardrail", copy["writingPolicy"]["originalEversteadWriting"] is True and copy["writingPolicy"]["externalFranchiseVoiceImitation"] is False and copy["productionEnabled"] is False)
check("public release blockers remain explicit", set(approval["releaseBlockers"]) == {"phase-15-runtime-acceptance", "phase-16-runtime-acceptance", "full-regression-and-browser-gates", "public-character-and-art-authorization"})
check("approved values require a new version to change", all(approval["changePolicy"].values()))

passed = sum(ok for _, ok, _ in checks)
for label, ok, detail in checks:
    print(f"{'PASS' if ok else 'FAIL'} {label}" + (f": {detail}" if not ok and detail else ""))
print(f"RESULT {passed} passed, {len(checks) - passed} failed")
raise SystemExit(0 if passed == len(checks) else 1)

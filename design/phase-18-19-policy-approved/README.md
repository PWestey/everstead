# Phase 18–19 Approved Product Policy v1

This immutable package promotes the exact reviewed candidate at commit
`513b2f0e4d9aa8498770e48ea3faf04c515f2aa9` to private-release authority.
Candidate values are copied without change; their four source hashes are frozen
in `approval-record.json` and `promote_approved.py`.

The policy may power private Phase 18–19 feature flags. It does not authorize a
public release, deployment, or bypass of runtime/static/live QA. Final localized
and visual wording remains subject to release review.

Run:

```sh
python3 design/phase-18-19-policy-approved/promote_approved.py --check
python3 design/phase-18-19-policy-approved/validate.py
```

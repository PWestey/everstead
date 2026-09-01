# Phase 13 independent QA result

## Package status

Prepared from exact Phase 11H release commit `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c`. Production files were not changed.

## Package-only verification

- `34/34` package/baseline checks passed before commit.
- The exact Phase 11H artifact identity passed: SHA-256 `fb4d3f024307db2f01a9931a7f6ac3cde8245b3be6ab130d05c2c53d8a099df8`, byte length `1,020,510`.
- The inherited Phase 11H release gate passed `74/74`.
- All 47 frozen Phase 11H full-portrait/cutout files matched their recorded SHA-256 values.
- JavaScript syntax checks passed for the verifier, runner, and isolated realm.

Design-package provenance was read from commit `73b807a36cb0ddb12fe726b3d271f7c4779e5ba9`. The exact source-file SHA-256 values used during contract preparation were:

- `PHASE_13_CONTENT_CONTRACT.md`: `052d39f471528b9c012c0dbef731f310211eedc20d25c10cc8013254a593fce0`
- `DATA_SPEC.md`: `793377ea7d7b961543477839fa65f83ffe7b26c7fae042e679ffc3e7b1d5b216`
- `PHASE_MATRIX.md`: `07704a271474751c6017e8a530585907a9e4a97a6feb9db769ecc6399140cf49`
- `cast-plan.json`: `14cb5ce8818aa27f06246a7110b7ebab3c2302f985a84101cdd6a80a8000bbbf`
- `tutorial-matrix.json`: `4b86f2ae95c85178379161cdc54ce9a26c08fb3c41cae4a7dda6b75a55143b8c`

## Expected preimplementation result

Candidate mode failed `33/39` on exact Phase 11H, with exactly six expected missing-implementation rows:

- Phase 13 bridge contract absent
- Phase 12 foundation seam absent
- five Phase 13 story identities absent
- 41 Phase 13 tutorial identities absent
- opening-art policy absent
- pre-foundation `STORY` Campaign table still present

This is evidence that the gate does not silently skip an absent implementation.

## Live candidate verification

The delegated environment exposed no browser backend, so live Chromium was not claimed here. The preimplementation runner is deterministic: five fixture rows pass, and each of the three required realms emits explicit failing `bridge-present` and `phase13-contract-unavailable` rows. A root/integrator browser smoke remains required before this result can claim live evidence.

Static candidate checks search production sources only; planning data under `design/` cannot satisfy implementation assertions. The package-only run owns the QA path audit, while candidate mode permits the implementation and design files present in the integration branch.

## Residual risk

See the contract Blind spots section. Passing the automated gate does not approve story prose, art quality, public-use rights, balance, Safari, or physical-device behavior.

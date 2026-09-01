# Phase 13 independent QA

Independent, additive contract for the First Covenant vertical slice. It edits no production artifact and is rooted at exact Phase 11H commit `4ee1ee4dcaa1b6eb190ed65d8cf81623c49bc28c`.

## Run

Package and baseline only:

```sh
node qa/phase-13-independent/verify.mjs --package-only
```

Candidate static contract:

```sh
node qa/phase-13-independent/verify.mjs
```

Live browser contract:

```sh
python3 -m http.server 8783
```

Open `http://127.0.0.1:8783/qa/phase-13-independent/`. The runner creates isolated 320×568, 390×844, and reduced-motion realms. It never uses production `localStorage`.

## Expected baseline behavior

- Package-only verification passes on exact Phase 11H.
- Candidate static verification fails because Phase 13 is not implemented.
- The live runner fails closed with `phase13-contract-unavailable` in every realm.

## Candidate bridge

The required bridge is `window.__EVERSTEAD_PHASE_13_QA__`, version `phase-13-independent-qa-v1`. See the contract document for its read-only and isolated-destructive methods. It must be absent from production and may be installed only by the existing localhost `?qa=1` test path with explicit isolated non-native storage and destructive authorization.

## Scope

- five First Covenant scene identities and trigger/ordering rules;
- Chronicle, dialogue controls, replay, skip, and log neutrality;
- exactly-once manual reward claims under repeat, reload, offline, and two-client contention;
- 41 Phase 13 tutorial definitions plus the 79-ID delivery coverage ledger;
- non-blocking tutorial skip/complete/replay state, suppression, recap, and session caps;
- exact 18-Fellow/20-Family manifest retention and complete profile/ambient/authored coverage;
- four required opening speaker-art resolutions and approved fallbacks;
- Phase 12 seam, schema-12, Phase 11H art/offline/save, and dormant legacy regression checks;
- mobile and reduced-motion presentation checks.

## Deliberately not frozen

Dialogue prose, exact rewards, balance, animation duration, and economy numbers. These can change without invalidating durable identity or exactly-once behavior.

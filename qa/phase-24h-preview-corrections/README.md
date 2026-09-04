# Phase 24H · Public-preview corrections QA gate

This successor gate owns six presentation-only corrections on top of exact Phase 24G commit `4425e41085a3f338c82f389415e0d8cffe2b6ac9`:

- the Fellowship summary and tab counts no longer overwrite each other;
- every current surface and Recovery File uses `1.0.0-preview.1`;
- foundation-thin schema-14 saves receive a visible, read-only recovery explanation;
- the unreachable Founding Table is honestly classified as preview-excluded;
- dialogue shows a compact line counter while reward policy lives in More;
- Scaling Authority is collapsed under an advanced disclosure and still opens read-only.

This phase deliberately does not repair schema-14 migration history, release the Restaurant, install startup diagnostics, or collapse wrapper chains. Those are separate behavioral or architectural changes.

## Run

```sh
node qa/phase-24h-preview-corrections/verify.mjs
node qa/phase-24h-preview-corrections/browser.mjs
shasum -a 256 -c qa/phase-24h-preview-corrections/checksums.sha256
```

The browser gate uses ordinary, non-QA page realms for both 320×568 and 390×844. Its foundation-thin seed is prepared in a separate isolated QA realm from the exact Phase 24G predecessor, then loaded into a fresh non-QA context. It waits for rendered application ownership rather than sleeping for a fixed boot interval.

The exact Phase 24G predecessor is also exported and rerun in CI, including its full 342-check Chromium matrix. Phase 24H does not rebaseline or weaken any historical gate.

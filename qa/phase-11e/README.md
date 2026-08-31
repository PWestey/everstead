# Phase 11E successor gate

This gate verifies the schema-neutral stewardship pass:

- public release identity is separated from the compatibility save version;
- main, Fellowship, and Adventure browsing is save-neutral;
- the session-only Village featured Fellow does not alter the persisted save;
- Claim Ready hierarchy and compact/expanded states follow the Phase 11E contract;
- Save Health presents normal-player language before advanced details;
- Codex enrichment remains read-only;
- no Prosperity thresholds or roster catch-up rates were invented;
- the five embedded production art assets remain byte-identical;
- the focused Phase 11D, Phase 11C, and Phase 11B behavioral suites still pass.

Run the complete local/CI gate from the repository root:

```sh
node qa/phase-11e/verify.mjs
```

The focused Phase 11E probe is also available independently:

```sh
node qa/phase-11e/probe.mjs
```

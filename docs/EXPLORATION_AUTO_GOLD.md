# Exploration and automatic passive Gold

2026-09-05. User-directed successor to 6916f886431165e76fad7bcce5b5feb4cf099e61.

Passive building Gold now transfers into the wallet within the same persisted transaction as elapsed-time settlement. Whole Gold transfers, fractional remainder stays pending. The existing 24-hour cap and calendar segmentation remain authoritative. Five-second foreground pulses use the normal coordinator and skip blocked, stale, hidden or busy state. No separate timer balance or new storage key exists. Existing pending Gold transfers on opening; Family gifts/shards and all other rewards remain manual claims.

The Village map now has native horizontal touch/trackpad/keyboard scrolling and a Waystone recenter control. Map objects move together; menus remain fixed. This first pass reframes the existing art on a wider canvas; it does not deliver new district artwork or additional building locations.

Campaign presentation now emphasizes the scene, compact Stage Records and Go/cost control. Detailed mechanics remain accessible in the Rewards panel. Tower and Expedition layouts are unchanged.

Checks: 390×844 and 320×568 UI/accrual tests; positive automatic Gold without a claim, fractional remainder, bonus claim sequence unchanged; 48-hour absence capped to the same payout as 24 hours; repeat reload at identical timestamp credits zero; 30 public gameplay assertions with time frozen for exact-cost accounting. Live-time accrual is tested separately rather than disabling it in production. No Safari/device pass yet; Web Storage retains its existing no-CAS limitation.

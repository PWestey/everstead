# Phase 24A deterministic balance report

**Contract:** `phase-24a-balance-baseline-v1`  
**Authority:** `everstead-scaling-live-baseline.phase-24a.v1`  
**Schema:** 13  
**Frozen clock:** `1800000000000`  
**Canonical payload SHA-256:** `7c19b0a2ec7ab48ae0bea98a67ec06dbcfcdecf726ee3d633471360e1e87c0fe`

This is a read-only observation of the accepted post-Phase-23 numeric baseline. It does not authorize a balance change. Collections remain reserved and contribute zero.

| Profile | Fellow economy | Fellow combat | Companion actual | Migration floor | Effective threshold | Gold/hour |
|---|---:|---:|---:|---:|---:|---:|
| phase24a.fresh.schema13.v1 | 35150 | 35565 | 2200 | 0 | 2200 | 27320.8092192 |
| phase24a.migrated-established.schema13.v1 | 35150 | 36645 | 2272 | 2892 | 2892 | 27328.94041242 |
| phase24a.true-high-investment.schema13.v1 | 3196916 | 3588268 | 50355 | 0 | 50355 | 60337645.45902187 |

## Exact Building Gold/hour

### phase24a.fresh.schema13.v1

| Building | Base | Level | Exact Gold/hour | Upgrade |
|---|---:|---:|---:|---:|
| training | 7200 | 1 | 7806.077153279999 | 15000 |
| command | 6500 | 1 | 6807.528 | 15000 |
| archives | 5600 | 1 | 6050.279531519999 | 15000 |
| hearth | 6100 | 1 | 6656.9245344 | 15000 |

**Village total:** 27320.8092192  
**Fellow Campaign stage one:** requirement 22000; base cost 10000; discount 0.1541477272727273; effective cost 8459.

**Claim state**

```json
{
  "byLane": {},
  "manualClaimAuthorityUnchanged": true,
  "pendingOpportunityCount": 0,
  "readyClaimCount": 0,
  "status": "report-only-no-claim"
}
```

**Offline state**

```json
{
  "elapsedCapMs": 86400000,
  "expeditionIntervalMs": 3600000,
  "pendingByLane": {},
  "reportSettlesNothing": true,
  "towerIntervalMs": 3600000
}
```

### phase24a.migrated-established.schema13.v1

| Building | Base | Level | Exact Gold/hour | Upgrade |
|---|---:|---:|---:|---:|
| training | 7200 | 1 | 7808.400390527999 | 15000 |
| command | 6500 | 1 | 6809.55405 | 15000 |
| archives | 5600 | 1 | 6052.080209952 | 15000 |
| hearth | 6100 | 1 | 6658.905761939999 | 15000 |

**Village total:** 27328.94041242  
**Fellow Campaign stage one:** requirement 22000; base cost 10000; discount 0.16642045454545457; effective cost 8336.

**Claim state**

```json
{
  "byLane": {},
  "manualClaimAuthorityUnchanged": true,
  "pendingOpportunityCount": 0,
  "readyClaimCount": 0,
  "status": "report-only-no-claim"
}
```

**Offline state**

```json
{
  "elapsedCapMs": 86400000,
  "expeditionIntervalMs": 3600000,
  "pendingByLane": {},
  "reportSettlesNothing": true,
  "towerIntervalMs": 3600000
}
```

### phase24a.true-high-investment.schema13.v1

| Building | Base | Level | Exact Gold/hour | Upgrade |
|---|---:|---:|---:|---:|
| training | 7200 | 52 | 17103584.539565254 | CAP |
| command | 6500 | 52 | 15440736.042663077 | CAP |
| archives | 5600 | 52 | 13302787.97521742 | CAP |
| hearth | 6100 | 52 | 14490536.90157612 | CAP |

**Village total:** 60337645.45902187  
**Fellow Campaign stage one:** requirement 22000; base cost 10000; discount 0.35; effective cost 6500.

**Claim state**

```json
{
  "byLane": {
    "apothecary": {
      "captured": {
        "bankCapacity": 8,
        "createdCount": 8
      },
      "pendingCount": 8,
      "readyCount": 0,
      "receiptIdentityVersion": 1,
      "receiptPolicyId": "apothecaryFinalizerV1"
    },
    "companionTower": {
      "captured": {
        "companionExp": {
          "arcanine": 2880,
          "blastoise": 2880,
          "boltund": 2880,
          "charizard": 2880,
          "dewgong": 2880,
          "donphan": 2880,
          "dragonite": 2880,
          "feraligatr": 2880,
          "jolteon": 2880,
          "lucario": 2880,
          "lugia": 2880,
          "mabosstiff": 2880,
          "machamp": 2880,
          "meganium": 2880,
          "miltank": 2880,
          "snorlax": 2880,
          "stoutland": 2880,
          "suicune": 2880,
          "venusaur": 2880,
          "zacian": 2880
        },
        "companionShards": {
          "arcanine": 0,
          "blastoise": 0,
          "boltund": 0,
          "charizard": 0,
          "dewgong": 0,
          "donphan": 1,
          "dragonite": 0,
          "feraligatr": 0,
          "jolteon": 1,
          "lucario": 0,
          "lugia": 2,
          "mabosstiff": 0,
          "machamp": 0,
          "meganium": 0,
          "miltank": 0,
          "snorlax": 1,
          "stoutland": 0,
          "suicune": 0,
          "venusaur": 0,
          "zacian": 0
        },
        "intervals": 24,
        "masteryAwarded": 0,
        "masteryNominal": 120,
        "postMasteryPoints": 50000,
        "preMasteryPoints": 50000
      },
      "pendingCount": 24,
      "readyCount": 1,
      "receiptIdentityVersion": 2,
      "receiptPolicyId": "companion-tower-targeting.phase-23.v1"
    },
    "fellowExpedition": {
      "captured": {
        "fellowShards": {
          "anakin": 2,
          "cael": 0,
          "captain-america": 0,
          "daredevil": 0,
          "darrow": 0,
          "deadpool": 1,
          "iron-man": 0,
          "lyra": 0,
          "mira": 0,
          "obi-wan": 0,
          "orin": 1,
          "rook": 1,
          "selene": 0,
          "spider-man": 0,
          "star-lord": 0,
          "thor": 0,
          "wolverine": 0,
          "zamorak": 1
        },
        "intervals": 24,
        "mightAwarded": 0,
        "mightNominal": 600,
        "postMightPoints": 50000,
        "preMightPoints": 50000
      },
      "pendingCount": 24,
      "readyCount": 1,
      "receiptIdentityVersion": 1,
      "receiptPolicyId": "phase-7-fellow-progression-v1"
    },
    "legacy": {
      "captured": [
        {
          "id": "qa.phase13.claim.first-covenant.v1",
          "offerId": "reward.offer.qa.phase13.claim.first-covenant.v1",
          "rewards": [
            {
              "amount": 1500,
              "kind": "gold",
              "targetId": null
            }
          ],
          "sourceId": "story.book1.chapter1.village-toll.resolution",
          "status": "ready"
        },
        {
          "id": "legacy.oathkeeper.tier-1",
          "offerId": "reward.offer.legacy.oathkeeper.tier-1",
          "rewards": [
            {
              "amount": 750,
              "kind": "gold",
              "targetId": null
            }
          ],
          "sourceId": "legacy.oathkeeper.tier-1",
          "status": "ready"
        },
        {
          "id": "legacy.first-campaign-clear",
          "offerId": "reward.offer.legacy.first-campaign-clear",
          "rewards": [
            {
              "amount": 500,
              "kind": "gold",
              "targetId": null
            }
          ],
          "sourceId": "legacy.feat.first-campaign-clear",
          "status": "ready"
        }
      ],
      "pendingCount": 3,
      "readyCount": 3,
      "receiptIdentityVersion": 2,
      "receiptPolicyId": "claim-archive.phase-15.v1"
    },
    "restaurant": {
      "captured": {
        "createdOrdinals": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "saturated": true
      },
      "pendingCount": 12,
      "readyCount": 0,
      "receiptIdentityVersion": 1,
      "receiptPolicyId": "economy-policy.restaurant.candidate-v1"
    },
    "schoolhouse": {
      "captured": {
        "bankCapacity": 8,
        "createdCount": 8
      },
      "pendingCount": 8,
      "readyCount": 0,
      "receiptIdentityVersion": 1,
      "receiptPolicyId": "schoolhouseLessonFinalizerV1"
    },
    "villageGold": {
      "captured": {
        "claimableGold": 923019963,
        "gifts": 0,
        "lines": [
          {
            "id": "training",
            "name": "Training Grounds",
            "value": 261643454.25174922
          },
          {
            "id": "command",
            "name": "Command Center",
            "value": 236205896.19949585
          },
          {
            "id": "archives",
            "name": "Archives",
            "value": 203500464.4180272
          },
          {
            "id": "hearth",
            "name": "Hearth",
            "value": 221670148.74106535
          }
        ],
        "pendingGold": 923019963.6103376,
        "shards": {
          "aerith": 0,
          "ahsoka": 0,
          "amara": 0,
          "captain-marvel": 0,
          "elara": 0,
          "hermione": 0,
          "isolde": 0,
          "jaina": 0,
          "misty": 0,
          "rey": 0,
          "scarlet-witch": 0,
          "shadowheart": 0,
          "shallan": 0,
          "syl": 0,
          "tamsin": 0,
          "tifa": 0,
          "tyrande": 0,
          "violet": 0,
          "virginia": 0,
          "yennefer": 0
        }
      },
      "pendingCount": 1,
      "readyCount": 1,
      "receiptIdentityVersion": 0,
      "receiptPolicyId": "legacy-unversioned-village-collection"
    }
  },
  "manualClaimAuthorityUnchanged": true,
  "pendingOpportunityCount": 28,
  "readyClaimCount": 6,
  "status": "report-only-no-claim"
}
```

**Offline state**

```json
{
  "elapsedCapMs": 86400000,
  "expeditionIntervalMs": 3600000,
  "pendingByLane": {
    "apothecary": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": false,
      "creditedMs": 28800000,
      "discardedMs": 57600000,
      "elapsedMs": 86400000,
      "intervalMs": 3600000,
      "intervals": 8,
      "opportunityReady": true,
      "pendingAfter": 8,
      "pendingBefore": 0,
      "sourcePolicyId": "economy-policy.apothecary.approved-v1"
    },
    "companionTower": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": true,
      "creditedMs": 86400000,
      "discardedMs": 0,
      "elapsedMs": 86400000,
      "intervalMs": 3600000,
      "intervals": 24,
      "opportunityReady": false,
      "pendingAfter": 24,
      "pendingBefore": 0,
      "sourcePolicyId": "companion-tower-targeting.phase-23.v1"
    },
    "fellowExpedition": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": true,
      "creditedMs": 86400000,
      "discardedMs": 0,
      "elapsedMs": 86400000,
      "intervalMs": 3600000,
      "intervals": 24,
      "opportunityReady": false,
      "pendingAfter": 24,
      "pendingBefore": 0,
      "sourcePolicyId": "phase-7-fellow-progression-v1"
    },
    "restaurant": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": false,
      "creditedMs": 21600000,
      "discardedMs": 64800000,
      "elapsedMs": 86400000,
      "intervalMs": 1800000,
      "intervals": 12,
      "opportunityReady": true,
      "pendingAfter": 12,
      "pendingBefore": 0,
      "sourcePolicyId": "economy-policy.restaurant.candidate-v1"
    },
    "schoolhouse": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": false,
      "creditedMs": 43200000,
      "discardedMs": 43200000,
      "elapsedMs": 86400000,
      "intervalMs": 5400000,
      "intervals": 8,
      "opportunityReady": true,
      "pendingAfter": 8,
      "pendingBefore": 0,
      "sourcePolicyId": "economy-policy.schoolhouse.approved-v1"
    },
    "villageGold": {
      "at": 1800000000000,
      "capMs": 86400000,
      "claimReady": true,
      "creditedMs": 86400000,
      "discardedMs": 0,
      "elapsedMs": 86400000,
      "intervalMs": null,
      "intervals": null,
      "opportunityReady": false,
      "pendingAfter": 923019963.6103376,
      "pendingBefore": 0,
      "sourcePolicyId": "6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f"
    }
  },
  "reportSettlesNothing": true,
  "towerIntervalMs": 3600000
}
```

## Noncanonical comparison evidence

- Fresh schema-12 → 13 migration: Fellow Combat Power 36366; stage-one cost 8368. This is not true fresh.
- All-unlocked near-cap QA: Fellow Economy Power 1039700; Fellow Combat Power 1054194; Companion actual/floor 4329/23980; Gold/hour 30091.179009136. This is not a fourth canonical profile.

## Fixed-table hashes

- economy: `8b46b2720e8965658237bade270f34cce3e480c90ad87d42dce6a050fd09c4fa`
- building: `9c80951e7ad013621d91c112f818b13cfb639897fe62b6e870d1bd5b219acf28`
- fellow: `c872f8c950034f87a259e8e77cf3fb7bc3b460fee818e8b6772f159183a49a80`
- companion: `6cc2458012bf208f87595c46035d1ea1d670b1b4c9acef7e024f7c86eb461837`
- economyRoster: `5e175b1623fdcc1706a13e90e66b079900d04da44195269f2e71feff7df80306`
- campaign: `69a24f851da8a1876ba25247293ef1d8b6691da884ac70c448b446d781b522c7`
- companionCampaign: `2e472d8119867a4910d63edf8a346598916754b999e2f32f3b1c4db76d6e831d`
- companionTower: `179b98f58ccb198508ffded1d2097df11c6cb3d7714c643a498633f7ef324077`
- fellowExpedition: `fc03bea0eb2a30307541cd7dd32c95a67b215dc6ee751a9e383e168194c1cb0f`
- player: `ac221b301f842b56df329082cc574bbf422d459de472b4dce49e5b92187ad7e8`
- family: `9b95a5e8c45c5ff542411b3f1fb3d9daff84491388c37030efcf160226f56e4e`
- relic: `bb6cc1a1960d774bb3a53f5ee3088c6105eaef72fff56dc8551358cb1ab450e1`
- might: `fcb34be9d2f4e2837eec8f843575fb9e03cc9eba69b536b70b95b57ea5fd4907`
- collection: `c99fb675a93ffb46055267a3bfa9a3d2986ad0ba4c7c1028f696fcf5fd55b9be`

## Observed report-table hashes

- requirements.companionCampaign: `84086096e0f569f221138ccb23b37dac45255b98059647abfd2a5cfaa7dd201e`
- requirements.companionTower: `7c4a05384cf92d8cfbd6286529b47e9f080702a035294790501ab77bf45e2c42`
- requirements.fellowCampaign: `f335b64033da59b05f6b02a211e90439f2c2f458c74be96c46714082d8b2ae1b`
- requirements.fellowExpedition: `77863c492cb4bd6dcc108ba3932b93304c157fd3ab5f84cd6794bd54d7ce3158`
- costs.phase24a.fresh.schema13.v1: `5e889a8d1ee4233ccfac6efb0871a25ea4063a05043b88838db1ca858f90fe77`
- costs.phase24a.migrated-established.schema13.v1: `accd044e2cdd2127deebb72fca4793578e27ebcd5aa123e15802abff90d5633e`
- costs.phase24a.true-high-investment.schema13.v1: `50e5496147ab19487448627b1f8b7987bd46e62fe2205bc81299bb9198697d50`
- claims.phase24a.fresh.schema13.v1: `29f97b306c57673f39b4515ae2bc982db64c720b3afff2680a4f7b64efc3a479`
- claims.phase24a.migrated-established.schema13.v1: `29f97b306c57673f39b4515ae2bc982db64c720b3afff2680a4f7b64efc3a479`
- claims.phase24a.true-high-investment.schema13.v1: `600eb325b1508e913d83370905cf278e6e2052b1c5767c33ac7578c664da5a0d`
- offline.phase24a.fresh.schema13.v1: `f44c3cb23566eecd6e6dd620f8116864b451b774ae6b1e884f2151520a301f95`
- offline.phase24a.migrated-established.schema13.v1: `f44c3cb23566eecd6e6dd620f8116864b451b774ae6b1e884f2151520a301f95`
- offline.phase24a.true-high-investment.schema13.v1: `63c5475333d8677b70293fa03bf2607ef992f117236fff7c99b0e2ecb81e3792`

## Production-source hashes

- `index.html`: `6109805093ee78f075257526b4822cf86c9ca22dbd2a2a05ab3ef7b0bcb8c5f3`
- `src/phase18-19-runtime.js`: `26686c97cc7c2a617224b8a287ab92933222e137c53bc309dedad6102d68df2e`
- `src/phase23-companion-catalog.js`: `48da84995d57d78ab01899b4f1840763b2539b4c5605da68ccc309889d0c718f`
- `src/phase23-companion-runtime.js`: `fd1455fef5cb5632fc53b055c935848e6b6f13f40175518520f0f4aa548dde40`
- `src/phase24-scaling-authority.js`: `819fd4e308a98c699ac01a0c3df780eab11e777d933038b118850679d0f39d5c`

## Authority and integrity

- Definitions SHA-256: `13dde7df66252a1fc2943192a70fe2366f23aafc247b3aa16d92ae6ae6c1fd6a`
- Formula-order SHA-256: `9515c5cb70c4dcef6857fd698a12347d69368d9cc390e89fb0d5b312fc9ce421`
- Recipe SHA-256: `70ffdf3bf5abc2460954096ca045f516108046962bc81713e4c1c49a20a334ae`
- Safe integers: PASS; maximum gameplay integer 923019963; gameplay headroom 9007198331721028; maximum integer including timestamps 1800000000000.

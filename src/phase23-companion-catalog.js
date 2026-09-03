/* Everstead Phase 23 · accepted private Companion roster catalog. */
(function phaseTwentyThreeCompanionCatalog(global){
  'use strict';

  /* Loaded before the legacy inline runtime.  That runtime consults this marker
     before scheduling any presentation so only the schema-13 boot may present. */
  Object.defineProperty(global,'__EVERSTEAD_PHASE23_BOOT_PENDING__',{configurable:true,enumerable:false,writable:true,value:true});

  const roster=Object.freeze([
    ['arcanine','Arcanine','Emberroad Guardian',115,'9038a6cc7c24c016229ec666cf690afd2d1a357404a5673eaaca0c373e27c44c','bramble'],
    ['dewgong','Dewgong','Moonwake Keeper',100,'f1e9d1a83b40b111cf43803ec200bd76f1aef9a5e22eb241a26b43c7048795d3','cinderwing'],
    ['snorlax','Snorlax','Hearthside Colossus',115,'db37fb9fabb7b7aa7135b65410c315e3d67f80d0a3bb64666d670ea0ff17b862',null],
    ['dragonite','Dragonite','Kindly Skywarden',125,'4afe9db832b4a8e69254f1088a9c48cbde74f415710d8ad575b75011e75259b7',null],
    ['charizard','Charizard','Flamebound Vanguard',125,'fa43580a2cbd278c3358f8043d5c31e201091fe780328674a80c48390fb00aa0',null],
    ['venusaur','Venusaur','Ancient Gardenheart',115,'6bc2f5ed958deda8600e35c07cfe5d5610fcfc2dd87af5ecff59b4bb49f8d760',null],
    ['blastoise','Blastoise','Tidewall Sentinel',115,'e20fc93f091cc5ac3b65f59d6e8267e3a5e4cfcb39bef8acd8bff0021dfebae6',null],
    ['jolteon','Jolteon','Stormpath Spark',100,'ea5ec0cf7e3b66cec7dab074d9a02c5701845ead1a603aec998a82b1c96cab8b',null],
    ['machamp','Machamp','Fourfold Champion',100,'6c0d4c5f844ed951b4a0c85136bb280715dd0f3b85f13ef813bccdb61ed921b5',null],
    ['meganium','Meganium','Bloomfield Grace',100,'ec9c628d431c45b1773dedae44549efc23507ef7670e95c4b98af7a367a6009d',null],
    ['feraligatr','Feraligatr','Riverfang Protector',115,'b3e954394948323cb3f036315a9666ddf7ebe3e4cb057d9262896893e9be0346',null],
    ['miltank','Miltank','Meadowstead Provider',100,'1267d48678d0e70b88ebb625cbb6dcd355dad15b9498c7901c550a015afb0fc3',null],
    ['donphan','Donphan','Stonewheel Defender',100,'2298de36aa1a9e18c0a7f92136dd05dcb2b2f70e682a2faf97158ee0a1357024',null],
    ['lucario','Lucario','Aura-Bound Watcher',100,'8e640ede6636c4cf4ebe2717e1c4bcdef33c4ae49a4a93f24795fe9a6864419b',null],
    ['boltund','Boltund','Brightroad Runner',100,'49bfc9fa2b1f80f1ce45ba7581f15af78846858d3cc78e60561742d1cecdd545',null],
    ['stoutland','Stoutland','Old Road Guide',100,'5ee5ad5c5c7d8e7d53ce56faeb5b5d7204582117313cb10bfb33dbd81fd182f2',null],
    ['mabosstiff','Mabosstiff','Steadfast Houseguard',100,'efa0bde77a08f2860d80bf0adac4ac5345845c13102531c6088b82ac4ce21a08',null],
    ['zacian','Zacian','Hero of Many Battles',125,'9e994ff6cb79201a3234f16f1332ed7d706d6eb28271c7c9399f548078771b98',null],
    ['lugia','Lugia','Guardian of the Deep Sky',125,'1572c02c073c4069cba9faf9b82d6e07e0f623afbf585dbcddbb40242a934e24',null],
    ['suicune','Suicune','Northwind Purifier',125,'26799151913ab21efc106123f6f02a7a85fa5e90ffa8f6e5516ec1dde6ba756c',null]
  ].map((row,index)=>Object.freeze({
    id:row[0],name:row[1],title:row[2],base:row[3],basePower:row[3],sourceSha256:row[4],legacySourceId:row[5],idx:index,
    fullWidth:1024,fullHeight:1536,thumbWidth:320,thumbHeight:480,
    art:Object.freeze({
      portrait:`private-assets/companions/${row[0]}/portrait.webp`,
      thumb:`private-assets/companions/${row[0]}/thumb.webp`
    })
  })));
  const ids=Object.freeze(roster.map(item=>item.id));
  const stagePools=Object.freeze([
    Object.freeze({stageId:'companion-trail-1',targetIds:Object.freeze(['arcanine','dewgong'])}),
    Object.freeze({stageId:'companion-trail-2',targetIds:Object.freeze(['snorlax','dragonite'])}),
    Object.freeze({stageId:'companion-trail-3',targetIds:Object.freeze(['charizard','venusaur'])}),
    Object.freeze({stageId:'companion-trail-4',targetIds:Object.freeze(['blastoise','jolteon'])}),
    Object.freeze({stageId:'companion-trail-5',targetIds:Object.freeze(['machamp','meganium'])}),
    Object.freeze({stageId:'companion-trail-6',targetIds:Object.freeze(['feraligatr','miltank'])}),
    Object.freeze({stageId:'companion-trail-7',targetIds:Object.freeze(['donphan','lucario'])}),
    Object.freeze({stageId:'companion-trail-8',targetIds:Object.freeze(['boltund','stoutland'])}),
    Object.freeze({stageId:'companion-trail-9',targetIds:Object.freeze(['mabosstiff','zacian'])}),
    Object.freeze({stageId:'companion-trail-10',targetIds:Object.freeze(['lugia','suicune'])})
  ]);
  const campaignPools=Object.freeze(stagePools.map(item=>item.targetIds));
  const lesson=(value)=>Object.freeze({...value,optional:true,skippable:true,replayable:true,rewardNeutral:true,reward:null,contextual:true});
  const tutorials=Object.freeze([
    lesson({id:'tutorial.companions.roster-and-power',title:'Meet Your Companions',surface:'companions',copy:'All twenty Companions already belong in Everstead. Open a portrait to see its progression and full sanctuary artwork.'}),
    lesson({id:'tutorial.companions.progression',title:'Level and Power',surface:'companion-profile',copy:'Companion EXP raises Level and Power. Rarity and global Mastery multiply that Power before one final round.'}),
    lesson({id:'tutorial.companions.assignment.first-link',title:'Fellow Assignment',surface:'companion-profile',copy:'Assign one Companion to one Fellow for free. A Fellow receives forty percent of that Companion\'s Power.'}),
    lesson({id:'tutorial.companions.campaign.first-stage',title:'Companion Campaign',surface:'companion-campaign',copy:'Begin with the first expedition; all rewards are earned through play.'}),
    lesson({id:'tutorial.companions.campaign.target-pools',title:'Target Pools',surface:'companion-campaign',copy:'Each stage has a fixed two-Companion pool. Future runs rotate within that pool deterministically.'}),
    lesson({id:'tutorial.companions.tower.first-clear',title:'Companion Tower',surface:'companion-tower',copy:'Clear floors to improve the idle lane.'}),
    lesson({id:'tutorial.companions.tower.idle-claim',title:'Banked Tower Rewards',surface:'companion-tower',copy:'Banked rewards wait until you claim them.'}),
    lesson({id:'tutorial.companions.mastery',title:'Companion Mastery',surface:'companion-tower',copy:'Tower activity builds global Mastery, strengthening every Companion and every assigned transfer.'})
  ]);
  const catalog=Object.freeze({
    version:1,
    campaignPolicyId:'companion-campaign-targeting.phase-23.v1',
    towerPolicyId:'companion-tower-targeting.phase-23.v1',
    manifestId:'everstead-companions-2026-09-01',
    privateBuildOnly:true,
    publicReleaseAllowed:false,
    roster,
    ids,
    campaignPools,
    stagePools,
    migrationMap:Object.freeze({bramble:'arcanine',cinderwing:'dewgong'}),
    basePowerTotal:roster.reduce((sum,item)=>sum+item.base,0),
    tutorials,
    acquisition:Object.freeze({allVisible:true,allOwned:true,summoning:false,pulls:false,acquisitionCurrency:false,duplicateConversion:false,gachaGate:false}),
    artPolicy:Object.freeze({manifestVersion:1,privateBuildOnly:true,publicReleaseAllowed:false,trackedRightsLimitedBinariesAllowed:false,runtimeRoot:'private-assets/companions',fullFile:'portrait.webp',thumbFile:'thumb.webp',fullWidth:1024,fullHeight:1536,thumbWidth:320,thumbHeight:480,fallbackMode:'original-companion-crest',fakeTransparentCutoutAllowed:false,transparentCutouts:false})
  });
  Object.defineProperty(global,'EVERSTEAD_PHASE23_COMPANIONS',{configurable:false,enumerable:false,writable:false,value:catalog});
})(globalThis);

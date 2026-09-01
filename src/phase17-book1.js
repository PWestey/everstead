(function installEversteadPhaseSeventeenBookOne(root){
  'use strict';

  const CONFIG_ID='phase-17-book1-runtime-v1';
  const BRIDGE_VERSION='phase-17-independent-qa-v1';
  const BOOK_ID='story.book1.first-covenant';
  const DEFINITION_SET_IDS=Object.freeze([
    'definition-set.phase-17-book1.v1',
    'definition-set.phase-17-village-unlocks.v1',
    'definition-set.phase-17-village-visuals.v1'
  ]);
  const PRODUCTION_ENABLED=false;
  const copy=value=>JSON.parse(JSON.stringify(value));
  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);for(const child of Object.values(value))freeze(child)}return value};
  const validId=value=>typeof value==='string'&&/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/.test(value)&&!value.split(/[.-]/).some(part=>['__proto__','prototype','constructor','toJSON'].includes(part));
  const unique=values=>new Set(values).size===values.length;

  const CHAPTERS=freeze([
    ['story.book1.prologue','Prologue · The Waystone Call',1,[]],
    ['story.book1.chapter1.a-road-worth-keeping','Chapter I · A Road Worth Keeping',1,['broken-roads-1','broken-roads-2']],
    ['story.book1.chapter2.promises-with-teeth','Chapter II · Promises with Teeth',2,['broken-roads-3','broken-roads-4']],
    ['story.book1.chapter3.divided-claims','Chapter III · Divided Claims',3,['broken-roads-5','broken-roads-6']],
    ['story.book1.chapter4.roads-between-worlds','Chapter IV · Roads Between Worlds',4,['broken-roads-7','broken-roads-8','broken-roads-9']],
    ['story.book1.finale','Finale · The First Covenant',5,['broken-roads-10']]
  ].map(([id,title,rankGate,stageIds])=>({id,title,definitionVersion:1,rankGate,stageIds})));

  const STAGE_MAPPINGS=freeze([
    ['broken-roads-1','Village Toll','story.book1.chapter1.a-road-worth-keeping','story.book1.chapter1.village-toll.intro','story.book1.chapter1.village-toll.resolution'],
    ['broken-roads-2','Merchant Dispute','story.book1.chapter1.a-road-worth-keeping','story.book1.chapter1.merchant-dispute.intro','story.book1.chapter1.merchant-dispute.resolution'],
    ['broken-roads-3','Broken Contract','story.book1.chapter2.promises-with-teeth','story.book1.chapter2.broken-contract.intro','story.book1.chapter2.broken-contract.resolution'],
    ['broken-roads-4','Old Road Ambush','story.book1.chapter2.promises-with-teeth','story.book1.chapter2.old-road-ambush.intro','story.book1.chapter2.old-road-ambush.resolution'],
    ['broken-roads-5','Council of Ash','story.book1.chapter3.divided-claims','story.book1.chapter3.council-of-ash','story.book1.chapter3.council-of-ash.resolution'],
    ['broken-roads-6','River Accord','story.book1.chapter3.divided-claims','story.book1.chapter3.river-accord.intro','story.book1.chapter3.river-accord.resolution'],
    ['broken-roads-7','Quarry Claim','story.book1.chapter4.roads-between-worlds','story.book1.chapter4.quarry-claim.intro','story.book1.chapter4.quarry-claim.resolution'],
    ['broken-roads-8','Skybridge Terms','story.book1.chapter4.roads-between-worlds','story.book1.chapter4.skybridge-terms.intro','story.book1.chapter4.skybridge-terms.resolution'],
    ['broken-roads-9','Harbor Compact','story.book1.chapter4.roads-between-worlds','story.book1.chapter4.harbor-compact.intro','story.book1.chapter4.harbor-compact.resolution'],
    ['broken-roads-10','The First Covenant','story.book1.finale','story.book1.finale.first-covenant.intro','story.book1.finale.first-covenant']
  ].map(([stageId,stageName,chapterId,introSceneId,resolutionSceneId],index)=>({stageId,stageName,chapterId,introSceneId,resolutionSceneId,ordinal:index+1})));

  const ACTOR_ROWS=freeze([
    ['fellow.cael','Hold the line long enough for everyone to cross.','story.book1.prologue.council',[]],
    ['fellow.lyra','A road becomes real when people can return by it.','story.book1.prologue.waystone-call',[]],
    ['fellow.orin','A careful drill turns panic into a choice.','facility.training.first-drill',['facility.training.first-drill']],
    ['fellow.selene','Records matter most when the rain has blurred every footprint.','story.book1.chapter2.records-in-rain',['facility.archives.first-research']],
    ['fellow.rook','Bring me a sound commission and I will give it a sound edge.','facility.forge.first-commission',['facility.forge.first-commission']],
    ['fellow.mira','A gate is a promise made in both directions.','facility.gatehouse.first-road-watch',['facility.gatehouse.first-road-watch']],
    ['fellow.zamorak','Power without terms is only another kind of weather.','story.book1.rank2.roadbound-arrivals',[]],
    ['fellow.darrow','We can argue after the road is safe enough to carry the argument.','story.book1.rank2.roadbound-arrivals',[]],
    ['fellow.deadpool','I can keep watch and carry supplies while the road crews work.','story.book1.rank2.roadbound-arrivals',['dialogue.facility.restaurant.deadpool.named-visitor']],
    ['fellow.star-lord','Every route has a rhythm. Find it before you rush the turn.','story.book1.rank3.crossroads-arrivals',[]],
    ['fellow.iron-man','If the bridge fails on paper, it fails before anyone steps on it.','story.book1.rank3.crossroads-arrivals',[]],
    ['fellow.daredevil','Listen past the loudest demand; the real dispute is usually quieter.','story.book1.rank3.crossroads-arrivals',[]],
    ['fellow.thor','Let the sky hear that this crossing belongs to travelers, not fear.','story.book1.rank4.skybridge-arrivals',[]],
    ['fellow.captain-america','A fair route needs rules that still work when no hero is present.','story.book1.rank4.skybridge-arrivals',[]],
    ['fellow.spider-man','I checked the cables twice. The third check is for my peace of mind.','story.book1.rank4.skybridge-arrivals',[]],
    ['fellow.wolverine','Keep the terms short and the exits clear.','story.book1.rank5.covenant-arrivals',['facility.gatehouse.first-road-watch']],
    ['fellow.obi-wan','The strongest agreement leaves room for tomorrow’s wiser answer.','story.book1.rank5.covenant-arrivals',['facility.schoolhouse.first-mentor-lesson']],
    ['fellow.anakin','If we know the risk, we can build for it instead of pretending it is gone.','story.book1.rank5.covenant-arrivals',['facility.forge.first-commission']],
    ['family.elara','Prosperity is trust made visible in ordinary work.','story.book1.prologue.council',[]],
    ['family.tamsin','One safe arrival is already a reason to set another place at the table.','story.book1.chapter1.village-toll.resolution',[]],
    ['family.isolde','Write the promise clearly enough that strangers can defend it.','story.book1.prologue.council',[]],
    ['family.violet','A broken contract leaves clues in what each side refuses to name.','story.book1.chapter2.records-in-rain',[]],
    ['family.virginia','A council earns authority by explaining what it will not take.','story.book1.chapter3.council-of-ash',[]],
    ['family.captain-marvel','Training should leave people steadier, not merely tired.','facility.training.starward-drill',['facility.training.starward-drill']],
    ['family.scarlet-witch','A careful remedy begins by admitting what remains uncertain.','facility.apothecary.possibility-case',['facility.apothecary.possibility-case']],
    ['family.ahsoka','Teach the question as carefully as the answer.','story.book1.interlude.young-futures',['facility.schoolhouse.first-mentor-lesson']],
    ['family.rey','Nothing is scrap until we understand why it was left behind.','story.book1.chapter4.quarry-claim.resolution',['facility.workshop.salvage-order']],
    ['family.syl','Small promises are how a Village learns to believe the large ones.','story.book1.interlude.small-promises',[]],
    ['family.shallan','Maps show decisions as much as distances.','story.book1.interlude.quiet-roads',['facility.archives.light-map']],
    ['family.yennefer','Precision is kindness when a mistake would cost someone time.','story.book1.interlude.quiet-roads',['facility.apothecary.precise-remedy']],
    ['family.jaina','A harbor meal can settle what a formal chamber cannot.','story.book1.interlude.open-table',['facility.restaurant.harbor-guest']],
    ['family.tyrande','Cultivation rewards attention before it rewards effort.','story.book1.chapter4.harbor-compact.resolution',['facility.gardens.first-cultivation']],
    ['family.shadowheart','Trust is quieter than certainty, but it lasts longer.','story.book1.interlude.quiet-roads',['facility.hearth.quiet-trust']],
    ['family.amara','A petition deserves an answer that names who bears the cost.','facility.command.resolve-petition',['facility.command.resolve-petition']],
    ['family.aerith','Growing things teach patience without asking permission.','story.book1.interlude.young-futures',['facility.schoolhouse.growing-things']],
    ['family.tifa','A warm room is not a small thing when the road has been cold.','story.book1.interlude.open-table',['facility.restaurant.opening-service']],
    ['family.hermione','A good lesson plan leaves space for a pupil to surprise it.','story.book1.interlude.young-futures',['facility.schoolhouse.lesson-plan']],
    ['family.misty','River travelers remember the welcome longer than the weather.','story.book1.chapter4.harbor-compact.intro',['facility.gatehouse.river-caravan']]
  ].map(([actorId,quote,primaryContentId,facilityHookIds])=>({actorId,quote,primaryContentId,facilityHookIds,phase13PrimaryPreserved:true,phase1516HooksPreserved:true})));
  const ACTOR_BY_ID=new Map(ACTOR_ROWS.map(item=>[item.actorId,item]));

  const SCENE_ROWS=freeze([
    ['story.book1.prologue.waystone-call','story.book1.prologue','prologue','The Waystone Call',{type:'new-game-safe-visit'},['fellow.lyra']],
    ['story.book1.prologue.council','story.book1.prologue','prologue','Council at the Waystone',{type:'scene-resolved',sceneId:'story.book1.prologue.waystone-call'},['fellow.cael','family.elara','family.isolde']],
    ['story.book1.chapter1.village-toll.intro','story.book1.chapter1.a-road-worth-keeping','stage-intro','The Village Toll',{type:'before-first-clear',stageId:'broken-roads-1'},['fellow.lyra','fellow.cael']],
    ['story.book1.chapter1.village-toll.resolution','story.book1.chapter1.a-road-worth-keeping','stage-resolution','A Road Opened',{type:'after-first-clear-commit',stageId:'broken-roads-1'},['family.tamsin','fellow.lyra']],
    ['story.book1.chapter1.merchant-dispute.intro','story.book1.chapter1.a-road-worth-keeping','stage-intro','Terms at the Crossroads',{type:'before-first-clear',stageId:'broken-roads-2'},['fellow.cael','family.isolde']],
    ['story.book1.chapter1.merchant-dispute.resolution','story.book1.chapter1.a-road-worth-keeping','chapter-resolution','A Market Reopened',{type:'after-first-clear-commit',stageId:'broken-roads-2'},['fellow.lyra','family.elara']],
    ['story.book1.rank2.roadbound-arrivals','story.book1.chapter2.promises-with-teeth','rank-arrival','Roadbound Arrivals',{type:'rank-reached',rank:2},['fellow.zamorak','fellow.darrow','fellow.deadpool']],
    ['story.book1.chapter2.broken-contract.intro','story.book1.chapter2.promises-with-teeth','stage-intro','The Broken Contract',{type:'before-first-clear',stageId:'broken-roads-3'},['fellow.darrow','family.violet']],
    ['story.book1.chapter2.broken-contract.resolution','story.book1.chapter2.promises-with-teeth','stage-resolution','What the Ink Remembered',{type:'after-first-clear-commit',stageId:'broken-roads-3'},['family.violet','fellow.lyra']],
    ['story.book1.chapter2.records-in-rain','story.book1.chapter2.promises-with-teeth','bridge','Records in Rain',{type:'scene-resolved',sceneId:'story.book1.chapter2.broken-contract.resolution'},['family.violet','fellow.selene']],
    ['story.book1.chapter2.old-road-ambush.intro','story.book1.chapter2.promises-with-teeth','stage-intro','The Old Road',{type:'before-first-clear',stageId:'broken-roads-4'},['fellow.cael','fellow.zamorak']],
    ['story.book1.chapter2.old-road-ambush.resolution','story.book1.chapter2.promises-with-teeth','chapter-resolution','No Toll in Blood',{type:'after-first-clear-commit',stageId:'broken-roads-4'},['fellow.darrow','family.violet']],
    ['story.book1.rank3.crossroads-arrivals','story.book1.chapter3.divided-claims','rank-arrival','Crossroads Arrivals',{type:'rank-reached',rank:3},['fellow.star-lord','fellow.iron-man','fellow.daredevil']],
    ['story.book1.chapter3.council-of-ash','story.book1.chapter3.divided-claims','stage-intro','Council of Ash',{type:'before-first-clear',stageId:'broken-roads-5'},['family.virginia','fellow.daredevil']],
    ['story.book1.chapter3.council-of-ash.resolution','story.book1.chapter3.divided-claims','stage-resolution','The Cost Named Aloud',{type:'after-first-clear-commit',stageId:'broken-roads-5'},['family.virginia','fellow.cael']],
    ['story.book1.chapter3.river-accord.intro','story.book1.chapter3.divided-claims','stage-intro','The River Accord',{type:'before-first-clear',stageId:'broken-roads-6'},['fellow.daredevil','family.virginia']],
    ['story.book1.chapter3.river-accord.resolution','story.book1.chapter3.divided-claims','chapter-resolution','Two Banks, One Crossing',{type:'after-first-clear-commit',stageId:'broken-roads-6'},['family.virginia','fellow.lyra']],
    ['story.book1.interlude.small-promises','story.book1.chapter3.divided-claims','optional-interlude','Small Promises',{type:'safe-visit-after-scene',sceneId:'story.book1.chapter3.river-accord.resolution'},['family.syl','family.elara']],
    ['story.book1.rank4.skybridge-arrivals','story.book1.chapter4.roads-between-worlds','rank-arrival','Skybridge Arrivals',{type:'rank-reached',rank:4},['fellow.thor','fellow.captain-america','fellow.spider-man']],
    ['story.book1.chapter4.quarry-claim.intro','story.book1.chapter4.roads-between-worlds','stage-intro','The Quarry Claim',{type:'before-first-clear',stageId:'broken-roads-7'},['fellow.iron-man','fellow.captain-america']],
    ['story.book1.chapter4.quarry-claim.resolution','story.book1.chapter4.roads-between-worlds','stage-resolution','Stone for Both Shores',{type:'after-first-clear-commit',stageId:'broken-roads-7'},['fellow.iron-man','family.rey']],
    ['story.book1.chapter4.skybridge-terms.intro','story.book1.chapter4.roads-between-worlds','stage-intro','Terms Above the Clouds',{type:'before-first-clear',stageId:'broken-roads-8'},['fellow.thor','fellow.spider-man']],
    ['story.book1.chapter4.skybridge-terms.resolution','story.book1.chapter4.roads-between-worlds','stage-resolution','The Bridge Holds',{type:'after-first-clear-commit',stageId:'broken-roads-8'},['fellow.captain-america','fellow.mira']],
    ['story.book1.interlude.open-table','story.book1.chapter4.roads-between-worlds','optional-interlude','An Open Table',{type:'safe-visit-after-scene',sceneId:'story.book1.chapter4.skybridge-terms.resolution'},['family.tifa','family.jaina','family.tamsin']],
    ['story.book1.chapter4.harbor-compact.intro','story.book1.chapter4.roads-between-worlds','stage-intro','The Harbor Compact',{type:'before-first-clear',stageId:'broken-roads-9'},['fellow.star-lord','family.misty']],
    ['story.book1.chapter4.harbor-compact.resolution','story.book1.chapter4.roads-between-worlds','chapter-resolution','Caravans at Dawn',{type:'after-first-clear-commit',stageId:'broken-roads-9'},['family.misty','family.tyrande']],
    ['story.book1.interlude.young-futures','story.book1.chapter4.roads-between-worlds','optional-interlude','Young Futures',{type:'safe-visit-after-scene',sceneId:'story.book1.chapter4.harbor-compact.resolution'},['family.ahsoka','family.aerith','family.hermione']],
    ['story.book1.rank5.covenant-arrivals','story.book1.finale','rank-arrival','Covenant Arrivals',{type:'rank-reached',rank:5},['fellow.wolverine','fellow.obi-wan','fellow.anakin']],
    ['story.book1.interlude.quiet-roads','story.book1.finale','optional-interlude','Quiet Roads',{type:'safe-visit-after-scene',sceneId:'story.book1.rank5.covenant-arrivals'},['family.shadowheart','family.shallan','family.yennefer']],
    ['story.book1.finale.first-covenant.intro','story.book1.finale','stage-intro','Before the Covenant',{type:'before-first-clear',stageId:'broken-roads-10'},['fellow.lyra','fellow.cael','family.virginia']],
    ['story.book1.finale.first-covenant','story.book1.finale','book-resolution','The First Covenant',{type:'after-first-clear-commit',stageId:'broken-roads-10'},['fellow.lyra','fellow.cael','family.elara','family.isolde']]
  ]);
  const SCENES=freeze(SCENE_ROWS.map(([id,chapterId,kind,title,trigger,speakerActorIds])=>({
    id,chapterId,kind,title,trigger,definitionVersion:1,speakerActorIds,
    beats:speakerActorIds.map((actorId,index)=>({id:String(index+1).padStart(2,'0'),actorId,text:ACTOR_BY_ID.get(actorId)?.quote||'Everstead keeps the road by keeping its word.'})),
    choiceMode:'none',replayable:true,rewardDefinitionId:null
  })));

  const ARRIVAL_ORDER=freeze([
    {rank:2,sceneId:'story.book1.rank2.roadbound-arrivals',actorIds:['fellow.zamorak','fellow.darrow','fellow.deadpool'],grantsRoster:false},
    {rank:3,sceneId:'story.book1.rank3.crossroads-arrivals',actorIds:['fellow.star-lord','fellow.iron-man','fellow.daredevil'],grantsRoster:false},
    {rank:4,sceneId:'story.book1.rank4.skybridge-arrivals',actorIds:['fellow.thor','fellow.captain-america','fellow.spider-man'],grantsRoster:false},
    {rank:5,sceneId:'story.book1.rank5.covenant-arrivals',actorIds:['fellow.wolverine','fellow.obi-wan','fellow.anakin'],grantsRoster:false}
  ]);

  const REWARDS=freeze(['chapter1','chapter2','chapter3','chapter4','completion'].map(suffix=>({
    id:`story.reward.book1.${suffix}`,definitionVersion:1,sourceType:'opportunity.story.reward',rewards:null,
    enablementStatus:'blocked-economy',productionEnabled:false,claimMode:'manual',expires:false,immutableFinalizer:'phase15-v2-registered-only'
  })));

  const FACILITY_UNLOCKS=freeze([
    ['facility.waystone','central-crystal',15,'story.book1.prologue.waystone-call','capability.waystone-legacy-hub.v1','story.book1.prologue.waystone-call'],
    ['facility.restaurant','western-plaza-restaurant',16,'story.book1.chapter1.village-toll.resolution','capability.restaurant-service.v1','facility.restaurant.opening-service'],
    ['facility.apothecary','eastern-plaza-apothecary',18,'story.book1.chapter2.records-in-rain','capability.apothecary-cases.v1','facility.apothecary.possibility-case'],
    ['facility.schoolhouse','eastern-plaza-schoolhouse',19,'story.book1.chapter3.river-accord.resolution','capability.schoolhouse-lessons.v1','facility.schoolhouse.first-mentor-lesson'],
    ['facility.command-center','upper-left-hall',20,'story.book1.chapter3.council-of-ash.resolution','capability.command-petitions.v1','facility.command.resolve-petition'],
    ['facility.archives','upper-right-tower',20,'story.book1.chapter2.records-in-rain','capability.archives-research.v1','facility.archives.first-research'],
    ['facility.training-grounds','lower-left-arena',20,'story.book1.chapter4.quarry-claim.resolution','capability.training-drills.v1','facility.training.first-drill'],
    ['facility.hearth','lower-right-manor',20,'story.book1.chapter3.river-accord.resolution','capability.hearth-gatherings.v1','facility.hearth.quiet-trust'],
    ['facility.market-workshop','western-plaza-workshop',21,'story.book1.chapter4.quarry-claim.resolution','capability.market-workshop-orders.v1','facility.workshop.salvage-order'],
    ['facility.gatehouse','lower-bridge-entrance',21,'story.book1.chapter4.skybridge-terms.resolution','capability.gatehouse-road-events.v1','facility.gatehouse.first-road-watch'],
    ['facility.gardens','lower-right-gardens',21,'story.book1.chapter4.harbor-compact.resolution','capability.gardens-cultivation.v1','facility.gardens.first-cultivation'],
    ['facility.forge','eastern-edge-forge',21,'story.book1.rank5.covenant-arrivals','capability.forge-commissions.v1','facility.forge.first-commission']
  ].map(([id,mapAnchor,targetPhase,discoveryContentId,requiredCapabilityId,openingContentId])=>({id,mapAnchor,targetPhase,discoveryContentId,requiredCapabilityId,openingContentId})));
  const FACILITY_SCOPED_ANCHOR_ALIASES=freeze([{scope:'facility.restaurant',alias:'western-plaza',canonical:'western-plaza-restaurant'}]);

  const VISUAL_CHANGES=freeze([
    ['village-change.waystone-awakened','story.book1.prologue.waystone-call'],
    ['village-change.first-road-open','story.book1.chapter1.village-toll.resolution'],
    ['village-change.western-plaza-open','story.book1.chapter1.merchant-dispute.resolution'],
    ['village-change.archives-lanterns','story.book1.chapter2.records-in-rain'],
    ['village-change.council-banners','story.book1.chapter3.council-of-ash.resolution'],
    ['village-change.bridge-traffic','story.book1.chapter4.skybridge-terms.resolution'],
    ['village-change.harbor-caravans','story.book1.chapter4.harbor-compact.resolution'],
    ['village-change.first-covenant','story.book1.finale.first-covenant']
  ].map(([id,sourceContentId])=>({id,sourceContentId,artTreatmentId:null,cssTreatmentId:null,fallback:`${id.split('.').at(-1).replace(/-/g,' ')}.`,derivedOnly:true})));

  const TUTORIAL_IDS=freeze([
    'tutorial.story.scene-controls.first-scene','tutorial.story.objective.first-covenant','tutorial.player.rank-path',
    'tutorial.rank.new-fellows.rank-2','tutorial.rank.new-fellows.rank-3','tutorial.rank.new-fellows.rank-4','tutorial.rank.new-fellows.rank-5',
    'tutorial.chronicle.replay-and-log','tutorial.story.objective.chapter-change','tutorial.story.book1-completion-village-change',
    'tutorial.facility.board.discover-hotspots','tutorial.legacy.claim.major'
  ]);
  const TUTORIALS=freeze(TUTORIAL_IDS.map((id,index)=>({id,definitionVersion:1,priority:index+1,skippable:true,replayable:true,loggable:true,blocking:false,reward:null})));

  const PLAYER_CHARACTER=freeze({
    id:'player.wayfarer',kind:'player-character',avatarId:'wayfarer',rankSource:'player.rank-and-rankExp',
    titleProfileAsset:{assetId:'asset.player.wayfarer.profile-full.v1',sha256:'a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf',width:1024,height:1536,mode:'rgb-full-background',use:'title-profile-and-framed-campaign'},
    campaignAllowedModes:['approved-transparent-cutout','framed-background-static'],
    campaignDefaultUntilCutoutApproved:'framed-background-static',
    campaignFallbackMode:'original-everstead-silhouette',
    excludedDomains:['fellow-roster','family-roster','companion-roster','roster-count','shards','rarity','assignments','facility-speaker-eligibility','combat-power'],
    inRosterCounts:false,facilitySpeakerEligible:false
  });

  const STORY_STATE_KEYS=freeze(['schemaVersion','activeBookId','completedSceneIds','skippedSceneIds','completedBookIds','queuedSceneItems','chronicleRecords','recapEligibleSceneIds','acknowledgedVillageChangeIds','activeDefinitionSetIds']);
  const createStoryState=()=>({schemaVersion:1,activeBookId:BOOK_ID,completedSceneIds:[],skippedSceneIds:[],completedBookIds:[],queuedSceneItems:[],chronicleRecords:[],recapEligibleSceneIds:[],acknowledgedVillageChangeIds:[],activeDefinitionSetIds:[...DEFINITION_SET_IDS]});
  const sceneById=id=>SCENES.find(item=>item.id===id)||null;
  const validateStoryState=value=>{
    const errors=[],need=(pass,path)=>{if(!pass)errors.push(path)};
    need(value&&typeof value==='object'&&!Array.isArray(value),'storyV1');if(!value||typeof value!=='object')return{ok:false,errors};
    need(Object.keys(value).length===STORY_STATE_KEYS.length&&STORY_STATE_KEYS.every(key=>Object.hasOwn(value,key)),'storyV1.keys');
    need(value.schemaVersion===1,'storyV1.schemaVersion');need(value.activeBookId===BOOK_ID||value.activeBookId===null,'storyV1.activeBookId');
    need(JSON.stringify(value.activeDefinitionSetIds)===JSON.stringify(DEFINITION_SET_IDS),'storyV1.activeDefinitionSetIds');
    const sceneIds=new Set(SCENES.map(item=>item.id)),arrays=['completedSceneIds','skippedSceneIds','recapEligibleSceneIds'];
    for(const key of arrays)need(Array.isArray(value[key])&&unique(value[key])&&value[key].every(id=>sceneIds.has(id)),`storyV1.${key}`);
    need(value.skippedSceneIds.every(id=>value.completedSceneIds.includes(id)),'storyV1.skippedSubset');
    need(Array.isArray(value.completedBookIds)&&unique(value.completedBookIds)&&value.completedBookIds.every(id=>id===BOOK_ID),'storyV1.completedBookIds');
    need(!value.completedBookIds.includes(BOOK_ID)||value.completedSceneIds.includes('story.book1.finale.first-covenant'),'storyV1.bookFinale');
    need(Array.isArray(value.acknowledgedVillageChangeIds)&&unique(value.acknowledgedVillageChangeIds)&&value.acknowledgedVillageChangeIds.every(id=>VISUAL_CHANGES.some(item=>item.id===id)),'storyV1.acknowledgedVillageChangeIds');
    need(Array.isArray(value.queuedSceneItems)&&unique(value.queuedSceneItems.map(item=>item.queueId))&&unique(value.queuedSceneItems.map(item=>item.sceneId))&&value.queuedSceneItems.every(item=>item&&validId(item.queueId)&&sceneIds.has(item.sceneId)&&item.definitionVersion===1&&['fresh','stage-resolution','rank-arrival','optional-interlude','migrated-recap'].includes(item.reason)&&Number.isSafeInteger(item.eligibleRevision)&&item.eligibleRevision>=0&&Number.isSafeInteger(item.queuedAt)&&item.queuedAt>=0&&(item.predecessorSceneId===null||sceneIds.has(item.predecessorSceneId))&&!value.completedSceneIds.includes(item.sceneId)),'storyV1.queuedSceneItems');
    need(Array.isArray(value.chronicleRecords)&&unique(value.chronicleRecords.map(item=>item.recordId))&&unique(value.chronicleRecords.map(item=>item.sceneId))&&value.chronicleRecords.every(item=>item&&validId(item.recordId)&&sceneIds.has(item.sceneId)&&item.definitionVersion===1&&['watched','skipped','migrated-recap'].includes(item.resolution)&&Number.isSafeInteger(item.resolvedRevision)&&item.resolvedRevision>=0&&Number.isSafeInteger(item.resolvedAt)&&item.resolvedAt>=0&&(item.choiceId===null||validId(item.choiceId))&&(item.rewardOfferId===null||validId(item.rewardOfferId))&&value.completedSceneIds.includes(item.sceneId)),'storyV1.chronicleRecords');
    need(value.completedSceneIds.every(id=>value.chronicleRecords.some(item=>item.sceneId===id)),'storyV1.completedSceneRecords');
    return{ok:errors.length===0,errors};
  };

  function validateDefinitions(){
    const errors=[];if(CHAPTERS.length!==6)errors.push('chapters');if(STAGE_MAPPINGS.length!==10)errors.push('stageMappings');if(SCENES.length!==31||!unique(SCENES.map(item=>item.id)))errors.push('scenes');if(ACTOR_ROWS.length!==38||!unique(ACTOR_ROWS.map(item=>item.actorId)))errors.push('cast');if(FACILITY_UNLOCKS.length!==12||!unique(FACILITY_UNLOCKS.map(item=>item.mapAnchor)))errors.push('facilities');if(VISUAL_CHANGES.length!==8)errors.push('visualChanges');if(TUTORIALS.length!==12)errors.push('tutorials');if(REWARDS.some(item=>item.rewards!==null||item.productionEnabled!==false))errors.push('rewards');if(SCENES.some(item=>item.speakerActorIds.some(id=>!ACTOR_BY_ID.has(id))))errors.push('speakers');return{ok:errors.length===0,errors};
  }

  const api=freeze({configId:CONFIG_ID,bridgeVersion:BRIDGE_VERSION,productionEnabled:PRODUCTION_ENABLED,book:{id:BOOK_ID,title:'Book I — The First Covenant',definitionVersion:1},definitionSetIds:DEFINITION_SET_IDS,chapters:CHAPTERS,stageMappings:STAGE_MAPPINGS,scenes:SCENES,arrivalOrder:ARRIVAL_ORDER,rewards:REWARDS,facilities:FACILITY_UNLOCKS,facilityScopedAnchorAliases:FACILITY_SCOPED_ANCHOR_ALIASES,visualChanges:VISUAL_CHANGES,tutorials:TUTORIALS,cast:ACTOR_ROWS,playerCharacter:PLAYER_CHARACTER,storyStateKeys:STORY_STATE_KEYS,createStoryState,validateStoryState,validateDefinitions,sceneById,copy,validId});
  const checked=api.validateDefinitions();if(!checked.ok)throw new Error(`Phase 17 Book I definitions invalid: ${checked.errors.join(', ')}`);
  Object.defineProperty(root,'EVERSTEAD_PHASE17_BOOK1',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);

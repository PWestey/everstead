(function installEversteadPhaseThirteen(root){
  'use strict';

  const CONFIG_ID='phase-13-first-covenant-v1';
  const ID_PATTERN=/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/;
  const CONTROLS=Object.freeze(['next','back','skip','log']);
  const scene=(id,title,chronicleEntryId,beats,{trigger,claim=null}={})=>({
    id,title,chronicleEntryId,definitionVersion:1,trigger,beats,controls:CONTROLS,
    skippable:true,replayable:true,loggable:true,playbackReward:null,claim
  });
  const beat=(id,roster,speakerId,speakerName,text,intent='establish')=>({id,speaker:{roster,id:speakerId,name:speakerName},text,intent});

  const SCENES=Object.freeze([
    scene('story.book1.prologue.waystone-call','The Waystone Call','chronicle.book1.prologue.waystone-call',[
      beat('01','fellow','lyra','Tavi','The eastern light is gone. Not dimmed—gone, as though the road itself forgot Everstead.'),
      beat('02','fellow','lyra','Tavi','The Waystone still answers, but only when someone gives it a promise strong enough to carry.'),
      beat('03','fellow','lyra','Tavi','We are calling that promise the First Covenant: keep faith here, and reopen the Broken Roads beyond us.'),
      beat('04','fellow','lyra','Tavi','Come see the Village, Wayfarer. Every Oath you keep gives us another piece of the way forward.','invite')
    ],{trigger:{event:'surface.opened',surface:'village',first:true}}),
    scene('story.book1.prologue.council','Council at the Waystone','chronicle.book1.prologue.council',[
      beat('01','fellow','lyra','Tavi','We cannot repair every road today. We can decide what Everstead stands for while we repair the first one.'),
      beat('02','fellow','cael','Kaladin','Safe passage comes first. A road is not open if only the strongest can use it.','warn'),
      beat('03','family','elara','Vex’ahlia','Supplies are already thinning. Whatever we promise must bring honest trade back through the gates.'),
      beat('04','family','tamsin','Rumi','There are people between routes who cannot simply wait for our plans to become perfect.','reassure'),
      beat('05','family','isolde','Hera Syndulla','Then we record the terms, the work, and the cost. A covenant survives because everyone can see what was agreed.','invite')
    ],{trigger:{event:'surface.opened',surface:'village',after:'story.book1.prologue.waystone-call'}}),
    scene('story.book1.chapter1.village-toll.intro','The Village Toll','chronicle.book1.chapter1.village-toll.intro',[
      beat('01','fellow','lyra','Tavi','The first road is held at a village toll. They expect another armed demand from Everstead.'),
      beat('02','fellow','cael','Kaladin','We go prepared, but we do not make preparation look like occupation.'),
      beat('03','family','elara','Vex’ahlia','Pay the expedition cost only when the Fellowship has the Power to finish what it starts.'),
      beat('04','fellow','lyra','Tavi','The Campaign preview shows the exact Gold and total joined-roster Power required.'),
      beat('05','fellow','cael','Kaladin','Meet both requirements, then begin. We will earn passage without taking it.','invite')
    ],{trigger:{event:'campaign.preclear-requested',stageId:'broken-roads-1'}}),
    scene('story.book1.chapter1.village-toll.resolution','A Road Opened','chronicle.book1.chapter1.village-toll.resolution',[
      beat('01','fellow','lyra','Tavi','The barrier is down. The first cart crossed toward Everstead before the dust had settled.'),
      beat('02','family','tamsin','Rumi','Mara found her brother with the caravan. One road restored is already more than a mark on a map.','reassure'),
      beat('03','fellow','cael','Kaladin','The passage is provisional, but it was agreed—not seized. That difference will matter.'),
      beat('04','fellow','lyra','Tavi','The next dispute waits where merchants have stopped trusting one another.'),
      beat('05','family','tamsin','Rumi','Record this first. Then we help them remember how to meet halfway.','invite')
    ],{trigger:{event:'campaign.first-clear-committed',stageId:'broken-roads-1'},claim:{id:'qa.phase13.claim.first-covenant.v1',sourceType:'opportunity.story.reward',rewards:[{kind:'gold',targetId:null,amount:1500}]}}),
    scene('story.book1.rank2.roadbound-arrivals','Roadbound Arrivals','chronicle.book1.rank2.roadbound-arrivals',[
      beat('01','fellow','darrow','Darrow','Your road reached farther than rumor suggested. We came to make sure the next one does too.'),
      beat('02','fellow','zamorak','Zamorak','Influence gathers whether you intend it or not. Everstead should decide how it will be used.'),
      beat('03','fellow','deadpool','Deadpool','I brought practical skills, excellent timing, and a strict policy against standing in the dramatic doorway all day.'),
      beat('04','fellow','darrow','Darrow','Three more hands. Three different arguments. One road forward.'),
      beat('05','fellow','zamorak','Zamorak','Then let the Covenant become deliberate.','invite')
    ],{trigger:{event:'player.rank-crossed',rank:2}})
  ]);

  const PHASE_13_TUTORIAL_IDS=Object.freeze([
    'tutorial.story.scene-controls.first-scene','tutorial.story.objective.first-covenant','tutorial.navigation.village-basics','tutorial.gold.pending-first-claim','tutorial.gold.offline-first-claim','tutorial.oaths.first-completion','tutorial.oaths.boost-and-undo','tutorial.oaths.create-and-schedule','tutorial.oaths.repeat-schedules','tutorial.village.building.first-upgrade','tutorial.fellows.roster-and-profile','tutorial.fellows.exp-level-shards','tutorial.fellows.rarity.first-ascension','tutorial.fellows.bond-family-companion','tutorial.power.roles-types-context','tutorial.power.total-roster.first-check','tutorial.adventure.fellow-campaign.first-stage','tutorial.adventure.fellow-campaign.replay-targets','tutorial.rank.new-fellows.rank-2','tutorial.player.rank-path','tutorial.family.assignment.first-building','tutorial.family.roster-and-profile','tutorial.family.gifts-and-intimacy','tutorial.family.shards-and-rarity','tutorial.family.offline-drops','tutorial.companions.roster-and-power','tutorial.companions.assignment.first-link','tutorial.companions.progression','tutorial.companions.campaign.first-stage','tutorial.companions.tower.first-clear','tutorial.companions.tower.idle-claim','tutorial.companions.mastery','tutorial.relics.first-stone','tutorial.relics.equip-first','tutorial.more.codex-first-visit','tutorial.more.save-recovery','tutorial.chronicle.replay-and-log','tutorial.legacy.tracks.first-progress','tutorial.legacy.claim.first-ready','tutorial.legacy.claim.major','tutorial.legacy.feats.first-feat'
  ]);
  const TUTORIAL_COVERAGE_IDS=Object.freeze([
    ...PHASE_13_TUTORIAL_IDS.slice(0,20),'tutorial.rank.new-fellows.rank-3','tutorial.rank.new-fellows.rank-4','tutorial.rank.new-fellows.rank-5',...PHASE_13_TUTORIAL_IDS.slice(20,34),'tutorial.adventure.expedition.first-push','tutorial.adventure.expedition.idle-claim','tutorial.adventure.expedition.might',...PHASE_13_TUTORIAL_IDS.slice(34,37),'tutorial.story.objective.chapter-change','tutorial.story.book1-completion-village-change',...PHASE_13_TUTORIAL_IDS.slice(37),
    'tutorial.facility.board.discover-hotspots','tutorial.facility.opportunities.banking','tutorial.facility.claim.first-ready','tutorial.restaurant.first-customer','tutorial.restaurant.recipes-and-stations','tutorial.restaurant.first-claim','tutorial.restaurant.reputation','tutorial.restaurant.named-visitors','tutorial.facility.apothecary.first-case','tutorial.facility.apothecary.diagnosis','tutorial.facility.apothecary.mastery','tutorial.facility.schoolhouse.first-lesson','tutorial.facility.schoolhouse.pupil-progress','tutorial.facility.schoolhouse.graduation','tutorial.facility.command.first-petition','tutorial.facility.command.consequences','tutorial.facility.archives.first-research','tutorial.facility.archives.mastery','tutorial.facility.training.first-drill','tutorial.facility.training.mastery','tutorial.facility.hearth.first-gathering','tutorial.facility.hearth.relationship-results','tutorial.facility.gatehouse.first-caravan','tutorial.facility.gatehouse.road-events','tutorial.facility.workshop.first-order','tutorial.facility.workshop.mastery','tutorial.facility.gardens.first-plot','tutorial.facility.gardens.harvest','tutorial.facility.forge.first-commission','tutorial.facility.forge.mastery'
  ]);
  const titleFor=id=>id.slice('tutorial.'.length).split('.').map(part=>part.replace(/-/g,' ')).map(part=>part.charAt(0).toUpperCase()+part.slice(1)).join(' · ');
  const bodyFor=id=>{
    if(id==='tutorial.story.scene-controls.first-scene')return 'Use Next and Back at your pace. Skip records the scene without a reward, and Log keeps every line available.';
    if(id==='tutorial.story.objective.first-covenant')return 'The Waystone objective shows the next useful First Covenant action. Story guidance never blocks Village play.';
    if(id==='tutorial.chronicle.replay-and-log')return 'Chronicle keeps watched and skipped scenes together. Replay and dialogue logs never change progress or rewards.';
    if(id.startsWith('tutorial.legacy.'))return 'Legacy records post-activation accomplishments. Ready rewards bank until you choose Claim and never expire.';
    if(id.includes('total-roster'))return 'Campaign gates use the total Power of every joined Fellow, not a selected squad.';
    return 'This lesson is available whenever you want it. Skip now or replay it later from the Tutorial Log.';
  };
  const TUTORIALS=Object.freeze(PHASE_13_TUTORIAL_IDS.map((id,index)=>Object.freeze({
    id,definitionVersion:1,priority:index+1,featureId:id.split('.').slice(1,-1).join('.'),
    speaker:Object.freeze({primary:'fellow:lyra',fallbacks:Object.freeze(['fellow:cael'])}),
    blocking:false,skippable:true,replayable:true,loggable:true,reward:null,gameplayPrerequisite:false,
    steps:Object.freeze([{id:`${id}.step.open`,title:titleFor(id),body:bodyFor(id)}])
  })));

  const OPENING_PRESENTATIONS=Object.freeze([
    {speaker:'family:elara',mode:'approved-framed',fullPortrait:'assets/portraits/family/vexahlia.webp',dialogueAsset:'assets/portraits/family/vexahlia.webp',reviewed:true,unframedFullPortrait:false},
    {speaker:'family:tamsin',mode:'approved-framed',fullPortrait:'assets/portraits/family/rumi.webp',dialogueAsset:'assets/portraits/family/rumi.webp',reviewed:true,unframedFullPortrait:false},
    {speaker:'family:isolde',mode:'approved-framed',fullPortrait:'assets/portraits/family/hera-syndulla.webp',dialogueAsset:'assets/portraits/family/hera-syndulla.webp',reviewed:true,unframedFullPortrait:false},
    {speaker:'fellow:deadpool',mode:'approved-framed',fullPortrait:'assets/portraits/fellows/deadpool.webp',dialogueAsset:'assets/portraits/fellows/deadpool.webp',reviewed:true,unframedFullPortrait:false}
  ]);
  const TRANSPARENT_SPEAKERS=Object.freeze({
    'fellow:lyra':'assets/portraits/fellows/village/tavi.png',
    'fellow:cael':'assets/portraits/fellows/village/kaladin.png',
    'fellow:darrow':'assets/portraits/fellows/village/darrow.png',
    'fellow:zamorak':'assets/portraits/fellows/village/zamorak.png'
  });
  const CHRONICLE_ENTRIES=Object.freeze(SCENES.map(item=>Object.freeze({id:item.chronicleEntryId,sceneId:item.id,title:item.title})));

  function deepFreeze(value,seen=new Set()){
    if(value===null||typeof value!=='object'||seen.has(value))return value;
    seen.add(value);for(const key of Reflect.ownKeys(value))deepFreeze(value[key],seen);return Object.freeze(value);
  }
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function validId(value){return typeof value==='string'&&ID_PATTERN.test(value)&&!value.split(/[.-]/).some(part=>['__proto__','prototype','constructor','toJSON'].includes(part))}
  function validate(){
    const errors=[],ids=new Set(),add=(id,path)=>{if(!validId(id)||ids.has(id))errors.push(path);ids.add(id)};
    for(const [index,item] of SCENES.entries()){
      add(item.id,`scenes.${index}.id`);if(!validId(item.chronicleEntryId)||item.beats.length<4||item.beats.length>8||new Set(item.beats.map(value=>value.id)).size!==item.beats.length||CONTROLS.some(control=>!item.controls.includes(control)))errors.push(`scenes.${index}.contract`);
      for(const [beatIndex,value] of item.beats.entries())if(!/^[0-9]{2}$/.test(value.id)||!['fellow','family'].includes(value.speaker.roster)||!value.speaker.id||!value.text)errors.push(`scenes.${index}.beats.${beatIndex}`);
    }
    for(const [index,item] of TUTORIALS.entries()){add(item.id,`tutorials.${index}.id`);if(item.blocking!==false||item.skippable!==true||item.replayable!==true||item.loggable!==true||item.reward!==null||item.gameplayPrerequisite!==false||!validId(item.steps[0]?.id))errors.push(`tutorials.${index}.contract`)}
    if(new Set(TUTORIAL_COVERAGE_IDS).size!==79)errors.push('tutorialCoverageIds');
    return{ok:errors.length===0,errors};
  }
  const api=deepFreeze({configId:CONFIG_ID,definitionVersion:1,scenes:SCENES,chronicleEntries:CHRONICLE_ENTRIES,tutorials:TUTORIALS,tutorialCoverageIds:TUTORIAL_COVERAGE_IDS,openingPresentations:OPENING_PRESENTATIONS,transparentSpeakers:TRANSPARENT_SPEAKERS,controls:CONTROLS,validate,copy,validId});
  if(!api.validate().ok)throw new Error('Phase 13 content definitions did not validate: '+api.validate().errors.join(', '));
  Object.defineProperty(root,'EVERSTEAD_PHASE13_FIRST_COVENANT',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);

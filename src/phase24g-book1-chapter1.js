(function installEversteadPhase24GChapterOne(root){
  'use strict';

  const AUTHORITY_ID='everstead.phase24g.book1.chapter1.v1';
  const CONTROLS=Object.freeze(['next','back','skip','log']);
  const beat=(id,roster,speakerId,speakerName,text)=>Object.freeze({
    id,
    speaker:Object.freeze({roster,id:speakerId,name:speakerName}),
    text,
    intent:'establish'
  });
  const scene=(id,title,chronicleEntryId,trigger,beats)=>Object.freeze({
    id,
    title,
    chronicleEntryId,
    definitionVersion:1,
    trigger:Object.freeze(trigger),
    beats:Object.freeze(beats),
    controls:CONTROLS,
    skippable:true,
    replayable:true,
    loggable:true,
    playbackReward:null,
    claim:null
  });

  const scenes=Object.freeze([
    scene(
      'story.book1.chapter1.merchant-dispute.intro',
      'Terms at the Crossroads',
      'chronicle.book1.chapter1.merchant-dispute.intro',
      {event:'campaign.preclear-requested',stageId:'broken-roads-2'},
      [
        beat('01','fellow','cael','Kaladin','Two merchant houses have barred the crossroads with wagons. Each says the other broke the first promise.'),
        beat('02','family','isolde','Hera Syndulla','Then we begin with what each side can still prove, not with the accusation they have repeated the longest.'),
        beat('03','fellow','cael','Kaladin','The road stays closed until both caravans can pass without turning guards into a private army.'),
        beat('04','family','isolde','Hera Syndulla','Our terms should name the price, the route, and who answers when either side fails.'),
        beat('05','fellow','cael','Kaladin','We have enough strength to hold the meeting. Now let us prove Everstead knows when not to use it.')
      ]
    ),
    scene(
      'story.book1.chapter1.merchant-dispute.resolution',
      'A Market Reopened',
      'chronicle.book1.chapter1.merchant-dispute.resolution',
      {event:'campaign.first-clear-committed',stageId:'broken-roads-2'},
      [
        beat('01','fellow','lyra','Tavi','Both caravans are moving. They kept separate ledgers, but the missing deliveries matched line for line.'),
        beat('02','family','elara','Vex\u2019ahlia','Fear made each house hoard what the other had already paid for. Clear records cost less than another barricade.'),
        beat('03','fellow','lyra','Tavi','They accepted one schedule, one witness at the crossroads, and the same penalty for either side.'),
        beat('04','family','elara','Vex\u2019ahlia','Fair terms are not soft terms. They simply leave no one powerful enough to rewrite them afterward.'),
        beat('05','fellow','lyra','Tavi','Village Toll and Merchant Dispute are settled. Chapter I belongs in the Chronicle now.')
      ]
    )
  ]);
  const chronicleEntries=Object.freeze(scenes.map(item=>Object.freeze({
    id:item.chronicleEntryId,
    sceneId:item.id,
    title:item.title
  })));
  const tutorial=Object.freeze({
    id:'tutorial.story.objective.chapter-change',
    definitionVersion:1,
    priority:1,
    featureId:'story.objective.chapter-change',
    actorName:'Tavi',
    speaker:Object.freeze({primary:'fellow:lyra',fallbacks:Object.freeze(['fellow:cael'])}),
    blocking:false,
    skippable:true,
    replayable:true,
    loggable:true,
    reward:null,
    gameplayPrerequisite:false,
    steps:Object.freeze([Object.freeze({
      id:'tutorial.story.objective.chapter-change.step.open',
      title:'A Chapter Changes the Village',
      body:'When a chapter closes, the Waystone advances to the next objective and the Village keeps visible proof of what changed. The reopened western plaza is presentation only until a later story explicitly introduces its facilities.'
    })])
  });

  const validate=()=>{
    const errors=[];
    if(scenes.length!==2)errors.push('scenes.length');
    for(const [index,item] of scenes.entries()){
      if(item.beats.length<4||item.beats.length>8)errors.push(`scenes.${index}.beats.length`);
      if(item.claim!==null||item.playbackReward!==null)errors.push(`scenes.${index}.reward`);
      if(item.skippable!==true||item.replayable!==true||item.loggable!==true)errors.push(`scenes.${index}.controls`);
      if(item.trigger.stageId!=='broken-roads-2')errors.push(`scenes.${index}.trigger`);
      if(new Set(item.beats.map(value=>value.id)).size!==item.beats.length)errors.push(`scenes.${index}.beats.ids`);
      for(const [beatIndex,value] of item.beats.entries())if(!['fellow','family'].includes(value.speaker.roster)||!value.speaker.id||!value.speaker.name||!value.text)errors.push(`scenes.${index}.beats.${beatIndex}`);
    }
    if(tutorial.id!=='tutorial.story.objective.chapter-change'||tutorial.actorName!=='Tavi'||tutorial.blocking!==false||tutorial.skippable!==true||tutorial.replayable!==true||tutorial.loggable!==true||tutorial.reward!==null||tutorial.steps.length!==1||!tutorial.steps[0].body)errors.push('tutorial');
    return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors)});
  };
  const api=Object.freeze({
    version:1,
    authorityId:AUTHORITY_ID,
    schemaVersion:14,
    chapterId:'story.book1.chapter1.a-road-worth-keeping',
    campaignStageId:'broken-roads-2',
    villageChangeId:'village-change.western-plaza-open',
    tutorialId:'tutorial.story.objective.chapter-change',
    scenes,
    chronicleEntries,
    tutorial,
    validate
  });
  const result=validate();
  if(!result.ok)throw new Error(`Phase 24G Chapter I definitions are invalid: ${result.errors.join(', ')}`);
  Object.defineProperty(root,'EVERSTEAD_PHASE24G_CHAPTER_ONE',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);

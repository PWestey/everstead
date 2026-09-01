(function installEversteadPhaseTwentyTwentyOneDefinitions(root){
  'use strict';

  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);for(const child of Object.values(value))freeze(child)}return value};
  const unique=values=>new Set(values).size===values.length;
  const validId=value=>typeof value==='string'&&/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/.test(value);
  const OFFLINE_CAP_MS=86400000;

  const FACILITIES=freeze([
    [20,'facility.command-center','Command Center','Petitions','activity.petitions','opportunity.facility.command-center.petition','upper-left-hall','capability.command-petitions.v1','story.book1.chapter3.council-of-ash.resolution','facility.command.resolve-petition','facility-progress.command-center.influence','family.virginia','tutorial.facility.command.first-petition','preserve-existing-building-production-and-family-assignment'],
    [20,'facility.archives','Archives','Research','activity.research','opportunity.facility.archives.research','upper-right-tower','capability.archives-research.v1','story.book1.chapter2.records-in-rain','facility.archives.first-research','facility-progress.archives.discovery','fellow.selene','tutorial.facility.archives.first-research','preserve-existing-building-production-and-family-assignment'],
    [20,'facility.training-grounds','Training Grounds','Drills','activity.drills','opportunity.facility.training-grounds.drill','lower-left-arena','capability.training-drills.v1','story.book1.chapter4.quarry-claim.resolution','facility.training.first-drill','facility-progress.training-grounds.readiness','fellow.orin','tutorial.facility.training.first-drill','preserve-existing-building-production-and-family-assignment'],
    [20,'facility.hearth','Hearth','Gatherings','activity.gatherings','opportunity.facility.hearth.gathering','lower-right-manor','capability.hearth-gatherings.v1','story.book1.chapter3.river-accord.resolution','facility.hearth.quiet-trust','facility-progress.hearth.community','family.elara','tutorial.facility.hearth.first-gathering','preserve-existing-building-production-and-family-assignment'],
    [21,'facility.gatehouse','Gatehouse','Road arrivals','activity.caravans-and-road-events','opportunity.facility.gatehouse.caravan','lower-bridge-entrance','capability.gatehouse-road-events.v1','story.book1.chapter4.skybridge-terms.resolution','facility.gatehouse.first-road-watch','facility-progress.gatehouse.route-trust','fellow.mira','tutorial.facility.gatehouse.first-caravan','opportunity-only-acceleration'],
    [21,'facility.market-workshop','Market & Workshop','Orders','activity.orders-and-crafting','opportunity.facility.market-workshop.order','western-plaza-workshop','capability.market-workshop-orders.v1','story.book1.chapter4.quarry-claim.resolution','facility.workshop.salvage-order','facility-progress.market-workshop.craftsmanship','fellow.iron-man','tutorial.facility.workshop.first-order','opportunity-only-acceleration'],
    [21,'facility.gardens','Gardens','Cultivation','activity.cultivation','opportunity.facility.gardens.plot','lower-right-gardens','capability.gardens-cultivation.v1','story.book1.chapter4.harbor-compact.resolution','facility.gardens.first-cultivation','facility-progress.gardens.cultivation','family.tyrande','tutorial.facility.gardens.first-plot','opportunity-only-acceleration'],
    [21,'facility.forge','Forge','Commissions','activity.relic-commissions','opportunity.facility.forge.commission','eastern-edge-forge','capability.forge-commissions.v1','story.book1.rank5.covenant-arrivals','facility.forge.first-commission','facility-progress.forge.commission-mastery','fellow.rook','tutorial.facility.forge.first-commission','opportunity-only-acceleration']
  ].map(([phase,facilityId,name,activityName,activityId,opportunityId,anchor,capabilityId,discoveryId,openingId,progressId,presenterActorId,tutorialId,passivePolicy])=>({phase,facilityId,name,activityName,activityId,opportunityId,anchor,capabilityId,discoveryId,openingId,progressId,presenterActorId,tutorialId,passivePolicy,definitionVersion:1})));

  const CHOICES=freeze({
    'command.choice.shared-road.scheduled':'Schedule shared road hours','command.choice.shared-road.open':'Keep the road openly shared','command.choice.plaza.rotating':'Rotate the plaza stalls','command.choice.plaza.fixed':'Assign fixed stall places','command.choice.river.shared':'Share river access','command.choice.river.priority':'Prioritize urgent crossings',
    'archives.evidence.route-mark':'Trace the route marks','archives.evidence.weather-note':'Compare the weather note','archives.evidence.bridge-seal':'Study the bridge seal','archives.evidence.witness-list':'Cross-check the witness list','archives.evidence.margin-oath':'Read the margin oath','archives.evidence.date-mark':'Verify the date mark','archives.evidence.maker-mark':'Identify the maker mark','archives.evidence.stone-residue':'Test the stone residue','archives.evidence.old-catalog':'Search the old catalog',
    'training.formation.paired':'Paired formation','training.formation.line':'Line formation','training.formation.guard':'Guard formation','training.formation.rotation':'Rotation formation',
    'hearth.theme.neighbors':'Invite nearby neighbors','hearth.theme.travelers':'Welcome travelers','hearth.theme.residents':'Gather Village residents','hearth.theme.trusted-company':'Keep trusted company',
    'gatehouse.reception.direct':'Receive them directly','gatehouse.reception.host':'Offer a hosted welcome','gatehouse.reception.inspect':'Inspect the arrival first',
    'workshop.fulfillment.repair':'Repair what can be saved','workshop.fulfillment.reuse':'Reuse sound materials','workshop.fulfillment.craft':'Craft a fresh solution','workshop.fulfillment.trade':'Trade for the missing part',
    'gardens.crop.road-herbs':'Plant road herbs','gardens.crop.river-greens':'Plant river greens','gardens.crop.waystone-bloom':'Plant Waystone bloom',
    'forge.work.steady':'Work steadily','forge.work.precise':'Work with precision','forge.work.economical':'Conserve materials'
  });

  const CONTENT=freeze({
    'facility.command-center':[
      ['command.petition.shared-road-use','Shared Road Use','Travelers and residents ask how the reopened road should be shared.',['command.choice.shared-road.scheduled','command.choice.shared-road.open']],
      ['command.petition.plaza-stalls','Plaza Stalls','Merchants and residents need a fair plan for the western plaza.',['command.choice.plaza.rotating','command.choice.plaza.fixed']],
      ['command.petition.river-access','River Access','Growers and caravans both need the crossing before dusk.',['command.choice.river.shared','command.choice.river.priority']]
    ],
    'facility.archives':[
      ['archives.lead.faded-road-map','The Faded Road Map','Three marks may restore a road that the rain erased.',['archives.evidence.route-mark','archives.evidence.weather-note','archives.evidence.bridge-seal'],'facility.archives.first-research'],
      ['archives.lead.covenant-fragment','The Covenant Fragment','A witness list, an oath, and a date may place this fragment.',['archives.evidence.witness-list','archives.evidence.margin-oath','archives.evidence.date-mark'],'story.book1.finale.first-covenant'],
      ['archives.lead.relic-maker-mark','The Relic Maker’s Mark','A maker left three quiet signatures in the record.',['archives.evidence.maker-mark','archives.evidence.stone-residue','archives.evidence.old-catalog'],'facility.archives.light-map']
    ],
    'facility.training-grounds':[
      ['training.drill.controlled-spar','Controlled Spar','Practice restraint, timing, and recovery in pairs.',['training.formation.paired']],
      ['training.drill.bridge-formation','Bridge Formation','Hold a narrow crossing without closing it to friends.',['training.formation.line','training.formation.guard']],
      ['training.drill.readiness-circuit','Readiness Circuit','Rotate the squad through changing Village conditions.',['training.formation.rotation']]
    ],
    'facility.hearth':[
      ['hearth.gathering.shared-table','A Shared Table','Make room for the people who keep the nearest roads.',['hearth.theme.neighbors']],
      ['hearth.gathering.story-circle','Story Circle','Let travelers and residents trade the stories maps omit.',['hearth.theme.travelers','hearth.theme.residents']],
      ['hearth.gathering.quiet-evening','A Quiet Evening','Choose a smaller evening with people the Village trusts.',['hearth.theme.trusted-company']]
    ],
    'facility.gatehouse':[
      ['gatehouse.caravan.river-merchants','River Merchants','Wet wheels and urgent cargo arrive from the river road.',['gatehouse.reception.direct','gatehouse.reception.host','gatehouse.reception.inspect'],'story.book1.chapter4.harbor-compact.resolution'],
      ['gatehouse.caravan.skybridge-couriers','Skybridge Couriers','Couriers arrive tired, guarded, and ahead of their papers.',['gatehouse.reception.direct','gatehouse.reception.host','gatehouse.reception.inspect'],'story.book1.chapter4.skybridge-terms.resolution'],
      ['gatehouse.caravan.covenant-envoys','Covenant Envoys','Formal visitors need a welcome equal to the promise they carry.',['gatehouse.reception.direct','gatehouse.reception.host','gatehouse.reception.inspect'],'story.book1.finale.first-covenant']
    ],
    'facility.market-workshop':[
      ['workshop.order.road-repair-kit','Road Repair Kit','A road crew needs a durable answer from recovered materials.',['workshop.fulfillment.repair','workshop.fulfillment.reuse'],'facility.workshop.salvage-order'],
      ['workshop.order.market-fixtures','Market Fixtures','The plaza needs useful fixtures before the next arrivals.',['workshop.fulfillment.craft','workshop.fulfillment.trade'],'story.book1.chapter4.quarry-claim.resolution'],
      ['workshop.order.caravan-supplies','Caravan Supplies','A caravan order can be made here or completed through trade.',['workshop.fulfillment.trade','workshop.fulfillment.reuse'],'facility.gatehouse.first-road-watch']
    ],
    'facility.gardens':[
      ['gardens.crop.road-herbs','Road Herb Plot','Hardy herbs for travelers, kitchens, and careful remedies.',['gardens.crop.road-herbs'],'facility.gardens.first-cultivation'],
      ['gardens.crop.river-greens','River Green Plot','Cool-weather greens suited to the restored river paths.',['gardens.crop.river-greens'],'story.book1.chapter3.river-accord.resolution'],
      ['gardens.crop.waystone-bloom','Waystone Bloom Plot','A rare bloom that responds to the Village covenant.',['gardens.crop.waystone-bloom'],'story.book1.finale.first-covenant']
    ],
    'facility.forge':[
      ['forge.commission.village-toolwork','Village Toolwork','Reliable tools matter more than ornament on a working road.',['forge.work.steady','forge.work.economical'],'facility.forge.first-commission'],
      ['forge.commission.relic-restoration','Relic Restoration','Restore an existing Relic without inventing a second system.',['forge.work.steady','forge.work.precise'],'story.book1.rank5.covenant-arrivals'],
      ['forge.commission.stone-shaping','Relic Stone Shaping','Shape the Village’s authoritative Relic Stones with care.',['forge.work.precise','forge.work.economical'],'facility.archives.light-map']
    ]
  });

  const OUTCOMES=freeze({
    'facility.command-center':['command.outcome.recorded'],
    'facility.archives':['archives.outcome.documented','archives.outcome.breakthrough'],
    'facility.training-grounds':['training.outcome.completed','training.outcome.refined'],
    'facility.hearth':['hearth.outcome.warm','hearth.outcome.deepened'],
    'facility.gatehouse':['gatehouse.outcome.welcomed','gatehouse.outcome.prepared'],
    'facility.market-workshop':['workshop.outcome.fulfilled','workshop.outcome.exacting'],
    'facility.gardens':['gardens.outcome.harvest','gardens.outcome.special-harvest'],
    'facility.forge':['forge.outcome.completed','forge.outcome.fine-work']
  });

  const TUTORIAL_IDS=freeze([
    'tutorial.facility.board.discover-hotspots','tutorial.facility.opportunities.banking','tutorial.facility.claim.first-ready',
    'tutorial.facility.command.first-petition','tutorial.facility.command.consequences','tutorial.facility.archives.first-research','tutorial.facility.archives.mastery','tutorial.facility.training.first-drill','tutorial.facility.training.mastery','tutorial.facility.hearth.first-gathering','tutorial.facility.hearth.relationship-results','tutorial.facility.gatehouse.first-caravan','tutorial.facility.gatehouse.road-events','tutorial.facility.workshop.first-order','tutorial.facility.workshop.mastery','tutorial.facility.gardens.first-plot','tutorial.facility.gardens.harvest','tutorial.facility.forge.first-commission','tutorial.facility.forge.mastery'
  ]);
  const BLOCKED_TUTORIAL_IDS=freeze(['tutorial.facility.archives.mastery','tutorial.facility.training.mastery','tutorial.facility.hearth.relationship-results','tutorial.facility.gatehouse.road-events','tutorial.facility.workshop.mastery','tutorial.facility.gardens.harvest','tutorial.facility.forge.mastery']);
  const TUTORIALS=freeze(TUTORIAL_IDS.map((id,index)=>({id,shared:index<3,enabled:!BLOCKED_TUTORIAL_IDS.includes(id),blocking:false,skippable:true,replayable:true,reward:null})));
  const ALL_ROSTER_ACTOR_IDS=freeze(['fellow.cael','fellow.lyra','fellow.orin','fellow.selene','fellow.rook','fellow.mira','fellow.zamorak','fellow.darrow','fellow.deadpool','fellow.star-lord','fellow.iron-man','fellow.daredevil','fellow.thor','fellow.captain-america','fellow.spider-man','fellow.wolverine','fellow.obi-wan','fellow.anakin','family.elara','family.tamsin','family.isolde','family.violet','family.virginia','family.captain-marvel','family.scarlet-witch','family.ahsoka','family.rey','family.syl','family.shallan','family.yennefer','family.jaina','family.tyrande','family.shadowheart','family.amara','family.aerith','family.tifa','family.hermione','family.misty']);

  const SYNTHETIC_POLICY=freeze({qaOnly:true,requiresIsolatedStorage:true,intervalMsByFacility:Object.fromEntries(FACILITIES.map((item,index)=>[item.facilityId,2700001+index*300000])),bankCapacityByFacility:Object.fromEntries(FACILITIES.map((item,index)=>[item.facilityId,3+index])),rewardGoldByFacility:Object.fromEntries(FACILITIES.map((item,index)=>[item.facilityId,[101,103,107,109,113,127,131,137][index]])),localProgressByFacility:Object.fromEntries(FACILITIES.map((item,index)=>[item.facilityId,[2,3,5,7,11,13,17,19][index]])),gardenGrowthMs:7200001,stockRequirement:2});

  function eligibleTemplates(facilityId,contentIds=null){const rows=CONTENT[facilityId]||[];if(contentIds===null)return rows;const committed=new Set(contentIds);return rows.filter(row=>row[4]===undefined||committed.has(row[4]))}
  function template(facilityId,ordinal,contentIds=null){const rows=eligibleTemplates(facilityId,contentIds);return rows.length?rows[(ordinal-1)%rows.length]:null}
  function outcome(facilityId,ordinal){const rows=OUTCOMES[facilityId]||[];return rows.length?rows[(ordinal-1)%rows.length]:null}
  function choicesFor(facilityId,templateId){const row=CONTENT[facilityId]?.find(item=>item[0]===templateId);return row?row[3].map(id=>({id,label:CHOICES[id]})):[]}
  function validateDefinitions(){const errors=[];if(FACILITIES.length!==8||!unique(FACILITIES.map(item=>item.facilityId))||!unique(FACILITIES.map(item=>item.activityId)))errors.push('facilities');if(FACILITIES.some(item=>![item.facilityId,item.activityId,item.opportunityId,item.capabilityId,item.discoveryId,item.openingId,item.progressId].every(validId)))errors.push('ids');if(Object.keys(CONTENT).length!==8||Object.values(CONTENT).some(rows=>rows.length!==3||rows.some(row=>row[3].length<1||row[3].some(id=>!CHOICES[id])||row[4]!==undefined&&!validId(row[4]))))errors.push('content');if(Object.keys(OUTCOMES).length!==8||Object.values(OUTCOMES).some(rows=>rows.length<1||rows.some(id=>!validId(id))))errors.push('outcomes');if(TUTORIALS.length!==19||ALL_ROSTER_ACTOR_IDS.length!==38)errors.push('coverage');return{ok:errors.length===0,errors}}

  const api=freeze({version:2,bridgeVersion:'phase-20-21-independent-qa-v2',configs:{phase20:'phase-20-original-four-active-v1',phase21:'phase-21-expansion-facilities-v1',integration:'phase-21-cross-facility-integration-v1'},migrations:['migration.phase-20.original-four-active.v1','migration.phase-21.expansion-facilities.v1'],predecessorMigrationId:'migration.phase-19.schoolhouse.v1',offlineCapMs:OFFLINE_CAP_MS,publicRelease:false,productionEnabled:false,facilities:FACILITIES,content:CONTENT,outcomes:OUTCOMES,choiceLabels:CHOICES,tutorials:TUTORIALS,allRosterActorIds:ALL_ROSTER_ACTOR_IDS,syntheticPolicy:SYNTHETIC_POLICY,eligibleTemplates,template,outcome,choicesFor,validateDefinitions});
  if(validateDefinitions().ok!==true)throw new Error('Phase 20/21 definitions are invalid');
  Object.defineProperty(root,'EVERSTEAD_PHASE20_21_FACILITIES',{value:api,enumerable:false,configurable:false,writable:false});
})(globalThis);

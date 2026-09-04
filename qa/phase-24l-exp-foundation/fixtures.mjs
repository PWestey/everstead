export const FELLOW_IDS=Object.freeze([
  'cael','lyra','orin','selene','rook','mira','zamorak','darrow','deadpool','star-lord',
  'iron-man','daredevil','thor','captain-america','spider-man','wolverine','obi-wan','anakin'
]);

export const COMPANION_IDS=Object.freeze([
  'arcanine','dewgong','snorlax','dragonite','charizard','venusaur','blastoise','jolteon',
  'machamp','meganium','feraligatr','miltank','donphan','lucario','boltund','stoutland',
  'mabosstiff','zacian','lugia','suicune'
]);

export const clone=value=>JSON.parse(JSON.stringify(value));

function actors(ids,{high=false,fresh=false,companion=false}={}){
  return Object.fromEntries(ids.map((id,index)=>{
    const level=fresh?1:high?900+index*31:2+index*3;
    const exp=fresh?0:high?8_000_000_000_000+index*9_999_991:1200+index*431;
    const row={
      owned:fresh?index<2:true,
      level,
      exp,
      rarity:fresh?1:high?8:1+(index%5),
      shards:fresh?0:high?90_000_000+index:7+index*2,
      power:fresh?100+index:high?70_000_000_000+index*101:2500+index*173
    };
    if(companion)row.assignedFellowId=fresh?null:FELLOW_IDS[index%FELLOW_IDS.length];
    else Object.assign(row,{bond:fresh?0:high?1_000_000+index:30+index,relicSlots:[index%4===0?'waystone-ring':null,null,null]});
    return[id,row];
  }));
}

function saveMeta(name,{high=false,source='fixture'}={}){
  return{
    saveId:`qa-phase24l-${name}`,
    revision:high?4_000_000:30,
    createdAt:1_750_000_000_000,
    updatedAt:high?1_950_000_000_000:1_800_000_000_000,
    source,
    installationId:'qa-installation-phase24l',
    appliedMigrations:[
      {id:'migration.schema-13-to-14.phase-24c-zero-activation.v1',from:13,to:14,rewardApplications:0,identity:'a'.repeat(64)}
    ]
  };
}

function base(name,{fresh=false,high=false,pending=false,source='fixture'}={}){
  const fellows=actors(FELLOW_IDS,{fresh,high});
  const companions=actors(COMPANION_IDS,{fresh,high,companion:true});
  return{
    schemaVersion:14,
    version:'0.1.0',
    saveMeta:saveMeta(name,{high,source}),
    gold:fresh?500:high?8_000_000_000_000:987654,
    prosperity:fresh?0:high?700_000_000:4312,
    player:{rank:fresh?1:high?900:14,exp:fresh?0:high?9_000_000_000:7531,power:fresh?250:high?90_000_000_000:18300},
    fellows,
    family:{
      aurelia:{owned:true,intimacy:fresh?0:high?8_000_000:71,rarity:fresh?1:high?7:2,shards:fresh?0:high?900_000:12,assignedBuildingId:'hearth'},
      nyx:{owned:!fresh,intimacy:fresh?0:high?7_000_000:53,rarity:fresh?1:high?6:2,shards:fresh?0:high?800_000:9,assignedBuildingId:fresh?null:'archive'}
    },
    companions,
    buildings:{hearth:{level:fresh?1:high?250:8},archive:{level:fresh?1:high?230:6}},
    oaths:[{id:'qa-oath',difficulty:'medium',completed:!fresh,reward:{gold:240,prosperity:3}}],
    fellowExpedition:{stage:fresh?1:high?900:22,idle:{pendingExp:pending?98765:0,pendingShards:pending?{cael:13}:{}},history:['qa']},
    companionCampaign:{stage:fresh?1:high?700:18,lastReward:{exp:pending?4400:0,shards:pending?2:0}},
    companionTower:{floor:fresh?0:high?500:11,idle:{pendingExp:pending?123456:0,pendingShards:pending?{zacian:5}: {},carry:pending?0.625:0}},
    companionProfile:{pendingLegacyTower:pending?{exp:3333,shards:{lugia:4},source:'legacy-tower'}:null},
    familyDrops:{pending:pending?{gifts:7,shards:{aurelia:3},elapsedMs:8640000}:null},
    facilityOpportunities:{restaurant:pending?[{id:'guest-11',reward:{gold:3200,items:['mint']}}]:[]},
    rewardClaims:{
      achievements:pending?{'village.earnings.10':{ready:true,reward:{gold:500,exp:900}}}:{},
      chronicle:pending?{'first-covenant.4':{ready:true,reward:{companionExp:2500}}}:{}
    },
    phase15:{pendingOffers:pending?[{id:'offer-1',reward:{fellowExp:1000}}]:[],receiptIds:['phase15-a']},
    phase2021:{tutorials:{completedIds:fresh?[]:['village-basics'],activeId:null},chronicle:{unclaimedIds:pending?['chapter-1-5']:[]}},
    phase22:{achievements:{claimedIds:fresh?[]:['first-oath'],pendingIds:pending?['trained-five']:[]}},
    userSettings:{reducedMotion:false,sound:false},
    sentinelPayload:{
      note:`${name}-must-survive-byte-for-byte`,
      nested:[{kind:'reward',level:high?999:5,exp:pending?445566:0},[1,2,3]],
      zero:0,
      falseValue:false,
      nullValue:null
    }
  };
}

export function fixture(name){
  if(name==='fresh')return base(name,{fresh:true,source:'fresh'});
  if(name==='established')return base(name);
  if(name==='high-progression')return base(name,{high:true});
  if(name==='pending-entitlements')return base(name,{pending:true});
  throw new TypeError(`Unknown Phase 24L fixture: ${name}`);
}

export function rawFixture(name){return JSON.stringify(fixture(name))}

export function predecessorValidator(value){
  return Boolean(value)&&value.schemaVersion===14&&value.saveMeta&&Number.isSafeInteger(value.saveMeta.revision)&&
    typeof value.saveMeta.saveId==='string'&&value.saveMeta.saveId.length>0&&
    FELLOW_IDS.every(id=>Number.isSafeInteger(value.fellows?.[id]?.exp)&&Number.isSafeInteger(value.fellows?.[id]?.level))&&
    COMPANION_IDS.every(id=>Number.isSafeInteger(value.companions?.[id]?.exp)&&Number.isSafeInteger(value.companions?.[id]?.level));
}

export function directOriginValidator(value,lineageKind){
  return predecessorValidator(value)&&['direct-schema-15','safe-reset-schema-15'].includes(lineageKind);
}

export function preservedTopLevel(value){
  const copy=clone(value);delete copy.schemaVersion;delete copy.saveMeta;delete copy.experienceProgression;return copy;
}

export function preservedSaveMeta(value){
  const copy=clone(value.saveMeta);delete copy.revision;delete copy.updatedAt;delete copy.source;delete copy.appliedMigrations;return copy;
}

export function actorProgression(value){
  return{
    fellows:Object.fromEntries(FELLOW_IDS.map(id=>[id,{exp:value.fellows[id].exp,level:value.fellows[id].level,power:value.fellows[id].power,rarity:value.fellows[id].rarity,shards:value.fellows[id].shards,bond:value.fellows[id].bond,relicSlots:clone(value.fellows[id].relicSlots)}])),
    companions:Object.fromEntries(COMPANION_IDS.map(id=>[id,{exp:value.companions[id].exp,level:value.companions[id].level,power:value.companions[id].power,rarity:value.companions[id].rarity,shards:value.companions[id].shards,assignedFellowId:value.companions[id].assignedFellowId}]))
  };
}

export function pendingProjection(value){
  return clone({
    fellowExpedition:value.fellowExpedition,
    companionCampaign:value.companionCampaign,
    companionTower:value.companionTower,
    companionProfile:value.companionProfile,
    familyDrops:value.familyDrops,
    facilityOpportunities:value.facilityOpportunities,
    rewardClaims:value.rewardClaims,
    phase15:value.phase15,
    phase2021:value.phase2021,
    phase22:value.phase22
  });
}

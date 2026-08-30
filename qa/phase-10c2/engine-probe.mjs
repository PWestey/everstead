import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {simulateBundle} from '../phase-10b/simulate.mjs';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const SCHEMA_TEN_BASE='56b99f86a95f95fd1822da0331204f5d8ea33656';
const PROFILE_IDENTITY='6abf706b4450f61a708a0baba5e431a374f8de085fbf614e7334b6071bca534f';
const T0=1787853600000;
const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const sha=value=>createHash('sha256').update(value).digest('hex');
const floatBits=value=>{const buffer=new ArrayBuffer(8),view=new DataView(buffer);view.setFloat64(0,value,false);return view.getBigUint64(0,false)};
const orderedFloatBits=value=>{const bits=floatBits(value),sign=1n<<63n,mask=(1n<<64n)-1n;return(bits&sign)!==0n?(~bits)&mask:bits|sign};
const withinOneUlp=(actual,advisory)=>{if(Object.is(actual,advisory))return true;if(!Number.isFinite(actual)||!Number.isFinite(advisory))return false;const left=orderedFloatBits(actual),right=orderedFloatBits(advisory);return(left>right?left-right:right-left)<=1n};
const application=html=>html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const replaceOnce=(source,needle,replacement,label)=>{if(source.split(needle).length!==2)throw new Error(`Phase 10C-2 probe anchor drift: ${label}`);return source.replace(needle,replacement)};

async function phaseNineHarness(){
  const verifier=readFileSync(resolve(ROOT,'qa/phase-9/verify.mjs'),'utf8'),boundary=verifier.lastIndexOf('\nconst suite=String.raw`');
  if(boundary<0)throw new Error('Phase 9 persistence harness boundary missing');
  const prefix=verifier.slice(0,boundary).replace("const repoRoot=resolve(new URL('../..',import.meta.url).pathname);",`const repoRoot=${JSON.stringify(ROOT)};`)+'\nexport {harness};\n';
  return (await import('data:text/javascript;base64,'+Buffer.from(prefix).toString('base64'))).harness
}

async function toolsFor(harness){
  const module=`import {createHash} from 'node:crypto';import {readFileSync} from 'node:fs';import {resolve} from 'node:path';import vm from 'node:vm';${harness}\nexport {runRealm,instrument,freshOptions,keys,activeRaw,active,internal,writes};`;
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'))
}

function engineHarness(base){
  let next=replaceOnce(base,"  preV10:'oathforge_new_world_proto_v01__raw_backup_v9',\n  staging:","  preV10:'oathforge_new_world_proto_v01__raw_backup_v9',\n  preV11:'oathforge_new_world_proto_v01__raw_backup_v10',\n  staging:",'pre-v11 key');
  next=replaceOnce(next,'preV10BackupRaw:keys.preV10,stagingRaw:','preV10BackupRaw:keys.preV10,preV11BackupRaw:keys.preV11,stagingRaw:','pre-v11 fixture option');
  next=replaceOnce(next,'return value?.schemaVersion===10?value:null','return value?.schemaVersion===11?value:null','schema-11 active helper');
  next=replaceOnce(next,'    tamperClear(){',`    p10c2:Object.freeze({
      state:()=>clone(S),
      valid:(value=S)=>validation(value,11),
      profile:()=>clone(PHASE_TEN_C_ONE_PROFILE),
      runtime:()=>qaRuntimeSnapshot(),
      export:()=>safePersistenceExport(),
      profileActive:(value=S)=>phaseTenCTwoProfileActive(value),
      cap:()=>ECONOMY_CONFIG.buildingLevelCap,
      cost:level=>{try{return{ok:true,value:phaseTenCTwoUpgradeCost(level)}}catch(error){return{ok:false,error:String(error.message||error)}}},
      upgrade:(id,value)=>{S=clone(value);const before=clone(S),beforeRaw=PERSISTED_RAW,result=modalAction('upgrade-building',id);return{ok:Boolean(result?.ok),returnedFalse:result===false,before,after:clone(S),beforeRaw,afterRaw:PERSISTED_RAW,blocked:PERSISTENCE_BLOCKED?clone(PERSISTENCE_BLOCKED):null}},
      curve:(kind,power)=>{const fellowBefore=phaseTenCTwoFellowRosterPower,companionBefore=phaseTenCTwoCompanionRosterPower;try{if(kind==='fellow')phaseTenCTwoFellowRosterPower=()=>power;else if(kind==='companion')phaseTenCTwoCompanionRosterPower=()=>power;else throw new Error('Unknown economy roster');return{ok:true,value:clone(phaseTenCTwoRosterBonus(kind,S))}}catch(error){return{ok:false,error:String(error.message||error)}}finally{phaseTenCTwoFellowRosterPower=fellowBefore;phaseTenCTwoCompanionRosterPower=companionBefore}},
      fellow:(id,value=S)=>clone(phaseTenCTwoFellowEconomyPowerComponents(id,value)),
      fellowTotal:(value=S)=>phaseTenCTwoFellowRosterPower(value),
      companion:(id,value=S)=>clone(effectiveCompanionPowerComponents(id,value)),
      companionTotal:(value=S)=>phaseTenCTwoCompanionRosterPower(value),
      combat:(id,value=S)=>clone(effectiveFellowPowerComponents(id,value)),
      bonus:(kind,value=S)=>clone(phaseTenCTwoRosterBonus(kind,value)),
      rate:(id,value=S,at=runtimeNow())=>clone(buildingRateComponents(id,value,at)),
      oldRate:(id,value=S,at=runtimeNow())=>clone(buildingRateComponentsBeforePhaseTenCTwo(id,value,at)),
      offline:(at,value=S)=>clone(offlineClaimPreview(at,value)),
      previewPure:(at,value=S)=>{const before=JSON.stringify(value);offlineClaimPreview(at,value);return JSON.stringify(value)===before},
      set:value=>{S=clone(value);return clone(S)},
      accrue:(opening,at)=>clone(accrue(opening,at)),
      collect:()=>clone(collectGold()),
      pending:()=>clone(canonicalPendingCollection(S)),
      cursors:(value=S)=>({tower:value.companionTower.idle.cursorAt,expedition:value.fellowExpedition.idle.cursorAt}),
      familyDropOrdinals:(value=S)=>Object.fromEntries(BUILDING_DEFS.map(def=>[def.id,value.familyDrops.buildings[def.id].nextRollOrdinal]))
    }),
    tamperClear(){`,'Phase 10C-2 facade');
  return next
}

function applyArchetype(state,archetype){
  const next=clone(state),roster=archetype.rosterState;
  for(const [id,level] of Object.entries(archetype.buildingLevels))next.buildings[id].level=level;
  for(const [id,value] of Object.entries(roster.fellows)){Object.assign(next.fellows[id],{owned:value.owned,exp:value.exp,level:value.level,rarity:value.rarity,shards:value.shards,bond:value.bond});next.fellows[id].relicSlots=[value.equippedRelicId]}
  for(const [id,value] of Object.entries(roster.companions))Object.assign(next.companions[id],value);
  for(const [id,value] of Object.entries(roster.family))Object.assign(next.family[id],value);
  for(const [id,value] of Object.entries(roster.relicInventory))next.relics[id]={owned:value.owned,level:value.level};
  next.fellowMight.points=roster.mightPoints;next.companionMastery.points=roster.masteryPoints;
  return next
}

export async function runEngineProbe(){
  const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)}),phaseNine=await phaseNineHarness(),baseTools=await toolsFor(phaseNine),tools=await toolsFor(engineHarness(phaseNine));
  const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),app=application(html),source=tools.instrument(app),baseHtml=execFileSync('git',['show',`${SCHEMA_TEN_BASE}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000}),baseApp=application(baseHtml),baseRun=baseTools.runRealm({...baseTools.freshOptions,applicationSource:baseTools.instrument(baseApp),now:T0}),schemaTenRaw=baseTools.activeRaw(baseRun);
  if(!app||!baseApp||!schemaTenRaw)throw new Error('Phase 10C-2 application or predecessor source missing');
  const run=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0}),state=tools.active(run),p=(realm,expression)=>tools.internal(realm,'p10c2.'+expression),literal=value=>typeof value==='string'?JSON.stringify(value):String(value),at=(method,value,...args)=>{const raw=JSON.stringify(value);if(['rate','oldRate'].includes(method))return p(run,`${method}(${literal(args[0])},${raw},${literal(args[1])})`);if(method==='offline')return p(run,`${method}(${literal(args[0])},${raw})`);if(['fellow','companion','combat','bonus'].includes(method))return p(run,`${method}(${literal(args[0])},${raw})`);return p(run,`${method}(${raw})`)},scenarios=JSON.parse(readFileSync(resolve(ROOT,'qa/phase-10b/scenarios.json'),'utf8'));
  record('fresh-engine-boot',run.thrown===null&&state?.schemaVersion===11&&p(run,'runtime().blocked')===null,run.thrown?.message||p(run,'runtime().blocked'));
  record('fresh-engine-profile',state?.gold===50000&&same(state.economyProfile,{configIdentity:PROFILE_IDENTITY,activatedAt:T0})&&p(run,'profileActive()')===true,state?.economyProfile);
  record('fresh-engine-valid',p(run,'valid().ok')===true,p(run,'valid().errors'));
  record('fresh-engine-native-storage-zero',run.nativeCalls.length===0,run.nativeCalls);

  const costs={1:15000,2:18600,5:35463,10:103965,20:893518,30:7679273,40:65998943,51:703356519,52:872162084};
  for(const [level,expected] of Object.entries(costs)){const result=p(run,`cost(${level})`);record(`cost-level-${level}`,result.ok===true&&result.value===expected,result)}
  record('building-level-cap-config',p(run,'cap()')===52,p(run,'cap()'));
  const capRun=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0}),upgradeState=tools.active(capRun),capProfile=clone(upgradeState.economyProfile),capCost=703356519;upgradeState.buildings.training.level=51;upgradeState.gold=capCost+1000;const upgraded=p(capRun,`upgrade('training',${JSON.stringify(upgradeState)})`);
  record('level-51-to-52-transaction',upgraded.ok===true&&upgraded.returnedFalse===false&&upgraded.blocked===null&&upgraded.after.buildings.training.level===52&&upgraded.before.gold-upgraded.after.gold===capCost&&upgraded.after.gold===1000&&upgraded.after.saveMeta.revision===upgraded.before.saveMeta.revision+1&&same(upgraded.after.economyProfile,capProfile)&&upgraded.afterRaw!==upgraded.beforeRaw,{ok:upgraded.ok,beforeLevel:upgraded.before.buildings.training.level,afterLevel:upgraded.after.buildings.training.level,beforeGold:upgraded.before.gold,afterGold:upgraded.after.gold,beforeRevision:upgraded.before.saveMeta.revision,afterRevision:upgraded.after.saveMeta.revision});
  const cappedBefore=clone(upgraded.after),capped=p(capRun,`upgrade('training',${JSON.stringify(cappedBefore)})`);
  record('level-52-to-53-refused-unchanged',capped.returnedFalse===true&&capped.ok===false&&capped.blocked===null&&same(capped.after,capped.before)&&capped.after.gold===capped.before.gold&&capped.after.saveMeta.revision===capped.before.saveMeta.revision&&capped.afterRaw===capped.beforeRaw&&same(capped.after.economyProfile,capProfile),{returnedFalse:capped.returnedFalse,level:capped.after.buildings.training.level,gold:capped.after.gold,revision:capped.after.saveMeta.revision,rawUnchanged:capped.afterRaw===capped.beforeRaw});
  for(const expression of ['0','53','-1','NaN']){const result=p(run,`cost(${expression})`);record(`cost-invalid-${expression.replace(/\W/g,'_')}`,result.ok===false,result)}

  const curves={fellow:[[0,0],[35150,390],[100000,750],[900000,1350],[Number.MAX_SAFE_INTEGER,1499]],companion:[[0,0],[2200,80],[25000,500],[225000,900],[Number.MAX_SAFE_INTEGER,999]]};
  for(const [kind,cases] of Object.entries(curves))for(const [power,bps] of cases){const result=p(run,`curve(${JSON.stringify(kind)},${power})`);record(`${kind}-curve-${power}`,result.ok===true&&result.value.power===power&&result.value.bps===bps&&Object.is(result.value.bonus,bps/10000)&&Object.is(result.value.multiplier,1+bps/10000),result)}
  for(const kind of ['fellow','companion'])for(const expression of ['-1','1.5','Number.MAX_SAFE_INTEGER+1','NaN','Infinity']){const result=p(run,`curve(${JSON.stringify(kind)},${expression})`);record(`${kind}-curve-invalid-${expression.replace(/\W/g,'_')}`,result.ok===false,result)}
  record('curve-invalid-kind',p(run,"curve('foreign',0)").ok===false);

  const freshFellows=['cael','lyra','orin','selene','rook','mira'].map(id=>p(run,`fellow(${JSON.stringify(id)})`)),freshCompanions=['bramble','cinderwing'].map(id=>p(run,`companion(${JSON.stringify(id)})`));
  record('fresh-fellow-local-rounds',same(freshFellows.map(item=>item.effectivePower),[6100,6400,5900,5350,6200,5200])&&freshFellows.every(item=>same(item.formulaOrder,['basePower','levelMultiplier','rarityMultiplier','relicMultiplier','globalMightMultiplier','round'])),freshFellows.map(item=>item.effectivePower));
  record('fresh-fellow-total-disjoint',p(run,'fellowTotal()')===35150&&p(run,"bonus('fellow').bps")===390,p(run,"bonus('fellow')"));
  record('fresh-companion-local-rounds',same(freshCompanions.map(item=>item.effectivePower),[1000,1200])&&freshCompanions.every(item=>same(item.formulaOrder,['basePower','levelMultiplier','rarityMultiplier','masteryMultiplier','round'])),freshCompanions.map(item=>item.effectivePower));
  record('fresh-companion-total-once',p(run,'companionTotal()')===2200&&p(run,"bonus('companion').bps")===80,p(run,"bonus('companion')"));
  const bond=clone(state);bond.fellows.cael.bond=2500;record('bond-production-neutral',at('fellowTotal',bond)===35150);
  const family=clone(state);family.family.tamsin.intimacy=176;family.family.tamsin.rarity=5;record('family-linked-production-neutral',at('fellowTotal',family)===35150&&at('companionTotal',family)===2200);
  const assignments=clone(state);assignments.companions.bramble.assignedFellowId='cael';assignments.companions.cinderwing.assignedFellowId='orin';record('companion-assignment-production-neutral',at('fellowTotal',assignments)===35150&&at('companionTotal',assignments)===2200);
  const prosperity=clone(state);prosperity.prosperity+=9999;record('prosperity-production-neutral',Object.is(at('rate',prosperity,'training',T0).rate,7806.077153279999));
  const unowned=clone(state);unowned.fellows.cael.owned=false;unowned.companions.bramble.owned=false;record('unowned-rosters-excluded',at('fellowTotal',unowned)===29050&&at('companionTotal',unowned)===1200);
  const relic=clone(state);relic.relics['first-road-lantern']={owned:true,level:5};relic.fellows.cael.relicSlots=['first-road-lantern'];record('relic-only-fellow-local',at('fellow',relic,'cael').effectivePower===6222&&at('fellowTotal',relic)===35272&&at('bonus',relic,'fellow').bps===391&&at('companionTotal',relic)===2200);
  const might=clone(state);might.fellowMight.points=80;record('might-only-fellow-locals',same(['cael','lyra','orin','selene','rook','mira'].map(id=>at('fellow',might,id).effectivePower),[6222,6528,6018,5457,6324,5304])&&at('fellowTotal',might)===35853&&at('bonus',might,'fellow').bps===395&&at('companionTotal',might)===2200);
  const mastery=clone(state);mastery.companionMastery.points=80;record('mastery-only-companion-locals',same(['bramble','cinderwing'].map(id=>at('companion',mastery,id).effectivePower),[1020,1224])&&at('companionTotal',mastery)===2244&&at('bonus',mastery,'companion').bps===82&&at('fellowTotal',mastery)===35150);

  for(const id of ['early','late','near-cap']){const archetype=scenarios.simulation.archetypes.find(item=>item.id===id),value=applyArchetype(state,archetype),oracle=simulateBundle(scenarios,'candidate-growth-124',id,'24-hour').power.starting,actualFellow=at('fellowTotal',value),actualCompanion=at('companionTotal',value);record(`${id}-oracle-power`,actualFellow===oracle.fellowEconomyPower&&actualCompanion===oracle.companionEconomyPower&&at('bonus',value,'fellow').bps===oracle.fellowBonusBps&&at('bonus',value,'companion').bps===oracle.companionBonusBps,{actualFellow,actualCompanion,expectedFellow:oracle.fellowEconomyPower,expectedCompanion:oracle.companionEconomyPower});if(id==='late')record('late-companion-local-rounding',actualCompanion===22330&&Math.round(oracle.companionRows.reduce((sum,item)=>sum+item.unroundedPower,0))===22331);if(id==='near-cap')record('near-cap-fellow-local-rounding',actualFellow===922447&&Math.round(oracle.fellowRows.reduce((sum,item)=>sum+item.economyUnroundedPower,0))===922448)}

  const expectedFresh={training:7806.077153279999,command:6807.528,archives:6050.279531519999,hearth:6656.9245344},advisoryFresh={training:7806.07715328,command:6807.528,archives:6050.27953152,hearth:6656.9245344},orders=['base','levelMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier','oathMultiplier'];
  for(const [id,expected] of Object.entries(expectedFresh)){const value=at('rate',state,id,T0);record(`fresh-rate-${id}`,Object.is(value.rate,expected)&&same(value.formulaOrder,orders)&&value.fellowRosterPower===35150&&value.fellowRosterBps===390&&value.companionRosterPower===2200&&value.companionRosterBps===80&&value.overallDayMultiplier===1,value)}
  const freshTotal=Object.keys(expectedFresh).reduce((sum,id)=>sum+at('rate',state,id,T0).rate,0);
  record('fresh-total-rate',Object.is(freshTotal,27320.8092192),freshTotal);
  record('fresh-advisory-vectors-within-one-ulp',Object.entries(advisoryFresh).every(([id,expected])=>withinOneUlp(at('rate',state,id,T0).rate,expected))&&withinOneUlp(freshTotal,27320.809219200004));
  const oathRates={0:7806.077153279999,.03:8040.259467878399,.05:8196.381010944,.08:8430.5633255424,.3:10147.900299264};
  for(const [boost,expected] of Object.entries(oathRates)){const value=clone(state);value.buildings.training.boost=+boost;value.buildings.training.boostDay=value.day;const result=at('rate',value,'training',T0);record(`training-oath-${boost}`,Object.is(result.rate,expected)&&result.oathBoost===+boost&&Object.is(result.oathMultiplier,1+(+boost))&&result.formulaOrder.filter(item=>item==='familyAssignmentMultiplier').length===1&&result.formulaOrder.at(-1)==='oathMultiplier',result)}
  const levelTwo=clone(state);levelTwo.buildings.training.level=2;record('training-level-two-rate',Object.is(at('rate',levelTwo,'training',T0).rate,8976.988726271999));
  record('family-direct-once-rate-change',Object.is(at('rate',family,'training',T0).rate,8560.14179328)&&at('fellowTotal',family)===35150);

  const oldRates={training:7453.44,command:6500,archives:5776.96,hearth:6356.2},activation=1788026400000,offlineState=clone(state);offlineState.economyProfile.activatedAt=activation;offlineState.pendingGold=0;for(const value of Object.values(offlineState.buildings)){value.boost=0;value.boostDay=offlineState.day}
  for(const [id,expected] of Object.entries(oldRates))record(`released-rate-${id}`,Object.is(at('oldRate',offlineState,id,activation-1).rate,expected),at('oldRate',offlineState,id,activation-1));
  const beforeMs=at('offline',{...offlineState,lastGoldAt:activation-1},activation),afterMs=at('offline',{...offlineState,lastGoldAt:activation},activation+1),split=at('offline',{...offlineState,lastGoldAt:activation-3600000},activation+3600000),expectedSplit=[15259.517153279998,13307.528,11827.23953152,13013.1245344],advisorySplit=[15259.51715328,13307.528,11827.239531520001,13013.1245344];
  record('activation-minus-one-ms',beforeMs.elapsed===1&&beforeMs.segments.length===1&&Object.is(beforeMs.total,.007246277777777778),beforeMs);
  record('activation-plus-one-ms',afterMs.elapsed===1&&afterMs.segments.length===1&&Object.is(afterMs.total,.007589113672),afterMs);
  record('activation-two-hour-split',split.segments.length===2&&split.segments[0].end===activation&&split.segments[1].start===activation&&same(split.lines.map(item=>item.value),expectedSplit)&&Object.is(split.total,53407.409219199995),split);
  record('activation-advisory-vectors-within-one-ulp',withinOneUlp(beforeMs.total,.007246277777777777)&&split.lines.every((item,index)=>withinOneUlp(item.value,advisorySplit[index]))&&withinOneUlp(split.total,53407.4092192));
  const midnight=1788073200000,midnightState={...offlineState,economyProfile:{...offlineState.economyProfile,activatedAt:midnight},lastGoldAt:midnight-3600000},midnightSplit=at('offline',midnightState,midnight+3600000);
  record('activation-at-midnight-no-zero-segment',midnightSplit.segments.length===2&&midnightSplit.segments.every(item=>item.duration===3600000)&&midnightSplit.segments[0].end===midnight&&midnightSplit.segments[1].start===midnight&&Object.is(midnightSplit.total,53407.409219199995),midnightSplit);
  const capState={...offlineState,lastGoldAt:activation-12*3600000},exactCap=at('offline',capState,activation+12*3600000),overCap=at('offline',capState,activation+20*3600000),expectedCap=[183114.20583936,159690.336,141926.87437824,156157.4944128],advisoryCap=[183114.20583936002,159690.336,141926.87437824003,156157.4944128];
  record('exact-24-hour-transition',exactCap.elapsed===86400000&&same(exactCap.lines.map(item=>item.value),expectedCap)&&Object.is(exactCap.total,640888.9106304001)&&exactCap.nextLastGoldAt===activation+12*3600000,exactCap);
  record('over-32-hour-earliest-cap',overCap.elapsed===86400000&&overCap.claimEnd===activation+12*3600000&&same(overCap.lines.map(item=>item.value),expectedCap)&&Object.is(overCap.total,640888.9106304001)&&overCap.nextLastGoldAt===activation+20*3600000,overCap);
  record('cap-advisory-vectors-within-one-ulp',exactCap.lines.every((item,index)=>withinOneUlp(item.value,advisoryCap[index]))&&overCap.lines.every((item,index)=>withinOneUlp(item.value,advisoryCap[index])));
  const rollback=at('offline',{...offlineState,lastGoldAt:activation+1},activation),future=at('offline',{...offlineState,lastGoldAt:activation+3600000},activation);
  record('rollback-zero-no-clock-regression',rollback.elapsed===0&&rollback.total===0&&rollback.nextLastGoldAt===activation+1,rollback);
  record('future-last-gold-zero',future.elapsed===0&&future.total===0&&future.nextLastGoldAt===activation+3600000,future);
  record('offline-preview-pure',p(run,`previewPure(${activation+3600000},${JSON.stringify({...offlineState,lastGoldAt:activation-3600000})})`)===true);

  const claimRun=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0}),claimState=tools.active(claimRun),claimProfile=clone(claimState.economyProfile),pending=53408.1592192;claimState.pendingGold=pending;claimState.lastGoldAt=T0;p(claimRun,`set(${JSON.stringify(claimState)})`);const pendingBefore=p(claimRun,'pending()'),claim=p(claimRun,'collect()'),claimedState=tools.active(claimRun);
  record('pending-whole-claim-vector',pendingBefore.gold===53408&&claim.gold===53408&&claimedState.gold===103408&&Object.is(claimedState.pendingGold,.1592192000025534),{pendingBefore,claim,gold:claimedState.gold,remainder:claimedState.pendingGold});
  record('pending-claim-conservation',Object.is(claim.gold+claimedState.pendingGold,pending)&&same(claimedState.economyProfile,claimProfile));

  const dropRun=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0}),dropState=tools.active(dropRun),dropNow=T0+8*3600000;dropState.lastGoldAt=T0;dropState.economyProfile.activatedAt=T0+4*3600000;dropState.familyDrops.eligibleAt=T0;const cursorBefore=p(dropRun,`cursors(${JSON.stringify(dropState)})`),ordinalsBefore=p(dropRun,`familyDropOrdinals(${JSON.stringify(dropState)})`);p(dropRun,`set(${JSON.stringify(dropState)})`);const accrual=p(dropRun,`accrue(true,${dropNow})`),dropAfter=p(dropRun,'state()'),cursorAfter=p(dropRun,'cursors()'),ordinalsAfter=p(dropRun,'familyDropOrdinals()');
  record('family-drops-once-across-profile-split',accrual.segments.length>=2&&accrual.drops.rolls===8&&Object.keys(ordinalsBefore).every(id=>ordinalsAfter[id]===ordinalsBefore[id]+2),{segments:accrual.segments.length,rolls:accrual.drops.rolls,ordinalsBefore,ordinalsAfter});
  record('idle-cursors-independent-from-gold',same(cursorBefore,cursorAfter),{cursorBefore,cursorAfter});
  record('gold-accrual-profile-preserved',same(dropAfter.economyProfile,dropState.economyProfile)&&dropAfter.lastGoldAt===dropNow);

  const faultState=clone(state),faultNow=T0+8*3600000;faultState.pendingGold=.25;faultState.lastGoldAt=T0;faultState.familyDrops.eligibleAt=T0;const faultRaw=JSON.stringify(faultState),interrupted=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:faultRaw,now:faultNow,fault:{enabled:true,operation:'setItem',step:'active-write'}}),retry=tools.runRealm({applicationSource:source,initialSlots:Object.fromEntries(interrupted.slots),now:faultNow}),retryState=tools.active(retry),expectedFaultPending=218566.72375359997;
  record('fault-active-write-triggered',interrupted.fault.remaining===0&&interrupted.slots.get(tools.keys.active)===faultRaw,interrupted.persistenceLog);
  record('fault-reload-single-gold-settlement',Object.is(retryState?.pendingGold,expectedFaultPending)&&retryState.lastGoldAt===faultNow&&p(retry,'runtime().blocked')===null,{pending:retryState?.pendingGold,expectedFaultPending,blocked:p(retry,'runtime().blocked')});
  record('fault-reload-single-family-settlement',Object.values(p(retry,'familyDropOrdinals()')).every(value=>value===2),p(retry,'familyDropOrdinals()'));
  record('fault-reload-profile-preserved',same(retryState?.economyProfile,state.economyProfile));

  const migrationNow=T0+3600000,migration=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:schemaTenRaw,now:migrationNow}),migrated=tools.active(migration),migratedCost=p(migration,'cost(1)');
  record('schema10-migrated-backlog-released-rate',migrated?.schemaVersion===11&&migrated.gold===500000&&Object.is(migrated.pendingGold,26086.6)&&migrated.lastGoldAt===migrationNow&&migrated.economyProfile.activatedAt===migrationNow,{gold:migrated?.gold,pendingGold:migrated?.pendingGold,lastGoldAt:migrated?.lastGoldAt,profile:migrated?.economyProfile});
  record('schema10-migrated-future-cost-active',migratedCost.ok===true&&migratedCost.value===15000&&Object.is(p(migration,"rate('training').rate"),7806.077153279999),migratedCost);
  record('schema10-migrated-pre-v11-exact',migration.slots.get(tools.keys.preV11)===schemaTenRaw,sha(migration.slots.get(tools.keys.preV11)??''));
  record('fresh-vs-migrated-policy',state.gold===50000&&state.pendingGold===0&&migrated.gold===500000&&Object.is(migrated.pendingGold,26086.6));
  record('migration-engine-native-storage-zero',migration.nativeCalls.length===0,migration.nativeCalls);

  return{rows,evidence:{artifact:{sha256:sha(html),byteLength:Buffer.byteLength(html)},profileIdentity:PROFILE_IDENTITY,fresh:{gold:state.gold,fellowPower:35150,companionPower:2200,totalRate:27320.8092192},migration:{gold:migrated?.gold,pendingGold:migrated?.pendingGold,activatedAt:migrated?.economyProfile?.activatedAt},nativeStorageCalls:[...run.nativeCalls,...capRun.nativeCalls,...claimRun.nativeCalls,...dropRun.nativeCalls,...interrupted.nativeCalls,...retry.nativeCalls,...migration.nativeCalls].length}}
}

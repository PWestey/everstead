import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const PHASE_ELEVEN_F_COMMIT='23da8504cf9fb6994a0242e74603be0bfe2e18a6';
const T0=1788199200000;
const helperFile=readFileSync(resolve(ROOT,'qa/phase-10c2/engine-probe.mjs'),'utf8');
const helperBoundary=helperFile.indexOf('export async function runEngineProbe');
if(helperBoundary<0)throw new Error('Phase 10C-2 helper boundary missing');
const helperSource=helperFile.slice(0,helperBoundary)
  .replace("import {simulateBundle} from '../phase-10b/simulate.mjs';\n",'')
  .replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname);",`const ROOT=${JSON.stringify(ROOT)};`)
  +'\nexport {phaseNineHarness,toolsFor,engineHarness,T0,replaceOnce};\n';
const helpers=await import('data:text/javascript;base64,'+Buffer.from(helperSource).toString('base64'));
const phaseNine=await helpers.phaseNineHarness(),baseHarness=helpers.engineHarness(phaseNine);
const schemaTwelveHarness=helpers.replaceOnce(baseHarness,'return value?.schemaVersion===11?value:null','return value?.schemaVersion===12?value:null','schema-12 active helper');
const facade=`    p11g:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,12),
      receipt:()=>clone(phaseElevenGReceipt(S)),
      available:id=>phaseElevenGFellowAvailable(id,S),
      availableIds:()=>FELLOW_DEFS.filter(def=>phaseElevenGFellowAvailable(def.id,S)).map(def=>def.id),
      combatPower:()=>totalFellowRosterPower(S),
      economyPower:()=>phaseTenCTwoFellowRosterPower(S),
      allCombatPower:()=>FELLOW_DEFS.reduce((total,def)=>safeAddInteger(total,power(def.id,S),'All Fellow combat Power'),0),
      allEconomyPower:()=>FELLOW_DEFS.reduce((total,def)=>safeAddInteger(total,phaseTenCTwoFellowEconomyPowerComponents(def.id,S).effectivePower,'All Fellow economy Power'),0),
      economyPowerLabel:()=>fmt(phaseTenCTwoFellowRosterPower(S)),
      economySummary:()=>phaseElevenGFellowEconomySummaryHtml(S),
      preview:id=>clone(campaignPreview(id,S)),
      campaignHtml:()=>campaignView(),
      campaignExpected:()=>{const preview=campaignPreview(S.fellowCampaign.selectedStageId,S);return{power:fmt(preview.totalRosterPower),cost:fmt(preview.efficiency.effectiveCost),discount:Math.round(preview.efficiency.discountRate*100)}},
      run:id=>runFellowCampaign(id,{confirmed:true,present:false}),
      roster:()=>rosterScreen(),
      lockedIds:()=>FELLOW_DEFS.filter(def=>!phaseElevenGFellowAvailable(def.id,S)).map(def=>def.id),
      codex:()=>phaseElevenDCodexSnapshot(S),
      route:id=>clone(playerRouteAccess(id,S)),
      target:(stageId,ordinal)=>phaseElevenGTarget(fellowCampaignStage(stageId),ordinal),
      featuredDraws:()=>Array.from({length:30},()=>weightedFeatured()),
      grant:(id,amount)=>qaGrant({resource:'fellowExp',id,amount}),
      grantShards:(id,amount)=>qaGrant({resource:'fellowShards',id,amount}),
      ascend:id=>ascendFellow(id),
      relicPreview:(id,relicId)=>clone(relicEquipPreview(id,relicId,S)),
      assign:(companionId,fellowId)=>assignCompanionToFellow(companionId,fellowId),
      raw:()=>PERSISTED_RAW,
      blocked:()=>clone(PERSISTENCE_BLOCKED)
    }),
`;
const harness=helpers.replaceOnce(schemaTwelveHarness,'    tamperClear(){',facade+'    tamperClear(){','Phase 11G facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const predecessorHtml=execFileSync('/usr/bin/git',['show',`${PHASE_ELEVEN_F_COMMIT}:index.html`],{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024,timeout:60000}),predecessorApplication=predecessorHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if(!application||!predecessorApplication)throw new Error('Everstead application script missing');
const source=tools.instrument(application),predecessorSource=tools.instrument(predecessorApplication);
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${!row.pass&&row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p11g.'+expression),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right),sum=values=>values.reduce((total,value)=>total+value,0);

const fresh=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true}),freshState=tools.active(fresh),freshReceipt=p(fresh,'receipt()');
add('fresh-activation-clean',fresh.thrown===null&&p(fresh,'blocked()')===null&&p(fresh,'valid().ok')===true,fresh.thrown?.message||p(fresh,'valid().errors'));
add('same-schema-profile-receipt',freshReceipt?.id==='phase-11g-roster-progression'&&freshReceipt.from===12&&freshReceipt.to===12&&freshReceipt.activationRevision===freshState.saveMeta.revision,freshReceipt);
add('fresh-gold-normalized',freshState.gold===50000,freshState.gold);
add('fresh-six-joined',same(p(fresh,'availableIds()'),['cael','lyra','orin','selene','rook','mira']),p(fresh,'availableIds()'));
add('featured-rotation-uses-joined-fellows',p(fresh,'featuredDraws()').every(id=>p(fresh,'availableIds()').includes(id)),p(fresh,'featuredDraws()'));
add('fresh-power-below-final-gate',p(fresh,'combatPower()')>=22000&&p(fresh,'combatPower()')<95000&&p(fresh,'combatPower()')<p(fresh,'allCombatPower()'),{joined:p(fresh,'combatPower()'),all:p(fresh,'allCombatPower()')});
add('campaign-gates-on-joined-power',p(fresh,"preview('broken-roads-1')").totalRosterPower===p(fresh,'combatPower()')&&p(fresh,"preview('broken-roads-1')").totalRosterPower<p(fresh,'allCombatPower()'),{campaign:p(fresh,"preview('broken-roads-1')").totalRosterPower,joined:p(fresh,'combatPower()'),all:p(fresh,'allCombatPower()')});
add('fresh-economy-power-excludes-future',p(fresh,'economyPower()')<p(fresh,'allEconomyPower()'),{joined:p(fresh,'economyPower()'),all:p(fresh,'allEconomyPower()')});
const roster=p(fresh,'roster()'),codex=p(fresh,'codex()');
add('all-portraits-visible-with-locks',(roster.match(/data-fellow=/g)||[]).length===18&&roster.includes('6/18')&&p(fresh,'lockedIds()').length===12,{portraits:(roster.match(/data-fellow=/g)||[]).length,locked:p(fresh,'lockedIds()')});
add('roster-shows-joined-economy-power',p(fresh,'economySummary()').includes(`${p(fresh,'economyPowerLabel()')} Village Fellow Economy Power`),{expected:p(fresh,'economyPowerLabel()'),summary:p(fresh,'economySummary()')});
add('codex-owned-count-is-six',codex.fellows.filter(item=>item.owned).length===6,codex.fellows.filter(item=>item.owned).map(item=>item.id));
add('expedition-waits-for-complete-roster',p(fresh,"route('fellowExpedition')").effectiveAccess===false&&p(fresh,"route('fellowExpedition')").requiredRank===5,p(fresh,"route('fellowExpedition')"));
add('locked-fellow-rejects-progression-attachments',p(fresh,"assign('wolf','zamorak')")===false&&p(fresh,"relicPreview('zamorak',null)").valid===false,{assignment:p(fresh,"assign('wolf','zamorak')"),relic:p(fresh,"relicPreview('zamorak',null)")});
const campaignHtml=p(fresh,'campaignHtml()'),campaignExpected=p(fresh,'campaignExpected()');
add('campaign-shows-joined-power-and-cost',campaignHtml.includes(`data-combat-fellow-roster-power="campaign">${campaignExpected.power}`)&&campaignHtml.includes(`<b>−${campaignExpected.discount}%</b><span>Efficiency`)&&campaignHtml.includes(`<b>${campaignExpected.cost}</b><span>Your Cost`)&&campaignHtml.includes(`BEGIN STAGE · ${campaignExpected.cost} GOLD`),{expected:campaignExpected,power:campaignHtml.match(/data-combat-fellow-roster-power="campaign">[^<]+/)?.[0],cost:campaignHtml.match(/<b>[^<]+<\/b><span>Your Cost/)?.[0]});

const pools=[];for(const stage of ['broken-roads-1','broken-roads-2','broken-roads-3','broken-roads-4','broken-roads-5','broken-roads-6','broken-roads-7','broken-roads-8','broken-roads-9','broken-roads-10'])for(let ordinal=0;ordinal<3;ordinal++)pools.push(p(fresh,`target('${stage}',${ordinal})`));
add('every-fellow-has-campaign-target',same([...new Set(pools)].sort(),Object.keys(freshState.fellows).sort()),[...new Set(pools)].sort());

const run1=p(fresh,"run('broken-roads-1')"),after1=tools.active(fresh),run2=p(fresh,"run('broken-roads-2')"),after2=tools.active(fresh),run3=p(fresh,"run('broken-roads-3')"),after3=tools.active(fresh);
add('stage-one-targets-kaladin',run1?.ok===true&&after1.fellows.cael.exp===120&&after1.fellows.cael.shards===2,{run1,receipt:after1.fellowCampaign.lastReceipt});
add('rank-two-joins-three',run2?.ok===true&&after2.player.rank===2&&same(p(fresh,'availableIds()').slice(0,9),['cael','lyra','orin','selene','rook','mira','zamorak','darrow','deadpool']),{rank:after2.player.rank,available:p(fresh,'availableIds()')});
add('stage-three-targets-new-fellow',run3?.ok===true&&after3.fellows.zamorak.exp===180&&after3.fellows.zamorak.shards===2,{run3,receipt:after3.fellowCampaign.lastReceipt,zamorak:after3.fellows.zamorak});
add('post-run-state-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));
const replay=p(fresh,"run('broken-roads-1')"),afterReplay=tools.active(fresh);
add('replay-rotates-target',replay?.ok===true&&afterReplay.fellows.lyra.exp===60&&afterReplay.fellowCampaign.lastReceipt.rewards.fellowExp.lyra===60,{replay,receipt:afterReplay.fellowCampaign.lastReceipt});
add('redirected-reward-projection-valid',p(fresh,'valid().ok')===true,p(fresh,'valid().errors'));
p(fresh,"grantShards('zamorak',18)");const ascended=p(fresh,"ascend('zamorak')"),afterAscend=tools.active(fresh);
add('post-activation-ascension-projects-safely',ascended?.ok===true&&afterAscend.fellows.zamorak.rarity===2&&p(fresh,'valid().ok')===true,{ascended,zamorak:afterAscend.fellows.zamorak,errors:p(fresh,'valid().errors')});

const pacing=tools.runRealm({...tools.freshOptions,applicationSource:source,now:T0+1000,deferTimers:true});let completed=0;for(const stage of Array.from({length:10},(_,index)=>`broken-roads-${index+1}`)){const result=p(pacing,`run('${stage}')`);if(!result?.ok)break;completed++}
add('fresh-campaign-stops-after-four-clears',completed===4&&tools.active(pacing).player.rank===3&&p(pacing,"preview('broken-roads-5')").goldReady===false,{completed,gold:tools.active(pacing).gold,rank:tools.active(pacing).player.rank,power:p(pacing,'combatPower()'),next:p(pacing,"preview('broken-roads-5')")});

const predecessor=tools.runRealm({...tools.freshOptions,applicationSource:predecessorSource,now:T0+2000,deferTimers:true});for(const id of ['cael','lyra','orin','selene','rook','mira'])p(predecessor,`grant('${id}',1000)`);p(predecessor,"grant('zamorak',100)");const preActivation=tools.active(predecessor),preActivationRaw=tools.activeRaw(predecessor),migrated=tools.runRealm({...tools.freshOptions,applicationSource:source,activeRaw:preActivationRaw,now:T0+3000,deferTimers:true}),migratedState=tools.active(migrated),migratedReceipt=p(migrated,'receipt()');
add('established-save-activates',migrated.thrown===null&&p(migrated,'blocked()')===null&&p(migrated,'valid().ok')===true,p(migrated,'valid().errors'));
add('catch-up-matches-weakest-starter',migratedReceipt.catchUpFloorLevel>1&&migratedReceipt.catchUpFloorExp>0&&migratedReceipt.catchUpExp.anakin===migratedReceipt.catchUpFloorExp&&migratedState.fellows.anakin.exp===migratedReceipt.catchUpFloorExp,{floor:migratedReceipt.catchUpFloorLevel,exp:migratedReceipt.catchUpFloorExp,anakin:migratedState.fellows.anakin});
add('meaningful-progress-grandfathered',migratedReceipt.grandfatheredFellowIds.includes('zamorak')&&p(migrated,"available('zamorak')")===true,{grandfathered:migratedReceipt.grandfatheredFellowIds,zamorak:migratedState.fellows.zamorak});
add('catch-up-does-not-touch-other-dimensions',migratedState.fellows.anakin.rarity===preActivation.fellows.anakin.rarity&&migratedState.fellows.anakin.shards===preActivation.fellows.anakin.shards&&migratedState.fellows.anakin.bond===preActivation.fellows.anakin.bond&&migratedState.gold===preActivation.gold,{before:preActivation.fellows.anakin,after:migratedState.fellows.anakin,gold:[preActivation.gold,migratedState.gold]});
const reload=tools.runRealm({applicationSource:source,initialSlots:Object.fromEntries(migrated.slots),now:T0+4000,deferTimers:true}),reloadState=tools.active(reload);
add('activation-idempotent-on-reload',reloadState.saveMeta.appliedMigrations.filter(item=>item.id==='phase-11g-roster-progression').length===1&&reloadState.fellows.anakin.exp===migratedState.fellows.anakin.exp&&p(reload,'valid().ok')===true,{receipts:reloadState.saveMeta.appliedMigrations.map(item=>item.id),exp:reloadState.fellows.anakin.exp});

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 11G focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;

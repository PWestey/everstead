import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const helperFile=readFileSync(resolve(ROOT,'qa/phase-10c2/engine-probe.mjs'),'utf8');
const helperBoundary=helperFile.indexOf('export async function runEngineProbe');
if(helperBoundary<0)throw new Error('Phase 10C-2 helper boundary missing');
const helperSource=helperFile.slice(0,helperBoundary)
  .replace("import {simulateBundle} from '../phase-10b/simulate.mjs';\n",'')
  .replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname);",`const ROOT=${JSON.stringify(ROOT)};`)
  +'\nexport {phaseNineHarness,toolsFor,engineHarness,T0,replaceOnce};\n';
const helpers=await import('data:text/javascript;base64,'+Buffer.from(helperSource).toString('base64'));
const phaseNine=await helpers.phaseNineHarness();
const baseHarness=helpers.engineHarness(phaseNine);
const harness=helpers.replaceOnce(baseHarness,'    tamperClear(){',`    p11d:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,11),
      runtime:()=>qaRuntimeSnapshot(),
      roster:(kind,sort='default',filter='all')=>clone(phaseElevenDRosterProjection(kind,{sort,filter},S)),
      rosterWith(kind,sort,filter,patch){const draft=clone(S),bucket=kind==='fellows'?draft.fellows:kind==='family'?draft.family:draft.companions;for(const [id,value]of Object.entries(patch||{}))Object.assign(bucket[id],value);return clone(phaseElevenDRosterProjection(kind,{sort,filter},draft))},
      familyPreview:(familyId,buildingId,at=runtimeNow())=>clone(phaseElevenDFamilyAssignmentPreview(familyId,buildingId,S,at)),
      familyPreviewHtml:(familyId,buildingId,at=runtimeNow())=>phaseElevenDFamilyAssignmentPreviewHtml(phaseElevenDFamilyAssignmentPreview(familyId,buildingId,S,at)),
      familyApply:(familyId,buildingId)=>clone(assignFamilyToBuilding(familyId,buildingId)),
      rates:(at=runtimeNow())=>({buildings:Object.fromEntries(BUILDING_DEFS.map(def=>[def.id,buildingRateComponents(def.id,S,at).rate])),total:totalRate(S,at)}),
      codex:()=>clone(phaseElevenDCodexSnapshot(S)),
      codexHtml:tab=>phaseElevenDCodexCategoryHtml(tab,phaseElevenDCodexSnapshot(S)),
      codexWithCleared(stageId){const draft=clone(S);if(!draft.fellowCampaign.clearedStageIds.includes(stageId))draft.fellowCampaign.clearedStageIds.push(stageId);const snapshot=phaseElevenDCodexSnapshot(draft);return{snapshot:clone(snapshot),html:phaseElevenDCodexCategoryHtml('relics',snapshot)}},
      more:()=>moreScreen(),
      prosperityInvariant(value,at=runtimeNow()){const before={rates:BUILDING_DEFS.map(def=>buildingRateComponents(def.id,S,at).rate),fellows:FELLOW_DEFS.map(def=>power(def.id,S)),companions:COMPANION_DEFS.map(def=>effectiveCompanionPowerComponents(def.id,S).effectivePower),campaign:campaignPreview(S.fellowCampaign.selectedStageId,S).totalRosterPower},draft=clone(S);draft.prosperity=value;const after={rates:BUILDING_DEFS.map(def=>buildingRateComponents(def.id,draft,at).rate),fellows:FELLOW_DEFS.map(def=>power(def.id,draft)),companions:COMPANION_DEFS.map(def=>effectiveCompanionPowerComponents(def.id,draft).effectivePower),campaign:campaignPreview(draft.fellowCampaign.selectedStageId,draft).totalRosterPower};return{same:JSON.stringify(before)===JSON.stringify(after),before,after}},
      completeDifficulty(difficulty){const oath=S.oaths.find(item=>item.type==='habit'||item.doneKey!==periodKey(item.type));if(!oath)return null;oath.difficulty=difficulty;const before={prosperity:S.prosperity,revision:S.saveMeta.revision,writes:PERSISTENCE_LOG.length};completeOath(oath.id);return{before,after:{prosperity:S.prosperity,revision:S.saveMeta.revision,writes:PERSISTENCE_LOG.length},oathId:oath.id,modal:document.querySelector('#overlay')?.innerHTML??'',undo:clone(S.undo)}},
      undo(){const remove=document.removeEventListener;document.removeEventListener=()=>{};try{return applyOathUndo()}finally{if(remove===undefined)delete document.removeEventListener;else document.removeEventListener=remove}},
      relicPreview:(fellowId,relicId)=>clone(relicEquipPreview(fellowId,relicId,S)),
      relicEquip:(fellowId,relicId)=>clone(equipRelic(fellowId,relicId,{confirmed:true,present:false})),
      companionPreview:(companionId,fellowId)=>clone(companionAssignmentPreview(companionId,fellowId,S)),
      companionApply:(companionId,fellowId)=>clone(assignCompanionToFellow(companionId,fellowId)),
      stale(value=true){PERSISTENCE_STALE=Boolean(value);return PERSISTENCE_STALE},
      block(value=true){PERSISTENCE_BLOCKED=value?{kind:'phase-11d-probe',message:'Injected blocked persistence'}:null;return Boolean(PERSISTENCE_BLOCKED)},
      raw:()=>PERSISTED_RAW,
      modal:()=>document.querySelector('#overlay')?.innerHTML??''
    }),
    tamperClear(){`,'Phase 11D facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8');
const application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if(!application)throw new Error('Everstead application script missing');
const source=tools.instrument(application),T0=helpers.T0;
const rows=[];
const add=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const active=run=>tools.active(run),p9=(run,expression)=>tools.internal(run,'p9.'+expression),p11d=(run,expression)=>tools.internal(run,'p11d.'+expression),writes=run=>tools.writes(run),image=run=>JSON.stringify(active(run));
const tracked=[],fresh=(options={})=>{const run=tools.runRealm(options.initialSlots?{applicationSource:source,now:T0,deferTimers:true,...options}:{...tools.freshOptions,applicationSource:source,now:T0,deferTimers:true,...options});tracked.push(run);return run};
const phase=application.slice(application.indexOf('/* Phase 11D ·'),application.lastIndexOf('const report=load();render();'));
add('static-phase-marker',phase.includes('ephemeral roster tools, comparison-first assignments, and read-only Codex'));
add('static-schema-neutral',!phase.includes('CURRENT_SCHEMA_VERSION=')&&!phase.includes('PRE_V12_BACKUP_KEY'));
add('static-no-new-persisted-mutation',!phase.includes('mutatePersisted(')&&!phase.includes('commitPrepared('));
add('static-roster-display-only-copy',phase.includes('Collection tools · display only')&&phase.includes('Browsing never changes or saves your game'));
add('static-no-type-role-counter-mechanic',!phase.includes('counterAdvantage')&&!phase.includes('balancedRoleMultiplier'));
add('static-explicit-family-apply',phase.includes('APPLY FREE ASSIGNMENT')&&phase.includes('NO ASSIGNMENT CHANGE'));
add('static-relic-delta-preview',phase.includes('REVIEW AND APPLY EQUIPMENT')&&phase.includes('Current Fellow Power stays the same'));
add('static-codex-six-tabs',same([...phase.matchAll(/\['(overview|fellows|family|companions|relics|journey)'/g)].slice(0,6).map(match=>match[1]),['overview','fellows','family','companions','relics','journey']));
add('static-numeric-data-attributes-exact',!phase.includes('.dataset.phase11d')&&phase.includes("getAttribute('data-phase-11d-codex-tab')"));
const codexSource=phase.slice(phase.indexOf('function phaseElevenDCodexSnapshot'),phase.indexOf('function phaseElevenDCodexRows'));
add('static-codex-pure-no-clock-save-rng',!codexSource.includes('runtimeNow')&&!codexSource.includes('mutatePersisted')&&!codexSource.includes('stableRandomUnit')&&!codexSource.includes('save('));
add('static-oath-prosperity-presentation',application.includes('· +${d.prosperity} Prosperity'));

const base=fresh();if(base.thrown)throw base.thrown;const baseState=image(base),baseWrites=writes(base),baseRevision=active(base).saveMeta.revision;
add('fresh-valid',base.thrown===null&&p11d(base,'valid().ok')===true,p11d(base,'valid().errors'));
add('fresh-no-native-storage',base.nativeCalls.length===0,base.nativeCalls);
const fellowDefault=p11d(base,"roster('fellows')"),fellowPower=p11d(base,"roster('fellows','power')"),fellowName=p11d(base,"roster('fellows','name')");
add('fellows-default-canonical',same(fellowDefault.orderedIds,['cael','lyra','orin','selene','rook','mira'])&&same(fellowDefault.visibleIds,fellowDefault.orderedIds),fellowDefault);
add('fellows-power-descending',same(fellowPower.orderedIds,['cael','lyra','orin','rook','selene','mira']),fellowPower);
add('fellows-name-ascending',same(fellowName.orderedIds,['cael','lyra','mira','orin','rook','selene']),fellowName);
add('fellows-level-ties-canonical',same(p11d(base,"roster('fellows','level').orderedIds"),fellowDefault.orderedIds));
add('fellows-rarity-ties-canonical',same(p11d(base,"roster('fellows','rarity').orderedIds"),fellowDefault.orderedIds));
add('fellows-role-filter',same(p11d(base,"roster('fellows','default','role:DPS').visibleIds"),['lyra','orin','rook']));
add('fellows-type-filter',same(p11d(base,"roster('fellows','default','type:Storm').visibleIds"),['cael','mira']));
add('fellows-combined-sort-filter',same(p11d(base,"roster('fellows','power','role:Support').visibleIds"),['selene','mira']));
const customLevels=p11d(base,`rosterWith('fellows','level','all',${JSON.stringify({cael:{level:2},lyra:{level:9},orin:{level:4}})})`);
add('fellows-fresh-state-rerender-projection',same(customLevels.orderedIds.slice(0,3),['lyra','orin','cael']),customLevels);
const familyDefault=p11d(base,"roster('family')");
add('family-default-canonical',same(familyDefault.orderedIds,['elara','tamsin','isolde']));
add('family-assigned-filter',same(p11d(base,"roster('family','default','assigned').visibleIds"),['elara','tamsin','isolde']));
add('family-unassigned-empty',p11d(base,"roster('family','default','unassigned').visible")===0);
add('family-intimacy-ties-canonical',same(p11d(base,"roster('family','intimacy').orderedIds"),familyDefault.orderedIds));
const familyCustom=p11d(base,`rosterWith('family','intimacy','unassigned',${JSON.stringify({elara:{intimacy:500,assignedBuildingId:null},tamsin:{intimacy:900,assignedBuildingId:null}})})`);
add('family-combined-sort-filter',same(familyCustom.visibleIds,['tamsin','elara']),familyCustom);
const companionDefault=p11d(base,"roster('companions')");
add('companions-default-canonical',same(companionDefault.orderedIds,['bramble','cinderwing']));
add('companions-power-descending',same(p11d(base,"roster('companions','power').orderedIds"),['cinderwing','bramble']));
add('companions-assigned-filter',p11d(base,"roster('companions','default','assigned').visible")===2);
add('companions-unassigned-empty',p11d(base,"roster('companions','default','unassigned').visible")===0);
const companionCustom=p11d(base,`rosterWith('companions','level','unassigned',${JSON.stringify({bramble:{level:9,assignedFellowId:null},cinderwing:{level:3,assignedFellowId:null}})})`);
add('companions-combined-sort-filter',same(companionCustom.visibleIds,['bramble','cinderwing']),companionCustom);
add('all-roster-projections-zero-write',image(base)===baseState&&writes(base)===baseWrites&&active(base).saveMeta.revision===baseRevision);

const codex=p11d(base,'codex()'),codexHtml=p11d(base,"codexHtml('overview')"),relicCodexHtml=p11d(base,"codexHtml('relics')");
add('codex-exact-collection-counts',codex.collectionCount===17&&codex.characterCount===11&&codex.fellows.length===6&&codex.family.length===3&&codex.companions.length===2&&codex.relics.length===6&&codex.buildings.length===4,codex);
add('codex-buildings-canonical-and-rendered',same(codex.buildings.map(item=>item.id),['training','command','archives','hearth'])&&codex.buildings.every(item=>codexHtml.includes(item.name)&&codexHtml.includes(`Level ${item.level}`)),codex.buildings);
add('codex-current-prosperity',codex.prosperity===120&&same(codex.prosperityAwards,{easy:2,medium:4,hard:7}),codex.prosperity);
add('codex-honest-prosperity-copy',codexHtml.includes('not spendable')&&codexHtml.includes('currently changes neither Gold nor Power')&&codexHtml.includes('Easy +2')&&codexHtml.includes('Hard +7'));
add('codex-no-invented-threshold',codexHtml.includes('unlock thresholds are not defined yet'));
add('codex-definitions-current',same(codex.fellows.map(item=>item.id),['cael','lyra','orin','selene','rook','mira'])&&same(codex.family.map(item=>item.id),['elara','tamsin','isolde'])&&same(codex.companions.map(item=>item.id),['bramble','cinderwing'])&&same(codex.relics.map(item=>item.id),['first-road-lantern','mossbound-compass','emberglass-sigil','tideglass-charm','stormforged-emblem','oathkeeper-crest']));
add('codex-fresh-locked-relic-first-clear-copy',relicCodexHtml.includes('First clear Village Toll in Fellow Campaign to acquire.'));
const retainedLocked=p11d(base,"codexWithCleared('broken-roads-1')");
add('codex-retained-clear-locked-relic-repeat-copy',retainedLocked.snapshot.relics[0].sourceCleared===true&&retainedLocked.snapshot.relics[0].owned===false&&retainedLocked.html.includes('Complete Village Toll in Fellow Campaign to acquire.')&&!retainedLocked.html.includes('First clear Village Toll in Fellow Campaign to acquire.'),retainedLocked.html);
add('codex-rank-access-authoritative',codex.rank.rank===1&&codex.unlocks.length===12&&codex.routes.find(item=>item.route==='fellowCampaign').access.effectiveAccess===true&&codex.routes.find(item=>item.route==='companionTower').access.effectiveAccess===false);
add('codex-no-oath-private-fields',!phase.includes('S.oaths')&&!phase.includes('.memo')&&!phase.includes('.notes'));
add('codex-and-more-zero-write',p11d(base,'more()').includes('OPEN CODEX · 17 ENTRIES')&&image(base)===baseState&&writes(base)===baseWrites);
for(const value of [0,120,999999]){const invariant=p11d(base,`prosperityInvariant(${value},${T0})`);add(`prosperity-${value}-no-gold-power-effect`,invariant.same,invariant)}

for(const [difficulty,award]of [['easy',2],['medium',4],['hard',7]]){const run=fresh(),before=image(run),result=p11d(run,`completeDifficulty('${difficulty}')`),after=active(run);add(`oath-${difficulty}-prosperity-award`,result&&result.after.prosperity-result.before.prosperity===award,result);add(`oath-${difficulty}-prosperity-rendered`,result?.modal.includes(`+${award} Prosperity`),result?.modal);add(`oath-${difficulty}-one-save`,result&&result.after.revision===result.before.revision+1&&after.saveMeta.source==='oath-complete');const undo=p11d(run,'undo()');add(`oath-${difficulty}-undo-restores-prosperity`,undo===true&&active(run).prosperity===result.before.prosperity&&p11d(run,'valid().ok')===true,{before,result,after:active(run).prosperity,errors:p11d(run,'valid().errors')});add(`oath-${difficulty}-completion-not-noop`,image(run)!==before)}

const familyPure=fresh(),familyPureState=image(familyPure),familyPureWrites=writes(familyPure),move=p11d(familyPure,`familyPreview('tamsin','command',${T0})`),replace=p11d(familyPure,`familyPreview('tamsin','archives',${T0})`),unassign=p11d(familyPure,`familyPreview(null,'training',${T0})`),noOp=p11d(familyPure,`familyPreview('tamsin','training',${T0})`),invalid=p11d(familyPure,`familyPreview('unknown','training',${T0})`);
add('family-preview-move-exact',move.valid&&!move.noOp&&move.priorBuildingId==='training'&&move.displacedFamilyId===null&&same(move.affectedBuildings.map(item=>item.buildingId),['training','command'])&&move.deltaTotalRate<0,move);
add('family-preview-replace-exact',replace.valid&&!replace.noOp&&replace.priorBuildingId==='training'&&replace.displacedFamilyId==='isolde'&&same(replace.affectedBuildings.map(item=>item.buildingId),['training','archives']),replace);
add('family-preview-unassign-exact',unassign.valid&&!unassign.noOp&&unassign.familyId===null&&unassign.affectedBuildings.length===1&&unassign.affectedBuildings[0].buildingId==='training'&&unassign.deltaTotalRate<0,unassign);
add('family-preview-noop',noOp.valid&&noOp.noOp&&noOp.deltaTotalRate===0,noOp);
add('family-preview-invalid',invalid.valid===false);
add('family-preview-copy-current-projected',p11d(familyPure,`familyPreviewHtml('tamsin','command',${T0})`).includes('Current')===false&&p11d(familyPure,`familyPreviewHtml('tamsin','command',${T0})`).includes('Gold/hr'));
add('family-preview-zero-write',image(familyPure)===familyPureState&&writes(familyPure)===familyPureWrites);
const familyApply=fresh(),familyApplyBefore=active(familyApply),familyApplyWrites=writes(familyApply),familyApplied=p11d(familyApply,"familyApply('tamsin','command')"),familyApplyAfter=active(familyApply);
add('family-apply-one-transaction',familyApplied?.ok===true&&familyApplyAfter.saveMeta.revision===familyApplyBefore.saveMeta.revision+1&&familyApplyAfter.saveMeta.source==='family-assignment'&&writes(familyApply)>familyApplyWrites);
add('family-apply-atomic-move',familyApplyAfter.family.tamsin.assignedBuildingId==='command'&&familyApplyAfter.family.elara.assignedBuildingId==='hearth'&&familyApplyAfter.family.isolde.assignedBuildingId==='archives',familyApplyAfter.family);
add('family-apply-valid',p11d(familyApply,'valid().ok')===true,p11d(familyApply,'valid().errors'));
for(const scenario of [{id:'move',familyId:'tamsin',buildingId:'command'},{id:'replace',familyId:'tamsin',buildingId:'archives'},{id:'unassign',familyId:null,buildingId:'training'}]){const run=fresh(),preview=p11d(run,`familyPreview(${JSON.stringify(scenario.familyId)},'${scenario.buildingId}',${T0})`),applied=p11d(run,`familyApply(${JSON.stringify(scenario.familyId)},'${scenario.buildingId}')`),rates=p11d(run,`rates(${T0})`),matches=preview.affectedBuildings.every(item=>Object.is(rates.buildings[item.buildingId],item.projectedRate))&&Object.is(rates.total,preview.projectedTotalRate);add(`family-${scenario.id}-preview-equals-commit`,preview.valid&&!preview.noOp&&applied?.ok===true&&matches,{preview,rates})}
add('family-empty-target-noop',p11d(familyPure,`familyPreview(null,'command',${T0})`).noOp===true);
for(const mode of ['stale','blocked']){const run=fresh(),before=image(run),raw=p11d(run,'raw()'),writeCount=writes(run);p11d(run,mode==='stale'?'stale()':'block()');const result=p11d(run,"familyApply('tamsin','command')");add(`family-${mode}-refusal-safe`,result?.ok===false&&image(run)===before&&p11d(run,'raw()')===raw&&writes(run)===writeCount,{result,runtime:p11d(run,'runtime()')})}
const familyFault=fresh(),familyFaultBefore=image(familyFault),familyFaultRaw=familyFault.slots.get(tools.keys.active);Object.assign(familyFault.fault,{enabled:true,operation:'setItem',key:null,step:'staging-write',remaining:1,skip:0,adapterOnly:false});const familyFaultResult=p11d(familyFault,"familyApply('tamsin','command')");add('family-apply-write-fault-safe',familyFault.fault.remaining===0&&familyFaultResult?.ok===false&&image(familyFault)===familyFaultBefore&&familyFault.slots.get(tools.keys.active)===familyFaultRaw&&p11d(familyFault,'runtime().blocked')!==null,{result:familyFaultResult,blocked:p11d(familyFault,'runtime().blocked')});

function acquireRelics(run,count){p9(run,"grant('gold',5000000)");p9(run,"named('navigate',{view:'adventure'})");for(let ordinal=1;ordinal<=count;ordinal++)if(!p9(run,`run('broken-roads-${ordinal}',{confirmed:true,present:false})`).ok)throw new Error(`Relic fixture stage ${ordinal} failed`)}
const relic=fresh();acquireRelics(relic,2);const relicState=image(relic),relicWrites=writes(relic),equipPreview=p11d(relic,"relicPreview('cael','first-road-lantern')"),lockedPreview=p11d(relic,"relicPreview('cael','stormforged-emblem')");
add('relic-preview-equip-delta',equipPreview.valid&&!equipPreview.noOp&&same(equipPreview.affected,['cael'])&&equipPreview.after.cael>equipPreview.before.cael,equipPreview);
add('relic-preview-locked-refused',lockedPreview.valid===false&&lockedPreview.reason==='Relic is locked',lockedPreview);
add('relic-preview-zero-write',image(relic)===relicState&&writes(relic)===relicWrites);
const equipBefore=active(relic),equipWrites=writes(relic),equipped=p11d(relic,"relicEquip('cael','first-road-lantern')");add('relic-equip-one-transaction',equipped?.ok===true&&active(relic).saveMeta.revision===equipBefore.saveMeta.revision+1&&active(relic).saveMeta.source==='relic-equip'&&writes(relic)>equipWrites&&active(relic).fellows.cael.relicSlots[0]==='first-road-lantern');
const noOpRelic=p11d(relic,"relicPreview('cael','first-road-lantern')");add('relic-equipped-noop',noOpRelic.valid&&noOpRelic.noOp,noOpRelic);
const moveRelic=p11d(relic,"relicPreview('lyra','first-road-lantern')");add('relic-move-previews-both-fellows',moveRelic.valid&&same(moveRelic.affected,['lyra','cael'])&&moveRelic.after.cael<moveRelic.before.cael&&moveRelic.after.lyra>moveRelic.before.lyra,moveRelic);
p11d(relic,"relicEquip('lyra','first-road-lantern')");add('relic-move-atomic',active(relic).fellows.cael.relicSlots[0]===null&&active(relic).fellows.lyra.relicSlots[0]==='first-road-lantern'&&p11d(relic,'valid().ok')===true);
const replaceRelic=p11d(relic,"relicPreview('lyra','mossbound-compass')");add('relic-replace-preview',replaceRelic.valid&&replaceRelic.currentRelicId==='first-road-lantern'&&replaceRelic.priorOwnerId===null&&same(replaceRelic.affected,['lyra']),replaceRelic);
p11d(relic,"relicEquip('lyra','mossbound-compass')");add('relic-replace-atomic',active(relic).fellows.lyra.relicSlots[0]==='mossbound-compass'&&active(relic).fellows.cael.relicSlots[0]===null&&p11d(relic,'valid().ok')===true);
const unequip=p11d(relic,"relicPreview('lyra',null)");add('relic-unequip-preview',unequip.valid&&!unequip.noOp&&unequip.after.lyra<unequip.before.lyra,unequip);p11d(relic,"relicEquip('lyra',null)");add('relic-unequip-atomic',active(relic).fellows.lyra.relicSlots[0]===null&&p11d(relic,'valid().ok')===true);
for(const mode of ['stale','blocked','fault']){const run=fresh();acquireRelics(run,1);const before=image(run),raw=p11d(run,'raw()'),writeCount=writes(run);if(mode==='stale')p11d(run,'stale()');else if(mode==='blocked')p11d(run,'block()');else Object.assign(run.fault,{enabled:true,operation:'setItem',key:null,step:'staging-write',remaining:1,skip:0,adapterOnly:false});const result=p11d(run,"relicEquip('cael','first-road-lantern')");add(`relic-${mode}-refusal-safe`,result?.ok===false&&image(run)===before&&p11d(run,'raw()')===raw&&writes(run)===writeCount&&(mode!=='fault'||run.fault.remaining===0),{result,runtime:p11d(run,'runtime()')})}

const companion=fresh(),companionState=image(companion),companionWrites=writes(companion),brambleTarget=active(companion).companions.bramble.assignedFellowId,companionNoOp=p11d(companion,`companionPreview('bramble','${brambleTarget}')`),companionMove=p11d(companion,"companionPreview('bramble','cael')");
add('companion-current-preview-no-power-change',companionNoOp.affectedFellows.every(item=>item.delta===0),companionNoOp);
add('companion-move-preview-still-authoritative',companionMove.affectedFellows.some(item=>item.delta!==0),companionMove);
add('companion-preview-zero-write',image(companion)===companionState&&writes(companion)===companionWrites);
const companionBefore=active(companion),companionApplied=p11d(companion,"companionApply('bramble','cael')"),companionAfter=active(companion),companionProjected=Object.fromEntries(companionMove.affectedFellows.map(item=>[item.fellowId,item.projectedPower]));add('companion-apply-one-transaction-and-displacement',companionApplied?.ok===true&&companionAfter.saveMeta.revision===companionBefore.saveMeta.revision+1&&companionAfter.saveMeta.source==='companion-assignment'&&companionAfter.companions.bramble.assignedFellowId==='cael'&&companionAfter.companions.cinderwing.assignedFellowId===null,companionAfter.companions);add('companion-preview-equals-commit',Object.entries(companionProjected).every(([id,value])=>p11d(companion,`codex().fellows.find(item=>item.id==='${id}').power`)===value),companionProjected);
const companionNoOpRun=fresh(),companionNoOpBefore=image(companionNoOpRun),companionNoOpWrites=writes(companionNoOpRun);p11d(companionNoOpRun,"companionPreview('bramble','orin')");add('companion-ui-noop-prerequisite-zero-write',image(companionNoOpRun)===companionNoOpBefore&&writes(companionNoOpRun)===companionNoOpWrites&&phase.includes("button.disabled=!result||noOp"));
for(const mode of ['stale','blocked','fault']){const run=fresh(),before=image(run),raw=p11d(run,'raw()'),writeCount=writes(run);if(mode==='stale')p11d(run,'stale()');else if(mode==='blocked')p11d(run,'block()');else Object.assign(run.fault,{enabled:true,operation:'setItem',key:null,step:'staging-write',remaining:1,skip:0,adapterOnly:false});const result=p11d(run,"companionApply('bramble','cael')");add(`companion-${mode}-refusal-safe`,result?.ok===false&&image(run)===before&&p11d(run,'raw()')===raw&&writes(run)===writeCount&&(mode!=='fault'||run.fault.remaining===0),{result,runtime:p11d(run,'runtime()')})}

add('all-realms-native-storage-zero',tracked.every(run=>run.nativeCalls.length===0),tracked.flatMap(run=>run.nativeCalls));
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`Phase 11D focused probe: ${passed}/${rows.length}`);
if(passed!==rows.length)process.exitCode=1;

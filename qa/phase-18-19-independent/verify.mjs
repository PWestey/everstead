import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname);
const QA=resolve(ROOT,'qa/phase-18-19-independent');
const BASE='70201ab52e6e3510747bee1a977794a8c900bdd1';
const PACKAGE_ONLY=process.argv.includes('--package-only');
const EXPECTED=['README.md','checksums.sha256','fixtures/contract-fixtures.json','fixtures/inherited-hashes.json','index.html','realm.html','realm.js','runner.js','verify.mjs'];
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const read=item=>readFileSync(resolve(ROOT,item));
const text=item=>read(item).toString('utf8');
const json=item=>JSON.parse(text(item));
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const unique=values=>new Set(values).size===values.length;
const sorted=values=>[...new Set(values)].sort();
const git=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:128*1024*1024});
const gitBytes=args=>execFileSync('/usr/bin/git',args,{cwd:ROOT,maxBuffer:256*1024*1024});
const baseRead=item=>gitBytes(['show',`${BASE}:${item}`]);

const fixtures=json('qa/phase-18-19-independent/fixtures/contract-fixtures.json');
const inherited=json('qa/phase-18-19-independent/fixtures/inherited-hashes.json');
const apothecary=json('design/phase-18-19/apothecary-definitions.json');
const schoolhouse=json('design/phase-18-19/schoolhouse-definitions.json');
const cast=json('design/phase-18-19/cast-bindings.json');
const tutorials=json('design/phase-18-19/tutorial-bindings.json');
const designFixtures=json('design/phase-18-19/fixtures.json');
const unlocks=json('design/phase-17/facility-unlocks.json');
const phase14=json('design/phase-14/facility-definitions.json');
const phase13Tutorials=json('design/phase-13/tutorial-matrix.json');

function filesBelow(directory,prefix=''){
  const paths=[];
  for(const name of readdirSync(directory)){
    const absolute=resolve(directory,name),item=prefix?`${prefix}/${name}`:name;
    if(statSync(absolute).isDirectory())paths.push(...filesBelow(absolute,item));else paths.push(item);
  }
  return paths.sort();
}

function productionSources(){
  const files=[];
  function visit(directory,prefix=''){
    for(const entry of readdirSync(directory,{withFileTypes:true})){
      if(!prefix&&['.git','assets','design','docs','qa'].includes(entry.name))continue;
      const item=prefix?`${prefix}/${entry.name}`:entry.name,absolute=resolve(directory,entry.name);
      if(entry.isDirectory())visit(absolute,item);else if(/\.(?:html|m?js|json)$/.test(item))files.push(item);
    }
  }
  visit(ROOT);
  return files.sort();
}

const ids=items=>items.map(item=>item.id);
const everyNull=value=>{
  if(value===null)return true;
  if(Array.isArray(value))return value.every(everyNull);
  if(value&&typeof value==='object')return Object.values(value).every(everyNull);
  return false;
};

record('base-commit-reachable',git(['merge-base','--is-ancestor',BASE,'HEAD'])==='');
record('package-topology',same(filesBelow(QA),EXPECTED),filesBelow(QA));
const checksumRows=existsSync(resolve(QA,'checksums.sha256'))?text('qa/phase-18-19-independent/checksums.sha256').trim().split('\n').filter(Boolean).map(line=>{const match=line.match(/^([0-9a-f]{64})  (.+)$/);return match?{expected:match[1],item:match[2]}:null}):[];
const checksumFailures=checksumRows.filter(item=>!item||!existsSync(resolve(ROOT,item.item))||sha(read(item.item))!==item.expected).map(item=>item?.item||'malformed');
record('package-checksums',checksumRows.length===10&&checksumFailures.length===0,{count:checksumRows.length,failures:checksumFailures});
record('contract-and-result-documents',['docs/PHASE_18_19_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_18_19_INDEPENDENT_QA_RESULT.md'].every(item=>existsSync(resolve(ROOT,item))));

const contract=text('docs/PHASE_18_19_INDEPENDENT_QA_CONTRACT.md');
record('contract-scope-is-qa-only',['does not implement a production engine','approve currently null product values','exact preimplementation failures','may not expose production internals, install a fake engine'].every(value=>contract.includes(value)));
record('contract-apothecary-distinct-flow',['nonterminal `apothecary.outcome.recheck`','terminal positive `apothecary.outcome.supportive`','terminal positive `apothecary.outcome.precise`','no terminal failure band','pays nothing until Claim'].every(value=>contract.includes(value)));
record('contract-schoolhouse-persistent-flow',['persists across multiple claimed lessons','zero or one owned eligible Family member','no-mentor always preserves the full baseline','Family Intimacy, shards, rarity, assignment, Bond, story, and ownership bytes are never consumed or mutated'].every(value=>contract.includes(value)));
record('contract-graduation-v2-exact',['reward.offer.facility.schoolhouse.graduation.<pupilId>.v<definitionVersion>','domainClaimKind: schoolhouse-graduation','schoolhouseGraduationFinalizerV1','graduatedPupilIds','graduationReceiptIdByPupilId'].every(value=>contract.includes(value)));
record('contract-offline-concurrency-recovery',['never expire','two-client','fresh, migrated, offline, recovery, import, future, corrupt','512 recent receipts','folds 128','24 elapsed-hour offline cap'].every(value=>contract.includes(value)));
record('contract-five-realms-actual-dom',['320×568','390×844','1024×768','130-percent copy','reduced motion','actual DOM nodes/styles','44×44','focus entry and return','Escape'].every(value=>contract.includes(value)));
record('contract-cast-tutorial-passive',['exact nine accepted tutorial IDs','exact ten-actor subset','A locked Fellow never speaks','original four Buildings\' passive Gold production and Family assignments'].every(value=>contract.includes(value)));
record('contract-player-and-original-visual-boundary',['separate Player Character `player.wayfarer`','not a Fellow, Family member, or Companion','never receives those roster assignments, shards, rarity, or facility-speaker scheduling','does not ingest reference art','copying another game\'s assets or trade dress','never as an unframed Village dialogue overlay'].every(value=>contract.includes(value)));
record('contract-no-restaurant-value-reuse',contract.includes('may not import Restaurant customer, preference, recipe, station, preparation, stock, reputation, match, visitor-profit, or pricing structures')&&contract.includes('may not substitute for null'));

record('fixture-provenance',fixtures.contractVersion===1&&fixtures.bridgeVersion==='phase-18-19-independent-qa-v1'&&fixtures.baseCommit===BASE&&fixtures.schemaVersion===12);
record('fixture-distinct-facility-identities',fixtures.facilities.apothecary.facilityId==='facility.apothecary'&&fixtures.facilities.schoolhouse.facilityId==='facility.schoolhouse'&&fixtures.facilities.apothecary.activityId!==fixtures.facilities.schoolhouse.activityId&&fixtures.facilities.apothecary.mapAnchor==='eastern-plaza'&&fixtures.facilities.schoolhouse.mapAnchor==='eastern-plaza');
record('fixture-apothecary-cardinality',fixtures.apothecary.caseIds.length===3&&fixtures.apothecary.clueIds.length===9&&fixtures.apothecary.diagnosisIds.length===3&&fixtures.apothecary.remedyIds.length===4&&fixtures.apothecary.outcomeIds.length===3&&unique(Object.values(fixtures.apothecary).flat()));
record('fixture-schoolhouse-cardinality',fixtures.schoolhouse.domainIds.length===3&&fixtures.schoolhouse.approachIds.length===3&&fixtures.schoolhouse.lessonIds.length===3&&fixtures.schoolhouse.pupilIds.length===3&&fixtures.schoolhouse.outcomeIds.length===2);
record('fixture-three-finalizers-graduation-v2',fixtures.finalizers.length===3&&unique(fixtures.finalizers.map(item=>`${item.sourceId}:${item.domainClaimKind}`))&&fixtures.schoolhouse.graduationOfferTemplate.endsWith('.v<definitionVersion>')&&fixtures.schoolhouse.graduationDomainClaimKind==='schoolhouse-graduation');
record('fixture-exact-nine-tutorials-ten-actors',fixtures.tutorialIds.length===9&&fixtures.actorIds.length===10&&unique(fixtures.tutorialIds)&&unique(fixtures.actorIds)&&fixtures.facilityActorIds['facility.apothecary'].length===6&&fixtures.facilityActorIds['facility.schoolhouse'].length===5&&fixtures.actorIds.filter(id=>id==='family.aerith').length===1);
record('fixture-player-wayfarer-separate',fixtures.protagonist.id==='player.wayfarer'&&fixtures.protagonist.kind==='player-character'&&same(fixtures.protagonist.excludedRosterKinds,['fellow','family','companion'])&&fixtures.protagonist.forbidAssignment===true&&fixtures.protagonist.forbidShards===true&&fixtures.protagonist.facilitySpeakerEligible===false&&!fixtures.actorIds.includes(fixtures.protagonist.id));
record('fixture-original-visual-polish-boundary',fixtures.visualPolishBoundary.requiresSemanticFacilitySheets===true&&fixtures.visualPolishBoundary.forbidReferenceAssetIngestion===true&&fixtures.visualPolishBoundary.forbidReferenceTradeDressCopy===true&&fixtures.visualPolishBoundary.forbidUnframedFullBackgroundVillageDialogue===true);
record('fixture-schoolhouse-tutorial-segmentation',same(fixtures.schoolhouseFirstLessonSegments,[{trigger:'schoolhouse-first-visit',stepIds:['seats','pupil']},{trigger:'schoolhouse-first-lesson-ready',stepIds:['banked-lessons']},{trigger:'schoolhouse-first-teaching-opened',stepIds:['teach']}]));
record('fixture-qa-only-policy-distinct',fixtures.syntheticPolicy.qaOnly===true&&fixtures.syntheticPolicy.requiresIsolatedStorage===true&&fixtures.syntheticPolicy.neverProductionFallback===true&&fixtures.syntheticPolicy.apothecary.intervalMs!==fixtures.syntheticPolicy.schoolhouse.intervalMs&&fixtures.syntheticPolicy.apothecary.bankCapacity!==fixtures.syntheticPolicy.schoolhouse.bankCapacity);
record('fixture-state-risk-matrices',Object.keys(fixtures.saveFixtures).length===22&&unique(Object.values(fixtures.saveFixtures))&&fixtures.invalidMutationChecks.length===16&&unique(fixtures.invalidMutationChecks)&&fixtures.concurrencyKinds.length===8&&unique(fixtures.concurrencyKinds));
record('fixture-archive-offline-passive',same(fixtures.archivePolicy,{configId:'claim-archive.phase-15.v1',recentReceiptLimit:512,foldBatchSize:128,expectedRecentAfterNextClaim:385,expectedThroughAfterNextClaim:128})&&fixtures.offlineCapMs===86400000&&fixtures.originalPassiveFacilityIds.length===4);
record('fixture-five-realms',fixtures.viewports.length===5&&fixtures.viewports.some(item=>item.width===320&&item.height===568)&&fixtures.viewports.some(item=>item.width===390&&item.height===844)&&fixtures.viewports.some(item=>item.width===1024&&item.height===768)&&fixtures.viewports.some(item=>item.copyScale===1.3)&&fixtures.viewports.some(item=>item.reducedMotion));
record('fixture-thirteen-candidate-boundaries',fixtures.expectedCandidateFailureIds.length===13&&unique(fixtures.expectedCandidateFailureIds));

record('design-apothecary-identities',apothecary.configId===fixtures.facilities.apothecary.configId&&apothecary.definitionSetId===fixtures.facilities.apothecary.definitionSetId&&apothecary.facility.id===fixtures.facilities.apothecary.facilityId&&apothecary.facility.activityId===fixtures.facilities.apothecary.activityId&&apothecary.opportunityDefinition.id===fixtures.facilities.apothecary.opportunityDefinitionId);
record('design-apothecary-content-exact',same(ids(apothecary.caseTemplates),fixtures.apothecary.caseIds)&&same(ids(apothecary.clues),fixtures.apothecary.clueIds)&&same(ids(apothecary.diagnoses),fixtures.apothecary.diagnosisIds)&&same(ids(apothecary.remedies),fixtures.apothecary.remedyIds)&&same(ids(apothecary.outcomeBands),fixtures.apothecary.outcomeIds));
record('design-apothecary-forgiving',apothecary.outcomeBands[0].id==='apothecary.outcome.recheck'&&apothecary.outcomeBands[0].terminal===false&&apothecary.outcomeBands[0].rewards===null&&apothecary.outcomeBands.slice(1).every(item=>item.terminal===true)&&!apothecary.outcomeBands.some(item=>/fail/i.test(item.id)));
record('design-schoolhouse-identities',schoolhouse.configId===fixtures.facilities.schoolhouse.configId&&schoolhouse.definitionSetId===fixtures.facilities.schoolhouse.definitionSetId&&schoolhouse.facility.id===fixtures.facilities.schoolhouse.facilityId&&schoolhouse.facility.activityId===fixtures.facilities.schoolhouse.activityId&&schoolhouse.opportunityDefinition.id===fixtures.facilities.schoolhouse.opportunityDefinitionId);
record('design-schoolhouse-content-exact',same(ids(schoolhouse.developmentDomains),fixtures.schoolhouse.domainIds)&&same(ids(schoolhouse.teachingApproaches),fixtures.schoolhouse.approachIds)&&same(ids(schoolhouse.lessons),fixtures.schoolhouse.lessonIds)&&same(ids(schoolhouse.pupils),fixtures.schoolhouse.pupilIds)&&same(ids(schoolhouse.lessonOutcomeBands),fixtures.schoolhouse.outcomeIds));
record('design-nonexpiring-manual',apothecary.opportunityDefinition.expires===false&&apothecary.opportunityDefinition.claimMode==='manual'&&schoolhouse.opportunityDefinition.expires===false&&schoolhouse.opportunityDefinition.claimMode==='manual'&&schoolhouse.seatPolicy.candidatePupilsExpire===false);
record('design-family-positive-only',schoolhouse.familyRelationshipModifierPolicy.stackLimit===1&&schoolhouse.familyRelationshipModifierPolicy.positiveOnly===true&&schoolhouse.familyRelationshipModifierPolicy.absenceUsesBaseline===true&&schoolhouse.familyRelationshipModifierPolicy.consumesOrMutatesRelationship===false&&schoolhouse.familyRelationshipModifierPolicy.sourceStatId==='family.intimacy');
record('design-graduation-one-shot',schoolhouse.graduationDefinitions.length===1&&schoolhouse.graduationDefinitions[0].id===fixtures.schoolhouse.graduationDefinitionId&&schoolhouse.graduationDefinitions[0].claimMode==='manual'&&schoolhouse.graduationDefinitions[0].exactlyOncePerPupil===true&&schoolhouse.historyPolicy.graduationReplayAuthority.includes('graduatedPupilIds'));
record('design-null-policies-fail-closed',apothecary.productionEnabled===false&&schoolhouse.productionEnabled===false&&Object.values(apothecary.facility.operational).filter(value=>value!=='requires-approval').every(value=>value===null)&&Object.values(schoolhouse.facility.operational).filter(value=>value!=='requires-approval').every(value=>value===null)&&apothecary.outcomeBands.every(item=>item.rewards===null&&item.masteryProgress===null)&&schoolhouse.lessonOutcomeBands.every(item=>item.rewards===null&&item.developmentProgress===null&&item.educationProgress===null)&&schoolhouse.graduationDefinitions.every(item=>item.majorRewards===null&&item.educationModifierDelta===null));
record('design-not-restaurant-reskins',![...Object.keys(apothecary),...Object.keys(schoolhouse)].some(key=>['customers','preferences','recipes','stations','stock','reputation','preparation'].includes(key))&&apothecary.opportunityDefinition.interactionKind==='clue-diagnosis-remedy'&&schoolhouse.opportunityDefinition.interactionKind==='seat-pupil-lesson-teaching');
record('design-nine-tutorials-exact',tutorials.sourceLedgerCount===79&&same(tutorials.bindings.map(item=>item.tutorialId),fixtures.tutorialIds)&&tutorials.bindings.every(item=>typeof item.delivery==='string'&&item.stepSegments.length>=1)&&tutorials.globalRules.some(rule=>rule.includes('Skip and replay'))&&tutorials.globalRules.some(rule=>rule.includes('never block')));
const firstLesson=tutorials.bindings.find(item=>item.tutorialId==='tutorial.facility.schoolhouse.first-lesson');
record('design-tutorial-segmentation-exact',same(firstLesson.stepSegments,fixtures.schoolhouseFirstLessonSegments));
record('design-ten-cast-exact',same(sorted(cast.actors.map(item=>item.actorId)),sorted(fixtures.actorIds))&&cast.actors.length===10&&cast.presentationPolicy.includes('unframed full-background profile art is forbidden'));
record('design-52-risk-fixtures',designFixtures.fixtures.length===52&&unique(ids(designFixtures.fixtures))&&['migration','offline','multi-tab','archive','corruption','mobile','reduced-motion'].every(category=>designFixtures.fixtures.some(item=>item.category===category)));
const ledgerIds=phase13Tutorials.tutorials.map(item=>item.id);
record('tutorial-ledger-references-resolve',phase13Tutorials.tutorials.length===79&&fixtures.tutorialIds.every(id=>ledgerIds.includes(id)));
const originalPassive=unlocks.facilityUnlocks.filter(item=>fixtures.originalPassiveFacilityIds.includes(item.facilityId));
record('original-four-passive-policy-frozen',originalPassive.length===4&&originalPassive.every(item=>item.passivePolicy==='preserve-existing-building-production-and-family-assignment'));
record('phase14-envelope-exact',phase14.configId==='phase-14-facility-framework-v1'&&phase14.opportunityDefinitions.length===12&&phase14.opportunityDefinitions.every(item=>item.expires===false&&item.claimMode==='manual'));

const designRun=spawnSync('/usr/bin/python3',['design/phase-18-19/validate.py'],{cwd:ROOT,encoding:'utf8'});
record('accepted-design-validator-40-of-40',designRun.status===0&&designRun.stdout.includes('SUMMARY 40/40 checks; 3 cases; 2 named patients; 3 pupils; 3 lessons; 9 tutorials; 10 actors; 52 fixtures'),designRun.stdout.trim().split('\n').at(-1));
const inheritedFailures=Object.entries(inherited.files).filter(([item,expected])=>{try{return sha(baseRead(item))!==expected}catch{return true}}).map(([item])=>item);
record('inherited-accepted-files-byte-frozen',inherited.baseCommit===BASE&&Object.keys(inherited.files).length===45&&inheritedFailures.length===0,{count:Object.keys(inherited.files).length,failures:inheritedFailures});

const realmSource=text('qa/phase-18-19-independent/realm.js');
record('runner-isolated-fail-closed',realmSource.includes('allowDestructive:true')&&realmSource.includes('isolatedStorage:true')&&realmSource.includes('phase18-19-contract-unavailable')&&realmSource.includes('if(!qa){')&&!realmSource.includes('fakeEngine'));
record('runner-loads-real-candidate',realmSource.includes("fetch('../../index.html'")&&realmSource.includes('document.write(source)')&&realmSource.includes('__EVERSTEAD_PHASE_18_19_QA__'));
record('runner-actual-dom-contract',['document.querySelector','document.querySelectorAll','getBoundingClientRect','getComputedStyle','document.activeElement','KeyboardEvent','scrollWidth'].every(value=>realmSource.includes(value)));
record('runner-core-behavior-coverage',['apothecary-recheck-nonterminal-rewardless','apothecary-claim-exactly-once','schoolhouse-lessons-bank-without-pupil','schoolhouse-engagement-resumes-exactly','family-bytes-never-mutated-by-mentor','graduation-v2-exactly-once-seat-release','two-client-${kind}-one-winner','v2-archive-fold-preserves-domain-authority','offline-cap-banks-only-no-agency','player-wayfarer-separate-from-collectible-rosters','actual-dom-apothecary-focus-keyboard-escape-controls','passive-original-four-gold-oaths-family-preserved'].every(value=>realmSource.includes(value)));
for(const item of ['verify.mjs','runner.js','realm.js']){
  const run=spawnSync(process.execPath,['--check',`qa/phase-18-19-independent/${item}`],{cwd:ROOT,encoding:'utf8'});
  record(`syntax-${item}`,run.status===0,run.stderr.trim());
}

if(PACKAGE_ONLY){
  const artifact=baseRead('index.html');
  record('exact-frozen-base-artifact',sha(artifact)===inherited.files['index.html']&&artifact.length===1126624,{sha256:sha(artifact),byteLength:artifact.length});
  record('base-has-predecessors-no-phase18-19',artifact.includes(Buffer.from('__EVERSTEAD_PHASE_12_QA__'))&&artifact.includes(Buffer.from('__EVERSTEAD_PHASE_13_QA__'))&&!artifact.includes(Buffer.from('__EVERSTEAD_PHASE_18_19_QA__')));
}else{
  const paths=productionSources(),combined=paths.map(item=>text(item)).join('\n');
  const hasBridge=combined.includes('__EVERSTEAD_PHASE_18_19_QA__')&&combined.includes(fixtures.bridgeVersion);
  const candidate=[];
  candidate.push(['candidate-phase18-19-bridge-contract',hasBridge&&combined.includes('allowDestructive')&&combined.includes('isolatedStorage')&&combined.includes('NATIVE_STORAGE')]);
  candidate.push(['candidate-predecessor-v2-runtime-seams',hasBridge&&combined.includes(fixtures.predecessor.phase12ActivationId)&&combined.includes(fixtures.predecessor.phase15ArchiveConfigId)&&combined.includes(fixtures.predecessor.phase17StoryRegistryId)]);
  candidate.push(['candidate-apothecary-config-runtime',hasBridge&&combined.includes(fixtures.facilities.apothecary.configId)&&combined.includes(fixtures.facilities.apothecary.definitionSetId)&&fixtures.apothecary.caseIds.every(id=>combined.includes(id))]);
  candidate.push(['candidate-apothecary-distinct-lifecycle',hasBridge&&['beginApothecary','chooseDiagnosis','chooseRemedy','resolveApothecary','apothecary.outcome.recheck','apothecary.outcome.supportive','apothecary.outcome.precise'].every(value=>combined.includes(value))]);
  candidate.push(['candidate-schoolhouse-config-runtime',hasBridge&&combined.includes(fixtures.facilities.schoolhouse.configId)&&combined.includes(fixtures.facilities.schoolhouse.definitionSetId)&&fixtures.schoolhouse.pupilIds.every(id=>combined.includes(id))]);
  candidate.push(['candidate-schoolhouse-persistent-lifecycle',hasBridge&&['seatPupil','beginLesson','chooseApproach','resolveLesson','claimedLessonCount','pupilDevelopment'].every(value=>combined.includes(value))]);
  candidate.push(['candidate-graduation-v2-one-shot-runtime',hasBridge&&combined.includes(fixtures.schoolhouse.graduationOfferTemplate.split('<')[0])&&combined.includes(fixtures.schoolhouse.graduationDomainClaimKind)&&combined.includes('schoolhouseGraduationFinalizerV1')&&combined.includes('graduationReceiptIdByPupilId')]);
  candidate.push(['candidate-family-mentor-positive-only-runtime',hasBridge&&['family.intimacy','positiveOnly','absenceUsesBaseline','consumesOrMutatesRelationship','maximumProgressBonus','maximumRewardBonus'].every(value=>combined.includes(value))]);
  candidate.push(['candidate-null-policy-fail-closed-runtime',hasBridge&&combined.includes('policyReport')&&combined.includes('productionEnabled')&&combined.includes('neverProductionFallback')]);
  candidate.push(['candidate-successor-migration-validation-runtime',hasBridge&&fixtures.migrationIds.every(id=>combined.includes(id))&&fixtures.invalidMutationChecks.every(id=>combined.includes(id))]);
  candidate.push(['candidate-finalizer-archive-runtime',hasBridge&&fixtures.finalizers.every(item=>combined.includes(item.finalizerId)&&combined.includes(item.domainClaimKind))&&combined.includes('claim-archive.phase-15.v1')]);
  candidate.push(['candidate-cast-tutorial-runtime',hasBridge&&fixtures.tutorialIds.every(id=>combined.includes(id))&&fixtures.actorIds.every(id=>combined.includes(id))&&combined.includes('lockedFellowsExcluded')&&combined.includes(fixtures.protagonist.id)&&combined.includes('protagonistExcludedRosterKinds')]);
  candidate.push(['candidate-phase18-19-dom-contract',hasBridge&&Object.values(fixtures.requiredDomSelectors).flat().every(selector=>combined.includes(selector.match(/data-[\w-]+/)?.[0]||selector))]);
  for(const [id,pass] of candidate)record(id,pass,paths);
  record('candidate-failure-boundaries-exact',same(candidate.filter(([,pass])=>!pass).map(([id])=>id),fixtures.expectedCandidateFailureIds),candidate.filter(([,pass])=>!pass).map(([id])=>id));
}

const owned=item=>['docs/PHASE_18_19_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_18_19_INDEPENDENT_QA_RESULT.md'].includes(item)||item.startsWith('qa/phase-18-19-independent/');
const commits=git(['log','--format=%H',`${BASE}..HEAD`,'--','docs/PHASE_18_19_INDEPENDENT_QA_CONTRACT.md','docs/PHASE_18_19_INDEPENDENT_QA_RESULT.md','qa/phase-18-19-independent']).trim().split('\n').filter(Boolean),violations=[];
for(const commit of commits){
  for(const item of git(['diff-tree','--root','--no-commit-id','--name-only','-r',commit]).trim().split('\n').filter(Boolean))if(!owned(item))violations.push({commit,item});
}
record('committed-qa-paths-owned',commits.length>=1&&violations.length===0,{commits,violations});

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` — ${row.detail}`:''}`);
console.log(`RESULT ${passed} passed, ${failed} failed`);
process.exitCode=failed?1:0;

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
const harness=helpers.replaceOnce(baseHarness,'    tamperClear(){',`    p11e:Object.freeze({
      state:()=>clone(S),
      valid:()=>validation(S,11),
      raw:()=>PERSISTED_RAW,
      release:()=>({release:RELEASE_VERSION,compatibility:VERSION,bundle:phaseElevenBPayload(runtimeNow(),{}).appVersion}),
      navigate:view=>clone(nav(view)),
      roster:tab=>clone(setRoster(tab)),
      adventure:tab=>clone(setAdventure(tab,{present:false})),
      featured:()=>({runtime:phaseElevenEFeaturedId(),persisted:S.featured}),
      adventureHtml:()=>adventureScreen(),
      claimCard(gifts=0){const village={id:'village',name:'Village',ready:gifts>0,blocked:false,terminal:false,pending:{gold:0,gifts,shards:{elara:0,tamsin:0,isolde:0}},reason:gifts?'Ready to collect':'Nothing ready'},tower={id:'tower',name:'Tower',ready:false,blocked:false,terminal:false,reason:'Next in 60m'},expedition={id:'expedition',name:'Expedition',ready:false,blocked:false,terminal:false,reason:'Set a record first'},lanes=[village,tower,expedition];return phaseElevenCClaimCard({lanes,village,tower,expedition,claimableLanes:gifts?[village]:[]})},
      saveHealth:()=>phaseElevenBSaveHealthHtml(),
      codex(tab='overview'){const overlay=document.querySelector('#overlay');if(overlay)overlay.innerHTML='';showModal(phaseElevenDCodexModalHtml(tab));if(tab!=='overview')phaseElevenDSetCodexTab(tab);else phaseElevenEEnrichCodexPanel();return document.querySelector('#overlay')?.innerHTML??''},
      records:()=>clone(phaseElevenEJourneyRecords(S)),
      more:()=>moreScreen()
    }),
    tamperClear(){`,'Phase 11E facade');
const tools=await helpers.toolsFor(harness);
const html=readFileSync(resolve(ROOT,'index.html'),'utf8');
const application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if(!application)throw new Error('Everstead application script missing');
const source=tools.instrument(application);
const rows=[],add=(id,pass,detail='')=>{const row={id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)};rows.push(row);console.log(`${row.pass?'PASS':'FAIL'} ${id}${row.detail?` · ${row.detail}`:''}`)};
const p=(run,expression)=>tools.internal(run,'p11e.'+expression),writes=run=>tools.writes(run),same=(left,right)=>JSON.stringify(left)===JSON.stringify(right),image=run=>JSON.stringify(tools.active(run));

add('release-title',html.includes('<title>Everstead · 1.0 Release Candidate</title>'));
add('release-version-separated',html.includes("VERSION='0.1.0',RELEASE_VERSION='1.0.0-rc.1'"));
add('compatibility-namespace-preserved',html.includes("NS='oathforge_new_world_proto_v01'"));
add('phase11c-navigation-wrappers-removed',!html.includes('navBeforePhaseElevenC')&&!html.includes('setAdventureBeforePhaseElevenC'));
add('save-neutral-navigation-source',!html.match(/function nav\(view\).*?mutatePersisted/)&&!html.match(/function setRoster\(tab\).*?mutatePersisted/));
add('claim-card-after-route-tabs',html.includes("html.replace(/(<div class=\"tabs adventure-tabs\">.*?<\\/div>)/,`$1${phaseElevenCClaimCard(preview)}`)"));
add('claim-card-compact-contract',html.includes("data-phase-11e-claim-layout=\"${compact?'compact':'expanded'}\"")&&html.includes('.phase-11c-claim-card.compact'));
add('save-health-plain-first',html.includes('Your save is verified')&&html.includes('Previous save')&&html.includes('Recovery file')&&html.includes('<summary>Advanced save details</summary>'));
add('codex-enrichment-source',html.includes('phaseElevenEEnrichCodexPanel')&&html.includes('phase-11e-codex-quote')&&html.includes('phase-11e-codex-links')&&html.includes('phase-11e-relic-mark')&&html.includes('Collection sets')&&html.includes('Recent records'));
add('no-prosperity-threshold-implementation',!html.includes('PROSPERITY_THRESHOLDS')&&!html.includes('prosperityUnlockThreshold'));
add('no-catch-up-rate-implementation',!html.includes('CATCH_UP_RATE')&&!html.includes('rosterCatchUpRate'));

const run=tools.runRealm({...tools.freshOptions,applicationSource:source,now:helpers.T0,deferTimers:true});
add('fresh-valid',p(run,'valid().ok')===true,p(run,'valid().errors'));
const release=p(run,'release()');
add('runtime-release-identity',release.release==='1.0.0-rc.1'&&release.bundle===release.release&&release.compatibility==='0.1.0',release);
const baseline={raw:p(run,'raw()'),revision:tools.active(run).saveMeta.revision,writes:writes(run),featured:tools.active(run).featured};
for(const view of ['oaths','fellows','more','adventure','village']){const result=p(run,`navigate('${view}')`);add(`navigation-${view}-save-neutral`,result?.ok===true&&result.saveNeutral===true&&p(run,'raw()')===baseline.raw&&tools.active(run).saveMeta.revision===baseline.revision&&writes(run)===baseline.writes,result)}
const featured=p(run,'featured()');
add('village-featured-session-only',tools.active(run).featured===baseline.featured&&featured.persisted===baseline.featured,featured);
p(run,"navigate('fellows')");
for(const tab of ['family','companions','relics','fellows']){const result=p(run,`roster('${tab}')`);add(`roster-${tab}-save-neutral`,result?.ok===true&&p(run,'raw()')===baseline.raw&&tools.active(run).saveMeta.revision===baseline.revision&&writes(run)===baseline.writes,result)}
p(run,"navigate('adventure')");
for(const tab of ['fellowExpedition','companionCampaign','companionTower','fellowCampaign']){const result=p(run,`adventure('${tab}')`),expected=tab==='fellowCampaign'?result?.ok===true:result===false;add(`adventure-${tab}-save-neutral`,expected&&p(run,'raw()')===baseline.raw&&tools.active(run).saveMeta.revision===baseline.revision&&writes(run)===baseline.writes,result)}
add('all-browsing-state-valid',p(run,'valid().ok')===true&&image(run)!=='',p(run,'valid().errors'));
const adventure=p(run,'adventureHtml()'),compact=p(run,'claimCard(0)');
add('claim-ready-below-tabs',adventure.indexOf('tabs adventure-tabs')<adventure.indexOf('data-phase-11c-claim-card'));
add('claim-ready-empty-compact',compact.includes('data-phase-11e-claim-layout="compact"')&&compact.includes('NOTHING CLAIMABLE'));
const expanded=p(run,'claimCard(1)');
add('claim-ready-important-expanded',expanded.includes('data-phase-11e-claim-layout="expanded"')&&expanded.includes('1 Gift'));
const health=p(run,'saveHealth()');
add('save-health-normal-language',health.includes('Your save is verified')&&health.includes('Previous save')&&health.includes('Recovery file'));
add('save-health-advanced-details',health.includes('Advanced save details')&&health.includes('Schema 11')&&health.includes('Revision'));
for(const tab of ['overview','fellows','family','companions','relics','journey'])p(run,`codex('${tab}')`);
add('codex-browsing-zero-write',p(run,'raw()')===baseline.raw&&tools.active(run).saveMeta.revision===baseline.revision&&writes(run)===baseline.writes);
add('more-shows-release',p(run,'more()').includes('1.0.0-rc.1'));
add('all-native-storage-zero',run.nativeCalls.length===0,run.nativeCalls);

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;
console.log(`Phase 11E focused probe: ${passed}/${rows.length}`);
if(failed)process.exitCode=1;

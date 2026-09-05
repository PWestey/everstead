import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const read=relative=>fs.readFileSync(path.join(root,relative));
const text=relative=>read(relative).toString('utf8');
const optional=relative=>fs.existsSync(path.join(root,relative))?text(relative):'';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const git=args=>spawnSync('git',args,{cwd:root,encoding:null,maxBuffer:64*1024*1024});

const index=text('index.html');
const source=optional(contract.candidate.source);
const css=optional(contract.candidate.css);
const predecessor=git(['show',`${contract.predecessor.commit}:index.html`]);
const sourceTagPattern=new RegExp(`^[ \\t]*<script[^>]+src=["']${contract.candidate.source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\?v=${contract.candidate.styleVersion}["'][^>]*><\\/script>[ \\t]*\\r?\\n`,'gm');
const cssTagPattern=new RegExp(`^[ \\t]*<link[^>]+href=["']${contract.candidate.css.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\?v=${contract.candidate.styleVersion}["'][^>]*>[ \\t]*\\r?\\n`,'gm');
const installPattern=new RegExp(`${contract.candidate.ownershipBegin.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[\\s\\S]*?${contract.candidate.ownershipEnd.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\r?\\n(?:\\r?\\n)?`,'g');
const sourceTags=index.match(sourceTagPattern)||[];
const cssTags=index.match(cssTagPattern)||[];
const installBlocks=index.match(installPattern)||[];
const stripped=index.replace(cssTagPattern,'').replace(sourceTagPattern,'').replace(installPattern,'');

record('contract-identifies-phase-24l-b2',contract.contractVersion===1&&contract.phase==='24L-B2'&&contract.schemaVersion===15&&contract.candidate.version===1&&contract.candidate.id==='everstead.phase24l.game-screen-shell.v1');
record('locked-implementation-contract-is-present',fs.existsSync(path.join(root,'docs/PHASE_24L_B2_GAME_SCREEN_SHELL_CONTRACT.md')));
record('predecessor-is-an-ancestor',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-identity-is-exact',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):null});
record('candidate-files-exist',Boolean(source&&css),{sourceBytes:Buffer.byteLength(source),cssBytes:Buffer.byteLength(css)});
record('index-has-one-versioned-css-and-script',cssTags.length===1&&sourceTags.length===1,{cssTags:cssTags.length,sourceTags:sourceTags.length});
record('index-has-one-bounded-ownership-install',installBlocks.length===1,installBlocks.length);
record('index-change-is-additive-to-exact-c90-index',predecessor.status===0&&Buffer.compare(Buffer.from(stripped),predecessor.stdout)===0,{strippedSha256:sha(Buffer.from(stripped)),predecessorSha256:predecessor.status===0?sha(predecessor.stdout):null});
record('style-loads-before-head-closes',index.indexOf(contract.candidate.css)>=0&&index.indexOf(contract.candidate.css)<index.indexOf('</head>'));
record('runtime-loads-before-inline-owner',index.indexOf(contract.candidate.source)>=0&&index.indexOf(contract.candidate.source)<index.indexOf(contract.candidate.ownershipBegin));
record('owner-installs-after-b1-ui-and-before-b1-qa-bootstrap',index.indexOf(contract.candidate.ownershipBegin)>index.indexOf('PHASE_24L_B1_UI_RESULT')&&index.indexOf(contract.candidate.ownershipEnd)<index.indexOf('PHASE_24L_B1_QA_RUNTIME')&&index.indexOf(contract.candidate.ownershipEnd)<index.lastIndexOf("CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture')"));
record('save-schema-namespace-and-release-stay-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=15')&&index.includes("RELEASE_VERSION='1.0.0-preview.1'"));

record('runtime-declares-exact-hidden-api-identity',source.includes(`const VERSION=${contract.candidate.version}`)&&source.includes(`const ID='${contract.candidate.id}'`)&&source.includes(contract.candidate.global)&&source.includes('Object.defineProperty'));
record('runtime-is-presentation-only-no-storage-authority',!/(?:\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\bStorage\b|\.setItem\s*\(|\.removeItem\s*\(|\bmutatePersisted\b|\bcommitPrepared\b|\bbootstrapPersistence\b|\bPERSISTED_RAW\b|\bSTAGING_KEY\b)/m.test(source));
record('runtime-has-no-economy-reward-or-exp-authority',!/(?:\brunFellowCampaign\b|\brunCompanionCampaign\b|\bclearCompanionTower\b|\bclaimCompanionTower\b|\bclaimFellowExpedition\b|\bphase24lB1Spend\b|\bstageCredit\b|\bstageSpend\b|\bcreditAward\b|\bwallets?\s*\.[A-Za-z_$]|\b(?:gold|prosperity|rankExp|shards|rarity|bond|level|exp)\s*(?:\+\+|--|[+\-*/]?=))/m.test(source));
record('runtime-does-not-create-network-timer-or-random-authority',!/(?:\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bpostMessage\s*\(|\bsetInterval\s*\(|\bMath\.random\s*\()/m.test(source));
record('runtime-wraps-current-render-bind-slots',source.includes('rosterScreen')&&source.includes('adventureScreen')&&source.includes('bindCommon'));
record('runtime-reparents-existing-controls',/(?:appendChild|\.append\s*\(|\.prepend\s*\(|insertBefore|replaceChildren)/.test(source)&&source.includes('[data-roster]')&&source.includes('.adventure-tabs'));
record('runtime-does-not-reimplement-live-action-markup',!/<button[^>]+data-(?:campaign-run|companion-campaign-run|companion-tower-clear|companion-tower-claim|expedition-push|expedition-claim|phase-11c-claim-ready)/.test(source));
record('runtime-covers-fellowship-and-adventure-markers',source.includes('data-phase24l-game-screen')&&source.includes('fellowship')&&source.includes('adventure')&&(source.includes('data-phase24l-roster-scroll')||source.includes('phase24lRosterScroll')));
record('runtime-covers-one-local-panel-contract',(source.includes('data-phase24l-local-tab')||source.includes('phase24lLocalTab'))&&(source.includes('data-phase24l-local-panel')||source.includes('phase24lLocalPanel'))&&source.includes('aria-selected')&&source.includes('aria-controls'));
record('runtime-covers-all-five-adventure-panels',contract.adventure.panels.every(id=>source.includes(id)),contract.adventure.panels);
record('runtime-covers-current-route-controller',source.includes('adventureGroups')&&source.includes('.adventure-tabs')&&source.includes('groups.action.push(node)'));
record('runtime-covers-current-route-control-groups',[
 '.node-row','.phase-11c-claim-card','.phase22b-campaign-record','.phase-11c-repeat','.expedition-history','.tower-history',
 '[data-phase22b-campaign-record]','[data-phase-11c-repeat-open]'
].every(selector=>source.includes(selector)),contract.adventure.routes);
record('runtime-guides-are-current-cast-and-session-local',source.includes('Tavi')&&(/Vex['’]ahlia/.test(source))&&source.includes('data-phase24l-guide')&&source.includes('data-phase24l-guide-open')&&source.includes('data-phase24l-guide-close'));
record('runtime-has-no-third-party-brand-copy',!/(?:Isekai|Slow Life|VIP|summon|gacha|premium pass)/i.test(source+css));

record('css-locks-document-only-when-game-screen-active',css.includes('phase24l-b2-active')&&/(?:html|body)[^{]*phase24l-b2-active[^{]*\{[^}]*overflow\s*:\s*hidden/s.test(css));
record('css-gives-roster-the-only-explicit-scroll-lane',css.includes('[data-phase24l-roster-scroll]')&&/data-phase24l-roster-scroll[^}]*overflow-y\s*:\s*auto/s.test(css));
record('css-bounds-local-panels',css.includes('.phase24l-local-panel')&&/(?:max-height|height)\s*:\s*(?:var\(|min\(|clamp\(|calc\(|[0-9.]+d?vh)/.test(css));
record('css-enforces-44px-controls',css.includes('44px')&&css.includes('phase24l-local-dock'));
record('css-declares-two-and-three-column-breakpoints',/max-width\s*:\s*340px/.test(css)&&/grid-template-columns\s*:\s*repeat\(2\s*,/m.test(css)&&/min-width\s*:\s*341px/.test(css)&&/grid-template-columns\s*:\s*repeat\(3\s*,/m.test(css));
record('css-preserves-reduced-motion-support',css.includes('prefers-reduced-motion')||css.includes('phase15-reduced-motion'));

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;

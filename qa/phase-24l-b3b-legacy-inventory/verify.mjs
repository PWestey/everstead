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
const fallback='/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git';
const git=args=>spawnSync(fs.existsSync(fallback)?fallback:'git',args,{cwd:root,encoding:null,maxBuffer:64*1024*1024,timeout:30000});
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

const index=text('index.html'),source=optional(contract.candidate.source),css=optional(contract.candidate.css);
const predecessor=git(['show',`${contract.predecessor.commit}:index.html`]);
const sourceTagPattern=new RegExp(`^[ \\t]*<script[^>]+src=["']${escape(contract.candidate.source)}\\?v=${escape(contract.candidate.styleVersion)}["'][^>]*><\\/script>[ \\t]*\\r?\\n`,'gm');
const cssTagPattern=new RegExp(`^[ \\t]*<link[^>]+href=["']${escape(contract.candidate.css)}\\?v=${escape(contract.candidate.styleVersion)}["'][^>]*>[ \\t]*\\r?\\n`,'gm');
const installPattern=new RegExp(`${escape(contract.candidate.ownershipBegin)}[\\s\\S]*?${escape(contract.candidate.ownershipEnd)}\\r?\\n(?:\\r?\\n)?`,'g');
const sourceTags=index.match(sourceTagPattern)||[],cssTags=index.match(cssTagPattern)||[],installBlocks=index.match(installPattern)||[];
const stripped=index.replace(cssTagPattern,'').replace(sourceTagPattern,'').replace(installPattern,'');

record('contract-identifies-phase-24l-b3b',contract.contractVersion===1&&contract.phase==='24L-B3B'&&contract.schemaVersion===15&&contract.candidate.version===1&&contract.candidate.id==='everstead.phase24l.legacy-inventory.v1');
record('locked-contract-and-result-documents-are-present',fs.existsSync(path.join(root,'docs/PHASE_24L_B3B_CONTRACT.md'))&&fs.existsSync(path.join(root,'docs/PHASE_24L_B3B_RESULT.md')));
record('predecessor-index-identity-is-exact',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):null,status:predecessor.status});
record('candidate-source-and-css-exist',Boolean(source&&css),{sourceBytes:Buffer.byteLength(source),cssBytes:Buffer.byteLength(css)});
record('index-has-one-versioned-css-and-script',cssTags.length===1&&sourceTags.length===1,{cssTags:cssTags.length,sourceTags:sourceTags.length});
record('index-has-one-bounded-install-block',installBlocks.length===1,installBlocks.length);
record('index-change-is-additive-to-exact-b3a-index',predecessor.status===0&&Buffer.compare(Buffer.from(stripped),predecessor.stdout)===0,{strippedSha256:sha(Buffer.from(stripped)),predecessorSha256:predecessor.status===0?sha(predecessor.stdout):null});
record('style-and-runtime-load-before-inline-owner',index.indexOf(contract.candidate.css)>=0&&index.indexOf(contract.candidate.css)<index.indexOf('</head>')&&index.indexOf(contract.candidate.source)>=0&&index.indexOf(contract.candidate.source)<index.indexOf(contract.candidate.ownershipBegin));
record('owner-installs-after-b3a-and-before-b1-qa-bootstrap',index.indexOf(contract.candidate.ownershipBegin)>index.indexOf('PHASE_24L_B3A_RESULT')&&index.indexOf(contract.candidate.ownershipEnd)<index.indexOf('PHASE_24L_B1_QA_RUNTIME'));
record('save-schema-namespace-and-release-remain-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=15')&&index.includes("RELEASE_VERSION='1.0.0-preview.1'"));

record('runtime-declares-hidden-frozen-versioned-api',source.includes(`const VERSION=${contract.candidate.version}`)&&source.includes(`const ID='${contract.candidate.id}'`)&&source.includes(contract.candidate.global)&&source.includes('Object.defineProperty'));
record('runtime-is-read-only-without-storage-or-persistence-authority',!/(?:\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\.setItem\s*\(|\.removeItem\s*\(|\bmutatePersisted\b|\bcommitPrepared\b|\bPERSISTED_RAW\b|\bSTAGING_KEY\b)/m.test(source));
record('runtime-has-no-resource-reward-or-progression-mutation',!/(?:\bclaim[A-Z]\w*\s*\(|\bcompleteOath\b|\bcollectGold\b|\bstageCredit\b|\bstageSpend\b|(?:state|actor|item|wallet)\??\.[^;\n]*(?:gold|gifts|relicStones|prosperity|rankExp|shards|rarity|bond|level|exp)[^;\n]*\s*(?:\+\+|--|[+\-*/]?=))/m.test(source));
record('runtime-has-no-network-random-or-recurring-timer-authority',!/(?:\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bpostMessage\s*\(|\bsetInterval\s*\(|\bMath\.random\s*\()/m.test(source));
record('runtime-wraps-current-binders-and-invokes-inherited-first',source.includes('slots.bindCommon.set')&&source.includes('slots.bindModal.set')&&/slots\.bindCommon\.set\(function[\s\S]*?const result=bindCommonBefore\(\.\.\.args\);[\s\S]*?decorateMore/.test(source)&&/slots\.bindModal\.set\(function[\s\S]*?const result=bindModalBefore\(\.\.\.args\);[\s\S]*?bindInventory/.test(source));
record('legacy-decoration-defers-until-phase22b-categories-exist',source.includes("api.defer(()=>decorateLegacy")&&source.includes('data-phase22b-legacy-category')&&source.includes('phase22bLegacyState'));
record('legacy-moves-live-cards-and-preserves-real-phase13-claim-controls',source.includes('for(const card of directCards)card.remove()')&&source.includes('panel.replaceChildren(...nodes)')&&source.includes('[data-phase13-claim]')&&!source.includes('cloneNode'));
record('legacy-has-exact-four-exclusive-roving-tabs',contract.legacy.tabs.every(id=>source.includes(`{id:'${id}'`))&&source.includes("panel.replaceChildren(...nodes)")&&source.includes("button.tabIndex=active?0:-1")&&source.includes("['ArrowLeft','ArrowRight','Home','End']"));
record('legacy-exposes-only-established-phase13-claim-authority',source.match(/data-phase13-claim/g)?.length===1&&!/data-phase(?:18|19)[^'"\n]*claim/i.test(source)&&contract.legacy.forbiddenClaimTerms.every(term=>!new RegExp(`data-[^'\"\\n]*claim[^'\"\\n]*${escape(term)}`,'i').test(source)));

record('inventory-has-exact-five-truthful-categories',contract.inventory.tabs.every(id=>source.includes(`{id:'${id}'`))&&source.includes('keepsakes:Object.freeze([])'));
record('inventory-projects-only-existing-material-gift-and-shard-fields',source.includes('experienceProgression?.wallets?.fellow?.balance')&&source.includes('state?.relicStones')&&source.includes('state?.gifts')&&source.includes("for(const kind of ['fellow','family','companion'])")&&source.includes('?.shards??0'));
record('inventory-projects-owned-only-relics',source.includes("if(item?.owned!==true)continue")&&source.includes('relicSlots?.[0]===def.id'));
record('inventory-never-projects-gold-or-pending-rewards',!/(?:state\?\.gold|state\.gold|pendingGold|pendingOffers|rewardClaims)/.test(source));
record('inventory-has-no-capacity-open-combine-conversion-or-spend-authority',!/(?:inventoryCapacity|openChest|combineItems|convertItem|consumeItem|spendItem|Math\.random)/i.test(source));
record('inventory-selection-and-pages-are-module-local-only',source.includes('let selectedItem=null')&&source.includes('let inventoryPages=')&&source.includes('inventoryPages[inventoryTab]')&&!/(?:state|actor|item|wallet)\??\.[^;\n]*\s(?:\+\+|--|[+\-*/]?=)/.test(source));
record('inventory-routing-only-delegates-to-established-systems',source.includes('if(item?.route)api.route(item.route)')&&index.includes("if(route.kind==='relic')")&&index.includes("if(route.kind==='roster')")&&index.includes("if(route.kind==='actor')"));
record('runtime-has-no-third-party-brand-or-monetization-copy',!/(?:Isekai|Slow Life|VIP|summon|gacha|premium pass)/i.test(source+css));

record('css-uses-four-by-three-and-compact-three-by-three-paged-grids',/phase24l-b3b-grid[^\{]*\{[^}]*grid-template-columns\s*:\s*repeat\(4/s.test(css)&&/@media\(max-width:369px\)[\s\S]*?phase24l-b3b-grid[^\{]*\{[^}]*grid-template-columns\s*:\s*repeat\(3/s.test(css)&&/grid-template-rows\s*:\s*repeat\(3/s.test(css));
record('css-bounds-inventory-and-legacy-modals-to-dynamic-viewport',css.includes('100dvh')&&css.includes('.modal:has([data-phase24l-b3b-modal])')&&css.includes('.modal[data-phase24l-b3b-modal="legacy"]')&&css.includes('overflow:hidden'));
record('css-gives-only-explicit-panels-local-scrolling',/phase24l-b3b-legacy-panel[^\{]*\{[^}]*overflow\s*:\s*auto/s.test(css)&&!/phase24l-b3b-grid[^\{]*\{[^}]*overflow\s*:\s*auto/s.test(css));
record('css-enforces-minimum-44px-interactive-targets',css.includes('44px')&&css.includes('.phase24l-b3b-tabs button')&&css.includes('.phase24l-b3b-pager button')&&css.includes('.phase24l-b3b-detail-close'));
record('css-preserves-reduced-motion-and-forced-colors',css.includes('prefers-reduced-motion')&&css.includes('phase15-reduced-motion')&&css.includes('forced-colors'));

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;

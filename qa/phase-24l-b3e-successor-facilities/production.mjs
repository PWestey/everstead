import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const contract=JSON.parse(readFileSync(resolve(here,'contract.json'),'utf8'));
const origin=(process.argv[2]||'http://127.0.0.1:8840').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}: ${message.text()}`)});
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
const response=await page.goto(`${origin}/index.html`,{waitUntil:'load',timeout:45000});
await page.waitForFunction(name=>window[name]?.ok===true,contract.resultGlobal);
const evidence=await page.evaluate(facilityIds=>({
 result:window.__EVERSTEAD_PHASE24L_B3E_RESULT__,
 phase2021Qa:typeof window.__EVERSTEAD_PHASE_20_21_QA__,
 decoratedSheets:document.querySelectorAll('[data-phase24l-b3e-facility]').length,
 successorSheets:document.querySelectorAll('[data-phase20-21-sheet]').length,
 bottomNavigation:[...document.querySelectorAll('[data-nav]')].filter(node=>getComputedStyle(node).display!=='none').map(node=>node.dataset.nav),
 detachedGrid:Boolean(document.querySelector('[data-detached-building-grid],[data-facility-management-grid]')),
 hotspots:facilityIds.map(id=>{const node=document.querySelector(`[data-phase15-facility-id="${id}"]`);return{id,exists:Boolean(node),disabled:node?.disabled,hidden:node?.hidden,ariaHidden:node?.getAttribute('aria-hidden'),state:node?.dataset.phase15State}})
}),contract.facilities.map(item=>item.id));
const pass=response?.status()===200&&evidence.result?.schemaVersion===15&&evidence.result?.mechanicsChanged===false&&evidence.result?.saveChanged===false&&evidence.phase2021Qa==='undefined'&&evidence.decoratedSheets===0&&evidence.successorSheets===0&&JSON.stringify(evidence.bottomNavigation)===JSON.stringify(['village','oaths','fellows','adventure','more'])&&!evidence.detachedGrid&&evidence.hotspots.length===8&&evidence.hotspots.every(item=>item.exists&&item.disabled===true&&(item.hidden===true||item.ariaHidden==='true'||item.state==='hidden'))&&errors.length===0;
console.log(`${pass?'PASS':'FAIL'} production-public-release-gates-remain-unchanged · ${JSON.stringify({status:response?.status(),...evidence,errors})}`);
console.log(`RESULT ${pass?1:0} passed, ${pass?0:1} failed`);
await context.close();
await browser.close();
if(!pass)process.exitCode=1;

import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const origin=(process.argv[2]||'http://127.0.0.1:8840').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}: ${message.text()}`)});
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
const response=await page.goto(`${origin}/index.html`,{waitUntil:'load',timeout:45000});
await page.waitForFunction(()=>window.__EVERSTEAD_PHASE24L_B3D_RESULT__?.ok===true);
const evidence=await page.evaluate(()=>({
 schema:window.__EVERSTEAD_PHASE24L_B3D_RESULT__?.schemaVersion,
 mechanicsChanged:window.__EVERSTEAD_PHASE24L_B3D_RESULT__?.mechanicsChanged,
 saveChanged:window.__EVERSTEAD_PHASE24L_B3D_RESULT__?.saveChanged,
 phase1819Qa:typeof window.__EVERSTEAD_PHASE_18_19_QA__,
 decoratedPrivateSheets:document.querySelectorAll('[data-phase24l-b3d-facility]').length,
 privateHotspots:[...document.querySelectorAll('[data-phase15-facility-id="facility.apothecary"],[data-phase15-facility-id="facility.schoolhouse"]')].map(node=>({id:node.dataset.phase15FacilityId,disabled:node.disabled,state:node.dataset.phase15State,hidden:node.hidden}))
}));
const pass=response?.status()===200&&evidence.schema===15&&evidence.mechanicsChanged===false&&evidence.saveChanged===false&&evidence.phase1819Qa==='undefined'&&evidence.decoratedPrivateSheets===0&&evidence.privateHotspots.length===2&&evidence.privateHotspots.every(node=>node.disabled===true)&&errors.length===0;
console.log(`${pass?'PASS':'FAIL'} production-private-gates-remain-closed · ${JSON.stringify({status:response?.status(),...evidence,errors})}`);
console.log(`RESULT ${pass?1:0} passed, ${pass?0:1} failed`);
await context.close();
await browser.close();
if(!pass)process.exitCode=1;

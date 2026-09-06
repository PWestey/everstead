import fs from 'node:fs';import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
const diagnostic=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):null;
try{for(const width of [390,320]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(d=>{Date.now=()=>Number(sessionStorage.getItem('clock')||d?.capturedAt||1788703671078);if(d&&!sessionStorage.getItem('loaded')){for(const [k,v]of Object.entries(d.snapshot))if(v!==null&&d.storageKeys[k])localStorage.setItem(d.storageKeys[k],v);sessionStorage.setItem('loaded','1')}},diagnostic);
 await page.route('**/index.html',async route=>{const q=await route.fetch();await route.fulfill({response:q,body:(await q.text()).replace("CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture');PERSISTED_RAW=null","window.__kStats=()=>({power:power('cael'),rate:totalRate()});CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture');PERSISTED_RAW=null")})});
 await page.goto('http://127.0.0.1:8857/index.html');const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01'))),before=await state(),stats=await page.evaluate(()=>window.__kStats());
 await page.locator('[data-nav="village"]').click();await page.locator('[data-va-open="restaurant"]').click();await page.locator('[data-k-action="tutorial"]').click();await page.locator('[data-k-action="improve"]').click();
 const unlocked=await page.evaluate(()=>window.__kStats());assert.equal(unlocked.power-stats.power,10);assert(Math.abs(unlocked.rate-stats.rate-120)<1e-6);
 await page.locator('[data-k-tab="pantry"]').click();await page.locator('[data-k-action="supplies"]').click();await page.locator('[data-k-action="supplies"]').click();
 for(let i=0;i<4;i++){await page.locator('[data-k-tab="service"]').click();await page.locator('[data-k-action="cook"]').click();if(i===0){await page.reload();await page.locator('[data-va-open="restaurant"]').click();}await page.locator('[data-k-action="claim"]').click();}
 assert.equal((await state()).restaurantKitchen.notes,8);assert.equal((await state()).restaurantKitchen.served,4);
 await page.locator('[data-k-tab="recipes"]').click();await page.locator('[data-k-action="improve"]').click();await page.locator('[data-k-shift="1"]').click();await page.locator('[data-k-action="improve"]').click();
 const after=await state();assert.deepEqual(after.restaurantKitchen.levels,[2,1,0,0]);assert.equal(after.restaurantKitchen.notes,1);assert.deepEqual(after.experienceProgression,before.experienceProgression);
 const improved=await page.evaluate(()=>window.__kStats());assert.equal(improved.power-stats.power,30);assert(Math.abs(improved.rate-stats.rate-360)<1e-6);
 await page.screenshot({path:`/tmp/kitchen-${width}.png`});assert(await page.locator('[data-k-close]').isVisible());
 await page.reload();assert.deepEqual((await state()).restaurantKitchen,after.restaurantKitchen);assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);
 await page.evaluate(()=>sessionStorage.setItem('clock',String(Date.now()+3600000)));await page.reload();assert(Math.abs((await state()).gold-after.gold-improved.rate)<=1,'one-hour passive earnings include recipe bonus exactly once');await page.locator('[data-va-open="restaurant"]').click();await page.locator('[data-k-tab="pantry"]').click();await page.locator('[data-k-action="supplies"]').click();assert((await state()).restaurantKitchen.diners>=4);await page.locator('[data-k-close]').click();
 await page.locator('[data-nav="adventure"]').click();const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();await page.locator('[data-campaign-run]').click();const story=page.locator('[data-phase13-story="skip"]:visible');if(await story.count()){await story.click();await page.locator('[data-campaign-run]').click()};assert.equal((await state()).fellowCampaign.runOrdinal,before.fellowCampaign.runOrdinal+1);await page.reload();assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);assert.deepEqual(errors,[]);
 console.log('PASS',width,diagnostic?'existing exported save':'fresh save','cook/claim, unlock/upgrade, bonuses, reload, delivery bank');await context.close();
}}finally{await browser.close()}

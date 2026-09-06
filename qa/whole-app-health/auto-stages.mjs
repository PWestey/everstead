import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'}),errors=[],dialogs=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>{dialogs.push(d.message());d.dismiss()});
 await page.addInitScript(()=>{Date.now=()=>Number(sessionStorage.getItem('qa-clock')||'1815000000000')});
 await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded'});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 await page.locator('[data-phase24k-speaker-hide]').click();
 assert.equal(await page.locator('[data-phase24k-speaker-show]').count(),0);
 await page.reload();assert.equal(await page.locator('[data-phase24k-village-character]').isVisible(),false);
 await page.evaluate(()=>sessionStorage.setItem('qa-clock','1815000600001'));await page.reload();
 assert(await page.locator('[data-phase24k-village-character]').isVisible());
 await page.locator('[data-phase24k-village-character]').press('Enter');
 assert.equal(await page.locator('[data-phase24k-village-character]').isVisible(),false);
 await page.locator('[data-building="command"]').first().click();
 await page.locator('[data-phase24l-b3c-tab="upgrade"]').click();
 const buildingBefore=await state();await page.locator('[data-modal-act="upgrade-building"]').click();
 const buildingAfter=await state();assert.equal(buildingAfter.buildings.command.level,buildingBefore.buildings.command.level+1);assert(buildingAfter.gold<buildingBefore.gold);
 await page.locator('#overlay [data-modal-close]').click();
 await page.locator('[data-nav="adventure"]').click();
 const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
 await page.locator('[data-campaign-run]').click();
 await page.locator('[data-phase13-story="skip"]').click();
 const before=await state();await page.locator('[data-campaign-run]').click();
 const after=await state();assert.equal(after.fellowCampaign.runOrdinal,before.fellowCampaign.runOrdinal+1);
 assert.equal(before.gold-after.gold,after.fellowCampaign.lastReceipt.effectiveCost);
 for(let i=0;i<12;i++){await page.waitForTimeout(120);const story=page.locator('[data-phase13-story="skip"]:visible'),close=page.locator('#overlay [data-modal-close]:visible');if(await story.count())await story.first().click();else if(await close.count())await close.first().click();else break}
 await page.locator('[data-stage-auto]').click();await page.waitForFunction(()=>document.querySelector('[data-stage-auto]')?.textContent==='AUTO',null,{timeout:20000});
 const stopped=await state();assert(stopped.fellowCampaign.runOrdinal>after.fellowCampaign.runOrdinal,'Auto advances another stage');assert.equal(await page.locator('[data-stage-auto]').innerText(),'AUTO');
 assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);
 await page.waitForTimeout(1500);assert.equal((await state()).fellowCampaign.runOrdinal,stopped.fellowCampaign.runOrdinal,'stopped Auto cannot spend again');
 await page.screenshot({path:`/tmp/auto-stages-${width}.png`});
 assert.deepEqual(dialogs,[]);assert.deepEqual(errors,[]);console.log('PASS',width,'cooldown, direct spend, Auto stops, no dialogs/errors');await page.close();
}
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>{Date.now=()=>Number(sessionStorage.getItem('qa-clock')||'1815000000000')});
 await page.goto('http://127.0.0.1:8857/index.html');
 await page.locator('[data-nav="adventure"]').click();await page.locator('[data-phase24l-guide-close]').click();
 await page.locator('[data-campaign-run]').click();await page.locator('[data-phase13-story="skip"]').click();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 await page.evaluate(()=>sessionStorage.setItem('qa-clock','1815000002000'));
 await page.locator('[data-campaign-run]').click();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 assert.equal(after.fellowCampaign.runOrdinal,1);assert(after.gold>before.gold-after.fellowCampaign.lastReceipt.effectiveCost,'transaction includes accrued Gold without invalidating purchase');
 assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);
 console.log('PASS accrued Gold during Go does not invalidate Campaign preview');await page.close();
}finally{await browser.close()}

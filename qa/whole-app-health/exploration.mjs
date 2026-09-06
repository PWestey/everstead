import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded'});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const before=await state();await page.waitForTimeout(5500);const after=await state();
 assert(after.gold>before.gold,'automatic Gold credited');assert(after.pendingGold<1,'fraction retained only');
 assert.equal(after.familyDrops.claimSequence,before.familyDrops.claimSequence,'bonus drops not auto claimed');
 const camera=page.locator('.village-camera');assert(await camera.evaluate(el=>el.scrollWidth>el.clientWidth));
 await camera.evaluate(el=>el.scrollLeft=0);await page.locator('.village-recenter').click();assert(await camera.evaluate(el=>el.scrollLeft>0));
 await page.screenshot({path:'/tmp/exploration-village-'+width+'.png'});
 await page.locator('[data-nav="adventure"]').click();const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
 await page.screenshot({path:'/tmp/exploration-stage-'+width+'.png'});
 assert(await page.locator('[data-campaign-run]').isVisible());assert.deepEqual(errors,[]);console.log('PASS '+width);await page.close();
}
 const page=await browser.newPage();
 await page.addInitScript(()=>{Date.now=()=>Number(sessionStorage.getItem('qa-clock')||'1815000000000')});
 await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded'});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const before=await state();
 await page.evaluate(()=>sessionStorage.setItem('qa-clock','1815172800000'));
 await page.reload({waitUntil:'domcontentloaded'});const offline=await state();
 assert(offline.gold>before.gold);assert(offline.pendingGold<1);
 await page.reload({waitUntil:'domcontentloaded'});const again=await state();assert.equal(again.gold,offline.gold,'same timestamp reload cannot double credit');
 assert.equal(again.familyDrops.claimSequence,before.familyDrops.claimSequence,'offline bonus rewards remain manual');
 await page.evaluate(()=>sessionStorage.setItem('qa-clock','1815259200000'));
 await page.reload({waitUntil:'domcontentloaded'});const oneDay=await state();
 assert(Math.abs((offline.gold-before.gold)-(oneDay.gold-offline.gold))<=1,'48h absence credits same as 24h cap');
 console.log('PASS offline cap, reload idempotency and manual bonus claims');await page.close();
}finally{await browser.close()}

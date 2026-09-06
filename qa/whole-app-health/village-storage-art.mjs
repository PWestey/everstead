import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const origin=process.argv[2]||'http://127.0.0.1:8857';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
 await page.screenshot({path:'/tmp/everstead-village-'+width+'.png'});
 await page.locator('[data-nav="more"]').click();
 const guide=page.locator('[data-phase24l-b3a-guide-close="more"]:visible');if(await guide.count())await guide.click();
 await page.locator('[data-phase24l-b3b-inventory-open]').click();
 assert(await page.locator('[data-phase24l-b3b-inventory]').isVisible());
 await page.screenshot({path:'/tmp/everstead-storage-'+width+'.png'});
 await page.locator('[data-phase24l-b3b-item="material.fellow-exp"]').click();
 assert(await page.locator('[data-phase24l-b3b-detail]').isVisible());
 await page.locator('[data-phase24l-b3b-detail-close]').click();
 await page.locator('#overlay [data-modal-close]:visible').click();
 await page.locator('[data-phase13-legacy]').click();
 await page.locator('.phase24l-b3b-legacy-shell').waitFor();
 for(const tab of await page.locator('[data-phase24l-b3b-legacy-tab]').all()){await tab.click();assert(await page.locator('.modal [data-modal-close]').isVisible())}
 await page.locator('[data-phase24l-b3b-legacy-tab]').first().click();
 await page.screenshot({path:'/tmp/everstead-achievements-'+width+'.png'});
 assert(await page.locator('.modal [data-modal-close]').isVisible());
 await page.locator('#overlay [data-modal-close]:visible').click();
 await page.locator('[data-nav="village"]').click();
 await page.locator('[data-building]:visible').first().click();
 await page.locator('.phase24l-b3c-tabs').waitFor();
 for(const tab of await page.locator('.phase24l-b3c-tabs button').all()){await tab.click();assert(await page.locator('.modal [data-modal-close]').isVisible())}
 await page.locator('.phase24l-b3c-tabs button').nth(1).click();
 await page.screenshot({path:'/tmp/everstead-building-'+width+'.png'});
 await page.locator('#overlay [data-modal-close]:visible').click();
 assert.deepEqual(errors,[]);console.log('PASS '+width+': Village, Storage detail/close, Legacy close, no page errors');
 await page.close();
}}finally{await browser.close()}

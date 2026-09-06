import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{Date.now=()=>1815000000000});
 await page.goto('http://127.0.0.1:8857/index.html');
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const start=await state();
 for(const route of ['fellows','family','relics','companions']){
  await page.locator('[data-nav="adventure"]').click();
  const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
  await page.locator('[data-stage-growth]').click();
  assert.equal(await page.locator('[data-growth-route]').count(),4);
  if(route==='fellows')await page.screenshot({path:`/tmp/growth-routes-${width}.png`});
  await page.locator(`[data-growth-route="${route}"]`).click();
  assert.equal(await page.locator('[data-growth-route]').count(),0,'growth sheet closes when routing');
  assert(await page.locator(`[data-roster="${route}"]`).count()>0);
 }
 const after=await state();assert.equal(after.gold,start.gold);assert.deepEqual(after.experienceProgression.wallets,start.experienceProgression.wallets);
 assert.equal(after.gifts,start.gifts);assert.equal(after.relicStones,start.relicStones);assert.deepEqual(errors,[]);
 console.log('PASS',width,'growth sheet routes, closes, spends nothing');await page.close();
}}finally{await browser.close()}

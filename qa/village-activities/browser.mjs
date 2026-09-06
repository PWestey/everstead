import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{Date.now=()=>1815000000000});
 await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded'});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const before=await state();assert(before.villageActivities);
 const defs=await page.evaluate(()=>window.EVERSTEAD_VILLAGE_ACTIVITIES.definitions);
 assert.equal(await page.locator('[data-va-open]').count(),13);
 for(const [id,d] of Object.entries(defs)){
  if(id==='restaurant')continue; // Recipe kitchen has its own end-to-end suite.
  await page.locator(`[data-va-open="${id}"]`).click();
  await page.locator('[data-va-action="tutorial"]').click();
  await page.locator('[data-va-action="start"]').click();
  for(const step of d.scenarios[0].steps)await page.locator(`[data-va-choice="${step.answer}"]`).click();
  const completed=await state();assert.equal(completed.villageActivities.facilities[id].completed,1);assert.equal(completed.villageActivities.facilities[id].claimed,0);
  if(id==='command'){await page.screenshot({path:`/tmp/village-command-${width}.png`});await page.reload();await page.locator(`[data-va-open="${id}"]`).click();}
  await page.locator('[data-va-action="claim"]').click();
  assert.equal((await state()).villageActivities.facilities[id].claimed,1);
  assert.equal(await page.locator('[data-va-action="claim"]').count(),0);
  await page.locator('.va-close').click();
 }
 const claimed=await state();assert.equal(claimed.gold-before.gold,claimed.villageActivities.totalGoldAwarded);
 assert.equal(claimed.experienceProgression.wallets.fellow.balance,before.experienceProgression.wallets.fellow.balance);
 await page.locator('[data-va-open="training"]').click();await page.locator('[data-va-tab="training"]').click();
 const selected=await page.locator('[data-va-fellow]').inputValue();await page.locator('[data-va-train]').click();
 const trained=await state();assert.equal(trained.villageActivities.mastery[selected].power,50);assert.equal(trained.fellows[selected].exp,before.fellows[selected].exp);
 await page.screenshot({path:`/tmp/village-training-${width}.png`});await page.locator('.va-close').click();
 await page.reload();const reloaded=await state();assert.deepEqual(reloaded.villageActivities,trained.villageActivities);
 await page.screenshot({path:`/tmp/village-map-${width}.png`});
 await page.locator('[data-nav="adventure"]').click();const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
 await page.locator('[data-campaign-run]').click();const story=page.locator('[data-phase13-story="skip"]');if(await story.count()){await story.click();await page.locator('[data-campaign-run]').click()}
 assert.equal((await state()).fellowCampaign.runOrdinal,1);assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);
 for(let i=0;i<12;i++){await page.waitForTimeout(100);const close=page.locator('#overlay [data-modal-close]:visible'),skip=page.locator('[data-phase13-story="skip"]:visible');if(await skip.count())await skip.click();else if(await close.count())await close.first().click();else break;}
 await page.locator('[data-nav="fellows"]').click();const fellowGuide=page.locator('[data-phase24l-guide-close]:visible');if(await fellowGuide.count())await fellowGuide.click();
 await page.locator('[data-roster="fellows"]').click();await page.locator('[data-fellow="cael"]:visible').click();await page.locator('[data-phase24l-profile-tab="level"]').click();await page.locator('[data-phase24l-exp-commit]').click();
 const invested=await state();assert.equal(invested.fellows.cael.level,2);assert.deepEqual(invested.villageActivities,trained.villageActivities);
 await page.reload();assert.deepEqual((await state()).villageActivities,trained.villageActivities);assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);
 assert.deepEqual(errors,[]);console.log('PASS',width,'13 activities, persistent claim, training, Campaign after training');await page.close();
}}finally{await browser.close()}

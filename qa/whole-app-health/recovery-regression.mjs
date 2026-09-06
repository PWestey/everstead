// User-supplied diagnostic stays outside the repository; use a fresh browser profile.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const diagnostic=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(d=>{Date.now=()=>d.capturedAt;if(!sessionStorage.getItem('test-loaded')){for(const [slot,raw]of Object.entries(d.snapshot))if(raw!==null&&d.storageKeys[slot])localStorage.setItem(d.storageKeys[slot],raw);sessionStorage.setItem('test-loaded','1');}},diagnostic);
 await page.route('**/index.html',async route=>{const r=await route.fetch(),html=await r.text();await route.fulfill({response:r,body:html.replaceAll('catch(error){S=before;','catch(error){window.__errorStack=error.stack;S=before;').replace("CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture');PERSISTED_RAW=null","window.__recoveryCheck=()=>({blocked:PERSISTENCE_BLOCKED?.message,stack:window.__errorStack,valid:phase24lValidate(villagePlayActual()),revision:villagePlayActual().saveMeta.revision});CURRENT_TRANSACTION_SOURCES.add('phase23-qa-fixture');PERSISTED_RAW=null")});});
 await page.goto('http://127.0.0.1:8857/index.html');
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const before=await state();
 console.log('LOAD',await page.evaluate(()=>window.__recoveryCheck()),errors);
 if(await page.getByText('Save Needs Attention',{exact:true}).count())process.exitCode=1;
 else{
  for(const id of ['command','archives','training','hearth']){await page.locator('[data-nav="village"]').click();await page.locator(`[data-va-open="${id}"]`).click();await page.locator('[data-va-building]').click();await page.locator('[data-phase24l-b3c-tab="upgrade"]').click();await page.locator('[data-modal-act="upgrade-building"]').click();assert.equal((await state()).buildings[id].level,before.buildings[id].level+1);await page.reload();}
  console.log('UPGRADE',await page.evaluate(()=>window.__recoveryCheck()));
  assert.equal((await state()).buildings.command.level,before.buildings.command.level+1);
  await page.reload();
  await page.locator('[data-nav="adventure"]').click();const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
  await page.locator('[data-campaign-run]').click();const story=page.locator('[data-phase13-story="skip"]:visible');if(await story.count()){await story.click();await page.locator('[data-campaign-run]').click();}
  assert.equal((await state()).fellowCampaign.runOrdinal,before.fellowCampaign.runOrdinal+1);
  const after=await state();assert.equal(after.experienceProgression.wallets.fellow.balance,before.experienceProgression.wallets.fellow.balance+120);assert.equal(after.fellows.cael.shards,before.fellows.cael.shards+2);assert.equal(after.fellows.cael.exp,before.fellows.cael.exp);
  await page.reload();assert.equal(await page.getByText('Save Needs Attention',{exact:true}).count(),0);assert.deepEqual((await state()).experienceProgression,after.experienceProgression);assert.deepEqual(errors,[]);
  console.log('PASS affected save: upgrade, stage clear, exact rewards, unchanged invested EXP, reload');
 }
}finally{await browser.close();}

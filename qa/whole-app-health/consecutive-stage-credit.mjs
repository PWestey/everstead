import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

// Public controls only: no save injection or QA grants. The second clear credits
// a different Fellow, exposing validation of an incomplete reward transaction.
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],dialogs=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('dialog',dialog=>{dialogs.push(dialog.message());dialog.dismiss()});
 await page.addInitScript(()=>{Date.now=()=>1815000000000});
 await page.goto(process.env.EVERSTEAD_TEST_URL||'http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded'});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
 const dismissScenes=async()=>{
  for(let i=0;i<20;i++){
   await page.waitForTimeout(100);
   const guide=page.locator('[data-phase24l-guide-close]:visible'),story=page.locator('[data-phase13-story="skip"]:visible'),close=page.locator('#overlay [data-modal-close]:visible');
   if(await guide.count())await guide.first().click();
   else if(await story.count())await story.first().click();
   else if(await close.count())await close.first().click();
   else break;
  }
 };
 await page.locator('[data-nav="adventure"]').click();await dismissScenes();
 const initial=await state(),actors=Object.fromEntries(Object.entries(initial.fellows).map(([id,actor])=>[id,{exp:actor.exp,level:actor.level}]));
 for(let ordinal=1;ordinal<=2;ordinal++){
  for(let attempt=0;attempt<4&&(await state()).fellowCampaign.runOrdinal<ordinal;attempt++){
   await page.locator('[data-campaign-run]').click();await dismissScenes();
  }
  const saved=await state();
  assert.equal(saved.fellowCampaign.runOrdinal,ordinal,'each stage records one committed clear');
  assert.equal(saved.experienceProgression.ledger.entryCount,initial.experienceProgression.ledger.entryCount+ordinal);
  assert.equal(saved.experienceProgression.wallets.fellow.spentTotal,0,'earned EXP is banked, not invested');
  assert.deepEqual(Object.fromEntries(Object.entries(saved.fellows).map(([id,actor])=>[id,{exp:actor.exp,level:actor.level}])),actors);
  assert.equal((await page.locator('body').innerText()).includes('Save Needs Attention'),false);
 }
 const beforeReload=await state();await page.reload({waitUntil:'domcontentloaded'});await dismissScenes();
 const reloaded=await state();
 assert.equal(reloaded.fellowCampaign.runOrdinal,2);
 assert.deepEqual(reloaded.experienceProgression,beforeReload.experienceProgression,'reload neither duplicates nor drops EXP credits');
 assert.equal((await page.locator('body').innerText()).includes('Save Needs Attention'),false);
 assert.deepEqual(errors,[]);assert.deepEqual(dialogs,[]);
 console.log('PASS consecutive public stage clears: exactly-once banked EXP, unchanged invested EXP, safe reload, no save-protection screen');
}finally{await browser.close()}

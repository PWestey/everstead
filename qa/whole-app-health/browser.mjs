import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

// Exercise the public buttons with fresh native browser storage. Engine QA
// shortcuts bypass the story/coordinator wrappers that caused this regression.
const origin=(process.argv[2]||'http://127.0.0.1:8857').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
let checks=0;
function check(condition,label){assert.ok(condition,label);checks++;console.log(`PASS ${label}`)}
try{
 for(const viewport of [{width:390,height:844},{width:320,height:568}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  let accept=false;
  page.on('pageerror',error=>errors.push(error.message));
  page.on('dialog',dialog=>accept?dialog.accept():dialog.dismiss());
  await page.route('**/*',route=>route.request().url().startsWith(`${origin}/`)?route.continue():route.abort());
  await page.goto(`${origin}/index.html`,{waitUntil:'domcontentloaded',timeout:60000});
  const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
  const closeFlow=async()=>{
   for(let step=0;step<12;step++){
    // Closing a reward can queue the next authored scene on the next event turn.
    await page.waitForTimeout(100);
    const story=page.locator('[data-phase13-story="skip"]:visible');
    const close=page.locator('#overlay [data-modal-close]:visible');
    if(await story.count())await story.first().click();
    else if(await close.count())await close.first().click();
    else break;
   }
  };
  const fresh=await state();
  check(fresh.schemaVersion===15&&fresh.experienceProgression.version===3,`${viewport.width}: fresh public policy 3`);
  await page.locator('[data-nav="more"]').click();
  await page.locator('[data-phase24l-b3a-guide-close="more"]').click();
  await page.locator('[data-phase24l-compact-tab="guide"]').click();
  const guidance=await page.locator('[data-campaign-efficiency-preview]').innerText();
  check(guidance.includes('Village Toll')&&guidance.includes('22.0K')&&guidance.includes('8.5K'),`${viewport.width}: Guide uses selected Campaign costs`);
  await page.locator('[data-phase24l-b3b-inventory-open]').click();
  const companionExp=page.locator('[data-phase24l-b3b-item="material.companion-exp"]');
  check(await companionExp.getAttribute('data-phase24l-b3b-amount')===String(fresh.experienceProgression.wallets.companion.balance),`${viewport.width}: Inventory displays Companion EXP wallet`);
  await companionExp.click();
  await page.locator('[data-phase24l-b3b-route="material.companion-exp"]').click();
  check(await page.locator('[data-companion]:visible').count()>0,`${viewport.width}: Companion EXP routes to its roster`);
  await closeFlow();
  await page.locator('[data-nav="adventure"]').click();
  await page.locator('[data-phase24l-guide-close]').click();
  check((await page.locator('body').innerText()).includes('EXP to shared wallet'),`${viewport.width}: Campaign explains banked EXP`);
  await page.locator('[data-campaign-run]').click();
  check(await page.locator('[data-phase13-story="skip"]').count()===1,`${viewport.width}: first Campaign retains story introduction`);
  await page.locator('[data-phase13-story="skip"]').click();
  await page.locator('[data-campaign-run]').click();
  const canceled=await state();
  check(canceled.fellowCampaign.runOrdinal===0&&canceled.experienceProgression.wallets.fellow.balance===0,`${viewport.width}: canceled confirmation grants nothing`);
  accept=true;
  await page.locator('[data-campaign-run]').click();
  await page.getByText('120 Fellow EXP available',{exact:true}).waitFor();
  const earned=await state();
  check(earned.fellowCampaign.runOrdinal===1&&earned.experienceProgression.wallets.fellow.balance===120,`${viewport.width}: public Campaign banks 120 EXP exactly once`);
  check(earned.fellows.cael.exp===0&&earned.fellows.cael.level===1&&earned.fellows.cael.shards===2,`${viewport.width}: rewards preserve manual leveling and targeted shards`);
  check(canceled.gold-earned.gold===earned.fellowCampaign.lastReceipt.effectiveCost&&earned.fellowCampaign.lastReceipt.effectiveCost>0,`${viewport.width}: Gold deduction matches the exact Campaign receipt`);
  await closeFlow();
  await page.locator('[data-nav="fellows"]').click();
  await page.locator('[data-phase24l-guide-close]').click();
  await page.locator('[data-roster="fellows"]').click();
  await page.locator('[data-fellow="cael"]:visible').click();
  await page.locator('[data-phase24l-profile-tab="level"]').click();
  const invest=page.locator('[data-phase24l-exp-commit]');
  check(!await invest.isDisabled(),`${viewport.width}: earned EXP is spendable from public Fellow profile`);
  await invest.click();
  const spent=await state();
  check(spent.fellows.cael.level===2&&spent.fellows.cael.exp>0&&spent.experienceProgression.wallets.fellow.balance===120-spent.fellows.cael.exp,`${viewport.width}: deliberate investment preserves EXP accounting`);
  await page.locator('[data-phase24l-profile-tab="overview"]').click();
  const overview=await page.locator('[data-phase24l-panel="overview"]').innerText();
  check(/2\s+Level/i.test(overview),`${viewport.width}: Overview refreshes immediately after EXP investment`);
  await page.reload({waitUntil:'domcontentloaded'});
  const loaded=await state();
  check(JSON.stringify(loaded.experienceProgression.wallets)===JSON.stringify(spent.experienceProgression.wallets)&&loaded.fellows.cael.exp===spent.fellows.cael.exp&&loaded.fellowCampaign.runOrdinal===1,`${viewport.width}: public reward and investment survive reload`);
  check(await page.getByText('Save Needs Attention',{exact:true}).count()===0&&errors.length===0,`${viewport.width}: no protection fault or JavaScript error`);
  await context.close();
 }
 console.log(`RESULT ${checks} passed`);
}finally{await browser.close()}

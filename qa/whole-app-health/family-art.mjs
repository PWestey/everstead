import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const origin=process.argv[2]||'http://127.0.0.1:8857';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,320]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('oathforge_new_world_proto_v01')));
  await page.locator('[data-nav="fellows"]').click();
  const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
  await page.locator('[data-roster="family"]').click();
  await page.locator('[data-family="elara"]:visible').click();
  for(const tab of ['overview','gifts','rank','building','bonds']){
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();
   const panel=page.locator('[data-phase24l-panel="'+tab+'"]');
   assert(await panel.isVisible());
   await page.locator('[data-phase24l-profile="family"] img').evaluateAll(images=>Promise.all(images.filter(img=>img.getBoundingClientRect().height>0).map(img=>img.decode())));
   assert(await panel.evaluate(el=>[...el.querySelectorAll('button,select')].filter(n=>n.getBoundingClientRect().height).every(n=>{const r=n.getBoundingClientRect(),p=el.getBoundingClientRect();return r.bottom<=p.bottom+1&&r.right<=p.right+1})),width+' '+tab+' controls fit');
   await page.screenshot({path:'/tmp/everstead-family-'+width+'-'+tab+'.png'});
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();
   assert(await panel.isHidden());
  }
  const before=await state();
  await page.locator('[data-phase24l-profile-tab="gifts"]').click();
  await page.locator('[data-modal-act="give-family-gift"]').click();
  const gifted=await state();
  assert.equal(gifted.gifts,before.gifts-1);
  assert.equal(gifted.family.elara.intimacy,before.family.elara.intimacy+10);
  await page.locator('[data-phase24l-profile-tab="building"]').click();
  await page.locator('[data-phase24l-family-building-select]').selectOption('archives');
  await page.locator('[data-phase24l-family-building-apply]').click();
  const assigned=await state();assert.equal(assigned.family.elara.assignedBuildingId,'archives');
  await page.reload({waitUntil:'domcontentloaded',timeout:90000});
  const loaded=await state();assert.deepEqual(loaded.family,assigned.family);assert.equal(loaded.gifts,assigned.gifts);
  assert.deepEqual(errors,[]);
  console.log('PASS '+width+': five panels, single gift accounting, free assignment, reload');
  await page.close();
 }
}finally{await browser.close()}

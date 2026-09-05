import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try {
 for(const width of [390,320]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8857/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  await page.locator('[data-nav="fellows"]').click();
  const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
  await page.locator('[data-roster="fellows"]').click();
  await page.locator('[data-fellow="cael"]:visible').click();
  for(const tab of ['overview','level','rank','relics','bonds']){
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();
   const panel=page.locator('[data-phase24l-panel="'+tab+'"]');
   assert(await panel.isVisible());
   const clipped=await panel.evaluate(el=>[...el.querySelectorAll('button,select')].filter(n=>!n.disabled&&n.getBoundingClientRect().height).map(n=>{const b=n.getBoundingClientRect(),p=el.getBoundingClientRect();return {text:n.textContent.trim(),bad:b.bottom>p.bottom+1||b.right>p.right+1||b.left<p.left-1};}).filter(n=>n.bad));
   assert.deepEqual(clipped,[],width+' '+tab+' reachable controls');
   await page.screenshot({path:'/tmp/everstead-fellow-'+width+'-'+tab+'.png'});
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();
   assert(await panel.isHidden());
  }
  await page.locator('[data-modal-close]:visible').click();
  await page.locator('[data-nav="adventure"]').click();
  const adventureGuide=page.locator('[data-phase24l-guide-close]:visible');if(await adventureGuide.count())await adventureGuide.click();
  page.on('dialog',d=>d.accept());
  await page.locator('[data-campaign-run]').click();
  await page.locator('[data-phase13-story="skip"]').click();
  await page.locator('[data-campaign-run]').click();
  await page.getByText('120 Fellow EXP available',{exact:true}).waitFor();
  for(let i=0;i<10;i++){
   await page.waitForTimeout(100);
   const skip=page.locator('[data-phase13-story="skip"]:visible'),close=page.locator('#overlay [data-modal-close]:visible');
   if(await skip.count())await skip.first().click();else if(await close.count())await close.first().click();else break;
  }
  await page.locator('[data-nav="fellows"]').click();
  const rosterGuide=page.locator('[data-phase24l-guide-close]:visible');if(await rosterGuide.count())await rosterGuide.click();
  await page.locator('[data-fellow="cael"]:visible').click();
  await page.locator('[data-phase24l-profile-tab="relics"]').click();
  await page.locator('[data-fellow-relic-select]').selectOption('first-road-lantern');
  await page.locator('[data-fellow-relic-apply]').click();
  const relicTab=page.locator('[data-phase24l-profile-tab="relics"]');
  if(await relicTab.getAttribute('aria-selected')!=='true')await relicTab.click();
  assert((await page.locator('.fellow-relic-showcase').innerText()).includes('First-Road Lantern'));
  await page.screenshot({path:'/tmp/everstead-fellow-'+width+'-equipped.png'});
  await page.locator('[data-phase24l-relic-detail]').click();
  await page.locator('[data-fellow-relic-display] img').waitFor();
  await page.locator('[data-fellow-relic-display] img').evaluate(img=>img.decode());
  assert(await page.locator('[data-fellow-relic-display] img').evaluate(img=>img.complete&&img.naturalWidth>0));
  await page.screenshot({path:'/tmp/everstead-fellow-'+width+'-detail.png'});
  assert(await page.locator('.modal:has([data-fellow-relic-display])').evaluate(el=>el.scrollHeight<=el.clientHeight+1),width+' Relic detail fits without scrolling');
  await page.locator('[data-modal-close]:visible').click();
  assert.deepEqual(errors,[]);
  console.log('PASS '+width+': five panels, artwork, control bounds, and toggle close');
  await page.close();
 }
}finally{await browser.close()}

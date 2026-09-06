import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const origin=process.argv[2]||'http://127.0.0.1:8857';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,320]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:568},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('[data-nav="fellows"]').click();
  const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
  await page.locator('[data-roster="companions"]').click();
  assert.equal(await page.locator('[data-companion]:visible').count(),20);
  await page.locator('[data-companion]:visible').first().click();
  for(const tab of ['overview','level','rank','assignment','mastery']){
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();
   const panel=page.locator('[data-phase24l-panel="'+tab+'"]');assert(await panel.isVisible());
   await page.locator('[data-phase24l-profile="companion"] img').evaluateAll(images=>Promise.all(images.filter(img=>img.getBoundingClientRect().height>0).map(img=>img.decode())));
   assert(await panel.evaluate(el=>[...el.querySelectorAll('button,select')].filter(n=>n.getBoundingClientRect().height).every(n=>{const r=n.getBoundingClientRect(),p=el.getBoundingClientRect();return r.bottom<=p.bottom+1&&r.right<=p.right+1})),width+' '+tab+' controls fit');
   await page.screenshot({path:'/tmp/everstead-companion-'+width+'-'+tab+'.png'});
   await page.locator('[data-phase24l-profile-tab="'+tab+'"]').click();assert(await panel.isHidden());
  }
  for(const id of fs.readdirSync(new URL('../../assets/portraits/companions/',import.meta.url),{withFileTypes:true}).filter(entry=>entry.isDirectory()).map(entry=>entry.name)){
   for(const variant of ['portrait','thumb']){
    const dimensions=await page.evaluate(async url=>{const img=new Image();img.src=url;await img.decode();return [img.naturalWidth,img.naturalHeight]},origin+'/assets/portraits/companions/'+id+'/'+variant+'.webp');
    assert.deepEqual(dimensions,variant==='portrait'?[1024,1536]:[320,480]);
   }
  }
  assert.deepEqual(errors,[]);console.log('PASS '+width+': 20 roster cards, five toggle panels, fitting controls, 40 decoded assets, no page errors');
  await page.close();
 }
}finally{await browser.close()}

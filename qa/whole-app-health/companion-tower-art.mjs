import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
// Presentation-only fixture: expose the existing renderer in this isolated response.
// No production bridge, save, rank gate, or progression code is changed.
const origin=process.argv[2]||'http://127.0.0.1:8857';
const html=fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const insertion=html.lastIndexOf('\n})();');
const fixture=html.slice(0,insertion)+'\nwindow.__towerArt=()=>{const main=document.querySelector("main");main.innerHTML=companionTowerView();main.dataset.phase24lGameScreen="adventure";bindCommon()};'+html.slice(insertion);
const browser=await chromium.launch({headless:true});
try{for(const width of [390,320]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:568}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/index.html',route=>route.fulfill({contentType:'text/html',body:fixture}));
 await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
 await page.locator('[data-nav="adventure"]').click();
 const guide=page.locator('[data-phase24l-guide-close]:visible');if(await guide.count())await guide.click();
 await page.evaluate(()=>window.__towerArt());
 await page.locator('.companion-tower-board img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
 assert.equal(await page.locator('.tower-art-floor').count(),3);
 assert(await page.locator('.companion-tower-board').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}));
 await page.screenshot({path:'/tmp/everstead-tower-'+width+'-action.png'});
 await page.locator('[data-phase24l-local-tab="action"]').click();
 await page.screenshot({path:'/tmp/everstead-tower-'+width+'.png'});
 assert.deepEqual(errors,[]);console.log('PASS Tower presentation '+width);await page.close();
}}finally{await browser.close()}

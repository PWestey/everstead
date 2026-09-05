import {chromium} from '/Users/westmanfamily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const contract=JSON.parse(readFileSync(resolve(here,'contract.json'),'utf8'));
const origin=(process.argv[2]||'http://127.0.0.1:8840').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('console',message=>{if(['warning','error'].includes(message.type()))errors.push(`${message.type()}: ${message.text()}`)});
page.on('pageerror',error=>errors.push(`pageerror: ${error.stack||error.message}`));

let response=null,evidence=null,fatal='';
try{
 response=await page.goto(`${origin}/index.html`,{waitUntil:'load',timeout:60000});
 await page.waitForSelector('[data-nav="village"]',{timeout:30000});
 evidence=await page.evaluate(({bridgeGlobal,engineGlobal,uiGlobal,selectors,rootFields})=>{
  const describe=name=>{const descriptor=Object.getOwnPropertyDescriptor(window,name);return{type:typeof window[name],enumerable:descriptor?.enumerable,configurable:descriptor?.configurable,writable:descriptor?.writable,version:window[name]?.version}};
  const root=window.__EVERSTEAD_PHASE24L_C1_RESULT__?.state?.experienceProgression||null;
  return{
   url:location.href,
   bridgeType:typeof window[bridgeGlobal],
   engine:describe(engineGlobal),
   ui:describe(uiGlobal),
   bottomNavigation:[...document.querySelectorAll('[data-nav]')].filter(node=>getComputedStyle(node).display!=='none').map(node=>node.dataset.nav),
   c1ControlCount:document.querySelectorAll(selectors.investment).length,
   companionProfileCount:document.querySelectorAll(selectors.profile).length,
   rootFieldPresence:root?Object.fromEntries(rootFields.map(key=>[key,Object.hasOwn(root,key)])):null
  };
 },{bridgeGlobal:contract.integration.productionBridge,engineGlobal:contract.candidate.global,uiGlobal:'EVERSTEAD_PHASE24L_COMPANION_EXP_UI',selectors:contract.integration.selectors,rootFields:contract.candidate.rootFields});
}catch(error){fatal=error.stack||error.message}

const pass=response?.status()===200&&fatal===''&&evidence?.url===`${origin}/index.html`&&evidence?.bridgeType==='undefined'&&evidence?.engine?.type==='object'&&evidence.engine.enumerable===false&&evidence.engine.configurable===false&&evidence.engine.writable===false&&evidence.engine.version===contract.candidate.version&&evidence?.ui?.type==='object'&&evidence.ui.enumerable===false&&evidence.ui.configurable===false&&evidence.ui.writable===false&&evidence.ui.version===1&&JSON.stringify(evidence.bottomNavigation)===JSON.stringify(['village','oaths','fellows','adventure','more'])&&evidence.c1ControlCount===0&&evidence.companionProfileCount===0&&errors.length===0;
console.log(`${pass?'PASS':'FAIL'} production-c1-is-hidden-neutral-and-query-gated · ${JSON.stringify({status:response?.status(),evidence,errors,fatal})}`);
console.log(`RESULT ${pass?1:0} passed, ${pass?0:1} failed`);
await context.close();
await browser.close();
if(!pass)process.exitCode=1;

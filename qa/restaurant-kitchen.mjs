import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
vm.runInThisContext(fs.readFileSync('src/restaurant-kitchen.js','utf8'));
const E=globalThis.EVERSTEAD_KITCHEN;let now=1788703671078,r=E.create(now),checks=0;
function good(){assert(E.valid(r));checks++;assert(E.valid(JSON.parse(JSON.stringify(r),(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.assign(Object.create(null),v):v)));checks++;}
function act(a,id){const q=E.act(r,a,id,now);assert(q.ok,q.reason);r=q.root;good();return q;}
good();act('improve',0);assert.deepEqual(E.bonuses(r),{power:10,earnings:120});
for(let i=0;i<360;i++){now+=1800000;r=E.settle(r,now);act('supplies');const id=i%4;if(!r.levels[id]&&r.notes>=E.price(r,id))act('improve',id);if(r.levels[id]&&r.levels[id]<10&&r.notes>=E.price(r,id))act('improve',id);const dish=r.levels[id]?id:0;act('cook',dish);const pending=structuredClone(r.pending),before=JSON.stringify(r);assert(!E.act(r,'cook',dish,now).ok);assert.equal(JSON.stringify(r),before);act('claim',pending.id);assert(!E.act(r,'claim',pending.id,now).ok);checks+=3;}
assert(r.levels.every(x=>x>1));const bad=structuredClone(r);bad.notes++;assert(!E.valid(bad));const bank=E.settle(r,now+48*3600000);assert.equal(bank.crates,6);assert.equal(bank.diners,12);assert.deepEqual(E.settle(bank,now+48*3600000),bank);console.log('PASS',checks,'kitchen accounting checks; recipe levels',r.levels);

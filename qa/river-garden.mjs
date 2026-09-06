import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
for(const file of ['river-garden','restaurant-kitchen'])vm.runInThisContext(fs.readFileSync(`src/${file}.js`,'utf8'));
const E=globalThis.EVERSTEAD_RIVER_GARDEN,K=globalThis.EVERSTEAD_KITCHEN;let now=1788703671078,r=E.create(now),k=K.create(now);
const act=(action,input={})=>{const before=JSON.stringify(r),result=E.act(r,action,input,now);assert.equal(JSON.stringify(r),before);assert(result.ok,result.reason);r=result.root;if(result.supplies.some(Boolean)){k=K.receive(k,result.supplies,now);assert(k);assert.equal(k.version,2)}assert(E.valid(r));assert(K.valid(k));assert.deepEqual(k.fieldSupplies||[0,0,0,0],E.supplies(r));return result};
assert(!E.act(r,'cast',{ground:1},now).ok);
for(let ground=0;ground<3;ground++)for(let j=0;j<3;j++){now+=1800000;act('cast',{ground});const pending=structuredClone(r.pending);assert(!E.act(r,'cast',{ground},now).ok);assert.deepEqual(E.settle(r,now+86400000).pending,pending);act('land',{id:pending.id});assert(!E.act(r,'land',{id:pending.id},now).ok)}
assert.equal(E.discovered(r),9);assert.equal(E.bonuses(r).power,270);
for(let i=0;i<240;i++){now+=1800000;act('cast',{ground:i%3});act('land',{id:r.pending.id});for(let id=0;id<9;id++)if(E.duplicates(r,id)>=E.researchCost(r.research[id]))act('research',{id})}
for(let plot=0;plot<3;plot++)act('plant',{plot,crop:plot});assert(!E.act(r,'harvest',{plot:0,id:r.plots[0].id},now).ok);now+=1800000;for(let plot=0;plot<3;plot++){const id=r.plots[plot].id;act('harvest',{plot,id});assert(!E.act(r,'harvest',{plot,id},now).ok)}
assert.deepEqual(k.pantry.slice(0,3),[4,4,3]);assert.equal(k.pantry[3],249);
k=K.act(k,'improve',0,now).root;k=K.act(k,'cook',0,now).root;k=K.act(k,'claim',1,now).root;assert(K.valid(k));assert.equal(k.pantry[0],2);
for(const change of [x=>x.catches[0]++,x=>x.harvests[0]++,x=>x.research[0]=9999,x=>x.plots[0]={},x=>x.bait=25]){const bad=structuredClone(r);change(bad);assert(!E.valid(bad))}
assert.equal(E.settle(r,now+86400000*20).bait,24);assert.deepEqual(E.settle(r,now-86400000),r);console.log('PASS 249 catches, research, locked grounds, committed catch, all crops, v1 kitchen migration, cooking and malformed records');

import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
for(const f of ['restaurant-kitchen','restaurant-hospitality'])vm.runInThisContext(fs.readFileSync(`src/${f}.js`,'utf8'));
const K=EVERSTEAD_KITCHEN,H=EVERSTEAD_HOSPITALITY,cast=Array.from({length:20},(_,i)=>({id:`fellow:guest${i}`,favorite:i%4}));let now=1788703671078,k=K.create(now),h=H.create(k),extra=0;
function act(a,id=0){const before=k,result=['station','hospitality-guide'].includes(a)?{ok:true,root:K.settle(k,now),gold:0}:K.act(k,a,id,now);assert(result.ok,result.reason);const q=H.change(h,before,result.root,a,id,cast);assert(q.ok,q.reason);k=result.root;h=q.root;extra+=q.gold;assert(H.valid(h,k));}
act('improve');for(let i=0;i<160;i++){now+=1800000;act('supplies');act('cook');const expected=h.pending.level*25;act('claim',k.pending.id);assert.equal(extra,H.totals(h).gold);for(let id=0;id<4;id++)if(h.levels[id]<5&&H.totals(h).popularity>=H.gates[id]&&H.totals(h).seals>=H.cost(h.levels[id]))act('station',id);}
assert.equal(Object.keys(h.visits).length,20);assert(h.levels[0]>0);assert(extra>0);assert(H.totals(h).seals>=0);
now+=1800000;act('supplies');act('cook');const pending=structuredClone(h.pending);assert(!H.change(h,k,k,'claim',999,cast).ok);assert.deepEqual(h.pending,pending);
const oldK=K.create(now);let legacy=K.act(oldK,'improve',0,now).root;legacy=K.act(legacy,'supplies',0,now).root;legacy=K.act(legacy,'cook',0,now).root;const migrated=H.create(legacy),paid=K.act(legacy,'claim',1,now).root,q=H.change(migrated,legacy,paid,'claim',1,cast);assert(q.ok);assert.equal(q.gold,0);assert.equal(H.totals(q.root).served,0);assert.equal(q.root.baselineServed,1);
for(const mutate of [r=>r.visits['fellow:guest0']++,r=>r.levels[0]=6,r=>r.services[0][0]++]){const bad=structuredClone(h);mutate(bad);assert(!H.valid(bad,k))}
console.log('PASS hospitality: 160 tables, returning guests, stations, accounting, legacy payment and invalid states');

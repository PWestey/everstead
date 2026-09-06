import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
vm.runInThisContext(fs.readFileSync('src/hearth-school.js','utf8'));const E=globalThis.EVERSTEAD_HEARTH_SCHOOL,context={family:[{id:'elara',intimacy:0}]};let now=1788703671078,r=E.create(now);
const act=(a,id='',job=0)=>{const old=JSON.stringify(r),q=E.act(r,a,id,job,now,context);assert.equal(JSON.stringify(r),old);assert(q.ok,q.reason);r=q.root;assert(E.valid(r));return q};
act('gather','elara');act('bless','elara');assert.equal(r.family.elara.level,1);assert.equal(r.family.elara.points,0);
assert(!E.act(r,'bless','elara',0,now,context).ok);
for(let i=0;i<300;i++){now+=7200000;act('enroll','elara',i%3);const id=String(r.enrolled);for(let j=0;j<4;j++)assert.equal(act('lesson',id).rawExp,80);assert(!E.act(r,'lesson',id,0,now,context).ok);act('graduate',id);assert(!E.act(r,'graduate',id,0,now,context).ok);}
assert.equal(E.earnings(r),90000);assert.equal(E.rawExp(r),96000);assert.equal(r.recent.length,12);assert.equal(E.seats(r),3);
for(const mutate of [x=>x.graduates++,x=>x.lessonsByGrade[1]++,x=>x.family.elara.points++,x=>x.pupils.push({}),x=>x.version=2]){const bad=structuredClone(r);mutate(bad);assert(!E.valid(bad));}
const bank=E.settle(r,now+7*86400000);assert.equal(bank.lessons,24);assert.equal(bank.visits,12);assert.deepEqual(E.settle(bank,now),bank);
console.log('PASS 300 graduates, lesson receipts, income, banking, duplicates, malformed records');

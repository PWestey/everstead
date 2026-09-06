import assert from 'node:assert/strict';
import '../src/village-professions.js';
const E=globalThis.EVERSTEAD_PROFESSIONS,T=1800000;
let now=100000000,root=E.create(now);
const run=(id,action,input={})=>{const before=JSON.stringify(root),result=E.act(root,id,action,input,now);assert.equal(JSON.stringify(root),before,'transaction mutated input');assert.equal(result.ok,true,result.reason);root=result.root;assert(E.valid(root));return result;};
assert(E.valid(root));assert(!E.valid(undefined));assert.equal(E.settle(root,now-1),null);
for(const id of Object.keys(E.definitions))assert.equal(E.status(root,id,now).bank,6);
run('command','gather');run('command','allocate',{project:'well'});
for(let n=0;n<3;n++)run('archives','gather');
for(let tile=0;tile<9;tile++)run('archives','reveal',{tile});
assert(!E.act(root,'archives','reveal',{tile:0},now).ok);
run('archives','collect',{claimId:'map:1'});assert(!E.act(root,'archives','collect',{claimId:'map:1'},now).ok);
for(const track of ['strength','guard','focus'])run('training','drill',{fellowId:'fellow_1',track});
run('training','promote',{fellowId:'fellow_1'});assert(!E.act(root,'training','promote',{fellowId:'fellow_1'},now).ok);
assert.equal(E.bonuses(root,'fellow_1').power-E.bonuses(root,'fellow_2').power,25);
assert.equal(E.bonuses(root,'fellow_1').earnings,E.bonuses(root,'fellow_2').earnings);
for(const [id,action,key,items,deliver,prefix] of [['apothecary','brew','recipe',['glow','calm','mend'],'deliver','patient'],['market','craft','item',['tools','cloth','lantern'],'fulfill','order']]){
  for(let i=0;i<3;i++){run(id,'gather');run(id,action,{[key]:items[i]});run(id,deliver,{claimId:`${prefix}:${i+1}`});assert(!E.act(root,id,deliver,{claimId:`${prefix}:${i+1}`},now).ok);}
}
run('gatehouse','gather');run('gatehouse','dispatch',{route:'river'});
assert(!E.act(root,'gatehouse','claim',{claimId:'caravan:1'},now).ok);
now+=60000;run('gatehouse','claim',{claimId:'caravan:1'});assert(!E.act(root,'gatehouse','claim',{claimId:'caravan:1'},now).ok);
for(const gear of ['blade','shield','charm']){run('forge','gather');run('forge','forge',{gear});}
run('forge','gather');run('forge','gather');run('forge','refine',{gear:'blade'});
for(const component of ['base','runes','beacon']){run('waystone','gather');run('waystone','restore',{component});}
assert(E.bonuses(root).power>0);assert(E.bonuses(root).earnings>0);
assert.deepEqual(E.settle(root,now),root);
now+=T;root=E.settle(root,now);assert(E.valid(root));
root=E.settle(root,now+10*86400000);assert.equal(root.facilities.command.bank,24);assert.deepEqual(E.settle(root,root.lastTime),root);
assert(E.valid(JSON.parse(JSON.stringify(root))));
for(const mutate of [r=>r.extra=1,r=>r.facilities.command.bank++,r=>r.facilities.forge.data.blade=100000,r=>r.facilities.market.data.delivered=100,r=>r.facilities.training.data.fellows.fellow_1.mastery=10,r=>r.facilities.archives.data.tiles=[1,1],r=>r.lastTime--,r=>r.facilities.gatehouse.data.claimed++]){const bad=structuredClone(root);mutate(bad);assert(!E.valid(bad));assert.equal(E.settle(bad,root.lastTime),null);assert(!E.act(bad,'command','gather',{},root.lastTime).ok);}
assert(!E.act(root,'training','drill',{fellowId:'__proto__',track:'focus'},root.lastTime).ok);
assert(!E.act(root,'command','gather',{extra:true},root.lastTime).ok);
assert.equal(E.settle(root,Number.MAX_SAFE_INTEGER),null);
assert.equal(E.settle(root,Infinity),null);
assert.equal(E.settle(root,NaN),null);
assert.throws(()=>E.create(Number.MAX_SAFE_INTEGER));
const far=E.create(Number.MAX_SAFE_INTEGER-2*86400000);
let trip=E.act(far,'gatehouse','gather',{},far.lastTime).root;
trip=E.act(trip,'gatehouse','dispatch',{route:'forest'},trip.lastTime).root;
assert(E.valid(trip));assert(E.settle(trip,trip.facilities.gatehouse.data.active.readyAt));
let exhausted=E.create(0);exhausted.lastTime=1000000*T;
Object.assign(exhausted.facilities.command,{bank:0,granted:1000000,spent:1000000,gathered:1000000,lastAccrued:exhausted.lastTime});
assert(E.valid(exhausted));assert.equal(E.settle(exhausted,exhausted.lastTime+T).facilities.command.bank,0);
assert(!E.act(exhausted,'command','gather',{},exhausted.lastTime+T).ok);
let capped=E.create(0);capped.lastTime=10000*T;Object.assign(capped.facilities.command,{bank:0,granted:10000,spent:10000,gathered:10000,lastAccrued:capped.lastTime});capped.facilities.command.data.well=10000;
assert(E.valid(capped));assert(!E.act(capped,'command','allocate',{project:'well'},capped.lastTime).ok);
const guided=E.act(root,'command','guide',{},root.lastTime);assert(guided.ok);assert.equal(E.status(guided.root,'command',root.lastTime).tutorial,true);
for(const [place,variants] of Object.entries({command:{well:[2,20],roads:[5,10],hall:[10,5]},forge:{blade:[20,4],shield:[12,8],charm:[6,20]},gatehouse:{river:[8,25],ridge:[16,50],forest:[24,75]}})){
  for(const [variant,[power,earnings]] of Object.entries(variants)){
    let sample=E.create(0);sample=E.act(sample,place,'gather',{},0).root;
    const action=place==='command'?'allocate':place==='forge'?'forge':'dispatch',key=place==='command'?'project':place==='forge'?'gear':'route';
    sample=E.act(sample,place,action,{[key]:variant},0).root;
    if(place==='gatehouse')sample=E.act(sample,place,'claim',{claimId:'caravan:1'},sample.facilities.gatehouse.data.active.readyAt).root;
    assert.deepEqual(E.bonuses(sample,'fellow'),{power,earnings});
    assert(E.status(sample,place,sample.lastTime).details.some(line=>line.includes(`+${power} Power and +${earnings} hourly earnings`)));
  }
}
for(const fellowId of ['__proto__','constructor','prototype','toString']){
  const view=E.status(root,'training',root.lastTime,fellowId);assert(!view.progress.includes('undefined'));assert(view.actions.find(a=>a.action==='promote').disabled);assert.equal(E.bonuses(root,fellowId).power,E.bonuses(root).power);
}
console.log('PASS: all eight loops, immutable transactions, persistence, conservation, banks, time, claims, and corruption rejection');

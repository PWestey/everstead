/* Restaurant hospitality v1. Guest payments snapshot stations at cooking time. */
(function(g){'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x)),safe=x=>Number.isSafeInteger(x)&&x>=0,sum=a=>a.reduce((n,v)=>n+v,0);
 const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
 const stations=['Hearth Oven','Soup Kettle','River Grill','Banquet Table'],gates=[0,10,25,45];
 const cost=level=>5*(level+1),spent=levels=>sum(levels.map(l=>5*l*(l+1)/2));
 function create(k){return{version:1,baselineServed:k.served,legacyPending:k.pending?.id??null,levels:[0,0,0,0],services:Array.from({length:6},()=>[0,0]),visits:{},pending:null,tutorial:false};}
 function totals(r){let served=0,seals=0,popularity=0,gold=0;for(let level=0;level<6;level++)for(let favorite=0;favorite<2;favorite++){const n=r.services[level][favorite];served+=n;seals+=n*(1+favorite);popularity+=n*(3+level+2*favorite);gold+=n*level*25;}return{served,seals:seals-spent(r.levels),popularity,gold,power:sum(r.levels)*5,earnings:sum(r.levels)*60};}
 function valid(r,k){try{
  if(!exact(r,['version','baselineServed','legacyPending','levels','services','visits','pending','tutorial'])||r.version!==1||!safe(r.baselineServed)||typeof r.tutorial!=='boolean'||!Array.isArray(r.levels)||r.levels.length!==4||!r.levels.every(l=>safe(l)&&l<=5)||!Array.isArray(r.services)||r.services.length!==6||!r.services.every(a=>Array.isArray(a)&&a.length===2&&a.every(safe))||!r.visits||typeof r.visits!=='object'||Array.isArray(r.visits)||Object.keys(r.visits).length>300||!Object.entries(r.visits).every(([id,n])=>/^(fellow|family):[a-z][a-z0-9_-]{0,63}$/.test(id)&&safe(n)))return false;
  const t=totals(r);if(!Object.values(t).every(safe)||sum(Object.values(r.visits))!==t.served||k.served!==r.baselineServed+t.served||r.levels.some((l,i)=>l&&t.popularity<gates[i]))return false;
  if(r.legacyPending!==null)return safe(r.legacyPending)&&r.legacyPending===k.pending?.id&&r.pending===null;
  if(r.pending===null)return k.pending===null;
  const p=r.pending;return exact(p,['id','guest','recipe','level','favorite'])&&p.id===k.pending?.id&&p.recipe===k.pending.recipe&&safe(p.level)&&p.level<=r.levels[p.recipe]&&typeof p.favorite==='boolean'&&/^(fellow|family):[a-z][a-z0-9_-]{0,63}$/.test(p.guest);
 }catch{return false}}
 function guest(r,cast){const t=totals(r),count=Math.min(cast.length,4+Math.floor(t.popularity/10)*2);return cast[t.served%count];}
 function preview(r,recipe,cast){const person=guest(r,cast),level=r.levels[recipe],favorite=person.favorite===recipe;return{guest:person,level,favorite,seals:1+Number(favorite),popularity:3+level+2*Number(favorite),gold:level*25};}
 function change(root,before,after,action,id,cast){if(!valid(root,before))return{ok:false,reason:'Dining room records could not be verified.'};const r=copy(root);let gold=0;
  if(action==='hospitality-guide')r.tutorial=true;
  else if(action==='station'){if(!safe(id)||id>3||r.levels[id]>=5||totals(r).popularity<gates[id]||totals(r).seals<cost(r.levels[id]))return{ok:false,reason:'Earn more popularity or Service Seals before upgrading this station.'};r.levels[id]++;}
  else if(action==='cook'){const p=preview(r,id,cast);r.pending={id:after.pending.id,guest:p.guest.id,recipe:id,level:p.level,favorite:p.favorite};}
  else if(action==='claim'){
   if(r.legacyPending!==null){if(id!==r.legacyPending)return{ok:false,reason:'Previous table changed.'};r.legacyPending=null;r.baselineServed++;}
   else{const p=r.pending;if(!p||p.id!==id)return{ok:false,reason:'This guest has already paid.'};r.services[p.level][Number(p.favorite)]++;r.visits[p.guest]=(r.visits[p.guest]||0)+1;gold=p.level*25;r.pending=null;}
  }
  return valid(r,after)?{ok:true,root:r,gold}:{ok:false,reason:'Dining room accounting refused this action.'};
 }
 g.EVERSTEAD_HOSPITALITY=Object.freeze({create,valid,totals,guest,preview,change,cost,stations:Object.freeze(stations),gates:Object.freeze(gates)});
})(globalThis);

/* Public recipe progression. Pure accounting; host owns atomic persistence. */
(function(g){'use strict';
 const recipes=[
  {id:'bread',name:'Hearthbread',icon:'🥖',unlock:0,gold:90,cost:[2,0,0,0]},
  {id:'soup',name:'Garden Soup',icon:'🍲',unlock:4,gold:140,cost:[0,2,1,0]},
  {id:'fish',name:'Herbed River Fish',icon:'🐟',unlock:8,gold:200,cost:[0,0,1,2]},
  {id:'feast',name:'Covenant Feast',icon:'🍱',unlock:12,gold:280,cost:[2,2,1,1]}
 ];
 const ingredients=['Grain','Vegetables','Herbs','Fish'],crate=[4,3,2,2],copy=x=>JSON.parse(JSON.stringify(x));
 const int=x=>Number.isSafeInteger(x)&&x>=0,plain=x=>x&&typeof x==='object'&&!Array.isArray(x)&&[null,Object.prototype].includes(Object.getPrototypeOf(x));
 const exact=(x,keys)=>plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
 const spent=r=>r.levels.reduce((n,l,i)=>n+(l?recipes[i].unlock+3*l*(l-1)/2:0),0);
 function create(now){if(!int(now))throw Error('Invalid kitchen clock');return{version:1,activatedAt:now,lastArrival:now,lastDelivery:now,diners:4,crates:3,deliveries:0,pantry:[0,0,0,0],levels:[0,0,0,0],cooked:recipes.map(()=>Array(10).fill(0)),served:0,notes:0,gold:0,pending:null,tutorial:false};}
 function valid(r){try{
  if(!exact(r,['version','activatedAt','lastArrival','lastDelivery','diners','crates','deliveries','pantry','levels','cooked','served','notes','gold','pending','tutorial',...(r?.version===2?['fieldSupplies']:[])])||![1,2].includes(r.version)||![r.activatedAt,r.lastArrival,r.lastDelivery,r.diners,r.crates,r.deliveries,r.served,r.notes,r.gold].every(int)||r.lastArrival<r.activatedAt||r.lastDelivery<r.activatedAt||r.diners>12||r.crates>6||r.deliveries>1e8||typeof r.tutorial!=='boolean')return false;
  if(r.version===2&&(!Array.isArray(r.fieldSupplies)||r.fieldSupplies.length!==4||!r.fieldSupplies.every(int)))return false;
  if(!Array.isArray(r.pantry)||r.pantry.length!==4||!r.pantry.every(int)||!Array.isArray(r.levels)||r.levels.length!==4||!r.levels.every(l=>int(l)&&l<=10)||!Array.isArray(r.cooked)||r.cooked.length!==4)return false;
  let meals=0,gold=0,used=[0,0,0,0];
  for(let i=0;i<4;i++){const counts=r.cooked[i];if(!Array.isArray(counts)||counts.length!==10||!counts.every((v,j)=>int(v)&&v<=1e8&&(j<r.levels[i]||v===0)))return false;counts.forEach((n,j)=>{meals+=n;gold+=n*recipes[i].gold*(j+1);used=used.map((v,k)=>v+n*recipes[i].cost[k]);});}
  if(r.pending!==null){const p=r.pending;if(!exact(p,['id','recipe','level','gold'])||p.id!==r.served+1||!int(p.recipe)||p.recipe>3||!int(p.level)||p.level<1||p.level>r.levels[p.recipe]||r.cooked[p.recipe][p.level-1]<1||p.gold!==recipes[p.recipe].gold*p.level)return false;gold-=p.gold;}
  return int(gold)&&meals===r.served+(r.pending?1:0)&&r.gold===gold&&r.notes===2*r.served-spent(r)&&r.pantry.every((n,i)=>n===r.deliveries*crate[i]+(r.fieldSupplies?.[i]||0)-used[i]);
 }catch{return false;}}
 function settle(root,now){if(!valid(root)||!int(now))return null;const r=copy(root);for(const [clock,bank,period,cap]of [['lastArrival','diners',900000,12],['lastDelivery','crates',1800000,6]]){if(now<=r[clock])continue;const elapsed=Math.min(86400000,now-r[clock]);r[bank]=Math.min(cap,r[bank]+Math.floor(elapsed/period));r[clock]=r[bank]===cap?now:now-elapsed%period;}return r;}
 function bonuses(r){const levels=valid(r)?r.levels.reduce((a,b)=>a+b,0):0;return{power:levels*10,earnings:levels*120};}
 function price(r,i){return r.levels[i]?r.levels[i]*3:recipes[i].unlock;}
 function act(root,action,id,now){const r=settle(root,now),fail=reason=>({ok:false,reason});if(!r)return fail('Kitchen save could not be verified.');let reward=0;
  if(action==='tutorial')r.tutorial=true;
  else if(action==='supplies'){if(!r.crates)return fail('The next delivery arrives within 30 minutes.');if(r.deliveries>=1e8)return fail('Kitchen records need an update.');r.crates--;r.deliveries++;r.pantry=r.pantry.map((n,i)=>n+crate[i]);}
  else if(action==='improve'){if(!int(id)||id>3)return fail('Unknown recipe.');if(r.levels[id]>=10)return fail('Recipe mastered for this release.');const cost=price(r,id);if(r.notes<cost)return fail(`Earn ${cost-r.notes} more Chef Notes by serving customers.`);r.notes-=cost;r.levels[id]++;}
  else if(action==='cook'){if(!int(id)||id>3||!r.levels[id])return fail('Unlock this recipe first.');if(r.pending)return fail('Collect the previous table’s payment first.');if(!r.diners)return fail('More customers arrive within 15 minutes.');if(r.pantry.some((n,i)=>n<recipes[id].cost[i]))return fail('Collect supplies or choose a dish using the ingredients you have.');r.pantry=r.pantry.map((n,i)=>n-recipes[id].cost[i]);r.diners--;r.cooked[id][r.levels[id]-1]++;r.pending={id:r.served+1,recipe:id,level:r.levels[id],gold:recipes[id].gold*r.levels[id]};}
  else if(action==='claim'){if(!r.pending||id!==r.pending.id)return fail('This payment has already been collected.');reward=r.pending.gold;r.gold+=reward;r.notes+=2;r.served++;r.pending=null;}
  else return fail('Unknown kitchen action.');
  return valid(r)?{ok:true,root:r,gold:reward}:fail('Kitchen accounting refused this action.');
 }
 recipes.forEach(r=>{Object.freeze(r.cost);Object.freeze(r)});
 function receive(root,amounts,now){const r=settle(root,now);if(!r||!Array.isArray(amounts)||amounts.length!==4||!amounts.every(int))return null;if(r.version===1){r.version=2;r.fieldSupplies=[0,0,0,0]}r.fieldSupplies=r.fieldSupplies.map((n,i)=>n+amounts[i]);r.pantry=r.pantry.map((n,i)=>n+amounts[i]);return valid(r)?r:null;}
 g.EVERSTEAD_KITCHEN=Object.freeze({recipes:Object.freeze(recipes),ingredients:Object.freeze(ingredients),create,valid,settle,act,bonuses,price,receive});
})(globalThis);

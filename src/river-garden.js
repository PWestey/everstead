/* River & Gardens v1: deterministic catch receipts, persistent plots, accounted supplies. */
(function(g){'use strict';
 const fish=[['Reed Minnow','#92c9bd'],['Sun Carp','#e4b04d'],['Silver Perch','#cbdde9'],['Glass Trout','#77c3df'],['Moss Tench','#6c9c6b'],['Moon Koi','#c5a6e1'],['Emberfin','#e38865'],['Star Sturgeon','#7d9ddb'],['Crown Pike','#e4d486']].map(([name,color],id)=>Object.freeze({id,name,color,ground:Math.floor(id/3)}));
 const grounds=['Village River','Willow Lake','Waystone Falls'];
 const crops=[{name:'Golden Wheat',ingredient:0,minutes:15,yield:4,color:'#d9ad47'},{name:'Garden Greens',ingredient:1,minutes:20,yield:4,color:'#6caa60'},{name:'Sage',ingredient:2,minutes:30,yield:3,color:'#aa9ad1'}].map(Object.freeze);
 const copy=x=>JSON.parse(JSON.stringify(x)),safe=x=>Number.isSafeInteger(x)&&x>=0,plain=x=>x&&typeof x==='object'&&!Array.isArray(x)&&[null,Object.prototype].includes(Object.getPrototypeOf(x));
 const exact=(x,keys)=>plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k)),sum=a=>a.reduce((n,v)=>n+v,0),array=(a,len)=>Array.isArray(a)&&a.length===len&&a.every(safe);
 const discovered=r=>r.catches.filter(n=>n>0).length;
 const researchCost=level=>2*(level+1),researchSpent=level=>level*(level+1);
 const nextFish=(r,ground)=>{const landed=sum(r.catches.slice(ground*3,ground*3+3));return ground*3+(landed<3?landed:[0,1,0,2,1,0][(landed-3)%6]);};
 function create(now){if(!safe(now))throw Error('Invalid river clock');return{version:1,activatedAt:now,baitClock:now,bait:6,casts:0,catches:Array(9).fill(0),research:Array(9).fill(0),pending:null,plots:[null,null,null],plantings:0,harvests:[0,0,0],tutorials:{fishing:false,gardens:false}};}
 function valid(r){try{
  if(!exact(r,['version','activatedAt','baitClock','bait','casts','catches','research','pending','plots','plantings','harvests','tutorials'])||r.version!==1||![r.activatedAt,r.baitClock,r.bait,r.casts,r.plantings].every(safe)||r.baitClock<r.activatedAt||r.bait>24||r.casts>10000000||r.plantings>10000000||!array(r.catches,9)||!array(r.research,9)||!array(r.harvests,3)||!Array.isArray(r.plots)||r.plots.length!==3||!exact(r.tutorials,['fishing','gardens'])||Object.values(r.tutorials).some(x=>typeof x!=='boolean'))return false;
  if(r.casts!==sum(r.catches)+(r.pending?1:0)||r.research.some((level,i)=>level>10000||researchSpent(level)>Math.max(0,r.catches[i]-1)))return false;
  if(r.pending!==null&&(!exact(r.pending,['id','fish','ground','at'])||r.pending.id!==r.casts||!safe(r.pending.fish)||r.pending.fish>8||!safe(r.pending.ground)||r.pending.ground>2||Math.floor(r.pending.fish/3)!==r.pending.ground||!safe(r.pending.at)||r.pending.at<r.activatedAt))return false;
  if(r.pending&&(r.pending.fish!==nextFish(r,r.pending.ground)||!unlocked(r,r.pending.ground)))return false;
  const ids=new Set();for(const p of r.plots)if(p!==null){if(!exact(p,['id','crop','plantedAt','readyAt'])||!safe(p.id)||p.id<1||p.id>r.plantings||ids.has(p.id)||!safe(p.crop)||p.crop>2||!safe(p.plantedAt)||p.plantedAt<r.activatedAt||!safe(p.readyAt)||p.readyAt!==p.plantedAt+crops[p.crop].minutes*60000)return false;ids.add(p.id);}
  return r.plantings===sum(r.harvests)+r.plots.filter(Boolean).length;
 }catch{return false}}
 function settle(root,now){if(!valid(root)||!safe(now))return null;const r=copy(root);if(now>r.baitClock){const elapsed=Math.min(86400000,now-r.baitClock);r.bait=Math.min(24,r.bait+Math.floor(elapsed/1800000));r.baitClock=r.bait===24?now:now-elapsed%1800000;}return r;}
 const supplies=r=>valid(r)?[r.harvests[0]*4,r.harvests[1]*4,r.harvests[2]*3,sum(r.catches)]:[0,0,0,0];
 const bonuses=r=>valid(r)?{power:discovered(r)*30+sum(r.research)*15,earnings:discovered(r)*60+sum(r.research)*30}:{power:0,earnings:0};
 const unlocked=(r,ground)=>ground===0||discovered(r)>=(ground===1?3:6);
 const duplicates=(r,id)=>Math.max(0,r.catches[id]-1-researchSpent(r.research[id]));
 function act(root,action,input={},now){const r=settle(root,now),fail=reason=>({ok:false,reason});if(!r)return fail('River and Garden records could not be verified.');let reward=[0,0,0,0];
  if(action==='guide-fishing'||action==='guide-gardens')r.tutorials[action.slice(6)]=true;
  else if(action==='cast'){
   const ground=input.ground;if(!safe(ground)||ground>2||!unlocked(r,ground))return fail('Discover the earlier waters before visiting this ground.');if(r.pending)return fail('Land the fish already on your line.');if(!r.bait)return fail('One bait arrives every 30 minutes.');if(r.casts>=10000000)return fail('Your fishing journal needs an update.');
   // Catch is committed at casting. Reopening or reloading cannot reroll it.
   // First three catches in each ground reveal its three species; later catches repeat a six-cast distribution.
   const selected=nextFish(r,ground);r.bait--;r.casts++;r.pending={id:r.casts,fish:selected,ground,at:now};
  }else if(action==='land'){
   if(!r.pending||input.id!==r.pending.id)return fail('This catch has already been landed.');r.catches[r.pending.fish]++;r.pending=null;reward[3]=1;
  }else if(action==='research'){
   const id=input.id;if(!safe(id)||id>8||r.research[id]>=10000||duplicates(r,id)<researchCost(r.research[id]))return fail('Catch more duplicates to research this species.');r.research[id]++;
  }else if(action==='plant'){
   const {plot,crop}=input;if(!safe(plot)||plot>2||!safe(crop)||crop>2||r.plots[plot])return fail('Choose an empty plot and a crop.');if(r.plantings>=10000000)return fail('Your garden records need an update.');r.plantings++;r.plots[plot]={id:r.plantings,crop,plantedAt:now,readyAt:now+crops[crop].minutes*60000};
  }else if(action==='harvest'){
   const {plot,id}=input;if(!safe(plot)||plot>2)return fail('Choose a plot.');const p=r.plots[plot];if(!p||p.id!==id)return fail('This crop has already been harvested.');if(now<p.readyAt)return fail('This crop is still growing.');r.harvests[p.crop]++;reward[crops[p.crop].ingredient]=crops[p.crop].yield;r.plots[plot]=null;
  }else return fail('Unknown outdoor action.');
  return valid(r)?{ok:true,root:r,supplies:reward}:fail('Outdoor accounting refused this action.');
 }
 g.EVERSTEAD_RIVER_GARDEN=Object.freeze({create,valid,settle,act,supplies,bonuses,unlocked,duplicates,researchCost,discovered,fish:Object.freeze(fish),grounds:Object.freeze(grounds),crops:Object.freeze(crops)});
})(globalThis);

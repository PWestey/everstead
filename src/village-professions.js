/* Independent Village workshops. Immutable transactions; no external currency or Relic writes. */
(function(global){
  'use strict';
  const PERIOD=1800000,DAY=86400000,MAX=1000000;
  const groups={command:['well','roads','hall'],training:['strength','guard','focus'],apothecary:['glow','calm','mend'],market:['tools','cloth','lantern'],gatehouse:['river','ridge','forest'],forge:['blade','shield','charm'],waystone:['base','runes','beacon']};
  const yields={command:{well:[2,20],roads:[5,10],hall:[10,5]},gatehouse:{river:[8,25],ridge:[16,50],forest:[24,75]},forge:{blade:[20,4],shield:[12,8],charm:[6,20]}};
  const definitions={};
  [['command','Command Center','🏛','Civic materials','Allocate supplies to lasting civic projects.','#bc955b'],['archives','Archives','📜','Map fragments','Restore nine map tiles and collect completed maps.','#b59cd9'],['training','Training Grounds','⚔','Drill opportunities','Balance strength, guard, and focus to promote each Fellow.','#dc9c72'],['apothecary','Apothecary','⚗','Ingredients','Brew remedies and deliver the requested bottle to each patient.','#92c8a5'],['market','Market','🧺','Craft supplies','Craft goods, then fulfill the town’s rotating orders.','#dfb46c'],['gatehouse','Gatehouse','🚪','Provisions','Dispatch a caravan and claim its cargo when it returns.','#a4bac9'],['forge','Forge','🔨','Forge ore','Forge workshop gear and refine it with your own ore.','#da9976'],['waystone','Waystone','💠','Stone shards','Restore the foundation, runes, and beacon together.','#9eade4']].forEach(([id,name,icon,resource,description,color])=>{definitions[id]={id,name,icon,resource,description,color,colors:[color,'#172025'],labels:groups[id]||[]};});
  const ids=Object.keys(definitions), copy=x=>JSON.parse(JSON.stringify(x));
  const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
  const exact=(x,keys)=>plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
  const int=(x,max=MAX)=>Number.isSafeInteger(x)&&x>=0&&x<=max;
  const time=x=>int(x,Number.MAX_SAFE_INTEGER-DAY);
  const recordId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
  const levels=id=>Object.fromEntries(groups[id].map(k=>[k,0]));
  function create(now){
    if(!time(now))throw new TypeError('Invalid Village timestamp.');
    const facilities=Object.fromEntries(ids.map(id=>[id,{bank:6,granted:6,spent:0,lastAccrued:now,gathered:0,tutorial:false,data:null}]));
    facilities.command.data=levels('command');facilities.archives.data={maps:0,tiles:[]};facilities.training.data={fellows:{}};
    for(const id of ['apothecary','market'])facilities[id].data={crafted:levels(id),delivered:0};
    facilities.gatehouse.data={dispatched:0,claimed:0,routes:levels('gatehouse'),active:null};
    facilities.forge.data=levels('forge');facilities.waystone.data=levels('waystone');
    return {version:1,activatedAt:now,lastTime:now,facilities};
  }
  const sum=x=>Object.values(x).reduce((a,b)=>a+b,0);
  function used(id,d){
    if(id==='command')return 3*sum(d);
    if(id==='archives')return 9*d.maps+d.tiles.length;
    if(id==='apothecary'||id==='market')return 3*sum(d.crafted);
    if(id==='gatehouse')return 3*d.dispatched;
    if(id==='forge'||id==='waystone')return 3*Object.values(d).reduce((n,v)=>n+v*(v+1)/2,0);
    return 0;
  }
  const validLevels=(d,id)=>exact(d,groups[id])&&Object.values(d).every(v=>int(v,10000));
  const deliveredOf=(n,i)=>Math.floor((n+2-i)/3);
  function valid(root){
    try{
      if(!exact(root,['version','activatedAt','lastTime','facilities'])||root.version!==1||!time(root.activatedAt)||!time(root.lastTime)||root.lastTime<root.activatedAt||!exact(root.facilities,ids))return false;
      for(const id of ids){
        const f=root.facilities[id],d=f.data;
        if(!exact(f,['bank','granted','spent','lastAccrued','gathered','tutorial','data'])||typeof f.tutorial!=='boolean'||!int(f.bank,24)||!int(f.granted)||f.granted<6||!int(f.spent)||f.bank!==f.granted-f.spent||!time(f.lastAccrued)||f.lastAccrued<root.activatedAt||f.lastAccrued>root.lastTime||!int(f.gathered))return false;
        if(f.granted>6+Math.floor((root.lastTime-root.activatedAt)/PERIOD))return false;
        if(['command','forge','waystone'].includes(id)&&!validLevels(d,id))return false;
        if(id==='archives'&&(!exact(d,['maps','tiles'])||!int(d.maps)||!Array.isArray(d.tiles)||d.tiles.length>9||new Set(d.tiles).size!==d.tiles.length||!d.tiles.every(t=>int(t,8))))return false;
        if(id==='training'){
          if(!exact(d,['fellows'])||!plain(d.fellows)||Object.keys(d.fellows).length>200||f.gathered!==0)return false;
          let spent=0;
          for(const [key,m] of Object.entries(d.fellows)){
            if(!recordId(key)||!exact(m,['strength','guard','focus','mastery'])||!Object.values(m).every(v=>int(v))||groups.training.some(t=>m[t]<m.mastery))return false;
            spent+=m.strength+m.guard+m.focus;
          }
          if(f.spent!==spent)return false;
        }else if(f.spent!==f.gathered||3*f.gathered-used(id,d)<0)return false;
        if(id==='apothecary'||id==='market'){
          if(!exact(d,['crafted','delivered'])||!validLevels(d.crafted,id)||!int(d.delivered)||groups[id].some((k,i)=>d.crafted[k]<deliveredOf(d.delivered,i)))return false;
        }
        if(id==='gatehouse'){
          if(!exact(d,['dispatched','claimed','routes','active'])||!int(d.dispatched)||!int(d.claimed)||!validLevels(d.routes,id)||sum(d.routes)!==d.claimed||d.dispatched-d.claimed!==(d.active?1:0))return false;
          const a=d.active;
          if(a!==null&&(!exact(a,['id','route','startedAt','readyAt'])||a.id!==`caravan:${d.dispatched}`||!groups.gatehouse.includes(a.route)||!time(a.startedAt)||a.startedAt<root.activatedAt||a.startedAt>root.lastTime||a.readyAt!==a.startedAt+duration(a.route)))return false;
        }
      }
      return true;
    }catch{return false;}
  }
  function settle(root,now){
    if(!valid(root)||!time(now)||now<root.lastTime)return null;
    const next=copy(root);next.lastTime=now;
    for(const f of Object.values(next.facilities)){
      const elapsed=Math.min(DAY,now-f.lastAccrued),n=Math.min(24-f.bank,Math.floor(elapsed/PERIOD),MAX-f.granted);
      f.bank+=n;f.granted+=n;f.lastAccrued=f.bank===24?now:now-elapsed%PERIOD;
    }
    return valid(next)?next:null;
  }
  const duration=route=>({river:60000,ridge:180000,forest:300000})[route];
  const stock=(id,f)=>id==='training'?0:3*f.gathered-used(id,f.data);
  function act(root,id,action,input={},now){
    const next=settle(root,now),fail=reason=>({ok:false,reason});
    if(!next||!Object.hasOwn(definitions,id)||!plain(input))return fail('The workshop state or time could not be verified.');
    const f=next.facilities[id],d=f.data;
    const requireInput=keys=>exact(input,keys);
    const need=n=>stock(id,f)>=n;
    let message='Workshop progress saved.';
    if(action==='guide'&&requireInput([])){f.tutorial=true;message='Workshop guide saved.';
    }else if(action==='gather'&&id!=='training'&&requireInput([])){
      if(f.bank<1)return fail('A new opportunity arrives every 30 minutes.');f.bank--;f.spent++;f.gathered++;message=`Gathered 3 ${definitions[id].resource.toLowerCase()}.`;
    }else if(id==='command'&&action==='allocate'&&requireInput(['project'])&&groups.command.includes(input.project)){
      if(!need(3))return fail('Gather 3 civic materials first.');d[input.project]++;message='Civic project advanced. Permanent bonuses increased.';
    }else if(id==='archives'&&action==='reveal'&&requireInput(['tile'])&&int(input.tile,8)){
      if(d.tiles.includes(input.tile))return fail('This tile is already restored.');if(!need(1))return fail('Gather map fragments first.');d.tiles.push(input.tile);d.tiles.sort((a,b)=>a-b);message='Map tile restored.';
    }else if(id==='archives'&&action==='collect'&&requireInput(['claimId'])){
      if(d.tiles.length!==9||input.claimId!==`map:${d.maps+1}`)return fail('This map is not ready to collect.');d.maps++;d.tiles=[];message='Completed map added to the permanent collection.';
    }else if(id==='training'&&['drill','promote'].includes(action)&&requireInput(action==='drill'?['fellowId','track']:['fellowId'])&&recordId(input.fellowId)){
      if(!Object.hasOwn(d.fellows,input.fellowId))d.fellows[input.fellowId]={strength:0,guard:0,focus:0,mastery:0};
      const m=d.fellows[input.fellowId];
      if(action==='drill'){
        if(!groups.training.includes(input.track))return fail('Choose a drill track.');if(!f.bank)return fail('A new drill opportunity arrives every 30 minutes.');m[input.track]++;f.bank--;f.spent++;message='Drill completed. Balance all three tracks to promote this Fellow.';
      }else{if(groups.training.some(t=>m[t]<=m.mastery))return fail('Complete one new drill in every track before promotion.');m.mastery++;message='Fellow promoted: +25 permanent Power.';}
    }else if(['apothecary','market'].includes(id)){
      const field=id==='apothecary'?'recipe':'item',make=id==='apothecary'?'brew':'craft',deliver=id==='apothecary'?'deliver':'fulfill',prefix=id==='apothecary'?'patient':'order';
      if(action===make&&requireInput([field])&&groups[id].includes(input[field])){if(!need(3))return fail('Gather 3 materials first.');d.crafted[input[field]]++;message=id==='apothecary'?'Remedy bottled and added to your shelf.':'Crafted item added to your inventory.';}
      else if(action===deliver&&requireInput(['claimId'])){const item=groups[id][d.delivered%3];if(input.claimId!==`${prefix}:${d.delivered+1}`||d.crafted[item]<=deliveredOf(d.delivered,groups[id].indexOf(item)))return fail('The requested item is not ready, or this delivery was already claimed.');d.delivered++;message='Delivery complete. Permanent workshop reputation increased.';}
      else return fail('Unknown workshop action.');
    }else if(id==='gatehouse'&&action==='dispatch'&&requireInput(['route'])&&groups.gatehouse.includes(input.route)){
      if(d.active)return fail('Claim the current caravan before dispatching another.');if(!need(3))return fail('Gather 3 provisions first.');d.dispatched++;d.active={id:`caravan:${d.dispatched}`,route:input.route,startedAt:now,readyAt:now+duration(input.route)};message='Caravan dispatched. Its return time is saved.';
    }else if(id==='gatehouse'&&action==='claim'&&requireInput(['claimId'])){
      if(!d.active||input.claimId!==d.active.id||now<d.active.readyAt)return fail('This caravan is not ready to claim.');d.routes[d.active.route]++;d.claimed++;d.active=null;message='Cargo collected. Route reputation and permanent bonuses increased.';
    }else if(id==='forge'&&['forge','refine'].includes(action)&&requireInput(['gear'])&&groups.forge.includes(input.gear)){
      const n=d[input.gear];if((action==='forge'&&n!==0)||(action==='refine'&&n===0))return fail('Forge the gear once, then refine it.');if(!need(3*(n+1)))return fail(`Gather ${3*(n+1)} forge ore for this upgrade.`);d[input.gear]++;message='Workshop gear upgraded. Permanent bonuses increased.';
    }else if(id==='waystone'&&action==='restore'&&requireInput(['component'])&&groups.waystone.includes(input.component)){
      const n=d[input.component];if(!need(3*(n+1)))return fail(`Gather ${3*(n+1)} stone shards for this restoration.`);d[input.component]++;message='Waystone component restored. Balanced restoration unlocks milestones.';
    }else return fail('Unknown workshop action.');
    return valid(next)?{ok:true,root:next,message}:fail('The workshop has reached its safe record limit.');
  }
  function bonuses(root,id){
    if(!valid(root))return {power:0,earnings:0};
    const f=root.facilities,maps=f.archives.data.maps,patients=f.apothecary.data.delivered,orders=f.market.data.delivered,stone=sum(f.waystone.data),milestones=Math.min(...Object.values(f.waystone.data));
    const mastery=recordId(id)&&Object.hasOwn(f.training.data.fellows,id)?f.training.data.fellows[id].mastery:0;
    const reward={power:maps*20+patients*3+orders*3+stone*6+milestones*30+mastery*25,earnings:maps*30+patients*12+orders*15+stone*12+milestones*50};
    for(const place of Object.keys(yields))for(const key of groups[place]){const n=(place==='gatehouse'?f[place].data.routes:f[place].data)[key];reward.power+=n*yields[place][key][0];reward.earnings+=n*yields[place][key][1];}
    return reward;
  }
  function status(root,id,now,fellowId){
    const s=settle(root,now);if(!s||!Object.hasOwn(definitions,id))return null;
    const f=s.facilities[id],d=f.data,actions=[],add=(action,label,input={},disabled=false)=>actions.push({action,label,input,disabled});
    if(id!=='training')add('gather',`Gather 3 ${definitions[id].resource.toLowerCase()}`,{},f.bank<1);
    if(id==='command')groups.command.forEach(project=>add('allocate',`Improve ${project} · 3 materials`,{project},stock(id,f)<3));
    if(id==='archives'){for(let tile=0;tile<9;tile++)add('reveal',`Restore tile ${tile+1}`,{tile},d.tiles.includes(tile)||stock(id,f)<1);add('collect','Collect completed map',{claimId:`map:${d.maps+1}`},d.tiles.length!==9);}
    if(id==='training'){groups.training.forEach(track=>add('drill',`Practice ${track}`,recordId(fellowId)?{track,fellowId}:{track},!f.bank));const m=recordId(fellowId)&&Object.hasOwn(d.fellows,fellowId)?d.fellows[fellowId]:null;add('promote','Promote selected Fellow',recordId(fellowId)?{fellowId}:{},!m||groups.training.some(t=>m[t]<=m.mastery));}
    if(id==='apothecary'||id==='market'){
      groups[id].forEach(item=>add(id==='apothecary'?'brew':'craft',`${id==='apothecary'?'Brew':'Craft'} ${item} · 3 materials`,{[id==='apothecary'?'recipe':'item']:item},stock(id,f)<3));
      const item=groups[id][d.delivered%3];add(id==='apothecary'?'deliver':'fulfill',`${id==='apothecary'?'Deliver':'Fulfill'} ${item}`,{claimId:`${id==='apothecary'?'patient':'order'}:${d.delivered+1}`},d.crafted[item]<=deliveredOf(d.delivered,groups[id].indexOf(item)));
    }
    if(id==='gatehouse'){groups.gatehouse.forEach(route=>add('dispatch',`${route} route · ${duration(route)/60000} min`,{route},!!d.active||stock(id,f)<3));if(d.active)add('claim','Claim returned cargo',{claimId:d.active.id},now<d.active.readyAt);}
    if(id==='forge')groups.forge.forEach(gear=>add(d[gear]?'refine':'forge',`${d[gear]?'Refine':'Forge'} ${gear} · ${3*(d[gear]+1)} ore`,{gear},stock(id,f)<3*(d[gear]+1)));
    if(id==='waystone')groups.waystone.forEach(component=>add('restore',`Restore ${component} · ${3*(d[component]+1)} shards`,{component},stock(id,f)<3*(d[component]+1)));
    const details=copy(d);
    if(id==='apothecary'||id==='market'){details.inventory=Object.fromEntries(groups[id].map((k,i)=>[k,d.crafted[k]-deliveredOf(d.delivered,i)]));details.request=groups[id][d.delivered%3];details.claimId=`${id==='apothecary'?'patient':'order'}:${d.delivered+1}`;}
    if(id==='gatehouse')details.remainingMs=d.active?Math.max(0,d.active.readyAt-now):0;
    let progress='',lines=[];
    if(id==='command'){progress=`${sum(d)} civic improvements`;lines=groups.command.map(k=>`${k}: level ${d[k]} · +${yields.command[k][0]} Power and +${yields.command[k][1]} hourly earnings per level`);}
    if(id==='archives'){progress=`${d.tiles.length}/9 tiles restored · ${d.maps} maps collected`;lines=['Each tile costs 1 map fragment. Collect all nine tiles for +20 Power and +30 hourly earnings.'];}
    if(id==='training'){const m=recordId(fellowId)&&Object.hasOwn(d.fellows,fellowId)?d.fellows[fellowId]:null;progress=m?`Selected Fellow mastery ${m.mastery}`:'Choose a Fellow to begin training';lines=groups.training.map(k=>`${k}: ${m?m[k]-m.mastery:0} drills ready`);lines.push('One drill in each track earns one promotion: +25 Power for that Fellow.');}
    if(id==='apothecary'||id==='market'){progress=`${d.delivered} deliveries completed · Request: ${details.request}`;lines=groups[id].map(k=>`${k}: ${details.inventory[k]} in stock`);}
    if(id==='gatehouse'){progress=d.active?`${d.active.route} caravan · ${Math.ceil(details.remainingMs/1000)}s until return`:`${d.claimed} caravans returned`;lines=groups.gatehouse.map(k=>`${k} route reputation: ${d.routes[k]} · +${yields.gatehouse[k][0]} Power and +${yields.gatehouse[k][1]} hourly earnings per cargo`);}
    if(id==='forge'){progress=`${sum(d)} gear levels forged`;lines=groups.forge.map(k=>`${k}: level ${d[k]} · +${yields.forge[k][0]} Power and +${yields.forge[k][1]} hourly earnings per level`);}
    if(id==='waystone'){progress=`Restoration milestone ${Math.min(...Object.values(d))}`;lines=groups.waystone.map(k=>`${k}: restoration ${d[k]}`);lines.push('Restore all three components to advance a milestone for +30 Power and +50 hourly earnings.');}
    return {...definitions[id],tutorial:f.tutorial,bank:f.bank,stock:stock(id,f),progress,details:lines,state:details,actions,nextOpportunityAt:f.bank<24?f.lastAccrued+PERIOD:null,bonuses:bonuses(s,fellowId)};
  }
  function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
  global.EVERSTEAD_PROFESSIONS=Object.freeze({create,valid,settle,act,bonuses,status,definitions:freeze(definitions),latestTime:root=>valid(root)?root.lastTime:null});
})(globalThis);

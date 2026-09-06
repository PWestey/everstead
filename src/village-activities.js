/* Public Village activities. Pure, versioned state; the caller owns atomic saving,
 * Gold application, actor ownership checks, and presentation. No timers or storage. */
(function(global){
  'use strict';
  const PERIOD=30*60*1000, OFFLINE=24*60*60*1000, LIMIT=1000000;
  const trainingGain=50, migrationId='public-village-activities-v1';
  const trainingCost=level=>Number.isSafeInteger(level)&&level>=0&&level<=100000?10+2*level:null;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
  const integer=(value,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(value)&&value>=0&&value<=max;
  const exact=(value,keys)=>plain(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  const step=(prompt,choices,answer)=>({prompt,options:choices.map(([id,label])=>({id,label})),answer});
  const scenario=(title,steps)=>({title,steps});
  const definitions={};
  function facility(id,name,activity,tutorial,scenarios){definitions[id]={id,name,activity,tutorial,gold:40+Object.keys(definitions).length*5,training:3,scenarios};}
  facility('command','Command Center','Village petitions','Read the petition, prioritize its need, then choose a practical response.',[
    scenario('The broken well',[step('The well is dry; three streets need drinking water. What comes first?',[['water','Safe drinking water'],['festival','Festival decorations'],['roads','New road signs']],'water'),step('The spring is clean, but the old pipe leaks. Choose a response.',[['pipe','Repair the pipe and deliver water meanwhile'],['wait','Wait for rain'],['parade','Hold a parade']],'pipe')]),
    scenario('A winter shelter',[step('Travelers arrive before a cold night. What is urgent?',[['shelter','Warm shelter'],['trade','Trade permits'],['paint','Paint the square']],'shelter'),step('The empty hall has a sound roof. How do you help?',[['beds','Set up beds and a supervised hearth'],['outside','Offer an outdoor meeting'],['forms','Ask them to return tomorrow']],'beds')]),
    scenario('Bridge at risk',[step('A bridge railing broke along the school route. Prioritize:',[['safety','Safe passage'],['tolls','Higher tolls'],['flowers','New flowers']],'safety'),step('Choose the immediate work order.',[['detour','Mark a safe detour and repair the railing'],['race','Organize a bridge race'],['ignore','Keep the route unchanged']],'detour')])
  ]);
  facility('archives','Archives','Ordered discoveries','Read the clues and reconstruct the discovery in the correct order.',[
    scenario('The river map',[step('The journal begins where the river rises. Which landmark is first?',[['spring','Mountain spring'],['mill','Watermill'],['harbor','Harbor']],'spring'),step('The river passes the mill before reaching the sea. Next landmark?',[['mill','Watermill'],['harbor','Harbor'],['spring','Mountain spring']],'mill'),step('Complete the route.',[['harbor','Harbor'],['spring','Mountain spring']],'harbor')]),
    scenario('Restoring a manuscript',[step('The ink is fragile. Begin with:',[['dry','Dry the pages gently'],['rub','Rub the ink'],['wash','Wash the text']],'dry'),step('The pages are safe. Preserve their knowledge by:',[['copy','Copy the surviving text'],['fold','Fold the brittle pages']],'copy'),step('Finish the archive record.',[['catalog','Catalog the restored manuscript'],['scatter','Separate the pages']],'catalog')]),
    scenario('The tower signal',[step('The inscription reads dawn, noon, dusk. First seal?',[['dawn','Dawn seal'],['dusk','Dusk seal'],['noon','Noon seal']],'dawn'),step('Second seal?',[['noon','Noon seal'],['dawn','Dawn seal'],['dusk','Dusk seal']],'noon'),step('Last seal?',[['dusk','Dusk seal'],['noon','Noon seal']],'dusk')])
  ]);
  facility('training','Training Grounds','Formation drills','Respond to the drill, then coordinate the formation. This is practice, not a change to Campaign squad rules.',[
    scenario('Shield and advance',[step('Arrows approach the line. First command?',[['guard','Raise shields'],['charge','Break ranks and charge']],'guard'),step('The volley ends. Advance together by:',[['march','Taking a measured formation step'],['scatter','Scattering into the field']],'march'),step('A bell ends the drill.',[['regroup','Regroup and check partners'],['pursue','Continue alone']],'regroup')]),
    scenario('Rescue formation',[step('A practice casualty lies behind cover.',[['cover','Establish cover'],['rush','Rush in alone']],'cover'),step('The route is covered.',[['pair','Send a paired rescue team'],['leave','Leave the teammate']],'pair'),step('Complete the rescue.',[['withdraw','Withdraw together'],['split','Split the formation']],'withdraw')]),
    scenario('Watch rotation',[step('Your patrol has walked all day.',[['rest','Assign a rested first watch'],['all','Keep everyone awake']],'rest'),step('Before the watch changes:',[['brief','Brief the incoming watch'],['silent','Leave without a handoff']],'brief'),step('An unfamiliar sound approaches.',[['signal','Signal the formation before investigating'],['solo','Chase it alone']],'signal')])
  ]);
  facility('hearth','Hearth','Supportive gatherings','Listen to your guests and choose the support they ask for.',[
    scenario('A quiet seat',[step('A guest says, “I need a little quiet after the journey.”',[['quiet','Offer a quiet corner'],['speech','Ask for a public speech']],'quiet'),step('They would like company, but not questions.',[['company','Share tea and comfortable silence'],['interrogate','Ask about every hardship']],'company')]),
    scenario('A first celebration',[step('A new resident wants to meet neighbors.',[['introduce','Make a few warm introductions'],['alone','Leave them on their own']],'introduce'),step('They offer to help with dinner.',[['invite','Invite them to prepare a shared dish'],['exclude','Tell them newcomers cannot help']],'invite')]),
    scenario('A difficult day',[step('A friend says their work went badly.',[['listen','Listen before offering advice'],['dismiss','Say it cannot have been that bad']],'listen'),step('They ask for help trying again tomorrow.',[['plan','Make a small plan together'],['takeover','Take over without asking']],'plan')])
  ]);
  facility('restaurant','Restaurant','Customer recipes','Match a customer to a recipe and prepare it correctly. Ingredients here belong to the activity, not your inventory.',[
    scenario('The chilly traveler',[step('A traveler requests something hot, filling, and without meat.',[['stew','Root vegetable stew'],['salad','Cold herb salad'],['roast','Roast meat']],'stew'),step('The vegetables are chopped. Finish the recipe.',[['simmer','Simmer until tender'],['freeze','Serve frozen'],['raw','Skip cooking']],'simmer'),step('The stew is ready.',[['serve','Serve the hot bowl with bread'],['salt','Add a whole jar of salt']],'serve')]),
    scenario('A garden lunch',[step('A guest wants a crisp, light lunch.',[['salad','Garden salad'],['stew','Heavy stew'],['cake','Celebration cake']],'salad'),step('Prepare the fresh leaves.',[['rinse','Rinse and dry the leaves'],['boil','Boil them until soft']],'rinse'),step('Finish at the table.',[['dress','Add a light herb dressing'],['burn','Char the leaves']],'dress')]),
    scenario('The baker’s breakfast',[step('A worker requests a warm oat breakfast with fruit.',[['porridge','Apple porridge'],['fish','Salted fish'],['salad','Leaf salad']],'porridge'),step('Cook the oats.',[['stir','Simmer and stir'],['dry','Serve dry oats']],'stir'),step('Complete the order.',[['apple','Top with sliced apple'],['pepper','Top with a handful of pepper']],'apple')])
  ]);
  facility('apothecary','Apothecary','Fantasy remedy cases','Match fictional requests to labeled remedies, then follow the brewing note. These are fantasy recipes, not medical advice.',[
    scenario('The squeaking boot',[step('An enchanted boot squeaks at every step. Its tag asks for quieting oil.',[['oil','Quieting oil'],['glow','Glow tonic'],['ink','Memory ink']],'oil'),step('The recipe says stir gently and bottle cool.',[['cool','Stir gently, cool, and bottle'],['boil','Boil until the bottle glows']],'cool')]),
    scenario('A dim lantern',[step('A crystal lantern needs glow tonic to shine again.',[['glow','Glow tonic'],['oil','Quieting oil'],['ink','Memory ink']],'glow'),step('The recipe says dissolve sun-petal dust in clear water.',[['dissolve','Dissolve the sun-petal dust'],['sand','Pack the bottle with sand']],'dissolve')]),
    scenario('The fading spellbook',[step('A harmless practice spellbook needs memory ink.',[['ink','Memory ink'],['glow','Glow tonic'],['oil','Quieting oil']],'ink'),step('The note says strain the ink before filling the pen.',[['strain','Strain and fill the pen'],['chunks','Leave the coarse fragments in']],'strain')])
  ]);
  facility('school','Schoolhouse','Lessons and graduation','Guide a pupil through three related lessons to complete a learning session.',[
    scenario('The young mapmaker',[step('Lesson one: the sun rises in the…',[['east','East'],['west','West']],'east'),step('Lesson two: a map key explains…',[['symbols','The map’s symbols'],['weather','Tomorrow’s weather']],'symbols'),step('Graduation exercise: mark a safe route by…',[['bridge','Using the marked bridge'],['cliff','Crossing the cliff edge']],'bridge')]),
    scenario('The market apprentice',[step('Lesson one: two apples plus three apples make…',[['five','Five apples'],['six','Six apples']],'five'),step('Lesson two: check an order by…',[['count','Counting the goods'],['guess','Guessing the weight']],'count'),step('Graduation exercise: a customer paid too much.',[['return','Return the extra coins'],['keep','Keep the mistake']],'return')]),
    scenario('The garden pupil',[step('Lesson one: roots take up…',[['water','Water'],['music','Music']],'water'),step('Lesson two: seedlings need…',[['light','Appropriate light and water'],['dark','Permanent darkness']],'light'),step('Graduation exercise: a dry seed bed needs…',[['gentle','Gentle watering'],['flood','A rushing flood']],'gentle')])
  ]);
  facility('market','Market / Workshop','Order fulfillment','Count the requested goods and choose suitable packing.',[
    scenario('The orchard order',[step('An order requests 2 red and 3 green apples. Pack how many?',[['5','5 apples'],['4','4 apples'],['6','6 apples']],'5'),step('Keep the fruit safe in:',[['crate','A padded produce crate'],['loose','A loose pile on the cart']],'crate')]),
    scenario('A carpenter’s delivery',[step('Three stools need four legs each. Count the legs.',[['12','12 legs'],['7','7 legs'],['9','9 legs']],'12'),step('Before delivery:',[['check','Check and secure each joint'],['wet','Soak the finished stools']],'check')]),
    scenario('The cloth commission',[step('Four banners need two lengths of cloth each. How many lengths?',[['8','8 lengths'],['6','6 lengths'],['10','10 lengths']],'8'),step('Pack the banners for rain.',[['wrap','Use a waterproof wrap'],['open','Leave the cart uncovered']],'wrap')])
  ]);
  facility('gatehouse','Gatehouse','Caravan arrivals','Read an arrival report, prioritize the caravan’s need, then route it safely.',[
    scenario('An exhausted caravan',[step('The caravan has supplies but its horses are exhausted.',[['rest','Prioritize water and rest'],['speed','Send it straight onward']],'rest'),step('Where should it stop?',[['yard','The sheltered caravan yard'],['bridge','Across the narrow bridge']],'yard')]),
    scenario('A fragile cargo',[step('Glass lamps are arriving on a damaged cart.',[['unload','Arrange careful unloading'],['race','Ask the driver to race']],'unload'),step('Choose the unloading route.',[['smooth','The level service lane'],['stairs','The steep stairway']],'smooth')]),
    scenario('Road closed',[step('A fallen tree blocks the east road.',[['detour','Prioritize a marked detour'],['push','Send wagons into the blockage']],'detour'),step('Before the caravan leaves:',[['brief','Give the driver the updated route'],['old','Hand out the old map']],'brief')])
  ]);
  facility('gardens','Gardens','Plant, water, harvest','Choose a suitable bed, tend the crop, then harvest at its described stage.',[
    scenario('Kitchen basil',[step('Basil needs a sunny, well-drained bed.',[['sun','Plant in the sunny bed'],['bog','Plant in the flooded ditch']],'sun'),step('The surface soil is dry.',[['water','Water the soil gently'],['pull','Pull out the plant']],'water'),step('Fresh leaves are ready.',[['leaves','Pick mature leaves, leaving new growth'],['roots','Remove every root']],'leaves')]),
    scenario('Golden carrots',[step('Carrots need loose soil.',[['loosen','Loosen the vegetable bed'],['stone','Pack stones around the seeds']],'loosen'),step('Tiny seedlings emerge.',[['thin','Thin crowded seedlings and water'],['shade','Bury them under a plank']],'thin'),step('Their shoulders are full and golden.',[['lift','Lift the mature roots carefully'],['flower','Wait for a fruit tree to grow']],'lift')]),
    scenario('Moonpetal flowers',[step('Moonpetals prefer the shaded fantasy garden.',[['shade','Plant under the arbor'],['furnace','Plant beside the furnace']],'shade'),step('The bed is drying out.',[['mist','Mist the soil gently'],['salt','Add salt to the roots']],'mist'),step('The flowers glow at dusk.',[['petal','Gather the glowing petals'],['unripe','Gather only closed buds']],'petal')])
  ]);
  facility('forge','Forge','Equipment commissions','Follow the commissioned material’s work sequence. No equipment is consumed.',[
    scenario('A training blade',[step('The steel billet is cold.',[['heat','Heat the billet'],['quench','Quench immediately']],'heat'),step('The steel is ready to work.',[['shape','Hammer the blade into shape'],['paint','Paint the unshaped billet']],'shape'),step('The blade is shaped.',[['temper','Harden and temper it'],['discard','Throw away the commission']],'temper')]),
    scenario('A shield fitting',[step('The fitting must match a drawn template.',[['measure','Measure against the template'],['guess','Guess its dimensions']],'measure'),step('The dimensions are marked.',[['form','Form the fitting to the marks'],['erase','Erase all the marks']],'form'),step('Finish the commission.',[['fit','Check fit and smooth the edges'],['sharp','Leave burrs on the grip']],'fit')]),
    scenario('A Relic cradle',[step('The fragile Relic needs a protective cradle.',[['plan','Measure the padded clearance'],['strike','Hammer directly on the Relic']],'plan'),step('The frame is formed.',[['line','Line the cradle with soft material'],['spikes','Fill it with spikes']],'line'),step('Inspect before delivery.',[['secure','Check the cradle holds it securely'],['shake','Shake the Relic loose']],'secure')])
  ]);
  facility('fishing','Fishing Pier','Read the water','Choose a fishing spot from visible clues, then respond to the described float. There is no timed input.',[
    scenario('Still morning water',[step('Small ripples gather beside the reeds.',[['reeds','Cast beside the reeds'],['path','Cast onto the dry path']],'reeds'),step('The float rests still. What now?',[['wait','Wait for a clear bite'],['jerk','Jerk the line immediately']],'wait'),step('The float dips firmly below the surface.',[['reel','Lift smoothly and reel in'],['leave','Drop the rod']],'reel')]),
    scenario('The shaded pool',[step('On this warm day, fish gather in the cool shade.',[['shade','Cast into the shaded pool'],['rock','Cast onto the warm rock']],'shade'),step('The float trembles lightly but does not dip.',[['wait','Wait for a firm pull'],['haul','Haul before a bite']],'wait'),step('A firm pull bends the line.',[['steady','Keep steady tension while reeling'],['slack','Let the line go completely slack']],'steady')]),
    scenario('After the rain',[step('The main current is muddy; a side pool is clear.',[['pool','Try the clear side pool'],['mud','Aim at the muddy bank']],'pool'),step('Your line snags floating weed.',[['clear','Clear the weed and recast'],['yank','Yank against the snag']],'clear'),step('The recast float dips steadily.',[['land','Reel steadily and land the catch'],['cut','Cut the line']],'land')])
  ]);
  facility('waystone','Waystone','Covenant reflections','Interpret a short inscription and choose a Village action that carries its meaning.',[
    scenario('A shared light',[step('“A lantern is brightest when its light is shared.” The inscription asks for…',[['share','Shared knowledge'],['hide','Hidden knowledge']],'share'),step('Carry the lesson into the Village.',[['teach','Teach a neighbor a useful skill'],['lock','Lock away the lesson']],'teach')]),
    scenario('Roots and roads',[step('“Remember your roots; welcome new roads.” It values…',[['both','Memory and discovery together'],['forget','Forgetting everything old']],'both'),step('Choose a fitting act.',[['record','Record a traveler’s story in the Archives'],['refuse','Refuse every visitor']],'record')]),
    scenario('The patient stone',[step('“Many small hands raise a lasting home.” Its lesson is…',[['together','Steady shared effort'],['alone','Only one person matters']],'together'),step('Put the lesson into practice.',[['help','Join a neighbor’s repair project'],['watch','Demand that others do everything']],'help')])
  ]);
  const ids=Object.keys(definitions);
  function create(now){
    if(!integer(now))throw new TypeError('A valid activity timestamp is required.');
    return {version:1,migrationId,activatedAt:now,facilities:Object.fromEntries(ids.map(id=>[id,{bank:3,lastAccrued:now,cursor:0,active:null,pending:null,completed:0,claimed:0,tutorial:false}])),training:0,totalTrainingEarned:0,trainingSpent:0,mastery:{},totalGoldAwarded:0,claimSequence:0,lastClaim:null};
  }
  function validate(root){
    try{
      if(!exact(root,['version','migrationId','activatedAt','facilities','training','totalTrainingEarned','trainingSpent','mastery','totalGoldAwarded','claimSequence','lastClaim'])||root.version!==1||root.migrationId!==migrationId||!integer(root.activatedAt)||!exact(root.facilities,ids))return false;
      let gold=0,earned=0,claims=0;
      for(const id of ids){
        const f=root.facilities[id],d=definitions[id];
        if(!exact(f,['bank','lastAccrued','cursor','active','pending','completed','claimed','tutorial'])||!integer(f.bank,12)||!integer(f.lastAccrued)||f.lastAccrued<root.activatedAt||!integer(f.completed,LIMIT)||!integer(f.claimed,LIMIT)||f.cursor!==f.completed||typeof f.tutorial!=='boolean'||f.completed-f.claimed!==(f.pending?1:0))return false;
        if(f.active!==null&&(!exact(f.active,['scenario','step'])||f.pending!==null||f.bank<1||f.active.scenario!==f.cursor%d.scenarios.length||!integer(f.active.step,d.scenarios[f.active.scenario].steps.length-1)))return false;
        if(f.pending!==null&&(!exact(f.pending,['id','gold','training'])||f.pending.id!==`${id}:${f.completed}`||f.pending.gold!==d.gold||f.pending.training!==d.training))return false;
        gold+=f.claimed*d.gold;earned+=f.claimed*d.training;claims+=f.claimed;
      }
      if(!plain(root.mastery)||Object.keys(root.mastery).length>200)return false;
      let spent=0;
      for(const [id,m] of Object.entries(root.mastery)){
        if(!/^[A-Za-z0-9_-]{1,64}$/.test(id)||['__proto__','constructor','prototype'].includes(id)||!exact(m,['level','spent','power'])||!integer(m.level,100000)||m.level<1||m.spent!==m.level*m.level+9*m.level||m.power!==m.level*trainingGain)return false;
        spent+=m.spent;
      }
      if(!integer(root.training)||!integer(root.trainingSpent)||root.trainingSpent!==spent||root.totalTrainingEarned!==earned||root.training+spent!==earned||root.totalGoldAwarded!==gold||root.claimSequence!==claims)return false;
      if(!claims)return root.lastClaim===null;
      const receipt=root.lastClaim;
      if(!exact(receipt,['sequence','id','facility','gold','training'])||receipt.sequence!==claims||!Object.hasOwn(definitions,receipt.facility))return false;
      const f=root.facilities[receipt.facility],d=definitions[receipt.facility];
      return f.claimed>0&&receipt.id===`${receipt.facility}:${f.claimed}`&&receipt.gold===d.gold&&receipt.training===d.training;
    }catch{return false;}
  }
  const fail=(root,reason)=>({ok:false,root:validate(root)?clone(root):null,reason});
  function settle(root,now){
    if(!validate(root)||!integer(now))return fail(root,'Invalid Village activity state or time.');
    const next=clone(root);
    for(const f of Object.values(next.facilities)){
      if(now<=f.lastAccrued)continue;
      const elapsed=Math.min(OFFLINE,now-f.lastAccrued),count=Math.floor(elapsed/PERIOD);
      f.bank=Math.min(12,f.bank+count);
      f.lastAccrued=f.bank===12?now:now-elapsed%PERIOD;
    }
    return {ok:true,root:next};
  }
  function act(root,id,action,payload={},now){
    if(!validate(root)||!integer(now)||!Object.hasOwn(definitions,id)||!plain(payload))return fail(root,'Invalid Village activity request.');
    const settled=settle(root,now),next=settled.root,f=next.facilities[id],d=definitions[id];
    if(action==='tutorial')f.tutorial=true;
    else if(action==='start'){
      if(f.pending)return fail(root,'Claim this activity’s completed reward first.');
      if(f.active)return fail(root,'This activity is already in progress.');
      if(f.bank<1)return fail(root,'More opportunities will arrive in 30 minutes.');
      if(f.completed>=LIMIT)return fail(root,'This activity has reached the safe record limit.');
      f.active={scenario:f.cursor%d.scenarios.length,step:0};
    }else if(action==='choose'){
      if(!f.active)return fail(root,'Start an activity first.');
      const s=d.scenarios[f.active.scenario];
      if(payload.choice!==s.steps[f.active.step].answer)return fail(root,'Look at the request again and try another approach.');
      f.active.step++;
      if(f.active.step===s.steps.length){f.active=null;f.bank--;f.completed++;f.cursor=f.completed;f.pending={id:`${id}:${f.completed}`,gold:d.gold,training:d.training};}
    }else if(action==='claim'){
      if(!f.pending||payload.claimId!==f.pending.id)return fail(root,'This reward is no longer available.');
      const reward=clone(f.pending);f.pending=null;f.claimed++;
      next.training+=reward.training;next.totalTrainingEarned+=reward.training;next.totalGoldAwarded+=reward.gold;next.claimSequence++;
      next.lastClaim={sequence:next.claimSequence,id:reward.id,facility:id,gold:reward.gold,training:reward.training};
      if(!validate(next))return fail(root,'The reward could not be verified.');
      return {ok:true,root:next,reward:{gold:reward.gold,training:reward.training,claimId:reward.id}};
    }else return fail(root,'Unknown Village activity action.');
    return validate(next)?{ok:true,root:next}:fail(root,'The activity could not be verified.');
  }
  function train(root,fellowId,now){
    if(!validate(root)||!integer(now)||typeof fellowId!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(fellowId)||['__proto__','constructor','prototype'].includes(fellowId))return fail(root,'Invalid training request.');
    const next=settle(root,now).root,m=next.mastery[fellowId]||{level:0,spent:0,power:0};
    if(m.level>=100000||(!Object.hasOwn(next.mastery,fellowId)&&Object.keys(next.mastery).length>=200))return fail(root,'The safe training record limit has been reached.');
    const cost=trainingCost(m.level);
    if(next.training<cost)return fail(root,`Training requires ${cost} Village Training points.`);
    next.training-=cost;next.trainingSpent+=cost;next.mastery[fellowId]={level:m.level+1,spent:m.spent+cost,power:m.power+trainingGain};
    return validate(next)?{ok:true,root:next,reward:{power:trainingGain,trainingSpent:cost}}:fail(root,'Training could not be verified.');
  }
  function power(root,fellowId){return validate(root)&&Object.hasOwn(root.mastery,fellowId)?root.mastery[fellowId].power:0;}
  function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  global.EVERSTEAD_VILLAGE_ACTIVITIES=Object.freeze({definitions:freeze(definitions),create,validate,settle,act,train,power,trainingGain,trainingCost});
})(globalThis);

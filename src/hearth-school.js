/* Hearth & School v1. Pure, versioned progression; the host commits rewards atomically. */
(function(g){'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x)),safe=x=>Number.isSafeInteger(x)&&x>=0;
 const plain=x=>x&&typeof x==='object'&&!Array.isArray(x)&&[null,Object.prototype].includes(Object.getPrototypeOf(x));
 const exact=(x,keys)=>plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
 const jobs=['Baker','Herbalist','Smith'],names=['Rowan','Wren','Juniper','Ash','Willow','Finch','Hazel','Robin'];
 const sum=a=>a.reduce((n,v)=>n+v,0),cost=l=>3*(l+1),spent=l=>3*l*(l+1)/2;
 function create(now){return{version:1,activatedAt:now,visitClock:now,lessonClock:now,visits:2,lessons:4,family:{},enrolled:0,pupils:[],graduates:0,jobs:[0,0,0],lessonsByGrade:[0,0,0,0,0,0],graduatesByGrade:[0,0,0,0,0,0],recent:[],tutorials:{hearth:false,school:false},sequence:0,last:null};}
 function valid(r){try{
  if(!exact(r,['version','activatedAt','visitClock','lessonClock','visits','lessons','family','enrolled','pupils','graduates','jobs','lessonsByGrade','graduatesByGrade','recent','tutorials','sequence','last'])||r.version!==1||![r.activatedAt,r.visitClock,r.lessonClock,r.visits,r.lessons,r.enrolled,r.graduates,r.sequence].every(safe)||r.visitClock<r.activatedAt||r.lessonClock<r.activatedAt||r.visits>12||r.lessons>24||r.enrolled>1000000||!plain(r.family)||Object.keys(r.family).length>200)return false;
  for(const [id,f]of Object.entries(r.family))if(!/^[a-z][a-z0-9_-]{0,63}$/.test(id)||!exact(f,['visits','level','points'])||![f.visits,f.level,f.points].every(safe)||f.level>10000||f.points!==f.visits*3-spent(f.level))return false;
  if(!exact(r.tutorials,['hearth','school'])||Object.values(r.tutorials).some(v=>typeof v!=='boolean')||!Array.isArray(r.pupils)||r.pupils.length>3||!Array.isArray(r.recent)||r.recent.length>12)return false;
  for(const [key,length]of [['jobs',3],['lessonsByGrade',6],['graduatesByGrade',6]])if(!Array.isArray(r[key])||r[key].length!==length||!r[key].every(safe))return false;
  const ids=new Set();for(const p of [...r.pupils,...r.recent]){if(!exact(p,['id','mentor','job','grade','lessons'])||!safe(p.id)||p.id<1||p.id>r.enrolled||ids.has(p.id)||!Object.hasOwn(r.family,p.mentor)||!safe(p.job)||p.job>2||!safe(p.grade)||p.grade>5||!safe(p.lessons)||p.lessons>4)return false;ids.add(p.id);}
  if(r.recent.some(p=>p.lessons!==4)||r.enrolled!==r.graduates+r.pupils.length||sum(r.jobs)!==r.graduates||sum(r.graduatesByGrade)!==r.graduates||r.recent.length!==Math.min(12,r.graduates))return false;
  for(let grade=0;grade<6;grade++)if(r.lessonsByGrade[grade]!==r.graduatesByGrade[grade]*4+sum(r.pupils.filter(p=>p.grade===grade).map(p=>p.lessons)))return false;
  const minimum=Object.values(r.family).reduce((n,f)=>n+f.visits+f.level,0)+r.enrolled+sum(r.lessonsByGrade)+r.graduates+Number(r.tutorials.hearth)+Number(r.tutorials.school);
  if(r.sequence<minimum)return false;
  if(r.last===null)return r.sequence===0;
  if(r.last.action==='lesson'?![60,80,100,120,140,160].includes(r.last.rawExp):r.last.rawExp!==0)return false;
  return exact(r.last,['sequence','action','id','job','at','rawExp'])&&r.last.sequence===r.sequence&&safe(r.last.at)&&r.last.at>=r.activatedAt&&safe(r.last.rawExp)&&['guide-hearth','guide-school','gather','bless','enroll','lesson','graduate'].includes(r.last.action)&&typeof r.last.id==='string'&&safe(r.last.job)&&r.last.job<=2;
 }catch{return false}}
 function settle(root,now){if(!valid(root)||!safe(now))return null;const r=copy(root);for(const [clock,bank,period,cap]of [['visitClock','visits',3600000,12],['lessonClock','lessons',1800000,24]]){if(now<=r[clock])continue;const elapsed=Math.min(86400000,now-r[clock]);r[bank]=Math.min(cap,r[bank]+Math.floor(elapsed/period));r[clock]=r[bank]===cap?now:now-elapsed%period;}return r;}
 const earnings=r=>valid(r)?r.graduatesByGrade.reduce((n,v,i)=>n+v*(240+60*i),0):0;
 const rawExp=r=>valid(r)?r.lessonsByGrade.reduce((n,v,i)=>n+v*(60+20*i),0):0;
 const seats=r=>r.graduates>=3?3:r.graduates>=1?2:1;
 const pupilName=p=>names[(p.id-1)%names.length]+' '+p.id;
 function act(root,action,id,job,now,context){const r=settle(root,now),fail=reason=>({ok:false,reason});if(!r)return fail('School records could not be verified.');id=String(id??'');job=job??0;if(!safe(job)||job>2)return fail('Choose a profession.');let xp=0;
  if(action==='guide-hearth'||action==='guide-school')r.tutorials[action.slice(6)]=true;
  else if(['gather','bless','enroll'].includes(action)){
   const mentor=context.family.find(f=>f.id===id);if(!mentor)return fail('Choose an available Family mentor.');
   const f=r.family[id]||(r.family[id]={visits:0,level:0,points:0});
   if(action==='gather'){if(!r.visits)return fail('Your next gathering arrives within an hour.');r.visits--;f.visits++;f.points+=3;}
   if(action==='bless'){if(f.level>=10000||f.points<cost(f.level))return fail('Gather more support before improving this Blessing.');f.points-=cost(f.level);f.level++;}
   if(action==='enroll'){if(r.pupils.length>=seats(r)||r.enrolled>=1000000)return fail('Graduate a pupil to free a seat.');const grade=Math.min(5,Math.floor(mentor.intimacy/100)+f.level);r.enrolled++;r.pupils.push({id:r.enrolled,mentor:id,job,grade,lessons:0});}
  }else if(action==='lesson'||action==='graduate'){
   const p=r.pupils.find(p=>String(p.id)===id);if(!p)return fail('This pupil has already graduated or is unavailable.');
   if(action==='lesson'){if(p.lessons>=4)return fail('This pupil is ready to graduate.');if(!r.lessons)return fail('A lesson opportunity arrives every 30 minutes.');r.lessons--;p.lessons++;r.lessonsByGrade[p.grade]++;xp=60+20*p.grade;}
   else{if(p.lessons!==4)return fail('Complete four lessons first.');r.pupils=r.pupils.filter(q=>q.id!==p.id);r.graduates++;r.jobs[p.job]++;r.graduatesByGrade[p.grade]++;r.recent=[p,...r.recent].slice(0,12);}
  }else return fail('Unknown School action.');
  r.sequence++;r.last={sequence:r.sequence,action,id,job,at:now,rawExp:xp};return valid(r)?{ok:true,root:r,rawExp:xp}:fail('The progression record was refused.');
 }
 g.EVERSTEAD_HEARTH_SCHOOL=Object.freeze({create,valid,settle,act,earnings,rawExp,seats,cost,pupilName,jobs:Object.freeze(jobs)});
})(globalThis);

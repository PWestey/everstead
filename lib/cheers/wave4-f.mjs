// Cheers (task-completion pop-ups), fourth wave part F: Anna, Elsa and Helen. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Marriage ----------------
 anna:{
  cheers:[
   {open:['* Anna bounces on her toes.','You asked about her day and then actually listened! Like, nodding, follow-up questions, the whole thing!'],opts:[
    {t:'Every day.',r:['Yes! That’s it! Kristoff took years to learn that. You’re way ahead.']},
    {t:'She talked for forty minutes.',r:['And you stayed for all forty? Okay, that’s basically a knight thing.']}]},
   {open:['Date night’s on the calendar. In ink. Not “sometime soon.” A real day!'],opts:[
    {t:'Count me in.',r:['Bring flowers. Or chocolate. Or both. Both is always right.']},
    {t:'Now I have to plan it.',r:['Oh, I can help! I have a list. It’s long. Some of it involves a sleigh.']}]},
   {open:['You did the little thing she always does, so she didn’t have to. Without being asked!','* She presses both hands to her heart.'],opts:[
    {t:'Tomorrow too.',r:['That’s how it’s done. Little things, every day. It’s so romantic it hurts.']},
    {t:'It was just the dishes.',r:['“Just the dishes.” Kristoff did the dishes once and I nearly proposed again.']}]},
   {open:['You kissed her goodbye this morning. A real one, not a peck on the way out the door.'],opts:[
    {t:'Every morning.',r:['* She sighs dreamily.','Every morning. Okay. I’m going to go find my husband now.']},
    {t:'The kids said “ew.”',r:['Perfect. Kids saying “ew” means you’re doing it right.']}]}],
  codex:'Ooh, you wrote this one about her! Read it again. Slowly. It’s good.',
  ack:'Yes! I knew it. You’re a keeper, you know that?',
  done:{open:['Everything? You did everything today? Okay, go home. Go find her. Right now. Why are you still here?'],opts:[
   {t:'Same again tomorrow.',r:['Good. And tell her a queen said she’s a lucky woman.']},
   {t:'Maybe I’ll stay for cocoa.',r:['* She laughs and pushes you toward the door.','One cup. Then home. I mean it!']}]}},

 // ---------------- Discipline ----------------
 elsa:{
  cheers:[
   {open:['Up on time. No snooze. I noticed.'],opts:[
    {t:'Tomorrow too.',r:['Good. Same time. I’ll be practicing.']},
    {t:'I hit it once in my head.',r:['In your head doesn’t count. Hands count.']}]},
   {open:['* A thin line of frost traces your initials on the table.','Phone in the drawer all evening. That’s harder than it sounds. I know.'],opts:[
    {t:'I’ll keep it there.',r:['Then I’ll keep the drawer cold. Nobody likes reaching into a cold drawer.']},
    {t:'I checked it once.',r:['Once is better than forty times. Tomorrow, zero.']}]},
   {open:['You did the boring thing before the fun thing. That’s practically all of it, honestly.'],opts:[
    {t:'Count me in.',r:['Good. Boring first, every day. It stops feeling boring eventually.']},
    {t:'It was very boring.',r:['I know. I once spent a whole summer learning to stop a single drip. Worth it.']}]},
   {open:['Bed on time. You said you would and then you did. People underestimate that.','* A faint, approving smile.'],opts:[
    {t:'Same time tomorrow.',r:['Then sleep well. I’ll keep it cool in there for you.']},
    {t:'I wanted one more episode.',r:['Everybody does. Tomorrow you can want it again and still say no.']}]}],
  codex:'You wrote this when your head was clear. Read it. It’s still true.',
  ack:'Good. Then that’s settled.',
  done:{open:['* The air goes still and quiet, snow hanging motionless around her.','Every one, done. Steady. I like seeing that.'],opts:[
   {t:'Same again tomorrow.',r:['I know you will. That’s what I like about you.']},
   {t:'Sit with me a minute?',r:['* She sits, close, and the snow starts falling again, soft.','A minute. Maybe two.']}]}},

 // ---------------- Fatherhood ----------------
 helen:{
  cheers:[
   {open:['You put the phone down and played with them. On the floor. Like a pro.'],opts:[
    {t:'Tomorrow too.',r:['That’s the job. Floor time. Capes optional.']},
    {t:'My knees hurt.',r:['Welcome to parenting. Stretch first. Trust me, I know a thing about stretching.']}]},
   {open:['* Helen gives a slow clap from across the Inn.','Bedtime done. Teeth brushed, story read, nobody escaped. Impressive.'],opts:[
    {t:'Every night.',r:['Good. Consistency wins. It beats any superpower I’ve got.']},
    {t:'One of them escaped twice.',r:['Only twice? Dash once made it three blocks. You’re doing great.']}]},
   {open:['You stayed calm when they melted down. Didn’t yell. That’s real heroics.'],opts:[
    {t:'I’ll keep at it.',r:['I know you will. And when you lose it someday, say sorry. That counts too.']},
    {t:'I yelled in my head.',r:['Head yelling is allowed. Everybody does it. Out loud is what they remember.']}]},
   {open:['You asked your kid how their day was and got more than “fine.” Do you know how hard that is?'],opts:[
    {t:'Count me in.',r:['Same question tomorrow. Keep it up and they’ll still talk to you at sixteen.']},
    {t:'It was mostly about lunch.',r:['Lunch is a start. Lunch leads to feelings. Feelings lead to secrets. Stay with it.']}]}],
  codex:'Here. You wrote this about your kids. Read it before you forget why you do all this.',
  ack:'That’s what I like to hear. Go get ’em, Dad.',
  done:{open:['Everything done? Kids fed, kids loved, house still standing? Okay. Sit down before you fall down.'],opts:[
   {t:'Same again tomorrow.',r:['I know. Get some sleep first. Even heroes need it.']},
   {t:'Only if you sit too.',r:['* She drops onto the couch next to you, shoulder to shoulder.','Deal. Five minutes. Then I’m checking on the baby.']}]}},
};

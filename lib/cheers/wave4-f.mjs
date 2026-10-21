// Cheers (task-completion pop-ups), fourth wave part F: Anna, Elsa and Helen. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Marriage ----------------
 anna:{
  cheers:[
   {open:['* Anna bounces on her toes.','You asked about her day and then actually listened! Like, nodding, follow-up questions, the whole thing! Now I’d like you looking at me like that. I’ve been waiting.'],opts:[
    {t:'Every day.',r:['Yes! That’s it! Kristoff took years to learn that. You’re way ahead.']},
    {t:'She talked for forty minutes.',r:['And you stayed for all forty? Okay, that’s basically a knight thing.']}]},
   {open:['Date night’s on the calendar. In ink. Not “sometime soon.” A real day! I left tomorrow evening free. That’s me being very obvious.'],opts:[
    {t:'Count me in.',r:['Bring flowers. Or chocolate. Or both. Both is always right.']},
    {t:'Now I have to plan it.',r:['Oh, I can help! I have a list. It’s long. Some of it involves a sleigh.']}]},
   {open:['You did the little thing she always does, so she didn’t have to. Without being asked!','* She presses both hands to her heart. I like being around you when you’re happy. Come closer.'],opts:[
    {t:'Tomorrow too.',r:['That’s how it’s done. Little things, every day. It’s so romantic it hurts.']},
    {t:'It was just the dishes.',r:['“Just the dishes.” Kristoff did the dishes once and I nearly proposed again.']}]},
   {open:['You kissed her goodbye this morning. A real one, not a peck on the way out the door. I’ve been thinking about a kiss of my own. With you, to be clear.'],opts:[
    {t:'Every morning.',r:['* She sighs dreamily.','Every morning. Okay. I’m going to go find my husband now.']},
    {t:'The kids said “ew.”',r:['Perfect. Kids saying “ew” means you’re doing it right.']}]}],
  codex:'Ooh, you wrote this one about her! Read it again. Slowly. It’s good.',
  ack:'Yes! I knew it. You’re a keeper, you know that?',
  done:{open:['Every task finished. Come dance with me. I want a date with you, and I already moved the chairs.'],opts:[
   {t:'Same again tomorrow.',r:['Good. And tell her a queen said she’s a lucky woman.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays close after the dance. “I want another kiss. I’m being very clear. It feels rather good.”']}]}},

 // ---------------- Discipline ----------------
 elsa:{
  cheers:[
   {open:['Up on time. No snooze. I noticed. I notice you. More than I’ve been letting you see.'],opts:[
    {t:'Tomorrow too.',r:['Good. Same time. I’ll be practicing.']},
    {t:'I hit it once in my head.',r:['In your head doesn’t count. Hands count.']}]},
   {open:['* A thin line of frost traces your initials on the table.','Phone in the drawer all evening. That’s harder than it sounds. I know. Come sit beside me. I don’t need quite so much space tonight.'],opts:[
    {t:'I’ll keep it there.',r:['Then I’ll keep the drawer cold. Nobody likes reaching into a cold drawer.']},
    {t:'I checked it once.',r:['Once is better than forty times. Tomorrow, zero.']}]},
   {open:['You did the boring thing before the fun thing. That’s practically all of it, honestly. I’d like to walk with you afterward. I’ve been hoping you would ask.'],opts:[
    {t:'Count me in.',r:['Good. Boring first, every day. It stops feeling boring eventually.']},
    {t:'It was very boring.',r:['I know. I once spent a whole summer learning to stop a single drip. Worth it.']}]},
   {open:['Bed on time. You said you would and then you did. People underestimate that.','* A faint, approving smile. Before you go, stay a little. I enjoy having you close.'],opts:[
    {t:'Same time tomorrow.',r:['Then sleep well. I’ll keep it cool in there for you.']},
    {t:'I wanted one more episode.',r:['Everybody does. Tomorrow you can want it again and still say no.']}]}],
  codex:'You wrote this when your head was clear. Read it. It’s still true.',
  ack:'Good. Then that’s settled.',
  done:{open:['Everything is finished. Walk with me. I’d like to spend the quiet with you, rather than keeping it to myself.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow.',r:['I know you will. That’s what I like about you.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She leaves her hand in yours. “I want to kiss you. I’m tired of hoping you’ll guess.”']}]}},

 // ---------------- Fatherhood ----------------
 helen:{
  cheers:[
   {open:['You put the phone down and played with them. On the floor. Like a pro. When the house settles, come sit with me. I’d like some time that’s ours.'],opts:[
    {t:'Tomorrow too.',r:['That’s the job. Floor time. Capes optional.']},
    {t:'My knees hurt.',r:['Welcome to parenting. Stretch first. Trust me, I know a thing about stretching.']}]},
   {open:['* Helen gives a slow clap from across the Inn.','Bedtime done. Teeth brushed, story read, nobody escaped. Impressive. I’ve been looking forward to seeing your face without three interruptions.'],opts:[
    {t:'Every night.',r:['Good. Consistency wins. It beats any superpower I’ve got.']},
    {t:'One of them escaped twice.',r:['Only twice? Dash once made it three blocks. You’re doing great.']}]},
   {open:['You stayed calm when they melted down. Didn’t yell. That’s real heroics. Now let someone take care of you a little. I’m volunteering.'],opts:[
    {t:'I’ll keep at it.',r:['I know you will. And when you lose it someday, say sorry. That counts too.']},
    {t:'I yelled in my head.',r:['Head yelling is allowed. Everybody does it. Out loud is what they remember.']}]},
   {open:['You asked your kid how their day was and got more than “fine.” Do you know how hard that is? I like hearing you laugh. I’d like dinner with more of that.'],opts:[
    {t:'Count me in.',r:['Same question tomorrow. Keep it up and they’ll still talk to you at sixteen.']},
    {t:'It was mostly about lunch.',r:['Lunch is a start. Lunch leads to feelings. Feelings lead to secrets. Stay with it.']}]}],
  codex:'Here. You wrote this about your kids. Read it before you forget why you do all this.',
  ack:'That’s what I like to hear. Go get ’em, Dad.',
  done:{open:['Everybody’s settled. Come sit beside me. I want an evening with you where we get to finish a conversation.'],opts:[
   {t:'Same again tomorrow.',r:['I know. Get some sleep first. Even heroes need it.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She turns toward you on the couch. “Stay. I’d like another kiss before the rest of the world finds us.”']}]}},
};

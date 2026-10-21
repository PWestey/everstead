// Cheers (task-completion pop-ups), wave 4 Family part A. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Navani (Dalinar) and Amara (Bernard) keep their canon husbands: warm and teasing, never ignoring them.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Faith ----------------
 lilian:{
  cheers:[
   {open:['* A dagger thunks into the pew beside you. Lilian drops down from the rafters.','You prayed. Before your phone, even. I had money on the phone.'],opts:[
    {t:'Tomorrow too.',r:['Ugh. Fine. I’ll lose that bet every day if I have to.']},
    {t:'Who were you betting?',r:['Myself. I lost. I’m very bitter about it. Come here.']}]},
   {open:['Scripture before breakfast. My father read his like a war plan. You read yours like a letter. Better.'],opts:[
    {t:'Same time tomorrow.',r:['I’ll be in the rafters. Read the good parts louder.']},
    {t:'It was a short one.',r:['Short counts. I pray in about four words, mid-stab. Works fine.']}]},
   {open:['You wrote down three things you’re grateful for. One was coffee. One was me? Don’t lie, I peeked.'],opts:[
    {t:'You made the list.',r:['* Her pale cheeks go faintly gold.','Shut up. Okay. Don’t shut up. Write it again tomorrow.']},
    {t:'That was the coffee.',r:['Liar. I’ll fight the coffee. I’ll win.']}]},
   {open:['Rough day and you still knelt. The Light showed up for a dead girl in Lordaeron. It’ll show up for you.'],opts:[
    {t:'I’ll keep showing up.',r:['Good. Me too. Don’t make it weird. Okay, a little weird.']},
    {t:'You’re a softie, Voss.',r:['Say that in public and I’ll stab you. Gently. With love.']}]}],
  codex:'You wrote this down. I read it over your shoulder. Read it again, properly.',
  ack:'Fine. I’ll hold you to it. I hold grudges too, so.',
  done:{open:['Everything done. Every last one. I’ve seen whole Scarlet battalions with less discipline.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll be up early to watch. Don’t tell anyone I said early.']},
   {t:'Now we rest.',r:['Rest. Right. Back pew, your shoulder, my head. Don’t move.']}]}},

 morgana:{
  cheers:[
   {open:['You prayed for someone who hurt you. I felt that one from the garden. It was beautiful.'],opts:[
    {t:'I’ll pray again tomorrow.',r:['Then I’ll pray beside you. Kayle would hate how much I like that.']},
    {t:'It stung a bit.',r:['Grace usually does. That’s how you know it’s real.']}]},
   {open:['* Morgana sets down a watering can and brushes soil off her hands.','You read today. Even tired. A little scripture is like a little rain. The ground remembers.'],opts:[
    {t:'Count me in tomorrow.',r:['I will. And I’ll save you a seat in the garden.']},
    {t:'I read one line.',r:['One line, planted well, grows a whole tree. I’d know.']}]},
   {open:['Gratitude, written down. Most people only count what they lost. You counted what you have.'],opts:[
    {t:'I’ll keep counting.',r:['Good. And count me somewhere on that list. Near the top, if you’re brave.']},
    {t:'You were near the top.',r:['* Her wings shiver, just slightly.','Careful. I’m fallen, not made of stone.']}]},
   {open:['You helped someone and didn’t mention it. Quiet kindness is my favorite kind of prayer.'],opts:[
    {t:'More of that, then.',r:['Yes. And come tell me about it after. I like hearing you be good.']},
    {t:'How did you know?',r:['I watch the ones the world forgets. You were with one of them.']}]}],
  codex:'Your own words. Written when your heart was open. Sit with them a moment.',
  ack:'Then that’s a promise. I’ll keep a candle lit for it.',
  done:{open:['All of it, done. Even the parts no one saw. Especially those.'],opts:[
   {t:'Tomorrow too.',r:['I know you will. Now come sit in the garden with me. Stay a while.']},
   {t:'Can I collapse now?',r:['On the bench. Head in my lap. Those are the rules tonight.']}]}},

 soraka:{
  cheers:[
   {open:['You prayed! Oh, I felt that one. Like a little star turning on.'],opts:[
    {t:'Next one tomorrow.',r:['Yay! I’ll tell the stars. They get so excited, you have no idea.']},
    {t:'The stars felt it too?',r:['They’re very nosy. Like me. Hi.']}]},
   {open:['* Soraka hands you half a piece of fruit.','You read scripture and you didn’t rush. That deserves a snack.'],opts:[
    {t:'Same time tomorrow.',r:['I’ll bring the fruit. You bring the reading voice. It’s a nice voice.']},
    {t:'Is this a bribe?',r:['It’s a reward. A bribe would be two pieces.']}]},
   {open:['A gratitude list! Can I read it? Please? I won’t heal anything on it, I promise.'],opts:[
    {t:'Tomorrow’s list too.',r:['A list every day. Oh, you’re going to be so happy, it’s unfair.']},
    {t:'You’re on it.',r:['I am?! Okay. I need to sit down. My horn’s glowing.']}]},
   {open:['You helped someone today without being asked. That’s the closest thing to starlight down here.'],opts:[
    {t:'I’ll do it again.',r:['I know you will. You’ve got that look. The kind one.']},
    {t:'It was tiny.',r:['Tiny is how the stars do it. One little light at a time.']}]}],
  codex:'Look! You wrote this. Past you was very wise. Read it, read it.',
  ack:'Promise made! I’m telling the sky.',
  done:{open:['Everything! You did everything! I’m so proud I could float back up.'],opts:[
   {t:'Same tomorrow.',r:['Then I’ll stay down here. For you. Good trade.']},
   {t:'Don’t float away.',r:['* She grabs your sleeve.','Then hold on. Tighter. There.']}]}},

 // ---------------- Marriage ----------------
 alexstrasza:{
  cheers:[
   {open:['You gave her your whole attention tonight. No phone. I felt the warmth from Wyrmrest.'],opts:[
    {t:'Every night I can.',r:['Then your garden will outlive us both. I have seen it happen.']},
    {t:'She noticed.',r:['They always notice, little one. Even when they say nothing.']}]},
   {open:['* Alexstrasza smiles, eyes glowing gold.','You planned a date. Not a someday date. A real one, on the calendar.'],opts:[
    {t:'And the next one.',r:['Good. Love left to someday wilts. You water it now.']},
    {t:'Is it romantic enough?',r:['Is she there? Are you? Then yes. The rest is decoration.']}]},
   {open:['You told her she’s beautiful. Out loud, by daylight. Mortals forget how much that matters.'],opts:[
    {t:'I’ll say it tomorrow.',r:['Say it every day. I would give a great deal to hear it once more.']},
    {t:'She rolled her eyes.',r:['And smiled after. I know that look. I wore it for millennia.']}]},
   {open:['You helped with the hard part of her day without being asked. That is a dragon’s kind of love.'],opts:[
    {t:'Count me in.',r:['I already have. You’re one of mine now. The flight protects its own.']},
    {t:'I just did the dishes.',r:['Dishes, done for her, are a love letter. I’ve read many.']}]}],
  codex:'You wrote this down for her. Read it again, little one, and mean it twice.',
  ack:'Then it’s sworn. The Life-Binder witnessed it.',
  done:{open:['Everything tended today. Every last bloom. I am very proud of you.'],opts:[
   {t:'I’ll tend it tomorrow.',r:['Then go home. Kiss her. A dragon queen insists.']},
   {t:'Fly me home?',r:['* She laughs, warm and rumbling.','Tempting. But she should be the one waiting at the door.']}]}},

 amara:{
  cheers:[
   {open:['* A breeze tugs your collar. Amara steps out of it.','Date night logged. Cirrus confirms. You were on time, too. Shocking.'],opts:[
    {t:'And next week.',r:['Good. I’ll put it in my report. Bernard will want to shake your hand.']},
    {t:'You had me followed?',r:['Followed is such an ugly word. Supervised.']}]},
   {open:['You told her the truth about something small and dull. I know. I was in the hedge.'],opts:[
    {t:'Always the truth.',r:['That’s how Bernard won me. No lies, ever. It was terribly attractive.']},
    {t:'Why were you in a hedge?',r:['Professional habit. Also it was a very nice hedge.']}]},
   {open:['You asked her about her day and actually listened. Ten whole minutes. My kind of intelligence work.'],opts:[
    {t:'Ten more tomorrow.',r:['Make it twenty. You learn the best secrets after minute twelve.']},
    {t:'She talked a lot.',r:['She was saving it for you. Good thing you showed up.']}]},
   {open:['A note in her coat pocket. Very sneaky. I approve. Bernard once hid one in my saddle.'],opts:[
    {t:'I’ll hide another.',r:['Change the hiding spot. Keep her guessing. Trust a spy.']},
    {t:'What did his say?',r:['Come home. Just that. I rode all night.']}]}],
  codex:'Here’s a briefing you wrote yourself. Read it like your life depends on it.',
  ack:'Noted. I’ll check in. I always check in.',
  done:{open:['Every task done. Bernard says a man who finishes his chores has time for his wife. He’s right, the oaf.'],opts:[
   {t:'Same tomorrow.',r:['Good. Now go find her. That’s an order from the Crown.']},
   {t:'Time for my wife, then.',r:['Exactly. I’m going home to my oaf. You go home to yours.']}]}},

 ashe:{
  cheers:[
   {open:['You held her hand on the walk. Freljord rule: never let the warm one get cold.'],opts:[
    {t:'Tomorrow too.',r:['Good. Same path, same hand. That’s how winters are won.']},
    {t:'It was chilly anyway.',r:['Excuses are fine. The hand is what counts.']}]},
   {open:['* Ashe sets her bow down and nods once.','You apologized first. That’s harder than holding the line at the Howling Abyss.'],opts:[
    {t:'Next time too.',r:['That’s a king’s answer. Tryndamere took ten years to learn it.']},
    {t:'I hated it.',r:['Everyone does. Do it anyway. It’s cheaper than war.']}]},
   {open:['You cooked for her tonight. Avarosan custom: a fed queen is a happy queen.'],opts:[
    {t:'I’ll cook again.',r:['Good. Something warm. Something with a lot of butter.']},
    {t:'It was just pasta.',r:['Pasta is warm. Warm is love, where I’m from.']}]},
   {open:['You put the phone away and talked to her. Really talked. That’s rarer than True Ice.'],opts:[
    {t:'Every night.',r:['Then you’ll have a marriage that outlasts every winter.']},
    {t:'We talked about chores.',r:['Chores are strategy. Strategy is a marriage. Fine work.']}]}],
  codex:'Your own words, hunter. Read them slow. Then aim true.',
  ack:'Good. A queen keeps her word. So do you.',
  done:{open:['Every task done. The fire’s fed, the walls are strong. A good day.'],opts:[
   {t:'Same tomorrow.',r:['Then I’ll sleep easy. Go keep her warm.']},
   {t:'Now hot chocolate.',r:['* An actual grin.','Freljord rule. Two mugs. One’s for her.']}]}},

 navani:{
  cheers:[
   {open:['You asked her a new question tonight. A real one. Dalinar does that now. I trained him well.'],opts:[
    {t:'Another tomorrow.',r:['Good. Write the answers down. I keep a notebook on Dalinar. He’s a fascinating subject.']},
    {t:'She laughed at me.',r:['Good laughing or bad laughing? Good. Then you did it right.']}]},
   {open:['* Navani’s spanreed twitches on the table.','You sent her a message in the middle of the day. No reason. I like a man with no reason.'],opts:[
    {t:'I’ll send another.',r:['Excellent. Keep the resonance going. That’s fabrial science and romance, both.']},
    {t:'It was just a heart.',r:['A heart is a whole sentence, darling. I’ve sent Dalinar hundreds.']}]},
   {open:['Date night, planned and kept. You stopped working at dinner. Do you know how long that took me?'],opts:[
    {t:'Same next week.',r:['Then she has a husband who learns. That’s the best kind. I would know.']},
    {t:'How long did it take?',r:['Years. Dalinar just sat there and waited. Very effective. Very annoying.']}]},
   {open:['You left her a note. A good one, I hope. Night notes are best.'],opts:[
    {t:'I’ll write tomorrow.',r:['Good. Make it a little bold. Women’s script optional.']},
    {t:'Is “love you” enough?',r:['It’s a start. Add one specific thing. Specific is what she’ll reread.']}]}],
  codex:'Here’s your own note, written in a clearer moment. Study it. I study everything.',
  ack:'Recorded. I’ll ask you about it later. I always do.',
  done:{open:['Every task done. A perfectly tuned day. I may sketch it.'],opts:[
   {t:'Same again tomorrow.',r:['Then the fabrial runs another day. Go home to her. I’m going home to my large man.']},
   {t:'Can I stop thinking now?',r:['Yes. Go sit with her and think about nothing. It’s harder than it sounds.']}]}},

 // ---------------- Fatherhood ----------------
 draka:{
  cheers:[
   {open:['You wrestled with your cubs. I heard the shrieking. Good. Strong children are made on the floor.'],opts:[
    {t:'Round two tomorrow.',r:['Ha! A Frostwolf father. Let them win, mostly.']},
    {t:'They pinned me.',r:['Of course they did. You let them. That is the point.']}]},
   {open:['* Draka nods once, arms crossed.','Bedtime story, all the way to the end. You didn’t skip pages. I counted.'],opts:[
    {t:'Every night.',r:['Every night. I never got to read to Go’el. Read one for me, too.']},
    {t:'I skipped one page.',r:['One page. Hm. They will catch you next time. Children always do.']}]},
   {open:['You were at their game. Shouting. Too loud. Perfect.'],opts:[
    {t:'I’ll be at the next one.',r:['Good. A cub looks for their father in the crowd. Be there.']},
    {t:'Was I embarrassing?',r:['Very. They will remember it forever. That is the gift.']}]},
   {open:['You listened when your child talked about something boring. That is how you earn the big talks later.'],opts:[
    {t:'I’ll keep listening.',r:['Good. Durotan listened to everyone. That is why they followed him.']},
    {t:'It was about bugs.',r:['Bugs today. Heartbreak tomorrow. Same ears. Keep them open.']}]}],
  codex:'Your own words, father. Read them as if your cubs are listening.',
  ack:'Good. A Frostwolf keeps his word to the clan.',
  done:{open:['Every task done. The fire is fed, the cubs are safe. Lok’tar, father.'],opts:[
   {t:'Same tomorrow.',r:['Then the clan is strong. Go check on them one more time.']},
   {t:'I’m exhausted.',r:['Good. Tired fathers sleep well. Go. I will watch the fire.']}]}},
};

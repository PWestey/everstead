// Cheers (task-completion pop-ups), fourth wave part D. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fatherhood ----------------
 amah:{
  cheers:[
   {open:['* Amah claps flour off her hands, beaming.','Bath, pajamas, story, lights out, and nobody cried. Not even you. Earth Mother be praised. When everyone’s settled, come sit with me. I’ve been waiting for your company.'],opts:[
    {t:'Tomorrow too.',r:['I know it. Come eat something, you’ve earned a second helping.']},
    {t:'I almost cried. The shampoo fight.',r:['Ha! The shampoo fight. Every tauren calf in Mulgore has won that one at least once.']}]},
   {open:['You put the phone down and played their silly game. Properly. I saw their faces light up from across the Inn. I like that smile on you. Bring it over to my side of the hearth.'],opts:[
    {t:'I’ll keep showing up for it.',r:['That’s the whole recipe, little one. Showing up, and a bit of cornbread.']},
    {t:'I lost. Badly.',r:['Good. A father who loses to his kids is a father worth having. Baine never once beat his.']}]},
   {open:['You held them when they were scared tonight. Didn’t rush it. That’s the part they remember.','* She squeezes your shoulder with one big warm hand. Let me hold your hand a while. I’d enjoy that.'],opts:[
    {t:'I’ll be there every time.',r:['I believe you. And when you’re scared, you come find me. Fair trade.']},
    {t:'They had a nightmare about a goose.',r:['A goose? Wise child. Geese are terrifying. Kodos are scared of geese.']}]},
   {open:['You made them breakfast and sat down with them. Didn’t eat standing at the sink like a hungry plainstrider. You can stay after supper. I was rather hoping you would.'],opts:[
    {t:'Same table tomorrow.',r:['Good. Families are made at tables. Bring an extra plate for me sometime.']},
    {t:'The sink is very comfortable.',r:['* She swats you with a dish towel.','Sit down, you silly man.']}]}],
  codex:'Here. You wrote this when your heart was full. Read it slowly, like a mother would.',
  ack:'That’s my good father. Now come here and let me fuss.',
  done:{open:['The hearth is quiet. Come share my evening. I want you beside me, and I’m old enough to say so.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here with bread, waiting. Always.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She leaves her hand in yours. “Stay, love. I’d like to kiss you before we say goodnight.”']}]}},

 // ---------------- Work ----------------
 thalyssra:{
  cheers:[
   {open:['You did the hard task first. Before the inbox. That is how rebellions are won, and also quarterly reports. You have my attention. I would prefer this next conversation over dinner.'],opts:[
    {t:'Next one too.',r:['Good. I’ll have arcwine ready when you finish. Purely as a reward.']},
    {t:'It nearly won.',r:['Nearly is not a word in Suramar. You won. I noticed.']}]},
   {open:['* Thalyssra taps a ledger approvingly.','You put money aside today instead of spending it. Elisande never managed that in ten thousand years. Now that the accounts are settled, I would like you looking at me.'],opts:[
    {t:'I’ll keep saving.',r:['Then your house will stand long after the pretty ones fall. Trust me.']},
    {t:'I wanted the shiny thing.',r:['Of course you did. So did I. Buy me dinner with it next month instead.']}]},
   {open:['Two hours of deep work, no distractions. I could feel your focus from across the Market. That focus is rather attractive. I’m curious what it’s like to be its subject.'],opts:[
    {t:'Tomorrow too.',r:['Excellent. I will guard your door myself, and I do not guard doors for just anyone.']},
    {t:'My brain feels like soup.',r:['A good soup. Rest. Then do it again. That is the whole secret.']}]},
   {open:['You asked for the raise. Out loud. I know what that costs.','* She gives you a small, impressed smile. I cleared an evening for you. That was a deliberate decision.'],opts:[
    {t:'And I’ll keep asking.',r:['Good. Never let anyone set your worth for you. Not a queen, not a manager.']},
    {t:'My voice cracked.',r:['So did mine, the first time I spoke against Elisande. It still counted.']}]}],
  codex:'Your own words, written when your mind was clear. Read them again before you plan the rest of the week.',
  ack:'Good. I do love a man who follows through.',
  done:{open:['The Market is closing. Stay for a glass with me. I have been looking forward to your company all day.'],opts:[
   {t:'Same again tomorrow.',r:['I expect nothing less. And I will be here, ledger closed, waiting.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets her glass aside. “I want another kiss. I see no reason to pretend otherwise.”']}]}},

 // ---------------- Discipline ----------------
 valeera:{
  cheers:[
   {open:['Phone in the drawer all evening. Didn’t touch it. I know that itch. You won. I was hoping you’d look at me instead. There. Much better.'],opts:[
    {t:'I’ll win tomorrow too.',r:['One day at a time. That’s how I did it. That’s how you’ll do it.']},
    {t:'I stared at the drawer a lot.',r:['Ha. Me too, with the fel. Staring’s fine. Opening it isn’t.']}]},
   {open:['* Valeera drops from a rafter and lands beside you.','Up before the alarm. Again. Who taught you that? Come find me later. I’d like a date that doesn’t involve a rooftop escape.'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll be up there watching. Quiet as ever.']},
    {t:'The alarm’s scared of me now.',r:['As it should be. Varian’s alarm was a gladiator yelling. This is easier.']}]},
   {open:['You said no to the second dessert. Then you said no to the third. Varian would’ve laughed. I like watching you choose. Choose to sit beside me a minute.'],opts:[
    {t:'I’ll keep saying no.',r:['Saying no is a muscle. Yours is getting strong. I like strong.']},
    {t:'The third was a very good cake.',r:['* She smirks.','I know. I stole it. You’re welcome.']}]},
   {open:['Bed on time. No scrolling. You just went to sleep like a normal person. Come say goodnight in person. I’ve got something better than a wave in mind.'],opts:[
    {t:'Same time tomorrow.',r:['Good. Sleep’s where the fight gets easier. I wish I’d learned that sooner.']},
    {t:'It felt weird.',r:['Weird’s good. Weird means it’s working. Normal was the problem.']}]}],
  codex:'You wrote this when you were winning. Read it. Then win again.',
  ack:'That’s it. Stubborn. I love stubborn.',
  done:{open:['Every task finished. I’m taking the evening off. Want to spend it with me? That’s the whole invitation.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll be watching. From the rafters. Always.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays within reach, smiling. “I’m not vanishing this time. I’d like you to kiss me again.”']}]}},

 // ---------------- Faith ----------------
 liadrin:{
  cheers:[
   {open:['You prayed before your feet hit the floor. Before the phone. I felt the Light warm when you did. Come sit beside me afterward. I would like your company.'],opts:[
    {t:'Tomorrow too.',r:['I know you will. And I’ll be kneeling right beside you.']},
    {t:'I mostly mumbled.',r:['Mumbling is honest. The Light prefers honest to pretty.']}]},
   {open:['* Liadrin sets down her sword, smiling.','You read your scripture with your coffee. I saw the page. Good one. I was hoping you would stay for a walk. I have been thinking of you.'],opts:[
    {t:'I’ll keep reading.',r:['Then you’ll never be as lost as I was. I promise you that.']},
    {t:'I spilled coffee on it.',r:['Sanctified coffee. The Sunwell has seen stranger offerings.']}]},
   {open:['You wrote down three things you’re grateful for. Your wife was one. I may be a little jealous. You’re on mine as well. I wanted you to hear that from me.'],opts:[
    {t:'Tomorrow, three more.',r:['Good. Gratitude kept me alive in the dark years. It will keep you strong.']},
    {t:'You were number four.',r:['* She laughs, surprised, and flushes.','Flatterer. Number four. I’ll take it.']}]},
   {open:['You prayed even though you felt nothing. That is the bravest prayer there is. I know. I like your honesty. Be honest: would you like dinner with me?'],opts:[
    {t:'I’ll pray again tomorrow.',r:['Then the Light will find you. It found me, and I was far worse.']},
    {t:'It felt like talking to a wall.',r:['Then talk to the wall. The Light is on the other side of it. I promise.']}]}],
  codex:'You wrote this when your faith was bright. Read it again. Let it light the dark.',
  ack:'Good. That’s the man I kneel beside.',
  done:{open:['The candles are lit. Come walk with me beyond the chapel. I would like an evening that belongs to us.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here, waiting, every dawn.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She takes your hand and holds your gaze. “I want to kiss you again. There is nothing difficult about asking.”']}]}},

 zilyana:{
  cheers:[
   {open:['Prayer at dawn. Exactly at dawn. Saradomin approves. So do I. Sit beside me when you finish. I would like your company.'],opts:[
    {t:'Dawn again tomorrow.',r:['I will be at the door. Do not make me wait.']},
    {t:'The kettle was slow again.',r:['Then buy a faster kettle. Order begins in the kitchen.']}]},
   {open:['* Zilyana nods, once, sharp.','You read scripture before the house woke. A soldier’s habit. Good. I notice devotion. I have also begun to notice your smile.'],opts:[
    {t:'I’ll keep the watch.',r:['Then you are one of Saradomin’s. I am glad of it.']},
    {t:'I fell asleep on page two.',r:['Then read page two again. Even I have nodded off on watch. Once.']}]},
   {open:['You gave thanks before the meal. Out loud. Your children heard you. That matters more than any battle. Come walk with me tonight. I am asking for myself.'],opts:[
    {t:'Every meal.',r:['Good. Faith passed down is a wall no enemy can climb.']},
    {t:'They giggled.',r:['Let them giggle. They will remember the words long after the laugh.']}]},
   {open:['You prayed for the man who wronged you. That is harder than facing Bandos. I know. I have done both. You have my attention. I would like a moment of yours in return.'],opts:[
    {t:'I’ll keep praying for him.',r:['Then Saradomin keeps you. That is a promise from his general.']},
    {t:'It was through gritted teeth.',r:['Gritted teeth count. Swords are swung the same way.']}]}],
  codex:'You wrote this in a clear hour. Read it as an order from your better self.',
  ack:'Good. Order holds.',
  done:{open:['Duty is finished. Come sit with me. I want the evening with you, without a command between us.'],opts:[
   {t:'Same again tomorrow.',r:['I know you will. I will be waiting at the door.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets her sword aside and takes your hand. “I would like to kiss you. May I?”']}]}},

 // ---------------- Fitness ----------------
 yrel:{
  cheers:[
   {open:['You ran in the cold! I saw you come back pink and wheezing. That was wonderful. I like seeing that grin when you’re finished. Especially when it’s for me.'],opts:[
    {t:'Tomorrow too.',r:['Yes! I’ll run with you. I’ll even try not to win.']},
    {t:'My lungs filed a complaint.',r:['* She laughs.','Lungs always complain. They’re like Maraad. They mean well.']}]},
   {open:['* Yrel bounces on her hooves.','Fifty swings! Well, pushups. Same thing. You did them! Come walk with me afterward. No armor, no drills. A date.'],opts:[
    {t:'Fifty more tomorrow.',r:['Then soon a mace will feel light in your hand. Just like mine did.']},
    {t:'My arms are noodles.',r:['Strong noodles. Getting stronger. I can tell.']}]},
   {open:['You stretched afterward. Properly! Velen would be so proud. I’m proud. Stay a moment. I’ve been wanting a little time close to you.'],opts:[
    {t:'I’ll stretch every time.',r:['Then your body will thank you for years. Mine thanks me every day.']},
    {t:'I fell over.',r:['Everyone falls over. Velen falls over. Don’t tell him I told you.']}]},
   {open:['You walked instead of driving. All the way there and back. Little choices like that made me who I am. I’m looking forward to seeing you tonight. I meant to say that sooner.'],opts:[
    {t:'I’ll keep walking.',r:['Good. Every step counts. I counted mine all the way to Karabor.']},
    {t:'It started raining.',r:['* She grins.','Then you got a free bath. Even better.']}]}],
  codex:'You wrote this when you were strong. Read it again. Feel it.',
  ack:'Yes! That’s it! I knew you could!',
  done:{open:['Everything done. I’m putting the mace away. Come have dinner with me. I want to know you outside the Yard.'],opts:[
   {t:'Same again tomorrow.',r:['I’ll be at the Yard at dawn. Don’t be late!']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She holds your hand, smiling. “I meant a date. I’d like another, and a kiss before this one ends.”']}]}},

 nieve:{
  cheers:[
   {open:['Task complete. Workout done, no skipping. Streak alive. I’m almost impressed. I was watching more than your technique. Come closer, I’ll explain.'],opts:[
    {t:'Next task.',r:['That’s the spirit. Same time tomorrow. Don’t make me hunt you down.']},
    {t:'Almost?',r:['Almost. Finish the week and I’ll be fully impressed. Maybe.']}]},
   {open:['* Nieve checks her list.','Lifted before work. In the dark. That’s a real slayer’s habit. Save some time tonight. I’d like dinner with you, if you’re free.'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll tell Vannaka. He’ll pretend not to care. He’ll care.']},
    {t:'I tripped over the dog.',r:['Dogs are the hardest monster. Duradel’s never beaten one.']}]},
   {open:['You took the stairs. Every single time today. I counted. I like a man who follows through. Especially on a date invitation.'],opts:[
    {t:'Every time tomorrow.',r:['Then you’ll be climbing the Stronghold steps in no time. They’re brutal.']},
    {t:'You counted?',r:['I count everything. It’s a slayer thing. Also, I like watching you.']}]},
   {open:['You ate a proper meal. Protein, vegetables. No goblin food. Good. I’m taking you somewhere with proper food tonight.'],opts:[
    {t:'I’ll keep eating right.',r:['Good. You can’t kill dragons on cake. Well. You can. Once.']},
    {t:'What’s goblin food?',r:['Whatever’s in the bottom of your snack drawer. Yes. That.']}]}],
  codex:'Your own notes. Read them like a slayer task. Then finish it.',
  ack:'Task accepted. Good man.',
  done:{open:['Tasks finished. I’m off duty. Meet me for dinner. I’d like an evening where neither of us keeps score.'],opts:[
   {t:'Same again tomorrow.',r:['That’s what I like to hear. I’ll have a new list ready.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She puts the task list away. “No reward to earn. I want to kiss you because I like you.”']}]}},

 // ---------------- Home ----------------
 ellamaria:{
  cheers:[
   {open:['You did the dishes before bed. All of them. Even the pan. A queen notices these things. Come sit in the garden with me. I saved the bench nearest the roses.'],opts:[
    {t:'Tomorrow too.',r:['Then your home will be lovelier than any palace. Mine included.']},
    {t:'The pan fought back.',r:['Pans always do. Roald once lost a battle with a soup pot.']}]},
   {open:['* Ellamaria claps her muddy gloves.','You fixed the dripping tap! I heard it stop from the garden. I’ve been finding reasons to come past. You may have noticed.'],opts:[
    {t:'Next fix tomorrow.',r:['Wonderful. A home is grown one fix at a time, like a rose bed.']},
    {t:'I flooded the floor first.',r:['* She laughs.','Every gardener floods something. It’s part of the charm.']}]},
   {open:['You tidied before the kids woke. They walked into a lovely house. That’s a gift, you know. You have a very distracting smile when you’re pleased with yourself.'],opts:[
    {t:'I’ll keep it lovely.',r:['Then they’ll grow up thinking a home is meant to feel this way. Because it is.']},
    {t:'It lasted ten minutes.',r:['Ten lovely minutes. My garden looks perfect for about that long too.']}]},
   {open:['You mowed the lawn and weeded the bed. I’d knight you if Roald would let me. Now let me have a little of your attention. I’ve been waiting.'],opts:[
    {t:'I’ll keep tending it.',r:['Then it will bloom. Homes and gardens both. I promise.']},
    {t:'Knight me anyway.',r:['* She taps your shoulder with a trowel.','Sir Gardener. Arise.']}]}],
  codex:'You wrote this down when your home felt right. Read it again, darling.',
  ack:'Lovely. That’s the man who makes a house a home.',
  done:{open:['The garden can wait. Come sit with me. I’d like to enjoy your company without pretending I need help pruning.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here, waiting among the roses.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She leaves her crown on the bench. “I’d like another kiss. That’s Ellamaria asking, not the queen.”']}]}},
};

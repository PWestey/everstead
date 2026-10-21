// Cheers (task-completion pop-ups), fourth wave part D. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Fatherhood ----------------
 amah:{
  cheers:[
   {open:['* Amah claps flour off her hands, beaming.','Bath, pajamas, story, lights out, and nobody cried. Not even you. Earth Mother be praised.'],opts:[
    {t:'Tomorrow too.',r:['I know it. Come eat something, you’ve earned a second helping.']},
    {t:'I almost cried. The shampoo fight.',r:['Ha! The shampoo fight. Every tauren calf in Mulgore has won that one at least once.']}]},
   {open:['You put the phone down and played their silly game. Properly. I saw their faces light up from across the Inn.'],opts:[
    {t:'I’ll keep showing up for it.',r:['That’s the whole recipe, little one. Showing up, and a bit of cornbread.']},
    {t:'I lost. Badly.',r:['Good. A father who loses to his kids is a father worth having. Baine never once beat his.']}]},
   {open:['You held them when they were scared tonight. Didn’t rush it. That’s the part they remember.','* She squeezes your shoulder with one big warm hand.'],opts:[
    {t:'I’ll be there every time.',r:['I believe you. And when you’re scared, you come find me. Fair trade.']},
    {t:'They had a nightmare about a goose.',r:['A goose? Wise child. Geese are terrifying. Kodos are scared of geese.']}]},
   {open:['You made them breakfast and sat down with them. Didn’t eat standing at the sink like a hungry plainstrider.'],opts:[
    {t:'Same table tomorrow.',r:['Good. Families are made at tables. Bring an extra plate for me sometime.']},
    {t:'The sink is very comfortable.',r:['* She swats you with a dish towel.','Sit down, you silly man.']}]}],
  codex:'Here. You wrote this when your heart was full. Read it slowly, like a mother would.',
  ack:'That’s my good father. Now come here and let me fuss.',
  done:{open:['Everything done? All of it? Oh, look at you. Sit by my fire. I saved you the warm spot.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here with bread, waiting. Always.']},
   {t:'Just you and the fire.',r:['* She lifts the blanket for you, smiling.','Then come closer. I don’t bite. Much.']}]}},

 // ---------------- Work ----------------
 thalyssra:{
  cheers:[
   {open:['You did the hard task first. Before the inbox. That is how rebellions are won, and also quarterly reports.'],opts:[
    {t:'Next one too.',r:['Good. I’ll have arcwine ready when you finish. Purely as a reward.']},
    {t:'It nearly won.',r:['Nearly is not a word in Suramar. You won. I noticed.']}]},
   {open:['* Thalyssra taps a ledger approvingly.','You put money aside today instead of spending it. Elisande never managed that in ten thousand years.'],opts:[
    {t:'I’ll keep saving.',r:['Then your house will stand long after the pretty ones fall. Trust me.']},
    {t:'I wanted the shiny thing.',r:['Of course you did. So did I. Buy me dinner with it next month instead.']}]},
   {open:['Two hours of deep work, no distractions. I could feel your focus from across the Market.'],opts:[
    {t:'Tomorrow too.',r:['Excellent. I will guard your door myself, and I do not guard doors for just anyone.']},
    {t:'My brain feels like soup.',r:['A good soup. Rest. Then do it again. That is the whole secret.']}]},
   {open:['You asked for the raise. Out loud. I know what that costs.','* She gives you a small, impressed smile.'],opts:[
    {t:'And I’ll keep asking.',r:['Good. Never let anyone set your worth for you. Not a queen, not a manager.']},
    {t:'My voice cracked.',r:['So did mine, the first time I spoke against Elisande. It still counted.']}]}],
  codex:'Your own words, written when your mind was clear. Read them again before you plan the rest of the week.',
  ack:'Good. I do love a man who follows through.',
  done:{open:['Every task complete. I am almost suspicious. Come, sit. The Market lanterns are lovely at this hour.'],opts:[
   {t:'Same again tomorrow.',r:['I expect nothing less. And I will be here, ledger closed, waiting.']},
   {t:'Just us and the lanterns.',r:['* She takes your arm, glow soft in the dark.','No ledgers. I promise.']}]}},

 // ---------------- Discipline ----------------
 valeera:{
  cheers:[
   {open:['Phone in the drawer all evening. Didn’t touch it. I know that itch. You won.'],opts:[
    {t:'I’ll win tomorrow too.',r:['One day at a time. That’s how I did it. That’s how you’ll do it.']},
    {t:'I stared at the drawer a lot.',r:['Ha. Me too, with the fel. Staring’s fine. Opening it isn’t.']}]},
   {open:['* Valeera drops from a rafter and lands beside you.','Up before the alarm. Again. Who taught you that?'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll be up there watching. Quiet as ever.']},
    {t:'The alarm’s scared of me now.',r:['As it should be. Varian’s alarm was a gladiator yelling. This is easier.']}]},
   {open:['You said no to the second dessert. Then you said no to the third. Varian would’ve laughed.'],opts:[
    {t:'I’ll keep saying no.',r:['Saying no is a muscle. Yours is getting strong. I like strong.']},
    {t:'The third was a very good cake.',r:['* She smirks.','I know. I stole it. You’re welcome.']}]},
   {open:['Bed on time. No scrolling. You just went to sleep like a normal person.'],opts:[
    {t:'Same time tomorrow.',r:['Good. Sleep’s where the fight gets easier. I wish I’d learned that sooner.']},
    {t:'It felt weird.',r:['Weird’s good. Weird means it’s working. Normal was the problem.']}]}],
  codex:'You wrote this when you were winning. Read it. Then win again.',
  ack:'That’s it. Stubborn. I love stubborn.',
  done:{open:['Every task done. Not one skipped. You know how rare that is? Come here, I want to look at you.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll be watching. From the rafters. Always.']},
   {t:'Just you tonight.',r:['* She leans close, a slow grin.','Careful. Rogues are good at keeping secrets.']}]}},

 // ---------------- Faith ----------------
 liadrin:{
  cheers:[
   {open:['You prayed before your feet hit the floor. Before the phone. I felt the Light warm when you did.'],opts:[
    {t:'Tomorrow too.',r:['I know you will. And I’ll be kneeling right beside you.']},
    {t:'I mostly mumbled.',r:['Mumbling is honest. The Light prefers honest to pretty.']}]},
   {open:['* Liadrin sets down her sword, smiling.','You read your scripture with your coffee. I saw the page. Good one.'],opts:[
    {t:'I’ll keep reading.',r:['Then you’ll never be as lost as I was. I promise you that.']},
    {t:'I spilled coffee on it.',r:['Sanctified coffee. The Sunwell has seen stranger offerings.']}]},
   {open:['You wrote down three things you’re grateful for. Your wife was one. I may be a little jealous.'],opts:[
    {t:'Tomorrow, three more.',r:['Good. Gratitude kept me alive in the dark years. It will keep you strong.']},
    {t:'You were number four.',r:['* She laughs, surprised, and flushes.','Flatterer. Number four. I’ll take it.']}]},
   {open:['You prayed even though you felt nothing. That is the bravest prayer there is. I know.'],opts:[
    {t:'I’ll pray again tomorrow.',r:['Then the Light will find you. It found me, and I was far worse.']},
    {t:'It felt like talking to a wall.',r:['Then talk to the wall. The Light is on the other side of it. I promise.']}]}],
  codex:'You wrote this when your faith was bright. Read it again. Let it light the dark.',
  ack:'Good. That’s the man I kneel beside.',
  done:{open:['Every task done. Every one. Come sit with me in the Chapel. The candles are lit and it’s quiet.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here, waiting, every dawn.']},
   {t:'Just you and the candles.',r:['* She makes room on the pew, eyes warm.','Then come closer. The Light won’t mind.']}]}},

 zilyana:{
  cheers:[
   {open:['Prayer at dawn. Exactly at dawn. Saradomin approves. So do I.'],opts:[
    {t:'Dawn again tomorrow.',r:['I will be at the door. Do not make me wait.']},
    {t:'The kettle was slow again.',r:['Then buy a faster kettle. Order begins in the kitchen.']}]},
   {open:['* Zilyana nods, once, sharp.','You read scripture before the house woke. A soldier’s habit. Good.'],opts:[
    {t:'I’ll keep the watch.',r:['Then you are one of Saradomin’s. I am glad of it.']},
    {t:'I fell asleep on page two.',r:['Then read page two again. Even I have nodded off on watch. Once.']}]},
   {open:['You gave thanks before the meal. Out loud. Your children heard you. That matters more than any battle.'],opts:[
    {t:'Every meal.',r:['Good. Faith passed down is a wall no enemy can climb.']},
    {t:'They giggled.',r:['Let them giggle. They will remember the words long after the laugh.']}]},
   {open:['You prayed for the man who wronged you. That is harder than facing Bandos. I know. I have done both.'],opts:[
    {t:'I’ll keep praying for him.',r:['Then Saradomin keeps you. That is a promise from his general.']},
    {t:'It was through gritted teeth.',r:['Gritted teeth count. Swords are swung the same way.']}]}],
  codex:'You wrote this in a clear hour. Read it as an order from your better self.',
  ack:'Good. Order holds.',
  done:{open:['Every task complete. Discipline and faith, both. Stand easy. Sit with me.'],opts:[
   {t:'Same again tomorrow.',r:['I know you will. I will be waiting at the door.']},
   {t:'Just you and the quiet.',r:['* She sets down her sword and takes your hand.','Then stay. That is not an order.']}]}},

 // ---------------- Fitness ----------------
 yrel:{
  cheers:[
   {open:['You ran in the cold! I saw you come back pink and wheezing. That was wonderful.'],opts:[
    {t:'Tomorrow too.',r:['Yes! I’ll run with you. I’ll even try not to win.']},
    {t:'My lungs filed a complaint.',r:['* She laughs.','Lungs always complain. They’re like Maraad. They mean well.']}]},
   {open:['* Yrel bounces on her hooves.','Fifty swings! Well, pushups. Same thing. You did them!'],opts:[
    {t:'Fifty more tomorrow.',r:['Then soon a mace will feel light in your hand. Just like mine did.']},
    {t:'My arms are noodles.',r:['Strong noodles. Getting stronger. I can tell.']}]},
   {open:['You stretched afterward. Properly! Velen would be so proud. I’m proud.'],opts:[
    {t:'I’ll stretch every time.',r:['Then your body will thank you for years. Mine thanks me every day.']},
    {t:'I fell over.',r:['Everyone falls over. Velen falls over. Don’t tell him I told you.']}]},
   {open:['You walked instead of driving. All the way there and back. Little choices like that made me who I am.'],opts:[
    {t:'I’ll keep walking.',r:['Good. Every step counts. I counted mine all the way to Karabor.']},
    {t:'It started raining.',r:['* She grins.','Then you got a free bath. Even better.']}]}],
  codex:'You wrote this when you were strong. Read it again. Feel it.',
  ack:'Yes! That’s it! I knew you could!',
  done:{open:['Everything done! Every single thing! Come here, I want to hug you!'],opts:[
   {t:'Same again tomorrow.',r:['I’ll be at the Yard at dawn. Don’t be late!']},
   {t:'Hug accepted.',r:['* She throws her arms around you and holds on.','You’re warm. I’m staying a minute.']}]}},

 nieve:{
  cheers:[
   {open:['Task complete. Workout done, no skipping. Streak alive. I’m almost impressed.'],opts:[
    {t:'Next task.',r:['That’s the spirit. Same time tomorrow. Don’t make me hunt you down.']},
    {t:'Almost?',r:['Almost. Finish the week and I’ll be fully impressed. Maybe.']}]},
   {open:['* Nieve checks her list.','Lifted before work. In the dark. That’s a real slayer’s habit.'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll tell Vannaka. He’ll pretend not to care. He’ll care.']},
    {t:'I tripped over the dog.',r:['Dogs are the hardest monster. Duradel’s never beaten one.']}]},
   {open:['You took the stairs. Every single time today. I counted.'],opts:[
    {t:'Every time tomorrow.',r:['Then you’ll be climbing the Stronghold steps in no time. They’re brutal.']},
    {t:'You counted?',r:['I count everything. It’s a slayer thing. Also, I like watching you.']}]},
   {open:['You ate a proper meal. Protein, vegetables. No goblin food.'],opts:[
    {t:'I’ll keep eating right.',r:['Good. You can’t kill dragons on cake. Well. You can. Once.']},
    {t:'What’s goblin food?',r:['Whatever’s in the bottom of your snack drawer. Yes. That.']}]}],
  codex:'Your own notes. Read them like a slayer task. Then finish it.',
  ack:'Task accepted. Good man.',
  done:{open:['Every task done. Full streak. That’s worth slayer points. Lots of them.'],opts:[
   {t:'Same again tomorrow.',r:['That’s what I like to hear. I’ll have a new list ready.']},
   {t:'What can I spend them on?',r:['* Her grin turns sly.','Come by the Yard after sunset. I’ll show you the rewards list.']}]}},

 // ---------------- Home ----------------
 ellamaria:{
  cheers:[
   {open:['You did the dishes before bed. All of them. Even the pan. A queen notices these things.'],opts:[
    {t:'Tomorrow too.',r:['Then your home will be lovelier than any palace. Mine included.']},
    {t:'The pan fought back.',r:['Pans always do. Roald once lost a battle with a soup pot.']}]},
   {open:['* Ellamaria claps her muddy gloves.','You fixed the dripping tap! I heard it stop from the garden.'],opts:[
    {t:'Next fix tomorrow.',r:['Wonderful. A home is grown one fix at a time, like a rose bed.']},
    {t:'I flooded the floor first.',r:['* She laughs.','Every gardener floods something. It’s part of the charm.']}]},
   {open:['You tidied before the kids woke. They walked into a lovely house. That’s a gift, you know.'],opts:[
    {t:'I’ll keep it lovely.',r:['Then they’ll grow up thinking a home is meant to feel this way. Because it is.']},
    {t:'It lasted ten minutes.',r:['Ten lovely minutes. My garden looks perfect for about that long too.']}]},
   {open:['You mowed the lawn and weeded the bed. I’d knight you if Roald would let me.'],opts:[
    {t:'I’ll keep tending it.',r:['Then it will bloom. Homes and gardens both. I promise.']},
    {t:'Knight me anyway.',r:['* She taps your shoulder with a trowel.','Sir Gardener. Arise.']}]}],
  codex:'You wrote this down when your home felt right. Read it again, darling.',
  ack:'Lovely. That’s the man who makes a house a home.',
  done:{open:['Every task done. Every one. Come sit in the garden with me. The roses are out tonight.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be here, waiting among the roses.']},
   {t:'Just you and the roses.',r:['* She takes your hand, crown askew.','Then come closer. Roald need never know.']}]}},
};

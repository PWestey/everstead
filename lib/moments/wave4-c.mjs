// Fourth-wave moments, part C: Family Caitlyn, Garona, Riven, Sylvanas, Xalatath (Discipline) and
// Jasnah, Seraphine, Sona (Hobbies). Visits and gifts. See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.
// Sona is mute: her lines are narration of what she plays and does, plus short written notes.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Caitlyn (Discipline) ----------------
 caitlyn:{
  visit:[
   {open:['* Caitlyn has commandeered a Library table and covered it in case files, her hat parked on a stack of books.','You put the phone in the drawer at nine and left it there. I timed it. Old habit. Sorry. Not very sorry.'],opts:[
    {t:'You timed me?',r:['I time everyone. You’re the only one I enjoy timing. Make of that what you will.']},
    {t:'Nine-fifteen, technically.',r:['* She makes a small note in the margin, lips twitching.','Honesty. Docked fifteen minutes, awarded one point for confessing. Net positive, cupcake.']}]},
   {open:['* She’s cleaning her rifle by the window, every piece laid out in a neat row on a cloth.','Vi thinks this is boring. It’s the opposite. Clean it every night and it never jams when it counts.','Your evening routine is the same thing. Don’t tell me it isn’t.'],opts:[
    {t:'Show me how you do it.',r:['* She hands you a brass part and guides your fingers with hers, slowly, longer than strictly necessary.','Gently. Like that. You learn quickly.']},
    {t:'Mine involves fewer bullets.',r:['Shame. You’d look rather good with a rifle. I’ll stop picturing it now. Possibly.']}]},
   {open:['Patience is most of my job. Lie on a rooftop for three hours, wait for one second that matters.','You skipped the late-night scrolling. That’s three hours you got back. Spend one of them with me?'],opts:[
    {t:'Name the rooftop.',r:['Kiramman tower, east side, ten o’clock. Bring a blanket. The view of Piltover is the second-best thing up there.']},
    {t:'Only one hour?',r:['Greedy. I like that in a man who’s earned it. We’ll negotiate when you get there.']}]},
   {open:['* Caitlyn steps out from behind a shelf, close enough that you catch the tea and gun-oil on her.','I’ve been studying you, {name}. Same bedtime five nights running. Same alarm. You’re very easy to read.','I’d like to read a little more.'],opts:[
    {t:'Case is open.',r:['* She tucks a finger under your collar and tugs you a step closer.','Good. I’m thorough. It may take several interviews.']},
    {t:'What’s your conclusion?',r:['Steady hands, steady habits, distracting smile. I haven’t decided if you’re a suspect or a reward.']}]},
   {open:['* Late. The Library is dark except for one lamp. Caitlyn has taken her gloves off, which she never does.','Everyone in Piltover wants something from the sheriff. I just wanted one evening off. And you, apparently.'],opts:[
    {t:'Take the evening.',r:['* She sets her hat on your head, laughs, and kisses you, slow and very precise.','Off duty. Don’t tell the Council.','* She turns the lamp down herself.']},
    {t:'Arrest me, Sheriff.',r:['* Her eyebrow arches. She takes your wrist like she means it.','You have the right to remain right here. All night. Anything else will be used against you.']}]}],
  gift:['Thoughtful, well chosen. I would like to thank you somewhere I don’t have to keep my official expression.','I’ll admit I deduced what this was before you handed it over. I still love it. I love that you tried.','Careful. Keep spoiling me and I’ll have to put you under permanent surveillance. Close surveillance.']},

 // ---------------- Garona (Discipline) ----------------
 garona:{
  visit:[
   {open:['* You don’t hear Garona come in. She’s just there, leaning on a Library shelf, peeling an apple with a knife that could do worse.','You said no to something today. I watched your face. It cost you.'],opts:[
    {t:'It did cost me.',r:['Good. Things that cost nothing aren’t yours. That one’s yours now. Nobody gets to take it.']},
    {t:'You were watching me?',r:['I watch everyone. Habit from a life where not watching got you killed. You’re just nicer to watch.']}]},
   {open:['People spent years pulling my strings. The Horde. Gul’dan. The voices in my head that weren’t mine.','When I hear you choosing your own bedtime, your own morning, I think you don’t know how lucky that is.'],opts:[
    {t:'Tell me about it.',r:['* She sits down next to you, closer than she needs to.','Some other night. Tonight I just want to sit with a man who owns his own day.']},
    {t:'Nobody pulls your strings now.',r:['No. And anyone who tries loses a hand. Remember that, love. In case you ever get ideas.']}]},
   {open:['* She tosses you a practice dagger, hilt first.','Sharp mind, sharp blade. Both dull if you skip a day. Up. Show me what you’ve got.'],opts:[
    {t:'Spar with her.',r:['* She has you pinned against the shelves in four moves, her face an inch from yours.','You let me win. Liar. Or you wanted to end up here.']},
    {t:'I’d rather watch you.',r:['* A slow half-smile, more orc than human.','Flattery. Cheap trick. It works, but don’t tell anyone.']}]},
   {open:['You know what’s funny? Half-orc, half-draenei. Nobody wanted me. Not the Horde, not Stormwind.','And here’s a village that keeps a chair for me. A man who looks at me like I’m not a problem to solve.'],opts:[
    {t:'You’re not a problem.',r:['* She looks away fast and laughs once, rough.','Careful. Say things like that and I start staying places.']},
    {t:'You’re a little bit of a problem.',r:['* Her grin shows the tusks. It’s a great grin.','Finally, honesty. I like a man who notices the knives and stays anyway.']}]},
   {open:['* Garona bolts the Library door and checks the window twice, like she always does. Then she turns, and her shoulders drop.','I’ve never trusted anyone enough to stop watching the door. I think I’m going to stop now.'],opts:[
    {t:'I’ll watch it for you.',r:['* She crosses the room and kisses you hard, one hand fisted in your shirt.','Good. Your eyes on the door. Mine on you.','* The candle gutters out, and she doesn’t relight it.']},
    {t:'Then come here.',r:['* She does, slowly, like a hunter who has decided to be caught.','Just this once, nobody’s giving me orders. Not even you. Especially not you.']}]}],
  gift:['No orders attached. You remembered what I like. Come here. I want to thank you without hiding a smile.','Hm. It’s not poisoned and it’s not a bribe. I checked. That makes it the nicest thing anyone’s given me in years.','Stop smiling at me like that. Fine. Thank you. Now come here before I change my mind.']},

 // ---------------- Riven (Discipline) ----------------
 riven:{
  visit:[
   {open:['* Riven is behind the Library at dawn, running forms with her broken blade, the runes on it glowing faint green.','You’re up early too. Good. Mornings are when I remember who I want to be.'],opts:[
    {t:'Mind if I join?',r:['* She steps in behind you and corrects your stance, her hands on your hips for a long second.','Lower. There. Now don’t move unless I tell you.']},
    {t:'You’re hard to look away from.',r:['* Her blade wobbles for the first time all morning.','Don’t say things like that during forms. I almost cut a tree.']}]},
   {open:['I broke my sword because of what I’d done with it. I tied the pieces back together because I wasn’t done fixing myself.','Every routine you keep is a knot like that. I see you tying them. One a day.'],opts:[
    {t:'Some days the knot slips.',r:['Mine too. You tie it again. I’ve retied this blade more times than I’ve swung it, I think.']},
    {t:'We’re both a bit broken.',r:['* She smiles, just barely.','Broken things that keep working. That might be my favorite kind of person.']}]},
   {open:['* She’s at a Library table with a bowl of rice and a small pot of Ionian tea, shy about it.','I don’t really do company. I made two cups by accident. Sit, if you want. You don’t have to.'],opts:[
    {t:'Sit with her.',r:['* She pours, hands careful, and lets her knee rest against yours under the table.','This is nice. Quiet. Nobody shouting orders. Just you.']},
    {t:'Two cups by accident?',r:['* She goes red to the ears.','Fine. On purpose. Drink your tea and stop being clever.']}]},
   {open:['Noxus taught me discipline was obedience. Ionia taught me it was choosing. Every morning, choosing.','I like watching you choose, {name}. You put the phone down and pick up your life. It’s attractive. Annoyingly.'],opts:[
    {t:'Annoyingly?',r:['I came here to be alone and get better. Now I’m getting better and thinking about you. It’s distracting.']},
    {t:'Choose me, then.',r:['* She steps close, eyes on yours, and doesn’t step back.','I think I already did. I was waiting to see if you’d notice.']}]},
   {open:['* The Library is dark. Riven sets her blade down on the table, carefully, which she never does around anyone.','I don’t put it down for people. I’m putting it down for you.'],opts:[
    {t:'Take her hand.',r:['* Her fingers are calloused and warm. She pulls you closer and kisses you, slow, a little unsure, then very sure.','Stay. Just tonight. I want to know what it’s like to not be alone.']},
    {t:'I’ll keep you safe.',r:['* She laughs softly against your shoulder.','I’m the one with the sword. But I like hearing it. Say it again, quieter.']}]}],
  gift:['You remembered. Thank you. I’m not very practiced at this, but I’d like to kiss you.','It’s beautiful. I don’t know what to say. That’s, um, rare. Thank you.','You remembered I like Ionian blossoms. Nobody remembers anything about me. Come here.']},

 // ---------------- Sylvanas (Discipline) ----------------
 sylvanas:{
  visit:[
   {open:['* Sylvanas stands at the Library’s tallest window, hood up, red eyes catching the lamplight. She doesn’t turn around.','You turned off the screen when you said you would. Most mortals lie to themselves. You didn’t. Noted.'],opts:[
    {t:'You noticed?',r:['I notice weakness. I noticed its absence. Do not let it go to your head.']},
    {t:'Most mortals?',r:['I was one once. Sunlight, a bow, two sisters to tease. I remember being far less disciplined than you.']}]},
   {open:['* She’s restringing her longbow at a Library table, fingers quick, unhurried.','Alleria tells me I’m too hard on you. Alleria is soft, for a void-touched ranger.','I am exactly as hard on you as you deserve.'],opts:[
    {t:'Then be harder.',r:['* For a moment, something like a smile.','Careful what you ask a Windrunner for. We always deliver.']},
    {t:'Your sister likes me.',r:['My sister likes everyone. I am considerably more selective. Draw your own conclusions.']}]},
   {open:['I was ranger-general of Silvermoon. Every scout on the border woke before dawn because I did.','You woke before dawn. Without a ranger-general. That is either discipline or madness. I approve of both.'],opts:[
    {t:'I had a good reason.',r:['Keep it. Reasons are arrows. When the will runs out, you aim them.']},
    {t:'Wake up with me tomorrow.',r:['* She turns, finally, and studies you a long moment.','Bold. Dawn, at the top of the Library tower. If you’re late, I leave. I never wait twice.']}]},
   {open:['* She steps close. The air around her is cold, but her gloved hand on your jaw is not.','I have been a queen, a weapon, and a ghost. I gave up on wanting things a long time ago, {name}.','You are making that very difficult.'],opts:[
    {t:'Want something, then.',r:['* Her thumb traces your lip, slow.','Dangerous advice to give the Banshee Queen. I may take more than you offer.']},
    {t:'I’m sorry. Not sorry.',r:['* She laughs, low and real, the first time you’ve heard it.','Insolent. I used to have people executed for that. Now I find it charming. Infuriating.']}]},
   {open:['* Sylvanas lowers her hood. Up close, without the armor, she looks less like a queen and more like the ranger she used to be.','Quel’Thalas is behind me. The Maw is behind me. I am tired of carrying all of it. Hold me up for one night.'],opts:[
    {t:'Hold her.',r:['* She leans into you, stiff at first, then all at once. Then she kisses you, cool and hungry.','Do not tell Alleria. Or Vereesa. Especially Vereesa.','* She blows out the lamp.']},
    {t:'As long as you like.',r:['As long as I like is a very long time. I hope you meant it.','* She pulls you down beside her, and the night closes in.']}]}],
  gift:['You remembered something I thought everyone had forgotten. Stay. I would like to thank you without an audience.','It reminds me of Eversong in spring. I had forgotten I could miss anything. Thank you.','Hm. You are spoiling me. I have not been spoiled in a very long time. Continue.']},

 // ---------------- Xalatath (Discipline) ----------------
 xalatath:{
  visit:[
   {open:['* The lamps in the Library dim a shade. Xalatath is sitting on your table, swinging one foot, purple light curling around her fingers.','You could have scrolled all night, darling. I made it so easy. And you went to bed. Rude.'],opts:[
    {t:'I’m going to bed again tonight.',r:['* She laughs, delighted.','Oh, I love it when they fight back. Do it again. I’ll be watching.']},
    {t:'Was that you?',r:['Some of it. The little voice that says one more video? I don’t need to whisper that. You people invented it yourselves.']}]},
   {open:['I was a blade once, you know. Held by kings, priests, very foolish heroes. They all broke eventually.','You keep not breaking. It’s tedious. It’s also the most interesting thing I’ve seen in a century.'],opts:[
    {t:'Get used to it.',r:['* She leans in, eyes like a starless sky.','Mm. Say that again. I want to remember the exact moment you were brave.']},
    {t:'A century? Flattered.',r:['You should be. I’ve watched empires. Nerubians. Titans. None of them put their phone in a drawer.']}]},
   {open:['* She drapes herself over the chair beside you, chin in her hand.','Skip the workout. Have another sweet. Stay up late. The Void has such lovely suggestions.','No? Not even for me?'],opts:[
    {t:'Not even for you.',r:['* She sighs dramatically, then smiles like you just handed her a present.','Cruel. I adore cruel. Fine, go keep your little promises.']},
    {t:'Tempting. Still no.',r:['Tempting. He said tempting. I’ll take it. Every no gets a little slower, darling. I can wait.']}]},
   {open:['Here’s a secret, {name}. The Void doesn’t want you to fail. It wants you to stop trying. Those are different.','You haven’t stopped. Not once. I find myself rather fond of you, and that’s alarming for both of us.'],opts:[
    {t:'Fond of me?',r:['* Her fingers trail down your arm, leaving cold shivers behind them.','Don’t make it weird. I’m an ancient horror. I’m allowed one weakness.']},
    {t:'Should I be worried?',r:['Terribly. But not tonight. Tonight I just want to sit close and listen to you being stubborn.']}]},
   {open:['* Every lamp in the Library goes out at once. In the dark, only her eyes glow, very close.','No whispers tonight. No tricks. Just me. I’m curious what that feels like.'],opts:[
    {t:'Find out.',r:['* She kisses you, and it feels like falling and being caught at the same time.','Oh. That’s new. I want more of new.','* The dark folds around you both.']},
    {t:'No tricks? Promise?',r:['* A soft laugh against your neck.','I don’t make promises. I make exceptions. You’re one. Now hush.']}]}],
  gift:['For me? How unexpected. Come closer, darling. I would like to thank you without a riddle.','I’ll put it with the things I keep. It’s a very short list. You’re on it twice now.','Careful. You keep being sweet and I may have to stop tempting you altogether. I won’t. But I might want to.']},

 // ---------------- Jasnah (Hobbies) ----------------
 jasnah:{
  visit:[
   {open:['* Jasnah sits in the Guildhall’s reading nook behind a tower of books, gloved safehand resting on one, freehand turning pages.','You read forty pages tonight instead of watching a show. I counted. Don’t look so surprised.'],opts:[
    {t:'You counted my pages?',r:['I count everything. My mother calls it a flaw. My mother also counts everything. Sit. Tell me what you read.']},
    {t:'Only forty?',r:['Forty considered pages beat four hundred skimmed. Shallan learned that from me. Slowly. With complaints.']}]},
   {open:['* She hands you a book with a dozen slips of paper sticking out of it.','I’ve annotated it. Mostly where the author is wrong. It’s a long list. Argue with me.'],opts:[
    {t:'Argue with her.',r:['* Twenty minutes later she’s leaning across the table, eyes bright, and you’ve forgotten the book.','You’re wrong. Beautifully. Again.']},
    {t:'You’re probably right.',r:['Probably. Don’t agree with me to be pleasant. I hate pleasant. I like a mind that pushes back.']}]},
   {open:['Uncle Dalinar thinks hobbies are a luxury. He also thinks reading is something women do. I’m slowly ruining both opinions.','You learn something new every week. For fun. Do you know how rare that is in a grown man?'],opts:[
    {t:'I had a good teacher.',r:['* A tiny pause, and the corner of her mouth lifts.','Flattery. I’ll allow it. Once.']},
    {t:'Teach me something now.',r:['Ivory says I’ll talk for three hours. He’s right. Get comfortable, {name}. Closer. You’ll want to see the diagrams.']}]},
   {open:['* She closes her book, which she never does mid-chapter.','I find most people boring within ten minutes. I’ve been sitting with you for two hours. I’m trying to work out why.'],opts:[
    {t:'Any theories?',r:['Several. All of them inconvenient. One involves how you look when you’re concentrating.']},
    {t:'Maybe stop thinking.',r:['* She stares at you as if you’ve proposed setting fire to the Palanaeum.','That’s the most dangerous thing anyone has ever said to me. Say it again.']}]},
   {open:['* The Guildhall is empty. Jasnah has taken her hair down. Ivory has politely vanished.','I spend my life in other people’s words. Tonight I don’t want a book. I want the conversation.'],opts:[
    {t:'Then talk to me.',r:['* She doesn’t talk. She takes your face in her freehand and kisses you, careful and thorough, like she’s reading you.','Hm. Worth further study.','* She blows out the lamp.']},
    {t:'No books at all?',r:['None. Mark the date. It will never happen again. Unless you make it worth repeating.','* She pulls you down onto the reading couch.']}]}],
  gift:['Thoughtful. I would rather thank you than analyze why I’m smiling. Come sit beside me.','Thank you. I don’t say that often. Ask Shallan. She’ll be jealous.','It’s thoughtful. I’m annoyed at how pleased I am. Come here and let me be annoyed properly.']},

 // ---------------- Seraphine (Hobbies) ----------------
 seraphine:{
  visit:[
   {open:['* Seraphine bounces into the Guildhall with her floating soundboard humming beside her.','You practiced today! I could hear it from across the village. Your song had this little bright bit in it. So cute!'],opts:[
    {t:'You can hear my song?',r:['Everyone has one! Yours is sort of warm and steady with a drumbeat that never quits. I hum it in the shower. Is that weird? It’s weird.']},
    {t:'It was mostly mistakes.',r:['Mistakes are just notes that haven’t found friends yet! Play it again tomorrow. I’ll harmonize.']}]},
   {open:['* She’s sitting cross-legged on a Guildhall table, headphones around her neck, scribbling lyrics.','I write a little every day, even when it’s bad. Especially when it’s bad. Want to help? I need a word that rhymes with Piltover.'],opts:[
    {t:'“Still glowing over.”',r:['* She squeals and writes it down.','You’re a genius! Co-writer credit. Your name, my name, same line. I like how that looks.']},
    {t:'Nothing rhymes with Piltover.',r:['That’s what everyone says! Which is why I need you to stay here until we find one. Could take all night. Oh no.']}]},
   {open:['When I was little in Zaun, everything was so loud I couldn’t sleep. Music was the only thing that made sense of it.','Your hobby time is like that for you, isn’t it? I can hear you unclench.'],opts:[
    {t:'It really is.',r:['* She rests her head on your shoulder, humming something soft.','Then keep doing it. I like this version of your song best.']},
    {t:'You make it quieter, too.',r:['* She goes very pink.','Oh. That’s, um. That might be the nicest thing anyone’s said to me offstage.']}]},
   {open:['* She pulls you up onto the Guildhall stage, holding both your hands.','One song. Just us. No crowd. You don’t have to sing, just stand really close and look at me.'],opts:[
    {t:'Dance with her.',r:['* She spins under your arm and ends up against your chest, laughing.','Okay. That was way better than the tour. Don’t tell my manager.']},
    {t:'I can do that.',r:['* She sings, quiet, eyes on yours the whole time, and the last note shakes a little.','Your song just went really fast. So did mine. Hi.']}]},
   {open:['* The Guildhall lights are low. Seraphine sets her microphone down and takes a breath.','I’ve sung to thousands of people, {name}. I’ve never been this nervous. Your song keeps saying my name.'],opts:[
    {t:'It does.',r:['* She rises on her toes and kisses you, soft and sweet and a little shaky.','Oh. Oh, that’s the chorus. I found it.','* The soundboard dims itself, very tactfully.']},
    {t:'What does yours say?',r:['* She takes your hand and lays it on her heart. It’s racing.','That. It says that. Over and over. Stay and listen?']}]}],
  gift:['You remembered. I’m going to put this somewhere safe, then ask if I can kiss you.','Eee, thank you! I’m going to write a song about this. It’ll be super catchy. You’ll hate how catchy.','You keep spoiling me and I keep blushing. That’s the deal now, okay? Forever.']},

 // ---------------- Sona (Hobbies) ----------------
 sona:{
  visit:[
   {open:['* Sona sits by the Guildhall window, her etwahl floating before her. She plays a quick, bright phrase as you walk in, like a greeting.','* She holds up a small card in neat handwriting: You practiced today. I heard.'],opts:[
    {t:'You could hear me?',r:['* She smiles and plucks three notes that sound uncannily like your clumsy chord from this afternoon.','* Then she plays it again, fixed. Her eyes sparkle.']},
    {t:'Play me something?',r:['* She nods and plays something slow and warm. Halfway through, she looks up and doesn’t look away.']}]},
   {open:['* Sona pats the bench beside her and slides a second, smaller instrument across.','* Her note reads: Ten minutes. Every day. Not more. Just never less.'],opts:[
    {t:'Play along.',r:['* You fumble. She guides your hands with hers, patient, her shoulder pressed to yours.','* When you get it right, she claps silently and beams.']},
    {t:'Ten minutes? Easy.',r:['* She raises one eyebrow and writes: Then why did you skip Tuesday?','* You both laugh. Hers is silent, but it’s real.']}]},
   {open:['* Sona plays a melody you’ve never heard: Demacian marching tune turned soft, almost lonely.','* She writes: The Buvelles took me in. Music was my first family. You make me feel that way too.'],opts:[
    {t:'Hold her hand.',r:['* She laces her fingers through yours. The etwahl keeps playing on its own, softer now, almost shy.']},
    {t:'I’m glad you’re here.',r:['* She writes one word, then underlines it twice: Me too.']}]},
   {open:['* You find Sona alone in the Guildhall at dusk, playing for nobody. When she sees you, the music changes. It gets warmer. Teasing, even.','* She holds up a card: This one is about you. Can you tell?'],opts:[
    {t:'It sounds happy.',r:['* She shakes her head, grinning, and plays a run of notes that is unmistakably flirtatious.','* The card flips over: It sounds like wanting.']},
    {t:'Play the ending.',r:['* She leans in close and plays the last chord with her lips almost brushing your ear.','* Then she writes, slowly: The ending is up to you.']}]},
   {open:['* The Guildhall is dark. Sona sets her etwahl aside, which she never does. Without the music, she seems almost nervous.','* Her last card of the night just says: No music. Just me.'],opts:[
    {t:'Kiss her.',r:['* She kisses you back, eyes closed, and somewhere behind her the etwahl hums one soft chord on its own.','* She laughs silently against you, embarrassed, and doesn’t let go.']},
    {t:'You don’t need music.',r:['* Her eyes go bright. She takes your hand and presses it to her chest, so you can feel her heartbeat for the song.','* She leads you away from the window, into the quiet.']}]}],
  gift:['* She sets your gift beside her instrument, then writes: Thank you. May I kiss you?','* She writes your name on a card, draws a tiny heart beside it, and tucks the card into her sleeve.','* She plays a phrase you recognize: your song, the one she made up for you. This time it ends with a kiss on your cheek.']},
};

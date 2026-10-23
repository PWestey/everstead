// Fourth-wave moments, part D: Family Amah, Thalyssra, Valeera, Liadrin, Yrel, Zilyana, Ellamaria and Nieve
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Amah (Fatherhood) ----------------
 amah:{
  visit:[
  {
    "open": [
      "Come here, handsome. I’ve spent all afternoon making supper and thinking about kissing you."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. That was worth getting flour everywhere."
        ]
      },
      {
        "t": "Offer to help.",
        "r": [
          "Set two places, then come back for a proper welcome."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved the place beside me. I want your arm around me while we watch the fire."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "That’s it. I like having you right here."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Of course. I’ve been waiting for you to come within reach."
        ]
      }
    ]
  },
  {
    "open": [
      "You look good tonight. I’m taking you dancing before somebody gives us something sensible to do."
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "Good. Hold me close. This is our evening."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh, I like that plan, too. Take your time."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay for supper. Then stay for the quiet afterward. That’s the part I’ve been looking forward to with you."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Come kiss me before we sit down."
        ]
      },
      {
        "t": "Offer a walk afterward.",
        "r": [
          "Slowly. I intend to hold your hand the whole way."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m not ready for you to go. Come back here and let me enjoy you a little longer."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "That’s my favorite answer. Put your arms around me."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I’d love an evening with you to myself."
        ]
      }
    ]
  }
],
  gift:[
   'You thought of me. Sit close and let me thank you. For once, I don’t mean with another helping.',
   'For me? Not for the calves? Oh, you sweet fool. Nobody brings the mother anything. I’m keeping this by my bed.',
   '* She plants a big warm kiss on your forehead, then a smaller one, lower, near the corner of your mouth. “Don’t tell the Inn.”']},

 // ---------------- Thalyssra (Work) ----------------
 thalyssra:{
  visit:[
  {
    "open": [
      "The last report is signed. Come closer. I have been imagining your kiss through several tedious paragraphs."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "At last. A far more memorable use of my attention."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Gladly. Somewhere we can forget how many people know our names."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose wine from Suramar for tonight. I would like to share it with you, seated very close."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I intend to be rather selfish with your company."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "There. I have been looking forward to that touch."
        ]
      }
    ]
  },
  {
    "open": [
      "You are distracting me from my reading. I find myself remarkably willing to put the book away."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Closer. I want to kiss you without reaching over the cushions."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. I know a quiet place we can linger."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. Slowly. I have spent the day imagining your hands at my waist."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Yes. Exactly there. Let the next song play, too."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. An excellent revision to my plans."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want an evening with you that has no carefully scheduled ending."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come here. We can begin by forgetting the time."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I would love that. Take my hand."
        ]
      }
    ]
  }
],
  gift:[
   'Thoughtful. Come sit beside me. I would like a little time with the man who chose it.',
   'This is thoughtful. Truly. In Suramar a gift like this would come with a political motive. I hope yours does too.',
   '* She kisses you once, precisely, as if she has planned it for days. Possibly she has.']},

 // ---------------- Valeera (Discipline) ----------------
 valeera:{
  visit:[
  {
    "open": [
      "I finished my rounds. Now I want to kiss you. That’s why I’m still standing here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. I dislike wasting a clear opportunity."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. Somewhere I can have you to myself for a while."
        ]
      }
    ]
  },
  {
    "open": [
      "You look far too pleased when I take your hand. I’m going to have to do it more often."
    ],
    "opts": [
      {
        "t": "Hold her hand.",
        "r": [
          "There’s that smile. Come closer."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Gladly. I’ve been thinking about it since you arrived."
        ]
      }
    ]
  },
  {
    "open": [
      "The daggers are put away. I want a quiet evening, and I want you very much in it."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Good. Sit close enough that I can reach you."
        ]
      },
      {
        "t": "Offer a walk.",
        "r": [
          "Yes. Somewhere we can stop without an audience."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I’m interested in what you do with your hands when you stop being polite."
    ],
    "opts": [
      {
        "t": "Take her waist.",
        "r": [
          "There. That is much more promising."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. You understood perfectly."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m not finished enjoying your company, and I’ve decided to be direct about wanting more."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Good. Kiss me again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I was hoping the evening wouldn’t end here."
        ]
      }
    ]
  }
],
  gift:[
   'No trap? Good. Then I can put it down and ask for a kiss without checking the exits first.',
   'Nobody gives a rogue presents. They usually just check their pockets after I leave. Thanks. Really.',
   '* Quick as a pickpocket, she kisses your cheek, and is three shelves away before you can react.']},

 // ---------------- Liadrin (Faith) ----------------
 liadrin:{
  visit:[
  {
    "open": [
      "My duties are finished. Come here. I have wanted to kiss you since the morning watch."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. I have been patient quite long enough."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. I want the evening with you."
        ]
      }
    ]
  },
  {
    "open": [
      "I put aside my armor. Tonight I want a date, not a report. Will you join me?"
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Gladly, then. Sit beside me. I want your hand in mine."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Good. Let us go before anyone finds another duty."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at me as though you are waiting for permission to come closer. You have it."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Yes. That is where I wanted you."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Very much. Come here."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. Slowly. I would like your hands on my waist and nothing urgent between us."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "There. I can finally stop thinking about tomorrow."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "A welcome distraction. Take your time."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want the quiet with you, and I do not intend to waste it being formal."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then sit close. I have missed your arms around me."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand. I would like that very much."
        ]
      }
    ]
  }
],
  gift:[
   'You chose something for Liadrin, not the Matriarch. Thank you. Come closer, I’d like to kiss you.',
   'Silvermoon taught me to expect gifts with strings. This doesn’t have any, does it? No. I can tell.',
   '* She presses her lips to your knuckles, then lingers, eyes lifting to yours over your hand.']},

 // ---------------- Yrel (Fitness) ----------------
 yrel:{
  visit:[
  {
    "open": [
      "Training is finished. Come here. I have been looking forward to kissing you more than finishing that last drill."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. A far better ending to the afternoon."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Gladly. Let me put the mace away and enjoy your company."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved tonight for us. Supper, a walk, and perhaps very little concern about getting home quickly."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want your hand in mine."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh. Yes. I like beginning the evening this way."
        ]
      }
    ]
  },
  {
    "open": [
      "You distract me when you stand so close. I have decided to stop pretending that is a complaint."
    ],
    "opts": [
      {
        "t": "Draw her near.",
        "r": [
          "There. Now I can kiss you properly."
        ]
      },
      {
        "t": "Ask her to sit.",
        "r": [
          "Beside you. I have wanted your arm around me all day."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me? I want to feel your hands on my waist and forget the marching steps for once."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Slowly. This is much more enjoyable."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Gladly. Come closer."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a little longer. I want to enjoy being here with you without thinking about when it ends."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Thank you. Now let me kiss you again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I would love that evening together."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. I love it. Now I’d like to kiss you, if you’d welcome that.',
   'For me? I was a refugee for so long, I forgot what it was like to just be given something. Thank you.',
   '* She rises on her toes and kisses your cheek, quick and shy, and then laughs at herself for doing it.']},

 // ---------------- Zilyana (Faith) ----------------
 zilyana:{
  visit:[
  {
    "open": [
      "The drills are complete. I want your attention now, and I intend to begin by kissing you."
    ],
    "opts": [
      {
        "t": "Meet her halfway.",
        "r": [
          "Good. Decisive. I like that."
        ]
      },
      {
        "t": "Offer a walk.",
        "r": [
          "Somewhere quiet. I have had enough commands for one day."
        ]
      }
    ]
  },
  {
    "open": [
      "I set aside tonight for supper with you. Come sit where I can take your hand."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. You make this evening very easy to enjoy."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "An excellent arrival. Again, before we sit."
        ]
      }
    ]
  },
  {
    "open": [
      "You are staring. Come closer. I prefer your admiration where I can feel your arms around me."
    ],
    "opts": [
      {
        "t": "Embrace her.",
        "r": [
          "Yes. That is considerably better."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Gladly. Stay close. We are in no hurry."
        ]
      }
    ]
  },
  {
    "open": [
      "I would like another kiss. I see no reason to make that request less clear."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. I was right to ask."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Come with me. We can find somewhere to linger."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay by the fire tonight. I want your company long after the cups are empty."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Put your arm around me."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I would rather go with you than watch you leave."
        ]
      }
    ]
  }
],
  gift:[
   'A gift for me. Thank you. Stay a little. I would like to learn how to accept being wanted.',
   'A gift. For me. Not for my god. I do not know quite what to do with this feeling. Thank you.',
   '* She bows her head and touches her brow to yours, very still, for one long breath.']},

 // ---------------- Ellamaria (Home) ----------------
 ellamaria:{
  visit:[
  {
    "open": [
      "The gardeners have gone home. Come kiss me before I find another rose to fuss over instead."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Much better. I ought to dismiss everyone earlier."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Take me out. Somewhere I can enjoy being admired by you."
        ]
      }
    ]
  },
  {
    "open": [
      "I dressed for our evening. You may tell me I look lovely, preferably from much closer."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Yes. Say that again where I can kiss you afterward."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "An excellent idea. Hands on my waist, please."
        ]
      }
    ]
  },
  {
    "open": [
      "I set supper in the garden. You are sitting beside me. That part of the arrangement is important."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want to be able to reach your hand."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "A very sensible way to begin the evening."
        ]
      }
    ]
  },
  {
    "open": [
      "The court can survive without us. I want a slow walk and several stops under those trees."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "There. I have been looking forward to this all day."
        ]
      },
      {
        "t": "Ask about the stops.",
        "r": [
          "Kisses, darling. I thought I was being quite clear."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. The wine is good and your company is better. I see no reason to end either yet."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Excellent. Come within reach."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I would enjoy having you to myself a little longer."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered what I like. Put it by the roses. I would rather hold your hands while I thank you.',
   'Oh, you shouldn’t have. Really. Roald gives me jewelry. This is so much better.',
   '* She kisses your cheek and leaves a faint smudge of garden soil there. She does not apologize for it.']},

 // ---------------- Nieve (Fitness) ----------------
 nieve:{
  visit:[
  {
    "open": [
      "No assignments tonight. I want to kiss you, and I’m not making you kill anything first."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. Much better use of an evening."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Somewhere we can sit close and ignore the job board."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked us dinner. You’re my date. That look on your face tells me I should’ve asked sooner."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "There we go. I like you pleased with yourself."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Strong start. Keep that confidence."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep watching me put my gear away. Come help, and then come considerably closer."
    ],
    "opts": [
      {
        "t": "Help her finish.",
        "r": [
          "Done. Now I want those hands on my waist."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I’ve been waiting for you to say that."
        ]
      }
    ]
  },
  {
    "open": [
      "I want a quiet night. Food, a fire, and you right here beside me."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Closer. I didn’t clear the evening to sit alone."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Excellent choice. Let the fire catch while we enjoy this."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I’m having too much fun kissing you to start saying goodnight."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. I like an easy decision."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand. Let’s make the evening last."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. That’s far better than a task reward. Come here and let me thank you.',
   'This beats a rune scimitar. Don’t tell the adventurers I said that, they’d riot.',
   '* She tugs you down by the collar and kisses your cheek, hard and quick, the way she does everything.']},
};

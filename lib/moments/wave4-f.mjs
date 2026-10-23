// Fourth-wave moments, part F: Family Anna, Elsa and Helen (visits and gifts).
// See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13. Anna and Helen are married in canon: keep it warm and teasing.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Anna (Marriage) ----------------
 anna:{
  visit:[
  {
    "open": [
      "I’ve been very patient through dinner with the council. Now I want to kiss you and complain about none of it."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh, yes. Much better than complaining."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Absolutely. Somewhere nobody bows before bringing us bread."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved us the evening. Dinner, dancing, and hopefully a kiss that makes me forget what time it is."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Excellent. I like how quickly you understood the assignment."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Wow. Strong beginning. We might be late for dinner."
        ]
      }
    ]
  },
  {
    "open": [
      "Come sit beside me. I’m trying to read, but mostly I’m waiting for your arm around my shoulders."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. That’s the part I actually wanted."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes! I was trying to ask elegantly. This is faster."
        ]
      }
    ]
  },
  {
    "open": [
      "You look handsome. I thought I’d mention it before I spent another ten minutes being obvious about staring."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Oh, good. I much prefer staring from here."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Yes. Hold me properly. I’ve wanted this all afternoon."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m having too lovely an evening with you to start pretending I’m ready for goodbye."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Wonderful. Kiss me again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Let me get my coat before I invent another reason to linger."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. I love it. And I’d very much like to kiss you before I say twelve more things.',
   'For me? Really? Nobody gives the queen anything, they just give her paperwork. I love it. I love you. Not like that. Okay, a little like that.',
   '* She throws her arms around your neck and plants a quick kiss on your cheek, then pulls back, laughing. “Don’t tell Kristoff. Actually, tell him. He should step it up.”']},

 // ---------------- Elsa (Discipline) ----------------
 elsa:{
  visit:[
  {
    "open": [
      "I cleared my evening. I would like to kiss you without wondering who might interrupt us."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. That was worth setting everything aside."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. Somewhere quiet enough that we can enjoy each other."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose this dress for our date. The way you’re looking at me makes me rather glad I did."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Thank you. Come closer and say it again."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Yes. I’ve been looking forward to this all day."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. I want your arms around me, and I’m trying to become better at saying that plainly."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "Exactly. That’s what I wanted."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. Very much."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me? Slowly. I’d like to feel your hands at my waist for a whole song."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "There. Let’s stay like this for the next one, too."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh. Yes. We can let the music wait."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want tonight to last longer than a careful goodbye by the door."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come close. I have been thinking about another kiss."
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
   'You remembered. Thank you. I’d like to take your hand for a moment, if that’s all right.',
   'You didn’t have to. I’m not used to people giving me things. Usually they give me room. This is nicer.',
   '* She brushes a cool fingertip along your jaw, and a single perfect snowflake settles on your collar. “Keep that. It won’t melt unless I let it.”']},

 // ---------------- Helen (Fatherhood) ----------------
 helen:{
  visit:[
  {
    "open": [
      "I finally have a quiet evening. Come here and kiss me before I start tidying something out of habit."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. Much better use of my time."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. A proper date. I’ve been looking forward to one with you."
        ]
      }
    ]
  },
  {
    "open": [
      "I dressed up, cleared my schedule, and left the phone alone. Your part is to take my hand."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Good. Now tell me where you’re taking me."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Well, that’s a promising start. Do it again."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit close. I want your arm around me and a conversation that can wait whenever we feel like kissing."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Exactly. This is what I missed today."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. We can begin there."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I want to enjoy how handsome you look from somewhere much closer."
    ],
    "opts": [
      {
        "t": "Hold her waist.",
        "r": [
          "There. I’ve been wanting your hands right there all evening."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "Oh, I’m perfectly happy with that revision."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I’m enjoying having you to myself, and I don’t want to rush the evening."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come sit beside me. The dishes can wait."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. Take my hand and let’s go together."
        ]
      }
    ]
  }
],
  gift:[
   'For me? That’s lovely. Come here, I want to kiss you before the kettle or somebody’s shoes interrupts us.',
   'For me? Not for the kids, not for the house? Huh. I forgot what that feels like. Thank you.',
   '* She pulls you into a hug, warm and a bit longer than polite, and her voice drops near your ear. “If anyone asks, I hugged you for the kids.”']},
};

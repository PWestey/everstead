// Fourth-wave moments, part H: Family Emma, Jubilee and Kamala (visits and gifts). See docs/WRITING-BRIEF.md.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Emma (Work) ----------------
 emma:{
  visit:[
  {
    "open": [
      "Darling, close the book. I’ve been patient about wanting to kiss you, and patience is losing its appeal."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Much better. You do learn quickly."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. Somewhere I can enjoy you without being interrupted."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose this dress for our evening. You may stop being discreet about admiring it."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Closer, darling. I want to hear that against my ear."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Hands on my waist. Yes. Exactly there."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at my mouth. Shall we save time and admit what we both want?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. An excellent use of our time."
        ]
      },
      {
        "t": "Draw her close.",
        "r": [
          "There. Now let me show you how pleased I am."
        ]
      }
    ]
  },
  {
    "open": [
      "I canceled my evening appointments. I want wine, your arms around me, and no polite distance whatsoever."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Good. Come closer. I cleared this evening for a reason."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Yes. That is precisely how I wanted to begin."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I haven’t had enough of your company, and I certainly haven’t had enough of your kisses."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "A wise decision. Come here."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Gladly. I was beginning to wonder when you’d ask."
        ]
      }
    ]
  }
],
  gift:[
   'You listened. That is far rarer than good taste. Come closer, darling. I intend to thank you.',
   'Well. You have taste after all. I was beginning to worry I’d have to teach that too.',
   '* She leans in and kisses your cheek, slow and cool, then murmurs against your ear. “Don’t tell anyone I liked it.”']},

 // ---------------- Jubilee (Hobbies) ----------------
 jubilee:{
  visit:[
  {
    "open": [
      "Studio’s closed. I want to kiss you before I get distracted pretending I need to tidy something."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh, yeah. Much better use of my hands."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes! A real date. I’ve been hoping you’d say that."
        ]
      }
    ]
  },
  {
    "open": [
      "I got us a table after the show. Sit beside me. I want to flirt without shouting over everybody."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Great. I’ve been smiling about this all day."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Excellent. Very strong start to the evening."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at me like that. Come closer so I can enjoy it without squinting."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. Now put your arms around me."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Thanks. You look pretty amazing from this distance, too."
        ]
      }
    ]
  },
  {
    "open": [
      "No audience tonight. Just music and your hands on my waist. Sound good?"
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Really good. Stay close. I like this pace."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "Also an excellent plan. We can dance later."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want a whole evening with you, not five minutes by the door."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here. I’ve been thinking about your kiss all afternoon."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Let me grab my jacket. I want more of tonight, too."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. I love it. I’d like to kiss you, if you’d like that too. No fireworks necessary.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Kamala (Faith) ----------------
 kamala:{
  visit:[
  {
    "open": [
      "I finished the article. Now I’d really like to kiss you, if you’d come over here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh. Yes. That was worth finally saying out loud."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Absolutely. Let me put the work away and give you my full attention."
        ]
      }
    ]
  },
  {
    "open": [
      "I planned dinner for us. A proper date. I want to enjoy your company without pretending we just happened to meet."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’ve been looking forward to this all day."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "There. That’s already making me smile more than is reasonable."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me from my notes. I think I’d rather sit beside you and enjoy that."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Closer. I want your arm around me."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. That’s definitely the direction my thoughts were going."
        ]
      }
    ]
  },
  {
    "open": [
      "Walk with me? I want your hand in mine and a quiet place where I can kiss you goodnight very slowly."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Perfect. No rushing. I’m enjoying tonight too much."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh, that works, too. We can leave in a minute."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay for another cup. I want more time with you, and I’m trying to stop hiding that behind being polite."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come sit close. I’ve missed you today."
        ]
      },
      {
        "t": "Invite her on a date.",
        "r": [
          "Tomorrow? Yes. I’d like that very much."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. That means a lot. Would you stay for tea? I’d like to ask you on a proper date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},
};

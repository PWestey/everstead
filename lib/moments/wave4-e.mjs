// Fourth-wave moments, part E: Family Poppy (Fitness), Lulu (Hobbies) and Syl (Discipline) (visits and gifts).
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Poppy (Fitness) ----------------
 poppy:{
  visit:[
  {
    "open": [
      "I set the hammer down. Now I’d like to kiss you. Been thinking about it all afternoon, actually."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "That was worth saying out loud."
        ]
      },
      {
        "t": "Offer her a date.",
        "r": [
          "Yes. A real evening off. With you. I’d like that."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved us a table. Sit beside me. I want to hold your hand while we eat."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Good. I’ve been looking forward to this more than I expected."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Oh. Yes. We should start our evenings like that."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep smiling at me. Come closer so I can stop wondering what it would be like to kiss that smile."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. That’s much better."
        ]
      },
      {
        "t": "Ask her to walk.",
        "r": [
          "Sure. Somewhere we can sit together when we get tired."
        ]
      }
    ]
  },
  {
    "open": [
      "No quest tonight. I want a fire, a good supper, and your arms around me afterward."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I can stop inventing reasons for you to stay."
        ]
      },
      {
        "t": "Embrace her.",
        "r": [
          "Yes. Exactly that. Hold on a little longer."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’ve spent enough years rushing off toward the next thing. I want to enjoy tonight with you."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Then let me kiss you again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. Take my hand."
        ]
      }
    ]
  }
],
  gift:[
   'You chose this for me. Thank you. Would you stay for dinner? I’d like that to be a date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Lulu (Hobbies) ----------------
 lulu:{
  visit:[
  {
    "open": [
      "I’ve sent Pix to the garden. I want to kiss you without a glowing spectator grading the technique."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. Excellent. No audience required."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Somewhere quiet. I want to enjoy you without competition from floating furniture."
        ]
      }
    ]
  },
  {
    "open": [
      "I made supper for two. It’s ordinary supper. My intentions about sitting beside you are considerably less ordinary."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. I can reach your hand and your mouth. A sensible arrangement."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Lovely. I was hoping you’d begin there."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve distracted me from a perfectly good enchantment. Come closer and take responsibility for being so appealing."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "Good. Now put your arms around me."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. Slowly. Let the lights move around us for once."
        ]
      }
    ]
  },
  {
    "open": [
      "I could keep the lanterns glowing all night. Will you stay and help me enjoy them?"
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come here. I want another kiss in this lovely light."
        ]
      },
      {
        "t": "Invite her beside you.",
        "r": [
          "Oh, yes. I’ve been looking forward to being held by you."
        ]
      }
    ]
  },
  {
    "open": [
      "No tricks tonight. I want your company, your hand in mine, and plenty of time to kiss you."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Wonderful. There is something delicious about a simple plan that works."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. Already my favorite part of the evening."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. How lovely. Let me put this down so I can give you a proper thank-you kiss.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Syl (Discipline) ----------------
 syl:{
  visit:[
  {
    "open": [
      "I want to kiss you. I thought about making a clever remark first, but this seemed more useful."
    ],
    "opts": [
      {
        "t": "Say yes.",
        "r": [
          "Good. Come closer. I’ve wanted to do this since you arrived."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "There. I like being able to hold onto you."
        ]
      }
    ]
  },
  {
    "open": [
      "I picked a quiet place above the river. Come on a date with me. I want you to myself tonight."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Excellent. I have no intention of keeping a polite distance."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh, that’s a lovely beginning. We can leave in a minute."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep smiling at me. I’d like to sit close enough to find out what happens when I smile back."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. Now put your arm around me."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. Exactly the question I was hoping for."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I want your hands on my waist, and I want to stop talking long enough to enjoy it."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Good. Slowly. I’m fond of this part."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "That works, too. Very well, actually."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a little longer. I’m happy here with you, and I want another kiss before we think about leaving."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come close. We have time."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand. I’d like the rest of the evening with you."
        ]
      }
    ]
  }
],
  gift:[
   'You thought of me. I love that. I’d like an evening with you, too. Shall we call it a date?',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']}
};

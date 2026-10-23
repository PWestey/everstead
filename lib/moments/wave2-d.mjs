// Family "visit" and "gift" moments, wave 2 part D: Megan, Leia, Hermione, Ana.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Megan’s dialogue is warm, affectionate and non-explicit.
// Hermione is written strictly as an adult in her Ministry years.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 megan:{
  visit:[
  {
    "open": [
      "Come here. I’ve been looking forward to a proper kiss from you all day."
    ],
    "opts": [
      {
        "t": "Kiss her hello.",
        "r": [
          "There you are. That was much better than waving across the room."
        ]
      },
      {
        "t": "Hold her close.",
        "r": [
          "Oh, I needed this. Stay right here a minute."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved us the evening. Dinner, a walk, and my hand in yours. How does that sound?"
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "Like this. Exactly like this. I’ve missed having you to myself."
        ]
      },
      {
        "t": "Ask her to dance first.",
        "r": [
          "Here in the kitchen? Yes. Dinner can wait one song."
        ]
      }
    ]
  },
  {
    "open": [
      "You look handsome. I was going to be subtle about staring, but that seems like wasted effort."
    ],
    "opts": [
      {
        "t": "Tell her she’s beautiful.",
        "r": [
          "Thank you, sweetheart. Come say it closer."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Yes, please. Then another, if we’re making plans."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. I want to hear about your day with your arm around me."
    ],
    "opts": [
      {
        "t": "Settle in together.",
        "r": [
          "That’s better. Start anywhere. I’m happy we have this time."
        ]
      },
      {
        "t": "Ask about her day first.",
        "r": [
          "The best part just walked in and sat down with me."
        ]
      }
    ]
  },
  {
    "open": [
      "I love these quiet evenings with you. Walk me home slowly?"
    ],
    "opts": [
      {
        "t": "Take the long way.",
        "r": [
          "Good choice. We can stop under that tree for a kiss."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "My favorite company. Let’s make the evening last."
        ]
      }
    ]
  }
],
  gift:['You remembered what I like. Let me put this down so I can kiss you properly.','This is so thoughtful. Keep spoiling me like this and I’m going to start expecting it.','For me? You sweet man. Come here, that’s worth a kiss on the cheek.']},

 leia:{
  visit:[
  {
    "open": [
      "I’m off duty. If you’ve come to give me a report, reconsider. If you’ve come to kiss me, get over here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Finally. Somebody with a useful proposal."
        ]
      },
      {
        "t": "Offer dinner.",
        "r": [
          "Yes. And you’re sitting close enough that I don’t have to raise my voice."
        ]
      }
    ]
  },
  {
    "open": [
      "I canceled supper with the committee. I’d rather spend it with you. Try to look pleased, flyboy."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "There’s that smile. Much better company already."
        ]
      },
      {
        "t": "Ask for a kiss first.",
        "r": [
          "You’re getting confident. I like it."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been leaning against that door looking handsome for five minutes. Come inside and be distracting properly."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "Good. Now close the distance the rest of the way."
        ]
      },
      {
        "t": "Invite her out.",
        "r": [
          "Somewhere quiet. I’ve had enough people asking things of me today."
        ]
      }
    ]
  },
  {
    "open": [
      "No urgent messages. No droids. Just a dance with you, if you can manage to put your hands on my waist."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "See? You follow instructions beautifully when you feel like it."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "That wasn’t the instruction. It was, however, a very good idea."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m not ready to say goodnight. Sit down. You can argue if you insist, but I’d rather kiss you."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Good choice. Come closer."
        ]
      },
      {
        "t": "Tell her you agree.",
        "r": [
          "Then stop standing by the door as though you’re being polite."
        ]
      }
    ]
  }
],
  gift:['You remembered. Set it down a second. I’ve got a thank-you you won’t need to file.','I don’t need presents. I’ll keep this one, though. And you, apparently.','Well, look at you. Somebody figured out how to impress a princess. It’s rarer than you’d think.']},

 hermione:{
  visit:[
  {
    "open": [
      "I’ve closed the files. If you ask about my work now, I shall be cross. If you kiss me, considerably less so."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Much better. I’ve wanted that through two committee meetings."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. Somewhere we can sit close and discuss absolutely nothing urgent."
        ]
      }
    ]
  },
  {
    "open": [
      "I keep losing my place when you stand behind me. Turn my chair around. I’d rather look at you."
    ],
    "opts": [
      {
        "t": "Turn toward her.",
        "r": [
          "There. That’s much more interesting than the paragraph."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I was trying to make that fairly obvious."
        ]
      }
    ]
  },
  {
    "open": [
      "I cleared tonight on purpose. I want a date with you, and I don’t intend to bring a book."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. I intend to hold onto it for quite a while."
        ]
      },
      {
        "t": "Suggest staying in.",
        "r": [
          "All right. But we’re sitting together. I have very specific intentions about that."
        ]
      }
    ]
  },
  {
    "open": [
      "You needn’t invent a question to come closer. I’m perfectly happy for you to want to kiss me."
    ],
    "opts": [
      {
        "t": "Admit you do.",
        "r": [
          "Good. So do I. That simplifies matters enormously."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Yes. Sit beside me. I’ve missed this today."
        ]
      }
    ]
  },
  {
    "open": [
      "The Ministry can survive until morning. I want you to stay, and I want another kiss before supper."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Splendid. Come here, then. We’ve wasted quite enough time being busy."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. I should be this decisive more often."
        ]
      }
    ]
  }
],
  gift:['You listened. That’s maddeningly attractive. Put it down before I make a speech instead of kissing you.','A gift? I had today scheduled to the quarter hour and you’ve just ruined it. Thank you.','This is perfect. I’m going to research exactly how to thank you. Thoroughly.']},

 ana:{
  visit:[
  {
    "open": [
      "I’ve put the wand down. Now I can kiss you without accidentally setting off fireworks. Interested?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Brilliant. Still might be fireworks. No promises."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Absolutely. Somewhere we can linger afterward."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked us a table. Yes, a date. I thought I’d make my intentions wonderfully obvious."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Look at us. Almost respectable. Kiss me before we go."
        ]
      },
      {
        "t": "Ask about her intentions.",
        "r": [
          "Dinner with you. Dancing with you. Getting you to stop standing so far away."
        ]
      }
    ]
  },
  {
    "open": [
      "Come sit beside me. I’m trying to draw, but I’d rather have your arm around me."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "That’s it. The sketch can wait until I’ve kissed you hello."
        ]
      },
      {
        "t": "Ask to see the sketch.",
        "r": [
          "Afterward. Right now I want to look at the original."
        ]
      }
    ]
  },
  {
    "open": [
      "The music’s terrible. Dance with me anyway. I’ve been wanting your hands on my waist all evening."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "There. Suddenly I have no complaints about the music."
        ]
      },
      {
        "t": "Suggest somewhere quieter.",
        "r": [
          "Yes. Take my hand. I’ve a much better use for the quiet."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay for supper. Then stay longer. I’m enjoying this far too much to pretend I’m ready for goodnight."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’ll stop planning clever excuses and just kiss you."
        ]
      },
      {
        "t": "Offer to help cook.",
        "r": [
          "Together. We’ll see how much actual cooking gets done between interruptions."
        ]
      }
    ]
  }
],
  gift:['You remembered. Excellent. I was hoping for a reason to kiss you, and this is a very good one.','Oh, this is brilliant! I’m showing it off to the whole Guildhall. And you with it.','A present? Right. Now I have to top it. Prepare to be outdone, mister.']},
};

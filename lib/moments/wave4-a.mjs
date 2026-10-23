// Fourth-wave moments, part A: Family Lilian, Morgana, Soraka (Faith), Alexstrasza, Amara, Ashe, Navani (Marriage)
// and Draka (Fatherhood). Visits and gifts. See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.
// Navani (Dalinar) and Amara (Bernard) are married in canon: warm and teasing, husbands acknowledged.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Lilian (Faith) ----------------
 lilian:{
  visit:[
  {
    "open": [
      "I’ve put the knives away. Come sit with me. I want a kiss, and I’d rather ask than keep watching your mouth."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That was worth asking for."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Stay close. I’ve had enough solitude for tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I found somewhere quiet for supper. No questions, no staring. Just you and me."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want an evening where I can enjoy wanting you."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. I like having something to hold onto that I chose."
        ]
      }
    ]
  },
  {
    "open": [
      "You needn’t treat me as fragile. Put your arms around me. I want you here."
    ],
    "opts": [
      {
        "t": "Embrace her.",
        "r": [
          "There. That is what I was asking for."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. Slowly. We have time tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay by the fire with me. I’ve been looking forward to having you close all day."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "Closer. I want to feel your hand in mine."
        ]
      },
      {
        "t": "Invite her to walk.",
        "r": [
          "With you? Yes. We can find somewhere to linger."
        ]
      }
    ]
  },
  {
    "open": [
      "I don’t want a brief goodnight. I want another hour with you. Perhaps several."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here and kiss me again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. Let me get my coat."
        ]
      }
    ]
  }
],
  gift:['You remembered. I’m keeping this. I’d also like a kiss, if you’re offering. Words are difficult tonight.','Hm. Sharp, useful, not frilly. You actually know me. That’s dangerous.','I’ll keep it on me. Right here, by the daggers. Highest honor I’ve got.']},

 // ---------------- Morgana (Faith) ----------------
 morgana:{
  visit:[
  {
    "open": [
      "Come closer. I have been thinking about your kiss while pretending to read this same page."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. At last, a reason to close the book."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Sit with me. I want your company without the pretense."
        ]
      }
    ]
  },
  {
    "open": [
      "I set two places beneath the willow. Will you have supper with a woman who wants you entirely to herself?"
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Let the rest of the world find us tomorrow."
        ]
      },
      {
        "t": "Ask for a kiss first.",
        "r": [
          "An excellent beginning. Come within reach."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at my wings as though they might frighten you away. I would rather you looked at my mouth."
    ],
    "opts": [
      {
        "t": "Meet her gaze.",
        "r": [
          "Yes. Now you understand what I am inviting."
        ]
      },
      {
        "t": "Ask to hold her.",
        "r": [
          "Gladly. There is room for you here."
        ]
      }
    ]
  },
  {
    "open": [
      "The candles are lit. I want a slow dance and your hands steady at my waist."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Stay close. I have been patient enough today."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "Mm. I can be persuaded to change my plans."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I have no wish to turn this evening into another memory of watching you leave."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Then let me kiss you without wondering how soon it ends."
        ]
      },
      {
        "t": "Offer her your arm.",
        "r": [
          "Take me somewhere quiet. I want more time with you."
        ]
      }
    ]
  }
],
  gift:['A gift for me. Thank you. Stay a little. I would like to give you something of my own time.','Oh. It’s lovely. I’ll put it on the altar. No, beside the altar. Next to my heart, then.','Grace, given freely. You’re starting to sound like me. I like it far too much.']},

 // ---------------- Soraka (Faith) ----------------
 soraka:{
  visit:[
  {
    "open": [
      "I have tended everyone who needed me today. Now I want to sit beside you and be kissed."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. I have been looking forward to this small selfishness."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That is exactly what I meant."
        ]
      }
    ]
  },
  {
    "open": [
      "Walk with me beneath the stars? I want to hold your hand without a destination waiting for us."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Warm. I like the way you reach for me."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. We may find reasons to stop quite often."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep smiling at me. Come closer so I can enjoy what that smile promises."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "There you are. Kiss me slowly."
        ]
      },
      {
        "t": "Tell her she’s beautiful.",
        "r": [
          "Thank you. I rather enjoy hearing that from so near."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved the evening for us. Tea, supper, and the pleasure of having you within reach."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit beside me. I want your arm around me."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Gladly. Let the tea cool a little."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a while longer. I enjoy wanting you, but I enjoy holding you even more."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come here. We have no reason to hurry."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. I was hoping you would."
        ]
      }
    ]
  }
],
  gift:['You thought of me. I’ve been thinking of you, too. Would you stay long enough for me to say how much?','You remembered I like small things. That’s the nicest kind of remembering.','I’ll make a wish on it tonight. No, I won’t tell you. Fine, it was about you.']},

 // ---------------- Alexstrasza (Marriage) ----------------
 alexstrasza:{
  visit:[
  {
    "open": [
      "Come here. I have spent the day caring for everyone, and now I want the pleasure of kissing you."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. I should have claimed this moment sooner."
        ]
      },
      {
        "t": "Offer an embrace.",
        "r": [
          "Yes. Hold me close. I have missed your warmth."
        ]
      }
    ]
  },
  {
    "open": [
      "I set supper in the garden. Will you sit beside me and let me be shameless about enjoying you?"
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want an evening full of exactly that smile."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "There. Now I have you where I wanted you."
        ]
      }
    ]
  },
  {
    "open": [
      "You admire me from such a distance. Come closer. I want to feel your hands on my waist."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Better. Now kiss me as though you meant that look."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Gladly. Slowly, so I can enjoy being held by you."
        ]
      }
    ]
  },
  {
    "open": [
      "Tonight is ours. I want wine, laughter, and kisses we need not interrupt for anyone."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "Then sit here. I have made room for you against me."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Yes. That is how I hoped we would begin."
        ]
      }
    ]
  },
  {
    "open": [
      "I am not ready to let you go. Stay for another cup, another kiss, whatever excuse pleases you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. I prefer you to every excuse we might invent."
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
  gift:['You remembered what delights me. Come closer. I would like to thank the man, not admire the wrapping.','Oh, how warm. You give like a red dragon. I may have to adopt you into the flight.','I will keep it in Valdrakken, where the sun hits first. And think of you each morning.']},

 // ---------------- Amara (Marriage) ----------------
 amara:{
  visit:[
  {
    "open": [
      "I finished the dispatch. Come here before another arrives. I have been thinking about kissing you for hours."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. That is a much better use of my attention."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. Somewhere nobody delivers messages."
        ]
      }
    ]
  },
  {
    "open": [
      "I want supper with you tonight. No reports, no secrets. Just a date I have been looking forward to."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit beside me. I intend to keep hold of your hand."
        ]
      },
      {
        "t": "Ask about afterward.",
        "r": [
          "A quiet walk home, with very little urgency."
        ]
      }
    ]
  },
  {
    "open": [
      "You look particularly handsome with your sleeves rolled up. I thought you deserved to know why I was staring."
    ],
    "opts": [
      {
        "t": "Step closer.",
        "r": [
          "Yes. This improves the view considerably."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Gladly. I have been wanting your arms around me all day."
        ]
      }
    ]
  },
  {
    "open": [
      "I can hear the wind at the shutters. Let it blow. I would rather stay here kissing you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come closer. I am finally off duty."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Exactly. You understood me perfectly."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want an evening long enough that neither of us keeps watching the door."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. The dishes can wait while I kiss you hello."
        ]
      },
      {
        "t": "Offer to cook together.",
        "r": [
          "I would like that. Especially the part where you stand beside me."
        ]
      }
    ]
  }
],
  gift:['No political motive, no hidden request. Just something you thought I’d like. Come here, you’ve succeeded.','It’s lovely. Bernard will be jealous. Good. It keeps him interesting.','I’ll wear it on my next mission. If it gets me killed, I’m haunting you specifically.']},

 // ---------------- Ashe (Marriage) ----------------
 ashe:{
  visit:[
  {
    "open": [
      "The council is finished. Come closer. I would rather feel your hands on my waist than hold another petition."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Yes. I have wanted this through a very long afternoon."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Gladly. Tonight I want to be held, not consulted."
        ]
      }
    ]
  },
  {
    "open": [
      "I have a fire, wine, and an evening I intend to spend with you. Will you join me?"
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit where I can reach you."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "An excellent answer. I may ask again."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at me when you think I am busy. Come here and let me enjoy it openly."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. Now kiss me."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Take me out beneath the stars. I want the quiet with you."
        ]
      }
    ]
  },
  {
    "open": [
      "I want supper with you alone. Let someone else decide the seating of every visiting lord."
    ],
    "opts": [
      {
        "t": "Offer a date.",
        "r": [
          "Yes. You beside me. That is the only arrangement I care about."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Good. I was hoping we could leave together."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay close tonight. I have given enough of my day away. I want this part for us."
    ],
    "opts": [
      {
        "t": "Embrace her.",
        "r": [
          "There. Let the rest of it wait."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. Slowly. We have earned an unhurried evening."
        ]
      }
    ]
  }
],
  gift:['Well chosen. Set it by the fire. I’d rather have your hand in mine while I thank you.','It’s good work. Practical. You understand me better than half my war council.','I’ll keep it with Avarosa’s bow. Don’t let it go to your head. Okay. A little.']},

 // ---------------- Navani (Marriage) ----------------
 navani:{
  visit:[
  {
    "open": [
      "I have put down the fabrial. You may now kiss me without competing with a particularly stubborn gemstone."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Ah. A far better reason to lose track of time."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. Somewhere I can enjoy looking at you without a workbench between us."
        ]
      }
    ]
  },
  {
    "open": [
      "I wore this for our evening. I should like a more personal response than an assessment of the stitching."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Come closer and say that again."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Good. Put your hands here. That is much more promising."
        ]
      }
    ]
  },
  {
    "open": [
      "You leaning over my shoulder is distracting. I am considering abandoning the entire experiment for you."
    ],
    "opts": [
      {
        "t": "Encourage her.",
        "r": [
          "Very persuasive. Put the notes aside and kiss me."
        ]
      },
      {
        "t": "Offer to help.",
        "r": [
          "Lock the workshop. That would help enormously."
        ]
      }
    ]
  },
  {
    "open": [
      "I want supper, wine, and your arm around me. I have been admirably specific, I think."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Then stop standing by the door. Come here."
        ]
      },
      {
        "t": "Ask about later.",
        "r": [
          "I intend to enjoy your company for considerably longer than supper."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I have no desire to spend the next hour wishing I had asked you for another kiss."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. Decisiveness is such an attractive quality."
        ]
      },
      {
        "t": "Settle beside her.",
        "r": [
          "Closer. I was quite serious about wanting you here."
        ]
      }
    ]
  }
],
  gift:['You remembered. Come sit beside me. I’d like to inspect your excellent judgment at closer range.','Oh, this is lovely. Dalinar will ask where it came from. I’ll tell him a charming man. Let him wonder.','I’ll mount it in my workshop where I can see it. Inspiration, you understand. Purely scientific.']},

 // ---------------- Draka (Fatherhood) ----------------
 draka:{
  visit:[
  {
    "open": [
      "The day’s work is finished. Come here. I want a kiss from you before anyone finds another task."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. Strong arms. Put them around me."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. I have wanted you beside me all afternoon."
        ]
      }
    ]
  },
  {
    "open": [
      "I cooked enough for two. Sit close. I did not invite you so I could admire you across the room."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "Better. I enjoy having you within reach."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "A sensible way to begin supper."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at me like that every time I put down my axe. Tell me what you want."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. Ask sooner next time."
        ]
      },
      {
        "t": "Draw her into an embrace.",
        "r": [
          "That is clear enough. Hold me a while."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. We have faced harder things than enjoying an evening together."
    ],
    "opts": [
      {
        "t": "Take her waist.",
        "r": [
          "There. Stay close. I like feeling you relax."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Gladly. We can dance afterward."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay by the fire. I want your company tonight, and I have no intention of hiding it."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come back within reach."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I would enjoy a long evening with you."
        ]
      }
    ]
  }
],
  gift:['A gift for me. Good. I have been wanting a reason to invite you closer. Stay by the fire.','Good, strong work. I’ll show it to the cubs and tell them a good father made it.','I will keep it by my axe. The two things I trust most, side by side.']},
};

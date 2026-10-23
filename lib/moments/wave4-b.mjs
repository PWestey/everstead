// Fourth-wave moments, part B: Family Moira, Quinn, Samira, Vi, Kelsey, Sarah (Miss Fortune), Talanji and Maggie
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Moira (Fatherhood) ----------------
 moira:{
  visit:[
  {
    "open": [
      "The council can wait until morning. Come here. I’ve wanted to kiss you through the last three arguments."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Now that is a useful contribution."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Gladly. Somewhere nobody addresses me from the other end of a throne room."
        ]
      }
    ]
  },
  {
    "open": [
      "I cleared tonight for us. Supper, wine, and you sitting close enough that I can reach your hand."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Don’t make me negotiate for the kiss as well."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "There. I like a man who knows when to get moving."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re staring at me. I’m choosing to take it as an invitation. Shall I?"
    ],
    "opts": [
      {
        "t": "Invite her closer.",
        "r": [
          "I thought so. Put your hands on my waist."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. Slowly. I want to enjoy this dress and your attention."
        ]
      }
    ]
  },
  {
    "open": [
      "I have heard everyone’s demands today. Mine is simple: I want another evening with you."
    ],
    "opts": [
      {
        "t": "Promise her the evening.",
        "r": [
          "Then come here. I intend to start enjoying it now."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. That makes a very convincing promise."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. We have good wine and an empty schedule. I’m not wasting either by saying goodnight yet."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Closer. That’s the whole point."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. I’ve been thinking about the last one."
        ]
      }
    ]
  }
],
  gift:[
   'For me, then. You do know how to make a queen smile. Come here and let me thank you.',
   'For me? Not for Dagran? Huh. It’s been a long while since anyone remembered I’m more than a mother. Thank you.',
   '* She kisses your cheek, quick, and pretends very hard it was an accident of the firelight.']},

 // ---------------- Quinn (Fitness) ----------------
 quinn:{
  visit:[
  {
    "open": [
      "Patrol’s done. I found a quiet place for us, and I want to kiss you when we get there."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Good. No racing tonight. I want you close."
        ]
      },
      {
        "t": "Ask why wait.",
        "r": [
          "Fair question. Come here."
        ]
      }
    ]
  },
  {
    "open": [
      "Valor’s settled for the night. I’m taking you to supper, if you’re interested in a very obvious date."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Great. I’m tired of pretending these walks are accidental."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "I like that. Keep it there a while."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep making me forget what I was saying. Sit beside me and let me enjoy the distraction."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. Now I can kiss you instead of losing my place."
        ]
      },
      {
        "t": "Ask what she wants.",
        "r": [
          "Your arms around me. No patrol route to finish."
        ]
      }
    ]
  },
  {
    "open": [
      "I want a slow evening. Fire, food, you. Especially you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Take off your coat and come closer."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "That’s the part I was looking forward to."
        ]
      }
    ]
  },
  {
    "open": [
      "Don’t rush off. I’ve spent the day covering miles. I want the rest of it right here with you."
    ],
    "opts": [
      {
        "t": "Hold her close.",
        "r": [
          "Yes. Exactly this."
        ]
      },
      {
        "t": "Offer a quiet walk.",
        "r": [
          "As long as we stop often. I have plans for those stops."
        ]
      }
    ]
  }
],
  gift:[
   'I’ll keep it in my pack. Come walk with me. I’d like to thank you where Valor isn’t commenting.',
   'You didn’t have to. I mean it. But I’m keeping it. It goes in the pack I never take off.',
   '* She squeezes your hand, quick and hard, like a ranger’s promise. Then she doesn’t let go right away.']},

 // ---------------- Samira (Fitness) ----------------
 samira:{
  visit:[
  {
    "open": [
      "You’ve watched me shoot. Now come closer and give me something else to enjoy."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Ha. Good. I like that confidence."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Bring that look with you. It suits you."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked us dinner. Wear something you like. I intend to be seen admiring you."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Beautiful. Let’s make an evening of it."
        ]
      },
      {
        "t": "Ask about afterward.",
        "r": [
          "Dancing. Then somewhere quieter, if you want more of my company."
        ]
      }
    ]
  },
  {
    "open": [
      "The pistols are put away. You have my full attention. What are you going to do with it?"
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Oh, I like you decisive. Kiss me."
        ]
      },
      {
        "t": "Invite her to dance.",
        "r": [
          "Hands here. Stay close. This is my favorite pace tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I want a kiss that makes us forget the music. Care to help?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That is exactly the spirit."
        ]
      },
      {
        "t": "Pull her onto the sofa beside you.",
        "r": [
          "Also promising. Come closer and make your case."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay with me. The evening’s young, and I haven’t had nearly enough of you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. I was hoping you’d be selfish about this, too."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Mm. Keep making offers like that."
        ]
      }
    ]
  }
],
  gift:[
   'Now that has style. So does the man who brought it. Come closer and let me appreciate both.',
   'Oh, that’s got style. You’ve got taste after all. I knew there was a reason I kept looking.',
   '* She blows you a kiss with a flick of her fingers, and then, as you turn, a real one lands on your cheek.']},

 // ---------------- Vi (Fitness) ----------------
 vi:{
  visit:[
  {
    "open": [
      "Gauntlets off. Shift over. Come here, I’ve been wanting to kiss you all damn day."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yeah. That’s what I needed."
        ]
      },
      {
        "t": "Open your arms.",
        "r": [
          "Best offer I’ve had since breakfast."
        ]
      }
    ]
  },
  {
    "open": [
      "I cleaned up for our date. You gonna keep staring, or take my hand and enjoy the view up close?"
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "There we go. You look good beside me."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Thanks. Come say it where I can kiss you afterward."
        ]
      }
    ]
  },
  {
    "open": [
      "Scoot over. I want your arm around me and a night where nobody needs punching."
    ],
    "opts": [
      {
        "t": "Make room.",
        "r": [
          "Perfect. Now you’re getting it."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh, we’re starting there? Great choice."
        ]
      }
    ]
  },
  {
    "open": [
      "I keep thinking about the way you kissed me. You free to help with a repeat performance?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yep. Still works. Definitely still works."
        ]
      },
      {
        "t": "Invite her out.",
        "r": [
          "Sure. Somewhere I can sit right next to you."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after dinner. I want more of you than a quick kiss at the door."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here. Let’s get comfortable."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Slow one? Yeah. Put your hands on my waist."
        ]
      }
    ]
  }
],
  gift:[
   'Nobody usually gets me things. Let me try this properly: thank you. Can I kiss you?',
   'Huh. Nobody gives me stuff unless it’s a warrant. I’m keeping this. Don’t make it weird.',
   '* She punches your shoulder, light for her, then hooks a finger in your collar and kisses your cheek. Fast. Like it never happened.']},

 // ---------------- Kelsey (Work) ----------------
 kelsey:{
  visit:[
  {
    "open": [
      "The gadgets are switched off. Now I can kiss you without accidentally launching anything. Come here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Excellent. Best use of a safety protocol all day."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes! A date with no mission briefing. How luxurious."
        ]
      }
    ]
  },
  {
    "open": [
      "I planned supper for two. Very sophisticated operation. Your role involves holding my hand."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Flawless execution. I knew I picked the right partner."
        ]
      },
      {
        "t": "Ask about the next step.",
        "r": [
          "Kiss me. I left plenty of room in the schedule."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me from this lock. I could put it down and enjoy being distracted properly."
    ],
    "opts": [
      {
        "t": "Encourage her.",
        "r": [
          "Tools away. Come closer."
        ]
      },
      {
        "t": "Offer your arms.",
        "r": [
          "Oh, I like that plan. Hold me a while."
        ]
      }
    ]
  },
  {
    "open": [
      "No assignments tonight. I want music, your hands on my waist, and absolutely no hidden compartments."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "There. This is much better than a briefing."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "An excellent surprise. I approve of your initiative."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’ve been looking forward to having you to myself, and I’m not finished enjoying it."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Good. Scoot closer. I want another kiss."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Let me lock the workshop. Thoroughly this time."
        ]
      }
    ]
  }
],
  gift:[
   'A gift with no mission attached. I like that. Come sit at my height so I can thank you properly.',
   'For me? No mission attached? No catch? You’re either very sweet or a very good spy. I hope both.',
   '* She climbs onto the crate beside you to get the height right, and plants a kiss on your cheek. Mission accomplished.']},

 // ---------------- Sarah Fortune (Work) ----------------
 missfortune:{
  visit:[
  {
    "open": [
      "The crew’s ashore. Come closer, handsome. I’ve been thinking about what I’d do with an uninterrupted evening."
    ],
    "opts": [
      {
        "t": "Ask what she wants.",
        "r": [
          "You beside me. Your hands on my waist. A very long kiss."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Now that’s the sort of initiative I appreciate."
        ]
      }
    ]
  },
  {
    "open": [
      "I reserved a table overlooking the harbor. You’re my date. Try not to spend the whole evening looking at ships."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Good. I intend to be rather distracting."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Come say it closer. I want to enjoy that smile properly."
        ]
      }
    ]
  },
  {
    "open": [
      "Put the ledger down. I’ve made enough money today. I’d rather spend my attention on you."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "There. Much better company than numbers."
        ]
      },
      {
        "t": "Invite her to dance.",
        "r": [
          "Hands here, handsome. Let me show you the pace I want."
        ]
      }
    ]
  },
  {
    "open": [
      "I brought wine. You bring yourself over here. We can see how long supper survives being ignored."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. A promising start to the evening."
        ]
      },
      {
        "t": "Sit beside her.",
        "r": [
          "Closer. I didn’t come all this way to admire the furniture."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I haven’t finished kissing you, and I don’t intend to rush the good part."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. I like a man who knows when he’s wanted."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand and lead the way."
        ]
      }
    ]
  }
],
  gift:[
   'No strings? Good. I prefer invitations to bargains. Mine is dinner tonight, just us.',
   'A gift with no strings? In Bilgewater we’d call that suspicious. Here I’ll call it sweet. Thank you.',
   '* She tips her hat to you, then leans down and leaves a kiss on your cheek that smells faintly of gunpowder and salt.']},

 // ---------------- Talanji (Work) ----------------
 talanji:{
  visit:[
  {
    "open": [
      "My court has gone home. Come closer. I want to kiss you without anyone waiting to speak."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "At last. I have been looking forward to that all afternoon."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. Somewhere I can enjoy being with you quietly."
        ]
      }
    ]
  },
  {
    "open": [
      "I set aside tonight for us. Supper by the terrace, and no audience for what follows."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit beside me. I want you within reach."
        ]
      },
      {
        "t": "Ask about her plans.",
        "r": [
          "A dance. A long kiss. Your company for as long as we both wish."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at me so carefully. I would rather you took my hand and showed me what you want."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Yes. There is no need for ceremony between us tonight."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Gladly. Come close enough that I can answer properly."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I have spent the day standing apart from everyone. I want your arms around me."
    ],
    "opts": [
      {
        "t": "Hold her waist.",
        "r": [
          "There. Much better."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "I was hoping you would. We can let the music wait."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want an evening that belongs to us without an appointment at its end."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come here. I have missed you today."
        ]
      },
      {
        "t": "Invite her for a walk.",
        "r": [
          "Yes. Slowly. I intend to stop and kiss you along the way."
        ]
      }
    ]
  }
],
  gift:[
   'You ask nothing of me. That is rare. Stay a moment. I would like to ask something of you: dinner.',
   'You give a queen a gift and ask nothing for it. In Zandalar, that is how love begins. Be careful, mon.',
   '* She presses her forehead to yours for a moment, warm and still, the way the Zandalari do with someone close.']},

 // ---------------- Maggie (Home) ----------------
 maggie:{
  visit:[
  {
    "open": [
      "The cauldron’s simmering. Come kiss me before I find another excuse to fuss over it."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Ah. That was what I wanted all along."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Sit by me. I’ve been hoping for your company tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve supper for two and a clean blanket by the fire. You can guess who I saved the other place for."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There you are. Put your arm around me."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Of course. I’ve been thinking about that since you arrived."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re making it difficult to mind this recipe. Come closer and make it worth burning the toast."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Oh, yes. Definitely worth the toast."
        ]
      },
      {
        "t": "Offer to help cook.",
        "r": [
          "Together, then. Though I may keep interrupting you."
        ]
      }
    ]
  },
  {
    "open": [
      "Walk with me? I want your hand in mine and nobody asking what’s in the pot."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Good. We can stop by the old willow for a kiss."
        ]
      },
      {
        "t": "Kiss her now.",
        "r": [
          "Well, that’s a lovely start. Come on."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a little longer. The fire’s good, the tea’s hot, and I’m enjoying having you within reach."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Closer, then. I don’t want to stretch for the next kiss."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. Let me settle things here first."
        ]
      }
    ]
  }
],
  gift:[
   'Oh, love. You remembered. Put it down and give me your hands. I’ve got a proper thank-you for you.',
   'Oh, you shouldn’t have. You really should have, mind. I’ll put it by the cauldron where I can see it.',
   '* She plants a big, warm kiss on your cheek that smells of woodsmoke and stew. Then another, for luck.']},
};

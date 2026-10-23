// Fourth-wave moments, part G: Family Jessica, Magik, Mystique, Nico, Shuri, Sue, Wasp, Moana and Vanellope
// (visits and gifts). See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13, except Moana and Vanellope,
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Jessica (Work) ----------------
 jessica:{
  visit:[
  {
    "open": [
      "I closed the case. I want a drink and a kiss. You can help with the second one."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yeah. That’s better."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Sure. Somewhere quiet. I’ve heard enough bullshit today."
        ]
      }
    ]
  },
  {
    "open": [
      "I made room on the couch. That’s an invitation. Come sit where I can kiss you."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. See? No speech required."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Fine. We can go out. But I’m keeping hold of that."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been staring at my mouth for five minutes. Ask, or I’m going to."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. Obviously yes."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. Took you long enough."
        ]
      }
    ]
  },
  {
    "open": [
      "No clients tonight. I want food and your arms around me. Don’t make it complicated."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "That’s it. Stay there."
        ]
      },
      {
        "t": "Offer dinner.",
        "r": [
          "With you? Yeah. I’d like that."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m enjoying this, and I’m trying this new thing where I actually say so."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Good. Kiss me again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yeah. Let me grab my jacket."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. Okay. That got me. Come here before I cover up a perfectly good thank-you with sarcasm.',
   'Huh. Nobody gets me stuff. Usually they get me subpoenas. This is better. Way better. I’m keeping it in the desk drawer with the good bottle.',
   '* She grabs your collar, kisses you once, quick and hard, then shoves you back a step. “That didn’t happen. Get out of my office.” She’s smiling.']},

 // ---------------- Magik (Discipline) ----------------
 magik:{
  visit:[
  {
    "open": [
      "Limbo can manage without me tonight. Come here. I want to kiss you somewhere with fewer demons."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Much better scenery, too."
        ]
      },
      {
        "t": "Ask her to dinner.",
        "r": [
          "Yes. Food I do not have to fight. And you."
        ]
      }
    ]
  },
  {
    "open": [
      "I made a portal to the restaurant. This is a date. I am being very efficient about getting you alone."
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "Good. I like it when you catch on."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "A useful delay. I permit it."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at me. Come closer. I am not interested in being admired from the doorway."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. Now put your arms around me."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I was giving you the opportunity."
        ]
      }
    ]
  },
  {
    "open": [
      "No battles tonight. I want the couch and your complete attention."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Closer. I want to lean on you."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. A good start. Continue."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I have had enough of people leaving through portals. I would rather keep kissing you."
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
          "Yes. We can walk. I want the time with you."
        ]
      }
    ]
  }
],
  gift:[
   'No contract. Just a gift. Thank you. I’d like to kiss you, and I won’t disappear afterward.',
   'No catch? You’re sure? No little clause where I owe you my soul? Hm. I don’t know what to do with that.',
   '* She rises on her toes and kisses your cheek, quick, then blinks away in a flash of light before you can see her face. Her laugh echoes a second later from somewhere behind you.']},

 // ---------------- Mystique (Work) ----------------
 mystique:{
  visit:[
  {
    "open": [
      "No disguises tonight. I want you looking at me exactly as I am when you kiss me."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. Much more interesting than a performance."
        ]
      },
      {
        "t": "Offer her a date.",
        "r": [
          "Yes. Somewhere I can sit close and enjoy being seen by you."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose this dress for dinner with you. Your expression suggests I chose well."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Good. I intend to enjoy your attention all evening."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Come closer. I prefer compliments I can answer personally."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve put the plans away. You have my attention. What would you like to do with it?"
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "That. I was hoping for that."
        ]
      },
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. I find direct questions rather attractive."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. No audience, no purpose beyond wanting your hands on my waist."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Slowly. I want to enjoy the way you hold me."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. An excellent reason to miss the first song."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m enjoying this evening too much to start pretending I’m ready to let you go."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Let me kiss you again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand. I want more time with you."
        ]
      }
    ]
  }
],
  gift:[
   'You chose this for the woman, not the face. Come closer, darling. I’d like to thank you as myself.',
   'People give gifts to the face I’m wearing. You gave this to me. I can tell. That’s… unusual.',
   '* She kisses you, and halfway through you realize she let her real face come back. She doesn’t explain it. She doesn’t have to.']},

 // ---------------- Nico (Hobbies) ----------------
 nico:{
  visit:[
  {
    "open": [
      "I put the staff away. I want to kiss you, and I’d rather not accidentally name a spell doing it."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yeah. Definitely better without magical assistance."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Somewhere quiet. I want to hear you flirt."
        ]
      }
    ]
  },
  {
    "open": [
      "I dressed up for our date. You can stop pretending you weren’t staring at me."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Thanks. Come closer so I can enjoy that properly."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Good. I was hoping you’d do that."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. The sketchbook can wait. I want your arm around me for a while."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. I missed this today."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. That’s very much part of why I asked you over."
        ]
      }
    ]
  },
  {
    "open": [
      "No spells tonight. Music, candles, your hands on my waist. That’s the plan."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Slowly. I like feeling you close."
        ]
      },
      {
        "t": "Kiss her instead.",
        "r": [
          "Also part of the plan. A really good part."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I don’t want to spend the next hour wishing I’d asked for another kiss."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Let me get my coat. I want the rest of tonight with you."
        ]
      }
    ]
  }
],
  gift:[
   'This is really thoughtful. I’m trying not to hide behind a joke. Thank you. Can I kiss you?',
   'Okay. This is really cool. Like actually cool, not ironic cool. I’m going to keep it on my altar. It’s a shelf. I call it an altar.',
   '* She kisses you on the cheek, then the corner of your mouth, then pulls her hood up and walks off fast. “I didn’t do that. You can’t prove anything.”']},

 // ---------------- Shuri (Hobbies) ----------------
 shuri:{
  visit:[
  {
    "open": [
      "I’ve shut down the prototype. Now I can kiss you without a machine announcing my elevated pulse."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Excellent. Much better than the diagnostic predicted."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Somewhere without screens. Except the menu, if necessary."
        ]
      }
    ]
  },
  {
    "open": [
      "I reserved dinner for two. This is a date. I’m eliminating ambiguity early."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Good. You look very pleased. I like that."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "A persuasive response. We may be late."
        ]
      }
    ]
  },
  {
    "open": [
      "You leaning over my shoulder is making this circuit impossible. Turn me around. I’d rather look at you."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "There. Now the distraction has a purpose."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I was trying to make that obvious without diagrams."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I want your hands on my waist and nobody asking me to fix anything."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Good. Stay close. This is exactly what I wanted."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. You make a convincing case for changing plans."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay tonight for supper. Afterward, I intend to enjoy having you entirely to myself."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Excellent. Come here. I’ve wanted to kiss you all afternoon."
        ]
      },
      {
        "t": "Offer to cook.",
        "r": [
          "Together. Try not to be too distracting near the knives."
        ]
      }
    ]
  }
],
  gift:[
   'No tech, no favor. You just thought of me. I love it. Come here before I start explaining instead of thanking you.',
   'No vibranium. No tech. Just something you picked because you thought of me. That’s so primitive. I love it.',
   '* She kisses you, quick and bright, then immediately starts explaining how she’s going to upgrade it. You let her talk. She keeps holding your hand the whole time.']},

 // ---------------- Sue (Fatherhood) ----------------
 sue:{
  visit:[
  {
    "open": [
      "Everyone’s settled. Come here. I’ve wanted a proper kiss from you since breakfast."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. That was worth making time for."
        ]
      },
      {
        "t": "Offer your arms.",
        "r": [
          "Oh, yes. Hold me a little longer."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved tonight for us. Dinner, a walk, and no reason to keep checking the time."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want your hand in mine all evening."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "A lovely start. Let’s take our time."
        ]
      }
    ]
  },
  {
    "open": [
      "You look handsome. I’m allowed to enjoy staring, but I’d rather have you much closer."
    ],
    "opts": [
      {
        "t": "Draw her near.",
        "r": [
          "There. That’s better."
        ]
      },
      {
        "t": "Offer her a dance.",
        "r": [
          "Yes. Hands on my waist. I’ve been wanting this all day."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. I want your arm around me while we watch something neither of us will remember tomorrow."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Exactly. I’m rather more interested in you tonight."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. That’s a much better use of our attention."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I don’t want this evening to become another hurried goodbye."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come kiss me again before we start clearing up."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d love that. Take my hand."
        ]
      }
    ]
  }
],
  gift:[
   'You thought of me. That means a lot. Come closer, I want to thank you without talking across the room.',
   'Sorry. Old habit. Nobody gets the mom anything. They get the genius and the hothead and the kids presents. This is lovely.',
   '* She kisses your cheek, soft and lingering, and her laugh is a little shaky. “Reed’s going to be so jealous. Good. Let him be.”']},

 // ---------------- Wasp (Fitness) ----------------
 wasp:{
  visit:[
  {
    "open": [
      "I changed out of the suit. Now I want a kiss that has nothing to do with surviving a mission."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "There. Much better reason to come home."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. I have an outfit and very definite ideas about being your date."
        ]
      }
    ]
  },
  {
    "open": [
      "I designed this dress. You can admire it for another minute, then I want your hands on my waist."
    ],
    "opts": [
      {
        "t": "Compliment her.",
        "r": [
          "Thank you. Now come closer and appreciate the fit."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Exactly what I wanted. Hold me properly."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked us dinner. Sit beside me. I’m feeling far too affectionate to negotiate across a table."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’ve been looking forward to having you to myself."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. Perhaps we should order something quick."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me from these sketches. I think I’d rather put them down and kiss you."
    ],
    "opts": [
      {
        "t": "Encourage her.",
        "r": [
          "Gladly. Come here."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Take me somewhere quiet. I want a whole evening with you."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m comfortable, you look lovely, and I haven’t finished enjoying that smile."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Good. Put your arm around me."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. That is exactly the sort of offer I like."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered my taste. That’s attractive. Come here before I turn the thank-you into a fashion lecture.',
   'Oh, this is good. This goes with everything. You have taste. I would never have guessed from the gym shorts.',
   '* She kisses you on the cheek, shrinks, buzzes around your head once, and grows back to kiss the other cheek. “Symmetry. Very important.”']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 moana:{
  visit:[
  {
    "open": [
      "The crews are in. I want to take you somewhere quiet and kiss you without someone asking about the tide."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Good. I’ve been looking forward to this all afternoon."
        ]
      },
      {
        "t": "Kiss her now.",
        "r": [
          "Oh. Yes. We can start here."
        ]
      }
    ]
  },
  {
    "open": [
      "I brought supper to the beach. Come sit close. I want your arm around me while the sun goes down."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. That’s the evening I had in mind."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Yes. I was hoping you’d ask before the food distracted us."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep making me lose my place on this chart. Come closer. I’d rather be distracted properly."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "Good. Now I can kiss you instead of pretending to work."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Give me a minute to put the maps away."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. Just us, the water, and your hands on my waist."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Slowly. I want to enjoy being held by you."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "That’s a lovely way to begin. Stay close."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I don’t want to rush saying goodnight when I’ve wanted your company all day."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then sit beside me. I want another kiss."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. We can walk along the shore and take our time."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. I’ll keep this safe. Come sit with me, I’d like to thank you and ask you on a date.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 vanellope:{
  visit:[
  {
    "open": [
      "The garage is closed. I’ve been thinking about kissing you through three engine checks. Come here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yep. Better than a perfect lap. Don’t tell the mechanics."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. A date where neither of us checks the stopwatch."
        ]
      }
    ]
  },
  {
    "open": [
      "I cleaned up for dinner with you. You can keep staring, but I’d enjoy it more if you took my hand."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "There. That’s a strong start."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Thanks. Come closer so I can stop pretending I’m cool about it."
        ]
      }
    ]
  },
  {
    "open": [
      "Put the wrench down. I want your hands on my waist, and I’m being very clear to save us both time."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Perfect. Now kiss me."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Sure. Slowly. I’m taking the night off from speed."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked the whole evening for us. Food, music, and a ridiculous amount of sitting close."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. The crew can survive without my brilliant supervision."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Excellent opening move. I’m enjoying this already."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m having too much fun being kissed by you to start talking about tomorrow’s race."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Scoot closer. I saved you the best spot."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. We’re walking, though. I want the extra time with you."
        ]
      }
    ]
  }
],
  gift:[
   'You remembered. Nice. I was going to pretend I’m hard to impress, but I’d rather kiss you.',
   'I remembered you on my way home, too. I was hoping you’d have time for dinner with me.',
   '* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},
};

// Fourth-wave moments, part C: Family Caitlyn, Garona, Riven, Sylvanas, Xalatath (Discipline) and
// Jasnah, Seraphine, Sona (Hobbies). Visits and gifts. See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.
// Sona is mute: her lines are narration of what she plays and does, plus short written notes.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Caitlyn (Discipline) ----------------
 caitlyn:{
  visit:[
  {
    "open": [
      "I’ve put away the case files. You may now distract me as thoroughly as you’ve been attempting to all afternoon."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That was precisely the distraction I had in mind."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Gladly. Somewhere nobody recognizes my uniform."
        ]
      }
    ]
  },
  {
    "open": [
      "I reserved a quiet table. I intend to spend the evening being quite obvious about wanting your company."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. That is an excellent beginning."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Mm. Perhaps we should leave before I reconsider the reservation."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been looking at my mouth. I would rather you asked the question than continued investigating from a distance."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. Very much."
        ]
      },
      {
        "t": "Step closer.",
        "r": [
          "There. Now I can give you a more useful answer."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I’ve spent enough of today keeping my hands to myself."
    ],
    "opts": [
      {
        "t": "Hold her waist.",
        "r": [
          "Good. Stay close. I want to enjoy this."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "An entirely welcome amendment to the plan."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay tonight for supper. And afterward, if you’d like. I have rather definite hopes about afterward."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Then come here. I’d like to kiss you before we sit down."
        ]
      },
      {
        "t": "Ask what she hopes.",
        "r": [
          "A quiet evening together. Your arms around me. No reason to hurry."
        ]
      }
    ]
  }
],
  gift:['Thoughtful, well chosen. I would like to thank you somewhere I don’t have to keep my official expression.','I’ll admit I deduced what this was before you handed it over. I still love it. I love that you tried.','Careful. Keep spoiling me and I’ll have to put you under permanent surveillance. Close surveillance.']},

 // ---------------- Garona (Discipline) ----------------
 garona:{
  visit:[
  {
    "open": [
      "I’ve put the knives away. I want to kiss you. You can stop wondering why I stayed."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. I prefer being understood."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. Somewhere we can be alone."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose you for my evening. No job. No favor. A date, if you want it."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Then come closer. I’ve wanted your hand in mine all day."
        ]
      },
      {
        "t": "Invite her to supper.",
        "r": [
          "Yes. Sit beside me. I want to reach you."
        ]
      }
    ]
  },
  {
    "open": [
      "You don’t need to move away when I touch you. I want you close."
    ],
    "opts": [
      {
        "t": "Draw her near.",
        "r": [
          "There. That is where I wanted you."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I thought you might ask sooner."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay by the fire with me. I want your arms around me, and I’m tired of making that sound complicated."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "Good. Let everything else wait."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Again. I have time tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "Don’t leave yet. I’m enjoying being here with you. I want more of it."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then sit close. I was thinking about another kiss."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I’ll walk beside you."
        ]
      }
    ]
  }
],
  gift:['No orders attached. You remembered what I like. Come here. I want to thank you without hiding a smile.','Hm. It’s not poisoned and it’s not a bribe. I checked. That makes it the nicest thing anyone’s given me in years.','Stop smiling at me like that. Fine. Thank you. Now come here before I change my mind.']},

 // ---------------- Riven (Discipline) ----------------
 riven:{
  visit:[
  {
    "open": [
      "The sword’s put away. Come here. I’ve been thinking about kissing you since you arrived."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That was worth stopping for."
        ]
      },
      {
        "t": "Offer a walk.",
        "r": [
          "With you? Gladly. Take my hand."
        ]
      }
    ]
  },
  {
    "open": [
      "I made supper. I want you beside me tonight, without either of us finding work to do."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’ve been looking forward to this all day."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "There. Now the evening feels like ours."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me. I don’t mind. I’d rather sit closer and stop pretending to concentrate."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Put your arm around me. That’s what I wanted."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I was hoping you would."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me? Slowly. I want to feel your hands on my waist and forget the rest of today."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "There. I like this. Stay close."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Oh. Yes. That, too."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I don’t want another evening that ends just as I’ve started to relax with you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Thank you. Come sit against me."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. We can take our time walking there."
        ]
      }
    ]
  }
],
  gift:['You remembered. Thank you. I’m not very practiced at this, but I’d like to kiss you.','It’s beautiful. I don’t know what to say. That’s, um, rare. Thank you.','You remembered I like Ionian blossoms. Nobody remembers anything about me. Come here.']},

 // ---------------- Sylvanas (Discipline) ----------------
 sylvanas:{
  visit:[
  {
    "open": [
      "You have my attention. Come closer and give me a reason to keep it here."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. That will do. Again."
        ]
      },
      {
        "t": "Ask her to walk.",
        "r": [
          "Somewhere quiet. I have no wish to share you with the village tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I have dismissed the messengers. Tonight I want wine and your company. I trust that is sufficiently clear."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Then sit within reach. I dislike repeating an invitation."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Good. There is something attractive about certainty."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep watching my mouth. I am beginning to think you enjoy delaying the obvious."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. At last."
        ]
      },
      {
        "t": "Draw her close.",
        "r": [
          "A much better use of your hands."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay beside me. The fire can burn down. I am enjoying the way you hold me."
    ],
    "opts": [
      {
        "t": "Hold her closer.",
        "r": [
          "There. Do not hurry this."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Gladly. I have been thinking about the last one."
        ]
      }
    ]
  },
  {
    "open": [
      "I want the evening with you. No duties, no visitors. Your answer?"
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here. I intend to enjoy it."
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
  gift:['You remembered something I thought everyone had forgotten. Stay. I would like to thank you without an audience.','It reminds me of Eversong in spring. I had forgotten I could miss anything. Thank you.','Hm. You are spoiling me. I have not been spoiled in a very long time. Continue.']},

 // ---------------- Xalatath (Discipline) ----------------
 xalatath:{
  visit:[
  {
    "open": [
      "I could whisper a hundred tempting things. Tonight I’ll be plain: I want you closer."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. Now kiss me and let me stop wondering."
        ]
      },
      {
        "t": "Ask her to join you.",
        "r": [
          "An invitation. How delightful. Make room beside you."
        ]
      }
    ]
  },
  {
    "open": [
      "I have wine and an empty evening. Come spend it with someone who has been thinking about your mouth."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Lovely. I was hoping to enjoy you without interruptions."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. A very persuasive answer."
        ]
      }
    ]
  },
  {
    "open": [
      "You are trying so hard to concentrate. Shall I leave, or shall we admit you’d rather kiss me?"
    ],
    "opts": [
      {
        "t": "Ask her to stay.",
        "r": [
          "Gladly. Put the book down."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Yes. I prefer this conversation already."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. Slowly. I want to see whether you look at me that way from closer still."
    ],
    "opts": [
      {
        "t": "Take her waist.",
        "r": [
          "Oh, you do. How fortunate for us both."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Come along, then. I’ve been waiting to feel you reach for me."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m enjoying you far too much to turn tonight into a promise about tomorrow."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Good. Let me kiss you again."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I rather like where your thoughts are going."
        ]
      }
    ]
  }
],
  gift:['For me? How unexpected. Come closer, darling. I would like to thank you without a riddle.','I’ll put it with the things I keep. It’s a very short list. You’re on it twice now.','Careful. You keep being sweet and I may have to stop tempting you altogether. I won’t. But I might want to.']},

 // ---------------- Jasnah (Hobbies) ----------------
 jasnah:{
  visit:[
  {
    "open": [
      "I’ve closed the book. I would like to kiss you. There is no hidden qualification to the request."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. That was worth stating plainly."
        ]
      },
      {
        "t": "Invite her to dinner.",
        "r": [
          "Yes. I have set aside the evening for precisely that possibility."
        ]
      }
    ]
  },
  {
    "open": [
      "I want your company tonight. Somewhere quiet, where conversation may give way to something less verbal."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. I find your enthusiasm very appealing."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Gladly. We needn’t postpone everything until supper."
        ]
      }
    ]
  },
  {
    "open": [
      "You are distracting me. Since I invited you, I believe I should put the work aside and enjoy it."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. I prefer your attention at this distance."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Yes. Stay beside me a while."
        ]
      }
    ]
  },
  {
    "open": [
      "I would like a dance. Your hands on my waist, no audience, no discussion of state."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Excellent. Let us take our time."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "An agreeable addition. Come closer."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I have no wish to end an evening I am enjoying so much."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit beside me. I would like another kiss."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I appreciate a direct invitation."
        ]
      }
    ]
  }
],
  gift:['Thoughtful. I would rather thank you than analyze why I’m smiling. Come sit beside me.','Thank you. I don’t say that often. Ask Shallan. She’ll be jealous.','It’s thoughtful. I’m annoyed at how pleased I am. Come here and let me be annoyed properly.']},

 // ---------------- Seraphine (Hobbies) ----------------
 seraphine:{
  visit:[
  {
    "open": [
      "I’ve been singing this love song all afternoon and thinking about kissing you. Want to help with the second part?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh. Yes. That was exactly what I meant."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Tonight? Absolutely. Let me put the music away."
        ]
      }
    ]
  },
  {
    "open": [
      "I got us a quiet table. I want to hear you laugh and sit close enough to hold your hand."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’ve been smiling about this all day."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Yes, please. A very promising start to our date."
        ]
      }
    ]
  },
  {
    "open": [
      "You can sit closer. I’ve been pretending this song needs more work because I wanted you to stay."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. Now I can stop pretending and put my arms around you."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. This time I want to feel the music with you."
        ]
      }
    ]
  },
  {
    "open": [
      "No performance tonight. I want your hand on my waist and a kiss nobody gets to applaud."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Perfect. Just us."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. I like our evenings quiet like this."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want to put on a record and get very comfortable beside you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come here. I’ve wanted your arms around me all day."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. I’m becoming very fond of how you ask that."
        ]
      }
    ]
  }
],
  gift:['You remembered. I’m going to put this somewhere safe, then ask if I can kiss you.','Eee, thank you! I’m going to write a song about this. It’ll be super catchy. You’ll hate how catchy.','You keep spoiling me and I keep blushing. That’s the deal now, okay? Forever.']},

 // ---------------- Sona (Hobbies) ----------------
 sona:{
  visit:[
  {
    "open": [
      "* Sona sets her etwahl aside, touches two fingers to her lips, then offers you her hand with an unmistakable smile."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "* She nods, draws you close, and answers with a warm, lingering kiss."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "* Her thumb strokes your knuckles. She makes room beside her and gently pulls you into it."
        ]
      }
    ]
  },
  {
    "open": [
      "* Sona shows you two supper reservations, points to you and herself, then traces a small heart on your palm."
    ],
    "opts": [
      {
        "t": "Accept the date.",
        "r": [
          "* Her smile widens. She links her arm with yours and kisses your cheek before you leave."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "* She turns toward you eagerly, both hands settling at your waist as you kiss."
        ]
      }
    ]
  },
  {
    "open": [
      "* Sona closes her music folio, meets your eyes, and pats the space beside her. She reaches for your hand before you sit."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "* She settles against you, guiding your arm around her shoulders with a contented sigh."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "* She nods at once. Her hand cups your cheek as she leans in."
        ]
      }
    ]
  },
  {
    "open": [
      "* With a soft melody playing, Sona steps into your arms and places your hand at her waist. Her smile invites you nearer."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "* She follows your steps, then rests her cheek against yours, content to linger through another song."
        ]
      },
      {
        "t": "Kiss her gently.",
        "r": [
          "* Her eyes close. She draws you nearer and takes her time kissing you back."
        ]
      }
    ]
  },
  {
    "open": [
      "* As you reach for your coat, Sona catches your hand. She shakes her head, smiles, and draws you back toward the sofa."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "* She settles close, her fingers laced through yours, and kisses you as the evening grows quiet."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "* She nods, retrieves her shawl, and returns to kiss you once more before taking your arm."
        ]
      }
    ]
  }
],
  gift:['* She sets your gift beside her instrument, then writes: Thank you. May I kiss you?','* She writes your name on a card, draws a tiny heart beside it, and tucks the card into her sleeve.','* She plays a phrase you recognize: your song, the one she made up for you. This time it ends with a kiss on your cheek.']},
};

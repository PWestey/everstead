// Fourth-wave moments, part I: Family Anna, the vampyre of Morytania (visits and gifts).
// See docs/WRITING-BRIEF.md. Romantic and flirty, PG-13.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Anna (Discipline) ----------------
 vampanna:{
  visit:[
  {
    "open": [
      "Come closer, darling. I’ve spent the evening thinking about your kiss, and my patience is becoming ornamental."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. There you are. I was right to wait."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Take me somewhere quiet. I intend to enjoy your company thoroughly."
        ]
      }
    ]
  },
  {
    "open": [
      "I set supper for two. Sit beside me. I have no desire to admire you across an unnecessary distance."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I want you within reach tonight."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "A lovely beginning. We can let the candles burn a little lower."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at my mouth so carefully. Ask me for what you want. I’m feeling very inclined to say yes."
    ],
    "opts": [
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. Slowly, darling."
        ]
      },
      {
        "t": "Draw her close.",
        "r": [
          "There. I rather like your confidence."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. I want your hands at my waist and that smile considerably closer to mine."
    ],
    "opts": [
      {
        "t": "Dance.",
        "r": [
          "Good. Let the next song play as well."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Mm. An excellent reason to miss a few steps."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. The night is lovely, and I am nowhere near finished kissing you."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Then come here. We have no reason to hurry."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Gladly. Take my hand. I want the rest of this evening with you."
        ]
      }
    ]
  }
],
  gift:[
   'A gift, freely given. How lovely. Come closer, darling. I would like to thank you without rushing.',
   'A gift, freely given. Do you know how rare that is where I’m from? Everything in Morytania is taken. I’ll keep this somewhere the sun can’t reach.',
   '* She leans in and kisses you, cool and unhurried, and pulls away exactly one heartbeat before you want her to. Restraint, she’d call it.']},
};

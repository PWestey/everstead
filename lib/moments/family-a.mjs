// Family "Spend time together" visits and gift reactions (set A).
// Shape: {id:{visit:[5 moments], gift:[3 lines]}}. Lines starting "* " are narration.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Ariane, Wizard of Light (Faith) ----------------
 ariane:{
  visit:[
  {
    "open": [
      "I lit these candles for you. Come here before I set the curtains on fire trying to look composed."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Better. Now kiss me before I start explaining the spell."
        ]
      },
      {
        "t": "Admire her handiwork.",
        "r": [
          "The gold light suits you. Especially this close."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve spent all afternoon inventing reasons to touch your hand. I could simply hold it, couldn’t I?"
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "There. Surprisingly little paperwork involved. Walk home with me?"
        ]
      },
      {
        "t": "Draw her closer.",
        "r": [
          "Oh. Yes, that solves the distance problem rather nicely."
        ]
      }
    ]
  },
  {
    "open": [
      "The Tower wants my notes tonight. Unfortunately, you keep looking at my mouth."
    ],
    "opts": [
      {
        "t": "Keep looking.",
        "r": [
          "I’m putting the notes away. Let’s see whether you’re as distracting up close."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I’d been hoping you would. Several paragraphs ago."
        ]
      }
    ]
  },
  {
    "open": [
      "It’s raining. I have wine, dry clothes, and a rather selfish wish that you’ll stay."
    ],
    "opts": [
      {
        "t": "Stay for the evening.",
        "r": [
          "Good. Sit beside me. The book can go on the floor."
        ]
      },
      {
        "t": "Ask about that wish.",
        "r": [
          "I want another evening that ends with us forgetting the time."
        ]
      }
    ]
  },
  {
    "open": [
      "Close the library door? I want to kiss you without someone asking me to bless their livestock."
    ],
    "opts": [
      {
        "t": "Close it and approach.",
        "r": [
          "There you are. I’ve been looking forward to this all day."
        ]
      },
      {
        "t": "Hold out your hand.",
        "r": [
          "Come on, then. Let’s find somewhere even a determined goat can’t follow."
        ]
      }
    ]
  }
],
  gift:['You remembered. Come closer, I want to thank you without shouting across the chapel.','* Her cheeks glow. Literally glow. She hides behind the gift and laughs at herself.','I’m putting it by the altar. I’ll see it every time I pray, which is… a lot. You planned that.']},

 // ---------------- Ahsoka, Wandering Jedi (Faith) ----------------
 ahsoka:{
  visit:[
  {
    "open": [
      "Put the practice saber down. I’ve been wanting to kiss you since you walked onto the field."
    ],
    "opts": [
      {
        "t": "Set it aside.",
        "r": [
          "That was quick. Good priorities. Come here."
        ]
      },
      {
        "t": "Ask her to come closer.",
        "r": [
          "You could have asked ten minutes ago. I’d have listened."
        ]
      }
    ]
  },
  {
    "open": [
      "I found a quiet place above the mill. I want you there with me, preferably with your arms around me."
    ],
    "opts": [
      {
        "t": "Follow her up.",
        "r": [
          "Careful on that last tile. All right. Now you can distract me."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "I like this side of you. The one that knows I can climb and offers anyway."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep smiling at me during meditation. I’m beginning to think you have other plans."
    ],
    "opts": [
      {
        "t": "Admit you do.",
        "r": [
          "Tell me. The exercise can wait. I’m listening very closely."
        ]
      },
      {
        "t": "Ask about her plans.",
        "r": [
          "Mine involve walking you home slowly. Very slowly."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m off duty. No training, no messages. Just you, me, and however long that next kiss takes."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. Worth clearing the evening for."
        ]
      },
      {
        "t": "Invite her to dance.",
        "r": [
          "I remember where your hands went last time. Yes."
        ]
      }
    ]
  },
  {
    "open": [
      "Come back here. That was a goodbye kiss. I haven’t decided to let the evening end."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "That’s better. There’s nowhere I need to be more than here."
        ]
      },
      {
        "t": "Suggest another walk.",
        "r": [
          "Along the river. Fewer people to interrupt us."
        ]
      }
    ]
  }
],
  gift:['You pay attention. I like that. And I like you. Neither of those is a secret.','* She turns it over in her hands, then looks at you a beat longer than she needs to.','You remembered. Most people don’t. Rex always did. That’s good company to be in.']},

 // ---------------- Lys, Temple Keeper (Faith) ----------------
 lys:{
  visit:[
  {
    "open": [
      "I saved you the seat beside me. Close enough to kiss you. I thought I should finally admit that."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. I’ve been imagining this while pouring everybody else’s tea."
        ]
      },
      {
        "t": "Ask for that kiss.",
        "r": [
          "Yes, please. Let me set the cup somewhere safe."
        ]
      }
    ]
  },
  {
    "open": [
      "Will you walk me home? I want your hand in mine, and I want to take the long way."
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "Warm hands. That’s going to make it very difficult to say goodnight."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "You look pleased with yourself. I suppose I am rather obvious tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "The temple’s quiet now. Stay a little? I keep thinking about the way you kissed me."
    ],
    "opts": [
      {
        "t": "Stay beside her.",
        "r": [
          "Come closer. I’d rather have another than keep thinking about it."
        ]
      },
      {
        "t": "Tell her you remember.",
        "r": [
          "So do I. Particularly the part where you forgot what you were saying."
        ]
      }
    ]
  },
  {
    "open": [
      "I put on this dress hoping you’d notice. There. That was considerably braver than I expected."
    ],
    "opts": [
      {
        "t": "Tell her she’s beautiful.",
        "r": [
          "Thank you. Now come here so I can stop blushing across the room."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. Hold me properly. I’ve wanted this all evening."
        ]
      }
    ]
  },
  {
    "open": [
      "I made supper for two. Afterward, I’d like to sit in your arms and let the dishes wait."
    ],
    "opts": [
      {
        "t": "Accept the invitation.",
        "r": [
          "Good. Kiss me hello first. I’ve missed that today."
        ]
      },
      {
        "t": "Offer to cook together.",
        "r": [
          "You chop, I stir. And we both try to keep our minds on supper."
        ]
      }
    ]
  }
],
  gift:['You’ve been thinking of me? Good. I was beginning to feel rather outnumbered by my own thoughts.','* She holds it to her chest and smiles so wide her eyes nearly close.','You didn’t have to. I’m so glad you did. Come here, let me hug you before I cry.']},

 // ---------------- Keyleth, Druid of the Air Ashari (Faith) ----------------
 keyleth:{
  visit:[
  {
    "open": [
      "I want to kiss you. I had a whole charming lead-in, but apparently that’s what came out."
    ],
    "opts": [
      {
        "t": "Tell her yes.",
        "r": [
          "Oh, good. Come here. I’m much better at the next part."
        ]
      },
      {
        "t": "Tell her you wanted that.",
        "r": [
          "You could’ve said! I’ve been rehearsing at a tree for an hour."
        ]
      }
    ]
  },
  {
    "open": [
      "The willow knows I’m taking you on a date. So does probably the entire grove. Are you coming?"
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Excellent. Please ignore the rustling. They’re terribly invested."
        ]
      },
      {
        "t": "Ask what she planned.",
        "r": [
          "Picnic. Sunset. Kissing you until I forget where I left the basket."
        ]
      }
    ]
  },
  {
    "open": [
      "Lie beside me? I want your arms around me, and there’s nobody here to need anything from us."
    ],
    "opts": [
      {
        "t": "Lie down with her.",
        "r": [
          "That’s it. Oh, I could get dangerously used to this."
        ]
      },
      {
        "t": "Pull her gently closer.",
        "r": [
          "Yes. Exactly that. I really should ask for what I want more often."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m staying in my own shape tonight. I want to feel you kiss me, not scare you as an enormous bird."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Definitely the right decision. I’m keeping this shape for a while."
        ]
      },
      {
        "t": "Offer a moonlit dance.",
        "r": [
          "Yes! Slowly, though. I want to be close, not impressive."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve finished everything. For once. Can I be completely selfish and have you all evening?"
    ],
    "opts": [
      {
        "t": "Promise her the evening.",
        "r": [
          "Good. First, kiss me. Then we’ll see whether we remember to eat."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Absolutely. Let me tell the grove we’re leaving before it starts celebrating."
        ]
      }
    ]
  }
],
  gift:['Oh, you remembered. I had a thank-you planned. It was a kiss. Still interested?','* A sprig of clover pops right out of the ground at your feet. She doesn’t notice.','The trees are going to be so jealous. I’m telling every single one of them.']},

 // ---------------- Shadowheart, Cleric of Selûne (Faith) ----------------
 shadowheart:{
  visit:[
  {
    "open": [
      "I brought wine. You brought that look. I think we understand each other perfectly."
    ],
    "opts": [
      {
        "t": "Pour two glasses.",
        "r": [
          "Then sit down beside me. I’m feeling very unreasonable about the distance."
        ]
      },
      {
        "t": "Ask what look.",
        "r": [
          "The one that makes me want to shut the door and kiss you."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re late. Only a minute, but I’d already decided how I wanted to greet you."
    ],
    "opts": [
      {
        "t": "Step closer.",
        "r": [
          "Good. Now hold still while I make waiting worth it."
        ]
      },
      {
        "t": "Ask for a demonstration.",
        "r": [
          "With pleasure. Put those things down first."
        ]
      }
    ]
  },
  {
    "open": [
      "The moon’s lovely. I noticed it briefly before you started distracting me."
    ],
    "opts": [
      {
        "t": "Offer a moonlit walk.",
        "r": [
          "Only if you intend to stop and kiss me occasionally."
        ]
      },
      {
        "t": "Tell her she has your attention.",
        "r": [
          "Then come closer. I have no interest in shouting this part."
        ]
      }
    ]
  },
  {
    "open": [
      "I was going to be mysterious tonight. Unfortunately, I’d much rather be in your lap."
    ],
    "opts": [
      {
        "t": "Make room for her.",
        "r": [
          "Oh, that smile. You’ve been hoping I’d say that, haven’t you?"
        ]
      },
      {
        "t": "Draw her into an embrace.",
        "r": [
          "This will do nicely. For a start."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay tonight for supper. And afterward. I’m being quite deliberate about that second invitation."
    ],
    "opts": [
      {
        "t": "Accept both invitations.",
        "r": [
          "Excellent. I’m going to kiss you now, while the food can still survive neglect."
        ]
      },
      {
        "t": "Offer to help cook.",
        "r": [
          "Roll up your sleeves, then. Yes, I’m allowed to enjoy the view."
        ]
      }
    ]
  }
],
  gift:['Thoughtful. Dangerous habit, learning exactly what makes me smile. Come here.','* She hides a smile and tucks it away somewhere close to her heart.','I spent years in the dark. You keep bringing me little lights. Stop it. Don’t stop it.']},

 // ---------------- Tyrande, High Priestess of the Moon (Marriage) ----------------
 tyrande:{
  visit:[
  {
    "open": [
      "The sentries have their orders. Tonight I would rather have your arms around me than another report."
    ],
    "opts": [
      {
        "t": "Offer your embrace.",
        "r": [
          "At last. I have thought of this through a very long council."
        ]
      },
      {
        "t": "Ask her to walk.",
        "r": [
          "Under the trees. Stay close enough that I need not reach far for you."
        ]
      }
    ]
  },
  {
    "open": [
      "I chose this place because nobody will interrupt us. Come sit where I can kiss you."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "There. Let the moon keep watch for a while."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "You remember what I enjoy. That is rather difficult to resist."
        ]
      }
    ]
  },
  {
    "open": [
      "You look at me as though I am beyond your reach. I am standing here asking you to take my hand."
    ],
    "opts": [
      {
        "t": "Take it.",
        "r": [
          "Good. Now let me show you where I wanted it."
        ]
      },
      {
        "t": "Step into her embrace.",
        "r": [
          "Yes. I prefer this to being admired from a distance."
        ]
      }
    ]
  },
  {
    "open": [
      "I have given the day to my people. May I have the evening with you?"
    ],
    "opts": [
      {
        "t": "Promise her the evening.",
        "r": [
          "Then kiss me slowly. We have nowhere to hurry."
        ]
      },
      {
        "t": "Invite her to supper.",
        "r": [
          "Gladly. Afterward, I intend to keep you close."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay beneath the branches with me. I have no wish to exchange one brief kiss and part."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then there is no reason for the next one to be brief."
        ]
      },
      {
        "t": "Draw her toward you.",
        "r": [
          "I wondered how long you would make me wait."
        ]
      }
    ]
  }
],
  gift:['I accept your gift. And if you are offering your company, I would like that even more.','* She presses it to her lips, then to yours, and smiles like a secret older than mountains.','You remembered what I love. Most mortals remember only that I am frightening.']},

 // ---------------- Padmé, Senator of Naboo (Marriage) ----------------
 padme:{
  visit:[
  {
    "open": [
      "I finished the last meeting early. I wanted time to kiss you before somebody discovers another crisis."
    ],
    "opts": [
      {
        "t": "Meet her halfway.",
        "r": [
          "Much better. I should clear my schedule more often."
        ]
      },
      {
        "t": "Ask how much time.",
        "r": [
          "Enough for a date, if you’ll stop looking surprised and take my hand."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve listened to speeches all day. Tell me something you actually want. I’ll start: you, closer."
    ],
    "opts": [
      {
        "t": "Step closer.",
        "r": [
          "An admirably direct answer. Now kiss me."
        ]
      },
      {
        "t": "Invite her away for dinner.",
        "r": [
          "Yes. Somewhere quiet enough that we can forget our titles."
        ]
      }
    ]
  },
  {
    "open": [
      "I wore this because I liked it. The way you’re looking at me is a very welcome addition."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Take me somewhere we can dance. I want your hand on my waist."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Thank you. I rather like what that smile does to your face."
        ]
      }
    ]
  },
  {
    "open": [
      "We have the balcony to ourselves. I was hoping you’d put your arms around me."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "There. I’ve wanted this since the first meeting this morning."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "I was hoping for that, too. Come here."
        ]
      }
    ]
  },
  {
    "open": [
      "Come home with me for supper. I want an evening that belongs entirely to us."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. The conversation can wait until after I’ve kissed you hello."
        ]
      },
      {
        "t": "Offer to cook.",
        "r": [
          "Together, then. I’m enjoying the thought of you in my kitchen."
        ]
      }
    ]
  }
],
  gift:['You chose this yourself. That’s why I love it. And why I’d like you to come closer.','* She wraps both hands around it like it might slip away, and kisses your cheek.','It’s perfect. Thoughtful, and no favor wanted in return. You have no idea how rare that is in politics.']},

 // ---------------- Yennefer, Sorceress (Marriage) ----------------
 yennefer:{
  visit:[
  {
    "open": [
      "Put that down and kiss me. I’ve spent quite enough of today being patient."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Better. Much better. You may stay exactly there."
        ]
      },
      {
        "t": "Ask how patient.",
        "r": [
          "I let you finish walking through the door, didn’t I?"
        ]
      }
    ]
  },
  {
    "open": [
      "I booked a table for two. You’ll sit beside me. I dislike reaching across furniture for what I want."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Good. And later, you can walk me home very slowly."
        ]
      },
      {
        "t": "Ask what she wants.",
        "r": [
          "Your attention. Your hand on my waist. Must I supply a list?"
        ]
      }
    ]
  },
  {
    "open": [
      "You’re staring. Come closer and give me a reason to stop pretending I mind."
    ],
    "opts": [
      {
        "t": "Close the distance.",
        "r": [
          "There. Now kiss me as though you meant that look."
        ]
      },
      {
        "t": "Admit she’s distracting.",
        "r": [
          "Naturally. I put some thought into it."
        ]
      }
    ]
  },
  {
    "open": [
      "The bathhouse can wait. I’ve decided the best part of my evening is standing in front of me."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "An excellent decision. Keep making those."
        ]
      },
      {
        "t": "Invite her to stay.",
        "r": [
          "I brought wine. I had rather hoped you’d notice my intentions."
        ]
      }
    ]
  },
  {
    "open": [
      "I have no appointments tonight. If you interrupt our evening to run an errand, it had better involve more wine."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Mm. You do occasionally make a compelling argument."
        ]
      },
      {
        "t": "Lead her to the sofa.",
        "r": [
          "Yes. Put your arms around me. I’m not finished with your company."
        ]
      }
    ]
  }
],
  gift:['Excellent taste. In gifts, too. Come here and accept a less restrained thank-you.','* She inspects it, unimpressed, then quietly slips it into her pocket.','It isn’t lilac. It isn’t gooseberries. It’s… lovely, actually. Thank you. Don’t make me repeat it.']},

 // ---------------- Briget, Rose Princess (Marriage) ----------------
 briget:{
  visit:[
  {
    "open": [
      "I had this rose picked for you. You can thank me with a kiss, if you’re feeling suitably grateful."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh. I shall have to raid the entire garden tomorrow."
        ]
      },
      {
        "t": "Offer her a dance.",
        "r": [
          "Here? Yes. Let them watch if they like."
        ]
      }
    ]
  },
  {
    "open": [
      "My attendants think we’re discussing flowers. I’d much rather discuss when you’re taking me out."
    ],
    "opts": [
      {
        "t": "Suggest tonight.",
        "r": [
          "Good. Wear that smile. I’ve been thinking about it all afternoon."
        ]
      },
      {
        "t": "Invite her for a picnic.",
        "r": [
          "Somewhere private. I want to kiss you without dropping a title into every sentence."
        ]
      }
    ]
  },
  {
    "open": [
      "Help me with this necklace? Then turn me around and tell me how I look."
    ],
    "opts": [
      {
        "t": "Fasten it carefully.",
        "r": [
          "Lovely. Now the part I was really looking forward to."
        ]
      },
      {
        "t": "Tell her she’s beautiful.",
        "r": [
          "Come closer. Compliments are much better at this distance."
        ]
      }
    ]
  },
  {
    "open": [
      "The musicians have gone home. We can still dance. I know exactly where I want your hands."
    ],
    "opts": [
      {
        "t": "Offer a slow dance.",
        "r": [
          "There. Much nicer than a ballroom full of people."
        ]
      },
      {
        "t": "Ask her to lead.",
        "r": [
          "Gladly. Keep close. That is the most important step."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve spent all evening behaving like a princess. Now I would very much like another kiss."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Again. We have been terribly restrained tonight."
        ]
      },
      {
        "t": "Invite her somewhere quiet.",
        "r": [
          "Yes. Leave the flowers. I have what I came for."
        ]
      }
    ]
  }
],
  gift:['Oh, darling. Set it on the table. I want both your hands for my thank-you.','* She curtsies deeply, then ruins it entirely by flinging her arms around you.','I’ll press a rose beside it so I remember the date. You spoil me. Please never stop.']},

 // ---------------- Kitai, Marat Warrior (Marriage) ----------------
 kitai:{
  visit:[
  {
    "open": [
      "Chala, you have watched me train long enough. Come here and let me enjoy looking at you."
    ],
    "opts": [
      {
        "t": "Step close.",
        "r": [
          "Better. I can reach you from here. Kiss me."
        ]
      },
      {
        "t": "Challenge her to race.",
        "r": [
          "To the orchard. Afterward, I intend to keep you there awhile."
        ]
      }
    ]
  },
  {
    "open": [
      "I brought apples. You bring yourself closer. That is a fair division of effort."
    ],
    "opts": [
      {
        "t": "Sit against her.",
        "r": [
          "Good. You learn quickly when properly encouraged."
        ]
      },
      {
        "t": "Offer her a bite.",
        "r": [
          "You are distracting me from perfectly good fruit. I approve."
        ]
      }
    ]
  },
  {
    "open": [
      "You smell of rain and the outdoors. I like it. Stay close."
    ],
    "opts": [
      {
        "t": "Put an arm around her.",
        "r": [
          "There. I have missed this all day."
        ]
      },
      {
        "t": "Offer to walk her home.",
        "r": [
          "Slowly. I want several stops along the way."
        ]
      }
    ]
  },
  {
    "open": [
      "I want you beside me tonight. Must I invent some complicated Aleran excuse, or will you simply come?"
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Excellent. We have avoided a great deal of foolish talking."
        ]
      },
      {
        "t": "Tell her you want that.",
        "r": [
          "Then kiss me. You have made your point with words."
        ]
      }
    ]
  },
  {
    "open": [
      "The fire is lit. The food is ready. You are taking much too long to join me."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "Closer, chala. I did not save this place for the empty air."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Yes. That is a much better reason to delay supper."
        ]
      }
    ]
  }
],
  gift:['A courting gift. Good. I prefer a man who makes his intentions clear. Here are mine: stay.','* She sniffs it suspiciously, then grins like a wolf.','Not bad, Aleran. Not bad at all. Come here. I will thank you properly.']},

 // ---------------- Vin, Mistborn (Fatherhood) ----------------
 vin:{
  visit:[
  {
    "open": [
      "I checked the roof. It’s quiet. I want to sit up there with you and kiss you where nobody interrupts."
    ],
    "opts": [
      {
        "t": "Follow her.",
        "r": [
          "Stay on this side. Closer. Yes, that close."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "I don’t need help climbing. I do want to hold it."
        ]
      }
    ]
  },
  {
    "open": [
      "I keep finding excuses to pass your door. I’d rather knock and ask you to come out with me."
    ],
    "opts": [
      {
        "t": "Say yes.",
        "r": [
          "Good. I’ve thought about where I want to take you."
        ]
      },
      {
        "t": "Invite her inside.",
        "r": [
          "That works. I’d like to stay close to you tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "You don’t have to stand so far away. I want you here. With me."
    ],
    "opts": [
      {
        "t": "Move beside her.",
        "r": [
          "There. I can stop missing your hands now."
        ]
      },
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. You can ask much less nervously next time."
        ]
      }
    ]
  },
  {
    "open": [
      "The mists are coming in. Walk with me? I like having a reason to pull you close."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "That’s one reason. I have others."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "You’re smiling. Good. I wanted tonight to feel like this."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m staying a little longer. Unless you want me to go. I was hoping for another kiss."
    ],
    "opts": [
      {
        "t": "Ask her to stay.",
        "r": [
          "Then move over. I want your arms around me."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That’s what I was thinking about."
        ]
      }
    ]
  }
],
  gift:['You picked this for me. Not because you needed something. Come sit down. I want to be close to you.','* She turns it over and over, suspicious, then smiles like sun breaking through ash.','I’m keeping this somewhere safe. Not hidden. Just safe. That’s new.']},

 // ---------------- Hera, Captain of the Ghost (Fatherhood) ----------------
 hera:{
  visit:[
  {
    "open": [
      "The ship’s secured. The crew’s occupied. Come here, I’ve been wanting a proper kiss all day."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "That’s a much better welcome home than a maintenance report."
        ]
      },
      {
        "t": "Offer to take her out.",
        "r": [
          "Yes. Somewhere I don’t have to be the captain."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved the seat beside me. If you sit across the table, I’m moving."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "Good decision. Now tell me about your day while I hold your hand."
        ]
      },
      {
        "t": "Offer a dance first.",
        "r": [
          "I was hoping you’d ask. Come on."
        ]
      }
    ]
  },
  {
    "open": [
      "No emergencies tonight. I want dinner with you, and I want to take my time afterward."
    ],
    "opts": [
      {
        "t": "Promise her the evening.",
        "r": [
          "That sounds wonderful. Start by coming closer."
        ]
      },
      {
        "t": "Ask what she has in mind.",
        "r": [
          "A walk. A kiss somewhere quiet. Several, if we’re honest."
        ]
      }
    ]
  },
  {
    "open": [
      "You look good with your sleeves rolled up. Finish that repair and come collect your thank-you."
    ],
    "opts": [
      {
        "t": "Finish and approach.",
        "r": [
          "There you are. Put your hands right here."
        ]
      },
      {
        "t": "Ask for an advance.",
        "r": [
          "One kiss. Then we finish together. I want you free tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay with me a while. I’ve spent the whole day keeping everybody moving; now I want to stop with you."
    ],
    "opts": [
      {
        "t": "Hold her close.",
        "r": [
          "Yes. Exactly this. Don’t let me start talking about tomorrow’s schedule."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "I’d like that. Take my hand. I’m ready."
        ]
      }
    ]
  }
],
  gift:['That’s thoughtful, love. Put it somewhere safe. Then give me a minute of your full attention.','* She tucks it inside her flight jacket, right over her heart.','Thank you, love. You’re a good man. Don’t let anyone talk you out of it. Especially you.']},

// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.
 liko:{
  visit:[
  {
    "open": [
      "I found a secluded overlook on my survey. I’d like to take you there and finally kiss you properly."
    ],
    "opts": [
      {
        "t": "Accept the invitation.",
        "r": [
          "Good. I packed supper. I was feeling optimistic about your answer."
        ]
      },
      {
        "t": "Ask to start here.",
        "r": [
          "Yes. Let me put the maps down first."
        ]
      }
    ]
  },
  {
    "open": [
      "I kept thinking about you out on the trail. It made coming home rather distracting."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "This is what I was looking forward to. Stay here a moment."
        ]
      },
      {
        "t": "Ask what she imagined.",
        "r": [
          "Your arms around me at the harbor. We could test the theory."
        ]
      }
    ]
  },
  {
    "open": [
      "My expedition leaves next week. Tonight I want a date with you, with absolutely no discussion of packing."
    ],
    "opts": [
      {
        "t": "Offer dinner.",
        "r": [
          "Perfect. Sit beside me. I want to reach for your hand."
        ]
      },
      {
        "t": "Suggest a sunset walk.",
        "r": [
          "Yes. Somewhere we can stop without blocking the whole harbor."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve finished my field notes. You have my complete attention, and I’d like yours considerably closer."
    ],
    "opts": [
      {
        "t": "Sit with her.",
        "r": [
          "Much better. I’ve been wanting to kiss you through three pages of rainfall records."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Come on, then. I know where I want to spend the evening."
        ]
      }
    ]
  },
  {
    "open": [
      "I love coming back to you. Will you stay for supper? I don’t want to rush saying goodnight."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Kiss me hello again. I’m particularly fond of that part."
        ]
      },
      {
        "t": "Offer to cook together.",
        "r": [
          "I’d like that. Though I may be rather bad at concentrating."
        ]
      }
    ]
  }
],
  gift:['You remembered my favorite color. I’m keeping this, and I’d like to keep your company tonight.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 // ---------------- Wanda, Scarlet Witch (Fatherhood) ----------------
 wanda:{
  visit:[
  {
    "open": [
      "I was thinking about your hands. Then you knocked. Come here before I start smiling like an idiot."
    ],
    "opts": [
      {
        "t": "Take her hands.",
        "r": [
          "Yes. These. Right where I wanted them."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Oh. That was worth being distracted for."
        ]
      }
    ]
  },
  {
    "open": [
      "I made dinner. The candles lit themselves when I heard you outside. Apparently I’m not subtle tonight."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "Good. I want you near me, not at the other end of the table."
        ]
      },
      {
        "t": "Tell her you’re glad.",
        "r": [
          "Then let me kiss you before the food gets cold."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me? Slowly. I want to feel your arms around me for a whole song."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "There. The music can keep playing as long as we like."
        ]
      },
      {
        "t": "Ask her to lead.",
        "r": [
          "All right. But stay close. That’s the part I care about."
        ]
      }
    ]
  },
  {
    "open": [
      "I could move that chair with a thought. I’d rather you came over because you wanted to kiss me."
    ],
    "opts": [
      {
        "t": "Come to her.",
        "r": [
          "Yes. That’s much better than magic."
        ]
      },
      {
        "t": "Invite her into your arms.",
        "r": [
          "I was hoping you’d do that. Hold me a little longer."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I’ve spent the day looking forward to having you all to myself."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I’m putting the dishes aside. Come sit with me."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Yes. That’s exactly how I’d like the evening to start."
        ]
      }
    ]
  }
],
  gift:['You thought of me while you were out. I like knowing I was on your mind. You’ve been on mine.','* A faint scarlet glow surrounds the gift for a moment. She’s smiling.','I’ll keep it on the windowsill. I’ll see it every morning while I make the boys breakfast.']},

 // ---------------- Jean, Phoenix (Fatherhood) ----------------
 jean:{
  visit:[
  {
    "open": [
      "I don’t need telepathy to notice that look. Come here and tell me what you’re thinking."
    ],
    "opts": [
      {
        "t": "Ask to kiss her.",
        "r": [
          "Yes. That matches what I was hoping for."
        ]
      },
      {
        "t": "Ask what she wants.",
        "r": [
          "Your arms around me. A quiet evening. No interruptions."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve closed the office. Tonight I want to be the woman taking you on a date."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you. I’ve been waiting all afternoon to do this."
        ]
      },
      {
        "t": "Suggest dinner together.",
        "r": [
          "Beside you, not across the table. I like being able to touch your hand."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been distracting me since you walked in. I’m willing to let you continue at closer range."
    ],
    "opts": [
      {
        "t": "Move closer.",
        "r": [
          "There you are. Now kiss me slowly."
        ]
      },
      {
        "t": "Invite her to sit.",
        "r": [
          "Only if you put your arm around me. I’m feeling very clear about that."
        ]
      }
    ]
  },
  {
    "open": [
      "I promised myself I’d stop working at sunset. You’re making that promise easy to keep."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Good. Walk me home. We can linger on the way."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. Let me put these files somewhere I won’t think about them."
        ]
      }
    ]
  },
  {
    "open": [
      "I want another evening with you that runs late because neither of us wants to leave."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "Then come here. We can start with the kiss I’ve been thinking about."
        ]
      },
      {
        "t": "Invite her over.",
        "r": [
          "I’d love that. Save me the place right against you."
        ]
      }
    ]
  }
],
  gift:['I could have peeked. I didn’t. I like being surprised by you. Especially like this.','* Her cheeks go as red as her hair. She hugs it close.','It’s going on my desk. The kids will ask, and I’ll tell them it’s from someone special. They’ll groan.']},
};

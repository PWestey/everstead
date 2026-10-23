// Family "visit" and "gift" moments, part B.
// visit: pops up once a day on "Spend time together". gift: one reaction line when he gives her a gift.
// M = {open:[lines], opts:[{t:'player line', r:[reply lines]}]}. Lines starting "* " are narration.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 kira:{
  visit:[
  {
    "open": [
      "Training’s done. I’m going to kiss you now, unless you have an objection worth hearing."
    ],
    "opts": [
      {
        "t": "Tell her to proceed.",
        "r": [
          "Excellent briefing. No notes."
        ]
      },
      {
        "t": "Meet her halfway.",
        "r": [
          "Oh, I like that. Keep the initiative."
        ]
      }
    ]
  },
  {
    "open": [
      "I cleared my evening. You, me, dinner. Possibly a terrible decision about how late we stay out."
    ],
    "opts": [
      {
        "t": "Accept the date.",
        "r": [
          "Great. Wear that smile. It’s doing things to my concentration."
        ]
      },
      {
        "t": "Suggest staying in.",
        "r": [
          "Also an excellent plan. Especially the part where I get you to myself."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at my mouth. Come closer. We can solve this mystery together."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yep. Mystery solved. Further investigation strongly recommended."
        ]
      },
      {
        "t": "Ask what she’s thinking.",
        "r": [
          "That I should’ve asked you over an hour ago."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve put the saber away. If you want to distract me now, you have my full support."
    ],
    "opts": [
      {
        "t": "Pull her close.",
        "r": [
          "There it is. My favorite kind of interruption."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Sure. Hands here. This lesson’s much more fun."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I’m comfortable, you’re warm, and I haven’t finished kissing you."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Good. I was going to make a very persuasive argument."
        ]
      },
      {
        "t": "Ask for that argument.",
        "r": [
          "Come here. It’s easier to demonstrate."
        ]
      }
    ]
  }
],
  gift:['You’re making sarcasm difficult. Fine. I love it. Now come here and make it impossible.','Okay, I love it. I love that you thought of me even more. Get over here.','A present? You’re making it really hard to stay sarcastic. I’ll manage, though.']},

 fannie:{
  visit:[
  {
    "open": [
      "I found a trail with a lovely secluded clearing. Want to help me put it to thoroughly romantic use?"
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Thought you’d like that. I packed a blanket, too."
        ]
      },
      {
        "t": "Ask about the route.",
        "r": [
          "Short hike. Long picnic. Very long goodbye kiss, if we get that far."
        ]
      }
    ]
  },
  {
    "open": [
      "You look good after a run. Come sit with me while I enjoy the view."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "Closer. I’ve been waiting for an excuse to put my head on your shoulder."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Yes! Let me catch my breath first. Actually, come here."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve explored half the valley today. Now I’d like to spend an hour discovering how you kiss."
    ],
    "opts": [
      {
        "t": "Accept her invitation.",
        "r": [
          "Wonderful. My favorite sort of field research."
        ]
      },
      {
        "t": "Invite her to dinner first.",
        "r": [
          "A sensible itinerary. I reserve the right to interrupt it."
        ]
      }
    ]
  },
  {
    "open": [
      "Leave the boots by the door. We’re staying in tonight, and I want you on the sofa with me."
    ],
    "opts": [
      {
        "t": "Settle beside her.",
        "r": [
          "Perfect. Put your arms around me. We’ve walked enough for one day."
        ]
      },
      {
        "t": "Offer to cook.",
        "r": [
          "Together, then. I’ll try not to distract you too badly."
        ]
      }
    ]
  },
  {
    "open": [
      "Sunset walk? No racing. I want your hand in mine, and I intend to stop quite often."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Good. There’s a spot just ahead where I’m going to kiss you."
        ]
      },
      {
        "t": "Ask why wait.",
        "r": [
          "Excellent point. Come here."
        ]
      }
    ]
  }
],
  gift:['I’ve crossed half the map for good company. You keep making me want to stay in one place.','You found this for me? Okay, now I have to kiss you. Explorer rules. I don’t make them.','Best treasure I’ve ever found, and I didn’t even have to dig! Thank you!']},

 rey:{
  visit:[
  {
    "open": [
      "I finished the repairs. I was hoping you’d stay so I could kiss you without grease on my hands."
    ],
    "opts": [
      {
        "t": "Step closer.",
        "r": [
          "All right. This part I’ve been looking forward to."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "There. Clean hands. Considerably less steady than before you arrived."
        ]
      }
    ]
  },
  {
    "open": [
      "Will you walk with me? I want a quiet evening with you, and I don’t want to pretend it’s training."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. I know a place where we can sit close."
        ]
      },
      {
        "t": "Invite her to dinner.",
        "r": [
          "Yes. Then perhaps that walk, if you still want my company."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep leaning over my shoulder. It’s making this very difficult. I’d rather turn around and kiss you."
    ],
    "opts": [
      {
        "t": "Ask her to.",
        "r": [
          "Put the tool down for me. Thank you. Now come here."
        ]
      },
      {
        "t": "Offer to finish the repair.",
        "r": [
          "Together. Then I want your attention entirely to myself."
        ]
      }
    ]
  },
  {
    "open": [
      "I used to save every good thing for later. I don’t want to do that with you."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Then stay. I want to enjoy tonight while we have it."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That’s what I meant. Exactly that."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. The fire’s warm, but I’ve decided I prefer being in your arms."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "That’s better. I could stay here a very long time."
        ]
      },
      {
        "t": "Ask for another kiss.",
        "r": [
          "You don’t need to persuade me. Come closer."
        ]
      }
    ]
  }
],
  gift:['Something I didn’t have to salvage. You really do listen. Come here. I want to kiss you.','Oh. Oh, that’s beautiful. I don’t even know what to trade you for it.','It’s going somewhere safe. Close to me. Like you, honestly.']},

 nemona:{
  visit:[
  {
    "open": [
      "Practice is over. I’ve wanted to kiss you since the warm-up, and I’m done waiting to ask."
    ],
    "opts": [
      {
        "t": "Say yes.",
        "r": [
          "Great. Come here. I’m much better at being direct."
        ]
      },
      {
        "t": "Step closer.",
        "r": [
          "Oh, good. I like a partner who meets me halfway."
        ]
      }
    ]
  },
  {
    "open": [
      "My training program can survive an evening without me. Want to take its director on a date?"
    ],
    "opts": [
      {
        "t": "Offer dinner.",
        "r": [
          "Yes! Somewhere we can sit close. I’ve had enough distance for one day."
        ]
      },
      {
        "t": "Suggest a walk.",
        "r": [
          "Perfect. No racing, though. I want to hold your hand."
        ]
      }
    ]
  },
  {
    "open": [
      "You know what I like about you? That look right before you kiss me. Do it again."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That. Definitely worth coming over for."
        ]
      },
      {
        "t": "Pull her close.",
        "r": [
          "Also a very good answer. I’m keeping you here a minute."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m trying to concentrate on next week’s roster. You’re making me want to close it and come sit in your lap."
    ],
    "opts": [
      {
        "t": "Make room.",
        "r": [
          "Roster closed. Honestly, this is a much better use of my evening."
        ]
      },
      {
        "t": "Invite her out instead.",
        "r": [
          "Yes. Let me lock up. I want your undivided attention."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked us the whole evening. Supper, a walk, and no hurried goodnight at the door."
    ],
    "opts": [
      {
        "t": "Accept the plan.",
        "r": [
          "Excellent. I’ve been looking forward to having you to myself."
        ]
      },
      {
        "t": "Start with a kiss.",
        "r": [
          "That is a very strong opening. I approve."
        ]
      }
    ]
  }
],
  gift:['You remembered what I like. Your turn: I’d like to take you out tonight. My treat.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 karlach:{
  visit:[
  {
    "open": [
      "Soldier! There you are. I’ve wanted to kiss you all bloody day. Come here?"
    ],
    "opts": [
      {
        "t": "Go to her.",
        "r": [
          "Oh, yes. That’s better than every plan I had this morning."
        ]
      },
      {
        "t": "Open your arms.",
        "r": [
          "Best invitation I’ve had all week. Hold on tight."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve got dinner, a blanket, and a truly embarrassing amount of enthusiasm about sitting beside you."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "Closer. Yes! Gods, I love getting to do this."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Ha! You read my mind. Do it again."
        ]
      }
    ]
  },
  {
    "open": [
      "You look good. Really good. I had something clever planned, but now I just want your hands on my waist."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "There. That’s the stuff. Dance with me?"
        ]
      },
      {
        "t": "Offer her a date.",
        "r": [
          "Absolutely. I’m already grinning like an idiot. Let’s go."
        ]
      }
    ]
  },
  {
    "open": [
      "No fights tonight. I want a door I can close and an evening where I get to keep kissing you."
    ],
    "opts": [
      {
        "t": "Invite her in.",
        "r": [
          "Oh, hell yes. Come here first, though."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Look at us. A whole evening. I’m going to enjoy every minute."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay on this sofa with me. I like the weight of your arm around me more than I can explain."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Kiss me before I get all soppy about it."
        ]
      },
      {
        "t": "Tell her you understand.",
        "r": [
          "Yeah? Then come closer. We don’t have to explain a damn thing."
        ]
      }
    ]
  }
],
  gift:['For me? You sweetheart. Let me put it somewhere safe. I want to kiss you with both hands free.','You absolute sweetheart. My engine’s doing the loud thing again.','I love it! Not as much as I love that you thought of me. But close. Really close.']},

 shallan:{
  visit:[
  {
    "open": [
      "I meant to sketch your face. I’ve spent ten minutes drawing your mouth. We should probably address that."
    ],
    "opts": [
      {
        "t": "Offer a kiss.",
        "r": [
          "Excellent. A practical solution to an artistic difficulty."
        ]
      },
      {
        "t": "Ask to see the sketch.",
        "r": [
          "After you sit closer. I’m still studying my subject."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve devised a brilliant excuse to take you out tonight. Shall I deliver it, or would you prefer the invitation?"
    ],
    "opts": [
      {
        "t": "Ask her out.",
        "r": [
          "Oh. You’ve ruined three minutes of excellent rhetoric. Happily, yes."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "That works, too. I’m remarkably easy to persuade when I want something."
        ]
      }
    ]
  },
  {
    "open": [
      "Pattern has been very smug about how often I look at you. Come here and make him insufferable."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. Worth whatever commentary follows."
        ]
      },
      {
        "t": "Invite her to dance.",
        "r": [
          "Gladly. Perhaps he’ll be too busy counting our steps to count my blushes."
        ]
      }
    ]
  },
  {
    "open": [
      "I’m putting the sketchbook away. Tonight I’d rather remember what it feels like to be held by you."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "There. Considerably better than charcoal."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I was rather hoping the request was implied by my proximity."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I have wine, terrible jokes, and a very good reason to sit closer."
    ],
    "opts": [
      {
        "t": "Ask about the reason.",
        "r": [
          "Your mouth. I thought I’d try being concise for once."
        ]
      },
      {
        "t": "Pull her gently closer.",
        "r": [
          "An eloquent response. I should let you do more of the talking."
        ]
      }
    ]
  }
],
  gift:['Oh, you remembered. I’ll draw it later. Right now I’d rather find out how you kiss.','Oh, this is lovely. I’m speechless, which happens about once a year. Savor it.','You have excellent taste. In gifts, I mean. Also in company. Mostly in company.']},

 jaina:{
  visit:[
  {
    "open": [
      "The harbor reports are finished. I’d like your hands on my waist and absolutely no discussion of shipping."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Thank you. I’ve been thinking about this since noon."
        ]
      },
      {
        "t": "Ask her to dance.",
        "r": [
          "Yes. Slowly. Nobody needs us to lead anything tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I dismissed the last meeting early. Come walk with me before someone discovers I’m enjoying myself."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Good. There’s a quiet stretch by the water where I want to kiss you."
        ]
      },
      {
        "t": "Kiss her now.",
        "r": [
          "Mm. An excellent argument for leaving sooner."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me. Deliberately, I suspect. I’m willing to put the book down if you come closer."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. Now I can enjoy the distraction properly."
        ]
      },
      {
        "t": "Ask what she wants.",
        "r": [
          "An evening with you. A long one. Starting right here."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve chilled the wine, lit the fire, and cleared my evening. Your part is to stay."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Sit beside me. I want to be able to reach you."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Yes. I was hoping you’d begin there."
        ]
      }
    ]
  },
  {
    "open": [
      "I keep thinking about our last goodnight. Tonight I’d rather not spend half the evening anticipating the door."
    ],
    "opts": [
      {
        "t": "Invite her to stay.",
        "r": [
          "I’d like that. Take my hand. Let’s stop watching the clock."
        ]
      },
      {
        "t": "Ask for another kiss.",
        "r": [
          "Gladly. This one can take as long as we want."
        ]
      }
    ]
  }
],
  gift:['Thoughtful, and chosen for me rather than the Lord Admiral. I’d like to thank you somewhere quieter.','Oh. You remembered. That means more than you know. More than I’ll say, anyway.','You spoil me, and I’m far too old and far too powerful to object. Thank you.']},

 nash:{
  visit:[
  {
    "open": [
      "Job’s done. Payment cleared. Now I’d like to spend my evening kissing you. Interested?"
    ],
    "opts": [
      {
        "t": "Very.",
        "r": [
          "Good answer. Come closer and substantiate it."
        ]
      },
      {
        "t": "Offer dinner first.",
        "r": [
          "A man with a plan. I like that. I also like dessert."
        ]
      }
    ]
  },
  {
    "open": [
      "I bought two tickets. Before you ask, this is a date. I’m off the clock and very much looking at you."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Smooth. Keep that up and we’ll miss the opening act."
        ]
      },
      {
        "t": "Ask for a preview.",
        "r": [
          "Of the show? No. Of how I kiss? Absolutely."
        ]
      }
    ]
  },
  {
    "open": [
      "You look distracting. I’m going to need you over here while I assess the situation."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "Assessment complete. I want another kiss."
        ]
      },
      {
        "t": "Pull up a chair.",
        "r": [
          "Beside me. This is a close-range investigation."
        ]
      }
    ]
  },
  {
    "open": [
      "No bounty tonight. Just supper with you and a door nobody gets to knock on."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Excellent. I’m charging interruptions a truly offensive rate."
        ]
      },
      {
        "t": "Offer to cook.",
        "r": [
          "Sure. I’ll provide company and an unreasonable amount of distraction."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I had a lovely exit line, but I’d rather keep you here with me."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "That was better than my line. Significantly."
        ]
      },
      {
        "t": "Ask what she wants.",
        "r": [
          "Your arm around me. Your full attention. Another hour, at least."
        ]
      }
    ]
  }
],
  gift:['No contract attached? I like that. Let me take you out and say thank you properly.','Shiny. I like it. Like the fella who gave it to me even more.','Keepin’ this. You just bought yourself a whole lotta goodwill, partner. Don’t spend it all at once.']},

 carol:{
  visit:[
  {
    "open": [
      "I flew halfway across the valley thinking about kissing you. Don’t make me land for nothing."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Now that was worth the trip."
        ]
      },
      {
        "t": "Open your arms.",
        "r": [
          "Best landing spot I’ve had all day."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve got the evening free. Let me buy you dinner and make it very obvious this is a date."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Great. I’m enjoying how fast you said yes."
        ]
      },
      {
        "t": "Offer to take her instead.",
        "r": [
          "Sure. Surprise me. Start by taking my hand."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been looking at me across the table all night. Come sit where you can do something about it."
    ],
    "opts": [
      {
        "t": "Move beside her.",
        "r": [
          "That’s more like it. Kiss me."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Absolutely. I want to see that confidence up close."
        ]
      }
    ]
  },
  {
    "open": [
      "No flying off tonight. I want the sofa, your arms around me, and a movie we’ll probably talk through."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Good. Pick something we won’t mind missing bits of."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Excellent start. I’m already enjoying this evening."
        ]
      }
    ]
  },
  {
    "open": [
      "I could stay another hour. Easily. Especially if you keep kissing me like that."
    ],
    "opts": [
      {
        "t": "Ask her to stay.",
        "r": [
          "Done. Come here before I start checking the time."
        ]
      },
      {
        "t": "Invite her on a walk.",
        "r": [
          "Just us? Yes. I know a quiet place by the water."
        ]
      }
    ]
  }
],
  gift:['You chose something just for me. No mission, no medal. Come closer, I want to thank you.','Love it. Got it. Never letting it go. Kinda like you.','You know I can fly anywhere and buy anything, right? This is better. You picked it.']},

 gamora:{
  visit:[
  {
    "open": [
      "Put the blade away. Training is finished. I want to kiss you, and I would prefer fewer sharp objects."
    ],
    "opts": [
      {
        "t": "Set it aside.",
        "r": [
          "Sensible. Come here."
        ]
      },
      {
        "t": "Step closer.",
        "r": [
          "Yes. That is what I meant."
        ]
      }
    ]
  },
  {
    "open": [
      "I made time for us tonight. I want dinner with you, somewhere nobody from the crew will find us."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "I know you can walk beside me without it. I like it anyway."
        ]
      },
      {
        "t": "Ask about afterward.",
        "r": [
          "A longer walk. Somewhere I can stop and kiss you."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re watching me. I don’t mind. I’d like you closer, though."
    ],
    "opts": [
      {
        "t": "Move closer.",
        "r": [
          "Good. Now I can stop pretending to read."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Stay. I want this evening with you."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve spent enough of today anticipating trouble. I’d rather anticipate another kiss from you."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Much better. I was right to come here."
        ]
      },
      {
        "t": "Invite her to sit.",
        "r": [
          "Beside you. I want your arm around me."
        ]
      }
    ]
  },
  {
    "open": [
      "Don’t leave yet. I’m enjoying you being here, and I haven’t finished showing you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Then come back within reach."
        ]
      },
      {
        "t": "Ask her to show you.",
        "r": [
          "Gladly. Put your hands on my waist."
        ]
      }
    ]
  }
],
  gift:['You chose well. I would like to thank you with a kiss. Is that clear enough?','People usually give me weapons. Or try to stab me with them. I prefer this.','Thank you. I will guard it with my life. And possibly with yours.']},

 kate:{
  visit:[
  {
    "open": [
      "I put the bow away. Now I can concentrate on wanting to kiss you without accidentally hitting a lamp."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Great. Much better hobby for the evening."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Wow, yes. I should put the bow away more often."
        ]
      }
    ]
  },
  {
    "open": [
      "Dinner with me tonight? Lucky has been fed, the roof isn’t leaking, and I look extremely good in this jacket."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Thank you for appreciating the entire presentation."
        ]
      },
      {
        "t": "Compliment the jacket.",
        "r": [
          "Wait until you see how well it goes with your arm around me."
        ]
      }
    ]
  },
  {
    "open": [
      "You’ve been smiling at me through this whole repair. Come here and tell me what’s so distracting."
    ],
    "opts": [
      {
        "t": "Ask for a kiss.",
        "r": [
          "That was also my leading theory. Let’s test it."
        ]
      },
      {
        "t": "Take her hand.",
        "r": [
          "Careful, I’m going to forget what we were fixing. Happily."
        ]
      }
    ]
  },
  {
    "open": [
      "I want a movie night. Specifically the sort where I get comfortable against you and forget the plot."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Perfect. Put your arm here. Yes, that’s the entire seating plan."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Excellent. Strong beginning. Five stars."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a little longer. I’m having far too much fun kissing you to start being sensible now."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Thank you. I have no sensible plans whatsoever."
        ]
      },
      {
        "t": "Offer to walk her home.",
        "r": [
          "Slowly. I want stops. Several stops."
        ]
      }
    ]
  }
],
  gift:['Okay, you remembered. That’s unfairly attractive. Can I kiss you before I say anything less composed?','Wait, you got me something? I’m terrible at receiving. Hug me before I make it weird.','Perfect. Total bullseye. You know me way too well.']},

 gwen:{
  visit:[
  {
    "open": [
      "Rehearsal’s over. I’ve been looking at your mouth between songs. Want to help me do something about that?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Okay. Yeah. Better than the song stuck in my head."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Tonight? Yes. Give me two minutes to lock the studio."
        ]
      }
    ]
  },
  {
    "open": [
      "I got us a table after the show. Just us. I want a date where I can actually hear you flirt."
    ],
    "opts": [
      {
        "t": "Offer your hand.",
        "r": [
          "Good start. I like how direct you’re getting."
        ]
      },
      {
        "t": "Flirt now.",
        "r": [
          "Keep talking. I’m enjoying this much more than soundcheck."
        ]
      }
    ]
  },
  {
    "open": [
      "You can sit closer. I promise the couch isn’t reserved for people I don’t want to kiss."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There you go. I’ve been waiting for that."
        ]
      },
      {
        "t": "Ask about kissing.",
        "r": [
          "Yes. Definitely yes. Come here."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve had enough noise today. Walk with me? I want your hand in mine and a quiet place to stop."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "This is good. I missed you during that endless rehearsal."
        ]
      },
      {
        "t": "Kiss her before leaving.",
        "r": [
          "Also good. We might be a little late for the walk."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want to put a record on and spend the evening close to you."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Great. No schedule. I’m tired of counting minutes with you."
        ]
      },
      {
        "t": "Offer a slow dance.",
        "r": [
          "Yes. Hands on my waist. I like this plan already."
        ]
      }
    ]
  }
],
  gift:['You remembered. I was going to play it cool. I’d rather take your hand and ask you out.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 ororo:{
  visit:[
  {
    "open": [
      "I cleared the terrace for us. Come sit beside me. I have been looking forward to kissing you."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. Now the evening is beginning properly."
        ]
      },
      {
        "t": "Offer her your hand.",
        "r": [
          "Warm. Stay close. I have missed your touch today."
        ]
      }
    ]
  },
  {
    "open": [
      "You look lovely in this light. Let me enjoy you a moment before we go anywhere."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Yes. That is precisely the distance I had in mind."
        ]
      },
      {
        "t": "Invite her to dance.",
        "r": [
          "Gladly. The garden is ours tonight."
        ]
      }
    ]
  },
  {
    "open": [
      "I have spent the day with my hands in the soil. Now I would like them around you."
    ],
    "opts": [
      {
        "t": "Embrace her.",
        "r": [
          "Much better. Let the watering wait."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Of course. Come where I can reach you comfortably."
        ]
      }
    ]
  },
  {
    "open": [
      "The rain will pass. Stay with me until it does. We may decide to stay longer."
    ],
    "opts": [
      {
        "t": "Sit against her.",
        "r": [
          "I rather hoped you would choose this spot."
        ]
      },
      {
        "t": "Ask how long.",
        "r": [
          "Long enough for supper and several unhurried kisses."
        ]
      }
    ]
  },
  {
    "open": [
      "I want your company tonight, without a meeting or a clock between us."
    ],
    "opts": [
      {
        "t": "Promise her the evening.",
        "r": [
          "Then take my hand. I know where I want to begin."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Yes. Here is a very good beginning."
        ]
      }
    ]
  }
],
  gift:['How thoughtful. Set it by the flowers. I would rather hold your hands for a moment.','Thank you. A gift given with care grows into something. Like a seed. Like this.','You are thoughtful. The sky brightens when you smile like that. That one was not me.']},

 annamarie:{
  visit:[
  {
    "open": [
      "Come sit by me, sugar. I’ve been wanting your arm around my shoulders all afternoon."
    ],
    "opts": [
      {
        "t": "Hold her close.",
        "r": [
          "There. Keep that sleeve between us and hold me a little longer."
        ]
      },
      {
        "t": "Take her gloved hand.",
        "r": [
          "Mm. I like how carefully you do that. Doesn’t make it any less romantic."
        ]
      }
    ]
  },
  {
    "open": [
      "I dressed up for you. Gloves and all. You taking me dancing, or am I stealing you off this porch?"
    ],
    "opts": [
      {
        "t": "Offer a dance.",
        "r": [
          "Hands on my covered waist, handsome. That’s where I want ’em."
        ]
      },
      {
        "t": "Offer your arm.",
        "r": [
          "Good. I intend to enjoy the way you look at me all evening."
        ]
      }
    ]
  },
  {
    "open": [
      "I keep thinking about you holding me. We don’t have to be careless to have a good time, you know."
    ],
    "opts": [
      {
        "t": "Open your arms.",
        "r": [
          "Perfect. Nice and close, with the fabric where we need it."
        ]
      },
      {
        "t": "Invite her beside you.",
        "r": [
          "Now put that arm around me. I’ve missed being right here."
        ]
      }
    ]
  },
  {
    "open": [
      "Two glasses of tea, one very comfortable porch swing, and a woman who wants you closer. Take the hint, sugar."
    ],
    "opts": [
      {
        "t": "Sit against her.",
        "r": [
          "That’s it. I’ve been smiling about this since I made the tea."
        ]
      },
      {
        "t": "Hold her gloved hand.",
        "r": [
          "You make a simple thing feel mighty good."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper? I want a slow dance and your cheek against my hair. We can take our time."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Mm. You remember exactly how I like to be held."
        ]
      },
      {
        "t": "Promise her the evening.",
        "r": [
          "Good. Come here, handsome. Let’s make ourselves comfortable."
        ]
      }
    ]
  }
],
  gift:['Oh, sugar. You remembered. Sit beside me. I’ve got a long thank-you and nowhere I need to rush off to.','Oh, honey, it’s perfect. It’s goin’ right on my nightstand.','You spoil me, sugar. Keep on doin’ it. I like bein’ spoiled by you.']},

 violet:{
  visit:[
  {
    "open": [
      "The dragons can wait. I’ve spent half the morning thinking about kissing you, and I’d like to concentrate on that."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Better. I finally finished a thought."
        ]
      },
      {
        "t": "Ask about the dragons.",
        "r": [
          "Tairn can survive an evening without an audience. Come closer."
        ]
      }
    ]
  },
  {
    "open": [
      "I finished the reading. Take me somewhere I can stop being prepared and enjoy wanting you."
    ],
    "opts": [
      {
        "t": "Offer dinner.",
        "r": [
          "Yes. Sit beside me. I want your hand in mine."
        ]
      },
      {
        "t": "Suggest a quiet walk.",
        "r": [
          "Perfect. Somewhere with plenty of opportunities to stop."
        ]
      }
    ]
  },
  {
    "open": [
      "You leaning over my shoulder is making these notes impossible. I’d rather you turned my chair around."
    ],
    "opts": [
      {
        "t": "Turn toward her.",
        "r": [
          "There. That’s who I wanted to be looking at."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Yes. I’ve read the same line four times waiting for you to ask."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay tonight for supper. I’ve got candles, an empty schedule, and very little interest in being sensible."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Kiss me hello properly. We’ve been too busy today."
        ]
      },
      {
        "t": "Offer to cook.",
        "r": [
          "Together. I reserve the right to distract you."
        ]
      }
    ]
  },
  {
    "open": [
      "I don’t want another hurried goodbye. Sit with me. I want to remember how this feels tomorrow."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "That’s it. Let everything else wait a little."
        ]
      },
      {
        "t": "Kiss her slowly.",
        "r": [
          "Yes. Exactly like that. We have time."
        ]
      }
    ]
  }
],
  gift:['You paid attention. That’s far more dangerous than any dagger on my shelf. Come here.','You thought of me. That’s the actual gift. Thank you.','It’s going right next to my daggers. That’s the most honored shelf I own.']},

 alleria:{
  visit:[
  {
    "open": [
      "My patrol is finished. Come closer. I’ve wanted to kiss you since I saw you at the gate."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Good. I dislike leaving things unfinished."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Walk with me. Somewhere quieter than this."
        ]
      }
    ]
  },
  {
    "open": [
      "I found a sheltered clearing. I want an evening there with you, without anyone calling for a ranger."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Bring wine. I will bring every intention of keeping you close."
        ]
      },
      {
        "t": "Ask for a preview.",
        "r": [
          "Come within reach, then."
        ]
      }
    ]
  },
  {
    "open": [
      "You are making it difficult to inspect this bowstring. I think I would prefer to inspect that smile."
    ],
    "opts": [
      {
        "t": "Move closer.",
        "r": [
          "There. Now put your arms around me."
        ]
      },
      {
        "t": "Offer to help.",
        "r": [
          "Put the bow away for me. I have better plans for my hands."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit beside me. The fire is warm, but it is not what I have missed today."
    ],
    "opts": [
      {
        "t": "Hold her close.",
        "r": [
          "Yes. You understand."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "I was wondering when you would stop looking and ask."
        ]
      }
    ]
  },
  {
    "open": [
      "No patrol tonight. I want supper, your company, and an unhurried walk home together."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Take my hand. We can start slowly."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "A promising beginning. Stay here a moment."
        ]
      }
    ]
  }
],
  gift:['A thoughtful gift. I have something to ask in return: spend the evening with me.','You remembered what I like. Few do. My own sisters forget.','Thank you. I will think of you whenever I see it. Which will be often.']},

 vex:{
  visit:[
  {
    "open": [
      "Darling, I put on this dress to have dinner with you. Do try to look suitably distracted."
    ],
    "opts": [
      {
        "t": "Offer your arm.",
        "r": [
          "Much better. Kiss me before we leave."
        ]
      },
      {
        "t": "Compliment her.",
        "r": [
          "Come closer. I prefer compliments where I can do something about them."
        ]
      }
    ]
  },
  {
    "open": [
      "I found a lovely secluded spot. Normally I’d charge for directions. For you, I’ll accept a kiss."
    ],
    "opts": [
      {
        "t": "Pay her price.",
        "r": [
          "Generous. I may have to revise the rate upward."
        ]
      },
      {
        "t": "Offer another date.",
        "r": [
          "You bargain beautifully. I accept both."
        ]
      }
    ]
  },
  {
    "open": [
      "Trinket’s fed, my bow’s put away, and you’re standing much too far from the sofa."
    ],
    "opts": [
      {
        "t": "Sit beside her.",
        "r": [
          "There. I’ve been saving this space for your arm."
        ]
      },
      {
        "t": "Draw her close.",
        "r": [
          "Oh, I do like being understood so quickly."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve spent all afternoon imagining you dancing with me. Shall we see whether you live up to expectations?"
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Hands here. Yes, darling. You’re doing very well."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "An excellent way to influence the judging."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay. I haven’t finished the wine, and I certainly haven’t finished enjoying you."
    ],
    "opts": [
      {
        "t": "Stay close.",
        "r": [
          "Good. Another kiss, then. Slowly."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I was hoping you’d ask before I had to be more obvious."
        ]
      }
    ]
  }
],
  gift:['Darling, you remembered. That’s worth much more than the price. Come claim a proper thank-you.','Darling, you shouldn’t have. Do it again anyway. Often.','How generous. I’m keeping this, and you, very carefully. Vax would call it hoarding. Vax is jealous.']},

 laezel:{
  visit:[
  {
    "open": [
      "I desire your company. Come closer so I may decide how much of this evening to spend kissing you."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "A considerable amount. I have decided."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Direct. Good. Take me somewhere private."
        ]
      }
    ]
  },
  {
    "open": [
      "Your training is finished. I want your attention now. Entirely."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. Apply that focus again."
        ]
      },
      {
        "t": "Invite her to dinner.",
        "r": [
          "Acceptable. Sit close. I have no interest in calling across a table."
        ]
      }
    ]
  },
  {
    "open": [
      "You hesitate every time I touch your arm. Tell me whether you wish me to continue."
    ],
    "opts": [
      {
        "t": "Ask her to stay close.",
        "r": [
          "Then I shall. You need not conceal your pleasure in my company."
        ]
      },
      {
        "t": "Draw her into an embrace.",
        "r": [
          "A clear answer. I prefer it."
        ]
      }
    ]
  },
  {
    "open": [
      "I have set aside the evening. No drills. No interruptions. You and I have better uses for it."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "Put your hands on my waist. I want another kiss."
        ]
      },
      {
        "t": "Ask her to walk.",
        "r": [
          "Somewhere quiet. I intend to stop often."
        ]
      }
    ]
  },
  {
    "open": [
      "Remain beside me. I am not tired of your touch, and I see no reason to pretend otherwise."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "Good. This is where I want you."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Again. We are in no hurry tonight."
        ]
      }
    ]
  }
],
  gift:['You brought this for me. I accept. Now tell me if you would welcome a kiss.','Tch. Sentiment. I will keep it anyway. For tactical reasons.','You honor me. I will repay it with an extremely rigorous training session. At dawn.']},

 natasha:{
  visit:[
  {
    "open": [
      "I’ve checked the exits. Now I’d like to stop being professional and kiss you."
    ],
    "opts": [
      {
        "t": "Step closer.",
        "r": [
          "Good. I’ve been thinking about this longer than you suspect."
        ]
      },
      {
        "t": "Offer her a date.",
        "r": [
          "Yes. Somewhere I can sit beside you and forget to watch the door."
        ]
      }
    ]
  },
  {
    "open": [
      "You keep looking at my hands. Come here. I’ll show you where I wanted to put them."
    ],
    "opts": [
      {
        "t": "Take her hands.",
        "r": [
          "Around you. Nothing complicated tonight."
        ]
      },
      {
        "t": "Draw her close.",
        "r": [
          "I like it when you skip the guesswork."
        ]
      }
    ]
  },
  {
    "open": [
      "I reserved the evening. No calls, no favors. Tell me where you’re taking me."
    ],
    "opts": [
      {
        "t": "Suggest dinner.",
        "r": [
          "Good. I want to watch you across a candle, then move much closer."
        ]
      },
      {
        "t": "Suggest staying in.",
        "r": [
          "Even better. I brought wine for precisely that possibility."
        ]
      }
    ]
  },
  {
    "open": [
      "Dance with me. Slowly enough that I can enjoy the way you’re holding me."
    ],
    "opts": [
      {
        "t": "Hold her waist.",
        "r": [
          "There. That’s why I asked."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Also part of the plan. You’re ahead of schedule."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay another hour. I’m enjoying this, and I don’t want to make a mystery out of wanting you."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Come back here. I wasn’t finished kissing you."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. Take my hand. Let’s leave together."
        ]
      }
    ]
  }
],
  gift:['You remembered a small detail. That matters to me. Let me thank you where nobody needs a disguise.','Thank you. Very few people surprise me. You keep doing it.','I’ll keep it. Somewhere nobody else knows about. Not even Fury.']},

 misty:{
  visit:[
  {
    "open": [
      "The Gym’s closed. I’ve spent all afternoon wanting to kiss you. Come here and stop making me wait."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "That’s more like it. I knew taking the evening off was a good idea."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes. Just us, and somewhere Psyduck won’t find the menu."
        ]
      }
    ]
  },
  {
    "open": [
      "I booked a table by the water. This is a date, in case the way I’m holding your hand wasn’t clear."
    ],
    "opts": [
      {
        "t": "Hold her closer.",
        "r": [
          "Good. I like a quick learner."
        ]
      },
      {
        "t": "Ask for a kiss.",
        "r": [
          "Before dinner? Absolutely."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re staring. I like it. I’d like it even more if you came over here."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "There. Now put your arms around me."
        ]
      },
      {
        "t": "Tell her she’s beautiful.",
        "r": [
          "Thank you. You can say that again while we dance."
        ]
      }
    ]
  },
  {
    "open": [
      "No swimming tonight. I want the pier, a blanket, and you right beside me."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "Closer. The blanket’s big, but I’m deliberately not sharing evenly."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "Excellent idea. We might be late getting to the pier."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want to enjoy being with you without checking when you need to leave."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Sit close. I haven’t had enough of you today."
        ]
      },
      {
        "t": "Offer another walk.",
        "r": [
          "Along the water. Slowly. I intend to kiss you on the way."
        ]
      }
    ]
  }
],
  gift:['You remembered what I like. Good. I’d like dinner with you next. I’m asking, not dropping hints.','I remembered you on my way home, too. I was hoping you’d have time for dinner with me.','* She sets the gift somewhere safe and takes your offered hand, smiling. “I’d like to kiss you. May I?”']},

 rumi:{
  visit:[
  {
    "open": [
      "I finished rehearsal. I want to kiss you without counting beats or thinking about the next song."
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Yes. That’s what I’ve been looking forward to."
        ]
      },
      {
        "t": "Offer your hand.",
        "r": [
          "Take me out. Somewhere I can just be with you."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved you a seat beside me. I want your arm around me when the music starts."
    ],
    "opts": [
      {
        "t": "Sit close.",
        "r": [
          "There. Much better than watching you across a room."
        ]
      },
      {
        "t": "Offer a dance.",
        "r": [
          "Yes. Slowly. I’d like to forget the choreography."
        ]
      }
    ]
  },
  {
    "open": [
      "You make it hard to remember what I’m saying. Come closer. I’d rather stop fighting it."
    ],
    "opts": [
      {
        "t": "Approach.",
        "r": [
          "Good. Now I can kiss you instead."
        ]
      },
      {
        "t": "Tell her she has your attention.",
        "r": [
          "All of it? Then let’s put the phones away and keep tonight for us."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve been brave on stage all day. Now I’m being brave about asking you to stay."
    ],
    "opts": [
      {
        "t": "Stay with her.",
        "r": [
          "Thank you. I wanted this to last longer than a goodnight at the door."
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
      "Supper’s ready. Afterward, I want a quiet room, your arms around me, and no reason to hurry."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Good. Come here before we sit down. I missed you today."
        ]
      },
      {
        "t": "Offer to help.",
        "r": [
          "Set two places. Beside each other. I’m feeling very particular about that."
        ]
      }
    ]
  }
],
  gift:['This one’s personal. I can tell. Come sit beside me. I’d like to give you my full attention.','For me? That’s so sweet. I’m writing a song about it. Don’t tell Zoey, she’ll want co-writing credit.','Thank you! It’s going in my dressing room, right by the mirror, where I see it every show.']},

 jester:{
  visit:[
  {
    "open": [
      "I drew you something romantic. But first, can I kiss you? I’ve been waiting ages to ask."
    ],
    "opts": [
      {
        "t": "Say yes.",
        "r": [
          "Wonderful! Come here. The drawing is going to make much more sense afterward."
        ]
      },
      {
        "t": "Ask about the drawing.",
        "r": [
          "It’s us on a date. I’m hoping to make it historically accurate."
        ]
      }
    ]
  },
  {
    "open": [
      "I bought pastries for two. We can eat them in the garden and make everybody jealous of our lovely date."
    ],
    "opts": [
      {
        "t": "Take her hand.",
        "r": [
          "Yes! You’re already improving the composition."
        ]
      },
      {
        "t": "Offer a kiss first.",
        "r": [
          "Oh, excellent. I should bring pastries every time."
        ]
      }
    ]
  },
  {
    "open": [
      "Sit close. I want to lean against you while I paint, and occasionally become terribly distracted."
    ],
    "opts": [
      {
        "t": "Join her.",
        "r": [
          "There. You smell lovely. This painting may take forever."
        ]
      },
      {
        "t": "Ask what distracts her.",
        "r": [
          "Your mouth. Your hands. I could make a list, but kissing you is faster."
        ]
      }
    ]
  },
  {
    "open": [
      "I’ve got a whole evening free! Would you like dinner, dancing, or a very long kiss?"
    ],
    "opts": [
      {
        "t": "Choose the kiss.",
        "r": [
          "I was secretly hoping for that one. Very secretly. Obviously."
        ]
      },
      {
        "t": "Choose dancing.",
        "r": [
          "Yes! Hold me properly. This is the romantic kind."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay with me. I’m having too much fun being kissed by you to go back to being sensible."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Oh, good. I wasn’t going to be very convincing about saying goodbye."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Absolutely. I’ll bring dessert and my extremely good intentions about kissing you."
        ]
      }
    ]
  }
],
  gift:['Oh, I love it. Come here. I want to kiss you, and I’m trying not to hide it behind a pastry.','A present? For me? I’m sketching it right now! Hold it up! Higher!','You’re so sweet! The Traveler is going to be sooo jealous! Don’t tell him I said that.']},

 mira:{
  visit:[
  {
    "open": [
      "Rehearsal’s done. Come here. I’ve wanted your hands on my waist since you walked in."
    ],
    "opts": [
      {
        "t": "Draw her close.",
        "r": [
          "Yeah. That’s where I wanted them."
        ]
      },
      {
        "t": "Ask for a dance.",
        "r": [
          "Slow one. I want to feel this, not count it."
        ]
      }
    ]
  },
  {
    "open": [
      "I changed dinner plans. You’re my date. If you’re interested, take my hand."
    ],
    "opts": [
      {
        "t": "Take it.",
        "r": [
          "Good. You look very good beside me."
        ]
      },
      {
        "t": "Kiss her hello.",
        "r": [
          "Strong start. I like where this evening’s going."
        ]
      }
    ]
  },
  {
    "open": [
      "You’re distracting me. I’m deciding whether to finish this routine or kiss you."
    ],
    "opts": [
      {
        "t": "Vote for the kiss.",
        "r": [
          "Convincing argument. Come closer."
        ]
      },
      {
        "t": "Offer to dance with her.",
        "r": [
          "All right. Stay close enough that I forget the routine anyway."
        ]
      }
    ]
  },
  {
    "open": [
      "No audience tonight. Just us, a good song, and your arms around me."
    ],
    "opts": [
      {
        "t": "Hold her.",
        "r": [
          "There. Don’t rush. I like this pace."
        ]
      },
      {
        "t": "Kiss her.",
        "r": [
          "Mm. Keep doing that."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay after supper. I want more of this evening with you, and I’m not going to be subtle about it."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Put the plates down. Come sit with me."
        ]
      },
      {
        "t": "Offer another kiss.",
        "r": [
          "Exactly what I was thinking."
        ]
      }
    ]
  }
],
  gift:['You remembered. Put it down for a second. I want to kiss you before I get distracted by talking.','Hm. Thoughtful. That’s points. Big points.','You remembered. Nobody remembers. That’s… kind of hot. Thanks.']},

 zoey:{
  visit:[
  {
    "open": [
      "I’ve rewritten this lyric six times because I keep thinking about kissing you. Can we solve that?"
    ],
    "opts": [
      {
        "t": "Kiss her.",
        "r": [
          "Oh. Yeah. That’s definitely making it into the song."
        ]
      },
      {
        "t": "Ask her out.",
        "r": [
          "Yes! Let me close the notebook before I start rhyming your answer."
        ]
      }
    ]
  },
  {
    "open": [
      "Dinner with me tonight? I picked somewhere quiet so I can hear you flirt without asking you to repeat it."
    ],
    "opts": [
      {
        "t": "Accept.",
        "r": [
          "Great. Sit beside me. I’m aiming for very obvious about liking you."
        ]
      },
      {
        "t": "Flirt now.",
        "r": [
          "Okay, wow. Keep that. Say that again when we’re closer."
        ]
      }
    ]
  },
  {
    "open": [
      "I saved you the comfortable end of the couch. Mostly because I intend to lean all over you."
    ],
    "opts": [
      {
        "t": "Sit down.",
        "r": [
          "Perfect. Put your arm here. Excellent seating arrangement."
        ]
      },
      {
        "t": "Offer a kiss.",
        "r": [
          "Yes. I was trying to get to that casually. This works better."
        ]
      }
    ]
  },
  {
    "open": [
      "I want a dance with you. No routine, no filming. Just your hand on my waist."
    ],
    "opts": [
      {
        "t": "Dance with her.",
        "r": [
          "Oh, I like this. We should do this much more often."
        ]
      },
      {
        "t": "Kiss her first.",
        "r": [
          "That’s also very much on tonight’s agenda."
        ]
      }
    ]
  },
  {
    "open": [
      "Stay a little longer? I’m really enjoying being close to you, and I have zero graceful ways to say goodbye."
    ],
    "opts": [
      {
        "t": "Stay.",
        "r": [
          "Good. Then I don’t have to. Come here."
        ]
      },
      {
        "t": "Invite her home.",
        "r": [
          "Yes. I was hoping tonight wouldn’t end at this door."
        ]
      }
    ]
  }
],
  gift:['You remembered. I love that. I’d like to kiss you before I turn this into three verses.','For me? You’re the sweetest! Hug! Big hug! Bigger!','It’s going right on my notebook cover so I see it every single day!']},
};

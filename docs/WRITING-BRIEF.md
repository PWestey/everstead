# Writing brief: Everstead dialogue

Everstead is a personal habit tracker dressed as a cozy RPG village. The player is a real man (a husband
and father) whose daily habits in eight life areas level up his character. The cast are fictional
characters he loves; they live in his village. Read `lib/cast.mjs` for the cast (ids, areas, titles,
descriptions) and `lib/dialogue.mjs` for the Darrow quest "The Iron Body", which the owner loved. Match
its quality: short punchy lines, a real voice for the character, choices that matter emotionally, and
always a thread back to the player's actual habits in that life area.

Life areas: faith (prayer, scripture, gratitude), marriage (his wife: time, attention, date nights),
fatherhood (his kids: presence, play, bedtime), fitness, work (career, deep work, money), home (chores,
upkeep), discipline (focus, screens, routines), hobbies (reading, learning, creating, play).

## Style rules

- Write in each character's own voice, drawing on their story, catchphrases-in-spirit, history and
  relationships, but never quote copyrighted dialogue verbatim. Paraphrase, invent, allude.
- Lines are short: usually under 160 characters, never over 240. One idea per line.
- Use the curly apostrophe ’ inside text (strings are single-quoted JS). Use “ ” for quotes inside text.
- `{name}` is replaced with the player's name. Use it sparingly (about once per conversation).
- No em-dash chains; plain sentences. American spelling is fine.
- Fellows (all male): comradery and motivation. Brotherhood, banter, earned respect, a push to keep
  going. They notice his effort and challenge him the way that character would.
- Family (female): romantic and spicy. Flirtation, tension, teasing, warmth, desire, longing looks,
  a kiss, a hand on the chest, an invitation left hanging. Keep it PG-13: suggestive, never explicit,
  no sex acts or nudity described. Fade to black is fine.
- EXCEPTION, platonic only: Liko, Nemona, Misty, Gwen, Poppy, Lulu and Syl are young or child-presenting characters. Write them as warm,
  funny, admiring friends or a little-sister energy who cheer him on. No romance, no flirting at all.

## File syntax checks

After writing your file, run from the repo root (Git Bash):

    node -e "import('./<your file>').then(m=>console.log(Object.keys(m)))"

and the checker named in your task. Fix anything it reports. Don't edit any other file.

## Sound like real people (added 2026-10-20: this is the owner's top note)

The first draft read like motivational posters: every character spoke in polished, quotable aphorisms, and they all
sounded alike. Rewrite so each line sounds like that specific person talking, out loud, in the moment.

- **Talk, don't pronounce.** Contractions, fragments, interruptions, a half-finished thought, a joke that lands badly.
  At most one "wise" line per conversation, and earn it. Cut lines like "Strength is built in the hours no one sees."
- **Specific beats general.** Mention concrete things from their world and from the moment: Obi-Wan's sand-scoured
  robes and Tatooine, Darrow's Lykos and the mines and Sevro, Kaladin's bridge crew and Syl, Geralt's potions and Roach,
  Tony's workshop and JARVIS-style tinkering, Kelsier's coins and crew, Logan's beer and claws. Their history,
  relationships, habits, gear, places and verbal tics. Paraphrase canon; never quote it verbatim.
- **Each voice is distinct.** If you swapped the name on a line and it still worked, rewrite it. Geralt is terse and dry
  ("Hm."). Deadpool rambles. Steve is earnest and a bit old-fashioned. Kelsier is charming and smug. Grog is simple and
  loud. Jester is bubbly. Lae'zel is blunt and contemptuous. Yennefer is cutting. Match vocabulary, rhythm and attitude.
- **Real reactions to the player.** They tease, notice, ask questions, get distracted, admit things. Praise is concrete
  ("You went for a run in that rain? Idiot. Respect.") rather than abstract.
- **Habits in plain words.** Refer to the player's real life casually (the kids' bedtime, a workout, a date night,
  the phone, the dishes) instead of "your habits" or "showing up."
- Keep it short: most lines under 140 characters.
- Romance stays PG-13 and the platonic characters stay platonic, exactly as above.

## Rewrite mechanics

Change only the words. Every id, speaker id, key, backdrop, flag, effect, the number of lines in each list and the
number of options must stay exactly the same. After editing a file run:

    node scripts/same-shape.mjs <file>        (must print "Same shape: OK")
    node scripts/check-content.mjs <file>      (for quest, moment and expedition-scene files; must print OK)

## Cheers (task-completion pop-ups)

When the player checks off a habit, a character from that habit's life area steps in, nearly full screen, says 1-2
lines, and the player picks one of two RPG-style replies. One reply is always a commitment line the player will love
clicking ("I am committed!", or a version in that character's world: "Bridge Four." is a canon quote, avoid those;
"Next swing." / "Tomorrow too." / "Count me in."). The other is lighter or funnier. The character answers in one line.

Format, in lib/cheers/<group>.mjs:

    export const CHEERS={ <castId>:{
      cheers:[M,M,M,M],    // after a habit in their life area; about THAT area of the player's real life
      codex:'line',        // lead-in before one of the player's own Codex notes is shown, e.g. "You wrote this down. Read it again."
      ack:'line',          // their short reply when the player commits after a Codex note
      done:M,              // when the player finishes every daily for the day
    }}
    M = {open:['1-2 lines they say'], opts:[{t:'player reply',r:['their one-line answer']},{t:'...',r:['...']}]}

Same voice rules as above: natural, specific to their IP, plain words about real life. 15-second read.

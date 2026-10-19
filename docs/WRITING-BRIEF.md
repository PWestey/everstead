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
- EXCEPTION, platonic only: Liko, Nemona, Misty and Gwen are young characters. Write them as warm,
  funny, admiring friends or a little-sister energy who cheer him on. No romance, no flirting at all.

## File syntax checks

After writing your file, run from the repo root (Git Bash):

    node -e "import('./<your file>').then(m=>console.log(Object.keys(m)))"

and the checker named in your task. Fix anything it reports. Don't edit any other file.

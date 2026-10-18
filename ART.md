# Character art guide

Until a file exists, every screen shows a drawn placeholder, so art can arrive one character at a time.

## Where files go

Put images in `public/assets/cast/`, named exactly:

| Who | File |
|---|---|
| You, 5 looks | `player-1.webp` … `player-5.webp` (Wanderer, Squire, Knight, Champion, Legend) |
| Fellows | `aldric.webp`, `bram.webp`, `kael.webp`, `corin.webp`, `tobin.webp`, `ren.webp` |
| Family | `liora.webp`, `maren.webp`, `sable.webp`, `elise.webp`, `wren.webp`, `violet.webp` (done) |

PNG works too: change the extension in `lib/cast.mjs` (`art()` and `PLAYER_STAGES`).

## Format

- **Portrait, about 1024 × 1536** (2:3). Bigger is fine; it is scaled down.
- **Transparent background.** The game draws the village behind the character.
- **Full body or ¾ body**, standing, head in the top third, feet or hips touching the bottom edge.
  The roster cards crop the top of the image, so keep the face well inside the frame.
- **Same framing for everyone**, so switching characters with the arrows feels steady.
- WebP keeps the download small (aim for under 400 KB each).

## Keeping your five looks consistent

1. Make **one master image of you** first, from a photo, using a character-reference feature
   (ChatGPT image generation with your photo attached, or Midjourney's character reference).
2. Generate the other four **from that master**, changing only gear, physique, aura and background glow.
   Keep the pose, camera angle, framing and art style identical.
3. Check them side by side in the Hero screen's **Looks** sheet.

## Prompt starter

Use one style line for every character so they match each other and the village:

> Anime-style fantasy RPG character portrait, cozy medieval village game, soft cel shading,
> warm lighting, full body standing pose facing slightly left, transparent background,
> 2:3 portrait, consistent with a mobile idle-RPG character roster.

Then add the character, for example:

- **You, Wanderer:** simple traveller's clothes, worn cloak, walking staff, hopeful expression.
- **You, Squire:** padded gambeson, short sword, leather bracers, more confident stance.
- **You, Knight:** polished plate over chainmail, blue and gold tabard, longsword, broader shoulders.
- **You, Champion:** ornate engraved armour, flowing cape, faint golden aura, battle-worn but proud.
- **You, Legend:** radiant gilded armour, glowing runes, banner of Everstead, strong golden aura.
- **Kael, Ironhand (Fitness):** muscular brawler, hand wraps, sleeveless tunic, short dark hair, stern.
- **Sable, Huntress (Fitness):** athletic ranger, bow, braided hair, grinning, light leather armour.

Descriptions for everyone are in `lib/cast.mjs`.

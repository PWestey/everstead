# The Card Parlour's chrome: the game's own sprites and fonts

`public/assets/snap-ui/` holds the buttons, frames, plates, orbs, the board, the star field and the two fonts
(Ultimatum Bold Italic, Helvetica Neue Condensed) that the Parlour's CSS draws with. They come out of the Marvel Snap
Android build's bundled-in-app Addressables (the bootstrap content shipped inside the APK; the rest of the game's art
is streamed at runtime and is not in the file). To rebuild the kit after a new APK:

    node scripts/snap-ui/zip.cjs x <the .xapk> <tmp> 'com.nvsgames.snap.apk$'      # the base APK out of the XAPK
    node scripts/snap-ui/zip.cjs x <tmp>/com.nvsgames.snap.apk <tmp>/apk 'assets/aa/Android/.*\.bundle$'
    python -I scripts/snap-ui/export.py <tmp>/apk/assets/aa/Android <tmp>/export 'smalllogos|localization-assets'
    python -I scripts/snap-ui/kit.py <tmp>/export public/assets/snap-ui

Needs Python 3.12 with `pip install UnityPy pillow`. The build strips its Unity version, so the scripts pin
`FALLBACK_UNITY_VERSION` (6000.0.58f2 for 58.15.1; read the new one from the UnityFS header of
`assets/bin/Data/data.unity3d` if a later APK fails to load). `kit.py` names every piece it takes; a few textures are
drawn on opaque black and get their alpha from brightness (`unblack`), and the Retreat / End Turn plates are two halves
of one texture. Do the extraction in a scratch folder, never inside the repo.

# Everstead

A habit tracker that lives inside a cozy village. Complete real habits and your village grows:
gold for buildings, XP that levels you up and changes how you look, sigils that earn your Fellows'
stars, and bond with the Family who join you. A Blight (a vice) rises each week; your habits push it back.

Built from Everkai's look and screens, with a new, much simpler game underneath.
See [DESIGN.md](DESIGN.md) for every rule and formula, and [ART.md](ART.md) for adding character art.

## Run it

```bash
pnpm install
pnpm dev
```

Then open http://127.0.0.1:5187. Saves live in the browser on this device; export and restore from the
settings button. `pnpm build` makes an offline-capable build in `dist/client`; pushing to `main`
publishes it to GitHub Pages.

## Checks

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Art

Village, interface and backdrop art are carried over from Everkai and were extracted from
*Isekai: Slow Life*; they are for personal use only and are not licensed for redistribution.
Character art is original to Everstead.

// What the service worker precaches, and what it streams on demand instead. Everstead's whole
// bundle is small enough to precache, so nothing is streamed today. Add a pattern to STREAMED if a
// large optional asset folder ever appears (it will then download on first use instead of at install).
// Card art (63 MB) is fetched as cards are seen, never at install. The art index itself is precached so a new sync's
// cards get their art at once: kept files are served from the cache forever, so an index in there would stay at the
// first version a phone ever fetched.
export const STREAMED=[/^assets\/snap\/(?!index\.json)/];   // assets/snap-ui (the game's own chrome, 650 KB) is precached
/** True when a built file is fetched on demand rather than precached. */
export const streamed=path=>STREAMED.some(pattern=>pattern.test(path));
// Streamed files listed here are cached the first time they are fetched. Every KEPT pattern must also be STREAMED.
export const KEPT=[/^assets\/snap\/(?!index\.json)/];
export const kept=path=>KEPT.some(pattern=>pattern.test(path));
/** A precache this size is expected to fit a phone. */
export const PRECACHE_BUDGET_BYTES=120*1024*1024;

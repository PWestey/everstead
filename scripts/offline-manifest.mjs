// What the service worker precaches, and what it streams on demand instead. Everstead's whole
// bundle is small enough to precache, so nothing is streamed today. Add a pattern to STREAMED if a
// large optional asset folder ever appears (it will then download on first use instead of at install).
export const STREAMED=[];
/** True when a built file is fetched on demand rather than precached. */
export const streamed=path=>STREAMED.some(pattern=>pattern.test(path));
// Streamed files listed here are cached the first time they are fetched. Every KEPT pattern must also be STREAMED.
export const KEPT=[];
export const kept=path=>KEPT.some(pattern=>pattern.test(path));
/** A precache this size is expected to fit a phone. */
export const PRECACHE_BUDGET_BYTES=120*1024*1024;

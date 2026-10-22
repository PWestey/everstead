// "How they got here": each character's 2-3 sentence origin in the Everstead story (docs/STORY.md section 6),
// shown in their Info panel. Written in lib/origins/part-*.mjs.
import {ORIGINS as A} from './origins/part-1.mjs';
import {ORIGINS as B} from './origins/part-2.mjs';
import {ORIGINS as C} from './origins/part-3.mjs';
/** @type {Record<string,string>} */
export const ORIGINS={...A,...B,...C};

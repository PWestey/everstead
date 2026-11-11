// The Card Parlour's house rules: a small, uniform nudge to famous characters whose cards sit in Tier 4-5 of the
// public tier lists (docs/snap-tiers.md). Every change is +1 Power; nothing else about a card changes, so no hook,
// test or AI needs to know. Applied once, on import, to the copied engine's card table (lib/snap/ stays a clean copy).
import {CARDS} from './snap/cards.mjs';
export const HOUSE_POWER={
 Hawkeye:1,Elektra:1,RocketRaccoon:1,Starlord:1,Groot:1,Gamora:1,Drax:1,CaptainAmerica:1,DoctorStrange:1,Cloak:1,JeanGrey:1,Punisher:1,
 Namor:1,BlackBolt:1,Thor:1,CaptainMarvel:1,TheThing:1,MrFantastic:1,Sabretooth:1,Vulture:1,Heimdall:1,Mantis:1,Kingpin:1,Rhino:1,
 MoonKnight:1,NickFury:1,DoctorOctopus:1,BlackWidow:1,Falcon:1,Crystal:1,JessicaJones:1,Daredevil:1,Medusa:1,SpiderMan2099:1,Angel:1,BuckyBarnes:1,
};
export const HOUSE_MAX=1;   // the largest nudge a house rule may make
/** Applies the house rules to the card table (safe to call more than once). Returns the ids it changed this time. */
export function applyHouseRules(cards=CARDS){const done=[];for(const [id,d] of Object.entries(HOUSE_POWER)){const c=cards[id];if(!c||c.house)continue;c.power+=d;c.house=d;done.push(id)}return done}
applyHouseRules();

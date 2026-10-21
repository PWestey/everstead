// Which franchise each character comes from. The Arena builds rival teams from these, and characters fighting
// "their own" franchise's team are outshone. Add a line here whenever a character joins the cast.

/** @type {Record<string,string>} franchise name → character ids */
const GROUPS={
 'Star Wars':'obiwan din anakin cal revan ahsoka padme hera rey kay leia kira',
 'Marvel':'matt tchalla steve logan quill tony bruce peter piotr stephen thor deadpool rocket wanda jean carol gamora kate gwen ororo annamarie natasha jessica magik mystique nico shuri sue wasp emma jubilee kamala',
 'Warcraft':'uther malfurion thrall varian baine magni tyrande jaina alleria alexstrasza draka moira kelsey talanji garona sylvanas xalatath amah thalyssra valeera liadrin yrel lilian',
 'RuneScape':'saradomin vannaka duradel wiseoldman ariane maggie zilyana ellamaria nieve vampanna',
 'Cosmere':'kelsier kaladin dalinar vin shallan jasnah navani syl',
 'Red Rising':'darrow sevro ragnar virginia victra',
 'Codex Alera':'tavi kitai amara',
 'Critical Role':'grog keyleth vex jester',
 'Pokémon':'roy ash liko nemona misty',
 'Wizarding World':'harry dumbledore hermione ana',
 'League of Legends':'morgana soraka ashe quinn samira vi missfortune caitlyn riven seraphine sona poppy lulu',
 'Disney':'anna elsa helen moana vanellope',
 'Baldur’s Gate 3':'shadowheart karlach laezel',
 'The Witcher':'geralt yennefer',
 'Fantasy Favourites':'briget lys fannie nash megan violet rumi mira zoey',
};
/** @type {Record<string,string>} */
export const FRANCHISE={};for(const [name,ids] of Object.entries(GROUPS))for(const id of ids.split(' '))FRANCHISE[id]=name;
export const FRANCHISES=Object.keys(GROUPS);

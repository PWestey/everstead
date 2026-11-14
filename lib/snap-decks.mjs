// The Card Parlour's built-in decks: the ladder meta as Marvel Snap Zone ranks it, read from its weekly tier-list
// report (https://marvelsnapzone.com/tier-list/, companion article of META_DATE) and mapped to the engine's card ids.
// Refresh by hand after a snap-proto sync: visit the report, take the twelve cards of each deck, keep the names.
// Cards the pool does not have yet are stood in for and noted; the hand-made archetypes in lib/snap/decks.mjs stay as "Classic".
export const META_DATE='2026-11-08',META_SOURCE='https://marvelsnapzone.com/marvel-snap-ranked-meta-tier-list-november-8-2026/';
export const META_DECKS={
 zombie:{name:'Zombie Horde',tier:1,ids:['MajesticWingbeat','TheHunger','NicholasScratch','VampireKillmonger','ZombieMisterFantastic','JoaquinTorres','ZombieBlade','Venus','ScarletWitchQueenOfChaos','ZombieScarletWitch','ZombieGiantMan','Sasquatch']},
 vampire:{name:'4-Cost Vampirism',tier:1,ids:['SilverSable','VampireKillmonger','ZombieBlade','CassandraNova','ScarletWitchQueenOfChaos','DragonOfTheMoon','EnSabahNur','Laufey','VampireDeaconFrost','Stryfe','VampireEnchantress','AntiPolarMagneto']},
 reveals:{name:'Small On Reveals',tier:1,ids:['MajesticWingbeat','Iceman','MerlinOfAvalon','NicholasScratch','Merlin','VampireKillmonger','JoaquinTorres','Venus','ScarletWitchQueenOfChaos','WerewolfByNight','ShouLao','Sasquatch']},
 // Arthur Pendragon (November 2026) is not in the pool yet: Stryfe stands in until the next sync.
 summons:{name:'4-Cost Summons',tier:1,ids:['Domino','JaneFosterFracturedFrontier','CalibanHorseman','BaronZemo','Jubilee','Stryfe','EnSabahNur','IronLad','DragonLord','Gorr','AntiPolarMagneto','FinFangFoom'],standin:{Stryfe:'Arthur Pendragon'}},
 hammer:{name:'Curved Hammer Time',tier:1,ids:['Wasp','Iceman','KingEitri','Surge','Lockjaw','Phastos','Thor','BetaRayBill','ThanosFracturedFrontier','JaneFoster','Gorr','Odin']},
 highevo:{name:'Curved High Evo',tier:1,ids:['Nebula','SpiderHam','MistyKnight','Scorpion','Shocker','Cosmo','JaneFosterFracturedFrontier','Cyclops','HighEvolutionary','ThanosFracturedFrontier','Abomination','Hulk']},
 disruption:{name:'Created Disruption',tier:1,ids:['DeafeningChord','KingEitri','HydraBob','IronPatriot','ShadowlandsDaredevil','Valentina','MobiusMMobius','ScarletWitchQueenOfChaos','ShadowKing','GambitHorseman','Stardust','Kluh']},
 virus:{name:'Curved Disruption',tier:1,ids:['Quinjet','Iceman','NicoMinoru','HydraBob','Martyr','TechnoOrganicVirus','IronPatriot','Cable','MobiusMMobius','ShadowKing','Stardust','ThanosFracturedFrontier']},
 fantomex:{name:'Fantomex',tier:2,ids:['Hood','Blade','WildChild','BuckyBarnes','Carnage','Marrow','MobiusMMobius','Gambit','Killmonger','ShadowKing','ZombieCaptainMarvel','Fantomex']},
 // Arthur Pendragon again: Dragon of the Moon stands in.
 doom2099:{name:'4-Cost 2099',tier:2,ids:['Moondragon','LukeCage','CaptainBritain','DraxAvatarOfLife','CalibanHorseman','DragonOfTheMoon','Doom2099','Stryfe','IronLad','DragonLord','DrDoom','AntiPolarMagneto'],standin:{DragonOfTheMoon:'Arthur Pendragon'}},
 wiccan:{name:'Curved Wiccan',tier:2,ids:['Quicksilver','Domino','MobiusMMobius','Rogue','Speed','ShadowKing','MrFantasticFirstSteps','Stardust','Wiccan','ThanosFracturedFrontier','Kluh','VampireEnchantress']},
 agatha:{name:'Agatha Disrupts',tier:3,ids:['SpiderHam','BlackKnight','WildChild','RedShift','MobiusMMobius','LadySif','ShangChi','GhostRider','LadyDeathstrike','Stature','BlackBolt','AgathaHarkness']},
 nimrod:{name:'Nimrolactus',tier:3,ids:['FastballSpecial','KidOmega','Carnage','Magik','Venom','AdamantiumInfusion','Shuri','SymbioteSpiderMan','BlackPanther','Nimrod','ArnimZola','Galactus']},
 bullseye:{name:'Bullseye Discard',tier:3,ids:['Miek','Scorn','Swarm','Morbius','TheCollector','ColleenWing','Bullseye','Magik','Jocasta','Prodigy','Crystal','Modok']},
 tribunal:{name:'Ongoing Tribunal',tier:3,ids:['HowardTheDuck','RavonnaRenslayer','Mystique','Magik','Wave','Jubilee','SuperSkrull','IronLad','IronMan','Sera','Onslaught','LivingTribunal']},
};

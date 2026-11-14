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
// The fun shelf: one deck per archetype the ladder meta leaves out, each a real list from a Marvel Snap Zone
// "New Decks to Play" article (src = article date). The junk deck is house-built: no recent MSZ list for it.
export const FUN_DECKS={
 zoo:{name:"Strong Kazoo",arch:"Zoo",src:"2026-08-27",ids:["AntMan","Hawkeye","Nebula","SpiderHam","AmericaChavez","Nightcrawler","Goose","Cosmo","StrongGuy","KaZar","IronLad","BlueMarvel"]},
 discard:{name:"Classic Discard",arch:"Discard",src:"2026-10-29",ids:["Scorn","Blade","Morbius","CorvusGlaive","Hellcow","ZombieBlackCat","LadySif","Dracula","ProximaMidnight","Modok","Khonshu","Apocalypse"]},
 hela:{name:"Hela Returns",arch:"Discard",src:"2026-10-29",ids:["Blade","RedShift","CorvusGlaive","Hellcow","LadySif","Jubilee","GhostRider","Blink","Hela","Infinaut","FinFangFoom","Death"]},
 destroy:{name:"On Reveal Destroy",arch:"Destroy",src:"2026-08-27",ids:["SilverSable","Iceman","RavonnaRenslayer","Firehair","CassandraNova","Ironheart","Sage","Venom","Misery","WhiteTiger","DeathFracturedFrontier","Knull"]},
 thanosdestroy:{name:"Thanos Destroy",arch:"Destroy",src:"2026-07-30",ids:["X23","NicoMinoru","Carnage","WeaponXWolverine","Tombstone","Killmonger","Muse","Venom","MorganLeFay","Thanos","Dormammu","Death"]},
 mill:{name:"Destroy Mill",arch:"Mill",src:"2026-08-27",ids:["RocketRaccoon","AmericaChavez","NicoMinoru","Yondu","Cable","Firehair","Killmonger","Venom","BaronZemo","Misery","DeathFracturedFrontier","Knull"]},
 bounce:{name:"Points Bounce",arch:"Bounce",src:"2026-08-13",ids:["Hood","Hawkeye","AmericaChavez","Iceman","NicoMinoru","Merlin","Toxin","Falcon","WerewolfByNight","Beast","ShouLao","Sasquatch"]},
 move:{name:"Move Thanos",arch:"Move",src:"2026-10-01",ids:["Batroc","SpiderManBrandNewDay","Nightcrawler","SamWilson","Kraven","Silk","Cosmo","HydraStomper","JaneFosterFracturedFrontier","FriendlyNeighborhoodCarnage","Juggernaut","ThanosFracturedFrontier"]},
 moveables:{name:"Moveables",arch:"Move",src:"2026-09-10",ids:["Batroc","SpiderManBrandNewDay","Nightcrawler","JeffTheBabyDolphin","SamWilson","Kraven","AuntMay","RocketAndGroot","SpiderPunk","MotherAskani","SpiderSense","Hellion"]},
 ongoing:{name:"Ongoing Spectrum",arch:"Ongoing",src:"2026-10-29",ids:["AntMan","Goliath","LukeCage","SamWilson","Mystique","CaptainCarter","CaptainAmerica","Klaw","Moonstone","IronMan","Spectrum","Onslaught"]},
 surfer:{name:"Surfing with Variants",arch:"Surfer",src:"2026-11-12",ids:["Quinjet","KingEitri","Brood","MobiusMMobius","SilverSurfer","Nakia","Phastos","PsylockeFracturedFrontier","Kang","SebastianShaw","ShangChiMasterOfTheRings","Sera"]},
 cerebro:{name:"Cerebro-3 Sinister",arch:"Cerebro",src:"2026-11-12",ids:["MBaku","Nightcrawler","LukeCage","LinLie","MrSinister","ScarletWitch","Cerebro","Mystique","Chameleon","Cosmo","Makkari","Bastion"]},
 dino:{name:"Collector Dino",arch:"Hand size",src:"2026-09-10",ids:["Agent13","Mantis","Angela","Sentinel","TheCollector","Cable","Bishop","Nakia","WhiteQueen","Jubilee","MoonGirl","DevilDinosaur"]},
 afflict:{name:"Scorpion Affliction",arch:"Affliction",src:"2026-09-10",ids:["LadyBullseye","Scorpion","Mystique","Magik","Hazmat","Prodigy","PsylockeFracturedFrontier","TheAncientOne","LunaSnow","Sera","Blink","ScorpionBrandNewDay"]},
 lockdown:{name:"Lockdown Galactus",arch:"Lockdown",src:"2026-07-30",ids:["Iceman","SpiderManBrandNewDay","Nightcrawler","Cable","JeffTheBabyLandShark","Mysterio","RocketAndGroot","Mercury","Isca","ProfessorX","TheThingFirstSteps","GalactusFirstSteps"]},
 ramp:{name:"War Machine Ramp",arch:"Ramp",src:"2026-07-30",ids:["EbonyMaw","Chamber","Lockjaw","Electro","Jubilee","DragonLord","Blink","WarMachine","ArnimZola","Odin","Infinaut","FinFangFoom"]},
 bigsummons:{name:"High Power Summons",arch:"Big power",src:"2026-07-30",ids:["CalibanHorseman","Wave","Jubilee","WhiteTiger","DragonLord","ArnimZola","Odin","Giganto","Infinaut","Skaar","FinFangFoom","MonstroOctopus"]},
 odin:{name:"Low Collection On Reveal",arch:"On Reveal",src:"2026-08-13",ids:["Nebula","AmericaChavez","Nightcrawler","Medusa","Starlord","Cable","Storm","Groot","CaptainMarvel","Drax","WhiteTiger","Odin"]},
 galacti:{name:"Fantastic Zombie Galacti",arch:"Galacti",src:"2026-09-10",ids:["DeafeningChord","MajesticWingbeat","AmericaChavez","AdamWarlock","Surge","Forge","Magik","Maverick","MrFantasticFirstSteps","Stick","Gwenpool","ZombieGalacti"]},
 energy:{name:"Ongoing Energy Cheats",arch:"Ongoing",src:"2026-08-13",ids:["RavonnaRenslayer","Sage","Mystique","Magik","MobiusMMobius","EsmeCuckoo","Moonstone","AntiVenom","IronMan","HydroMan","ArnimZola","Gorr"]},
 junk:{name:"Annihilus Junk",arch:"Clog",src:"house",ids:["Hood","BlackWidow","Debrii","Viper","GreenGoblin","Hobgoblin","Sentry","Polaris","RedGuardian","Kingpin","Annihilus","Alioth"]},
};

// Classic archetypes, 12 cards each. The first six use the launch pool only; the rest add Series 3.
export const DECKS = {
  kazoo:    ["SquirrelGirl", "AntMan", "MistyKnight", "Nightcrawler", "RocketRaccoon", "Hawkeye", "Angela", "Bishop", "MrSinister", "KaZar", "BlueMarvel", "Onslaught"],
  destroy:  ["Nova", "Elektra", "Carnage", "BuckyBarnes", "Wolverine", "Forge", "Deathlok", "Killmonger", "Sabretooth", "Angel", "ShangChi", "Hulk"],
  discard:  ["Blade", "Swarm", "AmericaChavez", "Morbius", "Wolverine", "Angel", "LadySif", "SwordMaster", "StrongGuy", "DevilDinosaur", "Apocalypse", "Infinaut"],
  move:     ["Nightcrawler", "IronFist", "Vulture", "Kraven", "MultipleMan", "DoctorStrange", "Cloak", "Medusa", "Forge", "Hulkbuster", "Vision", "Heimdall"],
  ongoing:  ["AntMan", "Armor", "Colossus", "Lizard", "MrFantastic", "CaptainAmerica", "Cosmo", "Klaw", "KaZar", "IronMan", "Spectrum", "Onslaught"],
  control:  ["Elektra", "Iceman", "Scorpion", "Cosmo", "Killmonger", "JessicaJones", "ShangChi", "Leech", "Enchantress", "ProfessorX", "Hulk", "Infinaut"],
  // ---- Series 3 archetypes ----
  patriot:  ["Wasp", "MistyKnight", "Shocker", "Cyclops", "Patriot", "Mystique", "TheThing", "Abomination", "BlueMarvel", "Ultron", "Onslaught", "Hulk"],
  death:    ["Nova", "Deadpool", "Carnage", "BuckyBarnes", "Wolverine", "Forge", "Venom", "Deathlok", "Killmonger", "Knull", "Death", "Hulk"],
  hela:     ["Blade", "Swarm", "Morbius", "ColleenWing", "LadySif", "SwordMaster", "Gambit", "BlackCat", "Infinaut", "Giganto", "Hela", "Apocalypse"],
  move3:    ["Nightcrawler", "GhostSpider", "IronFist", "Dagger", "Kraven", "HumanTorch", "Silk", "DoctorStrange", "Hercules", "SpiderMan2099", "Vision", "Heimdall"],
  wong:     ["Forge", "Hawkeye", "Mystique", "Wolfsbane", "Ironheart", "Wong", "BlackPanther", "WhiteTiger", "ArnimZola", "Odin", "Hulk", "Onslaught"],
  sera:     ["Elektra", "Iceman", "Scorpion", "Cosmo", "Killmonger", "ShangChi", "Enchantress", "Hazmat", "LukeCage", "Sera", "Mystique", "Mojo"],
  zabu:     ["Zabu", "Sunspot", "Nova", "Forge", "Psylocke", "ShangChi", "Rescue", "Drax", "Jubilee", "MilesMorales", "Hulk", "Infinaut"],
  // ---- Series 4 and 5 archetypes ----
  thanos:   ["Thanos", "Quinjet", "Psylocke", "Lockjaw", "Jubilee", "ShangChi", "Darkhawk", "Gilgamesh", "BlueMarvel", "Hulk", "Magneto", "Onslaught"],
  zombie:   ["TheHunger", "ZombieSentry", "ZombieBlade", "ZombieMisterFantastic", "ZombiePowerMan", "ZombieScarletWitch", "ZombieVenom", "ZombieCaptainMarvel", "ZombieGiantMan", "Forge", "Hulk", "ZombieGalacti"],
  afflict:  ["Hazmat", "LukeCage", "LadyBullseye", "RedGuardian", "Diamondback", "Ikari", "KarimaShapandar", "Ajax", "ScorpionBrandNewDay", "SpiderWoman", "Cannonball", "Hulk"],
  surtur:   ["Nova", "Deadpool", "Carnage", "Venom", "Surtur", "SilverSurfer", "Skaar", "Knull", "Death", "Hulk", "Giganto", "Infinaut"],
  evolve:   ["Wasp", "MistyKnight", "Shocker", "Cyclops", "HighEvolutionary", "Patriot", "TheThing", "Abomination", "Mystique", "BlueMarvel", "Hulk", "Onslaught"],
  move5:    ["Nightcrawler", "SpiderManBrandNewDay", "Dagger", "Kraven", "HumanTorch", "Silk", "SpiderPunk", "Hercules", "MaryJane", "HydraStomper", "Vision", "Heimdall"],
  lockjaw:  ["Wasp", "Quicksilver", "Lockjaw", "Jubilee", "Leech", "Magneto", "Giganto", "Infinaut", "Hulk", "SheHulk", "Death", "Blob"],
  // ---- showcase decks for the cards rebuilt in the third pass ----
  ritual:   ["Dormammu", "Nova", "Deadpool", "Carnage", "BuckyBarnes", "Wolverine", "Venom", "Deathlok", "Killmonger", "Knull", "Death", "Hulk"],
  sinister: ["SinisterSix", "NicoMinoru", "Herbie", "KateBishop", "Prowler", "Daken", "Merlin", "MadameWeb", "Daredevil", "HowardTheDuck", "Shocker", "Hulk"],
  frontier: ["ThanosFracturedFrontier", "Wasp", "MistyKnight", "AntMan", "Hawkeye", "Shocker", "Cyclops", "KarenPage", "GalactusFirstSteps", "MrFantasticFirstSteps", "DraxAvatarOfLife", "FallenOne"],
  agatha:   ["AgathaHarkness", "Kang", "Frigga", "Debrii", "MajorVictory", "WhiteTiger", "Mysterio", "Sentry", "RamaTut", "EnSabahNur", "BlackKnight", "Blade"],
};
export const DECK_NAMES = Object.keys(DECKS);

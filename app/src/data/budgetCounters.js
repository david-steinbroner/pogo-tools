/**
 * Budget Counter Recommendations
 * Curated Pokemon counters for each opponent type
 * All entries are globally available (no regionals in v1)
 */

/**
 * Budget counter entry structure:
 * {
 *   name: string,        // Pokemon name
 *   types: string[],     // Pokemon types for display
 *   fast: string,        // Recommended fast move
 *   charged: string,     // Recommended charged move
 *   tier: string,        // Accessibility: common, uncommon, rare, legendary
 *   cost: string,        // Investment: low, medium, high
 *   note: string         // Brief availability note
 * }
 */

export const BUDGET_COUNTERS = {
  // NORMAL - weak to Fighting
  Normal: [
    { name: 'Machamp', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'medium', note: 'Trade evolve = free' },
    { name: 'Hariyama', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'low', note: 'Wild Makuhita common' },
    { name: 'Primeape', types: ['Fighting'], fast: 'Counter', charged: 'Close Combat', tier: 'common', cost: 'low', note: 'Wild Mankey common' },
    { name: 'Breloom', types: ['Grass', 'Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'uncommon', cost: 'medium', note: 'Shroomish in parks/grass' },
    { name: 'Lucario', types: ['Fighting', 'Steel'], fast: 'Counter', charged: 'Aura Sphere', tier: 'rare', cost: 'high', note: 'Hatch Riolu from eggs' }
  ],

  // FIRE - weak to Water, Ground, Rock
  Fire: [
    { name: 'Gyarados', types: ['Water', 'Flying'], fast: 'Waterfall', charged: 'Hydro Pump', tier: 'common', cost: 'medium', note: 'Magikarp everywhere' },
    { name: 'Vaporeon', types: ['Water'], fast: 'Water Gun', charged: 'Hydro Pump', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Swampert', types: ['Water', 'Ground'], fast: 'Water Gun', charged: 'Hydro Cannon', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Golem', types: ['Rock', 'Ground'], fast: 'Rock Throw', charged: 'Stone Edge', tier: 'common', cost: 'low', note: 'Trade evolve = free' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Mud-Slap', charged: 'Earthquake', tier: 'uncommon', cost: 'medium', note: 'Rhyhorn nests exist' }
  ],

  // WATER - weak to Grass, Electric
  Water: [
    { name: 'Roserade', types: ['Grass', 'Poison'], fast: 'Razor Leaf', charged: 'Grass Knot', tier: 'common', cost: 'medium', note: 'Roselia spawns often' },
    { name: 'Venusaur', types: ['Grass', 'Poison'], fast: 'Vine Whip', charged: 'Frenzy Plant', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Jolteon', types: ['Electric'], fast: 'Thunder Shock', charged: 'Thunderbolt', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Electivire', types: ['Electric'], fast: 'Thunder Shock', charged: 'Wild Charge', tier: 'uncommon', cost: 'medium', note: 'Elekid from eggs' },
    { name: 'Luxray', types: ['Electric'], fast: 'Spark', charged: 'Wild Charge', tier: 'common', cost: 'low', note: 'Shinx spawns common' }
  ],

  // ELECTRIC - weak to Ground
  Electric: [
    { name: 'Garchomp', types: ['Dragon', 'Ground'], fast: 'Mud Shot', charged: 'Earth Power', tier: 'rare', cost: 'high', note: 'Gible rare but worth it' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Mud-Slap', charged: 'Earthquake', tier: 'uncommon', cost: 'medium', note: 'Rhyhorn nests exist' },
    { name: 'Golem', types: ['Rock', 'Ground'], fast: 'Mud-Slap', charged: 'Earthquake', tier: 'common', cost: 'low', note: 'Trade evolve = free' },
    { name: 'Mamoswine', types: ['Ice', 'Ground'], fast: 'Mud-Slap', charged: 'Bulldoze', tier: 'common', cost: 'medium', note: 'Swinub very common' },
    { name: 'Excadrill', types: ['Ground', 'Steel'], fast: 'Mud-Slap', charged: 'Drill Run', tier: 'uncommon', cost: 'medium', note: 'Drilbur spawns in events' }
  ],

  // GRASS - weak to Fire, Ice, Poison, Flying, Bug
  Grass: [
    { name: 'Charizard', types: ['Fire', 'Flying'], fast: 'Fire Spin', charged: 'Blast Burn', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Flareon', types: ['Fire'], fast: 'Fire Spin', charged: 'Flamethrower', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Mamoswine', types: ['Ice', 'Ground'], fast: 'Powder Snow', charged: 'Avalanche', tier: 'common', cost: 'medium', note: 'Swinub very common' },
    { name: 'Honchkrow', types: ['Dark', 'Flying'], fast: 'Peck', charged: 'Sky Attack', tier: 'common', cost: 'low', note: 'Murkrow spawns often' },
    { name: 'Roserade', types: ['Grass', 'Poison'], fast: 'Poison Jab', charged: 'Sludge Bomb', tier: 'common', cost: 'medium', note: 'Poison moveset here' }
  ],

  // ICE - weak to Fire, Fighting, Rock, Steel
  Ice: [
    { name: 'Machamp', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'medium', note: 'Trade evolve = free' },
    { name: 'Charizard', types: ['Fire', 'Flying'], fast: 'Fire Spin', charged: 'Blast Burn', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Flareon', types: ['Fire'], fast: 'Fire Spin', charged: 'Flamethrower', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Tyranitar', types: ['Rock', 'Dark'], fast: 'Smack Down', charged: 'Stone Edge', tier: 'uncommon', cost: 'high', note: 'CD move for Smack Down' },
    { name: 'Metagross', types: ['Steel', 'Psychic'], fast: 'Bullet Punch', charged: 'Meteor Mash', tier: 'rare', cost: 'high', note: 'CD move, very strong' }
  ],

  // FIGHTING - weak to Flying, Psychic, Fairy
  Fighting: [
    { name: 'Alakazam', types: ['Psychic'], fast: 'Confusion', charged: 'Psychic', tier: 'common', cost: 'medium', note: 'Abra spawns often' },
    { name: 'Espeon', types: ['Psychic'], fast: 'Confusion', charged: 'Psychic', tier: 'common', cost: 'low', note: 'Walk Eevee + day evolve' },
    { name: 'Honchkrow', types: ['Dark', 'Flying'], fast: 'Peck', charged: 'Sky Attack', tier: 'common', cost: 'low', note: 'Murkrow spawns often' },
    { name: 'Gardevoir', types: ['Psychic', 'Fairy'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'uncommon', cost: 'medium', note: 'Ralts spawns in events' },
    { name: 'Togekiss', types: ['Fairy', 'Flying'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'rare', cost: 'high', note: 'Togepi from eggs' }
  ],

  // POISON - weak to Ground, Psychic
  Poison: [
    { name: 'Alakazam', types: ['Psychic'], fast: 'Confusion', charged: 'Psychic', tier: 'common', cost: 'medium', note: 'Abra spawns often' },
    { name: 'Espeon', types: ['Psychic'], fast: 'Confusion', charged: 'Psychic', tier: 'common', cost: 'low', note: 'Walk Eevee + day evolve' },
    { name: 'Garchomp', types: ['Dragon', 'Ground'], fast: 'Mud Shot', charged: 'Earth Power', tier: 'rare', cost: 'high', note: 'Gible rare but worth it' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Mud-Slap', charged: 'Earthquake', tier: 'uncommon', cost: 'medium', note: 'Rhyhorn nests exist' },
    { name: 'Excadrill', types: ['Ground', 'Steel'], fast: 'Mud-Slap', charged: 'Drill Run', tier: 'uncommon', cost: 'medium', note: 'Drilbur spawns in events' }
  ],

  // GROUND - weak to Water, Grass, Ice
  Ground: [
    { name: 'Gyarados', types: ['Water', 'Flying'], fast: 'Waterfall', charged: 'Hydro Pump', tier: 'common', cost: 'medium', note: 'Magikarp everywhere' },
    { name: 'Vaporeon', types: ['Water'], fast: 'Water Gun', charged: 'Hydro Pump', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Roserade', types: ['Grass', 'Poison'], fast: 'Razor Leaf', charged: 'Grass Knot', tier: 'common', cost: 'medium', note: 'Roselia spawns often' },
    { name: 'Mamoswine', types: ['Ice', 'Ground'], fast: 'Powder Snow', charged: 'Avalanche', tier: 'common', cost: 'medium', note: 'Swinub very common' },
    { name: 'Glaceon', types: ['Ice'], fast: 'Frost Breath', charged: 'Avalanche', tier: 'common', cost: 'low', note: 'Eevee + Glacial Lure' }
  ],

  // FLYING - weak to Electric, Ice, Rock
  Flying: [
    { name: 'Jolteon', types: ['Electric'], fast: 'Thunder Shock', charged: 'Thunderbolt', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Electivire', types: ['Electric'], fast: 'Thunder Shock', charged: 'Wild Charge', tier: 'uncommon', cost: 'medium', note: 'Elekid from eggs' },
    { name: 'Mamoswine', types: ['Ice', 'Ground'], fast: 'Powder Snow', charged: 'Avalanche', tier: 'common', cost: 'medium', note: 'Swinub very common' },
    { name: 'Tyranitar', types: ['Rock', 'Dark'], fast: 'Smack Down', charged: 'Stone Edge', tier: 'uncommon', cost: 'high', note: 'CD move for Smack Down' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Smack Down', charged: 'Rock Wrecker', tier: 'uncommon', cost: 'high', note: 'CD move ideal' }
  ],

  // PSYCHIC - weak to Bug, Ghost, Dark
  Psychic: [
    { name: 'Tyranitar', types: ['Rock', 'Dark'], fast: 'Bite', charged: 'Crunch', tier: 'uncommon', cost: 'medium', note: 'Larvitar in events' },
    { name: 'Honchkrow', types: ['Dark', 'Flying'], fast: 'Snarl', charged: 'Dark Pulse', tier: 'common', cost: 'low', note: 'Murkrow spawns often' },
    { name: 'Weavile', types: ['Dark', 'Ice'], fast: 'Snarl', charged: 'Foul Play', tier: 'uncommon', cost: 'medium', note: 'Sneasel spawns in cold' },
    { name: 'Gengar', types: ['Ghost', 'Poison'], fast: 'Shadow Claw', charged: 'Shadow Ball', tier: 'common', cost: 'medium', note: 'Gastly very common' },
    { name: 'Pinsir', types: ['Bug'], fast: 'Bug Bite', charged: 'X-Scissor', tier: 'common', cost: 'low', note: 'Wild spawns, no evolve' }
  ],

  // BUG - weak to Fire, Flying, Rock
  Bug: [
    { name: 'Charizard', types: ['Fire', 'Flying'], fast: 'Fire Spin', charged: 'Blast Burn', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Flareon', types: ['Fire'], fast: 'Fire Spin', charged: 'Flamethrower', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Honchkrow', types: ['Dark', 'Flying'], fast: 'Peck', charged: 'Sky Attack', tier: 'common', cost: 'low', note: 'Murkrow spawns often' },
    { name: 'Tyranitar', types: ['Rock', 'Dark'], fast: 'Smack Down', charged: 'Stone Edge', tier: 'uncommon', cost: 'high', note: 'CD move for Smack Down' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Smack Down', charged: 'Rock Wrecker', tier: 'uncommon', cost: 'high', note: 'CD move ideal' }
  ],

  // ROCK - weak to Water, Grass, Fighting, Ground, Steel
  Rock: [
    { name: 'Machamp', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'medium', note: 'Trade evolve = free' },
    { name: 'Gyarados', types: ['Water', 'Flying'], fast: 'Waterfall', charged: 'Hydro Pump', tier: 'common', cost: 'medium', note: 'Magikarp everywhere' },
    { name: 'Vaporeon', types: ['Water'], fast: 'Water Gun', charged: 'Hydro Pump', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Roserade', types: ['Grass', 'Poison'], fast: 'Razor Leaf', charged: 'Grass Knot', tier: 'common', cost: 'medium', note: 'Roselia spawns often' },
    { name: 'Metagross', types: ['Steel', 'Psychic'], fast: 'Bullet Punch', charged: 'Meteor Mash', tier: 'rare', cost: 'high', note: 'CD move, very strong' }
  ],

  // GHOST - weak to Ghost, Dark
  Ghost: [
    { name: 'Tyranitar', types: ['Rock', 'Dark'], fast: 'Bite', charged: 'Crunch', tier: 'uncommon', cost: 'medium', note: 'Larvitar in events' },
    { name: 'Honchkrow', types: ['Dark', 'Flying'], fast: 'Snarl', charged: 'Dark Pulse', tier: 'common', cost: 'low', note: 'Murkrow spawns often' },
    { name: 'Weavile', types: ['Dark', 'Ice'], fast: 'Snarl', charged: 'Foul Play', tier: 'uncommon', cost: 'medium', note: 'Sneasel spawns in cold' },
    { name: 'Gengar', types: ['Ghost', 'Poison'], fast: 'Shadow Claw', charged: 'Shadow Ball', tier: 'common', cost: 'medium', note: 'Gastly very common' },
    { name: 'Absol', types: ['Dark'], fast: 'Snarl', charged: 'Dark Pulse', tier: 'rare', cost: 'low', note: 'Raid boss, no evolve' }
  ],

  // DRAGON - weak to Ice, Dragon, Fairy
  Dragon: [
    { name: 'Mamoswine', types: ['Ice', 'Ground'], fast: 'Powder Snow', charged: 'Avalanche', tier: 'common', cost: 'medium', note: 'Swinub very common' },
    { name: 'Glaceon', types: ['Ice'], fast: 'Frost Breath', charged: 'Avalanche', tier: 'common', cost: 'low', note: 'Eevee + Glacial Lure' },
    { name: 'Weavile', types: ['Dark', 'Ice'], fast: 'Ice Shard', charged: 'Avalanche', tier: 'uncommon', cost: 'medium', note: 'Sneasel spawns in cold' },
    { name: 'Gardevoir', types: ['Psychic', 'Fairy'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'uncommon', cost: 'medium', note: 'Ralts spawns in events' },
    { name: 'Togekiss', types: ['Fairy', 'Flying'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'rare', cost: 'high', note: 'Togepi from eggs' }
  ],

  // DARK - weak to Fighting, Bug, Fairy
  Dark: [
    { name: 'Machamp', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'medium', note: 'Trade evolve = free' },
    { name: 'Hariyama', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'low', note: 'Wild Makuhita common' },
    { name: 'Gardevoir', types: ['Psychic', 'Fairy'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'uncommon', cost: 'medium', note: 'Ralts spawns in events' },
    { name: 'Togekiss', types: ['Fairy', 'Flying'], fast: 'Charm', charged: 'Dazzling Gleam', tier: 'rare', cost: 'high', note: 'Togepi from eggs' },
    { name: 'Pinsir', types: ['Bug'], fast: 'Bug Bite', charged: 'X-Scissor', tier: 'common', cost: 'low', note: 'Wild spawns, no evolve' }
  ],

  // STEEL - weak to Fire, Fighting, Ground
  Steel: [
    { name: 'Machamp', types: ['Fighting'], fast: 'Counter', charged: 'Dynamic Punch', tier: 'common', cost: 'medium', note: 'Trade evolve = free' },
    { name: 'Charizard', types: ['Fire', 'Flying'], fast: 'Fire Spin', charged: 'Blast Burn', tier: 'common', cost: 'medium', note: 'CD move ideal' },
    { name: 'Flareon', types: ['Fire'], fast: 'Fire Spin', charged: 'Flamethrower', tier: 'common', cost: 'low', note: 'Eevee very common' },
    { name: 'Garchomp', types: ['Dragon', 'Ground'], fast: 'Mud Shot', charged: 'Earth Power', tier: 'rare', cost: 'high', note: 'Gible rare but worth it' },
    { name: 'Rhyperior', types: ['Ground', 'Rock'], fast: 'Mud-Slap', charged: 'Earthquake', tier: 'uncommon', cost: 'medium', note: 'Rhyhorn nests exist' }
  ],

  // FAIRY - weak to Poison, Steel
  Fairy: [
    { name: 'Roserade', types: ['Grass', 'Poison'], fast: 'Poison Jab', charged: 'Sludge Bomb', tier: 'common', cost: 'medium', note: 'Roselia spawns often' },
    { name: 'Gengar', types: ['Ghost', 'Poison'], fast: 'Hex', charged: 'Sludge Bomb', tier: 'common', cost: 'medium', note: 'Gastly very common' },
    { name: 'Metagross', types: ['Steel', 'Psychic'], fast: 'Bullet Punch', charged: 'Meteor Mash', tier: 'rare', cost: 'high', note: 'CD move, very strong' },
    { name: 'Excadrill', types: ['Ground', 'Steel'], fast: 'Metal Claw', charged: 'Iron Head', tier: 'uncommon', cost: 'medium', note: 'Drilbur spawns in events' },
    { name: 'Toxicroak', types: ['Poison', 'Fighting'], fast: 'Poison Jab', charged: 'Sludge Bomb', tier: 'common', cost: 'low', note: 'Croagunk spawns often' }
  ]
};

/**
 * Get budget counters for selected opponent types
 * @param {string[]} oppTypes - Array of opponent types
 * @param {number} limit - Max counters to return
 * @returns {Array} Deduplicated and prioritized counter list
 */
export function getBudgetCounters(oppTypes, limit = 5) {
  if (!oppTypes || oppTypes.length === 0) return [];

  // Collect counters for all opponent types
  const allCounters = [];
  oppTypes.forEach(type => {
    const counters = BUDGET_COUNTERS[type];
    if (counters) {
      counters.forEach(c => allCounters.push({ ...c, targetType: type }));
    }
  });

  // Deduplicate by name, keeping first occurrence
  const seen = new Set();
  const unique = allCounters.filter(c => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  // Sort by accessibility (common first) then investment (low first)
  const tierOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3 };
  const costOrder = { low: 0, medium: 1, high: 2 };

  unique.sort((a, b) => {
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return costOrder[a.cost] - costOrder[b.cost];
  });

  return unique.slice(0, limit);
}

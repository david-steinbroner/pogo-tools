/**
 * Pokemon Triage Logic
 * Analyzes Pokemon and assigns verdicts: KEEP_PVP, KEEP_RAID, TRADE, or TRANSFER
 */

(function() {
  'use strict';

  let metaData = null;

  // Verdict constants
  const VERDICTS = {
    KEEP_PVP: 'KEEP_PVP',
    KEEP_RAID: 'KEEP_RAID',
    TRADE: 'TRADE',
    TRANSFER: 'TRANSFER'
  };

  // Thresholds for "great IVs"
  const THRESHOLDS = {
    pvpRank: 100,           // Top 100 rank is "great" for PvP
    pvpPercentile: 2.5,     // Top 2.5%
    masterIvPercent: 96,    // 96%+ for Master League
    raidAttackIv: 14        // 14+ attack for raids
  };

  /**
   * Load meta database
   */
  async function loadMetaData() {
    if (metaData) return metaData;

    try {
      // Determine base path
      const basePath = getBasePath();
      const response = await fetch(basePath + 'data/meta-pokemon.json');
      if (!response.ok) throw new Error('Failed to load meta database');
      metaData = await response.json();
      return metaData;
    } catch (err) {
      console.error('Error loading meta data:', err);
      return null;
    }
  }

  /**
   * Get base path for data files
   */
  function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
  }

  /**
   * Normalize species name for matching
   */
  function normalizeSpeciesName(name) {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Build species ID from Pokemon data
   */
  function buildSpeciesId(pokemon) {
    let id = normalizeSpeciesName(pokemon.name);

    // Handle forms
    if (pokemon.form) {
      const form = pokemon.form.toLowerCase();
      if (form.includes('galar') || form === 'galarian') {
        id += '_galarian';
      } else if (form.includes('alola') || form === 'alolan') {
        id += '_alolan';
      } else if (form.includes('hisui') || form === 'hisuian') {
        id += '_hisuian';
      } else if (form.includes('altered')) {
        id += '_altered';
      } else if (form.includes('origin')) {
        id += '_origin';
      } else if (form !== '') {
        id += '_' + normalizeSpeciesName(form);
      }
    }

    return id;
  }

  /**
   * Find meta entry for a Pokemon
   */
  function findMetaEntry(pokemon) {
    if (!metaData || !metaData.pokemon) return null;

    const speciesId = buildSpeciesId(pokemon);
    const pokedexNumber = pokemon.pokedexNumber;

    // Try exact speciesId match first
    let entry = metaData.pokemon.find(m => m.speciesId === speciesId);
    if (entry) return entry;

    // Try matching by pokedex number and similar name
    const normalizedName = normalizeSpeciesName(pokemon.name);
    entry = metaData.pokemon.find(m => {
      if (m.pokedexNumber !== pokedexNumber) return false;
      const metaName = normalizeSpeciesName(m.speciesName);
      return metaName === normalizedName || metaName.includes(normalizedName);
    });
    if (entry) return entry;

    // Try just by name (for Pokemon without forms in our data)
    entry = metaData.pokemon.find(m =>
      normalizeSpeciesName(m.speciesName) === normalizedName
    );

    return entry || null;
  }

  /**
   * Calculate IV percentage
   */
  function calculateIvPercent(pokemon) {
    if (pokemon.ivPercent !== null && pokemon.ivPercent !== undefined) {
      return pokemon.ivPercent;
    }
    if (pokemon.atkIv !== null && pokemon.defIv !== null && pokemon.staIv !== null) {
      return Math.round(((pokemon.atkIv + pokemon.defIv + pokemon.staIv) / 45) * 1000) / 10;
    }
    return null;
  }

  /**
   * Check if IVs are good for PvP (low attack preferred)
   */
  function isPvpIvGood(pokemon, league) {
    // Check if we have rank data
    if (league === 'great' && pokemon.greatLeague && pokemon.greatLeague.rank) {
      return pokemon.greatLeague.rank <= THRESHOLDS.pvpRank;
    }
    if (league === 'ultra' && pokemon.ultraLeague && pokemon.ultraLeague.rank) {
      return pokemon.ultraLeague.rank <= THRESHOLDS.pvpRank;
    }
    if (league === 'master') {
      const ivPercent = calculateIvPercent(pokemon);
      return ivPercent !== null && ivPercent >= THRESHOLDS.masterIvPercent;
    }

    // Fallback: estimate based on IV pattern (low atk, high def/sta is good for GL/UL)
    if (pokemon.atkIv !== null && pokemon.defIv !== null && pokemon.staIv !== null) {
      if (league === 'great' || league === 'ultra') {
        // Low attack + high def/sta pattern
        return pokemon.atkIv <= 5 && pokemon.defIv >= 12 && pokemon.staIv >= 12;
      }
    }

    return false;
  }

  /**
   * Get PvP rank for display
   */
  function getPvpRank(pokemon, league) {
    if (league === 'great' && pokemon.greatLeague) {
      return pokemon.greatLeague.rank;
    }
    if (league === 'ultra' && pokemon.ultraLeague) {
      return pokemon.ultraLeague.rank;
    }
    if (league === 'master' && pokemon.masterLeague) {
      return pokemon.masterLeague.rank;
    }
    return null;
  }

  /**
   * Evaluate Pokemon for PvP
   */
  function evaluatePvP(pokemon, metaEntry, collection) {
    const result = {
      dominated: [],
      tier: 'not_meta',
      bestLeague: null,
      bestRank: null,
      hasDominator: false,
      dominatedBy: null,
      reason: null,
      details: null
    };

    if (!metaEntry || !metaEntry.pvp || !metaEntry.pvp.dominated || metaEntry.pvp.dominated.length === 0) {
      result.reason = 'Not a PvP meta Pokemon';
      result.details = `${pokemon.name} isn't commonly used in PvP battles. It's either not strong enough competitively or better options exist.`;
      return result;
    }

    result.dominated = metaEntry.pvp.dominated;
    result.tier = metaEntry.pvp.dominatedTier || 'solid_pick';

    // Find best league for this Pokemon
    let bestLeague = null;
    let bestRank = Infinity;

    for (const league of result.dominated) {
      const rank = getPvpRank(pokemon, league);
      if (rank && rank < bestRank) {
        bestRank = rank;
        bestLeague = league;
      } else if (!rank && isPvpIvGood(pokemon, league)) {
        // If no rank data but IVs look good
        if (!bestLeague) {
          bestLeague = league;
          bestRank = null;
        }
      }
    }

    result.bestLeague = bestLeague;
    result.bestRank = bestRank !== Infinity ? bestRank : null;

    // Check for dominators in collection (same species with better rank)
    if (collection && bestLeague) {
      const dominated = findDominator(pokemon, collection, bestLeague);
      if (dominated) {
        result.hasDominator = true;
        result.dominatedBy = dominated;
      }
    }

    // Generate reason and details
    const leagueNames = {
      'great': 'Great League',
      'ultra': 'Ultra League',
      'master': 'Master League'
    };

    if (bestRank && bestRank <= THRESHOLDS.pvpRank) {
      const leagueName = leagueNames[bestLeague] || bestLeague;
      result.reason = `Rank #${bestRank} ${leagueName}${bestRank <= 10 ? ' - excellent!' : ''}`;
      result.details = `This ${pokemon.name} has rank #${bestRank} IVs for ${leagueName} out of 4096 possible combinations. `;

      if (metaEntry.pvp.whyGood) {
        result.details += metaEntry.pvp.whyGood + ' ';
      }

      if (metaEntry.pvp.moveNotes) {
        result.details += metaEntry.pvp.moveNotes;
      }
    } else if (bestLeague) {
      const leagueName = leagueNames[bestLeague] || bestLeague;
      result.reason = `${leagueName} viable, but IVs aren't optimal`;
      result.details = `${pokemon.name} is meta-relevant in ${leagueName}, but this one's IVs aren't in the top 100 ranks. `;

      if (result.hasDominator) {
        result.details += `You have a better one (rank #${getPvpRank(result.dominatedBy, bestLeague)}).`;
      } else {
        result.details += 'Consider catching more to find better IVs.';
      }
    }

    return result;
  }

  /**
   * Find a better Pokemon of same species in collection
   */
  function findDominator(pokemon, collection, league) {
    const myRank = getPvpRank(pokemon, league);
    if (!myRank) return null;

    const dominated = collection.find(other => {
      if (other.id === pokemon.id) return false;
      if (other.name !== pokemon.name) return false;
      if (other.form !== pokemon.form) return false;

      const otherRank = getPvpRank(other, league);
      return otherRank && otherRank < myRank;
    });

    return dominated || null;
  }

  /**
   * Evaluate Pokemon for Raids
   */
  function evaluateRaid(pokemon, metaEntry) {
    const result = {
      dominated: false,
      tier: 'not_useful',
      types: [],
      hasGoodIvs: false,
      reason: null,
      details: null
    };

    if (!metaEntry || !metaEntry.raid || !metaEntry.raid.dominated) {
      result.reason = 'Not useful for raids';
      result.details = `${pokemon.name} doesn't have the attack power needed for raid battles. There are better options available.`;
      return result;
    }

    result.dominated = true;
    result.tier = metaEntry.raid.tier || 'solid_pick';
    result.types = metaEntry.raid.types || [];

    // Check if IVs are good for raids (high attack)
    const atkIv = pokemon.atkIv;
    result.hasGoodIvs = atkIv !== null && atkIv >= THRESHOLDS.raidAttackIv;

    // Shadow bonus consideration
    const isShadow = pokemon.isShadow === true;
    const shadowBonus = isShadow ? ' Shadow Pokemon deal 20% more damage!' : '';

    // Generate reason and details
    const typeList = result.types.slice(0, 3).join(', ');

    if (result.hasGoodIvs) {
      result.reason = `Top ${typeList} raid attacker${isShadow ? ' (Shadow!)' : ''}`;
      result.details = `${pokemon.name} is one of the best attackers against ${typeList} type raid bosses. `;
      result.details += `Your ${pokemon.name} has ${atkIv} Attack IV${atkIv === 15 ? ' (perfect!)' : ', which is great for raids'}. `;

      if (metaEntry.raid.whyGood) {
        result.details += metaEntry.raid.whyGood + ' ';
      }
      if (shadowBonus) {
        result.details += shadowBonus;
      }
      if (metaEntry.raid.moveNotes) {
        result.details += ' ' + metaEntry.raid.moveNotes;
      }
    } else {
      result.reason = `Raid attacker, but low Attack IV (${atkIv || '?'})`;
      result.details = `${pokemon.name} is useful for ${typeList} raids, but this one has ${atkIv !== null ? atkIv : 'unknown'} Attack IV. `;
      result.details += 'Raids prioritize damage output, so 14-15 Attack is preferred. ';
      result.details += 'This could still be useful as a budget option or for trading.';
    }

    return result;
  }

  /**
   * Evaluate special attributes
   */
  function evaluateSpecial(pokemon) {
    const result = {
      isShiny: pokemon.isShiny === true,
      isLucky: pokemon.isLucky === true,
      isShadow: pokemon.isShadow === true,
      isPurified: pokemon.isPurified === true,
      isFavorite: pokemon.isFavorite === true,
      hasLegacyMove: false, // Would need move database to detect
      warnings: []
    };

    if (result.isShadow) {
      result.warnings.push('Shadow Pokemon cost 20% more candy/stardust to power up, but deal 20% more damage.');
    }

    if (result.isPurified) {
      result.warnings.push('Purified Pokemon get Return, which is useful for some PvP builds.');
    }

    if (result.isLucky) {
      result.warnings.push('Lucky Pokemon cost 50% less stardust to power up!');
    }

    return result;
  }

  /**
   * Generate detailed tooltip explanation
   */
  function generateDetails(pokemon, pvpEval, raidEval, specialEval, verdict) {
    let details = '';

    if (verdict === VERDICTS.KEEP_PVP) {
      details = pvpEval.details || `${pokemon.name} is valuable for PvP battles.`;
    } else if (verdict === VERDICTS.KEEP_RAID) {
      details = raidEval.details || `${pokemon.name} is valuable for raid battles.`;
    } else if (verdict === VERDICTS.TRADE) {
      if (specialEval.isShiny) {
        details = `This ${pokemon.name} is shiny! While it's not meta-relevant, shinies are rare and valuable for trading. A collector friend might want it!`;
      } else if (specialEval.isLucky) {
        details = `This ${pokemon.name} is lucky, meaning it costs less stardust to power up. Even though it's not the best IVs, the stardust discount is valuable.`;
      } else if (pvpEval.hasDominator) {
        details = `You have a better ${pokemon.name} for PvP (rank #${getPvpRank(pvpEval.dominatedBy, pvpEval.bestLeague)}). This one could be traded to help a friend who needs one!`;
      } else {
        details = `This ${pokemon.name} isn't your best option, but it's still a meta-relevant species. Consider trading it to a friend who might need one.`;
      }
    } else {
      details = `${pokemon.name} isn't useful for PvP (not in the meta) or raids (better options exist). You can safely transfer it for candy.`;

      // Add context for common Pokemon
      if (pokemon.pokedexNumber && pokemon.pokedexNumber <= 151) {
        details += ` Keep it if you're working on Kanto medals or need candy for evolutions.`;
      }
    }

    // Add warnings
    if (specialEval.warnings.length > 0) {
      details += '\n\nNote: ' + specialEval.warnings.join(' ');
    }

    return details;
  }

  /**
   * Main triage function for a single Pokemon
   */
  function triagePokemon(pokemon, collection) {
    const metaEntry = findMetaEntry(pokemon);
    const pvpEval = evaluatePvP(pokemon, metaEntry, collection);
    const raidEval = evaluateRaid(pokemon, metaEntry);
    const specialEval = evaluateSpecial(pokemon);

    let verdict = VERDICTS.TRANSFER;
    let reason = '';
    let source = metaEntry ? metaEntry.source : null;

    // Decision logic (priority order)

    // 1. Great PvP Pokemon with good IVs
    if (pvpEval.bestRank && pvpEval.bestRank <= THRESHOLDS.pvpRank && !pvpEval.hasDominator) {
      verdict = VERDICTS.KEEP_PVP;
      reason = pvpEval.reason;
    }
    // 2. Great Raid Pokemon with good IVs
    else if (raidEval.dominated && raidEval.hasGoodIvs) {
      verdict = VERDICTS.KEEP_RAID;
      reason = raidEval.reason;
    }
    // 3. Shadow raid attacker (even with mediocre IVs, shadow bonus is huge)
    else if (raidEval.dominated && specialEval.isShadow) {
      verdict = VERDICTS.KEEP_RAID;
      reason = `Shadow ${pokemon.name} - 20% damage boost for raids!`;
    }
    // 4. Meta Pokemon but has a better one (or bad IVs)
    else if (pvpEval.dominated.length > 0 || raidEval.dominated) {
      verdict = VERDICTS.TRADE;
      if (pvpEval.hasDominator) {
        const betterRank = getPvpRank(pvpEval.dominatedBy, pvpEval.bestLeague);
        const myRank = pvpEval.bestRank;
        reason = `You have a better one (rank #${betterRank} vs #${myRank})`;
      } else if (raidEval.dominated && !raidEval.hasGoodIvs) {
        reason = `Raid viable but ${pokemon.atkIv || '?'} Attack IV is low`;
      } else {
        reason = pvpEval.reason || raidEval.reason || 'Meta species - trade candidate';
      }
    }
    // 5. Special Pokemon (shiny, lucky, favorite)
    else if (specialEval.isShiny || specialEval.isLucky || specialEval.isFavorite) {
      verdict = VERDICTS.TRADE;
      if (specialEval.isShiny) {
        reason = 'Shiny! Not meta, but rare for trading';
      } else if (specialEval.isLucky) {
        reason = 'Lucky! Cheap to power up if needed';
      } else {
        reason = 'Marked as favorite';
      }
    }
    // 6. Non-meta with nothing special
    else {
      verdict = VERDICTS.TRANSFER;
      reason = 'Not useful for PvP or raids';
    }

    const details = generateDetails(pokemon, pvpEval, raidEval, specialEval, verdict);

    return {
      verdict: verdict,
      reason: reason,
      details: details,
      evaluation: {
        pvp: pvpEval,
        raid: raidEval,
        special: specialEval
      },
      warnings: specialEval.warnings,
      source: source,
      metaEntry: metaEntry ? {
        speciesId: metaEntry.speciesId,
        speciesName: metaEntry.speciesName
      } : null
    };
  }

  /**
   * Triage entire collection
   */
  async function triageCollection(pokemonList) {
    await loadMetaData();

    if (!metaData) {
      console.error('Failed to load meta data');
      return {
        pokemon: pokemonList.map(p => ({
          ...p,
          triage: {
            verdict: VERDICTS.TRANSFER,
            reason: 'Error: Meta database not loaded',
            details: 'Could not load the meta database. Please refresh and try again.',
            evaluation: null,
            warnings: [],
            source: null
          }
        })),
        summary: { keepPvp: 0, keepRaid: 0, trade: 0, transfer: pokemonList.length }
      };
    }

    const results = pokemonList.map(pokemon => ({
      ...pokemon,
      triage: triagePokemon(pokemon, pokemonList)
    }));

    const summary = {
      keepPvp: results.filter(p => p.triage.verdict === VERDICTS.KEEP_PVP).length,
      keepRaid: results.filter(p => p.triage.verdict === VERDICTS.KEEP_RAID).length,
      trade: results.filter(p => p.triage.verdict === VERDICTS.TRADE).length,
      transfer: results.filter(p => p.triage.verdict === VERDICTS.TRANSFER).length,
      total: results.length
    };

    return {
      pokemon: results,
      summary: summary
    };
  }

  /**
   * Get verdict display info (color, icon, label)
   */
  function getVerdictDisplay(verdict) {
    const displays = {
      KEEP_PVP: {
        label: 'Keep (PvP)',
        color: '#1e7e34',
        bgColor: '#d4edda',
        icon: '⚔️'
      },
      KEEP_RAID: {
        label: 'Keep (Raid)',
        color: '#0c5460',
        bgColor: '#d1ecf1',
        icon: '🏆'
      },
      TRADE: {
        label: 'Trade',
        color: '#856404',
        bgColor: '#fff3cd',
        icon: '🔄'
      },
      TRANSFER: {
        label: 'Transfer',
        color: '#721c24',
        bgColor: '#f8d7da',
        icon: '🗑️'
      }
    };
    return displays[verdict] || displays.TRANSFER;
  }

  // Export for use by other modules
  window.PogoTriage = {
    triagePokemon: triagePokemon,
    triageCollection: triageCollection,
    loadMetaData: loadMetaData,
    getVerdictDisplay: getVerdictDisplay,
    VERDICTS: VERDICTS,
    THRESHOLDS: THRESHOLDS
  };

})();

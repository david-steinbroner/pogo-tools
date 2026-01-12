/**
 * Pokemon Parser
 * Handles CSV imports from Poke Genie and Calcy IV
 * Auto-detects format and normalizes to consistent structure
 */

(function() {
  'use strict';

  // Column name mappings for format detection
  const POKEGENIE_MARKERS = ['Rank % (G)', 'Rank # (G)', 'Stat Prod (G)', 'Pokemon Number', 'Shadow/Purified'];
  const CALCYIV_MARKERS = ['Pokemon No', 'Atk', 'Def', 'Sta'];

  /**
   * Detect CSV format based on column headers
   * @param {string[]} headers - Array of column header names
   * @returns {'pokegenie' | 'calcyiv' | 'unknown'}
   */
  function detectFormat(headers) {
    const headerSet = new Set(headers.map(h => h.trim()));

    // Check for Poke Genie specific columns
    const pokegenieMatches = POKEGENIE_MARKERS.filter(marker => headerSet.has(marker));
    if (pokegenieMatches.length >= 2) {
      return 'pokegenie';
    }

    // Check for Calcy IV specific columns
    const calcyMatches = CALCYIV_MARKERS.filter(marker => headerSet.has(marker));
    if (calcyMatches.length >= 3) {
      return 'calcyiv';
    }

    return 'unknown';
  }

  /**
   * Safely parse a number, returning null if invalid
   */
  function parseNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const str = String(value).trim();
    if (str === '') return null;
    const num = parseFloat(str);
    return isFinite(num) ? num : null;
  }

  /**
   * Safely parse an integer, returning null if invalid
   */
  function parseInt(value) {
    const num = parseNumber(value);
    return num !== null ? Math.floor(num) : null;
  }

  /**
   * Parse boolean from various formats
   */
  function parseBoolean(value) {
    if (value === null || value === undefined) return false;
    const str = String(value).trim().toLowerCase();
    return str === 'true' || str === 'yes' || str === '1';
  }

  /**
   * Get value from row by column name (case-insensitive)
   */
  function getValue(row, headers, columnName) {
    const lowerName = columnName.toLowerCase();
    const index = headers.findIndex(h => h.toLowerCase() === lowerName);
    if (index === -1 || index >= row.length) return null;
    const value = row[index];
    return value !== undefined && value !== '' ? value.trim() : null;
  }

  /**
   * Parse rank percentage string like "0.02%" to number
   */
  function parseRankPercent(value) {
    if (!value) return null;
    const str = String(value).trim().replace('%', '');
    const num = parseFloat(str);
    return isFinite(num) ? num : null;
  }

  /**
   * Generate a unique ID for a Pokemon
   */
  let idCounter = 0;
  function generateId() {
    idCounter++;
    return `pokemon-${String(idCounter).padStart(3, '0')}`;
  }

  /**
   * Reset ID counter (for testing)
   */
  function resetIdCounter() {
    idCounter = 0;
  }

  /**
   * Parse a Poke Genie CSV row into normalized Pokemon object
   */
  function parsePokeGenieRow(row, headers) {
    const name = getValue(row, headers, 'Name');
    if (!name) return { pokemon: null, error: 'Missing Pokemon name' };

    const cp = parseInt(getValue(row, headers, 'CP'));
    if (cp === null) return { pokemon: null, error: `Invalid CP for ${name}` };

    // Parse Shadow/Purified field (0 = normal, 1 = shadow, 2 = purified)
    const shadowPurified = parseInt(getValue(row, headers, 'Shadow/Purified'));
    const isShadow = shadowPurified === 1;
    const isPurified = shadowPurified === 2;

    // Parse IVs
    const atkIv = parseInt(getValue(row, headers, 'Atk IV'));
    const defIv = parseInt(getValue(row, headers, 'Def IV'));
    const staIv = parseInt(getValue(row, headers, 'Sta IV'));

    // Build the normalized Pokemon object
    const pokemon = {
      id: generateId(),
      name: name,
      form: getValue(row, headers, 'Form') || null,
      nickname: null, // Poke Genie doesn't export nicknames
      pokedexNumber: parseInt(getValue(row, headers, 'Pokemon Number')),
      cp: cp,
      hp: parseInt(getValue(row, headers, 'HP')),
      atkIv: atkIv,
      defIv: defIv,
      staIv: staIv,
      ivPercent: parseNumber(getValue(row, headers, 'IV Avg')),
      level: parseNumber(getValue(row, headers, 'Level Min')),
      quickMove: getValue(row, headers, 'Quick Move'),
      chargeMove: getValue(row, headers, 'Charge Move'),
      chargeMove2: getValue(row, headers, 'Charge Move 2'),
      isShadow: isShadow,
      isPurified: isPurified,
      isLucky: parseBoolean(getValue(row, headers, 'Lucky')),
      isFavorite: parseBoolean(getValue(row, headers, 'Favorite')),
      isShiny: false, // Poke Genie doesn't export this
      catchDate: getValue(row, headers, 'Catch Date'),
      scanDate: getValue(row, headers, 'Scan Date'),
      greatLeague: {
        rank: parseInt(getValue(row, headers, 'Rank # (G)')),
        percentile: parseRankPercent(getValue(row, headers, 'Rank % (G)'))
      },
      ultraLeague: {
        rank: parseInt(getValue(row, headers, 'Rank # (U)')),
        percentile: parseRankPercent(getValue(row, headers, 'Rank % (U)'))
      },
      masterLeague: {
        rank: null,
        percentile: null
      },
      _raw: {}
    };

    // Store raw values for debugging
    headers.forEach((header, i) => {
      if (i < row.length) {
        pokemon._raw[header] = row[i];
      }
    });

    return { pokemon: pokemon, error: null };
  }

  /**
   * Parse a Calcy IV CSV row into normalized Pokemon object
   */
  function parseCalcyIvRow(row, headers) {
    const name = getValue(row, headers, 'Pokemon');
    if (!name) return { pokemon: null, error: 'Missing Pokemon name' };

    const cp = parseInt(getValue(row, headers, 'CP'));
    if (cp === null) return { pokemon: null, error: `Invalid CP for ${name}` };

    // Parse IVs
    const atkIv = parseInt(getValue(row, headers, 'Atk'));
    const defIv = parseInt(getValue(row, headers, 'Def'));
    const staIv = parseInt(getValue(row, headers, 'Sta'));

    // Calculate IV percent if we have all IVs
    let ivPercent = null;
    if (atkIv !== null && defIv !== null && staIv !== null) {
      ivPercent = Math.round(((atkIv + defIv + staIv) / 45) * 1000) / 10;
    }

    // Parse gender
    const gender = getValue(row, headers, 'Gender');

    // Build the normalized Pokemon object
    const pokemon = {
      id: generateId(),
      name: name,
      form: getValue(row, headers, 'Form') || null,
      nickname: getValue(row, headers, 'Nickname'),
      pokedexNumber: parseInt(getValue(row, headers, 'Pokemon No')),
      cp: cp,
      hp: parseInt(getValue(row, headers, 'HP')),
      atkIv: atkIv,
      defIv: defIv,
      staIv: staIv,
      ivPercent: ivPercent,
      level: parseNumber(getValue(row, headers, 'Level')),
      quickMove: getValue(row, headers, 'Fast Move'),
      chargeMove: getValue(row, headers, 'Charge Move'),
      chargeMove2: getValue(row, headers, 'Charge Move 2'),
      isShadow: parseBoolean(getValue(row, headers, 'Shadow')),
      isPurified: parseBoolean(getValue(row, headers, 'Purified')),
      isLucky: parseBoolean(getValue(row, headers, 'Lucky')),
      isFavorite: parseBoolean(getValue(row, headers, 'Favorite')),
      isShiny: false, // Calcy IV doesn't export this in standard export
      catchDate: getValue(row, headers, 'Catch Date'),
      scanDate: null, // Calcy IV doesn't have scan date
      greatLeague: {
        rank: null,
        percentile: null
      },
      ultraLeague: {
        rank: null,
        percentile: null
      },
      masterLeague: {
        rank: null,
        percentile: null
      },
      _raw: {}
    };

    // Store raw values for debugging
    headers.forEach((header, i) => {
      if (i < row.length) {
        pokemon._raw[header] = row[i];
      }
    });

    return { pokemon: pokemon, error: null };
  }

  /**
   * Check if a row is empty (all values are empty strings)
   */
  function isEmptyRow(row) {
    return row.every(cell => !cell || cell.trim() === '');
  }

  /**
   * Main entry point - parse CSV string into normalized Pokemon collection
   * @param {string} csvString - Raw CSV content
   * @param {string} filename - Original filename for metadata
   * @returns {{ pokemon: Pokemon[], format: string, errors: string[], warnings: string[] }}
   */
  function parseCollection(csvString, filename) {
    // Reset ID counter for each parse
    resetIdCounter();

    const result = {
      pokemon: [],
      format: 'unknown',
      errors: [],
      warnings: []
    };

    // Use PapaParse if available, otherwise basic parsing
    let rows;
    if (typeof Papa !== 'undefined') {
      const parsed = Papa.parse(csvString, { skipEmptyLines: false });
      if (parsed.errors.length > 0) {
        parsed.errors.forEach(err => {
          if (err.type === 'Quotes') {
            result.errors.push(`CSV parsing error at row ${err.row}: ${err.message}`);
          }
        });
      }
      rows = parsed.data;
    } else {
      // Fallback basic CSV parsing
      rows = csvString.split('\n').map(line => line.split(',').map(cell => cell.trim()));
    }

    if (rows.length === 0) {
      result.errors.push('CSV file is empty');
      return result;
    }

    // First row is headers
    const headers = rows[0].map(h => h.trim());

    // Detect format
    result.format = detectFormat(headers);

    if (result.format === 'unknown') {
      result.errors.push('Unable to detect CSV format. Expected Poke Genie or Calcy IV export format.');
      result.errors.push('Poke Genie should have columns like: "Pokemon Number", "Shadow/Purified", "Rank % (G)"');
      result.errors.push('Calcy IV should have columns like: "Pokemon No", "Pokemon", "Atk", "Def", "Sta"');
      return result;
    }

    // Select the appropriate parser
    const parseRow = result.format === 'pokegenie' ? parsePokeGenieRow : parseCalcyIvRow;

    // Parse each data row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip empty rows
      if (isEmptyRow(row)) continue;

      const { pokemon, error } = parseRow(row, headers);

      if (error) {
        result.errors.push(`Row ${i + 1}: ${error}`);
        continue;
      }

      if (pokemon) {
        // Check for missing IVs and add warning
        if (pokemon.atkIv === null || pokemon.defIv === null || pokemon.staIv === null) {
          result.warnings.push(`Row ${i + 1}: ${pokemon.name} has missing IV data`);
        }

        result.pokemon.push(pokemon);
      }
    }

    return result;
  }

  // Export for use by other modules
  window.PogoParser = {
    parseCollection: parseCollection,
    detectFormat: detectFormat,
    resetIdCounter: resetIdCounter
  };

})();

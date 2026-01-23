/**
 * Pokemon Search Module
 * Provides typeahead search across all Pokemon with fuzzy matching
 */

import { POKEDEX_TYPES } from '../csv/pokedex.js';

/**
 * Capitalize first letter of each word
 * "mr. mime" -> "Mr. Mime"
 */
function capitalizeWords(str) {
  return str.replace(/(?:^|[\s-])\S/g, (match) => match.toUpperCase());
}

/**
 * Build search index once on module load
 * Each entry: { name, displayName, types, searchLower }
 */
const searchIndex = Object.entries(POKEDEX_TYPES).map(([name, types]) => ({
  name,
  displayName: capitalizeWords(name),
  types,
  searchLower: name.toLowerCase()
}));

/**
 * Levenshtein distance - measures edit distance between two strings
 * Lower = more similar (0 = exact match)
 */
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Optimization: if strings are very different in length, skip
  if (Math.abs(a.length - b.length) > 3) return 999;

  const matrix = [];

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Main search function
 * @param {string} query - User input (case insensitive)
 * @param {number} limit - Max results per category
 * @returns {{ exact: Object|null, prefix: Array, substring: Array, fuzzy: Array }}
 */
export function searchPokemon(query, limit = 10) {
  if (!query || query.length === 0) {
    return { exact: null, prefix: [], substring: [], fuzzy: [] };
  }

  const q = query.toLowerCase().trim();

  let exact = null;
  const prefix = [];
  const substring = [];
  const fuzzy = [];

  // Track what we've already matched to avoid duplicates
  const matched = new Set();

  for (const entry of searchIndex) {
    const name = entry.searchLower;

    // Exact match (highest priority)
    if (name === q) {
      exact = { ...entry, score: 100 };
      matched.add(name);
      continue;
    }

    // Prefix match (starts with query)
    if (name.startsWith(q)) {
      prefix.push({ ...entry, score: 80 });
      matched.add(name);
      continue;
    }

    // Substring match (contains query)
    if (name.includes(q)) {
      substring.push({ ...entry, score: 60 });
      matched.add(name);
      continue;
    }
  }

  // Fuzzy matching (only if we need more results)
  // Only run if query is 3+ chars to avoid too many false positives
  if (q.length >= 3) {
    for (const entry of searchIndex) {
      if (matched.has(entry.searchLower)) continue;

      const distance = levenshtein(q, entry.searchLower.substring(0, q.length + 2));

      // Allow distance of 1-2 depending on query length
      const maxDistance = q.length <= 4 ? 1 : 2;

      if (distance <= maxDistance) {
        fuzzy.push({ ...entry, score: 40 - (distance * 10), distance });
      }
    }

    // Sort fuzzy by distance (closest first)
    fuzzy.sort((a, b) => a.distance - b.distance);
  }

  // Limit results
  return {
    exact,
    prefix: prefix.slice(0, limit),
    substring: substring.slice(0, limit),
    fuzzy: fuzzy.slice(0, limit)
  };
}

/**
 * Get all results as a flat sorted array
 * @param {string} query
 * @param {number} limit
 * @returns {Array} Combined results sorted by score
 */
export function searchPokemonFlat(query, limit = 10) {
  const results = searchPokemon(query, limit);

  const all = [
    ...(results.exact ? [results.exact] : []),
    ...results.prefix,
    ...results.substring,
    ...results.fuzzy
  ];

  // Remove duplicates (shouldn't happen but safety)
  const seen = new Set();
  const unique = all.filter(r => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  return unique.slice(0, limit);
}

/**
 * Check if a query has an exact match
 * @param {string} query
 * @returns {Object|null}
 */
export function getExactMatch(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return searchIndex.find(e => e.searchLower === q) || null;
}

/**
 * Get best fuzzy suggestion for a query
 * @param {string} query
 * @returns {Object|null}
 */
export function getBestFuzzySuggestion(query) {
  if (!query || query.length < 2) return null;

  const q = query.toLowerCase().trim();
  let best = null;
  let bestDistance = Infinity;

  for (const entry of searchIndex) {
    // Compare against the start of the name (up to query length + 2)
    const namePart = entry.searchLower.substring(0, q.length + 2);
    const distance = levenshtein(q, namePart);

    if (distance < bestDistance && distance <= 2) {
      bestDistance = distance;
      best = { ...entry, distance };
    }
  }

  return best;
}

/**
 * Highlight matching portion of text with <mark> tags
 * @param {string} text - Display text to highlight
 * @param {string} query - Search query
 * @returns {string} HTML string with <mark> tags
 */
export function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);

  const q = query.toLowerCase();
  const textLower = text.toLowerCase();
  const idx = textLower.indexOf(q);

  if (idx === -1) {
    return escapeHtml(text);
  }

  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + query.length);
  const after = text.substring(idx + query.length);

  return escapeHtml(before) + '<mark>' + escapeHtml(match) + '</mark>' + escapeHtml(after);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

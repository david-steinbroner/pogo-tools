# Code Audit Report - 2026-01-21

## Summary
"Sparkling clean engine bay" refactor pass on PoGO Pal codebase. Removed orphaned DOM references, unused functions, legacy CSS from removed features, and deduplicated dark mode media queries.

## Cleanup Effectiveness

### Raw Numbers
| File | Before | After | Removed |
|------|--------|-------|---------|
| src/state.js | 186 | 178 | 8 |
| src/ui/dom.js | 122 | 77 | 45 |
| src/ui/events.js | 552 | 547 | 5 |
| src/ui/render.js | 1617 | 1426 | 191 |
| styles/app.css | 3289 | 2944 | 345 |
| **Total** | **5766** | **5172** | **594** |

### Percentages
- **JS cleanup**: 249 lines removed / 2477 total JS = **10.1%**
- **CSS cleanup**: 345 lines removed / 3289 total CSS = **10.5%**
- **Total repo cleanup**: 594 lines removed / 5766 total code = **10.3%**

### Counts
- Unused functions removed: **7** (setMode, renderShowingLine, renderCollectionSummary, renderTable, renderSortedTable, renderSortIndicators, showParseError)
- Unused DOM refs removed: **19** (activeIconsEl, activeAllEl, clearBtn, typesOpenBtn, collectionBar, filterZone, collectionCountEl, collectionCoverageEl, showingTypesEl, showingCountEl, tradeView, tableBody, tableHeaders, csvDebugEl, csvDebugSummaryEl, csvHeadersEl, csvMappingEl, csvSampleEl, vsView)
- Unused CSS selectors removed: **~40** (entire modebar, utility-row, collectionbar, filterzone sections)
- Duplicated code removed: **1 block** (~70 lines of duplicate dark mode media query)
- Hardcoding reduced: **0** (inline styles are used appropriately for dynamic positioning)

## What Was Removed

### JavaScript
- **state.js**:
  - `TOTAL_TYPES` constant (never imported)
  - `setMode()` function (never called; events.js sets state.currentMode directly)

- **dom.js** - Removed 19 orphaned DOM refs for elements no longer in HTML:
  - Collection filter UI: activeIconsEl, activeAllEl, clearBtn, typesOpenBtn
  - Collection bar: collectionBar, filterZone
  - Collection stats: collectionCountEl, collectionCoverageEl, showingTypesEl, showingCountEl
  - Table elements: tableBody, tableHeaders
  - Debug panel: csvDebugEl, csvDebugSummaryEl, csvHeadersEl, csvMappingEl, csvSampleEl
  - Unused section refs: vsView, tradeView, vsGeneralPokeSectionEl, vsPokeTypesSectionEl, vsPokeTypesStrongSectionEl, vsMoveTypesSectionEl, vsMoveTypesStrongSectionEl

- **events.js**:
  - Dead code for `vsUploadPromptBtn` (never defined in dom.js)

- **render.js**:
  - `renderShowingLine()` - referenced removed DOM elements
  - `renderCollectionSummary()` - referenced removed DOM elements
  - `renderTable()` - referenced removed tableBody
  - `renderSortedTable()` - called removed functions
  - `renderSortIndicators()` - referenced removed tableHeaders
  - `showParseError()` - legacy alias, inlined to showError
  - `renderCSVMetaDebug()` - reduced to no-op (debug panel removed)
  - Removed unused imports: TOTAL_TYPES, detectCSVMapping, getBudgetCounters, getWeakCounters

### CSS (styles/app.css)
- **Modebar section** (~55 lines): .modebar, .modebar-inner, .mode-tab and states
- **Utility row section** (~45 lines): .utility-row, .utility-left, .utility-right, .util-btn, .util-icon, .util-label
- **Collection bar section** (~50 lines): .collectionbar, .collection-left, .collection-stat, .collection-note
- **Filter zone section** (~50 lines): .filterzone, .active-strip, .active-left, .active-all, .types-open-btn, .types-open-icon
- **Clear button** (~25 lines): .clear-btn and hover/active states
- **Duplicate media query** (~70 lines): Exact duplicate of `@media (prefers-color-scheme: dark) { html[data-theme="system"] {...} }`

## What Was Consolidated

- Simplified `renderCSVMetaDebug()` to empty function (debug panel no longer exists)
- Simplified `updateView()` to only update filtered count state
- Removed legacy `showParseError()` alias, kept only `hideParseError()` for app.js compatibility

## What Was NOT Changed (Recommendations)

### Future Cleanup Candidates
1. **budgetCounters.js**: `getBudgetCounters()` and `getWeakCounters()` are exported but only the `perType` variants are used. Could be removed.

2. **render.js unused exports**: Several exported functions appear unused externally:
   - `renderTypePills()` - exported but never called
   - `computeMoveGuidance()`, `computeAvoidBodies()`, `computeBringBodies()` - exported but unused
   - `scoreRosterAgainst()` - exported but unused
   - `makePokePickCard()` - just wraps makeSimpleCard
   - `resetCarousel()` - exported but never called

3. **Legacy card styles in CSS**: `.poke-card`, `.poke-matchups`, `.matchup-strong`, `.matchup-weak`, `.poke-meta`, `.poke-types` appear to be legacy styles that may no longer be used.

4. **Unused CSS tokens**: Several --modebar-*, --utilbar-*, --collectionbar-*, --filterzone-* CSS variables are defined but no longer used after removing those sections.

### Keep As-Is
- Inline styles for popup positioning (required for dynamic placement)
- Type color backgrounds via CSS vars (proper pattern)
- requestAnimationFrame throttling on scroll handler (already optimized)

## Risks / Unknowns

1. **Collection tab**: Currently a placeholder. The removed table/sort functions will need to be rebuilt if Collection tab is implemented.

2. **Debug mode**: `renderCSVMetaDebug()` is now a no-op. If debug functionality is needed, a new approach will be required.

3. **Trade tab**: Also a placeholder. No cleanup impact.

## Performance Checks

- Scroll handlers are properly throttled with `requestAnimationFrame`
- DOM refs are cached in dom.js (though some were orphaned)
- No layout thrash patterns detected
- Passive event listeners used for scroll events

## How to Keep It Clean

### Rules for This Project

1. **DOM refs in dom.js**: When removing HTML elements, also remove their refs from `src/ui/dom.js`

2. **No orphan exports**: If a function is only used internally in its module, don't export it

3. **CSS cleanup with HTML**: When removing UI sections from HTML, remove their CSS too

4. **Design tokens live in :root**: All colors, spacing, fonts in CSS custom properties at top of app.css

5. **No inline styles for static styling**: Use CSS classes. Inline styles only for dynamic values (positions, transforms)

6. **Single dark mode block**: One `html[data-theme="dark"]` block, one `@media (prefers-color-scheme: dark) { html[data-theme="system"] {...} }` block

7. **Test after cleanup**: Run `node --check` on all JS files, visually verify the app

8. **Module boundaries**:
   - `state.js` = state shape + update functions
   - `dom.js` = DOM element refs only
   - `render.js` = rendering functions
   - `events.js` = event handlers

9. **Comment removal**: Remove commented-out code. Use git history if needed later.

10. **Placeholder tabs**: Collection and Trade tabs are placeholders. Keep their HTML structure but don't add dead code for them.

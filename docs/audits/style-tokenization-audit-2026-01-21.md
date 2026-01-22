# Style Tokenization Audit - 2026-01-21

## Summary
De-hardcoding pass on PoGO Pal codebase. Replaced magic numbers and hex colors with CSS custom property tokens, removed redundant JS inline styles, and cleaned up legacy dead code.

## Hardcoding Reduction Metrics

### Raw Counts
| Category | Before | After | Reduced |
|----------|--------|-------|---------|
| Hardcoded frame colors (#5a544e, #404058) | 4 | 0 | 4 |
| Hardcoded icon-btn size (32px) | 4 | 0 | 4 |
| Hardcoded chip size (28px) | 2 | 0 | 2 |
| Hardcoded icon size (18px) | 3 | 0 | 3 |
| Hardcoded icon-sm size (16px) | 1 | 0 | 1 |
| Undefined tokens with fallbacks | 6 | 0 | 6 |
| **Total hardcoded values** | **20** | **0** | **20** |

### JS Inline Styles Reduced
| Location | Before | After | Change |
|----------|--------|-------|--------|
| body.style.overflow | 2 inline | 0 inline | Class toggle |
| cursor: pointer | 2 inline | 0 inline | CSS handles |
| updateStickyMetrics dead code | 15 lines | 0 lines | Removed |
| **Total JS inline style instances** | **4** | **0** | **4** |

### Quantified Score
- **Hardcoding Reduced**: 20 CSS values + 4 JS inline styles = **24 hardcoded instances eliminated**
- **Dead code removed**: 19 lines from render.js

## What Was Tokenized

### New Tokens Added to :root
```css
/* Component Sizes */
--icon-btn-size: 32px;      /* Icon button dimensions */
--chip-size: 28px;          /* Type chip/badge dimensions */
--icon-size: 18px;          /* Standard icon dimensions */
--icon-size-sm: 16px;       /* Small icon dimensions */
--tap-target-min: 44px;     /* Minimum tap target (accessibility) */

/* Frame Border */
--border-frame: #5a544e;    /* Appbar/footer frame border */
```

### CSS Tokenization
- **`.icon-btn`**: `32px` → `var(--icon-btn-size)`
- **`.icon-chip`**: `28px` → `var(--chip-size)`
- **`.icon`**: `18px` → `var(--icon-size)`
- **`.icon-chip svg`**: `16px` → `var(--icon-size-sm)`
- **`.drawer-close-btn`**: `28px` → `var(--chip-size)`
- **`.carousel-arrow`**: `32px` → `var(--icon-btn-size)`
- **`.carousel-arrow-placeholder`**: `32px` → `var(--icon-btn-size)`
- **`.upload-action-btn .icon`**: `18px` → `var(--icon-size)`
- **`.vs-top-arrow-col svg`**: `18px` → `var(--icon-size)`
- **`.appbar`**: `#5a544e` → `var(--border-frame)`
- **`.drawer`**: `#5a544e` → `var(--border-frame)`
- **`.app-footer`**: `#5a544e` → `var(--border-frame)`
- **Dark mode `.app-footer`**: `#404058` → `var(--border-frame)`

### Undefined Tokens Fixed
Replaced undefined tokens with proper design system tokens:
- `var(--success, #2a7)` → `var(--color-success)`
- `var(--danger, #c55)` → `var(--color-error)`

Affected classes:
- `.matchup-icons-strong`, `.matchup-icons-weak`
- `.matchup-label.strong`, `.matchup-label.weak`
- `.matchup-strong`, `.matchup-weak`

## What Was Cleaned Up

### JS Inline Styles → Class Toggles
**events.js** - Sheet management:
```javascript
// Before
document.body.style.overflow = 'hidden';
document.body.style.overflow = '';

// After
document.body.classList.add('no-scroll');
document.body.classList.remove('no-scroll');
```

### Redundant JS Inline Styles Removed
**render.js** - `makeSimpleCard()`:
- Removed `card.style.cursor = 'pointer'` (CSS class already defines it)

**render.js** - Type icon handlers:
- Removed `icon.style.cursor = 'pointer'` (CSS class already defines it)

### Dead Code Removed
**render.js** - `updateStickyMetrics()`:
- Removed queries for non-existent elements: `.modebar`, `.utility-row`, `.collectionbar`, `.filterzone`
- Removed CSS property updates for removed elements: `--modebar-real-h`, `--utilbar-real-h`, `--collectionbar-real-h`, `--filterzone-real-h`
- Simplified from ~25 lines to ~10 lines

## What Was NOT Changed

### Intentionally Kept as Hardcoded
1. **Dynamic positioning styles**: `popup.style.left/top` for popup placement (must be dynamic)
2. **Type color backgrounds**: `icon.style.background = var(${t.colorVar})` (data-driven)
3. **CSS custom property updates**: `setProperty()` calls for dynamic layout calculations
4. **Viewport scaling**: `app.style.transform` for in-app browser scaling
5. **Safari paint workaround**: `.vs-sticky-header` hardcoded `#E5DFD0` (documented as Safari-specific)

### Context-Specific Sizes
Some 16px/18px values are intentionally smaller variants for specific contexts:
- `.type-pill .icon-chip` = 16px (compact pill variant)
- `.opponent-header-pills .type-pill .icon-chip` = 16px (header variant)
- `.vs-sticky-header-pills .type-pill .icon-chip` = 16px (sticky variant)

These were not tokenized as they serve different visual purposes than the base token values.

## File Impact

| File | Lines Changed | Net Lines |
|------|---------------|-----------|
| styles/app.css | ~30 edits | +4 (new tokens) |
| src/ui/render.js | ~20 edits | -19 (dead code removed) |
| src/ui/events.js | 2 edits | 0 |

## Design System Consistency

### Token Usage Summary
After this audit, component sizes follow consistent token patterns:
- **Icon buttons**: Use `--icon-btn-size` (32px)
- **Chips/badges**: Use `--chip-size` (28px)
- **Standard icons**: Use `--icon-size` (18px)
- **Small icons**: Use `--icon-size-sm` (16px)
- **Frame borders**: Use `--border-frame`

### Dark Mode Compatibility
All frame border colors now use `--border-frame` which is properly defined in both:
- Light theme: `#5a544e`
- Dark theme: `#404058`
- System preference media query: `#404058`

## Remaining Hardcoding (Low Priority)

### Safari-Specific Workarounds
`.vs-sticky-header` and `.vs-sticky-mask` use hardcoded `#E5DFD0` for Safari paint reliability. These could be tokenized but may cause rendering issues in Safari.

### Contextual Size Variations
Many 16px, 18px, 20px values exist for specific contexts (type pills in headers, icon sizes in different containers). These are intentional design variations, not candidates for tokenization.

## How to Maintain

### When Adding New Components
1. Use existing tokens for standard sizes:
   - Icon buttons: `var(--icon-btn-size)`
   - Chips: `var(--chip-size)`
   - Icons: `var(--icon-size)` or `var(--icon-size-sm)`
2. Use `var(--border-frame)` for app shell borders
3. Use `var(--color-success)` and `var(--color-error)` for semantic colors

### Avoid Creating New Hardcoded Values
- If a new size is needed repeatedly, define a token first
- Keep CSS custom properties as single source of truth
- Avoid JS inline styles for static properties - use CSS classes

# PoGO Pal Design System v4

**Theme:** "Pokédex Companion" - GBA-Era Light Theme

This file is the single source of truth for all visual design decisions. Reference this when building any UI component.

---

## CSS Custom Properties (Design Tokens)

Copy these into your main stylesheet.

### Colors

```css
:root {
  /* Background Hierarchy (light to dark for depth) */
  --bg-page: #F5F0E6;           /* Warm cream - main page background */
  --bg-surface: #EDE8DC;        /* Slightly darker - card backgrounds */
  --bg-surface-alt: #E5DFD0;    /* Even darker - nested elements, table headers */
  --bg-inset: #DDD7C7;          /* Inset/recessed areas */

  /* Brand Colors */
  --color-primary: #DC0A2D;     /* Pokédex Red - primary actions, brand */
  --color-primary-hover: #B8082A;
  --color-primary-active: #9A0623;

  --color-secondary: #3B7A8C;   /* Muted Teal - secondary actions, links */
  --color-secondary-hover: #2D5F6D;
  --color-secondary-active: #1F444E;

  /* Text Colors */
  --text-primary: #2D3436;      /* Dark charcoal - primary text */
  --text-secondary: #5A6366;    /* Medium gray - secondary/helper text */
  --text-muted: #8B9396;        /* Light gray - disabled, placeholders */
  --text-inverse: #FFFFFF;      /* White - text on dark/colored backgrounds */

  /* Border Colors */
  --border-default: #C4BBA8;    /* Default borders */
  --border-strong: #9A9282;     /* Emphasized borders, panel edges */
  --border-subtle: #D9D2C2;     /* Subtle dividers */

  /* State Colors */
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-error: #F44336;
  --color-info: #2196F3;

  /* Shadows */
  --shadow-inset: inset 2px 2px 4px rgba(0,0,0,0.1);
  --shadow-panel: inset 1px 1px 0 rgba(255,255,255,0.5), 2px 2px 0 rgba(0,0,0,0.15);
}
```

### Pokemon Type Colors

```css
:root {
  --type-normal: #A8A878;
  --type-fire: #F08030;
  --type-water: #6890F0;
  --type-electric: #F8D030;
  --type-grass: #78C850;
  --type-ice: #98D8D8;
  --type-fighting: #C03028;
  --type-poison: #A040A0;
  --type-ground: #E0C068;
  --type-flying: #A890F0;
  --type-psychic: #F85888;
  --type-bug: #A8B820;
  --type-rock: #B8A038;
  --type-ghost: #705898;
  --type-dragon: #7038F8;
  --type-dark: #705848;
  --type-steel: #B8B8D0;
  --type-fairy: #EE99AC;
}
```

---

## Typography

### Fonts

```css
:root {
  --font-display: "Press Start 2P", monospace;  /* Headers, brand, titles */
  --font-body: "VT323", monospace;              /* Body text, data, UI */
}
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--text-display-lg` | 16px | App title |
| `--text-display-md` | 12px | Section headers |
| `--text-display-sm` | 10px | Card headers |
| `--text-display-xs` | 8px | Buttons, labels |
| `--text-body-lg` | 24px | Large body emphasis |
| `--text-body-md` | 20px | Default body |
| `--text-body-sm` | 18px | Secondary text |
| `--text-body-xs` | 16px | Small text, metadata |

### Typography Classes

```css
/* Display Font (Press Start 2P) - always uppercase */
.text-display-lg { font-family: var(--font-display); font-size: 16px; text-transform: uppercase; }
.text-display-md { font-family: var(--font-display); font-size: 12px; text-transform: uppercase; }
.text-display-sm { font-family: var(--font-display); font-size: 10px; text-transform: uppercase; }
.text-display-xs { font-family: var(--font-display); font-size: 8px; text-transform: uppercase; }

/* Body Font (VT323) */
.text-body-lg { font-family: var(--font-body); font-size: 24px; }
.text-body-md { font-family: var(--font-body); font-size: 20px; }
.text-body-sm { font-family: var(--font-body); font-size: 18px; color: var(--text-secondary); }
.text-body-xs { font-family: var(--font-body); font-size: 16px; color: var(--text-muted); }
```

---

## Spacing

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}
```

---

## Border Radius

```css
:root {
  --radius-sm: 4px;   /* Pills, buttons, small elements */
  --radius-md: 8px;   /* Cards, panels */
  --radius-lg: 12px;  /* Large containers, modals */
}
```

**Important:** Pills and buttons use 4px radius for GBA-era feel, NOT fully rounded (999px).

---

## Components

### App Header

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-surface);
  border-bottom: 3px solid var(--border-strong);
}

.app-brand {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

### Segmented Control (Tab Navigation)

Used for Versus / Collection / Trade tabs.

```css
.segmented-control {
  display: inline-flex;
  background: var(--bg-inset);
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 3px;
  box-shadow: var(--shadow-inset);
}

.segmented-control__button {
  font-family: var(--font-display);
  font-size: 8px;
  text-transform: uppercase;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: 2px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.segmented-control__button.is-active {
  background: var(--color-primary);
  color: var(--text-inverse);
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.2), 1px 1px 0 rgba(0,0,0,0.2);
}
```

### Buttons

```css
.btn {
  font-family: var(--font-display);
  font-size: 8px;
  text-transform: uppercase;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

/* Primary - red background */
.btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary-hover);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
}

/* Secondary - cream background with border */
.btn--secondary {
  background: var(--bg-surface);
  color: var(--text-primary);
  border-color: var(--border-strong);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}

/* Ghost - transparent */
.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

/* Small variant */
.btn--sm {
  font-size: 7px;
  padding: var(--space-xs) var(--space-sm);
}
```

### Cards / Panels

**IMPORTANT:** Cards must have visible 2px borders.

```css
.card {
  background: var(--bg-surface);
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-panel);
  overflow: hidden;
}

.card__header {
  background: var(--bg-surface-alt);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 2px solid var(--border-default);
}

.card__title {
  font-family: var(--font-display);
  font-size: 10px;
  text-transform: uppercase;
}

.card__body {
  padding: var(--space-md);
}

.card__footer {
  background: var(--bg-surface-alt);
  padding: var(--space-sm) var(--space-md);
  border-top: 2px solid var(--border-default);
}

/* Inset card variant (nested) */
.card--inset {
  background: var(--bg-inset);
  border-color: var(--border-default);
  box-shadow: var(--shadow-inset);
}
```

### Type Pills (Color Only)

```css
.type-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.2);
}

.type-pill--sm { width: 20px; height: 20px; }
.type-pill--lg { width: 28px; height: 28px; }

/* Type colors */
.type-pill--fire { background: var(--type-fire); }
.type-pill--water { background: var(--type-water); }
/* ... etc for all types */

/* Interactive */
.type-pill--interactive { cursor: pointer; }
.type-pill--interactive:hover { transform: scale(1.1); }
.type-pill--interactive.is-selected {
  box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--text-primary);
}
```

### Text Pills (With Labels)

```css
.text-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  text-transform: uppercase;
  color: var(--text-inverse);
  border: 1px solid rgba(0,0,0,0.15);
}

.text-pill--sm { height: 20px; padding: 0 var(--space-sm); font-size: 6px; }
.text-pill--lg { height: 28px; padding: 0 var(--space-md); font-size: 8px; }

/* Type-colored variants */
.text-pill--fire { background: var(--type-fire); }
.text-pill--water { background: var(--type-water); }
/* ... etc */

/* Light backgrounds need dark text */
.text-pill--electric { background: var(--type-electric); color: var(--text-primary); }
.text-pill--ice { background: var(--type-ice); color: var(--text-primary); }
.text-pill--ground { background: var(--type-ground); color: var(--text-primary); }
.text-pill--steel { background: var(--type-steel); color: var(--text-primary); }
```

### Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 20px;
}

.table th {
  font-family: var(--font-display);
  font-size: 8px;
  text-transform: uppercase;
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-surface-alt);
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-strong);
}

.table td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
}

.table tr:hover td {
  background: var(--bg-surface-alt);
}
```

### Info Rows

For displaying label: value pairs (Bring moves, Avoid moves, etc.)

```css
.info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.info-row__label {
  font-family: var(--font-display);
  font-size: 8px;
  color: var(--text-secondary);
  text-transform: uppercase;
  min-width: 120px;
}

.info-row__value {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  flex: 1;
}
```

### Form Inputs

```css
.input {
  font-family: var(--font-body);
  font-size: 20px;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-inset);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  box-shadow: var(--shadow-inset);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}
```

### Help Button

```css
.help-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  border: 2px solid var(--border-default);
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 10px;
  cursor: pointer;
}

.help-button:hover {
  background: var(--color-secondary);
  color: var(--text-inverse);
  border-color: var(--color-secondary);
}
```

---

## Layout Utilities

```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-md); }

.stack { display: flex; flex-direction: column; }
.stack--sm { gap: var(--space-sm); }
.stack--md { gap: var(--space-md); }
.stack--lg { gap: var(--space-lg); }

.row { display: flex; align-items: center; }
.row--sm { gap: var(--space-sm); }
.row--md { gap: var(--space-md); }
.row--between { justify-content: space-between; }
.row--wrap { flex-wrap: wrap; }
```

---

## Scanline Effect (Optional)

For device feel:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.015) 2px,
    rgba(0,0,0,0.015) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

---

## Key Design Principles

1. **Visible Borders** - Use 2px solid borders on cards, panels, inputs. Don't rely only on shadows.
2. **4px Radius** - Pills and buttons use 4px radius for GBA-era feel, not fully rounded.
3. **Press Start 2P** - All headers, labels, and buttons use this pixelated display font.
4. **VT323** - All body text, data, and UI content uses this readable monospace font.
5. **Warm Cream Theme** - Light backgrounds with dark text, not dark mode.
6. **Physical Feel** - Components should feel like tactile device buttons with depth shadows.

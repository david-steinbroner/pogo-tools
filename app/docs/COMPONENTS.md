# PoGO Pal UI Components

Reference for UI components. Use these names when giving directions about the interface.

---

## Quick Reference

- **Type pill** — `.type-pill` (use `.type-pill--block` for full-width)
- **Mini type pill** — `.type-pill-mini` (inside cards)
- **Pokémon card** — `.simple-card`
- **Column layout** — `.type-columns` with `.type-column` children
- **Collapsible section** — `.collapsible-section`
- **Brief container** — `.brief-container`
- **Brief row** — `.brief-row` (label + helper text + content)
- **Brief label** — `.brief-label` (BRING, AVOID, USE headings)
- **Helper text** — `.helper-text`

---

## Layout Containers

| Class | Description |
|-------|-------------|
| `.collapsible-section` | Expandable block containing header + content. Add `.collapsed` to hide content. |
| `.panel-section-header` | Full-width gray bar with top/bottom borders. Visual container for header. |
| `.collapsible-header` | Flexbox row with title on left, toggle button on right. |
| `.collapsible-content` | Content area below header. Hidden when section has `.collapsed` class. |
| `.collapsible-toggle` | 24px square button showing − or + for expand/collapse. |
| `.collapsible-placeholder` | Shows "..." when section is collapsed. |

## Brief Components

| Class | Description |
|-------|-------------|
| `.brief-container` | Vertical flex container holding multiple brief-rows. |
| `.brief-row` | Vertical stack: label, helper text, then content (picks-list). |
| `.brief-label` | Bold uppercase heading like BRING, AVOID, USE. Uses display font. |
| `.helper-text` | Gray explanatory text below labels. Smaller body font. |
| `.brief-v` | 3-column grid for displaying type pills in rows. |

## Column Layout

| Class | Description |
|-------|-------------|
| `.picks-list` | Container element that receives the column layout dynamically. |
| `.type-columns` | CSS Grid with 3 equal columns. Added to picks-list by JS. |
| `.type-column` | Single vertical column: header pill on top, cards stacked below. |
| `.type-column-header` | Container for the column's type pill header. Full width. |
| `.type-column-cards` | Vertical flex container holding the Pokémon cards. |

## Type Pills

| Class | Description |
|-------|-------------|
| `.type-pill` | Standard pill with colored icon + text label. Inline-flex, 14px font. |
| `.type-pill--block` | Modifier for full-width pills with centered content. |
| `.type-pill.is-selected` | Pressed/inset appearance with inward shadow. |
| `.type-pill-mini` | Tiny 9px pill used for type badges inside Pokémon cards. |
| `.icon-chip` | 18px colored circle containing the type SVG icon. |
| `.icon-chip-mini` | 10px version for mini pills. |
| `.type-name` | Text label inside a type pill. |
| `.type-pill-mini-label` | Text label inside a mini type pill. |

## Pokémon Cards

| Class | Description |
|-------|-------------|
| `.simple-card` | Square card (aspect-ratio: 1) with border, centered content. |
| `.simple-card-cp` | CP badge in top-right corner. Shows "CP X" or "–" if none. |
| `.simple-card-center` | Flex column holding name + type pills, centered in card. |
| `.simple-card-name` | Bold Pokémon name, 14px. Gets `.long-name` for names >12 chars. |
| `.simple-card-types` | Horizontal row of mini type pills showing Pokémon's types. |

## Supporting Elements

| Class | Description |
|-------|-------------|
| `.panel-subtitle` | Section title text like "GENERAL POKéMON". Monospace styling. |
| `.mono` | Utility class for monospace font. |
| `[hidden]` | HTML attribute that sets `display: none`. |

## States & Modifiers

| Class | Effect |
|-------|--------|
| `.collapsed` | On `.collapsible-section` — hides content, shows placeholder |
| `.is-selected` | On `.type-pill` — pressed/inset visual state |
| `.long-name` | On `.simple-card-name` — reduces font to 12px |
| `.type-pill--block` | On `.type-pill` — full width, centered content |

---

## Container Hierarchy

```
.collapsible-section
  └── .panel-section-header
        └── .collapsible-header
              ├── .panel-subtitle
              └── .collapsible-toggle
  └── .collapsible-content
        └── .brief-container
              └── .brief-row
                    ├── .brief-label
                    ├── .helper-text
                    └── .picks-list.type-columns
                          └── .type-column
                                ├── .type-column-header
                                │     └── .type-pill.type-pill--block
                                └── .type-column-cards
                                      └── .simple-card
                                            ├── .simple-card-cp
                                            └── .simple-card-center
                                                  ├── .simple-card-name
                                                  └── .simple-card-types
                                                        └── .type-pill-mini
```

---

## Files

| File | Contains |
|------|----------|
| `styles/app.css` | All component styles |
| `src/ui/render.js` | `createTypePill()`, `makeSimpleCard()`, `renderColumnLayout()` |
| `index.html` | Static markup structure |

---

## Component Functions

| Function | File | Creates |
|----------|------|---------|
| `createTypePill(typeName, asButton)` | render.js | `.type-pill` element |
| `makeSimpleCard(row, typesArr, cp)` | render.js | `.simple-card` element |
| `renderColumnLayout(container, oppTypes, countersByType)` | render.js | `.type-columns` with children |
| `renderTypePills(container, types)` | render.js | Multiple `.type-pill` elements |
| `renderVsSelectedChips()` | render.js | Selected opponent type pills |
| `setCollapsed(el, collapsed)` | render.js | Toggles `.collapsed` class |

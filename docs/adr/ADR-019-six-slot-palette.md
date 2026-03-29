# ADR-019: 6-Slot Color Palette System

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

The current color system uses 8 named slots: primary, secondary, accent, background, surface, text, muted, border. This creates several problems:

1. **Redundancy:** `surface` is functionally `bgSecondary`, `muted` is functionally `textSecondary`, `border` can be derived
2. **Minimalist themes struggle:** A black-and-white theme must fill 8 slots meaningfully when it only needs 2-3 colors
3. **No alternative palettes:** Users can't switch color palettes within a theme
4. **No semantic mapping:** "primary" and "accent" don't tell you WHERE the color is used

Research into design systems (Tailwind CSS, Radix, Shadcn) shows that functional color naming (what it DOES) is more maintainable than semantic naming (what it IS).

## Decision

### 1. All colors expressed as 6 named slots:

| Slot | Purpose | Example (Dark SaaS) | Example (Light Minimalist) |
|------|---------|---------------------|---------------------------|
| `bgPrimary` | Main background | `#0a0a1a` | `#ffffff` |
| `bgSecondary` | Cards, surfaces, sections | `#12122a` | `#f8f9fa` |
| `textPrimary` | Headlines, body text | `#f8fafc` | `#111827` |
| `textSecondary` | Subtitles, muted text | `#94a3b8` | `#6b7280` |
| `accentPrimary` | CTAs, links, active states | `#6366f1` | `#111827` |
| `accentSecondary` | Hover states, secondary accents | `#818cf8` | `#4b5563` |

### 2. Minimalist themes fill multiple slots with same color:

A monochrome theme can set `bgPrimary: "#ffffff"`, `bgSecondary: "#fafafa"`, `textPrimary: "#000000"`, `textSecondary: "#000000"`, `accentPrimary: "#000000"`, `accentSecondary: "#333333"`. Only 3 unique colors filling 6 slots.

### 3. Each theme includes 4 alternative palettes:

```json
"alternativePalettes": [
  { "name": "Blue Steel", "bgPrimary": "#0f172a", ... },
  { "name": "Emerald", "bgPrimary": "#022c22", ... },
  { "name": "Amber", "bgPrimary": "#1c1917", ... },
  { "name": "Monochrome", "bgPrimary": "#0a0a0a", ... }
]
```

### 4. Backward compatibility via `colors` block:

Each theme JSON includes both `palette` (new) and `colors` (old) blocks. The `colors` block maps from palette:
- `primary` = `accentPrimary`
- `secondary` = `accentSecondary`
- `accent` = `accentSecondary`
- `background` = `bgPrimary`
- `surface` = `bgSecondary`
- `text` = `textPrimary`
- `muted` = `textSecondary`
- `border` = derived (10% lighter than bgSecondary)

A `resolveColors()` bridge function converts between formats.

### 5. Palette selector in Simple tab:

5 options per theme displayed as rows of 6 color dots. Selecting a palette calls `applyPalette(index)` which updates `theme.palette`, `theme.colors`, and all `section.style` color references.

## Consequences

**Positive:**
- Fewer slots = easier for users and LLM to reason about
- Minimalist themes naturally work (same colors fill multiple slots)
- Alternative palettes enable quick visual changes without theme switching
- Functional naming (bgPrimary, textPrimary) maps directly to CSS usage

**Negative:**
- Migration: all 10 theme JSONs must add `palette` block
- Hero renderers must be updated to use `resolveColors()` instead of direct `theme.colors.*` access
- 3 optional colors removed (success, warning, error) — reintroduce in a later phase if needed

**Migration:** `resolveColors(theme)` bridge maps both directions. Old configs with only `colors` still work. New configs have both `palette` and `colors`.

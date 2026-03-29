# ADR-021: CSS Custom Properties for Theme Colors

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

Phase 1.0-1.4 used inline `style={{}}` objects for all theme-dynamic colors in hero renderers, features, and CTA components. Colors were read from `resolveColors(theme)` and applied as inline styles (e.g., `style={{ backgroundColor: colors.accentPrimary }}`).

This approach has severe limitations:
1. **No Tailwind variants** — can't use `hover:`, `dark:`, `md:` with inline styles
2. **No CSS transitions** — inline style changes don't animate
3. **No responsive typography** — can't use Tailwind breakpoints with inline font sizes
4. **Theme switch walks all sections** — must replace style objects in every section
5. **shadcn/ui components** expect CSS variables for theming, not prop-based colors

## Decision

### 1. Theme palette is expressed as CSS custom properties on the preview container:

```css
--theme-bg: #0a0a1a;
--theme-surface: #12122a;
--theme-text: #f8fafc;
--theme-muted: #94a3b8;
--theme-accent: #6366f1;
--theme-accent-secondary: #818cf8;
--theme-font: Inter;
```

### 2. Tailwind config extends colors to reference these variables:

```ts
// tailwind.config.ts
colors: {
  'theme-bg': 'var(--theme-bg, #0a0a1a)',
  'theme-surface': 'var(--theme-surface, #12122a)',
  'theme-text': 'var(--theme-text, #f8fafc)',
  'theme-muted': 'var(--theme-muted, #94a3b8)',
  'theme-accent': 'var(--theme-accent, #6366f1)',
  'theme-accent-secondary': 'var(--theme-accent-secondary, #818cf8)',
}
```

### 3. Components use Tailwind classes instead of inline styles:

Before: `style={{ backgroundColor: colors.accentPrimary }}`
After: `className="bg-theme-accent"`

Before: `style={{ color: section.style.color }}`
After: `className="text-theme-text"`

### 4. A `useThemeVars` hook syncs palette changes to CSS properties:

Subscribes to configStore theme changes, calls `resolveColors()`, and sets all 7 CSS properties on the preview container element. Theme switch = update 7 CSS vars.

### 5. Inline styles are reserved for truly dynamic values:

- Gradient backgrounds (CSS gradients can't be Tailwind classes)
- Background images/videos (dynamic URLs)
- Complex overlay patterns

## Consequences

**Positive:**
- Tailwind hover/focus/responsive variants work on theme colors
- shadcn/ui Button, Badge, Card integrate naturally
- Theme switch is O(1) — set 7 CSS vars, not walk N sections
- Light/dark mode becomes possible via CSS var swap
- CSS transitions on theme change "for free"

**Negative:**
- Migration cost: all renderers must be updated
- Gradient backgrounds still need inline styles (acceptable)
- CSS vars have no TypeScript type checking (runtime only)

**Supersedes:** The inline `style={{ resolveColors() }}` pattern from Phase 1.3-1.4.

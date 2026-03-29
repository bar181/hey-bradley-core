# CSS Architecture Debt — Honest Assessment

**Date:** 2026-03-29
**Severity:** High — affects every future component and mode (light/dark/responsive)

---

## The Problem

The JSON-driven rendering system uses **inline CSS `style={{}}` objects** instead of **Tailwind utility classes** and **shadcn/ui components**. This was expedient for Phase 1 but creates compounding debt.

### Where It's Broken

| File | Inline Styles | Should Be |
|------|--------------|-----------|
| `HeroCentered.tsx` | `style={{ background, color, padding, fontFamily }}` | Tailwind classes + CSS variables |
| `HeroSplit.tsx` | `style={{ background, color, padding, fontFamily, maxWidth }}` | Tailwind classes + CSS variables |
| `HeroOverlay.tsx` | `style={{ backgroundColor: colors.accentPrimary }}` | Tailwind `bg-[var(--accent)]` |
| `HeroMinimal.tsx` | `style={{ backgroundColor: colors.accentPrimary, color: colors.bgPrimary }}` | Tailwind + CSS vars |
| `FeaturesGrid.tsx` | `style={{ background, color }}` on section + cards | Tailwind + CSS vars |
| `CTASimple.tsx` | `style={{ background, color, backgroundColor }}` | Tailwind + CSS vars |
| All theme JSONs | `"style": { "background": "#0a0a1a", "color": "#f8fafc" }` | CSS variable names, not hex values |

### Why It Matters

1. **Light/dark mode is impossible** with hardcoded hex in JSON. You can't `dark:bg-slate-900` when the color is `style={{ background: '#0a0a1a' }}`.

2. **Responsive variants are impossible**. Can't do `md:text-5xl` with `style={{ fontSize: '56px' }}`.

3. **Hover/focus/active states are impossible** with inline styles. CTAs need hover effects.

4. **shadcn/ui Button component** has built-in variants (default, destructive, outline, secondary, ghost, link) with proper focus rings, disabled states, and sizes. We're rendering raw `<a>` tags with hardcoded classes.

5. **Tailwind's design system** (spacing scale, color palette, typography scale) is bypassed entirely. Every component reinvents sizes.

6. **Theme switching** requires walking all section style objects and replacing hex values. With CSS variables, it's one `document.documentElement.style.setProperty()` call.

### What shadcn/ui Components We Should Be Using

| Current | Should Be |
|---------|-----------|
| `<a className="px-8 py-3 rounded-lg...">` | `<Button variant="default" size="lg">` |
| `<span className="inline-flex items-center gap-1.5 rounded-full...">` | `<Badge variant="outline">` |
| `<input className="bg-hb-surface border...">` | `<Input>` from shadcn |
| `<textarea className="bg-hb-surface...">` | `<Textarea>` from shadcn |
| Custom accordion in ThemeSimple | `<Accordion>` from shadcn |
| Toggle switches | `<Switch>` from shadcn |
| Segmented controls | `<Tabs>` or `<ToggleGroup>` from shadcn |

### The Right Architecture (Phase 2)

```
Theme JSON → CSS custom properties on :root
  ├── --bg-primary: #0a0a1a
  ├── --bg-secondary: #12122a
  ├── --text-primary: #f8fafc
  ├── --text-secondary: #94a3b8
  ├── --accent-primary: #6366f1
  └── --accent-secondary: #818cf8

tailwind.config.ts extends colors:
  colors: {
    'theme-bg': 'var(--bg-primary)',
    'theme-surface': 'var(--bg-secondary)',
    'theme-text': 'var(--text-primary)',
    'theme-muted': 'var(--text-secondary)',
    'theme-accent': 'var(--accent-primary)',
  }

Components use Tailwind:
  <section className="bg-theme-bg text-theme-text py-20 px-6">
  <Button className="bg-theme-accent text-theme-bg">
```

Theme switching = update 6 CSS variables. No section style walking. No inline styles. Light/dark mode = swap the variables. Responsive = Tailwind breakpoints just work.

### Impact Score

| Metric | Current | With Fix |
|--------|---------|----------|
| Lines of inline CSS | ~150+ across renderers | 0 |
| Theme switch complexity | Walk all sections, replace style objects | Set 6 CSS vars |
| Light/dark support | Not possible | CSS vars + Tailwind dark: |
| Responsive typography | Not possible | Tailwind breakpoints |
| shadcn/ui usage | 0 components in preview | Button, Badge, Card, Input |
| Maintainability | Every new section copies inline patterns | Tailwind classes, consistent |

---

## Recommendation

**Phase 2 P0:** Migrate the 6 palette slots to CSS custom properties on the preview container. Update `tailwind.config.ts` to reference them. Refactor hero renderers to use Tailwind classes. Replace raw `<a>` CTAs with shadcn `<Button>`. This unblocks light/dark mode, responsive, and all future sections.

**Estimated effort:** 1 session (2-3 hours) for the migration. Every session after that is faster because new components use Tailwind + shadcn from the start.

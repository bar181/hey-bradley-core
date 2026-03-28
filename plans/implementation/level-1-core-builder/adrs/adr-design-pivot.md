# ADR: Design Pivot — Dark Precision (Replaces Warm Cream)

**Date:** 2026-03-28 | **Status:** ACCEPTED | **Supersedes:** ADR-009b (Warm Light Chrome)

## Context

The initial "Warm Precision" design (#faf8f5 cream, #e8772e orange) produced a shell that looked like a generic CRM or admin dashboard. For a Harvard capstone reviewed by a UI designer SME, the primary success factor is "wow factor" — and the cream palette fails to deliver that. The red AI orb also looks like an error state on cream backgrounds.

## Decision

Pivot to a **Dark Precision** aesthetic — deep slate/navy IDE inspired by Vercel, Linear, Supabase Studio, and Cursor. This is now the default and only mode for the builder chrome. The REALITY canvas (center panel) remains a light preview by default (showing the user's website), creating a natural contrast between the dark tool and the light output.

## Design Inspiration Sources

| Reference | What to Take | URL |
|-----------|-------------|-----|
| **Vercel Dashboard** | Pure dark bg, minimal chrome, performance-first density, deployment status colors | vercel.com |
| **Linear App** | LCH color space for uniform perception, Inter Display headings, subtle hover states, command-palette feel | linear.app |
| **Supabase Studio** | Dark panel backgrounds, Radix-based components, schema editor density, toggle patterns | supabase.com/dashboard |
| **Cursor IDE** | Three-panel dark layout, file tree on left, editor center, AI panel right, terminal bottom | cursor.sh |
| **Raycast** | Pill toggles on dark, keyboard-first aesthetic, monospace labels, bold accent on dark | raycast.com |
| **Framer** | Design tool with dark canvas, property inspector, layer tree, section-based editing | framer.com |

## New Color Palette: "Dark Precision"

```css
:root {
  /* ═══ BUILDER CHROME (dark slate) ═══ */
  --hb-bg:              #0f172a;    /* App background — deep navy/slate (slate-900) */
  --hb-surface:         #1e293b;    /* Panels, cards, inputs (slate-800) */
  --hb-surface-hover:   #334155;    /* Hover states (slate-700) */
  --hb-border:          #334155;    /* Borders, dividers (slate-700) */
  --hb-border-selected: #3b82f6;    /* Selected section border (blue-500) */

  /* ═══ TEXT ═══ */
  --hb-text-primary:    #f8fafc;    /* Headings, primary labels (slate-50) */
  --hb-text-secondary:  #94a3b8;    /* Descriptions, hints (slate-400) */
  --hb-text-muted:      #64748b;    /* Disabled, subtle text (slate-500) */

  /* ═══ ACCENT (electric blue) ═══ */
  --hb-accent:          #3b82f6;    /* Active tabs, toggles, CTAs (blue-500) */
  --hb-accent-light:    rgba(59, 130, 246, 0.15);  /* Accent backgrounds */
  --hb-accent-hover:    #2563eb;    /* Hover on accent elements (blue-600) */

  /* ═══ SEMANTIC ═══ */
  --hb-success:         #22c55e;    /* Completed steps, connected (green-500) */
  --hb-warning:         #f59e0b;    /* Validation in progress (amber-500) */
  --hb-error:           #ef4444;    /* Errors (red-500) */

  /* ═══ LISTEN MODE (stays the same — dark on dark) ═══ */
  --hb-listen-bg:       #0a0a0f;    /* Listen mode overlay (near-black) */
  --hb-listen-orb:      #ef4444;    /* Red orb — now POPS on dark bg */

  /* ═══ CODE / DATA TAB ═══ */
  --hb-code-bg:         #1e293b;    /* JSON editor background */
  --hb-code-key:        #3b82f6;    /* JSON keys (blue) */
  --hb-code-string:     #22c55e;    /* JSON string values (green) */
  --hb-code-number:     #f59e0b;    /* JSON numbers (amber) */
  --hb-code-bracket:    #64748b;    /* Brackets, colons (muted) */
}
```

## Typography (Unchanged)

- **DM Sans** — UI text, headings, body, buttons, inputs
- **JetBrains Mono** — Structural labels, code, status bar, JSON, AISP specs
- All structural labels: monospace + uppercase + tracking-wide

## Component Patterns (From References)

### Left Panel — Draft Mode (from love-left-panel.png)
- Theme/vibe selector: 2x2 grid of dark cards with 3 colored dots each
- "Active palette" row showing selected colors with + button
- Sections list: draggable rows with icon + name + monospace ID tag (e.g., "H-1")
- "Add Sections" as 2-column grid of outlined icon buttons

### Left Panel — Expert Mode (from love-expert-hero.png)
- 3-layer collapsible tree: Theme > Section > Component
- Section headers: "Hero Section • H-1" with back navigation
- Toggle switches for element visibility (Eyebrow Badge, Primary Button, etc.)

### Right Panel — Expert Inspector (from love-core-style-hero.png)
- BUILD | CONTENT | STYLE | ADVANCED tab navigation
- Segmented pill controls for discrete options (S/M/L/XL, 2:1/16:9/Full)
- Color swatches as small circles with selection ring
- Compact property rows with label left, control right
- Bottom 50%: RAW AISP SPEC code viewer

### Reality Canvas — Default Hero
- Dark gradient background (not cream)
- Massive gradient-clipped headline
- Frosted glass eyebrow badge (backdrop-blur, bg-white/10)
- Glowing CTA button
- Proves JSON engine handles complex modern CSS

## Trade-offs

| Gave Up | Gained |
|---------|--------|
| Warm, approachable cream aesthetic | Professional, "funded startup" presence |
| Orange accent on light backgrounds | Blue accent that reads clean on dark |
| Light-mode-first design | Red orb looks cinematic instead of like an error |
| ADR-009b compliance | Design that matches best-in-class dev tools |

## Consequences

1. ALL existing components need color updates (Tailwind classes)
2. The REALITY canvas preview now contrasts beautifully against the dark chrome
3. Listen Mode dark overlay becomes a subtle deepening of already-dark UI
4. The red orb effect will be dramatically more impactful
5. Expert mode density is easier to achieve on dark backgrounds (less visual noise)

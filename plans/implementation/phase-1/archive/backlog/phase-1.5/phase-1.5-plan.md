# Phase 1.5: Tailwind + shadcn Migration + SIMPLE Tab Redesign

**Date:** 2026-03-29
**Goal:** Migrate from inline CSS to Tailwind CSS custom properties + shadcn/ui components. Redesign SIMPLE tab with toggle-beside-content pattern.
**Principle:** KISS — CSS vars for theme colors, Tailwind for layout, shadcn for interactive elements.

---

## Checklist

### P0 — Architecture
- [ ] 1.5.1: Install shadcn/ui + init (Button, Badge, Switch, Input, Textarea, Accordion, Card)
- [ ] 1.5.2: ADR-021 — CSS custom properties for theme colors
- [ ] 1.5.3: Extend tailwind.config.ts with theme-* colors referencing CSS vars
- [ ] 1.5.4: Theme applicator — sets CSS vars on preview container from current palette

### P0 — Renderer Migration
- [ ] 1.5.5: HeroCentered → Tailwind + shadcn Button
- [ ] 1.5.6: HeroSplit → Tailwind + shadcn Button
- [ ] 1.5.7: HeroOverlay → Tailwind + shadcn Button
- [ ] 1.5.8: HeroMinimal → Tailwind + shadcn Button
- [ ] 1.5.9: FeaturesGrid → Tailwind + shadcn Card
- [ ] 1.5.10: CTASimple → Tailwind + shadcn Button

### P0 — SIMPLE Tab Redesign
- [ ] 1.5.11: Toggle-beside-content pattern (Switch inline with each field label)
- [ ] 1.5.12: SIMPLE = Design + Content only; move advanced options to EXPERT

### P1 — JSON + Backlog
- [ ] 1.5.13: Verify all JSON files (master, constraints, per-theme defaults, project)
- [ ] 1.5.14: Log image/video selection dialog to Level 1 backlog

### Verification
- [ ] Build passes
- [ ] Playwright UI/UX scoring (1-5 per section)
- [ ] No inline style={{}} in hero renderers (except truly dynamic values)

---

## Architecture: CSS Custom Properties Pattern

```
// Theme palette → CSS variables (set on preview container)
--theme-bg: #0a0a1a;
--theme-surface: #12122a;
--theme-text: #f8fafc;
--theme-muted: #94a3b8;
--theme-accent: #6366f1;
--theme-accent-secondary: #818cf8;

// tailwind.config.ts extends colors:
'theme-bg': 'var(--theme-bg)',
'theme-surface': 'var(--theme-surface)',
'theme-text': 'var(--theme-text)',
'theme-muted': 'var(--theme-muted)',
'theme-accent': 'var(--theme-accent)',

// Components use Tailwind:
<section className="bg-theme-bg text-theme-text py-20 px-6">
<Button className="bg-theme-accent text-theme-bg hover:opacity-90">

// Theme switch = update 6 CSS vars (no section style walking)
```

## SIMPLE Tab Redesign

Reference: hero-image-left.png screenshot — green checkmarks beside content.

```
┌─────────────────────────────────────┐
│ HERO SECTION • H-1                  │
│                                     │
│ ▼ CONTENT                          │
│                                     │
│ ☑ Badge Text                       │
│   [Hey Bradley 2.0 is Live    ] ___│
│                                     │
│ ☑ Headline                         │
│   [Build Websites by Just     ] ___│
│   [Talking                    ]    │
│                                     │
│ ☑ Subtitle                         │
│   [Describe what you want...  ] ___│
│                                     │
│ ☑ Primary CTA                      │
│   [Start Building             ] ___│
│                                     │
│ ☐ Secondary CTA                    │
│   (disabled — toggle on to edit)   │
│                                     │
│ ☑ Hero Image                       │
│   [https://images.unsplash... ] ___│
│                                     │
│ ☐ Trust Badges                     │
│   (disabled — toggle on to edit)   │
│                                     │
│ ▼ DESIGN                           │
│   Theme preset cards (2-col grid)   │
│   Palette selector                  │
│   Font selector                     │
└─────────────────────────────────────┘
```

Each component row has: Switch toggle + label + input field.
When toggled OFF: input is disabled/dimmed.
When toggled ON: input is active and editable.

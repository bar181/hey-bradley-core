# Baseline — Build Plan template

## Scores (iter-0)

| Site | Score |
|---|---|
| Blog | 38 |
| Portfolio | 48 |
| Marketing | 35 |
| **Composite** | **40.3** |

Gate (≥75): **FAIL** by 35.

## Per-site verdicts

- **Blog (38):** 4 phases / "~8 days" for a 5-section static site; DoD is mostly tautological ("section renders with X").
- **Portfolio (48):** Most observable DoD of the three (cross-browser list, breakpoint specifics), but no day count at all, no stack, no dependency arrows.
- **Marketing (35):** Worst. "~8 days" for 6 sections of cards/logos/testimonials. DoD pure restatement.

## Top 3 weaknesses

1. **Fantasy effort.** Blog and Marketing both claim ~8 days for a static brochure site. A single afternoon in Next.js + shadcn covers each.
2. **Tautological DoD.** Marketing Phase 2: scope = "Tiered pricing structure", DoD = "Pricing section renders with 3 tiered pricing cards" — DoD just re-says scope.
3. **No stack, no hosting, no integrations, no dependency graph.** None of the three plans name a framework, form/newsletter handler, video embed provider, analytics, deploy target, or Lighthouse/a11y gate.

## Concrete template revision

Add to `systemPrompt`:

> *"Effort budget: assume Next.js + Tailwind + shadcn + Vercel. Allocate **0.25–0.5 day per section** for static sections, **+0.5 day** for each integration (form handler, analytics, video embed, CMS, auth), **+1 day** for a11y/Lighthouse pass, **+0.5 day** for deploy. Total must equal the sum of the rows. Add a fifth required column **'Depends on'** (phase numbers or 'none'). Each DoD row must include at least one **measurable threshold or external check** (Lighthouse score, HTTP 200, form POST returns 2xx, contrast ratio, breakpoint px) — not just 'renders'. Name the stack, hosting target, and any third-party services in Phase 1 scope."*

Tighten `validation.mustContain` to `["| Phase |", "| Scope |", "| Depends on |", "| Effort |", "| DoD |"]` and add `mustContain: ["Vercel", "Lighthouse"]` (or equivalent named tooling).

Predicted lift: composite ~80.

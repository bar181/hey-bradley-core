# Baseline — Architecture (SADD) template

## Scores (iter-0)

| Site | Score |
|---|---|
| Blog | 42 |
| Portfolio | 28 |
| Marketing | 45 |
| **Composite** | **38.0** |

Gate (≥75): **FAIL** by 37. **Worst baseline of the 6 non-AISP specs.**

## Per-site verdicts

- **Blog (42):** 3 contexts named, ASCII flow, lists fonts + newsletter API. Missing everything an implementer needs.
- **Portfolio (28):** 5 contexts but flow is one degenerate line, zero dependencies (no YouTube embed, no mailto handler, no image CDN despite 6 hosted thumbs).
- **Marketing (45):** 4 contexts, decent flow, names "external scheduling" + analytics but the config's CTA is actually `mailto:` not a scheduler — hallucinated dependency.

## Top 3 weaknesses

1. **Zero implementation decisions.** No stack, no routing, no hosting target, no build tool, no form handler choice, no image strategy. An engineer cannot start work.
2. **DDD theater on brochureware.** "Bounded contexts" for 5 static sections is cargo-cult — "Navigation," "Hero Display," "Contact Information" are *components*, not domains.
3. **No quality gates.** Missing: LCP/INP budgets, a11y target, SEO/OG/JSON-LD, error/empty/loading states, responsive breakpoints, dark-mode handling.

## Concrete template revision

**Replace "Bounded contexts" with site-class branching.** Add required `## Site class` field (`static-brochure` | `content-driven` | `interactive-app`). For `static-brochure` (all 3 here), require these sections instead of DDD:

```
## Site class: static-brochure
## Stack: <framework + rationale, e.g., "Astro 4 — zero-JS by default, 1.5s LCP">
## Routing: <SPA anchors | MPA routes | hybrid>
## Hosting & build: <Vercel/Netlify/Cloudflare; static export>
## Integrations: <form handler, analytics, embed providers, image CDN — each with fallback>
## Runtime states: <loading, empty, error per interactive component>
## Quality budgets: <LCP, INP, CLS, bundle KB, WCAG level, reduced-motion>
## SEO & social: <title/meta/OG/JSON-LD strategy>
```

Reserve DDD bounded-contexts block for `interactive-app` only. Predicted lift: composite ~80.

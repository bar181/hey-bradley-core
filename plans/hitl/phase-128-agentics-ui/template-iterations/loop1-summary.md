# Loop 1 — re-score summary

Baseline composite **53.8/100** → Loop 1 composite **83.0/100** (+29.2 in one loop).

| Spec | Baseline | Loop 1 | Δ | Pass ≥80 |
|---|---|---|---|---|
| North Star | 51.7 | **84.0** | +32.3 | ✅ |
| Features | 58.0 | **84.0** | +26.0 | ✅ |
| Architecture | 38.0 | **82.0** | +44.0 | ✅ |
| CSS | 69.0 | **88.0** | +19.0 | ✅ |
| Build Plan | 40.3 | **84.7** | +44.4 | ✅ |
| Human Spec | 66.0 | 75.3 | +9.3 | ❌ |

## Loop-1 revisions that landed

| Spec | Revision | Effect |
|---|---|---|
| **North Star** | 4-section contract (pitch / audience / win / differentiator); persona = role+stage+trigger; win = measurable verb tied to CTA; differentiator = real competitor named | +32 |
| **Features** | Force-rank cap (max 4 P0); `Section: #<id>` + `Depends: <ids\|none>`; reject layout padding; Mermaid `flowchart LR` dependency graph | +26 |
| **Architecture** | Site-class branching (static-brochure / content-driven / interactive-app); pinned-version stack (Astro 4 + Tailwind 4); required Stack / Routing / Hosting / Integrations / Runtime states / Quality budgets / SEO / Data flow sections; Mermaid data-flow diagram; DDD reserved for interactive-app only | +44 |
| **CSS** | Both light+dark palette variants always; 2026 breakpoints (sm/md/lg/xl/2xl); responsive sectionPadding+baseSize; motion {default,reduced} for WCAG 2.3.3; `#`-prefixed 6-char hex; `_warnings` for mode/luminance contradictions | +19 |
| **Build Plan** | Required cols Phase/Scope/Depends on/Effort/DoD; effort budget formula (0.25-0.5 day per section + 0.5/integration + 1 a11y + 0.5 deploy); DoD must include measurable threshold (Lighthouse / 2xx / contrast / breakpoint / KB / LCP); Mermaid Gantt chart; `Total effort:` line | +44 |
| **Human Spec** | 3-paragraph hard 300-word cap; paragraph 3 must name real competitor + measurable win condition; banned-vocab list (revolutionary / unlock / unprecedented / seamless / etc.); if site.tagline empty say so explicitly | +9 (insufficient) |

## Outstanding gap — Human Spec at 75.3

Concrete tweaks from the loop-1 reviewer:
1. **Named-brand competitor allowlist** — reject "generic freelancing platforms" / "LinkedIn profile" as too soft. Require one of: Squarespace / Webflow / Framer / Medium / Substack / Linktree / Toptal / Clutch / Upwork / Fiverr / Notion / WordPress / Mailchimp.
2. **Theme-mode fact-check pass** — Atlas marketing's `theme.mode: 'light'` with `#0A1128` (navy) bg is a contradiction the LLM is repeating instead of flagging. Force a `Note: theme.mode declared <X> but palette luminance is <Y>` line when mismatch detected.

## Cost — loop 1

- Pipeline re-run: $0.085
- 6 parallel re-scorers (Claude API): bundled
- Total this loop: ~$0.085

## Web-search insights folded into templates

- **Architecture:** Astro 4 + Tailwind for static brochures (lighter than Next.js when no SSR/API), Vercel + Cloudflare Pages as default hosts, LCP target ≤1.5s, mobile-first
- **North Star:** measurable + leading indicator + named persona archetype + strategic-alignment win condition
- **CSS:** light/dark as first-class peers (not variants), 2026 breakpoints 480/768/1024/1280/1536, `prefers-reduced-motion` per WCAG 2.3.3, clamp() for fluid type
- **Features:** force-ranked P0 (no ties), explicit dependency graph, regular reprioritization cadence

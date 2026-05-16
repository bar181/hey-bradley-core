# P128 Step 3 — Template quality lift scorecard

> Gate: all 6 non-AISP templates must score ≥80/100 on brutal-honest review.
> Audience: capable developer or AI agent (not junior).
> Method: 3 iteration loops authorized; each loop = revise → re-run pipeline → re-score with same reviewer agents.

## Final scorecard

| Spec | Baseline | Loop 1 | Loop 2 | Loop 3 | Final | Δ |
|---|---|---|---|---|---|---|
| North Star | 51.7 | **84.0** | — | — | **84.0** | +32.3 ✅ |
| Features | 58.0 | **84.0** | — | — | **84.0** | +26.0 ✅ |
| Architecture | 38.0 | **82.0** | — | — | **82.0** | +44.0 ✅ |
| CSS | 69.0 | **88.0** | — | — | **88.0** | +19.0 ✅ |
| Build Plan | 40.3 | **84.7** | — | — | **84.7** | +44.4 ✅ |
| Human Spec | 66.0 | 75.3 | 76.7 | **85.7** | **85.7** | +19.7 ✅ |
| **Composite** | **53.8** | **83.0** | — | — | **84.7** | **+30.9** |

## Loop breakdown

**Loop 1** (all 6 templates revised in one batch):
- Web-search insights folded in (2026 SaaS stack, North Star metrics, design-token best practices, P0/P1/P2 prioritization)
- 5 of 6 templates cleared ≥80 in one loop
- Cost: $0.085 pipeline + reviewer agents

**Loop 2** (Human Spec only — CTA paraphrasing was the blocker):
- Added competitor allowlist (Squarespace / Webflow / Medium / Toptal / etc.)
- Banned vague phrasings ("generic freelancing platforms")
- Composite +1.4 — still below bar (CTA still paraphrased)

**Loop 3** (Human Spec — programmatic CTA extraction):
- Pipeline now extracts `exactCta` from hero section programmatically + injects as template variable
- Template requires literal double-quoted match
- Theme-mode note pre-computed (only fires on genuine contradiction)
- Composite +9.0 → **85.7** ✅

## Quality (not quantity) — diagrams + workflows added

- **Features:** Mermaid `flowchart LR` dependency graph (P0→P1→P2 visualization)
- **Architecture:** Mermaid `flowchart LR` data-flow diagram (visitor entry → conversion target with error paths)
- **Build Plan:** Mermaid `gantt` chart visualizing phase dependencies and effort

## Audience alignment — capable dev/AI not junior

Templates now reference:
- Pinned versions (Astro 4, Tailwind 4, Next.js 14, TypeScript 5.4)
- Real services with fallbacks (Formspree → mailto, Buttondown → mailto, Cloudinary → raw img, Plausible vs GA)
- Measurable quality budgets (LCP ≤1.5s, INP ≤200ms, CLS ≤0.05, JS ≤25KB gzip, WCAG 2.2 AA, contrast ≥4.5)
- 2026 responsive breakpoints (480/768/1024/1280/1536)
- WCAG 2.3.3 motion-reduce
- HTTP code assertions (form POST 2xx, mailto: opens default client)
- Named persona archetypes (role + stage + trigger; reject "general users")
- Real competitor names from allowlist (Squarespace / Webflow / Framer / Medium / Toptal / etc.)
- Force-ranked priorities (max 4 P0; P0 may only depend on P0)

## Cost

- Loop 1 pipeline: $0.085
- Loop 2 pipeline: $0.085
- Loop 3 pipeline: $0.085
- Reviewer agents (Claude API, parallel): bundled
- Web search: $0
- **Total: ~$0.26** / $10 phase budget (2.6%)

## What's next

UI work (F4-F8) is now unblocked per owner directive ("Do not ship the Agentics card UI until the non-AISP templates are at 75/100 or better"). We exceeded the bar at 80+ across all 6.

Carry-forward into UI work:
- Specs Zustand store + localStorage persistence (F4)
- Config-hash staleness detector (F5)
- Agentics card UI with green/yellow badges + progress bar + checklist (F6)
- Pipeline wiring decision: browser BYOK direct vs serverless function (F7 — ADR-158)
- E2E verification (F8)

# Baseline — Human Spec template

## Scores (iter-0)

| Site | Score |
|---|---|
| Blog | 58 |
| Portfolio | 74 |
| Marketing | 66 |
| **Composite** | **66.0** |

Gate (≥75): **FAIL** by 9.

## Per-site verdicts

- **Blog (58):** Hallucinates ("dynamic whiteboard platform," "creators and innovators," "Your ideas, made real"). Source `site.description` is empty, so the model invented a Hey-Bradley-flavored fiction unrelated to the blog config. Generic palette/section call-outs read like template residue. No real win condition.
- **Portfolio (74):** Concrete palette (`#fdfaf6`, `#80a490`), real type pairing, real sections. Win condition ("direct inquiries") is plausible but soft. Leans on "thoughtful visual experiences" — verbatim site tagline, not insight.
- **Marketing (66):** Names palette and sections correctly but paragraph 3 collapses into fluff ("unlock unprecedented growth and efficiency"). Differentiator is "direct, professional presentation" — meaningless.

## Top 3 weaknesses

1. **Win condition is generic** — "users transform ideas," "initiate inquiries," "feel assured" — none site-specific or measurable.
2. **Differentiator absent** — paragraph 3 restates paragraph 1 instead of naming what this site does that competitors don't.
3. **Empty-source fallback hallucinates** — blog's missing `site.description` triggered a Hey-Bradley pastiche; template has no guardrail for thin inputs.

## Concrete template revision

In `systemPrompt`, replace paragraph-3 instruction with:

> *"Paragraph 3 (~80 words) — State the ONE differentiator (what this site does that a generic <site-type> doesn't) and ONE measurable win condition (e.g., 'visitor books a discovery call,' 'reader subscribes after reading 2+ articles'). If source `site.description` is empty, say so explicitly — do NOT invent a mission."*

Predicted lift: composite ~78.

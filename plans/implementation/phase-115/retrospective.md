# P115 — Retrospective

> **Phase:** P115 / VISUAL-QUALITY-BUILDER-POLISH
> **Branch:** swarm/p115-visual-quality
> **Sealed:** Wave 1 at `2488da6` (5 parallel agents + P114 closer fold-in); Wave 2 closer this commit
> **Date:** 2026-05-06

## Visual quality outcomes

### Builder UX (Lovable-relative)

| Phase | Composite | Lovable Delta |
|-------|----------:|---------------|
| Pre-fix (P114 baseline) | 7.5 / 10 | -1.5 (Lovable ≈ 9.0) |
| Post-fix (P115 / A1) | **8.6 / 10** | **-0.4** |

Target ≥8.5 met. Five top friction points closed: drag handle always visible (now hover-reveal), delete-confirm icon-only flash (now inline caption), right-panel body unmount-hard (now single-icon rotate), `transition-all` over-broad row hover (now `transition-colors`), and right-panel collapse-button hover-bg duration drift (now explicit duration-200).

### Article / Blog / Case-study (Substack / Medium / Linear-relative)

| Section type | Pre | Post | Notes |
|--------------|----:|-----:|-------|
| Article (TextSingle / WithSidebar / TwoColumn) | 6 | **8.5** | 17px body + 1.7 line-height + max-w-[68ch] + drop-cap on first paragraph ≥120 chars |
| Blog (4 templates) | 7 | **8.5** | author · date · readTime metadata strip + category chip |
| Case-study (CaseStudyCards) | 6 | **8.5** | 3xl/4xl metric callout + before/after structure (problem → solution) + client-role attribution |

### Bottom-15 template lift (A5)

- Templates ≥7.0 in in-scope cohort: was 38/56 (68%); now **52/53** of base (**98.1%**)
- 1 template intentionally minimal: `blank` (composite 6.8 by design — empty scaffold)
- Substantive lifts (full hero rewrite + metadata fill): enterprise-saas, real-estate, dev-portfolio, fun-blog, law-firm
- Targeted backfills (tagline + voiceAttributes only): 9 cohort-review templates
- Total JSON delta: +161 / -49 = net +112 LOC across 15 files

### 3 NEW vastly different demos (A4)

- `editorial-magazine.json` — dark Fraunces serif, photo-essay, 2,500-word lead essay, six issues a year; cites `theron-miller-hard-twist` storytelling preset
- `indie-game-studio.json` — near-black + neon-pink + Press Start 2P pixel typography; cites `founder-direct` storytelling preset
- `research-lab.json` — clean white + navy/green + IBM Plex Serif; cites `academic-rigor` storytelling preset
- EXAMPLE_SITES population: 56 → **59**
- All 3 Zod-valid against MasterConfig; voiceAttributes ≥3 each; real opinionated copy with named characters/places/dates/numbers (no Lorem)

### Image handling (A3)

5 of 5 canonical interactions verified:

1. Click → lightbox (default; was opt-in via `imageEffect`)
2. 200ms scale-95 → scale-100 enter animation (`animate-lightbox-scale-in` keyframe)
3. Gradient overlay support (per-section `imageEffect` value; 12 templates)
4. Hover scale-105 with `overflow-hidden` container (9+ templates: image / gallery / hero)
5. Broken-image fallback gradient placeholder (NEW `ImageFallback` + `useImageError` shared helpers)

ADR-102 `loading="lazy"` + explicit `width`/`height` extended to 6 more `<img>` tags.

## Keep

- **5 parallel disjoint-scope agents in Wave 1** — A1-A5 all sealed in a single commit (`2488da6`) with zero merge conflicts; A4 in-flight files (3 new demos) were carved out of A5's scope at preflight authoring time so the bottom-15 fix did not touch the same JSON files that A4 was creating.
- **Audit doc artifacts as load-bearing closure evidence** — `docs/audit/p115-builder-ux-audit.md` + `docs/audit/p115-template-scoring.md` carry the 1-10 scoring tables. The closer ADR cites them by path; future audits can grep against the same shape.
- **KISS no-new-deps held** — 5 visual-quality decisions shipped without a single new dependency. `framer-motion` is the only animation lib in baseline (pre-existing per package.json) and was NOT used in Wave 1; chevron rotate + lightbox scale-in + hover-scale all run on Tailwind transitions.
- **Closer ADR ≤120 LOC discipline** — ADR-143 lands at ~85 LOC despite 5 decisions; consequence prose is concise, acceptance gates do the heavy lifting.

## Drop

- **Pre-staged route stubs** — Wave 1 didn't need new routes; the 3 new demos slot into existing `/demo/<slug>` route via EXAMPLE_SITES. No P115-specific route plumbing required.
- **`framer-motion` is in package.json baseline but unused in P115** — neither hook nor primitive imported. Kept the dep (other phases own it; not in scope to remove). KISS denylist drops it from the forbidden list per P105.7 + P106.9 + P110.15 + P111.10 precedent (deps NOT pre-existing in baseline).

## Reframe

- **"Builder UX ≥8.5" is now a measurable + comparable bar.** The pre/post composite scores in `docs/audit/p115-builder-ux-audit.md` give a numeric handle that future Builder polish sprints can re-score against. Lovable-delta ≤1 is the operational target.
- **"Long-form section types ≥8.0 vs Substack/Medium/Linear" is now codified.** 17px floor + 1.7 line-height + 68ch cap + mb-6 paragraph spacing + drop-cap on first paragraph ≥120 chars are the canonical typography for long-form. Future text-section templates that ship without these defaults fall below the bar.
- **"Bottom-15 lift" generalizes to a template-quality regression guard.** A5's 4-axis rubric (palette / completeness / copy / differentiation) gives a re-runnable scoring shape; a future spec could lock this in via CI like P109's section-enum drift guard.

## What's still deferred

- **Body height-animated container on right-panel editor** — A1 carry-forward; right-panel still hard-mounts via `{expanded && (...)}`. Lovable parity wants `max-h` transition. Targets P116.
- **Drag-drop visual ghost** — A1 carry-forward; current reorder is keyboard + ▲▼ buttons only. Targets P116.
- **Multi-select reorder** — out of P115 scope; Tier-2 commercial UX.
- **12 templates with invalid tone/purpose/audience enum values** — A5 surfaced during scoring pass; existing data, not P115-introduced; targets P116.
- **Full-Σ_512 AISP scoring** — pending ADR-C07 Wave 4 WASM crate per ADR-140; the TS heuristic stopgap still covers ~40 of 512 symbols.
- **LLM-enriched voice extraction** — CF#4 BYOK owner-required; P113 closer landed rules-only baseline.
- **Husky pre-commit wire** — owner-action carry-forward from ADR-138 D3 / ADR-139 D3 / ADR-140 D3; sandbox blocks `.husky/` modify.

## Carry-forward registry

| ID | Description | Owner | Target |
|----|-------------|-------|--------|
| CF-P115-1 | Right-panel editor body height-animated transition | Eng | P116 |
| CF-P115-2 | Drag-drop visual ghost on builder reorder | Eng | P116 |
| CF-P115-3 | 12 templates with invalid enum values (palette/copy fine; enums stale) | Eng | P116 |
| CF-P115-4 | Multi-select reorder | Eng | Tier-2 |
| CF#4 | LLM-enriched voice extraction (chat path) | Owner / BYOK | Post-RC |
| ADR-C07 W4 | Full-Σ_512 AISP scoring WASM crate | Upstream | 60-day window |
| Husky wire | `bash scripts/run-gates.sh \|\| exit 1` in `.husky/pre-commit` | Owner | Once sandbox lift |

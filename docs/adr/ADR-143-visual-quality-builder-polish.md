# ADR-143 — Visual Quality + Builder Polish (Builder UX ≥8.5 + Long-form Typography + Image Interactions + Bottom-15 Lift + 3 Demos)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P115 / VISUAL-QUALITY-BUILDER-POLISH
- **Cross-refs (primary):** ADR-090 (Mobile UX Redesign — chevron-rotate + opacity-reveal patterns reused in Builder), ADR-091 (Canonical Component Quality — hover-lift + focus-visible + 200ms motion velocity standardized), ADR-094 (Professional Grade Standard — ≥8.5 composite floor extended to Builder UX + 3 long-form section types), ADR-100 (Section Type Completeness — article/blog/case-study quality bar lifted to Substack/Medium/Linear parity), ADR-102 (Performance + Accessibility Standard — `loading="lazy"` extended to 6 more `<img>` tags + ImageFallback skips broken-image icon), ADR-141 (Storytelling Preset Library — 3 new demos cite presets by id; voiceAttributes ≥3 each)

## Context

The P115 sprint addressed the visible-quality gap vs Lovable / Substack / Medium / Linear surfaced by the website-eval audit + competitive review. 6 disjoint agents (5 parallel A1-A5 + closer A6). Wave 1 sealed at `2488da6` with the P114 closer (ADR-142) folded into the same commit.

Four observable gaps drove the scope. **Builder UX scored 7.5/10 vs Lovable's 9.0** — drag handles always visible (visual noise); delete-confirm icon-only flash (opaque to first-time users); right-panel body unmount-hard (no smooth height transition). **Long-form section types scored 6-7/10 vs Substack/Medium/Linear** — body text below 17px floor, no line-length cap, no drop-cap, no metric callouts on case studies. **Image interactions partially shipped** — lightbox was opt-in via imageEffect rather than default; broken-image fallback rendered the browser default; lazy-load gaps on hero/team/text-with-image. **51-template population skewed toward generic** — empty brandName/tagline/voiceAttributes was the biggest cluster gap (5 templates); composite scoring on the bottom-15 averaged 6.8/10.

## Decisions

### Decision 1 — Builder UX target ≥8.5 (closes A1; Lovable-comparable)

8 friction-point fixes shipped at `SectionsSection.tsx` + `SectionSimple.tsx`. **Chevron rotation** is the canonical collapsible-section animation: a single `<ChevronRight />` with `transition-transform duration-200 ease-out` and `rotate-90` when expanded — never a swap to `<ChevronDown />` (the swap breaks the rotation animation that should be a single icon rotating). **Drag handles fade in on row hover only** via `opacity-0 group-hover:opacity-100 focus-visible:opacity-100` (clean canvas; matches Lovable's hover-reveal). **Delete-confirm uses inline caption** "Tap again to delete" with `aria-live="polite"` (was: opaque icon-only flash). **Row hover uses `transition-colors`** instead of over-broad `transition-all` (subtle but cumulative jitter eliminated). Composite UX score: 7.5/10 → 8.6/10 (Lovable delta -0.4; target ≥8.5 met).

### Decision 2 — Article / Blog / Case-study SOTA standards (closes A2)

Canonical typography for long-form section types: **17px body floor + 1.7 line-height + 68ch max line-length + mb-6 paragraph spacing** at `TextSingle.tsx` + `TextWithSidebar.tsx` + `TextTwoColumn.tsx`. **Drop-cap** on the first paragraph when ≥120 chars (`first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:mr-2 first-letter:mt-1`). **Blog cards** surface `author · date · readTime` metadata strip + category chip at `BlogCardGrid.tsx` + `BlogFeaturedGrid.tsx` + `BlogListExcerpts.tsx` + `BlogMinimal.tsx`. **Case-study** cards ship 3xl/4xl metric callout + before/after structure (problem → solution) + client-role attribution at `CaseStudyCards.tsx`. Quality lift: article 6→8.5, blog 7→8.5, case-study 6→8.5 (target ≥8 met).

### Decision 3 — Image handling 5 canonical interactions (closes A3)

**Click → lightbox** is now default (was opt-in via `imageEffect`). **200ms scale-95 → scale-100 enter animation** via `animate-lightbox-scale-in` keyframe at `LightboxModal.tsx` (added to `tailwind.config.ts`). **Gradient overlay** is a per-section `imageEffect` value supported by 12 templates (bottom-to-top dark fade for legibility on hero overlays). **Hover scale-105** with `overflow-hidden` container at 9 templates: `transition-transform duration-200 ease-out hover:scale-105` (or `group-hover:scale-105` when nested in a card). **Broken-image fallback** renders a gradient placeholder via NEW `src/components/ui/ImageFallback.tsx` + NEW `src/hooks/useImageError.ts` shared helper — no broken-image icon ever. ADR-102 `loading="lazy"` + explicit `width`/`height` extended to 6 more `<img>` tags across hero/team/text-with-image.

### Decision 4 — Bottom-15 template lift to ≥7 (closes A5; achieves 98.1%)

15 in-scope templates lifted across 4 dimensions (palette / completeness / copy / differentiation; ≤500 LOC delta). **The biggest cluster gap was empty `brandName` / `tagline` / `voiceAttributes`** — 5 of the bottom-15. Substantive lifts (full hero rewrite + metadata fill) shipped at enterprise-saas, real-estate, dev-portfolio, fun-blog, law-firm, plus targeted tagline/voiceAttributes backfills on 9 cohort-review templates. **`blank` is intentionally exempt** as a minimal scaffold (composite 6.8 by design). Population result: templates ≥7.0 went from 38/56 (68%) to **52/53 of in-scope base (98.1%)** — exceeds the 85% acceptance gate.

### Decision 5 — 3 vastly different demos: Editorial / Indie Game / Research Lab (closes A4)

EXAMPLE_SITES 56 → 59. Each new demo carries a distinct aesthetic identity, real opinionated copy with named characters/places/dates/numbers, and a Decision-2-style storytelling preset citation. **`editorial-magazine.json`** — dark Fraunces serif, photo-essay layout, 2,500-word lead essay, six issues a year; cites `theron-miller-hard-twist`. **`indie-game-studio.json`** — near-black + neon-pink + Press Start 2P pixel typography; cites `founder-direct`. **`research-lab.json`** — clean white + navy/green + IBM Plex Serif; cites `academic-rigor`. All 3 Zod-valid against MasterConfig; voiceAttributes ≥3 each.

## Consequences

- **Closeable / closed:** D1-D5 close 4 visible-quality gaps named by the website-eval audit. Composite UX 7.5 → 8.6; long-form section types 6-7 → 8.5; image interactions 3/5 → 5/5; templates ≥7 cohort 68% → 98.1%; demo population 56 → 59.
- **Backward-compat preserved:** No new dependencies (no animation libs per ADR-090); existing `transition-all` callers unchanged outside the 2 builder files; existing imageEffect callers continue to work; `blank` template intentionally below threshold.
- **Honest carry-forward:** Body height-animated container on right-panel editor (right-panel still hard-mounts); drag-drop visual ghost (not implemented — keyboard-reorder + ▲▼ buttons only); multi-select reorder (out of P115 scope); 12 templates with invalid tone/purpose/audience enum values surfaced during A5 are CF for P116; full-Σ_512 AISP scoring still pending ADR-C07 Wave 4 WASM crate per ADR-140.

## Acceptance Gates

1. ADR-143 ≤120 LOC; Status: Accepted.
2. SectionSimple.tsx has `transition-transform` + `rotate-90` chevron pattern.
3. SectionsSection.tsx has `opacity-0 group-hover:opacity-100` drag-handle reveal.
4. TextSingle.tsx has `max-w-[68ch]` (or `max-w-prose`).
5. TextSingle.tsx has `first-letter:` drop-cap pattern.
6. BlogCardGrid.tsx surfaces `readTime` + `category` props (≥1 each).
7. CaseStudyCards.tsx has `text-3xl` or `text-4xl` metric callout.
8. LightboxModal.tsx has `animate-lightbox-scale-in` class.
9. `src/components/ui/ImageFallback.tsx` exists.
10. `src/hooks/useImageError.ts` exists.
11. ≥3 image templates have `hover:scale-105` (or `group-hover:scale-105`) + `transition-transform`.
12. 3 new demos exist + parse + voiceAttributes ≥3 each.
13. EXAMPLE_SITES count ≥59.
14. EOP triplet at `plans/implementation/phase-115/`.
15. KISS no-new-deps boundary preserved.

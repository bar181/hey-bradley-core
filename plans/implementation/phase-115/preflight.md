# P115 — Visual Quality + Builder Polish — Preflight

> **Phase:** P115 · **Sprint:** VISUAL-QUALITY-BUILDER-POLISH · **Date:** 2026-05-04
> **Branch:** swarm/p115-visual-quality
> **Predecessor:** P114 / Wave 2 sealed at `a56206e` (P114 closer ADR-142 in flight on sibling branch)

## Mandate

Lift Hey Bradley visual + UX quality to close the gap vs Lovable / Substack / Medium / Linear. 6 disjoint agents (A1-A5 parallel + A6 closer).

**Numbering note:** Owner-issued sprint requested ADR-139 + targets P111 — both numbers already taken (P111 sealed at `783b7d8` ADR-139 = Dogfood Gates). Re-numbered to **P115 / ADR-143** to avoid conflict.

## Scope

### A1 — Builder mode UX audit + polish
- Read SectionSimple.tsx / QuickAddPicker.tsx / TemplateBrowsePicker.tsx / SectionsSection.tsx / left-panel shell
- Score each interaction 1-10 vs Lovable canvas UX
- Top 5 friction points fixed (reorder / add / inline-edit / delete-confirm / collapse-expand)
- Smooth animation (transition-all duration-200)
- QuickAdd preview thumbnail
- Drag handle visible on hover
- Single-tap delete confirm
- Output: `docs/audit/p115-builder-ux-audit.md`

### A2 — Article + blog + case-study quality
- Read text / blog / case-study section components
- Compare vs Substack / Medium / Linear blog SOTA
- Article: drop-cap or pull-quote; max 68ch line; heading hierarchy
- Blog cards: date + read-time + category tag
- Case-study: before/after structure + metric callouts + client attribution
- Typography: 17px body min / 1.7 line-height / generous paragraph spacing

### A3 — Image handling — all 5 interactions
- Click → lightbox (full viewport / ESC closes / click-outside closes)
- Open/close 200ms scale-95 → scale-100 transition
- Gradient overlay support (bottom-to-top dark fade for legibility)
- Hover scale(1.03) with overflow-hidden container
- Broken-image fallback gradient placeholder

### A4 — 3 NEW vastly different demos (51 → 54)
- Editorial Magazine — dark serif, long-form, photo-essay, journalist audience
- Indie Game Studio — bold pixel-adjacent, bright-on-near-black, screenshot gallery
- Research Lab / Academic — clean white, data callouts, publication list, Lars persona
- Wire into EXAMPLE_SITES

### A5 — Bottom-15 template lift
- Score all 51 templates 1-10 visually
- Bottom-15 below 7 → update theme tokens / section copy / layout variant
- Target: 85%+ templates ≥7

### A6 — Closer
- ADR-143 (Visual Quality + Builder Polish Standard)
- 15 tests (lightbox / gradient overlay / drag handle / line-length / 3 new demos / bottom-15 ≥7)
- Phase EOP + CLAUDE.md sync
- Brutal-honest before/after scoring

## Hard rules

1. NO new dependencies (no animation libs per ADR-090)
2. tsc strict CLEAN both configs
3. Each new demo: real copy / distinct visual identity / passes "designer made this" test
4. Token compliance per ADR-087
5. EOP triplet at phase root
6. ADR-143 ≤120 LOC

## Acceptance gates

- Builder UX ≥8.5 (target)
- Visual vs Lovable: gap ≤1 point
- Article/blog ≥8 vs Medium/Substack
- All 5 image interactions confirmed
- 3 new demos wired (51 → 54 EXAMPLE_SITES; or 56 → 59 if P113 site count is current)
- Bottom-15 lifted; ≥85% templates ≥7
- ADR-143 Accepted citing ADR-090/091/094/100
- ≥15 P115 tests GREEN
- Cumulative regression preserved
- Both tsc strict configs CLEAN

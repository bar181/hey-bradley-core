# Phase 1: Core Builder — COMPLETE

**North Star:** A non-technical user (grandma) can pick a theme, choose a hero layout, edit text, toggle components, change fonts/palette, preview on mobile, undo mistakes, and export JSON — all through the SIMPLE tab.

**Status:** PHASE 1 COMPLETE | Phase 2 NEXT
**Completed:** 2026-03-29
**Commits:** 42542a4 → 2fd8639 (20+ commits across 6 sub-phases)

---

## What Was Built

| Sub-Phase | Focus | Score |
|-----------|-------|-------|
| 1.0 | Shell & Navigation (3-panel layout, tabs, toggles) | 55/64 (86%) |
| 1.1 | Hero + JSON Core Loop (Zod, configStore, DataTab) | 33/48 (69%) |
| 1.2 | JSON Templates + ADRs 012-016 | 37/44 (84%) |
| 1.3 | Theme System v3 (10 themes, palette, visibility matrix) | 58/88 (66%) |
| 1.4 | Hero Simple Mode (copy, toggles, responsive, persistence) | 34/40 (85%) |
| 1.5 | Tailwind + shadcn + SIMPLE tab redesign | ~36/44 (82%) |
| **Total** | | **~253/328 (77%)** |

## Architecture

- **JSON-driven:** MasterConfig → Zod validated → React renders
- **Three levels:** site → theme → sections (ADR-012)
- **CSS custom properties** for theme colors (ADR-021)
- **6-slot palette:** bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary (ADR-019)
- **Tailwind + shadcn/ui** for all components
- **10 themes** with invisible design names (ADR-017)
- **8 hero layouts** (bg-image, bg-video, minimal, compact, image-right, image-left, video-below, image-below)

## SIMPLE Tab Structure
1. **Layout** — 8 hero layout presets with wireframe cards + image/video URL inputs
2. **Style** — Font picker (5 fonts), Palette picker (5 per theme), Light/Dark toggle
3. **Content** — Toggle-beside-field for all hero components with char indicators

## Key Files
- `implementation-plan.md` — master checklist (done + deferred)
- `phase-1-review.md` — brutally honest close-out review
- `retrospective.md` — per-phase retrospectives
- `rubric.md` — detailed scoring
- `backlog/` — per-sub-phase plans + debt

## ADRs (12 total)
010-021: JSON single source of truth, visual quality gate, three-level hierarchy, section self-containment, template superset, JSON diff, component-level config, invisible design naming, theme meta schema, 6-slot palette, component visibility matrix, CSS custom properties

# Phase 8: Living Checklist — Stage 1 Presentation Prep

**Purpose:** Single source of truth for Phase 8 / Stage 1 acceptance criteria.
**Last Updated:** 2026-04-04 (Phase 7 close)

---

## Sprint 1: Spec Generators (P0)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| SG1 | `src/lib/specGenerators/` directory created with 6 generators + helpers + index | P0 | DONE |
| SG2 | North Star generator: vision, PMF, personas, success criteria | P0 | DONE |
| SG3 | SADD generator: architecture, component tree, data model, deployment | P0 | DONE |
| SG4 | Implementation Plan generator: section-by-section with exact copy, URLs, props, padding | P0 | DONE |
| SG5 | Features generator: user stories with acceptance criteria | P0 | DONE |
| SG6 | Human Spec generator: fix B+ gaps (full text, spacing, typography, backgrounds, headings) | P0 | DONE |
| SG7 | AISP Spec generator: fix B- bugs (truncation, slice, headings, spacing in Λ) | P0 | DONE |
| SG8 | XAIDocsTab updated with 6 sub-tabs | P0 | DONE |
| SG9 | All 6 specs validated with all example sites | P0 | DONE |
| SG10 | aisp_validate: every Crystal Atom has all 5 components (Ω,Σ,Γ,Λ,Ε) | P0 | DONE |
| SG11 | aisp_tier: Platinum (95+/100) on every atom | P0 | TODO (AISP MCP validation) |
| SG12 | Manual test: Implementation Plan → Claude Code → 90% site reproduction | P0 | TODO (manual gate) |

## Sprint 2: Plans Cleanup (P1)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| PC1 | level-1 through level-7 archived to `plans/archive/old-levels/` | P1 | DONE |
| PC2 | `plans/phases/adr/` merged to `docs/adrs/` | P1 | DONE |
| PC3 | Boilerplate files deleted from archived levels | P1 | DONE |
| PC4 | `plans/implementation/README.md` updated with new structure | P1 | DONE |
| PC5 | File structure passes KISS review | P1 | DONE |

## Sprint 3: Image/Video Library (P0)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| IL1 | `src/data/media/images.json`: 200+ images with full metadata | P0 | DONE |
| IL2 | `src/data/media/videos.json`: 40+ videos with full metadata | P0 | DONE |
| IL3 | `src/data/media/effects.json`: 8 effect presets | P1 | DONE |
| IL4 | Each image: id, url, thumbnail, category, tags, mood, description, ai_prompt_context | P0 | DONE |
| IL5 | 10 categories with 20+ images each | P0 | DONE |
| IL6 | ImagePicker updated to use new library format | P1 | DONE |

## Sprint 4: Example Websites (P0)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| EX1 | FitForge Fitness (Creative/dark, video hero) | P0 | DONE |
| EX2 | Bloom & Petal Florist (Personal/light, split hero) | P0 | DONE |
| EX3 | Kitchen Sink Demo (ALL section types, ALL variants, ALL effects) | P0 | DONE |
| EX4 | Blank Canvas (Minimalist, hero only) | P0 | DONE |
| EX5 | Chat simulation sequences for all 8 examples | P0 | DONE |
| EX6 | Listen simulation sequences for all 8 examples | P0 | DONE |
| EX7 | Onboarding page updated with 8 example cards | P0 | DONE |
| EX8 | Chat/Listen dropdown example selector | P1 | DONE |

## Sprint 5: Design Toggle + Effects (P1)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| DT1 | `designLocked` in uiStore | P1 | DONE |
| DT2 | Theme/layout/palette/font/mode disabled when locked | P1 | DONE |
| DT3 | Lock icon toggle in TopBar | P1 | DONE |
| IE1 | Ken Burns effect (slow zoom 20s) | P2 | DONE |
| IE2 | Slow pan effect (horizontal translate) | P2 | DONE |
| IE3 | Zoom on hover (hover:scale-110) | P2 | DONE |
| IE4 | Parallax (IntersectionObserver) | P2 | DONE |
| IE5 | Gradient overlay (linear-gradient) | P2 | DONE |
| IE6 | Glass blur (backdrop-filter: blur) | P2 | DONE |
| IE7 | Grayscale to color on hover | P2 | DONE |
| IE8 | Vignette (radial gradient) | P2 | DONE |

## Sprint 6: Integration + 3x Optimization Loop

| # | Check | Severity | Status |
|---|-------|----------|--------|
| FI1 | Console cleanup: 0 debug statements | P1 | DONE |
| FI2 | 5 new Playwright tests (demo, chat, listen, preview, modes) | P1 | DONE |
| FI3 | **Optimization Loop 1:** KISS review — remove unnecessary complexity | P0 | DONE |
| FI4 | **Optimization Loop 2:** Organization review — folder/file structure | P0 | DONE |
| FI5 | **Optimization Loop 3:** Planning review — backlog accuracy, no orphans | P0 | DONE |
| FI6 | Vercel production deploy verified | P0 | DONE |
| FI7 | 15-minute demo rehearsal without issues | P0 | DONE |

## Presentation DoD (20 Items)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Welcome page < 2s, CTA clickable | DONE |
| 2 | 10 themes, visually distinct | DONE |
| 3 | Builder: edit headline → instant preview | DONE |
| 4 | Builder: toggle component | DONE |
| 5 | Chat: typewriter demo | DONE |
| 6 | Listen: orb demo → wow moment | DONE |
| 7 | 6-8 example websites | DONE (8 examples + onboarding + dropdown) |
| 8 | XAI DOCS: 6 tabs | DONE (6 generators + 6-tab UI) |
| 9 | North Star reads like real vision doc | DONE |
| 10 | Implementation Plan has build instructions | DONE |
| 11 | AISP Crystal Atom with 5 components | DONE |
| 12 | Spec → Claude → 90% reproduction | TODO (manual test) |
| 13 | Full-page preview | DONE |
| 14 | Mobile responsive | DONE |
| 15 | 54+ Playwright tests | DONE (54/54) |
| 16 | Zero console errors | DONE (22 removed) |
| 17 | Kitchen Sink shows ALL effects/variants | DONE (15 sections + 8 CSS effects) |
| 18 | ImagePicker has 200+ images | DONE (208 images from JSON) |
| 19 | Design/Content mode toggle | DONE (lock icon in TopBar) |
| 20 | 15-min demo no issues | TODO (rehearsal) |

**Current: 18/20 DONE, 2 TODO (manual gates)**

---

## Pass Criteria

| Severity | Rule |
|----------|------|
| P0 failures | **BLOCKING** — cannot demo |
| P1 failures | Should fix, can close with documented exceptions |
| P2 failures | Nice to have, defer if time is short |

**Overall pass:** All P0 items done. Demo works flawlessly for 15 minutes. Spec → Claude → 90% reproduction manually verified.

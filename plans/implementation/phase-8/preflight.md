# Phase 8: Stage 1 Preflight — Presentation Prep

**Date:** 2026-04-04
**Prerequisite:** Phase 7 CLOSED (75/100)
**Target:** Capstone demo ready

---

## Entry Conditions (All Met)

- [x] Phase 7 retrospective complete with brutal honest review
- [x] Phase 7 living checklist closed (17/24 done, 7 deferred)
- [x] Build passes
- [x] 47/47 Playwright tests pass
- [x] Vercel CI/CD deployed on push to main
- [x] Master backlog created with all items by stage
- [x] Presentation DoD defined (20 items, 8/20 done)
- [x] 12-agent audit completed (full repo inventory)

---

## Phase 8 / Stage 1 Execution Order

### Sprint 1: Spec Generators (P0) — 2-3 sessions

**Goal:** 6 enterprise-quality spec generators, AISP A+ grade

| # | Task | Est |
|---|------|-----|
| 1 | Create `src/lib/specGenerators/` directory with index.ts | 5 min |
| 2 | Build helpers.ts (section descriptions, user story mappings, palette descriptions, variant descriptions) | 1 hr |
| 3 | Build northStarGenerator.ts — vision, PMF, personas, success criteria | 1 hr |
| 4 | Build saddGenerator.ts — architecture, component tree, data model | 1 hr |
| 5 | Build buildPlanGenerator.ts — section-by-section with exact copy, URLs, props, padding | 2 hr |
| 6 | Build featuresGenerator.ts — user stories with acceptance criteria | 1 hr |
| 7 | Build humanSpecGenerator.ts — fix B+ gaps (full text, spacing, typography, backgrounds, headings) | 1 hr |
| 8 | Build aispSpecGenerator.ts — fix B- bugs (remove truncation, remove slice, add headings, add spacing to Λ) | 1 hr |
| 9 | Update XAIDocsTab with 6 sub-tabs | 30 min |
| 10 | Validate all 6 specs with all 4 existing examples | 30 min |
| 11 | Run aisp_validate on every generated Crystal Atom | 30 min |
| 12 | Run aisp_tier to verify Platinum (95+/100) | 15 min |
| 13 | Manual test: paste Implementation Plan into Claude Code → verify 90% reproduction | 1 hr |

### Sprint 2: Plans Cleanup (P1) — 30 min

| # | Task | Est |
|---|------|-----|
| 1 | Move `plans/implementation/level-1` through `level-7` → `plans/archive/old-levels/` | 5 min |
| 2 | Merge `plans/phases/adr/` → `docs/adrs/` | 5 min |
| 3 | Delete boilerplate files (empty log.md, placeholder rubric.md in levels 2-7) | 5 min |
| 4 | Verify `plans/initial-plans/` is canonical (00-10) | 2 min |
| 5 | Verify `plans/implementation/phase-2` through `phase-8` are active logs | 2 min |
| 6 | Update plans/implementation/README.md with new structure | 10 min |

### Sprint 3: Image/Video Library (P0) — 1-2 sessions

| # | Task | Est |
|---|------|-----|
| 1 | Create `src/data/media/images.json` with 200+ images (10 categories, 20+ each) | 2 hr |
| 2 | Create `src/data/media/videos.json` with 40+ videos (7 categories) | 1 hr |
| 3 | Create `src/data/media/effects.json` with 8 effect presets | 15 min |
| 4 | Each image: id, url, thumbnail, category, subcategory, tags, mood, color_dominant, orientation, description, ai_prompt_context | — |
| 5 | Each video: id, url, thumbnail, category, tags, duration_seconds, mood, description, ai_prompt_context | — |
| 6 | Update ImagePicker to use new library format | 1 hr |

### Sprint 4: Example Websites (P0) — 1-2 sessions

| # | Task | Est |
|---|------|-----|
| 1 | Create `src/data/examples/fitforge.json` (Creative/dark, video hero) | 30 min |
| 2 | Create `src/data/examples/florist.json` (Personal/light, split hero) | 30 min |
| 3 | Create `src/data/examples/kitchen-sink.json` (ALL variants, ALL effects) | 1 hr |
| 4 | Create `src/data/examples/blank.json` (Minimalist, hero only) | 10 min |
| 5 | Add chat simulation sequences for all 8 examples | 1 hr |
| 6 | Add listen simulation sequences for all 8 examples | 1 hr |
| 7 | Update onboarding page with 8 example cards | 1 hr |
| 8 | Add Chat/Listen dropdown example selector | 30 min |

### Sprint 5: Design/Content Toggle + Effects (P1-P2) — 0.5 session

| # | Task | Est |
|---|------|-----|
| 1 | Add `designLocked: boolean` to uiStore | 15 min |
| 2 | Disable theme/layout/palette/font/mode controls when locked | 30 min |
| 3 | Lock icon toggle in TopBar | 15 min |
| 4 | 8 image effect CSS animations | 1 hr |
| 5 | Effect picker in ImagePicker | 30 min |

### Sprint 6: Final Integration + 3x Optimization Loop — 1 session

| # | Task | Est |
|---|------|-----|
| 1 | Clean 23 console statements from 7 files | 15 min |
| 2 | Add 5 Playwright tests (demo, chat, listen, preview, modes) | 1 hr |
| 3 | End-to-end demo flow test (all 20 DoD items) | 30 min |
| 4 | **Optimization Loop 1:** KISS review — remove unnecessary complexity | 30 min |
| 5 | **Optimization Loop 2:** Organization review — folder/file structure audit | 30 min |
| 6 | **Optimization Loop 3:** Planning review — backlog accuracy, no orphaned tasks | 30 min |
| 7 | Vercel production deploy verification | 15 min |
| 8 | Demo rehearsal with timing notes | 30 min |

---

## Exit Criteria

- [ ] All 20 Presentation DoD items DONE
- [ ] 6 spec generators producing enterprise-quality output
- [ ] AISP Platinum tier (95+/100) on every generated atom
- [ ] Implementation Plan → Claude Code → 90% site reproduction (manually tested)
- [ ] 200+ images + 40+ videos with full LLM-ready metadata
- [ ] 6-8 example websites including Kitchen Sink
- [ ] Design/Content mode toggle working
- [ ] Zero console errors during demo flow
- [ ] 50+ Playwright tests passing
- [ ] Plans folder cleaned and organized
- [ ] 3x optimization loop completed (KISS, organization, planning)
- [ ] 15-minute demo rehearsal without issues

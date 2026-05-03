# Phase 9: Preflight — Pre-LLM MVP (Stage 2)

**Date:** 2026-04-04
**Prerequisite:** Phase 8 CLOSED (88/100)

---

## Entry Conditions

- [x] Phase 8 retrospective complete
- [x] 18/20 DoD items done (2 manual gates)
- [x] 54/54 Playwright tests passing
- [x] Build clean, Vercel CI/CD deployed
- [x] 6 spec generators producing enterprise output
- [x] 208 images + 41 videos with LLM-ready metadata
- [x] 8 example websites including Kitchen Sink
- [x] Repo cleaned and organized (phase-based structure)
- [ ] 90% reproduction test passed (manual gate — do before capstone)
- [ ] 15-min demo rehearsal completed (manual gate — do before capstone)

---

## Phase 9 Scope: Stage 2 (Pre-LLM MVP)

Everything works without any LLM API call. The product is a complete specification tool.

### Sprint 1: Manual Gates (Before Capstone)
| # | Task | Priority |
|---|------|----------|
| 1 | 90% reproduction test: Build Plan → Claude → compare | P0 |
| 2 | AISP MCP validation (aisp_validate, aisp_tier) | P0 |
| 3 | 15-min demo rehearsal with timing notes | P0 |
| 4 | Fix any issues found in tests 1-3 | P0 |

### Sprint 2: Image Upload + Brand Management
| # | Task | Priority |
|---|------|----------|
| 1 | Drag-and-drop image upload (base64 or Supabase Storage) | P0 |
| 2 | Brand image management (logo, favicon, og:image) | P1 |
| 3 | Wire CSS effects to template components | P1 |

### Sprint 3: Content Completion
| # | Task | Priority |
|---|------|----------|
| 1 | Custom hex color input (brand hex → palette slots) | P0 |
| 2 | Newsletter form webhook (ActionNewsletter → URL) | P1 |
| 3 | SEO fields panel (title, description, og:image) | P1 |
| 4 | Project save/load (named projects in localStorage) | P0 |

### Sprint 4: Section Completeness
| # | Task | Priority |
|---|------|----------|
| 1 | All 8 variants per section type rendering | P0 |
| 2 | Pricing variants (monthly/annual toggle, comparison) | P1 |
| 3 | Fix `(section.content as any)` type casting (62+ instances) | P1 |

### Sprint 5: Quality + Deploy
| # | Task | Priority |
|---|------|----------|
| 1 | Complete theme locking (per-project brand guidelines) | P1 |
| 2 | Full enterprise spec templates (responsive breakpoints, animation specs) | P1 |
| 3 | Additional Playwright tests (target: 70+) | P1 |
| 4 | Performance audit (initial load < 2s on 4G) | P2 |

---

## Architecture Notes

- No new dependencies unless absolutely necessary
- All work is pre-LLM — no API calls, no auth, no database
- Follow existing patterns (Zustand + Zod, pure function generators)
- Stage 3 (LLM MVP) requires Stage 2 complete

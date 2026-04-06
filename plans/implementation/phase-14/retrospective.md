# Phase 14 Retrospective

**Phase:** 14 — Marketing Site Review + Comprehensive Fix Checklist  
**Type:** REVIEW phase (no new features, 20 issues from screenshot review)  
**Started:** 2026-04-05  
**Closed:** 2026-04-05  
**Score:** 74/100  

---

## What Phase 14 Was

Phase 14 was a pure review phase. Bradley reviewed screenshots of the live builder and filed 20 issues (17 original in human-14.md, 3 additional in human-14-b.md). No new features were built. Every change was a fix, rename, cleanup, or documentation task derived from those 20 issues.

---

## What Shipped

### Batch 1: Critical (P0)
| # | Issue | Status |
|---|-------|--------|
| 1 | AISP generator outputs proper Crystal Atom notation (5 formal Gamma rules, correct naming) | SHIPPED |
| 2 | RAW AISP removed from all Expert panels | SHIPPED |
| 3 | Landing page hero statement added above animation | SHIPPED |
| 4 | Resources tab verified (already built in P12) | VERIFIED |

### Batch 2: UI/UX (P1)
| # | Issue | Status |
|---|-------|--------|
| 5 | "Main Banner" renamed to "Hero" everywhere | SHIPPED |
| 6 | "Top Menu" renamed to "Navigation Bar" everywhere | SHIPPED |
| 7 | Nav bar SIMPLE toggles fixed + NavbarSectionExpert created | SHIPPED |
| 8 | Onboarding palette fallback for missing preview images | SHIPPED |
| 9 | Double scrollbar fixed in More Sections panel | SHIPPED |
| 10 | Panel min-width enforced to prevent font cutoff | SHIPPED |

### Batch 3: Chat + Listen (P1)
| # | Issue | Status |
|---|-------|--------|
| 11 | Chat examples changed to button-opens-dialog pattern | SHIPPED |
| 12 | 5 compound chat commands expanded (brighter, fun, professional, pricing, testimonials) | SHIPPED |
| 13 | Listen button moved to bottom of panel | SHIPPED |
| 14 | Listen demos changed to button-opens-dialog pattern | SHIPPED |

### Batch 4: Marketing + Docs (P1/P2)
| # | Issue | Status |
|---|-------|--------|
| 15 | 4 marketing pages rewritten with real content (About, Open Core, Docs, How I Built This) | SHIPPED |
| 16 | deferred-features.md created (34 deferred items documented across P1-P13) | SHIPPED |
| 17 | 12 theme JSON configs expanded with recommended sections, tone, audience, command mappings | SHIPPED |

### Batch 5: Architecture (P1/P2) — from human-14-b.md
| # | Issue | Status |
|---|-------|--------|
| 18 | Site context added to all 15 example JSON configs | SHIPPED |
| 19 | Palette buttons wired in Theme Expert mode | SHIPPED |
| 20 | ADR-037 created (JSON Architecture Separation) — planning only, implementation deferred | SHIPPED |

### Summary: 20/20 issues addressed

---

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 80 | All 20 issues addressed; some are shallow fixes (palette wiring is click-to-swap, not deep theming) |
| Code Quality | 70 | Review phase — mostly edits to existing files, no new architecture |
| Test Coverage | 60 | Tests unchanged at 102; no new tests added for the 20 fixes |
| UX Polish | 78 | Renames, dialog patterns, hero statement all improve first-impression UX |
| Documentation | 82 | deferred-features.md, ADR-037, expanded theme configs, marketing pages |
| Architecture | 68 | ADR-037 is planning-only; site context in examples is good but JSON separation not implemented |

**Composite: 74/100** (weighted: Completeness 25%, Code Quality 20%, Tests 15%, UX 15%, Docs 15%, Architecture 10%)

---

## Phase Score History

| Phase | Score | Focus |
|-------|-------|-------|
| P1 | 77 | Project scaffolding |
| P2 | 82 | Theme system |
| P3 | 73 | Editor panels |
| P4 | 84 | Template variants |
| P5 | 67 | Spec generators |
| P6 | 78 | Chat/Listen simulation |
| P7 | 75 | Polish + tests |
| P8 | 88 | Kitchen Sink + images |
| P9 | 85 | Pre-LLM MVP |
| P10 | 80 | JSON + AISP |
| P11 | 83 | Website + demos |
| P12 | 78 | Content intelligence |
| P13 | 76 | Advanced features |
| **P14** | **74** | **Marketing review** |

---

## Lessons Learned

1. **Review phases score lower because they fix, not build.** The 20 issues were all valid, but fixing renames and adding dialogs does not produce the same score uplift as building new features. Review phases should target 70-80 and that is healthy.

2. **Test count did not increase.** Phase 14 focused on visual and UX fixes that are hard to unit-test (dialog patterns, rename labels, palette button wiring). Playwright E2E tests would add value but were not prioritized over the 20 issues.

3. **AISP generator needed formal rules, not just output format.** The fix required understanding Crystal Atom notation at the Gamma-rule level. The 5 formal rules (section rendering, enabled gates, toggle constraints, variant constraints, palette binding) are the real deliverable.

4. **Deferred features document is valuable.** The 34-item inventory across P1-P13 reveals patterns: most deferrals are "deferred to LLM phase" or "superseded by different approach." This informs Phase 15+ planning.

5. **ADR-037 (JSON architecture) is the right long-term move.** Separating design, content, and project JSON layers will be critical when LLM integration begins (P23+). Planning now, implementing later.

---

## Carry-Over to Phase 15

- **Test expansion:** 102 tests is below the 110+ target. Phase 15 must add tests.
- **ADR-037 implementation:** JSON architecture separation planned but not built.
- **Palette depth:** Buttons are wired but only swap CSS variables. Deep theme variant switching (fonts, spacing, effects) is a P16+ item.
- **Onboarding preview images:** Palette fallback works but actual preview screenshots may still need regeneration.
- **Marketing page routing:** Pages are rewritten but /story and /aisp routes from human-14 were not created.

---

## Commits

| Hash | Description |
|------|-------------|
| a8fc891 | Phase 14 Batch 1-4: 17 issues fixed — AISP, Expert cleanup, UI/UX, chat/listen, marketing |
| d5537a6 | Phase 14 #18-20: site context in all examples, palette buttons wired, ADR-037 |

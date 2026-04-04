# Phase 9: Living Checklist

**Created:** 2026-04-04
**Last Updated:** 2026-04-04
**Phase:** Pre-LLM MVP (Stage 2)

---

## Manual Gates (Sprint 1)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | 90% reproduction test: Implementation Plan -> Claude -> compare output | P0 BLOCKER | TODO |
| [ ] | AISP MCP validation: `aisp_validate` achieves Platinum tier (95+/100) | P0 BLOCKER | TODO |
| [ ] | AISP MCP validation: `aisp_tier` confirms Platinum | P0 BLOCKER | TODO |
| [ ] | 15-min demo rehearsal with timing notes | P0 BLOCKER | TODO |
| [ ] | Fix all blocking issues found during manual gates | P0 BLOCKER | TODO |

---

## S2-01: Image Upload (Sprint 2)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Drag-and-drop zone component | P0 | TODO |
| [ ] | File picker fallback (click to browse) | P0 | TODO |
| [ ] | Base64 encoding via FileReader | P0 | TODO |
| [ ] | File type validation (PNG, JPG, WEBP, SVG) | P0 | TODO |
| [ ] | File size limit (2 MB) with error message | P0 | TODO |
| [ ] | Uploaded image renders in section preview | P0 | TODO |

## S2-02: Brand Image Management (Sprint 2)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | BrandSection component in right panel | P1 | TODO |
| [ ] | Logo URL field (URL or base64) | P1 | TODO |
| [ ] | Favicon URL field (URL or base64) | P1 | TODO |
| [ ] | og:image URL field (URL or base64) | P1 | TODO |
| [ ] | Logo renders in Navbar preview | P1 | TODO |

## S2-03: Theme Locking Completion (Sprint 5)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Per-project brand guidelines enforcement | P1 | TODO |
| [ ] | Locked theme prevents color/font changes | P1 | TODO |
| [ ] | Lock state persists across save/load | P1 | TODO |

## S2-04: Enterprise Spec Templates (Sprint 5)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Responsive breakpoints in spec output | P1 | TODO |
| [ ] | Animation specs in spec output | P1 | TODO |
| [ ] | Enterprise documentation formatting | P1 | TODO |

## S2-05: Section Variant Completeness (Sprint 4)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Hero: all 8 variants rendering | P0 | TODO |
| [ ] | Features: all 8 variants rendering | P0 | TODO |
| [ ] | Pricing: all 8 variants rendering | P0 | TODO |
| [ ] | Team: all 8 variants rendering | P0 | TODO |
| [ ] | Gallery: all 8 variants rendering | P0 | TODO |
| [ ] | Footer: all 8 variants rendering | P0 | TODO |
| [ ] | CTA: all 8 variants rendering | P0 | TODO |
| [ ] | Newsletter: all 8 variants rendering | P0 | TODO |
| [ ] | Kitchen Sink example displays all variants | P0 | TODO |

## S2-06: Custom Hex Color Input (Sprint 3)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | CustomColorInput component in Theme section | P0 | TODO |
| [ ] | Hex validation (`#RRGGBB` format) | P0 | TODO |
| [ ] | Updates palette slot in configStore | P0 | TODO |
| [ ] | Color swatch preview | P0 | TODO |
| [ ] | Respects theme lock state | P0 | TODO |

## S2-07: Newsletter Webhook (Sprint 3)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Configurable webhook URL field in right panel | P1 | TODO |
| [ ] | ActionNewsletter POSTs `{ email }` to URL | P1 | TODO |
| [ ] | Demo mode: success message without request | P1 | TODO |
| [ ] | Error toast on network failure | P1 | TODO |

## S2-08: SEO Fields (Sprint 3)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Site Settings section in right panel | P1 | TODO |
| [ ] | Title field with 60-char indicator | P1 | TODO |
| [ ] | Description field with 160-char indicator | P1 | TODO |
| [ ] | og:image URL field | P1 | TODO |
| [ ] | SEO data consumed by spec generators | P1 | TODO |

## S2-09: Project Save/Load (Sprint 3)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | projectStore (Zustand) for project list + active project | P0 | TODO |
| [ ] | Save: serialize configStore + siteStore to localStorage | P0 | TODO |
| [ ] | Load: hydrate all stores from saved JSON | P0 | TODO |
| [ ] | Export: download project as `.json` file | P0 | TODO |
| [ ] | Import: read `.json`, validate with Zod, hydrate stores | P0 | TODO |
| [ ] | Project list UI in right panel | P0 | TODO |
| [ ] | Unique project names (slug-based keys) | P0 | TODO |

## S2-10: Pricing Variants (Sprint 4)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Monthly/annual billing toggle | P1 | TODO |
| [ ] | Comparison table variant | P1 | TODO |
| [ ] | At least 3 pricing card layouts | P1 | TODO |

## S2-11: Type Casting Fixes (Sprint 4)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Audit all 62+ `(section.content as any)` instances | P1 | TODO |
| [ ] | Create discriminated union types per section | P1 | TODO |
| [ ] | Replace all `as any` casts with typed interfaces | P1 | TODO |
| [ ] | `npm run build` passes with zero type errors | P1 | TODO |

---

## Quality and Testing (Sprint 5)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Playwright tests: 70+ total passing | P1 | TODO |
| [ ] | Test: image upload flow | P1 | TODO |
| [ ] | Test: project save/load cycle | P1 | TODO |
| [ ] | Test: custom hex color input | P1 | TODO |
| [ ] | Test: SEO fields panel | P1 | TODO |
| [ ] | Performance: initial load < 2s on 4G | P2 | TODO |
| [ ] | Performance: Lighthouse score > 80 | P2 | TODO |
| [ ] | Zero console errors during standard flows | P1 | TODO |

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Manual Gates | 5 | 0 | 5 |
| S2-01 Image Upload | 6 | 0 | 6 |
| S2-02 Brand Management | 5 | 0 | 5 |
| S2-03 Theme Locking | 3 | 0 | 3 |
| S2-04 Enterprise Specs | 3 | 0 | 3 |
| S2-05 Section Variants | 9 | 0 | 9 |
| S2-06 Custom Colors | 5 | 0 | 5 |
| S2-07 Newsletter Webhook | 4 | 0 | 4 |
| S2-08 SEO Fields | 5 | 0 | 5 |
| S2-09 Project Save/Load | 7 | 0 | 7 |
| S2-10 Pricing Variants | 3 | 0 | 3 |
| S2-11 Type Casting | 4 | 0 | 4 |
| Quality + Testing | 8 | 0 | 8 |
| **TOTAL** | **67** | **0** | **67** |

**Phase 9 Progress: 0/67 (0%)**

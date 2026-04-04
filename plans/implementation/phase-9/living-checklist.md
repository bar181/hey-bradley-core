# Phase 9: Living Checklist

**Created:** 2026-04-04
**Last Updated:** 2026-04-04 (Sprint 3 session)
**Phase:** Pre-LLM MVP (Stage 2)

---

## Sprint 1: Grandma UX + Spec Upgrades — DONE

| | Item | Status |
|---|------|--------|
| [x] | Template-first onboarding with search filter | DONE |
| [x] | Jargon cleanup across all UI labels | DONE |
| [x] | Accordion defaults optimized | DONE |
| [x] | Auto-select hero on example load | DONE |
| [x] | 4 spec generators improved (North Star, SADD, Build Plan, Features) | DONE |
| [x] | Example quality fixes (Blank D→B+, Kitchen Sink→Nexus Labs, Consulting +hero) | DONE |
| [x] | 54/54 Playwright tests passing | DONE |

## Sprint 2: Image Upload + Brand + Custom Colors + SEO + Save/Load — DONE

| | Item | Status |
|---|------|--------|
| [x] | Drag-drop image upload (base64, file validation, 2MB limit) | DONE |
| [x] | Brand management (logo/favicon/ogImage URL fields) | DONE |
| [x] | Custom hex color input (6 slots + native picker + debounce) | DONE |
| [x] | SEO fields (title/desc/author/domain/email) | DONE |
| [x] | Project save/load (projectStore + localStorage + JSON export/import) | DONE |
| [x] | 54/54 Playwright tests passing | DONE |

## Sprint 3: Section Variants + Pricing + Onboarding Redesign — DONE

| | Item | Status |
|---|------|--------|
| [x] | Section variant audit: 15 types, 55+ total variants | DONE |
| [x] | All section types have 2+ working variants (target met) | DONE |
| [x] | PricingToggle variant (monthly/annual toggle, 3 tiers, savings badge) | DONE |
| [x] | PricingComparison variant (feature matrix table, mobile cards) | DONE |
| [x] | NavbarCentered variant (centered logo + nav links) | DONE |
| [x] | Pricing now has 3 variants: tiers, toggle, comparison | DONE |
| [x] | Menu now has 2 variants: simple, centered | DONE |
| [x] | Onboarding redesign: two-panel, warm cream chrome, preview screenshots | DONE |
| [x] | 18 preview screenshots generated (10 themes + 8 examples) | DONE |
| [x] | Getting Started 1-2-3 strip above cards | DONE |
| [x] | Collapsible Project Capabilities section | DONE |
| [x] | Creative + Blog themes registered in THEME_REGISTRY | DONE |
| [x] | Test fixes for onboarding text changes | DONE |
| [x] | 54/54 Playwright tests passing | DONE |
| [x] | TypeScript clean, Vite build passes | DONE |

---

## Sprint 4: Quality Pass — NEXT

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Audit all 62+ `(section.content as any)` instances | P1 | TODO |
| [ ] | Create discriminated union types per section | P1 | TODO |
| [ ] | Replace all `as any` casts with typed interfaces | P1 | TODO |
| [ ] | Playwright tests: 70+ total passing | P1 | TODO |
| [ ] | Test: pricing variants (toggle, comparison) | P1 | TODO |
| [ ] | Test: onboarding page navigation | P1 | TODO |
| [ ] | Performance: initial load < 2s | P2 | TODO |
| [ ] | Performance: Lighthouse score > 80 | P2 | TODO |
| [ ] | Zero console errors during standard flows | P1 | TODO |

## Sprint 5: Docs + Review — TODO

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | Phase 9 retrospective with scores | P1 | TODO |
| [ ] | 4-persona review — target 85+ composite | P1 | TODO |
| [ ] | Update wiki | P1 | TODO |
| [ ] | Update master backlog | P1 | TODO |

## Manual Gates — TODO (requires human)

| | Item | Severity | Status |
|---|------|----------|--------|
| [ ] | 90% reproduction test: Implementation Plan → Claude → compare | P0 BLOCKER | TODO |
| [ ] | AISP MCP validation: Platinum tier (95+/100) | P0 BLOCKER | TODO |
| [ ] | 15-min demo rehearsal with timing notes | P0 BLOCKER | TODO |

---

## Progress Summary

| Sprint | Status | Tests |
|--------|--------|-------|
| Sprint 1 (Grandma UX) | DONE | 54/54 |
| Sprint 2 (Upload/Brand/Colors/SEO/Save) | DONE | 54/54 |
| Sprint 3 (Variants + Pricing + Onboarding) | DONE | 54/54 |
| Sprint 4 (Quality Pass) | NEXT | — |
| Sprint 5 (Docs + Review) | TODO | — |
| Manual Gates | TODO (human) | — |

**Phase 9 Progress: Sprints 1-3 DONE / 5 sprints + manual gates**

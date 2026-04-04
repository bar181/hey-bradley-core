# Phase 9: Living Checklist — Scored & Comprehensive

**Created:** 2026-04-04
**Last Updated:** 2026-04-04 (Post Sprint 3 + UX Review)
**Phase:** Pre-LLM MVP (Stage 2)
**Tests:** 54/54 | **Build:** Clean (3.20s) | **TypeScript:** Clean

---

## Legend

- Status: DONE / IN PROGRESS / TODO
- Quality: 1-10 scale (10 = perfect, 7+ = professional, <5 = needs work)
- UI/UX: Separate score for user-facing items (how it looks/feels to a user)

---

## Sprint 1: Grandma UX + Spec Upgrades — DONE

| # | Item | Status | Quality | UI/UX | Notes |
|---|------|--------|---------|-------|-------|
| 1.1 | Template-first onboarding (examples above themes) | DONE | 10/10 | 8/10 | Now has preview screenshots, two-panel layout |
| 1.2 | One-question kickstart search | DONE → REMOVED | — | — | Removed in Sprint 3 redesign per user feedback |
| 1.3 | Jargon cleanup (14 files) | DONE | 9/10 | 9/10 | Elements→Show/Hide, Layout→Design/Style |
| 1.4 | Accordion defaults (closed except Content) | DONE | 10/10 | 8/10 | Reduces visual overwhelm |
| 1.5 | Auto-select hero on example load | DONE | 10/10 | 9/10 | User lands with something editable immediately |
| 1.6 | North Star generator +metadata | DONE | 7/10 | — | Missing exec summary (spec review finding) |
| 1.7 | SADD generator +schema | DONE | 7.5/10 | — | Missing data flow narrative |
| 1.8 | Features generator +WCAG | DONE | 5.5/10 | — | Still reads like Jira tickets. Needs grouping, descriptions, priorities |
| 1.9 | AISP generator +images | DONE | 8/10 | — | Dense lambda bindings need spacing |
| 1.10 | Blank example D→B+ | DONE | 7/10 | 7/10 | Minimalist but functional |
| 1.11 | Kitchen Sink rebranded to Nexus Labs | DONE | 8/10 | 8/10 | Good showcase example |
| 1.12 | Consulting +hero image | DONE | 8/10 | 8/10 | Split-right hero with team photo |

## Sprint 2: Image Upload + Brand + Colors + SEO + Save/Load — DONE

| # | Item | Status | Quality | UI/UX | Notes |
|---|------|--------|---------|-------|-------|
| 2.1 | Drag-drop image upload (base64, 2MB) | DONE | 9/10 | 8/10 | Validation + preview working |
| 2.2 | Brand management (logo/favicon/ogImage) | DONE | 8/10 | 7/10 | URL fields in right panel |
| 2.3 | Custom hex color inputs (6 slots + picker) | DONE | 9/10 | 8/10 | Native color picker + debounce |
| 2.4 | SEO fields (title/desc/author/domain/email) | DONE | 8/10 | 7/10 | Character indicators present |
| 2.5 | Project save/load (localStorage + export/import) | DONE | 9/10 | 7/10 | Works but no visual project thumbnails |

## Sprint 3: Section Variants + Pricing + Onboarding — DONE

| # | Item | Status | Quality | UI/UX | Notes |
|---|------|--------|---------|-------|-------|
| 3.1 | Section variant audit (15 types) | DONE | 10/10 | — | All types meet 2+ variant minimum |
| 3.2 | PricingToggle variant | DONE | 8/10 | 8/10 | Monthly/annual toggle, savings badge, 3 tiers, recommended highlight |
| 3.3 | PricingComparison variant | DONE | 7/10 | 7/10 | Feature table works, mobile cards work. CTA fixed. Missing `content.tiers` data shape parity |
| 3.4 | NavbarCentered variant | DONE | 7/10 | 7/10 | Mobile-safe (hidden links). Vertical height slightly tall (P1 from review) |
| 3.5 | Onboarding page redesign | DONE | 8/10 | 8/10 | Two-panel, preview screenshots, warm cream chrome, Getting Started strip |
| 3.6 | 18 preview screenshots generated | DONE | 7/10 | 7/10 | Shows real content but includes tab bar at top. Could be cleaner with preview mode |
| 3.7 | Creative + Blog themes registered | DONE | 10/10 | — | Simple registration in index.ts + configStore |
| 3.8 | Collapsible Project Capabilities | DONE | 8/10 | 8/10 | Collapsed by default, shows future features |
| 3.9 | Broken image fallbacks | DONE | 9/10 | — | onError hides broken images gracefully |
| 3.10 | PricingComparison CTA inversion fix | DONE | 9/10 | — | Highlighted tier now has filled accent button |
| 3.11 | PricingToggle animation cleanup | DONE | 9/10 | — | No opacity flash, keyframes in global CSS |
| 3.12 | NavbarCentered mobile fix | DONE | 8/10 | 8/10 | Links hidden on mobile, CTA only |
| 3.13 | Test fixes for onboarding changes | DONE | 10/10 | — | 3 test files updated |
| 3.14 | Pricing variant picker in editor | DONE | 8/10 | 7/10 | Layout accordion with Cards/Toggle/Comparison buttons |

## Sprint 4: Quality Pass — TODO (NEXT)

| # | Item | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 4.1 | Fix 62+ `(section.content as any)` type casts | P1 | TODO | Discriminated union types per section. Sprint 4 core task |
| 4.2 | Playwright tests: 16+ new (target 70+ total) | P1 | TODO | Cover: pricing variants, onboarding nav, project save/load, image effects |
| 4.3 | react-markdown for XAIDocsTab spec rendering | P1 | TODO | Highest-impact single change. Transforms specs from terminal-dump to pro docs. Requires `react-markdown` + `remark-gfm` dependency |
| 4.4 | Features generator overhaul (5.5→8/10) | P1 | TODO | Add section descriptions, category grouping, priority indicators |
| 4.5 | All generators: add intro paragraphs | P1 | TODO | Every spec should open with a scope statement |
| 4.6 | PricingComparison: add `content.tiers` data shape support | P1 | TODO | Parity with PricingToggle's dual-shape extraction |
| 4.7 | PricingToggle: fix toggle knob positioning | P2 | TODO | `translate-x-[28px]` doesn't fully reach right edge |
| 4.8 | NavbarCentered: reduce vertical height | P2 | TODO | `py-3` → `py-2.5`, `mb-1` → `mb-0.5` |
| 4.9 | Onboarding: Getting Started step connectors | P2 | TODO | Add dashed lines between 1-2-3 steps |
| 4.10 | Onboarding: empty state contrast boost | P2 | TODO | Slightly stronger icon color + CTA pill background |
| 4.11 | Performance: initial load < 2s on 4G | P2 | TODO | Check Lighthouse, optimize if needed |
| 4.12 | Performance: no image 404s | P2 | TODO | Verify all media URLs resolve |
| 4.13 | Zero console errors during standard flows | P1 | TODO | Audit and fix |

## Sprint 5: Docs + Review — TODO

| # | Item | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 5.1 | Phase 9 retrospective with brutal honest scores | P1 | TODO | Score each sprint, overall phase |
| 5.2 | 4-persona review — target 85+ composite | P1 | TODO | Designer, Developer, PM, End User |
| 5.3 | Update wiki with Phase 9 content | P1 | TODO | New screenshots, variant coverage, pricing |
| 5.4 | Update master backlog (mark S2 items done) | P1 | TODO | Reflect Sprint 1-3 completions |

## Manual Gates — TODO (requires human)

| # | Item | Priority | Status | Notes |
|---|------|----------|--------|-------|
| M.1 | 90% reproduction test: Implementation Plan → Claude → compare | P0 BLOCKER | TODO | DoD #12 |
| M.2 | AISP MCP validation: Platinum tier (95+/100) | P0 BLOCKER | TODO | Use `aisp_validate` + `aisp_tier` |
| M.3 | 15-min demo rehearsal with timing notes | P0 BLOCKER | TODO | DoD #20 |

---

## Section Variant Coverage (Post Sprint 3)

| Section Type | Variants | Min | Status | Files |
|-------------|----------|-----|--------|-------|
| columns | 8 (cards, image-cards, icon-text, minimal, numbered, horizontal, gradient, glass) | 3+ | EXCEEDS | `src/templates/columns/` |
| hero | 4 (centered, split-left, split-right, overlay, minimal) | 3+ | PASS | `src/templates/hero/` |
| action | 4 (centered, split, gradient, newsletter) | 3+ | PASS | `src/templates/action/` |
| quotes | 4 (cards, single, stars, minimal) | 3+ | PASS | `src/templates/quotes/` |
| questions | 4 (accordion, two-column, cards, numbered) | 3+ | PASS | `src/templates/questions/` |
| numbers | 4 (counters, icons, cards, gradient) | 3+ | PASS | `src/templates/numbers/` |
| gallery | 4 (grid, masonry, carousel, full-width) | 3+ | PASS | `src/templates/gallery/` |
| image | 4 (full-width, with-text, overlay, parallax) | 3+ | PASS | `src/templates/image/` |
| footer | 4 (simple, multi-column, simple-bar, minimal) | 2+ | PASS | `src/templates/footer/` |
| pricing | 3 (tiers, toggle, comparison) | 3+ | PASS | `src/templates/pricing/` |
| logos | 3 (simple, marquee, grid) | 2+ | PASS | `src/templates/logos/` |
| divider | 3 (line, space, decorative) | 2+ | PASS | `src/templates/divider/` |
| text | 3 (single, two-column, sidebar) | 2+ | PASS | `src/templates/text/` |
| team | 3 (cards, grid, minimal) | 2+ | PASS | `src/templates/team/` |
| menu | 2 (simple, centered) | 2+ | PASS | `src/templates/navbar/` |
| **TOTAL** | **57 variants** | | **ALL PASS** | |

---

## Spec Generator Quality (Post Review)

| Generator | Rating | Key Issue | Fix Priority |
|-----------|--------|-----------|-------------|
| Build Plan | 8/10 | Informal target line | P2 |
| AISP | 8/10 | Dense lambda bindings | P2 |
| SADD | 7.5/10 | No data flow narrative | P2 |
| North Star | 7/10 | No executive summary | P2 |
| Human Spec | 6.5/10 | Monolithic overview table | P1 |
| Features | 5.5/10 | Reads like Jira tickets | P1 |
| **XAIDocsTab rendering** | **5/10** | **Raw `<pre>` tag** | **P1 (react-markdown)** |

---

## UX Review Findings Tracker

| # | Severity | Issue | Status | Sprint |
|---|----------|-------|--------|--------|
| 1 | P0 | PricingToggle opacity-0 flash | FIXED | S3 |
| 2 | P0 | NavbarCentered mobile overflow | FIXED | S3 |
| 3 | P1 | NavbarCentered height too tall | TODO | S4 |
| 4 | P1 | PricingToggle inline `<style>` tag | FIXED | S3 |
| 5 | P1 | PricingComparison `as any` casts | TODO | S4 |
| 6 | P1 | EXAMPLE_SLUGS fragile coupling | FIXED | S3 |
| 7 | P1 | Broken image fallbacks | FIXED | S3 |
| 8 | P1 | Toggle knob positioning | TODO | S4 |
| 9 | P1 | PricingComparison data shape parity | TODO | S4 |
| 10 | P2 | Getting Started step connectors | TODO | S4 |
| 11 | P2 | Empty state contrast | TODO | S4 |
| 12 | P2 | NavbarCentered CTA hover state | TODO | S4 |
| 13 | P2 | PricingComparison CTA inversion | FIXED | S3 |
| 14 | P2 | Panel ratio balance | DEFERRED | — |
| 15 | P2 | Savings badge edge case | DEFERRED | — |

**Fixed: 7/15 | TODO: 6/15 | Deferred: 2/15**

---

## Progress Summary

| Sprint | Status | Items | Done | Quality Avg | Tests |
|--------|--------|-------|------|-------------|-------|
| Sprint 1 (Grandma UX) | DONE | 12 | 12 | 8.1/10 | 54/54 |
| Sprint 2 (Upload/Brand/Colors) | DONE | 5 | 5 | 8.6/10 | 54/54 |
| Sprint 3 (Variants/Pricing/Onboarding) | DONE | 14 | 14 | 8.3/10 | 54/54 |
| Sprint 4 (Quality Pass) | TODO | 13 | 0 | — | — |
| Sprint 5 (Docs/Review) | TODO | 4 | 0 | — | — |
| Manual Gates | TODO | 3 | 0 | — | — |
| **TOTAL** | | **51** | **31** | **8.3/10** | **54/54** |

**Phase 9 Progress: 31/51 items (61%) — Sprints 1-3 DONE, Sprints 4-5 + Manual Gates remaining**

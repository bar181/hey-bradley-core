# Phase 9: Pre-LLM MVP (Stage 2)

**Created:** 2026-04-04
**Prerequisite:** Phase 8 CLOSED (88/100)
**Architecture:** [ADR-029](../../../docs/adr/ADR-029-pre-llm-mvp-architecture.md)
**Context Map:** [Stage 2 DDD](../../../docs/ddd/stage-2-context-map.md)

---

## Scope

Phase 9 implements **Stage 2 (Pre-LLM MVP)** from the master backlog. The goal: everything works without any LLM API call. Hey Bradley becomes a complete, self-contained specification builder with image upload, brand management, custom colors, project persistence, and full section variant coverage.

**Guiding principle:** No new external dependencies. No API keys. No authentication. No database. Everything runs in the browser.

---

## Sprint Plan

### Sprint 1: Manual Gates

**Duration:** Before capstone presentation
**Goal:** Validate that Stage 1 output is production-ready.

| # | Task | Backlog | Priority | Acceptance Criteria |
|---|------|---------|----------|---------------------|
| 1 | 90% reproduction test | S1-20 | P0 | Paste Implementation Plan spec into Claude Code; generated HTML matches original layout, copy, images, and component structure at 90%+ fidelity |
| 2 | AISP MCP validation | -- | P0 | Run `aisp_validate` and `aisp_tier` on generated AISP spec; achieves Platinum tier (95+/100) |
| 3 | 15-min demo rehearsal | DoD-20 | P0 | Complete rehearsal with timing notes; no "known issue" moments; all transitions smooth |
| 4 | Fix issues from tests 1-3 | -- | P0 | All blocking issues found during manual gates are resolved and retested |

### Sprint 2: Image Upload + Brand Management

**Duration:** 1 week
**Goal:** Users can upload custom images and manage brand assets.

| # | Task | Backlog | Priority | Acceptance Criteria |
|---|------|---------|----------|---------------------|
| 1 | Drag-and-drop image upload | S2-01 | P0 | User drags image onto drop zone or clicks file picker; image converts to base64; appears in section; file type validation (PNG/JPG/WEBP/SVG); 2 MB size limit with error message |
| 2 | Brand image management | S2-02 | P1 | Right-panel Brand section with logo URL, favicon URL, og:image URL fields; each accepts URL or uploaded base64; logo renders in Navbar preview |
| 3 | Wire CSS effects to templates | S1-22 | P1 | At least 4 of 8 image effects (Ken Burns, parallax, gradient overlay, grayscale-hover) visually working on template images |

### Sprint 3: Custom Colors + Newsletter + SEO

**Duration:** 1 week
**Goal:** Brand customization and content integration features.

| # | Task | Backlog | Priority | Acceptance Criteria |
|---|------|---------|----------|---------------------|
| 1 | Custom hex color input | S2-06 | P0 | Hex input field in Theme section; validates `#RRGGBB` format; updates palette slot in configStore; color swatch preview; respects theme lock |
| 2 | Newsletter form webhook | S2-07 | P1 | ActionNewsletter component POSTs `{ email }` to configurable URL; right-panel field for webhook URL; demo mode (no URL) shows success without request; error toast on failure |
| 3 | SEO fields panel | S2-08 | P1 | Site Settings section with title (60 char indicator), description (160 char indicator), og:image URL; stored in `siteStore.seo`; consumed by spec generators |
| 4 | Project save/load | S2-09 | P0 | Named projects saved to localStorage; load hydrates all stores; export downloads `.json` file; import validates with Zod and hydrates; project list UI in right panel |

### Sprint 4: Section Variant Completeness

**Duration:** 1 week
**Goal:** Every section type renders all declared variants correctly.

| # | Task | Backlog | Priority | Acceptance Criteria |
|---|------|---------|----------|---------------------|
| 1 | All 8 variants per section type | S2-05 | P0 | Each section type (Hero, Features, Pricing, Team, Gallery, Footer, etc.) renders all 8 variants without errors; Kitchen Sink example shows all variants |
| 2 | Pricing variants | S2-10 | P1 | Monthly/annual toggle works; comparison table variant renders; at least 3 pricing card layouts |
| 3 | Fix type casting | S2-11 | P1 | All 62+ `(section.content as any)` instances replaced with proper typed interfaces; `npm run build` passes with no type errors; discriminated union types per section |

### Sprint 5: Quality Pass

**Duration:** 1 week
**Goal:** Polish, test coverage, and performance.

| # | Task | Backlog | Priority | Acceptance Criteria |
|---|------|---------|----------|---------------------|
| 1 | Complete theme locking | S2-03 | P1 | Per-project brand guidelines enforcement; locked theme prevents color/font changes; lock state persists across save/load |
| 2 | Enterprise spec templates | S2-04 | P1 | Spec generators include responsive breakpoints and animation specs; output matches enterprise documentation standards |
| 3 | Playwright tests 70+ | -- | P1 | At least 70 Playwright tests passing; covers upload flow, project save/load, custom colors, SEO fields |
| 4 | Performance audit | -- | P2 | Initial load < 2s on simulated 4G; Lighthouse performance score > 80; no render-blocking base64 images over 500 KB |

---

## Architecture Summary

Per ADR-029:

| Decision | MVP Approach | Post-MVP Path |
|----------|-------------|---------------|
| Image storage | Base64 data URIs in project JSON | Supabase Storage with signed URLs |
| Project persistence | localStorage + JSON export/import | Supabase Postgres with RLS |
| Custom colors | Hex input -> configStore palette slots | Full color picker with presets |
| Brand management | URL/base64 fields in siteStore.brand | Brand kit with guidelines extraction |
| SEO fields | Text inputs in Site Settings panel | AI-generated SEO suggestions |
| Newsletter webhook | Configurable POST endpoint | Native integrations (Mailchimp, etc.) |

---

## Dependencies

- No new npm packages unless absolutely necessary
- Existing stack: React, Zustand, Zod, Tailwind, Playwright
- Existing stores: `configStore`, `siteStore`, `uiStore`
- New store: `projectStore` (Sprint 3)

---

## Exit Criteria

Phase 9 is DONE when:

1. All S2-01 through S2-11 backlog items are implemented
2. 70+ Playwright tests passing
3. `npm run build` succeeds with zero type errors
4. Manual gates (reproduction test, demo rehearsal) passed
5. AISP MCP validation achieves Platinum tier
6. No console errors during standard user flows
7. Performance: initial load < 2s on 4G simulation

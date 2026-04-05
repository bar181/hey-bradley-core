# Phase 13: Advanced Features + Content Expansion

**Prerequisite:** Phase 12 CLOSED
**Goal:** Expand content capabilities and add power-user features before LLM integration.
**Target score:** 90+/100
**Estimated swarm time:** 20-24 hours (5 sprints)

---

## Grounding Report (Pre-Phase Snapshot)

| Metric | Value |
|--------|-------|
| TS/TSX source files | 159 |
| Total source lines (TS/TSX/JSON/CSS) | ~38,700 |
| Themes | 12 |
| Examples | 10 |
| Media images (catalog entries) | 258 |
| Website pages | 4 |
| Chat commands | 10+ |
| Listen demos | 3 |
| Spec generators | 6 |
| Tests (last known) | 77 passing (target: 100+) |
| Test files | 10 |
| Phase 12 score | TBD (must be CLOSED before starting) |

### Key Files

| File / Directory | Purpose |
|------------------|---------|
| `src/data/examples/` | Example site JSON configs (10 files) |
| `src/data/themes/` | Theme JSON configs (12 files) |
| `src/data/media/images.json` | Media library catalog (258 entries) |
| `src/data/media/effects.json` | Image effect definitions |
| `src/components/` | All React components |
| `tests/` | Test suite (10 spec files) |

### Known Debt (Carry-Forward)

Items from Phase 12 that may carry over (to be confirmed at Phase 12 close):

- [ ] Any incomplete image effects from P12 P1-B/P1-C (bonus effects)
- [ ] Section-by-section UX cleanup gaps from P12 P5-A
- [ ] SIMPLE vs EXPERT mode boundary enforcement gaps from P12 P5-B
- [ ] Site context integration depth (all 6 generators fully aware)
- [ ] Test count gap (P12 target was 80+, Phase 13 target is 100+)

---

## Sprint Breakdown

### Sprint 1: New Examples (10+ Industry-Specific) -- 4-5 hours

Add 10+ new example site configs leveraging the site context system established in Phase 12. Each example must include complete `siteContext` fields (purpose, audience, tone, brand).

- [ ] Real estate agency example (`purpose: marketing, audience: consumer, tone: warm`)
- [ ] Law firm / legal services example (`purpose: marketing, audience: business, tone: formal`)
- [ ] Gym / fitness studio example (`purpose: marketing, audience: consumer, tone: bold`)
- [ ] Tech startup landing page example (`purpose: saas, audience: developer, tone: technical`)
- [ ] Wedding planner / events example (`purpose: portfolio, audience: consumer, tone: warm`)
- [ ] Coffee shop / cafe example (`purpose: marketing, audience: consumer, tone: casual`)
- [ ] Freelance designer portfolio example (`purpose: portfolio, audience: creative, tone: playful`)
- [ ] Dental / medical practice example (`purpose: marketing, audience: consumer, tone: warm`)
- [ ] Non-profit / charity example (`purpose: marketing, audience: consumer, tone: warm`)
- [ ] Music / band promo page example (`purpose: portfolio, audience: consumer, tone: bold`)
- [ ] Each example JSON placed in `src/data/examples/`
- [ ] Each example registered in `src/data/examples/index.ts`
- [ ] Each example uses at least 6 sections with varied layouts
- [ ] Each example uses images from existing media library
- [ ] Examples render correctly in all 12 themes
- [ ] At least 3 examples use image effects from Phase 12
- [ ] Verify no regressions in existing 10 examples

### Sprint 2: Blog Article Editor with Markdown -- 5-6 hours

Add a blog section type with a markdown editor for article content. This is the foundation for content-heavy sites.

- [ ] **ADR-034** written and approved (Blog Section Type)
- [ ] `BlogSection` interface defined in TypeScript
- [ ] New section type `blog` added to section registry
- [ ] Blog section supports: title, author, date, featured image, markdown body
- [ ] Markdown editor component with live preview (split pane)
- [ ] Markdown rendering: headings, bold, italic, links, lists, code blocks, images
- [ ] Blog list view (multiple articles displayed as cards)
- [ ] Blog detail view (single article expanded)
- [ ] Blog section works in SIMPLE mode (title + body only)
- [ ] Blog section works in EXPERT mode (full metadata + styling)
- [ ] Blog section renders correctly across all 12 themes
- [ ] Blog-themed example updated to use new blog section type
- [ ] At least 3 sample articles pre-populated in blog example
- [ ] 5+ tests for blog section rendering and markdown parsing

### Sprint 3: Multi-Page Support -- 5-6 hours

Enable site configs to define multiple pages with navigation between them. This is the architecture for real websites.

- [ ] **ADR-035** written and approved (Multi-Page Architecture)
- [ ] `PageConfig` interface: id, title, slug, sections[], isHome
- [ ] `MasterConfig.pages[]` array replaces single sections array
- [ ] Backward compatibility: configs without `pages` treated as single-page
- [ ] Page navigation component (top nav links)
- [ ] Page switcher in builder left panel
- [ ] Add/remove/reorder pages in builder
- [ ] Each page has independent section list
- [ ] Preview mode renders active page with nav
- [ ] URL hash routing for page switching in preview (`#/about`, `#/services`)
- [ ] At least 2 examples updated to use multi-page configs
- [ ] All existing single-page examples still work (backward compat)
- [ ] 5+ tests for multi-page routing and config migration

### Sprint 4: ZIP Export + Keyboard Shortcuts -- 3-4 hours

Power-user features for productivity and deliverability.

#### ZIP Export

- [ ] **ADR-036** written and approved (ZIP Export Format)
- [ ] Export button in builder toolbar
- [ ] ZIP contains: `index.html` (self-contained), `styles.css`, `config.json`
- [ ] Multi-page export: one HTML file per page + shared nav
- [ ] Images embedded as data URIs or referenced from media catalog
- [ ] Exported site works offline (no external dependencies)
- [ ] Export includes site metadata (title, description, favicon reference)
- [ ] Download triggers via browser Blob API
- [ ] 3+ tests for ZIP generation and content validation

#### Keyboard Shortcuts

- [ ] `Ctrl+S` / `Cmd+S` — save/export config JSON
- [ ] `Ctrl+Z` / `Cmd+Z` — undo last change
- [ ] `Ctrl+Shift+Z` / `Cmd+Shift+Z` — redo
- [ ] `Ctrl+P` / `Cmd+P` — toggle preview mode
- [ ] `Ctrl+E` / `Cmd+E` — toggle SIMPLE/EXPERT mode
- [ ] `Escape` — close modals/lightbox
- [ ] `Tab` — cycle through sections in left panel
- [ ] Keyboard shortcut overlay (`Ctrl+?` / `Cmd+?`)
- [ ] Shortcuts respect focus context (no conflicts with text editing)
- [ ] 3+ tests for keyboard shortcut registration and behavior

### Sprint 5: A11y Audit + Quality Pass + Phase Close -- 3-4 hours

Accessibility audit, test expansion to 100+, and phase closure.

#### Accessibility Audit

- [ ] Color contrast audit (WCAG AA compliance for all themes)
- [ ] Keyboard navigation audit (all interactive elements reachable)
- [ ] Screen reader audit (semantic HTML, ARIA labels, alt text)
- [ ] Focus indicator visibility on all interactive elements
- [ ] Skip-to-content link on preview pages
- [ ] Form labels and error messages accessible
- [ ] Modal focus trapping (lightbox, export dialog)
- [ ] Document all findings in `plans/implementation/phase-13/a11y-audit.md`
- [ ] Fix all critical a11y issues (contrast, keyboard, focus)

#### Quality Pass

- [ ] `npx tsc -b` passes (zero errors)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes -- target 100+ tests
- [ ] 25+ new tests across sprints 1-4
- [ ] No regressions in existing demos/examples/themes
- [ ] Vercel deployment green
- [ ] All 20+ examples render without errors
- [ ] All 12 themes apply correctly to new features

#### Phase Close

- [ ] 5-persona review: target 85+ composite
- [ ] Full retrospective written to `plans/implementation/phase-13/retrospective.md`
- [ ] This checklist fully updated
- [ ] Session log updated
- [ ] CLAUDE.md updated with Phase 13 status
- [ ] Phase 14 preflight grounding report written
- [ ] Phase 13 score assigned

---

## ADRs Required

| ADR | Title | Sprint | Key Decisions |
|-----|-------|--------|---------------|
| ADR-034 | Blog Section Type | Sprint 2 | Markdown parser choice, storage format, section schema, list vs detail rendering |
| ADR-035 | Multi-Page Architecture | Sprint 3 | Config migration strategy, routing approach, nav generation, backward compatibility |
| ADR-036 | ZIP Export Format | Sprint 4 | HTML generation strategy, asset bundling, offline support, file structure |

---

## Dependencies for Phase 14 (LLM Integration)

Phase 13 must deliver these capabilities before Phase 14 can begin:

1. **Multi-page architecture** -- LLM will generate multi-page sites, so the config format must support pages
2. **Blog section type** -- LLM content generation targets blog articles as a primary use case
3. **ZIP export** -- LLM-generated sites need a delivery mechanism for end users
4. **100+ tests** -- Regression safety net before introducing LLM non-determinism
5. **A11y baseline** -- LLM-generated content must meet accessibility standards established here
6. **20+ examples** -- Training/prompt-engineering reference set for LLM site generation
7. **Site context system (from P12)** -- LLM uses purpose/audience/tone to guide generation

### Phase 14 Cannot Start Until

- [ ] Phase 13 score >= 85/100
- [ ] All 3 ADRs (034-036) written and approved
- [ ] Multi-page config format stable (no breaking changes expected)
- [ ] Blog section type shipped and tested
- [ ] 100+ tests passing
- [ ] A11y critical issues resolved

---

## Carry-Over from Phase 12

Items that Phase 12 did not complete will be listed here at Phase 12 close. Potential candidates:

- Image effects bonus set (vignette, fade-in-on-scroll, tilt-on-hover) from P12 P1-C
- Template marketplace UI (deferred from P12 scope to P13)
- Custom section builder (user-defined section types, deferred to P13)
- Image gallery enhancements (upload simulation, drag-to-reorder)

**Note:** This section will be finalized when Phase 12 closes. Items above are based on the Phase 12 checklist scope and known priorities.

---

## Stop Point

When the next feature requires an LLM call, database write, or external API integration, pause and plan Stage 3 (LLM MVP). Phase 13 is the last pure-frontend phase.

---

## Execution Order

```
Sprint 1: New examples (10+ industry-specific)           — 4-5 hrs
Sprint 2: Blog article editor with markdown               — 5-6 hrs
Sprint 3: Multi-page support                               — 5-6 hrs
Sprint 4: ZIP export + keyboard shortcuts                  — 3-4 hrs
Sprint 5: A11y audit + quality pass + phase close          — 3-4 hrs
                                                    Total: 20-24 hrs
```

**Rule:** Each sprint must pass tests before moving to the next. No sprint starts until the previous sprint's tests are green.

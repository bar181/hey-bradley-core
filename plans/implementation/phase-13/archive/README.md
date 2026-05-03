# Phase 13: Advanced Features + Content Expansion

**Prerequisite:** Phase 12 CLOSED (78/100)  
**Goal:** Expand content capabilities, add blog section type, multi-page support, export, and a11y before moving to review phases.  
**Target score:** 85+/100  
**Estimated swarm time:** 10-12 hours (5 sprints)  

---

## Grounding Report (Pre-Phase Snapshot)

| Metric | Value |
|--------|-------|
| TS/TSX source files | 163+ |
| Total source lines | ~40,000+ |
| Themes | 12 |
| Examples | 13 (bakery, blank, consulting, education, fitforge, florist, kitchen-sink, launchpad, photography, restaurant, fun-blog, dev-portfolio, enterprise-saas) |
| Media images (catalog) | 258 |
| Website pages | 4 (About, Open Core, How I Built This, Docs) |
| Chat commands | 15+ (includes 5 tone/audience commands from P12) |
| Listen demos | 3 |
| Spec generators | 6 (enhanced with design specs + cross-refs in P12) |
| Tests | 87 passing (11 spec files) |
| Image effects | 13 (8 core + 5 wow-factor) |
| Center tabs | 5 EXPERT (Preview, Blueprints, Resources, Data, Pipeline) |
| Blueprints sub-tabs | 7 (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON) |
| Phase 12 score | 78/100 |

### Key Files

| File / Directory | Purpose |
|------------------|---------|
| `src/data/examples/` | Example site JSON configs (13 files) |
| `src/data/themes/` | Theme JSON configs (12 files) |
| `src/data/media/images.json` | Media library catalog (258 entries) |
| `src/data/media/effects.json` | Image effect definitions (13 effects) |
| `src/components/center-canvas/ResourcesTab.tsx` | Resources tab (new in P12) |
| `src/components/ui/LightboxModal.tsx` | Lightbox modal (new in P12) |
| `src/components/right-panel/simple/SiteContextEditor.tsx` | Site context editor (new in P12) |
| `src/lib/schemas/masterConfig.ts` | MasterConfig with siteContext fields |
| `tests/` | Test suite (11 spec files, 87 tests) |

### Known Debt (Carry-Forward from Phase 12)

- [ ] Food blog listen demo sequence (deferred from P12 P3-B)
- [ ] A11y audit not started
- [ ] Test count at 87, target 100+
- [ ] Consolidated "Master Spec" view (optional)

---

## Sprint Breakdown

### Sprint 1: Content Expansion (P0, 2 hours)

- [ ] Food blog listen demo sequence ("Build me a casual food blog with lots of photos")
- [ ] 2 new examples: real estate agency, law firm (15+ total)
- [ ] Each new example has siteContext filled (purpose/audience/tone/brand)
- [ ] Target 300+ images in media library (add 40+ new entries to images.json)
- [ ] Verify all 15+ examples render in all 12 themes
- [ ] 3+ tests for new examples loading

### Sprint 2: Blog Section Type (P0, 2 hours)

**Research first:** Check existing section types to understand the registry pattern.

- [ ] **ADR-034** written: Blog Section Type architecture decision
- [ ] `BlogSection` interface defined (title, excerpt, author, date, tags, featured image)
- [ ] New section type `blog` registered in section registry
- [ ] 4 variants: card grid, list with excerpts, featured + grid, minimal
- [ ] SIMPLE mode: title + excerpt + image only
- [ ] EXPERT mode: full metadata + styling
- [ ] Wire to ImagePicker for featured images
- [ ] Blog-focused example updated to use new section type
- [ ] Template renders correctly across all 12 themes
- [ ] 5+ tests for blog section

### Sprint 3: Multi-Page Architecture (P1, 3 hours)

**Research first:** Understand current config structure and routing.

- [ ] **ADR-035** written: Multi-Page Architecture decision
- [ ] `PageConfig` interface: id, title, slug, sections[], isHome
- [ ] `MasterConfig.pages[]` array (backward compatible — no `pages` = single-page)
- [ ] Page management UI in left panel (Home, About, Contact, Blog)
- [ ] Add/remove/reorder pages
- [ ] Each page has independent section list
- [ ] Preview mode renders active page with nav links
- [ ] URL hash routing (#/about, #/services)
- [ ] Navigation menu auto-updates with page names
- [ ] Specs generate per-page and as combined package
- [ ] 2-3 page templates (Home + About, Home + About + Contact)
- [ ] All existing single-page configs still work
- [ ] 5+ tests for multi-page routing

### Sprint 4: Export + Accessibility (P1, 2 hours)

- [ ] **ADR-036** written: ZIP Export Format
- [ ] Export button in builder toolbar
- [ ] ZIP contains: all specs (MD + AISP) + config.json + images manifest
- [ ] Download via browser Blob API
- [ ] Basic a11y audit: color contrast, alt text, heading hierarchy, keyboard nav
- [ ] Document findings in `plans/implementation/phase-13/a11y-audit.md`
- [ ] Fix critical a11y issues (contrast, focus, keyboard)
- [ ] 3+ tests for export functionality

### Sprint 5: Quality Pass + Phase Close (P1, 1.5 hours)

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Target 100+ Playwright tests (25+ new across sprints)
- [ ] Full persona review: Agentic Engineer 80+, Grandma 55+, Capstone 82+
- [ ] Retrospective with honest scores → `phase-13/retrospective.md`
- [ ] Session log finalized → `phase-13/session-log.md`
- [ ] Wiki page → `wiki/15-phase-13-advanced-features.guide.html`
- [ ] CLAUDE.md updated
- [ ] Phase 14 preflight created

---

## ADRs Required

| ADR | Title | Sprint |
|-----|-------|--------|
| ADR-034 | Blog Section Type | Sprint 2 |
| ADR-035 | Multi-Page Architecture | Sprint 3 |
| ADR-036 | ZIP Export Format | Sprint 4 |

Each ADR must include: context, decision, consequences, alternatives considered.

---

## Testing Plan

| Area | New Tests | Total Target |
|------|-----------|-------------|
| Content (examples, listen) | 5 | — |
| Blog section | 5 | — |
| Multi-page | 5 | — |
| Export + a11y | 5 | — |
| Regression | 5 | — |
| **Total new** | **25** | **100+** |

---

## Phase 14+ Roadmap (Updated — LLM Deferred)

The LLM integration phase is deferred. The revised roadmap focuses on comprehensive review and pre-LLM simulation before any real AI integration.

| Phase | Focus | Status |
|-------|-------|--------|
| **P13** | Advanced Features: blog, multi-page, export, a11y, 100+ tests | NEXT |
| **P14** | Marketing site review: all website sections/content ready | PLANNED |
| **P15** | Developer assistance: builder UX, docs, tooltips, onboarding | PLANNED |
| **P16** | Advanced features review: effects, context, templates, Resources | PLANNED |
| **P17** | Feature Review ADR: create checklist + proof for 1 feature (pilot) | PLANNED |
| **P18** | Comprehensive review: all features/sections using P17 checklist | PLANNED |
| **P19** | System-wide review: identify all requirements before LLM stage | PLANNED |
| **P20-P22** | Pre-LLM simulations (3-5 phases): simulated responses, prompt templates, JSON update confirmation, response structure validation | PLANNED |
| **P23+** | LLM integration: real AI chat/listen, API keys, streaming | PLANNED |

### Pre-LLM Simulation Phases (P20-P22) Must Cover:
- Simulated LLM responses for all chat commands
- Prompt template library (per purpose/audience/tone)
- Confirmation that LLM response structure matches expected JSON format
- Confirmation that LLM response correctly updates config store
- Error handling for malformed LLM responses
- Streaming response simulation
- Token usage estimation
- Rate limit simulation
- Full suite of LLM requirements documented as ADRs

---

## Enforcement: Logs & Reviews

Every phase MUST produce:
1. **Session log** (`phase-N/session-log.md`) — every action, commit, decision, issue
2. **Living checklist** (`phase-N/living-checklist.md`) — real-time status of all deliverables
3. **Retrospective** (`phase-N/retrospective.md`) — honest scores, what shipped, what didn't
4. **Wiki page** (`wiki/NN-phase-N-title.guide.html`) — public-facing summary
5. **CLAUDE.md update** — reflect current state
6. **Phase N+1 preflight** — grounding report, sprint plan, ADRs, tests, enforcement

---

## Dependencies for Phase 14+

Before Phase 14 (marketing site review) can start:
- Multi-page architecture stable (P13 Sprint 3)
- Blog section type shipped (P13 Sprint 2)
- 100+ tests passing (P13 Sprint 5)
- A11y baseline established (P13 Sprint 4)
- 15+ examples covering all purpose/audience combos
- Site context fully integrated in all generators

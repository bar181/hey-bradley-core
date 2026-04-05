# Phase 14: Marketing Site Review

**Prerequisite:** Phase 13 CLOSED  
**Goal:** Audit every website section, example, and piece of user-facing content for clarity, polish, and marketing effectiveness. This is the first of 6 review phases before LLM integration.  
**Target score:** 85+/100  
**Estimated time:** 9.5 hours (5 sprints)  
**Phase type:** REVIEW (no new features, no new architecture)

---

## Grounding Report (Post-Phase 13 Snapshot)

| Metric | Value |
|--------|-------|
| TS/TSX source files | 170 |
| Total source lines | ~40,000+ |
| Themes | 12 (agency, blog, creative, elegant, minimalist, neon, personal, portfolio, professional, saas, startup, wellness) |
| Examples | 15 (bakery, blank, consulting, dev-portfolio, education, enterprise-saas, fitforge, florist, fun-blog, kitchen-sink, launchpad, law-firm, photography, real-estate, restaurant) |
| Media images (catalog) | 300+ (images.json: 3,921 lines) |
| Image effects | 13 (8 core + 5 wow-factor) |
| Section types | 16 (hero, menu, columns, pricing, action, footer, quotes, questions, numbers, gallery, logos, team, image, divider, text, blog) |
| Website pages | 4 (About, Open Core, How I Built This, Docs) |
| Chat commands | 15+ (includes tone/audience commands) |
| Listen demos | 3 |
| Spec generators | 6 (with design specs + cross-refs) |
| Blueprints sub-tabs | 7 (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON) |
| Center tabs (EXPERT) | 5 (Preview, Blueprints, Resources, Data, Pipeline) |
| Multi-page support | Yes (P13 Sprint 3) |
| Blog section type | Yes (P13 Sprint 2) |
| ZIP export | Yes (P13 Sprint 4) |
| A11y baseline | Established (P13 Sprint 4) |
| Tests | 87+ passing (10+ spec files) |
| Phase 13 score | TBD (pending close) |

### Key Files

| File / Directory | Purpose |
|------------------|---------|
| `src/pages/About.tsx` | About website page |
| `src/pages/OpenCore.tsx` | Open Core website page |
| `src/pages/HowIBuiltThis.tsx` | How I Built This website page |
| `src/pages/Docs.tsx` | Docs website page |
| `src/data/examples/` | Example site JSON configs (15 files) |
| `src/data/themes/` | Theme JSON configs (12 files) |
| `src/data/media/images.json` | Media library catalog (300+ entries) |
| `src/data/media/effects.json` | Image effect definitions (13 effects) |
| `src/lib/schemas/section.ts` | Section type definitions (16 types) |
| `src/lib/specGenerators/sectionRules.ts` | Section rendering rules |
| `src/components/center-canvas/CenterCanvas.tsx` | Main canvas + tab routing |
| `src/main.tsx` | App entry + page routing |
| `tests/` | Test suite (10+ spec files) |

### Known Debt (Carry-Forward from Phase 13)

- [ ] Test count target 100+ (verify final P13 count)
- [ ] Any P13 deferred items (check P13 retrospective)
- [ ] Placeholder text in examples (known risk, audit in this phase)

---

## Phase 14 Focus

This is NOT a feature-building phase. This is a REVIEW phase. Every website section, every piece of content, every page must be audited for:

- **Messaging clarity** -- Is the copy clear, professional, and compelling?
- **Visual consistency** -- Do all sections look polished across all 12 themes?
- **Content completeness** -- Are there placeholder texts? Missing descriptions? TODO markers? Lorem ipsum?
- **Navigation flow** -- Does the user journey make sense from landing to builder?
- **Marketing effectiveness** -- Would this convince someone to use Hey Bradley?

### Review Principles

1. Read every paragraph as if you are a first-time visitor who has never heard of Hey Bradley
2. Every page must answer: "What is this? Why should I care? What do I do next?"
3. No developer jargon in SIMPLE mode -- grandma must understand every label
4. No broken images, dead links, or empty states
5. Consistent voice: warm, confident, helpful (not salesy, not robotic)

---

## Sprint Breakdown

### Sprint 1: Website Pages Audit (P0, 2 hours)

**Goal:** Every word on every website page is reviewed and fixed.

- [ ] Review `About.tsx` -- purpose, team, mission statement
- [ ] Review `OpenCore.tsx` -- licensing model, what's free vs. paid, CTA
- [ ] Review `HowIBuiltThis.tsx` -- technical story, phase history, architecture
- [ ] Review `Docs.tsx` -- getting started, API reference, integration guide
- [ ] Check every paragraph for placeholder text, TODO markers, lorem ipsum
- [ ] Verify all images render (no broken `src`, no missing alt text)
- [ ] Verify all links work (internal navigation, external URLs)
- [ ] Verify all CTAs have clear destinations and purpose
- [ ] Check page titles, meta descriptions (if applicable)
- [ ] Verify responsive layout on mobile/tablet/desktop breakpoints
- [ ] Document all issues found in `phase-14/website-audit.md`
- [ ] Fix all messaging issues discovered
- [ ] 3+ regression tests for website page content

### Sprint 2: Example Sites Audit (P0, 2 hours)

**Goal:** Every example loads, renders correctly, and has real content.

- [ ] Load each of the 15 examples by name and verify they parse without errors
- [ ] Verify each example renders correctly in all 12 themes (15 x 12 = 180 combinations)
- [ ] Check for broken layouts, overlapping text, missing images in each combo
- [ ] Verify placeholder text is replaced with realistic content in every example
- [ ] Verify `siteContext` fields are set correctly for each example:
  - `purpose` -- meaningful, not generic
  - `audience` -- specific target user
  - `tone` -- matches the example's personality
  - `brand` -- colors/fonts make sense for the domain
- [ ] Verify section ordering makes sense for each example's purpose
- [ ] Check that example names match their content (no misleading names)
- [ ] Document all issues in `phase-14/examples-audit.md`
- [ ] Fix all content and rendering issues
- [ ] 3+ tests for example loading and rendering

### Sprint 3: Section Templates Audit (P1, 2 hours)

**Goal:** Every section type renders cleanly across all themes and variants.

- [ ] Render every section type (16 types) in every variant
- [ ] Check visual consistency across all 12 themes for each section type
- [ ] Verify responsive behavior at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Check image effects render correctly per section (13 effects x relevant sections)
- [ ] Verify SIMPLE vs. EXPERT mode shows appropriate controls per section type
- [ ] Check spacing, typography, and alignment consistency
- [ ] Verify color contrast meets WCAG AA (built on P13 a11y baseline)
- [ ] Check that blog section type (new in P13) renders all 4 variants correctly
- [ ] Verify divider and text sections handle edge cases (empty content, very long text)
- [ ] Document all issues in `phase-14/sections-audit.md`
- [ ] Fix all visual inconsistencies

### Sprint 4: Messaging + Copy Pass (P1, 2 hours)

**Goal:** Every user-facing string in the builder is clear, consistent, and grandma-friendly.

- [ ] Review all button labels in the builder toolbar
- [ ] Review all tab names (center tabs, left panel tabs, right panel tabs)
- [ ] Review all tooltips and hover text
- [ ] Review all form labels and placeholder text in the right panel
- [ ] Review all error messages and empty states
- [ ] Review all modal titles and body text
- [ ] Review chat command descriptions and examples
- [ ] Review listen demo descriptions
- [ ] Check for developer jargon in SIMPLE mode (replace with plain language)
- [ ] Check for inconsistent capitalization (Title Case vs. sentence case)
- [ ] Check for inconsistent terminology (e.g., "site" vs. "website" vs. "page")
- [ ] Verify onboarding flow text is welcoming and clear
- [ ] Ensure spec generator output labels are understandable
- [ ] Document all issues in `phase-14/messaging-audit.md`
- [ ] Fix all copy issues

### Sprint 5: Quality Pass + Phase Close (P1, 1.5 hours)

**Goal:** Tests pass, scores assigned, phase formally closed.

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Full test suite passing (target: maintain 87+ from P13, add 5-10 new)
- [ ] 5-persona review:
  - Agentic Engineer: 80+ (clean architecture, specs useful)
  - Grandma: 55+ (can navigate, no jargon in SIMPLE mode)
  - Capstone Reviewer: 85+ (professional presentation, comprehensive)
  - Marketing Lead: 75+ (compelling messaging, clear value prop)
  - First-time Visitor: 70+ (understands product in 30 seconds)
- [ ] Retrospective with honest scores -> `phase-14/retrospective.md`
- [ ] Session log finalized -> `phase-14/session-log.md`
- [ ] Living checklist -> `phase-14/living-checklist.md`
- [ ] Wiki page -> `wiki/NN-phase-14-marketing-site-review.guide.html`
- [ ] CLAUDE.md updated with Phase 14 CLOSED status
- [ ] Phase 15 preflight created -> `plans/implementation/phase-15/README.md`

---

## ADRs Required

None. This is a review phase with no new architecture decisions.

If a review finding requires architectural changes (e.g., restructuring a page component), document the need and defer to Phase 15+.

---

## Testing Plan

| Area | New Tests | Purpose |
|------|-----------|---------|
| Website pages | 3 | Content presence, no placeholder text, links work |
| Example rendering | 3 | All 15 examples load, parse, and render |
| Section templates | 2 | Visual regression for key section types |
| Messaging/copy | 2 | No jargon in SIMPLE mode, consistent terminology |
| **Total new** | **10** | Maintain 87+ baseline + net new |

All new tests go in `tests/` directory following existing spec naming patterns.

---

## Enforcement: Per ADR-011

Every phase MUST produce:
1. **Session log** (`phase-14/session-log.md`) -- every action, commit, decision, issue
2. **Living checklist** (`phase-14/living-checklist.md`) -- real-time status of all deliverables
3. **Retrospective** (`phase-14/retrospective.md`) -- honest scores, what shipped, what didn't
4. **Wiki page** (`wiki/NN-phase-14-marketing-site-review.guide.html`) -- public-facing summary
5. **CLAUDE.md update** -- reflect current state
6. **Phase 15 preflight** (`plans/implementation/phase-15/README.md`) -- grounding report, sprint plan

---

## Dependencies for Phase 15

Before Phase 15 (Developer Assistance: builder UX, docs, tooltips, onboarding) can start:

- All 4 website pages content finalized and reviewed
- All 15 examples rendering cleanly in all 12 themes
- All 16 section types visually consistent across themes
- No placeholder text anywhere in the app
- No broken links, images, or CTAs
- Consistent voice/tone across all user-facing copy
- Messaging audit complete with all critical issues resolved
- Test suite stable at 87+ tests

---

## Phase 15+ Roadmap (Unchanged)

| Phase | Focus | Status |
|-------|-------|--------|
| **P14** | Marketing site review: all sections/content ready | NEXT |
| **P15** | Developer assistance: builder UX, docs, tooltips, onboarding | PLANNED |
| **P16** | Advanced features review: effects, context, templates, Resources | PLANNED |
| **P17** | Feature Review ADR: checklist + proof for 1 feature (pilot) | PLANNED |
| **P18** | Comprehensive review: all features/sections using P17 checklist | PLANNED |
| **P19** | System-wide review: all requirements before LLM stage | PLANNED |
| **P20-22** | Pre-LLM simulations: prompt templates, response validation, JSON updates | PLANNED |
| **P23+** | LLM integration: real AI, API keys, streaming | PLANNED |

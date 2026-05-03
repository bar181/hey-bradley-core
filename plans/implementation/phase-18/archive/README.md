# Phase 18: Step-by-Step Feature Review (Full Sweep)

**Prerequisite:** Phase 17 CLOSED (ADR + pilot audit complete)  
**Goal:** Execute the Phase 17 review checklist against every section, button, and feature in Hey Bradley. Fix all issues found. Produce a fully audited, production-ready application.

## Core Deliverables

### Full Feature Audit
Using the checklist template from Phase 17, review every feature:

#### Section Editors (20 types)
- [ ] Hero (all variants)
- [ ] Columns (all variants)
- [ ] Pricing (all variants)
- [ ] Action / CTA (all variants)
- [ ] Quotes / Testimonials (all variants)
- [ ] Questions / FAQ (all variants)
- [ ] Numbers / Stats (all variants)
- [ ] Gallery (all variants)
- [ ] Menu (all variants)
- [ ] Footer (all variants)
- [ ] Image (all variants)
- [ ] Divider (all variants)
- [ ] Text (all variants)
- [ ] Logos (all variants)
- [ ] Team (all variants)
- [ ] + any additional section types added in Phases 12-16

#### Builder Features
- [ ] Theme selector (all 12 themes)
- [ ] Example loader (all 10+ examples)
- [ ] Site context system (purpose, audience, tone, brand)
- [ ] Section add/remove/reorder
- [ ] Image picker + effects (all 8-11 effects)
- [ ] Lightbox modal
- [ ] Project save/load (localStorage + JSON export)
- [ ] Onboarding flow
- [ ] SIMPLE vs EXPERT mode toggle

#### Center Panel Tabs
- [ ] Preview tab (live rendering, responsive)
- [ ] Blueprints tab (5 sub-tabs, all generating)
- [ ] Data tab (JSON editor, bidirectional sync)
- [ ] AISP tab (Crystal Atom output, copy, export)
- [ ] Workflow tab (user story flow diagram)

#### Simulations
- [ ] Chat commands (all 10+ commands)
- [ ] Listen demos (all 3+ demos)
- [ ] Tone/audience chat commands (from Phase 12)

#### Website Pages
- [ ] About page
- [ ] Open Core page
- [ ] How I Built This page
- [ ] Docs page

#### Cross-Cutting
- [ ] All 12 themes render every section correctly
- [ ] All 10+ examples load and display correctly
- [ ] Responsive: mobile, tablet, desktop
- [ ] Accessibility: keyboard navigation, focus management
- [ ] Performance: no jank, fast transitions
- [ ] Spec generators: all 6 produce valid output for all configs

### Fix Phase
- All P0 (broken) issues fixed immediately
- All P1 (degraded) issues fixed before phase close
- P2 (cosmetic) issues logged for future phases
- P3 (enhancement) ideas captured in backlog

### Deliverable Files
- `plans/implementation/phase-18/audit-results/` — one file per feature reviewed
- `plans/implementation/phase-18/fix-log.md` — all fixes applied
- `plans/implementation/phase-18/final-scorecard.md` — pass/fail summary
- `plans/implementation/phase-18/retrospective.md` — phase close

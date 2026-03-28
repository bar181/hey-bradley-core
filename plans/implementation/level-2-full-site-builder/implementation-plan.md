# Level 2: Full Site Builder — Implementation Plan

## Prerequisites
- Level 1 complete (shell, hero+JSON loop, all tabs, listen visual, hero polish)

## Phase 2.1 — Vibe Onboarding
**Goal:** Landing page with clickable vibe cards. Selecting a vibe loads the builder.
**Definition of Done:**
- Onboarding page renders with 6+ vibe cards showing live mini-previews
- "Describe your site" textarea (placeholder for L5.4)
- "Start from scratch" option available
- Vibe switcher within builder works
- Selecting vibe loads builder with correct theme applied
- Page transitions are smooth and polished

**Research Requirements:**
- CSS container queries for mini-preview rendering
- Page transition animation approaches (no framer-motion — not approved)
- Vibe preset data structure design

**Deliverables:** Onboarding page component, vibe card components with mini-previews, "describe your site" textarea, "start from scratch" option, vibe switcher in builder, routing from / to /builder

## Phase 2.2 — All Core Sections
**Goal:** All 8 section types with 3-5 variants each. Section CRUD works.
**Definition of Done:**
- All 8 section types render from JSON: Hero, Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props
- Each section has 3-5 visual variants
- Section add (dropdown), remove, duplicate works
- Drag-and-drop reorder with @dnd-kit
- Section navigator in left panel
- Full-page preview mode
- Expert mode shows section-specific property inspectors

**Research Requirements:**
- @dnd-kit/core + @dnd-kit/sortable API for drag-and-drop reorder
- Section registry pattern for mapping type → variant → component
- Zod discriminated union pattern for section schemas

**Deliverables:** Section registry, 8 section types × 3-5 variants each (Hero: centered/split/overlay/full-image/minimal, Features: grid-3col/grid-4col/alternating/cards, Pricing: 2-tier/3-tier/comparison, CTA: simple/split/with-image/gradient, Footer: simple/multi-column/minimal, Testimonials: cards/carousel/quote-single, FAQ: accordion/two-column, Value Props: icons/numbers/cards), section CRUD operations, drag-and-drop, section navigator, full-page preview

## Phase 2.3 — Builder UX Polish
**Goal:** "Grandson can show grandma everything." Simpler than Wix for basic operations.
**Definition of Done:**
- Section sidebar navigator with visual indicators
- Section highlight on select (dashed orange border)
- Quick actions (move up/down, duplicate, delete) accessible
- Global undo/redo across all section operations
- Named project save/load via IProjectRepository
- First-time tooltips guide new users
- Entire builder UX feels intuitive and polished

**Research Requirements:**
- Tooltip/tour library options (within approved deps or custom)
- Accessibility audit checklist (WCAG 2.1 AA)
- UX patterns from Framer/Webflow for section management

**Deliverables:** Section sidebar navigator, highlight system, quick action buttons, undo/redo for sections, project save/load, tooltips, a11y audit pass

# Phase 11: Hey Bradley Website + Enhanced Demos

**Prerequisite:** Phase 10 CLOSED (80/100)
**Goal:** Build the public-facing hey-bradley.com sections AND dramatically improve the chat/listen demo experiences with realistic simulated requirements that visibly transform the site.

---

## Scope

Phase 11 builds two things:
1. **Website sections** — static pages about Hey Bradley (About, Open Core, How I Built This, Docs)
2. **Enhanced demos** — the chat and listen modes need to feel REAL with plain English requirements that produce significant visible changes (5+ sections affected per demo)

### Key Principle
The animated landing page stays. Chat + Listen are canned demos with clear "Add your API key" placeholders. Build the FULL version — the open-source cut happens later at the LLM/DB boundary.

---

## Sprint Plan

### Sprint 1: Enhanced Chat Demo (P0, 3-4 hrs)
- Add "Simulated Requirements" buttons in chat — plain English prompts like:
  - "I want a modern fitness studio website with dark theme, pricing, testimonials"
  - "Build me a cozy bakery site with warm colors and a menu section"
  - "Create a professional consulting firm landing page"
- Each simulated requirement triggers 5+ section changes with typewriter animation
- Changes should be dramatic: theme switch + add/modify 5+ sections + color change + content update
- More colorful, more simple — forget about "selling", focus on visual impact

### Sprint 2: Enhanced Listen Demo (P0, 2-3 hrs)
- Listen mode "Watch a Demo" should show the full journey: voice caption → site builds section by section
- At least 3 different listen demos with different site types
- Each demo affects 5+ sections with visible transformations
- Orb animation should pulse in sync with caption changes

### Sprint 3: Brand + Design Locks (P0, 2 hrs)
- Brand image lock: when enabled, logo/favicon/ogImage can't be changed
- Design lock: when enabled, theme colors/fonts/spacing are locked
- Per-project lock state that persists in save/load
- Visual indicator in TopBar when locks are active

### Sprint 4: Website Sections (P1, 3 hrs)
- `/about` — Bradley Ross, Harvard ALM, AISP protocol, Agentics Foundation
- `/open-core` — Two repos, what's free, what's commercial, tiers
- `/how-i-built-this` — SCC report, phase scores, agentic methodology, wiki links
- `/docs` — Getting started, section reference, theme reference

### Sprint 5: Quality Pass + Phase Close (P1, 2 hrs)
- 71+ tests passing (verify no regressions)
- Build clean
- Retrospective
- Update wiki

---

## Phase 12: Tone, Audience, and Content Depth (Post Phase 11)

| Feature | Priority | Notes |
|---------|----------|-------|
| Tone selector (Professional, Casual, Bold, Minimal) | P0 | Same importance as theme — affects all generated copy |
| Target audience picker (B2B, B2C, Creative, Technical) | P0 | Drives content suggestions and spec language |
| Blog section type | P0 | Multi-article layout with images, dates, categories |
| Content suggestions based on tone+audience | P1 | AI-ready prompts for each section |
| Theme creation wizard | P1 | Pick colors, preview live, save as custom theme |
| Section template marketplace | P2 | Browse community JSON templates |
| Export specs as ZIP | P2 | Download all 6 specs + JSON |

---

## Phase 13: Advanced Features + More Examples

| Feature | Priority | Notes |
|---------|----------|-------|
| 10+ new examples across industries | P0 | Healthcare, education, restaurant, real estate, etc. |
| Blog article editor with markdown | P0 | Create multi-section blog posts |
| Image gallery with upload + effects | P1 | Drag-drop reorder, crop, filter |
| Custom section builder | P1 | Create new section types from templates |
| A/B variant testing | P2 | Compare two variants side by side |
| Multi-page support | P2 | Beyond single-page — header/footer shared |

---

## Phase 14: Copy + Content Polish

| Feature | Priority | Notes |
|---------|----------|-------|
| Brand voice guide in specs | P0 | Tone, vocabulary, do's/don'ts in spec output |
| Blog value articles (5+) | P0 | Why specs matter, telephone game, AI dev workflow |
| Copywriting assistant (pre-LLM) | P1 | Template-based copy suggestions per section |
| SEO content scoring | P1 | Grade titles, descriptions, headings |
| Accessibility report in specs | P1 | WCAG compliance check in Build Plan |
| Print-friendly spec export | P2 | PDF-style spec formatting |

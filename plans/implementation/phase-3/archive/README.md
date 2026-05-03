# Phase 3: Onboarding + Full-Page Preview + Builder UX

**North Star:** A user lands on Hey Bradley, picks a theme, sees a full multi-section website with navigation, and can customize every section. This is the POC milestone.

**Status:** COMPLETE (2026-03-30)
**Prerequisite:** Phase 2 COMPLETE (2026-03-30)
**Authority:** `updated-north-star.md` v4.0.0

---

## Phase 3 Goal

Turn Hey Bradley from a "section editor" into a "website builder." The capstone judge should see:
1. A landing page where you pick a theme
2. A full stacked website appearing in the preview
3. The ability to customize any section
4. A professional builder experience

**DoD:** A grandmother selects a theme on the onboarding page, lands in the builder with 5+ pre-filled sections, sees them stacked as a complete website with a navbar, reorders them, and previews the full page.

---

## Sub-Phases

| # | Focus | Priority | Key Deliverables |
|---|-------|----------|-----------------|
| 3.1 | Onboarding Page | P0 | `/` route with 10 theme cards, "Start from scratch", navigate to `/builder` |
| 3.2 | Navbar Section | P0 | Navbar renderer (logo + anchor links from enabled sections), SIMPLE editor |
| 3.3 | Full-Page Preview | P0 | Toggle hides panels, shows all enabled sections stacked with navbar |
| 3.4 | Section Variants | P1 | 2nd variant per non-hero section (FeaturesCards, CTASplit, FAQTwoCol, etc.) |
| 3.5 | Drag-and-Drop Reorder | P1 | @dnd-kit for section reordering in left panel |
| 3.6 | Builder UX Polish | P2 | Section highlight on click, tooltips, first-time hints |

---

## Checklist

### 3.1 Onboarding Page (P0)
- [ ] Route `/` renders the onboarding page
- [ ] 10 theme cards with mini-previews (use actual theme colors/fonts)
- [ ] Click theme → navigates to `/builder?theme=saas` (or similar)
- [ ] "Start from scratch" option loads default config
- [ ] "Describe your site" textarea placeholder (not functional — Phase 6 LLM)
- [ ] Onboarding page looks professional (not a grid of buttons)

### 3.2 Navbar Section (P0)
- [ ] Navbar renderer component (`src/templates/navbar/NavbarSimple.tsx`)
- [ ] Auto-generates anchor links from enabled sections
- [ ] Logo text (from config or brand name)
- [ ] SIMPLE editor: logo text, which sections to show, style (transparent/solid)
- [ ] Navbar renders outside the section loop (shell element, not content section)
- [ ] Navbar JSON added to all 10 theme files

### 3.3 Full-Page Preview (P0)
- [ ] Toggle button in TopBar: "Preview" or eye icon
- [ ] Hides left + right panels, shows center canvas full-width
- [ ] All enabled sections render stacked vertically
- [ ] Navbar at top, footer at bottom
- [ ] Smooth scroll between sections
- [ ] Press Escape or click "Edit" to return to builder view

### 3.4 Section Variants (P1)
- [ ] FeaturesCards variant (bordered cards instead of flat grid)
- [ ] CTASplit variant (text left, image/illustration right)
- [ ] FAQTwoCol variant (two-column layout)
- [ ] TestimonialSingle variant (large single quote)
- [ ] ValuePropsIcons variant (icon-circle style)
- [ ] FooterMinimal variant (centered, minimal links)
- [ ] Variant selector in each section's Layout accordion

### 3.5 Drag-and-Drop Reorder (P1)
- [ ] Install @dnd-kit
- [ ] Drag handle on each section item in left panel
- [ ] Drop reorders sections in config
- [ ] Visual feedback during drag (placeholder, opacity)

### 3.6 Builder UX Polish (P2)
- [ ] Section highlight on click (dashed border in preview)
- [ ] Quick actions per section (move up/down, duplicate, delete) — already done via icons
- [ ] First-time tooltip on theme selection
- [ ] Empty state for sections panel ("Add your first section")

---

## What Phase 3 Does NOT Do

- Simulated chat/listen mode (Phase 6-7)
- XAI Docs generation (Phase 7)
- Workflow pipeline animation (Phase 7)
- Home/marketing page for Hey Bradley (Phase 8)
- Presentation flow (Phase 8)
- Expert tab content (Phase 9+)
- Real LLM integration (Phase 11+)
- Auth/database (Phase 13+)

---

## Key Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/Onboarding.tsx` | CREATE — onboarding page component |
| `src/pages/Builder.tsx` | CREATE — builder page wrapper |
| `src/App.tsx` | MODIFY — add React Router with `/` and `/builder` routes |
| `src/templates/navbar/NavbarSimple.tsx` | CREATE — navbar renderer |
| `src/components/right-panel/simple/NavbarSectionSimple.tsx` | CREATE — navbar SIMPLE editor |
| `src/components/center-canvas/RealityTab.tsx` | MODIFY — full-page preview mode |
| `src/components/shell/TopBar.tsx` | MODIFY — add preview toggle button |
| `src/store/uiStore.ts` | MODIFY — add `isPreviewMode` state |
| `src/data/themes/*.json` | MODIFY — add navbar section to all 10 themes |

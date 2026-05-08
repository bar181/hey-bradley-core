# Hey Bradley — Phase 2+ Roadmap Correction

**Date:** March 29, 2026  
**Issue:** The swarm's Phase 2 plan is too narrow. It covers CSS cleanup and media pickers but misses the original Level 2 scope: section expansion, onboarding, builder UX polish. This document corrects the roadmap.

---

## 1. THE RECONCILIATION

**Original Plan (Docs 1-6):**
```
Level 1: Core Builder (hero + JSON loop)              ← DONE
Level 2: Full Site Builder (8 sections + onboarding)   ← THIS IS NEXT
Level 3: Specification Engine (XAI Docs, specs)
Level 4: Auth & Database (Supabase)
Level 5: LLM Chat
Level 6: Voice Mode
Level 7: Enterprise Specs (AISP)
```

**What the swarm planned as "Phase 2":**
```
2.1 CSS Consolidation
2.2 Section Routing
2.3 Media Pickers
2.4 Section Editors (Features, CTA, Footer only)
2.5 Light/Dark Mode
2.6 Playwright Tests
2.7 Polish (a11y, XAI Docs, Listen mode)
```

**Problem:** The swarm's Phase 2 is a polish phase disguised as a build phase. It's missing: onboarding page, 8 section types with variants, drag-and-drop reorder, section CRUD, full-page preview, builder UX polish. That's the real Level 2.

---

## 2. CORRECTED ROADMAP

```
PHASE 2: System Polish + Section Routing (current swarm plan, refined)
  └── CSS cleanup, section routing, media pickers, light/dark, playwright
  └── This is prep work FOR the real section expansion

PHASE 3: Full Site Builder (the ORIGINAL Level 2)
  └── 8 section types in grandma mode
  └── Section CRUD (add/remove/duplicate/reorder)
  └── Onboarding page (theme selection flow)
  └── Full-page preview mode
  └── Builder UX polish (tooltips, quick actions)

PHASE 4: Specification Engine + Presentation Mode
  └── XAI Docs live generation (HUMAN + AISP views)
  └── Workflow tab mock pipeline
  └── Listen mode visual polish
  └── Accessibility dialog
  └── Capstone presentation mode

PHASE 5: Expert Mode (Pro tier in open core)
  └── Expert tab for all sections
  └── AISP viewer per section
  └── Advanced layout controls

PHASE 6+: LLM + Auth + Enterprise (deferred)
  └── Chat/Listen LLM integration
  └── Supabase auth + database
  └── Login / home / splash page
  └── Marketplace, API, SSO
```

---

## 3. PHASE 2 (CORRECTED): System Polish + Section Foundation

Keep the swarm's current Phase 2 plan but correct the scope. This phase is **prep for section expansion** — it fixes the CSS issues, builds section routing, and creates the foundation for adding 7 more section types in Phase 3.

### Sub-Phases (Corrected)

| # | Focus | Priority | Key Deliverables | Status |
|---|-------|----------|-----------------|--------|
| 2.1 | CSS Consolidation | P0 | Kill colors block, consistent text pattern, zero hardcoded white | As planned |
| 2.2 | Section Routing | P0 | Click section in left panel → right panel shows that section's SIMPLE editor. Section dropdown in right panel header. Edit overlay on preview. | As planned |
| 2.3 | Section Editors (SIMPLE) | P0 | **All 8 section types** have a SIMPLE tab editor (not just Features/CTA/Footer). Even if sections 4-8 are basic, they must have: copy editing, component toggles, variant selector. | **EXPANDED from original** |
| 2.4 | Media Pickers | P1 | Image/video selection dialogs, gradient picker | As planned |
| 2.5 | Light/Dark Mode | P1 | Per-theme palette pairs, system preference detection | As planned |
| 2.6 | Section CRUD | P1 | Add section (dropdown picker), remove, duplicate. Reorder via arrows (drag-and-drop deferred to Phase 3). | **NEW — moved from Phase 3** |
| 2.7 | Playwright + Polish | P2 | Full test suite, a11y basics, Google Fonts loading | As planned |

### What's Different from the Swarm's Plan

| Swarm's Plan | Correction |
|-------------|-----------|
| Section Editors: "Features, CTA, Footer" only | **All 8 section types** need at least a basic SIMPLE editor |
| No section CRUD | **Add section CRUD** (add/remove/duplicate) — this is core to the builder |
| No mention of section schemas | Each new section type needs a Zod schema + JSON template + renderer |

### What Phase 2 Does NOT Do

- Does NOT build onboarding page (Phase 3)
- Does NOT build drag-and-drop reorder (Phase 3)
- Does NOT build full-page preview mode (Phase 3)
- Does NOT build expert tab content (Phase 5)
- Does NOT build accessibility dialog (Phase 4)
- Does NOT add login/auth/database (Phase 6+)
- Does NOT add XAI Docs live generation (Phase 4)

---

## 4. PHASE 3: FULL SITE BUILDER (Original Level 2)

This is the big one — it turns Hey Bradley from a "hero editor" into a "website builder."

### 3.1 Section Types + Variants

| Section | Variants (Grandma Mode) | SIMPLE Tab Content |
|---------|------------------------|-------------------|
| **Hero** | centered, split-right, split-left, overlay, minimal | ✅ Done in Phase 1 |
| **Features** | grid-3col, grid-4col, cards | Icon picker, title, description per feature |
| **Pricing** | 2-tier, 3-tier | Tier name, price, period, features list, CTA |
| **CTA** | simple, split, gradient | Heading, subheading, button text, background |
| **Footer** | simple, multi-column | Column headings, links, social icons, copyright |
| **Testimonials** | cards, quote-single | Quote text, author name, role, avatar URL |
| **FAQ** | accordion, two-column | Question/answer pairs (add/remove) |
| **Value Props** | icons-text, numbers | Icon, value/number, label, description |

### 3.2 Onboarding Page

A splash page at `/` with:
- Theme selection grid (10 themes with mini-previews)
- "Describe your site" textarea (placeholder for LLM — Phase 6)
- "Start from scratch" button
- Clicking a theme → navigates to `/builder` with that theme applied

### 3.3 Builder UX

- Drag-and-drop section reorder (@dnd-kit)
- Full-page preview mode (hides panels, shows complete page)
- Section highlight on click (dashed border)
- Quick actions per section (move up/down, duplicate, delete)
- First-time tooltips (optional, if time)

### 3.4 DoD

```markdown
## Phase 3: Full Site Builder
- [ ] All 8 section types render from JSON with at least 2 variants each
- [ ] Each section has a SIMPLE tab editor with copy + component toggles
- [ ] Section add/remove/duplicate/reorder all work
- [ ] Onboarding page with theme selection navigates to builder
- [ ] Full-page preview mode shows complete multi-section page
- [ ] Drag-and-drop reorder works
- [ ] A grandmother can build a 5-section marketing site in under 3 minutes
```

---

## 5. PHASE 4: SPECS + PRESENTATION MODE (Capstone Focus)

| Feature | Details |
|---------|---------|
| XAI Docs HUMAN view | Specs generated from current JSON (North Star, Architecture, Implementation Plan) |
| XAI Docs AISP view | `@aisp` formatted spec from JSON |
| Workflow tab | Mock pipeline with animated step progression |
| Listen mode visual | Red orb polish, dark overlay, START LISTENING |
| Accessibility dialog | Doc 07: appearance, textScale, contrast, reduceMotion, a11yWidget |
| Presentation mode | Full-screen demo mode for capstone defense — walkthrough sequence |

---

## 6. PHASES 5-6+ (Deferred — Open Core Model)

| Phase | Focus | Open Core Tier | Defer Until |
|-------|-------|---------------|-------------|
| 5 | Expert mode for all sections | Pro | After capstone |
| 6 | Chat/Listen LLM integration | Community (basic) / Pro (advanced) | After capstone |
| 6+ | Supabase auth + database | Pro | After capstone |
| 6+ | Login / home / splash page (authenticated) | Pro | After capstone |
| 6+ | Marketplace, white label, API, SSO | Enterprise | Way after capstone |

**Login and database are intentionally deferred.** The open core version works entirely client-side with localStorage. Supabase auth + persistence is a Pro tier feature that comes after the capstone demo.

---

## 7. SWARM INSTRUCTIONS FOR PHASE 2

**Paste to swarm (<300 words):**

Phase 2 scope is CORRECTED. The original plan was too narrow — it missed section editors for all 8 types and section CRUD. Here is the updated scope:

**P0 (do first):**
1. CSS Consolidation — kill the old `colors` block, standardize text color pattern, zero hardcoded whites. This unblocks all section work.
2. Section Routing — clicking a section in left panel updates right panel to show THAT section's editor. Section name + variant in right panel header. This unblocks section editors.
3. Section Editors — build SIMPLE tab editors for ALL 8 section types. Hero is done. Features, Pricing, CTA, Footer need: copy inputs, component toggles, variant selector. Testimonials, FAQ, Value Props need at minimum: copy inputs and component toggles. Each section needs a Zod schema and JSON template.

**P1 (do second):**
4. Section CRUD — "Add Section" button opens a picker showing all 8 types. Remove section with confirmation. Duplicate section. Reorder via up/down arrows (drag-and-drop deferred to Phase 3).
5. Light/Dark mode — per-theme palette pairs, system preference detection.
6. Media Pickers — image/video selection dialogs with thumbnail previews.

**P2 (do if time):**
7. Playwright full test suite for all Phase 2 features.
8. Google Fonts proper loading (currently using system fallbacks).
9. Basic polish and UX cleanup.

**Architecture constraint:** Every new section type follows the same pattern: `src/data/themes/*.json` has a section entry with `enabled`, `variant`, `components[]`. `src/templates/{section}/schema.ts` has the Zod schema. `src/templates/{section}/{Variant}.tsx` has the renderer. `src/components/right-panel/simple/Section{Type}Simple.tsx` has the SIMPLE tab editor.

**After Phase 2:** Update implementation plan. Request human review. Phase 3 is the onboarding page + drag-and-drop + full-page preview + builder UX polish.
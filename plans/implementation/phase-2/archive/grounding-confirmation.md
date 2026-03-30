# Hey Bradley — Phase 2 Grounding Confirmation

**Date:** 2026-03-30
**Purpose:** Confirm project understanding, progress to date, remaining Phase 2 work, and next steps toward MVP.

---

## 1. Project Confirmation — What Is Hey Bradley?

Hey Bradley is a **JSON-driven marketing website specification platform** for Bradley Ross's Harvard capstone project. It is NOT a website builder — it produces two outputs: a live visual preview and enterprise-grade AISP specification documents.

### Pipeline Position
```
Ideation → Hey Bradley → Specs + JSON → Claude Code / Agentic System → Production Site
```

### MVP Definition (Capstone Demo)
The MVP intersects Phases 3 + 4. The capstone demo must demonstrate:
- 8 section types working with SIMPLE editors (Phase 2)
- Onboarding page with theme selection (Phase 3)
- Full-page preview mode (Phase 3)
- Presentation mode for demo defense (Phase 4)
- XAI Docs generating specs from JSON (Phase 4)
- 3 demo preset websites (Phase 4)
- Listen mode visual working (Phase 4)

### Quality Bar
Stripe/Linear/Vercel quality. Must look like a funded startup product, not a student project. "Wow factor" is the primary success criterion.

### Tech Stack
Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Zustand + Zod. No unapproved packages.

---

## 2. 7-Level Roadmap (Corrected per human-1.md)

| Level | Phase | Focus | Status |
|-------|-------|-------|--------|
| 1 | Phase 1 | Core Builder (hero + JSON loop) | **COMPLETE** (2026-03-29, 77%) |
| 2 | **Phase 2** | **System Polish + ALL 8 Section Editors + CRUD** | **IN PROGRESS** |
| 2 | Phase 3 | Onboarding + Drag-and-Drop + Builder UX | Next |
| 3 | Phase 4 | Specs + Presentation Mode + Accessibility | Capstone demo |
| 4 | Phase 5 | Expert Mode (Pro tier) | Post-capstone |
| 5-7 | Phase 6+ | LLM + Auth + Enterprise | Future |

**Key correction (human-1.md):** The swarm's original Phase 2 was too narrow (CSS cleanup + 3 editors). Expanded to ALL 8 section types + section CRUD. Onboarding and drag-and-drop moved to Phase 3.

---

## 3. Progress to Date — Phase 2

### Completed Sub-Phases

| Sub-Phase | Status | Commit | Key Deliverables |
|-----------|--------|--------|-----------------|
| **2.1 CSS Consolidation** | DONE | `713a095` | Removed `colors` backward-compat from `resolveColors.ts`, palette-only system |
| **2.2 Section Routing** | DONE | `b07b520` | `SimpleTab.tsx` dispatches per-type editor, `selectedContext` in uiStore |
| **2.3 ALL 8 Section Editors** | DONE | `b07b520` | 8 renderers + 8 SIMPLE editors (Hero, Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props) |
| **2.4 Section CRUD** | DONE | `05d162b` | add, remove, duplicate, reorder, toggle enabled. Drag-and-drop deferred to Phase 3 |
| **2.5 Light/Dark Mode** | DONE | `0c1bac1` | `toggleMode()` swaps palettes, persists in localStorage |

### UI Fixes Completed
- Harvard crimson brand colors site-wide (`c5b33ef`, `10c6226`)
- Deleted stale `tailwind.config.js` (`10c6226`)
- Builder chrome dark/light panel separation (`e2b2b42`)
- Palette + font moved to Expert tab (`a29db52`)
- Hero Style accordion with typography + color pickers (`599de5c`)
- Min 12px fonts + Visuals accordion + layout 2-col grid (`b7f4f01`)

### Audits Completed (2026-03-29)
- **UI/UX Audit:** 3.4/5 overall. Dark mode colors correct. Light mode preview contrast needs work. 9 font violations at 11px (fixed to 12px in `b7f4f01`). Layout solid. Interaction partially wired.
- **Accessibility Audit:** 53/62 contrast passes, 8 font size violations, 2 focus indicator gaps, 5 missing ARIA labels, no skip link, no `<nav>` landmarks.
- **Grounding doc created** for session continuity.

### Current Scores
- Phase 1 close: **77%**
- UI/UX audit: **3.4/5** (68%)
- Living checklist estimate: **~82%** (92/112 checks passing)

---

## 4. Phase 2 — Remaining Items

### 2.6 Media Pickers (P1) — NOT STARTED
- [ ] `MediaPickerDialog.tsx` — shared shadcn Dialog for images/videos
- [ ] Image mode: thumbnails from `media.json` with category filter
- [ ] Video mode: video thumbnails/previews
- [ ] "Add URL" tab for custom URLs with preview
- [ ] Gradient picker: 5-6 presets + custom angle
- [ ] Wire into Layout accordion (replace plain URL inputs)
- Upload deferred to Phase 6+ (requires Supabase)

### 2.7 Tailwind/shadcn Audit + Playwright + Polish (P2) — PARTIALLY STARTED
**Tailwind/shadcn Audit:**
- [ ] Audit theme JSON `style` blocks for hardcoded hex that should reference palette
- [ ] Audit renderers for inline `style={{}}` except gradients/dynamic URLs
- [ ] Ensure all interactive elements use shadcn components
- [ ] Document pattern: JSON stores semantic tokens, renderers map to Tailwind classes

**Playwright:**
- [ ] Visual agent: screenshots all 10 themes + all 8 sections + all tabs
- [ ] Functional agent: theme switch, copy edit, toggle, nav, undo, persistence
- [ ] Integrity agent: no broken renders, no console errors, no white-on-white
- [ ] Target: zero P0 failures, fewer than 5 P1 failures

**Polish:**
- [ ] Google Fonts dynamic loading from fonts.json URLs
- [ ] Section highlight on click (dashed border in preview)

### Known Bugs / Technical Debt
1. **`addSection()` defaults are bare-bones** — new sections get `content: {}` and hardcoded `#1E1E1E` instead of theme-aware defaults
2. **Only one variant per non-hero section** — plan calls for 2 variants each (e.g., FeaturesCards, CTASplit, FAQTwoCol)
3. **Font cascade incomplete** — `useThemeVars` sets `--theme-font` but not all renderers pick it up
4. **Dead `colors` block in theme JSONs** — `resolveColors.ts` cleaned up but JSONs may still have it
5. **No automated test coverage** for any Phase 2 work
6. **Accessibility gaps** — 3 unnamed buttons, missing `aria-label` on chat input, no skip link, no `<nav>` landmarks, 2 buttons missing focus indicators
7. **Light mode preview contrast** — theme text colors don't adapt to light chrome mode
8. **Interaction audit failures** — inline editor inputs and component toggles not found by Playwright (may be a wiring issue or different UX pattern)

---

## 5. Open Questions for Bradley

### Scope Decisions

1. **Media Pickers (2.6) — do now or defer to Phase 3?**
   The builder works with plain URL inputs. Deferring would let Phase 2 close faster and move to onboarding/preview sooner.

2. **Playwright scope — full suite or smoke tests?**
   Full visual regression across 10 themes x 8 sections is expensive. Should we scope to smoke tests (theme switch, CRUD, basic rendering) for Phase 2 close and expand in Phase 3?

3. **Second variants per section type — Phase 2 or Phase 3?**
   Currently one variant per non-hero section. Adding FeaturesCards, CTASplit, FAQTwoCol, etc. could be Phase 2 or deferred.

4. **`addSection()` defaults — inherit from theme or use generic templates?**
   New sections render as empty dark boxes. Should they pull sample content from the current theme's JSON, or use a per-type generic template?

### Design Decisions

5. **Harvard crimson builder chrome — final brand direction?**
   Currently using Harvard crimson. Should builder chrome be theme-neutral (slate/gray) instead?

6. **Expert tab — visible now or hidden until Phase 5?**
   Palette + font selectors already moved there. Show the tab with just those two controls, or hide until Phase 5?

7. **Navbar section — promote to Phase 3.1?**
   Listed as Phase 3.5 but essential for full-page preview with navigation. Should it be part of Phase 3 core?

### Interaction Audit Issue

8. **Editor inputs + component toggles not detected by Playwright.**
   The UI/UX audit couldn't find inline headline inputs or toggle switches. Are these implemented behind a different UX pattern (click-to-edit, modal), or are they not yet wired?

---

## 6. Recommended Next Steps

### Option A: Close Phase 2 Quickly (Recommended)
1. **Defer Media Pickers (2.6) to Phase 3** — URL inputs work fine
2. **Defer second variants to Phase 3** — one variant per type is sufficient for now
3. **Fix `addSection()` defaults** — use per-type generic templates with sample content
4. **Run smoke Playwright tests** — theme switch, section CRUD, basic rendering
5. **Fix P0 accessibility issues** — unnamed buttons, chat input label, focus indicators
6. **Close Phase 2** → move to Phase 3 (onboarding + full-page preview)

### Option B: Complete Phase 2 Fully
1. Build Media Pickers (2.6)
2. Add second variants for all 7 non-hero sections
3. Full Playwright test suite
4. Fix all accessibility issues (P0 + P1)
5. Close Phase 2 → Phase 3

### MVP Timeline (from Phase 2 close)
```
Phase 2 close (current) → Phase 3 (2-3 days) → Phase 4 (2-3 days) = ~1 week to MVP
```

---

## 7. Architecture Quick Reference

### Key Files
| File | Purpose |
|------|---------|
| `src/store/configStore.ts` | All state: patches, CRUD, undo/redo, theme switching |
| `src/store/uiStore.ts` | UI state: selected context, preview width, panel visibility |
| `src/lib/resolveColors.ts` | Maps 6-slot palette to CSS custom properties |
| `src/components/right-panel/SimpleTab.tsx` | Dispatch hub for per-type SIMPLE editors |
| `src/components/center-canvas/RealityTab.tsx` | Preview renderer — dispatches sections |
| `src/data/themes/*.json` | 10 complete theme JSON files |

### Section Architecture Pattern
```
src/data/themes/*.json          → section entry with enabled, variant, components[]
src/templates/{type}/schema.ts  → Zod schema for section content
src/templates/{type}/{Variant}.tsx → Renderer component
src/components/right-panel/simple/Section{Type}Simple.tsx → SIMPLE tab editor
```

### How Themes Work
`applyVibe(themeName)` does a **full JSON replacement** of the entire MasterConfig. Each theme JSON is a complete config with its own sections, variants, palette, typography, and layout.

### How Colors Work
6-slot palette (ADR-019) → `useThemeVars()` → CSS custom properties (`--theme-bg`, `--theme-surface`, etc.) → Tailwind classes reference vars → Builder chrome uses separate `hb-*` classes.

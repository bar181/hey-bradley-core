# Phase 2: System Polish + Section Expansion

**Status:** PLANNED — awaiting human review
**Prerequisite:** Phase 1 COMPLETE
**Principle:** Grandma-first. Polish before expansion. One text color pattern.

---

## Goal

Make the builder feel like a real product: section-specific editing, media pickers, consistent CSS, automated tests. Then expand to Features, CTA, and Footer sections in SIMPLE tab.

---

## Phase 2 Checklist

### 2.1 — CSS Consolidation (P0)
- [ ] Kill `colors` block in theme JSONs — palette only
- [ ] One text color pattern: `color: section.style.color` on `<section>`, `text-inherit` children
- [ ] Remove unused `text-theme-text` / `text-theme-muted` classes from renderers
- [ ] Audit: zero hardcoded `text-white` or `border-white` outside HeroOverlay

### 2.2 — Section Routing (P0)
- [ ] Right panel shows editor for the SELECTED section (not always hero)
- [ ] Click section in left panel → right panel switches context
- [ ] Click section in main preview → right panel switches (edit icon overlay)
- [ ] Right panel header dropdown to select section

### 2.3 — Media Pickers (P1)
- [ ] Image picker dialog: thumbnail grid from media.json library (50 images)
- [ ] Video picker dialog: thumbnail grid from media.json library (20 videos)
- [ ] "Add URL" option in picker dialogs (paste custom URL)
- [ ] Gradient picker for section backgrounds
- [ ] Image/video upload → Phase 5 (requires Supabase)

### 2.4 — Section Editors (P1)
- [ ] Features section SIMPLE tab editor (icon, title, description per card)
- [ ] CTA section SIMPLE tab editor (heading, subtitle, button)
- [ ] Footer section SIMPLE tab editor (columns, links, copyright)

### 2.5 — Light/Dark Mode (P1)
- [ ] Per-theme light/dark palette pairs in theme JSONs
- [ ] toggleMode() swaps palette (not just mode flag)
- [ ] Preview respects system preference on first load

### 2.6 — Testing (P1)
- [ ] Extend Playwright: theme switch, layout change, copy edit, toggle, responsive
- [ ] Playwright screenshots for all 10 themes × 8 layouts
- [ ] Automated rubric scoring

### 2.7 — Polish (P2)
- [ ] Accessibility dialog (doc 07 spec)
- [ ] XAI Docs live generation from config
- [ ] Listen mode visual polish (red orb, dark overlay)
- [ ] Google Fonts dynamic loading from fonts.json URLs

---

## MVP Backlog (Presentation Mode)

The MVP is a Harvard capstone demo. It needs a "wow" presentation mode.

| Feature | Phase | Priority |
|---------|-------|----------|
| Presentation mode: full-screen preview with slide transitions | MVP | P0 |
| Section expansion: Pricing, Testimonials, FAQ, Value Props | 3 | P0 |
| Expert tab content for all section types | 4 | P1 |
| AISP viewer per section in expert tab | 4 | P1 |
| Chat mode: describe changes in natural language | 5 | P0 |
| Listen mode: voice-to-spec, real-time preview updates | 5 | P0 |
| Supabase auth + cloud persistence | 5 | P1 |
| Image/video upload to cloud storage | 5 | P2 |
| Template marketplace / theme gallery | 6+ | P2 |

---

## Architecture Notes

- Phase 2 builds ON Phase 1 — no rewrites, only extensions
- Section editors follow the same 3-accordion pattern: Layout → Style → Content
- Each section type will need its own `SectionSimple` variant (or a generic one driven by JSON schema)
- Media picker is a shared dialog component used by all section editors

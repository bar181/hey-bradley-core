# Phase 1.3 — Hero Polish & Presets — Backlog Items

## Queued for Phase 1.3

### From 07.accessibility-button.md
- **Master Settings & Accessibility Dialog** — Global settings dialog accessible from TopBar gear icon
  - Appearance (light/dark), Text Scale (default/large/accessible), Contrast (standard/enhanced/high)
  - Reduce Motion toggle, A11y Widget export flag
  - Schema: `masterConfig.settings` root-level object (additive)
  - WCAG 2.2 AA compliance for the dialog itself
  - Spec location: `/plans/initial-plans/07.accessibility-button.md`
  - **Note:** Doc references "warm cream" builder chrome (ADR-009) — update to Dark Slate per ADR design pivot

### From 03.implementation-plan.md Phase 1.3
- All 5 hero variants (centered, split, overlay, full-image, minimal)
- 6-8 preset hero configs (one per vibe variation)
- Responsive preview toggle (mobile/tablet/desktop device icons)
- Undo/redo (Zustand middleware, Ctrl+Z / Ctrl+Shift+Z)
- LocalStorage auto-save (debounced 2s) via IProjectRepository
- JSON export/import buttons in DATA tab
- Reset to default button

## Priority Order for Phase 1.3
1. configStore + Zod schemas (foundation for all Phase 1.1+ work)
2. HeroCentered wired to configStore (renders from JSON, not hardcoded)
3. Bidirectional DATA tab sync
4. Hero variants
5. Undo/redo
6. Auto-save
7. JSON export/import
8. Accessibility dialog (from 07.accessibility-button.md)
9. Responsive preview

---

## Phase 1.3e Completion Log (2026-03-29)

### Completed
- [x] 10 invisible-design themes (SaaS, Agency, Portfolio, Blog, Startup, Personal, Professional, Wellness, Creative, Minimalist)
- [x] ADRs 017-020 (invisible naming, meta schema, 6-slot palette, component visibility matrix)
- [x] Research doc: `docs/research/theme-and-hero-research.md`
- [x] 6-slot palette system with backward compat (`palette` + `colors` in every theme JSON)
- [x] 4 alternative palettes per theme (50 total in `palettes.json`)
- [x] `fonts.json` (5 fonts), `media.json` (image/video URLs per theme)
- [x] Theme registry (`src/data/themes/index.ts`)
- [x] `resolveColors.ts` bridge function
- [x] `configStore.ts` — new imports, `applyPalette()`, `applyFont()`, `toggleMode()`
- [x] Zod schema updated for palette + meta + alternativePalettes
- [x] ThemeSimple.tsx — 2-column grid, meta-driven, accurate previews
- [x] PaletteSelector.tsx — 5 rows x 6 dots
- [x] FontSelector.tsx — 5 font buttons
- [x] Light/dark toggle
- [x] Hero renderers use `resolveColors()` (HeroCentered, HeroOverlay, HeroMinimal)
- [x] Old 10 theme files deleted
- [x] Build passes clean

### Phase 1.3e Hotfix (2026-03-29)
- [x] Fixed HeroCentered: now renders inline heroImage below content (was missing)
- [x] Fixed HeroSplit: uses resolveColors for CTA button (was hardcoded to check bg color)
- [x] Fixed HeroSplit: checks `enabled` flag on heroImage component
- [x] ThemeSimple: refactored to accordion layout (Theme Presets, Color Palette, Font, Mode)
- [x] PaletteSelector: fixed active state detection (compares bgPrimary + accentPrimary)
- [x] Creative theme: fixed broken video URL (857251 → 1093662)
- [x] Media library expanded: 50 images + 20 videos in `media.json`
- [x] Light/dark mode: deferred to Phase 1.4 (placeholder in accordion)

### Debt (carry to Phase 1.4+)
- [ ] **Light/dark mode toggle** — needs per-theme light/dark palette pairs, not just a mode flag swap
- [ ] Playwright screenshots for all 10 themes (no Playwright configured yet)
- [ ] Rubric scoring automation (manual verification only for now)
- [ ] Custom color palette picker UI (currently fixed 5 options per theme)
- [ ] Accessibility button overriding font sizes, light/dark, color count
- [ ] Theme section-level style updates on palette swap (gradients preserved, flat colors updated)
- [ ] Google Fonts loading (URLs in fonts.json but not dynamically loaded yet)

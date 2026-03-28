# Phase 1.3 — Hero Polish & Presets — Backlog Items

## Queued for Phase 1.3

### From 07.accessibility-button.md
- **Master Settings & Accessibility Dialog** — Global settings dialog accessible from TopBar gear icon
  - Appearance (light/dark), Text Scale (default/large/accessible), Contrast (standard/enhanced/high)
  - Reduce Motion toggle, A11y Widget export flag
  - Schema: `masterConfig.settings` root-level object (additive)
  - WCAG 2.2 AA compliance for the dialog itself
  - Spec location: `/plans/intial-plans/07.accessibility-button.md`
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

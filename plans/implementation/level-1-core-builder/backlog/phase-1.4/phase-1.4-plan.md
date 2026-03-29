# Phase 1.4: Hero Simple Mode Complete

**Date:** 2026-03-29
**Goal:** Make the hero section fully functional in SIMPLE tab (grandma mode). A non-technical user can pick a theme, edit text, toggle components, see responsive preview, undo mistakes, and export JSON.
**Principle:** KISS — Tailwind utilities, no complex abstractions, research before code.

---

## Checklist

### P0 — Must Have
- [ ] 1.4.1: Copy editing fields in SIMPLE tab — headline, subtitle, CTA text, badge text with char counts
- [ ] 1.4.2: Component toggles visually show/hide in ALL 5 hero variants
- [ ] 1.4.3: Features section renders real 3-col grid (not stub text)
- [ ] 1.4.4: CTA section renders real banner (not stub text)

### P1 — Should Have
- [ ] 1.4.5: Responsive preview — 4 device widths (mobile 375px, tablet 768px, desktop 1280px, full) in TopBar
- [ ] 1.4.6: Undo/redo — Ctrl+Z / Ctrl+Shift+Z, 50+ steps
- [ ] 1.4.7: LocalStorage auto-save — debounced 2s, reload persistence, "New Project" reset

### P2 — Nice to Have
- [ ] 1.4.8: JSON export downloads `hey-bradley-project.json`
- [ ] 1.4.9: Image URL input — paste Unsplash URL → image in preview
- [ ] 1.4.10: JSON import with Zod validation

### Verification
- [ ] Build passes (`npm run build`)
- [ ] Dev server works (`npm run dev`)
- [ ] Console logs show correct state changes
- [ ] All 5 hero variants render correctly after copy edit
- [ ] Theme switch preserves user text edits
- [ ] Component toggle → visual change in preview

---

## Architecture Notes

### Copy Editing (1.4.1)
- Wire existing SIMPLE tab content section (already has inputs for headline/subtitle/CTA)
- Each input calls `configStore.setSectionConfig()` to update the component's `props.text`
- Add character count below each input (Tailwind `text-xs text-muted-foreground`)
- Use `section.components.find(c => c.id === 'headline')` pattern

### Component Toggles (1.4.2)
- Existing toggle UI in SIMPLE tab needs to call `setSectionConfig()` to flip `component.enabled`
- Each hero renderer already checks `enabled` flag (verified in 1.3e)
- Test: toggle heroImage off → image disappears, toggle back on → image appears

### Section Renderers (1.4.3, 1.4.4)
- `FeaturesSection.tsx` — read from `section.components` (f1, f2, f3 feature cards)
- `CTASection.tsx` — read from `section.components` (heading, subtitle, button)
- Use Tailwind grid/flex, no inline styles
- These already exist as stub text in RealityTab — replace stubs with real renderers

### Responsive Preview (1.4.5)
- Add device width state to configStore or local TopBar state
- Wrap center canvas in a container with `max-width` constraint
- 4 buttons: mobile (375px), tablet (768px), desktop (1280px), full (100%)

### Undo/Redo (1.4.6)
- Store already has `undo()` / `redo()` / `canUndo()` / `canRedo()`
- Wire keyboard shortcuts in AppShell: `useEffect` with `keydown` listener
- Show undo/redo buttons in TopBar with disabled state

### LocalStorage (1.4.7)
- Subscribe to configStore changes with `useConfigStore.subscribe()`
- Debounce 2s with `setTimeout` / `clearTimeout`
- On mount: check `localStorage.getItem('hey-bradley-project')`, parse, validate with Zod, load
- "New Project" button: reset to default config, clear localStorage

### JSON Export (1.4.8)
- `JSON.stringify(config, null, 2)` → `Blob` → `URL.createObjectURL` → download link
- Button in DATA tab or TopBar

---

## Phase 2+ Backlog (NOT for Phase 1.4)

| Item | Phase |
|------|-------|
| Light/dark mode with palette pairs | 2 |
| Tailwind migration for hero inline styles | 2 |
| Google Fonts dynamic loading | 2 |
| Accessibility dialog | 2 |
| XAI Docs live generation | 2 |
| Listen mode visual polish | 2 |
| Custom color palette picker | 2 |
| Playwright test suite expansion | 2 |
| 7 section types in grandma mode | 3 |
| Expert tab content | 4+ |
| Chat/Listen LLM integration | 5+ |
| Supabase auth | 5+ |

---

## Swarm Execution

| Agent | Scope | Files |
|-------|-------|-------|
| **copy-fields** | Wire SIMPLE tab copy inputs with char counts | `SectionSimple.tsx` or content section component |
| **component-toggles** | Ensure toggles update `enabled` and preview reflects | Section simple component + all hero renderers |
| **section-renderers** | Features grid + CTA banner real renderers | `FeaturesSection.tsx`, `CTASection.tsx`, `RealityTab.tsx` |
| **responsive-preview** | Device width buttons in TopBar, width constraint | `TopBar.tsx`, `RealityTab.tsx` or canvas wrapper |
| **undo-persistence** | Undo/redo shortcuts, localStorage auto-save | `AppShell.tsx`, new persistence util |
| **json-export** | Export/import buttons + image URL input | `DataTab.tsx` or TopBar |

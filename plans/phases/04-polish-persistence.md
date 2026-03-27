# Phase 1.3: Hero Polish + Persistence

**Status:** NOT STARTED
**Estimated Agents:** 7 (parallel)
**Blocked By:** Phase 1.2
**Unblocks:** Level 2

---

## Agent Assignment

| Agent | Responsibility | Files |
|-------|---------------|-------|
| hero-split-agent | HeroSplit variant | `templates/hero/HeroSplit.tsx` |
| hero-overlay-agent | HeroOverlay variant | `templates/hero/HeroOverlay.tsx` |
| hero-fullimg-agent | HeroFullImage variant | `templates/hero/HeroFullImage.tsx` |
| hero-minimal-agent | HeroMinimal variant | `templates/hero/HeroMinimal.tsx` |
| persistence-agent | IProjectRepository + LocalStorage | `contexts/persistence/*` |
| undo-responsive-agent | Undo/redo wiring + responsive preview | store middleware, device toggles |
| export-agent | Export/import/reset + presets | DATA tab buttons, preset configs |

---

## Checklist

### 1.3.1 — Hero Variants (4 agents)
- [ ] `src/templates/hero/HeroSplit.tsx` — Two-column: content left, image right
- [ ] `src/templates/hero/HeroOverlay.tsx` — Background image with text overlay
- [ ] `src/templates/hero/HeroFullImage.tsx` — Full-bleed image with centered text
- [ ] `src/templates/hero/HeroMinimal.tsx` — Text only, maximum whitespace
- [ ] All variants render from same hero schema
- [ ] All look professional with default config

### 1.3.2 — Persistence (persistence-agent)
- [ ] `src/contexts/persistence/interfaces/IProjectRepository.ts`
  - `getProject(id): Promise<MasterConfig | null>`
  - `saveProject(config): Promise<void>`
  - `listProjects(): Promise<ProjectSummary[]>`
  - `deleteProject(id): Promise<void>`
  - `getTemplates(category?): Promise<VibePreset[]>`
- [ ] `src/contexts/persistence/adapters/localStorageAdapter.ts`
  - Implements IProjectRepository
  - Uses localStorage with JSON serialization
  - Handles storage quota errors gracefully
- [ ] Auto-save: debounced 2s via configStore.subscribe()
- [ ] NO direct `localStorage.getItem()` in components

### 1.3.3 — Undo/Redo + Responsive (undo-responsive-agent)
- [ ] Undo/redo keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- [ ] 50+ step history confirmed
- [ ] Responsive preview: device toggle constrains preview width
  - Phone: 375px, Tablet: 768px, Desktop: 1280px, Ultra: 100%

### 1.3.4 — Export/Import/Reset (export-agent)
- [ ] JSON export button in DATA tab → downloads `.json` file
- [ ] JSON import button → file picker → Zod validates → loads
- [ ] Reset to default button → confirms → loads default config
- [ ] 6-8 preset hero configs (one per vibe variation)

---

## Testing

- [ ] `tests/contexts/persistence/localStorageAdapter.test.ts`
- [ ] `tests/templates/hero/HeroSplit.test.ts`
- [ ] `tests/templates/hero/HeroOverlay.test.ts`
- [ ] `tests/store/undoMiddleware.test.ts` — 50+ step depth
- [ ] `tests/integration/persistence.test.ts` — Save → reload → data intact

---

## Exit Criteria
- [ ] All 5 hero variants look professional
- [ ] Undo/redo works for 50+ steps
- [ ] Auto-save persists across page reloads
- [ ] JSON export produces valid importable file
- [ ] Responsive preview constrains width correctly
- [ ] All tests pass
- [ ] **Level 1 complete — human review before Level 2**

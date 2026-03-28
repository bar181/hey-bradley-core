# Level 1: Core Builder — Living Requirements Checklist

**Last Updated:** 2026-03-28, Session 4
**Total Requirements:** 52 | **Complete:** 31 | **In Progress:** 3 | **Deferred:** 2 | **Remaining:** 16

---

## Phase 1.0 — Shell & Navigation (COMPLETE)

| # | Requirement | Status | Session | Notes |
|---|------------|--------|---------|-------|
| 1.0.1 | Vite + React + TS + Tailwind scaffold | DONE | S1 | Clean build |
| 1.0.2 | Path aliases (@/*) | DONE | S1 | tsconfig + vite.config |
| 1.0.3 | AppShell + TopBar (logo, name, badge) | DONE | S1 | Dark slate theme |
| 1.0.4 | LISTEN/BUILD toggle | DONE | S1 | In TopBar |
| 1.0.5 | Three-panel resizable layout | DONE | S1 | react-resizable-panels |
| 1.0.6 | Center tabs (REALITY, DATA, XAI DOCS, WORKFLOW) | DONE | S1 | Active styling works |
| 1.0.7 | StatusBar (monospace, indicators) | DONE | S1 | Shows tab + READY |
| 1.0.8 | ChatInput (mic + text + send) | DONE | S1 | Pinned at left panel bottom |
| 1.0.9 | Left panel: flat navigation list | DONE | S3 | Theme + section rows |
| 1.0.10 | Right panel: SIMPLE/EXPERT tabs | DONE | S3 | 5-accordion hierarchy |
| 1.0.11 | Left-to-right context wiring | DONE | S3 | Click Theme/Hero → right updates |
| 1.0.12 | Dark Precision design system | DONE | S2 | Slate-900 bg, blue-500 accent |
| 1.0.13 | All 4 tab placeholders render | DONE | S1 | Reality, Data, XAI, Workflow |
| 1.0.14 | Premium hero preview | DONE | S3 | Glassmorphism, gradient text |
| 1.0.15 | Zero console errors | DONE | S1 | Playwright verified |
| 1.0.16 | Production-quality visual | DONE | S3 | Reviewed by 3rd party |

**Phase 1.0 Score: 55/64 (86%)**

---

## Phase 1.1 — Hero + JSON Core Loop (COMPLETE w/ HOTFIX)

| # | Requirement | Status | Session | Notes |
|---|------------|--------|---------|-------|
| 1.1.1 | Zod schemas (layout, style, section, masterConfig, patch) | DONE | S4 | 6 schema files |
| 1.1.2 | Type exports via z.infer (no manual duplication) | DONE | S4 | |
| 1.1.3 | configStore (applyPatch, setSectionConfig, CRUD) | DONE | S4 | Full Zustand store |
| 1.1.4 | Deep merge utility (ADR-007 rules) | DONE | S4 | Objects merge, arrays replace |
| 1.1.5 | Undo/redo (100-state history) | DONE | S4 | In configStore, not yet keyboard-wired |
| 1.1.6 | HeroCentered renders from configStore | DONE | S4 | CSS from JSON, not hardcoded |
| 1.1.7 | DataTab: live JSON display | DONE | S4 | **HOTFIX:** Rebuilt with CodeMirror 6 |
| 1.1.8 | DataTab: collapsible section blocks | DONE | S4 | Per-section with metadata |
| 1.1.9 | DataTab: edit mode with Zod validation | DONE | S4 | CodeMirror + debounce |
| 1.1.10 | DataTab: COPY + EXPORT buttons | DONE | S4 | Clipboard + JSON download |
| 1.1.11 | Right panel controls → configStore | DONE | S4 | Headline, subtitle, CTA, toggles |
| 1.1.12 | Left panel eye toggle → configStore | DONE | S4 | toggleSectionEnabled |
| 1.1.13 | Default config JSON file | DONE | S4 | src/data/default-config.json |
| 1.1.14 | Playwright visual smoke tests | DONE | S4 | 5/5 passing |
| 1.1.15 | Config change → render < 100ms | DONE | S4 | Zustand selectors |

**Phase 1.1 Score: 33/48 (69%) — DataTab items scored low due to initial broken state, now fixed**

---

## Phase 1.2 — All Tabs + Listen Mode Visual (NOT STARTED)

| # | Requirement | Status | Session | Notes |
|---|------------|--------|---------|-------|
| 1.2.1 | XAI DOCS: HUMAN view from configStore | TODO | — | |
| 1.2.2 | XAI DOCS: AISP view from configStore | TODO | — | |
| 1.2.3 | XAI DOCS: copy/export per view | TODO | — | |
| 1.2.4 | WORKFLOW: pipeline steps with states | TODO | — | Has placeholder |
| 1.2.5 | WORKFLOW: live stream output log | TODO | — | |
| 1.2.6 | Listen mode: dark overlay (#0a0a0f) | TODO | — | |
| 1.2.7 | Listen mode: red orb (3-layer CSS glow) | TODO | — | |
| 1.2.8 | Listen mode: pulse animation | TODO | — | |
| 1.2.9 | Listen mode: "START LISTENING" button | TODO | — | |
| 1.2.10 | Section click-to-select in preview | TODO | — | Dashed border |
| 1.2.11 | Features section placeholder in Reality | IN PROGRESS | S4 | Basic placeholder exists |
| 1.2.12 | CTA section placeholder in Reality | IN PROGRESS | S4 | Basic placeholder exists |
| 1.2.13 | Playwright visual tests for Phase 1.2 | TODO | — | |

---

## Phase 1.3 — Hero Polish + Presets (NOT STARTED)

| # | Requirement | Status | Session | Notes |
|---|------------|--------|---------|-------|
| 1.3.1 | All 5 hero variants | TODO | — | centered, split, overlay, full-image, minimal |
| 1.3.2 | 6-8 preset hero configs | TODO | — | |
| 1.3.3 | Responsive preview toggle | TODO | — | Mobile/tablet/desktop |
| 1.3.4 | Undo/redo keyboard shortcuts (Ctrl+Z) | TODO | — | |
| 1.3.5 | LocalStorage auto-save (debounced) | TODO | — | Via IProjectRepository |
| 1.3.6 | JSON import button | TODO | — | |
| 1.3.7 | Reset to default button | TODO | — | |
| 1.3.8 | Accessibility dialog (from 07.accessibility-button.md) | TODO | — | |
| 1.3.9 | Hero gradient text CSS fix | TODO | — | bg-clip-text not rendering |

---

## Deferred Items

| # | Item | Original Phase | Reason | Deferred To |
|---|------|---------------|--------|-------------|
| D1 | DRAFT/EXPERT mode toggle | 1.0 | Replaced by SIMPLE/EXPERT tabs in right panel | REMOVED — architecture change |
| D2 | Warm cream design system | 1.0 | Replaced by Dark Precision per ADR | REMOVED — design pivot |
| D3 | @dnd-kit drag-and-drop reorder | 1.0 | Arrow buttons sufficient, adds dependency | Phase 2.2 |
| D4 | uuid package | 1.0 | crypto.randomUUID() is native | REMOVED — not needed |
| D5 | jszip for spec export | 1.3 | Individual downloads or clipboard sufficient | Phase 3.2 (if needed) |
| D6 | AISP viewer live reactivity | 1.1 | Static AISP code in Expert tab for now | Phase 1.2 |

---

## Session History

| Session | Date | Focus | Key Deliverables |
|---------|------|-------|-----------------|
| S1 | 2026-03-28 | Scaffold + Shell | Vite project, 15 components, warm cream theme |
| S2 | 2026-03-28 | Design Pivot | Dark Precision theme, all components rebuilt |
| S3 | 2026-03-28 | UX Redesign + Polish | Unified panels, premium hero, attribution |
| S4 | 2026-03-28 | JSON Core Loop + Hotfix | configStore, schemas, DataTab rebuilt with CodeMirror |

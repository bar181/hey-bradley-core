# Level 1: Core Builder — Implementation Plan

## Overview

Level 1 establishes the visual shell, hero section with JSON core loop, all 4 center tabs, Listen Mode visual, and hero polish. This is the foundation — everything must look production-grade from day 1.

Hey Bradley is a JSON-driven marketing website specification platform built as a Harvard capstone project. The core loop is: controls change JSON, JSON drives a live preview, and the JSON tab shows real-time state. Everything flows through a single `MasterConfig` object validated by Zod schemas.

---

## Phase 1.0 — Shell & Navigation

**Goal:** Vite site running. Every navigation element works. Every page/tab has a placeholder. The shell looks like a finished product.
**Duration:** Day 1
**Blocked By:** Phase 0 (Scaffold)
**Unblocks:** Phase 1.1

### Definition of Done

- Three-panel layout renders with warm cream chrome (`#faf8f5` bg, `#e8772e` accent)
- LISTEN/BUILD and DRAFT/EXPERT toggles switch UI state
- All 4 center tabs (REALITY, DATA, XAI DOCS, WORKFLOW) navigable with active styling
- Status bar shows "READY AISP SPEC V1.2" and "MODE: DRAFT CONNECTED"
- Chat input bar renders below left panel
- All content is placeholder/static — no data wiring
- Zero console errors
- Looks like a real product, not scaffolding

### Research Requirements

- Review shadcn/ui component library for available primitives (buttons, toggles, tabs)
- Review `react-resizable-panels` API for three-panel layout (min/max widths, resize handles)
- Study mockup images in `/plans/screen-caps/` for pixel-accurate implementation
- Review warm cream design tokens in ADR-009b (`/plans/phases/adr/009b-warm-light-chrome.md`)
- Review DM Sans and monospace font pairing for UI typography

### Deliverables

| # | Deliverable | File(s) |
|---|------------|---------|
| 1 | Vite + React + TS + Tailwind + shadcn scaffold | Project root config |
| 2 | Path aliases (`@/*`) configured | `tsconfig.json`, `vite.config.ts` |
| 3 | AppShell with TopBar (logo, project name, version badge) | `src/components/shell/AppShell.tsx`, `TopBar.tsx` |
| 4 | ModeToggle (LISTEN/BUILD + DRAFT/EXPERT pill toggles) | `src/components/shell/ModeToggle.tsx` |
| 5 | PanelLayout (three resizable panels, 420/fluid/350 default) | `src/components/shell/PanelLayout.tsx` |
| 6 | TabBar (REALITY, DATA, XAI DOCS, WORKFLOW) | `src/components/center-canvas/TabBar.tsx` |
| 7 | StatusBar (monospace, 24px, READY/MODE indicators) | `src/components/shell/StatusBar.tsx` |
| 8 | ChatInput (mic + text + send) | `src/components/shell/ChatInput.tsx` |
| 9 | Draft left panel placeholder (vibe cards, section list) | `src/components/left-panel/DraftPanel.tsx` |
| 10 | Expert left panel placeholder (accordion property inspector) | `src/components/left-panel/ExpertPanel.tsx` |
| 11 | Draft right panel placeholder (headline input, layout selector) | `src/components/right-panel/DraftContext.tsx` |
| 12 | Expert right panel placeholder (layout/content/style sections) | `src/components/right-panel/ExpertContext.tsx` |
| 13 | All 4 tab placeholders (REALITY, DATA, XAI DOCS, WORKFLOW) | `src/components/center-canvas/*Tab.tsx` |

### Key Design References

- **TopBar:** Linear (minimal toolbar), Framer (project name + device toggles)
- **Mode Toggles:** Raycast (monospace pill toggles)
- **3-Panel:** VS Code (resizable panels), Cursor (Commander + Canvas + Engine Room)
- **Status Bar:** VS Code (monospace indicators)
- **Draft Panel:** Notion (card selection)
- **Expert Panel:** Framer + Figma (enterprise-density property inspector)

---

## Phase 1.1 — Hero + JSON Core Loop

**Goal:** Hero section renders from JSON. Controls change JSON. JSON tab shows live state. Bidirectional loop works.
**Duration:** Days 2-3
**Blocked By:** Phase 1.0
**Unblocks:** Phase 1.2

### Definition of Done

- Hero section renders in REALITY tab from `configStore`
- Draft controls update `configStore` and hero re-renders
- Expert controls update `configStore` and hero re-renders
- DATA tab shows full JSON with syntax highlighting, live updates
- Editing JSON in DATA tab validates via Zod and updates hero
- Preview re-render < 100ms after any change
- All tests pass

### Research Requirements

- Zustand middleware patterns for undo/redo (100-state history stack)
- Zod schema design for nested JSON structures (layout, style, content per section)
- JSON syntax highlighting approaches (custom tokenizer vs library)
- Deep merge semantics: objects merge, arrays replace, null deletes, undefined skips

### Deliverables

| # | Deliverable | File(s) |
|---|------------|---------|
| 1 | Zod schemas (layout, style, section, masterConfig, patch, hero content) | `src/lib/schemas/*.ts`, `src/templates/hero/schema.ts` |
| 2 | Type exports via `z.infer` (no manual interface duplication) | `src/types/config.ts`, `src/types/sections.ts` |
| 3 | configStore with full state management | `src/store/configStore.ts` |
| 4 | Undo middleware (100-state history) | `src/store/undoMiddleware.ts` |
| 5 | Deep merge utility | `src/lib/deepMerge.ts` |
| 6 | HeroCentered template (renders from config, CSS values from JSON) | `src/templates/hero/HeroCentered.tsx` |
| 7 | DataTab with syntax highlighting and bidirectional JSON editing | `src/components/center-canvas/DataTab.tsx` |
| 8 | Wired Draft panels (VibeCards, SectionList, DraftContext) | `src/components/left-panel/*.tsx`, `right-panel/DraftContext.tsx` |
| 9 | Wired Expert panels (ProjectExplorer, PropertyInspector, ExpertContext) | `src/components/left-panel/*.tsx`, `right-panel/ExpertContext.tsx` |

### Key Design References

- **JSON Editor:** VS Code (warm syntax highlighting)
- **Property Inspector:** Framer (enterprise-density rows)
- **Project Explorer:** VS Code (collapsible tree)
- **Section Wrapper:** Webflow (click-to-select borders)

---

## Phase 1.2 — All Tabs + Listen Mode Visual

**Goal:** All four center tabs have real content. Listen mode has theatrical dark overlay with pulsing red orb.
**Duration:** Days 3-4
**Blocked By:** Phase 1.1
**Unblocks:** Phase 1.3
**CAPSTONE DEMO CHECKPOINT** — Must be visually stunning.

### Definition of Done

- XAI DOCS shows HUMAN view with structured spec text
- XAI DOCS AISP view shows `@aisp` formatted syntax with orange highlighting
- WORKFLOW shows pipeline steps with mock states (completed, active, waiting)
- Listen toggle produces dark overlay with pulsing red orb
- The orb effect is visually stunning (3-layer glow, breathing animation)
- Features and CTA sections visible in REALITY tab
- Section click-to-select with dashed orange border
- All tests pass

### Research Requirements

- CSS layered blur/glow techniques for the red orb effect (3-layer construction)
- CSS animation performance for pulse/breathe effects (`animate-orb-pulse`, `animate-orb-breathe`)
- AISP spec format reference at `/plans/intial-plans/00.aisp-reference.md`
- Transition patterns for dark overlay (300ms fade to `#0a0a0f`)

### Deliverables

| # | Deliverable | File(s) |
|---|------------|---------|
| 1 | XAIDocsTab with HUMAN/AISP sub-toggle | `src/components/center-canvas/XAIDocsTab.tsx` |
| 2 | Human docs view (structured spec from config) | `src/contexts/specification/services/specGenerator.ts` |
| 3 | AISP docs view (formatted `@aisp` syntax) | `src/contexts/specification/services/aispFormatter.ts` |
| 4 | Spec templates (northStar, architecture, implPlan) | `src/contexts/specification/templates/*.ts` |
| 5 | WorkflowTab with 6 pipeline steps and status states | `src/components/center-canvas/WorkflowTab.tsx` |
| 6 | ListenOverlay (dark transition, covers left + center) | `src/components/listen-mode/ListenOverlay.tsx` |
| 7 | RedOrb (3-layer CSS: solid core, blurred mid-ring, ambient glow) | `src/components/listen-mode/RedOrb.tsx` |
| 8 | Typewriter (character-by-character, monospace, system brevity) | `src/components/listen-mode/Typewriter.tsx` |
| 9 | StartListeningButton (centered below orb, pill shape) | `src/components/listen-mode/StartListeningButton.tsx` |
| 10 | Features section template (3-column card grid) | `src/templates/features/FeaturesGrid3.tsx`, `schema.ts` |
| 11 | CTA section template (banner with heading + button) | `src/templates/cta/CTASimple.tsx`, `schema.ts` |
| 12 | Section registry (SectionType to variant to component map) | `src/templates/registry.ts` |

### Key Design References

- **Red Orb:** Apple Siri (ambient glow), Humane AI Pin (pulsing light)
- **Workflow Pipeline:** Vercel Deploy (sequential steps), GitHub Actions (step states)
- **XAI Docs Human:** Stripe Docs (clean structured documentation)
- **XAI Docs AISP:** GitHub Code View (syntax highlighting, line numbers)
- **Features Grid:** Tailwind UI (3-col feature cards with icons)
- **CTA Banner:** Linear (bold heading + single CTA button)

---

## Phase 1.3 — Hero Polish + Presets

**Goal:** Hero builder is polished and feature-complete. Capstone demo checkpoint ready.
**Duration:** Days 4-5
**Blocked By:** Phase 1.2
**Unblocks:** Level 2

### Definition of Done

- All 5 hero variants look professional with default config
- 6-8 preset hero configs (one per vibe variation)
- Responsive preview toggle works (375px / 768px / 1280px / 100%)
- Undo/redo works for 50+ steps (Ctrl+Z / Ctrl+Shift+Z)
- Auto-save persists across page reloads (debounced 2s)
- JSON export/import works with Zod validation on import
- Reset to default button with confirmation
- Capstone demo checkpoint ready

### Research Requirements

- LocalStorage size limits and performance (quota error handling)
- Debounce strategies for auto-save (2s via `configStore.subscribe()`)
- Responsive preview iframe/container width constraint approaches
- IProjectRepository interface pattern for storage abstraction

### Deliverables

| # | Deliverable | File(s) |
|---|------------|---------|
| 1 | HeroSplit variant (two-column: content left, image right) | `src/templates/hero/HeroSplit.tsx` |
| 2 | HeroOverlay variant (background image with text overlay) | `src/templates/hero/HeroOverlay.tsx` |
| 3 | HeroFullImage variant (full-bleed image, centered text) | `src/templates/hero/HeroFullImage.tsx` |
| 4 | HeroMinimal variant (text only, maximum whitespace) | `src/templates/hero/HeroMinimal.tsx` |
| 5 | Persistence layer (IProjectRepository + LocalStorage adapter) | `src/contexts/persistence/interfaces/*.ts`, `adapters/*.ts` |
| 6 | Undo/redo keyboard shortcuts + responsive preview toggle | Store middleware, device toggle wiring |
| 7 | JSON export/import/reset + 6-8 preset configs | DATA tab buttons, `src/presets/vibes/*.json` |

### Key Design References

- **Hero Variants:** Tailwind UI, shadcn/ui landing page examples
- **Responsive Preview:** Framer (device width constraint toggle)
- **Persistence:** Standard repository pattern with adapter abstraction

---

## Timeline Summary

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| 1.0 Shell & Navigation | Day 1 | Product shell renders, all navigation works |
| 1.1 Hero + JSON Core Loop | Days 2-3 | Bidirectional JSON loop working |
| 1.2 All Tabs + Listen Mode | Days 3-4 | All tabs populated, red orb stunning |
| 1.3 Hero Polish + Presets | Days 4-5 | Level 1 complete, capstone checkpoint |

## Dependencies

- Phase 0 (Scaffold) must be complete before Phase 1.0
- Each phase depends on the prior phase
- shadcn/ui, react-resizable-panels, Zustand, and Zod are core dependencies
- No backend or API dependencies in Level 1 (all client-side)

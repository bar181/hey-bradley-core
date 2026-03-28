# Level 1: Core Builder — Development Log

> This log tracks all implementation steps, decisions, outcomes, and lessons learned during Level 1.
> It serves as institutional memory for AI agents working on future phases.

## Log Format

Each entry should follow this format:

```
### [DATE] — [PHASE] — [STEP DESCRIPTION]
**Status:** COMPLETED | IN PROGRESS | BLOCKED | SKIPPED
**What was done:**
- Bullet points of actions taken
**Decision made:**
- Any architectural or design decisions
**What worked:**
- Approaches that succeeded
**What didn't work:**
- Approaches that failed and why
**Artifacts created:**
- Files created or modified
**Next steps:**
- What follows from this step
```

---

## Phase 0 — Scaffold & Tooling

### 2026-03-28 — Phase 0 — Vite Project Scaffold
**Status:** COMPLETED
**What was done:**
- Created Vite + React 18 + TypeScript project
- Installed minimal production deps: react-router-dom, zustand, zod, react-resizable-panels, lucide-react, clsx, tailwind-merge
- Installed dev deps: tailwindcss@3, postcss, autoprefixer, playwright
- Configured Tailwind with all hb-* design tokens (colors, fonts, animations)
- Set up path aliases (@/*) in tsconfig.app.json + vite.config.ts
- Created source directory structure (components/shell, left-panel, center-canvas, right-panel, listen-mode, store, lib, types, templates, contexts, pages, presets)
- Created cn() utility (clsx + tailwind-merge)
- Created uiStore (Zustand) with interactionMode, complexityMode, activeTab, selectedSectionId
- Set up Google Fonts (DM Sans + JetBrains Mono) in index.css
- Created main.tsx with BrowserRouter and Builder page
- Verified TypeScript compilation and Vite production build pass

**Decision made:**
- Dropped `uuid` from deps — using `crypto.randomUUID()` instead (browser native)
- Dropped `jszip` — will use individual file downloads or clipboard copy for spec export
- Dropped `class-variance-authority` — simple conditionals sufficient
- Deferred `@dnd-kit/*` — will use arrow buttons for reorder first
- Used `react-resizable-panels` latest which exports `Group` and `Separator` (not `PanelGroup`/`PanelResizeHandle`)

**What worked:**
- Vite scaffold is extremely fast — project running in seconds
- Path aliases work immediately with both tsconfig and vite.config
- Tailwind hb-* tokens work correctly from first use

**What didn't work:**
- N/A — clean scaffold

**Artifacts created:**
- package.json, vite.config.ts, tsconfig.app.json, tailwind.config.js, postcss.config.js
- src/index.css, src/main.tsx, src/pages/Builder.tsx
- src/lib/cn.ts, src/store/uiStore.ts

**Next steps:**
- Build Phase 1.0 shell components (TopBar, StatusBar, ModeToggle, PanelLayout, TabBar, ChatInput, panel placeholders)

---

## Phase 1.0 — Shell & Navigation

### 2026-03-28 — Phase 1.0 — Complete Shell Build (Sub-Phase 1.1)
**Status:** COMPLETED
**What was done:**
- Spawned 5 parallel agents to build all shell components simultaneously
- Agent 1 (shell-agent): AppShell, TopBar, StatusBar
- Agent 2 (toggle-agent): ModeToggle with uiStore integration
- Agent 3 (panel-agent): PanelLayout with react-resizable-panels
- Agent 4 (tabs-agent): TabBar + CenterCanvas + 4 tab placeholders (Reality, Data, XAI Docs, Workflow)
- Agent 5 (panels-agent): ChatInput + DraftPanel + ExpertPanel + DraftContext + ExpertContext
- Wired all components together in AppShell → TopBar(ModeToggle) + PanelLayout(panels + CenterCanvas + ChatInput) + StatusBar
- Fixed react-resizable-panels import (Group/Separator instead of PanelGroup/PanelResizeHandle)
- Verified TypeScript compilation, production build, and Playwright screenshot

**Decision made:**
- ModeToggle placed in TopBar center (between logo and device toggles)
- ChatInput placed below left panel (inside panel, not global)
- PanelLayout uses orientation="horizontal" (not direction=)
- All panel content is hardcoded placeholders — no data wiring yet (per DoD)

**What worked:**
- Parallel agent swarm (5 agents) completed all 15 components in ~2 minutes
- All agents produced clean, consistent code following the hb-* design tokens
- Warm cream design system looks production-grade from first render
- Mode toggles work correctly (LISTEN/BUILD, DRAFT/EXPERT)
- All 4 tabs navigable with correct active styling

**What didn't work:**
- react-resizable-panels API changed in latest version (Group/Separator vs PanelGroup/PanelResizeHandle) — needed post-agent fix
- Playwright needed system library installation (libatk, libxfixes, etc.) on Codespaces

**Artifacts created:**
- src/components/shell/AppShell.tsx, TopBar.tsx, StatusBar.tsx, ModeToggle.tsx, PanelLayout.tsx, ChatInput.tsx
- src/components/left-panel/DraftPanel.tsx, ExpertPanel.tsx
- src/components/center-canvas/TabBar.tsx, CenterCanvas.tsx, RealityTab.tsx, DataTab.tsx, XAIDocsTab.tsx, WorkflowTab.tsx
- src/components/right-panel/DraftContext.tsx, ExpertContext.tsx
- plans/implementation/level-1-core-builder/screenshots/phase-1.1-shell.png

**Next steps:**
- Phase 1.1: Hero + JSON Core Loop (configStore, Zod schemas, HeroCentered, bidirectional DATA tab sync)

---

## Phase 1.1 — Hero + JSON Core Loop

_(No entries yet)_

---

## Phase 1.2 — All Tabs + Listen Mode Visual

_(No entries yet)_

---

## Phase 1.3 — Hero Polish + Presets

_(No entries yet)_

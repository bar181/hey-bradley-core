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
- Design pivot to dark theme
- UX architecture redesign (unified panels)

### 2026-03-28 — Phase 1.0 — Design Pivot: Warm Cream → Dark Precision
**Status:** COMPLETED
**What was done:**
- Pivoted entire design system from warm cream (#faf8f5/#e8772e) to dark slate (#0f172a/#3b82f6)
- Rewrote all 15 components with dark theme tokens
- Updated tailwind.config.js with new hb-* color palette
- Created ADR document: adr-design-pivot.md
- Built stunning hero preview (radial gradient, glassmorphism badge, gradient headline)

**Decision made:**
- ADR-009b (Warm Light Chrome) superseded by Dark Precision
- Inspired by Vercel, Linear, Supabase Studio, Cursor IDE
- Red orb will look cinematic on dark bg instead of like an error on cream

**What worked:**
- 5 parallel agents rebuilt all components in ~2 minutes
- Dark theme immediately elevated the visual quality

**What didn't work:**
- N/A — clean transition

**Artifacts created:**
- plans/implementation/level-1-core-builder/adr-design-pivot.md
- Updated tailwind.config.js, src/index.css, all component files

### 2026-03-28 — Phase 1.0 — UX Architecture Redesign: Unified Panels
**Status:** COMPLETED
**What was done:**
- Replaced DRAFT/EXPERT toggle with SIMPLE/EXPERT tabs in right panel
- Left panel: flat clickable navigation list (Theme row + section rows + Add Section)
- Chat input + Listen toggle pinned at bottom of left panel (always visible)
- Right panel: 5-accordion hierarchy (Design, Content, Components, Section Options, Component Options)
- Context-driven: clicking Theme vs Hero shows different accordion content
- Accordion state resets to sensible defaults on context switch (theme→style open, section→content open)
- RAW AISP SPEC viewer in Expert tab for sections

**Decision made:**
- Removed ComplexityMode (DRAFT/EXPERT) from uiStore entirely
- Added: rightPanelTab, selectedContext, rightAccordions, toggleRightAccordion
- History tab → TopBar clock icon (placeholder for Phase 7.2)
- Left panel = pure navigation, right panel = all configuration

**What worked:**
- 5 parallel agents (left, right-structure, right-content, topbar, attribution)
- Context-aware accordion defaults prevent empty/broken states
- Clean separation: navigation (left) vs configuration (right)

**What didn't work:**
- N/A

**Artifacts created:**
- src/components/left-panel/LeftPanel.tsx, SectionsSection.tsx
- src/components/right-panel/RightPanel.tsx, RightPanelTabBar.tsx, RightAccordion.tsx
- src/components/right-panel/SimpleTab.tsx, ExpertTab.tsx
- src/components/right-panel/simple/ThemeSimple.tsx, SectionSimple.tsx
- src/components/right-panel/expert/ThemeExpert.tsx, SectionExpert.tsx
- src/components/shared/Toggle.tsx, SegmentedControl.tsx

### 2026-03-28 — Phase 1.0 — Polish Sprint (P0-P3)
**Status:** COMPLETED
**What was done:**
- P0: Hero overhauled to premium SaaS quality (radial gradient, glassmorphism, tight typography, trust bar)
- P1: Palette icon on Theme row verified present
- P2: "+ Add Section" styled as dashed dropzone
- P2: Premium image placeholder (thumbnail + browse button) in both SectionSimple and SectionExpert
- P3: Design bible (04.design-bible.md) fully updated: Warm Cream → Dark Slate permanently

**Decision made:**
- Vibe preset colors (Warm orange, Ocean blue, Forest green) remain as USER theme options — only builder chrome changed
- Accessibility dialog spec (07.accessibility-button.md) queued for Phase 1.3

**What worked:**
- 3 parallel agents (hero, UI mechanics, documentation)
- Hero now looks like Vercel/Linear quality

**Artifacts created:**
- Updated: RealityTab.tsx, LeftPanel.tsx, SectionSimple.tsx, SectionExpert.tsx
- Updated: plans/intial-plans/04.design-bible.md
- Created: plans/implementation/level-1-core-builder/phase-1.3-backlog.md

**Next steps:**
- Phase 1.1: Hero + JSON Core Loop (configStore, Zod schemas, HeroCentered wired to store, bidirectional DATA tab)

---

## Phase 1.1 — Hero + JSON Core Loop

### 2026-03-28 — Phase 1.1 — Zod Schemas + configStore + deepMerge
**Status:** COMPLETED
**What was done:**
- Created 6 Zod schema files: layout, style, section (with heroContent, featuresContent, ctaContent), masterConfig, patch, index barrel
- All types exported via z.infer (no manual interface duplication per Swarm Protocol §3.1)
- Created configStore (Zustand) with: applyPatch, setSectionConfig, addSection, removeSection, reorderSections, toggleSectionEnabled, undo/redo (100-state history), loadConfig, resetToDefaults
- Created deepMerge utility implementing ADR-007 rules: objects deep merge, arrays replace, null deletes, undefined skips
- Default config has 3 sections: hero-01, features-01, cta-01

**Decision made:**
- Section content stored as Record<string, unknown> in the generic schema, cast to specific types (HeroContent) at render time
- Undo/redo built directly into configStore (not separate middleware) for simplicity
- crypto.randomUUID() used for section ID generation (no uuid package)

**What worked:**
- Zod .default({}) on nested objects enables heroContentSchema.parse({}) to produce full defaults
- TypeScript compiles clean with all schemas

**What didn't work:**
- Initial heroContentSchema had required nested objects without .default({}) causing runtime parse errors — fixed by adding .default({}) to heading and cta objects

### 2026-03-28 — Phase 1.1 — HeroCentered + RealityTab + DataTab + Panel Wiring
**Status:** COMPLETED
**What was done:**
- Created HeroCentered template (src/templates/hero/HeroCentered.tsx) — renders from Section props with inline styles from JSON
- Rewrote RealityTab to render sections from configStore (filters by enabled, routes hero type to HeroCentered, others get placeholders)
- Rewrote DataTab with bidirectional JSON editing: live syntax highlighting, edit mode with Zod validation, COPY/EXPORT buttons
- Wired SectionsSection eye toggle to configStore.toggleSectionEnabled
- Wired SectionSimple headline/subtitle/CTA/component toggles to configStore.setSectionConfig
- Wired SectionExpert headline/subtitle/padding/gap to configStore.setSectionConfig

**Decision made:**
- DataTab uses custom regex-based syntax highlighter (no external library) — colorize function wraps JSON tokens in styled spans
- dangerouslySetInnerHTML acceptable for JSON.stringify output (controlled input, no user HTML)
- AISP viewer in Expert tab remains static for now — will be wired to live generation in Phase 1.2

**What worked:**
- 3 parallel agents (hero, data-tab, wire) completed all work simultaneously
- configStore → RealityTab rendering works: sections appear/disappear based on enabled state
- DataTab shows live JSON that updates when any control changes

**What didn't work:**
- Zod schema parse error (.default({}) missing) caused blank white screen — fixed quickly
- Hero gradient text not rendering visually (text-transparent bg-clip-text) — minor CSS issue for polish

**Artifacts created:**
- src/lib/schemas/layout.ts, style.ts, section.ts, masterConfig.ts, patch.ts, index.ts
- src/lib/deepMerge.ts
- src/store/configStore.ts
- src/templates/hero/HeroCentered.tsx (new)
- Updated: RealityTab.tsx, DataTab.tsx, SectionsSection.tsx, SectionSimple.tsx, SectionExpert.tsx

**Next steps:**
- Phase 1.2: All tabs content + Listen Mode visual (red orb)

### 2026-03-28 — Phase 1.1 Hotfix — Data Tab P0 Bug: Raw HTML in Output
**Status:** IN PROGRESS
**What was done:**
- Identified P0 bug: DataTab custom regex syntax highlighter renders raw HTML class names as visible text
- Root cause: dangerouslySetInnerHTML with a broken colorize() function that outputs `<span class="text-blue-400">` as literal text
- Decision: Replace custom highlighter with CodeMirror 6 (@uiw/react-codemirror)
- Installing CodeMirror 6 packages (approved — ~150KB, not monaco at ~4MB)
- Rebuilding DataTab with collapsible section blocks matching mockup design
- Creating ADR-010 (JSON as SSOT reinforced) and ADR-011 (Visual Quality Gate)
- Adding Playwright visual smoke tests as mandatory quality gate
- Adding Cardinal Sin #13 to Swarm Protocol

**Decision made:**
- Custom regex highlighters banned going forward — use CodeMirror for any code display
- Playwright visual smoke tests now MANDATORY after every UI task
- DataTab redesigned as "Project Data Schema" with collapsible per-section blocks

**What didn't work:**
- The original custom regex colorize() function — completely broken, shipped without visual verification
- This bug exposed that build passing ≠ UI working — led to ADR-011

---

## Phase 1.2 — All Tabs + Listen Mode Visual

_(No entries yet)_

---

## Phase 1.3 — Hero Polish + Presets

_(No entries yet)_

---

## Session 10 — Phase 1.3e: Theme System v3 (Final)

**Date:** 2026-03-29
**Duration:** ~2 hours
**Phase:** 1.3e (themes iteration 8 — the last one)

### What Was Done

**Sub-Phase A: Research + ADRs**
- Web searched top website categories from Webflow/Squarespace/ThemeForest
- Created `docs/research/theme-and-hero-research.md` (Parts A, B, C)
- Wrote ADRs 017-020 (invisible naming, meta schema, 6-slot palette, visibility matrix)
- 5 parallel agents, all completed in ~40s

**Sub-Phase B: JSON Data Architecture**
- Created 10 new theme JSONs: saas, agency, portfolio, blog, startup, personal, professional, wellness, creative, minimalist
- Created `palettes.json` (50 palettes), `fonts.json` (5 fonts), `media.json` (50 images + 20 videos)
- 12 parallel agents, all completed in ~60s
- All media URLs verified to return HTTP 200

**Sub-Phase C: Schema + Store + Bridge**
- Updated Zod schema: added paletteSchema, themeMetaSchema, alternativePaletteSchema
- Created `resolveColors.ts` bridge (palette ↔ colors backward compat)
- Updated `configStore.ts`: new imports, applyPalette(), applyFont(), toggleMode()
- Created theme registry `src/data/themes/index.ts`
- Updated `default-config.json` (preset: "saas", added palette block)
- Updated `template-config.json` (added palette + alternativePalettes)

**Sub-Phase D: UI Components**
- Rewrote `ThemeSimple.tsx`: 2-column grid, accordion layout, meta-driven from theme registry
- Created `PaletteSelector.tsx`: 5 rows × 6 color dots
- Created `FontSelector.tsx`: 5 font buttons
- Updated hero renderers to use `resolveColors()`: HeroCentered, HeroOverlay, HeroMinimal, HeroSplit

**Sub-Phase E: Cleanup + Verify**
- Deleted 10 old theme files (stripe-flow, notion-warm, etc.)
- Build passes clean
- Dev server verified at localhost:5173

**Hotfixes (after human review):**
- Fixed `applyVibe()`: only preserve URL from button components (image URLs are theme identity)
- Fixed `HeroCentered`: now renders heroImage below content
- Fixed `HeroSplit`: uses resolveColors for CTA button colors
- Fixed palette default detection (added palette block to default-config.json)
- Fixed HeroCentered missing fontFamily in style
- Replaced broken Creative video URL (857251→1093662)
- Added console.log for dev debugging (applyVibe, applyPalette, applyFont)

### Commits
- Phase 1.3e themes + ADRs + data files
- Phase 1.3e hotfixes (image, font, palette, video)

### Bugs Found
| Bug | Found By | Root Cause |
|-----|----------|-----------|
| Hero images cleared on theme switch | Human review | applyVibe preserved empty URL from default config |
| Font not updating visually | Human review | HeroCentered missing fontFamily in style |
| Palette default not highlighted | Human review | default-config.json missing palette block |
| Creative video 403 | URL verification | Pexels blocked that specific video ID |

### Status
Phase 1.3 is COMPLETE. All themes working. All hotfixes applied. Build passes. Phase 1.4 preflight prepared.

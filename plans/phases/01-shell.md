# Phase 1.0: Shell & Navigation

**Status:** NOT STARTED
**Estimated Agents:** 7 (parallel)
**Blocked By:** Phase 0
**Unblocks:** Phase 1.1

---

## Agent Assignment

| Agent | Responsibility | Files |
|-------|---------------|-------|
| shell-agent | AppShell + TopBar + StatusBar | `shell/AppShell.tsx`, `shell/TopBar.tsx`, `shell/StatusBar.tsx` |
| toggle-agent | ModeToggle (LISTEN/BUILD + DRAFT/EXPERT) | `shell/ModeToggle.tsx` |
| panel-agent | 3-panel resizable layout | `shell/PanelLayout.tsx` |
| tabs-agent | TabBar + 4 tab placeholders | `center-canvas/TabBar.tsx`, `center-canvas/*Tab.tsx` |
| left-panel-agent | DraftPanel + ExpertPanel placeholders | `left-panel/DraftPanel.tsx`, `left-panel/ExpertPanel.tsx` |
| right-panel-agent | DraftContext + ExpertContext placeholders | `right-panel/DraftContext.tsx`, `right-panel/ExpertContext.tsx` |
| store-agent | uiStore + types + ChatInput | `store/uiStore.ts`, `types/modes.ts`, `shell/ChatInput.tsx` |

---

## Checklist

### 1.0.1 — uiStore (store-agent)
- [ ] `src/store/uiStore.ts` — Zustand store with:
  - `interactionMode: 'LISTEN' | 'BUILD'` (default: BUILD)
  - `complexityMode: 'DRAFT' | 'EXPERT'` (default: DRAFT)
  - `activeTab: 'REALITY' | 'DATA' | 'XAI_DOCS' | 'WORKFLOW'` (default: REALITY)
  - `selectedSectionId: string | null`
  - Setter actions for each
- [ ] `src/types/modes.ts` — Type exports
- [ ] Tests: mode switching preserves other state

### 1.0.2 — AppShell (shell-agent)
- [ ] `src/components/shell/AppShell.tsx` — Full page wrapper
  - Top bar at top
  - Panel layout in center
  - Status bar at bottom
- [ ] `src/components/shell/TopBar.tsx` — 48px height
  - LEFT: HB logo (orange circle + "HB"), editable project name, version badge (`V1.0.0-RC1`)
  - CENTER: Device toggle icons (phone, tablet, desktop, ultra)
  - RIGHT: Share, Bookmark, Settings icons + Publish button (orange, rounded-full)
  - Font: DM Sans for labels, monospace for badge
  - Colors: `hb-bg` background, `hb-border` bottom border
- [ ] `src/components/shell/StatusBar.tsx` — 24px height
  - LEFT: "READY AISP SPEC V1.2"
  - RIGHT: "MODE: DRAFT CONNECTED"
  - Font: monospace, 11px, uppercase, `hb-text-muted`

### 1.0.3 — ModeToggle (toggle-agent)
- [ ] `src/components/shell/ModeToggle.tsx`
  - Two pill toggles side by side
  - LISTEN/BUILD (left): `hb-surface` container, `rounded-full`, `p-0.5`
  - DRAFT/EXPERT (right): same styling
  - Active pill: `bg-hb-accent`, `text-white`
  - Inactive pill: `bg-transparent`, `text-hb-text-secondary`
  - LISTEN has pulsing dot indicator
  - Connected to uiStore

### 1.0.4 — PanelLayout (panel-agent)
- [ ] `src/components/shell/PanelLayout.tsx`
  - `react-resizable-panels` with 3 panels
  - Left: 420px default, min 320px, max 500px
  - Center: fluid, min 400px
  - Right: 350px default, min 280px, max 450px
  - Warm cream resize handles
  - Conditionally renders Draft/Expert panels based on uiStore

### 1.0.5 — Center Canvas Tabs (tabs-agent)
- [ ] `src/components/center-canvas/TabBar.tsx`
  - Tabs: REALITY, DATA, XAI DOCS, WORKFLOW
  - Active: orange underline (2px), `hb-accent`
  - Font: monospace, 12px, uppercase, tracking-wide
  - Connected to uiStore.activeTab
- [ ] `src/components/center-canvas/RealityTab.tsx` — "Reality Preview" placeholder
- [ ] `src/components/center-canvas/DataTab.tsx` — "Data View" placeholder
- [ ] `src/components/center-canvas/XAIDocsTab.tsx` — "XAI Docs" placeholder
- [ ] `src/components/center-canvas/WorkflowTab.tsx` — "Workflow" placeholder

### 1.0.6 — Left Panel (left-panel-agent)
- [ ] `src/components/left-panel/DraftPanel.tsx`
  - "Draft Builder" header with DM Sans
  - "What do you want to build?" prompt
  - "Start Talking" button (orange outline)
  - "Pick a vibe" — 3 hardcoded vibe cards (Warm 🟠🔴🟡, Ocean 🔵🟣🔵, Forest 🟢🟢🟢)
  - "Your Sections" — ordered list (Hero Section, Features, Call to Action)
  - "+ Add Section" button
- [ ] `src/components/left-panel/ExpertPanel.tsx`
  - "EXPERT EDITOR" header with gear icon
  - LAYOUT accordion (hardcoded: DISPLAY flex, DIRECTION column, etc.)
  - CONTENT accordion
  - SECTIONS accordion (Hero, Features, CTA + Add section)
  - IMAGES accordion
  - STYLE accordion (hardcoded: BACKGROUND #faf8f5, COLOR #2d1f12)
  - Enterprise density: text-xs, gap-1, font-mono for values

### 1.0.7 — Right Panel (right-panel-agent)
- [ ] `src/components/right-panel/DraftContext.tsx`
  - Section name header (e.g., "HERO")
  - Headline text input
  - Layout visual selector (Left, Center, Right icons)
  - "More options →" link
- [ ] `src/components/right-panel/ExpertContext.tsx`
  - Section name header with settings icon
  - Layout section: Direction arrows, Align buttons, Padding/Gap inputs
  - Content section: Headline/Subtitle textareas, Show Subtitle toggle
  - Style section: Background color, Text Color inputs
  - Enterprise density: property rows with label-left, value-right

### 1.0.8 — ChatInput (store-agent)
- [ ] `src/components/shell/ChatInput.tsx`
  - Mic icon (left), text input, send button (right)
  - Placeholder: "Describe what to build..."
  - DM Sans, 14px
  - Positioned below left panel

### 1.0.9 — Builder Page (shell-agent)
- [ ] `src/pages/Builder.tsx` — Assembles AppShell with all panels
- [ ] Router configured: `/` → redirect to `/builder`, `/builder` → Builder page

---

## Design References

| Component | Reference | What to Match |
|-----------|-----------|--------------|
| TopBar | [Linear](https://linear.app) | Minimal toolbar, icon density, version badge |
| TopBar | [Framer](https://framer.com) | Project name + device toggles |
| Mode Toggles | [Raycast](https://raycast.com) | Monospace pill toggles |
| 3-Panel | [VS Code](https://code.visualstudio.com) | Resizable panels, warm resize handles |
| 3-Panel | [Cursor](https://cursor.sh) | Commander + Canvas + Engine Room |
| Status Bar | [VS Code](https://code.visualstudio.com) | Monospace indicators, small height |
| Draft Panel | [Notion](https://notion.so) | Card selection, clean spacing |
| Expert Panel | [Framer](https://framer.com) | Enterprise-density property inspector |
| Expert Panel | [Figma](https://figma.com) | Accordion sections, property rows |

---

## Testing (TDD London School)

- [ ] `tests/store/uiStore.test.ts` — Mode switching, tab switching, section selection
- [ ] `tests/components/ModeToggle.test.ts` — Renders correct active state
- [ ] `tests/components/PanelLayout.test.ts` — Renders correct panels per mode

---

## Exit Criteria
- [ ] `npm run dev` renders complete shell
- [ ] DRAFT ↔ EXPERT toggles change left and right panels
- [ ] LISTEN ↔ BUILD toggles work (Listen shows placeholder)
- [ ] All 4 tabs navigate with active state styling
- [ ] Status bar renders with monospace text
- [ ] Zero console errors
- [ ] **Looks like a real product** — human review required

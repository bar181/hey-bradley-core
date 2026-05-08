# P122 UX Overhaul — UI Baseline Audit (W1)

**Date:** 2026-05-08  
**Branch:** `swarm/p122-ux-overhaul`  
**Scope:** Read-only inventory of shadcn primitives, inline styles, template system, onboarding surfaces, and builder UI candidates for W2-W6.

---

## Task 1: Inventory of shadcn Primitives

| Primitive | File | Status | Notes |
|-----------|------|--------|-------|
| accordion | `src/components/ui/accordion.tsx` | Present | Imported, shadcn ✓ |
| badge | `src/components/ui/badge.tsx` | Present | Imported, shadcn ✓ |
| button | `src/components/ui/button.tsx` | Present | Imported, shadcn ✓ |
| card | `src/components/ui/card.tsx` | Present | Imported, shadcn ✓ |
| input | `src/components/ui/input.tsx` | Present | Imported, shadcn ✓ |
| switch | `src/components/ui/switch.tsx` | Present | Imported, shadcn ✓ |
| textarea | `src/components/ui/textarea.tsx` | Present | Imported, shadcn ✓ |
| ErrorBoundary | `src/components/ui/ErrorBoundary.tsx` | Custom | Not shadcn |
| ImageFallback | `src/components/ui/ImageFallback.tsx` | Custom | Not shadcn |
| LightboxModal | `src/components/ui/LightboxModal.tsx` | Custom | Not shadcn |
| ShortcutHelp | `src/components/ui/ShortcutHelp.tsx` | Custom | Not shadcn |
| Tooltip | `src/components/ui/Tooltip.tsx` | Custom | Not shadcn |
| **Notably Missing** | | | |
| Tabs | — | **Missing** | W4 "+" Add Section" may need shadcn Tabs if picker becomes modal |
| ScrollArea | — | **Missing** | Needed for W4 left-panel horizontal scroll fix (preflight §4-D-9) |
| Select / Dropdown | — | **Missing** | Not found; hero layout dropdown in SectionSimple uses custom buttons |

**Summary:** 7 shadcn primitives present. ScrollArea needed for left-panel fix (W4). Tabs optional if template picker stays inline.

---

## Task 2: Layout Inline Styles (style={{ ... }} with layout properties)

| File:Line | Component | Property | Snippet | Priority |
|-----------|-----------|----------|---------|----------|
| `left-panel/QuickAddPicker.tsx:90` | QuickAddPicker | padding | `style={{ borderRadius: cardRadius, padding: '8px' }}` | Low (padding-only, not layout) |
| `shell/MobileListenFullscreen.tsx:197` | MobileListenFullscreen | padding | `style={{ padding: tokens.spacing['stack-gap'] }}` | Low (padding-only) |
| `shell/MobileSpecBottomSheet.tsx:44,60,76` | MobileSpecBottomSheet | paddingLeft, paddingRight | `style={{ paddingLeft: tokens.spacing['container-x'], paddingRight: tokens.spacing['container-x'] }}` | Low (padding-only, 3x) |
| `left-panel/PageSelector.tsx:10` | PageSelector | overflow-x: auto | `<div className="flex items-center gap-1 overflow-x-auto...">` | Medium (horizontal scroll—candidate for fix) |
| `agentics/SealPanel.tsx:24` | SealPanel | overflow-x: auto | `'...overflow-x-auto'` (classname, not inline) | Medium (horizontal scroll, pre, code display) |
| `agentics/SpecWorkbench.tsx:115,157` | SpecWorkbench | overflow-x: auto | `overflow-x-auto` on `<pre>` elements (classname, not inline) | Low (code display only) |
| `center-canvas/DataTab.tsx` | DataTab | overflow-x: auto | Multiple `overflow-x-auto` on code blocks (classname) | Low |
| `center-canvas/RequestDrillDown.tsx` | RequestDrillDown | overflow-x: auto | `overflow-x-auto` on pre (classname) | Low |
| `marketing/AISPDualView.tsx` | AISPDualView | overflow-x: auto | `overflow-x-auto` on dark card (classname) | Low |

**Key Finding:** Very few **true inline `style={{}}` doing layout**. Most layout overflow is via Tailwind `overflow-x-auto` classname. The **critical candidate** is `PageSelector` which uses `overflow-x-auto` on a flex container—W4 will wrap it in shadcn `<ScrollArea>`.

---

## Task 3: Default Template Source

| Property | Location | Value / Note |
|----------|----------|--------------|
| **File** | `src/data/default-config.json` | Canonical default template JSON |
| **Loaded via** | `src/store/configStore.ts:7` | `import defaultConfig from '@/data/default-config.json'` |
| **Exported symbol** | Line 24 | `const DEFAULT_CONFIG: MasterConfig = parseMasterConfigSafe(defaultConfig) ?? (defaultConfig as unknown as MasterConfig)` |
| **Site title** | Line 3 | `"Your Website"` (currently) |
| **Hero heading** | Line 120 | `"Welcome to Your Website"` (the string to replace) |
| **Theme preset** | Line 13 | `"saas"` (dark/indigo) |
| **Theme colors** | Lines 16-21 | Primary: `#0a0a1a` · Accent: `#6366f1` (indigo, not crimson) |
| **Initial sections** | Lines 45+ | Navbar + Hero + Features + Pricing + Footer (5 sections) |

**For W2:** Replace `src/data/default-config.json` with Hey Bradley dark/crimson theme:
- Site title → "Hey Bradley"
- Hero heading → "Describe it. See it."
- Hero subheading → "Your voice is the whiteboard."
- Theme colors → dark (`#0a0a1a`) + crimson accent (`#A51C30`)
- Sections → Hero + Features (3 cards) + Numbers (3 stats) + CTA band

**Hook point:** `handleStartNew()` in `src/pages/Onboarding.tsx:546` calls `applyVibe('saas')` → W2 may hardcode default to 'hey-bradley' or rename the vibe.

---

## Task 4: Onboarding / Template-Picker Rendering Surface

| Property | Location | Status |
|----------|----------|--------|
| **Onboarding page** | `src/pages/Onboarding.tsx` | ✓ Exists (673 lines) |
| **Template picker** | Lines 879–902 | ✓ Already renders theme cards (ThemeCard component) in a 2×3 grid |
| **Example picker** | Lines 735–873 | ✓ Already renders example cards (ExampleCard component) in tabs |
| **Current layout** | Lines 732–904 | Two-column: left = projects/examples tabs · right = themes |
| **Theme picker component** | Line 240–279 | `ThemeCard({ theme, onSelect })` |
| **Trigger** | Line 414 | `handleThemeSelect(slug)` calls `applyVibe(slug)` → navigates to builder |
| **First-run step** | Lines 564–580 | Mode selector (whiteboard/planning/agentics) appears before personality picker |

**For W2 (4-card template picker):** The **cleanest insertion point** is to replace or extend the existing `ThemeCard` grid (currently line 892–900) with a new `TemplatePicker` component that:
1. Shows 4 preset templates (Hey Bradley, Kitchen Sink, Portfolio, swarm-pick)
2. Pre-selects Hey Bradley
3. Calls same `handleThemeSelect()` logic

**Alternative:** Add a separate "Templates" tab alongside "Themes" in the right panel. **Recommendation:** Replace the theme grid (it's already a 2×3 picker) with a dedicated template picker that comes first, then offer theme refinement as secondary.

---

## Task 5: "More Sections" String Location & Button Component

| Property | Location | Current State |
|----------|----------|----------------|
| **String** | `src/components/left-panel/SectionsSection.tsx:611` | `"More Sections"` |
| **Button JSX** | Lines 603–613 | `<button type="button" onClick={() => setShowHidden(!showHidden)} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-hb-text-muted hover:text-hb-text-secondary transition-colors">` |
| **Current styling** | Lines 607–608 | Minimal button: no bg, text-only with hover color change |
| **Parent component** | Line 70 (export) | `SectionsSection()` (left-panel sections list) |
| **Toggle state** | Line 97 | `const [showHidden, setShowHidden] = useState(false)` |
| **Content when open** | Lines 614–673 | Renders hidden sections + add-section type picker |

**For W4:** Change line 611 from:
```jsx
More Sections
```
to:
```jsx
+ Add Section
```

And upgrade button styling (lines 607–608) to use shadcn `<Button>` with `variant="outline"` and `size="sm"`. Rationale: communicates "action, not navigation."

**Code location for W4 change:**
- String: `src/components/left-panel/SectionsSection.tsx:611`
- Button styling: `src/components/left-panel/SectionsSection.tsx:604–612`

---

## Task 6: Agentics Surface & LLM-Log Writer

| Property | Location | Details |
|----------|----------|---------|
| **Agentics page** | `src/pages/Agentics.tsx` | Parent container (142 lines) |
| **SpecWorkbench component** | `src/components/agentics/SpecWorkbench.tsx` | Center pane (260+ lines); sprint cards + tabs (Human/AISP/ADR) |
| **SealPanel component** | `src/components/agentics/SealPanel.tsx` | Renders seal/defer status visualization |
| **Import in Agentics.tsx** | Line 21 | `import { SpecWorkbench } from '@/components/agentics/SpecWorkbench'` |
| **Active Phase state** | Line 37 | `const [activePhaseId, setActivePhaseId] = useState<string>('foundation')` |
| **Layout structure** | Lines 113–160 (approx.) | Three-pane: left phase tree · center process map · right SpecWorkbench |
| **Integration point for W6** | Likely after line 21 or within render | Add `<LLMLogPanel />` + `<DBPanel />` as new rows/tabs in right pane |

### Read-side Repositories (W6 will use these)

| Repository | File | Key Exports |
|-----------|------|--------------|
| **comprehensiveLogs** | `src/contexts/persistence/repositories/comprehensiveLogs.ts` | `writeLogEvent(...)` (line 219+) · `redactKeyShapes(s)` (line 168) · `newRequestId()` (line 154) |
| **llmLogs** | `src/contexts/persistence/repositories/llmLogs.ts` | `recordLLMLog(args)` (line 47) · `LLMLogRow` type (line 20) |
| **db module** | `src/contexts/persistence/db.ts` | `getDB()` (exported, used to query tables) · `persist()` (async IndexedDB flush) |

### Log Event Schema (from comprehensiveLogs.ts)

```typescript
interface LogEventRow {
  id: string;
  session_id: string;
  request_id: string;
  project_id: string | null;
  event_type: LogEventType;  // 'input_event', 'decomposition', etc.
  event_data: string;         // JSON stringified + redactKeyShapes()
  page_id: string | null;
  page_index: number | null;
  input_type: InputType | null; // 'chat' | 'listen'
  latency_ms: number | null;
  created_at: number;
}
```

**For W6 LLM Log panel:** Query `log_events` where `project_id = activeProjectId` (uses index `idx_log_events_project` from migration 005). Display `event_type + request_id + created_at + redacted event_data`.

**For W6 Database panel:** Query selectable tables (`projects`, `sessions`, `llm_logs`, `log_events`, `edit_history`, `messages`, `user_templates`); filter by `project_id = activeProjectId`; render JSON.

---

## Task 7: Hero Layout-Switch Handler (Image URL Mutation Bug)

| Property | Location | Details |
|----------|----------|---------|
| **File** | `src/components/right-panel/simple/SectionSimple.tsx` | Hero editing surface |
| **Layout presets** | Lines 21–32 | 8 HERO_LAYOUTS defined (Full Photo, Full Video, Clean, Simple, Photo Right, Photo Left, Video Below, Photo Below) |
| **Layout handler** | Lines 106–125 | `applyHeroLayout()` callback |
| **Bug point** | Line 123 | `setSectionConfig(sectionId, { variant: layout.variant, layout: { ...section.layout, heroLayout: layout.id }, components: updatedComponents })` |
| **Component enable/disable** | Lines 113–122 | Toggles `heroImage`, `backgroundImage`, `heroVideo` enabled/disabled based on `layout.media` |
| **URL assignment** | Lines 116–120 | If a component should be enabled and has no URL, assign `DEFAULT_IMAGE` or `DEFAULT_BG_IMAGE` or `DEFAULT_VIDEO` |

**The Bug (§4-F-18):** When layout switches, line 118 assigns a new default image URL to components that lack one. This can silently overwrite the user's previously-selected `imageUrl` if the component was disabled (and thus had no URL tracked).

**Preservation fix for W4:** Before toggling a component's enabled state, capture its current `url` prop and preserve it across layout changes. Only assign a default if the URL is truly missing (falsy).

**Current behavior (lines 116–120):**
```typescript
if (shouldEnable && !currentUrl) {
  const defaultUrl = c.id === 'heroImage' ? DEFAULT_IMAGE : ...
  return { ...c, enabled: shouldEnable, props: { ...c.props, url: defaultUrl } }
}
```

**Correct behavior:** Track previously-selected URLs in a separate state or config field so re-enabling a component restores its URL rather than reverting to the default.

---

## Task 8: "Add Page" Action Wire

| Property | Location | Details |
|----------|----------|---------|
| **Button rendered at** | `src/components/left-panel/SectionsSection.tsx:491–500` | Plus icon button with `onClick={() => setShowAddPage(!showAddPage)}` |
| **Input field** | Lines 538–547 | Shows when `showAddPage` is true; collects `newPageTitle` |
| **Handler** | Lines 428–434 | `const handleAddPage = () => { if (!newPageTitle.trim()) return; addPage(newPageTitle.trim()); ... }` |
| **Zustand action** | `src/store/configStore.ts:548–609` | `addPage: (title) => { ... }` creates new PageConfig, pushes to pages array, updates active page |
| **Store binding** | `SectionsSection.tsx:88` | `const addPage = useConfigStore((s) => s.addPage)` |
| **Page template logic** | `configStore.ts:556–580` | Looks for template match (e.g., "about" → about template, "contact" → contact template, else generic hero) |
| **Multi-page gating** | `configStore.ts:590–600` | If `config.pages` is empty, creates a "Home" page first, then adds the new page |

**Wire summary (all connected):**
1. User clicks Plus button (SectionsSection:491)
2. `setShowAddPage(true)` shows input field
3. User types title, presses Enter or clicks "Add" button
4. `handleAddPage()` calls `addPage(title)`
5. Zustand `addPage` action creates PageConfig, updates store
6. Component re-renders with new page in tab list

**No obvious break:** The action appears fully wired. If it's unresponsive (§4-F-17), the issue is likely:
- Event handler not firing (click listener lost)
- Store not updating (Zustand mutation not triggering re-render)
- Page not visible in tabs (new page created but tab UI doesn't reflect it)

**For W4 debugging:** Add `console.log()` at SectionsSection:430 to confirm `handleAddPage()` fires, then trace store update in `configStore.ts:548`.

---

## Summary Table: All 8 Tasks

| # | Task | Finding | W2-W6 Impact |
|---|------|---------|--------------|
| 1 | Shadcn Inventory | 7 present; ScrollArea missing (needed for W4) | W4 must add ScrollArea to `ui/` |
| 2 | Layout Inline Styles | Mostly Tailwind classnames; PageSelector uses `overflow-x-auto` | W4 wraps PageSelector in shadcn ScrollArea |
| 3 | Default Template | `src/data/default-config.json` (saas preset) | W2 replaces with Hey Bradley dark/crimson |
| 4 | Onboarding Surface | `Onboarding.tsx` already has theme picker; reuse or extend for templates | W2 adds 4-card TemplatePicker to right panel |
| 5 | "More Sections" Button | `SectionsSection.tsx:611` text + lines 607–612 styling | W4 changes text to "+ Add Section", upgrades to shadcn Button |
| 6 | Agentics + LLM Log | `Agentics.tsx` → SpecWorkbench; repos: comprehensiveLogs.ts, llmLogs.ts, db.ts | W6 mounts LLMLogPanel + DBPanel in right pane; queries via `getDB()` |
| 7 | Hero Layout Switch | `SectionSimple.tsx:106–125` applyHeroLayout; bug at line 118 (default image overwrites) | W4 preserves imageUrl across layout changes |
| 8 | Add Page Action | SectionsSection → configStore fully wired; no obvious break | W4 debugs if unresponsive; likely listener or store mutation issue |

---

## Out of Scope (P122 Preflight Reminders)

- **Do not edit:** `MarketingNav.tsx`, Welcome.tsx hero copy, AISP Crystal Atom view, Listen mode core, BlogPost.tsx, About.tsx, Docs.tsx, builder logic, LLM adapter, `src/lib/blogPosts.ts`
- **Deferred to P123:** Resizable panels, loading/error/toast harness, public site below-fold
- **Deferred to P124:** `/api/demo-chat` Gemini edge function, server-side key management

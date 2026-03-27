# Phase 1.1: Hero + JSON Core Loop

**Status:** NOT STARTED
**Estimated Agents:** 8 (parallel)
**Blocked By:** Phase 1.0
**Unblocks:** Phase 1.2

---

## Agent Assignment

| Agent | Responsibility | Files |
|-------|---------------|-------|
| schema-agent | All Zod schemas | `lib/schemas/*.ts`, `templates/hero/schema.ts` |
| store-agent | configStore + undoMiddleware + deepMerge | `store/configStore.ts`, `store/undoMiddleware.ts`, `lib/deepMerge.ts` |
| hero-agent | HeroCentered template | `templates/hero/HeroCentered.tsx` |
| data-tab-agent | DataTab with syntax highlighting | `center-canvas/DataTab.tsx` |
| reality-agent | RealityTab + SectionWrapper | `center-canvas/RealityTab.tsx`, `center-canvas/SectionWrapper.tsx` |
| draft-wire-agent | Wire Draft panels to configStore | `left-panel/DraftPanel.tsx`, `right-panel/DraftContext.tsx` |
| expert-wire-agent | Wire Expert panels to configStore | `left-panel/ExpertPanel.tsx`, `right-panel/ExpertContext.tsx` |
| preset-agent | Vibe presets + section defaults | `presets/vibes/*.json`, `presets/sections/*.json` |

---

## Checklist

### 1.1.1 — Zod Schemas (schema-agent)
- [ ] `src/lib/schemas/layout.ts` — Layout schema (display, direction, align, gap, padding, columns?, maxWidth?)
- [ ] `src/lib/schemas/style.ts` — Style schema (background, color, fontFamily?, borderRadius?)
- [ ] `src/lib/schemas/section.ts` — Base section schema (type, id, layout, content, style)
- [ ] `src/lib/schemas/masterConfig.ts` — Root schema (spec, page, version, sections[])
- [ ] `src/lib/schemas/patch.ts` — LLM patch envelope schema
- [ ] `src/templates/hero/schema.ts` — Hero-specific content schema (heading, subheading, cta)
- [ ] `src/types/config.ts` — `z.infer` exports for all schemas
- [ ] `src/types/sections.ts` — SectionType union, per-section content types
- [ ] NO manual TypeScript interfaces duplicating Zod schemas

### 1.1.2 — configStore + deepMerge (store-agent)
- [ ] `src/lib/deepMerge.ts` — JSON merge with rules:
  - Objects → deep merge recursively
  - Arrays → REPLACE entirely (never concat)
  - null → DELETE key
  - undefined → SKIP
  - Primitives → OVERWRITE
- [ ] `src/store/undoMiddleware.ts` — Zustand middleware, 100-state history stack
- [ ] `src/store/configStore.ts` — Full store with:
  - `config: MasterConfig`
  - `history: MasterConfig[]`, `future: MasterConfig[]`
  - `isDirty: boolean`, `lastSavedAt: Date | null`
  - `applyPatch(patch, source)` — uses deepMerge
  - `applyVibe(vibeName)` — macro: changes 15+ nodes
  - `addSection(type, afterIndex?)`, `removeSection(id)`, `reorderSections(newOrder)`
  - `setSectionConfig(sectionId, patch)`
  - `undo()`, `redo()`
  - `markSaved()`, `loadConfig(config)`, `resetToDefaults()`

### 1.1.3 — Hero Template (hero-agent)
- [ ] `src/templates/hero/HeroCentered.tsx`
  - Renders from configStore section data
  - Heading with configurable size/weight
  - Subheading text
  - CTA button (accent color bg)
  - Optional secondary CTA, badge, image
  - Uses CSS values from JSON (not hardcoded Tailwind)
  - Responsive to config changes < 100ms

### 1.1.4 — DataTab (data-tab-agent)
- [ ] `src/components/center-canvas/DataTab.tsx`
  - Full JSON display with syntax highlighting:
    - Keys: `hb-code-key` (orange)
    - Strings: `hb-code-string` (green)
    - Numbers: `hb-code-number` (dark brown)
    - Brackets: `hb-code-bracket` (muted)
  - Line numbers (muted, right-aligned)
  - COPY + EXPORT buttons (top right)
  - Bidirectional: editing JSON → Zod validates → merges → preview updates
  - Red highlight on invalid JSON

### 1.1.5 — RealityTab + SectionWrapper (reality-agent)
- [ ] `src/components/center-canvas/RealityTab.tsx` — Renders sections from configStore
- [ ] `src/components/center-canvas/SectionWrapper.tsx`
  - Click-to-select: dashed orange border (2px, `hb-border-selected`)
  - Sets `uiStore.selectedSectionId` on click
  - AISP ID ghost overlay on hover (`[#hero-01]` top-left)

### 1.1.6 — Wired Draft Panels (draft-wire-agent)
- [ ] `src/components/left-panel/VibeCards.tsx` — Vibe picker → `configStore.applyVibe()`
- [ ] `src/components/left-panel/SectionList.tsx` — Clickable sections → right panel context
- [ ] `src/components/right-panel/DraftContext.tsx` — Wired:
  - Headline input → `configStore.setSectionConfig()`
  - Layout visual selector → configStore

### 1.1.7 — Wired Expert Panels (expert-wire-agent)
- [ ] `src/components/left-panel/ProjectExplorer.tsx` — Tree view (HeroSection > Title, Subtitle, PrimaryCTA)
- [ ] `src/components/left-panel/PropertyInspector.tsx` — Key-value property rows
- [ ] `src/components/left-panel/AccordionSection.tsx` — Reusable accordion
- [ ] `src/components/right-panel/ExpertContext.tsx` — Wired:
  - Layout: Direction, Align, Padding, Gap → configStore
  - Content: Headline, Subtitle, Show toggle → configStore
  - Style: Background, Text Color → configStore

### 1.1.8 — Presets (preset-agent)
- [ ] `src/presets/vibes/warm.json` — Colors, typography for Warm vibe
- [ ] `src/presets/vibes/ocean.json` — Colors, typography for Ocean vibe
- [ ] `src/presets/vibes/forest.json` — Colors, typography for Forest vibe
- [ ] `src/presets/sections/hero-defaults.json` — Default hero config

---

## Testing (TDD London School)

- [ ] `tests/lib/deepMerge.test.ts`:
  - Object merge: `{a:{b:1}}, {a:{c:2}} → {a:{b:1,c:2}}`
  - Array replace: `{items:[1,2]}, {items:[3]} → {items:[3]}`
  - Null delete: `{a:1}, {a:null} → {}`
  - Undefined skip: `{a:1}, {a:undefined} → {a:1}`
- [ ] `tests/lib/schemas/*.test.ts` — Valid/invalid configs parse/reject
- [ ] `tests/store/configStore.test.ts`:
  - applyPatch mutations
  - applyVibe cascades 15+ nodes
  - undo/redo preserves state
  - history capped at 100
- [ ] `tests/templates/hero/HeroCentered.test.ts` — Renders from config

---

## Design References

| Component | Reference | What to Match |
|-----------|-----------|--------------|
| JSON Editor | [VS Code](https://code.visualstudio.com) | Warm syntax highlighting |
| Property Inspector | [Framer](https://framer.com) | Enterprise-density rows |
| Project Explorer | [VS Code](https://code.visualstudio.com) | Collapsible tree |
| Vibe Cards | [Notion](https://notion.so) | Card selection |
| Section Wrapper | [Webflow](https://webflow.com) | Click-to-select borders |

---

## Exit Criteria
- [ ] Clicking "Warm" vibe changes hero colors
- [ ] Typing headline updates hero immediately
- [ ] Expert property values update hero layout
- [ ] DATA tab reflects all changes in real-time
- [ ] Editing DATA tab JSON updates preview and controls
- [ ] Preview re-render < 100ms
- [ ] All tests pass
- [ ] **Human review before Phase 1.2**

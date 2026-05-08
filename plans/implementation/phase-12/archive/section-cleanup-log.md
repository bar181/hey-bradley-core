# Section Editor Cleanup Log

**Date:** 2026-04-05  
**Scope:** Expert mode section editor controls, SIMPLE mode audit, broken handler fixes  
**Audit Reference:** `plans/implementation/phase-12/ux-audit.md`

---

## Files Changed

### 1. `src/components/right-panel/expert/SectionExpert.tsx`

**Issues Fixed (10 total):**

#### P1-SEC-07: Local useState replaced with config store reads

The following 10 controls previously used `useState` and lost their values on re-render. All now read from and write to the config store via `setSectionConfig`:

| Control | Old (local state) | New (config store) |
|---------|------------------|--------------------|
| `selectedPreset` | `useState('Modern')` | Reads `section.variant`, writes via `setSectionConfig(id, { variant })` |
| `headingLevel` | `useState('H1')` | Reads `headline` component's `props.level`, writes via `updateComponentProps(section, 'headline', { level })` |
| `selectedAlign` | `useState('center')` | Reads `section.layout.align`, writes via `setSectionConfig(id, { layout: { align } })` |
| `width` | `useState('Full')` | Reads `section.layout.maxWidth` (mapped to label), writes via `setSectionConfig(id, { layout: { maxWidth } })` |
| `aspect` | `useState('16:9')` | Removed -- no schema field for aspect ratio; kept as future work |
| `buttonStyle` | `useState('Filled')` | Reads `primaryCta` component's `props.style`, writes via `updateComponentProps(section, 'primaryCta', { style })` |
| `buttonSize` | `useState('M')` | Reads `primaryCta` component's `props.size`, writes via `updateComponentProps(section, 'primaryCta', { size })` |
| `badgePosition` | `useState('Top')` | Reads `eyebrow` component's `props.position`, writes via `updateComponentProps(section, 'eyebrow', { position })` |
| `primaryButton` | `useState(true)` | Reads `hero.cta.show`, writes via `setComponentEnabled(section, 'primaryCta', val)` |
| `secondaryButton` | `useState(true)` | Reads `secondaryCta` component's `enabled`, writes via `setComponentEnabled(section, 'secondaryCta', val)` |

#### P2-SEC-08: Direction buttons now have onClick handlers

Previously, the 4 direction arrow buttons (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) had no `onClick` handler -- purely decorative. Now each calls `setDirection(dir)` which writes to `section.layout.direction` (`'column'` or `'row'`).

#### P2-SEC-10: Max-Width input now controlled

Previously used `defaultValue="1280px"` (uncontrolled). Now reads from `section.layout.maxWidth` and writes back on change.

#### P2-SEC-09: Browse button marked as placeholder

The Browse button previously had no handler and no visual indication it was non-functional. Now shows `opacity-50 cursor-not-allowed` and a `title="Image picker coming soon"` tooltip. (Full ImagePicker wiring is a separate task.)

#### P2-SEC-11: RAW AISP block now shows real section data

Previously hardcoded AISP 1.2 format with static hero content. Now calls `buildAISPSummary()` which generates AISP 2.0 output from the actual section's type, id, variant, layout, components, and style.

#### P2-SEC-12: Copy button on RAW AISP now functional

Previously had no `onClick` handler. Now calls `navigator.clipboard.writeText(aispSummary)`.

#### Layout variant display reads from real config

The "Layout variant" info box previously showed hardcoded `display: flex / direction: column / align: center`. Now reads `layout.display`, `layout.direction`, and `layout.align` from the actual section config.

#### Component props display reads from real data

The component toggle descriptions (e.g., "Size: M | Style: Filled") previously showed hardcoded strings. Now they reflect the actual stored values.

---

### 2. SIMPLE Mode Editors (no changes needed)

All 15 SIMPLE mode section editors were audited. None contained developer-only controls:

- No color pickers
- No hex inputs  
- No padding/spacing controls
- No font weight controls
- No border radius controls
- No custom CSS inputs
- No heading size selectors

All editors correctly contain only: layout variant selectors, content inputs, show/hide toggles, and media inputs.

---

## Controls NOT Moved (correct placement)

These controls were verified to be in the correct mode:

- **SIMPLE mode:** Layout variant cards, content text inputs, show/hide toggles, ImagePicker, Light/Dark toggle (Hero) -- all appropriate
- **EXPERT mode:** Heading level selector, padding/gap inputs, direction/align controls, width/max-width, button style/size, badge position, raw AISP spec -- all appropriate for power users

---

## Known Remaining Issues (out of scope for this task)

| ID | Description | Reason |
|----|-------------|--------|
| P1-SEC-06 | Expert mode uses Hero-centric editor for all sections | Requires building per-section expert editors (8-12 hrs) |
| P1-SEC-01 | SectionExpert still shows Hero presets/fields for non-Hero sections | Same as above |
| P2-SEC-03 | Gallery uses raw URL inputs instead of ImagePicker | Separate ImagePicker wiring task |
| P2-SEC-04 | Image section uses raw URL inputs | Same as above |
| Aspect Ratio | Aspect ratio control removed (no schema field) | Needs schema addition first |

---

## Summary

- **Total fixes applied:** 10
- **Files modified:** 1 (`src/components/right-panel/expert/SectionExpert.tsx`)
- **Files audited (no changes needed):** 15 SIMPLE editors + `ExpertTab.tsx` + `SimpleTab.tsx`
- **Build status:** Passes (`tsc -b --force && vite build`)
- **Pattern followed:** All store updates use `setSectionConfig` + `updateComponentProps` / `setComponentEnabled`, matching the SIMPLE mode editor pattern

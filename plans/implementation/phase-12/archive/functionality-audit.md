# Phase 12 Functionality Audit

**Date:** 2026-04-05
**Auditor:** Claude (read-only code audit)
**Scope:** All functional features pre-Phase 12 work

---

## 1. Examples (10 total)

| # | File | Title | Theme Preset | Sections | Valid JSON | siteContext |
|---|------|-------|-------------|----------|------------|-------------|
| 1 | bakery.json | Sweet Spot Bakery | wellness | 7 | YES | NO |
| 2 | blank.json | Blank Canvas | minimalist | 4 | YES | NO |
| 3 | consulting.json | GreenLeaf Consulting | professional | 8 | YES | NO |
| 4 | education.json | CodeCraft Academy | startup | 8 | YES | NO |
| 5 | fitforge.json | FitForge Fitness | creative | 7 | YES | NO |
| 6 | florist.json | Bloom & Petal | personal | 7 | YES | NO |
| 7 | kitchen-sink.json | Nexus Labs | saas | 16 | YES | NO |
| 8 | launchpad.json | LaunchPad AI | saas | 7 | YES | NO |
| 9 | photography.json | Sarah Chen Photography | portfolio | 6 | YES | NO |
| 10 | restaurant.json | The Corner Table | wellness | 7 | YES | NO |

**Structure:** All 10 examples have valid JSON with `site` (title, description, version), `theme` (preset, mode, palette, typography), and `sections` array. All are registered in `src/data/examples/index.ts` as `EXAMPLE_SITES`.

**Issue:** None of the 10 examples have `siteContext` fields (tone, audience, purpose). This is expected -- Phase 12 introduces this feature.

---

## 2. Themes (12 total)

| # | File | Display Name | Font Family | Palette Keys | alternatePalette | Alt Palettes |
|---|------|-------------|-------------|-------------|-----------------|-------------|
| 1 | agency.json | Agency | Plus Jakarta Sans | 6 | YES | 4 |
| 2 | blog.json | Blog | DM Sans | 6 | YES | 4 |
| 3 | creative.json | Creative | Space Grotesk | 6 | YES | 4 |
| 4 | elegant.json | Elegant | Inter | 6 | YES | 4 |
| 5 | minimalist.json | Minimalist | JetBrains Mono | 6 | YES | 4 |
| 6 | neon.json | Neon | Space Grotesk | 6 | YES | 4 |
| 7 | personal.json | Personal | DM Sans | 6 | YES | 4 |
| 8 | portfolio.json | Portfolio | Space Grotesk | 6 | YES | 4 |
| 9 | professional.json | Professional | Inter | 6 | YES | 4 |
| 10 | saas.json | Tech Business | Inter | 6 | YES | 4 |
| 11 | startup.json | Startup | Space Grotesk | 6 | YES | 4 |
| 12 | wellness.json | Wellness | DM Sans | 6 | YES | 4 |

**Structure:** Each theme has `meta` (name, slug, description, tags, mood, heroVariant), `theme` (preset, mode, palette with 6 colors, alternatePalette, typography, spacing, borderRadius), and a full `sections` array serving as the default layout. Each has 4 `alternativePalettes`. All 12 registered in `src/data/themes/index.ts` as `THEME_REGISTRY`.

**Status:** COMPLETE. All 12 themes are structurally valid with complete color palettes and font stacks.

---

## 3. Chat Commands

**Source file:** `src/lib/cannedChat.ts`

### Single Commands (parseChatCommand)

| Command Pattern | Action | Status |
|----------------|--------|--------|
| "dark" / "dark mode" / "make it dark" / "go dark" / "show me a dark theme" | toggleMode:dark | WORKING |
| "light" / "light mode" / "make it light" / "go light" / "show me a light theme" | toggleMode:light | WORKING |
| "blue theme" / "change colors to blue" | applyVibe:saas | WORKING |
| "green theme" / "change colors to green" | applyVibe:wellness | WORKING |
| "make it professional" / "professional look" / "corporate" | applyVibe:professional | WORKING |
| "make it bold" / "bold" / "creative" / "make it creative" | applyVibe:creative | WORKING |
| "make it minimal" / "minimal" / "clean" / "simple" | applyVibe:minimalist | WORKING |
| "pricing" / "testimonials" / "faq" / "gallery" / "team" (bare section names) | addSection:{type} | WORKING |
| "add pricing" / "add a gallery" etc. | addSection:{type} | WORKING |
| "remove pricing" / "hide gallery" / "disable faq" | removeSection:{type} | WORKING |
| "headline Hello World" / "change headline to ..." | headline:{text} | WORKING |
| "theme saas" / "switch to portfolio" / "apply startup" | applyVibe:{theme} | WORKING |
| Bare theme name ("saas", "portfolio", etc.) | applyVibe:{theme} | WORKING |

### Multi-Part Commands (parseMultiPartCommand)

Triggers on 5+ word inputs with conjunctions (and, with, comma). Detects:
- Theme keywords (saas, agency, portfolio, startup, wellness, professional, minimalist, creative, personal)
- Section keywords (pricing, testimonials, faq, stats, gallery, team, features)
- Dark/light mode

Returns multi-action result when 2+ actions detected.

### Simulated Requirements (SIMULATED_REQUIREMENTS)

| # | Name | Actions |
|---|------|---------|
| 1 | SaaS Startup | SaaS theme + dark + pricing + testimonials + stats |
| 2 | Local Business | Wellness theme + light + gallery + testimonials + FAQ |
| 3 | Portfolio | Portfolio theme + dark + gallery + team |

**Status:** WORKING. 13+ distinct single-command patterns, multi-part natural language parsing, and 3 simulated requirements. All have handlers in cannedChat.ts.

**Missing (Phase 12 targets):**
- "target developers" (audience command)
- "set tone to playful" (tone command)
- "this is for enterprise clients" (audience command)
- These require the SiteContext system which does not exist yet.

---

## 4. Listen Demos (3 total)

**Source file:** `src/data/sequences/listen-sequences.json`
**Component:** `src/components/left-panel/ListenTab.tsx`

| # | ID | Label | Example Site | Captions | Status |
|---|-----|-------|-------------|----------|--------|
| 1 | bakery | Build a Bakery | Sweet Spot Bakery | 9 captions, 0-15.8s | COMPLETE |
| 2 | saas | Build a SaaS | LaunchPad AI | 9 captions, 0-15.8s | COMPLETE |
| 3 | portfolio | Build a Portfolio | Sarah Chen Photography | 8 captions, 0-13.8s | COMPLETE |

Each demo has: id, label, exampleSlug, exampleName, swatchColors (3 colors for UI), and timed captions. The ListenTab renders them as a 3-column button grid. Each triggers `runSimulateInput()` which runs a burst animation + typewriter text + demo simulator with captions.

**Status:** WORKING. All 3 demos have complete sequence definitions and are wired to `buildDemoFromCaptions` and `runDemo` from the demo simulator.

---

## 5. Spec Generators (6 total)

**Source directory:** `src/lib/specGenerators/`
**Consumer:** `src/components/center-canvas/XAIDocsTab.tsx`

| # | Generator | File | Export | Wired to UI | Format |
|---|-----------|------|--------|-------------|--------|
| 1 | North Star | northStarGenerator.ts | generateNorthStar | YES (Blueprints sub-tab) | Markdown |
| 2 | Architecture (SADD) | saddGenerator.ts | generateSADD | YES (Blueprints sub-tab) | Markdown |
| 3 | Build Plan | buildPlanGenerator.ts | generateBuildPlan | YES (Blueprints sub-tab) | Markdown |
| 4 | Features | featuresGenerator.ts | generateFeatures | YES (Blueprints sub-tab) | Markdown |
| 5 | Human Spec | humanSpecGenerator.ts | generateHumanSpec | YES (Blueprints sub-tab) | Markdown |
| 6 | AISP Spec | aispSpecGenerator.ts | generateAISPSpec | YES (Blueprints sub-tab) | AISP |

All 6 are exported from `src/lib/specGenerators/index.ts` and consumed by XAIDocsTab. Each takes `(config: MasterConfig) => string`. The UI provides Copy and Download buttons for each spec.

**Status:** WORKING. All 6 generators exist, are exported, and wired to the Blueprints tab.

**Issue (Phase 12 P0-D):** AISP is currently INSIDE the Blueprints sub-tabs. Phase 12 requires it to be relocated to its own top-level center tab. Currently there are 6 sub-tabs in Blueprints: North Star, Architecture, Build Plan, Features, Human Spec, AISP Spec.

---

## 6. Tab System

### Center Canvas Tabs (TabBar.tsx)

| Tab Key | Label | Expert-only | Rendered Component | Status |
|---------|-------|-------------|-------------------|--------|
| REALITY | Preview | No | RealityTab | WORKING |
| XAI_DOCS | Blueprints | No | XAIDocsTab | WORKING |
| DATA | Data | Yes | DataTab | WORKING |
| WORKFLOW | Pipeline | Yes | WorkflowTab | WORKING |

**Tab visibility logic:** Expert-only tabs (DATA, WORKFLOW) are shown when `rightPanelTab === 'EXPERT'`. This is correct per Phase 10/11 design.

### Data Tab (DataTab.tsx)
- Renders raw JSON config with **CodeMirror editor** (using `@uiw/react-codemirror` with `@codemirror/lang-json` and `oneDark` theme)
- Read mode: collapsible sections (Theme, then each section individually) with line/char counts
- Edit mode: full CodeMirror editor with debounced Zod validation
- Copy All, Export JSON, Import JSON buttons
- Edits validated against `masterConfigSchema` before applying

**Status:** WORKING. Data tab exists, uses CodeMirror, supports read/edit modes, validates JSON.

### Workflow Tab (WorkflowTab.tsx)
- Renders a **static pipeline** with 6 hardcoded steps: Voice Capture, Intent Parsing, Building Website, Schema Validation, Reality Render, Edge Deploy
- Shows "LIVE STREAM OUTPUT" with hardcoded log lines
- **Does NOT render the user story flow** (Visitor -> Hero -> Sections -> CTA -> Footer)
- **Does NOT read actual enabled sections** from the current config

**Status:** PARTIALLY BROKEN. The Workflow tab exists and renders, but shows a static pipeline/log view instead of the visitor journey flow described in Phase 12 requirements. It needs to be rewritten to show the actual section flow from the current config.

### AISP Tab
- **There is NO separate AISP top-level tab.** AISP is a sub-tab inside XAIDocsTab (Blueprints).
- TopBar.tsx imports `generateAISPSpec` for a copy-to-clipboard shortcut, but there is no dedicated AISP center tab.
- The TabBar has 4 tabs: REALITY, XAI_DOCS, DATA, WORKFLOW. No AISP tab.

**Status:** MISSING. Phase 12 P0-D requires AISP to become its own top-level tab with syntax highlighting, copy, and .aisp export. Currently it only exists as a Blueprints sub-tab.

---

## 7. Image Effects

### Effect Definitions (src/data/media/effects.json)
8 effects defined:

| # | ID | Label | CSS Class | Status |
|---|-----|-------|-----------|--------|
| 1 | gradient-overlay | Gradient Overlay | .effect-gradient-overlay | CSS EXISTS |
| 2 | ken-burns | Ken Burns | .effect-ken-burns | CSS EXISTS |
| 3 | slow-pan | Slow Pan | .effect-slow-pan | CSS EXISTS |
| 4 | zoom-hover | Zoom on Hover | .effect-zoom-hover | CSS EXISTS |
| 5 | parallax | Parallax Scroll | .effect-parallax | CSS EXISTS |
| 6 | glass-blur | Glass Blur | .effect-glass-blur | CSS EXISTS |
| 7 | grayscale-hover | Color on Hover | .effect-grayscale-hover | CSS EXISTS |
| 8 | vignette | Vignette | .effect-vignette | CSS EXISTS |

### CSS Implementation (src/index.css)
All 8 effects have CSS classes defined with proper keyframes (ken-burns, slow-pan) and pseudo-elements (gradient-overlay, glass-blur, vignette).

### ImagePicker Wiring
- ImagePicker (`src/components/right-panel/simple/ImagePicker.tsx`) has an "Effects" tab that displays all 8 effects from effects.json
- ImagePicker accepts `onEffectChange` and `currentEffect` props
- **CRITICAL:** `onEffectChange` is ONLY defined in `ImagePicker.tsx` -- no section editor passes this prop. The grep shows only 1 file references `onEffectChange` or `currentEffect`.
- No section editor (HeroSimple, ImageSectionSimple, GallerySimple, etc.) passes `onEffectChange` to ImagePicker
- No template renderer reads `style.imageEffect` to apply effect CSS classes

### Lightbox Component
- No `LightboxModal.tsx` exists anywhere in the codebase
- No lightbox/click-to-enlarge functionality is implemented

### Kitchen Sink Example
- `kitchen-sink.json` contains NO `imageEffect` references in any section's style

**Status:** PARTIALLY IMPLEMENTED. The CSS effects exist, the ImagePicker UI for browsing effects exists, but:
1. **Effects are NOT wired end-to-end** -- no section editor passes `onEffectChange` to ImagePicker
2. **Templates do NOT apply effect classes** -- no template reads `style.imageEffect`
3. **No lightbox component** exists
4. **Kitchen Sink does not demonstrate effects**

---

## 8. Site Context / Save-Load

### SiteContext Interface
- **Does NOT exist** in the codebase. No `SiteContext` type, no `siteContext` field in any schema.
- `src/lib/schemas/` has no references to tone, audience, or purpose as typed fields.
- The `configStore.ts` MasterConfig has no siteContext property.

### Save/Load (projectStore.ts)
- Save uses `localStorage` with `hb-project-{slug}` keys
- Saves the full MasterConfig JSON (whatever fields it has)
- ProjectMeta tracks: slug, name, savedAt, sectionCount, theme preset
- ProjectMeta does NOT track tone, audience, or purpose
- Export/Import work via JSON file download/upload with Zod validation

**Status:** Save/load infrastructure WORKS, but siteContext fields (tone, audience, purpose) do not exist in the schema, so they cannot be saved.

---

## 9. Summary

### Features Working (no issues)

| Feature | Count | Status |
|---------|-------|--------|
| Examples | 10 | All valid JSON, proper structure, registered |
| Themes | 12 | All complete with palettes, fonts, sections |
| Chat single commands | 13+ patterns | All have handlers |
| Chat multi-part | Conjunction detection | Working |
| Simulated requirements | 3 presets | Working |
| Listen demos | 3 sequences | All complete with captions |
| Spec generators | 6 | All exist, generate output, wired to UI |
| Data tab | 1 | CodeMirror editor, read/edit, import/export |
| Save/load | - | localStorage persistence working |

### Features Partially Working

| Feature | Issue |
|---------|-------|
| Workflow tab | Renders static pipeline, not visitor journey flow |
| Image effects CSS | 8 classes defined in CSS, but not applied by templates |
| ImagePicker effects UI | Browsable but not connected to section editors |

### Features Missing (Phase 12 scope)

| Feature | Priority | Description |
|---------|----------|-------------|
| AISP top-level tab | P0-D | AISP stuck in Blueprints sub-tabs, needs own center tab |
| Workflow rewrite | P0-B | Needs to show actual section flow, not static pipeline |
| Image effect wiring | P1-E | Section editors need to pass onEffectChange; templates need to apply classes |
| Lightbox component | P1-D | LightboxModal.tsx does not exist |
| Kitchen Sink effects | P1-F | No imageEffect values in kitchen-sink.json |
| SiteContext system | P2 | No interface, no schema, no editor, no fields |
| SiteContext in specs | P2-C | Generators do not use tone/audience/purpose |
| New chat commands (tone/audience) | P3-A | Requires SiteContext |
| New listen demo (food blog) | P3-B | Not created |
| New examples (blog, dev portfolio, enterprise SaaS) | P4 | Not created |

### Priority Breakdown

**P0 (Tab Restoration):**
- Data tab: DONE (working in EXPERT mode)
- Workflow tab: EXISTS but needs rewrite (shows static pipeline, not visitor flow)
- Blueprints 6 sub-tabs: DONE (all 6 visible and generating)
- AISP relocation: NOT DONE (still inside Blueprints)

**P1 (Image Effects):**
- CSS definitions: DONE (8/8 effects have CSS)
- ImagePicker effects UI: DONE (browsable)
- Wiring to section editors: NOT DONE
- Template rendering: NOT DONE
- Lightbox: NOT DONE
- Kitchen Sink demo: NOT DONE

**P2 (Site Context):**
- Entire system: NOT DONE (no schema, no editor, no integration)

**P3-P5:**
- All items: NOT STARTED

# Phase 12 UX Audit Report

**Date:** 2026-04-05  
**Auditor:** Automated code audit (read-only)  
**Scope:** All UI panels, controls, tabs, section editors, image effects, site context, lightbox

---

## 1. Tab System Status

### Center Panel TabBar (`src/components/center-canvas/TabBar.tsx`)

**Tabs defined:**
| Key | Label | Expert-only | Status |
|-----|-------|-------------|--------|
| REALITY | Preview | No | PRESENT |
| XAI_DOCS | Blueprints | No | PRESENT |
| DATA | Data | Yes | PRESENT |
| WORKFLOW | Pipeline | Yes | PRESENT |

**Findings:**
- Tab filtering works: `expert` tabs hidden when `rightPanelTab !== 'EXPERT'`
- SIMPLE mode shows: Preview, Blueprints -- CORRECT
- EXPERT mode shows: Preview, Blueprints, Data, Pipeline -- CORRECT
- **ISSUE P1-TAB-01:** Tab label says "Pipeline" but Phase 12 spec says "Workflow". Minor naming inconsistency.
- **ISSUE P0-TAB-02:** No AISP top-level tab exists. The `ActiveTab` type in `uiStore.ts` is `'REALITY' | 'DATA' | 'XAI_DOCS' | 'WORKFLOW'`. There is no `'AISP'` variant. AISP was supposed to be relocated OUT of Blueprints into its own top-level center tab per P0-D checklist. **NOT DONE.**
- **Tab order in EXPERT mode:** Preview | Blueprints | Data | Pipeline. Spec requires: Preview | Blueprints | Data | AISP | Workflow. Two issues: AISP tab missing, "Pipeline" should be "Workflow".

### Blueprints Sub-tabs (`src/components/center-canvas/XAIDocsTab.tsx`)

**Sub-tabs defined (SPEC_TABS array):**
| id | label | Generator | Status |
|----|-------|-----------|--------|
| north-star | North Star | generateNorthStar | PRESENT |
| architecture | Architecture | generateSADD | PRESENT |
| build-plan | Build Plan | generateBuildPlan | PRESENT |
| features | Features | generateFeatures | PRESENT |
| human | Human Spec | generateHumanSpec | PRESENT |
| aisp | AISP Spec | generateAISPSpec | PRESENT |

**Findings:**
- All 6 sub-tabs are present and wired to generators -- CORRECT for current state
- **ISSUE P0-TAB-03:** AISP Spec is still inside Blueprints as a sub-tab. Per P0-D, it should be relocated to its own top-level center tab. Blueprints should retain only 5 sub-tabs (North Star, Architecture, Build Plan, Features, Human Spec).
- Copy and Download buttons are functional on all sub-tabs
- AISP syntax highlighting with colored symbols is implemented
- Build Plan has a "How to use" hint -- good UX

### Data Tab (`src/components/center-canvas/DataTab.tsx`)

**Status:** FULLY IMPLEMENTED
- CodeMirror editor with JSON syntax highlighting
- Edit mode with validation against `masterConfigSchema`
- Copy All, Export JSON, Import JSON buttons
- Collapsible section viewer in read mode
- Live indicator, metadata bar (version, sections, chars, lines)
- No issues found -- this is well-built

### Workflow Tab (`src/components/center-canvas/WorkflowTab.tsx`)

**Status:** PARTIALLY IMPLEMENTED -- HARDCODED
- **ISSUE P1-TAB-04:** Shows hardcoded pipeline steps (Voice Capture, Intent Parsing, Building Website, Schema Validation, Reality Render, Edge Deploy) and hardcoded log lines. This is a static mock, NOT a dynamic visitor journey flow.
- Per spec, should show: `Visitor Arrives -> Hero -> Content Sections -> Action (CTA) -> Footer`, rendered from the actual current config's enabled sections.
- The current implementation is a developer-oriented build pipeline mock, not the user story flow specified.

---

## 2. Section Editors

### Right Panel Mode System

- **RightPanelTabBar** (`src/components/right-panel/RightPanelTabBar.tsx`): SIMPLE/EXPERT toggle works
- **SimpleTab** dispatches to 15 section-specific editors + ThemeSimple
- **ExpertTab** dispatches to: ThemeExpert or SectionExpert (single generic component for ALL sections)

**ISSUE P1-SEC-01:** ExpertTab uses ONE generic `SectionExpert` for ALL section types. Only Hero section has meaningful expert controls. All other section types (columns, pricing, gallery, etc.) get the same Hero-oriented expert panel with irrelevant presets (Modern, Minimalist, Visual, Bold), hero-specific content fields, and hero component toggles.

### Per-Section SIMPLE Mode Audit

#### Hero (`SectionSimple.tsx`)
- **Controls:** 8 layout presets (Full Photo, Full Video, Clean, Simple, Photo Right, Photo Left, Video Below, Photo Below), Show/Hide toggles (Tag Line, Main Button, Extra Button, Social Proof), Media (ImagePicker or video URL), Content (Title, Description, Tag Line, Main Button, Extra Button, Social Proof), Light/Dark toggle
- **Status:** CLEAN -- appropriate for SIMPLE mode
- **Issues:** None. Well-structured with layout cards, toggles, content inputs, single media input, light/dark. Follows the "grandma test".

#### Columns/Features (`FeaturesSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 8 layout variants (Cards, Image Cards, Icon+Text, Minimal, Numbered, Horizontal, Gradient, Glass), Content with per-card: icon select, title, description, toggle, add/remove
- **Status:** CLEAN
- **Issues:** None. Icon selector is simple dropdown, not a developer control.

#### CTA/Action (`CTASectionSimple.tsx`)
- **Controls:** 4 layouts (Centered, Side by Side, Gradient, Newsletter), Show/Hide (Heading, Subtitle, Button), Content (heading, subtitle, button text, button link)
- **Status:** CLEAN
- **Issues:** None

#### Pricing (`PricingSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 3 layouts (Cards, Toggle, Comparison), Show/Hide with Featured toggle per tier, Content per tier: name, price, billing period, features (one per line), button text, button link
- **Status:** MOSTLY CLEAN
- **ISSUE P2-SEC-02:** Billing period dropdown (`/month`, `/year`) and button link URL field are borderline for SIMPLE mode. These are content-level, not developer-level, so acceptable.

#### Footer (`FooterSectionSimple.tsx`)
- **Controls:** 3 layouts (Multi-Column, Simple Bar, Minimal), Show/Hide (Company Name, 3 link groups, Copyright), Content (brand name, column headings, links as one-per-line, copyright text)
- **Status:** CLEAN
- **Issues:** None

#### Quotes/Testimonials (`TestimonialsSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 4 layouts (Cards, Single, Stars, Minimal), Show/Hide per review, Content per review: quote, author name, role/title
- **Status:** CLEAN
- **Issues:** None

#### Questions/FAQ (`FAQSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 4 layouts (Expandable, Side by Side, Cards, Numbered), Content per item: toggle, question, answer
- **Status:** CLEAN
- **Issues:** None

#### Numbers/Value Props (`ValuePropsSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 4 layouts (Counters, Icons, Cards, Gradient), Show/Hide per number, Content per item: value, label, description
- **Status:** CLEAN
- **Issues:** None

#### Gallery (`GallerySectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 4 layouts (Grid, Masonry, Carousel, Full Width), Images: per item toggle, add/remove, image URL text input, caption
- **Status:** MOSTLY CLEAN
- **ISSUE P2-SEC-03:** Gallery uses raw Image URL text inputs instead of ImagePicker component. Users must paste URLs manually. Other sections (Hero, Logos, Team) use ImagePicker. Gallery should too for SIMPLE mode consistency.

#### Image (`ImageSectionSimple.tsx`)
- **Controls:** 4 layouts (Full Width, With Text, Overlay, Parallax), Content: image URL text input, heading, description
- **Status:** MOSTLY CLEAN
- **ISSUE P2-SEC-04:** Image section uses raw URL text input instead of ImagePicker. Same issue as Gallery.

#### Divider (`DividerSectionSimple.tsx`)
- **Controls:** 3 layouts (Line, Space, Decorative), Size selector (Small/Medium/Large/XL) when Space variant selected
- **Status:** CLEAN
- **Issues:** None

#### Text (`TextSectionSimple.tsx`)
- **Controls:** 3 layouts (Single, Two Column, Sidebar), Content: heading, body, sidebar (conditional)
- **Status:** CLEAN
- **Issues:** None

#### Logos (`LogosSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 3 layouts (Row, Marquee, Grid), Logos: per item toggle, add/remove, company name, ImagePicker for logo
- **Status:** CLEAN
- **Issues:** None. Uses ImagePicker correctly.

#### Team (`TeamSectionSimple.tsx`)
- **Controls:** SectionHeadingEditor, 3 layouts (Cards, Photo Grid, Minimal), Members: per item toggle, add/remove, name, role, ImagePicker for photo, description
- **Status:** CLEAN
- **Issues:** None. Uses ImagePicker correctly.

#### Menu/Navbar (`NavbarSectionSimple.tsx`)
- **Controls:** Show/Hide (Logo Text always on, Action Button toggle), Content: logo text, action button text
- **Status:** CLEAN
- **ISSUE P2-SEC-05:** No layout variant selector. Navbar only has one style with no choice. Other sections have 3-8 variants.

### EXPERT Mode Audit

#### SectionExpert (`src/components/right-panel/expert/SectionExpert.tsx`)
- **Controls:** Design presets (Modern, Minimalist, Visual, Bold), Content (HEADLINE, SUBTITLE, CTA TEXT, IMAGE browse placeholder), Heading Level (H1/H2/H3), Components toggles (Eyebrow Badge, Primary Button, Secondary Button, Hero Image, Trust Badges), Section Options (Direction, Align, Padding, Gap, Width, Aspect Ratio, Max-Width), Component Options (Button Style, Button Size, Button Color, Badge Position), Raw AISP Spec block
- **ISSUE P1-SEC-06:** This is a HERO-ONLY expert editor applied to ALL section types. Clicking Columns, Gallery, FAQ etc. in Expert mode shows Hero fields (headline, subtitle, CTA, hero image). The presets, component toggles, and button options are all Hero-specific.
- **ISSUE P1-SEC-07:** Several expert controls use local `useState` instead of writing to config store: `selectedPreset`, `headingLevel`, `selectedAlign`, `width`, `aspect`, `buttonStyle`, `buttonSize`, `badgePosition`. These controls appear functional but changes are lost on re-render and do not persist.
- **ISSUE P2-SEC-08:** Direction buttons (arrows) have no onClick handler -- they are purely decorative.
- **ISSUE P2-SEC-09:** Image "Browse" button has no onClick handler -- purely decorative placeholder.
- **ISSUE P2-SEC-10:** Max-Width input uses `defaultValue` instead of controlled state -- changes are lost.
- **ISSUE P2-SEC-11:** Raw AISP Spec block at bottom shows hardcoded AISP 1.2 format (outdated), not actual current config.
- **ISSUE P2-SEC-12:** Copy button on Raw AISP Spec has no onClick handler.

---

## 3. Image Effects Status

### effects.json (`src/data/media/effects.json`)

8 effects defined:
| # | Effect ID | Label | Status |
|---|-----------|-------|--------|
| 1 | gradient-overlay | Gradient Overlay | DEFINED |
| 2 | ken-burns | Ken Burns | DEFINED |
| 3 | slow-pan | Slow Pan | DEFINED |
| 4 | zoom-hover | Zoom on Hover | DEFINED |
| 5 | parallax | Parallax Scroll | DEFINED (requiresJs: true) |
| 6 | glass-blur | Glass Blur | DEFINED |
| 7 | grayscale-hover | Color on Hover | DEFINED |
| 8 | vignette | Vignette | DEFINED |

### CSS Keyframes/Classes (`src/index.css`)

| Effect | CSS Class | Keyframe | Status |
|--------|-----------|----------|--------|
| Ken Burns | `.effect-ken-burns` | `@keyframes ken-burns` | IMPLEMENTED |
| Slow Pan | `.effect-slow-pan` | `@keyframes slow-pan` | IMPLEMENTED |
| Zoom Hover | `.effect-zoom-hover` | N/A (transition) | IMPLEMENTED |
| Parallax | `.effect-parallax` | N/A (bg-attachment) | IMPLEMENTED |
| Gradient Overlay | `.effect-gradient-overlay` | N/A (::after pseudo) | IMPLEMENTED |
| Glass Blur | `.effect-glass-blur` | N/A (::after backdrop-filter) | IMPLEMENTED |
| Grayscale Hover | `.effect-grayscale-hover` | N/A (filter transition) | IMPLEMENTED |
| Vignette | `.effect-vignette` | N/A (::after radial-gradient) | IMPLEMENTED |

**All 8 CSS effect classes exist.**

### ImagePicker Effects Tab (`src/components/right-panel/simple/ImagePicker.tsx`)

- Effects tab is present in ImagePicker dialog
- Renders all 8 effects from `effects.json` as selectable buttons
- `onEffectChange` callback prop exists
- `currentEffect` prop for showing selected state

### Wiring Issues

- **ISSUE P0-FX-01:** No `imageEffect` property exists anywhere in the TypeScript codebase. The `onEffectChange` callback in ImagePicker is available but NO section editor passes it. Searching for `imageEffect` across all `.ts`/`.tsx` files returns zero results.
- **ISSUE P0-FX-02:** No template renderer reads or applies effect CSS classes. The effects are defined in CSS and selectable in ImagePicker UI, but the pipeline from selection -> section JSON -> template rendering is completely missing.
- **ISSUE P1-FX-03:** The `style` schema in `src/lib/schemas/style.ts` likely does not include `imageEffect` field (no matches found).
- **ISSUE P1-FX-04:** Only Hero section's ImagePicker is wired. Gallery and Image sections use raw URL inputs, not ImagePicker, so they cannot access the effects tab at all.

---

## 4. Site Context Status

**STATUS: NOT IMPLEMENTED**

- **ISSUE P0-CTX-01:** No `SiteContext` interface exists in TypeScript source.
- **ISSUE P0-CTX-02:** No `siteContext` field in `masterConfig.ts` schema.
- **ISSUE P0-CTX-03:** No Site Context editor component exists (no purpose/audience/tone selectors).
- **ISSUE P0-CTX-04:** No spec generators use site context data. The `northStarGenerator.ts` mentions "purpose and target audience" in boilerplate text but does not read any site context fields from config.
- The entire Site Context system (P2 in the checklist) has not been started.

---

## 5. Lightbox Status

**STATUS: NOT IMPLEMENTED**

- **ISSUE P0-LB-01:** No `LightboxModal.tsx` component exists in `src/components/`.
- **ISSUE P0-LB-02:** No lightbox/click-enlarge functionality exists anywhere in the codebase.
- **ISSUE P0-LB-03:** The `click-enlarge` effect is not in `effects.json` (which defines 8 effects, none being click-enlarge/lightbox).
- The lightbox was specified as P1-D in the checklist and is entirely missing.

---

## 6. SIMPLE vs EXPERT Mode Issues

### Controls properly in SIMPLE mode:
- Layout variant selectors (all 15 section editors)
- Content inputs with labels
- Show/Hide toggles
- Light/Dark toggle (Hero only -- other sections lack this)
- ImagePicker (Hero, Logos, Team)
- Add/Remove items (Features, Gallery, Logos, Team)

### Controls that should move to EXPERT (currently in SIMPLE):
- **None found.** All SIMPLE editors are clean. No color pickers, heading sizes, padding controls, hex inputs, border radius, or custom CSS leak into SIMPLE mode.

### Controls missing from EXPERT:
- **ISSUE P1-MODE-01:** EXPERT mode has only a generic Hero editor (`SectionExpert`). There are no EXPERT-specific editors for any other section type. Selecting a Columns, Gallery, Pricing, etc. section in EXPERT mode shows the Hero expert panel.
- **ISSUE P1-MODE-02:** No color picker controls exist in EXPERT mode for any section.
- **ISSUE P1-MODE-03:** No heading size (H1-H4) controls in EXPERT for non-Hero sections.
- **ISSUE P2-MODE-04:** No light/dark toggle in SIMPLE mode for non-Hero sections (Columns, Pricing, FAQ, etc.). Only Hero has it.

---

## 7. Summary

### Total Issues: 27

#### P0 -- Blockers (8)
| ID | Description |
|----|-------------|
| P0-TAB-02 | No AISP top-level center tab -- not created |
| P0-TAB-03 | AISP still inside Blueprints sub-tabs -- not relocated |
| P0-FX-01 | No `imageEffect` property in any TypeScript code -- effects not wired to data model |
| P0-FX-02 | No template renderer applies effect CSS classes -- effects UI is decorative only |
| P0-CTX-01 | No `SiteContext` interface exists |
| P0-CTX-02 | No `siteContext` field in master config schema |
| P0-CTX-03 | No Site Context editor component |
| P0-LB-01 | No LightboxModal component exists |

#### P1 -- Significant (9)
| ID | Description |
|----|-------------|
| P1-TAB-01 | Tab label says "Pipeline" instead of "Workflow" |
| P1-TAB-04 | Workflow tab shows hardcoded build pipeline, not dynamic visitor journey |
| P1-SEC-06 | Expert mode uses Hero-only editor for all section types |
| P1-SEC-07 | Expert panel controls use local state -- changes don't persist to config |
| P1-FX-03 | Style schema missing `imageEffect` field |
| P1-FX-04 | Gallery and Image sections use raw URL inputs, cannot access effects |
| P1-MODE-01 | No expert editors exist for non-Hero sections |
| P1-MODE-02 | No color picker controls in expert mode |
| P1-MODE-03 | No heading size controls in expert for non-Hero |
| P0-CTX-04 | Spec generators do not use site context |
| P0-LB-02 | No lightbox/click-enlarge functionality anywhere |
| P0-LB-03 | click-enlarge not in effects.json |

#### P2 -- Minor (10)
| ID | Description |
|----|-------------|
| P2-SEC-02 | Pricing billing period dropdown borderline for SIMPLE |
| P2-SEC-03 | Gallery uses raw URL inputs instead of ImagePicker |
| P2-SEC-04 | Image section uses raw URL inputs instead of ImagePicker |
| P2-SEC-05 | Navbar has no layout variant selector |
| P2-SEC-08 | Expert direction buttons have no handler |
| P2-SEC-09 | Expert image Browse button has no handler |
| P2-SEC-10 | Expert Max-Width input uses defaultValue, not controlled |
| P2-SEC-11 | Expert Raw AISP block shows hardcoded outdated format |
| P2-SEC-12 | Expert Raw AISP copy button has no handler |
| P2-MODE-04 | No light/dark toggle for non-Hero sections in SIMPLE mode |

### What Works Well
- Tab system filtering (SIMPLE/EXPERT) is correctly implemented
- Data tab is fully functional with CodeMirror, validation, import/export
- All 15 SIMPLE mode section editors are clean and follow the "grandma test"
- Blueprints tab has all 6 sub-tabs with working generators, copy, and download
- ImagePicker is well-built with photos, videos, effects tabs, search, categories
- All 8 CSS effect classes are properly defined in index.css
- effects.json has proper metadata for all 8 effects

### What Is Missing Entirely
1. AISP top-level tab (P0-D from checklist)
2. Site Context system (P2 from checklist -- purpose, audience, tone)
3. LightboxModal component (P1-D from checklist)
4. Effect wiring pipeline (selection -> JSON -> template rendering)
5. Per-section Expert editors (only Hero has one)
6. Dynamic Workflow/visitor journey rendering

### Estimated Effort to Close Phase 12
- AISP tab relocation: 2-3 hours
- Effect wiring (schema + store + templates): 4-6 hours  
- Site Context system: 6-8 hours
- Lightbox component: 2-3 hours
- Workflow tab rewrite: 2-3 hours
- Expert editor per-section: 8-12 hours (significant scope)
- Minor fixes (P2 items): 2-3 hours
- **Total: ~26-38 hours estimated**

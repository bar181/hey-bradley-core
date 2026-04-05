# Phase 12 Checklist — UX Fixes, Image Effects, Site Context, Content Intelligence

**Prerequisite:** Phase 11 CLOSED (83/100)  
**Source of truth:** `plans/implementation/phase-12/human-1.md`  
**Target score:** 85+/100  
**Estimated swarm time:** 16-18 hours  

---

## Priority 0: Tab Restoration (Before Any New Features)

### P0-A: Restore Data Tab (EXPERT mode only)
- [ ] Data tab visible in EXPERT mode
- [ ] Data tab hidden in SIMPLE mode
- [ ] Raw JSON config renders with CodeMirror editor
- [ ] Edits in Data tab update live preview
- [ ] Tab order EXPERT: Preview | Blueprints | Data | AISP | Workflow

### P0-B: Restore Workflow Tab (EXPERT mode only)
- [ ] Workflow tab visible in EXPERT mode
- [ ] Workflow tab hidden in SIMPLE mode
- [ ] User story flow renders: Visitor → Hero → Content Sections → CTA → Footer
- [ ] Flow diagram reflects actual enabled sections from current config
- [ ] No backend/data-flow diagrams — visitor journey only

### P0-C: Confirm Blueprints Tab Structure
- [ ] North Star sub-tab visible and generating
- [ ] Architecture (SADD) sub-tab visible and generating
- [ ] Build Plan (Implementation) sub-tab visible and generating
- [ ] Features sub-tab visible and generating
- [ ] Human Spec sub-tab visible and generating
- [ ] AISP Spec sub-tab visible and generating (until relocated in P1-A)

### P0-D: AISP Tab Relocation
- [ ] AISP moved OUT of Blueprints sub-tabs
- [ ] AISP becomes its own top-level center tab
- [ ] AISP tab shows full Crystal Atom output for current project
- [ ] Copy button on AISP tab
- [ ] Export as `.aisp` file button
- [ ] Syntax-highlighted rendering (monospace, colored Ω/Σ/Γ/Λ/Ε symbols)
- [ ] Blueprints retains 5 sub-tabs (North Star, Architecture, Build Plan, Features, Human Spec)
- [ ] Tab order SIMPLE: Preview | Blueprints
- [ ] Tab order EXPERT: Preview | Blueprints | Data | AISP | Workflow

---

## Priority 1: Image Effects Suite

### P1-A: Audit Existing Effects
- [ ] Check `src/data/media/effects.json` for effect definitions
- [ ] Check `index.css` for CSS keyframes/classes
- [ ] Load Kitchen Sink example and test each effect in ImagePicker
- [ ] Document which of the 8 effects work, which are broken/missing

### P1-B: Core Effects (8 required)
- [ ] Ken Burns — `@keyframes` slow zoom, 20s infinite
- [ ] Slow Pan — `@keyframes` horizontal pan, 25s infinite
- [ ] Zoom on Hover — `hover:scale-110` with 500ms transition
- [ ] Click to Enlarge / Lightbox — modal overlay component (see P1-D)
- [ ] Gradient Transparency — dark gradient overlay from bottom
- [ ] Parallax Scroll — `background-attachment: fixed` or IntersectionObserver
- [ ] Glass Blur — `backdrop-filter: blur(12px)` with semi-transparent overlay
- [ ] Grayscale to Color — grayscale default, full color on hover

### P1-C: Bonus Effects (if time permits)
- [ ] Vignette — radial gradient dark edges
- [ ] Fade In on Scroll — IntersectionObserver + opacity transition
- [ ] Tilt on Hover — perspective 3D tilt

### P1-D: Lightbox Component (LightboxModal.tsx)
- [ ] New `LightboxModal.tsx` component created in `src/components/`
- [ ] Dark backdrop (rgba(0,0,0,0.85))
- [ ] Image centered at max resolution (object-fit: contain)
- [ ] Click outside to close
- [ ] ESC key to close
- [ ] Wired to Gallery, Image, and Hero sections with `imageEffect: "click-enlarge"`

### P1-E: Wire Effects to ImagePicker
- [ ] Effect Selector panel added to ImagePicker
- [ ] Button group: None, Ken Burns, Slow Pan, Zoom Hover, Click Enlarge, Gradient, Parallax, Glass Blur, Grayscale, Vignette
- [ ] Selected effect stored in section JSON as `style.imageEffect`
- [ ] Live preview of selected effect in ImagePicker
- [ ] Template renderers read `imageEffect` and apply CSS class

### P1-F: Kitchen Sink Verification
- [ ] Hero: Ken Burns on background image
- [ ] Gallery: Zoom on Hover on thumbnails
- [ ] Columns (Image Cards): Grayscale to Color
- [ ] Action: Gradient Transparency on background
- [ ] Image section: Parallax scroll
- [ ] At least 5 distinct effects demonstrated across sections

---

## Priority 2: Site Context System

### P2-A: SiteContext JSON Schema
- [ ] `SiteContext` interface defined in TypeScript
- [ ] `purpose` field: marketing | portfolio | saas | blog | agency | restaurant | ecommerce
- [ ] `audience` field: consumer | business | developer | enterprise | creative
- [ ] `tone` field: formal | casual | playful | technical | warm | bold
- [ ] `contentGuidelines`: maxWordsPerSection, visualDensity, ctaStyle
- [ ] `brandGuidelines`: brandName, tagline, voiceAttributes[], doNotUse[]
- [ ] Schema integrated into MasterConfig

### P2-B: Site Context Editor (Right Panel)
- [ ] "Site Settings" item in left panel (or shown when no section selected)
- [ ] Purpose selector (button group)
- [ ] Audience selector (button group)
- [ ] Tone selector (button group)
- [ ] Brand Name text input
- [ ] Tagline text input
- [ ] Voice attributes (multi-select tags)
- [ ] Selections update JSON config immediately
- [ ] Persists in project save/load

### P2-C: Specs Reflect Site Context
- [ ] North Star generator uses purpose + audience for vision
- [ ] Build Plan uses tone + content guidelines for copy length/CTA style
- [ ] AISP Crystal Atom encodes context as Λ bindings
- [ ] All 6 generators produce different output based on site context

---

## Priority 3: Enhanced Simulations

### P3-A: New Chat Commands
- [ ] "make it professional" → sets tone to formal
- [ ] "target developers" → sets audience to developer
- [ ] "set tone to playful" → sets tone to playful
- [ ] "this is for enterprise clients" → sets audience to enterprise
- [ ] Commands update site context and preview in real-time

### P3-B: New Listen Demos
- [ ] Demo: "Build me a casual food blog with lots of photos" → tone=casual, purpose=blog, audience=consumer, visualDensity=rich → loads blog example

---

## Priority 4: New Examples per Audience/Purpose

- [ ] Fun blog example (casual tone, consumer audience, rich visuals)
- [ ] Developer portfolio example (technical tone, developer audience, minimal visuals)
- [ ] Enterprise SaaS example (formal tone, enterprise audience, prominent CTAs)
- [ ] Each example has siteContext fields filled in

---

## Priority 5: Full Section-by-Section UX Cleanup

### P5-A: Broken Buttons Audit
- [ ] Audit all 20 section types: Hero, Columns, Pricing, Action, Quotes, Questions, Numbers, Gallery, Menu, Footer, Image, Divider, Text, Logos, Team, + variants
- [ ] Every button clicked and verified functional
- [ ] Every toggle tested — preview updates confirmed
- [ ] Every text input tested — content updates in preview confirmed
- [ ] Every layout variant tested — preview changes confirmed
- [ ] Broken controls documented in `plans/implementation/phase-12/broken-controls.md`
- [ ] All broken controls fixed

### P5-B: SIMPLE vs EXPERT Mode Audit
- [ ] SIMPLE mode reviewed for ALL 20 section editors
- [ ] SIMPLE mode contains ONLY: layout variant, content inputs with toggles, one image/media input, light/dark toggle
- [ ] Color pickers moved to EXPERT
- [ ] Heading size (H1-H4) moved to EXPERT
- [ ] Padding/spacing controls moved to EXPERT
- [ ] Font weight/bold/reset moved to EXPERT
- [ ] Multiple image URL fields moved to EXPERT
- [ ] Hex color inputs moved to EXPERT
- [ ] Border radius controls moved to EXPERT
- [ ] Custom CSS class inputs moved to EXPERT

---

## Priority 6: Quality Pass + Phase Close

### P6-A: Testing & Build
- [ ] `npx tsc -b` passes (zero errors)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes — target 80+ tests (currently 71)
- [ ] 5-10 new tests for effects, tab restoration, site context
- [ ] No regressions in existing demos/examples
- [ ] Vercel deployment green

### P6-B: Review & Documentation
- [ ] Persona review: Agentic Engineer 75+ target
- [ ] Full retrospective written → `plans/implementation/phase-12/retrospective.md`
- [ ] Living checklist updated (this file)
- [ ] Session log updated
- [ ] CLAUDE.md updated with Phase 12 status
- [ ] Grounding report for Phase 13

---

## Execution Order

```
1. Tab restoration (Data, Workflow, confirm Blueprints)        — 1 hr
2. AISP tab relocation (Blueprints → top-nav)                  — 1 hr
3. Image effects audit + completion                            — 2-3 hrs
4. Click to Enlarge lightbox component                         — 1 hr
5. Kitchen Sink example update with effects                    — 30 min
6. Section-by-section UX cleanup (broken buttons, SIMPLE/EXPERT) — 3-4 hrs
7. Site Context system (tone/audience/purpose)                 — 3-4 hrs
8. Enhanced simulations + new examples                         — 2 hrs
9. Quality pass + phase close                                  — 1.5 hrs
```

**Rule:** Fix what exists before adding new features. Cleanup (#6) before Site Context (#7).

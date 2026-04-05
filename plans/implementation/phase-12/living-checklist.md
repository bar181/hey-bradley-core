# Phase 12 Living Checklist

**Last updated:** 2026-04-05 (Session 2 build sprint)  
**Status:** IN PROGRESS — P0 build complete, sub-phases pending  

---

## Priority 0: Tab Restoration + AISP Relocation — COMPLETE

- [x] Data tab visible in EXPERT mode
- [x] Data tab hidden in SIMPLE mode  
- [x] Workflow/Pipeline tab visible in EXPERT mode
- [x] Workflow/Pipeline tab hidden in SIMPLE mode
- [x] Blueprints: North Star sub-tab visible and generating
- [x] Blueprints: Architecture (SADD) sub-tab visible and generating
- [x] Blueprints: Build Plan sub-tab visible and generating
- [x] Blueprints: Features sub-tab visible and generating
- [x] Blueprints: Human Spec sub-tab visible and generating
- [x] **AISP relocated to own top-level center tab** ← AISPTab.tsx created
- [x] AISP tab: syntax-highlighted rendering (colored Ω/Σ/Γ/Λ/Ε)
- [x] AISP tab: Copy button
- [x] AISP tab: Export .aisp button
- [x] Tab order EXPERT: Preview | Blueprints | Data | AISP | Pipeline
- [x] Tab order SIMPLE: Preview | Blueprints

## Priority 1: Image Effects Suite — COMPLETE

### Effects Pipeline
- [x] `style.imageEffect` field added to section schema (style.ts imageEffectSchema)
- [x] ImagePicker effect selector wired with onEffectChange in all section editors
- [x] Template renderers apply effect CSS classes (hero, gallery, image templates)
- [x] Kitchen Sink: 5 sections with effects (ken-burns, zoom-hover, parallax, gradient-overlay, grayscale-hover)
- [x] `getImageEffectClass()` utility helper created (sectionContent.ts)

### Core Effects (8 required)
- [x] Ken Burns CSS defined + wired
- [x] Slow Pan CSS defined + wired
- [x] Zoom on Hover CSS defined + wired
- [x] Gradient Overlay CSS defined + wired
- [x] Parallax CSS defined + wired
- [x] Glass Blur CSS defined + wired
- [x] Grayscale to Color CSS defined + wired
- [x] Vignette CSS defined + wired
- [x] All 8 effects render when applied via section JSON

### LightboxModal — COMPLETE
- [x] LightboxModal.tsx component created (src/components/ui/)
- [x] useLightbox.ts hook created (src/hooks/)
- [x] Dark backdrop (rgba(0,0,0,0.85)), centered image, ESC/click-outside close
- [x] Wired to Gallery sections (all 4 variants: Grid, Masonry, FullWidth, Carousel)
- [x] Wired to Image sections (all 3 variants: FullWidth, WithText, Overlay)
- [x] Wired to Hero sections (HeroCentered, HeroSplit) with click-enlarge
- [x] Tailwind animation (lightbox-fade-in) added to tailwind.config.ts
- [x] Body scroll lock while open
- [x] Accessible: role="dialog", aria-label

### Wow-Factor Bonus Effects — COMPLETE
- [x] Holographic shimmer (scale + rainbow box-shadow glow)
- [x] 3D tilt on hover (perspective + rotateY/rotateX)
- [x] Sepia-to-color transition (filter: sepia → none)
- [x] Reveal slide (::after overlay slides away on hover)
- [x] Fade in on scroll (opacity + translateY, .visible class)
- [x] All 5 added to effects.json, style.ts schema, index.css

### Image Consistency Across Sections — COMPLETE
- [x] Every section with image selection uses ImagePicker
- [x] ImagePicker shows 258+ image library (Photos tab)
- [x] ImagePicker shows 50+ video library (Videos tab)
- [x] ImagePicker shows effect selector (Effects tab) in all contexts
- [x] Hero section: ImagePicker verified (photo + video)
- [x] Gallery section: ImagePicker verified (replaced raw URL inputs)
- [x] Image section: ImagePicker verified (replaced raw URL inputs)
- [x] Team section: ImagePicker verified
- [x] Logos section: ImagePicker verified
- [x] All onEffectChange + currentEffect props passed

### Spec Generator Integration — COMPLETE
- [x] Build Plan: IMAGE_EFFECT_DESCRIPTIONS mapping, effect name + CSS class in output
- [x] AISP: ImageEffect type in Σ, Λ.fx Crystal Atom per section
- [x] Human Spec: "Image Effect" row in section properties
- [x] SADD: ImageEffect type + column in section inventory
- [x] Features: Media & Visual category lists all effects
- [x] North Star: 60fps performance criterion when effects used

## Priority 2: Site Context System — COMPLETE

- [x] `purpose` field added to MasterConfig.site schema (6 options)
- [x] `audience` field added to MasterConfig.site schema (4 options)
- [x] `tone` field added to MasterConfig.site schema (6 options)
- [x] `brandName` field added to MasterConfig.site schema
- [x] `tagline` field added to MasterConfig.site schema
- [x] `voiceAttributes` field added to MasterConfig.site schema
- [x] SiteContextEditor component created (src/components/right-panel/simple/)
- [x] Purpose selector (pill button group, 6 options)
- [x] Audience selector (pill button group, 4 options)
- [x] Tone selector (pill button group, 6 options)
- [x] Brand name + tagline text inputs
- [x] "Site Settings" in left panel with gear icon
- [x] Renders when Site Settings clicked
- [x] Values persist via Zustand config store
- [x] North Star generator: Site Context section with purpose + audience
- [x] Build Plan generator: Content Guidelines section with tone
- [x] AISP generator: context Λ bindings (purpose/audience/tone/brand/voice)
- [x] SADD, Features, Human Spec: context one-liner in header

## Priority 3: Enhanced Simulations — DEFERRED TO SUB-PHASE

- [ ] Chat command: "make it professional" → tone=formal
- [ ] Chat command: "target developers" → audience=developer
- [ ] Chat command: "set tone to playful" → tone=playful
- [ ] New listen demo: food blog scenario

## Priority 4: New Examples — DEFERRED TO SUB-PHASE

- [ ] Fun blog example (casual, consumer, rich)
- [ ] Developer portfolio example (technical, developer, minimal)
- [ ] Enterprise SaaS example (formal, enterprise, prominent CTAs)

## Priority 5: Section Editor Cleanup — COMPLETE

- [x] Expert mode: 10 broken controls fixed (useState → config store)
- [x] Expert controls persist to config store (setSectionConfig, updateComponentProps)
- [x] SIMPLE mode: all 15 editors audited — no developer controls leaking
- [x] Direction buttons, max-width, button styles, badge position all wired
- [x] RAW AISP block generates live AISP 2.0 from section data
- [x] Copy button functional (clipboard API)
- [x] `phase-12/section-cleanup-log.md` written

## Priority 6: Quality Pass — IN PROGRESS

- [x] `npm run build` succeeds (5.2s)
- [x] `npm test` passes — 87 tests, 0 failures
- [ ] Vercel deployment verified
- [ ] Retrospective score updated
- [ ] Session log finalized
- [ ] CLAUDE.md updated
- [ ] Phase 13 preflight confirmed

---

## Sub-Phase 12B: Developer Guides & Resources Tab — COMPLETE

### Resources Tab (new top-level center tab)
- [x] "Resources" tab added (EXPERT mode: Preview | Blueprints | Resources | Data | Pipeline)
- [x] Sub-tab 1: Templates & Standard JSON — 12 themes, 13 examples, 15 section types with expandable JSON
- [x] Sub-tab 2: AISP Guide — Crystal Atom components, conversion example, Σ_512 reference, repo link
- [x] Sub-tab 3: Media Library — searchable grid of 258+ images and 50+ videos with category filters
- [x] Sub-tab 4: Wiki placeholder with repo link

### Blueprints Enhancements
- [x] North Star: Design System section (palette, typography, spacing tables)
- [x] SADD: Image effects table, full color palette, typography specs
- [x] Build Plan: JSON + AISP references, enhanced color palette with usage
- [x] Human Spec: "Who & What" section, cross-references to Architecture/Build Plan
- [x] Features: Image Effects + Site Context feature categories
- [x] AISP: Cross-reference comments to all other specs
- [x] JSON sub-tab in Blueprints (live config, 7th sub-tab)

### Enhanced Simulations
- [x] "make it professional" → tone=formal
- [x] "target developers" → audience=developer
- [x] "make it fun" / "playful" → tone=playful
- [x] "enterprise" → audience=enterprise
- [x] "casual tone" → tone=casual
- [ ] New listen demo: food blog scenario (deferred to P13)

### New Examples (13 total, up from 10)
- [x] Fun blog: The Daily Scoop (casual, consumer, creative theme)
- [x] Developer portfolio: Alex Chen (technical, developer, minimalist theme)
- [x] Enterprise SaaS: CloudSync Enterprise (formal, enterprise, saas theme)

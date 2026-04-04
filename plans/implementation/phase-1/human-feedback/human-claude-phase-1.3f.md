Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Phase 1.3e: Theme System v3 — Research, Plan, Build

 Context

 The theme system has been iterated 8 times. Each time, themes were built before understanding what a theme IS. The result: 10 themes that
 look nearly identical (color swaps only). This phase replaces all 10 with invisible-design-named themes (SaaS, Agency, Portfolio, etc.) that
 are visually distinct via layout, component visibility, imagery, and palette — not just color.

 Current state: 10 themes with abstract names (stripe-flow, neon-terminal, etc.), 8-slot color system, hardcoded theme cards, no palette/font
 selectors.

 Target state: 10 invisible-design themes, 6-slot palette system, 5 alternative palettes per theme, font selector, accurate theme card
 previews, component visibility matrix enforced.

 ---
 Sub-Phase A: Research + ADRs (No Code)

 Tasks

 - A1: Web search top website categories + hero patterns from Webflow/Squarespace/ThemeForest/Framer
 - A2: Create docs/research/theme-and-hero-research.md with Parts A (top 10 categories), B (hero designs per category), C (component
 inventory)
 - A3: Write ADR-017 — Theme Names Use Invisible Design (familiar category names)
 - A4: Write ADR-018 — Theme as Full JSON Template Replacement (with meta block)
 - A5: Write ADR-019 — 6-Slot Color Palette System (bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary)
 - A6: Write ADR-020 — Component Visibility Per Theme (10x9 matrix)

 DoD (Sub-Phase A)

 1. docs/research/theme-and-hero-research.md exists with all 3 parts
 2. ADRs 017-020 exist in docs/adr/
 3. Each ADR has: Decision, Context, Consequences, Status: Accepted
 4. Research doc references real marketplace data (not fabricated)

 Files Created

 - docs/research/theme-and-hero-research.md (new)
 - docs/adr/ADR-017-invisible-design-naming.md (new)
 - docs/adr/ADR-018-theme-meta-schema.md (new)
 - docs/adr/ADR-019-six-slot-palette.md (new)
 - docs/adr/ADR-020-component-visibility-matrix.md (new)

 ---
 Sub-Phase B: JSON Data Architecture (Data Files Only)

 Tasks

 - B1: Create src/data/fonts/fonts.json — 5 fonts (Inter, DM Sans, Space Grotesk, JetBrains Mono, Plus Jakarta Sans) with weights + Google
 Fonts URLs
 - B2: Create src/data/media/media.json — image/video URLs per theme (Unsplash for images, Pexels for videos)
 - B3: Create src/data/palettes/palettes.json — 5 palette options per theme (50 total), each with 6 slots
 - B4: Create src/data/themes/saas.json — centered, dark, gradient, video below, all components
 - B5: Create src/data/themes/agency.json — split-right, light, portfolio image right
 - B6: Create src/data/themes/portfolio.json — overlay, dark, full-bleed bg image
 - B7: Create src/data/themes/blog.json — split-right, light, featured image
 - B8: Create src/data/themes/startup.json — centered, dark, background video
 - B9: Create src/data/themes/personal.json — split-left, light, headshot photo
 - B10: Create src/data/themes/professional.json — centered, light, no image, trust-focused
 - B11: Create src/data/themes/wellness.json — overlay, dark, nature bg image
 - B12: Create src/data/themes/creative.json — centered, dark, background video, bold type
 - B13: Create src/data/themes/minimalist.json — minimal, light, text-only, max whitespace

 Theme JSON Structure (each file)

 {
   "meta": {
     "name": "SaaS",
     "slug": "saas",
     "description": "For software products, developer tools, and tech platforms",
     "tags": ["dark", "centered", "gradient", "technical"],
     "mood": "Premium and technical",
     "heroVariant": "centered"
   },
   "theme": {
     "preset": "saas",
     "mode": "dark",
     "palette": {
       "bgPrimary": "#0a0a1a",
       "bgSecondary": "#12122a",
       "textPrimary": "#f8fafc",
       "textSecondary": "#94a3b8",
       "accentPrimary": "#6366f1",
       "accentSecondary": "#818cf8"
     },
     "colors": { /* backward compat: mapped from palette */ },
     "alternativePalettes": [ /* 4 alternatives */ ],
     "typography": { "fontFamily": "Inter", "headingFamily": "Inter", "headingWeight": 700, "baseSize": "16px", "lineHeight": 1.7 },
     "spacing": { "sectionPadding": "80px", "containerMaxWidth": "1200px", "componentGap": "24px" },
     "borderRadius": "12px"
   },
   "sections": [ /* hero + features + pricing/cta + footer with component enabled flags */ ]
 }

 Component Visibility Matrix (enforced in each theme JSON)

 ┌─────────────────┬──────┬────────┬───────────┬──────┬─────────┬──────────┬──────────────┬──────────┬──────────┬────────────┐
 │    Component    │ SaaS │ Agency │ Portfolio │ Blog │ Startup │ Personal │ Professional │ Wellness │ Creative │ Minimalist │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ eyebrowBadge    │ ON   │ OFF    │ OFF       │ OFF  │ ON      │ OFF      │ OFF          │ OFF      │ ON       │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ headline        │ ON   │ ON     │ ON        │ ON   │ ON      │ ON       │ ON           │ ON       │ ON       │ ON         │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ subtitle        │ ON   │ ON     │ ON        │ ON   │ ON      │ ON       │ ON           │ ON       │ OFF      │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ primaryCTA      │ ON   │ ON     │ ON        │ ON   │ ON      │ ON       │ ON           │ ON       │ ON       │ ON         │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ secondaryCTA    │ ON   │ ON     │ OFF       │ OFF  │ ON      │ OFF      │ ON           │ OFF      │ OFF      │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ heroImage       │ ON   │ ON     │ OFF       │ ON   │ OFF     │ ON       │ OFF          │ OFF      │ OFF      │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ backgroundImage │ OFF  │ OFF    │ ON        │ OFF  │ OFF     │ OFF      │ OFF          │ ON       │ OFF      │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ backgroundVideo │ OFF  │ OFF    │ OFF       │ OFF  │ ON      │ OFF      │ OFF          │ OFF      │ ON       │ OFF        │
 ├─────────────────┼──────┼────────┼───────────┼──────┼─────────┼──────────┼──────────────┼──────────┼──────────┼────────────┤
 │ trustBadges     │ ON   │ ON     │ OFF       │ OFF  │ OFF     │ OFF      │ ON           │ ON       │ OFF      │ OFF        │
 └─────────────────┴──────┴────────┴───────────┴──────┴─────────┴──────────┴──────────────┴──────────┴──────────┴────────────┘

 Layout Variant Distribution

 - centered: SaaS, Startup, Professional, Creative
 - split-right: Agency, Blog
 - split-left: Personal
 - overlay: Portfolio, Wellness
 - minimal: Minimalist

 DoD (Sub-Phase B)

 1. All 10 theme JSON files exist in src/data/themes/
 2. palettes.json, fonts.json, media.json exist
 3. Each theme JSON has: meta, theme (with palette + colors backward compat), sections
 4. Component enabled flags match the visibility matrix exactly
 5. Layout variants match the distribution table
 6. Each theme has 4 alternative palettes in alternativePalettes
 7. colors block is auto-derived from palette for backward compat
 8. 2 themes have backgroundVideo enabled (Startup, Creative)
 9. 2 themes have backgroundImage enabled (Portfolio, Wellness)
 10. 1 theme has no image at all (Minimalist)

 Files Created

 - src/data/fonts/fonts.json (new)
 - src/data/media/media.json (new)
 - src/data/palettes/palettes.json (new)
 - src/data/themes/saas.json (new)
 - src/data/themes/agency.json (new)
 - src/data/themes/portfolio.json (new)
 - src/data/themes/blog.json (new)
 - src/data/themes/startup.json (new)
 - src/data/themes/personal.json (new)
 - src/data/themes/professional.json (new)
 - src/data/themes/wellness.json (new)
 - src/data/themes/creative.json (new)
 - src/data/themes/minimalist.json (new)

 ---
 Sub-Phase C: Schema + Store + Bridge (TypeScript Changes)

 Tasks

 - C1: Update src/lib/schemas/masterConfig.ts — add paletteSchema (6 slots), themeMetaSchema, alternativePaletteSchema; keep existing colors
 as optional
 - C2: Create src/lib/resolveColors.ts — bridge that maps palette→colors or colors→palette for backward compat
 - C3: Update src/store/configStore.ts — replace 10 old imports with 10 new, update THEMES map, add applyPalette(), applyFont(), toggleMode()
 - C4: Create src/data/themes/index.ts — theme registry that exports all themes with metadata
 - C5: Update src/data/default-config.json — change preset from "modern-dark" to "saas", add palette block
 - C6: Update src/data/template-config.json — add palette, meta, alternativePalettes fields

 DoD (Sub-Phase C)

 1. Zod schema validates all 10 new theme JSONs without errors
 2. resolveColors() maps both directions (palette→colors, colors→palette)
 3. configStore.ts imports all 10 new themes, old themes removed
 4. applyVibe('saas') works — full replacement with copy preservation
 5. applyPalette(index) swaps palette within current theme
 6. applyFont(fontFamily) updates typography across all sections
 7. default-config.json preset is "saas"
 8. Build passes (npm run build)

 Files Modified

 - src/lib/schemas/masterConfig.ts (modified — lines 49-106)
 - src/store/configStore.ts (modified — lines 4-29 imports, 150-198 methods)
 - src/data/default-config.json (modified — line 13 preset, lines 15-23 colors)
 - src/data/template-config.json (modified)

 Files Created

 - src/lib/resolveColors.ts (new)
 - src/data/themes/index.ts (new)

 ---
 Sub-Phase D: UI Components (React)

 Tasks

 - D1: Rewrite src/components/right-panel/simple/ThemeSimple.tsx — remove hardcoded array, derive from theme meta, 2-column grid, accurate
 mini previews
 - D2: Create src/components/right-panel/simple/PaletteSelector.tsx — 5 rows of 6 color dots, radio select, calls applyPalette()
 - D3: Create src/components/right-panel/simple/FontSelector.tsx — 5 font buttons, calls applyFont()
 - D4: Add light/dark toggle to ThemeSimple (inline, calls toggleMode())
 - D5: Update hero renderers to use resolveColors() — HeroCentered.tsx, HeroOverlay.tsx, HeroMinimal.tsx

 DoD (Sub-Phase D)

 1. Theme cards show in 2-column grid
 2. Each card shows accurate preview (correct bg color/gradient, font, layout direction, CTA button color)
 3. Clicking a theme card changes hero layout + components + palette (not just colors)
 4. Palette selector shows 5 options with 6 dots each
 5. Font selector shows 5 font options
 6. Light/dark toggle works
 7. Copy preserved across all theme switches
 8. No TypeScript errors, build passes

 Files Modified

 - src/components/right-panel/simple/ThemeSimple.tsx (rewrite)
 - src/templates/hero/HeroCentered.tsx (modified — resolveColors)
 - src/templates/hero/HeroOverlay.tsx (modified — resolveColors)
 - src/templates/hero/HeroMinimal.tsx (modified — resolveColors)

 Files Created

 - src/components/right-panel/simple/PaletteSelector.tsx (new)
 - src/components/right-panel/simple/FontSelector.tsx (new)

 ---
 Sub-Phase E: Cleanup + Verify

 Tasks

 - E1: Delete 10 old theme files (stripe-flow, notion-warm, etc.)
 - E2: Run build — npm run build
 - E3: Run tests — npm test
 - E4: Visual verification — load each theme, check layout/components/palette
 - E5: Score against rubric (must be >= 85)

 DoD (Sub-Phase E)

 1. No old theme files remain in src/data/themes/
 2. Build passes clean
 3. Tests pass
 4. All 10 themes render without errors
 5. No two themes could be confused for each other (visual diversity)
 6. All 5 layout variants used
 7. Component visibility matches matrix
 8. 2 video backgrounds, 7 image treatments, 1 no-image confirmed

 ---
 Execution Strategy

 Agent Parallelism

 - Sub-Phase A: 4 agents (1 research + web search, 3 for ADRs)
 - Sub-Phase B: 10-12 agents (1 for data files, 10 for theme JSONs, 1 for palettes)
 - Sub-Phase C: 3-4 agents (schema, store, bridge, registry)
 - Sub-Phase D: 3-4 agents (ThemeSimple rewrite, selectors, hero updates)
 - Sub-Phase E: 1-2 agents (cleanup + verify)

 Dependency Chain

 Sub-Phase A (research + ADRs) — no code dependencies, can run first
     ↓
 Sub-Phase B (JSON data files) — informed by research, no TS dependencies
     ↓
 Sub-Phase C (schema + store) — depends on B (needs theme JSONs to import)
     ↓
 Sub-Phase D (UI components) — depends on C (needs store methods + schema)
     ↓
 Sub-Phase E (cleanup + verify) — depends on D (all code complete)

 Critical Files

 ┌───────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────┐
 │                       File                        │ Lines to Modify  │              Impact              │
 ├───────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────┤
 │ src/lib/schemas/masterConfig.ts                   │ 49-106           │ Schema validation for all themes │
 ├───────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────┤
 │ src/store/configStore.ts                          │ 4-29, 150-198    │ Theme loading + switching        │
 ├───────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────┤
 │ src/components/right-panel/simple/ThemeSimple.tsx │ Full rewrite     │ Theme card UI                    │
 ├───────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────┤
 │ src/data/default-config.json                      │ 13, 15-23        │ Starting config                  │
 ├───────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────┤
 │ src/templates/hero/HeroCentered.tsx               │ Color references │ Hero rendering                   │
 └───────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────┘

 Reusable Existing Code

 - applyVibe() logic in configStore (copy preservation) — keep as-is
 - resolveHeroContent() in src/lib/schemas/section.ts — keeps working
 - deepMerge() in src/lib/deepMerge.ts — not used by applyVibe but available
 - Hero components (HeroCentered, HeroSplit, HeroOverlay, HeroMinimal) — modify, don't replace

 Verification

 1. npm run build — must pass clean
 2. npm test — must pass
 3. Manual: click each of 10 themes, verify hero changes layout/components/colors
 4. Manual: switch palette within a theme, verify all sections update
 5. Manual: switch font, verify all text updates
 6. Manual: toggle light/dark, verify mode changes
 7. Rubric score >= 85
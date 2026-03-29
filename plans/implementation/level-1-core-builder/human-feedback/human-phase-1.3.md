# Hey Bradley — Swarm Directive: Phase 1.3 & 1.4 (Themes & Layout)

**Phase:** L1 Core Builder — Themes & Layout Variants  
**Label:** `L1-phase-1.3` and `L1-phase-1.4`  
**Prerequisite:** Phase 1.2 complete (JSON templates, smoke test 8/8 passing)

---

## 1. OVERVIEW

Phase 1.3 creates 3 starter themes that are visually distinct and proves theme selection cascades through the JSON → preview pipeline. Phase 1.4 expands to the full set of 10 themes with varied layouts (split, full-image, video, minimal, etc.) and different free-source images/videos per theme.

**All themes use the same Hey Bradley copy** — engaging, friendly, non-technical tone. Copy editing and customization is deferred to L2. The copy should feel like a conversation, not a spec sheet.

**Focus on SIMPLE mode only.** Leave EXPERT tab content as-is for now.

---

## 2. PHASE 1.3: THREE STARTER THEMES

### 2.1 Phase DoD (Fixed — add to `backlog/requirements.md`)

```markdown
## Phase 1.3: Themes & Layout [NEXT]
- [ ] 3 theme presets selectable in right panel SIMPLE tab → STYLE accordion
- [ ] Each theme is visually distinct (different colors, fonts, layouts, mood)
- [ ] Selecting a theme updates: site settings, theme config, layout, hero styling
- [ ] Copy stays fixed (Hey Bradley example — friendly tone, not technical)
- [ ] Each theme has a default image URL (free source: Unsplash/Pexels)
- [ ] JSON in Data Tab reflects theme changes correctly
- [ ] Preview in Reality Tab re-renders with new theme < 200ms
- [ ] Playwright test: select each theme → verify JSON + preview changes
```

### 2.2 The Three Themes

Each theme must feel like a **completely different website** — not just a color swap.

**Theme 1: "Midnight Modern" (Dark SaaS)**

| Property | Value |
|----------|-------|
| Mood | Premium, technical, confident |
| Mode | dark |
| Colors | Deep navy bg (#0a0a1a), electric blue accent (#3b82f6), white text |
| Font | Inter or Space Grotesk |
| Layout | Centered — headline centered, CTA centered, image/mockup below |
| Hero Image | Product screenshot or dashboard mockup on dark bg |
| Image Source | Unsplash: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200` (or similar tech/dashboard image) |
| Feel | Stripe, Linear, Vercel |

**Theme 2: "Warm Sunrise" (Clean Light)**

| Property | Value |
|----------|-------|
| Mood | Warm, approachable, trustworthy |
| Mode | light |
| Colors | Warm cream bg (#faf8f5), warm orange accent (#e8772e), dark brown text (#2d1f12) |
| Font | DM Sans |
| Layout | Split — text left, image right |
| Hero Image | Warm lifestyle/workspace photo |
| Image Source | Unsplash: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200` (or similar warm team/workspace) |
| Feel | Notion, Basecamp, Calm |

**Theme 3: "Electric Gradient" (Bold Startup)**

| Property | Value |
|----------|-------|
| Mood | Bold, energetic, futuristic |
| Mode | dark |
| Colors | Deep purple/teal gradient bg, vibrant teal accent (#06b6d4), light text |
| Font | Plus Jakarta Sans or Outfit |
| Layout | Centered with gradient text — large headline with gradient fill, minimal imagery |
| Hero Image | Abstract gradient or minimal geometric shape (or none — text-dominant) |
| Image Source | Unsplash: `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200` (abstract gradient) |
| Feel | Arc browser, Raycast, Framer |

### 2.3 Hey Bradley Copy (Fixed Across All Themes)

The copy should feel friendly and engaging — like a smart friend explaining the product, not a technical spec. Same copy for all 3 themes (only visual styling changes):

```
Eyebrow Badge: "Hey Bradley 2.0 is Live ✨"

Headline: "Build Websites by Just Talking"

Subtitle: "Describe what you want, watch it appear in real-time, 
and get production-ready specs — all without writing a single line of code."

Primary CTA: "Start Building"
Secondary CTA: "See How It Works"

Trust Line: "Loved by 200+ creators and developers"
```

**NOT this:** "Ship Code at the Speed of Thought" (too technical, too developer-focused)
**YES this:** "Build Websites by Just Talking" (friendly, accessible, describes the magic)

### 2.4 Theme JSON Structure

Each theme preset is a JSON file in `src/data/themes/`:

```
src/data/themes/
├── midnight-modern.json
├── warm-sunrise.json
└── electric-gradient.json
```

Each file contains the full cascading update — everything that changes when the theme is selected:

```json
{
  "theme": {
    "preset": "midnight-modern",
    "mode": "dark",
    "colors": { "primary": "#3b82f6", "background": "#0a0a1a", "text": "#f8fafc", "...": "..." },
    "typography": { "fontFamily": "Inter", "headingWeight": 700 },
    "spacing": { "sectionPadding": "80px", "containerWidth": "1280px" }
  },
  "sections": [
    {
      "id": "hero-01",
      "variant": "centered",
      "layout": { "display": "flex", "direction": "column", "align": "center", "padding": "80px" },
      "style": { "background": "#0a0a1a", "color": "#f8fafc" },
      "components": [
        { "id": "hero-image", "props": { "src": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200" } }
      ]
    }
  ]
}
```

**When `configStore.applyVibe("midnight-modern")` is called**, this entire JSON is deep-merged into the master config. Copy (`heading.text`, `cta.text`, etc.) is NOT in the theme file — it stays unchanged from the default.

### 2.5 Theme Selection UI

Right panel → SIMPLE tab → STYLE accordion:

```
┌──────────────────────────────────────────┐
│ ▼ STYLE                                  │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ ● ● ●        │  │ ● ● ●        │     │
│  │              │  │              │      │
│  │ [mini prev]  │  │ [mini prev]  │      │  ← Thumbnail showing the theme
│  │              │  │              │      │
│  │ Midnight     │  │ Warm         │      │
│  │ Modern       │  │ Sunrise      │      │
│  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                        │
│  │ ● ● ●        │                        │
│  │              │                        │
│  │ [mini prev]  │                        │
│  │              │                        │
│  │ Electric     │                        │
│  │ Gradient     │                        │
│  └──────────────┘                        │
└──────────────────────────────────────────┘
```

Each theme card shows:
- 3 color dots (from the theme's palette)
- A mini-preview thumbnail (can be a styled div with the theme's bg/text colors, not a screenshot)
- Theme name
- Selected state: accent border + subtle glow

**Clicking a card** → calls `configStore.applyVibe(themeName)` → JSON updates → Data Tab reflects → Reality Tab re-renders.

### 2.6 What Phase 1.3 Does NOT Do

- Does NOT add more than 3 themes (that's 1.4)
- Does NOT include video backgrounds (that's 1.4)
- Does NOT change hero layout variants beyond centered and split (1.4 adds full-image, overlay, minimal)
- Does NOT add copy editing (L2)
- Does NOT add custom color picking (just preset selection)
- Does NOT update EXPERT tab content

---

## 3. PHASE 1.4: FULL THEME SPREAD (10 Total)

### 3.1 Phase DoD

```markdown
## Phase 1.4: Full Theme Spread [PLANNED]
- [ ] 10 total themes (including the 3 from 1.3), each visually distinct
- [ ] At least 1 theme with video background
- [ ] At least 1 fully minimalist theme (text only, no image)
- [ ] Themes cover: different image positions (full bg, left, right, none)
- [ ] Each theme has a unique free-source image or video URL
- [ ] All themes produce valid JSON and render correctly
- [ ] Playwright test: cycle through all 10 themes
```

### 3.2 The 10 Themes

The swarm should research and finalize, but here is the target variety. **Each theme must feel like a completely different website — a user should not be able to tell they came from the same builder.**

| # | Name | Layout | Mode | Key Visual | Mood |
|---|------|--------|------|-----------|------|
| 1 | Midnight Modern | Centered, image below | Dark | Dashboard screenshot | Premium SaaS |
| 2 | Warm Sunrise | Split (text left, image right) | Light | Workspace photo | Approachable, warm |
| 3 | Electric Gradient | Centered, gradient text, minimal image | Dark | Abstract gradient | Bold startup |
| 4 | **Ocean Calm** | Full background image, text overlay | Dark | Ocean/nature photo | Wellness, calm |
| 5 | **Studio Minimal** | Text only, no image, big whitespace | Light | None — typography hero | Luxury, editorial |
| 6 | **Video Hero** | Centered, video background, text overlay | Dark | Short ambient video loop | Tech, futuristic |
| 7 | **Bold Split** | Split (image left, text right — reversed) | Dark | Bold product photo | E-commerce, product |
| 8 | **Pastel Soft** | Centered with illustration-style image | Light | Soft illustration/abstract | Friendly, playful |
| 9 | **Corporate Clean** | Split with stats/trust elements | Light | Professional team photo | B2B, enterprise |
| 10 | **Neon Dark** | Centered, neon accent colors, card-style | Dark | Minimal with neon accents | Gaming, creative |

### 3.3 Free Image/Video Sources

The swarm must select images from these free services (no upload, no paid services):

| Source | URL Pattern | Use For |
|--------|------------|---------|
| **Unsplash** | `https://images.unsplash.com/photo-{id}?w=1200` | Hero photos (landscape, workspace, nature, product) |
| **Pexels** | `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?w=1200` | Alternative photos |
| **Pexels Video** | Embed or direct URL | Video backgrounds (ambient loops) |
| **Pixabay** | `https://cdn.pixabay.com/photo/{date}/{id}.jpg` | Additional variety |

**For the video theme:** Use a short (10-15 second) ambient loop from Pexels or Coverr (https://coverr.co). Autoplay, muted, loop. No controls visible. The video should be atmospheric, not content-heavy (think: slow motion clouds, abstract particles, flowing water).

### 3.4 Layout Variants Needed

| Variant | Description | Used By Themes |
|---------|-------------|---------------|
| `centered` | Text + CTA centered, image/media below or behind | 1, 3, 6, 8, 10 |
| `split-right` | Text left column, image right column | 2, 9 |
| `split-left` | Image left column, text right column | 7 |
| `overlay` | Full background image/video with text overlay | 4, 6 |
| `minimal` | Text only, maximum whitespace, no image | 5 |

The swarm should implement these variants in `HeroCentered.tsx` (or create `HeroSplit.tsx`, `HeroOverlay.tsx`, `HeroMinimal.tsx`) and map the `variant` field to the correct component.

---

## 4. UNASSIGNED BACKLOG (Phase 1 Features — Not Assigned to Any Phase Beyond 1.4)

The swarm must maintain this list in `backlog/unassigned.md`. These are requirements identified for Phase 1 but not yet assigned to a specific sub-phase. They will be allocated dynamically based on priority and progress.

```markdown
# Level 1: Unassigned Backlog

## High Priority (likely Phase 1.5 or 1.6)
- [ ] Listen Mode visual (red orb, dark overlay, pulse animation)
- [ ] XAI Docs HUMAN view generated from JSON
- [ ] XAI Docs AISP view in @aisp format
- [ ] Workflow pipeline stepper (mock data)
- [ ] All 5 hero layout variants fully polished
- [ ] Responsive preview toggles (mobile/tablet/desktop)
- [ ] Undo/redo keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [ ] LocalStorage auto-save via IProjectRepository
- [ ] Accessibility settings dialog (Doc 07)

## Medium Priority
- [ ] JSON upload (file input in Data Tab)
- [ ] JSON editor validation (must match template schema)
- [ ] Hero gradient text CSS fix (bg-clip-text not rendering)
- [ ] AISP viewer in Expert tab wired to live JSON (currently static)
- [ ] Theme preset thumbnails as actual rendered previews (not just color dots)
- [ ] Section click-to-select in Reality tab (dashed border on selected)
- [ ] "+ Add Section" dropdown with section type picker
- [ ] Section drag-to-reorder (currently arrows only)

## Low Priority / Deferred
- [ ] Custom color picker (beyond preset palettes)
- [ ] Per-section theme overrides
- [ ] Copy editing features (headline suggestions, character counts)
- [ ] Image upload to Supabase Storage
- [ ] Multiple hero variants selectable per project (not just per theme)
- [ ] Onboarding page with theme selection flow
- [ ] EXPERT tab content for theme configuration
- [ ] EXPERT tab content for section configuration (beyond current)
```

---

## 5. SWARM EXECUTION: PHASE 1.3

### 5.1 Agents (3)

| Agent | Tasks |
|-------|-------|
| **theme-agent** | Create 3 theme JSON files in `src/data/themes/`. Select Unsplash image URLs. Implement `applyVibe` method on configStore. |
| **ui-agent** | Build theme selection cards in right panel SIMPLE tab → STYLE accordion. Add mini-preview thumbnails. Wire click → applyVibe. Update the Hey Bradley copy to friendly tone (not technical). |
| **test-agent** | Playwright test: select each theme → verify JSON changes in Data Tab → verify Reality Tab re-renders with correct colors/font/layout. Run all existing tests. |

### 5.2 Execution Order

```
theme-agent + ui-agent (parallel — theme-agent creates data, ui-agent builds UI)
    ↓
test-agent (needs both complete to test the loop)
```

### 5.3 Verification

| # | Check | Method |
|---|-------|--------|
| 1 | 3 theme files exist in `src/data/themes/` | File check |
| 2 | Each theme produces valid JSON against Zod schema | Unit test |
| 3 | Theme selection in SIMPLE tab works | Playwright |
| 4 | Selecting "Midnight Modern" → dark bg, blue accent in preview | Playwright screenshot |
| 5 | Selecting "Warm Sunrise" → light cream bg, orange accent, split layout | Playwright screenshot |
| 6 | Selecting "Electric Gradient" → gradient bg, teal accent in preview | Playwright screenshot |
| 7 | Data Tab JSON reflects theme changes | Playwright |
| 8 | Copy stays identical across all 3 themes | Assertion |
| 9 | All existing Playwright tests still pass | `npx playwright test` |
| 10 | Zero TypeScript errors + clean build | `npx tsc && npx vite build` |

---

## 6. SWARM EXECUTION: PHASE 1.4

### 6.1 Research First

Before building 7 more themes, the swarm must:

1. **Web search** for diverse hero section styles (reference the research from §3.2 — centered, split, overlay, video, minimal, bento, etc.)
2. **Select specific free images/videos** from Unsplash/Pexels/Coverr for each theme
3. **Create layout variant components** if not already built (HeroSplit, HeroOverlay, HeroMinimal)
4. Document theme specifications in `backlog/phase-1.4/plan.md`

### 6.2 Key Constraint

**Each theme must be significantly different** from every other theme. The swarm should use this checklist per theme:

- Different color palette? ✅
- Different font? ✅
- Different layout variant? ✅ (or at least different visual weight)
- Different mood/feel? ✅
- Different image/video? ✅
- Would a user think these came from different builders? ✅

If any theme looks like a slight variation of another, reject it and redesign.

### 6.3 Verification for 1.4

| # | Check |
|---|-------|
| 1 | 10 theme files exist and validate |
| 2 | Theme grid shows all 10 with thumbnails |
| 3 | At least 1 video theme works (autoplay, muted, loop) |
| 4 | At least 1 minimal theme works (no image, text-only) |
| 5 | Playwright cycles all 10 themes without errors |
| 6 | Each theme produces a visually distinct preview |

---

## 7. AISP SPECIFICATION

```aisp
⟦
  Ω := { Define theme system for Hey Bradley: 3 starter themes (1.3) expanding to 10 (1.4) }
  Σ := { Theme:{preset:𝕊, mode:{"light"|"dark"}, colors:ColorPalette, typography:Typography, heroVariant:{"centered"|"split-right"|"split-left"|"overlay"|"minimal"}, imageUrl:𝕊, videoUrl?:𝕊}, ThemeSet:{starter:[Theme;3], full:[Theme;10]} }
  Γ := { R1: ∀ theme : visually_distinct (different colors∧font∧layout∧mood), R2: applyVibe(theme) cascades to site+theme+layout+hero_style, R3: copy_unchanged across all themes, R4: ∀ theme : valid_JSON against schema, R5: ≥1 theme has video_bg, R6: ≥1 theme has no_image (minimal) }
  Λ := { location:="src/data/themes/", images:="unsplash|pexels", video:="pexels|coverr", max_themes:=10 }
  Ε := { V1: VERIFY select_theme→JSON_updates→preview_renders, V2: VERIFY copy_identical across themes, V3: VERIFY 10 themes all visually distinct, V4: VERIFY Playwright cycles all themes }
⟧
```

---

*End of Directive*

*Phase 1.3: Prove themes cascade through JSON. Phase 1.4: Make it beautiful with variety. Copy stays friendly. SIMPLE mode only. Expert deferred.*
the themes are still nearly identical - all layouts are virtually the same and include all hero sections.  there are no video options,  i included an example of 2 different themes (hard to tell but only the color is different) .   for the theme options we need to decide what simple options are in the them and how they would change the hero and future sections - the hero is the most important to change - but the default sections to include and style for the recommended sections will likely also change .  this means the them change will 1) on/off sections 2) on/off components within a section (each section may have its own themes - and the master them change will update and select the defaults for all the sections - this means if a visual vibrant theme is selected then the color palette will be vibrant as default, all sections will include a colorful and image heavy default.  || second we need to identify the logic for the theme options.  these are my thoughts 1) 10 themes are provided that are very different.  on theme change, the template for the theme json is fetched and updates the master json - this includes 1) what sections are shown by default and the section level defaults .  1a) for the hero this means a wide variety for the 10 themes - video full background, left full image, full image background, various color palettes and components that show.  2) the theme will change all default settings except for the copy (and any actions) 3) in a later phase we will include an option to promote theme section to either a dialog full screen that includes more than 10 themes 4) 2nd level is the color palette - the theme will select the default , but there should be palette options - for this phase keep options fixed (5 color options - vary the number of colors available) 5) second level is also the font type (allow 3-5 types of fonts) .  later phase 1 to do will be the color palette custom selection, the accessibility button (this will override the font sizes , light/dark mode , and number of colors available in the color palette) .  an each way to handle the color palette is to have 5-6 color shades available (if user needs minimalist then the same colors will fill multiple slots - eg a black and white theme will have only those two colors) .  the font and color palettes may be in the simple tab for the theme - recommend this.  provide instructions for the swarm  .

---

Webflow template sales data confirms the top categories: Agency/Portfolio leads, SaaS/Tech Startup is second, Business/Consulting third, then Landing Pages, and emerging niches like health/wellness and education. Flowsamurai This maps directly to the theme names. Now let me build the definitive directive.Created a file, read a fileCreated a file, read a fileThis supersedes directives 12, 13, 14, and 15. Here's what's different and why this should be the last theme iteration:
Research before code, enforced. The swarm must create docs/research/theme-and-hero-research.md documenting the top website categories from template marketplace data, real-world hero section examples per category, and a complete component inventory. Four ADRs (017-020) must be written before any theme code. The ADRs cover: invisible design naming, full JSON replacement, 6-slot palette, and component visibility per theme. This is the 90% — once the research and ADRs exist, the implementation is straightforward.
Invisible design naming. "Stripe Flow" and "Neon Terminal" mean nothing to your target users. "SaaS," "Agency," "Personal," "Blog" — these are instantly understood. A grandmother doesn't need to know what "Linear Sharp" means. She knows she's building a personal website. The theme names ARE the use cases.
The component visibility matrix (§2.1) is the core of visual diversity. It's a 10×9 table specifying exactly which components are ON vs OFF for each theme. Minimalist shows ONLY headline + primaryCTA. SaaS shows everything. Portfolio disables inline heroImage but enables full-bleed backgroundImage. This matrix is what makes themes look like different websites — not color swaps.
The file architecture is complete. 10 theme JSONs + palettes.json + fonts.json + media.json + template-config + default-config. The project JSON (what lives in localStorage) starts as a copy of the default theme and gets modified from there. This is the foundation for the later chat/listen mode where LLM patches merge into the project JSON.
The rubric (§5) gives the swarm a concrete pass/fail scorecard. 85+ required. Visual diversity is 20% weight. If two themes look alike, that's an automatic 20-point deduction. The swarm can self-assess before requesting human review.

---

# Hey Bradley — SWARM DIRECTIVE: Theme System v3 (Research → Plan → Build)

**Priority:** P0 — BLOCKING  
**Supersedes:** 12, 13, 14, 15 (all previous theme directives)  
**Label:** `L1-themes-v3`  
**Iteration:** 8 (this must be the last theme iteration in Phase 1)

---

## 0. GROUNDING: WHY THIS IS ITERATION 8

We have iterated on themes 8 times. The problem each time was the same: the swarm built themes before understanding what a theme IS. A theme is not a color palette. A theme is a complete website personality — layout, components, imagery, typography, spacing, mood — expressed as a JSON template that replaces the entire project configuration except copy.

**This time, the swarm MUST research first, plan with DDD and ADR, THEN build.** No code until the research document and ADRs are approved. This is a simple enhancement — a proper web search for top themes with an ADR is 90% of the solution.

---

## 1. STEP 1: RESEARCH (Mandatory — Before Any Code)

### 1.1 Create Research Document

**File:** `docs/research/theme-and-hero-research.md`

The swarm must web search and document:

**Part A: Top 10 Most Popular Website Use Cases**
- Research which website categories sell the most templates on Webflow, Squarespace, ThemeForest, and Framer
- Expected findings: SaaS, Agency, Portfolio, Blog, Business/Consulting, Startup Landing, Personal, E-commerce (excluded from Hey Bradley), Health/Wellness, Education
- For each category: what layout pattern is most common, what visual style users expect, what components are standard

**Part B: Top Hero Section Designs by Category**
- For each of the 10 categories: find 2-3 real-world examples of best-in-class hero sections
- Document: layout (centered, split, overlay, minimal), image treatment (none, right column, full bg, video), component set (what's included vs excluded), color mood, font style
- Screenshot URLs or descriptions for reference

**Part C: Hero Component Inventory**
- List every possible component a hero section could contain: eyebrow badge, headline, subtitle, description, primaryCTA, secondaryCTA, hero image, background image, background video, trust badges, social proof stats, partner logos, ratings, countdown timer, newsletter signup
- Mark which components are standard (80%+ of sites use them) vs optional

### 1.2 Create ADRs

**ADR-017: Theme Names Use Invisible Design (Familiar Category Names)**

- **Decision:** Theme names use the website category they serve, not abstract design names
- **Context:** "Stripe Flow" and "Neon Terminal" mean nothing to a grandmother or a small business owner. "SaaS," "Agency," "Personal," and "Blog" are instantly understood. Invisible design means the user doesn't need to learn your naming system.
- **Names:** SaaS, Agency, Portfolio, Blog, Startup, Personal, Professional, Wellness, Creative, Minimalist
- **Consequence:** Every theme name tells the user "this is for YOUR kind of website"

**ADR-018: Theme as Full JSON Template Replacement**

- **Decision:** `applyTheme()` replaces the entire project JSON (sections, components, layout, style, palette, font) while preserving copy and URLs
- **Context:** Previous implementations only swapped CSS variables, producing 10 identical-looking websites with different colors
- **Consequence:** Each theme specifies: which sections are enabled, which hero layout variant, which components are visible/hidden, which image/video, which palette, which font

**ADR-019: 6-Slot Color Palette System**

- **Decision:** All colors are expressed as 6 named slots (bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary)
- **Context:** This allows minimalist themes to fill multiple slots with the same color (e.g., black and white only) while vibrant themes use all 6 distinctly
- **Consequence:** Palette swap updates all sections simultaneously. 5 palette alternatives per theme.

**ADR-020: Component Visibility Per Theme**

- **Decision:** Each theme specifies `enabled: true/false` for every hero component, and this varies across themes
- **Context:** A minimalist theme (Minimalist) shows ONLY headline + primaryCTA. A full-featured theme (SaaS) shows badge + headline + subtitle + 2 CTAs + image + trust badges. This creates real visual diversity.
- **Consequence:** Theme switching toggles components on/off, not just colors

Save ADRs to `docs/adrs/`.

---

## 2. THE 10 THEMES (Invisible Design Names)

| # | Name | Use Case | Hero Layout | Hero Image Treatment | Mode | Mood |
|---|------|----------|------------|---------------------|------|------|
| 1 | **SaaS** | Software products, dev tools | Centered, product mockup below | Screenshot/mockup below content | Dark | Premium, technical |
| 2 | **Agency** | Design studios, creative agencies | Split-right (text left, work right) | Portfolio/work sample right column | Light | Professional, bold |
| 3 | **Portfolio** | Photographers, designers, artists | Full background image, text overlay | Full-bleed portfolio image | Dark overlay | Visual, dramatic |
| 4 | **Blog** | Writers, publishers, newsletters | Split-right (text left, featured image right) | Featured article image | Light | Editorial, readable |
| 5 | **Startup** | Launch pages, coming soon, MVPs | Centered, gradient background, video option | Background video (ambient loop) | Dark | Energetic, futuristic |
| 6 | **Personal** | Personal brands, resumes, freelancers | Split-left (photo left, text right) | Headshot/portrait photo | Light | Friendly, authentic |
| 7 | **Professional** | Consulting, law, finance, B2B | Centered, clean, trust-focused | Subtle background pattern or none | Light | Trustworthy, corporate |
| 8 | **Wellness** | Health, yoga, meditation, coaching | Full background nature image, overlay | Nature/wellness photo | Dark overlay | Calm, serene |
| 9 | **Creative** | Music, entertainment, events, art | Centered, bold typography, vibrant | Background video (artistic/motion) | Dark | Bold, expressive |
| 10 | **Minimalist** | Any — stripped to essentials | Minimal (text only, maximum whitespace) | None — typography hero only | Light | Clean, elegant |

### 2.1 Component Visibility Per Theme

| Component | SaaS | Agency | Portfolio | Blog | Startup | Personal | Professional | Wellness | Creative | Minimalist |
|-----------|------|--------|-----------|------|---------|----------|-------------|----------|----------|-----------|
| eyebrowBadge | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| headline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| subtitle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| primaryCTA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| secondaryCTA | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| heroImage | ✅ | ✅ | ❌* | ✅ | ❌ | ✅ | ❌ | ❌* | ❌ | ❌ |
| backgroundImage | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| backgroundVideo | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| trustBadges | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

*❌\* = the full-bleed background image IS the visual — `heroImage` (inline) is off, `backgroundImage` is on*

### 2.2 Layout Variant Distribution

| Variant | Themes |
|---------|--------|
| centered | SaaS, Startup, Professional, Creative |
| split-right | Agency, Blog |
| split-left | Personal |
| overlay | Portfolio, Wellness |
| minimal | Minimalist |

**Every layout variant is used.** No variant is unused.

### 2.3 Image / Video Sourcing

| Theme | Source | Search Terms |
|-------|--------|-------------|
| SaaS | Unsplash | "dashboard dark mode UI" or "laptop code screen" |
| Agency | Unsplash | "design studio workspace" or "creative team office" |
| Portfolio | Unsplash | "architecture modern building" or "photography landscape" |
| Blog | Unsplash | "coffee book reading" or "writing workspace" |
| Startup | Pexels Video / Coverr | "abstract particles motion" or "technology connections" |
| Personal | Unsplash | "professional portrait" or "headshot studio" |
| Professional | None or subtle pattern | No image — clean professional layout |
| Wellness | Unsplash | "ocean aerial waves" or "forest morning light" |
| Creative | Pexels Video / Coverr | "art colorful motion" or "music concert lights" |
| Minimalist | None | No image — pure typography |

---

## 3. JSON FILE ARCHITECTURE

### 3.1 Files to Create

```
src/data/
├── themes/
│   ├── index.ts                    ← Theme registry (exports all themes)
│   ├── saas.json                   ← Full JSON template for SaaS theme
│   ├── agency.json
│   ├── portfolio.json
│   ├── blog.json
│   ├── startup.json
│   ├── personal.json
│   ├── professional.json
│   ├── wellness.json
│   ├── creative.json
│   └── minimalist.json
├── palettes/
│   └── palettes.json               ← All palette options (5 per theme × 10 themes)
├── fonts/
│   └── fonts.json                  ← All available font options (5 fonts)
├── media/
│   └── media.json                  ← All available image/video URLs
├── template-config.json            ← Master: all possible options for all section types
└── default-config.json             ← Starting project (SaaS theme applied by default)
```

### 3.2 Theme JSON Structure (Each File)

Each theme JSON is a **complete project template** — not a partial override:

```json
{
  "meta": {
    "name": "SaaS",
    "description": "For software products, developer tools, and tech platforms",
    "tags": ["dark", "centered", "gradient", "technical"],
    "mood": "Premium and technical"
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
    "alternativePalettes": [
      { "name": "Blue Steel", "slots": { "bgPrimary": "#0f172a", "...": "..." } },
      { "name": "Emerald", "slots": { "...": "..." } },
      { "name": "Amber", "slots": { "...": "..." } },
      { "name": "Monochrome", "slots": { "...": "..." } }
    ],
    "typography": {
      "fontFamily": "Inter",
      "headingWeight": 700,
      "baseSize": "16px"
    }
  },
  "sections": [
    {
      "type": "hero",
      "enabled": true,
      "variant": "centered",
      "layout": { "display": "flex", "direction": "column", "align": "center", "padding": "80px 24px" },
      "components": [
        { "type": "eyebrowBadge", "enabled": true, "props": { "variant": "pill" } },
        { "type": "headline", "enabled": true, "props": { "size": "5xl", "weight": "bold" } },
        { "type": "subtitle", "enabled": true, "props": { "size": "xl" } },
        { "type": "primaryCTA", "enabled": true, "props": { "variant": "solid", "size": "lg" } },
        { "type": "secondaryCTA", "enabled": true, "props": { "variant": "outline", "size": "lg" } },
        { "type": "heroImage", "enabled": true, "props": { "src": "...", "position": "below", "shadow": true } },
        { "type": "backgroundImage", "enabled": false },
        { "type": "backgroundVideo", "enabled": false },
        { "type": "trustBadges", "enabled": true, "props": { "variant": "text" } }
      ],
      "style": { "background": "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)" }
    },
    { "type": "features", "enabled": true, "variant": "grid-3col" },
    { "type": "pricing", "enabled": true, "variant": "3-tier" },
    { "type": "cta", "enabled": true, "variant": "simple" },
    { "type": "footer", "enabled": true, "variant": "multi-column" }
  ]
}
```

### 3.3 Project JSON (Saved in localStorage)

The project JSON is what the user works with. It starts as a copy of the default theme, gets modified by user actions, and is saved/loaded from localStorage.

```
Flow: Select Theme → fetch theme JSON → deep copy → set as project JSON → save to localStorage
      User edits → patch project JSON → save to localStorage → update Reality tab
```

This is the JSON visible in the DATA tab and exported via EXPORT JSON.

---

## 4. THEME CARD DESIGN (Right Panel)

### 4.1 Layout

**2-column grid** on laptop or larger devices. Each card shows an accurate preview of the theme's hero section.

```
┌──────────────────────────────────────────┐
│ ▼ THEME PRESETS                          │
│  ┌──────────────┐  ┌──────────────┐      │
│  │              │  │              │      │
│  │  [Accurate   │  │  [Accurate   │      │  ← Real colors, font, layout
│  │   hero       │  │   hero       │      │     direction, image placement
│  │   preview]   │  │   preview]   │      │
│  │              │  │              │      │
│  │  SaaS        │  │  Agency      │      │
│  │  Dark·Center │  │  Light·Split │      │  ← Name + mode + layout tags
│  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐      │
│  │  ...         │  │  ...         │      │
│  └──────────────┘  └──────────────┘      │
│  (scrollable, 5 rows × 2 cols)           │
│                                          │
│ ▼ COLOR PALETTE                          │
│  ○ ● ● ● ● ●  Default                  │  ← 6 dots per row, radio select
│  ○ ● ● ● ● ●  Blue Steel               │
│  ○ ● ● ● ● ●  Emerald                  │
│  ○ ● ● ● ● ●  Amber                    │
│  ○ ● ● ● ● ●  Monochrome              │
│                                          │
│ ▼ FONT                                  │
│  [Inter] [DM Sans] [Space Grotesk]       │
│  [JetBrains] [Plus Jakarta]              │
│                                          │
│ ▼ MODE                                  │
│  [☀ Light]  [☾ Dark]                    │
│                                          │
└──────────────────────────────────────────┘
```

### 4.2 Card Preview Requirements

Each theme card must be a **styled div** that accurately represents the theme:
- Use the theme's actual background color/gradient/image
- Show the headline text in the theme's font + color + size
- Show a tiny CTA button in the theme's accent color
- For split layouts: show the text on one side, image placeholder on other
- For overlay: show darkened image bg with text on top
- For video themes: show a static thumbnail (not actual video in the card)
- For minimalist: show only text on clean background

**A user should be able to identify the layout style, color mood, and image treatment from the card alone.**

---

## 5. RUBRIC (Scorecard for When All 10 Are Done)

| # | Criterion | Weight | Pass Condition |
|---|-----------|--------|---------------|
| 1 | Visual diversity | 20% | No two themes could be confused for each other |
| 2 | Layout variety | 15% | All 5 variants used (centered, split-right, split-left, overlay, minimal) |
| 3 | Component variety | 15% | Different components visible per theme (per §2.1 matrix) |
| 4 | Image/video coverage | 10% | 2 video, 7 image (various treatments), 1 none |
| 5 | JSON completeness | 10% | Each theme JSON validates against Zod schema |
| 6 | Copy preservation | 10% | Switching themes preserves all text and URLs |
| 7 | Card preview accuracy | 10% | Theme cards show real layout/colors/fonts (not generic blocks) |
| 8 | Palette + font working | 5% | Changing palette updates all sections, changing font updates all text |
| 9 | Light/dark toggle | 5% | Mode toggle works per theme |
| **Total** | | **100%** | **Must score ≥ 85 to pass** |

---

## 6. SWARM EXECUTION ORDER

```
STEP 1: Research (1 agent, mandatory, no code)
├── Web search top website categories + hero patterns
├── Create docs/research/theme-and-hero-research.md
└── Create ADRs 017-020

STEP 2: Plan (review research, then plan)
├── Finalize 10 theme specifications (use §2 as starting point, adjust based on research)
├── Select specific image/video URLs per theme
└── Create theme JSON files (10 files)

STEP 3: Build Architecture
├── Fix applyTheme() for full JSON replacement (preserve copy only)
├── Test with 2 themes (SaaS vs Minimalist — most different pair)
└── Verify: switching themes changes layout + components + sections

STEP 4: Build All 10
├── Create all 10 theme JSON files
├── Build palette selector (5 options per theme × 6 slots)
├── Build font selector (5 fonts)
├── Build light/dark toggle
├── Build 2-column theme cards with accurate previews

STEP 5: Verify
├── Playwright screenshots all 10 themes
├── Score against rubric (§5) — must be ≥ 85
├── Human review
```

---

## 7. VERIFICATION

| # | Check |
|---|-------|
| 1 | Research document exists: `docs/research/theme-and-hero-research.md` |
| 2 | ADRs 017-020 exist in `docs/adrs/` |
| 3 | 10 theme JSON files exist in `src/data/themes/` |
| 4 | All 10 validate against Zod schema |
| 5 | Theme switch changes hero layout variant |
| 6 | Theme switch toggles component visibility |
| 7 | Theme switch changes section list |
| 8 | Copy preserved across switches |
| 9 | 2 themes have video backgrounds |
| 10 | 1 theme has no image (Minimalist) |
| 11 | Palette selector shows 5 options per theme |
| 12 | Font selector shows 5 options |
| 13 | Light/dark toggle works |
| 14 | Theme cards show accurate previews in 2-column grid |
| 15 | Rubric score ≥ 85 |
| 16 | Playwright all 10 themes without errors |

---

*This is iteration 8. The research → ADR → build sequence is 90% of the solution. Do the research, write the ADRs, then the code writes itself.*
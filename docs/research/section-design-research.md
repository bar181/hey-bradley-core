# Section/Block Design Research: Agency-Quality Visual References

**Date:** 2026-04-02
**Purpose:** Research how professional website builders name, present, and organize section blocks for non-technical users. Inform Hey Bradley's section variant system.
**Sources:** Squarespace, Framer, Wix, Tailwind UI, shadcn/ui, Webflow, Lovable.dev, Bolt.new, v0.dev

---

## Table of Contents

1. [Platform-by-Platform Findings](#1-platform-by-platform-findings)
2. [Cross-Platform Naming Conventions](#2-cross-platform-naming-conventions)
3. [Variant Count Analysis (The Magic Number)](#3-variant-count-analysis-the-magic-number)
4. [Column Count as Separate Control](#4-column-count-as-separate-control)
5. [Visual Thumbnail Systems](#5-visual-thumbnail-systems)
6. [Layout vs Content Separation](#6-layout-vs-content-separation)
7. [Image-First vs Text-First Card Design](#7-image-first-vs-text-first-card-design)
8. [The Grandma Test](#8-the-grandma-test)
9. [Recommendations for Hey Bradley](#9-recommendations-for-hey-bradley)

---

## 1. Platform-by-Platform Findings

### 1a. Squarespace

**Section Naming:**
Squarespace uses four top-level section types:
- **Fluid Engine Sections** -- The modern default. Flexible grid, drag-and-drop blocks, separate mobile layout editing.
- **Classic Editor Sections** -- Legacy 12-column grid, requires spacer blocks for positioning.
- **List Sections** (Auto Layout) -- Repeated layout patterns for teams, services, testimonials. Users add data and the layout generates automatically. Display modes: simple list (rows/columns), carousel, or slideshow.
- **Gallery Sections** (Auto Layout) -- Six display modes: Grid Simple, Grid Strips, Grid Masonry, Slideshow Simple, Slideshow Full, Slideshow Reel.

**How They Name Sections to Users:**
Squarespace does NOT name sections by their marketing purpose (hero, features, pricing). Instead, they name by *structure*: "Blank Section", "List Section", "Gallery Section". The user picks a layout first, then fills in content. This is notable because it avoids jargon entirely.

**Variant System:**
List Sections have layout presets that the user scrolls through visually. Each preset shows a live thumbnail preview in the section picker. Users see approximately 6-8 layout presets per list category.

**Content Blocks (Inside Sections):**
The four fundamental blocks are Text, Spacer, Button, and Image. Everything else is composed from these primitives. This keeps the "Add Block" menu short.

**Key Insight:** Squarespace separates "what kind of section" (structure) from "what blocks go in it" (content). Non-technical users never see the word "hero" or "CTA."

---

### 1b. Framer

**Section Naming:**
Framer's Insert Menu organizes sections by marketing purpose:
- Hero
- Features
- Testimonials
- Pricing
- FAQ
- Contact
- Header (Navbar)
- Footer
- Blank Section (full control)

**How They Present Sections:**
Sections appear in the Insert Menu sidebar. When inserting, Framer keeps the Insert Menu open and automatically zooms the page view so users can compose pages in a single scrolling view. This "assembly mode" is a strong UX pattern.

**Variant System:**
- Sections are **minimally styled** by default -- they provide structure, not decoration
- Frameblox (largest Framer UI kit) offers **650+ components, elements, and sections**
- SegmentUI offers **1000+ variations** of styles, components, and layouts
- Third-party kits like Framepad provide components built with **variables and variants** for maximum flexibility
- Framer auto-names responsive variants: Desktop, Tablet, Phone

**Key Insight:** Framer treats sections as composition units -- minimally styled so users focus on creative vision rather than fighting defaults. The Insert Menu approach (sidebar stays open, page zooms out) is the best section-picker UX observed.

---

### 1c. Wix

**Section Naming:**
Wix uses two distinct concepts:
- **Sections** -- Individual customizable containers that divide content vertically. Full page width. Each has its own background, layout, and content elements.
- **Strips** -- Layers that sit ON TOP of sections. Break free from grid lines, stretch full width, content can be placed anywhere without strict margin guidelines.

**Naming Convention:**
Wix recommends naming sections explicitly: "Hero Section", "About Section", "Services Section". The naming is user-facing in the navigator panel. Each section gets a label the user can rename.

**Layout Controls:**
Strips offer alignment controls (left, center, right) independent of the section structure. Content placement is freeform within a strip.

**Key Insight:** The Section + Strip layering model is unique. Strips add creative depth without replacing the organizational structure of sections. This is Wix's answer to the "I want more freedom" problem without going full Webflow complexity.

---

### 1d. Tailwind UI (Tailwind Plus)

**Section Naming:**
Tailwind UI uses precise marketing terminology for its 500+ components:

| Category | Section Name | Variant Count |
|----------|-------------|---------------|
| Marketing | Hero Sections | ~10-12 |
| Marketing | Feature Sections | ~10-12 |
| Marketing | CTA Sections | ~6-8 |
| Marketing | Pricing Sections | ~6-8 |
| Marketing | Testimonials | ~6-8 |
| Marketing | Newsletter Sections | ~4-6 |
| Marketing | Stats (Value Props) | ~4-6 |
| Marketing | Blog Sections | ~4-6 |
| Marketing | Contact Sections | ~4-6 |
| Marketing | Team Sections | ~4-6 |
| Marketing | Content Sections | ~6-8 |
| Marketing | Logo Clouds | ~4-6 |
| Marketing | FAQs | ~4-6 |
| Marketing | Footers | ~6-8 |
| Marketing | Headers (Navbars) | ~6-8 |
| Marketing | Bento Grids | ~4-6 |
| Marketing | 404 Pages | ~4 |
| Marketing | Banners | ~4-6 |

**Variant Naming Pattern:**
Hero variants include: centered, split (text + image), simple dark, with app screenshot, angled, with phone mockup. The naming describes the **layout composition**, not a style.

**Key Insight:** Tailwind UI is the gold standard for variant naming. Each variant name tells you the layout structure in 2-3 words: "Split with screenshot", "Centered with image", "Simple centered". This is the naming pattern to follow. Tailwind offers roughly **6-10 variants per section type** for the major sections (hero, features, pricing) and **3-5 for minor sections** (stats, logo clouds, banners).

---

### 1e. shadcn/ui Blocks

**Section Naming:**
shadcn/ui blocks use the same marketing-purpose naming as Tailwind UI:
- Hero Sections (64 blocks in shadcn-ui-blocks.com)
- Feature Sections (18+ blocks)
- CTA Sections
- Testimonials / Social Proof
- Pricing Tables
- FAQ Sections
- Bento Grids
- Blog Sections
- Contact Sections

**Variant Naming (Hero Examples):**
- Simple Centred
- Centered copy over background image
- Centered copy with star rating
- Split Image Hero
- Split Content Hero
- Split With Video
- Two columns with image
- Content at top over background image
- Content centered over full-screen video
- Image Carousel Hero
- Mobile App Hero
- Particles Background Hero

**Scale:**
- shadcnblocks.com: **1429 blocks, 1189 components, 14 templates**
- shadcn-ui-blocks.com: **40 hero variants alone**
- shadcnstudio.com: Additional free and pro blocks
- shadcnuikit.com: **160 blocks** across marketing, eCommerce, dashboard

**Key Insight:** The shadcn ecosystem has exploded with third-party block libraries. The sheer volume (40 hero variants) proves that the market appetite is for MORE variants, not fewer -- BUT these are developer tools, not end-user builders. For non-technical users, this volume must be curated down.

---

### 1f. Webflow

**Section Naming:**
Webflow's Add Elements Panel organizes by structural category:
- Layout elements (div block, section, container, grid, columns)
- Form elements (inputs, checkboxes, radio buttons)
- Prebuilt components (sliders, tabs, lightboxes, navbar)

Webflow does NOT have a "section picker" in the Squarespace/Framer sense. Users build from primitives. The Navigator panel shows the element hierarchy. Users can rename any element for clarity.

**Layout Controls:**
Webflow provides **CSS Grid and Flexbox as visual controls** -- separate from content. Users can configure up to 7 breakpoints. Column count is controlled through the Grid settings panel, completely separate from content.

**Key Insight:** Webflow is the power-user extreme. Column count IS a separate control (via CSS Grid). Layout IS completely separated from content. But this is too complex for non-technical users. Webflow's approach is the ceiling, not the target.

---

### 1g. AI Builders: Lovable.dev, Bolt.new, v0.dev

**Lovable.dev:**
- Outputs React + TypeScript with **shadcn/ui components**
- No manual section picker -- users describe what they want in natural language
- The AI generates sections based on prompts
- Locked to React/shadcn stack

**Bolt.new:**
- Browser-based WebContainer approach
- Fastest path from prompt to live preview
- No explicit section/block system -- generates full pages from prompts

**v0.dev (Vercel):**
- Converts natural language to React components using shadcn/ui + Tailwind
- Users describe sections: "a pricing section with three plans" and v0 generates the code
- Effective prompts list actual components, data, and actions -- not just "a dashboard"
- v0 evolved from v0.dev to v0.app with agentic intelligence for iterative refinement

**Key Insight:** AI builders skip the section picker entirely. The user describes intent, the AI picks the layout. This is the future direction -- but for Hey Bradley's builder mode (where users visually compose), we still need a curated section picker. The AI approach complements it for the chat/listen modes.

---

## 2. Cross-Platform Naming Conventions

### Universal Section Names (Used by 4+ Platforms)

| Section | Squarespace | Framer | Wix | Tailwind UI | shadcn | Webflow |
|---------|------------|--------|-----|-------------|--------|---------|
| Hero | (Blank section) | Hero | Hero Section | Hero Sections | Hero | (Div) |
| Features | List Section | Features | Features Section | Feature Sections | Feature | (Grid) |
| Pricing | List Section | Pricing | Pricing Section | Pricing Sections | Pricing | (Grid) |
| CTA | (Blank section) | (not explicit) | CTA Section | CTA Sections | CTA | (Div) |
| Testimonials | List Section | Testimonials | Testimonials Section | Testimonials | Testimonials | (Grid) |
| FAQ | List Section | FAQ | FAQ Section | FAQs | FAQ | (Div) |
| Footer | (Blank section) | Footer | Footer | Footers | Footer | Footer |
| Navbar/Header | (Blank section) | Header | Header | Headers | Header | Navbar |
| Stats/Numbers | (not explicit) | (not explicit) | (not explicit) | Stats | Stats | (Div) |
| Logo Cloud | (not explicit) | (not explicit) | (not explicit) | Logo Clouds | Logo Cloud | (Grid) |

### User-Friendly Names (Hey Bradley Currently Uses)

Our current `sectionNameMap`:
```
navbar      -> "Top Menu"
hero        -> "Main Banner"
features    -> "Features"
cta         -> "Action Block"
pricing     -> "Pricing"
footer      -> "Footer"
testimonials -> "Reviews"
faq         -> "FAQ"
value_props -> "Highlights"
```

**Assessment:** Our names are a reasonable hybrid. "Main Banner" for hero is friendlier than "Hero" for non-technical users. "Action Block" for CTA avoids marketing jargon. "Highlights" for value_props is slightly vague.

**Recommendation:** Keep the current names but consider:
- "Reviews" -> "Testimonials" (the word has entered everyday vocabulary)
- "Highlights" -> "Stats" or "Numbers" (more concrete)
- "Action Block" -> "Call to Action" (widely understood now, even by non-technical users)

---

## 3. Variant Count Analysis (The Magic Number)

### What the Research Shows

**Hick's Law** (1952, Hick-Hyman): Decision time increases logarithmically with the number of choices. For non-technical users, too many variants causes choice paralysis.

**UX Research Consensus:** 3-5 well-designed variants per category is more user-friendly than dozens of options (progressive disclosure principle).

**What the Platforms Actually Ship:**

| Platform | Hero Variants | Feature Variants | Pricing Variants | Average Per Section |
|----------|--------------|-----------------|-----------------|-------------------|
| Tailwind UI | 10-12 | 10-12 | 6-8 | **6-10** |
| shadcn blocks | 40+ | 18+ | 8+ | **15-40** (developer tool) |
| Squarespace | ~6-8 presets | ~6-8 presets | ~4-6 presets | **5-7** |
| Framer (core) | ~4-6 | ~4-6 | ~3-4 | **4-5** |
| Frameblox (kit) | 20+ | 15+ | 10+ | **15+** (power users) |

### The Two-Tier Pattern

Every platform that serves both beginners AND power users uses a **two-tier system**:

1. **Curated defaults** (4-6 variants shown initially): These cover 80% of use cases
2. **Extended library** (10-40+ variants available on demand): For users who want more

This is exactly progressive disclosure in action.

### Recommendation for Hey Bradley

**Is 8 the right number? No -- but it is close.**

The optimal structure:

| Section Type | Starter Variants (visible) | Extended (on-demand) | Total |
|-------------|---------------------------|---------------------|-------|
| Hero | **4** (centered, split-image, minimal, gradient) | +4 (video bg, app mockup, with-stats, angled) | 8 |
| Features | **4** (grid-3col, grid-4col, alternating, icon-list) | +2 (bento, centered) | 6 |
| Pricing | **3** (2-tier, 3-tier, comparison) | +2 (single-card, toggle-first) | 5 |
| CTA | **3** (simple, split, gradient) | +2 (newsletter, with-image) | 5 |
| Testimonials | **3** (card-grid, single-quote, carousel) | +2 (logo-wall, side-by-side) | 5 |
| FAQ | **3** (accordion, two-column, plain-list) | +1 (categorized) | 4 |
| Value Props | **3** (stats-bar, icon-grid, big-numbers) | +1 (animated) | 4 |
| Footer | **3** (multi-column, simple, minimal) | +1 (mega-footer) | 4 |
| Navbar | **3** (simple, centered-logo, with-cta) | +1 (transparent) | 4 |

**Rule of thumb: 3-4 visible variants per section. The hero gets 4 because it is the most impactful section. Everything else gets 3.**

**Total: ~29 starter variants + ~16 extended = ~45 total variants across 9 section types.**

---

## 4. Column Count as Separate Control

### Who Does This?

| Platform | Column Count Separate? | How |
|----------|----------------------|-----|
| **Webflow** | YES -- fully separate | CSS Grid visual controls. User sets column count, gap, and alignment independently. |
| **Squarespace** | Partial | Fluid Engine uses a flexible grid. Users resize blocks to span columns, but there is no explicit "column count" control. |
| **Framer** | Partial | Grid layout component with configurable columns. Part of the layout settings, not content. |
| **Wix** | NO | Column count is baked into the strip/section preset. Users choose a preset that implies the column layout. |
| **Tailwind UI** | N/A | Developers set grid columns in code. Not a runtime control. |
| **v0.dev** | N/A | AI decides column count from prompt context. |

### The Two Approaches

**Approach A: Column count baked into variant** (Squarespace, Wix)
- User picks "3-column features grid" as a variant
- Simple, no decisions beyond the variant choice
- Limiting if user wants 4 columns with the 3-column layout style

**Approach B: Column count as separate control** (Webflow, Framer)
- User picks "grid features" variant, then adjusts column count separately
- More flexible, but adds another decision
- Risk: 2-column features looks odd if the variant was designed for 3

### Recommendation for Hey Bradley

**Use Approach A (column count baked into variant) for Phase 3-4, with a path to Approach B for Phase 5+.**

Rationale:
- Our target user is non-technical (the "grandma test" -- see below)
- Fewer controls = fewer bad decisions
- Variant names should encode the column count: `grid-3col`, `grid-4col`
- In Phase 5+, add a "Columns" dropdown (2/3/4) as an advanced setting inside the right panel

---

## 5. Visual Thumbnail Systems

### How Platforms Present Variant Choices

| Platform | Selection Method | Thumbnail Style |
|----------|-----------------|-----------------|
| **Squarespace** | Visual picker with live miniature previews | Gray/placeholder content, shows layout structure. Approximately 100x60px thumbnails in a 2-column grid. |
| **Framer** | Sidebar list with inline previews | Minimally styled, shows structural layout. Insert Menu stays open during selection. |
| **Wix** | Visual gallery of pre-designed sections | Full-color thumbnails showing styled content. Users see what the section will actually look like. |
| **Webflow** | No variant picker (build from scratch) | N/A |
| **WordPress (Visual Composer)** | Block template gallery | Full preview thumbnails. "Replace the content of the template with your own." |
| **ShopBase** | Thumbnail-only variant picker | Square (1:1), Portrait (3:4), or Landscape (16:9) image ratios |

### Two Philosophies

**Wireframe thumbnails** (Squarespace, Framer): Show gray boxes and lines representing layout structure. Neutral. Users focus on layout, not color/content. Lower maintenance -- thumbnails do not need to match the current theme.

**Styled thumbnails** (Wix, WordPress): Show full-color previews with sample content. More immediately appealing. But they set style expectations that may not match the user's theme.

### Recommendation for Hey Bradley

**Use wireframe-style thumbnails** (gray layout diagrams, 2:1 aspect ratio) for variant selection.

Reasons:
- Theme-independent: thumbnails stay valid regardless of user's color choices
- Faster to produce (SVG or simple React components)
- Focuses user attention on layout structure, which is the actual decision
- Match the builder's dark-mode aesthetic with subtle wireframe outlines

Implementation approach:
- Each variant gets a small SVG diagram (80x40px or 120x60px)
- Show in a 2-column grid within the right panel when a section is selected
- Currently selected variant gets an accent border
- On hover, show a slightly larger tooltip preview

---

## 6. Layout vs Content Separation

### How Platforms Separate Layout from Content

| Platform | Separation Model |
|----------|-----------------|
| **Squarespace** | Strong separation. Section type (list/gallery/blank) defines layout. Blocks define content. Two-step process. |
| **Framer** | Moderate separation. Sections have a layout structure. Content is placed inside using components. Variables control data. |
| **Wix** | Moderate. Sections define the container. Strips overlay content. Elements are placed freely within strips. |
| **Webflow** | Full separation. Layout is CSS (Grid/Flexbox). Content is HTML elements. Style panel is completely separate from content panel. |
| **Tailwind UI** | Full separation in code. Layout uses Tailwind utility classes. Content is JSX props/children. |
| **shadcn** | Full separation. Component receives data as props. Layout is handled by the parent container and Tailwind classes. |

### Hey Bradley's Current Model

Our `sectionSchema` already separates these:
```
section.variant  -> Layout choice (e.g., "centered", "split")
section.layout   -> CSS properties (display, padding, etc.)
section.content  -> Data (text, images, etc.)
section.style    -> Visual treatment (colors, backgrounds)
section.components[] -> New structured content model
```

This is a good foundation. The `variant` field drives the layout template. Content fills in the template slots. The key is to ensure each variant defines which content slots are available and which are required.

---

## 7. Image-First vs Text-First Card Design

### The Two Patterns

**Text-First Cards (Stripe, Linear pattern):**
- Icon at top
- Bold title
- 1-2 line description
- No image
- Best for: abstract features, technical capabilities
- Feels: clean, professional, information-dense

**Image-First Cards (Wix, WordPress pattern):**
- Large image/screenshot at top
- Title below image
- Short description
- Best for: physical products, portfolio items, case studies
- Feels: visual, magazine-like, consumer-friendly

**Split Cards (Vercel, Notion pattern):**
- Image on one side, text on the other
- Alternating left/right per row
- Best for: detailed feature explanations with demos
- Feels: narrative, story-telling, editorial

### Platform Preferences

| Platform | Default Card Style | Why |
|----------|-------------------|-----|
| Stripe | Text-first with icon | Technical audience, abstract services |
| Linear | Text-first, monochrome icons | Developer audience, clean aesthetic |
| Vercel | Split (alternating) | Show deployment previews alongside text |
| Notion | Image-first for templates, text-first for features | Dual audience (consumers + teams) |
| Squarespace | Image-first (list sections) | Creative/portfolio audience |
| Tailwind UI | Both, user chooses variant | Developer flexibility |

### Recommendation for Hey Bradley

Offer both as distinct feature variants:
- `grid-3col` and `grid-4col` = text-first cards (icon + title + description)
- `alternating` = split cards (text + image, alternating sides)
- Future: `image-grid` = image-first cards (photo + title + caption)

Default to text-first for SaaS themes, image-first for portfolio/creative themes. The theme JSON's `meta.tags` can drive this default.

---

## 8. The Grandma Test

### What Is It?

The "grandma test" asks: could a non-technical person (your grandmother) successfully use this builder to create a professional-looking website without help?

### How Professional Builders Pass the Grandma Test

**1. Limit visible options (Hick's Law)**
- Squarespace: 4 section types in the picker, not 40
- Framer: Sections are minimally styled, reducing confusion
- Wix: Pre-designed sections with full styling -- user just swaps content

**2. Use visual selection, not text menus**
- Every builder that targets non-technical users shows thumbnails, not text lists
- The variant picker should look like choosing a photo, not reading a menu

**3. Name things by outcome, not by technique**
- "Reviews" not "Testimonials Card Grid"
- "Main Banner" not "Hero Section Centered Variant"
- "Pricing" not "3-Tier Pricing Comparison with Toggle"

**4. Smart defaults**
- Pre-populated content (placeholder text, sample images)
- The section should look "done" immediately after adding it
- Users edit content, they do not build from scratch

**5. Constrain the grid**
- Squarespace's Fluid Engine prevents overlapping blocks
- Framer's sections snap to a grid
- Wix strips guide content placement
- The user should not be able to break the layout

**6. One control per decision**
- Variant picker = one decision (which layout)
- Content editing = one decision per field (what text)
- No "column count" dropdown + "gap size" slider + "alignment" toggle all at once

### How Hey Bradley Should Apply This

| Principle | Current State | Needed Change |
|-----------|--------------|---------------|
| Limited visible options | 9 section types in "Add Section" menu | Good -- keep this focused |
| Visual selection | Text list with icons only | Add thumbnail previews for variant selection |
| Outcome-based naming | Mostly good ("Main Banner", "Reviews") | Minor tweaks (see Section 2) |
| Smart defaults | Sections added with placeholder content | Good -- ensure all variants have complete defaults |
| Constrained grid | Sections are full-width, ordered vertically | Good -- no freeform drag |
| One control per decision | Variant is implicit, not yet user-selectable | Add variant picker in right panel |

---

## 9. Recommendations for Hey Bradley

### Immediate (Phase 3-4)

1. **Add a variant picker to the right panel.** When a section is selected, show 3-4 wireframe thumbnails in a 2-column grid. Clicking one switches the variant. This is the single highest-impact UX improvement.

2. **Define 3-4 starter variants per section type.** Use the variant table from Section 3. Start with the "visible" variants only. Total: ~29 variants.

3. **Name variants by layout description.** Follow Tailwind UI's pattern:
   - `centered` -- text and CTA centered
   - `split-image` -- text on one side, image on other
   - `grid-3col` -- 3-column card grid
   - `accordion` -- expandable Q&A pairs

4. **Pre-populate every variant with complete placeholder content.** The section should look professional the moment it is added. No blank sections.

5. **Keep column count baked into variant names.** Do not add a separate column control yet.

### Medium-Term (Phase 5-6)

6. **Add an "Extended Variants" expander** below the starter thumbnails. Shows additional 1-3 variants per section. Progressive disclosure.

7. **Add column count as an advanced control** in the right panel. Only for features, testimonials, and value_props where it makes sense.

8. **Theme-aware variant defaults.** SaaS themes default to text-first cards. Creative themes default to image-first. Driven by `meta.tags` in the theme JSON.

### Long-Term (Phase 7+)

9. **AI variant suggestion.** In listen/chat mode, the AI picks the best variant based on the user's content description. No manual picker needed.

10. **Custom variant creation.** Power users can save a configured section as a custom variant.

---

## Appendix A: Section Type Comparison Matrix

| Section Type | Sqsp Name | Framer Name | Wix Name | Tailwind UI Name | shadcn Name | Hey Bradley Name |
|-------------|-----------|-------------|----------|-----------------|-------------|-----------------|
| Navigation | (blank) | Header | Header | Headers | Header | Top Menu |
| Hero | (blank) | Hero | Hero | Hero Sections | Hero | Main Banner |
| Features | List Section | Features | Features | Feature Sections | Feature | Features |
| Value Props | (blank) | (none) | (none) | Stats | Stats | Highlights |
| Testimonials | List Section | Testimonials | Testimonials | Testimonials | Testimonials | Reviews |
| Pricing | List Section | Pricing | Pricing | Pricing Sections | Pricing | Pricing |
| FAQ | List Section | FAQ | FAQ | FAQs | FAQ | FAQ |
| CTA | (blank) | (none) | CTA | CTA Sections | CTA | Action Block |
| Footer | (blank) | Footer | Footer | Footers | Footer | Footer |

## Appendix B: Variant Count by Platform

| Section | Tailwind UI | shadcn (total) | Squarespace | Framer (core) | Hey Bradley (proposed) |
|---------|------------|----------------|-------------|---------------|----------------------|
| Hero | 10-12 | 40+ | 6-8 | 4-6 | **4 + 4 extended = 8** |
| Features | 10-12 | 18+ | 6-8 | 4-6 | **4 + 2 extended = 6** |
| Pricing | 6-8 | 8+ | 4-6 | 3-4 | **3 + 2 extended = 5** |
| CTA | 6-8 | 6+ | 4-6 | 3-4 | **3 + 2 extended = 5** |
| Testimonials | 6-8 | 8+ | 4-6 | 3-4 | **3 + 2 extended = 5** |
| FAQ | 4-6 | 6+ | 3-4 | 2-3 | **3 + 1 extended = 4** |
| Value Props | 4-6 | 4+ | 2-3 | 2-3 | **3 + 1 extended = 4** |
| Footer | 6-8 | 6+ | 3-4 | 2-3 | **3 + 1 extended = 4** |
| Navbar | 6-8 | 6+ | 3-4 | 2-3 | **3 + 1 extended = 4** |
| **TOTAL** | ~70 | ~100+ | ~40 | ~30 | **29 + 16 = 45** |

## Appendix C: Key Sources

- [Squarespace Page Sections Help Center](https://support.squarespace.com/hc/en-us/articles/360027987711-Page-sections)
- [Squarespace Content Blocks Help Center](https://support.squarespace.com/hc/en-us/articles/206543757-Adding-content-with-blocks)
- [Squarespace 7.1 Page Section Types - Inside the Square](https://insidethesquare.co/resources/page-sections)
- [All Squarespace 7.1 Sections - MDC Designs](https://mdc-designs.com/blog/squarespace-71-sections)
- [Framer Sections Insert Update](https://www.framer.com/updates/sections)
- [Framer Insert 2.0: Pages and Sections](https://www.framer.com/updates/insert-pages)
- [Framer Component Library Best Practices](https://www.framer.com/help/articles/best-practices-for-setting-up-a-component-library/)
- [Frameblox UI Kit - 650+ Components](https://www.frameblox.com/components)
- [SegmentUI - 1000+ Variations](https://segmentui.com/)
- [Wix Sections and Strips Tutorial](https://www.wix.com/learn/tutorials/web-design/work-with-sections-and-strips)
- [Wix Sections vs Strips - Cathleen Hall Creative](https://www.cathleenhallcreative.com/post/strips-versus-sections)
- [Tailwind UI Marketing Components](https://tailwindcss.com/plus/ui-blocks/marketing)
- [Tailwind UI Hero Sections](https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes)
- [Tailwind UI Feature Sections](https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections)
- [Tailwind UI CTA Sections](https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections)
- [Tailwind UI Pricing Sections](https://tailwindcss.com/plus/ui-blocks/marketing/sections/pricing)
- [Tailwind UI Testimonials](https://tailwindcss.com/plus/ui-blocks/marketing/sections/testimonials)
- [shadcn/ui Official Blocks](https://ui.shadcn.com/blocks)
- [Shadcnblocks - 1429 Blocks](https://www.shadcnblocks.com/)
- [shadcn-ui-blocks - 40 Hero Variants](https://www.shadcn-ui-blocks.com/blocks/react/marketing/hero-sections/1)
- [Shadcn Hero Blocks](https://www.shadcnblocks.com/blocks/hero)
- [Webflow Add Panel Help Center](https://help.webflow.com/hc/en-us/articles/33961270096659-The-Add-panel)
- [Webflow Components Overview](https://help.webflow.com/hc/en-us/articles/33961303934611-Components-overview)
- [v0.dev - AI Website Builder](https://v0.app/)
- [How to Prompt v0 - Vercel](https://vercel.com/blog/how-to-prompt-v0)
- [Lovable.dev](https://lovable.dev/)
- [Hick's Law - Laws of UX](https://lawsofux.com/hicks-law/)
- [Hick's Law in UX Design - Think Design](https://think.design/blog/understanding-hicks-law-ux-design/)
- [Visual Composer Block Templates](https://visualcomposer.com/blog/blocks-and-section-templates/)

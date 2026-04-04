# Phase 1.4 Design Notes

**Date:** 2026-03-29
**Source:** Human feedback with reference screenshots

---

## Right Panel Section Selector (Deferred to Phase 2)

**Current issue:** Right panel shows hero-specific options when non-hero sections are clicked. Needs section-aware routing.

**Required changes:**
1. Right panel top should show a dropdown to select which section is being edited
2. Clicking a section in left panel → right panel switches context
3. Clicking a section in main preview (add edit icon overlay) → right panel switches context
4. Each section type needs its own SIMPLE and EXPERT tab content

**Deferred because:** Phase 1 focus is hero section. Section-specific panels require a per-section-type JSON schema defining all configurable options.

---

## SIMPLE Tab Design (Grandma Mode) — Reference Image 1

From screenshot `hero-image-left.png`:
- **Component toggles at top** with green checkmarks showing what's ON
  - Eyebrow badge, Primary & secondary headlines, Dual CTA buttons, Trust badges
- **Content section** with copy fields
- **Clean, non-overwhelming** — only essential options visible
- **"Uses AI Symbolic Protocol"** notice — AISP integration indicator

**Takeaway:** The SIMPLE tab should feel like a checklist, not a control panel. Show WHAT is enabled (green checks), CONTENT to edit (text fields), and nothing else.

---

## EXPERT Tab Design (Advanced Options) — Reference Image 2

From screenshot `love-expert-hero.png`:
- **Component toggles** as pill switches (Primary Button, Secondary Button, Hero Image, Trust Badges)
- **CONTENT accordion** (collapsed)
- **STYLE accordion** (expanded) with:
  - Section Width: Narrow / Medium / Wide / XWide / Full (segmented control)
  - Aspect Ratio: 2:1 / 16:9 / Full
  - Headline Weight: Normal / Bold
  - Headline Size: S / M / L / XL / XXL
  - Headline Color: color dots + "Auto" option
  - Button Size: S / M / L / XL
  - Button Style: Filled / Outline / Ghost / Gradient
  - Overlay Opacity: slider (0-100)
  - Content Alignment: Left / Center / Right

**Takeaway for Phase 2:**
- Segmented controls for discrete options (not dropdowns)
- Color dots for quick color selection
- Slider for continuous values (opacity)
- Group related controls under clear labels
- "Auto" option for colors (derive from theme)

---

## Section-Level JSON Schema (Deferred)

Each section type needs a master JSON defining ALL configurable options:
- Hero: layout variant, component visibility, copy, image/video, style (colors, fonts, spacing, overlay)
- Features: grid cols, card style, icon set, title/description per card
- CTA: layout variant, copy, button style, background
- Pricing: tier count, pricing data, feature comparison
- Footer: column count, links, social, copyright
- Testimonials: card layout, avatar, quote, name/title
- FAQ: accordion style, Q&A pairs

This JSON becomes the source of truth for what the SIMPLE and EXPERT tabs show for each section type.

---

## Image Treatment Options (Phase 2+)

From reference screenshots, these image controls should be available in EXPERT:
- **Image Sizing:** Fill / Fit / Circle
- **Image Placement:** Top / Left / Right / Bottom / Background
- **Center Image:** Center / Top / Bottom
- **Image Effects:** None / Zoom on Hover / Slow Pan

# Theme Comparison: Hey Bradley vs Best-in-Class

> Research date: 2026-03-28
> Purpose: Brutally honest gap analysis between Hey Bradley's current theme system and what real website builders ship.

---

## Top 10 Marketing Site Heroes from Leading Builders

### 1. Stripe (stripe.com) -- Full-Screen Animated Gradient
A living mesh gradient occupies the entire viewport -- purples, blues, cyans shifting with WebGL animation. No stock photos. Centered headline in massive white Inter font, a single-line subheading, and one blue CTA button. The gradient IS the visual. Nobody forgets this hero because no other site looks like it. The entire page below follows the same gradient-to-section flow.

### 2. Linear (linear.app) -- Ultra-Minimal Dark
Pure black background. One line of white text at ~56px. A single muted subheading. One button. No images, no video, no badge, no trust text. The emptiness IS the design. Everything below follows the same stark minimalism -- tight grids, monochrome, Inter font throughout.

### 3. Vercel (vercel.com) -- Centered Dark with Prismatic Gradient Text
Black background. The headline uses a gradient fill (blue to pink to orange) on the text itself, not the background. Small CTA pair below. Triangular/prismatic graphic element. This is "centered" layout but the gradient text effect makes it instantly recognizable.

### 4. Notion (notion.so) -- Light Split with Product Screenshot
Warm cream/beige background (#faf5ef). Left side: friendly serif headline, subheading, CTA. Right side: actual product screenshot with drop shadow showing the Notion UI. The product image occupies ~50% of the hero. This is a true split layout where the image carries real meaning.

### 5. Loom (loom.com) -- Split with Video Preview
White background. Left side: bold headline, purple CTA button. Right side: a video player preview showing an actual Loom recording with play button overlay. The video preview is the star -- it demonstrates the product. Purple accent color ties everything together.

### 6. Squarespace (squarespace.com) -- Full-Bleed Editorial Photography
A massive, full-viewport background photograph (lifestyle/architectural) with dark overlay gradient. White text centered in the lower third. Minimal CTA. The photography quality is the differentiator -- every template ships with professionally shot, royalty-free images that make the template look expensive out of the box.

### 7. Webflow (webflow.com) -- Interactive 3D / Animated Hero
Dark background with an interactive 3D element or animated illustration that responds to cursor movement. Text is left-aligned. The interactivity creates instant engagement. This goes beyond static layouts entirely.

### 8. Framer (framer.com) -- Kinetic Typography Hero
Dark background with animated text transitions -- words swap in/out with smooth motion. The text animation IS the hero visual. No images needed. Below the hero, sections use the same animation language with scroll-triggered reveals.

### 9. Arc (arc.net) -- Full-Screen Video Background
A looping ambient video fills the entire viewport. Centered white text floats over the video with a dark gradient overlay for legibility. The video shows the product in use. Below, sections alternate between video backgrounds and clean white sections.

### 10. Raycast (raycast.com) -- Dark Split with Floating Product UI
Dark gradient background. Left: headline + CTA. Right: a floating, glowing product UI mockup with subtle shadow and reflection effects. The product screenshot has custom styling (glow, rounded corners, shadow) that makes it feel premium, not just a flat image drop.

---

## What Makes These Heroes Work

Every one of these heroes is **instantly distinguishable** from the others. You could show any of them as a 200px thumbnail and someone would know which site it was. The reasons:

1. **Each has a unique visual anchor** -- gradient, photo, video, 3D element, animated text, product screenshot
2. **Layout varies dramatically** -- centered, left-aligned, split 50/50, full-bleed image, overlay
3. **Component visibility differs wildly** -- some show badges, some don't. Some show trust text, some don't. Some have 1 CTA, some have 2, some have 0
4. **Typography is distinct** -- serif vs sans-serif, bold vs light, gradient-filled vs solid
5. **Images/videos are specific and relevant** -- not generic, not placeholder, not empty

---

## Hey Bradley Current State (Honest Assessment)

### What's Working

- The applyVibe() function does full JSON replacement (correct architecture)
- There are 4 hero components: HeroCentered, HeroSplit, HeroOverlay, HeroMinimal
- Theme JSON files specify different variants (centered, split-right, split-left, overlay, minimal)
- The variant routing in RealityTab.tsx correctly dispatches to the right component
- Color palettes are genuinely different between themes
- The HeroOverlay component correctly handles both image and video backgrounds
- The HeroSplit component correctly reads heroImage from components[]
- The HeroCentered component reads heroVideo from components[]
- Component enabled/disabled flags vary across themes (badge, secondaryCta, trustBadges, heroImage)

### What's Broken

1. **All 10 themes use the exact same headline text**: "Build Websites by Just Talking" -- zero text differentiation even between wildly different theme moods
2. **All 10 themes use the exact same subheading**: "Describe what you want, watch it appear in real-time, and get production-ready specs."
3. **Only 3 of 10 themes have heroImage enabled** (notion-warm, loom-friendly, studio-bold) -- should be 7-8
4. **Only 2 themes have heroVideo enabled** (stripe-flow, video-ambient) -- and video rendering depends on browser CORS and autoplay policies
5. **6 of 10 themes use `system-ui` as their font** -- almost zero typographic differentiation
6. **The features and CTA sections are IDENTICAL across all 10 themes** -- same 3 feature cards ("Lightning Fast", "Precise Specs", "Enterprise Ready"), same CTA text
7. **Theme thumbnails display in a single-column grid** (`grid-cols-1` in ThemeSimple.tsx) -- wastes space and makes comparison difficult
8. **No theme has animated gradients, parallax, or interactive elements** -- all are static
9. **Split layouts use the same Unsplash image** (photo-1522071820081) for both notion-warm and loom-friendly
10. **The theme card previews in ThemeSimple.tsx show a simplified mockup** (tiny text + colored rectangle), not a real preview or screenshot

### Variant Distribution

| Variant | Themes Using It | Count |
|---------|----------------|-------|
| `centered` | stripe-flow, notion-warm, vercel-prism, pastel-playful | 4 |
| `minimal` | linear-sharp, neon-terminal | 2 |
| `split-right` | loom-friendly | 1 |
| `split-left` | studio-bold | 1 |
| `overlay` | nature-calm, video-ambient | 2 |

This is actually decent distribution, but the visual output is still too similar because:
- Centered and minimal render nearly identically (both are centered text with CTA)
- Overlay themes lack visible background images/video in most cases
- Split themes share the same stock image

### Image/Video Usage

| Theme | heroImage enabled | heroImage URL | heroVideo enabled | heroVideo URL |
|-------|------------------|---------------|-------------------|---------------|
| stripe-flow | No | (empty) | Yes | pexels 857251 |
| notion-warm | Yes | unsplash 1522071820081 | N/A | N/A |
| linear-sharp | No | (empty) | N/A | N/A |
| loom-friendly | Yes | unsplash 1522071820081 (SAME) | N/A | N/A |
| vercel-prism | No | (empty) | N/A | N/A |
| nature-calm | Yes | unsplash 1507525428034 | N/A | N/A |
| studio-bold | Yes | unsplash 1618005182384 | N/A | N/A |
| video-ambient | No | (empty) | Yes | pexels 3129671 (low-res 360p) |
| pastel-playful | No | (empty) | N/A | N/A |
| neon-terminal | No | (empty) | N/A | N/A |

**Critical findings:**
- 6 of 10 themes have NO visual media at all (no image, no video)
- 2 themes share the exact same Unsplash photo
- 1 video is 360p resolution (video-ambient) -- will look terrible full-screen
- Only 4 unique images/videos across all 10 themes

### Score: 25/100 for Differentiation

---

## Gap Analysis

| Feature | Best-in-Class (Wix/Squarespace/Webflow) | Hey Bradley | Gap |
|---------|----------------------------------------|-------------|-----|
| Distinct hero layouts | 15-20 genuinely different | 4 components, 5 variants | Moderate (architecture exists, content missing) |
| Background images | Every template has a unique, high-quality image | 4 of 10 have images, 2 are duplicates | Critical |
| Video backgrounds | 3-5 templates with HD/4K video | 2 themes, 1 is 360p | Critical |
| Split layouts with visible image | 5-8 templates, all with unique images | 2 themes, sharing same image | Critical |
| Overlay layouts with bg media | 3-5 templates with stunning photography | 2 themes, 1 has image (ocean), 1 has low-res video | Weak |
| Component visibility variation | Varies dramatically per template | Some variation (badge, secondaryCta) but text content identical | Moderate |
| Font variety | 10+ distinct font pairings per builder | 6 of 10 use system-ui, only 3 named fonts (Inter, DM Sans, JetBrains Mono) | Critical |
| Heading text per template | Each template has unique placeholder text | ALL 10 have identical headline + subheading | Critical |
| Feature/CTA section variety | Each template has unique section content | ALL 10 have identical features and CTA | Critical |
| Image positions | bg, left, right, top, bottom, overlay, floating, 3D | bg and side-split only | Significant |
| Interactive/animated elements | Parallax, scroll animations, hover effects, 3D | None -- all static | Missing |
| Theme preview quality | Live previews or high-fidelity screenshots | Tiny CSS mockups (7px text, colored rectangles) | Critical |
| Template count | Wix: 900+, Squarespace: 150+, Webflow: 2000+ | 10 | Expected (custom product, not template marketplace) |
| Theme selector layout | 2-3 column grid with large previews | Single column, small cards | UX issue |

---

## What Each of the 10 Themes ACTUALLY Looks Like (Honest)

### 1. Stripe Flow (centered, dark)
Dark navy gradient background. Centered white text "Build Websites by Just Talking" with sparkle badge above. Two CTA buttons. Trust text below. Video component is enabled but may not autoplay in many browsers. Without the video, this is just white text on a dark gradient. **Distinguishable in 1 second?** Maybe -- the gradient is distinctive.

### 2. Notion Warm (centered, light)
Warm cream background. Dark text, same headline. No badge (disabled). One CTA button (secondary disabled). Image enabled but renders BELOW the text in centered layout (HeroCentered doesn't render images -- it only renders video). **The image is in the JSON but the centered component ignores it.** Trust text visible. **Distinguishable in 1 second?** Yes -- light cream is visually different from dark themes. But the image doesn't show.

### 3. Linear Sharp (minimal, dark)
Pure black background. Light gray text, same headline. No badge, no secondary CTA, no trust text, no image. Just text and one button. **Distinguishable in 1 second?** Barely -- very similar to Vercel Prism and Neon Terminal in feel.

### 4. Loom Friendly (split-right, light)
White background. HeroSplit renders with text on left, image on right. Image URL points to an Unsplash collaboration photo. Badge + both CTAs + trust badges all enabled. **Distinguishable in 1 second?** Yes -- the split layout with image is visually different. BUT the image is a generic stock photo, not product-relevant.

### 5. Vercel Prism (centered, dark)
Black-to-dark-gray gradient. White text, same headline. No badge, no secondary CTA, no image. Trust text enabled. **Distinguishable in 1 second?** No -- almost identical to Linear Sharp. The only difference is the gradient vs pure black and trust text visibility.

### 6. Nature Calm (overlay, dark)
Black background with HeroOverlay component. heroImage enabled with ocean landscape photo. The overlay component renders the image as a full background with dark gradient overlay and white text on top. **Distinguishable in 1 second?** Yes -- the ocean photo background makes this genuinely different. This is the best-working theme.

### 7. Studio Bold (split-left, light)
Light gray background. HeroSplit renders with image on left (geometric art), text on right. No badge, no secondary CTA, no trust badges. Heading weight 800 (extra bold). **Distinguishable in 1 second?** Yes -- split layout + unique image + bold weight makes this stand out.

### 8. Video Ambient (overlay, dark)
Black background with HeroOverlay. heroVideo enabled with Pexels video (360p resolution). If video loads: ambient video plays behind dark overlay with white text. If video fails: black screen with text. **Distinguishable in 1 second?** Only if video loads. At 360p it will look pixelated on any modern display.

### 9. Pastel Playful (centered, light)
Soft lavender background (#f0e6ff). Dark purple text, same headline. Badge enabled, both CTAs, trust badges. No image, no video. Rounded corners (20px). **Distinguishable in 1 second?** Yes on color alone (only purple-tinted light theme), but layout is identical to Stripe Flow minus the gradient.

### 10. Neon Terminal (minimal, dark)
GitHub-dark background (#0d1117). Green-tinted muted text (#c9d1d9). JetBrains Mono font. No badge, no secondary CTA, no trust badges, no image. **Distinguishable in 1 second?** Barely -- the monospace font and green accent help but it's still just text-on-dark.

### Summary: Can You Tell Them Apart?

| Theme | Unique Visual Anchor? | Distinguishable in 1s? |
|-------|----------------------|----------------------|
| Stripe Flow | Dark gradient + video (if it loads) | Maybe |
| Notion Warm | Cream background (image doesn't render in centered) | Yes (color) |
| Linear Sharp | Pure black, stripped down | No (looks like Vercel) |
| Loom Friendly | Split layout + stock photo | Yes |
| Vercel Prism | Black gradient | No (looks like Linear) |
| Nature Calm | Ocean photo overlay | Yes -- BEST |
| Studio Bold | Split layout + geometric art | Yes |
| Video Ambient | Video overlay (if 360p loads) | Maybe |
| Pastel Playful | Lavender background | Yes (color) |
| Neon Terminal | Monospace font + green accent | Barely |

**Verdict: 4 of 10 are genuinely distinguishable. 3 are maybe. 3 are not.**

---

## Root Cause Analysis

### Why the themes look similar despite different JSON

1. **HeroCentered ignores heroImage** -- It only checks for heroVideo. Themes like notion-warm specify a heroImage but HeroCentered never renders it. The image data exists in the JSON but is invisible.

2. **HeroMinimal ignores ALL media** -- No image handling, no video handling. It only renders text + CTA. Linear-sharp and neon-terminal are pure text-on-background with no visual anchor.

3. **HeroOverlay works correctly** but only 2 themes use it (nature-calm, video-ambient). This is the only hero component that properly renders both images and videos as backgrounds.

4. **HeroSplit works correctly** but only 2 themes use it (loom-friendly, studio-bold), and they share similar stock photos.

5. **Identical copy across all themes** -- Every theme says "Build Websites by Just Talking." In real website builders, each template has unique placeholder copy that matches the template's mood/industry.

6. **Identical sections beyond hero** -- Features and CTA sections have the exact same content in all 10 themes. Color changes, but the text and structure are identical.

7. **Font homogeneity** -- 6 of 10 themes use `system-ui`. Real builders ship each template with a distinct font pairing (heading font + body font).

8. **No animated/interactive elements** -- All heroes are static HTML/CSS. Real builders include parallax, scroll animations, gradient animations, and interactive elements.

---

## Required Fixes

### Fix 1: Theme JSON Structure -- Complete Section Definitions with Unique Media

Each theme JSON needs:
- **Unique headline and subheading text** per theme (match the mood -- "Nature Calm" should NOT say "Build Websites by Just Talking")
- **Unique heroImage URL** for every theme that uses images (8-9 of 10 themes)
- **HD video URLs** (1080p minimum) for video themes -- replace the 360p Pexels video
- **Unique feature card content** per theme (different icons, titles, descriptions)
- **Unique CTA section content** per theme
- At least 8 distinct Unsplash/Pexels images across 10 themes (no repeats)

### Fix 2: Hero Component Rendering -- Must Render Images from components[]

- **HeroCentered**: Add heroImage rendering. When heroImage is enabled, render it below the text content as a large product screenshot/illustration (like Notion does). This creates the "centered with image below" pattern.
- **HeroMinimal**: Decide whether minimal should support a subtle background image (low opacity) or stay text-only. If text-only, ensure the font/weight/spacing creates enough visual interest to stand alone.
- **HeroOverlay**: Already works. No changes needed.
- **HeroSplit**: Already works. No changes needed. Just needs more unique images in theme JSONs.

### Fix 3: Layout Variant Additions

Add these new variants that real builders offer:
- **`centered-with-image`** -- centered text above, large image/screenshot below (like Notion, Figma, Slack)
- **`full-video`** -- full-viewport video background, no image fallback needed (like Arc)
- **`left-aligned`** -- text left-aligned (not centered) with no image, for text-heavy brands (like many SaaS sites)
- **`asymmetric-split`** -- 60/40 split instead of 50/50, with image on the larger side

### Fix 4: Theme Card Display -- 2-Column Grid

In `ThemeSimple.tsx`, change:
```
grid-cols-1  -->  grid-cols-2
```
This immediately makes the theme picker more usable. Each card should also show a higher-fidelity preview -- consider rendering actual hero content at small scale instead of the current 7px text mockup.

### Fix 5: Color Palette Selector

Add a standalone color palette picker that works independently of themes:
- 5 preset palettes (e.g., Ocean, Sunset, Forest, Midnight, Candy)
- Each palette provides 6 color slots: primary, secondary, accent, background, surface, text
- Selecting a palette updates `config.theme.colors` without changing layout/components/images
- User can also manually edit individual color slots

### Fix 6: Font Selector

Add a font picker with 5-8 curated options:
- Inter (clean sans-serif)
- DM Sans (friendly sans-serif)
- Playfair Display (elegant serif)
- Space Grotesk (modern geometric)
- JetBrains Mono (developer/code)
- Merriweather (readable serif)
- Poppins (rounded friendly)
- System UI (fallback)

Each option should set both `fontFamily` and `headingFamily`. Some pairings should mix heading/body fonts (e.g., Playfair Display headings + Inter body).

### Fix 7: Master Options JSON

Create a `master-options.json` that defines the union of all possible theme options:
```json
{
  "variants": ["centered", "centered-with-image", "minimal", "split-right", "split-left", "overlay", "full-video", "left-aligned", "asymmetric-split"],
  "components": {
    "eyebrow": { "type": "badge", "toggleable": true },
    "headline": { "type": "heading", "editable": ["text", "size", "weight"] },
    "subtitle": { "type": "text", "editable": ["text"] },
    "primaryCta": { "type": "button", "toggleable": true, "editable": ["text", "url", "style"] },
    "secondaryCta": { "type": "button", "toggleable": true, "editable": ["text", "url", "style"] },
    "heroImage": { "type": "image", "toggleable": true, "editable": ["url", "alt", "aspect", "position"] },
    "heroVideo": { "type": "video", "toggleable": true, "editable": ["url", "poster"] },
    "trustBadges": { "type": "trust", "toggleable": true, "editable": ["text"] }
  },
  "colorPalettes": [
    { "id": "ocean", "colors": { "primary": "#0070F3", "secondary": "#7928CA", "accent": "#FF0080", "background": "#000000", "surface": "#171717", "text": "#ffffff" } },
    { "id": "sunset", "colors": { "primary": "#e8772e", "secondary": "#e16259", "accent": "#ffc857", "background": "#faf5ef", "surface": "#ffffff", "text": "#37352f" } },
    { "id": "forest", "colors": { "primary": "#22c55e", "secondary": "#06b6d4", "accent": "#22c55e", "background": "#0a1a0a", "surface": "#0f2d0f", "text": "#ffffff" } },
    { "id": "midnight", "colors": { "primary": "#5E6AD2", "secondary": "#5E6AD2", "accent": "#5E6AD2", "background": "#000000", "surface": "#111111", "text": "#eeeeee" } },
    { "id": "candy", "colors": { "primary": "#7c3aed", "secondary": "#ec4899", "accent": "#7c3aed", "background": "#f0e6ff", "surface": "#ffffff", "text": "#2d1b4e" } }
  ],
  "fontOptions": [
    { "id": "inter", "fontFamily": "Inter", "headingFamily": "Inter" },
    { "id": "dm-sans", "fontFamily": "DM Sans", "headingFamily": "DM Sans" },
    { "id": "editorial", "fontFamily": "Inter", "headingFamily": "Playfair Display" },
    { "id": "geometric", "fontFamily": "Inter", "headingFamily": "Space Grotesk" },
    { "id": "mono", "fontFamily": "JetBrains Mono", "headingFamily": "JetBrains Mono" }
  ]
}
```

### Fix 8: localStorage Persistence

Save `config` to localStorage on every change (debounced 500ms). On app load, check localStorage first:
```
const saved = localStorage.getItem('hey-bradley-config')
const initialConfig = saved ? JSON.parse(saved) : DEFAULT_CONFIG
```
This prevents users from losing their customizations on page refresh.

### Priority Order

1. **Fix theme JSONs with unique images/copy** (highest impact, no code changes needed)
2. **Fix HeroCentered to render heroImage** (enables 4 more themes to show images)
3. **Change theme grid to 2 columns** (1-line CSS change)
4. **Add unique fonts to theme JSONs** (JSON-only change)
5. **Add localStorage persistence** (small code change, big UX win)
6. **Add color palette selector UI** (new component)
7. **Add font selector UI** (new component)
8. **Add new hero variants** (new components + JSON)

---

## Sources

- [Wix Hero Section Layouts](https://www.wix.com/app-market/web-solution/hero-section-layouts)
- [Wix App Market - Hero Templates](https://www.wix.com/app-market/web-solution/hero-templates)
- [27 Best Wix Templates](https://www.websitebuilderexpert.com/website-builders/wix-templates/)
- [Best Wix Templates 2026](https://printify.com/blog/wix-templates/)
- [Best Squarespace Templates 2026](https://litextension.com/blog/best-squarespace-templates/)
- [Squarespace Layout Templates - AJM Experience](https://www.ajmexperience.com/squarespace-section-templates)
- [Building Professional Squarespace Hero Sections](https://www.pixelhaze.academy/squarespace-tutorials/building-professional-squarespace-hero-sections-and-layouts-a-complete-tutorial)
- [Split Screen Layout in Squarespace](https://www.will-myers.com/articles/split-layout-design-in-squarespace-71)
- [Framer Hero Section Components](https://www.framer.com/marketplace/components/tags/hero-section/)
- [Frameblox Hero Sections Library](https://www.frameblox.com/components/hero)
- [SegmentUI Framer Hero Components](https://segmentui.com/remix/hero)
- [Best WordPress Themes 2026](https://wordpress.com/blog/2026/01/26/best-wordpress-themes/)
- [Most Popular WordPress Themes 2026](https://superbthemes.com/blog/most-popular-wordpress-themes/)
- [Best Website Builders 2026](https://www.websitebuilderexpert.com/website-builders/)
- [Website Builder Comparison 2026](https://www.websitebuilderexpert.com/website-builders/comparisons/)
- [30+ Best Website Builder Templates 2026](https://www.sitebuilderreport.com/website-builder-templates)
- [Webflow Hero Section Templates](https://webflow.com/templates/search/hero-sections)
- [10 Best Hero Section Designs - Webflow](https://webflow.com/list/hero-section)
- [Relume Hero Header Sections](https://www.relume.io/categories/hero-header-sections)
- [The Art of the Hero Section - Orizon Design](https://medium.com/orizon-design/the-art-of-the-hero-section-common-design-layouts-and-when-to-use-them-8fc176c93458)
- [Hero Section Design Inspiration - 80+ Examples](https://reallygooddesigns.com/hero-section-design-examples/)
- [10 Best Hero Section Examples - LogRocket](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)
- [30 Hero Section Examples - Marketer Milk](https://www.marketermilk.com/blog/hero-section-examples)

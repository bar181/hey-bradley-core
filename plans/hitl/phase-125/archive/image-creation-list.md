# Hey Bradley — Image Creation List

> **Owner-authored asset acquisition spec for the P125 carry-forwards.**
> Drop-in companion to `retrospective.md` §5. Priority order — make
> these in sequence.

---

## Category 1 — Product Screenshots (highest priority)

*The most credible images on the site. Owner-captured, no stock photo
competes with a real screenshot of your product working well.*

### 1A. Builder — Hey Bradley default template loaded

```
What:     Screenshot of the builder with the Hey Bradley
          dark/crimson default template active.
          Left panel showing section list.
          Preview showing the "Describe it. See it." hero.
          Right panel showing Hero section editor.

Why:      Hero image for the demo section and the /docs page.
          Nothing else will do.

How:
  1. Open localhost:5173/builder
  2. Load the Hey Bradley default template (P125 output —
     dark Harvard depth + Cormorant Garamond, post-P125 update
     to src/data/examples/hey-bradley-flagship/index.ts)
  3. Expand to full screen, hide browser chrome
  4. Screenshot at exactly 1440×900 px
  5. Crop to show only the 3-panel layout, not the OS

Where:    public/images/product/builder-default.png
Used on:  /docs hero, /about, OG image base
```

### 1B. Builder — Listen mode active (red orb visible)

```
What:     Screenshot of listen mode left panel with
          the crimson orb glowing. "Ready to listen…"
          visible. Voice waveform animated (capture mid-wave).

How:
  1. Open builder, click Listen tab
  2. The orb is always visible in this state
  3. Screenshot the LEFT PANEL ONLY (crop tightly)
  4. 600×800 px portrait crop

Where:    public/images/product/listen-mode.png
Used on:  Landing page section 4 (why it's different)
```

### 1C. Agentics — AISP Crystal Atom view

```
What:     Screenshot of the Agentics tab showing
          a filled Crystal Atom spec (Ω/Σ/Γ/Λ/Ε blocks
          with real content, not empty).

How:
  1. Open builder, build a real site first (voice or chat)
  2. Click Agentics → AISP Crystal Atom card
  3. The full spec should be visible with real content
  4. Screenshot at 1200×800 px
  5. Crop to just the spec panel, not the left panel

Where:    public/images/product/aisp-spec-view.png
Used on:  /docs AISP section, /aisp page, blog posts
```

### 1D. Builder — Site being built (mid-build state)

```
What:     Screenshot showing the preview panel with
          a beautiful site partially built —
          hero section rendered, features section
          just appearing. Captures the "building" feeling.

How:
  1. Build a portfolio or coffee shop site
  2. Stop after 2-3 sections are rendered
  3. Screenshot the PREVIEW PANEL ONLY (right 70%)
  4. Crop tight to the preview iframe

Where:    public/images/product/builder-in-progress.png
Used on:  Cinematic demo fallback, social cards
```

---

## Category 2 — Demo Site Frames

*These appear inside the cinematic demo animation. They need to look
like real, beautiful built websites — not placeholder content.*

### 2A. Asheville Roasters — coffee shop site

```
What:     A beautiful coffee shop website hero section.
          Dark background, crimson CTA, editorial feel.
          Headline:  "Asheville Roasters"
          Subhead:   "Slow-roasted, served warm,
                      poured by people who know your name."
          CTA:       "See the menu →"
          Feature row: Menu · Hours · Visit (3 icons)

How:      BUILD THIS IN HEY BRADLEY FIRST.
          Use the builder to actually create this site.
          Then screenshot it.
          The demo will reference this screenshot.
          DO NOT use a stock photo or mockup.

Size:     1200×800 px (the right panel of the demo)
Where:    public/images/demo/asheville-roasters.png
Used on:  Cinematic demo (the site being built in demo)
```

### 2B. Portfolio site — light editorial theme

```
What:     A beautiful portfolio hero section.
          Light cream background (#faf7f0).
          Cormorant Garamond headline.
          "Maren Studio" or similar name.
          "Work that moves people to act."
          Three colored gallery cards below.

How:      BUILD THIS IN HEY BRADLEY.
          Use the Portfolio template from P122.
          Screenshot the full preview panel.

Size:     1200×800 px
Where:    public/images/demo/portfolio-light.png
Used on:  Cinematic demo (the theme change transition)
```

---

## Category 3 — Blog Post Hero Images

*10 posts need images. Use Unsplash for now. Real photography later.*

- **Unsplash license:** Free for commercial use, no attribution required.
- **Fetch from:** `unsplash.com/s/photos/[keyword]`
- **Target size:** 1200×630 px (16:9, also correct for OG image).
- **Treatment:** After download, apply CSS Ken Burns on hover. No filters needed.

### Blog image list

| Post | Unsplash keyword | Mood |
|---|---|---|
| The Telephone Game Is Over | `conversation miscommunication` or `telephone vintage` | Editorial, slightly abstract |
| AISP: Near-Zero Ambiguity | `mathematics chalkboard` or `formula abstract` | Dark, technical |
| Building with AI Agent Swarms | `data center dark` or `server lights` | Dark, blue-tinted |
| Spec-First Development | `blueprint architecture` or `technical drawing` | Clean, precise |
| The Handoff Problem | `handshake business` or `document signing` | Professional |
| Voice as Interface | `microphone studio` or `recording dark` | Dark, intimate |
| Open Core Philosophy | `open source code` or `developer laptop dark` | Dark, warm |
| From Idea to Production | `startup whiteboard` or `planning meeting` | Bright, energetic |
| AISP and Claude Code | `coding dark monitor` or `terminal screen` | Dark, focused |
| Harvard Capstone Research | `university library` or `academic research` | Editorial, warm |

**Unsplash photographers to follow for consistent style:**
Luca Bravo (tech/dark) · Markus Spiske (code/terminal) · Olia Gozha (workspace/dark)

**After downloading:** Rename to `[post-slug]-hero.jpg` and place in `public/images/blog/`.

---

## Category 4 — Open Graph / Social Images

*These appear when the URL is shared on LinkedIn, Twitter, Slack, iMessage.*

### 4A. Main OG image

```
What:     Dark background, Harvard crimson glow.
          "Hey Bradley" in Cormorant Garamond large.
          "Describe it. See it." italic below.
          bar181/hey-bradley-core in DM Mono small.

Size:     1200×630 px (mandatory for OG)
Format:   PNG
Where:    public/og-image.png
Used on:  <meta property="og:image"> in index.html

How:      Export the hero section of the capstone deck
          (bradley-capstone-v8.html slide 1) as PNG.
          It's already at the right quality level.
          Or screenshot the landing page hero at 1200 px
          width and crop to 630 px height.
```

### 4B. Per-page OG images (optional, do later)

```
/docs    → "Describe it. See it." + "The guide"
/about   → Bradley headshot + "Harvard ALM 2026"
/aisp    → Crystal Atom symbols Ω Σ Γ Λ Ε on dark
```

---

## Category 5 — Profile / About Page

*Already partially done. Verify these exist and are correct.*

### 5A. Bradley headshot

```
File:    public/images/bradley-headshot.jpeg   (exists, renamed in P121)
Check:   No spaces in filename ✓
Size:    Should be at least 400×400 px
Crop:    Square crop, face centred
Used on: /about, /capstone, blog author avatar
```

### 5B. Avatar (brad_pixar.png)

```
File:    public/images/brad_pixar.png   (exists)
Used on: Hero section (small avatar), /about
Size:    Should be at least 200×200 px
```

---

## Category 6 — Default Builder Template Images

*The analytics stock photo must be removed. Replace with these.*

### 6A. Remove immediately

```
Current: Random analytics dashboard stock photo
         (Median/LUX screenshot from some other product)
Action:  DELETE from public/images/ and from template config
Replace: One of the following
```

### 6B. Gradient hero placeholder (no photo)

```
What:    A dark-to-crimson CSS gradient used as the
         hero image in the default template.
         NOT a real photograph.
         The text "Describe it. See it." is already
         on top — no image needed.

How:     In the template config, set heroImage to null.
         The template CSS handles the gradient background.
         No external image file needed.
```

### 6C. Template-specific placeholder images

*For the Kitchen Sink and Portfolio templates that show gallery cards:*

```
Portfolio gallery — 3 cards:
  Card 1: Linear gradient #d4a853 → #8b4513   (amber/brown, "Branding")
  Card 2: Linear gradient #2c5f8a → #1a3a5c   (blue, "Editorial")
  Card 3: Linear gradient #6b4c8a → #3d1f5c   (purple, "Campaign")

These are pure CSS. No image files needed.
Already implemented in CinematicDemo.tsx from P122.
Reuse the same CSS for the Portfolio template gallery.
```

---

## Summary — what to do right now

```
TODAY (blocks the URL being shareable):
  [ ] Screenshot 1A — builder default template (15 min)
  [ ] Screenshot 1B — listen mode orb (5 min)
  [ ] Delete the analytics stock photo from builder template
  [ ] 4A OG image — export from capstone v8 slide 1 (10 min)

THIS WEEK (before Show HN):
  [ ] Screenshot 1C — AISP Crystal Atom view
  [ ] Screenshot 1D — builder in progress
  [ ] Build 2A (Asheville Roasters in Hey Bradley)
  [ ] Download blog images from Unsplash (10 posts)

LATER (post-launch):
  [ ] 2B Portfolio demo site
  [ ] Per-page OG images
  [ ] Real photography (replaces Unsplash)
```

---

## What NOT to create

```
✗ AI-generated photographs       — detectable, untrustworthy
✗ Stock photos of people at computers — generic
✗ Abstract "tech" imagery (hexagons, circuits) — dated
✗ Screenshots of other products  — legal risk
✗ The analytics dashboard        — wrong product, wrong message
✗ Anything with text baked in    — localization / update hell
```

---

## File-naming convention

```
public/images/
  product/        ← screenshots of Hey Bradley itself
  demo/           ← sites built inside the cinematic demo
  blog/           ← blog post hero images
  [name]-hero.jpg ← blog heroes: post-slug-hero.jpg
  og-image.png    ← main social share image
  bradley-headshot.jpeg
  brad_pixar.png
```

---

*This document closes the four asset-acquisition carry-forwards from
P125 retrospective §5 (CF-P125-W8-photography, CF-P125-imagery-hero,
CF-P125-cinematic-screenshots). Owner-actionable when assets are
sourced; no swarm work pending until then.*

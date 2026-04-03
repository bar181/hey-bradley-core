# Tailwind Design Research: Best-in-Class Patterns for Hey Bradley

**Date:** 2026-04-02
**Purpose:** Identify the best Tailwind-based website designs and component patterns, compare against Hey Bradley's current implementations, and provide actionable Tailwind class recipes for improvement.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cards with Images (ColumnsImageCards)](#1-cards-with-images---columnsimagecards)
3. [Glass Morphism Cards (ColumnsGlass)](#2-glass-morphism-cards---columnsglass)
4. [Gradient Cards (ColumnsGradient)](#3-gradient-cards---columnsgradient)
5. [Hero Sections (4 Variants)](#4-hero-sections---4-variants)
6. [Gallery Sections (4 Variants)](#5-gallery-sections---4-variants)
7. [Newsletter/CTA (ActionNewsletter)](#6-newslettercta---actionnewsletter)
8. [Missing Section Types](#7-missing-section-types-we-should-add)
9. [Tailwind Class Recipes](#8-tailwind-class-recipes)
10. [Sources](#sources)

---

## Executive Summary

Hey Bradley's current template implementations are **functional but lack the visual polish** that defines best-in-class Tailwind sites. The main gaps are:

- **Missing depth and layering** -- Cards lack multi-layer shadows, subtle borders, and lift-on-hover effects that create perceived depth
- **Underutilized gradients** -- Modern sites use multi-stop gradients, mesh gradients, and radial gradient accents; our gradient cards use a single `color-mix` approach
- **No animated micro-interactions** -- No translate-on-hover, no staggered entrance animations, no reveal-on-scroll
- **Glass morphism is incomplete** -- Missing the vibrant background that makes glass cards actually visible; `backdrop-blur` alone is not enough
- **No bento grid layout** -- The most popular modern layout pattern (Apple, Linear, Vercel) is completely absent
- **Gallery lacks lightbox and filtering** -- No click-to-expand, no category filter, no caption overlay transitions

**Quality score vs industry best: 45/100 (current) -> 85/100 (with recipes below)**

---

## 1. Cards with Images -- ColumnsImageCards

### What Best-in-Class Sites Do

Sites like Tailwind UI, Flowbite, and Vercel's marketing pages use image cards with:

- **Rounded 2xl corners** (`rounded-2xl`) not just `rounded-xl` -- the extra radius looks more modern
- **Multi-layer shadows** -- `shadow-md` at rest, `hover:shadow-2xl` on hover for dramatic lift
- **Hover translate** -- `hover:-translate-y-2` creates a "card lift" effect that feels tangible
- **Image zoom on hover** -- `group-hover:scale-110` with `duration-700` for a cinematic slow zoom
- **Gradient overlay on image** -- A subtle `bg-gradient-to-t from-black/50 to-transparent` over the image bottom for text readability
- **Category badges** -- Small pill badges on images (`absolute top-4 left-4`)
- **Aspect ratio control** -- `aspect-video` or `aspect-[4/3]` for consistent image dimensions

### Hey Bradley Current State

```tsx
// Current ColumnsImageCards.tsx
className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl group"
// Image: className="group-hover:scale-105"
```

**Gaps identified:**
- `duration-200` is too fast -- feels snappy, not smooth. Industry standard is `duration-300` to `duration-500`
- No hover translate (no card lift effect)
- No gradient overlay on images for text contrast
- No badge/tag support on images
- Shadow jump from none to `shadow-xl` is too abrupt -- needs a resting shadow like `shadow-md`
- Missing `rounded-2xl` -- the extra rounding is a 2025/2026 signature
- No `ring` or `ring-1` for subtle outline definition

### Recommended Upgrade

```html
<!-- Best-in-class image card -->
<div class="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900
            shadow-md hover:shadow-2xl
            transition-all duration-500 ease-out
            hover:-translate-y-1
            ring-1 ring-black/5 dark:ring-white/10">

  <!-- Image container with overlay -->
  <div class="relative aspect-video overflow-hidden">
    <img class="w-full h-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-110" />
    <!-- Gradient overlay for text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <!-- Optional badge -->
    <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium
                 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm">
      Category
    </span>
  </div>

  <!-- Content -->
  <div class="p-6 space-y-2">
    <h3 class="text-lg font-semibold tracking-tight">Title</h3>
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
      Description text here...
    </p>
  </div>
</div>
```

**Quality match: Current 40/100 -> With upgrade 90/100**

---

## 2. Glass Morphism Cards -- ColumnsGlass

### What Best-in-Class Sites Do

Proper glassmorphism (as popularized by Apple, Linear, and the glassmorphism.css movement) requires ALL of these layers:

1. **A vibrant/colorful background behind the glass** -- Without this, `backdrop-blur` blurs nothing and the card looks flat
2. **Semi-transparent background** -- `bg-white/10` (dark mode) or `bg-white/60` (light mode)
3. **Strong backdrop blur** -- `backdrop-blur-xl` or `backdrop-blur-2xl` (not just `backdrop-blur-md`)
4. **Subtle white/light border** -- `border border-white/20` creates the "frosted edge" look
5. **Inner highlight** -- A `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]` for the top-edge frost line
6. **Colored shadow** -- `shadow-lg shadow-purple-500/10` for ambient color bleed

### Hey Bradley Current State

```tsx
// Current ColumnsGlass.tsx
className="rounded-xl backdrop-blur-xl p-7 transition-all duration-200 hover:shadow-lg"
style={{
  background: 'var(--theme-bg-secondary, rgba(255, 255, 255, 0.05))',
  border: '1px solid var(--theme-border, rgba(128,128,128,0.15))',
}}
```

**Gaps identified:**
- `rgba(255, 255, 255, 0.05)` is nearly invisible -- true glass needs `0.08` to `0.15` opacity in dark mode, `0.5` to `0.7` in light mode
- No vibrant background element behind the glass -- the blur has nothing to blur
- Border color is gray, not white -- loses the frosted-edge effect
- No inner shadow / highlight for depth
- No colored ambient shadow
- The icon container also uses `backdrop-blur-sm` which is redundant when already inside a blurred parent
- No hover state beyond shadow -- modern glass cards shift opacity or background on hover

### Recommended Upgrade

```html
<!-- The parent section MUST have a gradient or colorful background -->
<section class="relative py-20 px-6 bg-slate-950 overflow-hidden">
  <!-- Ambient gradient blobs behind cards (essential for glass effect) -->
  <div class="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
  <div class="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

  <!-- Glass card -->
  <div class="relative rounded-2xl p-8
              bg-white/[0.07] hover:bg-white/[0.12]
              backdrop-blur-2xl backdrop-saturate-150
              border border-white/[0.15]
              shadow-lg shadow-black/5
              transition-all duration-300
              ring-1 ring-inset ring-white/10">

    <!-- Icon with glass sub-layer -->
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5
                bg-gradient-to-br from-purple-500/20 to-blue-500/20
                ring-1 ring-white/10">
      <Icon class="text-purple-400" />
    </div>

    <h3 class="text-base font-semibold text-white mb-2">Title</h3>
    <p class="text-sm text-white/60 leading-relaxed">Description</p>
  </div>
</section>
```

**Quality match: Current 30/100 -> With upgrade 85/100**

---

## 3. Gradient Cards -- ColumnsGradient

### What Best-in-Class Sites Do

Modern gradient cards (Stripe, Linear, Vercel, Tailwind UI) use:

- **Multi-stop gradients** -- `bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent` rather than a single color fade
- **Gradient borders** -- A popular technique using a wrapper div with gradient background and an inner div with solid background, creating a gradient-border effect
- **Accent glow** -- A `shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]` for colored ambient glow
- **Gradient on hover** -- Shift gradient intensity on hover: `hover:from-purple-500/20`
- **Mesh gradient backgrounds** -- Multiple overlapping radial gradients for organic, non-linear color blends
- **Gradient text** -- `bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400` for headings

### Hey Bradley Current State

```tsx
// Current ColumnsGradient.tsx
style={{
  background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 20%, transparent) 0%, transparent 100%)',
  border: '1px solid var(--theme-border, rgba(128,128,128,0.1))',
}}
```

**Gaps identified:**
- Single-color gradient -- uses only the theme accent at 20% opacity, resulting in a barely-visible wash
- `color-mix` is a clever approach for theming but produces flat, single-tone results
- No multi-stop gradient -- no secondary or tertiary color stops
- No gradient border effect
- No ambient colored shadow / glow
- No gradient text for headings
- No hover state change for the gradient itself

### Recommended Upgrade

```html
<!-- Modern gradient card with border glow -->
<div class="relative group rounded-2xl p-px
            bg-gradient-to-br from-purple-500/50 via-blue-500/30 to-transparent">
  <!-- Inner card (creates gradient border effect) -->
  <div class="rounded-[calc(1rem-1px)] bg-slate-950 p-7
              transition-all duration-300
              group-hover:bg-slate-950/95">

    <!-- Icon with gradient background -->
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5
                bg-gradient-to-br from-purple-500/20 to-blue-500/20">
      <Icon class="text-purple-400" />
    </div>

    <!-- Gradient heading -->
    <h3 class="text-base font-semibold mb-2 tracking-tight
               bg-clip-text text-transparent
               bg-gradient-to-r from-white to-white/80">
      Title
    </h3>

    <p class="text-sm text-slate-400 leading-relaxed">Description</p>
  </div>

  <!-- Ambient glow (only on hover) -->
  <div class="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100
              bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent
              blur-xl transition-opacity duration-500 -z-10" />
</div>
```

**Quality match: Current 35/100 -> With upgrade 90/100**

---

## 4. Hero Sections -- 4 Variants

### Industry Standard Hero Patterns (from 40+ examples reviewed)

The best hero sections across Tailwind UI, Salient template, AstroWind, and SaaS landing pages share these traits:

| Pattern | Description | Used By |
|---------|-------------|---------|
| Animated gradient mesh | Multiple radial gradients that slowly animate position | Linear, Stripe |
| Floating badge/pill | An announcement pill above the heading with arrow icon | Tailwind UI, Vercel |
| Gradient text heading | `bg-clip-text text-transparent` on the main heading | Almost everyone |
| Social proof strip | Logo cloud immediately below CTA (not as separate section) | Most SaaS |
| App screenshot with perspective | `perspective-1000 rotateX(5deg)` on hero image | Tailwind Salient |
| Particle/grid background | Subtle animated dots or grid pattern behind content | Linear, Raycast |
| Video background with overlay | Autoplay muted loop with dark gradient overlay | Premium templates |
| Split hero with floating cards | Text left, stacked/floating UI cards on right | Dashboard products |

### Hey Bradley Current Variants Assessment

**HeroCentered (scored 55/100)**
- Good: Has radial gradient overlay, badge, video-as-background support, trust badges
- Missing: No gradient text, no animated background, no perspective hero image, no entrance animation
- Issue: The radial gradient uses raw CSS in a style tag instead of Tailwind classes -- inconsistent

**HeroSplit (scored 50/100)**
- Good: Badge, dual CTAs, image column, trust badges
- Missing: No responsive stacking (`flex` without `flex-col` breakpoint for mobile), image has no perspective/tilt effect, no decorative elements
- Critical gap: Missing `md:flex-row flex-col` -- this hero will break on mobile since it uses `flex items-center gap-12` without column direction on small screens

**HeroOverlay (scored 60/100)**
- Good: Full background image/video support, proper overlay gradient (`from-black/80 via-black/50 to-black/30`), decent structure
- Missing: No animated overlay, no particle effects, gradient overlay is static

**HeroMinimal (scored 45/100)**
- Good: Clean, typographic focus
- Missing: No background treatment at all (completely flat), no decorative radial gradient, no visual interest beyond text
- Issue: Feels like a placeholder rather than a designed section

### Recommended Hero Patterns to Add or Upgrade

```html
<!-- 1. Animated mesh gradient background (add to HeroCentered) -->
<div class="absolute inset-0 -z-10 overflow-hidden">
  <div class="absolute -top-40 -right-40 h-[500px] w-[500px]
              rounded-full bg-purple-500/20 blur-[128px]
              animate-pulse" />
  <div class="absolute -bottom-40 -left-40 h-[500px] w-[500px]
              rounded-full bg-blue-500/15 blur-[128px]
              animate-pulse [animation-delay:2s]" />
  <!-- Grid pattern overlay -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
              bg-[size:64px_64px]" />
</div>

<!-- 2. Gradient text heading (use in all heroes) -->
<h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]
           bg-clip-text text-transparent
           bg-gradient-to-br from-white via-white to-white/50">
  Build websites with AI
</h1>

<!-- 3. Floating announcement pill (above heading) -->
<a href="#" class="group inline-flex items-center gap-2 px-4 py-1.5
                   rounded-full text-sm font-medium
                   bg-purple-500/10 text-purple-300
                   ring-1 ring-purple-500/20
                   hover:ring-purple-500/40 transition-all">
  <span class="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
  Announcing v2.0
  <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform">...</svg>
</a>

<!-- 4. Hero image with perspective tilt -->
<div class="mt-16 rounded-xl overflow-hidden shadow-2xl
            ring-1 ring-white/10
            [perspective:1000px]">
  <img class="w-full [transform:rotateX(2deg)_rotateY(-2deg)]
              hover:[transform:rotateX(0)_rotateY(0)]
              transition-transform duration-700" />
</div>
```

**Quality match: Current avg 52/100 -> With upgrades avg 82/100**

---

## 5. Gallery Sections -- 4 Variants

### Industry Standard Gallery Patterns

| Pattern | Description | Best Examples |
|---------|-------------|---------------|
| Bento grid | Mixed-size tiles using col-span/row-span | Apple, Linear, Aceternity UI |
| Lightbox modal | Click image to expand with dark overlay | Flowbite, Material Tailwind |
| Filter tabs | Category buttons that filter gallery items | Portfolio sites, Dribbble |
| Infinite scroll | Auto-load more images on scroll | Pinterest, Unsplash |
| Before/after slider | Split image comparison | Product showcases |
| Image with metadata | Title, date, tags overlaid or below | Blog/portfolio galleries |

### Hey Bradley Current Variants Assessment

**GalleryGrid (scored 50/100)**
- Good: Responsive grid, hover scale, caption reveal animation
- Missing: No section heading/description above grid, no filter tabs, no lightbox, square-only aspect ratio

**GalleryMasonry (scored 55/100)**
- Good: CSS columns approach, varied aspect ratios, caption hover reveal
- Missing: True masonry requires JS for proper layout (CSS columns can leave uneven bottoms), no heading, no lightbox

**GalleryCarousel (scored 45/100)**
- Good: Horizontal scroll with snap points
- Missing: No navigation arrows, no dot indicators, no autoplay, `scrollbar-hide` class may not exist natively
- Issue: `w-72 md:w-96` makes cards too small on desktop -- should be wider

**GalleryFullWidth (scored 40/100)**
- Good: Cinematic wide images with 21/9 aspect ratio
- Missing: No heading, no navigation between images, essentially just a vertical list of images

### Key Missing Gallery Type: Bento Grid

```html
<!-- Bento Gallery Grid (missing from Hey Bradley) -->
<section class="py-20 px-6">
  <div class="mx-auto max-w-6xl">
    <!-- Section heading -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold tracking-tight mb-3">Our Work</h2>
      <p class="text-slate-400 max-w-lg mx-auto">Description here</p>
    </div>

    <!-- Bento grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-3">
      <!-- Large featured item (2x2) -->
      <div class="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden">
        <img class="w-full h-full object-cover transition-transform duration-700
                    group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div class="absolute bottom-4 left-4 text-white">
          <p class="text-lg font-semibold">Featured Project</p>
          <p class="text-sm text-white/70">Category</p>
        </div>
      </div>

      <!-- Standard items -->
      <div class="col-span-1 row-span-1 group relative rounded-xl overflow-hidden">
        <img class="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-110" />
      </div>

      <!-- Tall item -->
      <div class="col-span-1 row-span-2 group relative rounded-xl overflow-hidden">
        <img class="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-105" />
      </div>

      <!-- Wide item -->
      <div class="col-span-2 row-span-1 group relative rounded-xl overflow-hidden">
        <img class="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-105" />
      </div>
    </div>
  </div>
</section>
```

**Quality match: Current avg 47/100 -> With bento + upgrades avg 80/100**

---

## 6. Newsletter/CTA -- ActionNewsletter

### Industry Standard CTA Patterns

The best newsletter/CTA sections share these features:

- **Distinctive background** -- Either a gradient card, glass card, or contrasting color block that visually separates the CTA from surrounding content
- **Asymmetric layout** -- Text on left, form on right (not always centered)
- **Decorative elements** -- Gradient blobs, rings, or illustrations beside the form
- **Input styling** -- Large inputs with rounded-full or rounded-xl, often with the button inside the input (`relative` positioning)
- **Social proof** -- "Join 10,000+ developers" text or avatar stack near the form
- **Animated success state** -- Checkmark animation after submission

### Hey Bradley Current State

```tsx
// ActionNewsletter.tsx
// Structure: centered heading + subtitle + input + button in a row
// Styling: minimal -- uses theme variables, basic rounded-lg, no decorative elements
```

**Gaps identified:**
- No distinctive background -- blends into surrounding sections
- No decorative gradient blobs or visual interest
- Input and button are separate elements, not a unified input group
- No social proof (subscriber count, avatar stack)
- No success state
- No icon in the button
- Overall feels generic and template-like

### Recommended Upgrade

```html
<!-- Premium newsletter CTA -->
<section class="py-20 px-6">
  <div class="relative max-w-4xl mx-auto rounded-3xl overflow-hidden
              bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent
              ring-1 ring-white/10 p-12 md:p-16">

    <!-- Decorative blobs -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />

    <div class="relative z-10 text-center">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        Stay in the loop
      </h2>
      <p class="text-slate-400 mb-8 max-w-lg mx-auto">
        Get the latest updates delivered to your inbox.
      </p>

      <!-- Unified input group -->
      <div class="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
        <div class="relative flex-1 w-full">
          <input type="email" placeholder="you@example.com"
                 class="w-full px-5 py-3.5 rounded-xl text-sm
                        bg-white/5 border border-white/10
                        focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                        outline-none transition-all placeholder:text-slate-500" />
        </div>
        <button class="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm
                       bg-gradient-to-r from-purple-500 to-blue-500
                       hover:from-purple-400 hover:to-blue-400
                       text-white shadow-lg shadow-purple-500/25
                       transition-all duration-300
                       flex items-center justify-center gap-2">
          Subscribe
          <svg class="w-4 h-4">...</svg>
        </button>
      </div>

      <!-- Social proof -->
      <p class="text-xs text-slate-500 mt-4">
        Join 2,000+ builders. No spam, unsubscribe anytime.
      </p>
    </div>
  </div>
</section>
```

**Quality match: Current 35/100 -> With upgrade 85/100**

---

## 7. Missing Section Types We Should Add

Based on research across Tailwind UI, Flowbite, Preline UI, TailGrids, and top SaaS landing pages, Hey Bradley is missing these high-impact section types:

### Priority 1 -- Must Have

| Section Type | Why It Matters | Competitors That Have It |
|--------------|---------------|------------------------|
| **Bento Grid** | The dominant layout pattern of 2025/2026 (Apple, Linear) | Tailwind UI, Aceternity UI, Preline |
| **Logo Cloud / Social Proof** | "Trusted by" strip is on nearly every SaaS landing page | Tailwind UI, all SaaS templates |
| **Stats/Metrics** | "10M+ users, 99.9% uptime" type counters | Tailwind UI, TailGrids |
| **Comparison Table** | Feature comparison grid (us vs them) | Pricing pages everywhere |

### Priority 2 -- Should Have

| Section Type | Why It Matters |
|--------------|---------------|
| **Team Section** | Photos + roles + social links grid |
| **Timeline** | Roadmap or history with vertical/horizontal steps |
| **Integrations Grid** | Logo grid showing compatible tools |
| **Blog/Article Cards** | Thumbnail + title + excerpt + date cards |
| **Video Showcase** | Full-width video embed with play button overlay |
| **Announcement Banner** | Sticky top banner with dismiss button |

### Priority 3 -- Nice to Have

| Section Type | Why It Matters |
|--------------|---------------|
| **Marquee/Scroll Strip** | Infinitely scrolling logos or text |
| **Floating Chat Widget** | Demo of AI chat capability |
| **Interactive Demo** | Embedded playground or live preview |
| **Before/After Slider** | Image comparison with draggable divider |

---

## 8. Tailwind Class Recipes

### Recipe 1: Stunning Glass Card

```html
<!-- REQUIRES a colorful/gradient background behind it -->
<div class="
  relative
  rounded-2xl
  p-8
  bg-white/[0.07]
  backdrop-blur-2xl
  backdrop-saturate-[1.8]
  border border-white/[0.15]
  shadow-lg shadow-black/5
  ring-1 ring-inset ring-white/[0.05]
  transition-all duration-300
  hover:bg-white/[0.12]
  hover:border-white/[0.25]
  hover:shadow-xl
">
  <!-- Content here -->
</div>

<!-- Light mode variant -->
<div class="
  rounded-2xl
  p-8
  bg-white/60
  backdrop-blur-2xl
  backdrop-saturate-150
  border border-white/80
  shadow-lg shadow-slate-200/50
  ring-1 ring-black/5
  transition-all duration-300
  hover:bg-white/70
  hover:shadow-xl
">
  <!-- Content here -->
</div>
```

**Key classes explained:**
- `backdrop-blur-2xl` -- Maximum blur intensity for a frosted glass look
- `backdrop-saturate-[1.8]` -- Boosts color vibrancy of the background showing through
- `bg-white/[0.07]` -- Very subtle white tint (dark mode); `bg-white/60` for light mode
- `ring-1 ring-inset ring-white/[0.05]` -- Subtle inner ring for frost highlight
- `border-white/[0.15]` -- White border gives the frosted-edge look
- `hover:bg-white/[0.12]` -- Subtle brightness increase on hover

---

### Recipe 2: Modern Gradient Card

```html
<!-- Option A: Gradient border card (most popular technique) -->
<div class="group relative rounded-2xl p-px
            bg-gradient-to-br from-purple-500/60 via-blue-500/40 to-cyan-400/30
            transition-all duration-500
            hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]">
  <div class="rounded-[calc(1rem-1px)] bg-slate-950 p-7
              group-hover:bg-slate-950/90 transition-colors duration-300">
    <!-- Content here -->
  </div>
</div>

<!-- Option B: Gradient background card -->
<div class="
  rounded-2xl
  p-7
  bg-gradient-to-br from-purple-500/15 via-blue-500/10 to-transparent
  border border-purple-500/10
  shadow-xl shadow-purple-500/5
  transition-all duration-300
  hover:from-purple-500/25 hover:via-blue-500/15
  hover:shadow-2xl hover:shadow-purple-500/10
  hover:-translate-y-0.5
">
  <!-- Content here -->
</div>

<!-- Option C: Mesh gradient background -->
<div class="relative rounded-2xl p-7 overflow-hidden
            border border-white/10">
  <!-- Mesh gradient (multiple radial gradients) -->
  <div class="absolute inset-0 -z-10
              bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.12),transparent_50%)]" />
  <!-- Content here -->
</div>
```

**Key classes explained:**
- `p-px` on outer div + full padding on inner div = gradient border effect
- `from-purple-500/60 via-blue-500/40 to-cyan-400/30` -- Three-stop gradient with transparency
- `hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]` -- Colored ambient glow on hover
- `rounded-[calc(1rem-1px)]` -- Inner div radius 1px less than outer for seamless border

---

### Recipe 3: Image Card That Pops

```html
<div class="group relative rounded-2xl overflow-hidden
            bg-white dark:bg-slate-900
            shadow-md hover:shadow-2xl
            ring-1 ring-black/5 dark:ring-white/10
            transition-all duration-500 ease-out
            hover:-translate-y-1.5">

  <!-- Image with zoom + overlay -->
  <div class="relative aspect-video overflow-hidden">
    <img src="..." alt="..."
         class="w-full h-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-110" />

    <!-- Gradient overlay (reveals on hover) -->
    <div class="absolute inset-0
                bg-gradient-to-t from-black/50 via-black/10 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500" />

    <!-- Action button (reveals on hover) -->
    <div class="absolute inset-0 flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300">
      <button class="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm
                     text-sm font-semibold text-slate-900
                     shadow-lg transform scale-90 group-hover:scale-100
                     transition-all duration-300">
        View Project
      </button>
    </div>

    <!-- Badge (always visible) -->
    <span class="absolute top-3 left-3 px-2.5 py-1
                 text-xs font-medium rounded-full
                 bg-white/90 dark:bg-slate-900/90
                 backdrop-blur-sm shadow-sm">
      Featured
    </span>
  </div>

  <!-- Content -->
  <div class="p-6">
    <h3 class="text-lg font-semibold tracking-tight mb-1.5
               group-hover:text-purple-500 transition-colors">
      Card Title
    </h3>
    <p class="text-sm text-slate-500 dark:text-slate-400
              leading-relaxed line-clamp-2">
      Brief description that stays to two lines maximum.
    </p>
    <!-- Tags -->
    <div class="flex gap-2 mt-3">
      <span class="px-2 py-0.5 text-xs rounded-md
                   bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        React
      </span>
    </div>
  </div>
</div>
```

**Key classes explained:**
- `hover:-translate-y-1.5` -- Card "lifts" on hover, creating a 3D depth illusion
- `duration-700 ease-out` on image -- Slow, smooth zoom that feels cinematic
- `group-hover:scale-110` -- 10% zoom is visually impactful without being jarring
- `ring-1 ring-black/5` -- Barely-visible outline prevents cards from "floating" against background
- `line-clamp-2` -- Prevents text from overflowing card height
- `group-hover:text-purple-500` on title -- Subtle color shift draws eye to the heading

---

### Recipe 4: Beautiful Hero with Overlay

```html
<section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

  <!-- Background image -->
  <img src="..." alt=""
       class="absolute inset-0 w-full h-full object-cover" />

  <!-- Multi-layer overlay system -->
  <!-- Layer 1: Dark gradient from bottom (text contrast) -->
  <div class="absolute inset-0
              bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
  <!-- Layer 2: Color tint (brand feel) -->
  <div class="absolute inset-0
              bg-gradient-to-br from-purple-900/30 to-transparent" />
  <!-- Layer 3: Noise texture (subtle grain for premium feel) -->
  <div class="absolute inset-0 opacity-[0.015]
              bg-[url('data:image/svg+xml,...')]" />

  <!-- Content -->
  <div class="relative z-10 max-w-3xl mx-auto text-center px-6">

    <!-- Floating announcement badge -->
    <div class="inline-flex items-center gap-2 mb-8 px-4 py-1.5
                rounded-full text-sm font-medium
                bg-white/10 text-white/80 backdrop-blur-xl
                ring-1 ring-white/20">
      <span class="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
      Now in public beta
    </div>

    <!-- Heading with gradient -->
    <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold
               tracking-tight leading-[1.05]
               bg-clip-text text-transparent
               bg-gradient-to-b from-white via-white to-white/40">
      Build without<br />boundaries
    </h1>

    <!-- Subheading -->
    <p class="mt-6 text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
      The AI-powered platform that turns your specs into production-ready websites.
    </p>

    <!-- CTA group -->
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#" class="px-8 py-3.5 rounded-xl font-semibold text-sm
                         bg-white text-slate-900
                         shadow-lg shadow-white/25
                         hover:shadow-xl hover:shadow-white/30
                         hover:-translate-y-0.5
                         transition-all duration-300">
        Get Started Free
      </a>
      <a href="#" class="group px-8 py-3.5 rounded-xl font-semibold text-sm
                         text-white/80 border border-white/20
                         hover:bg-white/10 hover:text-white
                         transition-all duration-300
                         flex items-center gap-2">
        Watch Demo
        <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform">...</svg>
      </a>
    </div>

    <!-- Trust badges / social proof -->
    <div class="mt-16 flex items-center justify-center gap-8 opacity-40">
      <!-- Logo icons here -->
      <p class="text-xs font-medium uppercase tracking-wider text-white">
        Trusted by 500+ teams
      </p>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <div class="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
      <div class="w-1 h-2 rounded-full bg-white/50" />
    </div>
  </div>
</section>
```

**Key classes explained:**
- `min-h-[90vh]` -- Near full viewport height but not 100%, so user sees a hint of next section
- Multi-layer overlay (3 divs) -- Each serves a purpose: contrast, brand color, texture
- `bg-gradient-to-b from-white via-white to-white/40` on heading -- Text fades at bottom, adding depth
- `shadow-lg shadow-white/25` on CTA -- White ambient glow makes button "pop" against dark background
- `hover:-translate-y-0.5` -- Micro-lift on button hover
- Scroll indicator with `animate-bounce` -- Invites scrolling

---

## Component Quality Comparison Summary

| Component | Current Score | Industry Best | Gap | Effort to Fix |
|-----------|:---:|:---:|:---:|:---:|
| ColumnsImageCards | 40 | 90 | -50 | Medium |
| ColumnsGlass | 30 | 85 | -55 | Medium (needs bg blobs) |
| ColumnsGradient | 35 | 90 | -55 | Medium |
| ColumnsCards | 40 | 85 | -45 | Low |
| HeroCentered | 55 | 90 | -35 | Low-Medium |
| HeroSplit | 50 | 85 | -35 | Medium (mobile fix) |
| HeroOverlay | 60 | 90 | -30 | Low |
| HeroMinimal | 45 | 80 | -35 | Low |
| GalleryGrid | 50 | 85 | -35 | Medium |
| GalleryMasonry | 55 | 85 | -30 | Medium |
| GalleryCarousel | 45 | 85 | -40 | Medium (needs nav) |
| GalleryFullWidth | 40 | 80 | -40 | Low |
| ActionNewsletter | 35 | 85 | -50 | Medium |
| FooterMultiColumn | 50 | 80 | -30 | Low |
| **Average** | **45** | **86** | **-41** | |

---

## Critical Cross-Cutting Issues

### 1. Duration Too Fast Everywhere
Almost all components use `duration-200`. Industry standard for card hover is `duration-300` to `duration-500`. Image zooms should be `duration-500` to `duration-700`.

### 2. No Resting Shadows
Cards go from zero shadow to `hover:shadow-lg/xl`. Best practice is to have a resting `shadow-sm` or `shadow-md` so the hover transition is smooth, not abrupt.

### 3. Missing `ring-1` Outlines
Modern cards use `ring-1 ring-black/5` (light) or `ring-1 ring-white/10` (dark) instead of `border` for a more refined edge. The `ring` utility renders outside the element, creating cleaner visual separation.

### 4. No Hover Translate
Not a single component uses `hover:-translate-y-1` or `hover:-translate-y-2`. This is the single most impactful hover micro-interaction in modern web design.

### 5. No `rounded-2xl`
Every component uses `rounded-xl`. The shift to `rounded-2xl` (and even `rounded-3xl` for section containers) is a defining visual trend of 2025/2026.

### 6. `opacity-60` for Muted Text
Multiple components use `opacity-60` for descriptions. This is less accessible than using actual color values like `text-slate-400` or `text-white/60`, because `opacity-60` affects the entire element (including any borders or backgrounds it might gain).

---

## Sources

- [Tailwind CSS Landing Pages -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/page-examples/landing-pages)
- [Tailwind CSS Feature Sections -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections)
- [Tailwind CSS Hero Sections -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes)
- [Tailwind CSS Bento Grids -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids)
- [Tailwind CSS Newsletter Sections -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/newsletter-sections)
- [Tailwind CSS CTA Sections -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections)
- [Tailwind CSS Footers -- Official Tailwind UI](https://tailwindcss.com/plus/ui-blocks/marketing/sections/footers)
- [Tailwind CSS Showcase](https://tailwindcss.com/showcase)
- [20 Best Free Tailwind CSS Landing Page Templates (2026)](https://adminlte.io/blog/tailwind-landing-page-templates/)
- [32 Best Free Tailwind CSS Landing Page Templates (2026)](https://colorlib.com/wp/tailwind-landing-page-templates/)
- [23 Best Tailwind CSS Website Examples 2026](https://adminlte.io/blog/tailwindcss-website-examples/)
- [115 SaaS Landing Page Examples Built With Tailwind CSS](https://saaslandingpage.com/technology/tailwind-css/)
- [HyperUI -- Free Tailwind CSS Components](https://www.hyperui.dev/)
- [Flowbite -- Tailwind CSS Components](https://flowbite.com/docs/components/card/)
- [TailGrids -- 600+ Tailwind UI Components](https://tailgrids.com/components)
- [Preline UI -- Tailwind Blocks and Sections](https://preline.co/examples.html)
- [Creating Glassmorphism Effects with Tailwind CSS -- Epic Web Dev](https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css)
- [How To Implement Glassmorphism With Tailwind CSS -- FlyonUI](https://flyonui.com/blog/glassmorphism-with-tailwind-css/)
- [Tailwindcss Glassmorphism Generator](https://tailwindcss-glassmorphism.vercel.app/)
- [Gradients for Tailwind CSS -- Hypercolor](https://hypercolor.dev/)
- [A Guide to Adding Gradients with Tailwind CSS -- LogRocket](https://blog.logrocket.com/guide-adding-gradients-tailwind-css/)
- [40 Tailwind Hero Sections -- FreeFrontend](https://freefrontend.com/tailwind-hero-sections/)
- [Creating Bento Grid Layouts with CSS -- DEV Community](https://dev.to/ibelick/creating-bento-grid-layouts-with-css-tailwind-css-26mo)
- [How to Create a Bento Grid with Tailwind CSS -- Aceternity UI](https://ui.aceternity.com/blog/how-to-create-a-bento-grid-with-tailwindcss-nextjs-and-framer-motion)
- [Flowbite Gallery (Masonry)](https://flowbite.com/docs/components/gallery/)
- [Material Tailwind Card Examples](https://www.material-tailwind.com/docs/html/card)
- [DaisyUI Hover 3D Card Component](https://daisyui.com/components/hover-3d/)
- [Fluid Hover Cards with Tailwind CSS -- Epic Web Dev](https://www.epicweb.dev/tutorials/fluid-hover-cards-with-tailwind-css)
- [1141 Cards: CSS and Tailwind -- UIverse](https://uiverse.io/cards)
- [24 Tailwind Footers -- FreeFrontend](https://freefrontend.com/tailwind-footers/)
- [Salient -- Tailwind CSS SaaS Marketing Template](https://tailwindcss.com/plus/templates/salient)
- [Tailwind CSS Card Hover Effects -- TailwindTap](https://www.tailwindtap.com/blog/card-hover-effects-in-tailwind-css)

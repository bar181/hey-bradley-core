# Theme Design Research: Hero Section Analysis & Visual Assets

> Research date: 2026-03-28
> Purpose: Reference document for building 10 screenshottable hero themes that match the bar set by best-in-class SaaS sites.

---

## Table of Contents

1. [Reference Site Analysis](#1-reference-site-analysis)
2. [Theme-to-Site Mapping](#2-theme-to-site-mapping)
3. [Selected Image & Video URLs](#3-selected-image--video-urls)
4. [CSS Techniques Reference](#4-css-techniques-reference)
5. [Typography Reference](#5-typography-reference)
6. [Key Takeaways](#6-key-takeaways)

---

## 1. Reference Site Analysis

### 1.1 Stripe

**The ONE thing you remember:** The living, breathing mesh gradient that feels like colored light trapped under glass. It shifts and pulses with WebGL animation, making the entire page feel alive without a single stock photo.

**Color Palette:**
- Primary gradient: `#5E46BF` (purple) to `#1CA8FF` (blue)
- Extended mesh colors: `#80ECFF` (cyan), `#F46036` (orange-red), `#FFC857` (gold), `#E84855` (red), `#A06CD5` (violet)
- Background: `#0A2540` (dark navy)
- Text: `#FFFFFF` (white on dark), `#425466` (gray on light)

**Typography:**
- Font: Custom "Stripe" font (similar to Inter/Camphor), system fallback to `-apple-system, BlinkMacSystemFont, sans-serif`
- Headline: 52-64px, font-weight 700
- Subhead: 20-24px, font-weight 400, line-height 1.5

**Layout Pattern:** Centered headline with full-bleed animated gradient background. Product UI cards float below the fold as social proof.

**Key Visual Technique:** WebGL mesh gradient using `minigl` library. Multiple color stops animate their positions over time, creating a fluid, shifting aurora effect. The gradient is tilted ~15deg for dynamism.

**Mood:** Sophisticated confidence. "We are the infrastructure layer of the internet, and we look like it."

**What makes it screenshottable:** The gradient is unique to Stripe -- no one else has exactly this effect. It is identifiable from a thumbnail.

---

### 1.2 Linear

**The ONE thing you remember:** The extreme restraint. A near-monochrome dark interface with one subtle gradient purple sphere, and text so crisp it looks laser-etched. The page itself feels like the product.

**Color Palette:**
- Background: `#000000` to `#111111` (pure black to near-black)
- Text primary: `#EEEEEE` (off-white)
- Text secondary: `#8A8F98` (warm gray)
- Accent: `#5E6AD2` (muted indigo/violet)
- Subtle borders: `rgba(255,255,255,0.08)`

**Typography:**
- Font: Inter Display (headings), Inter (body)
- Headline: 56-72px, font-weight 600, letter-spacing -0.04em (tight tracking)
- Body: 16-18px, font-weight 400

**Layout Pattern:** Centered single-column. Massive headline, one-line subhead, single CTA. Below fold: product screenshot with subtle glow.

**Key Visual Technique:** Extreme negative space. The page is 90% black. The product screenshot sits inside a subtle `box-shadow: 0 0 80px rgba(94,106,210,0.15)` glow. Micro-animations on scroll reveal content.

**Mood:** Precision engineering. "This is a tool built by people who care about every pixel."

**What makes it screenshottable:** The contrast ratio between the darkness and the crisp white text creates a magazine-quality feel. The restraint is the design.

---

### 1.3 Vercel

**The ONE thing you remember:** The prism/crystal visual at center -- a 3D ferrofluid-inspired metallic shape that catches light, sitting against pure black. It feels like holding a piece of code in your hand.

**Color Palette:**
- Background: `#000000` (true black)
- Text: `#FFFFFF` (white), `#888888` (gray)
- Accents: `#0070F3` (Vercel blue), gradient from white to gray
- Subtle: `#171717` (card backgrounds), `#333333` (borders)

**Typography:**
- Font: Geist Sans (custom, geometric Swiss style), Geist Mono (code)
- Headline: 48-64px, font-weight 700, letter-spacing -0.02em
- Body: 16px, font-weight 400

**Layout Pattern:** Centered with a bold typographic headline stacked above a product visual. Multi-CTA row. Below: feature grid with icon-led cards.

**Key Visual Technique:** 3D WebGL prism/ferrofluid simulation colliding with a solid geometric shape at center. Reflective, metallic shader. The entire effect is rendered in-browser with custom lighting. Subtle noise texture over the background.

**Mood:** Technical wonder. "The future is being built here, and it is beautiful."

**What makes it screenshottable:** The 3D visual is genuinely novel -- it looks like concept art from a sci-fi film, not a website.

---

### 1.4 Notion

**The ONE thing you remember:** The warm, friendly illustrations of people collaborating -- hand-drawn-feeling characters on a clean white canvas. It feels like opening a fresh notebook.

**Color Palette:**
- Background: `#FFFFFF` (white)
- Text: `#37352F` (warm dark brown, not pure black)
- Secondary text: `#6B6B6B`
- Accent: `#000000` (black buttons), with occasional warm tints
- Illustration palette: soft peach `#FDDCB5`, warm yellow `#FCEBB6`, sky blue `#D3E5FF`, mint `#DBEDDB`, lavender `#E8DEEE`

**Typography:**
- Font: Custom serif for the logo, system sans-serif (Inter-like) for body
- Headline: 44-56px, font-weight 700
- Body: 18px, font-weight 400, generous line-height (1.65)

**Layout Pattern:** Centered headline with a row of friendly illustrated characters below. Clean, airy spacing. Multiple CTAs beneath. Product screenshots appear further down with soft shadows.

**Key Visual Technique:** Custom illustration system with consistent character style -- rounded forms, limited color palette per scene, flat colors with no outlines. Whitespace is the primary design element.

**Mood:** Approachable productivity. "Everyone is welcome here, and everything is possible."

**What makes it screenshottable:** The illustrations are so distinctively Notion that they function as brand identity. You recognize it instantly.

---

### 1.5 Arc Browser

**The ONE thing you remember:** Bold, saturated gradients that shift between spaces -- every user's browser looks different, and the marketing reflects this with a kaleidoscope of vivid color combinations.

**Color Palette:**
- No single palette -- the brand IS customization
- Marketing hero gradients: `#FF6B6B` (coral) to `#4ECDC4` (teal), `#A855F7` (violet) to `#EC4899` (pink), `#3B82F6` (blue) to `#8B5CF6` (purple)
- Background: varies, often `#1A1A2E` (dark navy) or `#FFFFFF`
- Text: `#FFFFFF` or `#1A1A2E`

**Typography:**
- Font: Custom display face (geometric, rounded), system sans fallback
- Headline: 60-80px, font-weight 800 (extra bold)
- Body: 18-20px, font-weight 400

**Layout Pattern:** Full-bleed gradient background with oversized centered headline. Product screenshots showing the browser UI with various gradient themes applied. Bold, playful layout with asymmetric elements.

**Key Visual Technique:** Multi-stop complementary gradients applied to large surface areas. The gradients feel hand-picked, not generated. Rounded corners everywhere (border-radius: 16-24px). Screenshots have thick device frames.

**Mood:** Creative energy. "Your browser should feel like yours."

**What makes it screenshottable:** The sheer saturation and color confidence. In a sea of dark-mode SaaS sites, Arc is unapologetically colorful.

---

### 1.6 Headspace

**The ONE thing you remember:** The signature orange circle/dot and playful illustrated faces expressing emotions. "Be kind to your mind" in rounded, friendly type over soft gradients.

**Color Palette:**
- Primary: `#FF7E1D` (Headspace orange/pumpkin)
- Supporting: `#0C6FF9` (blue ribbon), `#01A652` (green), `#00A4FF` (azure), `#FFCE00` (gold)
- Background: `#FFFFFF` or soft tinted washes
- Text: `#413D45` (ship gray)

**Typography:**
- Font: Custom "Headspace-ified Apercu" by Colophon Foundry -- rounded, warm terminals
- Headline: 40-56px, font-weight 700
- Body: 16-18px, font-weight 400

**Layout Pattern:** Centered headline with playful illustration below or beside. Generous padding. Soft, rounded button shapes. Often a single CTA. Illustration takes center stage.

**Key Visual Technique:** Custom illustration system featuring "brain-like" characters with a range of facial expressions. Flat colors, no outlines, dynamic scale. The hero smile shape is a flexible brand element used as a container, divider, and background shape.

**Mood:** Warm calm. "Taking care of yourself can feel light and joyful."

**What makes it screenshottable:** The distinctive orange and illustration style is instantly recognizable. It manages to make wellness feel fun rather than clinical.

---

### 1.7 Shopify

**The ONE thing you remember:** The confident green paired with real merchant product photography. The hero feels like a storefront window -- you see actual products, actual success.

**Color Palette:**
- Primary: `#95BF47` (Shopify green)
- Dark green: `#5E8E3E`
- Background: `#FFFFFF` or `#F4F6F8` (light gray)
- Dark mode variant: `#0D0D0D` background
- Text: `#212B36` (near-black), `#637381` (muted)

**Typography:**
- Font: Shopify Polaris system (similar to Inter/SF Pro)
- Headline: 48-64px, font-weight 700
- Body: 16-18px, font-weight 400

**Layout Pattern:** Split-screen or centered. Left: headline + CTA + trust badges. Right: product showcase (real merchant imagery or product mockup). Sometimes full-bleed hero image with text overlay.

**Key Visual Technique:** Real product photography with careful art direction -- lifestyle shots showing merchants and their products. Green accent color appears in CTAs and highlights. Subtle parallax on scroll.

**Mood:** Entrepreneurial confidence. "Your business can look this good."

**What makes it screenshottable:** The real-world product photography grounds it. This is not abstract -- you see the actual result of using Shopify.

---

### 1.8 Framer

**The ONE thing you remember:** Dark glass panels floating in space with frosted blur effects. The hero feels like an interface from the future -- translucent layers with glowing edges.

**Color Palette:**
- Background: `#0A0A0A` (near-black)
- Card surfaces: `rgba(255,255,255,0.05)` with `backdrop-filter: blur(12px)`
- Text: `#FFFFFF`, `#999999`
- Accent: gradient from `#00D4FF` (cyan) to `#7B61FF` (purple)
- Glow: `rgba(0,212,255,0.1)` (subtle cyan glow)

**Typography:**
- Font: Custom geometric sans (similar to Neue Montreal / Satoshi)
- Headline: 56-72px, font-weight 600, letter-spacing -0.03em
- Body: 16px, font-weight 400

**Layout Pattern:** Centered headline over a dark canvas. Below: floating glass-morphism cards showing the product interface. Cards have subtle `border: 1px solid rgba(255,255,255,0.1)` and inner glow.

**Key Visual Technique:** Glassmorphism at scale. Multiple translucent layers at different z-depths create a parallax-like 3D effect. Background uses a subtle aurora gradient (dark with soft color blobs) behind the glass panels. Noise texture (grain overlay at 3-5% opacity) adds tactile quality.

**Mood:** Future-premium. "Design tools should feel as beautiful as what you build with them."

**What makes it screenshottable:** The glass layering effect creates real depth on a flat screen. It looks expensive and exclusive.

---

### 1.9 Raycast

**The ONE thing you remember:** A command bar UI rendered as a hero -- the product IS the visual. Neon accent lines on deep purple-black, like a terminal that graduated from design school.

**Color Palette:**
- Background: `#111113` (dark charcoal)
- Surface: `#1A1A1F` (elevated dark)
- Text: `#EEEEEE` (primary), `#777777` (muted)
- Neon accents: `#FF6363` (red), `#FFC26D` (amber), `#56D364` (green), `#7B61FF` (violet), `#00A4FF` (blue)
- Glow effects: `box-shadow: 0 0 40px rgba(123,97,255,0.3)`

**Typography:**
- Font: Inter (body), Berkeley Mono or similar mono for code/UI
- Headline: 48-60px, font-weight 700, letter-spacing -0.02em
- Body: 16px, font-weight 400

**Layout Pattern:** Centered command-bar mockup as hero visual. Headline above. The mockup shows actual extension UI with syntax highlighting and icons. Keyboard shortcuts visible as design elements.

**Key Visual Technique:** Neon glow effects on UI chrome. The command bar has a `border: 1px solid rgba(255,255,255,0.1)` with colored glow leaking from active elements inside. Dark background with subtle radial gradient centered behind the mockup.

**Mood:** Developer empowerment. "Your Mac just got superpowers."

**What makes it screenshottable:** The product mockup IS the art. The neon accent colors on dark chrome look like a premium IDE theme come to life.

---

### 1.10 Loom

**The ONE thing you remember:** A friendly face in a video bubble -- the hero literally shows a person talking to you. Split layout with warm copy on one side and a video recording UI on the other.

**Color Palette:**
- Primary: `#625DF5` (Loom purple/indigo)
- Background: `#FFFFFF` (white), `#F8F8FF` (very light lavender)
- Text: `#1A1A2E` (dark navy), `#6B7280` (muted gray)
- Accent: `#625DF5` (buttons), `#E8E6FF` (light purple tint)
- Video bubble border: `#625DF5`

**Typography:**
- Font: Custom sans-serif (similar to Circular/Inter), system fallback
- Headline: 44-56px, font-weight 700
- Body: 18px, font-weight 400, line-height 1.6

**Layout Pattern:** Split-screen. Left: headline + subhead + CTA + trust logos. Right: product mockup showing a video recording in progress with a face bubble in the corner. Clean, generous whitespace.

**Key Visual Technique:** The product screenshot is the hero image -- a real video recording interface with a human face visible. The circular video bubble is the brand icon brought to life. Subtle shadow and rounded corners (16px) on the mockup. Background has a very gentle lavender wash.

**Mood:** Human connection. "Work feels better when you can see each other."

**What makes it screenshottable:** The human face in the video bubble creates instant emotional connection. It is the most "human" hero of any dev tool.

---

## 2. Theme-to-Site Mapping

| Theme Name | Primary Inspiration | Secondary Inspiration | Core Technique |
|---|---|---|---|
| **Stripe Flow** | Stripe | Vercel | Animated mesh gradient (WebGL or CSS) |
| **Linear Sharp** | Linear | Raycast | Ultra-dark, precise typography, minimal glow |
| **Prism Dark** | Vercel | Framer | 3D visual / prism reflections on black |
| **Notion Warm** | Notion | Loom | Warm white, friendly illustration, brown-tinted text |
| **Arc Vivid** | Arc Browser | Stripe | Bold multi-stop gradients, saturated color |
| **Nature Calm** | Headspace | -- | Soft organic shapes, muted earth tones, gentle animation |
| **Studio Bold** | Framer | Vercel | Dark glass panels, frosted blur, floating cards |
| **Neon Terminal** | Raycast | Linear | Dark chrome, neon accent lines, code aesthetic |
| **Loom Friendly** | Loom | Notion | Split layout, human imagery, warm purple tint |
| **Video Ambient** | Vercel Ship | Stripe | Full-bleed background video, text overlay with blur |

---

## 3. Selected Image & Video URLs

### 3.1 Stripe Flow / Linear Sharp (Dark tech / abstract gradient)

| Asset | URL | Description |
|---|---|---|
| Dark blue-purple gradient | `https://images.unsplash.com/photo-hQo6Uyo4nBg?w=1920&auto=format&q=80` | Deep blue to purple gradient, clean |
| Abstract purple waves | `https://images.unsplash.com/photo-ZQSPIiFEMoU?w=1920&auto=format&q=80` | Neon purple wave forms on black |
| Blue-purple wavy shapes | `https://images.unsplash.com/photo-1hg6NpO0kIk?w=1920&auto=format&q=80` | 4K abstract gradient with wave forms |
| Dark gradient soft light | `https://images.unsplash.com/photo-b4N2fd_Jm6w?w=1920&auto=format&q=80` | Soft light gradient on dark bg |

> **Note:** For Stripe Flow, the primary visual should be a CSS/WebGL gradient animation, not a photo. These images serve as fallbacks or inspiration overlays.

### 3.2 Notion Warm (Warm workspace / cozy)

| Asset | URL | Description |
|---|---|---|
| Laptop coffee wooden desk | `https://images.unsplash.com/photo-xEiT-x3FMuI?w=1200&auto=format&q=80` | Laptop and coffee on warm wooden table |
| Coffee desk with plant | `https://images.unsplash.com/photo-l0VJ4DnpUb4?w=1200&auto=format&q=80` | Laptop, coffee, plant -- warm natural light |
| Wooden desk workspace | `https://images.unsplash.com/photo-RTdvy9izXvw?w=1200&auto=format&q=80` | MacBook on wooden desk, cozy setup |
| Person at desk coffee | `https://images.unsplash.com/photo-04X1Yp9hNH8?w=1200&auto=format&q=80` | Person working with coffee, warm tones |

### 3.3 Loom Friendly (Team / collaboration)

| Asset | URL | Description |
|---|---|---|
| Diverse team at table | `https://images.unsplash.com/photo-fm4B1xWEIsU?w=1200&auto=format&q=80` | Diverse team collaborating around table |
| Team collaborating office | `https://images.unsplash.com/photo-oiqFyLx_KDU?w=1200&auto=format&q=80` | Team working together in modern office |
| Diverse group meeting | `https://images.unsplash.com/photo-YyJNda7nsPo?w=1200&auto=format&q=80` | Group in modern office meeting with laptops |
| Team meeting with laptops | `https://images.unsplash.com/photo-5V6KbvRcnV8?w=1200&auto=format&q=80` | Diverse group meeting, business setting |

### 3.4 Nature Calm (Ocean / zen / wellness)

| Asset | URL | Description |
|---|---|---|
| Calm ocean blue sky | `https://images.unsplash.com/photo-xc5-NX2VWHc?w=1920&auto=format&q=80` | Calm ocean waves under clear blue sky |
| Blue ocean horizon | `https://images.unsplash.com/photo-HQ4gmFChtOE?w=1920&auto=format&q=80` | Calm blue ocean water, bright sky |
| Ocean horizon vast | `https://images.unsplash.com/photo-wiDClFXgo7c?w=1920&auto=format&q=80` | Vast blue sky meets calm ocean |
| Calm body of water | `https://images.unsplash.com/photo-jnHQsTfq2Og?w=1920&auto=format&q=80` | Still calm body of water, minimal |

### 3.5 Studio Bold (Modern architecture / geometric)

| Asset | URL | Description |
|---|---|---|
| Geometric shadows | `https://images.unsplash.com/photo-A-13PmQkP1o?w=1920&auto=format&q=80` | Modern building with geometric shadows |
| Geometric shapes stairs | `https://images.unsplash.com/photo-XLccZCUXqbw?w=1920&auto=format&q=80` | Architecture with geometric shapes |
| Geometric patterns lights | `https://images.unsplash.com/photo-hYzHns4N1yc?w=1920&auto=format&q=80` | Abstract architecture with lights |
| B&W geometric contrast | `https://images.unsplash.com/photo-pFv5PYlDQBk?w=1920&auto=format&q=80` | Stark geometric architectural shapes |

### 3.6 Arc Vivid / Neon Terminal (Neon / bold color)

| Asset | URL | Description |
|---|---|---|
| Neon sci-fi background | `https://images.unsplash.com/photo-gfueakNdNXc?w=1920&auto=format&q=80` | Futuristic colorful neon lights |
| Neon lights dark blur | `https://images.unsplash.com/photo-BurTs_j6h5A?w=1920&auto=format&q=80` | Blurry neon lights in the dark |
| Colorful abstract gradient | `https://images.unsplash.com/photo-Id60Wsak5U4?w=1920&auto=format&q=80` | Colorful abstract gradient on white |
| Abstract purple bg | `https://images.unsplash.com/photo-5Q9Gf0WSyLk?w=1920&auto=format&q=80` | Abstract purple with black background |

### 3.7 Video Ambient (Background video loops)

| Asset | Source | URL | Description |
|---|---|---|---|
| Luminous particles loop | Pexels | `https://www.pexels.com/video/luminous-particles-loop-with-tunnel-effect-11354070/` | Particle tunnel, great for dark themes |
| Particles flying slow-mo | Pexels | `https://www.pexels.com/video/slow-motion-shot-of-particles-flying-around-4211320/` | White particles on dark bg |
| Abstract digital anim | Pexels | `https://www.pexels.com/video/chaotic-abstract-digital-animation-6977979/` | Abstract digital animation loop |
| Abstract loops collection | Pexels | `https://www.pexels.com/search/videos/abstract%20loop/` | Full searchable collection |

> **Integration note:** For Pexels videos, use their API or direct download link. Videos should be converted to WebM/MP4, compressed to under 5MB for hero use, and set to `autoplay muted loop playsinline`.

---

## 4. CSS Techniques Reference

### 4.1 Animated Mesh Gradient (Stripe Flow)

```css
.stripe-flow-hero {
  background: linear-gradient(
    135deg,
    #0A2540 0%,
    #5E46BF 25%,
    #1CA8FF 50%,
    #80ECFF 75%,
    #0A2540 100%
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
}
```

For the full WebGL version, use the `stripe-gradient.js` library or `@meshgradient/core`.

### 4.2 Ultra-Dark Minimal (Linear Sharp)

```css
.linear-sharp-hero {
  background: #000000;
  color: #EEEEEE;
}

.linear-sharp-hero h1 {
  font-family: 'Inter Display', 'Inter', system-ui, sans-serif;
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.linear-sharp-hero .product-glow {
  box-shadow:
    0 0 80px rgba(94, 106, 210, 0.15),
    0 0 2px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}
```

### 4.3 Glassmorphism Cards (Studio Bold / Framer)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Aurora background behind glass */
.glass-aurora-bg {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(123, 97, 255, 0.08) 0%, transparent 50%),
    #0A0A0A;
}
```

### 4.4 Neon Glow Accents (Neon Terminal / Raycast)

```css
.neon-glow {
  text-shadow:
    0 0 10px rgba(123, 97, 255, 0.5),
    0 0 40px rgba(123, 97, 255, 0.2);
}

.neon-border {
  border: 1px solid rgba(123, 97, 255, 0.3);
  box-shadow:
    0 0 15px rgba(123, 97, 255, 0.1),
    inset 0 0 15px rgba(123, 97, 255, 0.05);
}

.neon-line {
  background: linear-gradient(90deg, transparent, #7B61FF, transparent);
  height: 1px;
  width: 100%;
}
```

### 4.5 Gradient Text (Arc Vivid)

```css
.gradient-text {
  background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #A855F7);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-text-shift 5s ease infinite;
}

@keyframes gradient-text-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 4.6 Warm Soft Palette (Notion Warm)

```css
.notion-warm-hero {
  background: #FFFFFF;
  color: #37352F;
}

.notion-warm-hero h1 {
  font-family: 'Georgia', 'Charter', serif; /* or system serif */
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 700;
  color: #37352F;
}

.notion-warm-hero .illustration-bg {
  background: linear-gradient(
    180deg,
    #FFFFFF 0%,
    #FEF7ED 50%,  /* warm cream */
    #FFFFFF 100%
  );
}

.notion-warm-hero .tag {
  background: #FDDCB5;
  color: #37352F;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 14px;
}
```

### 4.7 Wellness Soft (Nature Calm / Headspace)

```css
.nature-calm-hero {
  background: linear-gradient(180deg, #FFFFFF 0%, #E8F5E9 100%);
  color: #2E4033;
}

.nature-calm-hero h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 400; /* serif fonts: lighter weights feel calm */
}

/* Organic blob shapes */
.organic-blob {
  border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
  background: linear-gradient(135deg, #A8E6CF, #88D4AB);
  animation: morph 8s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
  50% { border-radius: 40% 60% 50% 50% / 60% 40% 50% 50%; }
}
```

### 4.8 Video Background (Video Ambient)

```css
.video-ambient-hero {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.video-ambient-hero video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4; /* key: keep video subtle */
}

.video-ambient-hero .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.video-ambient-hero .content {
  position: relative;
  z-index: 1;
}
```

### 4.9 Split Layout (Loom Friendly)

```css
.loom-friendly-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 80vh;
}

@media (max-width: 768px) {
  .loom-friendly-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.loom-friendly-hero .product-mockup {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(98, 93, 245, 0.15);
  overflow: hidden;
}

.loom-friendly-hero .trust-logos {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  opacity: 0.5;
  margin-top: 2rem;
}
```

### 4.10 Noise/Grain Texture Overlay (Universal)

```css
/* Apply to any hero for tactile quality */
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}
```

---

## 5. Typography Reference

### Recommended Free Font Pairings per Theme

| Theme | Heading Font | Body Font | Source |
|---|---|---|---|
| Stripe Flow | Inter Display (700) | Inter (400) | Google Fonts / Variable |
| Linear Sharp | Inter Display (600) | Inter (400) | Google Fonts / Variable |
| Prism Dark | Geist Sans (700) | Geist Sans (400) | Vercel open-source |
| Notion Warm | Lora or Charter (700) | Inter (400) | Google Fonts |
| Arc Vivid | Plus Jakarta Sans (800) | Plus Jakarta Sans (400) | Google Fonts |
| Nature Calm | DM Serif Display (400) | DM Sans (400) | Google Fonts |
| Studio Bold | Satoshi (600) | Satoshi (400) | Fontshare (free) |
| Neon Terminal | JetBrains Mono (700) | Inter (400) | Google Fonts |
| Loom Friendly | Circular alt: Plus Jakarta Sans (700) | Inter (400) | Google Fonts |
| Video Ambient | Space Grotesk (700) | Space Grotesk (400) | Google Fonts |

### Type Scale Reference

```
Hero headline:    clamp(2.5rem, 5vw, 4.5rem)  /* 40-72px responsive */
Hero subhead:     clamp(1.125rem, 2vw, 1.5rem) /* 18-24px responsive */
Body:             1rem (16px)
Small/caption:    0.875rem (14px)
```

---

## 6. Key Takeaways

### What separates "good" from "screenshottable"

1. **One signature visual.** Stripe has the gradient. Linear has the darkness. Notion has the illustrations. Every memorable hero has ONE thing, not five.

2. **Restraint.** The best heroes show less, not more. Linear uses 90% black. Notion uses 80% whitespace. The content breathes.

3. **The product IS the visual.** Raycast, Loom, and Framer all use their actual product UI as the hero image. The demo is the design.

4. **Typography does the heavy lifting.** When the background is simple (Linear, Notion), the headline typography must be impeccable -- tight tracking, perfect weight, considered line height.

5. **Color means something.** Stripe's gradient suggests complexity. Headspace's orange suggests warmth. Linear's lack of color suggests precision. Never add color without intent.

6. **Texture creates premium.** Noise overlays, subtle borders, inner shadows, and backdrop blur separate flat designs from ones that feel tangible. Every site in this list uses at least one texture technique.

7. **Motion is subtle.** None of these sites use jarring animations. Stripe's gradient drifts. Linear's content fades in on scroll. Framer's cards float. The motion is felt more than seen.

### Implementation Priority

For our 10 themes, build in this order (easiest to hardest, highest impact first):

1. **Linear Sharp** -- Pure CSS, no images needed, highest perceived quality
2. **Notion Warm** -- CSS + illustration assets, warm and accessible
3. **Loom Friendly** -- Split layout + image, straightforward grid
4. **Nature Calm** -- CSS gradients + optional image, soothing
5. **Arc Vivid** -- CSS gradients + gradient text, bold and fun
6. **Neon Terminal** -- CSS + glow effects, developer appeal
7. **Studio Bold** -- Glassmorphism cards, needs careful backdrop-filter
8. **Stripe Flow** -- Animated gradient, needs keyframe tuning
9. **Video Ambient** -- Video element + overlay, needs asset optimization
10. **Prism Dark** -- 3D visual (Three.js/WebGL), most complex

---

## Sources

- [Stripe Gradient Effect Tutorial - Kevin Hufnagl](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/)
- [Stripe Mesh Gradient WebGL - Medium](https://medium.com/design-bootcamp/moving-mesh-gradient-background-with-stripe-mesh-gradient-webgl-package-6dc1c69c4fa2)
- [Stripe Color Palette - HTML Colors](https://htmlcolors.com/palette/31/stripe)
- [Stripe Brand Gradients](http://www.brandgradients.com/stripe-colors/)
- [How Linear Redesigned Their UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Linear Brand Colors - Mobbin](https://mobbin.com/colors/brand/linear)
- [Rise of Linear Style Design - Medium](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [Linear Style Themes](https://linear.style/)
- [Vercel Ship Conference Platform Design](https://vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform)
- [Vercel Hero Section - Hero Gallery](https://hero.gallery/hero-gallery/vercel)
- [Vercel Geist Design System](https://vercel.com/geist/introduction)
- [Vercel Geist Colors](https://vercel.com/geist/colors)
- [Notion Style Illustrations Guide](https://getillustrations.com/blog/notion-style-illustrations-how-to-use-them-in-templates-websites-and-saas-products/)
- [Notion Hero Section - Supahero](https://www.supahero.io/hero/notion)
- [Notion Brand Colors - Mobbin](https://mobbin.com/colors/brand/notion)
- [Arc Browser UI/UX Design - SaaSUI](https://www.saasui.design/application/arc-browser)
- [Arc Browser - Rethinking Web Design](https://medium.com/design-bootcamp/arc-browser-rethinking-the-web-through-a-designers-lens-f3922ef2133e)
- [Headspace Visual Identity Overhaul](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- [Headspace Brand Systems - Liz Tran](https://liztran.fyi/headspace:-brand-systems)
- [Headspace Brand Colors - Mobbin](https://mobbin.com/colors/brand/headspace)
- [Shopify Brand Colors - Mobbin](https://mobbin.com/colors/brand/shopify)
- [Shopify Hero Sections - Posstack](https://posstack.com/blog/shopify-examples-hero-sections)
- [Framer Glassmorphism Components](https://www.framer.com/marketplace/components/tags/glassmorphism/)
- [Frosted Glass Effect in Framer](https://framer.university/blog/how-to-create-a-frosted-glass-effect-in-framer)
- [Glassmorphism Guide 2026](https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026/)
- [Raycast - Your Shortcut to Everything](https://www.raycast.com/)
- [Raycast API Colors](https://developers.raycast.com/api-reference/user-interface/colors)
- [Loom Design Collaboration](https://www.loom.com/use-case/design)
- [Loom Typography - Lens Design System](https://lens.loom.dev/styles/typography)
- [Hero Section Design Best Practices 2025](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Hero Section Examples - LogRocket](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)
- [Top 10 Hero Sections 2026 - Paperstreet](https://www.paperstreet.com/blog/top-10-hero-sections/)
- [Web Design Trends 2026 - Figma](https://www.figma.com/resource-library/web-design-trends/)
- [Pexels Particles Videos](https://www.pexels.com/search/videos/particles/)
- [Pexels Abstract Loop Videos](https://www.pexels.com/search/videos/abstract%20loop/)
- [Unsplash Dark Gradient Photos](https://unsplash.com/s/photos/dark-gradient)
- [Unsplash Calm Sea Photos](https://unsplash.com/s/photos/calm-sea)
- [Unsplash Minimalist Architecture](https://unsplash.com/s/photos/minimalist-architecture)
- [Unsplash Neon Gradient Photos](https://unsplash.com/s/photos/neon-gradient)

# Hey Bradley — Design Review & P125 Visual Overhaul
**Date:** May 9, 2026  
**Reviewer:** Human owner  
**Swarm self-score:** 90.5/100 (functional)  
**Actual visual score:** 35/100  

---

## Harvard Official Color System

Source: Harvard Identity Guidelines / HBS Brand Guidelines

```
PRIMARY
  Harvard Crimson   #A51C30   — the only red
  Black             #000000   — backgrounds, deep surfaces
  White             #FFFFFF   — text on dark

SECONDARY (Harvard extended palette)
  Deep Navy         #1E1656   — derived from Harvard Blue 1 #3B2883
  Steel Blue        #6578B4   — Harvard Blue 2, useful for accents
  Light Blue        #7FA4D1   — Harvard Blue 3, subtle highlights
  Cool Gray         #808285   — Harvard Cool Gray, secondary text
  Silver            #B6B6B6   — borders, dividers

OFFICIALLY NOT HARVARD:
  ❌ #C8A44A (gold) — not in Harvard palette, remove
  ❌ Flat #1e1e1e / #2a2a2a gray — not black, not depth
  ❌ Orange — never

FONT: Harvard uses Garamond (custom).
  For web: Cormorant Garamond (already imported)
  for all serif/display. NOT DM Sans as primary.
```

**Correct 60-30-10 for Hey Bradley:**
```
60%  Rich near-black  #000000 / #07070e 
     (not flat gray — must have depth via 
     radial gradients and subtle grain)
30%  Off-white text   #f0ede5 / #ffffff
     on surfaces: #111118 (slightly lifted)
10%  Harvard Crimson  #A51C30 — CTAs, accents, 
     eyebrows, borders on hover
     + Harvard Steel Blue #6578B4 as second 
     accent for data/research sections only
```

---

## Rubric — Full Site (35/100 overall)

| Element | Score | Benchmark | Gap |
|---|---|---|---|
| **Color palette** | 22 | 90 = Apple dark mode depth | Flat gray ≠ black. No depth, no grain, no gradient. |
| **Typography** | 30 | 90 = Cormorant + Mono contrast | DM Sans only. No serif contrast. No hierarchy variation. Boring. |
| **Hero section** | 42 | 90 = capstone v8 slide 1 quality | Copy is good. Background is flat. Orb is there but weak. Font is wrong. |
| **Demo builder** | 18 | 90 = Phase 3 mockup (image 3) | Two flat panels, chat bubbles = iMessage clone. No device frame. No cinematic quality. No animation. |
| **Feature cards** | 35 | 80 = Stripe feature grid | Flat gray, no depth, emoji icons (not good at this quality level). |
| **Stats section** | 0 | 80 = capstone v8 slide 8 | Doesn't exist on current site. |
| **AISP section** | 0 | 90 = capstone v8 slide 6 | Doesn't exist on current site. |
| **Blog/editorial** | 20 | 85 = Untitled UI (image 2) | No real photography. No editorial quality. |
| **Imagery** | 5 | 80 = Unsplash editorial quality | No real images. CSS icons only. |
| **Spacing/rhythm** | 48 | 85 = Linear/Vercel | Sections exist but no breathing room. |
| **Mobile** | 40 | 75 = minimum viable | Not tested in these screenshots. |
| **Overall** | **35** | 60 = Wix pro floor | Below the floor. |

### What 90/100 looks like (reference images provided):
- Image 4 (capstone title): Cormorant Garamond, near-black, gold text, extreme type weight contrast
- Image 5 (AISP chart): Beautiful data visualization, serif headline, warm gradient bars
- Image 6 (crystal atom): Gold symbols on near-black, mono eyebrow, elegant card borders
- Image 7 (personas): Gold italic headline, dark surfaces with subtle borders, emoji used correctly at large size

### What needs to happen to reach 70/100:
1. Color system replaced with Harvard palette
2. Typography: Cormorant Garamond for all headlines
3. Demo builder rebuilt cinematically (Phase 3 mockup, Image 3)
4. Real data sections (stats, AISP) added from capstone deck
5. Real imagery or high-quality CSS illustrations

---

## P125 Swarm Instructions

**Branch:** `swarm/p125-visual-overhaul`  
**Target:** 35/100 → 68/100  
**Reference:** bradley-capstone-v8.html (quality bar for every decision)  
**Reference images:** phase-3 demo builder (Image 3), Untitled UI blog (Image 2)

---

### W1 — Color system replacement

**File:** `src/index.css`

Replace all marketing color tokens:

```css
:root {
  /* Harvard official palette */
  --hb-void:        #000000;     /* pure black for hero sections */
  --hb-deep:        #07070e;     /* near-black, slight blue tint */
  --hb-surface:     #0f0f1a;     /* elevated card backgrounds */
  --hb-surface-2:   #16162a;     /* further elevated */
  --hb-border:      rgba(255,255,255,0.07);
  --hb-border-warm: rgba(164,16,52,0.25); /* crimson border */

  /* Harvard crimson — official */
  --hb-crimson:     #A51C30;     /* primary CTA, accents */
  --hb-crimson-dim: rgba(165,28,48,0.15);
  --hb-crimson-hover: #8C1515;   /* darker on hover */

  /* Harvard blue — second accent for data/research only */
  --hb-blue:        #6578B4;     /* Harvard Blue 2 */
  --hb-blue-dim:    rgba(101,120,180,0.15);

  /* Text */
  --hb-text-primary:   #f0ede5;  /* warm white, not pure */
  --hb-text-secondary: rgba(240,237,229,0.55);
  --hb-text-tertiary:  rgba(240,237,229,0.28);

  /* Remove entirely — not Harvard: */
  /* --hb-warm: #C8A44A  ← DELETE */
  /* flat gray backgrounds  ← DELETE */
}
```

**Grain/depth texture on hero:**
```css
.marketing-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  opacity: 0.025;
  pointer-events: none;
}
```

**Grid overlay on hero (from capstone v8):**
```css
.marketing-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(164,16,52,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(164,16,52,0.06) 1px, transparent 1px);
  background-size: 44px 44px;
}
```

---

### W2 — Typography overhaul

**All marketing headlines:** Cormorant Garamond, weight 300, not DM Sans.

```css
/* Load if not already present */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Sans:wght@300;400;600&family=DM+Mono:wght@400&display=swap');

.marketing-h1 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 300;
  font-size: clamp(56px, 9vw, 120px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--hb-text-primary);
}

.marketing-h1 em {
  font-style: italic;
  color: var(--hb-crimson);
}

/* Eyebrow labels — all caps mono */
.marketing-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--hb-crimson);
  margin-bottom: 16px;
}

/* Body text — DM Sans, but larger */
.marketing-body {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.7;
  color: var(--hb-text-secondary);
}
```

**Apply to Welcome.tsx:**
- "Describe it." → Cormorant Garamond weight 300, white
- "See it." → Cormorant Garamond weight 300 italic, crimson
- Subhead → DM Sans 18px, --hb-text-secondary

---

### W3 — Hero section

**File:** `src/pages/Welcome.tsx`

```tsx
// Hero background — replace flat gray
<section className="relative min-h-screen bg-[#000000] 
  overflow-hidden flex items-center justify-center">
  
  {/* Radial crimson orb */}
  <div className="absolute inset-0 pointer-events-none"
    style={{background: `radial-gradient(
      ellipse 80% 60% at 50% 40%,
      rgba(165,28,48,0.18) 0%,
      rgba(0,0,0,0) 70%
    )`}} />

  {/* Subtle grid */}
  <div className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(rgba(164,16,52,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(164,16,52,0.06) 1px, transparent 1px)`,
      backgroundSize: '44px 44px'
    }} />

  {/* Content */}
  <div className="relative z-10 text-center max-w-5xl px-8">
    <div className="marketing-eyebrow mb-6">
      Harvard Extension School · ALM · May 2026
    </div>
    <h1 className="marketing-h1 mb-4">
      Describe it.<br/>
      <em>See it.</em>
    </h1>
    <p className="marketing-body max-w-xl mx-auto mb-10">
      Your voice is the whiteboard. Hey Bradley turns 
      any idea into a visual site and a formal spec 
      — while you're still talking.
    </p>
    <div className="flex gap-4 justify-center">
      <Button className="bg-[#A51C30] hover:bg-[#8C1515] 
        text-white px-8 py-4 text-base rounded-full">
        Start describing →
      </Button>
      <Button variant="outline" className="border-white/20 
        text-white hover:border-[#A51C30] px-8 py-4 
        text-base rounded-full">
        Watch the walkthrough →
      </Button>
    </div>
  </div>
</section>
```

---

### W4 — Cinematic demo (full rebuild)

**New file:** `src/components/marketing/CinematicDemo.tsx`

This replaces the current flat two-panel demo entirely.

**Layout concept (from Image 3 — Phase 3 builder):**

```
┌─────────────────────────────────────────────────────┐
│  ● ● ●  hey-bradley.app/preview             [frame] │
├──────────────────┬──────────────────────────────────┤
│  LEFT (35%)      │  RIGHT (65%)                     │
│                  │                                  │
│  ◉ Listening...  │  [Site builds here]              │
│  ~~~~~~~~~~~~~~~~│                                  │
│  Voice waveform  │  Section 1 slides up:            │
│                  │  ┌─────────────────────────────┐ │
│  TRANSCRIPT:     │  │ ASHEVILLE ROASTERS          │ │
│  ─────────────── │  │ Slow-roasted, served warm   │ │
│  You:            │  │ [See the menu →]            │ │
│  "Make me a site │  └─────────────────────────────┘ │
│  for my coffee   │                                  │
│  shop"           │  Section 2 slides up:            │
│                  │  ┌────┐ ┌────┐ ┌────┐           │
│  Bradley:        │  │Menu│ │Hrs │ │Visit│          │
│  "Got it. Warm,  │  └────┘ └────┘ └────┘           │
│  plain-spoken,   │                                  │
│  real photos."   │  AISP spec corner:               │
│                  │  Σ{site = (sections, theme);...  │
└──────────────────┴──────────────────────────────────┘
  ⚡ 0.8s first build    ▸ Download specs · Try builder
```

**Critical design decisions:**
- Device frame: border + crimson glow shadow (not floating)
- LEFT PANEL: transcript style (not chat bubbles)
  - "You:" label in crimson mono
  - "Bradley:" label in Harvard Blue #6578B4 mono
  - Last 2 turns visible, scrolls up as new turns arrive
  - Voice waveform: 6 animated bars, crimson
  - Orb: subtle, not as large as listen mode standalone
- RIGHT PANEL: site sections animate in one by one
  - NOT a static screenshot
  - CSS transitions, 0.8s each section
- AISP spec card: appears in bottom-right corner at step 3
  - Mono font, crimson label "AISP SPECS"
  - Shows: `Σ{site = (sections, theme);...`
- Animation loops once, then shows CTA
- Replay button: bottom center

**Implementation note:** Build this as a pure CSS/React animation.
No iframe. No real builder call. This is a crafted illusion.

---

### W5 — Stats section (add — currently missing)

Add between hero and features sections.

**Modelled on capstone v8 slide 8:**

```tsx
// Three stats in Cormorant Garamond
// Harvard Blue for the +42% (research data)
// Crimson for the 92% (primary result)
// Warm white for <2% (AISP result)

<section className="bg-[#07070e] py-24">
  <div className="marketing-eyebrow text-center mb-12">
    SWE-bench Verified — January 2026
  </div>
  <div className="grid grid-cols-3 max-w-4xl mx-auto">
    <StatCard number="+42%" label="Over baseline" 
      sub="Same model. Better spec." color="blue" />
    <StatCard number="92%" label="Overall success" 
      sub="Competitive with frontier" color="crimson" featured />
    <StatCard number="<2%" label="Spec ambiguity" 
      sub="AISP δ = 0.016" color="white" />
  </div>
</section>
```

---

### W6 — AISP section (add — currently missing)

**Modelled on capstone v8 slide 6 and 7:**

```tsx
// "Five parts. Zero ambiguity."
// The five Crystal Atom cards: Ω Σ Γ Λ Ε
// Eyebrow: "AISP — THE RECIPE, NOT THE WISH"
// Delta bar: "Industry standard: 40–65% → AISP: δ = 0.016"

// Card style:
// - Dark surface #0f0f1a
// - Crimson border rgba(165,28,48,0.22)
// - Symbol in Cormorant Garamond 38px, crimson
// - Name in DM Mono 9px uppercase, dimmed
// - Definition in Cormorant italic 17px
```

---

### W7 — Feature cards redesign

Replace current flat gray emoji cards:

```
Before: flat gray card, emoji icon, sans-serif text
After:  dark surface, crimson left border on hover,
        Harvard Blue icon (SVG, not emoji),
        Cormorant heading,
        hover: translateY(-4px) 0.2s ease
```

---

### W8 — Blog/editorial section

**Reference: Untitled UI (Image 2)**

The blog section needs real editorial quality.
Since real photography is not yet available, 
use these as placeholders:

```
Unsplash source images (free for use):
  - Abstract dark/crimson: search unsplash.com/s/photos/abstract-red
  - Code/tech: unsplash.com/s/photos/programming-dark
  - Education/Harvard: unsplash.com/s/photos/university-lecture

For each blog card:
  - 16:9 image with Ken Burns CSS animation on hover
  - Category tag in crimson
  - Cormorant headline
  - DM Sans body, 2 lines max
  - Author + date in mono

Featured card (full width):
  - Image fills entire left half
  - Text overlaid bottom-left on gradient
  - This mirrors the Untitled UI layout exactly
```

---

### W9 — "Coming from another builder?" — remove

This line is still in the hero. Remove it entirely.
It signals weakness and dilutes the hero.

---

## Exit criteria — P125

```
[ ] npm run build clean
[ ] Color: Harvard crimson #A51C30 only (no gold anywhere)
[ ] Backgrounds: #000000 / #07070e (not flat gray)
[ ] Headlines: Cormorant Garamond on all H1/H2
[ ] Hero: radial orb + grid overlay visible
[ ] Demo: device frame, transcript left panel, 
    animated site build right panel
[ ] Stats section: 3 numbers exist and render
[ ] AISP section: 5 Crystal Atom cards exist
[ ] Feature cards: hover animation + crimson border
[ ] Blog: editorial layout, image placeholders
[ ] "Coming from another builder?" removed
[ ] Honest rescore: target 65-70/100
[ ] Reference check: does it approach capstone v8 quality?
    If no → do not seal.
```

---

## Do not touch in P125

```
Builder code, LLM adapters, Gemini route,
AISP code view in builder, /capstone, /docs.
Only touch: Welcome.tsx, marketing CSS, 
new components in src/components/marketing/.
```

---

## Honest calibration

| Score | Meaning |
|---|---|
| 90+ | Apple, Stripe, Anthropic — agency-created, photography, custom type |
| 80 | Professional design team, real photography, polished interactions |
| 70 | Top-tier indie product, strong design system, consistent palette |
| 60 | Solid Wix Pro — usable, presentable, not embarrassing |
| 42 | Current site — functional, not beautiful |
| 35 | Honest current score accounting for demo, color, typography |

**P125 target: 68.** That is: strong indie product quality.  
Not Apple. Not Stripe. Good enough for Show HN, TikTok, Harvard.  
The gap from 68 to 80+ requires real photography and a designer.  
The gap from 35 to 68 requires only code — and it is achievable in one phase.
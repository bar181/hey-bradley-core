# Agency Polish Research -- Phase 6

**Date:** 2026-04-02
**Purpose:** Catalog micro-interaction patterns and CSS recipes to elevate Hey Bradley from prototype quality to agency-grade polish.

---

## 1. Five Micro-Interaction Patterns from Top Agency Sites

### Pattern 1: Scroll-Triggered Staggered Reveal

Used extensively on godly.website featured sites (Lusion, Locomotive, Basement Studio). As the user scrolls, content blocks fade in and slide up with a staggered delay per element. Each card or text block animates independently with 50-100ms offset from its sibling, creating a cascading waterfall effect.

**Why it works:** Draws attention to content sequentially. Prevents the "wall of text" feeling. Signals craftsmanship.

**Implementation cost:** Low -- Intersection Observer + CSS transitions.

### Pattern 2: Card Hover Lift with Ambient Glow

Common on Linear, Vercel, and Raycast marketing pages. Cards rest with a subtle `shadow-md` and on hover they translate upward (`-translate-y-1` to `-translate-y-2`) while the shadow deepens to `shadow-xl`. Some sites add a colored border-glow matching the brand accent on hover.

**Why it works:** Communicates interactivity. The lift metaphor is universally understood as "this is clickable." The glow adds premium feel.

**Implementation cost:** Trivial -- pure CSS, no JavaScript.

### Pattern 3: Button Press Feedback (Scale Bounce)

Stripe, Linear, and Tailwind UI all use a micro-scale on buttons: `hover:scale-[1.02]` paired with `active:scale-[0.98]`. The active state creates a "press in" feel that mimics a physical button. Duration is 150-200ms with `ease-out` timing.

**Why it works:** Provides instant tactile feedback. Users feel confident their click registered. The bounce-back on release feels satisfying.

**Implementation cost:** Trivial -- two CSS classes.

### Pattern 4: Tab/Panel Crossfade Transition

Sites like Notion, Arc, and Framer use opacity crossfades (not hard cuts) when switching between tabs or panels. The outgoing panel fades to 0 over 150ms while the incoming panel fades from 0 to 1 over 200ms, often with a subtle 4-8px vertical slide.

**Why it works:** Eliminates the jarring flash of content replacement. Maintains spatial continuity. Feels smooth and intentional.

**Implementation cost:** Medium -- requires managing enter/exit states (CSS + minimal JS or Framer Motion).

### Pattern 5: Smooth Color Mode Transition

Apple.com, Linear, and Vercel transition between light and dark mode with a 300-500ms ease on all color properties. Background, text, borders, and shadows all transition simultaneously rather than snapping. Some sites use a radial wipe originating from the toggle button.

**Why it works:** The snap between modes feels broken. A smooth transition communicates intentional design and prevents the user from losing their place visually.

**Implementation cost:** Low -- add `transition-colors duration-300` to body/root element.

---

## 2. Tailwind + CSS Recipes

### Recipe A: Scroll-Triggered Fade-In

Uses the Intersection Observer API to add a class when elements enter the viewport.

```tsx
// Hook: useScrollReveal.ts
import { useEffect, useRef } from 'react'

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in')
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
```

```css
/* Tailwind @layer approach */
@layer utilities {
  .scroll-reveal {
    @apply opacity-0 translate-y-6 transition-all duration-700 ease-out;
  }
  .scroll-reveal.animate-in {
    @apply opacity-100 translate-y-0;
  }
}
```

**Stagger children** by applying `transition-delay` via style attribute:

```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    ref={useScrollReveal()}
    className="scroll-reveal"
    style={{ transitionDelay: `${i * 80}ms` }}
  >
    {/* card content */}
  </div>
))}
```

### Recipe B: Card Hover Lift

```tsx
<div className="
  rounded-xl border border-white/10
  bg-white/5 p-6
  shadow-md
  transition-all duration-200 ease-out
  hover:shadow-xl hover:-translate-y-1 hover:border-white/20
  active:translate-y-0 active:shadow-md
">
  {/* card content */}
</div>
```

**With accent glow on hover** (uses a pseudo-element or box-shadow):

```tsx
<div className="
  relative rounded-xl border border-white/10
  bg-white/5 p-6 shadow-md
  transition-all duration-200 ease-out
  hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)]
  hover:-translate-y-1 hover:border-red-500/30
">
```

### Recipe C: Button Press Feedback

```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  bg-red-600 text-white
  transition-transform duration-150 ease-out
  hover:scale-[1.02] hover:bg-red-500
  active:scale-[0.98] active:bg-red-700
  focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
  focus-visible:ring-offset-slate-900
">
  Get Started
</button>
```

### Recipe D: Tab Crossfade

```tsx
// Using CSS + conditional rendering
<div className="relative">
  {tabs.map((tab) => (
    <div
      key={tab.id}
      className={`
        absolute inset-0
        transition-all duration-200 ease-out
        ${activeTab === tab.id
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-1 pointer-events-none'
        }
      `}
    >
      {tab.content}
    </div>
  ))}
</div>
```

**Alternative using Framer Motion AnimatePresence:**

```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2 }}
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

### Recipe E: Smooth Color Mode Transitions

Apply to the root container or body:

```tsx
<div className="
  transition-colors duration-300 ease-in-out
  bg-slate-900 text-slate-100
  dark:bg-slate-900 dark:text-slate-100
">
```

For Hey Bradley specifically, since palette colors are applied via inline styles, add transition to all section wrappers:

```tsx
<section
  style={{ background: palette.bgPrimary, color: palette.textPrimary }}
  className="transition-colors duration-300 ease-in-out"
>
```

---

## 3. Cinematic Orb Effect (Three-Layer Technique)

The Hey Bradley Listen tab features a pulsing orb that responds to audio. To make it look cinematic rather than like a flat circle, use a three-layer compositing approach inspired by Apple's Siri glow and Spotify's ambient visualizer.

### Layer 1: Solid Core

The innermost element. A solid circle with the primary accent color. This is the "light source."

```css
.orb-core {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(255, 255, 255, 0.3),
    var(--accent-primary) 40%,
    var(--accent-dark) 100%
  );
  /* Off-center highlight creates 3D illusion */
}
```

### Layer 2: Blurred Ring (Mid-Glow)

A slightly larger circle positioned behind the core with a significant CSS blur. This creates the "atmosphere" around the orb.

```css
.orb-ring {
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0.5;
  filter: blur(30px);
  /* Pulse animation scales this layer */
  animation: orb-pulse 3s ease-in-out infinite;
}

@keyframes orb-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50%      { transform: scale(1.15); opacity: 0.6; }
}
```

### Layer 3: Ambient Glow (Outer Halo)

The outermost layer -- a very large, very blurred element that casts ambient light onto the surrounding UI. This is what makes the orb feel like it exists in the space rather than floating on top.

```css
.orb-ambient {
  position: absolute;
  inset: -60%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--accent-primary) 0%,
    transparent 70%
  );
  opacity: 0.2;
  filter: blur(60px);
  /* Slower pulse than the ring for depth */
  animation: orb-ambient-pulse 5s ease-in-out infinite;
}

@keyframes orb-ambient-pulse {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50%      { transform: scale(1.3); opacity: 0.25; }
}
```

### Compositing Order (bottom to top)

1. `.orb-ambient` -- outer halo, largest, most blurred, lowest opacity
2. `.orb-ring` -- mid-glow, medium blur, medium opacity
3. `.orb-core` -- solid center, no blur, full opacity

### Audio Reactivity

Connect to Web Audio API `AnalyserNode.getByteFrequencyData()`. Map the average amplitude (0-255) to:

- **Core scale:** `1.0 + (amplitude / 255) * 0.15` (subtle throb)
- **Ring scale:** `1.0 + (amplitude / 255) * 0.3` (more dramatic)
- **Ring opacity:** `0.3 + (amplitude / 255) * 0.4`
- **Ambient opacity:** `0.1 + (amplitude / 255) * 0.2`

Use `requestAnimationFrame` for smooth 60fps updates. Apply via CSS custom properties for GPU-accelerated transforms.

### Performance Notes

- Use `will-change: transform, opacity` on all three layers
- Use `transform: translateZ(0)` to force GPU compositing
- The blur filters are expensive -- keep the blurred elements as simple shapes (no children, no borders)
- On mobile, consider reducing blur radius by 50% or removing the ambient layer entirely
- `mix-blend-mode: screen` on the ambient layer can create a more natural light bleed effect on dark backgrounds

---

## References

- godly.website -- curated gallery of top agency and product sites
- Tailwind UI -- marketing section components with polished interactions
- Linear.app -- exemplary micro-interactions in a product context
- Stripe.com -- button and card interaction gold standard
- Apple Siri UI -- multi-layer glow and ambient light techniques
- Framer Motion docs -- AnimatePresence for enter/exit transitions
- MDN IntersectionObserver API -- scroll-triggered animations

# Hey Bradley — Phase 6: Agency Polish + AISP Specs + Canned Demo

**Priority:** P0 — This is the capstone demo preparation phase  
**Goal:** Move persona score from 67 → 80+ through polish, wow factor, and the right kind of output  
**Timeline:** ~3-4 days of focused work  
**Principle:** Stop building more. Start polishing what exists.

---

## 0. GROUNDING: What the Persona Review Actually Said

The 67/100 score breaks down as:
- Agency Designer: 68 (good templates, missing micro-interactions + section headings)
- Grandma: 58 (ImagePicker works, but SaaS defaults + jargon + no upload)
- Startup Founder: 70 (competitive variant count, but no publish/export + single pricing variant)
- Harvard Professor: 72 (architecture is capstone-worthy, but "can I see the output?" has no good answer)

**The #1 demo blocker is the professor asking "can I see the output?" and the answer being "no."**

The answer should NOT be "download as HTML" — this is a React app, HTML export is reductive. The answer IS: **"The output is a complete AISP specification that any AI coding agent can reproduce — here's the North Star, the architecture doc, the implementation plan, and page-by-page build instructions."** This is Hey Bradley's actual innovation — it writes specs, not HTML.

---

## 1. SWARM MUST RESEARCH FIRST (Mandatory — No Code Until Complete)

### 1.1 Agency Quality Design Research

**Task:** Web search and document in `docs/research/agency-polish-research.md`:

- Visit 5 agency-quality websites (godly.website top picks) and document: What micro-interactions do they use? What makes them feel "alive"? Specifically note: hover states, scroll animations, transitions, loading states, button feedback.
- Study the frontend-design skill guidelines (above) — commit to a BOLD aesthetic direction for Hey Bradley's builder chrome AND the preview output.
- Document 3 specific micro-interaction patterns to implement:
  1. **Scroll-triggered entrance animations** (IntersectionObserver + staggered delays)
  2. **Button/card hover states** (transform + shadow transition, 200-300ms)
  3. **Smooth mode/tab transitions** (crossfade between states, 200ms)

### 1.2 AISP Output Research

**Task:** Document in `docs/research/aisp-output-research.md`:

- What should the XAI DOCS tab actually generate from the current JSON?
- Map the current `MasterConfig` to AISP Crystal Atom format
- Define the 4 spec documents that get generated:
  1. **North Star** — Vision, PMF, user personas, success criteria (from site.title, site.description, theme, sections)
  2. **Architecture** — Tech stack, section hierarchy, component model, data flow (from JSON structure)
  3. **Implementation Plan** — Page-by-page build instructions, section order, variant specs (from sections array)
  4. **AISP Spec** — Full `@aisp` formatted specification that a Claude Code agent could use to reproduce the site

### 1.3 ADRs Required

- **ADR-026: AISP Spec as Primary Output** — The product's output is not HTML but AISP specifications. The XAI DOCS tab generates human-readable and machine-readable specs from the JSON.
- **ADR-027: Micro-Interaction Standards** — All interactive elements must have: hover feedback (200ms transition), focus ring, active state depression, and disabled state visual. Cards have `shadow-sm` resting + `shadow-lg hover` + `translate-y-[-2px] hover`.
- **ADR-028: Section Heading Convention** — All grid/card sections render a heading + optional subheading above the content grid. Read from `section.content.heading` / `section.content.subheading`.

---

## 2. VISUAL POLISH (Score Impact: +8-10 Points)

### 2.1 Section Headings Above Card Grids (+4 points)

**The single highest-impact visual fix.** Every grid section (Columns, Quotes, Numbers, Gallery, Team, Logos) currently renders cards floating with no context. Add:

```tsx
{section.content?.heading && (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold" style={{ color: section.style.color }}>
      {section.content.heading}
    </h2>
    {section.content?.subheading && (
      <p className="text-lg mt-3 opacity-70" style={{ color: section.style.color }}>
        {section.content.subheading}
      </p>
    )}
  </div>
)}
```

Add `heading` and `subheading` to every grid section's default content in theme JSONs and example JSONs. Examples: "What We Offer", "What Our Clients Say", "Frequently Asked Questions", "By The Numbers".

### 2.2 Resting Shadows on Cards (+1 point)

Every card component needs `shadow-sm` as base state with `hover:shadow-lg hover:-translate-y-1 transition-all duration-200`. Currently cards jump from zero shadow to `hover:shadow-xl` which is jarring. The resting shadow adds depth and professionalism.

### 2.3 Scroll-Triggered Entrance Animations (+3 points)

Create a `useScrollReveal` hook using IntersectionObserver:

```tsx
function useScrollReveal(ref: RefObject<HTMLElement>, options = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
}
```

Apply to every section in RealityTab. Stagger card animations with `animation-delay` (each card 100ms after the previous). This makes scrolling through the preview feel alive, not static.

**Respect `prefers-reduced-motion`:** If the user has reduced motion enabled, skip all entrance animations.

### 2.4 Replace SaaS Default Text with Neutral Placeholders (+2 points)

Every `DEFAULT_` array in templates currently has SaaS jargon: "Lightning Fast", "Pixel Perfect", "Enterprise-grade security". Replace with neutral text:

| Current | Replace With |
|---------|-------------|
| "Lightning Fast" | "Your First Feature" |
| "Pixel Perfect" | "Your Second Feature" |
| "Always Secure" / "Enterprise Ready" | "Your Third Feature" |
| "Go from idea to deployed in 60 seconds" | "Describe what makes this special" |

### 2.5 Micro-Interaction Polish (+2 points)

- **Button hover:** All buttons get `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
- **Toggle switches:** Add `transition-transform duration-200` for smooth sliding
- **Tab switches:** 200ms crossfade between tab content (Builder/Chat/Listen, SIMPLE/EXPERT, center tabs)
- **Section selection:** Selected section in left panel gets a smooth `transition-colors duration-150`
- **Dark/Light mode toggle:** All color transitions get `transition-colors duration-300` for smooth mode switch

---

## 3. AISP SPEC OUTPUT (Score Impact: +5-7 Points — Answers "What's the Output?")

### 3.1 XAI DOCS Tab: Two Sub-Views

**HUMAN View** — Generates a structured specification document from the current JSON:

```markdown
# Hey Bradley Specification: Sweet Spot Bakery

## North Star
**Vision:** A warm, welcoming bakery website that showcases handcrafted pastries.
**Theme:** Wellness (light mode)
**Font:** DM Sans
**Palette:** Cream backgrounds, warm brown text, coral accents

## Page Structure
1. **Top Menu** — Logo: "Sweet Spot Bakery" | Links: Features, Quotes, Action | CTA: "Order Now"
2. **Hero** — Layout: Split Right | Headline: "Handcrafted With Love Since 2019" | Image: bakery storefront
3. **Columns** (3-col) — Three specialties: Artisan Cookies, Fresh Pastries, Custom Cakes
4. **Quotes** — 3 customer testimonials with photos
5. **Action** — "Ready to Order?" with "Order Now" CTA
6. **Footer** — Contact info, hours, social links

## Build Instructions
For each section, use the specified variant and content.
Total sections: 6 | Estimated build time: 15 minutes with AI agent
```

**AISP View** — Generates `@aisp` formatted specification:

```aisp
@aisp 1.2
@page index
@version 1.0.0

@site "Sweet Spot Bakery" {
  @description "A warm bakery website showcasing handcrafted pastries"
  @theme wellness
  @mode light
  @palette cream
  @font "DM Sans"
}

@section hero hero-01 {
  @variant split-right
  @heading "Handcrafted With Love Since 2019"
  @subheading "Fresh pastries baked daily in our Toronto kitchen"
  @cta "Order Now" -> #order
  @image "bakery-storefront.jpg" position:right
}

@section columns features-01 {
  @variant image-cards
  @columns 3
  @heading "Our Specialties"
  @items [
    { title: "Artisan Cookies", image: "cookies.jpg", desc: "..." }
    { title: "Fresh Pastries", image: "pastries.jpg", desc: "..." }
    { title: "Custom Cakes", image: "cakes.jpg", desc: "..." }
  ]
}
```

### 3.2 Implementation

The XAI DOCS tab already exists with HUMAN and AISP sub-tabs. Wire them to:

1. Read `configStore.getState().config` on every render
2. For HUMAN: Transform the JSON into the structured markdown format above
3. For AISP: Transform the JSON into `@aisp` formatted text
4. Both update live when the JSON changes (the user edits a headline → the spec updates)
5. Copy to Clipboard button copies the full spec text
6. Export button downloads as `.md` (HUMAN) or `.aisp` (AISP)

**This is the answer to "what's the output?"** — Hey Bradley produces specifications that any AI coding agent (Claude Code, Cursor, etc.) can use to reproduce the site. The JSON is the machine format. The AISP spec is the human-readable format. The HUMAN doc is the plain-English format.

---

## 4. CANNED DEMO SIMULATION (Score Impact: +3-5 Points — Wow Factor)

### 4.1 Example Websites (3 More Needed)

Currently only `bakery.json` exists. Add:

| Example | Theme | Sections | Copy Tone |
|---------|-------|----------|-----------|
| `launchpad-ai.json` | SaaS (dark) | Hero, Columns, Pricing, Quotes, Action, Footer | Technical but accessible |
| `sarah-chen-photography.json` | Portfolio (overlay) | Hero, Gallery, Quotes, Action, Footer | Artistic, minimal |
| `greenleaf-consulting.json` | Professional (light) | Hero, Numbers, Columns, Quotes, Action, Footer | Corporate, trustworthy |

Each must have real copy (not placeholder), real Unsplash image URLs, and 5-7 sections with appropriate variants.

### 4.2 Demo Simulator

`src/lib/demoSimulator.ts` — orchestrates a timed sequence:

```
[0s]   Apply theme
[1s]   Caption: "picking the right style..."
[2s]   Hero section appears with fade-in
[3s]   Caption: "adding your content..."
[4s]   Columns section appears
[5s]   Caption: "some social proof..."
[6s]   Quotes section appears
[7s]   Caption: "and a way to take action..."
[8s]   Action section appears
[9s]   Caption: "your site is ready ✓"
[10s]  Auto-switch to Builder tab
```

Wire to:
- **Chat tab:** Quick-demo buttons ("🍪 Build a Bakery", "🚀 Build a Startup", etc.)
- **Listen tab:** "Watch a Demo" button triggers the simulation with orb pulse sync

### 4.3 Listen Mode Polish

The orb is the demo centerpiece. Polish:
- Orb idle: 3s pulse, soft glow, subtle drift
- Orb during simulation: pulse accelerates to 0.5s, glow intensifies, captions appear below
- Orb after simulation: slow return to idle with "ready ✓" caption
- **The orb must look cinematic**, not like a CSS circle. Three-layer construction: solid core + blurred mid-ring + ambient glow. Reference Apple Siri's glow.

---

## 5. ADDITIONAL POLISH ITEMS

### 5.1 "More Sections" Button Visibility

The current "More Sections" text link is invisible. Replace with a visible button:
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│  + Add New Section              │  ← Dashed border, full width, crimson text
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### 5.2 Type-Appropriate Section Spacing

Not every section needs `py-16`. Use a spacing map:

| Section Type | Padding |
|-------------|---------|
| Hero | `py-20 md:py-32` (generous — it's the first thing you see) |
| Columns, Gallery, Team | `py-16 md:py-24` (standard) |
| Quotes | `py-12 md:py-20` (slightly tighter) |
| Numbers | `py-12 md:py-16` (compact — stats don't need much space) |
| Action | `py-16 md:py-24` (standard — needs breathing room for CTA) |
| Divider | `py-4 md:py-8` (minimal) |
| Footer | `py-8 md:py-12` (compact) |

### 5.3 ImagePicker Integration for Team + Logo Cloud

Currently these editors only have URL paste. Wire the ImagePicker dialog (already built for Hero) into Team member editor and Logo Cloud editor. Click the image thumbnail → ImagePicker opens → select → URL populates.

---

## 6. SWARM EXECUTION ORDER

```
STEP 1: Research (1 agent, mandatory)
├── Agency polish research → docs/research/agency-polish-research.md
├── AISP output research → docs/research/aisp-output-research.md
├── ADRs 026-028
└── Frontend-design skill review

STEP 2: Visual Polish (3 agents, parallel)
├── Agent A: Section headings + resting shadows + neutral defaults
├── Agent B: Scroll-triggered entrance animations (useScrollReveal hook)
└── Agent C: Micro-interactions (button hover, tab transitions, mode switch)

STEP 3: AISP Spec Output (2 agents)
├── Agent A: HUMAN view generator (JSON → structured markdown)
└── Agent B: AISP view generator (JSON → @aisp format)

STEP 4: Canned Demo (2 agents)
├── Agent A: 3 example JSONs + demo simulator
└── Agent B: Listen mode orb polish + chat quick-demo buttons

STEP 5: Final Polish (1 agent)
├── ImagePicker for Team/Logos
├── "Add Section" button visibility
├── Type-appropriate spacing
├── Full Playwright screenshot pass (all sections × 2 modes)

STEP 6: Re-Score (1 agent)
├── Run the 4-persona review again
├── Target: 80+
└── If < 75, identify top 3 fixes and do one more iteration
```

---

## 7. VERIFICATION

| # | Check | Target |
|---|-------|--------|
| 1 | Section headings render above all grid sections | All 6 grid types |
| 2 | Cards have `shadow-sm` resting state | All card templates |
| 3 | Scroll animations fire on section enter | IntersectionObserver working |
| 4 | `prefers-reduced-motion` disables animations | a11y compliance |
| 5 | XAI DOCS HUMAN view generates spec from current JSON | Live updates |
| 6 | XAI DOCS AISP view generates @aisp format | Live updates |
| 7 | Copy/Export buttons work on both views | Downloads .md / .aisp |
| 8 | 4 example websites loadable | Bakery + 3 new |
| 9 | Demo simulation plays 10-second sequence | Typewriter + section reveals |
| 10 | Listen orb has 3-layer cinematic quality | Visual wow |
| 11 | All default text is neutral (no SaaS jargon) | Grandma-safe |
| 12 | Persona re-score ≥ 75 | 4-persona average |

---

## 8. WHAT PHASE 6 DOES NOT DO

| Not This | Why |
|----------|-----|
| HTML export | This is a React app — the output is AISP specs, not HTML |
| Real LLM integration | Simulation is sufficient for capstone demo |
| Real voice/STT | Simulation with scripted text |
| Supabase auth | Client-side localStorage until post-capstone |
| Image upload | ImagePicker with curated library is sufficient |
| More section types beyond 15 | Enough variety — polish > quantity |
| Expert tab content | Deferred to post-capstone |

---

*The product has 15 sections and 47 variants. It doesn't need more features. It needs micro-interactions that make it feel alive, AISP specs that make the "output" question answerable, and a canned demo simulation that makes a professor say "wow." Polish the diamond, don't mine more rock.*
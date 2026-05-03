# Phase 6 Loop 1 -- Brutal Honest Review

**Date:** 2026-04-02
**Previous scores:** 52 -> 54 -> 65 -> 67
**Target:** 80+

---

## What Was Added This Loop

1. **Section headings** (`content.heading` / `content.subheading`) on 31 template variants
2. **Scroll reveal** (`useScrollReveal.ts`) on SectionWrapper in builder mode
3. **Card stagger animation** (`animate-card-reveal` / `cardReveal` keyframe) on 5 templates
4. **Preview-mode cascade** (`animate-fade-in-up` / `fadeInUp` keyframe) for section entrance
5. **Button micro-interactions** (`hover:scale-[1.02] active:scale-[0.98]`) on `button.tsx`
6. **Crystal Atom Platinum AISP** output in `XAIDocsTab.tsx`
7. **Glass variant** (`ColumnsGlass.tsx`) with ambient blur blobs

---

## Persona Scores

### 1. Agency Designer -- 62/100 (was 58)

**What improved:**
- Section headings give structure. A page with hero + columns + quotes + action now reads as intentional sections rather than stacked blocks.
- Card stagger animations (100ms delay per card) are a nice touch -- subtle, not overdone.
- Glass variant with backdrop-blur blobs is a genuine agency pattern (Vercel, Linear ship these).
- Button micro-interactions (`scale 1.02/0.98`) are correct and tasteful.

**What still needs work:**
- **Only 5 of 31+ templates have stagger animations.** ColumnsImageCards, ColumnsGlass, ColumnsGradient, ColumnsHorizontal, ColumnsNumbered, ColumnsMinimal, ColumnsIconText -- none have card-reveal. The inconsistency is worse than having none at all. An agency designer clicking between variants will see animation disappear.
- **No section transition variety.** Every section uses the same `translateY(20px) -> 0` reveal. Agency sites use different entrances per section type: counters count up, images scale from 0.95, text fades horizontally. One animation repeated 8 times feels robotic.
- **Heading + subheading are plain text.** No accent line, no gradient text, no pill/tag above the heading. Compare to any Framer template -- they all have a decorative element above the section title (a colored line, a category pill, an icon). The headings look unfinished.
- **No scroll-linked parallax or depth.** The `useScrollReveal` fires once and stops. No continuous scroll effects. This makes the page feel static after the initial reveal.
- **Default config ships with features-01 DISABLED.** The user's first experience shows zero section headings. They must add a columns section or load bakery to even see headings working. This is a critical oversight -- your best new feature is invisible on first load.

---

### 2. Grandma (Non-Technical User) -- 64/100 (was 60)

**What improved:**
- Section headings like "What We Offer" and "What People Say" (bakery example) give the page readable structure. Grandma can now understand the page flow.
- Scroll animations make the page feel alive without being confusing.
- The bakery example is genuinely good content -- real-sounding bakery, real headings, real testimonials.

**What still needs work:**
- **Default config is still dev-facing.** Title is "Hey Bradley", hero says "Your Amazing Website Starts Here" -- this is placeholder copy. When Grandma opens the builder, she sees a demo of the tool, not a demo of what she could build. The default should be a real-looking small business site (like bakery) so she thinks "I could change this to MY business."
- **No visible affordance for section headings.** There is no UI in the builder right panel to edit `content.heading` / `content.subheading`. Grandma cannot change "What We Offer" without editing JSON. If the heading field is not in the right panel editor, it is decoration, not a feature.
- **The AISP tab is incomprehensible.** Crystal Atom notation with Greek letters is the opposite of grandma-friendly. The "Human" tab is fine, but the AISP tab should be hidden or labeled "Developer / AI" to avoid confusion.
- **Builder is still intimidating.** The section list in the left panel shows raw type names and variant slugs. She does not know what "columns / image-cards" means.

---

### 3. Startup Founder -- 66/100 (was 62)

**What improved:**
- The AISP spec output is genuinely impressive as a differentiator. Copy-paste a Crystal Atom spec into Claude/GPT and it could theoretically rebuild the site. This answers "what do I get" with something no competitor offers.
- Human spec mode is clear, structured, and downloadable as `.md`. A founder could share this with their developer.
- Section headings make the preview look like a real marketing page rather than a wireframe.

**What still needs work:**
- **The AISP syntax highlighting is broken.** The `AISPHighlighted` component parses `@keyword` patterns, but the actual AISP output uses `Omega :=` / `Sigma :=` notation with no `@` symbols. The highlighting code matches nothing. The entire AISP view renders as monochrome gray (`text-hb-text-secondary`). A startup founder sees a wall of gray symbols.
- **No "one-click publish" or export story.** The spec is downloadable but there is no "Export as HTML" or "Deploy" button. A founder asks "great, now what?" and there is no answer yet.
- **Bakery example headings say "What We Offer" and "Everything you need to succeed."** These are generic SaaS headings on a bakery site. The content should match the vertical: "Fresh From Our Oven" / "Handcrafted every morning."
- **Default page has only 3 sections** (menu, hero, CTA) because features-01 is disabled. A founder sees a hero and a footer. Not enough to evaluate the platform.

---

### 4. Harvard Professor -- 68/100 (was 64)

**What improved:**
- Crystal Atom Platinum AISP (`XAIDocsTab.tsx` lines 131-180) is academically interesting. The 5-part structure (Omega/Sigma/Gamma/Lambda/Epsilon) maps to (Intent, Schema, Rules, Bindings, Verification). This is a legitimate formal specification approach.
- The verification block (`Epsilon`) includes contrast ratios and responsive checks -- this shows understanding of web accessibility as formal constraints.
- The dual-mode (Human + AISP) output demonstrates the protocol's value proposition clearly.

**What still needs work:**
- **The AISP output is NOT actually Platinum tier.** Platinum requires <2% ambiguity. But the current output has: (a) no temporal operators defined (`Box` is used but never declared), (b) type constructors use informal notation (`Map<S,S>` mixes angle brackets with blackboard bold), (c) component IDs are truncated at 30 chars with no ellipsis indicator, (d) the `sections` array uses unlabeled tuples -- position-dependent semantics violate the named-field principle. This is Silver/Gold at best.
- **No formal grammar specification.** The AISP output claims a type system but provides no BNF or EBNF grammar. A professor would ask "where is the formal syntax definition?"
- **The Crystal Atom bracket notation is cosmetic.** The opening `⟦` and closing `⟧` delimiters are used but there is no parser, no validator, no round-trip guarantee. It is pretty-printed JSON in Unicode clothing.
- **No citation or reference to the AISP specification.** The spec version is `aisp-1.2` in the config but the output does not reference it. A capstone should cite its own protocol.
- **Section heading content is hardcoded in example JSONs.** There is no AI/LLM-generated heading suggestion. For a platform called "Hey Bradley" that is voice-first, the headings should adapt to the content or offer AI-generated alternatives.

---

## Composite Score: 65/100

| Persona | Previous | Current | Delta |
|---------|----------|---------|-------|
| Agency Designer | 58 | 62 | +4 |
| Grandma | 60 | 64 | +4 |
| Startup Founder | 62 | 66 | +4 |
| Harvard Professor | 64 | 68 | +4 |
| **Average** | **61** | **65** | **+4** |

Honest assessment: the improvements are real but shallow. Headings and animations are table-stakes features that were missing before. The score moved from "incomplete" to "baseline functional." To reach 80+, the platform needs to feel FINISHED, not just PRESENT.

---

## Top 5 Fixes to Push Score Highest

### Fix 1: Enable features section in default config + add content headings to ALL enabled sections (Impact: +6 points)

**Problem:** Default config ships with `features-01` disabled and only the CTA section has content. First-time users see no section headings, no columns, no quotes. The page is hero + CTA + nothing.

**Files:**
- `/workspaces/hey-bradley-core/src/data/default-config.json`

**Changes:**
1. Set `features-01.enabled` to `true` (line 202)
2. Add `"content": { "heading": "...", "subheading": "..." }` to the `hero-01` section (after line 196)
3. Add `"content": { "heading": "...", "subheading": "..." }` to the `cta-01` section (after line 305)
4. Add a quotes section and a numbers section to the default config so the default page has 6 sections (menu, hero, features, quotes, numbers, CTA/footer) -- matching bakery's richness
5. Update features-01 `"content"` headings from generic "What We Offer" to something specific to the default SaaS theme

Also fix bakery.json headings to match the bakery vertical:
- `/workspaces/hey-bradley-core/src/data/examples/bakery.json`
  - Line 254: Change `"heading": "What We Offer"` to `"heading": "Fresh From Our Oven"`
  - Line 255: Change `"subheading": "Everything you need to succeed"` to `"subheading": "Handcrafted every morning with locally sourced ingredients"`

### Fix 2: Add stagger animation to ALL remaining card-based templates (Impact: +5 points)

**Problem:** Only 5 of 31 templates have `animate-card-reveal`. The inconsistency is jarring when switching variants.

**Files (each needs `opacity-0 animate-card-reveal` + `style={{ animationDelay: ... }}` on the card div):**
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsImageCards.tsx` -- line 57, add to the outer card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGlass.tsx` -- line 57, add to the card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGradient.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsHorizontal.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsNumbered.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsMinimal.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/columns/ColumnsIconText.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/quotes/QuotesStars.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/quotes/QuotesMinimal.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/quotes/QuotesSingle.tsx` -- main quote div
- `/workspaces/hey-bradley-core/src/templates/numbers/NumbersGradient.tsx` -- card div (line 55)
- `/workspaces/hey-bradley-core/src/templates/numbers/NumbersIcons.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/numbers/NumbersCards.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/team/TeamGrid.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/team/TeamMinimal.tsx` -- card div
- `/workspaces/hey-bradley-core/src/templates/gallery/GalleryMasonry.tsx` -- image div
- `/workspaces/hey-bradley-core/src/templates/gallery/GalleryCarousel.tsx` -- slide div
- `/workspaces/hey-bradley-core/src/templates/gallery/GalleryFullWidth.tsx` -- image div
- `/workspaces/hey-bradley-core/src/templates/logos/LogosSimple.tsx` -- logo items
- `/workspaces/hey-bradley-core/src/templates/logos/LogosGrid.tsx` -- logo items

Pattern: on each card's outer div, add `opacity-0 animate-card-reveal` to className and add `style={{ animationDelay: \`${idx * 100}ms\` }}`.

### Fix 3: Fix AISP syntax highlighting + add AISP version reference (Impact: +4 points)

**Problem:** The `AISPHighlighted` component (lines 292-356) parses `@keyword` patterns but the AISP output uses Greek letters (`Omega :=`, `Sigma :=`). Nothing highlights. The entire view is monochrome.

**File:** `/workspaces/hey-bradley-core/src/components/center-canvas/XAIDocsTab.tsx`

**Changes to `AISPHighlighted` (lines 292-356):**
1. Add pattern matching for Greek symbol lines: match `^\s*([\u03A9\u03A3\u0393\u039B\u0395])\s*:=\s*(.*)$` and color the symbol with `text-hb-accent` and the rest with `text-hb-success`
2. Add pattern matching for rule labels: match `^\s*(R\d+|V\d+):` and color the label
3. Add pattern matching for type declarations: match `(\w+)\s*:\s*([\u1D54B\u1D54A\u1D53B\u1D543\u2115])` (the blackboard bold types) and color them distinctly
4. Add pattern matching for Crystal Atom delimiters: `⟦` and `⟧` in accent color
5. Color `:=` as an operator in a distinct muted color

**Changes to `generateAISPSpec` (lines 131-180):**
1. Add a header comment line: `% AISP v1.2 | Crystal Atom Platinum | <2% ambiguity target`
2. Define the temporal operator: add `□ := "always/invariant"` in the Sigma block
3. Add an AISP version footer: `% Generated by Hey Bradley | spec: aisp-1.2 | tier: platinum`

### Fix 4: Add decorative accent element above section headings (Impact: +3 points)

**Problem:** Section headings are plain `h2` + `p`. Every agency template (Framer, Webflow showcases) has a small decorative element above the section heading -- a colored line, a category pill, or an icon. Without this, headings look like unstyled text.

**Files:** All 31 templates that have the heading block. The pattern is the same in each file. Here is the change for the shared heading block:

Replace the current heading block pattern:
```tsx
{(section.content as any)?.heading && (
  <div className="text-center mb-12 max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
      {(section.content as any).heading}
    </h2>
```

With:
```tsx
{(section.content as any)?.heading && (
  <div className="text-center mb-12 max-w-3xl mx-auto">
    <div className="inline-block w-10 h-1 rounded-full mb-4" style={{ background: 'var(--theme-accent, #6366f1)' }} />
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
      {(section.content as any).heading}
    </h2>
```

This adds a small colored bar above every section heading. Minimal code, maximum visual impact.

**Recommendation:** Extract the heading block into a shared `SectionHeading` component at `/workspaces/hey-bradley-core/src/templates/_shared/SectionHeading.tsx` to avoid duplicating the pattern 31 times and to enable future variants (pill, icon, gradient text).

### Fix 5: Add right-panel UI for editing section heading + subheading (Impact: +4 points)

**Problem:** Section headings exist in the data model and render in templates, but there is no UI to edit them. Users must edit JSON directly. This makes the feature invisible to non-technical users.

**Files to investigate and modify:**
- Find the right-panel section editor component (likely in `/workspaces/hey-bradley-core/src/components/right-panel/`)
- Add two text input fields: "Section Heading" and "Section Subheading" that read/write `section.content.heading` and `section.content.subheading`
- These should appear at the top of the section editor, before variant/layout controls
- When empty, show placeholder text: "Add a section heading..." to hint at the capability

**Store change needed:**
- The config store (`/workspaces/hey-bradley-core/src/store/configStore.ts`) needs a `updateSectionContent(sectionId: string, content: Record<string, unknown>)` action if one does not already exist

---

## Priority Order

| Priority | Fix | Effort | Impact |
|----------|-----|--------|--------|
| 1 | Fix 1: Enable default sections + real content | 30 min | +6 pts |
| 2 | Fix 2: Stagger animation on all templates | 45 min | +5 pts |
| 3 | Fix 5: Right-panel heading editor UI | 60 min | +4 pts |
| 4 | Fix 3: AISP syntax highlighting | 45 min | +4 pts |
| 5 | Fix 4: Decorative accent above headings | 30 min | +3 pts |

**Projected score after all 5 fixes: 65 + 22 = ~82-85/100** (with diminishing returns and integration risk, realistic target is 78-82).

---

## Patterns to Watch

- **The `(section.content as any)` cast appears 62+ times.** This needs a proper type. Add `content?: { heading?: string; subheading?: string }` to the Section schema.
- **`useScrollReveal` only fires once.** Consider adding a `useScrollParallax` for continuous effects on hero sections.
- **Glass variant blobs use hardcoded colors** (`purple-500/20`, `blue-500/15`, `indigo-500/10`). These should use `var(--theme-accent)` with opacity.
- **No `prefers-reduced-motion` check on `animate-card-reveal`.** The CSS keyframe animation will play even for users who have reduced motion enabled. The `index.css` rule at line 69-75 sets `animation-duration: 0.01ms` which helps, but `opacity-0` as initial state means cards may stay invisible. Need `animation-fill-mode: forwards` (already via `forwards` in keyframe def) AND the reduced-motion rule should set `opacity: 1` on `.animate-card-reveal`.

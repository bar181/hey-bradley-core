Phase 11 closed at 83/100, new session started with Phase 12. Here's the swarm instruction addressing your feedback:

---

**SWARM: Before starting Phase 12 features, fix these 3 regressions from the tab cleanup.**

**Fix 1: Restore the JSON/Data tab (P0, 30 min)**

The Phase 10 UX cleanup hid the Data tab in SIMPLE mode. This was correct for grandma — but developers need it. The fix:

- In SIMPLE mode: show Preview and Blueprints only (current behavior — correct)
- In EXPERT mode: show Preview, Blueprints, Data, AND Workflow (restore both)
- The Data tab shows the raw JSON config with CodeMirror editor. This is essential for developers who want to inspect or manually edit the JSON. Never remove it entirely.

**Fix 2: Restore the Workflow/Pipeline tab (P0, 30 min)**

The Workflow tab was hidden in the tab cleanup. Restore it in EXPERT mode. For the current state (React marketing sites), the workflow should show a simple user story flow:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────┐
│  Visitor     │ →  │  Landing     │ →  │  Sections   │ →  │  Action  │
│  Arrives     │    │  (Hero)      │    │  (Content)  │    │  (CTA)   │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────┘
```

No data flow diagrams. No backend architecture. Just: visitor arrives → sees hero → reads content sections → takes action (CTA). This is the user story for every marketing site Hey Bradley builds. The workflow tab should render this from the current config — showing the actual enabled sections in order.

**Fix 3: Confirm Blueprints tab structure (P0, 15 min)**

The Blueprints tab (renamed from Specs) should show ALL pillar documents:
- North Star
- Architecture (SADD)
- Build Plan (Implementation)
- Features
- Human Spec
- AISP Spec

All 6 must be visible and generating. In a future phase we'll reduce to 3 (North Star, SADD, Implementation Plan), but NOT now — all 6 stay for the capstone demo and the reproduction test.

**After these 3 fixes are confirmed: proceed to Phase 12 sprints.**

---

## Phase 12 Scope (Updated)

The swarm's Phase 12 plan is missing the content intelligence features you described. Here's the corrected scope:

**Sprint 1: Site Context System (P0, 4 hours) — THE CORE PHASE 12 FEATURE**

This is the major addition: brand guidelines, tone, audience, and purpose. These feed into ALL spec generators and shape the content.

**1a. Site Context JSON (new template)**

Add a new `siteContext` section to the MasterConfig:

```typescript
interface SiteContext {
  purpose: "marketing" | "portfolio" | "saas" | "blog" | "agency" | "restaurant" | "ecommerce";
  audience: "consumer" | "business" | "developer" | "enterprise" | "creative";
  tone: "formal" | "casual" | "playful" | "technical" | "warm" | "bold";
  contentGuidelines: {
    maxWordsPerSection: number;  // e.g., 300 for blogs, 150 for marketing
    visualDensity: "minimal" | "balanced" | "rich";
    ctaStyle: "subtle" | "prominent" | "aggressive";
  };
  brandGuidelines: {
    brandName: string;
    tagline: string;
    voiceAttributes: string[];  // e.g., ["trustworthy", "innovative", "approachable"]
    doNotUse: string[];         // e.g., ["cheap", "basic", "simple"]
  };
}
```

**1b. Site Context Editor in Right Panel**

When no section is selected (or a new "Site Settings" item is clicked in the left panel), the right panel SIMPLE tab shows:

```
YOUR SITE

PURPOSE
[Marketing] [Portfolio] [SaaS] [Blog] [Agency] [Restaurant]

AUDIENCE  
[Consumer] [Business] [Developer] [Enterprise]

TONE
[Formal] [Casual] [Playful] [Technical] [Warm] [Bold]

BRAND
Brand Name: ___________
Tagline: ___________
Voice: [Trustworthy] [Innovative] [Approachable] + custom
```

Each is a button group (like the light/dark toggle). Click to select. The selection immediately updates the JSON config and feeds into spec generation.

**1c. Specs reflect site context**

The North Star generator should use purpose + audience to set the vision. The Build Plan should use tone + content guidelines to suggest copy length and CTA style. The AISP Crystal Atom should encode these as Λ bindings:

```aisp
Λ := { purpose:="saas", audience:="developer", tone:="technical",
       maxWords:=150, ctaStyle:="prominent",
       brand:="LaunchPad AI", voice:=["innovative","technical","bold"] }
```

**Sprint 2: New examples per audience/purpose (P1, 2 hours)**

Add 2-3 new examples that demonstrate different tone/audience combinations:
- Fun blog (casual tone, consumer audience, rich visuals, <300 words per section)
- Developer portfolio (technical tone, developer audience, minimal visuals)
- Enterprise SaaS (formal tone, enterprise audience, prominent CTAs)

Each example has the siteContext fields filled in, showing how the same builder produces different content styles.

**Sprint 3: Enhanced simulations (P1, 1.5 hours)**

Add new chat commands: "make it professional", "target developers", "set tone to playful", "this is for enterprise clients." Add new listen demo that shows: "Build me a casual food blog with lots of photos" → sets tone=casual, purpose=blog, audience=consumer, visualDensity=rich → loads a blog-style example.

**Sprint 4: Theme wizard + quality pass (P1, 2 hours)**

Guided theme selection that considers the site context: "You selected 'SaaS' for developers. We recommend: Tech Business, SaaS, or Minimalist themes." Not a hard restriction — just a smart suggestion.

Plus: run all tests (target 80+), performance check, Vercel verification.

**Sprint 5: Phase close (1 hour)**

Retrospective, wiki update, logs, preflight for Phase 13, update CLAUDE.md and README.md, grounding report for next session.

---

**The site context system is the biggest single feature since the spec generators.** It transforms Hey Bradley from "a website builder that generates specs" into "a system that understands what KIND of site you're building and tailors everything accordingly." A fun blog gets different specs, different content length, different CTA style, and different tone than a Fortune 500 SaaS product page. This is the intelligence layer that makes the specs genuinely useful for different audiences.

**SWARM: Fix the 3 tab regressions FIRST (15-30 min each). Then execute Sprint 1 (site context system). This is the Phase 12 priority.**

---

# Phase 12 — Updated Swarm Instruction

**Additions from human review:**
1. Restore Data tab (JSON editor) in EXPERT mode
2. Restore Workflow tab in EXPERT mode (simple user story flow)
3. Confirm Blueprints tab shows all 6 pillar documents
4. Image effects suite — from original requirements (Doc 29, Phase 8 Sprint 3)

---

## PRIORITY 0: Tab Restoration (Before Any New Features)

### Restore Data Tab (EXPERT mode only)
The Phase 10 UX cleanup hid the Data tab. Restore it:
- SIMPLE mode: Preview + Blueprints only
- EXPERT mode: Preview + Blueprints + Data + Workflow

The Data tab shows the raw JSON config with CodeMirror editor. Essential for developers.

### Restore Workflow Tab (EXPERT mode only)
Simple user story flow for React marketing sites:

```
Visitor Arrives → Hero (First Impression) → Content Sections → Action (CTA) → Footer
```

Render this from the current config — show the actual enabled sections in order as a horizontal flow diagram. No backend architecture. No data flow. Just: what does the visitor see, in what order?

### Confirm Blueprints Structure
All 6 sub-tabs must be visible and generating:
- North Star
- Architecture (SADD)
- Build Plan (Implementation)
- Features
- Human Spec
- AISP Spec

---

## PRIORITY 1: Image Effects Suite (Original Requirements)

**Source:** Document 29 (Comprehensive Roadmap), Phase 8 T8 specification.

The original requirements specified 8 image effects. Some were implemented in Phase 8, but need verification and completion. The swarm must:

### Step 1: Audit what exists

Check `src/data/media/effects.json` and `index.css` for existing effect implementations. The Phase 8 compacted summary says "8 CSS effects (Ken Burns, slow pan, zoom hover, parallax, gradient overlay, glass blur, grayscale-hover, vignette)" were completed. VERIFY each one actually works by:

1. Loading Kitchen Sink example
2. Opening ImagePicker on a hero section
3. Applying each effect
4. Confirming the CSS animation renders in preview

### Step 2: Fix or complete any missing effects

These are the 8 required effects from the original spec:

| # | Effect | CSS Implementation | Behavior |
|---|--------|-------------------|----------|
| 1 | **Ken Burns** | `@keyframes ken-burns { from { transform: scale(1) } to { transform: scale(1.15) } }` duration 20s infinite | Slow zoom in on image, creates cinematic movement |
| 2 | **Slow Pan** | `@keyframes slow-pan { from { transform: translateX(0) } to { transform: translateX(-10%) } }` duration 25s infinite | Slow horizontal pan across image |
| 3 | **Zoom on Hover** | `hover:scale-110 transition-transform duration-500` | Image scales up smoothly on mouse hover |
| 4 | **Click to Enlarge / Lightbox** | Modal overlay with full-resolution image, click outside to close, ESC to close | User clicks image → sees full-size version in modal overlay |
| 5 | **Gradient Transparency** | `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))` as overlay | Dark gradient fading up from bottom of image |
| 6 | **Parallax Scroll** | `background-attachment: fixed` or IntersectionObserver-based | Background image moves slower than foreground content on scroll |
| 7 | **Glass Blur** | `backdrop-filter: blur(12px)` with semi-transparent overlay | Frosted glass effect over part of image |
| 8 | **Grayscale to Color** | `grayscale hover:grayscale-0 transition-all duration-500` | Image is grayscale, transitions to full color on hover |

**Additional effects to consider (bonus):**
| # | Effect | CSS Implementation | Behavior |
|---|--------|-------------------|----------|
| 9 | **Vignette** | `radial-gradient(ellipse, transparent 50%, rgba(0,0,0,0.5))` as overlay | Dark edges, light center — classic photo effect |
| 10 | **Fade In on Scroll** | IntersectionObserver + `opacity 0 → 1 transition` | Image fades in as user scrolls to it |
| 11 | **Tilt on Hover** | `transform: perspective(1000px) rotateY(5deg)` on hover | Subtle 3D tilt effect on mouse hover |

### Step 3: Wire effects to ImagePicker

The ImagePicker component must have an **Effect Selector** panel:

```
IMAGE EFFECT
[None] [Ken Burns] [Slow Pan] [Zoom Hover]
[Click Enlarge] [Gradient] [Parallax] [Glass Blur]
[Grayscale] [Vignette]

PREVIEW: [selected image with selected effect applied]
```

Each effect is stored in the section JSON as `style.imageEffect: "ken-burns" | "slow-pan" | "zoom-hover" | ...`

The template renderers must read this value and apply the corresponding CSS class to the image container.

### Step 4: Verify in Kitchen Sink

The Kitchen Sink example must demonstrate at least 5 different effects across different sections:
- Hero: Ken Burns on background image
- Gallery: Zoom on Hover on thumbnails
- Columns (Image Cards): Grayscale to Color on card images
- Action: Gradient Transparency on background image
- Image section: Parallax scroll

### Step 5: Click to Enlarge (Lightbox)

This is the one effect that requires a new component, not just CSS:

```tsx
// LightboxModal.tsx
// Click any image with effect="click-enlarge" → full-screen overlay
// - Dark backdrop (rgba(0,0,0,0.85))
// - Image centered at max resolution (object-fit: contain)
// - Click outside or press ESC to close
// - Optional: left/right arrows for gallery navigation
```

Wire this to: Gallery section (all variants), Image section, any hero with `imageEffect: "click-enlarge"`.

---

## PRIORITY 2: Site Context System (New Feature)

[As specified in previous Phase 12 instruction — tone, audience, purpose, brand guidelines]

---

## PRIORITY 3: Enhanced Simulations

[As specified in previous Phase 12 instruction — new chat commands for tone/audience, new listen demos]

---

## PRIORITY 4: Quality Pass + Phase Close

- All 71+ tests passing + 5-10 new tests for effects and tab restoration
- Persona review targeting Agentic Engineer 75+
- Vercel deployment green
- Full retrospective, wiki update, CLAUDE.md update, README update
- Grounding report for Phase 13

---

## Execution Order

```
1. Tab restoration (Data, Workflow, confirm Blueprints)     — 1 hour
2. Image effects audit + completion                          — 2-3 hours  
3. Click to Enlarge lightbox component                       — 1 hour
4. Kitchen Sink example update with effects                  — 30 min
5. Site Context system (tone/audience/purpose)               — 3-4 hours
6. Enhanced simulations                                      — 1.5 hours
7. Quality pass + phase close                                — 1.5 hours
```

**Total Phase 12 estimate: ~12-14 hours of swarm time**

**SWARM: Start with tab restoration (#1), then image effects audit (#2). These are the original requirements that were specified but not fully verified.**

---

# Phase 12 — Updated Swarm Instruction

**Additions from human review:**
1. Restore Data tab (JSON editor) in EXPERT mode
2. Restore Workflow tab in EXPERT mode (simple user story flow)
3. Confirm Blueprints tab shows all 6 pillar documents
4. Image effects suite — from original requirements (Doc 29, Phase 8 Sprint 3)

---

## PRIORITY 0: Tab Restoration (Before Any New Features)

### Restore Data Tab (EXPERT mode only)
The Phase 10 UX cleanup hid the Data tab. Restore it:
- SIMPLE mode: Preview + Blueprints only
- EXPERT mode: Preview + Blueprints + Data + Workflow

The Data tab shows the raw JSON config with CodeMirror editor. Essential for developers.

### Restore Workflow Tab (EXPERT mode only)
Simple user story flow for React marketing sites:

```
Visitor Arrives → Hero (First Impression) → Content Sections → Action (CTA) → Footer
```

Render this from the current config — show the actual enabled sections in order as a horizontal flow diagram. No backend architecture. No data flow. Just: what does the visitor see, in what order?

### Confirm Blueprints Structure
All 6 sub-tabs must be visible and generating:
- North Star
- Architecture (SADD)
- Build Plan (Implementation)
- Features
- Human Spec
- AISP Spec

---

## PRIORITY 1: Image Effects Suite (Original Requirements)

**Source:** Document 29 (Comprehensive Roadmap), Phase 8 T8 specification.

The original requirements specified 8 image effects. Some were implemented in Phase 8, but need verification and completion. The swarm must:

### Step 1: Audit what exists

Check `src/data/media/effects.json` and `index.css` for existing effect implementations. The Phase 8 compacted summary says "8 CSS effects (Ken Burns, slow pan, zoom hover, parallax, gradient overlay, glass blur, grayscale-hover, vignette)" were completed. VERIFY each one actually works by:

1. Loading Kitchen Sink example
2. Opening ImagePicker on a hero section
3. Applying each effect
4. Confirming the CSS animation renders in preview

### Step 2: Fix or complete any missing effects

These are the 8 required effects from the original spec:

| # | Effect | CSS Implementation | Behavior |
|---|--------|-------------------|----------|
| 1 | **Ken Burns** | `@keyframes ken-burns { from { transform: scale(1) } to { transform: scale(1.15) } }` duration 20s infinite | Slow zoom in on image, creates cinematic movement |
| 2 | **Slow Pan** | `@keyframes slow-pan { from { transform: translateX(0) } to { transform: translateX(-10%) } }` duration 25s infinite | Slow horizontal pan across image |
| 3 | **Zoom on Hover** | `hover:scale-110 transition-transform duration-500` | Image scales up smoothly on mouse hover |
| 4 | **Click to Enlarge / Lightbox** | Modal overlay with full-resolution image, click outside to close, ESC to close | User clicks image → sees full-size version in modal overlay |
| 5 | **Gradient Transparency** | `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))` as overlay | Dark gradient fading up from bottom of image |
| 6 | **Parallax Scroll** | `background-attachment: fixed` or IntersectionObserver-based | Background image moves slower than foreground content on scroll |
| 7 | **Glass Blur** | `backdrop-filter: blur(12px)` with semi-transparent overlay | Frosted glass effect over part of image |
| 8 | **Grayscale to Color** | `grayscale hover:grayscale-0 transition-all duration-500` | Image is grayscale, transitions to full color on hover |

**Additional effects to consider (bonus):**
| # | Effect | CSS Implementation | Behavior |
|---|--------|-------------------|----------|
| 9 | **Vignette** | `radial-gradient(ellipse, transparent 50%, rgba(0,0,0,0.5))` as overlay | Dark edges, light center — classic photo effect |
| 10 | **Fade In on Scroll** | IntersectionObserver + `opacity 0 → 1 transition` | Image fades in as user scrolls to it |
| 11 | **Tilt on Hover** | `transform: perspective(1000px) rotateY(5deg)` on hover | Subtle 3D tilt effect on mouse hover |

### Step 3: Wire effects to ImagePicker

The ImagePicker component must have an **Effect Selector** panel:

```
IMAGE EFFECT
[None] [Ken Burns] [Slow Pan] [Zoom Hover]
[Click Enlarge] [Gradient] [Parallax] [Glass Blur]
[Grayscale] [Vignette]

PREVIEW: [selected image with selected effect applied]
```

Each effect is stored in the section JSON as `style.imageEffect: "ken-burns" | "slow-pan" | "zoom-hover" | ...`

The template renderers must read this value and apply the corresponding CSS class to the image container.

### Step 4: Verify in Kitchen Sink

The Kitchen Sink example must demonstrate at least 5 different effects across different sections:
- Hero: Ken Burns on background image
- Gallery: Zoom on Hover on thumbnails
- Columns (Image Cards): Grayscale to Color on card images
- Action: Gradient Transparency on background image
- Image section: Parallax scroll

### Step 5: Click to Enlarge (Lightbox)

This is the one effect that requires a new component, not just CSS:

```tsx
// LightboxModal.tsx
// Click any image with effect="click-enlarge" → full-screen overlay
// - Dark backdrop (rgba(0,0,0,0.85))
// - Image centered at max resolution (object-fit: contain)
// - Click outside or press ESC to close
// - Optional: left/right arrows for gallery navigation
```

Wire this to: Gallery section (all variants), Image section, any hero with `imageEffect: "click-enlarge"`.

---

## PRIORITY 2: Site Context System (New Feature)

[As specified in previous Phase 12 instruction — tone, audience, purpose, brand guidelines]

---

## PRIORITY 3: Enhanced Simulations

[As specified in previous Phase 12 instruction — new chat commands for tone/audience, new listen demos]

---

## PRIORITY 4: Quality Pass + Phase Close

- All 71+ tests passing + 5-10 new tests for effects and tab restoration
- Persona review targeting Agentic Engineer 75+
- Vercel deployment green
- Full retrospective, wiki update, CLAUDE.md update, README update
- Grounding report for Phase 13

---

## PRIORITY 5: Full Section-by-Section UX Cleanup

**This is a FULL AUDIT of every section editor.** The swarm must open each of the 20 section types in the builder and verify every button, toggle, and control actually works. Known issues:

### 5a. Broken buttons audit
Go through EVERY section editor (Hero, Columns, Pricing, Action, Quotes, Questions, Numbers, Gallery, Menu, Footer, Image, Divider, Text, Logos, Team, and all variants). For each:
- Click every button — does it do something?
- Toggle every toggle — does the preview update?
- Change every text input — does the content update in preview?
- Select every layout variant — does the preview change?

Document every broken control in `plans/implementation/phase-12/broken-controls.md`. Fix them all.

### 5b. SIMPLE vs EXPERT mode audit
Review every control in SIMPLE mode. The rule is clear:

**SIMPLE mode is for grandma.** Only these controls belong:
- Layout variant selector (visual cards)
- Content inputs (headline, subtitle, CTA text, etc.) with toggles
- ONE image/media input (not three separate URL fields)
- Light/Dark toggle
- That's it.

**Everything else moves to EXPERT:**
- Color pickers (background, text, accent)
- Heading size (H1-H4)
- Padding/spacing controls
- Font weight / bold / reset
- Multiple image URL fields (Image vs BG Image vs Video)
- Hex color inputs
- Border radius controls
- Custom CSS class inputs

The swarm must audit ALL 20 section editors and move any control that doesn't pass the grandma test from SIMPLE to EXPERT.

### 5c. AISP tab relocation
The AISP spec output is currently in the right panel Blueprints tab. This is WRONG — it's a developer/top-nav feature, not a right-panel editor feature.

**Move AISP to a top-nav tab** alongside Preview, Blueprints, Data, Workflow. The AISP tab in the center area shows:
- Full AISP Crystal Atom output for the current project
- Copy button
- Export as `.aisp` file
- Syntax-highlighted rendering (monospace with colored Ω, Σ, Γ, Λ, Ε symbols)

**The Blueprints tab keeps 5 sub-tabs** (North Star, Architecture, Build Plan, Features, Human Spec). AISP moves OUT of Blueprints and becomes its own top-level tab because it's a different audience (AI agents, not human readers).

Tab order in EXPERT mode:
```
Preview | Blueprints | Data | AISP | Workflow
```

Tab order in SIMPLE mode:
```
Preview | Blueprints
```

AISP, Data, and Workflow are EXPERT-only tabs.

---

## Execution Order (Updated)

```
1. Tab restoration (Data, Workflow, confirm Blueprints)        — 1 hour
2. AISP tab relocation (from Blueprints to top-nav)            — 1 hour
3. Image effects audit + completion                            — 2-3 hours  
4. Click to Enlarge lightbox component                         — 1 hour
5. Kitchen Sink example update with effects                    — 30 min
6. Section-by-section UX cleanup (broken buttons, SIMPLE/EXPERT audit) — 3-4 hours
7. Site Context system (tone/audience/purpose)                 — 3-4 hours
8. Enhanced simulations                                        — 1.5 hours
9. Quality pass + phase close                                  — 1.5 hours
```

**Total Phase 12 estimate: ~16-18 hours of swarm time**

**Note:** The section cleanup (#6) is a prerequisite for the Site Context system (#7) — no point adding tone/audience controls to editors that have broken buttons. Fix what exists before adding new features.

**SWARM: Start with tab restoration (#1), AISP relocation (#2), then image effects audit (#3). Then the full section cleanup (#6). Site Context system (#7) only after the cleanup passes. These are fixes to original requirements and UX regressions — address them before new features.**
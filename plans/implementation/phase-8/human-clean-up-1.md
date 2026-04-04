# Hey Bradley — Comprehensive Swarm Directive: Full Roadmap & Backlog

**Date:** April 3, 2026  
**Purpose:** Complete plan from presentation prep through post-open-core, with detailed tasks for each stage  
**Instruction to Swarm:** Review ALL existing plans, reconcile with this directive, produce a single master backlog with every item categorized by stage.

---

## 0. SWARM FIRST STEPS (Before Any Code)

1. **Review all existing plan documents** in `plans/implementation/` — every phase README, living checklist, retrospective, and ADR
2. **Reconcile** any conflicts between existing plans and this directive (this directive is the authority)
3. **Create `plans/master-backlog.md`** — single file with every remaining task, categorized by stage
4. **Create `plans/presentation-dod.md`** — Definition of Done for the capstone presentation
5. **Create detailed task breakdowns** for Stage 1 (Presentation) with effort estimates

---

## 1. STAGE 1: PRESENTATION (Target: 1 Week Before Capstone)

### 1A. Enterprise-Quality Spec Generation (P0)

The 6 spec documents in XAI DOCS must look like **real enterprise specifications** — the kind a consulting firm would charge $50K to produce. They must be formatted for developer consumption AND suitable for copy/paste into an LLM or AI coding system with 90% reproduction efficacy.

**The 3 Pillar Documents:**

| Document | Purpose | Quality Bar |
|----------|---------|-------------|
| **North Star** | Vision, PMF, personas, success criteria, out-of-scope | A product manager reads this and understands the entire project in 5 minutes |
| **SADD** | Architecture, tech stack, component tree, data model, API contracts, deployment | A senior engineer reads this and can set up the project scaffold in 30 minutes |
| **Implementation Plan** | Phase-by-phase build instructions, section-by-section specs, acceptance criteria, dependency graph | An AI coding agent reads this and builds the site section-by-section with 90% accuracy |

**Plus Supporting Documents:**

| Document | Purpose |
|----------|---------|
| **Features & User Stories** | Every section as a user story with acceptance criteria. Testable. Specific. |
| **Human Spec** | Plain-English complete page specification. Non-technical stakeholder reads this. |
| **AISP Spec** | Machine-readable Crystal Atom notation. One atom per section. Platinum tier validated. |

**Format Requirements:**
- Each doc must have: title, version, date, table of contents, numbered sections
- Code blocks for any technical content (component trees, color values, commands)
- Tables for structured data (palette, typography, section inventory)
- The Implementation Plan must include exact copy text, image URLs, component props — enough detail that an LLM can reproduce the page without asking questions
- Export as `.md` files that render cleanly in GitHub, VS Code, or any markdown viewer

**Generator Architecture:**
```
src/lib/specGenerators/
├── index.ts
├── northStarGenerator.ts
├── saddGenerator.ts
├── buildPlanGenerator.ts
├── featuresGenerator.ts
├── humanSpecGenerator.ts
├── aispSpecGenerator.ts
└── helpers.ts  ← Section descriptions, user story mappings, palette descriptions, 
                   variant descriptions, component descriptions
```

Each generator: `(config: MasterConfig) => string` — pure function, no side effects.

### 1B. Canned Demo System (P0)

**6-8 Example Websites:**

| # | Name | Theme | Sections | Tone | Key Visual |
|---|------|-------|----------|------|-----------|
| 1 | **Sweet Spot Bakery** | Wellness/light | Hero, Columns, Gallery, Quotes, Action, Footer | Warm, appetizing | Food photography, warm colors |
| 2 | **LaunchPad AI** | SaaS/dark | Hero, Columns, Pricing, Logos, Quotes, Numbers, Action, Footer | Technical, confident | Dashboard screenshots, gradients |
| 3 | **Sarah Chen Photography** | Portfolio/overlay | Hero(overlay), Gallery(masonry), Quotes, Action, Footer | Artistic, minimal | Full-bleed portfolio images |
| 4 | **GreenLeaf Consulting** | Professional/light | Hero, Numbers, Columns, Quotes, Team, Action, Footer | Corporate, trustworthy | Clean professional imagery |
| 5 | **FitForge Fitness** | Creative/dark | Hero(video), Gallery, Columns, Quotes, Numbers, Action, Footer | Energetic, bold | Fitness action shots, video bg |
| 6 | **Bloom & Petal Florist** | Personal/light | Hero(split), Gallery(grid), Quotes, Action, Footer | Delicate, beautiful | Floral close-ups, soft colors |
| 7 | **Kitchen Sink Demo** | SaaS/dark | ALL section types, ALL major variants | Everything | Every image effect, every component | 
| 8 | **Blank Canvas** | Minimalist/light | Hero(minimal) only | Clean start | No images, typography only |

**Example 7 (Kitchen Sink) must demonstrate:**
- Multiple Columns variants (Cards, Image Cards, Glass, Gradient, Numbered)
- Multiple image treatments (full background, left split, right split, below content)
- ALL image effects: gradient overlay, Ken Burns, slow pan, zoom on hover, parallax, glass blur
- Video background on at least one section
- Gallery with masonry layout
- Logos with marquee animation
- Pricing with highlighted tier
- Team with member photos
- Numbers with large counter values
- Every CTA variant

**Simulation Sequences:**

For Chat mode: User clicks a demo button → chat shows simulated conversation:
```
you: build me a bakery website with warm colors and customer reviews

sure thing — picking a cozy style... ✓
adding your hero section with fresh bakery photos...
now some specialties in a card layout...
customer reviews look great here...
and a way to order online...
your bakery site is ready ✓
```

While the typewriter runs, sections appear one-by-one in the preview with staggered animations. The full sequence takes 10-15 seconds.

For Listen mode: User clicks "Watch a Demo" → orb pulses → captions appear:
```
[idle orb, slow pulse]
listening...
heard: "build me a bakery website with testimonials"
on it...
applying warm colors...
[sections appear one by one]
your site is ready ✓
[auto-switch to Builder]
```

**Onboarding page integration:** The 6-8 examples appear as clickable cards on the onboarding page below the theme grid. Each card shows the example name + a mini-preview + 1-line description. Clicking loads the example JSON and navigates to `/builder`.

**Chat/Listen dropdown:** In Chat and Listen tabs, a dropdown selector lets the user pick which example to simulate. Default is "Sweet Spot Bakery."

### 1C. Image & Video Library (P0)

**200-300 images organized as JSON:**

```
src/data/media/
├── images.json     ← 200-300 images with metadata
├── videos.json     ← 40+ videos with metadata  
└── effects.json    ← Image effect presets
```

**Image JSON structure:**
```json
{
  "id": "bakery-storefront-01",
  "url": "https://images.unsplash.com/photo-XXXXX?w=1200",
  "thumbnail": "https://images.unsplash.com/photo-XXXXX?w=400",
  "category": "food",
  "subcategory": "bakery",
  "tags": ["storefront", "warm", "cozy", "bread", "pastry"],
  "mood": "warm",
  "color_dominant": "#d4a574",
  "orientation": "landscape",
  "description": "Warm bakery storefront with fresh bread display",
  "ai_prompt_context": "Use for bakery, cafe, or food business hero sections. Warm lighting, inviting atmosphere."
}
```

**Categories (at least 20 images each):**
- Food & Bakery (bakery, restaurant, coffee, cooking)
- Technology (dashboards, code, devices, servers)
- Nature (ocean, mountains, forest, sky, flowers)
- Business (office, meeting, handshake, teamwork)
- Creative (art, design, studio, photography)
- Fitness (gym, running, yoga, sports)
- Architecture (buildings, interiors, modern, classic)
- People (portraits, teams, professionals, diverse)
- Abstract (gradients, patterns, textures, shapes)
- Products (minimal product shots, packaging, displays)

**Video JSON structure:**
```json
{
  "id": "abstract-particles-01",
  "url": "https://videos.pexels.com/video-files/XXXXX",
  "thumbnail": "https://images.pexels.com/videos/XXXXX/free-video-XXXXX.jpg",
  "category": "abstract",
  "tags": ["particles", "dark", "motion", "tech"],
  "duration_seconds": 15,
  "mood": "futuristic",
  "description": "Flowing abstract particles on dark background",
  "ai_prompt_context": "Use for tech, SaaS, or creative hero backgrounds. Dark, atmospheric."
}
```

**40+ videos across categories:**
- Abstract/particles (8-10)
- Nature slow motion (8-10)  
- Urban/cityscape (5-6)
- Technology (5-6)
- Food/cooking (3-4)
- Fitness/action (3-4)
- Aerial/drone (5-6)

**Image Effects:**
```json
{
  "effects": [
    { "id": "gradient-overlay", "label": "Gradient Overlay", "css": "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))" },
    { "id": "ken-burns", "label": "Ken Burns", "css_class": "animate-ken-burns", "description": "Slow zoom in over 20s" },
    { "id": "slow-pan", "label": "Slow Pan", "css_class": "animate-slow-pan", "description": "Slow horizontal pan" },
    { "id": "zoom-hover", "label": "Zoom on Hover", "css_class": "hover:scale-110 transition-transform duration-500" },
    { "id": "parallax", "label": "Parallax Scroll", "requires_js": true, "description": "Background moves slower than content" },
    { "id": "glass-blur", "label": "Glass Blur", "css": "backdrop-filter: blur(12px)", "description": "Frosted glass effect over image" },
    { "id": "grayscale-hover", "label": "Color on Hover", "css_class": "grayscale hover:grayscale-0 transition-all duration-500" },
    { "id": "vignette", "label": "Vignette", "css": "radial-gradient(ellipse, transparent 50%, rgba(0,0,0,0.5))" }
  ]
}
```

**Image Selector Component Enhancement:**
- Full-screen modal with category sidebar
- Grid of thumbnails with lazy loading
- Search/filter by tags and mood
- Effect picker (apply effect to selected image)
- Preview with selected effect before applying
- "Open Full Image" lightbox view
- Drag-and-drop upload area (placeholder — "Coming in Pro version")

### 1D. Theme & Design Locking (P1)

**Design Toggle:** A toggle in the builder that switches between:
- **Design Mode** — User can change theme, layout, colors, fonts (current behavior)
- **Content Mode** — Theme/layout/colors are locked. User can only edit text content and images. This prevents grandma from accidentally breaking her site's design.

**Implementation:** Add `designLocked: boolean` to uiStore. When true:
- Theme preset cards are disabled (grayed out with lock icon)
- Layout variant cards are disabled
- Palette selector is disabled
- Font selector is disabled  
- Mode toggle (light/dark) is disabled
- Section CRUD (add/remove) is disabled
- Content editing (headline text, CTA text, image URLs) still works
- Component toggles still work

**UI:** A lock icon toggle in the TopBar: 🔓 (unlocked = design mode) / 🔒 (locked = content mode)

### 1E. Vercel Deploy Verification (P1)

Already deployed. Verify:
- All 4 examples load correctly on production URL
- Canned demo simulation works on production
- Image/video URLs load from Unsplash/Pexels (no CORS issues)
- Specs tab generates correctly
- Performance: initial load < 3 seconds on 4G

---

## 2. STAGE 2: PRE-LLM MVP (After Presentation)

Everything works without any LLM API call. The product is a complete specification tool that happens to simulate AI.

| Task | Details |
|------|---------|
| Image upload | Drag-and-drop or file picker → base64 or Supabase Storage |
| Brand image management | Upload logo, favicon, og:image → stored in project JSON |
| Complete theme locking | Lock specific theme settings per-project (brand guidelines enforcement) |
| Full enterprise spec templates | Specs include component-level implementation details, responsive breakpoints, animation specs |
| Section variant completeness | All 8 variants per section type actually rendering and selectable |
| Custom hex color input | Type a brand hex code → apply to palette slots |
| Newsletter form webhook | ActionNewsletter connects to configurable webhook URL |
| SEO fields | Title, description, og:image in a "Site Settings" panel |
| Project save/load | Named projects in localStorage (or file-based export/import) |
| Pricing variants | Monthly/annual toggle, comparison table, enterprise tier |

## 3. STAGE 3: LLM MVP (Post Pre-LLM)

Real AI replacing canned simulations.

| Task | Details |
|------|---------|
| Chat → Claude API | User types natural language → Claude returns JSON patches → site updates |
| Listen → Whisper STT → Claude | Voice transcribed → sent to Claude → JSON patches → site builds |
| AISP in prompts | System prompt includes AISP Crystal Atom format → Claude responds in structured AISP → parser applies |
| Context-aware responses | Claude sees current project JSON → responses reference existing content |
| Image selection via AI | Claude recommends images from the library based on the project context |
| Error handling | Graceful fallback if API fails, rate limiting, retry logic |

## 4. STAGE 4: OPEN CORE COMPLETION

Simple AISP use in LLM prompts for structured intent routing.

| Task | Details |
|------|---------|
| AISP intent routing | User intent parsed via AISP Crystal Atom → routed to correct handler |
| Agent coordination | Multiple Claude calls coordinated: one for content, one for layout, one for images |
| Template generation | AI generates new section templates from AISP specs |
| Spec export for Claude Code | One-click export of all 6 spec docs → Claude Code project scaffold |
| Community tier features | Free tier: 3 projects, 5 sections, basic themes |
| Pro tier features | Unlimited projects, all themes, custom colors, priority support |

## 5. STAGE 5: POST-OPEN-CORE

AISP intent agents, marketplace, enterprise.

| Task | Details |
|------|---------|
| AISP intent agents | Specialized agents per section type (HeroAgent, PricingAgent, etc.) |
| Multi-page support | Beyond single-page: About, Contact, Blog, Product pages |
| Marketplace | Community-contributed themes, section templates, image packs |
| White label | Resellable version for agencies |
| API access | REST API for programmatic site generation |
| SSO / Enterprise auth | Supabase + SAML/OIDC for enterprise clients |
| Version control | Git-like project history with branching |
| Collaboration | Multi-user editing with conflict resolution |

---

## 6. PRESENTATION DoD (Definition of Done)

**The capstone demo passes if ALL of these are true:**

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Welcome page loads in < 2s with CTA always clickable | Vercel production test |
| 2 | 10 themes selectable, each produces visually distinct site | Click through all 10 |
| 3 | Builder mode: edit headline → preview updates instantly | Live demo |
| 4 | Builder mode: toggle component → appears/disappears | Live demo |
| 5 | Chat mode: type command → site changes with typewriter response | Live demo (canned) |
| 6 | Listen mode: "Watch a Demo" → orb pulses → site builds → wow moment | Live demo (canned) |
| 7 | 6-8 example websites loadable, each visually distinct | Click through examples |
| 8 | XAI DOCS: 6 tabs generate real specs from current JSON | Open each tab |
| 9 | North Star spec reads like a real vision document | Professor reviews |
| 10 | Implementation Plan has section-by-section build instructions | Professor reviews |
| 11 | AISP spec shows Crystal Atom notation with all 5 components | Professor reviews |
| 12 | Copy any spec → paste into Claude → AI can reproduce the site at 90% | Test offline |
| 13 | Full-page preview shows complete multi-section marketing site | Preview mode |
| 14 | Mobile responsive (splash page + preview mode) | Test at 375px |
| 15 | 47+ Playwright tests passing | `npx playwright test` |
| 16 | Zero console errors during demo flow | Browser console clean |
| 17 | Kitchen Sink example shows ALL image effects and variants | Load example 7 |
| 18 | Image selector has 200+ images with categories and effects | Open ImagePicker |
| 19 | Design/Content mode toggle works | Lock design, edit content only |
| 20 | 15-minute demo flows without any "known issue" moments | Full rehearsal |

---

## 7. SWARM EXECUTION ORDER (Stage 1 Only)

```
STEP 1: Master planning (this session)
├── Review ALL existing plans and reconcile
├── Create plans/master-backlog.md
├── Create plans/presentation-dod.md
├── Detailed task breakdown with effort estimates
└── ADR-029: Spec Generation Architecture

STEP 2: Spec Generators (2-3 sessions)
├── Build 6 generator pure functions
├── Build helpers.ts with all mappings
├── Update XAIDocsTab with 6 sub-tabs
├── Test with all examples
├── AISP validation at Platinum tier
└── Format as enterprise-quality documents

STEP 3: Image & Video Library (1-2 sessions)
├── Curate 200+ images with JSON metadata
├── Curate 40+ videos with JSON metadata
├── Define 8 image effect presets
├── Enhance ImagePicker component
├── CSS animations for Ken Burns, slow pan, zoom, parallax
└── Full-screen image selector with categories + effects + preview

STEP 4: Canned Demo Enhancement (1-2 sessions)
├── Create 6-8 example JSONs with real content
├── Kitchen Sink example with ALL variants and effects
├── Enhance demoSimulator for each example
├── Chat simulation sequences per example
├── Listen simulation sequences per example
├── Onboarding page example cards
└── Chat/Listen dropdown selector

STEP 5: Design/Content Toggle (0.5 session)
├── Add designLocked to uiStore
├── Disable theme/layout/palette controls when locked
├── Lock icon in TopBar
└── Test content editing still works when locked

STEP 6: Final Integration + Rehearsal (1 session)
├── End-to-end demo flow test (all 20 DoD items)
├── 4-persona re-score (target 85+)
├── Fix top 3 issues from re-score
├── Vercel production deploy verification
└── Demo rehearsal notes with timing
```

---

## 8. KEY GUIDANCE FOR THE SWARM

1. **The specs ARE the product.** Not the builder UI, not the preview — the 6 specification documents are Hey Bradley's actual output. They must be enterprise-quality. A developer reads the Implementation Plan and builds the site. An AI agent reads the AISP spec and builds the site. 90% reproduction efficacy or it's not done.

2. **The image library must be LLM-ready.** Every image has tags, mood, description, and `ai_prompt_context`. When the LLM integration happens (Stage 3), Claude will select images based on this metadata. Design the JSON now so it works then.

3. **The Kitchen Sink example is the portfolio piece.** It demonstrates every capability in one project. Every variant, every effect, every section type. This is what you show when someone asks "what can it do?"

4. **Canned demos must feel real.** The typewriter responses should have personality ("sure thing", "nice choice", "looking good"). The timing should have subtle randomness (not perfectly uniform). The sections should appear with staggered animations. A viewer should not be able to tell it's canned until they try an unsupported command.

5. **Specs should be copy/paste ready.** A professor copies the Implementation Plan, pastes it into Claude Code with "build this site", and gets a 90% accurate reproduction. That's the bar. Test this manually before the demo.

---

*The product has 15 sections and 47 variants. It has a canned demo, 4 examples, AISP specs, and 47 Playwright tests. The remaining work is: enterprise-quality spec documents (the actual innovation), a comprehensive image/video library (the visual wow), more diverse examples (the versatility proof), and the design/content toggle (the grandma safety net). Do this right and the capstone demo writes itself.*
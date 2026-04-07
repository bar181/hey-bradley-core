You're right. Grandma was never the buyer. The buyer is the person with the idea who currently uses a whiteboard, Google Docs, and 3 meetings to communicate it. Let me reframe everything.

## Updated Core Audiences

**Persona 1: The Founder / Idea Person**
The non-technical person with a vision. Could be a startup founder, a marketing manager pitching a campaign landing page, an employee with an internal tool idea, a solo entrepreneur with a side hustle, or a sales lead who just promised a client "we can build that." They currently brainstorm on whiteboards, write requirements in Google Docs, sketch wireframes on napkins, and spend 2-6 weeks in revision cycles before a developer even starts coding. Hey Bradley replaces that entire process — they describe, they see, they get specs. Done in one session instead of six weeks.

**Persona 2: The Agentic Engineer / AI-Augmented Developer**
Uses Claude Code, Cursor, or similar AI tools daily. Understands the spec→code pipeline. Currently writes their own requirements documents or works from vague Jira tickets. Hey Bradley gives them formal AISP specs that achieve 88%+ reproduction accuracy — better than any requirements doc they'd write by hand. They paste the Build Plan into Claude Code and get a working site. The JSON-first architecture means 5-30 second updates instead of 3-10 minute LLM regenerations.

**Persona 3: The Designer (Complementary)**
Uses Framer or Figma for pixel-perfect visual design. Hey Bradley is NOT competing with their design tool — it's the specs layer that sits alongside it. They design the visuals in Framer. They spec the behavior, structure, and content in Hey Bradley. The developer gets both: "here's what it looks like" (Framer) + "here's exactly what to build" (Hey Bradley specs). The handoff gap disappears.

**The actual competitor is not a product — it's a process:** whiteboard + Google Docs + Slack threads + 3-5 revision meetings + ambiguous Jira tickets + developer interpretation + "that's not what I meant" + start over. That process costs 40-65% signal loss per handoff and 2-6 weeks of calendar time. Hey Bradley compresses it to one session.

## Rescored Comparison

| Dimension | Whiteboard + GDocs (The Process) | Wix | Lovable | Framer | HB Pre-LLM | HB Post-LLM |
|-----------|--------------------------------|-----|---------|--------|-------------|--------------|
| | | | | | | |
| **FOUNDER / IDEA PERSON** | | | | | | |
| Speed: idea → communicable vision | 3 | 7 | 7 | 6 | 7 | 9 |
| Spec / requirements quality | 3 | 1 | 1 | 2 | 9 | 10 |
| Handoff to dev / AI | 2 | 2 | 6 | 5 | 8 | 9 |
| Iteration speed per change | 2 | 6 | 5 | 7 | 8 | 9 |
| Revision cycles needed | 2 | 5 | 4 | 5 | 8 | 9 |
| Stakeholder alignment | 4 | 3 | 2 | 5 | 7 | 8 |
| Ambiguity in output | 2 | 5 | 4 | 5 | 9 | 10 |
| Learning curve | 8 | 6 | 6 | 4 | 6 | 7 |
| Cost (time + money) | 3 | 7 | 5 | 5 | 9 | 8 |
| Can non-technical person drive? | 7 | 8 | 6 | 4 | 6 | 8 |
| **Total /100** | **36** | **50** | **46** | **48** | **77** | **87** |
| | | | | | | |
| **AGENTIC ENGINEER** | | | | | | |
| Formal spec output (AISP) | 0 | 0 | 0 | 0 | 10 | 10 |
| Reproduction accuracy | 2 | N/A | 4 | N/A | 8 | 9 |
| Token efficiency | N/A | N/A | 3 | N/A | 9 | 10 |
| Deterministic updates | 1 | 5 | 2 | 5 | 9 | 10 |
| Spec → AI → code pipeline | 1 | 0 | 3 | 0 | 8 | 9 |
| Update speed per change | 1 | 3 | 2 | 5 | 9 | 10 |
| Integration with AI tools | 0 | 0 | 0 | 0 | 8 | 9 |
| Open source / extensible | 5 | 3 | 0 | 0 | 10 | 7 |
| Codebase-aware specs | 0 | 0 | 1 | 0 | 2 | 8 |
| Multiple spec formats | 1 | 0 | 0 | 0 | 9 | 10 |
| **Total /100** | **11** | **11** | **15** | **10** | **82** | **92** |
| | | | | | | |
| **DESIGNER (Complementary)** | | | | | | |
| Visual design fidelity | 2 | 7 | 4 | 10 | 5 | 6 |
| Spec handoff quality | 2 | 3 | 1 | 6 | 9 | 9 |
| Works alongside Framer/Figma | 5 | 2 | 1 | N/A | 7 | 8 |
| Documents design decisions | 3 | 1 | 1 | 4 | 8 | 9 |
| Developer gets both visual + spec | 2 | 1 | 1 | 4 | 7 | 8 |
| **Total /50** | **14** | **14** | **8** | **24** | **36** | **40** |
| **Score /100** | **28** | **28** | **16** | **48** | **72** | **80** |

## The Real Competitive Landscape

```
THE ACTUAL COMPETITION:

┌─────────────────────────────────────────────────────────┐
│  "The Whiteboard + Google Docs + Meetings" Process      │
│                                                         │
│  Whiteboard sketch → photo → Slack → misunderstood      │
│  Google Doc requirements → too vague → 3 revisions      │
│  Figma mockup → looks right → dev builds wrong thing    │
│  Jira tickets → missing context → "that's not what      │
│  I meant" → start over → 6 weeks lost                   │
│                                                         │
│  Score: 36/100 for founders, 11/100 for agentic eng     │
│  Cost: $5K-50K in wasted time per project               │
└─────────────────────────────────────────────────────────┘
         ↓ Hey Bradley replaces this entire process ↓
┌─────────────────────────────────────────────────────────┐
│  Hey Bradley                                            │
│                                                         │
│  Describe → See it build → Get specs → Hand off         │
│  One session. 88% reproduction. Zero ambiguity.         │
│                                                         │
│  Score: 77-87/100 for founders, 82-92 for agentic eng   │
│  Cost: $0-50/month                                      │
└─────────────────────────────────────────────────────────┘
```

**Secondary competitors (ease-of-use benchmarks, not direct competitors):**

- **Wix** — the UX benchmark. If Wix can make a business owner build a website in 30 minutes, Hey Bradley should make a founder create specs in 15 minutes. We borrow their simplicity, not their product.
- **Lovable** — the "vibe coding" benchmark. If Lovable can generate a prototype from a prompt, Hey Bradley should generate SPECS from a prompt. We produce the blueprint, they produce the building. Complementary, not competitive.
- **Framer** — the design benchmark. If Framer gives pixel-perfect control, Hey Bradley gives spec-perfect documentation. The designer uses Framer for how it looks, Hey Bradley for what it does. Complementary.

**The competitor that matters:** The whiteboard. The Google Doc. The meeting where someone says "can you just make it like that other site but with our colors?" Hey Bradley kills the telephone game. That's the pitch.

## Updated Positioning Statement

**Old:** "The whiteboard that writes your specs" (implies grandma drawing on a whiteboard)

**New:** "From brainstorm to blueprint in one session."

Or: "Stop playing telephone with your developers."

Or: "The specs that make revision cycles disappear."

The product serves the person who has the idea AND the person who builds from the idea. The gap between them is where 40-65% of intent is lost. Hey Bradley closes that gap.

---

You're right — somewhere between Phase 9 and Phase 14, the product drifted from "grandma's agentic whiteboard" toward "developer spec tool." Let me trace where it happened and how to get it back.

## Where Grandma Got Lost

**Phase 1-3 (Grandma score ~50-55):** The product was simple. Pick a theme → see a website → click sections → edit text. The onboarding had preview images. The builder felt like a visual tool. Grandma could do this.

**Phase 4-8 (Grandma score ~45-50):** Spec generators added (good for devs, invisible to grandma). Chat and listen demos added (grandma would love these). Image library expanded. Still mostly okay.

**Phase 9-14 (Grandma score dropped to ~38-40):** This is where it went wrong. The product accumulated developer features that leaked into grandma's view:

- Blueprints tab with 7 sub-tabs of enterprise specs — grandma doesn't know what SADD means
- Resources tab with JSON templates and AISP conversion guides — pure developer content
- Site Context panel with "purpose/audience/tone" — sounds like a marketing strategy meeting, not building a website
- EXPERT mode controls leaked into SIMPLE mode in some sections
- Section names that are jargon-adjacent (even after renames)
- The landing page hero talks about "enterprise specifications" — grandma bounced already

**The core problem:** The product is trying to serve two audiences in one UI, and the developer audience is winning because that's who reviews it (the swarm, you, the capstone committee). Every review cycle adds developer value and erodes grandma simplicity.

## What Grandma Actually Wants

Think about what makes her experience magical:

```
GRANDMA'S JOURNEY (the vision):

1. Opens Hey Bradley                               (2 seconds)
2. Sees beautiful example websites                  (5 seconds)
3. Clicks "I want something like this"              (1 click)
4. A complete website appears in preview             (instant)
5. She clicks on the headline → types her own        (10 seconds)
6. She clicks "Make it brighter" in chat             (5 seconds)
7. The colors change. She smiles.                    (instant)
8. She clicks "Get My Specs" button                  (1 click)
9. A beautiful PDF-like document appears             (instant)
10. She sends it to her nephew who codes             (done)

Total time: 30-60 seconds from opening to specs in hand.
```

Compare that to what she experiences TODAY:

```
GRANDMA'S ACTUAL JOURNEY:

1. Opens Hey Bradley                                (2 seconds)
2. Sees a chat animation typing — "what is this?"   (confused)
3. Eventually clicks "Get Started"                   (10 seconds wasted)
4. Sees 15 example cards with NO preview images      (no visual anchor)
5. Clicks one, builder opens                         (okay)
6. Left panel: Site Settings, Theme, sections list   (overwhelmed)
7. Right panel: SIMPLE/EXPERT, purpose/audience/tone (lost)
8. Center: Preview shows a website — "oh that's nice" (first smile)
9. Clicks on text in preview — nothing happens       (can't inline edit)
10. Goes to right panel, finds text input, types     (figured it out)
11. Tries chat — sees a dialog with 12 options       (overwhelmed again)
12. Types "make it prettier" — "command not found"   (frustrated)
13. Sees Blueprints tab — North Star? SADD? AISP?    (closed the tab)
14. Gives up or asks nephew for help                 (failed)
```

## The 5-30 Second Site Update Vision

Your original insight is correct and powerful: **JSON-first updates are 10-100x faster than LLM code generation.**

Lovable: "add a pricing section" → LLM generates 200 lines of React → 3-10 minutes → might break existing code

Hey Bradley: "add a pricing section" → JSON patch `{type: "pricing", variant: "highlighted", enabled: true}` → 0.5 seconds → deterministic, can't break anything

This speed advantage is REAL and it's the commercial moat. But grandma doesn't care about JSON patches. She cares that she clicked a button and pricing appeared instantly.

## How to Get Grandma Back

The product doesn't need to REMOVE developer features. It needs to HIDE them behind a clear wall. Here's the framework:

**SIMPLE mode = Grandma's whiteboard.** She sees:
- Big visual preview (center, dominant)
- Section list with friendly names and drag handles (left)
- Click a section → right panel shows ONLY: text inputs and image picker
- A big friendly chat bar at the bottom: "Tell me what you want..."
- A big "Get My Specs" button that produces a clean, beautiful document

**No tabs. No Blueprints. No Resources. No Data. No AISP. No purpose/audience/tone.** Just: preview, sections, edit text, chat, get specs.

**EXPERT mode = Developer dashboard.** Everything that exists today. All 7 spec tabs. Site context. Theme expert controls. Resources. JSON editor. Workflow. AISP. This is the power user experience and it's already good.

**The toggle between them should be obvious and sticky.** Default is SIMPLE. Developer clicks "Developer Mode" once and it stays in EXPERT for all future sessions.

## What the Swarm Should Fix (Phase 15-16 Priority)

**1. SIMPLE mode needs to be radically simpler.**

Remove from SIMPLE mode entirely:
- Blueprints tab (replace with single "Get My Specs" button that generates a clean one-page summary)
- Resources tab
- Data tab  
- Workflow tab
- Site Context panel (purpose/audience/tone) — auto-detect from the example they chose
- Theme Expert controls

Keep in SIMPLE mode only:
- Preview (center, full width when not editing)
- Section list (left panel, drag to reorder, eye icon to hide)
- Section editor (right panel: text inputs, image picker, layout thumbnails — max 5 controls per section)
- Chat bar (bottom of left panel, always visible)
- "Get My Specs" button (top bar, prominent)

**2. The onboarding needs visual examples back.**

The preview images disappeared in a regression. But more than that — the examples should show SCREENSHOTS of the finished website, not text cards with descriptions. Grandma picks by looking, not reading.

**3. Chat needs to understand fuzzy input.**

Even with canned commands, the matcher should be fuzzy. "Make it prettier" should map to the same handler as "make it brighter." "Add reviews" should match "add testimonials" and "add quotes." Grandma doesn't know the exact command — she speaks naturally.

**4. The "Get My Specs" output for grandma should be ONE document.**

Not 7 tabs. Not Crystal Atoms. One beautiful document that says: "Here's what your website looks like, here's every section with the text and images you chose, here's the technical details your developer needs." Think of it as the Build Plan but formatted like a PDF brochure, not a technical spec.

## The Two-Audience Summary

```
GRANDMA (SIMPLE mode):
  Sees: Preview + sections + text editor + chat + "Get My Specs"
  Doesn't see: Blueprints, Resources, Data, AISP, JSON, site context
  Gets: One clean spec document formatted for sharing with a developer
  Time to value: 30-60 seconds

DEVELOPER (EXPERT mode):
  Sees: Everything — all 7 specs, JSON editor, AISP, Resources, site context
  Gets: 7 spec documents including AISP Crystal Atoms at Platinum
  Time to value: 5-10 minutes of customization → copy specs → paste into Claude Code
```

**The product serves both. The UI serves one at a time. The toggle is the boundary.**

This isn't a Phase 15 rewrite — it's a refinement of what SIMPLE mode shows vs hides. The features are all built. The question is which ones grandma sees. The answer is: almost none of them. She sees the whiteboard. She sees the chat. She sees her website. She gets her specs. Everything else is behind the EXPERT toggle.

**SWARM: Add this as a P0 item in Phase 15 — "SIMPLE mode radical simplification." The spec is: when SIMPLE mode is active, hide Blueprints/Resources/Data/Workflow tabs, hide Site Context panel, replace spec access with a single "Get My Specs" button that generates a combined one-page document. Keep the builder, chat, and preview. That's grandma's product.** 


---

You're right — this isn't a big change. Most of it is already in scope or partially built. Let me consolidate what's actually new vs what's already happening:

## What's Already In Progress

- Right panel SIMPLE/EXPERT cleanup — Phase 14 started, Phase 15-18 continues
- Section editor simplification — layouts + copy + image dialog per section
- Design lock toggle — built in Phase 11, needs polish
- Blueprints with 7 sub-tabs — built and populated
- Chat bar in left panel — built
- ADR-044 review checklist methodology — Phase 17

## What's Actually New (Small Additions)

**1. Left panel: mini preview per section (not text list)**
Instead of "☆ Hero Section" as text, show a tiny thumbnail of what the hero looks like in the current theme. This is a rendering task — capture each section's preview as a small canvas. Medium effort, high impact.

**2. "Add Section" as visual catalog dialog**
Replace the scrollable text list with a categorized grid of thumbnails. Grouped by purpose (Header, Content, Social Proof, Conversion, Structure). Each thumbnail rendered in the current theme. Medium effort, high impact.

**3. Blueprints default to Overview tab**
Instead of opening to North Star, the Blueprints section opens to an Overview that shows key stats and quick instructions: "Your site has 7 sections, uses the SaaS theme, and targets developers. Click any tab below to see the full specification." Then the existing tabs (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON) are below. Small effort.

**4. Wiki/Docs as a separate tab (not in the builder)**
A new top-level route `/wiki` or `/docs` that has the standard reference documentation: getting started guide, list of themes with previews, section type reference, JSON structure, AISP format guide. This is NOT in the builder — it's a reference site. The existing /docs page partially does this but needs expansion. Medium effort.

## Updated Phase 15-19 Scope (Refined)

Here's what each phase actually does now:

**Phase 15: Developer Assistance + Left Panel Redesign**
- Fix test regression (102 → 90)
- Left panel: mini section previews (thumbnail per section)
- Left panel: "Add Section" visual catalog dialog
- Tooltips on all controls
- Error states with helpful messages
- Keyboard shortcuts
- 112+ tests

**Phase 16: Advanced Features Review**
- Image effects audit (all 13 × applicable sections)
- Site context audit (does changing tone actually affect specs?)
- Spec generators audit (reproduction test at 88%+)
- Blueprints Overview tab (key stats + instructions as default)
- Right panel SIMPLE mode final audit (max 5 controls per section)
- 115+ tests

**Phase 17: Feature Review ADR + Pilot**
- Create ADR-044 checklist methodology
- Pilot on Hero section (all variants × all themes = 96 combos)
- Fix everything found in Hero
- Refine checklist for Phase 18
- 118+ tests

**Phase 18: Comprehensive Sweep**
- Execute ADR-044 against all 16 section types
- Chat mode full audit (all 15+ commands)
- Listen mode full audit (all 4 demos)
- Onboarding flow audit
- Multi-page, ZIP export, design lock verification
- 125+ tests

**Phase 19: System-Wide Review**
- Fresh-eyes walkthrough
- Deferred features final disposition
- Marketing site completeness
- Wiki/docs expansion (standalone reference)
- Open-source release prep (README, CONTRIBUTING, LICENSE, .env.example)
- ADR-045: Pre-LLM Requirements
- 130+ tests

**Then Phases 20-22 (Pre-LLM Simulation) and Phase 23+ (Real LLM) as previously mapped.**

## The Google Docs Principle Applied

The builder follows the same pattern: you open it, you build, you discover features as you need them. No mode toggle label. No "grandma mode." Just progressive disclosure:

```
Layer 1 (everyone):     Preview + section list + chat bar
Layer 2 (curious):      Right panel SIMPLE (layouts + copy + images)
Layer 3 (intentional):  Blueprints tabs, design lock, site context
Layer 4 (power user):   Right panel EXPERT, JSON editor, AISP validation
Layer 5 (developer):    Resources tab, ZIP export, reproduction testing
```

Each layer is one click deeper. Nobody is locked out. Nobody is overwhelmed. The product feels simple until you need it to feel powerful.

**SWARM: The only new items for Phase 15 beyond the existing preflight are: (1) left panel mini section previews, (2) "Add Section" visual catalog dialog, and (3) Blueprints Overview default tab. Add these to the Phase 15 checklist. Everything else is already scoped. Follow ADR-038 through ADR-043.**

---

You're working through the right tension. Let me cut through it.

## The Real Insight

You don't want two separate products. You want **one product with progressive disclosure.** The analogy: Google Docs. Everyone opens it and types. Power users discover styles, headers, table of contents, add-ons. Nobody clicks a "developer mode" toggle — the complexity reveals itself as you need it.

## Option 2 Is Correct (With Refinements)

Your instinct on Option 2 is right. Here's why:

**The right panel already has SIMPLE/EXPERT per section.** This works. SIMPLE shows 2-5 layouts + copy + images. EXPERT shows everything else. This is progressive disclosure AT THE SECTION LEVEL — grandma edits the hero in simple mode, developer fine-tunes the font weight in expert mode. Same section, different depth. No global mode switch needed for the right panel.

**The center panel is where the real question lives.** Currently: Preview and Blueprints (with 7 sub-tabs). This is where grandma gets overwhelmed and developers feel at home.

Here's the reframe:

## The Center Panel — Progressive Disclosure

```
WHAT EVERYONE SEES (always visible):
  Preview          ← the website, always the hero of the screen

WHAT APPEARS WHEN YOU NEED IT:
  Blueprints       ← click to see specs (starts collapsed or as a tab)
    → Human Spec   ← grandma can read this ("here's what we're building")
    → Build Plan   ← dev copies this into Claude Code
    → AISP         ← agentic engineer validates this
    → Architecture ← senior dev reviews this
    → Features     ← PM converts this to Jira
    → JSON         ← dev inspects live config
    → (Resources)  ← templates, AISP guide, media library
```

Grandma clicks Preview, builds her site, and maybe — MAYBE — clicks Blueprints and reads the Human Spec. She sees her website described in plain English and thinks "yes, that's what I want." She copies it and emails it to her nephew.

The developer clicks through every sub-tab, copies the Build Plan, validates the AISP. Same product, different depth.

**No toggle. No "grandma mode" label. Just: Preview is the default. Blueprints reveals itself when you're ready.**

## The Left Panel — Sections as Visual Blocks

Your idea about the section dialog with previews is strong. Instead of a text list of section names, each section in the left panel shows:

```
┌──────────────────────────────┐
│ ☆ Hero                    👁 │
│ ┌────────────────────────┐   │
│ │ [mini preview of hero] │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ ⊞ Content Cards           👁 │
│ ┌────────────────────────┐   │
│ │ [mini preview]         │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ + Add Section                │
│   → opens dialog with 16     │
│     section types, each with │
│     a preview thumbnail and  │
│     3-4 variant previews     │
└──────────────────────────────┘
```

Grandma sees pictures, not labels. She drags to reorder. She clicks the eye to hide. She clicks "Add Section" and sees a visual catalog of what she can add — each option shows what it looks like, not what it's called.

**The "Add Section" dialog is the key UX moment.** Instead of a scrollable text list with "Top Menu / Navigation bar with logo and links," she sees a grid of visual thumbnails grouped by purpose:

```
┌─────────────────────────────────────────────┐
│  ADD A SECTION                              │
│                                             │
│  HEADER & NAVIGATION                        │
│  [nav preview] [hero preview]               │
│                                             │
│  CONTENT                                    │
│  [cards] [gallery] [team] [blog]            │
│                                             │
│  SOCIAL PROOF                               │
│  [quotes] [numbers] [logos]                  │
│                                             │
│  CONVERSION                                 │
│  [pricing] [action] [questions]             │
│                                             │
│  STRUCTURE                                  │
│  [divider] [text] [image] [footer]          │
└─────────────────────────────────────────────┘
```

She picks by looking. Each thumbnail shows the actual section rendered in the current theme.

## Chat + Listen — The Grandma-First Features

You nailed this: chat and listen are grandma's primary interface. Not the right panel editor. She says "make it brighter" and it happens. She says "add reviews from customers" and a testimonials section appears.

The chat bar should be ALWAYS visible at the bottom of the left panel — not hidden behind a tab. It's the primary input for grandma, secondary for developers (who prefer clicking controls directly).

```
LEFT PANEL LAYOUT:

┌──────────────────────┐
│ [section list with   │
│  mini previews]      │
│                      │
│                      │
│                      │
│                      │
├──────────────────────┤
│ 💬 "Make it blue..." │  ← always visible, always ready
└──────────────────────┘
```

Listen mode stays as a tab — it's a conscious "I want to talk to this" action, not an always-on feature.

## The Progression Model

Here's how it feels for different users:

```
GRANDMA (minute 1-5):
  Picks an example → sees preview → types in chat "make it brighter"
  → clicks on hero text → edits in right panel (SIMPLE mode)
  → adds a section from visual catalog
  → clicks Blueprints → reads Human Spec → copies → emails nephew

FREELANCE DEV (minute 1-15):
  Same start as grandma → then clicks EXPERT on right panel
  → adjusts font weight, spacing, colors
  → opens Blueprints → copies Build Plan → pastes into Claude Code
  → reviews AISP for accuracy

AGENTIC ENGINEER (minute 1-30):
  Same start → then opens JSON tab to inspect config
  → validates AISP with aisp_validate
  → opens Resources for template reference
  → exports ZIP with all specs
  → integrates into existing codebase
```

**Same product. Same entry point. Complexity reveals as needed. Nobody is told they're in "grandma mode" — they're just building.**

## What Changes in Phase 15-16

| Change | Impact | Effort |
|--------|--------|--------|
| Left panel section list shows mini previews | Grandma picks visually | 2-3 hrs |
| "Add Section" becomes a visual catalog dialog | Grandma browses by looking | 2 hrs |
| Chat bar always visible at bottom of left panel (not behind a tab) | Grandma's primary input is always accessible | 1 hr |
| Right panel SIMPLE mode: max 5 controls per section (layouts + copy + image) | Grandma isn't overwhelmed | 2-3 hrs (audit all 16 sections) |
| Preview is the default center tab, Blueprints starts as secondary | Preview-first, specs when ready | 30 min |
| "Get My Specs" button in top bar → opens Blueprints with Human Spec selected | Grandma finds the output easily | 30 min |

**Total: ~10 hours of refinement spread across Phases 15-16.** Not a rewrite — a reorganization of what's already built. The features exist. The question is what's visible by default and what reveals on demand.

## The Pitch That Works for Both

The landing page doesn't say "developer spec tool" OR "grandma website builder." It says:

**"Describe what you want. See it build. Get the specs to make it real."**

Grandma reads: "I describe my bakery, see my website, get something to give my nephew."
Developer reads: "I describe the product, see the preview, get specs I can paste into Claude Code."
Same sentence. Different mental models. Both correct.


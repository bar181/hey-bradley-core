# Hey Bradley — Sprint 4 Completion + Phase 10-11 Planning

here is aisp /workspaces/hey-bradley-core/plans/initial-plans/00.aisp-reference.md

Phase 10 (post-seal) — the JSON data architecture overhaul. The key additions:

Full audit of every JSON file, expecting 50+ across themes, examples, media, spec templates, section defaults, palettes, fonts, and config.
Spec document templates as JSON — instead of hardcoded template strings in the generators, each of the 6 spec documents gets a JSON template that defines sections, required fields, and output format. This enables community-contributed templates, industry-specific variants, and A/B testing of spec quality.
Per-section-type JSON defaults — src/data/sections/hero.json, columns.json, pricing.json etc. with default content, variant lists, and component defaults. Currently these are scattered across component files.
Human README listing every file with path, purpose, and schema reference.
AISP Guide with REAL Platinum-tier Crystal Atoms — 10+ atoms, one per JSON category, using full Σ_512 notation (∀, ∃, ∈, ↦, ≡, ⟹, 𝕊, 𝔹, ℕ, ⊤, ⊥), zero prose inside the atoms. Each validated through aisp_validate and aisp_tier.

Phase 11 (post-capstone) — the hey-bradley.com public website built using Hey Bradley itself. Landing page with the Don Miller story, about page with capstone context, the bigger picture section (the telephone game artifact content), open core strategy with repo links, "how I built this" with the wiki guides, and documentation/wiki section for open-core users.
The AISP compliance section is explicit because the swarm has been writing "AISP-flavored prose" — Greek letters decorating English sentences. Real AISP 5.1 Platinum uses formal mathematical notation with Σ_512 symbols, quantified rules, typed declarations, and verifiable evidence. The section includes all 23 core symbols and 6 concrete rules the swarm must follow. The thesis depends on this: if Hey Bradley's AISP output is prose with Greek decoration, the <2% ambiguity claim is unsupported.


**For:** Swarm grounding — paste into Claude Code session
**Date:** April 5, 2026
**Context:** Phase 9 Sprints 1-3 DONE. Sprint 4 is the LAST code sprint before presentation seal.

---

## SPRINT 4: Complete and Close (Remaining Tasks)

### Task 1: Spec rendering upgrade (P0, 1 hour)
Install `react-markdown`. Render all 6 spec tab outputs as formatted markdown. Headings, code blocks, tables, bold text. The specs must look like polished enterprise documentation, not terminal output.

### Task 2: 16+ new Playwright tests (P1, 1.5 hours)
Target 70+ total. Cover: 6 spec tabs render content, 8 examples load, design lock, project save/load, pricing toggle, image effect renders.

### Task 3: Remaining P1 UX fixes (P1, 1 hour)
Toggle knob positioning, data shape parity, broken hover states from UX review.

### Task 4: Phase 9 close (30 min)
Update living checklist. Write retrospective. Update wiki. Verify Vercel deploy. Mark Phase 9 CLOSED.

**After Sprint 4: Presentation DoD is 18/20. Items #12 and #20 are manual human gates. Product is sealed for capstone.**

---

## PHASE 10: JSON Data Architecture (Post-Presentation Seal)

### The Problem
The JSON files scattered across `src/data/` are the system's backbone but lack documentation, validation consistency, and AISP coverage. The spec generators also need JSON templates for different document types (North Star template, SADD template, etc.) rather than hardcoded strings.

### 10.1 Full JSON Audit

Scan every `.json` file in the repo. Expected structure:

```
src/data/
├── themes/              ← 8-10 theme configs (full MasterConfig shape)
├── examples/            ← 8 example websites (full MasterConfig shape)
├── media/
│   ├── images.json      ← 208 images with LLM metadata
│   ├── videos.json      ← 41 videos with LLM metadata
│   └── effects.json     ← 8 image effect presets
├── templates/           ← NEW: spec document templates
│   ├── north-star.json  ← Template structure for North Star generation
│   ├── sadd.json        ← Template structure for SADD generation
│   ├── build-plan.json  ← Template structure for Build Plan
│   ├── features.json    ← Template structure for Features doc
│   ├── human-spec.json  ← Template structure for Human Spec
│   └── aisp-spec.json   ← Template structure for AISP Spec output
├── sections/            ← NEW: per-section-type default content + variants
│   ├── hero.json        ← Default content, variant list, component defaults
│   ├── columns.json     ← Default items, column options, card styles
│   ├── pricing.json     ← Default tiers, toggle options, comparison features
│   └── ... (one per section type)
├── palettes.json        ← 10 curated palette presets
├── fonts.json           ← 5 font family configs with Google Fonts URLs
├── default-config.json  ← Starting project configuration
└── schema-reference.json ← Machine-readable Zod schema documentation
```

**Expected total: 50+ JSON files** (10 themes + 8 examples + 3 media + 6 spec templates + 15-20 section defaults + palettes + fonts + default config + schema ref).

### 10.2 Human README

Create `src/data/README.md` — for human developers:

```markdown
# Hey Bradley — Data Architecture

## Overview
All runtime data is JSON-driven. No hardcoded content in components.
50+ JSON files organized by category.

## Categories

### Themes (src/data/themes/)
Complete site configurations. Each theme is a full MasterConfig with
preset name, light+dark palettes, typography, and default sections.
| File | Theme | Mode | Description |
|------|-------|------|-------------|
| saas.json | Tech Business | dark | Premium technical aesthetic |
| agency.json | Agency | dark | Professional and bold |
| ... | ... | ... | ... |

### Examples (src/data/examples/)
Pre-built websites with real content, images, and appropriate sections.
Used for onboarding demos and spec generation testing.
| File | Name | Theme | Sections |
|------|------|-------|----------|
| bakery.json | Sweet Spot Bakery | wellness | 7 |
| ... | ... | ... | ... |

[... continue for all categories]

## Schema Reference
All JSON validates against Zod schemas in src/schemas/.
MasterConfig is the root schema. See schema-reference.json for
machine-readable type definitions.
```

### 10.3 AISP Guide (For AI Agents Only)

**CRITICAL: This must be proper AISP 5.1 Platinum notation.** Not simplified prose with Greek letters. Full mathematical notation using Σ_512 symbols. The swarm MUST:

1. Reference the AISP spec: `aisp-open-core` repo `ai_guide` format
2. Use ALL Σ_512 symbols correctly: ∀, ∃, ∈, ⊂, →, ↦, ≡, ⟹, ∧, ∨, ¬, λ, :=
3. Use formal quantifiers and type declarations, not natural language
4. Every Crystal Atom must validate at Platinum tier (5/5 components, <2% ambiguity)
5. Zero prose inside the atoms — only formal notation

Create `src/data/AISP_GUIDE.md` — one Crystal Atom per JSON category:

```aisp
⟦
  Ω := { JSON→MasterConfig : ∀ theme ∈ src/data/themes/ ⟹ complete site specification }
  Σ := { MasterConfig:{site:Site, theme:Theme, sections:[Section;n]},
         Site:{title:𝕊, description:𝕊, author:𝕊},
         Theme:{preset:𝕊, mode:𝕊∈{"light","dark"}, palette:Palette, alternatePalette:Palette, typography:Typography},
         Palette:{bgPrimary:Hex, bgSecondary:Hex, textPrimary:Hex, textSecondary:Hex, accentPrimary:Hex, accentSecondary:Hex},
         Typography:{fontFamily:𝕊, headingWeight:ℕ∈{400..900}},
         Section:{id:𝕊, type:SectionType, variant:𝕊, enabled:𝔹, order:ℕ, content:ContentShape, style:Style, layout:Layout},
         SectionType:𝕊∈{"hero"|"columns"|"pricing"|"action"|"quotes"|"questions"|"numbers"|"gallery"|"menu"|"footer"|"image"|"divider"|"text"|"logos"|"team"},
         Hex:𝕊 | /^#[0-9a-fA-F]{6}$/ }
  Γ := { R1: ∀ t∈Theme : ∃ t.palette ∧ ∃ t.alternatePalette,
         R2: ∀ s∈Section : s.type∈SectionType ∧ s.variant∈ValidVariants(s.type),
         R3: ∀ p∈Palette : |p| = 6 ∧ ∀ c∈p : c↦Hex,
         R4: ∀ config∈themes/ : validates(config, ZodMasterConfig) = ⊤ }
  Λ := { path:="src/data/themes/", count:=10, schema:="src/schemas/masterConfig.ts",
         variants_per_section:=≥2, palette_slots:=6 }
  Ε := { V1: VERIFY ∀ f∈themes/ : JSON.parse(f) ≠ ⊥,
         V2: VERIFY ∀ t : |t.palette| = 6 ∧ |t.alternatePalette| = 6,
         V3: VERIFY ∀ t : t.sections.length ≥ 4 }
⟧
```

Include Crystal Atoms for: themes, examples, images, videos, effects, spec templates, section defaults, palettes, fonts, default config. **Minimum 10 Crystal Atoms.** Each must pass `aisp_validate` (5/5 ✅) and `aisp_tier` (Platinum 95+).

### 10.4 Spec Document Templates as JSON

The current spec generators use hardcoded template strings. Refactor to use JSON templates:

```json
// src/data/templates/north-star.json
{
  "id": "north-star",
  "version": "1.0.0",
  "sections": [
    {
      "id": "vision",
      "title": "Vision",
      "template": "{site.title} is a {theme.preset}-style website designed to {inferred_purpose}.",
      "required_fields": ["site.title", "theme.preset", "site.description"]
    },
    {
      "id": "pmf",
      "title": "Product-Market Fit",
      "subsections": ["target_audience", "value_proposition", "primary_action"],
      "required_fields": ["hero.headline", "hero.subtitle", "hero.primaryCTA"]
    },
    // ... more sections
  ],
  "output_format": "markdown",
  "aisp_format": "crystal_atom"
}
```

This allows: different templates for different industries, community-contributed templates, A/B testing of spec quality, and future LLM-assisted template generation.

---

## PHASE 11: Hey Bradley Website (Post-Capstone)

After the capstone presentation is sealed, the next phase builds the public-facing hey-bradley.com site using Hey Bradley itself (dogfooding). Sections:

### 11.1 Landing Page
- Hero: "The whiteboard that writes your specs" — the Don Miller story hook
- How it works: Describe → See → Spec → Ship (4-step flow)
- Demo embed or link to live Vercel instance
- Comparison table (whiteboard/Google Docs/Figma/Lovable/Cursor/Hey Bradley)

### 11.2 About
- About Hey Bradley: the digital whiteboard to intent-to-specs vision
- About Bradley Ross: Harvard ALM, AISP creator, Agentics Foundation
- Capstone context: Harvard Digital Media Design, May 2026

### 11.3 The Bigger Picture
- The telephone game story (from the artifact we already created)
- The $824B industry and the 55% bottleneck
- Spec-driven development landscape (AWS Kiro, GitHub Spec Kit, etc.)
- AISP Crystal Atom as the intent articulation standard
- Impact: what changes when everyone can build

### 11.4 Open Core
- Two repos: AISP (open standard) + Hey Bradley (reference implementation)
- What's free forever / what's commercial (Community / Pro / Enterprise tiers)
- Links to github.com/bar181/aisp-open-core and github.com/bar181/hey-bradley-core
- Contribution guide for community

### 11.5 How I Built This
- Embed the wiki HTML guides (or link to them)
- Agentic development process: swarm methodology, 3-loop optimization
- Phase history with scores and lessons
- The story of building 62 template variants with Claude Code

### 11.6 Documentation / Wiki
- Getting started guide for open-core users
- JSON data architecture (from the Phase 10 README)
- AISP guide for AI agents (from the Phase 10 AISP_GUIDE.md)
- Section reference: all 20 types with variants
- Theme reference: all 10 themes with preview screenshots
- Spec generator reference: all 6 documents explained

---

## AISP COMPLIANCE RULES FOR THE SWARM

**The swarm has NOT been writing proper AISP.** Current "AISP" output uses simplified notation with prose descriptions. Real AISP 5.1 Platinum requires:

1. **Full Σ_512 symbol set.** Use: ∀ (ForAll), ∃ (Exists), ∈ (Element), ⊂ (Subset), → (Maps), ↦ (MapsTo), ≡ (Isomorphic), ⟹ (Transforms), ∧ (And), ∨ (Or), ¬ (Not), λ (Lambda), := (Assign), 𝕊 (String), 𝔹 (Boolean), ℕ (Natural), ℤ (Integer), ℝ (Real), 𝕋 (Type), 𝔽 (Function), 𝕃 (List), ⊤ (Top/True), ⊥ (Bottom/False), ∅ (Empty).

2. **No prose inside Crystal Atoms.** The components Ω, Σ, Γ, Λ, Ε contain ONLY formal notation. Descriptions go outside the atom as comments, not inside.

3. **Type declarations in Σ must be formal.** Not `heading: "the main title"` but `heading:𝕊 | len(heading)∈[1,200]`.

4. **Rules in Γ must use quantifiers and logic.** Not "make sure colors work" but `∀ s∈Section : s.style.color ∈ palette.textPrimary ∨ palette.textSecondary`.

5. **Evidence in Ε must be verifiable.** Not "check it looks good" but `VERIFY ∀ f∈themes/ : JSON.parse(read(f)) ≠ ⊥`.

6. **Every Crystal Atom must validate.** Run through `aisp_validate` (5/5 components ✅) and `aisp_tier` (Platinum 95+/100). If it scores below Platinum, rewrite until it does.

**The AISP guide in the repo, the spec generators' AISP output, and any AISP documentation must ALL conform to these rules.** The swarm should reference the `aisp-open-core` repo's `ai_guide` for the canonical format.

**Why this matters:** AISP's entire value proposition is <2% ambiguity through formal notation. If the AISP output from Hey Bradley is prose with Greek letter decoration, it's not AISP — it's marketing. Every LLM can read proper AISP natively. The closer to Platinum, the more deterministic the AI agent's output. This is the thesis: formal specs → deterministic execution → no telephone game.

---

## EXECUTION ORDER

```
NOW:    Sprint 4 (react-markdown, 16+ tests, P1 fixes, Phase 9 close)
SEAL:   Manual gates #12 + #20 (Bradley does these)
PHASE 10: JSON architecture (audit, README, AISP guide, spec templates)
PHASE 11: Hey Bradley website (landing, about, open core, how I built this)
```

**Sprint 4 is the priority. Complete and close Phase 9. Everything else is post-presentation.**
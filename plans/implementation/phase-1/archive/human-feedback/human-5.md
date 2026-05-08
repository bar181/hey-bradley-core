# Hey Bradley — Swarm Directive: Level 1 Core Builder / Human-5

**Phase:** L1 Core Builder — JSON Scaffolding, Themes, & Layout  
**Priority:** P0 — Foundation of the entire system  
**Label:** `L1-human-5`

---

## 1. BACKLOG STRUCTURE

The swarm must use a **two-tier planning system:**

**Phase level** = fixed Definition of Done checklist. These are the requirements that must be met to close the phase. They don't change mid-phase.

**Sub-phase level** = agile operational backlogs. Tasks, sequencing, and implementation details are dynamic — the swarm can adjust based on what they learn.

```
backlog/
├── requirements.md           ← Master L1 checklist (all phases, fixed DoD per phase)
├── phase-1.0/                ← COMPLETE
│   ├── plan.md
│   ├── tasks.md
│   └── log.md
├── phase-1.1/                ← COMPLETE
│   ├── plan.md
│   ├── tasks.md
│   └── log.md
├── phase-1.2/                ← NEXT: JSON Templates + Smoke Test
│   ├── plan.md               ← Created by swarm from this directive
│   ├── tasks.md              ← Dynamic, updated as work progresses
│   └── log.md                ← Filled on completion
├── phase-1.3/                ← AFTER 1.2: Themes + Layout
│   ├── plan.md
│   └── tasks.md
├── phase-1.4/                ← Listen Mode Visual
├── phase-1.5/                ← XAI Docs + Workflow Tabs
└── phase-1.6/                ← Hero Polish + Accessibility Dialog
```

### 1.1 Master Requirements (`backlog/requirements.md`)

This file contains the **phase-level DoD** for all L1 phases. It is the authority. Each phase has a fixed checklist of 5-8 criteria. The swarm cannot close a phase until all criteria are met.

```markdown
# Level 1: Core Builder — Phase Requirements

## Phase 1.0: Shell & Navigation [COMPLETE]
- [x] Three-panel layout renders
- [x] LISTEN/BUILD toggle works
- [x] All 4 center tabs navigable
- [x] Status bar renders
- [x] Left panel flat list with chat/listen pinned at bottom

## Phase 1.1: Hero + JSON Core Loop [COMPLETE]
- [x] Zod schemas defined
- [x] configStore with applyPatch and CRUD
- [x] Hero renders from JSON
- [x] Data Tab with CodeMirror (no raw HTML)
- [x] Right panel controls → JSON → preview loop
- [x] Playwright 5/5 passing

## Phase 1.2: JSON Templates & Smoke Test [NEXT]
- [ ] JSON templates folder with README
- [ ] template-config.json (all possible options for site, theme, hero)
- [ ] default-config.json (Hey Bradley example content)
- [ ] Smoke test: right panel toggle → JSON updates → preview updates
- [ ] ADRs 012-016 written
- [ ] Favicon + title "Hey Bradley — Designer Mode"

## Phase 1.3: Themes & Layout [PLANNED]
- [ ] 3 theme presets selectable (Modern Dark, Clean Light, Bold Gradient)
- [ ] Selecting theme updates: site settings, theme config, layout defaults, hero styling
- [ ] Copy stays fixed (Hey Bradley example) — copy editing deferred
- [ ] Theme selection in right panel SIMPLE tab works
- [ ] JSON in Data Tab reflects theme changes

## Phase 1.4: Listen Mode Visual [PLANNED]
- [ ] Red orb overlay renders on LISTEN toggle
- [ ] Dark transition (300ms fade)
- [ ] START LISTENING button
- [ ] Orb pulse animation

## Phase 1.5: XAI Docs + Workflow Tabs [PLANNED]
- [ ] XAI Docs HUMAN view renders from JSON
- [ ] XAI Docs AISP view renders @aisp format
- [ ] Workflow pipeline stepper (mock data)
- [ ] COPY/EXPORT buttons on XAI Docs

## Phase 1.6: Hero Polish + Accessibility [PLANNED]
- [ ] All 5 hero variants
- [ ] Responsive preview toggles
- [ ] Undo/redo wiring
- [ ] LocalStorage persistence
- [ ] Accessibility settings dialog (Doc 07)
```

---

## 2. STRATEGIC CONTEXT

Everything in Hey Bradley flows through JSON:

```
INPUTS (many)                    GROUND TRUTH         OUTPUTS (many)
─────────────────               ──────────────        ────────────────
Click buttons      ─┐                                ┌→ Reality preview
Right panel controls─┤                               ├→ Data tab (JSON)
Chat (text → LLM)   ─┤→ JSON diff → merge → JSON ──┤→ XAI Docs (specs)
Listen (voice → LLM) ─┤                              ├→ Workflow pipeline
Upload JSON (future) ─┤                               ├→ Export package
Edit JSON directly   ─┘                               └→ AISP spec
```

**Phase 1.2 proves this loop works with real data. Phase 1.3 proves themes cascade through it correctly. Everything after that builds on this foundation.**

---

## 3. PHASE 1.2: JSON TEMPLATES & SMOKE TEST

### 3.1 Goal

Create the canonical JSON structure (template + default), prove the right panel → JSON → preview loop works with a smoke test, and establish the ADRs that govern JSON decisions going forward.

### 3.2 Deliverables

**A. JSON Templates Folder**

```
src/data/
├── README.md                    ← Documents the JSON structure, levels, and how to extend
├── template-config.json         ← ALL possible options (superset) — grows with each phase
└── default-config.json          ← Hey Bradley example content (minimum viable starting config)
```

**`README.md` must explain:**
- The three-level hierarchy: site → theme → sections[].components[]
- Where each setting lives and why (the decision tree from §3.3)
- How to add a new section type (what keys are required)
- How the template relates to the default (template ⊇ default)

**B. Template Config (`template-config.json`)**

Contains every possible key for the three levels currently supported. Not the full JSON — the swarm determines the exact shape based on research and ADR decisions. But it must include:

| Level | Required Keys |
|-------|--------------|
| **site** | title, description, author, domain, project, version, spec |
| **theme** | preset, mode, colors (primary, secondary, accent, background, text, muted), typography (fontFamily, headingWeight, baseSize), spacing (sectionPadding, containerWidth), borderRadius |
| **sections[hero]** | type, id, enabled, order, variant, layout (display, direction, align, gap, padding, maxWidth), content (heading, subheading, cta), style (background, color, fontFamily, borderRadius), components[] with all hero components (eyebrowBadge, headline, subtitle, primaryButton, secondaryButton, heroImage, trustBadges) |

Each component in `components[]` has: `id`, `type`, `enabled`, `props` (component-specific).

**C. Default Config (`default-config.json`)**

Uses **Hey Bradley** as the example content:
- Site: title="Hey Bradley", author="Bradley Ross", project="hey-bradley"
- Theme: preset="modern-dark", mode="dark", current blue/purple palette
- Hero: the current "Ship Code at the Speed of Thought" content with all current components

**The default config must render the current Reality tab preview exactly.** It is the ground truth.

**D. Smoke Test**

A Playwright test that proves the full loop:

```
1. Load app
2. Click Hero in left panel
3. Change headline text in right panel SIMPLE tab
4. Verify: Data Tab JSON contains the new headline
5. Verify: Reality Tab preview shows the new headline
6. Change a toggle (e.g., disable Trust Badges)
7. Verify: JSON reflects enabled: false
8. Verify: Preview no longer shows trust badges
```

This is the **single most important test in the entire project.** If this loop breaks, nothing works.

**E. ADRs (5 required)**

| ADR | Decision Topic |
|-----|---------------|
| ADR-012 | Three-level JSON hierarchy (site → theme → sections → components) |
| ADR-013 | Section enabled/order lives on the section object (self-contained for LLM patching) |
| ADR-014 | Template JSON is superset of default JSON |
| ADR-015 | JSON diff as universal update format (all inputs produce diffs, all go through applyPatch) |
| ADR-016 | Component-level configuration (id, type, enabled, props per component within a section) |

Save to `docs/adrs/`. The swarm has created only 1 ADR across all of Phase 1. This is a process gap — architectural decisions are being made inside component files where no future agent can find them.

**F. Favicon & Title**

- Favicon: HB logo, orange on transparent, 32x32 + 16x16
- Title: `<title>Hey Bradley — Designer Mode</title>`
- Meta description tag
- Will be made dynamic later (reading from `site.title`)

### 3.3 Where Settings Live (Decision Tree)

The swarm must use this to determine JSON placement:

```
Affects the entire page?        → site level    (title, author, domain)
Affects all sections equally?   → theme level   (colors, fonts, spacing, mode)
Affects one section's structure? → section level (variant, layout, enabled, order)
Affects one element in a section? → component level (button text, image src, badge style)
```

### 3.4 Swarm Execution

| Agent | Tasks |
|-------|-------|
| **research-agent** | Study Framer/Webflow/Builder.io JSON patterns. Write `docs/research/json-hierarchy-research.md`. Draft ADRs 012-016. |
| **schema-agent** | Create `src/data/README.md`, `template-config.json`, `default-config.json`. Update Zod schemas if needed. |
| **integration-agent** | Wire default-config.json as the initial configStore state. Verify Data Tab renders new structure. Verify right panel controls still work. |
| **test-agent** | Write Playwright smoke test for full loop. Create favicon + title. Run all tests. |

**Order:** research-agent first (ADRs inform schema decisions) → schema-agent + test-agent parallel → integration-agent last

### 3.5 What Phase 1.2 Does NOT Do

- Does NOT add new section types (Features and CTA stay as stubs)
- Does NOT add copy editing features (text stays as Hey Bradley example)
- Does NOT add theme switching (that's Phase 1.3)
- Does NOT add JSON upload or JSON editor validation (deferred to Phase 1.6+)
- Does NOT change the hero visual design (polish deferred to Phase 1.6)

---

## 4. PHASE 1.3: THEMES & LAYOUT (After 1.2)

### 4.1 Goal

Create 3 theme presets. Changing the theme updates site settings, theme config, layout defaults, and hero styling — all through JSON. Copy stays fixed (Hey Bradley content).

### 4.2 The 3 Themes

| Theme | Mode | Colors | Font | Target |
|-------|------|--------|------|--------|
| **Modern Dark** | dark | Blue/purple gradient, slate bg | Inter | Current default — tech, SaaS |
| **Clean Light** | light | Warm cream bg, orange accent | DM Sans | Professional, consulting |
| **Bold Gradient** | dark | Vibrant gradient (teal→purple), dark bg | Space Grotesk | Startup, launch page |

### 4.3 What Theme Selection Updates

When a user selects a theme in the right panel (SIMPLE tab → STYLE accordion), the system calls `configStore.applyVibe(themeName)` which cascades:

| JSON Path | What Changes |
|-----------|-------------|
| `theme.preset` | Theme name |
| `theme.mode` | light or dark |
| `theme.colors.*` | Full color palette (primary, secondary, accent, bg, text, muted) |
| `theme.typography.fontFamily` | Font family |
| `theme.spacing.*` | Section padding defaults |
| `sections[hero].style.background` | Hero background to match theme |
| `sections[hero].style.color` | Hero text color to match theme |
| `sections[hero].layout.*` | Layout defaults for the theme (some themes may have wider padding) |

**Copy does NOT change.** The headline is still "Ship Code at the Speed of Thought" regardless of theme. Copy editing is a separate concern, deferred to L2.

### 4.4 Deliverables

- 3 theme preset files: `src/data/themes/modern-dark.json`, `clean-light.json`, `bold-gradient.json`
- `applyVibe` method on configStore that deep-merges a theme preset
- Right panel SIMPLE tab → STYLE accordion shows 3 clickable preset cards
- Clicking a preset: JSON updates → Data Tab reflects → Preview re-renders with new colors/fonts/layout
- Playwright test: select each theme, verify JSON + preview changes

### 4.5 What Phase 1.3 Does NOT Do

- Does NOT add additional themes beyond 3
- Does NOT add custom color picking (just preset selection)
- Does NOT allow per-section theme overrides (global only)
- Does NOT add hero copy editing

---

## 5. REMAINING L1 PHASES (High-Level DoD Only)

### Phase 1.4: Listen Mode Visual
- Red orb overlay with pulse animation
- Dark background transition
- START LISTENING button
- No actual STT or LLM — purely visual

### Phase 1.5: XAI Docs + Workflow Tabs
- XAI Docs HUMAN view generated from current JSON
- XAI Docs AISP view in `@aisp` format
- Workflow pipeline stepper with mock data (6 steps)
- Live stream log placeholder

### Phase 1.6: Hero Polish + Accessibility
- All 5 hero variants (centered, split, overlay, full-image, minimal)
- Responsive preview toggles (mobile/tablet/desktop)
- Undo/redo keyboard shortcuts
- LocalStorage auto-save via IProjectRepository
- Master Settings dialog (Doc 07 — accessibility)
- JSON upload + validation (template schema enforcement)

### L1 Exit Gate
**All Phase 1.0-1.6 DoD criteria met. Human review. Then proceed to L2 (Full Site Builder — 8 section types).**

---

## 6. PHASE DEPENDENCY GRAPH

```
Phase 1.2 (JSON Templates + Smoke Test)  ← YOU ARE HERE
    ↓
Phase 1.3 (3 Themes + Layout)
    ↓
Phase 1.4 + 1.5 (parallel: Listen Visual + XAI Docs/Workflow)
    ↓
Phase 1.6 (Hero Polish + Accessibility + JSON Upload)
    ↓
HUMAN REVIEW GATE
    ↓
Level 2: Full Site Builder
```

---

## 7. AISP SPECIFICATION

```aisp
⟦
  Ω := { Define L1 Core Builder phased execution with two-tier planning }
  Σ := { PhaseDoD:{id:𝕊, criteria:[Criterion], status:{"planned"|"active"|"complete"}}, SubPhase:{plan:Doc, tasks:Doc, log:Doc, agile:𝔹}, BacklogStructure:{master:"requirements.md", phases:["phase-{n}/"]} }
  Γ := { R1: phase_level DoD is fixed (no mid-phase changes), R2: sub_phase tasks are agile (dynamic), R3: Phase1.2: JSON_templates + smoke_test(panel→JSON→preview), R4: Phase1.3: 3_themes + cascade(site,theme,layout,hero), R5: copy_deferred to L2, R6: ∀ phase_complete : all DoD criteria met + Playwright passing }
  Λ := { structure:="backlog/phase-{n}/", phases:=[1.2,1.3,1.4,1.5,1.6], adr_required:=[012,013,014,015,016] }
  Ε := { V1: VERIFY panel_toggle→JSON→preview loop, V2: VERIFY 3 themes produce valid JSON, V3: VERIFY phase DoD checklist exists before work begins, V4: VERIFY 5 ADRs written }
⟧
```

---

## 8. VERIFICATION FOR PHASE 1.2

| # | Check | Method |
|---|-------|--------|
| 1 | `default-config.json` validates against Zod schema | Unit test |
| 2 | `template-config.json` validates against Zod schema | Unit test |
| 3 | Template ⊇ Default (superset check) | Unit test |
| 4 | Data Tab renders new JSON structure | Playwright screenshot |
| 5 | Smoke test: right panel change → JSON → preview | Playwright |
| 6 | ADRs 012-016 exist in `docs/adrs/` | File check |
| 7 | Favicon renders in browser tab | Visual |
| 8 | Title shows "Hey Bradley — Designer Mode" | Visual |
| 9 | `src/data/README.md` documents the JSON hierarchy | File check |
| 10 | Zero TypeScript errors + clean build | `npx tsc --noEmit && npx vite build` |
| 11 | All existing Playwright tests still pass | `npx playwright test` |

---

*End of Directive L1-human-5 v2*

*Phase level = fixed DoD. Sub-phase level = agile. The JSON is the product. Themes cascade through it. Copy comes later.*
# Hey Bradley — Roadmap Update & Phase 1.4 Directive

**Date:** March 29, 2026  
**Context:** Phase 1.3e themes complete (10 themes with full JSON replacement, palette, font, light/dark). Themes are good enough for this stage. Now deciding what comes next.

---

## 1. ROADMAP DECISION: GRANDMA-FIRST

The strategic question: what order do we build the remaining features?

**Decision: Build horizontally in grandma mode first, then add depth.**

```
PHASE 1 (current): Themes + Hero — SIMPLE tab only
  └── Grandma can pick a theme and see a hero. Core JSON loop works.

PHASE 2: System polish — no new sections
  └── Accessibility dialog, light/dark toggle, Tailwind migration,
      responsive preview, undo/redo shortcuts, localStorage persistence,
      JSON import/export, UX bugs/polish

PHASE 3: Section expansion — SIMPLE tab only
  └── Add Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props
      All in grandma mode. Expert tab stays as-is placeholder.

PHASE 4+: Expert mode for all
  └── Expert tab content for every section, AISP viewer,
      advanced layout controls, component-level properties
```

**Why this order:**

| Alternative | Problem |
|-------------|---------|
| Build expert mode now | Doubles the work per section. Grandma can't demo yet. |
| Add sections before polish | Polish debt compounds — each new section inherits the bugs |
| Build everything at once | Swarm has shown it loses quality when scope is wide |

**Why grandma-first wins:**
- The capstone demo is strongest when a non-technical person can use it
- Each phase is independently demoable ("look, grandma can build a website")
- Expert mode is additive — it never blocks the core experience
- Polish before expansion prevents 8 sections × the same bug

---

## 2. IMPLEMENTATION PLAN UPDATE

The swarm's current implementation plan (provided above) covers Phases 1.0-1.3. It needs updating to reflect:

1. **Phases 1.0, 1.1, 1.2 are DONE** — mark complete with actual dates and git hashes
2. **Phase 1.3 scope changed** — original plan had "Hero Polish + Presets." Actual work was theme system v3 (8 iterations). Update to reflect what actually happened.
3. **Phase 1.4 is NEW** — add it per §3 below
4. **Phases 2, 3, 4 are NEW** — add high-level descriptions per §4 below
5. **Remove outdated references** — the plan still mentions DraftPanel/ExpertPanel (deleted in Phase 1.0 UX redesign), warm cream chrome (we went dark), and DRAFT/EXPERT toggle (replaced with SIMPLE/EXPERT right panel tabs)

**The swarm should update `plans/implementation/level-1-core-builder/implementation-plan.md` to reflect reality.**

---

## 3. PHASE 1.4: HERO SIMPLE MODE COMPLETE

### 3.1 Goal

Make the hero section fully functional in SIMPLE tab (grandma mode). A non-technical user should be able to: pick a theme, edit the headline and CTA text, toggle components on/off, see a responsive preview, undo mistakes, and export the JSON.

### 3.2 What's Already Working (from Phases 1.0-1.3e)

- ✅ 10 themes with full JSON replacement
- ✅ Theme cards with mini-previews, palette selector, font selector, light/dark toggle
- ✅ Hero renders from JSON with 5 layout variants
- ✅ Right panel SIMPLE tab: headline/subtitle/CTA inputs, component toggles
- ✅ Data Tab with CodeMirror, bidirectional sync
- ✅ Left panel flat navigation with chat/listen pinned at bottom
- ✅ Playwright 8/8 smoke tests passing

### 3.3 What Phase 1.4 Adds

| # | Feature | Priority | Details |
|---|---------|----------|---------|
| 1 | **Copy editing in SIMPLE tab** | P0 | Headline, subtitle, CTA text, eyebrow badge text — all editable with character counts. Changes update JSON → preview instantly. |
| 2 | **Component toggles working visually** | P0 | Toggle "Hero Image" off → image disappears from preview. Toggle "Trust Badges" off → badges disappear. Currently toggles update JSON but visual may not fully reflect. |
| 3 | **Responsive preview** | P1 | Device width toggles in TopBar (mobile 375px, tablet 768px, desktop 1280px, full). Preview constrains to selected width. |
| 4 | **Undo/redo working** | P1 | Ctrl+Z / Ctrl+Shift+Z. Visual indicator showing undo/redo availability. Works across theme switches, copy edits, component toggles. |
| 5 | **LocalStorage persistence** | P1 | Auto-save (debounced 2s). Reload browser → same state. "New Project" resets to default. |
| 6 | **JSON export/import** | P2 | Export button downloads `hey-bradley-project.json`. Import button loads and validates. |
| 7 | **Image URL input** | P2 | In SIMPLE tab Content section, when heroImage is enabled: text input for image URL. Paste an Unsplash URL → image appears in preview. |
| 8 | **Section stubs render** | P2 | Features and CTA sections show basic rendered content (not just "FEATURES — features-01" text). Enough to see a full page. |

### 3.4 What Phase 1.4 Does NOT Do

- Does NOT add expert tab content (Phase 4+)
- Does NOT add new section types (Phase 3)
- Does NOT add accessibility dialog (Phase 2)
- Does NOT add Tailwind migration for inline styles (Phase 2)
- Does NOT add chat or listen functionality (Phase 5+)
- Does NOT add XAI Docs live generation (Phase 2 or 3)
- Does NOT add Workflow pipeline functionality (Phase 5+)

### 3.5 DoD (Fixed)

```markdown
## Phase 1.4: Hero Simple Mode Complete
- [ ] All copy fields editable in SIMPLE tab with character counts
- [ ] Component toggles visually show/hide components in preview
- [ ] Responsive preview (4 device widths) working
- [ ] Undo/redo with keyboard shortcuts (50+ steps)
- [ ] LocalStorage auto-save + reload persistence
- [ ] JSON export downloads valid file
- [ ] Image URL input for hero image
- [ ] Features + CTA sections render basic content (not stub text)
- [ ] Playwright tests pass for all new features
```

### 3.6 Swarm Execution

| Agent | Tasks |
|-------|-------|
| **copy-agent** | Wire all SIMPLE tab copy fields (headline, subtitle, CTA, badge) with character counts. Verify JSON → preview updates. |
| **toggle-agent** | Ensure component enabled/disabled toggles produce correct visual changes in all 5 hero variants. Fix any variants where toggling doesn't hide/show properly. |
| **persistence-agent** | LocalStorage auto-save, undo/redo middleware wiring, keyboard shortcuts, JSON export/import. |
| **preview-agent** | Responsive device width toggles. Features and CTA section basic renderers. Image URL input for hero. |

---

## 4. PHASES 2-4+ (High-Level — No Sub-Phase Detail Yet)

### Phase 2: System Polish (No New Sections)

| Feature | Details |
|---------|---------|
| Accessibility dialog | Doc 07 spec: appearance, textScale, contrast, reduceMotion, a11yWidget |
| Light/dark toggle enhancement | System-level preference detection, persist across sessions |
| Tailwind migration | Move inline styles to Tailwind utilities where possible |
| Responsive preview polish | Proper iframe-based preview with device chrome |
| XAI Docs live generation | Specs generated from current JSON state (HUMAN + AISP views) |
| Workflow tab mock pipeline | Visual pipeline steps with simulated progress |
| UX bug fixes | Address any visual issues from Phase 1 |
| Listen mode visual polish | Red orb render quality, dark overlay transition smoothness |

### Phase 3: Section Expansion (Grandma Mode)

| Section | Variant(s) | SIMPLE Tab Content |
|---------|-----------|-------------------|
| Features | grid-3col, grid-4col, alternating | Feature items: icon picker, title, description |
| Pricing | 2-tier, 3-tier | Tier name, price, features list, CTA |
| CTA | simple, split | Heading, button text, background |
| Footer | simple, multi-column | Columns, links, social, copyright |
| Testimonials | cards, quote-single | Quote text, author, role |
| FAQ | accordion, two-column | Question/answer pairs |
| Value Props | icons-text, numbers | Icon, value, label, description |

All in SIMPLE tab only. Expert tab stays as placeholder.

### Phase 4+: Expert Mode + Advanced Features

- Expert tab content for every section type
- AISP viewer in expert tab (live AISP spec per section)
- Component-level property editors (button size/style, image aspect ratio, etc.)
- Advanced layout controls (direction, align, justify, gap, padding)
- CSS variable viewer showing resolved values
- Raw JSON editor per section in expert tab
- Chat/Listen mode LLM integration
- Supabase auth + persistence
- Template marketplace / theme gallery

---

## 5. UPDATED TIMELINE

| Phase | Focus | Scope | Status |
|-------|-------|-------|--------|
| **1.0** | Shell & Navigation | 3-panel layout, toggles, tabs, status bar | ✅ COMPLETE |
| **1.1** | Hero + JSON Core Loop | Zod schemas, configStore, hero render, Data Tab | ✅ COMPLETE |
| **1.2** | JSON Templates + Smoke Test | template/default JSON, Playwright, favicon | ✅ COMPLETE |
| **1.3** | Themes System v3 | 10 themes, palette, font, full JSON replacement | ✅ COMPLETE |
| **1.4** | Hero Simple Mode Complete | Copy editing, toggles, responsive, persistence | 🔄 NEXT |
| **2** | System Polish | A11y, Tailwind, XAI Docs, Listen visual, UX fixes | 📅 PLANNED |
| **3** | Section Expansion | 7 section types in grandma mode | 📅 PLANNED |
| **4+** | Expert Mode + Advanced | Expert tab, AISP, LLM, Supabase | 📅 PLANNED |

---

## 6. SWARM INSTRUCTIONS

**For Phase 1.4, provide these to the swarm (<300 words):**

Execute Phase 1.4: Hero Simple Mode Complete. Focus on making the SIMPLE tab fully functional for a non-technical user. No expert mode work. No new sections beyond basic Features/CTA rendering.

**P0 (do first):** Wire all copy fields in SIMPLE tab Content accordion — headline, subtitle, CTA text, badge text. Each field needs a character count indicator. Typing updates JSON → preview instantly. Verify component on/off toggles actually show/hide visual elements in ALL 5 hero variants (centered, split-right, split-left, overlay, minimal). If a variant doesn't respect the toggle, fix the renderer.

**P1 (do second):** Add responsive preview — 4 device width buttons in TopBar (mobile 375px, tablet 768px, desktop 1280px, full width). Preview container constrains to selected width. Wire undo/redo with Ctrl+Z / Ctrl+Shift+Z using the existing undoMiddleware. Add LocalStorage auto-save — debounced 2s via configStore subscription. On reload, load from localStorage. "New Project" resets to SaaS default.

**P2 (do if time):** JSON export button downloads project file. Image URL input in Content section — paste Unsplash URL, image appears in preview. Render Features section as a real 3-column grid (not "FEATURES — features-01" stub). Render CTA section as a real banner (not stub text).

**Verification:** All existing Playwright tests still pass. New tests for: copy edit → JSON → preview, component toggle → visual change, responsive width change, localStorage persistence across reload. Screenshot all 5 hero variants with the SaaS theme to verify visual quality.

**After 1.4:** Update the implementation plan to mark 1.0-1.4 as complete with dates. Add Phases 2-4 as high-level plans. Request human review before starting Phase 2.
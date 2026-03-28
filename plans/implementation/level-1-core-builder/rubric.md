# Level 1: Core Builder — Quality Rubric & Scorecard

## Scoring Guide

| Score | Meaning |
|-------|---------|
| 0 | Not started |
| 1 | Started but incomplete |
| 2 | Functional but needs polish |
| 3 | Complete and meets requirements |
| 4 | Exceeds requirements — production quality |

---

## Phase 1.0 — Shell & Navigation Scorecard

| # | Requirement | Score (0-4) | Notes |
|---|------------|-------------|-------|
| 1.0.1 | Vite + React + TS + Tailwind + shadcn scaffold runs | 4 | Build passes, dev server runs clean |
| 1.0.2 | Path aliases (`@/*`) configured | 4 | tsconfig + vite.config both configured |
| 1.0.3 | AppShell with top bar (logo, project name, version badge) | 3 | HB logo, "Untitled Project", V1.0.0-RC1 badge all render |
| 1.0.4 | ModeToggle (LISTEN/BUILD + DRAFT/EXPERT pill toggles) | 3 | Both toggles work, orange active state, orb indicator on LISTEN |
| 1.0.5 | PanelLayout (three resizable panels, warm cream handles) | 3 | Resizable, collapsible, subtle hover handles |
| 1.0.6 | TabBar (REALITY, DATA, XAI DOCS, WORKFLOW) with active styling | 3 | All 4 tabs navigate, orange underline on active |
| 1.0.7 | StatusBar (monospace, READY/MODE indicators) | 3 | Green dot + "READY AISP SPEC V1.2", dynamic MODE display |
| 1.0.8 | ChatInput (mic + text + send) | 3 | Mic icon, placeholder text, send button — visual only |
| 1.0.9 | Draft left panel placeholder (vibe cards, section list) | 3 | 3 vibes with colored dots, Warm selected, section list with arrows |
| 1.0.10 | Expert left panel placeholder (accordion property inspector) | 3 | LAYOUT expanded with property rows, CONTENT/STYLE/SECTIONS collapsed |
| 1.0.11 | Draft right panel placeholder (headline input, layout selector) | 3 | HERO header, headline input, 3 layout icons, "More options" link |
| 1.0.12 | Expert right panel placeholder (layout/content/style sections) | 3 | Direction/align/padding/gap controls, headline/subtitle textareas, color swatches |
| 1.0.13 | All 4 tab placeholders render correctly | 3 | Reality (dashed preview), Data (mock JSON), XAI Docs (HUMAN/AISP toggle), Workflow (6 pipeline steps) |
| 1.0.14 | Warm cream design system applied (#faf8f5 bg, #e8772e accent) | 3 | Correct colors, DM Sans + JetBrains Mono fonts, monospace labels |
| 1.0.15 | Zero console errors | 3 | Clean build, no TypeScript errors |
| 1.0.16 | Looks like a real product (wow factor) | 3 | Warm precision aesthetic achieved — needs human review for final 4 |

**Phase 1.0 Total: 50 / 64** (avg 3.1 — meets requirements, pending human review for "exceeds")

---

## Phase 1.1 — Hero + JSON Core Loop Scorecard

| # | Requirement | Score (0-4) | Notes |
|---|------------|-------------|-------|
| 1.1.1 | Zod schemas for layout, style, section, masterConfig, patch | 0 | |
| 1.1.2 | Hero-specific Zod schema (heading, subheading, cta) | 0 | |
| 1.1.3 | Type exports via `z.infer` (no manual duplication) | 0 | |
| 1.1.4 | configStore with applyPatch, applyVibe, section management | 0 | |
| 1.1.5 | Deep merge utility (objects merge, arrays replace, null deletes) | 0 | |
| 1.1.6 | Undo middleware (100-state history stack) | 0 | |
| 1.1.7 | HeroCentered renders from configStore (CSS from JSON, not hardcoded) | 0 | |
| 1.1.8 | DataTab with syntax highlighting (keys, strings, numbers, brackets) | 0 | |
| 1.1.9 | DataTab bidirectional: edit JSON updates preview and controls | 0 | |
| 1.1.10 | Draft controls wired to configStore (vibe cards, headline input) | 0 | |
| 1.1.11 | Expert controls wired to configStore (property inspector, accordions) | 0 | |
| 1.1.12 | Preview re-render < 100ms after any change | 0 | |

**Phase 1.1 Total: 0 / 48**

---

## Phase 1.2 — All Tabs + Listen Mode Visual Scorecard

| # | Requirement | Score (0-4) | Notes |
|---|------------|-------------|-------|
| 1.2.1 | XAIDocsTab with HUMAN/AISP sub-toggle | 0 | |
| 1.2.2 | Human view renders structured spec from config | 0 | |
| 1.2.3 | AISP view renders @aisp formatted syntax with orange highlighting | 0 | |
| 1.2.4 | COPY + EXPORT buttons on XAI DOCS tab | 0 | |
| 1.2.5 | WorkflowTab with 6 pipeline steps and correct status icons | 0 | |
| 1.2.6 | Live stream output log panel in WorkflowTab | 0 | |
| 1.2.7 | ListenOverlay dark transition (300ms fade to #0a0a0f) | 0 | |
| 1.2.8 | RedOrb 3-layer CSS (solid core, blurred mid-ring, ambient glow) | 0 | |
| 1.2.9 | Orb pulse animation (2s ease-in-out, 1.2s when LISTENING) | 0 | |
| 1.2.10 | Typewriter effect (character-by-character, monospace, system brevity) | 0 | |
| 1.2.11 | StartListeningButton (centered below orb, pill shape) | 0 | |
| 1.2.12 | Features section template (3-column card grid from config) | 0 | |
| 1.2.13 | CTA section template (banner with heading + button from config) | 0 | |
| 1.2.14 | Section click-to-select with dashed orange border | 0 | |

**Phase 1.2 Total: 0 / 56**

---

## Phase 1.3 — Hero Polish + Presets Scorecard

| # | Requirement | Score (0-4) | Notes |
|---|------------|-------------|-------|
| 1.3.1 | HeroSplit variant (two-column: content left, image right) | 0 | |
| 1.3.2 | HeroOverlay variant (background image with text overlay) | 0 | |
| 1.3.3 | HeroFullImage variant (full-bleed image, centered text) | 0 | |
| 1.3.4 | HeroMinimal variant (text only, maximum whitespace) | 0 | |
| 1.3.5 | All 5 variants look professional with default config | 0 | |
| 1.3.6 | 6-8 preset hero configs (one per vibe variation) | 0 | |
| 1.3.7 | Responsive preview toggle (375px / 768px / 1280px / 100%) | 0 | |
| 1.3.8 | Undo/redo works for 50+ steps (Ctrl+Z / Ctrl+Shift+Z) | 0 | |
| 1.3.9 | Auto-save persists across page reloads (debounced 2s) | 0 | |
| 1.3.10 | JSON export produces valid downloadable file | 0 | |
| 1.3.11 | JSON import restores state with Zod validation | 0 | |
| 1.3.12 | Reset to default with confirmation dialog | 0 | |

**Phase 1.3 Total: 0 / 48**

---

## Overall Level 1 Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Total requirements scored | 54/54 | 0/54 | NOT STARTED |
| Maximum possible score | 216 | 0 | NOT STARTED |
| Average quality score | >= 3.0 | 0.0 | NOT STARTED |
| Console errors | 0 | — | NOT STARTED |
| Performance (render < 100ms) | Yes | — | NOT STARTED |
| Visual polish (designer approval) | Yes | — | NOT STARTED |
| Playwright tests passing | 100% | — | NOT STARTED |

---

## How to Update This Rubric

1. After completing a phase, run the Playwright test suite for that phase
2. Score each requirement based on test results and visual inspection
3. Update the score column and add notes explaining the score
4. Recalculate phase totals and overall metrics
5. Any requirement scoring below 3 should have a follow-up action noted

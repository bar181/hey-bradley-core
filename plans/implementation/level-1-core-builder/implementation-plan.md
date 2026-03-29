# Level 1: Core Builder — Master Checklist

**Last Updated:** 2026-03-29
**Status:** Phase 1.3 COMPLETE, Phase 1.4 NEXT

---

## Phase 1.0 — Shell & Navigation ✅ COMPLETE
**Score: 55/64 (86%) | Sessions 1-3 | Commits: scaffold through dark-pivot**

- [x] Vite + React + TS + Tailwind + shadcn scaffold — 4/4
- [x] Path aliases (`@/*`) — 4/4
- [x] AppShell with TopBar (logo, project name, version) — 3/4
- [x] LISTEN/BUILD toggle — 4/4
- [x] Three-panel resizable layout — 4/4
- [x] TabBar (REALITY, DATA, XAI DOCS, WORKFLOW) — 4/4
- [x] StatusBar (monospace, READY indicator) — 3/4
- [x] ChatInput (mic + text + send) — 3/4
- [x] Left panel navigation (Theme + section list) — 4/4
- [x] Right panel SIMPLE tab — 3/4
- [x] Right panel EXPERT tab — 3/4
- [x] Left-to-right panel context wiring — 3/4
- [x] All 4 tab placeholders render — 3/4
- [x] Dark Precision design system — 4/4
- [x] Zero console errors — 4/4
- [x] Looks like a real product — 3/4

---

## Phase 1.1 — Hero + JSON Core Loop ✅ COMPLETE
**Score: 33/48 (69%) | Session 4 | Commits: configStore, schemas, DataTab hotfix**

- [x] Zod schemas (layout, style, section, masterConfig, patch) — 4/4
- [x] configStore (Zustand) — 4/4
- [x] HeroCentered renders from JSON — 3/4
- [x] DataTab live JSON display — 1/4 *(rebuilt with CodeMirror, functional)*
- [x] DataTab JSON editing — 1/4 *(functional but basic)*
- [x] Draft controls update configStore — 3/4
- [x] Expert controls update configStore — 3/4
- [x] Bidirectional sync (JSON ↔ preview) — 2/4
- [x] Config change → visual update <100ms — 3/4
- [x] Deep merge utility — 4/4
- [x] Undo/redo (100 states in store) — 3/4
- [x] Zero console errors — 2/4

---

## Phase 1.2 — JSON Templates + ADRs + Smoke Test ✅ COMPLETE
**Score: ~38/48 (est) | Session 5 | Commits: template-config, ADR-012–016**

- [x] ADR-012: Three-level JSON hierarchy — 4/4
- [x] ADR-013: Section self-containment — 4/4
- [x] ADR-014: Template superset — 4/4
- [x] ADR-015: JSON diff universal update — 3/4
- [x] ADR-016: Component-level configuration — 4/4
- [x] `default-config.json` (starting config) — 3/4
- [x] `template-config.json` (superset template) — 3/4
- [x] Component schema with enabled/order/props — 4/4
- [x] `resolveHeroContent()` compat bridge — 3/4
- [x] Playwright 8/8 smoke tests — 3/4
- [x] Favicon + meta tags — 3/4
- [x] Section types enum (hero, features, pricing, cta, etc.) — 3/4

---

## Phase 1.3 — Theme System v3 ✅ COMPLETE
**Score: ~72/88 (est) | Sessions 6-9 | Commits: 1.3a through 1.3e**

### 1.3a-d: Theme iterations (8 total)
- [x] 10 theme JSON files with full structure — 3/4
- [x] `applyVibe()` full JSON replacement (preserves copy only) — 4/4
- [x] 4 hero variants working (centered, split, overlay, minimal) — 3/4
- [x] Theme cards in right panel — 3/4

### 1.3e: Theme system v3 (research → ADRs → build)
- [x] Research doc: `docs/research/theme-and-hero-research.md` — 3/4
- [x] ADR-017: Invisible design naming — 4/4
- [x] ADR-018: Theme meta schema — 4/4
- [x] ADR-019: 6-slot palette system — 4/4
- [x] ADR-020: Component visibility matrix — 4/4
- [x] 10 invisible-design themes (SaaS through Minimalist) — 3/4
- [x] Component visibility matrix enforced per theme — 3/4
- [x] 5 layout variants used (centered, split-right, split-left, overlay, minimal) — 4/4
- [x] `palettes.json` (50 palettes: 5 per theme × 10 themes × 6 slots) — 3/4
- [x] `fonts.json` (5 fonts with Google Fonts URLs) — 3/4
- [x] `media.json` (50 images + 20 videos, all URLs verified 200) — 3/4
- [x] Theme registry `index.ts` — 3/4
- [x] `resolveColors.ts` bridge (palette ↔ colors backward compat) — 4/4
- [x] configStore: `applyPalette()`, `applyFont()`, `toggleMode()` — 3/4
- [x] Zod schema: paletteSchema, themeMetaSchema, alternativePaletteSchema — 4/4
- [x] ThemeSimple: 2-column grid, accordion layout, meta-driven — 3/4
- [x] PaletteSelector: 5 rows × 6 dots — 3/4
- [x] FontSelector: 5 font buttons — 3/4
- [x] Hero renderers use `resolveColors()` — 3/4
- [x] 2 video themes (Startup, Creative), 2 bg-image (Portfolio, Wellness), 1 no-image (Minimalist) — 4/4
- [x] Build passes clean — 4/4

### 1.3 hotfixes
- [x] HeroCentered: renders inline heroImage below content — 3/4
- [x] HeroSplit: uses resolveColors, checks enabled flag — 3/4
- [x] Creative video URL fixed (857251→1093662) — 4/4
- [x] default-config.json aligned with SaaS theme — 3/4
- [x] applyVibe: only preserves URL from button components — 4/4

---

## Phase 1.4 — Hero Simple Mode Complete 🔄 NEXT

### P0 — Must Have
- [ ] Copy editing: headline, subtitle, CTA text, badge text in SIMPLE tab with char counts → **1.4**
- [ ] Component toggles: on/off visually show/hide in ALL 5 hero variants → **1.4**

### P1 — Should Have
- [ ] Responsive preview: 4 device widths (mobile/tablet/desktop/full) in TopBar → **1.4**
- [ ] Undo/redo: Ctrl+Z / Ctrl+Shift+Z, 50+ steps, visual indicator → **1.4**
- [ ] LocalStorage auto-save: debounced 2s, reload persistence, "New Project" reset → **1.4**

### P2 — Nice to Have
- [ ] JSON export: downloads `hey-bradley-project.json` → **1.4**
- [ ] Image URL input: paste Unsplash URL → image in preview → **1.4**
- [ ] Features section: renders real 3-col grid (not stub text) → **1.4**
- [ ] CTA section: renders real banner (not stub text) → **1.4**

---

## Phase 2+ — Future (Not Phase 1)

| Feature | Phase |
|---------|-------|
| Light/dark mode with per-theme palette pairs | 2 |
| Accessibility dialog (doc 07 spec) | 2 |
| Tailwind migration for inline styles | 2 |
| Google Fonts dynamic loading | 2 |
| XAI Docs live generation (HUMAN + AISP) | 2 |
| Workflow tab mock pipeline | 2 |
| Listen mode visual polish (red orb, overlay) | 2 |
| Responsive preview iframe with device chrome | 2 |
| Custom color palette picker UI | 2 |
| Playwright screenshots for all themes | 2 |
| Features section (grid-3col, grid-4col, alternating) | 3 |
| Pricing section (2-tier, 3-tier) | 3 |
| CTA section advanced (split variant) | 3 |
| Footer section (simple, multi-column) | 3 |
| Testimonials section | 3 |
| FAQ section (accordion, two-column) | 3 |
| Value Props section | 3 |
| Expert tab content for all sections | 4+ |
| AISP viewer per section | 4+ |
| Component-level property editors | 4+ |
| Chat/Listen mode LLM integration | 5+ |
| Supabase auth + persistence | 5+ |
| Template marketplace | 5+ |

---

## Timeline

| Phase | Focus | Status |
|-------|-------|--------|
| 1.0 | Shell & Navigation | ✅ COMPLETE |
| 1.1 | Hero + JSON Core Loop | ✅ COMPLETE |
| 1.2 | JSON Templates + ADRs + Smoke Test | ✅ COMPLETE |
| 1.3 | Theme System v3 (10 themes, palette, fonts) | ✅ COMPLETE |
| 1.4 | Hero Simple Mode Complete | 🔄 NEXT |
| 2 | System Polish (a11y, Tailwind, XAI, UX) | 📅 PLANNED |
| 3 | Section Expansion (7 sections, grandma mode) | 📅 PLANNED |
| 4+ | Expert Mode + Advanced | 📅 PLANNED |

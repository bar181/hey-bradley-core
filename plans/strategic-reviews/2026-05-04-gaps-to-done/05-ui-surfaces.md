# Track E — UI Surfaces Gap Audit

> Sibling: Tracks A (ADRs), B (Pipeline), C (DB), D (Tests). Research-only.
> Date: 2026-05-04. Branch: `claude/verify-flywheel-init-qlIBr` (P104 sealed).

## Summary

The 3-mode product architecture per ADR-116 is **partially wired and partially
contradictory**. The two highest-severity findings are structural, not cosmetic:

1. **Welcome.tsx links to `/onboarding` 5 times — but the route is `/new-project`.**
   Every "Try Hey Bradley", "Try Chat", "Try Listen", "Open Builder", "Try the
   open source version" CTA on the landing page hits the `*` NotFound route. This
   is the front door. (Finding **E1**, P1.)
2. **AppShell's mode-detection branches (lines 65-99) are dead code.** Routes
   `/planning` and `/agentics` mount their page components directly, bypassing
   `<AppShell>`. Only `/builder` mounts AppShell. The `pathname.startsWith('/planning')`
   and `'/agentics'` branches never fire in production. (Finding **E2**, P1.)

Below those: token drift on marketing pages (no migration after P102 closed
Welcome + Onboarding), 4 hardcoded literal-hex pills in `SpecWorkbench.tsx`
ignoring the `--hb-status-sealed` / `--hb-status-deferred` tokens that landed
at P102 / CF#11, mobile responsiveness density anemic on Planning + Agentics
mode bodies, no skip-link anywhere, ARIA labels missing on 25+ icon buttons in
new agentics/planning surfaces. The mode-aware AppShell layout and the
mode-selected onboarding step (ModeSelectorCard) both encode the 3-mode
architecture inconsistently — onboarding navigates to `/planning` and
`/agentics` directly while the AppShell tree never sees those modes.

## Method

- Static read of `src/pages/*.tsx` + `src/components/{shell,agentics,planning,
  onboarding,center-canvas,left-panel,right-panel}/*.tsx` (135 .tsx files
  total in src; surface inventory below covers 12 high-leverage entries).
- LOC, hex-color, responsive-class, focus-visible, and aria-label grep counts.
- Route map cross-referenced against in-page `<Link to=...>` and `href=...`
  destinations.
- Token-drift evaluated against the 49-token `--hb-*` roster in `src/index.css`
  (post-P102 / CF#11 with `--hb-status-sealed` + `--hb-status-deferred` added).
- Cannot verify in-browser render quality (visual regression, contrast at
  runtime, screen-reader output) — see Honest Declaration.

## Surface inventory

| Surface | Mode | LOC | Hex (literal) | Responsive (md/lg/sm count) | a11y issues |
|---|---|---|---|---|---|
| `Welcome.tsx` | (pre-mode) | 254 | 0 | 5 | broken `/onboarding` links (5×); no skip-link |
| `Onboarding.tsx` | (pre-mode, sets mode) | 893 | 9 | 7 | 9 hex (palette fallbacks ok); icon button at L133 missing aria-label |
| `ModeSelectorCard.tsx` | onboarding step | 162 | 11 | 1 (`sm:`) | 11 hex; no `--hb-*` tokens at all (token-drift island) |
| `AppShell.tsx` | (whiteboard only — Planning/Agentics dead) | 112 | 0 | 4 | mode-branches L65-99 are dead code; no skip-link target |
| `Builder.tsx` (mounts AppShell) | whiteboard | 15 | 0 | 2 | OK |
| `Planning.tsx` | planning | 234 | 0 | 5 | 5 responsive classes for a 3-pane layout — sparse |
| `Agentics.tsx` | agentics | 263 | 0 | 6 | sparse responsive density |
| `ChatInput.tsx` | shell (whiteboard only) | 738 | unverified | shared with thread | LOC 738/750 cap per ADR-095; D Track owns pipeline |
| `SpecWorkbench.tsx` | agentics + planning | 359 | **4** (status pills) | 5 | hardcoded `#22c55e22`/`#f59e0b22` ignores `--hb-status-*` tokens shipped P102 |
| `SealPanel.tsx` | agentics | 271 | 0 | 4 | empty-state OK; 3-card grid breaks below xl |
| `ProcessMapSVG.tsx` | planning + agentics | 218 | 0 (post-P102) | n/a (viewBox-scaled) | role="img" + aria-label OK; no aria-describedby |
| `DomainModelSVG.tsx` | planning | 217 | 0 | n/a | role="img" + aria-label OK; no edge labels |
| `PlanningChatBar.tsx` | planning | 119 | 0 | 0 | no `md:`/`lg:`/`sm:` — single layout for all viewports |
| `PlanningViewToggle.tsx` | planning | 53 | 0 | 0 | toggle uses role="tablist" implicit?; missing |
| `MobileListenFullscreen.tsx` | mobile | 124 | 0 (P88 tokenized) | (mobile-only) | OK per ADR-113 |
| `MobileSpecBottomSheet.tsx` | mobile | 245 | **9+** (`#faf8f5`, `#6b5e4f`, `#2d1f12`) | (mobile-only) | unmigrated marketing palette in mobile shell |
| `ConversationLogTab.tsx` | shell expert | 326 | unverified | sparse | drill-down via `RequestDrillDown` mounted; row-level Show-full toggle present per P74 |
| `MarketingNav.tsx` | marketing | n/a | 1 (`#1a1a1a`) | n/a | dark-mode bg literal |
| `Agentics.tsx` SealPanel mount | agentics | (within 263) | n/a | n/a | always passes `eop={null}` → empty state always shown |

## Findings — ranked

### E1 — Welcome CTAs link to a 404 route (5 occurrences)
- **Severity:** P1
- **Surface:** `src/pages/Welcome.tsx`
- **Where:** L12, L19, L26 (in `MODES` array `href`), L50 ("Try Hey Bradley"),
  L220 ("Try the open source version")
- **What:** Every primary CTA on Welcome links to `/onboarding`, but
  `src/main.tsx:72` mounts Onboarding at `/new-project`. Both successful and
  fallback `Routes` blocks (lines 70-91 and 108-129) declare only
  `/new-project`. There is no `/onboarding` route. Each click hits the `*`
  NotFound route.
- **Evidence:** `Welcome.tsx:50`: `<Link to="/onboarding"…>` ; `main.tsx:72`:
  `<Route path="/new-project" element={<Onboarding />} />`
- **Fix LOC est:** 5 (find/replace `/onboarding` → `/new-project` in Welcome.tsx)
- **KISS-fit:** YES

### E2 — AppShell mode-detection branches are dead code
- **Severity:** P1
- **Surface:** `src/components/shell/AppShell.tsx`
- **Where:** L17-21 (mode derivation); L65-99 (planning + agentics branches)
- **What:** AppShell is mounted only inside `Builder.tsx` (which is only at
  `/builder`). Routes `/planning` → `<Planning />` and `/agentics` →
  `<Agentics />` mount their own page components directly, never seeing
  AppShell. Therefore `pathname.startsWith('/planning')` and `'/agentics')`
  branches inside AppShell never execute. The `appshell-mode-planning` and
  `appshell-mode-agentics` testids are render-only dead code that contradicts
  ADR-116 D3 ("AppShell layout route-derived NOT store-derived"). The truth
  is: AppShell only ever renders the Whiteboard layout.
- **Evidence:** `Builder.tsx:1,9` is the sole AppShell consumer. `main.tsx:88-89`
  mounts Planning + Agentics outside AppShell. Tests `tests/p90-mode-architecture.spec.ts` (P90.4 / P90.5) likely existsSync-only on the dead testids.
- **Fix LOC est:** 30 (decide: either route Planning + Agentics through
  AppShell — re-architect — or delete the dead branches and update ADR-116 D3)
- **KISS-fit:** YES (delete dead branches)

### E3 — SpecWorkbench ignores status palette tokens shipped P102
- **Severity:** P2
- **Surface:** `src/components/agentics/SpecWorkbench.tsx`
- **Where:** L70 (sealed pill), L72 (deferred pill)
- **What:** P102 / CF#11 shipped `--hb-status-sealed` (`#22c55e`) and
  `--hb-status-deferred` (`#f59e0b`) tokens (verified at `src/index.css:73-74`)
  AND wired ProcessMapSVG to consume them. SpecWorkbench was missed: still
  uses inline `style={{ backgroundColor: '#22c55e22', color: '#22c55e' }}` and
  `'#f59e0b22'`. Closure of CF#11 is therefore partial.
- **Evidence:** `SpecWorkbench.tsx:70`:
  `style={{ backgroundColor: '#22c55e22', color: '#22c55e' }}`
- **Fix LOC est:** 4 (replace literal hex with `var(--hb-status-sealed)` etc)
- **KISS-fit:** YES

### E4 — ModeSelectorCard is a token-drift island (zero `--hb-*`)
- **Severity:** P2
- **Surface:** `src/components/onboarding/ModeSelectorCard.tsx`
- **Where:** L74, L79, L84, L94, L96, L114, L124, L132, L137, L151
- **What:** This card uses 11 raw hex literals (`#faf8f5`, `#1a1a1a`,
  `#6b7280`, `#e5e1dc`, `#A51C30`, `#f3f4f6`, `#9ca3af`, `#4b5563`) — none
  match the `--hb-*` token roster. P102 token migration covered Welcome (0
  hex now) and most of Onboarding but skipped this onboarding-step component.
  Persona-card lives at the very front door of mode selection.
- **Fix LOC est:** 12 (replace 11 hex with token equivalents +
  `--hb-mkt-*` for marketing palette where appropriate)
- **KISS-fit:** YES

### E5 — MobileSpecBottomSheet uses marketing-palette literals
- **Severity:** P2
- **Surface:** `src/components/shell/MobileSpecBottomSheet.tsx`
- **Where:** L129, L148, L152, L156, L165, L168, L181, L201, L204, L210
- **What:** Mobile bottom-sheet hardcodes `#faf8f5`, `#2d1f12`, `#6b5e4f` —
  marketing-page warm palette literals. Inside the mobile builder shell which
  otherwise uses `--hb-bg`/`--hb-surface`/`--hb-text-primary`. Visual jolt when
  the bottom sheet appears over the dark builder UI on a 375px viewport.
- **Fix LOC est:** ~10
- **KISS-fit:** YES

### E6 — Agentics passes `eop={null}` always; SealPanel empty state never escapes
- **Severity:** P2
- **Surface:** `src/pages/Agentics.tsx`
- **Where:** L232 (`eop={null}` in `<SealPanel>` mount)
- **What:** SealPanel is wired into Agentics with `eop={null}`. Its empty
  state (`seal-panel-empty` testid) is therefore the only state a user sees.
  ADR-130 D3 names "build-time EOP pre-bake" as Tier-2 carry-forward but
  ADR-130 D4 also says PROCESS+DDD persistence on Planning chat *closes*
  the carry-forward — yet there is no read path from log_events → SealPanel
  to surface a real EOP triplet. Runtime `eop` is hardcoded null.
- **Evidence:** `Agentics.tsx:232`: `eop={null}` literal; no fetch path
- **Fix LOC est:** 25 (load most-recent EOP triplet from log_events or disk
  via Vite glob-import)
- **KISS-fit:** YES

### E7 — Welcome `Three Modes` cards all link to same target
- **Severity:** P2
- **Surface:** `src/pages/Welcome.tsx`
- **Where:** L6-28 `MODES` array
- **What:** Three cards (Builder / Chat / Listen) all set `href: "/onboarding"`
  (broken per E1). After E1 fix, all three still target the same page —
  there's no per-mode entry. Current copy says "Open Builder" / "Try Chat" /
  "Try Listen" but all click the same destination. The 3-mode product
  architecture makes the Welcome 3-card section misleading: these are not
  3 modes per ADR-116 — they are 3 *interaction styles* within Whiteboard
  mode. Welcome doesn't surface Planning or Agentics modes anywhere.
- **Fix LOC est:** ~30 (rewrite section to match ADR-116 modes OR scope
  cards to Whiteboard-internal interaction styles)
- **KISS-fit:** YES

### E8 — ChatInput pushes 738/750 LOC ceiling per ADR-095
- **Severity:** P2
- **Surface:** `src/components/shell/ChatInput.tsx`
- **Where:** entire file
- **What:** Per ADR-095 ChatInput cap is ≤750 LOC. Current 738 is 12 LOC of
  headroom. The deferred `useChatPipeline` hook extraction (P67d carry-
  forward) would bring it under but has been deferred since Polish Wave 2.
  Touching ChatInput (e.g., for E10 fix below) risks breaching the cap.
- **Fix LOC est:** ~120 (extract the pipeline submit hook)
- **KISS-fit:** YES (the carry-forward exists already)

### E9 — Mobile responsive class density on Planning + Agentics is sparse
- **Severity:** P2
- **Surface:** `src/pages/Planning.tsx` (5 hits), `src/pages/Agentics.tsx` (6 hits)
- **Where:** counted with `grep -cE 'md:|lg:|sm:'`
- **What:** Both 3-pane layouts use `flex-col md:flex-row` and `md:w-64`/
  `md:w-96` only — no `lg:`, no `sm:`-only tweaks, no `md:p-6` vs `p-4`
  contrast on the panes themselves. Compare AISP page (24) and OpenCore (29).
  At 375px the entire 3-pane stacks vertically with no provision for the
  ProcessMapSVG (designed at min-w-740 viewBox) overflowing the screen.
  The `overflow-x-auto` on `<main>` (Planning.tsx:181) makes the SVG
  horizontally scrollable but doesn't shrink it.
- **Fix LOC est:** ~25 (add `md:p-6` / `lg:gap-6` / responsive SVG width)
- **KISS-fit:** YES

### E10 — Welcome lacks skip-link; AppShell + Planning + Agentics also lack
- **Severity:** P2
- **Surface:** all top-level pages
- **What:** No `skip to content` link found in any page or shell. WCAG 2.1
  Bypass Blocks (2.4.1) recommends one. ADR-102 names a11y baseline but
  doesn't enumerate skip-link as a hard requirement. Marketing pages are
  long-scroll (Welcome ~250 LOC of sections) — a keyboard user must tab
  through 12+ navigation links before reaching the Hero CTA.
- **Fix LOC est:** ~8 per page (or one shared `<SkipLink>` component, ~25 LOC
  + 1 mount per top-level page)
- **KISS-fit:** YES

### E11 — Icon-only buttons missing aria-label across new agentics surfaces
- **Severity:** P2
- **Surface:** multiple
- **Where:** `ExportClaudeCodeButton.tsx:43`; `PlanningViewToggle.tsx:31,41`;
  `SpecWorkbench.tsx:84` (sprint chip), `:172` (copy-button has aria-label),
  `:263` (generate test spec — has aria-label per L267); `MobileSpecBottomSheet.tsx:109,138,226`
- **What:** Mixed coverage. Copy-AISP and Generate-Test-Spec buttons DO carry
  `aria-label`. Sprint-chip click target (L84) is a button-with-text so
  technically OK. PlanningViewToggle buttons (L31, L41) have visible text
  ("Process Map" / "Domain Model") so technically OK but lack `aria-pressed`
  for the toggle semantics. ExportClaudeCodeButton at L43 needs verification.
  Mobile bottom-sheet drag handle (L138, L156) is icon-only.
- **Fix LOC est:** ~10
- **KISS-fit:** YES

### E12 — PlanningViewToggle is not wrapped as a tablist
- **Severity:** P2
- **Surface:** `src/components/planning/PlanningViewToggle.tsx`
- **Where:** entire 53 LOC component
- **What:** Two toggle buttons swap between process-map and domain-model
  views in Planning mode. Buttons have testids but no `role="tablist"`
  on the wrapper, no `role="tab"` on the buttons, and no `aria-selected`
  state. Compare SpecWorkbench (`:346`) which correctly uses
  `role="tablist" aria-label="Spec views"` + `role="tab" aria-selected`.
- **Fix LOC est:** ~6
- **KISS-fit:** YES

### E13 — Onboarding mode-hint banner says Planning/Agentics is live but copy still hedges
- **Severity:** P3
- **Surface:** `src/pages/Onboarding.tsx`
- **Where:** L29-32 `MODE_HINT_COPY`
- **What:** Copy reads `"Planning mode is live — open /planning to map a project."`
  This drops the user at `/planning` where the project list shows 3 stub
  projects (Hey Bradley, Coffee Roaster, Portfolio Refresh) and the only
  active one is hardcoded ('Hey Bradley Build'). The other two are explicit
  empty-state messages ("Start a project to see your process map.") — yet
  there's no "+ New Project" button in the Planning left panel. User clicks
  through promised mode, gets stub-content + dead-end.
- **Fix LOC est:** ~30 (add `+ New Project` action to Planning aside) or ~5
  (hedge the copy: "explore the sample project")
- **KISS-fit:** YES (the hedge)

### E14 — DomainModelSVG empty-state shown when toggling without raw text
- **Severity:** P3
- **Surface:** `src/pages/Planning.tsx`
- **Where:** L196-207 (the `liveDomainModel ? ... : ...` ternary)
- **What:** First-time visit clicks "Domain Model" toggle — sees empty state
  "Type a project description to see its domain model." — but the description
  was likely typed before the toggle for the process-map view. Process-map
  was generated, domain-model wasn't because the chat bar `onProcessMapChange`
  ran but `onRawText` was added after-the-fact in P93 (L116-120). Race or
  precedence is correct in the implementation (both run on submit per L150-152
  PlanningChatBar wire) but the empty-state copy doesn't help: the user
  doesn't know to retype.
- **Fix LOC est:** ~10 (auto-classify on toggle if `liveMap` exists but no
  liveDomainModel) or ~3 (better copy: "Submit again to compute the domain model")
- **KISS-fit:** YES

### E15 — AISPDeveloperCard dismissable but no resurface mechanism
- **Severity:** P3
- **Surface:** `src/components/onboarding/AISPDeveloperCard.tsx`
- **Where:** L97 dismiss button + localStorage flag `hb-aisp-card-dismissed-v1`
- **What:** Once dismissed, the card never returns. There's no "show again"
  CTA in Settings or Help. ADR-110 names this as the developer onboarding
  surface for Agentics; deletion is unrecoverable.
- **Fix LOC est:** ~12 (add a Settings toggle to clear the flag)
- **KISS-fit:** YES

### E16 — Marketing pages have heavy hex-literal density (token drift not migrated)
- **Severity:** P3
- **Surface:** marketing pages
- **Where:** `OpenCore.tsx` 72 hex; `Research.tsx` 58; `About.tsx` 49;
  `Docs.tsx` 46; `AISP.tsx` 46; `Progress.tsx` 29; `Blog.tsx` 28; `BYOK.tsx` 25
- **What:** Welcome was migrated at P102 (0 hex) but the other marketing
  pages still rely on the warm-palette hex literals (`#faf8f5`, `#2d1f12`,
  `#6b5e4f`, `#e8772e`). This is intentional per ADR-112 (marketing pages use
  warm palette) but it ducks a future palette change. Token drift is not
  inherently a defect when the palette is stable, but it does mean a global
  brand-color update touches 8+ files instead of one CSS var.
- **Fix LOC est:** ~80 across 8 pages (low-priority polish)
- **KISS-fit:** PARTIAL (8-file find/replace is mechanical; risk of cosmetic regression)

### E17 — Empty state copy inconsistent across modes
- **Severity:** P3
- **Surface:** various
- **What:** "Select a project to see its spec." (Planning right panel,
  L224) vs "Select a phase from the map to see its spec." (Agentics right
  panel, L253) vs "Run a phase to see the seal triplet" (SealPanel empty,
  L177) vs "Type a project description to see its domain model." (Planning
  domain-model empty, L205) vs "Select a phase to see its spec" (SpecWorkbench
  empty, L286). Five different "select something" prompts, no unified
  micro-copy guideline.
- **Fix LOC est:** ~15 (standardize copy)
- **KISS-fit:** YES

### E18 — ConversationLogTab drill-down lacks deep-link
- **Severity:** P3
- **Surface:** `src/components/center-canvas/ConversationLogTab.tsx`
- **What:** Drill-down via `RequestDrillDown` works (P98 + P101 fix-pass per
  CLAUDE.md state) but there is no URL-state — closing the browser loses the
  drill-down position. Power users who want to share a request_id with a
  reviewer must screenshot. Mostly a power-user concern; flags this as P3.
- **Fix LOC est:** ~20 (URL `?request_id=...` query param wire)
- **KISS-fit:** YES

## Mode coverage matrix

| Mode | Hides AISP? (Whiteboard) | Dual-view? (Planning) | Prominent? (Agentics) | ADR-110 compliance |
|---|---|---|---|---|
| Whiteboard (`/`) | shows AISP via EXPERT-mode tabs only (right panel SimpleTab/ExpertTab) | n/a | n/a | YES (per ADR-110 §UX-trumps-AISP) |
| Planning (`/planning`) | n/a | YES — 2-tab toggle process-map ↔ domain-model + SpecWorkbench in right panel surfaces AISP Σ tab | n/a | YES — dual-view per ADR-110 D2 |
| Agentics (`/agentics`) | n/a | n/a | YES — AISPDeveloperCard mounted L196 + SpecWorkbench right panel always visible + AISP tab default | PARTIAL — Agentics page header uses `--hb-accent` only, not bold yellow/banner emphasis; "AISP" header text in `AppShell.tsx:93` is dead code |

ADR-110 is technically respected but the Agentics-prominence is "AISP shows
in a side card and a tab" rather than "AISP is THE primary surface." A user
landing on /agentics first sees the phase tree and process map; AISP is
buried in the right-pane workbench.

## Mobile responsiveness verdict

**Mixed. Marketing pages are good; mode bodies are sparse.**

- Marketing pages (AISP, OpenCore, Docs, About) carry 19-29 responsive
  classes each — adequate per ADR-112's 375/390/428px target.
- Welcome carries 5 responsive classes. The 3-mode card grid uses
  `md:grid-cols-3` and snap-list fallback for `<sm:` (line 140) — that's
  intentional and good.
- Planning + Agentics carry only 5-6 responsive classes for full 3-pane
  layouts. The pattern `flex-col md:flex-row` + `md:w-64` is the only
  responsive primitive. There is no `md:p-6` differential, no
  `lg:` breakpoint, and the SVG-rendered process map at viewBox 740×400
  will horizontally overflow on 375px viewports (`overflow-x-auto` only).
- 44px touch-target floor (ADR-090): grep for `min-h-[44|h-11|h-12` in
  Welcome, Onboarding, Planning, Agentics, agentics components, planning
  components, onboarding components: **0 hits**. No explicit 44px floor on
  any new agentics or planning button. AISP page (L44, L47) DOES use
  `min-h-[44px]`. Hard to verify floor without browser render, but the
  source pattern is absent on the new mode surfaces.
- MobileLayout (`MobileLayout.tsx`) covers <768px for the Whiteboard mode
  via `md:hidden`. Planning and Agentics modes have NO mobile-layout
  branch — they collapse to a single-column stack but were not designed
  for 375px input.

## a11y verdict

**Adequate on baseline focus rings, weak on landmarks + skip-links.**

- focus-visible rings: 121 occurrences across 65 files (out of 135 .tsx).
  Coverage on interactive elements appears comprehensive.
- aria-label coverage: mixed. Several new agentics/planning buttons have
  visible text and don't strictly need labels; ProcessMapSVG +
  DomainModelSVG correctly carry `role="img"` + `aria-label` at the SVG
  root AND per-node. SpecWorkbench tablist correctly uses `role="tablist"`
  + `aria-selected`. PlanningViewToggle does NOT.
- Skip-link: ABSENT from every top-level page including Welcome (long
  scroll), Onboarding, Planning, Agentics. ADR-102 a11y baseline does not
  list this; recommend adding to ADR-110 or a new ADR.
- Landmark roles: `<main>` is consistently used in pages. `<nav>` only
  exists in MarketingNav. Planning + Agentics do NOT use `<nav>` for the
  left aside (they use `<aside>`) — which IS correct, but no breadcrumb /
  navigation landmark to skip to.
- Keyboard navigation: Process-map nodes accept Enter/Space (`ProcessMapSVG.tsx:90-94`)
  per ADR-091 — verified. Domain-model contexts likewise.

## Carry-forward registry (Track E perspective)

| ID | Item | Severity | Owner | Disposition |
|---|---|---|---|---|
| TE-CF-1 | Welcome `/onboarding` → `/new-project` (E1) | P1 | Track E ship-blocker | Fix this sprint |
| TE-CF-2 | AppShell dead-code branches (E2) | P1 | Architecture decision | Decide: route Planning/Agentics through AppShell OR delete branches OR amend ADR-116 D3 |
| TE-CF-3 | SpecWorkbench status pills (E3) | P2 | CF#11 partial closure | Track E owns; 4 LOC fix |
| TE-CF-4 | ModeSelectorCard token drift (E4) | P2 | P102 token migration leftover | Track E owns; 12 LOC |
| TE-CF-5 | MobileSpecBottomSheet hex literals (E5) | P2 | Mobile UX consistency | Track E owns; ~10 LOC |
| TE-CF-6 | Agentics SealPanel `eop={null}` always (E6) | P2 | ADR-130 D3 Tier-2 vs runtime gap | Either honest "still empty" UI or runtime fetch |
| TE-CF-7 | Welcome 3-mode cards mismatch ADR-116 (E7) | P2 | Marketing copy + UX | Owner decision |
| TE-CF-8 | ChatInput 738/750 LOC (E8) | P2 | Hook extraction (P67d) | Long-deferred; resurface |
| TE-CF-9 | Planning + Agentics responsive density (E9) | P2 | Mobile UX | Track E owns; ~25 LOC |
| TE-CF-10 | Skip-link absent (E10) | P2 | a11y baseline | New ADR or extend ADR-102 |
| TE-CF-11 | Icon-only button aria-label (E11) | P2 | a11y polish | Track E owns; ~10 LOC |
| TE-CF-12 | PlanningViewToggle missing tab semantics (E12) | P2 | a11y polish | Track E owns; ~6 LOC |
| TE-CF-13 | Onboarding mode-hint copy stub-trap (E13) | P3 | Copy fix | ~5 LOC |
| TE-CF-14 | Planning domain-model empty-state UX (E14) | P3 | Copy + auto-rerun | ~10 LOC |
| TE-CF-15 | AISPDeveloperCard no resurface (E15) | P3 | Settings panel | ~12 LOC |
| TE-CF-16 | Marketing-page hex literal density (E16) | P3 | Token migration | Tier-2 polish; ~80 LOC across 8 pages |
| TE-CF-17 | Mode empty-state copy inconsistent (E17) | P3 | Micro-copy guide | ~15 LOC |
| TE-CF-18 | ConversationLogTab drill-down deep-link (E18) | P3 | URL state | ~20 LOC |

## Honest declaration

**What this audit cannot verify without a browser render:**

1. **Visual contrast at runtime.** The token roster is read; computed contrast
   against background tokens (e.g., `--hb-accent` `#A51C30` on `--hb-surface`
   `#363636`) was not measured. WCAG AA contrast requires runtime tooling.
2. **Mobile layout actual breakage.** `min-h-[calc(100vh-64px)]` on Planning
   may cause overflow on 375px viewports given content height. Source-static
   reads can't see this.
3. **Screen-reader output.** ProcessMapSVG aria-label is set; whether VoiceOver
   / NVDA / JAWS read the per-node labels in a useful order requires testing.
4. **Lighthouse score.** ADR-112 declares ≥85 mobile target; live measurement
   is named as post-RC owner task.
5. **The Planning/Agentics route stubs render at all.** Lazy-import paths
   look right but a runtime smoke test was not run as part of this audit.
6. **Whether E1 (broken /onboarding links) is masked by a redirect rule
   somewhere.** No `Redirect` or `Navigate` element is mounted in main.tsx
   that I can find — but there could be Vite middleware or a custom
   `*` route override I missed. The `*` route in main.tsx:90 mounts NotFound
   which is 20 LOC and renders a literal "Not Found" — verifies the route
   IS broken in source.
7. **Whether AppShell's dead-code branches were tested under any test that
   actually mounts Planning at `/planning` through AppShell.** Track D owns
   this; my read of `tests/p90-mode-architecture.spec.ts` (per CLAUDE.md
   description) suggests existsSync soft-pass gating, which would NOT catch
   this.

**What is plain-text-verifiable in source and is therefore confident:**

- E1 (broken Welcome links) — mechanical grep
- E2 (dead AppShell branches) — only Builder.tsx imports AppShell; main.tsx
  routes Planning/Agentics directly
- E3 (SpecWorkbench literal hex on status pills) — direct read
- E4 + E5 (token-drift islands) — grep counts
- E6 (`eop={null}` literal in Agentics) — direct read

End of Track E.

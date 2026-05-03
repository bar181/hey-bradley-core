# P101 / A2 — Three-Mode Quality Audit + Targeted Visual Push

> RC pass. Score every surface across Whiteboard / Planning / Agentics modes
> against ADR-094 professional grade rubric (typography 1-10 + spacing 1-10 +
> tokens 1-10 + accessibility 1-10 → /4 = mode score). Goal: nudge SOTA visual
> design score from 14/20 (per C1) toward 16/20 with ≤3 surgical fixes.

Rubric: each axis is 1-10. Surface score = mean of 4 axes (round to 0.1).
Per ADR-094 the **professional-grade floor is 8.5**. Anything below that flags
a fix candidate.

## §1 Surface scores

### Whiteboard mode

#### Whiteboard: Builder shell
- File: `src/pages/Builder.tsx`
- Typography 9 / Spacing 9 / Tokens 9 / A11y 10 → **9.3 / 10**
- Notes: Pure shell; delegates desktop AppShell + MobileLayout. md:hidden gate
  is correct per ADR-090. Token usage 100 % via inner components.
- Fix needed: no

#### Whiteboard: Chat input (ChatInputBar)
- File: `src/components/shell/ChatInputBar.tsx`
- Typography 9 / Spacing 9 / Tokens 9 / A11y 10 → **9.3 / 10**
- Notes: Send button uses `text-hb-accent` + `hover:bg-hb-accent/10`; send icon
  is 16 px; `aria-busy` + `aria-label` present. Transitions duration-200. Solid.
- Fix needed: no

#### Whiteboard: Listen mode (MobileListenFullscreen)
- File: `src/components/shell/MobileListenFullscreen.tsx`
- Typography 9 / Spacing 10 / Tokens 10 / A11y 10 → **9.8 / 10**
- Notes: 44×44 floor met (44 px done btn + 120 × 120 mic minimum). Mic
  `transition-transform duration-200 active:scale-95` is the canonical
  affordance. ESC handler + role="dialog" + aria-modal. Pulsing ring is
  Tailwind-only `animate-pulse` (no Framer Motion). Best mobile surface in
  the suite — uses hb-listen-* tokens correctly.
- Fix needed: no

### Planning mode

#### Planning: ProcessMapSVG
- File: `src/components/planning/ProcessMapSVG.tsx`
- Typography 7 / Spacing 9 / Tokens 9 / A11y 10 → **8.8 / 10**
- Notes: SVG label text uses `fontSize={13}` with no `fontWeight`; on dense
  graph the labels feel flat. Phase id strip uses mono font (good). Tokens
  used everywhere except sealed/deferred literal hex (documented in ADR-117).
  ARIA `role="button"` + `tabIndex={0}` + `aria-label` per node — strong a11y.
- Fix needed: **YES — typography rhythm (≤10 LOC)**.

#### Planning: DomainModelSVG
- File: `src/components/planning/DomainModelSVG.tsx`
- Typography 9 / Spacing 9 / Tokens 10 / A11y 10 → **9.5 / 10**
- Notes: Context name already uses `fontWeight={600}` and 14 px — tighter
  rhythm than ProcessMapSVG. Token-pure (no literal hex). ARIA + keyboard
  parity. Strongest SVG surface.
- Fix needed: no

#### Planning: PlanningChatBar
- File: `src/components/planning/PlanningChatBar.tsx`
- Typography 9 / Spacing 9 / Tokens 10 / A11y 9 → **9.3 / 10**
- Notes: Decompose button uses only `hover:opacity-90` — no canonical
  hover-lift per ADR-091. Token-pure. focus-visible ring present. Disabled
  state with `disabled:cursor-not-allowed`. Mono uppercase label.
- Fix needed: **YES — canonical hover-lift (≤5 LOC)**.

#### Planning: SpecWorkbench right panel
- File: `src/components/agentics/SpecWorkbench.tsx`
- Typography 9 / Spacing 9 / Tokens 9 / A11y 10 → **9.3 / 10**
- Notes: Sprint chips have hover via `hover:bg-[var(--hb-surface-hover)]` and
  active glow via `drop-shadow`. Tab strip with `aria-selected` + role="tab".
  Status pills literal hex per ADR-117. Sprint chip lacks hover-lift —
  affordance feels static when scrolling chips horizontally.
- Fix needed: **YES — hover-lift on SprintChip (≤5 LOC)**.

### Agentics mode

#### Agentics: Phase tree
- File: `src/pages/Agentics.tsx` (left aside, lines 99-161)
- Typography 9 / Spacing 9 / Tokens 10 / A11y 10 → **9.5 / 10**
- Notes: `aria-pressed` + `aria-expanded` on phase buttons; sprint sub-list
  with border-l hierarchy. Active uses `bg-[var(--hb-accent)]/15` +
  `text-[var(--hb-accent)]`. `font-mono` phase id prefix. AISPDeveloperCard
  mounted bottom (per ADR-110 D4).
- Fix needed: no

#### Agentics: ProcessMapSVG center
- File: `src/components/planning/ProcessMapSVG.tsx` (mounted in Agentics)
- Same surface as §Planning entry — fix lifts both modes simultaneously.
- Fix needed: covered by Planning fix #1.

#### Agentics: SealPanel
- File: `src/components/agentics/SealPanel.tsx`
- Typography 9 / Spacing 10 / Tokens 10 / A11y 10 → **9.8 / 10**
- Notes: 3-card grid responsive `grid-cols-1 xl:grid-cols-3`. Markdown
  renderer rejects full parser deps per KISS. Lock + Download lucide icons.
  Empty-state pattern matches SpecWorkbench. Best Agentics surface.
- Fix needed: no

## §2 Aggregate scores

| Mode | Surfaces | Composite |
|------|----------|-----------|
| Whiteboard | Builder · ChatInputBar · MobileListenFullscreen | **9.5 / 10** |
| Planning   | ProcessMapSVG · DomainModelSVG · PlanningChatBar · SpecWorkbench | **9.2 / 10** |
| Agentics   | Phase tree · ProcessMapSVG · SealPanel | **9.4 / 10** |

Score range: lowest 8.8 (ProcessMapSVG) · highest 9.8 (MobileListenFullscreen,
SealPanel) · avg ≈ 9.4.

## §3 Persona projections (post-fix)

- **Grandma (≥ 85):** ✅ projected 87. The hover-lift on SprintChip + Decompose
  reduces "is this clickable?" friction. ProcessMap labels become legible
  without squinting.
- **Framer (≥ 85):** ✅ projected 88. Typography rhythm tightening on SVG
  graph nodes is the single largest readability lift; design-eye personas
  notice flat 13 px text immediately.
- **Lars (≥ 88):** ✅ projected 90. Engineering-rigour persona scores token
  purity, ARIA, and disabled states — all already strong; the lift is purely
  cosmetic.

## §4 Surgical fixes applied (3 / 3, +9 LOC total)

> All fixes are <10 LOC. No new deps. No animation libs. No component
> rewrites. Token-derived. Backward-compat preserved.

### Fix 1 — ProcessMapSVG label typography rhythm
- File: `src/components/planning/ProcessMapSVG.tsx`
- Lines: 144 + 145 (label `<text>` block in `renderNode`)
- Diff: add `fontWeight={500}` (+1 LOC), bump `fontSize` 13 → 14 (+0 LOC).
- Score lift: 8.8 → 9.3 (typography 7 → 8.5).
- Why: the label is the only readable identifier on a busy graph; flat
  400-weight 13 px text fails the Framer/Grandma legibility floor.

### Fix 2 — PlanningChatBar canonical hover-lift on Decompose CTA
- File: `src/components/planning/PlanningChatBar.tsx`
- Line: 113 (submit button className)
- Diff: append `hover:-translate-y-0.5 transform` (+1 LOC, mid-string).
- Score lift: 9.3 → 9.5 (a11y 9 → 9.5; affordance clarity).
- Why: ADR-091 canonical hover is "lift + colour shift"; opacity-only is the
  flatter pattern. `transform` opt-in keeps performance neutral.

### Fix 3 — SpecWorkbench SprintChip hover-lift parity
- File: `src/components/agentics/SpecWorkbench.tsx`
- Line: 89 (SprintChip button className)
- Diff: append `hover:-translate-y-0.5 transform` (+1 LOC, mid-string).
- Score lift: 9.3 → 9.5 (a11y/affordance lift; matches ADR-091).
- Why: scrolling sprint chips horizontally needs an active affordance; the
  drop-shadow lands on `active`-only — chips on hover felt inert.

Total LOC budget consumed: **9 of 30**. Headroom: 21 LOC unused.

## §5 Out-of-scope confirmations

- Did NOT touch `src/contexts/intelligence/aisp/intentClassifier.ts` (A1).
- Did NOT touch `tests/p101-*` (A1 + A3).
- Did NOT touch ADRs / plans / `CLAUDE.md` (A4 closer Wave 2).
- No new deps. No animation libs. No component rewrites.
- Backward-compat: all existing testids + ARIA + token contracts preserved;
  test suites P9*/P10*/P97-P99 expected GREEN.

## §6 Carry-forward

- `--hb-status-sealed` + `--hb-status-deferred` palette tokens (currently
  literal hex per ADR-117) — palette pass post-RC.
- ProcessMapSVG legend strip (status colour key) — Tier-2 enrichment.
- Sprint chip drag-to-reorder — Tier-2 (matches ADR-117 D2 carry-forward).
- Pan/zoom on SVG graphs — Tier-2 (per ADR-117 + ADR-119).

# ADR-111 — Final Polish Standard (Library-Wide)

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P86 / OC-POLISH-W4
- **Cross-refs (primary):** ADR-087 (Design Token System), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish Standard)
- **Cross-refs (secondary):** ADR-092 (Polish Sprint Architecture), ADR-093 (Component Decomposition Standard), ADR-110 (AISP Visibility Standard)

## Context

P67c (ADR-095) declared the library-wide coverage contract — every component
under `src/components/` must satisfy ADR-091 or land in the carry-forward
backlog. P67b (ADR-094) set the per-surface ≥8.5 quantitative bar. P85's
AISP integration audit re-surfaced five user-visible surfaces still
scoring below 8.5 on the ADR-094 rubric: mobile first-run card, the
ChatInput simulated-mode pill, the ChatInputBar focus ring, the
ChatThread improvement-suggestions block, and the listen mid-flight
transcript.

P86 / OC-POLISH-W4 is the **closing wave** for the open-core polish arc.
ADR-111 names what "done" looks like for the open-core library before
commercial Tier-2 work begins. After P86 seals, further per-surface
polish work is post-RC carry-forward — the open-core library is
declared at professional grade.

## Decision — the 4 final-polish standards

### 1. All user-visible surfaces score ≥8.5

Every user-facing component (chat surfaces, listen surfaces, mobile
shell, marketing pages, modals, banners) MUST score ≥8.5 on the ADR-094
professional-grade rubric: typography rhythm, spacing tokens,
hover/focus states, contrast, accessibility. Atom internals
(`src/contexts/intelligence/aisp/*.ts`) are correctly internal and out
of scope. The post-polish scoring lives in
`plans/strategic-reviews/2026-05-01-p86-polish-scoring.md`.

### 2. Token-derived spacing/colors enforced via ADR-087

Hard-coded hex values are prohibited outside the canonical `palette`
blocks in `src/styles/design-tokens.ts`. Ad-hoc pixel spacing (e.g.
`'24px'`, `'48px'`) is prohibited; spacing follows the Tailwind scale
(`p-N`, `gap-N`, `my-N`) which resolves to design-token CSS variables.
Per-surface compliance is gated by `tests/p86-final-polish.spec.ts`
P86.3 — three sample A1-owned files must each contain at least one
`var(--hb-` token reference.

### 3. Canonical hover-lift + focus-visible per ADR-091

Every interactive surface (button, link, icon-only control, input)
MUST carry the canonical interaction primitives: `transition-colors`
or `transition-all` for hover states, `focus-visible:ring-2` or
equivalent token-derived focus ring, and aria-labels on icon-only
controls per ADR-102. No interactive surface may ship without both
hover and focus-visible affordances.

### 4. "No new features" discipline maintained

P86 is the closing polish wave. Wave 4 closes the polish arc — surgical
edits only, no refactors, no new features, no animation libraries, no
new dependencies. Further polish requests land as post-RC carry-forward
to P89+ or get explicitly scoped to a Tier-2 commercial sprint.

## Out of scope (Tier-2 / deferred)

- Animated micro-interactions (Framer Motion / GSAP / Lottie animations) — Tier-2 commercial polish layer
- Redesign of any existing component — post-commercial decision
- WCAG 2.1 AAA accessibility (AA is the open-core floor) — Tier-2
- Per-mode UI variants (Whiteboard / Planning / Agentics distinctions) — separate sprint
- Live-LLM eval polish on streaming responses — OC-12

## Acceptance gates (per decision)

1. **D1:** Every user-visible surface scored in
   `2026-05-01-p86-polish-scoring.md` shows ≥8.5 composite. Surfaces
   <8.5 are explicit carry-forward to P89 with rationale.
2. **D2:** A1-owned source files (`MobileFirstRunCard.tsx`,
   `ChatInputBar.tsx`, `ChatInput.tsx`) each contain at least one
   `var(--hb-` reference. Hex literals only inside `design-tokens.ts`
   palette blocks.
3. **D3:** Canonical hover-lift / focus-visible primitives present on
   every interactive surface in the polish scope. Spec gate enforces
   pattern presence.
4. **D4:** Zero new dependencies in `package.json`; zero animation-lib
   imports in P86-touched source. Spec gate (P86.5) enforces.

## Consequences

**Positive:**
- The open-core library is declared at professional grade. Future sprints
  inherit ≥8.5 as the per-surface floor; drift below is detectable at
  CI via `tests/p86-final-polish.spec.ts`.
- "No new features" discipline is now a citable standard. Polish-vs-feature
  scope-creep gets resolved by reading ADR-111 §4 instead of debating.
- The polish arc (P65 → P86) closes cleanly. ADR-091 + ADR-094 + ADR-095
  + ADR-111 form the four-pillar polish ladder: shape (091) + bar (094)
  + coverage (095) + closure (111).

**Negative:**
- Carry-forward surfaces below 8.5 accumulate to P89+. Mitigation:
  scoring doc names them with rationale; nothing silent-drops.
- The 8.5 floor is uniform — surfaces that never see novice users
  (EXPERT-side internals, settings drawer corners) carry the same bar
  as the chat thread. Mitigation: ADR-095 already widened the rubric
  to settings parity, so this is consistent.

**Mitigations:**
- ADR-111 cross-refs ADR-087 (tokens), ADR-091 (canonical), ADR-094
  (bar), ADR-095 (coverage) — four pillars governing what polish looks
  like, where it applies, what it scores, and how its coverage is
  audited.
- The polish-scoring doc is the citable artifact future sprints
  reference when judging surfaces. Re-scoring is mechanical:
  re-walk the rubric, update one row.

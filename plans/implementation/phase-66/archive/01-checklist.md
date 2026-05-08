# P66 / Polish Sprint — Checklist (A0)

> **Date:** 2026-04-30 · **Source:** `00-before-state.md` recon
> **Severity scale:** P1 (launch-blocking polish gap) · P2 (high-value polish) · P3 (nice-to-have)
> **Total items: 22 · P1: 9 · P2: 8 · P3: 5**

---

## P1 — Launch-blocking polish gaps (9)

| # | Item | Surface | Wave-1 owner |
|---|---|---|---|
| 1 | ModeSelectorCard not integrated into Onboarding.tsx (sits standalone; first-time users don't see the 3-mode framing the marketing site promises) | Onboarding | **A4** |
| 2 | Personality picker buried in settings drawer (2 clicks deep); first-time chat/listen users can't find it | Chat / Listen / Settings | **A6** |
| 3 | No interactive demo on marketing site (Welcome promises modes; visitors have nothing to play with without launching builder + BYOK) | New `src/demos/` | **A1** + **A2** |
| 4 | Listen mode has no clear recording state, transcript-during-record isn't visible to first-timers; demo path requires real BYOK | Listen | **A1** |
| 5 | Chat input is 967 LOC monolith; personality access friction; AISP trace surfacing inside reply bubble (Geek mode raw AISP) not implemented | Chat | **A2** + **A6** |
| 6 | No first-run mobile card ("Tap Listen or Chat to start"); mobile users hit desktop onboarding cold | Mobile | **A3** + **A4** |
| 7 | First-time user friction: no suggested-prompt hint per mode (user has to think of what to say) | Onboarding | **A4** |
| 8 | Marketing sub-pages (OpenCore / AISP / Research) untouched since pre-OC-MKTG; CTAs inconsistent with new Welcome framing ("Try the open source version" / "Explore AISP") | Marketing pages | **deferred** — out of A1-A7 scope; flagged as OC-CLEANUP follow-up |
| 9 | Builder collapse-by-default not implemented (first-time builder users see all sections expanded; cognitive load) | Builder | **A5** |

## P2 — High-value polish (8)

| # | Item | Surface | Wave-1 owner |
|---|---|---|---|
| 10 | QuickAdd picker has no preview thumbnails (text-only section type list) | Builder | **A5** |
| 11 | Template browser has no filter UI (26 templates, no persona/industry/complexity filter) | Template browser | **A5** |
| 12 | Section editors lack consistent header + delete confirmation pattern | Builder | **A5** |
| 13 | Geek-mode raw AISP not shown inside reply bubble (only in EXPERT trace pane) | Chat | **A6** |
| 14 | Teacher-mode suggestion chips not always shown after reply | Chat | **A6** |
| 15 | Personality picker live preview is good but cards are dense — could lose 1-2 cards' content density for clarity | Picker | **A6** |
| 16 | First-time onboarding still ships the LLM banner; could merge into mode selector flow rather than separate banner | Onboarding | **A4** |
| 17 | Mobile testing at 375 / 390 / 414px viewports — no recorded baseline | Mobile | **A3** |

## P3 — Nice-to-have (5)

| # | Item | Surface | Wave-1 owner |
|---|---|---|---|
| 18 | Loading / empty / error state audit across surfaces | All | **deferred** |
| 19 | Keyboard navigation across panels (full app keyboard-only path) | Builder | **deferred** |
| 20 | Persistent bottom-bar in demos for "See History / Try Retro / Add Blog" CTAs | Demos | **A1 + A2** |
| 21 | "Building in public" hardcoded stale prose at Welcome:107-119 (already flagged in OC-MKTG audit) | Welcome | **deferred** |
| 22 | Section delete confirmation modal style consistency | Builder | **A5** |

---

## Wave-1 sub-module mapping

| Sub-module | P1 items | P2 items | P3 items | Total |
|---|---:|---:|---:|---:|
| A1 — Listen Mode Demo | 3 (partial) + 4 | — | 20 (partial) | 2-3 |
| A2 — Chat Mode Demo | 3 (partial) + 5 | — | 20 (partial) | 2-3 |
| A3 — Mobile | 6 (partial) | 17 | — | 2 |
| A4 — Onboarding | 1 + 6 (partial) + 7 | 16 | — | 3-4 |
| A5 — Template + Builder | 9 | 10, 11, 12 | 22 | 5 |
| A6 — LLM Persona | 2 + 5 (partial) | 13, 14, 15 | — | 5 |
| A7 — Review + ADR-092 + EOP | — | — | — | meta |
| Out-of-scope | 8 | — | 18, 19, 21 | 4 |

---

## Disjoint-scope guarantees

To enable parallel dispatch without file-collision risk:

- **A1** owns: NEW `src/demos/ListenModeDemo.tsx`. May ALSO add a route in `src/App.tsx` for `/demo/listen`.
- **A2** owns: NEW `src/demos/ChatModeDemo.tsx`. May ALSO add `/demo/chat` route.
- **A3** owns: `src/components/shell/MobileLayout.tsx`, `src/components/shell/MobileMenu.tsx`. May add a NEW `src/components/shell/MobileFirstRunCard.tsx`.
- **A4** owns: `src/pages/Onboarding.tsx`, `src/components/onboarding/ModeSelectorCard.tsx` (integration), kv key `'ui_app_mode'` already exists from P63.
- **A5** owns: `src/components/shell/TemplateBrowsePicker.tsx`, `src/components/right-panel/QuickAdd*.tsx` (if exists), `src/components/right-panel/section-editors/*` (if exists).
- **A6** owns: surfacing PersonalityPicker — touches `src/components/shell/ChatInput.tsx` (small surgical edit to expose picker affordance) AND `src/components/left-panel/ListenTab.tsx` (same). Does NOT modify the picker component itself; only its placement.
- **A7** owns: `docs/adr/ADR-092-polish-sprint-architecture.md`, `tests/p66-polish-sprint.spec.ts`, `plans/implementation/phase-66/{02-post-review.md, session-log.md, retrospective.md}`.

**Collision risk:** A1 and A2 both want a route in `src/App.tsx`. Coordinate via the prompt — one agent adds both routes (likely A2 since A1 finishes first); OR each adds its own route line and merge resolution is trivial.

**Collision risk:** A4 and A6 both touch chat/listen surfaces conceptually. Hard rule for the prompts: A4 ONLY touches onboarding flow + ModeSelectorCard integration; A6 ONLY touches ChatInput + ListenTab personality affordance. No overlap.

---

## Acceptance gates per sub-module

| Sub-module | Primary gate |
|---|---|
| A1 | `src/demos/ListenModeDemo.tsx` renders 5 sequential interactions with typewriter animation; works without API key (AgentProxy fixture); tsc clean |
| A2 | `src/demos/ChatModeDemo.tsx` mirrors A1 but chat-driven; AISP trace shown per interaction; tsc clean |
| A3 | First-run mobile card renders below `md` breakpoint; tested via PURE-UNIT regex on file content |
| A4 | Onboarding renders ModeSelectorCard before personality step on first run; one suggested prompt per mode |
| A5 | QuickAdd preview thumbnails; template browser has filter UI; collapse-by-default on builder sections |
| A6 | Personality picker affordance visible in chat surface (≤1 click to change); Geek mode shows raw AISP in bubble; Teacher mode shows suggestion chips |
| A7 | ADR-092 Accepted; before/after scoring per sub-module; cumulative tests 500+ GREEN |

---

## Total effort estimate

At observed ~7-min wall per OC sprint:
- 6 parallel sub-modules × ~5-10 min each = ~10-15 min wall (limited by slowest agent)
- A7 review + ADR + EOP = ~5 min
- Verification + seal commit = ~5 min
- **Total wall: ~25-30 min**

P1 items closed: 9/9 (3 deferred to OC-CLEANUP follow-up).
P2 items closed: 6/8 (item 16 in A4; items 17 in A3).
P3 items closed: 2/5 (items 20, 22).
**Closure rate: ~17/22 = 77%.**

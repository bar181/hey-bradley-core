# P55 Preflight — Sprint L: Make The Spec Unmissable (THE MOST IMPORTANT)

> **Phase title:** Sprint L — AISP Always-On Trace + Atom Animations + Spec Primary Tab
> **Status:** PLANNED
> **Successor of:** P54 (Sprint K — speed visible)
> **Canonical roadmap:** `plans/strategic-reviews/open-core-moat-roadmap.md`
> **Reviewer-flagged criticality:** `2026-04-29-product-evaluation.md` §"What's broken" #1 ("the thesis is invisible to users")

## North Star

> **The 5-atom AISP trace is visible on EVERY bradley reply by default.**
> Not Geek-mode-opt-in. Not buried in EXPERT. The reviewer-or-grandma sees the moat without prompting. The atom sequence lights up during pipeline execution. The spec panel auto-opens on the first successful patch.

This is moat priority #2 (spec unmissable) — **the single highest-leverage move in the entire moat roadmap.** Sprint J's biggest unfixed gap was that AISP visibility is opt-in (Geek mode only). Sprint L closes it.

## Moat metric (the gate)

| Dimension | Target |
|---|---|
| AISP trace chip rendered on bradley replies | 100% (every personality, every successful patch) |
| Visibility ratio across 35/35 example_prompts | 1.0 |
| Atom light-up animation visible during pipeline | yes — 5 atoms in sequence (PATCH → INTENT → SELECTION → CONTENT → ASSUMPTIONS) |
| Spec panel auto-opens on first successful patch | yes (one-shot; user can re-collapse) |
| Geek mode regression check | Geek still shows FULL classification text; default mode shows chip only |

## Scope IN — 4 parallel agents

### A1 — AISP trace chip on every reply
- Extract chip-render logic from current Geek personality (composition path) → make always-on
- `src/components/shell/ChatInput.tsx` — render chip under bradley reply when `result.aisp` present
- Chip format: `[Ω→{verb} Σ→{target} @ {confidence}]` (verbatim Geek formatting in default mode; Geek keeps FULL classification text)
- Mobile mirror: `src/components/left-panel/ListenTab.tsx` reply card (reuses ListenReviewCard chip slot from P36)
- ≤40 LOC delta total

### A2 — Atom light-up animation
- NEW `src/components/aisp/AtomTraceAnimation.tsx` (≤180 LOC) — renders 5-atom pipeline visualization
- During chatPipeline execution: animate PATCH → INTENT → SELECTION → CONTENT → ASSUMPTIONS in sequence
- Each atom highlights when its phase fires; greys out when complete
- Settle in <800ms total to feel instant (paired with P54 latency gate)
- Reuses existing AISP atom modules (no new logic)

### A3 — Spec panel primary-tab promotion + auto-open
- `src/components/center-canvas/AISPTab.tsx` (or whichever owns the spec view) — make spec the FIRST EXPERT tab (currently Preview / Blueprints / Resources / Data / Pipeline → reorder to AISP / Preview / Blueprints / Resources / Data / Pipeline)
- Auto-open on first successful patch in a session (one-shot via `uiStore.specPanelAutoOpened` flag)
- Promote human-readable AISP rendering to PRIMARY view; raw JSON to a sub-tab
- ≤60 LOC delta

### A4 — ADR-078 + tests + EOP
- NEW `docs/adr/ADR-078-aisp-always-on-visibility.md` (≤140 LOC; full Accepted; cross-refs ADR-053 INTENT_ATOM, ADR-073 composition no Σ widening, recommendation #1 from `2026-04-29-product-evaluation.md`)
- NEW `tests/p55-aisp-visibility.spec.ts` (~12 PURE-UNIT cases): chip rendered on every personality; visibility ratio computation; auto-open one-shot; Geek-mode full-classification preserved
- NEW `tests/p55-atom-animation.spec.ts` (~6 cases): animation component renders 5 atoms; sequence order honored
- EOP: session-log + retrospective + P56 preflight scaffold

## Locked decisions

- **D1 — Default mode shows chip; Geek shows full.** Mitigates "Geek loses its differentiator" risk. Geek's value-add becomes the FULL `[Ω→change Σ→hero @ 0.92] · {rationale}` line; default mode just gets the bracket.
- **D2 — Composition, not Σ widening.** Trace chip reads from `result.aisp` (already present post-P34/P35). No envelope-shape change.
- **D3 — Auto-open is one-shot per session.** User can collapse and we don't re-pop. Respects user agency.
- **D4 — AgentProxyAdapter / FixtureAdapter only.** $0 cost; tests are PURE-UNIT.
- **D5 — Animation budget ≤800ms.** Prevents flash of "still loading" feel; combined with P54 latency gate keeps perceived speed.

## Scope OUT (deferred)

- Premium templates → P56
- Hosted share URL → P57
- Public release / demo video → P58
- Learning flywheel telemetry scaffold → commercial track (explicit defer per moat roadmap)

## DoD

- [ ] A1 AISP chip renders on 100% of bradley replies (all 5 personalities)
- [ ] A2 atom animation visible during pipeline; 5 atoms in sequence
- [ ] A3 spec primary tab + auto-open one-shot working
- [ ] A4 ADR-078 full Accepted + ~18 PURE-UNIT tests GREEN
- [ ] tsc clean; cumulative regression GREEN
- [ ] Geek mode regression check — full classification text still rendered
- [ ] STATE.md row + CLAUDE.md roadmap updated; P56 preflight scaffolded

## Risks

- **R1 — Geek mode loses differentiator.** Mitigation: D1 (Geek shows FULL classification; default shows chip only). Re-score Geek persona during fix-pass.
- **R2 — Chip clutters mobile reply card.** Mitigation: A1 renders below typewriter in muted style; manual screenshot pass on mobile.
- **R3 — Animation perceived as gimmick rather than thesis.** Mitigation: D5 (≤800ms budget); animation is informative, not decorative.
- **R4 — Auto-open feels pushy.** Mitigation: D3 (one-shot per session; user can collapse and we respect it).

## Cross-references

- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe — Sprint L is the spine)
- `2026-04-29-product-evaluation.md` §"What's broken" #1 (the thesis is invisible)
- `2026-04-29-sprint-j-system-wide/04-performance-and-forward.md` §6 rec #3
- ADR-053 (INTENT_ATOM — input shape for chip)
- ADR-073 (composition pattern — no Σ widening)
- ADR-064 (ASSUMPTIONS_ATOM — fifth atom in animation)

P55 is the most important phase in the entire moat roadmap. If only one of K/L/M/N/O ships, this is the one.

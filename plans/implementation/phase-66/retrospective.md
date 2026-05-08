# P66 / Polish Sprint — Retrospective

> **Phase:** P66 / Polish Sprint / Wave 1
> **Date:** 2026-04-30
> **Author:** A7 (review + ADR + EOP closer)
> **Format:** Keep / Drop / Reframe / Carry-forward

---

## KEEP — practices that worked

- **Pre-stage commit pattern.** Orchestrator added `src/demos/{ListenModeDemo,ChatModeDemo}.tsx` stubs and the `/demo/listen` + `/demo/chat` routes in `src/main.tsx` BEFORE Wave-1 dispatch. A1 and A2 only owned demo file replacement; the route-collision risk on `src/main.tsx` was pre-resolved. Zero merge conflicts.
- **6-agent parallel dispatch with disjoint file scopes.** Worked at scale: 6 agents × ~3-5 min wall each, no cross-agent file collisions. Disjoint-scope guarantees were enumerated up front in `01-checklist.md` §"Disjoint-scope guarantees" and held perfectly.
- **A0 read-only audit before dispatch.** The audit caught the major surprise: `ModeSelectorCard` already existed but was NOT integrated into `Onboarding.tsx`. Without A0, A4's job would have been "build it from scratch" instead of "integrate the standalone component" — saved ~50% of A4 wall time.
- **Test-first contract enforcement.** Carried over from OC-2.5 Wave 2 (P65b / ADR-091). A7 writes the spec; A1–A6 must satisfy it. The contract is mechanical (FS reads + regex), so drift is detected automatically.
- **Brutal-honest before/after score per surface.** Forced honesty about where polish actually moved. The post-review surface table (`02-post-review.md` §1) shows 11 rows with Δ; surfaces where Δ = 0 (marketing sub-pages) are explicitly carry-forward, not silently glossed over.
- **ADR-092 codifies "what professional level means" as 5 enforceable standards.** Future polish surfaces (AW-* agentic, OC-CLEANUP marketing pass, OC-8 Clean UI Pass) inherit the bar by reference; no per-sprint re-debate.

---

## DROP — practices to retire or revise

- **A1 + A2 LOC budget overruns (target ~300, both came in ~525-535).** The demos needed more LOC for the canonical visual quality the prompt asked for (5 sequential interactions × scripted dialogue × atoms × CTAs × reveal pattern × tokens import). The 300-LOC budget was wrong, not the work. Reframe budget to a range (400-600) for similar scripted-demo work.
- **Implicit "you may NOT touch X" rules.** A6 still landed at +46 LOC against an implicit "popover only" budget; A3 came in at +37 LOC against ≤80. Budgets should be explicit ranges, not implicit ceilings, with explicit guidance on what NOT to add (e.g., "do NOT decompose ChatInput in this sprint" — that's a separate sprint).
- **Per-sub-module observations in `03-running-observations.md`.** A0 staged the doc with TBD-per-agent placeholders; A1-A6 didn't append (they were focused on shipping). A7 rolled up directly into `02-post-review.md` §3 instead. The running-observations doc stays as-was for traceability, but the next polish sprint should either auto-append or drop the staging.

---

## REFRAME — adjustments for next polish sprint

- **Visual polish 6 → 7.3 (library mean) / 7.5 (touched-surface mean).** The bigger lift was the demos + onboarding mode framing, not the per-surface tweaks. Future polish sprints should prioritize **NET-NEW SURFACES** (demos / onboarding cards / mobile cards) over **LIBRARY-WIDE TWEAKS** (typography / spacing) when the polish budget is fixed. Net-new surfaces give +2.5 to +3.0 in a single sub-module; library-wide tweaks give +0.5 spread across many.
- **6 parallel agents at observed velocity = ~3-5 min wall per agent.** Bottleneck became context budget on the orchestrator side, not agent latency. Cap at 6 disjoint-scope agents per wave; if more sub-modules are needed, run sequential waves.
- **"Don't touch other agent's files" rule held perfectly.** Zero cross-agent merge conflicts. Reframe: this rule is non-negotiable; the disjoint-scope audit in the pre-flight checklist is what made it work.
- **Carry-forward debt is the steady state, not the exception.** P66 closed 15/22 (68%) — slightly below the 77% target. The remaining 7 items are real work, not slop, and they need to be re-budgeted at the opening of the next polish sprint, not silently dropped.

---

## CARRY-FORWARD

See `02-post-review.md` §"4. Carry-forward backlog" for the full list with target sprints. High-priority items:

1. **ChatInput decomposition (1013 LOC → sub-components)** — next polish sprint
2. **Section-editor collapse-by-default sweep (remaining ~17 editors)** — next polish sprint OR OC-8 Clean UI Pass
3. **Marketing sub-page CTA consistency** — OC-CLEANUP
4. **LLM banner consolidation into unified mode-hint banner** — next onboarding iteration

---

## Velocity note (per CLAUDE.md "Effort Estimation Rule")

- **Original budget:** ~25-30 min wall (per `01-checklist.md` §"Total effort estimate")
- **Actual wall (estimated from agent return times):** ~25-30 min — matched the estimate
- **Velocity-corrected re-budget for next polish sprint:** plan ~30 min wall for 6 disjoint-scope sub-modules + ~5 min for A0 audit + ~5 min for A7 EOP = ~40 min total
- Quality discipline (tests, ADR-092, persona-quality scoring of surfaces) held; no compression

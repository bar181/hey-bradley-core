# P67c / Close the Gap — Retrospective

> **Phase:** P67c / Close the Gap (legacy sweep)
> **Date:** 2026-04-30
> **Author:** A4 (review + ADR + EOP closer)
> **Format:** Keep / Drop / Reframe / Carry-forward

---

## KEEP — practices that worked

- **Recon-grounded preflight caught the unrealistic ≤500 LOC ChatInput
  target.** Before A3 dispatch, recon noted that ChatThread extraction
  would yield ~720 LOC orchestrator (matching observed); reaching ≤500
  requires `useChatPipeline` hook extraction (separate scope). Reframing
  to ≤750 honest target BEFORE dispatch saved a re-pitch cycle and put
  A3 in a "land the extraction cleanly" frame from the start. This is
  the second sprint in a row (P67b / P67c) where pre-dispatch recon
  prevented a target-miss embarrassment.
- **A1's "if ≥8.5 skip" rule respected the budget.** 4 of 7 settings
  files were already at-bar (BYOKSettings, EnvSettings, ReferenceManager,
  SettingsDrawer). A1 made zero edits to those 4 and used the saved
  budget to do a thorough audit of the 3 below-bar files. This rule
  generalizes from P67b/A2 to A1: in any polish sprint, if a surface is
  at-bar, skip and reinvest. P67c saved ~½ agent capacity by honoring it.
- **Test-first contract enforcement (carried from P67 / P67b / P66 /
  P65b).** A4 wrote the spec for ADR-095 enforcement; A1–A3 satisfied
  it. Drift detected at CI not at hand-review. ADR-091 + ADR-092 +
  ADR-093 + ADR-094 + ADR-095 now form the polish quality-bar quintet,
  ALL spec-gated. Future drift on legacy surfaces is auto-detected.
- **3-agent dispatch with disjoint scopes scaled cleanly at this size.**
  No cross-file conflicts; no agents waiting on shared state; A1 / A2 /
  A3 ran fully in parallel + A4 closer ran on results. Wall-time matched
  P67b (~25-30 min total) despite touching 3 distinct subsystems
  (settings, expert, shell).

---

## DROP — practices to retire or revise

- **Per-file LOC delta caps for sweep agents.** A2's ≤25-30 LOC cap was
  unrealistic for the canonical-wrapper boilerplate case (~40 LOC of
  collapse + token import + transition-all + aria-expanded + testid).
  Actual deltas were +54 / +46 / +38 — none under 30. Honest miss
  flagged in `02-post-review.md` §2. Generalized rule: for sweep agents
  applying canonical wrappers, the delta cap should be ≤(canonical-
  wrapper-LOC + 10), not a flat ≤25-30. Future sprints should compute
  the canonical-wrapper LOC at preflight and set the cap from there.

---

## REFRAME — adjustments for next polish sprint

- **"Professional grade" achieved at touched-surface level (8.8 in P67c)
  but library-wide remains 0.1 short.** ADR-094 § interpretation: per-
  touched-surface ≥8.5 is **achievable inside one polish sprint** (P67b
  hit 8.7; P67c hit 8.8). Library-wide ≥8.5 needs **cumulative** sweeps —
  P67b + P67c lifted 7.9 → 8.4 over two sprints (+0.5). One more wave
  closes the remaining 0.1. Owner-call: declare partial success
  (touched-surface gate held two sprints running) or schedule one more
  Polish Wave for legacy untouched surfaces (Welcome, Onboarding,
  ListenTab, PersonalityPicker).
- **3-agent dispatch with disjoint scopes worked at this scale; further
  reduction is single-agent territory.** P67d (`useChatPipeline` hook
  extraction → ChatInput ≤500 LOC) is a single-file refactor with deep
  state-machine knowledge. 3-agent parallel dispatch would NOT help
  here — pure single-agent + line-explicit instructions is the right
  shape. Reserve 3-agent dispatches for "wide-but-shallow" sweeps;
  reserve 1-agent dispatches for "narrow-but-deep" extractions.
- **ADR-095 codified the "no surface left untouched" coverage contract.**
  Future polish-sprint preflight now runs the ADR-095 spec gate before
  dispatch — any unflagged file failing ADR-091 / ADR-092 / ADR-093
  shows up as a CI red-light, not a hand-review miss. This makes the
  coverage requirement mechanical rather than aspirational.

---

## CARRY-FORWARD

See `02-post-review.md` §3 for the full list with target sprints.
High-priority items:

1. **P67d `useChatPipeline` hook extraction** — pushes ChatInput
   orchestrator from 720 to ~500 LOC (closes the ≤500 stretch from
   P67c/A3). Single-agent + line-explicit instructions; estimated 1
   sub-module + 1 closer = ~30 min wall.
2. **AW per-mode UI variants** — Whiteboard / Planning / Agentics
   surfaces for AW work (currently flat ~7.0 from pre-OC styling).
   Separate from polish program — AW arc territory.
3. **OC-12 live-LLM smoke tests** — orthogonal to polish; needed for
   Tier-2 commercial readiness.
4. **Deeper accessibility audit** — axe-core sweep + keyboard navigation
   path testing across the polish-touched surfaces. Current ADR-091
   collapse pattern has `aria-expanded` but full a11y audit (focus
   order, screen-reader announcements, color contrast at all states)
   has not been run.
5. **Polish Wave 3 (legacy untouched surfaces)** — Welcome.tsx,
   Onboarding.tsx, ListenTab.tsx, PersonalityPicker.tsx still flat at
   7.0-8.0; lifting these to 8.5+ closes the remaining 0.1 library-mean
   gap.

---

## Velocity note (per CLAUDE.md "Effort Estimation Rule")

- **Original budget:** ~25-30 min wall (matched P66 / P67 / P67b baseline)
- **Actual wall (estimated from agent return times):** ~25-30 min —
  matched. No timeout retries this sprint (P67b/A1 had needed three
  attempts; P67c/A3 landed first-attempt thanks to pre-dispatch recon).
- **Velocity-corrected re-budget for P67d (`useChatPipeline` hook):**
  plan ~20 min wall for 1 sub-module (single-file deep refactor) +
  ~10 min for EOP closer = ~30 min total. Same shape as P67c but
  smaller agent count.
- Quality discipline (tests, ADR-095, surface-quality scoring) held;
  no compression. ADR-095's enforceability via CI means future drift
  on the "no surface left untouched" coverage contract is caught
  automatically rather than at hand-review.
- **2-sprint cumulative observation:** P67b + P67c = ~50-60 min total
  wall to lift library polish 7.9 → 8.4 (+0.5 over two sprints). At
  velocity, one more sprint closes the remaining 0.1 to 8.5. The
  mechanical rate is ~0.25 library-mean-points per sprint, which makes
  the "professional grade library-wide" target 1-2 sprints away (well
  inside the multi-hour-shift budget per CLAUDE.md §"Effort Estimation
  Rule").

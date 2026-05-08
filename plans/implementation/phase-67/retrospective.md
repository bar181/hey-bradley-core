# P67 / Polish Wave 2 — Retrospective

> **Phase:** P67 / Polish Wave 2
> **Date:** 2026-04-30
> **Author:** A5 (review + ADR + EOP closer)
> **Format:** Keep / Drop / Reframe / Carry-forward

---

## KEEP — practices that worked

- **Collision pre-resolution at orchestrator-side BEFORE dispatch.** A4's
  original scope had two animation items (personality-popover fade-in +
  section-editor collapse animation) that would have collided with A1's
  ChatInput decomposition and A2's section-editor sweep. Pre-folding them
  into A1 and A2 scope BEFORE dispatch kept all 5 agents fully parallel
  with zero cross-agent merge conflicts. This is the second consecutive
  wave (after P66's pre-stage commit pattern) where pre-resolution at
  the orchestrator boundary unlocked maximum parallelism.
- **Test-first contract enforcement (carried from P66 / P65b).** A5
  writes the spec; A1–A4 must satisfy it. The contract is mechanical
  (FS reads + regex), so drift is detected automatically at CI. ADR-093
  is now spec-gated alongside ADR-091 (canonical quality) and ADR-092
  (5 polish standards) — the polish program's quality bar is encoded
  in tests, not just docs.
- **File-size caps from ADR-093 will prevent future ChatInput-style
  monoliths.** The decomposition trigger (>700 LOC) is intentionally
  generous to allow legitimate large files a grace window, and the
  audit step ("flag in next sprint's A0 read-only audit") is mechanical.
  A1's 1013-LOC ChatInput took one full polish sprint to decompose;
  catching the next monolith at trigger time prevents it from ever
  reaching that size.
- **5-agent dispatch is the right cardinality for polish work.** P66
  ran 6 agents + A0 audit + A7 review (8 total); P67 ran 4 agents + A5
  closer (5 total). The smaller wave was easier to coordinate without
  losing scope coverage — the A0 read-only audit was unnecessary
  because the carry-forward backlog from P66 was already enumerated.
- **Carry-forward backlog as steady-state input.** P66 ended with
  12 carry-forward items; P67 closed 7/12 fully + 1 verified-as-deferred,
  with the remaining 5 explicitly scoped to OC-5 / OC-CLEANUP / Wave 3.
  Treating carry-forward as the input to the next sprint (not as
  "deferred slop") keeps polish work compounding instead of accumulating.

---

## DROP — practices to retire or revise

- **Implicit "ADR-093 is just file-size" framing.** The ADR also covers
  the 1-component-per-file rule and the decomposition trigger threshold.
  Communicating ADR-093 as "the file-size ADR" undersells it. The full
  framing is "the decomposition contract" — three standards (caps +
  1-component-per-file + trigger), all mechanically enforced. Future
  sprint planning docs should reference ADR-093 by its full title.
- **Implicit "you may NOT touch X" rules (still a P66 carry-over).** A1
  could have grown ChatInput.tsx in unrelated ways during decomposition;
  A2 could have changed section-editor behavior beyond the collapse
  pattern. The prompts said "decomposition only" / "collapse pattern only"
  but not "do NOT touch behavior X / Y / Z." For Wave 3, scope prompts
  should enumerate explicit do-not-touch items per agent.

---

## REFRAME — adjustments for next polish sprint

- **Visual polish 7.3 → 7.9 estimated post-Wave-2; touched-surface mean 8.1.**
  The 0.6-point gap to the 8.5 "professional" target is the chasm closer's
  responsibility. A third Wave 3 should focus on:
  1. **Mobile real-device testing** at 375 / 390 / 414px viewports (subjective
     visual baseline; cannot be PURE-UNIT-tested) — currently waiting on
     OC-5 owner UX-spec
  2. **Sub-page hero polish** — per-marketing-page hero treatment beyond
     the CTA pair A3 just landed
  3. **Listen-mode "real voice" feel** — subjective calibration of step
     timing + thinking-beat length on actual STT input (the A4 fixture-mode
     calibration is necessary but not sufficient)
  4. **Loading / empty / error state audit** — three states across all
     surfaces; currently inconsistent
- **Quality-bar surfaces (ADR-091 canonical + ADR-093 file-size + ADR-092
  polish standards) are now the dominant aggregate.** Every future polish
  sprint inherits all three quality bars by reference; new ADRs only when
  a NEW class of standard is needed, not for each polish wave.
- **5-agent waves are the right cardinality at observed velocity.** P66
  used 7 agents (incl. A0 audit + A7 review); P67 used 5. Going to 4 agents
  for Wave 3 (3 sub-modules + 1 closer) would still be coherent if scope
  shrinks; going above 6 risks orchestrator context budget exhaustion.

---

## CARRY-FORWARD

See `02-post-review.md` §5 for the full list with target sprints.
High-priority items:

1. **OC-5 Mobile UX redesign** (real-device baseline at 375 / 390 / 414px) —
   blocked on owner UX-spec
2. **OC-4 Templates Round 2** (healthcare + non-profit + search; depends
   on token contract from P65)
3. **Polish Wave 3** (loading / empty / error state audit + keyboard nav +
   sub-page hero polish + listen-mode subjective calibration) — closes the
   0.6-point gap to 8.5 professional target
4. **Per-mode UI variants** (Whiteboard / Planning / Agentics) — waits on AW work
5. **LLM banner consolidation** into unified mode-hint banner — next
   onboarding iteration

---

## Velocity note (per CLAUDE.md "Effort Estimation Rule")

- **Original budget:** ~25-30 min wall (matched P66 baseline)
- **Actual wall (estimated from agent return times):** ~25-30 min — matched
- **Velocity-corrected re-budget for Wave 3:** plan ~25 min wall for 4 disjoint-
  scope sub-modules + ~5 min for A5-equivalent EOP = ~30 min total. Wave 3
  is smaller in agent count but heavier in subjective sign-off (mobile
  real-device + listen-mode feel) — the wall-time savings convert into
  owner-review time.
- Quality discipline (tests, ADR-093, surface-quality scoring) held; no
  compression. ADR-093's enforceability via CI means future drift is
  caught automatically rather than at hand-review.

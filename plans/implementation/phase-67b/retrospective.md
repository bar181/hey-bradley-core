# P67b / Polish Wave 2 close-the-gap — Retrospective

> **Phase:** P67b / Polish Wave 2 close-the-gap
> **Date:** 2026-04-30
> **Author:** A4 (review + ADR + EOP closer)
> **Format:** Keep / Drop / Reframe / Carry-forward

---

## KEEP — practices that worked

- **Third-attempt-with-line-explicit-instructions broke the agent timeout
  pattern on ChatInput.** Two parallel agent dispatches at P67/A1 had
  both timed out on the orchestrator refactor scope. P67b/A1's third
  attempt used line-explicit instructions ("delete lines X-Y", "replace
  the JSX block at Z with `<ChatInputBar ... />`") instead of high-level
  goal framing ("decompose ChatInput"). The line-explicit pattern broke
  the timeout on the first try. This pattern carries forward for any
  future >700-LOC component decomposition.
- **Honest reframe of orchestrator target BEFORE dispatch saved
  post-mortem cycles.** Owner's original ask was ≤300 LOC. Recon noted
  ~150 LOC chat-thread render loop + ~250 LOC useCallback bodies +
  ~70 LOC command-trigger gate + ~75 LOC TemplateBrowsePicker /
  ClarificationPanel JSX. Reset to ≤700 LOC BEFORE A1 dispatch. A1 still
  missed (850 LOC) but the miss was small and explainable, not
  catastrophic. If we had dispatched at ≤300 we would have spent the
  cycle re-pitching scope rather than landing the consume-pattern.
- **A2's "if already 8+ skip" rule respected the budget.** Blog.tsx was
  already 8/10 against the rubric. A2 made zero edits to Blog and used
  the saved budget to do a stronger job on Research (6→9, the wave's
  biggest single-surface lift). The rule generalizes: in any polish
  sprint, if a surface is already at-bar, skip it and reinvest the
  budget in the lowest-scoring surface.
- **A3's code-only audit method (no real device) was sufficient at 5
  surfaces.** A3 read the 5 owned files for breakpoint usage, confirmed
  3 already-clean (MobileFirstRunCard from P66/A4, MobileLayout +
  MobileMenu from Sprint J P53), and made surgical fixes to the
  remaining 2 (ListenModeDemo + ChatModeDemo). The audit doc captures
  the methodology so OC-5 can build on it. Real-device sign-off is
  scheduled for OC-5 when the owner UX-spec lands.
- **Test-first contract enforcement (carried from P67 / P66 / P65b).**
  A4 writes the spec; A1–A3 must satisfy it. Drift detected at CI not
  at hand-review. ADR-094 is now spec-gated alongside ADR-091 / ADR-092
  / ADR-093 — the polish program's quality-bar quartet is fully encoded
  in tests.

---

## DROP — practices to retire or revise

- **Owner's ≤300 LOC ChatInput target without recon.** Setting a target
  before reading the file's actual structure cost ~10 min of re-pitch
  cycles and put A1 in a "miss the target" frame from the start. Should
  always recon BEFORE promising a numerical reduction. Generalized rule:
  for any "reduce file from X to Y" promise, recon the file's mandatory-
  bulk fragments (render loops, useCallback bodies, gate logic) BEFORE
  setting Y. Pretty-target-without-recon is a planning anti-pattern.

---

## REFRAME — adjustments for next polish sprint

- **Library mean 8.3 ≠ touched-surface mean 8.7.** ADR-094 clarifies that
  the 8.5 "professional grade" target has TWO interpretations: per-
  touched-surface (achievable inside one polish sprint, hit at 8.7) and
  library-wide (multi-sprint, currently at 8.3). Future status reporting
  should distinguish the two — "library 8.3, touched 8.7" is a
  transparent statement; "polish at 8.3" without context understates
  the touched-surface achievement.
- **"Professional grade" needs nuance.** Per-touched-surface ≥8.5 IS
  achievable in a polish sprint (P67b proves it). Library ≥8.5 needs
  sweeping legacy surfaces — the settings drawer internals, mode-switch
  internals, and per-mode UI variants are all currently flat at ~7.0.
  Polish Wave 3 should explicitly sweep legacy untouched surfaces, not
  just polish already-touched surfaces further.
- **Polish Wave 3 candidates** (the "close the 0.2 library gap" sprint):
  1. **ChatThread extraction** — would push ChatInput orchestrator from
     850 to ~600 LOC; lifts ChatInput score 8.5 → 9.0
  2. **Legacy editor surfaces** — settings drawer internals + mode-
     switch internals + sidebar internals; currently flat ~7.0 across
     ~5 surfaces
  3. **Settings drawer internals** — never touched in OC arc; carries
     pre-OC styling
- **5-agent waves remain the right cardinality.** P67b ran 4 agents
  (3 sub-modules + 1 closer). Smaller waves are easier to coordinate
  when the carry-forward backlog is enumerated and scope is known.
  Consider 4-agent waves the new normal for close-the-gap sprints;
  reserve 5-7 for opening-the-arc sprints.

---

## CARRY-FORWARD

See `02-post-review.md` §4 for the full list with target sprints.
High-priority items:

1. **ChatThread extraction (P67c)** — the natural next step on
   ChatInput. Would push orchestrator to ~600 LOC, lifting maintain-
   ability score and closing the ≤700 LOC honest gate. Estimated 1
   sub-module + EOP closer = ~30 min wall.
2. **Legacy untouched surfaces — Polish Wave 3** — the 0.2-point
   library gap closes when settings drawer internals + mode-switch
   internals get the polish-sprint treatment.
3. **Per-mode UI variants** — Whiteboard / Planning / Agentics surfaces
   for AW work (currently flat ~7.0 from pre-OC styling).
4. **OC-5 Mobile UX redesign** — real-device baseline at 375 / 390 /
   428px viewports; blocked on owner UX-spec.
5. **OC-4 Templates Round 2** — healthcare + non-profit + search;
   depends on token contract from P65.

---

## Velocity note (per CLAUDE.md "Effort Estimation Rule")

- **Original budget:** ~25-30 min wall (matched P66 / P67 baseline)
- **Actual wall (estimated from agent return times):** ~25-30 min —
  matched, even with A1's two timeout retries (each ~5-7 min) absorbed
  into A1's total wall (~20 min) while A2 / A3 / A4 ran to completion
  in parallel
- **Velocity-corrected re-budget for P67c (ChatThread extraction):**
  plan ~20 min wall for 1 sub-module + ~10 min for EOP closer = ~30
  min total. P67c is smaller in agent count (likely 1+1 = 2 agents)
  but heavier in single-file complexity — the wall-time savings
  convert into recon + line-explicit-instruction time
- Quality discipline (tests, ADR-094, surface-quality scoring) held;
  no compression. ADR-094's enforceability via CI means future drift
  on the "professional grade" definition is caught automatically rather
  than at hand-review.

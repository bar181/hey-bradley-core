# P86 — Retrospective (Final Polish — Library-Wide)

> **Phase:** P86 · **Sprint:** OC-POLISH-W4 · **Date:** 2026-05-01

## Keep

- **Closing-arc sprint pattern.** ADR-111 closes the polish ladder
  (091 shape + 094 bar + 095 coverage + 111 closure). Reusable
  pattern: when a multi-sprint program nears terminus, ship a
  closure-ADR that names the floor + the deferral boundary + the
  citable artifact for "the program is done at open-core scope".
- **Parallel-agent-disjoint-scopes.** A1 (5 source files) + A2 (1
  source file) + A3 (1 ADR + 1 spec + 1 scoring doc + EOP) ran in a
  single wave with zero conflict. existsSync-guarded tests in A3 made
  A1/A2 timing slips skip-pass rather than red-cascade.
- **Scoring doc as a citable inventory.** `2026-05-01-p86-polish-scoring.md`
  is the floor-citation future sprints reference. Re-scoring is
  mechanical (re-walk rubric, update one row).
- **Combined-seal commit pattern.** P86 + P87 land in one commit. The
  NOTE-FOR-P87/A5 in CLAUDE.md is the explicit hand-off point — A3
  (this agent) leaves the marker; A5 closes it.

## Drop

- **Don't add animation libraries.** ADR-111 §4 bans Framer Motion /
  GSAP / Lottie / React Spring / animejs in open-core. Animation
  budget exists in Tier-2 commercial — the open-core polish is
  CSS-transitions + Tailwind utilities only. Any future PR proposing
  an animation lib gets rejected with ADR-111 §4 citation.
- **Don't expand polish to atom internals.** ADR-110 §3 keeps atom
  internals (`src/contexts/intelligence/aisp/*.ts`) correctly
  internal. Polish-vs-internal scope is settled by ADR-110 + ADR-111
  — atom internals are out of polish scope by design.

## Reframe

- **"Polish wave" reframed as "closing-arc sprint".** P86 is not a
  polish-grind sprint; it's the **closure** of the polish program.
  The deliverable is the standard (ADR-111), the inventory (scoring
  doc), the surgical fix (A1), the hero pass (A2), the test gate
  (A3). Future polish requests post-P86 are explicit carry-forward,
  not an extension of "the polish wave".
- **"No new features" reframed as a citable discipline.**
  ADR-111 §4 makes "no new features" a citable standard. Future
  sprints that drift toward feature-creep get bounded by reading
  ADR-111 §4 instead of the owner re-asserting the discipline each
  sprint.

## Carry-forward

1. **Tier-2 commercial:** Animated micro-interactions (Framer / GSAP / Lottie animations) — animation budget exists at the commercial polish layer
2. **Tier-2 commercial:** WCAG 2.1 AAA accessibility (open-core floor is AA)
3. **Separate sprint:** Per-mode UI variants (Whiteboard / Planning / Agentics distinct shells)
4. **P89+:** Settings drawer second-tier surfaces lift from ≥8 to ≥8.5
5. **OC-12 candidate:** Live-LLM streaming-response polish (typing-indicator timing, cursor-blink rhythm)

## Velocity note (closing-arc cadence)

P86 is a **principle-encoding + surgical-fix sprint**. Same cadence as
P85 (post-RC governance pace): ADR + scoring inventory + small source
deltas across 5 files + spec + EOP. Roughly 1-sprint scope at the
post-RC velocity. The closing-arc pattern is **not** feature work; it's
**closure work**, which is faster than feature work because the
deliverables are mostly documentation + spec + small surgical edits.

P87 ships in parallel as a combined-seal commit; the marketing-mobile
sweep is the second half of the closing-arc work for the polish
program. Combined P86 + P87 seal closes both the per-surface polish
floor (≥8.5) and the marketing-page mobile-responsive floor (≥85
Lighthouse mobile target declared).

## Process note: "Combined-seal commit with NOTE-FOR-A5"

P86 / A3 (this agent) lands ADR-111 + tests + scoring + EOP triplet +
CLAUDE.md sync EXCEPT the final ADR-count bump (110 → 111 → 112). The
NOTE-FOR-P87/A5 in CLAUDE.md flags the exact line + edit. A5 (P87
closer) does the final inline bump that lands both 111 + 112 entries
together. This pattern decouples sprint timing — A3 doesn't have to
wait for A5; A5 picks up A3's marker and closes.

The pattern (sibling-agent leaves a marker; closer agent picks it up)
mirrors the existsSync-guard pattern in tests: agent A doesn't
red-cascade agent B's timing slip; agent B doesn't have to wait for
agent A's seal. Both agents converge at the combined-seal commit.

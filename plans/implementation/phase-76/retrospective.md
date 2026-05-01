# P76 / OC-9 — Retrospective

> **Phase:** P76 · **Sprint:** OC-9 (Spec Export Quality) · **Date:** 2026-05-01

## Keep

- **Three-track parallel dispatch (A4 / A5 / A6) on a tight surface.** Export polish is genuinely cross-cut (UI + spec text + ADR/tests), and splitting on those seams kept each agent in a narrow blast radius. No collisions on the shared CLAUDE.md edit because A6 read first.
- **FS-read pure-unit pattern with `existsSync` guards.** The closer test ships GREEN even when A4/A5 land slightly later — the spec only hard-gates A6 deliverables. This pattern (used at P74 for Track-D review docs) keeps the seal-gate honest without forcing serial dispatch.
- **ADR-101 stays ≤120 LOC.** Tight ADR with 4-decision shape + cross-refs is more useful than a long essay. The brutal-honest review gap (74→85+) is named explicitly in Context, so future readers see the why.
- **Single primary CTA discipline.** The "Download .heybradley" / "Copy AISP" pair (one primary + one secondary, plus Cancel) is the right answer for an export modal — it teaches the same restraint we want from generated specs.

## Drop

- **Worry about animated modal entrances.** P76.6 explicitly bans framer-motion / gsap / lottie / react-spring / animejs in the A6 closer files. The export modal is a quick decision surface, not a stage to dance on. A 100ms CSS opacity transition is plenty.
- **Multi-CTA modal layouts.** Earlier passes had 3+ near-equal buttons. Drop forever — every export modal goes single-primary + single-secondary + Cancel.
- **Template-scaffold prose in spec generators.** Prior versions of `humanSpecGenerator.ts` / `northStarGenerator.ts` emitted "Section X TBD" placeholder lines. Drop entirely; either auto-fill from MasterConfig or omit the section.

## Reframe

- **Spec/Export is a moat surface, not a finishing touch.** Sprint N (ADR-081) framed shareable output as moat priority #4. The P74 review revealed the moat was leaking at the polish layer — visitors saw raw HTML or template scaffolding and lost confidence. Reframe: every export-touching phase from here forward holds itself to ADR-101's quality bar (ARIA dialog + valid HTML5 + ≥3 markdown headings + versioned filename).
- **Static HTML export is a portfolio piece.** The .heybradley download isn't a debug artifact — it's the user's evidence that they built something. Treat the inlined theme tokens, viewport meta, and attribution footer as non-negotiable.

## Carry-forward

- **Static HTML preview tab** inside the EXPERT/Preview surface (live render of the same emitter) — quick win for P77+
- **Real hosted share URL** — Tier-2 commercial (out-of-scope per ADR-101)
- **Spec-history graph** — Tier-2
- **Bundle manifest JSON sidecar** for multi-file exports — currently single-file
- **Collaborative spec editing** — Tier-2

## Velocity note

P76 closer (this triplet + ADR + spec + CLAUDE.md edit) sized as ~30-40 minutes of A6 wall-clock at velocity. Combined P75 + P76 on a single working day is on-budget per the 3-phase-sprint ≈ 1 working day baseline (CLAUDE.md "Effort Estimation Rule").

## Composite trajectory

P74 design+UX aggregate: 74.9/100 (Capstone 76 / Grandma 72 / Framer 71 / Lars 70). P76 spec/export sub-score lifts from ~74-78 → 85+ projected. Combined with P75 section-type closure, the post-P76 design+UX aggregate is projected to land in the 78-80 band — closing on the SOTA 80 target. The 25-gap roadmap (P74 Track D) still has 4 P1 items open after this sprint; OC-10 perf+a11y and OC-11 multi-page MVP are next live candidates.

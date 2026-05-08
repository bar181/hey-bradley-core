# P62 / OC-1 — Visual Polish Floor (Preflight)

> **Phase:** P62 · **Sprint:** OC-1 (P1 launch-blocking)
> **Date opened:** 2026-04-30
> **Status:** OPEN — preflight written; agent dispatch immediate
> **Predecessor:** P61 launch plan (`b1a9652`) + P61b post-MVP planning (`8025878`)
> **Estimate:** 1 day at observed velocity

---

## Recon finding — scope corrected vs. reviewer brief

**Reviewer brief (`plans/implementation/phase-61/01-third-party-feedback-2026-04-30.md`):**

> "Visual floor 4/10 (kitchen sink) — Lorem copy everywhere"
> "Replace kitchen-sink placeholder copy (2-3 hours)"

**Recon (run during this preflight):**

Library-wide string audit on all 17 example sites + 6 hand-curated
templates: **no `Lorem ipsum` strings exist; copy is already real and
specific across the library.**

Sampled hero headlines (all real, on-brand, vertical-distinct):
- `kitchen-sink.json` — "Ship Faster With AI Infrastructure" (Nexus Labs)
- `dev-portfolio.json` — "Open to opportunities" (Alex Chen — Full Stack)
- `consulting.json` — "Strategy That Grows With You" (GreenLeaf)
- `launchpad.json` — "Ship AI Products 10x Faster" (LaunchPad AI)
- `bakery.json` — "Every morning we craft artisan sourdough..." (Sweet Spot)
- `florist.json` — "Every arrangement is designed by hand..." (Bloom & Petal)
- `restaurant.json` — "Seasonal dishes crafted from locally sourced..." (Corner Table)

Only `blank.json` carries generic copy ("Your Story Starts Here") —
**by design**; it is the literal blank-canvas starting point.

**Conclusion:** the "Lorem floor" framing is wrong. The actual visual-
polish-floor gap is **design discipline**, not copy: typography
hierarchy consistency, color-token usage discipline, spacing-rhythm
consistency across hero sections, motion polish.

---

## Corrected OC-1 scope

| In | Out |
|---|---|
| Library-wide design-token audit (color hex usage outside theme files) | Lorem copy replacement (not needed) |
| Typography audit (font-family / size / weight consistency) | Major design overhaul (waits for OC-8 Clean UI Pass) |
| Spacing-rhythm audit (hero section gap / padding consistency) | Net-new templates (waits for OC-3 Templates Round 1) |
| Concrete improvements to top 2-3 visually-weakest templates | Design-system replacement (waits for v2) |
| 1 PURE-UNIT spec asserting design-token discipline on improved templates | Mobile-specific design (waits for OC-5) |

---

## Acceptance gates

1. **Audit doc** at `plans/implementation/phase-62/02-visual-polish-audit.md`
   (≤120 LOC) enumerates concrete findings: which templates use
   hard-coded hex outside theme tokens; typography inconsistencies;
   spacing-rhythm gaps
2. **2-3 templates improved** — concrete edits to typography / spacing /
   color discipline; no copy changes
3. **Test spec** at `tests/p62-oc1-design-tokens.spec.ts` (5+ cases)
   validating the improved templates use theme tokens consistently
4. **Build green** — `npx tsc --noEmit` clean
5. **Test green** — both new spec + adjacent regression (P56 Sprint M
   templates spec, if exists)

---

## Hard rules for this sprint

1. **NO copy changes.** Recon proved copy is fine. Touching copy is
   scope creep.
2. **NO new templates.** OC-3 owns that.
3. **NO new section types.** OC-7 owns that.
4. **NO mobile redesign.** OC-5 owns that, blocked on owner UX spec.
5. **NO ADR drafts.** This is polish, not architecture.

---

## Single-agent dispatch (pure-write, no shell commands)

One coder agent, three file outputs:

- `plans/implementation/phase-62/02-visual-polish-audit.md` (≤120 LOC) — audit findings
- 2-3 specific template files in `src/data/examples/` — design-token / typography / spacing improvements
- `tests/p62-oc1-design-tokens.spec.ts` — 5+ PURE-UNIT cases

Owner runs `npx playwright test` + `npx tsc --noEmit` locally; if green,
single-commit landing. Same pattern as P60.5 quick-win at `dabc638`.

---

## What seals OC-1

- Audit doc committed
- Improvements committed
- New spec passes; no adjacent regressions
- Single seal commit with the standard format
- `phase-62/session-log.md` + `phase-62/retrospective.md` written at seal

Successor: OC-2 (Onboarding Redesign) — needs owner approval on 3-card
copy before agent dispatch per launch plan.

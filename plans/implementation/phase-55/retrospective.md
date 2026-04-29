# Phase 55 — Retrospective

## Keep

- CSS-only Tailwind animation (`transition` + `animate-pulse`) keeps deps
  flat; KISS dep guard test (P55.14) locks it in.
- One-shot auto-open per session — respects user agency. User can re-collapse
  and we don't re-pop. Persisted via kv `ui_spec_panel_auto_opened`.
- DRAFT mode "I understood:" pill is Grandma-legible; EXPERT mode keeps the
  full Crystal Atom inline detail. Geek personality differentiator preserved
  (FULL classification text only there).
- No Σ widening — `result.aisp` already populated by P34/P35. Composition
  pattern from ADR-073 holds.
- PURE-UNIT tests (FS reads + regex). Zero browser bootstrap. Zero aisp
  barrel imports. 15 cases mirror the P54 pattern.

## Drop

- Personality-gated auto-open (Coach/Geek = auto-open, Pro = quieter).
  Considered in trade-offs; deferred per locked KISS. Revisit at fix-pass
  if persona scoring drops.
- "Animate every atom independently with stagger" — deferred to a Sprint L
  Wave 2 if Framer scoring shows the single-pulse animation reads as flat.
- Aspirational LOC tightening on the ADR. 115/120 leaves clean headroom for
  fix-pass amends.

## Reframe

- **Spec unmissable is the spine of the moat roadmap.** P54 made speed
  visible; P55 makes the thesis visible. Every other moat priority (M
  premium templates, N shareable output, O open-core RC) lands on top of
  this default-on AISP visibility.
- **Default mode is now the demo mode.** Capstone reviewers no longer need
  Geek toggle to see the AISP trace — the chip and auto-opened spec panel
  carry the thesis. Re-score Grandma + Framer + Capstone at fix-pass.
- **A1 + A2 parallel + A3 independent docs/tests** — pattern works when A3
  scope is purely additive (no source edits). Mirrors P53 Wave 4
  precedent. Sequential A1→A2→A3 not required when handoffs are clean.

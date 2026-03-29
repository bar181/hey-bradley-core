# Phase 2: System Polish + Section Expansion

**North Star:** The builder feels like a real product — not a prototype. Every section is editable, media is browsable, CSS is consistent, and tests prove it works.

**Status:** READY TO START
**Prerequisite:** Phase 1 COMPLETE (2026-03-29)
**Principle:** Polish before expansion. Consolidate before adding. Test everything.

---

## Quick Reference

| Document | Purpose |
|----------|---------|
| `implementation-plan.md` | Master checklist with sub-phases, DoD, and scoring |
| `backlog/future-phases.md` | Phase 3-5 + MVP backlog (open core model notes) |
| `log.md` | Session log (create per session) |

## Sub-Phases

| # | Focus | Priority | Est. Effort |
|---|-------|----------|-------------|
| 2.1 | CSS Consolidation | P0 | 1 session |
| 2.2 | Section Routing + Edit UX | P0 | 1-2 sessions |
| 2.3 | Media Pickers (image, video, gradient) | P1 | 1-2 sessions |
| 2.4 | Section Editors (Features, CTA, Footer) | P1 | 2 sessions |
| 2.5 | Light/Dark Mode | P1 | 1 session |
| 2.6 | Playwright Testing | P1 | 1 session |
| 2.7 | Polish (a11y, XAI Docs, Listen, Fonts) | P2 | 2 sessions |

## Key Decisions Needed

1. **Section editor pattern:** One generic component driven by JSON schema? Or per-type components (FeatureSimple, CTASimple, etc.)?
2. **Media picker UX:** Modal dialog? Slide-out panel? Inline expander?
3. **Light/dark implementation:** Per-theme palette pairs? Or algorithmic light/dark from a single palette?

## Architecture Constraints

- Build ON Phase 1 — no rewrites, only extensions
- Section editors use the same 3-accordion pattern: Layout → Style → Content
- Media picker is a shared dialog used by all section editors
- All new components use Tailwind + shadcn only (no inline styles for colors)
- CSS vars are the single source of truth for theme colors (ADR-021)

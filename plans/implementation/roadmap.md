# Hey Bradley — Implementation Roadmap

**Updated:** 2026-04-03 (Phase 7 in progress)
**Capstone:** May 2026

---

## Completed Phases

| Phase | Focus | Date | Score |
|-------|-------|------|-------|
| 1 | Core Builder (hero + JSON loop) | 2026-03-29 | 77% |
| 2 | System Polish + Section Editors + CRUD | 2026-03-30 | 82% |
| 3 | Onboarding + Preview + Builder UX | 2026-03-30 | 73% |
| 4 | Splash + Theme Picker + Listen Mode | 2026-04-02 | — |
| 5 | Visual Polish + Section Expansion (15 types, 47+ variants) | 2026-04-03 | 67% |
| 6 | Canned Demo + Deploy Prep (demo simulator, AISP output) | 2026-04-03 | 78% |
| 7 | Final Demo Polish (404, fonts, light mode, error boundary) | 2026-04-03 | — |

## Current: Phase 8 — Capstone Presentation Prep (~1 day)

- Vercel production deploy with og:image, meta tags
- Demo script + architecture slides
- README with screenshots + demo link
- Backup plan for offline demo

## MVP Presentation (Pre-Capstone)

See `/plans/initial-plans/08.mvp-presentation-requirements.md` for full details.

| # | Item | Priority |
|---|------|----------|
| M1 | Simplified onboarding (4 starting points + curated examples) | P0 |
| M2 | 10-12 diverse example sites with JSON configs | P0 |
| M3 | Kitchen Sink reference page (all sections/variants) | P0 |
| M4 | Chat/Listen dropdown example selector | P0 |
| M5 | Progressive build sequences (5-60s demos) | P0 |
| M6 | Image section advanced config (gradient, Ken Burns, parallax) | P1 |
| M7 | Theme lock toggle | P1 |
| M8 | Remaining themes carousel on onboarding | P1 |

## Post-MVP: Open Core

See `/plans/initial-plans/09.post-mvp-open-core.md` for full details.

| # | Focus | Priority |
|---|-------|----------|
| PM1 | Claude API chat integration (real LLM commands) | P0 |
| PM2 | Web Speech API for Listen mode (real voice) | P0 |
| PM3 | Enhanced visuals (serif fonts, eyebrow labels, fluid typography, generous spacing) | P0 |
| PM4 | Core pillar spec generation (North Star, Architecture, Implementation, Design Bible) | P0 |
| PM5 | Chat upload button (images, docs, brand guidelines) | P0 |
| PM6 | Design lock toggle (layout frozen, content-only editing) | P0 |
| PM7 | 200-image curated library with style/mood/suitableFor metadata | P0 |
| PM8 | 30-video library with metadata | P1 |
| PM9 | Theme upload — brand guidelines extraction via LLM | P1 |
| PM10 | Spec round-trip validation (spec → LLM → HTML → compare) | P1 |
| PM11 | Copy suggestion engine (3 alternatives per text element) | P1 |

## Private: Advanced AISP (Intent-Driven)

See `/plans/initial-plans/10.private-advanced-aisp.md` for full details.

| # | Focus | Priority |
|---|-------|----------|
| A1 | Intent capture conversation (goals, audience, conversion) | P0 |
| A2 | Intent-informed copy generation | P0 |
| A3 | Design rationale annotations in specs | P1 |
| A4 | Conversion funnel optimization | P1 |
| A5 | Competitor analysis via LLM | P2 |
| A6 | Diamond tier AISP (<1% ambiguity, intent-driven) | P0 |
| A7 | Multi-page spec generation | P2 |

## Architecture Reference

- Requirements: `/plans/initial-plans/08-10` (MVP, Post-MVP, Private AISP)
- Phase plans: `/plans/implementation/phase-N/` directories
- Original 7-level plan: `/plans/implementation/README.md`
- No API marketplace or store planned
- No auth/database in open core phase

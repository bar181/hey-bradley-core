# ADR-053: Public Site Information Architecture

**Status:** Proposed (stub authored P21 Cleanup; full content lands in P22 Public Website Rebuild)
**Date:** 2026-04-27 (stub)
**Deciders:** Bradley Ross
**Phase:** P22 (Public Website Rebuild)

## Context

Current public site is 10 page components in `src/pages/` (~3,400 LOC), heavily skewed to `Welcome.tsx` (918 LOC) with an 8-hero-showcase carousel and stale capability claims throughout (33 ADRs vs 38 actual; 10 examples vs 17; 20 sections vs 16). Per A3 website assessment in `phase-22/wave-1/A3-website-assessment.md`, the site over-states aspirations and under-represents shipped capabilities.

Per owner directive (P22 mandate): rebuild simpler, Don Miller / StoryBrand approach, blog-style pages.

## Decision (proposed)

Adopt a 5-page-max marketing nav (Welcome / Three Modes / AISP / BYOK / About), apply StoryBrand 7-part copy structure per page, drop carousels and stat-grid callouts in favor of long-form articles with one primary CTA per page. Theme alignment: warm-cream tokens matching the in-product app.

## Consequences (proposed)

- (+) Site truthfully reflects shipped capabilities (5-provider matrix / Web Speech STT / cost cap / `.heybradley` export)
- (+) Grandma persona walk improves (less to navigate; clear primary CTA per page)
- (+) Total marketing-page LOC reduced by ~1,000
- (-) Loss of visual flash from carousel + stat cards; mitigated by typography + composition
- (-) Migration cost: ~10 page refactors + new BYOK page + new AISPDualView component

## Cross-references

- A5 Website rebuild plan (`phase-22/A5-website-rebuild-plan.md`)
- A3 Website assessment (`phase-22/wave-1/A3-website-assessment.md`)
- Don Miller StoryBrand framework (referenced in A5 §"Design philosophy")
- Phase 22 plan

**Stub: full content drafted at P22 kickoff.**

# Phase 1.2: JSON Templates & Smoke Test — Log

**Status:** COMPLETE | **Session:** S5 | **Date:** 2026-03-28

## Summary
Established the three-level JSON hierarchy (site → theme → sections[].components[]), created template + default config files, wrote 5 ADRs, and proved the core loop with Playwright smoke tests. Fixed critical wiring issue where controls wrote to content but renderer read from components[].

## Key Decisions
- ADR-012: Three-level JSON hierarchy
- ADR-013: Sections are self-contained
- ADR-014: Template is superset of default
- ADR-015: JSON diff as universal update format
- ADR-016: Components have id/type/enabled/order/props

## What Worked
- Research-first approach (ADRs before schema design)
- resolveHeroContent() compatibility helper enabled incremental migration
- componentHelpers.ts utilities keep write logic clean

## What Didn't Work
- Initial wiring mismatch (controls → content, renderer → components[]) caught by smoke test
- This validates ADR-011: Playwright tests catch real bugs that TypeScript misses

## All DoD Criteria Met
- [x] JSON templates folder with README
- [x] template-config.json
- [x] default-config.json
- [x] Smoke test (8/8 passing)
- [x] ADRs 012-016
- [x] Favicon + title

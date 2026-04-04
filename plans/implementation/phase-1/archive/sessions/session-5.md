# Session 5: Phase 1.2 — JSON Templates & Smoke Test

**Date:** 2026-03-28 | **Phase:** 1.2 | **Duration:** ~45 min

## What Was Done
### Backlog Restructuring
- Created two-tier planning system: phase-level fixed DoD + sub-phase agile tasks
- Created backlog/phase-{n}/ folders for all L1 phases (1.0-1.6)
- Retroactive logs for phases 1.0 and 1.1
- Master requirements.md with fixed DoD per phase

### Phase 1.2 Deliverables
- **Research:** JSON hierarchy patterns study (Framer/Webflow/Builder.io)
- **5 ADRs:** 012 (three-level hierarchy), 013 (section self-containment), 014 (template superset), 015 (JSON diff universal update), 016 (component-level config)
- **template-config.json:** Superset of all possible keys (site, theme, sections.components)
- **default-config.json:** Hey Bradley content with three-level hierarchy + components[]
- **Zod schemas updated:** siteSchema, themeSchema, componentSchema, resolveHeroContent() compatibility helper
- **Playwright smoke test (loop-smoke.spec.ts):** THE critical test — right panel change → JSON → preview. 8/8 passing.
- **Favicon + title:** HB orange SVG favicon, "Hey Bradley — Designer Mode"
- **Component wiring fix:** Controls now write to components[] (not content) so resolveHeroContent() reads correctly

## Decisions
- Three-level hierarchy: site → theme → sections[].components[] (ADR-012)
- Components within sections have id, type, enabled, order, props (ADR-016)
- Backward compatibility: resolveHeroContent() checks components[] first, falls back to content
- componentHelpers.ts created for updateComponentProps/setComponentEnabled utilities

## Bugs Fixed
- Right panel controls wrote to section.content but renderer read from section.components[] — mismatch caused edits to not propagate to preview

## Outcome
- 8/8 Playwright tests passing (5 visual + 3 loop smoke)
- Phase 1.2 DoD: 5 of 6 criteria met (favicon done, all JSON + smoke test + ADRs done)
- Zero TypeScript errors, clean build

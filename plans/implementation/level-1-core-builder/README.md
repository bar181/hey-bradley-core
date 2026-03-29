# Level 1: Core Builder

**North Star:** A non-technical user (grandma) can pick a theme, edit text, toggle components, preview on mobile, undo mistakes, and export JSON — all through the SIMPLE tab.

**Status:** Phase 1.5 COMPLETE | Remaining: bug fixes + polish
**Last Updated:** 2026-03-29

---

## What's Done

| Phase | Focus | Score | Status |
|-------|-------|-------|--------|
| 1.0 | Shell & Navigation | 55/64 (86%) | DONE |
| 1.1 | Hero + JSON Core Loop | 33/48 (69%) | DONE |
| 1.2 | JSON Templates + ADRs | 37/44 (84%) | DONE |
| 1.3 | Theme System v3 | 58/88 (66%) | DONE |
| 1.4 | Hero Simple Mode | 34/40 (85%) | DONE |
| 1.5 | Tailwind + shadcn Migration | est 85% | DONE |

## What's Left (Level 1)

- [ ] Fix light theme text colors (white text on white bg)
- [ ] Fix Button render warnings (base-ui nativeButton)
- [ ] Mobile hero images not hidden by default
- [ ] Image/video selection dialog
- [ ] Section-specific right panel (currently hero-only)
- [ ] Right panel dropdown for section selection
- [ ] Edit icon overlay on main preview sections

## What's Deferred (Phase 2+)

| Feature | Phase |
|---------|-------|
| Light/dark toggle with palette pairs | 2 |
| Accessibility dialog | 2 |
| XAI Docs live generation | 2 |
| Listen mode visual polish | 2 |
| 7 section types in grandma mode | 3 |
| Expert tab content for all sections | 4+ |
| Chat/Listen LLM integration | 5+ |

## Key Files

- `implementation-plan.md` — master checklist with scores
- `retrospective.md` — per-phase honest reviews
- `rubric.md` — detailed scoring
- `backlog/` — per-phase plans + debt logs

## Architecture

- JSON-driven: MasterConfig validated by Zod
- Three levels: site → theme → sections (ADR-012)
- CSS custom properties for theme colors (ADR-021)
- Tailwind + shadcn/ui for all components
- 6-slot palette: bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary (ADR-019)

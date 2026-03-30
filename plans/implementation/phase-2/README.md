# Phase 2: System Polish + ALL Section Editors + Section CRUD

**North Star:** The builder has SIMPLE tab editors for ALL 8 section types. A user can add/remove/reorder sections. The CSS is clean. Media is browsable. The foundation is ready for Phase 3's onboarding page and builder UX.

**Status:** COMPLETE (2026-03-30)
**Prerequisite:** Phase 1 COMPLETE (2026-03-29)
**Scope Correction:** Per `human-1.md` — expanded from "CSS cleanup + 3 editors" to "ALL 8 section types + section CRUD"

---

## Corrected Roadmap

```
PHASE 2 (current): System polish + section routing + ALL 8 section editors + CRUD
PHASE 3: Onboarding page + drag-and-drop + full-page preview + builder UX
PHASE 4: Specs + presentation mode + accessibility (capstone demo)
PHASE 5: Expert mode (pro tier)
PHASE 6+: LLM + auth + enterprise (post-capstone)
```

## Sub-Phases

| # | Focus | Priority | Key Deliverables |
|---|-------|----------|-----------------|
| 2.1 | CSS Consolidation | P0 | Kill colors block, one text pattern, zero hardcoded white |
| 2.2 | Section Routing | P0 | Per-section right panel editor, edit overlay, dropdown |
| 2.3 | Section Editors (ALL 8) | P0 | SIMPLE tab for: Hero(done), Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props |
| 2.4 | Section CRUD | P1 | Add section picker, remove, duplicate, reorder (arrows) |
| 2.5 | Light/Dark Mode | P1 | Per-theme palette pairs, system preference |
| 2.6 | Media Pickers | P1 | Image/video dialogs with thumbnails, gradient picker |
| 2.7 | Playwright + Polish | P2 | Full test suite, Google Fonts loading |

## Key Documents

| File | Purpose |
|------|---------|
| `implementation-plan.md` | Master checklist with all sub-phases and DoD |
| `human-1.md` | Bradley's scope correction (the authoritative directive) |
| `backlog/future-phases.md` | Phase 3-6+ roadmap with open core model |
| `log.md` | Session log |

## Architecture Pattern (Per Section Type)

```
src/data/themes/*.json          → section entry with enabled, variant, components[]
src/templates/{type}/schema.ts  → Zod schema for section content
src/templates/{type}/{Variant}.tsx → Renderer component
src/components/right-panel/simple/Section{Type}Simple.tsx → SIMPLE tab editor
```

## What Phase 2 Does NOT Do

- Onboarding page (Phase 3)
- Drag-and-drop reorder (Phase 3)
- Full-page preview mode (Phase 3)
- Expert tab content (Phase 5)
- Accessibility dialog (Phase 4)
- XAI Docs live generation (Phase 4)
- Login/auth/database (Phase 6+)

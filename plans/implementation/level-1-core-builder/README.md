# Level 1: Core Builder — Living Document

**Status:** Phase 1.3 COMPLETE | Phase 1.4 NEXT
**Last Updated:** 2026-03-29

---

## Master Checklist

**See: `implementation-plan.md`** — the single source of truth for all Phase 1 items with scores and status.

## Phase Progress

| Sub-Phase | Status | Score |
|-----------|--------|-------|
| 1.0 — Shell & Navigation | ✅ COMPLETE | 55/64 (86%) |
| 1.1 — Hero + JSON Core Loop | ✅ COMPLETE | 33/48 (69%) |
| 1.2 — JSON Templates + ADRs + Smoke Test | ✅ COMPLETE | ~38/48 (est) |
| 1.3 — Theme System v3 | ✅ COMPLETE | ~72/88 (82%) |
| 1.4 — Hero Simple Mode Complete | 🔄 NEXT | — |

## Key Files

| File | Purpose |
|------|---------|
| `implementation-plan.md` | Master checklist — ALL items, scores, and future phases |
| `retrospective.md` | Brutally honest per-phase review |
| `rubric.md` | Detailed scoring per requirement |
| `log.md` | Session log |
| `backlog/` | Per-phase backlog + debt items |
| `sessions/` | Per-session summaries |
| `human-feedback/` | Bradley's directives and feedback |

## Architecture

- **JSON-driven**: Everything flows through `MasterConfig` (Zod-validated)
- **Three-level hierarchy**: site → theme → sections (ADR-012)
- **Component-level config**: Each UI element has id, type, enabled, order, props (ADR-016)
- **Full theme replacement**: `applyVibe()` swaps theme + sections, preserves copy only (ADR-018)
- **6-slot palette**: bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary (ADR-019)

## Quick Commands

```bash
npm run dev    # Dev server at localhost:5173
npm run build  # Production build
npm run lint   # Lint check
```

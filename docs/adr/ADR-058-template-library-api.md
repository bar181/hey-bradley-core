# ADR-058: Template Library API

**Status:** Accepted
**Date:** 2026-04-27 (P29 Sprint D P1)
**Deciders:** Bradley Ross
**Phase:** P29

## Context

Sprint B (P23-P25) shipped the TEMPLATE_REGISTRY (3 baseline templates) + scoping + intent translation. Sprint C (P26-P28) layered AISP intent classification + LLM-driven selection. Sprint D opens with **template library** — user-facing browse/apply/filter APIs over the same registry, plus a `kind` field to distinguish direct-patch templates ('patcher') from upcoming content-generator templates ('generator').

The library is intentionally a **decoration over** the existing registry — no schema migration, no breaking change to consumers. New templates added to `TEMPLATE_REGISTRY` get default metadata; production templates declare it explicitly.

## Decision

### File

`src/contexts/intelligence/templates/library.ts` — exposes:
- `TemplateMeta` (extends `Template` with `category`, `examples`, `kind`)
- `TEMPLATE_LIBRARY` (the decorated registry; readonly array)
- `listTemplates()` — full list
- `listTemplatesByCategory(cat)` — filter by `theme | section | content`
- `getTemplateById(id)` — lookup; returns null on miss
- `listTemplatesByKind(kind)` — filter by `patcher | generator`

### Categories (P29 baseline)

| Category | Purpose | Examples |
|---|---|---|
| `theme` | mass theme/palette changes | `make-it-brighter` |
| `section` | section-level structural changes (show/hide/reorder) | `hide-section` |
| `content` | text/copy edits within a section | `change-headline` |

### Kinds

| Kind | Behavior | Sprint that lands |
|---|---|---|
| `patcher` | template envelope returns deterministic JSON patches (P23 contract) | P23 |
| `generator` | template envelope returns patches AFTER an LLM content-generation call | P31 |

Sprint D P31 ships the first `generator` template (content generation); P29 only declares the type and decorates the existing `patcher` registry.

### Why a decoration, not a refactor

- **Backward compat:** Existing `tryMatchTemplate` and `runTwoStepPipeline` consumers continue to use `Template`; library API is additive.
- **No schema migration:** `TemplateMeta` is constructed at module-load time from the `BASELINE_META` table; no DB rows.
- **Future templates declare metadata** in the registry directly — `BASELINE_META` is the migration shim for the 3 baseline P23 templates.

## Trade-offs accepted

- **`BASELINE_META` is hand-curated.** Acceptable while the registry is small (3 templates). Sprint D P30 introduces user-generated templates persisted to IndexedDB with metadata declared in the row.
- **`category` enum is closed at 3.** Future categories (e.g., `layout`, `data`) require ADR amendment.
- **No UI surface in P29.** The library API is plumbing; consumer UI (browse picker) lands in Sprint D P30 alongside the persistence layer.

## Consequences

- (+) Foundation for Sprint D P30 (template creation) + P31 (content generators) — same registry, same lookup APIs
- (+) `kind: 'generator'` placeholder for P31 means the 2-step pipeline can dispatch on kind without rewiring
- (+) Categorization opens the door for Sprint D P32 (style-aware content) — generator templates can carry tone metadata
- (-) Adds 1 module (~70 LOC); minimal complexity
- (-) Categories are coarse (3 values); P30 may need finer granularity

## Cross-references

- ADR-050 (Template-First Chat Architecture; P23) — registry contract
- ADR-051 (Section Targeting Syntax; P24)
- ADR-053 (AISP Intent Classifier; P26)
- ADR-057 (2-step AISP Template Selection; P28) — consumer of template kind for dispatch
- `phase-18/roadmap-sprints-a-to-h.md` Sprint D P29-P33

## Status as of P29 seal

- `library.ts` shipped with TEMPLATE_LIBRARY decorated registry ✅
- 5 list/filter/lookup APIs ✅
- 3 baseline templates categorized + tagged with `kind: 'patcher'` ✅
- 5 pure-unit tests covering list/filter/getById ✅
- Build green; tsc clean; backward-compat with P23-P28 ✅

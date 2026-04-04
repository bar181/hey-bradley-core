# ADR-001: JSON as Single Source of Truth

**Status:** Accepted
**Date:** 2026-03-27
**Deciders:** Bradley Ross

## Context

Hey Bradley needs a consistent data model where UI controls, JSON display, spec generation, and LLM patches all operate on the same data. Any divergence between these views would create bugs and confuse users.

## Decision

All site configuration is stored as a single JSON object in a Zustand store (`configStore`). Every input method (DRAFT controls, EXPERT controls, JSON editor, LLM patches, voice commands) reads from and writes to this same object. Every output view (Reality preview, Data tab, XAI Docs, Workflow) derives from it.

```
MASTER JSON (configStore)
    ├── REALITY Tab (React render)
    ├── DATA Tab (JSON display)
    ├── XAI DOCS Tab (spec generation)
    └── WORKFLOW Tab (pipeline events)
```

## Consequences

**Positive:**
- No hidden state in components — everything is inspectable in DATA tab
- Bidirectional sync is trivial — all views are derived
- LLM patches target a single structure
- Undo/redo operates on one object
- Spec generation is a pure function of config

**Negative:**
- Large JSON object may cause re-render performance issues → mitigate with Zustand selectors
- Complex nested mutations need careful deep-merge logic (see ADR-007)

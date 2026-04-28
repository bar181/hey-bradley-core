# ADR-050: Template Registry — Real Templates Beyond Regex Fixtures

**Status:** Proposed (stub authored P21 Cleanup; full content lands in P23 Sprint B Phase 1)
**Date:** 2026-04-27 (stub)
**Deciders:** Bradley Ross
**Phase:** P23 (Sprint B Phase 1 — Simple Chat)

## Context

Through P19, chat input handling relies on:
- `src/data/llm-fixtures/step-2.ts` — 5 regex fixtures (hero heading / accent color / serif font / hero subheading / blog article)
- `src/lib/cannedChat.ts` — prefix parser for canned commands

These are pattern-matched envelopes, not first-class "templates" with metadata. Sprint B (P23-P25) introduces a typed template registry to replace ad-hoc regex.

## Decision (proposed)

Define a `Template` type with `{ id, label, intent, patchOps, ttl }` shape. Seed registry with 2-3 real templates ("make it brighter", "hide the hero", "warmer colors"). Resolve user input → Template via intent classifier rather than first-match regex.

## Consequences (proposed)

- (+) Templates become introspectable, testable, listable in a "What can I ask?" UI
- (+) Replace fragile regex-first-match with deterministic intent → template lookup
- (-) Net new abstraction layer; needs registry persistence in IndexedDB or in-source

## Cross-references

- ADR-044 (JSON patch contract) — templates emit patches via the same envelope
- ADR-052 (AISP intent classifier — proposed) — drives template selection in Sprint C
- Phase 23 plan (Sprint B Phase 1 — Simple Chat)

**Stub: full content drafted at P23 kickoff.**

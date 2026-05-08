# ADR-051: Intent Translator — Messy Input → Structured To-Do

**Status:** Proposed (stub authored P21 Cleanup; full content lands in P25 Sprint B Phase 3)
**Date:** 2026-04-27 (stub)
**Deciders:** Bradley Ross
**Phase:** P25 (Sprint B Phase 3 — Intent Translation)

## Context

User chat input is messy ("can you make the top a bit warmer and like move the button down or something"). Current pipeline (P18-P19) routes the raw string through a fixture regex match → canned fallback. There's no normalization step.

Sprint B Phase 3 introduces an intent-translation middleware that turns messy input into a structured `Intent { verb, target, value, modifiers }` BEFORE the LLM call (or fixture lookup).

## Decision (proposed)

Add `src/contexts/intelligence/intent/parser.ts` exposing `parseIntent(text: string): Intent | null`. Use a small transformer prompt or rule-based classifier (TBD at P25). Route Intent → Template (ADR-050) → patch.

## Consequences (proposed)

- (+) User input becomes inspectable; chat surface can show "I heard: make the hero brighter"
- (+) Prerequisite for Sprint C AISP-driven intent classifier (ADR-052)
- (-) New middleware step adds latency; mitigate by caching common intents

## Cross-references

- ADR-050 (template registry) — Intent → Template lookup
- ADR-052 (AISP intent classifier — proposed Sprint C) — supersedes/extends
- Phase 25 plan (Sprint B Phase 3)

**Stub: full content drafted at P25 kickoff.**

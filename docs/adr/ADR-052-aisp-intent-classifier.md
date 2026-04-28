# ADR-052: AISP Intent Classifier — Crystal Atom for Intent Recognition

**Status:** Proposed (stub authored P21 Cleanup; full content lands in P26 Sprint C Phase 1)
**Date:** 2026-04-27 (stub)
**Deciders:** Bradley Ross
**Phase:** P26 (Sprint C Phase 1 — AISP Instruction Layer)

## Context

P18 shipped AISP Crystal Atom in the LLM system prompt (ADR-045). The atom defines `Site` schema and validation rules but does NOT classify user intent.

Sprint C (P26-P28) extends AISP usage from system-prompt-only to active intent classification: a Crystal Atom that maps user prose → typed `Intent` symbol vocabulary (math-first, 512 symbols per `bar181/aisp-open-core ai_guide`).

## Decision (proposed)

Author an AISP Crystal Atom for intent classification, distinct from the existing `Site` configuration atom. Wire as the FIRST LLM call in the chat pipeline; output is a typed Intent the rest of the pipeline consumes.

## Consequences (proposed)

- (+) AISP becomes user-facing (visible in Blueprints AISP sub-tab from P22 website rebuild + P20 C12)
- (+) Full multi-step pipeline as articulated in `phase-18/strategic-vision.md` §"Multi-step LLM pipeline"
- (-) Two-step LLM pipeline doubles per-chat token cost; must update cost-cap math
- (-) Adds a failure mode (AISP intent classifier can return invalid Intent)

## Cross-references

- ADR-045 (system prompt AISP) — sibling Crystal Atom
- ADR-051 (intent translator — proposed) — replaced/extended by AISP version
- ADR-050 (template registry) — output of AISP intent classifier feeds template selection
- `bar181/aisp-open-core` `ai_guide` — symbol vocabulary source
- Phase 26 plan (Sprint C Phase 1)

**Stub: full content drafted at P26 kickoff.**

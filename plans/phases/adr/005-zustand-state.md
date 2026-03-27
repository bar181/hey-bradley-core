# ADR-005: Zustand for State Management

**Status:** Accepted
**Date:** 2026-03-27
**Deciders:** Bradley Ross

## Context

Need state management that is lightweight, JSON-native, supports middleware (undo, persistence), and doesn't require provider wrappers.

## Decision

Use Zustand for all state management with three stores:

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `configStore` | Master JSON config (site data) | localStorage (debounced 2s) |
| `uiStore` | UI mode state (LISTEN/BUILD, DRAFT/EXPERT, active tab, selected section) | None (ephemeral) |
| `chatStore` | Chat history + pending patches (Phase 5+) | None |

### Hard Rules
- If changing the value would change exported JSON, generated specs, or LLM context → it MUST live in `configStore`
- UI-only state (dropdown open, accordion expanded, input focus) → `useState` local
- Auth state (Phase 4+) → `authStore`

## Consequences

**Positive:**
- No providers, no boilerplate
- Middleware handles undo/redo and persistence cleanly
- Store subscriptions enable DDD cross-context communication without import violations
- JSON-native — perfect for configStore

**Negative:**
- No built-in devtools (mitigated by DATA tab showing full state)
- Multiple stores require discipline in what lives where

## Alternatives Rejected
- **Redux**: Too much boilerplate for this use case
- **React Context**: Re-renders entire tree, no middleware support
- **Jotai/Recoil**: Atom model doesn't fit single-JSON-object architecture

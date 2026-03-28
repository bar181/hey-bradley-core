# ADR-010: JSON as Single Source of Truth (Reinforced)

## Status: ACCEPTED (2026-03-28)

## Context
The Data Tab incident (raw HTML class names displayed as text) exposed a fundamental architecture issue: the system was treating JSON as an afterthought — a "debug view" of internal state. The correct architecture is the inverse: JSON IS the application state. Everything renders FROM the JSON. The JSON drives the preview, the docs, the export.

This ADR reinforces ADR-001 and makes it explicit: the data flow is strictly Input → JSON → Output. There are no shortcuts.

## Decision

### The Iron Rule
```
ALL INPUTS → configStore (JSON) → ALL OUTPUTS

Inputs:                    Outputs:
- Right panel controls     - Reality preview
- DATA tab editor          - DATA tab display
- Chat (future)            - XAI Docs (future)
- Voice (future)           - AISP specs (future)
- Import                   - Export
- Vibe presets             - Workflow status
```

### Consequences
1. The DATA tab is NOT a debug tool. It is the primary engineering view of the application state.
2. Every control MUST write to configStore. No component may have "local-only" state that affects rendering.
3. Every visual output MUST read from configStore. No component may hardcode values.
4. The JSON schema (Zod) is the contract. Invalid JSON never reaches configStore.
5. CodeMirror 6 replaces custom syntax highlighters — no more hand-rolled HTML injection.

### Quality Gate
Before any UI ships, verify:
- Change control → JSON updates (check DATA tab)
- Edit JSON → preview updates (check Reality tab)
- No raw HTML, class names, or debug artifacts in rendered output

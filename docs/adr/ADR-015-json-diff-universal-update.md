# ADR-015: JSON Diff as Universal Update Format

**Date:** 2026-03-28 | **Status:** ACCEPTED

## Context

ADR-010 established that JSON is the single source of truth. But ADR-010 didn't specify HOW inputs write to the JSON. Without a constraint, each input source (right-panel controls, chat, voice, direct JSON editing) could implement its own mutation strategy, leading to inconsistent state transitions and making undo/redo impossible.

Builder.io's editor works by "messaging down the JSON and sending patches as edits are made." The SDK receives diffs, not full state replacements. WordPress's Gutenberg editor uses a similar pattern: block changes produce structured deltas that flow through a central dispatch. Framer tracks property overrides explicitly and can reset them individually -- which requires knowing the diff from the base state.

The current Hey Bradley codebase has `configStore` but no enforced rule that all inputs must go through a single patch mechanism.

## Decision

All configuration changes, regardless of input source, MUST produce a JSON diff object and submit it through `configStore.applyPatch()`. No input source directly mutates the config state.

### The Flow

```
Input Source          JSON Diff              State
-----------          ---------              -----
Right panel     -->  { theme: { colors:     configStore.applyPatch(diff)
  control             { primary: "#ff0" }}}   --> deepMerge(current, diff)
                                                --> notify subscribers
Chat command    -->  { sections: [{ id:        --> push to undo stack
                       "hero-01", style:       --> validate against schema
                       { background: "#000" }}]}

Voice command   -->  (same diff format)

DATA tab edit   -->  (full replacement diff
                      computed by JSON diff
                      algorithm)

Import          -->  (full config as diff)
```

### Diff Format

A diff is a partial JSON object matching the structure of the full config. Only the keys being changed are present. The `deepMerge` utility recursively merges the diff into the current state.

For array items (sections, components), diffs target items by `id`, not by array index, to avoid index-shift bugs:

```json
{
  "sections": [
    { "id": "hero-01", "style": { "background": "#1a1a2e" } }
  ]
}
```

### Invariants

1. `applyPatch()` is the ONLY function that writes to config state
2. Every call to `applyPatch()` pushes to the undo stack before merging
3. Every diff is validated against the Zod schema before being applied
4. Invalid diffs are rejected with a structured error, never partially applied

## Consequences

- **Positive**: Undo/redo is trivial. The undo stack stores diffs. Undo = apply the inverse diff. Redo = re-apply the original diff.
- **Positive**: Change tracking is automatic. Every diff in the stack is a record of what changed, when, and (via metadata) by which input source.
- **Positive**: Testing any input source reduces to testing the diff it produces. The merge logic is tested once, centrally.
- **Positive**: Collaborative editing (future) works through the same mechanism: remote diffs arrive and go through `applyPatch()`.
- **Trade-off**: The DATA tab (direct JSON editing) must compute a diff between the previous state and the edited state, rather than replacing the whole config. This requires a JSON diff algorithm (e.g., `deep-diff` or `fast-json-patch`).
- **Trade-off**: Array-by-id targeting means the merge utility must be aware of `id` fields in arrays, adding complexity to `deepMerge`.

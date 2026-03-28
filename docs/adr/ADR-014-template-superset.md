# ADR-014: Template Superset

**Date:** 2026-03-28 | **Status:** ACCEPTED

## Context

Hey Bradley needs two JSON files: one that shows every possible configuration option (the "what's possible" reference) and one that ships as the starting point for new users (the "what you get by default"). Without a clear rule about which file owns what, options get added inconsistently -- sometimes to the default, sometimes to the template, sometimes to neither.

WordPress's `theme.json` approach provides a reference: WordPress ships a `default-settings.json` alongside user-defined `theme.json`, and the merge strategy is well-defined. Builder.io's component registration requires declaring all possible inputs upfront (the input schema), which acts as the superset, while default values are a subset.

The current project has `src/data/default-config.json` but no template config.

## Decision

Two JSON files with a strict superset relationship:

1. **`template-config.json`** -- Contains ALL possible keys for every section type, every component type, and every style property. Every key that the system can read must appear here. This file serves as both documentation and validation reference. It grows monotonically: keys are added, never removed.

2. **`default-config.json`** -- Contains Hey Bradley's starting content. It is always a strict subset of `template-config.json`. Every key in default MUST exist in template. Not every key in template needs to appear in default.

The relationship: **Template is a superset of Default** (`template-config.json` keys include all `default-config.json` keys).

### Rules

| Scenario | Action |
|----------|--------|
| Adding a new feature/option | Add key to template first. Optionally add to default if it should be visible on first load. |
| Removing a feature | Remove from default. Keep in template with a `"deprecated": true` annotation. |
| Validating user config | Validate against template's key set. Unknown keys are rejected. |
| Resetting to defaults | Replace current config with a deep clone of default. |

## Consequences

- **Positive**: `template-config.json` is the living documentation of "what can this system do." New developers read it to understand all options.
- **Positive**: Validation is straightforward: any key not in template is invalid. No guessing about allowed fields.
- **Positive**: The Zod schema (ADR-010) can be auto-generated from template-config.json, keeping the schema and the reference file in sync.
- **Trade-off**: Template grows with every phase. By Phase 7, it will be large. This is acceptable because it's a reference document, not a runtime artifact -- it's read for validation, not loaded into the renderer.
- **Trade-off**: Maintaining the superset invariant requires discipline. A CI check should verify that every key in default-config.json exists in template-config.json.

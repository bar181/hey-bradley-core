# ADR-026: AISP Spec as Primary Output

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Hey Bradley is a specification builder, not a website builder. The platform collects user intent (site metadata, theme preferences, section structure, content) via a visual builder interface and stores it as a MasterConfig JSON object. However, there is currently no way for users to export or view the specification they have created. The builder produces a preview but has no "deliverable" output.

The AISP (AI Specification Protocol) is a formal specification format designed for machine-readable instructions. Hey Bradley already declares `site.spec: "aisp-1.2"` in every config, but does not actually produce AISP output.

Users need two output formats:

1. **Human-readable** -- a structured markdown document that a client, PM, or developer can review, share, and approve.
2. **Machine-readable** -- an AISP Crystal Atom specification that an AI agent can consume to build the actual website.

## Decision

The XAI DOCS tab in the builder will produce specifications, not HTML. It will have two sub-views:

### HUMAN View

Renders the MasterConfig as a structured markdown specification document containing:
- Site metadata header (title, version, author, domain)
- Design system summary (palette table, typography, spacing)
- Ordered section inventory with variant, layout, and component details
- Each component listed with its type, props, and content values

### AISP View

Renders the MasterConfig as an AISP 5.1 Crystal Atom `⟦Ω, Σ, Γ, Λ, Ε⟧` containing:
- `Ω` (Objective): site title and purpose
- `Σ` (Types): schema definitions for Site, Theme, Palette, Section, Component
- `Γ` (Rules): rendering rules, section ordering, palette application
- `Λ` (Bindings): actual config values from the current MasterConfig
- `Ε` (Evidence): verification criteria (unique IDs, spec version, section count)

### Implementation

Two pure transformer functions:

```typescript
// src/lib/output/humanSpec.ts
function configToHumanSpec(config: MasterConfig): string

// src/lib/output/aispSpec.ts
function configToAispSpec(config: MasterConfig): string
```

Both functions are pure (no side effects), deterministic, and produce string output. They react to config store changes and update the DOCS tab in real time.

### Content Resolution

Transformers must resolve section content from both paths:
1. `section.components[]` (preferred, new structure)
2. `section.content.*` (legacy fallback)

This mirrors the existing `resolveHeroContent()` pattern in `src/lib/schemas/section.ts`.

## Consequences

- A new `src/lib/output/` directory is created for transformer functions.
- The DOCS tab must be built or updated with HUMAN and AISP sub-views.
- A markdown renderer component is needed for the HUMAN view preview.
- AISP symbol syntax highlighting is desirable but not required for MVP.
- Copy-to-clipboard functionality must be provided for both views.
- The AISP output establishes Hey Bradley as a specification tool, not a code generator. This is a core product positioning decision.
- Future AI agents can consume the AISP output to generate actual websites, completing the spec-to-site pipeline.
- Both output formats must stay in sync with MasterConfig schema changes; if new fields are added to the schema, the transformers must be updated.

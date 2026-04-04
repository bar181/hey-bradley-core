# ADR-033: AISP Brownfield Integration — reuse(), extends(), imports() Operators

**Status:** Proposed
**Date:** 2026-04-04
**Deciders:** Bradley Ross
**Supersedes:** Extends ADR-026 (AISP Spec as Primary Output), ADR-032 (Section-Level Crystal Atoms)

---

## Context

Hey Bradley currently generates AISP Crystal Atoms that describe greenfield websites: every section, component, style, and layout is defined from scratch within the specification. The generated spec assumes no pre-existing codebase, no reusable components, and no external data sources.

This is sufficient for the current use case (marketing sites for small businesses) but insufficient for the commercial thesis. The capstone's central argument is that AISP can serve as a universal specification protocol for AI-driven development. The primary commercial example is a brownfield scenario: a nurse's intake form that must integrate with an existing patient management system, reuse existing UI components, extend existing layouts, and import existing database schemas.

In a brownfield context, the majority of the implementation already exists. The specification must communicate what to reuse, what to extend, and what to import from the existing codebase — not just what to build from scratch. Without brownfield operators, an AI agent consuming the spec would either:

1. Rebuild everything from scratch (wasteful, breaks integration with existing systems)
2. Require out-of-band instructions not captured in the spec (defeats the purpose of a self-contained specification)

The AISP 5.1 reference defines the Gamma block (`⟦Γ⟧`) as the rule system that constrains how a document is realized. The reference's Binding Function (`⟦Γ:Binding⟧`) already establishes the precedent for operators that describe relationships between entities: `Post(A) ⊆ Pre(B)` describes a contract dependency between two components. Brownfield operators extend this pattern to describe relationships between the spec and an external codebase.

---

## Decision

### Three Brownfield Operators

Add three operators to the AISP Gamma rule vocabulary. These operators appear inside section-level `Γ_type` blocks (per ADR-032) and reference artifacts in the target codebase.

#### `reuse(path)`

Instructs the AI agent to use an existing component, module, or file as-is without modification.

```
Γ_intake := {
  reuse(src/components/DataTable),
  reuse(src/components/FormField),
  reuse(src/hooks/usePatientSearch)
}
```

**Semantics:** The referenced artifact exists in the target codebase and must be imported and used without modification. The AI agent must not generate a replacement. If the artifact does not exist at the specified path, the spec fails validation.

#### `extends(base)`

Instructs the AI agent to create a new artifact that inherits from or composes an existing one.

```
Γ_intake := {
  extends(BaseLayout),
  extends(FormSection)
}
```

**Semantics:** The new artifact must be a structural extension of the base. For React components, this means wrapping or composing the base component. For layouts, this means using the base layout as a parent. For TypeScript types, this means using `extends` or intersection types. The base must exist in the target codebase.

#### `imports(schema)`

Instructs the AI agent to use an existing data schema, type definition, or API contract.

```
Γ_intake := {
  imports(PatientDB.schema),
  imports(types/FormValidation),
  imports(api/endpoints/patients)
}
```

**Semantics:** The referenced schema defines the data contract that the new code must conform to. The AI agent must use the existing types rather than generating new ones. For database schemas, the agent must use the existing table structure. For API contracts, the agent must use the existing endpoint signatures.

### Gamma Block with Brownfield Operators

A brownfield section-level Crystal Atom combines existing Gamma rules (from ADR-032) with brownfield operators:

```
⟦Γ_intake, Λ_intake, Ε_intake⟧ := {
  Γ_intake := {
    // Brownfield operators
    reuse(src/components/DataTable),
    reuse(src/components/FormField),
    extends(BaseLayout),
    imports(PatientDB.schema),
    imports(types/FormValidation),

    // Section-specific rules (per ADR-032)
    intake.variant = "multi-step",
    intake.components.patientSearch.type = "search-field",
    intake.components.patientSearch.props.dataSource = PatientDB,
    ∀ field ∈ intake.components : field.validation ∈ FormValidation,
    □ intake.autosave = ⊤ ∧ intake.autosave.interval ≤ 30s
  },
  Λ_intake := {
    variant: "multi-step",
    steps: 4,
    components := [
      ⟨patientSearch: search-field, dataSource: PatientDB, placeholder: "Search by name or MRN"⟩,
      ⟨vitals: form-group, fields: ["bp", "pulse", "temp", "weight", "height"]⟩,
      ⟨chiefComplaint: textarea, maxLength: 2000⟩,
      ⟨review: summary-panel, reuse: DataTable⟩
    ]
  },
  Ε_intake := {
    VERIFY reuse(src/components/DataTable) |> exists,
    VERIFY reuse(src/components/FormField) |> exists,
    VERIFY extends(BaseLayout) |> exists,
    VERIFY imports(PatientDB.schema) |> exists,
    VERIFY intake.steps ≥ 1,
    VERIFY ∀ field ∈ intake.components : field.validation ≠ ⊥
  }
}
```

### Formal Type Definitions

The brownfield operators are added to the AISP Sigma type system:

```
Σ := {
  ...existing types...
  BrownfieldOp : 𝕋 := reuse(Path) | extends(Base) | imports(Schema),
  Path : 𝕋 := 𝕊,          // Relative path from project root
  Base : 𝕋 := 𝕊,           // Component or layout identifier
  Schema : 𝕋 := 𝕊,         // Schema identifier (dot-notation for nested)
  CodebaseRef : 𝕋 := ⟨path: Path, exists: 𝔹, hash: Hash?⟩
}
```

### Evidence Block: Existence Verification

The Evidence block for brownfield sections must verify that all referenced artifacts exist. The `|> exists` pipeline operator checks that the referenced path resolves to a file, type, or export in the target codebase:

```
Ε_brownfield := {
  VERIFY reuse(path) |> exists,
  VERIFY extends(base) |> exists,
  VERIFY imports(schema) |> exists
}
```

When the spec is consumed by an AI agent, existence verification is the first step before code generation begins. If any brownfield reference fails to resolve, the agent must report the missing dependency rather than generating a replacement.

### Generator Changes

The `generateSectionAtom` function (from ADR-032) is extended to accept an optional `brownfield` configuration per section:

```typescript
interface BrownfieldConfig {
  reuse: string[]      // Paths to reuse as-is
  extends: string[]    // Base components/layouts to extend
  imports: string[]    // Schemas/types to import
}
```

For Phase 10, brownfield configuration is manual (entered by the user or spec author). Future phases will support automatic brownfield detection by scanning a target codebase and suggesting reuse/extends/imports candidates.

---

## Consequences

### Positive

- **Commercial viability** — enables the nurse's intake form use case and any brownfield integration scenario, which is the primary commercial thesis for Hey Bradley
- **Spec completeness** — a brownfield AISP spec is fully self-contained; an AI agent does not need out-of-band instructions about what to reuse
- **Reduced generation waste** — AI agents skip generating components that already exist, reducing token usage, latency, and error surface
- **AISP differentiation** — no competing specification format (OpenAPI, Swagger, Storybook) includes brownfield integration operators; this is a novel contribution
- **Backward compatible** — greenfield specs contain no brownfield operators and are unaffected; the operators are additive

### Negative

- **Codebase coupling** — brownfield specs are tied to a specific codebase structure; if the codebase refactors paths, the spec breaks
- **Validation complexity** — existence verification requires filesystem access or a codebase index, which is not available in the current browser-only architecture
- **Manual configuration** — for Phase 10, brownfield references must be manually entered; automatic detection is a future capability

### Risks

- Path references may become stale if the target codebase changes between spec generation and spec consumption. Mitigated by including optional content hashes in `CodebaseRef` so the agent can detect drift.
- The three operators (reuse, extends, imports) may not cover all brownfield relationships. For example, "wrap" (use a component but add a wrapper layer) or "fork" (copy and modify) are not addressed. These can be added as future operators without breaking the existing three.

---

## References

- ADR-026: AISP Spec as Primary Output — establishes Crystal Atom format
- ADR-032: AISP Section-Level Crystal Atoms — per-section `⟦Γ, Λ, Ε⟧` structure
- AISP 5.1 Reference: `plans/initial-plans/00.aisp-reference.md` — Binding Function `⟦Γ:Binding⟧` precedent
- Commercial thesis: Nurse's intake form brownfield integration
- Hey Bradley North Star v5: Stage 4 (Open Core) targets brownfield enterprise use cases

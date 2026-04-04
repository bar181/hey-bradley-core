# ADR-032: AISP Section-Level Crystal Atoms

**Status:** Proposed
**Date:** 2026-04-04
**Deciders:** Bradley Ross
**Supersedes:** Extends ADR-026 (AISP Spec as Primary Output)

---

## Context

ADR-026 established the AISP Crystal Atom as the machine-readable output format for Hey Bradley specifications. The current implementation in `src/lib/specGenerators/aispSpecGenerator.ts` produces a single monolithic Crystal Atom `⟦Ω, Σ, Γ, Λ, Ε⟧` for the entire site configuration. This approach has three structural deficiencies:

### 1. Generic Gamma Rules

The current Gamma block contains seven rules (R1-R7) that apply universally to all sections:

```
Γ := {
  R1: forall s in sections : s.enabled = top implies render(s),
  R2: forall s in sections : s.type in SectionType,
  R3: forall c in s.components : c.enabled = top implies display(c),
  ...
}
```

These rules are tautological. They state that enabled sections should render and enabled components should display. They carry no section-specific rendering logic. An AI agent consuming this spec cannot determine how a hero section differs from a pricing section, what layout constraints apply to a columns section, or what interactive behavior a testimonials section requires.

### 2. Monolithic Lambda Bindings

All section data is serialized into a flat `sections := [...]` array inside a single Lambda block. There is no structural separation between section types. The bindings for a hero section (headline, subheading, CTA button) are indistinguishable in structure from the bindings for a pricing section (tiers, prices, features). An AI agent must infer section semantics entirely from the `type` string, with no formal contract for what each type requires.

### 3. No Per-Section Verification

The Evidence block (`Ε`) contains seven generic verification checks (V1-V7) that apply to the whole site. There is no verification that a hero section has a headline, that a pricing section has at least one tier, or that a columns section has a valid column count. Section-level invariants are not expressed.

Per the AISP 5.1 reference specification (Section Gamma: Signal Theory), Gamma rules should encode structural constraints specific to each domain entity. The current implementation treats all sections as undifferentiated data bags.

---

## Decision

### Per-Section Crystal Atoms

The AISP generator will produce a nested Crystal Atom structure where each section type receives its own `⟦Γ_type, Λ_type, Ε_type⟧` sub-atom within the master atom. The master atom retains the global `Ω`, `Σ`, and site-level `Λ` bindings.

### Structure

```
⟦
  Ω := { ... }           // Global objective (unchanged)
  Σ := { ... }           // Type system (extended with per-section types)

  // Per-section Crystal Atoms
  ⟦Γ_hero, Λ_hero, Ε_hero⟧ := {
    Γ_hero := {
      hero.variant = "centered" ∧ hero.components.headline.type = "heading",
      hero.components.headline.text ≠ ⊥,
      hero.variant ∈ {"centered", "split", "minimal", "video", "gradient"},
      hero.components.cta.enabled = ⊤ ⟹ hero.components.cta.props.url ≠ ⊥,
      □ hero.fullWidth = ⊤ ∧ hero.minHeight ≥ "60vh"
    },
    Λ_hero := {
      variant: "centered",
      components := [
        ⟨headline: heading, text: "Build Something Great"⟩,
        ⟨subheading: text, text: "The platform for modern teams"⟩,
        ⟨cta: button, text: "Get Started", url: "/signup"⟩
      ]
    },
    Ε_hero := {
      VERIFY hero.components.headline.text ≠ ⊥,
      VERIFY hero.variant ∈ SectionVariants.hero,
      VERIFY hero.components |> filter(enabled) |> length ≥ 1
    }
  }

  ⟦Γ_pricing, Λ_pricing, Ε_pricing⟧ := {
    Γ_pricing := {
      pricing.variant ∈ {"simple", "tiered", "comparison"},
      ∀ tier ∈ pricing.components : tier.type = "pricing-tier",
      ∀ tier : tier.props.price ≠ ⊥ ∧ tier.props.period ≠ ⊥,
      |pricing.components| ∈ {1, 2, 3, 4},
      ∃! tier : tier.props.highlighted = ⊤
    },
    Λ_pricing := { ... },
    Ε_pricing := {
      VERIFY |pricing.tiers| ≥ 1,
      VERIFY ∀ tier : tier.price matches /^\$?\d+/,
      VERIFY pricing.layout.columns = |pricing.tiers|
    }
  }

  ⟦Γ_columns, Λ_columns, Ε_columns⟧ := { ... }
  ⟦Γ_testimonials, Λ_testimonials, Ε_testimonials⟧ := { ... }
  ⟦Γ_faq, Λ_faq, Ε_faq⟧ := { ... }
  ⟦Γ_footer, Λ_footer, Ε_footer⟧ := { ... }
  ⟦Γ_newsletter, Λ_newsletter, Ε_newsletter⟧ := { ... }
  ⟦Γ_cta, Λ_cta, Ε_cta⟧ := { ... }

  Ε := { ... }           // Global evidence (site-level checks)
⟧
```

### Section-Specific Gamma Rule Registry

A new `src/lib/specGenerators/sectionRules.ts` module maps each section type to its Gamma rules, required components, and verification criteria:

```typescript
interface SectionRuleSet {
  gamma: string[]     // Formal Γ constraints
  required: string[]  // Required component types
  evidence: string[]  // Ε verification expressions
  variants: string[]  // Valid variant names
}

const sectionRules: Record<string, SectionRuleSet> = {
  hero: {
    gamma: [
      'hero.components.headline.text ≠ ⊥',
      'hero.variant ∈ {"centered", "split", "minimal", "video", "gradient"}',
      'hero.components.cta.enabled = ⊤ ⟹ hero.components.cta.props.url ≠ ⊥',
      '□ hero.fullWidth = ⊤ ∧ hero.minHeight ≥ "60vh"',
    ],
    required: ['heading'],
    evidence: [
      'VERIFY hero.components.headline.text ≠ ⊥',
      'VERIFY hero.variant ∈ SectionVariants.hero',
    ],
    variants: ['centered', 'split', 'minimal', 'video', 'gradient'],
  },
  pricing: {
    gamma: [
      '∀ tier ∈ pricing.components : tier.type = "pricing-tier"',
      '∀ tier : tier.props.price ≠ ⊥ ∧ tier.props.period ≠ ⊥',
      '|pricing.components| ∈ {1, 2, 3, 4}',
      '∃! tier : tier.props.highlighted = ⊤',
    ],
    required: ['pricing-tier'],
    evidence: [
      'VERIFY |pricing.tiers| ≥ 1',
      'VERIFY ∀ tier : tier.price matches /^\\$?\\d+/',
    ],
    variants: ['simple', 'tiered', 'comparison'],
  },
  // ... rules for all 8 section types
}
```

### Generator Refactor

The `generateAISPSpec` function is refactored into:

1. **`generateMasterAtom(config)`** — produces the global `Ω`, `Σ`, and site-level `Λ`/`Ε`
2. **`generateSectionAtom(section, rules)`** — produces a `⟦Γ_type, Λ_type, Ε_type⟧` sub-atom for a single section
3. **`generateAISPSpec(config)`** — orchestrates both, composing the final Crystal Atom string

The section atom generator reads the section's actual data to produce specific Gamma rules with concrete values (e.g., `hero.variant = "centered"` not just `hero.variant ∈ variants`).

---

## Consequences

### Positive

- **Machine-actionable** — an AI agent consuming the spec can read the Gamma rules for a specific section type and know exactly what constraints to satisfy, without parsing the entire document
- **Verifiable** — each section carries its own Evidence block, enabling per-section validation rather than whole-site pass/fail
- **Extensible** — adding a new section type requires adding one entry to the `sectionRules` registry; the generator handles the rest
- **AISP-compliant** — per-entity Crystal Atoms align with the AISP 5.1 reference specification's guidance on domain-specific Gamma rules
- **Debuggable** — when a generated site has a broken section, the section-level Crystal Atom isolates the problem to a specific `⟦Γ, Λ, Ε⟧` block

### Negative

- **Larger output** — per-section atoms produce a longer spec than the current monolithic approach (estimated 2-3x for a typical 8-section site)
- **Generator complexity** — the section rule registry must be maintained in sync with the section type registry (ADR-022) and component schemas
- **Breaking change** — AI agents trained on the current monolithic format will need to be updated to parse the nested atom structure

### Risks

- The section rule registry may drift from the actual component schemas if maintained as a separate data structure. Mitigated by generating the rules programmatically from the Zod schemas where possible, and by adding a test that validates the rule registry against the section type registry.

---

## References

- ADR-026: AISP Spec as Primary Output — establishes the Crystal Atom format
- ADR-022: Section Type Registry — defines the canonical section types
- AISP 5.1 Reference: `plans/initial-plans/00.aisp-reference.md` — formal notation for `⟦Γ⟧`, `⟦Λ⟧`, `⟦Ε⟧`
- Current generator: `src/lib/specGenerators/aispSpecGenerator.ts`

# AISP Crystal Atom Guide for Contributors

## What is AISP?

AISP (AI Specification Protocol) is a self-validating, proof-carrying protocol designed for high-density, low-ambiguity AI-to-AI communication. Created by Bradley Ross, it uses Category Theory and Natural Deduction to guarantee ambiguity below 2% (`Ambig(D) < 0.02`), creating a zero-trust architecture for autonomous agent swarms. In the Hey Bradley project, AISP defines the formal structure of website specification documents so that AI agents and renderers can parse them deterministically.

---

## The 5 Crystal Atom Components

Every AISP document is built from five required blocks (Crystal Atoms). Optional blocks exist but these five are mandatory.

### 1. Foundation Block `[Omega:Meta]`

Defines the metalogic, invariants, and ambiguity constraint for the document.

```
[Omega:Meta]{
  forall D in AISP: Ambig(D) < 0.02
  Ambig := lambda D. 1 - |Parse_unique(D)| / |Parse_total(D)|
}
```

**Purpose:** Establishes the rules every other block must obey. Contains the symbol alphabet and foundational axioms.

### 2. Types Block `[Sigma:Types]`

Declares every type, enum, and data structure used in the document.

```
[Sigma:Types]{
  SectionType := enum['hero','menu','columns','pricing','action','footer',
                       'quotes','questions','numbers','gallery','logos',
                       'team','image','divider','text']
  Palette := record(bgPrimary: String, bgSecondary: String,
                    textPrimary: String, textSecondary: String,
                    accentPrimary: String, accentSecondary: String)
  MasterConfig := record(site: Site, theme: Theme, sections: List(Section))
}
```

**Purpose:** Single source of truth for shapes. Maps directly to Zod schemas in `src/lib/schemas/`.

### 3. Rules Block `[Gamma:Rules]`

Defines inference rules, constraints, and validation predicates.

```
[Gamma:Rules]{
  forall section: section.type in SectionType
  forall palette: keys(palette) = {bgPrimary, bgSecondary, textPrimary,
                                    textSecondary, accentPrimary, accentSecondary}
  forall theme: theme.mode in {'light', 'dark'}
}
```

**Purpose:** Encodes business logic as formal rules. If a rule is violated, the document is invalid.

### 4. Functions Block `[Lambda:Funcs]`

Defines computable functions: parsers, validators, transforms.

```
[Lambda:Funcs]{
  validate := compose(tier, density, grammar_check, tokenize)
  density  := lambda tokens. |{t in tokens | t.kind in Alphabet}| / |{t in tokens | t.kind != ws}|
  tier     := lambda d. [>= 0.75 -> Diamond++, >= 0.60 -> Diamond+,
                          >= 0.40 -> Diamond,   >= 0.20 -> Diamond-, _ -> Reject](d)
}
```

**Purpose:** Every transformation is declared as a pure function so agents can replay or verify any step.

### 5. Evidence Block `[Epsilon]`

The proof receipt. Declares density, completeness, and tier for the document.

```
[Epsilon]<density := 0.78; completeness := 95; tier := Diamond++>
```

**Purpose:** Self-assessment. Any agent can re-derive these numbers and compare.

---

## Symbol Reference Table

Key symbols from the Sigma_512 glossary used in this project:

| Symbol | Name | Category | Meaning in Hey Bradley |
|--------|------|----------|----------------------|
| `forall` | Universal quantifier | Quantifiers | "For every section/theme/palette..." |
| `exists` | Existential quantifier | Quantifiers | "There exists at least one..." |
| `proves` | Turnstile | Transmuters | Left side proves right side |
| `models` | Double turnstile | Transmuters | Left side models/satisfies right |
| `:=` | Definition | Transmuters | Define a name to equal an expression |
| `=` | Assignment | Transmuters | Assign a value |
| `lambda` | Lambda | Transmuters | Anonymous function |
| `Diamond` | Tier marker | Quantifiers | Quality tier (Diamond++, Diamond+, Diamond, Diamond-, Reject) |
| `compose` | Composition | Transmuters | Function composition (f after g) |
| `plus` | Success/Add | Quantifiers | Successful binding or addition |
| `minus` | Failure/Sub | Quantifiers | Failed binding or subtraction |
| `tensor` | Tensor product | Quantifiers | Binding function between pockets |
| `empty` | Empty/null | Topologics | Empty set or null value |
| `epsilon` | Threshold | Topologics | Distance threshold for similarity |
| `delta` | Density | Topologics | Symbol density score (0-1) |
| `phi` | Completeness | Topologics | Completeness percentage (0-100) |
| `psi` | Intent | Intents | Intent vector in latent space |
| `AISP` | Protocol marker | Delimiters | Marks an AISP document header |
| `QED` | Proof complete | Transmuters | End of proof |

---

## How to Validate

### Using `aisp_validate`

Pass any AISP document text to the validator to check well-formedness:

```
aisp_validate(document_text)
```

Returns:
- `valid: true/false` -- whether the document parses without error
- `density` -- symbol density score (0.0 to 1.0)
- `completeness` -- percentage of required blocks present (0 to 100)
- `errors[]` -- list of specific parse or constraint violations

### Using `aisp_tier`

Determine the quality tier of a validated document:

```
aisp_tier(document_text)
```

Returns one of:
- **Diamond++ (`>=0.75`)** -- Production quality, fully proof-carrying
- **Diamond+ (`>=0.60`)** -- High quality, minor gaps
- **Diamond (`>=0.40`)** -- Acceptable, needs refinement
- **Diamond- (`>=0.20`)** -- Below threshold, significant gaps
- **Reject (`<0.20`)** -- Not valid AISP

### Running JSON validation locally

For Hey Bradley JSON data files, use the project validation script:

```bash
node scripts/validate-json.mjs
```

This validates all theme, example, palette, font, and media JSON files against their Zod schemas.

---

## Template: Creating a New Section-Level Atom

Use this template when adding a new section type or component to the AISP specification:

```
AISP1.2.section-name@YYYY-MM-DD
gamma := heyBradley.sections.sectionName
rho := <sectionType, components, validation>

[Omega:Meta]{
  forall D in AISP: Ambig(D) < 0.02
  scope := section-level atom for "sectionName"
}

[Sigma:Types]{
  SectionName := record(
    type: literal("section-type"),
    id: String,
    enabled: Boolean default true,
    order: Natural optional,
    variant: String optional,
    layout: Layout,
    content: Record(String, Unknown) default {},
    style: Style,
    components: List(Component) default []
  )

  ;; Define section-specific component types
  SectionNameCard := record(
    id: String,
    type: literal("section-name-card"),
    enabled: Boolean default true,
    order: Natural default 0,
    props: record(
      title: String,
      description: String optional
      ;; add section-specific fields here
    )
  )
}

[Gamma:Rules]{
  forall s in SectionName: s.type = "section-type"
  forall s in SectionName: s.id matches /^[a-z0-9-]+$/
  forall c in s.components: c.type in AllowedComponentTypes
  ;; add section-specific constraints here
}

[Lambda:Funcs]{
  validateSectionName := lambda s.
    let typeOk  = s.type = "section-type"
    let idOk    = matches(s.id, /^[a-z0-9-]+$/)
    let compOk  = forall c in s.components: validateComponent(c)
    in typeOk and idOk and compOk

  ;; add section-specific transform functions here
}

[Epsilon]<density := N; completeness := N; tier := DiamondX>
```

### Steps to add a new section atom:

1. Copy the template above into a new file or section of the spec
2. Replace `sectionName` / `section-type` with your actual names
3. Define component types specific to this section in `[Sigma:Types]`
4. Add constraint rules in `[Gamma:Rules]`
5. Implement the validator function in `[Lambda:Funcs]`
6. Add the corresponding Zod schema in `src/lib/schemas/section.ts`
7. Run `aisp_validate` on the atom text -- target density >= 0.60
8. Run `node scripts/validate-json.mjs` to verify JSON files still pass

---

## Ambiguity Target: < 2%

Every AISP document and atom in this project must satisfy `Ambig(D) < 0.02`. This means:

- Each symbol has exactly one meaning in context
- Each type has exactly one parse
- Each rule produces exactly one outcome for a given input
- No undefined or overloaded terms without explicit disambiguation

When contributing, ensure your atoms are deterministic and unambiguous. Use the validation tools above to verify before submitting.

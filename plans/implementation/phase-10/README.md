# Phase 10: JSON Architecture + AISP Formalization

**Status:** CLOSED (Score: 80/100)
**Start:** Post-presentation seal (after Phase 9 Sprint 4)
**Duration:** 5 sprints (~2.5 weeks)
**Owner:** Bradley Ross

---

## Goal

Standardize all JSON data files across the Hey Bradley platform and upgrade AISP Crystal Atoms to achieve <2% ambiguity per atom. This phase transforms the scattered, undocumented JSON layer into a well-architected, schema-validated, developer-friendly data tier. Simultaneously, it replaces the "AISP-flavored prose" the swarm has been producing with real Platinum-tier formal notation using full Sigma_512 symbols.

---

## Why This Matters

1. **JSON files are the backbone.** Themes, examples, media, palettes, fonts, and spec templates are all JSON. Without a formal architecture, contributors cannot safely add or modify data.
2. **Spec generators use hardcoded strings.** Moving to JSON templates enables community-contributed templates, industry-specific variants, and A/B testing of spec quality.
3. **AISP compliance is thesis-critical.** The <2% ambiguity claim requires formal mathematical notation with quantified rules, typed declarations, and verifiable evidence. Greek letters decorating English sentences do not qualify.

---

## Sprint Plan

### Sprint 1: JSON Audit + Data Architecture

**Duration:** 2-3 days
**Goal:** Full inventory of every JSON file, standardized directory structure, human-readable README.

Tasks:
- [ ] Audit all JSON files in `src/data/` (themes, examples, media, effects, palettes, fonts, config)
- [ ] Count and catalog every file: expected 50+ across all categories
- [ ] Verify each file parses against its Zod schema (masterConfig, section, palette, etc.)
- [ ] Create `src/data/README.md` listing every file with path, purpose, and schema reference
- [ ] Identify schema gaps: files with no Zod validation or incomplete typing
- [ ] Standardize naming conventions (kebab-case filenames, consistent key ordering)
- [ ] Add `$schema` or `_meta` field to each JSON file for self-documentation
- [ ] Create `src/data/schema-reference.json` as machine-readable schema index

**Definition of Done:**
- Every JSON file cataloged with purpose and schema reference
- `src/data/README.md` published and accurate
- Zero JSON files fail Zod parse
- Schema gaps documented as Sprint 2-4 tickets

---

### Sprint 2: AISP Section-Level Atoms

**Duration:** 2-3 days
**Goal:** Per-section-type formal Crystal Atoms achieving Platinum tier (<2% ambiguity each).

Tasks:
- [ ] Write Crystal Atoms for each of the 15 section types: hero, menu, columns, pricing, action, footer, quotes, questions, numbers, gallery, logos, team, image, divider, text
- [ ] Each atom must include all 5 AISP blocks: Omega (foundation), Sigma (types), Gamma (rules), Lambda (functions), Epsilon (evidence)
- [ ] Gamma rules must be per-section: structural constraints, component requirements, variant rules
- [ ] Lambda bindings must map every Zod schema field to a formal typed declaration
- [ ] Omega must define the formal context and ambiguity target per atom
- [ ] Validate every atom through `aisp_validate` -- must pass
- [ ] Validate every atom through `aisp_tier` -- must return Platinum (diamond-plus-plus)
- [ ] Zero prose inside atom bodies: only formal Sigma_512 notation
- [ ] Create symbol reference table mapping all 23 core symbols to their meanings

**Definition of Done:**
- 15 section-level Crystal Atoms, one per section type
- All pass `aisp_validate` with zero errors
- All achieve Platinum tier via `aisp_tier`
- Ambiguity score <2% per atom
- Symbol reference table published

---

### Sprint 3: AISP Brownfield Operators

**Duration:** 2 days
**Goal:** Formal operators for reuse, extension, and import in existing codebases.

Tasks:
- [ ] Define `reuse` operator: reference an existing atom without duplication
- [ ] Define `extends` operator: inherit from a base atom and override specific fields
- [ ] Define `imports` operator: pull typed declarations from external AISP documents
- [ ] Write formal Gamma rules for operator precedence and conflict resolution
- [ ] Create brownfield example: extending the `hero` atom into a `hero-video` variant
- [ ] Create brownfield example: importing palette types from theme atom into section atoms
- [ ] Validate all brownfield atoms through `aisp_validate` and `aisp_tier`
- [ ] Document operator semantics in formal notation (not prose)

**Definition of Done:**
- Three operators (reuse, extends, imports) formally defined
- Two worked brownfield examples validated at Platinum tier
- Operator conflict resolution rules specified in Gamma

---

### Sprint 4: Template JSON Refactor

**Duration:** 2-3 days
**Goal:** Replace hardcoded template strings in spec generators with JSON template files.

Tasks:
- [ ] Create `src/data/templates/` directory
- [ ] Create JSON template for North Star generator (`north-star.json`)
- [ ] Create JSON template for SADD generator (`sadd.json`)
- [ ] Create JSON template for Build Plan generator (`build-plan.json`)
- [ ] Create JSON template for Features generator (`features.json`)
- [ ] Create JSON template for Human Spec generator (`human-spec.json`)
- [ ] Create JSON template for AISP Spec generator (`aisp-spec.json`)
- [ ] Each template defines: sections (intro, body, appendix), required fields, markdown formatting rules, and output structure
- [ ] Refactor each of the 6 generators to load from JSON template instead of hardcoded strings
- [ ] Add Zod schema for template validation (`src/lib/schemas/template.ts`)
- [ ] Write unit tests for template loading and validation
- [ ] Verify all 6 spec generators produce identical output before and after refactor

**Definition of Done:**
- 6 JSON template files in `src/data/templates/`
- All generators refactored to load from templates
- Zod schema validates every template
- Regression tests pass: output matches pre-refactor exactly
- No hardcoded template strings remain in generator source

---

### Sprint 5: Quality Pass + Phase Close

**Duration:** 1-2 days
**Goal:** Full test suite, documentation review, retrospective.

Tasks:
- [ ] Run full test suite: `npm test` must pass with zero failures
- [ ] Run build: `npm run build` must succeed
- [ ] Run lint: `npm run lint` must pass
- [ ] Add Playwright tests for: template-driven spec generation, JSON loading, schema validation
- [ ] Review all new documentation for accuracy
- [ ] Update `plans/implementation/phase-10/living-checklist.md` with final status
- [ ] Write Phase 10 retrospective
- [ ] Update wiki with Phase 10 completion summary
- [ ] Verify Vercel deploy succeeds
- [ ] Update `MEMORY.md` phase status

**Definition of Done:**
- All tests pass
- Build and lint clean
- Living checklist 100% complete
- Retrospective written
- Vercel deploy verified
- Phase 10 marked CLOSED

---

## Dependencies

- Phase 9 Sprint 4 must be complete (presentation sealed)
- AISP reference: `plans/initial-plans/00.aisp-reference.md`
- Zod schemas: `src/lib/schemas/masterConfig.ts`, `section.ts`, `layout.ts`, `style.ts`
- Existing JSON: `src/data/themes/*.json`, `src/data/examples/*.json`

## Risks

| Risk | Mitigation |
|------|-----------|
| AISP atoms fail Platinum validation | Iterate with `aisp_validate` feedback; use reference doc as ground truth |
| Template refactor breaks spec output | Snapshot test: compare before/after output for all 6 generators |
| JSON audit reveals major schema gaps | Document gaps in Sprint 1; prioritize fixes by impact |
| Brownfield operators introduce ambiguity | Validate every example through both `aisp_validate` and `aisp_tier` |

## Success Metrics

- 50+ JSON files cataloged with schema references
- 15 section-level Crystal Atoms at Platinum tier
- 6 spec generator templates as JSON (zero hardcoded strings)
- <2% ambiguity per AISP atom
- Full test suite green
- Developer README enables new contributors to add JSON files without guidance

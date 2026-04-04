# Phase 10 Living Checklist

**Phase:** JSON Architecture + AISP Formalization
**Last Updated:** 2026-04-04
**Status:** Planning

---

## Sprint 1: JSON Audit + Data Architecture

### Audit
- [ ] Catalog all theme JSON files (target: 10+)
  - [ ] `src/data/themes/saas.json`
  - [ ] `src/data/themes/agency.json`
  - [ ] `src/data/themes/blog.json`
  - [ ] `src/data/themes/creative.json`
  - [ ] `src/data/themes/minimalist.json`
  - [ ] `src/data/themes/personal.json`
  - [ ] `src/data/themes/portfolio.json`
  - [ ] `src/data/themes/professional.json`
  - [ ] `src/data/themes/startup.json`
  - [ ] `src/data/themes/wellness.json`
- [ ] Catalog all example JSON files (target: 8+)
  - [ ] `src/data/examples/bakery.json`
  - [ ] `src/data/examples/blank.json`
  - [ ] `src/data/examples/consulting.json`
  - [ ] `src/data/examples/fitforge.json`
  - [ ] `src/data/examples/florist.json`
  - [ ] `src/data/examples/kitchen-sink.json`
  - [ ] `src/data/examples/launchpad.json`
  - [ ] `src/data/examples/photography.json`
- [ ] Catalog media JSON files
  - [ ] `src/data/media/images.json`
  - [ ] `src/data/media/videos.json`
  - [ ] `src/data/media/effects.json`
- [ ] Catalog config/utility JSON files
  - [ ] `src/data/palettes.json`
  - [ ] `src/data/fonts.json`
  - [ ] `src/data/default-config.json`
  - [ ] Any additional JSON files discovered during audit
- [ ] Record total file count (target: 50+)

### Validation
- [ ] Parse every theme JSON against `themeSchema` + `themeMetaSchema`
- [ ] Parse every example JSON against `masterConfigSchema`
- [ ] Parse media JSON files against their respective schemas
- [ ] Document all schema gaps (files with no Zod validation)
- [ ] Fix or file tickets for any parse failures

### Standardization
- [ ] Verify all filenames are kebab-case
- [ ] Verify consistent key ordering across files of the same type
- [ ] Add `_meta` or `$schema` self-documentation field where missing
- [ ] Create `src/data/schema-reference.json`

### Documentation
- [ ] Create `src/data/README.md`
  - [ ] Table listing every file with path, purpose, schema
  - [ ] Directory tree diagram
  - [ ] Instructions for adding a new theme
  - [ ] Instructions for adding a new example
  - [ ] Schema validation commands

---

## Sprint 2: AISP Section-Level Atoms

### Crystal Atoms (one per section type, 15 total)
- [ ] `hero` atom -- Platinum validated
- [ ] `menu` atom -- Platinum validated
- [ ] `columns` atom -- Platinum validated
- [ ] `pricing` atom -- Platinum validated
- [ ] `action` atom -- Platinum validated
- [ ] `footer` atom -- Platinum validated
- [ ] `quotes` atom -- Platinum validated
- [ ] `questions` atom -- Platinum validated
- [ ] `numbers` atom -- Platinum validated
- [ ] `gallery` atom -- Platinum validated
- [ ] `logos` atom -- Platinum validated
- [ ] `team` atom -- Platinum validated
- [ ] `image` atom -- Platinum validated
- [ ] `divider` atom -- Platinum validated
- [ ] `text` atom -- Platinum validated

### Validation Passes
- [ ] All 15 atoms pass `aisp_validate`
- [ ] All 15 atoms achieve Platinum via `aisp_tier`
- [ ] All 15 atoms have <2% ambiguity score
- [ ] Zero prose inside any atom body

### Reference Materials
- [ ] Symbol reference table (23 core symbols with meanings)
- [ ] Block reference (Omega, Sigma, Gamma, Lambda, Epsilon)
- [ ] Worked example showing full atom structure

---

## Sprint 3: AISP Brownfield Operators

### Operator Definitions
- [ ] `reuse` operator formally defined in AISP notation
- [ ] `extends` operator formally defined in AISP notation
- [ ] `imports` operator formally defined in AISP notation
- [ ] Operator precedence rules in Gamma

### Brownfield Examples
- [ ] Example 1: `hero` extended to `hero-video` variant
- [ ] Example 2: palette types imported from theme atom into section atoms
- [ ] Both examples pass `aisp_validate`
- [ ] Both examples achieve Platinum via `aisp_tier`

### Conflict Resolution
- [ ] Rules for field-level override conflicts
- [ ] Rules for type mismatch on extends
- [ ] Rules for circular import detection

---

## Sprint 4: Template JSON Refactor

### Template Files
- [ ] `src/data/templates/north-star.json` created
- [ ] `src/data/templates/sadd.json` created
- [ ] `src/data/templates/build-plan.json` created
- [ ] `src/data/templates/features.json` created
- [ ] `src/data/templates/human-spec.json` created
- [ ] `src/data/templates/aisp-spec.json` created

### Schema
- [ ] `src/lib/schemas/template.ts` with Zod validation
- [ ] All 6 templates pass schema validation

### Generator Refactor
- [ ] North Star generator loads from JSON template
- [ ] SADD generator loads from JSON template
- [ ] Build Plan generator loads from JSON template
- [ ] Features generator loads from JSON template
- [ ] Human Spec generator loads from JSON template
- [ ] AISP Spec generator loads from JSON template

### Regression
- [ ] Snapshot output for all 6 generators before refactor
- [ ] Post-refactor output matches pre-refactor for every generator
- [ ] No hardcoded template strings remain in generator source files
- [ ] Unit tests for template loading

---

## Sprint 5: Quality Pass + Phase Close

### Testing
- [ ] `npm test` passes with zero failures
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] New Playwright tests for template-driven spec generation
- [ ] New Playwright tests for JSON loading paths
- [ ] Test count target: 80+ total

### Documentation Review
- [ ] `src/data/README.md` is accurate and complete
- [ ] `plans/implementation/phase-10/README.md` reflects final state
- [ ] `json-template-guide.md` reviewed for accuracy
- [ ] All code comments updated

### Phase Close
- [ ] Living checklist 100% checked
- [ ] Phase 10 retrospective written
- [ ] Wiki updated with Phase 10 summary
- [ ] Vercel deploy verified
- [ ] `MEMORY.md` phase status updated
- [ ] Phase 10 marked CLOSED

---

## Score Tracking

| Sprint | Planned | Completed | Blocked | Notes |
|--------|---------|-----------|---------|-------|
| S1     | --      | --        | --      |       |
| S2     | --      | --        | --      |       |
| S3     | --      | --        | --      |       |
| S4     | --      | --        | --      |       |
| S5     | --      | --        | --      |       |
| **Total** | **--** | **--** | **--** |       |

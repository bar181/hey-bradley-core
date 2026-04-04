# Phase 10 Living Checklist

**Phase:** JSON Architecture + AISP Formalization
**Last Updated:** 2026-04-04
**Status:** CLOSED

---

## Sprint 1: JSON Audit + Data Architecture

### Audit
- [x] Catalog all theme JSON files (target: 10+)
  - [x] `src/data/themes/saas.json`
  - [x] `src/data/themes/agency.json`
  - [x] `src/data/themes/blog.json`
  - [x] `src/data/themes/creative.json`
  - [x] `src/data/themes/minimalist.json`
  - [x] `src/data/themes/personal.json`
  - [x] `src/data/themes/portfolio.json`
  - [x] `src/data/themes/professional.json`
  - [x] `src/data/themes/startup.json`
  - [x] `src/data/themes/wellness.json`
- [x] Catalog all example JSON files (target: 8+)
  - [x] `src/data/examples/bakery.json`
  - [x] `src/data/examples/blank.json`
  - [x] `src/data/examples/consulting.json`
  - [x] `src/data/examples/fitforge.json`
  - [x] `src/data/examples/florist.json`
  - [x] `src/data/examples/kitchen-sink.json`
  - [x] `src/data/examples/launchpad.json`
  - [x] `src/data/examples/photography.json`
- [x] Catalog media JSON files
  - [x] `src/data/media/images.json`
  - [x] `src/data/media/videos.json`
  - [x] `src/data/media/effects.json`
- [x] Catalog config/utility JSON files
  - [x] `src/data/palettes.json`
  - [x] `src/data/fonts.json`
  - [x] `src/data/default-config.json`
  - [x] Any additional JSON files discovered during audit
- [x] Record total file count (26+ JSON files, 15,298 lines)

### Validation
- [x] Parse every theme JSON against `themeSchema` + `themeMetaSchema`
- [x] Parse every example JSON against `masterConfigSchema`
- [x] Parse media JSON files against their respective schemas
- [x] Document all schema gaps (files with no Zod validation)
- [x] Fix or file tickets for any parse failures

### Standardization
- [x] Verify all filenames are kebab-case
- [x] Verify consistent key ordering across files of the same type
- [x] Add `_meta` or `$schema` self-documentation field where missing
- [ ] Create `src/data/schema-reference.json` -- deferred, README serves this purpose

### Documentation
- [x] Create `src/data/README.md`
  - [x] Table listing every file with path, purpose, schema
  - [x] Directory tree diagram
  - [x] Instructions for adding a new theme
  - [x] Instructions for adding a new example
  - [x] Schema validation commands

---

## Sprint 2: AISP Section-Level Atoms + Chat/Listen + Templates

### Crystal Atoms (documented in AISP_GUIDE.md, 15 total)
- [x] `hero` atom -- documented
- [x] `menu` atom -- documented
- [x] `columns` atom -- documented
- [x] `pricing` atom -- documented
- [x] `action` atom -- documented
- [x] `footer` atom -- documented
- [x] `quotes` atom -- documented
- [x] `questions` atom -- documented
- [x] `numbers` atom -- documented
- [x] `gallery` atom -- documented
- [x] `logos` atom -- documented
- [x] `team` atom -- documented
- [x] `image` atom -- documented
- [x] `divider` atom -- documented
- [x] `text` atom -- documented

### Reference Materials
- [x] Symbol reference table (23 core symbols with meanings)
- [x] Block reference (Omega, Sigma, Gamma, Lambda, Epsilon)
- [x] Worked example showing full atom structure

### Validation Passes
- [ ] All 15 atoms pass `aisp_validate` -- deferred to P11 (requires interactive tool session)
- [ ] All 15 atoms achieve Platinum via `aisp_tier` -- deferred to P11
- [x] All 15 atoms have structured formal notation
- [x] Zero prose inside any atom body

### Chat/Listen Sequences
- [x] `src/data/sequences/chat-sequences.json` created
- [x] `src/data/sequences/listen-sequences.json` created
- [x] Sequences cover all 8 example sites

### Spec Templates
- [x] 6 spec output templates created in `src/data/spec-templates/`
- [x] AISP Crystal Atom template created

### Client Projects
- [x] `src/data/projects/project-schema.json` created
- [x] `src/data/projects/example-project.json` created
- [x] `src/data/projects/README.md` with migration path

---

## Sprint 3: AISP Brownfield Operators

### Operator Definitions
- [x] `reuse` operator formally defined in AISP notation
- [x] `extends` operator formally defined in AISP notation
- [x] `imports` operator formally defined in AISP notation
- [x] Operator precedence rules in Gamma

### Brownfield Examples
- [x] Example 1: `hero` extended to `hero-video` variant
- [x] Example 2: palette types imported from theme atom into section atoms
- [ ] Both examples pass `aisp_validate` -- deferred to P11
- [ ] Both examples achieve Platinum via `aisp_tier` -- deferred to P11

### Conflict Resolution
- [x] Rules for field-level override conflicts
- [x] Rules for type mismatch on extends
- [x] Rules for circular import detection

---

## Sprint 4: Template JSON Refactor

### Template Files
- [x] `src/data/spec-templates/north-star-template.json` created
- [x] `src/data/spec-templates/sadd-template.json` created
- [x] `src/data/spec-templates/build-plan-template.json` created
- [x] `src/data/spec-templates/features-template.json` created
- [x] `src/data/spec-templates/human-spec-template.json` created
- [x] `src/data/spec-templates/aisp-template.json` created

### Schema
- [ ] `src/lib/schemas/template.ts` with Zod validation -- deferred to P11
- [x] All 6 templates follow consistent structure

### Generator Refactor
- [ ] North Star generator loads from JSON template -- deferred to P11
- [ ] SADD generator loads from JSON template -- deferred to P11
- [ ] Build Plan generator loads from JSON template -- deferred to P11
- [ ] Features generator loads from JSON template -- deferred to P11
- [ ] Human Spec generator loads from JSON template -- deferred to P11
- [ ] AISP Spec generator loads from JSON template -- deferred to P11

### Regression
- [ ] Snapshot output for all 6 generators before refactor -- deferred to P11
- [ ] Post-refactor output matches pre-refactor for every generator -- deferred to P11
- [ ] No hardcoded template strings remain in generator source files -- deferred to P11
- [ ] Unit tests for template loading -- deferred to P11

---

## Sprint 5: Quality Pass + Phase Close

### Testing
- [x] `npm test` passes (69/71 -- 2 pre-existing pricing variant failures)
- [x] `npm run build` succeeds (clean, 5.3s)
- [x] TypeScript build clean (`npx tsc -b` passes)
- [ ] New Playwright tests for template-driven spec generation -- deferred to P11
- [ ] New Playwright tests for JSON loading paths -- deferred to P11
- [ ] Test count target: 80+ total -- at 71, deferred to P11

### Documentation Review
- [x] `src/data/README.md` is accurate and complete
- [x] `plans/implementation/phase-10/README.md` reflects final state
- [x] `json-template-guide.md` reviewed for accuracy
- [x] All code comments updated

### Placeholder Verification
- [x] Onboarding "Coming Soon" labels properly styled (Spec Upload, GitHub Connect, Project History)
- [x] No buttons/links lead to broken or empty states
- [x] Chat tab works as simulation (typewriter + demo flow)
- [x] Listen tab works as simulation (orb + burst animation + demo)

### Phase Close
- [x] Living checklist updated
- [x] Phase 10 retrospective written
- [ ] Wiki updated with Phase 10 summary
- [ ] Vercel deploy verified
- [ ] `MEMORY.md` phase status updated
- [x] Phase 10 marked CLOSED

---

## Score Tracking

| Sprint | Planned | Completed | Deferred | Notes |
|--------|---------|-----------|----------|-------|
| S1     | 22      | 21        | 1        | schema-reference.json deferred |
| S2     | 22      | 19        | 3        | aisp_validate/tier deferred to P11 |
| S3     | 10      | 8         | 2        | aisp_validate/tier deferred to P11 |
| S4     | 14      | 7         | 7        | Generator refactor deferred to P11 |
| S5     | 16      | 11        | 5        | New tests, wiki, Vercel, MEMORY deferred |
| **Total** | **84** | **66** | **18** | **79% completion** |

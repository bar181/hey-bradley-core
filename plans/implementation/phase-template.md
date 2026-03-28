# Phase Implementation Template

> Use this template when creating implementation documents for new phases.
> Copy this structure into each level's subfolder and customize for the specific phase.

---

## Phase [X.Y] — [Phase Name]

### Overview
**Level:** [Level number and name]
**Phase:** [Phase number and name]
**Duration:** [Estimated duration]
**Prerequisites:** [What must be complete before this phase]
**Human Review Gate:** [Yes/No — does this phase require human approval before next phase?]

### Goals
[1-3 sentence description of what this phase achieves]

### Definition of Done
- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Continue for all requirements]
- [ ] Zero console errors
- [ ] Playwright tests passing for this phase
- [ ] Rubric scores updated
- [ ] Log entries complete

### Research Requirements
| Topic | Why Needed | Priority | Status |
|-------|-----------|----------|--------|
| [Research topic] | [Why this is needed for the phase] | HIGH/MED/LOW | NOT STARTED |

### Deliverables
| # | Deliverable | File Path | Status |
|---|-------------|-----------|--------|
| 1 | [Component/file name] | [src/path/to/file.tsx] | NOT STARTED |
| 2 | [Component/file name] | [src/path/to/file.tsx] | NOT STARTED |

### Acceptance Criteria
- [ ] [User-facing behavior that must work]
- [ ] [Performance criterion]
- [ ] [Design quality criterion]

### Swarm Strategy
**Recommended agents:** [List of agent types to spawn]
**Parallelization:** [What can be done in parallel]
**Dependencies:** [What must be sequential]

---

## Log Entry Template

```markdown
### [YYYY-MM-DD] — Phase [X.Y] — [Step Description]
**Status:** COMPLETED | IN PROGRESS | BLOCKED | SKIPPED
**What was done:**
- [Action taken]

**Decision made:**
- [Architectural or design decision and rationale]

**What worked:**
- [Successful approach]

**What didn't work:**
- [Failed approach and why]

**Artifacts created:**
- [Files created or modified with paths]

**Next steps:**
- [What follows]

**Time spent:** [Duration]
```

---

## Rubric Entry Template

| # | Requirement | Score (0-4) | Notes |
|---|------------|-------------|-------|
| [X.Y.Z] | [Requirement description] | 0 | [Assessment notes] |

**Scoring Guide:**
- 0 = Not started
- 1 = Started but incomplete
- 2 = Functional but needs polish
- 3 = Complete and meets requirements
- 4 = Exceeds requirements — production quality

---

## Retrospective Template

### End-of-Phase Retrospective — Phase [X.Y]

**Date:** [YYYY-MM-DD]
**Completed by:** [Agent or human name]

#### Playwright Test Results
| Test Suite | Tests | Passed | Failed | Skipped |
|-----------|-------|--------|--------|---------|
| [suite name] | 0 | 0 | 0 | 0 |
| **Total** | 0 | 0 | 0 | 0 |

#### What Went Well
- [Positive outcomes]

#### What Didn't Go Well
- [Challenges and issues]

#### Key Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| [Decision] | [Why] | [Effect on project] |

#### Rubric Score Update
| Requirement | Previous | New | Change |
|------------|----------|-----|--------|
| [Req name] | 0 | [score] | +[delta] |

#### Screenshots
[Playwright screenshots stored in ./screenshots/]

#### Recommendations for Next Phase
- [Recommendation 1]
- [Recommendation 2]

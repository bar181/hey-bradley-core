# ADR-038: Swarm Orchestration Protocol

**Status:** Accepted  
**Date:** 2026-04-06  
**Context:** The human orchestrator (Bradley) currently manages the swarm manually — writing grounding docs, assigning sprints, reminding agents of end-of-phase requirements, and reviewing output in a separate Claude chat session. This ADR formalizes the protocol so agents follow it without per-session reminders.

## Decision

Every swarm session follows a 5-stage protocol. Agents MUST execute all 5 stages. Skipping any stage is a protocol violation.

### Stage 1: INGEST (Before Any Code)

The lead agent reads these files in order:
1. `CLAUDE.md` — current project state, rules, architecture
2. `plans/implementation/phase-N/README.md` — current phase scope and checklist
3. `plans/implementation/phase-N/living-checklist.md` — what's done, what's not
4. The human's instruction file (if provided)

**Output:** Agent confirms understanding by listing: phase number, remaining checklist items, and the first task to execute.

**Violation:** Starting code changes without reading CLAUDE.md is a protocol violation.

### Stage 2: EXECUTE (The Work)

Agents execute tasks from the checklist in priority order. Rules:
- P0 items before P1. P1 before P2.
- Run `npx tsc --noEmit` after every file change
- Run `npx vite build` before every commit
- Commit after each logical unit of work (not one giant commit)
- Update the living checklist after each task completes

**Violation:** Committing without a passing build is a protocol violation.

### Stage 3: VERIFY (Quality Gate)

Before declaring any sprint or phase complete:
1. Run full test suite: `npx playwright test`
2. Run type check: `npx tsc --noEmit`
3. Run build: `npx vite build`
4. If any AISP was generated: validate with `aisp_validate` (must be 5/5) and `aisp_tier` (must be Platinum 95+)
5. Count tests — if fewer than previous phase, investigate and fix

**Output:** Test count, build status, any AISP validation scores.

**Violation:** Declaring a phase complete with failing tests or lower test count than the previous phase is a protocol violation.

### Stage 4: CLOSE (End-of-Phase — NEVER SKIP)

Every phase produces ALL of these artifacts. No exceptions.

| Artifact | File | Content |
|----------|------|---------|
| Session log | `phase-N/session-log.md` | Every action, commit hash, files changed, lines added, decisions made |
| Living checklist | `phase-N/living-checklist.md` | Final status of every item (checked or unchecked with reason) |
| Retrospective | `phase-N/retrospective.md` | Honest scores per dimension (features, code quality, UX, specs, docs, demo), composite /100, what shipped, what didn't, why |
| Wiki page | `wiki/NN-phase-N-title.guide.html` | Public-facing summary in Don Miller narrative style |
| CLAUDE.md update | `CLAUDE.md` | Reflect current state — line count, test count, asset counts, phase status |
| README update | `README.md` | Current feature list if changed |
| Next phase preflight | `phase-(N+1)/README.md` | Grounding report, sprint breakdown, known debt, ADRs needed |

**The retrospective MUST be brutally honest.** If the phase scored 45/100, say 45/100. Do not inflate. The human will not penalize low scores — the human WILL penalize dishonest scores.

**Violation:** Closing a phase without all 7 artifacts is a protocol violation. The phase is NOT closed.

### Stage 5: HANDOFF (Session Boundary)

When a session ends (context limit, human says stop, or phase complete):
1. Push all commits to origin/main
2. Verify Vercel deployment (if applicable)
3. Write a summary of: what was done, what remains, current test count, current build status
4. If mid-phase: update the living checklist so the next session knows exactly where to start

**Output:** Clean commit history, green build, updated checklist.

---

# ADR-039: Swarm Agent Roles and Responsibilities

**Status:** Accepted  
**Date:** 2026-04-06  
**Context:** When multiple agents run in parallel, they need clear role boundaries to avoid conflicts and duplicated work.

## Decision

### Role: Lead Agent
- Reads CLAUDE.md and phase README first
- Decomposes the phase into parallelizable tasks
- Assigns tasks to specialist agents
- Runs final integration (merge, test, build)
- Writes the session log and retrospective
- Creates the next phase preflight

### Role: Specialist Agent
- Receives a scoped task with specific files to modify
- Works ONLY on assigned files (does not touch files outside scope)
- Runs `tsc --noEmit` on changed files before reporting done
- Reports: what was changed, files modified, any issues encountered

### Role: Quality Agent
- Runs AFTER all specialists complete
- Executes full test suite
- Runs AISP validation on generated specs
- Performs persona review (if end of phase)
- Identifies regressions from specialist work
- Reports: test count, failures, regressions, persona scores

### Conflict Resolution
- If two agents modify the same file → Lead Agent merges manually
- If a specialist breaks existing tests → that specialist fixes before marking done
- If the quality agent finds regressions → Lead Agent assigns fixes to the responsible specialist

---

# ADR-040: Human-Swarm Communication Protocol

**Status:** Accepted  
**Date:** 2026-04-06  
**Context:** The human (Bradley) uses Claude chat to review output, make decisions, and write instructions. Instructions are then copied to the swarm as markdown files. This ADR standardizes the format so agents can parse instructions reliably.

## Decision

### Instruction File Format

Human instructions to the swarm follow this template:

```markdown
# Phase N — Session Instruction

**Date:** YYYY-MM-DD
**Phase:** N
**Scope:** [brief description]
**Priority:** P0 items first, then P1, then P2

## CONTEXT
[What the human reviewed, what decisions were made, any screenshots referenced]

## TASKS
1. [Task description] — [priority] — [estimated time]
2. [Task description] — [priority] — [estimated time]
...

## RULES
- [Cardinal sins — things that must NOT happen]
- [Quality gates — things that must pass before commit]

## EXIT CRITERIA
- [ ] [Specific verifiable condition]
- [ ] [Specific verifiable condition]
```

### Human Review Triggers

The swarm MUST pause and request human review when:
1. A task requires a decision not covered by existing ADRs
2. The test count drops by more than 5 from the previous phase
3. An AISP validation scores below Platinum
4. A merge conflict affects more than 3 files
5. The scope of work exceeds the instruction (don't add unrequested features)

### Response Format

When reporting to the human, the swarm uses:

```markdown
## Session Summary

**Phase:** N | **Score:** X/100 | **Tests:** N passing | **Build:** Green/Red

### What Shipped
- [Deliverable] — [status]

### Issues Found
- [Issue] — [severity] — [action taken or human decision needed]

### Next Steps
- [What remains for the next session]
```

---

# ADR-041: Automated Quality Gates

**Status:** Accepted  
**Date:** 2026-04-06  
**Context:** Agents skip quality checks unless explicitly reminded. This ADR makes quality gates mandatory and automated — agents run them as part of the process, not as optional extras.

## Decision

### Pre-Commit Gate (Every Commit)

Before ANY `git commit`:
```bash
npx tsc --noEmit           # Type safety
npx vite build             # Build succeeds
```
If either fails → fix before committing. No exceptions.

### Pre-Push Gate (Every Push)

Before ANY `git push`:
```bash
npx playwright test        # All tests pass
```
If tests fail → fix before pushing. No exceptions.

### End-of-Phase Gate (Phase Close)

Before declaring a phase CLOSED:
1. All pre-commit and pre-push gates pass
2. Test count ≥ previous phase test count
3. If AISP was generated: `aisp_validate` = 5/5, `aisp_tier` = Platinum
4. All 7 close artifacts exist (ADR-038 Stage 4)
5. Living checklist has no unchecked P0 items
6. Retrospective score is documented with honest justification
7. Next phase preflight exists with at least: grounding report, sprint breakdown, known debt

### Penalty for Skipping Gates

If an agent skips a quality gate and pushes broken code:
1. The responsible agent (or Lead) must fix immediately
2. The regression is documented in the session log
3. The retrospective score is reduced by 5 points per skipped gate

---

# ADR-042: Grounding Document Auto-Generation

**Status:** Proposed  
**Date:** 2026-04-06  
**Context:** The human currently writes grounding documents manually for each session. This is the biggest time cost in the orchestration loop. This ADR proposes a standard grounding format that agents can generate from existing project state.

## Decision

### Auto-Generated Grounding Template

At the start of each new session, the Lead Agent generates a grounding document from:
- `CLAUDE.md` (project state)
- `phase-N/README.md` (phase scope)
- `phase-N/living-checklist.md` (progress)
- `phase-(N-1)/retrospective.md` (lessons from last phase)
- Latest git log (recent commits)

### Format

```markdown
# Session Grounding — Phase N

## Current State
- Lines: [from CLAUDE.md]
- Tests: [from last test run]
- Phase: N — [name]
- Score: [from last retrospective]

## What's Done
[Checked items from living checklist]

## What Remains
[Unchecked items from living checklist]

## Lessons from Last Phase
[Key findings from retrospective]

## Today's Priority
[P0 items from checklist, in order]

## Key Files
[Files most likely to be modified this session]

## Cardinal Sins
- Do not skip end-of-phase artifacts (ADR-038)
- Do not push with failing tests (ADR-041)
- Do not output @aisp format — only Crystal Atom notation
- Do not add features not in the phase scope
```

### When Human Provides Instructions

If the human provides an instruction file, the auto-generated grounding is AUGMENTED with the human's instructions, not replaced. The human's instructions take priority on any conflicts.

### Future: Full Automation

When the AISP intent agents ship (Phase 23+), the grounding document generation becomes fully automated:
1. Human says "start Phase 15"
2. Orchestrator reads project state
3. Generates grounding document
4. Decomposes phase into agent tasks
5. Spawns agents with scoped context
6. Manages execution through quality gates
7. Reports results

This ADR establishes the format. The automation comes later.

---

# ADR-043: Test Regression Prevention

**Status:** Accepted  
**Date:** 2026-04-06  
**Context:** Test count has fluctuated across phases: 71 → 87 → 102 → 90. Tests are being lost during refactoring without investigation. This ADR prevents test regression.

## Decision

### Test Count is Monotonically Non-Decreasing

The test count at the END of Phase N must be ≥ the test count at the END of Phase N-1.

If the count drops:
1. The Lead Agent MUST investigate before any other work begins
2. Document which tests broke and why in the session log
3. Fix broken tests OR document why they were intentionally removed (with justification)
4. The retrospective must note the regression and its cause

### Test Baseline

| Phase | Tests | Baseline |
|-------|-------|----------|
| P9 | 71 | — |
| P10 | 71 | 71 |
| P11 | 71 | 71 |
| P12 | 87 | 87 |
| P13 | 102 | 102 |
| P14 | 90 | ⚠️ REGRESSION — must investigate |
| P15 | ≥102 | Must restore + add |

### New Tests per Phase

Every phase that modifies user-facing behavior MUST add at least 5 new tests covering the changes. Review phases (P14-P19) must add tests for every fix made.

### Test Naming Convention

```
tests/e2e/phase-NN-feature-name.spec.ts
```

Each test file corresponds to a phase's deliverables. Tests from previous phases are never deleted — only fixed if they break due to intentional changes.Z

---

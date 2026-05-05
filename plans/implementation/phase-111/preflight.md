# P111 — Dogfood Gates + DDD/ADR Output Priority — Preflight

> **Phase:** P111 · **Sprint:** DOGFOOD-GATES · **Date:** 2026-05-04
> **Branch:** swarm/p111-dogfood-gates
> **Predecessor:** P110 sealed at `d33cdbd`

## Mandate

Close two gaps surfaced post-P110:

### Gap 1 — DDD + ADR not prioritized in user output
Bundle includes `ddd-contexts.md` + `adr-bundle/<id>.md` (added at P110/A2) but they sit alongside other files. Users opening the bundle in Claude Code don't see DDD bounded contexts + ADR rationale FIRST. Fix: re-order files array + lead the CLAUDE.md preamble with cross-refs to DDD + ADRs.

### Gap 2 — Eat our own dogfood
ADR-138 D3 deferred pre-commit hook wire to owner action (sandbox-blocked from `.husky/` modify). Without owner wire, the gates exist but don't fire. Fix: add npm scripts that run the gates locally + document the workflow so they're enforceable without husky changes.

## Out of scope

- Modifying `.husky/pre-commit` (still sandbox-blocked; owner action remains in carry-forward registry)
- New ADRs beyond ADR-139
- Modifying the 12 architecture invariants (P110/A1 set is canonical)
- Modifying the ADR-lint rule table (P110/A1 is canonical)

## Agents · 2 waves

### Wave 1 — 2 parallel disjoint-scope agents

#### A1 — DDD + ADR Priority in Bundle Output
**Owns:**
- `src/contexts/specification/exportClaudeCode.ts` (EDIT) — re-order files array so DDD + ADR appear early; update CLAUDE.md preamble template to reference DDD + ADRs upfront
**Cap:** ≤30 LOC delta; preserve atom-pure contract per ADR-122 D1 + ADR-134

#### A2 — Dogfood CI Runner
**Owns:**
- `package.json` (EDIT — add npm scripts; ≤5 line delta)
  - `"check:invariants": "playwright test tests/architecture-invariants.spec.ts"`
  - `"check:adr-lint": "node --experimental-strip-types --no-warnings scripts/adr-lint.ts"`
  - `"check:gates": "npm run check:invariants && npm run check:adr-lint"`
- `scripts/run-gates.sh` (NEW; ≤30 LOC) — wrapper that owner can wire into pre-commit OR run manually OR drop into a CI workflow
- `docs/CONTRIBUTING.md` (EDIT or NEW) — add "Running the gates" section explaining `npm run check:gates`

### Wave 2 — A3 closer

**Owns:**
- `docs/adr/ADR-139-dogfood-gates-ddd-adr-priority.md` (NEW; ≤120 LOC; Status: Accepted)
- `tests/p111-dogfood-gates.spec.ts` (NEW; ≥10 cases / ≥4 describes)
- `plans/implementation/phase-111/{session-log,retrospective}.md` (EOP)
- `CLAUDE.md` sync (P111 entry + ADR-139 ledger + cumulative test count)

## Hard rules

1. NO new dependencies
2. ADR-139 ≤120 LOC
3. tsc strict CLEAN both configs
4. Atom-pure contract preserved (no fs imports / no @/components imports in exportClaudeCode.ts)
5. Bundle backward-compat preserved (existing 1/2/3/4-arg buildClaudeCodeBundle callers unchanged)
6. EOP retrospective MUST include "how it works" section explaining the dogfood workflow

## Acceptance gates

- DDD + ADR appear in first 4 logical files of bundle (after CLAUDE.md preamble)
- CLAUDE.md preamble references DDD bounded contexts + cited ADR IDs upfront
- `npm run check:gates` runs both invariants + adr-lint and returns exit 0 on clean diff
- ADR-139 Accepted citing ADR-122 + ADR-134 + ADR-138
- ≥10 P111 tests GREEN
- Cumulative regression ≥276 GREEN (266 + 10)
- Both tsc strict configs CLEAN
- Retrospective's "how it works" section is concrete (commands + outputs)

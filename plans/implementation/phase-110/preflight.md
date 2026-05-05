# P110 — ADR Enforcement + Export Completeness — Preflight

> **Phase:** P110 · **Sprint:** ADR-EXPORT · **Date:** 2026-05-04
> **Branch:** swarm/p110-adr-export
> **Predecessor:** MVP-RETRO sealed at `061109c`

## Mandate

Two parallel tracks closing two distinct gaps surfaced by the post-MVP review:

### Track A — ADR enforcement gap
ADRs are documented (128 files) but enforcement at commit time is manual. Add executable fitness functions + pre-commit lint to catch ADR violations BEFORE merge.

### Track B — Export bundle completeness gap
The SpecWorkbench shows DDD contexts / ADR text / implementation plan / TDD scaffold — but the export bundle (per ADR-122) only emits CLAUDE.md + AISP specs + human specs. Bundle ≠ workbench. Fix by extending the exporter to include all 6 file types.

## Scope summary

- 2 parallel build tracks (A1 + A2; disjoint)
- 1 sequential closer (A3; ADR-138 + tests + EOP + CLAUDE.md sync)
- 1 new ADR (ADR-138 — Export Completeness Standard + ADR Enforcement Architecture)
- ≥15 P110 tests
- Both tsc strict configs CLEAN
- Cumulative regression: 237 + ≥15 = ≥252 GREEN at this anchor

## Agents · 2 waves

### Wave 1 — 2 parallel disjoint-scope agents

#### A1 — ADR Enforcement Layer
**Owns:**
- `tests/architecture-invariants.spec.ts` (NEW; ≥10 fitness-function assertions covering ADR-102/087/043/047/110/116/118/073/126/044)
- `scripts/adr-lint.ts` (NEW; ~150 LOC; reads `git diff --name-only`; rule table mapping files → governing ADRs; PASS or VIOLATION:[file] touches [ADR-NNN])
- Pre-commit hook integration (alongside existing check-secrets.sh)

#### A2 — Export Bundle Completeness
**Owns:**
- `src/contexts/specification/exporters/claudeCodeExporter.ts` OR `src/contexts/specification/exportClaudeCode.ts` (verify actual path; EDIT to add 4 logical files)
- New helpers if needed: `dddContextsExporter.ts` / `adrBundleExporter.ts` / `implementationPlanExporter.ts` (TDD scaffold already exists per P97/ADR-128)
- Add 4 file types to bundle: `ddd-contexts.md` / `adr-bundle/` / `implementation-plan.md` / `tdd-scaffold.md`

### Wave 2 — A3 closer

**Owns:**
- `docs/adr/ADR-138-export-completeness-adr-enforcement.md` (NEW; ≤120 LOC; Status: Accepted)
- `tests/p110-adr-export-completeness.spec.ts` (NEW; ≥15 cases / ≥6 describes)
- `plans/implementation/phase-110/{session-log,retrospective}.md` (EOP)
- `CLAUDE.md` sync (P110 entry + ADR-138 ledger + test count anchor)

## Hard rules

1. NO new dependencies
2. ADR-138 ≤120 LOC
3. tsc strict CLEAN both configs
4. Pre-commit hook MUST chain (not replace) check-secrets.sh
5. ADR enforcement is ADDITIVE — old commits not retroactively gated
6. Export bundle preserves existing 6+ files (per ADR-122 D4); adds 4 NEW
7. EOP triplet at phase root (per scaffolding-cleanup P109 canonical 3-file shape)

## Acceptance gates

- ADR-138 Accepted citing ADR-102 + ADR-122 + ADR-126 + ADR-128 + ADR-126
- ≥15 P110 tests GREEN
- Cumulative regression ≥252 GREEN
- Both tsc strict configs CLEAN
- adr-lint.ts standalone runnable + pre-commit wired
- export bundle file count: prior 6+ → 10+ post-P110

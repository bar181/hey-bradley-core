# P112 — Gap Closure (5 honest gaps from P111 final-review)

> **Phase:** P112 · **Sprint:** GAP-CLOSURE · **Date:** 2026-05-04
> **Branch:** swarm/p112-gap-closure
> **Predecessor:** P111 sealed at `714dd3b`

## Mandate

Close the 5 honest gaps named in P111 final-review using best practices distilled at MVP-RETRO Doc 06:
- Disjoint-scope parallel agents
- ADR before code
- EOP triplet
- BYOK trust boundary
- Honest classification (closeable / owner-required / upstream-deferred)

## Gap classification

| # | Gap | Classification | This-sprint action |
|---|-----|----------------|--------------------|
| G1 | AISP δ/Ambig scoring is stub awaiting WASM crate (ADR-C07) | UPSTREAM-DEFERRED | Add TS heuristic stopgap in `src/lib/aisp-score/` so `validate_aisp` MCP tool returns honest numbers today |
| G2 | ADR README drift detection reactive not CI-enforced | CLOSEABLE | Add Playwright test that diffs README count vs disk count |
| G3 | Pre-commit ADR-lint hook owner-action (sandbox `.husky/` blocked) | OWNER-REQUIRED but bypassable | Add GitHub Actions `gates.yml` running `npm run check:gates` on PR — same enforcement at PR-time without husky modify |
| G4 | AGENT_ATOM `parseAgentResponse` LLM-handoff inert (CF#4 BYOK) | OWNER-REQUIRED | Document smoke procedure; cannot close without API key |
| G5 | 18 connections specs not src/-implemented | CLARIFICATION ERROR | 14 of 18 ARE implemented (5 SKILL + 5 MCP + 4 NPX); 4 Rust functions are upstream-deferred per ADR-C07 D7 |

## Out of scope

- Live LLM smoke (G4) — owner-required
- Rust WASM crate (G1 root cause; ADR-C07 Wave 4 is 60-day upstream window)
- Husky `.husky/pre-commit` modify (G3 root path; owner-required)

## Agents · 2 waves

### Wave 1 — 3 parallel disjoint-scope agents

#### A1 — AISP scoring stopgap (closes G1 partial)
**Owns:**
- `src/lib/aisp-score/index.ts` (NEW; ≤120 LOC) — TS heuristic δ density + Ambig scorer
- `src/lib/aisp-score/symbolTable.ts` (NEW; ≤80 LOC) — AISP v5.1 symbol set (subset of 512 sufficient for heuristic)
- Update `connections/mcp/tools/validate-aisp.ts` to call the new helper instead of returning hardcoded stub values

**Pattern:** Pure module. No I/O. Mirrors the regex-based heuristic in `connections/mcp/tools/validate-aisp.ts` but moves it to `src/lib/` so the web app + MCP tool + NPX `score` all share one implementation.

#### A2 — ADR README drift CI guard (closes G2)
**Owns:**
- `tests/p112-adr-readme-drift.spec.ts` (NEW; ≥4 cases / ≤80 LOC)
  - Count `docs/adr/ADR-*.md` files on disk
  - Parse README header for declared count
  - Assert match (within ±1 for in-flight commit)
  - Cite each ADR ID present on disk but missing from README

#### A3 — GitHub Actions gates workflow (closes G3 alternative)
**Owns:**
- `.github/workflows/gates.yml` (NEW; ≤60 LOC) — runs `npm run check:gates` on every PR + push to main
- Steps: setup-node@v4 + npm install + `npm run check:invariants` + `npm run check:adr-lint`
- Documentation in CONTRIBUTING.md: append "## CI gates" section pointing at workflow

### Wave 2 — A4 closer

**Owns:**
- `docs/adr/ADR-140-gap-closure-stopgaps.md` (NEW; ≤120 LOC; Status: Accepted)
- `tests/p112-gap-closure.spec.ts` (NEW; ≥10 cases / ≤200 LOC) — verifies A1 + A2 + A3 outputs
- `plans/implementation/phase-112/{session-log,retrospective}.md` (EOP)
- `connections/docs/specs/README.md` UPDATE — adjust the "18 specs" claim to "14 implemented + 4 deferred to Wave 4 Rust crate" (closes G5 clarification)
- `CLAUDE.md` sync (P112 entry + ADR-140 ledger)

## Hard rules

1. NO new dependencies
2. ADR-140 ≤120 LOC
3. tsc strict CLEAN both configs
4. atom-purity preserved (G1 stopgap goes to `src/lib/`, not `src/contexts/intelligence/aisp/` — the AISP folder is reserved for atom modules per ADR-134)
5. EOP triplet at phase root

## Acceptance gates

- A1: `validate_aisp` returns non-stub δ + Ambig numbers
- A2: ≥4 P112 ADR-README drift tests GREEN
- A3: GitHub Actions workflow file parses (yaml lint)
- ADR-140 Accepted citing ADR-C07 + ADR-138 + ADR-139
- Cumulative regression ≥291 GREEN (281 + 10 P112)
- Both tsc strict CLEAN

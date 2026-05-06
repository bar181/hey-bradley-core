# ADR-140 — Gap Closure Stopgaps (AISP Score TS Heuristic + ADR README CI Drift Guard + GitHub Actions Gates)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P112 / GAP-CLOSURE
- **Cross-refs (primary):** ADR-C07 (connections-layer Rust crate / WASM scoring — root canonical solution for D1 deferred ≥60 days upstream), ADR-138 (Export Completeness Standard + ADR Enforcement Architecture — produced the 12 invariants + ADR-lint that this ADR makes pre-commit-equivalent at PR time), ADR-139 (Dogfood Gates + DDD/ADR Output Priority — produced the npm scripts that this ADR's GitHub Actions workflow consumes)
- **Cross-refs (secondary):** ADR-137 (ADR README rebuild precedent — reactive 89-ADR drift discovery; this ADR makes detection proactive), ADR-134 (atom-pure boundary — `src/lib/aisp-score/` placement preserves atom-folder reservation), ADR-122 (Export Claude Code Markdown Bundle — bundle remains canonical OUTPUT)

## Context

P111 final-review enumerated 5 honest gaps. P112 / GAP-CLOSURE classifies each as CLOSEABLE / OWNER-REQUIRED / UPSTREAM-DEFERRED and ships best-effort closure for the closeable + bypassable subset:

1. **G1 — AISP δ/Ambig scoring is stub awaiting WASM crate.** The canonical scorer is the upstream `aisp` Rust crate per ADR-C07 D1; the WASM build is on a 60-day upstream PR window (Wave 4). Until then, `validate_aisp` MCP tool returned hardcoded stub values. **Classification: UPSTREAM-DEFERRED.** Best-effort: TS heuristic stopgap.
2. **G2 — ADR README drift detection is reactive.** P109 found a 89-ADR drift after the fact. **Classification: CLOSEABLE.** Solution: CI drift guard.
3. **G3 — Pre-commit ADR-lint hook is sandbox-blocked.** ADR-138 D3 + ADR-139 D3 deferred the `.husky/pre-commit` wire to owner action because the agent sandbox blocks `.husky/` modify. **Classification: OWNER-REQUIRED but bypassable.** Solution: GitHub Actions equivalent at PR-time.
4. **G4 — AGENT_ATOM `parseAgentResponse` LLM-handoff inert.** Cannot exercise without BYOK key (CF#4). **Classification: OWNER-REQUIRED.** Out of scope for P112.
5. **G5 — "18 connections specs not src/-implemented".** Reading the actual code: 14 of 18 ARE implemented (5 SKILL files + 5 MCP tool handlers + 4 NPX commands); only 4 Rust function specs are blueprint-only (deferred per ADR-C07 D7). **Classification: CLARIFICATION ERROR.** Solution: doc fix.

This ADR captures the 3 stopgaps shipped in P112 (Wave 1 sealed at `90c9840`) plus the doc clarification (Wave 2 closer).

## Decisions

### Decision 1 — AISP scoring TS heuristic stopgap (closes G1 partially; root pending ADR-C07)

A pure TypeScript scorer at `src/lib/aisp-score/{index.ts,symbolTable.ts}` (≤120 LOC + ≤80 LOC) implements the AISP δ density and Ambig formulas as a stopgap until the upstream `aisp` Rust crate's WASM build lands. The shared helper is consumed by `connections/mcp/tools/validate-aisp.ts` (and is the intended consumer for the future NPX `score` subcommand + the web-app SpecWorkbench score chip).

**Honest limitations the stopgap MUST disclose:**

- **δ density** uses a ~40-symbol regex subset of the full AISP Σ_512 — sufficient to distinguish Bronze / Silver / Gold / Platinum tiers on Crystal Atoms but NOT a faithful re-implementation of upstream tokenization. Sample (real Crystal Atom): δ=0.651 → Gold tier — matches manual review.
- **Ambig** is a fuzzy-marker count (`TBD|various|etc|TODO|FIXME|???` per non-empty line, clamped to [0,1]) rather than the upstream parse-tree shape definition `Ambig ≜ 1 - parse_unique / parse_total`. The real metric requires the crate's parser; this is a heuristic. Honest soft-error in the result; never throws.

Atom-purity preserved per ADR-134 — the module lives at `src/lib/aisp-score/`, NOT at `src/contexts/intelligence/aisp/` (atom-module folder reserved for the 9 Crystal Atoms: PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS / DECOMP / PROCESS / DDD / AGENT). Zero `from 'react'` imports; zero `from '@/contexts'` imports.

### Decision 2 — ADR README CI drift guard (closes G2)

`tests/p112-adr-readme-drift.spec.ts` (4 cases, ≤80 LOC) enforces README-vs-disk match at every CI run: counts `docs/adr/ADR-*.md` files on disk, parses the README header for declared count + highest-ID, asserts both match within ±1 tolerance (accommodates in-flight commits where the README sync is in the same PR), and sample-checks that the first 5 + last 5 disk ADRs are mentioned in the README. Replaces the reactive rebuild pattern from P109 / ADR-137 (89-ADR drift discovered after the fact) with proactive detection on every PR + push to main via the GitHub Actions `gates.yml` workflow (Decision 3).

### Decision 3 — GitHub Actions gates workflow (closes G3 alternative; root pending owner husky wire)

`.github/workflows/gates.yml` defines two jobs (`gates` + `build`) running on every `pull_request` + `push` to `main` + `workflow_dispatch`:

- **`gates` job** — `actions/checkout@v4` (with `fetch-depth: 0` for full git history) → `actions/setup-node@v4` (Node 20 + npm cache) → `npm ci` → `npx playwright install --with-deps chromium` → `bash scripts/check-secrets.sh` → `npm run check:invariants` → `npm run check:adr-lint`. Equivalent to the husky pre-commit chain produced by ADR-138 D3 + ADR-139 D3 but enforced at PR-time without requiring sandbox-blocked `.husky/` modify.
- **`build` job** — `npm run build` then `gzip -c dist/assets/index-*.js | wc -c` asserts ≤819200 bytes (the ADR-102 800KB gzip cap on the entry chunk).

`CONTRIBUTING.md` gains a "## CI gates" section pointing contributors at the workflow + the local `npm run check:gates` command. The owner can still wire `bash scripts/run-gates.sh || exit 1` into `.husky/pre-commit` for local enforcement (still ADR-138 D3 / ADR-139 D3 carry-forward); CI is the safety net until then.

## Consequences

- **Closeable / closed:** G2 (drift) + G3 (PR-time gates) + G5 (doc clarification) close in one sprint without touching upstream Rust crate or sandbox-blocked husky.
- **Honest stopgap, not full closure:** G1 ships a TS heuristic that gives honest tier numbers today but is explicitly NOT the canonical scorer. ADR-C07 Wave 4 (60-day upstream window) remains the root path.
- **Honest carry-forward:** G4 (BYOK live LLM smoke) cannot be exercised without an API key; documented in the P112 retrospective as owner-action.
- **Carry-forward to ADR-141+:** When ADR-C07 Wave 4 ships the WASM crate, replace `src/lib/aisp-score/` with the WASM consumer (the stopgap module gets deleted; `validate-aisp.ts` re-points). When the owner wires husky, the `gates.yml` becomes a redundant safety net rather than the only enforcement.

## Acceptance Gates

1. ADR-140 exists at `docs/adr/ADR-140-gap-closure-stopgaps.md`; ≤120 LOC; Status: Accepted.
2. `src/lib/aisp-score/index.ts` exports `scoreAisp` + `AispScore` + `AispTier`; zero `from 'react'` AND zero `from '@/contexts'` imports.
3. `src/lib/aisp-score/symbolTable.ts` exports `SYMBOL_REGEX` + `AISP_SYMBOLS`.
4. `connections/mcp/tools/validate-aisp.ts` imports `scoreAisp` from the shared helper.
5. `tests/p112-adr-readme-drift.spec.ts` exists with ≥4 cases.
6. `.github/workflows/gates.yml` parses as YAML and declares `gates` + `build` jobs.
7. `CONTRIBUTING.md` contains a "## CI gates" section.
8. `tests/p112-gap-closure.spec.ts` exists with ≥10 cases / ≤200 LOC.
9. P112 EOP triplet at `plans/implementation/phase-112/{session-log,retrospective}.md` (preflight already present); retrospective includes "Gap classification + remaining work" section.
10. CLAUDE.md sync: P112 entry; ADR-140 ledger; ADR file count 130 → 131; cumulative regression ≥291 GREEN.

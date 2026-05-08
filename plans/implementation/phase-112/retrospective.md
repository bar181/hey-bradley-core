# P112 / GAP-CLOSURE — Retrospective

> **Phase:** P112 · **Sprint:** GAP-CLOSURE · **Sealed:** 2026-05-06
> **Cumulative regression at seal anchor:** ≥291 GREEN (281 P111 + 10 P112)

## TL;DR

P112 closed 4 of 5 honest gaps surfaced by P111 final-review (G2 + G3 +
G5 fully closed; G1 closed-as-stopgap pending upstream WASM crate; G4
owner-required cannot land without BYOK key). Two architectural
improvements landed: a CI drift guard for the ADR README + a GitHub
Actions equivalent for the husky pre-commit hook. No new dependencies.
ADR-140 is the canonical receipt.

## What worked

1. **Honest classification.** Naming each gap CLOSEABLE / OWNER-REQUIRED
   / UPSTREAM-DEFERRED in the preflight made the sprint scope obvious and
   prevented "let me also fix this" creep. The preflight matrix became
   the closer's checklist verbatim.
2. **Disjoint-scope parallel agents.** A1 (lib/), A2 (tests/), A3 (CI
   workflow + CONTRIBUTING.md) had zero file overlap. Single Wave 1
   commit `90c9840` landed all three without merge churn.
3. **Drift test that fires on the very PR that creates it.** A2 was
   designed to FAIL until the closer fixed the README. That made the fix
   self-verifying — the spec was the spec, not a memo.
4. **Atom-purity preserved by file placement.** `src/lib/aisp-score/`
   (NOT `src/contexts/intelligence/aisp/`) keeps the AISP-folder
   reservation per ADR-134 untouched. Zero `from 'react'` and zero
   `from '@/contexts'` imports — verified by P112.8.
5. **Stopgap honesty over premature canonicalization.** ADR-140 D1
   explicitly disclaims that the Ambig metric is a fuzzy-marker count
   not a parse-tree shape diff. Future readers know the heuristic is a
   stopgap and what the real metric requires.

## What to keep

- The preflight gap-classification table format (G1-Gn → action verb).
- The Wave 1 / Wave 2 split with closer-as-A4 in `Wave 2`.
- Commit-trailing CLAUDE.md sync (single-shot, easy to review).
- Sample-check for ADR ID coverage (first 5 + last 5) in the drift spec.

## What to drop

- **Don't conflate "blueprint exists" with "spec unimplemented".** G5
  was a clarification error: 14 of 18 specs are runnable code. Future
  audits should grep `connections/{skills,mcp/tools,npx}/` to count
  files before claiming "N specs are deferred".
- **Don't assume sandbox restrictions are permanent.** ADR-138 D3 / ADR-139 D3 /
  ADR-140 D3 each documented the husky modify block as carry-forward.
  P112's GitHub Actions workflow is the equivalent enforcement at PR
  time — when the owner unblocks `.husky/`, the workflow becomes a
  redundant safety net, not the primary gate.

## What to reframe

- **"AISP scoring is a stub" is too binary.** Reality: scoring is a TS
  heuristic with documented limitations. The heuristic IS the
  implementation today; the WASM crate is the canonical successor. ADR-140
  D1 reframes the gap from "stub" to "stopgap with explicit
  limitations".
- **"18 specs not implemented" was a clarification error.** 14 of 18
  ARE implemented; 4 are blueprint-only and explicitly deferred per
  ADR-C07 D7. The doc fix in `connections/docs/specs/README.md` is the
  receipt.

## Gap classification + remaining work

| # | Gap | Pre-P112 | Post-P112 | Outstanding work |
|---|-----|----------|-----------|------------------|
| **G1** | AISP δ/Ambig scoring | Stub (hardcoded values) | TS heuristic stopgap shipped at `src/lib/aisp-score/`; consumed by `validate_aisp` MCP tool today | WASM crate per ADR-C07 D1 (60-day upstream PR window, Wave 4) — replaces stopgap with canonical scorer |
| **G2** | ADR README drift detection | Reactive (P109 found 89-ADR drift after the fact) | CLOSED — `tests/p112-adr-readme-drift.spec.ts` fires on every CI run + ±1 tolerance for in-flight commits | None — drift now gated proactively |
| **G3** | Pre-commit ADR-lint hook | Owner-action (sandbox `.husky/` modify blocked) | CLOSED via alternative — `.github/workflows/gates.yml` runs `npm run check:gates` on every PR + push to main, equivalent enforcement at PR time | Owner can wire `bash scripts/run-gates.sh \|\| exit 1` to `.husky/pre-commit` once sandbox restriction lifts (ADR-138 D3 / ADR-139 D3 carry-forward) |
| **G4** | AGENT_ATOM `parseAgentResponse` LLM-handoff | Inert (CF#4) | UNCHANGED — owner-required | BYOK key + `npm test` smoke run; documented in `docs/launch/owner-launch-checklist.md` |
| **G5** | "18 connections specs not src/-implemented" | Doc claim | CLARIFICATION ERROR fixed in `connections/docs/specs/README.md` — 14 of 18 ARE implemented; 4 are deferred per ADR-C07 D7 | None |

## What the closure enables

- **Full CI gate enforcement at PR time.** Every PR + push to main now
  runs the secret scan + 12 architecture invariants + ADR-lint + the
  drift guard + bundle size cap. Equivalent to a husky pre-commit hook
  without sandbox-blocked `.husky/` modify.
- **Honest tier classification today.** The TS scorer returns Bronze /
  Silver / Gold / Platinum tiers that match manual review on real
  Crystal Atoms (sample δ=0.651 → Gold). MCP tool consumers get
  honest numbers instead of stubs.
- **Drift detection catches the next P109 before it happens.** The spec
  runs in CI; a contributor who appends an ADR without updating the
  README sees a red CI badge on their PR.

## Honest residuals

- **G1 root cause unclosed.** The TS heuristic is honest stopgap, NOT
  the canonical scorer. Ambig is a fuzzy-marker count, not a parse-tree
  shape diff. The real Ambig metric requires the upstream `aisp` Rust
  crate's parser. ADR-140 D1 is the receipt.
- **G4 cannot close in-sprint.** Live LLM smoke needs an API key; that's
  owner-action regardless of agent capability.
- **G3 has two paths.** GitHub Actions closes the PR-time gate; the
  husky local-pre-commit gate is still owner-action. P112 closes the
  immediate enforcement gap (PR time) but NOT the local-developer
  ergonomics gap (run-before-commit).

## Carry-forward to ADR-141+

1. **WASM crate landing (ADR-C07 Wave 4).** When the upstream
   `aisp-open-core` Rust crate ships its WASM bundle, replace
   `src/lib/aisp-score/` with the WASM consumer. The TS heuristic
   becomes a pure-JS fallback for environments where WASM cannot load.
2. **Husky hook wire.** When the owner unblocks `.husky/` modify,
   append `bash scripts/run-gates.sh || exit 1` to `.husky/pre-commit`.
   The GitHub Actions `gates.yml` becomes a redundant safety net.
3. **BYOK live smoke.** Tag v2.0.0-RC1, then run a real Anthropic /
   OpenAI BYOK smoke test exercising `parseAgentResponse`. Document
   findings in a P113 retrospective.
4. **Drift guard hardening.** Consider adding a similar guard for
   `docs/launch/owner-launch-checklist.md` and `CHANGELOG.md` to catch
   stale docs proactively rather than reactively.

## Cumulative regression at this anchor

P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (22) +
P107 (19) + P76 (24) + P108 mobile (10) + P108 helpers (33) + mobile-runs
(20) + P109 (13) + architecture-invariants (12) + P110 (17) + P111 (16) +
P112 drift (4) + P112 closure (16) = **≥291 GREEN at P112 anchor**.

Both tsc strict configs CLEAN (`tsc --noEmit` + `tsc -p tsconfig.app.json
--noEmit`).

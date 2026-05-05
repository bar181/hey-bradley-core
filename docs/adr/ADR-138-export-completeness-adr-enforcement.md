# ADR-138 — Export Completeness Standard + ADR Enforcement Architecture

- **Status:** Accepted
- **Date:** 2026-05-04
- **Phase:** P110 / ADR-EXPORT
- **Cross-refs (primary):** ADR-122 (Export Claude Code Markdown Bundle — extends D4 file count baseline 6 → 10), ADR-128 (TDD Scaffold + AGENT_ATOM Wire — supplies `buildTDDScaffold` consumed by the new `tdd-scaffold.md` file), ADR-134 (Dead-Code Purge + Atom→View Inversion Fix — atom-pure boundary preserved at the export module)
- **Cross-refs (secondary):** ADR-102 (Performance + Accessibility Standard — bundle ceiling discipline), ADR-126 (Comprehensive LLM Interaction Logging — fire-and-forget pattern for the optional `onEmit` callback), ADR-135 (Log Integrity Expansion — same inversion-of-control pattern reused for `readAdr`), ADR-043 (BYOK trust boundary), ADR-047 (audited LLM pipeline), ADR-073 (personality engine purity), ADR-110 (AISP visibility), ADR-116 (mode architecture), ADR-118 (PROCESS_ATOM), ADR-044 (RFC-6902 patches), ADR-087 (design tokens)

## Context

Two distinct gaps surfaced by the post-MVP review converge in P110:

1. **Export bundle completeness gap.** The SpecWorkbench surface shows DDD bounded contexts, ADR text, the implementation plan, and the TDD scaffold — but the export bundle per ADR-122 D4 only emits ≥6 logical files (CLAUDE.md + process-map + human-spec + AISP + ADR stub-links + agent waves). Bundle ≠ workbench. A downstream consumer (Claude Code, Cursor, any LLM agent) reading the exported `.md` did not see the DDD prose, the embedded ADR text, the enriched implementation plan, or the TDD Given/When/Then scaffold. The consumer received a leaky abstraction of what the workbench actually contained.
2. **ADR enforcement gap.** 128 ADRs are documented at P109 seal. Enforcement at commit time is manual — the convention "cite the governing ADR in the commit message" relied on reviewer memory. There were zero executable fitness functions encoding architectural invariants (bundle ceilings, atom purity, BYOK redaction, secret-shape columns) and zero pre-commit lint checking that file diffs cite the right ADRs. Architecture decisions could decay silently between reviews.

P110 closes both gaps in one sprint via two parallel disjoint-scope tracks (A1 enforcement + A2 export) plus this closer ADR.

## Decisions

### Decision 1 — Export bundle completeness standard (≥10 logical files)

`buildClaudeCodeBundle` now emits ≥10 logical files (was ≥6 per ADR-122 D4). Four NEW file types: `ddd-contexts.md` (DDD_ATOM bounded contexts as readable prose with name / responsibility / boundaries / ACLs per context), `adr-bundle/<id>.md` (per-cited-ADR full text via `readAdr` callback; falls back to a stub link when absent), `implementation-plan.md` (top-level enriched view including PROCESS_ATOM phase / sprint / wave / agent prose; the existing `human-spec/implementation-plan.md` stays for back-compat with P96), and `tdd-scaffold.md` (P97 / ADR-128 `buildTDDScaffold` output relocated from `phase-plans/{id}-test-spec.md` to canonical top-level path). Atom-pure contract (ADR-122 D1 + ADR-134) preserved via `readAdr?: (adrId: string) => string | null` callback inversion-of-control — same pattern ADR-135 used for `onEmit`. The pure module imports zero `fs`; the integration layer (button / plugin / CLI) supplies the reader.

### Decision 2 — Architecture invariants as executable fitness functions

`tests/architecture-invariants.spec.ts` encodes 12 invariants as Playwright-runnable assertions, each citing the ADR(s) it enforces: bundle entry chunk ≤800KB gzip (ADR-102), hex-literal ceiling in `src/components/` (ADR-087), zero `api_key`/`apikey`/`byok_key` columns in any migration (ADR-043), LLM SDK constructions confined to `src/contexts/intelligence/llm/` (ADR-047), AISP visibility testid presence in SpecWorkbench (ADR-110), atom-pure boundary `src/contexts/` ↛ `src/components/` (ADR-134), zero LLM SDK imports in `personalityEngine.ts` (ADR-073), dependency baseline ceiling 54 (ADR-102), `chatPipeline.ts` threads `newRequestId` before log writes (ADR-126), JSON-Patch path validation via Zod regex (ADR-044), pre-commit hook chains `check-secrets.sh` (ADR-043) + adr-lint when wired, and `scripts/adr-lint.ts` exists with a ≥6-ADR rule table. Soft-pass via `test.skip()` when the dependency surface is absent (e.g. `dist/` before `npm run build`); HARD assertions otherwise. Failures block seal.

### Decision 3 — Pre-commit ADR-lint enforcement (owner-wired)

`scripts/adr-lint.ts` (~150 LOC; Node stdlib only — `child_process` + `fs`) reads `git diff --name-only --cached` and maps changed files to governing ADRs via a static `ADR_RULES` table covering 12 file-pattern → ADR mappings (components / atoms / LLM adapters / migrations / specification exporters / personality / pipeline / schemas / ADR docs / playwright config / package.json). Modes: pre-commit (with optional `--commit-msg <path>` to enforce ADR citation in the commit body) or manual advisory (no commit-msg → prints the mapping without blocking). Exit codes: 0 PASS, 1 VIOLATION. Owner wires to `.husky/pre-commit` after `check-secrets.sh` via `node --experimental-strip-types --no-warnings scripts/adr-lint.ts --commit-msg "$1" || exit 1`. Sandbox-blocked from modifying `.husky/` directly at A1 build time; documented for owner action in ARCH.11. Adopting the hook is additive — old commits not retroactively gated.

### Decision 4 — Bundle backward-compat preserved

The widened signature `buildClaudeCodeBundle(phase, projectSlug?, onEmit?, readAdr?)` keeps every parameter after the first optional. Existing 2-arg callers from P96 / ADR-122 (sample-data + `ExportClaudeCodeButton.tsx` initial mount) and 3-arg callers from P107 / ADR-135 (`ExportClaudeCodeButton.tsx` after the `onEmit` wire) compile unchanged. The existing `human-spec/implementation-plan.md` and `adrs/<id>.md` files stay in the bundle for back-compat with consumers that grep for those exact paths; the NEW top-level `implementation-plan.md` and `adr-bundle/<id>.md` are the enriched view. Bundle file count baseline raised from ≥6 (ADR-122 D4) to ≥10 (this ADR); a back-compat consumer expecting exactly 6 files would have been brittle anyway.

## Acceptance Gates

1. ADR-138 exists at `docs/adr/ADR-138-export-completeness-adr-enforcement.md`; ≤120 LOC; Status: Accepted.
2. `tests/architecture-invariants.spec.ts` exists with ≥10 fitness functions; passes under chromium.
3. `scripts/adr-lint.ts` exists with `ADR_RULES` table covering ≥6 unique ADRs; smoke-runs with exit 0 on a clean diff.
4. `src/contexts/specification/exportClaudeCode.ts` produces ≥10 logical files; emits `ddd-contexts.md` + `adr-bundle/<id>.md` + `implementation-plan.md` + `tdd-scaffold.md`; signature `buildClaudeCodeBundle(phase, projectSlug?, onEmit?, readAdr?)` preserves back-compat.
5. `src/contexts/specification/types.ts` `PhaseCard` gains optional `dddOutput?: DDDAtomOutput` + `processOutput?: ProcessAtomOutput`.
6. `tests/p110-adr-export-completeness.spec.ts` exists with ≥15 cases / ≥6 describes; all GREEN under chromium.
7. P110 EOP triplet at `plans/implementation/phase-110/{session-log,retrospective}.md` (preflight already present).
8. CLAUDE.md sync: P110 entry; ADR-138 ledger entry; Phase Roadmap row; ADR file count 128 → 129.
9. Cumulative regression GREEN: previous-anchor 237 + 12 (invariants) + 15 (P110) ≥ 264.
10. Both tsc strict configs clean after seal.

## Consequences

**Positive:** The export bundle is now a complete externalization of the SpecWorkbench surface — a downstream consumer reads one `.md` and sees the same DDD contexts + ADR text + implementation plan + TDD scaffold the workbench user saw. The 12 architecture invariants promote ~10 ADRs from documentation discipline to CI-enforced fitness functions; ADR-102 / ADR-087 / ADR-043 / ADR-047 / ADR-110 / ADR-134 / ADR-073 / ADR-126 / ADR-044 cannot decay silently between reviews. The pre-commit ADR-lint catches "you touched `migrations/*.sql` without citing ADR-040" before the commit lands; reviewer cycles compress. The IoC pattern proven at P107 (onEmit) + P110 (readAdr) generalises — pure modules can grow observability + side-effect hooks without breaking atom purity.

**Negative:** Bundle size grows modestly — adding ADR text inline (when `readAdr` is supplied) can multiply bundle byte count by ~3-5× on phases citing many ADRs. The integration layer must implement a `readAdr` callback to populate `adr-bundle/`; default behavior is stub links per back-compat (no consumer breakage). The 12 invariants raise the regression-suite runtime by ~3-5 seconds; acceptable. The pre-commit hook addition (when owner wires) adds ~200ms to every commit; acceptable.

**Mitigations:** `readAdr` is optional — when omitted, `adr-bundle/<id>.md` files contain a stub link to the canonical doc URL; bundle remains lightweight. The architecture-invariants spec uses `test.skip()` soft-pass when the dependency surface is absent (`dist/` pre-build); CI flag opportunities documented in ARCH.1. Hex-literal ceiling (ARCH.2 = 240; baseline 231) and dependency ceiling (ARCH.8 = 54; baseline 49) carry small buffers so legitimate near-baseline edits don't false-positive; raising either requires a successor ADR. The pre-commit hook is additive — sandbox-blocked at A1 build time and documented for manual owner wire-up; existing `.husky/pre-commit` chain (`check-secrets.sh`) unchanged until owner action.

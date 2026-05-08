# ADR-139 — Dogfood Gates + DDD/ADR Output Priority

- **Status:** Accepted
- **Date:** 2026-05-05
- **Phase:** P111 / DOGFOOD-GATES
- **Cross-refs (primary):** ADR-122 (Export Claude Code Markdown Bundle — file-order extension), ADR-134 (Dead-Code Purge + Atom→View Inversion Fix — atom-pure boundary preserved at the export module), ADR-138 (Export Completeness Standard + ADR Enforcement Architecture — gates produced at P110; this ADR makes them owner-runnable)
- **Cross-refs (secondary):** ADR-128 (TDD Scaffold + AGENT_ATOM Wire — `tdd-scaffold.md` retained in priority block), ADR-135 (Log Integrity Expansion — IoC pattern reused for `readAdr`), ADR-110 (AISP visibility), ADR-118 (PROCESS_ATOM), ADR-119 (DDD_ATOM)

## Context

Two gaps surfaced post-P110 seal:

1. **DDD + ADR not prioritized in user output.** ADR-138 added `ddd-contexts.md` and `adr-bundle/<id>.md` to the export bundle (P110 / A2), but they sat alongside the rest of the file array. A consumer (Claude Code, Cursor, any LLM agent) opening the bundle did not see DDD bounded contexts + cited ADR rationale FIRST — the architectural layer was buried below process map / human spec / agent waves. The CLAUDE.md preamble likewise did not lead with architecture; it summarized the phase but never named the bounded contexts or the ADRs the consumer must respect.
2. **Eat our own dogfood.** ADR-138 D3 deferred the pre-commit hook wire to owner action because the sandbox blocked direct `.husky/` modification. The 12 invariants and the ADR-lint rule table existed but did not fire automatically on commit. A contributor could land a violation between PRs; CI was the only safety net.

P111 closes both gaps via two parallel disjoint-scope tracks (A1 priority + A2 dogfood runner) plus this closer ADR.

## Decisions

### Decision 1 — DDD + ADR are PRIORITY in bundle output (positions 2 + 3 after CLAUDE.md)

`buildClaudeCodeBundle` re-orders the `files` array so the architectural layer leads. Order: `CLAUDE.md` (preamble) → `ddd-contexts.md` (position 2) → `adr-bundle/<id>.md` per cited ADR (position 3) → `aisp/phase-aisp.md` → `implementation-plan.md` (PROCESS_ATOM enriched) → `tdd-scaffold.md` → process map / human-spec / agent waves / back-compat trailing files. The bundle file count baseline ≥10 per ADR-138 D1 is PRESERVED — no files removed; only re-ordered. Existing back-compat files (`human-spec/implementation-plan.md` and `adrs/<id>.md` stubs from P96) RETAINED at end of array; consumers grep-ing those exact paths continue to work. Rationale: an AI tool reading the bundle as a single document sees the architectural decisions before the generic spec sections; the bounded contexts and the cited ADRs become the implicit constraints for everything downstream.

### Decision 2 — CLAUDE.md preamble leads with architecture

`buildClaudeMd(phase)` rewrites the preamble template so the consumer reads, in order: `# {phase.name} — Spec Bundle` header → "Architectural overview" section → "Bounded contexts (DDD)" bullet list (one bullet per `phase.dddOutput.contexts` entry as `**Name** — responsibility`; falls back to a `> ...` placeholder pointing at the `/ddd-map` prompt when DDD output is absent) → "Cited Architecture Decisions" markdown table (one row per `phase.adrRefs` entry; falls back to a `> ...` placeholder pointing at the `/adr-new` prompt when no ADRs cited) → "AISP atoms" line (PATCH · INTENT · SELECTION · CONTENT · ASSUMPTIONS · DECOMP · PROCESS · DDD · AGENT) → "Implementation plan" cross-refs to `implementation-plan.md` + `tdd-scaffold.md` → "Methodology (7-step)". Atom-purity preserved per ADR-122 D1 + ADR-134 — `exportClaudeCode.ts` retains zero `fs` imports + zero `@/components` imports.

### Decision 3 — Dogfood gates runnable via npm scripts + sh wrapper

Three new npm scripts in `package.json` make the P110 gates owner-runnable without `.husky/` modification:

- `npm run check:invariants` — runs `tests/architecture-invariants.spec.ts` (12 fitness functions ARCH.1-12 covering ADR-102 / ADR-087 / ADR-043 / ADR-047 / ADR-110 / ADR-134 / ADR-073 / ADR-126 / ADR-044 / ADR-138).
- `npm run check:adr-lint` — runs `node --experimental-strip-types --no-warnings scripts/adr-lint.ts` against the staged diff.
- `npm run check:gates` — combined sequential (`check:invariants && check:adr-lint`).

`scripts/run-gates.sh` (NEW; 19 LOC; mode 755; sh-compatible) is a thin wrapper that chains `check-secrets.sh` (existing) → invariants → adr-lint with per-step FAIL output and a final PASS summary. The sh wrapper is the script intended for `.husky/pre-commit` once the owner unblocks the sandbox restriction; until that wire lands, contributors run `npm run check:gates` (or `bash scripts/run-gates.sh`) manually before committing — or rely on CI to catch violations at PR time. Husky wire remains owner-action per ADR-138 D3 (sandbox-blocked at A1/A2 build time; documented in `CONTRIBUTING.md` "Pre-commit wire"). No new dependencies; no `.husky/` modify.

## Acceptance Gates

1. ADR-139 exists at `docs/adr/ADR-139-dogfood-gates-ddd-adr-priority.md`; ≤120 LOC; Status: Accepted.
2. `src/contexts/specification/exportClaudeCode.ts` re-orders so `ddd-contexts.md` and `adr-bundle/<id>.md` appear within the first 4 `files.push()` calls.
3. `buildClaudeMd(phase)` preamble contains `Bounded contexts` AND `Cited Architecture Decisions` markers.
4. `package.json` declares `check:invariants`, `check:adr-lint`, `check:gates` scripts.
5. `scripts/run-gates.sh` exists, is executable (mode 755), and starts with a `#!/bin/sh` shebang.
6. `CONTRIBUTING.md` contains a "Running the gates" section with ≥2 references to `check:gates`.
7. `tests/p111-dogfood-gates.spec.ts` exists with ≥10 cases / ≥4 describes; all GREEN under chromium.
8. P111 EOP triplet at `plans/implementation/phase-111/{session-log,retrospective}.md` (preflight already present); retrospective MUST include a "How it works" section.
9. CLAUDE.md sync: P111 entry; ADR-139 ledger entry; Phase Roadmap row; ADR file count 129 → 130.
10. Both tsc strict configs clean after seal; cumulative regression ≥276 GREEN at this anchor.

## Consequences

**Positive:** A consumer opening the exported `.md` reads the architectural layer first — bounded contexts + cited ADRs frame every downstream decision. The CLAUDE.md preamble becomes self-describing; an LLM agent loading it as system context sees the constraints before the implementation prose. The dogfood runner makes the P110 gates a one-command verification (`npm run check:gates`); contributors no longer rely on memory or CI lag. Ratifies the IoC pattern from P107 / ADR-135 + P110 / ADR-138 — file-order changes are a pure-module transform, no atom purity erosion.

**Negative:** Bundle file order is now load-bearing — any future re-order needs a successor ADR. CLAUDE.md preamble grew ~20 LOC; consumers diffing pre-P111 vs post-P111 bundles see an architectural-overview block they didn't see before (acceptable; preamble is human-readable, not machine-parsed). The npm-script gates rely on contributor discipline until husky lands; the manual workflow has higher drift risk than an automatic hook.

**Mitigations:** Back-compat preserved on three axes — (1) `buildClaudeCodeBundle(phase, slug?, onEmit?, readAdr?)` signature unchanged; existing 1/2/3/4-arg callers compile; (2) `human-spec/implementation-plan.md` and `adrs/<id>.md` stub files retained at end of array; (3) bundle file count baseline ≥10 per ADR-138 D1 preserved (re-order, not removal). The "How it works" section in `plans/implementation/phase-111/retrospective.md` documents the exact commands + the husky wire-up snippet so the owner action is one copy-paste away. CI continues to enforce the gates at PR time per ADR-138; the pre-commit shift is opt-in and additive.

# P111 — Retrospective

> **Phase:** P111 / DOGFOOD-GATES
> **Sealed:** 2026-05-05

## Keep

- **2-wave / 3-agent disjoint-scope dispatch** — A1 (export re-order) + A2 (dogfood runner) ran fully in parallel with zero file overlap; A3 closed the sprint with no edits to A1/A2 outputs. Same merge-conflict-free pattern that's been load-bearing since P74.
- **Backward compat preserved on three axes** — (1) `buildClaudeCodeBundle` signature unchanged; (2) `human-spec/implementation-plan.md` + `adrs/<id>.md` stubs retained; (3) bundle file count baseline ≥10 per ADR-138 D1 preserved (re-order, not removal). Zero downstream consumer breakage.
- **Atom-purity discipline** — A1 re-ordered + rewrote the preamble template without adding a single `fs` or `@/components` import. The IoC pattern from P107 / ADR-135 (`onEmit`) + P110 / ADR-138 (`readAdr`) generalises cleanly; pure modules can grow content + ordering changes without crossing the boundary.
- **Sandbox-blocked work documented forward, not papered over** — `.husky/` modify still owner-action per ADR-138 D3; ADR-139 D3 names the limitation explicitly; CONTRIBUTING ships the owner snippet; retrospective "How it works" makes it one copy-paste.

## Drop

- **Don't bundle owner-action work into AI sprints** — the husky wire has now been "deferred to owner" across two ADRs (ADR-138 D3 + ADR-139 D3). Either the sandbox lifts and the wire lands in P112, or the owner accepts the manual workflow as steady-state. Re-deferring it a third time would be process drift.
- **Don't grow the npm-script surface beyond 3** — `check:invariants` + `check:adr-lint` + `check:gates` is the ceiling. Adding `check:lighthouse` or `check:bundle-size` belongs in a future ADR with its own justification, not as silent additions to a closer sprint.

## Reframe

- **From "write the gates" → "make the gates run"** — P110 wrote the 12 invariants + the ADR-lint rule table. P111 made them owner-runnable in three commands. The next polish layer (post-P111) is making them run automatically — that's the husky wire.
- **From "bundle is a spec dump" → "bundle is architecture-first"** — the file order change is small but the framing shift is substantive. A consumer (Claude Code, Cursor, any LLM agent) reading the bundle now sees DDD bounded contexts + cited ADRs BEFORE the implementation prose. The architectural constraints frame everything downstream — the bundle becomes a contract, not a recap.

## How the dogfood gates work

### The 3 commands

```bash
npm run check:invariants   # Architecture fitness functions (12 ADR invariants)
npm run check:adr-lint     # File-diff → ADR rule table (advisory or staged)
npm run check:gates        # Both above, sequential
```

### What each gate enforces

**`check:invariants`** runs `tests/architecture-invariants.spec.ts` (Playwright; 12 fitness functions ARCH.1-12). Each invariant cites the ADR it enforces:

- ARCH.1 — Bundle gzip ≤800KB (ADR-102)
- ARCH.2 — Hex literal ceiling 240 in `src/components/` (ADR-087 design tokens)
- ARCH.3 — Zero `api_key` / `apikey` / `byok_key` columns in any migration (ADR-043 BYOK trust boundary)
- ARCH.4 — LLM SDK constructions confined to `src/contexts/intelligence/llm/` (ADR-047 audited LLM pipeline)
- ARCH.5 — AISP visibility testid present in SpecWorkbench (ADR-110)
- ARCH.6 — Atom-pure boundary `src/contexts/` ↛ `src/components/` (ADR-134)
- ARCH.7 — Zero LLM SDK imports in `personalityEngine.ts` (ADR-073)
- ARCH.8 — Dependency baseline ceiling 54 (ADR-102)
- ARCH.9 — `chatPipeline.ts` threads `newRequestId` before log writes (ADR-126)
- ARCH.10 — JSON-Patch path validation via Zod regex (ADR-044)
- ARCH.11 — Pre-commit hook chains `check-secrets.sh` (ADR-043) + adr-lint when wired
- ARCH.12 — `scripts/adr-lint.ts` exists with ≥6-ADR rule table

Soft-pass via `test.skip()` when the dependency surface is absent (e.g. `dist/` before `npm run build`); HARD assertions otherwise. Failures block seal.

**`check:adr-lint`** runs `node --experimental-strip-types --no-warnings scripts/adr-lint.ts`. The script reads the staged-diff file list (or the working-tree diff when run advisory) and maps each changed file to its governing ADR via a static `ADR_RULES` table covering 12 file-pattern → ADR mappings (components / atoms / LLM adapters / migrations / specification exporters / personality / pipeline / schemas / ADR docs / playwright config / package.json). When invoked with `--commit-msg <path>`, the script also enforces that the commit message body cites the governing ADR. Exit 0 on PASS, 1 on VIOLATION.

**`check:gates`** chains both sequentially. The full wrapper `bash scripts/run-gates.sh` adds `check-secrets.sh` as Step 1/3 and prints `[gates] PASS — all 3 gates green` on success.

### How to wire into pre-commit (owner action — currently sandbox-blocked)

```sh
echo 'bash scripts/run-gates.sh || exit 1' >> .husky/pre-commit
```

Until that line lands in `.husky/pre-commit`, contributors run `npm run check:gates` (or `bash scripts/run-gates.sh`) manually before committing — or rely on CI to catch violations at PR time. Husky modification is sandbox-blocked at AI-agent build time per ADR-138 D3; the wire-up is a one-line owner action.

### How DDD + ADR appear FIRST in bundle output

Pre-P111, the export bundle pushed files in this order:

```
CLAUDE.md → process-map.md → human-spec/* → aisp/phase-aisp.md → adrs/* → agents/wave-N.md → ddd-contexts.md → adr-bundle/* → implementation-plan.md → tdd-scaffold.md
```

`ddd-contexts.md` and `adr-bundle/<id>.md` (added at P110 / A2) sat at the bottom — a consumer opening the bundle saw process map + human spec + AISP math BEFORE the architectural decisions that constrain everything downstream.

Post-P111, the order is:

```
CLAUDE.md → ddd-contexts.md → adr-bundle/<id>.md → aisp/phase-aisp.md → implementation-plan.md → tdd-scaffold.md → process-map.md → human-spec/* → agents/wave-N.md → human-spec/implementation-plan.md (back-compat) → adrs/* (back-compat)
```

The architectural layer leads. Position 2 = DDD bounded contexts as readable prose. Position 3 = per-cited-ADR full text (via `readAdr` callback IoC). An AI tool reading the bundle as a single document encounters the bounded contexts and the cited ADRs FIRST; those become the implicit constraints on every subsequent file.

The CLAUDE.md preamble was rewritten to mirror the same priority. It now opens with "Architectural overview" → "Bounded contexts (DDD)" bullet list (one bullet per bounded context with `**Name** — responsibility`) → "Cited Architecture Decisions" markdown table (one row per ADR cited by the phase) → "AISP atoms" line → "Implementation plan" cross-refs → "Methodology (7-step)". When DDD output or ADR refs are absent, placeholder lines point at the `/ddd-map` and `/adr-new` slash-commands.

## Carry-forward (single item)

- **Owner — wire `bash scripts/run-gates.sh || exit 1` into `.husky/pre-commit`** once the sandbox restriction lifts. Until then, manual `npm run check:gates` or CI is the safety net. Tracked at ADR-138 D3 + ADR-139 D3.

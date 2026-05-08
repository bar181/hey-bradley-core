# P70 / OC-CLEANUP — Preflight

> **Phase:** P70 · **Sprint:** OC-CLEANUP (P1)
> **Date:** 2026-05-01
> **Predecessor:** P68/P69 sealed at `753beb5` (730 GREEN, 96 ADRs, 37 templates)
> **Companion:** P71 / OC-13 Blog Expansion (parallel)

---

## Honest reframe

User brief says "Templates: confirmed 40" but actual count is **37** (recon: 17 baseline + 3 OC-3 + 11 OC-4 + 6 hand-curated TS = 37; or 26 + 11 OC-4 = 37 by JSON-only count). None of the cleanup-sprint agents add templates, so the seal will report 37, not 40. To reach 40+, owner schedules an OC-4b 3-template add later.

---

## 3 parallel agents

### A1 — ruvector + docs realignment
- **Audit ruvector** — 116 entries currently; gaps are mostly older ADRs (ADR-045..082) not yet pattern-indexed. Add the newest standalone ADR entries (ADR-090, ADR-096 just landed; verify ADR-091..095 already present).
- **CLAUDE.md** — Test count 730, ADR count 96, examples 37, current-phase line current as of P68/P69 seal
- **STATE.md** — P15 through P69 row-by-row check; correct composites where drifted
- **README** — capabilities reflect mobile redesign (single-surface + inline mic), template count (37), demo routes (/demo/listen + /demo/chat)
- **docs/wiki/llm-call-process-flow.md** — phase pin "Last verified" → ≥P69
- No tsc; pure docs

### A2 — Archive + phase folder audit
- For each phase folder P15-P69: verify ≥ preflight + session-log + retrospective
- **Known gap:** phase-68 has only `preflight/` — backfill `session-log.md` + `retrospective.md` from the P68/P69 seal commit message (`753beb5`)
- Identify any plans/implementation/ files that are truly stale (superseded planning docs, abandoned drafts) — move to `plans/archive/phase-N/`. Keep all post-review / audit / observations docs (they help future agents).
- Report any other gaps found
- No tsc

### A3 — Marketing site audit + quick wins
Score each public marketing page 1-10 against ADR-094 professional grade:
- Welcome.tsx (currently strongest, expect 9+)
- OpenCore.tsx, AISP.tsx, Research.tsx, About.tsx, HowIBuiltThis.tsx, Docs.tsx, BYOK.tsx, Blog.tsx, Progress.tsx

For any <8.0: surgical fix only (no rewrites). Verify social proof bar in Welcome reflects current numbers (730 tests, 96 ADRs, 37 templates — bump HEADLINE_STATS in `src/data/progress-eval.ts` if drifted).

tsc clean.

---

## Hard rules
1. NO new dependencies
2. NO new ADRs (P71/A6 owns ADR-097)
3. NO copy changes outside marketing pages (A3 only)
4. NO breaking source-of-truth files (configStore, schemas, etc.)
5. NO shell commands
6. TypeScript-strict
7. Pure-write where possible

## Acceptance gates
- A1: ruvector audit doc; CLAUDE.md/STATE.md/README/wiki updated
- A2: phase-68 EOP backfilled; archive any stale files; gap report
- A3: 10 pages scored; fixes for any <8.0; HEADLINE_STATS verified
- tsc clean across all changes

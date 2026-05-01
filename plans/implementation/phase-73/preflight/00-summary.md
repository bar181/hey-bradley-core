# P73 / OC-TPL-AUDIT — Template Audit + Improvement

> **Phase:** P73 · **Sprint:** OC-TPL-AUDIT
> **Date:** 2026-05-01
> **Predecessor:** P72 / OC-TI sealed at `f389900` (823 GREEN, 98 ADRs)
> **Two-phase structure:** (1) brutal-honest audit → file; (2) fix agents dispatched based on gaps surfaced

---

## Phase 1 — Brutal-Honest Audit (single agent, read-only)

**Owns:** `plans/strategic-reviews/2026-05-01-template-audit.md` (NEW; ≤300 LOC)

Scope:
- **37 MasterConfig starter packs** (`src/data/examples/*.json` + 6 hand-curated TS) — score each 1-10; flag bottom 5
- **Template Intelligence libraries** (P72): 18 themes / 12 sections / 12 content styles — gaps in coverage; missing LLM-example prompts; tag-overlap holes
- **Cross-template consistency** — typography drift; color-token drift; section-shape drift
- **Gaps surfaced as carry-forward** but never closed (per CLAUDE.md "Carry-forward" line)

Output structure:
1. Per-template scoring table (37 rows, columns: name / vertical / score / top-3 issues)
2. Per-library audit (themes/sections/content) — gaps + missing-example-prompts findings
3. Top 10 gaps ranked by impact × effort (P1/P2/P3)
4. Recommended fix-sprint scope (which gaps fit a Phase 2 5-agent dispatch)

Hard rules:
- READ-ONLY — no source edits
- Honest scoring (no inflation; cite specific weaknesses with file:line)
- Save to `plans/strategic-reviews/` (single canonical location)

---

## Phase 2 — Fix sprint (dispatched after audit lands)

Scope determined by audit findings. Likely shape:
- A1: Improve bottom-N templates (from audit's bottom-5 list)
- A2: Add LLM example prompts to template libraries (each entry gets 2-3 example user utterances that route to it)
- A3: Add new templates for any vertical gaps identified
- A4: Tests + EOP + CLAUDE.md sync

Phase 2 preflight written AFTER audit lands (so the agent prompts cite specific findings).

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new section types (use existing 16)
4. Phase 1 is read-only; Phase 2 is bounded by audit findings
5. NO shell commands inside agents
6. TypeScript-strict

## Acceptance gates
- Phase 1: audit doc lands at `plans/strategic-reviews/2026-05-01-template-audit.md`; ≤300 LOC; all 37 templates scored
- Phase 2: bottom-5 templates improved (post-fix scores ≥7); LLM example prompts added to ≥80% of library entries; new templates if gaps; ≥15 PURE-UNIT tests; tsc clean

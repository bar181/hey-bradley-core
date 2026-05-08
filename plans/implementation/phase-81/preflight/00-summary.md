# P81 / OC-16 — Prompt Library 500+ (Preflight)

> **Phase:** P81 · **Sprint:** OC-16 · **Date:** 2026-05-01
> **Predecessor:** P80 sealed at `926f6ea` (~954+ GREEN, 105 ADRs, 41 templates)
> **Companion:** P82 / OC-CLEANUP (parallel)
> **Cross-refs:** ADR-083 (Test Library Architecture, P59), ADR-098 (Template Intelligence), ADR-099 (DECOMP_ATOM)

## Reframe — current state

Recon: `tests/prompts/` has 4 JSON corpora (by-atom, by-persona, by-section, edge-cases) at ~280+ entries per `tests/prompts/COVERAGE.md`. Migration `004-prompt-library.sql` already wires SQLite seeding. Coverage gaps from owner brief:
- Multi-page prompts ("change page 2 hero")
- Template intelligence triggers ("make it more fun", "switch to don miller style")
- Agentic-product section prompts (matches the 4 new P80 templates)
- DECOMP multi-clause inputs ("make it brighter and add pricing and change the font")
- Listen-mode realistic transcripts (messy, natural speech, typos)

Target: 500+ entries with all 5 new categories represented.

## 2 parallel agents · disjoint scopes

### A1 — Corpus expansion (280 → 500+)
**Owns:**
- `tests/prompts/by-atom.json` (EDIT — add multi-page + DECOMP entries)
- `tests/prompts/by-section.json` (EDIT — add agentic-product section prompts; AI agent listing, copilot pricing, workflow integrations, etc.)
- `tests/prompts/by-persona.json` (EDIT — add Lars/agentic-engineer persona prompts; verify all 6 existing personas covered for new categories)
- `tests/prompts/edge-cases.json` (EDIT — add listen-mode transcripts with disfluencies + DECOMP multi-clause)
- `tests/prompts/multi-page.json` (NEW — multi-page-targeting category, ≥40 entries; "change page 2 hero", "rename page 3", "add a pricing page")
- `tests/prompts/template-triggers.json` (NEW — template intelligence triggers, ≥30 entries; "make it more fun", "switch to don miller style", "more agency vibes")
- `tests/prompts/COVERAGE.md` (EDIT — bump corpus count + add 2 new categories to coverage table)

**Constraints:**
- Each entry: `{ id, input, expectedAtom, expectedVerb, expectedTarget?, expectedRoute, persona, difficulty }`
- difficulty ∈ { easy, medium, hard, edge }
- expectedAtom ∈ { INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH, DECOMP }
- Total across all files MUST be ≥500 entries
- Realistic copy — no fake-test-data prefixes; production-quality phrasings

### A2 — ADR-106 + tests + EOP
**Owns:**
- `docs/adr/ADR-106-prompt-library-completeness.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-083 + ADR-098 + ADR-099)
- `tests/p81-prompt-library.spec.ts` (NEW; ≥15 cases; Playwright `test.describe`/`test`; FS-read PURE-UNIT pattern):
  - P81.1 ADR-106 file shape (4)
  - P81.2 Corpus count ≥500 (1 — sums all JSON file entries)
  - P81.3 New categories present (2 — multi-page.json + template-triggers.json exist + non-empty)
  - P81.4 Per-file schema soundness (4 — each existing JSON has `id`, `input`, `expectedAtom` on every entry)
  - P81.5 Migration 004 references prompt-library SQL (1)
  - P81.6 KISS — no animation libs (1)
  - P81.7 EOP triplet (3)
- `plans/implementation/phase-81/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync — bump ADRs `105 → 106`; tests `+15`; corpus count anchor; LEAVE NOTE for P82/A5 to bump 106 → 107 in same combined commit

**Constraints:** ADR ≤120 LOC; Status: Accepted (markdown bold tolerated); tests use `@playwright/test`; ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. NO shell commands inside agents (except tsc + targeted playwright run)
5. TypeScript-strict; no `any`
6. Each new entry must be realistic + production-quality

## Acceptance gates (combined P81 + P82)
- Corpus ≥500 entries
- 2 new category files (multi-page + template-triggers)
- ADR-106 + ADR-107 Accepted
- ≥15 P81 tests + ≥15 P82 tests GREEN
- Cumulative ≥655+ session OC chain regression
- tsc strict clean

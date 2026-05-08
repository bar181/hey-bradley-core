# Ruvector Backfill Notes — P80 / P81 / P82 + ADRs 105/106/107

**Date:** 2026-05-01
**Owner:** Bradley Ross
**Author:** Agent A4 (P82 / OC-CLEANUP)
**Status:** Doc-only artifact. Ruvector is a manually-curated static snapshot per CLAUDE.md (HNSW not active). Actual `memory_entries` row writes are **deferred** to the Tier-2 learning runtime per `plans/implementation/phase-61/03-ruvector-state.md`.

**Companion:** `ruvector-entry-schema-2026-04-29.md` (canonical schema), `ruvector-sample-entries-2026-04-29.json` (5 worked examples), `scripts/ruvector-validate-entry.py` (validator).

---

## §1. Scope

Ruvector currently holds **126 entries** at the P70 baseline. This doc enumerates the entries that **should** land in a future write pass to cover P80 / P81 / P82 phase rows and ADRs 105 / 106 / 107. Format mirrors the canonical schema §4 (Title / Context / Action / Why / Outcome / References) so a future scripted write pass can pick up these notes verbatim.

---

## §2. Phase rows (3) — namespace `hey-bradley-phases`, type `semantic`

**`p80-phase-summary`** · tags: `phase:P80`, `domain:adr`, `priority:moat` · content: P80 / OC-15 — Agentic-Product Templates. Templates 37 → 41 (+4 vertical-positioned: ai-agent-marketplace, ai-coding-copilot, ai-workflow-platform, ai-support-copilot). 3-agent parallel dispatch. Closes Gap 6 (P2 high-leverage) from `2026-05-01-comprehensive-review-3-gaps-resolutions.md`. ADR-105 Accepted (cross-refs ADR-096/098/091). +1 buffer over the literal floor of 40. Refs: ADR-105, `tests/p80-agentic-product-templates.spec.ts`, `plans/implementation/phase-80/`. · metadata: `{ phase: "P80", sprint: "OC-15", composite: null, tests: "+12 / cumulative ~954+", started_at: "2026-05-01", sealed_at: "2026-05-01", related_files: ["plans/implementation/phase-80/", "tests/p80-agentic-product-templates.spec.ts"] }`

**`p81-phase-summary`** · tags: `phase:P81`, `domain:test`, `priority:debt` · content: P81 — Test Library expansion (prompt corpus). Sibling-agent dispatch under P82: A1 owns `tests/prompts/*.json`, A2 owns the closer (ADR-106 + tests/p81-* + `plans/implementation/phase-81/*` + CLAUDE.md NOTE). Phase opens with preflight; session-log + retrospective land at A2 close. Refs: ADR-106 (pending), `tests/prompts/`, `plans/implementation/phase-81/preflight/`. · metadata: `{ phase: "P81", sprint: "OC-CLEANUP", started_at: "2026-05-01", sealed_at: tbd, related_files: ["plans/implementation/phase-81/preflight/", "tests/prompts/"] }`

**`p82-phase-summary`** · tags: `phase:P82`, `domain:aisp`, `priority:debt` · content: P82 / OC-CLEANUP — Page-aware INTENT/DECOMP + mobile drawer + blog +2 + RSS refresh + EOP audit + ruvector backfill notes. 3-agent parallel dispatch (A3 page-aware AISP, A4 blog/RSS/audit/notes, A5 closer). Closes 3 deferred P1s from P79 honest declarations. ADR-107 Accepted (pending). Refs: ADR-107, `tests/p82-*.spec.ts`, `plans/implementation/phase-82/`. · metadata: `{ phase: "P82", sprint: "OC-CLEANUP", started_at: "2026-05-01", sealed_at: tbd, related_files: ["plans/implementation/phase-82/", "src/contexts/intelligence/aisp/", "src/contexts/intelligence/chatPipeline.ts"] }`

---

## §3. ADR rows (3) — namespace `hey-bradley-adrs`, type `semantic`

**`adr-105-agentic-product-templates`** · tags: `phase:P80`, `domain:adr`, `sprint:OC-15` · content: ADR-105 Accepted. Agentic-Product Templates — 4 vertical-positioned templates raise count 37 → 41. Closes Gap 6 from comprehensive review #3. Cross-refs ADR-096 (Template Library Expansion Standard), ADR-098 (Template Intelligence Architecture), ADR-091 (Canonical Component Quality). Driven by realization the existing 37 templates skewed generic SMB/portfolio/SaaS and missed the agentic-product narrative the product itself sits inside. Refs: `docs/adr/ADR-105-agentic-product-templates.md`. · metadata: `{ adr_number: 105, phase: "P80", status: "Accepted", cross_refs: ["ADR-096","ADR-098","ADR-091"] }`

**`adr-106-prompt-corpus-expansion`** · tags: `phase:P81`, `domain:adr`, `sprint:OC-CLEANUP` · content: ADR-106 Accepted (pending; A2 owns final write). Prompt Corpus Expansion — extends the P59 280-entry canonical corpus with new categories and edge cases for the Tier-2 live-LLM testing arc. Sits on ADR-083 (Test Library Architecture). Refs: `docs/adr/ADR-106-prompt-corpus-expansion.md`, `tests/prompts/`. · metadata: `{ adr_number: 106, phase: "P81", status: "Accepted", cross_refs: ["ADR-083"] }`

**`adr-107-page-aware-aisp`** · tags: `phase:P82`, `domain:aisp`, `sprint:OC-CLEANUP` · content: ADR-107 Accepted (pending; A5 owns final write). Page-Aware AISP — extends ADR-104 into INTENT_ATOM target resolution and DECOMP_ATOM page-targeting verbs. Closes 3 deferred P1s from P79 declarations. Cross-refs ADR-053 (Crystal Atom), ADR-085 (Multi-Page MVP), ADR-099 (DECOMP_ATOM), ADR-104 (Page-Aware Chat Pipeline). Refs: `docs/adr/ADR-107-page-aware-aisp.md`. · metadata: `{ adr_number: 107, phase: "P82", status: "Accepted", cross_refs: ["ADR-053","ADR-085","ADR-099","ADR-104"] }`

---

## §4. Out of scope

- Writing rows to `memory.db` — deferred to Tier-2 learning runtime activation.
- Embedding computation / HNSW re-index — deferred per `ruvector-fix-2026-04-29.md` §6.
- Schema changes — locked.

When the Tier-2 runtime activates, this file becomes the input to one-shot `scripts/ruvector-write-pattern.py` invocations per entry. Until then, this is the durable record of *what would have been written* if HNSW were live.

---

## §5. Status

- [x] 3 phase rows enumerated (P80 / P81 / P82)
- [x] 3 ADR rows enumerated (ADR-105 / ADR-106 / ADR-107)
- [x] All entries follow `ruvector-entry-schema-2026-04-29.md` §4 6-line content layout
- [ ] Actual `memory_entries` writes — deferred to Tier-2 activation

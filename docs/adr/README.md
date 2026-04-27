# Architecture Decision Records (ADR) Index

This directory contains the Architecture Decision Records for the Hey Bradley project. Each ADR captures one architectural decision, its context, and its consequences in immutable form.

> **Status as of 2026-04-27 (post-P19 seal, commit `03e7aa7`):** 38 accepted ADRs on disk, numbered through ADR-048. The numbering contains 11 intentional gaps documented below. Next ADR should be numbered **ADR-049**.

---

## ADR Numbering Convention

ADRs are numbered sequentially in the order they were proposed, NOT in the order they were accepted. The numbering is append-only and never re-used: once an ADR number is assigned to a draft, that number is burned even if the ADR is later rejected, withdrawn, or superseded.

### Numbering gaps on disk

The following 11 ADR numbers do **not** have files in this directory despite being below the highest accepted number (048):

| Range | Missing numbers | Disposition |
|---|---|---|
| Early pre-MVP (pre-P11) | **002, 003, 004** | Drafted during the initial spec exploration phase. Re-scoped into ADR-001 (JSON SSOT) and ADR-005 (Zustand) before the architecture pivot; never accepted. |
| Pre-P11 chrome | **006, 007, 008, 009** | Color/chrome iterations folded into **ADR-009b** ("Warm Light Chrome — Supersedes ADR-009"). The plain `ADR-009.md` was withdrawn; its successor `ADR-009b` is the accepted record. |
| Pre-P15 JSON-architecture pivot | **034, 035, 036, 037** | Drafted during the P14 marketing-review pivot (referenced as "ADR-037: JSON Architecture Separation" in earlier CLAUDE.md status blocks). The pivot was re-scoped into **ADR-031** (JSON Data Architecture) and **ADR-029** (Pre-LLM MVP Architecture, Stage 2). The 034-037 drafts were superseded before acceptance. |

**Policy:** New ADRs MUST continue at **ADR-049+**. Do NOT re-use any of the missing numbers above; the historical record (and all cross-references in older session logs / retros) depends on those numbers staying burned.

---

## ADRs by Phase

The 38 accepted ADRs group by the implementation phase in which they were authored and merged:

| Phase | ADRs landed | Count | Theme |
|---|---|---:|---|
| **P11** (Foundation, brand/chrome) | ADR-001, ADR-005, ADR-009b, ADR-010, ADR-011, ADR-012, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017, ADR-018, ADR-019, ADR-020, ADR-021 | **15** | JSON SSOT, Zustand, theming, palette, visibility matrix |
| **P12** (Content Intelligence) | ADR-022 | **1** | Section Type Registry |
| **P13** (Advanced Features) | ADR-023, ADR-024, ADR-025 | **3** | Section naming, layout variants, visual-first design |
| **P14** (Marketing review + AISP pivot) | ADR-026, ADR-027, ADR-028, ADR-029, ADR-030, ADR-031, ADR-032, ADR-033 | **8** | AISP output, micro-interactions, Pre-LLM MVP architecture, AISP Crystal Atoms, AISP brownfield |
| **P15** (Polish + Kitchen Sink + Blog) | ADR-038, ADR-039 | **2** | Kitchen-sink reference example, standard blog page |
| **P16** (Local DB) | ADR-040, ADR-041 | **2** | sql.js + IndexedDB persistence, schema versioning |
| **P17** (LLM provider abstraction) | ADR-042, ADR-043 | **2** | Provider abstraction (BYOK), API key trust boundaries |
| **P18** (Real chat mode) | ADR-044, ADR-045 | **2** | JSON Patch return contract, AISP Crystal-Atom system prompt |
| **P18b** (Provider expansion + observability) | ADR-046, ADR-047 | **2** | Multi-provider LLM architecture (5 adapters), `llm_logs` observability |
| **P19** (Real listen mode) | ADR-048 | **1** | STT via Web Speech API, push-to-talk only |
| **Total** | | **38** | |

> **Cross-check:** 15 + 1 + 3 + 8 + 2 + 2 + 2 + 2 + 2 + 1 = **38** files; matches `ls docs/adr/ADR-*.md \| wc -l`.

---

## Conventions for new ADRs

1. **Filename:** `ADR-NNN-kebab-case-title.md` where `NNN` is the next free number ≥ 049.
2. **First line:** `# ADR-NNN: Title` (exact-case match to filename).
3. **Status field:** `Proposed` → `Accepted` → optionally `Superseded by ADR-XXX`. Never delete an ADR file once committed; mark it `Superseded` and link forward.
4. **Cross-references:** When a new ADR builds on or supersedes an existing one, link both directions (the older ADR gets a `Superseded by` line; the new ADR gets a `Supersedes` line in its context).
5. **Phase tagging:** Reference the implementation phase in the ADR body (e.g., "Authored during P19 to address …") so future audits can re-derive the phase grouping above without spelunking through commit metadata.
6. **One decision per ADR.** If a single phase needs multiple decisions, create multiple ADRs (P11 produced 15, P14 produced 8 — that is the right cadence, not one mega-ADR).

---

## See also

- `plans/implementation/mvp-plan/08-master-checklist.md` — per-phase ADR checklists tied to DoD items.
- `plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md` §5 — 20 P20 carryforward items (some will produce ADR-049+).
- `CLAUDE.md` `## Project Status` block — top-line ADR count is mirrored here.

---

**Last updated:** 2026-04-27 (post-P19 seal at `03e7aa7`).

# P73 Retrospective — OC-TPL-AUDIT

> **Date:** 2026-05-01
> **Phase:** P73 / OC-TPL-AUDIT (audit + fix, two-phase sprint)

---

## Keep

- **2-phase audit → fix structure.** Audit first (read-only spot-check, brutal-honest scoring with file:line citations), then dispatch a fix sprint scoped *only* to what the audit surfaced. This is significantly tighter than ad-hoc "go improve templates" sprints.
- **Brutal-honest scoring with file:line citations.** Every score in the audit table cites a specific file:line range so disagreements are testable, not opinion.
- **5-agent disjoint dispatch with audit-derived scopes.** Each agent owned a small, non-overlapping file set. Zero merge friction. A1 owned 6 JSON files; A2/A3/A4 each owned exactly one TS library; A5 owned tests + docs.
- **`exampleQueries: readonly string[]` as REQUIRED (not optional).** Required fields force backfill discipline. Optional fields rot — you ship 3 entries with the field, 39 without, and the matcher quality flatlines forever.
- **PURE-UNIT FS-read test pattern.** No browser bootstrap, no fixture seeding. Same pattern as P67c/P71/P72 — fast, deterministic, CI-friendly.

## Drop

- **Inflated "40+ templates" target.** The honest count is 37 (added 11 in OC-4 round 2). The literal "40+" gap (3 more templates) is real but should not be chased mid-audit; carry it forward as "OC-4 round 3" and budget it explicitly. P73 deliberately did NOT add 3 new templates because the audit identified that template *quality* (bottom-5 score lift) was more valuable than template *quantity*.
- **Vague "polish" sprints.** P73 worked because every change had an audit-line justification. "Polish" without a scoring rubric is unaccountable.

## Reframe

- **The libraries are now LLM-training-ready, not just keyword-matched.** Each of 51 entries carries tags + `vectorDescription` (1-2 sentences) + 2-3 `exampleQueries` (real user utterances). When HNSW activates on the Tier-2 commercial runtime, the embedding surface is already there — no further library work required. P73 was secretly an HNSW-prep sprint.
- **Audit-driven sprints are tighter than ad-hoc ones.** The bottom-5 list focused effort precisely. Without the audit, A1 might have spent the same hours on "improve some templates" with diffuse results.
- **REQUIRED-field interface changes can ship in one sprint.** Conventional wisdom says "add as optional, then deprecate." But when one team owns all consumers and all entries, you backfill in the same commit and ship REQUIRED on day 1. This is faster *and* cleaner.

## Carry-forward

| Item | Why deferred | Owner-route |
|---|---|---|
| HNSW activation (re-index + auto-write per agent run) | Tier-2 commercial learning runtime per ADR-098 §Out of scope | Tier-2 |
| OC-DECOMP (intent → todo decomposition; pre-pipeline accumulator) | Separate sprint scope; CRITICAL blocker for full chatPipeline wire | P74+ |
| OC-TI Wave 2 (matcher UI surface — ranked candidates in chat thread) | UI scope; out of audit-fix scope | P74+ |
| `useChatPipeline` hook (P67d) | Pipeline integration, not template content | P74+ |
| Web Speech wire-up (MobileListenFullscreen) | Not template-related | P74+ |
| OC-CLEANUP marketing-site mobile (ADR-090 decision 5) | Wave 4 legacy surface | Polish Wave 4 |
| Build-step RSS generator (replaces static stub) | Blog tooling | Blog backlog |
| +2 stretch blog posts → 12+ total | Blog cadence | Blog backlog |
| A1 P72 ruvector backfill (126 entries; 0 vectors indexed) | Manual; deferred to OC-CLEANUP follow-up | OC-CLEANUP |
| +3 templates → literal 40+ ("OC-4 round 3") | Quality over quantity in P73 | OC-4 round 3 |

---

**Bottom line:** P73 is a model for future "audit-then-fix" sprints. Two short phases (Phase 1 read-only audit; Phase 2 5-agent disjoint fix) close more honest debt than one diffuse polish sprint of equal duration.

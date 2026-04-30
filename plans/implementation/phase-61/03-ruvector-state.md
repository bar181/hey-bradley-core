# P61 — Ruvector State + Cleanup Plan

> **Date:** 2026-04-30 · **Source of truth:** `python3 scripts/ruvector-stats.py`
> **Last index update:** 2026-04-29 (~24h stale at P61 open)
> **Verdict:** snapshot, not a flywheel.

---

## Honest current state

| Property | Value | Status |
|---|---|---|
| `memory_entries` rows | 95 | populated |
| Vector index `default` (768-dim cosine) | **0 vectors** | **NOT INDEXED** |
| Vector index `patterns` (768-dim cosine) | **0 vectors** | **NOT INDEXED** |
| `pattern_history` rows | 0 | empty |
| `sessions` rows | 0 | empty |
| `trajectories` rows | 0 | empty |
| Newest `updated_at` | 2026-04-29 ~15:00 UTC | stale (P58/P59/P60/P60.5/P61 deltas missing) |
| Auto-write hook on agent runs | none | not wired |
| Search via HNSW | **non-functional** (0 vectors) | text-search via SQL `LIKE` works |

**Ruvector is NOT optimal, NOT saving on every prompt, NOT used for all
prompts.** It is a manually-curated static snapshot of phase summaries +
ADR digests + decisions + learnings. The HNSW re-index and auto-write-
per-agent-run are **correctly deferred** to Tier-2 commercial learning
runtime per `CLAUDE.md` § Project Status.

---

## What's missing from the snapshot (write at OC-CLEANUP)

Five entries to add via `scripts/ruvector-write-pattern.py`:

| Namespace | Key | Type | Source |
|---|---|---|---|
| `hey-bradley-phases` | `p58-phase-summary` | semantic | Sprint O Open Core RC, `e99ecc2` |
| `hey-bradley-phases` | `p59-phase-summary` | semantic | Test Library prompt corpus, `f81474c` |
| `hey-bradley-phases` | `p60-phase-summary` | semantic | Comprehensive QA Architecture, `fcb3c06` + `dabc638` (P60.5) |
| `hey-bradley-phases` | `p61-phase-summary` | semantic | Launch Planning, `64e305c` |
| `hey-bradley-adrs` | `adr-082-open-core-rc` | pattern | ADR-082 |
| `hey-bradley-adrs` | `adr-083-test-library-architecture` | pattern | ADR-083 |
| `hey-bradley-adrs` | `adr-084-comprehensive-qa` | pattern | ADR-084 |
| `hey-bradley-adrs` | `adr-085-multi-page-mvp` | pattern | ADR-085 (this phase) |
| `hey-bradley-adrs` | `adr-086-process-pages-split` | pattern | ADR-086 (this phase) |

Eight rows (5 ADR + 3-4 phase summary). Brings ruvector to ~104 entries.

---

## Open-core boundary on ruvector activation

| Capability | Open-core | Tier-2 |
|---|---|---|
| Manually-curated static snapshot | ✅ shipped | — |
| Local HNSW re-index (in-browser, sql.js) | possible (OC-CLEANUP) | — |
| Auto-write to ruvector on every agent run | **NO** (inflates blast radius; complicates BYOK) | ✅ |
| Cross-session learning runtime | **NO** | ✅ |
| Hosted vector DB | **NO** | ✅ |
| Agent decision-loop reading ruvector before each call | **NO** (open-core path stays prompt-only) | ✅ |

The local HNSW re-index *could* land in OC-CLEANUP if effort is ≤ 1
hour; otherwise stays Tier-2.

---

## OC-CLEANUP work for ruvector

1. Add the 8 missing entries via `ruvector-write-pattern.py`
2. Decide HNSW re-index: ≤ 1 hour effort → ship; otherwise leave for Tier-2
3. Document the boundary above in `CLAUDE.md` § Ruvector Memory
4. Add a `ruvector-state.md` link from `plans/strategic-reviews/` index

Effort: 1-2 hours within OC-CLEANUP day.

---

## Why this is acceptable for open-core launch

The capstone reviewer + competitive analysis both score on output
quality (spec-quality 10/10) and BYOK cost ($0). Neither requires a
running learning flywheel. The flywheel is a Tier-2 commercial moat
(continuous improvement, multi-tenant patterns, reasoning-bank-style
trajectory replay) — not a public-RC blocker.

Public RC ships ruvector as a **read-only knowledge artifact** that
downstream Claude Code agents can query for phase/ADR/decision context.
That's enough for the capstone narrative. The flywheel waits.

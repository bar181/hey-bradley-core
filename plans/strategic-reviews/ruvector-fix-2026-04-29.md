# Ruvector Flywheel — Connection Fix (Sprint M parallel mini-task)

**Date:** 2026-04-29
**Owner:** Bradley Ross
**Scope:** Read-only audit + small write helper + verification. Source code untouched.
**Companion mini-phase:** Population from logs/ADRs — scoped in §5, NOT executed here.

---

## §1. Pre-fix Audit

| Field | Value |
|---|---|
| DB path | `/home/user/hey-bradley-core/.swarm/memory.db` (208 KB) |
| Schema source of truth | `/home/user/hey-bradley-core/.swarm/schema.sql` (RuFlo V3, schema_version `3.0.0`) |
| Tables | `memory_entries`, `patterns`, `pattern_history`, `sessions`, `trajectories`, `trajectory_steps`, `migration_state`, `vector_indexes`, `metadata`, `sqlite_sequence` |
| `memory_entries` rows | **8** |
| `patterns` rows | 0 |
| `sessions` rows | 0 |
| `trajectories` rows | 0 |
| `trajectory_steps` rows | 0 |
| `pattern_history` rows | 0 |
| `migration_state` rows | 0 |
| `vector_indexes` rows | 2 (`default`, `patterns`; both 768-dim cosine) |
| Last write `updated_at` | `1775401338933` = **2026-04-05T15:02:18Z** (pre-Sprint-G) |
| HNSW index file | `.swarm/hnsw.index` (1.55 MB, mtime 2026-04-25 — newer than DB writes; suggests prior reindex with no new vectors) |
| HNSW metadata | `.swarm/hnsw.metadata.json` — declares `model: all-MiniLM-L6-v2`, dim **384**; conflicts with vector_indexes table (dim **768**) — see §7 |

**8 stale rows** (all namespace `hey-bradley` / `grounding`):
1. `grounding/system-grounding` — initialization snapshot
2. `grounding/architecture-config`
3. `grounding/ruvector-config`
4. `grounding/grounding-file`
5. `hey-bradley/phase9-grounding`
6. `hey-bradley/sprint-order-correction`
7. `hey-bradley/aisp-protocol-v5.1`
8. `hey-bradley/hey-bradley-architecture` (last; pre-Sprint-G)

**Verdict:** flywheel is dormant. The DB exists, the indexes exist, but no Sprint G/H/I/J/K artifact has ever been written. Semantic search across 78 ADRs and 30+ phase artifacts is zero-yield today.

**Agentic-flow MCP config search:** none found under `.claude-flow/` or `.swarm/`. Runtime config (`.claude-flow/config.yaml`) declares `memory.backend=hybrid`, `enableHNSW=true`, `learningBridge.enabled=true`, but no MCP server entry for `agentic-flow` is wired into project. Direct sqlite writes are the safe path; MCP integration is a separate concern.

---

## §2. Schema Review (semantic-search readiness)

**`memory_entries` columns relevant for semantic search:**

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | TEXT PK | — | Pattern: `entry_{ms}_{rand6}` |
| `key` | TEXT NOT NULL | — | Part of `UNIQUE(namespace, key)` |
| `namespace` | TEXT | `'default'` | Indexed |
| `content` | TEXT NOT NULL | — | Free-text payload (the searchable string) |
| `type` | TEXT | `'semantic'` | CHECK in `{semantic, episodic, procedural, working, pattern}` |
| **`embedding`** | TEXT | NULL | JSON array of floats — populated by re-indexer |
| **`embedding_model`** | TEXT | `'local'` | Default already correct for open-core |
| **`embedding_dimensions`** | INTEGER | NULL | Set when embedding written |
| `tags` | TEXT | NULL | JSON array |
| `metadata` | TEXT | NULL | JSON object |

**HNSW state:** `vector_indexes` table declares 768-dim cosine for both `default` and `patterns`; this is the canonical configuration. The on-disk `hnsw.metadata.json` mentions a 384-dim MiniLM model, which is stale/leftover from a prior init. **Re-indexing is out of scope for this fix** — embeddings stay NULL until the population mini-phase runs. With NULL embeddings, BM25/keyword search via `LIKE` and `tags` is still functional (and is the fallback the runtime falls back to).

**Where embeddings get computed:** the runtime computes them via the `learningBridge` path declared in `.claude-flow/config.yaml`. Adding embeddings post-write is a re-index step, not a write step. The helper deliberately stays at the write layer.

---

## §3. Write Helper

| Field | Value |
|---|---|
| Path | `/home/user/hey-bradley-core/scripts/ruvector-write-pattern.py` |
| LOC | **79** (target ≤80) |
| Deps | sqlite3 stdlib only |
| Idempotent | Yes — `ON CONFLICT(namespace, key) DO UPDATE SET content, type, tags, updated_at` |
| Embedding | NULL (re-index out of scope) |

**CLI:**
```
python3 scripts/ruvector-write-pattern.py \
    --namespace <ns> --key <key> --content "<text>" \
    [--type semantic|episodic|procedural|working|pattern] \
    [--tags a,b,c]
```

**Sample invocation** (the verification row from §4):
```
python3 scripts/ruvector-write-pattern.py \
    --namespace test-fix --key sprint-m-fix-verify \
    --content "Sprint M ruvector-fix agent verifies write capability" \
    --type semantic --tags sprint-m,ruvector-fix,test
```

**Output format:** `rows: <before> -> <after>` then `row : id=... ns=... key=... type=... content_len=...`.

---

## §4. Post-fix Verification

```
$ python3 -c "import sqlite3; ...COUNT(*)..."
PRE: 8

$ python3 scripts/ruvector-write-pattern.py --namespace test-fix \
      --key sprint-m-fix-verify \
      --content "Sprint M ruvector-fix agent verifies write capability" \
      --type semantic --tags sprint-m,ruvector-fix,test
rows: 8 -> 9
row : id=entry_1777446653612_55f641 ns=test-fix key=sprint-m-fix-verify type=semantic content_len=53

$ python3 -c "...read back row..."
POST: 9
READBACK: ('entry_1777446653612_55f641', 'test-fix', 'sprint-m-fix-verify',
           'semantic', 'Sprint M ruvector-fix agent verifies write capability',
           '["sprint-m", "ruvector-fix", "test"]', 1777446653612)
```

**Result:** 8 → 9. Row persists across connections. UNIQUE(namespace,key) constraint honored. Tags JSON encodes correctly. Connection: **REPAIRED.**

The single test row stays in the DB as the proof-of-life marker. The 8 pre-existing rows are untouched.

---

## §5. Population Mini-Phase Plan

**Goal:** populate ruvector with phase-level institutional memory so future agents can semantic-search across history instead of rereading every `session-log.md`.

**Sources per phase (P15 → P55):** `phase-N/preflight/00-summary.md`, `phase-N/session-log.md`, `phase-N/retrospective.md`, ADRs introduced that phase (e.g., P23 → ADR-050), and `phase-N/personas.md` where present.

**Namespace layout (~400 rows total — within brief's 200-600 envelope):**
- `hey-bradley-phases` — 1 summary row × 40 phases = ~40 rows
- `hey-bradley-adrs` — 1 row × ~67 ADRs = ~67 rows
- `hey-bradley-decisions` — keep/drop/reframe × 40 phases × ~4 = ~150 rows
- `hey-bradley-wins` — capabilities × 40 phases × ~3 = ~120 rows

**Sample row schema** (one phase summary; ADR rows follow same shape):
```python
{
  "namespace": "hey-bradley-phases",
  "key":       "p27-sprint-c-p2-llm-native-aisp",
  "content":   "P27 Sprint C P2: LLM-Native AISP. Crystal Atom passed verbatim "
               "to LLM with Zod schema. ADR-055 + ADR-056. Composite 90/100 "
               "(plateau broken). Capstone 96. 211/211 tests GREEN.",
  "type":      "semantic",
  "tags":      "p27,sprint-c,aisp,adr-055,adr-056,llm-native"
}
```

**Estimated effort:** ~2 hours of agent work — ~30 min reading session-logs/retros, ~30 min reading ADRs, ~30 min composing + writing ~400 rows via the helper, ~30 min spot-check + row-count verification.

**Implementation pattern:**
```bash
for phase in P15..P55:
  summary = read(phase/preflight/00-summary.md) + read(phase/retrospective.md)
  python3 scripts/ruvector-write-pattern.py \
      --namespace hey-bradley-phases --key "${phase}-${slug}" \
      --content "$summary" --tags "${phase},${sprint},${primary-adrs}"
```

**Re-index step (separate sub-mini-phase):** after writes complete, trigger an HNSW rebuild so the 400 rows get embeddings (gated on §6 model choice).

---

## §6. Embedding Strategy Recommendation

**Constraint:** open-core repo cannot require a paid API key for basic functionality. Default `embedding_model='local'` in `schema.sql:24` is correct.

| Option | Cost | Open-core fit |
|---|---|---|
| Local `bge-base-en-v1.5` (768-dim, ~440 MB) | $0 | **YES — recommended** (matches `vector_indexes.dimensions=768`) |
| Local `all-MiniLM-L6-v2` (384-dim, ~80 MB) | $0 | YES if size matters; matches existing `hnsw.metadata.json` but conflicts with vector_indexes table |
| Anthropic / OpenAI embedding APIs | per-request | NO for default; available via BYOK |

**Recommendation:** stick with `local`; pick `bge-base-en-v1.5` to honor the 768-dim `vector_indexes` config and avoid a schema migration. **Decision must be made before the population mini-phase runs** — switching later requires re-embedding all rows. Verifying the runtime's `learningBridge` wiring (`.claude-flow/config.yaml`) is part of the mini-phase preflight, not this fix.

---

## §7. Risks

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Schema drift if the MCP server / claude-flow runtime expects different column shapes.** No agentic-flow MCP wiring found in this project (`.claude-flow/config.yaml` does not declare an MCP server entry). The runtime appears to write directly to sqlite via the same schema. Helper writes only documented columns from `schema.sql`. | Helper uses `INSERT … ON CONFLICT` over named columns from `schema.sql`. If the runtime later adds NOT-NULL columns without defaults, helper will need an update. **Action:** before population mini-phase, run `python3 scripts/ruvector-write-pattern.py` once to confirm schema is still compatible. |
| 2 | **HNSW dimension mismatch.** `vector_indexes` table = 768-dim, `hnsw.metadata.json` = 384-dim. | Pick one in §6. The helper writes embedding=NULL so the mismatch is not triggered by this fix. A re-index will need to align both. |
| 3 | **Stale `hnsw.index` file (1.55 MB, mtime 2026-04-25).** Was rebuilt without new data — likely an empty/no-op rebuild. | Population mini-phase must trigger a fresh rebuild after rows are written. |
| 4 | **Pollution of `test-fix` namespace.** The verification row (`test-fix/sprint-m-fix-verify`) is intentionally left in the DB as a proof-of-life marker. | Drop it via `DELETE FROM memory_entries WHERE namespace='test-fix'` after the population mini-phase verifies real rows are landing. |
| 5 | **Idempotency relies on UNIQUE(namespace, key).** If the runtime ever drops that constraint, ON CONFLICT clause silently no-ops. | Schema review confirms the constraint at `schema.sql:44`. Re-verify before mini-phase. |

---

## Status

- [x] §1 Audit complete (8 rows, last write 2026-04-05, 6 empty learning tables)
- [x] §2 Schema reviewed (`embedding TEXT`, default `local` model — open-core safe)
- [x] §3 Helper shipped at `scripts/ruvector-write-pattern.py` (79 LOC)
- [x] §4 Test row written + verified (8 → 9)
- [x] §5 Population mini-phase scoped (~400 rows, ~2h)
- [x] §6 Embedding strategy recommended (local, default already correct)
- [x] §7 Risks enumerated (5 risks; none blocking)

**Connection fix: COMPLETE.** Population mini-phase: NOT STARTED (separate mini-phase as briefed).

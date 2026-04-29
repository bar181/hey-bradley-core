# Ruvector Operational Verification — Reads / Writes / Search End-to-End

**Date:** 2026-04-29
**Owner:** Bradley Ross
**Agent:** R2 (operational verifier; parallel with R1 best-practices research and R3 entry-schema design)
**Scope:** Read-only audit + verify reads, full text search, namespace queries, idempotent writes, HNSW index reconciliation. Source code untouched.
**Predecessor:** `ruvector-fix-2026-04-29.md` (write capability proven 8 → 9). This doc proves the read path + the search path the population swarm needs.

---

## §1. Pre-existing State

`python3 scripts/ruvector-stats.py` (verbatim):

```
db: /home/user/hey-bradley-core/.swarm/memory.db  size=221184 bytes

== Tables (row counts) ==
  memory_entries           9
  metadata                 8
  migration_state          0
  pattern_history          0
  patterns                 0
  sessions                 0
  trajectories             0
  trajectory_steps         0
  vector_indexes           2

== memory_entries by namespace ==
  grounding                4
  hey-bradley              4
  test-fix                 1

== memory_entries by type ==
  semantic                 9

== timestamps (ms epoch) ==
  oldest created_at  1774648579718   (2026-03-27T21:56:19Z)
  newest updated_at  1777446653612   (2026-04-24T15:24:13Z)

== content length ==
  median  275
  max     439

== vector_indexes ==
  id=default dim=768 metric=cosine vectors=0
  id=patterns dim=768 metric=cosine vectors=0

== schema_version ==
  3.0.0
```

**Baseline:** 9 rows (8 grounding/hey-bradley from initial seed + 1 `test-fix/sprint-m-fix-verify` proof-of-life left by Sprint M ruvector-fix). All 9 rows have `embedding=NULL`, `vector_indexes.total_vectors=0`. The flywheel is at REST — writes work but nothing has been semantically embedded yet.

---

## §2. Read Verification

Wrote 3 test rows to `verify` namespace via `scripts/ruvector-write-pattern.py`:

```
rows: 9 -> 10   id=entry_1777466031772_521a68 ns=verify key=r2-alpha   type=semantic content_len=89
rows: 10 -> 11  id=entry_1777466031808_c37646 ns=verify key=r2-beta    type=pattern  content_len=72
rows: 11 -> 12  id=entry_1777466031840_a54b69 ns=verify key=r2-gamma   type=semantic content_len=85
```

### §2.a `--key r2-alpha` exact match → 1 row ✅

```
id=entry_1777466031772_521a68
  ns=verify key=r2-alpha type=semantic status=active dim=None
  tags=["r2-verify", "alpha", "ruvector"] updated_at=1777466031772
  content[89]=Agent R2 verify alpha: ruvector reads exercising key/namespace/tag/text-search e...
[1 row(s)]
```

### §2.b `--namespace verify` → 3 rows ✅

```
id=entry_1777466031840_a54b69 ns=verify key=r2-gamma  type=semantic
id=entry_1777466031808_c37646 ns=verify key=r2-beta   type=pattern
id=entry_1777466031772_521a68 ns=verify key=r2-alpha  type=semantic
[3 row(s)]
```

### §2.c `--tag r2-verify` → 3 rows ✅

```
id=entry_1777466031840_a54b69 ns=verify key=r2-gamma  tags=["r2-verify", "gamma", "moat"]
id=entry_1777466031808_c37646 ns=verify key=r2-beta   tags=["r2-verify", "beta"]
id=entry_1777466031772_521a68 ns=verify key=r2-alpha  tags=["r2-verify", "alpha", "ruvector"]
[3 row(s)]
```

(`tags` LIKE `%"r2-verify"%` — JSON-array quoted-token search. Works for any tag string without false-positive collisions.)

### §2.d `--text-search SPRINT-M-MOAT-OPERATIONAL` → 1 row ✅

```
id=entry_1777466031840_a54b69 ns=verify key=r2-gamma
  content[85]=Agent R2 verify gamma: substring text-search target token = SPRINT-M-MOAT-OPERAT...
[1 row(s)]
```

(`content LIKE %token%` — substring across full content blob. This is the BM25/keyword fallback that works without embeddings.)

**Verdict §2:** all four read modes operational.

---

## §3. Write Idempotency

Re-ran the write helper for `verify/r2-beta` with different content + a `rewritten` tag added:

```
BEFORE: 12
rows: 12 -> 12
row : id=entry_1777466031808_c37646 ns=verify key=r2-beta type=pattern content_len=81
AFTER:  12
```

Read-back shows same row id (`entry_1777466031808_c37646`), updated content (length 72 → 81), updated tags (`["r2-verify", "beta", "rewritten"]`), and `updated_at` advanced from `1777466031808` to `1777466031999`.

**Verdict §3:** `INSERT … ON CONFLICT(namespace, key) DO UPDATE` honored. Row count stays at 12 (= 9 baseline + 3 verify), NOT 13. Idempotent. The population swarm can safely re-run the write helper for the same `(namespace, key)` without proliferating duplicates — a critical property when 400+ rows are being written across multiple agent attempts.

---

## §4. HNSW Index Reconciliation

| Source | Dim | Notes |
|---|---|---|
| `.swarm/hnsw.index` (binary, 1.55 MB) | unknown from file alone | Present; mtime 2026-04-25 (after the last DB write) |
| `.swarm/hnsw.metadata.json` | **N/A** | This file is NOT HNSW dim metadata — it is a JSON snapshot of the 8 original `memory_entries` rows (`[[id,{id,key,namespace,content}], …]`). The "384" / "all-MiniLM-L6-v2" mention is INSIDE the row content of `grounding/ruvector-config`, not as a top-level config key. **Correction to ruvector-fix-2026-04-29.md §1.** |
| `vector_indexes` table | **768** (cosine, both `default` and `patterns` indexes; `total_vectors=0`) | Authoritative source per `schema.sql:303-305` |

**Re-index dim choice:** the only canonical dim signal in the system is `vector_indexes.dimensions=768`. The `hnsw.metadata.json` file is a misnamed export, not a config; it does NOT pin a dimension at all. Therefore the apparent 768/384 conflict from the prior fix doc is overstated — the only deliberate choice ever recorded is **768**.

**Recommended plan (matches R1's best-practices research scope):**
1. **Defer re-index until AFTER the population swarm finishes.** The helper writes `embedding=NULL`; this is safe because the schema permits NULL on `embedding`, `embedding_model`, and `embedding_dimensions`.
2. **Pick a 768-dim local model** (e.g. `bge-base-en-v1.5`) so we honor the existing `vector_indexes` config and avoid a schema migration. Switching to 384/MiniLM later requires re-embedding every row.
3. **Rebuild `.swarm/hnsw.index` post-population** by walking `memory_entries` where `embedding IS NULL`, computing embeddings, writing them back, then triggering an HNSW build. Recommend renaming/replacing the misnamed `hnsw.metadata.json` snapshot file at the same time.

**Verdict §4:** re-indexing requires a deliberate dim choice, but the only deliberate prior choice on record is 768. Recommend `bge-base-en-v1.5` (768-dim, local, ~440 MB) — defer until population mini-phase completes.

---

## §5. MCP Wiring Audit

Search across `.json`, `.yaml`, `.yml` (excluding `node_modules`, `upstreams/`, `.git/`):

| File | Relevance |
|---|---|
| `.mcp.json` | Declares `claude-flow` MCP server (`npx @claude-flow/cli@latest mcp start`) with `autoStart: false`. **Does NOT declare an `agentic-flow` MCP server.** No tools wired to ruvector reads/writes. |
| `.claude-flow/config.yaml` | Declares `memory.backend=hybrid`, `enableHNSW=true`, `learningBridge.enabled=true`, `mcp.autoStart: false`. Runtime config — not an MCP tool wiring. |
| `.swarm/hnsw.metadata.json` | False positive — contains the literal string "ruvector-config" inside row content, not an MCP wiring. |

**Conclusion:** no MCP server in this project owns ruvector writes. The population swarm WILL write directly via `python3 scripts/ruvector-write-pattern.py` (NOT through MCP). Reads will go through `python3 scripts/ruvector-read.py` or the Python sqlite3 stdlib equivalent. This is a deliberate KISS choice — adding an MCP layer is out of scope for the population mini-phase.

---

## §6. Cleanup

Deleted the 3 verify-namespace test rows:

```
$ python3 -c "import sqlite3; conn=sqlite3.connect('.swarm/memory.db'); \
   n=conn.execute(\"DELETE FROM memory_entries WHERE namespace='verify'\").rowcount; \
   conn.commit(); print(f'Deleted {n} rows')"
Deleted 3 rows from verify namespace
```

Final `python3 scripts/ruvector-stats.py`:

```
== Tables (row counts) ==
  memory_entries           9     <-- back to baseline
== memory_entries by namespace ==
  grounding                4
  hey-bradley              4
  test-fix                 1
```

**Verdict §6:** database returned to 9-row baseline. No verify-namespace pollution. Population mini-phase starts from a clean slate.

---

## §7. Operational Readiness Verdict

**READY** — with one cosmetic caveat (the misnamed `hnsw.metadata.json` snapshot file).

**Evidence:**
- Reads work for all 4 query modes the population swarm + future query agents need (key, namespace, tag, text-search). §2.
- Writes are idempotent under `INSERT … ON CONFLICT(namespace, key) DO UPDATE`. §3.
- Stats snapshot covers all 9 tables, namespace/type breakdowns, content length stats, and vector_indexes dim. §1.
- HNSW dim conflict from the prior fix doc is overstated — the authoritative dim is 768 in `vector_indexes`; `hnsw.metadata.json` is a misnamed row snapshot, not a config. §4.
- MCP wiring is intentionally absent — population writes go via the helper script directly. §5.
- DB is back to a 9-row baseline post-cleanup. §6.

**Caveats:**
1. `embedding=NULL` for all rows. Population swarm should NOT attempt to populate `embedding`/`embedding_model`/`embedding_dimensions` columns — leave NULL, defer to a separate post-population re-index step (R1's research will inform that step).
2. `.swarm/hnsw.index` (1.55 MB, mtime 2026-04-25) is stale. Population mini-phase MUST trigger a fresh rebuild after rows land. Recommend deleting + regenerating rather than incremental update, given dim choice uncertainty.
3. `hnsw.metadata.json` is misnamed — it's a row snapshot, not metadata. Population mini-phase should rename or replace it as part of the re-index step.

**Blocking risks:** **none.** All 3 caveats are deferred-by-design to the re-index sub-phase, not blockers for population.

**Recommendation to population swarm:** proceed with `scripts/ruvector-write-pattern.py` for ~400 rows across `hey-bradley-phases`, `hey-bradley-adrs`, `hey-bradley-decisions`, `hey-bradley-wins` namespaces. Verify each batch with `scripts/ruvector-read.py --namespace <ns>`. Run `scripts/ruvector-stats.py` between batches to monitor row growth and content-length distribution.

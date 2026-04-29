# Ruvector Entry Schema — Canonical Spec

**Date:** 2026-04-29
**Owner:** Bradley Ross
**Author:** Agent R3 (Sprint M ruvector audit; parallel to R1 best-practices + R2 read/write verify)
**Scope:** Entry shape contract for the upcoming ~400-row population pass over P15-P57.
**Companion:** `ruvector-fix-2026-04-29.md` (connection fix), `ruvector-sample-entries-2026-04-29.json` (5 worked examples), `scripts/ruvector-validate-entry.py` (validator).

---

## §1. Canonical entry shape

```ts
type NamespaceId =
  | "hey-bradley-phases"
  | "hey-bradley-adrs"
  | "hey-bradley-decisions"
  | "hey-bradley-learnings"
  | "hey-bradley-tasks"
  | "hey-bradley-strategic";

type EntryType = "semantic" | "pattern" | "procedural" | "episodic" | "working";

interface RuvectorEntry {
  id: string;             // entry_{tsMs}_{rand6}  e.g. entry_1777446653612_55f641
  namespace: NamespaceId; // closed enum (§2)
  key: string;            // stable kebab-case identifier; UNIQUE within namespace
  type: EntryType;        // semantic for facts; pattern for keep/drop/reframe; episodic for events
  content: string;        // ≥ 200 chars, structured paragraph (§4)
  tags: string[];         // ≥ 3 tags, dimension:value form (§3)
  metadata: EntryMetadata; // structured fields per namespace (§5)
  embedding: null;        // populated by re-index phase; NOT written here
}
```

The shape maps directly onto `memory_entries` columns from `.swarm/schema.sql`:
`id`, `key`, `namespace`, `content`, `type`, `embedding (NULL)`, `tags (JSON-encoded array)`, `metadata (JSON-encoded object)`. `embedding_model`, `embedding_dimensions`, `created_at`, `updated_at`, `access_count`, `status` use schema defaults. `owner_id` left NULL.

---

## §2. Namespaces (closed list — exactly 6)

| Namespace | Purpose | Expected row count (P15-P57) |
|---|---|---|
| `hey-bradley-phases` | One summary per sealed phase | ~43 (P15-P57) |
| `hey-bradley-adrs` | One row per Accepted ADR | ~79 (gaps documented) |
| `hey-bradley-decisions` | Architectural / locked-decision moments (Sprint J D1-D9, KISS pivots, etc.) | ~80-120 |
| `hey-bradley-learnings` | Keep / Drop / Reframe rows distilled from retros | ~120-150 |
| `hey-bradley-tasks` | Agent-level work units worth preserving (named waves, multi-agent dispatches) | ~40-60 |
| `hey-bradley-strategic` | Strategic reviews + product evals + roadmap docs | ~10-15 |

No new namespaces without an ADR.

---

## §3. Tag dimensions (closed prefix list)

Every entry SHOULD use ≥ 3 tags drawn from these dimensions (a tag is `dimension:value`):

| Dimension | Allowed values | Notes |
|---|---|---|
| `phase:` | `P15` … `P58` | Always include for phase / adr / decision / learning / task entries. |
| `sprint:` | `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M` `N` `O` (P15-22 are pre-sprint, may omit) | Use sprint code only. |
| `domain:` | `ui` `backend` `adr` `test` `infra` `aisp` `llm` `mobile` `a11y` `byok` | Pick the closest single domain. |
| `atom:` | `PATCH` `INTENT` `SELECTION` `CONTENT` `ASSUMPTIONS` | Use only when the entry is about a specific Crystal Atom. |
| `priority:` | `moat` `polish` `debt` | `moat` for the four moat priorities (speed/spec/templates/share/RC); `polish` for UX nicities; `debt` for tech-debt closures. |
| `severity:` | `must` `should` `nice` | Optional; use in review/learning rows. |

Free-text tags are allowed in addition (e.g. `byok`, `voice`, `clipboard`) but the prefix dimensions above are preferred.

---

## §4. Content structure (every entry)

Every `content` string MUST follow this 6-line layout. Paragraph form is fine; the layout is a checklist, not literal headings.

1. **Title line** (≤ 100 chars) — what is this entry about, in one sentence.
2. **Context** (1-3 sentences) — what was the situation / prior state?
3. **What was done** (1-3 sentences) — concrete actions, files, ADRs.
4. **Why** (1-2 sentences) — rationale or constraint that drove the choice.
5. **Outcome** (1-2 sentences) — what shipped / what was measured / score.
6. **References** — comma-separated cross-refs (commits, ADR numbers, file paths). At least 1 cross-ref required.

Quality bar:
- `content.length ≥ 200` chars.
- `tags.length ≥ 3`.
- ≥ 1 cross-reference present in the References line.
- No 10-word posts. No empty metadata.

---

## §5. Metadata fields by namespace

All metadata values are JSON-serializable. Required keys per namespace:

| Namespace | Required metadata keys |
|---|---|
| `hey-bradley-phases` | `phase` (e.g. `"P50"`), `sprint` (e.g. `"J"`), `composite` (number 0-100), `tests` (string like `"234/234"`), `commit` (short hash), `started_at` (ISO date), `sealed_at` (ISO date), `related_files` (string[]) |
| `hey-bradley-adrs` | `adr_number` (int), `phase` (string), `status` (`"Accepted"` \| `"Stub"` \| `"Superseded"`), `line_count` (int), `cross_refs` (string[] of related ADR ids) |
| `hey-bradley-decisions` | `phase` (string), `locked_at` (ISO date), `alternatives_considered` (string[]), `related_adrs` (string[]) |
| `hey-bradley-learnings` | `phase` (string), `type` (`"keep"` \| `"drop"` \| `"reframe"`), `source_doc` (path) |
| `hey-bradley-tasks` | `phase` (string), `agent` (string id e.g. `"A1"` or `"R3"`), `scope_files` (string[]), `outcome` (`"shipped"` \| `"partial"` \| `"timeout"`) |
| `hey-bradley-strategic` | `review_date` (ISO date), `scope` (string), `score` (string, optional, e.g. `"B-"`), `recommendation_rank` (int 1-10, optional) |

Validators only assert "metadata is an object with ≥ 1 key" (cheap gate). Population scripts SHOULD populate all required keys.

---

## §6. Worked-example pointers

The 5 sample entries live at `plans/strategic-reviews/ruvector-sample-entries-2026-04-29.json`:

| # | Namespace | Key | Source documents |
|---|---|---|---|
| 1 | `hey-bradley-phases` | `p15-phase-summary` | `plans/implementation/phase-15/{README,session-log,retrospective}.md` |
| 2 | `hey-bradley-adrs` | `adr-045-patch-atom` | `docs/adr/ADR-045-system-prompt-aisp.md` |
| 3 | `hey-bradley-decisions` | `sprint-j-option-b-composition` | `plans/implementation/sprint-j-personality/03-sprint-j-locked.md` (D1) |
| 4 | `hey-bradley-learnings` | `sprint-j-stream-timeout-pattern` | `plans/implementation/phase-52/retrospective.md` (Drop / Reframe) |
| 5 | `hey-bradley-strategic` | `2026-04-29-product-evaluation-b-minus` | `plans/strategic-reviews/2026-04-29-product-evaluation.md` |

---

## §7. Verification

Validator: `scripts/ruvector-validate-entry.py`. Run against the samples:

```
$ python3 scripts/ruvector-validate-entry.py plans/strategic-reviews/ruvector-sample-entries-2026-04-29.json
PASS: 5/5 entries valid (file: plans/strategic-reviews/ruvector-sample-entries-2026-04-29.json)
```

Exit code 0 = all entries pass schema. Exit code 1 = errors listed line-by-line.

---

## §8. Out of scope

- Writing rows to `memory.db` (population mini-phase owns this).
- Schema.sql changes (locked).
- Embedding computation / re-index (separate sub-phase per `ruvector-fix-2026-04-29.md` §6).
- More than the 6 namespaces above.

## Status

- [x] Schema defined (single source of truth for population pass)
- [x] Namespaces closed (6)
- [x] Tag dimensions closed (6 prefixes)
- [x] Content structure required (6-section layout, ≥ 200 chars)
- [x] Metadata fields enumerated per namespace
- [x] 5 sample entries shipped
- [x] Validator shipped + 5/5 PASS

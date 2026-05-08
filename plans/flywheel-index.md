# Flywheel Index

> The 3-repo flywheel underneath Hey Bradley. Reference doc — read this when you need to know which upstream owns what, and how to (re-)init each one.

**Last verified:** 2026-05-08 (P121 HITL gate)

---

## 1. Repos at a glance

| Repo | Path / URL | Role | Pin status |
|---|---|---|---|
| **AISP** | [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core) | Math-first neural-symbolic protocol — the spec contract used end-to-end through Hey Bradley | Reference-only (NOT a submodule); same author (Bradley Ross) |
| **RuVector** | `upstreams/ruvector` · [ruvnet/RuVector](https://github.com/ruvnet/RuVector) | Self-learning vector + GNN memory DB (Rust + WASM). Runtime memory backend; HNSW search planned for Tier-2 | Submodule, shallow, pinned at `1078cc54` (`heads/main` at submodule add) |
| **RuFlo** | `upstreams/ruflo` · [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | Multi-agent orchestration platform for Claude Code (formerly claude-flow). Powers swarm spawning + hooks + memory + MCP | Submodule, shallow, pinned at `a101c2a0` (v3.5.71) |

> P121 directive: leave submodule pointers as-is for the v2.0.0-RC1 merge; refresh in a separate commit post-merge.

---

## 2. Init / verify

### One-shot (clone with submodules)

```bash
git clone --recurse-submodules --shallow-submodules https://github.com/bar181/hey-bradley-core
cd hey-bradley-core
```

### Existing clone

```bash
git submodule update --init --depth 1
git submodule status   # confirm both submodules show a commit hash + tag/branch
```

Expected output:
```
+a101c2a086211b5618cfe2e69b6458473f2dd8e0 upstreams/ruflo (v3.5.78~7)
+1078cc54e30e662dd7a4806b6d6089999aac06dc upstreams/ruvector (heads/main)
```

The leading `+` means "submodule is at a different commit than recorded in the parent." That's expected here because the project intentionally pins to `main` and refreshes deliberately.

### Refresh to latest upstream main

```bash
git submodule update --remote --depth 1 upstreams/ruvector
git submodule update --remote --depth 1 upstreams/ruflo
git add upstreams/ruvector upstreams/ruflo
git commit -m "chore: bump flywheel submodules to latest upstream main"
```

Do this **only** in a dedicated bump commit, never bundled with feature work — keeps `git log` honest about why a pointer moved.

### AISP (no submodule)

AISP is referenced, not vendored. Sources of truth:

- Public repo: https://github.com/bar181/aisp-open-core
- Local reference doc: `plans/initial-plans/00.aisp-reference.md`
- Adoption guide tree: `docs/aisp-adoption/00-getting-started.md` … `02-reference-implementation-walkthrough.md`
- Polyglot reference impl: `examples/3rd-party-consumer/` (TS + Python)

If AISP needs to be vendored later (e.g. for offline LLM-first deployments), add as a third submodule under `upstreams/aisp-open-core`.

---

## 3. Role of each repo in the Hey Bradley pipeline

```
User input (chat / voice)
  ↓
RuFlo  ─── orchestration layer (spawns agents, routes tasks, runs hooks)
  ↓
AISP   ─── spec layer (Crystal Atoms — INTENT, SELECTION, CONTENT, PATCH, etc.)
  ↓
Hey Bradley  ─── pipeline (chatPipeline.ts, atom modules, template matcher)
  ↓
RuVector  ─── memory + retrieval (currently static; HNSW activation Tier-2)
  ↓
JSON-Patch  ─── output contract (Zod-validated, applied by store, React redraws)
```

- **RuFlo** is *how* work happens (multi-agent execution).
- **AISP** is *what* the spec says (symbolic contract).
- **RuVector** is *what we remember* (vector memory + learning loop).
- **Hey Bradley** is the *product* — the JSON renderer + spec factory that ties them together.

---

## 4. When does each one matter?

| Scenario | RuFlo | AISP | RuVector |
|---|---|---|---|
| User types a sentence in Builder | — | YES (INTENT_ATOM classifies) | partial (template matcher reads catalog) |
| Spawning a parallel coder swarm | YES | — | partial (memory recall) |
| Generating a spec bundle for export | — | YES (8 atoms compose the bundle) | — |
| Live LLM smoke test (BYOK) | — | YES (system prompt is AISP-shaped) | — |
| Phase retrospective lookup | — | — | YES (manual key/value snapshots) |
| Tier-2: cross-session learning loop | — | — | YES (HNSW + GNN — not yet activated) |

---

## 5. Carry-forwards / status flags

| Item | Status | Owner |
|---|---|---|
| RuVector HNSW activation | Tier-2 deferred — index built, 0 vectors loaded | post-PMF commercial work |
| RuFlo submodule bump (v3.5.71 → latest) | Deferred to post-RC merge commit | owner |
| AISP arXiv preprint | Time-sensitive — capstone committee directive | owner |
| AISP adoption metrics | Unmeasured — no telemetry on `examples/3rd-party-consumer/` | accept until external user signals |

---

## 6. Don't break this

1. Submodule pointers are **deliberately stale** — never auto-bump in feature commits.
2. AISP is **the contract**, not a dependency — copies of AISP atom shapes inside `src/contexts/intelligence/aisp/` are intentional. Treat the upstream as the spec, not the source.
3. The `.swarm/` and `.claude-flow/` runtime directories at repo root are **manually curated static snapshots** of RuVector/RuFlo state. They are not authoritative. Treat them as caches.
4. If `npm run dev` fails with WASM 404s, run `node scripts/copy-sqljs-wasm.mjs` (auto-fired by `predev` since P121).

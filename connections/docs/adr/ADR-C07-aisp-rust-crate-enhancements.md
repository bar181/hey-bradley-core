# ADR-C07: AISP Rust Crate Enhancement Scope

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-122 (Export Claude Code markdown bundle), ADR-134 (atom→view inversion fix), ADR-119 (DDD_ATOM), ADR-120 (AGENT_ATOM), ADR-C04 (MCP `validate_aisp` tool), ADR-C05 (NPX `score` command), ADR-C06 (shared MCP codebase)

## Context

The connections layer needs an AISP validator that runs in three places: the browser-side Hey Bradley workbench, the Node-hosted MCP server (stdio + Streamable HTTP per ADR-C06), and the Claude Code plugin runtime (ADR-C01 / ADR-C04). Phase 1 §6 open question 1 left three implementation paths on the table — npm `aisp-validator` (Node-only), Rust `aisp` crate on crates.io (native binary, "Fastest performance" per upstream README), or a WASM bundle of the Rust crate. `inventory-mcp-aisp.md` §B4 confirms the published `aisp` crate already ships the engine pieces (`∂` tokenize / `Γ?` proof search / `δ` density / `⌈⌉` tier) and Phase 4 calls for **four NEW surfaces** built on top: Crystal Atom builder, DDD extractor, CLAUDE.md formatter, ambiguity diff. This ADR records the runtime path AND scopes the four enhancements; no Rust code lands here — Phase 4 implements per these constraints. Decisions D2-D5 (the four new surfaces) depend on coordination with `bar181/aisp-open-core` upstream — D7 records that policy.

## Decisions

### D1 — Validator runtime: WASM bundle of Rust `aisp-core` crate

Adopt **Option C** from Phase 1 §6 Q1. The Rust crate is the single source of truth for the engine (already published per `inventory-mcp-aisp.md` §B4); compiling it to `wasm32-unknown-unknown` with `wasm-bindgen` lets the same binary run in browser, Node (NPX + MCP server stdio per ADR-C04), and the Claude Code plugin context. Rejecting Option A (npm `aisp-validator`) because it forks the parser surface and creates JS-port drift versus upstream Rust. Rejecting Option B (native Rust binary) because shipping platform-specific binaries through NPX (macOS-arm/macOS-x64/linux/windows matrix) multiplies install paths; WASM is one artifact. Binary-size budget: **≤500KB compressed** (verified at Phase 4 build gate; if exceeded, the budget is raised in a follow-up ADR or the crate is split — no silent overrun).

### D2 — Crystal Atom builder API

New Rust function exposed via WASM:

```rust
build_crystal_atom(input: { atom_name, sigma, gamma, lambda, epsilon }) -> CrystalAtom
```

Returns AISP-compliant text in the full sequence per `inventory-mcp-aisp.md` §B1: `𝔸 ≫ ⟦Ω⟧ ≫ ⟦Σ⟧ ≫ ⟦Γ⟧ ≫ ⟦Λ⟧ ≫ ⟦Ε⟧`. Each block validated **before** assembly; if any block scores `Ambig ≥ 0.02` the function returns `Err(AmbigBudgetExceeded { block, ambig })` per the production hard-constraint cited in `inventory-mcp-aisp.md` §B2 (`∀D ∈ AISP: Ambig(D) < 0.02`). This replaces the eight per-atom `buildXAtom()` TS helpers in `src/contexts/intelligence/aisp/` for the Bronze/Silver-tier deterministic path; LLM-enrichment keeps living in TS (D7).

### D3 — DDD context extractor

New Rust function:

```rust
extract_ddd_contexts(prose: &str) -> DomainModel
```

Pure NLP using rule-based heuristics — **no LLM call** (LLM-enrichment stays in `src/`, see D7). Output shape mirrors the `DomainModel` interface exported by `src/contexts/intelligence/aisp/dddAtom.ts` so downstream renderers (`DomainModelSVG.tsx` per ADR-119) consume both Rust and TS outputs without a translation shim. Targets Bronze/Silver tier (`δ ≥ 0.20` / `δ ≥ 0.40` per `inventory-mcp-aisp.md` §B2 tier ladder); Gold/Platinum density requires LLM enrichment which stays upstream of the WASM call.

### D4 — CLAUDE.md formatter

New Rust function:

```rust
format_claude_md(spec: AispBundle) -> String
```

Emits the markdown bundle with `# === FILE: <path> ===` markers per ADR-122 D2 (single `.md`, ≥6 logical files: CLAUDE.md preamble + process-map + human-spec/{north-star,sadd,implementation-plan} + aisp/phase-aisp + adrs/ADR-{id} + agents/wave-{n}). Mirrors `buildClaudeCodeBundle()` shape (`src/contexts/specification/exportClaudeCode.ts:203`) but **without React-bound transitive imports** — that is the entire point of putting it in Rust (pure-module discipline per ADR-134; the TS path currently uses `processMapTypes.ts` + `types.ts` neutral type modules to satisfy the same invariant, and the Rust port carries it forward natively).

### D5 — Ambiguity diff function

New Rust function:

```rust
ambig_diff(spec_a: &str, spec_b: &str) -> AmbigDiff
```

Computes `(ambig_a, ambig_b, delta_ambig)` plus per-block deltas (Ω/Σ/Γ/Λ/Ε). Use case: regression-test Hey Bradley specs in CI — fail the build if `delta_ambig > 0` on a spec edit (ambiguity must monotonically decrease toward the `< 0.02` production gate). Complements the existing P109 section-enum drift guard and slots into the same CI lane. Output is structured (per-block array) so callers can surface "Ambig regressed in Γ" rather than "Ambig regressed somewhere" in CI summary lines.

### D6 — Crate publishing + versioning

Crate published as **`aisp-core`** (Hey Bradley fork prefix if upstream `bar181/aisp-open-core` declines D2-D5 contributions, see D7; preferred as a Hey-Bradley-side companion crate `aisp-bridge` under that fork). Hey Bradley pins to a **specific crate version** in `connections/aisp-core/Cargo.toml` (workspace member if a workspace lands; otherwise standalone). WASM build target: `wasm32-unknown-unknown` with `wasm-bindgen` for JS interop. Publish flow: `cargo publish` → `wasm-pack build --target nodejs` (and `--target web` for browser surface) → `npm publish` wrapper package **`@bar181/aisp-core-wasm`** (or `@hey-bradley/aisp-core-wasm` if scope availability differs). Version stamping echoes the AISP convention `𝔸X.Y.name@YYYY-MM-DD` in the wrapper package version field for traceability against `𝔸5.1.Platinum@2026-01-09` per `inventory-mcp-aisp.md` §B3.

### D7 — Upstream contribution policy

D2-D5 surfaces likely benefit `bar181/aisp-open-core` (the Crystal Atom builder + DDD extractor + CLAUDE.md formatter + Ambig diff are all generic AISP tooling, not Hey-Bradley-specific). Policy per surface:

1. **Open issue/PR upstream first** — the four functions are scoped as upstreamable.
2. **If accepted upstream** — Hey Bradley imports from upstream `aisp` crate, bumps pin in `Cargo.toml`, and `aisp-bridge` companion shrinks to bindings-only.
3. **If declined upstream** — keep as Hey Bradley fork at `connections/aisp-core/` (companion crate; published independently). Maintain a fork-vs-upstream patch log to make eventual upstream adoption tractable.
4. **LLM-enrichment paths stay in `src/`** — the eight per-atom `buildXAtom()/parseXResponse()` LLM-handoff scaffolding (CF#4 owner-required per ADR-131) is deliberately NOT Rust-portable. Rules-based deterministic baseline = Rust crate; LLM enrichment = TS (where the AgentProxy invocation surface lives per `inventory-existing.md` finding 4).

## Consequences

**Positive**

- One validator binary across browser + Node + plugin = single source of truth (no JS-port drift; same `Ambig` arithmetic everywhere)
- Rust crate already ships `∂/Γ?/δ/⌈⌉` engine — D2-D5 only add **builder/extractor/formatter/diff** layers on top, not a re-implementation
- WASM ≤500KB compressed budget keeps NPX install lean and browser bundle per ADR-102 ≤800KB gzip cap
- Pure-module discipline preserved — the Rust port enforces ADR-134's atom→view inversion fix natively (no `src/components/` import is even possible from Rust)
- Upstream-first contribution policy (D7) keeps Hey Bradley aligned with AISP open-core long-term

**Negative**

- WASM build adds ~30s to CI (`wasm-pack build` + size check + smoke test); acceptable on the connections-layer cadence
- D2-D5 timeline depends on upstream maintainer cadence (D7) — if upstream is slow, Hey Bradley ships from the fork and back-merges later, doubling the maintenance surface temporarily
- LLM-enrichment paths stay split between Rust (rules) and TS (LLM); two-codebase boundary that future contributors must respect — codified in D7 to make the boundary explicit
- Rust + WASM build toolchain is a new CI dependency for Hey Bradley (was TS-only); CI image grows by `rustup` + `wasm-pack` + `wasm-bindgen-cli` install steps

## Cross-refs

- **ADR-122** (Export Claude Code Markdown Bundle) — D4 mirrors this exporter's contract without the React-bound deps
- **ADR-134** (Dead-code purge + atom→view inversion fix) — D4 carries the pure-module discipline natively in Rust
- **ADR-119** (DDD_ATOM) — D3 output `DomainModel` shape mirrors this atom's TS output
- **ADR-120** (AGENT_ATOM) — D2 builder pattern covers all 8 atoms; AGENT is the validation surface that exercises Γ R3 disjoint-ownedFiles
- **ADR-C04** (MCP `validate_aisp` tool) — consumes the WASM validator from D1 over the MCP tool surface
- **ADR-C05** (NPX `score` command) — consumes the WASM validator from D1 over the NPX command surface
- **ADR-C06** (Shared MCP codebase) — same WASM artifact loaded in both stdio + Streamable HTTP deployment targets

## Open questions deferred

- LLM-enrichment paths stay in `src/` per D7 — review at `aisp-core` v0.2.0 to see if any rules-based heuristic should accept an optional LLM-augmentation hook in the Rust API surface (today: no; rules-only)
- Upstream contribution timeline — depends on `bar181/aisp-open-core` maintainer cadence per D7; if upstream PR is open for >60 days without merge, ship from Hey Bradley fork and revisit at v0.2.0
- Crate name conflict resolution — if `aisp-core` is already taken on crates.io, fall back to **`aisp-bridge`** (Hey-Bradley-side companion crate name); decided at Phase 4 publish time, not earlier
- Browser-vs-Node WASM target split — D6 names both `--target web` and `--target nodejs` outputs; whether they ship as one wrapper package with conditional exports or two separate packages is a Phase 4 packaging decision
- Per-block density (`δ`) function exposure — the engine computes it for the tier-classifier output; whether to expose `δ_per_block(spec) -> Map<Block, f64>` as a sixth public function (alongside D2-D5) deferred to v0.2.0 based on observed CI-gate signal needs

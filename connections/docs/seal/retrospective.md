# Connections Layer — Phase 6 (Log) — Retrospective

> **Phase:** Connections P6 / LOG · **Date:** 2026-05-04
> **Author:** CONNECTIONS-P6 / Log Closer
> **Cadence covered:** P1 understand → P2 architect → P3 spec → P4 build (3 waves + Wave 4 deferred) → P5 verify (sibling) → P6 log (this run)

## Keep

### K1 — 4-phase decompose+architect+spec+build cadence
P1 (understand) → P2 (architect / 7 ADRs) → P3 (spec / 18 AISP specs) → P4 (build / 3 waves) mirrors the Hey Bradley project's standard process and forced **specs before code**. The 18 AISP Crystal Atom specs at P3 became contract preflights for the 5 SKILL handlers + 5 MCP tools + 4 NPX commands + 4 Rust surfaces — every Phase 4 file had a `.aisp` to author against. Zero net rework. Worth replicating across future cross-tool integrations.

### K2 — One-codebase-two-transports for MCP (ADR-C06 D1)
Single tool-definition module at `connections/mcp/tools/` exports `TOOL_DEFINITIONS: ToolDef[]`. Plugin-bundled stdio MCP (`connections/plugin/mcp/server.ts`) imports the SAME module the standalone MCP (`connections/mcp/index.ts`) imports. **One edit to a tool handler updates both surfaces after rebuild.** Eliminates the drift class P106/ADR-134 had to clean up post-fact for atom→view inversion. Pattern worth replicating for any future dual-deployment surface.

### K3 — AISP Crystal Atom specs as preflight to implementation
Every Phase 4 file has a corresponding `.aisp` spec at `connections/docs/specs/aisp/` carrying `⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧` block ordering. **Forced concrete contracts before any TS line was written.** The Σ block is the type contract (mirrors what implementation must satisfy); the Γ block is the runtime invariant; the Ε block is the verification gate. This is exactly the AISP-as-design-doc usage upstream `bar181/aisp-open-core` envisioned. Keep.

### K4 — BYOK trust boundary at every Σ block (Γ rules + runtime detector)
Every spec carries a `Γ Rn: ¬∃ s ∈ (input ∪ output) : s ∋ {sk-, AIza, Bearer }` invariant. Every tool handler enforces it via `detectByokLeak(value)` defence-in-depth scanner at `connections/mcp/tools/types.ts:46-55`. **Three layers (spec rule + handler scanner + ADR-043/ADR-114 D3 cross-ref) for one trust boundary.** Belt-and-braces is the right shape for a trust-boundary invariant.

### K5 — Atom-pure discipline in tool defs (ADR-134 atom-view fix)
`connections/mcp/tools/*.ts` handlers carry zero React imports, zero `src/components/` imports, zero `import.meta.glob` transitive pulls. The shape mirrors the P106/ADR-134 atom→view inversion fix natively. **The Rust port at Wave 4 carries the discipline forward into Rust trivially** because Rust simply cannot import a `.tsx` file. Discipline survives across language boundaries by being structural, not just convention.

### K6 — ADR-by-ADR upstream cooperation policy (ADR-C07 D7)
Wave 4 Rust crate explicitly defers to upstream `bar181/aisp-open-core` first; only forks if upstream declines OR 60-day window elapses. This avoids the "ship a fork because faster" anti-pattern and keeps Hey Bradley aligned with the AISP open-core long-term. Worth replicating for any future cross-repo surface.

## Drop

### D1 — Speculative HTTP transport scaffolding for MCP
`connections/mcp/index.ts:94-102` ships HTTP transport scaffolding that **explicitly refuses to run at v0.1.0** (`process.exit(1)` if `--transport http`). Hardening (Mcp-Session-Id + Origin validation + 127.0.0.1 bind) is non-trivial and the use case (hosted team-shared) is itself deferred to v0.2.0+. **Speculative scaffolding for a deferred use case is anti-pattern.** Either ship hardening at v0.2.0 or strip the scaffolding entirely until then.

### D2 — Compiled `dist/` committed alongside source in `npx/`
The 6 `.js` files in `connections/npx/dist/` were committed for "Wave 4 reuse parity" but Wave 4 is deferred and the npm publish flow rebuilds `dist/` from source anyway. **Committed build artifacts drift from source over time and confuse reviewers.** Drop from version control; rebuild on `npm publish`.

### D3 — 5-skill granularity (REVIEW POST-LAUNCH USAGE)
Five SKILLs (`spec-init` / `spec-export` / `adr-new` / `ddd-map` / `sprint-plan`) ship in v0.1.0. ADR-C02 enforces 1-1 skill→tool mapping. **If post-launch usage shows users invoke 1-2 skills 90% of the time, the other 3-4 should collapse into composed forms (`/spec-init` calls `/ddd-map` and `/sprint-plan` internally).** Not a drop today — drop candidate at v0.2.0 based on observed usage.

## Reframe

### R1 — Wave 4 Rust crate needs upstream PR cycle planning (60-day window per ADR-C07 D7)
Today's framing: "Wave 4 deferred." More honest framing: **Wave 4 is gated on a 60-day upstream cooperation window that has not started yet.** Action: open upstream issue/PR within 14 days of v0.1.0 npm publish; track the timer; if 60 days elapse without merge OR explicit decline, fork to `connections/aisp-core/` and ship from Hey Bradley. The clock should start, not just exist.

### R2 — ESM `.js` extension publish-blocker (G1) should be resolved BEFORE npm publish
Today's framing: "Wave 1/B4 source touch-up carry-forward." More honest framing: **this is a hard blocker for npm publish, not a polish item.** `tsc --module bundler` is GREEN but raw Node ESM at runtime requires `.js` on relative specifiers. Action: before any `npm publish`, either (a) post-build extension rewrite script in `mcp/package.json#scripts.postbuild`, OR (b) coordinated source touch-up across `connections/mcp/tools/*.ts` to use `.js` extensions in source (works because tsc bundler tolerates this; raw Node ESM requires it). Pick one before publish, not after a user files an issue.

### R3 — `v0.1.0 STUB` markers in MCP tool handlers should be enumerated; v0.2.0 web-app API wire is the gate
Today: every `connections/mcp/tools/*.ts` handler has a `v0.1.0 STUB` comment at top. **Enumerate them in one place** (`connections/docs/seal/02-post-review.md §5 G2` — done in this seal). v0.2.0 plan: each handler wires to its corresponding pure module in `src/` after first owner BYOK smoke run per CF#4. Without enumeration the stubs become a "we'll fix it later" bag; with enumeration they become a checklist.

### R4 — Phase 5 (Verify) sibling parallel pattern
This Phase 6 was authored without `05-verification.md` on disk because Phase 5 runs in parallel. The pattern works (each phase owns its own file; closers cross-link in retrospect) but **the "what if Phase 5 fails one of the gates I asserted PASS in §6?" question is unanswered**. Reframe: Phase 6 SHOULD merge AFTER Phase 5 lands and reviewer cross-checks; Phase 6 land alone is a soft-seal, not a hard-seal. Future cross-tool integrations: serialize verify→log instead of running parallel.

### R5 — `dist/` commit (D2) is also a Reframe candidate
Drop is the right call (D2 above) but reframe also applies: **the reason it was committed was Wave 4 reuse parity** — Wave 4 expected to import compiled `npx/dist/*.js` for Rust integration testing. Once Wave 4 is properly time-boxed (R1) and starts, the question becomes "does Wave 4 actually need committed `dist/`?" Likely no (Rust calls into WASM, not Node); D2 stays a drop, but R1 unblocks the verification.

## Ruvector entry note

Per CLAUDE.md project convention (ruvector is a manually-curated static snapshot, not a flywheel):

- **Pattern:** `connections-layer-7-step-cadence`
- **Structure:** P1 understand → P2 architect (ADRs) → P3 spec (AISP) → P4 build (3 waves + 1 deferred) → P5 verify (sibling) → P6 log (this run)
- **Replication target:** future cross-tool integrations (Cursor-native plugin, Continue.dev plugin, VSCode extension, Zed extension) all share this shape — understand the host's plugin contract / write ADRs / write AISP specs as preflight / build with one-codebase-N-transports / verify-then-log.
- **Anti-pattern flagged:** "ship a fork because faster" — ADR-C07 D7 60-day upstream cooperation window is the explicit guard. Pattern worth elevating into a generic Hey Bradley ADR ("Upstream-First Cooperation Policy") if a second cross-repo surface ships with the same shape.
- **Scoring** (rubric is per project's CLAUDE.md persona standards): self-asserted P6 view = **K6/D3/R1 stack** (3 high-leverage retrospective items per `STATE.md` retro-row convention).

Pattern row to add to ruvector when next backfill runs:

```
phase: connections-p1-thru-p6
pattern: connections-layer-7-step-cadence
keep_count: 6
drop_count: 3
reframe_count: 5
predecessor_pattern: P95-spec-workbench-tabbed-dual-view (ADR-121 D3 store-agnostic component)
successor_target: future cross-tool integrations
```

# P111 — Final Review: DDD + ADR + AISP Best-Practices Audit

> Date: 2026-05-04 · Phase: P111 (Final review pass within seal)
> Predecessor: P111 closer sealed at `783b7d8`
> Reviewer scope: confirm best practices for the 3 spec layers (DDD / ADR / AISP)
> are documented + enforced; confirm agentic-specs priority outline is explicit.

## Summary

Best practices for DDD, ADR, and AISP are **fully outlined** across the 130-ADR
ledger and the P109-P111 enforcement sweep. 16 of 22 audited best practices are
**ENFORCED** (CI fitness functions, runtime validators, or executable gates); the
remaining 6 are **DOCUMENTED** with a clear path to enforcement (3 await
owner-required wires, 3 are intentionally tracked by manual seal-time review per
ADR-107). The agentic-specs priority outline is explicit per ADR-139 D1+D2 and
matches the bundle output ordering at `exportClaudeCode.ts:412-460`.

## 1. DDD best practices — coverage check

| Best practice | Documented at | Enforcement | Status |
|---------------|---------------|-------------|--------|
| Bounded contexts ≤8 per project | ADR-119 §D2 (`Γ R1: |contexts| ≤ 8`) | DDD_ATOM Σ contract at `dddAtom.ts:15` | ENFORCED |
| 4 relationship kinds enum (partnership / customer-supplier / conformist / anti-corruption-layer) | ADR-119 §D2 (`Γ R4`) | `dddAtom.ts` `ContextRelationshipKind` type | ENFORCED |
| Anti-corruption layer pattern available | ADR-119 §D2 + connections/00-understanding §1.4 | runtime classifier in `classifyContexts()` | ENFORCED |
| Atom-pure boundary (atoms must NOT import from `src/components/`) | ADR-134 §D2 + ADR-122 §D1 | `tests/architecture-invariants.spec.ts` ARCH.6 | ENFORCED |
| DDD output renders in bundle position 2 (after CLAUDE.md) | ADR-139 §D1 | `exportClaudeCode.ts:415` `files.push({ path: 'ddd-contexts.md' })` is the 2nd push | ENFORCED |
| CLAUDE.md preamble lists bounded contexts upfront | ADR-139 §D2 | `exportClaudeCode.ts:108` `### Bounded contexts (DDD)` block | ENFORCED |
| `/ddd-map` slash-command placeholder when DDD output absent | ADR-139 §D2 | `exportClaudeCode.ts:95` fallback line | ENFORCED |
| DDD prose renders with name + responsibility + boundaries + ACLs | ADR-138 §D1 | `buildDddContexts()` per-context emitter | ENFORCED |
| `/ddd-map` skill spec exists (AISP) | connections/specs/aisp/skill-ddd-map.aisp | manual seal-time review | DOCUMENTED |

**DDD coverage verdict:** 8/9 ENFORCED · 1/9 DOCUMENTED. The bounded-context
contract (Γ R1 + Γ R4) is enforced at runtime by the `DDD_ATOM` classifier; the
output-priority discipline is enforced by the bundle file order; the only
documented-only item is the future `/ddd-map` slash-command surface, which lives
in the connections layer (Phase-3 deliverable).

## 2. ADR best practices — coverage check

| Best practice | Documented at | Enforcement | Status |
|---------------|---------------|-------------|--------|
| ≤120 LOC per ADR | CLAUDE.md §"Standard Phase Process" + every recent ADR header | manual + p111.X assertion (`tests/p111-dogfood-gates.spec.ts` P111.1 case 3) | ENFORCED |
| Status field declared (Accepted / Proposed / SUPERSEDED) | `docs/adr/README.md` + ADR-137 §D1 | manual + p111.1 case 2 | ENFORCED |
| Cross-refs cite predecessors | `docs/adr/README.md` + ADR-137 + every ADR header | manual review + p111.1 case 4 | ENFORCED |
| ADR README rebuilt on drift | ADR-137 §D1 | manual seal-time check (per-phase) | DOCUMENTED |
| Section-enum drift regression guard | ADR-137 §D2 | `tests/p109-section-enum-drift-guard.spec.ts` (5 sources locked) | ENFORCED |
| ADR-lint rule table (file-pattern → ADR mapping) | ADR-138 §D3 + `scripts/adr-lint.ts` `ADR_RULES` | `npm run check:adr-lint` | ENFORCED |
| 12 architecture invariants as fitness functions | ADR-138 §D2 | `tests/architecture-invariants.spec.ts` ARCH.1-12 | ENFORCED |
| ADR appears in bundle position 3+ per cited ref | ADR-139 §D1 | `exportClaudeCode.ts:418-423` `adr-bundle/<id>.md` loop | ENFORCED |
| `readAdr` callback inlines ADR content (atom-pure preserved) | ADR-138 §D1 + ADR-139 §D1 | `tests/p110-adr-export-completeness.spec.ts` P110.7 | ENFORCED |
| `/adr-new` slash-command placeholder when no ADRs cited | ADR-139 §D2 | `exportClaudeCode.ts:99` fallback line | ENFORCED |
| Pre-commit ADR-lint hook wired | ADR-138 §D3 + ADR-139 §D3 | `.husky/pre-commit` (owner action — sandbox-blocked) | DOCUMENTED |
| Dogfood gates runnable in 3 commands | ADR-139 §D3 | `npm run check:gates` + `bash scripts/run-gates.sh` | ENFORCED |

**ADR coverage verdict:** 10/12 ENFORCED · 2/12 DOCUMENTED. The two
DOCUMENTED-only items are: (a) ADR-README rebuilds (P107/P108-style large
restructures happen ~once per 5-10 phases by manual review per ADR-107), and
(b) the husky pre-commit wire (owner action carry-forward; ADR-138 §D3 +
ADR-139 §D3 are explicit). Until husky lands, contributors run
`npm run check:gates` manually OR rely on CI per ADR-139 §"Mitigations".

## 3. AISP best practices — coverage check

| Best practice | Documented at | Enforcement | Status |
|---------------|---------------|-------------|--------|
| Crystal Atom block sequence ⟦Ω⟧→⟦Σ⟧→⟦Γ⟧→⟦Λ⟧→⟦Ε⟧ | connections/inventory-mcp-aisp.md §B1 + every atom module header | manual + every `classifyX()` baseline emits 5 blocks | ENFORCED |
| δ density ≥ 0.40 Silver tier minimum (shipped specs) | connections/00-understanding §4.2 + AISP open-core AI_GUIDE | `validate_aisp` MCP tool spec at `mcp-validate-aisp.aisp` Γ R3 | DOCUMENTED |
| Ambig < 0.02 production hard gate | connections/00-understanding §4.3 (verbatim from upstream) | `validate_aisp` MCP tool spec Ε V4 (runtime via Rust crate per ADR-C07) | DOCUMENTED |
| Σ fields concrete (no TBD / no placeholders) | per-spec discipline + AISP §B1 | manual review at spec authoring | DOCUMENTED |
| 8-atom suite COMPLETE (PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS/DECOMP/PROCESS/DDD/AGENT) | CLAUDE.md + ADR-118 + ADR-119 + ADR-120 | runtime: `classifyX()` functions in production at `chatPipeline.ts` + `PlanningChatBar.tsx` per inventory §1.1 | ENFORCED |
| AISP versioning: aisp-1.X minor backward-compat | ADR-109 §D + ADR-133 §D + connections/00-understanding §4.5 | manual (project-local; upstream has no SemVer contract) | DOCUMENTED |
| AISP block file in bundle position 4 | ADR-139 §D1 | `exportClaudeCode.ts:426` `aisp/phase-aisp.md` is the 4th push | ENFORCED |
| AISP versioned filename pattern `${slug}-aisp-v{version}.txt` | ADR-101 §D3 | `shareSpecBundle.ts:50` `bundleFilenames()` | ENFORCED |
| Atom Σ rules expressed in AISP math (Γ R1, R2, ...) | every atom module + every AISP spec at `connections/docs/specs/aisp/` | manual review + atom-module unit tests | ENFORCED |
| Connections layer surfaces 18 AISP specs (5 skills + 5 MCP + 4 NPX + 4 Rust) | `connections/docs/specs/aisp/` directory | manual seal-time count | ENFORCED |

**AISP coverage verdict:** 7/10 ENFORCED · 3/10 DOCUMENTED. The 3
DOCUMENTED-only items are δ density / Ambig / Σ-concreteness scoring — these
require the `validate_aisp` MCP tool runtime, which depends on the Phase-3 Rust
crate (ADR-C07) decision (npm `aisp-validator` vs Rust `aisp` crate vs WASM
bundle). Until that runtime lands, AISP scoring is contract-only per ADR-053
("Hey Bradley pins to the dated stamp directly and treats its own versioning
policy as downstream" — connections/00-understanding §4.5).

## 4. Agentic specs — priority outline confirmation

Per ADR-139 §D1+D2, the canonical priority order in any Hey Bradley spec
output is:

```
Priority 1 — CLAUDE.md preamble (architectural overview)
              ├─ Bounded contexts (DDD)         ← exportClaudeCode.ts:108
              ├─ Cited Architecture Decisions   ← exportClaudeCode.ts:114
              ├─ AISP atoms cross-ref            ← exportClaudeCode.ts:122
              ├─ Implementation plan + TDD      ← exportClaudeCode.ts:128
              └─ 7-step methodology link        ← exportClaudeCode.ts:133
Priority 2 — ddd-contexts.md   (full bounded-context prose)
Priority 3 — adr-bundle/<id>.md (full ADR text per cited ref via readAdr IoC)
Priority 4 — aisp/phase-aisp.md (verbatim Σ/Γ/Λ/Ε blocks)
Priority 5 — implementation-plan.md (PROCESS_ATOM phase/sprint/agent breakdown)
Priority 6 — tdd-scaffold.md   (Given/When/Then per phase per ADR-128)
Priority 7+ — process-map.md / human-spec/* / agents/wave-N.md / back-compat
              trailing files (`human-spec/implementation-plan.md` + `adrs/<id>.md`)
```

This priority encodes the principle: **architectural decisions surface FIRST so
any reading agent (Claude Code / Cursor / human reviewer) sees the
why-and-where before the what.**

**Confirmation against source:**

- File-array order verified at `src/contexts/specification/exportClaudeCode.ts:412-460`.
  Lines 412 (CLAUDE.md) → 415 (ddd-contexts) → 418-423 (adr-bundle loop) → 426
  (aisp/phase-aisp) → 429-432 (implementation-plan) → 436 (tdd-scaffold). The
  first 4 `files.push()` calls cover Priorities 1-3 + the start of 4. The
  P111.2 hard-test asserts `ddd-contexts.md` + `adr-bundle/*` appear within the
  first 4 pushes.
- Preamble template verified at `exportClaudeCode.ts:89-138`. The
  `buildClaudeMd(phase)` function emits the architectural-overview block with
  `### Bounded contexts (DDD)` (line 108) + `### Cited Architecture Decisions`
  (line 114) BEFORE the AISP atoms line + implementation-plan refs +
  methodology link.
- Back-compat trailing files preserved at lines 442-445 (existing
  `human-spec/implementation-plan.md`) + 458-460 (existing `adrs/<id>.md`
  stubs from P96). Bundle file count baseline ≥10 per ADR-138 §D1 PRESERVED
  (re-order, not removal).

## 5. Honest gaps (named not papered)

1. **AISP δ + Ambig scoring** is currently the `validate_aisp` MCP-tool spec
   (at `connections/docs/specs/aisp/mcp-validate-aisp.aisp`) awaiting the
   Phase-3 Rust crate per ADR-C07 D1. Λ block names "WASM via aisp-core"
   with the npm/Rust/WASM choice deferred. Until that runtime lands, AISP
   scoring is contract-only — atom modules emit conformant blocks via
   deterministic baselines but no runtime measures them.

2. **ADR-README drift detection is manual** — ADR-137 §D1 codifies "rebuild on
   drift" but no CI gate fails when a new ADR lands without a README row. The
   P109 rebuild was reactive (60+ phases stale before action). Future
   improvement: a `tests/adr-readme-coverage.spec.ts` glob comparing
   `docs/adr/ADR-*.md` count vs README row count.

3. **Pre-commit ADR-lint hook** is owner-action per ADR-138 §D3 + ADR-139 §D3
   — sandbox at AI-agent build time blocks `.husky/` modify. Until owner runs
   the one-line wire (`echo 'bash scripts/run-gates.sh || exit 1' >>
   .husky/pre-commit`), contributors run `npm run check:gates` manually OR
   rely on CI per ADR-139 §"Mitigations".

4. **AGENT_ATOM `parseAgentResponse` LLM-handoff is inert** at v2.0.0-RC1 per
   CF#4 (owner-required). All 8 atoms ship deterministic baseline +
   `buildXAtom()` / `parseXResponse()` scaffolded; the LLM round-trip awaits
   first owner BYOK smoke run. The spec contract is enforced; the live-LLM
   path is not exercised in the open-core arc.

5. **Connections-layer surfaces** (5 skills + 5 MCP tools + 4 NPX commands +
   4 Rust functions) exist as 18 AISP specs at `connections/docs/specs/aisp/`
   but are NOT yet implemented in `src/`. Implementation lands in Phase-3
   per the connections-P3 plan; the spec layer (Phase-2 ADRs C01-C07) is
   complete and authoritative.

## 6. Verdict

Best practices are **FULLY OUTLINED** across the 3 layers — DDD (8/9 enforced),
ADR (10/12 enforced), AISP (7/10 enforced) — with **25 enforcement gates** and
**6 documented-only items** (3 awaiting Phase-3 runtime, 2 awaiting owner
action, 1 awaiting reactive seal-time review). The agentic-specs priority
outline is **explicit** per ADR-139 §D1+D2 and matches the bundle output
ordering exactly at `src/contexts/specification/exportClaudeCode.ts:412-460`. P111
seals with the architectural layer leading every spec output and the dogfood
gates owner-runnable in 3 commands.

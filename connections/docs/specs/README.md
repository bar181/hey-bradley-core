# Hey Bradley AISP Specs — How to Read + Use This Collection

> For developers consuming a Hey Bradley spec bundle in Claude Code, Cursor,
> or any AI coding tool. Date: 2026-05-04 · Hey Bradley v2.0.0-RC1+

## Why these specs exist

Most AI coding workflows lose information at the design → dev handoff. A
designer mocks something up, a PM writes a Notion doc, a developer reads it,
opens Cursor, and asks the model to "build this." The model fills in the gaps
— sometimes well, often not — because the spec was prose written for humans,
not for a machine. Anything implicit (which bounded contexts? which
architectural decisions? which error cases? which database choice?) becomes
guess-work the AI silently invents.

Hey Bradley closes that gap with **AISP** (AI Symbolic Protocol) — a
math-first symbolic spec language with 512 symbols every modern LLM
recognizes natively. A Hey Bradley AISP spec is dense, unambiguous, and
machine-parseable; you hand the bundle to Claude Code and the model reads
the bounded contexts + cited ADRs FIRST, before writing a single line of
code. The architectural decisions become the implicit constraints; the
prose-fill-in-the-blanks problem disappears.

Try the live workbench at <https://heybradley.app> to see the
spec-as-you-talk loop in action.

## What you're looking at

The `connections/docs/specs/aisp/` folder contains **18 AISP Crystal Atom
specs**. **14 of 18 are implemented as runnable code today** (5 SKILL files
in `connections/skills/` + 5 MCP tool handlers in `connections/mcp/tools/`
+ 4 NPX commands in `connections/npx/`). The 4 Rust function specs are
**blueprint-only** — implementation is deferred per ADR-C07 D7 (60-day
upstream PR window with bar181/aisp-open-core; see also P112 / ADR-140 D1
for the TS heuristic stopgap that backs `validate_aisp` until the WASM
build lands).

- **5 SKILL specs (implemented)** — `/spec-init`, `/spec-export`, `/adr-new`,
  `/ddd-map`, `/sprint-plan` (Claude Code plugin slash-commands)
- **5 MCP tool specs (implemented)** — `get_spec`, `get_claude_md`,
  `validate_aisp`, `get_ddd`, `get_agent_scopes` (stdio + Streamable HTTP)
- **4 NPX command specs (implemented)** — `init`, `spec`, `export --claude-code`,
  `score` (terminal-first surface)
- **4 Rust function specs (blueprint-only; deferred)** — `build_crystal_atom`,
  `extract_ddd_contexts`, `format_claude_md`, `ambig_diff` (WASM-bundled
  primitives per ADR-C07; pending Wave 4 upstream PR window)

Each spec is a single AISP file (~60-80 lines) declaring its Σ contract +
Γ rules + Λ logistics + Ε verifications. They are the source of truth for
the connections-layer implementation.

## Reading order (for first-time readers)

If you're trying to understand what Hey Bradley does:

1. **Start here:** `connections/docs/00-understanding.md` (the synthesis
   doc — covers the existing 8-atom suite, the Claude Code plugin standard,
   the MCP standard, and AISP v5.1 in one place).
2. **Then:** read 2-3 AISP specs to learn the format:
   - `skill-spec-init.aisp` — the on-ramp skill (description → AISP draft)
   - `mcp-get-spec.aisp` — the MCP tool that backs it
   - `rust-build-crystal-atom.aisp` — the Rust primitive underneath
3. **Then:** read `connections/docs/adr/ADR-C01..C07-*.md` for the 7
   architectural decisions that govern the connections layer.

## How to read an AISP Crystal Atom

Every spec follows the AISP v5.1 5-block sequence (verbatim from upstream
`aisp-open-core`):

```
⟦
  Ω := { ... }   # Objective — the mission / north-star intent
  Σ := { ... }   # Structure — typed input/output shape (the data contract)
  Γ := { ... }   # Grounding — constraints + rules (Γ R1, Γ R2, ...)
  Λ := { ... }   # Logistics — timeouts, fallbacks, thresholds, transport
  Ε := { ... }   # Evaluation — verifications (Ε V1, Ε V2, ...)
⟧
```

**Concrete example** from `mcp-validate-aisp.aisp`:

- **Ω** declares the mission: "Score AISP Crystal Atom text — emit δ density
  + Ambig + tier per validation pipeline `validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂`."
- **Σ** types the input (`aisp_text:𝕊, target_tier?:𝕋`) and output
  (`density:ℝ[0..1], ambig:ℝ[0..1], tier:𝕋, ...`).
- **Γ** declares 5 invariants, e.g. `Γ R3: tier ∈ {◊⁺⁺ : δ≥0.75, ◊⁺ :
  δ≥0.60, ...}` (the tier ladder is part of the contract).
- **Λ** sets `timeout := 2s`, `fallback := unparseable ⇒ soft-error in
  result`, names the runtime (`WASM via aisp-core`).
- **Ε** lists 6 verifications including `Ε V4: VERIFY production specs
  achieve Ambig < 0.02 (hard gate)`.

That single 60-line file is the complete spec. An LLM agent reading it can
implement, test, and validate the tool with no prose disambiguation.

## How to use a spec output (consumer-facing)

When Hey Bradley generates a spec bundle (via `/spec-export`, NPX
`hey-bradley export --claude-code`, or the web-app workbench), the bundle
is a single markdown file with `# === FILE: <path> ===` markers. The first
6 logical files in priority order are (per ADR-139 §D1):

1. **CLAUDE.md** — Architectural overview (Bounded Contexts + Cited ADRs upfront)
2. **ddd-contexts.md** — Full bounded-context prose with relationships
3. **adr-bundle/<id>.md** — Full ADR text per cited reference
4. **aisp/phase-aisp.md** — Verbatim AISP Σ/Γ/Λ/Ε blocks
5. **implementation-plan.md** — Phase/sprint/agent breakdown
6. **tdd-scaffold.md** — Given/When/Then per phase

Hand the bundle to your AI coding tool (Claude Code, Cursor) and the tool
reads the architectural layer first — bounded contexts and cited ADRs become
the implicit constraints for everything downstream.

## Support + troubleshooting

### "I don't have a spec yet"

Run `/spec-init "describe your project"` from Claude Code (after installing
the Hey Bradley plugin) OR `npx hey-bradley spec --prompt "your idea"` from
the terminal.

### "I want to visualize the spec"

Open <https://heybradley.app> and import via the workbench. The plugin
intentionally has no preview surface — the web app IS the visualization;
the plugin/NPX is the headless emitter.

### "My spec scored Bronze tier — how do I get to Gold?"

Run `npx hey-bradley score path/to/spec.aisp` to see Ambig + density numbers.
Gold tier requires:

- **δ density ≥ 0.60** — more AISP symbols / less prose. Replace English
  conjunctions with `∧ / ∨`, types with `𝕊 / ℝ / 𝔹`, set membership with
  `∈ / ∋`, and so on.
- **Ambig < 0.02** — single-meaning Σ blocks. If a field can be
  interpreted two ways (e.g. `count: number` — total? running? capped?),
  refine with explicit range types like `count:ℕ[0..1000]`.

### "What if AISP changes?"

AISP follows the `aisp-1.X` minor backward-compat policy (project-local per
ADR-109 + ADR-133). Hey Bradley pins to the dated stamp
`𝔸5.1.Platinum@2026-01-09` in the bundle marker. Major version bumps
require an RFC; minor revisions are additive.

### "How do I contribute an ADR?"

Read `docs/adr/README.md` for the 130 existing ADRs (P109 rebuild +
P110-P111 additions). Use `/adr-new "decision title"` to scaffold one.
Cite predecessors in the cross-refs section. Keep under 120 LOC. Status:
Proposed → Accepted via review.

## Common terms

- **AISP** — AI Symbolic Protocol; the spec language with 512 symbols
- **Crystal Atom** — a 5-block (Ω/Σ/Γ/Λ/Ε) AISP unit
- **DDD** — Domain-Driven Design; bounded contexts + relationships
- **ADR** — Architecture Decision Record; one decision per file
- **Bundle** — markdown export with `# === FILE: <path> ===` markers
- **Tier** — quality score: Platinum ≥0.75 / Gold ≥0.60 / Silver ≥0.40 /
  Bronze ≥0.20 / Reject <0.20
- **δ (density)** — symbol-token ratio (HIGHER better)
- **Ambig** — `1 - parse_unique / parse_total` (LOWER better; <0.02 prod gate)

## Where to learn more

- Hey Bradley web app: <https://heybradley.app>
- Open core repo: <https://github.com/bar181/hey-bradley-core>
- AISP open core: <https://github.com/bar181/aisp-open-core>
- This spec collection: `connections/docs/specs/aisp/` (18 specs)
- The 7 connections ADRs: `connections/docs/adr/ADR-C01..C07-*.md`
- The bundle export contract: `docs/adr/ADR-122-export-claude-code-markdown-bundle.md`
- The output-priority decision: `docs/adr/ADR-139-dogfood-gates-ddd-adr-priority.md`

---

*Generated by Hey Bradley · <https://heybradley.app> · Open core MIT*

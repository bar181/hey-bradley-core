# ADR-C02: SKILL.md Content Strategy Per Skill

> Status: Accepted
> Date: 2026-05-04
> Cross-refs: ADR-C01 (Plugin structure), ADR-C04 (MCP tool definitions),
>             ADR-119 (DDD_ATOM), ADR-120 (AGENT_ATOM), ADR-122 (Export bundle)

## Context

Phase 1 inventory (`inventory-claude-plugin.md` §2) fixes the SKILL.md envelope: YAML frontmatter (only `description` recommended), `description` + `when_to_use` capped at 1,536 chars combined per skill listing, body soft cap ≤500 lines, auto-compaction re-attaches first 5,000 tokens per skill (25,000-token combined budget). Argument convention is `$1`/`$2` positional, `${arg-name}` named, plus harness substitutions including `${CLAUDE_SKILL_DIR}`. Five skills are enumerated in `connections/docs/preflight.md`. Phase 4 builds the actual SKILL.md files; this ADR fixes scope, output shape, and MCP coupling per skill so siblings (ADR-C01 plugin manifest, ADR-C04 MCP tool inputSchemas) can land in parallel without naming drift.

## Decisions

### D1 — `/spec-init "describe project"`

- **Does:** Take a 1-paragraph project description (positional `$1`) and produce a draft Hey Bradley spec covering humanSpec / north-star / SADD / implementation-plan via the 8-atom AISP pipeline. Emits to `${CLAUDE_SKILL_DIR}/spec.md` so the bundle exceeds the 1,536-char listing cap without bloating SKILL.md context.
- **Does NOT:** Replace the web-app workbench (`heybradley.app`); this is the on-ramp not the full IDE. Does not run KISS review or seal — that is `/spec-export` + workbench territory.
- **Token budget:** SKILL.md body ≤1,500 chars (one auto-compaction cycle).
- **Argument convention:** `$1` = project description (positional, required).
- **MCP integration:** Calls MCP tool `get_spec` (per ADR-C04) for generation. Skill must declare `mcp` capability in plugin.json per ADR-C01.
- **Output format:** File write to `${CLAUDE_SKILL_DIR}/spec.md` (markdown bundle); short stdout summary citing the path.

### D2 — `/spec-export → CLAUDE.md`

- **Does:** Read project-local `.heybradley/spec.aisp` and emit a CLAUDE.md-formatted markdown bundle per ADR-122 (single `.md` with `# === FILE: <path> ===` markers covering CLAUDE.md preamble + process map + human spec + AISP spec + ADRs + agent waves). Pure transform; the spec must already exist.
- **Does NOT:** Generate a fresh spec (use `/spec-init`); does not invoke KISS review or seal.
- **Token budget:** SKILL.md body ≤1,200 chars; bundle output is large (file write, not stdout).
- **Argument convention:** Optional named `${output-path}`, defaults to `./CLAUDE.md`.
- **MCP integration:** Calls MCP tool `get_claude_md` (per ADR-C04).
- **Output format:** File write to `${output-path}` markdown bundle; stdout reports byte count + logical-file count.

### D3 — `/adr-new "decision title"`

- **Does:** Scaffold a new ADR file with required sections (Context / Decisions / Consequences / Cross-refs), auto-increments ID by scanning `docs/adr/` for the highest `ADR-NNN-*.md`, sets `Status: Proposed` and current date.
- **Does NOT:** Write the decisions themselves — user fills in. Does not link cross-refs automatically.
- **Token budget:** SKILL.md body ≤1,000 chars; output scaffold ≤120 LOC per ADR template discipline.
- **Argument convention:** `$1` = decision title (positional, required).
- **MCP integration:** None — pure local file operation.
- **Output format:** File write to `docs/adr/ADR-NNN-<kebab-title>.md`; stdout reports the new path.

### D4 — `/ddd-map → bounded contexts`

- **Does:** Run DDD_ATOM (per ADR-119) over a project description or existing `.heybradley/spec.aisp`; emit bounded contexts + relationships (partnership / customer-supplier / conformist / anti-corruption-layer) as markdown.
- **Does NOT:** Modify the spec — informational output only. Does not render the SVG; that lives in the web app.
- **Token budget:** SKILL.md body ≤1,200 chars; map output ≤200 lines markdown (fits stdout without file write).
- **Argument convention:** Optional `$1` = project description; defaults to reading `.heybradley/spec.aisp`.
- **MCP integration:** Calls MCP tool `get_ddd` (per ADR-C04).
- **Output format:** Markdown text to stdout (≤200 lines).

### D5 — `/sprint-plan → wave structure`

- **Does:** Run AGENT_ATOM (per ADR-120) over a sprint scope; emit wave/agent/ownedFiles plan with disjoint ownedFiles (Γ R3 + Ε V1) and per-agent DoD checklists.
- **Does NOT:** Execute the plan — planning only. Does not invoke `Task` agents or write files beyond the plan markdown.
- **Token budget:** SKILL.md body ≤1,300 chars; plan output ≤300 lines markdown.
- **Argument convention:** `$1` = sprint scope (positional, required); optional named `${wave-count}` defaults to 2.
- **MCP integration:** Calls MCP tool `get_agent_scopes` (per ADR-C04).
- **Output format:** Markdown text to stdout; if `${wave-count} > 2` the output may overflow and is written to `${CLAUDE_SKILL_DIR}/sprint-plan.md` instead.

## Common conventions

- Token budgets follow A2 inventory: `description` + `when_to_use` ≤1,536 chars combined per skill listing; body soft cap ≤500 lines; auto-compaction re-attaches first 5,000 tokens per skill (25,000 combined).
- Argument convention: `$1`, `$2` for positional; `${arg-name}` for named. Harness substitutions used: `${CLAUDE_SKILL_DIR}` for file-write outputs.
- File-write outputs route to `${CLAUDE_SKILL_DIR}/` per A2 §2 unless the user specifies an explicit path (D2 / D3).
- Skills calling MCP tools (D1, D2, D4, D5) require the `mcp` capability in plugin.json per ADR-C01. D3 is self-contained.
- Tool naming aligned with ADR-C04: `get_spec` / `get_claude_md` / `get_ddd` / `get_agent_scopes`.

## Consequences

- Phase 4 SKILL.md authors have a fixed scope contract per skill — no scope drift between siblings.
- Four of five skills depend on MCP server (ADR-C04); D3 ships even if MCP is absent, giving a minimum-viable degraded mode.
- Output routing split (stdout for D3/D4 small; file write for D1/D2/D5-large) means users see immediate feedback without consuming skill compaction budget on bulk content.
- Tool name coupling between this ADR and ADR-C04 is intentional — any rename requires touching both ADRs in lock-step.

## Open questions deferred

- Where does `/spec-init` fall back if MCP is not available — local-only mode using a bundled rules-based atom pipeline, or hard-error with a "install MCP server" message? (Phase 3 / ADR-C04 territory.)
- Should `/adr-new` cross-link to the most-recently-touched ADR by reading `docs/adr/README.md`? (Deferred — would couple D3 to a doc convention not yet codified.)
- Versioning: when AISP-2.0 lands (RFC-gated per ADR-109), does each skill pin a Σ version? (Deferred to post-v2.0.0-RC1.)

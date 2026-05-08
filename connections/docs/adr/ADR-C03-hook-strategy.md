# ADR-C03: Hook Strategy and Size Constraints

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-C01 (Plugin structure), ADR-C02 (SKILL.md content), ADR-C04 (MCP tool definitions)

## Context

Hey Bradley v2.0.0-RC1 stores its canonical project artifact (`.heybradley/spec.aisp`) on disk via the markdown-bundle exporter (`buildClaudeCodeBundle()` per ADR-122), but a Claude Code session starting in that project has no way to surface that spec without the user manually pasting it. The connections-layer plugin (ADR-C01) declares `hooks/hooks.json` as its bridge surface; this ADR records WHICH hook event we use, WHICH hook type, and HOW big the injected context can grow before we trim. A2 §3 enumerates 27 lifecycle events, 5 hook types, and explicit blocking semantics — five small structural decisions land below. No code lands in this ADR; Phase 4 writes the actual `pre-session.sh` per these constraints.

## Decisions

### D1 — Hook event: SessionStart

Use the `SessionStart` event (per A2 §3 — "When a session begins or resumes") with matchers `startup` + `resume` to inject Hey Bradley project context once at session boundary; A2 §3 quotes "stdout is added to Claude's context" specifically for this event. `clear` matcher omitted (user-driven reset; injecting on every clear is noisy). Optional secondary `UserPromptSubmit` re-inject deferred (see Open Questions) — measure first, layer second. PreToolUse / PostToolUse explicitly NOT used here — those are tool-call surfaces per A2 §3, not session-context surfaces.

### D2 — Hook type: command

Use the `command` type (per A2 §3 — "execute shell commands or scripts") pointing at `${CLAUDE_PLUGIN_ROOT}/hooks/pre-session.sh` per ADR-C01 D5. The script reads `${CLAUDE_PROJECT_DIR}/.heybradley/spec.aisp` if present, formats a 3-section preamble, writes to stdout, exits 0. Alternative `mcp_tool` type rejected — it adds round-trip latency at session start (server must be up, JSON-RPC handshake completes first per A3 §A1) and shifts a fast local-disk read onto a network-shaped surface. `prompt` type rejected — Haiku call at every session start is wasteful for a deterministic file-read; A2 §3 default model spend belongs in actual reasoning hooks, not context injection.

### D3 — Context injection size: ≤500 tokens

Cap hook stdout at **≤500 tokens** per Hey Bradley project convention (A2 §3 explicitly notes the docs do NOT publish a numeric cap — "any text your command writes to stdout is added to Claude's context"; preflight target is project-set, not platform-enforced). Output structure when `.heybradley/spec.aisp` exists:

1. Project name + tagline (≤50 tokens)
2. North-star summary (≤200 tokens; extracted from spec body)
3. AISP atom-set status (≤100 tokens; which atoms wired, current Ambig score per ADR-053)
4. Optional remainder (≤150 tokens; carry-forward / sprint pointer if present)

When `.heybradley/spec.aisp` is ABSENT the script emits **nothing** (empty stdout; silent skip) — user invokes `/spec-init` per ADR-C02 to bootstrap. No diagnostic banner; silence is intentional to keep cold-start clean.

### D4 — Hook command exit-code contract

Per A2 §3 verbatim semantics:

- **Exit 0** — stdout becomes context; happy path (spec found + formatted under cap, OR no spec found + empty stdout)
- **Exit 2** — stderr becomes Claude feedback; soft fail (spec exists but parse failure; user told why; session continues with no injected context)
- **Other exit** — A2 §3 "action proceeds; transcript shows error notice"; hard fail (script crash, sh missing, env var unset); transcript surfaces error so user can debug

`SessionStart` has no `permissionDecision` surface — that field is PreToolUse-only per A2 §3 — so the exit-code triad above is the entire control surface.

### D5 — Token budget enforcement (defense-in-depth)

The script self-limits before emitting: if section assembly exceeds **400 words** (≈500 tokens conservative; `wc -w` proxy keeps the script awk/sh-pure with no Node dep), truncate at 380 words and append the literal suffix `... [truncated]`. This is belt-and-braces — section caps in D3 should keep us under naturally, but a malformed `.heybradley/spec.aisp` (e.g. user dumped a 5K-line spec into the north-star slot) MUST NOT blow the user's working context budget. The 25K-token auto-compaction combined budget (A2 §2) is unrelated — that's per-skill re-attach math; this is a one-shot session-injection cap.

## Consequences

**Positive**

- Project context auto-injected on every Claude Code `startup`/`resume` — no manual paste, no `/spec` command needed for the read path
- `command` type is local + fast — no MCP server cold-start latency, no Haiku spend at session boundary
- 500-token cap honors A2's silence on numeric limits while staying conservative against the 25K combined-budget surface
- Silent-skip-when-absent keeps cold-start clean for non-Hey-Bradley projects (the plugin can ship globally without polluting unrelated sessions)
- Exit-code triad is verbatim A2 §3 — no custom protocol surface to maintain

**Negative**

- Session start gains ~50ms while sh runs (file read + format + truncate); negligible in absolute terms but measurable on `--init-only` cold paths
- `SessionStart` fires on `clear` if a user adds that matcher later — current decision excludes `clear` to avoid mid-session re-injection noise; if user feedback shows that's wrong, ADR-C03 amendment ships in Phase 4
- 400-word `wc -w` proxy is approximate — a token-dense AISP spec with many `𝔸/Σ/Γ/Λ/Ε` symbols has higher token-per-word ratio than prose; truncation fires earlier than necessary on dense input. Acceptable trade-off for sh-pure script.
- No re-injection after compaction at v0.1.0 — if a long session compacts away the SessionStart context, user must `/clear` to re-trigger, OR run `/spec` (ADR-C02) to re-fetch. `UserPromptSubmit` secondary hook is the deferred fix.

## Cross-refs

- **ADR-C01** (Plugin structure) — `hooks/hooks.json` location + `${CLAUDE_PLUGIN_ROOT}` substitution per D2
- **ADR-C02** (SKILL.md content) — `/spec-init` skill bootstraps `.heybradley/spec.aisp` when D3 silent-skip path fires
- **ADR-C04** (MCP tool definitions) — `get_spec` MCP tool is the on-demand re-fetch surface that complements this hook's at-session-start push
- **ADR-122** (Export Claude Code Markdown Bundle) — `.heybradley/spec.aisp` is the artifact emitted by this exporter
- **ADR-053** (AISP Ambig discipline) — atom-set status section in D3 surfaces the current Ambig score against the `<0.02` production gate
- **ADR-126** (Comprehensive LLM Interaction Logging) — fire-and-forget contract; hook stderr on exit 2 mirrors that "never throws upward" discipline

## Open questions deferred

- Whether to add `UserPromptSubmit` as a secondary re-inject after compaction — defer to Phase 4 based on observed usage telemetry; if SessionStart context survives the typical session length the secondary hook is unnecessary churn
- Hook stdout format details (raw markdown vs structured fence-delimited blocks) — A2 §3 doesn't specify; raw markdown is the v0.1.0 default, structured-format experiment deferred to Phase 4 once we measure token efficiency
- `clear` matcher inclusion — currently excluded; revisit if users report needing re-injection after explicit context reset
- Telemetry counter for hook fire/skip/truncate frequency — Phase 4 scope, requires `${CLAUDE_PLUGIN_DATA}` write surface per ADR-C01 D5

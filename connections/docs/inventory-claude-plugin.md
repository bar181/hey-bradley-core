# Claude Code Plugin Reference

> Date: 2026-05-04 · Source: WebFetch from `code.claude.com/docs/en/*`
> Note: All four canonical doc URLs from the preflight redirect (301) from `docs.claude.com/en/docs/claude-code/*` to `code.claude.com/docs/en/*`. Content captured from the redirected URLs; original docs.claude.com URLs are no longer canonical for plugin/skills/hooks/marketplaces docs.

## TL;DR

Claude Code plugins are self-contained directories with optional `.claude-plugin/plugin.json` manifest plus convention-located component subdirs (`skills/`, `agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `monitors/`, `themes/`, `commands/`, `output-styles/`, `bin/`). Skills are Markdown files (`SKILL.md`) with optional YAML frontmatter and follow the open Agent Skills standard, invoked via `/<skill-name>`. Distribution is via marketplaces — a separate repo containing `.claude-plugin/marketplace.json` listing plugin sources (github / git URL / git-subdir / npm / relative path), installed by users with `/plugin marketplace add <source>` then `/plugin install <plugin>@<marketplace>`.

## 1. plugin.json manifest

**Location:** `.claude-plugin/plugin.json` (manifest is OPTIONAL; if omitted, components are auto-discovered from default subdirs and plugin name = directory basename).

**Required fields** (only when manifest present):

| Field | Type | Description |
| :---- | :--- | :---------- |
| `name` | string | "Unique identifier (kebab-case, no spaces)" — example `"deployment-tools"` |

> Quote: "If you include a manifest, `name` is the only required field."
> Quote: "This name is used for namespacing components. For example, in the UI, the agent `agent-creator` for the plugin with name `plugin-dev` will appear as `plugin-dev:agent-creator`."

**Metadata fields (optional):**

| Field | Type | Notes |
| :---- | :--- | :---- |
| `$schema` | string | JSON Schema URL for editor autocomplete; ignored at load time |
| `version` | string | Semver. "Setting this pins the plugin to that version string, so users only receive updates when you bump it. If omitted, Claude Code falls back to the git commit SHA, so every commit is treated as a new version." |
| `description` | string | "Brief explanation of plugin purpose" |
| `author` | object | `{name, email, url}` |
| `homepage` | string | Documentation URL |
| `repository` | string | Source code URL |
| `license` | string | SPDX (e.g. `"MIT"`, `"Apache-2.0"`) |
| `keywords` | array | Discovery tags |

**Component path fields (optional — replace defaults when present):**

| Field | Type | Default location | Notes |
| :---- | :--- | :--------------- | :---- |
| `skills` | string\|array | `skills/` | Custom skill dirs containing `<name>/SKILL.md` |
| `commands` | string\|array | `commands/` | Custom flat `.md` skill files or directories |
| `agents` | string\|array | `agents/` | Custom agent files |
| `hooks` | string\|array\|object | `hooks/hooks.json` | Hook config paths or inline config |
| `mcpServers` | string\|array\|object | `.mcp.json` | MCP config paths or inline config |
| `outputStyles` | string\|array | `output-styles/` | Output style files/directories |
| `themes` | string\|array | `themes/` | Color theme files/directories |
| `lspServers` | string\|array\|object | `.lsp.json` | LSP server configs |
| `monitors` | string\|array | `monitors/monitors.json` | Background monitor configs |
| `userConfig` | object | — | User-prompted values at enable time (string/number/boolean/directory/file) |
| `channels` | array | — | Telegram/Slack/Discord-style message injection bound to MCP server keys |
| `dependencies` | array | — | Other plugins required, optionally with semver: `[{ "name": "secrets-vault", "version": "~2.1.0" }]` |

**Path behavior rules** (verbatim):

> "All paths must be relative to the plugin root and start with `./`"
> "To keep the default directory and add more paths for skills, commands, agents, or output styles, include the default in your array: `"skills": ["./skills/", "./extras/"]`"

**Variable substitution available in MCP/hook/LSP/monitor commands:**

- `${CLAUDE_PLUGIN_ROOT}` — plugin install dir (changes on update; not persistent)
- `${CLAUDE_PLUGIN_DATA}` — persistent plugin state dir at `~/.claude/plugins/data/{id}/`
- `${user_config.KEY}` — user-config values
- `${ENV_VAR}` — env vars

**Versioning convention** (verbatim):

> "Claude Code resolves a plugin's version from the first of these that is set: 1. The `version` field in the plugin's `plugin.json` 2. The `version` field in the plugin's marketplace entry in `marketplace.json` 3. The git commit SHA of the plugin's source, for `github`, `url`, `git-subdir`, and relative-path sources in a git-hosted marketplace 4. `unknown`, for `npm` sources or local directories not inside a git repository"

> "If you use explicit versions, follow [semantic versioning](https://semver.org) (`MAJOR.MINOR.PATCH`)"

Source: https://code.claude.com/docs/en/plugins-reference

## 2. SKILL.md format

**Location:** `<plugin>/skills/<skill-name>/SKILL.md` for plugin-bundled skills; `~/.claude/skills/<name>/SKILL.md` for personal; `.claude/skills/<name>/SKILL.md` for project. Slash invocation: directory name becomes the slash command — `/<skill-name>` → loads `skills/<skill-name>/SKILL.md`.

> Quote: "Skills follow the [Agent Skills](https://agentskills.io) open standard, which works across multiple AI tools. Claude Code extends the standard with additional features like invocation control, subagent execution, and dynamic context injection."

> Quote: "**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way."

**YAML frontmatter contract** (all OPTIONAL; only `description` is recommended):

| Field | Required | Description |
| :---- | :------- | :---------- |
| `name` | No | "Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters)." |
| `description` | Recommended | "What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Put the key use case first: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage." |
| `when_to_use` | No | Trigger phrases / example requests. "Appended to `description` in the skill listing and counts toward the 1,536-character cap." |
| `argument-hint` | No | Hint shown during autocomplete. Example: `[issue-number]` or `[filename] [format]` |
| `arguments` | No | Named positional arguments for `$name` substitution. Space-separated string or YAML list |
| `disable-model-invocation` | No | `true` = only user can invoke (skill description NOT loaded into context unless invoked). Default `false` |
| `user-invocable` | No | `false` = hide from `/` menu (only Claude can invoke). Default `true` |
| `allowed-tools` | No | Tools auto-approved while skill active. Space-separated or YAML list. Example: `Bash(git add *) Bash(git commit *)` |
| `model` | No | Model override for current turn (resets next prompt). Same values as `/model`, or `inherit` |
| `effort` | No | `low`/`medium`/`high`/`xhigh`/`max` (per-model); overrides session effort |
| `context` | No | `fork` = run in forked subagent context |
| `agent` | No | Subagent type when `context: fork` (e.g. `Explore`, `Plan`, `general-purpose`) |
| `hooks` | No | Hooks scoped to this skill's lifecycle |
| `paths` | No | Glob patterns limiting auto-activation. Comma-separated string or YAML list |
| `shell` | No | `bash` (default) or `powershell` for `` !`command` `` blocks |

**Body conventions** (markdown sections + examples):

- Body is freeform Markdown; instructions Claude follows when skill runs
- Inline shell injection via `` !`<command>` `` — runs at render time, output replaces placeholder
- Multi-line shell via fenced ` ```! ` block
- String substitutions: `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$<name>`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}`
- Supporting files in same directory (referenced from SKILL.md so Claude knows when to load): `reference.md`, `examples.md`, `scripts/*.{sh,py,js}`

**Slash command mapping** (verbatim):

> "Either way, Claude should respond with a short summary of your edit and a list of risks." — `/summarize-changes` invokes `~/.claude/skills/summarize-changes/SKILL.md`.

For plugin skills: namespace is `<plugin-name>:<skill-name>`. Personal/project use bare slash command. Slug = directory basename (or frontmatter `name` if set).

**Token budget guidance** (verbatim):

> "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files."

> "**Auto-compaction** carries invoked skills forward within a token budget. When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens."

> "Skill descriptions are loaded into context so Claude knows what's available. All skill names are always included, but if you have many skills, descriptions are shortened to fit the character budget, which can strip the keywords Claude needs to match your request. The budget scales dynamically at 1% of the context window, with a fallback of 8,000 characters."

> "each entry's combined text is capped at 1,536 characters regardless of budget"

Source: https://code.claude.com/docs/en/skills

## 3. Hooks

**Location options:**

- Plugin: `<plugin>/hooks/hooks.json` OR inline in `plugin.json` under `hooks`
- User: `~/.claude/settings.json`
- Project: `.claude/settings.json` (committable)
- Project local: `.claude/settings.local.json` (gitignored)
- Skill/agent frontmatter: `hooks` field

**All hook events** (verbatim from reference):

| Event | When it fires |
| :---- | :------------ |
| `SessionStart` | When a session begins or resumes |
| `Setup` | `--init-only` / `--init` / `--maintenance` (`-p` mode) one-time prep |
| `UserPromptSubmit` | When you submit a prompt, before Claude processes it |
| `UserPromptExpansion` | When a user-typed command expands into a prompt; can block expansion |
| `PreToolUse` | Before a tool call executes; can block it |
| `PermissionRequest` | When a permission dialog appears |
| `PermissionDenied` | When a tool call is denied; return `{retry: true}` to allow retry |
| `PostToolUse` | After a tool call succeeds |
| `PostToolUseFailure` | After a tool call fails |
| `PostToolBatch` | After a batch of parallel tool calls resolves |
| `Notification` | When Claude Code sends a notification |
| `SubagentStart` / `SubagentStop` | Subagent lifecycle |
| `TaskCreated` / `TaskCompleted` | Task lifecycle via `TaskCreate` |
| `Stop` | When Claude finishes responding |
| `StopFailure` | Turn ends due to API error (output and exit code ignored) |
| `TeammateIdle` | Agent-team teammate about to go idle |
| `InstructionsLoaded` | CLAUDE.md or `.claude/rules/*.md` loaded into context |
| `ConfigChange` | Configuration file changes during session |
| `CwdChanged` | Working directory changes (e.g. `cd`) |
| `FileChanged` | Watched file changes on disk; `matcher` field specifies filenames |
| `WorktreeCreate` / `WorktreeRemove` | Worktree lifecycle |
| `PreCompact` / `PostCompact` | Around context compaction |
| `Elicitation` / `ElicitationResult` | MCP server input requests |
| `SessionEnd` | When a session terminates |

**Hook config JSON shape** (verbatim example):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

**Hook types** (verbatim):

- `command` — execute shell commands or scripts
- `http` — POST event JSON to a URL
- `mcp_tool` — call a tool on a configured MCP server
- `prompt` — single-turn LLM evaluation (`$ARGUMENTS` placeholder); default model Haiku
- `agent` — multi-turn agentic verifier (experimental; default 60s timeout, up to 50 tool-use turns)

**Payload — common input fields on stdin** (every event):

```json
{
  "session_id": "abc123",
  "cwd": "/Users/sarah/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}
```

> Quote: "`UserPromptSubmit` hooks get the `prompt` text instead, `SessionStart` hooks get the `source` (startup, resume, clear, compact), and so on."

**Output / blocking semantics** (verbatim):

- **Exit 0**: action proceeds. For `UserPromptSubmit`, `UserPromptExpansion`, and `SessionStart` hooks, stdout is added to Claude's context.
- **Exit 2**: action blocked. stderr becomes Claude's feedback.
- **Other exit code**: action proceeds; transcript shows error notice.

**Structured JSON output** for `PreToolUse`:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

`permissionDecision` ∈ `"allow"` | `"deny"` | `"ask"` | `"defer"` (`-p` mode only).

**Sync vs async / blocking** (verbatim):

> "Hook events fire at specific lifecycle points in Claude Code. When an event fires, all matching hooks run in parallel, and identical hook commands are automatically deduplicated."
> "When multiple hooks match, each one returns its own result. For decisions, Claude Code picks the most restrictive answer."
> "Hook timeout is 10 minutes by default, configurable per hook with the `timeout` field (in seconds)."
> "PreToolUse hooks fire before any permission-mode check. A hook that returns `permissionDecision: "deny"` blocks the tool even in `bypassPermissions` mode."
> "When multiple PreToolUse hooks return `updatedInput` to rewrite a tool's arguments, the last one to finish wins. Since hooks run in parallel, the order is non-deterministic."

**Token budget for context-injecting hooks:**

The docs do NOT publish an explicit numeric cap for `SessionStart` / `UserPromptSubmit` stdout-injected context. The general guidance:

> "Any text your command writes to stdout is added to Claude's context."
> "For injecting context on every session start, consider using [CLAUDE.md](/en/memory) instead."

The preflight target of `≤500 tokens per hook` is NOT a documented Claude Code constraint; it is a Hey Bradley project convention.

**Matcher patterns by event** (verbatim subset):

- `PreToolUse` / `PostToolUse` / `PostToolUseFailure` / `PermissionRequest` / `PermissionDenied`: tool name (e.g. `Bash`, `Edit|Write`, `mcp__.*`)
- `SessionStart`: `startup` / `resume` / `clear` / `compact`
- `Notification`: `permission_prompt` / `idle_prompt` / `auth_success` / `elicitation_*`
- `ConfigChange`: `user_settings` / `project_settings` / `local_settings` / `policy_settings` / `skills`
- `FileChanged`: literal filenames separated by `|`
- `UserPromptSubmit`, `Stop`, `CwdChanged`, etc.: no matcher support

Source: https://code.claude.com/docs/en/hooks-guide

## 4. Marketplace

**Required repo layout:**

```text
my-marketplace/
├── .claude-plugin/
│   └── marketplace.json          ← REQUIRED
└── plugins/                       ← Convention; can be anywhere relative
    └── my-plugin/
        ├── .claude-plugin/
        │   └── plugin.json
        └── skills/<name>/SKILL.md
```

**`.claude-plugin/marketplace.json` schema:**

Required:

| Field | Type | Description |
| :---- | :--- | :---------- |
| `name` | string | "Marketplace identifier (kebab-case, no spaces). This is public-facing: users see it when installing plugins (for example, `/plugin install my-tool@your-marketplace`)." |
| `owner` | object | `{name (required), email}` |
| `plugins` | array | List of plugin entries |

Optional:

- `$schema`, `description`, `version`
- `metadata.pluginRoot` — base dir prepended to relative plugin sources
- `allowCrossMarketplaceDependenciesOn` — array of allowed dependency marketplaces

**Reserved marketplace names (verbatim):**

> "`claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `knowledge-work-plugins`, `life-sciences`. Names that impersonate official marketplaces (like `official-claude-plugins` or `anthropic-tools-v2`) are also blocked."

**Plugin entry — required:**

| Field | Type | Description |
| :---- | :--- | :---------- |
| `name` | string | Plugin id (kebab-case) |
| `source` | string\|object | Where to fetch (see sources) |

**Plugin sources** (verbatim):

| Source | Type | Fields |
| :----- | :--- | :----- |
| Relative path | `string` (e.g. `"./my-plugin"`) | none — must start with `./`, no `..` |
| `github` | object | `repo`, `ref?`, `sha?` |
| `url` | object | `url`, `ref?`, `sha?` |
| `git-subdir` | object | `url`, `path`, `ref?`, `sha?` |
| `npm` | object | `package`, `version?`, `registry?` |

**Publish flow** (verbatim):

1. "Creating plugins"
2. "Creating a marketplace file: define a `marketplace.json` that lists your plugins and where to find them"
3. "Host the marketplace: push to GitHub, GitLab, or another git host"
4. "Share with users: users add your marketplace with `/plugin marketplace add` and install individual plugins"

**Install commands** (verbatim):

```shell
/plugin marketplace add ./my-marketplace
/plugin install quality-review-plugin@my-plugins
```

```shell
/plugin marketplace add owner/repo
/plugin marketplace add owner/repo@v2.0
/plugin marketplace add https://gitlab.com/team/plugins.git
/plugin marketplace add https://example.com/marketplace.json
```

CLI equivalents: `claude plugin marketplace add <source>`, `claude plugin install <plugin>@<marketplace>`.

**Update mechanism** (verbatim):

> "Once your marketplace is live, you can update it by pushing changes to your repository. Users refresh their local copy with `/plugin marketplace update`."

> "Each installed version is a separate directory in the cache. When you update or uninstall a plugin, the previous version directory is marked as orphaned and removed automatically 7 days later."

**Approval / discovery flow:**

There is NO approval gate documented for third-party marketplaces — users add a marketplace by pointing at any git repo or URL. Discovery within Claude Code is via `/plugin` Discover tab (which shows the official marketplace) plus any user-added marketplaces. Anthropic blocks the reserved names listed above; otherwise self-publish is unrestricted.

**Strict mode** (verbatim):

> "`strict: true` (default): `plugin.json` is the authority. The marketplace entry can supplement it with additional components, and both sources are merged."
> "`strict: false`: The marketplace entry is the entire definition. If the plugin also has a `plugin.json` that declares components, that's a conflict and the plugin fails to load."

**Versioning + updates** (verbatim, condensed):

> "Plugin versions determine cache paths and update detection: if the resolved version matches what a user already has, `/plugin update` and auto-update skip the plugin."

Resolution order: `plugin.json#version` → `marketplace.json` plugin entry `version` → git commit SHA → `unknown` (npm / non-git local).

> "Avoid setting `version` in both `plugin.json` and the marketplace entry. The `plugin.json` value always wins silently, so a stale manifest version can mask a version you set in `marketplace.json`."

**Release channels:** Two marketplaces pointing to different `ref`s of the same repo + managed-settings-driven user-group assignment.

Source: https://code.claude.com/docs/en/plugin-marketplaces

## 5. Slash command pattern

**Invocation form:**

- `/<skill-name>` — invoke skill defined at `skills/<skill-name>/SKILL.md`
- `/<skill-name> <arg1> <arg2>` — pass positional args
- `/<skill-name> "multi word arg" second` — shell-style quoting

**Parameter parsing:**

> "Indexed arguments use shell-style quoting, so wrap multi-word values in quotes to pass them as a single argument. For example, `/my-skill "hello world" second` makes `$0` expand to `hello world` and `$1` to `second`. The `$ARGUMENTS` placeholder always expands to the full argument string as typed."

> "If you invoke a skill with arguments but the skill doesn't include `$ARGUMENTS`, Claude Code appends `ARGUMENTS: <your input>` to the end of the skill content so Claude still sees what you typed."

**Skill argument convention** (frontmatter `arguments` field):

```yaml
---
arguments: [issue, branch]
---

Fix issue $issue on branch $branch.
```

`/<skill> 123 main` → `$issue` = `123`, `$branch` = `main`. Equivalent to `$0`/`$1` indexed access.

**Plugin namespace:** Plugin-bundled skills appear as `<plugin>:<skill>` in UI but invocation remains `/<skill>` unless name conflicts (then namespaced form is used to disambiguate).

**Built-in / bundled skills:** `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`, plus built-in `/help`, `/compact`, `/init`, `/review`, `/security-review`, `/plugin`, `/hooks`, `/theme`, `/permissions`.

Source: https://code.claude.com/docs/en/skills (slash invocation), https://code.claude.com/docs/en/plugins-reference (plugin namespacing)

## 6. Gaps / unknowns

- **All four preflight URLs (`docs.claude.com/en/docs/claude-code/*`) returned 301 redirects to `code.claude.com/docs/en/*`.** No 404s; `docs.claude.com` is a stale alias.
- **Token budget for `SessionStart` / `UserPromptSubmit` hook stdout injection is NOT documented as a numeric cap.** Preflight `≤500 tokens` is a Hey Bradley convention, not a Claude Code constraint.
- **Skill description listing budget IS documented:** dynamic 1% of context window, 8,000-char fallback (env `SLASH_COMMAND_TOOL_CHAR_BUDGET`); per-entry cap 1,536 chars combined `description` + `when_to_use`. Body cap is soft "≤500 lines". Compaction re-attach: 25,000 tokens combined / 5,000 per skill.
- **Marketplace approval flow:** no Anthropic-side gate; self-published. Reserved-name list blocks impersonation only.
- **Agent hooks `type: "agent"` marked experimental** — may change.
- **`/plugin` Discover tab** implies an official curated marketplace not enumerated in fetched docs.
- **`anthropics/claude-code` GitHub** (priority 6) not fetched — four primary URLs delivered full schema.
- **Hey Bradley implication:** connections-layer plugin can be hosted as a `git-subdir` source in a Hey Bradley marketplace; omit `version` during dev to track commits, pin via `plugin.json#version` at v1.

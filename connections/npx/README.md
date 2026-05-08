# hey-bradley CLI

Spec-first planning workbench — zero-install via `npx`. See ADR-C05 for the full command surface contract.

## Install

```bash
npx hey-bradley <command>
```

Node 18+ required. No global install needed.

## Commands

### `init` — scaffold `.heybradley/`

```bash
npx hey-bradley init [--force] [--name <slug>]
```

Creates `.heybradley/` with `spec.aisp` placeholder, `config.json`, and `.gitignore`. Idempotent unless `--force`.

### `spec` — generate or refresh

```bash
npx hey-bradley spec --prompt "describe my project" [--tier silver|gold|platinum] [--offline]
npx hey-bradley spec   # re-validate existing .heybradley/spec.aisp
```

v0.1.0 stubs `--prompt` writes; live LLM generation lands in v0.2.0+.

### `export --claude-code`

```bash
npx hey-bradley export --claude-code [--output ./CLAUDE.md]
```

Emits a single markdown file with `# === FILE: <path> ===` markers per ADR-122 (≥6 logical files).

### `score` — CI gate

```bash
npx hey-bradley score [--strict] [--json]
```

Exit codes:

- `0` tier ≥ Silver AND Ambig < 0.05 (or `--strict`: tier ≥ Gold AND Ambig < 0.02)
- `1` tier below target OR Ambig too high
- `2` spec missing / unparseable

## Flags reference

| Flag | Commands | Description |
|------|----------|-------------|
| `--tier <t>` | spec | Tier target: bronze / silver / gold / platinum |
| `--offline` | spec | Rules-only classifier (no network) |
| `--output <path>` | spec, export | Custom output path |
| `--json` | score | Machine-readable JSON |
| `--force` | init | Overwrite existing `.heybradley/` |
| `--strict` | score | Require Gold tier + Ambig < 0.02 |

## BYOK + privacy

Keys are read from environment (`ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` / `OPENAI_API_KEY`) per ADR-043 and **never persisted**. `.heybradley/log.json` writes pass through `redactKeyShapes()`.

## CI example

```yaml
- run: npx hey-bradley score --strict
```

## License

MIT

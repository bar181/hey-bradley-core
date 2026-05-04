# Hey Bradley — Connections

Three connection surfaces for the [Hey Bradley](https://heybradley.app) spec
workbench: a Claude Code plugin (`plugin/`), a standalone MCP server
(`mcp/`), and a zero-install CLI (`npx/`). Single source of truth for tool
schemas lives at `connections/mcp/tools/` per **ADR-C06 D1**.

## The Plugin is Intentionally Incomplete

The plugin generates specs. It does not preview them.
Visualization, iteration, and the Builder/Listen modes
live at heybradley.app — that is by design.

Workflow:
  /spec-init "your idea"  → generates .heybradley/spec.aisp
  /spec-export            → generates CLAUDE.md
  heybradley.app          → visualize + iterate + share
  Claude Code             → execute against the spec

The connection layer is a top-of-funnel discovery surface for the AI
coding tool you already use. The web app is THE product — it is where
the spec becomes something you can see, edit, and share. The plugin
exists to make the first step (generate the spec) trivially close to
where you already work.

## Surfaces

| Path       | Surface                | Install                                   |
|------------|------------------------|-------------------------------------------|
| `plugin/`  | Claude Code plugin     | `/plugin install bar181/hey-bradley`      |
| `mcp/`     | Standalone MCP server  | `npx hey-bradley-mcp` (any MCP client)    |
| `npx/`     | Zero-install CLI       | `npx hey-bradley <command>`               |

## Reference

- [Hey Bradley repo](https://github.com/bar181/hey-bradley-core)
- [AISP open core](https://github.com/bar181/aisp-open-core)
- [Web app](https://heybradley.app)

## License

MIT

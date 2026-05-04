# hey-bradley-mcp

Standalone Model Context Protocol (MCP) server for the
[Hey Bradley](https://github.com/bar181/hey-bradley-core) spec workbench.
Cousin to the plugin-bundled stdio MCP at `connections/plugin/mcp/server.ts` —
both surfaces share a single `TOOL_DEFINITIONS` source of truth at
`connections/mcp/tools/` per **ADR-C06 D1**.

## Install

```bash
# One-shot via npx (recommended)
npx hey-bradley-mcp

# Or globally
npm i -g hey-bradley-mcp
hey-bradley-mcp
```

## Cursor integration

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "hey-bradley": {
      "command": "npx",
      "args": ["-y", "hey-bradley-mcp"]
    }
  }
}
```

Works the same way for Continue, Cline, and Claude Desktop —
any MCP client that speaks stdio.

## Transports

Per **ADR-C06 D4**:

| Mode  | Default | Flag                                  | Status (v0.1.0)        |
| ----- | ------- | ------------------------------------- | ---------------------- |
| stdio | yes     | (none)                                | Shipping               |
| http  | no      | `--transport http --port 3737`        | Scaffolded; deferred to v0.2.0 (needs Mcp-Session-Id + Origin validation + 127.0.0.1 bind) |

Env-var overrides: `MCP_TRANSPORT=http` and `MCP_PORT=3737`.

## Tools

The 5 tools defined per **ADR-C04** are:

- `get_spec` — fetch the rendered AISP spec for a phase
- `get_claude_md` — return the resolved CLAUDE.md preamble
- `validate_aisp` — validate an AISP bundle against schema + Σ contract
- `get_ddd` — return DDD bounded contexts + relationships
- `get_agent_scopes` — return AGENT_ATOM specs for a wave

See `connections/docs/adr/ADR-C04-mcp-tool-definitions.md` for full schemas.

## Build

```bash
npm install
npm run build
```

Output goes to `dist/`. The `bin` entry resolves to `dist/index.js`.

> **Wave 2 note (2026-05-04):** The Wave 1 / B4 `tools/*.ts` sources at
> `connections/mcp/tools/` use extension-less relative imports
> (e.g. `import './types'`). TS compiles them under `bundler` resolution
> cleanly, but raw Node ESM at runtime requires `.js` extensions on
> relative specifiers. Pre-publish to npm will need either a post-build
> extension-rewrite step OR a coordinated Wave 1 source touch-up to
> `from './types.js'` form. Tracked as a v0.1.0 publish blocker; tsc
> strict gate is GREEN as of this seal.

## Reference

- [Hey Bradley repo](https://github.com/bar181/hey-bradley-core)
- [AISP open core](https://github.com/bar181/aisp-open-core)
- [MCP spec](https://modelcontextprotocol.io)

## License

MIT

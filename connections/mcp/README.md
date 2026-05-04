# hey-bradley-mcp

Standalone Model Context Protocol (MCP) server for the
[Hey Bradley](https://github.com/bar181/hey-bradley-core) spec workbench.
Cousin to the plugin-bundled stdio MCP at `connections/plugin/mcp/server.ts`
— both surfaces share a single `TOOL_DEFINITIONS` source of truth at
`connections/mcp/tools/` per **ADR-C06 D1**.

## Install

```bash
npx hey-bradley-mcp        # one-shot via npx (recommended)
npm i -g hey-bradley-mcp   # or globally
```

## Cursor integration

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "hey-bradley": { "command": "npx", "args": ["-y", "hey-bradley-mcp"] }
  }
}
```

Works the same way for Continue, Cline, and Claude Desktop — any MCP
client that speaks stdio.

## Transports

Per **ADR-C06 D4**:

| Mode  | Default | Flag                                  | Status (v0.1.0)        |
| ----- | ------- | ------------------------------------- | ---------------------- |
| stdio | yes     | (none)                                | Shipping               |
| http  | no      | `--transport http --port 3737`        | Scaffolded; deferred to v0.2.0 |

HTTP transport requires ADR-C06 D4 hardening (Mcp-Session-Id, Origin
validation, 127.0.0.1 bind) and refuses to run at v0.1.0. Env-var
overrides: `MCP_TRANSPORT=http` and `MCP_PORT=3737`.

## Tools

Per **ADR-C04**: `get_spec`, `get_claude_md`, `validate_aisp`, `get_ddd`,
`get_agent_scopes`. See `connections/docs/adr/ADR-C04-mcp-tool-definitions.md`
for full schemas.

## Build

```bash
npm install
npm run build   # tsc → dist/
```

> **Wave 2 publish-blocker:** The Wave 1 / B4 `tools/*.ts` sources use
> extension-less relative imports (`from './types'`); these compile clean
> under `bundler` resolution but raw Node ESM at runtime requires `.js`
> on relative specifiers. Pre-publish needs either a post-build extension
> rewrite OR a coordinated Wave 1 source touch-up. tsc strict gate is
> GREEN as of this seal.

## Reference

- [Hey Bradley repo](https://github.com/bar181/hey-bradley-core)
- [AISP open core](https://github.com/bar181/aisp-open-core)
- [MCP spec](https://modelcontextprotocol.io)

## License

MIT

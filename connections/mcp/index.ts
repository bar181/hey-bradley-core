#!/usr/bin/env node
/**
 * Hey Bradley standalone MCP server.
 *
 * Per ADR-C06 D1 — shares the single `TOOL_DEFINITIONS` source of truth at
 * `connections/mcp/tools/` with the plugin-bundled stdio MCP at
 * `connections/plugin/mcp/server.ts` (Wave 1 / B5). Tool schemas, handlers,
 * and result content stay byte-equivalent across both surfaces.
 *
 * Per ADR-C06 D4 — defaults to stdio (matches plugin behavior; works in any
 * IDE that pipes stdin/stdout — Cursor, Continue, Cline, Claude Desktop).
 * HTTP transport opts in via `--transport http --port 3737` CLI flag OR
 * `MCP_TRANSPORT=http` + `MCP_PORT=3737` env vars and is **scaffolded but
 * refuses to run at v0.1.0** until the ADR-C06 D4 hardening lands
 * (Mcp-Session-Id / Origin validation / 127.0.0.1 bind).
 *
 * Usage:
 *   npx hey-bradley-mcp                                # stdio (default)
 *   npx hey-bradley-mcp --transport http               # HTTP (deferred to v0.2.0)
 *   npx hey-bradley-mcp --transport http --port 4000   # HTTP custom port
 *
 * Two-channel error model per ADR-C04 D6 (c) + inventory §A2:
 *   - JSON-RPC `error` for protocol failures (unknown tool, malformed params)
 *   - result `isError: true` for semantic failures (handler threw, BYOK leak)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFINITIONS } from './tools/index.js';

const VERSION = '0.1.0';
const DEFAULT_PORT = 3737;

interface CliArgs {
  transport: 'stdio' | 'http';
  port: number;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { transport: 'stdio', port: DEFAULT_PORT };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--transport') {
      const next = argv[++i];
      if (next === 'http' || next === 'stdio') args.transport = next;
    } else if (flag === '--port') {
      const next = argv[++i];
      const parsed = parseInt(next ?? '', 10);
      if (Number.isFinite(parsed) && parsed > 0) args.port = parsed;
    }
  }
  // Env-var overrides (per ADR-C06 D4)
  if (process.env.MCP_TRANSPORT === 'http') args.transport = 'http';
  if (process.env.MCP_PORT) {
    const parsed = parseInt(process.env.MCP_PORT, 10);
    if (Number.isFinite(parsed) && parsed > 0) args.port = parsed;
  }
  return args;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const server = new Server(
    { name: 'hey-bradley-mcp', version: VERSION },
    { capabilities: { tools: { listChanged: false } } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      ...(t.outputSchema ? { outputSchema: t.outputSchema } : {}),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOL_DEFINITIONS.find((t) => t.name === req.params.name);
    if (!tool) {
      // Protocol failure — JSON-RPC -32602 envelope per inventory §A2.
      throw new Error(`Unknown tool: ${req.params.name}`);
    }
    try {
      const result = await tool.handler(req.params.arguments ?? {});
      // ToolError sentinel per types.ts:27 → channel 2 semantic failure.
      if (
        result &&
        typeof result === 'object' &&
        'isError' in result &&
        (result as { isError: unknown }).isError === true
      ) {
        const errContent = (result as { content?: string }).content ?? 'tool error';
        return { isError: true, content: [{ type: 'text', text: errContent }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
      };
    }
  });

  if (args.transport === 'stdio') {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // stderr is permitted by stdio rules (inventory §A1); stdout stays clean.
    // eslint-disable-next-line no-console
    console.error(`hey-bradley-mcp v${VERSION} ready (stdio)`);
    return;
  }

  // HTTP transport — scaffolded per ADR-C06 D4; refuses to run at v0.1.0.
  // v0.2.0+ will wire StreamableHTTPServerTransport with Mcp-Session-Id +
  // MCP-Protocol-Version echo + Origin allowlist + 127.0.0.1 bind.
  // eslint-disable-next-line no-console
  console.error(`hey-bradley-mcp v${VERSION} HTTP transport requested (port ${args.port})`);
  // eslint-disable-next-line no-console
  console.error(
    'HTTP transport: scaffolded; needs ADR-C06 D4 hardening (Mcp-Session-Id, ' +
      'Origin validation, 127.0.0.1 bind) before v0.2.0. Refusing to run unhardened.',
  );
  process.exit(1);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('hey-bradley-mcp failed:', err);
  process.exit(1);
});

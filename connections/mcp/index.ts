#!/usr/bin/env node
/**
 * Hey Bradley standalone MCP server.
 *
 * Per ADR-C06 D1 — shares `TOOL_DEFINITIONS` source of truth at
 * `connections/mcp/tools/` with the plugin-bundled MCP at
 * `connections/plugin/mcp/server.ts` (Wave 1 / B5). Per ADR-C06 D4 —
 * defaults to stdio (Cursor / Continue / Cline / Claude Desktop). HTTP
 * via `--transport http --port 3737` flag or `MCP_TRANSPORT` /
 * `MCP_PORT` env vars; **scaffolded but refuses to run at v0.1.0**
 * until D4 hardening (Mcp-Session-Id / Origin / 127.0.0.1 bind).
 *
 * Two-channel error model per ADR-C04 D6 (c) + inventory §A2:
 *   - JSON-RPC `error` for protocol failures (unknown tool, bad params)
 *   - result `isError: true` for semantic failures (handler threw)
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

interface CliArgs { transport: 'stdio' | 'http'; port: number }

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { transport: 'stdio', port: DEFAULT_PORT };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--transport') {
      const next = argv[++i];
      if (next === 'http' || next === 'stdio') args.transport = next;
    } else if (argv[i] === '--port') {
      const parsed = parseInt(argv[++i] ?? '', 10);
      if (Number.isFinite(parsed) && parsed > 0) args.port = parsed;
    }
  }
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
    if (!tool) throw new Error(`Unknown tool: ${req.params.name}`);
    try {
      const result = await tool.handler(req.params.arguments ?? {});
      if (
        result && typeof result === 'object' && 'isError' in result &&
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
    await server.connect(new StdioServerTransport());
    // eslint-disable-next-line no-console
    console.error(`hey-bradley-mcp v${VERSION} ready (stdio)`);
    return;
  }

  // HTTP scaffolded per ADR-C06 D4; refuses to run at v0.1.0.
  // eslint-disable-next-line no-console
  console.error(`hey-bradley-mcp v${VERSION} HTTP requested (port ${args.port})`);
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

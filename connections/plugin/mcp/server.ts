#!/usr/bin/env node
/**
 * Hey Bradley plugin-bundled MCP server (stdio transport).
 *
 * Per ADR-C06 D1 — shares the single TOOL_DEFINITIONS source of truth at
 * `connections/mcp/tools/` (B4-owned) with the standalone MCP at
 * `connections/mcp/index.ts` (Wave 2). Plugin runtime spawns this script as
 * a subprocess per inventory-mcp-aisp.md §A1 stdio rules: read JSON-RPC from
 * stdin, write responses to stdout, no extraneous stdout writes.
 *
 * SDK package — verified on disk at @modelcontextprotocol/sdk@1.28.0 (single
 * combined package, NOT split server/client). This resolves the open Phase-2
 * prereq from inventory-mcp-aisp.md §A4 Gap #2 (preflight quoted split-package
 * names; literal `package.json` confirms combined). Subpath imports use
 * `@modelcontextprotocol/sdk/server/index.js` and `/server/stdio.js` per the
 * `exports` map.
 *
 * Phase-2 prereq follow-up: `npm install @modelcontextprotocol/sdk` must be
 * recorded in the plugin's package.json (currently resolved via repo-root
 * node_modules — plugin build path TBD per ADR-C06 D3).
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
// B4-owned barrel — exports TOOL_DEFINITIONS: ToolDef[] per ADR-C06 D2.
// Path is `../../mcp/tools/index.js` relative to compiled output.
import { TOOL_DEFINITIONS } from '../../mcp/tools/index.js';

async function main(): Promise<void> {
  const server = new Server(
    { name: 'hey-bradley-mcp', version: '0.1.0' },
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
      // Protocol failure — unknown tool name. Surface via JSON-RPC error
      // by throwing; SDK envelopes as `-32602` per inventory §A2.
      throw new Error(`Unknown tool: ${req.params.name}`);
    }
    try {
      const result = await tool.handler(req.params.arguments ?? {});
      // ToolDef handler may return a ToolError sentinel `{ isError: true,
      // content: string }` for semantic failures per types.ts:27.
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
      // Handler threw — semantic failure per ADR-C04 D6 (c) channel 2.
      return {
        isError: true,
        content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  // stderr is permitted by the stdio transport rules (inventory §A1);
  // stdout MUST stay clean for JSON-RPC frames only.
  // eslint-disable-next-line no-console
  console.error('hey-bradley-mcp failed:', err);
  process.exit(1);
});

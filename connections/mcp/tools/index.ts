// connections/mcp/tools/index.ts
// Barrel export — single source of truth for the 5 MCP tools per ADR-C06 D1+D2.
// Both the plugin-bundled stdio MCP (B5) and the standalone MCP (Wave 2) import from here.

import type { ToolDef } from './types';
import { getSpec } from './get-spec';
import { getClaudeMd } from './get-claude-md';
import { validateAisp } from './validate-aisp';
import { getDdd } from './get-ddd';
import { getAgentScopes } from './get-agent-scopes';

export type { ToolDef, ToolName, ToolMeta, ToolError } from './types';
export { getSpec } from './get-spec';
export { getClaudeMd } from './get-claude-md';
export { validateAisp } from './validate-aisp';
export { getDdd } from './get-ddd';
export { getAgentScopes } from './get-agent-scopes';

export const TOOL_DEFINITIONS: ToolDef[] = [
  getSpec as ToolDef,
  getClaudeMd as ToolDef,
  validateAisp as ToolDef,
  getDdd as ToolDef,
  getAgentScopes as ToolDef,
];

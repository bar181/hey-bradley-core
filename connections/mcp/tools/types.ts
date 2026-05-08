// connections/mcp/tools/types.ts
// Shared MCP tool definition shapes per ADR-C04 + ADR-C06 D2.
// One source of truth consumed by both plugin-bundled stdio MCP (B5)
// and the standalone npm MCP (Wave 2).

export type ToolName =
  | 'get_spec'
  | 'get_claude_md'
  | 'validate_aisp'
  | 'get_ddd'
  | 'get_agent_scopes';

/**
 * Optional `_meta` envelope attached to every tool input per ADR-C04 D6 —
 * lets callers correlate tool calls into the 3-level ID hierarchy
 * (`session_id → request_id → event_id`) per ADR-126 D2.
 */
export interface ToolMeta {
  session_id?: string;
}

/**
 * Two-channel error model per inventory-mcp-aisp.md §A2 + ADR-C04 D6 (c):
 *  - protocol failures → JSON-RPC `-32602 invalid params` (thrown / outer error)
 *  - semantic failures → result with `isError: true` + `content` string
 */
export interface ToolError {
  isError: true;
  content: string;
}

export interface ToolDef<I = unknown, O = unknown> {
  name: ToolName;
  description: string;
  /** JSON Schema (object shape — no runtime json-schema dep per ADR-C06 D1). */
  inputSchema: object;
  /** Optional structured-output JSON Schema. */
  outputSchema?: object;
  handler: (input: I) => Promise<O | ToolError>;
}

/**
 * Defence-in-depth BYOK boundary scan per ADR-043 + ADR-114 D3.
 * Returns true if any candidate string smells like an API key shape.
 */
export function detectByokLeak(value: unknown): boolean {
  const re = /(sk-|AIza|Bearer\s)/;
  const visit = (v: unknown): boolean => {
    if (typeof v === 'string') return re.test(v);
    if (Array.isArray(v)) return v.some(visit);
    if (v && typeof v === 'object') return Object.values(v).some(visit);
    return false;
  };
  return visit(value);
}

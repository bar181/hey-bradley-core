// connections/mcp/tools/get-ddd.ts
// MCP tool: get_ddd — run DDD_ATOM over description or stored spec.
// Per ADR-C04 §D4 + mcp-get-ddd.aisp + ADR-119.
// v0.1.0 STUB — wraps a canned 4-context DomainModel; wire to classifyContexts() + toDomainModel() in v0.2.0+.

import { detectByokLeak, type ToolDef, type ToolMeta } from './types';

type SourceType = 'description' | 'spec_id';

interface GetDddInput {
  source: { type: SourceType; value: string };
  _meta?: ToolMeta;
}

interface Context { name: string; role: string; description: string }
type RelKind = 'partnership' | 'customer-supplier' | 'conformist' | 'anti-corruption-layer';
interface Relationship { from: string; to: string; kind: RelKind; rationale: string }
interface GetDddOutput { contexts: Context[]; relationships: Relationship[] }

export const getDdd: ToolDef<GetDddInput, GetDddOutput> = {
  name: 'get_ddd',
  description:
    'Run DDD_ATOM over a project description or stored spec; return bounded contexts + relationships per ADR-119 (|contexts| ≤ 8, 4 relationship kinds). v0.1.0 STUB returns canned model.',
  inputSchema: {
    type: 'object',
    properties: {
      source: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['description', 'spec_id'] },
          value: { type: 'string', minLength: 1 },
        },
        required: ['type', 'value'],
      },
      _meta: { type: 'object', properties: { session_id: { type: 'string' } } },
    },
    required: ['source'],
    additionalProperties: false,
  },
  outputSchema: {
    type: 'object',
    properties: { contexts: { type: 'array' }, relationships: { type: 'array' } },
    required: ['contexts', 'relationships'],
  },
  async handler(input) {
    if (detectByokLeak(input)) {
      return { isError: true, content: 'BYOK key shape detected in input — rejected per ADR-043' };
    }
    const src = input?.source;
    if (!src || (src.type !== 'description' && src.type !== 'spec_id')) {
      return { isError: true, content: 'source.type must be "description" or "spec_id"' };
    }
    if (typeof src.value !== 'string' || src.value.length < 1) {
      return { isError: true, content: 'source.value is required and must be non-empty' };
    }
    if (src.type === 'description' && src.value.length < 10) {
      return { isError: true, content: 'description value must be ≥ 10 chars' };
    }
    // v0.1.0 STUB — canned 4-context + 3-relationship model per ADR-119 Γ R1/R3/R4
    return {
      contexts: [
        { name: 'Auth', role: 'identity', description: 'User authentication + sessions' },
        { name: 'Billing', role: 'finance', description: 'Subscription + invoicing' },
        { name: 'Catalog', role: 'core', description: 'Product / content listing' },
        { name: 'Notifications', role: 'infrastructure', description: 'Email + push delivery' },
      ],
      relationships: [
        { from: 'Auth', to: 'Billing', kind: 'customer-supplier', rationale: 'Billing consumes user identity' },
        { from: 'Catalog', to: 'Auth', kind: 'conformist', rationale: 'Catalog reads identity for personalization' },
        { from: 'Notifications', to: 'Billing', kind: 'anti-corruption-layer', rationale: 'Notifications shield against billing event volatility' },
      ],
    };
  },
};

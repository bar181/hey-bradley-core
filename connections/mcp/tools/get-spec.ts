// connections/mcp/tools/get-spec.ts
// MCP tool: get_spec — generate Hey Bradley AISP-compliant spec.
// Per ADR-C04 §D1 + mcp-get-spec.aisp.
// v0.1.0 STUB — wire to web-app spec generators in v0.2.0+ (CF#4 owner-required BYOK).

import { detectByokLeak, type ToolDef, type ToolMeta } from './types';

interface GetSpecInput {
  description: string;
  include_aisp?: boolean;
  tier_target?: 'bronze' | 'silver' | 'gold' | 'platinum';
  _meta?: ToolMeta;
}

interface AispBlock { atom: string; body: string; ambig: number; density: number }

interface GetSpecOutput {
  slug: string;
  humanSpec: string;
  northStar: string;
  sadd: string;
  implementationPlan: string;
  aisp: AispBlock[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  ambig: number;
  density: number;
}

export const getSpec: ToolDef<GetSpecInput, GetSpecOutput> = {
  name: 'get_spec',
  description:
    'Generate Hey Bradley AISP-compliant spec from plain-text description. v0.1.0 returns deterministic stub; live LLM-enriched output requires owner BYOK activation (CF#4).',
  inputSchema: {
    type: 'object',
    properties: {
      description: { type: 'string', minLength: 10, maxLength: 4000 },
      include_aisp: { type: 'boolean', default: true },
      tier_target: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'silver' },
      _meta: { type: 'object', properties: { session_id: { type: 'string' } } },
    },
    required: ['description'],
    additionalProperties: false,
  },
  outputSchema: {
    type: 'object',
    properties: {
      slug: { type: 'string' }, humanSpec: { type: 'string' }, northStar: { type: 'string' },
      sadd: { type: 'string' }, implementationPlan: { type: 'string' }, aisp: { type: 'array' },
      tier: { type: 'string' }, ambig: { type: 'number' }, density: { type: 'number' },
    },
    required: ['slug', 'humanSpec', 'northStar', 'sadd', 'implementationPlan', 'aisp', 'tier', 'ambig', 'density'],
  },
  async handler(input) {
    if (detectByokLeak(input)) {
      return { isError: true, content: 'BYOK key shape detected in input — rejected per ADR-043' };
    }
    const desc = input?.description ?? '';
    if (typeof desc !== 'string' || desc.length < 10 || desc.length > 4000) {
      return { isError: true, content: 'description must be a string of 10..4000 chars' };
    }
    const tier = input?.tier_target ?? 'silver';
    const slug = desc.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'spec';
    // v0.1.0 STUB — wire to src/lib/specGenerators/ in v0.2.0+
    return {
      slug,
      humanSpec: `# ${slug}\n\n${desc}\n\n(stub — v0.1.0)`,
      northStar: `North Star (stub): ${desc.slice(0, 80)}`,
      sadd: '## SADD (stub)\n\nBounded contexts to be derived from DDD_ATOM in v0.2.0+',
      implementationPlan: '## Implementation Plan (stub)\n\n- Phase 1: scaffolding\n- Phase 2: pipeline wire',
      aisp: ['INTENT', 'PATCH', 'SELECTION', 'CONTENT', 'ASSUMPTIONS'].map((a) => ({
        atom: a, body: '⟦ Ω := { ... } ⟧', ambig: 0.04, density: 0.42,
      })),
      tier,
      ambig: 0.04,
      density: 0.42,
    };
  },
};

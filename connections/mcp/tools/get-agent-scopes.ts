// connections/mcp/tools/get-agent-scopes.ts
// MCP tool: get_agent_scopes — run AGENT_ATOM over sprint scope.
// Per ADR-C04 §D5 + mcp-get-agent-scopes.aisp + ADR-120.
// v0.1.0 STUB — canned waves; wire to classifyAgents() in v0.2.0+.

import { detectByokLeak, type ToolDef, type ToolMeta } from './types';

interface GetAgentScopesInput { sprint_scope: string; wave_count?: number; _meta?: ToolMeta }
interface Agent { role: string; scope: string; ownedFiles: string[]; dod: string[] }
interface Wave { id: string; agents: Agent[] }
interface GetAgentScopesOutput { waves: Wave[] }

const STUB_WAVES: Wave[] = [
  { id: 'wave-1', agents: [
    { role: 'scaffolder', scope: 'Set up directory structure', ownedFiles: ['src/index.ts', 'src/config.ts'], dod: ['Tree present', 'Config validates'] },
    { role: 'tester', scope: 'Baseline test harness', ownedFiles: ['tests/setup.ts', 'tests/baseline.spec.ts'], dod: ['Runner GREEN'] },
  ] },
  { id: 'wave-2', agents: [
    { role: 'integrator', scope: 'Wire pipeline', ownedFiles: ['src/pipeline.ts'], dod: ['Pipeline emits'] },
    { role: 'closer', scope: 'EOP triplet', ownedFiles: ['plans/seal/post-review.md', 'plans/seal/session-log.md', 'plans/seal/retrospective.md'], dod: ['Triplet present'] },
  ] },
  { id: 'wave-3', agents: [{ role: 'reviewer', scope: 'Brutal review', ownedFiles: ['plans/review/04-brutal-review.md'], dod: ['Report ≤300 LOC'] }] },
  { id: 'wave-4', agents: [{ role: 'persona-scorer', scope: 'Re-score', ownedFiles: ['plans/review/personas.md'], dod: ['3 scored'] }] },
  { id: 'wave-5', agents: [{ role: 'release-manager', scope: 'Tag + publish', ownedFiles: ['CHANGELOG.md'], dod: ['Tag pushed'] }] },
];

export const getAgentScopes: ToolDef<GetAgentScopesInput, GetAgentScopesOutput> = {
  name: 'get_agent_scopes',
  description:
    'Run AGENT_ATOM over a sprint scope; return waves with disjoint-ownedFiles AgentSpec[] per ADR-120 (|agents| ≤ 7, disjoint per wave, kebab-case role). v0.1.0 STUB.',
  inputSchema: {
    type: 'object',
    properties: {
      sprint_scope: { type: 'string', minLength: 1 },
      wave_count: { type: 'integer', minimum: 1, maximum: 5, default: 2 },
      _meta: { type: 'object', properties: { session_id: { type: 'string' } } },
    },
    required: ['sprint_scope'],
    additionalProperties: false,
  },
  outputSchema: { type: 'object', properties: { waves: { type: 'array' } }, required: ['waves'] },
  async handler(input) {
    if (detectByokLeak(input)) {
      return { isError: true, content: 'BYOK key shape detected in input — rejected per ADR-043' };
    }
    const scope = input?.sprint_scope ?? '';
    if (typeof scope !== 'string' || scope.length < 1) {
      return { isError: true, content: 'sprint_scope is required and must be non-empty' };
    }
    const requested = input?.wave_count ?? 2;
    if (typeof requested !== 'number' || !Number.isInteger(requested) || requested < 1 || requested > 5) {
      return { isError: true, content: 'wave_count must be integer in [1..5]' };
    }
    return { waves: STUB_WAVES.slice(0, requested) };
  },
};

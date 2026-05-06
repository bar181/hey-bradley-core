// connections/mcp/tools/validate-aisp.ts
// MCP tool: validate_aisp — score AISP Crystal Atom text (δ density + Ambig + tier).
// Per ADR-C04 §D3 + mcp-validate-aisp.aisp.
//
// v0.2.0 — heuristic scoring extracted to shared `src/lib/aisp-score/`
// per P112 / ADR-140 (G1 stopgap). Web app + this MCP tool + NPX `score`
// all import the same `scoreAisp(text)` helper. Real WASM validator via
// `aisp-core` Rust crate lands in Wave 4 (ADR-C07 D1).

import { detectByokLeak, type ToolDef, type ToolMeta } from './types';
import { scoreAisp, type AispTier } from '../../../src/lib/aisp-score/index';

interface ValidateAispInput {
  aisp_text: string;
  target_tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'reject';
  _meta?: ToolMeta;
}

interface ValidateAispOutput {
  density: number;
  ambig: number;
  tier: AispTier;
  parse_total: number;
  parse_unique: number;
  errors: string[];
}

export const validateAisp: ToolDef<ValidateAispInput, ValidateAispOutput> = {
  name: 'validate_aisp',
  description:
    'Score AISP Crystal Atom text — return δ density + Ambig + tier per `validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂` upstream. v0.2.0 heuristic stopgap (shared `src/lib/aisp-score/`); WASM validator deferred (ADR-C07 / ADR-140).',
  inputSchema: {
    type: 'object',
    properties: {
      aisp_text: { type: 'string', minLength: 1 },
      target_tier: { type: 'string', enum: ['platinum', 'gold', 'silver', 'bronze', 'reject'] },
      _meta: { type: 'object', properties: { session_id: { type: 'string' } } },
    },
    required: ['aisp_text'],
    additionalProperties: false,
  },
  outputSchema: {
    type: 'object',
    properties: {
      density: { type: 'number' }, ambig: { type: 'number' }, tier: { type: 'string' },
      parse_total: { type: 'integer' }, parse_unique: { type: 'integer' },
      errors: { type: 'array', items: { type: 'string' } },
    },
    required: ['density', 'ambig', 'tier', 'parse_total', 'parse_unique', 'errors'],
  },
  async handler(input) {
    if (detectByokLeak(input)) {
      return { isError: true, content: 'BYOK key shape detected in input — rejected per ADR-043' };
    }
    // Soft-error contract per ADR-C04 §D3 — unparseable returns tier=Reject inside result, not -32602.
    const text = input?.aisp_text ?? '';
    return scoreAisp(text);
  },
};

// connections/mcp/tools/validate-aisp.ts
// MCP tool: validate_aisp — score AISP Crystal Atom text (δ density + Ambig + tier).
// Per ADR-C04 §D3 + mcp-validate-aisp.aisp.
// v0.1.0 STUB — heuristic regex-based scoring; real WASM validator via aisp-core lands in Wave 4 (ADR-C07 D1).

import { detectByokLeak, type ToolDef, type ToolMeta } from './types';

interface ValidateAispInput {
  aisp_text: string;
  target_tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'reject';
  _meta?: ToolMeta;
}

type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Reject';

interface ValidateAispOutput {
  density: number;
  ambig: number;
  tier: Tier;
  parse_total: number;
  parse_unique: number;
  errors: string[];
}

// Subset of Σ_512 symbols common in Crystal Atom bodies — heuristic only.
// Real validator (ADR-C07) consults the canonical 512-symbol table.
const SIGMA_HEURISTIC = /[⟦⟧⟨⟩∀∃∈∉∋∌≜≡≠≤≥⊆⊇⊂⊃∪∩→⇒⇔𝕊𝔹𝔸𝕋𝕄𝕊𝕀𝕆𝕌𝕍𝕎𝕏𝕐ℕℝℤℚℂΣΩΓΛΕΨδρθλΦΠ⊥⊤◊⊘⊰⊱·∘∧∨¬]/u;

function classifyTier(density: number): Tier {
  if (density >= 0.75) return 'Platinum';
  if (density >= 0.6) return 'Gold';
  if (density >= 0.4) return 'Silver';
  if (density >= 0.2) return 'Bronze';
  return 'Reject';
}

export const validateAisp: ToolDef<ValidateAispInput, ValidateAispOutput> = {
  name: 'validate_aisp',
  description:
    'Score AISP Crystal Atom text — return δ density + Ambig + tier per `validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂` upstream. v0.1.0 STUB uses heuristic regex; WASM validator deferred (ADR-C07).',
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
      density: { type: 'number' },
      ambig: { type: 'number' },
      tier: { type: 'string' },
      parse_total: { type: 'integer' },
      parse_unique: { type: 'integer' },
      errors: { type: 'array', items: { type: 'string' } },
    },
    required: ['density', 'ambig', 'tier', 'parse_total', 'parse_unique', 'errors'],
  },
  async handler(input) {
    if (detectByokLeak(input)) {
      return { isError: true, content: 'BYOK key shape detected in input — rejected per ADR-043' };
    }
    const text = input?.aisp_text ?? '';
    // Soft-error contract per ADR-C04 §D3 — unparseable returns tier=Reject inside result, not -32602.
    if (typeof text !== 'string' || text.length === 0) {
      return { density: 0, ambig: 1, tier: 'Reject', parse_total: 0, parse_unique: 0, errors: ['EAispUnparseable: empty input'] };
    }
    const tokens = text.split(/\s+/).filter(Boolean);
    const total = tokens.length;
    const sigmaHits = tokens.filter((t) => SIGMA_HEURISTIC.test(t)).length;
    const unique = new Set(tokens).size;
    const density = total === 0 ? 0 : Math.min(1, sigmaHits / total);
    const ambig = total === 0 ? 1 : Math.max(0, 1 - unique / total);
    const tier = classifyTier(density);
    return { density, ambig, tier, parse_total: total, parse_unique: unique, errors: [] };
  },
};

// src/lib/aisp-score/index.ts
//
// AISP δ density + Ambig heuristic scorer — pure module, no I/O.
//
// **Stopgap per P112 / ADR-140.** The canonical scorer is the upstream
// `aisp` Rust crate (ADR-C07 D1, Wave 4 — 60-day upstream window). Until
// the WASM build lands, this regex-based heuristic is the shared
// implementation consumed by:
//   - `connections/mcp/tools/validate-aisp.ts` (MCP tool)
//   - `connections/npx/` (`score` subcommand)
//   - the web app (future SpecWorkbench inline score chip)
//
// Atom-purity per ADR-134 — module lives at `src/lib/aisp-score/`, NOT at
// `src/contexts/intelligence/aisp/` (that path is reserved for AISP atom
// modules: PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS/DECOMP/PROCESS/DDD/AGENT).
//
// Formulas (per upstream `AI_GUIDE.md` §B2):
//   δ ≜ |{tokens ∈ Σ_512}| / |{tokens}|              [HIGHER better; ≥ 0.75 = Platinum]
//   Ambig ≜ 1 - |Parse_u(D)| / |Parse_t(D)|          [LOWER better; < 0.02 production]
//
// This stopgap implements Ambig differently than the upstream parse-tree
// shape: we count fuzzy-marker tokens (TBD/various/etc/TODO/FIXME/???)
// per non-empty line and clamp to [0,1]. The real Ambig requires the
// crate's parser; ADR-140 D1 documents this explicitly.

import { SYMBOL_REGEX } from './symbolTable';

export type AispTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Reject';

export interface AispScore {
  /** δ — ratio of AISP-symbol tokens to all non-whitespace tokens. HIGHER better. */
  density: number;
  /** Ambig — heuristic ambiguity ∈ [0,1]. LOWER better. */
  ambig: number;
  /** Tier classification ⌈⌉ ∘ δ. */
  tier: AispTier;
  /** Total non-empty lines (proxy for parse-tree size). */
  parse_total: number;
  /** Count of `⟦…⟧` block-marker spans (proxy for unique parses). */
  parse_unique: number;
  /** Soft-error list (e.g. empty input); never throws. */
  errors: string[];
}

/**
 * Tier mapping per upstream AISP v5.1 spec table:
 *   Platinum δ ≥ 0.75 · Gold δ ≥ 0.60 · Silver δ ≥ 0.40 · Bronze δ ≥ 0.20 · Reject δ < 0.20.
 */
const TIERS: Array<{ name: AispTier; min: number }> = [
  { name: 'Platinum', min: 0.75 },
  { name: 'Gold', min: 0.6 },
  { name: 'Silver', min: 0.4 },
  { name: 'Bronze', min: 0.2 },
  { name: 'Reject', min: 0 },
];

const AMBIG_MARKERS = /\b(TBD|various|etc|TODO|FIXME|\?\?\?)\b/gi;
const BLOCK_MARKER = /⟦[^⟧]*⟧/gu;

/**
 * Pure heuristic AISP scorer. Soft-errors via `errors[]`; never throws.
 *
 * @param text raw AISP Crystal Atom (or any spec text) to score
 * @returns AispScore with δ density + Ambig + tier + parse hints
 */
export function scoreAisp(text: string): AispScore {
  const errors: string[] = [];

  if (typeof text !== 'string' || text.length === 0) {
    errors.push('EAispUnparseable: empty input');
    return { density: 0, ambig: 1, tier: 'Reject', parse_total: 0, parse_unique: 0, errors };
  }

  // δ density — symbol matches over non-whitespace token count.
  const symbolMatches = text.match(SYMBOL_REGEX) ?? [];
  const tokens = text.split(/\s+/).filter((t) => t.length > 0);
  const density = tokens.length === 0 ? 0 : Math.min(1, symbolMatches.length / tokens.length);

  // Ambig heuristic — fuzzy-marker count per non-empty line, clamped to [0,1].
  // Real Ambig (parse-tree-based) needs the upstream `aisp` crate; this is
  // an honest-but-coarse stopgap per ADR-140 D1.
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const ambigMarkers = (text.match(AMBIG_MARKERS) ?? []).length;
  const ambig = lines.length === 0 ? 1 : Math.min(1, ambigMarkers / lines.length + 0.01);

  const tier = TIERS.find((t) => density >= t.min)?.name ?? 'Reject';

  const parse_total = lines.length;
  const parse_unique = (text.match(BLOCK_MARKER) ?? []).length;

  return {
    density: Number(density.toFixed(3)),
    ambig: Number(ambig.toFixed(3)),
    tier,
    parse_total,
    parse_unique,
    errors,
  };
}

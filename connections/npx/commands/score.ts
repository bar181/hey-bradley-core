// connections/npx/commands/score.ts
// `hey-bradley score` — δ density + Ambig + tier verdict per ADR-C05 D5 + npx-score.aisp.
// Mirrors connections/mcp/tools/validate-aisp.ts heuristic so MCP + NPX emit identical values.

import { parseFlags, readSpec, logEvent } from './utils.js';

export type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Reject';

export interface ScoreResult {
  density: number;
  ambig: number;
  tier: Tier;
  parse_total: number;
  parse_unique: number;
}

// Subset of Σ_512 symbols common in Crystal Atom bodies — heuristic only.
// Mirror of MCP validate-aisp.ts for single-source-of-truth per ADR-C04 single-source-of-truth.
const SIGMA_HEURISTIC =
  /[⟦⟧⟨⟩∀∃∈∉∋∌≜≡≠≤≥⊆⊇⊂⊃∪∩→⇒⇔𝕊𝔹𝔸𝕋𝕄𝕀𝕆𝕌𝕍𝕎𝕏𝕐ℕℝℤℚℂΣΩΓΛΕΨδρθλΦΠ⊥⊤◊⊘⊰⊱·∘∧∨¬]/u;

const TIER_RANK: Record<Tier, number> = {
  Reject: 0,
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
};

function classifyTier(density: number): Tier {
  if (density >= 0.75) return 'Platinum';
  if (density >= 0.6) return 'Gold';
  if (density >= 0.4) return 'Silver';
  if (density >= 0.2) return 'Bronze';
  return 'Reject';
}

export function tierMeetsTarget(actual: Tier, target: Tier): boolean {
  const a = TIER_RANK[actual];
  const t = TIER_RANK[target];
  return a !== undefined && t !== undefined && a >= t;
}

export function scoreAisp(text: string): ScoreResult {
  if (typeof text !== 'string' || text.length === 0) {
    return { density: 0, ambig: 1, tier: 'Reject', parse_total: 0, parse_unique: 0 };
  }
  const tokens = text.split(/\s+/).filter(Boolean);
  const total = tokens.length;
  const sigmaHits = tokens.filter((t) => SIGMA_HEURISTIC.test(t)).length;
  const unique = new Set(tokens).size;
  const density = total === 0 ? 0 : Math.min(1, sigmaHits / total);
  const ambig = total === 0 ? 1 : Math.max(0, 1 - unique / total);
  return { density, ambig, tier: classifyTier(density), parse_total: total, parse_unique: unique };
}

export async function runScore(argv: string[]): Promise<number> {
  const { flags } = parseFlags(argv);
  const cwd = process.cwd();
  const strict = flags.strict === true;
  const json = flags.json === true;

  const text = readSpec(cwd);
  if (text === null) {
    const msg = 'ESpecMissing: .heybradley/spec.aisp not found.';
    if (json) console.log(JSON.stringify({ error: msg, exit_code: 2 }));
    else console.error(msg);
    logEvent(cwd, { cmd: 'score', exit: 2, reason: 'ESpecMissing' });
    return 2;
  }

  const r = scoreAisp(text);
  const minDensity = strict ? 0.6 : 0.4;
  const maxAmbig = strict ? 0.02 : 0.05;
  const ok = r.density >= minDensity && r.ambig < maxAmbig;
  const exitCode = ok ? 0 : 1;

  if (json) {
    console.log(JSON.stringify({ density: r.density, ambig: r.ambig, tier: r.tier, exit_code: exitCode }));
  } else {
    console.log(`δ density: ${r.density.toFixed(3)} (min ${minDensity})`);
    console.log(`Ambig:     ${r.ambig.toFixed(3)} (max ${maxAmbig})`);
    console.log(`tier:      ${r.tier}`);
    console.log(`verdict:   ${ok ? 'PASS' : 'FAIL'}${strict ? ' (--strict)' : ''}`);
  }
  logEvent(cwd, { cmd: 'score', exit: exitCode, tier: r.tier, strict });
  return exitCode;
}

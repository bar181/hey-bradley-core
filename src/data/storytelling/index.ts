/**
 * Storytelling preset library — entry module
 *
 * Pure module per ADR-134. NO fs / React / store imports.
 * Public surface for chat + listen + builder pipelines that need voice
 * differentiation. Authored by Hey Bradley P113 / A2.
 */

import { STORYTELLING_PRESETS } from "./presets";

export interface StorytellingPreset {
  /** Kebab-case stable id; safe for URLs, JSON keys, and analytics. */
  readonly id: string;
  /** Human-readable name for UI surfaces. */
  readonly name: string;
  /** One-line summary of what this archetype does. */
  readonly description: string;
  /** 3-5 attributes that align with site.voiceAttributes on MasterConfig. */
  readonly voiceAttributes: readonly string[];
  /** How an article / blog post / page using this preset opens. */
  readonly openingPattern: string;
  /** Structural rhythm of the body — what beats follow each other. */
  readonly bodyPattern: string;
  /** How the piece ends — the landing move. */
  readonly closePattern: string;
  /** ~50-word example written IN voice; demonstrates the pattern. */
  readonly samplePassage: string;
  /** Surface types this preset suits best (blog, marketing, about-page, etc.). */
  readonly bestFor: readonly string[];
}

export { STORYTELLING_PRESETS };

/**
 * Look up a preset by its kebab-case id.
 * Case-sensitive — caller is expected to use the canonical id.
 */
export function getPresetByName(
  name: string,
): StorytellingPreset | undefined {
  if (!name) return undefined;
  return STORYTELLING_PRESETS.find((p) => p.id === name || p.name === name);
}

/**
 * Pick the preset whose voiceAttributes overlap most with the supplied
 * attributes. Returns undefined when no preset shares ≥1 attribute.
 *
 * Matching is case-insensitive and ignores leading/trailing whitespace.
 * Tie-break: stable order — first preset in STORYTELLING_PRESETS wins.
 */
export function getPresetForVoice(
  voiceAttributes: string[],
): StorytellingPreset | undefined {
  if (!voiceAttributes || voiceAttributes.length === 0) return undefined;
  const normalized = new Set(
    voiceAttributes
      .map((a) => (typeof a === "string" ? a.trim().toLowerCase() : ""))
      .filter((a) => a.length > 0),
  );
  if (normalized.size === 0) return undefined;

  let best: StorytellingPreset | undefined;
  let bestScore = 0;
  for (const preset of STORYTELLING_PRESETS) {
    let score = 0;
    for (const attr of preset.voiceAttributes) {
      if (normalized.has(attr.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      best = preset;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : undefined;
}

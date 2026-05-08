/**
 * Sprint N P57 Wave 2 (Agent N3) — "Built with Hey Bradley" attribution helper.
 *
 * Single source of truth for the attribution line shown on shareable artifacts
 * (static HTML export — N1, hosted spec link — N2). Defaults ON for open core;
 * Pro users can opt out via the Settings drawer (AttributionToggle).
 *
 * Storage: kv['attribution_enabled'] — string 'true' | 'false'. Missing key
 * defaults to true so first-run users always carry attribution.
 *
 * NO new deps. Pure data module — no React, no DOM, no testids.
 */

import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv';

const ATTRIBUTION_KEY = 'attribution_enabled';

/**
 * Canonical attribution string. Used everywhere a "Built with Hey Bradley"
 * footer surfaces (static HTML export, hosted spec link, share toast).
 * Reads like a real product credit — short, professional, branded URL.
 *
 * P76 / OC-9: typography polish — middle-dot separator, lower-case URL,
 * no marketing fluff, no exclamation, no "open core" jargon in user-facing
 * artifacts. Keep this single string the canonical source.
 */
export const ATTRIBUTION_TEXT =
  'Built with Hey Bradley · heybradley.dev/spec';

/** Short label used inside dense UI surfaces (toasts, badges). */
export const ATTRIBUTION_LABEL = 'Hey Bradley';

/** Canonical URL paired with the attribution text. */
export const ATTRIBUTION_URL = 'https://heybradley.dev/spec';

export function getAttributionEnabled(): boolean {
  try {
    const raw = kvGet(ATTRIBUTION_KEY);
    if (raw === undefined) return true;
    return raw !== 'false';
  } catch {
    return true;
  }
}

export function setAttributionEnabled(value: boolean): void {
  try {
    kvSet(ATTRIBUTION_KEY, value ? 'true' : 'false');
  } catch {
    /* persistence failures degrade silently — UI re-reads on next render */
  }
}

export function renderAttribution(): string | null {
  return getAttributionEnabled() ? ATTRIBUTION_TEXT : null;
}

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

export const ATTRIBUTION_TEXT =
  'Built with Hey Bradley · open core · /heybradley';

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

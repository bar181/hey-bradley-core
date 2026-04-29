/**
 * Sprint J P52 (A8) — Share Spec bundle composer.
 *
 * Composes a single JSON snapshot of the user's full specification surface
 * (North Star + SADD + AISP + master config) and encodes it as a base64
 * data URL ready for clipboard sharing. NO server, NO hosted URL — locked
 * decision D5 in plans/implementation/sprint-j-personality/03-sprint-j-locked.md.
 *
 * Defence-in-depth: `redactKeyShapes` is applied to the serialized JSON
 * before encoding so any BYOK keys that may have leaked into stringified
 * error fields inside masterConfig are scrubbed (ADR-043).
 *
 * Bundle composition NEVER throws. Individual exporter failures degrade to
 * `null` for that field with a console.warn (DEV only).
 */

import type { MasterConfig } from '@/lib/schemas';
import {
  generateNorthStar,
  generateSADD,
  generateAISPSpec,
} from '@/lib/specGenerators';
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys';

const BUNDLE_VERSION = 'aisp-1.2';

export interface ShareSpecBundle {
  json: string;
  dataUrl: string;
  estimatedBytes: number;
}

function safeRun<T>(label: string, fn: () => T): T | null {
  try {
    return fn();
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[shareSpecBundle] ${label} failed:`, err);
    return null;
  }
}

export function composeShareSpecBundle(config: MasterConfig): ShareSpecBundle {
  const bundle = {
    generatedAt: new Date().toISOString(),
    version: BUNDLE_VERSION,
    northStar: safeRun('northStar', () => generateNorthStar(config)),
    sadd: safeRun('sadd', () => generateSADD(config)),
    aisp: safeRun('aisp', () => generateAISPSpec(config)),
    masterConfig: safeRun('masterConfig', () => config),
  };

  const rawJson = safeRun('serialize', () => JSON.stringify(bundle, null, 2)) ?? '{}';
  const json = redactKeyShapes(rawJson);
  const estimatedBytes = new Blob([json]).size;

  let dataUrl = '';
  try {
    // btoa requires Latin-1; encodeURIComponent + unescape handles unicode.
    const b64 = btoa(unescape(encodeURIComponent(json)));
    dataUrl = `data:application/json;base64,${b64}`;
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[shareSpecBundle] base64 encode failed:', err);
  }

  return { json, dataUrl, estimatedBytes };
}

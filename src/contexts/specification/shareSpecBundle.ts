/**
 * Share Spec bundle composer (P52 origin · P76 / OC-9 polish).
 *
 * Composes the user's full specification surface (North Star + SADD + AISP +
 * master config) and encodes it as a base64 data URL ready for clipboard or
 * static-bundle export. NO server, NO hosted URL — locked decision D5.
 *
 * P76 polish: exposes `bundleSlug()` + `bundleFilenames()` + `withVersionHeader()`
 * so the export modal (A4) can emit per-file artifacts as `{slug}-{file}-v{ver}.{ext}`
 * with a version header on each file. The original `composeShareSpecBundle()`
 * shape is preserved verbatim so `hostedSpecLink.ts` round-trip stays intact.
 */
import type { MasterConfig } from '@/lib/schemas';
import { generateNorthStar, generateSADD, generateAISPSpec } from '@/lib/specGenerators';
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys';

const BUNDLE_VERSION = 'aisp-1.2';

export interface ShareSpecBundle { json: string; dataUrl: string; estimatedBytes: number; }
export interface BundleFilenames { northstar: string; humanSpec: string; aisp: string; config: string; manifest: string; }

function safeRun<T>(label: string, fn: () => T): T | null {
  try { return fn(); } catch (err) {
    if (import.meta.env.DEV) console.warn(`[shareSpecBundle] ${label} failed:`, err);
    return null;
  }
}

/** Slug derivation: lowercase kebab-case from `site.title` ("Coffee Roaster" → "coffee-roaster"). */
export function bundleSlug(config: MasterConfig): string {
  const raw = (config.site.title || 'untitled-site').trim().toLowerCase();
  const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'untitled-site';
}

/** Per-file artifact names: `{slug}-{file}-v{version}.{ext}`. */
export function bundleFilenames(config: MasterConfig, version = '1.0'): BundleFilenames {
  const slug = bundleSlug(config);
  const v = `v${version}`;
  return {
    northstar: `${slug}-northstar-${v}.md`,
    humanSpec: `${slug}-human-spec-${v}.md`,
    aisp: `${slug}-aisp-${v}.txt`,
    config: `${slug}-config-${v}.json`,
    manifest: `${slug}-manifest-${v}.json`,
  };
}

/** Prepend a 2-line version header to any per-file artifact (md + txt safe). */
export function withVersionHeader(content: string, purpose: string, version = '1.0'): string {
  const date = new Date().toISOString().split('T')[0];
  return `# Hey Bradley AISP Bundle · v${version} · ${date}\n# ${purpose}\n\n${content}`;
}

export function composeShareSpecBundle(config: MasterConfig): ShareSpecBundle {
  const bundle = {
    generatedAt: new Date().toISOString(),
    version: BUNDLE_VERSION,
    slug: bundleSlug(config),
    filenames: bundleFilenames(config),
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
    const b64 = btoa(unescape(encodeURIComponent(json)));
    dataUrl = `data:application/json;base64,${b64}`;
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[shareSpecBundle] base64 encode failed:', err);
  }
  return { json, dataUrl, estimatedBytes };
}

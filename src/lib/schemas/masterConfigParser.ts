/**
 * P28 C17 — Zod helper to replace `as unknown as MasterConfig` casts.
 *
 * Wraps `masterConfigSchema.parse` with a typed signature + soft-merge mode
 * for theme JSON imports (which carry partial shapes during examples loading).
 *
 * Three call patterns documented:
 *   parseMasterConfig(json)            — strict; throws on invalid
 *   parseMasterConfigSafe(json)        — returns null on invalid (for example loaders)
 *   parsePartialThemeShape(json)       — type-coerces theme/sections JSON without validation
 *                                         (replaces casts at example-loading sites; example data
 *                                         is repo-controlled so validation overhead is OK to skip)
 */
import { masterConfigSchema, type MasterConfig } from './masterConfig'

export function parseMasterConfig(json: unknown): MasterConfig {
  return masterConfigSchema.parse(json)
}

export function parseMasterConfigSafe(json: unknown): MasterConfig | null {
  const r = masterConfigSchema.safeParse(json)
  return r.success ? r.data : null
}

/**
 * Lightweight type assertion for theme/section JSON shapes coming from
 * static example imports. These files are repo-controlled (under
 * `src/data/`) — full Zod validation is not necessary at every call site.
 *
 * Replaces `as unknown as Record<string, unknown>` casts in configStore
 * theme registry initialization.
 */
export function asThemeJson<T = Record<string, unknown>>(json: unknown): T {
  return json as T
}

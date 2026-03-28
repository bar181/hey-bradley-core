/**
 * Deep merge utility for JSON patch application.
 *
 * Rules (ADR-007):
 * 1. Objects → deep merge recursively
 * 2. Arrays → REPLACE entirely (never concat)
 * 3. null → DELETE the key
 * 4. undefined → SKIP (keep existing)
 * 5. Primitives → OVERWRITE
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  patch: Record<string, unknown>
): T {
  const result = { ...target }

  for (const key of Object.keys(patch)) {
    const patchValue = patch[key]
    const targetValue = result[key as keyof T]

    // Rule 4: undefined → skip
    if (patchValue === undefined) {
      continue
    }

    // Rule 3: null → delete key
    if (patchValue === null) {
      delete (result as Record<string, unknown>)[key]
      continue
    }

    // Rule 2: arrays → replace entirely
    if (Array.isArray(patchValue)) {
      ;(result as Record<string, unknown>)[key] = patchValue
      continue
    }

    // Rule 1: objects → deep merge recursively
    if (
      typeof patchValue === 'object' &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      ;(result as Record<string, unknown>)[key] = deepMerge(
        targetValue as Record<string, unknown>,
        patchValue as Record<string, unknown>
      )
      continue
    }

    // Rule 5: primitives → overwrite
    ;(result as Record<string, unknown>)[key] = patchValue
  }

  return result
}

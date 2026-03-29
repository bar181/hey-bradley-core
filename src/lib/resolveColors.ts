import type { Theme } from './schemas/masterConfig'

interface ResolvedColors {
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  accentPrimary: string
  accentSecondary: string
}

/**
 * Resolves colors from the canonical 6-slot palette.
 * Falls back to sensible defaults if palette is missing (should never happen with valid config).
 */
export function resolveColors(theme: Theme): ResolvedColors {
  if (theme.palette) {
    return {
      bgPrimary: theme.palette.bgPrimary,
      bgSecondary: theme.palette.bgSecondary,
      textPrimary: theme.palette.textPrimary,
      textSecondary: theme.palette.textSecondary,
      accentPrimary: theme.palette.accentPrimary,
      accentSecondary: theme.palette.accentSecondary,
    }
  }
  // Fallback defaults (should never hit with valid config)
  return {
    bgPrimary: '#0a0a1a',
    bgSecondary: '#12122a',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accentPrimary: '#6366f1',
    accentSecondary: '#818cf8',
  }
}

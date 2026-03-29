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
 * Bridge function (ADR-019): resolves colors from either the new 6-slot palette
 * or the old 8-slot colors system. Ensures backward compatibility.
 */
export function resolveColors(theme: Theme): ResolvedColors {
  // Prefer new palette if it exists
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

  // Fall back to old colors system
  return {
    bgPrimary: theme.colors.background,
    bgSecondary: theme.colors.surface,
    textPrimary: theme.colors.text,
    textSecondary: theme.colors.muted,
    accentPrimary: theme.colors.primary,
    accentSecondary: theme.colors.secondary,
  }
}

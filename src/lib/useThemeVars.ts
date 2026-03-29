import { useEffect } from 'react'
import { useConfigStore } from '@/store/configStore'
import { resolveColors } from '@/lib/resolveColors'

/**
 * Hook that syncs the current theme palette to CSS custom properties.
 * Attach the returned ref to the preview container element.
 *
 * CSS vars set:
 * --theme-bg, --theme-surface, --theme-text, --theme-muted, --theme-accent, --theme-accent-secondary
 * --theme-font (font family from typography)
 */
export function useThemeVars(containerRef: React.RefObject<HTMLElement | null>) {
  const theme = useConfigStore((s) => s.config.theme)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const colors = resolveColors(theme)
    el.style.setProperty('--theme-bg', colors.bgPrimary)
    el.style.setProperty('--theme-surface', colors.bgSecondary)
    el.style.setProperty('--theme-text', colors.textPrimary)
    el.style.setProperty('--theme-muted', colors.textSecondary)
    el.style.setProperty('--theme-accent', colors.accentPrimary)
    el.style.setProperty('--theme-accent-secondary', colors.accentSecondary)
    el.style.setProperty('--theme-font', theme.typography.fontFamily)

    if (import.meta.env.DEV) console.log('[themeVars] updated CSS vars', colors)
  }, [theme, containerRef])
}

import { useState } from 'react'
import { ChevronDown, ChevronRight, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { RightAccordion } from '../RightAccordion'
import { PaletteSelector } from '../simple/PaletteSelector'
import { FontSelector } from '../simple/FontSelector'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { resolveColors } from '@/lib/resolveColors'
import { tokens } from '@/styles/design-tokens'

export function ThemeExpert() {
  const theme = useConfigStore((s) => s.config.theme)
  const designLocked = useUIStore((s) => s.designLocked)
  const colors = resolveColors(theme)

  // P67c / A2 — collapse-by-default pattern (parity with section editors).
  // Theme editor has no section binding; default expanded for discoverability.
  const [expanded, setExpanded] = useState<boolean>(() => true)

  const cssVars = [
    { name: '--theme-bg', value: colors.bgPrimary },
    { name: '--theme-surface', value: colors.bgSecondary },
    { name: '--theme-text', value: colors.textPrimary },
    { name: '--theme-muted', value: colors.textSecondary },
    { name: '--theme-accent', value: colors.accentPrimary },
    { name: '--theme-accent-2', value: colors.accentSecondary },
  ]

  return (
    <div
      className="transition-all duration-200 ease-out"
      style={{ transitionDuration: tokens.motion.duration.base }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="theme-expert-body"
        data-testid="section-editor-collapse-toggle"
        className={cn(
          'flex items-center justify-between w-full px-2 py-2 mb-1 rounded-md',
          'border border-hb-border/40 bg-hb-surface/40',
          'hover:bg-hb-surface-hover transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hb-accent'
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-hb-text-muted font-medium">
            Theme
          </span>
        </span>
        {expanded ? (
          <ChevronDown size={14} className="text-hb-text-muted" />
        ) : (
          <ChevronRight size={14} className="text-hb-text-muted" />
        )}
      </button>
      {expanded && (
      <div id="theme-expert-body">
      {designLocked && (
        <div className="flex items-center gap-1.5 px-2.5 py-2 mb-3 rounded-lg bg-hb-accent/10 border border-hb-accent/20">
          <Lock size={14} className="text-hb-accent shrink-0" />
          <span className="text-xs font-medium text-hb-accent">Design locked</span>
        </div>
      )}
      {/* Color Palette */}
      <RightAccordion id="palette" label="Color Palette" defaultOpen>
        <PaletteSelector />
      </RightAccordion>

      {/* Font */}
      <RightAccordion id="font" label="Font Family">
        <FontSelector />
      </RightAccordion>

      {/* CSS Variables (read-only view) */}
      <RightAccordion id="cssVariables" label="CSS Variables">
        <div>
          {cssVars.map((v) => (
            <div key={v.name} className="flex justify-between items-center py-1.5">
              <span className="font-mono text-xs text-hb-text-muted">{v.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded border border-hb-border" style={{ backgroundColor: v.value }} />
                <span className="font-mono text-xs text-hb-text-secondary">{v.value}</span>
              </div>
            </div>
          ))}
        </div>
      </RightAccordion>
      </div>
      )}
    </div>
  )
}

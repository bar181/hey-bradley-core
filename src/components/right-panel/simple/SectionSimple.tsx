import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { THEME_REGISTRY } from '@/data/themes/index'
import { Image, Film, Sun, Moon } from 'lucide-react'
import { PaletteSelector } from './PaletteSelector'
import { FontSelector } from './FontSelector'

// ── Compact char indicator ──
function CharDot({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  const color = ratio > 1 ? 'bg-red-400' : ratio > 0.9 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <span className="flex items-center gap-1 shrink-0" title={`${current}/${max}`}>
      <span className={cn('w-1.5 h-1.5 rounded-full', color)} />
      <span className="text-[9px] text-hb-text-muted tabular-nums">{current}</span>
    </span>
  )
}

// ── Toggle + label + optional char count row ──
function Field({
  label, enabled, onToggle, charCurrent, charMax, children,
}: {
  label: string; enabled: boolean; onToggle?: (v: boolean) => void
  charCurrent?: number; charMax?: number; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch checked={enabled} onCheckedChange={onToggle} className="scale-[0.6] shrink-0" />
        )}
        <span className="text-[10px] font-medium text-hb-text-muted uppercase tracking-wide flex-1">{label}</span>
        {charCurrent !== undefined && charMax !== undefined && <CharDot current={charCurrent} max={charMax} />}
      </div>
      <div className={cn(!enabled && 'opacity-25 pointer-events-none')}>{children}</div>
    </div>
  )
}

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

interface ThemeJSON {
  meta: { slug: string; name: string; heroVariant: string }
  theme: { palette?: { bgPrimary: string; textPrimary: string; accentPrimary: string }; colors: Record<string, string> }
  sections: Array<{ style?: { background?: string } }>
}

function LayoutCard({ theme, selected, onClick }: { theme: ThemeJSON; selected: boolean; onClick: () => void }) {
  const p = theme.theme.palette || { bgPrimary: theme.theme.colors.background, textPrimary: theme.theme.colors.text, accentPrimary: theme.theme.colors.primary }
  const bg = theme.sections[0]?.style?.background || p.bgPrimary
  const v = theme.meta.heroVariant
  const isDark = ['#0', '#1', '#2', '#3'].some(c => (p.bgPrimary || '').startsWith(c))

  // Layout wireframe
  const wireframe = () => {
    if (v === 'split-right' || v === 'split-left') {
      return (
        <div className="h-14 flex items-center p-2 gap-1.5" style={{ background: bg }}>
          {v === 'split-left' && <div className="w-8 h-10 rounded bg-current/10" />}
          <div className="flex-1 space-y-1">
            <div className="w-10 h-1 rounded-sm bg-current/30" />
            <div className="w-6 h-1 rounded-sm" style={{ backgroundColor: p.accentPrimary }} />
          </div>
          {v === 'split-right' && <div className="w-8 h-10 rounded bg-current/10" />}
        </div>
      )
    }
    if (v === 'overlay') {
      return (
        <div className="h-14 relative flex items-center justify-center" style={{ background: bg }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative space-y-1 text-center">
            <div className="w-8 h-1 rounded-sm bg-white/40 mx-auto" />
            <div className="w-5 h-1 rounded-sm mx-auto" style={{ backgroundColor: p.accentPrimary }} />
          </div>
        </div>
      )
    }
    if (v === 'minimal') {
      return (
        <div className="h-14 flex items-center justify-center" style={{ background: bg }}>
          <div className="text-[8px] font-bold" style={{ color: p.textPrimary }}>Aa</div>
        </div>
      )
    }
    return (
      <div className="h-14 flex flex-col items-center justify-center gap-1" style={{ background: bg }}>
        <div className="w-8 h-1 rounded-sm bg-current/30" />
        <div className="w-5 h-1 rounded-sm" style={{ backgroundColor: p.accentPrimary }} />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border overflow-hidden transition-all text-left w-full',
        selected ? 'border-hb-accent ring-1 ring-hb-accent/30' : 'border-hb-border/40 hover:border-hb-accent/40'
      )}
    >
      <div style={{ color: p.textPrimary }}>{wireframe()}</div>
      <div className="px-2 py-1.5 bg-hb-surface flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-hb-text-primary leading-none">{theme.meta.name}</span>
        <span className={cn(
          'text-[8px] px-1 py-0.5 rounded font-medium leading-none',
          isDark ? 'bg-hb-text-muted/20 text-hb-text-muted' : 'bg-amber-500/15 text-amber-400'
        )}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      </div>
    </button>
  )
}

export function SectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const applyVibe = useConfigStore((s) => s.applyVibe)
  const selectedPreset = useConfigStore((s) => s.config.theme.preset)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const hero = resolveHeroContent(section)
  const getEnabled = (id: string, fallback = true) => section.components.find((c) => c.id === id)?.enabled ?? fallback
  const hasComp = (id: string) => section.components.some((c) => c.id === id)

  const updateCopy = useCallback(
    (componentId: string, text: string) => {
      if (import.meta.env.DEV) console.log('[copyEdit]', componentId, text)
      setSectionConfig(sectionId, { components: updateComponentProps(section, componentId, { text }) })
    }, [sectionId, section, setSectionConfig]
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      if (import.meta.env.DEV) console.log('[toggle]', componentId, checked)
      setSectionConfig(sectionId, { components: setComponentEnabled(section, componentId, checked) })
    }, [sectionId, section, setSectionConfig]
  )

  const updateUrl = useCallback(
    (componentId: string, url: string) => {
      if (import.meta.env.DEV) console.log('[urlEdit]', componentId, url)
      setSectionConfig(sectionId, {
        components: section.components.map((c) => c.id === componentId ? { ...c, props: { ...c.props, url } } : c),
      })
    }, [sectionId, section, setSectionConfig]
  )

  return (
    <div className="divide-y divide-hb-border/30">
      {/* ─── 1. LAYOUT — theme presets + background + image/video ─── */}
      <RightAccordion id="layout" label="Layout" defaultOpen>
        <div className="space-y-3">
          {/* Theme layout grid — 2 columns with labels */}
          <div>
            <div className="text-[9px] font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Preset Layout</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(THEME_REGISTRY as unknown as ThemeJSON[]).map((t) => (
                <LayoutCard
                  key={t.meta.slug}
                  theme={t}
                  selected={t.meta.slug === selectedPreset}
                  onClick={() => applyVibe(t.meta.slug)}
                />
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <div className="text-[9px] font-medium text-hb-text-muted uppercase tracking-wide mb-1">Background</div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-hb-border shrink-0"
                style={{ background: section.style.background }}
                title="Current background"
              />
              <span className="text-[10px] text-hb-text-muted truncate">{section.style.background?.slice(0, 30)}</span>
            </div>
          </div>

          {/* Image */}
          {hasComp('heroImage') && (
            <Field label="Image" enabled={getEnabled('heroImage', false)} onToggle={(v) => handleToggle('heroImage', v)}>
              <div className="flex items-center gap-1.5">
                <Image size={12} className="text-hb-text-muted shrink-0" />
                <input type="text" value={(section.components.find((c) => c.id === 'heroImage')?.props?.url as string) ?? ''} onChange={(e) => updateUrl('heroImage', e.target.value)} placeholder="Image URL..." className={cn(INPUT, 'text-xs py-1')} />
              </div>
            </Field>
          )}

          {/* Background Image */}
          {hasComp('backgroundImage') && (
            <Field label="BG Image" enabled={getEnabled('backgroundImage', false)} onToggle={(v) => handleToggle('backgroundImage', v)}>
              <div className="flex items-center gap-1.5">
                <Image size={12} className="text-hb-text-muted shrink-0" />
                <input type="text" value={(section.components.find((c) => c.id === 'backgroundImage')?.props?.url as string) ?? ''} onChange={(e) => updateUrl('backgroundImage', e.target.value)} placeholder="Background image URL..." className={cn(INPUT, 'text-xs py-1')} />
              </div>
            </Field>
          )}

          {/* Video */}
          {hasComp('heroVideo') && (
            <Field label="Video" enabled={getEnabled('heroVideo', false)} onToggle={(v) => handleToggle('heroVideo', v)}>
              <div className="flex items-center gap-1.5">
                <Film size={12} className="text-hb-text-muted shrink-0" />
                <input type="text" value={(section.components.find((c) => c.id === 'heroVideo')?.props?.url as string) ?? ''} onChange={(e) => updateUrl('heroVideo', e.target.value)} placeholder="Video URL..." className={cn(INPUT, 'text-xs py-1')} />
              </div>
            </Field>
          )}
        </div>
      </RightAccordion>

      {/* ─── 2. STYLE — font, palette, mode ─── */}
      <RightAccordion id="style" label="Style">
        <div className="space-y-3">
          {/* Font selector — rendered in each font */}
          <FontSelector />

          {/* Palette selector — 5 rows of 6 dots */}
          <PaletteSelector />

          {/* Light/Dark toggle */}
          <div>
            <div className="text-[10px] font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">Mode</div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => { if (config.theme.mode === 'dark') useConfigStore.getState().toggleMode() }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium border transition-all',
                  config.theme.mode === 'light'
                    ? 'bg-hb-accent text-white border-hb-accent'
                    : 'bg-hb-surface text-hb-text-muted border-hb-border hover:border-hb-accent/40'
                )}
              >
                <Sun size={12} /> Light
              </button>
              <button
                type="button"
                onClick={() => { if (config.theme.mode === 'light') useConfigStore.getState().toggleMode() }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium border transition-all',
                  config.theme.mode === 'dark'
                    ? 'bg-hb-accent text-white border-hb-accent'
                    : 'bg-hb-surface text-hb-text-muted border-hb-border hover:border-hb-accent/40'
                )}
              >
                <Moon size={12} /> Dark
              </button>
            </div>
          </div>
        </div>
      </RightAccordion>

      {/* ─── 3. CONTENT ─── */}
      <RightAccordion id="content" label="Content" defaultOpen>
        <div className="space-y-2.5">
          <Field label="Badge" enabled={getEnabled('eyebrow')} onToggle={(v) => handleToggle('eyebrow', v)} charCurrent={(hero.badge?.text ?? '').length} charMax={40}>
            <input type="text" value={hero.badge?.text ?? ''} onChange={(e) => updateCopy('eyebrow', e.target.value)} placeholder="e.g. New Release" className={INPUT} />
          </Field>

          <Field label="Headline" enabled={true} charCurrent={(hero.heading?.text ?? '').length} charMax={80}>
            <textarea value={hero.heading?.text ?? ''} onChange={(e) => updateCopy('headline', e.target.value)} rows={2} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Subtitle" enabled={getEnabled('subtitle')} onToggle={(v) => handleToggle('subtitle', v)} charCurrent={(hero.subheading ?? '').length} charMax={200}>
            <textarea value={hero.subheading ?? ''} onChange={(e) => updateCopy('subtitle', e.target.value)} rows={3} className={cn(INPUT, 'resize-none leading-snug')} />
          </Field>

          <Field label="Primary Button" enabled={getEnabled('primaryCta')} onToggle={(v) => handleToggle('primaryCta', v)} charCurrent={(hero.cta?.text ?? '').length} charMax={30}>
            <input type="text" value={hero.cta?.text ?? ''} onChange={(e) => updateCopy('primaryCta', e.target.value)} placeholder="e.g. Get Started" className={INPUT} />
          </Field>

          <Field label="Secondary Button" enabled={getEnabled('secondaryCta')} onToggle={(v) => handleToggle('secondaryCta', v)} charCurrent={(hero.secondaryCta?.text ?? '').length} charMax={30}>
            <input type="text" value={hero.secondaryCta?.text ?? ''} onChange={(e) => updateCopy('secondaryCta', e.target.value)} placeholder="e.g. Learn More" className={INPUT} />
          </Field>

          <Field label="Trust Line" enabled={getEnabled('trustBadges')} onToggle={(v) => handleToggle('trustBadges', v)} charCurrent={(hero.trustBadges?.text ?? '').length} charMax={60}>
            <input type="text" value={hero.trustBadges?.text ?? ''} onChange={(e) => updateCopy('trustBadges', e.target.value)} placeholder="e.g. Trusted by 500+ teams" className={INPUT} />
          </Field>
        </div>
      </RightAccordion>
    </div>
  )
}

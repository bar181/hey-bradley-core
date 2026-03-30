import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps } from '@/lib/componentHelpers'

const INPUT = 'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const PERIODS = ['month', 'year'] as const

export function PricingSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  const updateProp = useCallback(
    (componentId: string, key: string, value: unknown) => {
      if (!section) return
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  if (!section) return null

  const tiers = section.components
    .filter((c) => c.type === 'pricing-tier')
    .sort((a, b) => a.order - b.order)

  return (
    <div className="divide-y divide-hb-border/30">
      <RightAccordion id="pricing-content" label="Content" defaultOpen>
        <div className="space-y-4">
          {tiers.map((tier) => {
            const name = (tier.props?.name as string) ?? ''
            const price = (tier.props?.price as string) ?? ''
            const period = (tier.props?.period as string) ?? 'month'
            const featuresRaw = (tier.props?.features as string) ?? ''
            const ctaText = (tier.props?.ctaText as string) ?? ''
            const ctaUrl = (tier.props?.ctaUrl as string) ?? ''
            const highlighted = Boolean(tier.props?.highlighted)

            // Convert comma-separated to newline-separated for editing
            const featuresDisplay = featuresRaw.split(',').map((f) => f.trim()).filter(Boolean).join('\n')

            return (
              <div
                key={tier.id}
                className={cn(
                  'rounded-lg border p-3 space-y-2.5',
                  highlighted ? 'border-hb-accent/50 bg-hb-accent/5' : 'border-hb-border/40',
                )}
              >
                {/* Tier header with name + highlighted toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                    {name || tier.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-hb-text-muted">Featured</span>
                    <Switch
                      checked={highlighted}
                      onCheckedChange={(v) => updateProp(tier.id, 'highlighted', v)}
                      className="scale-[0.6]"
                    />
                  </div>
                </div>

                {/* Tier name */}
                <div>
                  <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateProp(tier.id, 'name', e.target.value)}
                    placeholder="e.g. Pro"
                    className={cn(INPUT, 'text-xs py-1')}
                  />
                </div>

                {/* Price + Period row */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Price</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => updateProp(tier.id, 'price', e.target.value)}
                      placeholder="$29"
                      className={cn(INPUT, 'text-xs py-1')}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Period</label>
                    <select
                      value={period}
                      onChange={(e) => updateProp(tier.id, 'period', e.target.value)}
                      className={cn(INPUT, 'text-xs py-1')}
                    >
                      {PERIODS.map((p) => (
                        <option key={p} value={p}>/{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
                    Features (one per line)
                  </label>
                  <textarea
                    value={featuresDisplay}
                    onChange={(e) => {
                      const csv = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).join(',')
                      updateProp(tier.id, 'features', csv)
                    }}
                    rows={4}
                    className={cn(INPUT, 'text-xs py-1 resize-none leading-snug')}
                    placeholder="One feature per line"
                  />
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">CTA Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => updateProp(tier.id, 'ctaText', e.target.value)}
                      placeholder="Get Started"
                      className={cn(INPUT, 'text-xs py-1')}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">CTA URL</label>
                    <input
                      type="text"
                      value={ctaUrl}
                      onChange={(e) => updateProp(tier.id, 'ctaUrl', e.target.value)}
                      placeholder="#signup"
                      className={cn(INPUT, 'text-xs py-1')}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </RightAccordion>
    </div>
  )
}

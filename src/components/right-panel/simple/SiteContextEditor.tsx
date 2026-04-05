import { useState, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import type { SitePurpose, SiteAudience, SiteTone } from '@/lib/schemas'

const PURPOSE_OPTIONS: { value: SitePurpose; label: string }[] = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'saas', label: 'SaaS' },
  { value: 'blog', label: 'Blog' },
  { value: 'agency', label: 'Agency' },
  { value: 'restaurant', label: 'Restaurant' },
]

const AUDIENCE_OPTIONS: { value: SiteAudience; label: string }[] = [
  { value: 'consumer', label: 'Consumer' },
  { value: 'business', label: 'Business' },
  { value: 'developer', label: 'Developer' },
  { value: 'enterprise', label: 'Enterprise' },
]

const TONE_OPTIONS: { value: SiteTone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'playful', label: 'Playful' },
  { value: 'technical', label: 'Technical' },
  { value: 'warm', label: 'Warm' },
  { value: 'bold', label: 'Bold' },
]

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              value === opt.value
                ? 'bg-hb-accent text-white border-hb-accent'
                : 'bg-hb-surface text-hb-text-muted border-hb-border hover:bg-hb-surface-hover hover:text-hb-text-secondary',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SiteContextEditor() {
  const purpose = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).purpose as SitePurpose | undefined,
  ) ?? 'marketing'
  const audience = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).audience as SiteAudience | undefined,
  ) ?? 'consumer'
  const tone = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).tone as SiteTone | undefined,
  ) ?? 'casual'
  const brandName = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).brandName as string | undefined,
  ) ?? ''
  const tagline = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).tagline as string | undefined,
  ) ?? ''
  const voiceAttributes = useConfigStore(
    (s) => (s.config.site as Record<string, unknown>).voiceAttributes as string[] | undefined,
  ) ?? []
  const applyPatch = useConfigStore((s) => s.applyPatch)

  const [voiceInput, setVoiceInput] = useState(voiceAttributes.join(', '))

  const patch = useCallback(
    (field: string, value: unknown) => {
      applyPatch({ site: { [field]: value } }, 'ui')
    },
    [applyPatch],
  )

  const handleVoiceBlur = useCallback(() => {
    const tags = voiceInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    patch('voiceAttributes', tags)
  }, [voiceInput, patch])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-hb-text-primary">Your Site</h3>
        <p className="text-xs text-hb-text-muted mt-0.5">
          Define your site's purpose, audience, and voice.
        </p>
      </div>

      {/* Purpose */}
      <PillGroup
        label="Purpose"
        options={PURPOSE_OPTIONS}
        value={purpose}
        onChange={(v) => patch('purpose', v)}
      />

      {/* Audience */}
      <PillGroup
        label="Audience"
        options={AUDIENCE_OPTIONS}
        value={audience}
        onChange={(v) => patch('audience', v)}
      />

      {/* Tone */}
      <PillGroup
        label="Tone"
        options={TONE_OPTIONS}
        value={tone}
        onChange={(v) => patch('tone', v)}
      />

      {/* Brand */}
      <div>
        <div className="text-xs font-medium text-hb-text-muted uppercase tracking-wide mb-1.5">
          Brand
        </div>
        <div className="space-y-2">
          <label className="block">
            <span className="text-[10px] text-hb-text-muted mb-0.5 block">Brand Name</span>
            <input
              type="text"
              value={brandName}
              onChange={(e) => patch('brandName', e.target.value)}
              className={INPUT}
              placeholder="Your brand name"
            />
          </label>

          <label className="block">
            <span className="text-[10px] text-hb-text-muted mb-0.5 block">Tagline</span>
            <input
              type="text"
              value={tagline}
              onChange={(e) => patch('tagline', e.target.value)}
              className={INPUT}
              placeholder="A short phrase that captures your brand"
            />
          </label>

          <label className="block">
            <span className="text-[10px] text-hb-text-muted mb-0.5 block">
              Voice (comma-separated)
            </span>
            <input
              type="text"
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              onBlur={handleVoiceBlur}
              className={INPUT}
              placeholder="innovative, friendly, bold"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

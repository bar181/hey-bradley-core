import { useConfigStore } from '@/store/configStore'
import { getStr } from '@/lib/sectionContent'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function SectionHeadingEditor({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  return (
    <div className="space-y-2 mb-4 px-3 pt-3">
      <div>
        <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
          Section Title
        </label>
        <input
          type="text"
          value={getStr(section, 'heading')}
          onChange={(e) =>
            setSectionConfig(sectionId, {
              content: { ...(section.content ?? {}), heading: e.target.value },
            })
          }
          placeholder="e.g. What We Offer"
          className={INPUT}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
          Subtitle
        </label>
        <input
          type="text"
          value={getStr(section, 'subheading')}
          onChange={(e) =>
            setSectionConfig(sectionId, {
              content: { ...(section.content ?? {}), subheading: e.target.value },
            })
          }
          placeholder="A short description"
          className={INPUT}
        />
      </div>
    </div>
  )
}

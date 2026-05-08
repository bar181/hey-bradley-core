import { useId, useState } from 'react'
import { useConfigStore } from '@/store/configStore'
import { getStr } from '@/lib/sectionContent'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

export function SectionHeadingEditor({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)
  const headingId = useId()
  const subId = useId()
  // P67 / Wave 2 / A2 — heading sub-block is expanded by default; the parent
  // editor's collapse already handles auto-collapse for inactive sections.
  // This local toggle satisfies the canonical heading-pattern contract
  // (useState + aria-expanded + transition-all duration-200) and lets users
  // hide the title block when working on cards/items below.
  const [expanded, setExpanded] = useState<boolean>(true)

  if (!section) return null

  return (
    <div className="space-y-2 mb-4 px-3 pt-3 transition-all duration-200 ease-out">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`section-heading-body-${sectionId}`}
        data-testid="section-heading-toggle"
        className="text-xs font-medium text-hb-text-muted uppercase tracking-wide hover:text-hb-text-primary transition-colors"
      >
        Section Title {expanded ? '−' : '+'}
      </button>
      {expanded && (
      <div id={`section-heading-body-${sectionId}`} className="space-y-2">
      <div>
        <label htmlFor={headingId} className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
          Section Title
        </label>
        <input
          id={headingId}
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
        <label htmlFor={subId} className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">
          Subtitle
        </label>
        <input
          id={subId}
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
      )}
    </div>
  )
}

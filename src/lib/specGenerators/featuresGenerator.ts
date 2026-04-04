import type { MasterConfig } from '@/lib/schemas'
import { SECTION_LABELS, SECTION_USER_STORIES, getComponentText } from './helpers'

/**
 * Features Generator — every section as a user story with acceptance criteria.
 * Testable. Specific. No generic template text.
 */
export function generateFeatures(config: MasterConfig): string {
  const { site, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'

  let spec = `# Features & User Stories: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Total Sections:** ${enabled.length}\n`
  spec += `**Total Components:** ${enabled.reduce((sum, s) => sum + (s.components ?? []).filter(c => c.enabled).length, 0)}\n\n`
  spec += `---\n\n`

  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const story = SECTION_USER_STORIES[s.type]
    const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
    const activeComps = (s.components ?? []).filter((c) => c.enabled)

    spec += `## Feature ${i + 1}: ${label}\n\n`

    // User story
    if (story) {
      spec += `**User Story:** As a visitor, I want to ${story.want} so that ${story.benefit}.\n\n`
    }

    if (heading) {
      spec += `**Section heading:** "${heading}"\n\n`
    }

    // Acceptance criteria
    spec += `**Acceptance Criteria:**\n\n`

    if (s.variant) {
      spec += `- [ ] Renders in \`${s.variant}\` layout variant\n`
    }

    activeComps.forEach((c) => {
      const text = getComponentText(c)
      if (text) {
        spec += `- [ ] \`${c.id}\` (${c.type}): "${text}"\n`
      } else {
        spec += `- [ ] \`${c.id}\` (${c.type}) is visible and functional\n`
      }

      // Special criteria for specific component types
      if (c.type === 'button') {
        const url = c.props?.url as string
        if (url) spec += `  - Links to: ${url}\n`
      }
      if (c.type === 'image' || c.props?.image) {
        const imgUrl = (c.props?.image as string) || (c.props?.url as string)
        if (imgUrl) spec += `  - Image URL: ${imgUrl}\n`
      }
      if (c.props?.rating !== undefined) {
        spec += `  - Rating: ${c.props.rating}/5 stars\n`
      }
    })

    if (s.style?.background) {
      spec += `- [ ] Background color: \`${s.style.background}\`\n`
      spec += `- [ ] WCAG 2.1 AA contrast ratio (≥ 4.5:1) for text on \`${s.style.background}\` background\n`
    }
    if (s.layout?.columns) {
      spec += `- [ ] ${s.layout.columns}-column layout on desktop\n`
      if (activeComps.length > 0) {
        spec += `- [ ] Column count (${s.layout.columns}) accommodates ${activeComps.length} component(s)\n`
      }
      spec += `- [ ] Collapses to single column on mobile (375px)\n`
    }

    // Typography validation
    const sectionFont = s.style?.fontFamily || config.theme.typography?.fontFamily || 'Inter'
    const headingWeight = config.theme.typography?.headingWeight || 700
    const headingFamily = config.theme.typography?.headingFamily || sectionFont
    spec += `- [ ] Typography: heading weight ${headingWeight}, font "${headingFamily}", body font "${sectionFont}"\n`

    spec += `\n`
  })

  // Summary
  spec += `---\n\n`
  spec += `## Summary\n\n`
  spec += `| Metric | Count |\n`
  spec += `|--------|-------|\n`
  spec += `| Active sections | ${enabled.length} |\n`
  spec += `| Active components | ${enabled.reduce((sum, s) => sum + (s.components ?? []).filter(c => c.enabled).length, 0)} |\n`
  spec += `| Section types used | ${[...new Set(enabled.map(s => s.type))].length} |\n`
  spec += `| Acceptance criteria | ${enabled.reduce((sum, s) => sum + (s.components ?? []).filter(c => c.enabled).length + 2, 0)} |\n`

  return spec
}

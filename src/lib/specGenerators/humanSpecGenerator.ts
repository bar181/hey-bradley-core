import type { MasterConfig } from '@/lib/schemas'
import { SECTION_LABELS, SECTION_DESCRIPTIONS, getComponentText, describeComponentProps, describePaletteSlot } from './helpers'

/**
 * Human Spec Generator — fixes all B+ gaps from spec-review-findings.md:
 * - Full untruncated text (NO 30-char limit)
 * - Section headings and subheadings
 * - Section backgrounds and text colors
 * - Typography details (weight, size, line-height)
 * - Spacing values (padding, max-width, gap)
 * - ALL components shown (NO slice limit)
 */
export function generateHumanSpec(config: MasterConfig): string {
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const disabled = sections.filter((s) => !s.enabled)

  let spec = `# Specification: ${site.title || 'Untitled Website'}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Spec Format:** HUMAN (plain English, full detail)\n\n`
  spec += `---\n\n`

  // Overview
  spec += `## Overview\n\n`
  spec += `| Property | Value |\n`
  spec += `|----------|-------|\n`
  spec += `| Title | ${site.title || '(untitled)'} |\n`
  if (site.description) spec += `| Description | ${site.description} |\n`
  spec += `| Theme | ${theme.preset || 'custom'} |\n`
  spec += `| Mode | ${theme.mode} |\n`
  spec += `| Font | ${theme.typography?.fontFamily || 'Inter'} |\n`
  if (theme.typography?.headingFamily && theme.typography.headingFamily !== theme.typography?.fontFamily) {
    spec += `| Heading font | ${theme.typography.headingFamily} |\n`
  }
  spec += `| Heading weight | ${theme.typography?.headingWeight || 700} |\n`
  spec += `| Base size | ${theme.typography?.baseSize || '16px'} |\n`
  spec += `| Line height | ${theme.typography?.lineHeight || 1.7} |\n`
  spec += `| Border radius | ${theme.borderRadius || '12px'} |\n`
  spec += `| Section padding | ${theme.spacing?.sectionPadding || '64px'} |\n`
  spec += `| Container max width | ${theme.spacing?.containerMaxWidth || '1280px'} |\n`
  spec += `| Component gap | ${theme.spacing?.componentGap || '24px'} |\n`
  spec += `\n`

  // Palette
  if (theme.palette) {
    spec += `## Color Palette\n\n`
    spec += `| Slot | Hex | Description |\n`
    spec += `|------|-----|-------------|\n`
    for (const [key, value] of Object.entries(theme.palette)) {
      spec += `| ${describePaletteSlot(key)} | \`${value}\` | ${key} |\n`
    }
    spec += `\n`
  }

  // Site info
  if (site.author || site.email || site.domain) {
    spec += `## Site Info\n\n`
    if (site.author) spec += `- **Author:** ${site.author}\n`
    if (site.email) spec += `- **Email:** ${site.email}\n`
    if (site.domain) spec += `- **Domain:** ${site.domain}\n`
    if (site.project) spec += `- **Project:** ${site.project}\n`
    spec += `\n`
  }

  // Page structure summary
  spec += `## Page Structure (${enabled.length} sections)\n\n`
  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const variant = s.variant ? ` (${s.variant})` : ''
    const heading = (s.content as Record<string, unknown>)?.heading as string
    const compCount = (s.components ?? []).filter((c) => c.enabled).length
    spec += `${i + 1}. **${label}**${variant}`
    if (heading) spec += ` — "${heading}"`
    spec += ` | ${compCount} components\n`
  })
  if (disabled.length > 0) {
    spec += `\n_Disabled:_ ${disabled.map((s) => SECTION_LABELS[s.type] || s.type).join(', ')}\n`
  }
  spec += `\n`

  // Section details — FULL DETAIL, NO TRUNCATION
  spec += `## Section Details\n\n`
  enabled.forEach((s) => {
    const label = SECTION_LABELS[s.type] || s.type
    const description = SECTION_DESCRIPTIONS[s.type] || ''

    spec += `### ${label}\n\n`
    spec += `${description}\n\n`

    // Properties table
    spec += `| Property | Value |\n`
    spec += `|----------|-------|\n`
    spec += `| Type | \`${s.type}\` |\n`
    if (s.variant) spec += `| Variant | \`${s.variant}\` |\n`
    if (s.style?.background) spec += `| Background | \`${s.style.background}\` |\n`
    if (s.style?.color) spec += `| Text color | \`${s.style.color}\` |\n`
    if (s.style?.fontFamily) spec += `| Font | ${s.style.fontFamily} |\n`

    // Content heading/subheading
    const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
    const subheading = (s.content as Record<string, unknown>)?.subheading as string | undefined
    if (heading) spec += `| Heading | "${heading}" |\n`
    if (subheading) spec += `| Subheading | "${subheading}" |\n`

    // Layout
    if (s.layout) {
      const layoutParts: string[] = []
      if (s.layout.display) layoutParts.push(`display: ${s.layout.display}`)
      if (s.layout.columns) layoutParts.push(`cols: ${s.layout.columns}`)
      if (s.layout.gap) layoutParts.push(`gap: ${s.layout.gap}`)
      if ((s.layout as any).padding) layoutParts.push(`padding: ${(s.layout as any).padding}`)
      if (layoutParts.length > 0) spec += `| Layout | ${layoutParts.join(', ')} |\n`
    }
    spec += `\n`

    // Components — ALL of them, NO slice, FULL text
    const activeComps = (s.components ?? []).filter((c) => c.enabled)
    if (activeComps.length > 0) {
      spec += `**Components (${activeComps.length}):**\n\n`
      activeComps.forEach((c) => {
        const text = getComponentText(c)
        spec += `- **\`${c.id}\`** (${c.type})`
        if (text) spec += `: "${text}"`
        spec += `\n`

        // Full props listing
        const props = describeComponentProps(c)
        props.forEach((p) => {
          spec += `  - ${p}\n`
        })
      })
      spec += `\n`
    }
  })

  return spec.trimEnd() + '\n'
}

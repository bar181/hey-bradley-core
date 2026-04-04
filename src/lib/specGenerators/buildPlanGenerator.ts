import type { MasterConfig } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { SECTION_LABELS, VARIANT_DESCRIPTIONS, describeComponentProps } from './helpers'

/**
 * Build Plan Generator — THE CRITICAL ONE.
 * An AI agent reads this and builds the site section-by-section with 90% accuracy.
 * Includes exact copy text, image URLs, component props, variant names, padding values.
 */
export function generateBuildPlan(config: MasterConfig): string {
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'

  let spec = `# Implementation Plan: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Scope:** Complete front-end implementation specification\n\n`
  spec += `This implementation plan provides step-by-step build instructions for ${title}. `
  spec += `When provided to an AI coding agent or development team, it should enable 90%+ visual reproduction of the designed website.\n\n`
  spec += `---\n\n`

  // Phase 1: Project Setup
  spec += `## Phase 1: Project Setup\n\n`
  spec += `Create a React + Tailwind CSS single-page marketing site.\n\n`
  spec += `### Global Configuration\n\n`
  spec += `- **Font:** \`${theme.typography?.fontFamily || 'Inter'}\` (Google Fonts)\n`
  if (theme.typography?.headingFamily && theme.typography.headingFamily !== theme.typography?.fontFamily) {
    spec += `- **Heading font:** \`${theme.typography.headingFamily}\`\n`
  }
  spec += `- **Heading weight:** ${theme.typography?.headingWeight || 700}\n`
  spec += `- **Base font size:** ${theme.typography?.baseSize || '16px'}\n`
  spec += `- **Line height:** ${theme.typography?.lineHeight || 1.7}\n`
  spec += `- **Border radius:** ${theme.borderRadius || '12px'}\n`
  spec += `- **Section padding:** ${theme.spacing?.sectionPadding || '64px'} top/bottom\n`
  spec += `- **Container max width:** ${theme.spacing?.containerMaxWidth || '1280px'}\n`
  spec += `- **Component gap:** ${theme.spacing?.componentGap || '24px'}\n`
  spec += `- **Mode:** ${theme.mode}\n\n`

  // Palette
  spec += `### Color Palette (CSS Custom Properties)\n\n`
  spec += `\`\`\`css\n`
  spec += `:root {\n`
  if (theme.palette) {
    spec += `  --bg-primary: ${theme.palette.bgPrimary};\n`
    spec += `  --bg-secondary: ${theme.palette.bgSecondary};\n`
    spec += `  --text-primary: ${theme.palette.textPrimary};\n`
    spec += `  --text-secondary: ${theme.palette.textSecondary};\n`
    spec += `  --accent-primary: ${theme.palette.accentPrimary};\n`
    spec += `  --accent-secondary: ${theme.palette.accentSecondary};\n`
  }
  spec += `}\n`
  spec += `\`\`\`\n\n`

  // Phase 2: Section-by-Section Build
  spec += `## Phase 2: Build Each Section\n\n`
  spec += `Build the following ${enabled.length} sections in order. Each section is a standalone React component.\n\n`

  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const variant = s.variant || 'default'
    const variantDesc = VARIANT_DESCRIPTIONS[s.type]?.[variant] || variant
    const heading = getStr(s, 'heading') || undefined
    const subheading = getStr(s, 'subheading') || undefined
    const activeComps = (s.components ?? []).filter((c) => c.enabled)

    spec += `### Section ${i + 1}: ${label}\n\n`
    spec += `- **Type:** \`${s.type}\`\n`
    spec += `- **Variant:** \`${variant}\` — ${variantDesc}\n`
    spec += `- **ID:** \`${s.id}\`\n`

    // Layout
    if (s.layout) {
      const layoutParts: string[] = []
      if (s.layout.display) layoutParts.push(`display: ${s.layout.display}`)
      if (s.layout.direction) layoutParts.push(`direction: ${s.layout.direction}`)
      if (s.layout.columns) layoutParts.push(`columns: ${s.layout.columns}`)
      if (s.layout.gap) layoutParts.push(`gap: ${s.layout.gap}`)
      if (s.layout.padding) layoutParts.push(`padding: ${s.layout.padding}`)
      if (s.layout.align) layoutParts.push(`align: ${s.layout.align}`)
      if (s.layout.maxWidth) layoutParts.push(`max-width: ${s.layout.maxWidth}`)
      if (layoutParts.length > 0) spec += `- **Layout:** ${layoutParts.join(', ')}\n`
    }

    // Style
    if (s.style?.background) spec += `- **Background:** \`${s.style.background}\`\n`
    if (s.style?.color) spec += `- **Text color:** \`${s.style.color}\`\n`
    if (s.style?.fontFamily) spec += `- **Font override:** ${s.style.fontFamily}\n`
    if (s.style?.borderRadius) spec += `- **Border radius:** ${s.style.borderRadius}\n`

    // Content heading/subheading
    if (heading) spec += `- **Section heading:** "${heading}"\n`
    if (subheading) spec += `- **Section subheading:** "${subheading}"\n`

    spec += `\n`

    // Components with FULL detail
    if (activeComps.length > 0) {
      spec += `**Components (${activeComps.length}):**\n\n`
      activeComps.forEach((c) => {
        spec += `#### \`${c.id}\` (${c.type})\n\n`
        const propLines = describeComponentProps(c)
        if (propLines.length > 0) {
          propLines.forEach((line) => {
            spec += `- ${line}\n`
          })
        } else {
          spec += `- _(no props)_\n`
        }
        spec += `\n`
      })
    }

    spec += `---\n\n`
  })

  // Phase 3: Responsive + Polish
  spec += `## Phase 3: Responsive & Polish\n\n`
  spec += `1. **Mobile (375px):** Stack all columns to single column, reduce heading sizes by ~25%, full-width images\n`
  spec += `2. **Tablet (768px):** 2-column grids where 3+ columns exist, maintain proportions\n`
  spec += `3. **Desktop (1440px+):** Content centered within max-width ${theme.spacing?.containerMaxWidth || '1280px'}\n`
  spec += `4. **Hover states:** All buttons darken on hover, cards lift with subtle shadow\n`
  spec += `5. **Smooth scrolling:** \`scroll-behavior: smooth\` on html, anchor links scroll to sections\n`
  spec += `6. **Font loading:** Preconnect to fonts.googleapis.com, use \`display=swap\` for fallback\n`

  return spec
}

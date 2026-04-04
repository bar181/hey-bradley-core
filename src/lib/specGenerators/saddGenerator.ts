import type { MasterConfig } from '@/lib/schemas'
import { SECTION_LABELS, VARIANT_DESCRIPTIONS, describePaletteSlot } from './helpers'

/**
 * SADD Generator — Software Architecture Design Document.
 * A senior engineer reads this and can scaffold the project in 30 minutes.
 */
export function generateSADD(config: MasterConfig): string {
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'

  let spec = `# Architecture: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Spec Version:** ${site.version || '1.0.0-RC1'}\n\n`
  spec += `This Software Architecture and Design Document provides the complete technical specification for ${title}. `
  spec += `It covers the technology stack, component architecture, design tokens, and data model — everything an engineering team needs to implement the site from specification.\n\n`
  spec += `---\n\n`

  // Tech stack
  spec += `## 1. Technology Stack\n\n`
  spec += `| Layer | Technology | Notes |\n`
  spec += `|-------|-----------|-------|\n`
  spec += `| Framework | React 18 | Single-page application |\n`
  spec += `| Styling | Tailwind CSS 4 | Utility-first, JIT compilation |\n`
  spec += `| Font | ${theme.typography?.fontFamily || 'Inter'} | via Google Fonts |\n`
  if (theme.typography?.headingFamily && theme.typography.headingFamily !== theme.typography?.fontFamily) {
    spec += `| Heading Font | ${theme.typography.headingFamily} | Separate heading typeface |\n`
  }
  spec += `| State | Zustand | configStore (persistent) + uiStore (ephemeral) |\n`
  spec += `| Validation | Zod | Runtime schema validation |\n`
  spec += `| Build | Vite | Development server + production bundling |\n`
  spec += `| UI Components | shadcn/ui | Headless, accessible base components |\n\n`

  // Color palette
  spec += `## 2. Color Palette\n\n`
  spec += `**Theme preset:** ${theme.preset || 'custom'}\n`
  spec += `**Mode:** ${theme.mode}\n\n`
  if (theme.palette) {
    spec += `| Slot | Hex Value | Usage |\n`
    spec += `|------|-----------|-------|\n`
    for (const [key, value] of Object.entries(theme.palette)) {
      spec += `| ${describePaletteSlot(key)} | \`${value}\` | ${describePaletteUsage(key)} |\n`
    }
    spec += `\n`
  }

  // Typography
  spec += `## 3. Typography\n\n`
  spec += `| Property | Value |\n`
  spec += `|----------|-------|\n`
  spec += `| Body font | ${theme.typography?.fontFamily || 'Inter'} |\n`
  spec += `| Heading font | ${theme.typography?.headingFamily || theme.typography?.fontFamily || 'Inter'} |\n`
  spec += `| Heading weight | ${theme.typography?.headingWeight || 700} |\n`
  spec += `| Base size | ${theme.typography?.baseSize || '16px'} |\n`
  spec += `| Line height | ${theme.typography?.lineHeight || 1.7} |\n`
  spec += `| Border radius | ${theme.borderRadius || '12px'} |\n\n`

  // Spacing
  spec += `## 4. Spacing\n\n`
  spec += `| Property | Value |\n`
  spec += `|----------|-------|\n`
  spec += `| Section padding | ${theme.spacing?.sectionPadding || '64px'} |\n`
  spec += `| Container max width | ${theme.spacing?.containerMaxWidth || '1280px'} |\n`
  spec += `| Component gap | ${theme.spacing?.componentGap || '24px'} |\n\n`

  // Component tree
  spec += `## 5. Component Tree\n\n`
  spec += `\`\`\`\n`
  spec += `App\n`
  spec += `├── AppShell\n`
  spec += `│   ├── LeftPanel (mode selector, section list)\n`
  spec += `│   ├── CenterCanvas (preview)\n`
  const sectionTypes = [...new Set(enabled.map(s => s.type))]
  sectionTypes.forEach((type, i) => {
    const label = SECTION_LABELS[type] || type
    const isLast = i === sectionTypes.length - 1
    spec += `│   │   ${isLast ? '└' : '├'}── ${label}\n`
  })
  spec += `│   └── RightPanel (section editors)\n`
  spec += `└── Stores\n`
  spec += `    ├── configStore (MasterConfig — persistent)\n`
  spec += `    └── uiStore (UI state — ephemeral)\n`
  spec += `\`\`\`\n\n`

  // Section inventory
  spec += `## 6. Section Inventory\n\n`
  spec += `| # | Type | Variant | Components | Background |\n`
  spec += `|---|------|---------|------------|------------|\n`
  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const variant = s.variant || 'default'
    const compCount = (s.components ?? []).filter(c => c.enabled).length
    const bg = s.style?.background || 'theme default'
    spec += `| ${i + 1} | ${label} | ${variant} | ${compCount} | \`${bg}\` |\n`
  })
  spec += `\n`

  // Variant descriptions
  spec += `## 7. Layout Variants Used\n\n`
  enabled.forEach((s) => {
    if (!s.variant) return
    const label = SECTION_LABELS[s.type] || s.type
    const desc = VARIANT_DESCRIPTIONS[s.type]?.[s.variant] || s.variant
    spec += `- **${label}** → \`${s.variant}\`: ${desc}\n`
  })
  spec += `\n`

  // Data model
  spec += `## 8. Data Model (MasterConfig)\n\n`
  spec += `\`\`\`typescript\n`
  spec += `interface MasterConfig {\n`
  spec += `  site: { title, description, author, email, domain, project, version, spec }\n`
  spec += `  theme: { preset, mode, palette (6-slot), typography, spacing, borderRadius }\n`
  spec += `  sections: Section[]\n`
  spec += `}\n\n`
  spec += `interface Section {\n`
  spec += `  type: SectionType  // ${sectionTypes.join(' | ')}\n`
  spec += `  id: string\n`
  spec += `  order: number\n`
  spec += `  enabled: boolean\n`
  spec += `  variant?: string\n`
  spec += `  content: Record<string, unknown>  // { heading?, subheading?, ...sectionSpecific }\n`
  spec += `  layout: { display: string, direction?: string, columns?: number, gap: string, padding: string, align?: string, maxWidth?: string }\n`
  spec += `  style: { background: string, color: string, fontFamily?: string, borderRadius?: string }\n`
  spec += `  components: Component[]\n`
  spec += `}\n`
  spec += `\`\`\`\n`

  return spec
}

function describePaletteUsage(slot: string): string {
  const map: Record<string, string> = {
    bgPrimary: 'Page background, hero sections',
    bgSecondary: 'Alternating section backgrounds, cards',
    textPrimary: 'Headings, body text on primary bg',
    textSecondary: 'Subtitles, secondary text, muted content',
    accentPrimary: 'Buttons, links, active states',
    accentSecondary: 'Hover states, secondary highlights',
  }
  return map[slot] || 'General use'
}

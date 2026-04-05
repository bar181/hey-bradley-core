import type { MasterConfig } from '@/lib/schemas'
import { getSpecTemplate } from '@/data/spec-templates'
import { SECTION_LABELS, VARIANT_DESCRIPTIONS, describePaletteSlot } from './helpers'

/**
 * SADD Generator — Software Architecture Design Document.
 * A senior engineer reads this and can scaffold the project in 30 minutes.
 *
 * Section order and labels are driven by the sadd template JSON.
 * Rendering logic per section lives in the sectionRenderers map.
 */
export function generateSADD(config: MasterConfig): string {
  const template = getSpecTemplate('sadd')
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'
  const sectionTypes = [...new Set(enabled.map(s => s.type))]

  // Shared context passed to each section renderer
  const ctx = { site, theme, sections, enabled, title, sectionTypes }

  const purpose = (site as Record<string, unknown>).purpose as string || 'marketing'
  const audience = (site as Record<string, unknown>).audience as string || 'consumer'
  const tone = (site as Record<string, unknown>).tone as string || 'casual'

  // --- Header (not part of template sections) ---
  let spec = `# Architecture: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Spec Version:** ${site.version || '1.0.0-RC1'}\n\n`
  spec += `**Site Context:** ${purpose} site targeting ${audience} audience with a ${tone} tone.\n\n`
  spec += `This Software Architecture and Design Document provides the complete technical specification for ${title}. `
  spec += `It covers the technology stack, component architecture, design tokens, and data model — everything an engineering team needs to implement the site from specification.\n\n`
  spec += `---\n\n`

  // --- Template-driven sections ---
  const templateSections = template.sections ?? []
  templateSections.forEach((section, idx) => {
    const renderer = sectionRenderers[section.id]
    if (renderer) {
      spec += renderer(idx + 1, section.label, ctx)
    }
  })

  return spec
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RenderContext {
  site: MasterConfig['site']
  theme: MasterConfig['theme']
  sections: MasterConfig['sections']
  enabled: MasterConfig['sections']
  title: string
  sectionTypes: string[]
}

type SectionRenderer = (num: number, label: string, ctx: RenderContext) => string

// ---------------------------------------------------------------------------
// Section renderers — keyed by template section id
// ---------------------------------------------------------------------------

const sectionRenderers: Record<string, SectionRenderer> = {
  technology_stack(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| Layer | Technology | Notes |\n`
    s += `|-------|-----------|-------|\n`
    s += `| Framework | React 18 | Single-page application |\n`
    s += `| Styling | Tailwind CSS 4 | Utility-first, JIT compilation |\n`
    s += `| Font | ${ctx.theme.typography?.fontFamily || 'Inter'} | via Google Fonts |\n`
    if (ctx.theme.typography?.headingFamily && ctx.theme.typography.headingFamily !== ctx.theme.typography?.fontFamily) {
      s += `| Heading Font | ${ctx.theme.typography.headingFamily} | Separate heading typeface |\n`
    }
    s += `| State | Zustand | configStore (persistent) + uiStore (ephemeral) |\n`
    s += `| Validation | Zod | Runtime schema validation |\n`
    s += `| Build | Vite | Development server + production bundling |\n`
    s += `| UI Components | shadcn/ui | Headless, accessible base components |\n\n`
    return s
  },

  color_palette(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `**Theme preset:** ${ctx.theme.preset || 'custom'}\n`
    s += `**Mode:** ${ctx.theme.mode}\n\n`
    if (ctx.theme.palette) {
      s += `| Slot | Hex Value | Usage |\n`
      s += `|------|-----------|-------|\n`
      for (const [key, value] of Object.entries(ctx.theme.palette)) {
        s += `| ${describePaletteSlot(key)} | \`${value}\` | ${describePaletteUsage(key)} |\n`
      }
      s += `\n`
    }
    return s
  },

  typography(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| Property | Value |\n`
    s += `|----------|-------|\n`
    s += `| Body font | ${ctx.theme.typography?.fontFamily || 'Inter'} |\n`
    s += `| Heading font | ${ctx.theme.typography?.headingFamily || ctx.theme.typography?.fontFamily || 'Inter'} |\n`
    s += `| Heading weight | ${ctx.theme.typography?.headingWeight || 700} |\n`
    s += `| Base size | ${ctx.theme.typography?.baseSize || '16px'} |\n`
    s += `| Line height | ${ctx.theme.typography?.lineHeight || 1.7} |\n`
    s += `| Border radius | ${ctx.theme.borderRadius || '12px'} |\n\n`
    return s
  },

  spacing(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| Property | Value |\n`
    s += `|----------|-------|\n`
    s += `| Section padding | ${ctx.theme.spacing?.sectionPadding || '64px'} |\n`
    s += `| Container max width | ${ctx.theme.spacing?.containerMaxWidth || '1280px'} |\n`
    s += `| Component gap | ${ctx.theme.spacing?.componentGap || '24px'} |\n\n`
    return s
  },

  component_tree(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `\`\`\`\n`
    s += `App\n`
    s += `\u251C\u2500\u2500 AppShell\n`
    s += `\u2502   \u251C\u2500\u2500 LeftPanel (mode selector, section list)\n`
    s += `\u2502   \u251C\u2500\u2500 CenterCanvas (preview)\n`
    ctx.sectionTypes.forEach((type, i) => {
      const sLabel = SECTION_LABELS[type] || type
      const isLast = i === ctx.sectionTypes.length - 1
      s += `\u2502   \u2502   ${isLast ? '\u2514' : '\u251C'}\u2500\u2500 ${sLabel}\n`
    })
    s += `\u2502   \u2514\u2500\u2500 RightPanel (section editors)\n`
    s += `\u2514\u2500\u2500 Stores\n`
    s += `    \u251C\u2500\u2500 configStore (MasterConfig \u2014 persistent)\n`
    s += `    \u2514\u2500\u2500 uiStore (UI state \u2014 ephemeral)\n`
    s += `\`\`\`\n\n`
    return s
  },

  section_inventory(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| # | Type | Variant | Components | Background | Image Effect |\n`
    s += `|---|------|---------|------------|------------|-------------|\n`
    ctx.enabled.forEach((sec, i) => {
      const sLabel = SECTION_LABELS[sec.type] || sec.type
      const variant = sec.variant || 'default'
      const compCount = (sec.components ?? []).filter(c => c.enabled).length
      const bg = sec.style?.background || 'theme default'
      const effect = sec.style?.imageEffect && sec.style.imageEffect !== 'none' ? sec.style.imageEffect : ''
      s += `| ${i + 1} | ${sLabel} | ${variant} | ${compCount} | \`${bg}\` |${effect ? ` ${effect}` : ''}\n`
    })
    s += `\n`
    return s
  },

  layout_variants(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    ctx.enabled.forEach((sec) => {
      if (!sec.variant) return
      const sLabel = SECTION_LABELS[sec.type] || sec.type
      const desc = VARIANT_DESCRIPTIONS[sec.type]?.[sec.variant] || sec.variant
      s += `- **${sLabel}** \u2192 \`${sec.variant}\`: ${desc}\n`
    })
    s += `\n`
    return s
  },

  data_model(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `\`\`\`typescript\n`
    s += `interface MasterConfig {\n`
    s += `  site: { title, description, author, email, domain, project, version, spec }\n`
    s += `  theme: { preset, mode, palette (6-slot), typography, spacing, borderRadius }\n`
    s += `  sections: Section[]\n`
    s += `}\n\n`
    s += `interface Section {\n`
    s += `  type: SectionType  // ${ctx.sectionTypes.join(' | ')}\n`
    s += `  id: string\n`
    s += `  order: number\n`
    s += `  enabled: boolean\n`
    s += `  variant?: string\n`
    s += `  content: Record<string, unknown>  // { heading?, subheading?, ...sectionSpecific }\n`
    s += `  layout: { display: string, direction?: string, columns?: number, gap: string, padding: string, align?: string, maxWidth?: string }\n`
    s += `  style: { background: string, color: string, fontFamily?: string, borderRadius?: string, imageEffect?: ImageEffect }\n`
    s += `  components: Component[]\n`
    s += `}\n\n`
    s += `type ImageEffect = 'none' | 'ken-burns' | 'slow-pan' | 'zoom-hover' | 'click-enlarge'\n`
    s += `  | 'gradient-overlay' | 'parallax' | 'glass-blur' | 'grayscale-hover' | 'vignette'\n`
    s += `  | 'holographic' | 'tilt-3d' | 'sepia-to-color' | 'reveal-slide' | 'fade-in-scroll'\n`
    s += `\`\`\`\n`
    return s
  },
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

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

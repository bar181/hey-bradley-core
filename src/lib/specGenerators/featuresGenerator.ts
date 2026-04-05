import type { MasterConfig } from '@/lib/schemas'
import {
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  SECTION_USER_STORIES,
  VARIANT_DESCRIPTIONS,
  COMPONENT_DESCRIPTIONS,
  getComponentText,
} from './helpers'

// ---------------------------------------------------------------------------
// Category definitions — groups sections by functional purpose
// ---------------------------------------------------------------------------

type FeatureCategory = {
  name: string
  description: string
  types: string[]
  priority: 'P0' | 'P1' | 'P2'
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: 'Navigation & Structure',
    description:
      'Core structural elements that establish site hierarchy, wayfinding, and brand identity.',
    types: ['menu', 'footer'],
    priority: 'P0',
  },
  {
    name: 'Content Sections',
    description:
      'Primary content blocks that communicate value proposition, offerings, and key information.',
    types: ['hero', 'columns', 'text', 'pricing'],
    priority: 'P0',
  },
  {
    name: 'Conversion & Engagement',
    description:
      'Interactive elements designed to drive user action — signups, purchases, and inquiries.',
    types: ['action', 'questions'],
    priority: 'P1',
  },
  {
    name: 'Trust & Social Proof',
    description:
      'Elements that build credibility through testimonials, client logos, team bios, and metrics.',
    types: ['quotes', 'logos', 'team', 'numbers'],
    priority: 'P1',
  },
  {
    name: 'Media & Visual',
    description:
      'Visual storytelling through images, galleries, and media-rich layouts. Supports image effects including Ken Burns, Slow Pan, Zoom Hover, Parallax, Gradient Overlay, Glass Blur, Grayscale to Color, Vignette, Holographic, 3D Tilt, Sepia to Color, Reveal Slide, and Fade In.',
    types: ['gallery', 'image'],
    priority: 'P2',
  },
  {
    name: 'Utility & Layout',
    description:
      'Structural utilities that control spacing, rhythm, and visual separation between sections.',
    types: ['divider'],
    priority: 'P2',
  },
]

// ---------------------------------------------------------------------------
// Priority assignment per section type
// ---------------------------------------------------------------------------

function getSectionPriority(sectionType: string): 'P0' | 'P1' | 'P2' {
  for (const cat of FEATURE_CATEGORIES) {
    if (cat.types.includes(sectionType)) return cat.priority
  }
  return 'P2'
}

// ---------------------------------------------------------------------------
// Features Generator
// ---------------------------------------------------------------------------

/**
 * Features Generator — professional-grade features specification
 * organized by functional category with user stories, variant details,
 * and structured acceptance criteria.
 */
export function generateFeatures(config: MasterConfig): string {
  const { site, sections, theme } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'
  const totalComponents = enabled.reduce(
    (sum, s) => sum + (s.components ?? []).filter((c) => c.enabled).length,
    0,
  )

  const purpose = (site as Record<string, unknown>).purpose as string || 'marketing'
  const audience = (site as Record<string, unknown>).audience as string || 'consumer'
  const tone = (site as Record<string, unknown>).tone as string || 'casual'

  // --- Header ---
  let spec = `# Features Specification: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}  \n`
  spec += `**Document type:** Features & Acceptance Criteria  \n`
  spec += `**Sections:** ${enabled.length} | **Components:** ${totalComponents}  \n\n`

  spec += `**Site Context:** ${purpose} site targeting ${audience} audience with a ${tone} tone.\n\n`

  spec += `This features specification documents all capabilities of ${title}, organized by functional category. `
  spec += `Each feature includes a user story, description, active variant, and acceptance criteria `
  spec += `divided into visual, functional, and technical requirements.\n\n`

  spec += `---\n\n`

  // --- Summary Table ---
  spec += `## Feature Summary\n\n`
  spec += `| # | Feature | Category | Variant | Components | Priority |\n`
  spec += `|---|---------|----------|---------|------------|----------|\n`

  let featureIndex = 0
  for (const cat of FEATURE_CATEGORIES) {
    const catSections = enabled.filter((s) => cat.types.includes(s.type))
    for (const s of catSections) {
      featureIndex++
      const label = SECTION_LABELS[s.type] || s.type
      const variant = s.variant || 'default'
      const compCount = (s.components ?? []).filter((c) => c.enabled).length
      spec += `| ${featureIndex} | ${label} | ${cat.name} | \`${variant}\` | ${compCount} | ${getSectionPriority(s.type)} |\n`
    }
  }
  spec += `\n`

  // --- Detailed Feature Specifications by Category ---
  spec += `---\n\n`

  let globalFeatureIndex = 0
  for (const cat of FEATURE_CATEGORIES) {
    const catSections = enabled.filter((s) => cat.types.includes(s.type))
    if (catSections.length === 0) continue

    spec += `## ${cat.name}\n\n`
    spec += `${cat.description}\n\n`

    for (const s of catSections) {
      globalFeatureIndex++
      const label = SECTION_LABELS[s.type] || s.type
      const description = SECTION_DESCRIPTIONS[s.type]
      const story = SECTION_USER_STORIES[s.type]
      const variant = s.variant || 'default'
      const variantDesc = VARIANT_DESCRIPTIONS[s.type]?.[variant]
      const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
      const subheading = (s.content as Record<string, unknown>)?.subheading as string | undefined
      const activeComps = (s.components ?? []).filter((c) => c.enabled)

      spec += `### Feature ${globalFeatureIndex}: ${label}\n\n`

      // Description
      if (description) {
        spec += `> ${description}\n\n`
      }

      // Metadata table
      spec += `| Property | Value |\n`
      spec += `|----------|-------|\n`
      spec += `| **Section ID** | \`${s.id}\` |\n`
      spec += `| **Type** | \`${s.type}\` |\n`
      spec += `| **Priority** | ${getSectionPriority(s.type)} |\n`
      spec += `| **Variant** | \`${variant}\`${variantDesc ? ` — ${variantDesc}` : ''} |\n`
      spec += `| **Components** | ${activeComps.length} |\n`
      if (heading) spec += `| **Heading** | "${heading}" |\n`
      if (subheading) spec += `| **Subheading** | "${subheading}" |\n`
      spec += `\n`

      // User story
      if (story) {
        spec += `**User Story:** As a visitor, I want to ${story.want} so that ${story.benefit}.\n\n`
      }

      // Components detail
      if (activeComps.length > 0) {
        spec += `**Components:**\n\n`
        for (const c of activeComps) {
          const compDesc = COMPONENT_DESCRIPTIONS[c.type] || c.type
          const text = getComponentText(c)
          if (text) {
            spec += `- \`${c.id}\` — ${compDesc}: "${text}"\n`
          } else {
            spec += `- \`${c.id}\` — ${compDesc}\n`
          }

          // Supplemental details for specific component types
          if (c.type === 'button' && c.props?.url) {
            spec += `  - Links to: ${c.props.url}\n`
          }
          if ((c.type === 'image' || c.props?.image) && (c.props?.image || c.props?.url)) {
            spec += `  - Image: ${(c.props?.image as string) || (c.props?.url as string)}\n`
          }
          if (c.props?.rating !== undefined) {
            spec += `  - Rating: ${c.props.rating}/5\n`
          }
        }
        spec += `\n`
      }

      // --- Acceptance Criteria (Visual / Functional / Technical) ---
      spec += `**Acceptance Criteria:**\n\n`

      // Visual
      spec += `_Visual:_\n\n`
      const sectionFont =
        s.style?.fontFamily || theme.typography?.fontFamily || 'Inter'
      const headingWeight = theme.typography?.headingWeight || 700
      const headingFamily =
        theme.typography?.headingFamily || sectionFont

      spec += `- [ ] Typography: heading weight ${headingWeight}, heading font "${headingFamily}", body font "${sectionFont}"\n`

      if (s.style?.background) {
        spec += `- [ ] Background color: \`${s.style.background}\`\n`
        spec += `- [ ] WCAG 2.1 AA contrast ratio (>= 4.5:1) for text on \`${s.style.background}\`\n`
      }
      if (s.style?.color) {
        spec += `- [ ] Text color: \`${s.style.color}\`\n`
      }
      if (s.style?.borderRadius) {
        spec += `- [ ] Border radius: ${s.style.borderRadius}\n`
      }
      if (s.style?.imageEffect && s.style.imageEffect !== 'none') {
        spec += `- [ ] Image effect: \`${s.style.imageEffect}\` applied to image containers\n`
      }
      if (s.layout?.columns) {
        spec += `- [ ] ${s.layout.columns}-column grid layout on desktop\n`
        spec += `- [ ] Collapses to single column on mobile (375px)\n`
      }
      spec += `\n`

      // Functional
      spec += `_Functional:_\n\n`

      if (s.variant) {
        spec += `- [ ] Renders in \`${variant}\` layout variant\n`
      }

      for (const c of activeComps) {
        const text = getComponentText(c)
        if (text) {
          spec += `- [ ] \`${c.id}\` displays content: "${text.length > 80 ? text.slice(0, 77) + '...' : text}"\n`
        } else {
          spec += `- [ ] \`${c.id}\` is visible and functional\n`
        }
      }

      spec += `- [ ] Responds correctly to light/dark theme mode (\`${theme.mode}\`)\n`
      spec += `\n`

      // Technical
      spec += `_Technical:_\n\n`
      spec += `- [ ] Rendered as standalone React component with section ID \`${s.id}\`\n`

      if (s.layout?.columns && activeComps.length > 0) {
        spec += `- [ ] Column count (${s.layout.columns}) accommodates ${activeComps.length} component(s)\n`
      }
      if (s.layout?.gap) {
        spec += `- [ ] Component gap: ${s.layout.gap}\n`
      }

      spec += `- [ ] All interactive elements are keyboard-accessible\n`
      spec += `- [ ] Semantic HTML elements used (section, nav, article as appropriate)\n`

      spec += `\n---\n\n`
    }
  }

  // --- Appendix: Coverage ---
  spec += `## Appendix: Coverage Summary\n\n`
  spec += `| Metric | Value |\n`
  spec += `|--------|-------|\n`
  spec += `| Active sections | ${enabled.length} |\n`
  spec += `| Active components | ${totalComponents} |\n`
  spec += `| Section types used | ${[...new Set(enabled.map((s) => s.type))].length} |\n`
  spec += `| Categories covered | ${FEATURE_CATEGORIES.filter((cat) => enabled.some((s) => cat.types.includes(s.type))).length} / ${FEATURE_CATEGORIES.length} |\n`

  const priorityCounts = { P0: 0, P1: 0, P2: 0 }
  for (const s of enabled) {
    const p = getSectionPriority(s.type)
    priorityCounts[p]++
  }
  spec += `| P0 (Critical) features | ${priorityCounts.P0} |\n`
  spec += `| P1 (Important) features | ${priorityCounts.P1} |\n`
  spec += `| P2 (Enhancement) features | ${priorityCounts.P2} |\n`

  return spec
}

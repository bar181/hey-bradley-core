/**
 * P23 Sprint B Phase 1 — Template Registry.
 *
 * Three first-class templates. Each runs BEFORE the LLM call in chatPipeline.
 * On match: patches apply directly, $0 LLM cost, audit recorded as
 * source='template' in chat_messages.
 *
 * Templates differ from fixtures (step-2.ts):
 *   - Fixtures: DEV-only LLM proxy via FixtureAdapter interface
 *   - Templates: production-ready chatPipeline short-circuit (no LLM call)
 *
 * Registry is intentionally TINY (3 entries). Sprint B Phase 2 (P24) adds
 * section targeting (`/hero-1` syntax). Sprint B Phase 3 (P25) adds intent
 * translation. Sprint C (P26-P28) bridges to AISP-driven template selection.
 */

import { findSectionByType, heroHeadingPath } from '@/data/llm-fixtures/resolvePath'
import { resolveScopedSectionIndex } from './scoping'
import type { Template } from './types'

const ACCENT_PATH_DEFAULT = '/theme/palette/accentPrimary'
const BG_SECONDARY_PATH_DEFAULT = '/theme/palette/bgSecondary'

/**
 * Template 1 — "make it brighter" / "brighten" — bumps theme accent + bgSecondary
 * toward a brighter shade. Uses fixed brighter-cream palette per design tokens.
 */
const MAKE_IT_BRIGHTER: Template = {
  id: 'make-it-brighter',
  label: 'Brighten theme',
  description: 'Lighten the page background and accent for a sunnier feel.',
  matchPattern: /^\s*(?:make\s+(?:it\s+|the\s+(?:page|site|theme)\s+)?brighter|brighten\s+(?:it|the\s+(?:page|site|theme))?)\s*[!.?]*\s*$/i,
  envelope: () => ({
    patches: [
      // brighter cream + warmer accent
      { op: 'replace', path: ACCENT_PATH_DEFAULT, value: '#f59455' },
      { op: 'replace', path: BG_SECONDARY_PATH_DEFAULT, value: '#fef9f3' },
    ],
    summary: 'Brightened theme: warmer accent + lighter surface.',
  }),
}

/**
 * Template 2 — "hide the hero" / "hide the footer" / "hide the blog" — toggles
 * `enabled: false` on the matched section. Returns friendly empty-patch when
 * section absent from active config.
 */
const HIDE_SECTION: Template = {
  id: 'hide-section',
  label: 'Hide section',
  description: 'Hide a top-level section (hero / blog / footer / features / etc). Honors /type-N scoping.',
  matchPattern: /^\s*hide(?:\s+the)?(?:\s+([a-z-]+))?\s*[!.?]*\s*$/i,
  envelope: ({ match, config, scope }) => {
    // P24: scope (from /type-N parser) wins over regex-captured type.
    // When neither scope nor type captured, surface friendly help.
    const targetType = scope?.type ?? (match[1] ? match[1].toLowerCase() : null)
    if (!targetType) {
      return {
        patches: [],
        summary: `I need to know which section to hide. Try: hide the hero, hide /footer, hide /blog-2.`,
      }
    }
    const sectionIdx = scope
      ? resolveScopedSectionIndex(config, scope)
      : findSectionByType(config, targetType)
    if (sectionIdx < 0) {
      const scopeStr = scope?.index !== null && scope?.index !== undefined
        ? `${targetType}-${scope.index + 1}`
        : targetType
      return {
        patches: [],
        summary: `I can't find a "${scopeStr}" section to hide. Try: hide the hero / hide the footer / hide /blog-2.`,
      }
    }
    const scopeSuffix = scope?.index !== null && scope?.index !== undefined
      ? ` (#${scope.index + 1})`
      : ''
    return {
      patches: [
        { op: 'replace', path: `/sections/${sectionIdx}/enabled`, value: false },
      ],
      summary: `Hid the ${targetType} section${scopeSuffix}.`,
    }
  },
}

/**
 * Template 3 — "change the headline to X" / "set the headline to X" — replaces
 * the hero heading text. Resolves via heroHeadingPath (active-config aware).
 */
const CHANGE_HEADLINE: Template = {
  id: 'change-headline',
  label: 'Change headline',
  description: "Replace the hero heading with new text. Honors /hero-N scoping.",
  matchPattern: /^\s*(?:change|set|update)(?:\s+the)?(?:\s+headline)?\s+to\s+["']?(.+?)["']?\s*[!.?]*\s*$/i,
  envelope: ({ match, config, scope }) => {
    const text = match[1].trim()
    let path: string | null = null
    if (scope) {
      const sectionIdx = resolveScopedSectionIndex(config, scope)
      if (sectionIdx >= 0) {
        const components = config.sections[sectionIdx]?.components ?? []
        const headingIdx = components.findIndex((c) => c.type === 'heading')
        if (headingIdx >= 0) {
          path = `/sections/${sectionIdx}/components/${headingIdx}/props/text`
        }
      }
    } else {
      path = heroHeadingPath(config)
    }
    if (!path) {
      return {
        patches: [],
        summary: "I couldn't find a heading to update. Try: change the headline to 'X' / change /hero-2 to 'X'.",
      }
    }
    return {
      patches: [{ op: 'replace', path, value: text }],
      summary: `Changed headline to "${text}".`,
    }
  },
}

/**
 * Template 4 — P33 Sprint D close — first `kind: 'generator'` template.
 *
 * Matches "rewrite the headline", "regenerate hero copy", "make the headline
 * more <tone>", or "rewrite headline with our brand voice". The envelope is
 * filled by the 2-step pipeline (P33 / ADR-062) which calls `generateContent`
 * to produce the new copy. The envelope here is a STUB — when invoked
 * directly (legacy template router), it returns a friendly help message.
 *
 * Generators differ from patchers: they require LLM/algorithmic content
 * generation BEFORE patches can be produced. The 2-step pipeline detects
 * `template.kind === 'generator'` and routes accordingly.
 */
const GENERATE_HEADLINE: Template = {
  id: 'generate-headline',
  label: 'Rewrite headline',
  description:
    'Rewrite or regenerate the hero headline with a new tone (bold/playful/warm/authoritative). Honors /hero-N scoping.',
  matchPattern:
    /^\s*(?:rewrite|regenerate|generate(?:\s+a)?(?:\s+new)?)\s+(?:the\s+)?(?:headline|hero(?:\s+copy)?)\b.*$/i,
  category: 'content',
  examples: [
    'rewrite the headline',
    'regenerate hero copy',
    'rewrite headline with brand voice',
    'rewrite the headline more bold',
  ],
  kind: 'generator',
  envelope: () => ({
    patches: [],
    summary:
      'Generator templates need to run through the 2-step pipeline. Try the chat instead of direct routing.',
  }),
}

export const TEMPLATE_REGISTRY: readonly Template[] = [
  MAKE_IT_BRIGHTER,
  HIDE_SECTION,
  CHANGE_HEADLINE,
  GENERATE_HEADLINE,
] as const
